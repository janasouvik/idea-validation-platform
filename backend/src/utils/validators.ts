import { z } from 'zod';

export const createProblemSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(150, 'Title must be under 150 characters'),
  description: z
    .string()
    .min(20, 'Please describe the problem in at least 20 characters so we can understand it')
    .max(3000, 'Description must not exceed 3000 characters'),
  categoryId: z.string().uuid('Please select a valid category'),
  targetAudience: z
    .string()
    .min(2, 'Please specify who experiences this problem')
    .max(150, 'Target audience must be under 150 characters'),
  frequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'OCCASIONALLY', 'RARELY'], {
    errorMap: () => ({ message: 'Please select a valid frequency' }),
  }),
  impact: z.enum(
    ['TIME_WASTED', 'MONEY_LOST', 'UNNECESSARY_EFFORT', 'STRESS', 'MISSED_OPPORTUNITIES', 'OTHER'],
    {
      errorMap: () => ({ message: 'Please select a valid primary impact' }),
    }
  ),
  impactDetails: z.string().max(1000).optional().nullable(),
  currentWorkaround: z
    .string()
    .min(5, 'Please tell us how this is currently handled or if no workaround exists')
    .max(2000, 'Current workaround must be under 2000 characters'),
  missingFromSolutions: z.string().max(2000).optional().nullable(),
  willingnessToTest: z.enum(['YES', 'MAYBE', 'NO']).default('MAYBE'),
  broadLocation: z.string().max(100).optional().nullable(),
  contactEmail: z
    .string()
    .email('Please enter a valid email address')
    .optional()
    .or(z.literal(''))
    .nullable(),
  followUpConsent: z.boolean().default(false),
  publicDisplayConsent: z.boolean().default(false),
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid admin email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const moderationStatusSchema = z.object({
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'SPAM']),
});

export const researchStatusSchema = z.object({
  status: z.enum([
    'NEW',
    'UNDER_REVIEW',
    'RESEARCHING',
    'VALIDATION_NEEDED',
    'VALIDATING',
    'SELECTED',
    'NOT_SELECTED',
  ]),
  note: z.string().max(1000).optional(),
});

export const rubricScoreSchema = z.object({
  scoreFrequency: z.number().int().min(1).max(5),
  scoreSeverity: z.number().int().min(1).max(5),
  scoreUnmetDemand: z.number().int().min(1).max(5),
  scoreFeasibility: z.number().int().min(1).max(5),
  scoreUserAccess: z.number().int().min(1).max(5),
});

export const researchNoteSchema = z.object({
  content: z.string().min(3, 'Note must contain at least 3 characters').max(3000),
});

export const abuseReportSchema = z.object({
  reason: z.string().min(3, 'Please provide a reason').max(200),
  details: z.string().max(1000).optional().nullable(),
});

export const testInterestSchema = z.object({
  email: z.string().email('Please provide a valid email').optional().or(z.literal('')).nullable(),
  roleOrBackground: z.string().max(200).optional().nullable(),
});
