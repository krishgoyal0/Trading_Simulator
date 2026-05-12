package com.k.tradingSimulator.Service;

import com.k.tradingSimulator.Repository.PortfolioRepository;
import com.k.tradingSimulator.Repository.StockRepository;
import com.k.tradingSimulator.Repository.UserRepository;
import com.k.tradingSimulator.Repository.WalletRepository;
import com.k.tradingSimulator.entity.Portfolio;
import com.k.tradingSimulator.entity.Stock;
import com.k.tradingSimulator.entity.User;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PortfolioService {

    @Autowired
    private PortfolioRepository portfolioRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StockRepository stockRepository;

    public List<Portfolio> getUserPortfolio(Long userId){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return portfolioRepository.findByUser(user);
    }

    public Portfolio checkUserOwnsStock(Long userId, Long stockId){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Stock stock = stockRepository.findById(stockId)
                .orElseThrow(() -> new RuntimeException("Stock not found"));

        return portfolioRepository.findByUserAndStock(user, stock)
                .orElse(null);
    }

    //this code is to get all total value of all stocks owned by the user.
    public Double getPortfolioValue(Long userId){
        List<Portfolio> holdings = getUserPortfolio(userId);
        double totalValue = 0;

        for(Portfolio holding: holdings){
            double currentPrice = holding.getStock().getPrice();
            totalValue = totalValue + (currentPrice * holding.getQuantity());
        }
        return totalValue;
    }

    public Double getNetWorth(Long userId, WalletService walletService){
        Double cashBalance = walletService.getBalance(userId);
        Double stockValue = getPortfolioValue((userId));
        return cashBalance + stockValue;
    }

    @Transactional
    public void updatePortfolio(User user, Stock stock, int quantity,Double price){
        Portfolio portfolio = portfolioRepository.findByUserAndStock(user, stock).orElse(null);

        if(portfolio == null){
            portfolio = new Portfolio(user, stock, quantity, price);
        } else {
            //user already owns the stock in this else scenario
            int newQuantity = portfolio.getQuantity() + quantity;
            portfolio.setQuantity(newQuantity);

            double totalCost = (portfolio.getAverageBuyPrice() * portfolio.getQuantity()) + (price * quantity);
            portfolio.setAverageBuyPrice(totalCost / newQuantity);
        }

        portfolioRepository.save(portfolio);
    }
}
