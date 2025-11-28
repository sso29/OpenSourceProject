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
import ostMap from "../data/ostMap.json"

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


/* ---------- OST 전용 가로 스크롤 ---------- */
const OstScroller = ({ items = [], ratio = "4/3" }) => {
  const ref = useRef(null);
  const scrollBy = (amt) =>
    ref.current?.scrollBy({ left: amt, behavior: "smooth" });

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
            key={item.key || item.search_title}
            sx={{
              width: 180,
              borderRadius: 2,
              flex: "0 0 auto",
              bgcolor: "background.default",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <CardActionArea
              component={item.spotifyUrl ? "a" : "div"}
              href={item.spotifyUrl || undefined}
              target={item.spotifyUrl ? "_blank" : undefined}
              rel={item.spotifyUrl ? "noreferrer" : undefined}
            >
              {item.cover ? (
                <CardMedia
                  component="img"
                  sx={{
                    aspectRatio: ratio,
                    width: "100%",
                    objectFit: "cover",
                    bgcolor: "action.hover",
                  }}
                  image={item.cover}
                  alt={`${item.contentTitle || "OST"} 커버`}
                />
              ) : (
                <Box
                  sx={{
                    aspectRatio: ratio,
                    width: "100%",
                    display: "grid",
                    placeItems: "center",
                    bgcolor: "action.hover",
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    OST
                  </Typography>
                </Box>
              )}
              <CardContent sx={{ py: 0.75 }}>
                <Typography variant="body2" noWrap>
                  {item.contentTitle || item.title}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {item.trackTitle || item.title} - {item.trackArtist || ""}
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
  const [userName, setUserName] = useState(() => localStorage.getItem("userName") || "00"); 

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

  // 난이도 필터 적용
  const filteredMovies = useMemo(
    () => allContent.filter(
      (c) => c.media_type === "movie" && (!level || c.difficulty === level)
    ),
    [level]
  );

  const filteredTVShows = useMemo(
    () => allContent.filter(
      (c) => c.media_type === "tv" && (!level || c.difficulty === level)
    ),
    [level]
  );

  const ostItems = useMemo(
    () =>
      allContent.flatMap((c) =>
        (ostMap[c.search_title] || []).map((track, idx) => ({
          key: `${c.search_title}-${idx}`,
          contentTitle: c.title,
          trackTitle: track.title,
          trackArtist: track.artist,
          cover: track.cover,
          spotifyUrl: track.spotifyUrl,
        }))
      ),
    [allContent]
  );

  // 전체 작품
  const allItems = useMemo(() => [...movies, ...tvShows], [movies, tvShows]);

  // 랜덤 섞기
  const shuffledItems = useMemo(() => {
    return allItems
      .map((item) => ({ item, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ item }) => item);
  }, [allItems]);

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
          <span style={{ color: "#00bcd4" }}>{titlePrefix}</span> 맞춤 추천 작품 (영화)
        </SectionTitle>
        <ContentScroller items={filteredMovies} ratio="3/4" />
      </Box>

      <Box sx={{ mb: 3 }}>
        <SectionTitle>
          <span style={{ color: "#e71616ff" }}>
            {summary.split(" · ")[0]}
          </span> 보기 좋은 작품 (드라마)
        </SectionTitle>
        <ContentScroller items={filteredTVShows} ratio="3/4" />
      </Box>

      <Box sx={{ mb: 3 }}>
        <SectionTitle>
          <span style={{ color: "#edb90cff" }}>
            {userName}
          </span> 님을 위한 추천 작품
        </SectionTitle>
        <ContentScroller items={shuffledItems} ratio="3/4" />
      </Box>

      {/* ----- OST 가로 스크롤 ------ */}
      <Box sx={{ mb: 3 }}>
        <SectionTitle>OST</SectionTitle>
        <OstScroller items={ostItems} />
      </Box>
    </Container>
  );
};

export default HomePage;
