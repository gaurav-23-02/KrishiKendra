package com.krishikendra.controller;

import com.krishikendra.dto.response.MarketPriceResponse;
import com.krishikendra.dto.response.PagedResponse;
import com.krishikendra.dto.response.PriceTrendResponse;
import com.krishikendra.service.MarketPriceService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/market-prices")
public class MarketPriceController {

    private final MarketPriceService marketPriceService;

    public MarketPriceController(MarketPriceService marketPriceService) {
        this.marketPriceService = marketPriceService;
    }

    @GetMapping
    public ResponseEntity<PagedResponse<MarketPriceResponse>> searchMarketPrices(
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String district,
            @RequestParam(required = false) String market,
            @RequestParam(required = false) String commodity,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate priceDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {

        PagedResponse<MarketPriceResponse> response = marketPriceService.searchMarketPrices(
                state, district, market, commodity, priceDate, page, size
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/trends")
    public ResponseEntity<PriceTrendResponse> getPriceTrends(
            @RequestParam(defaultValue = "Wheat") String commodity,
            @RequestParam(required = false) String market,
            @RequestParam(required = false, defaultValue = "30") Integer days) {

        PriceTrendResponse response = marketPriceService.getPriceTrends(commodity, market, days);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/highlights")
    public ResponseEntity<List<MarketPriceResponse>> getHighlights(
            @RequestParam(required = false) String state,
            @RequestParam(defaultValue = "6") int limit) {

        List<MarketPriceResponse> response = marketPriceService.getRecentHighlights(state, limit);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/states")
    public ResponseEntity<List<String>> getStates() {
        return ResponseEntity.ok(marketPriceService.getDistinctStates());
    }

    @GetMapping("/districts")
    public ResponseEntity<List<String>> getDistricts(@RequestParam String state) {
        return ResponseEntity.ok(marketPriceService.getDistinctDistrictsByState(state));
    }

    @GetMapping("/markets")
    public ResponseEntity<List<String>> getMarkets(
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String district) {
        return ResponseEntity.ok(marketPriceService.getDistinctMarkets(state, district));
    }

    @GetMapping("/commodities")
    public ResponseEntity<List<String>> getCommodities() {
        return ResponseEntity.ok(marketPriceService.getDistinctCommodities());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MarketPriceResponse> getMarketPriceById(@PathVariable Long id) {
        return ResponseEntity.ok(marketPriceService.getMarketPriceById(id));
    }

    @PostMapping("/sync")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> syncDataGovPrices(
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String commodity) {
        int count = marketPriceService.fetchAndSaveFromDataGov(state, commodity);
        return ResponseEntity.ok(Map.of("message", "Sync completed", "recordsAdded", count));
    }
}
