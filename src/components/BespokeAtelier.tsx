import React, { useState } from 'react';
import { Sparkles, CheckCircle2, Compass, Feather, Hammer, Layers, Send } from 'lucide-react';
import { BESPOKE_STEPS } from '../data/jewelryData';

export const BespokeAtelier: React.FC = () => {
  const [metal, setMetal] = useState('platinum');
  const [stone, setStone] = useState('ruby');
  const [category, setCategory] = useState('ring');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) return;
    setSubmitted(true);
  };

  return (
    <section id="bespoke-atelier" className="py-24 bg-[#020202] relative border-t border-stone-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-stone-800 bg-stone-950 text-stone-300 text-xs font-semibold">
            <Feather className="w-3.5 h-3.5 text-amber-400" />
            <span>آتلیه طراحی و ساخت سفارشی آموزگار</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            خلق اثر انحصاری مطابق رویای شما
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
            از یک ایده یا طرح اولیه تا مجلل‌ترین شاهکار جواهر؛ کارگاه تخصصی آموزگار با دستان هنرمندان زرگر، هر گوهر گرانبها را به میراثی جاودان بدل می‌سازد.
          </p>
        </div>

        {/* 4 Process Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {BESPOKE_STEPS.map((s) => (
            <div
              key={s.step}
              className="p-6 rounded-2xl bg-[#050505] border border-stone-900 hover:border-stone-700 transition-all text-right space-y-3"
            >
              <span className="text-2xl font-serif font-bold text-amber-400 block">
                {s.step}
              </span>
              <h3 className="text-base font-bold text-white">
                {s.titleFa}
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                {s.descFa}
              </p>
            </div>
          ))}
        </div>

        {/* Custom Order Request Form */}
        <div className="max-w-4xl mx-auto rounded-2xl bg-[#050505] border border-stone-800 p-6 sm:p-10 shadow-2xl">
          {submitted ? (
            <div className="text-center py-10 space-y-4 animate-in fade-in">
              <div className="w-16 h-16 rounded-full bg-stone-900 border border-stone-700 flex items-center justify-center text-white mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">
                درخواست طراحی اختصاصی با موفقیت ثبت شد
              </h3>
              <p className="text-xs text-stone-300 max-w-md mx-auto leading-relaxed">
                جناب/سرکار <strong className="text-white">{fullName}</strong>، کارشناس ارشد آتلیه آموزگار جهت هماهنگی جلسه اسکچ و انتخاب گوهر با شما تماس خواهد گرفت.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-6 py-2.5 rounded-full bg-white text-black font-bold text-xs"
              >
                ثبت سفارش جدید
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 text-right">
              <div>
                <h3 className="text-lg font-bold text-white">
                  فرم آغاز پروژه سفارشی (Haute Bespoke Request)
                </h3>
                <p className="text-xs text-stone-400 mt-1">
                  مشخصات اثر رویایی خود را تعیین فرمایید تا جلسه طراحی مفهومی برنامه‌ریزی گردد:
                </p>
              </div>

              {/* Step 1: Category */}
              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-2">
                  ۱. نوع اثر مورد نظر:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'ring', label: 'انگشتر سولیتر / کوکتل' },
                    { id: 'necklace', label: 'گردنبند یا چوکر' },
                    { id: 'earrings', label: 'گوشواره آویز / میخی' },
                    { id: 'set', label: 'سرویس کامل اشرافی' },
                  ].map((c) => (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => setCategory(c.id)}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-medium transition-all ${
                        category === c.id
                          ? 'border-white bg-stone-900 text-white font-bold'
                          : 'border-stone-900 bg-black text-stone-400 hover:border-stone-700'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Gemstone */}
              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-2">
                  ۲. گوهر اصلی مد نظر:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'ruby', label: 'یاقوت سرخ برمه (Unheated)' },
                    { id: 'diamond', label: 'الماس برلیان D-Color' },
                    { id: 'emerald', label: 'زمرد سبز موزو کلمبیا' },
                    { id: 'sapphire', label: 'سافایر آبی سلطنتی سیلان' },
                  ].map((s) => (
                    <button
                      type="button"
                      key={s.id}
                      onClick={() => setStone(s.id)}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-medium transition-all ${
                        stone === s.id
                          ? 'border-white bg-stone-900 text-white font-bold'
                          : 'border-stone-900 bg-black text-stone-400 hover:border-stone-700'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Metal */}
              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-2">
                  ۳. فلز و آلیاژ بدنه:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'platinum', label: 'پلاتین ۹۵۰ عیار' },
                    { id: 'white_gold', label: 'طلای سفید ۱۸ عیار' },
                    { id: 'yellow_rose', label: 'طلای زرد / رزگلد ۱۸ عیار' },
                  ].map((m) => (
                    <button
                      type="button"
                      key={m.id}
                      onClick={() => setMetal(m.id)}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-medium transition-all ${
                        metal === m.id
                          ? 'border-white bg-stone-900 text-white font-bold'
                          : 'border-stone-900 bg-black text-stone-400 hover:border-stone-700'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 4: Description */}
              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1">
                  توضیحات و جزئیات مد نظر:
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="اگر سبک خاص، تراش هندسی ویژه یا مناسبتی مد نظرتان است بنویسید..."
                  className="w-full px-4 py-2.5 rounded-xl bg-black border border-stone-800 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-stone-500"
                />
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-stone-400 block mb-1">نام و نام خانوادگی:</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="نام کامل شما"
                    className="w-full px-4 py-2.5 rounded-xl bg-black border border-stone-800 text-xs text-stone-200 focus:outline-none focus:border-stone-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-stone-400 block mb-1">تلفن همراه جهت هماهنگی:</label>
                  <input
                    type="tel"
                    required
                    dir="ltr"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="۰۹۱۲..."
                    className="w-full px-4 py-2.5 rounded-xl bg-black border border-stone-800 text-xs text-stone-200 focus:outline-none focus:border-stone-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-white hover:bg-stone-200 text-black font-extrabold text-xs sm:text-sm tracking-wide transition-all shadow-xl"
              >
                ثبت و ارسال درخواست مشاوره طراحی اختصاصی
              </button>
            </form>
          )}
        </div>

      </div>
    </section>
  );
};
