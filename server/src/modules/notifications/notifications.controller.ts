import { Request, Response, NextFunction } from 'express';
import { NotificationsService } from './notifications.service.js';
import { getParam } from '../../utils/params.js';

export class NotificationsController {
  static async getMine(req: Request, res: Response, next: NextFunction) {
    try {
      const list = await NotificationsService.getMyNotifications(req.user!.id);
      return res.json({ success: true, data: list });
    } catch (error) {
      next(error);
    }
  }

  static async markRead(req: Request, res: Response, next: NextFunction) {
    try {
      const id = getParam(req, 'id');
      await NotificationsService.markAsRead(id, req.user!.id);
      return res.json({ success: true });
    } catch (error) {
      next(error);
    }
  }

  static async markAllRead(req: Request, res: Response, next: NextFunction) {
    try {
      await NotificationsService.markAllAsRead(req.user!.id);
      return res.json({ success: true });
    } catch (error) {
      next(error);
    }
  }
}
