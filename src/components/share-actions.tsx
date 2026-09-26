"use client";
import { useState } from "react";
import { Copy, Download, Share2 } from "lucide-react";
import { CHARACTER_TYPES, characterAsset, elementColors, type CharacterType } from "@/data/types";
import { assetPath } from "@/lib/paths";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

const SERIF = '"Shippori Mincho B1", "Hiragino Mincho ProN", "Yu Mincho", serif';
const SANS = '"Zen Kaku Gothic New", "Hiragino Kaku Gothic ProN", "Yu Gothic", sans-serif';
const NUM = '"Cormorant Garamond", Georgia, serif';
const GOLD = "#e3b45a", INK = "#f3ead8", MUTED = "#a3b2c8";

/** Deterministic stars per type, so a saved card always looks the same. */
function random(seed: string) {
  let h = 2166136261; for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => { h = (h + 0x6d2b79f5) | 0; let t = Math.imul(h ^ (h >>> 15), 1 | h); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
function sparkle(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string) {
  ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(x, y - r);
  ctx.quadraticCurveTo(x, y, x + r, y); ctx.quadraticCurveTo(x, y, x, y + r); ctx.quadraticCurveTo(x, y, x - r, y); ctx.quadraticCurveTo(x, y, x, y - r); ctx.fill();
}
function spaced(ctx: CanvasRenderingContext2D, spacing: string) { if ("letterSpacing" in ctx) ctx.letterSpacing = spacing; }

/** Dedicated 1080×1350 export. No birthday, hidden-stem or item data in shared text/image.
 * Canvas uses same-origin SVG assets; future API assets must be served with CORS. */
async function exportCard(type: CharacterType) {
  const W = 1080, H = 1350, cx = 540, cy = 500;
  const canvas = document.createElement("canvas"); canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d"); if (!ctx) throw new Error("canvas");
  const catchLines = type.shortCatch.split("。").filter(Boolean).map(sentence => `${sentence}。`);
  const host = `${location.host}${assetPath("/")}`.replace(/\/$/, "");
  // Load exactly the glyph subsets this card draws; falls back to system fonts if offline.
  await Promise.allSettled([
    document.fonts.load(`800 68px ${SERIF}`, type.displayName), document.fonts.load(`700 36px ${SERIF}`, SITE_NAME),
    document.fonts.load(`400 30px ${SANS}`, `私のステラタイプは${type.keywords.join("")}${catchLines.join("")}${SITE_TAGLINE}`),
    document.fonts.load(`italic 600 34px ${NUM}`, "MY STELLA TYPE No.0123456789/"),
  ]);
  const image = new Image(); image.src = assetPath(characterAsset(type).src); await image.decode();
  const element = elementColors(type.stem), rand = random(type.slug);

  // Night sky
  const sky = ctx.createRadialGradient(cx, 380, 40, cx, 380, 1000); sky.addColorStop(0, "#1c416e"); sky.addColorStop(.5, "#0b1729"); sky.addColorStop(1, "#050b16");
  ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);
  for (const [x, y, r, c] of [[180, 240, 420, "rgba(96,64,150,.22)"], [920, 920, 460, "rgba(30,100,135,.22)"], [260, 1180, 380, "rgba(90,59,107,.16)"]] as const) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, c); g.addColorStop(1, "rgba(0,0,0,0)"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  }
  for (let i = 0; i < 180; i++) {
    const x = rand() * W, y = rand() * H, r = .6 + rand() * 1.8;
    ctx.globalAlpha = .25 + rand() * .7; ctx.fillStyle = ["#ffffff", "#ffe7a8", "#bfe6ff"][i % 3];
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;
  for (let i = 0; i < 7; i++) sparkle(ctx, 80 + rand() * 920, 80 + rand() * 1190, 5 + rand() * 7, "rgba(243,208,138,.75)");

  // Gold double frame with corner stars
  ctx.strokeStyle = "rgba(227,180,90,.75)"; ctx.lineWidth = 2; ctx.strokeRect(32, 32, W - 64, H - 64);
  ctx.strokeStyle = "rgba(227,180,90,.3)"; ctx.lineWidth = 1; ctx.strokeRect(44, 44, W - 88, H - 88);
  for (const [x, y] of [[32, 32], [W - 32, 32], [32, H - 32], [W - 32, H - 32]]) sparkle(ctx, x, y, 16, "#f3d08a");

  ctx.textAlign = "center";
  ctx.fillStyle = GOLD; ctx.font = `italic 600 34px ${NUM}`; spaced(ctx, "10px"); ctx.fillText("MY STELLA TYPE", cx, 124); spaced(ctx, "0px");
  ctx.fillStyle = MUTED; ctx.font = `400 28px ${SANS}`; ctx.fillText("私のステラタイプは", cx, 172);

  // Character medallion
  ctx.setLineDash([2, 12]); ctx.strokeStyle = "rgba(227,180,90,.55)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, 318, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
  for (const a of [-.25, .35, 1.1, 1.75]) sparkle(ctx, cx + Math.cos(a * Math.PI) * 318, cy + Math.sin(a * Math.PI) * 318, 9, "#f3d08a");
  ctx.strokeStyle = GOLD; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, cy, 292, 0, Math.PI * 2); ctx.stroke();
  ctx.save(); ctx.shadowColor = element.color; ctx.shadowBlur = 70;
  ctx.fillStyle = element.tint; ctx.beginPath(); ctx.arc(cx, cy, 270, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  const shine = ctx.createRadialGradient(cx - 90, cy - 110, 10, cx - 90, cy - 110, 300); shine.addColorStop(0, "rgba(255,255,255,.6)"); shine.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = shine; ctx.beginPath(); ctx.arc(cx, cy, 270, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = element.color; ctx.lineWidth = 12; ctx.beginPath(); ctx.arc(cx, cy, 270, 0, Math.PI * 2); ctx.stroke();
  ctx.drawImage(image, cx - 220, cy - 212, 440, 440);

  // Name, keywords, catch
  const no = String(CHARACTER_TYPES.indexOf(type) + 1).padStart(2, "0");
  ctx.fillStyle = GOLD; ctx.font = `italic 600 34px ${NUM}`; ctx.fillText(`No.${no} / 10`, cx, 878);
  ctx.fillStyle = INK; ctx.font = `800 68px ${SERIF}`; ctx.fillText(type.displayName, cx, 958, 940);
  ctx.font = `400 24px ${SANS}`;
  const pills = type.keywords.map(word => ({ word, w: ctx.measureText(word).width + 44 }));
  let x = cx - (pills.reduce((sum, p) => sum + p.w, 0) + (pills.length - 1) * 12) / 2;
  for (const pill of pills) {
    ctx.fillStyle = "rgba(255,255,255,.07)"; ctx.strokeStyle = "rgba(227,180,90,.45)"; ctx.lineWidth = 1.5;
    ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(x, 994, pill.w, 46, 23); else ctx.rect(x, 994, pill.w, 46); ctx.fill(); ctx.stroke();
    ctx.fillStyle = INK; ctx.fillText(pill.word, x + pill.w / 2, 1025); x += pill.w + 12;
  }
  ctx.font = `400 32px ${SANS}`; catchLines.forEach((line, i) => ctx.fillText(line, cx, 1104 + i * 50, 920));

  // Signature
  ctx.strokeStyle = "rgba(227,180,90,.6)"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(390, 1200); ctx.lineTo(510, 1200); ctx.moveTo(570, 1200); ctx.lineTo(690, 1200); ctx.stroke();
  sparkle(ctx, cx, 1200, 11, "#f3d08a");
  ctx.fillStyle = INK; ctx.font = `700 36px ${SERIF}`; spaced(ctx, "6px"); ctx.fillText(SITE_NAME, cx, 1254); spaced(ctx, "0px");
  ctx.fillStyle = MUTED; ctx.font = `400 21px ${SANS}`; ctx.fillText(`${SITE_TAGLINE}　${host}`, cx, 1292, 960);

  const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(b => b ? resolve(b) : reject(new Error("export")), "image/png"));
  const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = `stella-file-${type.slug}.png`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** mode="result": the visitor's own diagnosis. mode="type": a public type page, so nothing claims it is the viewer's result. */
export function ShareActions({ type, mode }: { type: CharacterType; mode: "result" | "type" }) {
  const [message, setMessage] = useState(""); const [saving, setSaving] = useState(false);
  const shareData = () => ({
    title: `${SITE_NAME}｜${type.displayName}`,
    text: mode === "result" ? `私は「${type.displayName}」でした！\n${type.shortCatch}\nあなたは何タイプ？ #ステラファイル` : `「${type.displayName}」は、こんなタイプ。\n${type.shortCatch}\nあなたは何タイプ？ #ステラファイル`,
    url: `${window.location.origin}${assetPath(`/types/${type.slug}/`)}`,
  });
  async function copy() { const data = shareData(); try { await navigator.clipboard.writeText(`${data.text}\n${data.url}`); setMessage("コピーしました。"); } catch { setMessage(`コピーできませんでした。こちらの文を選択してください：${data.text} ${data.url}`); } }
  async function share() { if (!navigator.share) { await copy(); return; } try { await navigator.share(shareData()); } catch (error) { if (!(error instanceof DOMException && error.name === "AbortError")) setMessage("シェアできませんでした。コピーボタンをお試しください。"); } }
  async function save() { setSaving(true); try { await exportCard(type); setMessage("画像を保存しました。"); } catch { setMessage("画像を保存できませんでした。もう一度お試しください。"); } finally { setSaving(false); } }
  return <div className={`share-actions share-${mode}`}>
    {mode === "type" && <p className="share-label">このタイプをシェア</p>}
    <div className="share-buttons">
      {mode === "result" && <button type="button" className="button secondary share-save" onClick={save} disabled={saving}><Download size={17} aria-hidden="true" />{saving ? "保存中…" : "結果画像を保存"}</button>}
      <button type="button" className="chip-button" onClick={share}><Share2 size={16} aria-hidden="true" />シェア</button>
      <button type="button" className="chip-button" onClick={copy}><Copy size={16} aria-hidden="true" />{mode === "result" ? "コピー" : "リンクをコピー"}</button>
    </div>
    <p className="share-status micro" role="status">{message}</p>
  </div>;
}
