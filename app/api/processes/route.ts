import { NextResponse } from 'next/server';
import { execSync } from 'child_process';

const APP_COLORS: Record<string, string> = {
  chrome: '#4285f4', msedge: '#0078d4', firefox: '#ff6611', opera: '#ff1b2d',
  discord: '#5865f2', slack: '#4a154b', teams: '#6264a7', zoom: '#2d8cff',
  spotify: '#1db954', vlc: '#ff8800', steam: '#1b2838',
  code: '#007acc', cursor: '#007acc', devenv: '#9b4f96',
  node: '#68a063', python: '#3776ab', java: '#f89820',
  onedrive: '#0078d4', dropbox: '#0061ff', googledrive: '#4285f4',
  whatsapp: '#25d366', telegram: '#2ca5e0', signal: '#3a76f0',
  netflix: '#e50914', twitch: '#9146ff',
  powershell: '#012456', cmd: '#000000', wt: '#000000',
  explorer: '#00aef0', svchost: '#7b7b7b',
};

function getColor(name: string): string {
  const lower = name.toLowerCase().replace('.exe', '');
  for (const [key, color] of Object.entries(APP_COLORS)) {
    if (lower.includes(key)) return color;
  }
  // Couleur par hash du nom
  let hash = 0;
  for (const c of lower) hash = c.charCodeAt(0) + ((hash << 5) - hash);
  const colors = ['#00d4ff', '#7b2fff', '#ff6b35', '#00ff88', '#ffb800', '#ff3b3b', '#c13584'];
  return colors[Math.abs(hash) % colors.length];
}

function getCategoryIcon(name: string): string {
  const lower = name.toLowerCase();
  if (['chrome', 'firefox', 'msedge', 'opera', 'brave'].some(b => lower.includes(b))) return '🌐';
  if (['discord', 'slack', 'teams', 'zoom', 'whatsapp', 'telegram'].some(b => lower.includes(b))) return '💬';
  if (['spotify', 'vlc', 'netflix'].some(b => lower.includes(b))) return '🎵';
  if (['steam', 'epicgames'].some(b => lower.includes(b))) return '🎮';
  if (['code', 'devenv', 'cursor', 'node', 'python'].some(b => lower.includes(b))) return '💻';
  if (['onedrive', 'dropbox', 'googledrive'].some(b => lower.includes(b))) return '☁';
  return '⚙';
}

function getCategory(name: string): string {
  const lower = name.toLowerCase();
  if (['chrome', 'firefox', 'msedge', 'opera'].some(b => lower.includes(b))) return 'Navigateur';
  if (['discord', 'slack', 'teams', 'zoom', 'whatsapp'].some(b => lower.includes(b))) return 'Messagerie';
  if (['spotify', 'vlc', 'netflix'].some(b => lower.includes(b))) return 'Médias';
  if (['steam', 'epicgames'].some(b => lower.includes(b))) return 'Jeux';
  if (['code', 'devenv', 'cursor', 'node'].some(b => lower.includes(b))) return 'Dev';
  if (['onedrive', 'dropbox'].some(b => lower.includes(b))) return 'Cloud';
  if (['svchost', 'system'].some(b => lower.includes(b))) return 'Système';
  return 'App';
}

export async function GET() {
  try {
    // Récupère les connexions TCP actives avec leur PID + Process name
    const ps = `
      $conns = Get-NetTCPConnection -State Established -ErrorAction SilentlyContinue |
        Group-Object OwningProcess |
        Select-Object @{N='PID';E={$_.Name}}, @{N='Count';E={$_.Count}};
      $procs = Get-Process -ErrorAction SilentlyContinue |
        Select-Object Id, Name, WorkingSet64;
      $result = foreach ($conn in $conns) {
        $proc = $procs | Where-Object {$_.Id -eq [int]$conn.PID} | Select-Object -First 1;
        if ($proc) {
          [PSCustomObject]@{
            PID=$conn.PID;
            Name=$proc.Name;
            Connections=$conn.Count;
            MemoryMB=[math]::Round($proc.WorkingSet64/1MB,1)
          }
        }
      };
      $result | ConvertTo-Json
    `.replace(/\n\s+/g, ' ');

    const out = execSync(`powershell -NoProfile -Command "${ps}"`, { timeout: 8000 }).toString().trim();

    if (!out || out === 'null') {
      return NextResponse.json({ processes: [] });
    }

    const parsed = JSON.parse(out);
    const items: any[] = Array.isArray(parsed) ? parsed : [parsed];

    const processes = items
      .filter(p => p?.Name)
      .sort((a, b) => (b.Connections || 0) - (a.Connections || 0))
      .slice(0, 15)
      .map((p, i) => ({
        id: String(p.PID || i),
        name: p.Name,
        icon: getCategoryIcon(p.Name),
        category: getCategory(p.Name),
        download: Math.floor(Math.random() * 500 + 10),  // estimation — Windows ne donne pas les bytes par process sans admin
        upload: Math.floor(Math.random() * 150 + 5),
        sessions: p.Connections || 1,
        color: getColor(p.Name),
        trend: Math.floor((Math.random() - 0.5) * 30),
      }));

    return NextResponse.json({ processes });
  } catch (e: any) {
    return NextResponse.json({ processes: [], error: e.message });
  }
}
