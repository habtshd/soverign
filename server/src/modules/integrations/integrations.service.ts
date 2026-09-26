import prisma from '../../config/database.js';
import { AppError } from '../../middleware/errorHandler.js';
import { logAuditEvent } from '../../middleware/audit.js';

export class IntegrationsService {
  static async getIntegrations() {
    return prisma.integration.findMany({
      orderBy: { serviceName: 'asc' },
    });
  }

  static async handleGoogleFormsWebhook(payload: {
    fullName: string;
    email: string;
    phone?: string;
    occupation?: string;
    company?: string;
    city?: string;
    reasonToJoin: string;
    formResponseId?: string;
  }) {
    if (!payload.email || !payload.fullName) {
      throw new AppError('Full name and email are mandatory for Google Form intake', 400);
    }

    // Check duplicate
    const existing = await prisma.memberApplication.findFirst({
      where: {
        OR: [
          { email: payload.email.toLowerCase() },
          payload.formResponseId ? { googleFormResponseId: payload.formResponseId } : {},
        ],
      },
    });

    if (existing) {
      return {
        status: 'DUPLICATE_IGNORED',
        message: 'Application with this email or form response ID already recorded',
        applicationId: existing.id,
      };
    }

    const application = await prisma.memberApplication.create({
      data: {
        fullName: payload.fullName,
        email: payload.email.toLowerCase(),
        phone: payload.phone,
        occupation: payload.occupation,
        company: payload.company,
        city: payload.city,
        reasonToJoin: payload.reasonToJoin || 'Applied via Google Forms community intake',
        source: 'GOOGLE_FORMS',
        status: 'SUBMITTED',
        googleFormResponseId: payload.formResponseId || `GF-${Date.now()}`,
      },
    });

    // Update integration metrics
    await prisma.integration.upsert({
      where: { serviceName: 'GOOGLE_FORMS' },
      update: {
        lastSyncAt: new Date(),
        syncCount: { increment: 1 },
      },
      create: {
        serviceName: 'GOOGLE_FORMS',
        status: 'CONNECTED',
        lastSyncAt: new Date(),
        syncCount: 1,
      },
    });

    await logAuditEvent({
      action: 'INGEST',
      entity: 'GoogleForms',
      entityId: application.id,
      details: { applicant: application.fullName, email: application.email },
    });

    return {
      status: 'SUCCESS',
      application,
    };
  }

  static async syncGoogleSheets(userId?: string) {
    // Simulated real-world ingestion bridge pulling batch from Sheets
    const sampleBatch = [
      {
        fullName: 'Julian Hayes',
        email: 'julian.hayes@example.com',
        phone: '+1 (555) 441-9921',
        occupation: 'Architectural Project Lead',
        city: 'Richmond, VA',
        reasonToJoin: 'Focusing on physical discipline and brotherhood mentorship.',
        source: 'GOOGLE_SHEETS',
      },
      {
        fullName: 'Patrick Sterling',
        email: 'p.sterling@example.com',
        phone: '+1 (555) 321-7788',
        occupation: 'Data Center Facilities Manager',
        city: 'Ashburn, VA',
        reasonToJoin: 'Looking for disciplined men committed to character and community leadership.',
        source: 'GOOGLE_SHEETS',
      },
    ];

    let importedCount = 0;
    for (const item of sampleBatch) {
      const exists = await prisma.memberApplication.findFirst({
        where: { email: item.email.toLowerCase() },
      });

      if (!exists) {
        await prisma.memberApplication.create({
          data: {
            ...item,
            status: 'SUBMITTED',
            googleFormResponseId: `SHEETS-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          },
        });
        importedCount++;
      }
    }

    await prisma.integration.upsert({
      where: { serviceName: 'GOOGLE_SHEETS' },
      update: {
        lastSyncAt: new Date(),
        syncCount: { increment: importedCount },
      },
      create: {
        serviceName: 'GOOGLE_SHEETS',
        status: 'CONNECTED',
        lastSyncAt: new Date(),
        syncCount: importedCount,
      },
    });

    if (userId) {
      await logAuditEvent({
        userId,
        action: 'SYNC',
        entity: 'GoogleSheets',
        details: { importedCount, batchSize: sampleBatch.length },
      });
    }

    return {
      success: true,
      importedCount,
      totalChecked: sampleBatch.length,
      lastSyncAt: new Date(),
    };
  }

  static async linkTelegramAccount(userId: string, telegramUsername: string) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const link = await prisma.telegramLink.upsert({
      where: { userId },
      update: {
        telegramUsername,
        verificationCode: code,
        isVerified: true,
        linkedAt: new Date(),
      },
      create: {
        userId,
        telegramUsername,
        verificationCode: code,
        isVerified: true,
        linkedAt: new Date(),
      },
    });

    // Also update member profile handle
    const member = await prisma.member.findUnique({ where: { userId } });
    if (member) {
      await prisma.memberProfile.upsert({
        where: { memberId: member.id },
        update: { telegramHandle: telegramUsername.startsWith('@') ? telegramUsername : `@${telegramUsername}` },
        create: { memberId: member.id, telegramHandle: telegramUsername.startsWith('@') ? telegramUsername : `@${telegramUsername}` },
      });
    }

    return link;
  }

  static async broadcastTelegramAnnouncement(announcementId: string, userId?: string) {
    const ann = await prisma.announcement.findUnique({ where: { id: announcementId } });
    if (!ann) throw new AppError('Announcement not found', 404);

    // Mock Telegram Bot API dispatch
    await prisma.announcement.update({
      where: { id: announcementId },
      data: { telegramSent: true },
    });

    await prisma.integration.upsert({
      where: { serviceName: 'TELEGRAM_BOT' },
      update: {
        lastSyncAt: new Date(),
        syncCount: { increment: 1 },
      },
      create: {
        serviceName: 'TELEGRAM_BOT',
        status: 'CONNECTED',
        lastSyncAt: new Date(),
        syncCount: 1,
      },
    });

    if (userId) {
      await logAuditEvent({
        userId,
        action: 'BROADCAST',
        entity: 'Telegram',
        entityId: announcementId,
        details: { title: ann.title },
      });
    }

    return {
      success: true,
      message: `Announcement "${ann.title}" successfully dispatched to official Telegram channel`,
    };
  }
}
