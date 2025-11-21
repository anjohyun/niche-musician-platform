'use client';

import { QuizProvider, useQuiz } from '@/lib/contexts/QuizContext';
import Stage1MoodSelection from '@/components/quiz/Stage1MoodSelection';
import Stage2ContentDeepDive from '@/components/quiz/Stage2ContentDeepDive';
import Stage3AestheticSocial from '@/components/quiz/Stage3AestheticSocial';

export default function QuizPage() {
  return (
    <QuizProvider>
      <QuizFlow />
    </QuizProvider>
  );
}

function QuizFlow() {
  const { currentStage } = useQuiz();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {currentStage === 1 && <Stage1MoodSelection />}
      {currentStage === 2 && <Stage2ContentDeepDive />}
      {currentStage === 3 && <Stage3AestheticSocial />}
    </div>
  );
}
