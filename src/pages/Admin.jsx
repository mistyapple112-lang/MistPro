import React, { useState } from 'react';
import { Settings, Package, Key } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminAuth from '@/components/admin/AdminAuth';
import ProductManager from '@/components/admin/ProductManager';
import TierManager from '@/components/admin/TierManager';

export default function Admin() {
  const [authed, setAuthed] = useState(sessionStorage.getItem('mistpro_admin') === 'true');

  if (!authed) {
    return <AdminAuth onAuthenticated={() => setAuthed(true)} />;
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
          <Settings className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <p className="text-xs text-muted-foreground">Manage tiers, modules & license keys</p>
        </div>
      </div>

      <Tabs defaultValue="tiers" className="space-y-6">
        <TabsList className="bg-secondary border border-border">
          <TabsTrigger value="tiers" className="flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5" /> Tiers & Pricing
          </TabsTrigger>
          <TabsTrigger value="modules" className="flex items-center gap-1.5">
            <Settings className="w-3.5 h-3.5" /> Modules
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tiers">
          <TierManager />
        </TabsContent>

        <TabsContent value="modules">
          <div className="rounded-xl border border-border bg-card p-6">
            <ProductManager />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}