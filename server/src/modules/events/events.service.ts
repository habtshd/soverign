import prisma from '../../config/database.js';
import { AppError } from '../../middleware/errorHandler.js';
import { logAuditEvent } from '../../middleware/audit.js';

export class EventsService {
  static async getAllEvents(params: {
    status?: string;
    categoryId?: string;
    upcomingOnly?: boolean;
    search?: string;
  }) {
    const where: any = {};
    if (params.status) {
      where.status = params.status;
    } else {
      where.status = { not: 'DRAFT' };
    }
    if (params.categoryId) {
      where.categoryId = params.categoryId;
    }
    if (params.upcomingOnly) {
      where.startTime = { gte: new Date() };
    }
    if (params.search) {
      where.OR = [
        { title: { contains: params.search } },
        { description: { contains: params.search } },
      ];
    }

    return prisma.event.findMany({
      where,
      include: {
        category: true,
        location: true,
        organizer: {
          select: { firstName: true, lastName: true, avatarUrl: true },
        },
        _count: {
          select: { registrations: true, attendances: true },
        },
      },
      orderBy: { startTime: 'asc' },
    });
  }

  static async getEventById(eventId: string, memberId?: string) {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        category: true,
        location: true,
        organizer: {
          select: { id: true, firstName: true, lastName: true, avatarUrl: true, email: true },
        },
        registrations: {
          include: {
            member: {
              include: {
                user: { select: { firstName: true, lastName: true, avatarUrl: true } },
              },
            },
          },
        },
        attendances: {
          include: {
            member: {
              include: {
                user: { select: { firstName: true, lastName: true } },
              },
            },
          },
        },
        feedbacks: {
          include: {
            member: {
              include: {
                user: { select: { firstName: true, lastName: true } },
              },
            },
          },
        },
      },
    });

    if (!event) {
      throw new AppError('Event not found', 404);
    }

    let userRegistration = null;
    let userAttendance = null;

    if (memberId) {
      userRegistration = event.registrations.find((r) => r.memberId === memberId);
      userAttendance = event.attendances.find((a) => a.memberId === memberId);
    }

    return {
      ...event,
      isRegistered: !!userRegistration,
      registrationStatus: userRegistration?.status || null,
      isCheckedIn: !!userAttendance,
    };
  }

  static async createEvent(data: any, organizerId: string) {
    const event = await prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        categoryId: data.categoryId,
        locationId: data.locationId || null,
        organizerId,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        capacity: Number(data.capacity) || 50,
        status: data.status || 'PUBLISHED',
        coverImage: data.coverImage,
      },
    });

    await logAuditEvent({
      userId: organizerId,
      action: 'CREATE',
      entity: 'Event',
      entityId: event.id,
      details: { title: event.title },
    });

    return event;
  }

  static async registerForEvent(eventId: string, memberId: string) {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        _count: { select: { registrations: true } },
      },
    });

    if (!event) {
      throw new AppError('Event not found', 404);
    }

    if (event.status !== 'PUBLISHED') {
      throw new AppError('Event is not open for registration', 400);
    }

    const existing = await prisma.eventRegistration.findUnique({
      where: {
        eventId_memberId: { eventId, memberId },
      },
    });

    if (existing) {
      if (existing.status === 'CANCELLED') {
        return prisma.eventRegistration.update({
          where: { id: existing.id },
          data: { status: 'CONFIRMED', registeredAt: new Date() },
        });
      }
      return existing;
    }

    const isWaitlist = event._count.registrations >= event.capacity;
    const status = isWaitlist ? 'WAITLIST' : 'CONFIRMED';

    const registration = await prisma.eventRegistration.create({
      data: {
        eventId,
        memberId,
        status,
      },
    });

    await prisma.event.update({
      where: { id: eventId },
      data: { registeredCount: { increment: 1 } },
    });

    return registration;
  }

  static async cancelRegistration(eventId: string, memberId: string) {
    const registration = await prisma.eventRegistration.findUnique({
      where: {
        eventId_memberId: { eventId, memberId },
      },
    });

    if (!registration) {
      throw new AppError('Registration not found', 404);
    }

    const updated = await prisma.eventRegistration.update({
      where: { id: registration.id },
      data: { status: 'CANCELLED' },
    });

    await prisma.event.update({
      where: { id: eventId },
      data: { registeredCount: { decrement: 1 } },
    });

    return updated;
  }

  static async checkInAttendance(eventId: string, memberIdOrCode: string, checkedById: string, method = 'QR_SCAN') {
    // Lookup member by ID, digitalIdCode, or memberNumber
    const member = await prisma.member.findFirst({
      where: {
        OR: [
          { id: memberIdOrCode },
          { digitalIdCode: memberIdOrCode },
          { memberNumber: memberIdOrCode },
        ],
      },
      include: { user: true },
    });

    if (!member) {
      throw new AppError('Member not found with provided code/ID', 404);
    }

    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      throw new AppError('Event not found', 404);
    }

    // Upsert attendance
    const attendance = await prisma.attendance.upsert({
      where: {
        eventId_memberId: { eventId, memberId: member.id },
      },
      update: {
        checkedInAt: new Date(),
        method,
        checkedInBy: checkedById,
      },
      create: {
        eventId,
        memberId: member.id,
        method,
        checkedInBy: checkedById,
      },
    });

    // Also auto-confirm registration if not already
    await prisma.eventRegistration.upsert({
      where: {
        eventId_memberId: { eventId, memberId: member.id },
      },
      update: { status: 'CONFIRMED' },
      create: { eventId, memberId: member.id, status: 'CONFIRMED' },
    });

    await logAuditEvent({
      userId: checkedById,
      action: 'CHECKIN',
      entity: 'Attendance',
      entityId: attendance.id,
      details: { member: `${member.user.firstName} ${member.user.lastName}`, event: event.title, method },
    });

    return {
      attendance,
      member: {
        id: member.id,
        name: `${member.user.firstName} ${member.user.lastName}`,
        memberNumber: member.memberNumber,
        digitalIdCode: member.digitalIdCode,
      },
    };
  }

  static async submitFeedback(eventId: string, memberId: string, rating: number, comments?: string) {
    return prisma.eventFeedback.upsert({
      where: {
        eventId_memberId: { eventId, memberId },
      },
      update: { rating, comments },
      create: { eventId, memberId, rating, comments },
    });
  }

  static async getCategories() {
    return prisma.eventCategory.findMany();
  }

  static async getLocations() {
    return prisma.eventLocation.findMany();
  }
}
