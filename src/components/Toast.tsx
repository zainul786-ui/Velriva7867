import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useAppState } from '../context/AppContext';

export const Toast: React.FC = () => {
  const { toast } = useAppState();

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          id="toast-notification"
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          className="fixed bottom-24 left-4 right-4 z-50 mx-auto flex max-w-sm items-center gap-3 rounded-2xl bg-slate-900/95 p-4 text-white shadow-2xl backdrop-blur-md"
        >
          {toast.type === 'success' && <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />}
          {toast.type === 'error' && <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0" />}
          {toast.type === 'info' && <Info className="h-5 w-5 text-blue-400 shrink-0" />}
          
          <div className="flex-1 text-sm font-medium">{toast.message}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
