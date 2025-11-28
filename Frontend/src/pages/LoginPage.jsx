import React, { useState } from 'react';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
} from '@mui/material';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const [id, setId] = useState('');
  const [pw, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',   // 세션 및 쿠키 유지
        body: JSON.stringify({ id, pw }),
      });;

      if (response.ok) {
        const data = await response.json();
        console.log('로그인 성공: ', data);
        localStorage.setItem("userName", data.name);    // 서버에서 받은 이름 저장
        alert('로그인 성공!');
        window.location.href='/';
      } else {
        const errorText = await response.text();
        alert('로그인 실패: ' + errorText);
      }
    } catch (err) {
        console.error('서버 오류: ', err);
        alert('서버 오류가 발생했습니다.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper
        elevation={2}
        sx={{
          p: 6,
          mt: 10,
          borderRadius: 3,
        }}
      >
        <Typography
          variant="h6"
          align="center"
          gutterBottom
          sx={{ fontWeight: 'bold' }}
        >
          로그인
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            mt: 2,
          }}
        >
          <TextField
            label="아이디"
            type="id"
            size='small'
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
            fullWidth
          />

          <TextField
            label="비밀번호"
            size='small'
            type="password"
            value={pw}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
          />

          <Button
            type="submit"
            variant="contained"
            size="small"
    
            sx={{
              mt: 2,
              py: 1.5,
              backgroundColor: '#7d7d7d',
              fontWeight: 'bold',
              '&:hover': { backgroundColor: '#c8c8c8' },
            }}
          >
            로그인
          </Button>
        </Box>
        <div style={{ padding: '16px', textAlign: 'center' }}>
  계정이 없으신가요?{' '}
  <Link to="/register" style={{ color: '#1976d2', textDecoration: 'none' }}>
    회원가입 하기
  </Link>
</div>

        
        
        
      </Paper>
    </Container>
  );
};

export default LoginPage;
