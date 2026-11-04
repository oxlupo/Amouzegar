import React, { useState } from 'react';
import { 
  Lock, 
  ArrowRight, 
  Plus, 
  Upload, 
  Check, 
  Trash2, 
  ExternalLink, 
  LogOut,
  Image as ImageIcon,
  Crop as CropIcon
} from 'lucide-react';
import { ImageCropperModal } from './ImageCropperModal';
import { JewelryItem } from '../types';

interface AdminPanelProps {
  onAddJewelry: (item: JewelryItem) => void;
  onDeleteJewelry: (id: string) => void;
  jewelryItems: JewelryItem[];
  onExit: () => void;
  onViewProduct: (item: JewelryItem) => void;
}

const CATEGORY_OPTIONS = [
  { id: 'ring', labelFa: 'انگشتر (Ring)' },
  { id: 'necklace', labelFa: 'گردنبند (Necklace)' },
  { id: 'earrings', labelFa: 'گوشواره (Earrings)' },
  { id: 'bracelet', labelFa: 'دستبند (Bracelet)' },
  { id: 'set', labelFa: 'سرویس سلطنتی (Parure / Set)' },
] as const;

export const AVAILABLE_STONES_AND_CUTS = [
  'سنگ‌های رنگی مصنوعی',
  'زمرد',
  'یاقوت',
  'زیرکن',
  'الماس',
  'برلیان',
  'باگت',
  'مارکیز',
  'پرنسس کات',
  'امرالد کات',
  'اشک برلیان',
  'الماس‌های تراش فنسی (فانتزی)',
  'کوشن کات',
  'رادیانت',
] as const;

const CERTIFICATE_ISSUERS = ['GIA', 'HRD', 'IGI', 'Amuzegar Atelier'] as const;

export const AdminPanel: React.FC<AdminPanelProps> = ({
  onAddJewelry,
  onDeleteJewelry,
  jewelryItems,
  onExit,
  onViewProduct,
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('amuzegar_admin_auth') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState(false);

  // Form State
  const [nameFa, setNameFa] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [category, setCategory] = useState<'ring' | 'necklace' | 'earrings' | 'bracelet' | 'set'>('ring');
  
  // Gold Net Weight (وزن خالص طلا - رنگ طلا مهم نیست)
  const [goldNetWeight, setGoldNetWeight] = useState<string>('6.50');

  // Stones and Cuts (سنگ‌ها و تراش‌ها)
  const [selectedStones, setSelectedStones] = useState<string[]>(['الماس', 'برلیان']);
  const [customStoneNote, setCustomStoneNote] = useState<string>('');

  const [caratTotal, setCaratTotal] = useState<string>('2.5');
  const [caratMainStone, setCaratMainStone] = useState<string>('1.2');
  const [clarity, setClarity] = useState('VVS1 - بی‌نقص و پاک');
  const [originFa, setOriginFa] = useState('آنتورپ / بلژیک');
  const [certificateNumber, setCertificateNumber] = useState('GIA-62048192');
  const [certificateIssuer, setCertificateIssuer] = useState<'GIA' | 'HRD' | 'IGI' | 'Amuzegar Atelier'>('GIA');
  const [descriptionFa, setDescriptionFa] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [itemCode, setItemCode] = useState(() => `AMZ-${Math.floor(1000 + Math.random() * 9000)}`);
  const [availability, setAvailability] = useState<'موجود در گالری احمدآباد' | 'تک‌نسخه آتلیه آموزگار'>('تک‌نسخه آتلیه آموزگار');

  // Image Cropper State
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);

  // Feedback State
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === '123456') {
      setIsAuthenticated(true);
      sessionStorage.setItem('amuzegar_admin_auth', 'true');
      setAuthError(false);
    } else {
      setAuthError(true);
      setPasswordInput('');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('amuzegar_admin_auth');
    setIsAuthenticated(false);
  };

  // Image file picker with automatic 1:1 scale cropper launch
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setCropImageSrc(reader.result);
          setIsCropperOpen(true);
        }
      };
      reader.readAsDataURL(file);
    }
    // Reset file input so picking the same image triggers again
    e.target.value = '';
  };

  const handleCropComplete = (croppedDataUrl: string) => {
    setImageUrl(croppedDataUrl);
    setIsCropperOpen(false);
    setCropImageSrc(null);
  };

  const handleCropCancel = () => {
    setIsCropperOpen(false);
    setCropImageSrc(null);
  };

  // Submit new jewelry item
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameFa.trim()) return;

    const stonesListText = selectedStones.length > 0
      ? selectedStones.join('، ') + (customStoneNote.trim() ? ` (${customStoneNote.trim()})` : '')
      : customStoneNote.trim() || 'سنگ‌های قیمتی شناسنامه‌دار';

    const cleanGoldWeight = goldNetWeight.trim() || '—';

    // Primary stone categorization
    let primaryStoneType: 'diamond' | 'ruby' | 'emerald' | 'sapphire' = 'diamond';
    if (selectedStones.includes('زمرد')) primaryStoneType = 'emerald';
    else if (selectedStones.includes('یاقوت')) primaryStoneType = 'ruby';

    const newItem: JewelryItem = {
      id: `custom-${Date.now()}`,
      itemCode: itemCode.trim() || `AMZ-${Date.now().toString().slice(-4)}`,
      nameFa: nameFa.trim(),
      nameEn: nameEn.trim() || 'Amuzegar High Jewelry Creation',
      category,
      stoneType: primaryStoneType,
      stoneNameFa: stonesListText,
      selectedStones: selectedStones.length > 0 ? selectedStones : [stonesListText],
      goldNetWeight: cleanGoldWeight,
      caratTotal: parseFloat(caratTotal) || 0,
      caratMainStone: parseFloat(caratMainStone) || 0,
      clarity: clarity.trim() || 'VVS1',
      cutTypeFa: selectedStones.filter((s) => s.includes('کات') || s.includes('تراش') || s.includes('باگت') || s.includes('مارکیز') || s.includes('برلیان') || s.includes('اشک')).join(' و ') || 'تراش برلیان و مهندسی دقیق',
      cutTypeEn: 'Fine High Jewelry Cut',
      metalFa: `طلای ۱۸ عیار استاندارد (وزن خالص: ${cleanGoldWeight} گرم)`,
      metalEn: `18K Gold (Net Weight: ${cleanGoldWeight}g)`,
      originFa: originFa.trim() || 'آتلیه آموزگار',
      certificateNumber: certificateNumber.trim() || `AMZ-${Date.now().toString().slice(-6)}`,
      certificateIssuer,
      descriptionFa: descriptionFa.trim() || `اثری فاخر از آتلیه آموزگار با طلای ۱۸ عیار به وزن خالص ${cleanGoldWeight} گرم و سنگ‌های ${stonesListText}.`,
      imageUrl: imageUrl.trim() || '/stop2-rings.jpg',
      additionalImages: imageUrl.trim() ? [imageUrl.trim()] : [],
      isMasterpiece: true,
      tagsFa: ['شاهکار آتلیه', categoryNameFa(category), ...selectedStones],
      availability,
    };

    onAddJewelry(newItem);
    setSuccessNotice(`اثر «${newItem.nameFa}» با موفقیت ذخیره و به کاتالوگ افزوده شد.`);
    setTimeout(() => setSuccessNotice(null), 4000);

    // Reset Form
    setNameFa('');
    setNameEn('');
    setDescriptionFa('');
    setImageUrl('');
    setCustomStoneNote('');
    setItemCode(`AMZ-${Math.floor(1000 + Math.random() * 9000)}`);
  };

  function categoryNameFa(cat: string) {
    const map: Record<string, string> = {
      ring: 'انگشتر',
      necklace: 'گردنبند',
      earrings: 'گوشواره',
      bracelet: 'دستبند',
      set: 'سرویس سلطنتی',
    };
    return map[cat] || 'جواهرات';
  }

  // Filter recently added / custom items
  const customItems = jewelryItems.filter((i) => i.id.startsWith('custom-'));

  // 1. Minimal Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white font-peyda flex flex-col justify-between p-6 sm:p-12 select-none">
        
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={onExit}
            className="text-xs text-stone-400 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowRight className="w-4 h-4 stroke-[1.5]" />
            <span>بازگشت به سایت</span>
          </button>
          <span className="font-grotesk text-[11px] text-stone-600 tracking-widest uppercase">
            ATELIER ADMIN ACCESS
          </span>
        </div>

        {/* Center Minimal Authentication Card */}
        <div className="max-w-xs sm:max-w-sm w-full mx-auto my-auto space-y-6 text-center">
          
          <div className="space-y-2">
            <div className="w-10 h-10 mx-auto rounded-full border border-stone-800 flex items-center justify-center text-stone-400 mb-4">
              <Lock className="w-4 h-4 stroke-[1.5]" />
            </div>
            <h1 className="text-lg font-bold text-white tracking-wide">
              ورود به پنل مدیریت آتلیه
            </h1>
            <p className="text-xs text-stone-500 font-light">
              جهت افزودن و مدیریت آثار جواهرات آموزگار رمز عبور را وارد نمایید
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-3">
            <input
              type="password"
              placeholder="رمز عبور..."
              value={passwordInput}
              onChange={(e) => {
                setPasswordInput(e.target.value);
                setAuthError(false);
              }}
              autoFocus
              className={`w-full px-4 py-3 rounded-xl bg-stone-950 border text-center text-sm tracking-widest focus:outline-none transition-colors ${
                authError ? 'border-stone-500 text-stone-300' : 'border-stone-800 text-white focus:border-stone-400'
              }`}
            />

            {authError && (
              <p className="text-[11px] text-stone-400">
                رمز عبور نادرست است. لطفاً مجدداً امتحان کنید.
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-white hover:bg-stone-200 text-black font-bold text-xs tracking-wide transition-all active:scale-[0.99] cursor-pointer"
            >
              ورود به پنل
            </button>
          </form>

        </div>

        {/* Bottom footer note */}
        <div className="text-center text-[11px] text-stone-700">
          Amuzegar High Jewelry Atelier • Internal Management
        </div>

      </div>
    );
  }

  // 2. Minimalist Admin Panel (Black & White / Monochrome with No Colored Icons)
  return (
    <div className="min-h-screen bg-black text-stone-200 font-peyda selection:bg-stone-800 selection:text-white pb-24">
      
      {/* Top Monochrome Bar */}
      <header className="border-b border-stone-800/80 bg-black/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            <button
              onClick={onExit}
              className="text-xs text-stone-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
              title="مشاهده سایت"
            >
              <ArrowRight className="w-4 h-4 stroke-[1.5]" />
              <span>مشاهده و بازگشت به سایت</span>
            </button>
            <span className="text-stone-700">|</span>
            <span className="text-xs font-bold text-white tracking-wide">
              مدیریت آثار جواهر
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-stone-500 font-grotesk hidden sm:inline">
              TOTAL: {jewelryItems.length} PIECES
            </span>
            <button
              onClick={handleLogout}
              className="text-xs text-stone-400 hover:text-white p-2 rounded-lg border border-stone-800 hover:border-stone-700 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="خروج از حساب"
            >
              <LogOut className="w-3.5 h-3.5 stroke-[1.5]" />
              <span className="hidden sm:inline">خروج</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 space-y-10">
        
        {/* Success Notice */}
        {successNotice && (
          <div className="p-4 rounded-xl border border-stone-700 bg-stone-900 text-stone-200 text-xs flex items-center gap-2.5 animate-in fade-in">
            <Check className="w-4 h-4 stroke-[2] text-stone-300 shrink-0" />
            <span className="font-medium">{successNotice}</span>
          </div>
        )}

        {/* Section: Add New Jewelry (تنها بخش پنل مطابق درخواست کاربر) */}
        <section className="space-y-6">
          
          <div className="border-b border-stone-800/80 pb-4">
            <h2 className="text-lg font-bold text-white tracking-wide">
              افزودن جواهر جدید به کاتالوگ
            </h2>
            <p className="text-xs text-stone-500 font-light mt-1">
              مشخصات و تصویر اثر را وارد نمایید تا به صفحه دسته‌بندی‌ها و گالری افزوده شود
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* 1. Name & English Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-stone-400 block">
                  نام اثر به فارسی *
                </label>
                <input
                  type="text"
                  placeholder="مثال: انگشتر سولیتر برلیان و زمرد کلمبیا"
                  value={nameFa}
                  onChange={(e) => setNameFa(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-stone-400 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-stone-400 block font-grotesk">
                  NAME IN ENGLISH
                </label>
                <input
                  type="text"
                  placeholder="e.g. Solitaire Emerald Cut Diamond Ring"
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  dir="ltr"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-stone-400 transition-colors font-grotesk"
                />
              </div>
            </div>

            {/* 2. Category & Item Code */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-stone-400 block">
                  دسته‌بندی اثر *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:outline-none focus:border-stone-400 transition-colors"
                >
                  {CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat.id} value={cat.id} className="bg-stone-950 text-white">
                      {cat.labelFa}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-stone-400 block font-grotesk">
                  ITEM CODE (کد اختصاصی اثر)
                </label>
                <input
                  type="text"
                  value={itemCode}
                  onChange={(e) => setItemCode(e.target.value)}
                  dir="ltr"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-stone-400 transition-colors font-grotesk"
                />
              </div>
            </div>

            {/* 3. Image Selection: URL or Upload */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-stone-400 block">
                تصویر اثر جواهر *
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                
                {/* URL Input */}
                <div className="sm:col-span-8">
                  <input
                    type="text"
                    placeholder="آدرس اینترنتی تصویر (یا بارگذاری فایل از دکمه مقابل)..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    dir="ltr"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-stone-400 transition-colors font-grotesk"
                  />
                </div>

                {/* File Upload Trigger */}
                <div className="sm:col-span-4">
                  <label className="w-full py-2.5 px-3 rounded-xl border border-stone-800 bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white text-xs font-medium flex items-center justify-center gap-2 cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5 stroke-[1.5]" />
                    <span>بارگذاری از دستگاه</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </label>
                </div>

              </div>

              {/* Image Preview Box */}
              {imageUrl && (
                <div className="mt-2 p-3 rounded-xl border border-stone-800 bg-stone-950 flex items-center gap-3">
                  <div className="w-14 h-14 rounded-lg overflow-hidden border border-stone-800 bg-black shrink-0 flex items-center justify-center">
                    <img
                      src={imageUrl}
                      alt="پیش‌نمایش اثر"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-stone-200 font-medium">
                        پیش‌نمایش تصویر (مقیاس ۱:۱ وب‌سایت)
                      </span>
                      <span className="text-[10px] font-grotesk px-1.5 py-0.5 rounded border border-stone-800 bg-stone-900 text-stone-400">
                        1:1 SQUARE
                      </span>
                    </div>
                    <span className="text-[11px] text-stone-500 font-grotesk truncate block mt-0.5">
                      {imageUrl.slice(0, 48)}...
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setCropImageSrc(imageUrl);
                        setIsCropperOpen(true);
                      }}
                      className="text-xs px-2.5 py-1.5 rounded-lg border border-stone-800 hover:border-stone-700 bg-stone-900 text-stone-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                      title="کراپ و تنظیم مجدد کادر"
                    >
                      <CropIcon className="w-3.5 h-3.5 text-stone-400 stroke-[1.5]" />
                      <span className="hidden sm:inline">برش و کادر ۱:۱</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="text-stone-500 hover:text-stone-300 p-1.5 transition-colors cursor-pointer rounded-lg hover:bg-stone-900"
                      title="حذف تصویر"
                    >
                      <Trash2 className="w-3.5 h-3.5 stroke-[1.5]" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 4. Gold Net Weight (وزن خالص طلا - رنگ طلا مهم نیست) */}
            <div className="p-4 rounded-xl border border-stone-800 bg-stone-950 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white block">
                  وزن خالص طلا (گرم) *
                </label>
                <span className="text-[11px] text-stone-500 font-light">
                  رنگ طلا اهمیتی ندارد
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="مثال: 6.85"
                  value={goldNetWeight}
                  onChange={(e) => setGoldNetWeight(e.target.value)}
                  required
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-black border border-stone-800 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-stone-400 transition-colors font-grotesk"
                />
                <span className="text-xs font-grotesk px-3.5 py-2.5 bg-stone-900 border border-stone-800 rounded-xl text-stone-300 shrink-0">
                  گرم (gr)
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-light">
                وزن خالص طلای ۱۸ عیار پایه محاسبه و ارزش‌گذاری اثر است و رنگ طلا (سفید، زرد، رزگلد) تأثیری در آن ندارد.
              </p>
            </div>

            {/* 5. Stones & Cuts (سنگ‌ها و تراش‌ها مطابق لیست اختصاصی) */}
            <div className="p-4 rounded-xl border border-stone-800 bg-stone-950 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-white block">
                    سنگ‌ها و تراش‌های به کار رفته در اثر *
                  </label>
                  <p className="text-[11px] text-stone-500 font-light mt-0.5">
                    سنگ‌ها یا تراش‌های موجود در اثر را با کلیک انتخاب نمایید:
                  </p>
                </div>
                <span className="text-[11px] text-stone-400 font-grotesk">
                  {selectedStones.length} انتخاب شده
                </span>
              </div>

              {/* Chips Grid */}
              <div className="flex flex-wrap gap-2 pt-1">
                {AVAILABLE_STONES_AND_CUTS.map((stone) => {
                  const isSelected = selectedStones.includes(stone);
                  return (
                    <button
                      key={stone}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          setSelectedStones(selectedStones.filter((s) => s !== stone));
                        } else {
                          setSelectedStones([...selectedStones, stone]);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-white text-black font-bold shadow-sm'
                          : 'bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white border border-stone-800'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                      <span>{stone}</span>
                    </button>
                  );
                })}
              </div>

              {/* Custom Stone / Cut Note */}
              <div className="pt-1">
                <input
                  type="text"
                  placeholder="سایر سنگ‌ها یا توضیحات بیشتر تراش (اختیاری)..."
                  value={customStoneNote}
                  onChange={(e) => setCustomStoneNote(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg bg-black border border-stone-800 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-stone-400 transition-colors"
                />
              </div>
            </div>

            {/* 5. Carats & Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-stone-400 block">
                  وزن کل (قیراط)
                </label>
                <input
                  type="text"
                  placeholder="مثال: 5.4"
                  value={caratTotal}
                  onChange={(e) => setCaratTotal(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-stone-400 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-stone-400 block">
                  وزن سنگ مرکزی (قیراط)
                </label>
                <input
                  type="text"
                  placeholder="مثال: 3.2"
                  value={caratMainStone}
                  onChange={(e) => setCaratMainStone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-stone-400 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-stone-400 block">
                  مرجع شناسنامه
                </label>
                <select
                  value={certificateIssuer}
                  onChange={(e) => setCertificateIssuer(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:outline-none focus:border-stone-400 transition-colors font-grotesk"
                >
                  {CERTIFICATE_ISSUERS.map((iss) => (
                    <option key={iss} value={iss} className="bg-stone-950 text-white font-grotesk">
                      {iss}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 6. Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-stone-400 block">
                توضیحات و کانسپت اثر
              </label>
              <textarea
                rows={3}
                placeholder="توضیحات اختصاصی آتلیه در خصوص گوهرها، نحوه مخراج‌کاری و ویژگی‌های اثر..."
                value={descriptionFa}
                onChange={(e) => setDescriptionFa(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-stone-400 transition-colors resize-none"
              />
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-white hover:bg-stone-200 text-black font-bold text-xs tracking-wide transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4 stroke-[2]" />
                <span>ثبت و افزودن اثر به کاتالوگ</span>
              </button>
            </div>

          </form>

        </section>

        {/* Section: Recently Added Custom Items (if any) */}
        {customItems.length > 0 && (
          <section className="space-y-4 pt-6 border-t border-stone-800/80">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white tracking-wide">
                آثار افزوده شده توسط شما ({customItems.length})
              </h3>
              <span className="text-[11px] text-stone-500">
                در حافظه مرورگر ذخیره شده است
              </span>
            </div>

            <div className="divide-y divide-stone-800/80 border border-stone-800 rounded-xl overflow-hidden bg-stone-950">
              {customItems.map((cItem) => (
                <div key={cItem.id} className="p-3.5 flex items-center justify-between gap-4">
                  
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-lg overflow-hidden border border-stone-800 bg-black shrink-0 flex items-center justify-center">
                      <img
                        src={cItem.imageUrl}
                        alt={cItem.nameFa}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">
                        {cItem.nameFa}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] text-stone-400 font-grotesk mt-0.5">
                        <span>{cItem.itemCode}</span>
                        <span>•</span>
                        <span className="font-peyda">{categoryNameFa(cItem.category)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => onViewProduct(cItem)}
                      className="p-2 rounded-lg border border-stone-800 hover:border-stone-700 text-stone-400 hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1"
                      title="مشاهده صفحه اثر"
                    >
                      <ExternalLink className="w-3.5 h-3.5 stroke-[1.5]" />
                      <span className="hidden sm:inline">مشاهده اثر</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteJewelry(cItem.id)}
                      className="p-2 rounded-lg border border-stone-800 hover:border-stone-700 text-stone-500 hover:text-stone-300 transition-colors cursor-pointer"
                      title="حذف این اثر"
                    >
                      <Trash2 className="w-3.5 h-3.5 stroke-[1.5]" />
                    </button>
                  </div>

                </div>
              ))}
            </div>

          </section>
        )}

      </main>

      {/* 1:1 Aspect Ratio Image Cropper Modal (مطابق با مقیاس وب‌سایت) */}
      {isCropperOpen && cropImageSrc && (
        <ImageCropperModal
          imageSrc={cropImageSrc}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}

    </div>
  );
};
