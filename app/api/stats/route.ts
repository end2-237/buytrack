import { NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import { execSync } from 'child_process';

// Lecture de /proc/net/dev — donne les bytes reçus/envoyés par interface
function readNetDev(): Record<string, { rx: number; tx: number }> {
  const raw = readFileSync('/proc/net/dev', 'utf8');
  const result: Record<string, { rx: number; tx: number }> = {};
  for (const line of raw.split('\n').slice(2)) {
    const parts = line.trim().split(/\s+/);
    if (parts.length < 10) continue;
    const iface = parts[0].replace(':', '');
    if (iface === 'lo') continue; // ignorer loopback
    result[iface] = {
      rx: parseInt(parts[1]),  // bytes reçus
      tx: parseInt(parts[9]),  // bytes envoyés
    };
  }
  return result;
}

// Cache de la dernière lecture pour calculer le débit
let lastSnapshot: { time: number; data: Record<string, { rx: number; tx: number }> } | null = null;
const history: { time: string; download: number; upload: number }[] = [];

function getPing(): number {
  try {
    const out = execSync('ping -c 1 -W 1 8.8.8.8 2>/dev/null', { timeout: 2000 }).toString();
    const match = out.match(/time=([\d.]+)/);
    return match ? parseFloat(match[1]) : 0;
  } catch {
    return 0;
  }
}

// Détecte l'interface principale (celle avec le plus de trafic)
function mainInterface(data: Record<string, { rx: number; tx: number }>): string {
  let best = '';
  let bestTotal = 0;
  for (const [iface, vals] of Object.entries(data)) {
    const total = vals.rx + vals.tx;
    if (total > bestTotal) { bestTotal = total; best = iface; }
  }
  return best;
}

export async function GET() {
  if (!existsSync('/proc/net/dev')) {
    return NextResponse.json({ error: 'Non-Linux system' }, { status: 501 });
  }

  const now = Date.now();
  const current = readNetDev();
  const iface = mainInterface(current);

  let dlMbps = 0;
  let ulMbps = 0;
  let totalDownloadMB = 0;
  let totalUploadMB = 0;

  if (iface && current[iface]) {
    totalDownloadMB = current[iface].rx / (1024 * 1024);
    totalUploadMB = current[iface].tx / (1024 * 1024);

    if (lastSnapshot && lastSnapshot.data[iface]) {
      const dt = (now - lastSnapshot.time) / 1000; // secondes
      if (dt > 0.1) {
        const rxDiff = current[iface].rx - lastSnapshot.data[iface].rx;
        const txDiff = current[iface].tx - lastSnapshot.data[iface].tx;
        dlMbps = Math.max(0, (rxDiff * 8) / (dt * 1_000_000));
        ulMbps = Math.max(0, (txDiff * 8) / (dt * 1_000_000));
      }
    }
  }

  // Mise à jour du snapshot
  lastSnapshot = { time: now, data: current };

  // Historique pour le graphique (garde 24 points)
  const timeLabel = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  history.push({ time: timeLabel, download: Math.round(dlMbps * 10) / 10, upload: Math.round(ulMbps * 10) / 10 });
  if (history.length > 24) history.shift();

  const ping = getPing();

  return NextResponse.json({
    iface,
    dlMbps: Math.round(dlMbps * 10) / 10,
    ulMbps: Math.round(ulMbps * 10) / 10,
    ping,
    totalDownloadMB: Math.round(totalDownloadMB),
    totalUploadMB: Math.round(totalUploadMB),
    history: [...history],
    allInterfaces: Object.entries(current).map(([name, v]) => ({
      name,
      rxMB: Math.round(v.rx / (1024 * 1024)),
      txMB: Math.round(v.tx / (1024 * 1024)),
    })),
  });
}
