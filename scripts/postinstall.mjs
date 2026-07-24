import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

// Next.js 16 ships server-external-packages.jsonc but Turbopack reads
// server-external-packages.json with strict JSON parsing. Strip comments
// from the .jsonc and emit a clean .json.
const src = join(root, "node_modules", "next", "dist", "lib", "server-external-packages.jsonc");
const dst = join(root, "node_modules", "next", "dist", "lib", "server-external-packages.json");

try {
  const raw = readFileSync(src, "utf-8");
  const clean = raw
    .split("\n")
    .filter((line) => !line.trimStart().startsWith("//"))
    .join("\n");
  writeFileSync(dst, clean, "utf-8");
  console.log("[postinstall] patched server-external-packages.json");
} catch (e) {
  // file might not exist if next is a different version — skip silently
  console.warn("[postinstall] skipping next patch:", e.message);
}
