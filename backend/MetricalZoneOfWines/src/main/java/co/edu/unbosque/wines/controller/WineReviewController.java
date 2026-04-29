package co.edu.unbosque.wines.controller;

import co.edu.unbosque.wines.document.WineReview;
import co.edu.unbosque.wines.service.mongo.WineReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/wine-reviews")
@RequiredArgsConstructor
public class WineReviewController {
    private final WineReviewService service;

    @GetMapping
    public ResponseEntity<List<WineReview>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/wine/{wineId}")
    public ResponseEntity<List<WineReview>> getByWineId(@PathVariable Integer wineId) {
        return ResponseEntity.ok(service.findByWineId(wineId));
    }

    @PostMapping
    public ResponseEntity<WineReview> create(@RequestBody WineReview review) {
        return new ResponseEntity<>(service.save(review), HttpStatus.CREATED);
    }
}