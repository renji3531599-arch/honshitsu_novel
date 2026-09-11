/* ============================================================
   スクリプト・データ部 共通ビルダ ＋ プロローグ／第一章／HUB導入
   ============================================================ */
(function (g) {
  'use strict';
  g.__SCRIPT_PARTS = g.__SCRIPT_PARTS || [];

  /* --- ノード生成ヘルパ --- */
  const L   = function (name)                 { return { t: 'label', name: name }; };
  const BG  = function (id)                   { return { t: 'bg', id: id }; };
  const CG  = function (id, title, cap)       { return { t: 'cg', id: id, title: title, cap: cap }; };
  const CGO = function ()                     { return { t: 'cgoff' }; };
  const CH  = function (num, title, sub)      { return { t: 'chapter', num: num, title: title, sub: sub }; };
  const BGM = function (id)                   { return { t: 'bgm', id: id }; };
  const SE  = function (id)                   { return { t: 'se', id: id }; };
  const N   = function (text)                 { return { t: 'n', text: text }; };
  const SP  = function (who, exp, pos)        { return { t: 'sprite', who: who, exp: exp, pos: pos || 'c' }; };
  const S   = function (who, exp, pos, text)  { return { t: 'say', who: who, exp: exp, pos: pos, text: text }; };
  const T   = function (who, exp, pos, text)  { return { t: 'think', who: who, exp: exp, pos: pos, text: text }; };
  const HI  = function (who)                  { return { t: 'hide', who: who }; };
  const PT  = function (v)                    { return { t: 'point', v: v }; };
  const FL  = function (k, v)                 { return { t: 'flag', k: k, v: v }; };
  const JK  = function ()                     { return { t: 'joke', v: 1 }; };
  const DI  = function (key)                  { return { t: 'dict', key: key }; };
  const IT  = function (id, name)             { return { t: 'item', id: id, name: name }; };
  const SC  = function (name)                 { return { t: 'scene', name: name }; };
  const CHO = function (opts)                 { return { t: 'choice', opts: opts }; };
  const JP  = function (to)                   { return { t: 'jump', to: to }; };
  const IF  = function (cond, then, els)      { return { t: 'if', cond: cond, then: then, else: els || [] }; };
  const BD  = function (title, posts)         { return { t: 'board', title: title, posts: posts }; };
  const HUB = function ()                     { return { t: 'hub' }; };
  const ENDN= function (id, kind, title)      { return { t: 'end', id: id, kind: kind, title: title }; };
  const STF = function ()                     { return { t: 'staffroll' }; };
  const TT  = function ()                     { return { t: 'to_title' }; };
  const HD  = function (k)                    { return { t: 'hub_done', k: k }; };

  g.KIT = { L: L, BG: BG, CG: CG, CGO: CGO, CH: CH, BGM: BGM, SE: SE, N: N, SP: SP, S: S, T: T, HI: HI,
            PT: PT, FL: FL, JK: JK, DI: DI, IT: IT, SC: SC, CHO: CHO, JP: JP, IF: IF, BD: BD, HUB: HUB,
            ENDN: ENDN, STF: STF, TT: TT, HD: HD };

  /* ============================================================
     本編開始
     ============================================================ */
  const o = [];

  /* ---------------- OP ---------------- */
  o.push(L('op'));
  o.push(BGM('bgm01'));
  o.push(CH('― 卒業まで、あと一ヶ月 ―', 'まだ地図の途中で', '〜✝本質✝特別編〜'));

  /* SCENE 001 */
  o.push(SC('SCENE001'));
  o.push(BG('bg17'));
  o.push(SE('sakura'));
  o.push(N('桐葉高校には、今も見えない国境がある。\n南棟と北棟。偏差値十の差。紺のネクタイと、えんじのネクタイ。'));
  o.push(N('三年経っても、その線引きは消えない。'));
  o.push(N('消えないものと、消えていくものがある。\n北棟理数科三年B組にとって、消えていくものの筆頭は――自分たちがこの教室にいられる時間そのものだった。'));
  o.push(DI('heikatsu'));
  o.push(DI('honsitsu'));

  /* SCENE 002 三年間ダイジェスト */
  o.push(SC('SCENE002'));
  o.push(N('――一年目。'));
  o.push(BG('bg01'));
  o.push(N('両馬二郎が「✝本質✝」という言葉をこの世に解き放った。\n二郎系ラーメンの脂にも、電線にも、コーンスープの不在にすら、彼はそれを見出した。'));
  o.push(DI('cornsoup'));
  o.push(N('三重県臣は「は？」と言い続けた。\n言い続けながら、誰よりも近くで聞いていた。'));
  o.push(BG('bg11'));
  o.push(N('寺地星は登録者百五十人の配信で、紙に書いた言葉を読み上げ、意味を探した。\n意味は最後まで見つからなかったが、続けることをやめなかった。'));
  o.push(DI('haishin'));
  o.push(BG('bg20'));
  o.push(N('砂糖東洋は窓の外を見ていないと言い張り、零は「面白い」とだけ言った。'));
  o.push(N('伊崎と伊豆見は少しずつ距離を変え、召野は人妻に恋をして完了し、倉石という名の後輩がその全てを記録し始めた。'));
  o.push(DI('renai'));
  o.push(BG('bg13'));
  o.push(N('そして、地理教師・塀勝也は、三年間、同じ地図を見せ続けた。'));
  o.push(N('一年目は「同じに見えるか」と聞き、誰も答えなかった。\n三年目のその同じ問いに、今度は誰かが手を挙げた。'));
  o.push(N('何も劇的なことは起きなかった。\nそれでも、確かに何かが変わった三年間だった。'));
  o.push(SE('bell'));
  o.push(N('けれど、これは「三年間の話」ではない。'));
  o.push(N('これは、その三年間が終わる直前――誰も気づかないまま通り過ぎるはずだった、たった一つの秘密に、生徒たちがうっかり触れてしまった話だ。'));

  /* ---------------- 第一章 ---------------- */
  o.push(CH('第一章', '差出人不明の写真', '二月　期末考査終了　卒業式まで三十一日'));
  o.push(SC('SCENE003'));
  o.push(BG('bg02'));
  o.push(BGM('bgm02'));
  o.push(N('二月。期末考査は終わり、卒業式まで残り一ヶ月を切っていた。\n理数科三年B組の空気は、相変わらずだった。'));

  o.push(SP('ryoma', 2, 'cl'));
  o.push(S('ryoma', 2, 'cl', '見ろ。フェイカツの最新書き込み、伸びてる'));
  o.push(SP('mie', 2, 'cr'));
  o.push(S('mie', 2, 'cr', 'まだやってんのか、それ'));
  o.push(S('ryoma', 1, 'cl', '卒業までは辞められない。伝統だから'));
  o.push(S('mie', 1, 'cr', '三年しか続いてない伝統に、伝統って言葉使うな'));
  o.push(DI('feikatsu'));

  o.push(BD('【受験情報掲示板】合格祈願スレ', [
    { num: '412', name: '名無しの受験生', date: '02/10', body: '来週ついに桐葉高校の前期試験！　絶対合格して、みえみえしい高校生活を送るんだ！✝' },
    { num: '413', name: '名無しの受験生', date: '02/10', body: '>>412 誰だお前:last_weekも同じ書き込みしてたの' },
    { num: '414', name: '名無しの受験生', date: '02/11', body: 'ヘイカツ先生に会いに絶対合格するぞ！地理の✝本質✝を学ぶために！✝' },
    { num: '415', name: '名無しの受験生', date: '02/11', body: '>>414 その先生誰だよｗｗ 塾の講師？' },
    { num: '416', name: '名無しの受験生', date: '02/11', body: '>>415 地図を見て感動できる大人、だってさ。ガチで存在的にわからん' }
  ]));

  o.push(S('ryoma', 2, 'cl', '「みえみえしい高校生活」の伸びがやばい。今年の受験生、いい素質してる'));
  o.push(S('mie', 6, 'cr', '俺の名前で育つな'));
  o.push(SP('kuraishi', 1, 'r'));
  o.push(S('kuraishi', 1, 'r', '先輩方。✝本質✝年鑑、三年生編の追い込みに入りました。卒業までに完成させます'));
  o.push(S('mie', 1, 'cr', '完成させるな。お前が去年言ってただろ、完結させたら✝本質✝じゃなくなるって'));
  o.push(S('kuraishi', 1, 'r', '言いました。でも今回は「未完成のまま卒業する」という完成形を目指しています'));
  o.push(S('mie', 2, 'cr', '言い訳の質が上がってて逆に腹立つ'));
  o.push(HI('kuraishi'));
  o.push(SP('satou', 1, 'r'));
  o.push(S('satou', 1, 'r', '（ゲームをしながら）……あと一ヶ月か'));
  o.push(HI('satou'));
  o.push(SP('izaki', 1, 'cr'));
  o.push(S('izaki', 1, 'cr', '早いよな。理数科、来年からもう俺たちの代がいないんだと思うと変な感じだ'));
  o.push(HI('izaki'));
  o.push(SP('izumi', 2, 'r'));
  o.push(S('izumi', 2, 'r', '変な感じ、って言い方、伊崎っぽいな'));
  o.push(S('izaki', 1, 'cr', '悪いか'));
  o.push(S('izumi', 2, 'r', '悪くない。俺も同じこと思ってた'));
  o.push(HI('izumi'));
  o.push(HI('ryoma')); o.push(HI('mie'));

  o.push(N('昼休みのチャイムが鳴る少し前、地理準備室から勝也が顔を出した。\n手には、見慣れた地図の収納筒。'));
  o.push(DI('madogoso'));
  o.push(SP('katsuya', 1, 'cr'));
  o.push(S('katsuya', 1, 'cr', '三重、ちょっといいか'));
  o.push(SP('mie', 2, 'cl'));
  o.push(S('mie', 2, 'cl', 'は？　俺すか'));
  o.push(S('katsuya', 1, 'cr', '保管庫まで、これを運ぶのを手伝ってほしい。重いわけじゃないが、数が多い'));
  o.push(S('mie', 1, 'cl', '……別にいいですけど'));
  o.push(SP('ryoma', 4, 'r'));
  o.push(S('ryoma', 4, 'r', '（小声で）三重、ヘイカツと二人きりになれるチャンスだぞ。\n何か✝本質✝的なもの、持ち帰ってこい'));
  o.push(S('mie', 6, 'cl', '持ち帰らねえよ。ただの力仕事だろ'));
  o.push(CG('cg_01', '呼び止められた朝', '三重／勝也の声　―　教室の入口'));
  o.push(N('三重は半歩、引いた位置で立ち止まった。\n警戒と好奇心が、混ざった顔だった。混ざり方は、まだ自分でも整理できていない。'));
  o.push(CGO());
  o.push(HI('all'));

  /* SCENE 004 地図保管庫 */
  o.push(SC('SCENE004'));
  o.push(CH('SCENE 004', '地図保管庫', '北棟・一番奥の部屋'));
  o.push(BG('bg08'));
  o.push(BGM('bgm04'));
  o.push(N('地図保管庫は、理数科棟の一番奥にある。\n棚には筒がぎっしり並び、埃と古い紙の匂いがする。三重にとっては初めて入る部屋だった。'));
  o.push(SP('katsuya', 1, 'cr'));
  o.push(S('katsuya', 1, 'cr', 'そっちの棚、上から順に詰めてくれ。古いのが下、新しいのが上だ'));
  o.push(SP('mie', 1, 'cl'));
  o.push(S('mie', 1, 'cl', '逆じゃないんすか。普通は新しいのを手前に置くでしょ'));
  o.push(S('katsuya', 1, 'cr', '地図は逆でいい。古いものの上に、新しいものが積もる。地面と同じだ'));
  o.push(T('mie', 1, 'cl', '（地面の話にすぐ持っていくのな、この人）'));
  o.push(N('三重は言われた通りに筒を積み上げていく。\n一本、また一本。'));
  o.push(N('何気なく持ち上げた古い筒の蓋が、劣化していたのか、ふとした拍子に外れた。'));
  o.push(CG('cg_02', 'こぼれたもの', '三重／勝也　―　地図保管庫'));
  o.push(SE('drop'));
  o.push(N('筒の中から地図と一緒に、一枚の写真が滑り落ちた。\nひらり、と間の抜けた音を立てて、床に着地する。'));
  o.push(S('mie', 3, 'cl', 'あ'));
  o.push(CG('cg_04', '回収', '勝也　―　「すまん、忘れてただけだ」'));
  o.push(S('katsuya', 4, 'cr', '……'));
  o.push(N('勝也が一瞬、体を強張らせたのが分かった。\nだが三重の方が先に、屈んでそれを拾い上げてしまっていた。'));
  o.push(CG('cg_03', '裏の文字', '三重（手元）　―　万年筆の書き込み'));
  o.push(N('色褪せた写真だった。\n山の上、地形図らしきものを広げる二人の若い男。'));
  o.push(N('片方は、面影から見て――間違いなく、若い頃の勝也だ。\nもう一人は知らない大人。二人とも、笑っている。'));
  o.push(N('裏には、万年筆でこう書かれていた。'));
  o.push(N('『――年　月　日　稲葉先生と、はじめての地形図。』'));
  o.push(DI('inaba'));
  o.push(S('mie', 3, 'cl', '……稲葉、先生?'));
  o.push(CG('cg_04', '回収', '勝也　―　丁寧に、丁寧すぎるくらい丁寧に'));
  o.push(S('katsuya', 6, 'cr', '貸してくれ'));
  o.push(N('声は普段と変わらないはずなのに、どこか硬かった。\n三重が写真を渡すと、勝也はそれを丁寧に――丁寧すぎるくらい丁寧に――筒の奥にしまい直した。'));
  o.push(S('katsuya', 5, 'cr', 'すまん。忘れてただけだ、こんなもの入れてたこと'));
  o.push(S('mie', 4, 'cl', '……そうすか'));
  o.push(N('それ以上、聞けなかった。\n聞いていい話ではない気がした。'));
  o.push(N('勝也は何事もなかったかのように、次の筒を三重に手渡した。'));
  o.push(S('katsuya', 1, 'cr', '続き、頼む'));
  o.push(S('mie', 4, 'cl', '……はい'));
  o.push(CGO());
  o.push(N('残りの作業は無言で終わった。'));
  o.push(N('勝也が窓の外を見て五秒黙る、あの癖が、この日はいつもより一秒か二秒、長かった気がした。\n気のせいかもしれない。\n三重には、確かめる勇気がなかった。'));
  o.push(HI('all'));
  o.push(IT('ui_09', '古い写真（記憶）'));

  /* SCENE 005 階段の踊り場＋選択肢 */
  o.push(SC('SCENE005'));
  o.push(CH('SCENE 005', '踊り場', '放課後、屋上へ続く階段'));
  o.push(BG('bg06'));
  o.push(BGM('bgm05'));
  o.push(N('三重は一人、階段の踊り場で立ち止まっていた。\nスマートフォンを見るふりをして、実際は何も見ていない。'));
  o.push(SP('mie', 4, 'c'));
  o.push(T('mie', 4, 'c', '（……何なんだよ、あれ）'));
  o.push(N('「稲葉先生」という名前に、心当たりはない。\n勝也の口から一度も出たことのない名前だ。'));
  o.push(N('三年間、彼の授業を受けてきて、彼の窓を見る癖も、彼の地図の描き方も知っている。'));
  o.push(T('mie', 6, 'c', '（知ってるつもりだっただけかよ）'));
  o.push(N('知りたいのか、知りたくないのか、自分でもわからなかった。'));
  o.push(N('ただ、あの写真を見た瞬間の勝也の表情――窓の外を見るときの、あの「遠い目」と同じ目を、写真をしまうときにもしていたことだけは、はっきり覚えていた。'));
  o.push(CHO([
    { label: '両馬に話す', heart: 2, flag: 'MIE', flagv: 1, set: { ch1path: 1 }, then: [] },
    { label: '一人でこっそり調べてみる', heart: 1, flag: 'MIE', flagv: 1, set: { ch1path: 2 }, then: [] },
    { label: '誰にも言わず、そっとしておく', heart: -1, set: { ch1path: 3 }, then: [] }
  ]));

  o.push(L('ch1_after_choice'));
  o.push(SC('SCENE006'));
  o.push(CH('SCENE 006', '共有', '放課後の廊下'));
  o.push(IF(function (st) { return st.vars.ch1path === 2; }, [
    BG('bg09'),
    N('三重は、まず一人で調べることにした。'),
    N('図書室。年鑑。卒業アルバム。\n「稲葉」という姓で引けるものは、何一つなかった。'),
    N('あるのは、桐葉高校の所在地と、自分の居眠りの跡だけだった。'),
    SP('mie', 4, 'c'),
    T('mie', 4, 'c', '（……そうか。ここじゃなくて、あの部屋にあったんだ。答えは）'),
    N('一人で抱え込むには、この話は少し大きすぎた。\n翌日の放課後、三重は自分から両馬を捕まえた。')
  ], [IF(function (st) { return st.vars.ch1path === 3; }, [
    BG('bg05'),
    N('そっとしておこう、と決めたのは、本当に十分間だけだった。'),
    N('翌日。三重が教室に入ると、両馬がこちらを見た。\n理由を聞くまでもなかった。顔に出ていた。'),
    SP('ryoma', 4, 'r'),
    S('ryoma', 4, 'r', '三重。お前、何かあったな'),
    SP('mie', 4, 'cl'),
    S('mie', 4, 'cl', '……隠すの下手すぎるだろ、俺'),
    S('ryoma', 1, 'r', '自覚はあるんだな')
  ], [
    N('三重はその日のうちに、両馬にだけこっそり打ち明けた。\n隠すのだけは、得意ではなかった。')
  ])]));

  o.push(CG('cg_05', '放課後の共有', '三重／両馬　―　誰もいない廊下'));
  o.push(SP('mie', 4, 'cl'));
  o.push(S('mie', 4, 'cl', '……お前だけに言っとく。誰にも言うなよ'));
  o.push(SP('ryoma', 4, 'cr'));
  o.push(S('ryoma', 4, 'cr', '……稲葉先生、か'));
  o.push(S('mie', 2, 'cl', '知ってんの?'));
  o.push(S('ryoma', 4, 'cr', '知らない。でも、その名前を言うときのお前の顔、初めて見る顔だった'));
  o.push(S('mie', 6, 'cl', '顔とか関係ねえだろ'));
  o.push(S('ryoma', 1, 'cr', '関係あるよ。三重がそんな顔する時点で、これはもう✝本質✝案件だ'));
  o.push(S('mie', 2, 'cl', '出た'));
  o.push(S('ryoma', 7, 'cr', '出たけど、今回はふざけてない。……先生のこと、ちゃんと知りたい。俺も、そう思う'));
  o.push(CGO());
  o.push(SP('mie', 9, 'cl'));
  o.push(S('mie', 9, 'cl', '……ちゃんと知って、それでどうすんだよ'));
  o.push(S('ryoma', 1, 'cr', 'わかんない。でも、知らないまま卒業するのは、なんか違う気がする'));
  o.push(S('mie', 4, 'cl', '……まあ'));
  o.push(S('ryoma', 2, 'cr', 'その「まあ」、本気の「まあ」だな'));
  o.push(S('mie', 6, 'cl', 'うるさい'));
  o.push(HI('all'));
  o.push(N('こうして、卒業までの最後の一ヶ月、理数科三年B組の「見送りの準備」が、静かに始まった。'));

  /* ---------------- HUB導入 ---------------- */
  o.push(SC('HUB_INTRO'));
  o.push(BG('bg01'));
  o.push(BGM('bgm06'));
  o.push(N('翌朝のことだ。'));
  o.push(SP('mie', 7, 'cl'));
  o.push(SP('ryoma', 7, 'cr'));
  o.push(S('mie', 7, 'cl', '手伝ってほしいやつ、順番に当たっていくか'));
  o.push(S('ryoma', 7, 'cr', '誰からいく?'));
  o.push(S('mie', 1, 'cl', '砂糖、零、寺地……あと、南棟の三峰たち。それと召野と倉石か'));
  o.push(S('ryoma', 2, 'cr', '順番は？'));
  o.push(S('mie', 4, 'cl', '……順番とかあんのか。まあいい。話せそうなやつから、順番に'));
  o.push(HI('all'));
  o.push(N('三重と両馬が中心となり、「先生のことをちゃんと知って、卒業までに何かを返す」――\n名前もまだない計画が、動き出した。'));
  o.push(DI('yonhachikyu'));

  o.push(HUB());
  o.push(L('hub_loop'));
  o.push(HUB());

  g.__SCRIPT_PARTS.push(o);
})(typeof window !== 'undefined' ? window : globalThis);
