// src/hooks/useVineyards.ts
import { useQuery } from '@tanstack/react-query';
import { vineyardService } from '@/api/services/vineyardService';

export const useVineyards = () => {
  return useQuery({
    queryKey: ['vineyards'],
    queryFn: () => vineyardService.getAll(),
    staleTime: 1000 * 60 * 5,
  });
};

  export const useVineyardById = (id: number) => {
  return useQuery({
    queryKey: ['vineyard', id],
    queryFn: () => vineyardService.getById(id),
    staleTime: 1000 * 60 * 5,
  });

};