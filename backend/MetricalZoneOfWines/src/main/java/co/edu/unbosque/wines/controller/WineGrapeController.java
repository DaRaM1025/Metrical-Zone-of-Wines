package co.edu.unbosque.wines.controller;

import co.edu.unbosque.wines.dto.WineGrapeDTO;
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
    public ResponseEntity<List<WineGrapeDTO>> getAll() {
        return ResponseEntity.ok(wineGrapeService.findAll());
    }

    @GetMapping("/{wineId}/{grapeId}")
    public ResponseEntity<WineGrapeDTO> getById(@PathVariable Integer wineId, @PathVariable Integer grapeId) {
        WineGrapeId id = new WineGrapeId(wineId, grapeId);
        return ResponseEntity.ok(wineGrapeService.findById(id));
    }

    @GetMapping("/wine/{wineId}")
    public ResponseEntity<List<WineGrapeDTO>> getByWineId(@PathVariable Integer wineId) {
        return ResponseEntity.ok(wineGrapeService.findByWineId(wineId));
    }

    @PostMapping
    public ResponseEntity<WineGrapeDTO> create(@RequestBody WineGrapeDTO wineGrapeDTO) {
        return new ResponseEntity<>(wineGrapeService.save(wineGrapeDTO), HttpStatus.CREATED);
    }

    @PutMapping("/{wineId}/{grapeId}")
    public ResponseEntity<WineGrapeDTO> update(@PathVariable Integer wineId, @PathVariable Integer grapeId, @RequestBody WineGrapeDTO wineGrapeDTO) {
        // Aseguramos que el JSON mantenga coherencia con la URL
        if (wineGrapeDTO.getWine() == null) {
            wineGrapeDTO.setWine(co.edu.unbosque.wines.dto.WineDTO.builder().id(wineId).build());
        }
        if (wineGrapeDTO.getGrape() == null) {
            wineGrapeDTO.setGrape(co.edu.unbosque.wines.dto.GrapeVarietyDTO.builder().id(grapeId).build());
        }
        return ResponseEntity.ok(wineGrapeService.save(wineGrapeDTO));
    }

    @DeleteMapping("/{wineId}/{grapeId}")
    public ResponseEntity<Void> delete(@PathVariable Integer wineId, @PathVariable Integer grapeId) {
        wineGrapeService.deleteById(new WineGrapeId(wineId, grapeId));
        return ResponseEntity.noContent().build();
    }
}