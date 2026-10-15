import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import prisma from './config/prisma';

const DEFAULT_PORT = parseInt(process.env.PORT || '5001', 10);

async function startServer() {
  try {
    if (!process.env.DATABASE_URL) {
      console.warn('⚠️ Warning: DATABASE_URL environment variable is not defined.');
    } else if (process.env.NODE_ENV === 'production' && process.env.DATABASE_URL.includes('localhost')) {
      console.warn('⚠️ Warning: DATABASE_URL points to "localhost" in production. Ensure a cloud PostgreSQL URL is provided in your hosting dashboard (e.g. Render/Neon/Supabase).');
    }

    // Verify database connection
    await prisma.$connect();
    console.log('✅ Connected to PostgreSQL database successfully.');

    // Auto-seed initial categories and admin user if empty
    try {
      const categoryCount = await prisma.problemCategory.count();
      if (categoryCount === 0) {
        console.log('🌱 Fresh database detected. Auto-seeding 11 PRD categories & admin account...');
        const { seed } = await import('./utils/seed');
        await seed();
      }
    } catch (seedErr) {
      console.warn('Notice during startup category check:', seedErr);
    }

    const server = app.listen(DEFAULT_PORT, () => {
      console.log(`🚀 ProblemPulse Server running on http://localhost:${DEFAULT_PORT}`);
      console.log(`📡 Health check: http://localhost:${DEFAULT_PORT}/api/health`);
    });

    server.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`\n❌ Error: Port ${DEFAULT_PORT} is already in use by another process.`);
        console.error(`💡 Quick fix: Kill the process using port ${DEFAULT_PORT} by running:`);
        console.error(`   lsof -ti :${DEFAULT_PORT} | xargs kill -9\n`);
        process.exit(1);
      } else {
        console.error('❌ Server startup error:', err);
        process.exit(1);
      }
    });

    const shutdown = async (signal: string) => {
      console.log(`\n🛑 Received ${signal}. Shutting down cleanly...`);
      server.close(async () => {
        try {
          await prisma.$disconnect();
          console.log('🔒 Disconnected from database. Port freed.');
        } catch (e) {
          console.error('Error during disconnect:', e);
        }
        process.exit(0);
      });

      // Force exit after 3 seconds if graceful shutdown takes too long
      setTimeout(() => {
        console.warn('⚠️ Force exiting server shutdown.');
        process.exit(0);
      }, 3000).unref();
    };

    process.once('SIGTERM', () => shutdown('SIGTERM'));
    process.once('SIGINT', () => shutdown('SIGINT'));
    process.once('SIGUSR2', () => shutdown('SIGUSR2')); // For tsx watch / nodemon restarts
  } catch (error) {
    console.error('❌ Failed to connect to database or start server:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

startServer();
