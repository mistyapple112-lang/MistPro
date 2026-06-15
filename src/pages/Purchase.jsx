const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';
import { 
  Key, ShieldCheck, AlertCircle, Loader2, Zap, Crown, 
  Clock, Check, ExternalLink, Copy, Sparkles
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

const SKRILL_EMAIL = '362852067';
const DURATIONS = [
  { key: '1day', label: '1 Day' },
  { key: '1week', label: '1 Week' },
  { key: '1month', label: '1 Month' },
  { key: '1year', label: '1 Year' },
  { key: 'forever', label: 'Forever', badge: 'BEST' },
];

const TIER_COLORS = {
  green: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', glow: 'glow-green', gradient: 'from-emerald-500 to-teal-500' },
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30', glow: '', gradient: 'from-blue-500 to-cyan-500' },
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30', glow: '', gradient: 'from-purple-500 to-pink-500' },
  gold: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', glow: '', gradient: 'from-amber-500 to-orange-500' },
};

export default function Purchase() {
  const { isLicensed, setIsLicensed } = useOutletContext();
  const [view, setView] = useState('tiers');
  const [selectedTier, setSelectedTier] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState('1month');
  const [licenseKey, setLicenseKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const { data: tiers = [] } = useQuery({
    queryKey: ['tiers'],
    queryFn: () => db.entities.Tier.list('sort_order'),
  });

  const handleSelectTier = (tier) => {
    setSelectedTier(tier);
    setView('checkout');
  };

  const handleBuy = () => {
    const skrillUrl = `https://www.skrill.com/en/send-money?email=${SKRILL_EMAIL}`;
    window.open(skrillUrl, '_blank');
    setView('payment');
  };

  const handleActivateKey = async () => {
    if (!licenseKey.trim()) { setError('Enter a license key'); return; }
    setLoading(true);
    setError('');
    const keys = await db.entities.LicenseKey.filter({ key: licenseKey.trim() });
    if (keys.length === 0) { setError('Invalid license key'); setLoading(false); return; }
    const k = keys[0];
    if (k.is_used) { setError('This key has already been used'); setLoading(false); return; }
    await db.entities.LicenseKey.update(k.id, { is_used: true, used_date: new Date().toISOString() });
    localStorage.setItem('mistpro_licensed', 'true');
    setIsLicensed(true);
    setSuccess(true);
    setLoading(false);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(SKRILL_EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getPrice = () => {
    if (!selectedTier?.prices) return 0;
    return selectedTier.prices[selectedDuration] || 0;
  };

  if (success || isLicensed) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-4 max-w-sm">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto glow-green">
            <ShieldCheck className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">License Active</h2>
          <p className="text-sm text-muted-foreground">All MistPro modules are now unlocked.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <AnimatePresence mode="wait">
        {view === 'tiers' && (
          <motion.div key="tiers" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            {/* Header */}
            <div className="text-center mb-10">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 glow-green">
                <Crown className="w-7 h-7 text-primary" />
              </div>
              <h1 className="text-2xl font-bold">Choose Your Plan</h1>
              <p className="text-sm text-muted-foreground mt-1">One license unlocks every module on this platform</p>
            </div>

            {/* Tier Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {tiers.filter(t => t.is_active).map((tier) => {
                const c = TIER_COLORS[tier.color] || TIER_COLORS.green;
                return (
                  <motion.button
                    key={tier.id}
                    whileHover={{ y: -4 }}
                    onClick={() => handleSelectTier(tier)}
                    className={`rounded-xl border p-6 text-left transition-all duration-300 bg-card hover:border-primary/40 relative overflow-hidden group ${c.glow || ''}`}
                  >
                    <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-5 group-hover:opacity-10 transition-opacity bg-gradient-to-br ${c.gradient}`} />
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${c.bg}`}>
                      <Zap className={`w-5 h-5 ${c.text}`} />
                    </div>
                    <h3 className="font-bold text-lg mb-1">{tier.name}</h3>
                    <div className="flex items-baseline gap-0.5 mb-3">
                      <span className="text-2xl font-extrabold">£{tier.prices?.['1month'] || 0}</span>
                      <span className="text-xs text-muted-foreground">/month</span>
                    </div>
                    <ul className="space-y-2 mb-4">
                      {(tier.features || []).slice(0, 4).map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <Check className="w-3 h-3 text-primary mt-0.5 shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <div className={`text-xs font-semibold ${c.text} flex items-center gap-1`}>
                      Select Plan <ExternalLink className="w-3 h-3" />
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Already have key */}
            <div className="border-t border-border pt-8">
              <div className="max-w-md mx-auto">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Already have a key?</p>
                <div className="flex gap-2">
                  <Input
                    placeholder="XXXX-XXXX-XXXX-XXXX"
                    value={licenseKey}
                    onChange={(e) => { setLicenseKey(e.target.value); setError(''); }}
                    className="bg-secondary border-border font-mono"
                  />
                  <Button onClick={handleActivateKey} disabled={loading} className="bg-primary text-primary-foreground shrink-0">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Activate'}
                  </Button>
                </div>
                {error && <div className="flex items-center gap-2 text-destructive text-sm mt-2"><AlertCircle className="w-4 h-4" />{error}</div>}
              </div>
            </div>
          </motion.div>
        )}

        {view === 'checkout' && selectedTier && (
          <motion.div key="checkout" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-lg mx-auto">
            <button onClick={() => setView('tiers')} className="text-sm text-muted-foreground hover:text-foreground mb-6">&larr; Back to plans</button>
            
            <div className="rounded-xl border border-border bg-card p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${TIER_COLORS[selectedTier.color]?.bg || 'bg-primary/10'}`}>
                  <Zap className={`w-5 h-5 ${TIER_COLORS[selectedTier.color]?.text || 'text-primary'}`} />
                </div>
                <div>
                  <h2 className="text-lg font-bold">{selectedTier.name}</h2>
                  <p className="text-xs text-muted-foreground">Select duration</p>
                </div>
              </div>

              {/* Duration Selector */}
              <div className="grid grid-cols-5 gap-2">
                {DURATIONS.map((d) => {
                  const price = selectedTier.prices?.[d.key] || 0;
                  const active = selectedDuration === d.key;
                  return (
                    <button
                      key={d.key}
                      onClick={() => setSelectedDuration(d.key)}
                      className={`rounded-lg border p-3 text-center transition-all relative ${
                        active
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-muted-foreground/30 bg-secondary'
                      }`}
                    >
                      {d.badge && (
                        <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[9px] px-1.5 py-0">BEST</Badge>
                      )}
                      <Clock className={`w-4 h-4 mx-auto mb-1 ${active ? 'text-primary' : 'text-muted-foreground'}`} />
                      <p className={`text-xs font-medium ${active ? 'text-foreground' : 'text-muted-foreground'}`}>{d.label}</p>
                      <p className={`text-sm font-bold mt-0.5 ${active ? 'text-primary' : 'text-foreground'}`}>£{price}</p>
                    </button>
                  );
                })}
              </div>

              {/* Total & Features */}
              <div className="bg-secondary rounded-xl p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total</span>
                  <span className="text-xl font-bold">£{getPrice()}</span>
                </div>
                <div className="border-t border-border pt-3">
                  <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Includes</p>
                  {(selectedTier.features || []).map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground py-0.5">
                      <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={handleBuy} className="w-full h-12 bg-primary text-primary-foreground font-semibold text-base">
                Pay £{getPrice()} via Skrill
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>

              <p className="text-[11px] text-center text-muted-foreground/50">
                You'll be redirected to Skrill to complete payment. After payment, message us with your proof and we'll send your license key.
              </p>
            </div>
          </motion.div>
        )}

        {view === 'payment' && (
          <motion.div key="payment" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-lg mx-auto">
            <button onClick={() => setView('checkout')} className="text-sm text-muted-foreground hover:text-foreground mb-6">&larr; Back</button>
            
            <div className="rounded-xl border border-border bg-card p-6 md:p-8 space-y-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto glow-green">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl font-bold">Complete Your Payment</h2>
              <p className="text-sm text-muted-foreground">Send £{getPrice()} via Skrill</p>

              <div className="bg-secondary rounded-xl p-5 space-y-3 text-left">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Skrill Recipient</p>
                <div className="flex items-center justify-between bg-background rounded-lg p-3 border border-border">
                  <span className="text-sm font-mono">{SKRILL_EMAIL}</span>
                  <Button variant="ghost" size="sm" onClick={handleCopyEmail}>
                    {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Send exactly <strong>£{getPrice()}</strong> for <strong>{selectedTier?.name} — {DURATIONS.find(d => d.key === selectedDuration)?.label}</strong>
                </p>
              </div>

              <div className="space-y-2">
                <a href={`https://www.skrill.com/en/send-money?email=${SKRILL_EMAIL}`} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full h-12 bg-primary text-primary-foreground font-semibold">
                    Open Skrill <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </a>
                <p className="text-[11px] text-muted-foreground/50">After sending payment, contact admin with your proof to receive your license key.</p>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Enter received key</p>
                <div className="flex gap-2">
                  <Input
                    placeholder="XXXX-XXXX-XXXX-XXXX"
                    value={licenseKey}
                    onChange={(e) => { setLicenseKey(e.target.value); setError(''); }}
                    className="bg-secondary border-border font-mono"
                  />
                  <Button onClick={handleActivateKey} disabled={loading} className="bg-primary text-primary-foreground shrink-0">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Activate'}
                  </Button>
                </div>
                {error && <div className="flex items-center gap-2 text-destructive text-sm mt-2"><AlertCircle className="w-4 h-4" />{error}</div>}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}