# Age2Birth（エイジ・トゥ・バース）

年齢と誕生日（月日）だけで、生年月日を逆算する公開向けシンプルツールです。  
占い好きユーザーや占い師が、相談相手の基本情報から素早く確認する用途を想定しています。

## コンセプト
- 誰でもURLを知っていれば使える（ログイン不要）
- 入力は `年齢` と `誕生日（月日）` のみ
- 余計な機能を省いた軽量UI

## ツール名（採用）
- `Age2Birth`
- サブタイトル: `年齢×誕生日 逆算ツール`

## 機能
- 生年月日の逆算
- うるう日（2/29）対策
  - 平年時の扱いを `2/28` / `3/1` で選択可能
- 結果コピー
- ページ開きっぱなしで日付が変わっても、基準日を自動更新

## マーケティング導線の使い方
このツールには「本鑑定・ご相談はこちら」ボタンを入れています。  
`/Users/hasegawaatsuki/Documents/New project/koukaitool/index.html` の以下をあなたのサイトURLに変更してください。

```html
const MARKETING_SITE_URL =
  "https://example.com/?utm_source=age2birth&utm_medium=referral&utm_campaign=public_tool";
```

おすすめ:
- `utm_source=age2birth`
- `utm_medium=referral`
- `utm_campaign=public_tool`

これで、ツール経由の流入を計測しやすくなります。

## 公開方法（GitHub Pages）
1. GitHubで `Settings` → `Pages`
2. `Source` を `Deploy from a branch`
3. `Branch` を `main` / `/ (root)` に設定
4. 公開URLへアクセスして動作確認
