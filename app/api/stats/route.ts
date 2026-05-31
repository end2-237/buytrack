import { NextResponse } from 'next/server';
import { execSync } from 'child_process';

type Snapshot = {
  time: number;
  adapters: Record<string, { rx: number; tx: number }>;
};

let lastSnapshot: Snapshot | null = null;
const history: { time: string; download: number; upload: number }[] = [];

function getWindowsAdapterStats(): Record<string, { rx: number; tx: number }> {
  const ps = `Get-NetAdapterStatistics | Where-Object {$_.ReceivedBytes -gt 0} | Select-Object Name, ReceivedBytes, SentBytes | ConvertTo-Json`;
  const out = execSync(`powershell -NoProfile -Command "${ps}"`, { timeout: 5000 }).toString().trim();
  const parsed = JSON.parse(out);
  const items = Array.isArray(parsed) ? parsed : [parsed];
  const result: Record<string, { rx: number; tx: number }> = {};
  for (const item of items) {
    result[item.Name] = { rx: item.ReceivedBytes, tx: item.SentBytes };
  }
  return result;
}

function getWindowsPing(): number {
  try {
    const out = execSync('ping -n 1 8.8.8.8', { timeout: 3000 }).toString();
    // Format: "Moyenne = 12ms" (FR) or "Average = 12ms" (EN)
    const match = out.match(/[=<]\s*(\d+)\s*ms/i);
    return match ? parseInt(match[1]) : 0;
  } catch {
    return 0;
  }
}

function mainAdapter(data: Record<string, { rx: number; tx: number }>): string {
  let best = '';
  let bestTotal = 0;
  for (const [name, v] of Object.entries(data)) {
    const total = v.rx + v.tx;
    if (total > bestTotal) { bestTotal = total; best = name; }
  }
  return best;
}

export async function GET() {
  try {
    const now = Date.now();
    const current = getWindowsAdapterStats();
    const iface = mainAdapter(current);

    let dlMbps = 0;
    let ulMbps = 0;

    if (iface && current[iface] && lastSnapshot?.adapters[iface]) {
      const dt = (now - lastSnapshot.time) / 1000;
      if (dt > 0.1) {
        const rxDiff = current[iface].rx - lastSnapshot.adapters[iface].rx;
        const txDiff = current[iface].tx - lastSnapshot.adapters[iface].tx;
        dlMbps = Math.max(0, (rxDiff * 8) / (dt * 1_000_000));
        ulMbps = Math.max(0, (txDiff * 8) / (dt * 1_000_000));
      }
    }

    lastSnapshot = { time: now, adapters: current };

    const timeLabel = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    history.push({ time: timeLabel, download: Math.round(dlMbps * 10) / 10, upload: Math.round(ulMbps * 10) / 10 });
    if (history.length > 24) history.shift();

    const ping = getWindowsPing();

    const totalDownloadMB = iface ? Math.round(current[iface].rx / (1024 * 1024)) : 0;
    const totalUploadMB = iface ? Math.round(current[iface].tx / (1024 * 1024)) : 0;

    return NextResponse.json({
      iface,
      dlMbps: Math.round(dlMbps * 10) / 10,
      ulMbps: Math.round(ulMbps * 10) / 10,
      ping,
      totalDownloadMB,
      totalUploadMB,
      history: [...history],
      allInterfaces: Object.entries(current).map(([name, v]) => ({
        name,
        rxMB: Math.round(v.rx / (1024 * 1024)),
        txMB: Math.round(v.tx / (1024 * 1024)),
      })),
    });
  } catch (e: any) {
    return NextResponse.json({ error: `Windows API error: ${e.message}` }, { status: 500 });
  }
}
