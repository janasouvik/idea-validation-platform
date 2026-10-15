import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import prisma from './config/prisma';

const DEFAULT_PORT = parseInt(process.env.PORT || '5001', 10);

async function startServer() {
  try {
    // Verify database connection
    await prisma.$connect();
    console.log('✅ Connected to PostgreSQL database successfully.');

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
