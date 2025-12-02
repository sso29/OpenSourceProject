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
  Card, 
  CardContent,
  Divider
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

        if (line.startsWith("##")) {
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
    const titleMatch = trimmedLine.match(/^(?:#+\s*)?(\d+)[.)]\s+(.*)$/);
    
    if (titleMatch) {
      if (currentPlace) places.push(currentPlace);
      // 제목 뒤에 불필요한 콜론(:) 등이 붙을 경우 제거
      let name = titleMatch[2].replace(/\*\*/g, "").replace(/[:：].*$/, "").trim();
      currentPlace = { name: name, location: "" };
    } 
    // 2. "위치" 또는 "주소" 라는 단어가 포함된 줄을 찾음
    else if (currentPlace && (trimmedLine.includes("위치") || trimmedLine.includes("주소"))) {
      // '위치:' 같은 앞부분 제거
      let rawLocation = trimmedLine.replace(/.*(위치|주소)\s*[:：]?\s*/, "");
      
      // [중요] 마크다운 링크, 볼드, 괄호 내용 등을 모두 제거하여 '순수 주소'만 남김
      // 예: "서울시 강남구 [지도보기]" -> "서울시 강남구"
      let cleanLocation = rawLocation
        .replace(/\*\*/g, "")          // 볼드 제거
        .replace(/\[.*?\]/g, "")       // 대괄호와 그 안의 내용 제거 (마크다운 링크 등)
        .replace(/\(.*\)/g, "")        // 괄호와 그 안의 내용 제거 (부연 설명)
        .replace(/[<>]/g, "")          // 꺽쇠 괄호 제거
        .trim();

      if (cleanLocation) {
        currentPlace.location = cleanLocation;
      }
    }
  });

  if (currentPlace) places.push(currentPlace);
  
  // 주소 정보가 없는 항목은 지도에 표시할 수 없으므로 필터링 (선택 사항)
  return places.filter(p => p.name && p.location);
};

import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import MapIcon from '@mui/icons-material/Map';

// --- 네이버 지도 컴포넌트 (최종 수정) ---
// --- 네이버 지도 컴포넌트 (수정됨) ---
const NaverMapComponent = ({ places }) => {
  const mapRef = useRef(null);
  const [routeInfos, setRouteInfos] = useState([]);   // 구간별 정보 저장 (거리, 시간)
  const [totalTime, setTotalTime] = useState(0);      // 총 소요 시간 (자동차)

  const DIRECTIONS_BASE =
    import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:8080";

  useEffect(() => {
    // 1. 스크립트 ID를 변경하여 캐시 문제 해결
    const SCRIPT_ID = "naver-map-script-v3-geocoder"; 
    const CLIENT_ID = import.meta.env.VITE_NAVER_MAP_CLIENT_KEY;

    if (document.getElementById(SCRIPT_ID)) {
       if (window.naver?.maps?.Service) {
         initMap();
       }
       return;
    }

    const oldScript = document.getElementById("naver-map-script");
    if (oldScript) oldScript.remove();

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${CLIENT_ID}&submodules=geocoder&callback=__naverMapInit`;
    script.async = true;

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
    if (!window.naver?.maps?.Service || !mapRef.current) return;

    const newRouteInfos = [];
    let calculatedTotalTime = 0;
    
    // [변경] 좌표 변환에 성공한 장소들의 정보(이름, 좌표)를 담을 배열
    const validPlaces = []; 
    const totalPathForPolyline = [];

    const map = new window.naver.maps.Map(mapRef.current, {
      center: new window.naver.maps.LatLng(37.5665, 126.9780),
      zoom: 10,
    });

    if (!places || places.length === 0) return;

    let isCenterSet = false;

    // 1. 모든 장소를 순회하며 좌표 변환 시도
    for (const place of places) {
      if (!place.location) continue;

      const cleanAddress = place.location.replace(/\(.*?\)/g, "").trim();

      // 비동기 geocode 순차 처리
      await new Promise((resolve) => {
        window.naver.maps.Service.geocode(
          { query: cleanAddress },
          (status, response) => {
            // 실패 시 그냥 resolve() 하여 다음 장소로 넘어감 (validPlaces에 추가 안됨)
            if (status !== window.naver.maps.Service.Status.OK) {
              console.warn(`주소 검색 실패 (경로 제외): ${place.name} - ${cleanAddress}`);
              resolve();
              return;
            }

            const result = response.v2?.addresses?.[0];
            if (!result) {
              console.warn(`결과 없음 (경로 제외): ${place.name}`);
              resolve();
              return;
            }

            console.log(`✅ 좌표 변환 성공: ${place.name}`);
            const position = new window.naver.maps.LatLng(result.y, result.x);

            // [중요] 성공한 장소만 리스트에 추가
            validPlaces.push({
              name: place.name,
              position: position
            });

            // 마커 생성 (순서는 validPlaces의 길이 기준)
            const marker = new window.naver.maps.Marker({
              position: position,
              map: map,
              title: place.name,
              icon: {
                content: `<div style="background:#2563eb; color:white; width:24px; height:24px; border-radius:50%; text-align:center; line-height:24px; font-weight:bold; border:2px solid white; box-shadow:0 2px 5px rgba(0,0,0,0.3);">${validPlaces.length}</div>`,
                anchor: new window.naver.maps.Point(12, 12)
              }
            });

            const infoWindow = new window.naver.maps.InfoWindow({
              content: `<div style="padding:5px 10px; font-size:12px; font-weight:bold;">${place.name}</div>`,
              borderWidth: 1,
              disableAnchor: true,
              backgroundColor: "white",
            });

            window.naver.maps.Event.addListener(marker, "mouseover", () => infoWindow.open(map, marker));
            window.naver.maps.Event.addListener(marker, "mouseout", () => infoWindow.close());

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

    // 2. 유효한 장소(validPlaces)가 2개 이상일 때만 경로 계산
    if (validPlaces.length >= 2) {
      for (let i = 0; i < validPlaces.length - 1; i++) {
        const start = validPlaces[i];
        const end = validPlaces[i + 1];

        // API 호출
        const query = `${DIRECTIONS_BASE}/api/directions?startLat=${start.position.lat()}&startLng=${start.position.lng()}&endLat=${end.position.lat()}&endLng=${end.position.lng()}`;
        
        try {
          const res = await fetch(query);
          if (res.ok) {
            const data = await res.json();
            const trafast = data?.route?.trafast?.[0];

            if (trafast) {
              // 폴리라인 경로 추가
              trafast.path.forEach(([lng, lat]) => {
                totalPathForPolyline.push(new window.naver.maps.LatLng(lat, lng));
              });

              const durationMin = Math.round(trafast.summary.duration/60000);
              const distanceKm = (trafast.summary.distance/1000).toFixed(1);

              // [중요] 리스트 정보 생성 시 validPlaces의 이름을 직접 사용
              newRouteInfos.push({
                startName: start.name,
                endName: end.name,
                time: durationMin,
                distance: distanceKm,
                startLat: start.position.lat(), startLng: start.position.lng(),
                endLat: end.position.lat(), endLng: end.position.lng()
              });

              calculatedTotalTime += durationMin;
            }
          }
        } catch (err) {
          console.warn("경로 API 호출 실패: ", err);
        }
      }

      // 지도에 경로 그리기
      if (totalPathForPolyline.length > 0) {
        new window.naver.maps.Polyline({
          map,
          path: totalPathForPolyline,
          strokeColor: "#2563eb",
          strokeOpacity: 0.8,
          strokeWeight: 5,
        });

        const bounds = new window.naver.maps.LatLngBounds();
        totalPathForPolyline.forEach(coord => bounds.extend(coord));
        map.fitBounds(bounds, { top: 50, bottom: 50, left: 50, right: 50 });
      }
    }

    setRouteInfos(newRouteInfos);
    setTotalTime(calculatedTotalTime);
  };

  const openPublicTransport = (info) => {
    const url = `https://map.naver.com/index.nhn?slng=${info.startLng}&slat=${info.startLat}&stext=${encodeURIComponent(info.startName)}&elng=${info.endLng}&elat=${info.endLat}&etext=${encodeURIComponent(info.endName)}&menu=route&pathType=1`;
    window.open(url, "_blank");
  };

  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      <Box
        ref={mapRef}
        sx={{
          width: "100%",
          height: "400px",
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          backgroundColor: "#f0f0f0",
          mb: 3
        }}
      />

      {routeInfos.length > 0 && (
        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              🚗 추천 경로 요약 (총 이동 약 {Math.floor(totalTime / 60) > 0 ? `${Math.floor(totalTime / 60)}시간 ` : ''}{totalTime % 60}분)
          </Typography>
          
          <Stack spacing={2}>
            {routeInfos.map((info, idx) => (
              <Card key={idx} variant="outlined" sx={{ backgroundColor: '#f9fafb' }}>
                <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" justifyContent="space-between" spacing={2}>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {idx + 1}. {info.startName} ➝ {info.endName}
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5, color: 'text.secondary' }}>
                        <DirectionsCarIcon fontSize="small" />
                        <Typography variant="body2">
                          자동차 이동: 약 {info.time}분 ({info.distance}km)
                        </Typography>
                      </Stack>
                    </Box>

                    <Button 
                      variant="outlined" 
                      size="small"
                      startIcon={<MapIcon />}
                      onClick={() => openPublicTransport(info)}
                      sx={{ whiteSpace: 'nowrap' }}
                    >
                      대중교통 / 상세 경로 보기
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
};

const DetailPage = () => {
  const { id } = useParams();
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchedIdRef = useRef(null); // 마지막으로 조회한 id 저장

  const item = allContent.find((c) => c.search_title === id);

  useEffect(() => {
    if (!id || !item) {
      setLoading(false);
      return;
    }

    // 같은 id에 대해 중복 호출 방지(StrictMode 포함)
    if (fetchedIdRef.current === id) return;
    fetchedIdRef.current = id;

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
