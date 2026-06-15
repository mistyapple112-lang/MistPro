import React from 'react';
import { ExternalLink } from 'lucide-react';

export default function SocialCard({ name, icon, color, url, onClick }) {
  return (
    <button
      onClick={() => onClick(url)}
      className="group rounded-xl border border-border bg-card p-6 hover:border-muted-foreground/30 transition-all duration-300 hover:translate-y-[-2px] text-left w-full"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          <span className="text-2xl">{icon}</span>
        </div>
        <ExternalLink className="w-4 h-4 text-muted-foreground/30 group-hover:text-muted-foreground transition-colors" />
      </div>
      <h3 className="font-semibold mb-1">{name}</h3>
      <p className="text-xs text-muted-foreground">Browse via MistPro Proxy</p>
    </button>
  );
}