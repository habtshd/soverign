import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service.js';
import { loginSchema, registerSchema } from './auth.dto.js';

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = loginSchema.parse(req.body);
      const ipAddress = req.ip || req.socket.remoteAddress;
      const userAgent = req.headers['user-agent'];
      const result = await AuthService.login(validated.email, validated.password, ipAddress, userAgent);
      return res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = registerSchema.parse(req.body);
      const ipAddress = req.ip || req.socket.remoteAddress;
      const result = await AuthService.register(validated, ipAddress);
      return res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }
      const user = await AuthService.getMe(req.user.id);
      return res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }
}
