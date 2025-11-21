'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface QuizData {
  // Stage 1
  selectedMoods: string[];
  moodPriority: string[];
  colorPalette: string[];

  // Stage 2
  musicActivities: string[];
  musicGenres: string[];
  favoriteArtists: string[];
  bookActivities: string[];
  bookGenres: string[];
  recentBooks: string[];
  artActivities: string[];
  artStyles: string[];
  foodActivities: string[];
  foodPreferences: string[];

  // Stage 3
  personalColors: string[];
  warmthLevel: number;
  brightnessLevel: number;
  moodKeywords: string[];
  trendSensitivity: number;
  socialSize: string;
  drinkingStyle: string;
  preferredTimeSlots: string[];
  cafePreference: string;
}

interface QuizContextType {
  quizData: QuizData;
  currentStage: number;
  updateQuizData: (data: Partial<QuizData>) => void;
  nextStage: () => void;
  prevStage: () => void;
  setStage: (stage: number) => void;
  saveProgress: () => void;
  loadProgress: () => void;
}

const defaultQuizData: QuizData = {
  selectedMoods: [],
  moodPriority: [],
  colorPalette: [],
  musicActivities: [],
  musicGenres: [],
  favoriteArtists: [],
  bookActivities: [],
  bookGenres: [],
  recentBooks: [],
  artActivities: [],
  artStyles: [],
  foodActivities: [],
  foodPreferences: [],
  personalColors: [],
  warmthLevel: 50,
  brightnessLevel: 50,
  moodKeywords: [],
  trendSensitivity: 50,
  socialSize: '',
  drinkingStyle: '',
  preferredTimeSlots: [],
  cafePreference: '',
};

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: React.ReactNode }) {
  const [quizData, setQuizData] = useState<QuizData>(defaultQuizData);
  const [currentStage, setCurrentStage] = useState(1);

  // Load progress from localStorage on mount
  useEffect(() => {
    loadProgress();
  }, []);

  const updateQuizData = (data: Partial<QuizData>) => {
    setQuizData((prev) => ({ ...prev, ...data }));
  };

  const nextStage = () => {
    if (currentStage < 3) {
      setCurrentStage((prev) => prev + 1);
      saveProgress();
    }
  };

  const prevStage = () => {
    if (currentStage > 1) {
      setCurrentStage((prev) => prev - 1);
    }
  };

  const setStage = (stage: number) => {
    if (stage >= 1 && stage <= 3) {
      setCurrentStage(stage);
    }
  };

  const saveProgress = () => {
    try {
      localStorage.setItem('quizProgress', JSON.stringify({ quizData, currentStage }));
    } catch (error) {
      console.error('Save progress error:', error);
    }
  };

  const loadProgress = () => {
    try {
      const saved = localStorage.getItem('quizProgress');
      if (saved) {
        const { quizData: savedData, currentStage: savedStage } = JSON.parse(saved);
        setQuizData(savedData);
        setCurrentStage(savedStage);
      }
    } catch (error) {
      console.error('Load progress error:', error);
    }
  };

  return (
    <QuizContext.Provider
      value={{
        quizData,
        currentStage,
        updateQuizData,
        nextStage,
        prevStage,
        setStage,
        saveProgress,
        loadProgress,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within QuizProvider');
  }
  return context;
}
