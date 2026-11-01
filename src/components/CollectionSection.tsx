import React, { useState, useMemo } from 'react';
import { Gem, ChevronLeft, X, Sparkles, Award } from 'lucide-react';
import { JewelryItem } from '../types';
import { JEWELRY_ITEMS } from '../data/jewelryData';
import { toPersianDigits } from '../utils/formatters';

interface CollectionSectionProps {
  items?: JewelryItem[];
  onSelectItem?: (item: JewelryItem) => void;
  wishlistIds?: string[];
  onToggleWishlist?: (item: JewelryItem) => void;
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
  onNavigateToCategory?: (category: string) => void;
}

export const CollectionSection: React.FC<CollectionSectionProps> = ({
  items = JEWELRY_ITEMS,
  onSelectItem,
  onNavigateToCategory,
}) => {
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filterTabs = [
    { id: 'all', label: 'تمامی آثار' },
    { id: 'ring', label: 'انگشترها' },
    { id: 'necklace', label: 'گردنبندها' },
    { id: 'earrings', label: 'گوشواره‌ها' },
    { id: 'bracelet', label: 'دستبندها' },
  ];

  const filteredProducts = useMemo(() => {
    if (activeFilter === 'all') return items;
    return items.filter((p) => p.category === activeFilter);
  }, [items, activeFilter]);

  const handleProductCardClick = (product: JewelryItem) => {
    setIsCatalogOpen(false);
    if (onSelectItem) {
      onSelectItem(product);
    }
  };

  return (
    <>
      <section 
        id="collections" 
        className="relative min-h-[85vh] sm:min-h-[95vh] w-full flex flex-col justify-start overflow-hidden border-t border-stone-900 bg-black"
      >
        {/* 78.jpg as the Full-Cover Background Image */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center sm:bg-top bg-no-repeat transition-transform duration-1000 ease-out"
          style={{ backgroundImage: `url('/78.jpg')` }}
        >
          {/* Cinematic Vignette & Luxury Gradient Overlays for Crisp Text Contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/20 to-black/90 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50 pointer-events-none" />
          <div className="absolute inset-0 bg-black/15 pointer-events-none" />
        </div>

        {/* Upper Content: Persian Slogan in RTL with smaller refined font & View Products Button */}
        <div 
          className="relative z-10 w-full max-w-4xl mx-auto px-6 sm:px-8 pt-16 sm:pt-24 text-center flex flex-col items-center select-none"
          dir="rtl"
        >
          {/* The Persian Slogan in smaller, refined typography */}
          <h2 className="text-lg sm:text-2xl md:text-3xl font-medium sm:font-semibold text-white tracking-wide font-peyda leading-relaxed sm:leading-relaxed max-w-2xl drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
            خلق‌شده برای ابدیت؛ زاده‌شده برای تسخیر نگاه‌ها
          </h2>

          {/* View Products Button (دکمه مشاهده محصولات) */}
          <button
            onClick={() => {
              if (onNavigateToCategory) {
                onNavigateToCategory('all');
              } else {
                setIsCatalogOpen(true);
              }
            }}
            className="mt-6 sm:mt-8 group inline-flex items-center gap-2 px-7 sm:px-9 py-3 sm:py-3.5 rounded-full bg-white/10 hover:bg-white text-white hover:text-black backdrop-blur-md border border-white/30 hover:border-white transition-all duration-300 font-peyda text-xs sm:text-sm font-semibold tracking-wide shadow-2xl active:scale-95 cursor-pointer"
          >
            <span>مشاهده محصولات</span>
            <ChevronLeft className="w-4 h-4 text-stone-300 group-hover:text-black group-hover:-translate-x-1 transition-all" />
          </button>
        </div>

      </section>

      {/* Luxury Catalog & Lookbook Modal */}
      {isCatalogOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col p-4 sm:p-6 md:p-8 animate-in fade-in duration-300 font-peyda"
          dir="rtl"
        >
          {/* Modal Header */}
          <div className="max-w-7xl w-full mx-auto flex items-center justify-between pb-4 border-b border-stone-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-stone-900 border border-stone-700 flex items-center justify-center text-amber-400">
                <Gem className="w-5 h-5" />
              </div>
              <div className="text-right">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  ژورنال و کاتالوگ آثار فاخر آموزگار
                </h3>
                <p className="text-[11px] text-stone-400">
                  برای مشاهده مشخصات فنی و شناسنامه هر اثر، روی کارت آن کلیک نمایید
                </p>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setIsCatalogOpen(false)}
              className="p-2.5 rounded-full bg-stone-900 hover:bg-white text-stone-300 hover:text-black transition-colors border border-stone-700 cursor-pointer"
              aria-label="بستن کاتالوگ"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="max-w-7xl w-full mx-auto flex items-center gap-2 py-4 overflow-x-auto shrink-0 scrollbar-none">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  activeFilter === tab.id
                    ? 'bg-white text-black shadow-md'
                    : 'bg-stone-900/90 text-stone-400 hover:text-white border border-stone-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Scrollable Products Grid */}
          <div className="max-w-7xl w-full mx-auto flex-1 overflow-y-auto pt-2 pb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredProducts.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleProductCardClick(item)}
                  className="group relative rounded-2xl bg-[#080808] border border-stone-800/90 hover:border-amber-400/50 p-3.5 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-black cursor-pointer"
                >
                  {/* Image Container */}
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-stone-950 mb-3 border border-stone-900">
                    <img
                      src={item.imageUrl}
                      alt={item.nameFa}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    {item.isMasterpiece && (
                      <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-amber-400/40 text-amber-300 text-[10px] font-bold flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        <span>شاهکار آتلیه</span>
                      </span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="space-y-1.5 text-right flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] text-stone-500 font-mono block" dir="ltr">
                        {item.itemCode}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1 mt-0.5">
                        {item.nameFa}
                      </h4>
                      <p className="text-[10px] text-stone-400 line-clamp-2 mt-1 leading-relaxed">
                        {item.descriptionFa}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-stone-900 flex items-center justify-between text-[11px] text-stone-400">
                      <div className="flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-amber-400" />
                        <span>{item.certificateIssuer}</span>
                      </div>
                      <span className="text-amber-400/90 font-mono text-[10.5px]">
                        {toPersianDigits(item.caratTotal)} قیراط
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </>
  );
};
