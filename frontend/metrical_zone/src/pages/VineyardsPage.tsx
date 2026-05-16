// src/pages/VineyardsPage.tsx
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useVineyards } from "@/hooks/useVineyard";
import { useRegions } from "@/hooks/useRegions";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardPortal,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { VineyardMetricsHoverPreview } from "@/components/explore/MetricsHoverPreviews";
import {
  MapPin,
  User,
  Calendar,
  Ruler,
  Sprout,
  Droplets,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Vineyard } from "@/api/types";

export function VineyardsPage() {
  const { data: vineyards = [], isLoading: loadingVineyards } = useVineyards();
  const { data: regions = [] } = useRegions();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegionId, setSelectedRegionId] = useState<string>("all");

  const filteredVineyards = useMemo(() => {
    let filtered = vineyards;
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter((vineyard) =>
        vineyard.name.toLowerCase().includes(lowerQuery),
      );
    }
    if (selectedRegionId !== "all") {
      filtered = filtered.filter(
        (vineyard) => vineyard.region_id === Number(selectedRegionId),
      );
    }
    return filtered;
  }, [vineyards, searchQuery, selectedRegionId]);

  const regionMap = useMemo(() => {
    return Object.fromEntries(regions.map((r) => [r.id, r.name]));
  }, [regions]);

  if (loadingVineyards) {
    return <div className="text-center py-12">Cargando viñedos...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-purple-600 bg-clip-text text-transparent">
          Explora los viñedos
        </h1>
        <p className="text-gray-300 mt-2">
          Pasa el cursor para ver cómo abrir la vista detallada. Clic en la
          tarjeta abre el dashboard; el botón inferior lleva al listado de vinos.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Buscar viñedo (ej: Marqués de Riscal)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Select value={selectedRegionId} onValueChange={setSelectedRegionId}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Filtrar por región" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las regiones</SelectItem>
            {regions.map((region) => (
              <SelectItem key={region.id} value={region.id.toString()}>
                {region.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVineyards.map((vineyard: Vineyard) => (
          <Card
            key={vineyard.id}
            className="overflow-hidden transition-all hover:shadow-xl hover:border-purple-500/80"
          >
            <HoverCard openDelay={200} closeDelay={80}>
              <HoverCardTrigger asChild>
                <Link
                  to={`/vineyards/${vineyard.id}`}
                  className="block outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                >
                  <CardHeader className="cursor-pointer">
                    <CardTitle className="text-xl">{vineyard.name}</CardTitle>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>
                        {regionMap[vineyard.region_id] || "Región desconocida"}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm cursor-pointer">
                    {vineyard.owner && (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span>
                          <strong>Dueño:</strong> {vineyard.owner}
                        </span>
                      </div>
                    )}
                    {vineyard.founded_year && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>
                          <strong>Fundación:</strong> {vineyard.founded_year}
                        </span>
                      </div>
                    )}
                    {vineyard.hectares && (
                      <div className="flex items-center gap-2">
                        <Ruler className="h-4 w-4 text-gray-400" />
                        <span>
                          <strong>Superficie:</strong> {vineyard.hectares} hectáreas
                        </span>
                      </div>
                    )}
                    {vineyard.soil_type && (
                      <div className="flex items-center gap-2">
                        <Sprout className="h-4 w-4 text-gray-400" />
                        <span>
                          <strong>Tipo de suelo:</strong> {vineyard.soil_type}
                        </span>
                      </div>
                    )}
                    {vineyard.irrigation_type && (
                      <div className="flex items-center gap-2">
                        <Droplets className="h-4 w-4 text-gray-400" />
                        <span>
                          <strong>Riego:</strong> {vineyard.irrigation_type}
                        </span>
                      </div>
                    )}
                    {!vineyard.owner &&
                      !vineyard.founded_year &&
                      !vineyard.hectares &&
                      !vineyard.soil_type &&
                      !vineyard.irrigation_type && (
                        <p className="text-gray-500 italic">
                          Información adicional no disponible
                        </p>
                      )}
                  </CardContent>
                </Link>
              </HoverCardTrigger>
              <HoverCardPortal>
                <HoverCardContent side="top" align="start">
                  <VineyardMetricsHoverPreview />
                </HoverCardContent>
              </HoverCardPortal>
            </HoverCard>
            <CardFooter className="border-t border-border bg-muted/20 pt-3">
              <Button asChild variant="outline" size="sm" className="w-full gap-2">
                <Link to={`/vineyards/${vineyard.id}/wines`}>
                  <Eye className="h-4 w-4" /> Ver vinos
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
        {filteredVineyards.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-400">
            No se encontraron viñedos con esos criterios.
          </div>
        )}
      </div>
    </div>
  );
}
