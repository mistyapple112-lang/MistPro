const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState } from 'react';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Key, Loader2, Copy, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

function generateKey() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const segment = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `${segment()}-${segment()}-${segment()}-${segment()}`;
}

export default function LicenseManager() {
  const queryClient = useQueryClient();
  const [copiedId, setCopiedId] = useState(null);

  const { data: keys = [], isLoading } = useQuery({
    queryKey: ['licenseKeys'],
    queryFn: () => db.entities.LicenseKey.list('-created_date'),
  });

  const createMutation = useMutation({
    mutationFn: () => db.entities.LicenseKey.create({ key: generateKey(), is_used: false, duration_days: 30 }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['licenseKeys'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => db.entities.LicenseKey.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['licenseKeys'] }),
  });

  const handleCopy = (key, id) => {
    navigator.clipboard.writeText(key);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">License Keys</h3>
        <Button
          size="sm"
          onClick={() => createMutation.mutate()}
          disabled={createMutation.isPending}
          className="bg-primary text-primary-foreground"
        >
          {createMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Plus className="w-4 h-4 mr-1" /> Generate Key
            </>
          )}
        </Button>
      </div>

      <div className="space-y-2">
        {isLoading ? (
          <div className="text-center py-8">
            <Loader2 className="w-5 h-5 animate-spin mx-auto text-muted-foreground" />
          </div>
        ) : keys.length === 0 ? (
          <div className="text-center py-8 text-sm text-muted-foreground">No keys generated yet</div>
        ) : (
          keys.map((k) => (
            <div key={k.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary border border-border gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <Key className="w-4 h-4 text-muted-foreground shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-mono truncate">{k.key}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {k.created_date && format(new Date(k.created_date), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge
                  className={k.is_used
                    ? 'bg-destructive/10 text-destructive border-destructive/20'
                    : 'bg-primary/10 text-primary border-primary/20'
                  }
                >
                  {k.is_used ? 'Used' : 'Active'}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleCopy(k.key, k.id)}
                >
                  {copiedId === k.id ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => deleteMutation.mutate(k.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}