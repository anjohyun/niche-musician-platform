'use client';

import { useEffect, useState } from 'react';
import { findSimilarMusicians } from '@/lib/actions/dna';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { Users, Heart, Music, Sparkles } from 'lucide-react';

interface MusicianProfile {
  userId: string;
  stageName: string;
  bio: string | null;
  avatar: string | null;
  genres: string[];
  niches: string[];
  emotionalTags: string[];
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

interface SimilarMusician {
  profile: MusicianProfile;
  similarityScore: number;
  sharedGenres: string[];
  sharedNiches: string[];
  sharedEmotions: string[];
  sharedInfluences: string[];
}

interface SimilarMusiciansProps {
  currentUserId: string;
  limit?: number;
}

export default function SimilarMusicians({ currentUserId, limit = 12 }: SimilarMusiciansProps) {
  const router = useRouter();
  const [musicians, setMusicians] = useState<SimilarMusician[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSimilarMusicians();
  }, [currentUserId]);

  const loadSimilarMusicians = async () => {
    setIsLoading(true);
    try {
      const result = await findSimilarMusicians(currentUserId, limit);
      if (result.success && result.musicians) {
        setMusicians(result.musicians as SimilarMusician[]);
      }
    } catch (error) {
      console.error('Load similar musicians error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">비슷한 뮤지션을 찾는 중...</p>
      </div>
    );
  }

  if (musicians.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl">
        <Users className="h-16 w-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-semibold mb-2">비슷한 뮤지션을 찾지 못했습니다</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          음악적 DNA를 더 자세히 작성하면 더 많은 뮤지션을 찾을 수 있습니다
        </p>
        <Button onClick={() => router.push('/onboarding')}>
          프로필 완성하기
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-yellow-500" />
            나와 비슷한 뮤지션들
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {musicians.length}명의 뮤지션이 당신과 비슷한 음악적 DNA를 가지고 있습니다
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {musicians.map((item) => (
          <div
            key={item.profile.userId}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
            onClick={() => router.push(`/profile/${item.profile.userId}`)}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-semibold flex-shrink-0">
                    {item.profile.stageName[0]}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-lg truncate">
                      {item.profile.stageName}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.profile.user.name}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end flex-shrink-0 ml-2">
                  <div className="flex items-center gap-1 text-pink-500 font-bold text-xl">
                    <Heart className="h-5 w-5 fill-current" />
                    {item.similarityScore}
                  </div>
                  <span className="text-xs text-gray-500">유사도</span>
                </div>
              </div>

              {/* Bio */}
              {item.profile.bio && (
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
                  {item.profile.bio}
                </p>
              )}

              {/* Shared Elements */}
              <div className="space-y-3">
                {item.sharedGenres.length > 0 && (
                  <div>
                    <div className="text-xs text-gray-500 mb-1.5 flex items-center gap-1">
                      <Music className="h-3 w-3" />
                      공통 장르
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {item.sharedGenres.slice(0, 3).map((genre, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium"
                        >
                          {genre}
                        </span>
                      ))}
                      {item.sharedGenres.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-xs">
                          +{item.sharedGenres.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {item.sharedNiches.length > 0 && (
                  <div>
                    <div className="text-xs text-gray-500 mb-1.5">공통 니치</div>
                    <div className="flex flex-wrap gap-1">
                      {item.sharedNiches.slice(0, 2).map((niche, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium"
                        >
                          {niche}
                        </span>
                      ))}
                      {item.sharedNiches.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-xs">
                          +{item.sharedNiches.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {item.sharedEmotions.length > 0 && (
                  <div>
                    <div className="text-xs text-gray-500 mb-1.5">공통 감정</div>
                    <div className="flex flex-wrap gap-1">
                      {item.sharedEmotions.slice(0, 3).map((emotion, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300 rounded-full text-xs font-medium"
                        >
                          {emotion}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/profile/${item.profile.userId}`);
                  }}
                >
                  프로필 보기
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
