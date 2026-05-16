// src/pages/RegionsPage.tsx
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useRegions } from "@/hooks/useRegions";
import { useCountries } from "@/hooks/useCountries";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardPortal,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { RegionMetricsHoverPreview } from "@/components/explore/MetricsHoverPreviews";
import type { Region } from "@/api/types";

export function RegionsPage() {
  const { data: regions = [], isLoading: loadingRegions } = useRegions();
  const { data: countries = [] } = useCountries();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountryId, setSelectedCountryId] = useState<string>("all");

  const filteredRegions = useMemo(() => {
    let filtered = regions;
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter((region) =>
        region.name.toLowerCase().includes(lowerQuery),
      );
    }
    if (selectedCountryId !== "all") {
      filtered = filtered.filter(
        (region) => region.country_id === Number(selectedCountryId),
      );
    }
    return filtered;
  }, [regions, searchQuery, selectedCountryId]);

  if (loadingRegions) {
    return <div className="text-center py-12">Cargando regiones...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-purple-600 bg-clip-text text-transparent">
          Explora las regiones vitivinícolas
        </h1>
        <p className="text-gray-300 mt-2">
          Busca o filtra por país. Pasa el cursor para ver cómo abrir la vista
          detallada; haz clic para abrir el dashboard completo.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Buscar región..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Select value={selectedCountryId} onValueChange={setSelectedCountryId}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por país" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los países</SelectItem>
            {countries.map((country) => (
              <SelectItem key={country.id} value={country.id.toString()}>
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRegions.map((region: Region) => {
          const country = countries.find((c) => c.id === region.country_id);
          return (
            <HoverCard key={region.id} openDelay={200} closeDelay={80}>
              <HoverCardTrigger asChild>
                <Link
                  to={`/regions/${region.id}`}
                  className="block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <Card className="h-full cursor-pointer transition-all hover:scale-[1.02] hover:border-green-500">
                    <CardHeader>
                      <CardTitle>{region.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {country?.name || "País desconocido"}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-400 line-clamp-2">
                        {region.description || "Sin descripción"}
                      </p>
                      <div className="flex gap-2 mt-2 text-xs">
                        {region.climate_type && (
                          <span className="bg-gray-800 px-2 py-1 rounded">
                            {region.climate_type}
                          </span>
                        )}
                        {region.wine_style_profile && (
                          <span className="bg-gray-800 px-2 py-1 rounded">
                            {region.wine_style_profile}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </HoverCardTrigger>
              <HoverCardPortal>
                <HoverCardContent side="top" align="start">
                  <RegionMetricsHoverPreview />
                </HoverCardContent>
              </HoverCardPortal>
            </HoverCard>
          );
        })}
        {filteredRegions.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-400">
            No se encontraron regiones.
          </div>
        )}
      </div>
    </div>
  );
}
