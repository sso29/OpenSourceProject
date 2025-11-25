package com.example.opensource.controller;

import com.example.opensource.domain.Level;
import com.example.opensource.dto.UserProfileDto;
import com.example.opensource.service.UserProfileService;
import jakarta.servlet.http.HttpSession;
import lombok.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user-profiles")
@RequiredArgsConstructor
public class UserProfileController {

    private final UserProfileService userProfileService;

    @Getter
    @Setter
    public static class LevelUpdateRequest {
        private Level newLevel;
    }

    // 프로필 생성
    @PostMapping("/create")
    public ResponseEntity<UserProfileDto> createProfile(HttpSession session) {
        String userId = (String) session.getAttribute("loginId");
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(userProfileService.createUserProfile(userId));
    }

    // 프로필 조회
    @GetMapping
    public ResponseEntity<UserProfileDto> getProfile(HttpSession session) {
        String userId = (String) session.getAttribute("loginId");
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(userProfileService.getProfile(userId));
    }

    @PutMapping("/level")
    public ResponseEntity<UserProfileDto> updateProfile(HttpSession session,
                                                        @RequestBody LevelUpdateRequest request) {
        String userId = (String) session.getAttribute("loginId");
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(userProfileService.updateUserProfile(userId, request.getNewLevel()));
    }

}
