import { Suspense } from 'react';
import Link from 'next/link';
import { Music, Search, Filter } from 'lucide-react';
import MusicianCard from '@/components/musicians/MusicianCard';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

// Mock data - 실제로는 데이터베이스에서 가져옴
const mockMusicians = [
  {
    id: '1',
    stageName: '김소리',
    avatar: undefined,
    bio: '네오 클래시컬과 앰비언트를 넘나드는 피아니스트. 영화 음악 같은 사운드스케이프를 만듭니다.',
    genres: ['Classical', 'Ambient', 'Cinematic'],
    niches: ['Neo-Classical Fusion', 'Cinematic Piano'],
    followerCount: 1247,
  },
  {
    id: '2',
    stageName: 'Electronic Dreams',
    avatar: undefined,
    bio: '80년대 신스팝과 현대 일렉트로닉의 조화. 레트로 퓨처리즘의 세계로.',
    genres: ['Electronic', 'Synthpop', 'Retro'],
    niches: ['Retro Futurism', 'Analog Synth'],
    followerCount: 3521,
  },
  {
    id: '3',
    stageName: '박민재',
    avatar: undefined,
    bio: '전통 국악 악기와 재즈의 실험적 만남. 한국적 감성의 재해석.',
    genres: ['Jazz', 'Korean Traditional', 'Fusion'],
    niches: ['K-Jazz Fusion', 'Traditional Meets Modern'],
    followerCount: 892,
  },
  {
    id: '4',
    stageName: 'Luna Beats',
    avatar: undefined,
    bio: '로파이 힙합과 칠웨이브. 공부할 때, 일할 때, 쉴 때 함께하는 음악.',
    genres: ['Lo-fi', 'Hip Hop', 'Chillwave'],
    niches: ['Study Beats', 'Chill Production'],
    followerCount: 5634,
  },
];

const genres = [
  'Classical',
  'Electronic',
  'Jazz',
  'Ambient',
  'Rock',
  'Hip Hop',
  'Folk',
  'Experimental',
];

export default function DiscoverPage() {
  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-50 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Music className="h-8 w-8 text-primary-600" />
              <span className="font-bold text-xl">Niche</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/tutorials" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">
                튜토리얼
              </Link>
              <Link href="/auth/login">
                <Button variant="outline" size="sm">
                  로그인
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm">
                  시작하기
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            진짜 뮤지션을 발견하세요
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            AI가 아닌, 사람이 만든 진정한 음악
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="px-4 sm:px-6 lg:px-8 mb-12">
        <div className="max-w-7xl mx-auto">
          <Card className="p-6">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="뮤지션, 장르, 니치 검색..."
                  className="pl-10"
                />
              </div>

              {/* Genre Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-slate-400" />
                <select className="flex-1 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="">모든 장르</option>
                  {genres.map((genre) => (
                    <option key={genre} value={genre}>
                      {genre}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Musicians Grid */}
      <div className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">추천 뮤지션</h2>
            <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
              <span>{mockMusicians.length}명의 뮤지션</span>
            </div>
          </div>

          <Suspense fallback={<div>Loading...</div>}>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockMusicians.map((musician) => (
                <MusicianCard key={musician.id} {...musician} />
              ))}
            </div>
          </Suspense>

          {/* Load More */}
          <div className="mt-12 text-center">
            <Button variant="outline" size="lg">
              더 보기
            </Button>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            당신도 뮤지션이신가요?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            당신의 음악을 세상과 공유하고 진정한 팬을 만나보세요
          </p>
          <Link href="/auth/signup">
            <Button variant="secondary" size="lg">
              지금 가입하기
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
