import React from 'react';
import { useAppState } from '../context/AppContext';
import { Home, Grid, Heart, ShoppingCart, User } from 'lucide-react';
import { ScreenName } from '../types';

export const BottomNavigation: React.FC = () => {
  const { navigation, navigateTo, cart, wishlist } = useAppState();

  const currentScreen = navigation.currentScreen;

  // Compute total items in cart
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const wishCount = wishlist.length;

  const tabs = [
    {
      id: 'home' as ScreenName,
      label: 'Home',
      icon: Home,
      isActive: currentScreen === 'home',
    },
    {
      id: 'categories' as ScreenName,
      label: 'Categories',
      icon: Grid,
      isActive: currentScreen === 'categories',
    },
    {
      id: 'cart' as ScreenName,
      label: 'Cart',
      icon: ShoppingCart,
      isActive: currentScreen === 'cart',
      badge: cartCount,
    },
  ];

  const handleTabClick = (tabId: ScreenName) => {
    navigateTo(tabId);
  };

  // Do not show bottom nav on splash or admin screens to emulate native feel!
  if (['splash', 'adminLogin', 'adminDashboard', 'checkout', 'success'].includes(currentScreen)) {
    return null;
  }

  return (
    <nav
      id="app-bottom-nav"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-100/80 bg-white/90 pb-safe shadow-[0_-4px_12px_rgba(0,0,0,0.03)] backdrop-blur-lg"
    >
      <div className="mx-auto flex h-16 max-w-sm justify-around px-2">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => handleTabClick(tab.id)}
              className="relative flex flex-col items-center justify-center w-14 transition active:scale-90"
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-2xl transition-all duration-300 ${
                  tab.isActive
                    ? 'bg-slate-950 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Icon className="h-5 w-5" />
                {tab.badge !== undefined && tab.badge > 0 ? (
                  <span
                    className={`absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full font-sans text-[8px] font-bold ${
                      tab.isActive
                        ? 'bg-amber-400 text-slate-950 font-extrabold ring-1 ring-slate-950'
                        : 'bg-slate-950 text-white'
                    }`}
                  >
                    {tab.badge}
                  </span>
                ) : null}
              </div>
              <span
                className={`mt-1 font-sans text-[9px] font-medium tracking-wide ${
                  tab.isActive ? 'font-bold text-slate-950' : 'text-slate-400'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
