import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';

const UserInfoPage = () => {

  const GROUPS = ['가족', '연인', '혼자', '친구'];
  const LEVELS = ['입문', '초보', '중수', '고수'];

  const GENRES = ['공포-스릴러', '멜로', '코미디', '액션', 'SF'];
  const MOODS = ['힐링', '긴장감', '유쾌', '현실적', '감동적'];

  const [group, setGroup] = useState('');
  const [level, setLevel] = useState('');
  const [genres, setGenres] = useState([]);
  const [moods, setMoods] = useState([]);

  const handleGroupChange = (_e, val) => { if (val !== null) setGroup(val); };
  const handleLevelChange = (_e, val) => { if (val !== null) setLevel(val); };

  const handleToggleArray = (value, setter) => {
    setter(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!group) return alert('구성원을 선택해주세요!');
    if (!level) return alert('숙련도를 선택해주세요!');
    if (genres.length === 0) return alert('선호 장르를 1개 이상 선택해주세요!');
    if (moods.length === 0) return alert('분위기를 1개 이상 선택해주세요!');

    const payload = { group, level, genres, moods };
    console.log('온보딩 선택값:', payload);
    try {
      localStorage.setItem('onboarding', JSON.stringify(payload));
    } catch (_) {}
    alert('선택이 저장되었습니다!');
  };

  const buttonSx = { flex: 1, minWidth: '100px' };
  const groupSx = {
    display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
    gap: 1, width: '100%',
  };

  return (
    <Container maxWidth="sm" sx={{ pt: 10 }}>
      {/* 구성원 선택 */}
      <Typography variant="h6" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
        구성원 선택
      </Typography>
      <Box component="form" onSubmit={handleSubmit}
           sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, mt: 2 }}>

        <ToggleButtonGroup
          color="standard"
          value={group}
          exclusive
          onChange={handleGroupChange}
          sx={groupSx}
        >
          {GROUPS.map(g => (
            <ToggleButton key={g} value={g} sx={buttonSx}>{g}</ToggleButton>
          ))}
        </ToggleButtonGroup>

        {/* 숙련도 선택 */}
        <Typography variant="h6" align="center" gutterBottom sx={{ fontWeight: 'bold', mt: 1 }}>
          레벨 선택
        </Typography>
        <ToggleButtonGroup
          color="standard"
          value={level}
          exclusive
          onChange={handleLevelChange}
          sx={groupSx}
        >
          {LEVELS.map(l => (
            <ToggleButton key={l} value={l} sx={buttonSx}>{l}</ToggleButton>
          ))}
        </ToggleButtonGroup>

        {/* 선호 장르 (다중) */}
        <Typography variant="h6" align="center" gutterBottom sx={{ fontWeight: 'bold', mt: 1 }}>
          선호 장르
        </Typography>
        <ToggleButtonGroup
          color="standard"
          value={genres}
          onChange={(_e, _val) => {}}
          sx={groupSx}
        >
          {GENRES.map(genre => (
            <ToggleButton
              key={genre}
              value={genre}
              selected={genres.includes(genre)}
              onClick={() => handleToggleArray(genre, setGenres)}
              sx={buttonSx}
            >
              {genre}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        {/* 감정 분위기 (다중) */}
        <Typography variant="h6" align="center" gutterBottom sx={{ fontWeight: 'bold', mt: 1 }}>
          분위기 선호
        </Typography>
        <ToggleButtonGroup
          color="standard"
          value={moods}
          onChange={(_e, _val) => {}}
          sx={groupSx}
        >
          {MOODS.map(m => (
            <ToggleButton
              key={m}
              value={m}
              selected={moods.includes(m)}
              onClick={() => handleToggleArray(m, setMoods)}
              sx={buttonSx}
            >
              {m}
            </ToggleButton>
          ))}
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
