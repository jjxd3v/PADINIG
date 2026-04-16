import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { ok, fail } from '../lib/responses.js';
import { requireAuth } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';

const router = Router();

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not set');
  return secret;
}

function signToken(payload: { sub: string; role: string }) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: '7d' });
}

const signupSchema = z.object({
  username: z.string().min(3).max(32).regex(/^[a-zA-Z0-9_]+$/),
  email: z.string().email().optional(),
  password: z.string().min(8),
  name: z.string().min(1),
  purok: z.string().optional(),
  contactNumber: z.string().optional(),
  avatarUrl: z.string().optional(),
});

router.post('/signup', validateBody(signupSchema), async (req, res, next) => {
  try {
    const { username, email, password, name, purok, contactNumber, avatarUrl } = req.body as z.infer<typeof signupSchema>;

    const existingUsername = await prisma.user.findUnique({ where: { username } });
    if (existingUsername) return res.status(409).json(fail('Username already in use', { code: 'USERNAME_TAKEN' }));
    if (email) {
      const existingEmail = await prisma.user.findUnique({ where: { email } });
      if (existingEmail) return res.status(409).json(fail('Email already in use', { code: 'EMAIL_TAKEN' }));
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        id: crypto.randomUUID(),
        username,
        email: email ?? null,
        password: passwordHash,
        name,
        role: 'RESIDENT',
        purok,
        contactNumber,
        avatarUrl: avatarUrl ?? null,
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

    const token = signToken({ sub: user.id, role: user.role });
    return res.json(ok({ token, user }));
  } catch (err) {
    return next(err);
  }
});

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

router.post('/login', validateBody(loginSchema), async (req, res, next) => {
  try {
    const { username, password } = req.body as z.infer<typeof loginSchema>;

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return res.status(401).json(fail('Invalid credentials', { code: 'INVALID_CREDENTIALS' }));
    if (!user.isActive) return res.status(403).json(fail('Account is disabled', { code: 'ACCOUNT_DISABLED' }));

    const okPw = await bcrypt.compare(password, user.password);
    if (!okPw) return res.status(401).json(fail('Invalid credentials', { code: 'INVALID_CREDENTIALS' }));

    const token = signToken({ sub: user.id, role: user.role });
    return res.json(
      ok({
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          name: user.name,
          role: user.role,
          purok: user.purok,
          contactNumber: user.contactNumber,
          avatarUrl: user.avatarUrl,
          isActive: user.isActive,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      }),
    );
  } catch (err) {
    return next(err);
  }
});

router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const me = await prisma.user.findUnique({
      where: { id: req.user!.id },
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
    if (!me) return res.status(404).json(fail('User not found', { code: 'NOT_FOUND' }));
    return res.json(ok(me));
  } catch (err) {
    return next(err);
  }
});

const updateMeSchema = z.object({
  name: z.string().min(1).optional(),
  contactNumber: z.string().min(1).optional(),
  purok: z.string().min(1).optional(),
  avatarUrl: z.string().max(2_000_000).nullable().optional(),
});

router.patch('/me', requireAuth, validateBody(updateMeSchema), async (req, res, next) => {
  try {
    const { name, contactNumber, purok, avatarUrl } = req.body as z.infer<typeof updateMeSchema>;
    const updated = await prisma.user.update({
      where: { id: req.user!.id },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(contactNumber !== undefined ? { contactNumber } : {}),
        ...(purok !== undefined ? { purok } : {}),
        ...(avatarUrl !== undefined ? { avatarUrl } : {}),
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
    return res.json(ok(updated));
  } catch (err) {
    return next(err);
  }
});

export default router;

