import { Router } from 'express';
import { BusinessController } from './business.controller.js';
import { authenticateToken } from '../../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

router.get('/opportunities', BusinessController.getOpportunities);
router.post('/opportunities', BusinessController.createOpportunity);
router.get('/network', BusinessController.getBusinessProfiles);
router.post('/profile', BusinessController.upsertBusinessProfile);

router.get('/jobs', BusinessController.getJobs);
router.post('/jobs', BusinessController.createJob);
router.post('/jobs/:id/apply', BusinessController.applyForJob);

export default router;
