package com.example.opensource.service;

import com.example.opensource.dto.UserDto;
import com.example.opensource.entity.User;
import com.example.opensource.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public UserDto save(UserDto dto) {
        if (!dto.getPw().equals(dto.getPwConfirm())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }
        
        if (userRepository.existsById(dto.getId())) {
            throw new RuntimeException("이미 사용 중인 아이디입니다.");
        }

        User user = User.toUser(dto);
        user.setPw(passwordEncoder.encode(dto.getPw()));
        User saved = userRepository.save(user);

        return UserDto.toDto(saved);
    }

    public UserDto login(UserDto dto) {
        User user = userRepository.findById(dto.getId())
                .orElseThrow(() -> new RuntimeException("존재하지 않는 아이디입니다."));
        
        if (!passwordEncoder.matches(dto.getPw(), user.getPw())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }

        return UserDto.toDto(user);
    }

    public boolean isIdExist(String id) {
        return userRepository.existsById(id);
    }

    public UserDto findById(String id) {
        return userRepository.findById(id)
                .map(UserDto::toDto)
                .orElse(null);
    }
}
