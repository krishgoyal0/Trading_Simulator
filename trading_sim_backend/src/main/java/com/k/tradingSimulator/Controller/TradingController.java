package com.k.tradingSimulator.Controller;

import com.k.tradingSimulator.Service.TradingService;
import com.k.tradingSimulator.entity.Order;
import com.k.tradingSimulator.entity.Stock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/trading")
public class TradingController {

    @Autowired private TradingService tradingService;

    @PostMapping("/buy")
    public Order buyStock(@RequestParam Long userId,
                          @RequestParam Long stockId,
                          @RequestParam int Quantity){
        return tradingService.buyStock(userId,stockId,Quantity);
    }
    @PostMapping("/sell")
    public Order sellStock(@RequestParam Long stockId,
                           @RequestParam Long userId,
                           @RequestParam int Quantity){
        return tradingService.sellStock(userId,stockId,Quantity);
    }
}
