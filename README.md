# 🤖 모두의 AI평생교육원 | Senior AI Hub

> AI가 어려운 40~70대 성인·시니어를 위한 AI 상담 · 맞춤 교육 추천 · 무료 체험 신청 서비스

생성형 AI가 처음인 성인·시니어도 질문 한 번으로 AI 상담을 받고,  
맞춤형 교육을 추천받은 뒤 무료 체험까지 신청할 수 있는 웹서비스입니다.

## 🚀 Live Demo

**🌐 Vercel**  
https://senior-ai-hub-react.vercel.app

**💻 GitHub**  
https://github.com/suyeon-lee-0303/260803_-Senior_AI_Hub

---

## 1. 프로젝트 소개

**Senior AI Hub**는 나주 지역 시니어·중장년 학습자를 위한 AI 교육 진입 플랫폼입니다.  
전문 용어 없이 눈높이에 맞춘 Claude AI 상담을 제공하고, 상담 내용을 바탕으로 학습 과정을 추천한 뒤, 무료 체험 신청을 Google Sheets로 운영자에게 전달합니다.

본 프로젝트는 **모두의 AI평생교육원** 실운영을 위한 **MVP(Minimum Viable Product)** 이며,  
React + Vite + TypeScript 기반으로 재구축한 수료 제출용 완성본입니다.

| 항목 | 내용 |
|------|------|
| 서비스명 | Senior AI Hub (모두의 AI평생교육원) |
| 대상 사용자 | 40~70대 성인 · 시니어 · AI 초보 |
| 형태 | 반응형 웹 앱 (모바일 우선) |
| 배포 | Vercel |
| 버전 | MVP 1.0 |

---

## 2. 프로젝트 목적 (문제 정의)

### 해결하고 싶은 문제

많은 시니어·중장년 학습자가 AI를 배우고 싶어 하지만,

- **무엇부터 시작해야 할지** 모릅니다
- 전문 용어가 많아 **상담 창구에 부담**을 느낍니다
- 관심사와 수준에 맞는 **교육 과정을 고르기 어렵습니다**
- 문의·신청이 전화·메모에 흩어져 **운영 관리가 어렵습니다**

### 이 프로젝트가 제공하는 해결

1. **쉬운 AI 상담** — 존댓말·일상 비유로 바로 답변
2. **맞춤 학습 추천** — 상담 후 수준·과정·이유를 카드로 제시
3. **무료 체험 신청** — 웹에서 바로 신청
4. **운영 데이터 연동** — 신청 내역을 Google Sheets에 자동 저장

---

## 3. 핵심 기능

### 3.1 AI 상담

- 예시 질문 칩 또는 자유 입력
- Claude API로 시니어 눈높이 답변 생성
- 로딩·오류 메시지 포함

### 3.2 AI 맞춤 교육 추천

- 상담 질문·답변을 분석해 추천 생성
- 표시 항목: **현재 수준** · **추천 과정** · **추천 이유** · **다음 추천 과정**
- 추천 카드에서 무료 체험 신청으로 바로 이동

### 3.3 무료 체험 신청

- React Hook Form + Zod 검증
- 입력: 이름, 연락처, 이메일(선택), 연령대, 배우고 싶은 것, 희망 시간, 유입경로, 개인정보 동의
- 신청 완료 화면 제공

### 3.4 Google Sheets 저장

- 서버(API)에서만 서비스 계정으로 저장 (프론트에 Secret 없음)
- 컬럼 구조는 기존 Apps Script(`Code.gs`)와 동일  
  `일시 | 이름 | 연락처 | 관심사 | 이메일 | 연령대 | 희망시간 | 유입경로`

### 사용자 흐름

```text
홈(Hero)
  → AI 질문 입력
  → Claude AI 답변
  → AI 맞춤 학습 추천 카드
  → 무료 체험 신청
  → Google Sheets 저장
  → 신청 완료 화면
```

---

## 4. 기술 스택

| 구분 | 기술 |
|------|------|
| Frontend | React 18, Vite, TypeScript |
| UI | Tailwind CSS, shadcn/ui |
| Form | React Hook Form, Zod |
| Backend | Vercel Serverless Functions (`api/`) |
| AI | Anthropic Claude API |
| Data | Google Sheets API (Service Account) |
| Local API | Express + tsx (개발용 프록시) |
| Deploy | Vercel |

---

## 5. 프로젝트 구조

```text
├── api/                      # Vercel Serverless API
│   ├── ask.ts                # AI 상담
│   ├── recommend.ts          # 맞춤 학습 추천
│   └── apply.ts              # 무료 체험 신청 → Sheets
├── server/                   # API 공통 로직 + 로컬 서버
│   ├── claude.ts
│   ├── apply.ts
│   ├── env.ts
│   └── local.ts
├── src/
│   ├── components/           # UI · Hero 등
│   ├── features/
│   │   ├── consult/          # AI 상담
│   │   ├── recommend/        # 추천 카드
│   │   └── apply/            # 신청 · 완료
│   ├── schemas/              # Zod 스키마
│   ├── lib/                  # API 클라이언트 등
│   └── App.tsx
├── docs/                     # SPEC / PRD / UI_UX 문서
├── legacy-index.html         # 초기 HTML MVP (참고용)
├── Code.gs                   # 초기 Apps Script (참고용)
├── .env.example              # 환경변수 템플릿
├── vercel.json
└── package.json
```

> `legacy-index.html`, `Code.gs`는 초기 프로토타입 참고 자료이며,  
> 실제 실행 앱은 Vite + React 루트 프로젝트입니다.

---

## 6. 실행 방법

### 사전 준비

- Node.js 18+
- Anthropic API Key
- Google Cloud 서비스 계정 + Sheets API 활성화
- 신청 데이터를 받을 Google Spreadsheet

### 설치 및 실행

```bash
# 1) 의존성 설치
npm install

# 2) 환경변수 파일 생성
cp .env.example .env
# .env에 키·시트 정보를 입력합니다

# 3) (권장) 서비스 계정 JSON을 루트에 두고 gitignore 유지
# service-account.json

# 4) 개발 서버 실행 (웹 + API 동시)
npm run dev
```

- Web: http://localhost:5173
- API: http://127.0.0.1:3001 (`/api`는 Vite가 프록시)

### 기타 명령

```bash
npm run build     # 프로덕션 빌드
npm run preview   # 빌드 결과 미리보기
npm run lint      # oxlint
```

---

## 7. 환경변수 설명 (`.env.example` 기준)

| 변수 | 필수 | 설명 |
|------|------|------|
| `ANTHROPIC_API_KEY` | ✅ | Claude API 키 |
| `ANTHROPIC_MODEL` | | 모델명 (기본: `claude-sonnet-5`) |
| `API_PORT` | | 로컬 API 포트 (기본: `3001`) |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | ✅* | 서비스 계정 이메일 |
| `GOOGLE_PRIVATE_KEY` | ✅* | 서비스 계정 private key |
| `GOOGLE_SERVICE_ACCOUNT_FILE` | 권장 | JSON 파일 경로 (예: `service-account.json`) |
| `GOOGLE_SHEETS_ID` | ✅ | 스프레드시트 ID |
| `GOOGLE_SHEETS_RANGE` | | 저장 범위 (예: `시트1!A:H`) |

\* `GOOGLE_SERVICE_ACCOUNT_FILE`이 유효하면 이메일·키는 파일에서 읽을 수 있습니다.

### 보안 주의

- `.env`, `service-account.json`은 **절대 GitHub에 올리지 않습니다** (`.gitignore` 처리됨)
- Secret은 **서버/환경변수에만** 두고, 프론트 코드에 하드코딩하지 않습니다

---

## 8. Vercel 배포 방법

1. GitHub 저장소에 프로젝트 push
2. [Vercel](https://vercel.com)에서 Import Project
3. Framework Preset: **Vite**
4. **Environment Variables**에 아래를 등록
   - `ANTHROPIC_API_KEY`
   - `ANTHROPIC_MODEL` (선택)
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `GOOGLE_PRIVATE_KEY`
   - `GOOGLE_SHEETS_ID`
   - `GOOGLE_SHEETS_RANGE`
5. Deploy
6. 배포 URL에서 상담 → 추천 → 신청 → Sheets 저장까지 확인

> Vercel에서는 `api/` 폴더의 Serverless Function이 `/api/ask`, `/api/recommend`, `/api/apply`로 동작합니다.  
> 로컬의 `server/local.ts`는 개발 편의용이며, 프로덕션에서는 Vercel Functions를 사용합니다.

### Google Sheets 공유

서비스 계정 이메일을 해당 스프레드시트에 **편집자**로 공유해야 저장됩니다.

---

## 9. 향후 발전 방향

- [ ] 관리자 대시보드 (신청·상담 현황)
- [ ] 카카오톡 알림 / 문자 안내 연동
- [ ] 학습 과정 콘텐츠 상세 페이지
- [ ] 간단 수준 진단 퀴즈
- [ ] 다회차 상담 히스토리
- [ ] 접근성(A11y) · 큰 글씨 모드 강화
- [ ] 분석(유입·전환율) 대시보드

---

## 10. 프로젝트 스크린샷

> 아래 경로에 이미지를 추가한 뒤, GitHub에서 바로 확인할 수 있습니다.  
> 권장 폴더: `docs/screenshots/`

### 홈 · Hero

![홈 화면](docs/screenshots/01-home.png)

> 서비스 소개 및 AI 상담 시작 화면

### AI 상담

![AI 상담](docs/screenshots/02-consult.png)

> Claude API 기반 AI 상담 결과

### AI 맞춤 학습 추천

![AI 추천 카드](docs/screenshots/03-recommend.png)

> AI가 추천한 맞춤 교육 과정

### 무료 체험 신청

![무료 체험 신청 폼](docs/screenshots/04-apply.png)

> 신청 정보 입력 및 검증

### 신청 완료

![신청 완료](docs/screenshots/05-done.png)

> 신청 완료 안내 화면

### Google Sheets 저장 결과

![Google Sheets 저장](docs/screenshots/06-sheets.png)

> 신청 데이터 자동 저장 결과

### 모바일 화면

![모바일 화면](docs/screenshots/07-mobile.png)

> 모바일 반응형 UI

---

## 참고 문서

- [docs/SPEC.md](docs/SPEC.md) — 제품 명세
- [docs/PRD.md](docs/PRD.md) — 요구사항
- [docs/UI_UX.md](docs/UI_UX.md) — UI/UX 가이드
- [LEGACY.md](LEGACY.md) — 초기 HTML/GAS 참고 안내

---

## 👩‍💻 Author

**이수연**

AI·디지털 리터러시 교육 전문가

모두의 AI평생교육원

GitHub : https://github.com/suyeon-lee-0303

---

## 💡 프로젝트에서 구현한 핵심 기술

- React + Vite + TypeScript 기반 SPA
- Claude API 기반 AI 상담
- AI 맞춤 교육 추천
- React Hook Form + Zod 입력 검증
- Google Sheets API (Service Account) 연동
- Vercel Serverless Functions
- 환경변수를 활용한 API Key 보안 관리
- Mobile First 반응형 UI

---

## License

본 저장소는 수료 프로젝트 제출 및 포트폴리오 용도로 작성되었습니다.  
API 키·서비스 계정 등 민감 정보는 포함하지 않습니다.
