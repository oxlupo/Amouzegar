import React, { useState } from 'react';
import { X, Clock, MapPin, CheckCircle2, Sparkles } from 'lucide-react';
import { SALON_BRANCHES } from '../data/jewelryData';

interface VipBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VipBookingModal: React.FC<VipBookingModalProps> = ({ isOpen, onClose }) => {
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('16:00 - 18:00');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) return;
    setIsSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
      <div 
        className="relative w-full max-w-lg bg-[#050505] border border-stone-800 rounded-2xl p-6 sm:p-8 text-stone-100 shadow-2xl shadow-black max-h-[90vh] overflow-y-auto"
        id="vip-booking-modal"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-900"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-8 space-y-4 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-stone-900 border border-stone-700 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">
              وقت اختصاصی شما رزرو گردید
            </h3>
            <p className="text-xs text-stone-300 leading-relaxed max-w-sm mx-auto">
              جناب/سرکار <strong className="text-white">{fullName}</strong>، هماهنگی‌های لازم جهت پذیرایی خصوصی و آماده‌سازی کلکسیون‌های مد نظرتان در سالن آموزگار انجام شد. همکاران تشریفات ما به زودی با شما تماس خواهند گرفت.
            </p>
            <button
              onClick={() => {
                setIsSuccess(false);
                onClose();
              }}
              className="mt-4 px-6 py-2.5 rounded-full bg-white text-black font-bold text-xs"
            >
              متشکرم، بستن پنجره
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 text-right">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-stone-900 border border-stone-800 text-stone-300 text-[11px] font-semibold mb-2">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>پذیرایی VIP و پرو اختصاصی</span>
              </div>
              <h3 className="text-xl font-extrabold text-white">
                رزرو وقت بازدید خصوصی از کاتالوگ آموزگار
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                مشاهده و پرو کلکسیون‌ها در سالن اختصاصی و محرمانه با حضور کارشناس ارشد گوهرشناسی
              </p>
            </div>

            {/* Gallery (single location) */}
            <div className="p-3 rounded-xl border border-stone-800 bg-stone-950 text-right">
              {SALON_BRANCHES.map((b) => (
                <div key={b.id}>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white mb-1">
                    <MapPin className="w-3.5 h-3.5 text-stone-300" />
                    <span>{b.nameFa}</span>
                  </div>
                  <span className="text-[11px] text-stone-400 block">{b.addressFa}</span>
                </div>
              ))}
            </div>

            {/* Date & Time Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-stone-400 block mb-1">تاریخ مورد نظر:</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black border border-stone-800 text-xs text-stone-200 focus:outline-none focus:border-stone-500"
                />
              </div>

              <div>
                <label className="text-xs text-stone-400 block mb-1">ساعت اختصاصی:</label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black border border-stone-800 text-xs text-stone-200 focus:outline-none focus:border-stone-500"
                >
                  <option value="11:00 - 13:00">۱۱:۰۰ الی ۱۳:۰۰ (صبح)</option>
                  <option value="14:00 - 16:00">۱۴:۰۰ الی ۱۶:۰۰ (نیمروز)</option>
                  <option value="16:00 - 18:00">۱۶:۰۰ الی ۱۸:۰۰ (عصر)</option>
                  <option value="18:30 - 20:30">۱۸:۳۰ الی ۲۰:۳۰ (غروب و شب)</option>
                </select>
              </div>
            </div>

            {/* Full Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-stone-400 block mb-1">نام و نام خانوادگی:</label>
                <input
                  type="text"
                  required
                  placeholder="نام کامل شما"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black border border-stone-800 text-xs text-stone-200 focus:outline-none focus:border-stone-500"
                />
              </div>

              <div>
                <label className="text-xs text-stone-400 block mb-1">تلفن همراه:</label>
                <input
                  type="tel"
                  required
                  placeholder="۰۹۱۲..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black border border-stone-800 text-xs text-stone-200 focus:outline-none focus:border-stone-500"
                  dir="ltr"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-white hover:bg-stone-200 text-black font-extrabold text-xs sm:text-sm tracking-wide transition-all mt-2"
            >
              تایید و ثبت نهایی سانس اختصاصی
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
