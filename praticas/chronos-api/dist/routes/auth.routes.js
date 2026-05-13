import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { createToken, hashPassword, hashToken, verifyPassword } from '../lib/security.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24;
const RESET_DURATION_MS = 1000 * 60 * 15;
export const authRouter = Router();
authRouter.post('/register', async (req, res) => {
    const { email, password, name } = req.body;
    if (!email?.includes('@') || !password || password.length < 6) {
        return res.status(400).json({ message: 'Dados inválidos. Use e-mail válido e senha com 6+ caracteres.' });
    }
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists)
        return res.status(409).json({ message: 'E-mail já cadastrado' });
    const user = await prisma.user.create({
        data: { email, name: name?.trim() || null, passwordHash: hashPassword(password) },
    });
    return res.status(201).json({ id: user.id, email: user.email, name: user.name });
});
authRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !verifyPassword(password, user.passwordHash)) {
        return res.status(401).json({ message: 'Credenciais inválidas' });
    }
    const token = createToken();
    const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
    await prisma.session.create({ data: { tokenHash: hashToken(token), userId: user.id, expiresAt } });
    return res.json({ token, expiresAt, user: { id: user.id, email: user.email, name: user.name } });
});
authRouter.post('/logout', requireAuth, async (req, res) => {
    await prisma.session.deleteMany({ where: { tokenHash: hashToken(req.sessionToken) } });
    return res.status(204).send();
});
authRouter.get('/me', requireAuth, async (req, res) => {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user)
        return res.status(404).json({ message: 'Usuário não encontrado' });
    return res.json({ id: user.id, email: user.email, name: user.name });
});
authRouter.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
        return res.json({ message: 'Se o e-mail existir, o link será gerado.' });
    const resetToken = createToken();
    const expiresAt = new Date(Date.now() + RESET_DURATION_MS);
    await prisma.passwordResetToken.create({
        data: { tokenHash: hashToken(resetToken), userId: user.id, expiresAt },
    });
    return res.json({
        message: 'Token de recuperação gerado para ambiente de laboratório.',
        resetToken,
        expiresAt,
    });
});
authRouter.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;
    if (!token || !newPassword || newPassword.length < 6) {
        return res.status(400).json({ message: 'Token e nova senha válida são obrigatórios' });
    }
    const tokenHash = hashToken(token);
    const reset = await prisma.passwordResetToken.findUnique({ where: { tokenHash } });
    if (!reset || reset.usedAt || reset.expiresAt < new Date()) {
        return res.status(400).json({ message: 'Token inválido ou expirado' });
    }
    await prisma.user.update({ where: { id: reset.userId }, data: { passwordHash: hashPassword(newPassword) } });
    await prisma.passwordResetToken.update({ where: { id: reset.id }, data: { usedAt: new Date() } });
    await prisma.session.deleteMany({ where: { userId: reset.userId } });
    return res.json({ message: 'Senha redefinida com sucesso' });
});
