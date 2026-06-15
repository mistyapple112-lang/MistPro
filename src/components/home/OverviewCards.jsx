import React from 'react';
import { Box, Key, Users, Activity } from 'lucide-react';

const cards = [
  { label: 'Modules', value: null, sub: 'Included in MistPro', icon: Box, accent: true },
  { label: 'License', value: null, sub: null, icon: Key },
  { label: 'Status', value: 'Operational', sub: 'All modules online', icon: Activity },
  { label: 'Users Online', value: '—', sub: 'Real-time', icon: Users },
];

export default function OverviewCards({ isLicensed, moduleCount }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        let value = card.value;
        let sub = card.sub;

        if (card.label === 'Modules') {
          value = String(moduleCount);
        }
        if (card.label === 'License') {
          value = isLicensed ? 'Active' : '—';
          sub = isLicensed ? 'License verified' : 'Enter key to activate';
        }

        const Icon = card.icon;

        return (
          <div
            key={card.label}
            className={`rounded-xl border p-5 transition-all duration-300 ${
              card.accent
                ? 'bg-primary/5 border-primary/20 glow-green'
                : 'bg-card border-border hover:border-muted-foreground/20'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${card.accent ? 'bg-primary/10' : 'bg-secondary'}`}>
                <Icon className={`w-4 h-4 ${card.accent ? 'text-primary' : 'text-muted-foreground'}`} />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">{card.label}</p>
                <p className="text-xl font-bold mt-0.5">{value}</p>
                {sub && <p className="text-[11px] text-muted-foreground/70 mt-0.5">{sub}</p>}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}