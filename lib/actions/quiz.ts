'use server';

import { prisma } from '@/lib/prisma';

// 취향 프로파일 저장/업데이트
export async function saveTasteProfile(userId: string, data: any) {
  try {
    const existing = await prisma.tasteVector.findUnique({
      where: { userId },
    });

    if (existing) {
      // 업데이트
      const profile = await prisma.tasteVector.update({
        where: { userId },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      });
      return { success: true, profile };
    } else {
      // 생성
      const profile = await prisma.tasteVector.create({
        data: {
          userId,
          ...data,
        },
      });
      return { success: true, profile };
    }
  } catch (error) {
    console.error('Save taste profile error:', error);
    return { error: '취향 프로파일 저장 중 오류가 발생했습니다' };
  }
}

// 취향 프로파일 조회
export async function getTasteProfile(userId: string) {
  try {
    const profile = await prisma.tasteVector.findUnique({
      where: { userId },
    });

    return { success: true, profile };
  } catch (error) {
    console.error('Get taste profile error:', error);
    return { error: '취향 프로파일 조회 중 오류가 발생했습니다' };
  }
}

// 페르소나 라벨 생성 (AI-like logic)
export async function generatePersonaLabel(data: any) {
  try {
    const labels = [];

    // 시간대 분석
    if (data.preferredTimeSlots?.includes('심야') || data.preferredTimeSlots?.includes('새벽')) {
      labels.push('심야');
    }

    // 콘텐츠 카테고리 분석
    const contentScores = {
      music: (data.musicActivities?.length || 0) + (data.musicGenres?.length || 0),
      books: (data.bookActivities?.length || 0) + (data.bookGenres?.length || 0),
      art: (data.artActivities?.length || 0) + (data.artStyles?.length || 0),
      food: (data.foodActivities?.length || 0) + (data.foodPreferences?.length || 0),
    };

    const dominantCategory = Object.entries(contentScores).sort((a, b) => b[1] - a[1])[0];

    switch (dominantCategory[0]) {
      case 'music':
        if (data.musicGenres?.includes('재즈')) {
          labels.push('재즈');
        } else if (data.musicGenres?.includes('클래식')) {
          labels.push('클래식');
        } else if (data.musicGenres?.includes('인디')) {
          labels.push('인디');
        }
        labels.push('음악');
        break;
      case 'books':
        labels.push('독서');
        break;
      case 'art':
        labels.push('비주얼');
        labels.push('큐레이터');
        break;
      case 'food':
        if (data.foodPreferences?.includes('와인')) {
          labels.push('와인');
        } else if (data.foodPreferences?.includes('커피')) {
          labels.push('커피');
        }
        labels.push('미식가');
        break;
    }

    // 사회성 분석
    if (data.socialSize === '혼자') {
      labels.push('솔로');
    } else if (data.socialSize === '파티') {
      labels.push('파티');
    }

    // 트렌드 분석
    if (data.trendSensitivity > 70) {
      labels.push('얼리어답터');
    } else if (data.trendSensitivity < 30) {
      labels.push('클래식');
    }

    // 무드 키워드 통합
    if (data.moodKeywords?.length > 0) {
      labels.push(data.moodKeywords[0]);
    }

    const personaLabel = labels.slice(0, 3).join(' ') + ' 애호가';

    return { success: true, personaLabel };
  } catch (error) {
    console.error('Generate persona label error:', error);
    return { error: '페르소나 라벨 생성 중 오류가 발생했습니다' };
  }
}

// 호환 가능한 사용자 찾기
export async function findCompatibleUsers(userId: string, limit = 3) {
  try {
    const userProfile = await prisma.tasteVector.findUnique({
      where: { userId },
    });

    if (!userProfile) {
      return { error: '프로필을 찾을 수 없습니다' };
    }

    // 모든 완성된 프로필 가져오기
    const allProfiles = await prisma.tasteVector.findMany({
      where: {
        userId: { not: userId },
        completionStatus: 'complete',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      take: 50,
    });

    // 호환성 점수 계산
    const profilesWithScores = allProfiles.map((profile) => {
      let compatibilityScore = 0;

      // Music 호환성 (25점)
      const sharedMusicGenres = userProfile.musicGenres.filter((g) => profile.musicGenres.includes(g));
      compatibilityScore += (sharedMusicGenres.length / Math.max(userProfile.musicGenres.length, 1)) * 25;

      // Books 호환성 (15점)
      const sharedBookGenres = userProfile.bookGenres.filter((g) => profile.bookGenres.includes(g));
      compatibilityScore += (sharedBookGenres.length / Math.max(userProfile.bookGenres.length, 1)) * 15;

      // Art 호환성 (15점)
      const sharedArtStyles = userProfile.artStyles.filter((s) => profile.artStyles.includes(s));
      compatibilityScore += (sharedArtStyles.length / Math.max(userProfile.artStyles.length, 1)) * 15;

      // Food 호환성 (10점)
      const sharedFoodPrefs = userProfile.foodPreferences.filter((f) => profile.foodPreferences.includes(f));
      compatibilityScore += (sharedFoodPrefs.length / Math.max(userProfile.foodPreferences.length, 1)) * 10;

      // Social 호환성 (15점)
      if (userProfile.socialSize === profile.socialSize) compatibilityScore += 7.5;
      if (userProfile.drinkingStyle === profile.drinkingStyle) compatibilityScore += 7.5;

      // Time 호환성 (10점)
      const sharedTimeSlots = userProfile.preferredTimeSlots.filter((t) => profile.preferredTimeSlots.includes(t));
      compatibilityScore += (sharedTimeSlots.length / Math.max(userProfile.preferredTimeSlots.length, 1)) * 10;

      // Trend 호환성 (10점)
      const trendDiff = Math.abs(userProfile.trendSensitivity - profile.trendSensitivity);
      compatibilityScore += ((100 - trendDiff) / 100) * 10;

      return {
        user: profile.user,
        personaLabel: profile.personaLabel,
        compatibilityScore: Math.round(compatibilityScore),
        sharedInterests: {
          music: sharedMusicGenres,
          books: sharedBookGenres,
          art: sharedArtStyles,
          food: sharedFoodPrefs,
          time: sharedTimeSlots,
        },
      };
    });

    // 점수순 정렬
    const topMatches = profilesWithScores
      .filter((p) => p.compatibilityScore > 30)
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
      .slice(0, limit);

    return { success: true, matches: topMatches };
  } catch (error) {
    console.error('Find compatible users error:', error);
    return { error: '호환 사용자 찾기 중 오류가 발생했습니다' };
  }
}
