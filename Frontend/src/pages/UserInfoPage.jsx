import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';

const UserInfoPage = () => {
  const [level, setLevel] = useState('');

  const handleChange = (event, newLevel) => {
    if (newLevel !== null) {
      setLevel(newLevel);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!level) {
      alert('레벨을 선택해주세요!');
      return;
    }
    console.log('선택한 레벨:', level);
    alert(`${level} 레벨로 선택되었습니다!`);
  };

  return (
    <Container maxWidth="sm" sx={{ pt: 10 }}>
   
        <Typography
          variant="h6"
          align="center"
          gutterBottom
          sx={{ fontWeight: 'bold' }}
        >
          레벨 선택
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            mt: 2,
          }}
        >
          <ToggleButtonGroup
            color="standard"
            value={level}
            exclusive
            onChange={handleChange}
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 1,
              width: '100%',
            }}
          >
            <ToggleButton value="입문" sx={{ flex: 1, minWidth: '100px' }}>입문</ToggleButton>
            <ToggleButton value="초보" sx={{ flex: 1, minWidth: '100px' }}>초보</ToggleButton>
            <ToggleButton value="중수" sx={{ flex: 1, minWidth: '100px' }}>중수</ToggleButton>
            <ToggleButton value="고수" sx={{ flex: 1, minWidth: '100px' }}>고수</ToggleButton>
          </ToggleButtonGroup>

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
            제출하기
          </Button>
        </Box>

    </Container>
  );
};

export default UserInfoPage;
