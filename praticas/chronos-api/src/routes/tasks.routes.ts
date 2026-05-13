import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

export const tasksRouter = Router();
tasksRouter.use(requireAuth);

function serializeTask(task: Awaited<ReturnType<typeof prisma.task.findFirst>>) {
  if (!task) return task;

  return {
    ...task,
    startDate: task.startDate.toString(),
    completeDate: task.completeDate?.toString() ?? null,
    interruptDate: task.interruptDate?.toString() ?? null,
  };
}

tasksRouter.get('/', async (req, res) => {
  const tasks = await prisma.task.findMany({
    where: { userId: req.userId },
    orderBy: { startDate: 'desc' },
  });

  return res.json(tasks.map(serializeTask));
});

tasksRouter.post('/', async (req, res) => {
  const { id, name, duration, type, startDate } = req.body as {
    id: string; name: string; duration: number; type: string; startDate: number;
  };

  if (!id || !name || !Number.isInteger(duration) || !Number.isInteger(startDate)) {
    return res.status(400).json({ message: 'Payload inválido para criação de task' });
  }

  const task = await prisma.task.create({
    data: { id, name, duration, type, startDate: BigInt(startDate), userId: req.userId! },
  });

  return res.status(201).json(serializeTask(task));
});

tasksRouter.patch('/:id/complete', async (req, res) => {
  const { id } = req.params;
  const { completeDate } = req.body as { completeDate: number };
  if (!Number.isInteger(completeDate)) return res.status(400).json({ message: 'completeDate inválido' });

  const task = await prisma.task.updateMany({
    where: { id, userId: req.userId },
    data: { completeDate: BigInt(completeDate) },
  });
  if (!task.count) return res.status(404).json({ message: 'Task não encontrada' });
  const updated = await prisma.task.findUnique({ where: { id } });
  return res.json(serializeTask(updated));
});

tasksRouter.patch('/:id/interrupt', async (req, res) => {
  const { id } = req.params;
  const { interruptDate } = req.body as { interruptDate: number };
  if (!Number.isInteger(interruptDate)) return res.status(400).json({ message: 'interruptDate inválido' });

  const task = await prisma.task.updateMany({
    where: { id, userId: req.userId },
    data: { interruptDate: BigInt(interruptDate) },
  });
  if (!task.count) return res.status(404).json({ message: 'Task não encontrada' });
  const updated = await prisma.task.findUnique({ where: { id } });
  return res.json(serializeTask(updated));
});

tasksRouter.delete('/', async (req, res) => {
  await prisma.task.deleteMany({ where: { userId: req.userId } });
  return res.status(204).send();
});
