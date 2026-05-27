import React from 'react';
import { useAppState } from '../context/AppContext';
import { CheckCircle, ArrowRight, Truck, ShoppingBag, Eye } from 'lucide-react';
import { motion } from 'motion/react';

export const CODSuccessScreen: React.FC = () => {
  const { navigation, navigateTo } = useAppState();

  const order = navigation.params?.order;

  if (!order) {
    return (
      <div className="flex h-96 flex-col items-center justify-center p-6 text-center">
        <p className="font-bold text-slate-800">No order context found</p>
        <button
          onClick={() => navigateTo('home')}
          className="mt-4 rounded-xl bg-slate-950 px-4 py-2 text-xs font-bold text-white"
        >
          Return Home
        </button>
      </div>
    );
  }

  const handleTrackOrderRedirect = () => {
    navigateTo('trackOrder', { orderId: order.id });
  };

  return (
    <div id="cod-success-screen" className="pb-24 pt-8 px-5 flex flex-col items-center">
      {/* 1. Large bouncing checkmark trigger */}
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 12, stiffness: 200 }}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xl"
      >
        <CheckCircle className="h-9 w-9 fill-current text-white bg-transparent" />
      </motion.div>

      <h2 className="mt-4.5 text-lg font-black tracking-tight text-slate-900 text-center">
        Express Dispatch Initiated!
      </h2>
      <p className="text-xs text-slate-500 font-medium text-center max-w-[240px] mt-1 leading-relaxed">
        Your COD Order has been successfully submitted under local ID verification checks.
      </p>

      {/* 2. Paper Invoice Receipt Card */}
      <div className="w-full mt-6 bg-white border border-slate-100 rounded-3xl p-5 space-y-4 shadow-xs relative overflow-hidden">
        {/* Jagged paper ticket cutout simulator effect */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-100/40 border-b border-dashed border-slate-200" />
        
        <div className="pt-2 text-center">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Order Invoice ID</span>
          <p className="font-mono font-black text-slate-950 text-base mt-0.5">{order.id}</p>
        </div>

        <div className="h-[1px] w-full bg-slate-100" />

        {/* Transaction stats */}
        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center text-slate-500">
            <span>Payment Method</span>
            <span className="font-bold text-slate-950 uppercase text-[10px] bg-slate-100 px-2 py-0.5 rounded-md">
              Cash on Delivery (COD)
            </span>
          </div>

          <div className="flex justify-between items-center text-slate-500">
            <span>Status</span>
            <span className="font-extrabold text-[#059669] flex items-center gap-1">
              ● Pending Verification
            </span>
          </div>

          <div className="flex justify-between items-center text-slate-500">
            <span>Delivery Timeline</span>
            <span className="font-bold text-slate-900">3 - 5 Working Days</span>
          </div>
        </div>

        <div className="h-[1px] w-full bg-slate-100" />

        {/* Shipping address recap */}
        <div className="text-xs space-y-1.5">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Shipping address</span>
          <p className="font-extrabold text-slate-800 leading-none">{order.shippingAddress.name}</p>
          <p className="text-slate-500 leading-normal">
            {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
          </p>
          <p className="text-[11px] font-mono font-bold text-slate-500">Tel: {order.shippingAddress.phone}</p>
        </div>

        <div className="h-[1px] w-full bg-slate-100" />

        {/* Totals */}
        <div className="flex justify-between items-center pt-1 font-bold">
          <span className="text-slate-800 text-xs">Final Invoice Sum</span>
          <span className="font-mono font-black text-slate-950 text-base">${order.total}</span>
        </div>
      </div>

      {/* 3. Action redirects panel */}
      <div className="w-full mt-6 space-y-3">
        {/* Track Order */}
        <button
          id="success-track-orders"
          onClick={handleTrackOrderRedirect}
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-slate-950 text-white py-3.5 text-xs font-black shadow-md hover:bg-slate-900 transition active:scale-95"
        >
          <Truck className="h-4 w-4 text-amber-400 animate-bounce" />
          <span>Track Order Progress</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>

        {/* Return Home */}
        <button
          id="success-browse-home"
          onClick={() => navigateTo('home')}
          className="w-full flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white py-3.5 text-xs font-black text-slate-700 hover:bg-slate-50 active:scale-95 transition"
        >
          <ShoppingBag className="h-4 w-4" />
          <span>Continue Browsing Collections</span>
        </button>
      </div>
    </div>
  );
};
