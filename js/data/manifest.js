/* ============================================================
   『まだ地図の途中で』〜✝本質✝特別編〜
   アセット・マニフェスト（キャラ定義 / 背景 / CG / 辞典）
   ============================================================ */
(function (global) {
  'use strict';

  /* ---------------- 立ち絵キャラクター定義 ---------------- */
  const CHARS = {
    katsuya:   { name: '塀勝也',   short: '塀',   color: '#6f9070', role: '地理教師' },
    ryoma:     { name: '両馬二郎', short: '両馬', color: '#d08a3e', role: '✝本質✝の生みの親' },
    mie:       { name: '三重県臣', short: '三重', color: '#b04a45', role: '「は？」' },
    terachi:   { name: '寺地星',   short: '寺地', color: '#5f6fae', role: '本質配信' },
    satou:     { name: '砂糖東洋', short: '砂糖', color: '#3f8ca3', role: '窓の外は見ていない' },
    rei:       { name: '数理零',   short: '零',   color: '#7d84a8', role: '学年首席' },
    izaki:     { name: '伊崎',     short: '伊崎', color: '#7a9a4f', role: 'まとめ役' },
    izumi:     { name: '伊豆見',   short: '伊豆見', color: '#a58bc0', role: '大喜利の司会' },
    meshino:   { name: '召野カイト', short: '召野', color: '#c078a0', role: '完了した男' },
    kuraishi:  { name: '倉石暁',   short: '倉石', color: '#b98a4a', role: '年鑑編纂者' },
    futami:    { name: '二見玲子', short: '二見', color: '#c46a80', role: '英語副担任' },
    sakura:    { name: '櫻優',     short: '櫻',   color: '#d48fa8', role: '恋愛学研究者' },
    mitsumine: { name: '三峰瑠衣', short: '三峰', color: '#4f9078', role: '常識人' },
    naitou:    { name: '内藤蘭',   short: '内藤', color: '#8f83b8', role: '隠れ視聴者' },
    inaba:     { name: '稲葉悌二', short: '稲葉', color: '#8a7a5a', role: '記憶の中の声' },
    wakaki:    { name: '若き日の勝也', short: '勝也', color: '#5a7a68', role: '回想' }
  };

  /* 表情ラベル（スタンプ表示用） */
  const EXPR_LABELS = {
    katsuya:   ['通常', '微笑', '遠い目', '驚き', '伏せ目', '硬い無表情', '目を細める', '涙をこらえる', '泣く', '晴れやかな笑み'],
    ryoma:     ['通常', 'ニヤリ', '全力', '急に真顔', 'しょんぼり', '泣き笑い', '真剣な決意', '頭をかく', '号泣'],
    mie:       ['通常', 'は？', '動揺', '気まずい沈黙', '照れ', '苛立ち真剣', '本気の真剣', '涙をこらえる', '素直な微笑み', '泣き顔'],
    terachi:   ['通常', '困惑', '配信者の顔', '嬉しい', '堪える', '決意', '震える声', '涙'],
    satou:     ['ゲーム顔', '無表情', '驚き', 'そっぽ', 'カメラ', '微笑み', '言葉に詰まる', '堪える'],
    rei:       ['通常', '微笑', '考え中', '驚き', '真剣', '優しい目', '言葉を選ぶ', '潤む'],
    izaki:     ['通常', '笑顔', '困り顔', '仕切る', '驚き', 'しみじみ'],
    izumi:     ['通常', '笑顔', '緊張', '決意', '照れ', '誇らしげ'],
    meshino:   ['通常', '決め顔', '照れ', '真剣', '英語ドヤ顔', 'しんみり'],
    kuraishi:  ['熱狂', '感激', '真剣', 'しょんぼり', '誇らしげ', '言葉を失う', '涙ぐむ'],
    futami:    ['通常', '微笑', '心配顔', 'いたずらっぽい', 'しんみり'],
    sakura:    ['通常', '研究者モード', '照れ', '動揺', '笑顔', '柔らかい表情'],
    mitsumine: ['通常', 'ツッコミ', '笑顔', '呆れ', '優しい顔', 'は？'],
    naitou:    ['通常', '微笑', '読書中', '驚き', '優しい目', '少し笑う'],
    inaba:     ['柔らかい笑み', '山を指差す横顔'],
    wakaki:    ['笑っている', '呆然']
  };

  /* ---------------- 背景（BG01〜24） ----------------
     mood: 表示トーン（仮画像時の水面グラデーション） */
  const BGS = {
    bg01: { file: 'bg/bg_hokutou_kyoshitsu_asa.png',          mood: 'morning', plate: '北棟三年B組教室・朝' },
    bg02: { file: 'bg/bg_hokutou_kyoshitsu_hiru.png',         mood: 'noon',    plate: '北棟三年B組教室・昼休み' },
    bg03: { file: 'bg/bg_hokutou_kyoshitsu_yuugata.png',      mood: 'dusk',    plate: '北棟三年B組教室・夕方' },
    bg04: { file: 'bg/bg_hokutou_kyoshitsu_yoru.png',         mood: 'night',   plate: '北棟三年B組教室・夜' },
    bg05: { file: 'bg/bg_rouka_hokutou.png',                  mood: 'noon',    plate: '北棟・廊下' },
    bg06: { file: 'bg/bg_kaidan_odoriba.png',                 mood: 'dusk',    plate: '階段の踊り場' },
    bg07: { file: 'bg/bg_jimushitsu.png',                     mood: 'noon',    plate: '職員室' },
    bg08: { file: 'bg/bg_chizu_hokanko.png',                  mood: 'dim',     plate: '地図保管庫' },
    bg09: { file: 'bg/bg_toshoshitsu.png',                    mood: 'noon',    plate: '図書室' },
    bg10: { file: 'bg/bg_toshokan_shozoko.png',               mood: 'dusty',   plate: '図書室奥・書庫' },
    bg11: { file: 'bg/bg_suiko_hotori.png',                   mood: 'green',   plate: '翠湖のほとり' },
    bg12: { file: 'bg/bg_koutei_bunkasai_junbi.png',          mood: 'sky',     plate: '校庭・謝恩会準備' },
    bg13: { file: 'bg/bg_taiikukan.png',                      mood: 'gym',     plate: '体育館' },
    bg14: { file: 'bg/bg_okujou.png',                         mood: 'sky',     plate: '屋上' },
    bg15: { file: 'bg/bg_tsuugaku_densha_mado.png',           mood: 'train',   plate: '通学電車・車窓' },
    bg16: { file: 'bg/bg_sakura_namiki.png',                  mood: 'sakura',  plate: '桜並木' },
    bg17: { file: 'bg/bg_sotsugyoushiki_kaijou.png',          mood: 'sakura',  plate: '卒業式会場' },
    bg18: { file: 'bg/bg_minamitou_kyoshitsu.png',            mood: 'noon',    plate: '南棟三年教室' },
    bg19: { file: 'bg/bg_ryoma_ie_butsudan.png',              mood: 'tatami',  plate: '両馬の家・仏壇のある部屋' },
    bg20: { file: 'bg/bg_hawaii_youganchi_kaisou.png',        mood: 'lava',    plate: '回想・ハワイの溶岩台地' },
    bg21: { file: 'bg/bg_yama_gensho_kaisou.png',             mood: 'mountain',plate: '回想・あの山' },
    bg22: { file: 'bg/bg_daigaku_yakou_kaisou.png',           mood: 'camp',    plate: '回想・野外調査ベースキャンプ' },
    bg23: { file: 'bg/bg_kyoshitsu_haru_sotsugyougo.png',     mood: 'hollow',  plate: '卒業後の教室・春' },
    bg24: { file: 'bg/bg_kyoshitsu_suunengo.png',             mood: 'warm',    plate: '数年後の三年B組教室' }
  };

  /* ---------------- 専用イベントCG ---------------- */
  const CGS = {
    cg_01: { file: 'cg/cg_01_mie_tomaru.png', title: '呼び止められた朝',       cap: '三重／勝也の声　―　教室の入口' },
    cg_02: { file: 'cg/cg_02_mie-katsuya_shashin_koboreru.png', title: 'こぼれたもの', cap: '三重／勝也　―　地図保管庫' },
    cg_03: { file: 'cg/cg_03_mie_ura_no_moji.png', title: '裏の文字',           cap: '三重（手元）　―　万年筆の書き込み' },
    cg_04: { file: 'cg/cg_04_katsuya_kaishuu.png', title: '回収',               cap: '勝也　―　「すまん、忘れてただけだ」' },
    cg_05: { file: 'cg/cg_05_mie-ryoma_rouka_yuuhi.png', title: '放課後の共有', cap: '三重／両馬　―　誰もいない廊下' },
    cg_06: { file: 'cg/cg_06_satou_shakan_saikan.png', title: '三年分の車窓',   cap: '砂糖（手元）　―　写真フォルダ' },
    cg_07: { file: 'cg/cg_07_satou-mie_miteta.png', title: '見てた',            cap: '砂糖／三重　―　窓を背にして' },
    cg_08: { file: 'cg/cg_08_rei_data_to_hikari.png', title: 'データと光',      cap: '零　―　図書室、画面の灯り' },
    cg_09: { file: 'cg/cg_09_rei-ryoma-mie_daiji.png', title: '大事だと思うから', cap: '零／両馬／三重　―　机を囲んで' },
    cg_10: { file: 'cg/cg_10_terachi_kami_tabane.png', title: '引き出しの中の三年', cap: '寺地（単独）　―　紙の量が時間になる' },
    cg_11: { file: 'cg/cg_11_terachi-ryoma-mie_arigatou_no_kai.png', title: 'ありがとうの会', cap: '寺地／両馬／三重　―　頷き合う' },
    cg_12: { file: 'cg/cg_12_ryoma_butudan_mae.png', title: '報告の作法',       cap: '両馬（後ろ姿）　―　線香の煙' },
    cg_13: { file: 'cg/cg_13_ryoma-mie_soigo_no_koe.png', title: '聞こえない声', cap: '両馬／三重　―　仏壇の前で並んで' },
    cg_14: { file: 'cg/cg_14_kuraishi_shoko_shinbun.png', title: '書庫の記録',  cap: '倉石（単独）　―　埃のかぶった紙面' },
    cg_15: { file: 'cg/cg_15_kuraishi-ryoma-mie_houkoku.png', title: '報告',    cap: '倉石／両馬／三重　―　一同、息を呑む' },
    cg_16: { file: 'cg/cg_16_meshino-futami_shokuinshitsu.png', title: '職員室の光', cap: '召野／二見　―　窓越しの距離感' },
    cg_17: { file: 'cg/cg_17_mie-mitsumine_sakura_namiki.png', title: '境界を歩く', cap: '三重／三峰　―　まだ蕾の桜並木' },
    cg_18: { file: 'cg/cg_18_mie-minamitou_ikkisu.png', title: '南棟の決断',    cap: '三重／三峰／櫻／内藤　―　えんじと紺' },
    cg_19: { file: 'cg/cg_19_naitou_kao_o_ageru.png', title: 'ずっと見てました', cap: '内藤（単独）　―　伏し目から顔を上げる一瞬' },
    cg_20: { file: 'cg/cg_20_zenin_chizu_o_tsukuru_yoru.png', title: '地図を作る夜', cap: '全員集合　―　机を寄せ合う俯瞰' },
    cg_21: { file: 'cg/cg_21_ryoma_temoto_kake.png', title: '賭け',             cap: '両馬（手元）　―　余白への書き添え' },
    cg_22: { file: 'cg/cg_22_omoide_no_chikeizu.png', title: '思い出の地形図',  cap: '三年間が、等高線になった' },
    cg_23: { file: 'cg/cg_23_katsuya_usogami_mado.png', title: '誰もいない窓',  cap: '勝也（後ろ姿）　―　夕焼け、逆光' },
    cg_24: { file: 'cg/cg_24_katsuya_zekku.png', title: '絶句',                 cap: '勝也（正面）　―　地図を前に' },
    cg_25: { file: 'cg/cg_25_mie-katsuya_kiite_iidesuka.png', title: '聞いていいですか', cap: '三重／勝也　―　二人だけの間合い' },
    cg_26: { file: 'cg/cg_26_katsuya_juugobyou.png', title: '十五秒',           cap: '勝也（単独）　―　いつもの癖が、止まらない' },
    cg_27: { file: 'cg/cg_27_wakaki-inaba_hajimete_no_chikeizu.png', title: 'はじめての地形図', cap: '若き勝也／稲葉　―　褪せた山の上' },
    cg_28: { file: 'cg/cg_28_wakaki_fukumu.png', title: '生意気な口',           cap: '若き勝也　―　俯いたまま' },
    cg_29: { file: 'cg/cg_29_katsuya_fuhou.png', title: '訃報',                 cap: '勝也（シルエット）　―　言葉のない画面' },
    cg_30: { file: 'cg/cg_30_katsuya_mado_no_houkoku.png', title: '窓の外の報告', cap: '勝也（単独）　―　現在、この教室で' },
    cg_31: { file: 'cg/cg_31_zenin-katsuya_onajikoto.png', title: '同じことをしていた者たち', cap: '全員／勝也　―　見渡す広い構図' },
    cg_32: { file: 'cg/cg_32_terachi_saigo_no_roudoku.png', title: '最後の朗読', cap: '寺地（単独）　―　スマホの灯り' },
    cg_33: { file: 'cg/cg_33_zenin-katsuya_namida_o_koraeru.png', title: '一人ずつの一言', cap: '全員／勝也　―　涙をこらえて' },
    cg_34: { file: 'cg/cg_34_katsuya_hareyaka.png', title: '晴れやか',          cap: '勝也（単独）　―　三年分のあの顔' },
    cg_35: { file: 'cg/cg_35_zenin_sotsugyoushiki_sakurafubuki.png', title: '五分咲き', cap: '全員集合　―　卒業式、桜吹雪' },
    cg_36: { file: 'cg/cg_36_katsuya_mada_konai_dareka_e.png', title: 'まだ来ない誰かへ', cap: '勝也　―　数年後の同じ地図' },
    cg_37: { file: 'cg/cg_37_mie-mitsumine_mankai.png', title: '満開',          cap: '三重／三峰　―　満開の桜並木' },
    cg_38: { file: 'cg/cg_38_ryoma_haka_mae.png', title: '墓前の報告',          cap: '両馬（単独）　―　「まだ終わってない」' }
  };

  /* ---------------- ED専用CG ---------------- */
  const CG_ENDS = {
    cg_end_true:       { file: 'cg_end/cg_end_true.png',       title: '数年後の同じ地図',   cap: 'TRUE END' },
    cg_end_mie:        { file: 'cg_end/cg_end_mie.png',        title: '教壇の練習',         cap: 'GOOD END・三重編' },
    cg_end_satou:      { file: 'cg_end/cg_end_satou.png',      title: 'フィールドで空を',   cap: 'GOOD END・砂糖編' },
    cg_end_rei:        { file: 'cg_end/cg_end_rei.png',        title: '「大事」という語彙', cap: 'GOOD END・零編' },
    cg_end_terachi:    { file: 'cg_end/cg_end_terachi.png',    title: '紙束は増え続ける',   cap: 'GOOD END・寺地編' },
    cg_end_ryoma:      { file: 'cg_end/cg_end_ryoma.png',      title: '墓前の報告・完了',   cap: 'GOOD END・両馬編' },
    cg_end_izaki_izumi:{ file: 'cg_end/cg_end_izaki_izumi.png',title: 'それぞれの歩幅',     cap: 'GOOD END・伊崎＋伊豆見編' },
    cg_end_meshino:    { file: 'cg_end/cg_end_meshino.png',    title: '言葉を届ける仕事',   cap: 'GOOD END・召野編' },
    cg_end_kuraishi:   { file: 'cg_end/cg_end_kuraishi.png',   title: '年鑑、託す',         cap: 'GOOD END・倉石編' },
    cg_end_minamitou:  { file: 'cg_end/cg_end_minamitou.png',  title: '境界のない春',       cap: 'GOOD END・南棟編' },
    cg_end_normal:     { file: 'cg_end/cg_end_normal.png',     title: 'いつも通りの桜',     cap: 'NORMAL END' },
    cg_end_bittersweet:{ file: 'cg_end/cg_end_bittersweet.png',title: 'こぼれた地図',       cap: 'BITTERSWEET END' },
    cg_end_comedy:     { file: 'cg_end/cg_end_comedy.png',     title: '原✝本質✝、完全体',  cap: 'COMEDY SECRET END' },
    cg_end_bonus:      { file: 'cg_end/cg_end_bonus.png',      title: '翠湖のほとり',       cap: 'BONUS EXTRA' }
  };

  /* ---------------- ✝本質✝辞典（TIPS） ----------------
     ※哲学ガイドに従い、✝本質✝そのものは定義しない */
  const TERMS = {
    honsitsu:    { term: '✝本質✝', def: '両馬二郎が世に解き放った合言葉。脂の浮き方、電線の張り方、コーンスープの不在に至るまで、あらゆるものに付与されうる。何に付くと本質になるのかは、最後まで言語化されない。わかった瞬間、それはもう本質ではなくなるのかもしれない。' },
    heikatsu:    { term: 'ヘイカツ', def: '地理教師・塀勝也の通称。同じ地形図を三年間見せ続け、授業中に窓の外を五秒だけ見て、何かをつぶやく。誰も理由を聞かなかった。理由を聞けたのは、卒業まで一ヶ月を切ってからだった。' },
    feikatsu:    { term: 'フェイカツ', def: '両馬の裏アカウント。受験情報掲示板などに「ヘイカツ先生に会いに絶対合格するぞ！」系の書き込みを続けている。本人は「俺じゃないかもしれない」と主張するが、✝がついている時点で候補は一人しかいない。' },
    cornsoup:    { term: 'コーンスープの不在', def: '北棟の自販機からコーンスープが消えて三ヶ月（後に半年と三日と訂正される）という事象。業者が忘れたのか、飲む人間がいないと判断されたのか。不在そのものが一年生の時点で✝本質✝認定された。帰還の記録は倉石が日付まで管理している。' },
    ito_shizu:   { term: '糸魚川−静岡構造線', def: '日本列島の地質を東西に分ける大断層線。味噌・醤油・雑煮の餅の形の分布が、だいたいこの線に重なる。朝食が何億年前の地面で決まっているという発想の起点。' },
    suiko:       { term: '翠湖マラソン', def: '学校近くの翠湖を走る定番行事。湖の位置は、後の「思い出の地形図」では等高線の窪みとして正確に再現された。' },
    haishin:     { term: '本質配信', def: '寺地星による不定期配信。視聴者から届いた意味不明な一言を紙に書いて読み上げ、その場で意味を見出そうとする。意味は最後まで見つからないが、続けることをやめなかった。' },
    yonhachikyu: { term: '489', def: '匿名掲示板「ヘイカツスレ」に書き込む謎の第三者。正体は不明。正体が不明のままでいること自体に、意味があるのかもしれない。わからないことこそ、✝本質✝に近い。' },
    renai:       { term: '恋愛発生の第七法則', def: '内進二年の櫻優が提唱する「恋愛学」の法則群の一つ。内容は不明。法則の番号が第七まで進んでいることのほうが、よほど✝本質✝的である。' },
    chikeizu:    { term: '思い出の地形図', def: '三年B組が塀勝也に贈った手作りの地図。等高線の代わりに三年間の記憶が走る。翠湖、ハワイの溶岩台地、コーンスープの自販機、糸魚川−静岡構造線、球技大会のコート。隅に、小さな余白がある。' },
    inaba:       { term: '稲葉悌二', def: '古い写真にもう一人写っていた大人。塀勝也の学生時代に地学部の外部講師を務め、山ごとに地図の読み方を教えた人。口癖は「地図は、まだ来ない誰かを待つために描くんだ」。' },
    chimen:      { term: '「地面は忘れない」', def: '塀勝也の口癖。地面は全部を記録していて、地図はその一部を切り取ったものにすぎない——そういう意味で使われている。誰に教わった言葉なのかは、卒業式の前日まで誰も知らなかった。' },
    madogoso:    { term: '窓の外の五秒', def: '塀勝也が授業中に窓の外を見て黙る、いつもの癖。三年間、誰も理由を聞かなかった。理由は、山が見える方角だった。報告は、本人いわく「誰かに背負わせる話じゃない」。' }
  };

  /* ---------------- ルート定義（HUB用） ---------------- */
  const ROUTES = {
    A: { key: 'satou',   title: '砂糖編',   sub: '「窓の外の続き」',           label: 'route_A',     color: '#3f8ca3' },
    B: { key: 'rei',     title: '零編',     sub: '「面白いの向こう側」',       label: 'route_B',     color: '#7d84a8' },
    C: { key: 'terachi', title: '寺地編',   sub: '「最後の朗読、まだ早いけど」', label: 'route_C',    color: '#5f6fae' },
    D: { key: 'ryoma',   title: '両馬編',   sub: '「祖父と✝本質✝」',           label: 'route_D',    color: '#d08a3e' },
    E: { key: 'minamitou', title: '南棟編', sub: '「境界線の向こう側」',       label: 'route_E',     color: '#4f9078' },
    F: { key: 'meshino', title: '召野＋倉石編', sub: '「調査と応援」',         label: 'route_F',     color: '#b98a4a' }
  };

  const MANIFEST = { CHARS: CHARS, EXPR_LABELS: EXPR_LABELS, BGS: BGS, CGS: CGS, CG_ENDS: CG_ENDS, TERMS: TERMS, ROUTES: ROUTES };
  global.MANIFEST = MANIFEST;
  if (typeof module !== 'undefined' && module.exports) module.exports = MANIFEST;
})(typeof window !== 'undefined' ? window : globalThis);
