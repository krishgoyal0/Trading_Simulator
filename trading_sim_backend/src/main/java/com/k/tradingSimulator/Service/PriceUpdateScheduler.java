package com.k.tradingSimulator.Service;

import com.k.tradingSimulator.DTO.StockUpdateMessage;
import com.k.tradingSimulator.Repository.StockRepository;
import com.k.tradingSimulator.entity.Stock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@EnableScheduling
public class PriceUpdateScheduler {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private StockRepository stockRepository;

    @Autowired
    private MarketDataService marketDataService;

    @Scheduled(fixedDelay = 30000)
    public void updateAllStockPrices() {
        System.out.println("\n🔄 Starting price update cycle...");

        List<Stock> allStocks = stockRepository.findAll();

        // Separate stocks from crypto
        List<Stock> usStocks = new ArrayList<>();
        List<Stock> cryptoStocks = new ArrayList<>();

        for (Stock stock : allStocks) {
            if (stock.getSymbol().contains("BINANCE:") || stock.getSymbol().contains("/")) {
                cryptoStocks.add(stock);
            } else {
                usStocks.add(stock);
            }
        }

        int totalSuccess = 0;

        // 1. Update Crypto (always fetch)
        if (!cryptoStocks.isEmpty()) {
            System.out.println("📊 Updating " + cryptoStocks.size() + " crypto(s)...");
            totalSuccess += updateStockList(cryptoStocks);
        }

        // 2. Update US Stocks (always fetch)
        if (!usStocks.isEmpty()) {
            System.out.println("📊 Updating " + usStocks.size() + " stock(s)...");
            totalSuccess += updateStockList(usStocks);
        }

        // Broadcast if any succeeded
        if (totalSuccess > 0) {
            StockUpdateMessage message = new StockUpdateMessage("STOCK_PRICE_UPDATE", System.currentTimeMillis(), totalSuccess);
            messagingTemplate.convertAndSend("/topic/stock-updates", message);
            System.out.println("📡 WebSocket broadcast sent for " + totalSuccess + " assets");
        }
    }

    // Helper method to update a list of stocks
    private int updateStockList(List<Stock> stocks) {
        int successCount = 0;

        for (Stock stock : stocks) {
            Double livePrice = marketDataService.getRealTimePrice(stock.getSymbol());

            if (livePrice != null && livePrice > 0) {
                Double oldPrice = stock.getPrice();
                stock.setPrice(livePrice);
                stockRepository.save(stock);
                System.out.println("   ✅ " + stock.getSymbol() + ": $" + oldPrice + " → $" + livePrice);
                successCount++;
            } else {
                System.out.println("   ❌ Failed: " + stock.getSymbol());
            }
        }

        return successCount;
    }
}