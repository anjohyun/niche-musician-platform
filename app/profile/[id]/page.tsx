import Image from 'next/image';
import { getMusicianProfile, getMusicianTracks } from '@/lib/actions/profile';
import MusicianCard from '@/components/musicians/MusicianCard';
import AudioPlayer from '@/components/tracks/AudioPlayer';
import { formatNumber } from '@/lib/utils';
import { Music, Users, Play, Download, Share2, Heart, MessageCircle } from 'lucide-react';

interface ProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { id } = await params;

  const profileResult = await getMusicianProfile(id);
  const tracksResult = await getMusicianTracks(id);

  if (profileResult.error || !profileResult.success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">프로필을 찾을 수 없습니다</h1>
          <p className="text-slate-600 dark:text-slate-400">{profileResult.error}</p>
        </div>
      </div>
    );
  }

  const { user } = profileResult;
  const tracks = tracksResult.success ? tracksResult.tracks : [];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-50 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <a href="/" className="flex items-center space-x-2">
              <Music className="h-8 w-8 text-primary-600" />
              <span className="font-bold text-xl">Niche</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Cover Image */}
      {user.profile?.coverImage && (
        <div className="relative h-64 md:h-80 bg-gradient-to-br from-primary-600 to-primary-700">
          <Image
            src={user.profile.coverImage}
            alt={`${user.profile.stageName} cover`}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Sidebar */}
          <aside className="md:w-80 flex-shrink-0">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 sticky top-24">
              {/* Profile Info */}
              <div className="text-center mb-6">
                <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700">
                  {user.profile?.avatar ? (
                    <Image
                      src={user.profile.avatar}
                      alt={user.profile.stageName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Music className="w-12 h-12 text-slate-400" />
                    </div>
                  )}
                </div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  {user.profile?.stageName || user.name}
                </h1>
                {user.profile?.location && (
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    📍 {user.profile.location}
                  </p>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">
                    {formatNumber(user._count.tracks)}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">트랙</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">
                    {formatNumber(user._count.followers)}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">팔로워</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">
                    {formatNumber(user._count.following)}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">팔로잉</div>
                </div>
              </div>

              {/* Bio */}
              {user.profile?.bio && (
                <div className="mb-6">
                  <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                    {user.profile.bio}
                  </p>
                </div>
              )}

              {/* Genres */}
              {user.profile?.genres && user.profile.genres.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    장르
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {user.profile.genres.map((genre) => (
                      <span
                        key={genre}
                        className="px-3 py-1 text-xs font-medium bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 rounded-full"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Niches */}
              {user.profile?.niches && user.profile.niches.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    니치
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {user.profile.niches.map((niche) => (
                      <span
                        key={niche}
                        className="px-3 py-1 text-xs bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 rounded-full"
                      >
                        {niche}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Website */}
              {user.profile?.website && (
                <a
                  href={user.profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  웹사이트 방문
                </a>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 space-y-6">
            {/* 섹션 1: 음악적 정체성 */}
            {(user.profile?.musicOriginStory || user.profile?.artisticMission || user.profile?.uniqueValue) && (
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
                <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">음악적 정체성</h2>
                
                {user.profile.musicOriginStory && (
                  <div className="mb-6">
                    <h3 className="font-semibold mb-2 text-slate-900 dark:text-white">기원 스토리</h3>
                    <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                      {user.profile.musicOriginStory}
                    </p>
                  </div>
                )}

                {user.profile.artisticMission && (
                  <div className="mb-6">
                    <h3 className="font-semibold mb-2 text-slate-900 dark:text-white">음악 철학</h3>
                    <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                      {user.profile.artisticMission}
                    </p>
                  </div>
                )}

                {user.profile.uniqueValue && (
                  <div>
                    <h3 className="font-semibold mb-2 text-slate-900 dark:text-white">내 음악을 들어야 하는 이유</h3>
                    <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                      {user.profile.uniqueValue}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* 섹션 2: 음악적 DNA 시각화 */}
            {(user.profile?.emotionalTags?.length > 0 || user.profile?.situationalTags?.length > 0 || user.profile?.sensoryTags?.length > 0) && (
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
                <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">음악적 DNA</h2>
                
                {user.profile.emotionalTags && user.profile.emotionalTags.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2 text-slate-900 dark:text-white">감정 팔레트</h3>
                    <div className="flex flex-wrap gap-2">
                      {user.profile.emotionalTags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 text-sm bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {user.profile.situationalTags && user.profile.situationalTags.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2 text-slate-900 dark:text-white">상황</h3>
                    <div className="flex flex-wrap gap-2">
                      {user.profile.situationalTags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 text-sm bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {user.profile.sensoryTags && user.profile.sensoryTags.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2 text-slate-900 dark:text-white">감각</h3>
                    <div className="flex flex-wrap gap-2">
                      {user.profile.sensoryTags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 text-sm bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 섹션 3: 영향과 영감 */}
            {(user.profile?.influences?.length > 0 || user.profile?.inspirationSources?.length > 0) && (
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
                <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">영향과 영감</h2>
                
                {user.profile.influences && user.profile.influences.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2 text-slate-900 dark:text-white">영향 받은 아티스트</h3>
                    <div className="flex flex-wrap gap-2">
                      {user.profile.influences.map((influence) => (
                        <span
                          key={influence}
                          className="px-3 py-1 text-sm bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded-full"
                        >
                          {influence}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {user.profile.inspirationSources && user.profile.inspirationSources.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2 text-slate-900 dark:text-white">영감의 원천</h3>
                    <div className="flex flex-wrap gap-2">
                      {user.profile.inspirationSources.map((source) => (
                        <span
                          key={source}
                          className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 rounded-full"
                        >
                          {source}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 섹션 4: 창작 과정 */}
            {(user.profile?.creativeProcess || user.profile?.toolsAndGear?.length > 0) && (
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
                <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">창작 과정</h2>
                
                {user.profile.creativeProcess && (
                  <div className="mb-4">
                    <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                      {user.profile.creativeProcess}
                    </p>
                  </div>
                )}

                {user.profile.toolsAndGear && user.profile.toolsAndGear.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2 text-slate-900 dark:text-white">사용 도구</h3>
                    <div className="flex flex-wrap gap-2">
                      {user.profile.toolsAndGear.map((tool) => (
                        <span
                          key={tool}
                          className="px-3 py-1 text-sm bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 rounded-full"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 섹션 5: 트랙 컬렉션 */}
            {tracks.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-12 text-center">
                <Music className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                <h2 className="text-xl font-bold mb-2">아직 업로드된 음악이 없습니다</h2>
                <p className="text-slate-600 dark:text-slate-400">
                  첫 번째 음악을 업로드해보세요
                </p>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
                <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">음악 작품</h2>
                <div className="space-y-6">
                  {tracks.map((track) => (
                    <div
                      key={track.id}
                      className="border-b border-slate-200 dark:border-slate-700 pb-6 last:border-0 last:pb-0"
                    >
                      <div className="flex items-start space-x-4 mb-4">
                        {/* Cover Image */}
                        {track.coverImage && (
                          <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700 flex-shrink-0">
                            <Image
                              src={track.coverImage}
                              alt={track.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}

                        {/* Track Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                            {track.title}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                            {user.profile?.stageName || user.name}
                          </p>
                          {track.description && (
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                              {track.description}
                            </p>
                          )}
                          
                          {/* Tags */}
                          {track.tags && track.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {track.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-1 text-xs bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Stats */}
                          <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                            <span className="flex items-center">
                              <Play className="w-4 h-4 mr-1" />
                              {formatNumber(track.playCount)}
                            </span>
                            <span className="flex items-center">
                              <Heart className="w-4 h-4 mr-1" />
                              {formatNumber(track.likeCount)}
                            </span>
                            <span className="flex items-center">
                              <MessageCircle className="w-4 h-4 mr-1" />
                              {formatNumber(track.commentCount)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Audio Player */}
                      <AudioPlayer
                        src={track.audioUrl}
                        title={track.title}
                        artist={user.profile?.stageName || user.name}
                        coverImage={track.coverImage || undefined}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

