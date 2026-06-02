import React, { useEffect, useState } from 'react';
import { AppProvider, useAppState } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNavigation } from './components/BottomNavigation';
import { WhatsAppButton } from './components/WhatsAppButton';
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
import { LegalPoliciesScreen } from './screens/LegalPoliciesScreen';
import { AdminLoginScreen } from './screens/AdminLoginScreen';
import { AdminDashboard } from './screens/AdminDashboard';

import { Wifi, Battery, Signal, Star, Check } from 'lucide-react';

const AppContent: React.FC = () => {
  const { navigation, currentUser, isAdmin, orders, products, addProductReview, showToast } = useAppState();
  
  // Real-time clock for top mock status bar
  const [timeStr, setTimeStr] = useState('07:21');

  // Automatic unreviewed delivered product ratings prompt states
  const [reviewProduct, setReviewProduct] = useState<any | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    if (!currentUser?.isLoggedIn || !orders || orders.length === 0) return;

    const reviewedIds = JSON.parse(localStorage.getItem('velriva_reviewed_products') || '[]');
    const dismissedIds = JSON.parse(localStorage.getItem('velriva_dismissed_reviews') || '[]');

    const deliveredProducts: any[] = [];
    orders.forEach(order => {
      if (order.status === 'Delivered') {
        order.items.forEach(item => {
          if (item.product && item.product.id) {
            const fullProd = products.find(p => p.id === item.product.id);
            if (fullProd && !reviewedIds.includes(fullProd.id) && !dismissedIds.includes(fullProd.id)) {
              if (!deliveredProducts.some(p => p.id === fullProd.id)) {
                deliveredProducts.push(fullProd);
              }
            }
          }
        });
      }
    });

    if (deliveredProducts.length > 0) {
      const timer = setTimeout(() => {
        setReviewProduct(deliveredProducts[0]);
        setRating(5);
        setComment('');
        setReviewSuccess(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [currentUser?.isLoggedIn, orders, products]);

  const handleSubmitReview = () => {
    if (!reviewProduct) return;
    setSubmittingReview(true);

    const newReview = {
      rating,
      name: currentUser.name || 'Verified Customer',
      comment: comment.trim() || 'Outstanding product! Genuine quality fabric, elegant design and comfortable fitting.',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    addProductReview(reviewProduct.id, newReview);

    const reviewedIds = JSON.parse(localStorage.getItem('velriva_reviewed_products') || '[]');
    if (!reviewedIds.includes(reviewProduct.id)) {
      reviewedIds.push(reviewProduct.id);
      localStorage.setItem('velriva_reviewed_products', JSON.stringify(reviewedIds));
    }

    setSubmittingReview(false);
    setReviewSuccess(true);
    showToast('Dhanyawad! Aapka valuable rating & review save ho gaya hai.', 'success');

    setTimeout(() => {
      setReviewProduct(null);
    }, 2000);
  };

  const handleDismissReview = () => {
    if (!reviewProduct) return;
    const dismissedIds = JSON.parse(localStorage.getItem('velriva_dismissed_reviews') || '[]');
    if (!dismissedIds.includes(reviewProduct.id)) {
      dismissedIds.push(reviewProduct.id);
      localStorage.setItem('velriva_dismissed_reviews', JSON.stringify(dismissedIds));
    }
    setReviewProduct(null);
  };

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

  // Smooth scroll main viewport to top on screen transition
  useEffect(() => {
    const el = document.getElementById('app-main-viewport');
    if (el) {
      el.scrollTop = 0;
    }
  }, [navigation.currentScreen]);

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
      case 'legal':
        return <LegalPoliciesScreen />;
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
  const isAuthRequiredScreen = !['splash', 'login', 'legal', 'adminLogin', 'adminDashboard'].includes(navigation.currentScreen);
  const showingLoginGuard = !currentUser.isLoggedIn && isAuthRequiredScreen;
  const hideChrome = isSplash || 
    showingLoginGuard ||
    ['login', 'legal', 'adminLogin', 'adminDashboard', 'success'].includes(navigation.currentScreen);

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
      {!hideChrome && navigation.currentScreen !== 'productDetails' && <BottomNavigation />}
      {!hideChrome && <WhatsAppButton />}
      <Toast />

      {/* 4. Delivered Product Rating Pop-Over Modal */}
      {reviewProduct && (
        <div id="delivered-order-review-modal-overlay" className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 animate-fadeIn backdrop-blur-xs">
          <div className="w-full max-w-[325px] bg-white rounded-[28px] border border-slate-100 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col items-center text-center space-y-4 max-h-[90%] overflow-y-auto">
            
            {/* Header branding */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full font-black uppercase tracking-wider mb-2 select-none animate-pulse">
                📦 Order Delivered 🎉
              </span>
              <h3 className="text-sm font-extrabold text-slate-900 leading-tight">Rate Your Purchase!</h3>
              <p className="text-[10.5px] text-slate-400 mt-1 max-w-[215px]">Aapka feedback humare boutique network ko behtar banata hai.</p>
            </div>

            {/* Thumbnail Display Box */}
            <div className="flex items-center gap-3 bg-slate-50/50 rounded-2xl p-2.5 border border-slate-100/60 w-full text-left">
              <img 
                src={reviewProduct.image} 
                alt={reviewProduct.name} 
                className="w-11 h-11 rounded-xl object-contain bg-white border border-slate-200 shrink-0 select-none"
                referrerPolicy="no-referrer"
              />
              <div className="overflow-hidden">
                <h4 className="text-[11px] font-extrabold text-slate-800 truncate">{reviewProduct.name}</h4>
                <p className="text-[9.5px] text-slate-400 font-semibold uppercase tracking-wide">Delivered Successfully</p>
              </div>
            </div>

            {/* Success check animation */}
            {reviewSuccess ? (
              <div className="py-5 flex flex-col items-center space-y-2 animate-fadeIn w-full">
                <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-xs">
                  <Check className="h-5 w-5 stroke-[3.5]" />
                </div>
                <p className="text-xs font-black text-slate-900">Thank You For Support!</p>
                <p className="text-[10px] text-slate-400 font-medium leading-none">Aapki review live save ho chuki hai.</p>
              </div>
            ) : (
              <>
                {/* 5-Star Selector Row */}
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((starIdx) => (
                    <button
                      key={starIdx}
                      type="button"
                      onClick={() => setRating(starIdx)}
                      className="transition transform active:scale-90 hover:scale-110 cursor-pointer p-0.5"
                    >
                      <Star 
                        className={`w-7 h-7 transition ${
                          starIdx <= rating 
                            ? 'text-amber-400 fill-amber-400 drop-shadow-[0_2px_8px_rgba(251,191,36,0.3)]' 
                            : 'text-slate-200 hover:text-amber-250'
                        }`} 
                      />
                    </button>
                  ))}
                </div>

                {/* Comment Text feedback area */}
                <div className="w-full">
                  <textarea
                    rows={2}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="E.g. Bohot mast quality fabric hai, highly recommended!"
                    className="w-full text-xs font-bold text-slate-705 bg-slate-50 border border-slate-200/85 rounded-xl px-3 py-2.5 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 placeholder-slate-400 min-h-[55px] text-slate-700 resize-none"
                  />
                  <span className="text-[9px] font-bold text-slate-400 block text-right mt-1">Optional comment input (Hindi / Eng)</span>
                </div>

                {/* Submits row buttons */}
                <div className="w-full flex flex-col gap-2 pt-1">
                  <button
                    type="button"
                    disabled={submittingReview}
                    onClick={handleSubmitReview}
                    className="w-full bg-slate-950 hover:bg-slate-900 text-white font-black text-xs py-3 rounded-xl shadow-md transition active:scale-95 cursor-pointer disabled:bg-slate-400 select-none"
                  >
                    {submittingReview ? "Saving Review..." : "Submit Review & Exit"}
                  </button>

                  <button
                    type="button"
                    onClick={handleDismissReview}
                    className="w-full text-[10px] font-black uppercase tracking-wider text-slate-400 hover:text-slate-600 transition py-1 select-none cursor-pointer"
                  >
                    Skip / Baad Mein Likhein
                  </button>
                </div>
              </>
            )}
            
          </div>
        </div>
      )}
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
