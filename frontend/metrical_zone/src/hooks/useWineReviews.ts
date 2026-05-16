import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import type { ReviewerType, WineReview, WineScores } from '@/api/types';

type RawWineReview = Partial<WineReview> & {
  id?: string;
  reviewerType?: ReviewerType;
  reviewerName?: string;
  wineId?: number;
  scoreOverall?: number;
  submittedAt?: string;
  yearsExperience?: number;
  reviewYear?: number;
  tastingNotes?: string;
  pairingSuggestions?: string;
  experienceDescription?: string;
  consumptionOccasion?: WineReview['consumption_occasion'];
  wouldRecommend?: boolean;
};

type WineReviewsResponse =
  | RawWineReview[]
  | {
      content?: RawWineReview[];
      data?: RawWineReview[];
      reviews?: RawWineReview[];
    };

function normalizeScores(scores: unknown): WineScores | undefined {
  if (!scores || typeof scores !== 'object') return undefined;
  const raw = scores as Partial<Record<keyof WineScores, unknown>>;

  return {
    color: Number(raw.color),
    aroma: Number(raw.aroma),
    taste: Number(raw.taste),
    finish: Number(raw.finish),
    structure: Number(raw.structure),
  };
}

function normalizeReview(raw: RawWineReview): WineReview {
  return {
    _id: raw._id ?? raw.id ?? crypto.randomUUID(),
    reviewer_type: raw.reviewer_type ?? raw.reviewerType ?? 'enthusiast',
    reviewer_name: raw.reviewer_name ?? raw.reviewerName ?? 'Reviewer sin nombre',
    occupation: raw.occupation,
    organization: raw.organization,
    years_experience: raw.years_experience ?? raw.yearsExperience,
    wine_id: raw.wine_id ?? raw.wineId ?? 0,
    score_overall: raw.score_overall ?? raw.scoreOverall ?? 0,
    review_year: raw.review_year ?? raw.reviewYear,
    scores: normalizeScores(raw.scores),
    experience_description: raw.experience_description ?? raw.experienceDescription,
    consumption_occasion: raw.consumption_occasion ?? raw.consumptionOccasion,
    would_recommend: raw.would_recommend ?? raw.wouldRecommend,
    tasting_notes: raw.tasting_notes ?? raw.tastingNotes,
    pairing_suggestions: raw.pairing_suggestions ?? raw.pairingSuggestions,
    submitted_at: raw.submitted_at ?? raw.submittedAt ?? '',
  };
}

function getReviewRows(data: WineReviewsResponse): RawWineReview[] {
  if (Array.isArray(data)) return data;
  return data.content ?? data.data ?? data.reviews ?? [];
}

export const useWineReviews = (wineId: number) => {
  return useQuery({
    queryKey: ['wineReviews', wineId],
    queryFn: async (): Promise<WineReview[]> => {
      const { data } = await apiClient.get<WineReviewsResponse>(`/wine-reviews/wine/${wineId}`);
      return getReviewRows(data)
        .map(normalizeReview)
        .filter((review) => review.wine_id === wineId || review.wine_id === 0);
    },
    enabled: !!wineId,
  });
};
