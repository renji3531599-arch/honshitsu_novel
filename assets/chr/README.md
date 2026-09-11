# CHR — 立ち絵 一覧

`assets/chr/` のキャラクタ立ち絵（全105差分）。`chr_<slug>_<expr>_<label>.png` 形式。現在は 400×300 白紙プレースホルダのものが多いが、差し替えで透過PNGに置換。

> 生成日: 2026-09-11  /  総数: 105 ファイル  /  実体は `data/assets.json` が正本（台帳）

## 推奨仕様（立ち絵）

- **viewBox**: 420×700（表示は `--u*420` 幅 × `--u*640` 高、`object-position: bottom center`）
- **推奨実寸**: 840×1280px 以上（2×解像度、透過PNG）。顔〜胸上＋全身が 700px に収まる。トリミングは下基準
- **形式**: PNG（透過必須）
- **配置**: `lay-chr`。1体=50%中央 / 2体=31%69% / 3体=19%50%81%（`Stage.applyChr`）。入退場は `data-enter="left/right/center"` で 3種、呼吸（`chrBreathe` 4.6s）＋talkバウンス（`.talk` 0.34s）＋dimで奥行き
- **SVGフォールバック**: `figureSVG(slug, expr)` が髪型・小道具・表情濃度（`expr` 01-10）を procedurally に描く

## ファイル一覧

| # | ファイル | 実寸（現在） | 容量 | 推奨サイズ | ラベル | 説明 | 状態 | 出典（仮置き元） |
|---:|---|---|---|すすめ|---|---|---|---|
| 1 | `chr_futami_01_tsuujou.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 二見玲子 通常 | 立ち絵差分 二見玲子／通常 | ◯ 白紙プレースホルダ | `image1/white_103.png` |
| 2 | `chr_futami_02_hohoemi.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 二見玲子 微笑 | 立ち絵差分 二見玲子／微笑 | ◯ 白紙プレースホルダ | `image3/white_104.png` |
| 3 | `chr_futami_03_shinpai.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 二見玲子 心配顔 | 立ち絵差分 二見玲子／心配顔 | ◯ 白紙プレースホルダ | `image1/white_105.png` |
| 4 | `chr_futami_04_itazura.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 二見玲子 いたずらっぽい笑み | 立ち絵差分 二見玲子／いたずらっぽい笑み | ◯ 白紙プレースホルダ | `image1/white_106.png` |
| 5 | `chr_futami_05_yokogao.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 二見玲子 しんみりした横顔 | 立ち絵差分 二見玲子／しんみりした横顔 | ◯ 白紙プレースホルダ | `image3/white_107.png` |
| 6 | `chr_inaba_01_shashin_no_waraui.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 稲葉悌二（回想専用） 古写真の中の柔らかい笑み | 立ち絵差分 稲葉悌二（回想専用）／古写真の中の柔らかい笑み | ◯ 白紙プレースホルダ | `image1/white_126.png` |
| 7 | `chr_inaba_02_yama_sasu.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 稲葉悌二（回想専用） 山を指差す横顔 | 立ち絵差分 稲葉悌二（回想専用）／山を指差す横顔 | ◯ 白紙プレースホルダ | `image1/white_127.png` |
| 8 | `chr_izaki_01_tsuujou.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 伊崎 通常 | 立ち絵差分 伊崎／通常 | ◯ 白紙プレースホルダ | `image3/white_078.png` |
| 9 | `chr_izaki_02_egao.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 伊崎 笑顔 | 立ち絵差分 伊崎／笑顔 | ◯ 白紙プレースホルダ | `image2/white_079.png` |
| 10 | `chr_izaki_03_komari.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 伊崎 困り顔 | 立ち絵差分 伊崎／困り顔 | ◯ 白紙プレースホルダ | `image1/white_080.png` |
| 11 | `chr_izaki_04_shikiri.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 伊崎 真剣（仕切る顔） | 立ち絵差分 伊崎／真剣（仕切る顔） | ◯ 白紙プレースホルダ | `image1/white_081.png` |
| 12 | `chr_izaki_05_odoroki.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 伊崎 驚き | 立ち絵差分 伊崎／驚き | ◯ 白紙プレースホルダ | `image2/white_082.png` |
| 13 | `chr_izaki_06_shimiemi.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 伊崎 しみじみとした微笑み | 立ち絵差分 伊崎／しみじみとした微笑み | ◯ 白紙プレースホルダ | `image1/white_083.png` |
| 14 | `chr_izumi_01_tsuujou.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 伊豆見 通常 | 立ち絵差分 伊豆見／通常 | ◯ 白紙プレースホルダ | `image2/white_084.png` |
| 15 | `chr_izumi_02_egao.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 伊豆見 笑顔 | 立ち絵差分 伊豆見／笑顔 | ◯ 白紙プレースホルダ | `image2/white_085.png` |
| 16 | `chr_izumi_03_kinchou.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 伊豆見 緊張 | 立ち絵差分 伊豆見／緊張 | ◯ 白紙プレースホルダ | `image2/white_086.png` |
| 17 | `chr_izumi_04_ketsui.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 伊豆見 決意 | 立ち絵差分 伊豆見／決意 | ◯ 白紙プレースホルダ | `image1/white_087.png` |
| 18 | `chr_izumi_05_tere.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 伊豆見 照れ | 立ち絵差分 伊豆見／照れ | ◯ 白紙プレースホルダ | `image1/white_088.png` |
| 19 | `chr_izumi_06_hokorashige.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 伊豆見 誇らしげ | 立ち絵差分 伊豆見／誇らしげ | ◯ 白紙プレースホルダ | `image3/white_089.png` |
| 20 | `chr_katsuya_01_tsuujou.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 塀勝也 通常（穏やか） | 立ち絵差分 塀勝也／通常（穏やか） | ◯ 白紙プレースホルダ | `image3/white_025.png` |
| 21 | `chr_katsuya_02_hohoemi.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 塀勝也 微笑 | 立ち絵差分 塀勝也／微笑 | ◯ 白紙プレースホルダ | `image1/white_026.png` |
| 22 | `chr_katsuya_03_tooi_me.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 塀勝也 遠い目 | 立ち絵差分 塀勝也／遠い目 | ◯ 白紙プレースホルダ | `image3/white_027.png` |
| 23 | `chr_katsuya_04_odoroki.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 塀勝也 驚き | 立ち絵差分 塀勝也／驚き | ◯ 白紙プレースホルダ | `image1/white_028.png` |
| 24 | `chr_katsuya_05_me_fuseru.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 塀勝也 目を伏せる | 立ち絵差分 塀勝也／目を伏せる | ◯ 白紙プレースホルダ | `image1/white_029.png` |
| 25 | `chr_katsuya_06_kataki_muten.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 塀勝也 硬い無表情 | 立ち絵差分 塀勝也／硬い無表情 | ◯ 白紙プレースホルダ | `image2/white_030.png` |
| 26 | `chr_katsuya_07_kaisou_me_soseru.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 塀勝也 回想・目を細める | 立ち絵差分 塀勝也／回想・目を細める | ◯ 白紙プレースホルダ | `image1/white_031.png` |
| 27 | `chr_katsuya_08_namida_koraeru.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 塀勝也 涙をこらえる | 立ち絵差分 塀勝也／涙をこらえる | ◯ 白紙プレースホルダ | `image1/white_032.png` |
| 28 | `chr_katsuya_09_naku.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 塀勝也 泣く | 立ち絵差分 塀勝也／泣く | ◯ 白紙プレースホルダ | `image3/white_033.png` |
| 29 | `chr_katsuya_10_hareyaka_emmi.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 塀勝也 晴れやかな笑み | 立ち絵差分 塀勝也／晴れやかな笑み | ◯ 白紙プレースホルダ | `image1/white_034.png` |
| 30 | `chr_kuraishi_01_kekkyou.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 倉石暁 通常（熱狂） | 立ち絵差分 倉石暁／通常（熱狂） | ◯ 白紙プレースホルダ | `image2/white_096.png` |
| 31 | `chr_kuraishi_02_kanshou.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 倉石暁 感激 | 立ち絵差分 倉石暁／感激 | ◯ 白紙プレースホルダ | `image3/white_097.png` |
| 32 | `chr_kuraishi_03_chousa_shinken.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 倉石暁 真剣（調査中） | 立ち絵差分 倉石暁／真剣（調査中） | ◯ 白紙プレースホルダ | `image2/white_098.png` |
| 33 | `chr_kuraishi_04_shonbori.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 倉石暁 しょんぼり | 立ち絵差分 倉石暁／しょんぼり | ◯ 白紙プレースホルダ | `image3/white_099.png` |
| 34 | `chr_kuraishi_05_hokorashige.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 倉石暁 誇らしげ | 立ち絵差分 倉石暁／誇らしげ | ◯ 白紙プレースホルダ | `image1/white_100.png` |
| 35 | `chr_kuraishi_06_kotoba_usinau.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 倉石暁 言葉を失う顔 | 立ち絵差分 倉石暁／言葉を失う顔 | ◯ 白紙プレースホルダ | `image3/white_101.png` |
| 36 | `chr_kuraishi_07_namidagumu.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 倉石暁 涙ぐむ | 立ち絵差分 倉石暁／涙ぐむ | ◯ 白紙プレースホルダ | `image1/white_102.png` |
| 37 | `chr_meshino_01_tsuujou.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 召野カイト 通常 | 立ち絵差分 召野カイト／通常 | ◯ 白紙プレースホルダ | `image3/white_090.png` |
| 38 | `chr_meshino_02_kimegao.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 召野カイト 決め顔 | 立ち絵差分 召野カイト／決め顔 | ◯ 白紙プレースホルダ | `image2/white_091.png` |
| 39 | `chr_meshino_03_tere.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 召野カイト 照れ | 立ち絵差分 召野カイト／照れ | ◯ 白紙プレースホルダ | `image2/white_092.png` |
| 40 | `chr_meshino_04_shinken.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 召野カイト 真剣 | 立ち絵差分 召野カイト／真剣 | ◯ 白紙プレースホルダ | `image1/white_093.png` |
| 41 | `chr_meshino_05_eigo_doya.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 召野カイト 英語ドヤ顔 | 立ち絵差分 召野カイト／英語ドヤ顔 | ◯ 白紙プレースホルダ | `image3/white_094.png` |
| 42 | `chr_meshino_06_shinmiri.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 召野カイト しんみり | 立ち絵差分 召野カイト／しんみり | ◯ 白紙プレースホルダ | `image3/white_095.png` |
| 43 | `chr_mie_01_reishou.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 三重県臣 通常（冷笑・半目） | 立ち絵差分 三重県臣／通常（冷笑・半目） | ◯ 白紙プレースホルダ | `image1/white_044.png` |
| 44 | `chr_mie_02_ha.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 三重県臣 「は？」 | 立ち絵差分 三重県臣／「は？」 | ◯ 白紙プレースホルダ | `image3/white_045.png` |
| 45 | `chr_mie_03_douyou.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 三重県臣 動揺 | 立ち絵差分 三重県臣／動揺 | ◯ 白紙プレースホルダ | `image1/white_046.png` |
| 46 | `chr_mie_04_chimatsu.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 三重県臣 気まずい沈黙 | 立ち絵差分 三重県臣／気まずい沈黙 | ◯ 白紙プレースホルダ | `image1/white_047.png` |
| 47 | `chr_mie_05_tere.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 三重県臣 照れ | 立ち絵差分 三重県臣／照れ | ◯ 白紙プレースホルダ | `image2/white_048.png` |
| 48 | `chr_mie_06_iraduki_shinken.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 三重県臣 苛立ち混じりの真剣 | 立ち絵差分 三重県臣／苛立ち混じりの真剣 | ◯ 白紙プレースホルダ | `image1/white_049.png` |
| 49 | `chr_mie_07_honki_shinken.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 三重県臣 本気の真剣 | 立ち絵差分 三重県臣／本気の真剣 | ◯ 白紙プレースホルダ | `image3/white_050.png` |
| 50 | `chr_mie_08_namida_kamu.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 三重県臣 涙をこらえて唇を噛む | 立ち絵差分 三重県臣／涙をこらえて唇を噛む | ◯ 白紙プレースホルダ | `image3/white_051.png` |
| 51 | `chr_mie_09_sunao_hohoemi.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 三重県臣 初めての素直な微笑み | 立ち絵差分 三重県臣／初めての素直な微笑み | ◯ 白紙プレースホルダ | `image1/white_052.png` |
| 52 | `chr_mie_10_nakigao.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 三重県臣 泣き顔 | 立ち絵差分 三重県臣／泣き顔 | ◯ 白紙プレースホルダ | `image1/white_053.png` |
| 53 | `chr_mitsumine_01_tsuujou.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 三峰瑠衣 通常 | 立ち絵差分 三峰瑠衣／通常 | ◯ 白紙プレースホルダ | `image3/white_114.png` |
| 54 | `chr_mitsumine_02_tsukkomi.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 三峰瑠衣 ツッコミ顔 | 立ち絵差分 三峰瑠衣／ツッコミ顔 | ◯ 白紙プレースホルダ | `image1/white_115.png` |
| 55 | `chr_mitsumine_03_egao.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 三峰瑠衣 笑顔 | 立ち絵差分 三峰瑠衣／笑顔 | ◯ 白紙プレースホルダ | `image3/white_116.png` |
| 56 | `chr_mitsumine_04_akire.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 三峰瑠衣 呆れ | 立ち絵差分 三峰瑠衣／呆れ | ◯ 白紙プレースホルダ | `image2/white_117.png` |
| 57 | `chr_mitsumine_05_yasashii.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 三峰瑠衣 優しい顔 | 立ち絵差分 三峰瑠衣／優しい顔 | ◯ 白紙プレースホルダ | `image1/white_118.png` |
| 58 | `chr_mitsumine_06_ha.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 三峰瑠衣 「は？」（ハモリ専用） | 立ち絵差分 三峰瑠衣／「は？」（ハモリ専用） | ◯ 白紙プレースホルダ | `image2/white_119.png` |
| 59 | `chr_naitou_01_tsuujou.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 内藤蘭 通常 | 立ち絵差分 内藤蘭／通常 | ◯ 白紙プレースホルダ | `image2/white_120.png` |
| 60 | `chr_naitou_02_hohoemi.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 内藤蘭 微笑 | 立ち絵差分 内藤蘭／微笑 | ◯ 白紙プレースホルダ | `image2/white_121.png` |
| 61 | `chr_naitou_03_dokusho.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 内藤蘭 読書中（伏し目） | 立ち絵差分 内藤蘭／読書中（伏し目） | ◯ 白紙プレースホルダ | `image3/white_122.png` |
| 62 | `chr_naitou_04_odoroki.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 内藤蘭 驚き | 立ち絵差分 内藤蘭／驚き | ◯ 白紙プレースホルダ | `image2/white_123.png` |
| 63 | `chr_naitou_05_yasashii_me.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 内藤蘭 優しい目 | 立ち絵差分 内藤蘭／優しい目 | ◯ 白紙プレースホルダ | `image3/white_124.png` |
| 64 | `chr_naitou_06_sukoshi_warau.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 内藤蘭 少し笑う | 立ち絵差分 内藤蘭／少し笑う | ◯ 白紙プレースホルダ | `image2/white_125.png` |
| 65 | `chr_rei_01_suzushii.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 数理零 通常（涼しい顔） | 立ち絵差分 数理零／通常（涼しい顔） | ◯ 白紙プレースホルダ | `image3/white_070.png` |
| 66 | `chr_rei_02_hohoemi.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 数理零 微笑 | 立ち絵差分 数理零／微笑 | ◯ 白紙プレースホルダ | `image3/white_071.png` |
| 67 | `chr_rei_03_kangaechuu.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 数理零 考え中（顎に手） | 立ち絵差分 数理零／考え中（顎に手） | ◯ 白紙プレースホルダ | `image1/white_072.png` |
| 68 | `chr_rei_04_odoroki.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 数理零 驚き | 立ち絵差分 数理零／驚き | ◯ 白紙プレースホルダ | `image1/white_073.png` |
| 69 | `chr_rei_05_data_shinken.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 数理零 真剣（データと向き合う） | 立ち絵差分 数理零／真剣（データと向き合う） | ◯ 白紙プレースホルダ | `image3/white_074.png` |
| 70 | `chr_rei_06_yasashii_me.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 数理零 優しい目 | 立ち絵差分 数理零／優しい目 | ◯ 白紙プレースホルダ | `image1/white_075.png` |
| 71 | `chr_rei_07_kotoba_erabu.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 数理零 言葉を選ぶ顔 | 立ち絵差分 数理零／言葉を選ぶ顔 | ◯ 白紙プレースホルダ | `image1/white_076.png` |
| 72 | `chr_rei_08_me_rumaseru.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 数理零 目を潤ませる | 立ち絵差分 数理零／目を潤ませる | ◯ 白紙プレースホルダ | `image2/white_077.png` |
| 73 | `chr_ryoma_01_tsuujou.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 両馬二郎 通常 | 立ち絵差分 両馬二郎／通常 | ◯ 白紙プレースホルダ | `image3/white_035.png` |
| 74 | `chr_ryoma_02_niyari.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 両馬二郎 ニヤリ | 立ち絵差分 両馬二郎／ニヤリ | ◯ 白紙プレースホルダ | `image1/white_036.png` |
| 75 | `chr_ryoma_03_zenryoku.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 両馬二郎 全力 | 立ち絵差分 両馬二郎／全力 | ◯ 白紙プレースホルダ | `image3/white_037.png` |
| 76 | `chr_ryoma_04_kinimo_majime.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 両馬二郎 急に真顔 | 立ち絵差分 両馬二郎／急に真顔 | ◯ 白紙プレースホルダ | `image1/white_038.png` |
| 77 | `chr_ryoma_05_shonbori.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 両馬二郎 しょんぼり | 立ち絵差分 両馬二郎／しょんぼり | ◯ 白紙プレースホルダ | `image2/white_039.png` |
| 78 | `chr_ryoma_06_nakiwarai.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 両馬二郎 泣き笑い | 立ち絵差分 両馬二郎／泣き笑い | ◯ 白紙プレースホルダ | `image1/white_040.png` |
| 79 | `chr_ryoma_07_shinken_ketsui.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 両馬二郎 真剣な決意顔 | 立ち絵差分 両馬二郎／真剣な決意顔 | ◯ 白紙プレースホルダ | `image3/white_041.png` |
| 80 | `chr_ryoma_08_terekakushi.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 両馬二郎 照れ隠しで頭をかく | 立ち絵差分 両馬二郎／照れ隠しで頭をかく | ◯ 白紙プレースホルダ | `image3/white_042.png` |
| 81 | `chr_ryoma_09_goukyuu.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 両馬二郎 号泣 | 立ち絵差分 両馬二郎／号泣 | ◯ 白紙プレースホルダ | `image3/white_043.png` |
| 82 | `chr_sakura_01_tsuujou.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 櫻優 通常 | 立ち絵差分 櫻優／通常 | ◯ 白紙プレースホルダ | `image3/white_108.png` |
| 83 | `chr_sakura_02_kenkyuusha.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 櫻優 真剣（研究者モード） | 立ち絵差分 櫻優／真剣（研究者モード） | ◯ 白紙プレースホルダ | `image3/white_109.png` |
| 84 | `chr_sakura_03_tere.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 櫻優 照れ | 立ち絵差分 櫻優／照れ | ◯ 白紙プレースホルダ | `image1/white_110.png` |
| 85 | `chr_sakura_04_douyou.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 櫻優 動揺 | 立ち絵差分 櫻優／動揺 | ◯ 白紙プレースホルダ | `image1/white_111.png` |
| 86 | `chr_sakura_05_egao.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 櫻優 笑顔 | 立ち絵差分 櫻優／笑顔 | ◯ 白紙プレースホルダ | `image1/white_112.png` |
| 87 | `chr_sakura_06_yawarakai.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 櫻優 柔らかい表情 | 立ち絵差分 櫻優／柔らかい表情 | ◯ 白紙プレースホルダ | `image1/white_113.png` |
| 88 | `chr_satou_01_game_shuuchuu.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 砂糖東洋 通常（ゲーム画面凝視） | 立ち絵差分 砂糖東洋／通常（ゲーム画面凝視） | ◯ 白紙プレースホルダ | `image1/white_062.png` |
| 89 | `chr_satou_02_muten.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 砂糖東洋 無表情（素） | 立ち絵差分 砂糖東洋／無表情（素） | ◯ 白紙プレースホルダ | `image1/white_063.png` |
| 90 | `chr_satou_03_kao_ageta.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 砂糖東洋 驚き（画面から顔を上げる） | 立ち絵差分 砂糖東洋／驚き（画面から顔を上げる） | ◯ 白紙プレースホルダ | `image3/white_064.png` |
| 91 | `chr_satou_04_soppo.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 砂糖東洋 照れ隠しでそっぽを向く | 立ち絵差分 砂糖東洋／照れ隠しでそっぽを向く | ◯ 白紙プレースホルダ | `image2/white_065.png` |
| 92 | `chr_satou_05_camera.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 砂糖東洋 真剣にカメラを構える顔 | 立ち絵差分 砂糖東洋／真剣にカメラを構える顔 | ◯ 白紙プレースホルダ | `image3/white_066.png` |
| 93 | `chr_satou_06_hohoemi.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 砂糖東洋 微笑み（レア） | 立ち絵差分 砂糖東洋／微笑み（レア） | ◯ 白紙プレースホルダ | `image2/white_067.png` |
| 94 | `chr_satou_07_tsumaru.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 砂糖東洋 言葉に詰まる顔 | 立ち絵差分 砂糖東洋／言葉に詰まる顔 | ◯ 白紙プレースホルダ | `image3/white_068.png` |
| 95 | `chr_satou_08_hikari_koraeru.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 砂糖東洋 目に光るものを堪える顔 | 立ち絵差分 砂糖東洋／目に光るものを堪える顔 | ◯ 白紙プレースホルダ | `image3/white_069.png` |
| 96 | `chr_terachi_01_nemusou.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 寺地星 通常（眠そう・淡々） | 立ち絵差分 寺地星／通常（眠そう・淡々） | ◯ 白紙プレースホルダ | `image1/white_054.png` |
| 97 | `chr_terachi_02_komatte_kataaru.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 寺地星 困惑して固まる | 立ち絵差分 寺地星／困惑して固まる | ◯ 白紙プレースホルダ | `image3/white_055.png` |
| 98 | `chr_terachi_03_hansya_shinken.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 寺地星 真剣な配信者の顔 | 立ち絵差分 寺地星／真剣な配信者の顔 | ◯ 白紙プレースホルダ | `image2/white_056.png` |
| 99 | `chr_terachi_04_ureshii.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 寺地星 嬉しい | 立ち絵差分 寺地星／嬉しい | ◯ 白紙プレースホルダ | `image1/white_057.png` |
| 100 | `chr_terachi_05_nakisou_koraeru.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 寺地星 泣きそうなのを堪える | 立ち絵差分 寺地星／泣きそうなのを堪える | ◯ 白紙プレースホルダ | `image3/white_058.png` |
| 101 | `chr_terachi_06_maiku_no_ketsui.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 寺地星 マイク前の決意顔 | 立ち絵差分 寺地星／マイク前の決意顔 | ◯ 白紙プレースホルダ | `image3/white_059.png` |
| 102 | `chr_terachi_07_yomiage.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 寺地星 声を震わせながら読み上げる | 立ち絵差分 寺地星／声を震わせながら読み上げる | ◯ 白紙プレースホルダ | `image3/white_060.png` |
| 103 | `chr_terachi_08_namida.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 寺地星 涙 | 立ち絵差分 寺地星／涙 | ◯ 白紙プレースホルダ | `image3/white_061.png` |
| 104 | `chr_wakaki-katsuya_01_waratteiru.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 若き日の塀勝也（回想専用） 笑っている | 立ち絵差分 若き日の塀勝也（回想専用）／笑っている | ◯ 白紙プレースホルダ | `image2/white_128.png` |
| 105 | `chr_wakaki-katsuya_02_bousen.png` | 400×300 | 810B | 420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置 | 若き日の塀勝也（回想専用） 呆然としている | 立ち絵差分 若き日の塀勝也（回想専用）／呆然としている | ◯ 白紙プレースホルダ | `image3/white_129.png` |

### 立ち絵 表情バリエーション（抜粋）

- `01 通常/穏やか` → `02 微笑/笑顔` → `03 悩み/困り` → `04 驚き/怒り` → `05 悲しみ/切なさ` → `06 決意/真剣` → `07 照れ/喜び` → `08 泣き/涙` → `09 以降 個別（晴れやか・全力等）`
- 表現は `expr` 番号で濃度（`darken`）と `#halo` の有無が変わる（`figureSVG` 内 `exprN>=8` で後光が付く）
- 実装では `game.js` が `chr:{set:{slug:expr}}` で `store.meta.chr[slug]` に回収を記録

---
*このMDは自動生成（`tools/gen_asset_md.mjs`）。手編集より台帳 `data/assets.json` を正本にしてください。*
