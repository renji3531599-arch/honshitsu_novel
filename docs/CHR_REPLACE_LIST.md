# 立ち絵 差し替え一覧

**78 枚を「どのファイル名でどこに置くか」だけにした実務一覧**。正本は台帳 `data/assets.json`。
置くファイル名は **台帳ID + 拡張子**（例 `chr_katsuya_01_tsuujou.png`）。台帳の `id` と `file` のファイル名部分は全行一致しています。
旧名（`chr_katsuya_01_tsujou.png` のような短縮ローマ字）は **2026-09-13 に全廃**。版A（`assets/chr/`）も版B（`game/js/assets_manifest.js` → `game/assets/img/`）も**同じ新名**で解決するので、旧名の一覧は不要になりました。

> 生成: `node tools/gen_asset_md.mjs`（生成日は入れない ― 出力をバイト単位で再現可能にして CI の差分検査を安定させる）／総数 78 ファイル／正本は台帳 `data/assets.json`
> ここに並ぶ説明は台帳と本編DSLから機械的に拾っている。直すべきは台帳と脚本のほう。

## 先にまとめ

- 置く場所: **`assets/chr/`**（版A）／版B も動かすなら同じ名前を `game/assets/img/` にも
- 実画像にする条件: 台帳の `"placeholder": true` → `false`（**ファイルとフラグは必ずセット**）
  ― まとめてやるなら `node tools/sync_placeholder.mjs`（実在ファイルを検出して自動で倒す。寸法・透過・容量も見る）
- そのあと `sw.js` の `CACHE`（現在 `honshitsu-v8`）を上げる（`--bump` で自動）
- 現在の状態: 実画像 **51 枚**・未配置 **27 枚**
- 寸法: **840×1280（21:32）・透過／全身を切りたくなければ 840×1120（3:4）。最低 672×1024** ― 構図の注意（上が 12.1% 切れる／下 35% はテキスト窓）は `docs/ART_SPEC.md`

## 一覧（台帳順＝スロット順）

| No | 置くファイル名（`assets/chr/` ＝ 台帳ID + `.png`） | `@chr` の書き方 | 表情 | 本編の使用 | 初出 | 状態 |
|---:|---|---|---|---:|---|---|
| 1 | `chr_katsuya_01_tsuujou.png` | `@chr katsuya=01` | 塀勝也 通常（穏やか） | 2 回 | `00_prologue.txt:106` | ● 実画像 |
| 2 | `chr_katsuya_02_hohoemi.png` | `@chr katsuya=02` | 塀勝也 微笑 | 6 回 | `60_climax.txt:36` | ● 実画像 |
| 3 | `chr_katsuya_03_tooi_me.png` | `@chr katsuya=03` | 塀勝也 遠い目 | 1 回 | `00_prologue.txt:54` | ● 実画像 |
| 4 | `chr_katsuya_04_odoroki.png` | `@chr katsuya=04` | 塀勝也 驚き | 3 回 | `10_chapter1.txt:30` | ● 実画像 |
| 5 | `chr_katsuya_06_katai_muhyoujou.png` | `@chr katsuya=06` | 塀勝也 硬い無表情 | 3 回 | `10_chapter1.txt:42` | ● 実画像 |
| 6 | `chr_katsuya_07_kaisou_me_hosomeru.png` | `@chr katsuya=07` | 塀勝也 回想・目を細める | 2 回 | `60_climax.txt:124` | ● 実画像 |
| 7 | `chr_katsuya_08_namida_koraeru.png` | `@chr katsuya=08` | 塀勝也 涙をこらえる | 3 回 | `60_climax.txt:96` | ● 実画像 |
| 8 | `chr_katsuya_09_naku.png` | `@chr katsuya=09` | 塀勝也 泣く | 1 回 | `60_climax.txt:92` | ● 実画像 |
| 9 | `chr_katsuya_10_hareyaka_emi.png` | `@chr katsuya=10` | 塀勝也 晴れやかな笑み | 2 回 | `60_climax.txt:176` | ● 実画像 |
| 10 | `chr_ryoma_01_tsuujou.png` | `@chr ryoma=01` | 両馬二郎 通常 | 4 回 | `00_prologue.txt:81` | ● 実画像 |
| 11 | `chr_ryoma_02_niyari.png` | `@chr ryoma=02` | 両馬二郎 ニヤリ | 5 回 | `00_prologue.txt:74` | ● 実画像 |
| 12 | `chr_ryoma_04_kyuu_magao.png` | `@chr ryoma=04` | 両馬二郎 急に真顔 | 6 回 | `00_prologue.txt:106` | ● 実画像 |
| 13 | `chr_ryoma_05_shonbori.png` | `@chr ryoma=05` | 両馬二郎 しょんぼり | 1 回 | `10_chapter1.txt:160` | ● 実画像 |
| 14 | `chr_ryoma_06_nakiwarai.png` | `@chr ryoma=06` | 両馬二郎 泣き笑い | 4 回 | `30_route_terachi_ryoma.txt:97` | ● 実画像 |
| 15 | `chr_ryoma_07_shinken_ketsui.png` | `@chr ryoma=07` | 両馬二郎 真剣な決意顔 | 4 回 | `10_chapter1.txt:149` | ● 実画像 |
| 16 | `chr_ryoma_08_terekakushi.png` | `@chr ryoma=08` | 両馬二郎 照れ隠しで頭をかく | 2 回 | `30_route_terachi_ryoma.txt:88` | ● 実画像 |
| 17 | `chr_ryoma_09_goukyuu.png` | `@chr ryoma=09` | 両馬二郎 号泣 | 1 回 | `30_route_terachi_ryoma.txt:120` | ● 実画像 |
| 18 | `chr_mie_01_reishou.png` | `@chr mie=01` | 三重県臣 通常（冷笑・半目） | 19 回 | `00_prologue.txt:106` | ● 実画像 |
| 19 | `chr_mie_02_ha.png` | `@chr mie=02` | 三重県臣 「は？」 | 4 回 | `00_prologue.txt:74` | ● 実画像 |
| 20 | `chr_mie_03_douyou.png` | `@chr mie=03` | 三重県臣 動揺 | 1 回 | `20_route_satou_rei.txt:169` | ● 実画像 |
| 21 | `chr_mie_04_kimazui_chinmoku.png` | `@chr mie=04` | 三重県臣 気まずい沈黙 | 8 回 | `10_chapter1.txt:67` | ● 実画像 |
| 22 | `chr_mie_06_iradachi_shinken.png` | `@chr mie=06` | 三重県臣 苛立ち混じりの真剣 | 2 回 | `10_chapter1.txt:74` | ● 実画像 |
| 23 | `chr_mie_07_honki_shinken.png` | `@chr mie=07` | 三重県臣 本気の真剣 | 7 回 | `10_chapter1.txt:149` | ● 実画像 |
| 24 | `chr_mie_09_sunao_hohoemi.png` | `@chr mie=09` | 三重県臣 初めての素直な微笑み | 5 回 | `10_chapter1.txt:137` | ● 実画像 |
| 25 | `chr_mie_10_nakigao.png` | `@chr mie=10` | 三重県臣 泣き顔 | 1 回 | `60_climax.txt:131` | ● 実画像 |
| 26 | `chr_terachi_01_nemusou.png` | `@chr terachi=01` | 寺地星 通常（眠そう・淡々） | 2 回 | `30_route_terachi_ryoma.txt:12` | ● 実画像 |
| 27 | `chr_terachi_02_konwaku_katamaru.png` | `@chr terachi=02` | 寺地星 困惑して固まる | 1 回 | `30_route_terachi_ryoma.txt:32` | ● 実画像 |
| 28 | `chr_terachi_03_haishin_shinken.png` | `@chr terachi=03` | 寺地星 真剣な配信者の顔 | 1 回 | `30_route_terachi_ryoma.txt:17` | ● 実画像 |
| 29 | `chr_terachi_04_ureshii.png` | `@chr terachi=04` | 寺地星 嬉しい | 1 回 | `70_endings.txt:145` | ● 実画像 |
| 30 | `chr_terachi_06_maiku_no_ketsui.png` | `@chr terachi=06` | 寺地星 マイク前の決意顔 | 3 回 | `30_route_terachi_ryoma.txt:57` | ● 実画像 |
| 31 | `chr_terachi_08_namida.png` | `@chr terachi=08` | 寺地星 涙 | 1 回 | `60_climax.txt:168` | ● 実画像 |
| 32 | `chr_satou_01_game_gyoushi.png` | `@chr satou=01` | 砂糖東洋 通常（ゲーム画面凝視） | 3 回 | `00_prologue.txt:88` | ● 実画像 |
| 33 | `chr_satou_02_muhyoujou.png` | `@chr satou=02` | 砂糖東洋 無表情（素） | 3 回 | `20_route_satou_rei.txt:25` | ● 実画像 |
| 34 | `chr_satou_03_kao_ageta.png` | `@chr satou=03` | 砂糖東洋 驚き（画面から顔を上げる） | 1 回 | `20_route_satou_rei.txt:53` | ● 実画像 |
| 35 | `chr_satou_04_soppo.png` | `@chr satou=04` | 砂糖東洋 照れ隠しでそっぽを向く | 1 回 | `20_route_satou_rei.txt:19` | ● 実画像 |
| 36 | `chr_satou_05_camera.png` | `@chr satou=05` | 砂糖東洋 真剣にカメラを構える顔 | 2 回 | `20_route_satou_rei.txt:77` | ● 実画像 |
| 37 | `chr_satou_06_hohoemi.png` | `@chr satou=06` | 砂糖東洋 微笑み（レア） | 2 回 | `20_route_satou_rei.txt:98` | ● 実画像 |
| 38 | `chr_satou_07_tsumaru.png` | `@chr satou=07` | 砂糖東洋 言葉に詰まる顔 | 2 回 | `20_route_satou_rei.txt:88` | ● 実画像 |
| 39 | `chr_satou_08_me_hikari_koraeru.png` | `@chr satou=08` | 砂糖東洋 目に光るものを堪える顔 | 1 回 | `60_climax.txt:116` | ● 実画像 |
| 40 | `chr_rei_01_suzushii.png` | `@chr rei=01` | 数理零 通常（涼しい顔） | 2 回 | `20_route_satou_rei.txt:117` | 未配置 |
| 41 | `chr_rei_02_hohoemi.png` | `@chr rei=02` | 数理零 微笑 | 2 回 | `20_route_satou_rei.txt:174` | 未配置 |
| 42 | `chr_rei_04_odoroki.png` | `@chr rei=04` | 数理零 驚き | 1 回 | `20_route_satou_rei.txt:124` | 未配置 |
| 43 | `chr_rei_05_data_shinken.png` | `@chr rei=05` | 数理零 真剣（データと向き合う） | 4 回 | `20_route_satou_rei.txt:128` | 未配置 |
| 44 | `chr_rei_07_kotoba_erabu.png` | `@chr rei=07` | 数理零 言葉を選ぶ顔 | 1 回 | `20_route_satou_rei.txt:162` | 未配置 |
| 45 | `chr_izaki_01_tsuujou.png` | `@chr izaki=01` | 伊崎 通常 | 1 回 | `00_prologue.txt:88` | 未配置 |
| 46 | `chr_izaki_02_egao.png` | `@chr izaki=02` | 伊崎 笑顔 | 2 回 | `00_prologue.txt:94` | 未配置 |
| 47 | `chr_izaki_04_shikiri.png` | `@chr izaki=04` | 伊崎 真剣（仕切る顔） | 3 回 | `50_converge.txt:19` | 未配置 |
| 48 | `chr_izaki_06_shimijimi_hohoemi.png` | `@chr izaki=06` | 伊崎 しみじみとした微笑み | 1 回 | `70_endings.txt:179` | 未配置 |
| 49 | `chr_izumi_02_egao.png` | `@chr izumi=02` | 伊豆見 笑顔 | 2 回 | `00_prologue.txt:88` | 未配置 |
| 50 | `chr_izumi_03_kinchou.png` | `@chr izumi=03` | 伊豆見 緊張 | 1 回 | `50_converge.txt:90` | 未配置 |
| 51 | `chr_izumi_04_ketsui.png` | `@chr izumi=04` | 伊豆見 決意 | 1 回 | `50_converge.txt:59` | 未配置 |
| 52 | `chr_izumi_06_hokorashige.png` | `@chr izumi=06` | 伊豆見 誇らしげ | 1 回 | `70_endings.txt:179` | 未配置 |
| 53 | `chr_meshino_01_tsuujou.png` | `@chr meshino=01` | 召野カイト 通常 | 1 回 | `40_route_minamitou_meshino.txt:113` | 未配置 |
| 54 | `chr_meshino_04_shinken.png` | `@chr meshino=04` | 召野カイト 真剣 | 2 回 | `40_route_minamitou_meshino.txt:88` | 未配置 |
| 55 | `chr_meshino_05_eigo_doya.png` | `@chr meshino=05` | 召野カイト 英語ドヤ顔 | 1 回 | `50_converge.txt:63` | 未配置 |
| 56 | `chr_meshino_06_shinmiri.png` | `@chr meshino=06` | 召野カイト しんみり | 1 回 | `70_endings.txt:195` | 未配置 |
| 57 | `chr_kuraishi_01_nekkyou.png` | `@chr kuraishi=01` | 倉石暁 通常（熱狂） | 4 回 | `00_prologue.txt:81` | 未配置 |
| 58 | `chr_kuraishi_02_kangeki.png` | `@chr kuraishi=02` | 倉石暁 感激 | 1 回 | `70_endings.txt:163` | 未配置 |
| 59 | `chr_kuraishi_03_chousa_shinken.png` | `@chr kuraishi=03` | 倉石暁 真剣（調査中） | 3 回 | `40_route_minamitou_meshino.txt:133` | 未配置 |
| 60 | `chr_kuraishi_05_hokorashige.png` | `@chr kuraishi=05` | 倉石暁 誇らしげ | 2 回 | `50_converge.txt:68` | 未配置 |
| 61 | `chr_kuraishi_06_kotoba_ushinau.png` | `@chr kuraishi=06` | 倉石暁 言葉を失う顔 | 1 回 | `40_route_minamitou_meshino.txt:138` | 未配置 |
| 62 | `chr_futami_01_tsuujou.png` | `@chr futami=01` | 二見玲子 通常 | 1 回 | `40_route_minamitou_meshino.txt:88` | 未配置 |
| 63 | `chr_futami_03_shinpai.png` | `@chr futami=03` | 二見玲子 心配顔 | 1 回 | `40_route_minamitou_meshino.txt:104` | 未配置 |
| 64 | `chr_futami_04_itazura.png` | `@chr futami=04` | 二見玲子 いたずらっぽい笑み | 1 回 | `40_route_minamitou_meshino.txt:113` | 未配置 |
| 65 | `chr_futami_05_yokogao.png` | `@chr futami=05` | 二見玲子 しんみりした横顔 | 1 回 | `40_route_minamitou_meshino.txt:93` | 未配置 |
| 66 | `chr_sakura_02_kenkyuusha.png` | `@chr sakura=02` | 櫻優 真剣（研究者モード） | 1 回 | `40_route_minamitou_meshino.txt:32` | ● 実画像 |
| 67 | `chr_sakura_05_egao.png` | `@chr sakura=05` | 櫻優 笑顔 | 1 回 | `40_route_minamitou_meshino.txt:65` | ● 実画像 |
| 68 | `chr_sakura_06_yawarakai.png` | `@chr sakura=06` | 櫻優 柔らかい表情 | 1 回 | `70_endings.txt:225` | ● 実画像 |
| 69 | `chr_mitsumine_01_tsuujou.png` | `@chr mitsumine=01` | 三峰瑠衣 通常 | 2 回 | `40_route_minamitou_meshino.txt:15` | ● 実画像 |
| 70 | `chr_mitsumine_02_tsukkomi.png` | `@chr mitsumine=02` | 三峰瑠衣 ツッコミ顔 | 1 回 | `40_route_minamitou_meshino.txt:19` | ● 実画像 |
| 71 | `chr_mitsumine_03_egao.png` | `@chr mitsumine=03` | 三峰瑠衣 笑顔 | 2 回 | `40_route_minamitou_meshino.txt:63` | ● 実画像 |
| 72 | `chr_mitsumine_06_ha.png` | `@chr mitsumine=06` | 三峰瑠衣 「は？」（ハモリ専用） | 1 回 | `70_endings.txt:97` | ● 実画像 |
| 73 | `chr_naitou_01_tsuujou.png` | `@chr naitou=01` | 内藤蘭 通常 | 1 回 | `40_route_minamitou_meshino.txt:32` | ● 実画像 |
| 74 | `chr_naitou_02_hohoemi.png` | `@chr naitou=02` | 内藤蘭 微笑 | 1 回 | `40_route_minamitou_meshino.txt:36` | ● 実画像 |
| 75 | `chr_naitou_04_odoroki.png` | `@chr naitou=04` | 内藤蘭 驚き | 1 回 | `40_route_minamitou_meshino.txt:46` | ● 実画像 |
| 76 | `chr_naitou_05_yasashii_me.png` | `@chr naitou=05` | 内藤蘭 優しい目 | 1 回 | `40_route_minamitou_meshino.txt:59` | ● 実画像 |
| 77 | `chr_naitou_06_sukoshi_warau.png` | `@chr naitou=06` | 内藤蘭 少し笑う | 1 回 | `70_endings.txt:225` | ● 実画像 |
| 78 | `chr_inaba_01_furushashin_hohoemi.png` | `@chr inaba=01` | 稲葉悌二 古写真の中の柔らかい笑み | 1 回 | `60_climax.txt:66` | 未配置 |

## 読み方

- **本編の使用** = 脚本（`data/script/*.txt`）の `@chr slug=NN` が出てくる行数。0 回の差分は「枠だけ確保」なので、出すには脚本に `@chr` を足す
- **初出** = 最初に呼ばれる行。`ファイル名:行番号`
- **状態** = 台帳の `placeholder`。`未配置` の間は `js/visual.js` の `figureSVG()` がシルエットを描きます
- 表情の詳しい意図・キャラごとの差分構成は `assets/chr/README.md`
