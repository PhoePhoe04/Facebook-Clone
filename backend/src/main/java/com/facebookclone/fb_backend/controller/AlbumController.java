package com.facebookclone.fb_backend.controller;

import com.facebookclone.fb_backend.entity.Album;
import com.facebookclone.fb_backend.service.AlbumService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/albums")
public class AlbumController {
    private final AlbumService albumService;

    public AlbumController(AlbumService albumService) {
        this.albumService = albumService;
    }

    @PostMapping
    public ResponseEntity<Album> createAlbum(@RequestBody Album album) {
        return ResponseEntity.ok(albumService.createAlbum(album));
    }

    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<Album>> getAlbumsByOwnerId(@PathVariable Long ownerId) {
        return ResponseEntity.ok(albumService.getAlbumsByOwnerId(ownerId));
    }
}