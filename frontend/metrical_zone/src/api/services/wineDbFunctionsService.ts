import { apiClient } from '../client';

/** Respuesta estándar de las funciones almacenadas expuestas vía API */
export interface DbFunctionResult<T> {
  result: T;
}

async function unwrap<T>(req: Promise<{ data: DbFunctionResult<T> }>): Promise<T> {
  const { data } = await req;
  return data.result;
}

export const wineDbFunctionsService = {
  getVintageAgeYears: (year: number) =>
    unwrap(apiClient.get<DbFunctionResult<number>>('/db-functions/vintage-age', { params: { year } })),

  getDominantGrapeId: (wineId: number) =>
    unwrap(apiClient.get<DbFunctionResult<number>>(`/db-functions/dominant-grape/${wineId}`)),

  getEstimatedRevenue: (wineId: number) =>
    unwrap(apiClient.get<DbFunctionResult<number>>(`/db-functions/estimated-revenue/${wineId}`)),

  getFormatLabel: (params: { name: string; vintage: number; alcohol: number }) =>
    unwrap(
      apiClient.get<DbFunctionResult<string>>('/db-functions/format-label', {
        params: {
          name: params.name,
          vintage: params.vintage,
          alcohol: params.alcohol,
        },
      })
    ),

  getNeedsDecanting: (params: { type: string; months: number }) =>
    unwrap(
      apiClient.get<DbFunctionResult<boolean>>('/db-functions/needs-decanting', {
        params: { type: params.type, months: params.months },
      })
    ),
};
