import prisma from '../../config/database.js';
import { AppError } from '../../middleware/errorHandler.js';

export class MentorshipService {
  static async getAllMentors() {
    return prisma.mentor.findMany({
      where: { isAvailable: true },
      include: {
        member: {
          include: {
            user: { select: { firstName: true, lastName: true, avatarUrl: true, email: true } },
            profile: true,
          },
        },
      },
    });
  }

  static async getMentorByMemberId(memberId: string) {
    const mentor = await prisma.mentor.findUnique({
      where: { memberId },
      include: {
        member: {
          include: {
            user: { select: { firstName: true, lastName: true, avatarUrl: true } },
            profile: true,
          },
        },
        matches: {
          include: {
            mentee: {
              include: {
                user: { select: { firstName: true, lastName: true, avatarUrl: true, email: true } },
                profile: true,
              },
            },
            sessions: { orderBy: { scheduledAt: 'desc' } },
            goals: true,
            notes: { orderBy: { createdAt: 'desc' } },
          },
        },
      },
    });

    return mentor;
  }

  static async getMyMentorship(memberId: string) {
    const asMentee = await prisma.mentorshipMatch.findMany({
      where: { menteeId: memberId },
      include: {
        mentor: {
          include: {
            member: {
              include: {
                user: { select: { firstName: true, lastName: true, avatarUrl: true } },
                profile: true,
              },
            },
          },
        },
        sessions: { orderBy: { scheduledAt: 'desc' } },
        goals: true,
        notes: {
          where: { isPrivate: false },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    const mentorProfile = await prisma.mentor.findUnique({
      where: { memberId },
      include: {
        matches: {
          include: {
            mentee: {
              include: {
                user: { select: { firstName: true, lastName: true, avatarUrl: true, email: true } },
                profile: true,
              },
            },
            sessions: { orderBy: { scheduledAt: 'desc' } },
            goals: true,
            notes: { orderBy: { createdAt: 'desc' } },
          },
        },
      },
    });

    return {
      asMentee,
      asMentor: mentorProfile,
    };
  }

  static async scheduleSession(data: {
    matchId: string;
    scheduledAt: string;
    durationMinutes?: number;
    agenda?: string;
    meetingLink?: string;
  }) {
    const match = await prisma.mentorshipMatch.findUnique({ where: { id: data.matchId } });
    if (!match) throw new AppError('Mentorship match not found', 404);

    return prisma.mentorshipSession.create({
      data: {
        matchId: data.matchId,
        scheduledAt: new Date(data.scheduledAt),
        durationMinutes: data.durationMinutes || 45,
        agenda: data.agenda,
        meetingLink: data.meetingLink || 'https://meet.sovereign.club/command-room',
        status: 'SCHEDULED',
      },
    });
  }

  static async updateSession(sessionId: string, data: any) {
    return prisma.mentorshipSession.update({
      where: { id: sessionId },
      data,
    });
  }

  static async createGoal(data: { matchId: string; title: string; description?: string; targetDate?: string }) {
    return prisma.mentorshipGoal.create({
      data: {
        matchId: data.matchId,
        title: data.title,
        description: data.description,
        targetDate: data.targetDate ? new Date(data.targetDate) : null,
        status: 'IN_PROGRESS',
      },
    });
  }

  static async updateGoal(goalId: string, status: string) {
    return prisma.mentorshipGoal.update({
      where: { id: goalId },
      data: { status },
    });
  }

  static async addNote(data: { matchId: string; authorId: string; note: string; isPrivate?: boolean }) {
    return prisma.mentorshipNote.create({
      data: {
        matchId: data.matchId,
        authorId: data.authorId,
        note: data.note,
        isPrivate: data.isPrivate || false,
      },
    });
  }
}
