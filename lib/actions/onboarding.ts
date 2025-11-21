'use server';

import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// 각 단계별 검증 스키마
const onboardingSchema = z.object({
  userId: z.string(),
  
  // Step 1: 기원 스토리
  musicOriginStory: z.string().optional(),
  
  // Step 2: 음악 철학
  artisticMission: z.string().optional(),
  uniqueValue: z.string().optional(),
  
  // Step 3: 영향과 영감
  influences: z.array(z.string()).optional(),
  inspirationSources: z.array(z.string()).optional(),
  
  // Step 4: 감정 팔레트
  emotionalTags: z.array(z.string()).optional(),
  situationalTags: z.array(z.string()).optional(),
  sensoryTags: z.array(z.string()).optional(),
  culturalReferences: z.array(z.string()).optional(),
  
  // Step 5: 창작 과정
  creativeProcess: z.string().optional(),
  toolsAndGear: z.array(z.string()).optional(),
  
  // Step 6: 시각적 미학
  visualAesthetic: z.string().optional(),
  colorPalette: z.array(z.string()).optional(),
  
  // Step 7: 협업
  collaborationStyle: z.string().optional(),
  lookingForCollab: z.boolean().optional(),
  collabInterests: z.array(z.string()).optional(),
  
  // Step 8: 현재 탐구
  currentExploration: z.string().optional(),
  experimentalWorks: z.boolean().optional(),
});

export async function saveOnboardingStep(data: z.infer<typeof onboardingSchema>) {
  try {
    const validatedData = onboardingSchema.parse(data);
    
    // 프로필이 있는지 확인
    const profile = await prisma.musicianProfile.findUnique({
      where: { userId: validatedData.userId },
    });

    if (!profile) {
      return { error: '프로필을 찾을 수 없습니다' };
    }

    // 프로필 업데이트
    const updatedProfile = await prisma.musicianProfile.update({
      where: { userId: validatedData.userId },
      data: {
        musicOriginStory: validatedData.musicOriginStory,
        artisticMission: validatedData.artisticMission,
        uniqueValue: validatedData.uniqueValue,
        influences: validatedData.influences || [],
        inspirationSources: validatedData.inspirationSources || [],
        emotionalTags: validatedData.emotionalTags || [],
        situationalTags: validatedData.situationalTags || [],
        sensoryTags: validatedData.sensoryTags || [],
        culturalReferences: validatedData.culturalReferences || [],
        creativeProcess: validatedData.creativeProcess,
        toolsAndGear: validatedData.toolsAndGear || [],
        visualAesthetic: validatedData.visualAesthetic,
        colorPalette: validatedData.colorPalette || [],
        collaborationStyle: validatedData.collaborationStyle,
        lookingForCollab: validatedData.lookingForCollab || false,
        collabInterests: validatedData.collabInterests || [],
        currentExploration: validatedData.currentExploration,
        experimentalWorks: validatedData.experimentalWorks || false,
      },
    });

    // 프로필 완성도 계산
    const completeness = calculateProfileCompleteness(updatedProfile);

    await prisma.musicianProfile.update({
      where: { userId: validatedData.userId },
      data: { profileCompleteness: completeness },
    });

    return { success: true, completeness };
  } catch (error) {
    console.error('Save onboarding step error:', error);
    return { error: '저장 중 오류가 발생했습니다' };
  }
}

function calculateProfileCompleteness(profile: any): number {
  let totalPoints = 0;
  let earnedPoints = 0;

  // 각 필드에 점수 부여
  const fields = [
    { value: profile.stageName, points: 5 },
    { value: profile.bio, points: 5 },
    { value: profile.musicOriginStory, points: 15 },
    { value: profile.artisticMission, points: 10 },
    { value: profile.uniqueValue, points: 10 },
    { value: profile.influences?.length > 0, points: 10 },
    { value: profile.inspirationSources?.length > 0, points: 10 },
    { value: profile.emotionalTags?.length > 0, points: 10 },
    { value: profile.situationalTags?.length > 0, points: 5 },
    { value: profile.sensoryTags?.length > 0, points: 5 },
    { value: profile.creativeProcess, points: 10 },
    { value: profile.toolsAndGear?.length > 0, points: 5 },
  ];

  fields.forEach(({ value, points }) => {
    totalPoints += points;
    if (value) earnedPoints += points;
  });

  return Math.min(100, Math.round((earnedPoints / totalPoints) * 100));
}

export async function getOnboardingProgress(userId: string) {
  try {
    const profile = await prisma.musicianProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return { error: '프로필을 찾을 수 없습니다' };
    }

    return {
      success: true,
      profile,
      completeness: profile.profileCompleteness,
    };
  } catch (error) {
    console.error('Get onboarding progress error:', error);
    return { error: '진행 상황을 불러오는 중 오류가 발생했습니다' };
  }
}

