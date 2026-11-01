import React from 'react';
import { X, Heart, Trash2, Eye, Clock, Sparkles } from 'lucide-react';
import { JewelryItem } from '../types';
import { toPersianDigits } from '../utils/formatters';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: JewelryItem[];
  onRemoveItem: (id: string) => void;
  onSelectItem: (item: JewelryItem) => void;
  onOpenVipBooking: () => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onSelectItem,
  onOpenVipBooking,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div 
        className="fixed inset-y-0 left-0 max-w-full flex pl-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-screen max-w-md bg-[#050505] border-r border-stone-800 text-stone-100 flex flex-col shadow-2xl">
          
          {/* Header */}
          <div className="p-5 border-b border-stone-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              <h3 className="font-bold text-sm text-white">
                آثار نشان‌شده در کاتالوگ ({toPersianDigits(items.length)})
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-900"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {items.length === 0 ? (
              <div className="text-center py-20 space-y-3">
                <Sparkles className="w-8 h-8 text-stone-700 mx-auto" />
                <p className="text-stone-400 text-xs">
                  هنوز اثری را به فهرست نشان‌شده‌های خود اضافه نکرده‌اید.
                </p>
                <p className="text-stone-500 text-[11px]">
                  با کلیک بر روی آیکون قلب روی هر اثر در کاتالوگ، می‌توانید آن را اینجا نگه دارید تا در جلسه پرو به همراه داشته باشید.
                </p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-black border border-stone-900 flex gap-3 items-center justify-between group hover:border-stone-700 transition-all"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.nameFa}
                    className="w-16 h-16 rounded-lg object-cover border border-stone-800 shrink-0 cursor-pointer"
                    onClick={() => {
                      onSelectItem(item);
                      onClose();
                    }}
                    referrerPolicy="no-referrer"
                  />

                  <div className="flex-1 min-w-0 text-right">
                    <span className="text-[10px] font-mono text-stone-500 block">
                      {item.itemCode}
                    </span>
                    <h4 
                      onClick={() => {
                        onSelectItem(item);
                        onClose();
                      }}
                      className="text-xs font-bold text-stone-200 hover:text-white transition-colors truncate cursor-pointer"
                    >
                      {item.nameFa}
                    </h4>
                    <span className="text-[11px] text-stone-400 block mt-0.5">
                      {item.stoneNameFa} ({toPersianDigits(item.caratTotal)} قیراط)
                    </span>
                    <span className="text-[10px] text-emerald-400 block mt-0.5">
                      {item.availability}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="p-1.5 text-stone-500 hover:text-rose-400 transition-colors"
                      title="حذف از لیست"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        onSelectItem(item);
                        onClose();
                      }}
                      className="p-1.5 text-stone-400 hover:text-white transition-colors"
                      title="مشاهده جزئیات"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-5 border-t border-stone-900 bg-black space-y-3">
              <button
                onClick={() => {
                  onClose();
                  onOpenVipBooking();
                }}
                className="w-full py-3.5 rounded-xl bg-white hover:bg-stone-200 text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-xl transition-all"
              >
                <Clock className="w-4 h-4" />
                <span>رزرو سانس اختصاصی جهت پرو این آثار</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
