import React from "react";
// 1. URL의 파라미터 값을 읽기 위한 useParams
// 2. 홈으로 돌아가기 위한 Link (MUI Button과 함께 사용하기 위해 RouterLink로 별칭)
import { useParams, Link as RouterLink } from "react-router-dom";
import { Container, Typography, Button, Box, Chip, Stack } from "@mui/material";

// 3. (경로 수정) 'src/pages' 폴더에서 한 단계 위('src')로 이동 후
//    'data' 폴더 안의 'contentsExample.json' 파일을 찾습니다.
import allContent from "../data/contentsExample.json";

const DetailPage = () => {
  // 4. URL의 :id 값을 가져옵니다.
  // URL이 /item/%EA%B8%B0%EC%83%9D%EC%B6%A9 이면,
  // id 변수에는 디코딩된 "기생충" 문자열이 할당됩니다.
  const { id } = useParams();

  // 5. 전체 데이터(allContent)에서 id(예: "기생충")와
  //    search_title이 일치하는 항목(item)을 찾습니다.
  const item = allContent.find((c) => c.search_title === id);

  // 6. 항목을 찾지 못한 경우 (메시지 수정)
  if (!item) {
    return (
      <Container maxWidth="lg" sx={{ pt: 3, pb: 6 }}>
        <Typography variant="h5">페이지를 찾을 수 없습니다.</Typography>
        <Button
          component={RouterLink}
          to="/"
          variant="contained"
          sx={{ mt: 2 }}
        >
          홈으로 돌아가기
        </Button>
      </Container>
    );
  }

  // 7. 항목을 찾은 경우, 상세 정보를 렌더링합니다.
  return (
    <Container maxWidth="lg" sx={{ pt: 3, pb: 6 }}>
      <Box
        sx={{
          display: "flex",
          gap: { xs: 2, md: 4 },
          flexDirection: { xs: "column", md: "row" }, // 모바일에선 세로, 데스크탑에선 가로
        }}
      >
        {/* 포스터 이미지 */}
        <Box
          component="img"
          src={item.poster_url}
          alt={item.title}
          sx={{
            width: { xs: "80%", sm: "60%", md: 300 },
            maxWidth: 350,
            height: "auto",
            objectFit: "cover",
            borderRadius: 3,
            alignSelf: "center",
            border: "1px solid",
            borderColor: "divider",
          }}
        />
        
        {/* 상세 정보 */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            {item.title}
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {item.media_type === "movie" ? "영화" : "TV"}
          </Typography>
          
          <Stack direction="row" spacing={1} sx={{ mt: 1, mb: 2, flexWrap: "wrap", gap: 0.5 }}>
            {item.genres.split(",").map((g) => (
              <Chip key={g} label={g.trim()} size="small" />
            ))}
          </Stack>

          <Typography variant="body1" sx={{ mt: 2, mb: 2, lineHeight: 1.7 }}>
            {item.overview}
          </Typography>

          <Typography variant="body2" sx={{ mt: 2, fontWeight: "bold" }}>
            주요 출연진
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {item.top_cast}
          </Typography>

          <Typography variant="body2" sx={{ mt: 2, fontWeight: "bold" }}>
            스트리밍
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {item.streaming_kr || "정보 없음"}
          </Typography>
        </Box>
      </Box>

      {/* 홈으로 돌아가기 버튼 */}
      <Button
        component={RouterLink}
        to="/"
        variant="outlined"
        sx={{ mt: 4 }}
      >
        홈으로 돌아가기
      </Button>
    </Container>
  );
};

export default DetailPage;