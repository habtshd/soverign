import { Request, Response, NextFunction } from 'express';
import { FinanceService } from './finance.service.js';

export class FinanceController {
  static async getOverview(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await FinanceService.getOverview();
      return res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const cats = await FinanceService.getCategories();
      return res.json({ success: true, data: cats });
    } catch (error) {
      next(error);
    }
  }

  static async recordExpense(req: Request, res: Response, next: NextFunction) {
    try {
      const expense = await FinanceService.recordExpense(req.body, req.user?.id);
      return res.status(201).json({ success: true, data: expense });
    } catch (error) {
      next(error);
    }
  }

  static async recordIncome(req: Request, res: Response, next: NextFunction) {
    try {
      const income = await FinanceService.recordIncome(req.body);
      return res.status(201).json({ success: true, data: income });
    } catch (error) {
      next(error);
    }
  }

  static async createInvoice(req: Request, res: Response, next: NextFunction) {
    try {
      const invoice = await FinanceService.createInvoice(req.body);
      return res.status(201).json({ success: true, data: invoice });
    } catch (error) {
      next(error);
    }
  }

  static async recordPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const payment = await FinanceService.recordPayment(req.body);
      return res.status(201).json({ success: true, data: payment });
    } catch (error) {
      next(error);
    }
  }
}
