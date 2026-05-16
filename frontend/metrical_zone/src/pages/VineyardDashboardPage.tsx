import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Award, Wine, Star, DollarSign, Calendar, TrendingUp, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { ReviewDialog } from "@/components/reviews/ReviewDialog";
import { useVineyardById } from "@/hooks/useVineyard";
import { useVineyardMetrics } from "@/hooks/useVineyardMetrics";
import { useVineyardReviews } from "@/hooks/useVineyardReviews";

function hasValue(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  return true;
}

function formatDate(value: string | null | undefined) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
}

function textPreview(value: string | null | undefined, maxLength = 120) {
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

function VineyardReviewCard({ review }: { review: any }) {
  const [expanded, setExpanded] = useState(false);
  const reviewerMeta = [review.organization, review.occupation].filter(hasValue);
  const summaryText = textPreview(
    review.experience_description ?? review.tasting_notes ?? review.pairing_suggestions,
  );
  const hasDetails =
    reviewerMeta.length > 0 ||
    hasValue(review.experience_description) ||
    hasValue(review.tasting_notes) ||
    hasValue(review.pairing_suggestions) ||
    hasValue(review.visit_date) ||
    hasValue(review.would_recommend);

  return (
    <article className="overflow-hidden rounded-2xl border border-border/70 bg-background">
      <button
        type="button"
        aria-expanded={expanded}
        onClick={() => hasDetails && setExpanded((current) => !current)}
        className="flex w-full flex-col gap-3 p-4 text-left transition-colors hover:bg-muted/30 sm:flex-row sm:items-start sm:justify-between"
        disabled={!hasDetails}
      >
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{review.reviewer_type === 'expert' ? 'Experto' : 'Entusiasta'}</Badge>
            {hasValue(review.visit_date) && <Badge variant="outline">{formatDate(review.visit_date)}</Badge>}
            {hasValue(review.would_recommend) && (
              <Badge variant="outline">{review.would_recommend ? 'Recomienda' : 'No recomienda'}</Badge>
            )}
          </div>
          <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <User className="h-4 w-4 text-muted-foreground" />
            {review.reviewer_name}
          </h3>
          {summaryText && <p className="line-clamp-2 text-sm leading-6 text-gray-300">{summaryText}</p>}
        </div>
        <div className="flex shrink-0 items-center justify-between gap-4 sm:text-right">
          <div>
            <p className="text-2xl font-bold text-foreground">{String(review.score_overall)} pts</p>
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
          <div className="grid gap-3 md:grid-cols-2">
            <DetailItem label="Organización" value={review.organization ?? review.occupation} />
            <DetailItem label="Visitado" value={formatDate(review.visit_date)} />
            <DetailItem label="Descripción" value={review.experience_description} />
            <DetailItem label="Notas de cata" value={review.tasting_notes} />
            <DetailItem label="Maridaje" value={review.pairing_suggestions} />
            <DetailItem
              label="Recomendación"
              value={hasValue(review.would_recommend)
                ? review.would_recommend
                  ? 'Sí recomienda'
                  : 'No recomienda'
                : null}
            />
          </div>
        </div>
      )}
    </article>
  );
}

function VineyardReviewsSection({ vineyardId }: { vineyardId: number }) {
  const { data: reviews = [], isLoading, isError } = useVineyardReviews(vineyardId);
  const sortedReviews = useMemo(() => {
    return [...reviews].sort((a, b) => {
      const aTime = new Date(a.submitted_at ?? a.visit_date ?? '').getTime();
      const bTime = new Date(b.submitted_at ?? b.visit_date ?? '').getTime();
      return (Number.isNaN(bTime) ? 0 : bTime) - (Number.isNaN(aTime) ? 0 : aTime);
    });
  }, [reviews]);

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-200">Reseñas del viñedo</h2>
          <p className="text-sm text-muted-foreground">
            {isLoading
              ? 'Cargando reseñas...'
              : reviews.length === 0
              ? 'No hay reseñas registradas'
              : `${reviews.length} reseña${reviews.length === 1 ? '' : 's'}`}
          </p>
        </div>
      </div>
      <div className="rounded-3xl border border-border/60 bg-muted/70 p-3">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Cargando reseñas...</p>
        ) : isError ? (
          <p className="text-sm text-red-500">Error al cargar reseñas.</p>
        ) : sortedReviews.length === 0 ? (
          <p className="text-sm text-muted-foreground">Este viñedo aún no tiene reseñas.</p>
        ) : (
          <div className="max-h-[28rem] space-y-3 overflow-y-auto pr-2">
            {sortedReviews.map((review) => (
              <VineyardReviewCard key={review._id} review={review} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function VineyardDashboardPage() {
  const { vineyardId } = useParams();
  const id = Number(vineyardId);
  const { data: vineyard, isLoading: vLoading, error: vError } = useVineyardById(id);
  const { data: metrics, isLoading: mLoading, error: mError } = useVineyardMetrics(id);

  if (vLoading) {
    return <div className="text-center py-12">Cargando viñedo…</div>;
  }
  if (vError || !vineyard) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-red-500">No se pudo cargar el viñedo.</p>
        <Button asChild variant="outline">
          <Link to="/vineyards">Volver a viñedos</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <Button asChild variant="outline" size="icon">
          <Link to="/vineyards">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-400 to-purple-600 bg-clip-text text-transparent">
            {vineyard.name}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Dashboard de métricas
            {vineyard.owner ? ` · ${vineyard.owner}` : ""}
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <ReviewDialog type="vineyard" id={id} triggerText="Crear reseña" />
          <Button asChild variant="secondary">
            <Link to={`/vineyards/${id}/wines`}>Ver vinos</Link>
          </Button>
        </div>
      </div>

      {mLoading ? (
        <p className="text-muted-foreground">Cargando métricas…</p>
      ) : mError || !metrics ? (
        <p className="text-red-500">No se pudieron cargar las métricas de este viñedo.</p>
      ) : (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-200">Métricas del viñedo</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard title="Vinos" value={String(metrics.total_wines)} icon={<Wine className="h-4 w-4" />} />
            <MetricCard title="Reseñas" value={String(metrics.total_reviews)} icon={<Star className="h-4 w-4" />} />
            <MetricCard title="Puntaje medio" value={metrics.avg_score} suffix=" pts" />
            <MetricCard title="Medallas" value={String(metrics.medal_count)} icon={<Award className="h-4 w-4" />} />
            <MetricCard title="Precio promedio" value={metrics.avg_price_usd} suffix=" USD" icon={<DollarSign className="h-4 w-4" />} />
            <MetricCard title="Top puntaje" value={metrics.top_score} suffix=" pts" icon={<TrendingUp className="h-4 w-4" />} />
            <MetricCard title="Uva dominante" value={metrics.dominant_grape?.name ?? (metrics.dominant_grape_id ? `Uva ${metrics.dominant_grape_id}` : null)} />
            <MetricCard title="Tipo predominante" value={metrics.top_wine_type} />
            <MetricCard title="Envejecimiento medio" value={metrics.avg_aging_months} suffix=" meses" icon={<Calendar className="h-4 w-4" />} />
            <MetricCard title="Índice prestigio" value={metrics.prestige_index} />
          </div>
        </div>
      )}
      <VineyardReviewsSection vineyardId={id} />
    </div>
  );
}
