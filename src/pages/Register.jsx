const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState } from 'react';

import { Link } from 'react-router-dom';
import { Zap, Mail, Lock, ArrowRight, Loader2, AlertCircle, KeyRound } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

export default function Register() {
  const [step, setStep] = useState('register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }
    setLoading(true);
    setError('');
    try {
      await db.auth.register({ email, password });
      setStep('otp');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await db.auth.verifyOtp({ email, otpCode: otp });
      db.auth.setToken(res.access_token);
      window.location.href = '/';
    } catch (err) {
      setError(err.message || 'Verification failed');
      setLoading(false);
    }
  };

  const handleResend = async () => {
    await db.auth.resendOtp(email);
  };

  const handleGoogle = () => {
    db.auth.loginWithProvider('google', '/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Zap className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">{step === 'register' ? 'Create Account' : 'Verify Email'}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {step === 'register' ? 'Sign up for MistPro' : `Enter the code sent to ${email}`}
          </p>
        </div>

        {step === 'register' ? (
          <>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 h-12 bg-secondary border-border" required />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 h-12 bg-secondary border-border" required />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type="password" placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="pl-10 h-12 bg-secondary border-border" required />
              </div>
              {error && <div className="flex items-center gap-2 text-destructive text-sm"><AlertCircle className="w-4 h-4" />{error}</div>}
              <Button type="submit" disabled={loading} className="w-full h-12 bg-primary text-primary-foreground font-semibold">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Create Account <ArrowRight className="w-4 h-4 ml-2" /></>}
              </Button>
            </form>
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center"><span className="bg-background px-3 text-xs text-muted-foreground">or</span></div>
            </div>
            <Button variant="outline" onClick={handleGoogle} className="w-full h-12 border-border">Continue with Google</Button>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
            </p>
          </>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-center">
              <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                <InputOTPGroup>
                  {[0,1,2,3,4,5].map(i => <InputOTPSlot key={i} index={i} className="bg-secondary border-border w-12 h-12" />)}
                </InputOTPGroup>
              </InputOTP>
            </div>
            {error && <div className="flex items-center justify-center gap-2 text-destructive text-sm"><AlertCircle className="w-4 h-4" />{error}</div>}
            <Button onClick={handleVerify} disabled={loading || otp.length < 6} className="w-full h-12 bg-primary text-primary-foreground font-semibold">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify'}
            </Button>
            <button onClick={handleResend} className="w-full text-center text-sm text-muted-foreground hover:text-foreground">Resend code</button>
          </div>
        )}
      </div>
    </div>
  );
}