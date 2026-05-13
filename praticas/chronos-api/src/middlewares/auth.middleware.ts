import type { NextFunction, Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { hashToken } from '../lib/security.js';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      sessionToken?: string;
    }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Não autenticado' });
  }

  const sessionToken = authHeader.replace('Bearer ', '').trim();
  if (!sessionToken) {
    return res.status(401).json({ message: 'Não autenticado' });
  }

  const tokenHash = hashToken(sessionToken);
  const session = await prisma.session.findUnique({ where: { tokenHash } });

  if (!session || session.expiresAt < new Date()) {
    return res.status(401).json({ message: 'Sessão inválida ou expirada' });
  }

  req.userId = session.userId;
  req.sessionToken = sessionToken;
  return next();
}
