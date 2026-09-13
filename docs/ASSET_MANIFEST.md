# アセット対応表（仮画像 → 正式スロット名）

『まだ地図の途中で』〜✝本質✝特別編〜 企画書 第8章のアセット一覧に沿って、
`image1/ image2/ image3/` に置かれていた仮画像 `white_NNN.png`（400×300・白）を
正式なスロット名へリネーム・配置した対応表です。

> **2026-09-13 現在の実ファイル**: 背景25枚（`assets/bg/`）だけが実画像として存在します。
> 立ち絵は78枚（未使用27枚削除後）。CGは名場面18+ED14。UI20は撤去。
> CG・立ち絵の実素材は、下表の「差し替え先」の名前で新規配置すれば
> `data/assets.json` の該当行 `placeholder` を `false` にした瞬間から本編に乗ります。

- 白紙実ファイルは2026-09-12に全削除しました。CG・立ち絵は**台帳に名前だけ**の状態で、
  エンジン側は背景・立ち絵とも CSS/SVG の補完描画で画面を成立させています。
- 実素材を置いたら `data/assets.json` の該当行 `placeholder` を `false` にしてください。
- **2026-09-13 未使用立ち絵27枚を完全削除**。旧名→新名統一（`data/assets.json`基準）。

## 内訳

| 区分 | 企画書の計画 | 本リポジトリで確保したスロット |
|---|---|---|
| 背景(BG) | 24 | 24 |
| 立ち絵差分 | 113 | 78（未使用27削除後） |
| 名場面CG | 38 | 18（降板20削除） |
| ED専用CG | 14 | 14 |
| UI／アイテム | 20 | 0（2026-09-12 撤去） |
| 立ち絵差分（実ファイル） | 78 | 0（白紙削除済み。台帳にスロットのみ） |
| 削除済み未使用立ち絵 | - | 27（2026-09-13削除） |

## 対応表

| # | 元ファイル | → 差し替え先 | 内容 |
|---|---|---|---|
| 1 | `image?/white_001.png` | `assets/bg/bg_hokutou_kyoshitsu_asa.png` | 北棟三年B組教室・朝 |
| 2 | `image?/white_002.png` | `assets/bg/bg_hokutou_kyoshitsu_hiru.png` | 北棟三年B組教室・昼休み |
| 3 | `image?/white_003.png` | `assets/bg/bg_hokutou_kyoshitsu_yuugata.png` | 北棟三年B組教室・夕方（茜色・逆光） |
| 4 | `image?/white_004.png` | `assets/bg/bg_hokutou_kyoshitsu_yoru.png` | 北棟三年B組教室・夜（サプライズ準備） |
| 5 | `image?/white_005.png` | `assets/bg/bg_rouka_hokutou.png` | 北棟廊下 |
| 6 | `image?/white_006.png` | `assets/bg/bg_kaidan_odoriba.png` | 階段の踊り場（掲示物あり） |
| 7 | `image?/white_007.png` | `assets/bg/bg_jimushitsu.png` | 職員室 |
| 8 | `image?/white_008.png` | `assets/bg/bg_chizu_hokanko.png` | 地図保管庫 |
| 9 | `image?/white_009.png` | `assets/bg/bg_toshoshitsu.png` | 図書室 |
| 10 | `image?/white_010.png` | `assets/bg/bg_toshoshitsu_oku_shoko.png` | 図書室奥の書庫（埃っぽい） |
| 11 | `image?/white_011.png` | `assets/bg/bg_suiko_hotori.png` | 翠湖のほとり |
| 12 | `image?/white_012.png` | `assets/bg/bg_koutei_bunkasai_junbi.png` | 文化祭/謝恩会準備中の校庭 |
| 13 | `image?/white_013.png` | `assets/bg/bg_taiikukan.png` | 体育館（謝恩会当日） |
| 14 | `image?/white_014.png` | `assets/bg/bg_okujou.png` | 屋上 |
| 15 | `image?/white_015.png` | `assets/bg/bg_tsuugaku_densha_mado.png` | 通学電車の車窓（砂糖視点） |
| 16 | `image?/white_016.png` | `assets/bg/bg_sakura_namiki.png` | 南棟と北棟を繋ぐ桜並木（蕾） |
| 17 | `image?/white_017.png` | `assets/bg/bg_sotsugyoushiki_kaijou.png` | 卒業式会場 |
| 18 | `image?/white_018.png` | `assets/bg/bg_minamitou_kyoshitsu.png` | 南棟三年教室 |
| 19 | `image?/white_019.png` | `assets/bg/bg_ryoma_ie_butsudan.png` | 両馬の家・祖父の遺影がある部屋 |
| 20 | `image?/white_020.png` | `assets/bg/bg_hawaii_yougan_daichi_kaisou.png` | 回想・ハワイの溶岩台地 |
| 21 | `image?/white_021.png` | `assets/bg/bg_yama_kaisou.png` | 回想・稲葉と勝也がいた山（褪色調） |
| 22 | `image?/white_022.png` | `assets/bg/bg_daigaku_camp_kaisou.png` | 回想・大学時代の野外調査ベースキャンプ |
| 23 | `image?/white_023.png` | `assets/bg/bg_kyoshitsu_haru_sotsugyougo.png` | エピローグ・卒業後の春、もぬけの殻の教室 |
| 24 | `image?/white_024.png` | `assets/bg/bg_kyoshitsu_suunengo.png` | TRUE END後日談・数年後の同じ教室 |
| 25 | `image?/white_025.png` | `assets/chr/chr_katsuya_01_tsuujou.png` | 立ち絵差分 塀勝也／通常（穏やか） |
| 26 | `image?/white_026.png` | `assets/chr/chr_katsuya_02_hohoemi.png` | 立ち絵差分 塀勝也／微笑 |
| 27 | `image?/white_027.png` | `assets/chr/chr_katsuya_03_tooi_me.png` | 立ち絵差分 塀勝也／遠い目 |
| 28 | `image?/white_028.png` | `assets/chr/chr_katsuya_04_odoroki.png` | 立ち絵差分 塀勝也／驚き |
| 30 | `image?/white_030.png` | `assets/chr/chr_katsuya_06_katai_muhyoujou.png` | 立ち絵差分 塀勝也／硬い無表情 |
| 31 | `image?/white_031.png` | `assets/chr/chr_katsuya_07_kaisou_me_hosomeru.png` | 立ち絵差分 塀勝也／回想・目を細める |
| 32 | `image?/white_032.png` | `assets/chr/chr_katsuya_08_namida_koraeru.png` | 立ち絵差分 塀勝也／涙をこらえる |
| 33 | `image?/white_033.png` | `assets/chr/chr_katsuya_09_naku.png` | 立ち絵差分 塀勝也／泣く |
| 34 | `image?/white_034.png` | `assets/chr/chr_katsuya_10_hareyaka_emi.png` | 立ち絵差分 塀勝也／晴れやかな笑み |
| 35 | `image?/white_035.png` | `assets/chr/chr_ryoma_01_tsuujou.png` | 立ち絵差分 両馬二郎／通常 |
| 36 | `image?/white_036.png` | `assets/chr/chr_ryoma_02_niyari.png` | 立ち絵差分 両馬二郎／ニヤリ |
| 38 | `image?/white_038.png` | `assets/chr/chr_ryoma_04_kyuu_magao.png` | 立ち絵差分 両馬二郎／急に真顔 |
| 39 | `image?/white_039.png` | `assets/chr/chr_ryoma_05_shonbori.png` | 立ち絵差分 両馬二郎／しょんぼり |
| 40 | `image?/white_040.png` | `assets/chr/chr_ryoma_06_nakiwarai.png` | 立ち絵差分 両馬二郎／泣き笑い |
| 41 | `image?/white_041.png` | `assets/chr/chr_ryoma_07_shinken_ketsui.png` | 立ち絵差分 両馬二郎／真剣な決意顔 |
| 42 | `image?/white_042.png` | `assets/chr/chr_ryoma_08_terekakushi.png` | 立ち絵差分 両馬二郎／照れ隠しで頭をかく |
| 43 | `image?/white_043.png` | `assets/chr/chr_ryoma_09_goukyuu.png` | 立ち絵差分 両馬二郎／号泣 |
| 44 | `image?/white_044.png` | `assets/chr/chr_mie_01_reishou.png` | 立ち絵差分 三重県臣／通常（冷笑・半目） |
| 45 | `image?/white_045.png` | `assets/chr/chr_mie_02_ha.png` | 立ち絵差分 三重県臣／「は？」 |
| 46 | `image?/white_046.png` | `assets/chr/chr_mie_03_douyou.png` | 立ち絵差分 三重県臣／動揺 |
| 47 | `image?/white_047.png` | `assets/chr/chr_mie_04_kimazui_chinmoku.png` | 立ち絵差分 三重県臣／気まずい沈黙 |
| 49 | `image?/white_049.png` | `assets/chr/chr_mie_06_iradachi_shinken.png` | 立ち絵差分 三重県臣／苛立ち混じりの真剣 |
| 50 | `image?/white_050.png` | `assets/chr/chr_mie_07_honki_shinken.png` | 立ち絵差分 三重県臣／本気の真剣 |
| 52 | `image?/white_052.png` | `assets/chr/chr_mie_09_sunao_hohoemi.png` | 立ち絵差分 三重県臣／初めての素直な微笑み |
| 53 | `image?/white_053.png` | `assets/chr/chr_mie_10_nakigao.png` | 立ち絵差分 三重県臣／泣き顔 |
| 54 | `image?/white_054.png` | `assets/chr/chr_terachi_01_nemusou.png` | 立ち絵差分 寺地星／通常（眠そう・淡々） |
| 55 | `image?/white_055.png` | `assets/chr/chr_terachi_02_konwaku_katamaru.png` | 立ち絵差分 寺地星／困惑して固まる |
| 56 | `image?/white_056.png` | `assets/chr/chr_terachi_03_haishin_shinken.png` | 立ち絵差分 寺地星／真剣な配信者の顔 |
| 57 | `image?/white_057.png` | `assets/chr/chr_terachi_04_ureshii.png` | 立ち絵差分 寺地星／嬉しい |
| 59 | `image?/white_059.png` | `assets/chr/chr_terachi_06_maiku_no_ketsui.png` | 立ち絵差分 寺地星／マイク前の決意顔 |
| 61 | `image?/white_061.png` | `assets/chr/chr_terachi_08_namida.png` | 立ち絵差分 寺地星／涙 |
| 62 | `image?/white_062.png` | `assets/chr/chr_satou_01_game_gyoushi.png` | 立ち絵差分 砂糖東洋／通常（ゲーム画面凝視） |
| 63 | `image?/white_063.png` | `assets/chr/chr_satou_02_muhyoujou.png` | 立ち絵差分 砂糖東洋／無表情（素） |
| 64 | `image?/white_064.png` | `assets/chr/chr_satou_03_kao_ageta.png` | 立ち絵差分 砂糖東洋／驚き（画面から顔を上げる） |
| 65 | `image?/white_065.png` | `assets/chr/chr_satou_04_soppo.png` | 立ち絵差分 砂糖東洋／照れ隠しでそっぽを向く |
| 66 | `image?/white_066.png` | `assets/chr/chr_satou_05_camera.png` | 立ち絵差分 砂糖東洋／真剣にカメラを構える顔 |
| 67 | `image?/white_067.png` | `assets/chr/chr_satou_06_hohoemi.png` | 立ち絵差分 砂糖東洋／微笑み（レア） |
| 68 | `image?/white_068.png` | `assets/chr/chr_satou_07_tsumaru.png` | 立ち絵差分 砂糖東洋／言葉に詰まる顔 |
| 69 | `image?/white_069.png` | `assets/chr/chr_satou_08_me_hikari_koraeru.png` | 立ち絵差分 砂糖東洋／目に光るものを堪える顔 |
| 70 | `image?/white_070.png` | `assets/chr/chr_rei_01_suzushii.png` | 立ち絵差分 数理零／通常（涼しい顔） |
| 71 | `image?/white_071.png` | `assets/chr/chr_rei_02_hohoemi.png` | 立ち絵差分 数理零／微笑 |
| 73 | `image?/white_073.png` | `assets/chr/chr_rei_04_odoroki.png` | 立ち絵差分 数理零／驚き |
| 74 | `image?/white_074.png` | `assets/chr/chr_rei_05_data_shinken.png` | 立ち絵差分 数理零／真剣（データと向き合う） |
| 76 | `image?/white_076.png` | `assets/chr/chr_rei_07_kotoba_erabu.png` | 立ち絵差分 数理零／言葉を選ぶ顔 |
| 78 | `image?/white_078.png` | `assets/chr/chr_izaki_01_tsuujou.png` | 立ち絵差分 伊崎／通常 |
| 79 | `image?/white_079.png` | `assets/chr/chr_izaki_02_egao.png` | 立ち絵差分 伊崎／笑顔 |
| 81 | `image?/white_081.png` | `assets/chr/chr_izaki_04_shikiri.png` | 立ち絵差分 伊崎／真剣（仕切る顔） |
| 83 | `image?/white_083.png` | `assets/chr/chr_izaki_06_shimijimi_hohoemi.png` | 立ち絵差分 伊崎／しみじみとした微笑み |
| 85 | `image?/white_085.png` | `assets/chr/chr_izumi_02_egao.png` | 立ち絵差分 伊豆見／笑顔 |
| 86 | `image?/white_086.png` | `assets/chr/chr_izumi_03_kinchou.png` | 立ち絵差分 伊豆見／緊張 |
| 87 | `image?/white_087.png` | `assets/chr/chr_izumi_04_ketsui.png` | 立ち絵差分 伊豆見／決意 |
| 89 | `image?/white_089.png` | `assets/chr/chr_izumi_06_hokorashige.png` | 立ち絵差分 伊豆見／誇らしげ |
| 90 | `image?/white_090.png` | `assets/chr/chr_meshino_01_tsuujou.png` | 立ち絵差分 召野カイト／通常 |
| 93 | `image?/white_093.png` | `assets/chr/chr_meshino_04_shinken.png` | 立ち絵差分 召野カイト／真剣 |
| 94 | `image?/white_094.png` | `assets/chr/chr_meshino_05_eigo_doya.png` | 立ち絵差分 召野カイト／英語ドヤ顔 |
| 95 | `image?/white_095.png` | `assets/chr/chr_meshino_06_shinmiri.png` | 立ち絵差分 召野カイト／しんみり |
| 96 | `image?/white_096.png` | `assets/chr/chr_kuraishi_01_nekkyou.png` | 立ち絵差分 倉石暁／通常（熱狂） |
| 97 | `image?/white_097.png` | `assets/chr/chr_kuraishi_02_kangeki.png` | 立ち絵差分 倉石暁／感激 |
| 98 | `image?/white_098.png` | `assets/chr/chr_kuraishi_03_chousa_shinken.png` | 立ち絵差分 倉石暁／真剣（調査中） |
| 100 | `image?/white_100.png` | `assets/chr/chr_kuraishi_05_hokorashige.png` | 立ち絵差分 倉石暁／誇らしげ |
| 101 | `image?/white_101.png` | `assets/chr/chr_kuraishi_06_kotoba_ushinau.png` | 立ち絵差分 倉石暁／言葉を失う顔 |
| 103 | `image?/white_103.png` | `assets/chr/chr_futami_01_tsuujou.png` | 立ち絵差分 二見玲子／通常 |
| 105 | `image?/white_105.png` | `assets/chr/chr_futami_03_shinpai.png` | 立ち絵差分 二見玲子／心配顔 |
| 106 | `image?/white_106.png` | `assets/chr/chr_futami_04_itazura.png` | 立ち絵差分 二見玲子／いたずらっぽい笑み |
| 107 | `image?/white_107.png` | `assets/chr/chr_futami_05_yokogao.png` | 立ち絵差分 二見玲子／しんみりした横顔 |
| 109 | `image?/white_109.png` | `assets/chr/chr_sakura_02_kenkyuusha.png` | 立ち絵差分 櫻優／真剣（研究者モード） |
| 112 | `image?/white_112.png` | `assets/chr/chr_sakura_05_egao.png` | 立ち絵差分 櫻優／笑顔 |
| 113 | `image?/white_113.png` | `assets/chr/chr_sakura_06_yawarakai.png` | 立ち絵差分 櫻優／柔らかい表情 |
| 114 | `image?/white_114.png` | `assets/chr/chr_mitsumine_01_tsuujou.png` | 立ち絵差分 三峰瑠衣／通常 |
| 115 | `image?/white_115.png` | `assets/chr/chr_mitsumine_02_tsukkomi.png` | 立ち絵差分 三峰瑠衣／ツッコミ顔 |
| 116 | `image?/white_116.png` | `assets/chr/chr_mitsumine_03_egao.png` | 立ち絵差分 三峰瑠衣／笑顔 |
| 119 | `image?/white_119.png` | `assets/chr/chr_mitsumine_06_ha.png` | 立ち絵差分 三峰瑠衣／「は？」（ハモリ専用） |
| 120 | `image?/white_120.png` | `assets/chr/chr_naitou_01_tsuujou.png` | 立ち絵差分 内藤蘭／通常 |
| 121 | `image?/white_121.png` | `assets/chr/chr_naitou_02_hohoemi.png` | 立ち絵差分 内藤蘭／微笑 |
| 123 | `image?/white_123.png` | `assets/chr/chr_naitou_04_odoroki.png` | 立ち絵差分 内藤蘭／驚き |
| 124 | `image?/white_124.png` | `assets/chr/chr_naitou_05_yasashii_me.png` | 立ち絵差分 内藤蘭／優しい目 |
| 125 | `image?/white_125.png` | `assets/chr/chr_naitou_06_sukoshi_warau.png` | 立ち絵差分 内藤蘭／少し笑う |
| 126 | `image?/white_126.png` | `assets/chr/chr_inaba_01_furushashin_hohoemi.png` | 立ち絵差分 稲葉悌二（回想専用）／古写真の中の柔らかい笑み |
| 131 | `image?/white_131.png` | `assets/cg/cg_chizutsutsu_kobore_shashin.png` | 三重／勝也／BG08。地図筒の蓋が外れ古写真がこぼれ落ちる瞬間（スロー）。 |
| 136 | `image?/white_136.png` | `assets/cg/cg_mado_ushiro_miteteta.png` | 砂糖／三重／BG01・放課後。「見てた」と認める瞬間、窓を背に。 |
| 138 | `image?/white_138.png` | `assets/cg/cg_tsukue_kakomi_daiji.png` | 零／両馬／三重／BG01。「面白いからじゃなくて、大事だと思うから」。 |
| 141 | `image?/white_141.png` | `assets/cg/cg_butsudan_seiza_sugata.png` | 両馬（単独）／BG19。仏壇の前に正座する後ろ姿、線香の煙。 |
| 142 | `image?/white_142.png` | `assets/cg/cg_butsudan_narabu_futari.png` | 両馬／三重／BG19。祖父の口癖を話す生活感のある並席。 |
| 148 | `image?/white_148.png` | `assets/cg/cg_naitou_kao_age.png` | 内藤（単独）／BG18。伏し目から顔を上げる一瞬。 |
| 149 | `image?/white_149.png` | `assets/cg/cg_yoru_chizu_tsukuri.png` | 全員集合／BG04・夜。机を寄せ合い地図を作る俯瞰構図。 |
| 151 | `image?/white_151.png` | `assets/cg/cg_omoide_chikeizu_kansei.png` | 「思い出の地形図」完成図。画面いっぱいの作品アート。 |
| 152 | `image?/white_152.png` | `assets/cg/cg_yuugata_madobe_katsuya.png` | 勝也（単独・後ろ姿）／BG03。誰もいない教室の窓際。 |
| 155 | `image?/white_155.png` | `assets/cg/cg_nagai_chinmoku.png` | 勝也（単独）。いつもの五秒より長い沈黙、表情が見える角度。 |
| 156 | `image?/white_156.png` | `assets/cg/cg_yama_ue_hajimete_chizu.png` | 若き勝也／稲葉／BG21。初めて地形図を渡される山の上（褪色）。 |
| 157 | `image?/white_157.png` | `assets/cg/cg_wakaki_utsumuki.png` | 若き勝也（回想・単独）／BG22。生意気を言った日、俯く。 |
| 158 | `image?/white_158.png` | `assets/cg/cg_fuhou_kageboushi.png` | 勝也（回想の切れ目）／BG21。訃報を知った瞬間、シルエットのみ。 |
| 159 | `image?/white_159.png` | `assets/cg/cg_mado_gawa_no_houkoku.png` | 勝也（単独）／BG13。「窓の外を見るたび、報告していた」。 |
| 160 | `image?/white_160.png` | `assets/cg/cg_seito_wo_miwatasu.png` | 全員集合／勝也／BG13。生徒たちを見渡す広い構図。 |
| 162 | `image?/white_162.png` | `assets/cg/cg_hitorizutsu_no_kotoba.png` | 全員集合／勝也／BG13。一人ずつの一言、涙をこらえる。 |
| 163 | `image?/white_163.png` | `assets/cg/cg_hareyaka_na_emi.png` | 勝也（単独）／BG13。締めの台詞、晴れやかな笑み（表情⑩）。 |
| 164 | `image?/white_164.png` | `assets/cg/cg_sotsugyou_sakurafubuki.png` | 全員集合／BG17。卒業式、桜吹雪。 |
| 168 | `image?/white_168.png` | `assets/cg/cg_end_true.png` | TRUE END ―― 数年後の教室で地図を見せる勝也＋卒業アルバムのモンタージュ |
| 169 | `image?/white_169.png` | `assets/cg/cg_end_mie.png` | GOOD END・三重 ―― 教壇に立つ練習 |
| 170 | `image?/white_170.png` | `assets/cg/cg_end_satou.png` | GOOD END・砂糖 ―― フィールドで堂々と空を見上げる |
| 171 | `image?/white_171.png` | `assets/cg/cg_end_rei.png` | GOOD END・零 ―― 研究室でPCに向かいながら微笑む |
| 172 | `image?/white_172.png` | `assets/cg/cg_end_terachi.png` | GOOD END・寺地 ―― 紙束が増えた配信机 |
| 173 | `image?/white_173.png` | `assets/cg/cg_end_ryoma.png` | GOOD END・両馬 ―― 祖父の墓前で笑って報告 |
| 174 | `image?/white_174.png` | `assets/cg/cg_end_izaki_izumi.png` | GOOD END・伊崎＋伊豆見 ―― 別々の道で並んで笑う |
| 175 | `image?/white_175.png` | `assets/cg/cg_end_meshino.png` | GOOD END・召野 ―― 教壇／留学先を思わせる一枚 |
| 176 | `image?/white_176.png` | `assets/cg/cg_end_kuraishi.png` | GOOD END・倉石 ―― 後輩に年鑑を託す |
| 177 | `image?/white_177.png` | `assets/cg/cg_end_minamitou.png` | GOOD END・南棟 ―― 櫻・内藤・三峰の穏やかな一枚 |
| 178 | `image?/white_178.png` | `assets/cg/cg_end_normal.png` | NORMAL END ―― 桜の下、いつも通りの日常 |
| 179 | `image?/white_179.png` | `assets/cg/cg_end_bittersweet.png` | BITTERSWEET END ―― 小さくまとまったサプライズ、それでも笑い合う |
| 180 | `image?/white_180.png` | `assets/cg/cg_end_comedy.png` | COMEDY SECRET END ―― 勝也が「……本質かもな」と言ってしまう |
| 181 | `image?/white_181.png` | `assets/cg/cg_end_bonus.png` | BONUS EXTRA ―― 数年後の翠湖のほとり、同窓会集合カット |

### 2026-09-13 削除済み未使用立ち絵27枚

| 29 | `white_029.png` | ~~`assets/chr/chr_katsuya_05_me_fuseru.png`~~ **完全削除** | 未使用 |
| 37 | `white_037.png` | ~~`assets/chr/chr_ryoma_03_zenryoku.png`~~ **完全削除** | 未使用 |
| 48 | `white_048.png` | ~~`assets/chr/chr_mie_05_tere.png`~~ **完全削除** | 未使用 |
| 51 | `white_051.png` | ~~`assets/chr/chr_mie_08_namida_kamu.png`~~ **完全削除** | 未使用 |
| 58 | `white_058.png` | ~~`assets/chr/chr_terachi_05_nakisou_koraeru.png`~~ **完全削除** | 未使用 |
| 60 | `white_060.png` | ~~`assets/chr/chr_terachi_07_yomiage.png`~~ **完全削除** | 未使用 |
| 72 | `white_072.png` | ~~`assets/chr/chr_rei_03_kangaechuu.png`~~ **完全削除** | 未使用 |
| 75 | `white_075.png` | ~~`assets/chr/chr_rei_06_yasashii_me.png`~~ **完全削除** | 未使用 |
| 77 | `white_077.png` | ~~`assets/chr/chr_rei_08_me_rumaseru.png`~~ **完全削除** | 未使用 |
| 80 | `white_080.png` | ~~`assets/chr/chr_izaki_03_komari.png`~~ **完全削除** | 未使用 |
| 82 | `white_082.png` | ~~`assets/chr/chr_izaki_05_odoroki.png`~~ **完全削除** | 未使用 |
| 84 | `white_084.png` | ~~`assets/chr/chr_izumi_01_tsuujou.png`~~ **完全削除** | 未使用 |
| 88 | `white_088.png` | ~~`assets/chr/chr_izumi_05_tere.png`~~ **完全削除** | 未使用 |
| 91 | `white_091.png` | ~~`assets/chr/chr_meshino_02_kimegao.png`~~ **完全削除** | 未使用 |
| 92 | `white_092.png` | ~~`assets/chr/chr_meshino_03_tere.png`~~ **完全削除** | 未使用 |
| 99 | `white_099.png` | ~~`assets/chr/chr_kuraishi_04_shonbori.png`~~ **完全削除** | 未使用 |
| 102 | `white_102.png` | ~~`assets/chr/chr_kuraishi_07_namidagumu.png`~~ **完全削除** | 未使用 |
| 104 | `white_104.png` | ~~`assets/chr/chr_futami_02_hohoemi.png`~~ **完全削除** | 未使用 |
| 108 | `white_108.png` | ~~`assets/chr/chr_sakura_01_tsuujou.png`~~ **完全削除** | 未使用 |
| 110 | `white_110.png` | ~~`assets/chr/chr_sakura_03_tere.png`~~ **完全削除** | 未使用 |
| 111 | `white_111.png` | ~~`assets/chr/chr_sakura_04_douyou.png`~~ **完全削除** | 未使用 |
| 117 | `white_117.png` | ~~`assets/chr/chr_mitsumine_04_akire.png`~~ **完全削除** | 未使用 |
| 118 | `white_118.png` | ~~`assets/chr/chr_mitsumine_05_yasashii.png`~~ **完全削除** | 未使用 |
| 122 | `white_122.png` | ~~`assets/chr/chr_naitou_03_dokusho.png`~~ **完全削除** | 未使用 |
| 127 | `white_127.png` | ~~`assets/chr/chr_inaba_02_yama_sasu.png`~~ **完全削除** | 未使用 |
| 128 | `white_128.png` | ~~`assets/chr/chr_wakaki-katsuya_01_waratteiru.png`~~ **完全削除** | 未使用 |
| 129 | `white_129.png` | ~~`assets/chr/chr_wakaki-katsuya_02_bousen.png`~~ **完全削除** | 未使用 |

### 2026-09-13 命名修正（21件）― ローマ字の読み誤り・混成語を全修正

企画書（`scenareo.txt` §8）由来の読み誤りを、台帳・脚本・版B・生成ツールまで含めて一括修正しました。
**`scenareo.txt` は原典なので旧表記のまま**（この表が対応関係の記録です）。

| 旧名 | 新名 | 内容 | 修正理由 |
|---|---|---|---|
| `chr_katsuya_06_kataki_muten` | **`chr_katsuya_06_katai_muhyoujou`** | 塀勝也 硬い無表情 | 硬い=katai（kataki は誤り）／無表情=muhyoujou（muten は誤り） |
| `chr_katsuya_07_kaisou_me_soseru` | **`chr_katsuya_07_kaisou_me_hosomeru`** | 塀勝也 回想・目を細める | 細める=hosomeru（soseru という語は無い） |
| `chr_katsuya_10_hareyaka_emmi` | **`chr_katsuya_10_hareyaka_emi`** | 塀勝也 晴れやかな笑み | 笑み=emi（emmi は誤り）。CG の `cg_hareyaka_na_emi` と表記を統一 |
| `chr_ryoma_04_kinimo_majime` | **`chr_ryoma_04_kyuu_magao`** | 両馬二郎 急に真顔 | 急に=kyuu ni（kinimo は誤り）／真顔=magao |
| `chr_mie_04_chimatsu` | **`chr_mie_04_kimazui_chinmoku`** | 三重県臣 気まずい沈黙 | 気まずい=kimazui／沈黙=chinmoku（chimatsu は2語の混成） |
| `chr_mie_06_iraduki_shinken` | **`chr_mie_06_iradachi_shinken`** | 三重県臣 苛立ち混じりの真剣 | 苛立ち=iradachi（iraduki は誤り） |
| `chr_terachi_02_komatte_kataaru` | **`chr_terachi_02_konwaku_katamaru`** | 寺地星 困惑して固まる | 固まる=katamaru（kataaru はタイポ）／label に合わせて困惑=konwaku |
| `chr_terachi_03_hansya_shinken` | **`chr_terachi_03_haishin_shinken`** | 寺地星 真剣な配信者の顔 | 配信=haishin（hansya は「反射」で別語） |
| `chr_satou_01_game_shuuchuu` | **`chr_satou_01_game_gyoushi`** | 砂糖東洋 通常（ゲーム画面凝視） | label が「凝視」なので gyoushi（集中=shuuchuu は label と不一致） |
| `chr_satou_02_muten` | **`chr_satou_02_muhyoujou`** | 砂糖東洋 無表情（素） | 無表情=muhyoujou（muten は誤り） |
| `chr_satou_08_hikari_koraeru` | **`chr_satou_08_me_hikari_koraeru`** | 砂糖東洋 目に光るものを堪える顔 | 主語の「目に」が抜けていた |
| `chr_izaki_06_shimiemi` | **`chr_izaki_06_shimijimi_hohoemi`** | 伊崎 しみじみとした微笑み | しみじみ+微笑みの混成語（shimiemi）を解消 |
| `chr_kuraishi_01_kekkyou` | **`chr_kuraishi_01_nekkyou`** | 倉石暁 通常（熱狂） | 熱狂=nekkyou（kekkyou は誤り） |
| `chr_kuraishi_02_kanshou` | **`chr_kuraishi_02_kangeki`** | 倉石暁 感激 | 感激=kangeki（kanshou は「観賞／勘当」で別語） |
| `chr_kuraishi_06_kotoba_usinau` | **`chr_kuraishi_06_kotoba_ushinau`** | 倉石暁 言葉を失う顔 | 失う=ushinau（usinau はタイポ） |
| `chr_inaba_01_shashin_no_waraui` | **`chr_inaba_01_furushashin_hohoemi`** | 稲葉悌二 古写真の中の柔らかい笑み | 笑み=emi/hohoemi（waraui は誤り）／古写真=furushashin |
| `bg_toshokan_shozoko` | **`bg_toshoshitsu_oku_shoko`** | 図書室奥の書庫（埃っぽい） | 図書館(toshokan)ではなく図書室(toshoshitsu)＝BG09 と語幹を統一／奥=oku 書庫=shoko（shozoko は混成） |
| `bg_hawaii_youganchi_kaisou` | **`bg_hawaii_yougan_daichi_kaisou`** | 回想・ハワイの溶岩台地 | 溶岩=yougan／台地=daichi（youganchi は混成） |
| `bg_yama_gensho_kaisou` | **`bg_yama_kaisou`** | 回想・稲葉と勝也がいた山（褪色調） | gensho が日本語として特定できない（褪色=taishoku／幻想=gensou のタイポか）。場所＝山＋回想で足りる |
| `bg_daigaku_yakou_kaisou` | **`bg_daigaku_camp_kaisou`** | 回想・大学時代の野外調査ベースキャンプ | 野外=yagai（yakou は「夜行」で別語）。ベースキャンプ=camp／台帳 meta も `yakou`→`camp` |
| `cg_kuhou_kageboushi` | **`cg_fuhou_kageboushi`** | 勝也 訃報を知った瞬間、シルエットのみ | 訃報=fuhou（kuhou は誤り） |

追従した箇所（すべて機械置換＋実ファイルの `git mv`）:

- 台帳 `data/assets.json`（`id` / `file`、BG22 は `meta: yakou → camp` も）
- 実ファイル `assets/bg/*.png` 4枚 ＋ 版B `game/assets/img/*.png` 4枚（`git mv`）
- 脚本 `data/script/*.txt` の `@bg` 4箇所・`@cg` 1箇所（立ち絵は `@chr slug=NN` 参照なので脚本の変更なし）
- 版B `game/js/assets_manifest.js` / `game/js/script_03_climax.js`
- 生成ツール `tools/map_assets.py` / `tools/rename_assets.py` / `tools/gen_asset_md.mjs`
- ドキュメント `ASSET_MAP.md` / `docs/CG_PROMPTS.md` / `docs/ART_SPEC.md` ＋ 自動生成物一式（`node tools/gen_asset_md.mjs`）
- `js/visual.js` の補完SVG（`case 'yakou'` → `case 'camp'`）／`js/game.js` の `guessTime()`（ dead になった `gensho` を除去）

**セーブ互換**: CG の回収記録は id で保存されるため、`cg_kuhou_kageboushi` → `cg_fuhou_kageboushi` の移行を
`js/store.js` の `ID_RENAME`（版A）と `game/js/engine.js` の `CG_RENAME`（版B）に入れました。
立ち絵は `meta.chr[slug] = [表情番号]` で保存しているので chr の改名はセーブに影響しません。

**演出への影響（1件だけ意図的な変化）**: `js/game.js` の `guessTime()` は背景名の語幹から照明トーンを推定します。
旧名 `bg_toshokan_shozoko` は綴り違いのため正規表現 `/shoko/` に当たらず `hiru`（昼）でしたが、
新名 `bg_toshoshitsu_oku_shoko` は当たって `gensou`（褪色・暖）になります ―― **元々の意図通り**（埃っぽい書庫に褪色）。
他の20件は挙動不変を機械確認済み。

### 2026-09-13(2) 版B の欠番表情を最寄りの現存差分へ remap（16箇所）

2026-09-13 の「未使用立ち絵27枚削除」は**版A の脚本（`data/script/*.txt`）だけを見て未使用判定**したため、
版B（`game/js/script_*.js`）が呼んでいた 11 種／16 箇所が欠番になっていました。
版B のエンジンは `exprs[0]`（＝通常顔）にフォールバックするので壊れはしませんが、表情が変わってしまっていたので、
**文脈を読んで最寄りの現存差分**に振り直しました（下表）。これで `node tools/check_script.cjs` は **エラー0件**。

| シーン | キャラ | 削除された表情 | → 振り直し | 根拠（前後の台詞） |
|---|---|---|---|---|
| `ch1_open[12]` | ryoma | ~~3 全力~~ | **2 ニヤリ** | 大げさに持ち上げる言い方（「素晴らしい」） |
| `b1_a[2]` | rei | ~~3 考え中~~ | **7 言葉を選ぶ顔** | 考えた末の一言「……確かに。一度もない」 |
| `b1_b[2]` | rei | ~~3 考え中~~ | **2 微笑** | 直後に ex rei 7 があるので微笑みへ |
| `d2_b[0]` | mie | ~~5 照れ~~ | **9 素直な微笑み** | 「爺ちゃん、いい人そうだな」 |
| `c1_a[0]` | terachi | ~~5 泣きそうなのを堪える~~ | **8 涙** | 「……お前にしか、か。重いな」 |
| `c2_b[1]` | terachi | ~~5 泣きそうなのを堪える~~ | **8 涙** | 紙の山の重さを語る場面 |
| `e1[10]` | mitsumine | ~~5 優しい~~ | **3 笑顔** | 「櫻と内藤さんも呼ぶよ」 |
| `e3_a[1]` | mie | ~~5 照れ~~ | **3 動揺** | 背中を叩かれて「（叩くな。撞んな。は？）」 |
| `e3_join[6]` | sakura | ~~3 照れ~~ | **6 柔らかい表情** | 「すみません、癖です」 |
| `f1_a[4]` | meshino | ~~3 照れ~~ | **6 しんみり** | 「完了済みの片思いに、新しい引数が」 |
| `f1_b[4]` | futami | ~~2 微笑~~ | **4 いたずらっぽい笑み** | 「似合いすぎて笑っちゃうわ」 |
| `f2[4]` | meshino | ~~3 照れ~~ | **6 しんみり** | 「嬉しい、ですか。あの塀先生が」 |
| `f2[6]` | futami | ~~2 微笑~~ | **4 いたずらっぽい笑み** | 直前の柔らかい笑い |
| `f2[15]` | meshino | ~~2 決め顔~~ | **5 英語ドヤ顔** | 決め顔＝ドヤ顔が最寄り |
| `h7[9]` | terachi | ~~7 読み上げ~~ | **8 涙** | **版A の同じ場面（60_climax:168 最後の朗読）が terachi=08** なので合わせた |
| `end_mitsumine` | mitsumine | ~~5 優しい~~ | **3 笑顔** | 桜並木の「来年も会おうか」 |

あわせて版B 側の2バグも修正:

- `game/js/engine.js` `chrFile()` が**配列の位置**で表情を引いていた（`exprs[expr-1]`）→ 欠番があると**別の表情の絵が出る**。`no` で引くように修正
- `tools/check_script.cjs` の範囲検査が**配列の長さ**基準（`1..length`）で、欠番を「範囲外」と誤検出していた（42件中27件がこれ）→ マニフェストに実在する `no` の集合で判定するように修正

版A（`data/script/*.txt`）は `@chr slug=NN` が全て現存差分を指しており、変更不要（`node tools/vncheck.mjs` で確認済み）。
