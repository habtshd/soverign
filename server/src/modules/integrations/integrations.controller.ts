import { Request, Response, NextFunction } from 'express';
import { IntegrationsService } from './integrations.service.js';

export class IntegrationsController {
  static async getIntegrations(req: Request, res: Response, next: NextFunction) {
    try {
      const list = await IntegrationsService.getIntegrations();
      return res.json({ success: true, data: list });
    } catch (error) {
      next(error);
    }
  }

  static async handleFormsWebhook(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await IntegrationsService.handleGoogleFormsWebhook(req.body);
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async syncSheets(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await IntegrationsService.syncGoogleSheets(req.user?.id);
      return res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async linkTelegram(req: Request, res: Response, next: NextFunction) {
    try {
      const { telegramUsername } = req.body;
      const result = await IntegrationsService.linkTelegramAccount(req.user!.id, telegramUsername);
      return res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async broadcastTelegram(req: Request, res: Response, next: NextFunction) {
    try {
      const { announcementId } = req.body;
      const result = await IntegrationsService.broadcastTelegramAnnouncement(announcementId, req.user?.id);
      return res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}
