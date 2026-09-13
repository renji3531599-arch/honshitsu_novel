# Assets — 画像素材总台帳

**背景（`assets/bg/` 25枚）だけが実画像**。CG・立ち絵は**台帳にスロット名だけ**登録してあり、
実ファイルは未配置（2026-09-12 に白紙プレースホルダ256枚を削除） ―― 画面に実際に描いているのは `js/visual.js` の手続き生成SVGです。
**「何を・どこに・どう置けば効くか」を1素材ずつ書いたREADMEが、下の3枚**。
（UI画像は2026-09-12に撤去 ―― ロゴ・枠・アイコンまで含め、UIは全てエンジンのCSS/SVG描画で代替済み。）

- `bg/README.md` ― 背景 25 枚（出番・時間帯トーン・@bg の書き方）
- `cg/README.md` ― CG 32 枚（出番・Ken Burns・差し替え仕様）
- `chr/README.md` ― 立ち絵 78 差分（キャラ別・表情別の本編出現回数）
- `../docs/CG_GUIDE.md` ― **CG 32枚を物語順にまとめた1本**（これだけ読めばCGは足りる）
- `../docs/ART_SPEC.md` ― **入稿仕様書**（推奨寸法・セーフエリア・形式・命名規則。絵を注文するときはこれ）
- `../docs/CHR_REPLACE_LIST.md` ― 立ち絵 78 枚の差し替え一覧（**自動生成**：置くファイル名・`@chr`・表情・使用回数・状態）

## 内訳

| フォルダ | 点数 | 現在の状態 | 実画像にするときの推奨 | エンジン側の補完 |
|---|---:|---|---|---|
| `bg/` | 25 | 実画像 25・未配置 0（白紙削除済み） | 1920×1080（16:9）／cover | 等高線SVG（`backdropSVG`） |
| `cg/` | 32 | 実画像 0・未配置 32（白紙削除済み） | 1920×1080（16:9）／cover・kb で最大1.11倍 | ―（暗色ベタのみ） |
| `chr/` | 78 | 実画像 51・未配置 27（白紙削除済み） | 840×1280（21:32）／透過・下揃え | シルエット（`figureSVG`） |

## 差し替えの作法（4ステップ）

1. **「台帳ID + 拡張子」のファイル名で新規配置**（例 `chr_mie_04_kimazui_chinmoku.png` → `assets/chr/`）
   ― 台帳の `id` と `file` のファイル名部分は全行一致。白紙の元ファイルは削除済み
   ― 拡張子を変える（WebP 化など）ときは台帳の `file` も直す（`--adopt-ext` で自動）
2. `data/assets.json` の `"placeholder": true` → `false`
   ― これだけで補完SVGが消えて実画像に切り替わる（ `#stage[data-art="real"]` ）
   ― **1と2は必ずセット**。ファイルだけ置くと補完のまま、フラグだけ倒すと 404 で壊れる
   ― まとめてやるなら **`node tools/sync_placeholder.mjs`**（実在ファイルを検出して自動で `false` にする）
3. `sw.js` の `CACHE`（現在 `honshitsu-v8`）を上げる ← **忘れると古いキャッシュを返す**（`--bump` で自動）
4. `node tools/sync_placeholder.mjs --check` ＋ `npm test`（vncheck / smoke）で崩れを確認

## 命名規則（2026-09-13 に統一済み）

| | 版A（`index.html`／この台帳） | 版B（`game/index.html`） |
|---|---|---|
| 置き場 | `assets/bg/` `assets/chr/` `assets/cg/` | `game/assets/img/`（1フォルダ） |
| ファイル名 | **台帳ID + 拡張子**（`chr_katsuya_01_tsuujou.png`） | **同じ**（`game/js/assets_manifest.js` も新名に更新済み） |
| 実画像にする条件 | `data/assets.json` の `placeholder: false` | ファイルを置くだけ（フラグ機構なし） |
| 旧名（`chr_katsuya_01_tsujou.png` 等） | **廃止** ― どのコードも参照していません | 同左 |

## 合成（blend）についての注意 ― 2026-09-11 に変更

- 以前は全面レイヤに `mix-blend-mode: multiply`（＝白＝透明）が掛かっていたが、
  `contain: paint` のせいで**実写素材がほぼ真っ黒**に描画される不具合があった（白紙時代は気づかなかった）。
- いまは **既定 `normal`**。立ち絵だけ CONFIG「画像合成」= multiply で選べる
  （ `#stage[data-blend="multiply"] .chr img` ／背景は `#fff` 下地に切り替わる）。
- 立ち絵は**透過PNGが正解**。multiply は白背景JPEGをそのまま置きたいときの逃げ道。
- 実素材を大量に置くなら **WebP** を推奨（1600×900 PNG を素で置くと概算 165MB、WebPなら 30MB 前後。
  実際に収録済みの背景24枚は PNG で計 53MB）。透過が要る立ち絵は **透過WebP**（`lossless` か `quality 90` 前後）。
  拡張子を変えたときは台帳の `file` も直す ― `node tools/sync_placeholder.mjs --adopt-ext` で自動反映されます。
  起動プリロードは「読む5シーンぶんだけ」を先に待つ優先方式なので、枚数が増えても起動は一定。

## 重さの記録

実測して直した一覧（背景SVGの全面 `feTurbulence`、立ち絵の無限アニメ、テキスト窓の `backdrop-filter`、
1ライン平均1.7KBあった同期セーブ等）は `../docs/PERF_2026-09-11.md`。
