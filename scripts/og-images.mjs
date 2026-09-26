// Renders the Open Graph cards (1200×630) into public/og/: one per type plus a default for the other pages.
// Run after changing type names, copy or illustrations:  pnpm og
// Fonts are fetched once from Google Fonts with only the glyphs used and inlined, so the browser needs no network.
// Set CHROMIUM_PATH to use a system Chromium instead of the one installed by `playwright install`.
import { register } from "node:module";
import { readFile, writeFile } from "node:fs/promises";
import { chromium } from "@playwright/test";

register("./lib/ts-paths.mjs", import.meta.url);
const { CHARACTER_TYPES, elementColors, elementName } = await import("../src/data/types.ts");
const { SITE_NAME, SITE_TAGLINE } = await import("../src/lib/site.ts");
const { LOGO_PATH } = await import("../src/lib/logo-path.ts");

const root = new URL("../", import.meta.url);
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36";
const HOME = { kicker: "生年月日でわかる", kickerStrong: "10のステラタイプ診断", title: ["あなたは、", "どの", "ステラタイプ", "？"], facts: "質問なし・登録なし・無料" };

async function inlineFonts(family, axis, text) {
  const cssUrl = `https://fonts.googleapis.com/css2?family=${family.replaceAll(" ", "+")}:${axis}&text=${encodeURIComponent(text)}`;
  let css = await (await fetch(cssUrl, { headers: { "user-agent": UA } })).text();
  for (const [, url] of css.matchAll(/url\((https:[^)]+)\)/g)) {
    const font = Buffer.from(await (await fetch(url)).arrayBuffer());
    css = css.replace(url, `data:font/woff2;base64,${font.toString("base64")}`);
  }
  return css;
}

function random(seed) {
  let h = 2166136261; for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => { h = (h + 0x6d2b79f5) | 0; let t = Math.imul(h ^ (h >>> 15), 1 | h); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
function sky(seed) {
  const rand = random(seed); let dots = "";
  for (let i = 0; i < 80; i++) dots += `<circle cx="${(rand() * 1200).toFixed(1)}" cy="${(rand() * 630).toFixed(1)}" r="${(.6 + rand() * 1.2).toFixed(2)}" fill="#fff" opacity="${(.12 + rand() * .4).toFixed(2)}"/>`;
  return `<svg class="stars" viewBox="0 0 1200 630">${dots}</svg><div class="frame"></div>`;
}

const CSS = `
* { box-sizing: border-box; margin: 0; padding: 0; }
body { position: relative; width: 1200px; height: 630px; overflow: hidden; color: #f3ead8; font-family: "Zen Kaku Gothic New", sans-serif; font-feature-settings: "palt"; background: linear-gradient(180deg, #12294a, #0b1729 70%); }
.stars { position: absolute; inset: 0; width: 1200px; height: 630px; }
.frame { position: absolute; inset: 24px; border: 2px solid #34527a; border-radius: 22px; }
.disc { position: absolute; display: grid; place-items: center; overflow: hidden; border-radius: 50%; border: 10px solid var(--el); background: var(--tint); }
.disc img { width: 84%; }
.copy { position: absolute; top: 0; bottom: 0; display: flex; flex-direction: column; justify-content: center; }
.no { font-size: 22px; font-weight: 700; color: #e3b45a; }
.no span { margin-left: 14px; padding: 3px 12px; border-radius: 99px; border: 1px solid #34527a; font-size: 16px; font-weight: 400; color: #cfd6e0; }
h1 { font-family: "Shippori Mincho B1", serif; font-weight: 700; line-height: 1.3; white-space: nowrap; color: #f3ead8; }
.gold { color: #e3b45a; }
.catch { font-size: 25px; line-height: 1.7; color: #dde3ec; }
.tags { display: flex; gap: 10px; list-style: none; }
.tags li { padding: 5px 16px; border-radius: 99px; background: #162b47; font-size: 18px; }
.brand { display: flex; align-items: center; gap: 12px; font-family: "Shippori Mincho B1", serif; font-weight: 700; font-size: 24px; letter-spacing: .08em; }
.brand svg { width: 30px; height: 26px; }
.brand small { font-family: "Zen Kaku Gothic New", sans-serif; font-weight: 400; font-size: 15px; letter-spacing: .02em; color: #a3b2c8; }
.orbit10 { position: absolute; left: 650px; top: 55px; width: 520px; height: 520px; }
.orbit10 .ring { position: absolute; inset: 55px; border-radius: 50%; border: 1px solid #34527a; }
.orbit10 .core { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.orbit10 .core b { font-size: 88px; line-height: 1; color: #e3b45a; }
.orbit10 .core span { margin-top: 6px; font-size: 18px; color: #a3b2c8; }
.orbit10 .star { position: absolute; display: grid; place-items: center; width: 96px; height: 96px; overflow: hidden; border-radius: 50%; border: 3px solid var(--el); background: var(--tint); }
.orbit10 .star img { width: 90%; }
`;
const brand = (tagline = true) => `<p class="brand"><svg viewBox="9 16 46 39"><path fill="#e3b45a" fill-rule="evenodd" d="${LOGO_PATH}"/></svg>${SITE_NAME}${tagline ? `<small>${SITE_TAGLINE}</small>` : ""}</p>`;
const art = async slug => `data:image/svg+xml;base64,${(await readFile(new URL(`public/characters/${slug}.svg`, root))).toString("base64")}`;

async function typeCard(type, index) {
  const { color, tint } = elementColors(type.stem);
  return { name: type.slug, style: `--el:${color};--tint:${tint}`, html: `${sky(type.slug)}
    <div class="disc" style="left:110px;top:105px;width:420px;height:420px"><img src="${await art(type.slug)}"></div>
    <div class="copy" style="left:612px;right:64px">
      <p class="no">No.${String(index + 1).padStart(2, "0")}<span>${elementName(type.stem)}のエレメント</span></p>
      <h1 style="margin-top:12px;font-size:56px">${type.displayName}</h1>
      <p class="catch" style="margin-top:16px">${type.shortCatch.split("。").filter(Boolean).map(s => `${s}。`).join("<br>")}</p>
      <ul class="tags" style="margin-top:22px">${type.keywords.map(k => `<li>${k}</li>`).join("")}</ul>
      <div style="margin-top:40px">${brand()}</div>
    </div>` };
}
async function homeCard() {
  const stars = await Promise.all(CHARACTER_TYPES.map(async (type, i) => {
    const a = (i * 36 - 90) * Math.PI / 180, { color, tint } = elementColors(type.stem);
    return `<div class="star" style="--el:${color};--tint:${tint};left:${260 + Math.cos(a) * 205 - 48}px;top:${260 + Math.sin(a) * 205 - 48}px"><img src="${await art(type.slug)}"></div>`;
  }));
  return { name: "default", style: "", html: `${sky("stella-file")}
    <div class="copy" style="left:84px;right:560px">
      <p style="font-size:20px;letter-spacing:.06em;color:#a3b2c8">${HOME.kicker}<b style="margin-left:.6em;color:#e3b45a;font-weight:700">${HOME.kickerStrong}</b></p>
      <h1 style="margin-top:20px;font-size:62px;line-height:1.35">${HOME.title[0]}<br>${HOME.title[1]}<span class="gold">${HOME.title[2]}</span>${HOME.title[3]}</h1>
      <p style="margin-top:22px;font-size:22px;letter-spacing:.06em;color:#dde3ec">${HOME.facts}</p>
      <div style="margin-top:44px">${brand(false)}</div>
    </div>
    <div class="orbit10"><div class="ring"></div><div class="core"><b>10</b><span>のタイプ</span></div>${stars.join("")}</div>` };
}

const cards = [await homeCard(), ...await Promise.all(CHARACTER_TYPES.map(typeCard))];
const text = [SITE_NAME, SITE_TAGLINE, ...Object.values(HOME).flat(), ...CHARACTER_TYPES.flatMap(t => [t.displayName, t.shortCatch, ...t.keywords])].join("");
const fonts = (await Promise.all([
  inlineFonts("Shippori Mincho B1", "wght@700", text),
  inlineFonts("Zen Kaku Gothic New", "wght@400;700", `${text}No.0123456789のエレメント木火土金水`),
])).join("\n");

const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const card of cards) {
  await page.setContent(`<!doctype html><html lang="ja"><head><meta charset="utf-8"><style>${fonts}${CSS}</style></head><body style="${card.style}">${card.html}</body></html>`, { waitUntil: "load" });
  await page.evaluate(async () => {
    await document.fonts.ready;
    // Shrink a long name until it fits on one line.
    for (const h of document.querySelectorAll("h1")) { let size = parseFloat(getComputedStyle(h).fontSize); while (h.scrollWidth > h.clientWidth && size > 30) h.style.fontSize = `${--size}px`; }
  });
  await writeFile(new URL(`public/og/${card.name}.jpg`, root), await page.screenshot({ type: "jpeg", quality: 90 }));
  console.log(`public/og/${card.name}.jpg`);
}
await browser.close();
