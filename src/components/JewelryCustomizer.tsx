import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft } from 'lucide-react';

/**
 * Scroll-scrubbed "build your ring" film. Each stone seats into the setting and the
 * scroll eases into a soft stop there; copy on the left invites visitors to personalise.
 */
const CUSTOMIZER_CONFIG = {
  videoSrc: '/customize/scroll-customizer.mp4',
  posterSrc: '/customize/scroll-customizer-poster.jpg',
  duration: 4.208333,
  /** Viewport heights of scrolling while the section is pinned. */
  scrollVh: 300,
  /** Share of the whole scroll each stop holds still. */
  holdShare: 0.11,
  lerp: 0.22,
  /** Film speed while moving to the next stone (1 = real time). Lower is slower and easier to follow. */
  stepPlaybackRate: 0.8,
  /** Shortest and longest time one step may take, in seconds. */
  minStepSeconds: 1.2,
  maxStepSeconds: 3.2,
  /** Moments a stone is seated in the ring (seconds into the film). */
  stops: [
    { time: 0.3, title: 'جواهرتان را تصور کنید.', text: 'یک فرم، یک نگین، یک حس؛ جواهری که در ذهن شماست، می‌تواند فقط از آنِ شما باشد.' },
    { time: 2.35, title: 'تصورتان را با ما در میان بگذارید.', text: 'از ایده‌تان بگویید یا تصویری برایمان بفرستید. با هم، جزئیات جواهر دلخواهتان را شکل می‌دهیم.' },
    { time: 3.95, title: 'ما برایتان می‌سازیم.', text: 'از انتخاب نگین تا آخرین پرداخت، جواهرتان را مطابق سلیقه و خواستهٔ شما طراحی و می‌سازیم.' },
  ],
};

/** Elliptical fade around the wheel's hub, which sits just outside the film's right edge. */
const CRESCENT_MASK =
  'radial-gradient(ellipse 118% 60% at 100% 50%, #000 0%, #000 46%, rgba(0,0,0,0.6) 63%, transparent 84%)';

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
  const { stops, holdShare } = CUSTOMIZER_CONFIG;
  const duration = stops[stops.length - 1].time - stops[0].time;
  const holdTotal = holdShare * stops.length;
  const moveTotal = 1 - holdTotal;
  // Moves get scroll distance in proportion to the film time they cover.
  const segments: Segment[] = [];
  let p = 0;
  let t = stops[0].time;
  stops.forEach((stop, i) => {
    const moveLen = ((stop.time - t) / duration) * moveTotal;
    if (moveLen > 0) segments.push({ from: p, to: p + moveLen, t0: t, t1: stop.time, hold: false, stopIndex: i });
    p += moveLen;
    segments.push({ from: p, to: p + holdShare, t0: stop.time, t1: stop.time, hold: true, stopIndex: i });
    p += holdShare;
    t = stop.time;
  });
  segments[segments.length - 1].to = 1;
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

  const [sceneIndex, setSceneIndex] = useState(0);
  /** A step in progress: the film moves from one stone to the next at a readable pace. */
  const stepRef = useRef<{ start: number; from: number; to: number; duration: number; index: number; native: boolean } | null>(null);
  /** Input is ignored until this time (ms), so one gesture moves exactly one stone. */
  const lockedUntilRef = useRef(0);
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

  const holdCentreOf = useCallback(
    (index: number) => {
      const h = timeline.filter((seg) => seg.hold)[index];
      return h ? (h.from + h.to) / 2 : 0;
    },
    [timeline]
  );

  /**
   * Moves to a stone as a timed step instead of a fast smooth-scroll. The pinned section's scroll
   * position jumps at once (nothing on screen moves with it); the film then travels to the stone.
   * Forward steps play the film natively, which is smoother than seeking every frame.
   */
  const goToStop = useCallback(
    (index: number) => {
      const section = sectionRef.current;
      const video = videoRef.current;
      if (!section) return;
      const { stepPlaybackRate, minStepSeconds, maxStepSeconds } = CUSTOMIZER_CONFIG;
      const from = video && video.readyState >= 1 ? video.currentTime : timeAt(currentP.current);
      const to = stops[index].time;
      const duration = Math.min(maxStepSeconds, Math.max(minStepSeconds, Math.abs(to - from) / stepPlaybackRate));
      const p = holdCentreOf(index);
      const scrollable = section.offsetHeight - window.innerHeight;
      targetP.current = p;
      currentP.current = p;
      window.scrollTo({ top: section.getBoundingClientRect().top + window.scrollY + p * scrollable, behavior: 'instant' as ScrollBehavior });
      lockedUntilRef.current = performance.now() + duration * 1000 + 250;
      if (Math.abs(to - from) < 0.02) {
        stepRef.current = null;
        setSceneIndex(index);
        return;
      }
      let native = false;
      if (video && to > from) {
        video.playbackRate = Math.max(0.25, (to - from) / duration);
        native = true;
        video.play().catch(() => {
          if (stepRef.current) stepRef.current.native = false;
        });
      } else {
        video?.pause();
      }
      stepRef.current = { start: performance.now(), from, to, duration, index, native };
    },
    [stops, timeAt, holdCentreOf]
  );

  // Touch and keyboard scrolling also settle on a seated stone.
  const softSnap = useCallback(
    (p: number) => {
      if (p <= 0 || p >= 1) return;
      const holds = timeline.filter((seg) => seg.hold);
      if (holds.some((seg) => p >= seg.from && p <= seg.to)) return;
      if (stepRef.current) return;
      const nearest = holds.reduce((best, seg, i) =>
        Math.abs(p - (seg.from + seg.to) / 2) < Math.abs(p - (holds[best].from + holds[best].to) / 2) ? i : best, 0);
      goToStop(nearest);
    },
    [timeline, goToStop]
  );

  // Treat one wheel/trackpad gesture as one stone, including its momentum tail.
  useEffect(() => {
    if (reducedMotion) return;
    let lastWheel = 0;
    let accumulated = 0;
    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      const section = sectionRef.current;
      if (!section || !event.deltaY) return;
      const bounds = section.getBoundingClientRect();
      if (bounds.top > 1 || bounds.bottom < window.innerHeight - 1) return;
      const now = performance.now();
      const gap = now - lastWheel;
      lastWheel = now;
      const holds = timeline.filter((seg) => seg.hold);
      const p = targetP.current;
      const index = holds.reduce((best, seg, i) =>
        Math.abs(p - (seg.from + seg.to) / 2) < Math.abs(p - (holds[best].from + holds[best].to) / 2) ? i : best, 0);
      const direction = Math.sign(event.deltaY);
      const lockedUntil = lockedUntilRef.current;
      const locked = now < lockedUntil || (lockedUntil > 0 && gap < 220);
      if (!locked && ((index === 0 && direction < 0) || (index === holds.length - 1 && direction > 0))) return;
      event.preventDefault();
      if (locked) return;
      if (gap > 220) accumulated = 0;
      accumulated += event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1);
      if (Math.abs(accumulated) < 24) return;
      accumulated = 0;
      goToStop(Math.max(0, Math.min(holds.length - 1, index + direction)));
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    let touchX = 0;
    let touchY = 0;
    let touchDelta = 0;
    let capturedTouch = false;
    const onTouchStart = (event: TouchEvent) => {
      capturedTouch = false;
      touchDelta = 0;
      if (event.touches.length !== 1) return;
      touchX = event.touches[0].clientX;
      touchY = event.touches[0].clientY;
    };
    const onTouchMove = (event: TouchEvent) => {
      if (event.touches.length !== 1) return;
      const bounds = sectionRef.current?.getBoundingClientRect();
      if (!bounds || bounds.top > 1 || bounds.bottom < window.innerHeight - 1) return;
      const dy = touchY - event.touches[0].clientY;
      if (Math.abs(dy) < 12 || Math.abs(dy) < Math.abs(touchX - event.touches[0].clientX)) return;
      const holds = timeline.filter((seg) => seg.hold);
      const atFirst = targetP.current <= holds[0].to;
      const atLast = targetP.current >= holds[holds.length - 1].from;
      if ((atFirst && dy < 0) || (atLast && dy > 0)) return;
      event.preventDefault();
      capturedTouch = true;
      touchDelta = dy;
    };
    const onTouchEnd = () => {
      if (!capturedTouch || Math.abs(touchDelta) < 24) return;
      // Reuse the same one-step and transition lock as wheel input.
      lastWheel = 0;
      onWheel({ deltaX: 0, deltaY: touchDelta, deltaMode: 0, ctrlKey: false, preventDefault() {} } as WheelEvent);
    };
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [reducedMotion, timeline, goToStop]);

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
      const video = videoRef.current;
      const step = stepRef.current;
      if (step) {
        const elapsed = (performance.now() - step.start) / 1000;
        const done = step.native && video
          ? video.currentTime >= step.to - 0.03 || elapsed > step.duration + 0.6
          : elapsed >= step.duration;
        if (done) {
          if (video) {
            video.pause();
            try { video.currentTime = step.to; } catch { /* metadata not ready */ }
          }
          lastTime = step.to;
          stepRef.current = null;
          setSceneIndex(step.index);
        } else if (!step.native && video && video.readyState >= 1) {
          const t = step.from + easeInOutCubic(Math.min(elapsed / step.duration, 1)) * (step.to - step.from);
          try { video.currentTime = t; } catch { /* ignore */ }
          lastTime = t;
        }
        frame = requestAnimationFrame(tick);
        return;
      }
      const diff = targetP.current - currentP.current;
      currentP.current = Math.abs(diff) > 0.0004 ? currentP.current + diff * CUSTOMIZER_CONFIG.lerp : targetP.current;
      const t = timeAt(currentP.current);
      if (video && video.readyState >= 1 && Math.abs(t - lastTime) > 0.01) {
        try {
          video.currentTime = Math.min(t, (video.duration || CUSTOMIZER_CONFIG.duration) - 0.05);
          lastTime = t;
        } catch {
          // Ignore seek errors while metadata loads.
        }
      }
      const segment = segmentAt(currentP.current);
      if (segment.hold && Math.abs(diff) < 0.008) setSceneIndex(segment.stopIndex);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reducedMotion, timeAt, segmentAt]);

  const copy = (
    <div dir="rtl" className="font-peyda text-white max-w-lg">
      <span className="text-[11px] tracking-wide text-stone-400">از تصور شما تا خلق یک جواهر</span>
      <div aria-live="polite" aria-atomic="true" className="min-h-[160px] lg:min-h-[240px]">
        {(reducedMotion ? stops : [stops[sceneIndex]]).map((stop) => (
          <div key={stop.title} className={reducedMotion ? undefined : 'animate-fade-up'}>
            <h2 className="mt-3 text-3xl xl:text-5xl font-bold leading-tight">{stop.title}</h2>
            <p className="mt-5 text-sm xl:text-base text-stone-300 leading-loose">{stop.text}</p>
          </div>
        ))}
      </div>

      {!reducedMotion && <ol className="mt-6 grid grid-cols-3 gap-3" aria-label="مراحل سفارش اختصاصی">
        {stops.map((stop, index) => {
          const isActive = index === sceneIndex;
          return (
            <li key={stop.title}>
              <button
                type="button"
                onClick={() => (reducedMotion ? undefined : goToStop(index))}
                aria-current={isActive ? 'true' : undefined}
                className={`w-full border-t-2 pt-3 text-right transition-colors duration-500 cursor-pointer ${
                  isActive ? 'border-[#c9a56a] text-white' : 'border-stone-700 text-stone-500 hover:text-stone-300'
                }`}
              >
                <span className="block text-xs font-bold">{['تصور شما', 'همراهی ما', 'خلق جواهر'][index]}</span>
              </button>
            </li>
          );
        })}
      </ol>}

      <div className="mt-8 min-h-12">
      {(reducedMotion || sceneIndex === stops.length - 1) && <button
        type="button"
        onClick={onOpenVipBooking}
        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black text-sm font-bold hover:bg-stone-200 transition-colors cursor-pointer"
      >
        <span>سفارش اختصاصی</span>
        <ArrowLeft className="w-4 h-4" />
      </button>}
      </div>
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
          {/* Keep the smaller frame flush with the top-right corner, without cropping the film. */}
          {/* Crescent fade: a radial mask centred on the wheel's hidden hub (right edge) dissolves the
              film into the black section along the wheel's own arc instead of a straight edge. */}
          <div
            className="absolute top-0 right-0 h-full lg:h-[78%] max-w-full aspect-[9/16]"
            style={{ maskImage: CRESCENT_MASK, WebkitMaskImage: CRESCENT_MASK }}
          >
            <video
              ref={videoRef}
              src={CUSTOMIZER_CONFIG.videoSrc}
              poster={CUSTOMIZER_CONFIG.posterSrc}
              muted
              playsInline
              preload="auto"
              onLoadedMetadata={(event) => { event.currentTarget.currentTime = timeAt(targetP.current); }}
              aria-label="نمایش مرحله‌به‌مرحلهٔ انتخاب الماس برای ساخت جواهر اختصاصی"
              className="absolute inset-0 w-full h-full object-contain object-top-right pointer-events-none"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
