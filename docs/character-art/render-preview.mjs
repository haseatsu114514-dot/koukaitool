import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
const require = createRequire(import.meta.url);
const nextRequire = createRequire(require.resolve("next/package.json"));
const sharp = nextRequire("sharp");
const repo = fileURLToPath(new URL("../../", import.meta.url));
const destination = process.argv[2] || path.resolve(repo, "../character-deliverables");
const source = await readFile(path.join(repo, "src/data/types.ts"), "utf8");
const types = [...source.matchAll(/slug: "([^"]+)", displayName: "([^"]+)"/g)].map(match => ({slug: match[1], name: match[2]}));
if (types.length !== 10) throw new Error("Expected exactly 10 character types");
const labels = {
  grizzly: ["ほめ待ち", "グリズリー"],
  rabbit: ["ちゃっかりうさぎ"],
  phoenix: ["勝手に主役", "フェニックス"],
  fox: ["お見通し妖狐"],
  panda: ["親分パンダ"],
  alpaca: ["ほっとけない", "アルパカ"],
  doberman: ["正々堂々", "ドーベルマン"],
  hedgehog: ["ガラスハート", "ハリネズミ"],
  orca: ["恋も野望も全力", "シャチ"],
  capybara: ["温泉カピバラ"]
};
const esc = value => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll('"', "&quot;");
const W=2600, H=1570, left=80, top=210, gap=28, cardW=465.6, cardH=590;
const cards = await Promise.all(types.map(async (type,index) => {
  const input=path.join(repo,"public/characters",type.slug+"-soft.png");
  const bytes=await readFile(input);
  const metadata=await sharp(bytes).metadata();
  if (!metadata.width || !metadata.height) throw new Error("Invalid image: "+type.slug);
  const x=left+(index%5)*(cardW+gap), y=top+Math.floor(index/5)*(cardH+gap);
  const cx=x+cardW/2;
  const imageX=x+20, imageY=y+18, imageSize=cardW-40;
  const lines=labels[type.slug];
  const text = lines.map((line,i) => '<text x="'+cx+'" y="'+(y+492+(lines.length===1?22:i*43))+'" text-anchor="middle" font-family="Hiragino Sans,Hiragino Kaku Gothic ProN,Noto Sans CJK JP,sans-serif" font-size="34" font-weight="600" fill="#4b281a">'+esc(line)+'</text>').join("");
  return '<g><rect x="'+x+'" y="'+y+'" width="'+cardW+'" height="'+cardH+'" rx="25" fill="#fffdf8" stroke="#e6dccd" stroke-width="2"/><rect x="'+imageX+'" y="'+imageY+'" width="'+imageSize+'" height="'+imageSize+'" rx="18" fill="#f6f1e8"/><image x="'+imageX+'" y="'+imageY+'" width="'+imageSize+'" height="'+imageSize+'" preserveAspectRatio="xMidYMid meet" href="data:image/png;base64,'+bytes.toString("base64")+'"/>'+text+'</g>';
}));
const svg = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="'+W+'" height="'+H+'" viewBox="0 0 '+W+' '+H+'"><rect width="'+W+'" height="'+H+'" fill="#faf7f0"/><text x="80" y="109" font-family="Hiragino Sans,Hiragino Kaku Gothic ProN,Noto Sans CJK JP,sans-serif" font-size="64" font-weight="700" fill="#4b281a">キャラクター 10タイプ</text><text x="82" y="164" font-family="Hiragino Sans,Hiragino Kaku Gothic ProN,Noto Sans CJK JP,sans-serif" font-size="29" fill="#826b58">ステラファイル · 最新のデザイン</text>'+cards.join("")+'<text x="2520" y="1520" text-anchor="end" font-family="Hiragino Sans,Hiragino Kaku Gothic ProN,Noto Sans CJK JP,sans-serif" font-size="25" fill="#9a8572">2026.10.01</text></svg>';
await mkdir(destination,{recursive:true});
const stem="stella-characters-preview-10";
await writeFile(path.join(destination,stem+".svg"),svg);
await sharp(Buffer.from(svg)).png().toFile(path.join(destination,stem+".png"));
await writeFile(path.join(destination,stem+".json"),JSON.stringify({format:"PNG",width:W,height:H,layout:"5 columns by 2 rows",characters:types,sourceDirectory:path.join(repo,"public/characters")},null,2));
console.log(JSON.stringify({png:path.join(destination,stem+".png"),svg:path.join(destination,stem+".svg"),count:types.length,width:W,height:H}));
