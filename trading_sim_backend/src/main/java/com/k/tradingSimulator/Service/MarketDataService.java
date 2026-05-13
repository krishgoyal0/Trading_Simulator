package com.k.tradingSimulator.Service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.*;
import java.util.ArrayList;

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

    public Map<String, Object> getUSMarketStatus() {
        String url = "https://finnhub.io/api/v1/stock/market-status?exchange=US&token=" + apiKey;

        try {
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            System.out.println("📊 Market Status: " + (response != null ? response.get("isOpen") : "Unknown"));
            return response;
        } catch (Exception e) {
            System.err.println("Error fetching market status: " + e.getMessage());
            return null;
        }
    }

    public boolean isUSMarketOpen() {
        Map<String, Object> status = getUSMarketStatus();
        if (status != null && status.containsKey("isOpen")) {
            return (boolean) status.get("isOpen");
        }
        return false; // Default to closed if API fails
    }
}