'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getTasteProfile, findCompatibleUsers } from '@/lib/actions/quiz';
import Button from '@/components/ui/Button';
import { Sparkles, Heart, Users, ArrowRight, Share2 } from 'lucide-react';

export default function QuizResultPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [compatibleUsers, setCompatibleUsers] = useState<any[]>([]);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) {
        router.push('/auth/login');
        return;
      }

      const user = JSON.parse(userData);

      // Get taste profile
      const profileResult = await getTasteProfile(user.userId);
      if (profileResult.success && profileResult.profile) {
        setProfile(profileResult.profile);

        // Find compatible users
        const matchResult = await findCompatibleUsers(user.userId, 3);
        if (matchResult.success && matchResult.matches) {
          setCompatibleUsers(matchResult.matches);
        }
      } else {
        // No profile found, redirect to quiz
        router.push('/quiz');
      }
    } catch (error) {
      console.error('Load results error:', error);
    } finally {
      setLoading(false);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">결과를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">프로필을 찾을 수 없습니다</p>
          <Button onClick={() => router.push('/quiz')}>퀴즈 다시 하기</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-blue-900/20 py-12 px-4">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute top-0 left-0 right-0 h-screen overflow-hidden">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-fall"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${3 + Math.random() * 2}s`,
                }}
              >
                <Sparkles className="text-yellow-400 h-6 w-6" />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-sm font-semibold">
            🎉 퀴즈 완료!
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            당신의 음악적 취향을
            <br />
            분석했습니다!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            당신만의 독특한 페르소나를 확인해보세요
          </p>
        </div>

        {/* Persona Label */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 mb-8 shadow-xl border-2 border-purple-200 dark:border-purple-800">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 mb-4">
              <Sparkles className="h-8 w-8 text-yellow-500" />
              <h2 className="text-2xl font-bold">당신의 페르소나</h2>
            </div>
            <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
              {profile.personaLabel || '독특한 취향의 애호가'}
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              당신의 음악적 정체성을 한 문장으로 표현했어요
            </p>
          </div>
        </div>

        {/* Taste Summary */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 mb-8 shadow-lg">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Heart className="h-6 w-6 text-pink-500" />
            취향 요약
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Moods */}
            {profile.selectedMoods && profile.selectedMoods.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3 text-gray-700 dark:text-gray-300">선택한 무드</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.selectedMoods.map((mood: string, i: number) => (
                    <div
                      key={i}
                      className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full text-sm font-medium"
                    >
                      {mood}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Music Genres */}
            {profile.musicGenres && profile.musicGenres.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3 text-gray-700 dark:text-gray-300">음악 장르</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.musicGenres.slice(0, 5).map((genre: string, i: number) => (
                    <div
                      key={i}
                      className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-sm font-medium text-blue-700 dark:text-blue-300"
                    >
                      {genre}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mood Keywords */}
            {profile.moodKeywords && profile.moodKeywords.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3 text-gray-700 dark:text-gray-300">무드 키워드</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.moodKeywords.map((keyword: string, i: number) => (
                    <div
                      key={i}
                      className="px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full text-sm font-medium text-yellow-700 dark:text-yellow-300"
                    >
                      {keyword}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Social Preferences */}
            {profile.socialSize && (
              <div>
                <h4 className="font-semibold mb-3 text-gray-700 dark:text-gray-300">사회적 선호</h4>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <p>👥 {profile.socialSize}</p>
                  {profile.drinkingStyle && <p>🍺 {profile.drinkingStyle}</p>}
                  {profile.cafePreference && <p>☕ 카페: {profile.cafePreference}</p>}
                </div>
              </div>
            )}
          </div>

          {/* Color Palette */}
          {profile.personalColors && profile.personalColors.length > 0 && (
            <div className="mt-6">
              <h4 className="font-semibold mb-3 text-gray-700 dark:text-gray-300">당신의 색상</h4>
              <div className="flex gap-3">
                {profile.personalColors.map((color: string, i: number) => (
                  <div key={i} className="flex-1">
                    <div
                      className="h-20 rounded-lg shadow-md border-2 border-white dark:border-gray-700"
                      style={{ backgroundColor: color }}
                    />
                    <div className="text-xs text-center mt-1 font-mono text-gray-600 dark:text-gray-400">
                      {color}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Compatible Users */}
        {compatibleUsers.length > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 mb-8 shadow-lg">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Users className="h-6 w-6 text-purple-500" />
              당신과 비슷한 취향의 사용자들
            </h3>

            <div className="space-y-4">
              {compatibleUsers.map((match: any, i: number) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {match.user?.name?.[0] || '?'}
                    </div>
                    <div>
                      <div className="font-semibold">{match.user?.name || 'Anonymous'}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {match.personaLabel || '음악 애호가'}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {match.compatibilityScore}%
                    </div>
                    <div className="text-xs text-gray-500">호환성</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA Buttons */}
        <div className="grid md:grid-cols-2 gap-4">
          <Button
            size="lg"
            onClick={() => router.push('/dashboard')}
            className="w-full"
          >
            대시보드로 이동
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: '내 음악적 취향 결과',
                  text: `나는 "${profile.personaLabel}"! 당신의 음악적 취향은?`,
                  url: window.location.origin + '/quiz',
                });
              } else {
                alert('공유 기능은 모바일에서 사용 가능합니다');
              }
            }}
            className="w-full"
          >
            <Share2 className="h-5 w-5 mr-2" />
            결과 공유하기
          </Button>
        </div>

        {/* Retry Quiz */}
        <div className="text-center mt-6">
          <button
            onClick={() => {
              if (confirm('퀴즈를 다시 하시겠습니까? 현재 결과는 유지됩니다.')) {
                localStorage.removeItem('quizProgress');
                router.push('/quiz');
              }
            }}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-sm underline"
          >
            퀴즈 다시 하기
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-fall {
          animation: fall linear infinite;
        }
      `}</style>
    </div>
  );
}
