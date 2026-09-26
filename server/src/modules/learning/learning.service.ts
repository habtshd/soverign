import prisma from '../../config/database.js';
import { AppError } from '../../middleware/errorHandler.js';

export class LearningService {
  static async getAllCourses(memberId?: string) {
    const courses = await prisma.course.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        modules: {
          include: {
            lessons: true,
          },
        },
        enrollments: memberId
          ? {
              where: { memberId },
            }
          : false,
      },
    });

    return courses.map((course) => {
      const enrollment = course.enrollments && course.enrollments.length > 0 ? course.enrollments[0] : null;
      return {
        ...course,
        isEnrolled: !!enrollment,
        progressPercent: enrollment ? enrollment.progressPercent : 0,
        status: enrollment ? enrollment.status : 'NOT_ENROLLED',
      };
    });
  }

  static async getCourseBySlug(slug: string, memberId?: string) {
    const course = await prisma.course.findUnique({
      where: { slug },
      include: {
        modules: {
          include: {
            lessons: {
              include: {
                progresses: memberId
                  ? {
                      where: { memberId },
                    }
                  : false,
              },
              orderBy: { orderIndex: 'asc' },
            },
          },
          orderBy: { orderIndex: 'asc' },
        },
        resources: true,
        certificates: memberId
          ? {
              where: { memberId },
            }
          : false,
      },
    });

    if (!course) {
      throw new AppError('Course not found', 404);
    }

    return course;
  }

  static async enrollInCourse(courseId: string, memberId: string) {
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new AppError('Course not found', 404);

    return prisma.enrollment.upsert({
      where: {
        courseId_memberId: { courseId, memberId },
      },
      update: {},
      create: {
        courseId,
        memberId,
        status: 'IN_PROGRESS',
        progressPercent: 0,
      },
    });
  }

  static async toggleLessonCompletion(lessonId: string, memberId: string) {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { module: true },
    });

    if (!lesson) throw new AppError('Lesson not found', 404);

    const existing = await prisma.lessonProgress.findUnique({
      where: {
        lessonId_memberId: { lessonId, memberId },
      },
    });

    const isCompleted = !existing?.isCompleted;

    const progress = await prisma.lessonProgress.upsert({
      where: {
        lessonId_memberId: { lessonId, memberId },
      },
      update: {
        isCompleted,
        completedAt: isCompleted ? new Date() : null,
      },
      create: {
        lessonId,
        memberId,
        isCompleted,
        completedAt: isCompleted ? new Date() : null,
      },
    });

    // Recalculate course overall progress
    const courseId = lesson.module.courseId;
    const allCourseLessons = await prisma.lesson.findMany({
      where: { module: { courseId } },
    });

    const completedCount = await prisma.lessonProgress.count({
      where: {
        memberId,
        lesson: { module: { courseId } },
        isCompleted: true,
      },
    });

    const progressPercent = Math.round((completedCount / (allCourseLessons.length || 1)) * 100);

    await prisma.enrollment.upsert({
      where: {
        courseId_memberId: { courseId, memberId },
      },
      update: {
        progressPercent,
        status: progressPercent === 100 ? 'COMPLETED' : 'IN_PROGRESS',
        completedAt: progressPercent === 100 ? new Date() : null,
      },
      create: {
        courseId,
        memberId,
        progressPercent,
        status: progressPercent === 100 ? 'COMPLETED' : 'IN_PROGRESS',
      },
    });

    return { progress, progressPercent };
  }

  static async getBooks() {
    return prisma.bookRecommendation.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getPodcasts() {
    return prisma.podcast.findMany({
      orderBy: { episodeNumber: 'desc' },
    });
  }
}
