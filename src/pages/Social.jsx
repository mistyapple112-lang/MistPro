import React, { useState } from 'react';
import { useOutletContext, Navigate } from 'react-router-dom';
import { Share2, ArrowLeft, Shield, Lock, RotateCw, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import SocialCard from '@/components/social/SocialCard';

const platforms = [
  { name: 'YouTube', icon: '▶️', color: 'bg-red-500/10', url: 'https://m.youtube.com' },
  { name: 'TikTok', icon: '🎵', color: 'bg-pink-500/10', url: 'https://www.tiktok.com' },
  { name: 'Instagram', icon: '📷', color: 'bg-purple-500/10', url: 'https://www.instagram.com' },
  { name: 'Snapchat', icon: '👻', color: 'bg-yellow-500/10', url: 'https://www.snapchat.com' },
  { name: 'Google', icon: '🔍', color: 'bg-blue-500/10', url: 'https://www.google.com/webhp?igu=1' },
  { name: 'Twitter / X', icon: '𝕏', color: 'bg-slate-500/10', url: 'https://x.com' },
];

export default function Social() {
  const { isLicensed } = useOutletContext();
  const [activeUrl, setActiveUrl] = useState('');
  const [activeName, setActiveName] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isLicensed) {
    return <Navigate to="/purchase" replace />;
  }

  const handleOpen = (url, name) => {
    setLoading(true);
    setActiveUrl(url);
    setActiveName(name || '');
  };

  const handleBack = () => {
    setActiveUrl('');
    setActiveName('');
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full">
      <AnimatePresence mode="wait">
        {!activeUrl ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-6 md:p-8 max-w-5xl mx-auto w-full"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <Share2 className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Social Hub</h1>
                <p className="text-xs text-muted-foreground">Browse social media through MistPro Proxy</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {platforms.map((p) => (
                <SocialCard
                  key={p.name}
                  {...p}
                  onClick={(url) => handleOpen(url, p.name)}
                />
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="browser"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col h-full"
          >
            {/* Browser Bar */}
            <div className="border-b border-border bg-card/50 backdrop-blur-sm p-3">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-9 w-9" onClick={handleBack}>
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => { setLoading(true); setActiveUrl(prev => prev + ' '); setTimeout(() => setActiveUrl(prev => prev.trim()), 10); }}>
                  <RotateCw className="w-4 h-4" />
                </Button>
                <div className="flex-1 relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-primary" />
                  <div className="h-9 bg-secondary border border-border rounded-md flex items-center pl-9 pr-3 text-sm font-mono text-muted-foreground truncate">
                    {activeUrl}
                  </div>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10">
                  <Shield className="w-3 h-3 text-primary" />
                  <span className="text-[10px] font-medium text-primary">Proxy</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 relative">
              <iframe
                src={activeUrl}
                className="w-full h-full border-0"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
                onLoad={() => setLoading(false)}
                title={activeName}
              />
              {loading && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs text-muted-foreground">Connecting to {activeName}...</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}