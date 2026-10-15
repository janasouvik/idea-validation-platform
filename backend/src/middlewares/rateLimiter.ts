import rateLimit from 'express-rate-limit';

// Rate limiter for problem submissions: max 10 submissions per 15 minutes per IP
export const submissionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Too many submissions from this connection. Please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for support votes: max 30 per 10 minutes per IP
export const supportLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 30,
  message: {
    success: false,
    message: 'Too many requests. Please wait a bit before supporting more problems.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// General public API limiter
export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 120,
  message: {
    success: false,
    message: 'Rate limit exceeded. Please slow down your requests.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
