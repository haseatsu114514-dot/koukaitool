"use client";
import { useState } from "react";
import { Copy, Download, Share2 } from "lucide-react";
import { characterAsset, elementColors, type CharacterType } from "@/data/types";
import { assetPath } from "@/lib/paths";
/** Dedicated export adapter. No birthday or hidden-stem data in shared text/image.
 * Canvas uses same-origin SVG assets; future API assets must be served with CORS. */
async function exportCard(type: CharacterType) {
  const canvas = document.createElement("canvas"); canvas.width = 1080; canvas.height = 1350;
  const ctx = canvas.getContext("2d"); if (!ctx) throw new Error("canvas");
  await document.fonts.ready;
  const image = new Image(); image.src = assetPath(characterAsset(type).src); await image.decode();
  const element = elementColors(type.stem);
  ctx.fillStyle = "#0a1628"; ctx.fillRect(0, 0, 1080, 1350);
  ctx.fillStyle = element.tint; ctx.beginPath(); ctx.arc(540, 460, 320, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = element.color; ctx.lineWidth = 10; ctx.stroke();
  ctx.strokeStyle = "#e8b95a"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(540, 460, 350, 0, Math.PI * 2); ctx.stroke();
  ctx.drawImage(image, 210, 130, 660, 660);
  ctx.textAlign = "center"; ctx.fillStyle = "#e8b95a"; ctx.font = '26px sans-serif'; ctx.fillText("STELLA FILE / MY PERSONALITY", 540, 94);
  ctx.fillStyle = "#f3ead8"; ctx.font = 'bold 52px sans-serif'; ctx.fillText(type.displayName, 540, 866, 940);
  ctx.font = '26px sans-serif'; ctx.fillText(type.keywords.join("  /  "), 540, 938);
  // Keep Japanese sentence punctuation with its sentence, avoiding orphaned full stops.
  const lines = type.shortCatch.split("。").filter(Boolean).map(sentence => `${sentence}。`);
  ctx.font = '30px sans-serif'; lines.forEach((line, i) => ctx.fillText(line, 540, 1030 + i * 48, 920));
  ctx.font = 'bold 30px sans-serif'; ctx.fillText("ステラファイル", 540, 1220);
  ctx.font = '20px sans-serif'; ctx.fillText("私らしさに、ひとつ気づく。", 540, 1265);
  const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(b => b ? resolve(b) : reject(new Error("export")), "image/png"));
  const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = `stella-file-${type.slug}.png`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function ShareActions({ type }: { type: CharacterType }) {
  const [message, setMessage] = useState(""); const [saving, setSaving] = useState(false);
  const shareData = () => ({ title: `ステラファイル｜${type.displayName}`, text: `私のタイプは「${type.displayName}」でした。${type.shortCatch}\n#ステラファイル`, url: `${window.location.origin}${assetPath(`/types/${type.slug}/`)}` });
  async function copy() { const data = shareData(); try { await navigator.clipboard.writeText(`${data.text}\n${data.url}`); setMessage("共有文をコピーしました。Threadsなどに貼り付けて使えます。"); } catch { setMessage(`コピーできませんでした。こちらの文を選択してください：${data.text} ${data.url}`); } }
  async function share() { if (!navigator.share) { await copy(); return; } try { await navigator.share(shareData()); setMessage("共有メニューを開きました。"); } catch (error) { if (!(error instanceof DOMException && error.name === "AbortError")) setMessage("共有できませんでした。「共有文をコピー」をお試しください。"); } }
  async function save() { setSaving(true); try { await exportCard(type); setMessage("保存用の画像を作成しました。ダウンロード先をご確認ください。"); } catch { setMessage("画像を作成できませんでした。時間をおいて、もう一度お試しください。"); } finally { setSaving(false); } }
  return <div className="share-actions"><div className="share-buttons"><button className="button secondary" onClick={save} disabled={saving}><Download size={16} />{saving ? "画像を作成中…" : "結果画像を保存"}</button><button className="icon-button" aria-label="結果をシェア" onClick={share}><Share2 size={18} /></button><button className="icon-button" aria-label="共有文をコピー" onClick={copy}><Copy size={18} /></button></div><p className="share-status micro" role="status">{message || "結果を画像保存・シェアできます。"}</p></div>;
}
