package com.k.tradingSimulator.Repository;

import com.k.tradingSimulator.entity.Portfolio;
import com.k.tradingSimulator.entity.User;
import com.k.tradingSimulator.entity.Stock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PortfolioRepository extends JpaRepository<Portfolio, Long> {

    // Find portfolio by user and stock (to check if user already owns this stock)
    Optional<Portfolio> findByUserAndStock(User user, Stock stock);

    // Find all portfolios for a user (to show their holdings)
    List<Portfolio> findByUser(User user);
}