package com.krishikendra.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.krishikendra.dto.response.MarketPriceResponse;
import com.krishikendra.dto.response.PagedResponse;
import com.krishikendra.dto.response.PriceTrendResponse;
import com.krishikendra.entity.MarketPrice;
import com.krishikendra.exception.ResourceNotFoundException;
import com.krishikendra.repository.MarketPriceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class MarketPriceService {

    private static final Logger log = LoggerFactory.getLogger(MarketPriceService.class);

    private final MarketPriceRepository marketPriceRepository;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${app.data-gov.api-key:}")
    private String dataGovApiKey;

    @Value("${app.data-gov.resource-id:9ef84268-d588-465a-a308-a864a43d0070}")
    private String resourceId;

    @Value("${app.data-gov.base-url:https://api.data.gov.in/resource}")
    private String dataGovBaseUrl;

    public MarketPriceService(MarketPriceRepository marketPriceRepository, RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.marketPriceRepository = marketPriceRepository;
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    public PagedResponse<MarketPriceResponse> searchMarketPrices(
            String state,
            String district,
            String market,
            String commodity,
            LocalDate priceDate,
            int page,
            int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<MarketPrice> results = marketPriceRepository.searchMarketPrices(
                cleanParam(state),
                cleanParam(district),
                cleanParam(market),
                cleanParam(commodity),
                priceDate,
                pageable);

        List<MarketPriceResponse> responses = results.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return new PagedResponse<>(
                responses,
                results.getNumber(),
                results.getSize(),
                results.getTotalElements(),
                results.getTotalPages(),
                results.isLast()
        );
    }

    public PriceTrendResponse getPriceTrends(String commodity, String market, Integer days) {
        if (commodity == null || commodity.isBlank()) {
            commodity = "Wheat";
        }
        int lookbackDays = (days != null && days > 0) ? days : 30;
        LocalDate startDate = LocalDate.now().minusDays(lookbackDays);
        LocalDate endDate = LocalDate.now();

        List<MarketPrice> prices = marketPriceRepository.findPriceTrends(
                commodity.trim(),
                cleanParam(market),
                startDate,
                endDate);

        if (prices.isEmpty()) {
            // fallback search without date restrictions to provide historical trend
            prices = marketPriceRepository.findPriceTrends(commodity.trim(), cleanParam(market), null, null);
        }

        if (prices.isEmpty()) {
            return new PriceTrendResponse(commodity, market != null ? market : "All Markets", 0.0, 0.0, 0.0, 0.0, 0.0, Collections.emptyList());
        }

        // Group by date to average out multi-market records if market was not specific
        Map<LocalDate, List<MarketPrice>> byDate = prices.stream()
                .collect(Collectors.groupingBy(MarketPrice::getPriceDate, TreeMap::new, Collectors.toList()));

        List<PriceTrendResponse.TrendPoint> trendPoints = new ArrayList<>();
        double highest = Double.MIN_VALUE;
        double lowest = Double.MAX_VALUE;
        double sumModal = 0.0;
        int count = 0;

        for (Map.Entry<LocalDate, List<MarketPrice>> entry : byDate.entrySet()) {
            LocalDate date = entry.getKey();
            List<MarketPrice> list = entry.getValue();

            double avgModal = list.stream().mapToDouble(MarketPrice::getModalPrice).average().orElse(0.0);
            double min = list.stream().mapToDouble(MarketPrice::getMinimumPrice).min().orElse(avgModal);
            double max = list.stream().mapToDouble(MarketPrice::getMaximumPrice).max().orElse(avgModal);

            if (max > highest) highest = max;
            if (min < lowest) lowest = min;
            sumModal += avgModal;
            count++;

            trendPoints.add(new PriceTrendResponse.TrendPoint(
                    date,
                    roundTwoDecimals(avgModal),
                    roundTwoDecimals(min),
                    roundTwoDecimals(max)
            ));
        }

        double currentPrice = trendPoints.isEmpty() ? 0.0 : trendPoints.get(trendPoints.size() - 1).getModalPrice();
        double earliestPrice = trendPoints.isEmpty() ? 0.0 : trendPoints.get(0).getModalPrice();
        double averagePrice = count > 0 ? (sumModal / count) : 0.0;
        double percentageChange = (earliestPrice > 0) ? (((currentPrice - earliestPrice) / earliestPrice) * 100.0) : 0.0;

        return new PriceTrendResponse(
                commodity,
                market != null ? market : "Overall Trend",
                roundTwoDecimals(currentPrice),
                highest == Double.MIN_VALUE ? 0.0 : roundTwoDecimals(highest),
                lowest == Double.MAX_VALUE ? 0.0 : roundTwoDecimals(lowest),
                roundTwoDecimals(averagePrice),
                roundTwoDecimals(percentageChange),
                trendPoints
        );
    }

    public MarketPriceResponse getMarketPriceById(Long id) {
        MarketPrice mp = marketPriceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Market price record not found with id: " + id));
        return mapToResponse(mp);
    }

    public List<MarketPriceResponse> getRecentHighlights(String state, int limit) {
        Pageable pageable = PageRequest.of(0, limit > 0 ? limit : 6);
        List<MarketPrice> list;
        if (state != null && !state.isBlank()) {
            list = marketPriceRepository.findTopRecentByState(state.trim(), pageable);
            if (list.isEmpty()) {
                list = marketPriceRepository.findAll(pageable).getContent();
            }
        } else {
            list = marketPriceRepository.findAll(pageable).getContent();
        }
        return list.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Cacheable("distinctStates")
    public List<String> getDistinctStates() {
        return marketPriceRepository.findDistinctStates();
    }

    public List<String> getDistinctDistrictsByState(String state) {
        if (state == null || state.isBlank()) {
            return Collections.emptyList();
        }
        return marketPriceRepository.findDistinctDistrictsByState(state.trim());
    }

    public List<String> getDistinctMarkets(String state, String district) {
        return marketPriceRepository.findDistinctMarkets(cleanParam(state), cleanParam(district));
    }

    @Cacheable("distinctCommodities")
    public List<String> getDistinctCommodities() {
        return marketPriceRepository.findDistinctCommodities();
    }

    @Transactional
    public int fetchAndSaveFromDataGov(String state, String commodity) {
        if (dataGovApiKey == null || dataGovApiKey.isBlank()) {
            log.info("data.gov.in API key is not configured. Utilizing local synchronized agricultural dataset.");
            return 0;
        }

        try {
            String url = UriComponentsBuilder.fromHttpUrl(dataGovBaseUrl + "/" + resourceId)
                    .queryParam("api-key", dataGovApiKey)
                    .queryParam("format", "json")
                    .queryParam("limit", 100)
                    .queryParamIfPresent("filters[state]", Optional.ofNullable(state))
                    .queryParamIfPresent("filters[commodity]", Optional.ofNullable(commodity))
                    .toUriString();

            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode root = objectMapper.readTree(response.getBody());
                JsonNode records = root.path("records");
                if (records.isArray()) {
                    int savedCount = 0;
                    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
                    for (JsonNode record : records) {
                        String comm = record.path("commodity").asText();
                        String market = record.path("market").asText();
                        String dist = record.path("district").asText();
                        String st = record.path("state").asText();
                        double minPrice = record.path("min_price").asDouble();
                        double maxPrice = record.path("max_price").asDouble();
                        double modalPrice = record.path("modal_price").asDouble();
                        String dateStr = record.path("arrival_date").asText();

                        LocalDate arrivalDate = LocalDate.now();
                        try {
                            arrivalDate = LocalDate.parse(dateStr, formatter);
                        } catch (Exception ignored) {
                        }

                        if (!marketPriceRepository.existsByCommodityAndMarketAndPriceDate(comm, market, arrivalDate)) {
                            MarketPrice mp = new MarketPrice(comm, market, dist, st, minPrice, maxPrice, modalPrice, arrivalDate, "data.gov.in");
                            marketPriceRepository.save(mp);
                            savedCount++;
                        }
                    }
                    log.info("Successfully fetched and saved {} new market price records from data.gov.in", savedCount);
                    return savedCount;
                }
            }
        } catch (Exception e) {
            log.warn("Error fetching data from data.gov.in: {}", e.getMessage());
        }
        return 0;
    }

    public MarketPriceResponse mapToResponse(MarketPrice entity) {
        return new MarketPriceResponse(
                entity.getId(),
                entity.getCommodity(),
                entity.getMarket(),
                entity.getDistrict(),
                entity.getState(),
                entity.getMinimumPrice(),
                entity.getMaximumPrice(),
                entity.getModalPrice(),
                entity.getPriceDate(),
                entity.getSource()
        );
    }

    private String cleanParam(String val) {
        return (val != null && !val.isBlank() && !val.equalsIgnoreCase("all")) ? val.trim() : null;
    }

    private double roundTwoDecimals(double val) {
        return Math.round(val * 100.0) / 100.0;
    }
}
