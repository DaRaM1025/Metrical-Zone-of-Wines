package co.edu.unbosque.wines.controller;

import co.edu.unbosque.wines.entity.Wine;
import co.edu.unbosque.wines.service.api.WineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wines")
@RequiredArgsConstructor
public class WineController {

    private final WineService wineService;

    @GetMapping
    public ResponseEntity<List<Wine>> getAll() {
        return ResponseEntity.ok(wineService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Wine> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(wineService.findById(id));
    }

    @GetMapping("/vineyard/{vineyardId}")
    public ResponseEntity<List<Wine>> getByVineyardId(@PathVariable Integer vineyardId) {
        return ResponseEntity.ok(wineService.findByVineyardId(vineyardId));
    }

    @PostMapping
    public ResponseEntity<Wine> create(@RequestBody Wine wine) {
        return new ResponseEntity<>(wineService.save(wine), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Wine> update(@PathVariable Integer id, @RequestBody Wine wine) {
        wine.setId(id);
        return ResponseEntity.ok(wineService.save(wine));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        wineService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}