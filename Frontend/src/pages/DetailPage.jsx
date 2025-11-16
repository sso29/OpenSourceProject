import React, { useState, useEffect } from "react"; // (수정) useState, useEffect 임포트
// 1. URL의 파라미터 값을 읽기 위한 useParams
// 2. 홈으로 돌아가기 위한 Link (MUI Button과 함께 사용하기 위해 RouterLink로 별칭)
import { useParams, Link as RouterLink } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  Box,
  Chip,
  Stack,
  CircularProgress, // (신규) 로딩 스피너
  Paper, // (신규) 마크다운을 감쌀 UI
  Alert, // (신규) 오류 표시
} from "@mui/material";

// 3. (경로 수정) 'src/pages' 폴더에서 한 단계 위('src')로 이동 후
//    'data' 폴더 안의 'contentsExample.json' 파일을 찾습니다.
import allContent from "../data/contentsExample.json";

// --- (신규) AI 응답 (마크다운)을 "예쁘게" 렌더링할 헬퍼 컴포넌트 ---
// 간단한 마크다운 파서 (h2, h3, bold, list item, p)
const MarkdownViewer = ({ content }) => {
  if (!content) {
    return null;
  }

  const lines = content.split("\n");

  return (
    <Box sx={{ lineHeight: 1.7 }}>
      {lines.map((line, index) => {
        line = line.trim();

        // H2 (## 🎬 '제목'...)
        if (line.startsWith("## ")) {
          return (
            <Typography
              key={index}
              variant="h5"
              component="h2"
              sx={{ mt: 3, mb: 1, fontWeight: 600, borderBottom: "1px solid", borderColor: "divider", pb: 1 }}
            >
              {line.substring(3)}
            </Typography>
          );
        }
        
        // H3 (1. **[장소]**)
        if (/^\d+\.\s\*\*.+\*\*$/.test(line)) {
           // "1. **[장소 1 이름]**" -> "[장소 1 이름]"
           const title = line.substring(line.indexOf("**") + 2, line.lastIndexOf("**"));
           return (
             <Typography key={index} variant="h6" component="h3" sx={{ mt: 2.5, mb: 1, fontWeight: 600 }}>
               {`${line.substring(0, line.indexOf("**"))} ${title}`}
             </Typography>
           );
         }

        // 목록 ( - **위치:** ...)
        if (line.startsWith("- ")) {
          const boldMatch = line.match(/\*\*(.*?)\*\*/);
          if (boldMatch) {
            // **위치:** (설명)
            const label = boldMatch[1];
            const text = line.substring(boldMatch[0].length + 2); // "- " 이후, bold 이후
            return (
              <Box key={index} sx={{ display: "flex", pl: 2 }}>
                <Typography component="span" sx={{ fontWeight: "bold", mr: 1 }}>
                  {label}
                </Typography>
                <Typography component="span" color="text.secondary">{text}</Typography>
              </Box>
            );
          }
        }
        
        // Bold (마무리 멘트)
        if (line.startsWith("**") && line.endsWith("**")) {
           return (
             <Typography key={index} variant="body1" sx={{ mt: 3, fontStyle: 'italic', fontWeight: 500 }}>
               {line.substring(2, line.length - 2)}
             </Typography>
           );
         }

        // 기본 문단
        if (line.length > 0) {
          return (
            <Typography key={index} variant="body1" paragraph sx={{ mb: 1 }}>
              {line}
            </Typography>
          );
        }
        
        return null;
      })}
    </Box>
  );
};
// --- 헬퍼 컴포넌트 끝 ---


const DetailPage = () => {
  // 4. URL의 :id 값을 가져옵니다. (예: "기생충")
  const { id } = useParams();

  // (신규) AI 추천 코스를 저장할 state
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 오류 상태

  // 5. 전체 데이터(allContent)에서 id(예: "기생충")와
  //    search_title이 일치하는 항목(item)을 찾습니다.
  const item = allContent.find((c) => c.search_title === id);

  // --- (신규) AI 서버에서 추천 코스를 가져오는 로직 ---
  useEffect(() => {
    // 항목(item)을 찾지 못했거나 id가 없으면 AI 호출을 중지합니다.
    if (!id || !item) {
      setLoading(false); // 기본 정보도 없으므로 로딩 중지
      return;
    }

    // AI 서버에 특정 제목에 대한 추천을 요청합니다.
    const fetchRecommendation = async () => {
      setLoading(true);
      setError(null);
      try {
        // AI 서버 (Python)의 엔드포인트를 호출합니다.
        // Docker 환경에서는 React(app)가 AI(ai)를 'http://ai:5000'로 호출할 수 있지만,
        // 개발 환경(localhost)에서는 'http://localhost:5000'로 호출합니다.
        // Docker Compose에서 React 앱이 3000번, AI가 5000번으로 열려있다고 가정합니다.
        
        // (주의) URL 인코딩: '선재 업고 튀어' -> '선재%20업고%20튀어'
        const encodedTitle = encodeURIComponent(id);
        const response = await fetch(`http://localhost:5000/recommend/${encodedTitle}`);

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.detail || `AI 서버 오류: ${response.statusText}`);
        }

        const data = await response.json(); // { title: "...", recommendation: "..." }
        setRecommendation(data.recommendation);
      } catch (err) {
        console.error("AI 추천 코스 로딩 실패:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendation();
  }, [id, item]); // id 또는 item이 변경될 때마다 다시 호출

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
      {/* --- 기본 콘텐츠 정보 (상단) --- */}
      <Box
        sx={{
          display: "flex",
          gap: { xs: 2, md: 4 },
          flexDirection: { xs: "column", md: "row" }, // 모바일에선 세로, 데스크탑에선 가로
          pb: 4, // 하단 AI 추천과 간격
          borderBottom: "1px solid", // 구분선
          borderColor: "divider"
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

      {/* --- (신규) AI 추천 코스 섹션 (하단) --- */}
      <Box sx={{ pt: 4 }}>
        <Typography variant="h4" component="h2" sx={{ fontWeight: 700, mb: 2 }}>
          AI 추천 여행 코스
        </Typography>
        
        {/* 로딩 중일 때 */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
            <Box textAlign="center">
              <CircularProgress />
              <Typography sx={{ mt: 1 }}>AI가 추천 코스를 생성 중입니다...</Typography>
            </Box>
          </Box>
        )}
        
        {/* 오류 발생 시 */}
        {error && (
           <Alert severity="error">
             오류가 발생했습니다: {error}
           </Alert>
         )}
         
        {/* 성공 시 (로딩X, 오류X, recommendation 있음) */}
        {!loading && !error && recommendation && (
          <Paper variant="outlined" sx={{ p: { xs: 2, md: 4 } }}>
            <MarkdownViewer content={recommendation} />
          </Paper>
        )}
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