import { Request, Response, NextFunction } from 'express';
import { MembersService } from './members.service.js';
import { getParam } from '../../utils/params.js';

export class MembersController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await MembersService.getAllMembers(req.query);
      return res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = getParam(req, 'id');
      const member = await MembersService.getMemberById(id);
      return res.json({ success: true, data: member });
    } catch (error) {
      next(error);
    }
  }

  static async verifyDigitalId(req: Request, res: Response, next: NextFunction) {
    try {
      const code = getParam(req, 'code');
      const result = await MembersService.getDigitalIdByCode(code);
      return res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const memberId = getParam(req, 'id');
      const userId = req.user!.id;
      const profile = await MembersService.updateMemberProfile(memberId, req.body, userId);
      return res.json({ success: true, data: profile });
    } catch (error) {
      next(error);
    }
  }

  static async getApplications(req: Request, res: Response, next: NextFunction) {
    try {
      const apps = await MembersService.getApplications(req.query);
      return res.json({ success: true, data: apps });
    } catch (error) {
      next(error);
    }
  }

  static async submitApplication(req: Request, res: Response, next: NextFunction) {
    try {
      const app = await MembersService.submitApplication(req.body);
      return res.status(201).json({ success: true, data: app });
    } catch (error) {
      next(error);
    }
  }

  static async reviewApplication(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, notes } = req.body;
      const id = getParam(req, 'id');
      const result = await MembersService.reviewApplication(id, status, notes, req.user!.id);
      return res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async verifyMember(req: Request, res: Response, next: NextFunction) {
    try {
      const id = getParam(req, 'id');
      const result = await MembersService.verifyMember(id, req.body, req.user!.id);
      return res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async getTypes(req: Request, res: Response, next: NextFunction) {
    try {
      const types = await MembersService.getMembershipTypes();
      return res.json({ success: true, data: types });
    } catch (error) {
      next(error);
    }
  }
}
