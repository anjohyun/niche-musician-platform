'use server';

import { prisma } from '@/lib/prisma';

// 프로필 완성도 계산
export async function calculateProfileCompleteness(userId: string) {
  try {
    const profile = await prisma.musicianProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return { completeness: 0, profile: null };
    }

    let score = 0;
    const maxScore = 100;

    // 기본 정보 (20점)
    if (profile.stageName) score += 5;
    if (profile.bio) score += 5;
    if (profile.avatar) score += 5;
    if (profile.location) score += 5;

    // 음악적 정체성 (25점)
    if (profile.genres.length > 0) score += 8;
    if (profile.niches.length > 0) score += 8;
    if (profile.instruments.length > 0) score += 9;

    // 음악적 DNA 핵심 (35점)
    if (profile.musicOriginStory) score += 7;
    if (profile.artisticMission) score += 7;
    if (profile.influences.length > 0) score += 7;
    if (profile.emotionalTags.length > 0) score += 7;
    if (profile.situationalTags.length > 0) score += 7;

    // 협업 정보 (20점)
    if (profile.collaborationStyle) score += 5;
    if (profile.collabInterests.length > 0) score += 10;
    if (profile.currentExploration) score += 5;

    const completeness = Math.min(Math.round(score), maxScore);

    // DB 업데이트
    await prisma.musicianProfile.update({
      where: { userId },
      data: { profileCompleteness: completeness },
    });

    return { completeness, profile };
  } catch (error) {
    console.error('Calculate profile completeness error:', error);
    return { completeness: 0, profile: null };
  }
}

// 사용자의 음악적 DNA 가져오기
export async function getMusicalDNA(userId: string) {
  try {
    const profile = await prisma.musicianProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            createdAt: true,
          },
        },
      },
    });

    if (!profile) {
      return { error: '프로필을 찾을 수 없습니다' };
    }

    // 완성도 계산
    const { completeness } = await calculateProfileCompleteness(userId);

    return {
      success: true,
      profile,
      completeness,
      isComplete: completeness >= 70, // 70% 이상이면 완성으로 간주
    };
  } catch (error) {
    console.error('Get musical DNA error:', error);
    return { error: '음악적 DNA 조회 중 오류가 발생했습니다' };
  }
}

// 비슷한 뮤지션 찾기 (음악적 DNA 기반)
export async function findSimilarMusicians(userId: string, limit = 12) {
  try {
    const userProfile = await prisma.musicianProfile.findUnique({
      where: { userId },
    });

    if (!userProfile) {
      return { error: '프로필을 찾을 수 없습니다' };
    }

    // 모든 다른 프로필 가져오기
    const allProfiles = await prisma.musicianProfile.findMany({
      where: {
        userId: { not: userId },
        profileCompleteness: { gte: 30 }, // 최소 30% 완성된 프로필만
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
      take: 100,
    });

    // 유사도 점수 계산
    const profilesWithScores = allProfiles.map((profile) => {
      let similarityScore = 0;

      // 장르 유사도 (25점)
      const sharedGenres = userProfile.genres.filter((g) => profile.genres.includes(g));
      similarityScore += (sharedGenres.length / Math.max(userProfile.genres.length, 1)) * 25;

      // 니치 유사도 (20점)
      const sharedNiches = userProfile.niches.filter((n) => profile.niches.includes(n));
      similarityScore += (sharedNiches.length / Math.max(userProfile.niches.length, 1)) * 20;

      // 감정 태그 유사도 (15점)
      const sharedEmotions = userProfile.emotionalTags.filter((e) => profile.emotionalTags.includes(e));
      similarityScore += (sharedEmotions.length / Math.max(userProfile.emotionalTags.length, 1)) * 15;

      // 상황 태그 유사도 (10점)
      const sharedSituations = userProfile.situationalTags.filter((s) => profile.situationalTags.includes(s));
      similarityScore += (sharedSituations.length / Math.max(userProfile.situationalTags.length, 1)) * 10;

      // 감각 태그 유사도 (10점)
      const sharedSensory = userProfile.sensoryTags.filter((s) => profile.sensoryTags.includes(s));
      similarityScore += (sharedSensory.length / Math.max(userProfile.sensoryTags.length, 1)) * 10;

      // 영향받은 아티스트 유사도 (10점)
      const sharedInfluences = userProfile.influences.filter((i) => profile.influences.includes(i));
      similarityScore += (sharedInfluences.length / Math.max(userProfile.influences.length, 1)) * 10;

      // 협업 관심사 유사도 (10점)
      const sharedCollabInterests = userProfile.collabInterests.filter((c) => profile.collabInterests.includes(c));
      similarityScore += (sharedCollabInterests.length / Math.max(userProfile.collabInterests.length, 1)) * 10;

      return {
        profile,
        similarityScore: Math.round(similarityScore),
        sharedGenres,
        sharedNiches,
        sharedEmotions,
        sharedInfluences,
      };
    });

    // 점수순 정렬
    const sortedProfiles = profilesWithScores
      .filter((p) => p.similarityScore > 20) // 최소 20점 이상
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, limit);

    return { success: true, musicians: sortedProfiles };
  } catch (error) {
    console.error('Find similar musicians error:', error);
    return { error: '비슷한 뮤지션 찾기 중 오류가 발생했습니다' };
  }
}

// DNA 인사이트 생성 (사용자의 음악적 특성 분석)
export async function generateDNAInsights(userId: string) {
  try {
    const profile = await prisma.musicianProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return { error: '프로필을 찾을 수 없습니다' };
    }

    const insights = [];

    // 장르 분석
    if (profile.genres.length > 0) {
      const genreText = profile.genres.length === 1
        ? `${profile.genres[0]} 장르에 집중하는`
        : `${profile.genres.slice(0, 2).join(', ')} 등 다양한 장르를 넘나드는`;
      insights.push({
        category: '장르 스타일',
        text: `${genreText} 음악가입니다.`,
        icon: '🎵',
      });
    }

    // 감정 분석
    if (profile.emotionalTags.length > 0) {
      const topEmotions = profile.emotionalTags.slice(0, 3).join(', ');
      insights.push({
        category: '감정 팔레트',
        text: `${topEmotions}의 감정을 음악으로 표현합니다.`,
        icon: '💫',
      });
    }

    // 협업 스타일
    if (profile.collaborationStyle) {
      const collabText = profile.lookingForCollab
        ? '적극적으로 협업을 원하며'
        : '선별적으로 협업하며';
      insights.push({
        category: '협업 성향',
        text: `${collabText}, ${profile.collaborationStyle} 스타일로 작업합니다.`,
        icon: '🤝',
      });
    }

    // 영감 소스
    if (profile.inspirationSources.length > 0) {
      insights.push({
        category: '영감 소스',
        text: `${profile.inspirationSources.slice(0, 2).join(', ')}에서 영감을 받습니다.`,
        icon: '✨',
      });
    }

    // 독특한 가치
    if (profile.uniqueValue) {
      insights.push({
        category: '독특한 가치',
        text: profile.uniqueValue,
        icon: '💎',
      });
    }

    return { success: true, insights };
  } catch (error) {
    console.error('Generate DNA insights error:', error);
    return { error: '인사이트 생성 중 오류가 발생했습니다' };
  }
}
