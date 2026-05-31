'use client';

import { useState } from 'react';
import { Smartphone, Laptop, Tablet, Tv2, Router, ChevronDown, ChevronUp } from 'lucide-react';
import { Device, formatBytes } from '@/lib/data';
import AppUsageList from './AppUsageList';

interface DeviceCardProps {
  device: Device;
}

const STATUS_COLOR: Record<Device['status'], string> = {
  online: '#10b981',
  idle: '#f59e0b',
  offline: '#ef4444',
};

const STATUS_LABEL: Record<Device['status'], string> = {
  online: 'En ligne',
  idle: 'Inactif',
  offline: 'Hors ligne',
};

const DEVICE_ICON: Record<Device['type'], React.ComponentType<{ size?: number; color?: string }>> = {
  phone: Smartphone,
  laptop: Laptop,
  tablet: Tablet,
  tv: Tv2,
  router: Router,
};

export default function DeviceCard({ device }: DeviceCardProps) {
  const [expanded, setExpanded] = useState(false);
  const statusColor = STATUS_COLOR[device.status];
  const total = device.totalDownload + device.totalUpload;
  const DeviceIcon = DEVICE_ICON[device.type];

  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-300"
      style={{
        background: 'var(--surface)',
        border: `1px solid ${device.status === 'online' ? 'rgba(0,212,255,0.1)' : 'var(--border)'}`,
      }}
    >
      <div
        style={{ padding: 24, cursor: 'pointer' }}
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex items-start gap-4">
          {/* Device icon */}
          <div
            className="flex items-center justify-center rounded-xl relative flex-shrink-0"
            style={{
              width: 48,
              height: 48,
              background: device.status === 'online' ? 'rgba(0,212,255,0.07)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${statusColor}20`,
              color: device.status === 'online' ? 'var(--cyan)' : 'var(--text-3)',
            }}
          >
            <DeviceIcon size={20} />
            {/* Status dot */}
            <div
              className="absolute rounded-full"
              style={{
                width: 8,
                height: 8,
                background: statusColor,
                bottom: -2,
                right: -2,
                border: '2px solid var(--surface)',
              }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)' }}>
                {device.name}
              </span>
              <span
                className="rounded px-2 py-0.5"
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  background: `${statusColor}12`,
                  color: statusColor,
                  border: `1px solid ${statusColor}20`,
                }}
              >
                {STATUS_LABEL[device.status]}
              </span>
            </div>

            <div className="flex gap-3 mt-1 flex-wrap">
              <span style={{ fontSize: 11, color: 'var(--text-2)' }}>{device.os}</span>
              <span style={{ fontSize: 11, color: 'var(--text-3)' }}>·</span>
              <span style={{ fontSize: 11, color: 'var(--text-2)' }}>{device.ip}</span>
            </div>

            <div className="flex gap-5 mt-3">
              <div>
                <div style={{ fontSize: 10, color: 'var(--text-2)', marginBottom: 2 }}>Telechargement</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--cyan)' }}>
                  {formatBytes(device.totalDownload)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: 'var(--text-2)', marginBottom: 2 }}>Envoi</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--purple)' }}>
                  {formatBytes(device.totalUpload)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: 'var(--text-2)', marginBottom: 2 }}>Total</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)' }}>
                  {formatBytes(total)}
                </div>
              </div>
            </div>
          </div>

          {/* Signal bars + expand button */}
          <div className="flex flex-col items-end gap-3 flex-shrink-0">
            {device.status !== 'offline' && (
              <div className="flex flex-col items-end gap-1">
                <div className="flex gap-0.5 items-end" style={{ height: 16 }}>
                  {[25, 50, 75, 100].map((threshold, i) => (
                    <div
                      key={i}
                      className="rounded-sm"
                      style={{
                        width: 4,
                        height: `${28 + i * 18}%`,
                        background: device.signalStrength >= threshold
                          ? (device.signalStrength > 70 ? 'var(--green)' : 'var(--amber)')
                          : 'rgba(255,255,255,0.1)',
                      }}
                    />
                  ))}
                </div>
                <span style={{ fontSize: 9, color: 'var(--text-2)' }}>{device.signalStrength}%</span>
              </div>
            )}
            <div
              className="flex items-center gap-1 rounded-lg px-2 py-1 transition-colors"
              style={{
                fontSize: 11,
                color: 'var(--text-2)',
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
              }}
            >
              {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              <span>{device.apps.length} apps</span>
            </div>
          </div>
        </div>

        {/* Usage bar */}
        <div
          className="rounded-full overflow-hidden"
          style={{ height: 3, background: 'rgba(255,255,255,0.05)', marginTop: 16 }}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: `${(device.totalDownload / (device.totalDownload + device.totalUpload)) * 100}%`,
              background: 'linear-gradient(90deg, var(--cyan), var(--purple))',
            }}
          />
        </div>
      </div>

      {/* Expanded apps */}
      {expanded && device.apps.length > 0 && (
        <div
          style={{
            padding: '0 24px 24px',
            borderTop: '1px solid var(--border)',
          }}
        >
          <div style={{ paddingTop: 16 }}>
            <AppUsageList apps={device.apps} title={`Apps — ${device.name}`} />
          </div>
        </div>
      )}
    </div>
  );
}
