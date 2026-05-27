import React, { useState } from 'react';
import { useAppState } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { Search, X, Sparkles, TrendingUp } from 'lucide-react';

export const SearchScreen: React.FC = () => {
  const { products, navigateTo } = useAppState();

  const [query, setQuery] = useState('');
  
  const popularSearches = ['Tech', 'Windbreaker', 'Retro', 'Apollo Gold', 'Fleece'];

  // Filter products by query
  const filteredProducts = products.filter(prod => {
    if (!query) return false;
    const matchStr = `${prod.name} ${prod.category} ${prod.description}`.toLowerCase();
    return matchStr.includes(query.toLowerCase());
  });

  const handleSuggestionClick = (term: string) => {
    setQuery(term);
  };

  const trendingSelections = products.filter(p => p.isFeatured).slice(0, 4);

  return (
    <div id="search-screen-container" className="pb-24 pt-2">
      {/* 1. Sticky-like Search Input Header */}
      <div className="px-4">
        <div className="relative flex items-center rounded-2xl border border-slate-100 bg-white shadow-xs p-1">
          <Search className="absolute left-4 h-4.5 w-4.5 text-slate-400" />
          <input
            id="search-input-field"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search footwear, accessories, outer..."
            className="h-11 w-full pl-11 pr-10 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-hidden"
          />
          {query && (
            <button
              id="clear-search-btn"
              onClick={() => setQuery('')}
              className="absolute right-4 flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:text-slate-900"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Popular suggestion chips */}
      <div className="mt-5 px-4">
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Popular Quick Queries</h4>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {popularSearches.map(term => (
            <button
              key={term}
              id={`search-chip-${term.replace(' ', '_')}`}
              onClick={() => handleSuggestionClick(term)}
              className="rounded-full border border-slate-100 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:border-slate-300 active:scale-95 shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Search Results block */}
      <div className="mt-6 px-4">
        {query ? (
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-4">
              <span className="text-xs font-bold text-slate-500">Query results</span>
              <span className="font-mono text-xs font-extrabold text-slate-800">{filteredProducts.length} items found</span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-sm font-bold text-slate-600">No matches found</p>
                <p className="text-xs text-slate-400 max-w-[200px] mt-1">
                  Try typing double-check keywords or clear current text filters.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {filteredProducts.map(prod => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Empty/Initial screen recommendations feed */
          <div className="mt-2">
            <h3 className="flex items-center gap-1 text-sm font-extrabold text-slate-900 mb-3">
              <TrendingUp className="h-4 w-4 text-amber-500" />
              <span>Recommended Searches</span>
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              {trendingSelections.map(prod => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
