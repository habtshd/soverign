import prisma from '../../config/database.js';
import { AppError } from '../../middleware/errorHandler.js';

export class CommunityServiceService {
  static async getProjects(memberId?: string) {
    const projects = await prisma.serviceProject.findMany({
      include: {
        volunteers: {
          include: {
            member: {
              include: { user: { select: { firstName: true, lastName: true, avatarUrl: true } } },
            },
          },
        },
        impactRecords: true,
        _count: { select: { volunteers: true, serviceHours: true } },
      },
      orderBy: { startDate: 'asc' },
    });

    return projects.map((p) => {
      const isVolunteering = memberId ? p.volunteers.some((v) => v.memberId === memberId) : false;
      return {
        ...p,
        isVolunteering,
      };
    });
  }

  static async volunteerForProject(projectId: string, memberId: string, role = 'VOLUNTEER') {
    return prisma.projectVolunteer.upsert({
      where: {
        projectId_memberId: { projectId, memberId },
      },
      update: { status: 'CONFIRMED' },
      create: {
        projectId,
        memberId,
        role,
        status: 'CONFIRMED',
      },
    });
  }

  static async logServiceHours(data: {
    projectId: string;
    memberId: string;
    hours: number;
    notes?: string;
  }) {
    const record = await prisma.serviceHour.create({
      data: {
        projectId: data.projectId,
        memberId: data.memberId,
        hours: Number(data.hours),
        notes: data.notes,
        status: 'VERIFIED',
      },
    });

    // Update member's total service hours
    await prisma.member.update({
      where: { id: data.memberId },
      data: { serviceHoursTotal: { increment: Number(data.hours) } },
    });

    return record;
  }
}
