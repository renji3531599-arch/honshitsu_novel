# CG大幅整理（2026-09-15）

**両版とも26→7枚。19枚（約73%）を撤去。** 実CGは全て未配置だったため、画像ファイルの削除ではなく、脚本・台帳・生成プロンプトからの撤去。全14END、台詞、選択肢、好感度・到達条件は維持する。

## 残す7枚と役割

| ID | 残す理由 |
|---|---|
| `cg_chizutsutsu_kobore_shashin` | 物語を動かす古写真。人物の表情ではなく、発見する物そのものを見せる。 |
| `cg_omoide_chikeizu_kansei` | 全ルートの記憶が一枚に繋がった地図。完成物は立ち絵では代替できない。 |
| `cg_yama_ue_hajimete_chizu` | 若い勝也と稲葉の関係の原点。現在の教師の立ち絵だけでは描けない時間。 |
| `cg_hareyaka_na_emi` | 初めて声に出して報告する本編の到達点。単なる顔アップにせず、窓・山へ向ける視線まで描く。 |
| `cg_sotsugyou_sakurafubuki` | 北棟・南棟が同じ道を歩く、三年間の区切りを集合構図で示す。 |
| `cg_end_true` | 数年後、教えが次の世代へ渡った教室。通常の人物配置にない時間の継承を描く。 |
| `cg_end_bonus` | 年月を経た同窓会。卒業時の集合絵とは年齢・場所を明確に変え、全編の余韻にする。 |

## 外す19枚

- 砂糖・零・両馬の会話3枚：告白や決意の重要さは台詞と表情差分で伝える。重要な台詞があるだけではCGの理由にしない。
- 地図制作の夜：準備の集合絵を省き、完成地図の初見を強くする。
- 勝也の窓際導入：入室と驚きは通常の芝居で十分。
- 訃報のシルエット：既存の暗転・効果音・声に任せ、喪失を絵で説明しすぎない。
- 生徒を見渡す集合図：感謝と掛け合いは立ち絵で受け、最後の報告に一枚を集中する。
- GOOD9種・NORMAL・BITTERSWEET・COMEDYのEND用12枚：進路説明や掛け合いの挿絵は不要。ENDロゴ・BGM・文章で締める。

撤去ID（生成不要）：

- `cg_butsudan_narabu_futari`
- `cg_end_bittersweet`
- `cg_end_comedy`
- `cg_end_izaki_izumi`
- `cg_end_kuraishi`
- `cg_end_meshino`
- `cg_end_mie`
- `cg_end_minamitou`
- `cg_end_normal`
- `cg_end_rei`
- `cg_end_ryoma`
- `cg_end_satou`
- `cg_end_terachi`
- `cg_fuhou_kageboushi`
- `cg_mado_ushiro_miteteta`
- `cg_seito_wo_miwatasu`
- `cg_tsukue_kakomi_daiji`
- `cg_yoru_chizu_tsukuri`
- `cg_yuugata_madobe_katsuya`

## 実装上の扱い

- 版Aの台帳と版Bのマニフェストから削除し、未回収枠として残さない。現行回収対象は両版同じ7枚。
- 対応するCG表示・解除命令を削除。版BではCGしかなかった個別ENDに背景を補い、前シーンの画面を持ち越さない。
- 回想の暗転・SE、会話中の表情差分、END解放は維持。背景は既存素材を使用（未来の場面は象徴的な背景として扱う）。
- 過去のスロット対応表は撤去表示付きの履歴として保存。現行の制作指示はCG_GUIDEとCG_PROMPTS。
- 旧セーブの回収履歴は破壊せず、現行台帳にある項目だけ表示する。脚本位置が変わるため、更新前の途中セーブからの厳密な再開互換性は保証しない。
