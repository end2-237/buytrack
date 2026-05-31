'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import DevicesView from '@/components/DevicesView';
import AppsView from '@/components/AppsView';
import AlertsView from '@/components/AlertsView';
import SettingsView from '@/components/SettingsView';

type Tab = 'dashboard' | 'devices' | 'apps' | 'alerts' | 'settings';

export default function Home() {
  const [tab, setTab] = useState<Tab>('dashboard');

  const views: Record<Tab, React.ReactNode> = {
    dashboard: <Dashboard />,
    devices: <DevicesView />,
    apps: <AppsView />,
    alerts: <AlertsView />,
    settings: <SettingsView />,
  };

  return (
    <div className="flex min-h-screen grid-bg" style={{ background: 'var(--bg)' }}>
      {/* Subtle radial glows */}
      <div
        className="fixed pointer-events-none"
        style={{
          top: -200,
          left: -200,
          width: 600,
          height: 600,
          background:
            'radial-gradient(circle, rgba(0,212,255,0.05) 0%, transparent 70%)',
          zIndex: 0,
        }}
      />
      <div
        className="fixed pointer-events-none"
        style={{
          bottom: -200,
          right: -200,
          width: 600,
          height: 600,
          background:
            'radial-gradient(circle, rgba(124,58,237,0.05) 0%, transparent 70%)',
          zIndex: 0,
        }}
      />

      <div className="relative z-10 flex w-full">
        <Sidebar active={tab} onChange={setTab} />

        <main className="flex-1 overflow-auto px-8 py-6">
          <div className="max-w-6xl mx-auto">
            {views[tab]}
          </div>
        </main>
      </div>
    </div>
  );
}
