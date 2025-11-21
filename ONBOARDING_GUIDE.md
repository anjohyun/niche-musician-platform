# 뮤지션 온보딩 가이드

## 개요

뮤지션 온보딩 플로우는 새로운 사용자가 자신의 음악적 정체성을 정의하고 프로필을 완성할 수 있는 인터랙티브한 단계별 프로세스입니다.

## 온보딩 단계

### 단계 1: 기원 스토리
**질문**: "당신의 음악은 어떻게 시작되었나요?"

사용자가 음악가로서의 여정의 시작점을 공유합니다. 이 스토리는 프로필의 "음악적 정체성" 섹션에 표시됩니다.

### 단계 2: 음악 철학
**질문**: "음악으로 무엇을 말하고 싶나요?"

- **음악 철학**: 아티스트의 음악적 미션
- **독특한 가치**: "내 음악을 들어야 하는 이유"

### 단계 3: 영향과 영감
사용자가 영향을 받은 아티스트와 영감의 원천을 입력합니다.

- **영향 받은 아티스트**: 쉼표로 구분
- **영감의 원천**: 쉼표로 구분

### 단계 4: 감정 팔레트
다차원 태그를 시각적으로 선택하는 인터페이스입니다.

#### 감정 태그
- 멜랑꼴리 🌙
- 희망적 ☀️
- 명상적 🧘
- 에너지틱 ⚡
- 평화로운 🕊️
- 향수를 불러일으키는 🎞️
- 신비로운 🔮
- 도취적 🌟

#### 상황 태그
- 딥 워크 💻
- 명상 🧘
- 밤의 운전 🌃
- 카페에서 ☕
- 공부할 때 📚
- 걷는 중 🚶

#### 감각 태그
- 따뜻한 🔥
- 수정 같은 💎
- 유기적인 🌿
- 층층이 쌓인 📚
- 분위기 있는 🌊

### 단계 5: 창작 과정
음악을 만드는 방법과 사용하는 도구들에 대한 설명입니다.

### 단계 6: 시각적 미학
사용자의 시각적 정체성과 색상 팔레트를 정의합니다.

### 단계 7: 협업
협업 스타일과 관심사를 설정합니다.

### 단계 8: 현재 탐구
현재 실험하고 있는 것들을 공유합니다.

## 프로필 완성도

프로필 완성도는 각 필드를 채울 때마다 자동으로 계산됩니다 (0-100%).

### 점수 체계
- 기본 정보 (스테이지 네임, 바이오): 10점
- 기원 스토리: 15점
- 음악 철학: 10점
- 독특한 가치: 10점
- 영향과 영감: 20점
- 감정 팔레트: 10점
- 창작 과정: 10점
- 도구: 5점

## 사용 흐름

1. **회원가입** → `/auth/signup`
2. **온보딩 시작** → `/onboarding`
3. **단계별 입력** → 각 단계를 완료하거나 건너뛰기
4. **저장** → 단계 완료 시 자동 저장
5. **완료** → 프로필 페이지로 이동

## 확장된 프로필 페이지

온보딩을 완료하면 프로필 페이지에 다음 섹션들이 추가됩니다:

### 1. 음악적 정체성
- 기원 스토리
- 음악 철학
- 내 음악을 들어야 하는 이유

### 2. 음악적 DNA 시각화
- 감정 팔레트 (색상별 태그)
- 상황 태그
- 감각 태그

### 3. 영향과 영감
- 영향 받은 아티스트
- 영감의 원천

### 4. 창작 과정
- 창작 과정 설명
- 사용 도구 목록

### 5. 트랙 컬렉션
- 업로드한 음악 목록
- 각 트랙의 오디오 플레이어

## 컴포넌트 구조

```
components/
├── onboarding/
│   ├── StepProgress.tsx          # 진행률 표시
│   ├── EmotionalPaletteSelector.tsx  # 감정 팔레트 선택
│   └── OnboardingPage.tsx        # 메인 온보딩 페이지
└── profile/
    ├── TagCloud.tsx              # 태그 클라우드 시각화
    └── MusicalIdentityVisualizer.tsx  # 음악적 정체성 시각화
```

## API

### 서버 액션 (`lib/actions/onboarding.ts`)

#### `saveOnboardingStep(data)`
특정 단계의 온보딩 데이터를 저장합니다.

```typescript
const result = await saveOnboardingStep({
  userId: string,
  musicOriginStory?: string,
  artisticMission?: string,
  // ... 기타 필드
});
```

#### `getOnboardingProgress(userId)`
사용자의 온보딩 진행 상황을 조회합니다.

```typescript
const result = await getOnboardingProgress(userId);
// 반환: { success: boolean, profile, completeness: number }
```

## 데이터베이스

모든 온보딩 데이터는 `MusicianProfile` 모델에 저장됩니다:

- `musicOriginStory`: 기원 스토리 (Text)
- `artisticMission`: 음악 철학 (Text)
- `uniqueValue`: 독특한 가치 (Text)
- `influences`: 영향 받은 아티스트 (String[])
- `inspirationSources`: 영감의 원천 (String[])
- `emotionalTags`: 감정 태그 (String[])
- `situationalTags`: 상황 태그 (String[])
- `sensoryTags`: 감각 태그 (String[])
- `culturalReferences`: 문화적 참조 (String[])
- `creativeProcess`: 창작 과정 (Text)
- `toolsAndGear`: 사용 도구 (String[])
- `visualAesthetic`: 시각적 미학 (Text)
- `colorPalette`: 색상 팔레트 (String[])
- `collaborationStyle`: 협업 스타일 (String)
- `lookingForCollab`: 협업 모집 여부 (Boolean)
- `collabInterests`: 협업 관심사 (String[])
- `currentExploration`: 현재 탐구 (Text)
- `experimentalWorks`: 실험적 작품 여부 (Boolean)
- `profileCompleteness`: 프로필 완성도 (0-100)

## 사용 예시

### 온보딩 페이지 접근
```tsx
import { useRouter } from 'next/navigation';

const router = useRouter();
router.push('/onboarding');
```

### 특정 단계로 이동
```tsx
const [currentStep, setCurrentStep] = useState(3);
```

### 데이터 저장
```tsx
const result = await saveOnboardingStep({
  userId: 'user-id',
  musicOriginStory: '작은 시절부터...',
  emotionalTags: ['melancholic', 'hopeful'],
});
```

## 향후 개선사항

- [ ] 실시간 저장 기능
- [ ] 이미지/오디오 업로드 통합
- [ ] AI 기반 추천 및 제안
- [ ] 음악적 DNA 시각화 개선
- [ ] 유사한 아티스트 찾기 기능

