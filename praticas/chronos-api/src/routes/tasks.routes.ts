import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import {
  authMiddleware,
  AuthenticatedRequest,
} from "../middlewares/auth.middleware.js";

export const tasksRouter = Router();

// Aplica a proteção em todas as rotas abaixo
tasksRouter.use(authMiddleware);

function serializeTask(task: any) {
  if (!task) return task;
  return {
    ...task,
    startDate: task.startDate.toString(),
    completeDate: task.completeDate?.toString() ?? null,
    interruptDate: task.interruptDate?.toString() ?? null,
  };
}

tasksRouter.get("/", async (req: AuthenticatedRequest, res) => {
  const tasks = await prisma.task.findMany({
    where: { userId: req.userId },
    orderBy: { startDate: "desc" },
  });
  return res.json(tasks.map(serializeTask));
});

tasksRouter.post("/", async (req: AuthenticatedRequest, res) => {
  const { id, name, duration, type, startDate } = req.body;

  if (
    !id ||
    !name ||
    !Number.isInteger(duration) ||
    !Number.isInteger(startDate)
  ) {
    return res
      .status(400)
      .json({ message: "Payload inválido para criação de task" });
  }

  const task = await prisma.task.create({
    data: {
      id,
      name,
      duration,
      type,
      startDate: BigInt(startDate),
      userId: req.userId!,
    },
  });
  return res.status(201).json(serializeTask(task));
});

tasksRouter.patch("/:id/complete", async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const { completeDate } = req.body;

  if (!Number.isInteger(completeDate)) {
    return res.status(400).json({ message: "completeDate inválido" });
  }

  // Verifica se a task pertence ao usuário logado
  const existingTask = await prisma.task.findFirst({
    where: { id, userId: req.userId },
  });
  if (!existingTask)
    return res.status(404).json({ message: "Task não encontrada" });

  const task = await prisma.task.update({
    where: { id },
    data: { completeDate: BigInt(completeDate) },
  });
  return res.json(serializeTask(task));
});

tasksRouter.patch("/:id/interrupt", async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const { interruptDate } = req.body;

  if (!Number.isInteger(interruptDate)) {
    return res.status(400).json({ message: "interruptDate inválido" });
  }

  const existingTask = await prisma.task.findFirst({
    where: { id, userId: req.userId },
  });
  if (!existingTask)
    return res.status(404).json({ message: "Task não encontrada" });

  const task = await prisma.task.update({
    where: { id },
    data: { interruptDate: BigInt(interruptDate) },
  });
  return res.json(serializeTask(task));
});

tasksRouter.delete("/", async (req: AuthenticatedRequest, res) => {
  await prisma.task.deleteMany({ where: { userId: req.userId } });
  return res.status(204).send();
});
