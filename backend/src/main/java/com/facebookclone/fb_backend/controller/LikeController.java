package com.facebookclone.fb_backend.controller;

import com.facebookclone.fb_backend.entity.Like;
import com.facebookclone.fb_backend.service.LikeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/likes")
public class LikeController {
    private final LikeService likeService;

    public LikeController(LikeService likeService) {
        this.likeService = likeService;
    }

    @PostMapping("/createLike")
    public ResponseEntity<Like> createLike(@RequestBody Like like) {
        return ResponseEntity.ok(likeService.createLike(like));
    }

    @DeleteMapping("/deleteLike/{id}")
    public ResponseEntity<Void> deleteLike(@PathVariable Long id) {
        likeService.deleteLike(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<List<Like>> getLikesByPostId(@PathVariable Long postId) {
        return ResponseEntity.ok(likeService.getLikesByPostId(postId));
    }

    @GetMapping("/comment/{commentId}")
    public ResponseEntity<List<Like>> getLikesByCommentId(@PathVariable Long commentId) {
        return ResponseEntity.ok(likeService.getLikesByCommentId(commentId));
    }
}