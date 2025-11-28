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
      history.back();
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
