package com.facebookclone.fb_backend.service;

import com.facebookclone.fb_backend.entity.Post;
import com.facebookclone.fb_backend.entity.User;
import com.facebookclone.fb_backend.repository.PostRepository;

import jakarta.persistence.EntityNotFoundException;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;

@Service
public class PostService {
    private final PostRepository postRepository;

    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    public Post createPost(String content, MultipartFile imageFile, String videoUrl, String status, User user) throws IOException {
        Post addedPost = new Post();
        addedPost.setContent(content);
        addedPost.setVideoUrl(videoUrl);
        addedPost.setStatus(status);
        addedPost.setCreatedAt(LocalDateTime.now());
        addedPost.setUser(user);

        if(imageFile != null && !imageFile.isEmpty()) {
            String base64 = Base64.getEncoder().encodeToString(imageFile.getBytes());
            addedPost.setImageUrl(base64);
            addedPost.setImageContentType(imageFile.getContentType());
        } else {
            addedPost.setImageUrl(null);
            addedPost.setImageContentType(null);
        }

        Post post = postRepository.save(addedPost);
        return post;
    }

    public Post updatePost(Long id, String content, MultipartFile imageFile, String videoUrl, String status) throws IOException{
        Post existingPost = postRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Không tìm thấy người dùng với ID: " + id));

        if(content != null) {
            existingPost.setContent(content);
        }
        if(videoUrl != null) {
            existingPost.setVideoUrl(videoUrl);
        }
        if(status != null) {
            existingPost.setStatus(status);
        }

        if(imageFile != null && !imageFile.isEmpty()){
            String base64 = Base64.getEncoder().encodeToString(imageFile.getBytes());
            existingPost.setImageUrl(base64);
            existingPost.setImageContentType(imageFile.getContentType());
        }

        Post post = postRepository.save(existingPost);
        return post;
    }

    public void deletePost(Long id) {
        if(!postRepository.existsById(id)) {
            throw new EntityNotFoundException("Không tìm thấy post với id" + id);
        }
        postRepository.deleteById(id);
    }

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public Post getPostById(Long id) {
        return postRepository.findById(id).orElse(null);
    }

    public List<Post> getPostsByUserId(Long userId) {
        return postRepository.findByUserId(userId);
    }

    public long countPost() {
        return postRepository.count();
    }
}