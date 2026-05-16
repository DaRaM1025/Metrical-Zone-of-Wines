import type { Country } from '@/api/types';

export const mockCountries: Country[] = [
  { id: 1, name: 'France', code: 'FR' },
  { id: 2, name: 'Spain', code: 'ES' },
  { id: 3, name: 'Italy', code: 'IT' },
  { id: 4, name: 'United States', code: 'US' },
  { id: 5, name: 'Chile', code: 'CL' },
  { id: 6, name: 'Argentina', code: 'AR' },
  { id: 7, name: 'Australia', code: 'AU' },
];

export const mockCountryById: Record<number, Country> = Object.fromEntries(
  mockCountries.map(c => [c.id, c])
);