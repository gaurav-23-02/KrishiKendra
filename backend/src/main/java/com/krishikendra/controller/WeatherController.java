package com.krishikendra.controller;

import com.krishikendra.dto.response.WeatherResponse;
import com.krishikendra.service.WeatherService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/weather")
public class WeatherController {

    private final WeatherService weatherService;

    public WeatherController(WeatherService weatherService) {
        this.weatherService = weatherService;
    }

    @GetMapping
    public ResponseEntity<WeatherResponse> getWeather(
            @RequestParam(required = false, defaultValue = "Bhopal") String city,
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lon) {

        if (lat != null && lon != null) {
            return ResponseEntity.ok(weatherService.getWeatherByCoordinates(lat, lon));
        }
        return ResponseEntity.ok(weatherService.getWeatherByCity(city));
    }

    @GetMapping("/forecast")
    public ResponseEntity<WeatherResponse> getForecast(
            @RequestParam(required = false, defaultValue = "Bhopal") String city) {
        return ResponseEntity.ok(weatherService.getWeatherByCity(city));
    }
}
