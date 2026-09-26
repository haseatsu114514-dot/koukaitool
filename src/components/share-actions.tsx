"use client";
import { useState } from "react";
import { Copy, Download, Share2 } from "lucide-react";
import { CHARACTER_TYPES, characterAsset, elementColors, type CharacterType } from "@/data/types";
import { assetPath } from "@/lib/paths";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";
import { track } from "@/lib/analytics";
import { LOGO_PATH } from "./logo";

const SERIF = '"Shippori Mincho B1", "Hiragino Mincho ProN", "Yu Mincho", serif';
const SANS = '"Zen Kaku Gothic New", "Hiragino Kaku Gothic ProN", "Yu Gothic", sans-serif';
const GOLD = "#e3b45a", INK = "#f3ead8", MUTED = "#a3b2c8", NAVY = "#0b1729", LINE = "#34527a";

/** Deterministic background stars per type, so a saved card always looks the same. */
function random(seed: string) {
  let h = 2166136261; for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => { h = (h + 0x6d2b79f5) | 0; let t = Math.imul(h ^ (h >>> 15), 1 | h); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

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
    document.fonts.load(`700 64px ${SERIF}`, `${type.displayName}${SITE_NAME}`),
    document.fonts.load(`400 30px ${SANS}`, `私のステラタイプ${type.keywords.join("")}${catchLines.join("")}${SITE_TAGLINE}`),
    document.fonts.load(`700 30px ${SANS}`, "No.0123456789/"),
  ]);
  const image = new Image(); image.src = assetPath(characterAsset(type).src); await image.decode();
  const element = elementColors(type.stem), rand = random(type.slug);

  // Background: night blue with a few quiet stars
  const bg = ctx.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#12294a"); bg.addColorStop(.55, NAVY); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#ffffff";
  for (let i = 0; i < 90; i++) { ctx.globalAlpha = .15 + rand() * .45; ctx.beginPath(); ctx.arc(rand() * W, rand() * H, .7 + rand() * 1.3, 0, Math.PI * 2); ctx.fill(); }
  ctx.globalAlpha = 1;
  ctx.strokeStyle = LINE; ctx.lineWidth = 2; ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(36, 36, W - 72, H - 72, 28); else ctx.rect(36, 36, W - 72, H - 72); ctx.stroke();

  // Header: brand mark + name, then the label
  const mark = new Path2D(LOGO_PATH);
  ctx.save(); ctx.translate(cx - 150, 92); ctx.scale(.9, .9); ctx.translate(-9, -16); ctx.fillStyle = GOLD; ctx.fill(mark, "evenodd"); ctx.restore();
  ctx.textAlign = "left"; ctx.fillStyle = INK; ctx.font = `700 34px ${SERIF}`; ctx.fillText(SITE_NAME, cx - 98, 122);
  ctx.textAlign = "center"; ctx.fillStyle = MUTED; ctx.font = `400 28px ${SANS}`; ctx.fillText("私のステラタイプ", cx, 190);

  // Character on its element colour
  ctx.fillStyle = element.tint; ctx.beginPath(); ctx.arc(cx, cy, 262, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = element.color; ctx.lineWidth = 10; ctx.stroke();
  ctx.drawImage(image, cx - 214, cy - 206, 428, 428);

  // Name, keywords, catch
  const no = String(CHARACTER_TYPES.indexOf(type) + 1).padStart(2, "0");
  ctx.fillStyle = GOLD; ctx.font = `700 28px ${SANS}`; ctx.fillText(`No.${no}`, cx, 848);
  ctx.fillStyle = INK; ctx.font = `700 64px ${SERIF}`; ctx.fillText(type.displayName, cx, 930, 940);
  ctx.font = `400 24px ${SANS}`;
  const pills = type.keywords.map(word => ({ word, w: ctx.measureText(word).width + 44 }));
  let x = cx - (pills.reduce((sum, p) => sum + p.w, 0) + (pills.length - 1) * 12) / 2;
  for (const pill of pills) {
    ctx.fillStyle = "#162b47"; ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(x, 968, pill.w, 46, 23); else ctx.rect(x, 968, pill.w, 46); ctx.fill();
    ctx.fillStyle = INK; ctx.fillText(pill.word, x + pill.w / 2, 999); x += pill.w + 12;
  }
  ctx.font = `400 32px ${SANS}`; catchLines.forEach((line, i) => ctx.fillText(line, cx, 1086 + i * 50, 920));

  // Footer
  ctx.strokeStyle = LINE; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(120, 1206); ctx.lineTo(W - 120, 1206); ctx.stroke();
  ctx.fillStyle = MUTED; ctx.font = `400 22px ${SANS}`; ctx.fillText(SITE_TAGLINE, cx, 1256, 900);
  ctx.fillStyle = GOLD; ctx.font = `700 22px ${SANS}`; ctx.fillText(host, cx, 1292, 900);

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
  const tracked = (method: "image" | "native" | "copy") => track({ name: "share", method, content_type: mode, item_id: type.slug });
  async function copy() { const data = shareData(); try { await navigator.clipboard.writeText(`${data.text}\n${data.url}`); setMessage("コピーしました。"); tracked("copy"); } catch { setMessage(`コピーできませんでした。こちらの文を選択してください：${data.text} ${data.url}`); } }
  async function share() { if (!navigator.share) { await copy(); return; } try { await navigator.share(shareData()); tracked("native"); } catch (error) { if (!(error instanceof DOMException && error.name === "AbortError")) await copy(); } }
  async function save() { setSaving(true); try { await exportCard(type); setMessage("画像を保存しました。"); tracked("image"); } catch { setMessage("画像を保存できませんでした。もう一度お試しください。"); } finally { setSaving(false); } }
  return <div className={`share-actions share-${mode}`}>
    {mode === "type" && <p className="share-label">このタイプをシェア</p>}
    {mode === "result" ? <div className="share-pair">
      <button type="button" className="button secondary" onClick={save} disabled={saving}><Download size={17} aria-hidden="true" />{saving ? "保存中…" : "画像を保存"}</button>
      {/* Where the share sheet is missing (most desktop browsers), this copies the text and link instead. */}
      <button type="button" className="button secondary" onClick={share}><Share2 size={17} aria-hidden="true" />シェア</button>
    </div> : <div className="share-buttons">
      <button type="button" className="chip-button" onClick={share}><Share2 size={16} aria-hidden="true" />シェア</button>
      <button type="button" className="chip-button" onClick={copy}><Copy size={16} aria-hidden="true" />リンクをコピー</button>
    </div>}
    <p className="share-status micro" role="status">{message}</p>
  </div>;
}
