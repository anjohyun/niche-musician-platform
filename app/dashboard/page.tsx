'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import UploadForm from '@/components/tracks/UploadForm';
import { getTracks } from '@/lib/actions/tracks';
import AudioPlayer from '@/components/tracks/AudioPlayer';
import { formatNumber, formatRelativeTime } from '@/lib/utils';
import { Music, Play, Heart, MessageCircle, LogOut } from 'lucide-react';

interface Track {
  id: string;
  title: string;
  description?: string;
  audioUrl: string;
  coverImage?: string;
  playCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: Date;
  user: {
    profile: {
      stageName: string;
    } | null;
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/auth/login');
      return;
    }

    setUser(JSON.parse(userData));
    loadTracks();
  }, [router]);

  const loadTracks = async () => {
    try {
      const result = await getTracks();
      if (result.success && result.tracks) {
        setTracks(result.tracks);
      }
    } catch (error) {
      console.error('Failed to load tracks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  if (!user || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-50 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Music className="h-8 w-8 text-primary-600" />
              <span className="font-bold text-xl">Niche</span>
            </div>
            <div className="flex items-center space-x-4">
              {user.name && (
                <span className="text-slate-700 dark:text-slate-300">
                  {user.name}
                </span>
              )}
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">대시보드</h1>
          <p className="text-slate-600 dark:text-slate-400">
            음악을 업로드하고 관리하세요
          </p>
        </div>

        {/* Upload Form */}
        <div className="mb-12">
          <UploadForm userId={user.userId} onSuccess={loadTracks} />
        </div>

        {/* Tracks Section */}
        <div>
          <h2 className="text-2xl font-bold mb-6">모든 음악</h2>
          {tracks.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-12 text-center">
              <Music className="w-16 h-16 mx-auto mb-4 text-slate-400" />
              <h3 className="text-xl font-bold mb-2">아직 음악이 없습니다</h3>
              <p className="text-slate-600 dark:text-slate-400">
                첫 번째 음악을 업로드해보세요
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tracks.map((track) => (
                <div
                  key={track.id}
                  className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6"
                >
                  <div className="flex items-start space-x-4 mb-4">
                    {track.coverImage && (
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700 flex-shrink-0">
                        <img
                          src={track.coverImage}
                          alt={track.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-1 truncate">
                        {track.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                        {track.user.profile?.stageName || 'Unknown Artist'}
                      </p>
                      <div className="flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center">
                          <Play className="w-3 h-3 mr-1" />
                          {formatNumber(track.playCount)}
                        </span>
                        <span className="flex items-center">
                          <Heart className="w-3 h-3 mr-1" />
                          {formatNumber(track.likeCount)}
                        </span>
                        <span className="flex items-center">
                          <MessageCircle className="w-3 h-3 mr-1" />
                          {formatNumber(track.commentCount)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <AudioPlayer
                    src={track.audioUrl}
                    title={track.title}
                    artist={track.user.profile?.stageName}
                    coverImage={track.coverImage || undefined}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

