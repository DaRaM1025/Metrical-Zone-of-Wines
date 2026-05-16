import { useQuery } from '@tanstack/react-query';
import { vineyardService } from '@/api/services/vineyardService';

export const useVineyardMetrics = (vineyardId: number) => {
  return useQuery({
    queryKey: ['vineyardMetrics', vineyardId],
    queryFn: () => vineyardService.getMetrics(vineyardId),
    enabled: !!vineyardId,
    staleTime: 1000 * 60 * 5,
  });
};
