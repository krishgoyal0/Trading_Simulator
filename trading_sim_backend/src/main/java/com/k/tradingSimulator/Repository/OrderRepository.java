package com.k.tradingSimulator.Repository;

import com.k.tradingSimulator.entity.Order;
import com.k.tradingSimulator.entity.OrderStatus;
import com.k.tradingSimulator.entity.OrderType;
import com.k.tradingSimulator.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserAndStatus(User user, OrderStatus status);
    List<Order> findByUserId(Long userId);
    List<Order> findByStockId(Long stockId);
    List<Order> findByUserAndType(User user, OrderType type);
}