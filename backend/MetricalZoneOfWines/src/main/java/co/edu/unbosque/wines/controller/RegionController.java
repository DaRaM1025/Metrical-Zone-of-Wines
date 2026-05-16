package co.edu.unbosque.wines.controller;

import co.edu.unbosque.wines.dto.RegionDTO;
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
    public ResponseEntity<List<RegionDTO>> getAll() {
        return ResponseEntity.ok(regionService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RegionDTO> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(regionService.findById(id));
    }

    @GetMapping("/country/{countryId}")
    public ResponseEntity<List<RegionDTO>> getByCountryId(@PathVariable Integer countryId) {
        return ResponseEntity.ok(regionService.findByCountryId(countryId));
    }

    @PostMapping
    public ResponseEntity<RegionDTO> create(@RequestBody RegionDTO regionDTO) {
        return new ResponseEntity<>(regionService.save(regionDTO), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RegionDTO> update(@PathVariable Integer id, @RequestBody RegionDTO regionDTO) {
        regionDTO.setId(id);
        return ResponseEntity.ok(regionService.save(regionDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        regionService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}