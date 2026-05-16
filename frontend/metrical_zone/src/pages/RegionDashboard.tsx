// src/pages/RegionDashboard.tsx
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useRegionMetrics } from "@/hooks/useRegionMetrics";
import { regionService } from "@/api/services/regionsService";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { ScoreChart } from "@/components/dashboard/ScoreChart";
import { Button } from "@/components/ui/button";
import { Award, Wine, Star, MapPin, DollarSign, Calendar, Trophy, ArrowLeft } from "lucide-react";

export function RegionDashboard() {
  const { regionId } = useParams();
  const id = Number(regionId);
  const { data: region } = useQuery({
    queryKey: ["region", id],
    queryFn: () => regionService.getById(id),
    enabled: !!id,
  });
  const { data, isLoading, error } = useRegionMetrics(id);

  if (isLoading) {
    return <div className="p-8 text-center">Cargando métricas de la región...</div>;
  }
  if (error) {
    return <div className="p-8 text-center text-red-500">Error al cargar los datos</div>;
  }
  if (!data) {
    return null;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Button asChild variant="outline" size="icon">
            <Link to="/regions" aria-label="Volver a regiones">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {region?.name ?? `Región #${data.region_id}`}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Dashboard de métricas · ID {data.region_id}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Viñedos" value={String(data.total_vineyards)} icon={<MapPin className="h-4 w-4" />} />
        <MetricCard title="Vinos" value={String(data.total_wines)} icon={<Wine className="h-4 w-4" />} />
        <MetricCard title="Reseñas" value={String(data.total_reviews)} icon={<Star className="h-4 w-4" />} />
        <MetricCard title="Medallas" value={String(data.medal_count)} icon={<Award className="h-4 w-4" />} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MetricCard title="Puntaje medio" value={data.avg_score} suffix=" pts" icon={<Star className="h-4 w-4" />} />
        <MetricCard title="Top puntaje" value={data.top_score} suffix=" pts" icon={<Trophy className="h-4 w-4" />} />
        <MetricCard title="Expertos" value={data.avg_expert_score} suffix=" pts" />
        <MetricCard title="Consumidores" value={data.avg_consumer_score} suffix=" pts" />
        <MetricCard title="Precio promedio" value={data.avg_price_usd} suffix=" USD" icon={<DollarSign className="h-4 w-4" />} />
        <MetricCard title="Rango precio" value={data.price_range} />
        <MetricCard title="Uva predominante" value={data.dominant_grape?.name} />
        <MetricCard title="Mejor año" value={data.best_vintage_year} icon={<Calendar className="h-4 w-4" />} />
        <MetricCard title="Índice prestigio" value={data.prestige_index} />
      </div>

      <ScoreChart
        avgScore={data.avg_score}
        avgExpert={data.avg_expert_score}
        avgConsumer={data.avg_consumer_score}
      />
    </div>
  );
}
