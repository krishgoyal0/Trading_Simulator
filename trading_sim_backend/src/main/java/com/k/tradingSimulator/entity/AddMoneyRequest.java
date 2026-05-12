package com.k.tradingSimulator.entity;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class AddMoneyRequest {
    @NotNull(message = "UserId is required")
    private Long userId;

    @Positive(message = "Amount must be positive")
    @NotNull(message = "Amount is required")
    private Double amount;

    // Default constructor (required for JSON deserialization)
    public AddMoneyRequest() {}

    // Constructor with fields
    public AddMoneyRequest(Long userId, Double amount) {
        this.userId = userId;
        this.amount = amount;
    }

    // Getters and Setters
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }
}