package com.k.tradingSimulator.DTO;

public class StockUpdateMessage {

    private String type;
    private long timestamp;
    private int count;

    // No-arg constructor (required for Jackson/JSON)
    public StockUpdateMessage() {
    }

    // Parameterized constructor
    public StockUpdateMessage(String type, long timestamp, int count) {
        this.type = type;
        this.timestamp = timestamp;
        this.count = count;
    }

    // Getters
    public String getType() {
        return type;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public int getCount() {
        return count;
    }

    // Setters
    public void setType(String type) {
        this.type = type;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }

    public void setCount(int count) {
        this.count = count;
    }
}