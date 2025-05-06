package com.facebookclone.fb_backend.service;

import com.facebookclone.fb_backend.entity.Comment;
import com.facebookclone.fb_backend.repository.CommentRepository;

import jakarta.persistence.EntityNotFoundException;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService {
    private final CommentRepository commentRepository;

    public CommentService(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    public Comment saveComment(Comment comment) {
        return commentRepository.save(comment);
    }

    public void deleteComment(Long id) {
        if(!commentRepository.existsById(id)) {
            throw new EntityNotFoundException("Không tìm thấy comment với id " + id);
        }
        commentRepository.deleteById(id);
    }

    public List<Comment> getCommentsByPostId(Long postId) {
        return commentRepository.findByPostId(postId);
    }

    public List<Comment> getAllComments() {
        return commentRepository.findAll();
    }

    public Comment getCommentById(Long id) {
        return commentRepository.findById(id).orElse(null);
    }
}