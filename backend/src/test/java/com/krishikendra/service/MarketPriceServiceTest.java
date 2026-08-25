package com.krishikendra.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.krishikendra.dto.response.PagedResponse;
import com.krishikendra.dto.response.PriceTrendResponse;
import com.krishikendra.entity.MarketPrice;
import com.krishikendra.repository.MarketPriceRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MarketPriceServiceTest {

    @Mock
    private MarketPriceRepository marketPriceRepository;

    @Mock
    private RestTemplate restTemplate;

    @Mock
    private ObjectMapper objectMapper;

    @InjectMocks
    private MarketPriceService marketPriceService;

    private MarketPrice samplePrice1;
    private MarketPrice samplePrice2;

    @BeforeEach
    void setUp() {
        samplePrice1 = new MarketPrice("Wheat", "Bhopal", "Bhopal", "Madhya Pradesh", 2100.0, 2400.0, 2250.0, LocalDate.now().minusDays(5), "data.gov.in");
        samplePrice1.setId(1L);

        samplePrice2 = new MarketPrice("Wheat", "Bhopal", "Bhopal", "Madhya Pradesh", 2150.0, 2450.0, 2300.0, LocalDate.now(), "data.gov.in");
        samplePrice2.setId(2L);
    }

    @Test
    void searchMarketPrices_ReturnsPagedData() {
        Page<MarketPrice> page = new PageImpl<>(List.of(samplePrice1, samplePrice2));
        when(marketPriceRepository.searchMarketPrices(isNull(), isNull(), isNull(), eq("Wheat"), isNull(), any(Pageable.class)))
                .thenReturn(page);

        PagedResponse<?> response = marketPriceService.searchMarketPrices(null, null, null, "Wheat", null, 0, 10);

        assertNotNull(response);
        assertEquals(2, response.getContent().size());
        assertEquals(2, response.getTotalElements());
    }

    @Test
    void getPriceTrends_CalculatesMetricsCorrectly() {
        when(marketPriceRepository.findPriceTrends(eq("Wheat"), eq("Bhopal"), any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(Arrays.asList(samplePrice1, samplePrice2));

        PriceTrendResponse trend = marketPriceService.getPriceTrends("Wheat", "Bhopal", 30);

        assertNotNull(trend);
        assertEquals("Wheat", trend.getCommodity());
        assertEquals("Bhopal", trend.getMarket());
        assertEquals(2300.0, trend.getCurrentPrice());
        assertEquals(2450.0, trend.getHighestPrice());
        assertEquals(2100.0, trend.getLowestPrice());
        assertEquals(2, trend.getDataPoints().size());
        assertTrue(trend.getPercentageChange() > 0);
    }
}
