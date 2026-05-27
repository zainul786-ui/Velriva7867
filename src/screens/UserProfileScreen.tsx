import React from 'react';
import { useAppState } from '../context/AppContext';
import { User, ShoppingBag, ShieldCheck, Settings, LogOut, ChevronRight, HelpCircle, Truck, KeySquare } from 'lucide-react';

export const UserProfileScreen: React.FC = () => {
  const { currentUser, logoutUser, navigateTo, orders, isAdmin } = useAppState();

  const handleStatClick = (tab: 'orders' | 'track') => {
    if (!currentUser.isLoggedIn) {
      navigateTo('login');
    } else {
      navigateTo(tab === 'orders' ? 'orders' : 'trackOrder');
    }
  };

  const menuItems = [
    {
      id: 'profile-orders',
      title: 'Current & Past Orders',
      subtitle: `${orders.length} orders recorded`,
      icon: ShoppingBag,
      action: () => navigateTo('orders'),
    },
    {
      id: 'profile-track',
      title: 'Real-time Order Tracking',
      subtitle: 'Monitor shipping locations',
      icon: Truck,
      action: () => navigateTo('trackOrder'),
    },
    {
      id: 'profile-settings',
      title: 'App Preferences',
      subtitle: 'Personalize PWA settings',
      icon: Settings,
      action: () => navigateTo('settings'),
    },
    {
      id: 'profile-help',
      title: 'Customer Support on WhatsApp',
      subtitle: 'Instant Chat Assistance 24/7',
      icon: HelpCircle,
      action: () => {
        const text = encodeURIComponent('Hello VELRIVA support! I need assistance with my order/account.');
        window.open(`https://wa.me/919690986010?text=${text}`, '_blank');
      },
    }
  ];

  return (
    <div id="user-profile-screen" className="pb-24 pt-2">
      {/* 1. Unauthenticated State Panel */}
      {!currentUser.isLoggedIn ? (
        <div className="flex h-120 flex-col items-center justify-center text-center px-4 space-y-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-900 font-bold text-amber-400 text-lg shadow-md">
            VR
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Access Customer Space</h3>
            <p className="text-xs text-slate-400 max-w-[210px] mx-auto mt-1 leading-relaxed">
              Log in to track delivery status, manage addresses and view order receipts.
            </p>
          </div>

          <button
            id="profile-login-redirect"
            onClick={() => navigateTo('login')}
            className="w-full max-w-xs rounded-2xl bg-slate-950 py-3.5 text-xs font-black text-white hover:bg-slate-900 active:scale-95 transition shadow-md"
          >
            Authenticate Customer Session
          </button>
        </div>
      ) : (
        /* 2. Authenticated Profile Space */
        <div className="px-4 space-y-5">
          {/* Welcome User avatar strip */}
          <div className="flex items-center gap-4 bg-white rounded-3xl border border-slate-100 p-4 shadow-xs">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 font-black text-amber-400 text-lg shadow-md">
              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
            </div>
            
            <div className="overflow-hidden">
              <span className="text-[10px] bg-slate-950 text-amber-400 px-1.5 py-0.5 rounded-md font-black tracking-wider uppercase block w-fit mb-1">
                GOLD VIP MEMBERSHIP
              </span>
              <h3 className="font-extrabold text-slate-900 text-base leading-none truncate pr-1">
                {currentUser.name}
              </h3>
              <p className="text-xs text-slate-400 mt-1 font-medium truncate pr-1">{currentUser.email}</p>
            </div>
          </div>

          {/* Dynamic statistics row */}
          <div className="grid grid-cols-2 gap-3">
            <div
              id="profile-stat-orders"
              onClick={() => handleStatClick('orders')}
              className="rounded-2xl border border-slate-100 bg-white p-4 cursor-pointer active:scale-98 text-center shadow-xs"
            >
              <h4 className="font-mono text-2xl font-black text-slate-900">{orders.length}</h4>
              <p className="text-[10.5px] font-bold text-slate-400 mt-1">Total Ordered Items</p>
            </div>

            <div
              id="profile-stat-tracking"
              onClick={() => handleStatClick('track')}
              className="rounded-2xl border border-slate-100 bg-white p-4 cursor-pointer active:scale-98 text-center shadow-xs"
            >
              <h4 className="font-mono text-2xl font-black text-[#059669]">
                {orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length}
              </h4>
              <p className="text-[10.5px] font-bold text-slate-400 mt-1">Pending Deliveries</p>
            </div>
          </div>

          {/* Navigation Menu item blocks */}
          <div className="rounded-3xl border border-slate-100 bg-white shadow-xs overflow-hidden">
            {menuItems.map(item => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  id={item.id}
                  onClick={item.action}
                  className="flex items-center justify-between p-4 border-b border-slate-50 last:border-b-0 cursor-pointer hover:bg-slate-50 active:bg-slate-50 transition"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-600">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{item.title}</h4>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">{item.subtitle}</p>
                    </div>
                  </div>

                  <ChevronRight className="h-4 w-4 text-slate-300" />
                </div>
              );
            })}
          </div>

          {/* Admin Area Bridge */}
          {(currentUser?.email === 'velriva7867@gmail.com' || currentUser?.email === 'zainulamaan4@gmail.com' || isAdmin) && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-amber-100/50 border border-amber-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide">Developer & Staff Link</h4>
                  <p className="text-[10.5px] text-slate-500 mt-0.5">Control live catalogs, update order status, see graphs</p>
                </div>
                
                <button
                  id="profile-admin-gateway"
                  onClick={() => navigateTo('adminLogin')}
                  className="rounded-xl bg-slate-950 px-3.5 py-2 text-[10px] font-black text-white hover:bg-slate-900 active:scale-95"
                >
                  Entrance Gate
                </button>
              </div>
            </div>
          )}

          {/* Sign Out Action */}
          <button
            id="profile-logout-action-btn"
            onClick={logoutUser}
            className="w-full flex items-center justify-center gap-2 rounded-2xl border border-rose-200 text-rose-500 bg-rose-50/50 hover:bg-rose-50 py-3.5 text-xs font-black active:scale-98 transition"
          >
            <LogOut className="h-4.5 w-4.5" />
            <span>Terminate Customer Session</span>
          </button>
        </div>
      )}
    </div>
  );
};
