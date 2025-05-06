package com.facebookclone.fb_backend.controller;

import com.facebookclone.fb_backend.entity.Message;
import com.facebookclone.fb_backend.service.MessageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {
    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @PostMapping
    public ResponseEntity<Message> sendMessage(@RequestBody Message message) {
        return ResponseEntity.ok(messageService.sendMessage(message));
    }

    @GetMapping("/{userId1}/{userId2}")
    public ResponseEntity<List<Message>> getMessagesBetweenUsers(@PathVariable Long userId1, @PathVariable Long userId2) {
        return ResponseEntity.ok(messageService.getMessagesBetweenUsers(userId1, userId2));
    }
}