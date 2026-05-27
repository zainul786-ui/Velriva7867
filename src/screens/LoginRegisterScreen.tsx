import React, { useState } from 'react';
import { useAppState } from '../context/AppContext';
import { Mail, Phone, Lock, User, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';

export const LoginRegisterScreen: React.FC = () => {
  const { loginUser, registerUser, navigateTo } = useAppState();

  const [logoClicks, setLogoClicks] = useState(0);
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Hidden admin easter egg trigger
  const handleLogoClick = () => {
    setLogoClicks(curr => {
      const next = curr + 1;
      if (next >= 5) {
        navigateTo('adminLogin');
        return 0;
      }
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    if (!password.trim()) {
      setErrorMsg('Password is required.');
      setLoading(false);
      return;
    }

    if (isRegister) {
      if (!name.trim()) {
        setErrorMsg('Please specify your name.');
        setLoading(false);
        return;
      }
      if (!phone.trim()) {
        setErrorMsg('Phone number is required.');
        setLoading(false);
        return;
      }
      if (password.length < 4) {
        setErrorMsg('Password must be at least 4 characters.');
        setLoading(false);
        return;
      }

      const result = await registerUser(name, email, password, phone);
      setLoading(false);
      if (result === true) {
        navigateTo('home');
      } else {
        setErrorMsg(result as string);
      }
    } else {
      const result = await loginUser(email, password);
      setLoading(false);
      if (result === true) {
        navigateTo('home');
      } else {
        setErrorMsg(result as string);
      }
    }
  };

  return (
    <div id="login-screen-container" className="min-h-screen bg-slate-50 flex flex-col justify-between px-4 py-8">
      {/* Upper Section */}
      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full space-y-8">
        {/* Branding & Easter-egg */}
        <div className="text-center">
          <div
            onClick={handleLogoClick}
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-950 font-black text-amber-400 text-xl shadow-xl hover:scale-105 active:scale-95 transition cursor-pointer select-none"
          >
            VR
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-5 tracking-tight">
            {isRegister ? 'Create Reseller Account' : 'Welcome to VELRIVA'}
          </h2>
          <p className="text-xs text-slate-500 max-w-[260px] mx-auto mt-1.5 leading-relaxed">
            {isRegister
              ? 'Join our premium B2B network to catalog orders, view bulk lists, and grow your dropship operations.'
              : 'Please enter your login credentials to unlock your customer catalog.'}
          </p>
        </div>

        {/* Tab Selection Switch */}
        <div className="bg-slate-100 p-1 rounded-xl flex">
          <button
            id="tab-login-btn"
            type="button"
            onClick={() => {
              setIsRegister(false);
              setErrorMsg('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
              !isRegister
                ? 'bg-white text-slate-950 shadow-sm'
                : 'text-slate-500 hover:text-slate-950'
            }`}
          >
            Sign In
          </button>
          
          <button
            id="tab-register-btn"
            type="button"
            onClick={() => {
              setIsRegister(true);
              setErrorMsg('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
              isRegister
                ? 'bg-white text-slate-950 shadow-sm'
                : 'text-slate-500 hover:text-slate-950'
            }`}
          >
            Create Partner Profile
          </button>
        </div>

        {/* Auth card Form */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4">
          
          {/* 1. Name Input Field (Register Only) */}
          {isRegister && (
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Your Full Name</label>
              <div className="relative flex items-center">
                <User className="absolute left-3.5 h-4 w-4 text-slate-400" />
                <input
                  id="login-name-field"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Zain Ul Amaan"
                  className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3.5 py-3 text-xs font-bold text-slate-800 placeholder-slate-400 focus:border-slate-800 focus:outline-hidden transition"
                />
              </div>
            </div>
          )}

          {/* 2. Email Address (Both) */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Email Address</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 h-4 w-4 text-slate-400" />
              <input
                id="login-email-field"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3.5 py-3 text-xs font-bold text-slate-800 placeholder-slate-400 focus:border-slate-800 focus:outline-hidden transition"
              />
            </div>
          </div>

          {/* 3. Password (Both) */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Password</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 h-4 w-4 text-slate-400" />
              <input
                id="login-password-field"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3.5 py-3 text-xs font-bold text-slate-800 placeholder-slate-400 focus:border-slate-800 focus:outline-hidden transition"
              />
            </div>
          </div>

          {/* 4. Phone Number (Register Only!) */}
          {isRegister && (
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                WhatsApp / Phone Number
              </label>
              <div className="relative flex items-center">
                <Phone className="absolute left-3.5 h-4 w-4 text-slate-400" />
                <input
                  id="login-phone-field"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 96909 xxxxx"
                  className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3.5 py-3 text-xs font-bold text-slate-800 placeholder-slate-400 focus:border-slate-800 focus:outline-hidden transition"
                />
              </div>
            </div>
          )}

          {/* Error Feedbacks */}
          {errorMsg && (
            <div className="text-[11px] font-black text-rose-500 bg-rose-50/70 border border-rose-100 p-3 rounded-xl flex items-start gap-2 animate-pulse">
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Main Submit Action */}
          <button
            id="login-submit-button"
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-slate-950 text-white py-3.5 text-xs font-black hover:bg-slate-900 transition active:scale-[0.98] shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>{loading ? 'Processing...' : isRegister ? 'Register Reseller Code' : 'Access Secure Vault'}</span>
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>
      </div>

      {/* Safety Banner */}
      <div className="max-w-sm mx-auto w-full mt-8">
        <div className="flex items-center gap-2.5 text-[10px] font-black text-indigo-700 uppercase tracking-wide bg-indigo-50/80 p-3.5 rounded-2xl border border-indigo-100">
          <Sparkles className="h-4.5 w-4.5 text-indigo-500 fill-indigo-100 shrink-0" />
          <span>Real-time persistence layer active. All inventory changes sync programmatically.</span>
        </div>
      </div>
    </div>
  );
};
