import type { WineGrape, WineGrapeWithDetails } from '@/api/types';
import { mockGrapeVarieties } from './grapeVarietiesMocks';

export const mockWineGrapes: WineGrape[] = [
  { wine_id: 10001, grape_id: 1, percentage: 75 }, // Cabernet Sauvignon
  { wine_id: 10001, grape_id: 2, percentage: 20 }, // Merlot
  { wine_id: 10001, grape_id: 5, percentage: 5 },  // Sauvignon Blanc
  { wine_id: 10002, grape_id: 1, percentage: 60 },
  { wine_id: 10002, grape_id: 2, percentage: 30 },
  { wine_id: 10002, grape_id: 5, percentage: 10 },
  { wine_id: 10003, grape_id: 6, percentage: 90 }, // Tempranillo
  { wine_id: 10003, grape_id: 1, percentage: 10 },
];

// Para cuando necesites el detalle con el objeto grape
export const mockWineGrapesWithDetails: WineGrapeWithDetails[] = mockWineGrapes.map(wg => ({
  ...wg,
  grape: mockGrapeVarieties.find(g => g.id === wg.grape_id)!,
}));