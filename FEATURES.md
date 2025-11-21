# 새로 추가된 기능들

이 문서는 Niche Musician Platform에 새로 추가된 기능들을 설명합니다.

## 1. 회원가입/로그인 (`/auth/signup`, `/auth/login`)

### 구현된 기능
- **회원가입 페이지** (`app/auth/signup/page.tsx`)
  - 이메일, 이름, 비밀번호 입력
  - 비밀번호 확인 기능
  - 실시간 폼 검증
  - 에러 메시지 표시

- **로그인 페이지** (`app/auth/login/page.tsx`)
  - 이메일과 비밀번호로 로그인
  - 회원가입 성공 시 리다이렉트 메시지
  - 로컬스토리지에 사용자 정보 저장

### 서버 액션 (`lib/actions/auth.ts`)
- `signup()`: 사용자 회원가입 처리
- `login()`: 사용자 로그인 인증
- 비밀번호 해싱 (bcrypt)
- 폼 검증 (Zod)

### 사용 방법
1. 회원가입: `/auth/signup` 페이지에서 계정 생성
2. 로그인: `/auth/login` 페이지에서 로그인
3. 로그인 성공 후 대시보드 또는 프로필 페이지로 리다이렉트

---

## 2. 프로필 상세 페이지 (`/profile/[id]/page.tsx`)

### 구현된 기능
- 뮤지션 프로필 정보 표시
- 프로필 이미지, 커버 이미지
- 장르, 니치 태그 표시
- 통계 정보 (트랙 수, 팔로워, 팔로잉)
- 뮤지션의 음악 목록
- 각 음악에 대한 오디오 플레이어

### 서버 액션 (`lib/actions/profile.ts`)
- `getMusicianProfile()`: 뮤지션 프로필 정보 조회
- `getMusicianTracks()`: 뮤지션의 음악 목록 조회

### 사용 방법
1. 뮤지션 카드 클릭 또는 URL 직접 접근
2. URL 형식: `/profile/[userId]`
3. 프로필 정보와 음악 목록 확인

---

## 3. 음악 업로드 기능

### 구현된 기능
- **업로드 폼** (`components/tracks/UploadForm.tsx`)
  - 제목, 설명, 오디오 URL, 커버 이미지 URL 입력
  - 장르, 무드, 태그 설정
  - 실시간 폼 검증
  - 업로드 상태 표시

### 서버 액션 (`lib/actions/tracks.ts`)
- `uploadTrack()`: 음악 업로드 처리
- `getTracks()`: 모든 공개 음악 조회
- `getTrack()`: 특정 음악 정보 조회
- `incrementPlayCount()`: 재생 횟수 증가

### 사용 방법
1. 대시보드 (`/dashboard`) 또는 프로필 페이지에서
2. "음악 업로드" 버튼 클릭
3. 음악 정보 입력 후 업로드

---

## 4. 오디오 플레이어 컴포넌트 (`components/tracks/AudioPlayer.tsx`)

### 구현된 기능
- 재생/일시정지
- 10초 앞으로/뒤로 건너뛰기
- 진행 바 표시 및 조작
- 볼륨 조절 (0-100%)
- 음소거 토글
- 현재 시간/전체 시간 표시
- 커버 이미지 및 트랙 정보 표시
- 트랙 종료 시 콜백 처리

### 주요 기능
```typescript
interface AudioPlayerProps {
  src: string;                    // 오디오 URL
  title?: string;                // 트랙 제목
  artist?: string;               // 아티스트 이름
  coverImage?: string;           // 커버 이미지 URL
  onTrackEnd?: () => void;        // 트랙 종료 콜백
  onProgress?: (progress: number) => void; // 진행률 콜백
}
```

### 사용 예시
```tsx
<AudioPlayer
  src="https://example.com/track.mp3"
  title="My Track"
  artist="Artist Name"
  coverImage="https://example.com/cover.jpg"
/>
```

---

## 5. 대시보드 (`/dashboard`)

### 구현된 기능
- 로그인 사용자만 접근 가능
- 음악 업로드 폼
- 모든 공개 음악 목록 표시
- 각 음악에 대한 오디오 플레이어
- 통계 정보 (재생, 좋아요, 댓글 수)
- 로그아웃 기능

### 보호된 라우트
- 로그인하지 않은 사용자는 `/auth/login`으로 리다이렉트
- 로컬스토리지에서 사용자 정보 확인

---

## 파일 구조

```
├── app/
│   ├── auth/
│   │   ├── signup/
│   │   │   └── page.tsx          # 회원가입 페이지
│   │   └── login/
│   │       └── page.tsx          # 로그인 페이지
│   ├── profile/
│   │   └── [id]/
│   │       └── page.tsx          # 프로필 상세 페이지
│   ├── dashboard/
│   │   └── page.tsx              # 대시보드 페이지
│   └── ...
├── components/
│   └── tracks/
│       ├── AudioPlayer.tsx       # 오디오 플레이어
│       └── UploadForm.tsx        # 업로드 폼
├── lib/
│   ├── actions/
│   │   ├── auth.ts               # 인증 액션
│   │   ├── profile.ts            # 프로필 액션
│   │   └── tracks.ts             # 음악 액션
│   └── types.ts                  # TypeScript 타입
└── ...
```

---

## 데이터베이스 스키마

모든 기능은 Prisma 스키마를 기반으로 구현되었습니다:

- **User**: 사용자 정보
- **MusicianProfile**: 뮤지션 프로필
- **Track**: 음악 트랙
- **Like**: 좋아요
- **Comment**: 댓글
- **Follow**: 팔로우 관계

---

## 다음 단계 (선택사항)

### 추가로 구현할 수 있는 기능들:

1. **세션 관리**
   - NextAuth 세션 통합
   - 쿠키 기반 세션
   - JWT 토큰

2. **실시간 업데이트**
   - WebSocket 통합
   - 실시간 재생 횟수 업데이트
   - 실시간 좋아요/댓글

3. **파일 업로드**
   - 실제 파일 업로드 (Cloudinary, S3)
   - 이미지 최적화
   - 오디오 파일 변환

4. **소셜 기능**
   - 좋아요/싫어요
   - 댓글 작성
   - 팔로우/언팔로우
   - 플레이리스트

5. **검색 및 필터**
   - 음악 검색
   - 장르별 필터
   - 정렬 옵션

