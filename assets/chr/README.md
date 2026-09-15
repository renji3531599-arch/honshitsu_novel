# CHR — 立ち絵（78差分／15キャラ）

`assets/chr/` の立ち絵差分。キャラごとに**どの表情が本編で何回出るか**を1枚ずつ書く。
実ファイル78枚を収録済み。 未配置のスロットは `js/visual.js` の `figureSVG()` シルエットで補完する。

> 生成: `node tools/gen_asset_md.mjs`（生成日は入れない ― 出力をバイト単位で再現可能にして CI の差分検査を安定させる）／総数 78 ファイル／正本は台帳 `data/assets.json`
> ここに並ぶ説明は台帳と本編DSLから機械的に拾っている。直すべきは台帳と脚本のほう。

## 先にまとめ

- キャラ 15 体／差分 78 枚／**本編で実際に呼ばれている差分 78 枚**
- 未使用差分は「差し替え優先度：低」。枚数だけは確保してあるので、脚本に `@chr slug=NN` を足せば出る
- `@chr` は 1〜3人まで同時（中央／左右の3スロット）。`@chr clear` で全員下げる
- 喋っている人の表示順は自動（`z-index:9`）。**話者切替で素材は差し替えない**（class と重なり順だけ＝ちらつきなし）

## 早見表（キャラ別）

| スラッグ | 名前 | 差分 | 本編の呼ばれ数 | 台詞色 |
|---|---|---|---|---|
| `futami` | 二見玲子（ふたみ・れいこ） | 4 | 4 | `#b9a2cc` |
| `inaba` | 稲葉悌二（いなば・ていじ／回想の声） | 1 | 1 | `#c0a888` |
| `izaki` | 伊崎（いざき） | 4 | 7 | `#dcbd92` |
| `izumi` | 伊豆見（いずみ） | 4 | 5 | `#e0cba2` |
| `katsuya` | 塀勝也（へい・かつや／通称ヘイカツ） | 9 | 24 | `#cbb27c` |
| `kuraishi` | 倉石暁（くらいし・あきら） | 5 | 11 | `#d6d46e` |
| `meshino` | 召野カイト（めしの・かいと） | 4 | 5 | `#e2a8bc` |
| `mie` | 三重県臣（みえ・けんしん） | 8 | 47 | `#7fa9d8` |
| `mitsumine` | 三峰瑠衣（みつみね・るい） | 4 | 6 | `#e2b79e` |
| `naitou` | 内藤蘭（ないとう・らん） | 5 | 5 | `#b6d8c6` |
| `rei` | 数理零（すうり・れい） | 5 | 10 | `#d3d9e8` |
| `ryoma` | 両馬二郎（りょうま・じろう） | 8 | 27 | `#e2853f` |
| `sakura` | 櫻優（さくら・ゆう） | 3 | 3 | `#a8c8e0` |
| `satou` | 砂糖東洋（さとう・とうよう） | 8 | 15 | `#7fd0c8` |
| `terachi` | 寺地星（てらち・せい） | 6 | 9 | `#9ec98f` |

---

## キャラごとの解説（差分を1枚ずつ）

### `futami` ― 二見玲子（ふたみ・れいこ）

- **書き方**: `@chr futami=01`〜`@chr futami=05`（差分 4 枚・`@chr futami all` は非対応、`@chr clear` で全員下げる）
- **名前ボックス**: 二見玲子／色 `#b9a2cc`
- **差し替え推奨（このキャラ共通）**: 840×1280（21:32）透過・下揃え／全身を見せたいなら 840×1120（3:4） ／ 現在 実画像 4 枚・未配置 0 枚（白紙削除済み）（各 現 332×1494・639KB）

- **① 通常** ― `@chr futami=01` ／ `chr_futami_01_tsuujou.png`　※ ● 実画像が乗っている
  本編 **1 回**。初出 `40_route_minamitou_meshino:89`（職員室前）
- **③ 心配顔** ― `@chr futami=03` ／ `chr_futami_03_shinpai.png`　※ ● 実画像が乗っている
  本編 **1 回**。初出 `40_route_minamitou_meshino:105`（食い下がった方）
- **④ いたずらっぽい笑み** ― `@chr futami=04` ／ `chr_futami_04_itazura.png`　※ ● 実画像が乗っている
  本編 **1 回**。初出 `40_route_minamitou_meshino:114`（二見の後押し）
- **⑤ しんみりした横顔** ― `@chr futami=05` ／ `chr_futami_05_yokogao.png`　※ ● 実画像が乗っている
  本編 **1 回**。初出 `40_route_minamitou_meshino:94`（職員室前）

### `inaba` ― 稲葉悌二（いなば・ていじ／回想の声）

- **書き方**: `@chr inaba=01`〜`@chr inaba=01`（差分 1 枚・`@chr inaba all` は非対応、`@chr clear` で全員下げる）
- **名前ボックス**: 稲葉悌二／色 `#c0a888`
- **差し替え推奨（このキャラ共通）**: 840×1280（21:32）透過・下揃え／全身を見せたいなら 840×1120（3:4） ／ 現在 実画像 1 枚・未配置 0 枚（白紙削除済み）（各 現 463×1496・793KB）

- **① 古写真の中の柔らかい笑み** ― `@chr inaba=01` ／ `chr_inaba_01_furushashin_hohoemi.png`　※ ● 実画像が乗っている
  本編 **1 回**。初出 `60_climax:66`（回想：はじめての地形図）

### `izaki` ― 伊崎（いざき）

- **書き方**: `@chr izaki=01`〜`@chr izaki=06`（差分 4 枚・`@chr izaki all` は非対応、`@chr clear` で全員下げる）
- **名前ボックス**: 伊崎／色 `#dcbd92`
- **差し替え推奨（このキャラ共通）**: 840×1280（21:32）透過・下揃え／全身を見せたいなら 840×1120（3:4） ／ 現在 実画像 4 枚・未配置 0 枚（白紙削除済み）（各 現 372×1338・564KB）

- **① 通常** ― `@chr izaki=01` ／ `chr_izaki_01_tsuujou.png`　※ ● 実画像が乗っている
  本編 **1 回**。初出 `00_prologue:88`（二月、北棟三年B組・昼休み）
- **② 笑顔** ― `@chr izaki=02` ／ `chr_izaki_02_egao.png`　※ ● 実画像が乗っている
  本編 **2 回**。初出 `00_prologue:94`（二月、北棟三年B組・昼休み） → ほか 1 回
- **④ 真剣（仕切る顔）** ― `@chr izaki=04` ／ `chr_izaki_04_shikiri.png`　※ ● 実画像が乗っている
  本編 **3 回**。初出 `50_converge:18`（放課後、誰もいない北棟三年B組教室） → ほか 2 回
- **⑥ しみじみとした微笑み** ― `@chr izaki=06` ／ `chr_izaki_06_shimijimi_hohoemi.png`　※ ● 実画像が乗っている
  本編 **1 回**。初出 `70_endings:170`（GOOD END 伊崎＋伊豆見「それぞれの歩幅」）

### `izumi` ― 伊豆見（いずみ）

- **書き方**: `@chr izumi=01`〜`@chr izumi=06`（差分 4 枚・`@chr izumi all` は非対応、`@chr clear` で全員下げる）
- **名前ボックス**: 伊豆見／色 `#e0cba2`
- **差し替え推奨（このキャラ共通）**: 840×1280（21:32）透過・下揃え／全身を見せたいなら 840×1120（3:4） ／ 現在 実画像 4 枚・未配置 0 枚（白紙削除済み）（各 現 404×1469・644KB）

- **② 笑顔** ― `@chr izumi=02` ／ `chr_izumi_02_egao.png`　※ ● 実画像が乗っている
  本編 **2 回**。初出 `00_prologue:88`（二月、北棟三年B組・昼休み） → ほか 1 回
- **③ 緊張** ― `@chr izumi=03` ／ `chr_izumi_03_kinchou.png`　※ ● 実画像が乗っている
  本編 **1 回**。初出 `50_converge:88`（当日の設計）
- **④ 決意** ― `@chr izumi=04` ／ `chr_izumi_04_ketsui.png`　※ ● 実画像が乗っている
  本編 **1 回**。初出 `50_converge:57`（「思い出の地形図」制作）
- **⑥ 誇らしげ** ― `@chr izumi=06` ／ `chr_izumi_06_hokorashige.png`　※ ● 実画像が乗っている
  本編 **1 回**。初出 `70_endings:170`（GOOD END 伊崎＋伊豆見「それぞれの歩幅」）

### `katsuya` ― 塀勝也（へい・かつや／通称ヘイカツ）

- **書き方**: `@chr katsuya=01`〜`@chr katsuya=10`（差分 9 枚・`@chr katsuya all` は非対応、`@chr clear` で全員下げる）
- **名前ボックス**: 塀勝也／色 `#cbb27c`
- **差し替え推奨（このキャラ共通）**: 840×1280（21:32）透過・下揃え／全身を見せたいなら 840×1120（3:4） ／ 現在 実画像 9 枚・未配置 0 枚（白紙削除済み）（各 現 1015×1550・913KB）

- **① 通常（穏やか）** ― `@chr katsuya=01` ／ `chr_katsuya_01_tsuujou.png`　※ ● 実画像が乗っている
  本編 **2 回**。初出 `00_prologue:106`（二月、北棟三年B組・昼休み（続き）） → ほか 1 回
- **② 微笑** ― `@chr katsuya=02` ／ `chr_katsuya_02_hohoemi.png`　※ ● 実画像が乗っている
  本編 **6 回**。初出 `60_climax:35`（卒業式前日、放課後の教室） → ほか 5 回
- **③ 遠い目** ― `@chr katsuya=03` ／ `chr_katsuya_03_tooi_me.png`　※ ● 実画像が乗っている
  本編 **2 回**。初出 `00_prologue:54`（三年間ダイジェスト（共通・スキップ可）） → ほか 1 回
- **④ 驚き** ― `@chr katsuya=04` ／ `chr_katsuya_04_odoroki.png`　※ ● 実画像が乗っている
  本編 **3 回**。初出 `10_chapter1:30`（地図保管庫） → ほか 2 回
- **⑥ 硬い無表情** ― `@chr katsuya=06` ／ `chr_katsuya_06_katai_muhyoujou.png`　※ ● 実画像が乗っている
  本編 **3 回**。初出 `10_chapter1:42`（地図保管庫） → ほか 2 回
- **⑦ 回想・目を細める** ― `@chr katsuya=07` ／ `chr_katsuya_07_kaisou_me_hosomeru.png`　※ ● 実画像が乗っている
  本編 **2 回**。初出 `60_climax:121`（気づき） → ほか 1 回
- **⑧ 涙をこらえる** ― `@chr katsuya=08` ／ `chr_katsuya_08_namida_koraeru.png`　※ ● 実画像が乗っている
  本編 **3 回**。初出 `60_climax:94`（回想：最後の日） → ほか 2 回
- **⑨ 泣く** ― `@chr katsuya=09` ／ `chr_katsuya_09_naku.png`　※ ● 実画像が乗っている
  本編 **1 回**。初出 `60_climax:90`（回想：最後の日）
- **⑩ 晴れやかな笑み** ― `@chr katsuya=10` ／ `chr_katsuya_10_hareyaka_emi.png`　※ ● 実画像が乗っている
  本編 **2 回**。初出 `60_climax:172`（締めの言葉） → ほか 1 回

### `kuraishi` ― 倉石暁（くらいし・あきら）

- **書き方**: `@chr kuraishi=01`〜`@chr kuraishi=06`（差分 5 枚・`@chr kuraishi all` は非対応、`@chr clear` で全員下げる）
- **名前ボックス**: 倉石暁／色 `#d6d46e`
- **差し替え推奨（このキャラ共通）**: 840×1280（21:32）透過・下揃え／全身を見せたいなら 840×1120（3:4） ／ 現在 実画像 5 枚・未配置 0 枚（白紙削除済み）（各 現 380×1478・690KB）

- **① 通常（熱狂）** ― `@chr kuraishi=01` ／ `chr_kuraishi_01_nekkyou.png`　※ ● 実画像が乗っている
  本編 **4 回**。初出 `00_prologue:81`（二月、北棟三年B組・昼休み） → ほか 3 回
- **② 感激** ― `@chr kuraishi=02` ／ `chr_kuraishi_02_kangeki.png`　※ ● 実画像が乗っている
  本編 **1 回**。初出 `70_endings:155`（GOOD END 両馬「✝本質✝、その後」）
- **③ 真剣（調査中）** ― `@chr kuraishi=03` ／ `chr_kuraishi_03_chousa_shinken.png`　※ ● 実画像が乗っている
  本編 **3 回**。初出 `40_route_minamitou_meshino:134`（図書室、書庫） → ほか 2 回
- **⑤ 誇らしげ** ― `@chr kuraishi=05` ／ `chr_kuraishi_05_hokorashige.png`　※ ● 実画像が乗っている
  本編 **2 回**。初出 `50_converge:66`（「思い出の地形図」制作） → ほか 1 回
- **⑥ 言葉を失う顔** ― `@chr kuraishi=06` ／ `chr_kuraishi_06_kotoba_ushinau.png`　※ ● 実画像が乗っている
  本編 **1 回**。初出 `40_route_minamitou_meshino:139`（図書室、書庫）

### `meshino` ― 召野カイト（めしの・かいと）

- **書き方**: `@chr meshino=01`〜`@chr meshino=06`（差分 4 枚・`@chr meshino all` は非対応、`@chr clear` で全員下げる）
- **名前ボックス**: 召野カイト／色 `#e2a8bc`
- **差し替え推奨（このキャラ共通）**: 840×1280（21:32）透過・下揃え／全身を見せたいなら 840×1120（3:4） ／ 現在 実画像 4 枚・未配置 0 枚（白紙削除済み）（各 現 376×1445・636KB）

- **① 通常** ― `@chr meshino=01` ／ `chr_meshino_01_tsuujou.png`　※ ● 実画像が乗っている
  本編 **1 回**。初出 `40_route_minamitou_meshino:114`（二見の後押し）
- **④ 真剣** ― `@chr meshino=04` ／ `chr_meshino_04_shinken.png`　※ ● 実画像が乗っている
  本編 **2 回**。初出 `40_route_minamitou_meshino:89`（職員室前） → ほか 1 回
- **⑤ 英語ドヤ顔** ― `@chr meshino=05` ／ `chr_meshino_05_eigo_doya.png`　※ ● 実画像が乗っている
  本編 **1 回**。初出 `50_converge:61`（「思い出の地形図」制作）
- **⑥ しんみり** ― `@chr meshino=06` ／ `chr_meshino_06_shinmiri.png`　※ ● 実画像が乗っている
  本編 **1 回**。初出 `70_endings:184`（GOOD END 召野「言葉を届ける」）

### `mie` ― 三重県臣（みえ・けんしん）

- **書き方**: `@chr mie=01`〜`@chr mie=10`（差分 8 枚・`@chr mie all` は非対応、`@chr clear` で全員下げる）
- **名前ボックス**: 三重県臣／色 `#7fa9d8`
- **差し替え推奨（このキャラ共通）**: 840×1280（21:32）透過・下揃え／全身を見せたいなら 840×1120（3:4） ／ 現在 実画像 8 枚・未配置 0 枚（白紙削除済み）（各 現 1024×1536・779KB）

- **① 通常（冷笑・半目）** ― `@chr mie=01` ／ `chr_mie_01_reishou.png`　※ ● 実画像が乗っている
  本編 **19 回**。初出 `00_prologue:106`（二月、北棟三年B組・昼休み（続き）） → ほか 18 回
- **② 「は？」** ― `@chr mie=02` ／ `chr_mie_02_ha.png`　※ ● 実画像が乗っている
  本編 **4 回**。初出 `00_prologue:74`（二月、北棟三年B組・昼休み） → ほか 3 回
- **③ 動揺** ― `@chr mie=03` ／ `chr_mie_03_douyou.png`　※ ● 実画像が乗っている
  本編 **1 回**。初出 `20_route_satou_rei:166`（零の中の変化）
- **④ 気まずい沈黙** ― `@chr mie=04` ／ `chr_mie_04_kimazui_chinmoku.png`　※ ● 実画像が乗っている
  本編 **8 回**。初出 `10_chapter1:67`（放課後、屋上へ続く階段の踊り場） → ほか 7 回
- **⑥ 苛立ち混じりの真剣** ― `@chr mie=06` ／ `chr_mie_06_iradachi_shinken.png`　※ ● 実画像が乗っている
  本編 **2 回**。初出 `10_chapter1:74`（放課後、屋上へ続く階段の踊り場） → ほか 1 回
- **⑦ 本気の真剣** ― `@chr mie=07` ／ `chr_mie_07_honki_shinken.png`　※ ● 実画像が乗っている
  本編 **7 回**。初出 `10_chapter1:149`（HUB ― ルート選択） → ほか 6 回
- **⑨ 初めての素直な微笑み** ― `@chr mie=09` ／ `chr_mie_09_sunao_hohoemi.png`　※ ● 実画像が乗っている
  本編 **5 回**。初出 `10_chapter1:137`（選択後共通 ―― 夕方の廊下） → ほか 4 回
- **⑩ 泣き顔** ― `@chr mie=10` ／ `chr_mie_10_nakigao.png`　※ ● 実画像が乗っている
  本編 **1 回**。初出 `60_climax:128`（気づき）

### `mitsumine` ― 三峰瑠衣（みつみね・るい）

- **書き方**: `@chr mitsumine=01`〜`@chr mitsumine=06`（差分 4 枚・`@chr mitsumine all` は非対応、`@chr clear` で全員下げる）
- **名前ボックス**: 三峰瑠衣／色 `#e2b79e`
- **差し替え推奨（このキャラ共通）**: 840×1280（21:32）透過・下揃え／全身を見せたいなら 840×1120（3:4） ／ 現在 実画像 4 枚・未配置 0 枚（白紙削除済み）（各 現 1024×1536・725KB）

- **① 通常** ― `@chr mitsumine=01` ／ `chr_mitsumine_01_tsuujou.png`　※ ● 実画像が乗っている
  本編 **2 回**。初出 `40_route_minamitou_meshino:15`（桜並木、まだ蕾） → ほか 1 回
- **② ツッコミ顔** ― `@chr mitsumine=02` ／ `chr_mitsumine_02_tsukkomi.png`　※ ● 実画像が乗っている
  本編 **1 回**。初出 `40_route_minamitou_meshino:19`（桜並木、まだ蕾）
- **③ 笑顔** ― `@chr mitsumine=03` ／ `chr_mitsumine_03_egao.png`　※ ● 実画像が乗っている
  本編 **2 回**。初出 `40_route_minamitou_meshino:64`（決意） → ほか 1 回
- **⑥ 「は？」（ハモリ専用）** ― `@chr mitsumine=06` ／ `chr_mitsumine_06_ha.png`　※ ● 実画像が乗っている
  本編 **1 回**。初出 `70_endings:95`（（おまけ）ハモり）

### `naitou` ― 内藤蘭（ないとう・らん）

- **書き方**: `@chr naitou=01`〜`@chr naitou=06`（差分 5 枚・`@chr naitou all` は非対応、`@chr clear` で全員下げる）
- **名前ボックス**: 内藤蘭／色 `#b6d8c6`
- **差し替え推奨（このキャラ共通）**: 840×1280（21:32）透過・下揃え／全身を見せたいなら 840×1120（3:4） ／ 現在 実画像 5 枚・未配置 0 枚（白紙削除済み）（各 現 1024×1536・766KB）

- **① 通常** ― `@chr naitou=01` ／ `chr_naitou_01_tsuujou.png`　※ ● 実画像が乗っている
  本編 **1 回**。初出 `40_route_minamitou_meshino:32`（南棟三年教室）
- **② 微笑** ― `@chr naitou=02` ／ `chr_naitou_02_hohoemi.png`　※ ● 実画像が乗っている
  本編 **1 回**。初出 `40_route_minamitou_meshino:36`（南棟三年教室）
- **④ 驚き** ― `@chr naitou=04` ／ `chr_naitou_04_odoroki.png`　※ ● 実画像が乗っている
  本編 **1 回**。初出 `40_route_minamitou_meshino:46`（茶化した場合）
- **⑤ 優しい目** ― `@chr naitou=05` ／ `chr_naitou_05_yasashii_me.png`　※ ● 実画像が乗っている
  本編 **1 回**。初出 `40_route_minamitou_meshino:60`（決意）
- **⑥ 少し笑う** ― `@chr naitou=06` ／ `chr_naitou_06_sukoshi_warau.png`　※ ● 実画像が乗っている
  本編 **1 回**。初出 `70_endings:212`（GOOD END 南棟「境界のない春」）

### `rei` ― 数理零（すうり・れい）

- **書き方**: `@chr rei=01`〜`@chr rei=07`（差分 5 枚・`@chr rei all` は非対応、`@chr clear` で全員下げる）
- **名前ボックス**: 数理零／色 `#d3d9e8`
- **差し替え推奨（このキャラ共通）**: 840×1280（21:32）透過・下揃え／全身を見せたいなら 840×1120（3:4） ／ 現在 実画像 5 枚・未配置 0 枚（白紙削除済み）（各 現 408×1506・679KB）
- **その人が主役のルート**: B「零編」 ― 面白いの向こう側（開始シーン `b1`）

- **① 通常（涼しい顔）** ― `@chr rei=01` ／ `chr_rei_01_suzushii.png`　※ ● 実画像が乗っている
  本編 **2 回**。初出 `20_route_satou_rei:115`（放課後、黒板の前） → ほか 1 回
- **② 微笑** ― `@chr rei=02` ／ `chr_rei_02_hohoemi.png`　※ ● 実画像が乗っている
  本編 **2 回**。初出 `20_route_satou_rei:171`（零の中の変化） → ほか 1 回
- **④ 驚き** ― `@chr rei=04` ／ `chr_rei_04_odoroki.png`　※ ● 実画像が乗っている
  本編 **1 回**。初出 `20_route_satou_rei:122`（放課後、黒板の前）
- **⑤ 真剣（データと向き合う）** ― `@chr rei=05` ／ `chr_rei_05_data_shinken.png`　※ ● 実画像が乗っている
  本編 **4 回**。初出 `20_route_satou_rei:126`（放課後、黒板の前） → ほか 3 回
- **⑦ 言葉を選ぶ顔** ― `@chr rei=07` ／ `chr_rei_07_kotoba_erabu.png`　※ ● 実画像が乗っている
  本編 **1 回**。初出 `20_route_satou_rei:160`（零の中の変化）

### `ryoma` ― 両馬二郎（りょうま・じろう）

- **書き方**: `@chr ryoma=01`〜`@chr ryoma=09`（差分 8 枚・`@chr ryoma all` は非対応、`@chr clear` で全員下げる）
- **名前ボックス**: 両馬二郎／色 `#e2853f`
- **差し替え推奨（このキャラ共通）**: 840×1280（21:32）透過・下揃え／全身を見せたいなら 840×1120（3:4） ／ 現在 実画像 8 枚・未配置 0 枚（白紙削除済み）（各 現 1024×1536・791KB）
- **その人が主役のルート**: D「両馬編」 ― 祖父と✝本質✝（開始シーン `d1`）

- **① 通常** ― `@chr ryoma=01` ／ `chr_ryoma_01_tsuujou.png`　※ ● 実画像が乗っている
  本編 **4 回**。初出 `00_prologue:81`（二月、北棟三年B組・昼休み） → ほか 3 回
- **② ニヤリ** ― `@chr ryoma=02` ／ `chr_ryoma_02_niyari.png`　※ ● 実画像が乗っている
  本編 **5 回**。初出 `00_prologue:74`（二月、北棟三年B組・昼休み） → ほか 4 回
- **④ 急に真顔** ― `@chr ryoma=04` ／ `chr_ryoma_04_kyuu_magao.png`　※ ● 実画像が乗っている
  本編 **6 回**。初出 `00_prologue:106`（二月、北棟三年B組・昼休み（続き）） → ほか 5 回
- **⑤ しょんぼり** ― `@chr ryoma=05` ／ `chr_ryoma_05_shonbori.png`　※ ● 実画像が乗っている
  本編 **1 回**。初出 `10_chapter1:160`（まだ聞けていない話がある気がする）
- **⑥ 泣き笑い** ― `@chr ryoma=06` ／ `chr_ryoma_06_nakiwarai.png`　※ ● 実画像が乗っている
  本編 **4 回**。初出 `30_route_terachi_ryoma:98`（両馬の家、夕方） → ほか 3 回
- **⑦ 真剣な決意顔** ― `@chr ryoma=07` ／ `chr_ryoma_07_shinken_ketsui.png`　※ ● 実画像が乗っている
  本編 **4 回**。初出 `10_chapter1:149`（HUB ― ルート選択） → ほか 3 回
- **⑧ 照れ隠しで頭をかく** ― `@chr ryoma=08` ／ `chr_ryoma_08_terekakushi.png`　※ ● 実画像が乗っている
  本編 **2 回**。初出 `30_route_terachi_ryoma:88`（両馬の家、夕方） → ほか 1 回
- **⑨ 号泣** ― `@chr ryoma=09` ／ `chr_ryoma_09_goukyuu.png`　※ ● 実画像が乗っている
  本編 **1 回**。初出 `30_route_terachi_ryoma:119`（祖父の口癖）

### `sakura` ― 櫻優（さくら・ゆう）

- **書き方**: `@chr sakura=01`〜`@chr sakura=06`（差分 3 枚・`@chr sakura all` は非対応、`@chr clear` で全員下げる）
- **名前ボックス**: 櫻優／色 `#a8c8e0`
- **差し替え推奨（このキャラ共通）**: 840×1280（21:32）透過・下揃え／全身を見せたいなら 840×1120（3:4） ／ 現在 実画像 3 枚・未配置 0 枚（白紙削除済み）（各 現 1054×1492・750KB）

- **② 真剣（研究者モード）** ― `@chr sakura=02` ／ `chr_sakura_02_kenkyuusha.png`　※ ● 実画像が乗っている
  本編 **1 回**。初出 `40_route_minamitou_meshino:32`（南棟三年教室）
- **⑤ 笑顔** ― `@chr sakura=05` ／ `chr_sakura_05_egao.png`　※ ● 実画像が乗っている
  本編 **1 回**。初出 `40_route_minamitou_meshino:66`（決意）
- **⑥ 柔らかい表情** ― `@chr sakura=06` ／ `chr_sakura_06_yawarakai.png`　※ ● 実画像が乗っている
  本編 **1 回**。初出 `70_endings:212`（GOOD END 南棟「境界のない春」）

### `satou` ― 砂糖東洋（さとう・とうよう）

- **書き方**: `@chr satou=01`〜`@chr satou=08`（差分 8 枚・`@chr satou all` は非対応、`@chr clear` で全員下げる）
- **名前ボックス**: 砂糖東洋／色 `#7fd0c8`
- **差し替え推奨（このキャラ共通）**: 840×1280（21:32）透過・下揃え／全身を見せたいなら 840×1120（3:4） ／ 現在 実画像 8 枚・未配置 0 枚（白紙削除済み）（各 現 1054×1492・689KB）
- **その人が主役のルート**: A「砂糖編」 ― 窓の外の続き（開始シーン `a1`）

- **① 通常（ゲーム画面凝視）** ― `@chr satou=01` ／ `chr_satou_01_game_gyoushi.png`　※ ● 実画像が乗っている
  本編 **3 回**。初出 `00_prologue:88`（二月、北棟三年B組・昼休み） → ほか 2 回
- **② 無表情（素）** ― `@chr satou=02` ／ `chr_satou_02_muhyoujou.png`　※ ● 実画像が乗っている
  本編 **3 回**。初出 `20_route_satou_rei:25`（放課後、教室に残る砂糖） → ほか 2 回
- **③ 驚き（画面から顔を上げる）** ― `@chr satou=03` ／ `chr_satou_03_kao_ageta.png`　※ ● 実画像が乗っている
  本編 **1 回**。初出 `20_route_satou_rei:53`（正面から頼んだ方）
- **④ 照れ隠しでそっぽを向く** ― `@chr satou=04` ／ `chr_satou_04_soppo.png`　※ ● 実画像が乗っている
  本編 **1 回**。初出 `20_route_satou_rei:19`（放課後、教室に残る砂糖）
- **⑤ 真剣にカメラを構える顔** ― `@chr satou=05` ／ `chr_satou_05_camera.png`　※ ● 実画像が乗っている
  本編 **2 回**。初出 `20_route_satou_rei:77`（砂糖のスマートフォン） → ほか 1 回
- **⑥ 微笑み（レア）** ― `@chr satou=06` ／ `chr_satou_06_hohoemi.png`　※ ● 実画像が乗っている
  本編 **2 回**。初出 `20_route_satou_rei:97`（砂糖のスマートフォン） → ほか 1 回
- **⑦ 言葉に詰まる顔** ― `@chr satou=07` ／ `chr_satou_07_tsumaru.png`　※ ● 実画像が乗っている
  本編 **2 回**。初出 `20_route_satou_rei:87`（砂糖のスマートフォン） → ほか 1 回
- **⑧ 目に光るものを堪える顔** ― `@chr satou=08` ／ `chr_satou_08_me_hikari_koraeru.png`　※ ● 実画像が乗っている
  本編 **1 回**。初出 `60_climax:114`（窓の外の五秒）

### `terachi` ― 寺地星（てらち・せい）

- **書き方**: `@chr terachi=01`〜`@chr terachi=08`（差分 6 枚・`@chr terachi all` は非対応、`@chr clear` で全員下げる）
- **名前ボックス**: 寺地星／色 `#9ec98f`
- **差し替え推奨（このキャラ共通）**: 840×1280（21:32）透過・下揃え／全身を見せたいなら 840×1120（3:4） ／ 現在 実画像 6 枚・未配置 0 枚（白紙削除済み）（各 現 1054×1492・768KB）
- **その人が主役のルート**: C「寺地編」 ― 最後の朗読、まだ早いけど（開始シーン `c1`）

- **① 通常（眠そう・淡々）** ― `@chr terachi=01` ／ `chr_terachi_01_nemusou.png`　※ ● 実画像が乗っている
  本編 **2 回**。初出 `30_route_terachi_ryoma:12`（放課後、誰もいない教室） → ほか 1 回
- **② 困惑して固まる** ― `@chr terachi=02` ／ `chr_terachi_02_konwaku_katamaru.png`　※ ● 実画像が乗っている
  本編 **1 回**。初出 `30_route_terachi_ryoma:32`（正面から頼んだ方）
- **③ 真剣な配信者の顔** ― `@chr terachi=03` ／ `chr_terachi_03_haishin_shinken.png`　※ ● 実画像が乗っている
  本編 **1 回**。初出 `30_route_terachi_ryoma:17`（放課後、誰もいない教室）
- **④ 嬉しい** ― `@chr terachi=04` ／ `chr_terachi_04_ureshii.png`　※ ● 実画像が乗っている
  本編 **1 回**。初出 `70_endings:139`（GOOD END 寺地「配信は続く」）
- **⑥ マイク前の決意顔** ― `@chr terachi=06` ／ `chr_terachi_06_maiku_no_ketsui.png`　※ ● 実画像が乗っている
  本編 **3 回**。初出 `30_route_terachi_ryoma:57`（三年分の紙） → ほか 2 回
- **⑧ 涙** ― `@chr terachi=08` ／ `chr_terachi_08_namida.png`　※ ● 実画像が乗っている
  本編 **1 回**。初出 `60_climax:165`（最後の朗読）

## 差し替え手順（立ち絵共通）

1. **ファイル名は「台帳ID + 拡張子」**（例 `chr_katsuya_01_tsuujou.png`）。それを `assets/chr/` に新規配置
   ― 台帳の `id` と `file` のファイル名部分は 78 行すべて一致済み。一覧は `docs/CHR_REPLACE_LIST.md`
   ― 旧名（`chr_katsuya_01_tsujou.png` のような短縮ローマ字）は **2026-09-13 に全廃**。どのコードも参照していません
2. 台帳の `placeholder` を `false` に → シルエット補完（`figureSVG`）が消えて実画像になる
   （**1と2はセット**。ファイルだけ置くと補完のまま、フラグだけ倒すと 404 で壊れる）
   ― まとめてやるなら `node tools/sync_placeholder.mjs`（実在ファイルを検出して自動で `false` にする）
3. `sw.js` の `CACHE`（現在 `honshitsu-v11`）を上げる（`--bump` で自動）
4. 白背景のまま置きたいときだけ CONFIG「画像合成」= multiply（ `#stage[data-blend="multiply"] .chr img` にだけ掛かる）
5. `node tools/sync_placeholder.mjs --check` で寸法・透過・容量・台帳のズレを確認 → `npm test`

### 入稿寸法（実測ベース ― 詳細は `docs/ART_SPEC.md`）

| 項目 | 値 | 根拠 |
|---|---|---|
| 推奨 | **840×1280（21:32）・透過／全身を切りたくなければ 840×1120（3:4）。最低 672×1024** | 表示枠 `.chr{width:420u;height:640u}`（`css/vn.css:108`）＝実寸 672×1024px |
| 描画 | `object-fit:contain` ＋ `object-position:bottom center` | `css/vn.css:114`。比がズレると枠内に余白が出る |
| **上が切れる** | 横画面（16:9）では枠の上 12.1% が画面外 | 舞台の高さ 562.5u ＜ 枠 640u ＋ `bottom:0` ＋ `#viewport{overflow:hidden}` |
| → 840×1280 の場合 | **上 155px は余白**にして頭頂を y≧163px に | 切れるのは 12.1% ＝ 155px |
| → 切りたくない場合 | **840×1120（3:4）** なら `contain` で 420×560u に収まり全身が見える | 切れない上限は 840×1125（w/h≒0.747） |
| 確実に見える帯 | 840×1280 換算で **y=155〜885px** | 上端 12.1% は画面外、下端は下 197u（35%）をテキスト窓が覆う（半透明＋blur なので完全には消えない） |
| 横の余白 | 左右に **10〜15% の透明余白**を推奨 | 配置は 1人=50%／2人=33.3%・66.7%／3人=18%・50%・82%（`js/visual.js:848-850`）で枠は常に 420u 幅 → 3人時は左右 50u ずつ重なる |
| 解像度の上限 | 1344×2048（Retina 等倍）まで意味がある | 実寸 672×1024px × DPR2。ただし 78 枚あるので容量と相談 → **透過WebP** 推奨（PNG の 1/4〜1/6） |

### 演出（JS/CSS 側で自動）

| 効く場所 | 挙動 |
|---|---|
| `data-enter="left/right/center"` | 入場スライド＋ブラー（88ms ずつスタッガ） |
| `chrBreathe` 8.4s | **`translate` だけ**動かす（ぼかしの再計算を毎フレームやめた）。CONFIG「立ち絵の動き」で lite/off/full |
| `.talk` | `chrTalkSettle` .5s 単発（旧来は .34s 無限＝再ラスタ源だった） |
| `.dim` | 非話者を明度60%・彩度52%・0.985 |
| 3人時 | 中央 1.016／左右 0.988 で奥行き |
