import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { parseIntParam } from '../lib/query.js';
import { ok, fail } from '../lib/responses.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';

const router = Router();

router.use(requireAuth, requireRole(['ADMIN']));

router.get('/', async (req, res, next) => {
  try {
    const page = parseIntParam(req.query.page, 1, { min: 1 });
    const pageSize = parseIntParam(req.query.pageSize, 20, { min: 1, max: 100 });
    const skip = (page - 1) * pageSize;

    const role = typeof req.query.role === 'string' ? req.query.role : undefined;
    const isActive =
      req.query.isActive === undefined ? undefined : req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined;
    const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';

    const where = {
      ...(role ? { role } : {}),
      ...(isActive === undefined ? {} : { isActive }),
      ...(q
        ? {
            OR: [
              { name: { contains: q } },
              { email: { contains: q } },
              { purok: { contains: q } },
              { contactNumber: { contains: q } },
            ],
          }
        : {}),
    } as const;

    const [total, items] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          purok: true,
          contactNumber: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
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
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        purok: true,
        contactNumber: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) return res.status(404).json(fail('User not found', { code: 'NOT_FOUND' }));
    return res.json(ok(user));
  } catch (err) {
    return next(err);
  }
});

const createUserSchema = z.object({
  name: z.string().min(1),
  contactNumber: z.string().min(1),
  purok: z.string().min(1),
  username: z.string().min(3).max(32).regex(/^[a-zA-Z0-9_]+$/).optional(),
  password: z.string().min(8).optional(),
});

const patchSchema = z.object({
  isActive: z.boolean().optional(),
  role: z.enum(['ADMIN', 'RESIDENT']).optional(),
});

// POST /users - Admin creates a new resident
router.post('/', validateBody(createUserSchema), async (req, res, next) => {
  try {
    const { name, contactNumber, purok, username, password } = req.body as z.infer<typeof createUserSchema>;

    // Generate username from name if not provided
    const generatedUsername = username || name.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '') + '_' + Math.floor(Math.random() * 1000);
    
    // Check if username exists
    const existingUsername = await prisma.user.findUnique({ where: { username: generatedUsername } });
    if (existingUsername) {
      return res.status(409).json(fail('Username already in use', { code: 'USERNAME_TAKEN' }));
    }

    // Check if contact number already exists
    const existingContact = await prisma.user.findFirst({ where: { contactNumber } });
    if (existingContact) {
      return res.status(409).json(fail('Contact number already registered', { code: 'CONTACT_TAKEN' }));
    }

    // Generate a default password if not provided
    const defaultPassword = password || generatedUsername + '_123';
    const passwordHash = await bcrypt.hash(defaultPassword, 10);

    const user = await prisma.user.create({
      data: {
        id: crypto.randomUUID(),
        username: generatedUsername,
        email: null,
        password: passwordHash,
        name,
        role: 'RESIDENT',
        purok,
        contactNumber,
        avatarUrl: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        role: true,
        purok: true,
        contactNumber: true,
        avatarUrl: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(201).json(ok({ user, defaultPassword }));
  } catch (err) {
    return next(err);
  }
});

router.patch('/:id', validateBody(patchSchema), async (req, res, next) => {
  try {
    const id = req.params.id;
    const { isActive, role } = req.body as z.infer<typeof patchSchema>;

    const updated = await prisma.user.update({
      where: { id },
      data: {
        ...(isActive === undefined ? {} : { isActive }),
        ...(role ? { role } : {}),
        updatedAt: new Date(),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        purok: true,
        contactNumber: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.json(ok(updated));
  } catch (err) {
    return next(err);
  }
});

export default router;

