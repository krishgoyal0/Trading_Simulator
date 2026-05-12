package com.k.tradingSimulator.Controller;

import com.k.tradingSimulator.Service.UserService;
import com.k.tradingSimulator.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public User register(@RequestBody User user){
        return userService.registerUser(user.getName(), user.getEmail(), user.getPassword());
    }

    @PostMapping("/login")
    public User login(@RequestBody User user) {
        return userService.login(user.getEmail(), user.getPassword());
    }

    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id){
        return userService.findById(id);
    }

    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable Long id){
        userService.deleteUser(id);
        return "User with id: " + id + "is deleted Successfully";
    }

    @PutMapping("/{id}")
    public String reactiveUser(@PathVariable Long id){
        userService.reActiveUser(id);
        return "User activated.";
    }
}
