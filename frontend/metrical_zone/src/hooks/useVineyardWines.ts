import { useQuery } from '@tanstack/react-query';
import { wineService } from '@/api/services/wineService';

export const useVineyardWines = (vineyardId: number) => {
  return useQuery({
    queryKey: ['vineyardWines', vineyardId],
    queryFn: () => wineService.getByVineyard(vineyardId),
    enabled: !!vineyardId,
  });
};
