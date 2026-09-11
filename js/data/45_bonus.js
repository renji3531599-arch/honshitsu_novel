/* ============================================================
   【BONUS EXTRA】「また、この教室で」
   全エンディング回収後、タイトルの隠し道から到達
   ============================================================ */
(function (g) {
  'use strict';
  const K = g.KIT;
  const o = [];
  const L = K.L, BG = K.BG, CG = K.CG, CGO = K.CGO, CH = K.CH, BGM = K.BGM, SE = K.SE,
        N = K.N, SP = K.SP, S = K.S, T = K.T, HI = K.HI, PT = K.PT,
        DI = K.DI, SC = K.SC, ENDN = K.ENDN, STF = K.STF, TT = K.TT;

  o.push(L('bonus_start'));
  o.push(SC('BONUS'));
  o.push(CH('BONUS EXTRA', 'また、この教室で', '数年後の夏・翠湖のほとり'));
  o.push(BG('bg11'));
  o.push(CG('cg_end_bonus', '翠湖のほとり', 'BONUS EXTRA'));
  o.push(BGM('bgm23'));
  o.push(SE('sakura'));
  o.push(N('数年後の夏。翠湖のほとりに、理数科三年B組だった面々が、久しぶりに顔を揃えた。'));
  o.push(N('北棟組も、南棟組も。三峰も、櫻も、内藤も。'));
  o.push(CGO());
  o.push(SP('katsuya', 2, 'cl'));
  o.push(S('katsuya', 2, 'cl', '呼ばれたから来たが……お前ら、まだ✝本質✝とか言ってるのか'));
  o.push(SP('ryoma', 2, 'cr'));
  o.push(S('ryoma', 2, 'cr', '言ってますよ。一生言います'));
  o.push(SP('mie', 9, 'c'));
  o.push(S('mie', 9, 'c', '一生は長すぎるだろ'));
  o.push(S('ryoma', 2, 'cr', '長くない。✝本質✝に終わりはないんだよ'));
  o.push(S('mie', 2, 'c', 'は？'));
  o.push(N('何年経っても、変わらないものがある。'));
  o.push(N('変わらないことが、こんなにも嬉しいと思える日が来るとは、\n誰も思っていなかった。'));
  o.push(CGO());
  o.push(SP('katsuya', 10, 'cl'));
  o.push(S('katsuya', 10, 'cl', '……そうか。まだ、続いてるのか'));
  o.push(N('地面は、忘れない。\n忘れない誰かが、いつまでもそこにいる。'));
  o.push(HI('all'));
  o.push(ENDN('end_bonus', 'bonus', 'また、この教室で'));
  o.push(STF());

  g.__SCRIPT_PARTS.push(o);
})(typeof window !== 'undefined' ? window : globalThis);
