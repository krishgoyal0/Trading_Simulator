package com.k.tradingSimulator;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling  // ← ADD THIS LINE
public class TradingSimulatorApplication {

	public static void main(String[] args) {
		SpringApplication.run(TradingSimulatorApplication.class, args);
		System.out.println("\n🚀 Trading Simulator Started!");
		System.out.println("👉 Stock prices will update every 30seconds\n");
	}
}