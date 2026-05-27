import React, { useState } from 'react';
import { useAppState } from '../context/AppContext';
import { ShieldCheck, Mail, Heart, Phone, Sparkles, Lock } from 'lucide-react';

export const LoginRegisterScreen: React.FC = () => {
  const { loginUser, registerUser, navigateTo } = useAppState();

  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (!password.trim()) {
      setErrorMsg('Password field is strictly required.');
      return;
    }

    if (isRegister) {
      if (!name.trim()) {
        setErrorMsg('Please specify a client username.');
        return;
      }
      if (!phone.trim()) {
        setErrorMsg('Mobile phone number is strictly required.');
        return;
      }
      if (password.length < 4) {
        setErrorMsg('Password must be at least 4 characters.');
        return;
      }

      setErrorMsg('Initializing client registration... Please wait.');
      const result = await registerUser(name, email, password, phone);
      if (result === true) {
        navigateTo('profile');
      } else {
        setErrorMsg(result as string);
      }
    } else {
      setErrorMsg('Authenticating profile keys... Please wait.');
      const result = await loginUser(email, password);
      if (result === true) {
         navigateTo('profile');
      } else {
        setErrorMsg(result as string);
      }
    }
  };

  return (
    <div id="login-screen-container" className="pb-24 pt-4 px-4 flex flex-col justify-between min-h-[500px]">
      <div className="space-y-6">
        {/* Screen header branding card */}
        <div className="text-center mt-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-950 font-black text-amber-400 text-lg shadow-md">
            VR
          </div>
          <h2 className="text-xl font-black text-slate-900 mt-4 tracking-tight">
            {isRegister ? 'Join VELRIVA Reseller' : 'Validate Customer Vault'}
          </h2>
          <p className="text-xs text-slate-400 max-w-[210px] mx-auto mt-1">
            {isRegister
              ? 'Initiate a professional reseller profile to purchase and sync your live orders.'
              : 'Secure Email & Password authentication keys login.'}
          </p>
        </div>

        {/* Login vs Register picker links */}
        <div className="flex border-b border-slate-100 text-xs font-bold font-sans">
          <button
            id="tab-login-btn"
            type="button"
            onClick={() => {
              setIsRegister(false);
              setErrorMsg('');
            }}
            className={`flex-1 pb-2.5 text-center transition border-b-2 ${
              !isRegister ? 'border-slate-950 text-slate-900 font-black' : 'border-transparent text-slate-400'
            }`}
          >
            Access Vault
          </button>
          
          <button
            id="tab-register-btn"
            type="button"
            onClick={() => {
              setIsRegister(true);
              setErrorMsg('');
            }}
            className={`flex-1 pb-2.5 text-center transition border-b-2 ${
              isRegister ? 'border-slate-950 text-slate-900 font-black' : 'border-transparent text-slate-400'
            }`}
          >
            Create Profile
          </button>
        </div>

        {/* Interactive form element */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {isRegister && (
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Your Full Name</label>
              <input
                id="login-name-field"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Kenji Vance"
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-xs font-bold text-slate-800 placeholder-slate-400 focus:border-slate-800 focus:outline-hidden"
              />
            </div>
          )}

          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Email Electronic Address</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 h-4 w-4 text-slate-400" />
              <input
                id="login-email-field"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vip-reseller@velriva.com"
                className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3.5 py-3 text-xs font-bold text-slate-800 placeholder-slate-400 focus:border-slate-800 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Security Password</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 h-4 w-4 text-slate-400" />
              <input
                id="login-password-field"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3.5 py-3 text-xs font-bold text-slate-850 placeholder-slate-400 focus:border-slate-800 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
              Telephone Mobile Number {isRegister && <span className="text-rose-500 font-extrabold">*</span>}
            </label>
            <div className="relative flex items-center">
              <Phone className="absolute left-3.5 h-4 w-4 text-slate-400" />
              <input
                id="login-phone-field"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +91 96909 00000"
                className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3.5 py-3 text-xs font-bold text-slate-800 placeholder-slate-400 focus:border-slate-800 focus:outline-hidden"
              />
            </div>
            {!isRegister && (
              <p className="text-[9px] text-slate-400 mt-1 font-medium">For default demo login use: <span className="font-mono text-slate-650 font-bold bg-slate-100 px-1 py-0.5 rounded-sm">zainulamaan4@gmail.com</span> with password <span className="font-mono text-slate-650 font-bold bg-slate-100 px-1 py-0.5 rounded-sm">password123</span></p>
            )}
          </div>

          {errorMsg && (
            <p className="text-[11px] font-bold text-rose-500 bg-rose-50 border border-slate-100 p-2.5 rounded-xl">
              ⚠️ {errorMsg}
            </p>
          )}

          {/* Core submission trigger button */}
          <button
            id="login-submit-button"
            type="submit"
            className="w-full rounded-2xl bg-slate-950 text-white py-3.5 text-xs font-black hover:bg-slate-900 transition active:scale-95 shadow-md"
          >
            {isRegister ? 'Sign Up Partner Profile' : 'Authenticate Session Access Key'}
          </button>
        </form>
      </div>

      {/* Security note */}
      <div className="flex items-center justify-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-wide bg-indigo-50 p-2.5 rounded-2xl border border-indigo-100 mt-6">
        <Sparkles className="h-4.5 w-4.5 fill-current" />
        <span>Instantly loads and restores your saved items and orders!</span>
      </div>
    </div>
  );
};
