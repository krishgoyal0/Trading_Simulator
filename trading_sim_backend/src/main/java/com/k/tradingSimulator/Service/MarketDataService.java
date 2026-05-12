package com.k.tradingSimulator.Service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.*;

@Service
public class MarketDataService {

    @Value("${finnhub.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String BASE_URL = "https://finnhub.io/api/v1";

    public Double getRealTimePrice(String symbol) {
        String url = BASE_URL + "/quote?symbol=" + symbol.toUpperCase() + "&token=" + apiKey;

        try {
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);

            if (response != null && response.containsKey("c")) {
                Object priceObj = response.get("c");
                if (priceObj instanceof Number) {
                    Double price = ((Number) priceObj).doubleValue();
                    System.out.println("📊 " + symbol + ": $" + price);
                    return price;
                }
            }
            return null;
        } catch (Exception e) {
            System.err.println("Error for " + symbol + ": " + e.getMessage());
            return null;
        }
    }
}