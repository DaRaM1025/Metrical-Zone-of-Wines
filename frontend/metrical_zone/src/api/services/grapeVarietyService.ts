import { apiClient } from '../client';
import type { GrapeVariety } from '@/api/types';

type GrapeVarietyApiRow = {
  id: number | string;
  name: string;
  color?: GrapeVariety['color'] | string | null;
  origin_country?: string | null;
  originCountry?: string | null;
};

function normalizeGrapeVariety(raw: GrapeVarietyApiRow): GrapeVariety {
  return {
    id: Number(raw.id),
    name: String(raw.name),
    color: (raw.color ?? null) as GrapeVariety['color'],
    origin_country: raw.origin_country ?? raw.originCountry ?? null,
  };
}

export const grapeVarietyService = {
  getById: async (id: number): Promise<GrapeVariety> => {
    const { data } = await apiClient.get<GrapeVarietyApiRow>(`/grape-varieties/${id}`);
    return normalizeGrapeVariety(data);
  },
};
