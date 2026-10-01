# キャラクター画像の生成記録

2026年10月1日。Codexの組み込み `image_gen` ツールを使用。

ユーザー提供のくまを絵柄の基準に、残り9体を作成。追加要望「もっと表情とかキャラによって豊かにしたい」に合わせ、目・眉・口・頭の傾き・手足のポーズをタイプごとに変えています。

共通指示と各キャラクターの生成プロンプトは [generation-prompts.json](generation-prompts.json)。基準画像は [bear-style-reference.png](bear-style-reference.png)。見比べる一覧は [preview.html](preview.html)。最終PNGは `public/characters/<slug>-soft.png`。

| キャラクター | 表情・ポーズ |
| --- | --- |
| ちゃっかりうさぎ | いたずらっぽいウインク・片手を上げたちゃっかり顔 |
| 勝手に主役フェニックス | 三日月目と満面の笑顔・翼を高く広げる |
| お見通し妖狐 | 半目の観察眼・片眉を上げた余裕のある微笑み |
| 親分パンダ | どっしりした自信顔・片眉を上げて大きくにっこり |
| ほっとけないアルパカ | 子どもを見守るやさしい目・少し心配そうな微笑み |
| 正々堂々ドーベルマン | まっすぐな目ときりっとした眉・胸を張る誠実な顔 |
| ガラスハートハリネズミ | 照れた頬と不安げな目・ハートを大切に抱きしめる |
| 恋も野望も全力シャチ | 自信いっぱいの大きな笑顔・勢いよく跳ねる |
| 温泉カピバラ | とろんとした半目・温泉で満足そうにほっとする |

提供されたくまの原本を保存したうえで、サイト用には背景のみを透過にした派生PNGも作成しています。顔の表情を変える指示はしていません。

## 色とハリの調整

追加要望に合わせ、アルパカをバターイエロー、妖狐を淡いピーチピンク、ハリネズミをライラックとパールに変更。大きな顔の色面でも見分けられるようにしています。ハリネズミはハリをはっきり尖った三角形へ変更。表情とポーズは保ちます。

カピバラは当初ミストグレーに調整しましたが、続く要望に合わせてグレー寄りの薄茶色へ再調整。小さい耳・四角めの頭・長く平らな鼻先でもグリズリーとの差をつけます。ドーベルマンには控えめな銀の胸当てと小さな銀の盾を追加します。この最終調整の指示全文は [final-refinement.json](final-refinement.json)。

ドーベルマンの装備追加時に生じた額中央の小さな描画の汚れは、[doberman-cleanup.json](doberman-cleanup.json) の指示で整えています。

## 妖狐の白い毛色

続く要望「妖狐は真っ白系がいい」に合わせ、顔・体・足・しっぽの大部分をスノーホワイトに変更。朱色は内耳・眉の模様・しっぽ先の小さなアクセントに留めます。半目の表情、頭の傾き、考えるような手のポーズ、ろうそくは保ちます。全文は [fox-white-refinement.json](fox-white-refinement.json)。

調整に使用した全文は [palette-refinement.json](palette-refinement.json)。

## くまの背景透過プロンプト

```text
Use case: background-extraction
Asset type: transparent cutout PNG of the PROVIDED ORIGINAL bear illustration for the same website.
Input image 1: exact EDIT TARGET, supplied original artwork.
Primary request: remove ONLY the pale ivory background outside the bear and make those pixels genuinely transparent. Preserve the exact bear artwork, facial expression, silhouette, line thickness, brown fill, cream muzzle, cream bib, cream inner-ear areas, green bow tie and all tiny paws. Preserve all cream and light regions INSIDE the bear as fully opaque. Maintain original square canvas, same exact scale and centered positioning. Keep the bear's original shy worried brows and little smile unchanged. No redraw, no extra features, no changes of proportions or colors, no new ground shadow, no checkerboard drawn into image. Background cutout only, antialias edges cleanly.
```

## 正式採用

2026年10月2日、ユーザーの「やはり表情はある方を残す」により、表情付きの10種を正式採用。診断サイトの画面、保存画像、OG画像へ反映しています。画面配信用WebPは原本PNGから可逆圧縮で作成し、絵柄・色・表情・寸法を保ちます。
