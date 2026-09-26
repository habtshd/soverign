import { Request, Response, NextFunction } from 'express';
import { CommunityServiceService } from './service.service.js';
import { getParam } from '../../utils/params.js';

export class CommunityServiceController {
  static async getProjects(req: Request, res: Response, next: NextFunction) {
    try {
      const memberId = req.user?.memberId;
      const projects = await CommunityServiceService.getProjects(memberId);
      return res.json({ success: true, data: projects });
    } catch (error) {
      next(error);
    }
  }

  static async volunteer(req: Request, res: Response, next: NextFunction) {
    try {
      const memberId = req.user?.memberId;
      if (!memberId) return res.status(403).json({ success: false, error: 'Member profile required' });
      const id = getParam(req, 'id');
      const vol = await CommunityServiceService.volunteerForProject(id, memberId, req.body.role);
      return res.json({ success: true, data: vol });
    } catch (error) {
      next(error);
    }
  }

  static async logHours(req: Request, res: Response, next: NextFunction) {
    try {
      const memberId = req.user?.memberId;
      if (!memberId) return res.status(403).json({ success: false, error: 'Member profile required' });
      const id = getParam(req, 'id');
      const record = await CommunityServiceService.logServiceHours({
        projectId: id,
        memberId,
        hours: req.body.hours,
        notes: req.body.notes,
      });
      return res.status(201).json({ success: true, data: record });
    } catch (error) {
      next(error);
    }
  }
}
