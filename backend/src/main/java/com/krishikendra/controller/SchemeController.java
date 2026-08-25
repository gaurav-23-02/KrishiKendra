package com.krishikendra.controller;

import com.krishikendra.dto.request.SchemeRequest;
import com.krishikendra.dto.response.PagedResponse;
import com.krishikendra.dto.response.SchemeResponse;
import com.krishikendra.service.SchemeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schemes")
public class SchemeController {

    private final SchemeService schemeService;

    public SchemeController(SchemeService schemeService) {
        this.schemeService = schemeService;
    }

    @GetMapping
    public ResponseEntity<PagedResponse<SchemeResponse>> getSchemes(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        PagedResponse<SchemeResponse> response = schemeService.filterSchemes(type, state, category, query, page, size);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/recent")
    public ResponseEntity<List<SchemeResponse>> getRecentSchemes(
            @RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(schemeService.getRecentSchemes(limit));
    }

    @GetMapping("/categories")
    public ResponseEntity<List<String>> getCategories() {
        return ResponseEntity.ok(schemeService.getDistinctCategories());
    }

    @GetMapping("/states")
    public ResponseEntity<List<String>> getStates() {
        return ResponseEntity.ok(schemeService.getDistinctStates());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SchemeResponse> getSchemeById(@PathVariable Long id) {
        return ResponseEntity.ok(schemeService.getSchemeById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SchemeResponse> createScheme(@Valid @RequestBody SchemeRequest request) {
        SchemeResponse created = schemeService.createScheme(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SchemeResponse> updateScheme(
            @PathVariable Long id,
            @Valid @RequestBody SchemeRequest request) {
        SchemeResponse updated = schemeService.updateScheme(id, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteScheme(@PathVariable Long id) {
        schemeService.deleteScheme(id);
        return ResponseEntity.noContent().build();
    }
}
