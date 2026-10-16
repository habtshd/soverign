import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../config/database.js';
import { AppError } from '../../middleware/errorHandler.js';
import { logAuditEvent } from '../../middleware/audit.js';

const JWT_SECRET = process.env.JWT_SECRET || 'sovereign_secret_key_default';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export class AuthService {
  static async login(identifier: string, password: string, ipAddress?: string, userAgent?: string) {
    const cleanId = identifier.trim();
    const manMatch = cleanId.match(/^MAN[\s\-_#]*([0-9]+)$/i);
    const numInt = manMatch ? parseInt(manMatch[1], 10) : null;
    const pad3 = numInt !== null ? String(numInt).padStart(3, '0') : '';
    const pad4 = numInt !== null ? String(numInt).padStart(4, '0') : '';

    const possibleIds = [
      cleanId,
      cleanId.toLowerCase(),
      cleanId.toUpperCase(),
      ...(manMatch
        ? [
            `MAN ${pad3}`,
            `MAN-${pad3}`,
            `SOV-${pad3}`,
            `SOV-${pad4}`,
            `sp/meaza/${pad4}`,
            `pr/habtemariam/${pad4}`,
          ]
        : []),
    ];

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: cleanId.toLowerCase() },
          { member: { memberNumber: { in: possibleIds } } },
          { member: { digitalIdCode: { in: possibleIds } } },
          { member: { profile: { telegramHandle: cleanId } } },
          { member: { profile: { telegramHandle: `@${cleanId}` } } },
        ],
      },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
        member: {
          include: {
            membershipType: true,
            profile: true,
            mentorProfile: true,
          },
        },
      },
    });

    if (!user) {
      await prisma.loginActivity.create({
        data: {
          email: cleanId,
          status: 'FAILED',
          message: 'User/Member ID not found',
          ipAddress,
          userAgent,
        },
      });
      throw new AppError('Invalid Member ID or password', 401);
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      await prisma.loginActivity.create({
        data: {
          userId: user.id,
          email: user.email,
          status: 'FAILED',
          message: 'Invalid password',
          ipAddress,
          userAgent,
        },
      });
      throw new AppError('Invalid credentials', 401);
    }

    if (user.status !== 'ACTIVE') {
      throw new AppError('Account is not active. Please contact council leadership.', 403);
    }

    // Record successful login
    await prisma.loginActivity.create({
      data: {
        userId: user.id,
        email: user.email,
        status: 'SUCCESS',
        message: 'Login successful',
        ipAddress,
        userAgent,
      },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const roles = user.roles.map((r) => r.role.name);
    const permissions = Array.from(
      new Set(user.roles.flatMap((r) => r.role.permissions.map((rp) => rp.permission.name)))
    );

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as any });

    await logAuditEvent({
      userId: user.id,
      action: 'LOGIN',
      entity: 'User',
      entityId: user.id,
      ipAddress,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatarUrl: user.avatarUrl,
        roles,
        permissions,
        member: user.member,
      },
    };
  }

  static async register(data: any, ipAddress?: string) {
    const existing = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (existing) {
      throw new AppError('An account with this email already exists', 409);
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const memberRole = await prisma.role.findUniqueOrThrow({ where: { name: 'MEMBER' } });
    const membershipType = await prisma.membershipType.findFirst({
      where: { code: data.membershipTypeCode || 'GENERAL' },
    });

    if (!membershipType) {
      throw new AppError('Invalid membership type', 400);
    }

    const memberCount = await prisma.member.count();
    const memberNumber = `MAN ${String(memberCount + 1).padStart(3, '0')}`;
    const digitalIdCode = `MAN-${String(memberCount + 1).padStart(3, '0')}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // Normalize names
    let fName = data.firstName?.trim();
    let lName = data.lastName?.trim();
    if (!fName && data.fullName) {
      const parts = data.fullName.trim().split(/\s+/);
      fName = parts[0] || 'Brother';
      lName = parts.slice(1).join(' ') || 'Sovereign';
    }
    fName = fName || 'Brother';
    lName = lName || 'Sovereign';

    const resp = data.responses || {};
    const s1 = resp.section1_personal_info || {};
    const s2 = resp.section2_reality_and_motivation || {};

    const cityLoc = data.city || data.location || s1.q4_living_location || resp.q4_living || 'Addis Ababa, Ethiopia';
    const profession = data.occupation || s1.q7_role || resp.q7_role || 'Member';
    const telegram = data.telegramUsername || data.telegramHandle || s1.q6_telegram || resp.q6_telegram || null;
    const phoneNum = data.phone || s1.q5_phone || resp.q5_phone || null;
    const reason = data.reasonToJoin || s2.q10_why_join || resp.q10_why_join || 'Sovereign Brotherhood, Discipline & Leadership';
    const sourceRef = data.source || s1.q9_referral_source || resp.q9_hear_about || 'DIRECT';

    const serializedResponses = data.responsesJson 
      ? (typeof data.responsesJson === 'string' ? data.responsesJson : JSON.stringify(data.responsesJson))
      : (data.responses ? JSON.stringify(data.responses) : null);

    // Create user and member record in a transaction
    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: data.email.toLowerCase(),
          passwordHash,
          firstName: fName,
          lastName: lName,
          phone: phoneNum,
          status: 'ACTIVE',
          roles: {
            create: [{ roleId: memberRole.id }],
          },
        },
      });

      const member = await tx.member.create({
        data: {
          userId: user.id,
          memberNumber,
          membershipTypeId: membershipType.id,
          status: 'ACTIVE',
          digitalIdCode,
          qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${digitalIdCode}`,
          profile: {
            create: {
              profession,
              city: cityLoc,
              telegramHandle: telegram,
              bio: reason,
            },
          },
        },
        include: {
          membershipType: true,
          profile: true,
        },
      });

      // Also create an Application record with full 38-question dossier
      await (tx.memberApplication as any).create({
        data: {
          fullName: `${fName} ${lName}`,
          email: data.email.toLowerCase(),
          phone: phoneNum,
          occupation: profession,
          city: cityLoc,
          reasonToJoin: reason,
          source: sourceRef,
          status: 'APPROVED',
          reviewNotes: 'Auto-approved via Sovereign Readiness Application.',
          responsesJson: serializedResponses,
        },
      });

      // Create welcome notification
      await tx.notification.create({
        data: {
          userId: user.id,
          title: 'Welcome to the Sovereign Brotherhood',
          message: 'Your profile has been created. Take your place in the Brotherhood, explore courses, and log your fitness standard.',
          type: 'SUCCESS',
          link: '/member/membership',
        },
      });

      return { user, member };
    });

    await logAuditEvent({
      userId: newUser.user.id,
      action: 'REGISTER',
      entity: 'User',
      entityId: newUser.user.id,
      ipAddress,
    });

    const token = jwt.sign({ userId: newUser.user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as any });

    return {
      token,
      user: {
        id: newUser.user.id,
        email: newUser.user.email,
        firstName: newUser.user.firstName,
        lastName: newUser.user.lastName,
        roles: ['MEMBER'],
        member: newUser.member,
      },
    };
  }

  static async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
        member: {
          include: {
            membershipType: true,
            profile: true,
            mentorProfile: true,
            skills: true,
            interests: true,
          },
        },
        telegramLink: true,
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const roles = user.roles.map((r) => r.role.name);
    const permissions = Array.from(
      new Set(user.roles.flatMap((r) => r.role.permissions.map((rp) => rp.permission.name)))
    );

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatarUrl: user.avatarUrl,
      phone: user.phone,
      roles,
      permissions,
      member: user.member,
      telegramLink: user.telegramLink,
    };
  }
}
