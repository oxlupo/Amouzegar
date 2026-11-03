import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { JewelryItem } from '../types';
import { useDesktop } from '../hooks/useDesktop';
import { Eye, X, Sparkles, ChevronDown, Compass } from 'lucide-react';

/**
 * SCROLL-SCRUB CONFIGURATION OBJECT
 * All timing, plateaus, coordinates, and breakpoint thresholds live here
 * and can be recalibrated without touching component logic.
 */
export const SCROLL_SCRUB_CONFIG = {
  videoSrc: '/jewelry-timeline-scrub.mp4',
  videoFallbackSrc: '/jewelry-timeline.mp4',
  posterSrc: '/jewelry-timeline-poster.jpg',
  totalDuration: 7.0,
  totalFrames: 105,
  framesFps: 15,
  framesPathPrefix: '/frames/f_',
  framesExtension: '.jpg',
  viewportHeightMultiplier: 3.5, // Section pinned for 3.5 viewport heights
  lerpSmoothingFactor: 0.18, // Smooth interpolation factor for animation frames
  snapThreshold: 0.05, // 5% snap tolerance near plateaus

  // Progress Mapping Breakpoints
  breakpoints: {
    move1: { minP: 0.0, maxP: 0.35, minT: 0.0, maxT: 3.0 },
    plateau1: { minP: 0.35, maxP: 0.5, targetT: 3.0, snapP: 0.42 },
    move2: { minP: 0.5, maxP: 0.85, minT: 3.0, maxT: 6.8 },
    plateau2: { minP: 0.85, maxP: 1.0, targetT: 6.8, snapP: 0.92 },
  },

  // Reference Frame (t=0.0s, p=0.0)
  referenceFrame: {
    timestamp: 0.0,
    hotspots: [
      {
        id: 'ref-earring',
        itemId: 'amuzegar-diamond-drop-earring-timeline',
        x: 22, // % from left
        y: 39, // % from top
        labelFa: 'گوشواره آویز برلیان',
        labelEn: 'Drop Earring',
      },
      {
        id: 'ref-rings',
        itemId: 'amuzegar-diamond-duet-rings-timeline',
        x: 46, // % from left
        y: 55, // % from top
        labelFa: 'دوگانه انگشتر الماس',
        labelEn: 'Diamond Rings',
      },
    ],
  },

  // Stop 1: Earring (t=3.0s, plateau p 0.35–0.50)
  stop1: {
    id: 'stop1',
    timestamp: 3.0,
    hotspot: { x: 50, y: 48 },
    itemId: 'amuzegar-diamond-drop-earring-timeline',
    titleFa: 'گوشواره آویز برلیان و پلاتین',
    titleEn: 'Lumina Diamond Drop Earring',
    collectionFa: 'کلکسیون شاهکارها',
    materialsFa: 'پلاتین ۹۵۰ خالص دست‌ساز',
    stonesFa: 'الماس‌های اشکی برش برلیان با پاکی VVS1 و رنگ D-E',
    image: '/photo_2026-09-21_01-31-23.jpg',
  },

  // Stop 2: Rings (t=6.8s, plateau p 0.85–1.00)
  stop2: {
    id: 'stop2',
    timestamp: 6.8,
    hotspot: { x: 50, y: 52 },
    itemId: 'amuzegar-diamond-duet-rings-timeline',
    titleFa: 'دوگانه انگشتر سولیتر و باند الماس برلیان',
    titleEn: 'Duet Solitaire & Pavé Diamond Rings',
    collectionFa: 'کلکسیون شاهکارها',
    materialsFa: 'طلای سفید ۱۸ عیار پالادیوم‌دار',
    stonesFa: 'الماس مرکزی ۳.۵ قیراط تراش برلیان عالی به همراه ردیف میکروپاوِه',
    image: '/photo_2026-09-21_01-30-25.jpg',
  },
};

const toPersianDigits = (value: number | string) =>
  String(value).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);

/**
 * Standard cubic ease-in-out easing
 */
function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

/**
 * Maps scroll progress p (0..1) to video timestamp (0..7.0s)
 */
export function mapProgressToTime(p: number): {
  time: number;
  isPlateau1: boolean;
  isPlateau2: boolean;
  isReference: boolean;
  isMoving: boolean;
} {
  const { move1, plateau1, move2, plateau2 } = SCROLL_SCRUB_CONFIG.breakpoints;
  const clampedP = Math.max(0, Math.min(1, p));

  if (clampedP <= move1.maxP) {
    const norm = clampedP / move1.maxP;
    const eased = easeInOutCubic(norm);
    const time = move1.minT + eased * (move1.maxT - move1.minT);
    return {
      time,
      isPlateau1: false,
      isPlateau2: false,
      isReference: clampedP <= 0.03,
      isMoving: clampedP > 0.03,
    };
  } else if (clampedP <= plateau1.maxP) {
    return {
      time: plateau1.targetT,
      isPlateau1: true,
      isPlateau2: false,
      isReference: false,
      isMoving: false,
    };
  } else if (clampedP <= move2.maxP) {
    const norm = (clampedP - move2.minP) / (move2.maxP - move2.minP);
    const eased = easeInOutCubic(norm);
    const time = move2.minT + eased * (move2.maxT - move2.minT);
    return {
      time,
      isPlateau1: false,
      isPlateau2: false,
      isReference: false,
      isMoving: true,
    };
  } else {
    return {
      time: plateau2.targetT,
      isPlateau1: false,
      isPlateau2: true,
      isReference: false,
      isMoving: false,
    };
  }
}

interface HeroVideoPiecesDetailProps {
  items?: JewelryItem[];
  onSelectItem?: (item: JewelryItem) => void;
  wishlistIds?: string[];
  onToggleWishlist?: (item: JewelryItem) => void;
  onOpenVipBooking?: () => void;
}

export const HeroVideoPiecesDetail: React.FC<HeroVideoPiecesDetailProps> = ({
  items = [],
  onSelectItem,
}) => {
  const isDesktop = useDesktop();
  const [lastPlateauIndex, setLastPlateauIndex] = useState(0);

  // Container & DOM refs
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Progressive State
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [isCard1Open, setIsCard1Open] = useState<boolean>(true);
  const [isCard2Open, setIsCard2Open] = useState<boolean>(true);
  const [videoFailed, setVideoFailed] = useState<boolean>(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);
  const [useCanvasScrub, setUseCanvasScrub] = useState<boolean>(false);

  // Animation & Interpolation tracking
  const currentPRef = useRef<number>(0);
  const targetPRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);
  const snapTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isSeekingRef = useRef<boolean>(false);
  const preloadedFramesRef = useRef<HTMLImageElement[]>([]);

  // Item helpers
  const getItem = useCallback(
    (itemId: string): JewelryItem | undefined => {
      return items.find((it) => it.id === itemId);
    },
    [items]
  );

  // Detect iOS or reduced motion
  useEffect(() => {
    // 1. Reduced motion check
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const motionListener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', motionListener);

    // 2. Detect iOS / iPadOS Safari for optimal canvas scrub rendering
    const isIOS =
      typeof navigator !== 'undefined' &&
      (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));

    if (isIOS) {
      setUseCanvasScrub(true);
    }

    // 3. Preload frame sequence for canvas drawing
    const loadedImages: HTMLImageElement[] = [];
    const total = SCROLL_SCRUB_CONFIG.totalFrames;
    for (let i = 1; i <= total; i++) {
      const img = new Image();
      const numStr = String(i).padStart(3, '0');
      img.src = `${SCROLL_SCRUB_CONFIG.framesPathPrefix}${numStr}${SCROLL_SCRUB_CONFIG.framesExtension}`;
      loadedImages.push(img);
    }
    preloadedFramesRef.current = loadedImages;

    return () => {
      mediaQuery.removeEventListener('change', motionListener);
    };
  }, []);

  /**
   * Draws a specific frame to canvas with proper aspect-ratio letterboxing / fill
   */
  const drawCanvasFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const frames = preloadedFramesRef.current;
    const img = frames[frameIndex - 1];
    if (img && img.complete && img.naturalWidth > 0) {
      // Draw frame to fill canvas
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
  }, []);

  /**
   * Updates display (video or canvas) on animation frame
   */
  const renderAtTime = useCallback(
    (targetTime: number) => {
      if (useCanvasScrub) {
        // Map 0..7.0s to frame 1..105
        const frameFraction = Math.max(0, Math.min(1, targetTime / SCROLL_SCRUB_CONFIG.totalDuration));
        const frameIndex = Math.min(
          SCROLL_SCRUB_CONFIG.totalFrames,
          Math.max(1, Math.round(frameFraction * (SCROLL_SCRUB_CONFIG.totalFrames - 1)) + 1)
        );
        drawCanvasFrame(frameIndex);
      } else {
        const video = videoRef.current;
        if (!video || !video.duration) return;

        // Immediate seek on keyframe-dense MP4
        if (!isSeekingRef.current) {
          isSeekingRef.current = true;
          try {
            video.currentTime = targetTime;
          } catch {
            // Ignore seek error
          }
          requestAnimationFrame(() => {
            isSeekingRef.current = false;
          });
        }
      }
    },
    [useCanvasScrub, drawCanvasFrame]
  );

  /**
   * Continuous animation loop with LERP interpolation
   * Ensures smooth scrubbing without frame jitter during rapid scroll
   */
  useEffect(() => {
    if (prefersReducedMotion) return;

    const tick = () => {
      const diff = targetPRef.current - currentPRef.current;
      if (Math.abs(diff) > 0.0005) {
        currentPRef.current += diff * SCROLL_SCRUB_CONFIG.lerpSmoothingFactor;
        const mapped = mapProgressToTime(currentPRef.current);
        renderAtTime(mapped.time);
        setScrollProgress(currentPRef.current);
      } else if (currentPRef.current !== targetPRef.current) {
        currentPRef.current = targetPRef.current;
        const mapped = mapProgressToTime(currentPRef.current);
        renderAtTime(mapped.time);
        setScrollProgress(currentPRef.current);
      }

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [renderAtTime, prefersReducedMotion]);

  /**
   * Gentle snapping: when user stops scrolling within 5% of a plateau,
   * smoothly ease the scroll into that plateau.
   */
  const handleGentleSnap = useCallback((p: number) => {
    const { move1, plateau1, move2, plateau2 } = SCROLL_SCRUB_CONFIG.breakpoints;
    const threshold = SCROLL_SCRUB_CONFIG.snapThreshold;
    const section = sectionRef.current;
    if (!section) return;

    let targetSnapP: number | null = null;

    // Near Plateau 1 from left
    if (p >= move1.maxP - threshold && p < plateau1.minP) {
      targetSnapP = plateau1.snapP;
    }
    // Near Plateau 1 from right
    else if (p > plateau1.maxP && p <= plateau1.maxP + threshold) {
      targetSnapP = plateau1.snapP;
    }
    // Near Plateau 2 from left
    else if (p >= move2.maxP - threshold && p < plateau2.minP) {
      targetSnapP = plateau2.snapP;
    }

    if (targetSnapP !== null) {
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      const totalScrollable = section.offsetHeight - window.innerHeight;
      if (totalScrollable > 0) {
        const scrollToY = sectionTop + targetSnapP * totalScrollable;
        window.scrollTo({ top: scrollToY, behavior: 'smooth' });
      }
    }
  }, []);

  /**
   * Scroll listener calculates p (0..1) based on pinned section bounds
   */
  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const totalScrollable = section.offsetHeight - window.innerHeight;
      if (totalScrollable <= 0) return;

      // Calculate progress p from 0 to 1
      const rawProgress = -rect.top / totalScrollable;
      const clamped = Math.max(0, Math.min(1, rawProgress));

      targetPRef.current = clamped;

      // Reset & set snap timer
      if (snapTimeoutRef.current) clearTimeout(snapTimeoutRef.current);
      snapTimeoutRef.current = setTimeout(() => {
        handleGentleSnap(targetPRef.current);
      }, 180);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (snapTimeoutRef.current) clearTimeout(snapTimeoutRef.current);
    };
  }, [handleGentleSnap, prefersReducedMotion]);

  /**
   * Jump to a specific plateau by scrolling the page
   */
  const scrollToPlateau = (targetP: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    const totalScrollable = section.offsetHeight - window.innerHeight;
    if (totalScrollable > 0) {
      const scrollToY = sectionTop + targetP * totalScrollable;
      window.scrollTo({ top: scrollToY, behavior: 'smooth' });
    }
  };

  // Derive current status from progress
  const currentStatus = useMemo(() => {
    return mapProgressToTime(scrollProgress);
  }, [scrollProgress]);

  const stop1 = SCROLL_SCRUB_CONFIG.stop1;
  const stop2 = SCROLL_SCRUB_CONFIG.stop2;

  // Desktop side panel: both featured pieces; the one on screen is highlighted.
  const featuredPieces = [
    { ...stop1, plateauP: SCROLL_SCRUB_CONFIG.breakpoints.plateau1.snapP },
    { ...stop2, plateauP: SCROLL_SCRUB_CONFIG.breakpoints.plateau2.snapP },
  ];
  // Match the desktop panel to the exact visibility window used by the hotspot.
  const plateauIndex = currentStatus.isPlateau1 ? 0 : currentStatus.isPlateau2 ? 1 : null;
  const showDesktopProduct = !isDesktop || plateauIndex !== null;
  useEffect(() => {
    if (plateauIndex !== null) setLastPlateauIndex(plateauIndex);
  }, [plateauIndex]);
  // Retain the outgoing piece during its fade rather than switching it in mid-motion.
  const featuredIndex = isDesktop
    ? plateauIndex ?? lastPlateauIndex
    : scrollProgress < SCROLL_SCRUB_CONFIG.breakpoints.move2.minP ? 0 : 1;

  // =========================================================================
  // REDUCED MOTION FALLBACK (Single view, no pinning)
  // =========================================================================
  if (prefersReducedMotion) {
    return (
      <section
        id="hero-video-detail"
        className="w-full bg-black text-stone-100 py-12 px-4 border-b border-stone-900"
      >
        <div className="max-w-md mx-auto relative rounded-3xl overflow-hidden shadow-2xl bg-black border border-stone-800">
          <img
            src={SCROLL_SCRUB_CONFIG.posterSrc}
            alt="Reference frame"
            className="w-full h-auto object-cover"
          />
          {/* Static clickable hotspots */}
          <button
            onClick={() => {
              const item = getItem(stop1.itemId);
              if (item && onSelectItem) onSelectItem(item);
            }}
            style={{ left: '22%', top: '39%' }}
            className="absolute -translate-x-1/2 -translate-y-1/2 p-2 bg-white/90 text-black text-xs font-semibold rounded-full shadow-lg"
          >
            {stop1.titleFa}
          </button>
          <button
            onClick={() => {
              const item = getItem(stop2.itemId);
              if (item && onSelectItem) onSelectItem(item);
            }}
            style={{ left: '46%', top: '55%' }}
            className="absolute -translate-x-1/2 -translate-y-1/2 p-2 bg-white/90 text-black text-xs font-semibold rounded-full shadow-lg"
          >
            {stop2.titleFa}
          </button>
        </div>
      </section>
    );
  }

  return (
    <section
      id="hero-video-detail"
      ref={sectionRef}
      // Section is pinned for 3.5 viewport heights
      style={{ height: `${SCROLL_SCRUB_CONFIG.viewportHeightMultiplier * 100}vh` }}
      className="relative w-full bg-black text-stone-100 select-none border-b border-stone-900"
    >
      {/* Sticky Viewport Container (Pins to screen while p scrubs 0 -> 1).
          Desktop (lg+): video on the left, featured pieces with specs in the space on the right. */}
      <div
        dir="ltr"
        className="sticky top-0 w-full h-[100dvh] flex flex-col items-center justify-center overflow-hidden bg-black lg:flex-row lg:items-stretch lg:justify-start lg:gap-12 xl:gap-20 lg:pr-12 xl:pr-20"
      >
        {/* Mobile-first 9:16 Video / Canvas Frame Stage */}
        <div className="relative w-full max-w-[480px] h-full max-h-[960px] mx-auto lg:mx-0 lg:shrink-0 lg:w-[min(520px,38vw)] lg:max-h-none overflow-hidden bg-black flex items-center justify-center shadow-2xl">
          {/* Mode 1: Canvas Drawing (Fallback for iOS Safari or video jitter) */}
          <canvas
            ref={canvasRef}
            width={540}
            height={960}
            className={`w-full h-full object-cover object-center pointer-events-none ${
              useCanvasScrub ? 'block' : 'hidden'
            }`}
          />

          {/* Mode 2: Keyframe-dense MP4 Video (GOP=2) for instant seeking */}
          {!useCanvasScrub && !videoFailed && (
            <video
              ref={videoRef}
              src={SCROLL_SCRUB_CONFIG.videoSrc}
              poster={SCROLL_SCRUB_CONFIG.posterSrc}
              playsInline
              muted
              preload="auto"
              onError={() => {
                const vid = videoRef.current;
                if (vid && vid.src !== SCROLL_SCRUB_CONFIG.videoFallbackSrc) {
                  vid.src = SCROLL_SCRUB_CONFIG.videoFallbackSrc;
                } else {
                  setUseCanvasScrub(true);
                }
              }}
              className="w-full h-full object-cover object-center pointer-events-none"
            />
          )}

          {/* Fallback image if both fail */}
          {videoFailed && (
            <img
              src={SCROLL_SCRUB_CONFIG.posterSrc}
              alt="Fallback"
              className="w-full h-full object-cover object-center pointer-events-none"
            />
          )}

          {/* Ambient Lighting Vignettes - 100% pure black at top & bottom edges to seamlessly eliminate any cut line */}
          <div className="absolute inset-x-0 top-0 h-44 sm:h-64 bg-gradient-to-b from-black via-black/80 to-transparent pointer-events-none z-10" />
          <div className="absolute inset-x-0 bottom-0 h-36 sm:h-52 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none z-10" />

          {/* ================================================================= */}
          {/* HOTSPOTS & CARDS LAYER (Fades in on plateaus, fades out in motion) */}
          {/* ================================================================= */}
          <div className="absolute inset-0 z-20 pointer-events-none">
            {/* ------------------------------------------------------------- */}
            {/* A. Reference Frame (t=0.0s, p <= 0.03): Both Initial Dots */}
            {/* ------------------------------------------------------------- */}
            <div
              className={`absolute inset-0 transition-opacity duration-400 ${
                currentStatus.isReference ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              {/* Earring initial dot */}
              <button
                id="hotspot-ref-earring"
                onClick={(e) => {
                  e.stopPropagation();
                  scrollToPlateau(0.42);
                }}
                style={{ left: '22%', top: '39%' }}
                className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer pointer-events-auto focus:outline-hidden"
                title="مشاهده گوشواره برلیان"
              >
                <div className="relative flex items-center justify-center">
                  <span className="absolute w-8 h-8 rounded-full border border-white/50 animate-ping opacity-80" />
                  <span className="relative w-6 h-6 rounded-full border border-white/90 bg-black/60 backdrop-blur-xs flex items-center justify-center transition-transform duration-300 group-hover:scale-125 shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#ffffff]" />
                  </span>
                </div>
              </button>

              {/* Rings initial dot */}
              <button
                id="hotspot-ref-rings"
                onClick={(e) => {
                  e.stopPropagation();
                  scrollToPlateau(0.92);
                }}
                style={{ left: '46%', top: '55%' }}
                className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer pointer-events-auto focus:outline-hidden"
                title="مشاهده انگشترهای الماس"
              >
                <div className="relative flex items-center justify-center">
                  <span className="absolute w-8 h-8 rounded-full border border-white/50 animate-ping opacity-80" />
                  <span className="relative w-6 h-6 rounded-full border border-white/90 bg-black/60 backdrop-blur-xs flex items-center justify-center transition-transform duration-300 group-hover:scale-125 shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#ffffff]" />
                  </span>
                </div>
              </button>

              {/* Initial Scroll Hint - Exactly matching HeroSection styling */}
              <div 
                className="absolute bottom-6 sm:bottom-8 inset-x-0 z-20 flex flex-col items-center justify-center pointer-events-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  scrollToPlateau(0.42);
                }}
              >
                <button
                  onClick={() => scrollToPlateau(0.42)}
                  className="group flex flex-col items-center gap-1 focus:outline-none transition-transform active:scale-95 cursor-pointer"
                  aria-label="Scroll Down"
                >
                  <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] font-sans font-medium text-stone-400 group-hover:text-stone-300 transition-colors">
                    SCROLL DOWN
                  </span>
                  <ChevronDown className="w-4 h-4 text-stone-400 group-hover:text-stone-300 animate-bounce transition-colors" />
                </button>
              </div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* B. STOP 1 (Plateau 1: p 0.35–0.50, t = 3.0s): Earring */}
            {/* ------------------------------------------------------------- */}
            <div
              className={`absolute inset-0 transition-opacity duration-300 ${
                currentStatus.isPlateau1 ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              {/* Hotspot 1 Dot at (50%, 48%) */}
              <button
                id="hotspot-stop1-earring"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCard1Open((prev) => !prev);
                }}
                style={{ left: `${stop1.hotspot.x}%`, top: `${stop1.hotspot.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer pointer-events-auto group focus:outline-hidden z-20"
                title="تغییر نمایش کارت گوشواره"
              >
                <div className="relative flex items-center justify-center">
                  <span className="absolute w-10 h-10 rounded-full border border-white/50 animate-ping opacity-80" />
                  <span className="relative w-7 h-7 rounded-full border border-white/90 bg-black/60 backdrop-blur-xs flex items-center justify-center transition-transform duration-300 group-hover:scale-125 shadow-lg">
                    <span className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_10px_#ffffff]" />
                  </span>
                </div>
              </button>

              {/* Product Card 1: Anchored below hotspot so earring remains visible */}
              {isCard1Open && (
                <div
                  id="card-stop1-earring"
                  style={{ left: '50%', top: '52%' }}
                  className="lg:hidden absolute -translate-x-1/2 w-[85%] max-w-[270px] sm:max-w-[290px] z-30 pointer-events-auto bg-stone-950/95 backdrop-blur-xl border border-white/30 shadow-2xl rounded-2xl p-3 text-right transition-all duration-300 box-border"
                >
                  {/* Triangular pointer pointing UP to (50%, 48%) */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rotate-45 bg-stone-950 border-t border-l border-white/30" />

                  <div className="flex items-start justify-between border-b border-stone-800/80 pb-2 mb-2">
                    <div>
                      <span className="text-[9px] tracking-wider uppercase text-white/80 font-mono block">
                        HIGH JEWELRY PIECE 01
                      </span>
                      <h3 className="text-xs sm:text-sm font-semibold text-white font-serif mt-0.5">
                        {stop1.titleFa}
                      </h3>
                      <span className="text-[9px] text-stone-300 font-mono">
                        {stop1.titleEn}
                      </span>
                    </div>
                    <button
                      onClick={() => setIsCard1Open(false)}
                      className="text-stone-400 hover:text-white p-1 rounded-full hover:bg-stone-800/50 transition-colors"
                      title="بستن کارت"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Square High Jewelry Photo with Crisp White Border */}
                  <div className="w-28 h-28 sm:w-32 sm:h-32 aspect-square mx-auto my-2 overflow-hidden rounded-xl border border-white/90 bg-black flex items-center justify-center p-1 shadow-md">
                    <img
                      src={stop1.image}
                      alt={stop1.titleFa}
                      className="w-full h-full object-contain bg-black"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-0.5">
                    <button
                      onClick={() => {
                        const item = getItem(stop1.itemId);
                        if (item && onSelectItem) onSelectItem(item);
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-white hover:bg-stone-200 text-black text-xs font-semibold rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-black" />
                      <span>مشاهده مشخصات</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ------------------------------------------------------------- */}
            {/* C. STOP 2 (Plateau 2: p 0.85–1.00, t = 6.8s): Rings */}
            {/* ------------------------------------------------------------- */}
            <div
              className={`absolute inset-0 transition-opacity duration-300 ${
                currentStatus.isPlateau2 ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              {/* Hotspot 2 Dot at (50%, 52%) */}
              <button
                id="hotspot-stop2-rings"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCard2Open((prev) => !prev);
                }}
                style={{ left: `${stop2.hotspot.x}%`, top: `${stop2.hotspot.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer pointer-events-auto group focus:outline-hidden z-20"
                title="تغییر نمایش کارت انگشترها"
              >
                <div className="relative flex items-center justify-center">
                  <span className="absolute w-10 h-10 rounded-full border border-white/50 animate-ping opacity-80" />
                  <span className="relative w-7 h-7 rounded-full border border-white/90 bg-black/60 backdrop-blur-xs flex items-center justify-center transition-transform duration-300 group-hover:scale-125 shadow-lg">
                    <span className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_10px_#ffffff]" />
                  </span>
                </div>
              </button>

              {/* Product Card 2: Anchored ABOVE hotspot so rings remain visible */}
              {isCard2Open && (
                <div
                  id="card-stop2-rings"
                  style={{ left: '50%', bottom: '52%' }}
                  className="lg:hidden absolute -translate-x-1/2 w-[85%] max-w-[270px] sm:max-w-[290px] z-30 pointer-events-auto bg-stone-950/95 backdrop-blur-xl border border-white/30 shadow-2xl rounded-2xl p-3 text-right transition-all duration-300 box-border"
                >
                  {/* Triangular pointer pointing DOWN to (50%, 52%) */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rotate-45 bg-stone-950 border-b border-r border-white/30" />

                  <div className="flex items-start justify-between border-b border-stone-800/80 pb-2 mb-2">
                    <div>
                      <span className="text-[9px] tracking-wider uppercase text-white/80 font-mono block">
                        HIGH JEWELRY PIECE 02
                      </span>
                      <h3 className="text-xs sm:text-sm font-semibold text-white font-serif mt-0.5">
                        {stop2.titleFa}
                      </h3>
                      <span className="text-[9px] text-stone-300 font-mono">
                        {stop2.titleEn}
                      </span>
                    </div>
                    <button
                      onClick={() => setIsCard2Open(false)}
                      className="text-stone-400 hover:text-white p-1 rounded-full hover:bg-stone-800/50 transition-colors"
                      title="بستن کارت"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Square High Jewelry Photo with Crisp White Border */}
                  <div className="w-28 h-28 sm:w-32 sm:h-32 aspect-square mx-auto my-2 overflow-hidden rounded-xl border border-white/90 bg-black flex items-center justify-center p-1 shadow-md">
                    <img
                      src={stop2.image}
                      alt={stop2.titleFa}
                      className="w-full h-full object-contain bg-black"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-0.5">
                    <button
                      onClick={() => {
                        const item = getItem(stop2.itemId);
                        if (item && onSelectItem) onSelectItem(item);
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-white hover:bg-stone-200 text-black text-xs font-semibold rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-black" />
                      <span>مشاهده مشخصات</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Floating Scroll Indicator - Exactly matching HeroSection styling */}
          <footer className="absolute bottom-6 sm:bottom-8 inset-x-0 z-20 flex flex-col items-center justify-center pointer-events-none">
            {currentStatus.isMoving && (
              <div className="flex flex-col items-center gap-1 animate-in fade-in duration-300">
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] font-sans font-medium text-stone-400">
                  SCROLL DOWN
                </span>
                <ChevronDown className="w-4 h-4 text-stone-400 animate-bounce" />
              </div>
            )}
          </footer>
        </div>

        {/* Desktop panel (right side): the piece of the current sequence, then the rest in order */}
        <aside
          dir="rtl"
          aria-label="آثار این ویدئو"
          aria-hidden={!showDesktopProduct}
          inert={!showDesktopProduct}
          data-product-visible={showDesktopProduct}
          className={`hidden lg:flex flex-1 min-w-0 flex-col justify-center pt-[84px] pb-6 font-peyda ${isDesktop ? "transition-opacity duration-300 ease-out motion-reduce:transition-none" : ""} ${showDesktopProduct ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          <span className="font-grotesk text-[11px] tracking-[0.14em] uppercase text-stone-500 tabular-nums">
            {String(featuredIndex + 1).padStart(2, '0')} / {String(featuredPieces.length).padStart(2, '0')}
          </span>

          {(() => {
            const piece = featuredPieces[featuredIndex];
            const item = getItem(piece.itemId);
            const specs: { label: string; value: string }[] = [
              { label: 'فلز', value: piece.materialsFa },
              { label: 'سنگ', value: piece.stonesFa },
            ];
            if (item?.caratTotal) specs.push({ label: 'وزن کل سنگ‌ها', value: `${toPersianDigits(item.caratTotal)} قیراط` });
            if (item?.certificateIssuer) specs.push({ label: 'شناسنامه', value: item.certificateIssuer });
            return (
              <article key={piece.id} className={`${isDesktop ? "" : "animate-fade-up"} mt-[2vh] flex gap-8 items-start`}>
                <div className="relative shrink-0 w-[min(34vh,22vw)] aspect-square overflow-hidden bg-stone-950 border border-stone-800">
                  <img src={piece.image} alt={piece.titleFa} className="absolute inset-0 w-full h-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] text-stone-500">{piece.collectionFa}</span>
                  <h3 className="mt-1 text-lg xl:text-2xl font-bold text-white leading-snug">{piece.titleFa}</h3>
                  <span dir="ltr" className="block text-left font-cormorant italic text-sm text-stone-400 mt-1 truncate">
                    {piece.titleEn}
                  </span>
                  <dl className="mt-[2vh] border-t border-stone-800 text-xs">
                    {specs.map((spec) => (
                      <div key={spec.label} className="flex gap-3 py-[0.9vh] border-b border-stone-900">
                        <dt className="shrink-0 w-24 text-stone-500">{spec.label}</dt>
                        <dd className="text-stone-200 leading-relaxed line-clamp-2">{spec.value}</dd>
                      </div>
                    ))}
                  </dl>
                  {item && onSelectItem && (
                    <button
                      type="button"
                      onClick={() => onSelectItem(item)}
                      className="mt-[2vh] inline-flex items-center gap-1.5 text-xs font-semibold text-white border-b border-stone-600 hover:border-white pb-0.5 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>مشاهده مشخصات کامل</span>
                    </button>
                  )}
                </div>
              </article>
            );
          })()}

          {/* The remaining pieces, in sequence order */}
          {featuredPieces.length > 1 && (
            <div className="mt-[4vh]">
              <span className="text-[11px] text-stone-500">آثار دیگر این ویدئو</span>
              <ol className="mt-2 border-t border-stone-800">
                {featuredPieces.map((piece, index) =>
                  index === featuredIndex ? null : (
                    <li key={piece.id} className="border-b border-stone-900">
                      <button
                        type="button"
                        onClick={() => scrollToPlateau(piece.plateauP)}
                        className="group w-full flex items-center gap-4 py-[1.2vh] text-right cursor-pointer"
                      >
                        <span className="font-grotesk text-[11px] text-stone-600 tabular-nums w-6">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="relative shrink-0 w-[7vh] aspect-square overflow-hidden bg-stone-950 border border-stone-800">
                          <img src={piece.image} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-semibold text-stone-300 group-hover:text-white transition-colors truncate">{piece.titleFa}</span>
                          <span className="block text-[11px] text-stone-500 truncate mt-0.5">{piece.materialsFa}</span>
                        </span>
                      </button>
                    </li>
                  )
                )}
              </ol>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
};
