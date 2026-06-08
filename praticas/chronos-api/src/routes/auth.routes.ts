import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { prisma } from "../lib/prisma.js";

export const authRouter = Router();
const JWT_SECRET = process.env.JWT_SECRET || "sua_chave_secreta_super_segura";

// Registrar nova conta
authRouter.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Campos obrigatórios ausentes." });
  }

  const userExists = await prisma.user.findUnique({ where: { email } });
  if (userExists) {
    return res.status(400).json({ message: "E-mail já cadastrado." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      settings: {
        create: { workTime: 1500, shortBreakTime: 300, longBreakTime: 900 },
      },
    },
  });

  return res
    .status(201)
    .json({ message: "Usuário cadastrado com sucesso!", userId: user.id });
});

// Login
authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(400).json({ message: "Credenciais inválidas." });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Credenciais inválidas." });
  }

  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1d" });

  return res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email },
  });
});

// Esqueci minha senha (Gera o Token temporário)
authRouter.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res.status(400).json({
      message: "Usuário não encontrado.",
    });
  }

  const token = crypto.randomBytes(20).toString("hex");

  const expires = new Date();
  expires.setHours(expires.getHours() + 1);

  await prisma.user.update({
    where: { email },
    data: {
      resetToken: token,
      resetTokenExpires: expires,
    },
  });

  console.log(`\n=== [LAB INTERNO] E-MAIL DE RECUPERAÇÃO DE SENHA ===`);
  console.log(`Para o usuário: ${email}`);
  console.log(`Token temporário gerado: ${token}`);
  console.log(`====================================================\n`);

  return res.json({
    message: "Token gerado com sucesso.",
    token,
  });
});

// Redefinir senha usando o token
authRouter.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res
      .status(400)
      .json({ message: "Token e nova senha são obrigatórios." });
  }

  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpires: { gte: new Date() },
    },
  });

  if (!user) {
    return res.status(400).json({ message: "Token inválido ou expirado." });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpires: null,
    },
  });

  return res.json({ message: "Senha alterada com sucesso!" });
});
