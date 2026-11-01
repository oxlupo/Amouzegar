import React from 'react';
import { Navigation, ExternalLink } from 'lucide-react';

const FOOTER_LOCATION = {
  title: 'گالری جواهر داود آموزگار',
  addressFa: 'مشهد، احمدآباد، قبل از رضا ۲، سمت راست',
  addressEn: 'Ahmadabad blvd, before reza 2, Mashhad, Iran 91220',
  phone: '051-38437395',
  telLink: '+985138437395',
  mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Ahmadabad blvd, before reza 2, Mashhad, Iran')}`,
  embedUrl: `https://maps.google.com/maps?q=${encodeURIComponent('Ahmadabad blvd, before reza 2, Mashhad, Iran')}&t=&z=16&ie=UTF8&iwloc=B&output=embed`,
};

interface FooterProps {
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  return (
    <footer className="bg-[#000000] text-stone-300 border-t border-stone-900 pt-16 pb-12 font-peyda" dir="rtl">
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
            {/* Direct Open in Google Maps Floating Button */}
            <div className="absolute top-3.5 right-3.5 z-10">
              <a
                href={FOOTER_LOCATION.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black/85 hover:bg-white text-white hover:text-black backdrop-blur-md border border-white/20 text-xs font-semibold transition-all shadow-lg active:scale-95 cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5 text-amber-400" />
                <span>Open in Maps</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
            </div>
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
                <p className="text-[11px] text-stone-500 font-mono mt-0.5" dir="ltr">
                  {FOOTER_LOCATION.addressEn}
                </p>
              </div>

              <div>
                <span className="font-semibold text-stone-200 block mb-1">شماره تماس:</span>
                <a 
                  href={`tel:${FOOTER_LOCATION.telLink}`}
                  className="text-stone-300 hover:text-white font-mono transition-colors block text-sm"
                  dir="ltr"
                >
                  {FOOTER_LOCATION.phone}
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

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-stone-900 flex flex-col items-center justify-center gap-2.5 text-[11px] text-stone-500 text-center">
          <p className="text-center">
            © ۲۰۲۶ کاتالوگ رسمی و نمایشگاه گالری جواهر داود آموزگار • تمامی حقوق محفوظ است.
          </p>
          <p className="font-serif text-center" dir="ltr">
            Davood Amoozegar Haute Joaillerie • Ahmadabad blvd, Mashhad, Iran 91220
          </p>
          <button
            onClick={onOpenAdmin}
            className="text-stone-700 hover:text-stone-400 transition-colors text-[10px] font-mono tracking-widest uppercase cursor-pointer pt-1"
            title="ورود به پنل مدیریت (/admin)"
          >
            /admin
          </button>
        </div>

      </div>
    </footer>
  );
};
