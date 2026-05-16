// src/hooks/useCountries.ts
import { useQuery } from '@tanstack/react-query';
import { countryService } from '@/api/services/countryService';

export const useCountries = () => {
  return useQuery({
    queryKey: ['countries'],
    queryFn: () => countryService.getAll(),
    staleTime: 1000 * 60 * 10,
  });
};