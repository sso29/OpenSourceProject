import React, { useState, useEffect, useRef } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  Box,
  Chip,
  Stack,
  CircularProgress,
  Paper,
  Alert,
} from "@mui/material";

import allContent from "../data/contentsExample.json";

// --- 마크다운 뷰어 컴포넌트 ---
const MarkdownViewer = ({ content }) => {
  if (!content) {
    return null;
  }

  const lines = content.split("\n");

  return (
    <Box sx={{ lineHeight: 1.7 }}>
      {lines.map((line, index) => {
        line = line.trim();

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
        
        if (/^\d+\.\s\*\*.+\*\*$/.test(line)) {
           const title = line.substring(line.indexOf("**") + 2, line.lastIndexOf("**"));
           return (
             <Typography key={index} variant="h6" component="h3" sx={{ mt: 2.5, mb: 1, fontWeight: 600 }}>
               {`${line.substring(0, line.indexOf("**"))} ${title}`}
             </Typography>
           );
         }

        if (line.startsWith("- ")) {
          const boldMatch = line.match(/\*\*(.*?)\*\*/);
          if (boldMatch) {
            const label = boldMatch[1];
            const text = line.substring(boldMatch[0].length + 2);
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
        
        if (line.startsWith("**") && line.endsWith("**")) {
           return (
             <Typography key={index} variant="body1" sx={{ mt: 3, fontStyle: 'italic', fontWeight: 500 }}>
               {line.substring(2, line.length - 2)}
             </Typography>
           );
         }

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

// --- 마크다운에서 장소 추출 ---
// --- 마크다운에서 장소 추출 (개선된 버전) ---
const parsePlacesFromMarkdown = (md) => {
  if (!md) return [];
  
  const lines = md.split("\n");
  const places = [];
  let currentPlace = null;

  lines.forEach((line) => {
    const trimmedLine = line.trim();

    // 1. 숫자 + 점(.) 으로 시작하는 줄을 장소 이름으로 인식 (볼드 여부 상관없이)
    // 예: "1. **남산 타워**", "1. 남산 타워", "1. **남산 타워** :"
    const titleMatch = trimmedLine.match(/^\d+\.\s+(?:\*\*)?([^*\n]+)(?:\*\*)?/);
    
    if (titleMatch) {
      if (currentPlace) places.push(currentPlace);
      // 제목 뒤에 불필요한 콜론(:) 등이 붙을 경우 제거
      const name = titleMatch[1].replace(/[:：].*$/, "").trim();
      currentPlace = { name: name, location: "" };
    } 
    // 2. "위치" 또는 "주소" 라는 단어가 포함된 줄을 찾음
    else if (currentPlace && (trimmedLine.includes("위치") || trimmedLine.includes("주소"))) {
      // "위치:", "위치 :", "**위치**:" 등 다양한 패턴 제거 후 주소만 추출
      const location = trimmedLine.replace(/.*(위치|주소)\s*[:：]?\s*/, "").replace(/\*\*/g, "").trim();
      if (location) {
        currentPlace.location = location;
      }
    }
  });

  if (currentPlace) places.push(currentPlace);
  
  // 주소 정보가 없는 항목은 지도에 표시할 수 없으므로 필터링 (선택 사항)
  return places.filter(p => p.name && p.location);
};

// --- 네이버 지도 컴포넌트 (최종 수정) ---
const NaverMapComponent = ({ places }) => {
  const mapRef = useRef(null);

  const DIRECTIONS_BASE =
    import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:8080";

  useEffect(() => {
    // 1. 스크립트 ID를 변경하여 캐시 문제 해결 (중요!)
    const SCRIPT_ID = "naver-map-script-v3-geocoder"; 
    const CLIENT_ID = import.meta.env.VITE_NAVER_MAP_CLIENT_KEY;

    // 이미 올바른 스크립트가 로드되어 있다면 바로 초기화
    if (document.getElementById(SCRIPT_ID)) {
       if (window.naver?.maps?.Service) {
         initMap();
       }
       return;
    }

    // 기존에 잘못 로드된 다른 네이버 맵 스크립트가 있다면 제거 (충돌 방지)
    const oldScript = document.getElementById("naver-map-script");
    if (oldScript) oldScript.remove();

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    // submodules=geocoder가 반드시 포함되어야 함
    // callback으로 서브모듈 로드 완료 시점 보장
    // 일부 키는 ncpKeyId 파라미터로 동작하므로 ncpKeyId를 사용
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${CLIENT_ID}&submodules=geocoder&callback=__naverMapInit`;
    script.async = true;

    // 스크립트 내부 모듈까지 모두 로드된 뒤 실행
    window.__naverMapInit = () => {
      if (window.naver?.maps?.Service) {
        initMap();
      } else {
        console.error("네이버 지도 로드 완료되었으나 Geocoder 서브모듈이 없습니다.");
      }
    };

    script.onerror = () => console.error("네이버 지도 스크립트 로드 실패");
    document.head.appendChild(script);
  }, [places]);

  const initMap = async () => {
    // 안전 장치: Service 객체가 없으면 실행하지 않음
    if (!window.naver?.maps?.Service || !mapRef.current) return;

    const map = new window.naver.maps.Map(mapRef.current, {
      center: new window.naver.maps.LatLng(37.5665, 126.9780),
      zoom: 7, // 줌 레벨을 조금 넓게 잡음
    });

    if (!places || places.length === 0) return;

    let isCenterSet = false;
    const pathCoords = [];

    for (const place of places) {
      if (!place.location) continue;

      // 주소 정제: 괄호 안의 설명이 검색을 방해할 수 있으므로 제거 (예: " ... (강릉과 가까움)" 제거)
      const cleanAddress = place.location.replace(/\(.*\)/g, "").trim();

      // 비동기 geocode 순차 처리
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => {
        window.naver.maps.Service.geocode(
          { query: cleanAddress },
          (status, response) => {
            if (status !== window.naver.maps.Service.Status.OK) {
              console.warn(`주소 검색 실패: ${cleanAddress}`);
              resolve();
              return;
            }

            const result = response.v2?.addresses?.[0];
            if (!result) {
              resolve();
              return;
            }

            const position = new window.naver.maps.LatLng(result.y, result.x);

            new window.naver.maps.Marker({
              position: position,
              map: map,
              title: place.name,
            });

            pathCoords.push(position);

            if (!isCenterSet) {
              map.setCenter(position);
              map.setZoom(10);
              isCenterSet = true;
            }
            resolve();
          }
        );
      });
    }

    // 네이버 길찾기 API로 실제 경로 호출 (좌표 2개 이상일 때)
    if (pathCoords.length >= 2) {
      const routePath = [];
      for (let i = 0; i < pathCoords.length - 1; i++) {
        const start = pathCoords[i];
        const end = pathCoords[i + 1];
        const query = `${DIRECTIONS_BASE}/api/directions?startLat=${start.lat()}&startLng=${start.lng()}&endLat=${end.lat()}&endLng=${end.lng()}`;

        // eslint-disable-next-line no-await-in-loop
        await fetch(query)
          .then((res) => {
            if (!res.ok) throw new Error(`directions API 오류: ${res.status}`);
            return res.json();
          })
          .then((data) => {
            const path = data?.route?.trafast?.[0]?.path;
            if (!path) return;
            path.forEach(([lng, lat]) => {
              routePath.push(new window.naver.maps.LatLng(lat, lng));
            });
          })
          .catch((err) => {
            console.warn("길찾기 경로 호출 실패:", err);
          });
      }

      if (routePath.length >= 2) {
        new window.naver.maps.Polyline({
          map,
          path: routePath,
          strokeColor: "#2563eb",
          strokeOpacity: 0.8,
          strokeWeight: 4,
        });
      }
    }
  };

  return (
    <Box
      ref={mapRef}
      sx={{
        width: "100%",
        height: "400px",
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        mt: 2,
        backgroundColor: "#f0f0f0" // 지도가 로딩되기 전 회색 배경 표시
      }}
    />
  );
};

const DetailPage = () => {
  const { id } = useParams();
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const item = allContent.find((c) => c.search_title === id);

  useEffect(() => {
    if (!id || !item) {
      setLoading(false);
      return;
    }

    const fetchRecommendation = async () => {
      setLoading(true);
      setError(null);
      try {
        const encodedTitle = encodeURIComponent(id);
        const response = await fetch(`http://localhost:5001/recommend/${encodedTitle}`);

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.detail || `AI 서버 오류: ${response.statusText}`);
        }

        const data = await response.json();
        setRecommendation(data.recommendation);
      } catch (err) {
        console.error("AI 추천 코스 로딩 실패:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendation();
  }, [id, item]);

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

  const places = recommendation ? parsePlacesFromMarkdown(recommendation) : [];

  return (
    <Container maxWidth="lg" sx={{ pt: 3, pb: 6 }}>
      <Box
        sx={{
          display: "flex",
          gap: { xs: 2, md: 4 },
          flexDirection: { xs: "column", md: "row" },
          pb: 4,
          borderBottom: "1px solid",
          borderColor: "divider"
        }}
      >
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

      <Box sx={{ pt: 4 }}>
        <Typography variant="h4" component="h2" sx={{ fontWeight: 700, mb: 2 }}>
          AI 추천 여행 코스
        </Typography>
        
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
            <Box textAlign="center">
              <CircularProgress />
              <Typography sx={{ mt: 1 }}>AI가 추천 코스를 생성 중입니다...</Typography>
            </Box>
          </Box>
        )}
        
        {error && (
           <Alert severity="error">
             오류가 발생했습니다: {error}
           </Alert>
         )}
         
        {!loading && !error && recommendation && (
          <>
            <Paper variant="outlined" sx={{ p: { xs: 2, md: 4 }, mb: 4 }}>
              <MarkdownViewer content={recommendation} />
            </Paper>
            <NaverMapComponent places={places} />
          </>
        )}
      </Box>

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
