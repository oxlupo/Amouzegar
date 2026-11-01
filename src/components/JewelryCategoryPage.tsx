import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ArrowRight,
  Heart, 
  SlidersHorizontal,
  Sparkles,
  Phone,
  Gem
} from 'lucide-react';
import { JewelryItem } from '../types';

interface JewelryCategoryPageProps {
  category: string;
  onSelectCategory: (category: string) => void;
  items: JewelryItem[];
  onSelectItem: (item: JewelryItem) => void;
  wishlistIds: string[];
  onToggleWishlist: (item: JewelryItem) => void;
  onBackToHome: () => void;
  onOpenVipBooking: () => void;
}

const CATEGORY_TABS = [
  { id: 'all', titleFa: 'همه جواهرات', titleEn: 'All Creations' },
  { id: 'ring', titleFa: 'انگشتر', titleEn: 'Rings' },
  { id: 'necklace', titleFa: 'گردنبند و مدال', titleEn: 'Necklaces & Pendants' },
  { id: 'earrings', titleFa: 'گوشواره', titleEn: 'Earrings' },
  { id: 'stud-earrings', titleFa: 'گوشواره میخی', titleEn: 'Stud Earrings' },
  { id: 'bracelet', titleFa: 'دستبند و النگو', titleEn: 'Bracelets & Bangles' },
  { id: 'watches', titleFa: 'ساعت‌های جواهرنشان', titleEn: 'Watches' },
  { id: 'men', titleFa: 'جواهرات مردانه', titleEn: "Men's Jewelry" },
  { id: 'set', titleFa: 'سرویس‌های جواهر', titleEn: 'High Jewelry Sets' },
  // Gemstones
  { id: 'diamond', titleFa: 'الماس سفید (برلیان)', titleEn: 'White Diamond' },
  { id: 'yellow-diamond', titleFa: 'الماس زرد فنسی', titleEn: 'Yellow Diamond' },
  { id: 'emerald', titleFa: 'زمرد کلمبیا', titleEn: 'Emerald' },
  { id: 'sapphire', titleFa: 'یاقوت کبود سیلان', titleEn: 'Sapphire' },
  { id: 'ruby', titleFa: 'یاقوت سرخ برمه', titleEn: 'Burmese Ruby' },
  // Metals
  { id: 'white-gold', titleFa: 'طلای سفید', titleEn: 'White Gold' },
  { id: 'rose-gold', titleFa: 'رزگلد', titleEn: 'Rose Gold' },
  { id: 'yellow-gold', titleFa: 'طلای زرد', titleEn: 'Yellow Gold' },
  { id: 'platinum', titleFa: 'پلاتین خالص', titleEn: 'Platinum' },
  // Curated by Amuzegar
  { id: 'curated-amuzegar', titleFa: 'منتخب آموزگار', titleEn: 'Curated by Amuzegar' },
  { id: 'curated-new', titleFa: 'جدیدترین جواهرات', titleEn: 'New Jewelry' },
  { id: 'curated-stacking', titleFa: 'جواهرات چندلایه', titleEn: 'Stacking Jewelry' },
  { id: 'curated-nature', titleFa: 'الهام‌گرفته از طبیعت', titleEn: 'Inspired by Nature' },
];

export const JewelryCategoryPage: React.FC<JewelryCategoryPageProps> = ({
  category,
  onSelectCategory,
  items,
  onSelectItem,
  wishlistIds,
  onToggleWishlist,
  onBackToHome,
  onOpenVipBooking,
}) => {
  // Track active image dot index per item for interactive carousel dots
  const [activeImageIndexes, setActiveImageIndexes] = useState<Record<string, number>>({});
  // Selected card for soft blue highlight (as seen in the reference image)
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  // Filter items based on active category
  const filteredItems = useMemo(() => {
    if (!category || category === 'all') {
      return items;
    }
    const matched = items.filter((item) => {
      // 1. Direct Categories
      if (category === 'ring' || category === 'necklace' || category === 'earrings' || category === 'bracelet' || category === 'set') {
        return item.category === category;
      }
      if (category === 'stud-earrings') {
        return item.category === 'earrings' || item.nameFa.includes('میخی') || item.cutTypeFa.includes('گرد');
      }
      if (category === 'watches' || category === 'men') {
        return item.tagsFa?.some(t => t.includes('مردانه') || t.includes('ساعت')) || item.category === 'ring' || item.category === 'bracelet';
      }
      // 2. Gemstones
      if (category === 'diamond') {
        return item.stoneType === 'diamond' || item.stoneNameFa.includes('الماس') || item.stoneNameFa.includes('برلیان') || item.selectedStones?.includes('الماس') || item.selectedStones?.includes('برلیان');
      }
      if (category === 'yellow-diamond') {
        return item.stoneNameFa.includes('زرد') || item.stoneType === 'diamond';
      }
      if (category === 'emerald') {
        return item.stoneType === 'emerald' || item.stoneNameFa.includes('زمرد') || item.selectedStones?.includes('زمرد');
      }
      if (category === 'sapphire') {
        return item.stoneType === 'sapphire' || item.stoneNameFa.includes('کبود') || item.stoneNameFa.includes('یاقوت') || item.selectedStones?.includes('یاقوت');
      }
      if (category === 'ruby') {
        return item.stoneType === 'ruby' || item.stoneNameFa.includes('سرخ') || item.stoneNameFa.includes('یاقوت');
      }
      // 3. Metals
      if (category === 'white-gold') {
        return item.metalFa.includes('سفید') || item.metalEn?.toLowerCase().includes('white');
      }
      if (category === 'rose-gold') {
        return item.metalFa.includes('رز') || item.metalEn?.toLowerCase().includes('rose');
      }
      if (category === 'yellow-gold') {
        return item.metalFa.includes('زرد') || item.metalEn?.toLowerCase().includes('yellow');
      }
      if (category === 'platinum') {
        return item.metalFa.includes('پلاتین') || item.metalEn?.toLowerCase().includes('platinum');
      }
      // 4. Curated by Amuzegar
      if (category === 'curated-amuzegar' || category === 'curated-new') {
        return item.isMasterpiece || item.featuredInHeroVideo;
      }
      if (category === 'curated-stacking') {
        return item.category === 'ring' || item.category === 'bracelet';
      }
      if (category === 'curated-nature') {
        return item.tagsFa?.some(t => t.includes('طبیعت') || t.includes('اشک')) || item.stoneType === 'emerald' || item.stoneType === 'ruby';
      }
      return item.category === category;
    });

    return matched.length > 0 ? matched : items;
  }, [items, category]);

  const activeCategoryObj = CATEGORY_TABS.find((c) => c.id === category) || CATEGORY_TABS[0];

  const handleDotClick = (e: React.MouseEvent, itemId: string, index: number) => {
    e.stopPropagation();
    setActiveImageIndexes((prev) => ({ ...prev, [itemId]: index }));
  };

  return (
    <div className="min-h-screen bg-white text-stone-900 font-peyda pt-20 sm:pt-24 pb-16 selection:bg-stone-200 selection:text-black">
      
      {/* 1. Top Breadcrumb & Back Action Bar */}
      <div className="border-b border-stone-200 bg-white sticky top-14 sm:top-16 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          
          {/* Breadcrumb & Title */}
          <div className="flex items-center gap-2 text-xs text-stone-500 font-peyda">
            <button
              onClick={onBackToHome}
              className="hover:text-black transition-colors flex items-center gap-1 font-medium cursor-pointer"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>صفحه اصلی</span>
            </button>
            <span className="text-stone-300">/</span>
            <span className="text-stone-400">جواهرات</span>
            <span className="text-stone-300">/</span>
            <span className="text-stone-900 font-bold">{activeCategoryObj.titleFa}</span>
          </div>

          {/* Quick Counter & VIP Consultation Action */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-stone-500 hidden sm:inline-block">
              {filteredItems.length} اثر نفیس
            </span>
            <button
              onClick={onOpenVipBooking}
              className="text-xs font-semibold px-3 py-1.5 rounded-full border border-stone-300 hover:border-black text-stone-800 hover:text-black transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Phone className="w-3 h-3 text-stone-600" />
              <span>مشاوره اختصاصی سالن</span>
            </button>
          </div>

        </div>

        {/* 2. Horizontal Category Tabs (Van Cleef & Arpels luxury minimalist tabs) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto scrollbar-none py-2 flex items-center gap-2 border-t border-stone-100">
          {CATEGORY_TABS.map((tab) => {
            const isActive = (category || 'all') === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectCategory(tab.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer font-peyda ${
                  isActive
                    ? 'bg-black text-white shadow-xs font-bold'
                    : 'text-stone-600 hover:text-black hover:bg-stone-100'
                }`}
              >
                <span>{tab.titleFa}</span>
                <span className="text-[9px] mr-1.5 opacity-60 font-cinzel tracking-wider uppercase hidden sm:inline">
                  {tab.titleEn}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Hero Header for the Category */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6 text-center">
        <span className="font-cinzel text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-stone-400 block mb-1">
          AMOZEGAR HAUTE JOAILLERIE
        </span>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-peyda font-bold text-stone-900 tracking-normal">
          {activeCategoryObj.titleFa}
        </h1>
        <p className="text-xs sm:text-sm font-peyda font-light text-stone-500 max-w-xl mx-auto mt-2 leading-relaxed">
          مجموعه‌ای از تک‌نسخه‌های دست‌ساز با گوهرشناسی بین‌المللی GIA، تراش‌های استثنایی و طلای ۱۸ عیار آتلیه آموزگار
        </p>
      </div>

      {/* 4. Luxury Grid with Fine Dividing Lines (Exactly like Van Cleef & Arpels Reference) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Outer border container creating the crisp hairline grid frame */}
        <div className="border-t border-r border-stone-200 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 bg-stone-200 gap-px">
          
          {filteredItems.map((item, idx) => {
            const isWishlisted = wishlistIds.includes(item.id);
            const images = [item.imageUrl, ...(item.additionalImages || [])];
            const currentImgIdx = activeImageIndexes[item.id] || 0;
            const currentImg = images[currentImgIdx % images.length] || item.imageUrl;
            
            // Allow clicking to highlight with the soft-blue tint like the first item in reference
            const isSelected = selectedCardId === item.id || (selectedCardId === null && idx === 0);

            return (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedCardId(item.id);
                  onSelectItem(item);
                }}
                className={`relative flex flex-col justify-between p-4 sm:p-6 transition-all duration-300 cursor-pointer group select-none ${
                  isSelected 
                    ? 'bg-[#b6d0ee]/45 hover:bg-[#b6d0ee]/60' 
                    : 'bg-white hover:bg-stone-50/80'
                }`}
              >
                {/* Wishlist Heart Button (Top-Right subtle) */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleWishlist(item);
                  }}
                  className="absolute top-3 left-3 z-10 p-1.5 rounded-full text-stone-400 hover:text-rose-600 transition-colors"
                  aria-label="افزودن به نشان‌شده‌ها"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600 text-rose-600' : 'stroke-[1.5]'}`} />
                </button>

                {/* Top Section: Centered Product Image */}
                <div className="w-full flex flex-col items-center">
                  
                  {/* Image Presentation Box with Padding */}
                  <div className="relative w-full aspect-square flex items-center justify-center p-3 sm:p-4 overflow-hidden">
                    <img
                      src={currentImg}
                      alt={item.nameFa}
                      className="max-h-full max-w-full object-contain filter drop-shadow-sm group-hover:scale-105 transition-transform duration-500 ease-out"
                      loading="lazy"
                    />
                  </div>

                  {/* Dot Carousel Indicators (4 dots exactly like reference image) */}
                  <div className="flex items-center justify-center gap-1.5 my-3">
                    {[0, 1, 2, 3].map((dotIndex) => {
                      const isActive = dotIndex === currentImgIdx;
                      return (
                        <button
                          key={dotIndex}
                          type="button"
                          onClick={(e) => handleDotClick(e, item.id, dotIndex)}
                          className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                            isActive
                              ? 'bg-stone-800 scale-125'
                              : 'bg-stone-300 hover:bg-stone-400'
                          }`}
                          aria-label={`اسلاید ${dotIndex + 1}`}
                        />
                      );
                    })}
                  </div>

                </div>

                {/* Bottom Section: Typography & Details matching Van Cleef & Arpels */}
                <div className="text-center flex flex-col items-center mt-2 space-y-1 font-peyda">
                  
                  {/* 1. Title in Elegant Peyda Font */}
                  <h3 className="font-peyda text-sm sm:text-base font-bold text-stone-900 group-hover:text-amber-900 transition-colors line-clamp-2 leading-snug px-1">
                    {item.nameFa}
                  </h3>

                  {/* 2. English Title / Collection Name */}
                  <span className="font-cormorant text-xs sm:text-sm text-stone-500 tracking-wide line-clamp-1 italic">
                    {item.nameEn}
                  </span>

                  {/* 3. Material & Gem Description (e.g. Net Gold Weight, Stones & Cuts) */}
                  <p className="font-peyda text-[11px] sm:text-xs text-stone-500 pt-1 line-clamp-1">
                    {item.goldNetWeight ? `طلای ۱۸ عیار (${item.goldNetWeight} گرم)` : item.metalFa} • {item.stoneNameFa}
                  </p>

                  {/* 4. Price / Atelier Status */}
                  <div className="font-peyda text-xs sm:text-sm font-bold text-stone-800 pt-0.5">
                    {item.availability || 'استعلام قیمت آتلیه'}
                  </div>

                  {/* 5. Variations Tag (like "+1 stone variation" in reference) */}
                  <div className="font-peyda text-[10px] text-stone-500 tracking-wide pt-1">
                    +۱ تنوع تراش و گوهر
                  </div>

                </div>

              </div>
            );
          })}

          {/* Reserved slot for photos user will send (Respecting: "عکس از خودت درست نکن عکس برات میفرستم") */}
          <div className="relative flex flex-col items-center justify-center p-6 bg-stone-50 text-center select-none border-stone-200">
            <div className="w-12 h-12 rounded-full border border-stone-300 flex items-center justify-center text-stone-400 mb-3">
              <Gem className="w-5 h-5 stroke-[1.5]" />
            </div>
            <span className="text-xs font-bold text-stone-700">
              آثار جدید این دسته‌بندی
            </span>
            <span className="text-[11px] text-stone-400 mt-1 max-w-[180px] leading-relaxed">
              تصاویر اختصاصی آتلیه به زودی افزوده می‌شوند
            </span>
            <button
              onClick={onOpenVipBooking}
              className="mt-4 text-[10px] uppercase tracking-wider font-semibold text-stone-600 hover:text-black underline underline-offset-4 cursor-pointer"
            >
              استعلام سفارش اختصاصی
            </button>
          </div>

        </div>

      </div>

      {/* 5. Bottom Navigation & Footer Call to Action */}
      <div className="max-w-4xl mx-auto text-center px-4 pt-16 pb-8">
        <p className="text-xs text-stone-400">
          تمامی آثار گالری آموزگار همراه با شناسنامه معتبر سنگ‌های قیمتی و گارانتی اصالت عرضه می‌گردند.
        </p>
        <button
          onClick={onBackToHome}
          className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-stone-800 hover:text-black border-b border-stone-400 hover:border-black pb-0.5 transition-all cursor-pointer"
        >
          <span>بازگشت به ویترین اصلی آموزگار</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
