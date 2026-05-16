// src/api/mocks/vineyardMocks.ts
import type { VineyardMetrics } from '@/api/types';

export const mockVineyardMetrics: VineyardMetrics = {
  id: 10,
  vineyard_id: 5,
  computed_at: new Date().toISOString(),
  total_wines: 12,
  total_reviews: 89,
  avg_score: 91.2,
  top_score: 98,
  avg_expert_score: 93.5,
  avg_consumer_score: 88.9,
  avg_price_usd: 45.0,
  price_range: 'Premium',
  dominant_grape_id: 7,          // ← número, no objeto
  prestige_index: 'Acclaimed',
  medal_count: 6,
  top_wine_type: 'Red',
  avg_aging_months: 16.5,
}satisfies VineyardMetrics;