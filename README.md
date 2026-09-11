# まだ地図の途中で ―― ✝本質✝特別編（ノベルゲーム実装リポジトリ）

『偏差値60の教室から✝本質✝が漏れ出している件について』の世界線で作った、**ブラウザだけで動くビジュアルノベル**です。
原典は `scenareo.txt`（シナリオ企画書）＋ 原作小説テキスト。

このリポジトリには、同じ企画書を精読して作られた **2つの完全実装が並行して収録**されています
（別々のセッションで同時進行した成果物。どちらも単体で全編プレイ可能です）。

| | 版A（ルート直下） | 版B（`game/` 以下） |
|---|---|---|
| 入口 | `index.html`（リポジトリ直下） | `game/index.html` |
| アセット置き場 | `assets/`（bg/chr/cg/ui + `_buffer/`） | `game/assets/img/` |
| 脚本形式 | 独自DSL（`data/script/*.txt`） | JSデータ（`game/js/script_*.js`） |
| BGM | 手続き生成 24曲＋SE18種 | 手続き生成 24曲＋SE16種 |
| 検証ツール | `tools/vncheck.mjs` ＋ `tools/smoke.mjs` | `tools/check_script.js` ＋ `tools/playthrough_test.js` ＋ `tools/save_test.js` |
| 固有ドキュメント | `docs/SCRIPT_SPEC.md` ／ `docs/ASSET_MANIFEST.md` | `ASSET_MAP.md` |

**共通事項**: `image1/2/3` の仮画像300枚（`white_XXX.png`）は、両実装それぞれが企画書§8の
アセット一覧に従って別名へリネーム済みです（版Aは `assets/`、版Bは `game/assets/img/`、対応表は `ASSET_MAP.md`）。
白紙プレースホルダーのままでも両版とも等高線背景・色調ティント等で舞台として機能し、
**同名の実素材に上書きすればそのまま差し替わります**。

---

# 版A: ルート直下ビルド（PR #1 で main に統合済み）

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
| G / T / R / Y | ギャラリー／✝本質✝辞典／エンドリスト／✝本質✝年鑑 |
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

* 白紙プレースホルダのあいだは `js/visual.js` がその場手続き生成したSVG（等高線背景／シルエット立ち絵）を
  描き、**実画像に差し替えた行だけSVG側を空にして** `<img>` へ渡す（二重描きなし）。
  どの経路で描いているかは `#stage[data-art="real"|"placeholder"]` で判る。
* 合成（multiply＝**白いところが透明**）は既定 **OFF**。`#stage[data-blend="multiply"]` を付けたときだけ
  立ち絵に掛かる。背景・CGは常に `normal`（全面レイヤに multiply を掛けると、実写素材が
  親の黒 `#0c0a08` と掛け算されて**ほぼ黒く潰れて見えた**ため。2026-09-11 に修正）。
  白背景JPEGをそのまま置きたいときは CONFIG の「画像合成」を multiply にすれば救済される。
* 差し替えは同名上書き＋台帳の `"placeholder": false` だけ。それで補完SVGが消えて実画像が出る。
  透明PNGが正解だが、白背景素材でも合成モードで追従する。
* 起動は**優先プリロード方式**：`false` の行でも「これから読む数シーンぶん（既定5シーン分）」だけを
  `TOUCH TO START` 前に読み、残りはタイトル表示後に手が空いたときへ回す（`AssetDB.warmRest`）。
  200枚を差し替えても起動時間は一定。例外として `assets/bg/title_key.jpg`
  （タイトルキービジュアル、夕方の教室）は最初から実画像で収録済み。
* 本編中の背景切替は**2枚スラブのクロスディゾルブ**（既定1.15秒、CONFIGで 1.85秒／即時）。
  CG差し替えは「完全に下げてから上げる」ので、半透明のまま絵が入れ替わって見えない。
* 作ったのに本編で出していないCGは `"reserve": true` を付けるとギャラリーと回収枚数から外れる
  （2026-09-11 に11枚を降板。経緯と基準は `docs/PERF_2026-09-11.md` §CG）。
* 素材IDは脚本内で `bg_hokutou_kyoshitsu_asa`（=ファイル名stem）でも `BG01` でも書ける。
* 差し替え後は **`sw.js` の `CACHE`（現在 `honshitsu-v2`）を必ず上げる**。CacheFirst で画像を返すため、
  上げると旧キャッシュ（白紙PNG）を配信し続けて「差し替わってないように見える」ことがある。
  ※ 脚本 `data/script/*.txt` は NetworkFirst に変えた（直したのに反映されない問題の防止）。
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

## 4-b. 重さ・滑らかさ（2026-09-11 の実測で入れた手当て）

`tools/perf_probe.mjs`（jsdomで162ライン分を実プレイしてJS・保存量だけを測る）で特定した発熱源と、
その対策の一覧は **`docs/PERF_2026-09-11.md`**。要約すると：

| 効いた順 | 内容 |
|---|---|
| 1 | 背景SVGの全面 `feTurbulence` ＋ SVG内 `infinite` アニメ → **128pxタイルの `<pattern>`** とCSS側アニメへ置換 |
| 2 | 立ち絵1人に最大4本の `infinite`（うち1本はblur再ラスタ） → **呼吸はtranslateのみ・talkは単発・リム3.2秒** |
| 3 | `#textbox` の `backdrop-filter: blur(6px)` → 既定OFF（CONFIGで戻せる） |
| 4 | 1ライン平均 **1.7KBの localStorage 同期書き込み** → 自動セーブ9秒＋340msデバウンスで **平均0.08KB/ライン** |
| 5 | 話者切りのたびに立ち絵SVGを `innerHTML` へ書き戻す（＝一瞬消える） → **表情が変わるときだけ書換**、話者はclassとz-indexだけ |

CONFIGに4つつまみ增设：背景の切り替え／立ち絵の動き／画像合成／テキスト窓をぼかす。

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


---

# 版B: `game/` 以下のビルド（本PR #2）

`scenareo.txt`（企画書§1〜§16）と原作小説を精読し、**企画書の構成をそのまま**実装した版です。

- **本編**: プロローグ → 第一章「差出人不明の写真」→ **HUB自由順6ルート**（A砂糖／B零／C寺地／D両馬／E南棟／F召野＋倉石）→ 収束章「地図を作る夜」→ クライマックス「窓の外に、ずっといた人」→ **エンディング14種**
- **パラメータ**: 企画書§7どおり **心Point＋主要Flag8種**（選択肢33件。倉石茶化し選択3箇所 → COMEDY SECRET END 条件も再現）
  - TRUE（心24以上＋Flag6種以上）／GOOD9種（心18以上＋突出Flag）／NORMAL／BITTERSWEET（心11以下）／COMEDY SECRET／全回収後にタイトルへ出現する BONUS EXTRA
- **エンジン**: セーブ12スロット＋クイック＋オートセーブ／黒字リプレイ方式ロード／バックログ／既読スキップ（Ctrl）／オートモード／ギャラリー52枚／**✝本質✝辞典**（用語自動収集）／ENDリスト／設定
- **演出**: 章タイトルカード、CG表示、掲示板・配信UIオーバーレイ、回想の褪色トーン、**「窓の外、五秒」演出**（クライマックスでは15秒に延伸）
- **音**: 音源ファイル不使用。WebAudioリアルタイム合成で企画書§9の **BGM24曲＋SE16種** を内蔵
- 原作のトーンを踏襲: 「は？」、フェイカツ投稿、**489の正体は最後まで明かさない**（§13 トーンガイド準拠）

## 遊び方（版B）

```bash
cd honshitsu_novel/game
python3 -m http.server 8000     # game/ ディレクトリで起動するのがポイント
# → http://localhost:8000/
```

| 操作 | 内容 |
|---|---|
| クリック / Enter / Space | テキスト送り・決定 |
| Ctrl（押しっなし可） | 既読スキップ |
| A / B | オートモード / バックログ |
| Esc | ウィンドウを閉じる |
| CONFIG | 文字速度・音量・内部パラメータ（心Point/Flag）表示 |

## ファイル構成（版B）

```
game/
├── index.html            エントリポイント
├── css/style.css         UI一式
├── js/
│   ├── engine.js         エンジン本体（スクリプト実行・セーブ・UI）
│   ├── audio.js          WebAudio合成 BGM24曲＋SE
│   ├── characters.js     キャラ定義＋✝本質✝辞典データ
│   ├── assets_manifest.js 自動生成（tools/map_assets.py）
│   └── script_0*_*.js    本編スクリプト（企画書§10〜§11を全台詞実装）
└── assets/img/           リネーム済み画像300枚（201使用＋99予備）
tools/
├── map_assets.py         仮画像→アセット名リネーム（冪等・単一の情報源）
├── check_script.js       整合性チェック（参照・遷移・Flagの静的検証）
├── playthrough_test.js   jsdomで実プレイ（TRUE/BITTERSWEET/COMEDY SECRET到達を自動検証）
└── save_test.js          セーブ/ロード復元・オートセーブ・BONUS解放の自動検証
ASSET_MAP.md              仮画像300枚 ↔ アセット名の対応表（版B）
```

## 検証（版B）

```bash
node tools/check_script.js        # シナリオデータの静的検証（0エラー必須）
node tools/playthrough_test.js    # 実プレイテスト3ルート（要: npm i jsdom）
node tools/save_test.js           # セーブ/ロード/BONUSテスト（要: jsdom）
python3 tools/map_assets.py       # アセット割り当ての再生成（冪等）
```

実素材の差し替えは `ASSET_MAP.md` の対応表を見ながら `game/assets/img/` に**同名のファイル**を上書きするだけです。

---

**卒業しても、✝本質✝は終わらない。地面は、忘れない。** ――それだけで、十分だ。
