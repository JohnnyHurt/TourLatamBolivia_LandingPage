import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { verifyPassword, generateToken, authenticateToken, AuthenticatedRequest } from '../middleware/auth.js';
import { AuditService } from '../services/AuditService.js';
import { prisma } from '../config/prisma.js'; // FIX #5: shared singleton

const router = Router();


const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials or inactive account.',
      });
    }

    const isValid = verifyPassword(password, user.password);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials or inactive account.',
      });
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as any,
    });

    // Set secure HTTP-only cookie
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Audit log login
    await AuditService.log({
      userId: user.id,
      action: 'LOGIN',
      entity: 'User',
      entityId: user.id,
      details: { email: user.email },
      ipAddress: req.ip,
    });

    return res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          isActive: user.isActive,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/logout
router.post('/logout', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  if (req.user) {
    await AuditService.log({
      userId: req.user.id,
      action: 'LOGOUT',
      entity: 'User',
      entityId: req.user.id,
      ipAddress: req.ip,
    });
  }

  res.clearCookie('auth_token');
  return res.json({ success: true, message: 'Logged out successfully.' });
});

// GET /api/auth/me
router.get('/me', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  return res.json({
    success: true,
    data: req.user,
  });
});

export default router;
