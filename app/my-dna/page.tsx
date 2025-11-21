'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getMusicalDNA, generateDNAInsights } from '@/lib/actions/dna';
import SimilarMusicians from '@/components/dna/SimilarMusicians';
import Button from '@/components/ui/Button';
import {
  Music,
  Heart,
  Sparkles,
  Users,
  Palette,
  Lightbulb,
  Target,
  TrendingUp,
  Edit,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

interface Profile {
  id: string;
  userId: string;
  stageName: string;
  bio: string | null;
  avatar: string | null;
  genres: string[];
  niches: string[];
  instruments: string[];
  emotionalTags: string[];
  situationalTags: string[];
  sensoryTags: string[];
  influences: string[];
  inspirationSources: string[];
  musicOriginStory: string | null;
  artisticMission: string | null;
  uniqueValue: string | null;
  collaborationStyle: string | null;
  lookingForCollab: boolean;
  collabInterests: string[];
  currentExploration: string | null;
  profileCompleteness: number;
}

interface Insight {
  category: string;
  text: string;
  icon: string;
}

export default function MyDNAPage() {
  const router = useRouter();
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [completeness, setCompleteness] = useState(0);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'similar'>('overview');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentUserId(user.userId);
      loadDNA(user.userId);
    } else {
      router.push('/auth/login');
    }
  }, []);

  const loadDNA = async (userId: string) => {
    setIsLoading(true);
    try {
      const [dnaResult, insightsResult] = await Promise.all([
        getMusicalDNA(userId),
        generateDNAInsights(userId),
      ]);

      if (dnaResult.success && dnaResult.profile) {
        setProfile(dnaResult.profile as Profile);
        setCompleteness(dnaResult.completeness || 0);

        // 완성도가 30% 미만이면 온보딩으로 리다이렉트
        if ((dnaResult.completeness || 0) < 30) {
          router.push('/onboarding');
          return;
        }
      }

      if (insightsResult.success && insightsResult.insights) {
        setInsights(insightsResult.insights as Insight[]);
      }
    } catch (error) {
      console.error('Load DNA error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">음악적 DNA를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">프로필을 찾을 수 없습니다</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            먼저 프로필을 완성해주세요
          </p>
          <Button onClick={() => router.push('/onboarding')}>
            프로필 만들기
          </Button>
        </div>
      </div>
    );
  }

  const getCompletenessColor = () => {
    if (completeness >= 70) return 'text-green-600 bg-green-100';
    if (completeness >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getCompletenessIcon = () => {
    if (completeness >= 70) return <CheckCircle className="h-6 w-6" />;
    return <AlertCircle className="h-6 w-6" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <Sparkles className="h-10 w-10 text-yellow-500" />
                내 음악적 DNA
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {profile.stageName}의 고유한 음악적 정체성
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push('/onboarding')}
            >
              <Edit className="h-4 w-4 mr-2" />
              프로필 수정
            </Button>
          </div>
        </div>

        {/* Completeness Banner */}
        <div className={`rounded-xl p-6 mb-8 ${getCompletenessColor()}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {getCompletenessIcon()}
              <div>
                <h3 className="font-bold text-lg">프로필 완성도: {completeness}%</h3>
                <p className="text-sm">
                  {completeness >= 70
                    ? '훌륭해요! 당신의 음악적 DNA가 잘 표현되고 있습니다.'
                    : '프로필을 더 완성하면 더 정확한 매칭을 받을 수 있습니다.'}
                </p>
              </div>
            </div>
            <div className="w-32">
              <div className="w-full bg-white/30 rounded-full h-3">
                <div
                  className="bg-current rounded-full h-3 transition-all duration-500"
                  style={{ width: `${completeness}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 px-4 font-medium transition-colors ${
              activeTab === 'overview'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
            }`}
          >
            DNA 개요
          </button>
          <button
            onClick={() => setActiveTab('similar')}
            className={`pb-3 px-4 font-medium transition-colors ${
              activeTab === 'similar'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
            }`}
          >
            비슷한 뮤지션
          </button>
        </div>

        {activeTab === 'overview' ? (
          <>
            {/* Insights */}
            {insights.length > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 mb-8">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  음악적 인사이트
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {insights.map((insight, i) => (
                    <div
                      key={i}
                      className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{insight.icon}</span>
                        <div>
                          <h4 className="font-semibold mb-1">{insight.category}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {insight.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Main DNA Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Musical Identity */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Music className="h-5 w-5 text-blue-500" />
                  음악적 정체성
                </h3>
                <div className="space-y-4">
                  {profile.genres.length > 0 && (
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">
                        장르
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {profile.genres.map((genre, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {profile.niches.length > 0 && (
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">
                        니치
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {profile.niches.map((niche, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium"
                          >
                            {niche}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {profile.instruments.length > 0 && (
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">
                        악기
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {profile.instruments.map((instrument, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm font-medium"
                          >
                            {instrument}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Emotional Palette */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Heart className="h-5 w-5 text-pink-500" />
                  감정 팔레트
                </h3>
                <div className="space-y-4">
                  {profile.emotionalTags.length > 0 && (
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">
                        감정 태그
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {profile.emotionalTags.map((tag, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300 rounded-full text-sm font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {profile.situationalTags.length > 0 && (
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">
                        상황 태그
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {profile.situationalTags.map((tag, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded-full text-sm font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {profile.sensoryTags.length > 0 && (
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">
                        감각 태그
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {profile.sensoryTags.map((tag, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 rounded-full text-sm font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Influences & Inspiration */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Palette className="h-5 w-5 text-purple-500" />
                  영향과 영감
                </h3>
                <div className="space-y-4">
                  {profile.influences.length > 0 && (
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">
                        영향받은 아티스트
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {profile.influences.map((influence, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium"
                          >
                            {influence}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {profile.inspirationSources.length > 0 && (
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">
                        영감 소스
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {profile.inspirationSources.map((source, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded-full text-sm font-medium"
                          >
                            {source}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Collaboration */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-500" />
                  협업 성향
                </h3>
                <div className="space-y-4">
                  {profile.collaborationStyle && (
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">
                        협업 스타일
                      </label>
                      <p className="text-sm">{profile.collaborationStyle}</p>
                    </div>
                  )}

                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">
                      협업 의지
                    </label>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        profile.lookingForCollab
                          ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {profile.lookingForCollab ? '협업 원함' : '협업 안 함'}
                    </span>
                  </div>

                  {profile.collabInterests.length > 0 && (
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">
                        협업 관심사
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {profile.collabInterests.map((interest, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300 rounded-full text-sm font-medium"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Stories */}
            <div className="grid grid-cols-1 gap-6">
              {profile.musicOriginStory && (
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-500" />
                    음악 기원 스토리
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {profile.musicOriginStory}
                  </p>
                </div>
              )}

              {profile.artisticMission && (
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-purple-500" />
                    예술적 미션
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {profile.artisticMission}
                  </p>
                </div>
              )}

              {profile.uniqueValue && (
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-yellow-500" />
                    독특한 가치
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {profile.uniqueValue}
                  </p>
                </div>
              )}

              {profile.currentExploration && (
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-orange-500" />
                    현재 탐구 중
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {profile.currentExploration}
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Similar Musicians Tab */
          <div>
            <SimilarMusicians currentUserId={currentUserId} limit={12} />
          </div>
        )}
      </div>
    </div>
  );
}
