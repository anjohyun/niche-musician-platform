# 🚀 빠른 시작 가이드

## Cursor에서 프로젝트 시작하기

### 1. Cursor에서 프로젝트 열기
```bash
cursor /home/claude/niche-musician-platform
```

### 2. 터미널에서 의존성 설치
```bash
npm install
```

### 3. 환경 변수 설정

`.env.example` 파일을 `.env`로 복사:
```bash
cp .env.example .env
```

그리고 다음 값들을 수정:

#### Database (Supabase 추천)
1. [Supabase](https://supabase.com)에 가입
2. 새 프로젝트 생성
3. Settings → Database → Connection string 복사
4. `DATABASE_URL`에 붙여넣기

또는 로컬 PostgreSQL 사용:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/niche_musician"
```

#### NextAuth Secret
터미널에서 생성:
```bash
openssl rand -base64 32
```

생성된 값을 `NEXTAUTH_SECRET`에 붙여넣기

#### Cloudinary (음악/이미지 업로드용)
1. [Cloudinary](https://cloudinary.com)에 가입
2. Dashboard에서 Cloud Name, API Key, API Secret 확인
3. `.env`에 붙여넣기

### 4. 데이터베이스 초기화
```bash
npx prisma db push
```

### 5. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 http://localhost:3000 열기

## 📝 주요 명령어

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# 데이터베이스 스키마 푸시
npm run db:push

# Prisma Studio (데이터베이스 GUI)
npm run db:studio

# Prisma Client 재생성
npm run db:generate
```

## 🎨 다음 단계

### 1. 회원가입/로그인 페이지 구현
- `app/auth/signup/page.tsx`
- `app/auth/login/page.tsx`

### 2. 프로필 페이지 구현
- `app/profile/[id]/page.tsx`

### 3. 트랙 업로드 기능
- `app/dashboard/upload/page.tsx`

### 4. 음악 재생 기능
- 오디오 플레이어 컴포넌트
- 재생 목록 관리

### 5. 튜토리얼 시스템
- `app/tutorials/page.tsx`
- 콘텐츠 관리 시스템

## 🐛 문제 해결

### "Module not found" 에러
```bash
rm -rf node_modules package-lock.json
npm install
```

### Prisma 에러
```bash
npx prisma generate
npx prisma db push
```

### 포트 충돌 (3000 포트 사용 중)
```bash
# 다른 포트로 실행
PORT=3001 npm run dev
```

## 📚 추가 리소스

- [Next.js 문서](https://nextjs.org/docs)
- [Prisma 문서](https://www.prisma.io/docs)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)
- [NextAuth.js 문서](https://next-auth.js.org)

## 💡 개발 팁

1. **Hot Reload**: 파일 저장 시 자동으로 페이지가 새로고침됩니다
2. **TypeScript**: 타입 에러는 컴파일 시간에 잡힙니다
3. **Prisma Studio**: 데이터베이스를 시각적으로 관리할 수 있습니다
4. **Tailwind IntelliSense**: VS Code 확장 프로그램 설치 권장

## 🎯 MVP 개발 로드맵

### Week 1-2: 기본 기능
- [x] 프로젝트 구조 설정
- [ ] 인증 시스템 (회원가입/로그인)
- [ ] 뮤지션 프로필 CRUD
- [ ] 음악 업로드/재생

### Week 3-4: 소셜 기능
- [ ] 팔로우/언팔로우
- [ ] 댓글 시스템
- [ ] 좋아요 기능
- [ ] 알림 시스템

### Week 5-6: 발견 & 큐레이션
- [ ] 검색 기능
- [ ] 필터링 시스템
- [ ] 추천 알고리즘
- [ ] 장르/니치 탐색

### Week 7-8: 교육 콘텐츠
- [ ] 튜토리얼 CMS
- [ ] 비디오 플레이어
- [ ] 학습 트래킹
- [ ] 리소스 라이브러리

준비 완료! 🚀
