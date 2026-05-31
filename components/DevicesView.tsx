'use client';

import DeviceCard from './DeviceCard';
import { DEVICES, TOTAL_DOWNLOAD, TOTAL_UPLOAD, formatBytes } from '@/lib/data';

export default function DevicesView() {
  const online = DEVICES.filter(d => d.status === 'online');
  const idle = DEVICES.filter(d => d.status === 'idle');
  const offline = DEVICES.filter(d => d.status === 'offline');

  return (
    <div className="flex flex-col gap-6">
      <div className="fade-in-up">
        <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: -0.5 }}>Mes Appareils</div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
          {DEVICES.length} appareils détectés · {online.length} en ligne
        </div>
      </div>

      {/* Network summary */}
      <div
        className="glass rounded-2xl p-5 fade-in-up"
        style={{ border: '1px solid rgba(0,212,255,0.1)', animationDelay: '100ms' }}
      >
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>
          Consommation réseau totale · tous appareils
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#00d4ff' }}>{formatBytes(TOTAL_DOWNLOAD)}</div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>↓ Téléchargé</div>
          </div>
          <div style={{ borderLeft: '1px solid rgba(255,255,255,0.05)', paddingLeft: 24 }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#7b2fff' }}>{formatBytes(TOTAL_UPLOAD)}</div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>↑ Envoyé</div>
          </div>
          <div style={{ borderLeft: '1px solid rgba(255,255,255,0.05)', paddingLeft: 24 }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>
              {formatBytes(TOTAL_DOWNLOAD + TOTAL_UPLOAD)}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>Total combiné</div>
          </div>
        </div>

        {/* Per-device usage bars */}
        <div className="mt-4 flex gap-0.5 rounded-full overflow-hidden" style={{ height: 6 }}>
          {DEVICES.map(d => {
            const share = (d.totalDownload + d.totalUpload) / (TOTAL_DOWNLOAD + TOTAL_UPLOAD) * 100;
            const colors = ['#00d4ff', '#7b2fff', '#00ff88', '#ff6b35', '#ff3b3b'];
            const color = colors[DEVICES.indexOf(d) % colors.length];
            return (
              <div
                key={d.id}
                title={`${d.name}: ${share.toFixed(1)}%`}
                style={{ width: `${share}%`, background: color, cursor: 'pointer' }}
              />
            );
          })}
        </div>
        <div className="flex gap-4 mt-2 flex-wrap">
          {DEVICES.map((d, i) => {
            const colors = ['#00d4ff', '#7b2fff', '#00ff88', '#ff6b35', '#ff3b3b'];
            return (
              <div key={d.id} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: colors[i % colors.length] }} />
                <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{d.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Device cards */}
      <div className="flex flex-col gap-4">
        {[...online, ...idle, ...offline].map((device, i) => (
          <div key={device.id} className="fade-in-up" style={{ animationDelay: `${200 + i * 80}ms` }}>
            <DeviceCard device={device} />
          </div>
        ))}
      </div>
    </div>
  );
}
