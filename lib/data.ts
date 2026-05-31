export type AppUsage = {
  id: string;
  name: string;
  icon: string;
  category: string;
  download: number; // MB
  upload: number;   // MB
  sessions: number;
  color: string;
  trend: number; // % change
};

export type Device = {
  id: string;
  name: string;
  type: 'phone' | 'laptop' | 'tablet' | 'tv' | 'router';
  ip: string;
  mac: string;
  os: string;
  status: 'online' | 'idle' | 'offline';
  totalDownload: number;
  totalUpload: number;
  lastSeen: string;
  signalStrength: number; // 0-100
  apps: AppUsage[];
};

export type TimelinePoint = {
  time: string;
  download: number;
  upload: number;
};

export const MY_APPS: AppUsage[] = [
  { id: '1', name: 'YouTube', icon: '▶', category: 'Streaming', download: 4820, upload: 120, sessions: 47, color: '#ff3b3b', trend: 12 },
  { id: '2', name: 'Netflix', icon: 'N', category: 'Streaming', download: 3940, upload: 80, sessions: 23, color: '#e50914', trend: -5 },
  { id: '3', name: 'Chrome', icon: '◉', category: 'Browser', download: 2150, upload: 380, sessions: 312, color: '#4285f4', trend: 8 },
  { id: '4', name: 'Spotify', icon: '♫', category: 'Music', download: 1200, upload: 20, sessions: 89, color: '#1db954', trend: 3 },
  { id: '5', name: 'WhatsApp', icon: '✉', category: 'Messaging', download: 680, upload: 340, sessions: 156, color: '#25d366', trend: -2 },
  { id: '6', name: 'Instagram', icon: '⬡', category: 'Social', download: 1450, upload: 290, sessions: 78, color: '#c13584', trend: 21 },
  { id: '7', name: 'Discord', icon: '◈', category: 'Messaging', download: 420, upload: 180, sessions: 67, color: '#5865f2', trend: 15 },
  { id: '8', name: 'Zoom', icon: '⊡', category: 'Video Call', download: 890, upload: 760, sessions: 12, color: '#2d8cff', trend: -8 },
  { id: '9', name: 'TikTok', icon: '♪', category: 'Social', download: 2300, upload: 95, sessions: 104, color: '#fe2c55', trend: 34 },
  { id: '10', name: 'Twitch', icon: '◆', category: 'Streaming', download: 1680, upload: 45, sessions: 18, color: '#9146ff', trend: 7 },
];

export const DEVICES: Device[] = [
  {
    id: 'self',
    name: 'Mon iPhone 15 Pro',
    type: 'phone',
    ip: '192.168.1.2',
    mac: 'A4:C3:F0:12:34:56',
    os: 'iOS 17.4',
    status: 'online',
    totalDownload: 19530,
    totalUpload: 2310,
    lastSeen: 'Maintenant',
    signalStrength: 95,
    apps: MY_APPS,
  },
  {
    id: 'd2',
    name: 'MacBook Pro M3',
    type: 'laptop',
    ip: '192.168.1.3',
    mac: 'B8:E8:56:78:9A:BC',
    os: 'macOS 14.4',
    status: 'online',
    totalDownload: 48200,
    totalUpload: 8900,
    lastSeen: 'Maintenant',
    signalStrength: 88,
    apps: [
      { id: 'l1', name: 'Safari', icon: '◎', category: 'Browser', download: 12400, upload: 2100, sessions: 540, color: '#006aff', trend: 5 },
      { id: 'l2', name: 'Slack', icon: '#', category: 'Messaging', download: 3200, upload: 1800, sessions: 234, color: '#4a154b', trend: -3 },
      { id: 'l3', name: 'VSCode', icon: '{}', category: 'Dev', download: 8900, upload: 3400, sessions: 89, color: '#007acc', trend: 9 },
      { id: 'l4', name: 'Figma', icon: '◐', category: 'Design', download: 6700, upload: 890, sessions: 45, color: '#f24e1e', trend: 18 },
      { id: 'l5', name: 'Docker', icon: '⬡', category: 'Dev', download: 12100, upload: 540, sessions: 23, color: '#2496ed', trend: 2 },
    ],
  },
  {
    id: 'd3',
    name: 'iPad Air',
    type: 'tablet',
    ip: '192.168.1.4',
    mac: 'C2:D4:E6:AB:CD:EF',
    os: 'iPadOS 17.3',
    status: 'idle',
    totalDownload: 8400,
    totalUpload: 920,
    lastSeen: 'Il y a 12 min',
    signalStrength: 72,
    apps: [
      { id: 't1', name: 'Netflix', icon: 'N', category: 'Streaming', download: 4200, upload: 60, sessions: 15, color: '#e50914', trend: -1 },
      { id: 't2', name: 'YouTube', icon: '▶', category: 'Streaming', download: 2800, upload: 40, sessions: 28, color: '#ff3b3b', trend: 6 },
      { id: 't3', name: 'GoodNotes', icon: '✎', category: 'Productivity', download: 420, upload: 180, sessions: 67, color: '#ff9500', trend: 0 },
    ],
  },
  {
    id: 'd4',
    name: 'Samsung TV 4K',
    type: 'tv',
    ip: '192.168.1.5',
    mac: 'D9:12:34:56:78:9A',
    os: 'Tizen 7.0',
    status: 'online',
    totalDownload: 22100,
    totalUpload: 340,
    lastSeen: 'Maintenant',
    signalStrength: 61,
    apps: [
      { id: 'tv1', name: 'Disney+', icon: '★', category: 'Streaming', download: 9800, upload: 120, sessions: 34, color: '#113ccf', trend: 12 },
      { id: 'tv2', name: 'Netflix', icon: 'N', category: 'Streaming', download: 7600, upload: 80, sessions: 28, color: '#e50914', trend: 4 },
      { id: 'tv3', name: 'Prime Video', icon: '►', category: 'Streaming', download: 4700, upload: 140, sessions: 19, color: '#00a8e0', trend: -7 },
    ],
  },
  {
    id: 'd5',
    name: 'Galaxy S24',
    type: 'phone',
    ip: '192.168.1.6',
    mac: 'E3:45:67:89:AB:CD',
    os: 'Android 14',
    status: 'offline',
    totalDownload: 5200,
    totalUpload: 1100,
    lastSeen: 'Il y a 3h',
    signalStrength: 0,
    apps: [
      { id: 'p1', name: 'TikTok', icon: '♪', category: 'Social', download: 2800, upload: 320, sessions: 89, color: '#fe2c55', trend: 28 },
      { id: 'p2', name: 'Chrome', icon: '◉', category: 'Browser', download: 1400, upload: 480, sessions: 145, color: '#4285f4', trend: 3 },
    ],
  },
];

export const TIMELINE_24H: TimelinePoint[] = Array.from({ length: 24 }, (_, i) => ({
  time: `${String(i).padStart(2, '0')}:00`,
  download: Math.floor(Math.random() * 800 + 100),
  upload: Math.floor(Math.random() * 200 + 20),
}));

export const TIMELINE_7D: TimelinePoint[] = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => ({
  time: day,
  download: Math.floor(Math.random() * 5000 + 2000),
  upload: Math.floor(Math.random() * 1200 + 400),
}));

export function formatBytes(mb: number): string {
  if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`;
  return `${mb.toFixed(0)} MB`;
}

export function getDeviceIcon(type: Device['type']): string {
  const icons: Record<Device['type'], string> = {
    phone: '📱',
    laptop: '💻',
    tablet: '⬛',
    tv: '📺',
    router: '📡',
  };
  return icons[type];
}

export const TOTAL_DOWNLOAD = DEVICES.reduce((s, d) => s + d.totalDownload, 0);
export const TOTAL_UPLOAD = DEVICES.reduce((s, d) => s + d.totalUpload, 0);
export const ACTIVE_DEVICES = DEVICES.filter(d => d.status !== 'offline').length;
