import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Heart,
  Phone,
  Gem,
  MapPin,
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

type TabGroup = 'type' | 'stone' | 'metal' | 'curated';

interface CategoryTab {
  id: string;
  titleFa: string;
  titleEn: string;
  group: TabGroup;
}

const GROUP_LABELS: Record<TabGroup, string> = {
  type: 'نوع',
  stone: 'گوهر',
  metal: 'فلز',
  curated: 'منتخب',
};

const CATEGORY_TABS: CategoryTab[] = [
  { id: 'all', titleFa: 'همه جواهرات', titleEn: 'All Creations', group: 'type' },
  { id: 'ring', titleFa: 'انگشتر', titleEn: 'Rings', group: 'type' },
  { id: 'engagement', titleFa: 'انگشتر نامزدی', titleEn: 'Engagement', group: 'type' },
  { id: 'wedding-bands', titleFa: 'حلقه‌های ازدواج', titleEn: 'Wedding Bands', group: 'type' },
  { id: 'necklace', titleFa: 'گردنبند و مدال', titleEn: 'Necklaces', group: 'type' },
  { id: 'earrings', titleFa: 'گوشواره', titleEn: 'Earrings', group: 'type' },
  { id: 'stud-earrings', titleFa: 'گوشواره میخی', titleEn: 'Studs', group: 'type' },
  { id: 'bracelet', titleFa: 'دستبند و النگو', titleEn: 'Bracelets', group: 'type' },
  { id: 'tennis-bracelets', titleFa: 'دستبند تنیس', titleEn: 'Tennis Bracelets', group: 'type' },
  { id: 'watches', titleFa: 'ساعت‌های جواهرنشان', titleEn: 'Watches', group: 'type' },
  { id: 'men', titleFa: 'جواهرات مردانه', titleEn: "Men's", group: 'type' },
  { id: 'set', titleFa: 'سرویس‌های جواهر', titleEn: 'Sets', group: 'type' },
  { id: 'diamond', titleFa: 'الماس سفید (برلیان)', titleEn: 'Diamond', group: 'stone' },
  { id: 'yellow-diamond', titleFa: 'الماس زرد فنسی', titleEn: 'Yellow Diamond', group: 'stone' },
  { id: 'emerald', titleFa: 'زمرد کلمبیا', titleEn: 'Emerald', group: 'stone' },
  { id: 'sapphire', titleFa: 'یاقوت کبود سیلان', titleEn: 'Sapphire', group: 'stone' },
  { id: 'ruby', titleFa: 'یاقوت سرخ برمه', titleEn: 'Ruby', group: 'stone' },
  { id: 'white-gold', titleFa: 'طلای سفید', titleEn: 'White Gold', group: 'metal' },
  { id: 'rose-gold', titleFa: 'رزگلد', titleEn: 'Rose Gold', group: 'metal' },
  { id: 'yellow-gold', titleFa: 'طلای زرد', titleEn: 'Yellow Gold', group: 'metal' },
  { id: 'platinum', titleFa: 'پلاتین خالص', titleEn: 'Platinum', group: 'metal' },
  { id: 'curated-amuzegar', titleFa: 'منتخب آموزگار', titleEn: 'Curated', group: 'curated' },
  { id: 'curated-new', titleFa: 'جدیدترین جواهرات', titleEn: 'New', group: 'curated' },
  { id: 'curated-stacking', titleFa: 'جواهرات چندلایه', titleEn: 'Stacking', group: 'curated' },
  { id: 'curated-nature', titleFa: 'الهام‌گرفته از طبیعت', titleEn: 'Nature', group: 'curated' },
];

/** Number of most recently added pieces shown under "New Jewelry". Custom items are prepended in App. */
const NEW_ITEMS_COUNT = 4;

type SortKey = 'default' | 'carat-desc' | 'carat-asc' | 'name';

const SORT_OPTIONS: { id: SortKey; label: string }[] = [
  { id: 'default', label: 'پیش‌فرض آتلیه' },
  { id: 'carat-desc', label: 'بیشترین قیراط' },
  { id: 'carat-asc', label: 'کمترین قیراط' },
  { id: 'name', label: 'نام اثر' },
];

const textHas = (value: string | undefined, needle: string) => !!value && value.includes(needle);
const listHas = (list: string[] | undefined, needle: string) => !!list?.some((v) => v.includes(needle));
const stonesHave = (item: JewelryItem, needle: string) =>
  textHas(item.stoneNameFa, needle) || listHas(item.selectedStones, needle);
const metalHas = (item: JewelryItem, fa: string, en: string) =>
  textHas(item.metalFa, fa) || !!item.metalEn?.toLowerCase().includes(en);

/** Strict category matcher: an item only appears where it genuinely belongs. */
const matchesCategory = (item: JewelryItem, category: string, index: number): boolean => {
  switch (category) {
    case 'all':
      return true;
    case 'ring':
    case 'necklace':
    case 'earrings':
    case 'bracelet':
    case 'set':
      return item.category === category;
    case 'engagement':
      return item.category === 'ring' && (textHas(item.nameFa, 'سولیتر') || textHas(item.nameEn?.toLowerCase(), 'solitaire') || listHas(item.tagsFa, 'نامزدی'));
    case 'wedding-bands':
      return item.category === 'ring' && (textHas(item.nameFa, 'حلقه') || textHas(item.nameFa, 'باند') || textHas(item.nameEn?.toLowerCase(), 'band'));
    case 'tennis-bracelets':
      return item.category === 'bracelet' && (textHas(item.nameFa, 'تنیس') || textHas(item.nameEn?.toLowerCase(), 'tennis'));
    case 'stud-earrings':
      return item.category === 'earrings' && (textHas(item.nameFa, 'میخی') || listHas(item.tagsFa, 'میخی'));
    case 'watches':
      return textHas(item.nameFa, 'ساعت') || listHas(item.tagsFa, 'ساعت');
    case 'men':
      return textHas(item.nameFa, 'مردانه') || listHas(item.tagsFa, 'مردانه');
    case 'diamond':
      return item.stoneType === 'diamond' || stonesHave(item, 'برلیان') || stonesHave(item, 'الماس');
    case 'yellow-diamond':
      return stonesHave(item, 'الماس زرد') || listHas(item.tagsFa, 'الماس زرد');
    case 'emerald':
      return item.stoneType === 'emerald' || stonesHave(item, 'زمرد');
    case 'sapphire':
      return item.stoneType === 'sapphire' || stonesHave(item, 'کبود') || stonesHave(item, 'سافایر');
    case 'ruby':
      return item.stoneType === 'ruby' || stonesHave(item, 'یاقوت سرخ');
    case 'white-gold':
      return metalHas(item, 'سفید', 'white');
    case 'rose-gold':
      return metalHas(item, 'رز', 'rose');
    case 'yellow-gold':
      return metalHas(item, 'زرد', 'yellow');
    case 'platinum':
      return metalHas(item, 'پلاتین', 'platinum');
    case 'curated-amuzegar':
      return !!item.isMasterpiece;
    case 'curated-new':
      return index < NEW_ITEMS_COUNT;
    case 'curated-stacking':
      return item.category === 'ring' || item.category === 'bracelet';
    case 'curated-nature':
      return (
        item.stoneType === 'emerald' ||
        listHas(item.tagsFa, 'طبیعت') ||
        textHas(item.nameFa, 'فلورال') ||
        listHas(item.tagsFa, 'اشک')
      );
    default:
      return item.category === category;
  }
};

const toPersianDigits = (value: number | string) =>
  String(value).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);

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
  const activeCategory = category || 'all';
  const [activeImageIndexes, setActiveImageIndexes] = useState<Record<string, number>>({});
  const [brokenImages, setBrokenImages] = useState<Record<string, true>>({});
  const [sortKey, setSortKey] = useState<SortKey>('default');

  const tabsScrollerRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);
  const isFirstRender = useRef(true);
  const [canScrollTabs, setCanScrollTabs] = useState({ start: false, end: false });

  // Count of pieces per tab, used to hide empty tabs and show counts.
  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const tab of CATEGORY_TABS) {
      counts[tab.id] = items.filter((item, idx) => matchesCategory(item, tab.id, idx)).length;
    }
    return counts;
  }, [items]);

  const visibleTabs = useMemo(
    () => CATEGORY_TABS.filter((tab) => tab.id === 'all' || tab.id === activeCategory || tabCounts[tab.id] > 0),
    [tabCounts, activeCategory]
  );

  const filteredItems = useMemo(() => {
    const matched = items.filter((item, idx) => matchesCategory(item, activeCategory, idx));
    if (sortKey === 'default') return matched;
    const sorted = [...matched];
    if (sortKey === 'carat-desc') sorted.sort((a, b) => (b.caratTotal || 0) - (a.caratTotal || 0));
    if (sortKey === 'carat-asc') sorted.sort((a, b) => (a.caratTotal || 0) - (b.caratTotal || 0));
    if (sortKey === 'name') sorted.sort((a, b) => a.nameFa.localeCompare(b.nameFa, 'fa'));
    return sorted;
  }, [items, activeCategory, sortKey]);

  const activeCategoryObj = CATEGORY_TABS.find((c) => c.id === activeCategory) || CATEGORY_TABS[0];

  // Tabs scroller: track whether more tabs exist on either side (RTL: scrollLeft is 0 at start, negative toward end).
  const updateTabScrollState = useCallback(() => {
    const el = tabsScrollerRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    const offset = Math.abs(el.scrollLeft);
    setCanScrollTabs({ start: offset > 4, end: offset < maxScroll - 4 });
  }, []);

  useEffect(() => {
    updateTabScrollState();
    window.addEventListener('resize', updateTabScrollState);
    return () => window.removeEventListener('resize', updateTabScrollState);
  }, [updateTabScrollState, visibleTabs]);

  // Keep the active tab visible and return to the top of the list when the category changes.
  useEffect(() => {
    activeTabRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeCategory]);

  const scrollTabs = (direction: 'start' | 'end') => {
    const el = tabsScrollerRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.6;
    // In RTL, moving toward the end means scrolling to the left (negative).
    el.scrollBy({ left: direction === 'end' ? -amount : amount, behavior: 'smooth' });
  };

  const handleSelectImage = (itemId: string, index: number) => {
    setActiveImageIndexes((prev) => ({ ...prev, [itemId]: index }));
  };

  return (
    <div className="min-h-screen bg-white text-stone-900 font-peyda pt-[69px] pb-16 selection:bg-stone-200 selection:text-black">

      {/* 1. Sticky breadcrumb + tabs bar, positioned exactly under the 69px fixed header */}
      <div className="border-b border-stone-200 bg-white/95 backdrop-blur-sm sticky top-[69px] z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-3">

          <nav aria-label="مسیر صفحه" className="flex items-center gap-1.5 sm:gap-2 text-xs text-stone-500 min-w-0 whitespace-nowrap">
            <button
              type="button"
              onClick={onBackToHome}
              className="hover:text-black transition-colors flex items-center gap-1 font-medium cursor-pointer shrink-0"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>صفحه اصلی</span>
            </button>
            <span className="text-stone-300 hidden sm:inline">/</span>
            <span className="text-stone-500 hidden sm:inline">جواهرات</span>
            <span className="text-stone-300">/</span>
            <span className="text-stone-900 font-bold truncate" aria-current="page">
              {activeCategoryObj.titleFa}
            </span>
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-[11px] text-stone-500 hidden sm:inline-block">
              {toPersianDigits(filteredItems.length)} اثر
            </span>
            <button
              type="button"
              onClick={onOpenVipBooking}
              className="text-xs font-semibold px-3 py-1.5 rounded-full border border-stone-300 hover:border-black text-stone-800 hover:text-black transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Phone className="w-3 h-3 text-stone-600" />
              <span className="sm:hidden">مشاوره</span>
              <span className="hidden sm:inline">مشاوره اختصاصی سالن</span>
            </button>
          </div>
        </div>

        {/* 2. Grouped category tabs with edge fades and scroll arrows */}
        <div className="relative max-w-7xl mx-auto border-t border-stone-100">
          {canScrollTabs.start && (
            <>
              <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white z-10" />
              <button
                type="button"
                onClick={() => scrollTabs('start')}
                className="hidden sm:flex absolute right-1 top-1/2 -translate-y-1/2 z-20 w-7 h-7 items-center justify-center rounded-full bg-white border border-stone-200 text-stone-600 hover:text-black hover:border-stone-400 cursor-pointer"
                aria-label="دسته‌بندی‌های قبلی"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}
          {canScrollTabs.end && (
            <>
              <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white z-10" />
              <button
                type="button"
                onClick={() => scrollTabs('end')}
                className="hidden sm:flex absolute left-1 top-1/2 -translate-y-1/2 z-20 w-7 h-7 items-center justify-center rounded-full bg-white border border-stone-200 text-stone-600 hover:text-black hover:border-stone-400 cursor-pointer"
                aria-label="دسته‌بندی‌های بعدی"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </>
          )}

          <div
            ref={tabsScrollerRef}
            onScroll={updateTabScrollState}
            role="tablist"
            aria-label="دسته‌بندی جواهرات"
            className="no-scrollbar overflow-x-auto px-4 sm:px-10 py-2 flex items-center gap-1.5"
          >
            {visibleTabs.map((tab, i) => {
              const isActive = activeCategory === tab.id;
              const startsGroup = i > 0 && visibleTabs[i - 1].group !== tab.group;
              return (
                <React.Fragment key={tab.id}>
                  {startsGroup && (
                    <span className="flex items-center gap-2 shrink-0 px-1.5" aria-hidden="true">
                      <span className="w-px h-4 bg-stone-200" />
                      <span className="text-[10px] text-stone-500">{GROUP_LABELS[tab.group]}</span>
                    </span>
                  )}
                  <button
                    ref={isActive ? activeTabRef : undefined}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => onSelectCategory(tab.id)}
                    className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-black text-white font-bold'
                        : 'text-stone-700 font-medium hover:text-black hover:bg-stone-100'
                    }`}
                  >
                    <span>{tab.titleFa}</span>
                    <span className={`text-[10px] mr-1.5 ${isActive ? 'text-stone-300' : 'text-stone-500'}`}>
                      {toPersianDigits(tabCounts[tab.id] ?? 0)}
                    </span>
                  </button>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Category heading */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6 text-center">
        <span className="font-grotesk text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-stone-500 block mb-1">
          AMOZEGAR HAUTE JOAILLERIE
        </span>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900">
          {activeCategoryObj.titleFa}
        </h1>
        <p className="text-xs sm:text-sm font-light text-stone-600 max-w-xl mx-auto mt-2 leading-relaxed">
          مجموعه‌ای از تک‌نسخه‌های دست‌ساز با گوهرشناسی بین‌المللی GIA، تراش‌های استثنایی و طلای ۱۸ عیار آتلیه آموزگار
        </p>
      </div>

      {/* 4. Toolbar: count + sort */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-3 flex items-center justify-between gap-3 text-xs">
        <span className="text-stone-600">{toPersianDigits(filteredItems.length)} اثر نفیس</span>
        {filteredItems.length > 1 && (
          <label className="flex items-center gap-2 text-stone-600">
            <span>مرتب‌سازی:</span>
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              className="bg-white border border-stone-300 rounded-full px-3 py-1.5 text-xs text-stone-800 focus:outline-none focus:border-black cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      {/* 5. Product grid with hairline dividers (per-cell borders, so an incomplete last row stays clean) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredItems.length === 0 ? (
          <div className="border border-stone-200 py-16 px-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full border border-stone-300 flex items-center justify-center text-stone-500 mb-4">
              <Gem className="w-5 h-5 stroke-[1.5]" />
            </div>
            <p className="text-sm font-bold text-stone-800">
              در حال حاضر اثری در دسته «{activeCategoryObj.titleFa}» در ویترین نیست
            </p>
            <p className="text-xs text-stone-600 mt-2 max-w-sm leading-relaxed">
              می‌توانید همه آثار را ببینید یا برای سفارش اختصاصی این دسته با مشاوران آتلیه در تماس باشید.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              <button
                type="button"
                onClick={() => onSelectCategory('all')}
                className="text-xs font-semibold px-4 py-2 rounded-full bg-black text-white hover:bg-stone-800 transition-colors cursor-pointer"
              >
                مشاهده همه جواهرات
              </button>
              <button
                type="button"
                onClick={onOpenVipBooking}
                className="text-xs font-semibold px-4 py-2 rounded-full border border-stone-300 hover:border-black text-stone-800 transition-colors cursor-pointer"
              >
                استعلام سفارش اختصاصی
              </button>
            </div>
          </div>
        ) : (
          <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 border-t border-s border-stone-200">
            {filteredItems.map((item) => {
              const isWishlisted = wishlistIds.includes(item.id);
              const images = Array.from(new Set([item.imageUrl, ...(item.additionalImages || [])].filter(Boolean)));
              const currentImgIdx = Math.min(activeImageIndexes[item.id] || 0, Math.max(images.length - 1, 0));
              const currentImg = images[currentImgIdx];
              const imageKey = `${item.id}:${currentImg}`;
              const isBroken = !currentImg || brokenImages[imageKey];
              const titleId = `product-title-${item.id}`;

              return (
                <li
                  key={item.id}
                  className="relative flex flex-col border-b border-e border-stone-200 p-3 sm:p-6 bg-white hover:bg-stone-50 transition-colors group"
                >
                  {/* Image: fixed square frame, consistent crop, graceful fallback */}
                  <div className="relative w-full aspect-square overflow-hidden bg-stone-100">
                    {/* Wishlist */}
                    <button
                      type="button"
                      onClick={() => onToggleWishlist(item)}
                      className="absolute top-2 left-2 z-20 p-2 rounded-full bg-white/90 shadow-sm text-stone-600 hover:text-rose-700 hover:bg-white transition-colors cursor-pointer"
                      aria-label={isWishlisted ? `حذف «${item.nameFa}» از نشان‌شده‌ها` : `افزودن «${item.nameFa}» به نشان‌شده‌ها`}
                      aria-pressed={isWishlisted}
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-700 text-rose-700' : 'stroke-[1.5]'}`} />
                    </button>

                    {isBroken ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-stone-400 gap-2">
                        <Gem className="w-8 h-8 stroke-[1.25]" />
                        <span className="text-[10px] text-stone-500">تصویر در دسترس نیست</span>
                      </div>
                    ) : (
                      <img
                        src={currentImg}
                        alt={item.nameFa}
                        loading="lazy"
                        onError={() => setBrokenImages((prev) => ({ ...prev, [imageKey]: true }))}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                      />
                    )}
                  </div>

                  {/* Image dots: only when there is more than one real image */}
                  {images.length > 1 ? (
                    <div className="relative z-20 flex items-center justify-center mt-2" role="group" aria-label="تصاویر اثر">
                      {images.map((_, dotIndex) => {
                        const isActive = dotIndex === currentImgIdx;
                        return (
                          <button
                            key={dotIndex}
                            type="button"
                            onClick={() => handleSelectImage(item.id, dotIndex)}
                            className="p-2 cursor-pointer"
                            aria-label={`تصویر ${toPersianDigits(dotIndex + 1)} از ${toPersianDigits(images.length)}`}
                            aria-pressed={isActive}
                          >
                            <span
                              className={`block w-1.5 h-1.5 rounded-full transition-colors ${
                                isActive ? 'bg-stone-800' : 'bg-stone-300 hover:bg-stone-500'
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="h-[22px] mt-2" aria-hidden="true" />
                  )}

                  {/* Details */}
                  <div className="text-center flex flex-col items-center mt-1 space-y-1 flex-1">
                    <h3 id={titleId} className="text-[13px] sm:text-base font-bold text-stone-900 line-clamp-2 leading-snug px-1">
                      {/* Stretched button: the whole card opens the product, keyboard accessible */}
                      <button
                        type="button"
                        onClick={() => onSelectItem(item)}
                        className="cursor-pointer text-inherit after:absolute after:inset-0 after:z-10 after:content-[''] focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-black focus-visible:after:ring-inset group-hover:text-amber-900 transition-colors"
                      >
                        {item.nameFa}
                      </button>
                    </h3>

                    <span dir="ltr" className="block w-full font-grotesk text-xs sm:text-sm text-stone-600 tracking-wide truncate italic px-1">
                      {item.nameEn}
                    </span>

                    <p className="text-[11px] sm:text-xs text-stone-600 pt-0.5 line-clamp-1 px-1">
                      <span className="hidden sm:inline">
                        {item.goldNetWeight ? `طلای ۱۸ عیار (${toPersianDigits(item.goldNetWeight)} گرم)` : item.metalFa} ·{' '}
                      </span>
                      {item.stoneNameFa}
                    </p>

                    {item.availability && (
                      <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] text-stone-600 pt-1">
                        <MapPin className="w-3 h-3 stroke-[1.5] shrink-0" />
                        <span className="line-clamp-1">{item.availability}</span>
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* 6. Bottom call to action */}
      <div className="max-w-4xl mx-auto text-center px-4 pt-16 pb-8">
        <p className="text-xs text-stone-600">
          تمامی آثار گالری آموزگار همراه با شناسنامه معتبر سنگ‌های قیمتی و گارانتی اصالت عرضه می‌گردند.
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-6">
          <button
            type="button"
            onClick={onOpenVipBooking}
            className="inline-flex items-center gap-2 text-xs font-semibold text-stone-800 hover:text-black border-b border-stone-400 hover:border-black pb-0.5 transition-colors cursor-pointer"
          >
            استعلام قیمت و سفارش اختصاصی
          </button>
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs font-semibold text-stone-800 hover:text-black border-b border-stone-400 hover:border-black pb-0.5 transition-colors cursor-pointer"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>بازگشت به ویترین اصلی آموزگار</span>
          </button>
        </div>
      </div>

    </div>
  );
};
