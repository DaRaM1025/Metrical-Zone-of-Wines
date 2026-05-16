package co.edu.unbosque.wines.controller;

import co.edu.unbosque.wines.dto.WineMetricDTO;
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
    public ResponseEntity<List<WineMetricDTO>> getAll() {
        return ResponseEntity.ok(metricService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<WineMetricDTO> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(metricService.findById(id));
    }

    @GetMapping("/wine/{wineId}")
    public ResponseEntity<List<WineMetricDTO>> getByWineId(@PathVariable Integer wineId) {
        return ResponseEntity.ok(metricService.findByWineId(wineId));
    }

    @PostMapping
    public ResponseEntity<WineMetricDTO> create(@RequestBody WineMetricDTO metric) {
        return new ResponseEntity<>(metricService.save(metric), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<WineMetricDTO> update(@PathVariable Integer id, @RequestBody WineMetricDTO metric) {
        metric.setId(id);
        return ResponseEntity.ok(metricService.save(metric));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        metricService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}