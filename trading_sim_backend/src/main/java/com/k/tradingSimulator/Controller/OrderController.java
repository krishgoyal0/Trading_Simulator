package com.k.tradingSimulator.Controller;

import com.k.tradingSimulator.Service.OrderService;
import java.util.List;
import com.k.tradingSimulator.entity.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired private OrderService orderService;

    @GetMapping("/user/{userId}")
    public List<Order> getAllOrders(@PathVariable Long userId){
    return orderService.getUserOrders(userId);
    }
    @GetMapping("/{orderId}")
    public Order getById(@PathVariable Long orderId){
        return orderService.getOrderById(orderId);
    }
}
