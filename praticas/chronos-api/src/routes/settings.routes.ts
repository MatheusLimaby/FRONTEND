import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

export const settingsRouter = Router();
settingsRouter.use(requireAuth);

settingsRouter.get('/', async (req, res) => {
  let settings = await prisma.settings.findUnique({ where: { userId: req.userId! } });

  if (!settings) {
    settings = await prisma.settings.create({
      data: { userId: req.userId!, workTime: 25, shortBreakTime: 5, longBreakTime: 15 },
    });
  }

  return res.json(settings);
});

settingsRouter.put('/', async (req, res) => {
  const { workTime, shortBreakTime, longBreakTime } = req.body as {
    workTime: number; shortBreakTime: number; longBreakTime: number;
  };

  if (!Number.isInteger(workTime) || !Number.isInteger(shortBreakTime) || !Number.isInteger(longBreakTime)) {
    return res.status(400).json({ message: 'Valores inválidos' });
  }

  const settings = await prisma.settings.upsert({
    where: { userId: req.userId! },
    update: { workTime, shortBreakTime, longBreakTime },
    create: { userId: req.userId!, workTime, shortBreakTime, longBreakTime },
  });

  return res.json(settings);
});
