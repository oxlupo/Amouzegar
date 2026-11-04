import React, { useMemo, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, MessageCircle, Phone } from 'lucide-react';
import { SALON_BRANCHES } from '../data/jewelryData';

interface BookingPageProps {
  onBack: () => void;
}

/* ------------------------------------------------------------------ */
/* Persian (Jalali) calendar helpers, built on Intl — no extra library */
/* ------------------------------------------------------------------ */

const partsFmt = new Intl.DateTimeFormat('en-US-u-ca-persian', { year: 'numeric', month: 'numeric', day: 'numeric' });
const monthNameFmt = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { month: 'long' });

const toPersianDigits = (value: number | string) =>
  String(value).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);

const WEEKDAY_NAMES = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'];

/** «یکشنبه ۱۷ آبان ۱۴۰۵», built by hand because browsers order these parts inconsistently. */
const formatLongDate = (date: Date) => {
  const { year, day } = persianParts(date);
  return `${WEEKDAY_NAMES[date.getDay()]} ${toPersianDigits(day)} ${monthNameFmt.format(date)} ${toPersianDigits(year)}`;
};

function persianParts(date: Date) {
  const parts = partsFmt.formatToParts(date);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value.replace(/\D/g, ''));
  return { year: get('year'), month: get('month'), day: get('day') };
}

interface CalendarDay {
  date: Date;
  day: number;
  /** 0 = Saturday … 6 = Friday (Iranian week). */
  weekIndex: number;
  disabled: boolean;
}

interface CalendarMonth {
  key: string;
  year: number;
  month: number;
  name: string;
  days: CalendarDay[];
  /** True when at least one day in the month can be booked. */
  bookable: boolean;
}

/** Fridays are closed, matching the gallery's opening hours. */
const CLOSED_WEEKDAY = 5; // JS getDay(): 5 = Friday

/** The current Persian month and the following eleven. */
function buildMonths(count = 12): CalendarMonth[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(today);
  start.setDate(start.getDate() - (persianParts(today).day - 1));

  const months: CalendarMonth[] = [];
  const cursor = new Date(start);
  while (months.length < count || persianParts(cursor).day !== 1) {
    const { year, month, day } = persianParts(cursor);
    if (day === 1) {
      if (months.length === count) break;
      months.push({ key: `${year}-${month}`, year, month, name: monthNameFmt.format(cursor), days: [], bookable: false });
    }
    const current = months[months.length - 1];
    const date = new Date(cursor);
    const disabled = date <= today || date.getDay() === CLOSED_WEEKDAY;
    current.days.push({ date, day, weekIndex: (date.getDay() + 1) % 7, disabled });
    if (!disabled) current.bookable = true;
    cursor.setDate(cursor.getDate() + 1);
  }
  return months;
}

const WEEKDAYS = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];

/** Visit windows inside the gallery's opening hours (9:30–14:00 and 17:00–21:30). */
const TIME_SLOTS = [
  { id: '10:00-12:00', label: '۱۰ تا ۱۲', part: 'صبح' },
  { id: '12:00-14:00', label: '۱۲ تا ۱۴', part: 'ظهر' },
  { id: '17:00-19:00', label: '۱۷ تا ۱۹', part: 'عصر' },
  { id: '19:00-21:00', label: '۱۹ تا ۲۱', part: 'شب' },
];

/* ------------------------------------------------------------------ */

export const BookingPage: React.FC<BookingPageProps> = ({ onBack }) => {
  const gallery = SALON_BRANCHES[0];
  const months = useMemo(() => buildMonths(12), []);

  const [openMonthKey, setOpenMonthKey] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [timeSlot, setTimeSlot] = useState<string | null>(null);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [showErrors, setShowErrors] = useState(false);
  const [sent, setSent] = useState(false);

  const openMonth = months.find((m) => m.key === openMonthKey) ?? null;
  const openMonthIndex = openMonth ? months.indexOf(openMonth) : -1;
  const slot = TIME_SLOTS.find((s) => s.id === timeSlot);

  const missing = {
    date: !selectedDate,
    time: !timeSlot,
    name: !fullName.trim(),
    phone: phone.replace(/\D/g, '').length < 10,
  };
  const isValid = !Object.values(missing).some(Boolean);

  const whatsappHref = () => {
    const lines = [
      'درود، درخواست رزرو وقت بازدید از گالری آموزگار دارم.',
      `نام: ${fullName.trim()}`,
      `تلفن: ${phone.trim()}`,
      selectedDate ? `تاریخ: ${formatLongDate(selectedDate)}` : '',
      slot ? `ساعت: ${slot.label} (${slot.part})` : '',
      note.trim() ? `توضیحات: ${note.trim()}` : '',
    ].filter(Boolean);
    return `https://wa.me/${gallery.telLink.replace(/\D/g, '')}?text=${encodeURIComponent(lines.join('\n'))}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) {
      setShowErrors(true);
      return;
    }
    window.open(whatsappHref(), '_blank', 'noopener,noreferrer');
    setSent(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fieldError = (key: keyof typeof missing) => showErrors && missing[key];

  return (
    <div dir="rtl" className="min-h-screen bg-black text-stone-100 font-peyda pt-[69px]">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowRight className="w-3.5 h-3.5" />
          <span>بازگشت</span>
        </button>

        <header className="mt-6 max-w-2xl">
          <h1 className="text-2xl sm:text-4xl font-bold text-white leading-tight">رزرو وقت بازدید از گالری آموزگار</h1>
          <p className="mt-3 text-sm text-stone-400 leading-relaxed">
            روز و ساعت دلخواهتان را انتخاب کنید تا آثار مورد نظرتان پیش از حضور شما آماده شوند.
          </p>
          <p className="mt-2 text-xs text-stone-500">{gallery.addressFa}</p>
        </header>

        {sent ? (
          <div className="mt-10 border border-stone-800 p-8 max-w-xl">
            <h2 className="text-xl font-bold text-white">درخواست شما آمادهٔ ارسال است</h2>
            <p className="mt-3 text-sm text-stone-300 leading-relaxed">
              {fullName.trim()} عزیز، پیام درخواست رزرو برای{' '}
              <span className="text-white">{selectedDate && formatLongDate(selectedDate)}</span>
              {slot && <>، ساعت {slot.label}</>} در واتساپ باز شد. پس از ارسال پیام، همکاران گالری برای تأیید وقت
              با شما تماس می‌گیرند.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={whatsappHref()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black text-sm font-bold hover:bg-stone-200 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>باز کردن دوبارهٔ واتساپ</span>
              </a>
              <a
                href={`tel:${gallery.telLink}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-stone-700 text-sm font-bold text-stone-200 hover:border-white hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>تماس با گالری</span>
              </a>
              <button
                type="button"
                onClick={onBack}
                className="px-5 py-2.5 text-sm font-bold text-stone-400 hover:text-white transition-colors cursor-pointer"
              >
                بازگشت به سایت
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="mt-10 grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-14">
            {/* ---------------- Date picker: months first, then days ---------------- */}
            <section aria-labelledby="date-title">
              <div className="flex items-baseline justify-between">
                <h2 id="date-title" className="text-sm font-bold text-white">۱. انتخاب روز</h2>
                {selectedDate && <span className="text-xs text-stone-300">{formatLongDate(selectedDate)}</span>}
              </div>

              <div
                className={`mt-4 border p-4 sm:p-5 min-h-[340px] overflow-hidden ${
                  fieldError('date') ? 'border-rose-800' : 'border-stone-800'
                }`}
              >
                {!openMonth ? (
                  <div key="months" className="animate-picker-back">
                    <p className="text-xs text-stone-500 mb-4">ماه مورد نظر را انتخاب کنید</p>
                    <div className="grid grid-cols-3 gap-2">
                      {months.map((m) => {
                        const hasSelection =
                          selectedDate && persianParts(selectedDate).year === m.year && persianParts(selectedDate).month === m.month;
                        return (
                          <button
                            key={m.key}
                            type="button"
                            disabled={!m.bookable}
                            onClick={() => setOpenMonthKey(m.key)}
                            className={`py-4 px-2 border text-center transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-30 ${
                              hasSelection
                                ? 'border-white bg-white text-black'
                                : 'border-stone-800 text-stone-200 hover:border-stone-500 hover:bg-stone-950'
                            }`}
                          >
                            <span className="block text-sm font-bold">{m.name}</span>
                            <span className={`block text-[11px] mt-1 ${hasSelection ? 'text-stone-600' : 'text-stone-500'}`}>
                              {toPersianDigits(m.year)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div key={openMonth.key} className="animate-picker-in">
                    <div className="flex items-center justify-between mb-4">
                      <button
                        type="button"
                        onClick={() => setOpenMonthKey(null)}
                        className="text-xs text-stone-400 hover:text-white transition-colors cursor-pointer"
                      >
                        همهٔ ماه‌ها
                      </button>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          aria-label="ماه قبل"
                          disabled={openMonthIndex <= 0}
                          onClick={() => setOpenMonthKey(months[openMonthIndex - 1].key)}
                          className="p-1.5 text-stone-400 hover:text-white disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-bold text-white min-w-24 text-center">
                          {openMonth.name} {toPersianDigits(openMonth.year)}
                        </span>
                        <button
                          type="button"
                          aria-label="ماه بعد"
                          disabled={openMonthIndex >= months.length - 1}
                          onClick={() => setOpenMonthKey(months[openMonthIndex + 1].key)}
                          className="p-1.5 text-stone-400 hover:text-white disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-stone-500 mb-1" aria-hidden="true">
                      {WEEKDAYS.map((w) => (
                        <span key={w} className="py-1">{w}</span>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1" role="grid" aria-label={`روزهای ${openMonth.name}`}>
                      {Array.from({ length: openMonth.days[0].weekIndex }).map((_, i) => (
                        <span key={`pad-${i}`} />
                      ))}
                      {openMonth.days.map((d, i) => {
                        const isSelected = selectedDate?.getTime() === d.date.getTime();
                        return (
                          <button
                            key={d.day}
                            type="button"
                            disabled={d.disabled}
                            onClick={() => setSelectedDate(d.date)}
                            aria-pressed={isSelected}
                            aria-label={formatLongDate(d.date)}
                            style={{ animationDelay: `${Math.min(i, 30) * 12}ms` }}
                            className={`animate-day-in aspect-square text-sm transition-colors cursor-pointer disabled:cursor-not-allowed ${
                              isSelected
                                ? 'bg-white text-black font-bold'
                                : d.disabled
                                  ? 'text-stone-700'
                                  : 'text-stone-200 hover:bg-stone-900'
                            }`}
                          >
                            {toPersianDigits(d.day)}
                          </button>
                        );
                      })}
                    </div>
                    <p className="mt-3 text-[11px] text-stone-500">جمعه‌ها گالری تعطیل است.</p>
                  </div>
                )}
              </div>
              {fieldError('date') && <p className="mt-2 text-xs text-rose-400">لطفاً روز بازدید را انتخاب کنید.</p>}
            </section>

            {/* ---------------- Time and contact details ---------------- */}
            <div className="space-y-8">
              <section aria-labelledby="time-title">
                <h2 id="time-title" className="text-sm font-bold text-white">۲. انتخاب ساعت</h2>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {TIME_SLOTS.map((s) => {
                    const isActive = timeSlot === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setTimeSlot(s.id)}
                        aria-pressed={isActive}
                        className={`py-3 border text-center transition-colors cursor-pointer ${
                          isActive
                            ? 'border-white bg-white text-black'
                            : `${fieldError('time') ? 'border-rose-800' : 'border-stone-800'} text-stone-200 hover:border-stone-500`
                        }`}
                      >
                        <span className="block text-sm font-bold">{s.label}</span>
                        <span className={`block text-[11px] mt-0.5 ${isActive ? 'text-stone-600' : 'text-stone-500'}`}>{s.part}</span>
                      </button>
                    );
                  })}
                </div>
                {fieldError('time') && <p className="mt-2 text-xs text-rose-400">لطفاً ساعت بازدید را انتخاب کنید.</p>}
              </section>

              <section aria-labelledby="contact-title" className="space-y-4">
                <h2 id="contact-title" className="text-sm font-bold text-white">۳. مشخصات شما</h2>
                <label className="block">
                  <span className="text-xs text-stone-400">نام و نام خانوادگی</span>
                  <input
                    type="text"
                    autoComplete="name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={`mt-1.5 w-full px-3.5 py-3 bg-black border text-sm text-white focus:outline-none focus:border-stone-400 ${
                      fieldError('name') ? 'border-rose-800' : 'border-stone-800'
                    }`}
                  />
                  {fieldError('name') && <span className="mt-1 block text-xs text-rose-400">لطفاً نام خود را وارد کنید.</span>}
                </label>
                <label className="block">
                  <span className="text-xs text-stone-400">تلفن همراه</span>
                  <input
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    dir="ltr"
                    placeholder="0912 000 0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`mt-1.5 w-full px-3.5 py-3 bg-black border text-sm text-white text-right placeholder:text-stone-700 focus:outline-none focus:border-stone-400 ${
                      fieldError('phone') ? 'border-rose-800' : 'border-stone-800'
                    }`}
                  />
                  {fieldError('phone') && <span className="mt-1 block text-xs text-rose-400">شمارهٔ تلفن کامل نیست.</span>}
                </label>
                <label className="block">
                  <span className="text-xs text-stone-400">توضیحات (اختیاری)</span>
                  <textarea
                    rows={3}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="مثلاً اثری که می‌خواهید ببینید"
                    className="mt-1.5 w-full px-3.5 py-3 bg-black border border-stone-800 text-sm text-white placeholder:text-stone-700 focus:outline-none focus:border-stone-400 resize-none"
                  />
                </label>
              </section>

              <div>
                <button
                  type="submit"
                  className="w-full py-4 bg-white hover:bg-stone-200 text-black text-sm font-bold transition-colors cursor-pointer"
                >
                  درخواست رزرو
                </button>
                <p className="mt-3 text-[11px] text-stone-500 leading-relaxed">
                  درخواست شما در واتساپ برای گالری فرستاده می‌شود و وقت پس از تماس همکاران ما قطعی می‌شود.
                </p>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
