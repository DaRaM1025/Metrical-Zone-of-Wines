import type { VineyardReview, WineReview } from '@/api/types';

export const mockVineyardReviews: VineyardReview[] = [
  {
    _id: 'rev_vineyard_1',
    reviewer_type: 'expert',
    reviewer_name: 'Robert Parker',
    occupation: 'Wine Critic',
    organization: 'Wine Advocate',
    years_experience: 40,
    vineyard_id: 1001,
    visit_date: '2023-09-15T00:00:00Z',
    score_overall: 96,
    tasting_notes: 'Classic vintage, deep and structured.',
    pairing_suggestions: 'Roasted lamb',
    submitted_at: '2023-10-01T10:00:00Z',
  },
  {
    _id: 'rev_vineyard_2',
    reviewer_type: 'enthusiast',
    reviewer_name: 'John Doe',
    vineyard_id: 1003,
    visit_date: '2024-03-10T00:00:00Z',
    score_overall: 88,
    experience_description: 'Great tour, amazing Rioja wines.',
    would_recommend: true,
    submitted_at: '2024-03-12T18:30:00Z',
  },
] satisfies VineyardReview[];

export const mockWineReviews: WineReview[] = [
  {
    _id: 'rev_wine_1',
    reviewer_type: 'expert',
    reviewer_name: 'James Suckling',
    occupation: 'Wine Journalist',
    organization: 'JamesSuckling.com',
    years_experience: 35,
    wine_id: 10001,
    score_overall: 99,
    review_year: 2020,
    scores: {
      color: 9.5,
      aroma: 9.8,
      taste: 10,
      finish: 9.9,
      structure: 9.7,
    },
    tasting_notes: 'Incredible depth, perfect balance.',
    pairing_suggestions: 'Beef Wellington',
    submitted_at: '2020-12-01T12:00:00Z',
  },
  {
    _id: 'rev_wine_2',
    reviewer_type: 'enthusiast',
    reviewer_name: 'Alice Smith',
    wine_id: 10003,
    score_overall: 92,
    experience_description: 'Excellent value, smooth and fruity.',
    consumption_occasion: 'food pairing',
    would_recommend: true,
    submitted_at: '2024-01-15T20:00:00Z',
  },
] satisfies WineReview[];