import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';

// MapLibre is large (~1 MB); load it only when the footer is about to scroll into view.
const FooterMap = lazy(() => import('./FooterMap'));

const FOOTER_LOCATION = {
  title: 'گالری جواهر داود آموزگار',
  addressFa: 'مشهد، احمدآباد، قبل از رضا ۲، سمت راست',
  addressEn: 'Ahmadabad blvd, before reza 2, Mashhad, Iran 91220',
  phone: '051-38437395',
  telLink: '+985138437395',
  /**
   * Map pin position [longitude, latitude]. APPROXIMATE (Ahmadabad Blvd, Mashhad) — replace with the
   * gallery's exact coordinates (Google Maps: right-click the building, copy the numbers).
   */
  coordinates: [59.5797, 36.2995] as [number, number],
  directionsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Ahmadabad blvd, before reza 2, Mashhad, Iran')}`,
};

const toPersianDigits = (value: string) => value.replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);

export const Footer: React.FC = () => {
  const mapSlotRef = useRef<HTMLDivElement>(null);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    const el = mapSlotRef.current;
    if (!el || showMap) return;
    if (!('IntersectionObserver' in window)) {
      setShowMap(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShowMap(true);
          observer.disconnect();
        }
      },
      { rootMargin: '800px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [showMap]);

  return (
    <footer id="site-contact" className="bg-[#000000] text-stone-300 border-t border-stone-900 pt-16 pb-12 font-peyda scroll-mt-[69px]" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Full Footer Space: Map on Right, Contact Info on Left (No enclosing board/card) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* RIGHT SIDE in RTL (ستون سمت راست): MapLibre map, dark basemap, sharp corners */}
          <div ref={mapSlotRef} dir="ltr" role="region" aria-label="نقشهٔ موقعیت گالری جواهر داود آموزگار" className="lg:col-span-7 h-[280px] sm:h-[340px] md:h-[380px] overflow-hidden border border-stone-800 bg-stone-950 relative">
            {showMap && (
              <Suspense fallback={null}>
                <FooterMap
                  coordinates={FOOTER_LOCATION.coordinates}
                  title={FOOTER_LOCATION.title}
                  address={FOOTER_LOCATION.addressFa}
                  directionsUrl={FOOTER_LOCATION.directionsUrl}
                />
              </Suspense>
            )}
            <a
              href={FOOTER_LOCATION.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              dir="rtl"
              className="absolute top-3 right-3 z-10 bg-black/85 hover:bg-white text-white hover:text-black border border-white/20 px-3 py-1.5 text-xs font-bold transition-colors"
            >
              مسیریابی
            </a>
          </div>

          {/* LEFT SIDE in RTL (ستون سمت چپ): تماس با ما */}
          <div className="lg:col-span-5 space-y-5 text-right">
            <h4 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">
              تماس با ما
            </h4>

            <div className="space-y-4 text-xs sm:text-[13px] text-stone-400">
              <div>
                <span className="font-semibold text-stone-200 block mb-1">آدرس گالری:</span>
                <p className="leading-relaxed text-stone-300">
                  {FOOTER_LOCATION.addressFa}
                </p>
                <p className="text-[11px] text-stone-500 mt-0.5 text-right" dir="ltr">
                  {FOOTER_LOCATION.addressEn}
                </p>
              </div>

              <div>
                <span className="font-semibold text-stone-200 block mb-1">شماره تماس:</span>
                <a 
                  href={`tel:${FOOTER_LOCATION.telLink}`}
                  className="text-stone-300 hover:text-white transition-colors inline-block text-sm"
                  dir="ltr"
                >
                  {toPersianDigits(FOOTER_LOCATION.phone)}
                </a>
              </div>

              <div>
                <span className="font-semibold text-stone-200 block mb-1">ساعات کاری:</span>
                <p className="leading-relaxed">
                  شنبه تا پنج‌شنبه: ۹:۳۰ الی ۱۴:۰۰ و ۱۷:۰۰ الی ۲۱:۳۰ (جمعه‌ها تعطیل)
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: one short line — copyright on the right, brand and city on the left */}
        <div className="mt-14 pt-8 border-t border-stone-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-stone-500">
          <p>© ۱۴۰۵ گالری جواهر داود آموزگار</p>
          <p dir="ltr" className="tracking-[0.2em] uppercase text-[10px]">
            Amouzegar Jewellery · Mashhad
          </p>
        </div>

      </div>
    </footer>
  );
};
