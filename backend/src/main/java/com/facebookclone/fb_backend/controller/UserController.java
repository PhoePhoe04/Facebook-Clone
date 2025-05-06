package com.facebookclone.fb_backend.controller;

import com.facebookclone.fb_backend.entity.User;
import com.facebookclone.fb_backend.service.UserService;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;




@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping(value="/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> register(@RequestParam("name") String name,
                                        @RequestParam("email") String email,
                                        @RequestParam(value="bio", required = false) String bio,
                                        @RequestParam("password") String password,
                                        @RequestParam("status") String status,
                                        @RequestParam(value="avatarFile", required = false) MultipartFile avatarFile) {
        try {
            User addedUser = userService.registerUser(name, email, bio, password, status, avatarFile);
            return ResponseEntity.status(HttpStatus.CREATED).body(addedUser);
        } catch (Exception e) {
            e.printStackTrace(); // In chi tiết lỗi để debug
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Có lỗi xảy ra khi đăng ký người dùng: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = userService.findById(id);
        return user != null ? ResponseEntity.ok(user) : ResponseEntity.notFound().build();
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        User user = userService.findByEmail(email);
        return user != null ? ResponseEntity.ok(user) : ResponseEntity.notFound().build();
    }

    @PutMapping(value="/editUser/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> editUser(@PathVariable Long id, @RequestParam("name") String name,
                                                                @RequestParam("email") String email,
                                                                @RequestParam(value = "bio", required = false) String bio,
                                                                @RequestParam("password") String password,
                                                                @RequestParam("status") String status,
                                                                @RequestParam(value = "avatarFile", required = false) MultipartFile avatarFile) {
        try{
            User existingUser = userService.findById(id);
            if(existingUser == null) {
                return ResponseEntity.notFound().build();
            }

            User updatedUser = userService.updateUser(id, name, email, password, status, bio, avatarFile);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            e.printStackTrace(); // In chi tiết lỗi để debug
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Có lỗi xảy ra khi đăng ký người dùng: " + e.getMessage());
        }
    }

    @DeleteMapping("deleteUser/{id}") 
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/getAllUsers")
    public List<User> getAllUser() {
        return userService.findAll();
    }
    
    @GetMapping("/countUser")
    public Long countUser() {
        return userService.countUser();
    }
    
}