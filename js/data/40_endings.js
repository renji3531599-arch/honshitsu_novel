/* ============================================================
   【共通】卒業式　＋　エンディング一式（14種）
   ============================================================ */
(function (g) {
  'use strict';
  const K = g.KIT;
  const o = [];
  const L = K.L, BG = K.BG, CG = K.CG, CGO = K.CGO, CH = K.CH, BGM = K.BGM, SE = K.SE,
        N = K.N, SP = K.SP, S = K.S, T = K.T, HI = K.HI, PT = K.PT, FL = K.FL,
        DI = K.DI, IT = K.IT, SC = K.SC, CHO = K.CHO, JP = K.JP, IF = K.IF,
        BD = K.BD,
        ENDN = K.ENDN, STF = K.STF, TT = K.TT, BR = function () { return { t: 'branch_end' }; };

  /* ---------------- END-0 共通：卒業式 ---------------- */
  o.push(L('endings_start'));
  o.push(SC('END-0'));
  o.push(CH('翌日', '卒業式', '桜、五分咲き'));
  o.push(BG('bg17'));
  o.push(CG('cg_35', '五分咲き', '全員集合　―　卒業式、桜吹雪'));
  o.push(BGM('bgm17'));
  o.push(SE('bell'));
  o.push(N('翌日、卒業式。'));
  o.push(N('桜はまだ五分咲きだったが、それで十分だった。'));
  o.push(N('北棟と南棟、二つのネクタイが、同じ並木道を通る。'));
  o.push(N('理数科三年B組の四十人が、最後にもう一度、あの教室に集まった。'));
  o.push(CGO());
  o.push(SP('mie', 9, 'cl'));
  o.push(SP('ryoma', 2, 'cr'));
  o.push(S('ryoma', 2, 'cr', '三年間、ありがとうございました'));
  o.push(S('mie', 9, 'cl', 'お前が言うと締まらねえんだよ'));
  o.push(S('ryoma', 2, 'cr', '締まらなくていい。それも✝本質✝だ'));
  o.push(S('mie', 9, 'cl', '……まあ'));
  o.push(N('「まあ」がまだ死語になっていないことに、誰もが少しだけ安心した。'));
  o.push(HI('all'));
  o.push(N('かくして、理数科三年B組の物語は、その分岐点を迎える。'));
  o.push(N('――先生は、どこまで語ったのか。教室は、どこまで届いたのか。\nそれは、最後の最後まで、積み重ねた心が決める。'));

  o.push(BR());

  /* ---------------- ① TRUE END ---------------- */
  o.push(L('end_true'));
  o.push(BG('bg24'));
  o.push(CG('cg_end_true', '数年後の同じ地図', 'TRUE END'));
  o.push(BGM('bgm18'));
  o.push(N('数年後。北棟三年B組――今はもう違う顔ぶれの教室で、\n勝也は同じ地形図を広げている。'));
  o.push(S('katsuya', 2, 'cr', '同じ地図だ。前の代から、そのまた前の代からも、ずっと同じ。\n同じに見えるか?'));
  o.push(CGO());
  o.push(N('教室の隅、新任教師として控えていた誰か――\nかつての教え子の一人が、その光景を見て、静かに笑う。'));
  o.push(N('勝也は、放課後の職員室で、久しぶりに古い匿名掲示板を開いた。\n「ヘイカツスレ」。三年前、生徒たちが書き続けていたあのスレッドだ。'));
  o.push(BD('【匿名掲示板】ヘイカツ先生について語るスレ・21', [
    { num: '201', name: '名無しの地形図好き', date: '○年前', body: 'ヘイカツ相変わらず同じ地図見せてるらしい。新入生が「毎年同じ絵」って言ってた。それでいいんだよ。あれは毎年同じなんじゃなくて、ずっと同じなんだ' },
    { num: '202', name: '名無しの地形図好き', date: '○年前', body: '卒業したけどたまに思い出す。窓の外の五秒。あれは多分、誰かへの報告だったんだろうな。返事は教えてもらえなかったけど' },
    { num: '489', name: '489', date: '○年前', body: '地形の話を通じて、時間と人間の話をしてる。' },
    { num: '490', name: '名無しの地形図好き', date: '○年前', body: '>>489 この人いまだに何者かわからん。まあいい。わからないままでいいスレだし' }
  ]));
  o.push(DI('yonhachikyu'));
  o.push(N('読み進めるうちに、見覚えのない、けれど確かに何年も前から書き込みを続けている\n「489」という名前に行き当たる。'));
  o.push(N('誰が書いたのかは、わからない。\nわからないままでいい。'));
  o.push(N('地面は、忘れない。\n忘れない誰かが、きっとどこかにいる。それだけで、十分だった。'));
  o.push(S('katsuya', 2, 'cr', '……お前らも、元気でやってるか'));
  o.push(ENDN('end_true', 'true', '地面は、忘れない。'));
  o.push(STF());

  /* ---------------- ② GOOD END・三重編 ---------------- */
  o.push(L('good_mie'));
  o.push(BG('bg01'));
  o.push(CG('cg_end_mie', '教壇の練習', 'GOOD END・三重編'));
  o.push(BGM('bgm19'));
  o.push(N('三重県臣は、教育学部に進学した。'));
  o.push(N('「人に何かを伝える仕事」に興味を持ったのは、あの日、寺地が読み上げた言葉が、\n自分でも驚くほど胸に残ったからだった。'));
  o.push(S('mie', 9, 'c', '……人に教えるとか、柄じゃないけど。\n柄じゃないことを、柄じゃないままやってみるのも、悪くないなと思って'));
  o.push(CGO());
  o.push(N('空き教室で、教壇に立つ練習をする。\n誰もいない教室に向かって「は？」と言う練習は、しないことにした。向こうから勝手に言ってくるはずだ。'));
  o.push(N('三峰とは、今も連絡を取り合っている。\n「は？」のハモりは、今も健在だ。'));
  o.push(ENDN('good_mie', 'good', '否定の向こう側'));
  o.push(STF());

  /* ---------------- ③ GOOD END・砂糖編 ---------------- */
  o.push(L('good_satou'));
  o.push(BG('bg15'));
  o.push(CG('cg_end_satou', 'フィールドで空を', 'GOOD END・砂糖編'));
  o.push(BGM('bgm19'));
  o.push(N('砂糖東洋は、地質・地理情報系の学科に進んだ。\nフィールド調査先で、堂々と空を見上げている。'));
  o.push(S('satou', 6, 'c', '見てる。今度は、見てないふりしない'));
  o.push(CGO());
  o.push(N('スマートフォンの充電は、今でもよく切れる。\nだが、切れても平気になった。'));
  o.push(ENDN('good_satou', 'good', '見ている、それだけで'));
  o.push(STF());

  /* ---------------- ④ GOOD END・零編 ---------------- */
  o.push(L('good_rei'));
  o.push(BG('bg09'));
  o.push(CG('cg_end_rei', '「大事」という語彙', 'GOOD END・零編'));
  o.push(BGM('bgm19'));
  o.push(N('数理零は、データサイエンス系の研究室に進んだ。\n「面白い」は今も彼の最高の褒め言葉だが、それとは別に、「大事」という言葉も、\n彼の語彙に加わった。'));
  o.push(S('rei', 2, 'c', '面白いことと、大事なこと。両方あるって、最近わかった'));
  o.push(CGO());
  o.push(N('研究室のPCのフォルダ名は、今も「daiji」だった。\n命名規則は、卒業まで変わらなかった。'));
  o.push(ENDN('good_rei', 'good', '面白いを仕事にする'));
  o.push(STF());

  /* ---------------- ⑤ GOOD END・寺地編 ---------------- */
  o.push(L('good_terachi'));
  o.push(BG('bg03'));
  o.push(CG('cg_end_terachi', '紙束は増え続ける', 'GOOD END・寺地編'));
  o.push(BGM('bgm19'));
  o.push(N('本質配信は、今も細々と続いている。\n登録者数は増えたり減ったりしているが、寺地はもう気にしていない。'));
  o.push(S('terachi', 4, 'c', '意味がわからないまま、届け続ける。\nそれでいいって、先生が教えてくれたから'));
  o.push(CGO());
  o.push(N('机の引き出しには、また新しい紙束が増えていた。'));
  o.push(ENDN('good_terachi', 'good', '配信は続く'));
  o.push(STF());

  /* ---------------- ⑥ GOOD END・両馬編 ---------------- */
  o.push(L('good_ryoma'));
  o.push(BG('bg19'));
  o.push(CG('cg_end_ryoma', '墓前の報告・完了', 'GOOD END・両馬編'));
  o.push(BGM('bgm19'));
  o.push(N('両馬二郎は、祖父の墓の前で、変わらず笑っていた。'));
  o.push(S('ryoma', 6, 'c', '爺ちゃん、聞こえてる?\n俺、後輩に引き継いだよ。\n✝本質✝、まだ終わってない'));
  o.push(CGO());
  o.push(N('倉石暁が、その隣で神妙な顔で手を合わせていた。'));
  o.push(ENDN('good_ryoma', 'good', '✝本質✝、その後'));
  o.push(STF());

  /* ---------------- ⑦ GOOD END・伊崎＋伊豆見編 ---------------- */
  o.push(L('good_izaki'));
  o.push(BG('bg05'));
  o.push(CG('cg_end_izaki_izumi', 'それぞれの歩幅', 'GOOD END・伊崎＋伊豆見編'));
  o.push(BGM('bgm19'));
  o.push(N('伊崎と伊豆見は、別々の大学に進んだ。\nそれでも、月に一度は連絡を取り合っている。'));
  o.push(S('izumi', 6, 'cr', '隣にいなくても、離れたわけじゃないんだよな'));
  o.push(S('izaki', 6, 'cl', 'だな'));
  o.push(CGO());
  o.push(N('進路表が貼られていた階段の踊り場は、卒業後も、二人の定点観測地点になり続けている。'));
  o.push(ENDN('good_izaki', 'good', '隣にいた二人、それぞれの歩幅'));
  o.push(STF());

  /* ---------------- ⑧ GOOD END・召野編 ---------------- */
  o.push(L('good_meshino'));
  o.push(BG('bg07'));
  o.push(CG('cg_end_meshino', '言葉を届ける仕事', 'GOOD END・召野編'));
  o.push(BGM('bgm19'));
  o.push(N('召野カイトは、国際系の学部で英語教育を学び始めた。'));
  o.push(N('「伝えたいことを、ちゃんと言葉にする」というテーマを、\n二見先生への片思いから見つけた男だった。'));
  o.push(S('meshino', 6, 'c', '先生の窓の外の話、聞いてよかったです。\n言えなかった「ありがとう」、俺は言えるうちに言いたいので'));
  o.push(CGO());
  o.push(N('その言葉を、いつか誰かに教える側になるかもしれない男は、\n完了という言葉を、始まりの意味でも使えるようになっていた。'));
  o.push(ENDN('good_meshino', 'good', '言葉を届ける'));
  o.push(STF());

  /* ---------------- ⑨ GOOD END・倉石編 ---------------- */
  o.push(L('good_kuraishi'));
  o.push(BG('bg10'));
  o.push(CG('cg_end_kuraishi', '年鑑、託す', 'GOOD END・倉石編'));
  o.push(BGM('bgm19'));
  o.push(N('倉石暁は、✝本質✝年鑑を完結させなかった。\n完結させたら✝本質✝ではなくなる――それが、彼の三年間の結論だった。'));
  o.push(N('年鑑は、後輩に託された。'));
  o.push(S('kuraishi', 5, 'c', '先輩方の代の記録は、ここまでです。\nあとは、これを読む誰かが、続きを書いてください'));
  o.push(CGO());
  o.push(N('託された年鑑の最終ページには、五段階モデルが、小さく添えられていた。\n完結はしていない。生きている。'));
  o.push(ENDN('good_kuraishi', 'good', '年鑑、完結せず'));
  o.push(STF());

  /* ---------------- ⑩ GOOD END・南棟編 ---------------- */
  o.push(L('good_minamitou'));
  o.push(BG('bg16'));
  o.push(CG('cg_end_minamitou', '境界のない春', 'GOOD END・南棟編'));
  o.push(BGM('bgm19'));
  o.push(N('櫻優と内藤蘭は、まだ理論通りには進んでいない。\nそれでも、二人でいる時間は、確実に増えていた。'));
  o.push(S('sakura', 6, 'cr', '恋愛発生の法則、また一つ、書き換えないといけないかもしれません'));
  o.push(S('naitou', 6, 'cr', '書き換えなくていいですよ、そんなの'));
  o.push(CGO());
  o.push(N('三峰瑠衣は、今では理数科の教室に出入りする「公認」のような存在になっていた。'));
  o.push(N('国境は消えない。消えなくても、通れる。それで十分だった。'));
  o.push(ENDN('good_minamitou', 'good', '境界のない春'));
  o.push(STF());

  /* ---------------- ⑪ NORMAL END ---------------- */
  o.push(L('end_normal'));
  o.push(BG('bg03'));
  o.push(CG('cg_end_normal', 'いつも通りの桜', 'NORMAL END'));
  o.push(BGM('bgm20'));
  o.push(N('勝也は、あの日、全てを語ったわけではなかった。'));
  o.push(S('katsuya', 2, 'cr', 'ありがとう。……でも、この話は、また今度な'));
  o.push(N('――そう言って、彼は静かに教室を出ていった。'));
  o.push(S('katsuya', 2, 'cr', '地図は、まだ途中だ。\n全部見せたら、面白くないだろう'));
  o.push(CGO());
  o.push(N('それでも、十分だった。'));
  o.push(N('わからないことが全部わかる必要はない。\n見えないけど、ある。\nそれだけで、この三年間は報われた。'));
  o.push(ENDN('end_normal', 'normal', '見えないけど、ある'));
  o.push(STF());

  /* ---------------- ⑫ BITTERSWEET END ---------------- */
  o.push(L('end_bittersweet'));
  o.push(BG('bg04'));
  o.push(CG('cg_end_bittersweet', 'こぼれた地図', 'BITTERSWEET END'));
  o.push(BGM('bgm21'));
  o.push(N('準備は、間に合わなかった。'));
  o.push(N('地図は未完成のまま、慌ただしく丸められて勝也に渡された。\n段取りは崩れ、伝えたかった言葉の半分も、伝えられなかった。'));
  o.push(S('mie', 4, 'cl', '……ぐだぐだになったな'));
  o.push(S('ryoma', 8, 'cr', 'ぐだぐだでも、渡せただけマシだろ'));
  o.push(CGO());
  o.push(N('勝也は、こぼれ落ちた地図の切れ端を一枚だけ拾い上げ、笑った。'));
  o.push(S('katsuya', 2, 'cr', '……十分だ。\n完璧な地図より、こぼれた地図の方が、らしくていい'));
  o.push(N('うまくはいかなかった。\nそれでも、小さな灯りは、確かに残った。'));
  o.push(ENDN('end_bittersweet', 'bitter', 'こぼれた地図'));
  o.push(STF());

  /* ---------------- ⑬ COMEDY SECRET END ---------------- */
  o.push(L('end_comedy'));
  o.push(BG('bg01'));
  o.push(CG('cg_end_comedy', '原✝本質✝、完全体', 'COMEDY SECRET END'));
  o.push(BGM('bgm22'));
  o.push(N('倉石の「グレートチェーン理論」が、なぜか完成してしまった。'));
  o.push(N('前-原✝本質✝、原✝本質✝、✝本質✝、亜✝本質✝、非✝本質✝――\n五段階モデルを、勝也まで巻き込んで検証する羽目になる。'));
  o.push(SP('katsuya', 6, 'cr'));
  o.push(S('katsuya', 6, 'cr', '……つまり、俺が窓の外を見てるのは、\n前-原✝本質✝の顕現だと言いたいのか'));
  o.push(SP('kuraishi', 1, 'c'));
  o.push(S('kuraishi', 1, 'c', 'その通りです!!'));
  o.push(SP('mie', 2, 'cl'));
  o.push(S('mie', 2, 'cl', '先生まで巻き込むな!'));
  o.push(CGO());
  o.push(SP('katsuya', 10, 'cr'));
  o.push(S('katsuya', 10, 'cr', '……本質、かもな'));
  o.push(S('mie', 2, 'cl', '先生まで言うな!!'));
  o.push(N('大真面目にふざけ続けた者だけが、たどり着く結末。\nそれもまた、一つの✝本質✝である。'));
  o.push(ENDN('end_comedy', 'comedy', '原✝本質✝、完全体'));
  o.push(STF());

  g.__SCRIPT_PARTS.push(o);
})(typeof window !== 'undefined' ? window : globalThis);
