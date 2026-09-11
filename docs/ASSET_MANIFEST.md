# アセット対応表（仮画像 → 正式スロット名）

『まだ地図の途中で』〜✝本質✝特別編〜 企画書 第8章のアセット一覧に沿って、
`image1/ image2/ image3/` に置かれていた仮画像 `white_NNN.png`（400×300・白）を
正式なスロット名へリネーム・配置した対応表です。

- 画像の**中身は仮のまま**です（白い画像）。エンジン側は差し替え前提で、
  プレースホルダーでも画面が成立するよう背景・立ち絵は CSS/SVG で補完描画します。
- 実素材に差し替えたら `data/assets.json` の該当行 `placeholder` を `false` にしてください。
  それだけでフォールバック描画が消え、PNGがそのまま画面に出ます。
- 合成は `mix-blend-mode: multiply`（白＝透明扱い）で行うため、**白背景の線画**でもそのまま使えます。

## 内訳

| 区分 | 企画書の計画 | 本リポジトリで確保したスロット |
|---|---|---|
| 背景(BG) | 24 | 24 |
| 立ち絵差分 | 113 | 105（第5章の表情リスト合計。企画書の計数是差 -8） |
| 名場面CG | 38 | 30（8枚は演出整理で予備退避） |
| ED専用CG | 14 | 14 |
| UI／アイテム | 20 | 20 |
| 未割当バッファ | 約90 | 99（`assets/_buffer/`） |

※ 企画書 8.6 は立ち絵差分を113枚・総計209枚としていますが、8.2 の内訳表と
   第5章の表情リストは 105枚 / 201枚になります。表情リスト側を正として 105枚分を確保しました。
※ 企画書 5.5 の命名例は地図筒の場面を `cg_07_...` としていますが、8.3 の一覧では cg02 です。
   8.3 の番号を正とし、`cg_02_mie-katsuya_chizutsutsu.png` としました。

## 対応表

| # | 元ファイル | → 差し替え先 | 内容 |
|---|---|---|---|
| 1 | `image1/white_001.png` | `assets/bg/bg_hokutou_kyoshitsu_asa.png` | 北棟三年B組教室・朝 |
| 2 | `image2/white_002.png` | `assets/bg/bg_hokutou_kyoshitsu_hiru.png` | 北棟三年B組教室・昼休み |
| 3 | `image1/white_003.png` | `assets/bg/bg_hokutou_kyoshitsu_yuugata.png` | 北棟三年B組教室・夕方（茜色・逆光） |
| 4 | `image3/white_004.png` | `assets/bg/bg_hokutou_kyoshitsu_yoru.png` | 北棟三年B組教室・夜（サプライズ準備） |
| 5 | `image3/white_005.png` | `assets/bg/bg_rouka_hokutou.png` | 北棟廊下 |
| 6 | `image2/white_006.png` | `assets/bg/bg_kaidan_odoriba.png` | 階段の踊り場（掲示物あり） |
| 7 | `image3/white_007.png` | `assets/bg/bg_jimushitsu.png` | 職員室 |
| 8 | `image3/white_008.png` | `assets/bg/bg_chizu_hokanko.png` | 地図保管庫 |
| 9 | `image3/white_009.png` | `assets/bg/bg_toshoshitsu.png` | 図書室 |
| 10 | `image1/white_010.png` | `assets/bg/bg_toshokan_shozoko.png` | 図書室奥の書庫（埃っぽい） |
| 11 | `image1/white_011.png` | `assets/bg/bg_suiko_hotori.png` | 翠湖のほとり |
| 12 | `image1/white_012.png` | `assets/bg/bg_koutei_bunkasai_junbi.png` | 文化祭/謝恩会準備中の校庭 |
| 13 | `image2/white_013.png` | `assets/bg/bg_taiikukan.png` | 体育館（謝恩会当日） |
| 14 | `image1/white_014.png` | `assets/bg/bg_okujou.png` | 屋上 |
| 15 | `image2/white_015.png` | `assets/bg/bg_tsuugaku_densha_mado.png` | 通学電車の車窓（砂糖視点） |
| 16 | `image3/white_016.png` | `assets/bg/bg_sakura_namiki.png` | 南棟と北棟を繋ぐ桜並木（蕾） |
| 17 | `image1/white_017.png` | `assets/bg/bg_sotsugyoushiki_kaijou.png` | 卒業式会場 |
| 18 | `image3/white_018.png` | `assets/bg/bg_minamitou_kyoshitsu.png` | 南棟三年教室 |
| 19 | `image3/white_019.png` | `assets/bg/bg_ryoma_ie_butsudan.png` | 両馬の家・祖父の遺影がある部屋 |
| 20 | `image1/white_020.png` | `assets/bg/bg_hawaii_youganchi_kaisou.png` | 回想・ハワイの溶岩台地 |
| 21 | `image2/white_021.png` | `assets/bg/bg_yama_gensho_kaisou.png` | 回想・稲葉と勝也がいた山（褪色調） |
| 22 | `image2/white_022.png` | `assets/bg/bg_daigaku_yakou_kaisou.png` | 回想・大学時代の野外調査ベースキャンプ |
| 23 | `image3/white_023.png` | `assets/bg/bg_kyoshitsu_haru_sotsugyougo.png` | エピローグ・卒業後の春、もぬけの殻の教室 |
| 24 | `image3/white_024.png` | `assets/bg/bg_kyoshitsu_suunengo.png` | TRUE END後日談・数年後の同じ教室 |
| 25 | `image3/white_025.png` | `assets/chr/chr_katsuya_01_tsuujou.png` | 立ち絵差分 塀勝也／通常（穏やか） |
| 26 | `image1/white_026.png` | `assets/chr/chr_katsuya_02_hohoemi.png` | 立ち絵差分 塀勝也／微笑 |
| 27 | `image3/white_027.png` | `assets/chr/chr_katsuya_03_tooi_me.png` | 立ち絵差分 塀勝也／遠い目 |
| 28 | `image1/white_028.png` | `assets/chr/chr_katsuya_04_odoroki.png` | 立ち絵差分 塀勝也／驚き |
| 29 | `image1/white_029.png` | `assets/chr/chr_katsuya_05_me_fuseru.png` | 立ち絵差分 塀勝也／目を伏せる |
| 30 | `image2/white_030.png` | `assets/chr/chr_katsuya_06_kataki_muten.png` | 立ち絵差分 塀勝也／硬い無表情 |
| 31 | `image1/white_031.png` | `assets/chr/chr_katsuya_07_kaisou_me_soseru.png` | 立ち絵差分 塀勝也／回想・目を細める |
| 32 | `image1/white_032.png` | `assets/chr/chr_katsuya_08_namida_koraeru.png` | 立ち絵差分 塀勝也／涙をこらえる |
| 33 | `image3/white_033.png` | `assets/chr/chr_katsuya_09_naku.png` | 立ち絵差分 塀勝也／泣く |
| 34 | `image1/white_034.png` | `assets/chr/chr_katsuya_10_hareyaka_emmi.png` | 立ち絵差分 塀勝也／晴れやかな笑み |
| 35 | `image3/white_035.png` | `assets/chr/chr_ryoma_01_tsuujou.png` | 立ち絵差分 両馬二郎／通常 |
| 36 | `image1/white_036.png` | `assets/chr/chr_ryoma_02_niyari.png` | 立ち絵差分 両馬二郎／ニヤリ |
| 37 | `image3/white_037.png` | `assets/chr/chr_ryoma_03_zenryoku.png` | 立ち絵差分 両馬二郎／全力 |
| 38 | `image1/white_038.png` | `assets/chr/chr_ryoma_04_kinimo_majime.png` | 立ち絵差分 両馬二郎／急に真顔 |
| 39 | `image2/white_039.png` | `assets/chr/chr_ryoma_05_shonbori.png` | 立ち絵差分 両馬二郎／しょんぼり |
| 40 | `image1/white_040.png` | `assets/chr/chr_ryoma_06_nakiwarai.png` | 立ち絵差分 両馬二郎／泣き笑い |
| 41 | `image3/white_041.png` | `assets/chr/chr_ryoma_07_shinken_ketsui.png` | 立ち絵差分 両馬二郎／真剣な決意顔 |
| 42 | `image3/white_042.png` | `assets/chr/chr_ryoma_08_terekakushi.png` | 立ち絵差分 両馬二郎／照れ隠しで頭をかく |
| 43 | `image3/white_043.png` | `assets/chr/chr_ryoma_09_goukyuu.png` | 立ち絵差分 両馬二郎／号泣 |
| 44 | `image1/white_044.png` | `assets/chr/chr_mie_01_reishou.png` | 立ち絵差分 三重県臣／通常（冷笑・半目） |
| 45 | `image3/white_045.png` | `assets/chr/chr_mie_02_ha.png` | 立ち絵差分 三重県臣／「は？」 |
| 46 | `image1/white_046.png` | `assets/chr/chr_mie_03_douyou.png` | 立ち絵差分 三重県臣／動揺 |
| 47 | `image1/white_047.png` | `assets/chr/chr_mie_04_chimatsu.png` | 立ち絵差分 三重県臣／気まずい沈黙 |
| 48 | `image2/white_048.png` | `assets/chr/chr_mie_05_tere.png` | 立ち絵差分 三重県臣／照れ |
| 49 | `image1/white_049.png` | `assets/chr/chr_mie_06_iraduki_shinken.png` | 立ち絵差分 三重県臣／苛立ち混じりの真剣 |
| 50 | `image3/white_050.png` | `assets/chr/chr_mie_07_honki_shinken.png` | 立ち絵差分 三重県臣／本気の真剣 |
| 51 | `image3/white_051.png` | `assets/chr/chr_mie_08_namida_kamu.png` | 立ち絵差分 三重県臣／涙をこらえて唇を噛む |
| 52 | `image1/white_052.png` | `assets/chr/chr_mie_09_sunao_hohoemi.png` | 立ち絵差分 三重県臣／初めての素直な微笑み |
| 53 | `image1/white_053.png` | `assets/chr/chr_mie_10_nakigao.png` | 立ち絵差分 三重県臣／泣き顔 |
| 54 | `image1/white_054.png` | `assets/chr/chr_terachi_01_nemusou.png` | 立ち絵差分 寺地星／通常（眠そう・淡々） |
| 55 | `image3/white_055.png` | `assets/chr/chr_terachi_02_komatte_kataaru.png` | 立ち絵差分 寺地星／困惑して固まる |
| 56 | `image2/white_056.png` | `assets/chr/chr_terachi_03_hansya_shinken.png` | 立ち絵差分 寺地星／真剣な配信者の顔 |
| 57 | `image1/white_057.png` | `assets/chr/chr_terachi_04_ureshii.png` | 立ち絵差分 寺地星／嬉しい |
| 58 | `image3/white_058.png` | `assets/chr/chr_terachi_05_nakisou_koraeru.png` | 立ち絵差分 寺地星／泣きそうなのを堪える |
| 59 | `image3/white_059.png` | `assets/chr/chr_terachi_06_maiku_no_ketsui.png` | 立ち絵差分 寺地星／マイク前の決意顔 |
| 60 | `image3/white_060.png` | `assets/chr/chr_terachi_07_yomiage.png` | 立ち絵差分 寺地星／声を震わせながら読み上げる |
| 61 | `image3/white_061.png` | `assets/chr/chr_terachi_08_namida.png` | 立ち絵差分 寺地星／涙 |
| 62 | `image1/white_062.png` | `assets/chr/chr_satou_01_game_shuuchuu.png` | 立ち絵差分 砂糖東洋／通常（ゲーム画面凝視） |
| 63 | `image1/white_063.png` | `assets/chr/chr_satou_02_muten.png` | 立ち絵差分 砂糖東洋／無表情（素） |
| 64 | `image3/white_064.png` | `assets/chr/chr_satou_03_kao_ageta.png` | 立ち絵差分 砂糖東洋／驚き（画面から顔を上げる） |
| 65 | `image2/white_065.png` | `assets/chr/chr_satou_04_soppo.png` | 立ち絵差分 砂糖東洋／照れ隠しでそっぽを向く |
| 66 | `image3/white_066.png` | `assets/chr/chr_satou_05_camera.png` | 立ち絵差分 砂糖東洋／真剣にカメラを構える顔 |
| 67 | `image2/white_067.png` | `assets/chr/chr_satou_06_hohoemi.png` | 立ち絵差分 砂糖東洋／微笑み（レア） |
| 68 | `image3/white_068.png` | `assets/chr/chr_satou_07_tsumaru.png` | 立ち絵差分 砂糖東洋／言葉に詰まる顔 |
| 69 | `image3/white_069.png` | `assets/chr/chr_satou_08_hikari_koraeru.png` | 立ち絵差分 砂糖東洋／目に光るものを堪える顔 |
| 70 | `image3/white_070.png` | `assets/chr/chr_rei_01_suzushii.png` | 立ち絵差分 数理零／通常（涼しい顔） |
| 71 | `image3/white_071.png` | `assets/chr/chr_rei_02_hohoemi.png` | 立ち絵差分 数理零／微笑 |
| 72 | `image1/white_072.png` | `assets/chr/chr_rei_03_kangaechuu.png` | 立ち絵差分 数理零／考え中（顎に手） |
| 73 | `image1/white_073.png` | `assets/chr/chr_rei_04_odoroki.png` | 立ち絵差分 数理零／驚き |
| 74 | `image3/white_074.png` | `assets/chr/chr_rei_05_data_shinken.png` | 立ち絵差分 数理零／真剣（データと向き合う） |
| 75 | `image1/white_075.png` | `assets/chr/chr_rei_06_yasashii_me.png` | 立ち絵差分 数理零／優しい目 |
| 76 | `image1/white_076.png` | `assets/chr/chr_rei_07_kotoba_erabu.png` | 立ち絵差分 数理零／言葉を選ぶ顔 |
| 77 | `image2/white_077.png` | `assets/chr/chr_rei_08_me_rumaseru.png` | 立ち絵差分 数理零／目を潤ませる |
| 78 | `image3/white_078.png` | `assets/chr/chr_izaki_01_tsuujou.png` | 立ち絵差分 伊崎／通常 |
| 79 | `image2/white_079.png` | `assets/chr/chr_izaki_02_egao.png` | 立ち絵差分 伊崎／笑顔 |
| 80 | `image1/white_080.png` | `assets/chr/chr_izaki_03_komari.png` | 立ち絵差分 伊崎／困り顔 |
| 81 | `image1/white_081.png` | `assets/chr/chr_izaki_04_shikiri.png` | 立ち絵差分 伊崎／真剣（仕切る顔） |
| 82 | `image2/white_082.png` | `assets/chr/chr_izaki_05_odoroki.png` | 立ち絵差分 伊崎／驚き |
| 83 | `image1/white_083.png` | `assets/chr/chr_izaki_06_shimiemi.png` | 立ち絵差分 伊崎／しみじみとした微笑み |
| 84 | `image2/white_084.png` | `assets/chr/chr_izumi_01_tsuujou.png` | 立ち絵差分 伊豆見／通常 |
| 85 | `image2/white_085.png` | `assets/chr/chr_izumi_02_egao.png` | 立ち絵差分 伊豆見／笑顔 |
| 86 | `image2/white_086.png` | `assets/chr/chr_izumi_03_kinchou.png` | 立ち絵差分 伊豆見／緊張 |
| 87 | `image1/white_087.png` | `assets/chr/chr_izumi_04_ketsui.png` | 立ち絵差分 伊豆見／決意 |
| 88 | `image1/white_088.png` | `assets/chr/chr_izumi_05_tere.png` | 立ち絵差分 伊豆見／照れ |
| 89 | `image3/white_089.png` | `assets/chr/chr_izumi_06_hokorashige.png` | 立ち絵差分 伊豆見／誇らしげ |
| 90 | `image3/white_090.png` | `assets/chr/chr_meshino_01_tsuujou.png` | 立ち絵差分 召野カイト／通常 |
| 91 | `image2/white_091.png` | `assets/chr/chr_meshino_02_kimegao.png` | 立ち絵差分 召野カイト／決め顔 |
| 92 | `image2/white_092.png` | `assets/chr/chr_meshino_03_tere.png` | 立ち絵差分 召野カイト／照れ |
| 93 | `image1/white_093.png` | `assets/chr/chr_meshino_04_shinken.png` | 立ち絵差分 召野カイト／真剣 |
| 94 | `image3/white_094.png` | `assets/chr/chr_meshino_05_eigo_doya.png` | 立ち絵差分 召野カイト／英語ドヤ顔 |
| 95 | `image3/white_095.png` | `assets/chr/chr_meshino_06_shinmiri.png` | 立ち絵差分 召野カイト／しんみり |
| 96 | `image2/white_096.png` | `assets/chr/chr_kuraishi_01_kekkyou.png` | 立ち絵差分 倉石暁／通常（熱狂） |
| 97 | `image3/white_097.png` | `assets/chr/chr_kuraishi_02_kanshou.png` | 立ち絵差分 倉石暁／感激 |
| 98 | `image2/white_098.png` | `assets/chr/chr_kuraishi_03_chousa_shinken.png` | 立ち絵差分 倉石暁／真剣（調査中） |
| 99 | `image3/white_099.png` | `assets/chr/chr_kuraishi_04_shonbori.png` | 立ち絵差分 倉石暁／しょんぼり |
| 100 | `image1/white_100.png` | `assets/chr/chr_kuraishi_05_hokorashige.png` | 立ち絵差分 倉石暁／誇らしげ |
| 101 | `image3/white_101.png` | `assets/chr/chr_kuraishi_06_kotoba_usinau.png` | 立ち絵差分 倉石暁／言葉を失う顔 |
| 102 | `image1/white_102.png` | `assets/chr/chr_kuraishi_07_namidagumu.png` | 立ち絵差分 倉石暁／涙ぐむ |
| 103 | `image1/white_103.png` | `assets/chr/chr_futami_01_tsuujou.png` | 立ち絵差分 二見玲子／通常 |
| 104 | `image3/white_104.png` | `assets/chr/chr_futami_02_hohoemi.png` | 立ち絵差分 二見玲子／微笑 |
| 105 | `image1/white_105.png` | `assets/chr/chr_futami_03_shinpai.png` | 立ち絵差分 二見玲子／心配顔 |
| 106 | `image1/white_106.png` | `assets/chr/chr_futami_04_itazura.png` | 立ち絵差分 二見玲子／いたずらっぽい笑み |
| 107 | `image3/white_107.png` | `assets/chr/chr_futami_05_yokogao.png` | 立ち絵差分 二見玲子／しんみりした横顔 |
| 108 | `image3/white_108.png` | `assets/chr/chr_sakura_01_tsuujou.png` | 立ち絵差分 櫻優／通常 |
| 109 | `image3/white_109.png` | `assets/chr/chr_sakura_02_kenkyuusha.png` | 立ち絵差分 櫻優／真剣（研究者モード） |
| 110 | `image1/white_110.png` | `assets/chr/chr_sakura_03_tere.png` | 立ち絵差分 櫻優／照れ |
| 111 | `image1/white_111.png` | `assets/chr/chr_sakura_04_douyou.png` | 立ち絵差分 櫻優／動揺 |
| 112 | `image1/white_112.png` | `assets/chr/chr_sakura_05_egao.png` | 立ち絵差分 櫻優／笑顔 |
| 113 | `image1/white_113.png` | `assets/chr/chr_sakura_06_yawarakai.png` | 立ち絵差分 櫻優／柔らかい表情 |
| 114 | `image3/white_114.png` | `assets/chr/chr_mitsumine_01_tsuujou.png` | 立ち絵差分 三峰瑠衣／通常 |
| 115 | `image1/white_115.png` | `assets/chr/chr_mitsumine_02_tsukkomi.png` | 立ち絵差分 三峰瑠衣／ツッコミ顔 |
| 116 | `image3/white_116.png` | `assets/chr/chr_mitsumine_03_egao.png` | 立ち絵差分 三峰瑠衣／笑顔 |
| 117 | `image2/white_117.png` | `assets/chr/chr_mitsumine_04_akire.png` | 立ち絵差分 三峰瑠衣／呆れ |
| 118 | `image1/white_118.png` | `assets/chr/chr_mitsumine_05_yasashii.png` | 立ち絵差分 三峰瑠衣／優しい顔 |
| 119 | `image2/white_119.png` | `assets/chr/chr_mitsumine_06_ha.png` | 立ち絵差分 三峰瑠衣／「は？」（ハモリ専用） |
| 120 | `image2/white_120.png` | `assets/chr/chr_naitou_01_tsuujou.png` | 立ち絵差分 内藤蘭／通常 |
| 121 | `image2/white_121.png` | `assets/chr/chr_naitou_02_hohoemi.png` | 立ち絵差分 内藤蘭／微笑 |
| 122 | `image3/white_122.png` | `assets/chr/chr_naitou_03_dokusho.png` | 立ち絵差分 内藤蘭／読書中（伏し目） |
| 123 | `image2/white_123.png` | `assets/chr/chr_naitou_04_odoroki.png` | 立ち絵差分 内藤蘭／驚き |
| 124 | `image3/white_124.png` | `assets/chr/chr_naitou_05_yasashii_me.png` | 立ち絵差分 内藤蘭／優しい目 |
| 125 | `image2/white_125.png` | `assets/chr/chr_naitou_06_sukoshi_warau.png` | 立ち絵差分 内藤蘭／少し笑う |
| 126 | `image1/white_126.png` | `assets/chr/chr_inaba_01_shashin_no_waraui.png` | 立ち絵差分 稲葉悌二（回想専用）／古写真の中の柔らかい笑み |
| 127 | `image1/white_127.png` | `assets/chr/chr_inaba_02_yama_sasu.png` | 立ち絵差分 稲葉悌二（回想専用）／山を指差す横顔 |
| 128 | `image2/white_128.png` | `assets/chr/chr_wakaki-katsuya_01_waratteiru.png` | 立ち絵差分 若き日の塀勝也（回想専用）／笑っている |
| 129 | `image3/white_129.png` | `assets/chr/chr_wakaki-katsuya_02_bousen.png` | 立ち絵差分 若き日の塀勝也（回想専用）／呆然としている |
| 130 | `image1/white_130.png` | `assets/cg/cg_01_mie_kyoushitsu_yobidome.png` | 三重（単独）／BG01・朝。入口で勝也に呼び止められる横顔。 |
| 131 | `image1/white_131.png` | `assets/cg/cg_02_mie-katsuya_chizutsutsu.png` | 三重／勝也／BG08。地図筒の蓋が外れ古写真がこぼれ落ちる瞬間（スロー）。 |
| 132 | `image1/white_132.png` | `assets/cg/cg_03_mie_shashin_ura.png` | 三重（手元アップ）／BG08。写真の裏の万年筆の文字を読む。 |
| 133 | `image1/white_133.png` | `assets/cg/cg_04_katsuya_shashin_kaishuu.png` | 勝也（単独）／BG08。写真を静かに回収する硬い表情。 |
| 134 | `image1/white_134.png` | `assets/cg/cg_05_mie-ryoma_rouka_yuuyake.png` | 三重／両馬／BG05・放課後。夕陽の廊下で打ち明ける横並び構図。 |
| 135 | `image1/white_135.png` | `assets/cg/cg_06_satou_shadou_scratch.png` | 砂糖（単独）／BG15。三年分の車窓写真をスマホでスクロールする手元。 |
| 136 | `image2/white_136.png` | `assets/cg/cg_07_satou-mie_miteru_to_iu.png` | 砂糖／三重／BG01・放課後。「見てた」と認める瞬間、窓を背に。 |
| 137 | `image1/white_137.png` | `assets/_buffer/cg_08_rei_tosho_note.png` | 零（単独）／BG09。ノートPCの画面光が横顔を照らす。 |
| 138 | `image1/white_138.png` | `assets/cg/cg_09_rei-ryoma-mie_daiji.png` | 零／両馬／三重／BG01。「面白いからじゃなくて、大事だと思うから」。 |
| 139 | `image1/white_139.png` | `assets/cg/cg_10_terachi_kami_no_tasoku.png` | 寺地（単独）／BG01・放課後。引き出しの三年分の紙束。 |
| 140 | `image3/white_140.png` | `assets/_buffer/cg_11_terachi-ryoma-mie_unsei.png` | 寺地／両馬／三重／BG01。「暴露じゃなくて、ありがとうの会」で頷き合う。 |
| 141 | `image1/white_141.png` | `assets/cg/cg_12_ryoma_butsudan_ushiro.png` | 両馬（単独）／BG19。仏壇の前に正座する後ろ姿、線香の煙。 |
| 142 | `image1/white_142.png` | `assets/cg/cg_13_ryoma-mie_narabu_zaseki.png` | 両馬／三重／BG19。祖父の口癖を話す生活感のある並席。 |
| 143 | `image2/white_143.png` | `assets/cg/cg_14_kuraishi_shinbun_haikyou.png` | 倉石（単独）／BG10。埃まみれの学校新聞を読んで言葉を失う。 |
| 144 | `image1/white_144.png` | `assets/_buffer/cg_15_kuraishi-ryoma-mie_houkoku.png` | 倉石／両馬／三重／BG01。調査結果の報告。息を呑む二人。 |
| 145 | `image2/white_145.png` | `assets/cg/cg_16_meshino-futami_jimushitsu.png` | 召野／二見／BG07。窓越しの光、少し距離のある立ち位置。 |
| 146 | `image3/white_146.png` | `assets/cg/cg_17_mie-mitsumine_sakura_tsubomi.png` | 三重／三峰／BG16。国境をまたぐ桜並木（まだ蕾）。 |
| 147 | `image3/white_147.png` | `assets/_buffer/cg_18_mie-minamitou3_kyoudai.png` | 三重／三峰／櫻／内藤／BG18。えんじのネクタイが南棟に浮く構図。 |
| 148 | `image1/white_148.png` | `assets/cg/cg_19_naitou_zutto_miteimasu.png` | 内藤（単独）／BG18。伏し目から顔を上げる一瞬。 |
| 149 | `image1/white_149.png` | `assets/cg/cg_20_all_yoru_no_chizu.png` | 全員集合／BG04・夜。机を寄せ合い地図を作る俯瞰構図。 |
| 150 | `image3/white_150.png` | `assets/_buffer/cg_21_ryoma_yohaku_ni_kaku.png` | 両馬（手元アップ）／BG01・夜。地図の隅に何かを書き足す。 |
| 151 | `image1/white_151.png` | `assets/cg/cg_22_omoide_no_chizu_kansei.png` | 「思い出の地形図」完成図。画面いっぱいの作品アート。 |
| 152 | `image2/white_152.png` | `assets/cg/cg_23_katsuya_yuugata_madobe.png` | 勝也（単独・後ろ姿）／BG03。誰もいない教室の窓際。 |
| 153 | `image2/white_153.png` | `assets/_buffer/cg_24_katsuya_zecchuu.png` | 勝也（単独）／BG13相当。地図を渡され絶句する正面カット。 |
| 154 | `image3/white_154.png` | `assets/_buffer/cg_25_mie-katsuya_kiite_ii.png` | 三重／勝也。ミディアムショット、「先生、聞いていいですか」。 |
| 155 | `image2/white_155.png` | `assets/cg/cg_26_katsuya_chii_shijima.png` | 勝也（単独）。いつもの五秒より長い沈黙、表情が見える角度。 |
| 156 | `image2/white_156.png` | `assets/cg/cg_27_wakaki-inaba_hajimete_chizu.png` | 若き勝也／稲葉／BG21。初めて地形図を渡される山の上（褪色）。 |
| 157 | `image1/white_157.png` | `assets/cg/cg_28_wakaki-katsuya_fukumu.png` | 若き勝也（回想・単独）／BG22。生意気を言った日、俯く。 |
| 158 | `image1/white_158.png` | `assets/cg/cg_29_katsuya_kuhou_silhouette.png` | 勝也（回想の切れ目）／BG21。訃報を知った瞬間、シルエットのみ。 |
| 159 | `image2/white_159.png` | `assets/cg/cg_30_katsuya_gojikan_no_houkoku.png` | 勝也（単独）／BG13。「窓の外を見るたび、報告していた」。 |
| 160 | `image2/white_160.png` | `assets/cg/cg_31_all-katsuya_sasuragasu.png` | 全員集合／勝也／BG13。生徒たちを見渡す広い構図。 |
| 161 | `image3/white_161.png` | `assets/cg/cg_32_terachi_saigo_no_roudoku.png` | 寺地（単独・朗読）／BG13。スマホのライトが顔を照らす。 |
| 162 | `image3/white_162.png` | `assets/_buffer/cg_33_all-katsuya_hitorizutsu.png` | 全員集合／勝也／BG13。一人ずつの一言、涙をこらえる。 |
| 163 | `image2/white_163.png` | `assets/cg/cg_34_katsuya_hareyaka.png` | 勝也（単独）／BG13。締めの台詞、晴れやかな笑み（表情⑩）。 |
| 164 | `image2/white_164.png` | `assets/cg/cg_35_all_sotsugyou_sakurafubu.png` | 全員集合／BG17。卒業式、桜吹雪。 |
| 165 | `image2/white_165.png` | `assets/cg/cg_36_katsuya_suunengo_kyoushitsu.png` | 勝也（単独）／BG24。数年後、新一年に同じ地図を見せる。 |
| 166 | `image3/white_166.png` | `assets/cg/cg_37_mie-mitsumine_mankai.png` | 三重／三峰／BG16。満開の桜（南棟編Flag高で挿入）。 |
| 167 | `image2/white_167.png` | `assets/cg/cg_38_ryoma_hakamairi.png` | 両馬（単独）／BG19。墓参りシーン（共通カットの派生）。 |
| 168 | `image3/white_168.png` | `assets/cg/cg_end_true.png` | TRUE END ―― 数年後の教室で地図を見せる勝也＋卒業アルバムのモンタージュ |
| 169 | `image2/white_169.png` | `assets/cg/cg_end_mie.png` | GOOD END・三重 ―― 教壇に立つ練習 |
| 170 | `image3/white_170.png` | `assets/cg/cg_end_satou.png` | GOOD END・砂糖 ―― フィールドで堂々と空を見上げる |
| 171 | `image2/white_171.png` | `assets/cg/cg_end_rei.png` | GOOD END・零 ―― 研究室でPCに向かいながら微笑む |
| 172 | `image1/white_172.png` | `assets/cg/cg_end_terachi.png` | GOOD END・寺地 ―― 紙束が増えた配信机 |
| 173 | `image2/white_173.png` | `assets/cg/cg_end_ryoma.png` | GOOD END・両馬 ―― 祖父の墓前で笑って報告 |
| 174 | `image2/white_174.png` | `assets/cg/cg_end_izaki_izumi.png` | GOOD END・伊崎＋伊豆見 ―― 別々の道で並んで笑う |
| 175 | `image2/white_175.png` | `assets/cg/cg_end_meshino.png` | GOOD END・召野 ―― 教壇／留学先を思わせる一枚 |
| 176 | `image2/white_176.png` | `assets/cg/cg_end_kuraishi.png` | GOOD END・倉石 ―― 後輩に年鑑を託す |
| 177 | `image1/white_177.png` | `assets/cg/cg_end_minamitou.png` | GOOD END・南棟 ―― 櫻・内藤・三峰の穏やかな一枚 |
| 178 | `image1/white_178.png` | `assets/cg/cg_end_normal.png` | NORMAL END ―― 桜の下、いつも通りの日常 |
| 179 | `image3/white_179.png` | `assets/cg/cg_end_bittersweet.png` | BITTERSWEET END ―― 小さくまとまったサプライズ、それでも笑い合う |
| 180 | `image2/white_180.png` | `assets/cg/cg_end_comedy.png` | COMEDY SECRET END ―― 勝也が「……本質かもな」と言ってしまう |
| 181 | `image1/white_181.png` | `assets/cg/cg_end_bonus.png` | BONUS EXTRA ―― 数年後の翠湖のほとり、同窓会集合カット |
| 182 | `image1/white_182.png` | `assets/ui/ui01_title_logo.png` | タイトルロゴ「まだ地図の途中で」 |
| 183 | `image3/white_183.png` | `assets/ui/ui02_frame_line_chat.png` | LINEグループチャット画面フレーム |
| 184 | `image1/white_184.png` | `assets/ui/ui03_frame_bbs_heikatsu.png` | 匿名掲示板（ヘイカツスレ）画面フレーム |
| 185 | `image3/white_185.png` | `assets/ui/ui04_frame_juken_bbs.png` | 受験情報掲示板（フェイカツ書き込み）画面フレーム |
| 186 | `image2/white_186.png` | `assets/ui/ui05_frame_honshitsu_live.png` | 本質配信・配信画面UI（コメント欄含む） |
| 187 | `image2/white_187.png` | `assets/ui/ui06_icon_honshitsu_nenkan.png` | ✝本質✝年鑑・表紙アイコン |
| 188 | `image2/white_188.png` | `assets/ui/ui07_icon_honshitsu_guide.png` | ✝本質✝入門ガイド・表紙アイコン |
| 189 | `image2/white_189.png` | `assets/ui/ui08_icon_gakko_shinbun.png` | 古い学校新聞・紙面アイコン |
| 190 | `image3/white_190.png` | `assets/ui/ui09_icon_ko_shashin.png` | 古写真アイコン（単体・所持品表示用） |
| 191 | `image3/white_191.png` | `assets/ui/ui10_icon_chizutsutsu.png` | 地図筒アイコン |
| 192 | `image2/white_192.png` | `assets/ui/ui11_icon_kami_magicpen.png` | 紙とマジックペン（寺地の配信道具）アイコン |
| 193 | `image2/white_193.png` | `assets/ui/ui12_icon_omoide_chizu.png` | 「思い出の地形図」ミニアイコン |
| 194 | `image1/white_194.png` | `assets/ui/ui13_frame_choice.png` | 選択肢ウィンドウ用フレーム |
| 195 | `image2/white_195.png` | `assets/ui/ui14_frame_kokoro_gauge.png` | 心Pointゲージ用フレーム（内部管理UI） |
| 196 | `image1/white_196.png` | `assets/ui/ui15_frame_chapter_title.png` | 章タイトル表示用の地形図柄フレーム |
| 197 | `image3/white_197.png` | `assets/ui/ui16_bg_save_load.png` | セーブ／ロード画面用の地図柄背景装飾 |
| 198 | `image3/white_198.png` | `assets/ui/ui17_bg_hub_map.png` | HUB（ルート選択）画面用のマップ風背景 |
| 199 | `image1/white_199.png` | `assets/ui/ui18_frame_end_logo.png` | エンドロゴ共通フレーム（色違いで各EDに流用） |
| 200 | `image2/white_200.png` | `assets/ui/ui19_icon_sotsugyou_shousho.png` | 卒業証書アイコン |
| 201 | `image3/white_201.png` | `assets/ui/ui20_icon_corn_soup.png` | コーンスープ缶アイコン（小ネタ回収用） |

### 未割当バッファ（表情差分・サブキャラ追加用 / 99枚）

- `assets/_buffer/white_202.png`（元 `image1/white_202.png`）
- `assets/_buffer/white_203.png`（元 `image2/white_203.png`）
- `assets/_buffer/white_204.png`（元 `image3/white_204.png`）
- `assets/_buffer/white_205.png`（元 `image2/white_205.png`）
- `assets/_buffer/white_206.png`（元 `image2/white_206.png`）
- `assets/_buffer/white_207.png`（元 `image1/white_207.png`）
- `assets/_buffer/white_208.png`（元 `image2/white_208.png`）
- `assets/_buffer/white_209.png`（元 `image2/white_209.png`）
- `assets/_buffer/white_210.png`（元 `image2/white_210.png`）
- `assets/_buffer/white_211.png`（元 `image3/white_211.png`）
- `assets/_buffer/white_212.png`（元 `image2/white_212.png`）
- `assets/_buffer/white_213.png`（元 `image1/white_213.png`）
- `assets/_buffer/white_214.png`（元 `image3/white_214.png`）
- `assets/_buffer/white_215.png`（元 `image3/white_215.png`）
- `assets/_buffer/white_216.png`（元 `image2/white_216.png`）
- `assets/_buffer/white_217.png`（元 `image2/white_217.png`）
- `assets/_buffer/white_218.png`（元 `image2/white_218.png`）
- `assets/_buffer/white_219.png`（元 `image3/white_219.png`）
- `assets/_buffer/white_220.png`（元 `image2/white_220.png`）
- `assets/_buffer/white_221.png`（元 `image2/white_221.png`）
- `assets/_buffer/white_222.png`（元 `image1/white_222.png`）
- `assets/_buffer/white_223.png`（元 `image2/white_223.png`）
- `assets/_buffer/white_224.png`（元 `image2/white_224.png`）
- `assets/_buffer/white_225.png`（元 `image3/white_225.png`）
- `assets/_buffer/white_226.png`（元 `image2/white_226.png`）
- `assets/_buffer/white_227.png`（元 `image2/white_227.png`）
- `assets/_buffer/white_228.png`（元 `image1/white_228.png`）
- `assets/_buffer/white_229.png`（元 `image3/white_229.png`）
- `assets/_buffer/white_230.png`（元 `image2/white_230.png`）
- `assets/_buffer/white_231.png`（元 `image2/white_231.png`）
- `assets/_buffer/white_232.png`（元 `image3/white_232.png`）
- `assets/_buffer/white_233.png`（元 `image1/white_233.png`）
- `assets/_buffer/white_234.png`（元 `image3/white_234.png`）
- `assets/_buffer/white_235.png`（元 `image2/white_235.png`）
- `assets/_buffer/white_236.png`（元 `image1/white_236.png`）
- `assets/_buffer/white_237.png`（元 `image2/white_237.png`）
- `assets/_buffer/white_238.png`（元 `image2/white_238.png`）
- `assets/_buffer/white_239.png`（元 `image2/white_239.png`）
- `assets/_buffer/white_240.png`（元 `image2/white_240.png`）
- `assets/_buffer/white_241.png`（元 `image3/white_241.png`）
- `assets/_buffer/white_242.png`（元 `image2/white_242.png`）
- `assets/_buffer/white_243.png`（元 `image3/white_243.png`）
- `assets/_buffer/white_244.png`（元 `image2/white_244.png`）
- `assets/_buffer/white_245.png`（元 `image3/white_245.png`）
- `assets/_buffer/white_246.png`（元 `image1/white_246.png`）
- `assets/_buffer/white_247.png`（元 `image2/white_247.png`）
- `assets/_buffer/white_248.png`（元 `image1/white_248.png`）
- `assets/_buffer/white_249.png`（元 `image1/white_249.png`）
- `assets/_buffer/white_250.png`（元 `image2/white_250.png`）
- `assets/_buffer/white_251.png`（元 `image1/white_251.png`）
- `assets/_buffer/white_252.png`（元 `image3/white_252.png`）
- `assets/_buffer/white_253.png`（元 `image2/white_253.png`）
- `assets/_buffer/white_254.png`（元 `image1/white_254.png`）
- `assets/_buffer/white_255.png`（元 `image2/white_255.png`）
- `assets/_buffer/white_256.png`（元 `image2/white_256.png`）
- `assets/_buffer/white_257.png`（元 `image1/white_257.png`）
- `assets/_buffer/white_258.png`（元 `image1/white_258.png`）
- `assets/_buffer/white_259.png`（元 `image1/white_259.png`）
- `assets/_buffer/white_260.png`（元 `image3/white_260.png`）
- `assets/_buffer/white_261.png`（元 `image3/white_261.png`）
- `assets/_buffer/white_262.png`（元 `image2/white_262.png`）
- `assets/_buffer/white_263.png`（元 `image1/white_263.png`）
- `assets/_buffer/white_264.png`（元 `image3/white_264.png`）
- `assets/_buffer/white_265.png`（元 `image3/white_265.png`）
- `assets/_buffer/white_266.png`（元 `image3/white_266.png`）
- `assets/_buffer/white_267.png`（元 `image3/white_267.png`）
- `assets/_buffer/white_268.png`（元 `image2/white_268.png`）
- `assets/_buffer/white_269.png`（元 `image3/white_269.png`）
- `assets/_buffer/white_270.png`（元 `image3/white_270.png`）
- `assets/_buffer/white_271.png`（元 `image1/white_271.png`）
- `assets/_buffer/white_272.png`（元 `image2/white_272.png`）
- `assets/_buffer/white_273.png`（元 `image3/white_273.png`）
- `assets/_buffer/white_274.png`（元 `image3/white_274.png`）
- `assets/_buffer/white_275.png`（元 `image1/white_275.png`）
- `assets/_buffer/white_276.png`（元 `image2/white_276.png`）
- `assets/_buffer/white_277.png`（元 `image2/white_277.png`）
- `assets/_buffer/white_278.png`（元 `image2/white_278.png`）
- `assets/_buffer/white_279.png`（元 `image3/white_279.png`）
- `assets/_buffer/white_280.png`（元 `image2/white_280.png`）
- `assets/_buffer/white_281.png`（元 `image2/white_281.png`）
- `assets/_buffer/white_282.png`（元 `image2/white_282.png`）
- `assets/_buffer/white_283.png`（元 `image1/white_283.png`）
- `assets/_buffer/white_284.png`（元 `image1/white_284.png`）
- `assets/_buffer/white_285.png`（元 `image3/white_285.png`）
- `assets/_buffer/white_286.png`（元 `image1/white_286.png`）
- `assets/_buffer/white_287.png`（元 `image3/white_287.png`）
- `assets/_buffer/white_288.png`（元 `image3/white_288.png`）
- `assets/_buffer/white_289.png`（元 `image3/white_289.png`）
- `assets/_buffer/white_290.png`（元 `image3/white_290.png`）
- `assets/_buffer/white_291.png`（元 `image2/white_291.png`）
- `assets/_buffer/white_292.png`（元 `image2/white_292.png`）
- `assets/_buffer/white_293.png`（元 `image1/white_293.png`）
- `assets/_buffer/white_294.png`（元 `image3/white_294.png`）
- `assets/_buffer/white_295.png`（元 `image3/white_295.png`）
- `assets/_buffer/white_296.png`（元 `image1/white_296.png`）
- `assets/_buffer/white_297.png`（元 `image2/white_297.png`）
- `assets/_buffer/white_298.png`（元 `image1/white_298.png`）
- `assets/_buffer/white_299.png`（元 `image3/white_299.png`）
- `assets/_buffer/white_300.png`（元 `image2/white_300.png`）
