import { Router } from 'express';
import { FinanceController } from './finance.controller.js';
import { authenticateToken } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/rbac.js';

const router = Router();

router.use(authenticateToken);
router.use(requireRole('SUPER_ADMIN', 'ADMIN', 'FINANCE_MANAGER'));

router.get('/overview', FinanceController.getOverview);
router.get('/categories', FinanceController.getCategories);
router.post('/expenses', FinanceController.recordExpense);
router.post('/income', FinanceController.recordIncome);
router.post('/invoices', FinanceController.createInvoice);
router.post('/payments', FinanceController.recordPayment);

export default router;
