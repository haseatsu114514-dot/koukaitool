<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# ステラファイル固有ルール

## コピーを触る前に読むもの

診断文・恋愛診断・キャラ説明・ギフト説明・LINE誘導などの文章を編集する場合は、最初に以下を読む。

1. `docs/READING_STYLE_CONTEXT.md`
2. `README.md` の「恋愛運診断ページ」
3. 対象データファイル
   - `src/data/types.ts`
   - `src/data/type-details.ts`
   - `src/data/love-copy.ts`

鑑定スタイルの正本は `kantei/docs/READING_STYLE_CONTEXT.md`。
このリポジトリの同名ファイルは、単体作業時のための同期コピー。

## 文章を勝手に一般化しない

- キャラ名の少し変わった言い回しを残す
- ギフト名とモチーフを勝手に変更しない
- 弱気な断り書きを追加しない
- 「だからこそ」「実は」「AではなくB」を連発しない
- 括弧・カギ括弧を増やしすぎない
- 文章を均一なAI文へ整えすぎない
- 「四柱推命」「通変星」などを恋愛診断の表側へ勝手に追加しない
- 相手の性別を決めつけない
- `Phrases` / `KEEP_WHOLE` の改行思想を維持する

## 仕様とコピーの衝突

ブランド／鑑定方針と実装が食い違う場合、勝手に過去コピーへ戻さない。
最新のユーザー指示と `docs/READING_STYLE_CONTEXT.md` を確認し、必要なら関連テスト・データも一緒に更新する。
