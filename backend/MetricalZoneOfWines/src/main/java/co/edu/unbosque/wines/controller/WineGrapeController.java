package co.edu.unbosque.wines.controller;

import co.edu.unbosque.wines.entity.WineGrape;
import co.edu.unbosque.wines.entity.WineGrapeId;
import co.edu.unbosque.wines.service.api.WineGrapeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wine-grapes")
@RequiredArgsConstructor
public class WineGrapeController {

    private final WineGrapeService wineGrapeService;

    @GetMapping
    public ResponseEntity<List<WineGrape>> getAll() {
        return ResponseEntity.ok(wineGrapeService.findAll());
    }

    @GetMapping("/{wineId}/{grapeId}")
    public ResponseEntity<WineGrape> getById(@PathVariable Integer wineId, @PathVariable Integer grapeId) {
        WineGrapeId id = new WineGrapeId(wineId, grapeId);
        return ResponseEntity.ok(wineGrapeService.findById(id));
    }

    @GetMapping("/wine/{wineId}")
    public ResponseEntity<List<WineGrape>> getByWineId(@PathVariable Integer wineId) {
        return ResponseEntity.ok(wineGrapeService.findByWineId(wineId));
    }

    @PostMapping
    public ResponseEntity<WineGrape> create(@RequestBody WineGrape wineGrape) {
        return new ResponseEntity<>(wineGrapeService.save(wineGrape), HttpStatus.CREATED);
    }

    @PutMapping("/{wineId}/{grapeId}")
    public ResponseEntity<WineGrape> update(@PathVariable Integer wineId, @PathVariable Integer grapeId, @RequestBody WineGrape wineGrape) {
        wineGrape.setId(new WineGrapeId(wineId, grapeId));
        return ResponseEntity.ok(wineGrapeService.save(wineGrape));
    }

    @DeleteMapping("/{wineId}/{grapeId}")
    public ResponseEntity<Void> delete(@PathVariable Integer wineId, @PathVariable Integer grapeId) {
        wineGrapeService.deleteById(new WineGrapeId(wineId, grapeId));
        return ResponseEntity.noContent().build();
    }
}