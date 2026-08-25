package com.krishikendra.controller;

import com.krishikendra.dto.request.FavoriteRequest;
import com.krishikendra.dto.response.FavoriteResponse;
import com.krishikendra.entity.User;
import com.krishikendra.service.AuthService;
import com.krishikendra.service.FavoriteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

    private final FavoriteService favoriteService;
    private final AuthService authService;

    public FavoriteController(FavoriteService favoriteService, AuthService authService) {
        this.favoriteService = favoriteService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<List<FavoriteResponse>> getFavorites() {
        User currentUser = authService.getCurrentUserEntity();
        List<FavoriteResponse> favorites = favoriteService.getUserFavorites(currentUser);
        return ResponseEntity.ok(favorites);
    }

    @PostMapping
    public ResponseEntity<FavoriteResponse> addFavorite(@Valid @RequestBody FavoriteRequest request) {
        User currentUser = authService.getCurrentUserEntity();
        FavoriteResponse response = favoriteService.addFavorite(currentUser, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeFavorite(@PathVariable Long id) {
        User currentUser = authService.getCurrentUserEntity();
        favoriteService.removeFavorite(currentUser, id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/check")
    public ResponseEntity<Map<String, Boolean>> checkFavorite(
            @RequestParam String commodity,
            @RequestParam String market) {
        User currentUser = authService.getCurrentUserEntity();
        boolean isFav = favoriteService.isFavorite(currentUser, commodity, market);
        return ResponseEntity.ok(Map.of("isFavorite", isFav));
    }
}
