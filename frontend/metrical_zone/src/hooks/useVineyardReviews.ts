import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import type { ReviewerType, VineyardReview } from '@/api/types';

type RawVineyardReview = Partial<VineyardReview> & {
  id?: string;
  reviewerType?: ReviewerType;
  reviewerName?: string;
  vineyardId?: number;
  visitDate?: string;
  scoreOverall?: number;
  submittedAt?: string;
  yearsExperience?: number;
  experienceDescription?: string;
  wouldRecommend?: boolean;
  tastingNotes?: string;
  pairingSuggestions?: string;
};

type VineyardReviewsResponse =
  | RawVineyardReview[]
  | {
      content?: RawVineyardReview[];
      data?: RawVineyardReview[];
      reviews?: RawVineyardReview[];
    };

function normalizeReview(raw: RawVineyardReview): VineyardReview {
  return {
    _id: raw._id ?? raw.id ?? crypto.randomUUID(),
    reviewer_type: raw.reviewer_type ?? raw.reviewerType ?? 'enthusiast',
    reviewer_name: raw.reviewer_name ?? raw.reviewerName ?? 'Reseñador anónimo',
    occupation: raw.occupation,
    organization: raw.organization,
    years_experience: raw.years_experience ?? raw.yearsExperience,
    vineyard_id: raw.vineyard_id ?? raw.vineyardId ?? 0,
    visit_date: raw.visit_date ?? raw.visitDate ?? '',
    submitted_at: raw.submitted_at ?? raw.submittedAt ?? '',
    score_overall: raw.score_overall ?? raw.scoreOverall ?? 0,
    experience_description: raw.experience_description ?? raw.experienceDescription,
    would_recommend: raw.would_recommend ?? raw.wouldRecommend,
    tasting_notes: raw.tasting_notes ?? raw.tastingNotes,
    pairing_suggestions: raw.pairing_suggestions ?? raw.pairingSuggestions,
  };
}

function getReviewRows(data: VineyardReviewsResponse): RawVineyardReview[] {
  if (Array.isArray(data)) return data;
  return data.content ?? data.data ?? data.reviews ?? [];
}

export const useVineyardReviews = (vineyardId: number) => {
  return useQuery({
    queryKey: ['vineyardReviews', vineyardId],
    queryFn: async (): Promise<VineyardReview[]> => {
      const { data } = await apiClient.get<VineyardReviewsResponse>(`/vineyard-reviews/vineyard/${vineyardId}`);
      return getReviewRows(data)
        .map(normalizeReview)
        .filter((review) => review.vineyard_id === vineyardId || review.vineyard_id === 0);
    },
    enabled: !!vineyardId,
    staleTime: 1000 * 60 * 2,
  });
};
