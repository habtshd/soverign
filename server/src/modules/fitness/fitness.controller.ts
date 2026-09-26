import { Request, Response, NextFunction } from 'express';
import { FitnessService } from './fitness.service.js';
import { getParam } from '../../utils/params.js';

export class FitnessController {
  static async getPrograms(req: Request, res: Response, next: NextFunction) {
    try {
      const programs = await FitnessService.getPrograms();
      return res.json({ success: true, data: programs });
    } catch (error) {
      next(error);
    }
  }

  static async getChallenges(req: Request, res: Response, next: NextFunction) {
    try {
      const memberId = req.user?.memberId;
      const challenges = await FitnessService.getChallenges(memberId);
      return res.json({ success: true, data: challenges });
    } catch (error) {
      next(error);
    }
  }

  static async joinChallenge(req: Request, res: Response, next: NextFunction) {
    try {
      const memberId = req.user?.memberId;
      if (!memberId) return res.status(403).json({ success: false, error: 'Member profile required' });
      const id = getParam(req, 'id');
      const entry = await FitnessService.joinChallenge(id, memberId);
      return res.json({ success: true, data: entry });
    } catch (error) {
      next(error);
    }
  }

  static async logChallengeProgress(req: Request, res: Response, next: NextFunction) {
    try {
      const memberId = req.user?.memberId;
      if (!memberId) return res.status(403).json({ success: false, error: 'Member profile required' });
      const { addedValue } = req.body;
      const id = getParam(req, 'id');
      const result = await FitnessService.updateChallengeProgress(id, memberId, Number(addedValue));
      return res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async logWorkout(req: Request, res: Response, next: NextFunction) {
    try {
      const memberId = req.user?.memberId;
      if (!memberId) return res.status(403).json({ success: false, error: 'Member profile required' });
      const session = await FitnessService.logWorkoutSession(memberId, req.body);
      return res.status(201).json({ success: true, data: session });
    } catch (error) {
      next(error);
    }
  }

  static async logProgress(req: Request, res: Response, next: NextFunction) {
    try {
      const memberId = req.user?.memberId;
      if (!memberId) return res.status(403).json({ success: false, error: 'Member profile required' });
      const progress = await FitnessService.logFitnessProgress(memberId, req.body);
      return res.status(201).json({ success: true, data: progress });
    } catch (error) {
      next(error);
    }
  }

  static async getHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const memberId = req.user?.memberId;
      if (!memberId) return res.status(403).json({ success: false, error: 'Member profile required' });
      const history = await FitnessService.getMemberHistory(memberId);
      return res.json({ success: true, data: history });
    } catch (error) {
      next(error);
    }
  }
}
