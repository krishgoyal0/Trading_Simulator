package com.k.tradingSimulator.Controller;

import com.k.tradingSimulator.Service.PortfolioService;
import com.k.tradingSimulator.Service.WalletService;
import com.k.tradingSimulator.entity.Portfolio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/portfolio")
public class PortfolioController {

    @Autowired
    PortfolioService portfolioService;

    @Autowired
    private WalletService walletService;

    @GetMapping("/{userId}")
    public List<Portfolio> getPortfolio(@PathVariable Long userId){
        return portfolioService.getUserPortfolio(userId);
    }
    @GetMapping("/{userId}/value")
    public Double getPortfolioValue(@PathVariable Long userId){
        return portfolioService.getPortfolioValue(userId);
    }
    @GetMapping("/{userId}/getNetWorth")
    public Double getNetWorth(@PathVariable Long userId){
        return portfolioService.getNetWorth(userId, walletService);
    }
    @GetMapping("/{userId}/getById/{stockId}")
    public Portfolio checkUserOwnsStock(@PathVariable Long userId,
                                        @PathVariable Long stockId){
        return portfolioService.checkUserOwnsStock(userId, stockId);
    }

    @GetMapping("/{userId}/invested")
    public Double getTotalInvested(@PathVariable Long userId) {
        return portfolioService.getTotalInvested(userId);
    }
}
