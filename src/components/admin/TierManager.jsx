const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState } from 'react';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Loader2, Copy, Check, Palette, Settings, Save, X, Edit2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const DURATIONS = [
  { key: '1day', label: '1 Day' },
  { key: '1week', label: '1 Week' },
  { key: '1month', label: '1 Month' },
  { key: '1year', label: '1 Year' },
  { key: 'forever', label: 'Forever' },
];

const COLORS = [
  { value: 'green', label: 'Emerald', hex: '#10b981' },
  { value: 'blue', label: 'Blue', hex: '#3b82f6' },
  { value: 'purple', label: 'Purple', hex: '#a855f7' },
  { value: 'gold', label: 'Gold', hex: '#f59e0b' },
  { value: 'red', label: 'Red', hex: '#ef4444' },
  { value: 'pink', label: 'Pink', hex: '#ec4899' },
  { value: 'cyan', label: 'Cyan', hex: '#06b6d4' },
  { value: 'orange', label: 'Orange', hex: '#f97316' },
];

function generateKey() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const seg = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `MIST-${seg()}-${seg()}-${seg()}`;
}

export default function TierManager() {
  const queryClient = useQueryClient();
  const [editTier, setEditTier] = useState(null);
  const [open, setOpen] = useState(false);

  const { data: tiers = [] } = useQuery({
    queryKey: ['tiers'],
    queryFn: () => db.entities.Tier.list('sort_order'),
  });

  const { data: keys = [] } = useQuery({
    queryKey: ['licenseKeys'],
    queryFn: () => db.entities.LicenseKey.list('-created_date'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => db.entities.Tier.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['tiers'] }); setOpen(false); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => db.entities.Tier.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['tiers'] }); setEditTier(null); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => db.entities.Tier.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tiers'] }),
  });

  const generateKeyMutation = useMutation({
    mutationFn: ({ tierName, duration }) => db.entities.LicenseKey.create({ key: generateKey(), tier_name: tierName, duration, is_used: false }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['licenseKeys'] }),
  });

  const deleteKeyMutation = useMutation({
    mutationFn: (id) => db.entities.LicenseKey.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['licenseKeys'] }),
  });

  const [keyGen, setKeyGen] = useState({ tier_name: '', duration: '1month' });

  function handleCopy(key) {
    navigator.clipboard.writeText(key);
  }

  return (
    <div className="space-y-8">
      {/* Tiers Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Palette className="w-4 h-4" /> Pricing Tiers
          </h3>
          <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditTier(null); }}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-primary text-primary-foreground">
                <Plus className="w-4 h-4 mr-1" /> Add Tier
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border max-w-md">
              <DialogHeader><DialogTitle>New Tier</DialogTitle></DialogHeader>
              <TierForm
                initial={null}
                onSave={(data) => createMutation.mutate(data)}
                loading={createMutation.isPending}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tiers.map((tier) => (
            <div key={tier.id} className="rounded-xl border border-border bg-card p-5 space-y-3">
              {editTier?.id === tier.id ? (
                <TierForm
                  initial={tier}
                  onSave={(data) => updateMutation.mutate({ id: tier.id, data })}
                  loading={updateMutation.isPending}
                  onCancel={() => setEditTier(null)}
                />
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.find(c => c.value === tier.color)?.hex || '#10b981' }} />
                      <h4 className="font-bold">{tier.name}</h4>
                      <Badge variant="outline" className="text-[10px]">{tier.color}</Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditTier(tier)}>
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteMutation.mutate(tier.id)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-5 gap-1">
                    {DURATIONS.map((d) => (
                      <div key={d.key} className="text-center bg-secondary rounded-lg p-2">
                        <p className="text-[9px] text-muted-foreground">{d.label}</p>
                        <p className="text-xs font-bold">£{tier.prices?.[d.key] || 0}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {(tier.features || []).slice(0, 3).map((f, i) => (
                      <span key={i} className="text-[10px] bg-secondary px-2 py-0.5 rounded-full text-muted-foreground">{f}</span>
                    ))}
                    {(tier.features || []).length > 3 && (
                      <span className="text-[10px] bg-secondary px-2 py-0.5 rounded-full text-muted-foreground">+{tier.features.length - 3} more</span>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* License Key Generator */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Settings className="w-4 h-4" /> Generate License Keys
          </h3>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <div className="flex gap-3 flex-wrap items-end">
            <div className="w-40">
              <p className="text-[10px] font-semibold text-muted-foreground mb-1.5 uppercase">Tier</p>
              <Select value={keyGen.tier_name} onValueChange={(v) => setKeyGen({ ...keyGen, tier_name: v })}>
                <SelectTrigger className="bg-secondary border-border h-9 text-sm">
                  <SelectValue placeholder="Select tier" />
                </SelectTrigger>
                <SelectContent>
                  {tiers.map((t) => (
                    <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-32">
              <p className="text-[10px] font-semibold text-muted-foreground mb-1.5 uppercase">Duration</p>
              <Select value={keyGen.duration} onValueChange={(v) => setKeyGen({ ...keyGen, duration: v })}>
                <SelectTrigger className="bg-secondary border-border h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DURATIONS.map((d) => (
                    <SelectItem key={d.key} value={d.key}>{d.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              size="sm"
              onClick={() => generateKeyMutation.mutate(keyGen)}
              disabled={!keyGen.tier_name || generateKeyMutation.isPending}
              className="bg-primary text-primary-foreground h-9"
            >
              {generateKeyMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><Plus className="w-3.5 h-3.5 mr-1" /> Generate</>}
            </Button>
          </div>

          <div className="space-y-1.5 max-h-64 overflow-y-auto">
            {keys.length === 0 ? (
              <p className="text-xs text-muted-foreground py-4 text-center">No keys yet</p>
            ) : (
              keys.map((k) => (
                <div key={k.id} className="flex items-center justify-between p-2.5 rounded-lg bg-secondary border border-border gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Badge className={`text-[9px] shrink-0 ${k.is_used ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
                      {k.is_used ? 'USED' : 'ACTIVE'}
                    </Badge>
                    <span className="text-xs font-mono truncate">{k.key}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Badge variant="outline" className="text-[9px]">{k.tier_name}</Badge>
                    <Badge variant="outline" className="text-[9px]">{DURATIONS.find(d => d.key === k.duration)?.label || k.duration}</Badge>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleCopy(k.key)}>
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteKeyMutation.mutate(k.id)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TierForm({ initial, onSave, loading, onCancel }) {
  const [name, setName] = useState(initial?.name || '');
  const [color, setColor] = useState(initial?.color || 'green');
  const [features, setFeatures] = useState((initial?.features || ['']).join('\n'));
  const [prices, setPrices] = useState(initial?.prices || { '1day': 0, '1week': 0, '1month': 0, '1year': 0, 'forever': 0 });
  const [sortOrder, setSortOrder] = useState(initial?.sort_order || 0);

  const handleSave = () => {
    onSave({
      name,
      color,
      features: features.split('\n').filter(f => f.trim()),
      prices,
      sort_order: sortOrder,
      is_active: true,
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Input placeholder="Tier name" value={name} onChange={(e) => setName(e.target.value)} className="bg-secondary border-border h-9 text-sm" />
        <Select value={color} onValueChange={setColor}>
          <SelectTrigger className="bg-secondary border-border h-9 w-32 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {COLORS.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c.hex }} />
                  {c.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-5 gap-1">
        {DURATIONS.map((d) => (
          <div key={d.key} className="text-center">
            <p className="text-[9px] text-muted-foreground mb-0.5">{d.label}</p>
            <Input
              type="number"
              value={prices[d.key] || 0}
              onChange={(e) => setPrices({ ...prices, [d.key]: Number(e.target.value) })}
              className="bg-secondary border-border h-8 text-xs text-center"
            />
          </div>
        ))}
      </div>

      <div>
        <p className="text-[10px] text-muted-foreground mb-1">Features (one per line)</p>
        <textarea
          value={features}
          onChange={(e) => setFeatures(e.target.value)}
          rows={4}
          className="w-full bg-secondary border border-border rounded-md p-2 text-xs resize-none"
          placeholder="Proxy Browser Access&#10;Social Hub Access&#10;1 Device"
        />
      </div>

      <div className="flex gap-2">
        <Input type="number" placeholder="Sort order" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} className="bg-secondary border-border h-9 text-sm w-24" />
        <div className="flex-1 flex gap-2 justify-end">
          {onCancel && (
            <Button variant="outline" onClick={onCancel} size="sm" className="h-9">
              <X className="w-3.5 h-3.5 mr-1" /> Cancel
            </Button>
          )}
          <Button onClick={handleSave} disabled={!name || loading} size="sm" className="bg-primary text-primary-foreground h-9">
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><Save className="w-3.5 h-3.5 mr-1" /> Save</>}
          </Button>
        </div>
      </div>
    </div>
  );
}