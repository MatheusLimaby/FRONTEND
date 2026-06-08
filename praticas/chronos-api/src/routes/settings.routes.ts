import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { authMiddleware, AuthenticatedRequest } from '../middlewares/auth.middleware.js';

export const settingsRouter = Router();

// 1. Protege todas as rotas de configurações (exige o token)
settingsRouter.use(authMiddleware);

settingsRouter.get('/', async (req: AuthenticatedRequest, res) => {
  // 2. Busca a configuração única atrelada ao userId vindo do Token JWT
  let settings = await prisma.settings.findUnique({ 
    where: { userId: req.userId } 
  });

  // Fallback: Caso o usuário não tenha uma configuração (por exemplo, registros antigos), cria uma padrão para ele
  if (!settings) {
    settings = await prisma.settings.create({
      data: { 
        workTime: 25, 
        shortBreakTime: 5, 
        longBreakTime: 15,
        userId: req.userId! // Vincula obrigatoriamente ao usuário logado
      },
    });
  }

  return res.json(settings);
});

settingsRouter.put('/', async (req: AuthenticatedRequest, res) => {
  const { workTime, shortBreakTime, longBreakTime } = req.body as {
    workTime: number;
    shortBreakTime: number;
    longBreakTime: number;
  };

  if (
    !Number.isInteger(workTime) ||
    !Number.isInteger(shortBreakTime) ||
    !Number.isInteger(longBreakTime)
  ) {
    return res.status(400).json({ message: 'Valores inválidos' });
  }

  // 3. Atualiza ou cria (Upsert) baseando-se estritamente no userId da sessão
  const settings = await prisma.settings.upsert({
    where: { userId: req.userId },
    update: { workTime, shortBreakTime, longBreakTime },
    create: { 
      workTime, 
      shortBreakTime, 
      longBreakTime, 
      userId: req.userId! 
    },
  });

  return res.json(settings);
});