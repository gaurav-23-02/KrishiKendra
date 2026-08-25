package com.krishikendra.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.krishikendra.dto.request.AssistantChatRequest;
import com.krishikendra.dto.response.AssistantChatResponse;
import com.krishikendra.dto.response.MarketPriceResponse;
import com.krishikendra.dto.response.PriceTrendResponse;
import com.krishikendra.dto.response.SchemeResponse;
import com.krishikendra.dto.response.WeatherResponse;
import com.krishikendra.entity.MarketPrice;
import com.krishikendra.entity.Scheme;
import com.krishikendra.repository.MarketPriceRepository;
import com.krishikendra.repository.SchemeRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class AssistantService {

    private static final Logger log = LoggerFactory.getLogger(AssistantService.class);

    private final MarketPriceRepository marketPriceRepository;
    private final SchemeRepository schemeRepository;
    private final WeatherService weatherService;
    private final MarketPriceService marketPriceService;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${app.ai.api-key:}")
    private String aiApiKey;

    @Value("${app.ai.provider:gemini}")
    private String aiProvider;

    @Value("${app.ai.model:gemini-1.5-flash}")
    private String aiModel;

    private static final List<String> KNOWN_COMMODITIES = Arrays.asList(
            "Wheat", "Paddy", "Mustard", "Soybean", "Cotton", "Maize",
            "Gram", "Chana", "Onion", "Potato", "Tomato", "Garlic", "Turmeric", "Sugarcane", "Moong", "Urad"
    );

    private static final List<String> KNOWN_CITIES = Arrays.asList(
            "Bhopal", "Indore", "Jabalpur", "Ujjain", "Jaipur", "Kota", "Jodhpur",
            "Lucknow", "Varanasi", "Kanpur", "Nagpur", "Pune", "Nashik", "Ludhiana", "Amritsar", "Patna"
    );

    public AssistantService(MarketPriceRepository marketPriceRepository,
                            SchemeRepository schemeRepository,
                            WeatherService weatherService,
                            MarketPriceService marketPriceService,
                            RestTemplate restTemplate,
                            ObjectMapper objectMapper) {
        this.marketPriceRepository = marketPriceRepository;
        this.schemeRepository = schemeRepository;
        this.weatherService = weatherService;
        this.marketPriceService = marketPriceService;
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    public AssistantChatResponse processQuestion(AssistantChatRequest request) {
        String query = request.getMessage().trim();
        String detectedCommodity = extractKeyword(query, KNOWN_COMMODITIES);
        String detectedCity = extractKeyword(query, KNOWN_CITIES);
        if (detectedCity == null && request.getDistrict() != null && !request.getDistrict().isBlank()) {
            detectedCity = request.getDistrict();
        } else if (detectedCity == null && request.getState() != null && !request.getState().isBlank()) {
            detectedCity = request.getState();
        }

        List<String> sourcesUsed = new ArrayList<>();
        StringBuilder factualContext = new StringBuilder();
        String intent = "GENERAL_AGRICULTURE";

        // 1. Mandi Price Check
        if (query.toLowerCase().contains("price") || query.toLowerCase().contains("rate") || query.toLowerCase().contains("mandi") || query.toLowerCase().contains("bhav") || detectedCommodity != null) {
            intent = "MARKET_PRICE";
            String commodityToSearch = detectedCommodity != null ? detectedCommodity : "Wheat";
            List<MarketPrice> priceList = marketPriceRepository.findPriceTrends(commodityToSearch, detectedCity, LocalDate.now().minusDays(15), LocalDate.now());
            if (priceList.isEmpty()) {
                priceList = marketPriceRepository.findPriceTrends(commodityToSearch, null, null, null);
            }

            if (!priceList.isEmpty()) {
                MarketPrice latest = priceList.get(priceList.size() - 1);
                factualContext.append(String.format("Verified Mandi Price for %s in %s (%s): Modal Price = ₹%.0f/quintal (Min: ₹%.0f, Max: ₹%.0f) on %s.\n",
                        latest.getCommodity(), latest.getMarket(), latest.getState(), latest.getModalPrice(), latest.getMinimumPrice(), latest.getMaximumPrice(), latest.getPriceDate()));
                sourcesUsed.add(String.format("Mandi Database: %s @ %s (₹%.0f/q)", latest.getCommodity(), latest.getMarket(), latest.getModalPrice()));
            }
        }

        // 2. Weather Check
        if (query.toLowerCase().contains("weather") || query.toLowerCase().contains("rain") || query.toLowerCase().contains("temperature") || query.toLowerCase().contains("mausam")) {
            intent = "WEATHER";
            String cityForWeather = detectedCity != null ? detectedCity : "Bhopal";
            WeatherResponse weather = weatherService.getWeatherByCity(cityForWeather);
            if (weather != null) {
                factualContext.append(String.format("Verified Current Weather in %s: %s, %.1f°C (Feels like %.1f°C), Humidity: %d%%, Wind: %.1f km/h.\n",
                        weather.getLocation(), weather.getCondition(), weather.getTemperature(), weather.getFeelsLike(), weather.getHumidity(), weather.getWindSpeed()));
                if (weather.getAdvisories() != null && !weather.getAdvisories().isEmpty()) {
                    factualContext.append("Weather Advisory: ").append(weather.getAdvisories().get(0)).append("\n");
                }
                sourcesUsed.add(String.format("Weather Service: %s (%.1f°C, %s)", weather.getLocation(), weather.getTemperature(), weather.getCondition()));
            }
        }

        // 3. Schemes Check
        if (query.toLowerCase().contains("scheme") || query.toLowerCase().contains("yojana") || query.toLowerCase().contains("subsidy") || query.toLowerCase().contains("kisan credit") || query.toLowerCase().contains("pm-kisan") || query.toLowerCase().contains("bima") || query.toLowerCase().contains("loan")) {
            intent = "GOVERNMENT_SCHEME";
            List<Scheme> allSchemes = schemeRepository.findAll();
            List<Scheme> matched = allSchemes.stream()
                    .filter(s -> query.toLowerCase().contains(s.getName().toLowerCase()) ||
                            query.toLowerCase().contains(s.getCategory().toLowerCase()) ||
                            s.getName().toLowerCase().contains("pm-kisan") ||
                            s.getName().toLowerCase().contains("bima"))
                    .limit(3)
                    .collect(Collectors.toList());

            if (matched.isEmpty()) {
                matched = allSchemes.stream().limit(2).collect(Collectors.toList());
            }

            for (Scheme s : matched) {
                factualContext.append(String.format("Verified Scheme [%s] (Category: %s, Scope: %s): %s. Benefits: %s. Eligibility: %s.\n",
                        s.getName(), s.getCategory(), s.getState(), s.getDescription(), s.getBenefits(), s.getEligibility()));
                sourcesUsed.add(String.format("Scheme Portal: %s (%s)", s.getName(), s.getCategory()));
            }
        }

        // Generate response using external AI API if key is set, or grounded expert reasoning
        String reply;
        if (aiApiKey != null && !aiApiKey.isBlank() && !aiApiKey.equalsIgnoreCase("your_gemini_or_openai_api_key_here")) {
            try {
                reply = callExternalAiApi(query, factualContext.toString(), request.getPreferredLanguage());
            } catch (Exception e) {
                log.warn("AI API call failed: {}. Falling back to internal grounded agricultural expert engine.", e.getMessage());
                reply = generateExpertResponse(query, intent, factualContext.toString(), detectedCommodity, detectedCity);
            }
        } else {
            reply = generateExpertResponse(query, intent, factualContext.toString(), detectedCommodity, detectedCity);
        }

        List<String> suggestions = generateFollowUpSuggestions(intent, detectedCommodity, detectedCity);

        return new AssistantChatResponse(reply, intent, sourcesUsed, suggestions);
    }

    private String callExternalAiApi(String userQuery, String verifiedFacts, String language) throws Exception {
        String systemPrompt = "You are Krishi Mitra, an expert and empathetic agricultural AI assistant for Indian farmers on the Krishi Kendra platform. " +
                "CRITICAL INSTRUCTIONS:\n" +
                "1. Answer clearly, respectfully, and practically for farmers.\n" +
                "2. Base all numerical facts (market prices, weather degrees, scheme names/eligibility) ONLY on the verified factual context provided below.\n" +
                "3. NEVER fabricate market prices, schemes, or weather numbers.\n" +
                "4. If factual details are not provided in context, provide helpful general agricultural guidance and politely suggest checking the Krishi Kendra Mandi or Weather pages for live numbers.\n" +
                "5. Preferred response language: " + (language != null ? language : "English") + ".\n\n" +
                "VERIFIED SYSTEM CONTEXT:\n" + (verifiedFacts.isBlank() ? "No specific database match found." : verifiedFacts);

        if (aiProvider.equalsIgnoreCase("openai")) {
            return callOpenAi(systemPrompt, userQuery);
        } else {
            return callGemini(systemPrompt, userQuery);
        }
    }

    private String callGemini(String systemPrompt, String userQuery) throws Exception {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/" + aiModel + ":generateContent?key=" + aiApiKey;

        Map<String, Object> requestBody = new HashMap<>();
        Map<String, Object> contents = new HashMap<>();
        contents.put("role", "user");
        contents.put("parts", List.of(
                Map.of("text", systemPrompt + "\n\nUser Question: " + userQuery)
        ));
        requestBody.put("contents", List.of(contents));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
        JsonNode root = objectMapper.readTree(response.getBody());
        return root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();
    }

    private String callOpenAi(String systemPrompt, String userQuery) throws Exception {
        String url = "https://api.openai.com/v1/chat/completions";

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "gpt-3.5-turbo");
        requestBody.put("messages", List.of(
                Map.of("role", "system", "content", systemPrompt),
                Map.of("role", "user", "content", userQuery)
        ));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(aiApiKey);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
        JsonNode root = objectMapper.readTree(response.getBody());
        return root.path("choices").get(0).path("message").path("content").asText();
    }

    private String generateExpertResponse(String query, String intent, String facts, String commodity, String city) {
        StringBuilder sb = new StringBuilder();

        if (intent.equals("MARKET_PRICE") && !facts.isBlank()) {
            sb.append("Namaste! Here are the verified mandi market rates from our agricultural database:\n\n");
            sb.append(facts).append("\n");
            sb.append("💡 **Farmer Tip**: Mandi modal prices fluctuate based on daily arrival volume and crop moisture content. Check the **Price Trends** page on Krishi Kendra to view historical graphs and timing recommendations.");
        } else if (intent.equals("WEATHER") && !facts.isBlank()) {
            sb.append("Namaste! Here is the latest verified weather report and field advisory:\n\n");
            sb.append(facts).append("\n");
            sb.append("🌱 **Agro-Advisory**: Plan your irrigation, intercultural operations, and spraying schedule according to today's moisture and wind forecast.");
        } else if (intent.equals("GOVERNMENT_SCHEME") && !facts.isBlank()) {
            sb.append("Namaste! Here are the official government agricultural schemes matching your inquiry:\n\n");
            sb.append(facts).append("\n");
            sb.append("📋 **How to Apply**: You can apply through the official portals listed in our **Government Schemes** section or visit your nearest Common Service Centre (CSC) or Krishi Vigyan Kendra (KVK).");
        } else {
            sb.append("Namaste! Welcome to Krishi Kendra.\n\n");
            if (query.toLowerCase().contains("crop") || query.toLowerCase().contains("madhya pradesh") || query.toLowerCase().contains("season")) {
                sb.append("Major crops grown in Central India during the Kharif season include Soybean, Paddy, Maize, and Cotton. During Rabi, Wheat, Gram (Chana), and Mustard are widely cultivated with high returns.\n\n");
            } else if (query.toLowerCase().contains("mandi") || query.toLowerCase().contains("how")) {
                sb.append("Mandi prices in India are recorded under the Agricultural Produce Market Committee (APMC) framework. Every mandi reports the minimum arrival price, maximum price, and the modal price (the most common transaction rate per quintal).\n\n");
            } else {
                sb.append("I am your Krishi Kendra Assistant. I can provide real-time mandi prices, weather-based crop advisories, government scheme eligibility details, and agricultural guidance.\n\n");
            }
            if (!facts.isBlank()) {
                sb.append("### Relevant Information:\n").append(facts).append("\n");
            }
            sb.append("Feel free to ask specific questions about crop prices, weather forecasts, or government subsidies!");
        }

        return sb.toString();
    }

    private List<String> generateFollowUpSuggestions(String intent, String commodity, String city) {
        String c = commodity != null ? commodity : "Wheat";
        String loc = city != null ? city : "Bhopal";

        if (intent.equals("MARKET_PRICE")) {
            return List.of(
                    "Show price trend for " + c,
                    "Weather in " + loc + " today",
                    "Government subsidies for " + c + " farmers",
                    "What is Mustard price today?"
            );
        } else if (intent.equals("WEATHER")) {
            return List.of(
                    "Agricultural advisory for rain",
                    "What is the wheat price in " + loc + "?",
                    "5-day weather forecast",
                    "Schemes for micro-irrigation"
            );
        } else {
            return List.of(
                    "What is the wheat price in Bhopal?",
                    "PM-KISAN eligibility criteria",
                    "Pradhan Mantri Fasal Bima Yojana details",
                    "Weather in Indore today"
            );
        }
    }

    private String extractKeyword(String text, List<String> candidates) {
        String lower = text.toLowerCase();
        for (String c : candidates) {
            if (lower.contains(c.toLowerCase())) {
                return c;
            }
        }
        return null;
    }
}
