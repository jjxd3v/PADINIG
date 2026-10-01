import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { parseIntParam } from '../lib/query.js';
import { ok, fail } from '../lib/responses.js';
import { requireAuth } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';

const router = Router();

router.use(requireAuth);

router.get('/', async (req, res, next) => {
  try {
    const page = parseIntParam(req.query.page, 1, { min: 1 });
    const pageSize = parseIntParam(req.query.pageSize, 30, { min: 1, max: 100 });
    const skip = (page - 1) * pageSize;

    const userId =
      typeof req.query.userId === 'string' && req.user?.role === 'ADMIN' ? req.query.userId : req.user!.id;

    const [total, items] = await Promise.all([
      prisma.notification.count({ where: { userId } }),
      prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
        select: {
          id: true,
          type: true,
          title: true,
          message: true,
          category: true,
          isRead: true,
          targetAudience: true,
          createdAt: true,
          announcement: { select: { id: true, title: true, status: true } },
        },
      }),
    ]);

    return res.json(ok({ items, page, pageSize, total, totalPages: Math.ceil(total / pageSize) }));
  } catch (err) {
    return next(err);
  }
});

router.patch('/read-all', async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const result = await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });

    return res.json(ok({ count: result.count }));
  } catch (err) {
    return next(err);
  }
});

router.post('/read-all', async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const result = await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });

    return res.json(ok({ count: result.count }));
  } catch (err) {
    return next(err);
  }
});

const markReadSchema = z.object({
  isRead: z.boolean().optional(),
});

router.patch('/:id/read', validateBody(markReadSchema), async (req, res, next) => {
  try {
    const id = req.params.id;
    const desired = (req.body as z.infer<typeof markReadSchema>).isRead ?? true;

    const notif = await prisma.notification.findUnique({ where: { id } });
    if (!notif) return res.status(404).json(fail('Notification not found', { code: 'NOT_FOUND' }));

    const canEdit = req.user!.role === 'ADMIN' || notif.userId === req.user!.id;
    if (!canEdit) return res.status(403).json(fail('Forbidden', { code: 'FORBIDDEN' }));

    const updated = await prisma.notification.update({
      where: { id },
      data: { isRead: desired },
      select: {
        id: true,
        type: true,
        title: true,
        message: true,
        category: true,
        isRead: true,
        targetAudience: true,
        createdAt: true,
        announcementId: true,
        userId: true,
      },
    });

    return res.json(ok(updated));
  } catch (err) {
    return next(err);
  }
});

export default router;

