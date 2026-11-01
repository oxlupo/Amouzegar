export interface JewelryItem {
  id: string;
  itemCode: string;
  nameFa: string;
  nameEn: string;
  category: 'necklace' | 'earrings' | 'ring' | 'bracelet' | 'set';
  stoneType: 'ruby' | 'diamond' | 'emerald' | 'sapphire';
  stoneNameFa: string;
  caratTotal: number;
  caratMainStone: number;
  clarity: string;
  cutTypeFa: string;
  cutTypeEn: string;
  metalFa: string;
  metalEn: string;
  originFa: string;
  certificateNumber: string;
  certificateIssuer: 'GIA' | 'HRD' | 'Amuzegar Atelier' | 'IGI';
  descriptionFa: string;
  imageUrl: string;
  additionalImages: string[];
  isMasterpiece?: boolean;
  featuredInHeroVideo?: boolean;
  videoTimestamp?: string;
  tagsFa: string[];
  availability: 'موجود در سالن فرشته' | 'کلکسیون ویژه دبی' | 'تک‌نسخه آتلیه آموزگار';
  goldNetWeight?: number | string; // وزن خالص طلا به گرم
  selectedStones?: string[]; // لیست سنگ‌ها و تراش‌های به کار رفته در اثر
}

export interface BespokeCustomRequest {
  fullName: string;
  phoneNumber: string;
  metalType: string;
  gemstone: string;
  cutShape: string;
  description: string;
  targetDate?: string;
}

export interface VipBooking {
  fullName: string;
  phoneNumber: string;
  preferredBranch: 'fereshteh' | 'samcenter' | 'dubai';
  date: string;
  timeSlot: string;
  guestCount: number;
  interests: string[];
  notes?: string;
}
