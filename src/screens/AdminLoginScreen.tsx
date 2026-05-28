import React, { useState } from 'react';
import { useAppState } from '../context/AppContext';
import { KeyRound, ShieldAlert, ArrowRight, ArrowLeft } from 'lucide-react';

export const AdminLoginScreen: React.FC = () => {
  const { loginAdmin, navigateTo, showToast, logo } = useAppState();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleAdminVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedUser = username.trim().toLowerCase();
    if ((normalizedUser === 'velriva7867@gmail.com' || normalizedUser === 'velora068@gmail.com') && (password === 'velriva@786' || password === 'velriva7867' || password === 'velora@786')) {
      const success = loginAdmin();
      if (success) {
        navigateTo('adminDashboard');
      }
    } else {
      setErrorMsg('Invalid administrative credentials keys. Try again.');
      showToast('Admin verification failed.', 'error');
    }
  };

  // Quick helper to fill in simulation keys instantly for the user review!
  const handleAutofillSimulatorCredentials = () => {
    setUsername('velora068@gmail.com');
    setPassword('velora@786');
    setErrorMsg('');
  };

  return (
    <div id="admin-login-screen" className="pb-24 pt-6 px-4 flex flex-col justify-between min-h-[500px] relative">
      {/* Back to home customer login screen */}
      <button
        id="admin-login-back-btn"
        onClick={() => navigateTo('login')}
        className="absolute top-4 left-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition active:scale-95 hover:bg-slate-50 cursor-pointer"
        title="Return to Customer Portal"
      >
        <ArrowLeft className="h-4.5 w-4.5" />
      </button>

      <div className="space-y-6 mt-10">
        {/* Screen Header Banner */}
        <div className="text-center mt-3 border-b border-slate-100 pb-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-950 font-black text-amber-400 text-lg shadow-md overflow-hidden p-0">
            {logo ? (
              <img src={logo} className="h-full w-full object-cover" referrerPolicy="no-referrer" alt="Velora Logo" />
            ) : (
              <span>VL</span>
            )}
          </div>
          <h2 className="text-xl font-black text-slate-900 mt-4 tracking-tight">Staff Entrance Portal</h2>
          <p className="text-xs text-slate-400 max-w-[215px] mx-auto mt-1">
            Access secure store administration, manage orders, update inventories, and view charts analytics.
          </p>
        </div>

        {/* Callout box displaying simulation credentials */}
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-black text-amber-800">
            <ShieldAlert className="h-4.5 w-4.5 shrink-0" />
            <span>Review Demonstration Keys</span>
          </div>
          <p className="text-[10.5px] text-slate-600 leading-normal font-medium">
            To view the full inventory CRUD, orders and graphs, use these credentials or tap the autofill simulator helper button below.
          </p>
          <div className="flex flex-col gap-1.5 bg-white border border-amber-100 rounded-xl px-3 py-2 text-[10.5px] font-mono leading-none font-bold text-slate-700">
            <div>Email: <strong className="text-slate-950">velora068@gmail.com</strong></div>
            <div>Password: <strong className="text-slate-950">velora@786</strong></div>
          </div>

          <button
            id="autofill-credentials-helper"
            type="button"
            onClick={handleAutofillSimulatorCredentials}
            className="w-full mt-2 rounded-xl bg-amber-400 hover:bg-amber-350 text-slate-950 py-2 text-[10.5px] font-black tracking-wide"
          >
            One-Tap Autofill Simulation
          </button>
        </div>

        {/* Inputs */}
        <form onSubmit={handleAdminVerifySubmit} className="space-y-4 pt-1">
          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Administrative Email Address</label>
            <input
              id="admin-username-field"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. Velriva7867@gmail.com"
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-xs font-bold text-slate-800 placeholder-slate-400 focus:border-slate-800 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Staff Secure Passcode</label>
            <div className="relative flex items-center">
              <KeyRound className="absolute left-3.5 h-4 w-4 text-slate-400" />
              <input
                id="admin-password-field"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3.5 py-3 text-xs font-bold text-slate-800 placeholder-slate-455 focus:border-slate-855 focus:outline-hidden"
              />
            </div>
          </div>

          {errorMsg && (
            <p className="text-[11px] font-bold text-rose-500 bg-rose-50 border border-rose-100 p-2.5 rounded-xl">
              ⚠️ {errorMsg}
            </p>
          )}

          {/* Core submit action */}
          <button
            id="admin-login-submit-button"
            type="submit"
            className="w-full rounded-2xl bg-slate-950 text-white py-3.5 text-xs font-black hover:bg-slate-900 transition active:scale-95 shadow-md"
          >
            Verify Staff Credentials Keys
          </button>
        </form>
      </div>

      {/* Corporate Compliance Note */}
      <div className="text-center text-[9.5px] font-bold text-slate-400 uppercase tracking-widest mt-6">
        VELORA GLOBAL LTD. SECURE INGRESS SYSTEMS
      </div>
    </div>
  );
};
