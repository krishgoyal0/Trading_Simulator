package com.k.tradingSimulator.Controller;

import com.k.tradingSimulator.Service.WalletService;
import com.k.tradingSimulator.entity.AddMoneyRequest;
import com.k.tradingSimulator.entity.Wallet;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/wallet")
public class WalletController {

    @Autowired
    private WalletService walletService;

    @PostMapping("/add")
    public Wallet addMoney(@RequestBody AddMoneyRequest request){
        return walletService.addBalance(request.getAmount(), request.getUserId());
    }

    @GetMapping("/{userId}/balance")
    public Double getBalance(@PathVariable Long userId){
        return walletService.getBalance(userId);
    }
}
