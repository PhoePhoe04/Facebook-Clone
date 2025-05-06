package com.facebookclone.fb_backend.controller;

import com.facebookclone.fb_backend.entity.Friendship;
import com.facebookclone.fb_backend.service.FriendshipService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/friendships")
public class FriendshipController {
    private final FriendshipService friendshipService;

    public FriendshipController(FriendshipService friendshipService) {
        this.friendshipService = friendshipService;
    }

    @PostMapping
    public ResponseEntity<Friendship> createFriendship(@RequestBody Friendship friendship) {
        return ResponseEntity.ok(friendshipService.createFriendship(friendship));
    }

    @GetMapping("/received/{receiverId}")
    public ResponseEntity<List<Friendship>> getFriendRequestsReceived(@PathVariable Long receiverId) {
        return ResponseEntity.ok(friendshipService.getFriendRequestsReceived(receiverId));
    }

    @GetMapping("/friends/{userId}")
    public ResponseEntity<List<Friendship>> getFriends(@PathVariable Long userId) {
        return ResponseEntity.ok(friendshipService.getFriends(userId));
    }
}