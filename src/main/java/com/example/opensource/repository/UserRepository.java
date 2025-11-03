package com.example.opensource.repository;

import com.example.opensource.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findById(String id);     // 아이디 기준 조회
    boolean existsById(String id);          // 아이디 중복 체크
}
