import { Request, Response, NextFunction } from 'express';
import { MentorshipService } from './mentorship.service.js';
import { getParam } from '../../utils/params.js';

export class MentorshipController {
  static async getAllMentors(req: Request, res: Response, next: NextFunction) {
    try {
      const mentors = await MentorshipService.getAllMentors();
      return res.json({ success: true, data: mentors });
    } catch (error) {
      next(error);
    }
  }

  static async getMyMentorship(req: Request, res: Response, next: NextFunction) {
    try {
      const memberId = req.user?.memberId;
      if (!memberId) return res.status(403).json({ success: false, error: 'Member profile required' });
      const data = await MentorshipService.getMyMentorship(memberId);
      return res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async scheduleSession(req: Request, res: Response, next: NextFunction) {
    try {
      const session = await MentorshipService.scheduleSession(req.body);
      return res.status(201).json({ success: true, data: session });
    } catch (error) {
      next(error);
    }
  }

  static async updateSession(req: Request, res: Response, next: NextFunction) {
    try {
      const id = getParam(req, 'id');
      const session = await MentorshipService.updateSession(id, req.body);
      return res.json({ success: true, data: session });
    } catch (error) {
      next(error);
    }
  }

  static async createGoal(req: Request, res: Response, next: NextFunction) {
    try {
      const goal = await MentorshipService.createGoal(req.body);
      return res.status(201).json({ success: true, data: goal });
    } catch (error) {
      next(error);
    }
  }

  static async updateGoal(req: Request, res: Response, next: NextFunction) {
    try {
      const id = getParam(req, 'id');
      const goal = await MentorshipService.updateGoal(id, req.body.status);
      return res.json({ success: true, data: goal });
    } catch (error) {
      next(error);
    }
  }

  static async addNote(req: Request, res: Response, next: NextFunction) {
    try {
      const authorId = req.user!.id;
      const note = await MentorshipService.addNote({
        ...req.body,
        authorId,
      });
      return res.status(201).json({ success: true, data: note });
    } catch (error) {
      next(error);
    }
  }
}
