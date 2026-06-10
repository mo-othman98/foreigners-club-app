import path from "path";

/** Persistent data root — set DATA_DIR on hosts with a mounted disk (e.g. Render). */
export function getDataDir(): string {
  if (process.env.DATA_DIR) {
    return path.resolve(process.env.DATA_DIR);
  }
  return path.join(process.cwd(), "data");
}
