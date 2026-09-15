// 現行台帳: data/assets.json と同期。2026-09-15(3): CG7枚（名場面5＋ED2）。
// tools/map_assets.py は旧スロット履歴のため凍結。再実行しない。
window.ASSET_MANIFEST = {
  "bg": {
    "BG01": {
      "file": "bg_hokutou_kyoshitsu_asa.png",
      "desc": "北棟三年B組教室・朝",
      "slot": 1
    },
    "BG02": {
      "file": "bg_hokutou_kyoshitsu_hiru.png",
      "desc": "北棟三年B組教室・昼休み",
      "slot": 2
    },
    "BG03": {
      "file": "bg_hokutou_kyoshitsu_yuugata.png",
      "desc": "北棟三年B組教室・夕方(茜色・逆光)",
      "slot": 3
    },
    "BG04": {
      "file": "bg_hokutou_kyoshitsu_yoru.png",
      "desc": "北棟三年B組教室・誰もいない夜",
      "slot": 4
    },
    "BG05": {
      "file": "bg_rouka_hokutou.png",
      "desc": "北棟廊下",
      "slot": 5
    },
    "BG06": {
      "file": "bg_kaidan_odoriba.png",
      "desc": "階段の踊り場",
      "slot": 6
    },
    "BG07": {
      "file": "bg_jimushitsu.png",
      "desc": "職員室",
      "slot": 7
    },
    "BG08": {
      "file": "bg_chizu_hokanko.png",
      "desc": "地図保管庫",
      "slot": 8
    },
    "BG09": {
      "file": "bg_toshoshitsu.png",
      "desc": "図書室",
      "slot": 9
    },
    "BG10": {
      "file": "bg_toshoshitsu_oku_shoko.png",
      "desc": "図書室奥の書庫",
      "slot": 10
    },
    "BG11": {
      "file": "bg_suiko_hotori.png",
      "desc": "翠湖のほとり",
      "slot": 11
    },
    "BG12": {
      "file": "bg_koutei_bunkasai_junbi.png",
      "desc": "文化祭/謝恩会準備中の校庭",
      "slot": 12
    },
    "BG13": {
      "file": "bg_taiikukan.png",
      "desc": "体育館",
      "slot": 13
    },
    "BG14": {
      "file": "bg_okujou.png",
      "desc": "屋上",
      "slot": 14
    },
    "BG15": {
      "file": "bg_tsuugaku_densha_mado.png",
      "desc": "通学電車の車窓",
      "slot": 15
    },
    "BG16": {
      "file": "bg_sakura_namiki.png",
      "desc": "南棟と北棟を繋ぐ桜並木",
      "slot": 16
    },
    "BG17": {
      "file": "bg_sotsugyoushiki_kaijou.png",
      "desc": "卒業式会場",
      "slot": 17
    },
    "BG18": {
      "file": "bg_minamitou_kyoshitsu.png",
      "desc": "南棟三年教室",
      "slot": 18
    },
    "BG19": {
      "file": "bg_ryoma_ie_butsudan.png",
      "desc": "両馬の家・仏壇のある部屋",
      "slot": 19
    },
    "BG20": {
      "file": "bg_hawaii_yougan_daichi_kaisou.png",
      "desc": "回想・ハワイの溶岩台地",
      "slot": 20
    },
    "BG21": {
      "file": "bg_yama_kaisou.png",
      "desc": "回想・稲葉と勝也がいた山",
      "slot": 21
    },
    "BG22": {
      "file": "bg_daigaku_camp_kaisou.png",
      "desc": "回想・大学時代の野外調査ベースキャンプ",
      "slot": 22
    },
    "BG23": {
      "file": "bg_kyoshitsu_haru_sotsugyougo.png",
      "desc": "卒業後の春・もぬけの殻の教室",
      "slot": 23
    },
    "BG24": {
      "file": "bg_kyoshitsu_suunengo.png",
      "desc": "TRUE END後日談・数年後の同じ教室",
      "slot": 24
    }
  },
  "chr": {
    "futami": {
      "name": "二見玲子",
      "exprs": [
        {
          "no": 1,
          "file": "chr_futami_01_tsuujou.png",
          "label": "通常",
          "slot": 103
        },
        {
          "no": 3,
          "file": "chr_futami_03_shinpai.png",
          "label": "心配顔",
          "slot": 105
        },
        {
          "no": 4,
          "file": "chr_futami_04_itazura.png",
          "label": "いたずらっぽい笑み",
          "slot": 106
        },
        {
          "no": 5,
          "file": "chr_futami_05_yokogao.png",
          "label": "しんみりした横顔",
          "slot": 107
        }
      ]
    },
    "inaba": {
      "name": "稲葉悌二(回想)",
      "exprs": [
        {
          "no": 1,
          "file": "chr_inaba_01_furushashin_hohoemi.png",
          "label": "古写真の中の柔らかい笑み",
          "slot": 126
        }
      ]
    },
    "izaki": {
      "name": "伊崎",
      "exprs": [
        {
          "no": 1,
          "file": "chr_izaki_01_tsuujou.png",
          "label": "通常",
          "slot": 78
        },
        {
          "no": 2,
          "file": "chr_izaki_02_egao.png",
          "label": "笑顔",
          "slot": 79
        },
        {
          "no": 4,
          "file": "chr_izaki_04_shikiri.png",
          "label": "真剣（仕切る顔）",
          "slot": 81
        },
        {
          "no": 6,
          "file": "chr_izaki_06_shimijimi_hohoemi.png",
          "label": "しみじみとした微笑み",
          "slot": 83
        }
      ]
    },
    "izumi": {
      "name": "伊豆見",
      "exprs": [
        {
          "no": 2,
          "file": "chr_izumi_02_egao.png",
          "label": "笑顔",
          "slot": 85
        },
        {
          "no": 3,
          "file": "chr_izumi_03_kinchou.png",
          "label": "緊張",
          "slot": 86
        },
        {
          "no": 4,
          "file": "chr_izumi_04_ketsui.png",
          "label": "決意",
          "slot": 87
        },
        {
          "no": 6,
          "file": "chr_izumi_06_hokorashige.png",
          "label": "誇らしげ",
          "slot": 89
        }
      ]
    },
    "katsuya": {
      "name": "塀勝也",
      "exprs": [
        {
          "no": 1,
          "file": "chr_katsuya_01_tsuujou.png",
          "label": "通常（穏やか）",
          "slot": 25
        },
        {
          "no": 2,
          "file": "chr_katsuya_02_hohoemi.png",
          "label": "微笑",
          "slot": 26
        },
        {
          "no": 3,
          "file": "chr_katsuya_03_tooi_me.png",
          "label": "遠い目",
          "slot": 27
        },
        {
          "no": 4,
          "file": "chr_katsuya_04_odoroki.png",
          "label": "驚き",
          "slot": 28
        },
        {
          "no": 6,
          "file": "chr_katsuya_06_katai_muhyoujou.png",
          "label": "硬い無表情",
          "slot": 30
        },
        {
          "no": 7,
          "file": "chr_katsuya_07_kaisou_me_hosomeru.png",
          "label": "回想・目を細める",
          "slot": 31
        },
        {
          "no": 8,
          "file": "chr_katsuya_08_namida_koraeru.png",
          "label": "涙をこらえる",
          "slot": 32
        },
        {
          "no": 9,
          "file": "chr_katsuya_09_naku.png",
          "label": "泣く",
          "slot": 33
        },
        {
          "no": 10,
          "file": "chr_katsuya_10_hareyaka_emi.png",
          "label": "晴れやかな笑み",
          "slot": 34
        }
      ]
    },
    "kuraishi": {
      "name": "倉石暁",
      "exprs": [
        {
          "no": 1,
          "file": "chr_kuraishi_01_nekkyou.png",
          "label": "通常（熱狂）",
          "slot": 96
        },
        {
          "no": 2,
          "file": "chr_kuraishi_02_kangeki.png",
          "label": "感激",
          "slot": 97
        },
        {
          "no": 3,
          "file": "chr_kuraishi_03_chousa_shinken.png",
          "label": "真剣（調査中）",
          "slot": 98
        },
        {
          "no": 5,
          "file": "chr_kuraishi_05_hokorashige.png",
          "label": "誇らしげ",
          "slot": 100
        },
        {
          "no": 6,
          "file": "chr_kuraishi_06_kotoba_ushinau.png",
          "label": "言葉を失う顔",
          "slot": 101
        }
      ]
    },
    "meshino": {
      "name": "召野カイト",
      "exprs": [
        {
          "no": 1,
          "file": "chr_meshino_01_tsuujou.png",
          "label": "通常",
          "slot": 90
        },
        {
          "no": 4,
          "file": "chr_meshino_04_shinken.png",
          "label": "真剣",
          "slot": 93
        },
        {
          "no": 5,
          "file": "chr_meshino_05_eigo_doya.png",
          "label": "英語ドヤ顔",
          "slot": 94
        },
        {
          "no": 6,
          "file": "chr_meshino_06_shinmiri.png",
          "label": "しんみり",
          "slot": 95
        }
      ]
    },
    "mie": {
      "name": "三重県臣",
      "exprs": [
        {
          "no": 1,
          "file": "chr_mie_01_reishou.png",
          "label": "通常（冷笑・半目）",
          "slot": 44
        },
        {
          "no": 2,
          "file": "chr_mie_02_ha.png",
          "label": "「は？」",
          "slot": 45
        },
        {
          "no": 3,
          "file": "chr_mie_03_douyou.png",
          "label": "動揺",
          "slot": 46
        },
        {
          "no": 4,
          "file": "chr_mie_04_kimazui_chinmoku.png",
          "label": "気まずい沈黙",
          "slot": 47
        },
        {
          "no": 6,
          "file": "chr_mie_06_iradachi_shinken.png",
          "label": "苛立ち混じりの真剣",
          "slot": 49
        },
        {
          "no": 7,
          "file": "chr_mie_07_honki_shinken.png",
          "label": "本気の真剣",
          "slot": 50
        },
        {
          "no": 9,
          "file": "chr_mie_09_sunao_hohoemi.png",
          "label": "初めての素直な微笑み",
          "slot": 52
        },
        {
          "no": 10,
          "file": "chr_mie_10_nakigao.png",
          "label": "泣き顔",
          "slot": 53
        }
      ]
    },
    "mitsumine": {
      "name": "三峰瑠衣",
      "exprs": [
        {
          "no": 1,
          "file": "chr_mitsumine_01_tsuujou.png",
          "label": "通常",
          "slot": 114
        },
        {
          "no": 2,
          "file": "chr_mitsumine_02_tsukkomi.png",
          "label": "ツッコミ顔",
          "slot": 115
        },
        {
          "no": 3,
          "file": "chr_mitsumine_03_egao.png",
          "label": "笑顔",
          "slot": 116
        },
        {
          "no": 6,
          "file": "chr_mitsumine_06_ha.png",
          "label": "「は？」（ハモリ専用）",
          "slot": 119
        }
      ]
    },
    "naitou": {
      "name": "内藤蘭",
      "exprs": [
        {
          "no": 1,
          "file": "chr_naitou_01_tsuujou.png",
          "label": "通常",
          "slot": 120
        },
        {
          "no": 2,
          "file": "chr_naitou_02_hohoemi.png",
          "label": "微笑",
          "slot": 121
        },
        {
          "no": 4,
          "file": "chr_naitou_04_odoroki.png",
          "label": "驚き",
          "slot": 123
        },
        {
          "no": 5,
          "file": "chr_naitou_05_yasashii_me.png",
          "label": "優しい目",
          "slot": 124
        },
        {
          "no": 6,
          "file": "chr_naitou_06_sukoshi_warau.png",
          "label": "少し笑う",
          "slot": 125
        }
      ]
    },
    "rei": {
      "name": "数理零",
      "exprs": [
        {
          "no": 1,
          "file": "chr_rei_01_suzushii.png",
          "label": "通常（涼しい顔）",
          "slot": 70
        },
        {
          "no": 2,
          "file": "chr_rei_02_hohoemi.png",
          "label": "微笑",
          "slot": 71
        },
        {
          "no": 4,
          "file": "chr_rei_04_odoroki.png",
          "label": "驚き",
          "slot": 73
        },
        {
          "no": 5,
          "file": "chr_rei_05_data_shinken.png",
          "label": "真剣（データと向き合う）",
          "slot": 74
        },
        {
          "no": 7,
          "file": "chr_rei_07_kotoba_erabu.png",
          "label": "言葉を選ぶ顔",
          "slot": 76
        }
      ]
    },
    "ryoma": {
      "name": "両馬二郎",
      "exprs": [
        {
          "no": 1,
          "file": "chr_ryoma_01_tsuujou.png",
          "label": "通常",
          "slot": 35
        },
        {
          "no": 2,
          "file": "chr_ryoma_02_niyari.png",
          "label": "ニヤリ",
          "slot": 36
        },
        {
          "no": 4,
          "file": "chr_ryoma_04_kyuu_magao.png",
          "label": "急に真顔",
          "slot": 38
        },
        {
          "no": 5,
          "file": "chr_ryoma_05_shonbori.png",
          "label": "しょんぼり",
          "slot": 39
        },
        {
          "no": 6,
          "file": "chr_ryoma_06_nakiwarai.png",
          "label": "泣き笑い",
          "slot": 40
        },
        {
          "no": 7,
          "file": "chr_ryoma_07_shinken_ketsui.png",
          "label": "真剣な決意顔",
          "slot": 41
        },
        {
          "no": 8,
          "file": "chr_ryoma_08_terekakushi.png",
          "label": "照れ隠しで頭をかく",
          "slot": 42
        },
        {
          "no": 9,
          "file": "chr_ryoma_09_goukyuu.png",
          "label": "号泣",
          "slot": 43
        }
      ]
    },
    "sakura": {
      "name": "櫻優",
      "exprs": [
        {
          "no": 2,
          "file": "chr_sakura_02_kenkyuusha.png",
          "label": "真剣（研究者モード）",
          "slot": 109
        },
        {
          "no": 5,
          "file": "chr_sakura_05_egao.png",
          "label": "笑顔",
          "slot": 112
        },
        {
          "no": 6,
          "file": "chr_sakura_06_yawarakai.png",
          "label": "柔らかい表情",
          "slot": 113
        }
      ]
    },
    "satou": {
      "name": "砂糖東洋",
      "exprs": [
        {
          "no": 1,
          "file": "chr_satou_01_game_gyoushi.png",
          "label": "通常（ゲーム画面凝視）",
          "slot": 62
        },
        {
          "no": 2,
          "file": "chr_satou_02_muhyoujou.png",
          "label": "無表情（素）",
          "slot": 63
        },
        {
          "no": 3,
          "file": "chr_satou_03_kao_ageta.png",
          "label": "驚き（画面から顔を上げる）",
          "slot": 64
        },
        {
          "no": 4,
          "file": "chr_satou_04_soppo.png",
          "label": "照れ隠しでそっぽを向く",
          "slot": 65
        },
        {
          "no": 5,
          "file": "chr_satou_05_camera.png",
          "label": "真剣にカメラを構える顔",
          "slot": 66
        },
        {
          "no": 6,
          "file": "chr_satou_06_hohoemi.png",
          "label": "微笑み（レア）",
          "slot": 67
        },
        {
          "no": 7,
          "file": "chr_satou_07_tsumaru.png",
          "label": "言葉に詰まる顔",
          "slot": 68
        },
        {
          "no": 8,
          "file": "chr_satou_08_me_hikari_koraeru.png",
          "label": "目に光るものを堪える顔",
          "slot": 69
        }
      ]
    },
    "terachi": {
      "name": "寺地星",
      "exprs": [
        {
          "no": 1,
          "file": "chr_terachi_01_nemusou.png",
          "label": "通常（眠そう・淡々）",
          "slot": 54
        },
        {
          "no": 2,
          "file": "chr_terachi_02_konwaku_katamaru.png",
          "label": "困惑して固まる",
          "slot": 55
        },
        {
          "no": 3,
          "file": "chr_terachi_03_haishin_shinken.png",
          "label": "真剣な配信者の顔",
          "slot": 56
        },
        {
          "no": 4,
          "file": "chr_terachi_04_ureshii.png",
          "label": "嬉しい",
          "slot": 57
        },
        {
          "no": 6,
          "file": "chr_terachi_06_maiku_no_ketsui.png",
          "label": "マイク前の決意顔",
          "slot": 59
        },
        {
          "no": 8,
          "file": "chr_terachi_08_namida.png",
          "label": "涙",
          "slot": 61
        }
      ]
    }
  },
  "cg": {
    "cg_chizutsutsu_kobore_shashin": {
      "file": "cg_chizutsutsu_kobore_shashin.png",
      "desc": "三重／勝也　地図筒から古写真がこぼれ落ちる瞬間",
      "slot": 131
    },
    "cg_omoide_chikeizu_kansei": {
      "file": "cg_omoide_chikeizu_kansei.png",
      "desc": "「思い出の地形図」完成図　画面いっぱいの作品アートワーク",
      "slot": 151
    },
    "cg_yama_ue_hajimete_chizu": {
      "file": "cg_yama_ue_hajimete_chizu.png",
      "desc": "若き勝也／稲葉(回想)　山の上、初めての地形図(褪色調)",
      "slot": 156
    },
    "cg_hareyaka_na_emi": {
      "file": "cg_hareyaka_na_emi.png",
      "desc": "勝也(単独)　晴れやかな笑み(表情⑩解禁カット)",
      "slot": 163
    },
    "cg_sotsugyou_sakurafubuki": {
      "file": "cg_sotsugyou_sakurafubuki.png",
      "desc": "全員集合　卒業式・桜吹雪",
      "slot": 164
    }
  },
  "ed_cg": {
    "cg_end_true": {
      "file": "cg_end_true.png",
      "desc": "TRUE END「地面は、忘れない。」数年後の教室とアルバムのモンタージュ",
      "slot": 168
    },
    "cg_end_bonus": {
      "file": "cg_end_bonus.png",
      "desc": "BONUS EXTRA　数年後・翠湖のほとりの同窓会(全員＋勝也)",
      "slot": 181
    }
  }
};
