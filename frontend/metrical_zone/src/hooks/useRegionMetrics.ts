import { useQuery } from '@tanstack/react-query';
import { regionService } from '@/api/services/regionsService';

export const useRegionMetrics = (regionId: number) => {
  return useQuery({
    queryKey: ['regionMetrics', regionId],
    queryFn: () => regionService.getMetrics(regionId),
    enabled: !!regionId,
    staleTime: 1000 * 60 * 5,
  });
};
