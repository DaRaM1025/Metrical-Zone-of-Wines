// src/hooks/useRegions.ts
import { useQuery } from '@tanstack/react-query';
import { regionService } from '@/api/services/regionsService';

export const useRegions = () => {
  return useQuery({
    queryKey: ['regions'],
    queryFn: () => regionService.getAll(),
    staleTime: 1000 * 60 * 5,
  });
};