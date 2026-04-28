package co.edu.unbosque.wines.controller;

import co.edu.unbosque.wines.entity.Region;
import co.edu.unbosque.wines.service.api.RegionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/regions")
@RequiredArgsConstructor
public class RegionController {

    private final RegionService regionService;

    @GetMapping
    public ResponseEntity<List<Region>> getAll() {
        return ResponseEntity.ok(regionService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Region> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(regionService.findById(id));
    }

    @GetMapping("/country/{countryId}")
    public ResponseEntity<List<Region>> getByCountryId(@PathVariable Integer countryId) {
        return ResponseEntity.ok(regionService.findByCountryId(countryId));
    }

    @PostMapping
    public ResponseEntity<Region> create(@RequestBody Region region) {
        return new ResponseEntity<>(regionService.save(region), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Region> update(@PathVariable Integer id, @RequestBody Region region) {
        region.setId(id);
        return ResponseEntity.ok(regionService.save(region));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        regionService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}