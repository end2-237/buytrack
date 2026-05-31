export type HistoryPoint = { time: string; download: number; upload: number };
export type SessionTotals = { dl: number; ul: number };

const HISTORY_KEY = 'buytrack_history';
const SESSION_KEY = 'buytrack_session';
const MAX_POINTS = 48;

export function saveHistory(points: HistoryPoint[]): void {
  if (typeof window === 'undefined') return;
  try {
    const trimmed = points.slice(-MAX_POINTS);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
  } catch {}
}

export function loadHistory(): HistoryPoint[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as HistoryPoint[];
  } catch {}
  return [];
}

export function saveSession(dl: number, ul: number): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ dl, ul }));
  } catch {}
}

export function loadSession(): SessionTotals {
  if (typeof window === 'undefined') return { dl: 0, ul: 0 };
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return { dl: 0, ul: 0 };
    const parsed = JSON.parse(raw);
    if (typeof parsed?.dl === 'number' && typeof parsed?.ul === 'number') {
      return parsed as SessionTotals;
    }
  } catch {}
  return { dl: 0, ul: 0 };
}
