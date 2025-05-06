package com.facebookclone.fb_backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Entity
@Table(name = "posts")
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Size(max = 1000)
    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Lob // Để sql biết đây là thuộc tính có kiểu dữ liệu lướn
    @Column(name = "image_url")
    private String imageUrl;

    // Thêm imageContentType vowishamf get set của nó
    @Column(name = "image_content_type")
    private String imageContentType;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties({"posts", "comments", "likes"})
    private User user;

    @Column(name = "status")
    private String status;

    @Column(name = "video_url")
    private String videoUrl;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Like> likes = new ArrayList<>();

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Comment> comments = new ArrayList<>();


    // Helper methods for likes
    public void addLike(Like like) {
        if (like != null) {
            likes.add(like);
            like.setPost(this);
        }
    }

    public void removeLike(Like like) {
        if (like != null) {
            likes.remove(like);
            like.setPost(null);
        }
    }

    // Helper methods for comments
    public void addComment(Comment comment) {
        if (comment != null) {
            comments.add(comment);
            comment.setPost(this);
        }
    }

    public void removeComment(Comment comment) {
        if (comment != null) {
            comments.remove(comment);
            comment.setPost(null);
        }
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public String getImageContentType() { return imageContentType; }
    public void setImageContentType(String imageContentType) { this.imageContentType = imageContentType; }
    public User getUser() { return user; }
    public void setUser(User user) {
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null");
        }
        this.user = user;
    }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }
    public List<Like> getLikes() { return Collections.unmodifiableList(likes); }
    public void setLikes(List<Like> likes) { this.likes = likes != null ? likes : new ArrayList<>(); }
    public List<Comment> getComments() { return Collections.unmodifiableList(comments); }
    public void setComments(List<Comment> comments) { this.comments = comments != null ? comments : new ArrayList<>(); }
}