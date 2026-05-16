// src/api/mocks/regionMocks.ts
import type { RegionMetrics } from '@/api/types';

export const mockRegionMetrics: RegionMetrics = {
    id: 1,
    region_id: 1,
    total_vineyards: 42,
    total_wines: 318,
    total_reviews: 1247,
    avg_score: 87.3,
    top_score: 98,
    avg_expert_score: 90.1,
    avg_consumer_score: 84.5,
    avg_price_usd: 32.5,
    price_range: 'Mid',
    dominant_grape: { id: 5, name: 'Cabernet Sauvignon' },
    best_vintage_year: 2019,
    prestige_index: 'Recognized',
    medal_count: 9,
    computed_at: new Date().toISOString(),
}satisfies RegionMetrics;