import { NextResponse } from 'next/server';
import { execSync } from 'child_process';
import { resolve } from 'dns/promises';

export type Connection = {
  id: string;
  domain: string;
  ip: string;
  port: number;
  protocol: 'HTTPS' | 'HTTP' | 'Other';
  processName: string;
  processId: string;
  color: string;
};

const APP_COLORS: Record<string, string> = {
  chrome: '#4285f4', msedge: '#0078d4', firefox: '#ff6611',
  opera: '#ff1b2d', brave: '#fb542b',
  discord: '#5865f2', slack: '#4a154b', teams: '#6264a7', zoom: '#2d8cff',
  spotify: '#1db954', steam: '#1b2838',
  node: '#68a063', python: '#3776ab',
  onedrive: '#0078d4', dropbox: '#0061ff',
};

function getColor(name: string): string {
  const lower = name.toLowerCase();
  for (const [k, c] of Object.entries(APP_COLORS)) {
    if (lower.includes(k)) return c;
  }
  let h = 0;
  for (const ch of lower) h = ch.charCodeAt(0) + ((h << 5) - h);
  const palette = ['#00d4ff', '#7c3aed', '#f59e0b', '#10b981', '#ef4444', '#ec4899'];
  return palette[Math.abs(h) % palette.length];
}

// Cache de résolution DNS (évite d'appeler nslookup à chaque fois)
const dnsCache = new Map<string, string>();

async function reverseDns(ip: string): Promise<string> {
  if (dnsCache.has(ip)) return dnsCache.get(ip)!;
  // Filtre les IPs privées
  if (/^(10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|127\.|::1|fd)/.test(ip)) {
    dnsCache.set(ip, ip);
    return ip;
  }
  try {
    // Utilise PowerShell pour résoudre rapidement
    const out = execSync(
      `powershell -NoProfile -Command "[System.Net.Dns]::GetHostEntry('${ip}').HostName"`,
      { timeout: 1500, encoding: 'utf8' }
    ).trim();
    const domain = out || ip;
    dnsCache.set(ip, domain);
    return domain;
  } catch {
    dnsCache.set(ip, ip);
    return ip;
  }
}

export async function GET() {
  try {
    // PowerShell : connexions HTTPS/HTTP établies avec nom de processus
    const ps = `Get-NetTCPConnection -State Established -ErrorAction SilentlyContinue | Where-Object {$_.RemotePort -in @(80,443,8080,8443,8000)} | Select-Object RemoteAddress, RemotePort, OwningProcess | ConvertTo-Json`;
    const raw = execSync(`powershell -NoProfile -Command "${ps}"`, {
      timeout: 6000,
      encoding: 'utf8',
    }).trim();

    if (!raw || raw === 'null') return NextResponse.json({ connections: [] });

    const parsed = JSON.parse(raw);
    const items: any[] = Array.isArray(parsed) ? parsed : [parsed];

    // Nom des processus
    const pidsStr = [...new Set(items.map(i => i.OwningProcess))].join(',');
    let procMap: Record<string, string> = {};
    try {
      const pps = `Get-Process -Id @(${pidsStr}) -ErrorAction SilentlyContinue | Select-Object Id, Name | ConvertTo-Json`;
      const praw = execSync(`powershell -NoProfile -Command "${pps}"`, { timeout: 4000, encoding: 'utf8' }).trim();
      const procs: any[] = Array.isArray(JSON.parse(praw)) ? JSON.parse(praw) : [JSON.parse(praw)];
      for (const p of procs) procMap[String(p.Id)] = p.Name;
    } catch {}

    // Déduplique par IP + process
    const seen = new Set<string>();
    const unique = items.filter(i => {
      const key = `${i.RemoteAddress}:${i.RemotePort}:${i.OwningProcess}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // Résolution DNS en parallèle (max 15 connexions)
    const top = unique.slice(0, 15);
    const resolved = await Promise.all(
      top.map(async (item, idx) => {
        const domain = await reverseDns(item.RemoteAddress);
        const proc = procMap[String(item.OwningProcess)] || 'unknown';
        const port = item.RemotePort as number;
        return {
          id: `${idx}`,
          domain: domain !== item.RemoteAddress ? domain : item.RemoteAddress,
          ip: item.RemoteAddress,
          port,
          protocol: port === 443 || port === 8443 ? 'HTTPS' : port === 80 || port === 8080 ? 'HTTP' : 'Other',
          processName: proc,
          processId: String(item.OwningProcess),
          color: getColor(proc),
        } satisfies Connection;
      })
    );

    return NextResponse.json({ connections: resolved });
  } catch (e: any) {
    return NextResponse.json({ connections: [], error: e.message });
  }
}
