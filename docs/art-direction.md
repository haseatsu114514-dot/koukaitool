# キャラクターと画面の設計

## ビジュアルの軸

深い夜空（`#0b1729`）に、金箔のようなゴールド（`#e3b45a`）の細い罫線とアクセントを重ねた「星のファイル」。キャラクターはエレメント色の淡い紙（`tint`）に置き、画面でいちばん明るい面にします。余白と読みやすい本文を優先し、紫は星雲のかすかな色味だけに使います。ネオン、ギラついたグラデーション、黒一色の背景は使いません。

- 書体：見出しは明朝（Shippori Mincho B1、20px以上のみ）、本文と小見出しはゴシック（Zen Kaku Gothic New）、番号・英字の飾りはイタリックのセリフ（Cormorant Garamond）。
- 装飾：金の四隅マーク（`.frame`）、中央に星のあるオーナメント線、キャラクター面の内側の白い細枠（台紙）。パネルには白いノイズを `soft-light` で薄く重ねる。
- エレメント色：木＝緑、火＝赤、土＝黄、金＝シルバーの枠＋パールの紙、水＝青。一覧ページに凡例を置く。
- 動き：背景の星は常に控えめに動かし、それ以外は画面ごとに主役を1つだけ（トップ＝10体の軌道、スマホは名前の流れる帯、結果とタイプ紹介＝キャラクター枠の光の輪）。ほかは一度きりのフェードイン。`prefers-reduced-motion` ではすべて止める。
- 文字サイズの下限：ラベル11px、補足12px、小さい本文13px。

全キャラクターを320×320 viewBox、太さ4.2の暖かい茶線、丸いlinecap/linejoin、フラットカラーで統一。参考画像はニュアンスのみを参照し、オリジナル仮SVGを実装しています。

## アセットの仕様

`src/data/art-direction.ts` が共通style guideとasset schema、`src/data/types.ts` が固有prompt seedと小道具・背景モチーフを定義。

```ts
type CharacterAsset = {
  slug: string;
  status: 'placeholder' | 'generated' | 'approved';
  src: string;
  alt: string;
  styleVersion: string;
  width: number;
  height: number;
  provenance: { kind: 'original-svg' | 'generation'; provider?: string; model?: string; createdAt?: string };
}
```

生成リクエストは `generationRequest(type)` で作ります。共通positive prompt＋固有seed、共通negative prompt、1024×1024、styleVersionを返します。実行APIや疑似生成はありません。

外部API接続時は、秘密鍵をブラウザへ渡さず、サーバー側のproviderが処理します。生成元・モデル・日付・絵柄版を保存し、人の確認後にapprovedとします。アセットは自サイトへ配置するか、画像書き出しに必要なCORSを許可。一時URLを永続アセットURLにしないでください。

## 画像差し替えTODO

- [ ] 己「ほっとけないカンガルー」（`kangaroo`）：旧「頼られ師匠ゾウ」から動物ごと変更。現在は仮SVG（`public/characters/kangaroo.svg`）なので、`generationRequest` のpromptで画像生成して差し替える。
- [ ] 全10タイプ：仮SVGを画像生成アセットへ作り替え、`status` を `generated` → 確認後 `approved` に更新する。

## 品質確認

- 主役はキャラクター。小物は1〜2点、背景は疎にする。
- 小さい図鑑カードでも動物と姿勢を読み取れること。
- 毛の描き込み、立体光沢、過剰なハート、大きなアニメ眼、文字の焼き込みを避ける。
- 画像と色、名前、説明文を分離し、文言を画像へ固定しない。
- 結果PNGは1080×1350。日付を渡さない専用処理で書き出す（サイトのWebフォント・星空・サイトURL入り）。
- OG画像は1200×630のJPEG。`pnpm og` で `public/og/` に再生成する。

## アクセシビリティ

フォームは明示ラベルとfieldset/legend、エラーをlive regionで通知。主なボタン46〜56px、focus-visible、本文スキップリンク、reduced-motion、イラストaltを用意。フォントはGoogle Fontsから実行時に読み込み、読み込めない場合はOS標準の日本語フォントで表示します（外部リクエストはプライバシーページで開示）。
