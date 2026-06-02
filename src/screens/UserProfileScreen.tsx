import React, { useState } from 'react';
import { useAppState } from '../context/AppContext';
import { User, ShoppingBag, ShieldCheck, Settings, LogOut, ChevronRight, HelpCircle, Truck, KeySquare, Edit2, Check, X, Instagram, Youtube, Mail } from 'lucide-react';

export const UserProfileScreen: React.FC = () => {
  const { currentUser, logoutUser, navigateTo, orders, isAdmin, updateUserProfile, supportInstagram, supportYoutube, supportPhone, supportEmail } = useAppState();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(currentUser.name || '');
  const [editPhone, setEditPhone] = useState(currentUser.phone || '');
  const [saving, setSaving] = useState(false);

  const handleStatClick = (tab: 'orders' | 'track') => {
    if (!currentUser.isLoggedIn) {
      navigateTo('login');
    } else {
      navigateTo(tab === 'orders' ? 'orders' : 'trackOrder');
    }
  };

  const menuItems = [
    {
      id: 'profile-legal',
      title: 'Terms, Conditions & Easy Returns',
      subtitle: 'Refund process, 4-day returns policy, reviewer standards',
      icon: ShieldCheck,
      action: () => navigateTo('legal'),
    },
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
      subtitle: `Instant Assistance via +${supportPhone}`,
      icon: HelpCircle,
      action: () => {
        const text = encodeURIComponent('Hello VELRIVA support! I need assistance with my order/account.');
        window.open(`https://wa.me/${supportPhone.replace(/\D/g, '')}?text=${text}`, '_blank');
      },
    },
    {
      id: 'profile-instagram',
      title: 'Instagram Support & Store',
      subtitle: `@${supportInstagram.split('instagram.com/')[1]?.split('?')[0] || 'velriva_store'}`,
      icon: Instagram,
      action: () => {
        window.open(supportInstagram, '_blank');
      },
    },
    {
      id: 'profile-youtube',
      title: 'YouTube Support Desk & Channel',
      subtitle: `@${supportYoutube.split('youtube.com/')[1] || 'velriva'}`,
      icon: Youtube,
      action: () => {
        window.open(supportYoutube, '_blank');
      },
    },
    {
      id: 'profile-email',
      title: 'Official Email Assistance',
      subtitle: supportEmail,
      icon: Mail,
      action: () => {
        window.open(`mailto:${supportEmail}`, '_blank');
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

          <button
            id="profile-anonymous-legal"
            onClick={() => navigateTo('legal')}
            className="w-full max-w-xs flex items-center justify-center gap-1.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 py-3 text-xs font-bold transition active:scale-95 cursor-pointer shadow-xs"
          >
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Store Terms & Return Policies</span>
          </button>
        </div>
      ) : (
        /* 2. Authenticated Profile Space */
        <div className="px-4 space-y-5 animate-fadeIn">
          {/* Welcome User avatar strip */}
          <div className="bg-white rounded-3xl border border-slate-100 p-4 shadow-xs">
            {!isEditing ? (
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 font-black text-amber-400 text-lg shadow-md shrink-0">
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
                    {currentUser.phone && (
                      <p className="text-[10.5px] text-slate-500 mt-1 font-bold">📞 {currentUser.phone}</p>
                    )}
                  </div>
                </div>

                <button
                  id="profile-toggle-edit-btn"
                  onClick={() => {
                    setEditName(currentUser.name || '');
                    setEditPhone(currentUser.phone || '');
                    setIsEditing(true);
                  }}
                  className="flex h-8 px-2.5 items-center justify-center rounded-xl bg-slate-50 border border-slate-150 text-[10.5px] font-black text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition active:scale-95 cursor-pointer shrink-0"
                  title="Edit Profile"
                >
                  Edit
                </button>
              </div>
            ) : (
              <div className="space-y-3.5 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                  <span className="text-[10.5px] font-black uppercase text-indigo-600 tracking-wider">Update Profile Information</span>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="text-[10.5px] font-bold text-slate-400 bg-slate-50 border border-slate-150 px-2.5 py-1 rounded-lg hover:bg-slate-100 active:scale-95 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={saving}
                      onClick={async () => {
                        setSaving(true);
                        const success = await updateUserProfile(editName, editPhone);
                        if (success) {
                          setIsEditing(false);
                        }
                        setSaving(false);
                      }}
                      className="text-[10.5px] font-black text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 px-3.5 py-1 rounded-lg active:scale-95 transition cursor-pointer shadow-sm"
                    >
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Your Full Name</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Name"
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-hidden bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Mobile / WhatsApp Number</label>
                    <input
                      type="tel"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      placeholder="Phone or WhatsApp No."
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-hidden bg-white"
                    />
                  </div>
                </div>
              </div>
            )}
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
          {(currentUser?.isLoggedIn && currentUser?.email === 'zainulamaan4@gmail.com') && (
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
