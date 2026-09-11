# まだ地図の途中で ―― ✝本質✝特別編

『偏差値60の教室から✝本質✝が漏れ出している件について』の世界線で作った、
**ブラウザだけで動くビジュアルノベル**（フレームワークなし・ビルドなし・依存パッケージなし）。
企画書 `scenareo.txt` の第10〜12章（SCENE001〜007／A〜Fルート／収束G／H-1〜H-8／全14END）を
そのままプレイ可能な形に落したもの。

```
      総シーン 69 ／ 章 11 ／ 本文 15,817字 ／ 選択肢 25
      ルート 6 ／ エンド 14 ／ 端末画面（LINE・掲示板・配信）8 ／ ✝本質✝辞典 33項目
      アセット 201（BG24・立ち絵105・イベントCG52・UI20）＋ 予備 99
      1周 約25分（全ルート必須）／ BGM24曲・SE18種は手続き生成（音声ファイル同梱なし）
```

---

## 1. 遊び方

```bash
cd honshitsu_novel
python3 -m http.server 8000        # 任意の静的サーバーで可（file:// では動きません）
# → http://localhost:8000/
```

| 操作 | 内容 |
|---|---|
| クリック / Enter / Space | テキスト送り |
| Ctrl（長押し）/ K | スキップ　A　オート |
| 1〜9 / ←→ | 選択肢 |
| Backspace | バックログ |
| F1 / F2 | クイックセーブ／ロード（S・L で12スロット） |
| G / T / R / Y | ギャラリー／✝本質✝辞典／ルート図／✝本質✝年鑑 |
| C / I / H / Q / Esc | 設定／所持品／HUD／クイックメニュー／閉じる |

深リンク：`index.html#scene=d2` で特定シーンから起動できる（検証・確認用）。
セーブ・周回データは `localStorage`（12スロット＋オート＋横断メタ：回収CG／エンド／年鑑カウンタ）。

---

## 2. 中の人の流れ

1. **序章** ―― 卒業式の前日からの語り、三年間ダイジェスト。
2. **第一章** ―― 地図保管庫で古写真（稲葉悌二）を見つける。最初の三択。
3. **HUB** ―― 6ルート（砂糖／零／寺地／両馬／南棟／召野＋倉石）を好きな順で。
   読了した順にカードへ ✔ が入り、**6話揃うと収束章が開く**。
4. **収束G** ―― 「思い出の地形図」を作る夜。
5. **クライマックスH-1〜H-8** ―― 謝恩会、勝也の三年分の話。ここで心Pointが分岐深度を決める。
6. **END-0 → 個別END** ―― 14種。条件表は `docs/SCRIPT_SPEC.md` §7。

喜劇8:感情2 の配分、✝本質✝の定義を最後までしない、489の素性を明かさない、
勝也の過去を説明しすぎない ―― 企画書の作法は脚本側で守っている（`@tip` で辞典を引かせて匂わせる）。

---

## 3. 画像について（重要）

`assets/` の 300 枚は**すべて白紙プレースホルダー**で、**名前だけ本編に合わせてある**。
エンジン側の作法：

* 合成は `mix-blend-mode: multiply` ＝ **白いところが透明**。だから白紙でも画面が壊れない
  （背景・立ち絵は `js/visual.js` がその場手続き生成した SVG を下地に描く）。
* 差し替えは同名上書きだけ。`data/assets.json` の該当行の `"placeholder": true` を **`false`** にすると
  補完SVGが消えて、実画像がそのまま出る。
* 素材IDは脚本内で `bg_hokutou_kyoshitsu_asa`（=ファイル名stem）でも `BG01` でも書ける。
* 使わなかった予備 99 枚は `assets/_buffer/` に退避済み（一覧は `docs/ASSET_MANIFEST.md`）。
* リネーム作業自体は `python3 tools/rename_assets.py` で再実行可能（台帳とmanifestも同時に更新）。

---

## 4. 置き場

```
index.html  css/vn.css        … 画面（16:9 ステージ＋レイヤ＋UI）
js/parser.js                  … 脚本DSL → 命令列
js/state.js                   … 心Point・Flag・判定（実行系と検証ツールの共通実装）
js/game.js                    … 再生・選択肢・端末演出・セーブ
js/visual.js                  … 背景/立ち絵/CG/色調/粒子（プレースホルダー補完描画）
js/audio.js                   … BGM12種＋SEの手続き生成（WebAudio）
js/shell.js                   … タイトル・HUD・12スロット・設定・各種アーカイブ
js/main.js                    … 起動・入力の割り当て
data/meta.json                … 話者・ルート・Flag・年鑑カウンタ・アイテム・エンド表
data/terms.json               … ✝本質✝辞典 33項目（出典付き）
data/assets.json              … アセット台帳
data/script/*.txt + index.txt  … 本編（独自DSL／仕様は docs/SCRIPT_SPEC.md）
tools/vncheck.mjs             … 静的検証＋オートプレイ（参照解決・END到達・素材カバレッジ）
tools/smoke.mjs               … jsdom で実起動し、全シーン・全パネル・1周プレイを流す
tools/rename_assets.py        … プレースホルダーの実名リネーム＋台帳生成
docs/SCRIPT_SPEC.md           … DSL・フラグ仕様
docs/ASSET_MANIFEST.md        … 201枠の一覧（用途・元ファイル・差分）
```

---

## 5. 検証

```bash
node tools/vncheck.mjs                      # 終了コードが結果（今は 0）
node tools/vncheck.mjs --verbose            # 未使用アセット・参照条件まで
npm i --no-save jsdom                       # smoke には jsdom が必要（任意）
JSDOM_PATH=$PWD/node_modules/jsdom/lib/api.js node tools/smoke.mjs
```

`vncheck` は **脚本の参照が全部解決するか**（bg/cg/chr/bgm/se/tip/item/cnt/route/chat/jump/end）、
到達不能シーン、`@end` と判定関数の一致、14エンドの振り分け、1周ごとの心Point収支まで見る。
`smoke.mjs` は jsdom 上で実際に起動し、全69シーン・全パネル・エンドカード14種・端末8種・
save/load・キー操作まで流して実行時エラーを拾う（過去に `stage.chr` と `this.chr` の名前衝突で
即落ちするバグをここで検出した）。

---

## 6. 制約・割り切り

* 音声は同梱せず手続き生成（企画書の BGM01〜24 相当を `THEMES` に全曲実装、`@bgm` の参照は24/24を本編で使用中）。
* 画像は白紙。CG の構図・拡大表示（`cg02` と `cg22`）分の作り込みだけエンジン側に入れてある。
* 心Point は非表示が作法なので、HUD には出さない（エンドカードで初めて明かされる）。
* 脚本の行数配分は喜劇8:感情2。感情ピームの直前直後に必ずツッコミを1発置く（企画書 14章のメモ）。
