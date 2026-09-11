/* ============================================================
   【E】南棟編「境界線の向こう側」
   ============================================================ */
(function (g) {
  'use strict';
  const K = g.KIT;
  const o = [];
  const L = K.L, BG = K.BG, CG = K.CG, CGO = K.CGO, CH = K.CH, BGM = K.BGM, SE = K.SE,
        N = K.N, SP = K.SP, S = K.S, T = K.T, HI = K.HI, PT = K.PT, FL = K.FL,
        DI = K.DI, IT = K.IT, SC = K.SC, CHO = K.CHO, JP = K.JP, IF = K.IF, HD = K.HD;

  o.push(L('route_E'));
  o.push(SC('route_E'));
  o.push(CH('ルートE', '南棟編　「境界線の向こう側」', '三峰瑠衣・櫻優・内藤蘭　―　紺のネクタイの側から'));
  o.push(BG('bg16'));
  o.push(BGM('bgm11'));
  o.push(N('南棟と北棟をつなぐ桜並木。桜は、まだ蕾だった。\n国境の真ん中に、蕾がある。')); 

  /* E-1 */
  o.push(SC('E-1'));
  o.push(CG('cg_17', '境界を歩く', '三重／三峰　―　まだ蕾の桜並木'));
  o.push(N('三重は、南棟の三峰瑠衣に連絡を取った。\n彼女となら、国境を越えるのも気安い。'));
  o.push(SP('mitsumine', 2, 'cr'));
  o.push(S('mitsumine', 2, 'cr', 'あんたが北棟から出向いてくるの、珍しいじゃん'));
  o.push(SP('mie', 1, 'cl'));
  o.push(S('mie', 1, 'cl', '頼みがある。ヘイカツの……いや、うちの地理の先生のことで'));
  o.push(N('事情を話すと、三峰は驚いた顔をしたあと、すぐに真剣な顔になった。'));
  o.push(S('mitsumine', 1, 'cr', '櫻と内藤さんも呼ぶよ。\nあの合同課題のとき、あんたたちの班、うちの学校の生徒にも影響与えてたし'));
  o.push(CGO());

  /* E-2 */
  o.push(SC('E-2'));
  o.push(CH('SCENE E-2', '南棟三年教室', '偏差値70の側で'));
  o.push(BG('bg18'));
  o.push(CG('cg_18', '南棟の決断', '三重／三峰／櫻／内藤　―　えんじと紺'));
  o.push(SP('sakura', 2, 'cr'));
  o.push(S('sakura', 2, 'cr', '地理の先生、ですか。\n私、一度も授業を受けたことがないので詳しくは知りませんが……'));
  o.push(SP('naitou', 1, 'r'));
  o.push(S('naitou', 1, 'r', '……あの、地理の先生って、塀先生のことですよね'));
  o.push(S('mie', 2, 'cl', '知ってんの?'));
  o.push(SP('naitou', 2, 'r'));
  o.push(S('naitou', 2, 'r', '知ってるというか……本質配信、ずっと見てるので。\nよく名前が出てくるから'));
  o.push(DI('haishin'));

  o.push(CHO([
    { label: '「見ててくれたのか」と素直に驚く', heart: 2, flag: 'MINAMITOU', flagv: 2, sincere: 1, then: [
      SP('mie', 3, 'cl'),
      S('mie', 3, 'cl', '……見ててくれたのか。うちのクラスの馬鹿げた配信を'),
      SP('naitou', 5, 'r'),
      S('naitou', 5, 'r', '馬鹿げてなんていないです。あの配信は、意味を探し続けてくれる配信です'),
      N('南棟の教室で、「馬鹿げた」を「意味を探し続けてくれる」に訂正された。\n国境の向こう側の正しさは、少し温度が違った。')
    ]},
    { label: '「意味わかんない配信、よく見てるな」と茶化す', heart: 1, flag: 'MINAMITOU', flagv: 1, then: [
      SP('mie', 2, 'cl'),
      S('mie', 2, 'cl', '……意味わかんない配信、よく見てるな'),
      SP('naitou', 2, 'r'),
      S('naitou', 2, 'r', '……ふふ。そうですね。意味わかんないです'),
      N('内藤は少し寂しそうな顔をしたあと、笑って流した。\n笑って流す技術というのは、一学年上でも、境界の向こうでも、同じように使われる。')
    ]}
  ]));

  /* E-3 */
  o.push(SC('E-3'));
  o.push(CH('SCENE E-3', '決意', 'わからないまま、届いているもの'));
  o.push(CG('cg_19', 'ずっと見てました', '内藤（単独）　―　伏し目から顔を上げる一瞬'));
  o.push(SP('naitou', 5, 'r'));
  o.push(S('naitou', 5, 'r', '意味は、わからないままでいいと思ってます。\nわからないまま、ちゃんと届いてるものってあるので'));
  o.push(S('mie', 4, 'cl', '……お前、いいこと言うな'));
  o.push(S('naitou', 5, 'r', 'そうですか? ……よかったら、私にも手伝わせてください'));
  o.push(CGO());
  o.push(SP('mitsumine', 3, 'cl'));
  o.push(S('mitsumine', 3, 'cl', 'あたしも手伝う。理数科の人たちのこと、もう他人事じゃないし'));
  o.push(SP('sakura', 5, 'cr'));
  o.push(S('sakura', 5, 'cr', '私も。恋愛学の研究とは違いますが……\n人と人が繋がる構造として、非常に興味深い事案です'));
  o.push(S('mie', 2, 'cl', '事案って言うな'));
  o.push(S('sakura', 5, 'cr', 'すみません、癖です'));
  o.push(FL('MINAMITOU', 2));
  o.push(PT(2));
  o.push(N('北棟だけの話だったものが、この日、初めて南棟にも広がった。'));
  o.push(N('国境は消えていない。\nけれど、その上を渡る人間は、確かに増えていた。'));
  o.push(HI('all'));

  /* 軽い選択肢：三重×三峰の「は？」ハモり */
  o.push(SC('E-4'));
  o.push(BG('bg16'));
  o.push(N('帰り道、桜並木。蕾の下で、三峰が足を止めた。'));
  o.push(CG('cg_17', '境界を歩く', '三重／三峰　―　蕾の下で'));
  o.push(SP('mitsumine', 2, 'cl'));
  o.push(S('mitsumine', 2, 'cl', 'ねえ。一つ確認しておくけどさ'));
  o.push(S('mie', 1, 'cr', 'なんだよ'));
  o.push(S('mitsumine', 2, 'cl', 'あんた、先生のこと「ちゃんと知る」って言ったけど――\nそれは、あんたの三年間の「は？」に対する返事なんだよね'));
  o.push(S('mie', 4, 'cr', 'は？'));
  o.push(CG('cg_17', '境界を歩く', '「は？」のハモり'));
  o.push(SP('mitsumine', 6, 'cl'));
  o.push(S('mitsumine', 6, 'cl', 'は？'));
  o.push(N('三重と三峰は、五秒間黙った。それから同時に空間を見た。\n✝本質✝的な空気に対して。'));
  o.push(CGO());
  o.push(CHO([
    { label: '「……そうだよ。三年分の『は？』の返事だ」', heart: 2, flag: 'MINAMITOU', flagv: 1, then: [
      SP('mie', 4, 'cr'),
      S('mie', 4, 'cr', '……そうだよ。三年分の「は？」の返事だ。\n聞かなかった三年間を、最後の一ヶ月で返す。釣り合わないのはわかってる'),
      SP('mitsumine', 5, 'cl'),
      S('mitsumine', 5, 'cl', '……釣り合わなくても、返すって決めたなら、あたしらは足止めしないよ。\n行こう。南棟も、ちゃんと載せる地図にするから'),
      N('えんじのネクタイと、紺のネクタイが、蕾の下で同じ方向を見た。\n国境の上を渡る人間が、また一人増えた。')
    ]},
    { label: '「深読みするな。力仕事の手伝いだよ」', heart: -1, then: [
      SP('mitsumine', 4, 'cl'),
      S('mitsumine', 4, 'cl', '……はいはい。力仕事ね。南棟の演武場まで運ぶ力仕事、期待してるよ'),
      N('三峰は追撃しなかった。\n代わりに、蕾を一つだけ指で軽く弾いて、先に歩き出した。')
    ]}
  ]));

  o.push(HI('all'));
  o.push(HD('E'));
  o.push(N('――南棟編「境界線の向こう側」　了'));
  o.push(JP('hub_loop'));

  g.__SCRIPT_PARTS.push(o);
})(typeof window !== 'undefined' ? window : globalThis);
