# BG — 背景画像 一覧

`assets/bg/` にある背景素材の台帳。北棟教室・廊下・保管庫・図書室・翠湖・屋上ほか、時間帯（asa/hiru/yuugata/yoru）で雰囲気が変わります。

> 生成日: 2026-09-11  /  総数: 25 ファイル  /  実体は `data/assets.json` が正本（台帳）

## 推奨仕様（BG）

- **サイズ**: 1600×900px（16:9） — `Stage.bg` は `object-fit: cover` で表示、SVGフォールバック（`backdropSVG`）は 1600×900 viewBox
- **形式**: PNG / JPEG（写真はJPEG、描き込みはPNG推奨）
- **色**: 時間帯別に `{kyoshitsu/rouka/suiko/...}/{asa/hiru/yuugata/yoru}` で自動で暖色/寒色フィルタが掛かる（`visual.js MOODS`）
- **配置**: `#stage` 背面レイヤ `lay-bg`（`art-back` がSVG、`art-img` が実画像。実画像は `placeholder:false` で切替）

## ファイル一覧

| # | ファイル | 実寸（現在） | 容量 | 推奨サイズ | ラベル | 説明 | 状態 | 出典（仮置き元） |
|---:|---|---|---|すすめ|---|---|---|---|
| 1 | `bg_chizu_hokanko.png` | 400×300 | 810B | 1600×900 (16:9) / JPEG・PNG / cover / 背景は`backdropSVG`でSVG補完 | 地図保管庫 | 地図保管庫 | ◯ 白紙プレースホルダ | `image3/white_008.png` |
| 2 | `bg_daigaku_yakou_kaisou.png` | 400×300 | 810B | 1600×900 (16:9) / JPEG・PNG / cover / 背景は`backdropSVG`でSVG補完 | 回想・大学時代の野外調査ベースキャンプ | 回想・大学時代の野外調査ベースキャンプ | ◯ 白紙プレースホルダ | `image2/white_022.png` |
| 3 | `bg_hawaii_youganchi_kaisou.png` | 400×300 | 810B | 1600×900 (16:9) / JPEG・PNG / cover / 背景は`backdropSVG`でSVG補完 | 回想・ハワイの溶岩台地 | 回想・ハワイの溶岩台地 | ◯ 白紙プレースホルダ | `image1/white_020.png` |
| 4 | `bg_hokutou_kyoshitsu_asa.png` | 400×300 | 810B | 1600×900 (16:9) / JPEG・PNG / cover / 背景は`backdropSVG`でSVG補完 | 北棟三年B組教室・朝 | 北棟三年B組教室・朝 | ◯ 白紙プレースホルダ | `image1/white_001.png` |
| 5 | `bg_hokutou_kyoshitsu_hiru.png` | 400×300 | 810B | 1600×900 (16:9) / JPEG・PNG / cover / 背景は`backdropSVG`でSVG補完 | 北棟三年B組教室・昼休み | 北棟三年B組教室・昼休み | ◯ 白紙プレースホルダ | `image2/white_002.png` |
| 6 | `bg_hokutou_kyoshitsu_yoru.png` | 400×300 | 810B | 1600×900 (16:9) / JPEG・PNG / cover / 背景は`backdropSVG`でSVG補完 | 北棟三年B組教室・夜（サプライズ準備） | 北棟三年B組教室・夜（サプライズ準備） | ◯ 白紙プレースホルダ | `image3/white_004.png` |
| 7 | `bg_hokutou_kyoshitsu_yuugata.png` | 400×300 | 810B | 1600×900 (16:9) / JPEG・PNG / cover / 背景は`backdropSVG`でSVG補完 | 北棟三年B組教室・夕方（茜色・逆光） | 北棟三年B組教室・夕方（茜色・逆光） | ◯ 白紙プレースホルダ | `image1/white_003.png` |
| 8 | `bg_jimushitsu.png` | 400×300 | 810B | 1600×900 (16:9) / JPEG・PNG / cover / 背景は`backdropSVG`でSVG補完 | 職員室 | 職員室 | ◯ 白紙プレースホルダ | `image3/white_007.png` |
| 9 | `bg_kaidan_odoriba.png` | 400×300 | 810B | 1600×900 (16:9) / JPEG・PNG / cover / 背景は`backdropSVG`でSVG補完 | 階段の踊り場（掲示物あり） | 階段の踊り場（掲示物あり） | ◯ 白紙プレースホルダ | `image2/white_006.png` |
| 10 | `bg_koutei_bunkasai_junbi.png` | 400×300 | 810B | 1600×900 (16:9) / JPEG・PNG / cover / 背景は`backdropSVG`でSVG補完 | 文化祭/謝恩会準備中の校庭 | 文化祭/謝恩会準備中の校庭 | ◯ 白紙プレースホルダ | `image1/white_012.png` |
| 11 | `bg_kyoshitsu_haru_sotsugyougo.png` | 400×300 | 810B | 1600×900 (16:9) / JPEG・PNG / cover / 背景は`backdropSVG`でSVG補完 | エピローグ・卒業後の春、もぬけの殻の教室 | エピローグ・卒業後の春、もぬけの殻の教室 | ◯ 白紙プレースホルダ | `image3/white_023.png` |
| 12 | `bg_kyoshitsu_suunengo.png` | 400×300 | 810B | 1600×900 (16:9) / JPEG・PNG / cover / 背景は`backdropSVG`でSVG補完 | TRUE END後日談・数年後の同じ教室 | TRUE END後日談・数年後の同じ教室 | ◯ 白紙プレースホルダ | `image3/white_024.png` |
| 13 | `bg_minamitou_kyoshitsu.png` | 400×300 | 810B | 1600×900 (16:9) / JPEG・PNG / cover / 背景は`backdropSVG`でSVG補完 | 南棟三年教室 | 南棟三年教室 | ◯ 白紙プレースホルダ | `image3/white_018.png` |
| 14 | `bg_okujou.png` | 400×300 | 810B | 1600×900 (16:9) / JPEG・PNG / cover / 背景は`backdropSVG`でSVG補完 | 屋上 | 屋上 | ◯ 白紙プレースホルダ | `image1/white_014.png` |
| 15 | `bg_rouka_hokutou.png` | 400×300 | 810B | 1600×900 (16:9) / JPEG・PNG / cover / 背景は`backdropSVG`でSVG補完 | 北棟廊下 | 北棟廊下 | ◯ 白紙プレースホルダ | `image3/white_005.png` |
| 16 | `bg_ryoma_ie_butsudan.png` | 400×300 | 810B | 1600×900 (16:9) / JPEG・PNG / cover / 背景は`backdropSVG`でSVG補完 | 両馬の家・祖父の遺影がある部屋 | 両馬の家・祖父の遺影がある部屋 | ◯ 白紙プレースホルダ | `image3/white_019.png` |
| 17 | `bg_sakura_namiki.png` | 400×300 | 810B | 1600×900 (16:9) / JPEG・PNG / cover / 背景は`backdropSVG`でSVG補完 | 南棟と北棟を繋ぐ桜並木（蕾） | 南棟と北棟を繋ぐ桜並木（蕾） | ◯ 白紙プレースホルダ | `image3/white_016.png` |
| 18 | `bg_sotsugyoushiki_kaijou.png` | 400×300 | 810B | 1600×900 (16:9) / JPEG・PNG / cover / 背景は`backdropSVG`でSVG補完 | 卒業式会場 | 卒業式会場 | ◯ 白紙プレースホルダ | `image1/white_017.png` |
| 19 | `bg_suiko_hotori.png` | 400×300 | 810B | 1600×900 (16:9) / JPEG・PNG / cover / 背景は`backdropSVG`でSVG補完 | 翠湖のほとり | 翠湖のほとり | ◯ 白紙プレースホルダ | `image1/white_011.png` |
| 20 | `bg_taiikukan.png` | 400×300 | 810B | 1600×900 (16:9) / JPEG・PNG / cover / 背景は`backdropSVG`でSVG補完 | 体育館（謝恩会当日） | 体育館（謝恩会当日） | ◯ 白紙プレースホルダ | `image2/white_013.png` |
| 21 | `bg_toshokan_shozoko.png` | 400×300 | 810B | 1600×900 (16:9) / JPEG・PNG / cover / 背景は`backdropSVG`でSVG補完 | 図書室奥の書庫（埃っぽい） | 図書室奥の書庫（埃っぽい） | ◯ 白紙プレースホルダ | `image1/white_010.png` |
| 22 | `bg_toshoshitsu.png` | 400×300 | 810B | 1600×900 (16:9) / JPEG・PNG / cover / 背景は`backdropSVG`でSVG補完 | 図書室 | 図書室 | ◯ 白紙プレースホルダ | `image3/white_009.png` |
| 23 | `bg_tsuugaku_densha_mado.png` | 400×300 | 810B | 1600×900 (16:9) / JPEG・PNG / cover / 背景は`backdropSVG`でSVG補完 | 通学電車の車窓（砂糖視点） | 通学電車の車窓（砂糖視点） | ◯ 白紙プレースホルダ | `image2/white_015.png` |
| 24 | `bg_yama_gensho_kaisou.png` | 400×300 | 810B | 1600×900 (16:9) / JPEG・PNG / cover / 背景は`backdropSVG`でSVG補完 | 回想・稲葉と勝也がいた山（褪色調） | 回想・稲葉と勝也がいた山（褪色調） | ◯ 白紙プレースホルダ | `image2/white_021.png` |
| 25 | `title_key.jpg` | 1376×768 | 242752B | 1600×900 (16:9) / JPEG・PNG / cover / 背景は`backdropSVG`でSVG補完 | タイトルキービジュアル | タイトル背景（桜並木・教室・手書き地図の合成） | ● 実画像 | `-（実写合成）` |

### 補足

- 現状プレースホルダは **400×300 白紙（810B）**。差し替え時は同じファイル名で上書きし、`data/assets.json` の該当 `placeholder` を `false` にするだけでエンジンが実画像に切替（`Stage.isPlaceholder`）
- プリロードは `AssetDB.realList()`（`placeholder:false` のみ）を 6並列で `decode()` し、失敗しても SVG でフォールバック

---
*このMDは自動生成（`tools/gen_asset_md.mjs`）。手編集より台帳 `data/assets.json` を正本にしてください。*
