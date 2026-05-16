import type { Vineyard} from '@/api/types';

export const mockVineyards: Vineyard[] = [
  {
    id: 1001,
    region_id: 101,
    name: 'Château Margaux',
    owner: 'Corinne Mentzelopoulos',
    founded_year: 1800,
    hectares: 262,
    altitude_avg_m: 15,
    soil_type: 'Gravel',
    irrigation_type: 'Dry farming',
    harvest_season: 'Autumn',
    lat: 45.0523,
    lng: -0.6792,
    website: 'https://www.chateau-margaux.com',
    label_image_url: 'https://example.com/margaux.jpg',
  },
  {
    id: 1002,
    region_id: 102,
    name: 'Domaine de la Romanée-Conti',
    owner: 'Aubert de Villaine',
    founded_year: 1869,
    hectares: 25,
    altitude_avg_m: 260,
    soil_type: 'Limestone',
    irrigation_type: 'Dry farming',
    harvest_season: 'Autumn',
    lat: 47.2156,
    lng: 4.9525,
    website: 'https://www.domaine-romanee-conti.com',
    label_image_url: null,
  },
  {
    id: 1003,
    region_id: 103,
    name: 'Bodegas Marqués de Riscal',
    owner: 'Familia Riscal',
    founded_year: 1858,
    hectares: 1500,
    altitude_avg_m: 450,
    soil_type: 'Clay',
    irrigation_type: 'Drip',
    harvest_season: 'Autumn',
    lat: 42.5603,
    lng: -2.8007,
    website: 'https://www.marquesderiscal.com',
    label_image_url: null,
  },
] satisfies Vineyard[];

export const mockVineyardById: Record<number, Vineyard> = Object.fromEntries(
  mockVineyards.map(v => [v.id, v])
);