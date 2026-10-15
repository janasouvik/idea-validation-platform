# ProblemPulse — Discover Real Problems, Build Real Solutions

> **Mission:** *"Discover real problems. Understand real people. Build solutions that matter."*
>
> An authentic problem-discovery and validation platform built to uncover recurring challenges faced by students, professionals, and communities, and systematically validate a meaningful problem for a 4th-year BTech Computer Science major project.

---

## 🏗️ Architecture Overview

```text
idea-validation-platform/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma       # Prisma schema for PostgreSQL (8 relational models)
│   ├── src/
│   │   ├── config/             # Database connection & Prisma client singleton
│   │   ├── controllers/        # Category, Problem, and Admin controllers
│   │   ├── middlewares/        # JWT Admin Auth, Rate Limiter, Centralized Error Handler
│   │   ├── routes/             # REST API routes (/api/categories, /api/problems, /api/admin)
│   │   ├── utils/              # Zod validators & Database Seeding script
│   │   ├── app.ts              # Express configuration, Helmet, CORS, Rate Limiters
│   │   └── server.ts           # Server bootstrap & graceful shutdown
│   ├── .env                    # Configured with PostgreSQL & JWT secrets
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/         # Navbar, Footer, ProblemCard, CategoryIcon
    │   ├── pages/
    │   │   ├── HomePage.tsx            # Hero, Uber/Swiggy philosophy, focus domains, methodology
    │   │   ├── ExploreProblemsPage.tsx # Public problem directory with search & filters
    │   │   ├── ProblemDetailPage.tsx   # Detailed narrative, voting, testing interest, report
    │   │   ├── SubmitProblemPage.tsx   # Comprehensive submission form with consent
    │   │   ├── AboutPage.tsx           # Academic mission & problem-first principles
    │   │   ├── RoadmapPage.tsx         # 7-phase validation timeline
    │   │   ├── PrivacyPolicyPage.tsx   # Data protection & consent ethics
    │   │   ├── ContactPage.tsx         # Direct contact inquiry form
    │   │   └── admin/
    │   │       ├── AdminLoginPage.tsx      # Secure login with demo credentials helper
    │   │       └── AdminDashboardPage.tsx  # Metrics, moderation, research status, 5D rubric scoring, CSV export
    │   ├── services/api.ts     # Type-safe API client
    │   ├── types.ts            # TypeScript interfaces
    │   ├── index.css           # Modern editorial design system
    │   └── App.tsx             # React Router navigation
    ├── vite.config.ts          # Vite configuration with /api proxy
    └── package.json
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** (v18+ or v20+)
- **PostgreSQL** running locally on port `5432`

---

### 1. Database Setup
The PostgreSQL database `problempulse_db` is configured in `backend/.env`. The connection string format is:
```text
postgresql://postgres:<your_postgres_password>@localhost:5432/problempulse_db?schema=public
```

To sync schema and seed initial sample data (11 categories, admin user, and sample verified problems):
```bash
cd backend
npm run prisma:push
npm run seed
```

---

### 2. Running the Backend
```bash
cd backend
npm install
npm run dev
```
- Server starts on: `http://localhost:5001`
- Health check: `http://localhost:5001/api/health`

---

### 3. Running the Frontend
```bash
cd frontend
npm install
npm run dev
```
- Frontend starts on: `http://localhost:5173` (or next available port)
- Vite proxy automatically routes all `/api/*` calls to the backend.

---

## 🔐 Administrator Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Lead Researcher** | `admin@problempulse.org` | `AdminSecure2026!` |

*(The login page at `/admin/login` features a one-click **"Auto-fill Default Admin Credentials"** button for quick access).*

---

## 📊 Features Implemented

### 1. Public Visitor Experience
- **Home (`/`):** Explains why building something nobody needs is a mistake. Introduces the Uber/Swiggy customer-first mindset and displays focus categories and methodology.
- **Submit Problem (`/submit`):** Complete submission flow capturing title, description, target cohort, frequency, impact, workarounds, missing features, willingness to test, location, optional private email, and explicit consents.
- **Explore Problems (`/problems`):** Search by keyword, filter by domain, filter by research stage, sort by recent or most supported, with one-click *"I experience this too"* voting.
- **Problem Detail (`/problems/:id`):** Full approved problem narrative, live support counter, *"Help test a solution"* modal, content report mechanism, and related problems.
- **Academic Roadmap (`/roadmap`):** Visual 7-phase timeline from Phase 1 (Listen) to Phase 7 (Pilot test).
- **About & Privacy (`/about`, `/privacy`):** Transparent explanation of the 4th-year BTech major project goals, consent rights, and data protection.

### 2. Research & Administrator Suite (`/admin`)
- **Metrics Overview:** Live counters for total submissions, pending review, approved public problems, active validation count, and testing volunteers.
- **Moderation Workflow:** Filter submissions by `PENDING`, `APPROVED`, `REJECTED`, or `SPAM`. Approve problems for public listing with one click.
- **Research Lifecycle:** Manage problem progression (`NEW` → `UNDER_REVIEW` → `RESEARCHING` → `VALIDATING` → `SELECTED`) with an audit history log.
- **5-Dimension Scoring Rubric:**
  - Frequency (25%)
  - Severity (25%)
  - Evidence of Unmet Demand (20%)
  - Technical Feasibility (15%)
  - User Access (15%)
  - Computes a normalized **Priority Score (0 – 100)** to guide the capstone decision.
- **Private Research Notes:** Log qualitative observations, interview notes, and validation evidence without exposing them to public visitors.
- **CSV Data Export:** 1-click export of complete research records for offline spreadsheet analysis.