import { Request, Response, NextFunction } from 'express';
import { BusinessService } from './business.service.js';
import { getParam } from '../../utils/params.js';

export class BusinessController {
  static async getOpportunities(req: Request, res: Response, next: NextFunction) {
    try {
      const opps = await BusinessService.getOpportunities();
      return res.json({ success: true, data: opps });
    } catch (error) {
      next(error);
    }
  }

  static async createOpportunity(req: Request, res: Response, next: NextFunction) {
    try {
      const opp = await BusinessService.createOpportunity(req.body);
      return res.status(201).json({ success: true, data: opp });
    } catch (error) {
      next(error);
    }
  }

  static async getBusinessProfiles(req: Request, res: Response, next: NextFunction) {
    try {
      const profiles = await BusinessService.getBusinessProfiles();
      return res.json({ success: true, data: profiles });
    } catch (error) {
      next(error);
    }
  }

  static async upsertBusinessProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const memberId = req.user?.memberId;
      if (!memberId) return res.status(403).json({ success: false, error: 'Member profile required' });
      const profile = await BusinessService.upsertBusinessProfile(memberId, req.body);
      return res.json({ success: true, data: profile });
    } catch (error) {
      next(error);
    }
  }

  static async getJobs(req: Request, res: Response, next: NextFunction) {
    try {
      const jobs = await BusinessService.getJobs();
      return res.json({ success: true, data: jobs });
    } catch (error) {
      next(error);
    }
  }

  static async createJob(req: Request, res: Response, next: NextFunction) {
    try {
      const job = await BusinessService.createJob(req.body, req.user!.id);
      return res.status(201).json({ success: true, data: job });
    } catch (error) {
      next(error);
    }
  }

  static async applyForJob(req: Request, res: Response, next: NextFunction) {
    try {
      const memberId = req.user?.memberId;
      if (!memberId) return res.status(403).json({ success: false, error: 'Member profile required' });
      const id = getParam(req, 'id');
      const app = await BusinessService.applyForJob(id, memberId, req.body);
      return res.status(201).json({ success: true, data: app });
    } catch (error) {
      next(error);
    }
  }
}
