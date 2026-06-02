import React, { useState, useEffect } from 'react';
import { useAppState } from '../context/AppContext';
import { Share2, Star, Shield, ArrowRight, Eye, Sparkles, MessageSquare, ShoppingBag, ShoppingCart, ChevronLeft, ChevronRight, ArrowLeft, X, Copy } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';

export const ProductDetailsScreen: React.FC = () => {
  const { products, navigation, addToCart, navigateTo, toggleWishlist, wishlist, incrementProductViews, showToast } = useAppState();

  const productId = navigation.params?.productId;
  const product = products.find(p => p.id === productId);

  // States
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Generate our rich promotional dropship message format
  const shareTitle = `✨ Velriva Hot Deal: ${product ? product.name : ''}`;
  const deepLink = `${window.location.protocol}//${window.location.host}/?productId=${product ? product.id : ''}`;
  const shareBody = product ? `*${product.name.toUpperCase()}* 🛍️
━━━━━━━━━━━━━━━━━━━
🔥 *Trending Premium Quality Product*

📝 *Product Description:*
${product.description}

💰 *Exclusive Reselling Price:* ₹${product.price}
📉 *Discount Saved:* ${product.discount}% OFF (MRP: ₹${product.oldPrice})

📌 *Live Catalog Reference (Image Link):*
${product.image}

🛒 *Place Your Instant Order Here:*
👉 ${deepLink}
━━━━━━━━━━━━━━━━━━━
_Marketed by Velriva Dropshipping Network_` : '';

  const handleCopyShare = async () => {
    try {
      await navigator.clipboard.writeText(shareBody);
      showToast('Rich Product specifications and direct link copied!', 'success');
    } catch (e) {
      showToast('Failed to copy. Try selecting manually', 'error');
    }
  };

  const handleWhatsAppShare = () => {
    const encodedText = encodeURIComponent(shareBody);
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator?.share) {
      try {
        await navigator.share({
          title: product.name,
          text: shareBody,
          url: deepLink
        });
        showToast('Shared successfully!', 'success');
      } catch (err) {
        console.warn('Native sharing rejected:', err);
      }
    } else {
      handleCopyShare();
    }
  };

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
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  // Touch Swipe coordinates
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

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

  // Swipe gesture callbacks
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 55;
    const isRightSwipe = distance < -55;
    if (isLeftSwipe) {
      handleNextImage();
    } else if (isRightSwipe) {
      handlePrevImage();
    }
    setTouchStart(null);
    setTouchEnd(null);
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
      {/* 1. Large Image Canvas Display (Contained Designed Box) */}
      <div className="px-3 pt-1">
        <div 
          className="relative mx-auto w-full aspect-square max-h-[300px] bg-white rounded-3xl border border-slate-200/80 shadow-[0_4px_12px_rgba(0,0,0,0.03)] overflow-hidden flex items-center justify-center transition duration-300 hover:shadow-md"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <img
            src={selectedImage}
            alt={product.name}
            className="max-h-full max-w-full object-contain p-3 select-none transition duration-300"
            referrerPolicy="no-referrer"
          />

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

        {/* Share Button (triggers custom Share Sheet popup modal) */}
        <button
          id="share-product-btn"
          onClick={() => setIsShareModalOpen(true)}
          className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-slate-800 shadow-md backdrop-blur-md transition hover:bg-white active:scale-95 cursor-pointer animate-pulse"
          title="Share Product"
        >
          <Share2 className="h-4.5 w-4.5" />
        </button>
      </div>
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
          <span className="text-2xl font-black text-slate-950">₹{product.price}</span>
          {product.oldPrice > product.price && (
            <span className="text-xs font-semibold text-slate-400 line-through">
              ₹{product.oldPrice}
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
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Product Specifications</h4>
        <div id="product-overview-bullets-list" className="mt-3.5 space-y-2.5">
          {(() => {
            const rawLines = product.description.split(/[\n•▪︎○●]+/).map(line => line.trim()).filter(Boolean);
            const displayLines = isDescExpanded ? rawLines : rawLines.slice(0, 3);
            
            return (
              <>
                {displayLines.map((cleanLine, idx) => (
                  <div key={idx} className="text-xs text-slate-600 leading-relaxed font-medium flex items-start gap-2 border-b border-dashed border-slate-100/60 pb-1.5 last:border-0">
                    <span className="text-amber-500 mt-0.5 select-none shrink-0 text-sm">▪</span>
                    <span className="flex-1">{cleanLine}</span>
                  </div>
                ))}
                
                {rawLines.length > 3 && (
                  <button
                    type="button"
                    onClick={() => setIsDescExpanded(!isDescExpanded)}
                    className="w-full mt-2 w-full flex items-center justify-center gap-1.5 py-2.5 text-[10.5px] font-sans font-black uppercase tracking-wider text-indigo-600 border border-indigo-100 bg-indigo-50/20 hover:bg-indigo-50/50 rounded-xl transition cursor-pointer active:scale-97 select-none"
                  >
                    <span>{isDescExpanded ? "Reduce / Chhota karein ▲" : `Read More (${rawLines.length - 3} More Specs) ▼`}</span>
                  </button>
                )}
              </>
            );
          })()}
        </div>

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

      {/* RICH PRODUCT SHARE CONTAINER SHEET MODAL */}
      {isShareModalOpen && (
        <div 
          id="product-share-sheet-modal"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/75 p-4 backdrop-blur-xs font-sans text-left"
          onClick={() => setIsShareModalOpen(false)}
        >
          <div 
            className="w-full max-w-sm rounded-[28px] bg-white border border-slate-100 p-6 shadow-2xl relative animate-slide-up sm:animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-50 mb-4">
              <div className="flex items-center gap-2">
                <span className="p-1 px-2.5 bg-amber-50 rounded-lg text-xs">🚀</span>
                <h4 className="text-sm font-black text-slate-900">Share Product Deal</h4>
              </div>
              <button 
                onClick={() => setIsShareModalOpen(false)}
                className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-700 active:scale-95 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Product Card Preview inside Modal */}
            <div className="bg-slate-50 rounded-2xl p-4 mb-4 border border-slate-100 flex gap-3 text-left">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0 flex-1 flex flex-col justify-between">
                <div>
                  <h5 className="text-xs font-black text-slate-900 truncate leading-tight">{product.name}</h5>
                  <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5 leading-none">{product.category}</p>
                </div>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-xs font-black text-slate-955 text-slate-900 leading-none">₹{product.price}</span>
                  <span className="text-[9.5px] text-slate-400 line-through leading-none">₹{product.oldPrice}</span>
                  <span className="text-[9.5px] font-extrabold text-rose-500 bg-rose-50 px-1 rounded leading-none">{product.discount}% OFF</span>
                </div>
              </div>
            </div>

            {/* Generated Message Visual Payload Preview */}
            <div className="mb-4">
              <span className="text-[9.5px] font-black uppercase text-slate-400 tracking-wider block mb-1.5">Share Template Preview</span>
              <div className="bg-slate-950 text-slate-300 font-mono text-[9px] p-3 rounded-xl border border-slate-800/80 max-h-32 overflow-y-auto leading-normal text-left whitespace-pre-wrap select-all">
                {shareBody}
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-2 pt-2 border-t border-slate-50">
              <button
                type="button"
                onClick={handleWhatsAppShare}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-extrabold text-xs rounded-xl transition shadow-xs cursor-pointer"
              >
                <span>💬 Direct Share to WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleCopyShare}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-950 hover:bg-slate-900 active:scale-95 text-white font-extrabold text-xs rounded-xl transition cursor-pointer"
              >
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Rich Details Payload</span>
              </button>

              {navigator?.share && (
                <button
                  type="button"
                  onClick={handleNativeShare}
                  className="w-full flex items-center justify-center gap-2 py-2.5 border border-slate-200 hover:bg-slate-50 active:scale-95 text-slate-700 font-extrabold text-xs rounded-xl transition cursor-pointer"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  <span>Open Native Share Options</span>
                </button>
              )}
            </div>

            {/* Helpful Helper footer */}
            <p className="text-[9px] text-slate-400 mt-3 text-center font-medium">
              Customers who open this link will land directly on this product page.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
