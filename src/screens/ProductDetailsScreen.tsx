import React, { useState, useEffect } from 'react';
import { useAppState } from '../context/AppContext';
import { Share2, Star, Shield, ArrowRight, Eye, Sparkles, MessageSquare, ShoppingBag, ShoppingCart, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';

export const ProductDetailsScreen: React.FC = () => {
  const { products, navigation, addToCart, navigateTo, toggleWishlist, wishlist, incrementProductViews } = useAppState();

  const productId = navigation.params?.productId;
  const product = products.find(p => p.id === productId);

  useEffect(() => {
    if (productId) {
      incrementProductViews(productId);
    }
  }, [productId]);

  if (!product) {
    return (
      <div className="flex h-96 flex-col items-center justify-center p-6 text-center">
        <p className="font-bold text-slate-800">Product not found</p>
        <button
          onClick={() => navigateTo('home')}
          className="mt-4 rounded-xl bg-slate-950 px-4 py-2 text-xs font-bold text-white"
        >
          Return Home
        </button>
      </div>
    );
  }

  // Active state choices
  const [selectedImage, setSelectedImage] = useState(product.image);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0] || '');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors?.[0]?.name || '');

  // Sync selected image if product changes
  useEffect(() => {
    if (product) {
      setSelectedImage(product.image);
    }
  }, [product, productId]);

  const isLiked = wishlist.includes(product.id);

  // Compute unique slideshow image URLs
  const slideshowImages = Array.isArray(product.images) && product.images.length > 0
    ? Array.from(new Set([product.image, ...product.images.filter(x => x && x.trim() !== '')]))
    : [product.image];

  const currentImageIdx = slideshowImages.includes(selectedImage)
    ? slideshowImages.indexOf(selectedImage)
    : 0;

  const handlePrevImage = () => {
    const prevIdx = (currentImageIdx - 1 + slideshowImages.length) % slideshowImages.length;
    setSelectedImage(slideshowImages[prevIdx]);
  };

  const handleNextImage = () => {
    const nextIdx = (currentImageIdx + 1) % slideshowImages.length;
    setSelectedImage(slideshowImages[nextIdx]);
  };

  // Filter out same category as related items
  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id);

  const handleAddToCart = () => {
    addToCart(product, 1, selectedSize, selectedColor);
  };

  const handleBuyNow = () => {
    addToCart(product, 1, selectedSize, selectedColor);
    navigateTo('cart');
  };

  return (
    <div id="product-details-container" className="pb-32 pt-2 bg-slate-50">
      {/* 1. Large Image Canvas Display */}
      <div className="relative bg-white aspect-[4/5] overflow-hidden border-b border-slate-100">
        <img
          src={selectedImage}
          alt={product.name}
          className="mx-auto h-full w-full object-cover select-none"
          referrerPolicy="no-referrer"
        />

        {/* Floating Back Button */}
        <button
          id="product-back-btn"
          onClick={() => navigateTo('home')}
          className="absolute top-4 left-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-850 shadow-md backdrop-blur-md transition hover:bg-white active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="h-4.5 w-4.5" />
        </button>

        {/* Carousel Prev Slide Arrow */}
        {slideshowImages.length > 1 && (
          <button
            onClick={handlePrevImage}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/85 text-slate-800 shadow-md backdrop-blur-xs transition active:scale-90 hover:bg-white cursor-pointer"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}

        {/* Carousel Next Slide Arrow */}
        {slideshowImages.length > 1 && (
          <button
            onClick={handleNextImage}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/85 text-slate-800 shadow-md backdrop-blur-xs transition active:scale-90 hover:bg-white cursor-pointer"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}

        {/* Small floating action overlay badges */}
        <div className="absolute bottom-4 left-4 flex gap-1.5 z-10">
          {product.discount > 0 && (
            <span className="rounded-xl bg-amber-400 px-3 py-1 font-sans text-[10px] font-black uppercase tracking-wider text-slate-950 shadow-md">
              SAVE {product.discount}% OFF
            </span>
          )}
          {product.isFlashSale && (
            <span className="rounded-xl bg-rose-500 px-3 py-1 font-sans text-[10px] font-black uppercase tracking-wider text-white shadow-md">
              FLASH DEAL
            </span>
          )}
        </div>

        {/* Dots Indicator Overlay */}
        {slideshowImages.length > 1 && (
          <div className="absolute bottom-4 right-4 flex gap-1 bg-black/40 px-2.5 py-1.5 rounded-full backdrop-blur-xs z-10">
            {slideshowImages.map((_, dotIdx) => (
              <span
                key={dotIdx}
                className={`h-1.5 rounded-full transition-all ${
                  dotIdx === currentImageIdx ? 'w-3.5 bg-amber-400' : 'w-1.5 bg-white/60'
                }`}
              />
            ))}
          </div>
        )}

        {/* Quick share button mock */}
        <button
          id="share-product-btn"
          onClick={() => {
            if (navigator?.share) {
              navigator.share({ title: product.name, text: product.description });
            } else {
              alert('Copied product share description details to clipboard!');
            }
          }}
          className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-650 shadow-md backdrop-blur-md transition hover:bg-white active:scale-95 cursor-pointer"
        >
          <Share2 className="h-4.5 w-4.5" />
        </button>
      </div>

      {/* 2. Horizontal Image Carousel Thumbs */}
      {slideshowImages.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none">
          {slideshowImages.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(img)}
              className={`h-16 w-14 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                selectedImage === img ? 'border-amber-400 bg-slate-100 shadow-xs' : 'border-slate-200 bg-white'
              }`}
            >
              <img src={img} alt="Thumb" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* 3. Core Meta Section */}
      <div className="mt-4 px-4 py-4 bg-white rounded-3xl mx-3 shadow-[0_1px_4px_0_rgba(15,23,42,0.02)]">
        {/* Title and stats layout */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-0.5">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 font-sans">
              Collection: {product.category}
            </span>
            <h2 className="text-base font-extrabold tracking-tight text-slate-900 leading-snug">
              {product.name}
            </h2>
          </div>

          <button
            id={`heart-toggle-detail-${product.id}`}
            onClick={() => toggleWishlist(product.id)}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-sm transition active:scale-75 ${
              isLiked ? 'bg-rose-50 text-rose-500 ring-1 ring-rose-100' : 'bg-slate-50 text-slate-400'
            }`}
          >
            <Star className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Rating and counters */}
        <div className="mt-3 flex flex-wrap items-center gap-x-3.5 gap-y-1 bg-slate-50 px-3 py-2 rounded-xl text-xs max-w-sm">
          <div className="flex items-center gap-1 font-bold text-slate-800">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span>{product.rating}</span>
            <span className="text-slate-400 font-medium">({product.reviews.length} Verified reviews)</span>
          </div>
          <div className="h-3 w-[1px] bg-slate-200" />
          <div className="flex items-center gap-1 font-mono font-bold text-slate-500 text-[10px]">
            <Eye className="h-3.5 w-3.5" />
            <span>{product.viewsCount} viewed recently</span>
          </div>
        </div>

        {/* Pricing Layout */}
        <div className="mt-4.5 flex items-baseline gap-2.5">
          <span className="text-2xl font-black text-slate-950">${product.price}</span>
          {product.oldPrice > product.price && (
            <span className="text-xs font-semibold text-slate-400 line-through">
              ${product.oldPrice}
            </span>
          )}
          <span className="rounded-md bg-emerald-50 px-2 py-0.5 font-sans text-[10px] font-bold text-emerald-600">
            Exclusive COD Price
          </span>
        </div>

        {/* Live inventory status bar */}
        <div className="mt-4 border-t border-slate-100 pt-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-slate-700">Stock Availability</span>
            <span className={`font-mono font-bold ${product.stock <= 5 ? 'text-rose-500' : 'text-emerald-500'}`}>
              {product.stock === 0 ? 'Out of Stock' : `${product.stock} items remaining`}
            </span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                product.stock <= 5 ? 'bg-rose-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, (product.stock / 35) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 4. Selectable Specifications */}
      <div className="mt-4 px-4 py-4 bg-white rounded-3xl mx-3 shadow-[0_1px_4px_0_rgba(15,23,42,0.02)] space-y-4">
        {/* Colors selector */}
        {product.colors && product.colors.length > 0 && (
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Selected Color: {selectedColor}</h4>
            <div className="flex gap-2.5 mt-2.5">
              {product.colors.map(col => (
                <button
                  key={col.name}
                  onClick={() => setSelectedColor(col.name)}
                  className={`flex h-9 items-center gap-1.5 rounded-full border px-3 transition active:scale-95 ${
                    selectedColor === col.name
                      ? 'border-slate-900 bg-slate-950 text-white shadow-sm'
                      : 'border-slate-200 bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="h-3.5 w-3.5 rounded-full border border-white/20" style={{ backgroundColor: col.hex }} />
                  <span className="text-[10.5px] font-bold">{col.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sizes selector */}
        {product.sizes && product.sizes.length > 0 && (
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Selected Size: {selectedSize}</h4>
            <div className="flex flex-wrap gap-2 mt-2.5">
              {product.sizes.map(sz => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`flex h-10 w-12 items-center justify-center rounded-xl font-mono text-xs font-bold transition active:scale-90 ${
                    selectedSize === sz
                      ? 'bg-slate-950 text-white shadow-md'
                      : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-400'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 5. Descriptions Accordion */}
      <div className="mt-4 px-4 py-4 bg-white rounded-3xl mx-3 shadow-[0_1px_4px_0_rgba(15,23,42,0.02)]">
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Product Overview</h4>
        <p className="mt-2 text-xs text-slate-600 leading-relaxed font-medium">
          {product.description}
        </p>

        {/* Custom safety trust labels */}
        <div className="mt-4.5 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3 text-[10.5px] font-bold text-slate-600">
          <div className="flex items-center gap-2">
            <Shield className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
            <span>Genuine dropship warranty</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4.5 w-4.5 text-blue-500 shrink-0" />
            <span>24/7 Reseller Live support</span>
          </div>
        </div>
      </div>

      {/* 6. Customer ratings testimonials */}
      <div className="mt-4 px-4 py-4 bg-white rounded-3xl mx-3 shadow-[0_1px_4px_0_rgba(15,23,42,0.02)]">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Customer Reviews ({product.reviews.length})</h4>
          <span className="text-xs font-bold text-slate-800">{product.rating} ★ Rating</span>
        </div>

        <div className="mt-3 space-y-3 split-y">
          {product.reviews.length === 0 ? (
            <p className="py-4 text-center text-xs font-medium text-slate-400">
              No testimonials published yet. Complete an order to publish a review!
            </p>
          ) : (
            product.reviews.map(re => (
              <div key={re.id} className="text-xs space-y-1">
                <div className="flex items-center justify-between font-bold text-slate-800">
                  <span>{re.userName}</span>
                  <span className="text-[10px] text-slate-400 font-medium font-mono">{re.date}</span>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${
                        i < Math.floor(re.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-slate-500 leading-relaxed font-sans">{re.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 7. Gallery scroll related products */}
      {relatedProducts.length > 0 && (
        <div className="mt-6">
          <div className="px-4 flex items-center justify-between mb-3">
            <h3 className="text-sm font-extrabold text-slate-900">Recommended Add-ons</h3>
            <span className="text-[10px] bg-amber-400 text-slate-950 rounded-md font-black px-1.5 py-0.5 tracking-wider">MORE</span>
          </div>

          <div className="flex gap-3.5 overflow-x-auto px-4 pb-2 scrollbar-none">
            {relatedProducts.slice(0, 5).map(prod => (
              <div key={prod.id} className="w-[150px] shrink-0">
                <ProductCard product={prod} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. Sticky CTA Panel Actions at footer */}
      <div className="fixed bottom-0 left-0 right-0 z-30 mx-auto max-w-sm border-t border-slate-100 bg-white/95 pb-5 pt-3.5 px-4 shadow-[0_-8px_24px_rgba(0,0,0,0.06)] backdrop-blur-md">
        <div className="flex gap-2.5">
          {/* Add to cart */}
          <button
            id="add-to-cart-cta-btn"
            disabled={product.stock === 0}
            onClick={handleAddToCart}
            className={`flex flex-1 items-center justify-center gap-2 rounded-2xl py-3 text-xs font-extrabold transition active:scale-95 ${
              product.stock === 0
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'border border-slate-950 bg-white text-slate-950 hover:bg-slate-50'
            }`}
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Add to Cart</span>
          </button>

          {/* Buy now */}
          <button
            id="buy-now-cta-btn"
            disabled={product.stock === 0}
            onClick={handleBuyNow}
            className={`flex flex-1 items-center justify-center gap-2 rounded-2xl py-3 text-xs font-extrabold transition text-white active:scale-95 shadow-md ${
              product.stock === 0 ? 'bg-slate-300 cursor-not-allowed' : 'bg-slate-950 hover:bg-slate-900'
            }`}
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
