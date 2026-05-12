package com.k.tradingSimulator.Service;

import com.k.tradingSimulator.Repository.StockRepository;
import com.k.tradingSimulator.entity.Stock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;

@Service
@EnableScheduling
public class PriceUpdateScheduler {

    @Autowired
    private StockRepository stockRepository;

    @Autowired
    private MarketDataService marketDataService;

    // Runs every 30seconds(since 60 calls/min easily handles this)
    @Scheduled(fixedDelay = 30000)  // 30 seconds
    public void updateAllStockPrices() {
        System.out.println("\n🔄 Updating stock prices from Finnhub...");
        long startTime = System.currentTimeMillis();

        List<Stock> stocks = stockRepository.findAll();
        System.out.println("📊 Updating " + stocks.size() + " stocks");

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

        long duration = System.currentTimeMillis() - startTime;
        System.out.println("✅ Updated " + successCount + "/" + stocks.size() + " stocks in " + duration + "ms\n");
    }
}