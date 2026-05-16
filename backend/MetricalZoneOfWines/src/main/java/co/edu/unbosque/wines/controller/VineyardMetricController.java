package co.edu.unbosque.wines.controller;

import co.edu.unbosque.wines.dto.VineyardMetricDTO;
import co.edu.unbosque.wines.service.api.VineyardMetricService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vineyard-metrics")
@RequiredArgsConstructor
public class VineyardMetricController {

    private final VineyardMetricService metricService;

    @GetMapping
    public ResponseEntity<List<VineyardMetricDTO>> getAll() {
        return ResponseEntity.ok(metricService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<VineyardMetricDTO> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(metricService.findById(id));
    }

    @GetMapping("/vineyard/{vineyardId}")
    public ResponseEntity<List<VineyardMetricDTO>> getByVineyardId(@PathVariable Integer vineyardId) {
        return ResponseEntity.ok(metricService.findByVineyardId(vineyardId));
    }

    @PostMapping
    public ResponseEntity<VineyardMetricDTO> create(@RequestBody VineyardMetricDTO metric) {
        return new ResponseEntity<>(metricService.save(metric), HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        metricService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}