# Assets — 画像素材总台帳

このフォルダの**すべてが白紙プレースホルダ**（ `assets/bg/title_key.jpg` だけが実画像）で、
画面に実際に描いているのは `js/visual.js` の手続き生成SVGです。
**「何を・どこに・どう置けば効くか」を1素材ずつ書いたREADMEが、下の4枚**。

- `bg/README.md` ― 背景 25 枚（出番・時間帯トーン・@bg の書き方）
- `cg/README.md` ― CG 52 枚（出番・Ken Burns・予備枠の理由）
- `chr/README.md` ― 立ち絵 105 差分（キャラ別・表情別の本編出現回数）
- `ui/README.md` ― UI 20 点（アイテム対応・参照箇所）
- `_buffer/README.md` ― 未割当の空き枠 99 枚
- `../docs/CG_GUIDE.md` ― **CG 52枚を物語順にまとめた1本**（これだけ読めばCGは足りる）

## 内訳

| フォルダ | 点数 | 現在の状態 | 実画像にするときの推奨 | エンジン側の補完 |
|---|---:|---|---|---|
| `bg/` | 25 | 白紙 24・実画像 1 | 1600×900／cover | 等高線SVG（`backdropSVG`） |
| `cg/` | 52 | 白紙 52・実画像 0 | 1600×900／cover | ―（白紙なら下地のみ） |
| `chr/` | 105 | 白紙 105・実画像 0 | 840×1280／透過PNG | シルエット（`figureSVG`） |
| `ui/` | 20 | 白紙 20・実画像 0 | 用途ごとに上記 | CSSだけで代替 |
| `_buffer/` | 99 | 未割当スロット | 400×300 白紙 | ― |

## 差し替えの作法（4ステップ）

1. **同名で上書き**（フォルダと拡張子を変えるときは台帳の `file` も直す）
2. `data/assets.json` の `"placeholder": true` → `false`
   ― これだけで補完SVGが消えて実画像に切り替わる（ `#stage[data-art="real"]` ）
3. `sw.js` の `CACHE`（現在 `honshitsu-v2`）を上げる ← **忘れると白紙が返る**
4. `node tools/vncheck.mjs` と `node tools/smoke.mjs` で崩れを確認

## 合成（blend）についての注意 ― 2026-09-11 に変更

- 以前は全面レイヤに `mix-blend-mode: multiply`（＝白＝透明）が掛かっていたが、
  `contain: paint` のせいで**実写素材がほぼ真っ黒**に描画される不具合があった（白紙時代は気づかなかった）。
- いまは **既定 `normal`**。立ち絵だけ CONFIG「画像合成」= multiply で選べる
  （ `#stage[data-blend="multiply"] .chr img` ／背景は `#fff` 下地に切り替わる）。
- 立ち絵は**透過PNGが正解**。multiply は白背景JPEGをそのまま置きたいときの逃げ道。
- 実素材を大量に置くなら **WebP** を推奨（1600×900 PNG を素で置くと概算 165MB、WebPなら 30MB 前後）。
  起動プリロードは「読む5シーンぶんだけ」を先に待つ優先方式なので、枚数が増えても起動は一定。

## 重さの記録

実測して直した一覧（背景SVGの全面 `feTurbulence`、立ち絵の無限アニメ、テキスト窓の `backdrop-filter`、
1ライン平均1.7KBあった同期セーブ等）は `../docs/PERF_2026-09-11.md`。
