package com.facebookclone.fb_backend.repository;

import com.facebookclone.fb_backend.entity.Friendship;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FriendshipRepository extends JpaRepository<Friendship, Long> {
    List<Friendship> findByRequesterIdAndStatus(Long requesterId, Friendship.Status status);
    List<Friendship> findByReceiverIdAndStatus(Long receiverId, Friendship.Status status);
}