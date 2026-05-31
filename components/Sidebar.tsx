'use client';

import { useState } from 'react';
import {
  LayoutDashboard,
  Monitor,
  AppWindow,
  BellRing,
  Settings2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

type Tab = 'dashboard' | 'devices' | 'apps' | 'alerts' | 'settings';

interface SidebarProps {
  active: Tab;
  onChange: (tab: Tab) => void;
}

const NAV = [
  { id: 'dashboard' as Tab, label: 'Dashboard', Icon: LayoutDashboard },
  { id: 'devices' as Tab, label: 'Appareils', Icon: Monitor },
  { id: 'apps' as Tab, label: 'Applications', Icon: AppWindow },
  { id: 'alerts' as Tab, label: 'Alertes', Icon: BellRing },
  { id: 'settings' as Tab, label: 'Paramètres', Icon: Settings2 },
];

export default function Sidebar({ active, onChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className="flex flex-col transition-all duration-300 flex-shrink-0"
      style={{
        width: collapsed ? 60 : 240,
        minHeight: '100vh',
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3"
        style={{
          padding: collapsed ? '20px 12px' : '20px 24px',
          borderBottom: '1px solid var(--border)',
          minHeight: 64,
        }}
      >
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <div className="gradient-text font-bold" style={{ fontSize: 16, lineHeight: 1.2 }}>
              BuyTrack
            </div>
            <div style={{ fontSize: 9, color: 'var(--text-2)', letterSpacing: '0.15em', marginTop: 2 }}>
              NET MONITOR
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(c => !c)}
          className="transition-colors rounded-lg flex items-center justify-center flex-shrink-0"
          style={{
            width: 28,
            height: 28,
            color: 'var(--text-2)',
            background: 'transparent',
            border: '1px solid var(--border)',
          }}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Nav */}
      <nav
        className="flex-1 flex flex-col"
        style={{ padding: collapsed ? '16px 8px' : '16px 12px', gap: 2 }}
      >
        {NAV.map(({ id, label, Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className="flex items-center transition-all duration-150 relative rounded-lg text-left"
              style={{
                height: 44,
                gap: 12,
                padding: collapsed ? '0 14px' : '0 16px',
                background: isActive ? 'rgba(0,212,255,0.06)' : 'transparent',
                color: isActive ? 'var(--cyan)' : 'var(--text-2)',
                borderLeft: isActive ? '2px solid var(--cyan)' : '2px solid transparent',
                fontWeight: isActive ? 500 : 400,
                fontSize: 13,
              }}
            >
              <Icon size={16} style={{ flexShrink: 0 }} />
              {!collapsed && (
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Status */}
      <div
        className="flex items-center gap-2"
        style={{
          padding: collapsed ? '16px 12px' : '16px 24px',
          borderTop: '1px solid var(--border)',
        }}
      >
        <div
          className="rounded-full flex-shrink-0"
          style={{ width: 8, height: 8, background: 'var(--green)' }}
        />
        {!collapsed && (
          <span style={{ fontSize: 11, color: 'var(--text-2)' }}>
            Connecté
          </span>
        )}
      </div>
    </aside>
  );
}
