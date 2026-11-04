import React from 'react';

interface BrandSloganSectionProps {
  onScrollNext?: () => void;
}

export const BrandSloganSection: React.FC<BrandSloganSectionProps> = () => {
  return (
    <section
      id="brand-slogan"
      className="relative w-full min-h-[50dvh] sm:min-h-[60dvh] flex flex-col items-center justify-center bg-black overflow-hidden px-6 py-28 sm:py-36"
    >
      {/* Subtle Ambient Radial Light Ray */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,_rgba(212,175,55,0.06)_0%,_rgba(0,0,0,0)_65%)] pointer-events-none" 
        aria-hidden="true" 
      />

      {/* Atmospheric Top & Bottom Vignettes (Deep pure black fade to eliminate any transition seam) */}
      <div className="absolute inset-x-0 top-0 h-32 sm:h-44 bg-gradient-to-b from-black via-black/80 to-transparent pointer-events-none z-10" />
      <div className="absolute inset-x-0 bottom-0 h-36 sm:h-52 bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-none z-10" />

      {/* Slogan Content Architecture */}
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center">
        
        {/* Subtle Accent Shimmer Line */}
        <div className="flex items-center gap-3 mb-8 opacity-70">
          <div className="w-8 sm:w-16 h-[1px] bg-gradient-to-r from-transparent via-amber-200/40 to-amber-200/80" />
          <div className="w-1.5 h-1.5 rotate-45 border border-amber-300/80 bg-amber-400/30" />
          <div className="w-8 sm:w-16 h-[1px] bg-gradient-to-l from-transparent via-amber-200/40 to-amber-200/80" />
        </div>

        {/* Primary English Luxury Slogan */}
        <h2 
          className="font-grotesk text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-stone-100 tracking-wide sm:tracking-wider leading-snug sm:leading-tight mb-5 select-none"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          Where light learns to stay.
        </h2>

        {/* Persian Slogan: Smaller in size and crafted strictly in Peyda font */}
        <p 
          className="font-peyda text-xs sm:text-sm md:text-base text-stone-400 font-light tracking-wide sm:tracking-widest leading-relaxed select-none max-w-md mx-auto"
          dir="rtl"
        >
          جایی که نور، ماندن را می‌آموزد.
        </p>

      </div>
    </section>
  );
};

export default BrandSloganSection;
