# Project Prompt: ProblemPulse — Discover Real Problems, Build Real Solutions

## 1. Your Role

Act as a senior product designer, product manager, full-stack software engineer, UI/UX specialist, and database architect.

Help me design and develop a production-quality web platform called **ProblemPulse** (working name). This platform will help me discover genuine problems faced by real people so that I can research, validate, and choose one meaningful problem to solve through my fourth-year BTech Computer Science major project.

Do not build this platform as my major project itself. It is a tool I am creating to discover the problem that my actual major project will solve.

Build the application incrementally, with clean architecture, professional design, working functionality, and maintainable code.

Before implementing anything, inspect the existing repository, identify its current structure and installed dependencies, and explain your implementation plan. Do not overwrite existing code unnecessarily.

---

## 2. The Vision Behind This Project

The world does not need another application that exists only because someone wanted to build a project. It needs solutions to problems people actually experience.

Companies such as Uber and Swiggy illustrate how businesses can create value by addressing practical problems in transportation and food delivery.

I want to follow the same problem-first mindset.

Instead of sitting alone and guessing what application to develop, I want to ask people directly:

**"What is one real problem you face that you wish someone would solve?"**

People experience different problems in their daily lives, education, careers, businesses, transportation, healthcare access, personal finances, and many other areas.

Some of these problems may be small inconveniences. Others may waste people's time, cost them money, create unnecessary stress, or prevent them from accessing useful services.

My goal is to discover these problems, understand the people experiencing them, research existing alternatives, identify unmet needs, and eventually build a useful solution for a real group of users.

ProblemPulse will be the first step in this journey.

### Our mission

"Discover real problems. Understand real people. Build solutions that matter."

### Our long-term vision

Create a community where people can openly share genuine problems, where recurring challenges become visible, and where builders can use evidence from real users to develop useful solutions.

### Our immediate objective

Collect authentic problem reports, identify recurring pain points, interview affected people, and select a well-validated problem for my fourth-year major project.

The platform must communicate this purpose clearly to every visitor.

---

## 3. Target Audience

The platform should be open to everyone, including:

- College students facing academic, campus, accommodation, transport, or career-related difficulties.
- Working professionals experiencing workplace or productivity problems.
- Small-business owners struggling with operational challenges.
- Local residents dealing with everyday services and accessibility issues.
- Freelancers, creators, job seekers, and other communities.
- Anyone who has experienced a real problem for which existing solutions are inadequate.

Initially, we may receive more responses from students and people in our immediate networks. However, do not restrict the product architecture to college students.

Allow users to select a relevant category and optionally describe their location at a broad level, such as city or region.

Do not require an exact address.

---

## 4. Product Principles

Follow these principles throughout development:

1. **Problem-first:** Understand the problem before deciding what to build.
2. **Human-centered:** Prioritize the experiences of people who face the problem.
3. **Evidence over popularity:** Do not assume the most upvoted problem is the most important.
4. **Privacy by design:** Collect only the information necessary for the platform.
5. **Honest communication:** Never invent user counts, success stories, testimonials, or impact statistics.
6. **Action over appearance:** The website must work, not merely look impressive.
7. **Simple first, scalable later:** Build the essential workflow before adding unnecessary complexity.
8. **Accessible to everyone:** The submission experience should be simple, mobile-friendly, and easy to understand.

---

## 5. Technology Stack

Use the following JavaScript/TypeScript-first stack.

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui for selected accessible UI components
- React Router for routing
- TanStack Query for server-state management
- React Hook Form and Zod for form handling and validation
- Recharts only if charts are useful for the admin dashboard
- Lucide icons

### Backend

- Node.js
- Express.js
- TypeScript
- REST API architecture
- Zod for request validation
- Prisma ORM

### Database

- PostgreSQL

### Authentication

- Implement administrator authentication securely.
- Public users should be able to submit problems without being forced to create an account.
- Add optional authentication later if needed for user profiles, saved problems, or community features.
- Never expose administrator routes or credentials to unauthenticated users.

### Development and deployment

- Git and GitHub
- Environment variables for secrets and configuration
- Docker for local PostgreSQL or reproducible development environments, if appropriate
- A suitable hosting provider for the frontend, backend, and managed PostgreSQL database
- Automated tests and a production build

Use compatible, stable dependency versions. Do not introduce additional frameworks or infrastructure without a clear need.

---

## 6. Website Structure

Create the following pages and routes.

### A. Home page — `/`

The homepage is the most important part of the experience.

It should immediately communicate our purpose and encourage people to share a real problem.

#### Hero section

Main headline:

**"The world has problems. Let's find the ones worth solving."**

Supporting text:

"Every meaningful solution starts with a problem someone actually faces. We are collecting real-world problems from people like you to understand what needs to change—and build something that makes a difference."

Primary CTA: **Share a Problem**

Secondary CTA: **Explore Problems**

Add a short trust statement:

"No perfect ideas needed. Just tell us about a real problem you've experienced."

The hero should feel human, purposeful, confident, and welcoming.

Avoid exaggerated startup claims and generic AI-generated marketing language.

#### Why we are doing this

Create a section explaining the philosophy behind the project.

Heading:

**"Why build something nobody needs?"**

Body:

"Too often, we start with an idea and then search for a problem it might solve. We want to do the opposite.

Uber and Swiggy are examples of businesses that built services around real customer needs. Their journeys remind us that understanding a problem is an important starting point for creating something useful.

We want to listen first, research carefully, and build only after we understand the problem."

Do not claim that our platform has already solved problems or achieved measurable impact.

#### What we want to discover

Display a clean set of categories, such as:

- Education and campus life
- Jobs and career development
- Transportation and mobility
- Food and everyday services
- Healthcare access
- Personal finance
- Small businesses
- Productivity and technology
- Housing and accommodation
- Environment and public infrastructure
- Other real-world problems

Make the categories clickable where relevant.

#### How it works

Explain the process in four steps:

1. **Share:** Tell us about a problem you personally experience.
2. **Discover:** We look for recurring problems and patterns across submissions.
3. **Validate:** We research the problem, interview affected people, and investigate existing solutions.
4. **Build:** We select a promising problem and work toward creating a useful solution.

Explain that submitting a problem does not guarantee that a solution will be built.

#### What happens to your submission?

Be transparent:

- Submissions may be grouped with similar problems.
- We may contact users who explicitly agree to participate in follow-up research.
- We will study the frequency, severity, and current workarounds associated with recurring problems.
- Some problems may be researched further; others may not be selected.
- We aim to publish meaningful progress updates when possible.

Do not promise that every submission will receive a personal response.

#### Final CTA

Heading:

**"You don't need to have the solution. Just tell us the problem."**

Button: **Share Your Problem**

Footer should contain About, How It Works, Privacy Policy, Contact, and an appropriate project disclaimer.

---

### B. Submit a Problem — `/submit`

Create a well-designed, easy-to-complete form.

Heading:

**"What problem do you wish someone would solve?"**

Supporting text:

"Tell us about something frustrating, expensive, time-consuming, difficult, or unnecessarily complicated in your daily life."

Collect the following information:

1. **Problem title**
   - Short, descriptive title.
   - Example: "Finding affordable accommodation near college."

2. **Problem description**
   - What exactly is the problem?
   - Describe a real experience rather than a hypothetical idea.

3. **Category**
   - Select from the predefined categories.

4. **Who experiences this problem?**
   - Students, working professionals, business owners, local residents, or other groups.

5. **How frequently does it occur?**
   - Daily, weekly, monthly, occasionally, or rarely.

6. **What is the impact?**
   - Time wasted, money lost, unnecessary effort, stress, missed opportunities, or another impact.

7. **How do you currently deal with it?**
   - Existing apps, websites, services, manual processes, asking others, or doing nothing.

8. **What is missing from current solutions?**
   - Optional free-text field.

9. **Would you test a potential solution?**
   - Yes, maybe, or not currently.

10. **Broad location**
    - Optional city or region.

11. **Follow-up contact**
    - Optional email address for people who want to participate in interviews or testing.

12. **Consent**
    - Clearly explain how submitted information may be used.
    - Obtain explicit consent before using contact information for follow-up.
    - Provide a separate, optional consent choice for publishing a submission publicly.
    - Never display private email addresses or sensitive information on public pages.

Form requirements:

- Mobile-friendly design.
- Clear validation messages.
- Required and optional fields visibly distinguished.
- Character limits and reasonable input validation.
- Prevent duplicate submissions caused by repeated clicks.
- Loading, success, and error states.
- Accessible labels and keyboard navigation.

After a successful submission, show a confirmation screen:

"Thank you for sharing your experience. Your problem has been submitted successfully.

Your experience may help us understand challenges that deserve better solutions."

Provide a button to explore other problems.

Do not promise that a solution will be built for every submission.

---

### C. Explore Problems — `/problems`

Build a public page displaying approved, publicly shareable problem submissions.

Each problem card should display:

- Problem title
- Short description
- Category
- Frequency, when provided
- A brief impact summary
- Number of supporters, if the feature is implemented
- Submission date
- Validation status, if applicable

Add the following functionality:

- Search by keywords.
- Filter by category.
- Sort by recent submissions.
- Sort by supporter count.
- Filter by validation status.
- Pagination or efficient incremental loading.

Clicking a problem should open a detail page at `/problems/:id`.

#### Problem detail page

Show the full approved problem description and relevant non-sensitive information.

Include:

- Why the problem matters.
- What people currently do to address it.
- What appears to be missing from existing solutions.
- Support button.
- Optional "I experience this too" action.
- Optional "I want to help test a solution" action.
- Related problems.

Require authentication only where necessary to prevent abuse or manage persistent user actions.

Implement appropriate rate limiting and abuse prevention.

Do not make supporter counts look like proof that a problem is severe or commercially viable.

---

### D. About — `/about`

Explain the initiative honestly.

Suggested content:

"We are starting with a simple question: what if we listened to people before deciding what to build?

ProblemPulse is an early-stage problem-discovery initiative created to understand real-world challenges, learn from the people experiencing them, and identify opportunities for meaningful solutions.

We are beginning this journey by collecting experiences, researching recurring problems, and validating opportunities before selecting a problem for a fourth-year computer science major project.

We don't claim to have all the answers. We want to ask better questions, listen carefully, and build something genuinely useful."

Include sections for:

- Our mission
- Why problem discovery matters
- Our approach to research and validation
- Our roadmap
- How people can participate
- What we can and cannot promise

Do not invent a company, organization, established team, or track record.

---

### E. Our Roadmap — `/roadmap`

Make the future plan visible to visitors.

Display these phases:

**Phase 1 — Listen**

Collect real-world problems from people across different communities.

**Phase 2 — Understand**

Identify repeated experiences, investigate root causes, and conduct interviews.

**Phase 3 — Research**

Examine existing products, services, and workarounds. Determine what remains unsolved.

**Phase 4 — Validate**

Test assumptions through interviews, surveys, prototypes, and user commitments.

**Phase 5 — Choose**

Select one problem based on severity, evidence, feasibility, and access to users.

**Phase 6 — Build**

Develop a functional solution as the fourth-year major project.

**Phase 7 — Test and Improve**

Release the solution to a pilot group, gather feedback, and measure whether it actually improves the original problem.

Clearly distinguish planned activities from completed activities. Only mark a phase as completed when it has genuinely been completed.

---

### F. Contact and Privacy

Create a contact page or a clear contact method.

Add a privacy policy that explains:

- What data is collected.
- Why it is collected.
- Which submissions may be publicly displayed.
- How contact details are protected.
- How follow-up consent works.
- How users can request correction or deletion of their submissions.
- How long data is retained.
- How users can contact the project owner.

Do not expose personal information in public API responses, logs, or problem listings.

Include a basic abuse-reporting mechanism for public submissions.

---

## 7. Administrator Dashboard — `/admin`

Build a protected administrator dashboard for reviewing and analysing submissions.

This dashboard is essential because I need to turn collected responses into actionable research.

### Dashboard overview

Display useful metrics such as:

- Total submissions.
- Pending reviews.
- Approved public submissions.
- Number of categories represented.
- Frequently reported problems.
- Problems awaiting further research.
- Problems currently being validated.
- Volunteers willing to test a solution.

All metrics must come from real database records. Do not insert fake production statistics.

### Submission management

Allow an administrator to:

- View complete submissions.
- Search and filter submissions.
- Approve or reject submissions for public display.
- Mark spam or inappropriate content.
- Merge or associate similar problems.
- Add private research notes.
- Change research status.
- Export appropriate data to CSV.
- Delete submissions when appropriate.

Possible research statuses:

- New
- Under Review
- Researching
- Validation Needed
- Validating
- Selected
- Not Selected

Keep public moderation status separate from internal research status.

### Problem analysis

Provide a research-oriented view showing:

- Most frequently reported categories.
- Recurring problem themes.
- Reported frequency.
- Reported severity or impact.
- Existing solutions and workarounds.
- Number of independent submissions.
- Number of people willing to participate in testing.
- Evidence gathered from interviews.
- Research notes and unresolved assumptions.

Display counts only where the underlying data supports them.

The dashboard should help me answer:

"Which problems deserve deeper investigation, and what evidence supports that decision?"

### Research score

Implement an optional, transparent problem-priority score.

Initial weighting:

- Frequency: 25%
- Severity: 25%
- Evidence of unmet demand: 20%
- Feasibility: 15%
- Access to users for validation: 15%

Use a clearly documented scoring rubric. Allow the administrator to score problems on a 1–5 scale for each dimension.

Normalize the result to a score out of 100.

Missing evidence must not automatically receive a high score. Clearly label incomplete assessments, and never treat this score as an objective measure of real-world importance.

The final decision must remain a human research decision rather than an automatic AI selection.

---

## 8. AI Features — Optional Later Phase

Do not make an external AI API a requirement for the first working version.

After the core application is complete, consider adding AI-assisted research features:

- Categorize problem submissions.
- Identify potentially duplicate or semantically similar reports.
- Summarize recurring themes.
- Extract common pain points.
- Suggest interview questions.
- Identify unanswered research questions.
- Summarize anonymized feedback.
- Help compare reported problems with existing solutions.

AI must assist the research process, not invent facts or determine which problem matters most.

Every AI-generated suggestion should be treated as a hypothesis requiring human review.

Do not send private contact information or unnecessary personal data to an external AI provider.

Keep AI functionality modular so that it can be added or removed without redesigning the entire application.

---

## 9. PostgreSQL Database Design

Design a normalized PostgreSQL database using Prisma.

Create suitable models for:

- AdminUser
- ProblemSubmission
- ProblemCategory
- ProblemSupport or UserSupport, if support functionality is implemented
- ResearchNote
- ProblemStatusHistory
- ContactConsent, or an equivalent consent model
- AbuseReport

Use appropriate relationships, indexes, timestamps, uniqueness constraints, and foreign keys.

Important requirements:

- Use UUIDs or another appropriate non-guessable identifier for public-facing records.
- Store timestamps consistently.
- Keep administrator notes private.
- Separate moderation status from research status.
- Store consent records where necessary.
- Do not make private email addresses publicly readable.
- Add indexes for category, creation date, moderation status, and research status.
- Use migrations rather than relying on manual database changes.
- Ensure deletion and retention behaviour is deliberate and documented.

Do not create unnecessary user-account complexity in the first version.

---

## 10. Backend API

Build a REST API with consistent request validation and error handling.

Suggested endpoints:

### Public

- `GET /api/health`
- `GET /api/categories`
- `POST /api/problems`
- `GET /api/problems`
- `GET /api/problems/:id`
- `POST /api/problems/:id/support` (if implemented)
- `POST /api/problems/:id/test-interest` (if implemented)
- `POST /api/reports`

### Administrator

- `POST /api/admin/auth/login`
- `POST /api/admin/auth/logout`
- `GET /api/admin/dashboard`
- `GET /api/admin/problems`
- `PATCH /api/admin/problems/:id/moderation`
- `PATCH /api/admin/problems/:id/research-status`
- `POST /api/admin/problems/:id/notes`
- `GET /api/admin/analytics`
- `GET /api/admin/export`

These are proposed endpoints; refine them where necessary to maintain a consistent API.

Implement:

- Centralized error handling.
- Request validation.
- Authentication and authorization.
- Secure session or token handling.
- Rate limiting on public endpoints.
- Protection against SQL injection through parameterized ORM queries.
- Safe output handling.
- Appropriate CORS configuration.
- Secure HTTP headers.
- Environment-based configuration.
- Structured server logging without sensitive personal data.
- Pagination and sensible query limits.

Never expose database credentials, API secrets, or administrator credentials to the frontend.

---

## 11. UI/UX Design Direction

The website should look like a thoughtful, modern, credible initiative built by a real person—not a generic AI-generated SaaS template.

### Design principles

- Clean and minimal.
- Human-centered.
- Professional but approachable.
- Editorial typography and strong content hierarchy.
- Generous whitespace.
- Subtle borders and restrained shadows.
- Consistent spacing.
- Clear calls to action.
- Excellent mobile responsiveness.
- Accessible contrast and focus states.

Use a restrained light theme with a warm off-white background, dark charcoal text, and a carefully chosen blue or indigo accent.

Avoid excessive gradients, excessive rounded cards, floating decorative shapes, and unnecessary boxes around every section.

Use real icons and purposeful visual elements. Avoid random stock photography unless it contributes meaningfully to the content.

The homepage should focus on the message, not visual decoration.

Create a consistent design system for buttons, forms, cards, typography, navigation, feedback messages, and dashboard components.

The result should feel polished enough to share publicly on LinkedIn and other social platforms.

---

## 12. Security, Quality, and Testing

Before considering the website complete:

- Validate every incoming request.
- Secure administrator access.
- Prevent public users from changing moderation or research status.
- Protect contact details and internal notes.
- Prevent duplicate actions and abuse.
- Add appropriate database constraints.
- Test empty, loading, success, and error states.
- Test the submission workflow end to end.
- Test public and administrator permissions.
- Test search, filtering, pagination, and export.
- Test database migrations.
- Verify the production build.
- Add automated tests for critical API endpoints and business logic.
- Provide useful error messages without exposing internal stack traces.
- Check keyboard navigation and accessibility.
- Ensure the site works on mobile, tablet, and desktop.

Create `.env.example` with placeholder values only. Never commit actual secrets.

Add a README containing setup instructions, architecture, environment configuration, database migration commands, testing instructions, and deployment steps.

---

## 13. Step-by-Step Implementation Instructions

Do not attempt to implement the entire application in one uncontrolled code-generation step.

Work through these phases in order.

### Step 1 — Repository inspection and planning

- Inspect the current repository.
- Identify the installed tools, existing files, and application structure.
- Confirm the frontend and backend architecture.
- Propose a directory structure.
- Identify dependencies and environment requirements.
- Present a concise implementation plan.

Do not rewrite existing working code unnecessarily.

### Step 2 — Frontend foundation and landing page

- Set up the frontend and design system.
- Build the homepage, navigation, footer, About page, and Roadmap page.
- Implement responsive layouts.
- Add functional navigation and calls to action.
- Use realistic sample content, but never present mock statistics as real data.

At this stage, focus on design quality and the project's purpose.

### Step 3 — Database and backend foundation

- Configure PostgreSQL and Prisma.
- Define database models and migrations.
- Set up Express, TypeScript, request validation, and error handling.
- Implement the health endpoint.
- Connect the backend to the database.
- Verify that the database connection and migrations work.

### Step 4 — Problem submission workflow

- Implement the submission form.
- Connect it to the backend.
- Save submissions to PostgreSQL.
- Add validation, consent handling, success messages, and error states.
- Test the complete submission flow.

### Step 5 — Public problem exploration

- Build the Explore Problems page.
- Add public moderation rules.
- Implement search, filters, sorting, and pagination.
- Build problem detail pages.
- Add support or testing-interest functionality if appropriate.

### Step 6 — Administrator authentication and dashboard

- Implement secure administrator authentication.
- Protect administrator routes.
- Build submission review, moderation, research notes, status management, and analytics.
- Ensure all dashboard data comes from the database.

### Step 7 — Research and prioritization

- Implement the transparent research-scoring system.
- Add the evidence fields and validation workflow.
- Add CSV export and research reporting.
- Verify that incomplete evidence is not mistaken for a validated opportunity.

### Step 8 — Security and testing

- Test the public and administrator workflows.
- Fix functional and accessibility issues.
- Verify privacy boundaries and API permissions.
- Run the automated tests and production build.

### Step 9 — Deployment readiness

- Prepare the production configuration.
- Document deployment and database setup.
- Configure environment variables and secrets correctly.
- Verify that the deployed application can submit, store, retrieve, and moderate real submissions.

### Step 10 — Final review

Present a summary of:

- Features implemented.
- Architecture and database design.
- Tests completed.
- Known limitations.
- Deployment instructions.
- Remaining work.

Do not claim that any step is complete until it has actually been implemented and verified.

After completing each phase, summarize the changes, run relevant checks, and identify any blockers before moving to the next phase.

---

## 14. Definition of Success

The first version is successful when:

1. A visitor understands the mission within a few seconds.
2. A visitor can submit a genuine problem without creating an account.
3. The submission is validated and saved to PostgreSQL.
4. Only approved, publicly shareable submissions appear in the public directory.
5. Visitors can discover relevant problems.
6. An authenticated administrator can review submissions and add research notes.
7. Research status and prioritization are stored correctly.
8. Private information is protected.
9. The application works on mobile and desktop.
10. The application can be deployed and used by real people.

The longer-term success of the initiative is not the number of website features. It is whether the platform helps us identify a real, important, insufficiently solved problem and find people willing to validate a solution.

---

## 15. Final Instruction

Start with Step 1.

First inspect the repository and report your proposed implementation plan. Then proceed phase by phase, implementing working functionality rather than generating disconnected code snippets.

Prioritize a polished landing page, a reliable problem-submission workflow, PostgreSQL persistence, and a useful administrator dashboard.

Do not add unnecessary features merely to make the project look technically complex.

Always keep the central mission in mind:

**We are not building a product first and searching for a problem afterward. We are discovering the problem first so that we can build the right product.**