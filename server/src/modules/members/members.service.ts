import prisma from '../../config/database.js';
import { AppError } from '../../middleware/errorHandler.js';
import { logAuditEvent } from '../../middleware/audit.js';
import bcrypt from 'bcryptjs';

export class MembersService {
  static async getAllMembers(params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    membershipType?: string;
  }) {
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params.status) {
      where.status = params.status;
    }
    if (params.membershipType) {
      where.membershipType = { code: params.membershipType };
    }
    if (params.search) {
      where.OR = [
        { memberNumber: { contains: params.search } },
        { digitalIdCode: { contains: params.search } },
        { user: { firstName: { contains: params.search } } },
        { user: { lastName: { contains: params.search } } },
        { user: { email: { contains: params.search } } },
        { profile: { company: { contains: params.search } } },
        { profile: { city: { contains: params.search } } },
      ];
    }

    const [total, members] = await Promise.all([
      prisma.member.count({ where }),
      prisma.member.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              phone: true,
              avatarUrl: true,
              createdAt: true,
            },
          },
          membershipType: true,
          profile: true,
          verifications: {
            include: {
              verifiedBy: {
                select: { firstName: true, lastName: true },
              },
            },
          },
          _count: {
            select: {
              attendances: true,
              registrations: true,
              serviceHours: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      members,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getMemberById(memberId: string) {
    const member = await prisma.member.findUnique({
      where: { id: memberId },
      include: {
        user: true,
        membershipType: true,
        profile: true,
        interests: true,
        skills: true,
        verifications: true,
        documents: true,
        registrations: {
          include: { event: true },
          take: 5,
        },
        attendances: {
          include: { event: true },
          take: 5,
        },
        serviceHours: {
          include: { project: true },
        },
        invoices: true,
      },
    });

    if (!member) {
      throw new AppError('Member not found', 404);
    }

    return member;
  }

  static async getDigitalIdByCode(code: string) {
    const member = await prisma.member.findFirst({
      where: {
        OR: [{ digitalIdCode: code }, { memberNumber: code }],
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
        membershipType: true,
        profile: true,
      },
    });

    if (!member) {
      throw new AppError('Invalid Sovereign Member ID', 404);
    }

    return {
      isValid: member.status === 'ACTIVE',
      memberNumber: member.memberNumber,
      digitalIdCode: member.digitalIdCode,
      name: `${member.user.firstName} ${member.user.lastName}`,
      avatarUrl: member.user.avatarUrl,
      tier: member.membershipType.name,
      badgeTier: member.badgeTier,
      status: member.status,
      joinDate: member.joinDate,
      serviceHoursTotal: member.serviceHoursTotal,
    };
  }

  static async updateMemberProfile(memberId: string, data: any, userId: string) {
    const member = await prisma.member.findUnique({
      where: { id: memberId },
    });

    if (!member) {
      throw new AppError('Member not found', 404);
    }

    // Update user details if provided
    if (data.firstName || data.lastName || data.phone || data.avatarUrl) {
      await prisma.user.update({
        where: { id: member.userId },
        data: {
          firstName: data.firstName || undefined,
          lastName: data.lastName || undefined,
          phone: data.phone || undefined,
          avatarUrl: data.avatarUrl || undefined,
        },
      });
    }

    // Update or create profile
    const profile = await prisma.memberProfile.upsert({
      where: { memberId },
      update: {
        bio: data.bio,
        city: data.city,
        country: data.country,
        profession: data.profession,
        company: data.company,
        linkedinUrl: data.linkedinUrl,
        telegramHandle: data.telegramHandle,
        emergencyContact: data.emergencyContact,
        tShirtSize: data.tShirtSize,
      },
      create: {
        memberId,
        bio: data.bio,
        city: data.city,
        country: data.country,
        profession: data.profession,
        company: data.company,
        linkedinUrl: data.linkedinUrl,
        telegramHandle: data.telegramHandle,
        emergencyContact: data.emergencyContact,
        tShirtSize: data.tShirtSize,
      },
    });

    await logAuditEvent({
      userId,
      action: 'UPDATE',
      entity: 'MemberProfile',
      entityId: memberId,
    });

    return profile;
  }

  static async getApplications(params: { status?: string }) {
    const where: any = {};
    if (params.status) {
      where.status = params.status;
    }
    return prisma.memberApplication.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  static async submitApplication(data: any) {
    const existing = await prisma.memberApplication.findFirst({
      where: { email: data.email.toLowerCase(), status: 'SUBMITTED' },
    });

    if (existing) {
      throw new AppError('An application with this email is already under review', 400);
    }

    const serializedResponses = data.responsesJson 
      ? (typeof data.responsesJson === 'string' ? data.responsesJson : JSON.stringify(data.responsesJson))
      : (data.responses ? JSON.stringify(data.responses) : null);

    return (prisma.memberApplication as any).create({
      data: {
        fullName: data.fullName,
        email: data.email.toLowerCase(),
        phone: data.phone,
        occupation: data.occupation,
        company: data.company,
        city: data.city,
        reasonToJoin: data.reasonToJoin,
        source: data.source || 'DIRECT',
        status: 'SUBMITTED',
        responsesJson: serializedResponses,
      },
    });
  }

  static async reviewApplication(applicationId: string, status: 'APPROVED' | 'REJECTED', notes: string, reviewerId: string) {
    const application = await prisma.memberApplication.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      throw new AppError('Application not found', 404);
    }

    const updated = await prisma.memberApplication.update({
      where: { id: applicationId },
      data: {
        status,
        reviewNotes: notes,
        reviewedByUserId: reviewerId,
      },
    });

    await logAuditEvent({
      userId: reviewerId,
      action: status === 'APPROVED' ? 'APPROVE' : 'REJECT',
      entity: 'MemberApplication',
      entityId: applicationId,
      details: { applicant: application.fullName, notes },
    });

    return updated;
  }

  static async verifyMember(memberId: string, data: { verificationType: string; notes?: string }, verifiedById: string) {
    const member = await prisma.member.findUnique({ where: { id: memberId } });
    if (!member) throw new AppError('Member not found', 404);

    const verification = await prisma.memberVerification.create({
      data: {
        memberId,
        verifiedByUserId: verifiedById,
        verificationType: data.verificationType,
        status: 'VERIFIED',
        notes: data.notes,
      },
    });

    await logAuditEvent({
      userId: verifiedById,
      action: 'VERIFY',
      entity: 'Member',
      entityId: memberId,
      details: data,
    });

    return verification;
  }

  static async getMembershipTypes() {
    return prisma.membershipType.findMany({
      where: { isActive: true },
      include: {
        _count: { select: { members: true } },
      },
    });
  }

  static async createMember(data: any, createdByUserId: string) {
    if (!data.email) {
      throw new AppError('Email address is required', 400);
    }
    const existing = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase().trim() },
    });
    if (existing) {
      throw new AppError('A user with this email address already exists in the registry', 409);
    }

    const password = data.password?.trim() || 'Sovereign2026!';
    const passwordHash = await bcrypt.hash(password, 10);

    const memberRole = await prisma.role.findFirst({
      where: { name: 'MEMBER' },
    });

    let membershipType: any = null;
    if (data.membershipTypeId) {
      membershipType = await prisma.membershipType.findUnique({ where: { id: data.membershipTypeId } });
    } else if (data.membershipTypeCode) {
      membershipType = await prisma.membershipType.findFirst({ where: { code: data.membershipTypeCode } });
    }
    if (!membershipType) {
      membershipType = await prisma.membershipType.findFirst({ where: { isActive: true } });
    }
    if (!membershipType) {
      throw new AppError('No valid membership tier found in system', 400);
    }

    const memberCount = await prisma.member.count();
    const nextNum = memberCount + 1;
    const memberNumber = `MAN ${String(nextNum).padStart(3, '0')}`;
    const digitalIdCode = `MAN-${String(nextNum).padStart(3, '0')}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    let fName = data.firstName?.trim() || '';
    let lName = data.lastName?.trim() || '';
    if (!fName && data.fullName) {
      const parts = data.fullName.trim().split(/\s+/);
      fName = parts[0] || 'Brother';
      lName = parts.slice(1).join(' ') || 'Sovereign';
    }
    fName = fName || 'Brother';
    lName = lName || 'Sovereign';

    const newMember = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: data.email.toLowerCase().trim(),
          passwordHash,
          firstName: fName,
          lastName: lName,
          phone: data.phone || null,
          status: data.status || 'ACTIVE',
          roles: memberRole ? {
            create: [{ roleId: memberRole.id }],
          } : undefined,
        },
      });

      const member = await tx.member.create({
        data: {
          userId: user.id,
          memberNumber,
          membershipTypeId: membershipType.id,
          status: data.status || 'ACTIVE',
          digitalIdCode,
          badgeTier: data.badgeTier || 'STANDARD',
          qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${digitalIdCode}`,
          profile: {
            create: {
              city: data.city || 'Addis Ababa',
              country: data.country || 'Ethiopia',
              profession: data.profession || data.occupation || 'Professional',
              company: data.company || null,
              telegramHandle: data.telegramHandle || null,
              bio: data.bio || 'Active Sovereign Brother dedicated to discipline and leadership.',
            },
          },
        },
        include: {
          user: true,
          membershipType: true,
          profile: true,
        },
      });

      return member;
    });

    await logAuditEvent({
      userId: createdByUserId,
      action: 'CREATE',
      entity: 'Member',
      entityId: newMember.id,
      details: { email: data.email, memberNumber },
    });

    return newMember;
  }
}
