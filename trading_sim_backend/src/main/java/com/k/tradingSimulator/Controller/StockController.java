package com.k.tradingSimulator.Controller;

import com.k.tradingSimulator.Repository.StockRepository;
import com.k.tradingSimulator.Service.MarketDataService;
import com.k.tradingSimulator.Service.StockService;
import com.k.tradingSimulator.entity.Stock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/stocks")
public class StockController {
    @Autowired
    StockRepository stockRepository;
    @Autowired
    private StockService stockService;
    @Autowired
    private MarketDataService marketDataService;
    @GetMapping()
    public List<Stock> getStocks(){
        return stockService.getAllStocks();
    }

    @GetMapping("/{stockId}")
    public Stock getById(@PathVariable Long stockId){
        return stockService.getById(stockId);
    }

    @GetMapping("/symbol/{symbol}")
    public Stock getBySymbol(@PathVariable String symbol){
        return stockService.getBySymbol(symbol);
    }

    @PostMapping("/add")
    public Stock addStock(@RequestParam String name,
                          @RequestParam String symbol,
                          @RequestParam Double price){
        return stockService.addStock(name, symbol, price);
    }

    @PutMapping("/{id}/price")
    public Stock updatePrice(@PathVariable Long id,
                             @RequestParam Double newPrice){
        return stockService.updatePrice(id, newPrice);
    }

    @DeleteMapping("/{stockId}")
    public String deleteStock(@PathVariable Long stockId){
        stockService.deleteStock(stockId);
        return "Stock deleted successfully.";
    }

    @GetMapping("/market-status")
    public Map<String, Object> getMarketStatus() {
        return marketDataService.getUSMarketStatus();
    }

    @PostMapping("/bulk")
    public String addBulkStocks(@RequestBody List<Stock> stocks) {
        List<Stock> saved = new ArrayList<>();
        for (Stock stock : stocks) {
            if (!stockRepository.findBySymbol(stock.getSymbol()).isPresent()) {
                stockRepository.save(stock);
                saved.add(stock);
            }
        }
        return "✅ Added " + saved.size() + " new stocks";
    }
}