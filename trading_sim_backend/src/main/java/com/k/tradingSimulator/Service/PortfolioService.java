package com.k.tradingSimulator.Service;

import com.k.tradingSimulator.Repository.*;
import com.k.tradingSimulator.entity.*;
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
    private OrderRepository orderRepository;
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
//            int newQuantity = portfolio.getQuantity() + quantity;
//            portfolio.setQuantity(newQuantity);
//
//            double totalCost = (portfolio.getAverageBuyPrice() * portfolio.getQuantity()) + (price * quantity);
//            portfolio.setAverageBuyPrice(totalCost / newQuantity);
            int oldQuantity = portfolio.getQuantity();
            int newQuantity = oldQuantity + quantity;

            double totalCost =
                    (portfolio.getAverageBuyPrice() * oldQuantity) +
                            (price * quantity);

            portfolio.setQuantity(newQuantity);
            portfolio.setAverageBuyPrice(totalCost / newQuantity);
        }
        portfolioRepository.save(portfolio);
    }

    public Double getTotalInvested(Long userId) {
        // First fetch the user object
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Get buy and sell orders for this user
        List<Order> buyOrders = orderRepository.findByUserAndType(user, OrderType.BUY);
        List<Order> sellOrders = orderRepository.findByUserAndType(user, OrderType.SELL);

        // Calculate total bought amount
        double totalBought = buyOrders.stream()
                .mapToDouble(order -> order.getPrice() * order.getQuantity())
                .sum();

        // Calculate total sold amount
        double totalSold = sellOrders.stream()
                .mapToDouble(order -> order.getPrice() * order.getQuantity())
                .sum();

        // Net invested = bought - sold
        return totalBought - totalSold;
    }

    @Transactional
    public void reducePortfolio(User user, Stock stock, int quantity) {
        Portfolio portfolio = portfolioRepository
                .findByUserAndStock(user, stock)
                .orElseThrow(() -> new RuntimeException("You do not own this stock."));

        if (portfolio.getQuantity() < quantity) {
            throw new RuntimeException("Not enough shares to sell.");
        }

        int remainingQuantity = portfolio.getQuantity() - quantity;

        if (remainingQuantity == 0) {
            portfolioRepository.delete(portfolio);
        } else {
            portfolio.setQuantity(remainingQuantity);
            portfolioRepository.save(portfolio);
        }
    }
}
