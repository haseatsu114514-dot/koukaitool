# キャラクターと画面の設計

## ビジュアルの軸

アイボリーの紙、赤茶の控えめなアクセント、セージの強みカード。余白、細い罫線、読みやすい本文を中心にした、成人向けライフスタイルブランドの温度感。紫・黒・星空・グラデーションを中心とする占いUIは使いません。

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

## 品質確認

- 主役はキャラクター。小物は1〜2点、背景は疎にする。
- 小さい図鑑カードでも動物と姿勢を読み取れること。
- 毛の描き込み、立体光沢、過剰なハート、大きなアニメ眼、文字の焼き込みを避ける。
- 画像と色、名前、説明文を分離し、文言を画像へ固定しない。
- 結果PNGは1080×1350。日付を渡さない専用処理で書き出す。

## アクセシビリティ

フォームは明示ラベルとfieldset/legend、エラーをlive regionで通知。主なボタン46〜54px、focus-visible、本文スキップリンク、reduced-motion、イラストaltを用意。OS標準の日本語フォントを使い外部フォントリクエストを出しません。
