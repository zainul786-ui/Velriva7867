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
    if ((normalizedUser === 'zainulamaan4@gmail.com' || normalizedUser === 'aryandivakir@gmail.com') && (password === 'velriva@786' || password === 'zainul@786' || password === 'velriva7867' || password === 'zainulamaan4')) {
      const success = loginAdmin();
      if (success) {
        navigateTo('adminDashboard');
      }
    } else {
      setErrorMsg('Invalid administrative credentials keys. Try again.');
      showToast('Admin verification failed.', 'error');
    }
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
            <img src={logo || '/icon.svg'} className="h-full w-full object-cover animate-fadeIn" referrerPolicy="no-referrer" alt="Velriva Logo" />
          </div>
          <h2 className="text-xl font-black text-slate-900 mt-4 tracking-tight">Staff Entrance Portal</h2>
          <p className="text-xs text-slate-400 max-w-[215px] mx-auto mt-1">
            Access secure store administration, manage orders, update inventories, and view charts analytics.
          </p>
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
              placeholder="e.g. zainulamaan4@gmail.com or aryandivakir@gmail.com"
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
        VELRIVA GLOBAL LTD. SECURE INGRESS SYSTEMS
      </div>
    </div>
  );
};
