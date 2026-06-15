import React, { useState } from 'react';
import { Shield, AlertCircle, ArrowRight, Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const ADMIN_CODE = '2104';

export default function AdminAuth({ onAuthenticated }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code === ADMIN_CODE) {
      sessionStorage.setItem('mistpro_admin', 'true');
      onAuthenticated();
    } else {
      setError('Invalid admin code');
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-accent" />
          </div>
          <h2 className="text-xl font-bold">Admin Access</h2>
          <p className="text-sm text-muted-foreground mt-1">Enter admin code to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="Enter admin code"
            value={code}
            onChange={(e) => { setCode(e.target.value); setError(''); }}
            className="h-12 bg-secondary border-border text-center text-lg tracking-[0.3em] font-mono"
          />
          {error && (
            <div className="flex items-center justify-center gap-2 text-destructive text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
          <Button type="submit" className="w-full h-12 bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
            Access Panel
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </form>
      </motion.div>
    </div>
  );
}