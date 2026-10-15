import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import prisma from '../config/prisma';
import { createProblemSchema, abuseReportSchema, testInterestSchema } from '../utils/validators';
import { AppError } from '../middlewares/errorHandler';

// Helper to hash IP address for privacy
const hashIp = (req: Request): string => {
  const ip =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ||
    req.socket.remoteAddress ||
    '127.0.0.1';
  return crypto.createHash('sha256').update(ip + (process.env.JWT_SECRET || 'salt')).digest('hex');
};

/**
 * Public: Submit a problem
 */
export const createProblem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = createProblemSchema.parse(req.body);

    // Verify category exists
    const category = await prisma.problemCategory.findUnique({
      where: { id: validatedData.categoryId },
    });

    if (!category) {
      throw new AppError('The specified category does not exist', 404);
    }

    const problem = await prisma.problemSubmission.create({
      data: {
        title: validatedData.title.trim(),
        description: validatedData.description.trim(),
        categoryId: validatedData.categoryId,
        targetAudience: validatedData.targetAudience.trim(),
        frequency: validatedData.frequency,
        impact: validatedData.impact,
        impactDetails: validatedData.impactDetails?.trim() || null,
        currentWorkaround: validatedData.currentWorkaround.trim(),
        missingFromSolutions: validatedData.missingFromSolutions?.trim() || null,
        willingnessToTest: validatedData.willingnessToTest,
        broadLocation: validatedData.broadLocation?.trim() || null,
        contactEmail: validatedData.contactEmail?.trim() || null,
        followUpConsent: validatedData.followUpConsent,
        publicDisplayConsent: validatedData.publicDisplayConsent,
        moderationStatus: 'PENDING',
        researchStatus: 'NEW',
      },
    });

    res.status(201).json({
      success: true,
      message:
        'Thank you for sharing your experience. Your problem has been submitted successfully for research and review.',
      data: {
        id: problem.id,
        title: problem.title,
        createdAt: problem.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Public: Get approved problems with search, filtering, and pagination
 */
export const getPublicProblems = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 12));
    const skip = (page - 1) * limit;

    const search = (req.query.search as string)?.trim();
    const categorySlug = (req.query.category as string)?.trim();
    const status = (req.query.status as string)?.trim();
    const sortBy = (req.query.sortBy as string) || 'recent'; // 'recent' | 'supporters'

    const where: any = {
      moderationStatus: 'APPROVED',
      publicDisplayConsent: true,
    };

    if (categorySlug && categorySlug !== 'all') {
      where.category = { slug: categorySlug };
    }

    if (status && status !== 'all') {
      where.researchStatus = status;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { currentWorkaround: { contains: search, mode: 'insensitive' } },
        { targetAudience: { contains: search, mode: 'insensitive' } },
      ];
    }

    const orderBy: any = {};
    if (sortBy === 'supporters') {
      orderBy.supportCount = 'desc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const [problems, total] = await Promise.all([
      prisma.problemSubmission.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        select: {
          id: true,
          title: true,
          description: true,
          categoryId: true,
          targetAudience: true,
          frequency: true,
          impact: true,
          impactDetails: true,
          currentWorkaround: true,
          missingFromSolutions: true,
          willingnessToTest: true,
          broadLocation: true,
          researchStatus: true,
          supportCount: true,
          isFeatured: true,
          createdAt: true,
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
              icon: true,
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
 * Public: Get single approved problem by UUID
 */
export const getPublicProblemById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id as string;

    const problem = await prisma.problemSubmission.findFirst({
      where: {
        id,
        moderationStatus: 'APPROVED',
        publicDisplayConsent: true,
      },
      select: {
        id: true,
        title: true,
        description: true,
        categoryId: true,
        targetAudience: true,
        frequency: true,
        impact: true,
        impactDetails: true,
        currentWorkaround: true,
        missingFromSolutions: true,
        willingnessToTest: true,
        broadLocation: true,
        researchStatus: true,
        supportCount: true,
        isFeatured: true,
        createdAt: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            icon: true,
          },
        },
      },
    });

    if (!problem) {
      throw new AppError('Problem submission not found or not approved for public display', 404);
    }

    // Also fetch 3 related problems in the same category
    const relatedProblems = await prisma.problemSubmission.findMany({
      where: {
        categoryId: problem.categoryId,
        id: { not: problem.id },
        moderationStatus: 'APPROVED',
        publicDisplayConsent: true,
      },
      take: 3,
      orderBy: { supportCount: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        supportCount: true,
        researchStatus: true,
        category: {
          select: { name: true, slug: true },
        },
      },
    });

    res.status(200).json({
      success: true,
      data: {
        ...problem,
        related: relatedProblems,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Public: Upvote / "I experience this too" (deduplicated by hashed IP)
 */
export const supportProblem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const userIpHash = hashIp(req);

    // Check if problem exists and is approved
    const problem = await prisma.problemSubmission.findFirst({
      where: { id, moderationStatus: 'APPROVED' },
    });

    if (!problem) {
      throw new AppError('Problem submission not found', 404);
    }

    // Check if IP already supported
    const existingSupport = await prisma.problemSupport.findUnique({
      where: {
        problemId_userIpHash: {
          problemId: id,
          userIpHash,
        },
      },
    });

    if (existingSupport) {
      res.status(200).json({
        success: true,
        message: 'You have already indicated support for this problem',
        supported: true,
        supportCount: problem.supportCount,
      });
      return;
    }

    // Record support in transaction and increment count
    const [_, updatedProblem] = await prisma.$transaction([
      prisma.problemSupport.create({
        data: {
          problemId: id,
          userIpHash,
        },
      }),
      prisma.problemSubmission.update({
        where: { id },
        data: {
          supportCount: { increment: 1 },
        },
        select: { supportCount: true },
      }),
    ]);

    res.status(200).json({
      success: true,
      message: 'Support recorded. Thank you for validating this issue!',
      supported: true,
      supportCount: updatedProblem.supportCount,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Public: Submit interest in testing a solution
 */
export const submitTestInterest = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const validatedData = testInterestSchema.parse(req.body);
    const userIpHash = hashIp(req);

    const problem = await prisma.problemSubmission.findUnique({
      where: { id },
    });

    if (!problem) {
      throw new AppError('Problem not found', 404);
    }

    await prisma.testInterest.create({
      data: {
        problemId: id,
        email: validatedData.email?.trim() || null,
        roleOrBackground: validatedData.roleOrBackground?.trim() || null,
        userIpHash,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! We will reach out when a validation prototype is ready.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Public: Report spam or abuse
 */
export const reportAbuse = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const validatedData = abuseReportSchema.parse(req.body);
    const userIpHash = hashIp(req);

    const problem = await prisma.problemSubmission.findUnique({
      where: { id },
    });

    if (!problem) {
      throw new AppError('Problem not found', 404);
    }

    await prisma.abuseReport.create({
      data: {
        problemId: id,
        reason: validatedData.reason.trim(),
        details: validatedData.details?.trim() || null,
        reporterIpHash: userIpHash,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Report submitted. Our moderation team will review this entry.',
    });
  } catch (error) {
    next(error);
  }
};
