#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
rename_assets.py ―― 仮画像(white_NNN.png)を企画書第8章のアセットIDへリネーム・配置するスクリプト。

対象: image1/ image2/ image3/ に置かれた 400x300 の白いプレースホルダー計300枚。
      中身は仮で構わないという前提で、「名前だけ」正式スロット名へ変更する。

※ 2026-09-12: 白紙プレースホルダの実ファイル（cg/chr/_buffer 計256枚）は削除済み。
      UI画像20枚も撤去済み（CSS/SVG描画で全代替）。このスクリプトは歴史的経緯の記録であり、
      再実行には元の white_NNN.png が必要（現在は存在しない）。現行の台帳は data/assets.json。

出力:
  assets/bg/   …… 背景 24枚
  assets/chr/  …… 立ち絵差分 105枚（第5章の表情リスト準拠）
  assets/cg/   …… 専用イベントCG 38枚 + ED専用 14枚 = 52枚
  （UI/アイテム画像20枚は 2026-09-12 撤去 ―― 全てCSS/SVG描画で代替済みのため）
  assets/_buffer/ …… 未割当の余り（増分区バッファ。企画書の90枚分余裕に相当）
  data/assets.json …… エンジンが読むアセット台帳（元ファイル名・用途・説明・プレースホルダ判定）
  docs/ASSET_MANIFEST.md …… 人が読む対応表

実行: python3 tools/rename_assets.py [--dry-run]
"""
import json
import os
import re
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

SRC_DIRS = ["image1", "image2", "image3"]

# ---------------------------------------------------------------- BG (24) ----
BG = [
    ("BG01", "bg_hokutou_kyoshitsu_asa", "北棟三年B組教室・朝", "kyoshitsu/asa"),
    ("BG02", "bg_hokutou_kyoshitsu_hiru", "北棟三年B組教室・昼休み", "kyoshitsu/hiru"),
    ("BG03", "bg_hokutou_kyoshitsu_yuugata", "北棟三年B組教室・夕方（茜色・逆光）", "kyoshitsu/yuugata"),
    ("BG04", "bg_hokutou_kyoshitsu_yoru", "北棟三年B組教室・夜（サプライズ準備）", "kyoshitsu/yoru"),
    ("BG05", "bg_rouka_hokutou", "北棟廊下", "rouka"),
    ("BG06", "bg_kaidan_odoriba", "階段の踊り場（掲示物あり）", "kaidan"),
    ("BG07", "bg_jimushitsu", "職員室", "jimushitsu"),
    ("BG08", "bg_chizu_hokanko", "地図保管庫", "hokanko"),
    ("BG09", "bg_toshoshitsu", "図書室", "toshoshitsu"),
    ("BG10", "bg_toshokan_shozoko", "図書室奥の書庫（埃っぽい）", "shoko"),
    ("BG11", "bg_suiko_hotori", "翠湖のほとり", "suiko"),
    ("BG12", "bg_koutei_bunkasai_junbi", "文化祭/謝恩会準備中の校庭", "koutei"),
    ("BG13", "bg_taiikukan", "体育館（謝恩会当日）", "taiikukan"),
    ("BG14", "bg_okujou", "屋上", "okujou"),
    ("BG15", "bg_tsuugaku_densha_mado", "通学電車の車窓（砂糖視点）", "densha"),
    ("BG16", "bg_sakura_namiki", "南棟と北棟を繋ぐ桜並木（蕾）", "namiki"),
    ("BG17", "bg_sotsugyoushiki_kaijou", "卒業式会場", "sotsugyou"),
    ("BG18", "bg_minamitou_kyoshitsu", "南棟三年教室", "minamitou"),
    ("BG19", "bg_ryoma_ie_butsudan", "両馬の家・祖父の遺影がある部屋", "butsudan"),
    ("BG20", "bg_hawaii_youganchi_kaisou", "回想・ハワイの溶岩台地", "hawaii"),
    ("BG21", "bg_yama_gensho_kaisou", "回想・稲葉と勝也がいた山（褪色調）", "yama"),
    ("BG22", "bg_daigaku_yakou_kaisou", "回想・大学時代の野外調査ベースキャンプ", "yakou"),
    ("BG23", "bg_kyoshitsu_haru_sotsugyougo", "エピローグ・卒業後の春、もぬけの殻の教室", "kyoshitsu/haru"),
    ("BG24", "bg_kyoshitsu_suunengo", "TRUE END後日談・数年後の同じ教室", "kyoshitsu/suunengo"),
]

# --------------------------------------------------------------- CHR (105) ---
# (略称, [(表情番号, 表情名, slug)])
CHR = [
    ("katsuya", "塀勝也", [
        ("01", "通常（穏やか）", "tsuujou"),
        ("02", "微笑", "hohoemi"),
        ("03", "遠い目", "tooi_me"),
        ("04", "驚き", "odoroki"),
        ("05", "目を伏せる", "me_fuseru"),
        ("06", "硬い無表情", "kataki_muten"),
        ("07", "回想・目を細める", "kaisou_me_soseru"),
        ("08", "涙をこらえる", "namida_koraeru"),
        ("09", "泣く", "naku"),
        ("10", "晴れやかな笑み", "hareyaka_emmi"),
    ]),
    ("ryoma", "両馬二郎", [
        ("01", "通常", "tsuujou"),
        ("02", "ニヤリ", "niyari"),
        ("03", "全力", "zenryoku"),
        ("04", "急に真顔", "kinimo_majime"),
        ("05", "しょんぼり", "shonbori"),
        ("06", "泣き笑い", "nakiwarai"),
        ("07", "真剣な決意顔", "shinken_ketsui"),
        ("08", "照れ隠しで頭をかく", "terekakushi"),
        ("09", "号泣", "goukyuu"),
    ]),
    ("mie", "三重県臣", [
        ("01", "通常（冷笑・半目）", "reishou"),
        ("02", "「は？」", "ha"),
        ("03", "動揺", "douyou"),
        ("04", "気まずい沈黙", "chimatsu"),
        ("05", "照れ", "tere"),
        ("06", "苛立ち混じりの真剣", "iraduki_shinken"),
        ("07", "本気の真剣", "honki_shinken"),
        ("08", "涙をこらえて唇を噛む", "namida_kamu"),
        ("09", "初めての素直な微笑み", "sunao_hohoemi"),
        ("10", "泣き顔", "nakigao"),
    ]),
    ("terachi", "寺地星", [
        ("01", "通常（眠そう・淡々）", "nemusou"),
        ("02", "困惑して固まる", "komatte_kataaru"),
        ("03", "真剣な配信者の顔", "hansya_shinken"),
        ("04", "嬉しい", "ureshii"),
        ("05", "泣きそうなのを堪える", "nakisou_koraeru"),
        ("06", "マイク前の決意顔", "maiku_no_ketsui"),
        ("07", "声を震わせながら読み上げる", "yomiage"),
        ("08", "涙", "namida"),
    ]),
    ("satou", "砂糖東洋", [
        ("01", "通常（ゲーム画面凝視）", "game_shuuchuu"),
        ("02", "無表情（素）", "muten"),
        ("03", "驚き（画面から顔を上げる）", "kao_ageta"),
        ("04", "照れ隠しでそっぽを向く", "soppo"),
        ("05", "真剣にカメラを構える顔", "camera"),
        ("06", "微笑み（レア）", "hohoemi"),
        ("07", "言葉に詰まる顔", "tsumaru"),
        ("08", "目に光るものを堪える顔", "hikari_koraeru"),
    ]),
    ("rei", "数理零", [
        ("01", "通常（涼しい顔）", "suzushii"),
        ("02", "微笑", "hohoemi"),
        ("03", "考え中（顎に手）", "kangaechuu"),
        ("04", "驚き", "odoroki"),
        ("05", "真剣（データと向き合う）", "data_shinken"),
        ("06", "優しい目", "yasashii_me"),
        ("07", "言葉を選ぶ顔", "kotoba_erabu"),
        ("08", "目を潤ませる", "me_rumaseru"),
    ]),
    ("izaki", "伊崎", [
        ("01", "通常", "tsuujou"),
        ("02", "笑顔", "egao"),
        ("03", "困り顔", "komari"),
        ("04", "真剣（仕切る顔）", "shikiri"),
        ("05", "驚き", "odoroki"),
        ("06", "しみじみとした微笑み", "shimiemi"),
    ]),
    ("izumi", "伊豆見", [
        ("01", "通常", "tsuujou"),
        ("02", "笑顔", "egao"),
        ("03", "緊張", "kinchou"),
        ("04", "決意", "ketsui"),
        ("05", "照れ", "tere"),
        ("06", "誇らしげ", "hokorashige"),
    ]),
    ("meshino", "召野カイト", [
        ("01", "通常", "tsuujou"),
        ("02", "決め顔", "kimegao"),
        ("03", "照れ", "tere"),
        ("04", "真剣", "shinken"),
        ("05", "英語ドヤ顔", "eigo_doya"),
        ("06", "しんみり", "shinmiri"),
    ]),
    ("kuraishi", "倉石暁", [
        ("01", "通常（熱狂）", "kekkyou"),
        ("02", "感激", "kanshou"),
        ("03", "真剣（調査中）", "chousa_shinken"),
        ("04", "しょんぼり", "shonbori"),
        ("05", "誇らしげ", "hokorashige"),
        ("06", "言葉を失う顔", "kotoba_usinau"),
        ("07", "涙ぐむ", "namidagumu"),
    ]),
    ("futami", "二見玲子", [
        ("01", "通常", "tsuujou"),
        ("02", "微笑", "hohoemi"),
        ("03", "心配顔", "shinpai"),
        ("04", "いたずらっぽい笑み", "itazura"),
        ("05", "しんみりした横顔", "yokogao"),
    ]),
    ("sakura", "櫻優", [
        ("01", "通常", "tsuujou"),
        ("02", "真剣（研究者モード）", "kenkyuusha"),
        ("03", "照れ", "tere"),
        ("04", "動揺", "douyou"),
        ("05", "笑顔", "egao"),
        ("06", "柔らかい表情", "yawarakai"),
    ]),
    ("mitsumine", "三峰瑠衣", [
        ("01", "通常", "tsuujou"),
        ("02", "ツッコミ顔", "tsukkomi"),
        ("03", "笑顔", "egao"),
        ("04", "呆れ", "akire"),
        ("05", "優しい顔", "yasashii"),
        ("06", "「は？」（ハモリ専用）", "ha"),
    ]),
    ("naitou", "内藤蘭", [
        ("01", "通常", "tsuujou"),
        ("02", "微笑", "hohoemi"),
        ("03", "読書中（伏し目）", "dokusho"),
        ("04", "驚き", "odoroki"),
        ("05", "優しい目", "yasashii_me"),
        ("06", "少し笑う", "sukoshi_warau"),
    ]),
    ("inaba", "稲葉悌二（回想専用）", [
        ("01", "古写真の中の柔らかい笑み", "shashin_no_waraui"),
        ("02", "山を指差す横顔", "yama_sasu"),
    ]),
    ("wakaki-katsuya", "若き日の塀勝也（回想専用）", [
        ("01", "笑っている", "waratteiru"),
        ("02", "呆然としている", "bousen"),
    ]),
]

# ---------------------------------------------------------- CG 名場面 (38) ---
# ※ 2026-09-12(3): 本編で現役の18枚はその後、番号スロットを廃止して
#    bgと同じ「ID＝ファイル名」の実名（例: cg_02_mie-katsuya_chizutsutsu → cg_chizutsutsu_kobore_shashin）
#    に改名済み。現行の名前は data/assets.json（正本）と docs/CG_GUIDE.md を参照のこと。
#    下表の旧名は white_NNN との対応の記録としてそのまま残している。
CG_MAIN = [
    ("cg01", "cg_01_mie_kyoushitsu_yobidome", "三重（単独）／BG01・朝。入口で勝也に呼び止められる横顔。"),
    ("cg02", "cg_02_mie-katsuya_chizutsutsu", "三重／勝也／BG08。地図筒の蓋が外れ古写真がこぼれ落ちる瞬間（スロー）。"),
    ("cg03", "cg_03_mie_shashin_ura", "三重（手元アップ）／BG08。写真の裏の万年筆の文字を読む。"),
    ("cg04", "cg_04_katsuya_shashin_kaishuu", "勝也（単独）／BG08。写真を静かに回収する硬い表情。"),
    ("cg05", "cg_05_mie-ryoma_rouka_yuuyake", "三重／両馬／BG05・放課後。夕陽の廊下で打ち明ける横並び構図。"),
    ("cg06", "cg_06_satou_shadou_scratch", "砂糖（単独）／BG15。三年分の車窓写真をスマホでスクロールする手元。"),
    ("cg07", "cg_07_satou-mie_miteru_to_iu", "砂糖／三重／BG01・放課後。「見てた」と認める瞬間、窓を背に。"),
    ("cg08", "cg_08_rei_tosho_note", "零（単独）／BG09。ノートPCの画面光が横顔を照らす。"),
    ("cg09", "cg_09_rei-ryoma-mie_daiji", "零／両馬／三重／BG01。「面白いからじゃなくて、大事だと思うから」。"),
    ("cg10", "cg_10_terachi_kami_no_tasoku", "寺地（単独）／BG01・放課後。引き出しの三年分の紙束。"),
    ("cg11", "cg_11_terachi-ryoma-mie_unsei", "寺地／両馬／三重／BG01。「暴露じゃなくて、ありがとうの会」で頷き合う。"),
    ("cg12", "cg_12_ryoma_butsudan_ushiro", "両馬（単独）／BG19。仏壇の前に正座する後ろ姿、線香の煙。"),
    ("cg13", "cg_13_ryoma-mie_narabu_zaseki", "両馬／三重／BG19。祖父の口癖を話す生活感のある並席。"),
    ("cg14", "cg_14_kuraishi_shinbun_haikyou", "倉石（単独）／BG10。埃まみれの学校新聞を読んで言葉を失う。"),
    ("cg15", "cg_15_kuraishi-ryoma-mie_houkoku", "倉石／両馬／三重／BG01。調査結果の報告。息を呑む二人。"),
    ("cg16", "cg_16_meshino-futami_jimushitsu", "召野／二見／BG07。窓越しの光、少し距離のある立ち位置。"),
    ("cg17", "cg_17_mie-mitsumine_sakura_tsubomi", "三重／三峰／BG16。国境をまたぐ桜並木（まだ蕾）。"),
    ("cg18", "cg_18_mie-minamitou3_kyoudai", "三重／三峰／櫻／内藤／BG18。えんじのネクタイが南棟に浮く構図。"),
    ("cg19", "cg_19_naitou_zutto_miteimasu", "内藤（単独）／BG18。伏し目から顔を上げる一瞬。"),
    ("cg20", "cg_20_all_yoru_no_chizu", "全員集合／BG04・夜。机を寄せ合い地図を作る俯瞰構図。"),
    ("cg21", "cg_21_ryoma_yohaku_ni_kaku", "両馬（手元アップ）／BG01・夜。地図の隅に何かを書き足す。"),
    ("cg22", "cg_22_omoide_no_chizu_kansei", "「思い出の地形図」完成図。画面いっぱいの作品アート。"),
    ("cg23", "cg_23_katsuya_yuugata_madobe", "勝也（単独・後ろ姿）／BG03。誰もいない教室の窓際。"),
    ("cg24", "cg_24_katsuya_zecchuu", "勝也（単独）／BG13相当。地図を渡され絶句する正面カット。"),
    ("cg25", "cg_25_mie-katsuya_kiite_ii", "三重／勝也。ミディアムショット、「先生、聞いていいですか」。"),
    ("cg26", "cg_26_katsuya_chii_shijima", "勝也（単独）。いつもの五秒より長い沈黙、表情が見える角度。"),
    ("cg27", "cg_27_wakaki-inaba_hajimete_chizu", "若き勝也／稲葉／BG21。初めて地形図を渡される山の上（褪色）。"),
    ("cg28", "cg_28_wakaki-katsuya_fukumu", "若き勝也（回想・単独）／BG22。生意気を言った日、俯く。"),
    ("cg29", "cg_29_katsuya_kuhou_silhouette", "勝也（回想の切れ目）／BG21。訃報を知った瞬間、シルエットのみ。"),
    ("cg30", "cg_30_katsuya_gojikan_no_houkoku", "勝也（単独）／BG13。「窓の外を見るたび、報告していた」。"),
    ("cg31", "cg_31_all-katsuya_sasuragasu", "全員集合／勝也／BG13。生徒たちを見渡す広い構図。"),
    ("cg32", "cg_32_terachi_saigo_no_roudoku", "寺地（単独・朗読）／BG13。スマホのライトが顔を照らす。"),
    ("cg33", "cg_33_all-katsuya_hitorizutsu", "全員集合／勝也／BG13。一人ずつの一言、涙をこらえる。"),
    ("cg34", "cg_34_katsuya_hareyaka", "勝也（単独）／BG13。締めの台詞、晴れやかな笑み（表情⑩）。"),
    ("cg35", "cg_35_all_sotsugyou_sakurafubu", "全員集合／BG17。卒業式、桜吹雪。"),
    ("cg36", "cg_36_katsuya_suunengo_kyoushitsu", "勝也（単独）／BG24。数年後、新一年に同じ地図を見せる。"),
    ("cg37", "cg_37_mie-mitsumine_mankai", "三重／三峰／BG16。満開の桜（南棟編Flag高で挿入）。"),
    ("cg38", "cg_38_ryoma_hakamairi", "両馬（単独）／BG19。墓参りシーン（共通カットの派生）。"),
]

CG_END = [
    ("cg_end_true", "cg_end_true", "TRUE END ―― 数年後の教室で地図を見せる勝也＋卒業アルバムのモンタージュ"),
    ("cg_end_mie", "cg_end_mie", "GOOD END・三重 ―― 教壇に立つ練習"),
    ("cg_end_satou", "cg_end_satou", "GOOD END・砂糖 ―― フィールドで堂々と空を見上げる"),
    ("cg_end_rei", "cg_end_rei", "GOOD END・零 ―― 研究室でPCに向かいながら微笑む"),
    ("cg_end_terachi", "cg_end_terachi", "GOOD END・寺地 ―― 紙束が増えた配信机"),
    ("cg_end_ryoma", "cg_end_ryoma", "GOOD END・両馬 ―― 祖父の墓前で笑って報告"),
    ("cg_end_izaki_izumi", "cg_end_izaki_izumi", "GOOD END・伊崎＋伊豆見 ―― 別々の道で並んで笑う"),
    ("cg_end_meshino", "cg_end_meshino", "GOOD END・召野 ―― 教壇／留学先を思わせる一枚"),
    ("cg_end_kuraishi", "cg_end_kuraishi", "GOOD END・倉石 ―― 後輩に年鑑を託す"),
    ("cg_end_minamitou", "cg_end_minamitou", "GOOD END・南棟 ―― 櫻・内藤・三峰の穏やかな一枚"),
    ("cg_end_normal", "cg_end_normal", "NORMAL END ―― 桜の下、いつも通りの日常"),
    ("cg_end_bittersweet", "cg_end_bittersweet", "BITTERSWEET END ―― 小さくまとまったサプライズ、それでも笑い合う"),
    ("cg_end_comedy", "cg_end_comedy", "COMEDY SECRET END ―― 勝也が「……本質かもな」と言ってしまう"),
    ("cg_end_bonus", "cg_end_bonus", "BONUS EXTRA ―― 数年後の翠湖のほとり、同窓会集合カット"),
]

# ------------------------------------------------------------ UI (撤去) ------
# UI画像（ui01〜ui20）は 2026-09-12 に撤去。
# 企画書§8.5のUI/アイテム画像は、エンジン側のCSS/SVG描画（端末フレーム・所持品アイコン・
# 選択肢・章カード・HUB・ENDロゴ等）で全て代替できているため、実ファイル・台帳・manifestから外した。
UI = []


def collect_source_files():
    pool = []
    for d in SRC_DIRS:
        p = os.path.join(ROOT, d)
        if not os.path.isdir(p):
            continue
        for f in sorted(os.listdir(p)):
            m = re.match(r"white_(\d+)\.png$", f)
            if m:
                pool.append((int(m.group(1)), os.path.join(d, f)))
    pool.sort()
    return pool


def build_slots():
    """スロット一覧 (category, id, filename, label, desc, extra) を順に返す。"""
    slots = []
    for bid, name, desc, kind in BG:
        slots.append(("bg", bid, name + ".png", desc, desc, kind))
    for slug, cname, exprs in CHR:
        for no, elabel, eslug in exprs:
            fname = "chr_%s_%s_%s.png" % (slug, no, eslug)
            slots.append(("chr", fname[:-4], fname, "%s %s" % (cname, elabel),
                          "立ち絵差分 %s／%s" % (cname, elabel), slug))
    for cid, name, desc in CG_MAIN:
        slots.append(("cg", cid, name + ".png", desc, desc, "scene"))
    for cid, name, desc in CG_END:
        slots.append(("cg", cid, name + ".png", desc, desc, "ending"))
    return slots


def main():
    dry = "--dry-run" in sys.argv
    pool = collect_source_files()
    slots = build_slots()
    print("source placeholders : %d" % len(pool))
    print("assigned slots      : %d" % len(slots))
    print("buffer (unassigned) : %d" % max(0, len(pool) - len(slots)))

    mapping = []  # dict rows for assets.json
    plan = []     # (src, dst)

    for i, slot in enumerate(slots):
        cat, sid, fname, label, desc, extra = slot
        src = pool[i][1]
        dst = os.path.join("assets", cat, fname)
        plan.append((src, dst))
        mapping.append({
            "id": sid, "cat": cat, "file": "assets/%s/%s" % (cat, fname),
            "label": label, "desc": desc, "meta": extra,
            "source": src, "placeholder": True,
        })

    buffer_files = pool[len(slots):]
    for idx, (num, src) in enumerate(buffer_files, start=1):
        dst = os.path.join("assets", "_buffer", os.path.basename(src))
        plan.append((src, dst))

    if dry:
        for src, dst in plan[:12]:
            print("  %s -> %s" % (src, dst))
        print("  ... (%d moves)" % len(plan))
        return

    for cat in ("bg", "chr", "cg", "ui", "_buffer"):
        os.makedirs(os.path.join(ROOT, "assets", cat), exist_ok=True)

    for src, dst in plan:
        s = os.path.join(ROOT, src)
        d = os.path.join(ROOT, dst)
        if not os.path.exists(s):
            print("skip (missing): %s" % src)
            continue
        if os.path.exists(d):
            continue
        try:
            subprocess.run(["git", "mv", src, dst], cwd=ROOT, check=True,
                           stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        except subprocess.CalledProcessError:
            os.replace(s, d)

    for d in SRC_DIRS:
        p = os.path.join(ROOT, d)
        if os.path.isdir(p) and not os.listdir(p):
            os.rmdir(p)

    # ------------------------------------------------ data/assets.json ----
    os.makedirs(os.path.join(ROOT, "data"), exist_ok=True)
    os.makedirs(os.path.join(ROOT, "docs"), exist_ok=True)
    payload = {
        "note": "本棚（アセット台帳）。実素材に差し替えた行は placeholder を false にすると、"
                "エンジン側の演出用フォールバック（プロシージャル背景／立ち絵シルエット）が自動的に消える。",
        "engine_limit": 300,
        "assigned": len(mapping),
        "buffer": len(buffer_files),
        "assets": mapping,
        "bufferFiles": ["assets/_buffer/" + os.path.basename(s) for _, s in buffer_files],
    }
    with open(os.path.join(ROOT, "data", "assets.json"), "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=1)

    # --------------------------------------------- docs/ASSET_MANIFEST.md --
    lines = [
        "# アセット対応表（仮画像 → 正式スロット名）",
        "",
        "『まだ地図の途中で』〜✝本質✝特別編〜 企画書 第8章のアセット一覧に沿って、",
        "`image1/ image2/ image3/` に置かれていた仮画像 `white_NNN.png`（400×300・白）を",
        "正式なスロット名へリネーム・配置した対応表です。",
        "",
        "- 画像の**中身は仮のまま**です（白い画像）。エンジン側は差し替え前提で、",
        "  プレースホルダーでも画面が成立するよう背景・立ち絵は CSS/SVG で補完描画します。",
        "- 実素材に差し替えたら `data/assets.json` の該当行 `placeholder` を `false` にしてください。",
        "  それだけでフォールバック描画が消え、PNGがそのまま画面に出ます。",
        "- 合成は `mix-blend-mode: multiply`（白＝透明扱い）で行うため、**白背景の線画**でもそのまま使えます。",
        "",
        "## 内訳",
        "",
        "| 区分 | 企画書の計画 | 本リポジトリで確保したスロット |",
        "|---|---|---|",
        "| 背景(BG) | 24 | %d |" % len(BG),
        "| 立ち絵差分 | 113 | %d（第5章の表情リスト合計。企画書の計数是差 -8） |" % sum(len(e) for _, _, e in CHR),
        "| 名場面CG | 38 | %d（うち20枚は 2026-09-12 にreserve降板 ―― 本編使用は18枚） |" % len(CG_MAIN),
        "| ED専用CG | 14 | %d |" % len(CG_END),
        "| UI／アイテム | 20 | 0（2026-09-12 撤去。CSS/SVG描画で代替） |",
        "| 未割当バッファ | 約90 | %d（`assets/_buffer/`） |" % len(buffer_files),
        "",
        "※ 企画書 8.6 は立ち絵差分を113枚・総計209枚としていますが、8.2 の内訳表と",
        "   第5章の表情リストは 105枚 / 201枚になります。表情リスト側を正として 105枚分を確保しました。",
        "※ 企画書 5.5 の命名例は地図筒の場面を `cg_07_...` としていますが、8.3 の一覧では cg02 です。",
        "   8.3 の番号を正とし、`cg_02_mie-katsuya_chizutsutsu.png` としました。",
        "",
        "## 対応表",
        "",
        "| # | 元ファイル | → 差し替え先 | 内容 |",
        "|---|---|---|---|",
    ]
    for i, m in enumerate(mapping, start=1):
        lines.append("| %d | `%s` | `%s` | %s |" % (i, m["source"], m["file"], m["desc"]))
    lines.append("")
    lines.append("### 未割当バッファ（表情差分・サブキャラ追加用 / %d枚）" % len(buffer_files))
    lines.append("")
    for num, src in buffer_files:
        lines.append("- `assets/_buffer/%s`（元 `%s`）" % (os.path.basename(src), src))
    lines.append("")
    with open(os.path.join(ROOT, "docs", "ASSET_MANIFEST.md"), "w", encoding="utf-8") as f:
        f.write("\n".join(lines))

    print("done. assets.json + docs/ASSET_MANIFEST.md written.")


if __name__ == "__main__":
    main()
