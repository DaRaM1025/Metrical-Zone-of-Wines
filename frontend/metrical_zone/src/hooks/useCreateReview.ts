// src/hooks/useCreateReview.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import type { WineReviewPayload } from '@/api/types';

type ReviewType = 'vineyard' | 'wine';  
type ReviewerType = 'enthusiast' | 'expert';

interface ReviewPayload {
  reviewerType?: ReviewerType;
  reviewerName?: string;
  visitDate?: string;
  scoreOverall?: number;
  occupation?: string;
  organization?: string;
  yearsExperience?: number;
  years_experience?: number;
  reviewYear?: number;
  tastingNotes?: string;
  tasting_notes?: string;
  pairingSuggestions?: string;
  pairing_suggestions?: string;
  experienceDescription?: string;
  consumptionOccasion?: string;
  wouldRecommend?: boolean;
  reviewer_name?: string;
  reviewer_type?: ReviewerType;
  score_overall?: number;
  experience_description?: string;
  consumption_occasion?: string;
  would_recommend?: boolean;
  review_year?: number;
  scores?: {
    color: number;
    aroma: number;
    taste: number;
    finish: number;
    structure: number;
  };
}

export const useCreateReview = (type: ReviewType, parentId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ReviewPayload) => {
      let payload;
      if (type === 'vineyard') {
        payload = { ...data, vineyardId: parentId };
        return apiClient.post('/vineyard-reviews', payload);
      } else if (type === 'wine') {
        payload = { ...data, wineId: parentId } as WineReviewPayload & { wineId: number };
        return apiClient.post('/wine-reviews', payload);
      }
      throw new Error('Tipo de reseña no soportado');
    },
    onSuccess: () => {
      if (type === 'vineyard') {
        queryClient.invalidateQueries({ queryKey: ['vineyardMetrics', parentId] });
        queryClient.refetchQueries({ queryKey: ['vineyardMetrics', parentId] });
      } else if (type === 'wine') {
        queryClient.invalidateQueries({ queryKey: ['wineMetrics', parentId] });
        queryClient.refetchQueries({ queryKey: ['wineMetrics', parentId] });
        queryClient.invalidateQueries({ queryKey: ['wineReviews', parentId] });
        queryClient.refetchQueries({ queryKey: ['wineReviews', parentId] });
      }
    },
  });
};
