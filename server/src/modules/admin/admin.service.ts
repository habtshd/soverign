import prisma from '../../config/database.js';

export class AdminService {
  static async getDashboardMetrics() {
    const [
      totalUsers,
      totalMembers,
      activeMembers,
      pendingApplications,
      totalEvents,
      totalAttendances,
      totalCourses,
      totalEnrollments,
      activeMentorships,
      totalServiceHours,
      financialIncome,
      financialExpenses,
      recentAuditLogs,
      recentApplications,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.member.count(),
      prisma.member.count({ where: { status: 'ACTIVE' } }),
      prisma.memberApplication.count({ where: { status: 'SUBMITTED' } }),
      prisma.event.count(),
      prisma.attendance.count(),
      prisma.course.count(),
      prisma.enrollment.count(),
      prisma.mentorshipMatch.count({ where: { status: 'ACTIVE' } }),
      prisma.serviceHour.aggregate({ _sum: { hours: true } }),
      prisma.income.aggregate({ _sum: { amount: true } }),
      prisma.expense.aggregate({ _sum: { amount: true } }),
      prisma.auditLog.findMany({
        include: {
          user: { select: { firstName: true, lastName: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      prisma.memberApplication.findMany({
        where: { status: 'SUBMITTED' },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ]);

    const income = financialIncome._sum.amount || 0;
    const expenses = financialExpenses._sum.amount || 0;

    return {
      membership: {
        totalUsers,
        totalMembers,
        activeMembers,
        pendingApplications,
      },
      events: {
        totalEvents,
        totalAttendances,
      },
      learning: {
        totalCourses,
        totalEnrollments,
      },
      mentorship: {
        activeMentorships,
      },
      service: {
        totalHours: totalServiceHours._sum.hours || 0,
      },
      finance: {
        totalRevenue: income,
        totalExpenses: expenses,
        netTreasury: income - expenses,
      },
      recentAuditLogs,
      recentApplications,
    };
  }

  static async getAuditLogs(params: { page?: number; limit?: number }) {
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 30;
    const skip = (page - 1) * limit;

    const [total, logs] = await Promise.all([
      prisma.auditLog.count(),
      prisma.auditLog.findMany({
        skip,
        take: limit,
        include: {
          user: { select: { firstName: true, lastName: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getSettings() {
    return prisma.systemSetting.findMany();
  }

  static async updateSetting(key: string, value: string, description?: string) {
    return prisma.systemSetting.upsert({
      where: { key },
      update: { value, description },
      create: { key, value, description },
    });
  }

  static async globalSearch(query: string) {
    if (!query || query.trim().length === 0) return { members: [], events: [], courses: [], applications: [] };

    const q = query.trim();

    const [members, events, courses, applications] = await Promise.all([
      prisma.member.findMany({
        where: {
          OR: [
            { memberNumber: { contains: q } },
            { digitalIdCode: { contains: q } },
            { user: { firstName: { contains: q } } },
            { user: { lastName: { contains: q } } },
            { user: { email: { contains: q } } },
          ],
        },
        include: {
          user: { select: { firstName: true, lastName: true, email: true, avatarUrl: true } },
          membershipType: true,
        },
        take: 8,
      }),
      prisma.event.findMany({
        where: {
          OR: [
            { title: { contains: q } },
            { description: { contains: q } },
          ],
        },
        include: { category: true },
        take: 8,
      }),
      prisma.course.findMany({
        where: {
          OR: [
            { title: { contains: q } },
            { description: { contains: q } },
          ],
        },
        take: 8,
      }),
      prisma.memberApplication.findMany({
        where: {
          OR: [
            { fullName: { contains: q } },
            { email: { contains: q } },
            { company: { contains: q } },
          ],
        },
        take: 8,
      }),
    ]);

    return {
      members,
      events,
      courses,
      applications,
    };
  }
}
