'use client';

import DeviceCard from './DeviceCard';
import { DEVICES, TOTAL_DOWNLOAD, TOTAL_UPLOAD, formatBytes } from '@/lib/data';

const PALETTE = ['#00d4ff', '#7c3aed', '#10b981', '#f59e0b', '#ef4444'];

export default function DevicesView() {
  const online = DEVICES.filter(d => d.status === 'online');
  const idle = DEVICES.filter(d => d.status === 'idle');
  const offline = DEVICES.filter(d => d.status === 'offline');
  const ordered = [...online, ...idle, ...offline];

  return (
    <div className="flex flex-col gap-5">
      <div className="fade-in-up">
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5, color: 'var(--text-1)' }}>
          Appareils
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 4 }}>
          {DEVICES.length} appareils detectes · {online.length} en ligne
        </div>
      </div>

      {/* Network summary */}
      <div
        className="rounded-xl fade-in-up"
        style={{
          padding: 24,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          animationDelay: '100ms',
        }}
      >
        <div style={{ fontSize: 11, color: 'var(--text-2)', marginBottom: 16, letterSpacing: '0.06em' }}>
          CONSOMMATION TOTALE — TOUS APPAREILS
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--cyan)' }}>
              {formatBytes(TOTAL_DOWNLOAD)}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 2 }}>Telechargement</div>
          </div>
          <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: 24 }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--purple)' }}>
              {formatBytes(TOTAL_UPLOAD)}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 2 }}>Envoi</div>
          </div>
          <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: 24 }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-1)' }}>
              {formatBytes(TOTAL_DOWNLOAD + TOTAL_UPLOAD)}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 2 }}>Total combine</div>
          </div>
        </div>

        {/* Per-device usage bars */}
        <div
          className="flex gap-px rounded overflow-hidden"
          style={{ height: 5, marginTop: 16 }}
        >
          {DEVICES.map((d, i) => {
            const share =
              ((d.totalDownload + d.totalUpload) / (TOTAL_DOWNLOAD + TOTAL_UPLOAD)) * 100;
            return (
              <div
                key={d.id}
                title={`${d.name}: ${share.toFixed(1)}%`}
                style={{ width: `${share}%`, background: PALETTE[i % PALETTE.length] }}
              />
            );
          })}
        </div>
        <div className="flex gap-4 flex-wrap" style={{ marginTop: 8 }}>
          {DEVICES.map((d, i) => (
            <div key={d.id} className="flex items-center gap-1.5">
              <div
                className="rounded-full"
                style={{ width: 6, height: 6, background: PALETTE[i % PALETTE.length] }}
              />
              <span style={{ fontSize: 10, color: 'var(--text-2)' }}>{d.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Device cards */}
      <div className="flex flex-col gap-4">
        {ordered.map((device, i) => (
          <div key={device.id} className="fade-in-up" style={{ animationDelay: `${200 + i * 80}ms` }}>
            <DeviceCard device={device} />
          </div>
        ))}
      </div>
    </div>
  );
}
