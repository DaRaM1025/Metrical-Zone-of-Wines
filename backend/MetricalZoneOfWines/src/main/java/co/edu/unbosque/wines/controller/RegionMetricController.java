package co.edu.unbosque.wines.controller;

import co.edu.unbosque.wines.dto.RegionMetricDTO;
import co.edu.unbosque.wines.service.api.RegionMetricService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/region-metrics")
@RequiredArgsConstructor
public class RegionMetricController {

    private final RegionMetricService metricService;

    @GetMapping
    public ResponseEntity<List<RegionMetricDTO>> getAll() {
        return ResponseEntity.ok(metricService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RegionMetricDTO> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(metricService.findById(id));
    }

    @GetMapping("/region/{regionId}")
    public ResponseEntity<List<RegionMetricDTO>> getByRegionId(@PathVariable Integer regionId) {
        return ResponseEntity.ok(metricService.findByRegionId(regionId));
    }

    @PostMapping
    public ResponseEntity<RegionMetricDTO> create(@RequestBody RegionMetricDTO metric) {
        return new ResponseEntity<>(metricService.save(metric), HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        metricService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}