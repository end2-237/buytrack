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
    }, {} as Record<string, (typeof allApps)[0]>)
  );

  const currentDevice = DEVICES.find(d => d.id === selectedDevice);
  const displayApps = selectedDevice === 'all' ? deduped : (currentDevice?.apps ?? []);

  return (
    <div className="flex flex-col gap-5">
      <div className="fade-in-up">
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5, color: 'var(--text-1)' }}>
          Applications
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 4 }}>
          Consommation par application sur tous vos appareils
        </div>
      </div>

      {/* Device filter */}
      <div
        className="rounded-xl fade-in-up flex gap-2 flex-wrap"
        style={{
          padding: 24,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          animationDelay: '100ms',
        }}
      >
        <button
          onClick={() => setSelectedDevice('all')}
          className="rounded-lg px-4 py-2 transition-all"
          style={{
            fontSize: 12,
            fontWeight: 500,
            background: selectedDevice === 'all' ? 'rgba(0,212,255,0.12)' : 'var(--surface-2)',
            color: selectedDevice === 'all' ? 'var(--cyan)' : 'var(--text-2)',
            border:
              selectedDevice === 'all'
                ? '1px solid rgba(0,212,255,0.25)'
                : '1px solid var(--border)',
          }}
        >
          Tous les appareils
        </button>
        {DEVICES.map(d => (
          <button
            key={d.id}
            onClick={() => setSelectedDevice(d.id)}
            className="rounded-lg px-4 py-2 transition-all"
            style={{
              fontSize: 12,
              fontWeight: 500,
              background:
                selectedDevice === d.id ? 'rgba(0,212,255,0.12)' : 'var(--surface-2)',
              color: selectedDevice === d.id ? 'var(--cyan)' : 'var(--text-2)',
              border:
                selectedDevice === d.id
                  ? '1px solid rgba(0,212,255,0.25)'
                  : '1px solid var(--border)',
              opacity: d.status === 'offline' ? 0.5 : 1,
            }}
          >
            {d.name}
          </button>
        ))}
      </div>

      {/* Summary stats */}
      <div
        className="grid grid-cols-3 gap-5 fade-in-up"
        style={{ animationDelay: '150ms' }}
      >
        {[
          { label: 'Applications', value: displayApps.length.toString(), color: 'var(--cyan)' },
          {
            label: 'Telechargement',
            value: formatBytes(displayApps.reduce((s, a) => s + a.download, 0)),
            color: 'var(--purple)',
          },
          {
            label: 'Envoi',
            value: formatBytes(displayApps.reduce((s, a) => s + a.upload, 0)),
            color: 'var(--green)',
          },
        ].map(s => (
          <div
            key={s.label}
            className="rounded-xl"
            style={{
              padding: 24,
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="fade-in-up" style={{ animationDelay: '200ms' }}>
        <AppUsageList
          apps={displayApps}
          title={
            selectedDevice === 'all'
              ? 'Toutes les applications (agrege)'
              : currentDevice?.name ?? ''
          }
        />
      </div>
    </div>
  );
}
