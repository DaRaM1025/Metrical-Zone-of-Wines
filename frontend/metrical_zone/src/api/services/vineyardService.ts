import { apiClient } from '../client';
import { normalizeRegion, type RegionApiRow } from './regionsService';
import type { GrapeVariety, Region, Vineyard, VineyardMetrics, Wine } from '@/api/types';

type VineyardApiRow = {
  id: number | string;
  region_id?: number | string | null;
  regionId?: number | string | null;
  name: string;
  owner?: string | null;
  founded_year?: number | string | null;
  foundedYear?: number | string | null;
  hectares?: number | string | null;
  altitude_avg_m?: number | string | null;
  altitudeAvgM?: number | string | null;
  soil_type?: Vineyard['soil_type'] | string | null;
  soilType?: Vineyard['soil_type'] | string | null;
  irrigation_type?: Vineyard['irrigation_type'] | string | null;
  irrigationType?: Vineyard['irrigation_type'] | string | null;
  harvest_season?: Vineyard['harvest_season'] | string | null;
  harvestSeason?: Vineyard['harvest_season'] | string | null;
  lat?: number | string | null;
  lng?: number | string | null;
  website?: string | null;
  label_image_url?: string | null;
  labelImageUrl?: string | null;
  region?: RegionApiRow | null;
};

type VineyardMetricsApiRow = {
  id: number | string;
  vineyard_id?: number | string | null;
  vineyardId?: number | string | null;
  computed_at?: string | null;
  computedAt?: string | null;
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
  price_range?: VineyardMetrics['price_range'] | string | null;
  priceRange?: VineyardMetrics['price_range'] | string | null;
  dominant_grape_id?: number | string | null;
  dominantGrapeId?: number | string | null;
  dominant_grape?: GrapeVariety | null;
  dominantGrape?: {
    id?: number | string | null;
    name?: string | null;
    color?: GrapeVariety['color'] | string | null;
    origin_country?: string | null;
    originCountry?: string | null;
  } | null;
  prestige_index?: VineyardMetrics['prestige_index'] | string | null;
  prestigeIndex?: VineyardMetrics['prestige_index'] | string | null;
  medal_count?: number | string | null;
  medalCount?: number | string | null;
  top_wine_type?: VineyardMetrics['top_wine_type'] | string | null;
  topWineType?: VineyardMetrics['top_wine_type'] | string | null;
  avg_aging_months?: number | string | null;
  avgAgingMonths?: number | string | null;
  vineyard?: { id?: number | string | null } | null;
};

type VineyardMetricsApiResponse = VineyardMetricsApiRow | VineyardMetricsApiRow[];

function nullableNumber(value: number | string | null | undefined): number | null {
  if (value == null || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function getRegionId(raw: VineyardApiRow): number {
  const regionIdRaw = raw.region_id ?? raw.regionId ?? raw.region?.id;
  return nullableNumber(regionIdRaw) ?? 0;
}

function normalizeVineyard(raw: VineyardApiRow, region: Region | null): Vineyard {
  return {
    id: Number(raw.id),
    region_id: region?.id ?? getRegionId(raw),
    region,
    name: String(raw.name),
    owner: raw.owner ?? null,
    founded_year: nullableNumber(raw.founded_year ?? raw.foundedYear),
    hectares: nullableNumber(raw.hectares),
    altitude_avg_m: nullableNumber(raw.altitude_avg_m ?? raw.altitudeAvgM),
    soil_type: (raw.soil_type ?? raw.soilType ?? null) as Vineyard['soil_type'],
    irrigation_type: (raw.irrigation_type ?? raw.irrigationType ?? null) as Vineyard['irrigation_type'],
    harvest_season: (raw.harvest_season ?? raw.harvestSeason ?? null) as Vineyard['harvest_season'],
    lat: nullableNumber(raw.lat),
    lng: nullableNumber(raw.lng),
    website: raw.website ?? null,
    label_image_url: raw.label_image_url ?? raw.labelImageUrl ?? null,
  };
}

function normalizeGrape(raw: VineyardMetricsApiRow['dominantGrape']): GrapeVariety | null {
  if (!raw?.id) return null;
  return {
    id: Number(raw.id),
    name: raw.name ? String(raw.name) : `Uva ${raw.id}`,
    color: (raw.color ?? null) as GrapeVariety['color'],
    origin_country: raw.origin_country ?? raw.originCountry ?? null,
  };
}

function pickLatestVineyardMetrics(data: VineyardMetricsApiResponse): VineyardMetricsApiRow | null {
  const rows = Array.isArray(data) ? data : [data];
  const validRows = rows.filter((row): row is VineyardMetricsApiRow => !!row);
  if (validRows.length === 0) return null;

  return [...validRows].sort((a, b) => {
    const aTime = new Date(a.computed_at ?? a.computedAt ?? '').getTime();
    const bTime = new Date(b.computed_at ?? b.computedAt ?? '').getTime();
    return (Number.isNaN(bTime) ? 0 : bTime) - (Number.isNaN(aTime) ? 0 : aTime);
  })[0];
}

function normalizeVineyardMetrics(raw: VineyardMetricsApiRow, fallbackVineyardId: number): VineyardMetrics {
  const dominantGrape = raw.dominant_grape ?? normalizeGrape(raw.dominantGrape);
  const dominantGrapeId =
    nullableNumber(raw.dominant_grape_id ?? raw.dominantGrapeId ?? dominantGrape?.id) ?? null;
  const vineyardId = nullableNumber(raw.vineyard_id ?? raw.vineyardId ?? raw.vineyard?.id) ?? fallbackVineyardId;

  return {
    id: Number(raw.id),
    vineyard_id: vineyardId,
    computed_at: raw.computed_at ?? raw.computedAt ?? '',
    total_wines: nullableNumber(raw.total_wines ?? raw.totalWines) ?? 0,
    total_reviews: nullableNumber(raw.total_reviews ?? raw.totalReviews) ?? 0,
    avg_score: nullableNumber(raw.avg_score ?? raw.avgScore),
    top_score: nullableNumber(raw.top_score ?? raw.topScore),
    avg_expert_score: nullableNumber(raw.avg_expert_score ?? raw.avgExpertScore),
    avg_consumer_score: nullableNumber(raw.avg_consumer_score ?? raw.avgConsumerScore),
    avg_price_usd: nullableNumber(raw.avg_price_usd ?? raw.avgPriceUsd),
    price_range: (raw.price_range ?? raw.priceRange ?? null) as VineyardMetrics['price_range'],
    dominant_grape_id: dominantGrapeId,
    dominant_grape: dominantGrape,
    prestige_index: (raw.prestige_index ?? raw.prestigeIndex ?? null) as VineyardMetrics['prestige_index'],
    medal_count: nullableNumber(raw.medal_count ?? raw.medalCount) ?? 0,
    top_wine_type: (raw.top_wine_type ?? raw.topWineType ?? null) as VineyardMetrics['top_wine_type'],
    avg_aging_months: nullableNumber(raw.avg_aging_months ?? raw.avgAgingMonths),
  };
}

async function getRegionForVineyard(raw: VineyardApiRow): Promise<Region | null> {
  const regionId = getRegionId(raw);
  if (!regionId) return raw.region ? normalizeRegion(raw.region) : null;

  try {
    const { data } = await apiClient.get<RegionApiRow>(`/regions/${regionId}`);
    return normalizeRegion(data);
  } catch {
    return raw.region ? normalizeRegion(raw.region) : null;
  }
}

export const vineyardService = {
  getById: async (id: number): Promise<Vineyard> => {
    const { data } = await apiClient.get<VineyardApiRow>(`/vineyards/${id}`);
    const region = await getRegionForVineyard(data);
    return normalizeVineyard(data, region);
  },
  getMetrics: async (id: number): Promise<VineyardMetrics> => {
    const { data } = await apiClient.get<VineyardMetricsApiResponse>(`/vineyard-metrics/vineyard/${id}`);
    const latestMetrics = pickLatestVineyardMetrics(data);
    if (!latestMetrics) {
      throw new Error(`Vineyard metrics for vineyard ${id} were not found`);
    }
    return normalizeVineyardMetrics(latestMetrics, id);
  },
  getWines: async (vineyardId: number): Promise<Wine[]> => {
    const { data } = await apiClient.get(`/wines/vineyard/${vineyardId}`);
    return data;
  },
  getAll: async (): Promise<Vineyard[]> => {
    const { data } = await apiClient.get<VineyardApiRow[]>('/vineyards');
    const rows = Array.isArray(data) ? data : [];
    const regionRequests = new Map<number, Promise<Region | null>>();

    for (const row of rows) {
      const regionId = getRegionId(row);
      if (regionId && !regionRequests.has(regionId)) {
        regionRequests.set(regionId, getRegionForVineyard(row));
      }
    }

    const regions = new Map<number, Region | null>();
    await Promise.all(
      Array.from(regionRequests.entries()).map(async ([regionId, request]) => {
        regions.set(regionId, await request);
      }),
    );

    return rows.map((row) => {
      const regionId = getRegionId(row);
      return normalizeVineyard(row, regions.get(regionId) ?? null);
    });
  },
};
