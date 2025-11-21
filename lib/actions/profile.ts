'use server';

import { prisma } from '@/lib/prisma';

export async function getMusicianProfile(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        _count: {
          select: {
            tracks: true,
            followers: true,
            following: true,
          },
        },
      },
    });

    if (!user) {
      return { error: '사용자를 찾을 수 없습니다' };
    }

    return { success: true, user };
  } catch (error) {
    console.error('Get musician profile error:', error);
    return { error: '프로필을 불러오는 중 오류가 발생했습니다' };
  }
}

export async function getMusicianTracks(userId: string) {
  try {
    const tracks = await prisma.track.findMany({
      where: {
        userId,
        isPublished: true,
      },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { success: true, tracks };
  } catch (error) {
    console.error('Get musician tracks error:', error);
    return { error: '음악을 불러오는 중 오류가 발생했습니다' };
  }
}

