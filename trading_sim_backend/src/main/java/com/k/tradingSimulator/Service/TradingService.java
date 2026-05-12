package com.k.tradingSimulator.Service;

import com.k.tradingSimulator.Repository.*;
import com.k.tradingSimulator.entity.*;
import com.k.tradingSimulator.entity.Order;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TradingService {

    @Autowired
    WalletRepository walletRepository;
    @Autowired
    TransactionRepository transactionRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    StockRepository stockRepository;
    @Autowired
    OrderRepository orderRepository;
    @Autowired
    PortfolioService portfolioService;

    @Transactional
    public Order buyStock(Long userId, Long Stockid, int Quantity){

        //fetching user, stock, wallet
        User user = userRepository.findById(userId).orElseThrow(()-> new RuntimeException("User not found"));
        Stock stock = stockRepository.findById(Stockid).orElseThrow(()-> new RuntimeException("Stock not found"));
        Wallet wallet = walletRepository.findById(userId).orElseThrow(()->new RuntimeException("Wallet not found"));

        double totalCost = stock.getPrice() * Quantity;

        if(wallet.getBalance() < totalCost){
            throw new RuntimeException("Insufficient Balance");
        }
        wallet.setBalance(wallet.getBalance()-totalCost);
        walletRepository.save(wallet);

        Order order = new Order(user, stock, stock.getPrice(), Quantity, OrderType.BUY, OrderStatus.EXECUTED);
        orderRepository.save(order);

        portfolioService.updatePortfolio(user, stock, Quantity, stock.getPrice());

        return order;
    }

    @Transactional
    public Order sellStock(Long userId, Long Stockid, int Quantity){
        User user = userRepository.findById(userId).orElseThrow(()-> new RuntimeException("User not found"));
        Stock stock = stockRepository.findById(Stockid).orElseThrow(()-> new RuntimeException("Stock not found"));
        Wallet wallet = walletRepository.findById(userId).orElseThrow(()->new RuntimeException("Wallet not found"));

        double totalValue = stock.getPrice() * Quantity;
        wallet.setBalance(wallet.getBalance() + totalValue);
        walletRepository.save(wallet);

        Transaction transaction = new Transaction(wallet, totalValue, Transactiontype.CREDIT);
        transactionRepository.save(transaction);

        Order order = new Order(user, stock, stock.getPrice(), Quantity, OrderType.SELL, OrderStatus.EXECUTED);
        orderRepository.save(order);

        System.out.println("📉 SOLD: " + Quantity + " shares of " + stock.getSymbol());
        System.out.println("   Total value: ₹" + totalValue);

//        portfolioService.updatePortfolio(user, stock, -Quantity, stock.getPrice());
        portfolioService.reducePortfolio(user, stock, Quantity);
        return order;

    }

}
