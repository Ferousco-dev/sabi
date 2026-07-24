import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

// Next.js 16 ships server-external-packages.jsonc but Turbopack reads
// server-external-packages.json with strict JSON parsing. The .jsonc file
// has //-comments and trailing commas which are invalid in strict JSON.
// Strip both to produce valid JSON.
const src = join(root, "node_modules", "next", "dist", "lib", "server-external-packages.jsonc");
const dst = join(root, "node_modules", "next", "dist", "lib", "server-external-packages.json");

try {
  const raw = readFileSync(src, "utf-8");

  const clean = raw
    .split("\n")
    .filter((line) => !line.trimStart().startsWith("//"))    // strip comments
    .join("\n")
    .replace(/,(\s*[\])}])/g, "$1");                         // strip trailing commas

  // Validate it parses as strict JSON before writing
  JSON.parse(clean);

  writeFileSync(dst, clean, "utf-8");
  console.log("[postinstall] patched server-external-packages.json ✓");
} catch (e) {
  console.warn("[postinstall] skipping next patch:", e.message);
}
