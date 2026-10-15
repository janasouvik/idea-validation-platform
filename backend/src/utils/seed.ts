import prisma from '../config/prisma';
import bcrypt from 'bcryptjs';

const initialCategories = [
  {
    name: 'Education and campus life',
    slug: 'education-campus',
    description: 'Academic struggles, campus navigation, course projects, peer collaboration, and campus resources.',
    icon: 'GraduationCap',
    displayOrder: 1,
  },
  {
    name: 'Jobs and career development',
    slug: 'career-jobs',
    description: 'Internship discovery, off-campus placement tracking, interview prep, skill verification, and mentorship.',
    icon: 'Briefcase',
    displayOrder: 2,
  },
  {
    name: 'Transportation and mobility',
    slug: 'transportation-mobility',
    description: 'Daily commute, public transit delays, shuttle crowding, parking hassles, and route safety.',
    icon: 'Bus',
    displayOrder: 3,
  },
  {
    name: 'Food and everyday services',
    slug: 'food-services',
    description: 'Mess food transparency, hygiene tracking, late-night meal options, laundry, and daily errands.',
    icon: 'Utensils',
    displayOrder: 4,
  },
  {
    name: 'Healthcare access',
    slug: 'healthcare-access',
    description: 'Student clinic queues, prescription availability, mental health support access, and emergency response.',
    icon: 'HeartPulse',
    displayOrder: 5,
  },
  {
    name: 'Personal finance',
    slug: 'personal-finance',
    description: 'Student budgeting, shared expense splits, stipend tracking, and avoiding predatory lending.',
    icon: 'Wallet',
    displayOrder: 6,
  },
  {
    name: 'Small businesses',
    slug: 'small-businesses',
    description: 'Local store inventory, credit bookkeeping for kirana shops, vendor payments, and supplier visibility.',
    icon: 'Store',
    displayOrder: 7,
  },
  {
    name: 'Productivity and technology',
    slug: 'productivity-tech',
    description: 'Context switching, developer tooling friction, fragmented notifications, and research synthesis.',
    icon: 'Zap',
    displayOrder: 8,
  },
  {
    name: 'Housing and accommodation',
    slug: 'housing-accommodation',
    description: 'Finding affordable student PGs/rentals, broker fee transparency, roommate matching, and safety audits.',
    icon: 'Home',
    displayOrder: 9,
  },
  {
    name: 'Environment and public infrastructure',
    slug: 'environment-infrastructure',
    description: 'Waste segregation on campus, water dispensing reliability, street lighting, and civic complaint tracking.',
    icon: 'Trees',
    displayOrder: 10,
  },
  {
    name: 'Other real-world problems',
    slug: 'other',
    description: 'Uncategorized everyday friction, community dilemmas, and unique niche challenges.',
    icon: 'HelpCircle',
    displayOrder: 11,
  },
];

export async function seed() {
  console.log('🌱 Starting database seeding (Categories & Admin only)...');

  // 1. Seed Categories
  for (const cat of initialCategories) {
    await prisma.problemCategory.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        icon: cat.icon,
        displayOrder: cat.displayOrder,
      },
      create: cat,
    });
  }
  console.log(`✅ Seeded ${initialCategories.length} problem categories.`);

  // 2. Seed Admin User
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@problempulse.org';
  const adminPassword = process.env.ADMIN_PASSWORD || 'AdminSecure2026!';
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      name: 'Lead Researcher (Admin)',
      role: 'ADMIN',
    },
    create: {
      email: adminEmail,
      passwordHash,
      name: 'Lead Researcher (Admin)',
      role: 'ADMIN',
    },
  });
  console.log(`✅ Seeded admin user: ${admin.email}`);
  console.log('🎉 Seeding completed successfully (Zero mock/fake problems injected).');
}

if (require.main === module) {
  seed()
    .catch((e) => {
      console.error('❌ Seeding error:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
