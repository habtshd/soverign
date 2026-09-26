import prisma from '../../config/database.js';
import { AppError } from '../../middleware/errorHandler.js';

export class CommunityService {
  static async getAnnouncements() {
    return prisma.announcement.findMany({
      include: {
        author: { select: { firstName: true, lastName: true, avatarUrl: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async createAnnouncement(data: any, authorId: string) {
    return prisma.announcement.create({
      data: {
        title: data.title,
        content: data.content,
        priority: data.priority || 'NORMAL',
        targetAudience: data.targetAudience || 'ALL',
        authorId,
        telegramSent: data.sendToTelegram || false,
      },
    });
  }

  static async getPosts(userId?: string) {
    const posts = await prisma.post.findMany({
      include: {
        author: { select: { firstName: true, lastName: true, avatarUrl: true } },
        comments: {
          include: {
            author: { select: { firstName: true, lastName: true, avatarUrl: true } },
          },
          orderBy: { createdAt: 'asc' },
        },
        reactions: userId ? { where: { userId } } : false,
      },
      orderBy: { createdAt: 'desc' },
    });

    return posts.map((p) => ({
      ...p,
      hasLiked: p.reactions && p.reactions.length > 0,
    }));
  }

  static async createPost(authorId: string, content: string, mediaUrl?: string) {
    return prisma.post.create({
      data: {
        authorId,
        content,
        mediaUrl,
      },
      include: {
        author: { select: { firstName: true, lastName: true, avatarUrl: true } },
      },
    });
  }

  static async toggleLikePost(postId: string, userId: string) {
    const existing = await prisma.postReaction.findUnique({
      where: {
        postId_userId: { postId, userId },
      },
    });

    if (existing) {
      await prisma.postReaction.delete({
        where: { id: existing.id },
      });
      const updated = await prisma.post.update({
        where: { id: postId },
        data: { likesCount: { decrement: 1 } },
      });
      return { liked: false, likesCount: updated.likesCount };
    } else {
      await prisma.postReaction.create({
        data: { postId, userId, reactionType: 'LIKE' },
      });
      const updated = await prisma.post.update({
        where: { id: postId },
        data: { likesCount: { increment: 1 } },
      });
      return { liked: true, likesCount: updated.likesCount };
    }
  }

  static async addComment(postId: string, authorId: string, content: string) {
    const comment = await prisma.comment.create({
      data: { postId, authorId, content },
      include: {
        author: { select: { firstName: true, lastName: true, avatarUrl: true } },
      },
    });

    await prisma.post.update({
      where: { id: postId },
      data: { commentsCount: { increment: 1 } },
    });

    return comment;
  }
}
