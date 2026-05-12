package com.k.tradingSimulator.Service;

import com.k.tradingSimulator.Repository.UserRepository;
import com.k.tradingSimulator.Repository.WalletRepository;
import com.k.tradingSimulator.entity.User;
import com.k.tradingSimulator.entity.Wallet;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired UserRepository userRepository;

    @Autowired
    WalletRepository walletRepository;

    @Transactional
    public User registerUser(String name, String email, String password){
        if(userRepository.findByEmail(email).isPresent()){
            throw new RuntimeException("User Already Exists");
        }
        User user = new User(name, email, password);
        userRepository.save(user);

        Wallet wallet = new Wallet(0.0, user);
        walletRepository.save(wallet);

        return user;
    }

    // You need this method in UserService
    public User login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Invalid password");
        }

        return user;
    }
    public User findById(Long id){
        return userRepository.findById(id).
                orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Transactional
    public void deleteUser(Long id){
        User user = findById(id);

        if(!user.isActive()){
            throw new RuntimeException("User already DEACTIVATED");
        }
        user.setActive(false);
        userRepository.save(user);
        System.out.println("✅ User deactivated with ID: " + id);
    }

    @Transactional
    public void reActiveUser(Long id){
        User user = findById(id);

        if(user.isActive()){
            throw new RuntimeException("User already ACTIVE");
        }
        user.setActive(true);
        userRepository.save(user);
        System.out.println("✅ User ACtivated with ID: " + id);
    }

}

