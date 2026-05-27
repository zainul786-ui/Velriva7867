import React from 'react';
import { useAppState } from '../context/AppContext';
import { CATEGORIES } from '../data/mockData';
import { ChevronRight, Headphones, Zap, AudioLines, Watch, Sparkles, Grid } from 'lucide-react';

export const CategoriesScreen: React.FC = () => {
  const { navigateTo } = useAppState();

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Headphones':
        return <Headphones className="h-5 w-5 text-amber-500" />;
      case 'Zap':
        return <Zap className="h-5 w-5 text-indigo-500" />;
      case 'AudioLines':
        return <AudioLines className="h-5 w-5 text-teal-500" />;
      case 'Watch':
        return <Watch className="h-5 w-5 text-rose-500" />;
      case 'Sparkles':
        return <Sparkles className="h-5 w-5 text-pink-500" />;
      case 'Grid':
      default:
        return <Grid className="h-5 w-5 text-slate-500" />;
    }
  };

  return (
    <div id="categories-screen-container" className="pb-24 pt-2 px-4 space-y-4">
      <div className="mt-2 text-slate-900">
        <h2 className="text-xl font-extrabold tracking-tight">Premium Departments</h2>
        <p className="text-xs text-slate-400">Select any department to browse trending inventory files.</p>
      </div>

      <div className="grid grid-cols-1 gap-3.5 mt-4">
        {CATEGORIES.map(cat => (
          <div
            key={cat.id}
            id={`category-row-${cat.id}`}
            onClick={() => {
              if (cat.slug === 'all') {
                navigateTo('productListing');
              } else {
                navigateTo('productListing', { categorySlug: cat.slug, categoryName: cat.name });
              }
            }}
            className="group relative flex h-28 items-center overflow-hidden rounded-[20px] bg-slate-950 px-5 text-white shadow-md cursor-pointer transition-all duration-300 hover:scale-[1.01] active:scale-99"
          >
            {/* Background image overlay */}
            <img
              src={cat.bannerImage}
              alt={cat.name}
              className="absolute inset-0 h-full w-full object-cover opacity-35 transition duration-500 group-hover:scale-105"
            />
            {/* Gradient shadow backing */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/60 to-transparent" />

            {/* Category content info */}
            <div className="relative flex w-full items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/95 shadow-lg backdrop-blur-xs">
                  {getCategoryIcon(cat.icon)}
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base tracking-tight">{cat.name}</h3>
                  <span className="text-[10px] uppercase font-black tracking-wider text-amber-400">
                    SHOP ARCHIVE
                  </span>
                </div>
              </div>

              <ChevronRight className="h-5 w-5 text-white/50 transition-transform group-hover:translate-x-1 shrink-0" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
