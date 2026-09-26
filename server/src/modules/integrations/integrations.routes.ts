import { Router } from 'express';
import { IntegrationsController } from './integrations.controller.js';
import { authenticateToken } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/rbac.js';

const router = Router();

// Public webhook endpoint for Google Forms
router.post('/google/forms-webhook', IntegrationsController.handleFormsWebhook);

// Protected routes
router.use(authenticateToken);

router.get('/', requireRole('SUPER_ADMIN', 'ADMIN'), IntegrationsController.getIntegrations);
router.post('/google/sync', requireRole('SUPER_ADMIN', 'ADMIN'), IntegrationsController.syncSheets);
router.post('/telegram/link', IntegrationsController.linkTelegram);
router.post('/telegram/broadcast', requireRole('SUPER_ADMIN', 'ADMIN', 'ORGANIZER'), IntegrationsController.broadcastTelegram);

export default router;
