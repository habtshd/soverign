import prisma from '../../config/database.js';
import { AppError } from '../../middleware/errorHandler.js';

export class BusinessService {
  static async getOpportunities() {
    return prisma.businessOpportunity.findMany({
      where: { status: 'OPEN' },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async createOpportunity(data: any) {
    return prisma.businessOpportunity.create({
      data: {
        title: data.title,
        company: data.company,
        description: data.description,
        investmentRange: data.investmentRange,
        contactPerson: data.contactPerson,
        contactEmail: data.contactEmail,
        status: 'OPEN',
      },
    });
  }

  static async getBusinessProfiles() {
    return prisma.businessProfile.findMany({
      include: {
        member: {
          include: {
            user: { select: { firstName: true, lastName: true, avatarUrl: true, email: true } },
          },
        },
      },
    });
  }

  static async upsertBusinessProfile(memberId: string, data: any) {
    return prisma.businessProfile.upsert({
      where: { memberId },
      update: data,
      create: {
        memberId,
        ...data,
      },
    });
  }

  static async getJobs() {
    return prisma.jobPost.findMany({
      where: { status: 'OPEN' },
      include: {
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async createJob(data: any, postedByUserId: string) {
    return prisma.jobPost.create({
      data: {
        title: data.title,
        company: data.company,
        location: data.location,
        employmentType: data.employmentType || 'FULL_TIME',
        salaryRange: data.salaryRange,
        description: data.description,
        requirements: data.requirements,
        postedByUserId,
      },
    });
  }

  static async applyForJob(jobId: string, memberId: string, data: { coverNote?: string; resumeUrl?: string }) {
    const job = await prisma.jobPost.findUnique({ where: { id: jobId } });
    if (!job) throw new AppError('Job not found', 404);

    return prisma.jobApplication.upsert({
      where: {
        jobId_memberId: { jobId, memberId },
      },
      update: {
        coverNote: data.coverNote,
        resumeUrl: data.resumeUrl,
        status: 'SUBMITTED',
      },
      create: {
        jobId,
        memberId,
        coverNote: data.coverNote,
        resumeUrl: data.resumeUrl,
        status: 'SUBMITTED',
      },
    });
  }
}
