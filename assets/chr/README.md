# CHR — 立ち絵（105差分／16キャラ）

`assets/chr/` の立ち絵差分。キャラごとに**どの表情が本編で何回出るか**を1枚ずつ書く。
現在は白紙プレースホルダで、画面に出ているのは `js/visual.js` の `figureSVG()` シルエット補完。

> 生成: `node tools/gen_asset_md.mjs`（2026-09-12）／総数 105 ファイル／正本は台帳 `data/assets.json`
> ここに並ぶ説明は台帳と本編DSLから機械的に拾っている。直すべきは台帳と脚本のほう。

## 先にまとめ

- キャラ 16 体／差分 105 枚／**本編で実際に呼ばれている差分 78 枚**
- 未使用差分は「差し替え優先度：低」。枚数だけは確保してあるので、脚本に `@chr slug=NN` を足せば出る
- `@chr` は 1〜3人まで同時（中央／左右の3スロット）。`@chr clear` で全員下げる
- 喋っている人の表示順は自動（`z-index:9`）。**話者切替で素材は差し替えない**（class と重なり順だけ＝ちらつきなし）

## 早見表（キャラ別）

| スラッグ | 名前 | 差分 | 本編の呼ばれ数 | 台詞色 |
|---|---|---|---|---|
| `futami` | 二見玲子（ふたみ・れいこ） | 5 | 4 | `#b9a2cc` |
| `inaba` | 稲葉悌二（いなば・ていじ／回想の声） | 2 | 1 | `#c0a888` |
| `izaki` | 伊崎（いざき） | 6 | 7 | `#dcbd92` |
| `izumi` | 伊豆見（いずみ） | 6 | 5 | `#e0cba2` |
| `katsuya` | 塀勝也（へい・かつや／通称ヘイカツ） | 10 | 23 | `#cbb27c` |
| `kuraishi` | 倉石暁（くらいし・あきら） | 7 | 11 | `#d6d46e` |
| `meshino` | 召野カイト（めしの・かいと） | 6 | 5 | `#e2a8bc` |
| `mie` | 三重県臣（みえ・けんしん） | 10 | 47 | `#7fa9d8` |
| `mitsumine` | 三峰瑠衣（みつみね・るい） | 6 | 6 | `#e2b79e` |
| `naitou` | 内藤蘭（ないとう・らん） | 6 | 5 | `#b6d8c6` |
| `rei` | 数理零（すうり・れい） | 8 | 10 | `#d3d9e8` |
| `ryoma` | 両馬二郎（りょうま・じろう） | 9 | 27 | `#e2853f` |
| `sakura` | 櫻優（さくら・ゆう） | 6 | 3 | `#a8c8e0` |
| `satou` | 砂糖東洋（さとう・とうよう） | 8 | 15 | `#7fd0c8` |
| `terachi` | 寺地星（てらち・せい） | 8 | 9 | `#9ec98f` |
| `wakaki-katsuya` | 若き日の勝也（わかき・かつや／回想の声） | 2 | 0 | `#c0a888` |

---

## キャラごとの解説（差分を1枚ずつ）

### `futami` ― 二見玲子（ふたみ・れいこ）

- **書き方**: `@chr futami=01`〜`@chr futami=05`（差分 5 枚・`@chr futami all` は非対応、`@chr clear` で全員下げる）
- **名前ボックス**: 二見玲子／色 `#b9a2cc`
- **差し替え推奨（このキャラ共通）**: 840×1280 以上／透過PNG／下揃え（`object-position: bottom center`） ／ 現在 白紙 5 枚・実画像 0 枚（各 現 400×300・810B）

- **① 通常** ― `@chr futami=01` ／ `chr_futami_01_tsuujou.png`
  本編 **1 回**。初出 `40_route_minamitou_meshino:88`（職員室前）
- **② 微笑** ― `@chr futami=02` ／ `chr_futami_02_hohoemi.png`
  本編で **未使用**（この番号を呼んでいる行がない）。素材は用意済みなので、脚本に1行足せばそのまま出る
- **③ 心配顔** ― `@chr futami=03` ／ `chr_futami_03_shinpai.png`
  本編 **1 回**。初出 `40_route_minamitou_meshino:104`（食い下がった方）
- **④ いたずらっぽい笑み** ― `@chr futami=04` ／ `chr_futami_04_itazura.png`
  本編 **1 回**。初出 `40_route_minamitou_meshino:113`（二見の後押し）
- **⑤ しんみりした横顔** ― `@chr futami=05` ／ `chr_futami_05_yokogao.png`
  本編 **1 回**。初出 `40_route_minamitou_meshino:93`（職員室前）

### `inaba` ― 稲葉悌二（いなば・ていじ／回想の声）

- **書き方**: `@chr inaba=01`〜`@chr inaba=02`（差分 2 枚・`@chr inaba all` は非対応、`@chr clear` で全員下げる）
- **名前ボックス**: 稲葉悌二／色 `#c0a888`
- **差し替え推奨（このキャラ共通）**: 840×1280 以上／透過PNG／下揃え（`object-position: bottom center`） ／ 現在 白紙 2 枚・実画像 0 枚（各 現 400×300・810B）

- **① 古写真の中の柔らかい笑み** ― `@chr inaba=01` ／ `chr_inaba_01_shashin_no_waraui.png`
  本編 **1 回**。初出 `60_climax:66`（回想：はじめての地形図）
- **② 山を指差す横顔** ― `@chr inaba=02` ／ `chr_inaba_02_yama_sasu.png`
  本編で **未使用**（この番号を呼んでいる行がない）。素材は用意済みなので、脚本に1行足せばそのまま出る

### `izaki` ― 伊崎（いざき）

- **書き方**: `@chr izaki=01`〜`@chr izaki=06`（差分 6 枚・`@chr izaki all` は非対応、`@chr clear` で全員下げる）
- **名前ボックス**: 伊崎／色 `#dcbd92`
- **差し替え推奨（このキャラ共通）**: 840×1280 以上／透過PNG／下揃え（`object-position: bottom center`） ／ 現在 白紙 6 枚・実画像 0 枚（各 現 400×300・810B）

- **① 通常** ― `@chr izaki=01` ／ `chr_izaki_01_tsuujou.png`
  本編 **1 回**。初出 `00_prologue:88`（二月、北棟三年B組・昼休み）
- **② 笑顔** ― `@chr izaki=02` ／ `chr_izaki_02_egao.png`
  本編 **2 回**。初出 `00_prologue:94`（二月、北棟三年B組・昼休み） → ほか 1 回
- **③ 困り顔** ― `@chr izaki=03` ／ `chr_izaki_03_komari.png`
  本編で **未使用**（この番号を呼んでいる行がない）。素材は用意済みなので、脚本に1行足せばそのまま出る
- **④ 真剣（仕切る顔）** ― `@chr izaki=04` ／ `chr_izaki_04_shikiri.png`
  本編 **3 回**。初出 `50_converge:19`（放課後、誰もいない北棟三年B組教室） → ほか 2 回
- **⑤ 驚き** ― `@chr izaki=05` ／ `chr_izaki_05_odoroki.png`
  本編で **未使用**（この番号を呼んでいる行がない）。素材は用意済みなので、脚本に1行足せばそのまま出る
- **⑥ しみじみとした微笑み** ― `@chr izaki=06` ／ `chr_izaki_06_shimiemi.png`
  本編 **1 回**。初出 `70_endings:179`（GOOD END 伊崎＋伊豆見「それぞれの歩幅」）

### `izumi` ― 伊豆見（いずみ）

- **書き方**: `@chr izumi=01`〜`@chr izumi=06`（差分 6 枚・`@chr izumi all` は非対応、`@chr clear` で全員下げる）
- **名前ボックス**: 伊豆見／色 `#e0cba2`
- **差し替え推奨（このキャラ共通）**: 840×1280 以上／透過PNG／下揃え（`object-position: bottom center`） ／ 現在 白紙 6 枚・実画像 0 枚（各 現 400×300・810B）

- **① 通常** ― `@chr izumi=01` ／ `chr_izumi_01_tsuujou.png`
  本編で **未使用**（この番号を呼んでいる行がない）。素材は用意済みなので、脚本に1行足せばそのまま出る
- **② 笑顔** ― `@chr izumi=02` ／ `chr_izumi_02_egao.png`
  本編 **2 回**。初出 `00_prologue:88`（二月、北棟三年B組・昼休み） → ほか 1 回
- **③ 緊張** ― `@chr izumi=03` ／ `chr_izumi_03_kinchou.png`
  本編 **1 回**。初出 `50_converge:90`（当日の設計）
- **④ 決意** ― `@chr izumi=04` ／ `chr_izumi_04_ketsui.png`
  本編 **1 回**。初出 `50_converge:59`（「思い出の地形図」制作）
- **⑤ 照れ** ― `@chr izumi=05` ／ `chr_izumi_05_tere.png`
  本編で **未使用**（この番号を呼んでいる行がない）。素材は用意済みなので、脚本に1行足せばそのまま出る
- **⑥ 誇らしげ** ― `@chr izumi=06` ／ `chr_izumi_06_hokorashige.png`
  本編 **1 回**。初出 `70_endings:179`（GOOD END 伊崎＋伊豆見「それぞれの歩幅」）

### `katsuya` ― 塀勝也（へい・かつや／通称ヘイカツ）

- **書き方**: `@chr katsuya=01`〜`@chr katsuya=10`（差分 10 枚・`@chr katsuya all` は非対応、`@chr clear` で全員下げる）
- **名前ボックス**: 塀勝也／色 `#cbb27c`
- **差し替え推奨（このキャラ共通）**: 840×1280 以上／透過PNG／下揃え（`object-position: bottom center`） ／ 現在 白紙 10 枚・実画像 0 枚（各 現 400×300・810B）

- **① 通常（穏やか）** ― `@chr katsuya=01` ／ `chr_katsuya_01_tsuujou.png`
  本編 **2 回**。初出 `00_prologue:106`（二月、北棟三年B組・昼休み（続き）） → ほか 1 回
- **② 微笑** ― `@chr katsuya=02` ／ `chr_katsuya_02_hohoemi.png`
  本編 **6 回**。初出 `60_climax:36`（卒業式前日、放課後の教室） → ほか 5 回
- **③ 遠い目** ― `@chr katsuya=03` ／ `chr_katsuya_03_tooi_me.png`
  本編 **1 回**。初出 `00_prologue:54`（三年間ダイジェスト（共通・スキップ可））
- **④ 驚き** ― `@chr katsuya=04` ／ `chr_katsuya_04_odoroki.png`
  本編 **3 回**。初出 `10_chapter1:30`（地図保管庫） → ほか 2 回
- **⑤ 目を伏せる** ― `@chr katsuya=05` ／ `chr_katsuya_05_me_fuseru.png`
  本編で **未使用**（この番号を呼んでいる行がない）。素材は用意済みなので、脚本に1行足せばそのまま出る
- **⑥ 硬い無表情** ― `@chr katsuya=06` ／ `chr_katsuya_06_kataki_muten.png`
  本編 **3 回**。初出 `10_chapter1:42`（地図保管庫） → ほか 2 回
- **⑦ 回想・目を細める** ― `@chr katsuya=07` ／ `chr_katsuya_07_kaisou_me_soseru.png`
  本編 **2 回**。初出 `60_climax:124`（気づき） → ほか 1 回
- **⑧ 涙をこらえる** ― `@chr katsuya=08` ／ `chr_katsuya_08_namida_koraeru.png`
  本編 **3 回**。初出 `60_climax:96`（回想：最後の日） → ほか 2 回
- **⑨ 泣く** ― `@chr katsuya=09` ／ `chr_katsuya_09_naku.png`
  本編 **1 回**。初出 `60_climax:92`（回想：最後の日）
- **⑩ 晴れやかな笑み** ― `@chr katsuya=10` ／ `chr_katsuya_10_hareyaka_emmi.png`
  本編 **2 回**。初出 `60_climax:176`（締めの言葉） → ほか 1 回

### `kuraishi` ― 倉石暁（くらいし・あきら）

- **書き方**: `@chr kuraishi=01`〜`@chr kuraishi=07`（差分 7 枚・`@chr kuraishi all` は非対応、`@chr clear` で全員下げる）
- **名前ボックス**: 倉石暁／色 `#d6d46e`
- **差し替え推奨（このキャラ共通）**: 840×1280 以上／透過PNG／下揃え（`object-position: bottom center`） ／ 現在 白紙 7 枚・実画像 0 枚（各 現 400×300・810B）

- **① 通常（熱狂）** ― `@chr kuraishi=01` ／ `chr_kuraishi_01_kekkyou.png`
  本編 **4 回**。初出 `00_prologue:81`（二月、北棟三年B組・昼休み） → ほか 3 回
- **② 感激** ― `@chr kuraishi=02` ／ `chr_kuraishi_02_kanshou.png`
  本編 **1 回**。初出 `70_endings:163`（GOOD END 両馬「✝本質✝、その後」）
- **③ 真剣（調査中）** ― `@chr kuraishi=03` ／ `chr_kuraishi_03_chousa_shinken.png`
  本編 **3 回**。初出 `40_route_minamitou_meshino:133`（図書室、書庫） → ほか 2 回
- **④ しょんぼり** ― `@chr kuraishi=04` ／ `chr_kuraishi_04_shonbori.png`
  本編で **未使用**（この番号を呼んでいる行がない）。素材は用意済みなので、脚本に1行足せばそのまま出る
- **⑤ 誇らしげ** ― `@chr kuraishi=05` ／ `chr_kuraishi_05_hokorashige.png`
  本編 **2 回**。初出 `50_converge:68`（「思い出の地形図」制作） → ほか 1 回
- **⑥ 言葉を失う顔** ― `@chr kuraishi=06` ／ `chr_kuraishi_06_kotoba_usinau.png`
  本編 **1 回**。初出 `40_route_minamitou_meshino:138`（図書室、書庫）
- **⑦ 涙ぐむ** ― `@chr kuraishi=07` ／ `chr_kuraishi_07_namidagumu.png`
  本編で **未使用**（この番号を呼んでいる行がない）。素材は用意済みなので、脚本に1行足せばそのまま出る

### `meshino` ― 召野カイト（めしの・かいと）

- **書き方**: `@chr meshino=01`〜`@chr meshino=06`（差分 6 枚・`@chr meshino all` は非対応、`@chr clear` で全員下げる）
- **名前ボックス**: 召野カイト／色 `#e2a8bc`
- **差し替え推奨（このキャラ共通）**: 840×1280 以上／透過PNG／下揃え（`object-position: bottom center`） ／ 現在 白紙 6 枚・実画像 0 枚（各 現 400×300・810B）

- **① 通常** ― `@chr meshino=01` ／ `chr_meshino_01_tsuujou.png`
  本編 **1 回**。初出 `40_route_minamitou_meshino:113`（二見の後押し）
- **② 決め顔** ― `@chr meshino=02` ／ `chr_meshino_02_kimegao.png`
  本編で **未使用**（この番号を呼んでいる行がない）。素材は用意済みなので、脚本に1行足せばそのまま出る
- **③ 照れ** ― `@chr meshino=03` ／ `chr_meshino_03_tere.png`
  本編で **未使用**（この番号を呼んでいる行がない）。素材は用意済みなので、脚本に1行足せばそのまま出る
- **④ 真剣** ― `@chr meshino=04` ／ `chr_meshino_04_shinken.png`
  本編 **2 回**。初出 `40_route_minamitou_meshino:88`（職員室前） → ほか 1 回
- **⑤ 英語ドヤ顔** ― `@chr meshino=05` ／ `chr_meshino_05_eigo_doya.png`
  本編 **1 回**。初出 `50_converge:63`（「思い出の地形図」制作）
- **⑥ しんみり** ― `@chr meshino=06` ／ `chr_meshino_06_shinmiri.png`
  本編 **1 回**。初出 `70_endings:195`（GOOD END 召野「言葉を届ける」）

### `mie` ― 三重県臣（みえ・けんしん）

- **書き方**: `@chr mie=01`〜`@chr mie=10`（差分 10 枚・`@chr mie all` は非対応、`@chr clear` で全員下げる）
- **名前ボックス**: 三重県臣／色 `#7fa9d8`
- **差し替え推奨（このキャラ共通）**: 840×1280 以上／透過PNG／下揃え（`object-position: bottom center`） ／ 現在 白紙 10 枚・実画像 0 枚（各 現 400×300・810B）

- **① 通常（冷笑・半目）** ― `@chr mie=01` ／ `chr_mie_01_reishou.png`
  本編 **19 回**。初出 `00_prologue:106`（二月、北棟三年B組・昼休み（続き）） → ほか 18 回
- **② 「は？」** ― `@chr mie=02` ／ `chr_mie_02_ha.png`
  本編 **4 回**。初出 `00_prologue:74`（二月、北棟三年B組・昼休み） → ほか 3 回
- **③ 動揺** ― `@chr mie=03` ／ `chr_mie_03_douyou.png`
  本編 **1 回**。初出 `20_route_satou_rei:169`（零の中の変化）
- **④ 気まずい沈黙** ― `@chr mie=04` ／ `chr_mie_04_chimatsu.png`
  本編 **8 回**。初出 `10_chapter1:67`（放課後、屋上へ続く階段の踊り場） → ほか 7 回
- **⑤ 照れ** ― `@chr mie=05` ／ `chr_mie_05_tere.png`
  本編で **未使用**（この番号を呼んでいる行がない）。素材は用意済みなので、脚本に1行足せばそのまま出る
- **⑥ 苛立ち混じりの真剣** ― `@chr mie=06` ／ `chr_mie_06_iraduki_shinken.png`
  本編 **2 回**。初出 `10_chapter1:74`（放課後、屋上へ続く階段の踊り場） → ほか 1 回
- **⑦ 本気の真剣** ― `@chr mie=07` ／ `chr_mie_07_honki_shinken.png`
  本編 **7 回**。初出 `10_chapter1:149`（HUB ― ルート選択） → ほか 6 回
- **⑧ 涙をこらえて唇を噛む** ― `@chr mie=08` ／ `chr_mie_08_namida_kamu.png`
  本編で **未使用**（この番号を呼んでいる行がない）。素材は用意済みなので、脚本に1行足せばそのまま出る
- **⑨ 初めての素直な微笑み** ― `@chr mie=09` ／ `chr_mie_09_sunao_hohoemi.png`
  本編 **5 回**。初出 `10_chapter1:137`（選択後共通 ―― 夕方の廊下） → ほか 4 回
- **⑩ 泣き顔** ― `@chr mie=10` ／ `chr_mie_10_nakigao.png`
  本編 **1 回**。初出 `60_climax:131`（気づき）

### `mitsumine` ― 三峰瑠衣（みつみね・るい）

- **書き方**: `@chr mitsumine=01`〜`@chr mitsumine=06`（差分 6 枚・`@chr mitsumine all` は非対応、`@chr clear` で全員下げる）
- **名前ボックス**: 三峰瑠衣／色 `#e2b79e`
- **差し替え推奨（このキャラ共通）**: 840×1280 以上／透過PNG／下揃え（`object-position: bottom center`） ／ 現在 白紙 6 枚・実画像 0 枚（各 現 400×300・810B）

- **① 通常** ― `@chr mitsumine=01` ／ `chr_mitsumine_01_tsuujou.png`
  本編 **2 回**。初出 `40_route_minamitou_meshino:15`（桜並木、まだ蕾） → ほか 1 回
- **② ツッコミ顔** ― `@chr mitsumine=02` ／ `chr_mitsumine_02_tsukkomi.png`
  本編 **1 回**。初出 `40_route_minamitou_meshino:19`（桜並木、まだ蕾）
- **③ 笑顔** ― `@chr mitsumine=03` ／ `chr_mitsumine_03_egao.png`
  本編 **2 回**。初出 `40_route_minamitou_meshino:63`（決意） → ほか 1 回
- **④ 呆れ** ― `@chr mitsumine=04` ／ `chr_mitsumine_04_akire.png`
  本編で **未使用**（この番号を呼んでいる行がない）。素材は用意済みなので、脚本に1行足せばそのまま出る
- **⑤ 優しい顔** ― `@chr mitsumine=05` ／ `chr_mitsumine_05_yasashii.png`
  本編で **未使用**（この番号を呼んでいる行がない）。素材は用意済みなので、脚本に1行足せばそのまま出る
- **⑥ 「は？」（ハモリ専用）** ― `@chr mitsumine=06` ／ `chr_mitsumine_06_ha.png`
  本編 **1 回**。初出 `70_endings:97`（（おまけ）ハモり）

### `naitou` ― 内藤蘭（ないとう・らん）

- **書き方**: `@chr naitou=01`〜`@chr naitou=06`（差分 6 枚・`@chr naitou all` は非対応、`@chr clear` で全員下げる）
- **名前ボックス**: 内藤蘭／色 `#b6d8c6`
- **差し替え推奨（このキャラ共通）**: 840×1280 以上／透過PNG／下揃え（`object-position: bottom center`） ／ 現在 白紙 6 枚・実画像 0 枚（各 現 400×300・810B）

- **① 通常** ― `@chr naitou=01` ／ `chr_naitou_01_tsuujou.png`
  本編 **1 回**。初出 `40_route_minamitou_meshino:32`（南棟三年教室）
- **② 微笑** ― `@chr naitou=02` ／ `chr_naitou_02_hohoemi.png`
  本編 **1 回**。初出 `40_route_minamitou_meshino:36`（南棟三年教室）
- **③ 読書中（伏し目）** ― `@chr naitou=03` ／ `chr_naitou_03_dokusho.png`
  本編で **未使用**（この番号を呼んでいる行がない）。素材は用意済みなので、脚本に1行足せばそのまま出る
- **④ 驚き** ― `@chr naitou=04` ／ `chr_naitou_04_odoroki.png`
  本編 **1 回**。初出 `40_route_minamitou_meshino:46`（茶化した場合）
- **⑤ 優しい目** ― `@chr naitou=05` ／ `chr_naitou_05_yasashii_me.png`
  本編 **1 回**。初出 `40_route_minamitou_meshino:59`（決意）
- **⑥ 少し笑う** ― `@chr naitou=06` ／ `chr_naitou_06_sukoshi_warau.png`
  本編 **1 回**。初出 `70_endings:225`（GOOD END 南棟「境界のない春」）

### `rei` ― 数理零（すうり・れい）

- **書き方**: `@chr rei=01`〜`@chr rei=08`（差分 8 枚・`@chr rei all` は非対応、`@chr clear` で全員下げる）
- **名前ボックス**: 数理零／色 `#d3d9e8`
- **差し替え推奨（このキャラ共通）**: 840×1280 以上／透過PNG／下揃え（`object-position: bottom center`） ／ 現在 白紙 8 枚・実画像 0 枚（各 現 400×300・810B）
- **その人が主役のルート**: B「零編」 ― 面白いの向こう側（開始シーン `b1`）

- **① 通常（涼しい顔）** ― `@chr rei=01` ／ `chr_rei_01_suzushii.png`
  本編 **2 回**。初出 `20_route_satou_rei:117`（放課後、黒板の前） → ほか 1 回
- **② 微笑** ― `@chr rei=02` ／ `chr_rei_02_hohoemi.png`
  本編 **2 回**。初出 `20_route_satou_rei:174`（零の中の変化） → ほか 1 回
- **③ 考え中（顎に手）** ― `@chr rei=03` ／ `chr_rei_03_kangaechuu.png`
  本編で **未使用**（この番号を呼んでいる行がない）。素材は用意済みなので、脚本に1行足せばそのまま出る
- **④ 驚き** ― `@chr rei=04` ／ `chr_rei_04_odoroki.png`
  本編 **1 回**。初出 `20_route_satou_rei:124`（放課後、黒板の前）
- **⑤ 真剣（データと向き合う）** ― `@chr rei=05` ／ `chr_rei_05_data_shinken.png`
  本編 **4 回**。初出 `20_route_satou_rei:128`（放課後、黒板の前） → ほか 3 回
- **⑥ 優しい目** ― `@chr rei=06` ／ `chr_rei_06_yasashii_me.png`
  本編で **未使用**（この番号を呼んでいる行がない）。素材は用意済みなので、脚本に1行足せばそのまま出る
- **⑦ 言葉を選ぶ顔** ― `@chr rei=07` ／ `chr_rei_07_kotoba_erabu.png`
  本編 **1 回**。初出 `20_route_satou_rei:162`（零の中の変化）
- **⑧ 目を潤ませる** ― `@chr rei=08` ／ `chr_rei_08_me_rumaseru.png`
  本編で **未使用**（この番号を呼んでいる行がない）。素材は用意済みなので、脚本に1行足せばそのまま出る

### `ryoma` ― 両馬二郎（りょうま・じろう）

- **書き方**: `@chr ryoma=01`〜`@chr ryoma=09`（差分 9 枚・`@chr ryoma all` は非対応、`@chr clear` で全員下げる）
- **名前ボックス**: 両馬二郎／色 `#e2853f`
- **差し替え推奨（このキャラ共通）**: 840×1280 以上／透過PNG／下揃え（`object-position: bottom center`） ／ 現在 白紙 9 枚・実画像 0 枚（各 現 400×300・810B）
- **その人が主役のルート**: D「両馬編」 ― 祖父と✝本質✝（開始シーン `d1`）

- **① 通常** ― `@chr ryoma=01` ／ `chr_ryoma_01_tsuujou.png`
  本編 **4 回**。初出 `00_prologue:81`（二月、北棟三年B組・昼休み） → ほか 3 回
- **② ニヤリ** ― `@chr ryoma=02` ／ `chr_ryoma_02_niyari.png`
  本編 **5 回**。初出 `00_prologue:74`（二月、北棟三年B組・昼休み） → ほか 4 回
- **③ 全力** ― `@chr ryoma=03` ／ `chr_ryoma_03_zenryoku.png`
  本編で **未使用**（この番号を呼んでいる行がない）。素材は用意済みなので、脚本に1行足せばそのまま出る
- **④ 急に真顔** ― `@chr ryoma=04` ／ `chr_ryoma_04_kinimo_majime.png`
  本編 **6 回**。初出 `00_prologue:106`（二月、北棟三年B組・昼休み（続き）） → ほか 5 回
- **⑤ しょんぼり** ― `@chr ryoma=05` ／ `chr_ryoma_05_shonbori.png`
  本編 **1 回**。初出 `10_chapter1:160`（まだ聞けていない話がある気がする）
- **⑥ 泣き笑い** ― `@chr ryoma=06` ／ `chr_ryoma_06_nakiwarai.png`
  本編 **4 回**。初出 `30_route_terachi_ryoma:97`（両馬の家、夕方） → ほか 3 回
- **⑦ 真剣な決意顔** ― `@chr ryoma=07` ／ `chr_ryoma_07_shinken_ketsui.png`
  本編 **4 回**。初出 `10_chapter1:149`（HUB ― ルート選択） → ほか 3 回
- **⑧ 照れ隠しで頭をかく** ― `@chr ryoma=08` ／ `chr_ryoma_08_terekakushi.png`
  本編 **2 回**。初出 `30_route_terachi_ryoma:88`（両馬の家、夕方） → ほか 1 回
- **⑨ 号泣** ― `@chr ryoma=09` ／ `chr_ryoma_09_goukyuu.png`
  本編 **1 回**。初出 `30_route_terachi_ryoma:120`（祖父の口癖）

### `sakura` ― 櫻優（さくら・ゆう）

- **書き方**: `@chr sakura=01`〜`@chr sakura=06`（差分 6 枚・`@chr sakura all` は非対応、`@chr clear` で全員下げる）
- **名前ボックス**: 櫻優／色 `#a8c8e0`
- **差し替え推奨（このキャラ共通）**: 840×1280 以上／透過PNG／下揃え（`object-position: bottom center`） ／ 現在 白紙 6 枚・実画像 0 枚（各 現 400×300・810B）

- **① 通常** ― `@chr sakura=01` ／ `chr_sakura_01_tsuujou.png`
  本編で **未使用**（この番号を呼んでいる行がない）。素材は用意済みなので、脚本に1行足せばそのまま出る
- **② 真剣（研究者モード）** ― `@chr sakura=02` ／ `chr_sakura_02_kenkyuusha.png`
  本編 **1 回**。初出 `40_route_minamitou_meshino:32`（南棟三年教室）
- **③ 照れ** ― `@chr sakura=03` ／ `chr_sakura_03_tere.png`
  本編で **未使用**（この番号を呼んでいる行がない）。素材は用意済みなので、脚本に1行足せばそのまま出る
- **④ 動揺** ― `@chr sakura=04` ／ `chr_sakura_04_douyou.png`
  本編で **未使用**（この番号を呼んでいる行がない）。素材は用意済みなので、脚本に1行足せばそのまま出る
- **⑤ 笑顔** ― `@chr sakura=05` ／ `chr_sakura_05_egao.png`
  本編 **1 回**。初出 `40_route_minamitou_meshino:65`（決意）
- **⑥ 柔らかい表情** ― `@chr sakura=06` ／ `chr_sakura_06_yawarakai.png`
  本編 **1 回**。初出 `70_endings:225`（GOOD END 南棟「境界のない春」）

### `satou` ― 砂糖東洋（さとう・とうよう）

- **書き方**: `@chr satou=01`〜`@chr satou=08`（差分 8 枚・`@chr satou all` は非対応、`@chr clear` で全員下げる）
- **名前ボックス**: 砂糖東洋／色 `#7fd0c8`
- **差し替え推奨（このキャラ共通）**: 840×1280 以上／透過PNG／下揃え（`object-position: bottom center`） ／ 現在 白紙 8 枚・実画像 0 枚（各 現 400×300・810B）
- **その人が主役のルート**: A「砂糖編」 ― 窓の外の続き（開始シーン `a1`）

- **① 通常（ゲーム画面凝視）** ― `@chr satou=01` ／ `chr_satou_01_game_shuuchuu.png`
  本編 **3 回**。初出 `00_prologue:88`（二月、北棟三年B組・昼休み） → ほか 2 回
- **② 無表情（素）** ― `@chr satou=02` ／ `chr_satou_02_muten.png`
  本編 **3 回**。初出 `20_route_satou_rei:25`（放課後、教室に残る砂糖） → ほか 2 回
- **③ 驚き（画面から顔を上げる）** ― `@chr satou=03` ／ `chr_satou_03_kao_ageta.png`
  本編 **1 回**。初出 `20_route_satou_rei:53`（正面から頼んだ方）
- **④ 照れ隠しでそっぽを向く** ― `@chr satou=04` ／ `chr_satou_04_soppo.png`
  本編 **1 回**。初出 `20_route_satou_rei:19`（放課後、教室に残る砂糖）
- **⑤ 真剣にカメラを構える顔** ― `@chr satou=05` ／ `chr_satou_05_camera.png`
  本編 **2 回**。初出 `20_route_satou_rei:77`（砂糖のスマートフォン） → ほか 1 回
- **⑥ 微笑み（レア）** ― `@chr satou=06` ／ `chr_satou_06_hohoemi.png`
  本編 **2 回**。初出 `20_route_satou_rei:98`（砂糖のスマートフォン） → ほか 1 回
- **⑦ 言葉に詰まる顔** ― `@chr satou=07` ／ `chr_satou_07_tsumaru.png`
  本編 **2 回**。初出 `20_route_satou_rei:88`（砂糖のスマートフォン） → ほか 1 回
- **⑧ 目に光るものを堪える顔** ― `@chr satou=08` ／ `chr_satou_08_hikari_koraeru.png`
  本編 **1 回**。初出 `60_climax:116`（窓の外の五秒）

### `terachi` ― 寺地星（てらち・せい）

- **書き方**: `@chr terachi=01`〜`@chr terachi=08`（差分 8 枚・`@chr terachi all` は非対応、`@chr clear` で全員下げる）
- **名前ボックス**: 寺地星／色 `#9ec98f`
- **差し替え推奨（このキャラ共通）**: 840×1280 以上／透過PNG／下揃え（`object-position: bottom center`） ／ 現在 白紙 8 枚・実画像 0 枚（各 現 400×300・810B）
- **その人が主役のルート**: C「寺地編」 ― 最後の朗読、まだ早いけど（開始シーン `c1`）

- **① 通常（眠そう・淡々）** ― `@chr terachi=01` ／ `chr_terachi_01_nemusou.png`
  本編 **2 回**。初出 `30_route_terachi_ryoma:12`（放課後、誰もいない教室） → ほか 1 回
- **② 困惑して固まる** ― `@chr terachi=02` ／ `chr_terachi_02_komatte_kataaru.png`
  本編 **1 回**。初出 `30_route_terachi_ryoma:32`（正面から頼んだ方）
- **③ 真剣な配信者の顔** ― `@chr terachi=03` ／ `chr_terachi_03_hansya_shinken.png`
  本編 **1 回**。初出 `30_route_terachi_ryoma:17`（放課後、誰もいない教室）
- **④ 嬉しい** ― `@chr terachi=04` ／ `chr_terachi_04_ureshii.png`
  本編 **1 回**。初出 `70_endings:145`（GOOD END 寺地「配信は続く」）
- **⑤ 泣きそうなのを堪える** ― `@chr terachi=05` ／ `chr_terachi_05_nakisou_koraeru.png`
  本編で **未使用**（この番号を呼んでいる行がない）。素材は用意済みなので、脚本に1行足せばそのまま出る
- **⑥ マイク前の決意顔** ― `@chr terachi=06` ／ `chr_terachi_06_maiku_no_ketsui.png`
  本編 **3 回**。初出 `30_route_terachi_ryoma:57`（三年分の紙） → ほか 2 回
- **⑦ 声を震わせながら読み上げる** ― `@chr terachi=07` ／ `chr_terachi_07_yomiage.png`
  本編で **未使用**（この番号を呼んでいる行がない）。素材は用意済みなので、脚本に1行足せばそのまま出る
- **⑧ 涙** ― `@chr terachi=08` ／ `chr_terachi_08_namida.png`
  本編 **1 回**。初出 `60_climax:168`（最後の朗読）

### `wakaki-katsuya` ― 若き日の勝也（わかき・かつや／回想の声）

- **書き方**: `@chr wakaki-katsuya=01`〜`@chr wakaki-katsuya=02`（差分 2 枚・`@chr wakaki-katsuya all` は非対応、`@chr clear` で全員下げる）
- **名前ボックス**: 若き日の勝也／色 `#c0a888`
- **差し替え推奨（このキャラ共通）**: 840×1280 以上／透過PNG／下揃え（`object-position: bottom center`） ／ 現在 白紙 2 枚・実画像 0 枚（各 現 400×300・810B）

- **① 笑っている** ― `@chr wakaki-katsuya=01` ／ `chr_wakaki-katsuya_01_waratteiru.png`
  本編で **未使用**（この番号を呼んでいる行がない）。素材は用意済みなので、脚本に1行足せばそのまま出る
- **② 呆然としている** ― `@chr wakaki-katsuya=02` ／ `chr_wakaki-katsuya_02_bousen.png`
  本編で **未使用**（この番号を呼んでいる行がない）。素材は用意済みなので、脚本に1行足せばそのまま出る

## 差し替え手順（立ち絵共通）

1. `assets/chr/` に**同名・透過PNG**で上書き（840×1280 推奨／下揃え）
2. 台帳の `placeholder` を `false` に → シルエット補完（`figureSVG`）が消えて実画像になる
3. `sw.js` の `CACHE` を上げる
4. 白背景のまま置きたいときだけ CONFIG「画像合成」= multiply（ `#stage[data-blend="multiply"] .chr img` にだけ掛かる）

### 演出（JS/CSS 側で自動）

| 効く場所 | 挙動 |
|---|---|
| `data-enter="left/right/center"` | 入場スライド＋ブラー（88ms ずつスタッガ） |
| `chrBreathe` 8.4s | **`translate` だけ**動かす（ぼかしの再計算を毎フレームやめた）。CONFIG「立ち絵の動き」で lite/off/full |
| `.talk` | `chrTalkSettle` .5s 単発（旧来は .34s 無限＝再ラスタ源だった） |
| `.dim` | 非話者を明度60%・彩度52%・0.985 |
| 3人時 | 中央 1.016／左右 0.988 で奥行き |
