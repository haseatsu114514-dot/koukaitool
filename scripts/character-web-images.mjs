// Derives full-resolution, lossless WebP display copies; PNG originals remain for sharing and OG cards.
// Run after updating approved character PNGs: pnpm characters:web
import { createRequire, register } from "node:module";
import { stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";

register("./lib/ts-paths.mjs", import.meta.url);
const { CHARACTER_TYPES, CHARACTER_SIZES, characterAsset, characterSizedSrc } = await import("../src/data/types.ts");
// Reuse Next's installed Sharp dependency, including in pnpm's isolated dependency layout.
const require = createRequire(import.meta.resolve("next/package.json"));
const sharp = require("sharp");
const root = new URL("../", import.meta.url);
let sourceBytes = 0, displayBytes = 0;

for (const type of CHARACTER_TYPES) {
  const asset = characterAsset(type);
  if (!asset.src.endsWith(".png")) throw new Error(`Expected a PNG original for ${type.slug}`);
  const displaySrc = asset.displaySrc ?? asset.src.replace(/\.png$/, ".webp");
  const source = fileURLToPath(new URL(`public${asset.src}`, root));
  const display = fileURLToPath(new URL(`public${displaySrc}`, root));
  const sourceSize = (await stat(source)).size;
  const info = await sharp(source).webp({ lossless: true, exact: true, effort: 6 }).toFile(display);
  if (info.width !== asset.width || info.height !== asset.height) {
    throw new Error(`Unexpected display dimensions for ${type.slug}: ${info.width}×${info.height}`);
  }
  // Small lossy copies for places that show the character at a few dozen pixels (the love page picks one through srcset).
  for (const width of CHARACTER_SIZES) {
    const small = fileURLToPath(new URL(`public${characterSizedSrc(type, width)}`, root));
    const out = await sharp(source).resize(width, width, { kernel: "lanczos3" }).webp({ quality: 84, alphaQuality: 90, effort: 6, smartSubsample: true }).toFile(small);
    console.log(`  ${width}px: ${out.size} bytes`);
  }
  sourceBytes += sourceSize;
  displayBytes += info.size;
  console.log(`public${displaySrc}: ${sourceSize} → ${info.size} bytes`);
}

const savedBytes = sourceBytes - displayBytes;
console.log(`Total: ${sourceBytes} → ${displayBytes} bytes; saved ${savedBytes} bytes (${(savedBytes / sourceBytes * 100).toFixed(1)}%)`);
