# ステラファイル

生年月日から日干の10タイプと、日支の蔵干・本気による通変星の強みを知る、日本語の簡略診断Webアプリです。旧「生年月日 逆算くん」を置き換えています。以前の内容はGit履歴に残ります。

## セットアップ

Node.js 22以上、pnpm 11.19.0を使用します。

```sh
corepack enable
corepack prepare pnpm@11.19.0 --activate
pnpm install --frozen-lockfile
pnpm dev
```

開発画面: http://localhost:3000 。環境変数は `.env.example` を参照。DB・APIキー・外部フォントは不要です。

```sh
pnpm test            # 暦・バリデーション・通変星・コンテンツの検証
pnpm typecheck       # 型チェック（初回は pnpm build も実行）
pnpm build           # 静的配信可能な out/ を作成
pnpm exec playwright install chromium
pnpm test:e2e        # スマホ / PC の操作テスト
```

## 設計と画面

Next.js App Router / React / TypeScript / Zod。CSSの共通トークンとセマンティックHTMLによる独自UIを採用しています。現状の機能規模に合わせ、Tailwindやshadcn/uiへの依存は追加していません。

| URL | 役割 |
| --- | --- |
| `/` | サービス説明、タイプのプレビュー、診断導線 |
| `/diagnose/` | 年月日入力、実在日・未来日チェック |
| `/result/` | 診断結果。直接訪問・保存失敗時は再診断を案内 |
| `/types/` | 10タイプ図鑑 |
| `/types/[slug]/` | 生年月日を含まない共有可能なタイプ紹介 |
| `/about/` | 採用ルール、簡略診断の範囲、詳細診断の今後 |
| `/privacy/` | 入力・端末内一時保存・共有の説明 |

```text
src/
  app/                  各ページ、レイアウト、共通CSS
  components/
    birth-form.tsx      入力と検証
    profile.tsx         結果と公開タイプ詳細に共通の表示
    share-actions.tsx   共有文、Web Share、PNG書き出し
    character.tsx      アセット表示アダプター
    type-card.tsx      図鑑カード
    result-view.tsx    一時保存からの結果復元
  data/
    types.ts            10タイプの全初期文章、画像プロンプト
    art-direction.ts    共通絵柄、asset schema、生成provider interface
  lib/
    diagnosis/
      calendar.ts       入力スキーマ、日干支の整数日計算
      ten-gods.ts       本気表、陰陽五行による通変星、補足文章
      index.ts          diagnose() と計算ルールの版
    result-store.ts     生年月日を含まないタブ内一時保存
    paths.ts            GitHub Pagesのサブパス対応
public/characters/      10体のオリジナル仮SVG
tests/                  計算・データ・ブラウザ操作テスト
docs/                   計算ルールとブランド/拡張仕様
.github/workflows/      検証とGitHub Pages公開
```

## データ構造

`CharacterType` は `stem, slug, displayName, shortCatch, summary, strengths, romance, workStyle, relationshipStyle, keywords, color, motif, props, backgroundMotifs, imagePrompt` を持ちます。名称・文章を変えるときは `src/data/types.ts` を編集。slugは共有URLになるため、公開後の変更にはリダイレクト設計が必要です。

`DiagnosisResult` は `pillar, hiddenStem, tenGod, ruleVersion, scope, providerId` を持ち、UIやキャラクター名に依存しません。将来のDB化ではタイプデータの取得先を差し替えられます。

## 計算の範囲

**現在の補足は日支だけを使います。** 年柱・月柱・時柱を含む完全な命式ではありません。

- 西暦の生年月日を、0:00で切り替わる暦日として扱う。
- 2000-01-07の甲子からの整数日差を60で剰余し、10干・12支を取り出す。
- 日干がタイプを決める。日支の蔵干の本気を日干と比較し、通変星を算出。
- 年・月の節入り近似、23時換日、出生地補正、中気・余気、身強身弱・大運は計算しない。
- 詳細は [計算仕様](docs/calculation.md)。今後の仕様変更では `RULE_VERSION` を更新する。

## プライバシーと共有

生年月日はブラウザ内でのみ使用し、サーバー、URL、localStorage、sessionStorageへ保存しません。sessionStorageには日干支・サイクル番号とルールの版だけを保存。タブ内の再読み込みに対応し、不正・旧形式データは無視します。保存領域が使用不可でも同一クライアント遷移中はメモリから結果を表示できます。共有は一般的なタイプ紹介URLと、誕生日や通変星を含まない画像・文章を使用します。

PNG保存はCanvasによる1080×1350。Threads専用APIは使わず、共有文コピーと端末の共有メニューに対応します。Web Share / Clipboardが使用できない場合もメッセージで案内します。

## イラスト

10体の仮SVGは独自に作成。参考画像の丸い線・少ない色数という方向性を参考にし、素材自体は転用していません。生成APIは未接続。`generationRequest(type)` で、共通絵柄＋固有プロンプト＋negative prompt＋サイズを取得できます。

`CharacterAsset` に状態（placeholder / generated / approved）、サイズ、alt、絵柄版、生成元を持たせています。将来はサーバー側で `ImageGenerationProvider` を実装し、レビュー済み画像だけを公開します。詳細は [アセット設計](docs/art-direction.md)。

## GitHub Pages

Next.jsの静的エクスポートを使用。GitHubの **Settings → Pages → Source を GitHub Actions** に設定すると、mainへのpushから `.github/workflows/pages.yml` が検証・ビルド・公開します。GitHub側の設定変更が必要な環境では、コードのpushだけでは既存Pagesの配信元は切り替わりません。

プロジェクトPages用ビルドは `NEXT_PUBLIC_BASE_PATH=/koukaitool`。ルートドメイン（Vercelなど）では未設定でビルドしてください。`next start` は使いません。静的公開物は `out/` のみ。会員DBや画像生成APIを追加するときは、サーバー対応ホストへの移行または独立APIが必要です。

## 今後の拡張

1. 中気・余気の採用表、重み、流派、節入りの扱いを別ルールとして追加。
2. 日本時間の節入りを検証できる暦アダプターを選定し、年柱・月柱を追加。時刻不明時の境界日には曖昧さを明示する。
3. 承認済みのキャラクター画像、タイプ別OG画像、共通SNSカードテンプレートを追加。
4. 同意を含む会員登録・保存/削除APIを設計し、端末内保存と切り分ける。
5. iOS Safari実機、スクリーンリーダー、専門家による暦・文面監修を行う。

課金・詳細鑑定申込・外部画像生成・会員登録は未実装。CTAは実装済みの診断ガイドへ遷移し、提供していない機能を申し込ませません。
