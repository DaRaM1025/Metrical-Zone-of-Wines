import { useState, useMemo, useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import {
  Search,
  Star,
  DollarSign,
  Award,
  TrendingUp,
  MapPin,
  Wine,
  CloudRain,
  Sun,
  Mountain,
} from "lucide-react";
export function Home() {
  const { data: regions = [], isLoading: loadingRegions } = useRegions();
  const { data: countries = [] } = useCountries();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountryId, setSelectedCountryId] = useState<string>("all");

  // Filtrar regiones
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

  // Función para obtener icono según tipo de clima
  const getClimateIcon = (climate: string | null) => {
    if (!climate) return null;
    switch (climate.toLowerCase()) {
      case "mediterranean":
        return <Sun className="h-3 w-3" />;
      case "oceanic":
        return <CloudRain className="h-3 w-3" />;
      case "alpine":
        return <Mountain className="h-3 w-3" />;
      default:
        return <Wine className="h-3 w-3" />;
    }
  };

  // Dentro del componente Home:
  const location = useLocation();

  useEffect(() => {
    if (location.hash === "#region-search") {
      const element = document.getElementById("region-search");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);
  return (
    <div className="space-y-12">
      {/* SECCIÓN HERO MEJORADA */}
      <div className="text-center space-y-6">
        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-green-400 to-purple-600 bg-clip-text text-transparent">
          WineApp
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          La plataforma definitiva para descubrir y comparar regiones vinícolas,
          viñedos y sus vinos.
        </p>
        <div className="flex flex-wrap gap-4 justify-center pt-2">
          <Button
            asChild
            variant="default"
            className="bg-green-600 hover:bg-green-700"
          >
            <Link to="/vineyards">Explorar viñedos</Link>
          </Button>
        </div>

        {/* Badges de características */}
        <div className="flex flex-wrap justify-center gap-3 pt-4">
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-800 px-3 py-1 text-sm text-gray-300">
            <Star className="h-4 w-4 text-yellow-400" /> Puntuaciones reales
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-800 px-3 py-1 text-sm text-gray-300">
            <DollarSign className="h-4 w-4 text-green-400" /> Precios actuales
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-800 px-3 py-1 text-sm text-gray-300">
            <Award className="h-4 w-4 text-purple-400" /> Medallas y rankings
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-800 px-3 py-1 text-sm text-gray-300">
            <TrendingUp className="h-4 w-4 text-blue-400" /> Actualización en
            vivo
          </span>
        </div>
      </div>

      {/* SECCIÓN DE BÚSQUEDA DE REGIONES */}
      <div
        id="region-search"
        className="border-t border-gray-800 pt-8 scroll-mt-20"
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold flex items-center justify-center gap-2">
            <MapPin className="h-6 w-6 text-green-400" />
            Busca una región
          </h2>
          <p className="text-gray-400">
            Pasa el cursor para ver cómo abrir la vista detallada; clic para
            entrar al dashboard completo.
          </p>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Nombre de la región (ej: Bordeaux)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select
            value={selectedCountryId}
            onValueChange={setSelectedCountryId}
          >
            <SelectTrigger className="w-[200px]">
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

        {/* Lista de regiones */}
        {loadingRegions ? (
          <div className="text-center py-8">Cargando regiones...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRegions.map((region) => {
                const country = countries.find(
                  (c) => c.id === region.country_id,
                );
                const climateIcon = getClimateIcon(region.climate_type);
                return (
                  <HoverCard key={region.id} openDelay={200} closeDelay={80}>
                    <HoverCardTrigger asChild>
                      <Link
                        to={`/regions/${region.id}`}
                        className="block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      >
                        <Card className="h-full cursor-pointer transition-all hover:scale-[1.02] hover:border-green-500">
                          <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                              {region.name}
                              {region.wine_style_profile && (
                                <span className="text-xs font-normal bg-gray-800 px-2 py-0.5 rounded-full">
                                  {region.wine_style_profile}
                                </span>
                              )}
                            </CardTitle>
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
                                <span className="bg-gray-800 px-2 py-1 rounded flex items-center gap-1">
                                  {climateIcon} {region.climate_type}
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
                  No se encontraron regiones con esos criterios.
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
