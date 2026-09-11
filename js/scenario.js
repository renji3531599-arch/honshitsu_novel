// まだ地図の途中で 〜✝本質✝特別編〜 Scenario Definition
// Engine expects window.SCENARIO = { labels: { name: [entries] } }
// Each entry: { bg, cg, bgm, se, chara:[], name, text, choices, next, flags, heart, hub, ending, notify }

window.SCENARIO_META = {
  title: "まだ地図の途中で 〜✝本質✝特別編〜",
  bgMap: {
    "bg_hokutou_kyoshitsu_asa.png": "北棟三年B組・朝",
    "bg_hokutou_kyoshitsu_hiru.png": "北棟三年B組・昼休み",
    "bg_hokutou_kyoshitsu_yuugata.png": "北棟・夕方（茜色）",
    "bg_hokutou_kyoshitsu_yoru.png": "北棟・夜（誰もいない教室）",
    "bg_rouka_hokutou.png": "北棟廊下",
    "bg_kaidan_odoriba.png": "階段踊り場",
    "bg_jimushitsu.png": "職員室",
    "bg_chizu_hokanko.png": "地図保管庫",
    "bg_toshoshitsu.png": "図書室",
    "bg_toshokan_shozoko.png": "書庫（埃っぽい）",
    "bg_suiko_hotori.png": "翠湖のほとり",
    "bg_koutei_bunkasai_junbi.png": "校庭・文化祭準備",
    "bg_taiikukan.png": "体育館（謝恩会）",
    "bg_okujou.png": "屋上",
    "bg_tsuugaku_densha_mado.png": "通学電車の車窓",
    "bg_sakura_namiki.png": "桜並木（南棟-北棟）",
    "bg_sotsugyoushiki_kaijou.png": "卒業式会場",
    "bg_minamitou_kyoshitsu.png": "南棟教室",
    "bg_ryoma_ie_butsudan.png": "両馬の家・仏間",
    "bg_hawaii_youganchi_kaisou.png": "ハワイ溶岩台地（回想）",
    "bg_yama_gensho_kaisou.png": "山・稲葉と勝也（褪色）",
    "bg_daigaku_yakou_kaisou.png": "大学・野外調査ベース",
    "bg_kyoshitsu_haru_sotsugyougo.png": "卒業後の教室",
    "bg_kyoshitsu_suunengo.png": "数年後の教室"
  },
  bgmMap: {
    "bgm01": "プロローグ - 軽快、少しノスタルジック",
    "bgm02": "教室の日常 - 木琴主体、アップテンポ",
    "bgm03": "✝本質✝ギャグ - ピチカート",
    "bgm04": "地図保管庫 - 静か、不穏手前",
    "bgm05": "三重の独白 - ピアノソロ",
    "bgm06": "日常の中の真剣 - アコースティックGt",
    "bgm07": "砂糖編 - 電車の走行音、静かな曲",
    "bgm08": "零編 - ミニマル電子音",
    "bgm09": "寺地編 - 弾き語り風、素朴",
    "bgm10": "両馬編 - 和を感じる穏やか",
    "bgm11": "南棟編 - 軽やかな弦楽",
    "bgm12": "召野+倉石 - コミカルとシリアスの中間",
    "bgm13": "地図を作る夜 - 高揚、作業の高まり",
    "bgm14": "過去を語る - ストリングス静謐",
    "bgm15": "涙腺決壊 - フルオーケストラ主題",
    "bgm16": "最後の朗読 - アカペラに近い",
    "bgm17": "卒業式 - 温かい合唱",
    "bgm18": "TRUE END - 主題曲フル",
    "bgm19": "GOOD END - 変奏",
    "bgm20": "NORMAL END - 静かな余韻",
    "bgm21": "BITTERSWEET - 切なく温か",
    "bgm22": "COMEDY SECRET - フルバンド、コミカル",
    "bgm23": "BONUS EXTRA - ノスタルジック",
    "bgm24": "スタッフロール - 歌入り"
  }
};

// Helper to keep ordered
window.SCENARIO = {
  "_prologue": [
    { bg:"bg_sakura_namiki.png", bgm:"bgm01", notify:"Prologue - 三度目の春、まだ来ない" },
    { name:null, text:"桐葉高校には、今も見えない国境がある。\n南棟と北棟。偏差値十の差。紺のネクタイとえんじのネクタイ。三年経っても、その線引きは消えない。\n\n消えないものと、消えていくものがある。\n北棟理数科三年B組にとって、消えていくものの筆頭は、自分たちがこの教室にいられる時間そのものだった。" },
    { name:null, text:"【タイトル表示】\n『まだ地図の途中で　〜✝本質✝特別編〜』\n\n── これは、誰も置き去りにしない、最後の一ヶ月の話。", cg:"ui01" },
    { bg:"bg_hokutou_kyoshitsu_asa.png", name:null, text:"一年目、両馬二郎が「✝本質✝」という言葉をこの世に解き放った。\n二郎系ラーメンの脂にも、電線にも、コーンスープの不在にすら、彼はそれを見出した。" },
    { name:null, text:"三重県臣は「は？」と言い続けた。言い続けながら、誰よりも近くで聞いていた。\n寺地星は登録者百五十人の配信で紙に書いた言葉を読み上げ、意味を探した。\n砂糖東洋は窓の外を見ていないと言い張り、零は「面白い」とだけ言い、伊崎と伊豆見は少しずつ距離を変え、召野は人妻に恋をして完了し、倉石という名の後輩がその全てを記録し始めた。" },
    { name:null, text:"そして、地理教師・塀勝也は、三年間、同じ地図を見せ続けた。\n一年目は「同じに見えるか」と聞き、誰も答えなかった。\n三年目のその同じ問いに、今度は誰かが手を挙げた。\n\n何も劇的なことは起きなかった。それでも、確かに何かが変わった三年間だった。" },
    { se:"se15", name:null, text:"── けれど、これは「三年間の話」ではない。\nこれは、その三年間が終わる直前――誰も気づかないまま通り過ぎるはずだった、たった一つの秘密に、生徒たちがうっかり触れてしまった話だ。", next:"chapter1" }
  ],

  "chapter1": [
    { bg:"bg_hokutou_kyoshitsu_hiru.png", bgm:"bgm02", chara:[{id:"chr_ryoma_02_niyari.png", pos:"left"}, {id:"chr_mie_02_ha.png", pos:"right"}], notify:"第一章 - 差出人不明の写真" },
    { name:"両馬", text:"見ろ。フェイカツの最新書き込み、伸びてる" },
    { name:"三重", text:"まだやってんのか、それ" },
    { name:"両馬", text:"卒業までは辞められない。伝統だから" },
    { name:"三重", text:"三年しか続いてない伝統に、伝統って言葉使うな" },
    { chara:[{id:"chr_kuraishi_01_nekkyou.png", pos:"center"}], name:"倉石", text:"先輩方。✝本質✝年鑑、三年生編の追い込みに入りました。卒業までに完成させます" },
    { chara:[{id:"chr_mie_02_ha.png", pos:"right"}], name:"三重", text:"完成させるな。お前が去年言ってただろ、完結させたら✝本質✝じゃなくなるって" },
    { name:"倉石", text:"言いました。でも今回は“未完成のまま卒業する”という完成形を目指しています" },
    { name:"三重", text:"言い訳の質が上がってて逆に腹立つ" },
    { chara:[{id:"chr_satou_01_game.png", pos:"left"}], name:"砂糖", text:"（ゲームをしながら）……あと一ヶ月か" },
    { chara:[{id:"chr_izaki_01_tsujou.png", pos:"left"}, {id:"chr_izumi_02_egao.png", pos:"right"}], name:"伊崎", text:"早いよな。理数科、来年からもう俺たちの代がいないんだと思うと変な感じだ" },
    { name:"伊豆見", text:"変な感じ、って言い方、伊崎っぽいな" },
    { name:"伊崎", text:"悪いか" },
    { name:"伊豆見", text:"悪くない。俺も同じこと思ってた" },
    { chara:[{id:"chr_katsuya_01_tsujou.png", pos:"center"}], name:"勝也", text:"三重、ちょっといいか" },
    { chara:[{id:"chr_mie_01_reishou.png", pos:"center"}], name:"三重", text:"は？　俺すか" },
    { name:"勝也", text:"保管庫まで、これを運ぶのを手伝ってほしい。重いわけじゃないが、数が多い" },
    { name:"三重", text:"……別にいいですけど" },
    { chara:[{id:"chr_ryoma_04_kyuunimayao.png", pos:"right"}], name:"両馬", text:"（小声で）三重、ヘイカツと二人きりになれるチャンスだぞ。何か✝本質✝的なもの、持ち帰ってこい" },
    { name:"三重", text:"持ち帰らねえよ。ただの力仕事だろ" },

    { bg:"bg_chizu_hokanko.png", bgm:"bgm04", chara:[{id:"chr_katsuya_01_tsujou.png", pos:"left"}, {id:"chr_mie_01_reishou.png", pos:"right"}], name:null, text:"地図保管庫は、理数科棟の一番奥にある。棚には筒がぎっしり並び、埃と古い紙の匂いがする。三重にとっては初めて入る部屋だった。" },
    { name:"勝也", text:"そっちの棚、上から順に詰めてくれ。古いのが下、新しいのが上だ" },
    { name:"三重", text:"逆じゃないんすか。普通は新しいのを手前に置くでしょ" },
    { name:"勝也", text:"地図は逆でいい。古いものの上に、新しいものが積もる。地面と同じだ" },
    { name:"三重", text:"（心の中で）地面の話にすぐ持っていくのな、この人）" },
    { cg:"cg_02", name:null, text:"三重が言われた通りに筒を積み上げていく。一本、また一本。\n何気なく持ち上げた古い筒の蓋が、劣化していたのか、ふとした拍子に外れた。\n\n―― ひらり、と間の抜けた音を立てて、一枚の写真が床に着地する。" },
    { chara:[{id:"chr_katsuya_04_odoroki.png", pos:"right"}], name:"三重", text:"あ" },
    { name:"勝也", text:"……" },
    { cg:"cg_03", name:null, text:"色褪せた写真だった。\n山の上、地形図らしきものを広げる二人の若い男。片方は、面影から見て――間違いなく、若い頃の勝也だ。もう一人は知らない大人。二人とも笑っている。\n\n裏には、万年筆でこう書かれていた。\n\n『――年　月　日　稲葉先生と、はじめての地形図。』" },
    { chara:[{id:"chr_mie_03_douyou.png", pos:"center"}], name:"三重", text:"……稲葉、先生？" },
    { chara:[{id:"chr_katsuya_06_katai.png", pos:"center"}], name:"勝也", text:"貸してくれ" },
    { name:null, text:"声は普段と変わらないはずなのに、どこか硬かった。三重が写真を渡すと、勝也はそれを丁寧に――丁寧すぎるくらい丁寧に――筒の奥にしまい直した。" },
    { name:"勝也", text:"すまん。忘れてただけだ、こんなもの入れてたこと" },
    { name:"三重", text:"……そうすか" },
    { name:null, text:"それ以上、聞けなかった。聞いていい話ではない気がした。\n勝也は何事もなかったかのように、次の筒を三重に手渡した。\n\n「続き、頼む」\n「……はい」\n\n残りの作業は無言で終わった。\n勝也が窓の外を見て五秒黙る、あの癖が、この日はいつもより一秒か二秒、長かった気がした。気のせいかもしれない。三重には確かめる勇気がなかった。" },

    { bg:"bg_kaidan_odoriba.png", bgm:"bgm05", chara:[{id:"chr_mie_04_kimazui.png", pos:"center"}], name:"三重", text:"（心の中で）……何なんだよ、あれ）" },
    { name:null, text:"「稲葉先生」という名前に、心当たりはない。勝也の口から一度も出たことのない名前だ。\n三年間、彼の授業を受けてきて、彼の窓を見る癖も、彼の地図の描き方も知っている。知っているつもりだった。" },
    { chara:[{id:"chr_mie_06_iradachi.png", pos:"center"}], name:"三重", text:"（心の中で）知ってるつもりだっただけかよ）" },
    { name:null, text:"知りたいのか、知りたくないのか、自分でもわからなかった。\nただ、あの写真を見た瞬間の勝也の表情――窓の外を見るときの、あの「遠い目」と同じ目を、写真をしまうときにもしていたことだけは、はっきり覚えていた。" },
    { choices:[
      { text:"両馬に話す（誰かに共有する）", next:"chapter1_branch_ryoma", heart:2, flag:"FLAG_MIE" },
      { text:"一人でこっそり調べてみる", next:"chapter1_branch_solo", heart:1, flag:"FLAG_MIE" },
      { text:"誰にも言わず、そっとしておく", next:"chapter1_branch_silent", heart:-1 }
    ]}
  ],

  "chapter1_branch_ryoma": [
    { bg:"bg_rouka_hokutou.png", cg:"cg_05", chara:[{id:"chr_mie_07_honkishinken.png", pos:"left"}, {id:"chr_ryoma_04_kyuunimayao.png", pos:"right"}], name:"三重", text:"……お前だけに言っとく。誰にも言うなよ" },
    { name:"両馬", text:"……稲葉先生、か" },
    { name:"三重", text:"知ってんの？" },
    { name:"両馬", text:"知らない。でも、その名前を言うときのお前の顔、初めて見る顔だった" },
    { name:"三重", text:"顔とか関係ねえだろ" },
    { name:"両馬", text:"関係あるよ。三重がそんな顔する時点で、これはもう✝本質✝案件だ" },
    { name:"三重", text:"出た" },
    { name:"両馬", text:"出たけど、今回はふざけてない。……先生のこと、ちゃんと知りたい。俺も、そう思う" },
    { chara:[{id:"chr_mie_09_sunaoemi.png", pos:"left"}], name:"三重", text:"……ちゃんと知って、それでどうすんだよ" },
    { name:"両馬", text:"わかんない。でも、知らないまま卒業するのは、なんか違う気がする" },
    { name:"三重", text:"……まあ" },
    { name:"両馬", text:"その『まあ』、本気の『まあ』だな" },
    { name:"三重", text:"うるさい" },
    { name:null, text:"こうして、卒業までの最後の一ヶ月、理数科三年B組の「見送りの準備」が、静かに始まった。", next:"hub" }
  ],
  "chapter1_branch_solo": [
    { name:"三重", text:"（心の中で）……一人で調べてみるか。まずは図書室の書庫か）" },
    { name:null, text:"だが、古い学校新聞の束を前に、三重はすぐに悟った。\n一人で抱えるには、重すぎる。\n\n翌日、結局両馬に打ち明けることになる。\n「お前、隠すの下手すぎるだろ」と言われながら。" },
    { chara:[{id:"chr_ryoma_04_kyuunimayao.png", pos:"center"}], name:"両馬", text:"三重がそんな顔する時点で、これはもう✝本質✝案件だ" },
    { name:"三重", text:"……まあ" },
    { name:null, text:"こうして、見送りの準備が始まった。", next:"hub" }
  ],
  "chapter1_branch_silent": [
    { name:"三重", text:"（心の中で）……そっとしておこう。詮索は、優しさじゃないかもしれない）" },
    { name:null, text:"翌日、両馬が三重の顔を見て言った。\n「隠すの下手すぎるだろ」\n\nバレていた。\n三重は観念して、写真のことを打ち明けた。" },
    { chara:[{id:"chr_ryoma_04_kyuunimayao.png", pos:"center"}], name:"両馬", text:"先生のこと、ちゃんと知りたい。俺も、そう思う" },
    { name:null, text:"こうして、見送りの準備が始まった。", next:"hub" }
  ],

  "hub": [
    { bg:"bg_hokutou_kyoshitsu_yuugata.png", bgm:"bgm06", notify:"HUB - 見送りの準備、始めます", hub:true, name:null, text:"三重と両馬が中心となり、「先生のことをちゃんと知って、卒業までに何かを返す」という、名前もまだない計画が動き出した。\n\n好きな順番で、話せる相手から当たっていく。\n（全てのルートを回ると、物語は収束章へ進みます）" }
  ],

  // Routes — each label will be called from hub
  "route_satou": [
    { bg:"bg_hokutou_kyoshitsu_hiru.png", bgm:"bgm07", chara:[{id:"chr_satou_01_game.png", pos:"center"}], name:"砂糖", text:"（ゲームをしながら）……何の用だよ" },
    { chara:[{id:"chr_mie_01_reishou.png", pos:"center"}], name:"三重", text:"頼みがある。お前の写真、見せてほしい" },
    { name:"砂糖", text:"写真？" },
    { name:"三重", text:"電車の窓から撮ってたやつ。ハワイの溶岩台地のやつも" },
    { chara:[{id:"chr_satou_04_soppo.png", pos:"center"}], name:"砂糖", text:"……なんでそれ知ってんだよ" },
    { name:"三重", text:"二年前から知ってた。お前が『見てない』って言い張ってる間、ずっと知ってた" },
    { name:"砂糖", text:"うるさい" },
    { name:null, text:"三重が、写真の使いみちをかいつまんで説明する。勝也の古い写真のこと、稲葉先生という知らない名前のこと、卒業までに何かを返したいということ。" },
    { chara:[{id:"chr_satou_03_odoroki.png", pos:"center"}], name:"砂糖", text:"……先生に、そんな写真が" },
    { choices:[
      { text:"「お前の写真、力を貸してくれないか」と正面から頼む", next:"route_satou_a1", heart:2, flag:"FLAG_SATOU" },
      { text:"「別に無理にとは言わないけど」と気を遣う", next:"route_satou_a2", heart:1, flag:"FLAG_SATOU" }
    ]}
  ],
  "route_satou_a1": [
    { cg:"cg_06", name:null, text:"砂糖がスマートフォンを取り出し、写真フォルダを開く。三年分。\n通学電車の車窓、季節ごとに色を変える山。ハワイの溶岩台地、伊豆見や零の後ろ姿ごしに撮った授業の黒板。" },
    { chara:[{id:"chr_satou_02_muhyoujou.png", pos:"center"}], name:"砂糖", text:"……全部、記録のつもりだった。景色の話じゃない" },
    { name:"三重", text:"景色の話をすることを記録って言うんだよ" },
    { name:"砂糖", text:"……うるさい" },
    { cg:"cg_07", chara:[{id:"chr_satou_07_kotobanitsumaru.png", pos:"left"}, {id:"chr_mie_01_reishou.png", pos:"right"}], name:"砂糖", text:"三重" },
    { name:"三重", text:"何" },
    { name:"砂糖", text:"俺、最初の授業で手挙げたろ。三年目の" },
    { name:"三重", text:"覚えてる。びっくりした" },
    { chara:[{id:"chr_satou_07_kotobanitsumaru.png", pos:"center"}], name:"砂糖", text:"あれ、なんでだったか、ちゃんと言わなかったよな" },
    { name:"三重", text:"言わなかったな" },
    { name:"砂糖", text:"……三年間ずっと見てたのに、見てないふりしてたら、ヘイカツに嘘つくことになる気がした。それだけ" },
    { name:"三重", text:"……お前が今言ったこと、そのまま先生に渡す地図の隅にでも書いとくか" },
    { chara:[{id:"chr_satou_06_bishou_rare.png", pos:"center"}], name:"砂糖", text:"……書くなよ、恥ずかしい" },
    { name:"三重", text:"書くよ" },
    { name:"砂糖", text:"……まあ、書くなら、いい写真選んどけ" },
    { heart:2, flag:"FLAG_SATOU", name:null, text:"「見てない」と言い張ってきた男が、初めて自分から「見てた」を差し出した瞬間だった。\n\n【砂糖の写真を入手した】\n心Point +2 / FLAG_SATOU +2", next:"hub_return" }
  ],
  "route_satou_a2": [
    { name:"砂糖", text:"……一晩考えさせてくれ" },
    { name:null, text:"翌日、砂糖は無言でフォルダを共有してきた。\n「……使うなら、ちゃんと使えよ」\n\n遠慮がちな優しさだった。" },
    { heart:1, flag:"FLAG_SATOU", cg:"cg_07", name:null, text:"【砂糖の写真を入手した】\n心Point +1 / FLAG_SATOU +1", next:"hub_return" }
  ],

  "route_rei": [
    { bg:"bg_hokutou_kyoshitsu_hiru.png", bgm:"bgm08", chara:[{id:"chr_rei_01_tsujou.png", pos:"center"}], name:"零", text:"（数式を消しながら）三重が真面目な顔してるの、珍しいね" },
    { name:"三重", text:"珍しくない。いつも真面目だよ" },
    { name:"零", text:"いつもは真面目な顔で冷笑してる。今日は違う" },
    { name:null, text:"三重が事情を話す。零は黒板消しの手を止め、しばらく黙って聞いていた。" },
    { chara:[{id:"chr_rei_04_odoroki.png", pos:"center"}], name:"零", text:"……それ、詮索じゃない？" },
    { name:"三重", text:"は？" },
    { chara:[{id:"chr_rei_05_shinken.png", pos:"center"}], name:"零", text:"先生が誰にも言ってないってことは、言いたくないってことだろ。それを勝手に掘り返すのは、優しさなのかな" },
    { choices:[
      { text:"「知りたいからじゃない。ちゃんとお礼を言いたいからだ」と説得する", next:"route_rei_b1", heart:2, flag:"FLAG_REI" },
      { text:"「……そうかもしれない」と一旦引き下がる", next:"route_rei_b2", heart:1, flag:"FLAG_REI" }
    ]}
  ],
  "route_rei_b1": [
    { chara:[{id:"chr_rei_07_kotobaerabu.png", pos:"center"}], name:"零", text:"……知りたい、じゃなくて、ちゃんと伝えたい、か" },
    { name:"三重", text:"そう" },
    { name:"零", text:"それなら、面白いからじゃなくて――" },
    { cg:"cg_09", name:null, text:"零がそこで、珍しく言葉を探すように黙った。三重が待つ。両馬が横で息を呑む。" },
    { chara:[{id:"chr_rei_02_bishou.png", pos:"center"}], name:"零", text:"――大事だと思うから、手伝う" },
    { name:"三重", text:"……お前、今『面白い』って言わなかったな" },
    { name:"零", text:"言わなかった" },
    { name:"両馬", text:"零が『面白い』以外の言葉で何か肯定するの、初めて見た" },
    { name:"零", text:"そう？ ……そうかもね。でも、大事なことは、面白いより先に大事なんだと思う" },
    { heart:2, flag:"FLAG_REI", name:null, text:"零が持ち前のデータ整理能力とプログラミングの腕を発揮し、砂糖の写真、寺地の配信ログ、倉石の資料を一つにまとめる土台を作り始めた。\n「面白い」だけでは測れないものを、初めて自分の手で形にする作業だった。", next:"hub_return" }
  ],
  "route_rei_b2": [
    { name:"零", text:"……わかった。ちょっと考えさせて" },
    { name:null, text:"翌日、零は自分から声をかけてきた。\n「大事だと思うから、手伝う」\n\n彼は自分の言葉で、違う語彙を選び取っていた。" },
    { heart:1, flag:"FLAG_REI", name:null, text:"【零の協力を得た】", next:"hub_return" }
  ],

  "route_terachi": [
    { bg:"bg_hokutou_kyoshitsu_yuugata.png", bgm:"bgm09", chara:[{id:"chr_terachi_01_tsujou.png", pos:"center"}], name:"寺地", text:"……先生の過去を、勝手に配信で扱うのは違うと思う" },
    { name:null, text:"三重が相談を持ちかけると、寺地は最初、慎重な顔を見せた。炎上と非公開化を経験した男の、当然の反応だった。" },
    { name:"寺地", text:"一度、意味のわからないものを面白がられて、壊れかけたことがあるから。今度は誰かの本当の話を、面白がられる場所に出すのは、絶対にしたくない" },
    { chara:[{id:"chr_mie_07_honkishinken.png", pos:"center"}], name:"三重", text:"暴露するつもりはない。むしろ逆" },
    { name:"寺地", text:"逆？" },
    { name:"三重", text:"先生に、直接『ありがとう』を言う場を作りたい。配信するにしても、先生の許可を取った上で、先生に向けてだけ" },
    { choices:[
      { text:"「お前にしか頼めない」と正面から頼む", next:"route_terachi_c1", heart:2, flag:"FLAG_TERACHI" },
      { text:"「無理にとは言わない」と選択を委ねる", next:"route_terachi_c2", heart:1, flag:"FLAG_TERACHI" }
    ]}
  ],
  "route_terachi_c1": [
    { cg:"cg_10", name:null, text:"寺地が机の引き出しを開ける。一年目から溜め込んできた、本質配信の投稿を書き写した紙束。捨てずに取ってあった、三年分の「意味のわからないもの」たち。" },
    { chara:[{id:"chr_terachi_06_maikuketsui.png", pos:"center"}], name:"寺地", text:"……暴露じゃなくて、ありがとうの会にする。それなら、俺にもできる" },
    { cg:"cg_11", chara:[{id:"chr_terachi_06_maikuketsui.png", pos:"left"}, {id:"chr_ryoma_07_shinkenketsui.png", pos:"center"}, {id:"chr_mie_07_honkishinken.png", pos:"right"}], name:"寺地", text:"読み上げ役、俺でいいのか" },
    { name:"両馬", text:"お前しかいないだろ" },
    { name:"寺地", text:"……巫女とか言うなよ" },
    { name:"両馬", text:"言ってない" },
    { name:"寺地", text:"言いそうだった" },
    { name:"両馬", text:"言いそうだったけど言ってない。今回は、ちゃんと“読む人”って言う" },
    { heart:2, flag:"FLAG_TERACHI", name:null, text:"寺地は、この日から静かに準備を始めた。誰の言葉を、どんな順番で、どんな声で読むか。\n三年間、意味のわからないものに意味を探し続けてきた男が、初めて「意味がわかりきっている言葉」を読む練習をしていた。", next:"hub_return" }
  ],
  "route_terachi_c2": [
    { name:"寺地", text:"……一晩考えさせて" },
    { name:null, text:"翌朝、寺地は答えた。\n「暴露じゃなくて、ありがとうの会にする。それなら、俺にもできる」" },
    { heart:1, flag:"FLAG_TERACHI", name:null, text:"【寺地の協力を得た】", next:"hub_return" }
  ],

  "route_ryoma": [
    { bg:"bg_ryoma_ie_butsudan.png", bgm:"bgm10", chara:[{id:"chr_ryoma_08_terekakushi.png", pos:"center"}], name:"両馬", text:"……こんなとこ呼んで悪い。他の場所だと、たぶんちゃんと話せない" },
    { name:"三重", text:"別にいいけど。……お祖父ちゃん？" },
    { name:"両馬", text:"うん。俺が中学の頃に死んだ" },
    { cg:"cg_12", name:null, text:"仏壇のある和室。線香の匂い。遺影の中の老人は、両馬によく似た目をして笑っていた。\n\n両馬が仏壇の前に正座し、線香を一本立てる。三重はその隣に、少し距離を置いて座った。" },
    { name:"両馬", text:"爺ちゃん、変な人でさ。何見ても『これはなあ、本質だ』って言うんだよ。電柱でも、味噌汁でも、俺のテストの点数でも" },
    { name:"三重", text:"……お前がやってることと同じじゃねえか" },
    { chara:[{id:"chr_ryoma_06_nakiwarai.png", pos:"center"}], name:"両馬", text:"同じなんだよ。それしかないんだよ" },
    { choices:[
      { text:"黙って、両馬の話の続きを待つ", next:"route_ryoma_d1", heart:2 },
      { text:"「それで？」と先を促す", next:"route_ryoma_d2", heart:1, flag:"FLAG_RYOMA" }
    ]}
  ],
  "route_ryoma_d1": [
    { cg:"cg_13", name:null, text:"線香の煙が、柔らかい逆光の中をたゆたう。" },
    { name:"両馬", text:"爺ちゃんが死んで、しばらくして気づいたんだ。あの適当な口癖が、聞こえなくなったこと。誰も『これはなあ、本質だ』って言わない家になったこと" },
    { name:"三重", text:"……" },
    { name:"両馬", text:"寂しいとか、悲しいとか、そういうのとはちょっと違ってて。ただ、あの声が聞こえないのが、変な感じだった。だから――" },
    { name:"三重", text:"自分で言い始めたのか" },
    { chara:[{id:"chr_ryoma_04_kyuunimayao.png", pos:"center"}], name:"両馬", text:"うん。最初は爺ちゃんの真似のつもりだった。そのうち、本当に何にでも見えるようになった。意味なんかなくていいんだよ。意味があるかどうかわかんないことを、わかんないまま大事にする。それが、爺ちゃんがくれたものだったんだと思う" },
    { heart:3, flag:"FLAG_RYOMA", name:"三重", text:"……三年間、意味わかんねえって思いながら聞いてたけど" },
    { name:"両馬", text:"うん" },
    { name:"三重", text:"今、ちょっとだけわかった気がする" },
    { chara:[{id:"chr_ryoma_09_goukyuu.png", pos:"center"}], name:"両馬", text:"……三重に、ちょっとだけでもわかってもらえたなら、爺ちゃんも本望だろうな" },
    { name:"三重", text:"本望とか気安く言うな。……でも、まあ" },
    { name:"両馬", text:"まあ？" },
    { name:"三重", text:"悪くない、口癖" },
    { name:null, text:"両馬はこの後、勝也の写真の話にも触れる。\n「爺ちゃんの声が聞こえなくなったときの寂しさ」を知っているからこそ、両馬は誰よりもこの計画に本気だった。", next:"route_ryoma_d_common" }
  ],
  "route_ryoma_d2": [
    { name:"両馬", text:"爺ちゃんが死んで、聞こえなくなったんだ。あの口癖が。だから自分で言い始めた。最初は真似で、そのうち本当に何にでも見えるようになった。" },
    { heart:1, flag:"FLAG_RYOMA", name:null, text:"少し急かした分、言葉は短くなったが、想いは変わらなかった。", next:"route_ryoma_d_common" }
  ],
  "route_ryoma_d_common": [
    { name:"両馬", text:"先生の写真の人――稲葉先生だっけ。まだ聞こえてるうちに、ちゃんと聞いてやりたいな" },
    { name:"三重", text:"まだ聞こえてる？" },
    { name:"両馬", text:"先生の声。まだ、生きて喋ってくれてる声。爺ちゃんの声はもう聞こえないけど、先生の声はまだ聞ける。聞けるうちに、ちゃんと聞くべきだと思う" },
    { heart:2, flag:"FLAG_RYOMA", name:null, text:"【両馬の祖父の話を聞いた】\n彼にとってこれは、ヘイカツのためだけでなく、自分自身の中の何かに区切りをつける機会でもあった。", next:"hub_return" }
  ],

  "route_minamitou": [
    { bg:"bg_sakura_namiki.png", bgm:"bgm11", cg:"cg_17", chara:[{id:"chr_mie_01_reishou.png", pos:"left"}, {id:"chr_mitsumine_02_tukkomi.png", pos:"right"}], name:"三峰", text:"あんたが北棟から出向いてくるの、珍しいじゃん" },
    { name:"三重", text:"頼みがある。ヘイカツの……いや、うちの地理の先生のことで" },
    { name:null, text:"事情を話すと、三峰は驚いた顔をしたあと、すぐに真剣な顔になった。" },
    { name:"三峰", text:"櫻と内藤さんも呼ぶよ。あの合同課題のとき、あんたたちの班、うちの学校の生徒にも影響与えてたし" },
    { bg:"bg_minamitou_kyoshitsu.png", cg:"cg_18", chara:[{id:"chr_mitsumine_03_egao.png", pos:"left"}, {id:"chr_sakura_02_shinken.png", pos:"center"}, {id:"chr_naitou_01_tsujou.png", pos:"right"}], name:"櫻", text:"地理の先生、ですか。私、一度も授業を受けたことがないので詳しくは知りませんが……" },
    { name:"内藤", text:"……あの、地理の先生って、塀先生のことですよね" },
    { name:"三重", text:"知ってんの？" },
    { chara:[{id:"chr_naitou_02_bishou.png", pos:"center"}], name:"内藤", text:"知ってるというか……本質配信、ずっと見てるので。よく名前が出てくるから" },
    { choices:[
      { text:"「見ててくれたのか」と素直に驚く", next:"route_minamitou_e1", heart:2, flag:"FLAG_MINAMITOU" },
      { text:"「意味わかんない配信、よく見てるな」と茶化す", next:"route_minamitou_e2", heart:1, flag:"FLAG_MINAMITOU" }
    ]}
  ],
  "route_minamitou_e1": [
    { cg:"cg_19", chara:[{id:"chr_naitou_05_yasashiime.png", pos:"center"}], name:"内藤", text:"意味は、わからないままでいいと思ってます。わからないまま、ちゃんと届いてるものってあるので" },
    { name:"三重", text:"……お前、いいこと言うな" },
    { name:"内藤", text:"そうですか？ ……よかったら、私にも手伝わせてください" },
    { chara:[{id:"chr_mitsumine_03_egao.png", pos:"left"}, {id:"chr_sakura_05_egao.png", pos:"right"}], name:"三峰", text:"あたしも手伝う。理数科の人たちのこと、もう他人事じゃないし" },
    { name:"櫻", text:"私も。恋愛学の研究とは違いますが……人と人が繋がる構造として、非常に興味深い事案です" },
    { name:"三重", text:"事案って言うな" },
    { name:"櫻", text:"すみません、癖です" },
    { heart:2, flag:"FLAG_MINAMITOU", name:null, text:"北棟だけの話だったものが、この日、初めて南棟にも広がった。\n国境は消えていない。けれど、その上を渡る人間は、確かに増えていた。", next:"hub_return" }
  ],
  "route_minamitou_e2": [
    { name:"内藤", text:"（少し寂しそうに笑って）……まあ、意味わかんないですけど。でも、なんか安心するんです" },
    { name:null, text:"茶化したことを、少しだけ後悔した。\nだが三峰がフォローし、三人はすぐに協力を申し出てくれた。" },
    { heart:1, flag:"FLAG_MINAMITOU", name:null, text:"【南棟の協力を得た】", next:"hub_return" }
  ],

  "route_meshino_kuraishi": [
    { bg:"bg_jimushitsu.png", bgm:"bgm12", chara:[{id:"chr_meshino_04_shinken.png", pos:"left"}, {id:"chr_futami_01_tsujou.png", pos:"right"}], name:"召野", text:"二見先生。ちょっと聞いていいですか" },
    { name:"二見", text:"なあに、改まって" },
    { name:"召野", text:"塀先生って、昔から窓の外を見る人でした？" },
    { name:null, text:"二見の表情が、一瞬だけ変わった。" },
    { cg:"cg_16", chara:[{id:"chr_futami_05_shinmiri.png", pos:"center"}], name:"二見", text:"……知ってるわよ、少しだけ" },
    { name:"召野", text:"教えてもらえますか" },
    { name:"二見", text:"ごめんね。それは、私の口から言うことじゃない気がする" },
    { choices:[
      { text:"「わかりました」とすぐに引き下がる", next:"route_meshino_f1", heart:2, flag:"FLAG_MESHINO_KURAISHI" },
      { text:"「少しだけでもヒントを」と食い下がる", next:"route_meshino_f2", heart:1, flag:"FLAG_MESHINO_KURAISHI" }
    ]}
  ],
  "route_meshino_f1": [
    { chara:[{id:"chr_futami_04_itazura.png", pos:"center"}], name:"二見", text:"でもね、本人から聞いてもらえたら、あの人、きっと嬉しいと思うわよ" },
    { name:"召野", text:"嬉しい、ですか。あの塀先生が" },
    { name:"二見", text:"地図を三年間、同じものを見せ続ける先生よ。待つことに慣れてる人。誰かが自分から聞きに来てくれるのを、実はずっと待ってるタイプだと思う" },
    { heart:2, flag:"FLAG_MESHINO_KURAISHI", name:"召野", text:"……そういうところ、二見先生とちょっと似てますね" },
    { name:"二見", text:"あら、それは褒めてるの？" },
    { name:"召野", text:"褒めてます。俺、そういう“待ってる人”に片思いする才能あるんで" },
    { name:"二見", text:"……もう、その話終わったでしょ" },
    { name:"召野", text:"終わってます。完了してます。今は普通に、先生の後押しをもらいに来ただけです" },
    { name:null, text:"召野は、職員室を出た。背中を押された気がした。", next:"route_kuraishi_part" }
  ],
  "route_meshino_f2": [
    { name:"二見", text:"（少し困った顔で）……ごめんね、やっぱり本人から聞いてあげて" },
    { name:"二見", text:"でも、待ってるタイプだと思うわ。誰かが聞きに来てくれるのを" },
    { heart:1, flag:"FLAG_MESHINO_KURAISHI", name:null, text:"食い下がった分、少し気まずさが残ったが、後押しは同じだった。", next:"route_kuraishi_part" }
  ],
  "route_kuraishi_part": [
    { bg:"bg_toshokan_shozoko.png", cg:"cg_14", bgm:"bgm12", chara:[{id:"chr_kuraishi_03_shinken.png", pos:"center"}], name:"倉石", text:"……ありました" },
    { name:null, text:"図書室の奥の書庫。埃をかぶった学校新聞の縮刷版。\n地学部の活動記録。指導にあたった外部講師の名前として「稲葉悌二」の文字。そして、その翌年の紙面には、小さな追悼記事があった。" },
    { chara:[{id:"chr_kuraishi_06_kotobaushinau.png", pos:"center"}], name:"倉石", text:"……これ。茶化していい話じゃないですね" },
    { name:null, text:"✝も、聖句も、原✝本質✝も、この瞬間の倉石の口からは出てこなかった。彼が初めて、自分の言葉だけで喋った瞬間だった。" },
    { bg:"bg_hokutou_kyoshitsu_hiru.png", cg:"cg_15", chara:[{id:"chr_kuraishi_03_shinken.png", pos:"left"}, {id:"chr_ryoma_04_kyuunimayao.png", pos:"center"}, {id:"chr_mie_07_honkishinken.png", pos:"right"}], name:"倉石", text:"先輩方。塀先生は、桐葉高校のOBです。理数科の卒業生で、当時の地学部の外部講師が、稲葉悌二という方でした" },
    { name:"三重", text:"……卒業生だったのか、あの人" },
    { name:"倉石", text:"はい。そして稲葉先生は、塀先生が卒業した翌年、事故で亡くなっています" },
    { chara:[{id:"chr_ryoma_04_kyuunimayao.png", pos:"center"}], name:"両馬", text:"……それだけじゃ、まだ何も分かってないのと同じだな" },
    { name:"倉石", text:"はい。でも、少なくとも――知らずに卒業するのだけは、避けられそうです" },
    { heart:2, flag:"FLAG_MESHINO_KURAISHI", name:null, text:"【倉石の調査で稲葉悌二の名に辿り着いた】", next:"hub_return" }
  ],

  "hub_return": [
    { name:null, text:"（HUBに戻ります）", hub:true }
  ],

  "shuusoku": [
    { bg:"bg_hokutou_kyoshitsu_yoru.png", bgm:"bgm13", notify:"収束章 - 地図を作る夜", cg:"cg_20" },
    { name:null, text:"放課後、誰もいなくなった教室。カーテンを閉め、電気だけをつけた、秘密基地のような空気。\n\n砂糖の三年分の写真。零が整理したデータ。寺地の紙束。倉石の調査資料。両馬の祖父の話から着想を得た「意味のないものを大事にする」というコンセプト。南棟からは、三峰・櫻・内藤が持ち寄った合同課題の記録と、“わからないまま届いていた”という言葉。" },
    { chara:[{id:"chr_izaki_04_shinken.png", pos:"center"}], name:"伊崎", text:"じゃあ、まとめるぞ。何を、どういう形にする？" },
    { chara:[{id:"chr_rei_05_shinken.png", pos:"center"}], name:"零", text:"地図にしよう" },
    { name:"三重", text:"地図？" },
    { name:"零", text:"先生がずっと見せてきたのは、地形図だった。だったら、返すものも地図がいい。ただし――描くのは、山じゃなくて、俺たちの三年間" },
    { name:null, text:"零の提案に、全員が同時に頷いた。理屈より先に、しっくりきた。" },
    { name:null, text:"役割は自然と決まっていった。\n\n・砂糖が写真を選び、「等高線」代わりの帯として配置する。\n・零がレイアウトと配色を組む。\n・寺地が、それぞれの記憶に短い言葉（キャプション）をつける。\n・倉石が、年鑑の記録から日付と出来事を正確に拾い出す。\n・伊崎・伊豆見が模造紙とペンとタイムスケジュールを管理する。\n・三峰・櫻・内藤が、南棟側から見た三年間の記憶を書き加える。\n・召野が、英語の一言メッセージを隅に添える（誰も頼んでいないのに）。\n・両馬が、全体を見ながら、要所要所に✝を足していく――今度だけは、誰にも止められない。" },
    { chara:[{id:"chr_izumi_04_ketsui.png", pos:"left"}, {id:"chr_satou_05_camera.png", pos:"right"}], name:"伊豆見", text:"翠湖のマラソン、湖の位置はここでいいか？" },
    { name:"砂糖", text:"いい。俺が撮った写真、ここに貼る" },
    { chara:[{id:"chr_meshino_05_eigodoya.png", pos:"center"}], name:"召野", text:"片思いの本質のコーナー、作っていい？" },
    { name:"三重", text:"お前のための地図じゃねえよ" },
    { name:"召野", text:"先生のための地図だからこそ、俺の話も入れたい。先生には話してないけど、あの人妻云々の投稿、先生の同僚に向けたものだったわけだし" },
    { name:"三重", text:"余計拗れるからやめろ" },
    { chara:[{id:"chr_kuraishi_05_hokorashige.png", pos:"center"}], name:"倉石", text:"コーンスープの不在と帰還の記録も、正確な日付で入れました。半年と三日の空白です" },
    { name:"三重", text:"三日まで数えるな" },
    { name:"倉石", text:"記録は✝本質✝の義務です" },
    { name:"三重", text:"その言葉まだ言うのかよ" },
    { name:null, text:"茶化しと真剣が、いつも通りの比率で入り混じったまま、地図は少しずつ完成に近づいていった。" },
    { cg:"cg_22", name:null, text:"真夜中に近い時間、地図が完成した。\n翠湖はほとりに小さな足跡のイラストが添えられ、ハワイの溶岩台地は隅に「地図が追いつかない地面」という一言とともに描かれ、コーンスープの自販機は律儀に半年間の空白期間つきで記録され、糸魚川-静岡構造線は教室の中央を貫くように引かれ、その両側に味噌と餅の分布がちゃんと描き込まれていた。球技大会のコートには、二点差というスコアがそのまま残されていた。\n\n【思い出の地形図・完成】" },
    { cg:"cg_21", name:null, text:"最後に、両馬が地図の隅、誰も気づかないような小さな余白に、何かを書き足した。" },
    { chara:[{id:"chr_mie_07_honkishinken.png", pos:"center"}], name:"三重", text:"何書いたんだよ" },
    { name:"両馬", text:"見せない。先生が気づくかどうか、賭けだ" },
    { name:"三重", text:"賭けるなよ" },
    { name:"両馬", text:"（小さく笑って）……今回だけは、賭けじゃなくて、本気" },
    { heart:2, flag:"FLAG_IZAKI_IZUMI", name:null, text:"地図には、翌日の放課後に「先生を呼び出す口実」も一緒に用意されていた――謝恩会の準備という名目で、勝也に地理準備室から教室まで足を運んでもらう、ただそれだけの小さな罠。", next:"climax" }
  ],

  "climax": [
    { bg:"bg_hokutou_kyoshitsu_yuugata.png", bgm:"bgm14", notify:"クライマックス - 窓の外に、ずっといた人", cg:"cg_23" },
    { name:null, text:"謝恩会の準備、という口実で、勝也は北棟三年B組の教室に呼び出された。ドアを開けた瞬間、彼は言葉を失った。\n\n黒板いっぱいに広げられた、一枚の大きな地図。等高線の代わりに三年間の記憶が走り、湖のかわりに翠湖のマラソンが、山のかわりにハワイの溶岩台地が描かれている。" },
    { chara:[{id:"chr_katsuya_04_odoroki.png", pos:"center"}], name:"勝也", text:"……これは" },
    { chara:[{id:"chr_izaki_02_egao.png", pos:"center"}], name:"伊崎", text:"謝恩会の準備、っていうのは半分嘘です。すみません" },
    { chara:[{id:"chr_ryoma_07_shinkenketsui.png", pos:"center"}], name:"両馬", text:"先生に、渡したいものがあって" },
    { cg:"cg_24", name:null, text:"勝也が一歩、また一歩と教室に入ってくる。地図の前に立ち、翠湖の位置、ハワイの溶岩台地、コーンスープの自販機、糸魚川-静岡構造線を指でなぞる。何も言わない。" },
    { chara:[{id:"chr_katsuya_02_bishou.png", pos:"center"}], name:"勝也", text:"……全部、覚えてる" },
    { name:"勝也", text:"覚えてるが……こんな風に、地図にされると思わなかった" },
    { cg:"cg_25", chara:[{id:"chr_mie_07_honkishinken.png", pos:"left"}, {id:"chr_katsuya_01_tsujou.png", pos:"right"}], name:"三重", text:"先生。聞いていいですか" },
    { name:"勝也", text:"……何だ" },
    { name:"三重", text:"窓の外、いつも何を見てるんですか。授業中、五秒くらい黙って、何か言ってる。三年間、誰も聞かなかったけど" },
    { cg:"cg_26", bgm:"bgm14", name:null, text:"教室の空気が張り詰める。誰も茶化さない。両馬でさえ、黙っている。\n\n勝也が、いつもの癖で窓の外を見た。だが今回だけは、五秒では終わらなかった。十秒、十五秒――教室の誰もが息を止めて待った。" },
    { chara:[{id:"chr_katsuya_03_tooime.png", pos:"center"}], name:"勝也", text:"……お前ら、良い質問をするようになったな" },
    { name:null, text:"そして、彼はゆっくりと語り始めた。" },
    { cg:"cg_27", bg:"bg_yama_gensho_kaisou.png", name:null, text:"画面が褪色していく。山の上、地形図を広げる二人の若い男の姿。" },
    { chara:[{id:"chr_katsuya_07_kaisou.png", pos:"center"}], name:"勝也", text:"俺も、この学校の理数科出身だ。お前らの先輩にあたる" },
    { name:"勝也", text:"地学部の外部講師をしてくれてた人がいた。稲葉悌二先生。大学で地理学をやってた人で、休みのたびに部活の連中を山に連れて行っては、地図の読み方を教えてくれた" },
    { chara:[{id:"chr_inaba_01_yawarakaemi.png", pos:"center"}], name:"稲葉（回想）", text:"見ろ、勝也。この等高線の間隔。狭いところは崖だ。崖の下に道がある。なぜだと思う" },
    { chara:[{id:"chr_wakaki-katsuya_01_warai.png", pos:"center"}], name:"若き勝也（回想）", text:"……わかりません" },
    { name:"稲葉（回想）", text:"わからなくていい。今日わからなくても、いつかわかる日が来る。地図は、そのために描いてある" },
    { chara:[{id:"chr_katsuya_07_kaisou.png", pos:"center"}], name:"勝也", text:"稲葉先生の口癖だった。『地図は、まだ来ない誰かを待つために描くんだ。今わかる奴のためじゃない。いつかわかる奴のために描け』ってな" },
    { cg:"cg_28", bg:"bg_daigaku_yakou_kaisou.png", name:"勝也", text:"……俺は、大学に進んで、教職を取ろうとしてた。だが最後に会った日、少し生意気な口を利いた" },
    { name:"若き勝也（回想）", text:"先生の生き方、正直、俺にはちょっと向いてないと思います。ずっと山ばっかり見てて、それで食っていけるんですか" },
    { name:"稲葉（回想）", text:"……そうか" },
    { chara:[{id:"chr_katsuya_05_mewofuseru.png", pos:"center"}], name:"勝也", text:"それだけ言って、俺はその日、先生からの誘い――次の沢の調査、一緒に来ないかっていう誘いを、忙しいからって断った。次はある、と思ってた" },
    { cg:"cg_29", bg:"bg_yama_gensho_kaisou.png", se:"wind", name:"勝也", text:"次は、来なかった。梅雨の沢で、増水に巻き込まれたと聞いた。……最後に会った日、俺は先生に、ありがとうの一言も言ってない" },
    { cg:"cg_30", bg:"bg_taiikukan.png", bgm:"bgm15", chara:[{id:"chr_katsuya_08_namidawokoraeru.png", pos:"center"}], name:"勝也", text:"それから、癖になった。授業の合間、山が見える方角の窓を見ると――心の中で、先生に報告するようになった。『今日はこんな生徒がいました』ってな" },
    { name:"勝也", text:"同じ地図を三年見せ続けるのも、先生の教えをそのまま真似てるだけだ。今わかる奴のためじゃない。いつかわかる奴のために見せてる。……三年目のあの日、砂糖が手を挙げたとき、俺は本当は、五秒よりずっと長く、何も言えなかった" },
    { chara:[{id:"chr_satou_08_hikaru.png", pos:"center"}], name:"砂糖", text:"……知らなかった" },
    { name:"勝也", text:"言うことじゃないと思ってた。誰かに背負わせる話じゃない" },
    { cg:"cg_31", chara:[{id:"chr_katsuya_07_kaisou.png", pos:"center"}], name:"勝也", text:"……お前らの✝本質✝、三年間ずっと意味がわからないと思って聞いてた。だが、今わかった" },
    { chara:[{id:"chr_ryoma_04_kyuunimayao.png", pos:"center"}], name:"両馬", text:"……わかった、って" },
    { name:"勝也", text:"意味のないものに、意味があるかどうかわからないまま、大事にし続けること。それは俺が、稲葉先生にしてもらったのと同じことだ。お前らは、誰にも教わらずに、同じことをやってた" },
    { chara:[{id:"chr_mie_10_nakigao.png", pos:"center"}], name:"三重", text:"……別に、教わってないのは、そうすけど" },
    { name:"勝也", text:"三重" },
    { name:"三重", text:"は、はい" },
    { name:"勝也", text:"お前の『は？』のおかげで、俺の授業、三年間ずっと締まってた。ありがとうな" },
    { name:"三重", text:"……それ、今言うことすか" },
    { name:"勝也", text:"今しか言えないことだから、言う" },
    { cg:"cg_32", bgm:"bgm16", chara:[{id:"chr_terachi_06_maikuketsui.png", pos:"center"}], name:"寺地", text:"先生。最後に、聞いてもらっていいですか" },
    { name:"勝也", text:"……なんだ" },
    { name:null, text:"寺地が、倉石の年鑑からまとめた「一人ずつの一言」を、紙に書いて、いつものように読み上げ始める。ただし今回は、意味を探す配信ではない。意味が最初からわかっている言葉を、ただ届けるための朗読だった。" },
    { cg:"cg_33", name:"寺地", text:"三重県臣より。『は？』としか言えなかった三年間、実はずっと聞いてました。ありがとうございました" },
    { name:"寺地", text:"砂糖東洋より。窓の外、見てました。これからは堂々と見ます" },
    { name:"寺地", text:"数理零より。先生の授業、面白かったです。面白い以外の言葉が見つからないくらい、面白かったです" },
    { name:"寺地", text:"両馬二郎より。✝本質✝を笑わないでくれて、ありがとうございました" },
    { name:"寺地", text:"伊崎・伊豆見より。同じ地図を三年見せ続けてくれて、俺たちは、少しずつ違う場所を歩けるようになりました" },
    { name:"寺地", text:"召野カイトより。片思いの本質、教えてくれたのは先生の同僚でしたが、それを笑わずに聞いてくれたのは先生でした" },
    { name:"寺地", text:"倉石暁より。✝の付け方は間違ってたかもしれませんが、先生を尊敬する気持ちだけは、本物でした" },
    { name:"寺地", text:"三峰瑠衣・櫻優・内藤蘭より。国境の向こうの話だと思ってました。でも、境界線の✝本質✝も、先生が最初に教えてくれたことでした" },
    { name:"寺地", text:"――そして、寺地星より" },
    { chara:[{id:"chr_terachi_08_namida.png", pos:"center"}], name:"寺地", text:"意味がわからないものを、意味がわからないまま届け続けていいんだと、初めて思わせてくれたのが、先生の授業でした。ありがとうございました" },
    { cg:"cg_34", bgm:"bgm15", chara:[{id:"chr_katsuya_10_hareyakanaemi.png", pos:"center"}], name:"勝也", text:"稲葉先生。……今日は、こんな生徒たちでした" },
    { name:null, text:"それは、三年間で初めて、彼が声に出して報告した瞬間だった。" },
    { name:"勝也", text:"地面は忘れない。お前らも、覚えておけ。忘れなくていい。忘れなくていいから、たまに思い出してくれ。それだけで、十分だ" },
    { name:null, text:"（心PointとFlagを集計し、エンディングへ分岐します）", next:"ending_branch" }
  ],

  "ending_branch": [
    { bg:"bg_sotsugyoushiki_kaijou.png", bgm:"bgm17", cg:"cg_35", name:null, text:"翌日、卒業式。桜はまだ五分咲きだったが、それで十分だった。北棟と南棟、二つのネクタイが同じ並木道を通る。理数科三年B組の四十人が、最後にもう一度、あの教室に集まった。" },
    { chara:[{id:"chr_ryoma_02_niyari.png", pos:"left"}, {id:"chr_mie_09_sunaoemi.png", pos:"right"}], name:"両馬", text:"三年間、ありがとうございました" },
    { name:"三重", text:"お前が言うと締まらねえんだよ" },
    { name:"両馬", text:"締まらなくていい。それも✝本質✝だ" },
    { name:"三重", text:"……まあ" },
    { name:null, text:"「まあ」がまだ死語になっていないことに、誰もが少しだけ安心した。", ending:true }
  ],

  // Individual ending labels - will be shown as overlay via ending:true handling,
  // but we also keep text for gallery
  "ending_true": [
    { bg:"bg_kyoshitsu_suunengo.png", bgm:"bgm18", cg:"cg_end_true", name:null, text:"【TRUE END】「地面は、忘れない。」\n\n数年後。北棟三年B組――今はもう違う顔ぶれの教室で、勝也は同じ地形図を広げている。\n\n「同じ地図だ。前の代から、そのまた前の代からも、ずっと同じ。同じに見えるか？」\n\n教室の隅、新任教師として控えていた誰か――かつての教え子の一人が、その光景を見て、静かに笑う。\n\n彼は、放課後の職員室で、久しぶりに古い匿名掲示板を開いた。「ヘイカツスレ」。\n『地形の話を通じて、時間と人間の話をしてる。』\n誰が書いたのかは、わからない。わからないままでいい。\n地面は、忘れない。\n\n――完（TRUE END）" }
  ],
  "ending_mie": [
    { bg:"bg_hokutou_kyoshitsu_asa.png", bgm:"bgm19", cg:"cg_end_mie", name:null, text:"【GOOD END・三重編】「否定の向こう側」\n\n三重県臣は、教育学部に進学した。「人に何かを伝える仕事」に興味を持ったのは、あの日、寺地が読み上げた言葉が、自分でも驚くほど胸に残ったからだった。\n\n「……人に教えるとか、柄じゃないけど。柄じゃないことを、柄じゃないままやってみるのも、悪くないなと思って」\n\n三峰とは、今も連絡を取り合っている。「は？」のハモりは、今も健在だ。\n\n――完（三重編）" }
  ],
  "ending_satou": [
    { bg:"bg_hawaii_youganchi_kaisou.png", bgm:"bgm19", cg:"cg_end_satou", name:null, text:"【GOOD END・砂糖編】「見ている、それだけで」\n\n砂糖東洋は、地質・地理情報系の学科に進んだ。フィールド調査先で、堂々と空を見上げている。\n\n「見てる。今度は、見てないふりしない」\n\nスマートフォンの充電は、今でもよく切れる。だが、切れても平気になった。\n\n――完（砂糖編）" }
  ],
  "ending_rei": [
    { bg:"bg_toshoshitsu.png", bgm:"bgm19", cg:"cg_end_rei", name:null, text:"【GOOD END・零編】「面白いを仕事にする」\n\n数理零は、データサイエンス系の研究室に進んだ。「面白い」は今も彼の最高の褒め言葉だが、それとは別に、「大事」という言葉も、彼の語彙に加わった。\n\n「面白いことと、大事なこと。両方あるって、最近わかった」\n\n――完（零編）" }
  ],
  "ending_terachi": [
    { bg:"bg_hokutou_kyoshitsu_yuugata.png", bgm:"bgm19", cg:"cg_end_terachi", name:null, text:"【GOOD END・寺地編】「配信は続く」\n\n本質配信は、今も細々と続いている。登録者数は増えたり減ったりしているが、寺地はもう気にしていない。\n\n「意味がわからないまま、届け続ける。それでいいって、先生が教えてくれたから」\n\n机の引き出しには、また新しい紙束が増えていた。\n\n――完（寺地編）" }
  ],
  "ending_ryoma": [
    { bg:"bg_ryoma_ie_butsudan.png", bgm:"bgm19", cg:"cg_end_ryoma", name:null, text:"【GOOD END・両馬編】「✝本質✝、その後」\n\n両馬二郎は、祖父の墓の前で、変わらず笑っていた。\n\n「爺ちゃん、聞こえてる？ 俺、後輩に引き継いだよ。✝本質✝、まだ終わってない」\n\n倉石暁が、その隣で神妙な顔で手を合わせていた。\n\n――完（両馬編）" }
  ],
  "ending_izaki_izumi": [
    { bg:"bg_sakura_namiki.png", bgm:"bgm19", cg:"cg_end_izaki_izumi", name:null, text:"【GOOD END・伊崎+伊豆見編】「隣にいた二人、それぞれの歩幅」\n\n伊崎と伊豆見は、別々の大学に進んだ。それでも、月に一度は連絡を取り合っている。\n\n「隣にいなくても、離れたわけじゃないんだよな」\n「だな」\n\n――完（伊崎・伊豆見編）" }
  ],
  "ending_meshino": [
    { bg:"bg_jimushitsu.png", bgm:"bgm19", cg:"cg_end_meshino", name:null, text:"【GOOD END・召野編】「言葉を届ける」\n\n召野カイトは、国際系の学部で英語教育を学び始めた。「伝えたいことを、ちゃんと言葉にする」というテーマを、二見先生への片思いから見つけた男だった。\n\n「先生の窓の外の話、聞いてよかったです。言えなかった“ありがとう”、俺は言えるうちに言いたいので」\n\n――完（召野編）" }
  ],
  "ending_kuraishi": [
    { bg:"bg_toshokan_shozoko.png", bgm:"bgm19", cg:"cg_end_kuraishi", name:null, text:"【GOOD END・倉石編】「年鑑、完結せず」\n\n倉石暁は、✝本質✝年鑑を完結させなかった。完結させたら✝本質✝ではなくなる――それが、彼の三年間の結論だった。年鑑は、後輩に託された。\n\n「先輩方の代の記録は、ここまでです。あとは、これを読む誰かが、続きを書いてください」\n\n――完（倉石編）" }
  ],
  "ending_minamitou": [
    { bg:"bg_minamitou_kyoshitsu.png", bgm:"bgm19", cg:"cg_end_minamitou", name:null, text:"【GOOD END・南棟編】「境界のない春」\n\n櫻優と内藤蘭は、まだ理論通りには進んでいない。それでも、二人でいる時間は、確実に増えていた。\n\n「恋愛発生の法則、また一つ、書き換えないといけないかもしれません」\n「書き換えなくていいですよ、そんなの」\n\n三峰瑠衣は、今では理数科の教室に出入りする“公認”のような存在になっていた。\n\n――完（南棟編）" }
  ],
  "ending_normal": [
    { bg:"bg_sakura_namiki.png", bgm:"bgm20", cg:"cg_end_normal", name:null, text:"【NORMAL END】「見えないけど、ある」\n\n勝也は、あの日、全てを語ったわけではなかった。\n「ありがとう。……でも、この話は、また今度な」\nそう言って、彼は静かに教室を出ていった。\n\n「地図は、まだ途中だ。全部見せたら、面白くないだろう」\n\nそれでも、十分だった。わからないことが全部わかる必要はない。見えないけど、ある。それだけで、この三年間は報われた。\n\n――完（NORMAL）" }
  ],
  "ending_bittersweet": [
    { bg:"bg_hokutou_kyoshitsu_yoru.png", bgm:"bgm21", cg:"cg_end_bittersweet", name:null, text:"【BITTERSWEET END】「こぼれた地図」\n\n準備は、間に合わなかった。地図は未完成のまま、慌ただしく丸められて勝也に渡された。\n\n「……ぐだぐだになったな」\n「ぐだぐだでも、渡せただけマシだろ」\n\n勝也は、こぼれ落ちた地図の切れ端を一枚だけ拾い上げ、笑った。\n「……十分だ。完璧な地図より、こぼれた地図の方が、らしくていい」\n\nうまくはいかなかった。それでも、小さな灯りは、確かに残った。\n\n――完（BITTERSWEET）" }
  ],
  "ending_comedy": [
    { bg:"bg_toshokan_shozoko.png", bgm:"bgm22", cg:"cg_end_comedy", name:null, text:"【COMEDY SECRET END】「原✝本質✝、完全体」\n\n倉石の「グレートチェーン理論」が、なぜか完成してしまった。\n前-原✝本質✝、原✝本質✝、✝本質✝、亜✝本質✝、非✝本質✝――五段階モデルを、勝也まで巻き込んで検証する羽目になる。\n\n「……つまり、俺が窓の外を見てるのは、前-原✝本質✝の顕現だと言いたいのか」\n「その通りです！」\n「……本質、かもな」\n「先生まで言うな！！」\n\n――完（COMEDY SECRET）" }
  ],
  "ending_bonus": [
    { bg:"bg_suiko_hotori.png", bgm:"bgm23", cg:"cg_end_bonus", name:null, text:"【BONUS EXTRA】「また、この教室で」\n\n数年後の夏。翠湖のほとりに、理数科三年B組だった面々が、久しぶりに顔を揃えた。北棟組も、南棟組も。三峰も、櫻も、内藤も。\n\n「呼ばれたから来たが……お前ら、まだ✝本質✝とか言ってるのか」\n「言ってますよ。一生言います」\n「一生は長すぎるだろ」\n「長くない。✝本質✝に終わりはないんだよ」\n「は？」\n\n何年経っても、変わらないものがある。変わらないことが、こんなにも嬉しいと思える日が来るとは、誰も思っていなかった。\n\n地面は、忘れない。\n\n――完（BONUS EXTRA・全ED回収記念）" }
  ]
};

window.TIPS = [
  { id:"honshitsu", title:"✝本質✝", desc:"両馬二郎が生み出した合言葉。何にでも付く。定義した瞬間に本質ではなくなる、という逆説を抱える。作中では三重の“は？”と対になっている。" },
  { id:"katsuya", title:"塀勝也（ヘイカツ）", desc:"地理教師。同じ地形図を三年見せ、窓の外を五秒見る癖がある。元理数科生徒で、恩師・稲葉悌二への報告を日課にしている。" },
  { id:"inaba", title:"稲葉悌二", desc:"勝也の恩師。地学部外部講師。『地図はまだ来ない誰かを待つために描く』という言葉を残した。本特別編オリジナル人物。" },
  { id:"chikei", title:"地形図", desc:"勝也が三年間見せ続けた教材。等高線の向こうに人間の判断や時間が透けて見える、という授業が核にある。" },
  { id:"itoigawa", title:"糸魚川-静岡構造線", desc:"日本列島を分ける地質境界。作中では味噌・醤油・餅の東西分布と重ねて語られる、象徴的な“境界線”。" },
  { id:"cornsoup", title:"コーンスープの不在", desc:"北棟自販機から半年消えていたコーンスープ。ある時よりない時の方が存在感がある、という✝本質✝の象徴として何度も言及される。" },
  { id:"489", title:"489", desc:"ヘイカツスレに現れる匿名の第三者。『地形の話を通じて、時間と人間の話をしてる』という言葉を残した。正体は最後まで明かされない。" },
  { id:"feikatsu", title:"フェイカツ", desc:"両馬の裏アカウント。受験情報掲示板でヘイカツの語り口を真似て書き込む。✝がついているので正体はバレている。" },
  { id:"suiko", title:"翠湖マラソン", desc:"毎年五月の学校行事。湖畔の遊歩道を走りながら、零と寺地が“見えないけどある”について語り合う場でもある。" },
  { id:"hawaii", title:"ハワイ研修", desc:"二年次の合同課題優勝で勝ち取った海外研修。キラウエアの溶岩台地で『地面は忘れない』という言葉が生まれる。" },
  { id:"ball", title:"球技大会（二点差）", desc:"三年次のバスケ、三重が両馬にパスを出し、最後のシュートが外れて二点差で敗退。勝ち負けより“誰に託すか”が主題だった試合。" },
  { id:"shinshitsu", title:"本質配信", desc:"寺地星のYouTube企画。視聴者からの一言を紙に書いて読み上げ、意味を見出そうとする。一時は炎上・非公開化を経て、最終的に32人の密やかな場として再生する。" },
  { id:"nenkan", title:"✝本質✝年鑑", desc:"倉石暁が編纂する記録集。両馬の発言回数、三重の“は？”回数などを統計的に補正して記録する。未完のまま後輩へ託される。" }
];

window.ROUTE_DEFS = [
  { id:"route_satou", label:"A", title:"窓の外の続き", subtitle:"砂糖東洋・写真編", desc:"三年分の車窓とハワイの溶岩台地。「見てない」と言い張ってきた男が、初めて「見てた」を認める。", thumb:"🛰️", chara:"砂糖", flag:"FLAG_SATOU" },
  { id:"route_rei", label:"B", title:"面白いの向こう側", subtitle:"数理零・データ編", desc:"「面白い」以外の言葉を探す旅。詮索とお礼の違いを学び、彼は初めて“大事”と言う。", thumb:"📊", chara:"零", flag:"FLAG_REI" },
  { id:"route_terachi", label:"C", title:"最後の朗読、まだ早いけど", subtitle:"寺地星・配信編", desc:"暴露ではなく“ありがとう”の会にする。三年分の紙束が、先生への一言に変わる。", thumb:"📄", chara:"寺地", flag:"FLAG_TERACHI" },
  { id:"route_ryoma", label:"D", title:"祖父と✝本質✝", subtitle:"両馬二郎・仏間編", desc:"『これはなあ、本質だ』が口癖だった祖父。その声が消えた日、両馬は自分で言い始めた。", thumb:"🏠", chara:"両馬", flag:"FLAG_RYOMA" },
  { id:"route_minamitou", label:"E", title:"境界線の向こう側", subtitle:"南棟編 - 三峰・櫻・内藤", desc:"紺のネクタイが北棟の教室に入る。意味がわからないまま届いていたものが、ここにある。", thumb:"🌸", chara:"南棟", flag:"FLAG_MINAMITOU" },
  { id:"route_meshino_kuraishi", label:"F", title:"調査と応援", subtitle:"召野カイト + 倉石暁", desc:"二見先生の後押しと、書庫の埃。茶化しと本気のあわいを、二人が繋ぐ。", thumb:"📚", chara:"召野&倉石", flag:"FLAG_MESHINO_KURAISHI" }
];
