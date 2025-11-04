package com.example.opensource.repository;

import com.example.opensource.entity.User;
import com.example.opensource.entity.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
    Optional<UserProfile> findByUserId(String userId);
    Optional<UserProfile> findByUser(User user);
}
