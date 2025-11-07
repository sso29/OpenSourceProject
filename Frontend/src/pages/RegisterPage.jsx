// import react, { useState } from 'react';

// const RegisterPage = () => {
//     const [id, setId] = useState('');
//     const [name, setName] = useState('');
//     const [pw, setPw] = useState('');

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         console.log('회원가입 정보 : ', { id, name, pw });
//         alert('회원가입이 완료되었습니다.');
//         //성공 시 로그인 페이지로 이동
//         }

//     return (
//         <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
//             <h1>Register</h1>
//             <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
//                 <div>
//                     <label htmlFor="id" style={{ display: 'block', marginBottom: '5px' }}>사용자 이름</label>
//                     <input
//                         type="text"
//                         name="id"
//                         value={id}
//                         onChange={(e) => setId(e.target.value)}
//                         required
//                         style={{ width: '100%', padding: '8px', boxSizing: 'border-box'}}
//                     />
//                     <label htmlFor="name" style={{ display: 'block', marginBottom: '5px' }}>사용자 이름</label>
//                     <input
//                         type="text"
//                         name="name"
//                         value={name}
//                         onChange={(e) => setId(e.target.value)}
//                         required
//                         style={{ width: '100%', padding: '8px', boxSizing: 'border-box'}}
//                     />
//                     <label htmlFor="pw" style={{ display: 'block', marginBottom: '5px' }}>사용자 이름</label>
//                     <input
//                         type="password"
//                         name="pw"
//                         value={pw}
//                         onChange={(e) => setId(e.target.value)}
//                         required
//                         style={{ width: '100%', padding: '8px', boxSizing: 'border-box'}}
//                     />
//                 </div>
//                 <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>Sign Up</button>
//             </form>
//         </div>
//         );
//     };

// export default RegisterPage;

import React, { useState } from 'react';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  MenuItem,
} from '@mui/material';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    id: '',
    pw: '',
    pwConfirm: '',
    name: '',
    age: '',
    gender: '',
    level: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/users/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || '회원가입 실패');
      }

      const data = await response.json();
      console.log('회원가입 성공: ', data);
      alert('회원가입이 완료되었습니다!');
    } catch (error) {
      console.error('회원가입 오류: ', error.message);
      alert('회원가입 중 문제가 발생했습니다.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper
        elevation={3}
        sx={{
          p: 5,
          mt: 8,
          borderRadius: 3,
          backgroundColor: '#ffffff',
          boxShadow: '0 3px 8px rgba(0,0,0,0.1)',
        }}
      >
        <Typography
          variant="h6"
          align="center"
          gutterBottom
          sx={{ fontWeight: 'bold' }}
        >
          회원가입
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5,
            mt: 3,
          }}
        >
          <TextField
            label="아이디"
            name="id"
            size="small"
            fullWidth
            required
            value={formData.id}
            onChange={handleChange}
          />
          <TextField
            label="비밀번호"
            name="pw"
            type="password"
            size="small"
            fullWidth
            required
            value={formData.pw}
            onChange={handleChange}
          />
          <TextField
            label="비밀번호 확인"
            name="pwConfirm"
            type="password"
            size="small"
            fullWidth
            required
            value={formData.pwConfirm}
            onChange={handleChange}
          />
          <TextField
            label="이름"
            name="name"
            size="small"
            fullWidth
            required
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            label="나이"
            name="age"
            type="number"
            size="small"
            fullWidth
            required
            value={formData.age}
            onChange={handleChange}
          />

          <FormControl component="fieldset">
            <FormLabel component="legend" sx={{ fontSize: '0.9rem', color: '#555' }}>
              성별
            </FormLabel>
            <RadioGroup
              row
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <FormControlLabel value="male" control={<Radio />} label="남성" />
              <FormControlLabel value="female" control={<Radio />} label="여성" />
            </RadioGroup>
          </FormControl>

          {/* <TextField
            select
            label="등급"
            name="level"
            size="small"
            fullWidth
            required
            value={formData.level}
            onChange={handleChange}
          >
            <MenuItem value="">등급 선택</MenuItem>
            <MenuItem value="beginner">입문</MenuItem>
            <MenuItem value="intermediate">초보</MenuItem>
            <MenuItem value="advanced">중수</MenuItem>
            <MenuItem value="advanced">고수</MenuItem>
          </TextField> */}

          <Button
            type="submit"
            variant="contained"
            size="small"
            sx={{
              mt: 2,
              py: 1.3,
              backgroundColor: '#7d7d7d',
              fontWeight: 'bold',
              '&:hover': { backgroundColor: '#c8c8c8', color: 'black' },
            }}
          >
            회원가입
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterPage;
