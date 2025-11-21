'use client';

import { useState } from 'react';
import { useQuiz } from '@/lib/contexts/QuizContext';
import Button from '@/components/ui/Button';
import { Music, Sparkles, Palette } from 'lucide-react';

const MOOD_CARDS = [
  {
    id: 'kpop',
    title: 'K-POP',
    emoji: '🎤',
    description: '에너제틱하고 화려한',
    colors: ['#FF1744', '#F50057', '#E040FB'],
    activities: ['공연 관람', '친구와 공유', '댄스'],
    gradient: 'from-pink-500 via-purple-500 to-indigo-500',
  },
  {
    id: 'ballad',
    title: '발라드',
    emoji: '🎹',
    description: '감성적이고 차분한',
    colors: ['#2196F3', '#00BCD4', '#4FC3F7'],
    activities: ['혼자 듣기', '감상', '힐링'],
    gradient: 'from-blue-400 via-cyan-400 to-teal-400',
  },
  {
    id: 'graffiti',
    title: '그래피티',
    emoji: '🎨',
    description: '자유롭고 강렬한',
    colors: ['#FF5722', '#FF9800', '#FFC107'],
    activities: ['작곡', '실험', '표현'],
    gradient: 'from-orange-500 via-red-500 to-yellow-500',
  },
  {
    id: 'retro',
    title: '레트로',
    emoji: '📻',
    description: '빈티지하고 감각적인',
    colors: ['#9C27B0', '#673AB7', '#3F51B5'],
    activities: ['수집', '탐구', '큐레이션'],
    gradient: 'from-purple-600 via-indigo-600 to-blue-600',
  },
];

export default function Stage1MoodSelection() {
  const { quizData, updateQuizData, nextStage } = useQuiz();
  const [selectedMoods, setSelectedMoods] = useState<string[]>(quizData.selectedMoods || []);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const toggleMood = (moodId: string) => {
    if (selectedMoods.includes(moodId)) {
      setSelectedMoods(selectedMoods.filter((id) => id !== moodId));
    } else {
      if (selectedMoods.length < 4) {
        setSelectedMoods([...selectedMoods, moodId]);
      }
    }
  };

  const moveUp = (index: number) => {
    if (index > 0) {
      const newOrder = [...selectedMoods];
      [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
      setSelectedMoods(newOrder);
    }
  };

  const moveDown = (index: number) => {
    if (index < selectedMoods.length - 1) {
      const newOrder = [...selectedMoods];
      [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
      setSelectedMoods(newOrder);
    }
  };

  const handleNext = () => {
    if (selectedMoods.length === 0) {
      alert('최소 1개 이상의 무드를 선택해주세요');
      return;
    }

    const allColors = selectedMoods.flatMap((moodId) => {
      const card = MOOD_CARDS.find((c) => c.id === moodId);
      return card?.colors || [];
    });

    updateQuizData({
      selectedMoods,
      moodPriority: selectedMoods,
      colorPalette: allColors,
    });
    nextStage();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="h-8 w-8 text-yellow-500" />
          <h1 className="text-4xl font-bold">당신의 무드를 선택하세요</h1>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          당신에게 끌리는 무드를 모두 선택하고, 드래그하여 순서를 정하세요
        </p>
        <div className="mt-4 flex items-center justify-center gap-4 text-sm text-gray-500">
          <span>1/3 단계</span>
          <span>•</span>
          <span>약 2분 소요</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-8">
        <div className="h-full bg-blue-600 rounded-full transition-all duration-300" style={{ width: '33%' }} />
      </div>

      {/* Mood Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {MOOD_CARDS.map((card) => {
          const isSelected = selectedMoods.includes(card.id);
          const priority = selectedMoods.indexOf(card.id) + 1;

          return (
            <div
              key={card.id}
              onClick={() => toggleMood(card.id)}
              onMouseEnter={() => setHoveredCard(card.id)}
              onMouseLeave={() => setHoveredCard(null)}
              className={`
                relative cursor-pointer rounded-2xl overflow-hidden transition-all duration-300
                ${isSelected ? 'ring-4 ring-blue-500 shadow-2xl scale-105' : 'hover:scale-105 shadow-lg'}
              `}
            >
              {/* Gradient Background */}
              <div className={`h-64 bg-gradient-to-br ${card.gradient} p-6 flex flex-col justify-between`}>
                {/* Priority Badge */}
                {isSelected && (
                  <div className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg">
                    {priority}
                  </div>
                )}

                {/* Card Content */}
                <div>
                  <div className="text-5xl mb-3">{card.emoji}</div>
                  <h3 className="text-2xl font-bold text-white mb-2">{card.title}</h3>
                  <p className="text-white/90 text-sm">{card.description}</p>
                </div>

                {/* Activities */}
                <div className="space-y-1">
                  {card.activities.map((activity, i) => (
                    <div key={i} className="text-xs text-white/80 bg-white/20 px-2 py-1 rounded-full inline-block mr-1">
                      {activity}
                    </div>
                  ))}
                </div>

                {/* Color Palette */}
                <div className="flex gap-2 mt-2">
                  {card.colors.map((color, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full border-2 border-white shadow-md"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Hover Effect */}
              {hoveredCard === card.id && !isSelected && (
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-white text-lg font-semibold">선택하기</div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Moods Priority */}
      {selectedMoods.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Palette className="h-5 w-5" />
            선택한 무드 우선순위
          </h3>
          <div className="space-y-3">
            {selectedMoods.map((moodId, index) => {
              const card = MOOD_CARDS.find((c) => c.id === moodId);
              return (
                <div
                  key={moodId}
                  className="flex items-center justify-between bg-gray-50 dark:bg-slate-700 rounded-lg p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-2xl font-bold text-gray-400 w-8">{index + 1}</div>
                    <div className="text-3xl">{card?.emoji}</div>
                    <div>
                      <div className="font-semibold">{card?.title}</div>
                      <div className="text-sm text-gray-500">{card?.description}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveUp(index);
                      }}
                      disabled={index === 0}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded disabled:opacity-30"
                    >
                      ↑
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveDown(index);
                      }}
                      disabled={index === selectedMoods.length - 1}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded disabled:opacity-30"
                    >
                      ↓
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMood(moodId);
                      }}
                      className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-end">
        <Button size="lg" onClick={handleNext} disabled={selectedMoods.length === 0}>
          다음 단계
        </Button>
      </div>
    </div>
  );
}
