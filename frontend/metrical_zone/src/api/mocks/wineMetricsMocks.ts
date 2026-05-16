// src/api/mocks/wineMocks.ts
import type { WineMetrics } from '@/api/types';

export const mockWineMetrics: WineMetrics = {
  id: 25,
  wine_id: 101,
  computed_at: new Date().toISOString(),
  total_reviews: 42,
  avg_score: 94.7,
  top_score: 100,
  avg_expert_score: 96.2,
  avg_consumer_score: 92.1,
  medal_count: 3,
  prestige_index: 'Acclaimed',
}satisfies WineMetrics;