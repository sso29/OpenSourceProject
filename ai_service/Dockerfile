FROM python:3.11-slim

# 작업 디렉토리 설정
WORKDIR /app

# 의존성 복사 및 설치
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 앱 코드 복사
COPY . .

# FastAPI 실행
# location.py 파일 안에 app 객체가 있어야 함
CMD ["uvicorn", "location:app", "--host", "0.0.0.0", "--port", "5000"]
