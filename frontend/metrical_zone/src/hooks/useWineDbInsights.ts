import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { grapeVarietyService } from '@/api/services/grapeVarietyService';
import { wineDbFunctionsService } from '@/api/services/wineDbFunctionsService';
import { wineService } from '@/api/services/wineService';
import type { Wine } from '@/api/types';

/**
 * Consultas directas a funciones de BD por vino (sin mocks):
 * edad de cosecha, uva dominante, decantación.
 * Los ingresos estimados van aparte — ver `useWineEstimatedRevenue`.
 */
export const useWineDbInsights = (wine: Wine | undefined) => {
  const wineId = wine?.id ?? 0;

  const vintageAge = useQuery({
    queryKey: ['wineVintageAge', wineId, wine?.vintage_year],
    queryFn: () => wineDbFunctionsService.getVintageAgeYears(wine!.vintage_year!),
    enabled: !!wine?.id && wine.vintage_year != null,
    staleTime: 1000 * 60 * 60,
  });

  const dominantGrapeId = useQuery({
    queryKey: ['wineDominantGrapeId', wineId],
    queryFn: () => wineDbFunctionsService.getDominantGrapeId(wineId),
    enabled: !!wineId,
    staleTime: 1000 * 60 * 30,
  });

  const dominantGrape = useQuery({
    queryKey: ['grapeVariety', dominantGrapeId.data],
    queryFn: () => grapeVarietyService.getById(dominantGrapeId.data!),
    enabled: dominantGrapeId.data != null,
    staleTime: 1000 * 60 * 60,
  });

  const dominantWineGrape = useQuery({
    queryKey: ['wineGrape', wineId, dominantGrapeId.data],
    queryFn: () => wineService.getWineGrape(wineId, dominantGrapeId.data!),
    enabled: !!wineId && dominantGrapeId.data != null,
    staleTime: 1000 * 60 * 30,
  });

  const grapes = useMemo(() => {
    if (!dominantWineGrape.data) return [];
    if (!dominantGrape.data) return [dominantWineGrape.data];

    return [
      {
        ...dominantWineGrape.data,
        grape: dominantGrape.data,
      },
    ];
  }, [dominantGrape.data, dominantWineGrape.data]);

  const grapesPending =
    dominantGrapeId.isPending ||
    (dominantGrapeId.data != null && dominantWineGrape.isPending);

  const dominantGrapeName = useMemo(() => {
    const id = dominantGrapeId.data;
    if (id == null) return null;
    if (dominantGrape.data?.name) return dominantGrape.data.name;
    const row = grapes.find((g) => g.grape_id === id);
    return row?.grape?.name ?? `Uva ${id}`;
  }, [dominantGrape.data?.name, dominantGrapeId.data, grapes]);

  const decanting = useQuery({
    queryKey: ['wineNeedsDecanting', wineId, wine?.wine_type, wine?.aging_months],
    queryFn: () =>
      wineDbFunctionsService.getNeedsDecanting({
        type: wine!.wine_type!,
        months: wine!.aging_months ?? 0,
      }),
    enabled: !!wine?.id && !!wine.wine_type,
    staleTime: 1000 * 60 * 30,
  });

  return {
    grapes,
    grapesPending,
    vintageAge,
    dominantGrapeId,
    dominantGrape,
    dominantWineGrape,
    dominantGrapeName,
    decanting,
  };
};

export const useWineEstimatedRevenue = (wineId: number) => {
  return useQuery({
    queryKey: ['wineEstimatedRevenue', wineId],
    queryFn: () => wineDbFunctionsService.getEstimatedRevenue(wineId),
    enabled: !!wineId,
    staleTime: 1000 * 60 * 5,
  });
};
