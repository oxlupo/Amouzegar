import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, 
  Menu, 
  X, 
  ChevronLeft, 
  ChevronDown, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  Sparkles, 
  CircleDot, 
  Instagram, 
  MessageCircle, 
  ArrowUpRight 
} from 'lucide-react';
import { toPersianDigits } from '../utils/formatters';

interface NavbarProps {
  wishlistCount: number;
  onOpenWishlist: () => void;
  onOpenVipBooking: () => void;
  onScrollToSection: (id: string) => void;
  onSelectCategory?: (category: string) => void;
  onNavigateToCategory?: (category: string) => void;
  isCategoryPageActive?: boolean;
  onGoHome?: () => void;
}

export interface SubmenuLink {
  id: string;
  titleFa: string;
  titleEn: string;
}

export interface JewelryMenuSection {
  id: 'category' | 'gemstone' | 'metal' | 'curated';
  titleFa: string;
  titleEn: string;
  descFa: string;
  items: SubmenuLink[];
}

export const JEWELRY_SECTIONS: JewelryMenuSection[] = [
  {
    id: 'category',
    titleFa: 'خرید بر اساس دسته‌بندی',
    titleEn: 'SHOP BY CATEGORY',
    descFa: 'گردنبند، انگشتر، گوشواره، دستبند، ساعت و جواهرات مردانه',
    items: [
      { id: 'necklace', titleFa: 'گردنبند و مدال', titleEn: 'NECKLACES & PENDANTS' },
      { id: 'ring', titleFa: 'انگشتر', titleEn: 'RINGS' },
      { id: 'earrings', titleFa: 'گوشواره', titleEn: 'EARRINGS' },
      { id: 'stud-earrings', titleFa: 'گوشواره میخی', titleEn: 'STUD EARRINGS' },
      { id: 'bracelet', titleFa: 'دستبند و النگو', titleEn: 'BRACELETS & BANGLES' },
      { id: 'watches', titleFa: 'ساعت‌های جواهرنشان', titleEn: 'WATCHES' },
      { id: 'men', titleFa: 'جواهرات مردانه', titleEn: "MEN'S JEWELRY" },
      { id: 'all', titleFa: 'مشاهده همه آثار کاتالوگ', titleEn: 'VIEW ALL' },
    ],
  },
  {
    id: 'gemstone',
    titleFa: 'خرید بر اساس گوهر و سنگ',
    titleEn: 'SHOP BY GEMSTONE',
    descFa: 'زمرد، یاقوت، الماس، برلیان، زیرکن و تراش‌های فانتزی',
    items: [
      { id: 'synthetic-gems', titleFa: 'سنگ‌های رنگی مصنوعی', titleEn: 'SYNTHETIC & COLORED GEMS' },
      { id: 'emerald', titleFa: 'زمرد', titleEn: 'EMERALD' },
      { id: 'ruby-sapphire', titleFa: 'یاقوت', titleEn: 'RUBY & SAPPHIRE' },
      { id: 'zircon', titleFa: 'زیرکن', titleEn: 'ZIRCON' },
      { id: 'diamond', titleFa: 'الماس', titleEn: 'DIAMOND' },
      { id: 'brilliant', titleFa: 'برلیان', titleEn: 'BRILLIANT CUT' },
      { id: 'baguette', titleFa: 'باگت', titleEn: 'BAGUETTE CUT' },
      { id: 'marquise', titleFa: 'مارکیز', titleEn: 'MARQUISE CUT' },
      { id: 'princess', titleFa: 'پرنسس کات', titleEn: 'PRINCESS CUT' },
      { id: 'emerald-cut', titleFa: 'امرالد کات', titleEn: 'EMERALD CUT' },
      { id: 'pear-cut', titleFa: 'اشک برلیان', titleEn: 'PEAR CUT' },
      { id: 'fancy-diamonds', titleFa: 'الماس‌های تراش فنسی (فانتزی)', titleEn: 'FANCY CUT DIAMONDS' },
      { id: 'cushion-cut', titleFa: 'کوشن کات', titleEn: 'CUSHION CUT' },
      { id: 'radiant-cut', titleFa: 'رادیانت', titleEn: 'RADIANT CUT' },
      { id: 'all-gems', titleFa: 'مشاهده همه گوهرها و سنگ‌ها', titleEn: 'VIEW ALL GEMSTONES' },
    ],
  },
  {
    id: 'metal',
    titleFa: 'خرید بر اساس فلز',
    titleEn: 'SHOP BY METAL',
    descFa: 'طلای سفید، رزگلد، طلای زرد و پلاتین خالص',
    items: [
      { id: 'white-gold', titleFa: 'طلای سفید', titleEn: 'WHITE GOLD' },
      { id: 'rose-gold', titleFa: 'رزگلد', titleEn: 'ROSE GOLD' },
      { id: 'yellow-gold', titleFa: 'طلای زرد', titleEn: 'YELLOW GOLD' },
      { id: 'platinum', titleFa: 'پلاتین', titleEn: 'PLATINUM' },
      { id: 'all-metals', titleFa: 'مشاهده همه آثار', titleEn: 'VIEW ALL' },
    ],
  },
  {
    id: 'curated',
    titleFa: 'منتخب آموزگار',
    titleEn: 'CURATED BY AMOUZEGAR',
    descFa: 'جدیدترین جواهرات، چندلایه، الهام از طبیعت و ست‌ها',
    items: [
      { id: 'curated-new', titleFa: 'جدیدترین جواهرات', titleEn: 'NEW JEWELRY' },
      { id: 'curated-stacking', titleFa: 'جواهرات چندلایه و ترکیبی', titleEn: 'STACKING JEWELRY' },
      { id: 'curated-nature', titleFa: 'الهام‌گرفته از طبیعت', titleEn: 'INSPIRED BY NATURE' },
      { id: 'curated-sets', titleFa: 'سرویس‌های جواهر سلطنتی', titleEn: 'JEWELRY SETS' },
      { id: 'curated-masterpieces', titleFa: 'شاهکارهای انحصاری آموزگار', titleEn: 'AMOUZEGAR MASTERPIECES' },
    ],
  },
];

export const Navbar: React.FC<NavbarProps> = ({
  wishlistCount,
  onOpenWishlist,
  onOpenVipBooking,
  onScrollToSection,
  onSelectCategory,
  onNavigateToCategory,
  isCategoryPageActive = false,
  onGoHome,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileMenuSubPage, setMobileMenuSubPage] = useState<'main' | 'jewelry' | 'category' | 'gemstone' | 'metal' | 'curated'>('main');
  const [slideDirection, setSlideDirection] = useState<'forward' | 'back'>('forward');
  const [desktopJewelryOpen, setDesktopJewelryOpen] = useState(false);

  const jewelryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const jewelryContainerRef = useRef<HTMLDivElement>(null);

  // Close desktop dropdowns on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        jewelryContainerRef.current &&
        !jewelryContainerRef.current.contains(target)
      ) {
        setDesktopJewelryOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setDesktopJewelryOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      const heroEl = document.getElementById('hero');
      if (heroEl) {
        const heroBottom = heroEl.getBoundingClientRect().bottom;
        setPastHero(heroBottom <= 70);
      } else {
        setPastHero(window.scrollY > window.innerHeight * 0.75);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);



  const handleCollectionsClick = () => {
    if (onGoHome) {
      onGoHome();
    }
    if (onSelectCategory) {
      onSelectCategory('all');
    }
    onScrollToSection('collections');
    setMobileMenuOpen(false);
    setDesktopJewelryOpen(false);
  };

  const handleJewelrySubmenuClick = (category: string) => {
    if (onNavigateToCategory) {
      onNavigateToCategory(category);
    } else {
      if (onSelectCategory) {
        onSelectCategory(category);
      }
      onScrollToSection('collections');
    }
    setMobileMenuOpen(false);
    setDesktopJewelryOpen(false);
  };

  const handleSectionClick = (sectionId: string) => {
    if (onGoHome) {
      onGoHome();
    }
    onScrollToSection(sectionId);
    setMobileMenuOpen(false);
    setDesktopJewelryOpen(false);
  };

  // Hover handlers for Desktop Jewelry dropdown
  const handleJewelryMouseEnter = () => {
    if (jewelryTimeoutRef.current) clearTimeout(jewelryTimeoutRef.current);
    setDesktopJewelryOpen(true);
  };

  const handleJewelryMouseLeave = () => {
    jewelryTimeoutRef.current = setTimeout(() => {
      setDesktopJewelryOpen(false);
    }, 200);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 font-peyda ${
          (isScrolled || isCategoryPageActive)
            ? 'bg-black/95 backdrop-blur-md border-b border-stone-900 py-3 shadow-2xl'
            : 'bg-transparent py-4 sm:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="relative flex items-center justify-between min-h-[44px]">
            
            {/* Right: Hamburger Menu Toggle Button & Desktop Nav Group 1 (کالکشن‌ها، جواهرات) */}
            <div className="flex items-center gap-7 z-20">
              {/* Mobile Hamburger Toggle Button on the Right */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2.5 rounded-lg text-white hover:text-stone-300 bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/10 transition-all active:scale-95 cursor-pointer"
                aria-label="باز کردن منو"
                id="mobile-menu-toggle-btn"
              >
                <Menu className="w-5 h-5 stroke-[1.75]" />
              </button>

              {/* Desktop Navigation Links (First Group: کالکشن‌ها & جواهرات) */}
              <nav className="hidden lg:flex items-center gap-7 text-xs font-medium text-stone-300 font-peyda">
                
                {/* 1. کالکشن‌ها */}
                <button
                  onClick={handleCollectionsClick}
                  className="hover:text-white transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-white after:scale-x-0 hover:after:scale-x-100 after:transition-transform cursor-pointer font-peyda"
                >
                  کالکشن‌ها
                </button>

                {/* 2. جواهرات (با زیرمنوی انگشتر، گردنبند، گوشواره، دستبند) */}
                <div 
                  ref={jewelryContainerRef}
                  className="relative"
                  onMouseEnter={handleJewelryMouseEnter}
                  onMouseLeave={handleJewelryMouseLeave}
                >
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (jewelryTimeoutRef.current) clearTimeout(jewelryTimeoutRef.current);
                      setDesktopJewelryOpen((prev) => !prev);
                    }}
                    className={`hover:text-white transition-colors py-1 flex items-center gap-1.5 cursor-pointer font-peyda group ${
                      desktopJewelryOpen ? 'text-white' : 'text-stone-300'
                    }`}
                    aria-expanded={desktopJewelryOpen}
                  >
                    <span>جواهرات</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 text-stone-400 group-hover:text-white ${desktopJewelryOpen ? 'rotate-180 text-white' : ''}`} />
                  </button>

                  {/* Desktop Dropdown Mega-Menu for جواهرات */}
                  <div
                    className={`absolute right-0 top-full pt-3 transition-all duration-300 ease-out origin-top-right ${
                      desktopJewelryOpen
                        ? 'opacity-100 translate-y-0 pointer-events-auto'
                        : 'opacity-0 -translate-y-2 pointer-events-none'
                    }`}
                  >
                    <div className="w-[880px] max-w-[92vw] bg-[#0a0a0a]/98 backdrop-blur-2xl border border-stone-800/90 rounded-2xl p-6 shadow-2xl shadow-black/80 font-peyda text-right">
                      
                      {/* Submenu Header */}
                      <div className="px-2 pb-3 mb-4 border-b border-stone-800/80 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white tracking-wide">
                            مجموعه جواهرات فاخر آموزگار | HAUTE JOAILLERIE
                          </span>
                        </div>
                        <button
                          onClick={handleCollectionsClick}
                          className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <span>مشاهده همه آثار</span>
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* 4 Jewelry Sections: دسته‌بندی، گوهر و سنگ، فلز، منتخب آموزگار */}
                      <div className="grid grid-cols-4 gap-5">
                        {JEWELRY_SECTIONS.map((sec, secIdx) => (
                          <div 
                            key={sec.id} 
                            style={{ animationDelay: `${secIdx * 70}ms` }}
                            className={`${desktopJewelryOpen ? 'animate-slide-in-left opacity-0' : ''} space-y-2.5`}
                          >
                            {/* Column Title */}
                            <div className="pb-2 border-b border-stone-800/80">
                              <span className="text-[12.5px] font-bold text-white block">
                                {sec.titleFa}
                              </span>
                              <span className="text-[9px] text-stone-400 font-sans tracking-widest uppercase block mt-0.5">
                                {sec.titleEn}
                              </span>
                            </div>

                            {/* Column Items */}
                            <div className="flex flex-col gap-0.5 max-h-[340px] overflow-y-auto no-scrollbar pr-0.5">
                              {sec.items.map((it) => (
                                <button
                                  key={it.id}
                                  onClick={() => handleJewelrySubmenuClick(it.id)}
                                  className="text-right py-1 px-2 rounded-lg hover:bg-stone-900 text-stone-300 hover:text-white transition-all group flex flex-col cursor-pointer"
                                >
                                  <span className="text-xs font-medium group-hover:text-amber-300 transition-colors">
                                    {it.titleFa}
                                  </span>
                                  <span className="text-[9px] text-stone-400 font-sans tracking-wider uppercase group-hover:text-stone-300 transition-colors">
                                    {it.titleEn}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Dropdown Footer: Guarantee & Atelier stamp */}
                      <div className="mt-5 pt-3 border-t border-stone-800/80 flex items-center justify-between px-2 text-[11px] text-stone-400">
                        <span>تمام آثار به همراه شناسنامه معتبر GIA و شناسنامه رسمی آتلیه آموزگار عرضه می‌گردند.</span>
                        <span className="font-sans text-[10px] text-stone-500 uppercase tracking-widest">AMOUZEGAR ATELIER</span>
                      </div>

                    </div>
                  </div>
                </div>

              </nav>
            </div>

            {/* Center: White Amoozegar SVG Logo Centered (Hidden in Hero, fades in after passing Hero, or visible if on category page) */}
            <div 
              onClick={() => {
                if (isCategoryPageActive && onGoHome) {
                  onGoHome();
                } else {
                  onScrollToSection('hero');
                }
              }}
              className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center cursor-pointer group py-1 z-30 transition-all duration-500 ease-out ${
                (pastHero || isCategoryPageActive)
                  ? 'opacity-100 scale-100 pointer-events-auto'
                  : 'opacity-0 scale-95 pointer-events-none'
              }`}
              id="navbar-centered-logo"
              title="جواهرات آموزگار"
            >
              <img
                src="/amoozegar_logo_white.svg"
                alt="لوگوی جواهرات آموزگار"
                className="h-8 sm:h-10 w-auto max-w-[140px] sm:max-w-[180px] object-contain filter drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] transition-transform duration-300 group-hover:scale-105 select-none"
              />
            </div>

            {/* Left: Desktop Nav Group 2 (سفارش اختصاصی، ارتباط با ما) */}
            <div className="flex items-center gap-7 z-20">
              <nav className="hidden lg:flex items-center gap-7 text-xs font-medium text-stone-300 font-peyda">
                
                {/* 3. سفارش اختصاصی */}
                <button
                  onClick={() => {
                    setDesktopJewelryOpen(false);
                    onOpenVipBooking();
                  }}
                  className="hover:text-white transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-white after:scale-x-0 hover:after:scale-x-100 after:transition-transform cursor-pointer font-peyda"
                  title="توضیح روند طراحی و ساخت جواهر مطابق سلیقهٔ مشتری"
                >
                  سفارش اختصاصی
                </button>

                {/* 4. ارتباط با ما: scrolls to the contact block in the footer */}
                <button
                  onClick={() => {
                    setDesktopJewelryOpen(false);
                    document.getElementById('site-contact')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-white after:scale-x-0 hover:after:scale-x-100 after:transition-transform cursor-pointer font-peyda"
                >
                  ارتباط با ما
                </button>
              </nav>

              {/* Optical Balancer on mobile to guarantee exact center alignment */}
              <div className="w-10 h-10 lg:hidden pointer-events-none" aria-hidden="true" />
            </div>

          </div>
        </div>
      </header>

      {/* Cartier-Style Luxury Mobile Menu Drawer (100% Full Screen - RTL Slide from Right to Left) */}
      <div 
        dir="rtl"
        className={`fixed inset-0 w-full h-[100dvh] bg-white text-stone-900 z-50 flex flex-col font-peyda transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:hidden ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="منوی موبایل آموزگار"
      >
        {/* Drawer Header: Boxed [X] Button on Right, Back button if on subpage, Black Logo Centered at Top */}
        <div 
          className="relative flex items-center justify-between border-b border-stone-200 h-16 sm:h-20 bg-white select-none shrink-0"
        >
          {/* Boxed Close Button on Right */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setMobileMenuSubPage('main');
            }}
            className="w-16 sm:w-20 h-full border-l border-stone-200 flex items-center justify-center text-stone-700 hover:text-black hover:bg-stone-50 active:bg-stone-100 transition-colors z-10 cursor-pointer"
            aria-label="بستن منو"
          >
            <X className="w-6 h-6 stroke-[1.5]" />
          </button>

          {/* Centered Black Logo or Subpage Title */}
          <div className="absolute inset-x-0 h-full flex items-center justify-center pointer-events-none px-16 sm:px-24">
            {mobileMenuSubPage === 'main' ? (
              <img
                src="/amoozegar_logo_black.svg"
                alt="جواهرات آموزگار"
                className="h-8 sm:h-10 w-auto max-w-[160px] object-contain"
              />
            ) : mobileMenuSubPage === 'jewelry' ? (
              <span className="text-sm font-semibold text-stone-900 tracking-wide font-peyda truncate">
                جواهرات آموزگار
              </span>
            ) : (
              <span className="text-sm font-semibold text-stone-900 tracking-wide font-peyda truncate">
                {JEWELRY_SECTIONS.find((s) => s.id === mobileMenuSubPage)?.titleFa}
              </span>
            )}
          </div>

          {/* Back button on left when inside a subpage */}
          {mobileMenuSubPage !== 'main' ? (
            <button
              onClick={() => {
                if (mobileMenuSubPage === 'jewelry') {
                  setSlideDirection('back');
                  setMobileMenuSubPage('main');
                } else {
                  setSlideDirection('back');
                  setMobileMenuSubPage('jewelry');
                }
              }}
              className="w-16 sm:w-20 h-full border-r border-stone-200 flex items-center justify-center text-stone-700 hover:text-black hover:bg-stone-50 active:bg-stone-100 transition-colors z-10 cursor-pointer"
              aria-label="بازگشت"
            >
              <ChevronLeft className="w-6 h-6 stroke-[1.5] rotate-180" />
            </button>
          ) : (
            <div className="w-16 sm:w-20 h-full" aria-hidden="true" />
          )}
        </div>

        {/* Scrollable Body - Strictly RTL Layout */}
        <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col justify-between w-full">
          
          {/* Case 1: Subpage for one of the 4 categories (دسته‌بندی، گوهر و سنگ، فلز، منتخب آموزگار) */}
          {(mobileMenuSubPage === 'category' ||
            mobileMenuSubPage === 'gemstone' ||
            mobileMenuSubPage === 'metal' ||
            mobileMenuSubPage === 'curated') ? (
            <div key={`subpage-${mobileMenuSubPage}`} className="py-2">
              {(() => {
                const sec = JEWELRY_SECTIONS.find((s) => s.id === mobileMenuSubPage);
                if (!sec) return null;
                return (
                  <div>
                    {/* Header with back arrow matching Graff reference screenshots in Persian */}
                    <button
                      onClick={() => {
                        setSlideDirection('back');
                        setMobileMenuSubPage('jewelry');
                      }}
                      className={`${slideDirection === 'forward' ? 'animate-slide-in-left' : 'animate-slide-in-right'} opacity-0 w-full flex items-center gap-3 px-6 py-4.5 border-b border-stone-200 bg-stone-50/70 hover:bg-stone-100 active:bg-stone-200 transition-colors text-right cursor-pointer group`}
                    >
                      <ChevronLeft className="w-4 h-4 text-stone-700 group-hover:text-black group-hover:translate-x-1 transition-transform rotate-180" />
                      <span className="text-sm font-semibold text-stone-900 tracking-wide font-peyda">
                        {sec.titleFa}
                      </span>
                    </button>

                    {/* Clean Luxury Spaced List matching Graff Haute Joaillerie typography in Persian */}
                    <div className="divide-y divide-stone-100">
                      {sec.items.map((item, itemIdx) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            handleJewelrySubmenuClick(item.id);
                            setMobileMenuOpen(false);
                            setMobileMenuSubPage('main');
                          }}
                          style={{ animationDelay: `${(itemIdx + 1) * 35}ms` }}
                          className={`${slideDirection === 'forward' ? 'animate-slide-in-left' : 'animate-slide-in-right'} opacity-0 group relative w-full flex items-center justify-between px-6 py-4.5 text-right transition-colors overflow-hidden cursor-pointer`}
                        >
                          <span className="absolute inset-0 bg-stone-100 translate-x-full group-hover:translate-x-0 group-active:translate-x-0 transition-transform duration-300 ease-out origin-right pointer-events-none" />
                          <span className="absolute right-0 top-0 bottom-0 w-1 bg-stone-900 scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center" />
                          <div className="relative z-10 flex flex-col text-right">
                            <span className="text-sm font-semibold tracking-wide text-stone-900 group-hover:text-black transition-colors font-peyda">
                              {item.titleFa}
                            </span>
                          </div>
                          <ChevronLeft className="relative z-10 w-4 h-4 text-stone-400 group-hover:text-black group-hover:-translate-x-1.5 transition-all shrink-0" />
                        </button>
                      ))}
                    </div>

                    {/* Secondary Back Navigation */}
                    <div 
                      style={{ animationDelay: `${(sec.items.length + 1) * 35}ms` }}
                      className={`${slideDirection === 'forward' ? 'animate-slide-in-left' : 'animate-slide-in-right'} opacity-0 p-5 pt-6 border-t border-stone-200 mt-2`}
                    >
                      <button
                        onClick={() => {
                          setSlideDirection('back');
                          setMobileMenuSubPage('jewelry');
                        }}
                        className="w-full py-3 rounded-xl border border-stone-300 hover:border-black text-stone-700 hover:text-black text-xs font-semibold transition-all text-center flex items-center justify-center gap-2 font-peyda cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4 rotate-180" />
                        <span>بازگشت به فهرست دسته‌بندی‌های جواهرات</span>
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          ) : mobileMenuSubPage === 'jewelry' ? (
            /* Case 2: Main Jewelry Overview Page (4 High-Fashion Doors: دسته‌بندی، گوهر و سنگ، فلز و طلا، منتخب آموزگار) */
            <div key="mobile-subpage-jewelry" className="py-2">
              {/* Back to main menu header banner */}
              <button
                onClick={() => {
                  setSlideDirection('back');
                  setMobileMenuSubPage('main');
                }}
                className={`${slideDirection === 'forward' ? 'animate-slide-in-left' : 'animate-slide-in-right'} opacity-0 w-full flex items-center gap-3 px-6 py-4 border-b border-stone-200 bg-stone-50/70 hover:bg-stone-100 active:bg-stone-200 transition-colors text-right cursor-pointer group`}
              >
                <ChevronLeft className="w-4 h-4 text-stone-700 group-hover:text-black group-hover:translate-x-1 transition-transform rotate-180" />
                <span className="text-sm font-semibold text-stone-900 tracking-wide font-peyda">
                  بازگشت به منوی اصلی
                </span>
              </button>

              {/* The 4 Category Doors with left-to-right text entrance animation */}
              <div className="divide-y divide-stone-100">
                {JEWELRY_SECTIONS.map((sec, secIdx) => (
                  <button
                    key={sec.id}
                    onClick={() => {
                      setSlideDirection('forward');
                      setMobileMenuSubPage(sec.id);
                    }}
                    style={{ animationDelay: `${(secIdx + 1) * 50}ms` }}
                    className={`${slideDirection === 'forward' ? 'animate-slide-in-left' : 'animate-slide-in-right'} opacity-0 group relative w-full flex items-center justify-between px-6 py-4.5 text-right transition-colors overflow-hidden cursor-pointer`}
                  >
                    <span className="absolute inset-0 bg-stone-100 translate-x-full group-hover:translate-x-0 group-active:translate-x-0 transition-transform duration-300 ease-out origin-right pointer-events-none" />
                    <span className="absolute right-0 top-0 bottom-0 w-1 bg-stone-900 scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center" />
                    <div className="relative z-10 flex flex-col text-right">
                      <span className="text-sm font-semibold tracking-wide text-stone-900 group-hover:text-black transition-colors font-peyda">
                        {sec.titleFa}
                      </span>
                    </div>
                    <ChevronLeft className="relative z-10 w-4 h-4 text-stone-400 group-hover:text-black group-hover:-translate-x-1.5 transition-all shrink-0" />
                  </button>
                ))}
              </div>

              {/* View all collections button */}
              <div 
                style={{ animationDelay: `${(JEWELRY_SECTIONS.length + 1) * 50}ms` }}
                className={`${slideDirection === 'forward' ? 'animate-slide-in-left' : 'animate-slide-in-right'} opacity-0 px-6 pt-5 pb-3`}
              >
                <button
                  onClick={() => {
                    handleCollectionsClick();
                    setMobileMenuSubPage('main');
                  }}
                  className="w-full py-3.5 rounded-lg bg-stone-950 hover:bg-black text-stone-100 hover:text-white text-xs font-semibold tracking-wide transition-all text-center flex items-center justify-center gap-2 font-peyda cursor-pointer"
                >
                  <span>مشاهده همه آثار کاتالوگ</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Upper Section: Clean White Luxury Navigation for the specified options */
            <div 
              key="mobile-main-menu" 
              className={`${slideDirection === 'back' ? 'animate-slide-in-right' : ''} py-2 divide-y divide-stone-100`}
            >
              {/* 1. کالکشن‌ها */}
              <button
                onClick={handleCollectionsClick}
                className="group relative w-full flex items-center justify-between px-6 py-4.5 text-right transition-colors overflow-hidden cursor-pointer"
              >
                <span className="absolute inset-0 bg-stone-100 translate-x-full group-hover:translate-x-0 group-active:translate-x-0 transition-transform duration-300 ease-out origin-right pointer-events-none" />
                <span className="absolute right-0 top-0 bottom-0 w-1 bg-stone-900 scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center" />
                <div className="relative z-10 flex flex-col text-right">
                  <span className="text-sm font-semibold tracking-wide text-stone-900 group-hover:text-black transition-colors font-peyda">
                    کالکشن‌ها
                  </span>
                </div>
                <ChevronLeft className="relative z-10 w-4 h-4 text-stone-400 group-hover:text-black group-hover:-translate-x-1.5 transition-all shrink-0" />
              </button>

              {/* 2. جواهرات (با کلیک انیمیشن اسلاید از چپ به راست فعال می‌شود) */}
              <button
                onClick={() => {
                  setSlideDirection('forward');
                  setMobileMenuSubPage('jewelry');
                }}
                className="group relative w-full flex items-center justify-between px-6 py-4.5 text-right transition-colors overflow-hidden cursor-pointer"
              >
                <span className="absolute inset-0 bg-stone-100 translate-x-full group-hover:translate-x-0 group-active:translate-x-0 transition-transform duration-300 ease-out origin-right pointer-events-none" />
                <span className="absolute right-0 top-0 bottom-0 w-1 bg-stone-900 scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center" />
                <div className="relative z-10 flex flex-col text-right">
                  <span className="text-sm font-semibold tracking-wide text-stone-900 group-hover:text-black transition-colors font-peyda">
                    جواهرات
                  </span>
                </div>
                <ChevronLeft className="relative z-10 w-4 h-4 text-stone-400 group-hover:text-black group-hover:-translate-x-1.5 transition-all shrink-0" />
              </button>

              {/* 3. سفارش اختصاصی (توضیح روند طراحی و ساخت جواهر مطابق سلیقهٔ مشتری) */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenVipBooking();
                }}
                className="group relative w-full flex items-center justify-between px-6 py-4.5 text-right transition-colors overflow-hidden cursor-pointer"
              >
                <span className="absolute inset-0 bg-stone-100 translate-x-full group-hover:translate-x-0 group-active:translate-x-0 transition-transform duration-300 ease-out origin-right pointer-events-none" />
                <span className="absolute right-0 top-0 bottom-0 w-1 bg-stone-900 scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center" />
                <div className="relative z-10 flex flex-col text-right">
                  <span className="text-sm font-semibold tracking-wide text-stone-900 group-hover:text-black transition-colors font-peyda">
                    سفارش اختصاصی
                  </span>
                  <span className="text-[11px] text-stone-500 mt-0.5 font-peyda">
                    طراحی سه‌بعدی و ساخت سفارشی بر مبنای وزن و گوهر انتخابی
                  </span>
                </div>
                <ChevronLeft className="relative z-10 w-4 h-4 text-stone-400 group-hover:text-black group-hover:-translate-x-1.5 transition-all shrink-0" />
              </button>

              {/* 4. ارتباط با ما (آدرس گالری، شماره تماس، واتساپ و اینستاگرام) */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setTimeout(() => document.getElementById('site-contact')?.scrollIntoView({ behavior: 'smooth' }), 50);
                }}
                className="group relative w-full flex items-center justify-between px-6 py-4.5 text-right transition-colors overflow-hidden cursor-pointer"
              >
                <span className="absolute inset-0 bg-stone-100 translate-x-full group-hover:translate-x-0 group-active:translate-x-0 transition-transform duration-300 ease-out origin-right pointer-events-none" />
                <span className="absolute right-0 top-0 bottom-0 w-1 bg-stone-900 scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center" />
                <div className="relative z-10 flex flex-col text-right">
                  <span className="text-sm font-semibold tracking-wide text-stone-900 group-hover:text-black transition-colors font-peyda">
                    ارتباط با ما
                  </span>
                  <span className="text-[11px] text-stone-500 mt-0.5 font-peyda">
                    آدرس گالری، شماره تماس، واتساپ و اینستاگرام
                  </span>
                </div>
                <ChevronLeft className="relative z-10 w-4 h-4 text-stone-400 group-hover:text-black group-hover:-translate-x-1.5 transition-all shrink-0" />
              </button>
            </div>
          )}

          {/* Lower Section: Luxury Dark Carbon Palette with Direct Contact Channels */}
          <div className="bg-[#0c0c0c] text-white border-t border-stone-800 p-6 flex flex-col gap-4 mt-auto">
            
            {/* Quick Contact Header */}
            <div className="flex items-center justify-between text-xs text-stone-400 pb-2 border-b border-stone-800/80">
              <span className="font-semibold text-white">ارتباط مستقیم و آدرس گالری</span>
            </div>

            {/* Gallery Address Button */}
            <button
              onClick={() => handleSectionClick('contact-salon')}
              className="group flex items-center justify-between w-full text-right text-stone-300 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-stone-400 group-hover:text-stone-300 shrink-0 transition-colors" />
                <span className="text-xs font-medium tracking-wide">گالری داود آموزگار (مشهد، احمدآباد، قبل از رضا ۲)</span>
              </div>
            </button>

            {/* Direct Phone Call */}
            <a
              href="tel:+985138437395"
              className="group flex items-center justify-between w-full text-right text-stone-300 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-stone-400 group-hover:text-white shrink-0 transition-colors" />
                <span className="text-xs font-medium tracking-wide">تماس با گالری: ۰۵۱-۳۸۴۳۷۳۹۵</span>
              </div>
            </a>

            {/* WhatsApp Direct Chat */}
            <a
              href={`https://wa.me/985138437395?text=${encodeURIComponent('درود، جهت مشاوره و استعلام آثار جواهرات آموزگار پیام می‌دهم.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between w-full text-right text-white hover:text-stone-200 transition-colors"
            >
              <div className="flex items-center gap-3">
                <MessageCircle className="w-4 h-4 text-stone-400 group-hover:text-white shrink-0 transition-colors" />
                <span className="text-xs font-medium tracking-wide text-white">گفتگوی آنلاین در واتساپ</span>
              </div>
            </a>

            {/* Instagram Official Page */}
            <a
              href="https://instagram.com/amoozegar_jewelry"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between w-full text-right text-white hover:text-stone-200 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Instagram className="w-4 h-4 text-stone-400 group-hover:text-white shrink-0 transition-colors" />
                <span className="text-xs font-medium tracking-wide text-white">اینستاگرام رسمی: amoozegar_jewelry@</span>
              </div>
            </a>

            {/* VIP Booking Button */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenVipBooking();
              }}
              className="group flex items-center justify-between w-full text-right text-stone-300 hover:text-white transition-colors pt-2 border-t border-stone-800/80 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium tracking-wide">رزرو وقت بازدید خصوصی VIP</span>
              </div>
            </button>

            {/* Bottom Maison Monogram Quote */}
            <div className="pt-2 flex items-center justify-center gap-2 text-[10px] text-stone-500 font-serif tracking-widest uppercase border-t border-stone-900">
              <span>AMOUZEGAR HAUTE JOAILLERIE</span>
            </div>

          </div>

        </div>

      </div>
    </>
  );
};
