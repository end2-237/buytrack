import { NextResponse } from 'next/server';
import { execSync } from 'child_process';

type Snapshot = { time: number; rx: number; tx: number };
let last: Snapshot | null = null;
const history: { time: string; download: number; upload: number }[] = [];

// netstat -e — toujours disponible sur Windows, pas besoin de droits admin
function readNetstatE(): { rx: number; tx: number } {
  const out = execSync('netstat -e', { timeout: 4000, encoding: 'utf8' });
  for (const line of out.split('\n')) {
    const t = line.trim();
    // Anglais: "Bytes  1234  5678"  /  Français: "Octets  1234  5678"
    if (/^(bytes|octets)/i.test(t)) {
      const parts = t.split(/\s+/);
      if (parts.length >= 3) {
        const rx = parseInt(parts[1].replace(/[^0-9]/g, '')) || 0;
        const tx = parseInt(parts[2].replace(/[^0-9]/g, '')) || 0;
        if (rx > 0 || tx > 0) return { rx, tx };
      }
    }
  }
  return { rx: 0, tx: 0 };
}

function getPing(): number {
  try {
    // -w 1000 = timeout 1s, -n 1 = 1 paquet
    const out = execSync('ping -n 1 -w 1000 8.8.8.8', { timeout: 3000, encoding: 'utf8' });
    const m = out.match(/[=<]\s*(\d+)\s*ms/i);
    return m ? parseInt(m[1]) : 0;
  } catch {
    return 0;
  }
}

export async function GET() {
  try {
    const now = Date.now();
    const { rx, tx } = readNetstatE();

    let dlMbps = 0;
    let ulMbps = 0;

    if (last && last.rx > 0) {
      const dt = (now - last.time) / 1000;
      if (dt > 0.1 && rx >= last.rx && tx >= last.tx) {
        dlMbps = Math.max(0, ((rx - last.rx) * 8) / (dt * 1_000_000));
        ulMbps = Math.max(0, ((tx - last.tx) * 8) / (dt * 1_000_000));
      }
    }
    last = { time: now, rx, tx };

    const ping = getPing();

    const label = new Date().toLocaleTimeString('fr-FR', {
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    });
    history.push({
      time: label,
      download: Math.round(dlMbps * 10) / 10,
      upload: Math.round(ulMbps * 10) / 10,
    });
    if (history.length > 48) history.shift();

    return NextResponse.json({
      iface: 'Réseau',
      dlMbps: Math.round(dlMbps * 10) / 10,
      ulMbps: Math.round(ulMbps * 10) / 10,
      ping,
      totalDownloadMB: Math.round(rx / (1024 * 1024)),
      totalUploadMB: Math.round(tx / (1024 * 1024)),
      history: [...history],
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
