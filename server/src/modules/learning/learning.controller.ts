import { Request, Response, NextFunction } from 'express';
import { LearningService } from './learning.service.js';
import { getParam } from '../../utils/params.js';

export class LearningController {
  static async getAllCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const memberId = req.user?.memberId;
      const courses = await LearningService.getAllCourses(memberId);
      return res.json({ success: true, data: courses });
    } catch (error) {
      next(error);
    }
  }

  static async getCourseBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const memberId = req.user?.memberId;
      const slug = getParam(req, 'slug');
      const course = await LearningService.getCourseBySlug(slug, memberId);
      return res.json({ success: true, data: course });
    } catch (error) {
      next(error);
    }
  }

  static async enroll(req: Request, res: Response, next: NextFunction) {
    try {
      const memberId = req.user?.memberId;
      if (!memberId) return res.status(403).json({ success: false, error: 'Member profile required' });
      const id = getParam(req, 'id');
      const enrollment = await LearningService.enrollInCourse(id, memberId);
      return res.json({ success: true, data: enrollment });
    } catch (error) {
      next(error);
    }
  }

  static async toggleLesson(req: Request, res: Response, next: NextFunction) {
    try {
      const memberId = req.user?.memberId;
      if (!memberId) return res.status(403).json({ success: false, error: 'Member profile required' });
      const lessonId = getParam(req, 'lessonId');
      const result = await LearningService.toggleLessonCompletion(lessonId, memberId);
      return res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async getBooks(req: Request, res: Response, next: NextFunction) {
    try {
      const books = await LearningService.getBooks();
      return res.json({ success: true, data: books });
    } catch (error) {
      next(error);
    }
  }

  static async getPodcasts(req: Request, res: Response, next: NextFunction) {
    try {
      const podcasts = await LearningService.getPodcasts();
      return res.json({ success: true, data: podcasts });
    } catch (error) {
      next(error);
    }
  }
}
