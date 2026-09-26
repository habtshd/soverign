import { Router } from 'express';
import { CommunityServiceController } from './service.controller.js';
import { authenticateToken } from '../../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

router.get('/projects', CommunityServiceController.getProjects);
router.post('/projects/:id/volunteer', CommunityServiceController.volunteer);
router.post('/projects/:id/hours', CommunityServiceController.logHours);

export default router;
