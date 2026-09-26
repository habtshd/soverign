import { Router } from 'express';
import { AdminController } from './admin.controller.js';
import { authenticateToken } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/rbac.js';

const router = Router();

router.use(authenticateToken);
router.use(requireRole('SUPER_ADMIN', 'ADMIN'));

router.get('/dashboard', AdminController.getDashboard);
router.get('/audit-logs', AdminController.getAuditLogs);
router.get('/settings', AdminController.getSettings);
router.post('/settings', AdminController.updateSetting);
router.get('/search', AdminController.search);

export default router;
