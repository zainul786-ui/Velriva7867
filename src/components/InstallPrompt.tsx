import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, X, Plus } from 'lucide-react';

export const InstallPrompt: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show prompt promptly after 2.5 seconds on every page load/refresh
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const handleInstall = () => {
    setIsVisible(false);
    alert('Thank you! To install VELORA: Tap the browser share/menu button and select "Add to Home Screen" to launch with full fast-cache offline mode.');
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          id="pwa-install-prompt"
          initial={{ opacity: 0, y: 70 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          className="fixed bottom-20 left-4 right-4 z-40 mx-auto max-w-sm rounded-[24px] border border-slate-900 bg-slate-950 p-4 text-white shadow-2xl"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-400 font-black text-slate-950 text-sm shadow-md">
                VR
              </div>
              <div>
                <h4 className="text-xs font-black tracking-wide text-amber-400">VELORA INSTANT</h4>
                <p className="text-[11px] font-medium text-slate-300 leading-relaxed max-w-[190px]">
                  Install our lightweight app to get instant delivery monitoring & offline orders.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="pwa-install-action"
                onClick={handleInstall}
                className="flex items-center gap-1 rounded-xl bg-amber-400 px-3 py-2 text-xs font-bold text-slate-950 hover:bg-amber-300 active:scale-95"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Install</span>
              </button>

              <button
                id="pwa-dismiss-btn"
                onClick={handleDismiss}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-slate-400 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
