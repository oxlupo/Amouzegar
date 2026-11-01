import React, { useState, useEffect, useMemo } from 'react';
import { 
  ArrowRight, 
  ChevronLeft, 
  Heart, 
  Share2, 
  Clock, 
  Award, 
  ShieldCheck, 
  Sparkles, 
  MapPin, 
  Gem, 
  CheckCircle2, 
  Maximize2, 
  X, 
  MessageCircle,
  Play
} from 'lucide-react';
import { JewelryItem } from '../types';
import { toPersianDigits } from '../utils/formatters';

interface ProductDetailPageProps {
  item: JewelryItem;
  allItems: JewelryItem[];
  onSelectItem: (item: JewelryItem) => void;
  onBackToCategory: () => void;
  onBackToHome: () => void;
  wishlistIds: string[];
  onToggleWishlist: (item: JewelryItem) => void;
  onOpenVipBooking: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  item,
  allItems,
  onSelectItem,
  onBackToCategory,
  onBackToHome,
  wishlistIds,
  onToggleWishlist,
  onOpenVipBooking,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFullscreenZoom, setIsFullscreenZoom] = useState(false);
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  
  // Radial Slider State
  const [radialIndex, setRadialIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const isWishlisted = wishlistIds.includes(item.id);
  const images = [item.imageUrl, ...(item.additionalImages || [])];
  const activeImage = images[activeImageIndex] || item.imageUrl;

  // Filter related items for radial carousel (prioritize matching category and masterpieces)
  const relatedItems = useMemo(() => {
    const sameCat = allItems.filter((other) => other.id !== item.id && other.category === item.category);
    const others = allItems.filter((other) => other.id !== item.id && other.category !== item.category);
    const combined = [...sameCat, ...others];
    return combined.length > 0 ? combined : allItems;
  }, [allItems, item.id, item.category]);

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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: item.nameFa,
        text: `${item.nameFa} - گالری جواهرات داود آموزگار`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // WhatsApp prefilled message
  const whatsappMessage = encodeURIComponent(
    `درود، جهت مشاوره و استعلام در مورد اثر نفیس «${item.nameFa}» با کد ${item.itemCode} از وب‌سایت گالری آموزگار پیام می‌دهم.`
  );
  const whatsappUrl = `https://wa.me/989120000000?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-white text-stone-900 font-peyda pt-16 sm:pt-20 pb-20 selection:bg-stone-200 selection:text-black">
      
      {/* 1. Sticky Navigation & Breadcrumbs Bar */}
      <div className="border-b border-stone-200 bg-white/95 backdrop-blur-md sticky top-14 sm:top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          
          {/* Breadcrumb Links */}
          <nav className="flex items-center gap-1.5 sm:gap-2 text-xs font-peyda text-stone-500 overflow-x-auto whitespace-nowrap scrollbar-none">
            <button
              onClick={onBackToHome}
              className="hover:text-black transition-colors flex items-center gap-1 font-semibold cursor-pointer"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>صفحه اصلی</span>
            </button>
            <span className="text-stone-300">/</span>
            <button
              onClick={onBackToCategory}
              className="hover:text-black transition-colors font-semibold cursor-pointer"
            >
              جواهرات ({categoryNameFa[item.category] || 'آثار فاخر'})
            </button>
            <span className="text-stone-300">/</span>
            <span className="text-stone-900 font-bold truncate max-w-[150px] sm:max-w-[260px]">
              {item.nameFa}
            </span>
          </nav>

          {/* Quick Actions (Wishlist & Share) */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleShare}
              className="p-2 rounded-full border border-stone-200 hover:border-black text-stone-600 hover:text-black transition-colors relative cursor-pointer"
              aria-label="اشتراک‌گذاری"
              title="اشتراک‌گذاری این اثر"
            >
              <Share2 className="w-4 h-4 stroke-[1.5]" />
              {copiedLink && (
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-peyda font-medium bg-black text-white px-2 py-0.5 rounded whitespace-nowrap shadow">
                  لینک کپی شد
                </span>
              )}
            </button>

            <button
              onClick={() => onToggleWishlist(item)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-peyda font-bold transition-all cursor-pointer ${
                isWishlisted
                  ? 'bg-rose-50 border-rose-300 text-rose-700'
                  : 'border-stone-200 hover:border-black text-stone-700 hover:text-black'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-600 text-rose-600' : 'stroke-[1.75]'}`} />
              <span className="hidden sm:inline">{isWishlisted ? 'در نشان‌شده‌ها' : 'نشان کردن اثر'}</span>
            </button>
          </div>

        </div>
      </div>

      {/* 2. Main Product Experience (Split 2-Column Luxury Layout) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          
          {/* Column A: Gallery & Imagery (7 cols on large desktop) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            
            {/* Primary Display Frame with hairline border and luxury white background */}
            <div className="relative w-full aspect-square sm:aspect-[4/3] lg:aspect-square bg-stone-50 border border-stone-200 rounded-2xl overflow-hidden flex items-center justify-center p-6 sm:p-10 select-none group">
              


              {/* Fullscreen Zoom Trigger Button */}
              <button
                onClick={() => setIsFullscreenZoom(true)}
                className="absolute top-4 left-4 z-10 p-2.5 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-black border border-stone-200 shadow-sm transition-all cursor-pointer opacity-90 group-hover:opacity-100"
                aria-label="مشاهده در اندازه بزرگ"
                title="مشاهده جزئیات با کیفیت اصلی"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              {/* Main Image */}
              <img
                src={activeImage}
                alt={item.nameFa}
                className="max-h-full max-w-full object-contain filter drop-shadow-md transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Certificate Watermark Stamp in Corner */}
              <div className="absolute bottom-4 left-4 z-10 px-2.5 py-1 rounded-md bg-white/80 border border-stone-200 text-[10px] font-cinzel text-stone-600 tracking-wider">
                {item.certificateIssuer} CERTIFIED
              </div>
            </div>

            {/* Gallery Thumbnails (if multiple images available) */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border p-1.5 transition-all cursor-pointer shrink-0 bg-stone-50 ${
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

            {/* Atelier Craftsmanship Note */}
            <div className="border border-stone-200 bg-stone-50/60 rounded-xl p-4 sm:p-5 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-700 shrink-0 mt-0.5">
                <Gem className="w-5 h-5 stroke-[1.5]" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs sm:text-sm font-peyda font-bold text-stone-900">
                  فرآیند خلق اثر در آتلیه داود آموزگار
                </h4>
                <p className="text-xs sm:text-sm font-peyda font-light text-stone-600 leading-relaxed">
                  مخراج‌کاری این اثر به شیوه دست‌ساز زیر میکروسکوپ و با دقیق‌ترین محاسبات زاویه شکست نور گوهرها انجام گردیده است. تمامی سنگ‌های مرکزی دارای شناسنامه اختصاصی معتبر هستند.
                </p>
              </div>
            </div>

          </div>

          {/* Column B: Product Details & Haute Inquiries (5 cols on large desktop) */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            
            {/* 1. Header Information with Gorgeous Typography matching Home */}
            <div className="space-y-2 border-b border-stone-200 pb-5">
              <div className="flex items-center justify-between">
                <span className="font-cinzel text-[10px] sm:text-[11px] tracking-[0.2em] text-stone-500 uppercase">
                  ITEM CODE: {item.itemCode}
                </span>
              </div>

              {/* Title Persian with Peyda font */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-peyda font-bold text-stone-900 leading-snug tracking-normal">
                {item.nameFa}
              </h1>

              {/* Title Latin with Cormorant Garamond */}
              <p className="font-cormorant text-base sm:text-lg text-stone-500 tracking-wide font-normal italic mt-1">
                {item.nameEn}
              </p>

              {/* Quick Specs Badges: Gold Net Weight & Stones */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                {item.goldNetWeight && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-stone-100 border border-stone-200 text-stone-900 text-xs font-bold font-peyda">
                    <span>وزن خالص طلا:</span>
                    <span>{toPersianDigits(item.goldNetWeight)} گرم</span>
                  </span>
                )}
                {item.selectedStones && item.selectedStones.length > 0 && item.selectedStones.map((st, i) => (
                  <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-lg bg-stone-50 border border-stone-200 text-stone-700 text-xs font-medium font-peyda">
                    {st}
                  </span>
                ))}
              </div>
            </div>

            {/* 2. Atelier Description & Story */}
            <div className="space-y-2">
              <h3 className="font-peyda text-xs sm:text-sm font-bold text-stone-900 tracking-wide flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
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
                className="w-full py-3.5 px-6 rounded-xl bg-black hover:bg-stone-800 text-white font-peyda font-bold text-xs sm:text-sm tracking-wide transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <Clock className="w-4 h-4 text-amber-300" />
                <span>هماهنگی پرو و بازدید اختصاصی در سالن VIP</span>
              </button>

              {/* Secondary: WhatsApp Direct Consultation */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-6 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] border border-[#25D366]/30 font-peyda font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>مشاوره و استعلام مستقیم در واتساپ آتلیه</span>
              </a>

              {/* Direct Callback Form */}
              <div className="pt-2">
                {inquirySubmitted ? (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-peyda text-xs sm:text-sm font-medium flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>شماره شما با موفقیت ثبت شد؛ مشاور ارشد گالری با شما تماس خواهد گرفت.</span>
                  </div>
                ) : (
                  <form onSubmit={handleInquirySubmit} className="flex gap-2">
                    <input
                      type="tel"
                      placeholder="شماره تماس جهت دریافت کاتالوگ و قیمت..."
                      value={inquiryPhone}
                      onChange={(e) => setInquiryPhone(e.target.value)}
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm font-peyda text-stone-800 placeholder-stone-400 focus:outline-none focus:border-black transition-colors"
                      dir="ltr"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-black text-white text-xs sm:text-sm font-peyda font-bold shrink-0 transition-colors cursor-pointer"
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
                  <Award className="w-4 h-4 text-amber-600" />
                  <h3 className="font-peyda text-xs sm:text-sm font-bold text-stone-900 tracking-wide">
                    شناسنامه گوهرشناسی (Gemological Passport)
                  </h3>
                </div>
                <span className="font-cinzel text-[11px] text-stone-600 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                  {item.certificateNumber}
                </span>
              </div>

              {/* Clean Luxury Specification Table with Divider Lines (Van Cleef style) */}
              <div className="border border-stone-200 rounded-xl overflow-hidden bg-white divide-y divide-stone-200 text-xs font-peyda">
                
                <div className="grid grid-cols-2 divide-x divide-x-reverse divide-stone-200">
                  <div className="p-3 bg-stone-50/50">
                    <span className="text-[11px] text-stone-500 font-peyda block mb-0.5">مرجع صادرکننده:</span>
                    <span className="font-cinzel font-bold text-stone-900 text-xs sm:text-sm">{item.certificateIssuer} International</span>
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

            {/* 5. Guarantees & Maison Services */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-stone-700 font-peyda">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-[11px] font-medium">گارانتی مادام‌العمر اصالت گوهر و طلا</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="text-[11px] font-medium">سرویس پولیش و مراقبت سالانه رایگان</span>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* 3. Related Creations Section: 3D Radial Cards Slider with Rounded Cards (As Requested by User) */}
      {relatedItems.length > 0 && (
        <div className="w-full mt-20 pt-14 pb-16 bg-[#181b1a] border-y border-stone-800 text-white relative overflow-hidden select-none">
          
          {/* Subtle Ambient Radial Light Ray */}
          <div 
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,_rgba(212,175,55,0.08)_0%,_rgba(0,0,0,0)_70%)] pointer-events-none"
            aria-hidden="true"
          />

          {/* Section Header */}
          <div className="max-w-4xl mx-auto px-4 text-center mb-8 sm:mb-12 relative z-10">
            <span className="font-cinzel text-[10px] sm:text-[11px] tracking-[0.3em] uppercase text-amber-300/80 block mb-1">
              HAUTE SELECTION • RADIAL GALLERY
            </span>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-peyda font-bold text-white tracking-wide">
              آثار هماهنگ و پیشنهادی آتلیه آموزگار
            </h2>
            <p className="font-peyda text-xs sm:text-sm font-light text-stone-400 mt-1.5 max-w-md mx-auto">
              برای جابجایی آثار در امتداد مدار دایره‌ای، کلیدهای ناوبری یا کارت‌های اطراف را لمس فرمایید
            </p>
          </div>

          {/* 3D Radial Arc Stage Container */}
          <div 
            className="relative w-full max-w-6xl mx-auto h-[380px] sm:h-[450px] md:h-[480px] flex items-center justify-center overflow-hidden px-4"
            onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (touchStartX === null) return;
              const delta = e.changedTouches[0].clientX - touchStartX;
              if (delta > 40) {
                setRadialIndex((prev) => (prev - 1 + relatedItems.length) % relatedItems.length);
              } else if (delta < -40) {
                setRadialIndex((prev) => (prev + 1) % relatedItems.length);
              }
              setTouchStartX(null);
            }}
          >
            {/* Center Anchor Point for the Radial Cards */}
            <div className="relative w-full h-full flex items-center justify-center">
              {relatedItems.map((other, idx) => {
                const total = relatedItems.length;
                let diff = idx - radialIndex;
                while (diff > total / 2) diff -= total;
                while (diff < -total / 2) diff += total;

                const isVisible = Math.abs(diff) <= (isMobile ? 2 : 3);
                if (!isVisible) return null;

                const isCenter = diff === 0;
                const xStep = isMobile ? 112 : 215;
                const yStep = isMobile ? 14 : 26;
                const rotStep = isMobile ? 9 : 13;

                const x = diff * xStep;
                const y = Math.pow(Math.abs(diff), 1.45) * yStep;
                const rot = diff * rotStep;
                const scale = isCenter ? 1.05 : Math.max(0.76, 1 - Math.abs(diff) * 0.1);
                const zIndex = 30 - Math.abs(diff) * 5;
                const opacity = Math.abs(diff) > 2 ? 0.35 : 1 - Math.abs(diff) * 0.15;

                const otherWishlisted = wishlistIds.includes(other.id);

                return (
                  <div
                    key={other.id}
                    onClick={() => {
                      if (isCenter) {
                        onSelectItem(other);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      } else {
                        setRadialIndex(idx);
                      }
                    }}
                    style={{
                      transform: `translateX(${x}px) translateY(${y}px) rotate(${rot}deg) scale(${scale})`,
                      zIndex,
                      opacity,
                      transition: 'all 500ms cubic-bezier(0.25, 1, 0.5, 1)',
                    }}
                    className={`absolute w-[180px] sm:w-[220px] md:w-[245px] rounded-[28px] sm:rounded-[32px] p-2.5 sm:p-3 pb-4 sm:pb-5 bg-[#fbfaf8] text-stone-900 border border-white shadow-[0_20px_45px_rgba(0,0,0,0.55)] cursor-pointer select-none transition-shadow group ${
                      isCenter ? 'ring-2 ring-amber-400/90 shadow-[0_25px_60px_rgba(0,0,0,0.75)]' : 'hover:opacity-100'
                    }`}
                  >
                    {/* Wishlist toggle */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(other);
                      }}
                      className="absolute top-4 left-4 z-20 p-1.5 rounded-full bg-white/90 backdrop-blur-xs text-stone-400 hover:text-rose-600 shadow-sm"
                      aria-label="نشان کردن"
                    >
                      <Heart className={`w-3.5 h-3.5 ${otherWishlisted ? 'fill-rose-600 text-rose-600' : ''}`} />
                    </button>

                    {/* Image Box with Rounded Top Corners */}
                    <div className="w-full aspect-square rounded-[22px] sm:rounded-[24px] overflow-hidden bg-stone-100/80 border border-stone-200/50 flex items-center justify-center p-3 relative">
                      <img
                        src={other.imageUrl}
                        alt={other.nameFa}
                        className="max-h-full max-w-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>

                    {/* Bottom Caption Area (Matching Reference image) */}
                    <div className="text-center mt-3 space-y-0.5 px-1 font-peyda">
                      <h4 className="font-peyda font-bold text-xs sm:text-sm text-stone-900 line-clamp-1 leading-snug">
                        {other.nameFa}
                      </h4>
                      <p className="font-cormorant text-xs text-stone-500 italic line-clamp-1">
                        {other.nameEn}
                      </p>
                      <span className="font-peyda text-[10px] text-amber-800 font-bold block pt-0.5">
                        {other.availability}
                      </span>
                    </div>

                    {/* Active Center Badge Indicator */}
                    {isCenter && (
                      <div className="mt-2.5 pt-2 border-t border-stone-200/60 flex items-center justify-center gap-1 text-[11px] font-peyda font-bold text-stone-900">
                        <span>مشاهده کامل این اثر</span>
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Side Quick Arrows */}
            <button
              onClick={() => setRadialIndex((prev) => (prev - 1 + relatedItems.length) % relatedItems.length)}
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-40 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-black text-white border border-white/20 backdrop-blur-md shadow-lg transition-transform active:scale-95 cursor-pointer"
              aria-label="اثر قبلی"
            >
              <ChevronLeft className="w-5 h-5 rotate-180" />
            </button>
            <button
              onClick={() => setRadialIndex((prev) => (prev + 1) % relatedItems.length)}
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-40 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-black text-white border border-white/20 backdrop-blur-md shadow-lg transition-transform active:scale-95 cursor-pointer"
              aria-label="اثر بعدی"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>

          {/* Bottom Dock Controls Bar (Matching Exactly with Image Uploaded by User) */}
          <div className="flex items-center justify-center gap-4 mt-4 sm:mt-6 relative z-30 font-sans">
            <div className="inline-flex items-center gap-3 bg-black/80 backdrop-blur-md border border-white/20 px-3.5 py-1.5 rounded-full shadow-2xl">
              {/* Prev Button */}
              <button
                onClick={() => setRadialIndex((prev) => (prev - 1 + relatedItems.length) % relatedItems.length)}
                className="px-4 py-1.5 rounded-full bg-stone-800 hover:bg-stone-700 text-white font-sans text-xs font-semibold tracking-wide transition-all active:scale-95 cursor-pointer"
              >
                Prev
              </button>

              {/* Dots / Active Slide Indicator */}
              <div className="flex items-center gap-1.5 px-2">
                {relatedItems.slice(0, 7).map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    onClick={() => setRadialIndex(dotIdx)}
                    className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                      dotIdx === (radialIndex % 7)
                        ? 'bg-amber-400 w-3'
                        : 'bg-white/40 hover:bg-white/70'
                    }`}
                    aria-label={`اسلاید ${dotIdx + 1}`}
                  />
                ))}
              </div>

              {/* Next Button */}
              <button
                onClick={() => setRadialIndex((prev) => (prev + 1) % relatedItems.length)}
                className="px-4 py-1.5 rounded-full bg-white hover:bg-stone-200 text-stone-950 font-sans text-xs font-semibold tracking-wide transition-all active:scale-95 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>

        </div>
      )}

      {/* 4. Fullscreen Zoom Modal */}
      {isFullscreenZoom && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 animate-in fade-in"
          onClick={() => setIsFullscreenZoom(false)}
        >
          <button
            onClick={() => setIsFullscreenZoom(false)}
            className="absolute top-6 left-6 p-3 rounded-full bg-stone-900 hover:bg-white text-stone-300 hover:text-black transition-colors border border-stone-800 cursor-pointer z-10"
            aria-label="بستن"
          >
            <X className="w-6 h-6" />
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
            <span className="text-xs font-cinzel text-stone-400 tracking-wider">{item.certificateIssuer} Verified</span>
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
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
