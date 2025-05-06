package com.facebookclone.fb_backend.service;

import com.facebookclone.fb_backend.entity.Like;
import com.facebookclone.fb_backend.repository.LikeRepository;

import jakarta.persistence.EntityNotFoundException;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LikeService {
    private final LikeRepository likeRepository;

    public LikeService(LikeRepository likeRepository) {
        this.likeRepository = likeRepository;
    }

    public Like createLike(Like like) {
        return likeRepository.save(like);
    }

    public void deleteLike(Long id) {
        if(!likeRepository.existsById(id)) {
            throw new EntityNotFoundException("Không thể xóa like với id "+id);
        }
        likeRepository.deleteById(id);
    }

    public List<Like> getLikesByPostId(Long postId) {
        return likeRepository.findByPostId(postId);
    }

    public List<Like> getLikesByCommentId(Long commentId) {
        return likeRepository.findByCommentId(commentId);
    }
}