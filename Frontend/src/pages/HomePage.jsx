// // src/pages/HomePage.jsx
// import React, { useMemo, useRef, useState } from "react";
// import {
//   Box,
//   Button,
//   Card,
//   CardActionArea,
//   CardContent,
//   CardMedia,
//   Chip,
//   Container,
//   Divider,
//   Grid,
//   IconButton,
//   Paper,
//   Stack,
//   ToggleButton,
//   ToggleButtonGroup,
//   Typography,
// } from "@mui/material";
// import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
// import ChevronRightIcon from "@mui/icons-material/ChevronRight";

// /* ---------- 옵션 목록 ---------- */
// const GROUPS = ["가족과", "연인과", "혼자서", "친구랑"];
// const LEVELS = ["입문", "초보", "중수", "고수"];
// const GENRES = ["공포·스릴러", "멜로", "코미디", "액션", "SF", "다큐"];
// const MOODS = ["힐링", "긴장감", "유쾌", "현실적", "감동적", "철학적"];

// /* ---------- 가로 스크롤 버튼 위치 ---------- */
// const PlaceholderScroller = ({ count = 10, ratio = "3/4" }) => {
//   const ref = useRef(null);
//   const scrollBy = (amt) =>
//     ref.current?.scrollBy({ left: amt, behavior: "smooth" });

//   return (
//     <Box sx={{ position: "relative" }}>
//       <IconButton
//         aria-label="prev"
//         onClick={() => scrollBy(-600)}
//         sx={{ position: "absolute", top: -40, right: 56, zIndex: 1 }}
//         size="small"
//       >
//         <ChevronLeftIcon />
//       </IconButton>
//       <IconButton
//         aria-label="next"
//         onClick={() => scrollBy(600)}
//         sx={{ position: "absolute", top: -40, right: 12, zIndex: 1 }}
//         size="small"
//       >
//         <ChevronRightIcon />
//       </IconButton>

//       <Box
//         ref={ref}
//         sx={{
//           display: "flex",
//           gap: 1.5,
//           overflowX: "auto",
//           scrollBehavior: "smooth",
//           pr: 8,
//           pb: 0.5,
//         }}
//       >
//         {Array.from({ length: count }).map((_, i) => (
//           <Card
//             key={i}
//             sx={{
//               width: 160,
//               borderRadius: 2,
//               flex: "0 0 auto",
//               bgcolor: "background.default",
//               border: "1px solid",
//               borderColor: "divider",
//             }}
//           >
//             <CardActionArea
//               onClick={() => {
//                 /* 추후 링크 */
//               }}
//             >
//               <CardMedia
//                 component="div"
//                 sx={{
//                   aspectRatio: ratio,
//                   display: "grid",
//                   placeItems: "center",
//                   bgcolor: "action.hover",
//                 }}
//               >
//                 <Typography variant="caption" color="text.secondary">
//                   이미지
//                 </Typography>
//               </CardMedia>
//               <CardContent sx={{ py: 0.75 }}>
//                 <Typography variant="body2" noWrap>
//                   (제목)
//                 </Typography>
//                 <Typography variant="caption" noWrap color="text.secondary">
//                   (ㅎㅇ)
//                 </Typography>
//               </CardContent>
//             </CardActionArea>
//           </Card>
//         ))}
//       </Box>
//     </Box>
//   );
// };

// const SectionTitle = ({ children }) => (
//   <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.25 }}>
//     {children}
//   </Typography>
// );

// /* ---------- 필 버튼 스타일 ---------- */
// const pillSx = {
//   px: 1.6,
//   minHeight: 30,
//   borderRadius: 999,
//   borderColor: "divider",
//   textTransform: "none",
// };
// const pillSelectedSx = {
//   bgcolor: "primary.main",
//   color: "#fff",
//   borderColor: "primary.main",
//   "&:hover": { bgcolor: "primary.main" },
// };

// const HomePage = () => {
//   const [group, setGroup] = useState("");
//   const [level, setLevel] = useState("");
//   const [genres, setGenres] = useState([]);
//   const [moods, setMoods] = useState([]);

//   const toggleMulti = (value, setter) => {
//     setter((prev) =>
//       prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
//     );
//   };

//   const summary = useMemo(() => {
//     const items = [
//       group,
//       level,
//       genres.length ? `장르:${genres.join("/")}` : "",
//       moods.length ? `분위기:${moods.join("/")}` : "",
//     ].filter(Boolean);
//     return items.length ? items.join(" · ") : "선호 정보를 선택해 보세요.";
//   }, [group, level, genres, moods]);

//   const titlePrefix = useMemo(() => {
//     const parts = summary.split(" · ");

//     return parts.join(" "); // 띄어쓰기가 적용된 문자열 반환
//   }, [summary]);

//   return (
//     <Container maxWidth="lg" sx={{ pt: 3, pb: 6 }}>
//       <Stack spacing={1.25} sx={{ mb: 2 }}>
//         <Stack
//           direction={{ xs: "column", md: "row" }}
//           spacing={0.75}
//           useFlexGap
//         >
//           <ToggleButtonGroup
//             value={group}
//             exclusive
//             onChange={(_, v) => v !== null && setGroup(v)}
//             sx={{
//               flex: 1,
//               flexWrap: "wrap",
//               gap: 0.5,
//               "& .MuiToggleButton-root": { ...pillSx, borderWidth: 1 },
//               "& .Mui-selected": pillSelectedSx,
//             }}
//             size="small"
//           >
//             {GROUPS.map((g) => (
//               <ToggleButton key={g} value={g} size="small">
//                 {g}
//               </ToggleButton>
//             ))}
//           </ToggleButtonGroup>

//           <ToggleButtonGroup
//             value={level}
//             exclusive
//             onChange={(_, v) => v !== null && setLevel(v)}
//             sx={{
//               flex: 1,
//               flexWrap: "wrap",
//               gap: 0.5,
//               "& .MuiToggleButton-root": { ...pillSx, borderWidth: 1 },
//               "& .Mui-selected": pillSelectedSx,
//             }}
//             size="small"
//           >
//             {LEVELS.map((l) => (
//               <ToggleButton key={l} value={l} size="small">
//                 {l}
//               </ToggleButton>
//             ))}
//           </ToggleButtonGroup>
//         </Stack>

//         {/* 장르 / 분위기 (다중 선택) */}
//         <Stack
//           direction={{ xs: "column", md: "row" }}
//           spacing={0.75}
//           useFlexGap
//         >
//           <Stack direction="row" sx={{ flex: 1, flexWrap: "wrap", gap: 0.5 }}>
//             {GENRES.map((g) => {
//               const selected = genres.includes(g);
//               return (
//                 <Chip
//                   key={g}
//                   label={g}
//                   size="small"
//                   onClick={() => toggleMulti(g, setGenres)}
//                   variant={selected ? "filled" : "outlined"}
//                   color={selected ? "primary" : "default"}
//                   sx={{
//                     borderRadius: 999,
//                     height: 28,
//                     "& .MuiChip-label": { px: 1.25 },
//                   }}
//                 />
//               );
//             })}
//           </Stack>

//           <Stack direction="row" sx={{ flex: 1, flexWrap: "wrap", gap: 0.5 }}>
//             {MOODS.map((m) => {
//               const selected = moods.includes(m);
//               return (
//                 <Chip
//                   key={m}
//                   label={m}
//                   size="small"
//                   onClick={() => toggleMulti(m, setMoods)}
//                   variant={selected ? "filled" : "outlined"}
//                   color={selected ? "primary" : "default"}
//                   sx={{
//                     borderRadius: 999,
//                     height: 28,
//                     "& .MuiChip-label": { px: 1.25 },
//                   }}
//                 />
//               );
//             })}
//           </Stack>
//         </Stack>
//       </Stack>

//       <Box sx={{ mb: 3 }}>
//         <SectionTitle>
//           <span style={{ color: "#00bcd4" }}>{titlePrefix}</span> 맞춤 추천작품
//         </SectionTitle>
//         <PlaceholderScroller count={12} ratio="3/4" />
//       </Box>

//       <Box sx={{ mb: 3 }}>
//         <SectionTitle>추천 여행지(예시)</SectionTitle>
//         <PlaceholderScroller count={12} ratio="1/1" />
//       </Box>

//       <Box sx={{ mb: 3 }}>
//         <SectionTitle>추천 이벤트(예시)</SectionTitle>
//         <PlaceholderScroller count={12} ratio="1/1" />
//       </Box>

//       <Box sx={{ mb: 3 }}>
//         <SectionTitle>
//           {" "}
//           <span style={{ color: "#e71616ff" }}>{summary.split(" · ")[0]}</span>
//           보기 좋은 작품
//         </SectionTitle>
//         <PlaceholderScroller count={12} ratio="3/4" />
//       </Box>

//       <Box sx={{ mb: 3 }}>
//         <SectionTitle>
//           <span style={{ color: "#edb90cff" }}>
//             {" "}
//             k-contents {summary.split(" · ")[1]}
//           </span>
//           를 위한 추천 작품
//         </SectionTitle>
//         <PlaceholderScroller count={12} ratio="3/4" />
//       </Box>

//       <Box sx={{ mb: 3 }}>
//         <SectionTitle>ost(예시)</SectionTitle>
//         <Grid container spacing={1.5}>
//           {Array.from({ length: 8 }).map((_, i) => (
//             <Grid key={i} item xs={12} sm={6} md={4} lg={3}>
//               <Card
//                 sx={{
//                   borderRadius: 2,
//                   overflow: "hidden",
//                   bgcolor: "background.default",
//                   border: "1px solid",
//                   borderColor: "divider",
//                 }}
//               >
//                 <CardActionArea onClick={() => {}}>
//                   <Box
//                     sx={{
//                       aspectRatio: "4 / 3",
//                       width: "100%",
//                       display: "grid",
//                       placeItems: "center",
//                       bgcolor: "action.hover",
//                     }}
//                   >
//                     <Typography variant="caption" color="text.secondary">
//                       이미지
//                     </Typography>
//                   </Box>
//                   <CardContent sx={{ py: 0.75 }}>
//                     <Typography variant="body2">(제목-가수)</Typography>
//                   </CardContent>
//                 </CardActionArea>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       </Box>
//     </Container>
//   );
// };

// export default HomePage;

import React, { useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
// 1. react-router-dom의 useNavigate를 임포트합니다.
import { useNavigate } from "react-router-dom";

// 2. JSON 데이터를 임포트합니다. (경로 확인 필수!)
// 경로를 수정했습니다. ( ../data -> ./data )
// src/pages/data/contentsExample.json 에 파일이 있다고 가정합니다.
import allContent from "../data/contentsExample.json";

/* ---------- 옵션 목록 ---------- */
const GROUPS = ["가족과", "연인과", "혼자서", "친구랑"];
const LEVELS = ["입문", "초보", "중수", "고수"];
const GENRES = ["공포·스릴러", "멜로", "코미디", "액션", "SF", "다큐"];
const MOODS = ["힐링", "긴장감", "유쾌", "현실적", "감동적", "철학적"];

/* ---------- (수정) ContentScroller: 데이터를 받아 카드를 생성합니다 ---------- */
// 'count' 대신 'items' (데이터 배열)을 prop으로 받도록 수정
const ContentScroller = ({ items = [], ratio = "3/4" }) => {
  const ref = useRef(null);
  const scrollBy = (amt) =>
    ref.current?.scrollBy({ left: amt, behavior: "smooth" });

  // 3. navigate 훅을 사용합니다.
  const navigate = useNavigate();

  return (
    <Box sx={{ position: "relative" }}>
      <IconButton
        aria-label="prev"
        onClick={() => scrollBy(-600)}
        sx={{ position: "absolute", top: -40, right: 56, zIndex: 1 }}
        size="small"
      >
        <ChevronLeftIcon />
      </IconButton>
      <IconButton
        aria-label="next"
        onClick={() => scrollBy(600)}
        sx={{ position: "absolute", top: -40, right: 12, zIndex: 1 }}
        size="small"
      >
        <ChevronRightIcon />
      </IconButton>

      <Box
        ref={ref}
        sx={{
          display: "flex",
          gap: 1.5,
          overflowX: "auto",
          scrollBehavior: "smooth",
          pr: 8,
          pb: 0.5,
        }}
      >
        {/* 4. Array.from 대신 실제 items 배열을 map()으로 순회합니다. */}
        {items.map((item) => (
          <Card
            key={item.search_title} // 5. 고유한 key로 search_title 사용
            sx={{
              width: 160,
              borderRadius: 2,
              flex: "0 0 auto",
              bgcolor: "background.default",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <CardActionArea
              onClick={() => {
                // 6. 클릭 시 DetailPage로 이동 (id로 search_title 전달)
                navigate(`/item/${item.search_title}`);
              }}
            >
              <CardMedia
                component="img" // 7. 'div' -> 'img'로 변경 (사진)
                sx={{
                  aspectRatio: ratio,
                  bgcolor: "action.hover", // 로딩 중 배경색
                }}
                image={item.poster_url} // 8. 포스터 URL 적용 (사진)
                alt={item.title} // (이름)
              />
              <CardContent sx={{ py: 0.75 }}>
                <Typography variant="body2" noWrap>
                  {item.title} {/* 9. 실제 제목 적용 (이름) */}
                </Typography>
                <Typography variant="caption" noWrap color="text.secondary">
                  {/* 10. media_type에 따라 '영화' 또는 'TV' 표시 (타입) */}
                  {item.media_type === "movie" ? "영화" : "TV"}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

const SectionTitle = ({ children }) => (
  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.25 }}>
    {children}
  </Typography>
);

/* ---------- 필 버튼 스타일 (동일) ---------- */
const pillSx = {
  px: 1.6,
  minHeight: 30,
  borderRadius: 999,
  borderColor: "divider",
  textTransform: "none",
};
const pillSelectedSx = {
  bgcolor: "primary.main",
  color: "#fff",
  borderColor: "primary.main",
  "&:hover": { bgcolor: "primary.main" },
};

const HomePage = () => {
  const [group, setGroup] = useState("");
  const [level, setLevel] = useState("");
  const [genres, setGenres] = useState([]);
  const [moods, setMoods] = useState([]);

  const toggleMulti = (value, setter) => {
    setter((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const summary = useMemo(() => {
    // ... (이 부분은 기존과 동일)
    const items = [
      group,
      level,
      genres.length ? `장르:${genres.join("/")}` : "",
      moods.length ? `분위기:${moods.join("/")}` : "",
    ].filter(Boolean);
    return items.length ? items.join(" · ") : "옵션 선택";
  }, [group, level, genres, moods]);

  const titlePrefix = useMemo(() => {
    // ... (이 부분은 기존과 동일)
    const parts = summary.split(" · ");
    return parts.join(" ");
  }, [summary]);

  // 11. (추가) 불러온 JSON 데이터를 영화와 TV로 분리 (useMemo로 캐싱)
  const movies = useMemo(
    () => allContent.filter((c) => c.media_type === "movie"),
    []
  );
  const tvShows = useMemo(
    () => allContent.filter((c) => c.media_type === "tv"),
    []
  );

  return (
    <Container maxWidth="lg" sx={{ pt: 3, pb: 6 }}>
      {/* ----- 상단 필터 부분 (기존과 동일) ----- */}
      <Stack spacing={1.25} sx={{ mb: 2 }}>
        {/* ... (ToggleButtonGroup, Chip 등 필터 UI 부분은 동일하게 유지) ... */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={0.75}
          useFlexGap
        >
          <ToggleButtonGroup
            value={group}
            exclusive
            onChange={(_, v) => v !== null && setGroup(v)}
            sx={{
              flex: 1,
              flexWrap: "wrap",
              gap: 0.5,
              "& .MuiToggleButton-root": { ...pillSx, borderWidth: 1 },
              "& .Mui-selected": pillSelectedSx,
            }}
            size="small"
          >
            {GROUPS.map((g) => (
              <ToggleButton key={g} value={g} size="small">
                {g}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

          <ToggleButtonGroup
            value={level}
            exclusive
            onChange={(_, v) => v !== null && setLevel(v)}
            sx={{
              flex: 1,
              flexWrap: "wrap",
              gap: 0.5,
              "& .MuiToggleButton-root": { ...pillSx, borderWidth: 1 },
              "& .Mui-selected": pillSelectedSx,
            }}
            size="small"
          >
            {LEVELS.map((l) => (
              <ToggleButton key={l} value={l} size="small">
                {l}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Stack>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={0.75}
          useFlexGap
        >
          <Stack direction="row" sx={{ flex: 1, flexWrap: "wrap", gap: 0.5 }}>
            {GENRES.map((g) => {
              const selected = genres.includes(g);
              return (
                <Chip
                  key={g}
                  label={g}
                  size="small"
                  onClick={() => toggleMulti(g, setGenres)}
                  variant={selected ? "filled" : "outlined"}
                  color={selected ? "primary" : "default"}
                  sx={{
                    borderRadius: 999,
                    height: 28,
                    "& .MuiChip-label": { px: 1.25 },
                  }}
                />
              );
            })}
          </Stack>
          <Stack direction="row" sx={{ flex: 1, flexWrap: "wrap", gap: 0.5 }}>
            {MOODS.map((m) => {
              const selected = moods.includes(m);
              return (
                <Chip
                  key={m}
                  label={m}
                  size="small"
                  onClick={() => toggleMulti(m, setMoods)}
                  variant={selected ? "filled" : "outlined"}
                  color={selected ? "primary" : "default"}
                  sx={{
                    borderRadius: 999,
                    height: 28,
                    "& .MuiChip-label": { px: 1.25 },
                  }}
                />
              );
            })}
          </Stack>
        </Stack>
      </Stack>
      {/* ----- (필터 끝) ----- */}

      <Box sx={{ mb: 3 }}>
        <SectionTitle>
          <span style={{ color: "#00bcd4" }}>{titlePrefix}</span> 맞춤 추천작품
        </SectionTitle>
<<<<<<< Updated upstream
        <PlaceholderScroller count={12} ratio="3/4" />
=======
        {/* 12. PlaceholderScroller -> ContentScroller로 변경, items에 movies 데이터 전달 */}
        <ContentScroller items={movies} ratio="3/4" />
>>>>>>> Stashed changes
      </Box>

      <Box sx={{ mb: 3 }}>
        <SectionTitle>추천 여행지(예시)</SectionTitle>
<<<<<<< Updated upstream
        <PlaceholderScroller count={12} ratio="1/1" />
=======
        {/* 13. (수정) 데이터가 없으므로 빈 배열을 전달 (기존 count={12} 대신) */}
        <ContentScroller items={[]} ratio="1/1" />
>>>>>>> Stashed changes
      </Box>

      <Box sx={{ mb: 3 }}>
        <SectionTitle>추천 이벤트(예시)</SectionTitle>
        <ContentScroller items={[]} ratio="1/1" />
      </Box>

      <Box sx={{ mb: 3 }}>
        <SectionTitle>
          {" "}
          <span style={{ color: "#e71616ff" }}>{summary.split(" · ")[0]}</span>
          보기 좋은 작품
        </SectionTitle>
        {/* 14. (수정) Placeholder -> ContentScroller로 변경, 우선 movies 데이터를 보여줌 */}
        <ContentScroller items={movies} ratio="3/4" />
      </Box>

      <Box sx={{ mb: 3 }}>
        <SectionTitle>
          <span style={{ color: "#edb90cff" }}>
            {" "}
             {summary.split(" · ")[1]}
          </span>
          를 위한 추천 작품
        </SectionTitle>
        {/* 15. (수정) Placeholder -> ContentScroller로 변경, 우선 tvShows 데이터를 보여줌 */}
        <ContentScroller items={tvShows} ratio="3/4" />
      </Box>

      {/* ----- (OST 그리드 - 이 부분은 데이터가 없으므로 그대로 둡니다) ----- */}
      <Box sx={{ mb: 3 }}>
        <SectionTitle>ost(예시)</SectionTitle>
        <Grid container spacing={1.5}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Grid key={i} item xs={12} sm={6} md={4} lg={3}>
              <Card
                sx={{
                  borderRadius: 2,
                  overflow: "hidden",
                  bgcolor: "background.default",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <CardActionArea onClick={() => {}}>
                  <Box
                    sx={{
                      aspectRatio: "4 / 3",
                      width: "100%",
                      display: "grid",
                      placeItems: "center",
                      bgcolor: "action.hover",
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      이미지
                    </Typography>
                  </Box>
                  <CardContent sx={{ py: 0.75 }}>
                    <Typography variant="body2">(제목-가수)</Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default HomePage;