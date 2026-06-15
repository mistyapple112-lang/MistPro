import React, { useState } from 'react';
import { useOutletContext, Navigate } from 'react-router-dom';
import { Globe, Search, ArrowLeft, ArrowRight, RotateCw, Shield, Lock, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function Proxy() {
  const { isLicensed } = useOutletContext();
  const [url, setUrl] = useState('');
  const [currentUrl, setCurrentUrl] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isLicensed) {
    return <Navigate to="/purchase" replace />;
  }

  const formatUrl = (input) => {
    let formatted = input.trim();
    if (!formatted) return '';
    if (!formatted.startsWith('http://') && !formatted.startsWith('https://')) {
      if (formatted.includes('.')) {
        formatted = 'https://' + formatted;
      } else {
        formatted = 'https://www.google.com/search?igu=1&q=' + encodeURIComponent(formatted);
      }
    }
    return formatted;
  };

  const handleGo = (e) => {
    e?.preventDefault();
    const formatted = formatUrl(url);
    if (formatted) {
      setLoading(true);
      setCurrentUrl(formatted);
    }
  };

  const quickLinks = [
    { name: 'Google', url: 'https://www.google.com/webhp?igu=1', icon: '🔍' },
    { name: 'DuckDuckGo', url: 'https://duckduckgo.com', icon: '🦆' },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Proxy Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm p-3">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Globe className="w-4 h-4 text-primary" />
          </div>
          <span className="text-sm font-bold">MistPro Proxy</span>
          <div className="flex items-center gap-1 ml-2 px-2 py-0.5 rounded-full bg-primary/10">
            <Shield className="w-3 h-3 text-primary" />
            <span className="text-[10px] font-medium text-primary">Encrypted</span>
          </div>
        </div>

        {/* URL Bar */}
        <form onSubmit={handleGo} className="flex gap-2">
          <div className="flex items-center gap-1">
            <Button type="button" variant="ghost" size="icon" className="h-9 w-9" onClick={() => setCurrentUrl('')}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <Button type="button" variant="ghost" size="icon" className="h-9 w-9" onClick={() => { if (currentUrl) { setLoading(true); setCurrentUrl(prev => prev); } }}>
              <RotateCw className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex-1 relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-primary" />
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL or search..."
              className="pl-9 h-9 bg-secondary border-border text-sm font-mono"
            />
          </div>
          <Button type="submit" size="sm" className="h-9 bg-primary text-primary-foreground">
            <Search className="w-4 h-4" />
          </Button>
        </form>
      </div>

      {/* Browser Content */}
      <div className="flex-1 relative bg-background">
        {!currentUrl ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-full p-8"
          >
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 glow-green">
              <Globe className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-lg font-bold mb-2">MistPro Proxy Browser</h2>
            <p className="text-sm text-muted-foreground mb-8 text-center max-w-md">
              Browse the web through MistPro's proxy. Your traffic is routed through our servers for enhanced privacy.
            </p>

            <div className="flex flex-wrap gap-3 justify-center">
              {quickLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => { setUrl(link.url); setCurrentUrl(link.url); setLoading(true); }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-card border border-border hover:border-primary/30 transition-all text-sm"
                >
                  <span>{link.icon}</span>
                  <span>{link.name}</span>
                  <ExternalLink className="w-3 h-3 text-muted-foreground" />
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <iframe
            src={currentUrl}
            className="w-full h-full border-0"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
            onLoad={() => setLoading(false)}
            title="Proxy Browser"
          />
        )}

        {/* Loading overlay */}
        {loading && currentUrl && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-muted-foreground">Routing through proxy...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}