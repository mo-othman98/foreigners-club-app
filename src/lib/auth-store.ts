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
import { isAdminEmail } from "./admin-auth";

export interface StoredAuthUser {
  id: string;
  email: string;
  name: string;
  passwordHash?: string;
  googleId?: string;
  emailVerified: boolean;
  verificationCode?: string;
  verificationExpires?: string;
  /** When set, verification code is for password reset instead of email verify. */
  resetPending?: boolean;
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
    provider: user.googleId && !user.passwordHash ? "google" : "email",
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

async function deleteUserById(userId: string) {
  const users = await readUsers();
  await writeUsers(users.filter((u) => u.id !== userId));
}

async function issueVerification(
  user: StoredAuthUser,
  opts?: { reset?: boolean }
) {
  const code = createVerificationCode();
  user.verificationCode = code;
  user.verificationExpires = codeExpiry();
  user.resetPending = opts?.reset === true;
  user.updatedAt = new Date().toISOString();
  await saveUser(user);
  const mail = await sendVerificationEmail(user.email, user.name, code);
  return mail;
}

function markAdminVerified(user: StoredAuthUser) {
  if (!isAdminEmail(user.email)) return false;
  user.emailVerified = true;
  user.verificationCode = undefined;
  user.verificationExpires = undefined;
  user.resetPending = undefined;
  return true;
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
  if (existing) {
    if (!existing.passwordHash) {
      throw new Error(
        "This email already uses Google sign-in. Log in with Google, or use Forgot password to set a password."
      );
    }
    throw new Error(
      "An account with this email already exists. Log in, or use Forgot password."
    );
  }

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

  if (markAdminVerified(user)) {
    await saveUser(user);
    const token = await createSession(user.id);
    return { user: toPublic(user), token };
  }

  await saveUser(user);
  try {
    const mail = await issueVerification(user);
    const token = await createSession(user.id);
    return {
      user: toPublic(user),
      token,
      devVerificationCode: mail.sent ? undefined : mail.devCode,
    };
  } catch (err) {
    await deleteUserById(user.id);
    throw err instanceof Error
      ? err
      : new Error("Could not send verification email. Try again shortly.");
  }
}

export async function loginUser(input: {
  email: string;
  password: string;
}): Promise<{ user: PublicAuthUser; token: string }> {
  const email = normEmail(input.email);
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("Invalid email or password");
  }
  if (!user.passwordHash) {
    throw new Error(
      "This account uses Google sign-in. Tap Continue with Google, or use Forgot password to set a password."
    );
  }

  const ok = await verifyPassword(input.password, user.passwordHash);
  if (!ok) throw new Error("Invalid email or password");

  if (markAdminVerified(user)) {
    user.updatedAt = new Date().toISOString();
    await saveUser(user);
  }

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
    markAdminVerified(user);
    await saveUser(user);
  } else {
    user.googleId = input.googleId;
    user.name = user.name || input.name.trim();
    user.emailVerified = user.emailVerified || input.emailVerified;
    markAdminVerified(user);
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

  if (markAdminVerified(user)) {
    user.updatedAt = now;
    await saveUser(user);
  }

  return toPublic(user);
}

export async function verifyEmailCode(
  email: string,
  code: string
): Promise<PublicAuthUser> {
  const user = await findUserByEmail(email);
  if (!user) throw new Error("Account not found");
  if (user.emailVerified && !user.resetPending) return toPublic(user);

  const trimmed = code.trim();
  if (
    user.resetPending ||
    !user.verificationCode ||
    user.verificationCode !== trimmed ||
    !user.verificationExpires ||
    user.verificationExpires < new Date().toISOString()
  ) {
    if (user.resetPending) {
      throw new Error("Use Forgot password with this code");
    }
    throw new Error("Invalid or expired verification code");
  }

  user.emailVerified = true;
  user.verificationCode = undefined;
  user.verificationExpires = undefined;
  user.resetPending = undefined;
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

  if (markAdminVerified(user)) {
    await saveUser(user);
    return {};
  }

  const mail = await issueVerification(user);
  return { devVerificationCode: mail.sent ? undefined : mail.devCode };
}

/** Send a password-reset code. Always returns ok to avoid email enumeration. */
export async function requestPasswordReset(email: string): Promise<{
  ok: true;
  devVerificationCode?: string;
}> {
  const user = await findUserByEmail(normEmail(email));
  if (!user) {
    return { ok: true };
  }

  try {
    const mail = await issueVerification(user, { reset: true });
    return {
      ok: true,
      devVerificationCode: mail.sent ? undefined : mail.devCode,
    };
  } catch (err) {
    // Code is already saved on the user before send; surface for admin recovery.
    if (isAdminEmail(user.email) && user.verificationCode) {
      return { ok: true, devVerificationCode: user.verificationCode };
    }
    throw err instanceof Error
      ? err
      : new Error("Could not send reset email. Try again shortly.");
  }
}

export async function resetPasswordWithCode(input: {
  email: string;
  code: string;
  password: string;
}): Promise<{ user: PublicAuthUser; token: string }> {
  const email = normEmail(input.email);
  const password = input.password;
  if (password.length < 8) throw new Error("Password must be at least 8 characters");

  const user = await findUserByEmail(email);
  if (!user) throw new Error("Invalid or expired reset code");

  const trimmed = input.code.trim();
  if (
    !user.verificationCode ||
    user.verificationCode !== trimmed ||
    !user.verificationExpires ||
    user.verificationExpires < new Date().toISOString()
  ) {
    throw new Error("Invalid or expired reset code");
  }

  user.passwordHash = await hashPassword(password);
  user.emailVerified = true;
  user.verificationCode = undefined;
  user.verificationExpires = undefined;
  user.resetPending = undefined;
  user.updatedAt = new Date().toISOString();
  await saveUser(user);

  const token = await createSession(user.id);
  return { user: toPublic(user), token };
}

export async function revokeSession(token: string) {
  const sessions = await readSessions();
  await writeSessions(sessions.filter((s) => s.token !== token));
}
