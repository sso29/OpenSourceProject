import google.generativeai as genai
import os
import json
import pathlib
from fastapi import FastAPI, HTTPException
from typing import List, Dict, Any
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware

JSON_FILEPATH = "/app/data/contentsExample.json"
model = None

def get_api_key():
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("GEMINI_API_KEY 환경 변수가 설정되지 않았습니다.")
        raise ValueError("GEMINI_API_KEY가 설정되지 않았습니다.")
    return api_key

@asynccontextmanager
async def lifespan(app: FastAPI):
    global model
    try:
        api_key = get_api_key()
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-2.5-flash-preview-09-2025')
        print("Gemini 모델이 성공적으로 로드되었습니다.")
    except Exception as e:
        print(f"모델 로딩 중 심각한 오류 발생: {e}")
        model = None

    yield

app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost:5173",
    "http://localhost",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)


def load_contents(filepath: str) -> List[Dict[str, Any]]:
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"오류: {filepath} 파일을 찾을 수 없습니다.")
        return []
    except json.JSONDecodeError:
        print(f"오류: {filepath} 파일이 올바른 JSON 형식이 아닙니다.")
        return []

def get_travel_recommendation(model_instance, title: str) -> str:
    if model_instance is None:
        return "모델이 초기화되지 않았습니다. API 키를 확인하세요."

    ## 프롬프트 수정 : '대략적인 위치' -> '정확한 도로명 주소'로 변경
    prompt = f"""
    '{title}' 의 실제 한국 내 촬영지와 또는 관련 장소에 대한 관광지를 기반으로 여행 코스를 추천해줘.

    다음 사항이 들어있으면 좋겠어.
    1. 3-4개의 주요 장소 (실제 촬영지, 근처 맛집, 관련 명소, 관련 축제 등)
    2. 각 장소에 대한 간단한 설명 ('{title}'과의 연관성 포함)
    3. 각 장소에서의 예상 소요 시간 또는 추천 시간대

    [매우 중요: 주소 작성 규칙]
    - **위치**는 반드시 네이버 지도에서 핀을 찍을 수 있는 **'구체적인 도로명 주소'** 또는 **'정확한 지번 주소'**로 적어줘.
    - '서울 용산구 이촌동'처럼 동 이름까지만 적으면 **절대 안 돼**.
    - '(노들섬 기준)' 같은 괄호 설명이나 사족을 주소 칸에 적지 마. 오직 주소만 적어.
    - 예시:
        (X) 서울 용산구 이촌동
        (O) 서울특별시 용산구 양녕로 445
        (X) 부산 해운대구 (영화 촬영지)
        (O) 부산광역시 해운대구 우동 721

    [매우 중요: 마크다운 형식 규칙]
    - 장소 제목에는 절대 '###' 같은 헤더 태그를 사용하지 마.
    - 무조건 숫자와 점으로만 시작해야 해. (예: 1. **장소명**)
    - 불필요한 서론이나 결론 없이 본론만 깔끔하게 출력해.

    응답 형식은 아래와 같이 마크다운으로 깔끔하게 정리해줘:

    ## 🎬 '{title}' 추천 코스: [여정의 테마]
    
    1. **[장소 1 이름]**
       - **위치:** [정확한 상세 주소 기입]
       - **설명:** (이곳이 {title}과 어떤 관련이 있는지, 그리고 무엇을 볼 수 있는지 설명)
       - **팁/예상 시간:** (예: 약 2시간 소요, 점심 식사 추천)
    
    2. **[장소 2 이름]**
       - **위치:** [정확한 상세 주소 기입]
       - **설명:** (설명)
       - **팁/예상 시간:** (팁)
    
    3. **[장소 3 이름]**
       - **위치:** [정확한 상세 주소 기입]
       - **설명:** (설명)
       - **팁/예상 시간:** (팁)
    
    4. **[장소 4 이름]**
    - **위치:** [정확한 상세 주소 기입]
    - **설명:** (설명)
    - **팁/예상 시간:** (팁)
    
    **[여행 코스에 대한 간단한 마무리 멘트]**
    """
    try:
        response = model_instance.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"API 호출 중 오류 발생: {e}")
        return f"'{title}' 코스 생성 중 오류 발생: {e}"


@app.get("/")
def read_root():
    return {"message": "AI 추천 서비스에 오신 것을 환영합니다. /recommendations 로 이동하세요."}

@app.get("/recommendations", response_model=List[Dict[str, str]])
def get_all_recommendations():
    if model is None:
        raise HTTPException(status_code=503, detail="모델이 준비되지 않았습니다. 서버 로그를 확인하세요.")

    contents_list = load_contents(JSON_FILEPATH)
    if not contents_list:
        raise HTTPException(status_code=404, detail=f"{JSON_FILEPATH} 파일을 찾을 수 없거나 비어있습니다.")

    recommendations = []

    for content in contents_list[:3]: 
        title = content.get('search_title')
        if title:
            print(f"'{title}'에 대한 코스 생성 중...")
            rec_text = get_travel_recommendation(model, title)
            recommendations.append({"title": title, "recommendation": rec_text})
            
    return recommendations

@app.get("/recommend/{title}", response_model=Dict[str, str])
def get_single_recommendation(title: str):
    if model is None:
        raise HTTPException(status_code=503, detail="모델이 준비되지 않았습니다. 서버 로그를 확인하세요.")
    
    print(f"'{title}'에 대한 코스 생성 중...")
    try:
        rec_text = get_travel_recommendation(model, title)
        return {"title": title, "recommendation": rec_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"'{title}' 코스 생성 중 오류 발생: {e}")