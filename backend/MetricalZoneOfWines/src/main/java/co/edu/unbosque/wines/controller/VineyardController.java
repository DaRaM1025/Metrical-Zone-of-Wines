package co.edu.unbosque.wines.controller;

import co.edu.unbosque.wines.dto.VineyardDTO;
import co.edu.unbosque.wines.service.api.VineyardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vineyards")
@RequiredArgsConstructor
public class VineyardController {

    private final VineyardService vineyardService;

    @GetMapping
    public ResponseEntity<List<VineyardDTO>> getAll() {
        return ResponseEntity.ok(vineyardService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<VineyardDTO> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(vineyardService.findById(id));
    }

    @GetMapping("/region/{regionId}")
    public ResponseEntity<List<VineyardDTO>> getByRegionId(@PathVariable Integer regionId) {
        return ResponseEntity.ok(vineyardService.findByRegionId(regionId));
    }

    @PostMapping
    public ResponseEntity<VineyardDTO> create(@RequestBody VineyardDTO vineyard) {
        return new ResponseEntity<>(vineyardService.save(vineyard), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<VineyardDTO> update(@PathVariable Integer id, @RequestBody VineyardDTO vineyard) {
        vineyard.setId(id);
        return ResponseEntity.ok(vineyardService.save(vineyard));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        vineyardService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}