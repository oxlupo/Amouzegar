import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft } from 'lucide-react';

/**
 * Scroll-scrubbed "build your ring" film. Each stone seats into the setting and the
 * scroll eases into a soft stop there; copy on the left invites visitors to personalise.
 */
const CUSTOMIZER_CONFIG = {
  videoSrc: '/customize/ring-builder-scrub.mp4',
  posterSrc: '/customize/ring-builder-poster.jpg',
  duration: 9.3,
  /** Viewport heights of scrolling while the section is pinned. */
  scrollVh: 420,
  /** Share of the whole scroll each stop holds still. */
  holdShare: 0.11,
  lerp: 0.16,
  /** Ease into the nearest stop when scrolling ends this close to it (share of total scroll). */
  snapDistance: 0.05,
  /** Moments a stone is seated in the ring (seconds into the film). */
  stops: [
    { time: 2.4, nameFa: 'گرد', nameEn: 'Round' },
    { time: 4.4, nameFa: 'بیضی', nameEn: 'Oval' },
    { time: 6.15, nameFa: 'گلابی', nameEn: 'Pear' },
    { time: 8.4, nameFa: 'مارکیز', nameEn: 'Marquise' },
  ],
};

const easeInOutCubic = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

interface Segment {
  from: number;
  to: number;
  t0: number;
  t1: number;
  hold: boolean;
  stopIndex: number;
}

/** Splits scroll progress 0..1 into eased moves between stops and still holds at each stop. */
function buildTimeline(): Segment[] {
  const { stops, duration, holdShare } = CUSTOMIZER_CONFIG;
  const holdTotal = holdShare * stops.length;
  const moveTotal = 1 - holdTotal;
  // Moves get scroll distance in proportion to the film time they cover.
  const segments: Segment[] = [];
  let p = 0;
  let t = 0;
  stops.forEach((stop, i) => {
    const moveLen = ((stop.time - t) / duration) * moveTotal;
    segments.push({ from: p, to: p + moveLen, t0: t, t1: stop.time, hold: false, stopIndex: i });
    p += moveLen;
    segments.push({ from: p, to: p + holdShare, t0: stop.time, t1: stop.time, hold: true, stopIndex: i });
    p += holdShare;
    t = stop.time;
  });
  segments.push({ from: p, to: 1, t0: t, t1: duration, hold: false, stopIndex: stops.length - 1 });
  return segments;
}

export const JewelryCustomizer: React.FC<{ onOpenVipBooking: () => void }> = ({ onOpenVipBooking }) => {
  const { stops } = CUSTOMIZER_CONFIG;
  const timeline = useMemo(buildTimeline, []);

  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const targetP = useRef(0);
  const currentP = useRef(0);
  const snapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  const segmentAt = useCallback(
    (p: number) => timeline.find((s) => p <= s.to) ?? timeline[timeline.length - 1],
    [timeline]
  );

  const timeAt = useCallback(
    (p: number) => {
      const seg = segmentAt(p);
      if (seg.hold) return seg.t0;
      const local = seg.to > seg.from ? (p - seg.from) / (seg.to - seg.from) : 1;
      return seg.t0 + easeInOutCubic(Math.min(Math.max(local, 0), 1)) * (seg.t1 - seg.t0);
    },
    [segmentAt]
  );

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const scrollToProgress = useCallback((p: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const scrollable = section.offsetHeight - window.innerHeight;
    const top = section.getBoundingClientRect().top + window.scrollY + p * scrollable;
    window.scrollTo({ top, behavior: 'smooth' });
  }, []);

  // Soft stop: when scrolling settles just outside a hold, ease into its centre.
  const softSnap = useCallback(
    (p: number) => {
      const { snapDistance } = CUSTOMIZER_CONFIG;
      if (p <= 0 || p >= 1) return;
      for (const seg of timeline) {
        if (!seg.hold) continue;
        const centre = (seg.from + seg.to) / 2;
        const inside = p >= seg.from && p <= seg.to;
        const near = p > seg.from - snapDistance && p < seg.to + snapDistance;
        if (!inside && near) {
          scrollToProgress(centre);
          return;
        }
      }
    },
    [timeline, scrollToProgress]
  );

  // Scroll -> target progress.
  useEffect(() => {
    if (reducedMotion) return;
    const onScroll = () => {
      const section = sectionRef.current;
      if (!section) return;
      const scrollable = section.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const p = Math.min(Math.max(-section.getBoundingClientRect().top / scrollable, 0), 1);
      targetP.current = p;
      if (snapTimer.current) clearTimeout(snapTimer.current);
      snapTimer.current = setTimeout(() => softSnap(targetP.current), 200);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (snapTimer.current) clearTimeout(snapTimer.current);
    };
  }, [reducedMotion, softSnap]);

  // Smoothed progress -> video time.
  useEffect(() => {
    if (reducedMotion) return;
    let frame = 0;
    let lastTime = -1;
    const tick = () => {
      const diff = targetP.current - currentP.current;
      currentP.current = Math.abs(diff) > 0.0004 ? currentP.current + diff * CUSTOMIZER_CONFIG.lerp : targetP.current;
      const video = videoRef.current;
      const t = timeAt(currentP.current);
      if (video && video.readyState >= 1 && Math.abs(t - lastTime) > 0.01) {
        try {
          video.currentTime = Math.min(t, (video.duration || CUSTOMIZER_CONFIG.duration) - 0.05);
          lastTime = t;
        } catch {
          // Ignore seek errors while metadata loads.
        }
      }
      setProgress((prev) => (Math.abs(prev - currentP.current) > 0.0005 ? currentP.current : prev));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reducedMotion, timeAt]);

  const seg = segmentAt(progress);
  const holdingIndex = seg.hold ? seg.stopIndex : null;
  // Highlight the stone the film is resting on or heading to.
  const activeIndex = seg.stopIndex;

  const holdCentre = (index: number) => {
    const holds = timeline.filter((s) => s.hold);
    const h = holds[index];
    return h ? (h.from + h.to) / 2 : 0;
  };

  const copy = (
    <div dir="rtl" className="font-peyda text-white max-w-lg">
      <span className="font-grotesk text-[11px] tracking-[0.2em] uppercase text-[#c9a56a]">Personalise</span>
      <h2 className="mt-3 text-3xl xl:text-5xl font-bold leading-tight">
        نگین خود را انتخاب کنید،
        <br />
        جواهرتان را شخصی کنید.
      </h2>
      <p className="mt-5 text-sm xl:text-base text-stone-300 leading-loose">
        تراش الماس، فرم نشیمن و رنگ طلا را خودتان برگزینید. آتلیه آموزگار هر انتخاب را به حلقه‌ای بدل می‌کند که
        فقط از آنِ شماست.
      </p>

      <ol className="mt-8 grid grid-cols-4 gap-2" aria-label="تراش‌های نمونه">
        {stops.map((stop, index) => {
          const isActive = index === activeIndex;
          return (
            <li key={stop.nameEn}>
              <button
                type="button"
                onClick={() => (reducedMotion ? undefined : scrollToProgress(holdCentre(index)))}
                aria-current={isActive ? 'true' : undefined}
                className={`w-full border-t-2 pt-3 text-right transition-colors duration-500 cursor-pointer ${
                  isActive ? 'border-[#c9a56a] text-white' : 'border-stone-700 text-stone-500 hover:text-stone-300'
                }`}
              >
                <span className="block text-sm font-bold">{stop.nameFa}</span>
                <span dir="ltr" className="block text-right font-grotesk text-[10px] uppercase tracking-[0.14em] mt-0.5">
                  {stop.nameEn}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <button
        type="button"
        onClick={onOpenVipBooking}
        className="mt-10 inline-flex items-center gap-2 px-6 py-3 bg-white text-black text-sm font-bold hover:bg-stone-200 transition-colors cursor-pointer"
      >
        <span>شروع شخصی‌سازی</span>
        <ArrowLeft className="w-4 h-4" />
      </button>
    </div>
  );

  if (reducedMotion) {
    return (
      <section id="jewelry-customizer" className="bg-black py-20 px-4 sm:px-8">
        <div dir="ltr" className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          {copy}
          <img src={CUSTOMIZER_CONFIG.posterSrc} alt="انتخاب نگین الماس برای حلقه" className="w-full max-w-md mx-auto" />
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="jewelry-customizer"
      aria-label="شخصی‌سازی جواهر"
      className="relative bg-black"
      style={{ height: `${CUSTOMIZER_CONFIG.scrollVh}vh` }}
    >
      <div dir="ltr" className="sticky top-0 h-[100svh] overflow-hidden flex flex-col-reverse lg:flex-row">
        {/* Copy: left on desktop, below the film on mobile */}
        <div className="relative z-10 shrink-0 lg:flex-1 flex items-center px-6 sm:px-10 lg:px-16 xl:px-24 py-8 lg:pt-[69px] lg:py-0">
          {copy}
        </div>

        {/* Film: right half on desktop */}
        <div className="relative flex-1 min-h-0 lg:flex-none lg:w-1/2 lg:h-full">
          {/* Mobile: film fills the area. Desktop: a frame at the film's own aspect ratio, faded into black on every edge. */}
          <div className="absolute inset-0 lg:inset-auto lg:top-0 lg:bottom-0 lg:left-1/2 lg:-translate-x-1/2 lg:h-full lg:aspect-[600/734]">
            <video
              ref={videoRef}
              src={CUSTOMIZER_CONFIG.videoSrc}
              poster={CUSTOMIZER_CONFIG.posterSrc}
              muted
              playsInline
              preload="auto"
              aria-label="الماس‌هایی با تراش گرد، بیضی، گلابی و مارکیز که یکی‌یکی روی حلقه می‌نشینند"
              className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
            />
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/5 bg-gradient-to-r from-black to-transparent hidden lg:block" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/5 bg-gradient-to-l from-black to-transparent hidden lg:block" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black to-transparent" />
          </div>

          {/* Stone label shown while the scroll rests on a stop */}
          <div
            dir="rtl"
            className={`absolute bottom-8 right-8 lg:bottom-auto lg:top-[100px] lg:right-12 font-peyda text-right transition-opacity duration-500 ${
              holdingIndex !== null ? 'opacity-100' : 'opacity-0'
            }`}
            aria-live="polite"
          >
            {holdingIndex !== null && (
              <>
                <span className="block text-[11px] text-stone-400">تراش</span>
                <span className="block text-xl font-bold text-white">{stops[holdingIndex].nameFa}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
