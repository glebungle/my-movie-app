# 🎬 My Movie App

React 기반의 영화 예매 웹 애플리케이션입니다. 영화 조회부터 상영 스케줄 확인, 좌석 선택, 결제, 예매 내역 관리, 리뷰 작성까지 영화 예매의 전 과정을 지원하며, 관리자 페이지를 통해 영화·상영관·스케줄·쿠폰·이벤트를 관리할 수 있습니다.

## ✨ 주요 기능

### 사용자

- **영화 조회 및 상세 정보** — 상영 중인 영화 목록과 상세 페이지
- **영화 검색** — 키워드 기반 검색 결과 페이지
- **상영 스케줄 & 예매** — 날짜별 상영 스케줄 조회 후 좌석 선택 및 결제
- **좌석 선택** — 상영관 좌석 배치 기반 좌석 선택
- **결제** — 예매 결제 처리
- **마이페이지** — 회원 정보, 예매 내역, 내 리뷰, 참여 이벤트 관리
- **찜(위시리스트)** — 관심 영화 저장
- **쿠폰** — 보유 쿠폰 조회 및 사용
- **리뷰** — 관람한 영화에 대한 리뷰 등록
- **회원 관리** — 회원가입, 로그인, 회원정보 수정, 재가입

### 관리자

- **영화 관리** (`/admin/movies`)
- **상영관 관리** (`/admin/screens`)
- **상영 스케줄 관리** (`/admin/schedules`)
- **쿠폰 관리** (`/admin/coupons`)
- **이벤트 관리** (`/admin/events`)

## 🛠 기술 스택

- **React** 19
- **React Router DOM** 7 — 클라이언트 라우팅
- **Axios** — HTTP 통신
- **Create React App** (react-scripts 5)
- **Testing Library** (Jest, React Testing Library) — 테스트

## 📁 프로젝트 구조

```
my-movie-app/
├── public/                  # 정적 자산 (이미지, index.html 등)
├── src/
│   ├── api/                 # 백엔드 API 연동 모듈
│   │   ├── bookingApi.js     # 상영 스케줄 조회
│   │   ├── scheduleApi.js    # 스케줄 등록/삭제
│   │   └── screenApi.js      # 상영관 등록/삭제
│   ├── components/          # 공통 컴포넌트 (Header, Footer)
│   ├── pages/              # 페이지 컴포넌트
│   ├── App.js             # 라우트 정의
│   └── index.js           # 진입점
└── package.json
```

## 🚀 시작하기

### 사전 요구 사항

- Node.js (LTS 권장)
- 백엔드 API 서버 (`http://localhost:8080` 에서 실행)

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm start
```

[http://localhost:3000](http://localhost:3000) 에서 앱이 실행됩니다.

> API 요청은 `package.json`의 `proxy` 설정을 통해 `http://localhost:8080`으로 전달됩니다. 정상 동작을 위해 백엔드 서버를 함께 실행해야 합니다.

### 프로덕션 빌드

```bash
npm run build
```

`build/` 디렉터리에 최적화된 정적 파일이 생성됩니다.

### 테스트 실행

```bash
npm test
```

## 🔌 백엔드 연동

프론트엔드는 다음 REST API를 사용합니다. (`proxy`를 통해 `localhost:8080`으로 전달)

| 메서드   | 엔드포인트                | 설명                    |
| -------- | ------------------------- | ----------------------- |
| `GET`    | `/api/schedules?date=`    | 날짜별 상영 스케줄 조회 |
| `POST`   | `/api/schedules/register` | 스케줄 등록             |
| `DELETE` | `/api/schedules/delete`   | 스케줄 삭제             |
| `POST`   | `/api/screens/register`   | 상영관 등록             |
| `DELETE` | `/api/screens/delete`     | 상영관 삭제             |

## 🗺 주요 라우트

| 경로                             | 페이지            |
| -------------------------------- | ----------------- |
| `/`                              | 홈                |
| `/movies`                        | 영화 목록         |
| `/movies/:movieId`               | 영화 상세         |
| `/events`                        | 이벤트            |
| `/reservation`                   | 예매              |
| `/reservation/seats/:scheduleId` | 좌석 선택         |
| `/payment`                       | 결제              |
| `/mypage`                        | 마이페이지        |
| `/search`                        | 검색 결과         |
| `/coupons`                       | 쿠폰              |
| `/wishlist`                      | 찜 목록           |
| `/signin`, `/signup`             | 로그인 / 회원가입 |
| `/admin/*`                       | 관리자 페이지     |
