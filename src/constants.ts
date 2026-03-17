import { Brand, BrandCategory, Format, Outlet } from './types';

export const BRANDS: Brand[] = [
  { id: 'coke-classic', name: 'Coca-Cola', category: BrandCategory.COLA, baseNSRPerBottle: 0.70, marginMultiplier: 1.0, allowedFormats: ['25cl-can', '33cl-can', '50cl-pet', '150cl-pet', '33cl-rgb'] },
  { id: 'coke-zero', name: 'Coca-Cola Zero', category: BrandCategory.ZERO, baseNSRPerBottle: 0.73, marginMultiplier: 1.1, allowedFormats: ['25cl-can', '33cl-can', '50cl-pet', '150cl-pet', '33cl-rgb'] },
  { id: 'monster', name: 'Monster-KO', category: BrandCategory.ENERGY, baseNSRPerBottle: 1.26, marginMultiplier: 1.5, allowedFormats: ['50cl-can'] },
  { id: 'costa', name: 'Costa Coffee', category: BrandCategory.COFFEE, baseNSRPerBottle: 1.51, marginMultiplier: 1.8, allowedFormats: ['25cl-can'] },
  { id: 'fuze', name: 'Fuze Tea-KO', category: BrandCategory.TEA, baseNSRPerBottle: 0.35, marginMultiplier: 1.2, allowedFormats: ['33cl-can', '50cl-pet', '150cl-pet', '33cl-rgb'] },
  { id: 'valser', name: 'Valser', category: BrandCategory.WATER, baseNSRPerBottle: 0.36, marginMultiplier: 0.9, allowedFormats: ['33cl-pet', '50cl-pet', '150cl-pet', '33cl-rgb', '50cl-rgb'] },
];

export const FORMATS: Format[] = [
  { id: '25cl-rgb', name: '25cl RGB (Glass)', volumePerUnit: 0.25, unitsPerCase: 24, revenueMultiplier: 4.0 },
  { id: '33cl-rgb', name: '33cl RGB (Glass)', volumePerUnit: 0.33, unitsPerCase: 24, revenueMultiplier: 3.5 },
  { id: '25cl-can', name: '25cl Can', volumePerUnit: 0.25, unitsPerCase: 24, revenueMultiplier: 3.0 },
  { id: '33cl-can', name: '33cl Can', volumePerUnit: 0.33, unitsPerCase: 24, revenueMultiplier: 2.5 },
  { id: '50cl-can', name: '50cl Can', volumePerUnit: 0.5, unitsPerCase: 24, revenueMultiplier: 2.2 },
  { id: '33cl-pet', name: '33cl PET', volumePerUnit: 0.33, unitsPerCase: 24, revenueMultiplier: 2.1 },
  { id: '50cl-pet', name: '50cl PET', volumePerUnit: 0.5, unitsPerCase: 24, revenueMultiplier: 2.0 },
  { id: '50cl-rgb', name: '50cl RGB (Glass)', volumePerUnit: 0.5, unitsPerCase: 24, revenueMultiplier: 1.8 },
  { id: '150cl-pet', name: '1.5L PET', volumePerUnit: 1.5, unitsPerCase: 6, revenueMultiplier: 1.0 },
];

export const NSR_TABLE: Record<string, Record<string, number>> = {
  'coke-classic': {
    '25cl-can': 0.70,
    '33cl-can': 0.46,
    '50cl-pet': 0.95,
    '150cl-pet': 1.50,
    '33cl-rgb': 0.73
  },
  'coke-zero': {
    '25cl-can': 0.73,
    '33cl-can': 0.49,
    '50cl-pet': 0.95,
    '150cl-pet': 1.53,
    '33cl-rgb': 0.71
  },
  'costa': {
    '25cl-can': 1.51
  },
  'fuze': {
    '33cl-can': 0.35,
    '50cl-pet': 0.66,
    '150cl-pet': 0.59,
    '33cl-rgb': 0.44
  },
  'monster': {
    '50cl-can': 1.26
  },
  'valser': {
    '33cl-pet': 0.36,
    '50cl-pet': 0.27,
    '150cl-pet': 0.80,
    '33cl-rgb': 0.37,
    '50cl-rgb': 0.36
  }
};

export const OUTLETS: Outlet[] = [
  {
    id: 'zurich-bar',
    name: 'Kronenhalle Bar',
    location: 'Zurich',
    type: 'Bar',
    difficulty: 1,
    currentVolume: 100,
    currentRevenue: 1500,
    persona: {
      name: 'Sandra',
      description: 'Bar Manager',
      objection: 'My cooler is packed with Fever Tree. I don\'t have room for another sugary option. What else have you got?',
      consumerInsight: 'Guests here expect premium glass bottles served at the table. Sugar-free options are a must — our clientele watches what they drink.',
      preferences: 'MIXER PREMIUM ZERO',
      preference: [BrandCategory.MIXER, BrandCategory.ZERO]
    }
  },
  {
    id: 'ticino-restaurant',
    name: 'Alpenblick Restaurant',
    location: 'Ticino',
    type: 'Restaurant',
    difficulty: 1,
    currentVolume: 200,
    currentRevenue: 2000,
    persona: {
      name: 'Marco',
      description: 'Owner',
      objection: 'Families come for the food, not the drinks. I need affordable options that don\'t sit on the shelf.',
      consumerInsight: 'Families want variety and value. Kids go for flavours, parents want classic cola or water. PET formats work best for takeaway and terrace service.',
      preferences: 'FAMILY VALUE VARIETY',
      preference: [BrandCategory.COLA, BrandCategory.WATER]
    }
  },
  {
    id: 'urban-cafe',
    name: 'Bahnhof Café',
    location: 'Lausanne',
    type: 'Cafe',
    difficulty: 2,
    currentVolume: 150,
    currentRevenue: 1800,
    persona: {
      name: 'Leila',
      description: 'Shift Lead',
      objection: 'Our peak is 7–10 AM. People grab and go. If it\'s not cold and ready, they walk.',
      consumerInsight: 'Commuters want speed and convenience. Canned energy and iced coffee are top sellers. Nobody buys 1.5L here — small, cold, fast.',
      preferences: 'GRAB & GO ENERGY COFFEE',
      preference: [BrandCategory.ENERGY, BrandCategory.COFFEE]
    }
  }
];
