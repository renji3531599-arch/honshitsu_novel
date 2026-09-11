#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""アセット割り当てスクリプト。
image1〜3 の仮画像(white_XXX.png)を、シナリオ「まだ地図の途中で」の
アセット一覧(第8章)に準拠した正式ファイル名へ git mv する。
"""
import os, re, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

# ---------------- 立ち絵: chr_[略称]_[表情番号].png ----------------
EXPR = {
    "katsuya": 10, "ryoma": 9, "mie": 10, "terachi": 8, "satou": 8,
    "rei": 8, "izaki": 6, "izumi": 6, "meshino": 6, "kuraishi": 7,
    "futami": 5, "sakura": 6, "mitsumine": 6, "naitou": 6,
    "inaba": 2, "wakaki": 2,
}

# ---------------- 背景 24枚 ----------------
BG = [
    "bg_hokutou_kyoshitsu_asa", "bg_hokutou_kyoshitsu_hiru",
    "bg_hokutou_kyoshitsu_yuugata", "bg_hokutou_kyoshitsu_yoru",
    "bg_rouka_hokutou", "bg_kaidan_odoriba", "bg_jimushitsu",
    "bg_chizu_hokanko", "bg_toshoshitsu", "bg_toshokan_shozoko",
    "bg_suiko_hotori", "bg_koutei_bunkasai_junbi", "bg_taiikukan",
    "bg_okujou", "bg_tsuugaku_densha_mado", "bg_sakura_namiki",
    "bg_sotsugyoushiki_kaijou", "bg_minamitou_kyoshitsu",
    "bg_ryoma_ie_butsudan", "bg_hawaii_youganchi_kaisou",
    "bg_yama_gensho_kaisou", "bg_daigaku_yakou_kaisou",
    "bg_kyoshitsu_haru_sotsugyougo", "bg_kyoshitsu_suunengo",
]

# ---------------- 専用CG 38枚 ----------------
CG = [
    "cg_01_mie_tomaru", "cg_02_mie-katsuya_shashin_koboreru",
    "cg_03_mie_ura_no_moji", "cg_04_katsuya_kaishuu",
    "cg_05_mie-ryoma_rouka_yuuhi", "cg_06_satou_shakan_saikan",
    "cg_07_satou-mie_miteta", "cg_08_rei_data_to_hikari",
    "cg_09_rei-ryoma-mie_daiji", "cg_10_terachi_kami_tabane",
    "cg_11_terachi-ryoma-mie_arigatou_no_kai", "cg_12_ryoma_butudan_mae",
    "cg_13_ryoma-mie_soigo_no_koe", "cg_14_kuraishi_shoko_shinbun",
    "cg_15_kuraishi-ryoma-mie_houkoku", "cg_16_meshino-futami_shokuinshitsu",
    "cg_17_mie-mitsumine_sakura_namiki", "cg_18_mie-minamitou_ikkisu",
    "cg_19_naitou_kao_o_ageru", "cg_20_zenin_chizu_o_tsukuru_yoru",
    "cg_21_ryoma_temoto_kake", "cg_22_omoide_no_chikeizu",
    "cg_23_katsuya_usogami_mado", "cg_24_katsuya_zekku",
    "cg_25_mie-katsuya_kiite_iidesuka", "cg_26_katsuya_juugobyou",
    "cg_27_wakaki-inaba_hajimete_no_chikeizu", "cg_28_wakaki_fukumu",
    "cg_29_katsuya_fuhou", "cg_30_katsuya_mado_no_houkoku",
    "cg_31_zenin-katsuya_onajikoto", "cg_32_terachi_saigo_no_roudoku",
    "cg_33_zenin-katsuya_namida_o_koraeru", "cg_34_katsuya_hareyaka",
    "cg_35_zenin_sotsugyoushiki_sakurafubuki", "cg_36_katsuya_mada_konai_dareka_e",
    "cg_37_mie-mitsumine_mankai", "cg_38_ryoma_haka_mae",
]

CG_END = [
    "cg_end_true", "cg_end_mie", "cg_end_satou", "cg_end_rei",
    "cg_end_terachi", "cg_end_ryoma", "cg_end_izaki_izumi",
    "cg_end_meshino", "cg_end_kuraishi", "cg_end_minamitou",
    "cg_end_normal", "cg_end_bittersweet", "cg_end_comedy", "cg_end_bonus",
]

UI = [
    "ui_01_title_logo", "ui_02_line_frame", "ui_03_bbs_frame",
    "ui_04_juken_bbs_frame", "ui_05_haishin_frame", "ui_06_nenkan_icon",
    "ui_07_nyumon_icon", "ui_08_shinbun_icon", "ui_09_koshashin_icon",
    "ui_10_chizutsutsu_icon", "ui_11_kami_pen_icon",
    "ui_12_chikeizu_icon", "ui_13_choice_frame", "ui_14_heart_frame",
    "ui_15_chapter_frame", "ui_16_saveload_deco", "ui_17_hub_map",
    "ui_18_end_logo_frame", "ui_19_sotsugyou_shousho", "ui_20_cornsoup_icon",
]


def build_asset_list():
    assets = []  # (category, filename)
    for b in BG:
        assets.append(("bg", b + ".png"))
    for who, cnt in EXPR.items():
        for i in range(1, cnt + 1):
            assets.append(("chr", "chr_%s_%02d.png" % (who, i)))
    for c in CG:
        assets.append(("cg", c + ".png"))
    for c in CG_END:
        assets.append(("cg_end", c + ".png"))
    for u in UI:
        assets.append(("ui", u + ".png"))
    return assets


def collect_placeholders():
    files = []
    for d in ("image1", "image2", "image3"):
        p = os.path.join(ROOT, d)
        for f in sorted(os.listdir(p)):
            m = re.match(r"white_(\d+)\.png$", f)
            if m:
                files.append((int(m.group(1)), d, f))
    files.sort()
    return files


def git_mv(src, dst):
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    r = subprocess.run(["git", "mv", src, dst], capture_output=True, text=True)
    if r.returncode != 0:
        # fallback: plain move
        subprocess.run(["mv", src, dst], check=True)


def main():
    assets = build_asset_list()
    ph = collect_placeholders()
    print("assets:", len(assets), "placeholders:", len(ph))
    if len(ph) < len(assets):
        print("ERROR: not enough placeholders"); sys.exit(1)
    for (cat, name), (_, d, f) in zip(assets, ph):
        git_mv(os.path.join(d, f), os.path.join("assets", cat, name))
    # 余りは spare として保管(表情追加などのバッファ)
    rest = ph[len(assets):]
    for i, (_, d, f) in enumerate(rest, 1):
        git_mv(os.path.join(d, f), os.path.join("assets", "spare", "spare_%03d.png" % i))
    # 空になったディレクトリを削除
    for d in ("image1", "image2", "image3"):
        p = os.path.join(ROOT, d)
        if os.path.isdir(p) and not os.listdir(p):
            os.rmdir(p)
    print("done. mapped:", len(assets), "spare:", len(rest))


if __name__ == "__main__":
    main()
