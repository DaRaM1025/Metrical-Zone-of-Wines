package co.edu.unbosque.wines.controller;

import co.edu.unbosque.wines.dto.GrapeVarietyDTO;
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
    public ResponseEntity<List<GrapeVarietyDTO>> getAll() {
        return ResponseEntity.ok(grapeVarietyService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<GrapeVarietyDTO> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(grapeVarietyService.findById(id));
    }

    @PostMapping
    public ResponseEntity<GrapeVarietyDTO> create(@RequestBody GrapeVarietyDTO grapeVarietyDTO) {
        return new ResponseEntity<>(grapeVarietyService.save(grapeVarietyDTO), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<GrapeVarietyDTO> update(@PathVariable Integer id, @RequestBody GrapeVarietyDTO grapeVarietyDTO) {
        grapeVarietyDTO.setId(id);
        return ResponseEntity.ok(grapeVarietyService.save(grapeVarietyDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        grapeVarietyService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}