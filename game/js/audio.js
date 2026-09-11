/* ============================================================
   音響システム ― WebAudio による手続き生成 BGM / SE
   (BGM24曲・SEは全てコードから合成。音源ファイル不要)
   ============================================================ */
(function () {
  "use strict";

  const A = {
    ctx: null, master: null, bgmGain: null, seGain: null,
    revIn: null,
    current: null,        // 現在のBGM id
    schedTimer: null,
    schedUntil: 0,
    track: null,          // トラック定義
    vol: { bgm: 0.5, se: 0.6 },
  };

  /* ---------- 基盤 ---------- */
  A.ensure = function () {
    if (A.ctx) { if (A.ctx.state === "suspended") A.ctx.resume(); return; }
    const C = window.AudioContext || window.webkitAudioContext;
    A.ctx = new C();
    const comp = A.ctx.createDynamicsCompressor();
    comp.threshold.value = -18; comp.knee.value = 22; comp.ratio.value = 6;
    comp.attack.value = 0.008; comp.release.value = 0.26;
    A.master = A.ctx.createGain(); A.master.gain.value = 0.9;
    A.bgmGain = A.ctx.createGain(); A.bgmGain.gain.value = A.vol.bgm;
    A.seGain = A.ctx.createGain(); A.seGain.gain.value = A.vol.se;
    // 簡易リバーブ (フィードバックディレイ)
    A.revIn = A.ctx.createGain(); A.revIn.gain.value = 0.32;
    const d1 = A.ctx.createDelay(1.2), d2 = A.ctx.createDelay(1.2);
    d1.delayTime.value = 0.23; d2.delayTime.value = 0.37;
    const f1 = A.ctx.createBiquadFilter(); f1.type = "lowpass"; f1.frequency.value = 2600;
    const fb = A.ctx.createGain(); fb.gain.value = 0.52;
    A.revIn.connect(d1); d1.connect(f1); f1.connect(d2); d2.connect(fb); fb.connect(d1);
    d1.connect(A.master); d2.connect(A.master);
    A.bgmGain.connect(A.master); A.seGain.connect(A.master);
    A.bgmGain.connect(A.revIn); A.seGain.connect(A.revIn);
    A.comp = comp; A.master.connect(comp); comp.connect(A.ctx.destination);
  };
  A.setBGMVol = v => { A.vol.bgm = v; if (A.bgmGain) A.bgmGain.gain.value = v; };
  A.setSEVol = v => { A.vol.se = v; if (A.seGain) A.seGain.gain.value = v; };

  /* ---------- 楽器 ---------- */
  const NT = n => 440 * Math.pow(2, (n - 69) / 12); // MIDI番号→周波数

  function env(g, t, a, d, s, r, vel) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(vel, t + a);
    g.gain.linearRampToValueAtTime(vel * s, t + a + d);
    g.gain.setValueAtTime(vel * s, Math.max(t + a + d, t + r - 0.05));
    g.gain.linearRampToValueAtTime(0.0001, t + r);
  }
  // プラック(撥弦)
  A.pluck = (f, t, vel = .3, dur = .9, pan = 0) => {
    const o = A.ctx.createOscillator(), g = A.ctx.createGain(), p = A.ctx.createStereoPanner();
    o.type = "triangle"; o.frequency.value = f;
    const o2 = A.ctx.createOscillator(), g2 = A.ctx.createGain();
    o2.type = "sine"; o2.frequency.value = f * 2; g2.gain.value = .25;
    env(g, t, .008, .12, .28, dur, vel);
    o.connect(g); o2.connect(g2); g2.connect(g); p.pan.value = pan;
    g.connect(p); p.connect(A.bgmGain); o.start(t); o2.start(t); o.stop(t + dur + .1); o2.stop(t + dur + .1);
  };
  // ピアノ風
  A.piano = (f, t, vel = .3, dur = 1.6, pan = 0) => {
    const g = A.ctx.createGain(), p = A.ctx.createStereoPanner(); p.pan.value = pan;
    [1, 2, 3.01].forEach((m, i) => {
      const o = A.ctx.createOscillator(), og = A.ctx.createGain();
      o.type = i ? "sine" : "triangle"; o.frequency.value = f * m;
      og.gain.value = [1, .32, .12][i];
      o.connect(og); og.connect(g); o.start(t); o.stop(t + dur + .1);
    });
    env(g, t, .006, .3, .18, dur, vel);
    g.connect(p); p.connect(A.bgmGain);
  };
  // パッド
  A.pad = (f, t, vel = .12, dur = 3.4, pan = 0) => {
    const p = A.ctx.createStereoPanner(); p.pan.value = pan;
    const g = A.ctx.createGain();
    const fl = A.ctx.createBiquadFilter(); fl.type = "lowpass"; fl.frequency.value = 1300; fl.Q.value = .4;
    [0, .4, -.4].forEach(det => {
      const o = A.ctx.createOscillator();
      o.type = "sawtooth"; o.frequency.value = f; o.detune.value = det * 12;
      o.connect(fl); o.start(t); o.stop(t + dur + .2);
    });
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(vel, t + dur * .4);
    g.gain.setValueAtTime(vel, t + dur * .75);
    g.gain.linearRampToValueAtTime(0.0001, t + dur);
    fl.connect(g); g.connect(p); p.connect(A.bgmGain);
  };
  // ベル
  A.bell = (f, t, vel = .18, dur = 2.4, pan = 0) => {
    const p = A.ctx.createStereoPanner(); p.pan.value = pan;
    const g = A.ctx.createGain();
    [[1, 1], [2.76, .4], [5.4, .18]].forEach(([m, w]) => {
      const o = A.ctx.createOscillator(), og = A.ctx.createGain();
      o.type = "sine"; o.frequency.value = f * m; og.gain.value = w;
      o.connect(og); og.connect(g); o.start(t); o.stop(t + dur + .1);
    });
    env(g, t, .004, .5, .1, dur, vel);
    g.connect(p); p.connect(A.bgmGain);
  };
  // ソフトリード(ヴィブラート正弦)
  A.soft = (f, t, vel = .14, dur = 1.4, pan = 0) => {
    const o = A.ctx.createOscillator(), g = A.ctx.createGain(), p = A.ctx.createStereoPanner();
    p.pan.value = pan; o.type = "sine"; o.frequency.value = f;
    const lfo = A.ctx.createOscillator(), lg = A.ctx.createGain();
    lfo.frequency.value = 5.2; lg.gain.value = 3.2; lfo.connect(lg); lg.connect(o.detune);
    env(g, t, .05, .2, .6, dur, vel);
    o.connect(g); g.connect(p); p.connect(A.bgmGain);
    o.start(t); lfo.start(t); o.stop(t + dur + .1); lfo.stop(t + dur + .1);
  };
  // ベース
  A.bass = (f, t, vel = .16, dur = .8) => {
    const o = A.ctx.createOscillator(), g = A.ctx.createGain();
    o.type = "sine"; o.frequency.value = f;
    env(g, t, .01, .18, .5, dur, vel);
    o.connect(g); g.connect(A.bgmGain); o.start(t); o.stop(t + dur + .1);
  };
  // 電子音(零編)
  A.blip = (f, t, vel = .1, dur = .3) => {
    const o = A.ctx.createOscillator(), g = A.ctx.createGain();
    o.type = "square"; o.frequency.value = f;
    const fl = A.ctx.createBiquadFilter(); fl.type = "lowpass"; fl.frequency.value = 1800;
    env(g, t, .004, .05, .2, dur, vel);
    o.connect(fl); fl.connect(g); g.connect(A.bgmGain); o.start(t); o.stop(t + dur + .1);
  };
  // 汎用パーカッション
  A.perc = (t, vel = .1, bright = 3000) => {
    const len = .12, sr = A.ctx.sampleRate, buf = A.ctx.createBuffer(1, sr * len, sr);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 2.2);
    const s = A.ctx.createBufferSource(); s.buffer = buf;
    const fl = A.ctx.createBiquadFilter(); fl.type = "bandpass"; fl.frequency.value = bright; fl.Q.value = .8;
    const g = A.ctx.createGain(); g.gain.value = vel;
    s.connect(fl); fl.connect(g); g.connect(A.bgmGain); s.start(t);
  };

  /* ---------- トラック定義 ----------
     スケール: 配列はMIDI度数(スケール内)。コード進行は度数配列。
     melody: [beat, 度数(スケールidx|null=休符), 長さ] 列。 -1 でオクターブ下 */
  const SC = {
    pentaM: [0, 2, 4, 7, 9, 12, 14, 16, 19, 21],          // ペンタ(明)
    pentaM2: [0, 2, 4, 7, 9, 12],                          // 短ペンタ
    minor: [0, 2, 3, 5, 7, 8, 10, 12, 14, 15, 17, 19],     // 自然短音階
    dorian: [0, 2, 3, 5, 7, 9, 10, 12, 14, 15, 17, 19],
    maj: [0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19],
    lyd: [0, 2, 4, 6, 7, 9, 11, 12, 14, 16, 18, 19],
    yo: [0, 2, 5, 7, 9, 12, 14, 17, 19, 21],               // 陽音階(和風)
    yo2: [0, 3, 5, 7, 10, 12, 15, 17, 19, 22],             // 民謡音階(和風・陰)
    insen: [0, 1, 5, 7, 8, 12, 13, 17, 19, 20],            // 陰旋法
  };
  // コードは [ルートMIDI, 構成音(半音差...)] 
  const CH = {
    I: [0, [0, 4, 7]], IV: [0, [0, 5, 9]], V: [0, [0, 4, 7]],
    vi: [0, [0, 3, 7]], ii: [0, [0, 3, 7]], iii: [0, [0, 3, 7]],
    Im: [0, [0, 3, 7]], IVm: [0, [0, 3, 7]], Vm: [0, [0, 3, 7]],
    bVII: [0, [0, 4, 7]], VI: [0, [0, 4, 7]], III: [0, [0, 4, 7]],
    sus4: [0, [0, 5, 7]], aug: [0, [0, 4, 8]], dim: [0, [0, 3, 6]],
  };
  function shift(root, semis) { return root + semis; }

  const TRACKS = {
    // bgm01 プロローグ/回想ダイジェスト ― 軽快で少しノスタルジック
    bgm01: {
      bpm: 96, root: 60, scale: SC.pentaM, bars: 8,
      prog: ["I", "IV", "V", "vi", "I", "IV", "V", "V"],
      lead: { inst: "piano", vel: .22, pat: [[0, 4, 2], [1, 5, 1], [2, 3, 2], [4, 2, 2], [6, 3, 1], [7, 4, 2], [8, 5, 2], [10, 4, 1], [11, 2, 2], [12, 1, 2], [14, 0, 3]] },
      arp: "pluck", arpVel: .1, drums: false,
    },
    // bgm02 教室の日常 ― アップテンポ木琴風
    bgm02: {
      bpm: 118, root: 62, scale: SC.pentaM, bars: 8,
      prog: ["I", "V", "vi", "IV", "I", "V", "vi", "V"],
      lead: { inst: "pluck", vel: .2, pat: [[0, 0, 1], [1, 2, 1], [2, 4, 1], [3, 3, 1], [4, 4, 2], [6, 2, 1], [7, 3, 1], [8, 4, 1], [9, 5, 1], [10, 4, 1], [11, 2, 1], [12, 1, 2], [14, 0, 1], [15, 2, 1]] },
      arp: "pluck", arpVel: .08, drums: true, drumStyle: "light",
    },
    // bgm03 ✝本質✝ギャグ ― ピチカート
    bgm03: {
      bpm: 132, root: 64, scale: SC.pentaM2, bars: 4,
      prog: ["I", "IV", "V", "I"],
      lead: { inst: "pluck", vel: .22, pat: [[0, 4, .5], [.5, 3, .5], [1, 4, .5], [1.5, 5, .5], [2, 4, 1], [3.5, 2, .5], [4, 1, .5], [4.5, 2, .5], [5, 3, 1], [6, 2, .5], [6.5, 1, .5], [7, 0, 1]] },
      arp: null, drums: true, drumStyle: "comical",
    },
    // bgm04 地図保管庫 ― 静か、不穏さの一歩手前
    bgm04: {
      bpm: 66, root: 57, scale: SC.minor, bars: 8,
      prog: ["Im", "VI", "III", "IVm", "Im", "VI", "dim", "V"],
      lead: { inst: "soft", vel: .1, pat: [[0, 6, 4], [4, 4, 3], [8, 7, 4], [12, 5, 4]] },
      arp: null, padOn: true, sparse: true,
    },
    // bgm05 三重の独白 ― ピアノソロ、間が多い
    bgm05: {
      bpm: 58, root: 60, scale: SC.minor, bars: 8,
      prog: ["Im", "VI", "IVm", "V", "Im", "VI", "IVm", "V"],
      lead: { inst: "piano", vel: .2, pat: [[0, 5, 3], [4, 3, 2], [6, 2, 3], [10, 4, 2], [12, 3, 4], [16, 2, 2], [18, 0, 3], [22, 1, 2], [24, 3, 4]] },
      arp: null, sparse: true,
    },
    // bgm06 ルート共通・真剣な会話 ― アコギ基調
    bgm06: {
      bpm: 84, root: 60, scale: SC.pentaM, bars: 8,
      prog: ["I", "V", "vi", "IV", "I", "iii", "IV", "V"],
      lead: { inst: "pluck", vel: .16, pat: [[0, 3, 2], [2, 4, 1], [3, 5, 1], [4, 4, 2], [7, 2, 1], [8, 3, 2], [10, 1, 1], [11, 2, 1], [12, 3, 4]] },
      arp: "pluck", arpVel: .09,
    },
    // bgm07 砂糖編・車窓 ― 静かな走行感
    bgm07: {
      bpm: 100, root: 62, scale: SC.maj, bars: 8,
      prog: ["I", "iii", "IV", "IV", "I", "iii", "IV", "V"],
      lead: { inst: "soft", vel: .1, pat: [[0, 5, 3], [4, 4, 2], [6, 5, 2], [8, 7, 3], [12, 5, 2], [14, 4, 2]] },
      arp: "pluck", arpVel: .07, pulse: true,
    },
    // bgm08 零編・データ ― ミニマル電子音
    bgm08: {
      bpm: 92, root: 60, scale: SC.pentaM, bars: 4,
      prog: ["I", "IV", "vi", "V"],
      lead: { inst: "blip", vel: .09, pat: [[0, 6, 1], [1.5, 5, 1], [3, 7, 2], [5, 6, 1], [6.5, 4, 1], [8, 7, 1], [9.5, 6, 1], [11, 5, 2], [13, 4, 1], [14.5, 2, 2]] },
      arp: "blip", arpVel: .05, pulse: true,
    },
    // bgm09 寺地編・配信 ― 弾き語り風
    bgm09: {
      bpm: 78, root: 61, scale: SC.pentaM2, bars: 8,
      prog: ["I", "IV", "Im", "V", "I", "IV", "VI", "V"],
      lead: { inst: "piano", vel: .17, pat: [[0, 3, 2], [2, 4, 2], [4, 5, 3], [8, 4, 1], [9, 3, 1], [10, 2, 2], [12, 3, 2], [14, 1, 2], [16, 0, 4], [20, 2, 2], [22, 3, 2], [24, 4, 4]] },
      arp: "pluck", arpVel: .08,
    },
    // bgm10 両馬編・祖父 ― 和の穏やかさ
    bgm10: {
      bpm: 68, root: 60, scale: SC.yo2, bars: 8,
      prog: ["Im", "IVm", "Im", "V", "Im", "IVm", "VI", "V"],
      lead: { inst: "pluck", vel: .18, pat: [[0, 5, 2], [2, 4, 1], [3, 2, 1], [4, 4, 3], [8, 3, 2], [10, 4, 2], [12, 5, 3], [16, 4, 2], [18, 2, 1], [19, 1, 1], [20, 2, 4], [24, 1, 2], [26, 0, 4]] },
      padOn: true, arp: null,
    },
    // bgm11 南棟編・境界越え ― 軽やかな弦楽
    bgm11: {
      bpm: 88, root: 65, scale: SC.maj, bars: 8,
      prog: ["I", "V", "vi", "iii", "IV", "I", "IV", "V"],
      lead: { inst: "soft", vel: .1, pat: [[0, 6, 2], [2, 5, 1], [3, 6, 1], [4, 7, 2], [6, 5, 2], [8, 4, 2], [10, 5, 1], [11, 6, 1], [12, 7, 2], [14, 6, 2], [16, 5, 4]] },
      padOn: true, arp: "pluck", arpVel: .07,
    },
    // bgm12 召野＋倉石編 ― コミカルとシリアスの中間
    bgm12: {
      bpm: 104, root: 62, scale: SC.pentaM, bars: 8,
      prog: ["I", "iii", "IV", "V", "I", "vi", "IV", "V"],
      lead: { inst: "pluck", vel: .17, pat: [[0, 4, 1], [1, 3, 1], [2, 4, 1], [3, 5, 1], [4, 6, 2], [6, 4, 2], [8, 3, 1], [9, 2, 1], [10, 3, 2], [12, 4, 1], [13, 5, 1], [14, 4, 2]] },
      arp: "pluck", arpVel: .08, drums: true, drumStyle: "light",
    },
    // bgm13 収束章・地図を作る夜 ― 高揚感
    bgm13: {
      bpm: 108, root: 60, scale: SC.pentaM, bars: 8,
      prog: ["I", "V", "vi", "IV", "I", "V", "IV", "V"],
      lead: { inst: "piano", vel: .2, pat: [[0, 0, .5], [.5, 2, .5], [1, 4, .5], [1.5, 5, .5], [2, 7, 1], [3.5, 5, .5], [4, 4, 1], [5.5, 2, .5], [6, 4, 2], [8, 5, .5], [8.5, 4, .5], [9, 2, .5], [9.5, 4, .5], [10, 5, 1], [11.5, 7, .5], [12, 9, 2], [14, 7, 2]] },
      arp: "pluck", arpVel: .09, drums: true, drumStyle: "build", padOn: true,
    },
    // bgm14 クライマックス前半 ― 静かなストリングス
    bgm14: {
      bpm: 60, root: 57, scale: SC.minor, bars: 8,
      prog: ["Im", "VI", "III", "VII", "Im", "VI", "IVm", "V"],
      lead: { inst: "soft", vel: .11, pat: [[0, 7, 5], [6, 6, 3], [10, 5, 5], [16, 4, 4], [20, 5, 4], [24, 3, 7]] },
      padOn: true, arp: null, sparse: true,
    },
    // bgm15 クライマックス後半・主題曲
    bgm15: {
      bpm: 74, root: 60, scale: SC.maj, bars: 16,
      prog: ["I", "V", "vi", "IV", "I", "V", "IV", "V", "vi", "IV", "I", "V", "vi", "IV", "V", "I"],
      lead: { inst: "piano", vel: .22, pat: [[0, 4, 2], [2, 5, 1], [3, 4, 1], [4, 2, 2], [6, 4, 2], [8, 7, 2], [10, 5, 1], [11, 4, 1], [12, 5, 2], [14, 2, 2], [16, 0, 2], [18, 2, 1], [19, 4, 1], [20, 5, 2], [22, 7, 2], [24, 9, 3], [28, 7, 2], [30, 5, 1], [31, 4, 1], [32, 5, 2], [34, 4, 2], [36, 2, 4], [40, 4, 4], [44, 2, 2], [46, 0, 4], [50, 2, 2], [52, 4, 4], [56, 5, 2], [58, 7, 2], [60, 9, 4]] },
      padOn: true, arp: "pluck", arpVel: .08, drums: true, drumStyle: "light",
    },
    // bgm16 最後の朗読 ― 声を邪魔しない
    bgm16: {
      bpm: 54, root: 60, scale: SC.pentaM, bars: 8,
      prog: ["I", "IV", "vi", "V", "I", "IV", "vi", "V"],
      lead: { inst: "bell", vel: .1, pat: [[0, 4, 4], [4, 5, 4], [8, 7, 4], [12, 5, 4], [16, 4, 4], [20, 2, 4], [24, 0, 4], [28, 2, 4]] },
      padOn: true, arp: null, sparse: true,
    },
    // bgm17 卒業式 ― 温かい合唱
    bgm17: {
      bpm: 70, root: 62, scale: SC.maj, bars: 8,
      prog: ["I", "V", "vi", "IV", "I", "V", "IV", "I"],
      lead: { inst: "soft", vel: .12, pat: [[0, 4, 3], [3, 5, 3], [6, 4, 2], [8, 7, 3], [11, 5, 3], [14, 4, 2], [16, 5, 3], [19, 4, 3], [22, 2, 2], [24, 4, 6]] },
      padOn: true, arp: "bell", arpVel: .06,
    },
    // bgm18 TRUE END 主題曲フル
    bgm18: {
      bpm: 76, root: 60, scale: SC.maj, bars: 16,
      prog: ["I", "V", "vi", "IV", "I", "iii", "IV", "V", "vi", "iii", "IV", "I", "IV", "V", "I", "I"],
      lead: { inst: "piano", vel: .24, pat: [[0, 4, 2], [2, 5, 2], [4, 7, 2], [6, 9, 2], [8, 7, 2], [10, 5, 1], [11, 4, 1], [12, 5, 4], [16, 2, 2], [18, 4, 2], [20, 5, 2], [22, 7, 2], [24, 9, 4], [28, 7, 2], [30, 5, 2], [32, 4, 2], [34, 5, 2], [36, 7, 4], [40, 5, 2], [42, 4, 2], [44, 2, 4], [48, 0, 4], [52, 2, 2], [54, 4, 2], [56, 5, 4], [60, 4, 4]] },
      padOn: true, arp: "bell", arpVel: .07, drums: true, drumStyle: "light",
    },
    // bgm19 GOOD END 主題変奏
    bgm19: {
      bpm: 80, root: 63, scale: SC.maj, bars: 8,
      prog: ["I", "V", "vi", "IV", "I", "V", "IV", "I"],
      lead: { inst: "piano", vel: .2, pat: [[0, 7, 2], [2, 5, 2], [4, 4, 2], [6, 5, 2], [8, 7, 2], [10, 9, 2], [12, 7, 4], [16, 5, 2], [18, 4, 2], [20, 2, 2], [22, 4, 2], [24, 5, 4], [28, 4, 4]] },
      padOn: true, arp: "pluck", arpVel: .08,
    },
    // bgm20 NORMAL END 余韻
    bgm20: {
      bpm: 62, root: 60, scale: SC.pentaM, bars: 8,
      prog: ["I", "IV", "I", "V", "I", "IV", "vi", "V"],
      lead: { inst: "piano", vel: .15, pat: [[0, 4, 3], [4, 5, 3], [8, 4, 3], [12, 2, 3], [16, 1, 3], [20, 2, 3], [24, 0, 7]] },
      padOn: true, arp: null, sparse: true,
    },
    // bgm21 BITTERSWEET
    bgm21: {
      bpm: 70, root: 59, scale: SC.minor, bars: 8,
      prog: ["Im", "VI", "IVm", "V", "Im", "VI", "IVm", "V"],
      lead: { inst: "piano", vel: .18, pat: [[0, 5, 2], [2, 6, 2], [4, 7, 3], [8, 6, 2], [10, 5, 2], [12, 4, 3], [16, 5, 2], [18, 4, 2], [20, 2, 3], [24, 3, 2], [26, 2, 2], [28, 0, 4]] },
      padOn: true, arp: "pluck", arpVel: .07,
    },
    // bgm22 COMEDY SECRET
    bgm22: {
      bpm: 138, root: 64, scale: SC.pentaM2, bars: 4,
      prog: ["I", "IV", "V", "I"],
      lead: { inst: "pluck", vel: .24, pat: [[0, 0, .5], [.5, 2, .5], [1, 4, .5], [1.5, 5, .5], [2, 7, .5], [2.5, 5, .5], [3, 4, 1], [4, 5, .5], [4.5, 4, .5], [5, 2, .5], [5.5, 4, .5], [6, 5, .5], [6.5, 7, .5], [7, 9, 1], [8, 7, .5], [8.5, 5, .5], [9, 4, .5], [9.5, 5, .5], [10, 7, .5], [10.5, 4, .5], [11, 2, 1], [12, 4, 2], [14, 0, 2]] },
      arp: "pluck", arpVel: .1, drums: true, drumStyle: "comical",
    },
    // bgm23 BONUS 同窓会(ノスタルジック)
    bgm23: {
      bpm: 84, root: 67, scale: SC.pentaM, bars: 8,
      prog: ["I", "IV", "V", "vi", "I", "iii", "IV", "I"],
      lead: { inst: "bell", vel: .16, pat: [[0, 5, 2], [2, 6, 2], [4, 7, 3], [8, 6, 1], [9, 5, 1], [10, 4, 2], [12, 5, 3], [16, 4, 2], [18, 3, 1], [19, 4, 1], [20, 5, 3], [24, 4, 2], [26, 2, 2], [28, 0, 4]] },
      arp: "pluck", arpVel: .09, padOn: true,
    },
    // bgm24 スタッフロール
    bgm24: {
      bpm: 100, root: 60, scale: SC.maj, bars: 16,
      prog: ["I", "V", "vi", "IV", "I", "V", "vi", "IV", "I", "iii", "IV", "V", "vi", "IV", "I", "V"],
      lead: { inst: "pluck", vel: .18, pat: [[0, 4, 1], [1, 5, 1], [2, 7, 2], [4, 5, 1], [5, 7, 1], [6, 9, 2], [8, 7, 1], [9, 5, 1], [10, 4, 2], [12, 2, 1], [13, 4, 1], [14, 5, 2], [16, 7, 1], [17, 9, 1], [18, 11, 2], [20, 9, 1], [21, 7, 1], [22, 9, 2], [24, 7, 2], [26, 5, 2], [28, 4, 4], [32, 2, 1], [33, 4, 1], [34, 5, 2], [36, 4, 1], [37, 2, 1], [38, 4, 2], [40, 5, 2], [42, 7, 2], [44, 5, 4], [48, 4, 4]] },
      arp: "pluck", arpVel: .1, drums: true, drumStyle: "light", padOn: true,
    },
  };

  /* ---------- スケジューラ ---------- */
  function noteFor(track, bar, beat) {
    const B = 60 / track.bpm / 2; // 8分音符単位
    return B;
  }

  function scheduleBar(track, barIdx, t0) {
    const beat = 60 / track.bpm;
    const eighth = beat / 2;
    const barLen = beat * 4;
    const root = track.root;
    const chordName = track.prog[barIdx % track.prog.length];
    const ch = CH[chordName];
    // コードアルペジオ/パッド
    if (track.padOn) {
      ch[1].forEach((iv, i) => A.pad(NT(root + iv), t0 + i * .02, .07, barLen * 1.05, (i - 1) * .3));
    }
    if (track.arp) {
      const pattern = [0, 1, 2, 1];
      for (let e = 0; e < 8; e++) {
        const iv = ch[1][pattern[e % pattern.length] % ch[1].length];
        const inst = track.arp;
        if (inst === "pluck") A.pluck(NT(root + 12 + iv), t0 + e * eighth, track.arpVel, .7, (e % 2 ? .25 : -.25));
        else if (inst === "blip") A.blip(NT(root + 24 + iv), t0 + e * eighth, track.arpVel, .22);
        else if (inst === "bell") A.bell(NT(root + 12 + iv), t0 + e * eighth, track.arpVel, 1.8, 0);
      }
    }
    // ベース
    A.bass(NT(root - 12 + ch[1][0]), t0, .13, beat * 2);
    A.bass(NT(root - 12 + ch[1][0]), t0 + beat * 2.5, .09, beat * 1.2);
    // ドラム風
    if (track.drums) {
      const style = track.drumStyle;
      A.perc(t0, .07, style === "comical" ? 1600 : 2200);
      A.perc(t0 + beat * 2, .07, style === "comical" ? 1600 : 2200);
      if (style !== "light") { A.perc(t0 + beat, .045, 4200); A.perc(t0 + beat * 3, .045, 4200); }
      if (style === "build") { for (let e = 4; e < 8; e++) A.perc(t0 + e * eighth, .03, 5200); }
    }
    // メロディ (pat: [8分単位の位置, スケールidx, 長さ(8分単位)])
    const mel = track.lead;
    for (const [pos, deg, len] of mel.pat) {
      const barPos = barIdx * 8;
      const total8 = track.prog.length * 8;
      const p = pos % total8;
      if (p >= barPos && p < barPos + 8) {
        const t = t0 + (p - barPos) * eighth;
        const f = NT(root + track.scale[deg % track.scale.length] + 12 * Math.floor(deg / track.scale.length));
        const vel = mel.vel;
        if (mel.inst === "piano") A.piano(f, t, vel, len * eighth * 1.6);
        else if (mel.inst === "pluck") A.pluck(f, t, vel, len * eighth * 1.5);
        else if (mel.inst === "soft") A.soft(f, t, vel, len * eighth * 1.3);
        else if (mel.inst === "bell") A.bell(f, t, vel, len * eighth * 2);
        else if (mel.inst === "blip") A.blip(f, t, vel, len * eighth);
      }
    }
  }

  function schedLoop() {
    if (!A.track) return;
    const ahead = A.ctx.currentTime + 0.35;
    while (A.schedUntil < ahead) {
      const barIdx = A.track._bar % A.track.prog.length;
      scheduleBar(A.track, barIdx, A.schedUntil);
      A.schedUntil += (60 / A.track.bpm) * 4;
      A.track._bar++;
    }
  }

  A.playBGM = function (id, fade = 1.2) {
    A.ensure();
    if (A.current === id) return;
    A.stopBGM(fade * .5);
    const def = TRACKS[id] || TRACKS.bgm01;
    A.current = id;
    const startDelay = .08;
    A.track = Object.assign({}, def, { _bar: 0 });
    A.schedUntil = A.ctx.currentTime + startDelay + (fade * .6);
    // フェードイン
    const target = A.vol.bgm;
    A.bgmGain.gain.cancelScheduledValues(A.ctx.currentTime);
    A.bgmGain.gain.setValueAtTime(0.0001, A.ctx.currentTime);
    A.bgmGain.gain.linearRampToValueAtTime(target, A.ctx.currentTime + fade);
    A.schedTimer = setInterval(schedLoop, 120);
    schedLoop();
  };
  A.stopBGM = function (fade = 1.0) {
    if (!A.ctx) return;
    if (A.schedTimer) { clearInterval(A.schedTimer); A.schedTimer = null; }
    A.track = null; A.current = null;
    const t = A.ctx.currentTime;
    A.bgmGain.gain.cancelScheduledValues(t);
    A.bgmGain.gain.setValueAtTime(A.bgmGain.gain.value, t);
    A.bgmGain.gain.linearRampToValueAtTime(0.0001, t + fade);
  };

  /* ---------- SE ---------- */
  function noiseBuf(len, curve = 2) {
    const sr = A.ctx.sampleRate, n = Math.floor(sr * len);
    const buf = A.ctx.createBuffer(1, n, sr), d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, curve);
    return buf;
  }
  function playNoise(t, dur, vel, freq, q = 1, type = "bandpass") {
    const s = A.ctx.createBufferSource(); s.buffer = noiseBuf(dur);
    const fl = A.ctx.createBiquadFilter(); fl.type = type; fl.frequency.value = freq; fl.Q.value = q;
    const g = A.ctx.createGain(); g.gain.value = vel;
    s.connect(fl); fl.connect(g); g.connect(A.seGain); s.start(t);
  }
  function tone(t, f, dur, vel, type = "sine", slideTo) {
    const o = A.ctx.createOscillator(), g = A.ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    g.gain.setValueAtTime(vel, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(A.seGain); o.start(t); o.stop(t + dur + .05);
  }

  const SE = {
    se_decide: t => { tone(t, 880, .09, .12, "sine"); tone(t + .05, 1320, .12, .1); },
    se_cursor: t => { tone(t, 660, .05, .06, "triangle"); },
    se_page: t => { playNoise(t, .18, .25, 2400, .6); },
    se_paper: t => { playNoise(t, .3, .2, 1500, .8); playNoise(t + .12, .22, .16, 3000, .7); },
    se_chime: t => { [523.25, 659.25, 783.99].forEach((f, i) => tone(t + i * .16, f, .5, .1, "sine")); },
    se_notif: t => { tone(t, 1046.5, .12, .12); tone(t + .13, 1318.5, .2, .12); },
    se_shutter: t => { playNoise(t, .05, .4, 5000, .5); playNoise(t + .06, .06, .3, 3500, .6); },
    se_pen: t => { for (let i = 0; i < 5; i++) playNoise(t + i * .07, .05, .08, 3200 + Math.random() * 1500, 2); },
    se_bell: t => { tone(t, 220, 3.2, .22, "sine"); tone(t, 440, 2.6, .1); tone(t + .02, 653, 2.2, .05); },
    se_applause: t => { for (let i = 0; i < 40; i++) playNoise(t + Math.random() * 1.6, .04, .12, 1800 + Math.random() * 2600, 1.2); },
    se_wind: t => { playNoise(t, 2.4, .16, 500, .4, "lowpass"); },
    se_door: t => { playNoise(t, .1, .2, 300, .8, "lowpass"); tone(t + .08, 120, .18, .16, "sine", 60); },
    se_ohm: t => { tone(t, 523.25, 1.8, .1); tone(t + .02, 784, 1.6, .07); tone(t + .05, 1046.5, 1.4, .05); },
    se_heart: t => { tone(t, 66, .16, .3, "sine", 40); tone(t + .22, 60, .2, .24, "sine", 36); },
    se_sakura: t => { playNoise(t, 1.8, .07, 900, .5, "lowpass"); },
    se_typewriter: t => { tone(t, 2200 + Math.random() * 500, .02, .04, "square"); },
  };

  A.playSE = function (id) {
    A.ensure();
    const fn = SE[id]; if (!fn) return;
    fn(A.ctx.currentTime + .01);
  };

  A.TRACK_IDS = Object.keys(TRACKS);
  window.AudioSys = A;
})();
