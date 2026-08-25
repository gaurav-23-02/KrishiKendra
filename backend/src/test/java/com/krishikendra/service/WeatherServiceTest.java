package com.krishikendra.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.krishikendra.dto.response.WeatherResponse;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.client.RestTemplate;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class WeatherServiceTest {

    @Mock
    private RestTemplate restTemplate;

    @Mock
    private ObjectMapper objectMapper;

    @InjectMocks
    private WeatherService weatherService;

    @Test
    void generateRealisticWeather_ProducesValidPayload() {
        WeatherResponse response = weatherService.generateRealisticWeather("Bhopal");

        assertNotNull(response);
        assertEquals("Bhopal", response.getLocation());
        assertTrue(response.getTemperature() > 0);
        assertNotNull(response.getCondition());
        assertNotNull(response.getForecast());
        assertEquals(5, response.getForecast().size());
        assertNotNull(response.getAdvisories());
        assertFalse(response.getAdvisories().isEmpty());
    }

    @Test
    void generateAgriculturalAdvisories_RainRule() {
        List<String> advisories = weatherService.generateAgriculturalAdvisories(28.0, 85, 12.0, "Light Rain");

        assertNotNull(advisories);
        assertTrue(advisories.stream().anyMatch(a -> a.contains("Rainfall is expected")));
        assertTrue(advisories.stream().anyMatch(a -> a.contains("High relative humidity")));
    }

    @Test
    void generateAgriculturalAdvisories_HighWindRule() {
        List<String> advisories = weatherService.generateAgriculturalAdvisories(30.0, 50, 25.0, "Clear");

        assertNotNull(advisories);
        assertTrue(advisories.stream().anyMatch(a -> a.contains("Strong wind gusts")));
    }
}
