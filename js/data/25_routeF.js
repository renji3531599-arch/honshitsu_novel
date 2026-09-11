/* ============================================================
   【F】召野＋倉石編「調査と応援」
   ============================================================ */
(function (g) {
  'use strict';
  const K = g.KIT;
  const o = [];
  const L = K.L, BG = K.BG, CG = K.CG, CGO = K.CGO, CH = K.CH, BGM = K.BGM, SE = K.SE,
        N = K.N, SP = K.SP, S = K.S, T = K.T, HI = K.HI, PT = K.PT, FL = K.FL, JK = K.JK,
        DI = K.DI, IT = K.IT, SC = K.SC, CHO = K.CHO, JP = K.JP, IF = K.IF, HD = K.HD;

  o.push(L('route_F'));
  o.push(SC('route_F'));
  o.push(CH('ルートF', '召野＋倉石編　「調査と応援」', '召野カイト・倉石暁　―　聞き込みと発掘'));
  o.push(BG('bg07'));
  o.push(BGM('bgm12'));
  o.push(N('召野カイトは、二見先生に探りを入れる役目を買って出た。'));
  o.push(N('かつて彼女に恋をして、完了させた男だからこそ、\n変に気負わずに話しかけられる相手だった。'));

  /* F-1 */
  o.push(SC('F-1'));
  o.push(SP('meshino', 4, 'cl'));
  o.push(S('meshino', 4, 'cl', '二見先生。ちょっと聞いていいですか'));
  o.push(SP('futami', 1, 'cr'));
  o.push(S('futami', 1, 'cr', 'なあに、改まって'));
  o.push(S('meshino', 4, 'cl', '塀先生って、昔から窓の外を見る人でした?'));
  o.push(N('二見の表情が、一瞬だけ変わった。'));
  o.push(CG('cg_16', '職員室の光', '召野／二見　―　窓越しの距離感'));
  o.push(SP('futami', 5, 'cr'));
  o.push(S('futami', 5, 'cr', '……知ってるわよ、少しだけ'));
  o.push(S('meshino', 4, 'cl', '教えてもらえますか'));
  o.push(S('futami', 5, 'cr', 'ごめんね。それは、私の口から言うことじゃない気がする'));

  o.push(CHO([
    { label: '「わかりました」とすぐに引き下がる', heart: 2, flag: 'MESHINO_KURAISHI', flagv: 1, then: [
      SP('meshino', 4, 'cl'),
      S('meshino', 4, 'cl', '……わかりました。それ以上は聞きません'),
      SP('futami', 2, 'cr'),
      S('futami', 2, 'cr', '……えらいわね。その察しの良さ、昔から変わってないのね'),
      S('meshino', 3, 'cl', '片思いで鍛えられましたから'),
      S('futami', 4, 'cr', '何の鍛え方よそれ')
    ]},
    { label: '「少しだけでもヒントを」と食い下がる', heart: 1, flag: 'MESHINO_KURAISHI', flagv: 1, then: [
      SP('meshino', 4, 'cl'),
      S('meshino', 4, 'cl', '少しだけでも。ヒントだけでいいんです'),
      SP('futami', 3, 'cr'),
      S('futami', 3, 'cr', '……困った子ね。先生はね、「聞いてもらえる側」に慣れてない人なの。だから、私は余計なことは言えない'),
      S('meshino', 6, 'cl', '……なるほど。「語りたい人」じゃなくて「聞いてもらえるのを待ってる人」……')
    ]}
  ]));

  /* F-2 */
  o.push(SC('F-2'));
  o.push(CH('SCENE F-2', '二見の後押し', '待つことに慣れてる人'));
  o.push(SP('futami', 4, 'cr'));
  o.push(S('futami', 4, 'cr', 'でもね、本人から聞いてもらえたら、あの人、きっと嬉しいと思うわよ'));
  o.push(S('meshino', 4, 'cl', '嬉しい、ですか。あの塀先生が'));
  o.push(S('futami', 5, 'cr', '地図を三年間、同じものを見せ続ける先生よ。\n待つことに慣れてる人。\n誰かが自分から聞きに来てくれるのを、実はずっと待ってるタイプだと思う'));
  o.push(FL('MESHINO_KURAISHI', 1));
  o.push(PT(2));
  o.push(S('meshino', 6, 'cl', '……そういうところ、二見先生とちょっと似てますね'));
  o.push(S('futami', 4, 'cr', 'あら、それは褒めてるの?'));
  o.push(S('meshino', 5, 'cl', '褒めてます。俺、そういう「待ってる人」に片思いする才能あるんで'));
  o.push(S('futami', 4, 'cr', '……もう、その話終わったでしょ'));
  o.push(S('meshino', 5, 'cl', '終わってます。完了してます。\n今は普通に、先生の後押しをもらいに来ただけです'));
  o.push(CGO());
  o.push(HI('all'));

  /* F-3 書庫 */
  o.push(SC('F-3'));
  o.push(CH('SCENE F-3', '書庫', '埃のかぶった紙面'));
  o.push(BG('bg10'));
  o.push(CG('cg_14', '書庫の記録', '倉石（単独）　―　言葉を失う横顔'));
  o.push(N('一方、倉石は図書室の奥の書庫で、埃をかぶった学校新聞の縮刷版を漁っていた。'));
  o.push(N('✝本質✝年鑑の「歴史的裏付け」を取るという名目だったが、\n彼の勘はいつも妙なところで当たる。'));
  o.push(SP('kuraishi', 3, 'c'));
  o.push(S('kuraishi', 3, 'c', '……ありました'));
  o.push(N('古い紙面の隅、地学部の活動記録。\n指導にあたった外部講師の名前として、「稲葉悌二」の文字。'));
  o.push(N('そして、その翌年の紙面には、小さな追悼記事があった。'));
  o.push(SP('kuraishi', 6, 'c'));
  o.push(S('kuraishi', 6, 'c', '……これ。茶化していい話じゃないですね'));
  o.push(N('✝も、聖句も、原✝本質✝も、この瞬間の倉石の口からは出てこなかった。\n彼が初めて、自分の言葉だけで喋った瞬間だった。'));
  o.push(CGO());
  o.push(IT('ui_08', '古い学校新聞（追悼記事）'));

  /* F-3.5 茶化し分岐（COMEDY SECRET END 用） */
  o.push(N('倉石は報告の前に、ひとつだけ未整理の記録があった。\n地学部の活動記録の端に、「グレート・チェーン」なる謎の語句が、誰かの書き込みで斜めに走っている。\n明らかに、✝の系譜を妄信する何者かの筆跡だった。'));
  o.push(CHO([
    { label: '真剣に受け止める。「その記録、確かだな」', heart: 1, side: 'kuraishi', then: [
      SP('kuraishi', 5, 'c'),
      S('kuraishi', 5, 'c', 'はい。当時から地学部には「見えないものを数える」文化があったようです。僕らの先達です'),
      N('倉石は誇らしげに頷いた。\n先達、という言葉の重さを、彼はいま初めて抱えた。')
    ]},
    { label: '「グレートチェーン理論ってなんだ？　今すぐ解説しろ」', heart: -1, joke: 1, side: 'kuraishi', then: [
      SP('kuraishi', 1, 'c'),
      S('kuraishi', 1, 'c', '聞いていただけて嬉しいです!!\n前-原✝本質✝、原✝本質✝、✝本質✝、亜✝本質✝、非✝本質✝――五段階モデルの原型が、あの書き込みなんです!!'),
      SP('mie', 2, 'cr'),
      S('mie', 2, 'cr', '今それ聞いてる場合か。追悼記事の話に戻れ'),
      S('kuraishi', 1, 'c', 'すみません、熱くなりました。記録は✝本質✝の義務です'),
      N('倉石は笑顔で謝った。\nけれど五段階モデルは、彼のノートのどこかに、静かに生き残った。')
    ]}
  ]));

  /* F-4 報告 */
  o.push(SC('F-4'));
  o.push(CH('SCENE F-4', '報告', '一同、息を呑む'));
  o.push(BG('bg01'));
  o.push(CG('cg_15', '報告', '倉石／両馬／三重　―　息を呑む一同'));
  o.push(SP('kuraishi', 3, 'c'));
  o.push(S('kuraishi', 3, 'c', '先輩方。塀先生は、桐葉高校のOBです。\n理数科の卒業生で、当時の地学部の外部講師が、稲葉悌二という方でした'));
  o.push(SP('mie', 3, 'cl'));
  o.push(S('mie', 3, 'cl', '……卒業生だったのか、あの人'));
  o.push(S('kuraishi', 3, 'c', 'はい。そして稲葉先生は、塀先生が卒業した翌年、事故で亡くなっています'));
  o.push(N('一同が息を呑む。'));
  o.push(SP('ryoma', 4, 'cr'));
  o.push(S('ryoma', 4, 'cr', '……それだけじゃ、まだ何も分かってないのと同じだな'));
  o.push(S('kuraishi', 3, 'c', 'はい。でも、少なくとも――知らずに卒業するのだけは、避けられそうです'));
  o.push(CGO());
  o.push(FL('MESHINO_KURAISHI', 2));
  o.push(PT(2));

  /* 軽い選択肢 */
  o.push(SC('F-5'));
  o.push(N('報告のあと。召野が、ぽつりと言った。'));
  o.push(SP('meshino', 6, 'cr'));
  o.push(S('meshino', 6, 'cr', '……先生、待ってたんだと思いますよ。\n聞いてもらえるのを、三年間じゃなくて、もっと前から'));
  o.push(SP('mie', 4, 'cl'));
  o.push(S('mie', 4, 'cl', 'もっと前、って'));
  o.push(S('meshino', 6, 'cr', '卒業して、戻ってきて、教壇に立って。\nその間ずっと、誰も聞かなかった。\n待つ人間ってのは、待った分だけ、聞いてもらったときの顔がいいんですよ。実経験です'));
  o.push(CHO([
    { label: '「その実経験、先生に話したのか？」', heart: 1, side: 'meshino', then: [
      SP('meshino', 3, 'cr'),
      S('meshino', 3, 'cr', '……話せませんよ。柄じゃない'),
      S('meshino', 6, 'cr', 'でも、先生に聞く側に回る。それなら、まだ俺にもできます。完了してる男は、次の一歩が早いんです'),
      SP('mie', 4, 'cl'),
      T('mie', 4, 'cl', '（完了って言葉、あいつの中でいい方向に進化してるな）')
    ]},
    { label: '「いい話だと思った？　自慢か？」', heart: -2, side: 'meshino', then: [
      SP('meshino', 5, 'cr'),
      S('meshino', 5, 'cr', '自慢です。誇り高い片思いでしたから'),
      SP('mie', 2, 'cl'),
      S('mie', 2, 'cl', '自慢するなよ'),
      N('召野は悪びれなかった。\n彼の片思いは完了済みで、今はもう、ただの過去形の誇りだった。')
    ]}
  ]));

  o.push(N('稲葉悌二。\nその名前は、この日から、全員の共通言語になった。\n知らない人間の名前なのに、なぜか全員が、その名前を大切に運ぶようになっていた。'));
  o.push(HI('all'));
  o.push(HD('F'));
  o.push(N('――召野＋倉石編「調査と応援」　了'));
  o.push(JP('hub_loop'));

  g.__SCRIPT_PARTS.push(o);
})(typeof window !== 'undefined' ? window : globalThis);
