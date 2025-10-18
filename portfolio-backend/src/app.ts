import express from 'express';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { config } from './config';
import { errorHandler, notFound } from './middleware/error.middleware';

// Import routers
import { authRouter } from './modules/auth/auth.routes';
import { blogRouter } from './modules/blog/blog.routes';
import { projectRouter } from './modules/project/project.routes';
import { skillRouter } from './modules/skill/skill.routes';
import { experienceRouter } from './modules/experience/experience.routes';
import { educationRouter } from './modules/education/education.routes';
import { contactRouter } from './modules/contact/contact.routes';

const app = express();

// ==================== MIDDLEWARE ====================

// Enhanced CORS setup — supports multiple origins
const allowedOrigins = config.cors.origin

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true) // Allow tools like Postman
      if (allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        // eslint-disable-next-line no-console
        console.warn(`🚫 CORS blocked request from: ${origin}`)
        callback(new Error('Not allowed by CORS'))
      }
    },
    credentials: true,
  })
)
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Security headers
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// ==================== ROUTES ====================

// Health check
app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/blogs', blogRouter);
app.use('/api/v1/projects', projectRouter);
app.use('/api/v1/skills', skillRouter);
app.use('/api/v1/experiences', experienceRouter);
app.use('/api/v1/educations', educationRouter);
app.use('/api/v1/contact', contactRouter);

// Welcome route
app.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Portfolio API',
    version: '1.0.0',
    documentation: '/api/v1/docs',
    endpoints: {
      auth: '/api/v1/auth',
      blogs: '/api/v1/blogs',
      projects: '/api/v1/projects',
      skills: '/api/v1/skills',
      experiences: '/api/v1/experiences',
      educations: '/api/v1/educations',
      contact: '/api/v1/contact',
    },
  });
});

// ==================== ERROR HANDLING ====================
app.use(notFound);
app.use(errorHandler);

export default app;