'use client';

import { useEffect, useState } from 'react';
import { getAllMatches, getMatchingStats, createMatch } from '@/lib/actions/matching';
import { getChatStats } from '@/lib/actions/chat';
import Button from '@/components/ui/Button';
import { Users, TrendingUp, MessageSquare, CheckCircle, XCircle, Clock, Plus } from 'lucide-react';

interface MatchStats {
  total: number;
  pending: number;
  accepted: number;
  rejected: number;
  averageScore: number;
}

interface ChatStats {
  totalChatRooms: number;
  activeChatRooms: number;
  totalMessages: number;
  recentMessages: number;
}

interface Match {
  id: string;
  matchScore: number;
  status: string;
  createdAt: string;
  initiator: {
    id: string;
    name: string | null;
    email: string;
    profile: {
      stageName: string;
      genres: string[];
      niches: string[];
    } | null;
  };
  receiver: {
    id: string;
    name: string | null;
    email: string;
    profile: {
      stageName: string;
      genres: string[];
      niches: string[];
    } | null;
  };
  sharedGenres: string[];
  sharedNiches: string[];
  matchReason: string | null;
}

export default function AdminMatchingPage() {
  const [matchStats, setMatchStats] = useState<MatchStats | null>(null);
  const [chatStats, setChatStats] = useState<ChatStats | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [filter]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [statsResult, chatStatsResult, matchesResult] = await Promise.all([
        getMatchingStats(),
        getChatStats(),
        getAllMatches({
          status: filter === 'all' ? undefined : filter,
          limit: 50,
        }),
      ]);

      if (statsResult.success && statsResult.stats) {
        setMatchStats(statsResult.stats);
      }

      if (chatStatsResult.success && chatStatsResult.stats) {
        setChatStats(chatStatsResult.stats);
      }

      if (matchesResult.success && matchesResult.matches) {
        setMatches(matchesResult.matches as Match[]);
      }
    } catch (error) {
      console.error('Load data error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'text-green-600 bg-green-50';
      case 'rejected':
        return 'text-red-600 bg-red-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">협업 매칭 관리</h1>
          <p className="text-gray-600 dark:text-gray-400">
            음악가들 간의 협업 매칭을 관리하고 모니터링합니다
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Matching Stats */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-1">{matchStats?.total || 0}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">총 매칭</p>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">대기중</span>
                <span className="font-medium">{matchStats?.pending || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">수락됨</span>
                <span className="font-medium text-green-600">{matchStats?.accepted || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">거절됨</span>
                <span className="font-medium text-red-600">{matchStats?.rejected || 0}</span>
              </div>
            </div>
          </div>

          {/* Average Score */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-1">
              {matchStats?.averageScore?.toFixed(1) || 0}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">평균 매칭 점수</p>
          </div>

          {/* Chat Rooms */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <MessageSquare className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-1">{chatStats?.activeChatRooms || 0}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">활성 채팅방</p>
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              총 {chatStats?.totalChatRooms || 0}개 채팅방
            </div>
          </div>

          {/* Messages */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <MessageSquare className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-1">{chatStats?.recentMessages || 0}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">최근 7일 메시지</p>
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              총 {chatStats?.totalMessages || 0}개 메시지
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant={filter === 'all' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                전체
              </Button>
              <Button
                variant={filter === 'pending' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilter('pending')}
              >
                대기중
              </Button>
              <Button
                variant={filter === 'accepted' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilter('accepted')}
              >
                수락됨
              </Button>
              <Button
                variant={filter === 'rejected' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilter('rejected')}
              >
                거절됨
              </Button>
            </div>
          </div>
        </div>

        {/* Matches List */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold">매칭 목록</h2>
          </div>

          {isLoading ? (
            <div className="p-8 text-center text-gray-500">로딩 중...</div>
          ) : matches.length === 0 ? (
            <div className="p-8 text-center text-gray-500">매칭이 없습니다</div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {matches.map((match) => (
                <div key={match.id} className="p-6 hover:bg-gray-50 dark:hover:bg-slate-700/50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <div className="font-medium">
                            {match.initiator.profile?.stageName || match.initiator.name}
                          </div>
                          <span className="text-gray-400">↔</span>
                          <div className="font-medium">
                            {match.receiver.profile?.stageName || match.receiver.name}
                          </div>
                        </div>
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getStatusColor(match.status)}`}>
                          {getStatusIcon(match.status)}
                          <span className="capitalize">{match.status}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            매칭 점수
                          </div>
                          <div className="font-semibold text-lg">
                            {match.matchScore.toFixed(0)}점
                          </div>
                        </div>

                        {match.sharedGenres.length > 0 && (
                          <div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                              공통 장르
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {match.sharedGenres.slice(0, 3).map((genre, i) => (
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
                            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                              공통 니치
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {match.sharedNiches.slice(0, 3).map((niche, i) => (
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
                      </div>

                      {match.matchReason && (
                        <div className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                          {match.matchReason}
                        </div>
                      )}

                      <div className="text-xs text-gray-500 mt-2">
                        생성일: {new Date(match.createdAt).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
