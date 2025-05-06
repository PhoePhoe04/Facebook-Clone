package com.facebookclone.fb_backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class FileUploadController {

    private static final String UPLOAD_DIR = "backend/Uploads";

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("avatar") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Vui lòng chọn file ảnh"));
            }

            if (file.getSize() > 5 * 1024 * 1024) {
                return ResponseEntity.status(413).body(Map.of("message", "Ảnh quá lớn. Vui lòng chọn ảnh dưới 5MB"));
            }

            if (!file.getContentType().startsWith("image/")) {
                return ResponseEntity.badRequest().body(Map.of("message", "Chỉ chấp nhận file ảnh"));
            }

            File uploadDir = new File(UPLOAD_DIR);
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }

            String filename = System.currentTimeMillis() + "-" + file.getOriginalFilename();
            Path filePath = Paths.get(UPLOAD_DIR, filename);
            Files.write(filePath, file.getBytes());

            String url = "/Uploads/" + filename;
            Map<String, String> response = new HashMap<>();
            response.put("url", url);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("message", "Lỗi khi tải ảnh lên", "error", e.getMessage()));
        }
    }
}