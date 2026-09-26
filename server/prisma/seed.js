"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Starting database seed for Sovereign Men\'s Club...');
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
    const defaultPasswordHash = await bcryptjs_1.default.hash('Password123!', 10);
    // 3. Create Key Users
    // Super Admin: Marcus Vance
    const marcus = await prisma.user.upsert({
        where: { email: 'admin@sovereign.club' },
        update: {},
        create: {
            email: 'admin@sovereign.club',
            passwordHash: defaultPasswordHash,
            firstName: 'Marcus',
            lastName: 'Vance',
            phone: '+1 (555) 234-8890',
            avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
            status: 'ACTIVE',
            roles: {
                create: [
                    { roleId: superAdminRole.id },
                    { roleId: adminRole.id },
                ],
            },
            member: {
                create: {
                    memberNumber: 'SOV-001',
                    membershipTypeId: foundingType.id,
                    status: 'ACTIVE',
                    digitalIdCode: 'SOV-EXEC-0001-ALPHA',
                    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=SOV-EXEC-0001-ALPHA',
                    badgeTier: 'SOVEREIGN_COUNCIL',
                    serviceHoursTotal: 120,
                    profile: {
                        create: {
                            bio: 'Founding Chairman of Sovereign Men\'s Club. Committed to brotherhood, resilience, and multi-generational legacy.',
                            city: 'Austin',
                            country: 'United States',
                            profession: 'Private Equity & Strategy',
                            company: 'Vance Capital Holdings',
                            telegramHandle: '@marcus_vance',
                            tShirtSize: 'XL',
                        },
                    },
                },
            },
        },
        include: { member: true },
    });
    // Organizer: David Sterling
    const david = await prisma.user.upsert({
        where: { email: 'organizer@sovereign.club' },
        update: {},
        create: {
            email: 'organizer@sovereign.club',
            passwordHash: defaultPasswordHash,
            firstName: 'David',
            lastName: 'Sterling',
            phone: '+1 (555) 345-6789',
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
                            bio: 'Head of Expeditions and Summits. Former Special Operations Logistics.',
                            city: 'Denver',
                            country: 'United States',
                            profession: 'Expedition Director',
                            company: 'Summit Dynamics',
                            telegramHandle: '@david_sterling_ops',
                            tShirtSize: 'L',
                        },
                    },
                },
            },
        },
        include: { member: true },
    });
    // Mentor: James "Iron" Thorne
    const james = await prisma.user.upsert({
        where: { email: 'mentor@sovereign.club' },
        update: {},
        create: {
            email: 'mentor@sovereign.club',
            passwordHash: defaultPasswordHash,
            firstName: 'James',
            lastName: 'Thorne',
            phone: '+1 (555) 456-7890',
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
                            bio: 'Founding Mentor. 18 years in executive leadership, commercial real estate, and elite physical discipline.',
                            city: 'Dallas',
                            country: 'United States',
                            profession: 'Managing Partner',
                            company: 'Thorne Assets',
                            telegramHandle: '@james_thorne',
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
    // Finance Manager: Ethan Wright
    await prisma.user.upsert({
        where: { email: 'finance@sovereign.club' },
        update: {},
        create: {
            email: 'finance@sovereign.club',
            passwordHash: defaultPasswordHash,
            firstName: 'Ethan',
            lastName: 'Wright',
            phone: '+1 (555) 567-8901',
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
                            bio: 'Treasurer and Financial Controller. CPA, specialized in sovereign asset structures.',
                            city: 'Chicago',
                            country: 'United States',
                            profession: 'CPA & Financial Strategist',
                            company: 'Wright Advisory Group',
                            telegramHandle: '@ethan_wright',
                            tShirtSize: 'M',
                        },
                    },
                },
            },
        },
    });
    // Regular Member: Alexander Cole
    const alex = await prisma.user.upsert({
        where: { email: 'alex@sovereign.club' },
        update: {},
        create: {
            email: 'alex@sovereign.club',
            passwordHash: defaultPasswordHash,
            firstName: 'Alexander',
            lastName: 'Cole',
            phone: '+1 (555) 678-9012',
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
                            bio: 'Software founder expanding into physical fitness, community service, and sovereign living.',
                            city: 'Seattle',
                            country: 'United States',
                            profession: 'Tech Founder & Engineer',
                            company: 'Aether Systems',
                            telegramHandle: '@alex_cole_dev',
                            tShirtSize: 'L',
                        },
                    },
                    interests: {
                        create: [
                            { interest: 'Physical Fitness' },
                            { interest: 'Financial Sovereignty' },
                            { interest: 'Mentorship' },
                        ],
                    },
                    skills: {
                        create: [
                            { skill: 'Software Architecture', proficiency: 'EXPERT' },
                            { skill: 'Endurance Running', proficiency: 'INTERMEDIATE' },
                        ],
                    },
                },
            },
        },
        include: { member: true },
    });
    // 4. Mentorship Match
    if (james.member?.mentorProfile && alex.member) {
        const match = await prisma.mentorshipMatch.upsert({
            where: {
                mentorId_menteeId: {
                    mentorId: james.member.mentorProfile.id,
                    menteeId: alex.member.id,
                },
            },
            update: {},
            create: {
                mentorId: james.member.mentorProfile.id,
                menteeId: alex.member.id,
                status: 'ACTIVE',
                focusArea: 'Executive Decision Making & Capital Deployment',
            },
        });
        // Mentorship Session
        await prisma.mentorshipSession.createMany({
            data: [
                {
                    matchId: match.id,
                    scheduledAt: new Date(Date.now() + 86400000 * 3), // 3 days in future
                    durationMinutes: 60,
                    status: 'SCHEDULED',
                    meetingLink: 'https://meet.sovereign.club/mentor-thorne-cole',
                    agenda: 'Review Q2 capital allocation plan and physical conditioning milestone.',
                },
                {
                    matchId: match.id,
                    scheduledAt: new Date(Date.now() - 86400000 * 10), // 10 days ago
                    durationMinutes: 45,
                    status: 'COMPLETED',
                    summaryNotes: 'Completed baseline diagnostic. Set target to achieve 15 strict pullups and build 6-month sovereign liquidity cushion.',
                },
            ],
        });
        // Mentorship Goals
        await prisma.mentorshipGoal.createMany({
            data: [
                {
                    matchId: match.id,
                    title: 'Establish 6-Month Emergency & Opportunity Reserve',
                    description: 'Deploy liquid cash reserves into high-yield sovereign accounts.',
                    status: 'IN_PROGRESS',
                },
                {
                    matchId: match.id,
                    title: 'Complete 20km Wilderness Ruck with 40lb pack',
                    description: 'Preparation for Sovereign Brotherhood Summit in October.',
                    status: 'IN_PROGRESS',
                },
            ],
        });
        // Mentorship Note
        await prisma.mentorshipNote.create({
            data: {
                matchId: match.id,
                authorId: james.id,
                note: 'Alexander demonstrates exceptional discipline and coachability. Ready for advanced leadership responsibility.',
                isPrivate: false,
            },
        });
    }
    // 5. Member Applications (from Google Forms & Direct)
    await prisma.memberApplication.createMany({
        data: [
            {
                fullName: 'Harrison Bell',
                email: 'harrison.bell@example.com',
                phone: '+1 (555) 789-0123',
                occupation: 'Mechanical Engineer & Contractor',
                company: 'Apex Builders',
                city: 'Charlotte, NC',
                reasonToJoin: 'Seeking high-caliber men for accountability, tactical fitness, and meaningful community building.',
                source: 'GOOGLE_FORMS',
                status: 'UNDER_REVIEW',
                googleFormResponseId: '2_ABaOnudK984xLqJ7819_Sheets',
            },
            {
                fullName: 'Darius Vance-Kemp',
                email: 'darius.vk@example.com',
                phone: '+1 (555) 890-1234',
                occupation: 'Commercial Pilot',
                company: 'Global Cargo',
                city: 'Atlanta, GA',
                reasonToJoin: 'Looking to give back through community service and connect with like-minded disciplined men.',
                source: 'DIRECT',
                status: 'SUBMITTED',
            },
            {
                fullName: 'Lucas Meyer',
                email: 'lucas.meyer@example.com',
                phone: '+1 (555) 901-2345',
                occupation: 'Attorney at Law',
                company: 'Meyer & Partners',
                city: 'Nashville, TN',
                reasonToJoin: 'Align with Sovereign principles of physical vitality, legal asset protection, and mentorship.',
                source: 'GOOGLE_FORMS',
                status: 'APPROVED',
                reviewNotes: 'Verified credentials and conducted intake interview. Recommended for Executive Membership.',
                reviewedByUserId: marcus.id,
            },
        ],
    });
    // 6. Community Announcements
    await prisma.announcement.createMany({
        data: [
            {
                title: '2026 Sovereign Annual Summit - Blue Ridge Mountain Retreat',
                content: 'Brothers, registration is officially open for the Annual Summit October 14-18, 2026. 4 days of tactical seminars, keynote roundtables, wilderness navigation, and brotherhood elevation. Secure your registration.',
                priority: 'URGENT',
                targetAudience: 'ALL',
                authorId: marcus.id,
                telegramSent: true,
            },
            {
                title: 'Q2 10,000-Pushup Brotherhood Challenge Launched',
                content: 'Discipline is our standard. The quarterly physical benchmark is now active in the Fitness Portal. Log your daily counts and compete on the leaderboard.',
                priority: 'HIGH',
                targetAudience: 'ALL',
                authorId: david.id,
                telegramSent: true,
            },
        ],
    });
    // 7. Community Feed Posts
    const post1 = await prisma.post.create({
        data: {
            authorId: james.id,
            content: 'True sovereignty starts with physical vitality and stoic emotional governance. If you cannot govern your own impulses at 05:00 AM, you cannot govern your family, your business, or your destiny.',
            likesCount: 24,
            commentsCount: 3,
        },
    });
    await prisma.comment.createMany({
        data: [
            {
                postId: post1.id,
                authorId: alex.id,
                content: 'Rucking 8 miles at dawn today proved this. Standards do not compromise.',
            },
            {
                postId: post1.id,
                authorId: david.id,
                content: 'Iron sharpens iron. Outstanding words James.',
            },
        ],
    });
    // 8. Event Categories & Locations
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
    const locLodge = await prisma.eventLocation.create({
        data: {
            name: 'Sovereign Mountain Lodge',
            address: '742 Ridge Line Highway',
            city: 'Asheville, NC',
            isVirtual: false,
        },
    });
    const locVirtual = await prisma.eventLocation.create({
        data: {
            name: 'Sovereign Command Room (Encrypted Virtual)',
            isVirtual: true,
            virtualLink: 'https://live.sovereign.club/room/alpha',
        },
    });
    // 9. Events
    const event1 = await prisma.event.create({
        data: {
            title: 'Sovereign National Summit 2026',
            description: 'The defining gathering of the Sovereign Men\'s Club. Leadership symposia, wilderness challenges, high-stakes networking, and council ceremonies.',
            categoryId: catSummit.id,
            locationId: locLodge.id,
            organizerId: david.id,
            startTime: new Date(Date.now() + 86400000 * 20),
            endTime: new Date(Date.now() + 86400000 * 24),
            capacity: 100,
            registeredCount: 42,
            status: 'PUBLISHED',
            coverImage: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&fit=crop',
            telegramBroadcasted: true,
        },
    });
    const event2 = await prisma.event.create({
        data: {
            title: 'Private Wealth & Asset Protection Mastermind',
            description: 'Deep-dive session with elite tax strategists, trust attorneys, and foreign jurisdiction structuring for sovereign family wealth.',
            categoryId: catMastermind.id,
            locationId: locVirtual.id,
            organizerId: marcus.id,
            startTime: new Date(Date.now() + 86400000 * 5),
            endTime: new Date(Date.now() + 86400000 * 5 + 7200000),
            capacity: 50,
            registeredCount: 31,
            status: 'PUBLISHED',
            coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&fit=crop',
            telegramBroadcasted: true,
        },
    });
    // Registrations & Attendance
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
                eventId: event2.id,
                memberId: alex.member.id,
                checkedInBy: david.id,
                method: 'QR_SCAN',
            },
        });
    }
    // 10. Learning & Knowledge
    const course1 = await prisma.course.create({
        data: {
            title: 'Foundations of Sovereign Leadership',
            slug: 'foundations-sovereign-leadership',
            description: 'The core philosophical, physical, and tactical principles every Sovereign brother must embody. Moving from dependence to complete sovereignty.',
            category: 'Leadership & Mindset',
            level: 'FOUNDATION',
            instructor: 'Marcus Vance & James Thorne',
            coverImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&fit=crop',
            modulesCount: 3,
            modules: {
                create: [
                    {
                        title: 'Module 1: The Sovereign Mental Fortress',
                        orderIndex: 1,
                        lessons: {
                            create: [
                                {
                                    title: 'Lesson 1.1: Radical Ownership & Stoic Sovereignty',
                                    description: 'Eliminating victimhood and engineering personal accountability.',
                                    durationMinutes: 20,
                                    orderIndex: 1,
                                },
                                {
                                    title: 'Lesson 1.2: Emotional Governance in Crisis',
                                    description: 'Physiological and psychological drills for staying clear-headed.',
                                    durationMinutes: 25,
                                    orderIndex: 2,
                                },
                            ],
                        },
                    },
                    {
                        title: 'Module 2: Tactical Life Architecture',
                        orderIndex: 2,
                        lessons: {
                            create: [
                                {
                                    title: 'Lesson 2.1: Designing Non-Negotiable Standards',
                                    description: 'Creating daily routines and boundaries.',
                                    durationMinutes: 30,
                                    orderIndex: 1,
                                },
                            ],
                        },
                    },
                ],
            },
        },
    });
    // Book Recommendations
    await prisma.bookRecommendation.createMany({
        data: [
            {
                title: 'Meditations',
                author: 'Marcus Aurelius',
                category: 'Philosophy & Stoicism',
                description: 'The definitive reflections of the Roman emperor on duty, resilience, and sovereign self-mastery.',
                coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&fit=crop',
                link: 'https://sovereign.club/books/meditations',
            },
            {
                title: 'The Sovereign Individual',
                author: 'James Dale Davidson & Lord William Rees-Mogg',
                category: 'Wealth & Geo-Politics',
                description: 'Mastering the transition to the information age, personal autonomy, and sovereign capital.',
                coverImage: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?w=400&fit=crop',
                link: 'https://sovereign.club/books/sovereign-individual',
            },
        ],
    });
    // Podcasts
    await prisma.podcast.createMany({
        data: [
            {
                title: 'Episode 01: The Creed of the Modern Sovereign Man',
                host: 'Marcus Vance',
                episodeNumber: 1,
                duration: '48m',
                description: 'Why the Sovereign Men\'s Club was founded and how brothers across the world are reclaiming vitality.',
            },
            {
                title: 'Episode 02: Building Generational Fortresses',
                host: 'James Thorne & Ethan Wright',
                episodeNumber: 2,
                duration: '56m',
                description: 'Tax minimization, trust law, and instilling work ethic in your heirs.',
            },
        ],
    });
    // 11. Fitness Programs & Challenges
    const program = await prisma.fitnessProgram.create({
        data: {
            title: '6-Week Tactical Spartan Protocol',
            description: 'High-density calisthenics, heavy compound lifting, and progressive rucking designed to forge combat-ready physical resilience.',
            difficulty: 'BEAST',
            durationWeeks: 6,
            instructor: 'James Thorne',
            coverImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&fit=crop',
            workoutPlans: {
                create: [
                    { dayOfWeek: 1, title: 'Day 1: Heavy Compound Strength & Pushups Ladder' },
                    { dayOfWeek: 2, title: 'Day 2: 10km Weighted Pack Ruck (35lbs)' },
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
                notes: 'Feeling peak energy and stamina. Morning rucks have transformed endurance.',
            },
        });
    }
    // 12. Business & Career
    await prisma.businessOpportunity.createMany({
        data: [
            {
                title: 'Series A Co-Investment: Autonomous Logistics Tech',
                company: 'Apex Robotics Inc.',
                description: 'Vetted allocation in high-growth robotics automation software. Sovereign member preferred terms.',
                investmentRange: '$50,000 - $250,000',
                contactPerson: 'David Sterling',
                contactEmail: 'syndicate@sovereign.club',
                status: 'OPEN',
            },
            {
                title: 'Commercial Storage Facility Acquisition - Dallas, TX',
                company: 'Thorne Capital',
                description: 'Value-add industrial asset with 14% projected IRR and tax-advantaged bonus depreciation.',
                investmentRange: '$100,000 Minimum',
                contactPerson: 'James Thorne',
                contactEmail: 'james@thorneassets.com',
                status: 'OPEN',
            },
        ],
    });
    await prisma.jobPost.createMany({
        data: [
            {
                title: 'Director of Business Development',
                company: 'Vance Capital Holdings',
                location: 'Austin, TX (Hybrid)',
                employmentType: 'FULL_TIME',
                salaryRange: '$160,000 - $220,000 + Equity',
                description: 'Leading strategic partnerships and client acquisitions for private equity acquisitions.',
                requirements: '7+ years enterprise sales, high integrity, disciplined mindset.',
                postedByUserId: marcus.id,
            },
        ],
    });
    // 13. Community Service Projects
    const serviceProject = await prisma.serviceProject.create({
        data: {
            title: 'Operation Warmth: Youth Shelter Renovation',
            description: 'Brothers mobilizing on Saturday to rebuild roofing, electrical fixtures, and recreation equipment for at-risk youth boys center.',
            location: 'Asheville Community Center',
            leaderId: david.id,
            startDate: new Date(Date.now() + 86400000 * 7),
            endDate: new Date(Date.now() + 86400000 * 8),
            targetVolunteers: 25,
            targetHours: 150,
            status: 'ACTIVE',
            impactRecords: {
                create: [
                    { metricName: 'Facilities Restored', metricValue: 3, description: 'Classrooms and gym refurbished' },
                    { metricName: 'Youth Impacted', metricValue: 80, description: 'Young men benefiting from improved shelter' },
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
    // 14. Finance: Invoices & Transactions
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
        where: { name: 'Lodge & Facility Expenses' },
        update: {},
        create: { name: 'Lodge & Facility Expenses', type: 'EXPENSE' },
    });
    if (alex.member) {
        const inv = await prisma.invoice.create({
            data: {
                invoiceNumber: 'INV-2026-0042',
                memberId: alex.member.id,
                amount: 300,
                dueDate: new Date(Date.now() + 86400000 * 30),
                status: 'PAID',
                itemsJson: JSON.stringify([{ description: 'Annual Sovereign Membership Dues 2026', amount: 300 }]),
            },
        });
        await prisma.payment.create({
            data: {
                invoiceId: inv.id,
                memberId: alex.member.id,
                amount: 300,
                paymentMethod: 'CREDIT_CARD',
                referenceNumber: 'STRIPE_CH_9948194',
                status: 'COMPLETED',
            },
        });
    }
    await prisma.income.createMany({
        data: [
            { categoryId: catDues.id, title: 'Annual Dues Batch Q1', amount: 14400, source: 'PORTAL_MEMBERS' },
            { categoryId: catEvents.id, title: 'National Summit Ticket Deposits', amount: 8500, source: 'STRIPE_SUMMIT' },
        ],
    });
    await prisma.expense.createMany({
        data: [
            {
                categoryId: catVenue.id,
                title: 'Asheville Mountain Lodge Retreat Deposit',
                amount: 3500,
                approvedById: marcus.id,
                notes: 'Securing main lodge and cabins for October Brotherhood Summit.',
            },
        ],
    });
    // 15. Integrations Setup
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
            lastSyncAt: new Date(Date.now() - 3600000), // 1 hr ago
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
    // 16. Audit Logs
    await prisma.auditLog.createMany({
        data: [
            {
                userId: marcus.id,
                action: 'APPROVE',
                entity: 'MemberApplication',
                entityId: 'app-lucas-meyer',
                details: JSON.stringify({ applicant: 'Lucas Meyer', status: 'APPROVED' }),
            },
            {
                userId: david.id,
                action: 'CREATE',
                entity: 'Event',
                entityId: event1.id,
                details: JSON.stringify({ title: 'Sovereign National Summit 2026' }),
            },
        ],
    });
    // 17. Notifications for Alexander
    await prisma.notification.createMany({
        data: [
            {
                userId: alex.id,
                title: 'Welcome to the Sovereign Brotherhood',
                message: 'Your Digital Member ID SOV-MEMB-0108-ZETA is active. Access your credentials in the Member Portal.',
                type: 'SUCCESS',
                link: '/member/membership',
            },
            {
                userId: alex.id,
                title: 'Mentorship Session Confirmed',
                message: 'James Thorne has accepted your session for Saturday 10:00 AM.',
                type: 'INFO',
                link: '/member/mentorship',
            },
            {
                userId: alex.id,
                title: 'New Event: National Summit 2026',
                message: 'Early bird registration is open for brothers in good standing.',
                type: 'INFO',
                link: '/member/events',
            },
        ],
    });
    console.log('✅ Database seeded successfully with real relational records!');
}
main()
    .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
