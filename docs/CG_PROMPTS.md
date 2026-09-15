# 全CG生成プロンプト集（7枚）

『まだ地図の途中で ―― ✝本質✝特別編』の**現行本編CG 7枚（名場面5枚＋エンディング2枚）**を生成するためのプロンプト集。

- 正本: `data/assets.json`
- 構図・出番: `docs/CG_GUIDE.md`
- 脚本上の表示箇所: `data/script/*.txt`
- 生成後の配置先: `assets/cg/`（版B も動かすなら同名で `game/assets/img/` にもコピー）
- 仕様: **1920×1080（最低 1600×900）/ 16:9 / WebP・JPEG・PNG / 全面不透明**
- 2026-09-12(3): 番号スロット（`cg02` 等）廃止。「ID＝ファイル名」の実名に統一済み。
- **2026-09-15(3): 26→7枚に整理。** 掲載した7枚だけ生成する。撤去理由・一覧は `CG_PRUNING_2026-09-15.md`。

---

## 使い方（添付ファイルが必須）

1. **各CGの「添付する背景」「添付する立ち絵」に挙げた実ファイルを、生成ツールに参照画像として必ず添付する。**
   - 背景 = 本編でそのCGの裏に出ている `assets/bg/` の実画像。光・色・空間の一致はここから取る。
   - 立ち絵 = そのCGに描くキャラクターの `assets/chr/` の実画像。顔・髪・制服・ネクタイ色をここから固定する。
   - 背景も立ち絵も**すべて実画像が揃っている**ので、「何となく近い絵」ではなく実物を添付できる。添付なしで始めると全7枚の統一が壊れる。
2. 「共通ベースプロンプト」を先頭に付け、各CGの個別プロンプトを続ける。
3. 「共通ネガティブプロンプト」をネガティブ欄に入れる。
4. 生成後、正確な日本語の文字・年号・キャプションは必要に応じて後処理で入れる。画像生成モデルに文字を任せない。

### 共通ベースプロンプト（英語）

```text
A full-bleed 16:9 Japanese visual novel event CG, cinematic 2D anime illustration, mature light-novel key-visual quality, clean expressive line art, restrained cel shading, painterly atmospheric background, realistic teenage and adult proportions, carefully staged eye-lines and hands, emotionally subtle acting, natural perspective, soft filmic color grading, detailed but uncluttered composition, leave safe margins for a visual-novel text box, no UI and no decorative frame. Use the approved character reference sheets for every face, hairstyle, body proportion, age, uniform and color; keep the cast visually consistent across all images. Students from the North science building wear the established burgundy-red school tie, students from the South integrated building wear the established navy tie. Do not add any text, speech bubbles, captions, logos or watermark inside the image.
```

### キャラクター継続性メモ

髪色・髪型・顔立ちなど未確定の要素は、添付する立ち絵の実画像を基準に固定する。プロンプトでは役割と表情を優先し、毎回デザインを再解釈しない。

- **塀勝也**: 成人男性の地理教師。穏やかで抑制された佇まい。通常は感情を表に出さず、クライマックスだけ表情が大きく開く。参照: `chr_katsuya_*`。
- **三重県臣**: 北棟・理数科の男子高校生。えんじ色のネクタイ、半目気味の冷笑と、隠しきれない動揺。参照: `chr_mie_*`。
- **両馬二郎**: 北棟・理数科の男子高校生。えんじ色のネクタイ。普段は軽快だが、祖父の話では真剣で、笑顔と涙が同居する。参照: `chr_ryoma_*`。
- **砂糖東洋**: 北棟・理数科の男子高校生。えんじ色のネクタイ。ゲームとスマートフォンを手放さないが、景色を見ている。参照: `chr_satou_*`。
- **数理零**: 北棟・理数科の男子高校生。えんじ色のネクタイ。落ち着いた観察者で、静かに本気の言葉を選ぶ。参照: `chr_rei_*`。
- **寺地星**: 北棟・理数科の高校生。本質配信者。紙、マジック、配信機材を使う。普段は眠そうだが、朗読時は強い集中を見せる。参照: `chr_terachi_*`。
- **伊崎・伊豆見**: 北棟側の高校生。準備と進行を担う組み合わせ。二人の距離感は親しいが、依存的にはしない。参照: `chr_izaki_*`・`chr_izumi_*`。
- **召野カイト**: 北棟側の高校生。言葉を届けることに目覚めた人物。エンディングでは国際・英語教育系の進路を感じさせる。参照: `chr_meshino_*`。
- **倉石暁**: 年下の北棟・理数科生。✝本質✝年鑑を編纂する記録係。熱狂と真剣さを両立させる。参照: `chr_kuraishi_*`。
- **櫻優**: 南棟・中高一貫側の高校生。紺色のネクタイ。恋愛学を研究する理論派。参照: `chr_sakura_*`。
- **内藤蘭**: 南棟・中高一貫側の高校生。紺色のネクタイ。静かで、本を読むことが多い。小さな微笑みが重要。参照: `chr_naitou_*`。
- **三峰瑠衣**: 南棟・中高一貫側の女子高校生。紺色のネクタイ。常識人で、二人を支える連絡係。参照: `chr_mitsumine_*`。
- **稲葉悌二**: 回想にだけ登場する、勝也のかつての指導者。山と地図を知る成人男性。説明的な英雄にはせず、記憶の中の存在として描く。参照は古写真の `chr_inaba_01_furushashin_hohoemi.png` 1枚のみ（顔の基準にする）。
- **若き日の勝也**: 回想専用。現在の勝也（`chr_katsuya_*`）と同じ人物だとわかる面影を残すが、未熟さのある若者として描く。

### 共通ネガティブプロンプト（英語）

```text
photorealistic, 3D render, chibi, super-deformed, childish proportions, manga panel borders, comic speech bubbles, UI, game interface, subtitles, captions, logo, watermark, frame, border, random Japanese text, garbled lettering, unreadable text, text artifacts, extra characters, duplicate person, cloned face, wrong age, wrong school uniform, wrong tie color, inconsistent character design, extra arms, extra legs, extra fingers, missing fingers, malformed hands, fused hands, broken perspective, cropped head, cut-off hands, out of frame, awkward pose, plastic skin, harsh HDR, neon colors, excessive bloom, excessive lens flare, oversaturated colors, gore, violence, weapon, sexualized pose, fanservice
```

> **`cg_omoide_chikeizu_kansei`だけの注意**: 地図内の正確な日本語は生成後に組版する。生成時は、文字を入れる場所がわかる整ったキャプション枠と記号的な図形を作り、文字化けした文章は出さない。

---

## 一覧（物語順・添付ファイル早見）

| # | ID | 場面 | 添付する背景 | 添付する立ち絵 | KB |
|---:|---|---|---|---|---|
| 1 | `cg_chizutsutsu_kobore_shashin` | 地図筒から古写真がこぼれる | `assets/bg/bg_chizu_hokanko.png` | `chr_mie_03_douyou.png`・`chr_katsuya_06_katai_muhyoujou.png` | あり |
| 2 | `cg_omoide_chikeizu_kansei` | 「思い出の地形図」完成図 | （作品アート。背景添付不要） | `chr_mie_07_honki_shinken.png`・`chr_ryoma_01_tsuujou.png`（直後の芝居の基準） | あり |
| 3 | `cg_yama_ue_hajimete_chizu` | 若き勝也と稲葉、初めての地形図 | `assets/bg/bg_yama_kaisou.png` | `chr_inaba_01_furushashin_hohoemi.png`・`chr_katsuya_01_tsuujou.png`（若き日の顔基準） | あり |
| 4 | `cg_hareyaka_na_emi` | 勝也、晴れやかな笑み | `assets/bg/bg_hokutou_kyoshitsu_yuugata.png` | `chr_katsuya_10_hareyaka_emi.png` | あり |
| 5 | `cg_sotsugyou_sakurafubuki` | 卒業式と桜吹雪 | `assets/bg/bg_sotsugyoushiki_kaijou.png` | `chr_ryoma_02_niyari.png`・`chr_mie_09_sunao_hohoemi.png` | あり |
| 6 | `cg_end_true` | TRUE END・数年後の教室 | `assets/bg/bg_kyoshitsu_suunengo.png` | `chr_katsuya_02_hohoemi.png` | あり |
| 7 | `cg_end_bonus` | BONUS EXTRA・数年後の同窓会 | `assets/bg/bg_suiko_hotori.png` | `chr_katsuya_10_hareyaka_emi.png`・`chr_ryoma_02_niyari.png`・`chr_mie_09_sunao_hohoemi.png` | あり |

> 「添付する立ち絵」は `assets/chr/` の実画像。**CGの表示中、本編の立ち絵は強制非表示になる**ため、
> キャラクターはCGの中に描き込む ―― そのための顔・制服の基準として添付する。
> 1枚に複数キャラが出るCGは、挙げた立ち絵を全員分添付してから生成する。

---

# 個別プロンプト（物語順）

## 1. 差出人不明の写真

### `cg_chizutsutsu_kobore_shashin` — 三重／勝也、地図筒から古写真がこぼれる

- **ファイル**: `assets/cg/cg_chizutsutsu_kobore_shashin.png`
- **シーン**: `c004_hokanko` / 第一章（`10_chapter1.txt`）
- **添付する背景**: `assets/bg/bg_chizu_hokanko.png`（本編でCGの裏に出ている地図保管庫）
- **添付する立ち絵**: `chr_mie_03_douyou.png`（驚く三重）・`chr_katsuya_06_katai_muhyoujou.png`（硬くなる勝也）
- **Prompt**:

```text
Inside a narrow map archive at a Japanese high school, shelves packed with dusty cylindrical map cases and old paper. Mie and adult geography teacher Katsuya are handling one weathered map tube together; its lid has just popped loose and an old map, loose papers and one sepia photograph are suspended in mid-air. Mie twists toward the falling photograph in startled surprise, while Katsuya stands one step behind him, suddenly rigid and guarded. The photograph visibly shows two smiling young men on a mountain with a topographic map, but contains no readable writing. Focus on the airborne photograph, hands and the instant of suspended time, warm dusty ceiling light, tiny dust motes, quiet dramatic tension, medium-wide cinematic composition.
```

- **演出メモ**: 写真が画面の視線誘導の中心。勝也の驚きは大きくしすぎず、「知っているものを見られた」硬さで表現する。

## 2. 収束章 — 地図を作る夜

### `cg_omoide_chikeizu_kansei` — 「思い出の地形図」完成図

- **ファイル**: `assets/cg/cg_omoide_chikeizu_kansei.png`
- **シーン**: `g3` / 収束章（`50_converge.txt`）
- **添付する背景**: なし（画面全体が作品アート。直前の背景は `assets/bg/bg_hokutou_kyoshitsu_yoru.png`）
- **添付する立ち絵**: 絵自体には人物を描かない。直後に続く芝居の基準として `chr_mie_07_honki_shinken.png`・`chr_ryoma_01_tsuujou.png`（任意）
- **Prompt**:

```text
A full-frame top-down artwork of a handmade memory topographic map spread across a large sheet of paper, designed as the emotional centerpiece of a Japanese visual novel. Organic contour lines connect symbolic landmarks from three years of school life: the shore of Suiko Lake with tiny footprints, the black lava plateau of Hawaii, a North-building corn-soup vending machine and its long absence, the Itoigawa–Shizuoka tectonic line running through the center, regional miso and mochi markers on both sides, a sports-court diagram with a two-point difference, small printed photographs, colored tape, handwritten-style empty caption areas and layered paper textures. At one inconspicuous corner, leave a small intentional blank space where Ryoma has added a private note. Rich tactile paper, colored pencil, marker and collage details, carefully balanced graphic design, warm midnight classroom light, beautiful and legible visual hierarchy, no UI. Any exact Japanese labels will be typeset in post-production; do not generate garbled text.
```

- **演出メモ**: 地図の主役は「出来事の一覧」ではなく、三年間が等高線として一枚に繋がった作品アート。正確な日本語は後処理する。

## 3. クライマックス — 窓の外に、ずっといた人

### `cg_yama_ue_hajimete_chizu` — 若き勝也と稲葉、はじめての地形図

- **ファイル**: `assets/cg/cg_yama_ue_hajimete_chizu.png`
- **シーン**: `h3` / クライマックス回想（`60_climax.txt`）
- **添付する背景**: `assets/bg/bg_yama_kaisou.png`（回想の山・褪色調）
- **添付する立ち絵**: `chr_inaba_01_furushashin_hohoemi.png`（稲葉の唯一の基準＝古写真）・`chr_katsuya_01_tsuujou.png`（若き勝也の顔の面影の基準）
- **Prompt**:

```text
A faded, sun-washed flashback on a mountain ridge, rendered with restrained sepia and washed-out film colors. Young Katsuya, still a student in practical outdoor clothes, kneels beside an older geography mentor Inaba Teiji. Between them lies an open topographic map; Inaba points toward a tightly packed set of contour lines while young Katsuya studies the map with earnest uncertainty. The mountain landscape and the two figures are framed by warm backlight, edges slightly softened like a treasured memory. Show guidance rather than heroism, a quiet beginning of a lifelong way of seeing the ground, wide cinematic composition, no readable writing.
```

- **演出メモ**: 稲葉を「偉人」の肖像にしない。若い勝也が教わる側だったこと、二人の間に地図があることを優先する。

### `cg_hareyaka_na_emi` — 勝也、晴れやかな笑み

- **ファイル**: `assets/cg/cg_hareyaka_na_emi.png`
- **シーン**: `h8` / クライマックス（`60_climax.txt`）
- **添付する背景**: `assets/bg/bg_hokutou_kyoshitsu_yuugata.png`（茜色の教室）
- **添付する立ち絵**: `chr_katsuya_10_hareyaka_emi.png`（**表情⑩＝このCGと同じ笑み**。顔をこの立ち絵に一致させる）
- **Prompt**:

```text
Adult geography teacher Katsuya in the late-afternoon classroom, a wide three-quarter composition at the emotional release of the story. Show the open window, the distant mountain ridge to which he addresses his absent mentor, and the handmade memory map behind him in the same frame. He looks toward the mountains and wears a rare, completely open, radiant smile—the first truly carefree smile he has shown in three years—with a trace of moisture still in his eyes. The familiar handmade map and warm sunset remain softly behind him, while golden light outlines his face and shoulders. His expression must feel earned, gentle and relieved, never like a commercial grin. Cinematic visual novel key art, subtle light flare only, uncluttered composition with safe lower space for dialogue.
```

- **演出メモ**: 顔アップの立ち絵拡大にはしない。窓の向こうの山・勝也の視線・背後の地図を同じ画面に置き、「稲葉への報告」を空間で描く。笑顔を若返らせたり、過剰な涙や光で誤魔化したりしない。

## 4. 卒業式

### `cg_sotsugyou_sakurafubuki` — 全員集合、卒業式と桜吹雪

- **ファイル**: `assets/cg/cg_sotsugyou_sakurafubuki.png`
- **シーン**: `end0` / 共通エピローグ（`70_endings.txt`）
- **添付する背景**: `assets/bg/bg_sotsugyoushiki_kaijou.png`（卒業式会場）
- **添付する立ち絵**: `chr_ryoma_02_niyari.png`・`chr_mie_09_sunao_hohoemi.png`（前景の二人。他キャストも同じ顔基準で揃える）
- **Prompt**:

```text
A warm spring graduation ceremony for a Japanese high school, a large representative group from the North science building and South integrated building gathered together beneath drifting cherry blossom petals. Show the established students in their school uniforms, clearly preserving the contrast between burgundy-red North ties and navy South ties. Ryoma and Mie can anchor the foreground with their familiar contrasting expressions—Ryoma sincerely grateful and Mie trying to keep a straight face—while the rest of the class forms a joyful but natural crowd behind them. Include the graduation venue, soft afternoon light, petals crossing the frame, restrained celebration after three years together, cinematic 16:9 ensemble composition, no banner text or logos.
```

- **演出メモ**: 喜劇の余韻を残した卒業カット。泣き崩れる集合写真ではなく、「まだこの関係が続く」明るさにする。

---

# エンディングCG（14枚）

> 各エンドカードは「そのENDに到達した瞬間だけ出る1枚」。背景・立ち絵の添付は、
> 脚本で `@cg` が灯るときの `@bg`・`@chr` と一致させてある（＝本編の続きに見える）。

## 5. TRUE END

### `cg_end_true` — 数年後の教室と地図

- **ファイル**: `assets/cg/cg_end_true.png`
- **シーン**: `end_true`（`70_endings.txt`）
- **添付する背景**: `assets/bg/bg_kyoshitsu_suunengo.png`（数年後の教室）
- **添付する立ち絵**: `chr_katsuya_02_hohoemi.png`
- **Prompt**:

```text
Several years later in the same North science classroom, now occupied by a new generation. Adult geography teacher Katsuya stands at the front and unfolds the same familiar topographic map for a small group of new students. His expression is calm and gently smiling, carrying the memory of the former class without becoming nostalgic spectacle. In one corner, a former student now serving as a new teacher or trainee watches with a quiet smile; on a desk, an open graduation album creates a subtle visual montage of the old class without readable photographs or text. Repeat the classroom geometry from the main story but make the light softer and more hopeful, warm spring daylight, circular sense of time, cinematic wide composition, map as the visual center.
```

- **演出メモ**: 過去クラスの同窓会写真を画面いっぱいに貼るのではなく、同じ地図が次の誰かへ渡る循環を中心にする。

## 6. BONUS EXTRA

### `cg_end_bonus` — 数年後の翠湖、同窓会

- **ファイル**: `assets/cg/cg_end_bonus.png`
- **シーン**: `end_bonus`（`70_endings.txt`）
- **添付する背景**: `assets/bg/bg_suiko_hotori.png`（翠湖のほとり）
- **添付する立ち絵**: `chr_katsuya_10_hareyaka_emi.png`・`chr_ryoma_02_niyari.png`・`chr_mie_09_sunao_hohoemi.png`（前景の三人。残りのキャストも既存立ち絵に顔を揃える）
- **Prompt**:

```text
A wide summer reunion at the shore of Suiko Lake several years after graduation. The former North science class and the South-building friends have gathered together with adult teacher Katsuya, a large but readable ensemble of familiar faces around a picnic cloth, old photographs and a folded memory map. Katsuya has a relaxed smile; Ryoma is animated and delighted, Mie looks exasperated but unmistakably happy, and Sakura, Naitou, Mitsumine, Satou, Rei, Terachi, Izaki, Izumi, Meshino and Kuraishi all feel like the same established people now older by several years. Lush lakeside greenery, summer sky, warm clear light, small overlapping conversations, a sense that the class has not ended even though everyone took different paths. Keep the ensemble natural and not overcrowded, cinematic wide group composition, no readable text or logos.
```

- **演出メモ**: 全員集合の最終カット。変わらない掛け合いと、それぞれが別の時間を歩いてきた事実を同時に入れる。湖・地図・人の輪を三角形に配置するとまとまりやすい。

---

## 撤去したCGは生成しない

今回の19枚と選定理由は `CG_PRUNING_2026-09-15.md`。過去の撤去分も含め、現行の制作対象は上記7枚だけ。

## 配置チェックリスト

- [ ] 画像が `assets/cg/` の台帳ファイル名と一致している（版B にも `game/assets/img/` へコピー）
- [ ] 1920×1080（最低 1600×900）、16:9、全面不透明である
- [ ] 添付した背景・立ち絵と色・制服・顔が一致している
- [ ] UI、吹き出し、字幕、ロゴ、ウォーターマークを描いていない
- [ ] 重要な顔・手・地図の要素が上下左右の端に寄りすぎていない（Ken Burns対応）
- [ ] 下 35% はテキスト窓に沈む前提で、顔と手は上 2/3 に置いた
- [ ] `cg_omoide_chikeizu_kansei` の日本語ラベルを後処理で組版した
- [ ] `data/assets.json` の該当行を `"placeholder": false` に変更した
- [ ] `sw.js` のキャッシュバージョンを更新した（`node tools/sync_placeholder.mjs --bump`）
- [ ] `node tools/vncheck.mjs` を実行した

配置・台帳更新の詳細は `assets/cg/README.md` §「差し替え手順（CG共通）」を参照。
