#!/usr/bin/env node
/**
 * AI-slop linter for the SabiHub product dashboards.
 *
 * Scans the dashboard source this build owns and fails (exit 1) on the tells of
 * generic, machine-generated UI: em/en dashes in copy, emoji used in place of
 * icons, placeholder Lorem text, and the off-brand visual effects the design
 * system forbids (purple/violet, gradients, glassmorphism blur, pill radii on
 * anything but tiny badges).
 *
 * Scope is deliberately limited to the paths below so it never trips over the
 * separately-owned marketing code. Widen ROOTS once the whole app conforms.
 *
 * Usage: node scripts/check-slop.mjs
 */

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, extname } from "node:path";

// Scoped to the shared design-system code this build owns. The per-role screens
// under app/(app) are being migrated onto these components; widen this list to
// include a screen's folder once it has been converted to the design system.
const ROOTS = [
  "app/components/dashboard",
  "app/data/mock",
  "app/lib/dashboard-nav.ts",
  "app/lib/dashboard.ts",
];

const EXTS = new Set([".ts", ".tsx", ".css"]);

// Emoji ranges (pictographs, symbols, dingbats, flags, variation selectors).
const EMOJI =
  /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE00}-\u{FE0F}\u{1F1E6}-\u{1F1FF}]/u;

/** Each rule: name, regex, and a human explanation of the fix. */
const RULES = [
  { name: "em-dash", re: /—/, fix: "replace with a comma, colon, or full stop" },
  { name: "en-dash-as-pause", re: /\s–\s/, fix: "replace with a comma or full stop" },
  { name: "emoji", re: EMOJI, fix: "use a lucide-react icon instead of an emoji" },
  { name: "lorem-ipsum", re: /lorem ipsum/i, fix: "write real, product-specific copy" },
  { name: "purple-violet", re: /\b(purple|violet|indigo)\b|#a855f7|#8b5cf6|#7c3aed|#6d28d9/i, fix: "use the teal brand token, not purple" },
  { name: "gradient", re: /linear-gradient|radial-gradient|conic-gradient/i, fix: "the design system uses flat fills and soft shadows, not gradients", allow: /radial-gradient\(70% 40% at 50% 0%, var\(--teal-50\)/ },
  { name: "glassmorphism", re: /backdrop-filter\s*:\s*blur|backdropFilter/i, fix: "no glassmorphism; use solid surfaces" },
  // Hardcoded huge pixel radii bypass the token scale. Circular elements use the
  // --radius-full token instead, so we only flag raw 9999px-style literals.
  { name: "hardcoded-pill", re: /border-?[rR]adius[^;\n]*(9999px|"999px"|:\s*999\b)/, fix: "use the --radius-full token for circles, or 8-12px for cards" },
];

/** Recursively collect lintable files under a root path. */
function collect(root) {
  if (!existsSync(root)) return [];
  const s = statSync(root);
  if (s.isFile()) return EXTS.has(extname(root)) ? [root] : [];
  return readdirSync(root).flatMap((entry) => collect(join(root, entry)));
}

const files = ROOTS.flatMap(collect);
const violations = [];

for (const file of files) {
  const lines = readFileSync(file, "utf8").split("\n");
  lines.forEach((line, i) => {
    for (const rule of RULES) {
      if (!rule.re.test(line)) continue;
      if (rule.allow && rule.allow.test(line)) continue;
      violations.push({ file, line: i + 1, rule: rule.name, fix: rule.fix, text: line.trim().slice(0, 100) });
    }
  });
}

if (violations.length === 0) {
  console.log(`slop-check: clean (${files.length} files scanned)`);
  process.exit(0);
}

console.error(`slop-check: ${violations.length} issue(s) found\n`);
for (const v of violations) {
  console.error(`  ${v.file}:${v.line}  [${v.rule}]`);
  console.error(`    ${v.text}`);
  console.error(`    fix: ${v.fix}\n`);
}
process.exit(1);
