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
  Container,
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
import { useNavigate } from "react-router-dom";
import allContent from "../data/contentsExample.json";

/* ---------- 옵션 목록 ---------- */
const LEVELS = ["입문자", "초보자", "중수", "고수"];

/* ---------- ContentScroller ---------- */
const ContentScroller = ({ items = [], ratio = "3/4" }) => {
  const ref = useRef(null);
  const scrollBy = (amt) =>
    ref.current?.scrollBy({ left: amt, behavior: "smooth" });

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
        {items.map((item) => (
          <Card
            key={item.search_title}
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
                navigate(`/item/${item.search_title}`);
              }}
            >
              <CardMedia
                component="img"
                sx={{
                  aspectRatio: ratio,
                  bgcolor: "action.hover",
                }}
                image={item.poster_url}
                alt={item.title}
              />
              <CardContent sx={{ py: 0.75 }}>
                <Typography variant="body2" noWrap>
                  {item.title}
                </Typography>
                <Typography variant="caption" noWrap color="text.secondary">
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

/* ---------- 필 버튼 스타일 ---------- */
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
  const [level, setLevel] = useState("");

  const summary = useMemo(() => {
    const items = [level].filter(Boolean);
    return items.length ? items.join(" · ") : "옵션 선택";
  }, [level]);

  const titlePrefix = useMemo(() => {
    const parts = summary.split(" · ");
    return parts.join(" ");
  }, [summary]);

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
      <Stack spacing={1.25} sx={{ mb: 2 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={0.75}
          useFlexGap
          justifyContent="flex-start"
        >
          <ToggleButtonGroup
            value={level}
            exclusive
            onChange={(_, v) => v !== null && setLevel(v)}
            sx={{
              justifyContent: "flex-start",
              flexWrap: "wrap",
              gap: 0.8, 
              "& .MuiToggleButton-root": {
                ...pillSx,
                borderWidth: 1,
                px: 3.5, 
                minWidth: 90, 
              },
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
      </Stack>
      {/* ----- (필터 끝) ----- */}

      <Box sx={{ mb: 3 }}>
        <SectionTitle>
          <span style={{ color: "#00bcd4" }}>{titlePrefix}</span> 맞춤 추천작품
        </SectionTitle>
        <ContentScroller items={movies} ratio="3/4" />
      </Box>

     {/* <Box sx={{ mb: 3 }}>
        <SectionTitle>추천 여행지(예시)</SectionTitle>
        <ContentScroller items={[]} ratio="1/1" />
      </Box>

      <Box sx={{ mb: 3 }}>
        <SectionTitle>추천 이벤트(예시)</SectionTitle>
        <ContentScroller items={[]} ratio="1/1" />
      </Box>*/}

      <Box sx={{ mb: 3 }}>
        <SectionTitle>
          <span style={{ color: "#e71616ff" }}>
            {summary.split(" · ")[0]}
          </span> 보기 좋은 작품
        </SectionTitle>
        <ContentScroller items={movies} ratio="3/4" />
      </Box>

      <Box sx={{ mb: 3 }}>
        <SectionTitle>
          <span style={{ color: "#edb90cff" }}>
            {summary.split(" · ")[1]}
          </span> 님을 위한 추천 작품
        </SectionTitle>
        <ContentScroller items={tvShows} ratio="3/4" />
      </Box>

      {/*<Box sx={{ mb: 3 }}>
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
      </Box>*/}
    </Container>
  );
};

export default HomePage;
