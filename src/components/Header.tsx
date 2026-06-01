import React, { useState } from 'react';
import { useAppState } from '../context/AppContext';
import { Bell, Search, ArrowLeft, X, CheckSquare, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Header: React.FC = () => {
  const { navigation, goBack, navigateTo, notifications, markNotificationsAsRead, wishlist, logo } = useAppState();
  const [showNotifications, setShowNotifications] = useState(false);

  const isPrimaryScreen = ['home', 'categories', 'wishlist', 'cart', 'profile', 'adminDashboard'].includes(
    navigation.currentScreen
  );

  const getScreenTitle = () => {
    switch (navigation.currentScreen) {
      case 'productDetails':
        return 'Product Details';
      case 'productListing':
        return navigation.params?.categoryName || 'Products';
      case 'search':
        return 'Search store';
      case 'checkout':
        return 'Checkout (COD)';
      case 'success':
        return 'Order Success';
      case 'orders':
        return 'My Orders';
      case 'trackOrder':
        return 'Track Your Order';
      case 'settings':
        return 'App Settings';
      case 'login':
        return 'Welcome to VELRIVA';
      case 'adminLogin':
        return 'Staff Portal';
      default:
        return 'VELRIVA';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <header
        id="app-header"
        className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b border-slate-100/80 bg-white/80 px-4 shadow-[0_1px_3px_0_rgba(15,23,42,0.02)] backdrop-blur-md"
      >
        <div className="flex items-center gap-3">
          {!isPrimaryScreen && navigation.currentScreen !== 'splash' ? (
            <button
              id="back-button"
              onClick={goBack}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-100 bg-white shadow-sm transition active:scale-90"
            >
              <ArrowLeft className="h-4.5 w-4.5 text-slate-800" />
            </button>
          ) : (
            <button
              id="logo-profile-btn"
              onClick={() => navigateTo('profile')}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 font-bold text-amber-400 text-xs shadow-md transition hover:scale-105 active:scale-95 cursor-pointer overflow-hidden p-0"
              title="UserProfile Hub"
            >
              <img src={logo || '/icon.svg'} className="h-full w-full object-cover" referrerPolicy="no-referrer" alt="Velriva Logo" />
            </button>
          )}

          <h1 className="text-[17px] font-bold tracking-tight text-slate-900">
            {getScreenTitle()}
          </h1>
        </div>

        {isPrimaryScreen && (
          <div className="flex items-center gap-2">
            <button
              id="search-icon-btn"
              onClick={() => navigateTo('search')}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-100 bg-white shadow-sm transition active:scale-95 cursor-pointer"
            >
              <Search className="h-4 w-4 text-slate-600" />
            </button>

            <button
              id="header-wishlist-btn"
              onClick={() => navigateTo('wishlist')}
              className="relative flex h-9 w-9 items-center justify-center rounded-full border border-slate-100 bg-white shadow-sm transition active:scale-95 cursor-pointer"
            >
              <Heart className={`h-4 w-4 ${wishlist.length > 0 ? 'fill-rose-500 text-rose-500' : 'text-slate-600'}`} />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-rose-500 font-sans text-[8px] font-bold text-white ring-2 ring-white">
                  {wishlist.length}
                </span>
              )}
            </button>

            <button
              id="notifications-bell-btn"
              onClick={() => {
                setShowNotifications(true);
                markNotificationsAsRead();
              }}
              className="relative flex h-9 w-9 items-center justify-center rounded-full border border-slate-100 bg-white shadow-sm transition active:scale-95 cursor-pointer"
            >
              <Bell className="h-4 w-4 text-slate-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-rose-500 font-sans text-[9px] font-bold text-white ring-2 ring-white animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        )}
      </header>

      {/* Notifications overlay drawer */}
      <AnimatePresence>
        {showNotifications && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNotifications(false)}
              className="absolute inset-0 bg-slate-950"
            />

            {/* Content drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative flex h-full w-full max-w-sm flex-col bg-slate-50 shadow-2xl"
            >
              <div className="flex h-14 items-center justify-between border-b border-slate-100 bg-white px-4">
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-slate-800" />
                  <span className="font-bold text-slate-900 text-base">Inbox Notifications</span>
                </div>
                <button
                  id="close-notifications-btn"
                  onClick={() => setShowNotifications(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:text-slate-900"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {notifications.length === 0 ? (
                  <div className="flex h-64 flex-col items-center justify-center gap-3 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                      <CheckSquare className="h-6 w-6 text-slate-400" />
                    </div>
                    <p className="text-sm font-medium text-slate-500">Inbox empty</p>
                    <p className="max-w-[180px] text-xs text-slate-400">
                      We will notify you about your local COD order status updates.
                    </p>
                  </div>
                ) : (
                  notifications.map(notif => (
                    <div
                      key={notif.id}
                      className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-sm text-slate-900">{notif.title}</span>
                        <span className="text-[10px] text-slate-400 font-mono font-medium">{notif.time}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{notif.body}</p>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
