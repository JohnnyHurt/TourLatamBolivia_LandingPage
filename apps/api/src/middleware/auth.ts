import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { config } from '../config/index.js';
import { Role } from '@tourlatam/types';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    role: Role;
  };
}

export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + 'tourlatam_salt_2026').digest('hex');
}

export function verifyPassword(password: string, hashed: string): boolean {
  // Support both SHA-256 seed salted hash and bcrypt hashes
  if (hashed.startsWith('$2a$') || hashed.startsWith('$2b$')) {
    return bcrypt.compareSync(password, hashed);
  }
  const computed = crypto.createHash('sha256').update(password + 'tourlatam_salt_2026').digest('hex');
  return computed === hashed;
}

export function generateToken(payload: { id: string; email: string; name: string; role: Role }): string {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiresIn as any });
}

export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  let token = req.cookies?.auth_token;

  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, error: 'Authentication required. Please log in.' });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as {
      id: string;
      email: string;
      name: string;
      role: Role;
    };
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ success: false, error: 'Invalid or expired session token.' });
  }
}

export function requireRole(allowedRoles: Role[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Authentication required.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Forbidden. Role '${req.user.role}' lacks permission for this action. Required: ${allowedRoles.join(', ')}`,
      });
    }

    next();
  };
}
