'use client';

import { useState } from 'react';
import { Device, formatBytes, getDeviceIcon } from '@/lib/data';
import AppUsageList from './AppUsageList';

interface DeviceCardProps {
  device: Device;
  isExpanded?: boolean;
}

const STATUS_COLOR: Record<Device['status'], string> = {
  online: '#00ff88',
  idle: '#ffb800',
  offline: '#ff3b3b',
};

const STATUS_LABEL: Record<Device['status'], string> = {
  online: 'En ligne',
  idle: 'Inactif',
  offline: 'Hors ligne',
};

export default function DeviceCard({ device }: DeviceCardProps) {
  const [expanded, setExpanded] = useState(false);
  const statusColor = STATUS_COLOR[device.status];
  const total = device.totalDownload + device.totalUpload;

  return (
    <div
      className="glass rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        border: `1px solid ${device.status === 'online' ? 'rgba(0,212,255,0.12)' : 'rgba(255,255,255,0.05)'}`,
      }}
    >
      <div
        className="p-5 cursor-pointer hover:bg-white/[0.02] transition-colors"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex items-start gap-4">
          {/* Device icon */}
          <div
            className="flex items-center justify-center rounded-xl text-2xl relative"
            style={{
              width: 52, height: 52,
              background: device.status === 'online' ? 'rgba(0,212,255,0.08)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${statusColor}25`,
              flexShrink: 0,
            }}
          >
            {getDeviceIcon(device.type)}
            {/* Status dot */}
            <div
              className="absolute rounded-full"
              style={{
                width: 10, height: 10,
                background: statusColor,
                bottom: -2, right: -2,
                border: '2px solid var(--bg-primary)',
                boxShadow: device.status === 'online' ? `0 0 8px ${statusColor}` : 'none',
              }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>
                {device.name}
              </span>
              <span
                className="rounded-full px-2 py-0.5"
                style={{
                  fontSize: 10, fontWeight: 600,
                  background: `${statusColor}15`,
                  color: statusColor,
                  border: `1px solid ${statusColor}25`,
                }}
              >
                {STATUS_LABEL[device.status]}
              </span>
            </div>

            <div className="flex gap-3 mt-1 flex-wrap">
              <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{device.os}</span>
              <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>·</span>
              <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{device.ip}</span>
            </div>

            <div className="flex gap-4 mt-3">
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>↓ Téléchargé</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#00d4ff' }}>
                  {formatBytes(device.totalDownload)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>↑ Envoyé</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#7b2fff' }}>
                  {formatBytes(device.totalUpload)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Total</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                  {formatBytes(total)}
                </div>
              </div>
            </div>
          </div>

          {/* Signal & expand */}
          <div className="flex flex-col items-end gap-3">
            {device.status !== 'offline' && (
              <div className="flex flex-col items-end gap-1">
                <div className="flex gap-0.5 items-end" style={{ height: 16 }}>
                  {[25, 50, 75, 100].map((threshold, i) => (
                    <div
                      key={i}
                      className="rounded-sm"
                      style={{
                        width: 4,
                        height: `${25 + i * 18}%`,
                        background: device.signalStrength >= threshold
                          ? (device.signalStrength > 70 ? '#00ff88' : '#ffb800')
                          : 'rgba(255,255,255,0.1)',
                      }}
                    />
                  ))}
                </div>
                <span style={{ fontSize: 9, color: 'var(--text-secondary)' }}>{device.signalStrength}%</span>
              </div>
            )}
            <div
              className="rounded-lg px-2 py-1 transition-colors"
              style={{
                fontSize: 11,
                color: 'var(--text-secondary)',
                background: 'rgba(255,255,255,0.04)',
              }}
            >
              {expanded ? '▲ Réduire' : `▼ ${device.apps.length} apps`}
            </div>
          </div>
        </div>

        {/* Usage bar */}
        <div className="mt-4 rounded-full overflow-hidden" style={{ height: 4, background: 'rgba(255,255,255,0.05)' }}>
          <div
            className="h-full rounded-full"
            style={{
              width: `${(device.totalDownload / (device.totalDownload + device.totalUpload)) * 100}%`,
              background: 'linear-gradient(90deg, #00d4ff, #7b2fff)',
            }}
          />
        </div>
      </div>

      {/* Expanded apps */}
      {expanded && device.apps.length > 0 && (
        <div className="px-5 pb-5" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          <div className="pt-4">
            <AppUsageList apps={device.apps} title={`Apps — ${device.name}`} />
          </div>
        </div>
      )}
    </div>
  );
}
