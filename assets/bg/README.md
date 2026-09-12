# BG — 背景（25枚）

`assets/bg/` の背景スロット。**1枚ずつ「どのシーンで何回」「どの時間帯トーンか」**まで書く。
背景25枚は**実画像を収録済み**（2026-09-12時点）。実ファイルが無いスロットは `js/visual.js` の `backdropSVG()` が等高線下地で補完。

> 生成: `node tools/gen_asset_md.mjs`（2026-09-12）／総数 25 ファイル／正本は台帳 `data/assets.json`
> ここに並ぶ説明は台帳と本編DSLから機械的に拾っている。直すべきは台帳と脚本のほう。

## 先にまとめ

- 使用 24 枚 ／ 未使用 1 枚（ `title_key.jpg` などエンジン専有のものを含む）
- `@bg` 指定は**ファイル名stem**（ `bg_hokutou_kyoshitsu_asa` ）でも**台帳ID**（ `BG01` ）でも書ける
- 切り替えは 2枚スラブのクロスディゾルブ（既定1.15秒）。実画像は**隠れた側で `decode()` してから**受渡すので暗転しない

## 早見表

| ID | ひとこと | 使用 | トーン |
|---|---|---|---|
| `BG01` | 北棟三年B組教室・朝 | 1箇所 | asa |
| `BG02` | 北棟三年B組教室・昼休み | 8箇所 | hiru |
| `BG03` | 北棟三年B組教室・夕方（茜色・逆光） | 16箇所 | yuugata |
| `BG04` | 北棟三年B組教室・夜（サプライズ準備） | 8箇所 | yoru |
| `BG05` | 北棟廊下 | 1箇所 | — |
| `BG06` | 階段の踊り場（掲示物あり） | 2箇所 | — |
| `BG07` | 職員室 | 2箇所 | — |
| `BG08` | 地図保管庫 | 1箇所 | — |
| `BG09` | 図書室 | 2箇所 | — |
| `BG10` | 図書室奥の書庫（埃っぽい） | 2箇所 | — |
| `BG11` | 翠湖のほとり | 2箇所 | — |
| `BG12` | 文化祭/謝恩会準備中の校庭 | 1箇所 | — |
| `BG13` | 体育館（謝恩会当日） | 1箇所 | — |
| `BG14` | 屋上 | 1箇所 | — |
| `BG15` | 通学電車の車窓（砂糖視点） | 2箇所 | — |
| `BG16` | 南棟と北棟を繋ぐ桜並木（蕾） | 3箇所 | — |
| `BG17` | 卒業式会場 | 2箇所 | — |
| `BG18` | 南棟三年教室 | 3箇所 | — |
| `BG19` | 両馬の家・祖父の遺影がある部屋 | 2箇所 | — |
| `BG20` | 回想・ハワイの溶岩台地 | 1箇所 | — |
| `BG21` | 回想・稲葉と勝也がいた山（褪色調） | 1箇所 | — |
| `BG22` | 回想・大学時代の野外調査ベースキャンプ | 1箇所 | — |
| `BG23` | エピローグ・卒業後の春、もぬけの殻の教室 | 2箇所 | haru |
| `BG24` | TRUE END後日談・数年後の同じ教室 | 1箇所 | suunengo |
| `title_key` | タイトルキービジュアル（夕方の教室・地図筒・古写真） | — | — |

---

## 1枚ずつの解説

### `BG01` ― 北棟三年B組教室・朝

- **ファイル**: `assets/bg/bg_hokutou_kyoshitsu_asa.png`（現 1672×940・1832KB）
- **差し替え推奨**: 1600×900（16:9）／JPEG か PNG／`object-fit: cover` で全画面
- **状態**: ● 実画像が乗っている
- **時間帯トーン**: `kyoshitsu/asa` → 朝（明るい寒色・光差し ON）（`js/visual.js MOODS`）、`@bg` 指定で自動追従
- **補完SVG**: 出ない（実画像が乗っているので `#stage[data-art="real"]` になり、SVG側は空になる）
- **使用回数**: 本編 1 箇所
  - 三度目の春、まだ来ない / シーン `prologue_002`「三年間ダイジェスト（共通・スキップ可）」 ― `00_prologue.txt:28`

### `BG02` ― 北棟三年B組教室・昼休み

- **ファイル**: `assets/bg/bg_hokutou_kyoshitsu_hiru.png`（現 1672×940・1959KB）
- **差し替え推奨**: 1600×900（16:9）／JPEG か PNG／`object-fit: cover` で全画面
- **状態**: ● 実画像が乗っている
- **時間帯トーン**: `kyoshitsu/hiru` → 昼（ニュートラル・光 ON）（`js/visual.js MOODS`）、`@bg` 指定で自動追従
- **補完SVG**: 出ない（実画像が乗っているので `#stage[data-art="real"]` になり、SVG側は空になる）
- **使用回数**: 本編 8 箇所
  - 三度目の春、まだ来ない / シーン `prologue_002`「三年間ダイジェスト（共通・スキップ可）」 ― `00_prologue.txt:42`
  - 三度目の春、まだ来ない / シーン `prologue_003`「二月、北棟三年B組・昼休み」 ― `00_prologue.txt:69`
  - 三度目の春、まだ来ない / シーン `prologue_004`「二月、北棟三年B組・昼休み（続き）」 ― `00_prologue.txt:100`
  - 零編 ― 面白いの向こう側 / シーン `b1`「放課後、黒板の前」 ― `20_route_satou_rei.txt:115`
  - 零編 ― 面白いの向こう側 / シーン `b1_hiku`「引き下がった方」 ― `20_route_satou_rei.txt:136`
  - …ほか 3 箇所
- **この背景まわりのCG**: `cg_end_comedy`

### `BG03` ― 北棟三年B組教室・夕方（茜色・逆光）

- **ファイル**: `assets/bg/bg_hokutou_kyoshitsu_yuugata.png`（現 1672×940・1878KB）
- **差し替え推奨**: 1600×900（16:9）／JPEG か PNG／`object-fit: cover` で全画面
- **状態**: ● 実画像が乗っている
- **時間帯トーン**: `kyoshitsu/yuugata` → 夕方（オレンジ・光 WARM）（`js/visual.js MOODS`）、`@bg` 指定で自動追従
- **補完SVG**: 出ない（実画像が乗っているので `#stage[data-art="real"]` になり、SVG側は空になる）
- **使用回数**: 本編 16 箇所
  - 三度目の春、まだ来ない / シーン `prologue_002`「三年間ダイジェスト（共通・スキップ可）」 ― `00_prologue.txt:50`
  - 差出人不明の写真 / シーン `c005c_matsu`「誰にも言わない」 ― `10_chapter1.txt:102`
  - 差出人不明の写真 / シーン `hub_open`「HUB ― ルート選択」 ― `10_chapter1.txt:146`
  - 砂糖編 ― 窓の外の続き / シーン `a1`「放課後、教室に残る砂糖」 ― `20_route_satou_rei.txt:10`
  - 砂糖編 ― 窓の外の続き / シーン `a1_hara`「気を遣った方」 ― `20_route_satou_rei.txt:39`
  - …ほか 11 箇所
- **この背景まわりのCG**: `cg_mado_ushiro_miteteta` / `cg_yuugata_madobe_katsuya` / `cg_nagai_chinmoku` / `cg_mado_gawa_no_houkoku` / `cg_seito_wo_miwatasu` / `cg_hitorizutsu_no_kotoba` / `cg_hareyaka_na_emi` / `cg_end_normal` / `cg_end_bittersweet`

### `BG04` ― 北棟三年B組教室・夜（サプライズ準備）

- **ファイル**: `assets/bg/bg_hokutou_kyoshitsu_yoru.png`（現 1672×940・1854KB）
- **差し替え推奨**: 1600×900（16:9）／JPEG か PNG／`object-fit: cover` で全画面
- **状態**: ● 実画像が乗っている
- **時間帯トーン**: `kyoshitsu/yoru` → 夜（青み・光 OFF・ヴェール半枚）（`js/visual.js MOODS`）、`@bg` 指定で自動追従
- **補完SVG**: 出ない（実画像が乗っているので `#stage[data-art="real"]` になり、SVG側は空になる）
- **使用回数**: 本編 8 箇所
  - 地図を作る夜 / シーン `g1`「放課後、誰もいない北棟三年B組教室」 ― `50_converge.txt:10`
  - 地図を作る夜 / シーン `g1_zenbu`「一ページ目から最終ページまで」 ― `50_converge.txt:39`
  - 地図を作る夜 / シーン `g2`「「思い出の地形図」制作」 ― `50_converge.txt:48`
  - 地図を作る夜 / シーン `g2_suu`「三日の重み」 ― `50_converge.txt:74`
  - 地図を作る夜 / シーン `g2_eb`「当日の設計」 ― `50_converge.txt:88`
  - …ほか 3 箇所
- **この背景まわりのCG**: `cg_yoru_chizu_tsukuri` / `cg_omoide_chikeizu_kansei` / `cg_end_terachi`

### `BG05` ― 北棟廊下

- **ファイル**: `assets/bg/bg_rouka_hokutou.png`（現 1672×940・1951KB）
- **差し替え推奨**: 1600×900（16:9）／JPEG か PNG／`object-fit: cover` で全画面
- **状態**: ● 実画像が乗っている
- **補完SVG**: 出ない（実画像が乗っているので `#stage[data-art="real"]` になり、SVG側は空になる）
- **使用回数**: 本編 1 箇所
  - 差出人不明の写真 / シーン `c006_goushu`「選択後共通 ―― 夕方の廊下」 ― `10_chapter1.txt:117`

### `BG06` ― 階段の踊り場（掲示物あり）

- **ファイル**: `assets/bg/bg_kaidan_odoriba.png`（現 1672×940・1971KB）
- **差し替え推奨**: 1600×900（16:9）／JPEG か PNG／`object-fit: cover` で全画面
- **状態**: ● 実画像が乗っている
- **補完SVG**: 出ない（実画像が乗っているので `#stage[data-art="real"]` になり、SVG側は空になる）
- **使用回数**: 本編 2 箇所
  - 差出人不明の写真 / シーン `c005_kaidan`「放課後、屋上へ続く階段の踊り場」 ― `10_chapter1.txt:65`
  - 地面は、忘れない。 / シーン `end_good_kuraishi`「GOOD END 倉石「年鑑、完結せず」」 ― `70_endings.txt:204`
- **この背景まわりのCG**: `cg_end_kuraishi`

### `BG07` ― 職員室

- **ファイル**: `assets/bg/bg_jimushitsu.png`（現 1672×941・1895KB）
- **差し替え推奨**: 1600×900（16:9）／JPEG か PNG／`object-fit: cover` で全画面
- **状態**: ● 実画像が乗っている
- **補完SVG**: 出ない（実画像が乗っているので `#stage[data-art="real"]` になり、SVG側は空になる）
- **使用回数**: 本編 2 箇所
  - 召野＋倉石編 ― 調査と応援 / シーン `f1`「職員室前」 ― `40_route_minamitou_meshino.txt:84`
  - 召野＋倉石編 ― 調査と応援 / シーン `f1_ossan`「食い下がった方」 ― `40_route_minamitou_meshino.txt:102`

### `BG08` ― 地図保管庫

- **ファイル**: `assets/bg/bg_chizu_hokanko.png`（現 1671×941・2102KB）
- **差し替え推奨**: 1600×900（16:9）／JPEG か PNG／`object-fit: cover` で全画面
- **状態**: ● 実画像が乗っている
- **補完SVG**: 出ない（実画像が乗っているので `#stage[data-art="real"]` になり、SVG側は空になる）
- **使用回数**: 本編 1 箇所
  - 差出人不明の写真 / シーン `c004_hokanko`「地図保管庫」 ― `10_chapter1.txt:10`
- **この背景まわりのCG**: `cg_chizutsutsu_kobore_shashin`

### `BG09` ― 図書室

- **ファイル**: `assets/bg/bg_toshoshitsu.png`（現 1672×940・2088KB）
- **差し替え推奨**: 1600×900（16:9）／JPEG か PNG／`object-fit: cover` で全画面
- **状態**: ● 実画像が乗っている
- **補完SVG**: 出ない（実画像が乗っているので `#stage[data-art="real"]` になり、SVG側は空になる）
- **使用回数**: 本編 2 箇所
  - 零編 ― 面白いの向こう側 / シーン `b2`「零の中の変化」 ― `20_route_satou_rei.txt:158`
  - 地面は、忘れない。 / シーン `end_good_rei`「GOOD END 零「面白いを仕事にする」」 ― `70_endings.txt:126`
- **この背景まわりのCG**: `cg_tsukue_kakomi_daiji` / `cg_end_rei`

### `BG10` ― 図書室奥の書庫（埃っぽい）

- **ファイル**: `assets/bg/bg_toshokan_shozoko.png`（現 1671×941・2083KB）
- **差し替え推奨**: 1600×900（16:9）／JPEG か PNG／`object-fit: cover` で全画面
- **状態**: ● 実画像が乗っている
- **補完SVG**: 出ない（実画像が乗っているので `#stage[data-art="real"]` になり、SVG側は空になる）
- **使用回数**: 本編 2 箇所
  - 差出人不明の写真 / シーン `c005b_sotto`「一人で抱える」 ― `10_chapter1.txt:85`
  - 召野＋倉石編 ― 調査と応援 / シーン `f3`「図書室、書庫」 ― `40_route_minamitou_meshino.txt:128`

### `BG11` ― 翠湖のほとり

- **ファイル**: `assets/bg/bg_suiko_hotori.png`（現 1672×941・2740KB）
- **差し替え推奨**: 1600×900（16:9）／JPEG か PNG／`object-fit: cover` で全画面
- **状態**: ● 実画像が乗っている
- **補完SVG**: 出ない（実画像が乗っているので `#stage[data-art="real"]` になり、SVG側は空になる）
- **使用回数**: 本編 2 箇所
  - 三度目の春、まだ来ない / シーン `prologue_002`「三年間ダイジェスト（共通・スキップ可）」 ― `00_prologue.txt:33`
  - 地面は、忘れない。 / シーン `end_bonus`「BONUS EXTRA「また、この教室で」」 ― `70_endings.txt:296`
- **この背景まわりのCG**: `cg_end_bonus`

### `BG12` ― 文化祭/謝恩会準備中の校庭

- **ファイル**: `assets/bg/bg_koutei_bunkasai_junbi.png`（現 1672×940・2336KB）
- **差し替え推奨**: 1600×900（16:9）／JPEG か PNG／`object-fit: cover` で全画面
- **状態**: ● 実画像が乗っている
- **補完SVG**: 出ない（実画像が乗っているので `#stage[data-art="real"]` になり、SVG側は空になる）
- **使用回数**: 本編 1 箇所
  - 窓の外に、ずっといた人 / シーン `h1`「卒業式前日、放課後の教室」 ― `60_climax.txt:10`

### `BG13` ― 体育館（謝恩会当日）

- **ファイル**: `assets/bg/bg_taiikukan.png`（現 1672×941・2134KB）
- **差し替え推奨**: 1600×900（16:9）／JPEG か PNG／`object-fit: cover` で全画面
- **状態**: ● 実画像が乗っている
- **補完SVG**: 出ない（実画像が乗っているので `#stage[data-art="real"]` になり、SVG側は空になる）
- **使用回数**: 本編 1 箇所
  - 窓の外に、ずっといた人 / シーン `h1`「卒業式前日、放課後の教室」 ― `60_climax.txt:15`

### `BG14` ― 屋上

- **ファイル**: `assets/bg/bg_okujou.png`（現 1672×941・2244KB）
- **差し替え推奨**: 1600×900（16:9）／JPEG か PNG／`object-fit: cover` で全画面
- **状態**: ● 実画像が乗っている
- **補完SVG**: 出ない（実画像が乗っているので `#stage[data-art="real"]` になり、SVG側は空になる）
- **使用回数**: 本編 1 箇所
  - 差出人不明の写真 / シーン `hub_block`「まだ聞けていない話がある気がする」 ― `10_chapter1.txt:158`

### `BG15` ― 通学電車の車窓（砂糖視点）

- **ファイル**: `assets/bg/bg_tsuugaku_densha_mado.png`（現 1672×940・1746KB）
- **差し替え推奨**: 1600×900（16:9）／JPEG か PNG／`object-fit: cover` で全画面
- **状態**: ● 実画像が乗っている
- **補完SVG**: 出ない（実画像が乗っているので `#stage[data-art="real"]` になり、SVG側は空になる）
- **使用回数**: 本編 2 箇所
  - 砂糖編 ― 窓の外の続き / シーン `a2`「砂糖のスマートフォン」 ― `20_route_satou_rei.txt:63`
  - 砂糖編 ― 窓の外の続き / シーン `a2`「砂糖のスマートフォン」 ― `20_route_satou_rei.txt:76`

### `BG16` ― 南棟と北棟を繋ぐ桜並木（蕾）

- **ファイル**: `assets/bg/bg_sakura_namiki.png`（現 1672×941・3136KB）
- **差し替え推奨**: 1600×900（16:9）／JPEG か PNG／`object-fit: cover` で全画面
- **状態**: ● 実画像が乗っている
- **補完SVG**: 出ない（実画像が乗っているので `#stage[data-art="real"]` になり、SVG側は空になる）
- **使用回数**: 本編 3 箇所
  - 南棟編 ― 境界線の向こう側 / シーン `e1`「桜並木、まだ蕾」 ― `40_route_minamitou_meshino.txt:10`
  - 地面は、忘れない。 / シーン `end_good_izaki`「GOOD END 伊崎＋伊豆見「それぞれの歩幅」」 ― `70_endings.txt:174`
  - 地面は、忘れない。 / シーン `end_good_minamitou`「GOOD END 南棟「境界のない春」」 ― `70_endings.txt:220`
- **この背景まわりのCG**: `cg_end_izaki_izumi` / `cg_end_minamitou`

### `BG17` ― 卒業式会場

- **ファイル**: `assets/bg/bg_sotsugyoushiki_kaijou.png`（現 1672×941・2139KB）
- **差し替え推奨**: 1600×900（16:9）／JPEG か PNG／`object-fit: cover` で全画面
- **状態**: ● 実画像が乗っている
- **補完SVG**: 出ない（実画像が乗っているので `#stage[data-art="real"]` になり、SVG側は空になる）
- **使用回数**: 本編 2 箇所
  - 三度目の春、まだ来ない / シーン `prologue_001`「タイトル ― 桜、まだ蕾」 ― `00_prologue.txt:10`
  - 地面は、忘れない。 / シーン `end0`「卒業式（共通）」 ― `70_endings.txt:10`
- **この背景まわりのCG**: `cg_sotsugyou_sakurafubuki`
- **エンジン側の参照**: `js/shell.js:56`

### `BG18` ― 南棟三年教室

- **ファイル**: `assets/bg/bg_minamitou_kyoshitsu.png`（現 1672×941・1961KB）
- **差し替え推奨**: 1600×900（16:9）／JPEG か PNG／`object-fit: cover` で全画面
- **状態**: ● 実画像が乗っている
- **補完SVG**: 出ない（実画像が乗っているので `#stage[data-art="real"]` になり、SVG側は空になる）
- **使用回数**: 本編 3 箇所
  - 南棟編 ― 境界線の向こう側 / シーン `e2`「南棟三年教室」 ― `40_route_minamitou_meshino.txt:28`
  - 南棟編 ― 境界線の向こう側 / シーン `e2_jikashi`「茶化した場合」 ― `40_route_minamitou_meshino.txt:44`
  - 地面は、忘れない。 / シーン `end_good_meshino`「GOOD END 召野「言葉を届ける」」 ― `70_endings.txt:190`
- **この背景まわりのCG**: `cg_naitou_kao_age` / `cg_end_meshino`

### `BG19` ― 両馬の家・祖父の遺影がある部屋

- **ファイル**: `assets/bg/bg_ryoma_ie_butsudan.png`（現 1672×941・2008KB）
- **差し替え推奨**: 1600×900（16:9）／JPEG か PNG／`object-fit: cover` で全画面
- **状態**: ● 実画像が乗っている
- **補完SVG**: 出ない（実画像が乗っているので `#stage[data-art="real"]` になり、SVG側は空になる）
- **使用回数**: 本編 2 箇所
  - 両馬編 ― 祖父と✝本質✝ / シーン `d1`「両馬の家、夕方」 ― `30_route_terachi_ryoma.txt:82`
  - 地面は、忘れない。 / シーン `end_good_ryoma`「GOOD END 両馬「✝本質✝、その後」」 ― `70_endings.txt:154`
- **この背景まわりのCG**: `cg_butsudan_seiza_sugata` / `cg_butsudan_narabu_futari` / `cg_end_ryoma`

### `BG20` ― 回想・ハワイの溶岩台地

- **ファイル**: `assets/bg/bg_hawaii_youganchi_kaisou.png`（現 1672×941・2653KB）
- **差し替え推奨**: 1600×900（16:9）／JPEG か PNG／`object-fit: cover` で全画面
- **状態**: ● 実画像が乗っている
- **補完SVG**: 出ない（実画像が乗っているので `#stage[data-art="real"]` になり、SVG側は空になる）
- **使用回数**: 本編 1 箇所
  - 砂糖編 ― 窓の外の続き / シーン `a2`「砂糖のスマートフォン」 ― `20_route_satou_rei.txt:71`

### `BG21` ― 回想・稲葉と勝也がいた山（褪色調）

- **ファイル**: `assets/bg/bg_yama_gensho_kaisou.png`（現 1672×941・2743KB）
- **差し替え推奨**: 1600×900（16:9）／JPEG か PNG／`object-fit: cover` で全画面
- **状態**: ● 実画像が乗っている
- **補完SVG**: 出ない（実画像が乗っているので `#stage[data-art="real"]` になり、SVG側は空になる）
- **使用回数**: 本編 1 箇所
  - 窓の外に、ずっといた人 / シーン `h3`「回想：はじめての地形図」 ― `60_climax.txt:60`
- **この背景まわりのCG**: `cg_yama_ue_hajimete_chizu`

### `BG22` ― 回想・大学時代の野外調査ベースキャンプ

- **ファイル**: `assets/bg/bg_daigaku_yakou_kaisou.png`（現 1672×941・2551KB）
- **差し替え推奨**: 1600×900（16:9）／JPEG か PNG／`object-fit: cover` で全画面
- **状態**: ● 実画像が乗っている
- **補完SVG**: 出ない（実画像が乗っているので `#stage[data-art="real"]` になり、SVG側は空になる）
- **使用回数**: 本編 1 箇所
  - 窓の外に、ずっといた人 / シーン `h4`「回想：最後の日」 ― `60_climax.txt:76`
- **この背景まわりのCG**: `cg_wakaki_utsumuki` / `cg_kuhou_kageboushi`

### `BG23` ― エピローグ・卒業後の春、もぬけの殻の教室

- **ファイル**: `assets/bg/bg_kyoshitsu_haru_sotsugyougo.png`（現 1672×941・2255KB）
- **差し替え推奨**: 1600×900（16:9）／JPEG か PNG／`object-fit: cover` で全画面
- **状態**: ● 実画像が乗っている
- **時間帯トーン**: `kyoshitsu/haru` → haru（`js/visual.js MOODS`）、`@bg` 指定で自動追従
- **補完SVG**: 出ない（実画像が乗っているので `#stage[data-art="real"]` になり、SVG側は空になる）
- **使用回数**: 本編 2 箇所
  - 地面は、忘れない。 / シーン `end_good_mie`「GOOD END 三重「否定の向こう側」」 ― `70_endings.txt:82`
  - 地面は、忘れない。 / シーン `end_good_satou`「GOOD END 砂糖「見ている、それだけで」」 ― `70_endings.txt:110`
- **この背景まわりのCG**: `cg_end_mie` / `cg_end_satou`

### `BG24` ― TRUE END後日談・数年後の同じ教室

- **ファイル**: `assets/bg/bg_kyoshitsu_suunengo.png`（現 1672×941・1987KB）
- **差し替え推奨**: 1600×900（16:9）／JPEG か PNG／`object-fit: cover` で全画面
- **状態**: ● 実画像が乗っている
- **時間帯トーン**: `kyoshitsu/suunengo` → suunengo（`js/visual.js MOODS`）、`@bg` 指定で自動追従
- **補完SVG**: 出ない（実画像が乗っているので `#stage[data-art="real"]` になり、SVG側は空になる）
- **使用回数**: 本編 1 箇所
  - 地面は、忘れない。 / シーン `end_true`「TRUE END「地面は、忘れない。」」 ― `70_endings.txt:55`
- **この背景まわりのCG**: `cg_end_true`

### `title_key` ― タイトルキービジュアル（夕方の教室・地図筒・古写真）

- **ファイル**: `assets/bg/title_key.jpg`（現 1672×940・2237KB）
- **差し替え推奨**: 1600×900（16:9）／JPEG か PNG／`object-fit: cover` で全画面
- **状態**: ● 実画像が乗っている
- **補完SVG**: 出ない（実画像が乗っているので `#stage[data-art="real"]` になり、SVG側は空になる）
- **出番**: 脚本から `@bg` 指定なし（タイトル背景など、エンジン側だけを使う）
- **エンジン側の参照**: `js/visual.js:999` / `js/shell.js:61` / `index.html:13`

## 差し替え手順（BG共通）

1. `assets/bg/` に同名上書き（1600×900／16:9）
2. 台帳の `placeholder` を `false` に → SVG補完が外れて実画像になる
3. `sw.js` の `CACHE` を上げる
4. 白背景素材のまま使いたいときだけ CONFIG「画像合成」= multiply（**既定は normal**。multiply は `#stage[data-blend="multiply"]` を付けたときだけ立ち絵に掛かる）

### `@bg` の書き方

| 書き方 | 結果 |
|---|---|
| `@bg bg_hokutou_kyoshitsu_yuugata` | stem 指定（推奨）。 `time=yuugata` を併記すると `mood()` も同時に切り替わる |
| `@bg BG03` | 台帳ID指定でも解決される |
| `@bg bg_x time=akari` | 背景の差し替えと照明トーンを同時に（ `MOODS` を参照） |
| `@bg off` | 背景を剥ぐ（両スラブを空にする） |
