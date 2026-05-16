// src/api/mocks/index.ts

export * from './countryMocks';
export * from './regionMocks';
export * from './vineyardsMocks';
export * from './winesMocks';
export * from './grapeVarietiesMocks';
export * from './wineGrapesMocks';
export * from './regionMetricsMocks';
export * from './vineyardMetricsMocks';
export * from './wineMetricsMocks';
export * from './reviewsMocks';

// Helper para simular latencia
export const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Helper para obtener un mock por ID con latencia opcional
export async function mockGetById<T>(item: T | null, id: number, ms: number = 300): Promise<T> {
  await delay(ms);
  if (!item) throw new Error(`Item with id ${id} not found`);
  return item;
}

// Helper para obtener lista mockeada
export async function mockGetList<T>(items: T[], ms: number = 300): Promise<T[]> {
  await delay(ms);
  return [...items];
}