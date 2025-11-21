'use client';

import { useEffect, useMemo, useState } from 'react';
import StepProgress from '@/components/onboarding/StepProgress';
import EmotionalPaletteSelector from '@/components/onboarding/EmotionalPaletteSelector';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import TagInput from '@/components/ui/TagInput';
import MusicalDNACard from '@/components/musicians/MusicalDNACard';

const STORAGE_KEY = 'musical-dna-builder-v1';

export default function MusicalDNABuilderPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<any>({
    stageName: '',
    musicOriginStory: '',
    artisticMission: '',
    uniqueValue: '',
    influences: [],
    inspirationSources: [],
    emotionalTags: [],
    situationalTags: [],
    sensoryTags: [],
    creativeProcess: '',
    toolsAndGear: [],
    visualAesthetic: '',
    colorPalette: [],
    collaborationStyle: '',
    lookingForCollab: false,
    currentExploration: '',
  });

  // Load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setData(JSON.parse(raw));
    } catch {}
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {}
  }, [data]);

  const steps = useMemo(() => ([
    { id: 1, title: '기원' },
    { id: 2, title: '철학' },
    { id: 3, title: '영감' },
    { id: 4, title: '감정' },
    { id: 5, title: '창작' },
    { id: 6, title: '시각' },
    { id: 7, title: '협업' },
    { id: 8, title: '탐구' },
  ]), []);

  const onNext = () => setCurrentStep((s) => Math.min(s + 1, steps.length));
  const onPrev = () => setCurrentStep((s) => Math.max(s - 1, 1));

  const stepInfo = {
    1: {
      title: '🎵 당신의 음악 이야기',
      description: '어떻게 음악을 시작하게 되었나요? 당신의 음악적 여정의 시작점을 공유해주세요.',
      tip: '진솔한 이야기가 가장 좋습니다. 완벽할 필요는 없어요!'
    },
    2: {
      title: '💭 음악 철학',
      description: '음악을 통해 무엇을 표현하고 싶나요? 당신의 음악이 사람들에게 어떤 의미를 가지길 원하나요?',
      tip: '거창한 철학이 아니어도 괜찮아요. 당신의 솔직한 생각을 들려주세요.'
    },
    3: {
      title: '✨ 영향과 영감',
      description: '당신의 음악에 영향을 준 아티스트와 영감의 원천을 알려주세요.',
      tip: '음악뿐만 아니라 책, 영화, 자연 등 모든 것이 될 수 있어요!'
    },
    4: {
      title: '🎨 감정 팔레트',
      description: '당신의 음악이 담고 있는 감정과 분위기를 선택해보세요.',
      tip: '여러 개를 선택할 수 있어요. 당신의 음악적 다양성을 보여주세요!'
    },
    5: {
      title: '🛠️ 창작 과정',
      description: '어떻게 음악을 만드나요? 사용하는 도구와 창작 방식을 공유해주세요.',
      tip: 'DAW, 악기, 레코딩 장비 등 무엇이든 좋아요!'
    },
    6: {
      title: '🌈 시각적 정체성',
      description: '당신의 음악을 시각적으로 표현한다면? 색상과 미학을 정의해보세요.',
      tip: '음악의 느낌을 시각화하는 것은 브랜딩에도 도움이 됩니다.'
    },
    7: {
      title: '🤝 협업 스타일',
      description: '다른 뮤지션과의 협업에 대해 어떻게 생각하나요?',
      tip: '혼자 작업하는 것을 선호해도 괜찮아요!'
    },
    8: {
      title: '🔬 현재 탐구',
      description: '지금 실험하고 있거나 관심있는 새로운 사운드나 기법이 있나요?',
      tip: '항상 성장하는 아티스트의 모습을 보여주세요!'
    }
  };

  const currentStepInfo = stepInfo[currentStep as keyof typeof stepInfo];

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
            음악적 DNA 만들기
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            당신만의 독특한 음악적 정체성을 발견하는 여정
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Builder */}
          <div className="glass rounded-2xl p-6 shadow-xl">
            <StepProgress steps={steps} currentStep={currentStep} />

            {/* Step Info */}
            <div className="mt-8 mb-6 p-4 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-950/30 dark:to-blue-950/30 rounded-xl border border-primary-200 dark:border-primary-800">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                {currentStepInfo.title}
              </h2>
              <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">
                {currentStepInfo.description}
              </p>
              <div className="flex items-start gap-2 mt-3 p-2 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                <span className="text-lg">💡</span>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {currentStepInfo.tip}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {currentStep === 1 && (
                <div className="space-y-4">
                  <Input
                    label="스테이지 네임"
                    placeholder="예: Aether Garden"
                    value={data.stageName}
                    onChange={(e) => setData({ ...data, stageName: e.target.value })}
                  />
                  <div>
                    <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">기원 스토리</label>
                    <textarea
                      rows={6}
                      className="w-full px-4 py-3 rounded-xl border-2 border-sage-200 dark:border-sage-600 bg-white dark:bg-sage-800 text-sage-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-forest-500"
                      placeholder="작은 시절부터..."
                      value={data.musicOriginStory}
                      onChange={(e) => setData({ ...data, musicOriginStory: e.target.value })}
                    />
                  </div>
                </div>
              )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">음악 철학</label>
                  <textarea
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border-2 border-sage-200 dark:border-sage-600 bg-white dark:bg-sage-800 text-sage-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-forest-500"
                    placeholder="음악으로 무엇을 말하고 싶나요?"
                    value={data.artisticMission}
                    onChange={(e) => setData({ ...data, artisticMission: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">내 음악의 독특한 가치</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border-2 border-sage-200 dark:border-sage-600 bg-white dark:bg-sage-800 text-sage-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-forest-500"
                    placeholder="사람들이 내 음악을 들어야 하는 이유는..."
                    value={data.uniqueValue}
                    onChange={(e) => setData({ ...data, uniqueValue: e.target.value })}
                  />
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <TagInput
                  label="영향 받은 아티스트"
                  placeholder="예: Ryuichi Sakamoto"
                  value={data.influences}
                  onChange={(influences) => setData({ ...data, influences })}
                  maxTags={10}
                />
                <TagInput
                  label="영감의 원천"
                  placeholder="예: Nature, Urban loneliness, Sci-fi literature"
                  value={data.inspirationSources}
                  onChange={(inspirationSources) => setData({ ...data, inspirationSources })}
                  maxTags={10}
                />
              </div>
            )}

            {currentStep === 4 && (
              <EmotionalPaletteSelector
                categories={[
                  { name: '감정', tags: [
                    { id: 'melancholic', label: '멜랑꼴리', emoji: '🌙' },
                    { id: 'euphoric', label: '도취적', emoji: '🌟' },
                    { id: 'contemplative', label: '명상적', emoji: '🧘' },
                    { id: 'energetic', label: '에너지틱', emoji: '⚡' },
                    { id: 'peaceful', label: '평화로운', emoji: '🕊️' },
                    { id: 'mysterious', label: '신비로운', emoji: '🔮' },
                  ] },
                  { name: '상황', tags: [
                    { id: 'deep-work', label: '딥 워크', emoji: '💻' },
                    { id: 'meditation', label: '명상', emoji: '🧘' },
                    { id: 'night-drive', label: '밤의 운전', emoji: '🌃' },
                    { id: 'cafe', label: '카페에서', emoji: '☕' },
                    { id: 'studying', label: '공부할 때', emoji: '📚' },
                    { id: 'walking', label: '걷는 중', emoji: '🚶' },
                  ] },
                  { name: '감각', tags: [
                    { id: 'warm', label: '따뜻한', emoji: '🔥' },
                    { id: 'crystalline', label: '수정 같은', emoji: '💎' },
                    { id: 'organic', label: '유기적인', emoji: '🌿' },
                    { id: 'layered', label: '층층이 쌓인', emoji: '📚' },
                    { id: 'atmospheric', label: '분위기 있는', emoji: '🌊' },
                  ] },
                ]}
                selectedTags={[...data.emotionalTags, ...data.situationalTags, ...data.sensoryTags]}
                onTagsChange={(tags) => setData({
                  ...data,
                  emotionalTags: tags.filter((t) => ['melancholic','euphoric','contemplative','energetic','peaceful','mysterious'].includes(t)),
                  situationalTags: tags.filter((t) => ['deep-work','meditation','night-drive','cafe','studying','walking'].includes(t)),
                  sensoryTags: tags.filter((t) => ['warm','crystalline','organic','layered','atmospheric'].includes(t)),
                })}
              />
            )}

            {currentStep === 5 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">창작 과정</label>
                  <textarea
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border-2 border-sage-200 dark:border-sage-600 bg-white dark:bg-sage-800 text-sage-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-forest-500"
                    placeholder="어떻게 음악을 만드나요?"
                    value={data.creativeProcess}
                    onChange={(e) => setData({ ...data, creativeProcess: e.target.value })}
                  />
                </div>
                <TagInput
                  label="사용 도구 및 장비"
                  placeholder="예: Ableton Live, Prophet-5, Neumann U87"
                  value={data.toolsAndGear ?? []}
                  onChange={(toolsAndGear) => setData({ ...data, toolsAndGear })}
                  maxTags={15}
                />
              </div>
            )}

            {currentStep === 6 && (
              <div className="space-y-4">
                <Input
                  label="시각적 미학"
                  placeholder="미니멀리즘, 자연주의, 사이버펑크..."
                  value={data.visualAesthetic}
                  onChange={(e) => setData({ ...data, visualAesthetic: e.target.value })}
                />
                <TagInput
                  label="컬러 팔레트"
                  placeholder="예: #2C3E50, #E74C3C, #ECF0F1"
                  value={data.colorPalette ?? []}
                  onChange={(colorPalette) => setData({ ...data, colorPalette })}
                  maxTags={6}
                />
              </div>
            )}

            {currentStep === 7 && (
              <div className="space-y-4">
                <Input
                  label="협업 스타일"
                  placeholder="Solo / Selective / Open"
                  value={data.collaborationStyle}
                  onChange={(e) => setData({ ...data, collaborationStyle: e.target.value })}
                />
                <div className="flex items-center gap-2">
                  <input id="collab" type="checkbox" checked={data.lookingForCollab} onChange={(e) => setData({ ...data, lookingForCollab: e.target.checked })} />
                  <label htmlFor="collab" className="text-sage-700 dark:text-sage-300">협업 오픈</label>
                </div>
              </div>
            )}

            {currentStep === 8 && (
              <div className="space-y-4">
                <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">현재 탐구</label>
                <textarea
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border-2 border-sage-200 dark:border-sage-600 bg-white dark:bg-sage-800 text-sage-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-forest-500"
                  placeholder="지금 실험 중인 것들..."
                  value={data.currentExploration}
                  onChange={(e) => setData({ ...data, currentExploration: e.target.value })}
                />
              </div>
            )}

            <div className="flex justify-between pt-6 border-t border-slate-200 dark:border-slate-700">
              <Button
                variant="outline"
                onClick={onPrev}
                disabled={currentStep === 1}
                className="transition-all hover:scale-105"
              >
                ← 이전
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    if (confirm('모든 내용을 초기화하시겠습니까?')) {
                      localStorage.removeItem(STORAGE_KEY);
                      setData({
                        stageName: '',
                        musicOriginStory: '',
                        artisticMission: '',
                        uniqueValue: '',
                        influences: [],
                        inspirationSources: [],
                        emotionalTags: [],
                        situationalTags: [],
                        sensoryTags: [],
                        creativeProcess: '',
                        toolsAndGear: [],
                        visualAesthetic: '',
                        colorPalette: [],
                        collaborationStyle: '',
                        lookingForCollab: false,
                        currentExploration: '',
                      });
                      setCurrentStep(1);
                    }
                  }}
                  className="text-slate-500 hover:text-red-600"
                >
                  초기화
                </Button>
                {currentStep < steps.length ? (
                  <Button
                    onClick={onNext}
                    className="transition-all hover:scale-105 bg-primary-600 hover:bg-primary-700"
                  >
                    다음 →
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      alert('완료! 🎉\n\n당신의 음악적 DNA가 저장되었습니다.\n우측 미리보기에서 확인하세요!');
                    }}
                    className="transition-all hover:scale-105 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600"
                  >
                    완료 ✨
                  </Button>
                )}
              </div>
            </div>

            {/* Keyboard Shortcuts Hint */}
            <div className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">
              💡 자동 저장되므로 언제든 나갔다가 돌아올 수 있어요
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-4">
          <div className="sticky top-4">
            <div className="mb-4 p-3 bg-white dark:bg-slate-800 rounded-xl shadow-md">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                <span>👁️</span> 실시간 미리보기
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                입력한 내용이 실시간으로 반영됩니다
              </p>
            </div>

            <MusicalDNACard
              stageName={data.stageName || '당신의 이름'}
              artisticMission={data.artisticMission}
              uniqueValue={data.uniqueValue}
              emotionalTags={data.emotionalTags}
              situationalTags={data.situationalTags}
              sensoryTags={data.sensoryTags}
              influences={data.influences}
              collaborationStyle={data.collaborationStyle}
              lookingForCollab={data.lookingForCollab}
            />

            {currentStep === steps.length && (
              <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/30 dark:to-blue-950/30 rounded-xl border border-green-200 dark:border-green-800 animate-fade-in">
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center gap-2">
                  <span className="text-xl">🎉</span>
                  완성되었습니다!
                </h4>
                <p className="text-sm text-green-700 dark:text-green-300 mb-3">
                  당신의 음악적 DNA 프로필이 멋지게 완성되었어요!
                </p>
                <div className="space-y-2 text-xs text-green-600 dark:text-green-400">
                  <div>✓ 프로필이 로컬에 저장되었습니다</div>
                  <div>✓ 언제든 수정할 수 있습니다</div>
                  <div>✓ 다음 단계: 프로필을 공유하고 팬을 만나보세요!</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}



