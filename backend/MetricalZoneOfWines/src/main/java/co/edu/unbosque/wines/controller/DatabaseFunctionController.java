package co.edu.unbosque.wines.controller;

import co.edu.unbosque.wines.service.api.DatabaseFunctionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/db-functions")
@RequiredArgsConstructor
public class DatabaseFunctionController {

    private final DatabaseFunctionService functionService;

    // Método auxiliar para crear respuestas que SI acepten valores nulos sin estallar
    private ResponseEntity<Map<String, Object>> safeResponse(Object value) {
        Map<String, Object> response = new HashMap<>();
        response.put("result", value);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/price-range")
    public ResponseEntity<?> getPriceRange(@RequestParam BigDecimal price) {
        return safeResponse(functionService.getPriceRange(price));
    }

    @GetMapping("/prestige-index")
    public ResponseEntity<?> getPrestigeIndex(@RequestParam BigDecimal score) {
        return safeResponse(functionService.getPrestigeIndex(score));
    }

    @GetMapping("/vintage-age")
    public ResponseEntity<?> getVintageAge(@RequestParam Integer year) {
        return safeResponse(functionService.calculateVintageAge(year));
    }

    @GetMapping("/dominant-grape/{wineId}")
    public ResponseEntity<?> getDominantGrape(@PathVariable Integer wineId) {
        return safeResponse(functionService.getDominantGrapeForWine(wineId));
    }

    @GetMapping("/estimated-revenue/{wineId}")
    public ResponseEntity<?> getEstimatedRevenue(@PathVariable Integer wineId) {
        return safeResponse(functionService.calculateEstimatedRevenue(wineId));
    }

    @GetMapping("/vineyard-age")
    public ResponseEntity<?> getVineyardAge(@RequestParam Integer year) {
        return safeResponse(functionService.getVineyardAge(year));
    }

    @GetMapping("/format-label")
    public ResponseEntity<?> formatLabel(@RequestParam String name, @RequestParam Integer vintage, @RequestParam BigDecimal alcohol) {
        return safeResponse(functionService.formatWineLabel(name, vintage, alcohol));
    }

    @GetMapping("/total-bottles/vineyard/{vineyardId}")
    public ResponseEntity<?> getTotalBottles(@PathVariable Integer vineyardId) {
        return safeResponse(functionService.getTotalBottlesByVineyard(vineyardId));
    }

    @GetMapping("/convert-hectares")
    public ResponseEntity<?> convertHectares(@RequestParam BigDecimal hectares) {
        return safeResponse(functionService.convertHectaresToAcres(hectares));
    }

    @GetMapping("/needs-decanting")
    public ResponseEntity<?> needsDecanting(@RequestParam String type, @RequestParam Integer months) {
        return safeResponse(functionService.checkNeedsDecanting(type, months));
    }
}