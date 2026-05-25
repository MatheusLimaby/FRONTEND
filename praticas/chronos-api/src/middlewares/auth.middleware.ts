import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "sua_chave_secreta_super_segura";

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  const parts = authHeader.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ message: "Erro no formato do token" });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    req.userId = decoded.id;
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido ou expirado" });
  }
}
