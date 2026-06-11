import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { getDataDir } from "./data-dir";
import {
  createSessionToken,
  createVerificationCode,
  hashPassword,
  verifyPassword,
} from "./auth-crypto";
import { sendVerificationEmail } from "./auth-email";

export interface StoredAuthUser {
  id: string;
  email: string;
  name: string;
  passwordHash?: string;
  googleId?: string;
  emailVerified: boolean;
  verificationCode?: string;
  verificationExpires?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoredSession {
  token: string;
  userId: string;
  expiresAt: string;
  createdAt: string;
}

export interface PublicAuthUser {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  provider: "email" | "google";
}

const DATA_DIR = getDataDir();
const USERS_FILE = path.join(DATA_DIR, "auth-users.json");
const SESSIONS_FILE = path.join(DATA_DIR, "auth-sessions.json");
const SESSION_DAYS = 90;
const CODE_TTL_MS = 30 * 60 * 1000;

async function ensureFile(file: string) {
  await mkdir(DATA_DIR, { recursive: true });
  try {
    await readFile(file, "utf8");
  } catch {
    await writeFile(file, "[]", "utf8");
  }
}

async function readUsers(): Promise<StoredAuthUser[]> {
  await ensureFile(USERS_FILE);
  const raw = await readFile(USERS_FILE, "utf8");
  try {
    return JSON.parse(raw) as StoredAuthUser[];
  } catch {
    return [];
  }
}

async function writeUsers(users: StoredAuthUser[]) {
  await ensureFile(USERS_FILE);
  await writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
}

async function readSessions(): Promise<StoredSession[]> {
  await ensureFile(SESSIONS_FILE);
  const raw = await readFile(SESSIONS_FILE, "utf8");
  try {
    return JSON.parse(raw) as StoredSession[];
  } catch {
    return [];
  }
}

async function writeSessions(sessions: StoredSession[]) {
  await ensureFile(SESSIONS_FILE);
  await writeFile(SESSIONS_FILE, JSON.stringify(sessions, null, 2), "utf8");
}

function normEmail(email: string) {
  return email.toLowerCase().trim();
}

function sessionExpiry() {
  return new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000).toISOString();
}

function codeExpiry() {
  return new Date(Date.now() + CODE_TTL_MS).toISOString();
}

function toPublic(user: StoredAuthUser): PublicAuthUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    emailVerified: user.emailVerified,
    provider: user.googleId ? "google" : "email",
  };
}

async function createSession(userId: string): Promise<string> {
  const token = createSessionToken();
  const sessions = await readSessions();
  const now = new Date().toISOString();
  sessions.push({
    token,
    userId,
    expiresAt: sessionExpiry(),
    createdAt: now,
  });
  const pruned = sessions.filter((s) => s.expiresAt > now).slice(-5000);
  await writeSessions(pruned);
  return token;
}

async function findUserByEmail(email: string) {
  const users = await readUsers();
  const norm = normEmail(email);
  return users.find((u) => normEmail(u.email) === norm) ?? null;
}

async function saveUser(user: StoredAuthUser) {
  const users = await readUsers();
  const idx = users.findIndex((u) => u.id === user.id);
  if (idx >= 0) users[idx] = user;
  else users.push(user);
  await writeUsers(users);
}

async function issueVerification(user: StoredAuthUser) {
  const code = createVerificationCode();
  user.verificationCode = code;
  user.verificationExpires = codeExpiry();
  user.updatedAt = new Date().toISOString();
  await saveUser(user);
  const mail = await sendVerificationEmail(user.email, user.name, code);
  return mail;
}

export async function signUpUser(input: {
  email: string;
  name: string;
  password: string;
}): Promise<{ user: PublicAuthUser; token: string; devVerificationCode?: string }> {
  const email = normEmail(input.email);
  const name = input.name.trim();
  const password = input.password;

  if (!email || !email.includes("@")) throw new Error("Valid email is required");
  if (!name) throw new Error("Name is required");
  if (password.length < 8) throw new Error("Password must be at least 8 characters");

  const existing = await findUserByEmail(email);
  if (existing) throw new Error("An account with this email already exists");

  const now = new Date().toISOString();
  const user: StoredAuthUser = {
    id: randomUUID(),
    email,
    name,
    passwordHash: await hashPassword(password),
    emailVerified: false,
    createdAt: now,
    updatedAt: now,
  };

  await saveUser(user);
  const mail = await issueVerification(user);
  const token = await createSession(user.id);

  return {
    user: toPublic(user),
    token,
    devVerificationCode: mail.devCode,
  };
}

export async function loginUser(input: {
  email: string;
  password: string;
}): Promise<{ user: PublicAuthUser; token: string }> {
  const email = normEmail(input.email);
  const user = await findUserByEmail(email);
  if (!user?.passwordHash) {
    throw new Error("Invalid email or password");
  }

  const ok = await verifyPassword(input.password, user.passwordHash);
  if (!ok) throw new Error("Invalid email or password");

  const token = await createSession(user.id);
  return { user: toPublic(user), token };
}

export async function loginOrRegisterGoogle(input: {
  email: string;
  name: string;
  googleId: string;
  emailVerified: boolean;
}): Promise<{ user: PublicAuthUser; token: string }> {
  const email = normEmail(input.email);
  if (!email) throw new Error("Google account email is required");

  let user = await findUserByEmail(email);
  const now = new Date().toISOString();

  if (!user) {
    user = {
      id: randomUUID(),
      email,
      name: input.name.trim() || email.split("@")[0],
      googleId: input.googleId,
      emailVerified: input.emailVerified,
      createdAt: now,
      updatedAt: now,
    };
    await saveUser(user);
  } else {
    user.googleId = input.googleId;
    user.name = user.name || input.name.trim();
    user.emailVerified = user.emailVerified || input.emailVerified;
    user.updatedAt = now;
    await saveUser(user);
  }

  const token = await createSession(user.id);
  return { user: toPublic(user), token };
}

export async function getUserBySessionToken(
  token: string
): Promise<PublicAuthUser | null> {
  if (!token) return null;
  const sessions = await readSessions();
  const now = new Date().toISOString();
  const session = sessions.find((s) => s.token === token && s.expiresAt > now);
  if (!session) return null;

  const users = await readUsers();
  const user = users.find((u) => u.id === session.userId);
  if (!user) return null;

  return toPublic(user);
}

export async function verifyEmailCode(
  email: string,
  code: string
): Promise<PublicAuthUser> {
  const user = await findUserByEmail(email);
  if (!user) throw new Error("Account not found");
  if (user.emailVerified) return toPublic(user);

  const trimmed = code.trim();
  if (
    !user.verificationCode ||
    user.verificationCode !== trimmed ||
    !user.verificationExpires ||
    user.verificationExpires < new Date().toISOString()
  ) {
    throw new Error("Invalid or expired verification code");
  }

  user.emailVerified = true;
  user.verificationCode = undefined;
  user.verificationExpires = undefined;
  user.updatedAt = new Date().toISOString();
  await saveUser(user);
  return toPublic(user);
}

export async function resendVerification(email: string): Promise<{
  devVerificationCode?: string;
}> {
  const user = await findUserByEmail(email);
  if (!user) throw new Error("Account not found");
  if (user.emailVerified) throw new Error("Email is already verified");
  if (!user.passwordHash) {
    throw new Error("This account uses Google sign-in");
  }

  const mail = await issueVerification(user);
  return { devVerificationCode: mail.devCode };
}

export async function revokeSession(token: string) {
  const sessions = await readSessions();
  await writeSessions(sessions.filter((s) => s.token !== token));
}
