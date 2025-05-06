package com.facebookclone.fb_backend.controller;

import com.facebookclone.fb_backend.entity.Comment;
import com.facebookclone.fb_backend.service.CommentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;



@RestController
@RequestMapping("/api/comments")
public class CommentController {
    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping("/createComment")
    public ResponseEntity<Comment> createComment(@RequestBody Comment comment) {
        return ResponseEntity.ok(commentService.saveComment(comment));
    }

    @PutMapping("/updateComment/{id}")
    public ResponseEntity<Comment> updateComment(@PathVariable Long id, @RequestBody Comment entity) {
        Comment existingComment = commentService.getCommentById(id);
        if(existingComment == null) {
            return ResponseEntity.notFound().build();
        }

        existingComment.setContent(entity.getContent());
        Comment updatedComment = commentService.saveComment(existingComment);
        return ResponseEntity.ok(updatedComment);
    }

    @DeleteMapping("/deleteComment/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id) {
        commentService.deleteComment(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<List<Comment>> getCommentsByPostId(@PathVariable Long postId) {
        return ResponseEntity.ok(commentService.getCommentsByPostId(postId));
    }

    @GetMapping("/getAllComments")
    public ResponseEntity<List<Comment>> getAllComments() {
        return ResponseEntity.ok(commentService.getAllComments());
    }
    
}