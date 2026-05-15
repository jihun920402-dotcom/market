# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Fullstack used-goods marketplace (중고마켓) — React frontend + Spring Boot backend in a monorepo layout.

## 작업 환경 (중요)

작업 환경이 두 곳이므로 실행 전에 반드시 확인할 것.

| 환경 | 프로젝트 경로 |
|------|-------------|
| 🏠 집 컴퓨터 | `C:\Users\jihun\OneDrive\Desktop\project\market` |
| 🏢 외부 컴퓨터 | `C:\Users\Administrator\Desktop\정지훈\react\market` |

> Claude Code에게 작업 시작 시 "지금 집이야" 또는 "지금 외부야" 라고 알려줄 것.
> WebConfig.java는 상대경로로 설정되어 있으므로 경로 수정 불필요.

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
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17.0.19.10-hotspot"
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
- **Single-file SPA**: All UI logic lives in `App.js` — no routing library. Navigation is state-driven (`useState`).
- **No global state**: Component-local `useState`/`useEffect` only. No Redux, no Context.
- **HTTP**: Axios, `BASE_URL = 'http://localhost:8081'` at top of `App.js`.
- **Styling**: Inline styles throughout; global keyframe CSS injected via `useEffect` + `document.createElement('style')`. No CSS framework.
- **Icons**: `IC` object at top of `App.js` — 18 inline SVG React components (Heroicons-style, stroke-based). No icon library dependency.
- **Key state**: `user` (persisted to `localStorage`), `items`, `wishedIds` (Set), `selectedItem` (modal), `toasts`, `loading`, `searchInput`/`searchKeyword` (debounced 300ms), `filterCategory`, `sortOrder`.
- **Login persistence**: `user` initialized from `localStorage` via lazy initializer; written on login, cleared on logout.

### Backend (`backend/src/main/java/com/example/backend/`)
- **Spring Boot 3.2.5 / Java 17** with H2 in-memory DB (`spring.jpa.hibernate.ddl-auto=update`). Schema is recreated on restart; no migrations.
- **Entities**:
  - `User` — id, username, password, role (`USER`/`ADMIN`)
  - `Product` — id, name, price, seller, address, imageName, description (`@Lob`), category (`Category` enum), status (`ProductStatus` enum, default `SELLING`), wishCount, createdAt (`@PrePersist`)
  - `Wish` — id, userId, productId (찜 관계 테이블)
  - `Category` enum — `ELECTRONICS`, `FURNITURE`, `CLOTHING`, `OTHER`
  - `ProductStatus` enum — `SELLING`, `SOLD`
- **File uploads**: Images saved to `backend/uploads/` via `System.getProperty("user.dir")` (relative path — works on any PC). Served at `/images/**` via `WebConfig`. The `uploads/` folder must exist; it is not auto-created on first boot unless a file is uploaded.
- **Auth**: Username/password checked against DB rows; no tokens, no hashing.
- **Error handling**: `GlobalExceptionHandler` converts `RuntimeException` → HTTP 400 with `{ "message": "..." }`.

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
- `backend/uploads/` 폴더가 없으면 이미지 업로드 시 자동 생성됨 (`mkdirs()` 호출). 단 폴더 없을 때 서빙은 불가 — 미리 만들어두는 것이 안전.
- H2 is in-memory; all data is lost on backend restart. Reseed via `POST /api/auth/setup` (기존 데이터 전체 삭제 후 재생성).
- Passwords are stored as plain text — no hashing or token-based auth.
- CORS is `@CrossOrigin(origins = "http://localhost:3000")` on each controller (not global config).
- `GET /api/items` search/filter/sort is done in Java stream after `findAll()` — not a DB query. Fine for small data sets.

## Troubleshooting

### 포트 충돌 시
```bash
netstat -ano | findstr :8081
taskkill /PID <PID번호> /F
```

### 프론트엔드 react-scripts 오류 시
```bash
cd frontend
npm install
npm start
```
