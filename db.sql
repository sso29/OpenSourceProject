/* 기본 사용자 정보 */
CREATE TABLE users (
    user_id     SERIAL PRIMARY KEY,                 -- PK
    id          VARCHAR(30) UNIQUE NOT NULL,        -- 사용자 아이디
    pw          VARCHAR(50) NOT NULL,               -- 사용자 비밀번호(암호화)
    name        VARCHAR(30) NOT NULL,               -- 사용자 닉네임
    age         INT CHECK (age >= 0) NOT NULL,      -- 10 단위로
    gender      VARCHAR(10) CHECK (gender IN ('남', '여')) NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/* 사용자 정보 추가 */
CREATE TABLE user_profiles (
    profile_id  SERIAL PRIMARY KEY,                                                 -- PK
    user_id     INT UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,             -- 사용자 식별 번호
    level       VARCHAR(10) CHECK (level IN ('입문', '초보', '중수', '고수')),      -- 사용자 레벨
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);