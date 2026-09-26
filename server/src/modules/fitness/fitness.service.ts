import prisma from '../../config/database.js';
import { AppError } from '../../middleware/errorHandler.js';

export class FitnessService {
  static async getPrograms() {
    return prisma.fitnessProgram.findMany({
      include: {
        workoutPlans: true,
      },
    });
  }

  static async getChallenges(memberId?: string) {
    const challenges = await prisma.fitnessChallenge.findMany({
      include: {
        participants: {
          include: {
            member: {
              include: {
                user: { select: { firstName: true, lastName: true, avatarUrl: true } },
              },
            },
          },
          orderBy: { currentValue: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return challenges.map((c) => {
      const myEntry = memberId ? c.participants.find((p) => p.memberId === memberId) : null;
      return {
        ...c,
        isJoined: !!myEntry,
        myValue: myEntry ? myEntry.currentValue : 0,
        myCompleted: myEntry ? myEntry.isCompleted : false,
      };
    });
  }

  static async joinChallenge(challengeId: string, memberId: string) {
    return prisma.challengeParticipant.upsert({
      where: {
        challengeId_memberId: { challengeId, memberId },
      },
      update: {},
      create: {
        challengeId,
        memberId,
        currentValue: 0,
      },
    });
  }

  static async updateChallengeProgress(challengeId: string, memberId: string, addedValue: number) {
    const participant = await prisma.challengeParticipant.findUnique({
      where: {
        challengeId_memberId: { challengeId, memberId },
      },
      include: { challenge: true },
    });

    if (!participant) {
      throw new AppError('Must join challenge first', 400);
    }

    const newValue = participant.currentValue + Number(addedValue);
    const isCompleted = newValue >= participant.challenge.targetValue;

    return prisma.challengeParticipant.update({
      where: {
        challengeId_memberId: { challengeId, memberId },
      },
      data: {
        currentValue: newValue,
        isCompleted,
      },
    });
  }

  static async logWorkoutSession(memberId: string, data: {
    workoutPlanId?: string;
    durationMinutes: number;
    caloriesBurned?: number;
    notes?: string;
  }) {
    return prisma.workoutSession.create({
      data: {
        memberId,
        workoutPlanId: data.workoutPlanId || null,
        durationMinutes: Number(data.durationMinutes),
        caloriesBurned: data.caloriesBurned ? Number(data.caloriesBurned) : null,
        notes: data.notes,
      },
    });
  }

  static async logFitnessProgress(memberId: string, data: {
    weight?: number;
    bodyFat?: number;
    pushupsCount?: number;
    pullupsCount?: number;
    runningPace?: string;
    notes?: string;
  }) {
    return prisma.fitnessProgress.create({
      data: {
        memberId,
        weight: data.weight ? Number(data.weight) : null,
        bodyFat: data.bodyFat ? Number(data.bodyFat) : null,
        pushupsCount: data.pushupsCount ? Number(data.pushupsCount) : null,
        pullupsCount: data.pullupsCount ? Number(data.pullupsCount) : null,
        runningPace: data.runningPace,
        notes: data.notes,
      },
    });
  }

  static async getMemberHistory(memberId: string) {
    const [workouts, progress, challenges] = await Promise.all([
      prisma.workoutSession.findMany({
        where: { memberId },
        include: { workoutPlan: true },
        orderBy: { date: 'desc' },
        take: 15,
      }),
      prisma.fitnessProgress.findMany({
        where: { memberId },
        orderBy: { date: 'desc' },
        take: 15,
      }),
      prisma.challengeParticipant.findMany({
        where: { memberId },
        include: { challenge: true },
      }),
    ]);

    return { workouts, progress, challenges };
  }
}
