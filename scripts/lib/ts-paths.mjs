// Node module hooks so plain `node` can import the app's TypeScript data files:
// maps the "@/" alias to src/ and adds the ".ts" extension that bundler-style imports omit.
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const src = new URL("../../src/", import.meta.url);

export async function resolve(specifier, context, next) {
  const target = specifier.startsWith("@/") ? new URL(specifier.slice(2), src).href : specifier;
  if ((target.startsWith("file:") || target.startsWith(".")) && !/\.[cm]?[jt]sx?$/.test(target)) {
    const url = new URL(target, context.parentURL);
    for (const ext of [".ts", ".tsx"]) if (existsSync(fileURLToPath(url.href + ext))) return next(url.href + ext, context);
  }
  return next(target, context);
}
