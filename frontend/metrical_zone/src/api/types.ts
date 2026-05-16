
export interface RegionMetrics {
  id: number;
  region_id: number;
  computed_at: string;                  // ISO date string
  total_vineyards: number;
  total_wines: number;
  total_reviews: number;
  avg_score: number | null;
  top_score: number | null;
  avg_expert_score: number | null;
  avg_consumer_score: number | null;
  avg_price_usd: number | null;
  price_range: 'Budget' | 'Mid' | 'Premium' | 'Luxury' | null;
  dominant_grape: { id: number; name: string } | null;     // id de la uva predominante
  best_vintage_year: number | null;
  prestige_index: 'Emerging' | 'Recognized' | 'Acclaimed' | 'Legendary' | null;
  medal_count: number;
}

export interface VineyardMetrics {
  id: number;
  vineyard_id: number;
  computed_at: string;
  total_wines: number;
  total_reviews: number;
  avg_score: number | null;
  top_score: number | null;
  avg_expert_score: number | null;
  avg_consumer_score: number | null;
  avg_price_usd: number | null;
  price_range: 'Budget' | 'Mid' | 'Premium' | 'Luxury' | null;
  dominant_grape_id: number | null;
  dominant_grape?: GrapeVariety | null;
  prestige_index: 'Emerging' | 'Recognized' | 'Acclaimed' | 'Legendary' | null;
  medal_count: number;
  top_wine_type: 'Red' | 'White' | 'Rosé' | 'Sparkling' | 'Dessert' | 'Fortified' | null;
  avg_aging_months: number | null;
}

export interface WineMetrics {
  id: number;
  wine_id: number;
  wine?: Wine | null;
  computed_at: string;
  total_reviews: number;
  avg_score: number | null;
  top_score: number | null;
  avg_expert_score: number | null;
  avg_consumer_score: number | null;
  medal_count: number;
  prestige_index: 'Emerging' | 'Recognized' | 'Acclaimed' | 'Legendary' | null;
}

export interface Country{
    id: number;
    name: string;
    code: string;
}

export type ClimateType = 'Continental' | 'Mediterranean' | 'Oceanic' | 'Semi-arid' | 'Tropical' | 'Alpine';
export type WineStyleProfile = 'Bold reds' | 'Crisp whites' | 'Elegant reds' | 'Sparkling' | 'Sweet & dessert' | 'Rosé';

export interface Region {
  id: number;
  country_id: number;            // Referencia al país (podría ser objeto anidado después)
  name: string;
  description: string | null;
  climate_type: ClimateType | null;
  wine_style_profile: WineStyleProfile | null;
}

export type GrapeColor = 'Red' | 'White' | 'Rosé';

export interface GrapeVariety {
  id: number;
  name: string;                  // Ej: "Cabernet Sauvignon"
  color: GrapeColor | null;
  origin_country: string | null;
}
export type SoilType = 'Clay' | 'Sandy' | 'Limestone' | 'Granite' | 'Slate' | 'Volcanic' | 'Loam' | 'Gravel';
export type IrrigationType = 'Drip' | 'Flood' | 'Sprinkler' | 'Dry farming';
export type HarvestSeason = 'Spring' | 'Summer' | 'Autumn' | 'Winter';

export interface Vineyard {
  id: number;
  region_id: number;
  region?: Region | null;
  name: string;
  owner: string | null;
  founded_year: number | null;     // YEAR → number (ej. 1985)
  hectares: number | null;         // DECIMAL(8,2)
  altitude_avg_m: number | null;
  soil_type: SoilType | null;
  irrigation_type: IrrigationType | null;
  harvest_season: HarvestSeason | null;
  lat: number | null;              // DECIMAL(9,6) → number
  lng: number | null;
  website: string | null;
  label_image_url: string | null;
}

export type WineType = 'Red' | 'White' | 'Rosé' | 'Sparkling' | 'Dessert' | 'Fortified';
export type PriceRange = 'Budget' | 'Mid' | 'Premium' | 'Luxury';
export type AgingVessel = 'French oak' | 'American oak' | 'Stainless steel' | 'Concrete' | 'Amphora' | 'No aging';

export interface Wine {
  id: number;
  vineyard_id: number;
  vineyard?: Vineyard | null;
  name: string;
  vintage_year: number | null;     // YEAR
  wine_type: WineType | null;
  alcohol_pct: number | null;      // DECIMAL(4,2)
  avg_price_usd: number | null;    // DECIMAL(8,2)
  price_range: PriceRange | null;
  production_bottles: number | null;
  aging_months: number | null;
  aging_vessel: AgingVessel | null;
  natural_wine: boolean;           // TINYINT(1) → boolean (0=false, 1=true)
  tasting_notes: string | null;
  food_pairing: string | null;
  label_image_url: string | null;
  description: string | null;
}

export interface WineGrape {
  wine_id: number;
  grape_id: number;
  percentage: number | null;       // DECIMAL(5,2) (0-100)
}

// Si la API devuelve la composición con el nombre de la uva:
export interface WineGrapeWithDetails extends WineGrape {
  grape: GrapeVariety;  // objeto anidado
}


// ============================================================
// REVIEWS (MongoDB)
// ============================================================

// Tipos base comunes
export type ReviewerType = 'enthusiast' | 'expert';

// ----- VINEYARD REVIEWS -----

export interface VineyardReview {
  // MongoDB
  _id: string;                     // ObjectId como string
  reviewer_type: ReviewerType;
  reviewer_name: string;
  // Campos opcionales según tipo (expert vs enthusiast)
  occupation?: string;             // expert/organization only
  organization?: string;           // expert/organization only
  years_experience?: number;       // expert/organization only
  // Referencia a MySQL
  vineyard_id: number;
  // Fechas
  visit_date: string;              // Date → string ISO
  submitted_at: string;            // ISODate → string ISO
  // Puntuación principal
  score_overall: number;           // 0-100
  // Enthusiast-only
  experience_description?: string;
  would_recommend?: boolean;
  // Expert/organization-only
  tasting_notes?: string;
  pairing_suggestions?: string;
}

// Para enviar una nueva reseña (POST) al backend, no incluimos _id ni submitted_at
export type VineyardReviewPayload = Omit<VineyardReview, '_id' | 'submitted_at'>;

// ----- WINE REVIEWS -----

// Puntuaciones desglosadas para expertos
export interface WineScores {
  color: number;     // 0-10
  aroma: number;     // 0-10
  taste: number;     // 0-10
  finish: number;    // 0-10
  structure: number; // 0-10
}

export type ConsumptionOccasion = 'celebration' | 'food pairing' | 'casual drinking' | 'tasting' | 'gift';

export interface WineReview {
  // MongoDB
  _id: string;
  reviewer_type: ReviewerType;
  reviewer_name: string;
  // Expert/organization
  occupation?: string;
  organization?: string;
  years_experience?: number;
  // Referencia a MySQL
  wine_id: number;
  // Puntuaciones
  score_overall: number;           // 0-100
  review_year?: number;            // expert only
  scores?: WineScores;             // expert only, objeto anidado
  // Enthusiast-only
  experience_description?: string;
  consumption_occasion?: ConsumptionOccasion;
  would_recommend?: boolean;
  // Expert/organization-only
  tasting_notes?: string;
  pairing_suggestions?: string;
  // Fecha
  submitted_at: string;
}

// Para enviar una nueva reseña (POST)
export type WineReviewPayload = Omit<WineReview, '_id' | 'submitted_at'>;
