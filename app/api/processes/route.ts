import { NextResponse } from 'next/server';
import { readdirSync, readFileSync, existsSync } from 'fs';

type ProcessNet = {
  pid: string;
  name: string;
  rxBytes: number;
  txBytes: number;
  connections: number;
};

// Lit les stats réseau d'un processus via /proc/[pid]/net/dev
function readProcNetDev(pid: string): { rx: number; tx: number } {
  try {
    const path = `/proc/${pid}/net/dev`;
    if (!existsSync(path)) return { rx: 0, tx: 0 };
    const raw = readFileSync(path, 'utf8');
    let rx = 0; let tx = 0;
    for (const line of raw.split('\n').slice(2)) {
      const parts = line.trim().split(/\s+/);
      if (parts.length < 10) continue;
      const iface = parts[0].replace(':', '');
      if (iface === 'lo') continue;
      rx += parseInt(parts[1]) || 0;
      tx += parseInt(parts[9]) || 0;
    }
    return { rx, tx };
  } catch {
    return { rx: 0, tx: 0 };
  }
}

function getProcessName(pid: string): string {
  try {
    return readFileSync(`/proc/${pid}/comm`, 'utf8').trim();
  } catch {
    return 'unknown';
  }
}

function countConnections(pid: string): number {
  try {
    const fdDir = `/proc/${pid}/fd`;
    if (!existsSync(fdDir)) return 0;
    const fds = readdirSync(fdDir);
    return fds.length; // approximation
  } catch {
    return 0;
  }
}

// Couleurs par catégorie d'app
const APP_COLORS: Record<string, string> = {
  firefox: '#ff6611', chrome: '#4285f4', chromium: '#4285f4',
  node: '#68a063', python3: '#3776ab', python: '#3776ab',
  spotify: '#1db954', discord: '#5865f2', slack: '#4a154b',
  code: '#007acc', cursor: '#007acc', vim: '#009900',
  wget: '#00d4ff', curl: '#00d4ff', git: '#f05032',
  ssh: '#7b2fff', docker: '#2496ed', npm: '#cb3837',
};

function getColor(name: string): string {
  const lower = name.toLowerCase();
  for (const [key, color] of Object.entries(APP_COLORS)) {
    if (lower.includes(key)) return color;
  }
  return '#6b8fa8';
}

export async function GET() {
  if (!existsSync('/proc')) {
    return NextResponse.json({ processes: [] });
  }

  try {
    const pids = readdirSync('/proc').filter(p => /^\d+$/.test(p));
    const results: ProcessNet[] = [];

    for (const pid of pids) {
      const { rx, tx } = readProcNetDev(pid);
      // On ne garde que les processus avec activité réseau
      if (rx === 0 && tx === 0) continue;
      const name = getProcessName(pid);
      if (name === 'unknown') continue;
      results.push({
        pid,
        name,
        rxBytes: rx,
        txBytes: tx,
        connections: countConnections(pid),
      });
    }

    // Tri par trafic total décroissant, top 15
    const sorted = results
      .sort((a, b) => (b.rxBytes + b.txBytes) - (a.rxBytes + a.txBytes))
      .slice(0, 15)
      .map(p => ({
        id: p.pid,
        name: p.name,
        icon: '◉',
        category: 'Process',
        download: Math.round(p.rxBytes / (1024 * 1024)),
        upload: Math.round(p.txBytes / (1024 * 1024)),
        sessions: p.connections,
        color: getColor(p.name),
        trend: 0,
      }));

    return NextResponse.json({ processes: sorted });
  } catch {
    return NextResponse.json({ processes: [] });
  }
}
