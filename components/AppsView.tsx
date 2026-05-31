'use client';

import { useState } from 'react';
import { DEVICES, formatBytes } from '@/lib/data';
import AppUsageList from './AppUsageList';

export default function AppsView() {
  const [selectedDevice, setSelectedDevice] = useState('all');

  const allApps = DEVICES.flatMap(d => d.apps);
  const deduped = Object.values(
    allApps.reduce((acc, app) => {
      if (!acc[app.name]) {
        acc[app.name] = { ...app };
      } else {
        acc[app.name].download += app.download;
        acc[app.name].upload += app.upload;
        acc[app.name].sessions += app.sessions;
      }
      return acc;
    }, {} as Record<string, typeof allApps[0]>)
  );

  const currentDevice = DEVICES.find(d => d.id === selectedDevice);
  const displayApps = selectedDevice === 'all' ? deduped : (currentDevice?.apps ?? []);

  return (
    <div className="flex flex-col gap-6">
      <div className="fade-in-up">
        <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: -0.5 }}>Applications</div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
          Consommation par application sur tous vos appareils
        </div>
      </div>

      {/* Device filter */}
      <div
        className="glass rounded-2xl p-4 fade-in-up flex gap-2 flex-wrap"
        style={{ animationDelay: '100ms', border: '1px solid rgba(0,212,255,0.1)' }}
      >
        <button
          onClick={() => setSelectedDevice('all')}
          className="rounded-xl px-4 py-2 transition-all"
          style={{
            fontSize: 12, fontWeight: 500,
            background: selectedDevice === 'all' ? 'rgba(0,212,255,0.15)' : 'rgba(255,255,255,0.04)',
            color: selectedDevice === 'all' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
            border: selectedDevice === 'all' ? '1px solid rgba(0,212,255,0.25)' : '1px solid rgba(255,255,255,0.06)',
          }}
        >
          Tous les appareils
        </button>
        {DEVICES.map(d => (
          <button
            key={d.id}
            onClick={() => setSelectedDevice(d.id)}
            className="rounded-xl px-4 py-2 transition-all"
            style={{
              fontSize: 12, fontWeight: 500,
              background: selectedDevice === d.id ? 'rgba(0,212,255,0.15)' : 'rgba(255,255,255,0.04)',
              color: selectedDevice === d.id ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              border: selectedDevice === d.id ? '1px solid rgba(0,212,255,0.25)' : '1px solid rgba(255,255,255,0.06)',
              opacity: d.status === 'offline' ? 0.5 : 1,
            }}
          >
            {d.name}
          </button>
        ))}
      </div>

      {/* Stats for selected */}
      <div className="grid grid-cols-3 gap-4 fade-in-up" style={{ animationDelay: '150ms' }}>
        {[
          { label: 'Applications', value: displayApps.length.toString(), color: '#00d4ff' },
          { label: 'Téléchargé', value: formatBytes(displayApps.reduce((s, a) => s + a.download, 0)), color: '#7b2fff' },
          { label: 'Envoyé', value: formatBytes(displayApps.reduce((s, a) => s + a.upload, 0)), color: '#00ff88' },
        ].map(s => (
          <div
            key={s.label}
            className="glass rounded-2xl p-4 text-center"
            style={{ border: `1px solid ${s.color}20` }}
          >
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="fade-in-up" style={{ animationDelay: '200ms' }}>
        <AppUsageList
          apps={displayApps}
          title={selectedDevice === 'all' ? 'Toutes les applications (agrégé)' : `${currentDevice?.name}`}
        />
      </div>
    </div>
  );
}
