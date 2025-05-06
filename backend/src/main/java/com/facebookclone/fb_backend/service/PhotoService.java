package com.facebookclone.fb_backend.service;

import com.facebookclone.fb_backend.entity.Photo;
import com.facebookclone.fb_backend.repository.PhotoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PhotoService {
    private final PhotoRepository photoRepository;

    public PhotoService(PhotoRepository photoRepository) {
        this.photoRepository = photoRepository;
    }

    public Photo createPhoto(Photo photo) {
        return photoRepository.save(photo);
    }

    public List<Photo> getPhotosByAlbumId(Long albumId) {
        return photoRepository.findByAlbumId(albumId);
    }
}