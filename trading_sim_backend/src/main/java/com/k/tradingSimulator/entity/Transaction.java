package com.k.tradingSimulator.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "wallet_id")
    private Wallet wallet;

    private Double amount;

    @Enumerated(EnumType.STRING)
    private Transactiontype type;

    @CreationTimestamp
    private LocalDateTime timestamp;

    public Transaction() {}
    public Transaction(Wallet wallet, Double amount, Transactiontype type) {
        this.wallet = wallet;
        this.amount = amount;
        this.type = type;
    }

    public Long getId(){
        return id;
    }

    public Wallet getWallet() {
        return wallet;
    }

    public void setWallet(Wallet wallet) {
        this.wallet = wallet;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public Transactiontype getType() {
        return type;
    }

    public void setType(Transactiontype type) {
        this.type = type;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }
}
