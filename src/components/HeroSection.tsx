import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause,
  ChevronDown
} from 'lucide-react';
import { JewelryItem } from '../types';
import { HERO_VIDEO_SRC } from '../data/jewelryData';

interface HeroSectionProps {
  onOpenVipBooking: () => void;
  onSelectJewelryItem: (item: JewelryItem) => void;
  onExploreCatalog: () => void;
  heroItems: JewelryItem[];
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreCatalog,
}) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isLogoVisible, setIsLogoVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showPlayStateIcon, setShowPlayStateIcon] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle sequential loading: Video MUST load first, then Logo appears on top
  const handleVideoLoaded = () => {
    if (!isVideoLoaded) {
      setIsVideoLoaded(true);
      // Sequenced entrance: Logo appears smoothly after video is confirmed loaded
      setTimeout(() => {
        setIsLogoVisible(true);
      }, 350);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Check if video is already ready (e.g. from browser cache)
    if (video.readyState >= 2) {
      handleVideoLoaded();
    }

    const onData = () => handleVideoLoaded();
    const onCanPlay = () => handleVideoLoaded();
    const onPlaying = () => {
      handleVideoLoaded();
      setIsPlaying(true);
    };

    video.addEventListener('loadeddata', onData);
    video.addEventListener('canplay', onCanPlay);
    video.addEventListener('playing', onPlaying);

    return () => {
      video.removeEventListener('loadeddata', onData);
      video.removeEventListener('canplay', onCanPlay);
      video.removeEventListener('playing', onPlaying);
    };
  }, [isVideoLoaded]);

  // Toggle Play / Pause with momentary center feedback
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
    setShowPlayStateIcon(true);
    setTimeout(() => setShowPlayStateIcon(false), 700);
  };

  return (
    <section 
      ref={containerRef}
      id="hero" 
      className="relative w-full h-[100dvh] min-h-[100dvh] bg-[#000000] overflow-hidden flex flex-col justify-between items-center select-none"
    >
      {/* Fullscreen Video Wrapper (Edge-to-Edge with NO side black bars) */}
      <div 
        className="relative w-full h-full overflow-hidden bg-black flex flex-col justify-between items-center cursor-pointer"
        onClick={togglePlay}
      >
        
        {/* The Mobile Portrait Video (hero.webm) covering 100% of viewport without side crops */}
        <div className="absolute inset-0 z-0 w-full h-full">
          <video
            ref={videoRef}
            src={HERO_VIDEO_SRC}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className={`w-full h-full object-cover object-center transition-all duration-1000 ${
              isVideoLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
            onLoadedData={handleVideoLoaded}
            onCanPlay={handleVideoLoaded}
            onPlaying={handleVideoLoaded}
          />

          {/* Minimal, transparent vertical gradient to enhance text visibility without darkening the sides */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40 pointer-events-none" />
          {/* Bottom fade into pure black to blend seamlessly into next section */}
          <div className="absolute inset-x-0 bottom-0 h-32 sm:h-48 bg-gradient-to-t from-black via-black/70 to-transparent pointer-events-none" />
        </div>

        {/* 1. Sequential Loader Indicator (Shown strictly BEFORE video loads) */}
        {!isVideoLoaded && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black gap-4 text-center px-6">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-stone-800" />
              <div className="absolute inset-0 rounded-full border-t border-amber-400 animate-spin" />
              <div className="w-8 h-8 rounded-full bg-stone-900 flex items-center justify-center text-amber-300 font-grotesk font-bold text-sm">
                آ
              </div>
            </div>
          </div>
        )}

        {/* 2. SVG Logo Layer: Exactly in the vertical & horizontal CENTER of the video */}
        <div 
          className={`absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center pointer-events-none transition-all duration-1000 ease-out transform ${
            isVideoLoaded && isLogoVisible
              ? 'opacity-100 scale-100'
              : 'opacity-0 scale-95'
          }`}
          style={{ willChange: 'opacity, transform' }}
        >
          {/* Authentic White SVG Logo */}
          <div className="relative flex flex-col items-center">
            <img
              src="/amoozegar_logo_white.svg"
              alt="لوگوی گالری جواهرات آموزگار"
              className="w-56 sm:w-64 md:w-72 max-w-[80vw] h-auto object-contain filter drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)] select-none"
              draggable={false}
            />
          </div>
        </div>

        {/* 3. Momentary Play / Pause Feedback on Tap */}
        {showPlayStateIcon && (
          <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none animate-in fade-in zoom-in-75 duration-200">
            <div className="p-4 rounded-full bg-black/75 border border-white/20 text-white shadow-2xl backdrop-blur-md">
              {isPlaying ? <Play className="w-8 h-8" /> : <Pause className="w-8 h-8" />}
            </div>
          </div>
        )}

        {/* 4. Bottom "SCROLL DOWN" Indicator with Gray Icon */}
        <div 
          className={`absolute bottom-3 sm:bottom-4 inset-x-0 z-20 flex flex-col items-center justify-center pointer-events-auto transition-all duration-1000 ${
            isVideoLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onExploreCatalog}
            className="group flex flex-col items-center gap-1 focus:outline-none transition-transform active:scale-95 cursor-pointer"
            aria-label="Scroll Down"
            id="hero-scroll-now-btn"
          >
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] font-grotesk font-medium text-stone-400 group-hover:text-stone-300 transition-colors">
              SCROLL DOWN
            </span>
            <ChevronDown className="w-4 h-4 text-stone-400 group-hover:text-stone-300 animate-bounce transition-colors" />
          </button>
        </div>

      </div>
    </section>
  );
};
