# 脚本仕様 ―― `data/script/*.txt`（本編DSL）

本作は汎用エンジンを持たない。**`js/parser.js` が読む独自DSL**で脚本を書き、
起動時に全ファイルを連結して 1 本の台本として解釈する。
企画書 `scnareo.txt`（第10章〜第12章）の SCENE 番号・フラグ表・アセット表をそのまま写せる形にしてある。

---

## 0. 読み込み順

`data/script/index.txt` の1行1ファイルが読み込み順。並んだ順が **そのままシーンの連続再生順**になる
（`@jump` を書かなかったシーンは、次のシーンへ自然に流れる）。

```
00_prologue.txt      序章（SCENE001〜002）＋ 第一章入口
10_chapter1.txt      第一章 共通（SCENE004〜006）＋ HUB 入口
20_route_satou_rei   Aルート（砂糖）／Bルート（零）
30_route_terachi_…   Cルート（寺地）／Dルート（両馬）
40_route_minamitou…  Eルート（南棟）／Fルート（召野＋倉石）
50_converge.txt      収束章 G-1〜G-4
60_climax.txt        クライマックス H-1〜H-9
70_endings.txt       END-0 ＋ 個別END ①〜⑭
90_chats.txt         端末画面（LINE／掲示板／配信）のブロック定義
```

`tools/vncheck.mjs` がこの順で parse するので、**ファイル間のシーン跨ぎも静的に検証される**。

---

## 1. 三種類の行

| 種別 | 開始文字 | 例 |
|---|---|---|
| 定義 | `#` | `#scene c004_hokanko \| 地図保管庫` |
| 指令 | `@` | `@bg bg_chizu_hokanko` |
| 本文 | その他 | `三重：は？　俺すか。` |

`; ` または `//` で始まる行はコメント。`? ` で始まる行は選択肢のプロンプト（直後の `- ` 行が選択肢）。

---

## 2. 定義行

```
#chapter <id> | <題> | <副題（英語可）>     … 章カード・HUDに使われる
#scene   <id> | <ラベル>                    … シーンの区切り。id は ASCII（ジャンプ先）
#chat    <id> | <タイトル> | <kind>         … 端末画面。kind = line|bbs|juken|live
#endchat                                    … 端末ブロックを閉じる（ファイル末では省略可）
```

* `#scene` の **id は他ファイルから `@jump` で呼ばれる**ため ASCII のみ。ラベル（表示名）は日本語可。
* `#chapter` は宣言以降のシーンに自動的に紐づく（HUD・章カード・ルート図の表示に使用）。

### 端末ブロック内の行

```
MSG  両馬二郎 | おい見たか今日の書き込み
ME   三重 | 見てない
SYS  23:41
POST 12 | 名無し | 地理の教師が泣いたらしいで self
CMT  視聴者A | 桜見える
NOTE 倉石が数えている
```

区切りは **半角 `|`**（全角 `｜` は分割されない。本文に全角パイプを書きたい場合は `｜` ではなく `丨` 等を使うか、`POST` 行の末尾に `self` を置く）。

---

## 3. 本文行

```
話者：台詞
ナ：地の文
話者：台詞（心の中で）        … 名前plateが斜体になり、傍線が出る
```

話者は `data/meta.json` の `speakers` に登録された名前のみ（`tools/vncheck.mjs` は strict モードなので
未登録の話者は**エラー**になる。実行時は地の文にフォールバックして警告だけ）。`ナ`（地の文）は常時可用。

* 文中の `✝本質✝` は `<i class="hs">` で包まれ、金色＋発光で描画される（14字以内の閉じた範囲のみ）。
* `漢字《かんじ》` でルビ、`*強調*` で `<em>`（金色）、`\n` で文中改行が使える。
* `は？` `面白い` `うるさい` は自動で年鑑カウンタに積まる（脚本で `@cnt` を書かなくても数えられる）。
* 話者 **`黒板`** は専用演出：その行だけ本文がチョーク風（`#text.board`）に切り替わる。
  黒板に書かれた文字をそのまま出したいときに使う（例：`黒板：地面は、忘れない。`）。

---

## 4. 指令一覧

### 演出

| 指令 | 意味 |
|---|---|
| `@bg <bg stem or id>` | 背景差し替え（`bg_hokutou_kyoshitsu_asa` のようにファイル名stemで書ける） |
| `@cg <cgNN> [kb]` / `@cg off` | イベントCG。`kb` でキービジュアル風に文字を下へ寄せる |
| `@chr a=03,b=05` / `@chr -a` / `@chr clear` | 立ち絵スロット。数字は差分番号（`chr_<slug>_03_*` に対応） |
| `@bgm <bgmNN> [fade=2.4]` / `@bgm off` | BGM（手続き生成のWebAudio） |
| `@se <seNN>` | 効果音（同上） |
| `@fx shake\|flash\|fadeblack\|blur` | 画面演出 |
| `@tone sharp\|warm\|flashback\|dream` | 色調（`@tone` 単独で解除） |
| `@light warm\|cold\|dim` / `@veil black` / `@bars [on]` | 照明／ヴェール／レターボックス |
| `@part dust\|sakura\|ash\|off` | 空中パーティクル（埃／桜吹雪／灰。canvas 描画） |
| `@lay <cls>` | ステージに `lay-<cls>` クラスを付ける（構図の微調整） |
| `@memo <text> [hand] [hold=3200]` | 画面中央に小道具のメモ（写真の裏書きなど。`hand` で手書き風） |
| `@card <no> \| <題> \| <副題>` | 章カード（全画面） |
| `@wait <ms>` | 間 |

### 進行・分岐

| 指令 | 意味 |
|---|---|
| `@jump <scene>` | 指定シーンへ |
| `@if <条件> -> <scene>` | 条件が真ならジャンプ（偽なら素通り） |
| `@branch` / `@when <条件>` / `@else` / `@endif` | 同一シーン内の条件ブロック（閉じ忘れは parse error） |
| `@hub` | ルート選択HUB（未読ルートをカードで並べる） |
| `@route <key>` | ルート読了を記録（HUB・ルート図・収束ゲート用） |
| `@save` | 自動セーブの打点 |
| `@end <id> \| <題>` | エンドカードを掲げて1周終了（`id` は `meta.json/endings` のキー） |
| `@title` / `@stop` | タイトルへ戻る／流れを止める |

### 変数・収集

| 指令 | 意味 |
|---|---|
| `@set <key> + N` / `- N` / `= N` | `flag_*` `heart` `tease` などの加算。**`= N` は上書きなのでルート内では使わない** |
| `@heart + 2` / `@heart - 1` | 心Point（-10〜34でクランプ、HUDには出さない＝企画書 7.1 の作法） |
| `@item <id>` | 所持品（パネルにトースト付きで表示） |
| `@tip <term id>` | ✝本質✝辞典の項目を解禁（`data/terms.json` のキー） |
| `@cnt <counter key>` | ✝本質✝年鑑のカウンタ加算（`meta.json/counters`） |
| `@chat <id>` | 端末ブロックを再生 |

---

## 5. 選択肢

```
? ―― プロンプト（「？」で始める。ここは喜劇のツッコミ待ちの余白に使う）
- 表示ラベル | go=<scene> | sub=補足 | flag_mie+1 | heart+2 | tease+1 | item=ko_shashin | tip=honshitsu | cnt=mie_ha | pick=mie_tell | if=runs>=1
```

* `go=` は必須。`sub=` は選択肢の小さな追記（心内語・予感）。
* 効き目は `|` 区切りの `key±N` / `key=N` / `item=` / `tip=` / `cnt=`。未知のキーは黙って `sub` に吸われるので注意（vncheck が弾く）。
* `cond=<条件>` を付けた選択肢は条件が偽なら**表示されない**。
* `pick=` は「その選択肢を選んだ回数」を記録する任意ラベル（`pick_<name>` として条件式から参照可、判定には使わない）。

---

## 6. 条件式で使える変数

| 変数 | 内容 |
|---|---|
| `heart` | 心Point |
| `flag_mie` … `flag_kuraishi` | キャラ別Flag（`meta.json/flags` のキー名そのまま） |
| `tease` | 倉石関連の茶化しを選択した回数（COMEDY専用） |
| `flagcount` | 主要Flag（倉石を除く8種）のうち **2以上** の個数 |
| `bestflag` | 最大Flagのキャラ名（`mie` など。同値なら定義順で早い方） |
| `routes_done` / `all_routes` | 到達ルート数 / 全ルート数 |
| `route_<key>` | そのルートを読了なら 1 |
| `runs` / `endings_count` / `cg_count` | 周回数 / 回収済みエンド数 / 回収CG数（localStorage横断） |
| `item_<id>` / `tip_<id>` / `cnt_<key>` / `pick_<name>` | 収集・選択の履歴 |
| `ended_<id>` | そのエンドを一度でも見ていれば 1 |

演算子は `>= <= > < == !=` と `&& ||`、否定は `!`。右辺は数値リテラルでも識別子でもよい
（`bestflag==mie` のように**引用符なしの文字列比較**が使える）。

---

## 7. エンド判定（企画書 7.1〜7.4 との対応）

`70_endings.txt` の `#scene end0_pick` に **@if の順不同リストとして**実装されている
（`js/state.js` の `judge()` が同じ表を持つ＝ツールと実行系で判定が diverge しない）。

1. `tease>=3 && flag_ryoma>=4 && heart>=12 && heart<=17` → ⑬ COMEDY SECRET
2. `endings_count>=13` → ⑭ BONUS EXTRA
3. `heart>=24 && flagcount>=6` → ① TRUE
4. `heart>=18 && bestflag==<x>` → ②〜⑩ GOOD（x = mie / satou / rei / terachi / ryoma / izaki / meshino / kuraishi / minamitou）
5. `heart>=12` → ⑪ NORMAL
6. それ以外 → ⑫ BITTERSWEET

* 企画書 §7.2 の `FLAG_MESHINO_KURAISHI` は、⑧（召野）と⑨（倉石）で結末が分かれるため
  `flag_meshino` と `flag_kuraishi` に分離した。`flagcount`（TRUE条件の6種）は
  **倉石を数えない**（記録係なので）＝企画書の「主要Flag8種」と同数。
* 心Pointの最大は 30、最小は 7 前後（全ルート必須なので下は詰まっている）。

---

## 8. 併走するデータファイル

| ファイル | 内容 |
|---|---|
| `data/meta.json` | `speakers` / `routes` / `flags` / `counters` / `items` / `endings` / `bgmLabels` / `seLabels` |
| `data/terms.json` | ✝本質✝辞典（キー → `{title, cat, body, refs}`） |
| `data/assets.json` | アセット台帳（`id` / `cat` / `file` / `label` / `meta` / `placeholder`） |

**脚本は `data/assets.json` の id とファイル名stemのどちらも受け付ける。**
立ち絵は `@chr katsuya=03` → `chr_katsuya_03_*` を引く。

---

## 9. 検証ツール

```bash
node tools/vncheck.mjs            # 静的検査 + オートプレイ（終了コードが結果）
node tools/vncheck.mjs --verbose  # 未使用アセット・参照条件も表示
node tools/vncheck.mjs --debug    # 各コースのジャンプ痕跡を表示

JSDOM_PATH=/path/to/jsdom/lib/api.js node tools/smoke.mjs   # jsdomで実起動＋全シーン実行
```

`vncheck` が見ているもの：

* bg/cg/chr/bgm/se/tip/item/cnt/route/chat/@jump/@end の**参照が全て解決するか**
* `prologue_001` から**到達不能シーンがないか**、`@end` のない末端がないか
* `@end` 宣言と**判定関数の結果が一致するか**（脚本側の@ifcascadeと state.js の同一性）
* 誠実コース（各選択肢が先頭）→ TRUE、流すコース（末尾）→ COMEDY、
  単一ルートのみ → BITTERSWEET/NORMAL、集中コース → 該当GOOD or TRUE、ランダム120周
* **合成状態で `end0_pick` に流し込み、14エンド全部が正しく振り分けられるか**
* BG/CG/立ち絵/BGM/SE の**素材カバレッジ**（使い残しを報告）
