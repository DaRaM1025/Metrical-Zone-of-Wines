import type { Region} from '@/api/types';

export const mockRegions: Region[] = [
  {
    id: 101,
    country_id: 1,
    name: 'Bordeaux',
    description: 'Famous for its red blends, especially Cabernet Sauvignon and Merlot.',
    climate_type: 'Oceanic',
    wine_style_profile: 'Bold reds',
  },
  {
    id: 102,
    country_id: 1,
    name: 'Burgundy',
    description: 'Home to Pinot Noir and Chardonnay.',
    climate_type: 'Continental',
    wine_style_profile: 'Elegant reds',
  },
  {
    id: 103,
    country_id: 2,
    name: 'Rioja',
    description: 'Tempranillo-based wines with oak aging.',
    climate_type: 'Mediterranean',
    wine_style_profile: 'Bold reds',
  },
  {
    id: 104,
    country_id: 3,
    name: 'Tuscany',
    description: 'Sangiovese, Chianti, Brunello.',
    climate_type: 'Mediterranean',
    wine_style_profile: 'Bold reds',
  },
  {
    id: 105,
    country_id: 4,
    name: 'Napa Valley',
    description: 'Cabernet Sauvignon powerhouse.',
    climate_type: 'Mediterranean',
    wine_style_profile: 'Bold reds',
  },
] satisfies Region[];

export const mockRegionById: Record<number, Region> = Object.fromEntries(
  mockRegions.map(r => [r.id, r])
);