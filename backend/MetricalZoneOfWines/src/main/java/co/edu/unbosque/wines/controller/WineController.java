package co.edu.unbosque.wines.controller;

import co.edu.unbosque.wines.dto.WineDTO;
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
    public ResponseEntity<List<WineDTO>> getAll() {
        return ResponseEntity.ok(wineService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<WineDTO> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(wineService.findById(id));
    }

    @GetMapping("/vineyard/{vineyardId}")
    public ResponseEntity<List<WineDTO>> getByVineyardId(@PathVariable Integer vineyardId) {
        return ResponseEntity.ok(wineService.findByVineyardId(vineyardId));
    }

    @PostMapping
    public ResponseEntity<WineDTO> create(@RequestBody WineDTO wine) {
        return new ResponseEntity<>(wineService.save(wine), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<WineDTO> update(@PathVariable Integer id, @RequestBody WineDTO wine) {
        wine.setId(id);
        return ResponseEntity.ok(wineService.save(wine));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        wineService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}