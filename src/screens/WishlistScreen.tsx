import React from 'react';
import { useAppState } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { Heart, ShoppingBag } from 'lucide-react';

export const WishlistScreen: React.FC = () => {
  const { wishlist, products, navigateTo } = useAppState();

  const savedProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div id="wishlist-screen-container" className="pb-24 pt-2 px-4">
      <div className="mt-2 text-slate-900">
        <h2 className="text-xl font-extrabold tracking-tight">Your Saved Items</h2>
        <p className="text-xs text-slate-400 font-medium">Keep tabs on dynamic dropship inventory prices.</p>
      </div>

      {savedProducts.length === 0 ? (
        <div className="flex h-96 flex-col items-center justify-center text-center gap-4 mt-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <Heart className="h-7 w-7 text-slate-400" />
          </div>
          <div className="space-y-1">
            <h3 className="font-extrabold text-slate-900 text-sm">Wishlist is empty</h3>
            <p className="text-xs text-slate-400 max-w-[210px] mx-auto leading-relaxed">
              Tap the heartbeat icons on any product card to pin items inside this locker.
            </p>
          </div>
          
          <button
            id="browse-wish-cta"
            onClick={() => navigateTo('home')}
            className="mt-2 rounded-2xl bg-slate-950 px-6 py-3 text-xs font-black text-white hover:bg-slate-900 active:scale-95 shadow-md flex items-center gap-2"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Browse Products</span>
          </button>
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-2 gap-3">
          {savedProducts.map(prod => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      )}
    </div>
  );
};
