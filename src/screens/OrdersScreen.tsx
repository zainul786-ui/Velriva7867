import React from 'react';
import { useAppState } from '../context/AppContext';
import { Box, ChevronRight, PackageCheck, ShoppingBag } from 'lucide-react';

export const OrdersScreen: React.FC = () => {
  const { orders, navigateTo } = useAppState();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Shipped':
        return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case 'Out for Delivery':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-100';
      case 'Pending':
      default:
        return 'bg-amber-50 text-amber-600 border-amber-100';
    }
  };

  const handleTrackClick = (orderId: string) => {
    navigateTo('trackOrder', { orderId });
  };

  return (
    <div id="orders-screen-scroll-container" className="pb-24 pt-2 px-4">
      <div className="mt-2 text-slate-900">
        <h2 className="text-xl font-extrabold tracking-tight">Your Orders</h2>
        <p className="text-xs text-slate-400 font-medium">Browse package status milestones for all items.</p>
      </div>

      {orders.length === 0 ? (
        <div className="flex h-96 flex-col items-center justify-center text-center gap-4 mt-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <Box className="h-7 w-7 text-slate-400" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm">No orders yet</h3>
            <p className="text-xs text-slate-400 max-w-[210px] mx-auto leading-relaxed mt-1">
              You haven&apos;t placed any Cash on Delivery orders on this VELRIVA applet yet.
            </p>
          </div>
          
          <button
            id="orders-back-shopping"
            onClick={() => navigateTo('home')}
            className="mt-2 rounded-2xl bg-slate-950 px-6 py-3 text-xs font-black text-white hover:bg-slate-900 active:scale-95 shadow-md"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        /* Render orders items card block */
        <div className="mt-5 space-y-4">
          {orders.map(order => (
            <div
              key={order.id}
              className="rounded-3xl border border-slate-100 bg-white p-4 shadow-xs hover:border-slate-300 transition duration-300"
            >
              {/* Order upper tag section */}
              <div className="flex items-center justify-between border-b border-slate-50 pb-3 mb-3">
                <div>
                  <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">Order Reference</span>
                  <p className="font-mono text-sm font-black text-slate-950 mt-0.5">{order.id}</p>
                </div>

                <div className={`rounded-xl border px-3 py-1 text-[10px] font-black uppercase tracking-wide ${getStatusBadge(order.status)}`}>
                  {order.status}
                </div>
              </div>

              {/* Items in that order */}
              <div className="space-y-3">
                {order.items.map((it, idx) => (
                  <div key={idx} className="flex gap-2.5 items-center">
                    <img
                      src={it.product.image}
                      alt={it.product.name}
                      className="h-10 w-9 rounded-lg object-cover bg-slate-50 border border-slate-100"
                    />
                    <div className="overflow-hidden flex-1 select-none">
                      <p className="truncate text-xs font-bold text-slate-800">{it.product.name}</p>
                      <span className="text-[10px] text-slate-400 font-bold block mt-0.5">
                        Quantity: {it.quantity} {it.selectedSize ? `| Size: ${it.selectedSize}` : ''}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom statistics row in card */}
              <div className="flex items-center justify-between border-t border-slate-50 pt-3 mt-3">
                <div className="text-left">
                  <span className="text-[10px] text-slate-400 block leading-none font-medium">Invoice Date</span>
                  <p className="text-[10px] font-bold text-slate-600 mt-1">{order.date}</p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block leading-none font-medium">Grand Pay Total</span>
                  <p className="font-mono text-sm font-black text-slate-905 mt-0.5">₹{order.total}</p>
                </div>
              </div>

              {/* View/Track shipment action bridge button */}
              <button
                id={`orders-track-link-${order.id}`}
                onClick={() => handleTrackClick(order.id)}
                className="w-full mt-3.5 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-2.5 text-xs font-extrabold text-slate-800 hover:bg-slate-100 active:scale-98 transition"
              >
                <span className="flex items-center gap-1.5">
                  <PackageCheck className="h-4 w-4 text-[#000]" />
                  <span>Track Express Shipment</span>
                </span>
                
                <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
