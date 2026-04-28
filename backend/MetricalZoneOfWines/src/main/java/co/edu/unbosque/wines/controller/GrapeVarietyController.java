package co.edu.unbosque.wines.controller;

import co.edu.unbosque.wines.entity.GrapeVariety;
import co.edu.unbosque.wines.service.api.GrapeVarietyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/grape-varieties")
@RequiredArgsConstructor
public class GrapeVarietyController {

    private final GrapeVarietyService grapeVarietyService;

    @GetMapping
    public ResponseEntity<List<GrapeVariety>> getAll() {
        return ResponseEntity.ok(grapeVarietyService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<GrapeVariety> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(grapeVarietyService.findById(id));
    }

    @PostMapping
    public ResponseEntity<GrapeVariety> create(@RequestBody GrapeVariety grapeVariety) {
        return new ResponseEntity<>(grapeVarietyService.save(grapeVariety), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<GrapeVariety> update(@PathVariable Integer id, @RequestBody GrapeVariety grapeVariety) {
        grapeVariety.setId(id);
        return ResponseEntity.ok(grapeVarietyService.save(grapeVariety));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        grapeVarietyService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}