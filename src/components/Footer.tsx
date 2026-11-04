import React from 'react';

const FOOTER_LOCATION = {
  title: 'گالری جواهر داود آموزگار',
  addressFa: 'مشهد، احمدآباد، قبل از رضا ۲، سمت راست',
  addressEn: 'Ahmadabad blvd, before reza 2, Mashhad, Iran 91220',
  phone: '051-38437395',
  telLink: '+985138437395',
  embedUrl: `https://maps.google.com/maps?q=${encodeURIComponent('Ahmadabad blvd, before reza 2, Mashhad, Iran')}&t=&z=16&ie=UTF8&iwloc=B&output=embed`,
};

const toPersianDigits = (value: string) => value.replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);

export const Footer: React.FC = () => {
  return (
    <footer id="site-contact" className="bg-[#000000] text-stone-300 border-t border-stone-900 pt-16 pb-12 font-peyda scroll-mt-[69px]" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Full Footer Space: Map on Right, Contact Info on Left (No enclosing board/card) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* RIGHT SIDE in RTL (ستون سمت راست): Google Map */}
          <div className="lg:col-span-7 h-[280px] sm:h-[340px] md:h-[380px] rounded-2xl overflow-hidden border border-stone-800/90 bg-stone-950 relative shadow-2xl group">
            <iframe
              title="موقعیت گالری جواهر داود آموزگار در گوگل مپ"
              src={FOOTER_LOCATION.embedUrl}
              className="w-full h-full border-0 filter contrast-105 brightness-95"
              loading="lazy"
              allowFullScreen
            />

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
        <div className="mt-14 pt-8 border-t border-stone-900 flex flex-col items-center justify-center gap-2 text-center text-[11px] text-stone-500">
          <p>© ۱۴۰۵ گالری جواهر داود آموزگار</p>
          <p dir="ltr" className="tracking-[0.2em] uppercase text-[10px]">
            Amouzegar Jewellery · Mashhad
          </p>
        </div>

      </div>
    </footer>
  );
};
