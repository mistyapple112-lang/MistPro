import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, Globe, Share2, Wrench, Download, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const iconMap = {
  Globe, Share2, Wrench, Download, Zap
};

const categoryColors = {
  proxy: 'text-primary bg-primary/10',
  social: 'text-accent bg-accent/10',
  tool: 'text-chart-4 bg-chart-4/10',
  utility: 'text-chart-3 bg-chart-3/10',
  download: 'text-chart-5 bg-chart-5/10',
};

const categoryLabels = {
  proxy: 'NETWORK',
  social: 'SOCIAL',
  tool: 'TOOL',
  utility: 'UTILITY',
  download: 'DOWNLOAD',
};

const pathMap = {
  'Proxy': '/proxy',
  'Social': '/social',
};

export default function ModuleCard({ product, isLicensed }) {
  const isLocked = !isLicensed;
  const IconComp = iconMap[product.icon] || Zap;
  const colorClass = categoryColors[product.category] || categoryColors.tool;
  const path = pathMap[product.name] || '/';

  return (
    <Link
      to={isLocked ? '/purchase' : path}
      className="group block"
    >
      <div className="rounded-xl border border-border bg-card p-5 hover:border-muted-foreground/30 transition-all duration-300 hover:translate-y-[-2px] relative overflow-hidden">
        {/* Locked badge */}
        {isLocked && (
          <Badge className="absolute top-3 right-3 bg-destructive/10 text-destructive border-destructive/20 text-[10px] font-semibold">
            LOCKED
          </Badge>
        )}

        {/* Icon */}
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${colorClass}`}>
          <IconComp className="w-5 h-5" />
        </div>

        {/* Category */}
        <p className="text-[10px] font-semibold tracking-[0.15em] text-muted-foreground/50 uppercase mb-1">
          {categoryLabels[product.category] || 'MODULE'}
        </p>

        {/* Name */}
        <h3 className="text-base font-semibold mb-1.5">{product.name}</h3>

        {/* Description */}
        <p className="text-xs text-muted-foreground leading-relaxed mb-3">
          {product.description || 'Module available with license.'}
        </p>

        {/* Footer */}
        <div className="flex items-center gap-1.5 text-[11px]">
          {isLocked ? (
            <>
              <Lock className="w-3 h-3 text-muted-foreground/40" />
              <span className="text-muted-foreground/50">License required</span>
            </>
          ) : (
            <>
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-primary/70">Available</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}