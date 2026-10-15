import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma';
import { AuthenticatedRequest } from '../middlewares/auth';
import {
  loginSchema,
  moderationStatusSchema,
  researchStatusSchema,
  rubricScoreSchema,
  researchNoteSchema,
} from '../utils/validators';
import { AppError } from '../middlewares/errorHandler';

/**
 * Admin: Login
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    const secret = process.env.JWT_SECRET || 'problempulse_super_secret_jwt_key_2026_cs_major_project';
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
      secret,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Get current logged-in admin user
 */
export const getMe = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res.status(200).json({
      success: true,
      user: req.admin,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Get dashboard overview metrics
 */
export const getDashboardStats = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const [
      totalSubmissions,
      pendingCount,
      approvedCount,
      rejectedCount,
      spamCount,
      volunteersCount,
      testInterestsCount,
      categoriesCount,
      researchStatusGroups,
    ] = await Promise.all([
      prisma.problemSubmission.count(),
      prisma.problemSubmission.count({ where: { moderationStatus: 'PENDING' } }),
      prisma.problemSubmission.count({ where: { moderationStatus: 'APPROVED' } }),
      prisma.problemSubmission.count({ where: { moderationStatus: 'REJECTED' } }),
      prisma.problemSubmission.count({ where: { moderationStatus: 'SPAM' } }),
      prisma.problemSubmission.count({ where: { willingnessToTest: 'YES' } }),
      prisma.testInterest.count(),
      prisma.problemCategory.count(),
      prisma.problemSubmission.groupBy({
        by: ['researchStatus'],
        _count: { _all: true },
      }),
    ]);

    const researchBreakdown: Record<string, number> = {
      NEW: 0,
      UNDER_REVIEW: 0,
      RESEARCHING: 0,
      VALIDATION_NEEDED: 0,
      VALIDATING: 0,
      SELECTED: 0,
      NOT_SELECTED: 0,
    };

    researchStatusGroups.forEach((item) => {
      researchBreakdown[item.researchStatus] = item._count._all;
    });

    res.status(200).json({
      success: true,
      data: {
        totalSubmissions,
        pendingCount,
        approvedCount,
        rejectedCount,
        spamCount,
        totalVolunteers: volunteersCount + testInterestsCount,
        categoriesCount,
        researchBreakdown,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Get complete list of problems with research filters
 */
export const getAdminProblems = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const skip = (page - 1) * limit;

    const search = (req.query.search as string)?.trim();
    const moderationStatus = (req.query.moderationStatus as string)?.trim();
    const researchStatus = (req.query.researchStatus as string)?.trim();
    const categoryId = (req.query.categoryId as string)?.trim();
    const sortBy = (req.query.sortBy as string) || 'createdAt';
    const sortOrder = (req.query.sortOrder as string) === 'asc' ? 'asc' : 'desc';

    const where: any = {};

    if (moderationStatus && moderationStatus !== 'ALL') {
      where.moderationStatus = moderationStatus as any;
    }

    if (researchStatus && researchStatus !== 'ALL') {
      where.researchStatus = researchStatus as any;
    }

    if (categoryId && categoryId !== 'ALL') {
      where.categoryId = categoryId;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { contactEmail: { contains: search, mode: 'insensitive' } },
        { targetAudience: { contains: search, mode: 'insensitive' } },
        { currentWorkaround: { contains: search, mode: 'insensitive' } },
      ];
    }

    const orderBy: any = {};
    if (sortBy === 'priorityScore') {
      orderBy.priorityScore = sortOrder;
    } else if (sortBy === 'supportCount') {
      orderBy.supportCount = sortOrder;
    } else {
      orderBy.createdAt = sortOrder;
    }

    const [problems, total] = await Promise.all([
      prisma.problemSubmission.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          _count: {
            select: {
              researchNotes: true,
              supports: true,
              testInterests: true,
              abuseReports: true,
            },
          },
        },
      }),
      prisma.problemSubmission.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: problems,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Get single problem by ID with notes, history & reports
 */
export const getAdminProblemById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id as string;

    const problem = await prisma.problemSubmission.findUnique({
      where: { id },
      include: {
        category: true,
        researchNotes: {
          include: {
            author: { select: { id: true, name: true, email: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
        statusHistory: {
          include: {
            changedBy: { select: { id: true, name: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
        testInterests: {
          orderBy: { createdAt: 'desc' },
        },
        abuseReports: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!problem) {
      throw new AppError('Problem submission not found', 404);
    }

    res.status(200).json({
      success: true,
      data: problem,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Update moderation status (APPROVED, REJECTED, SPAM, PENDING)
 */
export const updateModerationStatus = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { status } = moderationStatusSchema.parse(req.body);

    const updated = await prisma.problemSubmission.update({
      where: { id },
      data: { moderationStatus: status },
      include: { category: true },
    });

    res.status(200).json({
      success: true,
      message: `Moderation status updated to ${status}`,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Update research status with history log
 */
export const updateResearchStatus = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { status, note } = researchStatusSchema.parse(req.body);

    const currentProblem = await prisma.problemSubmission.findUnique({
      where: { id },
      select: { researchStatus: true },
    });

    if (!currentProblem) {
      throw new AppError('Problem not found', 404);
    }

    const previousStatus = currentProblem.researchStatus;

    const [updated] = await prisma.$transaction([
      prisma.problemSubmission.update({
        where: { id },
        data: { researchStatus: status },
      }),
      prisma.problemStatusHistory.create({
        data: {
          problemId: id,
          changedById: req.admin?.id,
          previousStatus,
          newStatus: status,
          note: note?.trim() || null,
        },
      }),
    ]);

    res.status(200).json({
      success: true,
      message: `Research status transitioned from ${previousStatus} to ${status}`,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Update research scoring rubric & calculate priority score (0-100)
 */
export const updateRubricScore = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const {
      scoreFrequency,
      scoreSeverity,
      scoreUnmetDemand,
      scoreFeasibility,
      scoreUserAccess,
    } = rubricScoreSchema.parse(req.body);

    // Weighted Formula from PRD:
    // Frequency: 25% (score / 5 * 25) = score * 5
    // Severity: 25% (score / 5 * 25) = score * 5
    // Unmet Demand: 20% (score / 5 * 20) = score * 4
    // Feasibility: 15% (score / 5 * 15) = score * 3
    // Access to users: 15% (score / 5 * 15) = score * 3
    const priorityScore =
      scoreFrequency * 5 +
      scoreSeverity * 5 +
      scoreUnmetDemand * 4 +
      scoreFeasibility * 3 +
      scoreUserAccess * 3;

    const updated = await prisma.problemSubmission.update({
      where: { id },
      data: {
        scoreFrequency,
        scoreSeverity,
        scoreUnmetDemand,
        scoreFeasibility,
        scoreUserAccess,
        priorityScore: parseFloat(priorityScore.toFixed(1)),
      },
    });

    res.status(200).json({
      success: true,
      message: `Rubric score updated. Overall Priority Score: ${priorityScore}/100`,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Add private research note
 */
export const addResearchNote = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { content } = researchNoteSchema.parse(req.body);

    if (!req.admin) {
      throw new AppError('Unauthorized', 401);
    }

    const note = await prisma.researchNote.create({
      data: {
        problemId: id,
        authorId: req.admin.id,
        content: content.trim(),
      },
      include: {
        author: { select: { id: true, name: true, email: true } },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Research note added successfully',
      data: note,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Analytics breakdown
 */
export const getAnalytics = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const [byCategory, byFrequency, byImpact, byAudience] = await Promise.all([
      prisma.problemSubmission.groupBy({
        by: ['categoryId'],
        _count: { _all: true },
      }),
      prisma.problemSubmission.groupBy({
        by: ['frequency'],
        _count: { _all: true },
      }),
      prisma.problemSubmission.groupBy({
        by: ['impact'],
        _count: { _all: true },
      }),
      prisma.problemSubmission.findMany({
        select: { targetAudience: true },
      }),
    ]);

    const categories = await prisma.problemCategory.findMany({
      select: { id: true, name: true },
    });
    const categoryMap = new Map(categories.map((c) => [c.id, c.name]));

    const categoryStats = byCategory.map((item) => ({
      name: categoryMap.get(item.categoryId) || 'Unknown',
      count: item._count._all,
    }));

    const frequencyStats = byFrequency.map((item) => ({
      frequency: item.frequency,
      count: item._count._all,
    }));

    const impactStats = byImpact.map((item) => ({
      impact: item.impact,
      count: item._count._all,
    }));

    res.status(200).json({
      success: true,
      data: {
        categoryStats,
        frequencyStats,
        impactStats,
        totalAnalyzed: byAudience.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Export submissions to CSV
 */
export const exportProblemsCsv = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const problems = await prisma.problemSubmission.findMany({
      include: {
        category: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const headers = [
      'ID',
      'Title',
      'Category',
      'Target Audience',
      'Frequency',
      'Impact',
      'Impact Details',
      'Current Workaround',
      'Missing From Solutions',
      'Willingness To Test',
      'Broad Location',
      'Contact Email',
      'Follow-up Consent',
      'Public Display Consent',
      'Moderation Status',
      'Research Status',
      'Priority Score',
      'Support Count',
      'Created At',
    ];

    const escapeCsv = (str: string | null | undefined) => {
      if (!str) return '""';
      const clean = String(str).replace(/"/g, '""');
      return `"${clean}"`;
    };

    const rows = problems.map((p) => [
      escapeCsv(p.id),
      escapeCsv(p.title),
      escapeCsv(p.category.name),
      escapeCsv(p.targetAudience),
      escapeCsv(p.frequency),
      escapeCsv(p.impact),
      escapeCsv(p.impactDetails),
      escapeCsv(p.currentWorkaround),
      escapeCsv(p.missingFromSolutions),
      escapeCsv(p.willingnessToTest),
      escapeCsv(p.broadLocation),
      escapeCsv(p.contactEmail),
      escapeCsv(p.followUpConsent ? 'Yes' : 'No'),
      escapeCsv(p.publicDisplayConsent ? 'Yes' : 'No'),
      escapeCsv(p.moderationStatus),
      escapeCsv(p.researchStatus),
      escapeCsv(p.priorityScore?.toString() || 'Unscored'),
      escapeCsv(p.supportCount.toString()),
      escapeCsv(p.createdAt.toISOString()),
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="problempulse_research_export_${new Date().toISOString().slice(0, 10)}.csv"`
    );
    res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Delete a submission
 */
export const deleteProblem = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id as string;

    await prisma.problemSubmission.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: 'Problem submission deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
