# 🎵 Niche Musician Platform

> 조수용과 스티브 잡스의 철학을 바탕으로 만든 프리미엄 뮤지션 플랫폼

AI 컨텐츠가 넘쳐나는 시대에, 진정한 아티스트의 가치를 지키고 발전시키는 큐레이션 플랫폼입니다.

## 🎯 핵심 철학

1. **심플함** - 복잡함을 제거하고 본질에 집중
2. **장인정신** - 보이지 않는 디테일까지 완벽하게
3. **사용자 중심** - 뮤지션의 진짜 문제 해결
4. **교차점 창의성** - 기술과 예술의 완벽한 융합
5. **통제된 생태계** - 큐레이션을 통한 품질 보장
6. **디테일 집착** - 모든 경험의 순간을 설계
7. **직관적 UX** - 설명 없이도 이해되는 인터페이스
8. **스토리텔링** - 기능이 아닌 가치 전달

## ✨ 주요 기능

### Phase 1: MVP (2-4주)
- ✅ 뮤지션 프로필 시스템
- ✅ 음악 업로드 & 플레이어
- ✅ 니치 태그 & 장르 시스템
- ✅ 발견 및 탐색 기능
- ✅ 팔로우/언팔로우
- ✅ 댓글 & 반응 시스템

### Phase 2: 교육 레이어 (4-8주)
- 🔄 AI 튜토리얼 허브
- 🔄 실습 프로젝트
- 🔄 창작 도구 통합
- 🔄 쇼케이스 비디오 생성기

## 🛠 기술 스택

### Frontend
- **Next.js 15** - App Router, Server Components
- **TypeScript** - 타입 안정성
- **Tailwind CSS** - 유틸리티 우선 스타일링
- **Lucide React** - 아이콘 시스템

### Backend
- **Next.js API Routes** - 서버리스 API
- **Prisma** - 타입 안전 ORM
- **PostgreSQL** - 데이터베이스

### Authentication
- **NextAuth.js v5** - 인증 시스템

### Storage
- **Cloudinary** - 미디어 관리

### Deployment
- **Vercel** - 자동 배포 & CDN

## 🚀 시작하기

### 1. 저장소 클론
\`\`\`bash
git clone <repository-url>
cd niche-musician-platform
\`\`\`

### 2. 의존성 설치
\`\`\`bash
npm install
\`\`\`

### 3. 환경 변수 설정
\`\`\`bash
cp .env.example .env
\`\`\`

`.env` 파일을 열고 다음 값들을 설정하세요:

\`\`\`env
# Database - Supabase나 로컬 PostgreSQL
DATABASE_URL="postgresql://username:password@localhost:5432/niche_musician"

# NextAuth - openssl rand -base64 32로 생성
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Cloudinary (음악/이미지 업로드)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
\`\`\`

### 4. 데이터베이스 설정
\`\`\`bash
# Prisma 마이그레이션 생성 & 적용
npx prisma db push

# Prisma Studio로 데이터 확인 (선택)
npx prisma studio
\`\`\`

### 5. 개발 서버 실행
\`\`\`bash
npm run dev
\`\`\`

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어보세요.

## 📁 프로젝트 구조

\`\`\`
niche-musician-platform/
├── app/                    # Next.js App Router
│   ├── api/               # API 엔드포인트
│   ├── auth/              # 인증 페이지
│   ├── discover/          # 발견 페이지
│   ├── profile/           # 프로필 페이지
│   ├── tracks/            # 트랙 페이지
│   ├── tutorials/         # 튜토리얼 페이지
│   ├── dashboard/         # 대시보드
│   ├── layout.tsx         # 루트 레이아웃
│   ├── page.tsx           # 홈페이지
│   └── globals.css        # 글로벌 스타일
├── components/            # React 컴포넌트
│   ├── ui/               # 재사용 가능한 UI 컴포넌트
│   ├── musicians/        # 뮤지션 관련 컴포넌트
│   ├── tracks/           # 트랙 관련 컴포넌트
│   └── layouts/          # 레이아웃 컴포넌트
├── lib/                   # 유틸리티 & 설정
│   ├── actions/          # Server Actions
│   ├── utils.ts          # 헬퍼 함수
│   └── prisma.ts         # Prisma 클라이언트
├── prisma/
│   └── schema.prisma     # 데이터베이스 스키마
├── public/               # 정적 파일
├── next.config.js        # Next.js 설정
├── tailwind.config.ts    # Tailwind 설정
├── tsconfig.json         # TypeScript 설정
└── package.json          # 의존성
\`\`\`

## 🎨 디자인 원칙

### 1. 심플함
- 불필요한 기능 제거
- 명확한 계층 구조
- 여백의 적극적 활용

### 2. 일관성
- 통일된 컬러 팔레트
- 일관된 타이포그래피
- 재사용 가능한 컴포넌트

### 3. 직관성
- 명확한 레이블
- 예측 가능한 동작
- 즉각적인 피드백

## 📊 데이터베이스 스키마

### 주요 모델
- **User** - 사용자 계정
- **MusicianProfile** - 뮤지션 프로필 (정체성)
- **Track** - 음악 트랙
- **Follow** - 팔로우 관계
- **Like** - 좋아요
- **Comment** - 댓글
- **Playlist** - 플레이리스트
- **Tutorial** - 교육 콘텐츠

## 🔐 인증 시스템

NextAuth.js v5를 사용한 다양한 인증 방식 지원:
- 이메일/비밀번호
- Google OAuth (선택)
- 기타 OAuth 프로바이더 확장 가능

## 📱 모바일 대응

- 반응형 디자인 (Tailwind CSS)
- 터치 최적화 UI
- 향후 React Native로 네이티브 앱 변환 가능

## 🚀 배포

### Vercel 배포
\`\`\`bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel
\`\`\`

### 환경 변수
Vercel 대시보드에서 환경 변수 설정:
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- Cloudinary 설정들

## 🤝 기여 가이드

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 라이선스

Private - All rights reserved

## 👥 만든 사람들

조수용과 스티브 잡스의 철학을 실현하는 팀

---

**"심플함은 궁극의 정교함이다."** - 레오나르도 다 빈치
