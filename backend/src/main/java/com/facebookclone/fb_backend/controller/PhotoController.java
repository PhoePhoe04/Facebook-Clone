package com.facebookclone.fb_backend.controller;

import com.facebookclone.fb_backend.entity.Photo;
import com.facebookclone.fb_backend.service.PhotoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/photos")
public class PhotoController {
    private final PhotoService photoService;

    public PhotoController(PhotoService photoService) {
        this.photoService = photoService;
    }

    @PostMapping
    public ResponseEntity<Photo> createPhoto(@RequestBody Photo photo) {
        return ResponseEntity.ok(photoService.createPhoto(photo));
    }

    @GetMapping("/album/{albumId}")
    public ResponseEntity<List<Photo>> getPhotosByAlbumId(@PathVariable Long albumId) {
        return ResponseEntity.ok(photoService.getPhotosByAlbumId(albumId));
    }
}