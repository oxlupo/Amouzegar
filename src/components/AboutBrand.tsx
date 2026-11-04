import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  X
} from 'lucide-react';
import { toPersianDigits } from '../utils/formatters';

interface AboutBrandProps {
  onOpenVipBooking?: () => void;
}

const STORE_GALLERY_IMAGES = [
  {
    id: 1,
    src: '/store.jpg',
    title: 'گالری آموزگار در احمدآباد مشهد',
    subtitle: 'فضای مجلل برای میزبانی خصوصی و پذیرایی اختصاصی از مراجعین',
    badge: 'گالری آموزگار',
  },
  {
    id: 2,
    src: '/01.jpg',
    title: 'شوروم اختصاصی و ویترین جواهرات',
    subtitle: 'آرامش، نورپردازی دقیق و دسترسی مستقیم به کلکسیون‌های فاخر آموزگار',
    badge: 'شوروم VIP',
  },
  {
    id: 3,
    src: '/04.jpg',
    title: 'اتاق مشاوره و طراحی سفارشی',
    subtitle: 'میزبان طراحی‌های اختصاصی، بررسی شناسنامه‌های بین‌المللی و سنگ‌های اصل',
    badge: 'آتلیه طراحی',
  },
];

export const AboutBrand: React.FC<AboutBrandProps> = ({ onOpenVipBooking }) => {
  // Store Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [activeModalImage, setActiveModalImage] = useState<string | null>(null);

  // Auto-play carousel every 4 seconds
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % STORE_GALLERY_IMAGES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % STORE_GALLERY_IMAGES.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + STORE_GALLERY_IMAGES.length) % STORE_GALLERY_IMAGES.length);
  };

  return (
    <section 
      id="contact-salon" 
      className="bg-[#000000] relative overflow-hidden border-t border-stone-900 font-peyda" 
      dir="rtl"
    >
      {/* Anchor target so navbar links to about-maison scroll cleanly here */}
      <div id="about-maison" className="absolute -top-24" />

      {/* Subtle ambient luxury backdrop glows */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Square, sharp-cornered gallery flush against the left edge; the section is exactly as tall as the square. */}
      <div className="relative z-10 flex flex-col lg:flex-row">

          {/* Right Column (Text about Boutique Environment & Ambiance) */}
          <div className="order-2 lg:order-1 flex-1 self-center text-right space-y-6 px-6 sm:px-10 lg:px-16 xl:px-24 py-12 lg:py-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
              آرامش، اصالت و تجربه‌ای متمایز در فضای اختصاصی سالن
            </h2>

            <p className="text-base sm:text-lg text-stone-300 leading-relaxed font-light">
              محیط بوتیک مرکزی جواهری آموزگار به‌گونه‌ای معمارانه طراحی گردیده تا فرآیند انتخاب، طراحی سفارشی و پرو جواهرات در فضایی آرام، مجلل و به دور از هیاهو انجام پذیرد. تلفیق نورپردازی تخصصی گوهرشناسی با المان‌های لوکس، درخشش و خلوص واقعی هر سنگ نایاب را پیش چشمان شما آشکار می‌سازد.
            </p>

            <p className="text-sm sm:text-base text-stone-400 leading-relaxed font-light">
              در این سالن، آرامش خاطر شما و خلق تجربه‌ای خاطره‌انگیز اولویت نخست ماست؛ جایی که هنر دست استادکاران با اصالت سنگ‌های قیمتی در هم می‌آمیزد تا شکوه بی‌پایان جواهرات ناب را در فضایی خصوصی، امن و دلنشین تجربه فرمایید.
            </p>
          </div>

          {/* Left Column (Flippable Images Carousel, flush to the page's left edge) */}
          <div className="order-1 lg:order-2 w-full lg:w-[min(50vw,calc(100svh-69px))] lg:shrink-0">
            
            {/* The Main Flipping Carousel Frame: square with sharp corners */}
            <div 
              className="relative w-full aspect-square overflow-hidden bg-stone-950 group select-none"
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
            >
              {/* Carousel Track with Smooth Horizontal Slide */}
              <div 
                dir="ltr"
                className="flex h-full w-full transition-transform duration-700 ease-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {STORE_GALLERY_IMAGES.map((img) => (
                  <div 
                    key={img.id}
                    className="w-full h-full flex-shrink-0 relative cursor-pointer"
                    onClick={() => setActiveModalImage(img.src)}
                  >
                    <img 
                      src={img.src} 
                      alt={img.title} 
                      className="w-full h-full object-cover select-none filter brightness-95 contrast-105 group-hover:scale-105 transition-transform duration-1000 ease-out"
                    />
                    
                    {/* Vignette Gradients for Luxury Aesthetics */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />
                  </div>
                ))}
              </div>

              {/* Slide counter */}
              <div className="absolute top-4 inset-x-4 flex items-center justify-between z-20 pointer-events-none">
                {/* Slide Counter Badge */}
                <span className="px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-white text-xs font-bold font-mono">
                  {toPersianDigits(currentSlide + 1)} / {toPersianDigits(STORE_GALLERY_IMAGES.length)}
                </span>

              </div>

              {/* Flipping Buttons (ورق زدن با دکمه‌های ناوبری) */}
              <div className="absolute inset-y-0 inset-x-4 flex items-center justify-between z-20 pointer-events-none">
                {/* Previous Slide Button (Right side in RTL) */}
                <button
                  onClick={handlePrevSlide}
                  className="p-3 sm:p-3.5 rounded-full bg-black/70 hover:bg-amber-400 text-white hover:text-stone-950 backdrop-blur-md border border-white/20 transition-all pointer-events-auto cursor-pointer shadow-xl active:scale-90"
                  title="تصویر قبلی"
                  aria-label="ورق زدن به تصویر قبلی"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Next Slide Button (Left side in RTL) */}
                <button
                  onClick={handleNextSlide}
                  className="p-3 sm:p-3.5 rounded-full bg-black/70 hover:bg-amber-400 text-white hover:text-stone-950 backdrop-blur-md border border-white/20 transition-all pointer-events-auto cursor-pointer shadow-xl active:scale-90"
                  title="تصویر بعدی"
                  aria-label="ورق زدن به تصویر بعدی"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>

              {/* Slide Indicator Dots */}
              <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-2 z-20">
                {STORE_GALLERY_IMAGES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === currentSlide 
                        ? 'w-8 bg-amber-400' 
                        : 'w-2 bg-white/40 hover:bg-white/70'
                    }`}
                    aria-label={`اسلاید ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

          </div>

      </div>

      {/* High-Resolution Fullscreen Modal for Store Images */}
      {activeModalImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300"
          onClick={() => setActiveModalImage(null)}
        >
          <div 
            className="relative max-w-4xl max-h-[92vh] w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveModalImage(null)}
              className="absolute -top-12 left-0 p-2 rounded-full bg-stone-900 border border-stone-700 text-stone-300 hover:text-white hover:bg-stone-800 transition-all cursor-pointer"
              title="بستن"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Image */}
            <div className="relative rounded-2xl overflow-hidden border border-stone-800 shadow-2xl bg-black max-h-[85vh]">
              <img 
                src={activeModalImage} 
                alt="نمای بزرگ بوتیک آموزگار" 
                className="w-auto h-auto max-h-[85vh] max-w-full object-contain"
              />
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
