'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { Music, Sparkles, Users, BookOpen } from "lucide-react";
import MusicalIdentityVisualizer from "@/components/profile/MusicalIdentityVisualizer";
import MusicalDNACard from "@/components/musicians/MusicalDNACard";
import { getMusicalDNA } from "@/lib/actions/dna";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkUserStatus();
  }, []);

  const checkUserStatus = async () => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        setIsLoggedIn(true);

        // 프로필 완성도 확인
        const result = await getMusicalDNA(user.userId);
        if (result.success) {
          setIsProfileComplete(result.isComplete || false);
        }
      }
    } catch (error) {
      console.error('Check user status error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <main className="flex min-h-screen flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-50 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Music className="h-8 w-8 text-primary-600" />
              <span className="font-bold text-xl">Niche</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/discover" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">
                발견하기
              </Link>
              <Link href="/tutorials" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">
                튜토리얼
              </Link>
              <Link href="/auth/login" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">
                로그인
              </Link>
              <Link href="/auth/signup" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                시작하기
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
            당신만의 음악 정체성을
            <br />
            세상에 알리세요
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-12 max-w-3xl mx-auto">
            AI가 범람하는 시대, 진짜 아티스트의 가치는 더욱 빛납니다.
            <br />
            당신의 독특함을 발견하고 진정한 팬과 연결되는 여정을 시작하세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isLoading && (
              <>
                {isLoggedIn && isProfileComplete ? (
                  <>
                    <Link href="/my-dna" className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl">
                      내 음악적 DNA 보기
                    </Link>
                    <Link href="/matching" className="bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl">
                      협업 매칭 찾기
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href={isLoggedIn ? "/onboarding" : "/auth/signup"} className="bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl">
                      {isLoggedIn ? '프로필 완성하기' : '무료로 시작하기'}
                    </Link>
                    <Link href="/discover" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700">
                      뮤지션 둘러보기
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            당신의 음악 여정을 위한 완벽한 파트너
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            {/* Feature 1 */}
            <div className="text-center">
              <div className="bg-primary-100 dark:bg-primary-900/30 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Sparkles className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">정체성 탐색</h3>
              <p className="text-slate-600 dark:text-slate-400">
                AI 기반 분석으로 당신만의 독특한 음악적 정체성을 발견하고 강화하세요.
                니치 시장을 찾아 차별화된 포지셔닝을 구축합니다.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center">
              <div className="bg-primary-100 dark:bg-primary-900/30 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <BookOpen className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">실전 교육</h3>
              <p className="text-slate-600 dark:text-slate-400">
                최신 AI 도구를 윤리적으로 활용하는 방법부터 쇼케이스 비디오 제작까지.
                실무에 바로 적용 가능한 튜토리얼을 제공합니다.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center">
              <div className="bg-primary-100 dark:bg-primary-900/30 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">진정한 연결</h3>
              <p className="text-slate-600 dark:text-slate-400">
                알고리즘이 아닌 큐레이션으로. 당신의 음악을 진정으로 이해하고
                사랑할 팬들과 직접 연결됩니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive DNA Builder Preview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-primary-50/30 to-slate-50 dark:from-slate-900 dark:via-primary-950/30 dark:to-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              당신만의 음악적 DNA를 만들어보세요
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              8단계의 인터랙티브한 프로세스로 당신의 음악적 정체성을 탐색하세요
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Musical DNA Card Example */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-center">완성 예시</h3>
              <MusicalDNACard
                stageName="Midnight Echoes"
                artisticMission="어둠 속에서 피어나는 감성을 음악으로 표현합니다"
                uniqueValue="클래식 피아노와 현대 일렉트로닉의 독특한 조화로 깊은 밤의 감성을 전달합니다"
                emotionalTags={["melancholic", "contemplative", "peaceful"]}
                situationalTags={["밤", "혼자 있을 때", "비 오는 날"]}
                sensoryTags={["차가운", "부드러운", "은은한"]}
                influences={["Ludovico Einaudi", "Ólafur Arnalds", "Nils Frahm"]}
                collaborationStyle="느린 템포, 감성적인 아티스트와 작업 선호"
                lookingForCollab={true}
              />
            </div>

            {/* Musical Identity Visualizer Example */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-center">음악적 정체성 시각화</h3>
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
                <MusicalIdentityVisualizer
                  emotionalTags={["melancholic", "euphoric", "contemplative", "peaceful"]}
                  sensoryTags={["따뜻한", "부드러운", "차가운", "밝은"]}
                  situationalTags={["새벽", "혼자 있을 때", "드라이브", "카페"]}
                  influences={["Radiohead", "Bon Iver", "Sigur Rós"]}
                  toolsAndGear={["Ableton Live", "Prophet-5", "Neumann U87", "Strymon BigSky"]}
                />
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 text-center shadow-md hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-3">🎯</div>
              <h4 className="font-semibold mb-2">8단계 프로세스</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">체계적인 탐색으로 정체성 발견</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 text-center shadow-md hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-3">💾</div>
              <h4 className="font-semibold mb-2">자동 저장</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">언제든 중단하고 다시 시작</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 text-center shadow-md hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-3">👁️</div>
              <h4 className="font-semibold mb-2">실시간 미리보기</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">변경사항을 즉시 확인</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 text-center shadow-md hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-3">🎨</div>
              <h4 className="font-semibold mb-2">인터랙티브</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">재미있고 직관적인 UI</p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            {!isLoading && (
              <>
                {isLoggedIn && isProfileComplete ? (
                  <Link
                    href="/my-dna"
                    className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-green-700 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    <Sparkles className="w-5 h-5" />
                    내 음악적 DNA 확인하기
                  </Link>
                ) : (
                  <Link
                    href={isLoggedIn ? "/onboarding" : "/auth/signup"}
                    className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary-700 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    <Sparkles className="w-5 h-5" />
                    내 음악적 DNA 만들기
                  </Link>
                )}
                <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                  {isLoggedIn && isProfileComplete
                    ? '당신의 음악적 DNA와 비슷한 뮤지션들을 만나보세요'
                    : '5-10분 소요 • 무료'}
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            심플함 속의 본질
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
            복잡한 기능 대신 당신에게 정말 필요한 것만.
            <br />
            화려한 알고리즘 대신 진정한 가치를.
          </p>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            <br />
            우리는 본질에 집중하여 최고의 경험을 만듭니다.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            지금 바로 시작하세요
          </h2>
          <p className="text-xl mb-8 opacity-90">
            당신의 음악이 세상에 닿을 준비가 되었다면
          </p>
          <Link href="/auth/signup" className="bg-white text-slate-600 hover:text-slate-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-slate-50 transition-colors inline-block shadow-lg hover:shadow-xl">
            무료로 가입하기
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Music className="h-6 w-6" />
            <span className="font-bold text-lg">Niche Musician Platform</span>
          </div>
          <p className="text-slate-400 text-sm">
            © 2025 Niche. 진정한 아티스트를 위한 플랫폼.
          </p>
        </div>
      </footer>
    </main>
  );
}
