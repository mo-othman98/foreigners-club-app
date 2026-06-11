import { createHmac, randomBytes, scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${derived.toString("hex")}`;
}

export async function verifyPassword(
  password: string,
  stored: string
): Promise<boolean> {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const derived = (await scryptAsync(password, salt, 64)) as Buffer;
  const hashBuf = Buffer.from(hash, "hex");
  if (hashBuf.length !== derived.length) return false;
  return timingSafeEqual(hashBuf, derived);
}

export function createSessionToken(): string {
  return randomBytes(32).toString("hex");
}

export function createVerificationCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function signVerificationToken(payload: string): string {
  const secret = process.env.AUTH_SECRET ?? "dev-auth-secret-change-me";
  return createHmac("sha256", secret).update(payload).digest("hex");
}
