export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  displayOrder: number;
  approvedProblemCount?: number;
}

export type Frequency = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'OCCASIONALLY' | 'RARELY';

export type Impact =
  | 'TIME_WASTED'
  | 'MONEY_LOST'
  | 'UNNECESSARY_EFFORT'
  | 'STRESS'
  | 'MISSED_OPPORTUNITIES'
  | 'OTHER';

export type Willingness = 'YES' | 'MAYBE' | 'NO';

export type ModerationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SPAM';

export type ResearchStatus =
  | 'NEW'
  | 'UNDER_REVIEW'
  | 'RESEARCHING'
  | 'VALIDATION_NEEDED'
  | 'VALIDATING'
  | 'SELECTED'
  | 'NOT_SELECTED';

export interface PublicProblem {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  targetAudience: string;
  frequency: Frequency;
  impact: Impact;
  impactDetails?: string | null;
  currentWorkaround: string;
  missingFromSolutions?: string | null;
  willingnessToTest: Willingness;
  broadLocation?: string | null;
  researchStatus: ResearchStatus;
  supportCount: number;
  isFeatured: boolean;
  createdAt: string;
  category: {
    id: string;
    name: string;
    slug: string;
    icon: string | null;
  };
  related?: Array<{
    id: string;
    title: string;
    description: string;
    supportCount: number;
    researchStatus: ResearchStatus;
    category: {
      name: string;
      slug: string;
    };
  }>;
}

export interface AdminProblem extends PublicProblem {
  contactEmail?: string | null;
  followUpConsent: boolean;
  publicDisplayConsent: boolean;
  moderationStatus: ModerationStatus;
  priorityScore?: number | null;
  scoreFrequency?: number | null;
  scoreSeverity?: number | null;
  scoreUnmetDemand?: number | null;
  scoreFeasibility?: number | null;
  scoreUserAccess?: number | null;
  researchNotes?: Array<{
    id: string;
    content: string;
    createdAt: string;
    author: {
      id: string;
      name: string;
      email: string;
    };
  }>;
  statusHistory?: Array<{
    id: string;
    previousStatus: string;
    newStatus: string;
    note?: string | null;
    createdAt: string;
    changedBy?: {
      id: string;
      name: string;
    } | null;
  }>;
  testInterests?: Array<{
    id: string;
    email?: string | null;
    roleOrBackground?: string | null;
    createdAt: string;
  }>;
  abuseReports?: Array<{
    id: string;
    reason: string;
    details?: string | null;
    status: string;
    createdAt: string;
  }>;
}

export interface DashboardStats {
  totalSubmissions: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  spamCount: number;
  totalVolunteers: number;
  categoriesCount: number;
  researchBreakdown: Record<ResearchStatus, number>;
}
