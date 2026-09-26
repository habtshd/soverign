import { Request, Response, NextFunction } from 'express';
import { AdminService } from './admin.service.js';

export class AdminController {
  static async getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AdminService.getDashboardMetrics();
      return res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async getAuditLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AdminService.getAuditLogs(req.query);
      return res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  static async getSettings(req: Request, res: Response, next: NextFunction) {
    try {
      const settings = await AdminService.getSettings();
      return res.json({ success: true, data: settings });
    } catch (error) {
      next(error);
    }
  }

  static async updateSetting(req: Request, res: Response, next: NextFunction) {
    try {
      const { key, value, description } = req.body;
      const setting = await AdminService.updateSetting(key, value, description);
      return res.json({ success: true, data: setting });
    } catch (error) {
      next(error);
    }
  }

  static async search(req: Request, res: Response, next: NextFunction) {
    try {
      const query = (req.query.q as string) || '';
      const results = await AdminService.globalSearch(query);
      return res.json({ success: true, data: results });
    } catch (error) {
      next(error);
    }
  }
}
