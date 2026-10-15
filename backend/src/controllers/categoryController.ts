import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';

export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const categories = await prisma.problemCategory.findMany({
      orderBy: { displayOrder: 'asc' },
      include: {
        _count: {
          select: {
            problems: {
              where: {
                moderationStatus: 'APPROVED',
                publicDisplayConsent: true,
              },
            },
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      data: categories.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description,
        icon: c.icon,
        displayOrder: c.displayOrder,
        approvedProblemCount: c._count.problems,
      })),
    });
  } catch (error) {
    next(error);
  }
};
