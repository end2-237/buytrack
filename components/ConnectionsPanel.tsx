'use client';

import { useEffect, useState } from 'react';
import { Globe, RefreshCw, Unplug, Lock, Unlock } from 'lucide-react';
import type { Connection } from '@/app/api/connections/route';

export default function ConnectionsPanel() {
  const [conns, setConns] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  async function fetchConns() {
    try {
      const res = await fetch('/api/connections');
      const data = await res.json();
      if (data.error && !data.connections?.length) {
        setError(data.error);
      } else {
        setError(null);
        setConns(data.connections ?? []);
        setLastUpdate(new Date().toLocaleTimeString('fr-FR'));
      }
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchConns();
    const interval = setInterval(fetchConns, 8000);
    return () => clearInterval(interval);
  }, []);

  // Groupe par processus
  const byProcess = conns.reduce<Record<string, Connection[]>>((acc, c) => {
    if (!acc[c.processName]) acc[c.processName] = [];
    acc[c.processName].push(c);
    return acc;
  }, {});

  return (
    <div
      className="rounded-xl"
      style={{ padding: 24, background: 'var(--surface)', border: '1px solid var(--border)', minWidth: 0 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
        <div>
          <div className="flex items-center gap-2">
            <Globe size={14} style={{ color: 'var(--cyan)', flexShrink: 0 }} />
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)' }}>
              Connexions actives
            </span>
            {conns.length > 0 && (
              <span className="rounded px-2 py-0.5" style={{
                fontSize: 9, fontWeight: 700, letterSpacing: '0.08em',
                background: 'rgba(16,185,129,0.1)', color: 'var(--green)',
                border: '1px solid rgba(16,185,129,0.2)',
              }}>
                LIVE
              </span>
            )}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 2 }}>
            {lastUpdate ? `Mis à jour à ${lastUpdate}` : 'Sites et services connectés en ce moment'}
          </div>
        </div>
        <button
          onClick={fetchConns}
          className="flex items-center justify-center rounded-lg transition-colors"
          style={{ width: 32, height: 32, background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text-2)' }}
          title="Actualiser"
        >
          <RefreshCw size={13} />
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col gap-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="shimmer rounded-lg" style={{ height: 44, background: 'var(--surface-2)' }} />
          ))}
        </div>
      )}

      {/* Error / empty */}
      {!loading && (error || conns.length === 0) && (
        <div className="flex flex-col items-center justify-center" style={{ padding: '32px 0', gap: 12 }}>
          <div className="flex items-center justify-center rounded-xl"
            style={{ width: 44, height: 44, background: 'rgba(100,116,139,0.08)', border: '1px solid var(--border)', color: 'var(--text-2)' }}>
            <Unplug size={18} />
          </div>
          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-2)' }}>
            Aucune connexion web active
          </div>
          {error && (
            <div style={{ fontSize: 11, color: 'var(--text-3)', textAlign: 'center', maxWidth: 280, lineHeight: 1.6 }}>
              {error.includes('not recognized') || error.includes('access')
                ? 'Lance l\'app en tant qu\'Administrateur pour accéder aux connexions réseau.'
                : error}
            </div>
          )}
        </div>
      )}

      {/* Connexions groupées par processus */}
      {!loading && conns.length > 0 && (
        <div className="flex flex-col" style={{ gap: 12 }}>
          {Object.entries(byProcess).map(([proc, list]) => (
            <div key={proc}>
              {/* Process header */}
              <div className="flex items-center gap-2" style={{ marginBottom: 4, padding: '0 4px' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: list[0].color, flexShrink: 0 }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-1)', letterSpacing: '0.04em' }}>
                  {proc}
                </span>
                <span style={{ fontSize: 10, color: 'var(--text-3)' }}>
                  {list.length} connexion{list.length > 1 ? 's' : ''}
                </span>
              </div>

              {/* Lignes */}
              <div className="flex flex-col rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                {list.map((c, i) => (
                  <div
                    key={c.id}
                    className="flex items-center gap-3 transition-colors"
                    style={{
                      padding: '10px 14px',
                      borderTop: i > 0 ? '1px solid var(--border)' : 'none',
                      background: 'var(--surface-2)',
                      minHeight: 40,
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--surface)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--surface-2)'; }}
                  >
                    {/* Protocol badge */}
                    <div
                      className="flex items-center gap-1 rounded flex-shrink-0"
                      style={{
                        padding: '2px 6px',
                        fontSize: 9, fontWeight: 700, letterSpacing: '0.06em',
                        background: c.protocol === 'HTTPS' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                        color: c.protocol === 'HTTPS' ? 'var(--green)' : 'var(--amber)',
                        border: `1px solid ${c.protocol === 'HTTPS' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)'}`,
                      }}
                    >
                      {c.protocol === 'HTTPS' ? <Lock size={8} /> : <Unlock size={8} />}
                      <span>{c.protocol}</span>
                    </div>

                    {/* Domain */}
                    <span
                      style={{
                        flex: 1,
                        fontSize: 12, fontWeight: 500, color: 'var(--text-1)',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}
                      title={c.domain}
                    >
                      {c.domain}
                    </span>

                    {/* IP + port */}
                    <span
                      style={{ fontSize: 10, color: 'var(--text-3)', flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}
                    >
                      {c.ip}:{c.port}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Note */}
      {!loading && conns.length > 0 && (
        <div className="rounded-lg" style={{
          marginTop: 12, padding: '10px 14px',
          background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.1)',
        }}>
          <div style={{ fontSize: 10, color: 'var(--text-2)', lineHeight: 1.6 }}>
            Seules les connexions HTTP/HTTPS (ports 80, 443) sont affichées. Pour voir les noms de domaine exacts, lance l'app en tant qu'Administrateur.
          </div>
        </div>
      )}
    </div>
  );
}
