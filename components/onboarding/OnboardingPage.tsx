'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveOnboardingStep } from '@/lib/actions/onboarding';
import StepProgress from './StepProgress';
import EmotionalPaletteSelector from './EmotionalPaletteSelector';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface OnboardingPageProps {
  userId: string;
}

export default function OnboardingPage({ userId }: OnboardingPageProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<any>({
    musicOriginStory: '',
    artisticMission: '',
    uniqueValue: '',
    influences: [],
    inspirationSources: [],
    emotionalTags: [],
    situationalTags: [],
    sensoryTags: [],
    culturalReferences: [],
    creativeProcess: '',
    toolsAndGear: [],
    visualAesthetic: '',
    colorPalette: [],
    collaborationStyle: '',
    lookingForCollab: false,
    collabInterests: [],
    currentExploration: '',
    experimentalWorks: false,
  });

  const steps = [
    { id: 1, title: '기원' },
    { id: 2, title: '철학' },
    { id: 3, title: '영감' },
    { id: 4, title: '감정' },
    { id: 5, title: '창작' },
    { id: 6, title: '시각' },
    { id: 7, title: '협업' },
    { id: 8, title: '탐구' },
  ];

  const handleNext = async () => {
    if (currentStep < steps.length) {
      // 현재 단계 데이터 저장
      await saveStep(currentStep);
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleFinish = async () => {
    await saveStep(currentStep);
    router.push(`/profile/${userId}`);
  };

  const saveStep = async (step: number) => {
    setIsLoading(true);
    try {
      const data = {
        userId,
        ...formData,
      };
      await saveOnboardingStep(data);
    } catch (error) {
      console.error('Save step error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">당신의 음악은 어떻게 시작되었나요?</h2>
              <p className="text-slate-600 dark:text-slate-400">
                음악가로서의 여정을 공유해주세요
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                기원 스토리
              </label>
              <textarea
                value={formData.musicOriginStory}
                onChange={(e) => setFormData({ ...formData, musicOriginStory: e.target.value })}
                placeholder="작은 시절 피아노를 치던 그 순간부터..."
                rows={8}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">음악으로 무엇을 말하고 싶나요?</h2>
              <p className="text-slate-600 dark:text-slate-400">
                당신의 음악 철학과 미션을 공유해주세요
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                음악 철학
              </label>
              <textarea
                value={formData.artisticMission}
                onChange={(e) => setFormData({ ...formData, artisticMission: e.target.value })}
                placeholder="내가 음악으로 전달하고 싶은 메시지는..."
                rows={6}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                내 음악의 독특한 가치
              </label>
              <textarea
                value={formData.uniqueValue}
                onChange={(e) => setFormData({ ...formData, uniqueValue: e.target.value })}
                placeholder="사람들이 내 음악을 들어야 하는 이유는..."
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">영향과 영감</h2>
              <p className="text-slate-600 dark:text-slate-400">
                어떤 아티스트와 영감의 원천이 당신의 음악을 형성했나요?
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                영향 받은 아티스트 (쉼표로 구분)
              </label>
              <Input
                placeholder="Ryuichi Sakamoto, Nils Frahm, Keith Jarrett..."
                value={formData.influences.join(', ')}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    influences: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                영감의 원천 (쉼표로 구분)
              </label>
              <Input
                placeholder="자연, 도시의 고독, 공상과학 소설..."
                value={formData.inspirationSources.join(', ')}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    inspirationSources: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                  })
                }
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">감정 팔레트</h2>
              <p className="text-slate-600 dark:text-slate-400">
                당신의 음악은 어떤 감정, 상황, 감각을 담고 있나요?
              </p>
            </div>
            <EmotionalPaletteSelector
              categories={[
                {
                  name: '감정',
                  tags: [
                    { id: 'melancholic', label: '멜랑꼴리', emoji: '🌙' },
                    { id: 'hopeful', label: '희망적', emoji: '☀️' },
                    { id: 'contemplative', label: '명상적', emoji: '🧘' },
                    { id: 'energetic', label: '에너지틱', emoji: '⚡' },
                    { id: 'peaceful', label: '평화로운', emoji: '🕊️' },
                    { id: 'nostalgic', label: '향수를 불러일으키는', emoji: '🎞️' },
                    { id: 'mysterious', label: '신비로운', emoji: '🔮' },
                    { id: 'euphoric', label: '도취적', emoji: '🌟' },
                  ],
                },
                {
                  name: '상황',
                  tags: [
                    { id: 'deep-work', label: '딥 워크', emoji: '💻' },
                    { id: 'meditation', label: '명상', emoji: '🧘' },
                    { id: 'night-drive', label: '밤의 운전', emoji: '🌃' },
                    { id: 'cafe', label: '카페에서', emoji: '☕' },
                    { id: 'studying', label: '공부할 때', emoji: '📚' },
                    { id: 'walking', label: '걷는 중', emoji: '🚶' },
                  ],
                },
                {
                  name: '감각',
                  tags: [
                    { id: 'warm', label: '따뜻한', emoji: '🔥' },
                    { id: 'crystalline', label: '수정 같은', emoji: '💎' },
                    { id: 'organic', label: '유기적인', emoji: '🌿' },
                    { id: 'layered', label: '층층이 쌓인', emoji: '📚' },
                    { id: 'atmospheric', label: '분위기 있는', emoji: '🌊' },
                  ],
                },
              ]}
              selectedTags={[
                ...formData.emotionalTags,
                ...formData.situationalTags,
                ...formData.sensoryTags,
              ]}
              onTagsChange={(tags) => {
                setFormData({
                  ...formData,
                  emotionalTags: tags.filter((t) =>
                    ['melancholic', 'hopeful', 'contemplative', 'energetic', 'peaceful', 'nostalgic', 'mysterious', 'euphoric'].includes(t)
                  ),
                  situationalTags: tags.filter((t) =>
                    ['deep-work', 'meditation', 'night-drive', 'cafe', 'studying', 'walking'].includes(t)
                  ),
                  sensoryTags: tags.filter((t) =>
                    ['warm', 'crystalline', 'organic', 'layered', 'atmospheric'].includes(t)
                  ),
                });
              }}
            />
          </div>
        );

      case 5:
      case 6:
      case 7:
      case 8:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">이 단계는 준비 중입니다</h2>
              <p className="text-slate-600 dark:text-slate-400">
                곧 추가될 예정입니다
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-8">
          <StepProgress steps={steps} currentStep={currentStep} />

          <div className="mt-12">{renderStep()}</div>

          <div className="mt-8 flex justify-between">
            <Button
              onClick={handleBack}
              disabled={currentStep === 1}
              variant="outline"
            >
              이전
            </Button>

            <div className="flex space-x-2">
              {currentStep < steps.length && (
                <Button onClick={handleSkip} variant="ghost">
                  건너뛰기
                </Button>
              )}
              {currentStep < steps.length ? (
                <Button onClick={handleNext} isLoading={isLoading}>
                  다음
                </Button>
              ) : (
                <Button onClick={handleFinish} isLoading={isLoading}>
                  완료
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

