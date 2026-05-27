import React, { useState } from 'react';
import { useAppState } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { CATEGORIES } from '../data/mockData';
import { SlidersHorizontal, ArrowUpDown, LayoutGrid, SquareSplitVertical } from 'lucide-react';

export const ProductListingScreen: React.FC = () => {
  const { products, navigation, navigateTo } = useAppState();

  const selectedCategorySlug = navigation.params?.categorySlug || 'all';

  // Sort and layout configuration state
  const [sortBy, setSortBy] = useState<'popular' | 'priceLow' | 'priceHigh' | 'rating'>('popular');
  const [columns, setColumns] = useState<2 | 1>(2);

  const activeCategory = CATEGORIES.find(c => c.slug === selectedCategorySlug);

  // Filter products by category
  const filteredProducts = products.filter(prod => {
    if (selectedCategorySlug === 'all') return true;
    return prod.category === selectedCategorySlug;
  });

  // Sort logic implementation
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'priceLow':
        return a.price - b.price;
      case 'priceHigh':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'popular':
      default:
        return b.viewsCount - a.viewsCount;
    }
  });

  return (
    <div id="product-listing-container" className="pb-24 pt-2">
      {/* Category banner illustration header */}
      <div className="relative mx-4 overflow-hidden rounded-[20px] bg-slate-900 h-24 shadow-sm">
        <img
          src={activeCategory?.bannerImage || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop'}
          alt="Category banner"
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-slate-950/20" />
        <div className="absolute inset-0 flex flex-col justify-end p-4">
          <span className="text-[9px] font-black uppercase tracking-wider text-amber-400">VELRIVA ARCHIVES</span>
          <h2 className="text-base font-black tracking-tight text-white capitalize">
            {activeCategory?.name || 'All Collections'}
          </h2>
        </div>
      </div>

      {/* Horizontal categories inline filter selectors */}
      <div className="mt-4 flex gap-2 overflow-x-auto px-4 pb-1.5 scrollbar-none">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => navigateTo('productListing', { categorySlug: cat.slug, categoryName: cat.name })}
            className={`rounded-full shrink-0 px-4 py-1.5 text-xs font-bold transition ${
              selectedCategorySlug === cat.slug
                ? 'bg-slate-950 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Utility Toolbar for Sort, Layouts */}
      <div className="mx-4 mt-3 flex items-center justify-between border-y border-slate-100 py-2.5">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-xs font-bold text-slate-500">
            {sortedProducts.length} Items found
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Sorting controls */}
          <div className="relative flex items-center gap-1">
            <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="appearance-none bg-transparent pr-4 text-xs font-black text-slate-800 focus:outline-hidden"
            >
              <option value="popular">Popularity</option>
              <option value="priceLow">Price: Low-High</option>
              <option value="priceHigh">Price: High-Low</option>
              <option value="rating">Reviews Rating</option>
            </select>
          </div>

          <div className="h-4 w-[1px] bg-slate-200" />

          {/* Column layout triggers */}
          <div className="flex items-center gap-1.5">
            <button
              id="layout-grid-two-btn"
              onClick={() => setColumns(2)}
              className={`p-1 rounded-md transition ${columns === 2 ? 'bg-slate-100 text-slate-900' : 'text-slate-400'}`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
            <button
              id="layout-grid-one-btn"
              onClick={() => setColumns(1)}
              className={`p-1 rounded-md transition ${columns === 1 ? 'bg-slate-100 text-slate-900' : 'text-slate-400'}`}
            >
              <SquareSplitVertical className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Product list renderer */}
      <div className="mt-4 px-4">
        {sortedProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <p className="text-sm font-bold text-slate-500">No products available</p>
            <p className="text-xs text-slate-400 max-w-[200px] mt-1">
              Currently compiling fresh stock details for this category. Check back later!
            </p>
          </div>
        ) : (
          <div
            className={`grid gap-3 transition-all duration-300 ${
              columns === 2 ? 'grid-cols-2' : 'grid-cols-1'
            }`}
          >
            {sortedProducts.map(prod => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
