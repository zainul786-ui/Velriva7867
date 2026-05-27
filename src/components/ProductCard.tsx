import React from 'react';
import { Product } from '../types';
import { useAppState } from '../context/AppContext';
import { Star, Heart, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { toggleWishlist, wishlist, navigateTo, addToRecentlyViewed } = useAppState();

  const isLiked = wishlist.includes(product.id);

  const handleClick = () => {
    addToRecentlyViewed(product.id);
    navigateTo('productDetails', { productId: product.id });
  };

  return (
    <div
      id={`product-card-${product.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-100/80 bg-white shadow-xs transition duration-300 hover:shadow-md active:scale-98"
    >
      {/* Product Image & Badges */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-50 cursor-pointer" onClick={handleClick}>
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Wishlist toggle */}
        <button
          id={`wishlist-btn-${product.id}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full shadow-sm backdrop-blur-md transition-all active:scale-75 ${
            isLiked
              ? 'bg-rose-500 text-white'
              : 'bg-white/90 text-slate-600 hover:bg-white hover:text-slate-900'
          }`}
        >
          <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
        </button>

        {/* Promo and Info tags */}
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
          {product.discount > 0 && (
            <span className="rounded-md bg-amber-400 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-slate-950">
              {product.discount}% OFF
            </span>
          )}
          {product.isFlashSale && (
            <span className="rounded-md bg-rose-500 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-white">
              FLASH
            </span>
          )}
        </div>
      </div>

      {/* Product Details info */}
      <div className="flex flex-1 flex-col p-3">
        {/* Category & views count */}
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-sans">
            {product.category}
          </span>
          <div className="flex items-center gap-1 font-mono text-[9px] font-semibold text-slate-400">
            <Eye className="h-2.5 w-2.5 text-slate-400" />
            <span>{product.viewsCount}</span>
          </div>
        </div>

        {/* Product Title */}
        <h3
          onClick={handleClick}
          className="line-clamp-2 cursor-pointer text-xs font-semibold leading-relaxed text-slate-800 hover:text-slate-950 flex-1"
        >
          {product.name}
        </h3>

        {/* Rating stars */}
        <div className="mt-1 flex items-center gap-1">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          <span className="text-[10px] font-bold text-slate-800">{product.rating}</span>
          <span className="text-[9px] font-semibold text-slate-400">({product.reviews.length})</span>
        </div>

        {/* Price list */}
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-sm font-extrabold text-slate-950">${product.price}</span>
          {product.oldPrice > product.price && (
            <span className="text-[11px] font-medium text-slate-400 line-through">
              ${product.oldPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
