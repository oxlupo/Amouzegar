import React, { useState } from 'react';
import { 
  X, 
  Award, 
  Sparkles, 
  Heart, 
  Clock, 
  ShieldCheck, 
  Gem, 
  Play,
  CheckCircle2,
  MapPin
} from 'lucide-react';
import { JewelryItem } from '../types';
import { toPersianDigits } from '../utils/formatters';

interface ProductModalProps {
  item: JewelryItem | null;
  onClose: () => void;
  isWishlisted: boolean;
  onToggleWishlist: (item: JewelryItem) => void;
  onOpenVipBooking: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  item,
  onClose,
  isWishlisted,
  onToggleWishlist,
  onOpenVipBooking,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [inquiryPhone, setInquiryPhone] = useState('');

  if (!item) return null;

  const images = [item.imageUrl, ...(item.additionalImages || [])];

  const handleInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryPhone.trim()) return;
    setInquirySubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div 
        className="relative w-full max-w-4xl bg-[#050505] border border-stone-800 rounded-2xl shadow-2xl shadow-black overflow-hidden my-auto max-h-[92vh] flex flex-col font-peyda"
        id="product-modal-card"
      >
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-20 p-2 rounded-full bg-black/70 text-stone-300 hover:text-white hover:bg-black transition-colors border border-stone-800"
          id="product-modal-close-btn"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto p-6 sm:p-8 space-y-8 flex-1">
          {/* Top Columns: Imagery and Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            
            {/* Gallery */}
            <div className="space-y-3">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-black border border-stone-900">
                <img
                  src={images[activeImageIndex]}
                  alt={item.nameFa}
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />

                {item.featuredInHeroVideo && (
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-stone-800 text-xs font-mono text-stone-200 flex items-center gap-1.5">
                    <Play className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
                    <span>نمایش در هیرو ({toPersianDigits(item.videoTimestamp || '')})</span>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-16 h-16 rounded-lg overflow-hidden border shrink-0 transition-all ${
                        activeImageIndex === idx
                          ? 'border-white scale-105'
                          : 'border-stone-900 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt="زاویه دیگر"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Information */}
            <div className="space-y-6 text-right">
              {/* Category & Wishlist */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-300 font-semibold px-2.5 py-1 rounded-md bg-stone-900 border border-stone-800">
                    {item.stoneNameFa}
                  </span>
                  <span className="text-xs font-mono text-stone-400">
                    کد اثر: {item.itemCode}
                  </span>
                </div>
                
                <button
                  onClick={() => onToggleWishlist(item)}
                  className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-all ${
                    isWishlisted
                      ? 'bg-rose-950 border-rose-600 text-rose-300'
                      : 'border-stone-800 text-stone-400 hover:text-white'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                  <span>{isWishlisted ? 'در نشان‌شده‌ها' : 'نشان کردن'}</span>
                </button>
              </div>

              {/* Title */}
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-snug">
                  {item.nameFa}
                </h2>
                <p className="text-sm text-stone-400 font-cormorant tracking-wide italic mt-1">
                  {item.nameEn}
                </p>
              </div>

              {/* Status Banner with Net Gold Weight */}
              <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-xs text-stone-200">{item.availability}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.goldNetWeight && (
                    <span className="text-xs text-stone-200 font-bold bg-stone-900 px-2.5 py-0.5 rounded border border-stone-800">
                      وزن خالص طلا: {toPersianDigits(item.goldNetWeight)} گرم
                    </span>
                  )}
                  {item.caratTotal > 0 && (
                    <span className="text-xs text-stone-400 font-mono">
                      {toPersianDigits(item.caratTotal)} Carats Total
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                {item.descriptionFa}
              </p>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={onOpenVipBooking}
                  className="w-full py-3.5 rounded-xl bg-white hover:bg-stone-200 text-black font-extrabold text-xs sm:text-sm tracking-wide shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <Clock className="w-4 h-4" />
                  <span>هماهنگی نوبت پرو و بازدید اختصاصی در سالن VIP</span>
                </button>

                {inquirySubmitted ? (
                  <div className="p-3 rounded-lg bg-stone-900 border border-stone-800 text-stone-200 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>شماره شما ثبت گردید؛ کارشناس گالری با شما تماس خواهد گرفت.</span>
                  </div>
                ) : (
                  <form onSubmit={handleInquiry} className="flex gap-2">
                    <input
                      type="tel"
                      placeholder="شماره تماس جهت مشاوره کارشناسی اثر..."
                      value={inquiryPhone}
                      onChange={(e) => setInquiryPhone(e.target.value)}
                      className="flex-1 px-3 py-2.5 rounded-lg bg-stone-950 border border-stone-800 text-xs text-stone-200 focus:outline-none focus:border-stone-500"
                      dir="ltr"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-200 font-bold text-xs shrink-0 border border-stone-800"
                    >
                      ثبت درخواست تماس
                    </button>
                  </form>
                )}
              </div>

            </div>
          </div>

          {/* Gemological Passport Section */}
          <div className="p-6 rounded-2xl bg-black border border-stone-900 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-900 pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">
                  شناسنامه بین‌المللی و کارشناسی گوهر (Gemological Passport)
                </h3>
              </div>
              <span className="text-xs font-mono text-stone-300 px-2.5 py-1 rounded bg-stone-950 border border-stone-800">
                کد گواهی: {item.certificateNumber}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3 rounded-lg bg-stone-950 border border-stone-900">
                <span className="text-stone-500 block mb-1">مرجع صادرکننده:</span>
                <span className="font-bold text-white text-sm">{item.certificateIssuer}</span>
              </div>
              <div className="p-3 rounded-lg bg-stone-950 border border-stone-900">
                <span className="text-stone-500 block mb-1">وزن کل گوهرها:</span>
                <span className="font-bold text-stone-200 text-sm">{toPersianDigits(item.caratTotal)} قیراط</span>
              </div>
              <div className="p-3 rounded-lg bg-stone-950 border border-stone-900">
                <span className="text-stone-500 block mb-1">وزن نگین مرکزی:</span>
                <span className="font-bold text-white text-sm">{toPersianDigits(item.caratMainStone)} قیراط</span>
              </div>
              <div className="p-3 rounded-lg bg-stone-950 border border-stone-900">
                <span className="text-stone-500 block mb-1">
                  {item.goldNetWeight ? 'وزن خالص طلا:' : 'مبدأ استخراج:'}
                </span>
                <span className="font-bold text-stone-200 text-sm">
                  {item.goldNetWeight ? `${toPersianDigits(item.goldNetWeight)} گرم` : item.originFa}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-stone-950 border border-stone-900 col-span-2">
                <span className="text-stone-500 block mb-1">تراش و فرم مهندسی:</span>
                <span className="font-medium text-stone-200">{item.cutTypeFa}</span>
              </div>
              <div className="p-3 rounded-lg bg-stone-950 border border-stone-900 col-span-2">
                <span className="text-stone-500 block mb-1">شفافیت و پاکی گوهر:</span>
                <span className="font-medium text-stone-200">{item.clarity}</span>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-stone-500 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>تمام گوهرهای گالری آموزگار با گواهی اصالت و پلمپ رسمی گوهرشناسی بین‌المللی ارائه می‌شوند.</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
