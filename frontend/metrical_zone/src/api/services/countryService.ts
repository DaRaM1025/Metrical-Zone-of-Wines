import { apiClient } from '../client';
import type { Country } from '@/api/types';

/** Fila tal como puede venir del backend (camelCase o snake_case). */
type CountryApiRow = {
  id: number | string;
  name: string;
  code?: string;
  country_code?: string;
  iso_code?: string;
};

function normalizeCountry(raw: CountryApiRow): Country {
  const code = raw.code ?? raw.country_code ?? raw.iso_code ?? '';
  return {
    id: Number(raw.id),
    name: String(raw.name),
    code: String(code),
  };
}

function extractCountryList(payload: unknown): CountryApiRow[] {
  if (Array.isArray(payload)) return payload as CountryApiRow[];
  if (payload && typeof payload === 'object' && 'data' in payload) {
    const inner = (payload as { data: unknown }).data;
    if (Array.isArray(inner)) return inner as CountryApiRow[];
  }
  return [];
}

export const countryService = {
  getAll: async (): Promise<Country[]> => {
    const { data } = await apiClient.get<unknown>('/countries');
    return extractCountryList(data).map(normalizeCountry);
  },

  getById: async (id: number): Promise<Country> => {
    const { data } = await apiClient.get<CountryApiRow>(`/countries/${id}`);
    return normalizeCountry(data);
  },
};
