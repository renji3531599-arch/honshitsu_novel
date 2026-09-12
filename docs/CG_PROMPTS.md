# 全CG生成プロンプト集

『まだ地図の途中で ―― ✝本質✝特別編』の**現行本編CG 32枚（名場面18枚＋エンディング14枚）**を生成するためのプロンプト集。

- 正本: `data/assets.json`
- 構図・出番: `docs/CG_GUIDE.md`
- 脚本上の表示箇所: `data/script/*.txt`
- 生成後の配置先: `assets/cg/`
- 仕様: **1600×900 / 16:9 / PNGまたはJPEG / 全面不透明**
- 2026-09-12(3): 本編CGの番号スロット（`cg02` 等）は廃止。bgと同じ「ID＝ファイル名」の実名（例: `cg_chizutsutsu_kobore_shashin`）に改名済み。

2026-09-12時点で降板した旧CG（`cg01`、`cg03`〜`cg06`、`cg08`、`cg10`、`cg11`、`cg14`〜`cg18`、`cg21`、`cg24`、`cg25`、`cg32`、`cg36`〜`cg38`）は含めない。UI画像・立ち絵・背景の生成プロンプトも本書の対象外。

---

## 使い方

1. 下記の「共通ベースプロンプト」を先頭に付ける。
2. 各CGの個別プロンプトを続ける。
3. 「共通ネガティブプロンプト」をネガティブ欄に入れる。
4. キャラクターや背景の基準画像を使える場合は、同じキャラクター参照画像・対応するBG画像を毎回添付する。特に顔、髪型、制服、体格は**全CGで同一デザイン**にする。
5. 生成後、正確な日本語の文字・年号・キャプションは必要に応じて後処理で入れる。画像生成モデルに文字を任せない。

### 共通ベースプロンプト（英語）

```text
A full-bleed 16:9 Japanese visual novel event CG, cinematic 2D anime illustration, mature light-novel key-visual quality, clean expressive line art, restrained cel shading, painterly atmospheric background, realistic teenage and adult proportions, carefully staged eye-lines and hands, emotionally subtle acting, natural perspective, soft filmic color grading, detailed but uncluttered composition, leave safe margins for a visual-novel text box, no UI and no decorative frame. Use the approved character reference sheets for every face, hairstyle, body proportion, age, uniform and color; keep the cast visually consistent across all images. Students from the North science building wear the established burgundy-red school tie, students from the South integrated building wear the established navy tie. Do not add any text, speech bubbles, captions, logos or watermark inside the image.
```

### キャラクター継続性メモ

髪色・髪型・顔立ちなど未確定の要素は、最初に作ったキャラクター設定画を基準に固定する。プロンプトでは役割と表情を優先し、毎回デザインを再解釈しない。

- **塀勝也**: 成人男性の地理教師。穏やかで抑制された佇まい。通常は感情を表に出さず、クライマックスだけ表情が大きく開く。
- **三重県臣**: 北棟・理数科の男子高校生。えんじ色のネクタイ、半目気味の冷笑と、隠しきれない動揺。
- **両馬二郎**: 北棟・理数科の男子高校生。えんじ色のネクタイ。普段は軽快だが、祖父の話では真剣で、笑顔と涙が同居する。
- **砂糖東洋**: 北棟・理数科の男子高校生。えんじ色のネクタイ。ゲームとスマートフォンを手放さないが、景色を見ている。
- **数理零**: 北棟・理数科の男子高校生。えんじ色のネクタイ。落ち着いた観察者で、静かに本気の言葉を選ぶ。
- **寺地星**: 北棟・理数科の高校生。本質配信者。紙、マジック、配信機材を使う。普段は眠そうだが、朗読時は強い集中を見せる。
- **伊崎・伊豆見**: 北棟側の高校生。準備と進行を担う組み合わせ。二人の距離感は親しいが、依存的にはしない。
- **召野カイト**: 北棟側の高校生。言葉を届けることに目覚めた人物。エンディングでは国際・英語教育系の進路を感じさせる。
- **倉石暁**: 年下の北棟・理数科生。✝本質✝年鑑を編纂する記録係。熱狂と真剣さを両立させる。
- **櫻優**: 南棟・中高一貫側の高校生。紺色のネクタイ。恋愛学を研究する理論派。
- **内藤蘭**: 南棟・中高一貫側の高校生。紺色のネクタイ。静かで、本を読むことが多い。小さな微笑みが重要。
- **三峰瑠衣**: 南棟・中高一貫側の女子高校生。紺色のネクタイ。常識人で、二人を支える連絡係。
- **稲葉悌二**: 回想にだけ登場する、勝也のかつての指導者。山と地図を知る成人男性。説明的な英雄にはせず、記憶の中の存在として描く。
- **若き日の勝也**: 回想専用。現在の勝也と同じ人物だとわかる面影を残すが、未熟さのある若者として描く。

### 共通ネガティブプロンプト（英語）

```text
photorealistic, 3D render, chibi, super-deformed, childish proportions, manga panel borders, comic speech bubbles, UI, game interface, subtitles, captions, logo, watermark, frame, border, random Japanese text, garbled lettering, unreadable text, text artifacts, extra characters, duplicate person, cloned face, wrong age, wrong school uniform, wrong tie color, inconsistent character design, extra arms, extra legs, extra fingers, missing fingers, malformed hands, fused hands, broken perspective, cropped head, cut-off hands, out of frame, awkward pose, plastic skin, harsh HDR, neon colors, excessive bloom, excessive lens flare, oversaturated colors, gore, violence, weapon, sexualized pose, fanservice
```

> **`cg_omoide_chikeizu_kansei`だけの注意**: 地図内の正確な日本語は生成後に組版する。生成時は、文字を入れる場所がわかる整ったキャプション枠と記号的な図形を作り、文字化けした文章は出さない。

---

## 一覧

| ID | ファイル | 場面 | 背景 | Ken Burns |
|---|---|---|---|---|
| `cg_chizutsutsu_kobore_shashin` | `cg_chizutsutsu_kobore_shashin.png` | 地図筒から古写真がこぼれる | BG08 | あり |
| `cg_mado_ushiro_miteteta` | `cg_mado_ushiro_miteteta.png` | 砂糖が「見てた」と認める | BG03 | なし |
| `cg_tsukue_kakomi_daiji` | `cg_tsukue_kakomi_daiji.png` | 零が「大事」と言う | BG09 | なし |
| `cg_butsudan_seiza_sugata` | `cg_butsudan_seiza_sugata.png` | 両馬、祖父の仏壇の前 | BG19 | あり |
| `cg_butsudan_narabu_futari` | `cg_butsudan_narabu_futari.png` | 祖父の口癖を語る二人 | BG19 | なし |
| `cg_naitou_kao_age` | `cg_naitou_kao_age.png` | 内藤が本質配信を見ていたと告げる | BG18 | あり |
| `cg_yoru_chizu_tsukuri` | `cg_yoru_chizu_tsukuri.png` | 全員で地図を作る夜 | BG04 | あり |
| `cg_omoide_chikeizu_kansei` | `cg_omoide_chikeizu_kansei.png` | 「思い出の地形図」完成図 | 作品アート | あり |
| `cg_yuugata_madobe_katsuya` | `cg_yuugata_madobe_katsuya.png` | 勝也、夕方の窓際に立つ | BG03 | あり |
| `cg_nagai_chinmoku` | `cg_nagai_chinmoku.png` | 五秒を超える沈黙 | BG03 | なし |
| `cg_yama_ue_hajimete_chizu` | `cg_yama_ue_hajimete_chizu.png` | 若き勝也と稲葉、初めての地形図 | BG21 | あり |
| `cg_wakaki_utsumuki` | `cg_wakaki_utsumuki.png` | 若き勝也、生意気を言った日 | BG22 | あり |
| `cg_kuhou_kageboushi` | `cg_kuhou_kageboushi.png` | 訃報を知った瞬間 | BG22 | なし |
| `cg_mado_gawa_no_houkoku` | `cg_mado_gawa_no_houkoku.png` | 勝也、窓の外への報告を語る | BG03 | なし |
| `cg_seito_wo_miwatasu` | `cg_seito_wo_miwatasu.png` | 勝也が生徒たちを見渡す | BG03 | あり |
| `cg_hitorizutsu_no_kotoba` | `cg_hitorizutsu_no_kotoba.png` | 一人ずつの言葉を受け取る | BG03 | あり |
| `cg_hareyaka_na_emi` | `cg_hareyaka_na_emi.png` | 勝也、晴れやかな笑み | BG03 | あり |
| `cg_sotsugyou_sakurafubuki` | `cg_sotsugyou_sakurafubuki.png` | 卒業式と桜吹雪 | BG17 | あり |
| `cg_end_true` | `cg_end_true.png` | TRUE END・数年後の教室 | BG24 | あり |
| `cg_end_mie` | `cg_end_mie.png` | GOOD END・三重、教壇の練習 | BG23 | あり |
| `cg_end_satou` | `cg_end_satou.png` | GOOD END・砂糖、フィールド | BG23 | あり |
| `cg_end_rei` | `cg_end_rei.png` | GOOD END・零、研究室 | BG09 | あり |
| `cg_end_terachi` | `cg_end_terachi.png` | GOOD END・寺地、配信継続 | BG04 | あり |
| `cg_end_ryoma` | `cg_end_ryoma.png` | GOOD END・両馬、墓前の報告 | BG19 | あり |
| `cg_end_izaki_izumi` | `cg_end_izaki_izumi.png` | GOOD END・伊崎＋伊豆見 | BG16 | あり |
| `cg_end_meshino` | `cg_end_meshino.png` | GOOD END・召野、言葉を届ける | BG18 | あり |
| `cg_end_kuraishi` | `cg_end_kuraishi.png` | GOOD END・倉石、年鑑を託す | BG06 | あり |
| `cg_end_minamitou` | `cg_end_minamitou.png` | GOOD END・南棟の三人 | BG16 | あり |
| `cg_end_normal` | `cg_end_normal.png` | NORMAL END・未完の地図 | BG03 | あり |
| `cg_end_bittersweet` | `cg_end_bittersweet.png` | BITTERSWEET END・こぼれた地図 | BG03 | なし |
| `cg_end_comedy` | `cg_end_comedy.png` | COMEDY SECRET END | BG02 | あり |
| `cg_end_bonus` | `cg_end_bonus.png` | BONUS EXTRA・数年後の同窓会 | BG11 | あり |

> `cg_mado_gawa_no_houkoku`、`cg_seito_wo_miwatasu`、`cg_hitorizutsu_no_kotoba`、`cg_hareyaka_na_emi`は、実行される脚本の `@bg bg_hokutou_kyoshitsu_yuugata` に合わせてBG03（夕方の教室）とした。旧資料の一部にBG13と書かれた箇所があるが、プロンプトは脚本を正とする。

---

# 個別プロンプト

## 1. 差出人不明の写真

### `cg_chizutsutsu_kobore_shashin` — 三重／勝也、地図筒から古写真がこぼれる

- **ファイル**: `assets/cg/cg_chizutsutsu_kobore_shashin.png`
- **シーン**: `c004_hokanko` / 第一章
- **Prompt**:

```text
Inside a narrow map archive at a Japanese high school, shelves packed with dusty cylindrical map cases and old paper. Mie and adult geography teacher Katsuya are handling one weathered map tube together; its lid has just popped loose and an old map, loose papers and one sepia photograph are suspended in mid-air. Mie twists toward the falling photograph in startled surprise, while Katsuya stands one step behind him, suddenly rigid and guarded. The photograph visibly shows two smiling young men on a mountain with a topographic map, but contains no readable writing. Focus on the airborne photograph, hands and the instant of suspended time, warm dusty ceiling light, tiny dust motes, quiet dramatic tension, medium-wide cinematic composition.
```

- **演出メモ**: 写真が画面の視線誘導の中心。勝也の驚きは大きくしすぎず、「知っているものを見られた」硬さで表現する。

### `cg_mado_ushiro_miteteta` — 砂糖／三重、「見てた」と認める

- **ファイル**: `assets/cg/cg_mado_ushiro_miteteta.png`
- **シーン**: `a2` / 砂糖編
- **Prompt**:

```text
A quiet late-afternoon North science classroom, orange sunset entering through the windows, long desk shadows and an empty room after school. Reserved North-building student Satou stands near the window with his smartphone lowered, turning toward Mie after finally sharing three years of landscape photographs. His expression is embarrassed but honest, a guarded gamer revealing a small vulnerable smile. Mie stands opposite him, silent and surprised, half-lidded skepticism softened by recognition. Two-person medium shot, window behind Satou, warm backlight outlining both figures, generous quiet negative space, intimate but understated emotional tension, no tears and no melodrama.
```

- **演出メモ**: 砂糖の「見てた」は告白のように過剰にしない。スマートフォンは補助要素で、二人の視線と距離を主役にする。

## 2. 零編 — 面白いの向こう側

### `cg_tsukue_kakomi_daiji` — 零／両馬／三重、「大事だと思うから」

- **ファイル**: `assets/cg/cg_tsukue_kakomi_daiji.png`
- **シーン**: `b2` / 零編
- **Prompt**:

```text
A warm, quiet Japanese high-school library with tall bookshelves, a wooden table and late afternoon light. Three North science students sit around the table: Rei is centered and composed, one hand resting on organized photographs and data, speaking with unusual sincerity; Ryoma and Mie have both stopped joking and are listening, visibly caught off guard. Rei's expression is calm but searching, as if he has chosen a word beyond his usual praise of “interesting.” Show the held breath of the other two through their eyes and posture, a close three-person composition with the papers and the shared table forming a visual triangle, restrained emotion and natural classroom realism.
```

- **演出メモ**: コメディの顔を残しつつ、三人とも「今の言葉は軽くない」と理解した瞬間にする。文字は描かない。

## 3. 両馬編 — 祖父と✝本質✝

### `cg_butsudan_seiza_sugata` — 両馬、祖父の仏壇の前

- **ファイル**: `assets/cg/cg_butsudan_seiza_sugata.png`
- **シーン**: `d1` / 両馬編
- **Prompt**:

```text
A lived-in Japanese tatami room in the late afternoon, a family altar with an old grandfather portrait in the background, incense smoke rising in a thin quiet column. Ryoma kneels in seiza in front of the altar, seen mostly from behind and in three-quarter profile, placing one incense stick with unusual seriousness. He is the only visible character and the clear emotional focal point; leave a small empty space beside him to imply that someone is listening just outside the main composition. Warm side light from a window, muted earth tones, domestic details, the smoke and Ryoma's back carrying the grief, wide contemplative composition, intimate silence rather than theatrical sadness.
```

- **演出メモ**: 祖父の遺影は主張させすぎない。線香の煙、座る距離、生活感で「話せる場所」を見せる。

### `cg_butsudan_narabu_futari` — 両馬／三重、祖父の口癖を語る

- **ファイル**: `assets/cg/cg_butsudan_narabu_futari.png`
- **シーン**: `d2` / 両馬編
- **Prompt**:

```text
The same Japanese family room and altar, now shown from a gentle side angle. Ryoma and Mie sit next to each other on the tatami, framed in a lived-in domestic space with a low table, folded cloth and the grandfather's portrait softly out of focus. Ryoma speaks about the voice of his late grandfather, his face caught between a small laugh and grief; Mie listens with an uncharacteristically open, quiet expression, no sarcasm. The two figures share the same horizontal line but keep a little personal space, warm incense haze, subdued amber light, emotionally grounded medium-wide composition.
```

- **演出メモ**: 並んでいるが密着させない。両馬の笑いと寂しさ、三重の「聞く」姿勢を同じ画面に置く。

## 4. 南棟編 — 境界線の向こう側

### `cg_naitou_kao_age` — 内藤、ずっと見ていた

- **ファイル**: `assets/cg/cg_naitou_kao_age.png`
- **シーン**: `e3` / 南棟編
- **Prompt**:

```text
A calm South-building integrated-classroom interior in soft afternoon light, navy-tie school atmosphere, desks and books in the background. Naitou stands or sits near the window with a book resting nearby. Begin with her eyes lowered, then capture the exact instant she gently raises her face and meets the unseen listener's gaze, quietly saying that she has always watched the Honshitsu stream. Her expression is modest, sincere and quietly brave, not dramatic. Use a medium close-up with delicate window light on her eyes, a soft background blur, muted blue and cream palette, and enough negative space for the feeling of a small truth finally reaching someone.
```

- **演出メモ**: 「本質配信、ずっと見てます」は大声の告白ではなく、静かな肯定。目線の変化を一枚で読めるようにする。

## 5. 地図を作る夜

### `cg_yoru_chizu_tsukuri` — 全員で地図を作る夜

- **ファイル**: `assets/cg/cg_yoru_chizu_tsukuri.png`
- **シーン**: `g1` / 収束章
- **Prompt**:

```text
A wide overhead three-quarter view of an empty North science classroom late at night, curtains closed, only warm fluorescent lights on, the room feeling like a secret base. A large mixed group of North-building and South-building students has pushed desks together around a huge sheet of paper. Show many distinct roles in one coherent composition: students sorting three years of train and field photographs, Rei arranging data, Terachi preparing paper and markers, Kuraishi checking dated records, Izaki and Izumi managing materials, the South-building students adding their memories, and Ryoma placing a symbolic mark. The group should feel busy, collaborative and emotionally united, with readable hands, photographs, laptops, pens and papers, but not overcrowded. Cinematic top-down ensemble composition, warm pools of light against the dark classroom, sincere late-night energy.
```

- **演出メモ**: 10〜12人程度の集合感を出すが、顔を全員正面に並べない。作業の違いが読める俯瞰構図にする。

### `cg_omoide_chikeizu_kansei` — 「思い出の地形図」完成図

- **ファイル**: `assets/cg/cg_omoide_chikeizu_kansei.png`
- **シーン**: `g3` / 収束章
- **Prompt**:

```text
A full-frame top-down artwork of a handmade memory topographic map spread across a large sheet of paper, designed as the emotional centerpiece of a Japanese visual novel. Organic contour lines connect symbolic landmarks from three years of school life: the shore of Suiko Lake with tiny footprints, the black lava plateau of Hawaii, a North-building corn-soup vending machine and its long absence, the Itoigawa–Shizuoka tectonic line running through the center, regional miso and mochi markers on both sides, a sports-court diagram with a two-point difference, small printed photographs, colored tape, handwritten-style empty caption areas and layered paper textures. At one inconspicuous corner, leave a small intentional blank space where Ryoma has added a private note. Rich tactile paper, colored pencil, marker and collage details, carefully balanced graphic design, warm midnight classroom light, beautiful and legible visual hierarchy, no UI. Any exact Japanese labels will be typeset in post-production; do not generate garbled text.
```

- **演出メモ**: 地図の主役は「出来事の一覧」ではなく、三年間が等高線として一枚に繋がった作品アート。正確な日本語は後処理する。

## 6. 窓の外に、ずっといた人

### `cg_yuugata_madobe_katsuya` — 勝也、夕方の窓際

- **ファイル**: `assets/cg/cg_yuugata_madobe_katsuya.png`
- **シーン**: `h1` / クライマックス
- **Prompt**:

```text
An empty North science classroom at deep late afternoon, rich vermilion and amber light pouring through the window. Adult geography teacher Katsuya stands alone by the window, seen from behind in a quiet three-quarter silhouette, looking toward the distant mountains. The blackboard behind him is filled with the large handmade memory map, its contour-like lines replacing ordinary geography. His posture is calm but carries years of private ritual, one hand resting near the desk, no face yet revealed. Wide cinematic composition, strong window backlight, long shadows, restrained melancholy and anticipation, the feeling of a person who has always been waiting outside the frame.
```

- **演出メモ**: クライマックス直前なので、感情を説明しすぎない。後ろ姿と窓の光で「いつもの五秒」を象徴する。

### `cg_nagai_chinmoku` — 五秒を超える沈黙

- **ファイル**: `assets/cg/cg_nagai_chinmoku.png`
- **シーン**: `h2` / クライマックス
- **Prompt**:

```text
The same sunset classroom, but now a medium close three-quarter portrait of adult teacher Katsuya after he has looked out the window far longer than his usual five seconds. His face is finally visible: reserved, surprised by the sincerity of his students, holding back tears without actually crying, eyes reflecting the warm window light. At the edges of the frame, keep only soft out-of-focus hints of the silent students and the handmade map. The room has stopped being comedic; everyone is holding their breath. Static, carefully balanced composition, intimate eye-level camera, subtle emotion, no exaggerated sobbing.
```

- **演出メモ**: 15秒の沈黙を「表情の変化」で見せる静止画。泣く直前ではなく、言葉を受け取った顔にする。

### `cg_yama_ue_hajimete_chizu` — 若き勝也と稲葉、はじめての地形図

- **ファイル**: `assets/cg/cg_yama_ue_hajimete_chizu.png`
- **シーン**: `h3` / クライマックス回想
- **Prompt**:

```text
A faded, sun-washed flashback on a mountain ridge, rendered with restrained sepia and washed-out film colors. Young Katsuya, still a student in practical outdoor clothes, kneels beside an older geography mentor Inaba Teiji. Between them lies an open topographic map; Inaba points toward a tightly packed set of contour lines while young Katsuya studies the map with earnest uncertainty. The mountain landscape and the two figures are framed by warm backlight, edges slightly softened like a treasured memory. Show guidance rather than heroism, a quiet beginning of a lifelong way of seeing the ground, wide cinematic composition, no readable writing.
```

- **演出メモ**: 稲葉を「偉人」の肖像にしない。若い勝也が教わる側だったこと、二人の間に地図があることを優先する。

### `cg_wakaki_utsumuki` — 若き勝也、生意気を言った日

- **ファイル**: `assets/cg/cg_wakaki_utsumuki.png`
- **シーン**: `h4` / クライマックス回想
- **Prompt**:

```text
A muted flashback at a university-era field research base camp, tents, geological equipment and a mountain valley under a pale overcast sky. Young Katsuya is shown alone in a three-quarter rear view, head bowed after saying something too blunt to his mentor, one hand holding a folded field map and the other hanging uncertainly at his side. His posture is proud enough to show regret, not melodramatic despair. Keep Inaba off-screen, represented only by an empty space and the quiet camp behind him. Faded blue-gray and sepia memory palette, soft wind, restrained composition, emotional distance and the feeling of a missed chance.
```

- **演出メモ**: 台詞を絵に書かない。若き勝也の未熟さと「次はあると思っていた」後悔を、俯いた姿勢と空白で表現する。

### `cg_kuhou_kageboushi` — 訃報を知った瞬間

- **ファイル**: `assets/cg/cg_kuhou_kageboushi.png`
- **シーン**: `h4` / クライマックス回想
- **Prompt**:

```text
A dark, respectful flashback at a rain-swollen mountain ravine near the old field research camp. Young Katsuya appears only as a distant human silhouette partly swallowed by fog, rain and the shadow of the surrounding terrain; his face must remain unreadable. Wet rocks, violent water and a dim gray sky imply the sudden loss without showing a body, accident or graphic detail. The image should feel like a memory breaking apart, with a large area of darkness and a single small figure standing still. Desaturated charcoal, blue-gray and faded sepia palette, static and solemn, no horror imagery, no readable text.
```

- **演出メモ**: 訃報の説明図にしない。顔を隠し、沢と暗さだけで「次は来なかった」を受け止める。

### `cg_mado_gawa_no_houkoku` — 勝也、窓の外へ報告する

- **ファイル**: `assets/cg/cg_mado_gawa_no_houkoku.png`
- **シーン**: `h5` / クライマックス
- **Prompt**:

```text
Back in the present, a late-afternoon North classroom with the distant mountains visible through the window. Adult teacher Katsuya is shown in a quiet medium shot, one hand near the window or the edge of the familiar topographic map, speaking about how he has reported each day's students to Inaba in his mind. His eyes are moist but steady, his expression neither broken nor fully smiling, carrying a private ritual finally spoken aloud. Warm sunset rim light, the classroom softly out of focus behind him, a faint reflection of the window crossing his face, contemplative visual novel key art, static composition, no other focal character.
```

- **演出メモ**: 「泣かない＝平気ではない」の中間。涙をこぼす表情ではなく、声にしてしまった重さを目元と口元に置く。

### `cg_seito_wo_miwatasu` — 勝也が生徒たちを見渡す

- **ファイル**: `assets/cg/cg_seito_wo_miwatasu.png`
- **シーン**: `h6` / クライマックス
- **Prompt**:

```text
A wide emotional ensemble shot inside the sunset North science classroom. Adult teacher Katsuya stands in the foreground or center, looking across a mixed group of North-building and South-building students who have gathered around the handmade memory map. Mie, Ryoma and the other students are recognizable as the same established cast, but the composition prioritizes Katsuya's gaze traveling from one face to another. The students are quiet, no one is posing for a group photo; some sit on desks, some stand, and their varied expressions show that they understand him. Warm vermilion window light connects everyone, the map forms a visual bridge through the lower frame, expansive cinematic lens, a moment of mutual recognition rather than spectacle.
```

- **演出メモ**: 全員集合でも「全員がカメラを見る」構図にしない。勝也の視線と、生徒側の受け止めを同時に読ませる。

### `cg_hitorizutsu_no_kotoba` — 一人ずつの言葉を受け取る

- **ファイル**: `assets/cg/cg_hitorizutsu_no_kotoba.png`
- **シーン**: `h7` / クライマックス
- **Prompt**:

```text
A quiet sunset classroom ensemble during a final reading. Terachi holds a stack of handwritten pages near the foreground, while the mixed group of students stands or sits around adult teacher Katsuya. The visual emphasis is on Katsuya receiving one sincere message after another: he tries to smile, then stops, his eyes shining as he holds back tears. Include small distinct reactions across the group—Satou looking down, Rei composed but softened, Ryoma openly moved, Mie pretending not to cry, the South-building students standing together—without turning it into a crowded collage. Warm backlight, paper pages and hands in the foreground, cinematic depth, solemn tenderness, no speech balloons and no readable writing.
```

- **演出メモ**: 「四十人分」を literal に全員描く必要はない。画面内の代表的な反応で、見えない人数まで感じさせる。

### `cg_hareyaka_na_emi` — 勝也、晴れやかな笑み

- **ファイル**: `assets/cg/cg_hareyaka_na_emi.png`
- **シーン**: `h8` / クライマックス
- **Prompt**:

```text
Adult geography teacher Katsuya in the late-afternoon classroom, a luminous medium close-up at the emotional release of the story. He has turned from the window toward the unseen students and wears a rare, completely open, radiant smile—the first truly carefree smile he has shown in three years—with a trace of moisture still in his eyes. The familiar handmade map and warm sunset remain softly behind him, while golden light outlines his face and shoulders. His expression must feel earned, gentle and relieved, never like a commercial grin. Cinematic visual novel key art, subtle light flare only, uncluttered composition with safe lower space for dialogue.
```

- **演出メモ**: 立ち絵⑩の「晴れやかな笑み」を専用CG化する。笑顔を若返らせたり、過剰な涙や光で誤魔化したりしない。

## 7. 卒業式

### `cg_sotsugyou_sakurafubuki` — 全員集合、卒業式と桜吹雪

- **ファイル**: `assets/cg/cg_sotsugyou_sakurafubuki.png`
- **シーン**: `end0` / 共通エピローグ
- **Prompt**:

```text
A warm spring graduation ceremony for a Japanese high school, a large representative group from the North science building and South integrated building gathered together beneath drifting cherry blossom petals. Show the established students in their school uniforms, clearly preserving the contrast between burgundy-red North ties and navy South ties. Ryoma and Mie can anchor the foreground with their familiar contrasting expressions—Ryoma sincerely grateful and Mie trying to keep a straight face—while the rest of the class forms a joyful but natural crowd behind them. Include the graduation venue, soft afternoon light, petals crossing the frame, restrained celebration after three years together, cinematic 16:9 ensemble composition, no banner text or logos.
```

- **演出メモ**: 喜劇の余韻を残した卒業カット。泣き崩れる集合写真ではなく、「まだこの関係が続く」明るさにする。

---

# エンディングCG

## 8. TRUE END

### `cg_end_true` — 数年後の教室と地図

- **ファイル**: `assets/cg/cg_end_true.png`
- **シーン**: `end_true`
- **Prompt**:

```text
Several years later in the same North science classroom, now occupied by a new generation. Adult geography teacher Katsuya stands at the front and unfolds the same familiar topographic map for a small group of new students. His expression is calm and gently smiling, carrying the memory of the former class without becoming nostalgic spectacle. In one corner, a former student now serving as a new teacher or trainee watches with a quiet smile; on a desk, an open graduation album creates a subtle visual montage of the old class without readable photographs or text. Repeat the classroom geometry from the main story but make the light softer and more hopeful, warm spring daylight, circular sense of time, cinematic wide composition, map as the visual center.
```

- **演出メモ**: 過去クラスの同窓会写真を画面いっぱいに貼るのではなく、同じ地図が次の誰かへ渡る循環を中心にする。

## 9. GOOD END — 三重

### `cg_end_mie` — 教壇に立つ練習

- **ファイル**: `assets/cg/cg_end_mie.png`
- **シーン**: `end_good_mie`
- **Prompt**:

```text
After graduation, young-adult Mie practices teaching in a quiet, nearly empty classroom during spring. He stands at a lectern or beside a blackboard with a lesson notebook in hand, shoulders slightly tense as if the role still feels unlike him, but his eyes are focused and sincere. Use the same established face and a more mature version of his North-building style, with a warm late-afternoon light entering the empty room. A small unfinished lesson diagram may appear on the board, but no readable text. The composition should show a former cynic choosing to explain something to others, understated pride, gentle humor in the posture, cinematic medium-wide key art.
```

- **演出メモ**: 「先生になった」と断定する完成図ではなく、まだ練習中の三重。冷笑の面影と、教える側へ進んだ変化を両立させる。

## 10. GOOD END — 砂糖

### `cg_end_satou` — フィールドで空を見上げる

- **ファイル**: `assets/cg/cg_end_satou.png`
- **シーン**: `end_good_satou`
- **Prompt**:

```text
A broad geological field site under an enormous open sky, a young-adult Satou standing on an outcrop in practical field clothes with a survey notebook and camera nearby. He has stopped hiding behind a game screen and is openly looking upward at the landscape, his expression quiet, confident and slightly amazed. Show layered hills, exposed rock and a distant train line or rural valley to echo his three years of window views, but keep the human figure as the emotional focal point. Clear wind, natural daylight, subdued earth colors, a small genuine smile, expansive hopeful composition, no brand logos and no readable notes.
```

- **演出メモ**: スマートフォンは主役にしない。初めて堂々と景色を見る身体の向きと、空の広さで進路を表現する。

## 11. GOOD END — 零

### `cg_end_rei` — 研究室でPCに向かう

- **ファイル**: `assets/cg/cg_end_rei.png`
- **シーン**: `end_good_rei`
- **Prompt**:

```text
A calm university data-science research room with books, monitors and a large window, the visual atmosphere echoing the project's library but more mature. Young-adult Rei sits at a workstation, studying a data visualization related to terrain, with a small quiet smile that shows he now values both what is interesting and what is important. A printed copy of the old class map is pinned or resting at the edge of the desk, visible as shapes but with no readable text. Cool monitor light mixes with gentle daylight, clean organized workspace, composed profile or three-quarter view, understated growth, cinematic visual novel ending CG.
```

- **演出メモ**: 未来的なホログラム画面にはしない。零の成長は、表情と机の端の地図で十分に伝える。

## 12. GOOD END — 寺地

### `cg_end_terachi` — 配信は続く

- **ファイル**: `assets/cg/cg_end_terachi.png`
- **シーン**: `end_good_terachi`
- **Prompt**:

```text
A cozy late-night streaming desk in the familiar empty North classroom, warm lamps and a small camera or microphone creating a humble independent broadcast setup. Young-adult Terachi sits at the desk, calm and gently pleased as he continues his Honshitsu stream. Stacks of handwritten papers have grown higher than before, with a marker, notebook and simple recording equipment arranged naturally; a soft screen glow lights his face. The room should feel modest, persistent and lived-in rather than professional or glamorous. Preserve his quiet, slightly sleepy identity while showing that he no longer needs an audience's approval, warm dark palette, intimate medium-wide composition, no readable screen UI.
```

- **演出メモ**: 成功者の配信スタジオではなく、意味がわからないまま届け続ける小さな机。紙束の増加が時間の経過を示す。

## 13. GOOD END — 両馬

### `cg_end_ryoma` — 祖父の墓前で報告

- **ファイル**: `assets/cg/cg_end_ryoma.png`
- **シーン**: `end_good_ryoma`
- **Prompt**:

```text
A quiet spring cemetery with soft green and warm morning light. Young-adult Ryoma stands before his grandfather's grave, smiling through a small trace of tears as he reports that he has passed Honshitsu on to the next generation. His posture is open and familiar, one hand resting near a simple offering or clasped respectfully, not a formal funeral pose. The grave and surrounding trees frame him without dominating the image; a second figure may remain softly out of focus at the edge as a respectful companion, but Ryoma is the clear focal point. Gentle wind, restrained relief, affectionate remembrance, cinematic medium-wide ending composition, no readable grave inscription.
```

- **演出メモ**: 悲嘆の墓参りではなく、「聞こえているか」と笑って報告できる到達点。泣き笑いの温度を保つ。

## 14. GOOD END — 伊崎＋伊豆見

### `cg_end_izaki_izumi` — それぞれの歩幅

- **ファイル**: `assets/cg/cg_end_izaki_izumi.png`
- **シーン**: `end_good_izaki`
- **Prompt**:

```text
A spring path connecting the North and South school buildings, cherry trees just beginning to open and a long walkway dividing gently into two directions. Young-adult Izaki and Izumi walk in the same frame with separate university bags and slightly different paths, close enough to talk and laugh but clearly allowed their own pace. Their smiles are easy and familiar, the body language showing that distance does not mean separation. Keep the established character faces and a subtle contrast between their former school identities, soft morning light, early-spring air, balanced two-person wide composition, optimistic without romantic melodrama.
```

- **演出メモ**: 「別々の道」と「並んで笑う」を同じ構図で成立させる。二人を左右に分断しすぎず、進行方向で関係性を見せる。

## 15. GOOD END — 召野

### `cg_end_meshino` — 言葉を届ける

- **ファイル**: `assets/cg/cg_end_meshino.png`
- **シーン**: `end_good_meshino`
- **Prompt**:

```text
A South-building classroom transformed into a young-adult language-education practice space. Meshino stands near a lectern with teaching materials, a world map and pronunciation notes represented only as clean abstract marks with no readable text. He looks toward an unseen class with a sincere, slightly embarrassed but steady smile, having learned to put gratitude into words. The empty classroom and navy-tie school atmosphere connect him to his past while the posture suggests a future teacher or international educator. Soft daylight, warm cream and muted blue palette, medium-wide cinematic ending composition, no romanticized depiction of a specific teacher and no readable writing.
```

- **演出メモ**: 二見先生との恋愛成就ではなく、「言葉を届ける」進路へ。教壇・教材・姿勢で成長を示す。

## 16. GOOD END — 倉石

### `cg_end_kuraishi` — 年鑑を後輩に託す

- **ファイル**: `assets/cg/cg_end_kuraishi.png`
- **シーン**: `end_good_kuraishi`
- **Prompt**:

```text
A school stairway landing with bulletin boards and soft spring light. Younger student Kuraishi stands proudly but gently, handing a thick handmade yearbook to an even younger successor. His expression is earnest and satisfied rather than fanatical; the act of passing the record onward matters more than ownership. The yearbook cover may carry a simple symbolic cross-like emblem and abstract decorative marks, but no generated words. Show the stairway, pinned notices and the two students' hands clearly, with Kuraishi's eyes meeting the successor's, warm yellow and blue school colors, cinematic medium shot, a feeling of an unfinished record becoming someone else's beginning.
```

- **演出メモ**: 年鑑は完成品として閉じない。倉石の誇らしさと、後輩に余白を渡す優しさを描く。

## 17. GOOD END — 南棟

### `cg_end_minamitou` — 境界のない春

- **ファイル**: `assets/cg/cg_end_minamitou.png`
- **シーン**: `end_good_minamitou`
- **Prompt**:

```text
An early-spring path between the North and South school buildings, cherry trees still carrying a few buds. South-building students Sakura and Naitou stand together in the foreground with a quiet, comfortable smile, their navy ties and familiar character designs preserved. Mitsumine is nearby as a supportive friend, relaxed and pleased rather than intruding on the pair. The three share an ordinary moment with no dramatic confession: two people have simply begun spending more time together, and the boundary between buildings feels passable. Soft pale sunlight, gentle wind, calm blue and pink palette, natural three-person composition, warm understated ending CG.
```

- **演出メモ**: 恋愛の「完成」ではなく、理論通りに進まない時間が増えたことを喜ぶ。三峰は二人を押し出す主役ではなく、境界をつなぐ存在。

## 18. NORMAL END

### `cg_end_normal` — 見えないけど、ある

- **ファイル**: `assets/cg/cg_end_normal.png`
- **シーン**: `end_normal`
- **Prompt**:

```text
The familiar North science classroom at sunset, quiet and almost empty. Adult teacher Katsuya is near the doorway or window after giving only part of his story, turning back with a small, patient smile. On a desk, the handmade memory map remains partly rolled and visibly unfinished, with several blank spaces and loose edges; it is not a failure, only a map still in progress. Warm amber light, long shadows, an open doorway leading to an unseen next scene, gentle ambiguity and calm acceptance, restrained cinematic composition, no tears, no readable writing, no dramatic closure.
```

- **演出メモ**: 解決しきらない優しさ。「全部見せたら面白くない」という余白を、未完成の地図と開いた出口で表現する。

## 19. BITTERSWEET END

### `cg_end_bittersweet` — こぼれた地図

- **ファイル**: `assets/cg/cg_end_bittersweet.png`
- **シーン**: `end_bittersweet`
- **Prompt**:

```text
The sunset North science classroom after a small surprise has gone slightly wrong. An unfinished handmade map lies crooked and partly unrolled across desks and the floor, with one torn or loose fragment separated from it. Mie and Ryoma stand nearby sharing a tired, embarrassed laugh—Mie trying to call the mess a failure, Ryoma insisting that handing it over was still worth it—while Katsuya kneels and gently picks up one fallen map fragment with a warm smile. The image should feel imperfect but hopeful, not tragic: warm orange light, scattered papers, honest hands, three-person triangular composition, quiet human comedy and tenderness, no readable text.
```

- **演出メモ**: 失敗を悲劇にしない。ぐだぐだな準備の中に残った小さな灯りを、勝也の手元と三人の笑いで見せる。

## 20. COMEDY SECRET END

### `cg_end_comedy` — 原✝本質✝、完全体

- **ファイル**: `assets/cg/cg_end_comedy.png`
- **シーン**: `end_comedy`
- **Prompt**:

```text
A bright daytime North science classroom at the peak of an absurd but completely serious comedy scene. Adult teacher Katsuya stands in the center with a deadpan expression, holding or standing beside a ridiculous five-stage conceptual poster about Honshitsu, represented by clean geometric tiers and symbolic marks but no readable text. Kuraishi is beside him, eyes shining and enthusiastically explaining the theory with both hands; Mie is in the foreground with his established half-lidded “what?” reaction and one hand raised in exasperation. Use a dynamic triangular composition, lively classroom light and controlled visual humor, but keep realistic anime proportions rather than chibi. The joke comes from the characters' sincere faces and the overbuilt diagram, no speech bubbles, no generated writing.
```

- **演出メモ**: 画面自体は大真面目なイベントCGの品質にする。笑いはポーズと温度差から出し、SD化や漫符に頼らない。

## 21. BONUS EXTRA

### `cg_end_bonus` — 数年後の翠湖、同窓会

- **ファイル**: `assets/cg/cg_end_bonus.png`
- **シーン**: `end_bonus`
- **Prompt**:

```text
A wide summer reunion at the shore of Suiko Lake several years after graduation. The former North science class and the South-building friends have gathered together with adult teacher Katsuya, a large but readable ensemble of familiar faces around a picnic cloth, old photographs and a folded memory map. Katsuya has a relaxed smile; Ryoma is animated and delighted, Mie looks exasperated but unmistakably happy, and Sakura, Naitou, Mitsumine, Satou, Rei, Terachi, Izaki, Izumi, Meshino and Kuraishi all feel like the same established people now older by several years. Lush lakeside greenery, summer sky, warm clear light, small overlapping conversations, a sense that the class has not ended even though everyone took different paths. Keep the ensemble natural and not overcrowded, cinematic wide group composition, no readable text or logos.
```

- **演出メモ**: 全員集合の最終カット。変わらない掛け合いと、それぞれが別の時間を歩いてきた事実を同時に入れる。湖・地図・人の輪を三角形に配置するとまとまりやすい。

---

## 配置チェックリスト

- [ ] 画像が `assets/cg/` の台帳ファイル名と一致している
- [ ] 1600×900、16:9、全面不透明である
- [ ] キャラクターの顔・髪型・制服・ネクタイ色が既存CGと揃っている
- [ ] UI、吹き出し、字幕、ロゴ、ウォーターマークを描いていない
- [ ] 重要な顔・手・地図の要素が上下左右の端に寄りすぎていない（Ken Burns対応）
- [ ] `cg_omoide_chikeizu_kansei` の日本語ラベルを後処理で組版した
- [ ] `data/assets.json` の該当行を `"placeholder": false` に変更した
- [ ] `sw.js` のキャッシュバージョンを更新した
- [ ] `node tools/vncheck.mjs` を実行した

配置・台帳更新の詳細は `docs/CG_GUIDE.md` §「差し替え手順（CG共通）」を参照。
