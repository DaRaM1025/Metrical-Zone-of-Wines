import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCreateReview } from '@/hooks/useCreateReview';

type ReviewType = 'vineyard' | 'wine';
type ReviewerType = 'enthusiast' | 'expert';
type ConsumptionOccasion = 'celebration' | 'food pairing' | 'casual drinking' | 'tasting' | 'gift';

interface ReviewFormData {
  reviewerType: ReviewerType;
  reviewerName: string;
  visitDate: string;
  scoreOverall: number;
  reviewYear?: number;
  color?: number;
  aroma?: number;
  taste?: number;
  finish?: number;
  structure?: number;
  occupation?: string;
  organization?: string;
  yearsExperience?: number;
  tastingNotes?: string;
  pairingSuggestions?: string;
  experienceDescription?: string;
  consumptionOccasion?: ConsumptionOccasion;
  wouldRecommend?: boolean;
}

interface ReviewDialogProps {
  type: ReviewType;
  id: number;
  triggerText?: string;
}

export function ReviewDialog({ type, id, triggerText = 'Dejar reseña' }: ReviewDialogProps) {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, reset, setValue, watch } = useForm<ReviewFormData>({
    defaultValues: {
      reviewerType: 'enthusiast',
      reviewerName: '',
      visitDate: new Date().toISOString().slice(0, 10),
      consumptionOccasion: 'tasting',
      wouldRecommend: true,
    },
  });
  const { mutate, isPending } = useCreateReview(type, id);
  const reviewerType = watch('reviewerType');

  const onSubmit = (data: ReviewFormData) => {
    if (type === 'wine') {
      const payload =
        data.reviewerType === 'expert'
          ? {
              reviewerType: data.reviewerType,
              reviewerName: data.reviewerName,
              scoreOverall: data.scoreOverall,
              occupation: data.occupation,
              organization: data.organization,
              yearsExperience: data.yearsExperience,
              reviewYear: data.reviewYear,
              scores: {
                color: data.color ?? 0,
                aroma: data.aroma ?? 0,
                taste: data.taste ?? 0,
                finish: data.finish ?? 0,
                structure: data.structure ?? 0,
              },
              tastingNotes: data.tastingNotes,
              pairingSuggestions: data.pairingSuggestions,
            }
          : {
              reviewerType: data.reviewerType,
              reviewerName: data.reviewerName,
              scoreOverall: data.scoreOverall,
              experienceDescription: data.experienceDescription,
              consumptionOccasion: data.consumptionOccasion,
              wouldRecommend: data.wouldRecommend,
            };

      mutate(payload, {
        onSuccess: () => {
          setOpen(false);
          reset({
            reviewerType: 'enthusiast',
            reviewerName: '',
            visitDate: new Date().toISOString().slice(0, 10),
            consumptionOccasion: 'tasting',
            wouldRecommend: true,
          });
        },
      });
      return;
    }

    const payload =
      data.reviewerType === 'expert'
        ? {
            reviewerType: data.reviewerType,
            reviewerName: data.reviewerName,
            visitDate: data.visitDate,
            scoreOverall: data.scoreOverall,
            occupation: data.occupation,
            organization: data.organization,
            yearsExperience: data.yearsExperience,
            tastingNotes: data.tastingNotes,
            pairingSuggestions: data.pairingSuggestions,
          }
        : {
            reviewerType: data.reviewerType,
            reviewerName: data.reviewerName,
            visitDate: data.visitDate,
            scoreOverall: data.scoreOverall,
            experienceDescription: data.experienceDescription,
            wouldRecommend: data.wouldRecommend,
          };

    mutate(payload, {
      onSuccess: () => {
        setOpen(false);
        reset({
          reviewerType: 'enthusiast',
          reviewerName: '',
          visitDate: new Date().toISOString().slice(0, 10),
          consumptionOccasion: 'tasting',
          wouldRecommend: true,
        });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{triggerText}</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Reseña para {type === 'vineyard' ? 'el viñedo' : 'el vino'}</DialogTitle>
          <DialogDescription>
            {type === 'vineyard'
              ? 'Cuéntanos tu experiencia en este viñedo.'
              : 'Registra una reseña para actualizar las métricas de este vino.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="space-y-1.5">
              <span className="text-sm font-medium">Tipo de reseña</span>
              <Select
                value={reviewerType}
                onValueChange={(value: ReviewerType) => setValue('reviewerType', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="enthusiast">Entusiasta</SelectItem>
                  <SelectItem value="expert">Experto</SelectItem>
                </SelectContent>
              </Select>
            </label>

            <label className="space-y-1.5">
              <span className="text-sm font-medium">Nombre</span>
              <Input placeholder="Tu nombre" {...register('reviewerName', { required: true })} />
            </label>

            {type === 'vineyard' && (
              <label className="space-y-1.5">
                <span className="text-sm font-medium">Fecha de visita</span>
                <Input type="date" {...register('visitDate', { required: true })} />
              </label>
            )}

            <label className="space-y-1.5">
              <span className="text-sm font-medium">Puntuación general</span>
              <Input
                type="number"
                step="0.1"
                min="0"
                max="100"
                placeholder="0 - 100"
                {...register('scoreOverall', { required: true, valueAsNumber: true })}
              />
            </label>
          </div>

          {reviewerType === 'expert' ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="space-y-1.5">
                <span className="text-sm font-medium">Ocupación</span>
                <Input placeholder="Sommelier, enólogo..." {...register('occupation', { required: true })} />
              </label>
              <label className="space-y-1.5">
                <span className="text-sm font-medium">Organización</span>
                <Input placeholder="Revista, concurso, bodega..." {...register('organization')} />
              </label>
              <label className="space-y-1.5 sm:col-span-2">
                <span className="text-sm font-medium">Años de experiencia</span>
                <Input
                  type="number"
                  min="0"
                  step="1"
                  placeholder="Ej. 8"
                  {...register('yearsExperience', { valueAsNumber: true })}
                />
              </label>
              {type === 'wine' && (
                <>
                  <label className="space-y-1.5 sm:col-span-2">
                    <span className="text-sm font-medium">Año de la reseña</span>
                    <Input
                      type="number"
                      min="1900"
                      max={new Date().getFullYear()}
                      step="1"
                      placeholder={String(new Date().getFullYear())}
                      {...register('reviewYear', { valueAsNumber: true })}
                    />
                  </label>
                  <div className="grid grid-cols-1 gap-4 sm:col-span-2 sm:grid-cols-5">
                    <label className="space-y-1.5">
                      <span className="text-sm font-medium">Color</span>
                      <Input type="number" min="0" max="10" step="0.1" {...register('color', { required: true, valueAsNumber: true })} />
                    </label>
                    <label className="space-y-1.5">
                      <span className="text-sm font-medium">Aroma</span>
                      <Input type="number" min="0" max="10" step="0.1" {...register('aroma', { required: true, valueAsNumber: true })} />
                    </label>
                    <label className="space-y-1.5">
                      <span className="text-sm font-medium">Sabor</span>
                      <Input type="number" min="0" max="10" step="0.1" {...register('taste', { required: true, valueAsNumber: true })} />
                    </label>
                    <label className="space-y-1.5">
                      <span className="text-sm font-medium">Final</span>
                      <Input type="number" min="0" max="10" step="0.1" {...register('finish', { required: true, valueAsNumber: true })} />
                    </label>
                    <label className="space-y-1.5">
                      <span className="text-sm font-medium">Estructura</span>
                      <Input type="number" min="0" max="10" step="0.1" {...register('structure', { required: true, valueAsNumber: true })} />
                    </label>
                  </div>
                </>
              )}
              <label className="space-y-1.5 sm:col-span-2">
                <span className="text-sm font-medium">Notas de cata</span>
                <Textarea placeholder={type === 'wine' ? 'Notas técnicas del vino...' : 'Observaciones técnicas de la visita...'} {...register('tastingNotes')} />
              </label>
              <label className="space-y-1.5 sm:col-span-2">
                <span className="text-sm font-medium">Sugerencias de maridaje</span>
                <Textarea placeholder="Recomendaciones del experto..." {...register('pairingSuggestions')} />
              </label>
            </div>
          ) : (
            <div className="space-y-4">
              <label className="space-y-1.5">
                <span className="text-sm font-medium">Descripción de la experiencia</span>
                <Textarea placeholder={type === 'wine' ? 'Cuéntanos cómo fue probar este vino...' : 'Cuéntanos cómo fue tu visita...'} {...register('experienceDescription', { required: true })} />
              </label>
              {type === 'wine' && (
                <label className="space-y-1.5">
                  <span className="text-sm font-medium">Ocasión de consumo</span>
                  <Select
                    value={watch('consumptionOccasion')}
                    onValueChange={(value: ConsumptionOccasion) => setValue('consumptionOccasion', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="celebration">Celebración</SelectItem>
                      <SelectItem value="food pairing">Maridaje</SelectItem>
                      <SelectItem value="casual drinking">Consumo casual</SelectItem>
                      <SelectItem value="tasting">Cata</SelectItem>
                      <SelectItem value="gift">Regalo</SelectItem>
                    </SelectContent>
                  </Select>
                </label>
              )}
              <label className="flex items-center gap-2 rounded-lg border border-border px-3 py-2">
                <input type="checkbox" className="size-4" {...register('wouldRecommend')} />
                <span>Recomendaría este {type === 'vineyard' ? 'viñedo' : 'vino'}</span>
              </label>
            </div>
          )}

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Enviando...' : 'Enviar reseña'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
