# ステラファイル

生年月日から日干の10タイプと、月支の蔵干・本気による通変星の強みを知る、日本語の簡略診断Webアプリです。旧「生年月日 逆算くん」を置き換えています。以前の内容はGit履歴に残ります。

## セットアップ

Node.js 22以上、pnpm 11.19.0を使用します。

```sh
corepack enable
corepack prepare pnpm@11.19.0 --activate
pnpm install --frozen-lockfile
pnpm dev
```

開発画面: http://localhost:3000 。環境変数は `.env.example` を参照。DB・APIキーは不要です。フォントは閲覧時にGoogle Fontsから読み込むため、ビルドにネットワークは要りません（プライバシーページで開示）。

```sh
pnpm test            # 暦・バリデーション・通変星・コンテンツの検証
pnpm typecheck       # 型チェック（初回は pnpm build も実行）
pnpm build           # 静的配信可能な out/ を作成
pnpm exec playwright install chromium
pnpm test:e2e        # スマホ / PC の操作テスト
pnpm og              # OG画像（public/og/*.jpg）を再生成
```

## 設計と画面

Next.js App Router / React / TypeScript / Zod。CSSの共通トークンとセマンティックHTMLによる独自UIを採用しています。現状の機能規模に合わせ、Tailwindやshadcn/uiへの依存は追加していません。

| URL | 役割 |
| --- | --- |
| `/` | サービス説明、生年月日フォーム（`#diagnose`。実在日・未来日チェック）、10タイプのプレビュー |
| `/result/` | 診断結果（本を開く演出 → タイプ詳細＋アイテム＋結果シェア）。直接訪問・保存失敗時は再診断を案内 |
| `/types/` | 10タイプ一覧と、枠の色（緑・赤・黄・白・青のグループ）の説明 |
| `/types/[slug]/` | 生年月日を含まない共有可能なタイプ紹介。シェアで来た人向けに診断導線を上部に置く |
| `/privacy/` | 入力・端末内一時保存・共有・Webフォントの説明 |

スマホ幅（700px以下）ではヘッダーのナビを隠し、下部タブバー（ホーム／タイプ／結果）に切り替えます。

```text
src/
  app/                  各ページ、レイアウト、共通CSS
  components/
    birth-form.tsx      入力と検証
    profile.tsx         結果と公開タイプ詳細に共通の表示（結果かどうかで導線を切り替え）
    share-actions.tsx   共有文、Web Share、PNG書き出し
    book-reveal.tsx     結果表示前の演出
    character.tsx       アセット表示アダプター
    type-card.tsx       一覧カード
    result-view.tsx     一時保存からの結果復元
    tab-bar.tsx         スマホ用の下部タブ
    bx.tsx              BudouXによる文節単位の改行
  data/
    types.ts            10タイプの名前・キャッチ・要約・強み、グループの色、画像プロンプト
    type-details.ts     タイプ詳細ページの長文（性格・あるある・恋愛・仕事など）
    art-direction.ts    共通絵柄、asset schema、生成provider interface
  lib/
    diagnosis/
      calendar.ts       入力スキーマ、日干支の整数日計算、節入りによる月支
      setsuiri.ts       1900〜2100年の節入り時刻表（日本時間、生成物）
      ten-gods.ts       本気表、陰陽五行による通変星、補足文章
      index.ts          diagnose() と計算ルールの版
    result-store.ts     生年月日を含まないタブ内一時保存
    paths.ts            GitHub Pagesのサブパス対応、OG用の絶対URL
    site.ts             サイト名・キャッチ、ページごとのメタ情報（OG/Xカード）
public/characters/      10体のオリジナル仮SVG
public/og/              OG画像（scripts/og-images.mjs で生成）
scripts/                OG画像と節入り時刻表の生成スクリプト
tests/                  計算・データ・ブラウザ操作テスト
docs/                   計算ルールとブランド/拡張仕様
.github/workflows/      検証とGitHub Pages公開
```

## データ構造

`CharacterType` は `stem, slug, displayName, shortCatch, summary, strengths, keywords, motif, props, backgroundMotifs, imagePrompt` を持ちます。`summary` はタイプ紹介ページのmeta descriptionに使います。詳細ページの長文は `src/data/type-details.ts`、アイテム（通変星）の文章は `src/lib/diagnosis/ten-gods.ts` の `GOD_COPY` にあります。名前・キャッチ・キーワードを変えたら `pnpm og` でOG画像も作り直してください。slugは共有URLになるため、公開後の変更にはリダイレクト設計が必要です。

`DiagnosisResult` は `pillar, monthBranch, hiddenStem, tenGod, ruleVersion, scope, providerId` を持ち、UIやキャラクター名に依存しません。将来のDB化ではタイプデータの取得先を差し替えられます。

## 計算の範囲

**通変星は月支の本気だけを使います。** 年柱・時柱を含む完全な命式ではありません。

- 西暦の生年月日を、0:00で切り替わる暦日として扱う。
- 2000-01-07の甲子からの整数日差を60で剰余し、10干・12支を取り出す。
- 日干がタイプを決める。日本時間の節入りで月支を出し（小寒=丑、立春=寅 … 大雪=子）、その蔵干の本気を日干と比較して通変星を算出。
- 時刻は聞かない。節入り当日生まれは正午生まれとみなす。
- 年柱、23時換日、出生地補正、中気・余気、身強身弱・大運は計算しない。
- 詳細は [計算仕様](docs/calculation.md)。今後の仕様変更では `RULE_VERSION` を更新する。

## プライバシーと共有

生年月日はブラウザ内でのみ使用し、サーバー、URL、localStorage、sessionStorageへ保存しません。sessionStorageには日干支・サイクル番号・月支とルールの版だけを保存。タブ内の再読み込みに対応し、不正・旧形式データは無視します。保存領域が使用不可でも同一クライアント遷移中はメモリから結果を表示できます。共有は一般的なタイプ紹介URLと、誕生日や通変星（アイテム）を含まない画像・文章を使用します。タイプ紹介ページの共有文は「私は〜でした」ではなく、タイプの紹介として書きます。

PNG保存はCanvasによる1080×1350（サイトのWebフォント、ロゴ、サイトURL入り）。Threads専用APIは使わず、共有文コピーと端末の共有メニューに対応します。Web Share / Clipboardが使用できない場合もメッセージで案内します。

閲覧時にGoogle Fonts（fonts.googleapis.com / fonts.gstatic.com）へリクエストが発生し、IPアドレス等がGoogleに送られます。プライバシーページに記載しています。フォントを自サイト配信に切り替えた場合は、その記載も更新してください。

## イラスト

10体の仮SVGは独自に作成。参考画像の丸い線・少ない色数という方向性を参考にし、素材自体は転用していません。生成APIは未接続。`generationRequest(type)` で、共通絵柄＋固有プロンプト＋negative prompt＋サイズを取得できます。

`CharacterAsset` に状態（placeholder / generated / approved）、サイズ、alt、絵柄版、生成元を持たせています。将来はサーバー側で `ImageGenerationProvider` を実装し、レビュー済み画像だけを公開します。詳細は [アセット設計](docs/art-direction.md)。

## 公式LINEへの案内

診断結果ページに「LINEで友だち追加」ボタンを2か所（タイプ紹介の直後と、ページの終わり）表示します。URLは `NEXT_PUBLIC_LINE_URL`（GitHub Actionsでは **Settings → Secrets and variables → Actions → Variables** の `LINE_FRIEND_URL`）で設定し、未設定ならボタンは出ません。タイプ紹介ページ（診断していない人が見るページ）には出しません。ボタンはLINEのロゴを使わない文字ボタンです。

## 用語

画面では五行の用語（木・火・土・金・水、エレメント）を使わず、「緑・赤・黄・白・青グループ」と呼びます（`GROUP_NAMES` / `groupName`）。コード内の `ELEMENT_COLORS` などの名前は内部用です。

## GitHub Pages

Next.jsの静的エクスポートを使用。GitHubの **Settings → Pages → Source を GitHub Actions** に設定すると、mainへのpushから `.github/workflows/pages.yml` が検証・ビルド・公開します。GitHub側の設定変更が必要な環境では、コードのpushだけでは既存Pagesの配信元は切り替わりません。

プロジェクトPages用ビルドは `NEXT_PUBLIC_BASE_PATH=/koukaitool` と `NEXT_PUBLIC_SITE_URL=https://haseatsu114514-dot.github.io`（OG画像・canonicalの絶対URL用）。ルートドメイン（Vercelなど）では `NEXT_PUBLIC_BASE_PATH` を未設定にし、`NEXT_PUBLIC_SITE_URL` をそのドメインにしてください。`next start` は使いません。静的公開物は `out/` のみ。会員DBや画像生成APIを追加するときは、サーバー対応ホストへの移行または独立APIが必要です。

## 今後の拡張

1. 中気・余気の採用表、重み、流派、節入りの扱いを別ルールとして追加。
2. 年柱を追加。任意の出生時刻入力を受け付けて節入り当日の判定に使い、時刻不明時の境界日には曖昧さを明示する。
3. 承認済みのキャラクター画像に差し替え、`pnpm og` でOG画像も更新する。
4. 同意を含む会員登録・保存/削除APIを設計し、端末内保存と切り分ける。
5. iOS Safari実機、スクリーンリーダー、専門家による暦・文面監修を行う。

課金・詳細鑑定申込・外部画像生成・会員登録は未実装。CTAはトップの生年月日フォームへ遷移し、提供していない機能を申し込ませません。

## OG画像

`public/og/default.jpg`（トップ・一覧など）と `public/og/{slug}.jpg`（タイプ紹介）は、`scripts/og-images.mjs` がPlaywrightで描画した1200×630のJPEGです。使う文字だけをGoogle Fontsから取得して埋め込むため、ブラウザ側のネットワークは不要です。

```sh
pnpm og                                   # playwright install 済みのChromiumを使用
CHROMIUM_PATH=/path/to/chromium pnpm og   # 既存のChromiumを使う場合
```
