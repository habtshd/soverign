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

// Users, Roles & Permissions
router.get('/users', AdminController.getUsers);
router.get('/roles', AdminController.getRoles);
router.post('/users/:id/roles', AdminController.assignRoles);

// Backups & System Snapshots
router.post('/backup', AdminController.triggerBackup);

// Operational Reports
router.get('/reports', AdminController.getReports);

export default router;

