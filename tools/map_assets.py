# -*- coding: utf-8 -*-
"""
アセット割り当てツール
image1/image2/image3 の white_XXX.png (1〜300) を、シナリオ本編(scenareo.txt)の
アセット一覧に従って意味のあるファイル名へリネーム(移動)し、
  - game/assets/img/           実ファイル
  - game/js/assets_manifest.js エンジン用マニフェスト
  - ASSET_MAP.md               番号↔ファイル名対応表
を生成する。

単一の情報源: 下の ASSET_ORDER。
スロット番号はシナリオ§8の並び順(背景→立ち絵→イベントCG→ED CG→UI)で
（UI画像は2026-09-12に撤去。CSS/SVG描画で全代替のためファイル・マニフェストから外した。
　同日、白紙プレースホルダ実ファイル cg/chr/spare 計256枚も削除 ―― 背景24枚だけが実画像。
　cg/chr はマニフェストに名前だけ残しており、同名の実素材を置けばゲームに反映される）
1〜300 を振る。企画書の立ち絵計上113本に対し表の実列挙は105本のため、
残りは予備スロット spare_XXX とする(企画書§8.6「約90枚分のバッファ」に相当)。
2026-09-12(3): 現役の本編CG 18枚は番号スロット(cg02等)を廃止し、bgと同じ
「ID＝ファイル名」の実名(例: cg_chizutsutsu_kobore_shashin)へ改名。版Aと同名に統一。
降板20枚の旧コードは履歴(white_NNNとの対応)としてそのまま残す。
"""
import os, re, shutil, json

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG_OUT = os.path.join(ROOT, "game", "assets", "img")

# ---------------------------------------------------------------- アセット定義
BG = [
    ("BG01", "bg_hokutou_kyoshitsu_asa",       "北棟三年B組教室・朝"),
    ("BG02", "bg_hokutou_kyoshitsu_hiru",      "北棟三年B組教室・昼休み"),
    ("BG03", "bg_hokutou_kyoshitsu_yuugata",   "北棟三年B組教室・夕方(茜色・逆光)"),
    ("BG04", "bg_hokutou_kyoshitsu_yoru",      "北棟三年B組教室・誰もいない夜"),
    ("BG05", "bg_rouka_hokutou",               "北棟廊下"),
    ("BG06", "bg_kaidan_odoriba",              "階段の踊り場"),
    ("BG07", "bg_jimushitsu",                  "職員室"),
    ("BG08", "bg_chizu_hokanko",               "地図保管庫"),
    ("BG09", "bg_toshoshitsu",                 "図書室"),
    ("BG10", "bg_toshokan_shozoko",            "図書室奥の書庫"),
    ("BG11", "bg_suiko_hotori",                "翠湖のほとり"),
    ("BG12", "bg_koutei_bunkasai_junbi",       "文化祭/謝恩会準備中の校庭"),
    ("BG13", "bg_taiikukan",                   "体育館"),
    ("BG14", "bg_okujou",                      "屋上"),
    ("BG15", "bg_tsuugaku_densha_mado",        "通学電車の車窓"),
    ("BG16", "bg_sakura_namiki",               "南棟と北棟を繋ぐ桜並木"),
    ("BG17", "bg_sotsugyoushiki_kaijou",       "卒業式会場"),
    ("BG18", "bg_minamitou_kyoshitsu",         "南棟三年教室"),
    ("BG19", "bg_ryoma_ie_butsudan",           "両馬の家・仏壇のある部屋"),
    ("BG20", "bg_hawaii_youganchi_kaisou",     "回想・ハワイの溶岩台地"),
    ("BG21", "bg_yama_gensho_kaisou",          "回想・稲葉と勝也がいた山"),
    ("BG22", "bg_daigaku_yakou_kaisou",        "回想・大学時代の野外調査ベースキャンプ"),
    ("BG23", "bg_kyoshitsu_haru_sotsugyougo",  "卒業後の春・もぬけの殻の教室"),
    ("BG24", "bg_kyoshitsu_suunengo",          "TRUE END後日談・数年後の同じ教室"),
]

# キャラ略称 → (表情番号, ローマ字ラベル, 日本語ラベル)
SPRITES = [
    ("katsuya", "塀勝也", [
        (1, "tsujou", "通常(穏やか)"), (2, "bishou", "微笑"), (3, "tooi_me", "遠い目"),
        (4, "odoroki", "驚き"), (5, "me_wo_fuseru", "目を伏せる"), (6, "katai_muhyoujou", "硬い無表情"),
        (7, "kaisou_me_hosomeru", "回想・目を細める"), (8, "namida_koraeru", "涙をこらえる"),
        (9, "naku", "泣く"), (10, "hareyaka_emie", "晴れやかな笑み"),
    ]),
    ("ryoma", "両馬二郎", [
        (1, "tsujou", "通常"), (2, "niyari", "ニヤリ"), (3, "zenryoku", "全力"),
        (4, "kyuu_magao", "急に真顔"), (5, "shonbori", "しょんぼり"), (6, "nakiwarai", "泣き笑い"),
        (7, "ketsui_gao", "真剣な決意顔"), (8, "terekakushi", "照れ隠しで頭をかく"), (9, "goukyuu", "号泣"),
    ]),
    ("mie", "三重県臣", [
        (1, "tsujou_reshou", "通常(冷笑・半目)"), (2, "ha", "「は？」"), (3, "douryou", "動揺"),
        (4, "kimaguse_chinmoku", "気まずい沈黙顔"), (5, "tere", "照れ"), (6, "iradachi_shinken", "苛立ち混じりの真剣顔"),
        (7, "honki_shinken", "本気の真剣顔"), (8, "kuchibiru_kamu", "涙をこらえて唇を噛む"),
        (9, "sunao_hohoemi", "初めての素直な微笑み"), (10, "nakigao", "泣き顔"),
    ]),
    ("terachi", "寺地星", [
        (1, "tsujou", "通常"), (2, "konwaku_gata", "困惑して固まる"), (3, "haishin_shinken", "真剣な配信者の顔"),
        (4, "ureshii", "嬉しい"), (5, "nakisou_taeru", "泣きそうなのを堪える"), (6, "maiku_ketsui", "マイク前の決意顔"),
        (7, "furue_yomiage", "声を震わせながら読み上げる"), (8, "namida", "涙"),
    ]),
    ("satou", "砂糖東洋", [
        (1, "tsujou_geemu", "通常(ゲーム画面凝視)"), (2, "muhyoujou", "無表情(素)"), (3, "odoroki", "驚き"),
        (4, "tere_soppo", "照れ隠しでそっぽ"), (5, "kamera_shinken", "真剣にカメラを構える"), (6, "hohoemi", "微笑み"),
        (7, "kotoba_tsumaru", "言葉に詰まる"), (8, "me_hikari_taeru", "目に光るものを堪える"),
    ]),
    ("rei", "数理零", [
        (1, "tsujou", "通常"), (2, "hohoemi", "微笑"), (3, "kangae_chuu", "考え中"),
        (4, "odoroki", "驚き"), (5, "shinken", "真剣"), (6, "yasashii_me", "優しい目"),
        (7, "kotoba_erabu", "言葉を選ぶ"), (8, "me_urumu", "目を潤ませる"),
    ]),
    ("izaki", "伊崎", [
        (1, "tsujou", "通常"), (2, "egao", "笑顔"), (3, "komari", "困り顔"),
        (4, "shikiri_gao", "真剣(仕切る顔)"), (5, "odoroki", "驚き"), (6, "shimijimi", "しみじみとした微笑み"),
    ]),
    ("izumi", "伊豆見", [
        (1, "tsujou", "通常"), (2, "egao", "笑顔"), (3, "kinchou", "緊張"),
        (4, "ketsui", "決意"), (5, "tere", "照れ"), (6, "hokorashige", "誇らしげ"),
    ]),
    ("meshino", "召野カイト", [
        (1, "tsujou", "通常"), (2, "kimegao", "決め顔"), (3, "tere", "照れ"),
        (4, "shinken", "真剣"), (5, "eigo_doya", "英語ドヤ顔"), (6, "shinmiri", "しんみり"),
    ]),
    ("kuraishi", "倉石暁", [
        (1, "neikyou", "通常(熱狂)"), (2, "kangeki", "感激"), (3, "chousa_shinken", "真剣(調査中)"),
        (4, "shonbori", "しょんぼり"), (5, "hokorashige", "誇らしげ"), (6, "kotoba_ushinau", "言葉を失う"),
        (7, "namida_gumu", "涙ぐむ"),
    ]),
    ("futami", "二見玲子", [
        (1, "tsujou", "通常"), (2, "hohoemi", "微笑"), (3, "shinpai", "心配顔"),
        (4, "itazura_emie", "いたずらっぽい笑み"), (5, "shinmiri_yokogao", "しんみりした横顔"),
    ]),
    ("sakura", "櫻優", [
        (1, "tsujou", "通常"), (2, "kenkyuu_shinken", "真剣(研究者モード)"), (3, "tere", "照れ"),
        (4, "douryou", "動揺"), (5, "egao", "笑顔"), (6, "yawarakai", "柔らかい表情"),
    ]),
    ("mitsumine", "三峰瑠衣", [
        (1, "tsujou", "通常"), (2, "tsukkomi", "ツッコミ顔"), (3, "egao", "笑顔"),
        (4, "akire", "呆れ"), (5, "yasashii", "優しい顔"), (6, "ha_hamo", "「は？」(ハモり専用)"),
    ]),
    ("naitou", "内藤蘭", [
        (1, "tsujou", "通常"), (2, "hohoemi", "微笑"), (3, "dokusho", "読書中"),
        (4, "odoroki", "驚き"), (5, "yasashii_me", "優しい目"), (6, "sukoshi_waru", "少し笑う"),
    ]),
    ("inaba", "稲葉悌二(回想)", [
        (1, "shashin_emie", "古写真の中の柔らかい笑み"), (2, "yama_yokogao", "山を指差す横顔"),
    ]),
    ("wakaki", "若き日の塀勝也(回想)", [
        (1, "seifuku_warau", "学生服・笑っている"), (2, "chousa_bouzen", "調査服・呆然"),
    ]),
]

CG = [
    ("cg01", "cg_01_mie_kyoshitsu_iriguchi",       "三重(単独)　教室の入口で勝也に呼び止められる"),
    ("cg_chizutsutsu_kobore_shashin", "cg_chizutsutsu_kobore_shashin",      "三重／勝也　地図筒から古写真がこぼれ落ちる瞬間"),
    ("cg03", "cg_03_mie_shashin_teme",             "三重(手元アップ)　写真の裏の万年筆の文字を読む"),
    ("cg04", "cg_04_katsuya_shashin_kaishuu",      "勝也(単独)　写真を静かに回収する"),
    ("cg05", "cg_05_mie-ryoma_rouka_yuuhi",        "三重／両馬　夕陽の差し込む誰もいない廊下"),
    ("cg06", "cg_06_satou_shamado_sumafo",         "砂糖(単独)　三年分の車窓写真をスクロールする手元"),
    ("cg_mado_ushiro_miteteta", "cg_mado_ushiro_miteteta",        "砂糖／三重　窓を背にした二人の構図"),
    ("cg08", "cg_08_rei_toshoshitsu_pc",           "零(単独)　三年分のデータを整理する横顔"),
    ("cg_tsukue_kakomi_daiji", "cg_tsukue_kakomi_daiji",  "零／両馬／三重　机を囲み「大事だと思うから」と零が"),
    ("cg10", "cg_10_terachi_hikidashi_kamitabane", "寺地(単独)　引き出しから三年分の紙束を取り出す"),
    ("cg11", "cg_11_terachi-ryoma-mie_unazuku",    "寺地／両馬／三重　「ありがとうの会にする」と頷き合う"),
    ("cg_butsudan_seiza_sugata", "cg_butsudan_seiza_sugata",        "両馬(単独)　祖父の遺影の前で正座する後ろ姿"),
    ("cg_butsudan_narabu_futari", "cg_butsudan_narabu_futari",    "両馬／三重　仏壇の前で並んで座る"),
    ("cg14", "cg_14_kuraishi_shoko_shinbun",       "倉石(単独)　古い学校新聞を読み言葉を失う"),
    ("cg15", "cg_15_kuraishi-ryoma-mie_houkoku",   "倉石／両馬／三重　調査の報告を受ける一同"),
    ("cg16", "cg_16_meshino-futami_shokuinshitsu", "召野／二見　職員室、窓越しの光"),
    ("cg17", "cg_17_mie-mitsumine_sakura_namiki",  "三重／三峰　蕾の桜並木、国境をまたぐ二人"),
    ("cg18", "cg_18_mie-minamitou_kyoshitsu",      "三重／三峰／櫻／内藤　南棟教室、えんじネクタイが浮く構図"),
    ("cg_naitou_kao_age", "cg_naitou_kao_age",               "内藤(単独)　「本質配信、ずっと見てます」と顔を上げる"),
    ("cg_yoru_chizu_tsukuri", "cg_yoru_chizu_tsukuri",           "全員集合　机を寄せ合い地図を作る俯瞰構図"),
    ("cg21", "cg_21_ryoma_temoto_kakikomu",        "両馬(手元アップ)　地図の隅に何かを書き足す"),
    ("cg_omoide_chikeizu_kansei", "cg_omoide_chikeizu_kansei",       "「思い出の地形図」完成図　画面いっぱいの作品アートワーク"),
    ("cg_yuugata_madobe_katsuya", "cg_yuugata_madobe_katsuya", "勝也(後ろ姿)　誰もいない夕方の教室で窓の外を見る"),
    ("cg24", "cg_24_katsuya_chizu_watasu_zekkyu",  "勝也(正面)　地図を渡され絶句する瞬間"),
    ("cg25", "cg_25_mie-katsuya_mediumshot",       "三重／勝也　「先生、聞いていいですか」二人の間合い"),
    ("cg_nagai_chinmoku", "cg_nagai_chinmoku",       "勝也(単独)　いつもの5秒より長い沈黙"),
    ("cg_yama_ue_hajimete_chizu", "cg_yama_ue_hajimete_chizu",         "若き勝也／稲葉(回想)　山の上、初めての地形図(褪色調)"),
    ("cg_wakaki_utsumuki", "cg_wakaki_utsumuki",              "若き勝也(回想・単独)　生意気な口を利いた日、俯く"),
    ("cg_kuhou_kageboushi", "cg_kuhou_kageboushi",      "勝也(単独)　訃報を知った瞬間(シルエットのみ)"),
    ("cg_mado_gawa_no_houkoku", "cg_mado_gawa_no_houkoku",     "勝也(単独)　「窓の外を見るたび、報告していた」と語る"),
    ("cg_seito_wo_miwatasu", "cg_seito_wo_miwatasu",    "全員／勝也　✝本質✝と稲葉の教えが重なる瞬間、広い構図"),
    ("cg32", "cg_32_terachi_dokudoku_roudoku",     "寺地(単独・朗読)　スマホのライトに照らされて"),
    ("cg_hitorizutsu_no_kotoba", "cg_hitorizutsu_no_kotoba", "全員／勝也　一人ずつの一言、勝也が涙をこらえる"),
    ("cg_hareyaka_na_emi", "cg_hareyaka_na_emi",        "勝也(単独)　晴れやかな笑み(表情⑩解禁カット)"),
    ("cg_sotsugyou_sakurafubuki", "cg_sotsugyou_sakurafubuki", "全員集合　卒業式・桜吹雪"),
    ("cg36", "cg_36_katsuya_suunengo_kyoshitsu",   "勝也(単独)　数年後の教室、新しい1年生に同じ地図を"),
    ("cg37", "cg_37_mie-mitsumine_mankai_sakura",  "三重／三峰　満開の桜(南棟Flag高で挿入)"),
    ("cg38", "cg_38_ryoma_hakamairi",              "両馬(単独)　墓参り(両馬編で使用)"),
]

# 2026-09-12: CGは「印象的で感動的なシーンのみ」に整理。非ピーク20枚を reserve 降板（ファイルは残す）。
# 版A（PR相当の2026-09-11整理＋今回9枚）と同じ基準・同じ面子。本編で立つ名場面は18枚＋ED14枚。
RETIRED_CG = {
    "cg01", "cg03", "cg04", "cg05", "cg06", "cg08", "cg10", "cg11", "cg14", "cg15",
    "cg16", "cg17", "cg18", "cg21", "cg24", "cg25", "cg32", "cg36", "cg37", "cg38",
}

ED_CG = [
    ("cg_end_true",          "TRUE END「地面は、忘れない。」数年後の教室とアルバムのモンタージュ"),
    ("cg_end_mie",           "GOOD END・三重編　教壇に立つ練習をする三重"),
    ("cg_end_satou",         "GOOD END・砂糖編　フィールドで堂々と空を見上げる砂糖"),
    ("cg_end_rei",           "GOOD END・零編　研究室で微笑む零"),
    ("cg_end_terachi",       "GOOD END・寺地編　紙束が増えた机で配信を続ける寺地"),
    ("cg_end_ryoma",         "GOOD END・両馬編　祖父の墓前で笑って報告する両馬"),
    ("cg_end_izaki_izumi",   "GOOD END・伊崎＋伊豆見編　別々の道を並んで歩く二人"),
    ("cg_end_meshino",       "GOOD END・召野編　教壇/留学を思わせる一枚"),
    ("cg_end_kuraishi",      "GOOD END・倉石編　後輩に「年鑑」を託す倉石"),
    ("cg_end_minamitou",     "GOOD END・南棟編　櫻と内藤、三峰を交えた穏やかな一枚"),
    ("cg_end_normal",        "NORMAL END　桜の下、いつも通りの日常が続く"),
    ("cg_end_bittersweet",   "BITTERSWEET END　小さくまとまったサプライズ、それでも笑い合う"),
    ("cg_end_comedy",        "COMEDY SECRET END　勝也が「……本質かもな」"),
    ("cg_end_bonus",         "BONUS EXTRA　数年後・翠湖のほとりの同窓会(全員＋勝也)"),
]

# 2026-09-12: UI画像20枚は撤去（ロゴ・端末フレーム・アイコンまで全てCSS/SVG描画で代替できているため）。
# スロット番号の履歴（white_NNN ↔ 名前）を保つために列挙だけ残し、実ファイルは削除・マニフェストには出さない。
UI_RETIRED = [
    ("ui01", "ui01_title_logo",        "タイトルロゴ「まだ地図の途中で」"),
    ("ui02", "ui02_line_frame",        "LINEグループチャット画面フレーム"),
    ("ui03", "ui03_bbs_heikatsu",      "匿名掲示板(ヘイカツスレ)画面フレーム"),
    ("ui04", "ui04_bbs_juken",         "受験情報掲示板(フェイカツ書き込み)画面フレーム"),
    ("ui05", "ui05_haishin_ui",        "本質配信・配信画面UI"),
    ("ui06", "ui06_nenkan_icon",       "✝本質✝年鑑・表紙アイコン"),
    ("ui07", "ui07_nyumon_icon",       "✝本質✝入門ガイド・表紙アイコン"),
    ("ui08", "ui08_shinbun_icon",      "古い学校新聞・紙面アイコン"),
    ("ui09", "ui09_kojashin_icon",     "古写真アイコン"),
    ("ui10", "ui10_chizutsutsu_icon",  "地図筒アイコン"),
    ("ui11", "ui11_kami_magic_icon",   "紙とマジックペン(配信道具)アイコン"),
    ("ui12", "ui12_omoide_chizu_icon", "「思い出の地形図」ミニアイコン"),
    ("ui13", "ui13_sentakushi_frame",  "選択肢ウィンドウ用フレーム"),
    ("ui14", "ui14_heart_frame",       "心Pointゲージ用フレーム"),
    ("ui15", "ui15_chapter_frame",     "章タイトル表示用の地形図柄フレーム"),
    ("ui16", "ui16_saveload_bg",       "セーブ／ロード画面用の地図柄背景装飾"),
    ("ui17", "ui17_hub_map",           "HUB(ルート選択)画面用マップ風背景"),
    ("ui18", "ui18_end_logo_frame",    "エンドロゴ共通フレーム"),
    ("ui19", "ui19_sotsugyou_syosho",  "卒業証書アイコン"),
    ("ui20", "ui20_cornsoup_can",      "コーンスープ缶アイコン"),
]

# ---------------------------------------------------------------- ファイル収集
srcs = {}  # 番号 → (folder, filename)
for folder in ("image1", "image2", "image3"):
    d = os.path.join(ROOT, folder)
    if not os.path.isdir(d):
        continue
    for fn in os.listdir(d):
        m = re.fullmatch(r"white_(\d{3})\.png", fn)
        if m:
            srcs[int(m.group(1))] = os.path.join(d, fn)

missing = [n for n in range(1, 301) if n not in srcs]
# リネーム済みスロットは game/assets/img 側に存在するため、無いのは正常

os.makedirs(IMG_OUT, exist_ok=True)

# ---------------------------------------------------------------- 割り当て
manifest = {"bg": {}, "chr": {}, "cg": {}, "ed_cg": {}}
lines = ["# アセット対応表 (ASSET_MAP)", "",
         "シナリオ『まだ地図の途中で　〜✝本質✝特別編〜』§8のアセット一覧に従い、",
         "仮画像 `white_001.png`〜`white_300.png` をリネームして配置した対応表。",
         "2026-09-12: 白紙実ファイルは全削除。実画像は背景24枚のみ（他は台帳・スロット記録のみ）。",
         "実素材は対応表の新ファイル名で `game/assets/img/` に新規配置すればゲームに反映される。",
         ""]

lines += ["## 背景 (BG) ― スロット 001〜024", "", "| スロット | 元ファイル | 新ファイル名 | 内容 |", "|---|---|---|---|"]

slot = 1
def take(name_jp: str, keep_missing: bool = False):
    """現在スロットの white ファイルを IMG_OUT/name_jp.png へリネームする(冪等)。
    keep_missing=True（撤去・降板枠）は、実ファイルが無くてもスロット番号の記録だけ進める"""
    global slot
    dst = os.path.join(IMG_OUT, name_jp + ".png")
    if os.path.exists(dst):
        # 前回実行済み(リネーム済み) → スロット対応だけ確定させる
        n = slot
        slot += 1
        return n, dst
    src = srcs.get(slot)
    if src:
        shutil.move(src, dst)
        n = slot
        slot += 1
        return n, dst
    if keep_missing:
        n = slot
        slot += 1
        return n, None
    assert src, f"slot {slot} source missing"

for code, fname, desc in BG:
    n, dst = take(fname)
    manifest["bg"][code] = {"file": fname + ".png", "desc": desc, "slot": n}
    lines.append(f"| {code} | white_{n:03d}.png | `{fname}.png` | {desc} |")

lines += ["", "## 立ち絵 (CHARA) ― スロット以降順次", "", "| スロット | 元ファイル | 新ファイル名 | 内容 |", "|---|---|---|---|"]
chr_manifest = {}
for key, jp, exprs in SPRITES:
    chr_manifest[key] = {"name": jp, "exprs": []}
    for num, romaji, label in exprs:
        fname = f"chr_{key}_{num:02d}_{romaji}"
        n, dst = take(fname, keep_missing=True)
        chr_manifest[key]["exprs"].append({"no": num, "file": fname + ".png", "label": label, "slot": n})
        lines.append(f"| | white_{n:03d}.png | `{fname}.png` | {jp}・表情{num}({label}) |")

lines += ["", "## 専用イベントCG (名場面)", "", "| スロット | 元ファイル | 新ファイル名 | 内容 |", "|---|---|---|---|"]
cg_manifest = {}
for code, fname, desc in CG:
    n, dst = take(fname, keep_missing=True)
    if code in RETIRED_CG:
        # 2026-09-12: 降板CGはマニフェストから外し、実ファイル（白紙）も削除する
        if dst:
            os.remove(dst)
        lines.append(f"| {code} | white_{n:03d}.png | ―（降板・削除済み。再昇格時は `{fname}.png` を新規配置） | {desc} |")
        continue
    cg_manifest[code] = {"file": fname + ".png", "desc": desc, "slot": n}
    lines.append(f"| {code} | white_{n:03d}.png | `{fname}.png`（未配置なら名前だけ） | {desc} |")

lines += ["", "## エンディング専用CG", "", "| スロット | 元ファイル | 新ファイル名 | 内容 |", "|---|---|---|---|"]
ed_manifest = {}
for code, desc in ED_CG:
    n, dst = take(code, keep_missing=True)
    ed_manifest[code] = {"file": code + ".png", "desc": desc, "slot": n}
    lines.append(f"| {code} | white_{n:03d}.png | `{code}.png` | {desc} |")

lines += ["", "## UI／アイテム（2026-09-12 撤去）", "",
          "UI画像20枚はエンジンのCSS/SVG描画で全代替のため、実ファイルごと削除した。",
          "（スロット番号の履歴だけ残す）", "",
          "| スロット | 元ファイル | 新ファイル名 | 内容 |", "|---|---|---|---|"]
for code, fname, desc in UI_RETIRED:
    n, dst = take(fname, keep_missing=True)
    if dst:
        os.remove(dst)
    lines.append(f"| {code} | white_{n:03d}.png | ―（撤去・削除済み） | {desc} |")

# 予備スロット（2026-09-12: 白紙実ファイルは全削除。スロット番号の記録だけ進める）
spare_start = slot
lines += ["", "## 予備スロット（削除済み）", "", "| スロット | 元ファイル | 新ファイル名 |", "|---|---|---|"]
while slot <= 300:
    fname = f"spare_{slot:03d}"
    n, dst = take(fname, keep_missing=True)
    if dst:
        os.remove(dst)
    lines.append(f"| {fname.upper()} | white_{n:03d}.png | ―（削除済み） |")

lines += ["", "---", "",
          f"- 合計: 300スロット (背景24＝実画像 / 立ち絵{sum(len(e) for _,_,e in SPRITES)}＝台帳のみ / 名場面CG {len(CG)}＝台帳18・降板削除20 / ED用CG {len(ED_CG)}＝台帳のみ / UI 20＝撤去 / 予備 {301-spare_start}＝削除済み)",
          "- 2026-09-12: UI画像20枚を撤去（CSS/SVG描画で全代替）。名場面CGのうち非ピーク20枚を降板のうえ削除。",
          "- 2026-09-12(2): 白紙プレースホルダ実ファイル（cg/chr/spare 計256枚）を全削除。背景24枚だけが実画像。",
          "- 企画書§8.2では立ち絵113本と計上されているが、第5章の表情リストを実列挙すると105本のため、",
          "  差分8本は予備スロット(追加表情用バッファ)として確保している(§8.6「約90枚分のバッファ」の一部)。",
          "- 元 `image1/`, `image2/`, `image3/` フォルダはリネーム後に撤去。"]

# ---------------------------------------------------------------- 出力
with open(os.path.join(ROOT, "ASSET_MAP.md"), "w", encoding="utf-8") as f:
    f.write("\n".join(lines) + "\n")

manifest_full = {
    "bg": manifest["bg"], "chr": chr_manifest, "cg": cg_manifest, "ed_cg": ed_manifest,
}
js = ("// 自動生成: tools/map_assets.py によるアセットマニフェスト\n"
      "// 実画像は game/assets/img/（2026-09-12時点で背景24枚のみ。他は台帳のみで実ファイル未配置）。\n"
      "// 詳細対応表は ASSET_MAP.md を参照。\n"
      "window.ASSET_MANIFEST = " + json.dumps(manifest_full, ensure_ascii=False, indent=2) + ";\n")
with open(os.path.join(ROOT, "game", "js", "assets_manifest.js"), "w", encoding="utf-8") as f:
    f.write(js)

# 空フォルダ撤去
for folder in ("image1", "image2", "image3"):
    d = os.path.join(ROOT, folder)
    if os.path.isdir(d) and not os.listdir(d):
        os.rmdir(d)

print(f"OK: {slot-1} slots documented (実画像: {sum(1 for _ in manifest['bg'])} bg / 白紙実ファイルは削除済み)")
