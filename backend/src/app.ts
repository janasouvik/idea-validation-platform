import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import categoryRoutes from './routes/categoryRoutes';
import problemRoutes from './routes/problemRoutes';
import adminRoutes from './routes/adminRoutes';
import { errorHandler } from './middlewares/errorHandler';
import { apiLimiter } from './middlewares/rateLimiter';

dotenv.config();

const app = express();

// Security HTTP headers - allow cross-origin requests in development
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    crossOriginOpenerPolicy: false,
  })
);

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // In development or if no origin, allow all local origins
      if (process.env.NODE_ENV !== 'production' || !origin) {
        callback(null, true);
      } else {
        const allowedOrigins = [
          process.env.FRONTEND_URL || 'http://localhost:5173',
          'http://localhost:5174',
          'http://localhost:5175',
          'http://localhost:3000',
        ];
        if (allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Blocked by CORS policy'));
        }
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parsers
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// General Rate Limiter for public API
app.use('/api', apiLimiter);

// Health check endpoint (PRD Section 10)
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'ProblemPulse API',
    environment: process.env.NODE_ENV || 'development',
  });
});

// Mount Routes
app.use('/api/categories', categoryRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/admin', adminRoutes);

// Catch-all for undefined routes
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

export default app;
