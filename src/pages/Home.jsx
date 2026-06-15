const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { Home as HomeIcon, Grid3X3 } from 'lucide-react';
import OverviewCards from '@/components/home/OverviewCards';
import ModuleCard from '@/components/home/ModuleCard';

export default function Home() {
  const { isLicensed } = useOutletContext();

  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: () => db.entities.Product.list('sort_order')
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <HomeIcon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold">MistPro</h1>
          <p className="text-xs text-muted-foreground">Home</p>
        </div>
      </div>

      {/* Overview */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span className="text-xs font-semibold tracking-[0.1em] text-primary uppercase">Overview</span>
        </div>
        <p className="text-sm text-muted-foreground mb-4">I Messed up the code at the part in the purchase menu you don't unlock everything

        </p>
        <OverviewCards isLicensed={isLicensed} moduleCount={products.length} />
      </div>

      {/* Modules */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Grid3X3 className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs font-semibold tracking-[0.1em] text-muted-foreground uppercase">Modules</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) =>
          <ModuleCard key={product.id} product={product} isLicensed={isLicensed} />
          )}
        </div>
        {products.length === 0 &&
        <div className="text-center py-16 text-muted-foreground text-sm">
            No modules available yet.
          </div>
        }
      </div>
    </div>);

}