import { Router } from 'express';
import { MentorshipController } from './mentorship.controller.js';
import { authenticateToken } from '../../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

router.get('/mentors', MentorshipController.getAllMentors);
router.get('/my-mentorship', MentorshipController.getMyMentorship);
router.post('/sessions', MentorshipController.scheduleSession);
router.patch('/sessions/:id', MentorshipController.updateSession);
router.post('/goals', MentorshipController.createGoal);
router.patch('/goals/:id', MentorshipController.updateGoal);
router.post('/notes', MentorshipController.addNote);

export default router;
