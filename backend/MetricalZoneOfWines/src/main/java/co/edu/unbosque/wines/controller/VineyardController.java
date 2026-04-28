package co.edu.unbosque.wines.controller;

import co.edu.unbosque.wines.entity.Vineyard;
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
    public ResponseEntity<List<Vineyard>> getAll() {
        return ResponseEntity.ok(vineyardService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vineyard> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(vineyardService.findById(id));
    }

    @GetMapping("/region/{regionId}")
    public ResponseEntity<List<Vineyard>> getByRegionId(@PathVariable Integer regionId) {
        return ResponseEntity.ok(vineyardService.findByRegionId(regionId));
    }

    @PostMapping
    public ResponseEntity<Vineyard> create(@RequestBody Vineyard vineyard) {
        return new ResponseEntity<>(vineyardService.save(vineyard), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Vineyard> update(@PathVariable Integer id, @RequestBody Vineyard vineyard) {
        vineyard.setId(id);
        return ResponseEntity.ok(vineyardService.save(vineyard));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        vineyardService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}