'use client';

import { useEffect, useState } from 'react';
import { findMatches, getUserMatches, updateMatchStatus } from '@/lib/actions/matching';
import Button from '@/components/ui/Button';
import { Users, CheckCircle, XCircle, Music, Heart, Sparkles, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Match {
  profile: {
    userId: string;
    stageName: string;
    bio: string | null;
    avatar: string | null;
    genres: string[];
    niches: string[];
    emotionalTags: string[];
    lookingForCollab: boolean;
    collaborationStyle: string | null;
    user: {
      id: string;
      name: string | null;
      email: string;
      image: string | null;
    };
  };
  score: number;
  sharedGenres: string[];
  sharedNiches: string[];
  sharedEmotions: string[];
}

interface UserMatch {
  id: string;
  status: string;
  matchScore: number;
  sharedGenres: string[];
  sharedNiches: string[];
  matchReason: string | null;
  createdAt: string;
  initiator: {
    id: string;
    name: string | null;
    profile: {
      stageName: string;
      avatar: string | null;
      genres: string[];
    } | null;
  };
  receiver: {
    id: string;
    name: string | null;
    profile: {
      stageName: string;
      avatar: string | null;
      genres: string[];
    } | null;
  };
}

export default function MatchingPage() {
  const router = useRouter();
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [suggestedMatches, setSuggestedMatches] = useState<Match[]>([]);
  const [userMatches, setUserMatches] = useState<UserMatch[]>([]);
  const [activeTab, setActiveTab] = useState<'discover' | 'matches'>('discover');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentUserId(user.userId);
      loadData(user.userId);
    } else {
      window.location.href = '/auth/login';
    }
  }, []);

  const loadData = async (userId: string) => {
    setIsLoading(true);
    try {
      const [matchesResult, userMatchesResult] = await Promise.all([
        findMatches(userId, 10),
        getUserMatches(userId),
      ]);

      if (matchesResult.success && matchesResult.matches) {
        setSuggestedMatches(matchesResult.matches as Match[]);
      }

      if (userMatchesResult.success && userMatchesResult.matches) {
        setUserMatches(userMatchesResult.matches as UserMatch[]);
      }
    } catch (error) {
      console.error('Load data error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptMatch = async (matchId: string) => {
    try {
      const result = await updateMatchStatus(matchId, 'accepted');
      if (result.success) {
        // 매칭 목록 새로고침
        await loadData(currentUserId);
        // 채팅방으로 이동
        router.push('/chat');
      }
    } catch (error) {
      console.error('Accept match error:', error);
    }
  };

  const handleRejectMatch = async (matchId: string) => {
    try {
      const result = await updateMatchStatus(matchId, 'rejected');
      if (result.success) {
        // 매칭 목록 새로고침
        await loadData(currentUserId);
      }
    } catch (error) {
      console.error('Reject match error:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
            <CheckCircle className="h-4 w-4" />
            수락됨
          </span>
        );
      case 'rejected':
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
            <XCircle className="h-4 w-4" />
            거절됨
          </span>
        );
      case 'pending':
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
            대기중
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-yellow-500" />
            협업 매칭
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            당신과 잘 맞는 뮤지션을 찾아보세요
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('discover')}
            className={`pb-3 px-4 font-medium transition-colors ${
              activeTab === 'discover'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
            }`}
          >
            추천 매칭
          </button>
          <button
            onClick={() => setActiveTab('matches')}
            className={`pb-3 px-4 font-medium transition-colors ${
              activeTab === 'matches'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
            }`}
          >
            내 매칭 ({userMatches.filter((m) => m.status === 'pending').length})
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-gray-500">로딩 중...</div>
        ) : activeTab === 'discover' ? (
          /* Suggested Matches */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {suggestedMatches.length === 0 ? (
              <div className="col-span-2 text-center py-12 text-gray-500">
                <Users className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <p className="text-lg mb-2">추천 매칭이 없습니다</p>
                <p className="text-sm">
                  프로필을 완성하고 협업 관심사를 설정해보세요
                </p>
              </div>
            ) : (
              suggestedMatches.map((match) => (
                <div
                  key={match.profile.userId}
                  className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-semibold">
                          {match.profile.stageName[0]}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">
                            {match.profile.stageName}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {match.profile.collaborationStyle || '협업 스타일 미설정'}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-1 text-yellow-500 font-bold text-2xl">
                          <Heart className="h-6 w-6" />
                          {match.score}
                        </div>
                        <span className="text-xs text-gray-500">매칭 점수</span>
                      </div>
                    </div>

                    {/* Bio */}
                    {match.profile.bio && (
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
                        {match.profile.bio}
                      </p>
                    )}

                    {/* Shared Tags */}
                    <div className="space-y-3 mb-4">
                      {match.sharedGenres.length > 0 && (
                        <div>
                          <div className="text-xs text-gray-500 mb-1">공통 장르</div>
                          <div className="flex flex-wrap gap-1">
                            {match.sharedGenres.map((genre, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-xs"
                              >
                                {genre}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {match.sharedNiches.length > 0 && (
                        <div>
                          <div className="text-xs text-gray-500 mb-1">공통 니치</div>
                          <div className="flex flex-wrap gap-1">
                            {match.sharedNiches.map((niche, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded text-xs"
                              >
                                {niche}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {match.sharedEmotions.length > 0 && (
                        <div>
                          <div className="text-xs text-gray-500 mb-1">공통 감정</div>
                          <div className="flex flex-wrap gap-1">
                            {match.sharedEmotions.map((emotion, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300 rounded text-xs"
                              >
                                {emotion}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() =>
                          router.push(`/profile/${match.profile.userId}`)
                        }
                      >
                        프로필 보기
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          // TODO: 매칭 요청 보내기
                          alert('매칭 요청 기능은 곧 구현됩니다');
                        }}
                      >
                        <Music className="h-4 w-4 mr-1" />
                        협업 제안
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          /* User Matches */
          <div className="space-y-4">
            {userMatches.length === 0 ? (
              <div className="text-center py-12 text-gray-500 bg-white dark:bg-slate-800 rounded-xl">
                <Users className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <p className="text-lg">아직 매칭이 없습니다</p>
              </div>
            ) : (
              userMatches.map((match) => {
                const isInitiator = match.initiator.id === currentUserId;
                const otherUser = isInitiator ? match.receiver : match.initiator;

                return (
                  <div
                    key={match.id}
                    className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                          {otherUser.profile?.stageName?.[0] ||
                            otherUser.name?.[0] ||
                            '?'}
                        </div>
                        <div>
                          <h3 className="font-bold">
                            {otherUser.profile?.stageName || otherUser.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            매칭 점수: {match.matchScore}점
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(match.status)}
                    </div>

                    {match.sharedGenres.length > 0 && (
                      <div className="mb-3">
                        <div className="text-xs text-gray-500 mb-1">공통 장르</div>
                        <div className="flex flex-wrap gap-1">
                          {match.sharedGenres.map((genre, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-xs"
                            >
                              {genre}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {match.status === 'pending' && !isInitiator && (
                      <div className="flex gap-2 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRejectMatch(match.id)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          거절
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleAcceptMatch(match.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          수락
                        </Button>
                      </div>
                    )}

                    {match.status === 'accepted' && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => router.push('/chat')}
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        채팅하기
                      </Button>
                    )}

                    <div className="text-xs text-gray-500 mt-4">
                      {new Date(match.createdAt).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
