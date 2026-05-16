import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Award,
  BadgeDollarSign,
  Beaker,
  Calendar,
  ChevronDown,
  Clock3,
  DollarSign,
  Droplets,
  Factory,
  Grape,
  Medal,
  Sparkles,
  Star,
  Trophy,
  UserRound,
  Wine,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { ReviewDialog } from '@/components/reviews/ReviewDialog';
import { useWine } from '@/hooks/useWine';
import { useWineMetrics } from '@/hooks/useWineMetrics';
import { useWineReviews } from '@/hooks/useWineReviews';
import { useWineFormatLabel, canFetchFormatLabel } from '@/hooks/useWineFormatLabel';
import { useWineDbInsights, useWineEstimatedRevenue } from '@/hooks/useWineDbInsights';
import type { WineReview } from '@/api/types';

function formatNumber(value: number | null | undefined, maximumFractionDigits = 1) {
  if (value == null) return '—';
  return value.toLocaleString(undefined, { maximumFractionDigits });
}

function formatCurrency(value: number | null | undefined) {
  if (value == null) return '—';
  return value.toLocaleString(undefined, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });
}

function formatDateTime(value: string | null | undefined) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

function formatDate(value: string | null | undefined) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[minmax(8rem,0.9fr)_minmax(0,1.2fr)] gap-3 border-b border-border/60 py-3 last:border-b-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="min-w-0 text-right font-medium text-foreground break-words">{value ?? '—'}</dd>
    </div>
  );
}

function TextPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="pb-1">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm leading-6 text-gray-300">{children}</CardContent>
    </Card>
  );
}

function hasValue(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  return true;
}

function textPreview(value: string | null | undefined, maxLength = 150): string | null {
  if (!hasValue(value)) return null;
  const text = String(value).trim();
  return text.length > maxLength ? `${text.slice(0, maxLength).trim()}...` : text;
}

function DetailItem({ label, value }: { label: string; value: React.ReactNode }) {
  if (!hasValue(value)) return null;

  return (
    <div className="rounded-md border border-border/60 px-3 py-2">
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm leading-6 text-gray-200">{value}</dd>
    </div>
  );
}

function WineReviewCard({ review }: { review: WineReview }) {
  const [expanded, setExpanded] = useState(false);
  const reviewerMeta = [
    review.occupation,
    review.organization,
    hasValue(review.years_experience) ? `${review.years_experience} años exp.` : null,
  ].filter(hasValue);

  const scoreEntries = review.scores
    ? [
        ['Color', review.scores.color],
        ['Aroma', review.scores.aroma],
        ['Sabor', review.scores.taste],
        ['Final', review.scores.finish],
        ['Estructura', review.scores.structure],
      ].filter(([, value]) => hasValue(value))
    : [];

  const summaryText = textPreview(review.experience_description ?? review.tasting_notes);
  const hasDetails =
    reviewerMeta.length > 0 ||
    scoreEntries.length > 0 ||
    hasValue(review.experience_description) ||
    hasValue(review.tasting_notes) ||
    hasValue(review.pairing_suggestions) ||
    hasValue(review.consumption_occasion) ||
    hasValue(review.review_year) ||
    hasValue(review.would_recommend);

  return (
    <article className="overflow-hidden rounded-md border border-border/70">
      <button
        type="button"
        aria-expanded={expanded}
        onClick={() => hasDetails && setExpanded((value) => !value)}
        className="flex w-full flex-col gap-3 p-4 text-left transition-colors hover:bg-muted/30 disabled:cursor-default disabled:hover:bg-transparent sm:flex-row sm:items-start sm:justify-between"
        disabled={!hasDetails}
      >
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={review.reviewer_type === 'expert' ? 'default' : 'secondary'}>
              {review.reviewer_type === 'expert' ? 'Experto' : 'Entusiasta'}
            </Badge>
            {hasValue(review.review_year) && <Badge variant="outline">{review.review_year}</Badge>}
            {hasValue(review.consumption_occasion) && (
              <Badge variant="outline">{review.consumption_occasion}</Badge>
            )}
            {hasValue(review.would_recommend) && (
              <Badge variant="outline">
                {review.would_recommend ? 'Recomienda' : 'No recomienda'}
              </Badge>
            )}
          </div>
          <h3 className="flex items-center gap-2 font-semibold text-foreground">
            <UserRound className="h-4 w-4 text-muted-foreground" />
            {review.reviewer_name}
          </h3>
          {summaryText && (
            <p className="line-clamp-2 text-sm leading-6 text-gray-300">{summaryText}</p>
          )}
        </div>
        <div className="flex shrink-0 items-center justify-between gap-4 sm:text-right">
          <div>
            <p className="text-2xl font-bold text-foreground">{formatNumber(review.score_overall)} pts</p>
            <p className="text-xs text-muted-foreground">{formatDate(review.submitted_at)}</p>
          </div>
          {hasDetails && (
            <ChevronDown
              className={`h-4 w-4 text-muted-foreground transition-transform ${expanded ? 'rotate-180' : ''}`}
            />
          )}
        </div>
      </button>

      {expanded && hasDetails && (
        <div className="border-t border-border/70 p-4">
          <dl className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <DetailItem label="Reviewer" value={reviewerMeta.join(' · ')} />
            <DetailItem label="Año de reseña" value={review.review_year} />
            <DetailItem label="Ocasión" value={review.consumption_occasion} />
            <DetailItem
              label="Recomendación"
              value={hasValue(review.would_recommend) ? (review.would_recommend ? 'Sí recomienda' : 'No recomienda') : null}
            />
            <DetailItem label="Descripción de experiencia" value={review.experience_description} />
            <DetailItem label="Notas de cata" value={review.tasting_notes} />
            <DetailItem label="Sugerencias de maridaje" value={review.pairing_suggestions} />
          </dl>

          {scoreEntries.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Scores técnicos
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-5">
                {scoreEntries.map(([label, value]) => (
                  <span key={label} className="rounded border border-border/60 px-2 py-1">
                    {label} {formatNumber(Number(value))}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

function WineReviewsSection({
  reviews,
  isLoading,
  isError,
}: {
  reviews: WineReview[];
  isLoading: boolean;
  isError: boolean;
}) {
  const sortedReviews = [...reviews].sort((a, b) => {
    const aTime = new Date(a.submitted_at ?? '').getTime();
    const bTime = new Date(b.submitted_at ?? '').getTime();
    return (Number.isNaN(bTime) ? 0 : bTime) - (Number.isNaN(aTime) ? 0 : aTime);
  });

  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold text-gray-200">Reseñas del vino</h2>
        <p className="text-sm text-muted-foreground">
          {reviews.length === 1 ? '1 reseña registrada' : `${reviews.length} reseñas registradas`}
        </p>
      </div>
      <Card>
        <CardContent className="pt-4">
          {isLoading ? (
            <p className="text-muted-foreground">Cargando reseñas...</p>
          ) : isError ? (
            <p className="text-red-500">No se pudieron cargar las reseñas de este vino.</p>
          ) : sortedReviews.length === 0 ? (
            <p className="text-muted-foreground">Este vino todavía no tiene reseñas registradas.</p>
          ) : (
            <div className="max-h-[34rem] space-y-4 overflow-y-auto pr-2">
              {sortedReviews.map((review) => (
                <WineReviewCard key={review._id} review={review} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

export function WineDashboardPage() {
  const { vineyardId, wineId } = useParams();
  const vId = Number(vineyardId);
  const wId = Number(wineId);

  const { data: wine, isLoading: wineLoading, error: wineError } = useWine(wId);
  const { data: metrics, isLoading: metricsLoading } = useWineMetrics(wId);
  const { data: wineReviews = [], isLoading: reviewsLoading, isError: reviewsError } = useWineReviews(wId);
  const formatLabelQuery = useWineFormatLabel(wine);
  const revenue = useWineEstimatedRevenue(wId);
  const insights = useWineDbInsights(wine);
  const { grapes, grapesPending } = insights;

  const wrongVineyard =
    wine && !Number.isNaN(vId) && wine.vineyard_id !== vId;

  const displayTitle =
    canFetchFormatLabel(wine) && formatLabelQuery.data
      ? formatLabelQuery.data
      : wine?.name ?? '';

  const dominantLabel =
    insights.dominantGrapeId.isPending ||
    (insights.dominantGrapeId.data != null && insights.dominantGrape.isPending && insights.grapesPending)
      ? '…'
      : insights.dominantGrapeName ??
        (insights.dominantGrapeId.data != null ? `Uva ${insights.dominantGrapeId.data}` : '—');

  const dominantGrapeDetail = [
    insights.dominantWineGrape.data?.percentage != null
      ? `${formatNumber(insights.dominantWineGrape.data.percentage)}% del blend`
      : null,
    insights.dominantGrape.data?.color,
    insights.dominantGrape.data?.origin_country,
  ].filter(Boolean).join(' · ');

  const decantingLabel = insights.decanting.isPending
    ? '…'
    : !wine?.wine_type
      ? 'Sin tipo de vino'
      : insights.decanting.data === true
        ? 'Conviene decantar'
        : 'No es imprescindible';

  if (wineLoading) {
    return <div className="text-center py-12">Cargando vino...</div>;
  }

  if (wineError || !wine) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-red-500">No se pudo cargar el vino.</p>
        <Button asChild variant="outline">
          <Link to="/vineyards">Volver a viñedos</Link>
        </Button>
      </div>
    );
  }

  if (wrongVineyard) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-amber-500">Este vino no pertenece al viñedo indicado en la URL.</p>
        <Button asChild variant="outline">
          <Link to={`/vineyards/${wine.vineyard_id}/wines`}>Ir al viñedo correcto</Link>
        </Button>
      </div>
    );
  }

  const imageUrl = wine.label_image_url?.trim();
  const vineyardName = wine.vineyard?.name;

  return (
    <div className="space-y-8 pb-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <Button asChild variant="outline" size="icon" className="shrink-0">
          <Link to={`/vineyards/${vId}/wines`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>

        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap gap-2">
            {wine.wine_type && <Badge variant="secondary">{wine.wine_type}</Badge>}
            {wine.price_range && <Badge variant="outline">{wine.price_range}</Badge>}
            {wine.natural_wine && <Badge variant="outline">Natural</Badge>}
            {wine.vintage_year && <Badge variant="outline">Añada {wine.vintage_year}</Badge>}
          </div>
          <h1 className="text-2xl font-bold leading-tight text-foreground sm:text-3xl">
            {canFetchFormatLabel(wine) && formatLabelQuery.isPending ? (
              <span className="inline-block h-9 w-3/4 max-w-xl rounded bg-muted animate-pulse align-middle" />
            ) : (
              displayTitle
            )}
          </h1>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <span>ID vino: {wine.id}</span>
            {vineyardName && <span>Viñedo: {vineyardName}</span>}
            {metrics?.computed_at && <span>Métricas: {formatDateTime(metrics.computed_at)}</span>}
          </div>
          {canFetchFormatLabel(wine) && formatLabelQuery.isError && (
            <p className="text-sm text-amber-500">Etiqueta comercial no disponible; se muestra el nombre en catálogo.</p>
          )}
        </div>
        <ReviewDialog type="wine" id={wId} triggerText="Crear reseña" />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(22rem,0.75fr)]">
        <div className="space-y-6">
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-200">Métricas de recepción</h2>
            {metricsLoading || !metrics ? (
              <Card>
                <CardContent className="py-6 text-muted-foreground">Cargando métricas...</CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <MetricCard title="Reseñas" value={String(metrics.total_reviews)} icon={<Star className="h-4 w-4" />} />
                <MetricCard title="Puntaje medio" value={metrics.avg_score} suffix=" pts" icon={<Award className="h-4 w-4" />} />
                <MetricCard title="Top puntaje" value={metrics.top_score} suffix=" pts" icon={<Trophy className="h-4 w-4" />} />
                <MetricCard title="Medallas" value={String(metrics.medal_count)} icon={<Medal className="h-4 w-4" />} />
                <MetricCard title="Expertos" value={metrics.avg_expert_score} suffix=" pts" />
                <MetricCard title="Consumidores" value={metrics.avg_consumer_score} suffix=" pts" />
                <MetricCard title="Prestigio" value={metrics.prestige_index} />
                <MetricCard title="Actualización" value={formatDateTime(metrics.computed_at)} />
              </div>
            )}
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-200">Indicadores del vino</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                title="Edad de cosecha"
                value={
                  wine.vintage_year == null
                    ? null
                    : insights.vintageAge.isPending
                      ? '...'
                      : `${insights.vintageAge.data} años`
                }
                icon={<Calendar className="h-4 w-4" />}
              />
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Uva dominante</CardTitle>
                  <Grape className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold break-words">{dominantLabel}</div>
                  {dominantGrapeDetail && (
                    <p className="mt-1 text-sm text-muted-foreground">{dominantGrapeDetail}</p>
                  )}
                </CardContent>
              </Card>
              <MetricCard title="Decantación" value={decantingLabel} icon={<Droplets className="h-4 w-4" />} />
              <MetricCard
                title="Ingresos estimados"
                value={
                  revenue.isPending
                    ? '...'
                    : revenue.isError || typeof revenue.data !== 'number'
                      ? null
                      : formatCurrency(revenue.data)
                }
                icon={<BadgeDollarSign className="h-4 w-4" />}
              />
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {wine.description && (
              <TextPanel title="Descripción">
                <p>{wine.description}</p>
              </TextPanel>
            )}
            {wine.tasting_notes && (
              <TextPanel title="Notas de cata">
                <p>{wine.tasting_notes}</p>
              </TextPanel>
            )}
            {wine.food_pairing && (
              <TextPanel title="Maridaje">
                <p>{wine.food_pairing}</p>
              </TextPanel>
            )}
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-200">Composición</h2>
            <Card>
              <CardContent className="pt-4">
                {grapesPending ? (
                  <p className="text-muted-foreground">Cargando composición...</p>
                ) : grapes.length === 0 ? (
                  <p className="text-muted-foreground">Sin datos de uvas registrados.</p>
                ) : (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {grapes.map((g) => (
                      <div key={g.grape_id} className="rounded-md border border-border/70 px-3 py-2">
                        <p className="font-medium">{g.grape?.name ?? `Uva ${g.grape_id}`}</p>
                        <p className="text-sm text-muted-foreground">
                          {g.percentage != null ? `${formatNumber(g.percentage)}% del blend` : 'Porcentaje no disponible'}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        </div>

        <aside className="space-y-6">
          {imageUrl && (
            <Card>
              <img src={imageUrl} alt={`Etiqueta de ${wine.name}`} className="aspect-[4/3] w-full object-cover" />
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Ficha técnica</CardTitle>
              <CardDescription>Datos registrados en catálogo</CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="text-sm">
                <DetailRow label="Nombre" value={wine.name} />
                <DetailRow label="Viñedo" value={vineyardName ?? `ID ${wine.vineyard_id}`} />
                <DetailRow label="Añada" value={wine.vintage_year ?? '—'} />
                <DetailRow label="Tipo" value={wine.wine_type ?? '—'} />
                <DetailRow label="Alcohol" value={wine.alcohol_pct != null ? `${formatNumber(wine.alcohol_pct, 2)}%` : '—'} />
                <DetailRow label="Precio promedio" value={formatCurrency(wine.avg_price_usd)} />
                <DetailRow label="Rango precio" value={wine.price_range ?? '—'} />
                <DetailRow label="Producción" value={wine.production_bottles != null ? `${formatNumber(wine.production_bottles, 0)} botellas` : '—'} />
                <DetailRow label="Crianza" value={wine.aging_months != null ? `${wine.aging_months} meses` : '—'} />
                <DetailRow label="Recipiente" value={wine.aging_vessel ?? '—'} />
                <DetailRow label="Vino natural" value={wine.natural_wine ? 'Sí' : 'No'} />
                <DetailRow label="Imagen etiqueta" value={imageUrl ? 'Disponible' : 'No disponible'} />
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lectura rápida</CardTitle>
              <CardDescription>Señales útiles para comparar</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-3 text-sm">
              <div className="flex items-center gap-3 rounded-md border border-border/70 px-3 py-2">
                <Wine className="h-4 w-4 text-muted-foreground" />
                <span>{wine.wine_type ?? 'Tipo no registrado'}</span>
              </div>
              <div className="flex items-center gap-3 rounded-md border border-border/70 px-3 py-2">
                <Beaker className="h-4 w-4 text-muted-foreground" />
                <span>{wine.alcohol_pct != null ? `${formatNumber(wine.alcohol_pct, 2)}% alcohol` : 'Alcohol no registrado'}</span>
              </div>
              <div className="flex items-center gap-3 rounded-md border border-border/70 px-3 py-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span>{formatCurrency(wine.avg_price_usd)}</span>
              </div>
              <div className="flex items-center gap-3 rounded-md border border-border/70 px-3 py-2">
                <Factory className="h-4 w-4 text-muted-foreground" />
                <span>{wine.production_bottles != null ? `${formatNumber(wine.production_bottles, 0)} botellas` : 'Producción no registrada'}</span>
              </div>
              <div className="flex items-center gap-3 rounded-md border border-border/70 px-3 py-2">
                <Clock3 className="h-4 w-4 text-muted-foreground" />
                <span>{wine.aging_months != null ? `${wine.aging_months} meses en ${wine.aging_vessel ?? 'recipiente no registrado'}` : 'Crianza no registrada'}</span>
              </div>
              <div className="flex items-center gap-3 rounded-md border border-border/70 px-3 py-2">
                <Sparkles className="h-4 w-4 text-muted-foreground" />
                <span>{wine.natural_wine ? 'Vino natural' : 'No natural'}</span>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>

      <WineReviewsSection reviews={wineReviews} isLoading={reviewsLoading} isError={reviewsError} />
    </div>
  );
}
