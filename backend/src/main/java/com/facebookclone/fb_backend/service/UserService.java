package com.facebookclone.fb_backend.service;

import com.facebookclone.fb_backend.entity.User;
import com.facebookclone.fb_backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Base64; // Cần import Base64 ở đây để mã hóa sang String
import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

@Service
public class UserService {

    private static final Logger logger = Logger.getLogger(UserService.class.getName());

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // --- Phương thức ĐĂNG KÝ người dùng MỚI với file avatar ---
    @Transactional
    public User registerUser(String name, String email, String bio, String password, String status, MultipartFile avatarFile) throws IOException {
        User newUser = new User();
        newUser.setName(name);
        newUser.setEmail(email);
        newUser.setBio(bio);
        newUser.setPassword(password); // Lưu mật khẩu plain text (Cần sửa!)
        newUser.setStatus(status);
        newUser.setCreatedAt(LocalDateTime.now());
        newUser.setUpdatedAt(LocalDateTime.now());

        // Xử lý file avatar nếu có
        if (avatarFile != null && !avatarFile.isEmpty()) {
            // Đọc dữ liệu nhị phân và mã hóa sang chuỗi Base64 (String)
            String base64Image = Base64.getEncoder().encodeToString(avatarFile.getBytes());
            // Gán chuỗi Base64 vào trường avatarImage (kiểu String trong Entity mới)
            newUser.setAvatarImage(base64Image);
            // Lấy content type của file
            newUser.setAvatarContentType(avatarFile.getContentType());
            // Đảm bảo avatarUrl là null nếu dùng Base64/BLOB
            newUser.setAvatarUrl(null);

            logger.info("UserService.registerUser: Avatar file processed and encoded to Base64. Base64 length: " + base64Image.length() + ", ContentType: " + newUser.getAvatarContentType());
        } else {
             // Nếu không có file avatar được upload, set các trường ảnh là null
             newUser.setAvatarImage(null);
             newUser.setAvatarContentType(null);
             newUser.setAvatarUrl(null);
             logger.info("UserService.registerUser: No avatar file uploaded.");
        }

        User savedUser = userRepository.save(newUser);
        logger.info("UserService.registerUser: User " + savedUser.getId() + " saved.");
        return savedUser;
    }

    // --- Phương thức XÓA người dùng ---
    @Transactional
    public void deleteUser(Long id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Invalid user ID: " + id);
        }
        if (!userRepository.existsById(id)) {
            throw new EntityNotFoundException("Không tìm thấy người dùng với ID: " + id);
        }
        userRepository.deleteById(id);
        logger.info("UserService.deleteUser: User with ID " + id + " deleted.");
    }

    // --- Phương thức TÌM người dùng theo Email ---
    public User findByEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email cannot be empty");
        }
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new EntityNotFoundException("Không tìm thấy người dùng với email: " + email);
        }
        // Log trạng thái avatarImage (giờ là String)
        logger.info("UserService.findByEmail: Fetched user " + user.getId() + ". AvatarImage is null: " + (user.getAvatarImage() == null) + ", Length: " + (user.getAvatarImage() != null ? user.getAvatarImage().length() : "N/A"));
        return user;
    }

    // --- Phương thức TÌM người dùng theo ID ---
    public User findById(Long id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Invalid user ID: " + id);
        }
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy người dùng với ID: " + id));
        // Log trạng thái avatarImage (giờ là String)
        logger.info("UserService.findById: Fetched user " + user.getId() + ". AvatarImage is null: " + (user.getAvatarImage() == null) + ", Length: " + (user.getAvatarImage() != null ? user.getAvatarImage().length() : "N/A"));
        return user;
    }

    // --- Phương thức LẤY TẤT CẢ người dùng ---
    public List<User> findAll() {
        List<User> users = userRepository.findAll();
        logger.info("UserService.findAll: Fetched " + users.size() + " users.");
        // Log trạng thái avatarImage cho từng user trong danh sách (có thể gây log dài nếu nhiều user)
        // for (User user : users) {
        //      logger.info("UserService.findAll: User " + user.getId() + ". AvatarImage is null: " + (user.getAvatarImage() == null) + ", Length: " + (user.getAvatarImage() != null ? user.getAvatarImage().length() : "N/A"));
        // }
        return users;
    }

    // --- Phương thức CẬP NHẬT người dùng HIỆN CÓ với file avatar (tùy chọn) ---
    @Transactional
    public User updateUser(Long id, String name, String email, String password, String status, String bio, MultipartFile avatarFile) throws IOException {

        // Tìm người dùng hiện có
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy người dùng với ID: " + id));

        // Cập nhật các trường nếu được cung cấp
        if (name != null) existingUser.setName(name);
        if (email != null) existingUser.setEmail(email);
        if (password != null && !password.isEmpty()) { // Thêm kiểm tra rỗng
             existingUser.setPassword(password); // Cần hash mật khẩu này!
        }

        if (status != null) existingUser.setStatus(status);
        if (bio != null) existingUser.setBio(bio);
        existingUser.setUpdatedAt(LocalDateTime.now());

        // Xử lý file avatar nếu có file mới được upload
        if (avatarFile != null && !avatarFile.isEmpty()) {
            // Đọc dữ liệu nhị phân và mã hóa sang chuỗi Base64 (String)
            String base64Image = Base64.getEncoder().encodeToString(avatarFile.getBytes());
            // Gán chuỗi Base64 vào trường avatarImage (kiểu String)
            existingUser.setAvatarImage(base64Image);
            // Lấy content type của file
            existingUser.setAvatarContentType(avatarFile.getContentType());
             // Đảm bảo avatarUrl là null
             existingUser.setAvatarUrl(null);

             logger.info("UserService.updateUser: New avatar file processed and encoded to Base64. Base64 length: " + base64Image.length() + ", ContentType: " + existingUser.getAvatarContentType());
        } else {
             // Nếu không có file mới được gửi, giữ nguyên ảnh cũ.
             // Nếu bạn muốn chức năng xóa ảnh avatar từ frontend, cần thêm logic (ví dụ: nhận flag xóa từ Controller)
             // và xử lý ở đây: if (deleteAvatarFlag) { existingUser.setAvatarImage(null); existingUser.setAvatarContentType(null); existingUser.setAvatarUrl(null); }
             logger.info("UserService.updateUser: No new avatar file uploaded. Keeping existing avatar.");
        }

        // Logic lưu thay đổi vào DB
        User updatedUser = userRepository.save(existingUser);
        logger.info("UserService.updateUser: User " + updatedUser.getId() + " updated.");
        return updatedUser;
    }
    public Long countUser() {
        return userRepository.count();
    }
}
