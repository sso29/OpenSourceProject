import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div style={{ paddingTop: '80px', textAlign: 'center' }}>
      <h1>환영합니다!</h1>
      <p>이곳은 저희 서비스의 메인 페이지입니다.</p>
      <p>상단 메뉴를 통해 로그인 또는 회원가입을 해주세요.</p>
      <Link to="/userinfo">사용자 정보 입력 페이지</Link>
    </div>
  );
};

export default HomePage;