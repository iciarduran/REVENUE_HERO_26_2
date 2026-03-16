export enum BrandCategory {
  COLA = 'Cola',
  ZERO = 'Zero',
  ENERGY = 'Energy',
  COFFEE = 'Coffee',
  TEA = 'Tea',
  WATER = 'Water',
  MIXER = 'Mixer'
}

export interface Brand {
  id: string;
  name: string;
  category: BrandCategory;
  baseNSRPerBottle: number; // Net Sales Revenue per Bottle
  marginMultiplier: number;
  allowedFormats: string[]; // IDs of formats allowed for this brand
}

export interface Format {
  id: string;
  name: string;
  volumePerUnit: number; // in Litres
  unitsPerCase: number;
  revenueMultiplier: number; // Single-serve has higher multiplier
}

export interface Outlet {
  id: string;
  name: string;
  location: string;
  type: 'Bar' | 'Restaurant' | 'Cafe' | 'Ski Resort' | 'Kiosk';
  persona: {
    name: string;
    description: string;
    objection: string;
    consumerInsight: string;
    preferences: string;
    preference: BrandCategory[];
  };
  currentVolume: number;
  currentRevenue: number;
  difficulty: number;
}

export interface GameState {
  level: number;
  totalRevenue: number;
  totalVolume: number;
  totalVolumeLitre: number;
  territoryOutlets: string[]; // IDs of outlets in current level
  completedOutlets: string[];
  completedBrands: string[]; // Unique brand IDs sold
  totalHappiness: number; // Sum of happiness scores from deals
  currentOutletId: string | null;
}

export interface Decision {
  brandId: string;
  formatId: string;
  discount: number; // 0 to 1
}
