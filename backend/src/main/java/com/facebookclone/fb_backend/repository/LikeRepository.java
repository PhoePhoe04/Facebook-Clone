package com.facebookclone.fb_backend.repository;

import com.facebookclone.fb_backend.entity.Like;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LikeRepository extends JpaRepository<Like, Long> {
    List<Like> findByPostId(Long postId);
    List<Like> findByCommentId(Long commentId);
}