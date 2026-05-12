package com.k.tradingSimulator.Service;

import com.k.tradingSimulator.Repository.TransactionRepository;
import com.k.tradingSimulator.Repository.WalletRepository;
import com.k.tradingSimulator.entity.Transaction;
import com.k.tradingSimulator.entity.Transactiontype;
import com.k.tradingSimulator.entity.User;
import com.k.tradingSimulator.entity.Wallet;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class WalletService {

    @Autowired
    WalletRepository walletRepository;
    @Autowired
    TransactionRepository transactionRepository;

    @Transactional
    public Wallet addBalance(Double amount,Long userId){
        if(amount <= 0 ){
            throw new IllegalArgumentException("Amt should be positive");
        }
        Wallet wallet = walletRepository.findByUserId(userId).orElseThrow(() ->new RuntimeException("Wallet not found"));
        wallet.setBalance(wallet.getBalance() + amount);
        walletRepository.save(wallet);

        Transaction transaction = new Transaction(wallet, amount, Transactiontype.CREDIT);
        transactionRepository.save(transaction);

        return wallet;
    }

    public Double getBalance(Long userId) {
        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Wallet not found"));
        return wallet.getBalance();
    }

    @Transactional
    public Wallet deductMoney(Long userId, Double amount){
        Wallet wallet = walletRepository.findByUserId(userId).orElseThrow(() -> new RuntimeException("Wallet now found"));
        if (wallet.getBalance() < amount) {
            throw new RuntimeException("Insufficient balance");
        }

        wallet.setBalance(wallet.getBalance()-amount);
        walletRepository.save(wallet);

        Transaction transaction = new Transaction(wallet, amount, Transactiontype.DEBIT);
        transactionRepository.save(transaction);

        return wallet;
    }
}

