import { useQuery } from '@tanstack/react-query';
import { wineService } from '@/api/services/wineService';

export const useWine = (id: number) => {
  return useQuery({
    queryKey: ['wine', id],
    queryFn: () => wineService.getById(id),
    enabled: !!id,
  });
};
