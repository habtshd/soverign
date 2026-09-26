import { Router } from 'express';
import { FitnessController } from './fitness.controller.js';
import { authenticateToken } from '../../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

router.get('/programs', FitnessController.getPrograms);
router.get('/challenges', FitnessController.getChallenges);
router.post('/challenges/:id/join', FitnessController.joinChallenge);
router.post('/challenges/:id/progress', FitnessController.logChallengeProgress);
router.post('/workout', FitnessController.logWorkout);
router.post('/progress', FitnessController.logProgress);
router.get('/history', FitnessController.getHistory);

export default router;
