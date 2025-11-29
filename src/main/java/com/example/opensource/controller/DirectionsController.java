package com.example.opensource.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.util.UriComponentsBuilder;

/**
 * 네이버 길찾기(Directions) API 프록시.
 * 프론트에서 직접 비밀키를 노출하지 않도록 서버를 경유해 호출한다.
 */
@RestController
@RequestMapping("/api/directions")
public class DirectionsController {

    private final RestTemplate restTemplate = new RestTemplate();
    private final String clientId;
    private final String clientSecret;

    public DirectionsController(
            @Value("${naver.map.client-id:}") String clientId,
            @Value("${naver.map.client-secret:}") String clientSecret
    ) {
        // 환경변수에 따옴표가 포함된 경우가 있어 제거
        this.clientId = clientId.replace("\"", "").trim();
        this.clientSecret = clientSecret.replace("\"", "").trim();
    }

    @GetMapping
    public ResponseEntity<String> getDrivingRoute(
            @RequestParam double startLat,
            @RequestParam double startLng,
            @RequestParam double endLat,
            @RequestParam double endLng
    ) {
        if (clientId.isBlank() || clientSecret.isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("NAVER Directions API 키가 설정되지 않았습니다.");
        }

        // Directions API는 start/goal 순서가 lng,lat
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-NCP-APIGW-API-KEY-ID", clientId);
        headers.set("X-NCP-APIGW-API-KEY", clientSecret);
        headers.setAccept(MediaType.parseMediaTypes("application/json"));

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        // 1순위: Directions 15 (map-direction-15) - 신호 호스트: maps.apigw.ntruss.com
        String url15 = UriComponentsBuilder
                .fromHttpUrl("https://maps.apigw.ntruss.com/map-direction-15/v1/driving")
                .queryParam("start", String.format("%f,%f", startLng, startLat))
                .queryParam("goal", String.format("%f,%f", endLng, endLat))
                .queryParam("option", "trafast")
                .toUriString();

        try {
            ResponseEntity<String> response = restTemplate.exchange(url15, HttpMethod.GET, entity, String.class);
            return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
        } catch (HttpStatusCodeException ex) {
            // Directions 15가 401/404 등으로 실패하면 Directions 5 엔드포인트로 한 번 더 시도
            String url5 = UriComponentsBuilder
                    .fromHttpUrl("https://maps.apigw.ntruss.com/map-direction/v1/driving")
                    .queryParam("start", String.format("%f,%f", startLng, startLat))
                    .queryParam("goal", String.format("%f,%f", endLng, endLat))
                    .queryParam("option", "trafast")
                    .toUriString();
            try {
                ResponseEntity<String> fallback = restTemplate.exchange(url5, HttpMethod.GET, entity, String.class);
                return ResponseEntity.status(fallback.getStatusCode()).body(fallback.getBody());
            } catch (HttpStatusCodeException ex2) {
                return ResponseEntity.status(ex2.getStatusCode()).body(ex2.getResponseBodyAsString());
            }
        }
    }
}
