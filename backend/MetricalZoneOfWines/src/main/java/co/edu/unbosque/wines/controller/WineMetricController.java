package co.edu.unbosque.wines.controller;

import co.edu.unbosque.wines.entity.WineMetric;
import co.edu.unbosque.wines.service.api.WineMetricService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wine-metrics")
@RequiredArgsConstructor
public class WineMetricController {

    private final WineMetricService metricService;

    @GetMapping
    public ResponseEntity<List<WineMetric>> getAll() {
        return ResponseEntity.ok(metricService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<WineMetric> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(metricService.findById(id));
    }

    @GetMapping("/wine/{wineId}")
    public ResponseEntity<List<WineMetric>> getByWineId(@PathVariable Integer wineId) {
        return ResponseEntity.ok(metricService.findByWineId(wineId));
    }

    @PostMapping
    public ResponseEntity<WineMetric> create(@RequestBody WineMetric metric) {
        return new ResponseEntity<>(metricService.save(metric), HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        metricService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}