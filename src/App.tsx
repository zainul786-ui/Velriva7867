import React, { useEffect, useState } from 'react';
import { AppProvider, useAppState } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNavigation } from './components/BottomNavigation';
import { WhatsAppButton } from './components/WhatsAppButton';
import { InstallPrompt } from './components/InstallPrompt';
import { Toast } from './components/Toast';

// Screens imports - exact matches with files created
import { SplashScreen } from './screens/SplashScreen';
import { HomeScreen } from './screens/HomeScreen';
import { ProductListingScreen } from './screens/ProductListingScreen';
import { ProductDetailsScreen } from './screens/ProductDetailsScreen';
import { CategoriesScreen } from './screens/CategoriesScreen';
import { SearchScreen } from './screens/SearchScreen';
import { WishlistScreen } from './screens/WishlistScreen';
import { CartScreen } from './screens/CartScreen';
import { CheckoutScreen } from './screens/CheckoutScreen';
import { CODSuccessScreen } from './screens/CODSuccessScreen';
import { UserProfileScreen } from './screens/UserProfileScreen';
import { OrdersScreen } from './screens/OrdersScreen';
import { TrackOrderScreen } from './screens/TrackOrderScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { LoginRegisterScreen } from './screens/LoginRegisterScreen';
import { AdminLoginScreen } from './screens/AdminLoginScreen';
import { AdminDashboard } from './screens/AdminDashboard';

import { Wifi, Battery, Signal } from 'lucide-react';

const AppContent: React.FC = () => {
  const { navigation, currentUser, isAdmin } = useAppState();
  
  // Real-time clock for top mock status bar
  const [timeStr, setTimeStr] = useState('07:21');

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      let h = d.getHours();
      let m = String(d.getMinutes()).padStart(2, '0');
      let ap = h >= 12 ? 'PM' : 'AM';
      h = h % 12 || 12;
      setTimeStr(`${h}:${m} ${ap}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Screen Switch router
  const renderActiveScreen = () => {
    // Force authentication guard for all regular client workspaces
    if (!currentUser.isLoggedIn && !['splash', 'login', 'adminLogin', 'adminDashboard'].includes(navigation.currentScreen)) {
      return <LoginRegisterScreen />;
    }

    switch (navigation.currentScreen) {
      case 'splash':
        return <SplashScreen />;
      case 'home':
        return <HomeScreen />;
      case 'productListing':
        return <ProductListingScreen />;
      case 'productDetails':
        return <ProductDetailsScreen />;
      case 'categories':
        return <CategoriesScreen />;
      case 'search':
        return <SearchScreen />;
      case 'wishlist':
        return <WishlistScreen />;
      case 'cart':
        return <CartScreen />;
      case 'checkout':
        return <CheckoutScreen />;
      case 'success':
        return <CODSuccessScreen />;
      case 'profile':
        // Guarded: profiles demand authentication logins
        return currentUser.isLoggedIn ? <UserProfileScreen /> : <LoginRegisterScreen />;
      case 'orders':
        return currentUser.isLoggedIn ? <OrdersScreen /> : <LoginRegisterScreen />;
      case 'trackOrder':
        return <TrackOrderScreen />;
      case 'settings':
        return <SettingsScreen />;
      case 'login':
        return <LoginRegisterScreen />;
      case 'adminLogin':
        return isAdmin ? <AdminDashboard /> : <AdminLoginScreen />;
      case 'adminDashboard':
        return isAdmin ? <AdminDashboard /> : <AdminLoginScreen />;
      default:
        return <HomeScreen />;
    }
  };

  const isSplash = navigation.currentScreen === 'splash';
  const hideChrome = isSplash || 
    (!currentUser.isLoggedIn && !isAdmin) ||
    ['login', 'adminLogin', 'adminDashboard', 'success'].includes(navigation.currentScreen);

  return (
    <div
      id="velriva-applet-root"
      className="relative flex h-full w-full flex-col overflow-hidden bg-white select-none"
    >
      {/* 1. Standard Header bar indicator */}
      {!hideChrome && <Header />}

      {/* 2. Main core screens viewport body (supports momentum scrolling) */}
      <main
        id="app-main-viewport"
        className="flex-1 overflow-y-auto bg-white"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {renderActiveScreen()}
      </main>

      {/* 3. Utilities, Bottom Bars, floating prompts */}
      {!hideChrome && <BottomNavigation />}
      {!hideChrome && <WhatsAppButton />}
      {!hideChrome && <InstallPrompt />}
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      {/* Immersive mobile centering frame layout for desktop browsers */}
      <div
        id="velriva-desktop-wrapper"
        className="min-h-screen w-full bg-slate-900 md:bg-slate-950 flex items-center justify-center font-sans"
        style={{
          backgroundImage: 'radial-gradient(circle at top right, rgba(234, 179, 8, 0.08), transparent 45%), radial-gradient(circle at bottom left, rgba(99, 102, 241, 0.07), transparent 40%)'
        }}
      >
        <div
          id="phone-device-frame"
          className="relative h-screen w-full md:max-w-sm md:h-[840px] md:rounded-[36px] md:border-[10px] md:border-slate-900 md:bg-white md:shadow-[0_24px_64px_-12px_rgba(0,0,0,0.8)] md:overflow-hidden transition-all duration-350"
        >
          {/* Smartphone audio receiver mockup notch on top */}
          <div className="hidden md:block absolute top-2 left-1/2 -translate-x-1/2 h-4 w-28 bg-slate-900 rounded-b-xl z-50 overflow-hidden" />

          {/* Core application body */}
          <AppContent />
        </div>
      </div>
    </AppProvider>
  );
}
