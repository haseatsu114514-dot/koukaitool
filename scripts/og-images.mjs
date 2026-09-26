// Renders the Open Graph cards (1200×630) into public/og/: one per type plus a default for the other pages.
// Run after changing type names, copy or illustrations:  pnpm og
// Fonts are fetched once from Google Fonts with only the glyphs used and inlined, so the browser needs no network.
// Set CHROMIUM_PATH to use a system Chromium instead of the one installed by `playwright install`.
import { register } from "node:module";
import { readFile, writeFile } from "node:fs/promises";
import { chromium } from "@playwright/test";

register("./lib/ts-paths.mjs", import.meta.url);
const { CHARACTER_TYPES, elementColors } = await import("../src/data/types.ts");
const { SITE_NAME, SITE_TAGLINE } = await import("../src/lib/site.ts");

const root = new URL("../", import.meta.url);
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36";
const HOME = { kicker: "生年月日でわかる", kickerStrong: "10のステラタイプ診断", title: ["あなたは、", "どの", "ステラタイプ", "？"], facts: "質問ゼロ ・ 登録なし ・ 無料" };

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
const sparkle = (x, y, r, fill = "#f3d08a") => `<path d="M${x} ${y - r}Q${x} ${y} ${x + r} ${y}Q${x} ${y} ${x} ${y + r}Q${x} ${y} ${x - r} ${y}Q${x} ${y} ${x} ${y - r}Z" fill="${fill}"/>`;
function sky(seed) {
  const rand = random(seed); let dots = "";
  for (let i = 0; i < 150; i++) dots += `<circle cx="${(rand() * 1200).toFixed(1)}" cy="${(rand() * 630).toFixed(1)}" r="${(.5 + rand() * 1.5).toFixed(2)}" fill="${["#fff", "#ffe7a8", "#bfe6ff"][i % 3]}" opacity="${(.25 + rand() * .65).toFixed(2)}"/>`;
  // Sparkles stay in the top and bottom margins, clear of the text.
  for (let i = 0; i < 6; i++) dots += sparkle(40 + rand() * 1120, i % 2 ? 36 + rand() * 50 : 544 + rand() * 50, 4 + rand() * 5, "#f3d08aaa");
  const corners = [[20, 20], [1180, 20], [20, 610], [1180, 610]].map(([x, y]) => sparkle(x, y, 13)).join("");
  return `<div class="nebula"></div><svg class="stars" viewBox="0 0 1200 630">${dots}</svg><div class="frame"></div><svg class="stars" viewBox="0 0 1200 630">${corners}</svg>`;
}

const CSS = `
* { box-sizing: border-box; margin: 0; padding: 0; }
body { position: relative; width: 1200px; height: 630px; overflow: hidden; color: #f3ead8; font-family: "Zen Kaku Gothic New", sans-serif; font-feature-settings: "palt"; background: radial-gradient(circle at 28% 50%, #1d4371 0, #0d1d34 45%, #060d18 100%); }
.nebula { position: absolute; inset: 0; background: radial-gradient(35% 45% at 10% 12%, #5a3b8c44, transparent 70%), radial-gradient(40% 50% at 90% 88%, #1d647f44, transparent 70%); }
.stars { position: absolute; inset: 0; width: 1200px; height: 630px; }
.frame { position: absolute; inset: 20px; border: 2px solid #e3b45ab3; }
.frame::after { content: ""; position: absolute; inset: 7px; border: 1px solid #e3b45a4d; }
.medallion { position: absolute; width: 470px; height: 470px; }
.medallion .orbit { position: absolute; inset: 0; border-radius: 50%; border: 2px dashed #e3b45a88; }
.medallion .ring { position: absolute; inset: 24px; border-radius: 50%; border: 3px solid #e3b45a; box-shadow: 0 0 40px #e3b45a33; }
.medallion .disc { position: absolute; inset: 46px; display: grid; place-items: center; overflow: hidden; border-radius: 50%; border: 10px solid var(--el); background: radial-gradient(circle at 32% 26%, #ffffffb3, transparent 55%), var(--tint); box-shadow: 0 0 70px color-mix(in srgb, var(--el) 60%, transparent), inset 0 0 0 2px #ffffff80; }
.medallion .disc img { width: 84%; }
.copy { position: absolute; top: 0; bottom: 0; display: flex; flex-direction: column; justify-content: center; }
.kicker { font-family: "Cormorant Garamond", serif; font-style: italic; font-weight: 600; font-size: 26px; letter-spacing: .16em; color: #e3b45a; }
h1 { font-family: "Shippori Mincho B1", serif; font-weight: 800; line-height: 1.3; white-space: nowrap; background: linear-gradient(180deg, #fff8e8, #e6d2a6); -webkit-background-clip: text; background-clip: text; color: transparent; }
.gold { background: linear-gradient(180deg, #f6d894, #e3b45a); -webkit-background-clip: text; background-clip: text; color: transparent; }
.catch { font-size: 25px; line-height: 1.7; color: #dde3ec; }
.tags { display: flex; gap: 10px; list-style: none; }
.tags li { padding: 5px 16px; border-radius: 99px; border: 1px solid #e3b45a73; background: #ffffff12; font-size: 18px; }
.brand { display: flex; align-items: center; gap: 12px; font-family: "Shippori Mincho B1", serif; font-weight: 700; font-size: 24px; letter-spacing: .12em; }
.brand svg { width: 22px; height: 22px; }
.brand small { font-family: "Zen Kaku Gothic New", sans-serif; font-weight: 400; font-size: 15px; letter-spacing: .04em; color: #a3b2c8; }
.orbit10 { position: absolute; left: 650px; top: 55px; width: 520px; height: 520px; }
.orbit10 .ring { position: absolute; inset: 55px; border-radius: 50%; border: 1px dashed #e3b45a77; background: radial-gradient(circle, #173a62 0, #0e2038 60%, transparent 72%); }
.orbit10 .core { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: "Cormorant Garamond", serif; font-style: italic; color: #e3b45a; }
.orbit10 .core b { font-weight: 600; font-size: 96px; line-height: .9; color: transparent; -webkit-text-stroke: 1.2px #e3b45a; }
.orbit10 .core span { margin-top: 8px; font-weight: 600; font-size: 16px; letter-spacing: .3em; }
.orbit10 .star { position: absolute; display: grid; place-items: center; width: 96px; height: 96px; overflow: hidden; border-radius: 50%; border: 3px solid var(--el); background: radial-gradient(circle at 32% 26%, #ffffffb3, transparent 55%), var(--tint); box-shadow: 0 0 0 5px #0b1729aa, 0 0 26px color-mix(in srgb, var(--el) 55%, transparent); }
.orbit10 .star img { width: 90%; }
`;
const brand = (tagline = true) => `<p class="brand"><svg viewBox="-12 -12 24 24">${sparkle(0, 0, 11)}</svg>${SITE_NAME}${tagline ? `<small>${SITE_TAGLINE}</small>` : ""}</p>`;
const art = async slug => `data:image/svg+xml;base64,${(await readFile(new URL(`public/characters/${slug}.svg`, root))).toString("base64")}`;

async function typeCard(type, index) {
  const { color, tint } = elementColors(type.stem);
  return { name: type.slug, style: `--el:${color};--tint:${tint}`, html: `${sky(type.slug)}
    <div class="medallion" style="left:86px;top:80px"><div class="orbit"></div><div class="ring"></div><div class="disc"><img src="${await art(type.slug)}"></div></div>
    <div class="copy" style="left:612px;right:64px">
      <p class="kicker">STELLA FILE ・ No.${String(index + 1).padStart(2, "0")} / 10</p>
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
      <p style="font-size:20px;letter-spacing:.2em;color:#a3b2c8">${HOME.kicker}<b style="margin-left:.6em;color:#e3b45a;font-weight:700">${HOME.kickerStrong}</b></p>
      <h1 style="margin-top:20px;font-size:62px;line-height:1.35">${HOME.title[0]}<br>${HOME.title[1]}<span class="gold">${HOME.title[2]}</span>${HOME.title[3]}</h1>
      <p style="margin-top:22px;font-size:22px;letter-spacing:.12em;color:#dde3ec">${HOME.facts}</p>
      <div style="margin-top:44px">${brand(false)}</div>
    </div>
    <div class="orbit10"><div class="ring"></div><div class="core"><b>10</b><span>STELLA TYPES</span></div>${stars.join("")}</div>` };
}

const cards = [await homeCard(), ...await Promise.all(CHARACTER_TYPES.map(typeCard))];
const text = [SITE_NAME, SITE_TAGLINE, ...Object.values(HOME).flat(), ...CHARACTER_TYPES.flatMap(t => [t.displayName, t.shortCatch, ...t.keywords])].join("");
const fonts = (await Promise.all([
  inlineFonts("Shippori Mincho B1", "wght@700;800", text),
  inlineFonts("Zen Kaku Gothic New", "wght@400;700", text),
  inlineFonts("Cormorant Garamond", "ital,wght@1,600", "STELLAFILETYPESNo.0123456789/・"),
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
