# 立ち絵監査 ― PR #22 でCGを撤去した19箇所（2026-09-16）

## 目的

PR #22（CG 26枚 → 7枚）で撤去した19箇所について、**両版の立ち絵の流れを全数精査**した。

CG は表示中に立ち絵を隠す。
- 版A: `css/vn.css:125` の `#stage[stage-mode="cg"] .chr{opacity:0!important}`
- 版B: `game/css/style.css:59` の `#cg-layer-wrap`（`z-index:20`）が
  `#sprite-layer`（`z-index:auto`）より上に描画される（`showCG` は全面 `inset:0` の cover 画像）
そのため「CGで隠れていた区間が、いま何を見せているか」を1箇所ずつ確認し直す必要があった。

## 結論

- 19箇所すべてを両版で確認した。**版Bは全箇所そのまま成立**していた（`hide` / `hideall` が明示されている）。
- **版Aはクライマックス3箇所（h1 / h4 / h6）で前シーンの立ち絵が残る状態**になっていたため修正した。
  収束章 g2 の集合立ち絵（最大7人）が `@chr clear` されずに h1 まで持ち越され、h2・h5 でも落ちていなかった。
  撤去された各CG（h1 L22–27・h4 L83–87・h6 L120–136。h6 は撤去前「シーン全体がCG」）は、
  その持ち越しをCGで覆っていたため、撤去後に露出した。
- 個別ENDの背景：版B の `end_izaki` / `end_minamitou` が **BG17（卒業式会場）** で、
  版A（`bg_sakura_namiki`）と不一致だった。未来の春の場面は象徴的な桜並木で受ける方針に合わせ、
  版B を **BG16（桜並木）** に同期した。
- 併せて、複数削除 `@chr -a,-b` の2人目以降を取りこぼすパーサのバグを修正した（`js/parser.js`）。
- 修正後の監査は **⚠ 0件**。残る ℹ 29件は「END／ハブ画面が覆う終端」「場面分割の継続」「回想の声」で、
  いずれも設計どおり。

## 方法

1. **`tools/tachie_audit.mjs`（新規）** ― 19箇所 × 両版の静的トレース。
   観点は (1) 進入時の持ち越し (2) 場面に居ない立ち絵 (3) 話者の立ち絵なし (4) 版BのL/C/Rスロット押し出し
   (5) シーン終端の置き去り (6) 両版の背景一致。
2. **jsdom 実機プローブ** ― `tools/smoke.mjs` の起動ハーネスを流用し、`game.goto()` で場面へ直行。
   `#stage[stage-mode]` と `.lay-chr .chr.in` の nametag（`slug · 表情 · ラベル`）を1行ごとに実測し、
   静的トレースと一致することを確認した（例：修正前の g4→h1 で `ryoma · 07 / mie · 04` が h1 の全行に残る）。
3. **実走確認** ― `npm run check` / `node tools/check_script.cjs` / `node tools/smoke.mjs`（全69シーン）/
   `node tools/playthrough_test.cjs` / `node tools/save_test.cjs`。

## 19箇所の一覧（修正後）

| # | 撤去CG | 場面 | 版A シーン | 版A 進入時の立ち絵 | 版B シーン | 版B 進入時 | 撤去前にCGが隠していた区間 | 版A 備考 | 版B 備考 |
|---|--------|------|-----------|------------------|-----------|-----------|--------------------------|----------|----------|
| 1 | `cg_mado_ushiro_miteteta` | 砂糖が「見てた」と認める | `a2` | satou=03／mie=07 | `a2` | mie@L／satou@C | L86–100 | 場面分割の継続・ハブ画面が覆う | 場面分割の継続・ハブ画面が覆う |
| 2 | `cg_tsukue_kakomi_daiji` | 零が「大事だと思うから」 | `b2` | rei=05／mie=04 | `b2` | mie@L／rei@C | L166–174 | 場面分割の継続・ハブ画面が覆う | 場面分割の継続・ハブ画面が覆う |
| 3 | `cg_butsudan_narabu_futari` | 両馬、祖父の口癖 | `d2` | ryoma=06 | `d2` | mie@L／ryoma@C | L104–111 | 場面分割の継続・ハブ画面が覆う | 場面分割の継続・ハブ画面が覆う |
| 4 | `cg_yoru_chizu_tsukuri` | 地図を作る夜 | `g1` | （空） | `g1` | （空） | L14–25 | — | — |
| 5 | `cg_yuugata_madobe_katsuya` | 勝也、夕方の教室 | `h1` | （空） | `h1` | （空） | L22–27 | 次シーンへ継続 | — |
| 6 | `cg_fuhou_kageboushi` | 訃報の回想 | `h4` | katsuya=03 | `h4` | （空） | L83–87 | 場面分割の継続・回想の声（設計）・次シーンへ継続 | — |
| 7 | `cg_seito_wo_miwatasu` | 勝也が生徒を見渡す | `h6` | （空） | `h6` | （空） | L120–136 | — | — |
| 8 | `cg_end_mie` | GOOD END 三重 | `end_good_mie` | （空） | `end_mie` | （空） | シーン全体がCG | END画面が覆う | — |
| 9 | `cg_end_satou` | GOOD END 砂糖 | `end_good_satou` | （空） | `end_satou` | （空） | シーン全体がCG | END画面が覆う | — |
| 10 | `cg_end_rei` | GOOD END 零 | `end_good_rei` | （空） | `end_rei` | （空） | シーン全体がCG | END画面が覆う | — |
| 11 | `cg_end_terachi` | GOOD END 寺地 | `end_good_terachi` | （空） | `end_terachi` | （空） | シーン全体がCG | END画面が覆う | — |
| 12 | `cg_end_ryoma` | GOOD END 両馬 | `end_good_ryoma` | （空） | `end_ryoma` | （空） | シーン全体がCG | END画面が覆う | — |
| 13 | `cg_end_izaki_izumi` | GOOD END 伊崎＋伊豆見 | `end_good_izaki` | （空） | `end_izaki` | （空） | シーン全体がCG | END画面が覆う | — |
| 14 | `cg_end_meshino` | GOOD END 召野 | `end_good_meshino` | （空） | `end_meshino` | （空） | シーン全体がCG | END画面が覆う | — |
| 15 | `cg_end_kuraishi` | GOOD END 倉石 | `end_good_kuraishi` | （空） | `end_kuraishi` | （空） | シーン全体がCG | END画面が覆う | — |
| 16 | `cg_end_minamitou` | GOOD END 南棟 | `end_good_minamitou` | （空） | `end_minamitou` | （空） | シーン全体がCG | END画面が覆う | — |
| 17 | `cg_end_normal` | NORMAL END | `end_normal` | （空） | `end_normal` | （空） | シーン全体がCG | END画面が覆う | — |
| 18 | `cg_end_bittersweet` | BITTERSWEET END | `end_bittersweet` | （空） | `end_bitter` | （空） | シーン全体がCG | END画面が覆う | — |
| 19 | `cg_end_comedy` | COMEDY END | `end_comedy` | （空） | `end_comedy` | （空） | シーン全体がCG | END画面が覆う | — |

※「進入時の立ち絵」は、その場面の1行目を表示する時点で舞台上に居る立ち絵。
※備考の「場面分割の継続」＝ a1_yes→a2 のように同一場面を分割した続きで、持ち越しが意図どおり。
※備考の「END画面が覆う」「ハブ画面が覆う」＝ 立ち絵は残るが、全面パネルが上に載るため実害なし。

## 発見と修正（版A）

### 1. クライマックスで前シーンの立ち絵が残る（h1 / h4 / h6）

- **症状**：h1 の進入時に7人（伊豆見・砂糖・召野・三重・倉石・伊崎・両馬）、h1 終端で8人。
  台本上 h1 の cast は 勝也・伊崎・両馬 の3人。同様の持ち越しが h2/h3/h4/h5/h6 まで続いていた。
- **原因**：版Aの `@chr a=01,b=02` は「追加・更新」（`js/visual.js` の `setChr` は `chrMap.set` のみ）で、
  収束章 g2 の集合立ち絵がクリアされないまま g3・g4・h1 へ引き継がれていた。
- **対応**（版Bの `hide` / `hideall` と同じ位置に合わせた）：
  - `data/script/50_converge.txt` g2_eb 末尾：`@chr clear`（制作シーンの集合立ち絵をここで落とす）
  - `data/script/50_converge.txt` g4 末尾：`@chr clear`（版B h1 と同じく、h1 の進入を空にする）
  - `data/script/60_climax.txt` h1：両馬の台詞のあと `@chr -izaki,-ryoma`（伊崎・両馬はここで退場）
  - `data/script/60_climax.txt` h2：`@chr -mie`（三重は h2 まで。勝也は回想 h3〜h4 も舞台で受け持つ）
  - `data/script/60_climax.txt` h5 末尾：`@chr clear`（砂糖を落として h6 の3人だけにする）
  - `data/script/60_climax.txt` h6 末尾：`@chr clear`（h7 は寺地の朗読）
  - `data/script/60_climax.txt` h7 末尾：`@chr clear`（h8 は勝也ひとりの画）
- **パーサ修正**：`@chr -izaki,-ryoma` が `del: ['izaki','-ryoma']` になり2人目が消えなかった
  （`js/parser.js:156`。各項目の先頭 `-` を個別に落とすよう修正）。

### 2. 版B 個別ENDの背景（2箇所）

- `game/js/script_04_endings.js` の `end_izaki`（164行目）と `end_minamitou`（209行目）を
  `["bg", "BG17"]`（卒業式会場）→ `["bg", "BG16"]`（`bg_sakura_namiki`）に変更し、版Aと同期。
- 他の10箇所のEND背景は両版一致を確認済み（`tools/tachie_audit.mjs` の背景突き合わせで「全エンドで一致」）。

## 変更ファイル

| ファイル | 変更 |
|----------|------|
| `data/script/50_converge.txt` | `@chr clear` ×2（g2_eb 末尾・g4 末尾） |
| `data/script/60_climax.txt` | `@chr -izaki,-ryoma`（h1）／`@chr -mie`（h2）／`@chr clear` ×3（h5・h6・h7 の末尾） |
| `js/parser.js` | `@chr -a,-b` の複数削除パースを修正 |
| `game/js/script_04_endings.js` | `end_izaki` / `end_minamitou` の背景を BG16 へ |
| `tools/tachie_audit.mjs` | 監査ツール（新規・本監査の実行手段） |
| `docs/TACHIE_AUDIT_2026-09-16.md` | 本文書 |

## 検証

| コマンド | 結果 |
|----------|------|
| `node tools/tachie_audit.mjs` | ⚠ 0件 / ℹ 29件（＝すべて説明可能） |
| `npm run check`（vncheck + cg_check） | ✓ 脚本整合・CG7枚の台帳一致・END背景あり |
| `node tools/check_script.cjs` | ✔ エラー0件（命令1205 / 台詞・地の文 15491字 / say 357回 / 選択肢33件） |
| `node tools/smoke.mjs` | ✓ 起動・全パネル・1周プレイ・**全シーン実行 69/69**・save/load |
| `node tools/playthrough_test.cjs` | ✔ 全プレイスルーテスト合格 |
| `node tools/save_test.cjs` | ✔ セーブ/ロードテスト合格（END 14/14） |

## 再現方法

```bash
node tools/tachie_audit.mjs          # 19箇所 × 両版
node tools/tachie_audit.mjs --a      # 版Aのみ
node tools/tachie_audit.mjs --b      # 版Bのみ
node tools/tachie_audit.mjs --json   # JSON出力
```

## 実機プローブ（修正後の実測）

jsdom 上で `game.goto("g4")` から h2 まで進め、1行ごとの舞台上の立ち絵を記録した結果（抜粋）。
`ryoma · 07 / mie · 04` は g4 の cast、h1 へは持ち越さず、h1 では台本どおり3人だけが順に登場する。

```
g4:6  両馬 ……明日で、終わるな。          → ryoma · 07 / mie · 04
g4:8  けれど、この時点では誰も…            → ryoma · 07 / mie · 04
g4:11 @card クライマックス               → （立ち絵なし）      ← g4末尾の @chr clear
h1:5  謝恩会の準備を終えた校庭は…          → （立ち絵なし）      ← h1進入が空
h1:17 黒板「思い出の地形図」…             → （立ち絵なし）
h1:19 勝也 ……これは。                   → katsuya · 04 · 驚き
h1:21 伊崎 謝恩会の準備、っていうのは…      → katsuya · 04 / izaki · 02
h1:23 両馬 先生に、渡したいものがあって。    → katsuya · 04 / izaki · 02 / ryoma · 07
h1:25 勝也が一歩、また一歩と…             → katsuya · 04      ← @chr -izaki,-ryoma
h1:29 勝也 覚えてるが……                 → katsuya · 02 · 微笑
h2:2  三重 先生。聞いていいですか。         → katsuya · 02 / mie · 07
h2:14 そして、彼はゆっくりと語り始めた。      → katsuya · 03      ← @chr -mie
h3:5  （回想CG）勝也 俺も、この学校の…      → katsuya · 03      ← CGの下。h4で表情が続く
```

## 補足：残る ℹ の内訳

- **END画面が覆う（12）／ハブ画面が覆う（3）** ― 個別ENDとルート終端は、立ち絵を落とさなくても
  全面パネル（版A `#overlay` : z40・`rgba(5,4,4,.9)` + blur / ハブ）が上に載るため見えない。版Bは `hideall` 済み。
- **場面分割の継続（7）** ― a1_yes→a2、b1_hiku→b2、d1→d2 など、同一場面の分割。意図どおり。
- **回想の声（2）** ― 稲葉・若き勝也は `data/meta.json` の `voice:true` 登録どおり。版Bも `["voice", …]` で
  立ち絵を出さない設計で、両版一致。
