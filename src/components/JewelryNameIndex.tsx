import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowUpRight, Gem } from 'lucide-react';
import { JewelryItem } from '../types';
import { NAME_INDEX_PIECES, NameIndexPiece } from '../data/jewelryData';

interface JewelryNameIndexProps {
  items: JewelryItem[];
  onSelectItem: (item: JewelryItem) => void;
  onNavigateToCategory: (category: string) => void;
  onViewAll: () => void;
}

/** Vertical scroll distance (in viewport heights) spent on each piece. */
const VH_PER_ITEM = 60;
/** Height of the fixed site header. */
const HEADER_HEIGHT = 69;

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * White, scroll-driven typographic index: English names stacked on the left
 * (active one in black, the rest in light grey), the matching transparent cutout on the right.
 */
export const JewelryNameIndex: React.FC<JewelryNameIndexProps> = ({
  items,
  onSelectItem,
  onNavigateToCategory,
  onViewAll,
}) => {
  const pieces = NAME_INDEX_PIECES;
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

  const linkedProduct = (piece: NameIndexPiece) =>
    piece.productId ? items.find((item) => item.id === piece.productId) : undefined;

  const openPiece = (piece: NameIndexPiece) => {
    const product = linkedProduct(piece);
    if (product) onSelectItem(product);
    else if (piece.category) onNavigateToCategory(piece.category);
    else onViewAll();
  };

  if (count === 0) return null;

  const activePiece = pieces[activeIndex] ?? pieces[0];
  const activeProduct = linkedProduct(activePiece);

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
            className="relative flex-1 min-h-0 md:w-[55%] md:flex-none overflow-hidden"
            style={{
              maskImage: 'linear-gradient(to bottom, transparent 0%, #000 18%, #000 82%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, #000 18%, #000 82%, transparent 100%)',
            }}
          >
            <ol
              className="absolute inset-x-0 top-0 px-4 sm:px-8 lg:px-12 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
              style={{ transform: `translate3d(0, ${listOffset}px, 0)` }}
            >
              {pieces.map((piece, index) => {
                const isActive = index === activeIndex;
                return (
                  <li key={piece.id}>
                    <button
                      ref={(el) => {
                        nameRefs.current[index] = el;
                      }}
                      type="button"
                      onClick={() => (isActive ? openPiece(piece) : scrollToIndex(index))}
                      aria-current={isActive ? 'true' : undefined}
                      className={`block w-full text-left font-grotesk font-medium tracking-[-0.035em] leading-[1.02] whitespace-nowrap truncate cursor-pointer transition-colors duration-500 text-[clamp(3rem,13vw,5rem)] md:text-[clamp(4rem,9vw,9.5rem)] ${
                        isActive ? 'text-black' : 'text-[#dcdcdc] hover:text-[#a8a8a8]'
                      }`}
                    >
                      {piece.name}
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Piece column: transparent cutouts directly on white */}
          <div className="relative shrink-0 h-[42%] md:h-auto md:flex-1 flex flex-col items-center justify-center px-4 sm:px-8">
            <button
              type="button"
              onClick={() => openPiece(activePiece)}
              className="relative block w-[min(70vw,18rem)] md:w-[min(34vw,32rem)] aspect-square cursor-pointer"
              aria-label={activeProduct ? `مشاهده ${activeProduct.nameFa}` : `مشاهده ${activePiece.altFa}`}
            >
              {brokenIds[activePiece.id] && (
                <span className="absolute inset-0 flex items-center justify-center text-stone-300">
                  <Gem className="w-12 h-12 stroke-[1]" />
                </span>
              )}
              {pieces.map((piece, index) =>
                brokenIds[piece.id] ? null : (
                  <img
                    key={piece.id}
                    src={piece.image}
                    alt={index === activeIndex ? piece.altFa : ''}
                    aria-hidden={index !== activeIndex}
                    loading={index < 2 ? 'eager' : 'lazy'}
                    onError={() => setBrokenIds((prev) => ({ ...prev, [piece.id]: true }))}
                    className={`absolute inset-0 w-full h-full object-contain drop-shadow-[0_24px_28px_rgba(0,0,0,0.12)] transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
                      index === activeIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                    }`}
                  />
                )
              )}
            </button>

            {/* Caption under the piece (desktop) */}
            <div dir="rtl" className="hidden md:block mt-6 text-center font-peyda">
              <p className="text-sm font-bold text-black">{activeProduct?.nameFa ?? activePiece.altFa}</p>
              <button
                type="button"
                onClick={() => openPiece(activePiece)}
                className="mt-2 text-xs text-black/60 hover:text-black border-b border-black/20 hover:border-black pb-0.5 transition-colors cursor-pointer"
              >
                {activeProduct ? 'مشاهده اثر' : 'مشاهده آثار مشابه'}
              </button>
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
