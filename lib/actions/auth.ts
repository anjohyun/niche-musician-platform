'use server';

import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

// Validation schemas
const signupSchema = z.object({
  email: z.string().email('유효한 이메일을 입력해주세요'),
  name: z.string().min(2, '이름은 2자 이상이어야 합니다'),
  password: z.string().min(6, '비밀번호는 6자 이상이어야 합니다'),
});

const loginSchema = z.object({
  email: z.string().email('유효한 이메일을 입력해주세요'),
  password: z.string().min(1, '비밀번호를 입력해주세요'),
});

export async function signup(data: z.infer<typeof signupSchema>) {
  try {
    const validatedData = signupSchema.parse(data);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return { error: '이미 존재하는 이메일입니다' };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        name: validatedData.name,
        password: hashedPassword,
      },
    });

    return { success: true, userId: user.id };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    console.error('Signup error:', error);
    return { error: '회원가입 중 오류가 발생했습니다' };
  }
}

export async function login(data: z.infer<typeof loginSchema>) {
  try {
    const validatedData = loginSchema.parse(data);

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
      include: {
        profile: true,
      },
    });

    if (!user || !user.password) {
      return { error: '이메일 또는 비밀번호가 잘못되었습니다' };
    }

    // Verify password
    const isValid = await bcrypt.compare(validatedData.password, user.password);
    if (!isValid) {
      return { error: '이메일 또는 비밀번호가 잘못되었습니다' };
    }

    return { 
      success: true, 
      userId: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
      profile: user.profile,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    console.error('Login error:', error);
    return { error: '로그인 중 오류가 발생했습니다' };
  }
}

