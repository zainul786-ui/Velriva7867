import React, { useEffect } from 'react';
import { useAppState } from '../context/AppContext';
import { motion } from 'motion/react';

export const SplashScreen: React.FC = () => {
  const { navigateTo, currentUser, logo } = useAppState();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentUser && currentUser.isLoggedIn) {
        navigateTo('home');
      } else {
        navigateTo('login');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigateTo, currentUser]);

  return (
    <div
      id="splash-screen-container"
      className="flex h-screen w-full flex-col items-center justify-between border-slate-100 bg-slate-950 px-6 py-12 text-white"
    >
      {/* Top Spacer */}
      <div />

      {/* Main Logo Content */}
      <div className="flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-amber-400 font-black text-slate-950 text-3xl shadow-2xl overflow-hidden"
        >
          {logo ? (
            <img src={logo} className="h-full w-full object-cover" referrerPolicy="no-referrer" alt="Velora Logo" />
          ) : (
            <span>VL</span>
          )}
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-6 font-sans text-4xl font-black tracking-widest text-[#FFF]"
        >
          VELORA
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-2 text-xs font-semibold uppercase tracking-wider text-amber-400"
        >
          Premium Reseller Startup Engine
        </motion.p>
      </div>

      {/* Bottom Progress Bar */}
      <div className="w-full max-w-xs space-y-4">
        <div className="h-0.5 w-full bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 2.2, ease: 'easeInOut' }}
            className="h-full bg-amber-400"
          />
        </div>
        
        <div className="flex justify-between items-center text-[10px] font-semibold text-slate-400 tracking-wider">
          <span>FAST LOADING SECURITY</span>
          <span className="font-mono">v3.1.0</span>
        </div>
      </div>
    </div>
  );
};
