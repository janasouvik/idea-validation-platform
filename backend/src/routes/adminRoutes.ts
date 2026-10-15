import { Router } from 'express';
import {
  login,
  getMe,
  getDashboardStats,
  getAdminProblems,
  getAdminProblemById,
  updateModerationStatus,
  updateResearchStatus,
  updateRubricScore,
  addResearchNote,
  getAnalytics,
  exportProblemsCsv,
  deleteProblem,
} from '../controllers/adminController';
import { authenticateAdmin } from '../middlewares/auth';

const router = Router();

// Public Admin Auth
router.post('/auth/login', login);

// Protected Admin Routes
router.use(authenticateAdmin);

router.get('/auth/me', getMe);
router.get('/dashboard', getDashboardStats);
router.get('/problems', getAdminProblems);
router.get('/problems/:id', getAdminProblemById);
router.patch('/problems/:id/moderation', updateModerationStatus);
router.patch('/problems/:id/research-status', updateResearchStatus);
router.put('/problems/:id/score', updateRubricScore);
router.post('/problems/:id/notes', addResearchNote);
router.delete('/problems/:id', deleteProblem);
router.get('/analytics', getAnalytics);
router.get('/export', exportProblemsCsv);

export default router;
