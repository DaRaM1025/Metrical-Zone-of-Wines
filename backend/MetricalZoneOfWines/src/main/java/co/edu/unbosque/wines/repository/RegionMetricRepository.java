package co.edu.unbosque.wines.repository;

import co.edu.unbosque.wines.entity.RegionMetric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RegionMetricRepository extends JpaRepository<RegionMetric, Integer> {

    Optional<RegionMetric> findByRegionId(Integer regionId);

    // 1. Proyección DTO interna para capturar la agregación masiva
    interface RegionAggregatedStats {
        Integer getTotalVineyards();
        Integer getTotalWines();
        Integer getTotalReviews();
        Double getAvgScore();
        Double getTopScore();
        Double getAvgExpertScore();
        Double getAvgConsumerScore();
        Double getAvgPrice();
        Integer getMedalCount();
    }

    // 2. Query Maestro: Saca promedios y sumas cruzando Viñedos, Vinos y Métricas de Vinos
    @Query(value = "SELECT " +
            "COUNT(DISTINCT v.id) AS totalVineyards, " +
            "COUNT(DISTINCT w.id) AS totalWines, " +
            "SUM(wm.total_reviews) AS totalReviews, " +
            "AVG(wm.avg_score) AS avgScore, " +
            "MAX(wm.top_score) AS topScore, " +
            "AVG(wm.avg_expert_score) AS avgExpertScore, " +
            "AVG(wm.avg_consumer_score) AS avgConsumerScore, " +
            "AVG(w.avg_price_usd) AS avgPrice, " +
            "SUM(wm.medal_count) AS medalCount " +
            "FROM vineyards v " +
            "LEFT JOIN wines w ON v.id = w.vineyard_id " +
            "LEFT JOIN wine_metrics wm ON w.id = wm.wine_id " +
            "WHERE v.region_id = :regionId", nativeQuery = true)
    RegionAggregatedStats getAggregatedStatsByRegion(@Param("regionId") Integer regionId);

    // 3. Query: Descubrir la Uva Dominante de la Región (La que más se usa en sus vinos)
    @Query(value = "SELECT wg.grape_id FROM wine_grapes wg " +
            "JOIN wines w ON wg.wine_id = w.id " +
            "JOIN vineyards v ON w.vineyard_id = v.id " +
            "WHERE v.region_id = :regionId " +
            "GROUP BY wg.grape_id ORDER BY COUNT(wg.grape_id) DESC LIMIT 1", nativeQuery = true)
    Integer getDominantGrapeByRegion(@Param("regionId") Integer regionId);

    // 4. Query: Descubrir el Mejor Año (Vintage) de la Región basado en los puntajes
    @Query(value = "SELECT w.vintage_year FROM wines w " +
            "JOIN wine_metrics wm ON w.id = wm.wine_id " +
            "JOIN vineyards v ON w.vineyard_id = v.id " +
            "WHERE v.region_id = :regionId AND w.vintage_year IS NOT NULL " +
            "ORDER BY wm.avg_score DESC LIMIT 1", nativeQuery = true)
    Integer getBestVintageByRegion(@Param("regionId") Integer regionId);
}