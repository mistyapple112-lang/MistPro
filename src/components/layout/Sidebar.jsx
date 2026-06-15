import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, ShoppingCart, Shield, Globe, Share2, 
  Settings, Lock, Unlock, ChevronRight, Zap, Crown
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navSections = [
  {
    label: 'MAIN',
    items: [
      { name: 'Home', path: '/', icon: Home },
      { name: 'Purchase', path: '/purchase', icon: ShoppingCart },
    ]
  },
  {
    label: 'MODULES',
    items: [
      { name: 'Proxy', path: '/proxy', icon: Globe, requiresLicense: true },
      { name: 'Social', path: '/social', icon: Share2, requiresLicense: true },
    ]
  },
  {
    label: 'SYSTEM',
    items: [
      { name: 'Admin Panel', path: '/admin', icon: Settings },
    ]
  }
];

export default function Sidebar({ isLicensed, onClose }) {
  const location = useLocation();

  return (
    <aside className="w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col shrink-0">
      {/* Logo */}
      <div className="p-5 border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-3" onClick={onClose}>
          <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-wide text-foreground">MISTPRO</h1>
            <p className="text-[10px] font-medium tracking-[0.2em] text-muted-foreground uppercase">Platform</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {navSections.map((section) => (
          <div key={section.label}>
            <p className="text-[10px] font-semibold tracking-[0.15em] text-muted-foreground/60 uppercase px-3 mb-2">
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = location.pathname === item.path;
                const isLocked = item.requiresLicense && !isLicensed;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <Icon className={cn("w-4 h-4", isActive && "text-primary")} />
                    <span className="flex-1">{item.name}</span>
                    {isLocked ? (
                      <Lock className="w-3.5 h-3.5 text-muted-foreground/40" />
                    ) : item.requiresLicense ? (
                      <Unlock className="w-3.5 h-3.5 text-primary/50" />
                    ) : null}
                    {isActive && (
                      <ChevronRight className="w-3.5 h-3.5 text-primary" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-2 h-2 rounded-full",
            isLicensed ? "bg-primary animate-pulse" : "bg-muted-foreground/30"
          )} />
          <span className="text-xs text-muted-foreground">
            {isLicensed ? 'License Active' : 'No License'}
          </span>
        </div>
      </div>
    </aside>
  );
}