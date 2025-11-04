package com.example.opensource.dto;

import com.example.opensource.domain.Level;
import com.example.opensource.entity.UserProfile;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileDto {
    private Level level;

    public static UserProfileDto toDto(UserProfile userProfile) {
        return UserProfileDto.builder()
                .level(userProfile.getLevel())
                .build();
    }
}
