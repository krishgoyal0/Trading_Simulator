package com.k.tradingSimulator.Service;

import com.k.tradingSimulator.Repository.OrderRepository;
import com.k.tradingSimulator.Repository.UserRepository;
import com.k.tradingSimulator.entity.Order;
import com.k.tradingSimulator.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    UserRepository userRepository;
    @Autowired
    OrderRepository orderRepository;

    public List<Order> getUserOrders(Long userId){
        Optional<User> optionalUser = userRepository.findById(userId);
        if (!optionalUser.isPresent()) {
            throw new RuntimeException("User not found with id: " + userId);
        }
        return orderRepository.findByUserId(userId);
    }

    public Order getOrderById(Long orderId){
        return orderRepository.findById(orderId).orElseThrow(()-> new RuntimeException("Order not found"));
    }
}
