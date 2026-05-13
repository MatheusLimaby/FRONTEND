import crypto from 'node:crypto';
const SALT_SIZE = 16;
const KEY_LENGTH = 64;
export function hashPassword(password) {
    const salt = crypto.randomBytes(SALT_SIZE).toString('hex');
    const hash = crypto.scryptSync(password, salt, KEY_LENGTH).toString('hex');
    return `${salt}:${hash}`;
}
export function verifyPassword(password, hashed) {
    const [salt, savedHash] = hashed.split(':');
    if (!salt || !savedHash)
        return false;
    const hash = crypto.scryptSync(password, salt, KEY_LENGTH).toString('hex');
    return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(savedHash));
}
export function createToken() {
    return crypto.randomBytes(32).toString('hex');
}
export function hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
}
