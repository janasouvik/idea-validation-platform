import { Router } from 'express';
import {
  createProblem,
  getPublicProblems,
  getPublicProblemById,
  supportProblem,
  submitTestInterest,
  reportAbuse,
} from '../controllers/problemController';
import { submissionLimiter, supportLimiter } from '../middlewares/rateLimiter';

const router = Router();

// Public problem exploration
router.get('/', getPublicProblems);
router.get('/:id', getPublicProblemById);

// Public problem submission with rate limiting
router.post('/', submissionLimiter, createProblem);

// Public support voting with rate limiting
router.post('/:id/support', supportLimiter, supportProblem);

// Public interest to test solutions
router.post('/:id/test-interest', submitTestInterest);

// Public abuse/spam reporting
router.post('/:id/report', reportAbuse);

export default router;
