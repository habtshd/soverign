import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding authentic SOVEREIGN MEN'S CLUB data...");

  // 1. Roles
  const roles = [
    { name: 'SUPER_ADMIN', description: 'Complete system control and executive management' },
    { name: 'ADMIN', description: 'Platform administration and operational oversight' },
    { name: 'ORGANIZER', description: 'Event and program coordinator' },
    { name: 'MENTOR', description: 'Senior member guiding fellow brothers' },
    { name: 'MEMBER', description: 'Active verified Sovereign brother' },
    { name: 'VOLUNTEER', description: 'Community service leader and helper' },
    { name: 'FINANCE_MANAGER', description: 'Financial ledger, invoicing and treasurer' },
    { name: 'CONTENT_MANAGER', description: 'Learning and media curator' },
  ];

  for (const r of roles) {
    await prisma.role.upsert({
      where: { name: r.name },
      update: { description: r.description },
      create: r,
    });
  }

  const superAdminRole = await prisma.role.findUniqueOrThrow({ where: { name: 'SUPER_ADMIN' } });
  const adminRole = await prisma.role.findUniqueOrThrow({ where: { name: 'ADMIN' } });
  const organizerRole = await prisma.role.findUniqueOrThrow({ where: { name: 'ORGANIZER' } });
  const mentorRole = await prisma.role.findUniqueOrThrow({ where: { name: 'MENTOR' } });
  const memberRole = await prisma.role.findUniqueOrThrow({ where: { name: 'MEMBER' } });
  const financeRole = await prisma.role.findUniqueOrThrow({ where: { name: 'FINANCE_MANAGER' } });

  // 2. Membership Types
  const membershipTypes = [
    {
      name: 'Founding Member',
      code: 'FOUNDING',
      fee: 1200,
      billingCycle: 'ANNUAL',
      benefits: 'Lifetime Council voting privileges, Private Annual Retreat, VIP Summit access, Bespoke Signet, 1-on-1 Executive Mentorship',
    },
    {
      name: 'Executive Member',
      code: 'EXECUTIVE',
      fee: 600,
      billingCycle: 'ANNUAL',
      benefits: 'Full Access to Masterminds, High-Tier Networking, Priority Event Seats, Exclusive Investment Syndicates',
    },
    {
      name: 'Sovereign Brother',
      code: 'GENERAL',
      fee: 300,
      billingCycle: 'ANNUAL',
      benefits: 'Access to All Regional Chapters, Community Platform, Fitness Challenges, Brotherhood Rucks, Service Projects',
    },
    {
      name: 'Rising Sovereign',
      code: 'YOUNG_LEADER',
      fee: 150,
      billingCycle: 'ANNUAL',
      benefits: 'Youth Mentorship Track (Under 25), Career Acceleration, Fitness Bootcamps',
    },
  ];

  for (const mt of membershipTypes) {
    await prisma.membershipType.upsert({
      where: { code: mt.code },
      update: mt,
      create: mt,
    });
  }

  const foundingType = await prisma.membershipType.findUniqueOrThrow({ where: { code: 'FOUNDING' } });
  const execType = await prisma.membershipType.findUniqueOrThrow({ where: { code: 'EXECUTIVE' } });
  const generalType = await prisma.membershipType.findUniqueOrThrow({ where: { code: 'GENERAL' } });

  const defaultPasswordHash = await bcrypt.hash('Password123!', 10);

  // 3. Create Key Sovereign Men's Club Users & Council
  
  // Founding Leader & Visionary: Eyob Haile
  const eyob = await prisma.user.upsert({
    where: { email: 'admin@sovereign.club' },
    update: {
      firstName: 'Eyob',
      lastName: 'Haile',
      phone: '+251 91 123 4567',
    },
    create: {
      email: 'admin@sovereign.club',
      passwordHash: defaultPasswordHash,
      firstName: 'Eyob',
      lastName: 'Haile',
      phone: '+251 91 123 4567',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
      status: 'ACTIVE',
      roles: {
        create: [
          { roleId: superAdminRole.id },
          { roleId: adminRole.id },
          { roleId: memberRole.id },
        ],
      },
      member: {
        create: {
          memberNumber: 'SOV-001',
          membershipTypeId: foundingType.id,
          status: 'ACTIVE',
          digitalIdCode: 'SOV-FOUNDER-0001',
          qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=SOV-FOUNDER-0001',
          badgeTier: 'SOVEREIGN_COUNCIL',
          serviceHoursTotal: 150,
          profile: {
            create: {
              bio: "Founding Leader & Visionary of Sovereign Men's Club. Dedicated to building men who carry responsibility, discipline, and purpose. ወንድ መሆን እዳ ነው!",
              city: 'Addis Ababa',
              country: 'Ethiopia',
              profession: 'Leadership & Community Development',
              company: "Sovereign Men's Club",
              telegramHandle: '@eyob_haile',
              tShirtSize: 'XL',
            },
          },
        },
      },
    },
    include: { member: true },
  });

  // Council Founder & Platform Architect: Habtemariam Delelew
  const habtemariam = await prisma.user.upsert({
    where: { email: 'habtemariam@sovereign.club' },
    update: {
      firstName: 'Habtemariam',
      lastName: 'Delelew',
      phone: '+251 91 777 0001',
    },
    create: {
      email: 'habtemariam@sovereign.club',
      passwordHash: defaultPasswordHash,
      firstName: 'Habtemariam',
      lastName: 'Delelew',
      phone: '+251 91 777 0001',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=face',
      status: 'ACTIVE',
      roles: {
        create: [
          { roleId: superAdminRole.id },
          { roleId: adminRole.id },
          { roleId: memberRole.id },
        ],
      },
      member: {
        create: {
          memberNumber: 'pr/habtemariam/0001',
          membershipTypeId: foundingType.id,
          status: 'ACTIVE',
          digitalIdCode: 'pr/habtemariam/0001',
          qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=pr/habtemariam/0001',
          badgeTier: 'SOVEREIGN_COUNCIL',
          serviceHoursTotal: 250,
          profile: {
            create: {
              bio: "Council Architect & Platform Director. Engineering the digital ecosystem for Sovereign Men's Club.",
              city: 'Addis Ababa',
              country: 'Ethiopia',
              profession: 'Sovereign Architecture & Technology',
              company: "Sovereign Men's Club",
              telegramHandle: '@habtemariam',
              tShirtSize: 'XL',
            },
          },
        },
      },
    },
    include: { member: true },
  });

  // Organizer: Dawit Tadesse
  const dawit = await prisma.user.upsert({
    where: { email: 'organizer@sovereign.club' },
    update: {
      firstName: 'Dawit',
      lastName: 'Tadesse',
    },
    create: {
      email: 'organizer@sovereign.club',
      passwordHash: defaultPasswordHash,
      firstName: 'Dawit',
      lastName: 'Tadesse',
      phone: '+251 91 345 6789',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face',
      status: 'ACTIVE',
      roles: {
        create: [
          { roleId: organizerRole.id },
          { roleId: memberRole.id },
        ],
      },
      member: {
        create: {
          memberNumber: 'SOV-014',
          membershipTypeId: execType.id,
          status: 'ACTIVE',
          digitalIdCode: 'SOV-ORGN-0014-BETA',
          qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=SOV-ORGN-0014-BETA',
          badgeTier: 'GOLD',
          serviceHoursTotal: 65,
          profile: {
            create: {
              bio: 'Head of Expeditions, Bootcamps, and Physical Gatherings.',
              city: 'Addis Ababa',
              country: 'Ethiopia',
              profession: 'Expedition & Operations Director',
              company: "Sovereign Men's Club",
              telegramHandle: '@dawit_organizer',
              tShirtSize: 'L',
            },
          },
        },
      },
    },
    include: { member: true },
  });

  // Mentor: Yonas Kassa
  const yonas = await prisma.user.upsert({
    where: { email: 'mentor@sovereign.club' },
    update: {
      firstName: 'Yonas',
      lastName: 'Kassa',
    },
    create: {
      email: 'mentor@sovereign.club',
      passwordHash: defaultPasswordHash,
      firstName: 'Yonas',
      lastName: 'Kassa',
      phone: '+251 91 456 7890',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
      status: 'ACTIVE',
      roles: {
        create: [
          { roleId: mentorRole.id },
          { roleId: memberRole.id },
        ],
      },
      member: {
        create: {
          memberNumber: 'SOV-007',
          membershipTypeId: foundingType.id,
          status: 'ACTIVE',
          digitalIdCode: 'SOV-MNTR-0007-OMEGA',
          qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=SOV-MNTR-0007-OMEGA',
          badgeTier: 'SOVEREIGN_COUNCIL',
          serviceHoursTotal: 94,
          profile: {
            create: {
              bio: 'Founding Mentor. Guiding brothers in wealth mastery, career progression, and mental resilience.',
              city: 'Addis Ababa',
              country: 'Ethiopia',
              profession: 'Senior Managing Consultant',
              company: 'Kassa Advisory',
              telegramHandle: '@yonas_mentor',
              tShirtSize: 'XXL',
            },
          },
          mentorProfile: {
            create: {
              expertise: 'Executive Leadership, Wealth Sovereignty, Mental Fortitude',
              yearsExperience: 18,
              bio: 'Mentoring brothers in building unshakeable internal fortitude, financial independence, and high-integrity leadership.',
              maxMentees: 4,
              activeMentees: 1,
              isAvailable: true,
            },
          },
        },
      },
    },
    include: { member: { include: { mentorProfile: true } } },
  });

  // Finance Manager: Henok Solomon
  await prisma.user.upsert({
    where: { email: 'finance@sovereign.club' },
    update: {
      firstName: 'Henok',
      lastName: 'Solomon',
    },
    create: {
      email: 'finance@sovereign.club',
      passwordHash: defaultPasswordHash,
      firstName: 'Henok',
      lastName: 'Solomon',
      phone: '+251 91 567 8901',
      avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop&crop=face',
      status: 'ACTIVE',
      roles: {
        create: [
          { roleId: financeRole.id },
          { roleId: memberRole.id },
        ],
      },
      member: {
        create: {
          memberNumber: 'SOV-022',
          membershipTypeId: execType.id,
          status: 'ACTIVE',
          digitalIdCode: 'SOV-FIN-0022-DELTA',
          qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=SOV-FIN-0022-DELTA',
          badgeTier: 'SILVER',
          serviceHoursTotal: 40,
          profile: {
            create: {
              bio: 'Treasurer and Financial Controller. Specialized in sovereign asset structures and community fund management.',
              city: 'Addis Ababa',
              country: 'Ethiopia',
              profession: 'Financial Controller',
              company: "Sovereign Men's Club",
              telegramHandle: '@henok_finance',
              tShirtSize: 'M',
            },
          },
        },
      },
    },
  });

  // Regular Member: Alex Mercer (Brother Alex)
  const alex = await prisma.user.upsert({
    where: { email: 'alex@sovereign.club' },
    update: {
      firstName: 'Alex',
      lastName: 'Mercer',
    },
    create: {
      email: 'alex@sovereign.club',
      passwordHash: defaultPasswordHash,
      firstName: 'Alex',
      lastName: 'Mercer',
      phone: '+251 91 678 9012',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=face',
      status: 'ACTIVE',
      roles: {
        create: [{ roleId: memberRole.id }],
      },
      member: {
        create: {
          memberNumber: 'SOV-108',
          membershipTypeId: generalType.id,
          status: 'ACTIVE',
          digitalIdCode: 'SOV-MEMB-0108-ZETA',
          qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=SOV-MEMB-0108-ZETA',
          badgeTier: 'BRONZE',
          serviceHoursTotal: 28,
          profile: {
            create: {
              bio: 'Active Sovereign Brother committed to physical fitness, business ownership, and brotherhood.',
              city: 'Addis Ababa',
              country: 'Ethiopia',
              profession: 'Tech Founder & Engineer',
              company: 'Sovereign Brother Network',
              telegramHandle: '@alex_brother',
              tShirtSize: 'L',
            },
          },
          interests: {
            create: [
              { interest: 'Physical Fitness' },
              { interest: 'Money Series & Business' },
              { interest: 'Leadership & Duty' },
            ],
          },
        },
      },
    },
    include: { member: true },
  });

  // 4. Mentorship Match
  const mentorProfileRecord = await prisma.mentor.findFirst({
    where: { member: { user: { email: 'mentor@sovereign.club' } } },
  });

  if (mentorProfileRecord && alex.member) {
    const existingMatch = await prisma.mentorshipMatch.findFirst({
      where: { menteeId: alex.member.id, mentorId: mentorProfileRecord.id },
    });

    if (!existingMatch) {
      const match = await prisma.mentorshipMatch.create({
        data: {
          menteeId: alex.member.id,
          mentorId: mentorProfileRecord.id,
          status: 'ACTIVE',
          goals: {
            create: [
              { title: 'Establish morning physical standard (5:30 AM 100 pushups daily)', status: 'IN_PROGRESS' },
              { title: 'Transition from freelance hourly to equity and business ownership', status: 'IN_PROGRESS' },
            ],
          },
        },
      });

      await prisma.mentorshipSession.create({
        data: {
          matchId: match.id,
          scheduledAt: new Date(Date.now() + 86400000 * 3),
          status: 'SCHEDULED',
          meetingUrl: 'https://meet.sovereign.club/mentorship-alpha',
          agenda: 'Review 30-day physical metrics and equity acquisition blueprint.',
        },
      });
    }
  }

  // 5. Member Applications (Google Form Sync Pipeline Demo)
  const existingApp = await prisma.memberApplication.findFirst({ where: { email: 'darius.kassa@example.com' } });
  if (!existingApp) {
    await prisma.memberApplication.createMany({
      data: [
        {
          fullName: 'Darius Kassa',
          email: 'darius.kassa@example.com',
          phone: '+251 91 890 1234',
          occupation: 'Commercial Aviation & Logistics',
          company: 'Cargo Logistics',
          city: 'Addis Ababa',
          reasonToJoin: 'Looking to give back through community service and connect with like-minded disciplined men.',
          source: 'GOOGLE_FORMS',
          status: 'SUBMITTED',
        },
        {
          fullName: 'Natnael Bekele',
          email: 'natnael.bekele@example.com',
          phone: '+251 91 901 2345',
          occupation: 'Financial Analyst',
          company: 'Alpha Investment Partners',
          city: 'Addis Ababa',
          reasonToJoin: 'Align with Sovereign principles of physical vitality, money series mastery, and brotherhood.',
          source: 'GOOGLE_FORMS',
          status: 'APPROVED',
          reviewNotes: 'Verified credentials and conducted intake interview. Recommended for Sovereign Brotherhood.',
          reviewedByUserId: eyob.id,
        },
      ],
    });
  }

  // 6. Community Announcements
  const existingAnn = await prisma.announcement.findFirst();
  if (!existingAnn) {
    await prisma.announcement.createMany({
      data: [
        {
          title: 'Sovereign National Gathering 2026 - Official Announcement',
          content: 'Brothers, registration is officially open for the Annual Sovereign Gathering. 4 days of tactical seminars, keynote roundtables, wilderness navigation, and brotherhood elevation. Build the man. Carry the responsibility.',
          priority: 'URGENT',
          targetAudience: 'ALL',
          authorId: eyob.id,
          telegramSent: true,
        },
        {
          title: 'Q2 10,000-Pushup Brotherhood Challenge Launched',
          content: 'Discipline is our standard. The quarterly physical benchmark is now active in the Fitness Portal. Log your daily counts and compete on the leaderboard.',
          priority: 'HIGH',
          targetAudience: 'ALL',
          authorId: dawit.id,
          telegramSent: true,
        },
      ],
    });
  }

  // 7. Event Categories & Locations
  const catSummit = await prisma.eventCategory.upsert({
    where: { name: 'Summit' },
    update: {},
    create: { name: 'Summit', color: '#c99738', icon: 'Mountain' },
  });

  const catMastermind = await prisma.eventCategory.upsert({
    where: { name: 'Mastermind' },
    update: {},
    create: { name: 'Mastermind', color: '#2563eb', icon: 'Brain' },
  });

  const catExpedition = await prisma.eventCategory.upsert({
    where: { name: 'Brothers Ruck' },
    update: {},
    create: { name: 'Brothers Ruck', color: '#16a34a', icon: 'Compass' },
  });

  let locHall = await prisma.eventLocation.findFirst({ where: { city: 'Addis Ababa' } });
  if (!locHall) {
    locHall = await prisma.eventLocation.create({
      data: {
        name: 'Sovereign Central Hall',
        address: 'Bole Medhanialem Avenue',
        city: 'Addis Ababa',
        isVirtual: false,
      },
    });
  }

  let locEntoto = await prisma.eventLocation.findFirst({ where: { name: 'Entoto Wilderness Trails' } });
  if (!locEntoto) {
    locEntoto = await prisma.eventLocation.create({
      data: {
        name: 'Entoto Wilderness Trails',
        address: 'Entoto Hills Mountain Park',
        city: 'Addis Ababa',
        isVirtual: false,
      },
    });
  }

  let locVirtual = await prisma.eventLocation.findFirst({ where: { isVirtual: true } });
  if (!locVirtual) {
    locVirtual = await prisma.eventLocation.create({
      data: {
        name: 'Sovereign Command Room (Encrypted Virtual Stream)',
        isVirtual: true,
        virtualLink: 'https://live.sovereign.club/room/alpha',
      },
    });
  }

  // 8. Events
  const existingEvent = await prisma.event.findFirst();
  if (!existingEvent) {
    const event1 = await prisma.event.create({
      data: {
        title: 'Leadership Workshop: Carrying Responsibility',
        description: 'The duty of manhood in action. How Sovereign men lead in business, families, and brotherhood without excuse. Led by Eyob Haile.',
        categoryId: catSummit.id,
        locationId: locHall.id,
        organizerId: dawit.id,
        startTime: new Date(Date.now() + 86400000 * 2),
        endTime: new Date(Date.now() + 86400000 * 2 + 7200000),
        capacity: 150,
        registeredCount: 68,
        status: 'PUBLISHED',
        coverImage: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&fit=crop',
        telegramBroadcasted: true,
      },
    });

    const event2 = await prisma.event.create({
      data: {
        title: 'Brotherhood Fitness Bootcamp & 15km Ruck',
        description: 'Dawn endurance test in the hills. 15km heavy pack ruck and calisthenics brotherhood circuit.',
        categoryId: catExpedition.id,
        locationId: locEntoto.id,
        organizerId: dawit.id,
        startTime: new Date(Date.now() + 86400000 * 5),
        endTime: new Date(Date.now() + 86400000 * 5 + 14400000),
        capacity: 80,
        registeredCount: 45,
        status: 'PUBLISHED',
        coverImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&fit=crop',
        telegramBroadcasted: true,
      },
    });

    const event3 = await prisma.event.create({
      data: {
        title: 'Money Mastery: Wealth & Syndicate Session',
        description: 'Practical wealth creation, cashflow governance, and syndicating capital with vetted brothers.',
        categoryId: catMastermind.id,
        locationId: locVirtual.id,
        organizerId: eyob.id,
        startTime: new Date(Date.now() + 86400000 * 6),
        endTime: new Date(Date.now() + 86400000 * 6 + 7200000),
        capacity: 100,
        registeredCount: 72,
        status: 'PUBLISHED',
        coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&fit=crop',
        telegramBroadcasted: true,
      },
    });

    if (alex.member) {
      await prisma.eventRegistration.create({
        data: {
          eventId: event1.id,
          memberId: alex.member.id,
          status: 'CONFIRMED',
        },
      });

      await prisma.eventRegistration.create({
        data: {
          eventId: event2.id,
          memberId: alex.member.id,
          status: 'CONFIRMED',
        },
      });

      await prisma.attendance.create({
        data: {
          eventId: event1.id,
          memberId: alex.member.id,
          checkedInBy: dawit.id,
          method: 'QR_SCAN',
        },
      });
    }
  }

  // 9. Courses & Curriculum
  const existingCourse = await prisma.course.findFirst();
  if (!existingCourse) {
    await prisma.course.create({
      data: {
        title: 'The Duty of Manhood: Responsibility & Purpose (ወንድ መሆን እዳ ነው!)',
        slug: 'duty-of-manhood',
        description: 'The foundational Sovereign philosophy. Manhood is not a privilege; it is a duty to protect, provide, lead, and build. Taught by Eyob Haile.',
        category: 'Leadership & Duty',
        level: 'FOUNDATION',
        instructor: 'Eyob Haile',
        coverImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&fit=crop',
        modulesCount: 2,
        modules: {
          create: [
            {
              title: 'Module 1: The Duty of Manhood (ወንድ መሆን እዳ ነው!)',
              orderIndex: 1,
              lessons: {
                create: [
                  {
                    title: 'Lesson 1.1: Why Manhood is a Duty & Responsibility',
                    description: 'Eliminating the illusion of passivity. What it means to bear the weight.',
                    durationMinutes: 25,
                    orderIndex: 1,
                  },
                  {
                    title: 'Lesson 1.2: Moral Fortitude & Self-Governance',
                    description: 'Controlling desires, temper, and direction.',
                    durationMinutes: 30,
                    orderIndex: 2,
                  },
                ],
              },
            },
            {
              title: 'Module 2: Building Brotherhood & Family Leadership',
              orderIndex: 2,
              lessons: {
                create: [
                  {
                    title: 'Lesson 2.1: The Sovereign Standard in Relationships',
                    description: 'Courtship, mutual respect, and family building.',
                    durationMinutes: 35,
                    orderIndex: 1,
                  },
                ],
              },
            },
          ],
        },
      },
    });

    await prisma.course.create({
      data: {
        title: 'Money Series: Financial Sovereignty & Wealth Creation',
        slug: 'money-series-wealth',
        description: 'Core curriculum from the Money Mastery Hub. How to build businesses, manage capital, and invest alongside brothers.',
        category: 'Finance & Business',
        level: 'INTERMEDIATE',
        instructor: 'Yonas Kassa & Henok Solomon',
        coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&fit=crop',
        modulesCount: 1,
        modules: {
          create: [
            {
              title: 'Module 1: Escaping Financial Vulnerability',
              orderIndex: 1,
              lessons: {
                create: [
                  {
                    title: 'Lesson 1.1: Cashflow Architecture for Sovereign Men',
                    description: 'Understanding defensive financial structures and capital discipline.',
                    durationMinutes: 28,
                    orderIndex: 1,
                  },
                ],
              },
            },
          ],
        },
      },
    });
  }

  // 10. Books & Podcasts (Knowledge Library)
  const existingBook = await prisma.bookRecommendation.findFirst();
  if (!existingBook) {
    await prisma.bookRecommendation.createMany({
      data: [
        {
          title: 'Meditations',
          author: 'Marcus Aurelius',
          category: 'Philosophy & Stoicism',
          description: 'The definitive reflections on duty, resilience, and sovereign self-mastery.',
          coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&fit=crop',
          link: 'https://sovereign.club/books/meditations',
        },
        {
          title: 'The Sovereign Individual',
          author: 'James Dale Davidson & Lord William Rees-Mogg',
          category: 'Wealth & Autonomy',
          description: 'Mastering the transition to the information age, personal autonomy, and sovereign capital.',
          coverImage: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?w=400&fit=crop',
          link: 'https://sovereign.club/books/sovereign-individual',
        },
      ],
    });
  }

  const existingPod = await prisma.podcast.findFirst();
  if (!existingPod) {
    await prisma.podcast.createMany({
      data: [
        {
          title: 'Episode 01: ወንድ መሆን እዳ ነው! — Awakening the Sovereign Man',
          host: 'Eyob Haile',
          episodeNumber: 1,
          duration: '52m',
          description: 'Why Sovereign Men\'s Club was founded: duty, discipline, and building a brotherhood of purpose.',
        },
        {
          title: 'Episode 02: Money Series: Escaping Financial Weakness',
          host: 'Eyob Haile & Yonas Kassa',
          episodeNumber: 2,
          duration: '48m',
          description: 'Practical business ownership, career leverage, and building wealth that serves your family.',
        },
      ],
    });
  }

  // 11. Fitness Programs & Challenges
  const existingFit = await prisma.fitnessProgram.findFirst();
  if (!existingFit) {
    await prisma.fitnessProgram.create({
      data: {
        title: '6-Week Tactical Sovereign Protocol',
        description: 'High-density calisthenics, heavy compound lifting, and progressive rucking designed to forge physical resilience.',
        difficulty: 'BEAST',
        durationWeeks: 6,
        instructor: 'Dawit Tadesse',
        coverImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&fit=crop',
        workoutPlans: {
          create: [
            { dayOfWeek: 1, title: 'Day 1: Heavy Compound Strength & Pushups Ladder' },
            { dayOfWeek: 2, title: 'Day 2: 12km Weighted Pack Ruck (35lbs)' },
            { dayOfWeek: 3, title: 'Day 3: Pullups, Dips & Core Sovereignty' },
            { dayOfWeek: 4, title: 'Day 4: Active Recovery & Mobility Flow' },
            { dayOfWeek: 5, title: 'Day 5: High-Intensity Kettlebell Conditioning' },
          ],
        },
      },
    });

    const challenge = await prisma.fitnessChallenge.create({
      data: {
        title: 'Q2 10,000 Pushup Brotherhood Test',
        description: 'Accumulate 10,000 pushups across the quarter. Post daily tallies to the brotherhood log.',
        startDate: new Date(),
        endDate: new Date(Date.now() + 86400000 * 75),
        goalMetric: 'Total Pushups',
        targetValue: 10000,
        status: 'ACTIVE',
      },
    });

    if (alex.member) {
      await prisma.challengeParticipant.create({
        data: {
          challengeId: challenge.id,
          memberId: alex.member.id,
          currentValue: 1850,
          isCompleted: false,
        },
      });

      await prisma.fitnessProgress.create({
        data: {
          memberId: alex.member.id,
          weight: 184.5,
          bodyFat: 13.2,
          pushupsCount: 85,
          pullupsCount: 16,
          runningPace: '7:15 / mile',
          notes: 'Feeling peak energy and stamina. Morning rucks in Entoto have transformed endurance.',
        },
      });
    }
  }

  // 12. Community Service Projects
  const existingService = await prisma.serviceProject.findFirst();
  if (!existingService) {
    const serviceProject = await prisma.serviceProject.create({
      data: {
        title: 'Sovereign Youth Mentorship Initiative',
        description: 'Brothers mobilizing on Saturday to mentor high school and vocational young men in discipline, coding, trades, and personal responsibility.',
        location: 'Addis Ababa Youth Center',
        leaderId: dawit.id,
        startDate: new Date(Date.now() + 86400000 * 7),
        endDate: new Date(Date.now() + 86400000 * 8),
        targetVolunteers: 30,
        targetHours: 180,
        status: 'ACTIVE',
        impactRecords: {
          create: [
            { metricName: 'Young Men Mentored', metricValue: 95, description: 'Youth engaged in discipline & skills workshops' },
            { metricName: 'Vocational Toolkits Donated', metricValue: 25, description: 'Toolkits provided to vocational apprentices' },
          ],
        },
      },
    });

    if (alex.member) {
      await prisma.projectVolunteer.create({
        data: {
          projectId: serviceProject.id,
          memberId: alex.member.id,
          role: 'Carpentry & Setup Lead',
          status: 'CONFIRMED',
        },
      });

      await prisma.serviceHour.create({
        data: {
          projectId: serviceProject.id,
          memberId: alex.member.id,
          hours: 12,
          notes: 'Pre-construction inspection and material staging.',
          status: 'VERIFIED',
        },
      });
    }
  }

  // 13. Finance Setup
  const catDues = await prisma.financialCategory.upsert({
    where: { name: 'Membership Dues' },
    update: {},
    create: { name: 'Membership Dues', type: 'INCOME' },
  });

  const catEvents = await prisma.financialCategory.upsert({
    where: { name: 'Event Registration Fees' },
    update: {},
    create: { name: 'Event Registration Fees', type: 'INCOME' },
  });

  const catVenue = await prisma.financialCategory.upsert({
    where: { name: 'Gathering & Facility Expenses' },
    update: {},
    create: { name: 'Gathering & Facility Expenses', type: 'EXPENSE' },
  });

  const existingIncome = await prisma.income.findFirst();
  if (!existingIncome) {
    await prisma.income.createMany({
      data: [
        { categoryId: catDues.id, title: 'Annual Dues Batch Q1', amount: 14400, source: 'PORTAL_MEMBERS' },
        { categoryId: catEvents.id, title: 'National Gathering Ticket Deposits', amount: 8500, source: 'STRIPE_GATHERING' },
      ],
    });

    await prisma.expense.createMany({
      data: [
        {
          categoryId: catVenue.id,
          title: 'Sovereign Central Hall Gathering Deposit',
          amount: 3500,
          approvedById: eyob.id,
          notes: 'Securing main hall and media equipment for Leadership Workshop.',
        },
      ],
    });
  }

  // 14. Integrations Setup
  await prisma.integration.upsert({
    where: { serviceName: 'GOOGLE_FORMS' },
    update: {},
    create: {
      serviceName: 'GOOGLE_FORMS',
      status: 'CONNECTED',
      configJson: JSON.stringify({
        formId: '1FAIpQLSc_SovereignIntake_2026',
        targetSpreadsheetId: '1A2B3C4D5E6F7G8H9I_sovereign_applications',
        autoSyncIntervalMins: 30,
        mapping: {
          fullName: 'Full Name',
          email: 'Email Address',
          phone: 'Phone Number',
          occupation: 'Profession / Industry',
          reasonToJoin: 'Why do you seek Sovereign Brotherhood?',
        },
      }),
      lastSyncAt: new Date(Date.now() - 3600000),
      syncCount: 38,
    },
  });

  await prisma.integration.upsert({
    where: { serviceName: 'TELEGRAM_BOT' },
    update: {},
    create: {
      serviceName: 'TELEGRAM_BOT',
      status: 'CONNECTED',
      configJson: JSON.stringify({
        botUsername: '@SovereignMenClubBot',
        channelId: '@sovereign_mens_club_official',
        broadcastAlertsEnabled: true,
        welcomeMessageEnabled: true,
      }),
      lastSyncAt: new Date(),
      syncCount: 154,
    },
  });

  console.log("✅ Database seeded successfully with authentic SOVEREIGN MEN'S CLUB data!");
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
