import express from 'express';
import cors from 'cors';
import { db } from './database/db';
import apiRoutes from './routes/apiRoutes';

export async function createBackendApp() {
  const app = express();

  // Initialize in-memory mock/seed database
  await db.init();

  // Basic Middlewares
  app.use(cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // API Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: '360CRM Enterprise Server',
      timestamp: new Date().toISOString(),
      database: db.initialized ? 'connected' : 'initializing'
    });
  });

  // Mount central API router
  app.use('/api', apiRoutes);

  return app;
}
