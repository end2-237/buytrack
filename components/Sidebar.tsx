'use client';

import { useState } from 'react';

type Tab = 'dashboard' | 'devices' | 'apps' | 'alerts' | 'settings';

interface SidebarProps {
  active: Tab;
  onChange: (tab: Tab) => void;
}

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: '⊞' },
  { id: 'devices', label: 'Appareils', icon: '◈' },
  { id: 'apps', label: 'Applications', icon: '⬡' },
  { id: 'alerts', label: 'Alertes', icon: '◎' },
  { id: 'settings', label: 'Paramètres', icon: '⚙' },
] as const;

export default function Sidebar({ active, onChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className="glass glow-cyan flex flex-col transition-all duration-300"
      style={{
        width: collapsed ? 64 : 220,
        minHeight: '100vh',
        borderRight: '1px solid rgba(0,212,255,0.1)',
        background: 'linear-gradient(180deg, rgba(0,212,255,0.05) 0%, rgba(123,47,255,0.03) 100%)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 p-4 mb-2" style={{ borderBottom: '1px solid rgba(0,212,255,0.08)' }}>
        <div
          className="flex items-center justify-center rounded-xl text-sm font-bold"
          style={{
            width: 36, height: 36,
            background: 'linear-gradient(135deg, #00d4ff, #7b2fff)',
            boxShadow: '0 0 20px rgba(0,212,255,0.4)',
            flexShrink: 0,
          }}
        >
          BT
        </div>
        {!collapsed && (
          <div>
            <div className="gradient-text font-bold text-base leading-tight">BuyTrack</div>
            <div style={{ fontSize: 10, color: 'var(--text-secondary)', letterSpacing: 2 }}>NET MONITOR</div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(c => !c)}
          className="ml-auto opacity-40 hover:opacity-100 transition-opacity"
          style={{ fontSize: 12, color: 'var(--accent-cyan)', flexShrink: 0 }}
        >
          {collapsed ? '▶' : '◀'}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 flex flex-col gap-1">
        {NAV.map(item => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id as Tab)}
              className="flex items-center gap-3 rounded-xl transition-all duration-200 text-left"
              style={{
                padding: collapsed ? '10px 12px' : '10px 14px',
                background: isActive ? 'rgba(0,212,255,0.1)' : 'transparent',
                border: isActive ? '1px solid rgba(0,212,255,0.2)' : '1px solid transparent',
                color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                boxShadow: isActive ? '0 0 15px rgba(0,212,255,0.1)' : 'none',
              }}
            >
              <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
              {!collapsed && (
                <span style={{ fontSize: 13, fontWeight: isActive ? 600 : 400, whiteSpace: 'nowrap' }}>
                  {item.label}
                </span>
              )}
              {!collapsed && isActive && (
                <div className="ml-auto w-1 h-1 rounded-full" style={{ background: 'var(--accent-cyan)' }} />
              )}
            </button>
          );
        })}
      </nav>

      {/* Status indicator */}
      <div className="p-4" style={{ borderTop: '1px solid rgba(0,212,255,0.08)' }}>
        <div className="flex items-center gap-2">
          <div
            className="rounded-full"
            style={{ width: 8, height: 8, background: 'var(--accent-green)', boxShadow: '0 0 8px var(--accent-green)' }}
          />
          {!collapsed && (
            <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Connecté · 1 Gbps</span>
          )}
        </div>
      </div>
    </aside>
  );
}
