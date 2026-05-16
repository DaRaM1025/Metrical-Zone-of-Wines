import { useQuery } from '@tanstack/react-query';
import { wineService } from '@/api/services/wineService';
import type { WineMetrics } from '@/api/types';

export const useWineMetrics = (wineId: number) => {
  return useQuery({
    queryKey: ['wineMetrics', wineId],
    queryFn: async (): Promise<WineMetrics> => wineService.getMetrics(wineId),
    enabled: !!wineId,
    staleTime: 1000 * 60 * 5,
  });
};
