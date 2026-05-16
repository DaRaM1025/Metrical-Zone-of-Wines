import type { GrapeVariety } from '@/api/types';

export const mockGrapeVarieties: GrapeVariety[] = [
  { id: 1, name: 'Cabernet Sauvignon', color: 'Red', origin_country: 'France' },
  { id: 2, name: 'Merlot', color: 'Red', origin_country: 'France' },
  { id: 3, name: 'Pinot Noir', color: 'Red', origin_country: 'France' },
  { id: 4, name: 'Chardonnay', color: 'White', origin_country: 'France' },
  { id: 5, name: 'Sauvignon Blanc', color: 'White', origin_country: 'France' },
  { id: 6, name: 'Tempranillo', color: 'Red', origin_country: 'Spain' },
  { id: 7, name: 'Sangiovese', color: 'Red', origin_country: 'Italy' },
  { id: 8, name: 'Malbec', color: 'Red', origin_country: 'Argentina' },
] satisfies GrapeVariety[];

export const mockGrapeVarietyById: Record<number, GrapeVariety> = Object.fromEntries(
  mockGrapeVarieties.map(g => [g.id, g])
);