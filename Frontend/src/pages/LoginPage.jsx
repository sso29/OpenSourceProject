// // src/pages/LoginPage.jsx
// import React, { useState } from 'react';

// const LoginPage = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // 여기에 로그인 로직 (API 호출 등)을 추가합니다.
//     console.log('로그인 정보:', { email, password });
//     alert('로그인 요청이 처리되었습니다!');
//     // 성공 시 메인 페이지로 리다이렉트 등
//   };

//   return (
//     <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
//       <h1>로그인</h1>
//       <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
//         <div>
//           <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>이메일:</label>
//           <input
//             type="email"
//             id="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
//           />
//         </div>
//         <div>
//           <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>비밀번호:</label>
//           <input
//             type="password"
//             id="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
//           />
//         </div>
//         <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>로그인</button>
//       </form>
//     </div>
//   );
// };

// export default LoginPage;


// src/pages/LoginPage.jsx
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('로그인 정보:', { email, password });
    alert('로그인 요청이 처리되었습니다!');
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
            label="이메일"
            type="email"
            size='small'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
        
            required
            fullWidth
          />

          <TextField
            label="비밀번호"
            size='small'
            type="password"
            value={password}
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
