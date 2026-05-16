import { apiClient } from '../client';
import { vineyardService } from './vineyardService';
import type { GrapeVariety, Vineyard, Wine, WineMetrics, WineGrapeWithDetails } from '@/api/types';

type WineApiRow = {
  id: number | string;
  vineyard_id?: number | string | null;
  vineyardId?: number | string | null;
  name: string;
  vintage_year?: number | string | null;
  vintageYear?: number | string | null;
  wine_type?: Wine['wine_type'] | string | null;
  wineType?: Wine['wine_type'] | string | null;
  alcohol_pct?: number | string | null;
  alcoholPct?: number | string | null;
  avg_price_usd?: number | string | null;
  avgPriceUsd?: number | string | null;
  price_range?: Wine['price_range'] | string | null;
  priceRange?: Wine['price_range'] | string | null;
  production_bottles?: number | string | null;
  productionBottles?: number | string | null;
  aging_months?: number | string | null;
  agingMonths?: number | string | null;
  aging_vessel?: Wine['aging_vessel'] | string | null;
  agingVessel?: Wine['aging_vessel'] | string | null;
  natural_wine?: boolean | number | string | null;
  naturalWine?: boolean | number | string | null;
  tasting_notes?: string | null;
  tastingNotes?: string | null;
  food_pairing?: string | null;
  foodPairing?: string | null;
  label_image_url?: string | null;
  labelImageUrl?: string | null;
  description?: string | null;
  vineyard?: { id?: number | string | null; name?: string | null } | null;
};

type WineMetricsApiRow = {
  id: number | string;
  wine_id?: number | string | null;
  wineId?: number | string | null;
  wine?: { id?: number | string | null; name?: string | null } | null;
  computed_at?: string | null;
  computedAt?: string | null;
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
  medal_count?: number | string | null;
  medalCount?: number | string | null;
  prestige_index?: WineMetrics['prestige_index'] | string | null;
  prestigeIndex?: WineMetrics['prestige_index'] | string | null;
};

type WineMetricsApiResponse = WineMetricsApiRow | WineMetricsApiRow[];

type WineGrapeApiRow = {
  wine_id?: number | string | null;
  wineId?: number | string | null;
  grape_id?: number | string | null;
  grapeId?: number | string | null;
  wine?: { id?: number | string | null } | null;
  grape?: {
    id?: number | string | null;
    name?: string | null;
    color?: GrapeVariety['color'] | string | null;
    origin_country?: string | null;
    originCountry?: string | null;
  } | null;
  percentage?: number | string | null;
};

function nullableNumber(value: number | string | null | undefined): number | null {
  if (value == null || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function toBoolean(value: boolean | number | string | null | undefined): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  if (typeof value === 'string') return value.toLowerCase() === 'true' || value === '1';
  return false;
}

function getVineyardId(raw: WineApiRow): number {
  return nullableNumber(raw.vineyard_id ?? raw.vineyardId ?? raw.vineyard?.id) ?? 0;
}

function getWineId(raw: WineMetricsApiRow): number {
  return nullableNumber(raw.wine_id ?? raw.wineId ?? raw.wine?.id) ?? 0;
}

function normalizeWine(raw: WineApiRow, vineyard: Vineyard | null): Wine {
  return {
    id: Number(raw.id),
    vineyard_id: vineyard?.id ?? getVineyardId(raw),
    vineyard,
    name: String(raw.name),
    vintage_year: nullableNumber(raw.vintage_year ?? raw.vintageYear),
    wine_type: (raw.wine_type ?? raw.wineType ?? null) as Wine['wine_type'],
    alcohol_pct: nullableNumber(raw.alcohol_pct ?? raw.alcoholPct),
    avg_price_usd: nullableNumber(raw.avg_price_usd ?? raw.avgPriceUsd),
    price_range: (raw.price_range ?? raw.priceRange ?? null) as Wine['price_range'],
    production_bottles: nullableNumber(raw.production_bottles ?? raw.productionBottles),
    aging_months: nullableNumber(raw.aging_months ?? raw.agingMonths),
    aging_vessel: (raw.aging_vessel ?? raw.agingVessel ?? null) as Wine['aging_vessel'],
    natural_wine: toBoolean(raw.natural_wine ?? raw.naturalWine),
    tasting_notes: raw.tasting_notes ?? raw.tastingNotes ?? null,
    food_pairing: raw.food_pairing ?? raw.foodPairing ?? null,
    label_image_url: raw.label_image_url ?? raw.labelImageUrl ?? null,
    description: raw.description ?? null,
  };
}

function normalizeWineMetrics(raw: WineMetricsApiRow, wine: Wine | null): WineMetrics {
  return {
    id: Number(raw.id),
    wine_id: wine?.id ?? getWineId(raw),
    wine,
    computed_at: raw.computed_at ?? raw.computedAt ?? '',
    total_reviews: nullableNumber(raw.total_reviews ?? raw.totalReviews) ?? 0,
    avg_score: nullableNumber(raw.avg_score ?? raw.avgScore),
    top_score: nullableNumber(raw.top_score ?? raw.topScore),
    avg_expert_score: nullableNumber(raw.avg_expert_score ?? raw.avgExpertScore),
    avg_consumer_score: nullableNumber(raw.avg_consumer_score ?? raw.avgConsumerScore),
    medal_count: nullableNumber(raw.medal_count ?? raw.medalCount) ?? 0,
    prestige_index: (raw.prestige_index ?? raw.prestigeIndex ?? null) as WineMetrics['prestige_index'],
  };
}

function normalizeWineGrape(raw: WineGrapeApiRow): WineGrapeWithDetails {
  const grapeId = nullableNumber(raw.grape_id ?? raw.grapeId ?? raw.grape?.id) ?? 0;
  const wineId = nullableNumber(raw.wine_id ?? raw.wineId ?? raw.wine?.id) ?? 0;

  return {
    wine_id: wineId,
    grape_id: grapeId,
    percentage: nullableNumber(raw.percentage),
    grape: {
      id: grapeId,
      name: raw.grape?.name ? String(raw.grape.name) : `Uva ${grapeId}`,
      color: (raw.grape?.color ?? null) as GrapeVariety['color'],
      origin_country: raw.grape?.origin_country ?? raw.grape?.originCountry ?? null,
    },
  };
}

function pickLatestWineMetrics(data: WineMetricsApiResponse): WineMetricsApiRow | null {
  const rows = Array.isArray(data) ? data : [data];
  const validRows = rows.filter((row): row is WineMetricsApiRow => !!row);
  if (validRows.length === 0) return null;

  return [...validRows].sort((a, b) => {
    const aTime = new Date(a.computed_at ?? a.computedAt ?? '').getTime();
    const bTime = new Date(b.computed_at ?? b.computedAt ?? '').getTime();
    return (Number.isNaN(bTime) ? 0 : bTime) - (Number.isNaN(aTime) ? 0 : aTime);
  })[0];
}

async function getVineyardForWine(raw: WineApiRow): Promise<Vineyard | null> {
  const vineyardId = getVineyardId(raw);
  if (!vineyardId) return null;

  try {
    return await vineyardService.getById(vineyardId);
  } catch {
    return null;
  }
}

async function fetchWineById(id: number): Promise<Wine> {
  const { data } = await apiClient.get<WineApiRow>(`/wines/${id}`);
  const vineyard = await getVineyardForWine(data);
  return normalizeWine(data, vineyard);
}

export const wineService = {
  getById: async (id: number): Promise<Wine> => {
    return fetchWineById(id);
  },
  getByVineyard: async (vineyardId: number): Promise<Wine[]> => {
    const [{ data }, vineyard] = await Promise.all([
      apiClient.get<WineApiRow[]>(`/wines/vineyard/${vineyardId}`),
      vineyardService.getById(vineyardId).catch(() => null),
    ]);
    const rows = Array.isArray(data) ? data : [];
    return rows.map((row) => normalizeWine(row, vineyard));
  },
  getMetrics: async (id: number): Promise<WineMetrics> => {
    const { data } = await apiClient.get<WineMetricsApiResponse>(`/wine-metrics/wine/${id}`);
    const latestMetrics = pickLatestWineMetrics(data);
    if (!latestMetrics) {
      throw new Error(`Wine metrics for wine ${id} were not found`);
    }

    const wineId = getWineId(latestMetrics) || id;
    const wine = await fetchWineById(wineId).catch(() => null);
    return normalizeWineMetrics(latestMetrics, wine);
  },
  getWineGrape: async (wineId: number, grapeId: number): Promise<WineGrapeWithDetails> => {
    const { data } = await apiClient.get<WineGrapeApiRow>(`/wine-grapes/${wineId}/${grapeId}`);
    return normalizeWineGrape(data);
  },
  getGrapes: async (wineId: number): Promise<WineGrapeWithDetails[]> => {
    const { data } = await apiClient.get(`/wines/${wineId}/grapes`);
    return data;
  },
};
