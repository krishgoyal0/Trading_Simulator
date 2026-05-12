package com.k.tradingSimulator.Controller;

import com.k.tradingSimulator.Service.OrderService;
import java.util.List;
import com.k.tradingSimulator.entity.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
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
