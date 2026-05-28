import React, { useState, useEffect } from 'react';
import { useAppState } from '../context/AppContext';
import { Search, MapPin, Truck, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';

export const TrackOrderScreen: React.FC = () => {
  const { orders, navigation } = useAppState();

  const [searchId, setSearchId] = useState('');
  const [activeOrder, setActiveOrder] = useState<typeof orders[0] | null>(null);
  const [searchError, setSearchError] = useState('');

  // Handle passed page navigation parameter
  const queriedId = navigation.params?.orderId;

  useEffect(() => {
    if (queriedId) {
      setSearchId(queriedId);
      const match = orders.find(o => o.id === queriedId);
      if (match) {
        setActiveOrder(match);
        setSearchError('');
      } else {
        setSearchError('Specified Order reference is invalid or expired.');
      }
    } else if (orders.length > 0) {
      // Default to latest order if user has orders
      setSearchId(orders[0].id);
      setActiveOrder(orders[0]);
    }
  }, [queriedId, orders]);

  const handleTrackSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) {
      setSearchError('Please key in a valid Order ID reference.');
      return;
    }

    const match = orders.find(o => o.id.toLowerCase() === searchId.trim().toLowerCase());
    if (match) {
      setActiveOrder(match);
      setSearchError('');
    } else {
      setActiveOrder(null);
      setSearchError('Order ID not found in database registry. Try another code.');
    }
  };

  return (
    <div id="track-order-screen-container" className="pb-24 pt-2">
      <div className="px-4 mt-2">
        <h2 className="text-xl font-extrabold tracking-tight">Track Shipments</h2>
        <p className="text-xs text-slate-400 font-medium">Verify actual cargo milestones and courier dispatch states.</p>
      </div>

      {/* 1. Order search/lookup input */}
      <form onSubmit={handleTrackSearchSubmit} className="mt-5 px-4">
        <div className="relative flex items-center rounded-2xl border border-slate-100 bg-white p-1 shadow-xs">
          <Search className="absolute left-4 h-4.5 w-4.5 text-slate-400" />
          <input
            id="track-order-search-input"
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Key in Order ID (e.g. VEL-104928)"
            className="h-11 w-full pl-11 pr-24 text-xs font-semibold text-slate-800 placeholder-slate-450 focus:outline-hidden"
          />
          <button
            id="track-order-submit-btn"
            type="submit"
            className="absolute right-2.5 rounded-xl bg-slate-950 px-4 py-2 text-[10.5px] font-black text-white hover:bg-slate-900 active:scale-95 shadow-sm"
          >
            Track Status
          </button>
        </div>

        {searchError && (
          <p className="text-[11px] font-bold text-rose-500 bg-rose-50 border border-rose-100 p-2 mt-2 rounded-xl">
            ⚠️ {searchError}
          </p>
        )}
      </form>

      {/* 2. Active tracking results displaying milestones timeline */}
      {activeOrder ? (
        <div className="mt-5 px-4 space-y-4">
          {/* Quick status summary info */}
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-xs">
            <div className="flex justify-between items-center text-xs">
              <div>
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block leading-none">Order Reference</span>
                <span className="font-mono font-black text-slate-950 mt-1 block">{activeOrder.id}</span>
              </div>
              
              <div className="text-right">
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block leading-none">Courier Partner</span>
                <span className="font-bold text-slate-800 mt-1 block">VELORA-EXPRESS</span>
              </div>
            </div>

            <div className="h-[1px] w-full bg-slate-50 mt-3 pt-3 flex items-center justify-between text-xs pt-3">
              <span className="font-bold text-slate-600">Shipment Status:</span>
              <span className="rounded-xl bg-amber-50 border border-amber-100 px-3 py-0.5 text-[10px] font-black text-amber-700 uppercase">
                {activeOrder.status}
              </span>
            </div>
          </div>

          {/* Timeline steps visualization */}
          <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-xs">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4">Milestones Tracker</h3>
            
            <div className="relative pl-5 space-y-6">
              {/* Vertical timeline connector strip */}
              <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-slate-100" />

              {activeOrder.tracking.map((track, i) => (
                <div key={i} className="relative text-xs">
                  {/* Circular node */}
                  <div className={`absolute -left-[23px] top-1 h-3.5 w-3.5 rounded-full border border-white ring-4 ${
                    i === 0 ? 'bg-emerald-500 ring-emerald-100 animate-pulse' : 'bg-slate-300 ring-slate-50'
                  }`} />

                  <div className="space-y-0.5">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>{track.status}</span>
                      <span className="font-mono text-[9px] text-slate-400 font-medium">{track.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-sans mt-0.5">
                      {track.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping metadata destination */}
          <div className="flex gap-3 rounded-2xl bg-slate-50 p-4 border border-slate-100">
            <MapPin className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-black text-slate-400 text-[10px] uppercase block leading-none">Deliver To Residence</span>
              <p className="font-bold text-slate-800 mt-1">{activeOrder.shippingAddress.name}</p>
              <p className="text-slate-500 mt-0.5 leading-relaxed">
                {activeOrder.shippingAddress.address}, {activeOrder.shippingAddress.city}, {activeOrder.shippingAddress.state} - {activeOrder.shippingAddress.pincode}
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Empty/Lookup Guide info state */
        <div className="flex h-64 flex-col items-center justify-center text-center px-4 mt-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50">
            <HelpCircle className="h-6 w-6 text-slate-400" />
          </div>
          <span className="font-bold text-slate-850 text-sm mt-3.5">Package monitor not active</span>
          <p className="text-xs text-slate-400 max-w-[210px] leading-relaxed mt-1">
            Complete a checkout transaction, copy the order code, and use this search box above to audit logistics status updates.
          </p>
        </div>
      )}
    </div>
  );
};
