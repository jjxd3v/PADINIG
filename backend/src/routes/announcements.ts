import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { parseBoolParam, parseIntParam } from '../lib/query.js';
import { ok, fail } from '../lib/responses.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';

const router = Router();

// Helper: Create notifications for all targeted users when an announcement is published
async function createNotificationsForAnnouncement(announcement: {
  id: string;
  title: string;
  message: string;
  category: string;
  isEmergency: boolean;
  targetAudience: string;
}) {
  try {
    console.log(`[DEBUG] Creating notifications for announcement: ${announcement.id}`);
    console.log(`[DEBUG] Target audience: "${announcement.targetAudience}"`);
    
    // Parse target audience
    const targets = announcement.targetAudience
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    
    console.log(`[DEBUG] Parsed targets:`, targets);

    // Determine which users should receive this notification
    // Check for "All" case-insensitively
    const hasAllTarget = targets.some(t => 
      t.toLowerCase() === 'all' || 
      t.toLowerCase() === 'all residents'
    );
    
    const whereClause =
      targets.length === 0 || hasAllTarget
        ? { isActive: true } // All active users
        : {
            isActive: true,
            purok: { in: targets },
          };
    
    console.log(`[DEBUG] Where clause:`, JSON.stringify(whereClause));

    // Find all targeted users
    const users = await prisma.user.findMany({
      where: whereClause,
      select: { id: true, purok: true, name: true },
    });
    
    console.log(`[DEBUG] Found ${users.length} targeted users`);
    if (users.length > 0) {
      console.log(`[DEBUG] First few users:`, users.slice(0, 3));
    }

    // Create a notification for each user
    const now = new Date();
    const notificationData = users.map((user) => ({
      id: crypto.randomUUID(),
      type: announcement.isEmergency ? 'EMERGENCY' : 'ANNOUNCEMENT',
      title: announcement.title,
      message: announcement.message.substring(0, 200) + (announcement.message.length > 200 ? '...' : ''),
      category: announcement.category,
      isRead: false,
      targetAudience: announcement.targetAudience,
      createdAt: now,
      userId: user.id,
      announcementId: announcement.id,
    }));

    console.log(`[DEBUG] Creating ${notificationData.length} notifications`);

    if (notificationData.length > 0) {
      const result = await prisma.notification.createMany({
        data: notificationData,
      });
      
      console.log(`[DEBUG] Created ${result.count} notifications in DB`);

      // Update the announcement's recipients count
      await prisma.announcement.update({
        where: { id: announcement.id },
        data: { recipientsCount: notificationData.length },
      });
    }

    return notificationData.length;
  } catch (error) {
    console.error('[DEBUG] Failed to create notifications:', error);
    return 0;
  }
}

// Public: published announcements only
router.get('/public', async (req, res, next) => {
  try {
    // Promote due scheduled announcements to published (simple stateless scheduler)
    const now = new Date();

    // First find the announcements that are due
    const dueAnnouncements = await prisma.announcement.findMany({
      where: {
        status: 'PENDING',
        scheduledDate: { lte: now },
      },
      select: {
        id: true,
        title: true,
        message: true,
        category: true,
        isEmergency: true,
        targetAudience: true,
      },
    });

    // Update them to published
    await prisma.announcement.updateMany({
      where: {
        status: 'PENDING',
        scheduledDate: { lte: now },
      },
      data: {
        status: 'PUBLISHED',
        publishedDate: now,
        updatedAt: now,
      },
    });

    // Create notifications for each newly published announcement
    for (const ann of dueAnnouncements) {
      await createNotificationsForAnnouncement({
        id: ann.id,
        title: ann.title,
        message: ann.message,
        category: ann.category,
        isEmergency: ann.isEmergency,
        targetAudience: ann.targetAudience,
      });
    }

    const page = parseIntParam(req.query.page, 1, { min: 1 });
    const pageSize = parseIntParam(req.query.pageSize, 20, { min: 1, max: 100 });
    const skip = (page - 1) * pageSize;

    const category = typeof req.query.category === 'string' ? req.query.category : undefined;
    const isEmergency = parseBoolParam(req.query.isEmergency);

    const where = {
      status: 'PUBLISHED',
      ...(category ? { category } : {}),
      ...(isEmergency === undefined ? {} : { isEmergency }),
    } as const;

    const [total, items] = await Promise.all([
      prisma.announcement.count({ where }),
      prisma.announcement.findMany({
        where,
        orderBy: { publishedDate: 'desc' },
        skip,
        take: pageSize,
        select: {
          id: true,
          title: true,
          message: true,
          category: true,
          status: true,
          deliveryMethod: true,
          scheduledDate: true,
          publishedDate: true,
          isEmergency: true,
          targetAudience: true,
          recipientsCount: true,
          createdAt: true,
          updatedAt: true,
          author: { select: { id: true, name: true } },
        },
      }),
    ]);

    return res.json(ok({ items, page, pageSize, total, totalPages: Math.ceil(total / pageSize) }));
  } catch (err) {
    return next(err);
  }
});

// Admin routes
router.use(requireAuth, requireRole(['ADMIN']));

router.get('/', async (req, res, next) => {
  try {
    const page = parseIntParam(req.query.page, 1, { min: 1 });
    const pageSize = parseIntParam(req.query.pageSize, 20, { min: 1, max: 100 });
    const skip = (page - 1) * pageSize;

    const status = typeof req.query.status === 'string' ? req.query.status : undefined;
    const category = typeof req.query.category === 'string' ? req.query.category : undefined;
    const isEmergency = parseBoolParam(req.query.isEmergency);
    const from = typeof req.query.from === 'string' ? new Date(req.query.from) : undefined;
    const to = typeof req.query.to === 'string' ? new Date(req.query.to) : undefined;

    const where = {
      ...(status ? { status } : {}),
      ...(category ? { category } : {}),
      ...(isEmergency === undefined ? {} : { isEmergency }),
      ...((from && !Number.isNaN(from.getTime())) || (to && !Number.isNaN(to.getTime()))
        ? {
            createdAt: {
              ...(from && !Number.isNaN(from.getTime()) ? { gte: from } : {}),
              ...(to && !Number.isNaN(to.getTime()) ? { lte: to } : {}),
            },
          }
        : {}),
    } as const;

    const [total, items] = await Promise.all([
      prisma.announcement.count({ where }),
      prisma.announcement.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
        select: {
          id: true,
          title: true,
          message: true,
          category: true,
          status: true,
          deliveryMethod: true,
          scheduledDate: true,
          publishedDate: true,
          isEmergency: true,
          targetAudience: true,
          recipientsCount: true,
          createdAt: true,
          updatedAt: true,
          author: { select: { id: true, name: true, email: true } },
        },
      }),
    ]);

    return res.json(ok({ items, page, pageSize, total, totalPages: Math.ceil(total / pageSize) }));
  } catch (err) {
    return next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const item = await prisma.announcement.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        message: true,
        category: true,
        status: true,
        deliveryMethod: true,
        scheduledDate: true,
        publishedDate: true,
        isEmergency: true,
        targetAudience: true,
        recipientsCount: true,
        createdAt: true,
        updatedAt: true,
        author: { select: { id: true, name: true, email: true } },
      },
    });
    if (!item) return res.status(404).json(fail('Announcement not found', { code: 'NOT_FOUND' }));
    return res.json(ok(item));
  } catch (err) {
    return next(err);
  }
});

const createSchema = z.object({
  title: z.string().min(1),
  message: z.string().min(1),
  category: z.string().min(1),
  status: z.string().optional(),
  deliveryMethod: z.string().optional(),
  scheduledDate: z.string().datetime().optional(),
  publishedDate: z.string().datetime().optional(),
  isEmergency: z.boolean().optional(),
  targetAudience: z.string().optional(),
});

router.post('/', validateBody(createSchema), async (req, res, next) => {
  try {
    const body = req.body as z.infer<typeof createSchema>;
    
    console.log(`[DEBUG] POST /announcements - status: ${body.status}, targetAudience: "${body.targetAudience}"`);

    const isPublished = (body.status ?? 'PENDING') === 'PUBLISHED';
    
    console.log(`[DEBUG] isPublished: ${isPublished}`);

    const created = await prisma.announcement.create({
      data: {
        id: crypto.randomUUID(),
        title: body.title,
        message: body.message,
        category: body.category,
        status: body.status ?? 'PENDING',
        deliveryMethod: body.deliveryMethod ?? 'WEB',
        scheduledDate: body.scheduledDate ? new Date(body.scheduledDate) : null,
        publishedDate: isPublished || body.publishedDate ? new Date() : null,
        isEmergency: body.isEmergency ?? false,
        targetAudience: body.targetAudience ?? '',
        recipientsCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        authorId: req.user!.id,
      },
      select: {
        id: true,
        title: true,
        message: true,
        category: true,
        status: true,
        deliveryMethod: true,
        scheduledDate: true,
        publishedDate: true,
        isEmergency: true,
        targetAudience: true,
        recipientsCount: true,
        createdAt: true,
        updatedAt: true,
        author: { select: { id: true, name: true, email: true } },
      },
    });

    // Create notifications for targeted users if announcement is published
    if (isPublished) {
      await createNotificationsForAnnouncement({
        id: created.id,
        title: created.title,
        message: created.message,
        category: created.category,
        isEmergency: created.isEmergency,
        targetAudience: created.targetAudience,
      });
    }

    return res.status(201).json(ok(created));
  } catch (err) {
    return next(err);
  }
});

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  message: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  status: z.string().optional(),
  deliveryMethod: z.string().optional(),
  scheduledDate: z.string().datetime().nullable().optional(),
  publishedDate: z.string().datetime().nullable().optional(),
  isEmergency: z.boolean().optional(),
  targetAudience: z.string().optional(),
  recipientsCount: z.number().int().min(0).optional(),
});

router.patch('/:id', validateBody(updateSchema), async (req, res, next) => {
  try {
    const id = req.params.id;
    const body = req.body as z.infer<typeof updateSchema>;

    // Check if announcement is currently pending
    const current = await prisma.announcement.findUnique({
      where: { id },
      select: { status: true },
    });

    const isBeingPublished = body.status === 'PUBLISHED' && current?.status !== 'PUBLISHED';

    const updated = await prisma.announcement.update({
      where: { id },
      data: {
        ...(body.title !== undefined ? { title: body.title } : {}),
        ...(body.message !== undefined ? { message: body.message } : {}),
        ...(body.category !== undefined ? { category: body.category } : {}),
        ...(body.status !== undefined ? { status: body.status } : {}),
        ...(body.deliveryMethod !== undefined ? { deliveryMethod: body.deliveryMethod } : {}),
        ...(body.scheduledDate !== undefined
          ? { scheduledDate: body.scheduledDate === null ? null : new Date(body.scheduledDate) }
          : {}),
        ...(body.publishedDate !== undefined
          ? { publishedDate: body.publishedDate === null ? null : new Date(body.publishedDate) }
          : {}),
        ...(isBeingPublished ? { publishedDate: new Date() } : {}),
        ...(body.isEmergency !== undefined ? { isEmergency: body.isEmergency } : {}),
        ...(body.targetAudience !== undefined ? { targetAudience: body.targetAudience } : {}),
        ...(body.recipientsCount !== undefined ? { recipientsCount: body.recipientsCount } : {}),
        updatedAt: new Date(),
      },
      select: {
        id: true,
        title: true,
        message: true,
        category: true,
        status: true,
        deliveryMethod: true,
        scheduledDate: true,
        publishedDate: true,
        isEmergency: true,
        targetAudience: true,
        recipientsCount: true,
        createdAt: true,
        updatedAt: true,
        author: { select: { id: true, name: true, email: true } },
      },
    });

    // Create notifications for targeted users if being published for the first time
    if (isBeingPublished) {
      await createNotificationsForAnnouncement({
        id: updated.id,
        title: updated.title,
        message: updated.message,
        category: updated.category,
        isEmergency: updated.isEmergency,
        targetAudience: updated.targetAudience,
      });
    }

    return res.json(ok(updated));
  } catch (err) {
    return next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    await prisma.announcement.delete({ where: { id } });
    return res.json(ok({ deleted: true }));
  } catch (err) {
    return next(err);
  }
});

export default router;

