package com.k.tradingSimulator.Service;

import com.k.tradingSimulator.Repository.StockRepository;
import com.k.tradingSimulator.entity.Stock;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StockService {

    @Autowired
    StockRepository stockRepository;

    public List<Stock> getAllStocks(){
        return stockRepository.findAll();
    }

    public Stock getById(Long id){
        return stockRepository.findById(id).orElseThrow(()-> new RuntimeException("Stock not found"));
    }

    public Stock getBySymbol(String symbol){
        return stockRepository.findBySymbol(symbol).orElseThrow(()-> new RuntimeException("Stock with Symbol-> " + symbol + "not found."));
    }

    //BELOW METHOD IS GOING TO BE AN ADMIN FEATURE
    //ADDING NEW STOCK
    @Transactional
    public Stock addStock(String name, String symbol, Double price){
        if (stockRepository.findBySymbol(symbol).isPresent()) {
            throw new RuntimeException("Stock with symbol " + symbol + " already exists");
        }

        // Validate inputs
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Stock name cannot be empty");
        }
        if (symbol == null || symbol.trim().isEmpty()) {
            throw new IllegalArgumentException("Stock symbol cannot be empty");
        }
        if (price <= 0) {
            throw new IllegalArgumentException("Stock price must be positive");
        }

        Stock stock = new Stock(name,symbol,price);
        Stock savedStock = stockRepository.save(stock);

        System.out.println("New Stock: " + name + " added successfully.");
        return savedStock;
    }

    //UPDATING STOCK PRICE IN REAL TIME
    @Transactional
    public Stock updatePrice(Long stockId,Double newPrice){
        if(newPrice <= 0){
            throw new IllegalArgumentException("Price cant be zero");
        }
        Stock stock = getById(stockId);
        Double oldPrice = stock.getPrice();
        stock.setPrice(newPrice);
        stockRepository.save(stock);
        System.out.println("📊 Price updated: " + stock.getSymbol() + " ₹" + oldPrice + " → ₹" + newPrice);
        return stock;
    }

    @Transactional
    public void deleteStock(Long stockId) {
        Stock stock = getById(stockId);
        String symbol = stock.getSymbol();
        stockRepository.delete(stock);
        System.out.println("🗑️ Stock deleted: " + symbol);
    }
}
