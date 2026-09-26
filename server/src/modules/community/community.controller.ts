import { Request, Response, NextFunction } from 'express';
import { CommunityService } from './community.service.js';
import { getParam } from '../../utils/params.js';

export class CommunityController {
  static async getAnnouncements(req: Request, res: Response, next: NextFunction) {
    try {
      const list = await CommunityService.getAnnouncements();
      return res.json({ success: true, data: list });
    } catch (error) {
      next(error);
    }
  }

  static async createAnnouncement(req: Request, res: Response, next: NextFunction) {
    try {
      const ann = await CommunityService.createAnnouncement(req.body, req.user!.id);
      return res.status(201).json({ success: true, data: ann });
    } catch (error) {
      next(error);
    }
  }

  static async getPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const posts = await CommunityService.getPosts(req.user?.id);
      return res.json({ success: true, data: posts });
    } catch (error) {
      next(error);
    }
  }

  static async createPost(req: Request, res: Response, next: NextFunction) {
    try {
      const { content, mediaUrl } = req.body;
      const post = await CommunityService.createPost(req.user!.id, content, mediaUrl);
      return res.status(201).json({ success: true, data: post });
    } catch (error) {
      next(error);
    }
  }

  static async toggleLike(req: Request, res: Response, next: NextFunction) {
    try {
      const id = getParam(req, 'id');
      const result = await CommunityService.toggleLikePost(id, req.user!.id);
      return res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async addComment(req: Request, res: Response, next: NextFunction) {
    try {
      const id = getParam(req, 'id');
      const { content } = req.body;
      const comment = await CommunityService.addComment(id, req.user!.id, content);
      return res.status(201).json({ success: true, data: comment });
    } catch (error) {
      next(error);
    }
  }
}
