package com.example.opensource.service;

import com.example.opensource.domain.Level;
import com.example.opensource.dto.UserProfileDto;
import com.example.opensource.entity.User;
import com.example.opensource.entity.UserProfile;
import com.example.opensource.repository.UserProfileRepository;
import com.example.opensource.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class UserProfileService {

    private final UserProfileRepository userProfileRepository;
    private final UserRepository userRepository;

    public UserProfileDto createUserProfile(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("해당 유저가 존재하지 않습니다."));

        // 이미 프로필이 존재한다면 생성하지 않음
        Optional<UserProfile> existingUserProfile = userProfileRepository.findByUser(user);
        if (existingUserProfile.isPresent()) {
            return UserProfileDto.toDto(existingUserProfile.get());
        }

        UserProfile userProfile = UserProfile.builder()
                .user(user)
                .level(Level.초보)        // 기본값
                .build();

        userProfileRepository.save(userProfile);
        return UserProfileDto.toDto(userProfile);
    }

    public UserProfileDto getProfile(String userId) {
        UserProfile userProfile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("해당 유저의 프로필이 존재하지 않습니다."));

        return UserProfileDto.toDto(userProfile);
    }

    public UserProfileDto updateUserProfile(String userId, Level newLevel) {
        UserProfile userProfile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("해당 유저의 프로필이 존재하지 않습니다."));

        userProfile.setLevel(newLevel);
        userProfileRepository.save(userProfile);

        return UserProfileDto.toDto(userProfile);
    }



}
