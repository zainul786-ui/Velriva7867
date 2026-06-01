import React, { useState, useEffect } from 'react';
import { useAppState } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { CATEGORIES } from '../data/mockData';
import { Flame, Clock, Sparkles, TrendingUp, ShieldCheck, Heart, ArrowRight, Instagram, Youtube, Mail } from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const { products, navigateTo, recentlyViewed, promoBanners, supportInstagram, supportYoutube, supportEmail, supportPhone } = useAppState();

  // States
  const [activeBanner, setActiveBanner] = useState(0);
  const [selectedCatalogCategory, setSelectedCatalogCategory] = useState<string>('all');

  // Filter lists based on metadata tags
  const trendingProducts = products.filter(p => p.isTrending);
  const featuredProducts = products.filter(p => p.isFeatured);
  const flashProducts = products.filter(p => p.isFlashSale);

  const displayCatalogProducts = selectedCatalogCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCatalogCategory);

  // Map recently viewed product ids back to products
  const recentProducts = recentlyViewed
    .map(id => products.find(p => p.id === id))
    .filter((p): p is typeof products[0] => !!p);
  
  const activeBannersList = promoBanners && promoBanners.length > 0 ? promoBanners : [
    {
      id: 'banner_1',
      title: 'DROP 09: LIGHTSPEEDS',
      sub: 'Save 50% on all premium wireless headphones archives.',
      img: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop',
      category: 'headphones',
    }
  ];

  // Automatic banner swipe simulation
  useEffect(() => {
    if (activeBannersList.length <= 1) return;
    const timer = setInterval(() => {
      setActiveBanner(prev => (prev + 1) % activeBannersList.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [activeBannersList.length]);

  // Flash sales Countdown Timer simulation
  const [timeLeft, setTimeLeft] = useState({ hr: 4, min: 32, sec: 18 });
  useEffect(() => {
    const clockTimer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.sec > 0) {
          return { ...prev, sec: prev.sec - 1 };
        } else if (prev.min > 0) {
          return { hr: prev.hr, min: prev.min - 1, sec: 59 };
        } else if (prev.hr > 0) {
          return { hr: prev.hr - 1, min: 59, sec: 59 };
        } else {
          return { hr: 4, min: 0, sec: 0 }; // reset
        }
      });
    }, 1000);
    return () => clearInterval(clockTimer);
  }, []);

  return (
    <div id="home-screen-scroll-container" className="pb-24 pt-2">
      {/* 1. Hero Promo Slider Banner */}
      {activeBannersList.length > 0 && (
        <div className="relative mx-4 mt-2 overflow-hidden rounded-[24px] bg-slate-950 aspect-[16/9] shadow-lg">
          <img
            src={activeBannersList[activeBanner]?.img}
            alt="Banner"
            className="absolute inset-0 h-full w-full object-cover opacity-60 transition-all duration-700 ease-in-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          
          <div className="absolute inset-0 flex flex-col justify-end p-5">
            <span className="mb-1 w-fit rounded-md bg-amber-400 px-2 py-0.5 font-sans text-[8px] font-black uppercase tracking-wider text-slate-950">
              Exclusive Startup Deal
            </span>
            <h2 className="font-sans text-xl font-black tracking-tight text-white leading-tight">
              {activeBannersList[activeBanner]?.title}
            </h2>
            <p className="mt-1 max-w-[240px] text-[11px] font-medium text-slate-300 line-clamp-1">
              {activeBannersList[activeBanner]?.sub}
            </p>

            <button
              id={`shop-banner-${activeBanner}`}
              onClick={() => {
                const targetSlug = activeBannersList[activeBanner]?.category;
                if (!targetSlug || targetSlug === 'all') {
                  navigateTo('productListing');
                } else {
                  navigateTo('productListing', { categorySlug: targetSlug, categoryName: targetSlug.toUpperCase() });
                }
              }}
              className="mt-3.5 flex w-fit items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-[10px] font-bold text-slate-950 transition hover:bg-slate-200 active:scale-95 shadow-md"
            >
              <span>Explore Now</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          {/* Swipe indicator dots */}
          {activeBannersList.length > 1 && (
            <div className="absolute top-4 right-4 flex gap-1.5">
              {activeBannersList.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    activeBanner === idx ? 'w-4 bg-amber-400' : 'w-1.5 bg-white/40'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. Recent Arrivals Horizontal Scroll Rail - Exactly 5 to 6 Products */}
      <div className="mt-5 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Recent Arrivals (New Launches)</h3>
          </div>
          <span className="text-[10px] font-bold text-slate-400">Swipe Left ➜</span>
        </div>
        <p className="text-[10px] text-slate-400 mt-1">Lately added luxury items & fresh inventory drops</p>
        <div className="mt-3 flex gap-3.5 overflow-x-auto pb-1 scrollbar-none flex-nowrap">
          {products.slice(-6).reverse().map(prod => (
            <div key={prod.id} className="w-[150px] shrink-0">
              <ProductCard product={prod} />
            </div>
          ))}
        </div>
      </div>

      {/* 3. Horizontal Category Rail Icons */}
      <div className="mt-5 px-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-900">Popular Categories</h3>
          <button
            id="view-all-cats"
            onClick={() => navigateTo('categories')}
            className="text-[10px] font-bold text-slate-500 hover:text-slate-950"
          >
            See All
          </button>
        </div>
        
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              id={`cat-rail-${cat.id}`}
              onClick={() => {
                if (cat.slug === 'all') {
                  navigateTo('productListing');
                } else {
                  navigateTo('productListing', { categorySlug: cat.slug, categoryName: cat.name });
                }
              }}
              className="flex shrink-0 items-center gap-2 rounded-2xl border border-slate-100/90 bg-white px-3.5 py-2 hover:border-slate-300 active:scale-95 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
            >
              <span className="text-xs font-bold text-slate-800">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. COD Security Trust Banner */}
      <div className="mx-4 mt-6 rounded-[20px] bg-gradient-to-r from-teal-50 to-emerald-50 border border-emerald-100 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 shadow-md">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#059669]">VELRIVA Dropship Trust</span>
            <h4 className="text-xs font-bold text-slate-900 mt-0.5">100% Cash On Delivery Available</h4>
            <p className="text-[10.5px] text-slate-500 mt-1 leading-relaxed">
              Verify your package at your doorstep before payment. Zero card or cash deposits required to fulfill orders.
            </p>
          </div>
        </div>
      </div>

      {/* 5. Flash Sale with Ticking Clock */}
      {flashProducts.length > 0 && (
        <div className="mt-6 bg-slate-950 py-5 text-white">
          <div className="px-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500">
                <Flame className="h-4.5 w-4.5 text-white fill-current" />
              </div>
              <h3 className="text-sm font-black tracking-wide">FLASH DISCOUNTS</h3>
            </div>
            
            {/* Countdown clock style */}
            <div className="flex items-center gap-1 font-mono text-xs font-extrabold text-amber-400 bg-slate-900 border border-slate-800 px-2 py-1 rounded-lg">
              <Clock className="h-3 w-3" />
              <span>{String(timeLeft.hr).padStart(2, '0')}</span>:
              <span>{String(timeLeft.min).padStart(2, '0')}</span>:
              <span>{String(timeLeft.sec).padStart(2, '0')}</span>
            </div>
          </div>

          <div className="mt-3.5 flex gap-4 overflow-x-auto px-4 pb-2 scrollbar-none">
            {flashProducts.map(prod => (
              <div key={prod.id} className="w-[160px] shrink-0 bg-white rounded-2xl text-slate-950">
                <ProductCard product={prod} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Trending Products Grid */}
      <div className="mt-6 px-4">
        <h3 className="flex items-center gap-1.5 text-sm font-extrabold text-slate-900">
          <TrendingUp className="h-4 w-4 text-emerald-500" />
          <span>Trending Collections</span>
        </h3>
        
        <div className="mt-3.5 grid grid-cols-2 gap-3">
          {trendingProducts.slice(0, 4).map(prod => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </div>

      {/* 7. Recently Viewed strip */}
      {recentProducts.length > 0 && (
        <div className="mt-6 px-4 bg-slate-50/80 py-4 border-y border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Recently Viewed</h3>
          <div className="mt-2.5 flex gap-3 overflow-x-auto pb-1 scrollbar-none">
            {recentProducts.map(prod => (
              <div
                key={prod.id}
                onClick={() => navigateTo('productDetails', { productId: prod.id })}
                className="flex w-36 shrink-0 gap-2 rounded-xl bg-white border border-slate-100 p-1.5 cursor-pointer active:scale-95 shadow-sm"
              >
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="h-10 w-10 shrink-0 rounded-lg object-cover"
                />
                <div className="overflow-hidden">
                  <h4 className="truncate text-[10px] font-bold text-slate-800">{prod.name}</h4>
                  <span className="text-[10px] font-extrabold text-[#000]">₹{prod.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. Curated Recommendation Feed */}
      <div className="mt-6 px-4">
        <h3 className="text-sm font-extrabold text-slate-900">Curated For You</h3>
        <p className="text-[10.5px] text-slate-400 leading-relaxed">
          Algorithm-driven suggestions matching your style preferences.
        </p>

        <div className="mt-3.5 grid grid-cols-2 gap-3">
          {featuredProducts.map(prod => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </div>

      {/* 8.5 Master Products Catalog (Everything on Home Screen) */}
      <div id="master-inventory-catalog" className="mt-8 px-4 font-sans text-left">
        <div className="border-t border-slate-100 pt-6">
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Our Master Inventory Catalog</h3>
            <p className="text-[10px] text-slate-400 mt-0.5 font-medium leading-normal">
              Explore your central dropshipping warehouse catalog. High quality photography and high-profit margins ready to market.
            </p>
          </div>

          {/* Catalog Filter Toggles */}
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-none flex-nowrap">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                id={`catalog-tab-${cat.slug}`}
                onClick={() => setSelectedCatalogCategory(cat.slug)}
                className={`px-3.5 py-1.5 shrink-0 rounded-xl text-[10px] font-black tracking-wide uppercase transition ${
                  selectedCatalogCategory === cat.slug
                    ? 'bg-slate-950 text-white shadow-md'
                    : 'bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-slate-150 shadow-xs'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Comprehensive Grid of All Filtered Products */}
          {displayCatalogProducts.length > 0 ? (
            <div className="mt-4 grid grid-cols-2 gap-3">
              {displayCatalogProducts.map(prod => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          ) : (
            <div className="mt-8 text-center py-12 bg-slate-50 rounded-[24px] border border-dashed border-slate-200">
              <span className="text-xl">🔍</span>
              <p className="text-xs font-bold text-slate-400 mt-2">No products found under this filter.</p>
            </div>
          )}
        </div>
      </div>

      {/* 9. Official Brand Community & Support Hub */}
      <div className="mx-4 mt-8 mb-4 rounded-[24px] border border-slate-150 bg-white p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-1.5 w-1.5 rounded-full bg-[#10b981] animate-ping" />
          <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-400">Connect &amp; Support Hub</h3>
        </div>
        <h4 className="text-sm font-black text-slate-900">VELRIVA Reseller Socials</h4>
        <p className="text-[10.5px] text-slate-500 mt-1 leading-relaxed">
          Connect with our central support, explore training videos, or message us directly on Instagram for quick reseller queries.
        </p>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <a
            href={supportInstagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center py-3 px-1 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100/70 hover:border-slate-300 transition active:scale-95 cursor-pointer text-center"
          >
            <Instagram className="h-5 w-5 text-pink-600" />
            <span className="text-[10px] font-black text-slate-800 mt-2">Instagram</span>
            <span className="text-[8px] text-slate-404 text-slate-400 font-bold mt-0.5 truncate max-w-full">
              {supportInstagram.split('instagram.com/')[1]?.split('?')[0] || 'Instagram'}
            </span>
          </a>

          <a
            href={supportYoutube}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center py-3 px-1 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100/70 hover:border-slate-300 transition active:scale-95 cursor-pointer text-center"
          >
            <Youtube className="h-5 w-5 text-red-600" />
            <span className="text-[10px] font-black text-slate-800 mt-2">YouTube</span>
            <span className="text-[8px] text-slate-404 text-slate-400 font-bold mt-0.5 truncate max-w-full">
              {supportYoutube.split('youtube.com/')[1] || 'YouTube'}
            </span>
          </a>

          <a
            href={`mailto:${supportEmail}`}
            className="flex flex-col items-center justify-center py-3 px-1 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100/70 hover:border-slate-300 transition active:scale-95 cursor-pointer text-center"
          >
            <Mail className="h-5 w-5 text-indigo-600" />
            <span className="text-[10px] font-black text-slate-800 mt-2">Gmail support</span>
            <span className="text-[8px] text-slate-404 text-slate-400 font-bold mt-0.5 truncate max-w-full">
              {supportEmail.split('@')[0]}
            </span>
          </a>
        </div>

        {/* Dynamic WhatsApp direct helpline pill */}
        <button
          onClick={() => {
            const text = encodeURIComponent('Hello VELRIVA dropshipping support! I am looking for details about the latest trending inventory.');
            window.open(`https://wa.me/${supportPhone.replace(/\D/g, '')}?text=${text}`, '_blank');
          }}
          className="w-full mt-3 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[11px] tracking-wide uppercase transition active:scale-[0.98] cursor-pointer shadow-xs flex items-center justify-center gap-2"
        >
          <span>Direct Whatsapp Support</span>
          <span className="text-xs">⚡</span>
        </button>
      </div>
    </div>
  );
};
