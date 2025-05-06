package com.facebookclone.fb_backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(name = "avatar_url")
    private String avatarUrl; // Giữ lại trường URL cũ nếu cần (ví dụ: dữ liệu cũ hoặc fallback)

    // Thêm avatar_image, avatarContentType, hàm get set của avatar_image với avatarContentType
    @Lob // JPA annotation để báo hiệu đây là dữ liệu lớn (LOB = Large Object)
    @Column(name = "avatar_image") // Mapping sang kiểu LONGBLOB trong MySQL
    private String avatarImage; // Trường để lưu trữ dữ liệu nhị phân của ảnh

    @Column(name = "avatar_content_type") // Trường để lưu trữ loại nội dung ảnh (e.g., image/jpeg)
    private String avatarContentType;

    @Column(nullable = true)
    private String bio;

    @Column(nullable = false)
    private String status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // --- Mối quan hệ ---
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore // Ngăn Jackon serialize mối quan hệ này khi fetch User đơn lẻ
    private List<Post> posts = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Comment> comments = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Like> likes = new ArrayList<>();

    @OneToMany(mappedBy = "requester", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Friendship> sentFriendRequests = new ArrayList<>();

    @OneToMany(mappedBy = "receiver", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Friendship> receivedFriendRequests = new ArrayList<>();
    // <-- Bắt đầu lại từ đây -->

    @OneToMany(mappedBy = "sender", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Message> sentMessages = new ArrayList<>();

    @OneToMany(mappedBy = "receiver", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Message> receivedMessages = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Notification> notifications = new ArrayList<>();

    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Album> albums = new ArrayList<>();

    // --- Constructors ---
    // Constructor mặc định (cần thiết cho JPA)
    public User() {
    }

    // Bạn có thể thêm các constructors khác nếu cần cho việc tạo đối tượng

    // --- Getters và Setters ---
    // Getters và setters cho các trường cũ
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    // Getters và setters cho các trường mới (avatarImage, avatarContentType)
    public String getAvatarImage() { return avatarImage; }
    public void setAvatarImage(String avatarImage) { this.avatarImage = avatarImage; }
    public String getAvatarContentType() { return avatarContentType; }
    public void setAvatarContentType(String avatarContentType) { this.avatarContentType = avatarContentType; }


    // Getters và setters cho các mối quan hệ List (JsonIgnore ở trên controller)
    public List<Post> getPosts() { return posts; }
    public void setPosts(List<Post> posts) { this.posts = posts; }
    public List<Comment> getComments() { return comments; }
    public void setComments(List<Comment> comments) { this.comments = comments; }
    public List<Like> getLikes() { return likes; }
    public void setLikes(List<Like> likes) { this.likes = likes; }
    public List<Friendship> getSentFriendRequests() { return sentFriendRequests; }
    public void setSentFriendRequests(List<Friendship> sentFriendRequests) { this.sentFriendRequests = sentFriendRequests; }
    public List<Friendship> getReceivedFriendRequests() { return receivedFriendRequests; }
    public void setReceivedFriendRequests(List<Friendship> receivedFriendRequests) { this.receivedFriendRequests = receivedFriendRequests; }
    public List<Message> getSentMessages() { return sentMessages; }
    public void setSentMessages(List<Message> sentMessages) { this.sentMessages = sentMessages; }
    public List<Message> getReceivedMessages() { return receivedMessages; }
    public void setReceivedMessages(List<Message> receivedMessages) { this.receivedMessages = receivedMessages; }
    public List<Notification> getNotifications() { return notifications; }
    public void setNotifications(List<Notification> notifications) { this.notifications = notifications; }
    public List<Album> getAlbums() { return albums; }
    public void setAlbums(List<Album> albums) { this.albums = albums; }
}