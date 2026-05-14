package com.k.tradingSimulator.Controller;

import com.k.tradingSimulator.Service.MarketDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/market")
public class MarketController {

    @Autowired
    private MarketDataService marketDataService;

    @GetMapping("/status")
    public Map<String, Object> getMarketStatus() {
        return marketDataService.getUSMarketStatus();
    }
}