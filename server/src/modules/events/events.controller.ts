import { Request, Response, NextFunction } from 'express';
import { EventsService } from './events.service.js';
import { getParam } from '../../utils/params.js';

export class EventsController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const memberId = req.user?.memberId;
      const events = await EventsService.getAllEvents(req.query, memberId);
      return res.json({ success: true, data: events });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const memberId = req.user?.memberId;
      const id = getParam(req, 'id');
      const event = await EventsService.getEventById(id, memberId);
      return res.json({ success: true, data: event });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const event = await EventsService.createEvent(req.body, req.user!.id);
      return res.status(201).json({ success: true, data: event });
    } catch (error) {
      next(error);
    }
  }

  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const memberId = req.user?.memberId;
      if (!memberId) {
        return res.status(403).json({ success: false, error: 'Member profile required' });
      }
      const id = getParam(req, 'id');
      const reg = await EventsService.registerForEvent(id, memberId);
      return res.json({ success: true, data: reg });
    } catch (error) {
      next(error);
    }
  }

  static async cancelRegistration(req: Request, res: Response, next: NextFunction) {
    try {
      const memberId = req.user?.memberId;
      if (!memberId) {
        return res.status(403).json({ success: false, error: 'Member profile required' });
      }
      const id = getParam(req, 'id');
      const reg = await EventsService.cancelRegistration(id, memberId);
      return res.json({ success: true, data: reg });
    } catch (error) {
      next(error);
    }
  }

  static async checkIn(req: Request, res: Response, next: NextFunction) {
    try {
      const { memberCode, method } = req.body;
      const id = getParam(req, 'id');
      const result = await EventsService.checkInAttendance(id, memberCode, req.user!.id, method);
      return res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async feedback(req: Request, res: Response, next: NextFunction) {
    try {
      const memberId = req.user?.memberId;
      if (!memberId) return res.status(403).json({ success: false, error: 'Member profile required' });
      const { rating, comments } = req.body;
      const id = getParam(req, 'id');
      const fb = await EventsService.submitFeedback(id, memberId, Number(rating), comments);
      return res.json({ success: true, data: fb });
    } catch (error) {
      next(error);
    }
  }

  static async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const cats = await EventsService.getCategories();
      return res.json({ success: true, data: cats });
    } catch (error) {
      next(error);
    }
  }

  static async getLocations(req: Request, res: Response, next: NextFunction) {
    try {
      const locs = await EventsService.getLocations();
      return res.json({ success: true, data: locs });
    } catch (error) {
      next(error);
    }
  }
}
