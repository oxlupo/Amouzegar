import React from 'react';
import { Phone, ArrowLeft } from 'lucide-react';
import { BESPOKE_STEPS, SALON_BRANCHES } from '../data/jewelryData';

interface BespokeAtelierProps {
  onOpenVipBooking: () => void;
}

const toPersianDigits = (value: string) => value.replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);

/** Home page section introducing the bespoke (custom order) service. */
export const BespokeAtelier: React.FC<BespokeAtelierProps> = ({ onOpenVipBooking }) => {
  const gallery = SALON_BRANCHES[0];

  return (
    <section id="bespoke-atelier" className="relative bg-black text-white font-peyda border-t border-stone-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

        {/* Text column (right side in RTL) */}
        <div className="lg:col-span-7 order-2 lg:order-1">
          <span className="font-cinzel text-[11px] tracking-[0.3em] uppercase text-stone-500 block">
            Bespoke
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            جواهری که فقط برای شما ساخته می‌شود
          </h2>
          <p className="mt-6 text-sm sm:text-base text-stone-300 leading-loose max-w-2xl">
            در آتلیه آموزگار، سفارش اختصاصی از یک گفت‌وگو آغاز می‌شود. ایده‌ای در ذهن دارید، طرحی قدیمی که
            می‌خواهید دوباره جان بگیرد، یا سنگی که برایتان معنایی خاص دارد؛ طراحان و استادکاران ما آن را به اثری
            یگانه بدل می‌کنند که نمونهٔ دیگری از آن ساخته نخواهد شد.
          </p>

          {/* Steps */}
          <ol className="mt-10 grid grid-cols-1 sm:grid-cols-2 border-t border-stone-800">
            {BESPOKE_STEPS.map((s, i) => (
              <li
                key={s.step}
                className={`py-6 border-b border-stone-800 ${i % 2 === 0 ? 'sm:pl-8 sm:border-l' : 'sm:pr-8'}`}
              >
                <div className="flex items-baseline gap-3">
                  <span className="font-grotesk text-xs text-stone-500 tabular-nums">{s.step}</span>
                  <h3 className="text-base font-bold">{s.titleFa}</h3>
                </div>
                <p className="mt-2 text-xs sm:text-[13px] text-stone-400 leading-relaxed">{s.descFa}</p>
              </li>
            ))}
          </ol>

          <p className="mt-6 text-xs text-stone-500 leading-relaxed">
            زمان ساخت بسته به طرح و سنگ متفاوت است و در جلسهٔ نخست به شما اعلام می‌شود.
          </p>

          {/* Actions */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onOpenVipBooking}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black text-sm font-bold hover:bg-stone-200 transition-colors cursor-pointer"
            >
              <span>رزرو جلسهٔ مشاوره</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
            <a
              href={`tel:${gallery.telLink}`}
              className="inline-flex items-center gap-2 px-6 py-3 border border-stone-700 text-sm font-semibold text-stone-200 hover:border-white hover:text-white transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>تماس با گالری</span>
              <span dir="ltr" className="font-grotesk tabular-nums">{toPersianDigits(gallery.phone)}</span>
            </a>
          </div>
          <p className="mt-4 text-[11px] text-stone-500">{gallery.addressFa}</p>
        </div>

        {/* Image column (left side in RTL) */}
        <div className="lg:col-span-5 order-1 lg:order-2">
          <div className="relative aspect-[4/5] w-full max-w-md mx-auto lg:max-w-none overflow-hidden bg-stone-950">
            <img
              src="/s02.jpeg"
              alt="الماس گلابی‌تراش آتلیه آموزگار"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>

      </div>
    </section>
  );
};
