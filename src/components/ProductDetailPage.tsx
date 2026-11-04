import React, { useState } from 'react';
import { JewelryItem } from '../types';
import { toPersianDigits } from '../utils/formatters';

interface ProductDetailPageProps {
  item: JewelryItem;
  allItems?: JewelryItem[];
  onSelectItem?: (item: JewelryItem) => void;
  onBackToCategory: () => void;
  onBackToHome: () => void;
  wishlistIds?: string[];
  onToggleWishlist?: (item: JewelryItem) => void;
  onOpenVipBooking: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  item,
  onBackToCategory,
  onBackToHome,
  onOpenVipBooking,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFullscreenZoom, setIsFullscreenZoom] = useState(false);
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const images = [item.imageUrl, ...(item.additionalImages || [])];
  const activeImage = images[activeImageIndex] || item.imageUrl;

  const categoryNameFa: Record<string, string> = {
    ring: 'انگشترها',
    necklace: 'گردنبندها',
    earrings: 'گوشواره‌ها',
    bracelet: 'دستبندها',
    set: 'سرویس‌های سلطنتی',
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryPhone.trim()) return;
    setInquirySubmitted(true);
    setTimeout(() => {
      setInquirySubmitted(false);
      setInquiryPhone('');
    }, 4500);
  };

  // WhatsApp prefilled message
  const whatsappMessage = encodeURIComponent(
    `درود، جهت مشاوره و استعلام در مورد اثر نفیس «${item.nameFa}» با کد ${item.itemCode} از وب‌سایت گالری آموزگار پیام می‌دهم.`
  );
  const whatsappUrl = `https://wa.me/985138437395?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-white text-stone-900 font-peyda pt-[69px] pb-20 selection:bg-stone-200 selection:text-black">
      
      {/* 1. Sticky Navigation & Breadcrumbs Bar */}
      <div className="border-b border-stone-200 bg-white/95 backdrop-blur-md sticky top-[69px] z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          
          {/* Breadcrumb Links */}
          <nav className="flex items-center gap-1.5 sm:gap-2 text-xs font-peyda text-stone-500 overflow-x-auto whitespace-nowrap scrollbar-none">
            <button
              onClick={onBackToHome}
              className="hover:text-black transition-colors flex items-center gap-1 font-semibold cursor-pointer"
            >
              <span>صفحه اصلی</span>
            </button>
            <span className="text-stone-300">/</span>
            <button
              onClick={onBackToCategory}
              className="hover:text-black transition-colors font-semibold cursor-pointer"
            >
              {categoryNameFa[item.category] || 'جواهرات'}
            </button>
            <span className="text-stone-300">/</span>
            <span className="text-stone-900 font-bold truncate max-w-[150px] sm:max-w-[260px]">
              {item.nameFa}
            </span>
          </nav>

        </div>
      </div>

      {/* 2. Main Product Experience (Split 2-Column Luxury Layout) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          
          {/* Column A: Gallery & Imagery (7 cols on large desktop) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            
            {/* Primary display: black like the photos, sharp corners; click the image to zoom */}
            <button
              type="button"
              onClick={() => setIsFullscreenZoom(true)}
              aria-label={`مشاهده بزرگ ${item.nameFa}`}
              className="relative w-full aspect-square sm:aspect-[4/3] lg:aspect-square bg-black overflow-hidden flex items-center justify-center select-none cursor-zoom-in"
            >
              <img
                src={activeImage}
                alt={item.nameFa}
                className="w-full h-full object-contain"
              />
            </button>

            {/* Gallery Thumbnails (if multiple images available) */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-20 overflow-hidden border p-1.5 transition-all cursor-pointer shrink-0 bg-black ${
                      activeImageIndex === idx
                        ? 'border-black ring-1 ring-black shadow-sm'
                        : 'border-stone-200 opacity-70 hover:opacity-100 hover:border-stone-400'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`زاویه ${idx + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}


          </div>

          {/* Column B: Product Details & Haute Inquiries (5 cols on large desktop) */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            
            {/* 1. Header Information with Gorgeous Typography matching Home */}
            <div className="space-y-2 border-b border-stone-200 pb-5">
              {/* Title Persian with Peyda font */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-peyda font-bold text-stone-900 leading-snug tracking-normal">
                {item.nameFa}
              </h1>

              {/* Title Latin with Cormorant Garamond */}
              <p className="text-base sm:text-lg text-stone-500 tracking-wide font-normal mt-1">
                {item.nameEn}
              </p>

              {/* Quick Specs Badges: Gold Net Weight & Stones */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                {item.goldNetWeight && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-stone-100 border border-stone-200 text-stone-900 text-xs font-bold font-peyda">
                    <span>وزن خالص طلا:</span>
                    <span>{toPersianDigits(item.goldNetWeight)} گرم</span>
                  </span>
                )}
                {item.selectedStones && item.selectedStones.length > 0 && item.selectedStones.map((st, i) => (
                  <span key={i} className="inline-flex items-center px-2.5 py-1 bg-stone-50 border border-stone-200 text-stone-700 text-xs font-medium font-peyda">
                    {st}
                  </span>
                ))}
              </div>
            </div>

            {/* 2. Atelier Description & Story */}
            <div className="space-y-2">
              <h3 className="font-peyda text-xs sm:text-sm font-bold text-stone-900 tracking-wide flex items-center gap-1.5">
                <span>درباره اثر و کانسپت طراحی</span>
              </h3>
              <p className="font-peyda text-xs sm:text-sm font-light text-stone-600 leading-relaxed text-justify">
                {item.descriptionFa}
              </p>
            </div>

            {/* 3. Action Buttons: VIP Reservation & WhatsApp */}
            <div className="space-y-3 pt-2">
              
              {/* Primary: VIP Private Salon Reservation */}
              <button
                onClick={onOpenVipBooking}
                className="w-full py-3.5 px-6 bg-black hover:bg-stone-800 text-white font-peyda font-bold text-xs sm:text-sm tracking-wide transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <span>هماهنگی پرو و بازدید اختصاصی در سالن VIP</span>
              </button>

              {/* Secondary: WhatsApp Direct Consultation */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-6 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] border border-[#25D366]/30 font-peyda font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>مشاوره و استعلام مستقیم در واتساپ آتلیه</span>
              </a>

              {/* Direct Callback Form */}
              <div className="pt-2">
                {inquirySubmitted ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 font-peyda text-xs sm:text-sm font-medium flex items-center gap-2 animate-in fade-in">
                    <span>شماره شما با موفقیت ثبت شد؛ مشاور ارشد گالری با شما تماس خواهد گرفت.</span>
                  </div>
                ) : (
                  <form onSubmit={handleInquirySubmit} className="flex gap-2">
                    <input
                      type="tel"
                      placeholder="شماره تماس جهت دریافت کاتالوگ و قیمت..."
                      value={inquiryPhone}
                      onChange={(e) => setInquiryPhone(e.target.value)}
                      className="flex-1 px-3.5 py-2.5 bg-stone-50 border border-stone-200 text-xs sm:text-sm font-peyda text-stone-800 placeholder-stone-400 focus:outline-none focus:border-black transition-colors"
                      dir="ltr"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-stone-900 hover:bg-black text-white text-xs sm:text-sm font-peyda font-bold shrink-0 transition-colors cursor-pointer"
                    >
                      ثبت درخواست تماس
                    </button>
                  </form>
                )}
              </div>

            </div>

            {/* 4. Complete Gemological Passport Table with Beautiful Peyda Typography */}
            <div className="pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-peyda text-xs sm:text-sm font-bold text-stone-900 tracking-wide">
                    شناسنامه گوهرشناسی (Gemological Passport)
                  </h3>
                </div>
                <span className="text-[11px] text-stone-600 bg-stone-100 px-2 py-0.5 border border-stone-200">
                  {item.certificateNumber}
                </span>
              </div>

              {/* Clean Luxury Specification Table with Divider Lines (Van Cleef style) */}
              <div className="border border-stone-200 overflow-hidden bg-white divide-y divide-stone-200 text-xs font-peyda">
                
                <div className="grid grid-cols-2 divide-x divide-x-reverse divide-stone-200">
                  <div className="p-3 bg-stone-50/50">
                    <span className="text-[11px] text-stone-500 font-peyda block mb-0.5">مرجع صادرکننده:</span>
                    <span className="font-bold text-stone-900 text-xs sm:text-sm">{item.certificateIssuer} International</span>
                  </div>
                  <div className="p-3 bg-stone-50/50">
                    <span className="text-[11px] text-stone-500 font-peyda block mb-0.5">
                      {item.goldNetWeight ? 'وزن خالص طلا:' : 'فلز گرانبها:'}
                    </span>
                    <span className="font-bold text-stone-900 text-xs sm:text-sm">
                      {item.goldNetWeight ? `${toPersianDigits(item.goldNetWeight)} گرم` : item.metalFa}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 divide-x divide-x-reverse divide-stone-200">
                  <div className="p-3">
                    <span className="text-[11px] text-stone-500 font-peyda block mb-0.5">سنگ اصلی:</span>
                    <span className="font-semibold text-stone-900 text-xs sm:text-sm">{item.stoneNameFa}</span>
                  </div>
                  <div className="p-3">
                    <span className="text-[11px] text-stone-500 font-peyda block mb-0.5">وزن سنگ مرکزی:</span>
                    <span className="font-bold text-stone-900 text-xs sm:text-sm">{toPersianDigits(item.caratMainStone)} قیراط</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 divide-x divide-x-reverse divide-stone-200">
                  <div className="p-3">
                    <span className="text-[11px] text-stone-500 font-peyda block mb-0.5">وزن کل قیراط:</span>
                    <span className="font-bold text-stone-900 text-xs sm:text-sm">{toPersianDigits(item.caratTotal)} Carats Total</span>
                  </div>
                  <div className="p-3">
                    <span className="text-[11px] text-stone-500 font-peyda block mb-0.5">درجه پاکی (Clarity):</span>
                    <span className="font-medium text-stone-800 text-xs sm:text-sm">{item.clarity}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 divide-x divide-x-reverse divide-stone-200">
                  <div className="p-3">
                    <span className="text-[11px] text-stone-500 font-peyda block mb-0.5">نوع تراش سنگ (Cut):</span>
                    <span className="font-medium text-stone-800 text-xs sm:text-sm">{item.cutTypeFa}</span>
                  </div>
                  <div className="p-3">
                    <span className="text-[11px] text-stone-500 font-peyda block mb-0.5">مبدأ استخراج گوهر:</span>
                    <span className="font-semibold text-stone-900 text-xs sm:text-sm">{item.originFa}</span>
                  </div>
                </div>

              </div>
            </div>


          </div>

        </div>
      </div>

      {/* 4. Fullscreen Zoom Modal */}
      {isFullscreenZoom && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 animate-in fade-in"
          onClick={() => setIsFullscreenZoom(false)}
        >
          <button
            onClick={() => setIsFullscreenZoom(false)}
            className="absolute top-6 left-6 p-3 bg-stone-900 hover:bg-white text-stone-300 hover:text-black transition-colors border border-stone-800 cursor-pointer z-10"
            aria-label="بستن"
          >
            <span className="text-sm font-bold px-1">بستن</span>
          </button>
          
          <div className="relative max-w-5xl max-h-[85vh] p-4 flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={activeImage}
              alt={item.nameFa}
              className="max-h-[80vh] max-w-full object-contain filter drop-shadow-2xl"
            />
          </div>

          <div className="text-center text-white space-y-1 mt-2">
            <h3 className="text-base font-peyda font-bold">{item.nameFa}</h3>
            <span className="text-xs text-stone-400 tracking-wider">شناسنامهٔ {item.certificateIssuer}</span>
          </div>
        </div>
      )}

      {/* 5. Bottom Return Bar */}
      <div className="max-w-4xl mx-auto text-center px-4 pt-16">
        <button
          onClick={onBackToCategory}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-peyda font-bold text-stone-800 hover:text-black border-b border-stone-400 hover:border-black pb-0.5 transition-all cursor-pointer"
        >
          <span>مشاهده سایر آثار دسته‌بندی {categoryNameFa[item.category] || 'جواهرات'}</span>
        </button>
      </div>

    </div>
  );
};
