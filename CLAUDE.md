# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Fullstack used-goods marketplace (중고마켓) — React frontend + Spring Boot backend in a monorepo layout.

## 작업 환경 (중요)

작업 환경이 두 곳이므로 실행 전에 반드시 확인할 것.

| 환경 | 프로젝트 경로 |
|------|-------------|
| 🏠 집 컴퓨터 | `C:\Users\jihun\Desktop\project\resellmarket` |
| 🏢 외부 컴퓨터 | `C:\Users\Administrator\Desktop\정지훈\react\resellmarket` |

> Claude Code에게 작업 시작 시 "지금 집이야" 또는 "지금 외부야" 라고 알려줄 것.

## Commands

### Frontend (`frontend/`)
```bash
npm install      # 처음 한 번만 (node_modules 설치)
npm start        # Dev server on http://localhost:3000
npm run build    # Production build
npm test         # Run tests
```

### Backend (`backend/`)
```powershell
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
.\mvnw.cmd clean spring-boot:run     # Dev server on http://localhost:8081 (처음 또는 오류 시 clean 포함)
.\mvnw.cmd spring-boot:run           # 이후 빠른 실행
.\mvnw.cmd test                      # Run tests
.\mvnw.cmd package                   # Build JAR
```

> ⚠️ Windows 환경이므로 `./mvnw` 대신 `.\mvnw.cmd` 사용. `mvn` 명령어 없음.
> ⚠️ 시스템 기본 Java가 25이므로 반드시 `$env:JAVA_HOME`을 JDK 17로 설정 후 실행. Lombok이 Java 25와 호환되지 않음.

## Port Configuration

| 서버 | 포트 |
|------|------|
| Frontend (React) | 3000 |
| Backend (Spring Boot) | **8081** |
| H2 Console | 8081/h2-console |

> ⚠️ 8080, 8082 포트는 다른 용도로 사용 중 — 절대 사용 금지.

## Architecture

### Frontend (`frontend/src/`)
- **Single-file SPA**: 모든 UI 로직이 `App.js` 한 파일에 존재. 라우팅 라이브러리 없음, state 기반 내비게이션.
- **No global state**: 컴포넌트 로컬 `useState`/`useEffect`만 사용. Redux, Context 없음.
- **HTTP**: Axios, `BASE_URL = 'http://localhost:8081'` at top of `App.js`.
- **Styling**: 인라인 스타일 전용. `buildCSS(dark)` 함수가 다크모드 여부에 따라 CSS 문자열을 생성하고, `useEffect`로 `<style>` 태그에 주입. CSS 프레임워크 없음.
- **Theme**: `MINT = '#00C2A8'`, `NAVY = '#0F2B4A'` 상수 + `C` 객체(다크/라이트 컬러 맵)를 컴포넌트 내에서 사용.
- **Icons**: `IC` 객체 — 20개 인라인 SVG React 컴포넌트 (Heroicons-style, stroke-based). 아이콘 라이브러리 의존성 없음.
- **Key state**: `dark`(다크모드), `user`(localStorage 영속), `items`, `wishedIds`(Set), `selectedItem`(모달), `toasts`, `loading`, `searchInput`/`searchKeyword`(300ms debounce), `filterCategory`, `sortOrder`.
- **Layout**: 상단 카테고리 탭바 (사이드바 없음). 카드 이미지는 1:1 정사각형(`paddingBottom: '100%'` 기법). 호버 시 설명 슬라이드업 오버레이(`.card-overlay`). 판매완료 상품은 오버레이 대신 흑백 필터(`.img-sold`).

### Backend (`backend/src/main/java/com/example/backend/`)
- **Spring Boot 3.2.5 / Java 17** with H2 in-memory DB (`spring.jpa.hibernate.ddl-auto=update`). 재시작 시 스키마 초기화.
- **Entities**:
  - `User` — id, username, password, role (`USER`/`ADMIN`)
  - `Product` — id, name, price, seller, address, imageName, description (`@Lob`), category (`Category` enum), status (`ProductStatus` enum, default `SELLING`), wishCount, createdAt (`@PrePersist`)
  - `Wish` — id, userId, productId (찜 관계 테이블)
  - `Category` enum — `ELECTRONICS`, `FURNITURE`, `CLOTHING`, `OTHER`
  - `ProductStatus` enum — `SELLING`, `SOLD`
- **File uploads**: 이미지는 `resellmarket/uploads/`에 저장. `ProductController`와 `WebConfig` 모두 `Paths.get(user.dir).getParent().resolve("uploads")`로 backend 상위 폴더를 가리킴. 샘플 이미지(`bike.jpg`, `ipad.jpg`, `chair.jpg`)는 `uploads/`에 미리 존재.
- **Auth**: DB 조회 방식 (토큰/해싱 없음).
- **Error handling**: `GlobalExceptionHandler`가 `RuntimeException` → HTTP 400 `{ "message": "..." }` 변환.

### Key API Endpoints
| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/items?keyword=&category=&sort=` | List products (search/filter/sort) |
| POST | `/api/items` | Create product (multipart/form-data) |
| PUT | `/api/items/{id}` | Update product fields or status (multipart/form-data) |
| DELETE | `/api/items/{id}` | Delete product (owner or ADMIN) |
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/setup` | Seed demo data (wipes existing) |
| POST | `/api/wishes/{productId}` | Toggle wish (body: `{ userId }`) |
| GET | `/api/wishes/user/{userId}` | Get wished product IDs for user |
| GET | `/images/**` | Serve uploaded images |

### Demo Accounts (via `/api/auth/setup`)
| ID | PW | Role |
|----|-----|------|
| admin | 1234 | ADMIN |
| user1 | 1234 | USER |
| user2 | 1234 | USER |

## Known Constraints
- H2 인메모리 DB — 백엔드 재시작 시 데이터 초기화. `POST /api/auth/setup`으로 재시드.
- `GET /api/items` 검색/필터/정렬은 `findAll()` 후 Java stream 처리 — DB 쿼리 아님. 소규모 데이터에만 적합.
- CORS는 각 컨트롤러에 `@CrossOrigin(origins = "http://localhost:3000")` 개별 선언 (글로벌 설정 아님).
- Passwords are stored as plain text.

## Troubleshooting

### 포트 충돌 시
```powershell
netstat -ano | findstr :8081
taskkill /PID <PID번호> /F
```

### 프론트엔드 react-scripts 오류 시
```powershell
cd frontend
npm install
npm start
```
