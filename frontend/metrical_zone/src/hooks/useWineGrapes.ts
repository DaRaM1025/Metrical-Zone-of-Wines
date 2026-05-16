import { useQuery } from '@tanstack/react-query';
import { wineService } from '@/api/services/wineService';

export const useWineGrapes = (wineId: number) => {
  return useQuery({
    queryKey: ['wineGrapes', wineId],
    queryFn: () => wineService.getGrapes(wineId),
    enabled: !!wineId,
    staleTime: 1000 * 60 * 5,
  });
};
