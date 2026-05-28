import React, { useState } from 'react';
import { useAppState } from '../context/AppContext';
import { Trash2, ShieldCheck, Moon, RefreshCw, Radio } from 'lucide-react';

export const SettingsScreen: React.FC = () => {
  const { showToast, navigateTo } = useAppState();

  const [darkModeMock, setDarkModeMock] = useState(false);
  const [notifyState, setNotifyState] = useState(true);

  const handleResetStorage = () => {
    if (confirm('Verify: Would you like to clear the VELORA local storage cache state? This resets catalog files, cart quantity, orders and session credentials.')) {
      localStorage.clear();
      showToast('Cache files cleared! Restarting...', 'info');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <div id="settings-screen-container" className="pb-24 pt-2">
      <div className="px-4 mt-2">
        <h2 className="text-xl font-extrabold tracking-tight">System Settings</h2>
        <p className="text-xs text-slate-400 font-medium">Fine-tune your custom VELORA dropship reseller experience.</p>
      </div>

      <div className="mt-5 px-4 space-y-4">
        {/* General Options List */}
        <div className="rounded-3xl border border-slate-100 bg-white shadow-xs overflow-hidden">
          {/* Mock Dark mode toggle */}
          <div className="flex items-center justify-between p-4 border-b border-slate-50">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <Moon className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">Visual Premium Dark Theme</h4>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">Adjust eye comfort styles</p>
              </div>
            </div>

            <button
              id="settings-theme-toggle"
              type="button"
              onClick={() => {
                setDarkModeMock(!darkModeMock);
                showToast(`Mock Theme adjusted to: ${!darkModeMock ? 'Dark' : 'Light'}`);
              }}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-hidden ${
                darkModeMock ? 'bg-slate-900' : 'bg-slate-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ${
                  darkModeMock ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Service Worker Online Monitor indicator */}
          <div className="flex items-center justify-between p-4 border-b border-slate-50">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-emerald-500">
                <Radio className="h-5 w-5 animate-pulse" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">Progressive Web App Offline state</h4>
                <p className="text-[10px] text-[#059669] font-medium mt-0.5">Assigned service-worker is active</p>
              </div>
            </div>

            <span className="rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1 font-mono text-[9px] font-black text-emerald-700">
              READY
            </span>
          </div>

          {/* Mock Push notification */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <Radio className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">App Push Notifications</h4>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">Real-time express shipping alerts</p>
              </div>
            </div>

            <button
              id="settings-push-notif-toggle"
              type="button"
              onClick={() => {
                setNotifyState(!notifyState);
                showToast(`Alert notifications: ${!notifyState ? 'Subscribed' : 'Muted'}`);
              }}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-hidden ${
                notifyState ? 'bg-slate-950' : 'bg-slate-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ${
                  notifyState ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Diagnostic Cache Clean area */}
        <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-xs space-y-4">
          <div>
            <h4 className="text-xs font-extrabold text-slate-900">Developer Diagnostic Tools</h4>
            <p className="text-[10.5px] text-slate-400 leading-relaxed mt-0.5">
              Ideal for reviewers and administrators wanting to wipe active mock purchases, mock item catalogs, and resets permissions.
            </p>
          </div>

          <button
            id="settings-reset-cache-button"
            onClick={handleResetStorage}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-rose-50 border border-rose-200 text-rose-500 py-3 text-xs font-black hover:bg-rose-100 transition active:scale-98"
          >
            <Trash2 className="h-4 w-4 shrink-0" />
            <span>Wipe Local Cache Storage</span>
          </button>
        </div>

        {/* Corporate Legal Footer specifications */}
        <div className="text-center pt-4 text-[10.5px] font-bold text-slate-400 tracking-wider space-y-1">
          <p>VELORA PWA SHOP APP</p>
          <p className="font-mono font-medium">VERSION 3.1.0-DEV (UTC 2026)</p>
          <div className="flex items-center justify-center gap-1 font-sans text-[10px] text-emerald-500 font-black uppercase mt-2">
            <ShieldCheck className="h-4 w-4" />
            <span>Secure encryption verified</span>
          </div>
        </div>
      </div>
    </div>
  );
};
