'use server';

import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const uploadTrackSchema = z.object({
  userId: z.string(),
  title: z.string().min(1, '제목을 입력해주세요'),
  description: z.string().optional(),
  audioUrl: z.string().url('유효한 오디오 URL을 입력해주세요'),
  coverImage: z.string().optional(),
  duration: z.number().optional(),
  genre: z.string().optional(),
  mood: z.string().optional(),
  bpm: z.number().optional(),
  key: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isPublished: z.boolean().default(false),
});

export async function uploadTrack(data: z.infer<typeof uploadTrackSchema>) {
  try {
    const validatedData = uploadTrackSchema.parse(data);

    // Create track
    const track = await prisma.track.create({
      data: {
        userId: validatedData.userId,
        title: validatedData.title,
        description: validatedData.description,
        audioUrl: validatedData.audioUrl,
        coverImage: validatedData.coverImage,
        duration: validatedData.duration,
        genre: validatedData.genre,
        mood: validatedData.mood,
        bpm: validatedData.bpm,
        key: validatedData.key,
        tags: validatedData.tags || [],
        isPublished: validatedData.isPublished,
      },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    });

    return { success: true, track };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    console.error('Upload track error:', error);
    return { error: '음악 업로드 중 오류가 발생했습니다' };
  }
}

export async function getTracks(userId?: string) {
  try {
    const tracks = await prisma.track.findMany({
      where: {
        isPublished: true,
        ...(userId && { userId }),
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
    console.error('Get tracks error:', error);
    return { error: '음악을 불러오는 중 오류가 발생했습니다' };
  }
}

export async function getTrack(trackId: string) {
  try {
    const track = await prisma.track.findUnique({
      where: { id: trackId },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
        likes: true,
        comments: {
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
        },
      },
    });

    if (!track) {
      return { error: '음악을 찾을 수 없습니다' };
    }

    return { success: true, track };
  } catch (error) {
    console.error('Get track error:', error);
    return { error: '음악을 불러오는 중 오류가 발생했습니다' };
  }
}

export async function incrementPlayCount(trackId: string) {
  try {
    await prisma.track.update({
      where: { id: trackId },
      data: {
        playCount: {
          increment: 1,
        },
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Increment play count error:', error);
    return { error: '재생 횟수 업데이트 중 오류가 발생했습니다' };
  }
}

