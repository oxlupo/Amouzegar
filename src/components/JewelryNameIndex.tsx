import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpRight, Gem } from 'lucide-react';
import { JewelryItem } from '../types';

interface JewelryNameIndexProps {
  items: JewelryItem[];
  onSelectItem: (item: JewelryItem) => void;
  onViewAll: () => void;
}

/** Vertical scroll distance (in viewport heights) spent on each piece. */
const VH_PER_ITEM = 45;
/** Height of the fixed site header. */
const HEADER_HEIGHT = 69;

const shortName = (item: JewelryItem) =>
  item.shortNameEn?.trim() || item.nameEn.split(/\s+/).slice(0, 2).join(' ');

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * White, scroll-driven typographic index: English names stacked on the left
 * (active one in black, the rest in light grey), the matching piece on the right.
 */
export const JewelryNameIndex: React.FC<JewelryNameIndexProps> = ({ items, onSelectItem, onViewAll }) => {
  const pieces = useMemo(() => items.filter((item) => item.imageUrl), [items]);
  const count = pieces.length;

  const sectionRef = useRef<HTMLElement>(null);
  const listViewportRef = useRef<HTMLDivElement>(null);
  const nameRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [listOffset, setListOffset] = useState(0);
  const [brokenIds, setBrokenIds] = useState<Record<string, true>>({});

  // Scroll progress through the tall section -> active piece.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const section = sectionRef.current;
      if (!section || count === 0) return;
      const rect = section.getBoundingClientRect();
      const scrollable = section.offsetHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(Math.max(-rect.top / scrollable, 0), 0.9999) : 0;
      setActiveIndex(Math.floor(progress * count));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [count]);

  // Shift the name column so the active name sits in the vertical middle.
  const recenter = useCallback(() => {
    const viewport = listViewportRef.current;
    const active = nameRefs.current[activeIndex];
    if (!viewport || !active) return;
    const center = active.offsetTop + active.offsetHeight / 2;
    setListOffset(viewport.clientHeight / 2 - center);
  }, [activeIndex]);

  useLayoutEffect(() => {
    recenter();
  }, [recenter, count]);

  useEffect(() => {
    window.addEventListener('resize', recenter);
    // Web fonts change line metrics once loaded.
    document.fonts?.ready.then(recenter).catch(() => undefined);
    return () => window.removeEventListener('resize', recenter);
  }, [recenter]);

  // Clicking a name scrolls the page to that piece's position in the section.
  const scrollToIndex = (index: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const scrollable = section.offsetHeight - window.innerHeight;
    const top = section.getBoundingClientRect().top + window.scrollY + ((index + 0.5) / count) * scrollable;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  if (count === 0) return null;

  const activeItem = pieces[activeIndex] ?? pieces[0];

  return (
    <section
      ref={sectionRef}
      id="jewelry-index"
      dir="ltr"
      aria-label="فهرست آثار آموزگار"
      className="relative bg-white text-black"
      style={{ height: `calc(${count * VH_PER_ITEM}vh + 100svh)` }}
    >
      <div
        className="sticky top-0 h-[100svh] overflow-hidden flex flex-col"
        style={{ paddingTop: HEADER_HEIGHT }}
      >
        {/* Top labels */}
        <div className="relative z-10 flex items-start justify-between gap-6 px-4 sm:px-8 lg:px-12 pt-4 sm:pt-6 font-grotesk text-[10px] sm:text-[11px] uppercase tracking-[0.14em] leading-snug">
          <span className="font-medium">Creations</span>
          <span className="hidden sm:block max-w-[260px] text-black/80">
            Each piece is handcrafted once,
            <br />
            in the Amouzegar atelier, Mashhad.
          </span>
          <span className="tabular-nums text-black/60">
            {pad(activeIndex + 1)} / {pad(count)}
          </span>
        </div>

        {/* Body: names left, piece right (stacked on mobile: piece on top) */}
        <div className="relative flex-1 min-h-0 flex flex-col-reverse md:flex-row">

          {/* Names column */}
          <div
            ref={listViewportRef}
            className="relative flex-1 min-h-0 md:w-[60%] md:flex-none overflow-hidden"
            style={{
              maskImage: 'linear-gradient(to bottom, transparent 0%, #000 18%, #000 82%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, #000 18%, #000 82%, transparent 100%)',
            }}
          >
            <ol
              className="absolute inset-x-0 top-0 px-4 sm:px-8 lg:px-12 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
              style={{ transform: `translate3d(0, ${listOffset}px, 0)` }}
            >
              {pieces.map((item, index) => {
                const isActive = index === activeIndex;
                return (
                  <li key={item.id}>
                    <button
                      ref={(el) => {
                        nameRefs.current[index] = el;
                      }}
                      type="button"
                      onClick={() => (isActive ? onSelectItem(item) : scrollToIndex(index))}
                      aria-current={isActive ? 'true' : undefined}
                      className={`block w-full text-left font-grotesk font-medium tracking-[-0.035em] leading-[1.02] whitespace-nowrap truncate cursor-pointer transition-colors duration-500 text-[clamp(2.5rem,9vw,4rem)] md:text-[clamp(3rem,6.6vw,7.5rem)] ${
                        isActive ? 'text-black' : 'text-[#dcdcdc] hover:text-[#a8a8a8]'
                      }`}
                    >
                      {shortName(item)}
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Piece column */}
          <div className="relative shrink-0 h-[38%] md:h-auto md:flex-1 flex items-center justify-center px-4 sm:px-8">
            <button
              type="button"
              onClick={() => onSelectItem(activeItem)}
              className="group relative block w-[min(58vw,15rem)] md:w-[min(26vw,26rem)] aspect-square cursor-pointer bg-stone-100"
              aria-label={`مشاهده ${activeItem.nameFa}`}
            >
              {brokenIds[activeItem.id] && (
                <span className="absolute inset-0 flex items-center justify-center text-stone-400">
                  <Gem className="w-10 h-10 stroke-[1.1]" />
                </span>
              )}
              {pieces.map((item, index) => brokenIds[item.id] ? null : (
                <img
                  key={item.id}
                  src={item.imageUrl}
                  alt={index === activeIndex ? item.nameFa : ''}
                  aria-hidden={index !== activeIndex}
                  loading={index < 2 ? 'eager' : 'lazy'}
                  onError={() => setBrokenIds((prev) => ({ ...prev, [item.id]: true }))}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 motion-reduce:transition-none ${
                    index === activeIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ))}
            </button>

            {/* Caption under the piece (desktop) */}
            <div
              dir="rtl"
              className="hidden md:block absolute bottom-10 lg:bottom-14 left-1/2 -translate-x-1/2 w-[min(26vw,26rem)] text-right font-peyda"
            >
              <p className="text-sm font-bold text-black line-clamp-1">{activeItem.nameFa}</p>
              <p dir="ltr" className="font-grotesk text-[11px] uppercase tracking-[0.12em] text-black/55 mt-1 truncate text-left">
                {activeItem.nameEn}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="relative z-10 flex items-center justify-between px-4 sm:px-8 lg:px-12 pb-4 sm:pb-6 font-grotesk text-[10px] sm:text-[11px] uppercase tracking-[0.14em]">
          <span className="text-black/60 hidden sm:inline">Scroll to explore</span>
          <button
            type="button"
            onClick={onViewAll}
            className="inline-flex items-center gap-1.5 bg-black text-white px-3 py-1.5 hover:bg-stone-800 transition-colors cursor-pointer ms-auto"
          >
            <span>View all creations</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </section>
  );
};
