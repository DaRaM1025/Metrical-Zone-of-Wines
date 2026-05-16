// src/pages/VineyardWinesPage.tsx
import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useWineFormatLabel, canFetchFormatLabel } from '@/hooks/useWineFormatLabel';
import { useVineyardWines } from '@/hooks/useVineyardWines';
import { useVineyardById } from '@/hooks/useVineyard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  HoverCard,
  HoverCardContent,
  HoverCardPortal,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { WineMetricsHoverPreview } from '@/components/explore/MetricsHoverPreviews';
import { ArrowLeft, Search, Wine as WineIcon, DollarSign, Calendar, Beaker } from 'lucide-react';
import type { Wine } from '@/api/types';

export function VineyardWinesPage() {
  const { vineyardId } = useParams();
  const id = Number(vineyardId);
  const { data: vineyard, isLoading: loadingVineyard } = useVineyardById(id);
  const { data: wines = [], isLoading: loadingWines } = useVineyardWines(id);

  // Estados de filtrado
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWineType, setSelectedWineType] = useState<string>('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [selectedVintage, setSelectedVintage] = useState<string>('all');

  // Obtener años únicos de las añadas (vintage_year)
  const vintageYears = useMemo(() => {
    const years = wines.map(w => w.vintage_year).filter(y => y !== null) as number[];
    return [...new Set(years)].sort((a, b) => b - a);
  }, [wines]);

  // Filtrar vinos
  const filteredWines = useMemo(() => {
    let filtered = wines;
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(wine => wine.name.toLowerCase().includes(lowerQuery));
    }
    if (selectedWineType !== 'all') {
      filtered = filtered.filter(wine => wine.wine_type === selectedWineType);
    }
    if (selectedPriceRange !== 'all') {
      filtered = filtered.filter(wine => wine.price_range === selectedPriceRange);
    }
    if (selectedVintage !== 'all') {
      filtered = filtered.filter(wine => wine.vintage_year === Number(selectedVintage));
    }
    return filtered;
  }, [wines, searchQuery, selectedWineType, selectedPriceRange, selectedVintage]);

  if (loadingVineyard || loadingWines) {
    return <div className="text-center py-12">Cargando vinos...</div>;
  }

  if (!vineyard) {
    return <div className="text-center py-12 text-red-500">Viñedo no encontrado</div>;
  }

  return (
    <div className="space-y-8">
      {/* Encabezado con botón de retorno */}
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
          <Link to="/vineyards">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-purple-600 bg-clip-text text-transparent">
            Vinos de {vineyard.name}
          </h1>
          <p className="text-gray-300 mt-1">
            {vineyard.owner && `Propietario: ${vineyard.owner}`}
            {vineyard.founded_year && ` • Fundado: ${vineyard.founded_year}`}
            {vineyard.hectares && ` • ${vineyard.hectares} ha`}
          </p>
          <p className="text-sm text-muted-foreground max-w-2xl mt-2">
            Pasa el cursor sobre un vino para ver un resumen de métricas; clic para abrir el dashboard completo.
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Buscar por nombre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={selectedWineType} onValueChange={setSelectedWineType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tipo de vino" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los tipos</SelectItem>
              <SelectItem value="Red">Tinto</SelectItem>
              <SelectItem value="White">Blanco</SelectItem>
              <SelectItem value="Rosé">Rosado</SelectItem>
              <SelectItem value="Sparkling">Espumoso</SelectItem>
              <SelectItem value="Dessert">Dulce</SelectItem>
              <SelectItem value="Fortified">Fortificado</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedPriceRange} onValueChange={setSelectedPriceRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Rango de precio" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los precios</SelectItem>
              <SelectItem value="Budget">Económico</SelectItem>
              <SelectItem value="Mid">Medio</SelectItem>
              <SelectItem value="Premium">Premium</SelectItem>
              <SelectItem value="Luxury">Lujo</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedVintage} onValueChange={setSelectedVintage}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Añada" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las añadas</SelectItem>
              {vintageYears.map(year => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Lista de vinos */}
      {filteredWines.length === 0 ? (
        <div className="text-center py-8 text-gray-400">No se encontraron vinos con esos criterios.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWines.map(wine => (
            <WineCard key={wine.id} wine={wine} vineyardId={id} />
          ))}
        </div>
      )}
    </div>
  );
}

function WineCommercialTitle({ wine }: { wine: Wine }) {
  const q = useWineFormatLabel(wine);
  if (!canFetchFormatLabel(wine)) return <>{wine.name}</>;
  if (q.isPending) return <span className="text-gray-400">{wine.name}</span>;
  if (q.isError) return <>{wine.name}</>;
  return <>{q.data}</>;
}

// Componente para mostrar cada vino
function WineCard({ wine, vineyardId }: { wine: Wine; vineyardId: number }) {
  return (
    <HoverCard openDelay={200} closeDelay={80}>
      <HoverCardTrigger asChild>
        <Link
          to={`/vineyards/${vineyardId}/wines/${wine.id}`}
          className="block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <Card className="hover:shadow-xl transition-all hover:border-purple-500 h-full cursor-pointer">
            <CardHeader>
              <CardTitle className="flex justify-between items-start gap-2">
                <span className="break-words text-left">
                  <WineCommercialTitle wine={wine} />
                </span>
                {!canFetchFormatLabel(wine) && wine.vintage_year && (
                  <span className="text-sm font-normal bg-gray-800 px-2 py-1 rounded shrink-0">
                    {wine.vintage_year}
                  </span>
                )}
              </CardTitle>
              <div className="flex flex-wrap gap-2 mt-1">
                {wine.wine_type && (
                  <span className="text-xs bg-purple-900/50 px-2 py-1 rounded-full">{wine.wine_type}</span>
                )}
                {wine.price_range && (
                  <span className="text-xs bg-green-900/50 px-2 py-1 rounded-full">{wine.price_range}</span>
                )}
                {wine.natural_wine && (
                  <span className="text-xs bg-amber-900/50 px-2 py-1 rounded-full">Natural</span>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                {wine.alcohol_pct && (
                  <div className="flex items-center gap-1">
                    <Beaker className="h-3 w-3 text-gray-400" />
                    <span>{wine.alcohol_pct}% alc.</span>
                  </div>
                )}
                {wine.avg_price_usd && (
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3 text-gray-400" />
                    <span>${wine.avg_price_usd} USD</span>
                  </div>
                )}
                {wine.production_bottles && (
                  <div className="flex items-center gap-1">
                    <WineIcon className="h-3 w-3 text-gray-400" />
                    <span>{wine.production_bottles.toLocaleString()} botellas</span>
                  </div>
                )}
                {wine.aging_months && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-gray-400" />
                    <span>
                      {wine.aging_months} meses en {wine.aging_vessel || "barrica"}
                    </span>
                  </div>
                )}
              </div>
              {wine.tasting_notes && (
                <p className="text-sm text-gray-400 line-clamp-2">
                  <span className="font-semibold">Notas:</span> {wine.tasting_notes}
                </p>
              )}
              {wine.food_pairing && (
                <p className="text-xs text-gray-500">🍽️ {wine.food_pairing}</p>
              )}
            </CardContent>
          </Card>
        </Link>
      </HoverCardTrigger>
      <HoverCardPortal>
        <HoverCardContent side="top" align="start">
          <WineMetricsHoverPreview />
        </HoverCardContent>
      </HoverCardPortal>
    </HoverCard>
  );
}
