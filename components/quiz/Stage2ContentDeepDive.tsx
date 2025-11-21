'use client';

import { useState } from 'react';
import { useQuiz } from '@/lib/contexts/QuizContext';
import Button from '@/components/ui/Button';
import { Music, Book, Palette, Coffee, ChevronRight } from 'lucide-react';

const MUSIC_ACTIVITIES = ['감상', '공연/페스티벌', '작곡/연주', '노래방', '플레이리스트 만들기', '리뷰 작성'];
const MUSIC_GENRES = ['K-POP', '인디', '힙합', '재즈', '클래식', '일렉트로니카', 'R&B', '포크', '락', '블루스', '발라드'];

const BOOK_ACTIVITIES = ['혼자 읽기', '북클럽 참여', '필사/메모', '서평 작성', '강연회 참석'];
const BOOK_GENRES = ['소설', '에세이', '시집', '자기계발', '철학', '과학', '역사', '예술', '경제/경영'];

const ART_ACTIVITIES = ['전시회 관람', '작품 사진', '직접 창작', '아트북 수집', '큐레이션'];
const ART_STYLES = ['추상화', '사실주의', '팝아트', '사진', '설치미술', '디지털아트', '조각', '일러스트'];

const FOOD_ACTIVITIES = ['직접 요리', '맛집 탐방', '페어링', '리뷰 작성'];
const FOOD_PREFERENCES = ['와인', '커피', '칵테일', '위스키', '차(Tea)', '맥주', '디저트', '파인다이닝'];

export default function Stage2ContentDeepDive() {
  const { quizData, updateQuizData, nextStage, prevStage } = useQuiz();

  const [currentCategory, setCurrentCategory] = useState(0);
  const categories = ['music', 'books', 'art', 'food'];

  // Music
  const [musicActivities, setMusicActivities] = useState<string[]>(quizData.musicActivities || []);
  const [musicGenres, setMusicGenres] = useState<string[]>(quizData.musicGenres || []);
  const [favoriteArtists, setFavoriteArtists] = useState<string[]>(quizData.favoriteArtists || ['', '', '']);

  // Books
  const [bookActivities, setBookActivities] = useState<string[]>(quizData.bookActivities || []);
  const [bookGenres, setBookGenres] = useState<string[]>(quizData.bookGenres || []);
  const [recentBooks, setRecentBooks] = useState<string[]>(quizData.recentBooks || ['']);

  // Art
  const [artActivities, setArtActivities] = useState<string[]>(quizData.artActivities || []);
  const [artStyles, setArtStyles] = useState<string[]>(quizData.artStyles || []);

  // Food
  const [foodActivities, setFoodActivities] = useState<string[]>(quizData.foodActivities || []);
  const [foodPreferences, setFoodPreferences] = useState<string[]>(quizData.foodPreferences || []);

  const toggleItem = (item: string, list: string[], setList: (list: string[]) => void, max?: number) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      if (max && list.length >= max) {
        alert(`최대 ${max}개까지 선택 가능합니다`);
        return;
      }
      setList([...list, item]);
    }
  };

  const handleNext = () => {
    if (currentCategory < categories.length - 1) {
      setCurrentCategory(currentCategory + 1);
    } else {
      // Save all data
      updateQuizData({
        musicActivities,
        musicGenres,
        favoriteArtists: favoriteArtists.filter(a => a.trim()),
        bookActivities,
        bookGenres,
        recentBooks: recentBooks.filter(b => b.trim()),
        artActivities,
        artStyles,
        foodActivities,
        foodPreferences,
      });
      nextStage();
    }
  };

  const renderCategory = () => {
    switch (currentCategory) {
      case 0: // Music
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <Music className="h-16 w-16 mx-auto mb-4 text-blue-600" />
              <h2 className="text-3xl font-bold mb-2">음악</h2>
              <p className="text-gray-600 dark:text-gray-400">음악과 관련해서 주로 뭐 해요?</p>
            </div>

            {/* Activities */}
            <div>
              <label className="block font-semibold mb-3">활동 (복수 선택 가능)</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {MUSIC_ACTIVITIES.map((activity) => (
                  <button
                    key={activity}
                    onClick={() => toggleItem(activity, musicActivities, setMusicActivities)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      musicActivities.includes(activity)
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
                    }`}
                  >
                    {activity}
                  </button>
                ))}
              </div>
            </div>

            {/* Genres */}
            <div>
              <label className="block font-semibold mb-3">장르 (최대 5개)</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {MUSIC_GENRES.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => toggleItem(genre, musicGenres, setMusicGenres, 5)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      musicGenres.includes(genre)
                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                        : 'border-gray-300 dark:border-gray-600 hover:border-purple-400'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2">{musicGenres.length}/5 선택됨</p>
            </div>

            {/* Favorite Artists */}
            <div>
              <label className="block font-semibold mb-3">좋아하는 아티스트 (최대 3명)</label>
              <div className="space-y-2">
                {favoriteArtists.map((artist, index) => (
                  <input
                    key={index}
                    type="text"
                    value={artist}
                    onChange={(e) => {
                      const newArtists = [...favoriteArtists];
                      newArtists[index] = e.target.value;
                      setFavoriteArtists(newArtists);
                    }}
                    placeholder={`아티스트 ${index + 1}`}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700"
                  />
                ))}
              </div>
            </div>
          </div>
        );

      case 1: // Books
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <Book className="h-16 w-16 mx-auto mb-4 text-green-600" />
              <h2 className="text-3xl font-bold mb-2">책</h2>
              <p className="text-gray-600 dark:text-gray-400">책은 어떻게 즐겨요?</p>
            </div>

            {/* Activities */}
            <div>
              <label className="block font-semibold mb-3">활동 (복수 선택 가능)</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {BOOK_ACTIVITIES.map((activity) => (
                  <button
                    key={activity}
                    onClick={() => toggleItem(activity, bookActivities, setBookActivities)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      bookActivities.includes(activity)
                        ? 'border-green-600 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                        : 'border-gray-300 dark:border-gray-600 hover:border-green-400'
                    }`}
                  >
                    {activity}
                  </button>
                ))}
              </div>
            </div>

            {/* Genres */}
            <div>
              <label className="block font-semibold mb-3">장르 (복수 선택 가능)</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {BOOK_GENRES.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => toggleItem(genre, bookGenres, setBookGenres)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      bookGenres.includes(genre)
                        ? 'border-green-600 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                        : 'border-gray-300 dark:border-gray-600 hover:border-green-400'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Books */}
            <div>
              <label className="block font-semibold mb-3">최근 감명깊게 읽은 책 (선택)</label>
              <input
                type="text"
                value={recentBooks[0]}
                onChange={(e) => setRecentBooks([e.target.value])}
                placeholder="책 제목"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700"
              />
            </div>
          </div>
        );

      case 2: // Art
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <Palette className="h-16 w-16 mx-auto mb-4 text-purple-600" />
              <h2 className="text-3xl font-bold mb-2">시각 예술</h2>
              <p className="text-gray-600 dark:text-gray-400">미술이나 시각 예술은?</p>
            </div>

            {/* Activities */}
            <div>
              <label className="block font-semibold mb-3">활동 (복수 선택 가능)</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {ART_ACTIVITIES.map((activity) => (
                  <button
                    key={activity}
                    onClick={() => toggleItem(activity, artActivities, setArtActivities)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      artActivities.includes(activity)
                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                        : 'border-gray-300 dark:border-gray-600 hover:border-purple-400'
                    }`}
                  >
                    {activity}
                  </button>
                ))}
              </div>
            </div>

            {/* Styles */}
            <div>
              <label className="block font-semibold mb-3">스타일 (복수 선택 가능)</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {ART_STYLES.map((style) => (
                  <button
                    key={style}
                    onClick={() => toggleItem(style, artStyles, setArtStyles)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      artStyles.includes(style)
                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                        : 'border-gray-300 dark:border-gray-600 hover:border-purple-400'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 3: // Food
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <Coffee className="h-16 w-16 mx-auto mb-4 text-orange-600" />
              <h2 className="text-3xl font-bold mb-2">음식 & 음료</h2>
              <p className="text-gray-600 dark:text-gray-400">먹고 마시는 거는?</p>
            </div>

            {/* Activities */}
            <div>
              <label className="block font-semibold mb-3">활동 (복수 선택 가능)</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {FOOD_ACTIVITIES.map((activity) => (
                  <button
                    key={activity}
                    onClick={() => toggleItem(activity, foodActivities, setFoodActivities)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      foodActivities.includes(activity)
                        ? 'border-orange-600 bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                        : 'border-gray-300 dark:border-gray-600 hover:border-orange-400'
                    }`}
                  >
                    {activity}
                  </button>
                ))}
              </div>
            </div>

            {/* Preferences */}
            <div>
              <label className="block font-semibold mb-3">선호 음료/음식 (복수 선택 가능)</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {FOOD_PREFERENCES.map((pref) => (
                  <button
                    key={pref}
                    onClick={() => toggleItem(pref, foodPreferences, setFoodPreferences)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      foodPreferences.includes(pref)
                        ? 'border-orange-600 bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                        : 'border-gray-300 dark:border-gray-600 hover:border-orange-400'
                    }`}
                  >
                    {pref}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">콘텐츠 취향 탐색</h1>
        <p className="text-gray-600 dark:text-gray-400">2/3 단계 • 약 3분 소요</p>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-8">
        <div className="h-full bg-blue-600 rounded-full transition-all duration-300" style={{ width: '66%' }} />
      </div>

      {/* Category Progress */}
      <div className="flex justify-center gap-2 mb-8">
        {categories.map((cat, index) => (
          <div
            key={cat}
            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
              index === currentCategory
                ? 'bg-blue-600 text-white scale-110'
                : index < currentCategory
                ? 'bg-green-600 text-white'
                : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
            }`}
          >
            {index < currentCategory ? '✓' : index + 1}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-8 mb-8">
        {renderCategory()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStage}>
          이전
        </Button>
        <Button onClick={handleNext}>
          {currentCategory < categories.length - 1 ? '다음 카테고리' : '다음 단계'}
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
