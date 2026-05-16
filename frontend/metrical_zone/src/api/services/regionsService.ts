import { apiClient } from '../client';
import type { Region, RegionMetrics, Vineyard } from '@/api/types';

/**
 * Forma real del backend: país anidado y camelCase en varios campos.
 * El front tipa `Region` con `country_id` y snake_case.
 */
export type RegionApiRow = {
  id: number | string;
  name: string;
  description?: string | null;
  climate_type?: Region['climate_type'] | string | null;
  climateType?: Region['climate_type'] | string | null;
  wine_style_profile?: Region['wine_style_profile'] | string | null;
  wineStyleProfile?: Region['wine_style_profile'] | string | null;
  country_id?: number | string | null;
  countryId?: number | string | null;
  country?: { id?: number | string; name?: string; code?: string } | null;
};

export function normalizeRegion(raw: RegionApiRow): Region {
  const countryIdRaw = raw.country_id ?? raw.countryId ?? raw.country?.id;
  const country_id =
    countryIdRaw != null && countryIdRaw !== '' ? Number(countryIdRaw) : 0;

  const climate = (raw.climate_type ?? raw.climateType ?? null) as Region['climate_type'];
  const style = (raw.wine_style_profile ?? raw.wineStyleProfile ?? null) as Region['wine_style_profile'];

  return {
    id: Number(raw.id),
    country_id,
    name: String(raw.name),
    description: raw.description ?? null,
    climate_type: climate,
    wine_style_profile: style,
  };
}

type RegionMetricsApiRow = {
  id: number | string;
  region_id?: number | string | null;
  regionId?: number | string | null;
  computed_at?: string | null;
  computedAt?: string | null;
  total_vineyards?: number | string | null;
  totalVineyards?: number | string | null;
  total_wines?: number | string | null;
  totalWines?: number | string | null;
  total_reviews?: number | string | null;
  totalReviews?: number | string | null;
  avg_score?: number | string | null;
  avgScore?: number | string | null;
  top_score?: number | string | null;
  topScore?: number | string | null;
  avg_expert_score?: number | string | null;
  avgExpertScore?: number | string | null;
  avg_consumer_score?: number | string | null;
  avgConsumerScore?: number | string | null;
  avg_price_usd?: number | string | null;
  avgPriceUsd?: number | string | null;
  price_range?: RegionMetrics['price_range'] | string | null;
  priceRange?: RegionMetrics['price_range'] | string | null;
  dominant_grape?: RegionMetrics['dominant_grape'];
  dominantGrape?: RegionMetrics['dominant_grape'];
  best_vintage_year?: number | string | null;
  bestVintageYear?: number | string | null;
  prestige_index?: RegionMetrics['prestige_index'] | string | null;
  prestigeIndex?: RegionMetrics['prestige_index'] | string | null;
  medal_count?: number | string | null;
  medalCount?: number | string | null;
  region?: { id?: number | string | null } | null;
};

function nullableNumber(value: number | string | null | undefined): number | null {
  if (value == null || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeRegionMetrics(raw: RegionMetricsApiRow, fallbackRegionId: number): RegionMetrics {
  const regionId = nullableNumber(raw.region_id ?? raw.regionId ?? raw.region?.id) ?? fallbackRegionId;

  return {
    id: Number(raw.id),
    region_id: regionId,
    computed_at: raw.computed_at ?? raw.computedAt ?? '',
    total_vineyards: nullableNumber(raw.total_vineyards ?? raw.totalVineyards) ?? 0,
    total_wines: nullableNumber(raw.total_wines ?? raw.totalWines) ?? 0,
    total_reviews: nullableNumber(raw.total_reviews ?? raw.totalReviews) ?? 0,
    avg_score: nullableNumber(raw.avg_score ?? raw.avgScore),
    top_score: nullableNumber(raw.top_score ?? raw.topScore),
    avg_expert_score: nullableNumber(raw.avg_expert_score ?? raw.avgExpertScore),
    avg_consumer_score: nullableNumber(raw.avg_consumer_score ?? raw.avgConsumerScore),
    avg_price_usd: nullableNumber(raw.avg_price_usd ?? raw.avgPriceUsd),
    price_range: (raw.price_range ?? raw.priceRange ?? null) as RegionMetrics['price_range'],
    dominant_grape: raw.dominant_grape ?? raw.dominantGrape ?? null,
    best_vintage_year: nullableNumber(raw.best_vintage_year ?? raw.bestVintageYear),
    prestige_index: (raw.prestige_index ?? raw.prestigeIndex ?? null) as RegionMetrics['prestige_index'],
    medal_count: nullableNumber(raw.medal_count ?? raw.medalCount) ?? 0,
  };
}

export const regionService = {
  getAll: async (): Promise<Region[]> => {
    const { data } = await apiClient.get<RegionApiRow[]>('/regions');
    const list = Array.isArray(data) ? data : [];
    return list.map(normalizeRegion);
  },
  getById: async (id: number): Promise<Region> => {
    const { data } = await apiClient.get<RegionApiRow>(`/regions/${id}`);
    return normalizeRegion(data);
  },
  getMetrics: async (id: number): Promise<RegionMetrics> => {
    const { data } = await apiClient.get<RegionMetricsApiRow>(`/region-metrics/${id}`);
    return normalizeRegionMetrics(data, id);
  },
  getVineyards: async (regionId: number): Promise<Vineyard[]> => {
    const { data } = await apiClient.get(`/regions/${regionId}/vineyards`);
    return data;
  },
};
