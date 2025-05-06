package com.facebookclone.fb_backend.service;

import com.facebookclone.fb_backend.entity.Album;
import com.facebookclone.fb_backend.repository.AlbumRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AlbumService {
    private final AlbumRepository albumRepository;

    public AlbumService(AlbumRepository albumRepository) {
        this.albumRepository = albumRepository;
    }

    public Album createAlbum(Album album) {
        return albumRepository.save(album);
    }

    public List<Album> getAlbumsByOwnerId(Long ownerId) {
        return albumRepository.findByOwnerId(ownerId);
    }
}