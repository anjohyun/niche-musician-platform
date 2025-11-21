'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuiz } from '@/lib/contexts/QuizContext';
import Button from '@/components/ui/Button';
import { Palette, Users, Clock, Coffee } from 'lucide-react';
import { saveTasteProfile, generatePersonaLabel } from '@/lib/actions/quiz';

const PRESET_COLORS = [
  ['#FF6B6B', '#4ECDC4', '#45B7D1'], // Warm vibrant
  ['#2C3E50', '#E74C3C', '#ECF0F1'], // Dark elegant
  ['#FFA07A', '#98D8C8', '#F7DC6F'], // Pastel
  ['#8E44AD', '#3498DB', '#1ABC9C'], // Cool modern
  ['#E8BE4B', '#E67E22', '#C0392B'], // Autumn
  ['#1C1C1E', '#FFFFFF', '#FF3B30'], // Minimalist
];

const TIME_SLOTS = [
  { id: '저녁', label: '저녁 (18-21시)', emoji: '🌆' },
  { id: '밤', label: '밤 (21-24시)', emoji: '🌃' },
  { id: '심야', label: '심야 (00-03시)', emoji: '🌌' },
  { id: '새벽', label: '새벽 (03-06시)', emoji: '🌅' },
];

const CAFE_POSITIONS = [
  { id: '창가', label: '창가', emoji: '🪟', desc: '햇살이 들어오는' },
  { id: '구석', label: '구석', emoji: '📚', desc: '조용하고 아늑한' },
  { id: '바', label: '바', emoji: '☕', desc: '바리스타와 대화' },
  { id: '테라스', label: '테라스', emoji: '🌿', desc: '야외 공기' },
];

export default function Stage3AestheticSocial() {
  const router = useRouter();
  const { quizData, updateQuizData, prevStage } = useQuiz();

  // Aesthetic
  const [personalColors, setPersonalColors] = useState<string[]>(quizData.personalColors || []);
  const [warmthLevel, setWarmthLevel] = useState(quizData.warmthLevel || 50);
  const [brightnessLevel, setBrightnessLevel] = useState(quizData.brightnessLevel || 50);
  const [moodKeywords, setMoodKeywords] = useState<string[]>(quizData.moodKeywords || ['', '', '']);
  const [trendSensitivity, setTrendSensitivity] = useState(quizData.trendSensitivity || 50);

  // Social
  const [socialSize, setSocialSize] = useState(quizData.socialSize || '');
  const [drinkingStyle, setDrinkingStyle] = useState(quizData.drinkingStyle || '');
  const [preferredTimeSlots, setPreferredTimeSlots] = useState<string[]>(quizData.preferredTimeSlots || []);
  const [cafePreference, setCafePreference] = useState(quizData.cafePreference || '');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectPresetColors = (colors: string[]) => {
    setPersonalColors(colors);
  };

  const toggleTimeSlot = (slot: string) => {
    if (preferredTimeSlots.includes(slot)) {
      setPreferredTimeSlots(preferredTimeSlots.filter((s) => s !== slot));
    } else {
      setPreferredTimeSlots([...preferredTimeSlots, slot]);
    }
  };

  const handleComplete = async () => {
    // Validation
    if (personalColors.length === 0) {
      alert('색상을 선택해주세요');
      return;
    }

    const filteredKeywords = moodKeywords.filter((k) => k.trim());
    if (filteredKeywords.length === 0) {
      alert('무드 키워드를 최소 1개 입력해주세요');
      return;
    }

    if (!socialSize) {
      alert('선호하는 인원을 선택해주세요');
      return;
    }

    setIsSubmitting(true);

    try {
      const userData = localStorage.getItem('user');
      if (!userData) {
        router.push('/auth/login');
        return;
      }

      const user = JSON.parse(userData);

      const completeData = {
        ...quizData,
        personalColors,
        warmthLevel,
        brightnessLevel,
        moodKeywords: filteredKeywords,
        trendSensitivity,
        socialSize,
        drinkingStyle,
        preferredTimeSlots,
        cafePreference,
      };

      // Generate persona label
      const personaResult = await generatePersonaLabel(completeData);
      const personaLabel = personaResult.personaLabel || '독특한 취향의 애호가';

      // Save to database
      await saveTasteProfile(user.userId, {
        ...completeData,
        personaLabel,
        completionStatus: 'complete',
        likedGenres: completeData.musicGenres || [],
        likedEmotions: completeData.moodKeywords || [],
        likedSituations: completeData.preferredTimeSlots || [],
        likedSensory: [],
      });

      // Redirect to result page
      router.push('/quiz/result');
    } catch (error) {
      console.error('Submit error:', error);
      alert('제출 중 오류가 발생했습니다');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">미학과 사회적 맥락</h1>
        <p className="text-gray-600 dark:text-gray-400">3/3 단계 • 마지막 단계입니다!</p>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-8">
        <div className="h-full bg-blue-600 rounded-full transition-all duration-300" style={{ width: '100%' }} />
      </div>

      <div className="space-y-8">
        {/* Aesthetic Section */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Palette className="h-6 w-6" />
            미학적 선호
          </h2>

          {/* Color Palette */}
          <div className="mb-8">
            <label className="block font-semibold mb-4">당신의 밤을 색으로 표현한다면? (3가지)</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              {PRESET_COLORS.map((colors, index) => (
                <button
                  key={index}
                  onClick={() => selectPresetColors(colors)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    JSON.stringify(personalColors) === JSON.stringify(colors)
                      ? 'border-blue-600 ring-2 ring-blue-300'
                      : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
                  }`}
                >
                  <div className="flex gap-2">
                    {colors.map((color, i) => (
                      <div
                        key={i}
                        className="flex-1 h-12 rounded"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </button>
              ))}
            </div>
            {personalColors.length > 0 && (
              <div className="flex gap-3 justify-center">
                {personalColors.map((color, i) => (
                  <div key={i} className="text-center">
                    <div
                      className="w-16 h-16 rounded-full border-2 border-white shadow-lg"
                      style={{ backgroundColor: color }}
                    />
                    <div className="text-xs mt-1 font-mono">{color}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Warmth & Brightness Sliders */}
          <div className="space-y-6 mb-8">
            <div>
              <label className="block font-semibold mb-2">어떤 톤이 좋아요?</label>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span>차가운</span>
                    <span>{warmthLevel}</span>
                    <span>따뜻한</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={warmthLevel}
                    onChange={(e) => setWarmthLevel(Number(e.target.value))}
                    className="w-full h-2 bg-gradient-to-r from-blue-400 to-orange-400 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span>어두운</span>
                    <span>{brightnessLevel}</span>
                    <span>밝은</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={brightnessLevel}
                    onChange={(e) => setBrightnessLevel(Number(e.target.value))}
                    className="w-full h-2 bg-gradient-to-r from-gray-800 to-yellow-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Mood Keywords */}
          <div className="mb-8">
            <label className="block font-semibold mb-3">당신의 무드를 3단어로</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {moodKeywords.map((keyword, index) => (
                <input
                  key={index}
                  type="text"
                  value={keyword}
                  onChange={(e) => {
                    const newKeywords = [...moodKeywords];
                    newKeywords[index] = e.target.value;
                    setMoodKeywords(newKeywords);
                  }}
                  placeholder={`키워드 ${index + 1} (예: 몽환적)`}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700"
                />
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">예: 몽환적, 강렬한, 차분한, 빈티지, 모던...</p>
          </div>

          {/* Trend Sensitivity */}
          <div>
            <label className="block font-semibold mb-3">최신 트렌드 얼마나 신경 써요?</label>
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>유행 안 탐</span>
              <span>{trendSensitivity}</span>
              <span>얼리어답터</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={trendSensitivity}
              onChange={(e) => setTrendSensitivity(Number(e.target.value))}
              className="w-full h-2 bg-gradient-to-r from-gray-400 to-purple-600 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Social Section */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Users className="h-6 w-6" />
            사회적 맥락
          </h2>

          {/* Social Size */}
          <div className="mb-6">
            <label className="block font-semibold mb-3">주로 몇 명이서 시간 보내는 거 좋아해요?</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['혼자', '1-2명', '소그룹(3-5)', '파티(6+)'].map((size) => (
                <button
                  key={size}
                  onClick={() => setSocialSize(size)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    socialSize === size
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Drinking Style */}
          <div className="mb-6">
            <label className="block font-semibold mb-3">술은 어때요?</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['좋아해', '가끔', '안 마셔', '상관없어'].map((style) => (
                <button
                  key={style}
                  onClick={() => setDrinkingStyle(style)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    drinkingStyle === style
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* Time Slots */}
          <div className="mb-6">
            <label className="block font-semibold mb-3">주로 어느 시간대가 좋아요? (복수 선택)</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {TIME_SLOTS.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => toggleTimeSlot(slot.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    preferredTimeSlots.includes(slot.id)
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
                  }`}
                >
                  <div className="text-2xl mb-1">{slot.emoji}</div>
                  <div className="text-sm font-semibold">{slot.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Cafe Preference */}
          <div>
            <label className="block font-semibold mb-3">카페에서 어디 앉는 거 좋아해요?</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {CAFE_POSITIONS.map((pos) => (
                <button
                  key={pos.id}
                  onClick={() => setCafePreference(pos.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    cafePreference === pos.id
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
                  }`}
                >
                  <div className="text-3xl mb-2">{pos.emoji}</div>
                  <div className="font-semibold">{pos.label}</div>
                  <div className="text-xs text-gray-500">{pos.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={prevStage}>
          이전
        </Button>
        <Button size="lg" onClick={handleComplete} isLoading={isSubmitting}>
          완료하고 결과 보기 🎉
        </Button>
      </div>
    </div>
  );
}
