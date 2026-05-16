import { useQuery } from '@tanstack/react-query';
import { wineDbFunctionsService } from '@/api/services/wineDbFunctionsService';
import type { Wine } from '@/api/types';

export function canFetchFormatLabel(wine: Pick<Wine, 'vintage_year' | 'alcohol_pct'> | undefined): boolean {
  return (
    !!wine &&
    wine.vintage_year != null &&
    wine.alcohol_pct != null
  );
}

/** Etiqueta comercial desde la BD (nombre + añada + alcohol). Sin mocks. */
export const useWineFormatLabel = (wine: Wine | undefined) => {
  const ready = wine && canFetchFormatLabel(wine);
  return useQuery({
    queryKey: [
      'wineFormatLabel',
      wine?.id,
      wine?.name,
      wine?.vintage_year,
      wine?.alcohol_pct,
    ],
    queryFn: () =>
      wineDbFunctionsService.getFormatLabel({
        name: wine!.name,
        vintage: wine!.vintage_year!,
        alcohol: wine!.alcohol_pct!,
      }),
    enabled: !!ready,
    staleTime: 1000 * 60 * 30,
  });
};
