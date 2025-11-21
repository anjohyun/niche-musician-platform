# 데이터베이스 설정 가이드

## 현재 상태

✅ `.env` 파일이 생성되었습니다  
❌ PostgreSQL 서버가 실행 중이지 않습니다

## 해결 방법 (두 가지 옵션)

### 🎯 옵션 1: Supabase 사용 (권장 - 가장 쉬움)

#### 1. Supabase에 가입
https://supabase.com 에서 무료 계정 생성

#### 2. 새 프로젝트 생성
- New Project 클릭
- 프로젝트 이름: `niche-musician`
- 데이터베이스 비밀번호 설정 (기억해두세요!)

#### 3. Connection String 복사
- Project Settings → Database → Connection string → URI 탭
- 연결 문자열을 복사

#### 4. .env 파일 업데이트
```bash
# .env 파일을 열고 DATABASE_URL을 수정
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres"
```

#### 5. 데이터베이스 스키마 푸시
```bash
npx prisma db push
```

---

### 🎯 옵션 2: 로컬 PostgreSQL 설치

#### 1. PostgreSQL 설치 (macOS)
```bash
brew install postgresql@14
```

#### 2. PostgreSQL 서비스 시작
```bash
brew services start postgresql@14
```

#### 3. 데이터베이스 생성
```bash
# PostgreSQL에 연결
psql postgres

# 데이터베이스 생성
CREATE DATABASE niche_musician;

# 종료
\q
```

#### 4. .env 파일 업데이트
```bash
# username을 본인 macOS 사용자명으로 변경
DATABASE_URL="postgresql://$(whoami)@localhost:5432/niche_musician?schema=public"
```

#### 5. 데이터베이스 스키마 푸시
```bash
npx prisma db push
```

---

## 빠른 시작 (Supabase 사용)

```bash
# 1. Supabase에서 Connection String 복사
# 2. .env 파일 열기
nano .env

# 3. DATABASE_URL 수정
DATABASE_URL="postgresql://postgres:your-password@db.xxx.supabase.co:5432/postgres"

# 4. 저장 (Ctrl+O, Enter, Ctrl+X)

# 5. 데이터베이스 스키마 푸시
npx prisma db push

# 6. 개발 서버 실행
npm run dev
```

## 확인하기

데이터베이스 연결이 성공했는지 확인:

```bash
# Prisma Studio로 데이터베이스 확인
npx prisma studio
```

브라우저에서 `http://localhost:5555`가 열리면 성공입니다!

## 문제 해결

### "Can't reach database server" 에러
- Supabase 사용 시: 프로젝트가 활성화되어 있는지 확인 (Supabase 대시보드)
- 로컬 PostgreSQL 사용 시: `brew services list`로 서비스 상태 확인

### "Authentication failed" 에러
- Supabase: 비밀번호가 올바른지 확인
- 로컬: PostgreSQL 사용자 권한 확인

### Prisma 에러
```bash
# Prisma Client 재생성
npx prisma generate

# 스키마 다시 푸시
npx prisma db push
```

## 다음 단계

데이터베이스 연결이 완료되면:
1. 회원가입/로그인 테스트
2. 프로필 생성
3. 음악 업로드 테스트

