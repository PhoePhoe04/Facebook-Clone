package com.facebookclone.fb_backend.repository;

import com.facebookclone.fb_backend.entity.Album;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AlbumRepository extends JpaRepository<Album, Long> {
    List<Album> findByOwnerId(Long ownerId);
}