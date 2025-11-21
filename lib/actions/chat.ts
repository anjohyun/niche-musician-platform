'use server';

import { prisma } from '@/lib/prisma';

// 채팅방 생성 또는 가져오기
export async function getOrCreateChatRoom(user1Id: string, user2Id: string) {
  try {
    // 기존 채팅방 찾기
    let chatRoom = await prisma.chatRoom.findFirst({
      where: {
        OR: [
          { user1Id, user2Id },
          { user1Id: user2Id, user2Id: user1Id },
        ],
      },
      include: {
        user1: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            profile: {
              select: {
                stageName: true,
                avatar: true,
              },
            },
          },
        },
        user2: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            profile: {
              select: {
                stageName: true,
                avatar: true,
              },
            },
          },
        },
        messages: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 50,
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    // 없으면 생성
    if (!chatRoom) {
      chatRoom = await prisma.chatRoom.create({
        data: {
          user1Id,
          user2Id,
        },
        include: {
          user1: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              profile: {
                select: {
                  stageName: true,
                  avatar: true,
                },
              },
            },
          },
          user2: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              profile: {
                select: {
                  stageName: true,
                  avatar: true,
                },
              },
            },
          },
          messages: true,
        },
      });
    }

    return { success: true, chatRoom };
  } catch (error) {
    console.error('Get or create chat room error:', error);
    return { error: '채팅방 생성 중 오류가 발생했습니다' };
  }
}

// 사용자의 모든 채팅방 가져오기
export async function getUserChatRooms(userId: string) {
  try {
    const chatRooms = await prisma.chatRoom.findMany({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
        isActive: true,
      },
      include: {
        user1: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            profile: {
              select: {
                stageName: true,
                avatar: true,
              },
            },
          },
        },
        user2: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            profile: {
              select: {
                stageName: true,
                avatar: true,
              },
            },
          },
        },
        messages: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1, // 마지막 메시지만
        },
      },
      orderBy: {
        lastMessageAt: 'desc',
      },
    });

    // 각 채팅방에서 상대방 정보 추출
    const chatRoomsWithOther = chatRooms.map((room) => {
      const otherUser = room.user1Id === userId ? room.user2 : room.user1;
      const lastMessage = room.messages[0] || null;

      return {
        ...room,
        otherUser,
        lastMessage,
      };
    });

    return { success: true, chatRooms: chatRoomsWithOther };
  } catch (error) {
    console.error('Get user chat rooms error:', error);
    return { error: '채팅방 조회 중 오류가 발생했습니다' };
  }
}

// 메시지 전송
export async function sendMessage(data: {
  chatRoomId: string;
  senderId: string;
  content: string;
  attachments?: string[];
}) {
  try {
    const message = await prisma.message.create({
      data: {
        chatRoomId: data.chatRoomId,
        senderId: data.senderId,
        content: data.content,
        attachments: data.attachments || [],
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
            profile: {
              select: {
                stageName: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    // 채팅방의 lastMessageAt 업데이트
    await prisma.chatRoom.update({
      where: { id: data.chatRoomId },
      data: { lastMessageAt: new Date() },
    });

    return { success: true, message };
  } catch (error) {
    console.error('Send message error:', error);
    return { error: '메시지 전송 중 오류가 발생했습니다' };
  }
}

// 채팅방의 메시지 가져오기
export async function getChatMessages(chatRoomId: string, limit = 50, offset = 0) {
  try {
    const messages = await prisma.message.findMany({
      where: { chatRoomId },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
            profile: {
              select: {
                stageName: true,
                avatar: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    });

    return { success: true, messages: messages.reverse() };
  } catch (error) {
    console.error('Get chat messages error:', error);
    return { error: '메시지 조회 중 오류가 발생했습니다' };
  }
}

// 메시지 읽음 처리
export async function markMessagesAsRead(chatRoomId: string, userId: string) {
  try {
    await prisma.message.updateMany({
      where: {
        chatRoomId,
        senderId: { not: userId },
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Mark messages as read error:', error);
    return { error: '메시지 읽음 처리 중 오류가 발생했습니다' };
  }
}

// 읽지 않은 메시지 수 가져오기
export async function getUnreadMessageCount(userId: string) {
  try {
    // 사용자의 채팅방들 가져오기
    const chatRooms = await prisma.chatRoom.findMany({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
      select: {
        id: true,
      },
    });

    const chatRoomIds = chatRooms.map((room) => room.id);

    // 읽지 않은 메시지 수 계산
    const unreadCount = await prisma.message.count({
      where: {
        chatRoomId: { in: chatRoomIds },
        senderId: { not: userId },
        isRead: false,
      },
    });

    return { success: true, unreadCount };
  } catch (error) {
    console.error('Get unread message count error:', error);
    return { error: '읽지 않은 메시지 수 조회 중 오류가 발생했습니다' };
  }
}

// 관리자: 모든 채팅방 통계
export async function getChatStats() {
  try {
    const [totalChatRooms, activeChatRooms, totalMessages] = await Promise.all([
      prisma.chatRoom.count(),
      prisma.chatRoom.count({ where: { isActive: true } }),
      prisma.message.count(),
    ]);

    // 최근 7일간 메시지 수
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentMessages = await prisma.message.count({
      where: {
        createdAt: { gte: sevenDaysAgo },
      },
    });

    return {
      success: true,
      stats: {
        totalChatRooms,
        activeChatRooms,
        totalMessages,
        recentMessages,
      },
    };
  } catch (error) {
    console.error('Get chat stats error:', error);
    return { error: '통계 조회 중 오류가 발생했습니다' };
  }
}
