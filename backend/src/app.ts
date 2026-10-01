import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth.js';
import usersRoutes from './routes/users.js';
import announcementsRoutes from './routes/announcements.js';
import notificationsRoutes from './routes/notifications.js';
import chatRoutes from './routes/chat.js';
import { ok } from './lib/responses.js';
import { errorHandler, notFound } from './middleware/errors.js';

function getCorsOrigins(): string[] {
  const raw = process.env.CORS_ORIGINS?.trim();
  if (!raw) return ['http://localhost:5173'];
  return raw
    .split(',')
    .map((s) => s.trim().replace(/\/$/, ''))
    .filter(Boolean);
}

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(express.json({ limit: '1mb' }));

  const origins = getCorsOrigins();
  app.use(
    cors({
      origin(origin, cb) {
        if (!origin) return cb(null, true);
        const normalized = origin.replace(/\/$/, '');
        if (origins.includes('*') || origins.includes(normalized)) return cb(null, true);
        return cb(new Error(`CORS blocked for origin: ${origin}`));
      },
      credentials: true,
    }),
  );

  app.get('/health', (_req, res) => res.json(ok({ status: 'ok' })));

  app.use('/auth', authRoutes);
  app.use('/users', usersRoutes);
  app.use('/announcements', announcementsRoutes);
  app.use('/notifications', notificationsRoutes);
  app.use('/chat', chatRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

