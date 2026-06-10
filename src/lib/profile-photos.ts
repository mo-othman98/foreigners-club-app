import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { getDataDir } from "./data-dir";

const PHOTO_DIR = path.join(getDataDir(), "profile-photos");

function safeEmailKey(email: string): string {
  return email.toLowerCase().trim().replace(/[^a-z0-9]/g, "_");
}

export function profilePhotoPath(email: string): string {
  return path.join(PHOTO_DIR, `${safeEmailKey(email)}.jpg`);
}

export function profilePhotoApiUrl(email: string): string {
  return `/api/connect/photo?email=${encodeURIComponent(email.toLowerCase().trim())}`;
}

export async function saveProfilePhoto(
  email: string,
  base64: string,
  mime = "image/jpeg"
): Promise<string> {
  await mkdir(PHOTO_DIR, { recursive: true });
  const buffer = Buffer.from(base64, "base64");
  const ext = mime.includes("png") ? "png" : "jpg";
  const filePath = path.join(
    PHOTO_DIR,
    `${safeEmailKey(email)}.${ext}`
  );
  await writeFile(filePath, buffer);
  return profilePhotoApiUrl(email);
}

export async function readProfilePhoto(
  email: string
): Promise<{ buffer: Buffer; mime: string } | null> {
  const key = safeEmailKey(email);
  for (const ext of ["jpg", "jpeg", "png"]) {
    try {
      const filePath = path.join(PHOTO_DIR, `${key}.${ext}`);
      const buffer = await readFile(filePath);
      return {
        buffer,
        mime: ext === "png" ? "image/png" : "image/jpeg",
      };
    } catch {
      // try next extension
    }
  }
  return null;
}
