'use server';

import { prisma } from '@/lib/prisma';

// 매칭 알고리즘: 사용자 간 유사도 계산
export async function calculateMatchScore(userId1: string, userId2: string) {
  const [profile1, profile2] = await Promise.all([
    prisma.musicianProfile.findUnique({ where: { userId: userId1 } }),
    prisma.musicianProfile.findUnique({ where: { userId: userId2 } }),
  ]);

  if (!profile1 || !profile2) return 0;

  let score = 0;

  // 1. 장르 유사도 (30점)
  const sharedGenres = profile1.genres.filter((g) => profile2.genres.includes(g));
  score += (sharedGenres.length / Math.max(profile1.genres.length, profile2.genres.length, 1)) * 30;

  // 2. 니치 유사도 (25점)
  const sharedNiches = profile1.niches.filter((n) => profile2.niches.includes(n));
  score += (sharedNiches.length / Math.max(profile1.niches.length, profile2.niches.length, 1)) * 25;

  // 3. 감정 태그 유사도 (20점)
  const sharedEmotions = profile1.emotionalTags.filter((e) => profile2.emotionalTags.includes(e));
  score += (sharedEmotions.length / Math.max(profile1.emotionalTags.length, profile2.emotionalTags.length, 1)) * 20;

  // 4. 협업 의지 (15점)
  if (profile1.lookingForCollab && profile2.lookingForCollab) {
    score += 15;
  } else if (profile1.lookingForCollab || profile2.lookingForCollab) {
    score += 7;
  }

  // 5. 협업 관심사 매칭 (10점)
  const sharedCollabInterests = profile1.collabInterests.filter((c) => profile2.collabInterests.includes(c));
  score += (sharedCollabInterests.length / Math.max(profile1.collabInterests.length, profile2.collabInterests.length, 1)) * 10;

  return Math.min(Math.round(score), 100);
}

// 사용자를 위한 최적의 매칭 찾기
export async function findMatches(userId: string, limit = 10) {
  try {
    const userProfile = await prisma.musicianProfile.findUnique({
      where: { userId },
    });

    if (!userProfile) {
      return { error: '프로필을 찾을 수 없습니다' };
    }

    // 모든 다른 프로필 가져오기 (협업을 원하는 사용자 우선)
    const otherProfiles = await prisma.musicianProfile.findMany({
      where: {
        userId: { not: userId },
        lookingForCollab: true,
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
      take: 50, // 성능을 위해 제한
    });

    // 각 프로필과의 매칭 점수 계산
    const matchesWithScores = await Promise.all(
      otherProfiles.map(async (profile) => {
        const score = await calculateMatchScore(userId, profile.userId);

        // 공통 요소 계산
        const sharedGenres = userProfile.genres.filter((g) => profile.genres.includes(g));
        const sharedNiches = userProfile.niches.filter((n) => profile.niches.includes(n));
        const sharedEmotions = userProfile.emotionalTags.filter((e) => profile.emotionalTags.includes(e));

        return {
          profile,
          score,
          sharedGenres,
          sharedNiches,
          sharedEmotions,
        };
      })
    );

    // 점수순으로 정렬
    const sortedMatches = matchesWithScores
      .filter((m) => m.score > 30) // 최소 30점 이상
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return { success: true, matches: sortedMatches };
  } catch (error) {
    console.error('Find matches error:', error);
    return { error: '매칭 검색 중 오류가 발생했습니다' };
  }
}

// 매칭 생성
export async function createMatch(data: {
  initiatorId: string;
  receiverId: string;
  proposedProject?: string;
  isManualMatch?: boolean;
  adminNotes?: string;
}) {
  try {
    // 이미 존재하는 매칭 확인
    const existingMatch = await prisma.collaborationMatch.findFirst({
      where: {
        OR: [
          { initiatorId: data.initiatorId, receiverId: data.receiverId },
          { initiatorId: data.receiverId, receiverId: data.initiatorId },
        ],
      },
    });

    if (existingMatch) {
      return { error: '이미 매칭이 존재합니다' };
    }

    // 매칭 점수 계산
    const matchScore = await calculateMatchScore(data.initiatorId, data.receiverId);

    // 공통 요소 계산
    const [profile1, profile2] = await Promise.all([
      prisma.musicianProfile.findUnique({ where: { userId: data.initiatorId } }),
      prisma.musicianProfile.findUnique({ where: { userId: data.receiverId } }),
    ]);

    if (!profile1 || !profile2) {
      return { error: '프로필을 찾을 수 없습니다' };
    }

    const sharedGenres = profile1.genres.filter((g) => profile2.genres.includes(g));
    const sharedNiches = profile1.niches.filter((n) => profile2.niches.includes(n));
    const sharedEmotions = profile1.emotionalTags.filter((e) => profile2.emotionalTags.includes(e));

    // 매칭 이유 생성
    let matchReason = `매칭 점수: ${matchScore}점\n\n`;
    if (sharedGenres.length > 0) {
      matchReason += `공통 장르: ${sharedGenres.join(', ')}\n`;
    }
    if (sharedNiches.length > 0) {
      matchReason += `공통 니치: ${sharedNiches.join(', ')}\n`;
    }
    if (sharedEmotions.length > 0) {
      matchReason += `공통 감정: ${sharedEmotions.join(', ')}\n`;
    }

    // 만료일 설정 (30일 후)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const match = await prisma.collaborationMatch.create({
      data: {
        initiatorId: data.initiatorId,
        receiverId: data.receiverId,
        matchScore,
        matchReason,
        sharedGenres,
        sharedNiches,
        sharedEmotions,
        proposedProject: data.proposedProject,
        isManualMatch: data.isManualMatch || false,
        adminNotes: data.adminNotes,
        expiresAt,
      },
      include: {
        initiator: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    return { success: true, match };
  } catch (error) {
    console.error('Create match error:', error);
    return { error: '매칭 생성 중 오류가 발생했습니다' };
  }
}

// 매칭 상태 업데이트
export async function updateMatchStatus(matchId: string, status: 'accepted' | 'rejected') {
  try {
    const match = await prisma.collaborationMatch.update({
      where: { id: matchId },
      data: { status },
    });

    // 수락된 경우 채팅방 생성
    if (status === 'accepted') {
      const existingChatRoom = await prisma.chatRoom.findFirst({
        where: {
          OR: [
            { user1Id: match.initiatorId, user2Id: match.receiverId },
            { user1Id: match.receiverId, user2Id: match.initiatorId },
          ],
        },
      });

      if (!existingChatRoom) {
        await prisma.chatRoom.create({
          data: {
            user1Id: match.initiatorId,
            user2Id: match.receiverId,
            matchId: match.id,
          },
        });
      }
    }

    return { success: true, match };
  } catch (error) {
    console.error('Update match status error:', error);
    return { error: '매칭 상태 업데이트 중 오류가 발생했습니다' };
  }
}

// 사용자의 모든 매칭 가져오기
export async function getUserMatches(userId: string) {
  try {
    const matches = await prisma.collaborationMatch.findMany({
      where: {
        OR: [{ initiatorId: userId }, { receiverId: userId }],
      },
      include: {
        initiator: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            profile: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            profile: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { success: true, matches };
  } catch (error) {
    console.error('Get user matches error:', error);
    return { error: '매칭 조회 중 오류가 발생했습니다' };
  }
}

// 관리자: 모든 매칭 가져오기
export async function getAllMatches(filters?: {
  status?: string;
  minScore?: number;
  limit?: number;
}) {
  try {
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.minScore) {
      where.matchScore = { gte: filters.minScore };
    }

    const matches = await prisma.collaborationMatch.findMany({
      where,
      include: {
        initiator: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            profile: {
              select: {
                stageName: true,
                genres: true,
                niches: true,
              },
            },
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            profile: {
              select: {
                stageName: true,
                genres: true,
                niches: true,
              },
            },
          },
        },
      },
      orderBy: {
        matchScore: 'desc',
      },
      take: filters?.limit || 100,
    });

    return { success: true, matches };
  } catch (error) {
    console.error('Get all matches error:', error);
    return { error: '매칭 조회 중 오류가 발생했습니다' };
  }
}

// 관리자: 매칭 통계
export async function getMatchingStats() {
  try {
    const [totalMatches, pendingMatches, acceptedMatches, rejectedMatches] = await Promise.all([
      prisma.collaborationMatch.count(),
      prisma.collaborationMatch.count({ where: { status: 'pending' } }),
      prisma.collaborationMatch.count({ where: { status: 'accepted' } }),
      prisma.collaborationMatch.count({ where: { status: 'rejected' } }),
    ]);

    const avgMatchScore = await prisma.collaborationMatch.aggregate({
      _avg: { matchScore: true },
    });

    return {
      success: true,
      stats: {
        total: totalMatches,
        pending: pendingMatches,
        accepted: acceptedMatches,
        rejected: rejectedMatches,
        averageScore: avgMatchScore._avg.matchScore || 0,
      },
    };
  } catch (error) {
    console.error('Get matching stats error:', error);
    return { error: '통계 조회 중 오류가 발생했습니다' };
  }
}
