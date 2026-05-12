package com.k.tradingSimulator.Repository;

import com.k.tradingSimulator.entity.Transaction;
import com.k.tradingSimulator.entity.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByWalletOrderByTimestampDesc(Wallet wallet);
    List<Transaction> findByWalletId(Long walletId);
}