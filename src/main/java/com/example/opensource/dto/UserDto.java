package com.example.opensource.dto;

import com.example.opensource.domain.Gender;
import com.example.opensource.entity.User;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {
    private String id;
    private String pw;
    private String pwConfirm;       // 비밀번호 확인 -> Entity 저장 X
    private String name;
    private int age;
    private Gender gender;

    public static UserDto toDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .age(user.getAge())
                .gender(user.getGender())
                .build();

    }
}
