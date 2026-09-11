/* ============================================================================
   audio.js ―― 仮音源（WebAudio による手続き生成 BGM / SE）
   素材が未入手のあいだも「音のあるノベルゲーム」になるように、主題旋律を
   合成する。実音源（ogg/mp3）が揃ったら themes[id].file を指定するだけで、
   その曲だけループ素材再生に切り替わる。
   ========================================================================== */

const SCALE = {
  major: [0, 2, 4, 5, 7, 9, 11],
  minor: [0, 2, 3, 5, 7, 8, 10],
  pent: [0, 3, 5, 7, 10],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  lydian: [0, 2, 4, 6, 7, 9, 11],
};

/** bgm01〜bgm24（企画書 第9章のキューシート準拠） */
const THEMES = {
  bgm01: { root: 57, scale: 'lydian', bpm: 76, mood: 'prologue', motif: [0, 2, 4, 2, 5, 4, 2, 0], pad: .16, pluck: .3, amb: 'wind' },
  bgm02: { root: 60, scale: 'major', bpm: 108, mood: 'daily', motif: [0, 4, 2, 5, 4, 2, 0, -1], pad: .1, pluck: .34, amb: 'crowd' },
  bgm03: { root: 62, scale: 'pent', bpm: 126, mood: 'gag', motif: [0, 3, 2, 0, 4, 2, 5, 3], pad: .06, pluck: .4, amb: null },
  bgm04: { root: 50, scale: 'minor', bpm: 62, mood: 'mystery', motif: [0, 3, 2, 5, 3, 0, -2, 0], pad: .22, pluck: .14, amb: 'dust' },
  bgm05: { root: 55, scale: 'minor', bpm: 58, mood: 'monologue', motif: [0, 4, 3, 0, 5, 4, 2, 0], pad: .1, pluck: .3, amb: null },
  bgm06: { root: 59, scale: 'dorian', bpm: 84, mood: 'serious', motif: [0, 2, 4, 5, 4, 2, 0, 2], pad: .14, pluck: .24, amb: null },
  bgm07: { root: 53, scale: 'lydian', bpm: 66, mood: 'train', motif: [0, 4, 2, 4, 7, 4, 2, 0], pad: .2, pluck: .18, amb: 'train' },
  bgm08: { root: 57, scale: 'pent', bpm: 92, mood: 'data', motif: [0, 2, 1, 3, 2, 4, 3, 5], pad: .12, pluck: .26, amb: null },
  bgm09: { root: 55, scale: 'major', bpm: 74, mood: 'stream', motif: [0, 2, 4, 2, 0, 4, 5, 7], pad: .1, pluck: .32, amb: 'room' },
  bgm10: { root: 52, scale: 'pent', bpm: 64, mood: 'grandfather', motif: [0, 3, 4, 3, 0, -2, 0, 2], pad: .18, pluck: .28, amb: null },
  bgm11: { root: 62, scale: 'major', bpm: 96, mood: 'border', motif: [0, 2, 4, 7, 4, 2, 5, 4], pad: .12, pluck: .3, amb: null },
  bgm12: { root: 58, scale: 'dorian', bpm: 88, mood: 'investigate', motif: [0, 3, 2, 0, 3, 5, 4, 2], pad: .1, pluck: .34, amb: 'crowd' },
  bgm13: { root: 60, scale: 'major', bpm: 112, mood: 'build', motif: [0, 4, 7, 4, 9, 7, 4, 2], pad: .16, pluck: .36, amb: 'hands' },
  bgm14: { root: 48, scale: 'minor', bpm: 54, mood: 'confide', motif: [0, 2, 5, 3, 2, 0, -3, 0], pad: .26, pluck: .12, amb: 'wind' },
  bgm15: { root: 55, scale: 'major', bpm: 68, mood: 'theme', motif: [0, 4, 7, 4, 2, 5, 7, 11], pad: .3, pluck: .34, amb: null },
  bgm16: { root: 57, scale: 'minor', bpm: 60, mood: 'read', motif: [0, 3, 5, 3, 2, 0, -2, 0], pad: .12, pluck: .26, amb: 'room' },
  bgm17: { root: 60, scale: 'major', bpm: 72, mood: 'grad', motif: [0, 2, 4, 7, 9, 7, 4, 2], pad: .22, pluck: .28, amb: null },
  bgm18: { root: 62, scale: 'lydian', bpm: 66, mood: 'true', motif: [0, 4, 7, 11, 9, 7, 4, 2], pad: .3, pluck: .3, amb: 'wind' },
  bgm19: { root: 59, scale: 'major', bpm: 78, mood: 'good', motif: [0, 2, 5, 4, 2, 4, 7, 4], pad: .18, pluck: .28, amb: null },
  bgm20: { root: 53, scale: 'minor', bpm: 56, mood: 'normal', motif: [0, 3, 2, 0, -2, 0, 3, 5], pad: .2, pluck: .2, amb: 'wind' },
  bgm21: { root: 51, scale: 'minor', bpm: 62, mood: 'bitter', motif: [0, 3, 5, 3, 0, 2, 3, 0], pad: .22, pluck: .24, amb: null },
  bgm22: { root: 65, scale: 'pent', bpm: 132, mood: 'comedy', motif: [0, 2, 4, 2, 0, -2, 2, 4], pad: .06, pluck: .42, amb: 'crowd' },
  bgm23: { root: 60, scale: 'major', bpm: 70, mood: 'reunion', motif: [0, 4, 7, 4, 2, 5, 7, 9], pad: .24, pluck: .3, amb: 'water' },
  bgm24: { root: 57, scale: 'lydian', bpm: 80, mood: 'staff', motif: [0, 2, 4, 7, 5, 4, 2, 0], pad: .2, pluck: .3, amb: null },
};

const SE = {
  se01: { d: 'page' }, se_page: { d: 'page' },
  se02: { d: 'notify' }, se_notify: { d: 'notify' },
  se03: { d: 'shutter' }, se_shutter: { d: 'shutter' },
  se04: { d: 'crowd' }, se_crowd: { d: 'crowd' },
  se05: { d: 'chime' }, se_chime: { d: 'chime' },
  se06: { d: 'line' }, se_line: { d: 'line' },
  se07: { d: 'pen' }, se_pen: { d: 'pen' },
  se08: { d: 'window' }, se_window: { d: 'window' },
  se09: { d: 'wind' }, se_wind: { d: 'wind' },
  se10: { d: 'clap' }, se_clap: { d: 'clap' },
  se11: { d: 'breath' }, se_breath: { d: 'breath' },
  se12: { d: 'map' }, se_map: { d: 'map' },
  se13: { d: 'fountain' }, se_fountain: { d: 'fountain' },
  se14: { d: 'gym' }, se_gym: { d: 'gym' },
  se15: { d: 'bell' }, se_bell: { d: 'bell' },
  se_click: { d: 'click' }, se_hover: { d: 'hover' }, se_cursor: { d: 'cursor' },
  se_deny: { d: 'deny' }, se_photo: { d: 'photo' }, se_thud: { d: 'thud' },
  se_reveal: { d: 'reveal' }, se_tear: { d: 'tear' }, se_door: { d: 'door' },
};

const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
const prefersReducedAudio = () => { try { return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch(_) { return false; } };

export class GameAudio {
  constructor() {
    this.ctx = null;
    this.vol = { master: .85, bgm: .42, se: .7 };
    this.enabled = true;
    this.now = null;          // 再生中のテーマ
    this.nodes = null;
    this.timer = 0;
    this.step = 0;
    this.nextTime = 0;
    this.noiseBuf = null;
  }

  async init() {
    if (this.ctx || !this.enabled) return;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) { this.enabled = false; return; }
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      const comp = this.ctx.createDynamicsCompressor();
      comp.threshold.value = -18; comp.ratio.value = 6;
      this.master.connect(comp); comp.connect(this.ctx.destination);
      this.gBgm = this.ctx.createGain(); this.gBgm.connect(this.master);
      this.gSe = this.ctx.createGain(); this.gSe.connect(this.master);
      // 残響（簡易コンボリバーブ）
      this.conv = this.ctx.createConvolver();
      this.conv.buffer = this._impulse(2.4, 2.6);
      this.gRev = this.ctx.createGain(); this.gRev.gain.value = .5;
      this.conv.connect(this.gRev); this.gRev.connect(this.master);
      this._applyVol();
      if (this.ctx.state === 'suspended') await this.ctx.resume();
    } catch (e) { this.enabled = false; console.warn('[audio] off', e); }
  }
  _impulse(dur, decay) {
    const sr = this.ctx.sampleRate, len = sr * dur;
    const b = this.ctx.createBuffer(2, len, sr);
    for (let c = 0; c < 2; c++) {
      const d = b.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
    return b;
  }
  _noise() {
    if (this.noiseBuf) return this.noiseBuf;
    const sr = this.ctx.sampleRate, len = sr * 2;
    const b = this.ctx.createBuffer(1, len, sr);
    const d = b.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    this.noiseBuf = b;
    return b;
  }
  _applyVol() {
    if (!this.ctx) return;
    this.master.gain.value = this.vol.master;
    this.gBgm.gain.value = this.vol.bgm;
    this.gSe.gain.value = this.vol.se;
  }
  setVol(k, v) { this.vol[k] = Math.max(0, Math.min(1, v)); this._applyVol(); }

  /* ------------------------------------------------------------- BGM ------ */
  async bgm(id, fade = 1.6) {
    await this.init();
    if (!this.ctx) return;
    if (this.now === id) return;
    const t = this.ctx.currentTime;
    if (this.nodes) {
      const old = this.nodes;
      old.stopAt = t + Math.max(.05, fade);
      old.fade = Math.max(.05, fade);
    }
    this.now = id || null;
    if (!id) return;
    const th = THEMES[id] || THEMES.bgm02;
    const n = {
      gain: this.ctx.createGain(),
      chain: [],
      amb: null,
      stopAt: 0,
      fade: 1.2,
      theme: th,
    };
    n.gain.gain.setValueAtTime(0.0001, t);
    n.gain.gain.linearRampToValueAtTime(1, t + Math.max(.05, fade));
    n.gain.connect(this.gBgm);
    const send = this.ctx.createGain();
    send.gain.value = prefersReducedAudio() ? .06 : .3; send.connect(this.conv); send.connect(n.gain);
    n.send = send;
    this.nodes = n;
    this.step = 0;
    this.nextTime = t + .08;
    if (!this.timer) this.timer = setInterval(() => this._sched(), 26);
    if (th.amb) this._ambience(th.amb, n);
  }
  _ambience(kind, n) {
    if (prefersReducedAudio()) return;
    const src = this.ctx.createBufferSource();
    src.buffer = this._noise(); src.loop = true;
    const bp = this.ctx.createBiquadFilter();
    const g = this.ctx.createGain();
    g.gain.value = .0;
    const lfo = this.ctx.createOscillator(); const lg = this.ctx.createGain();
    lfo.frequency.value = .07; lg.gain.value = .004;
    lfo.connect(lg); lg.connect(g.gain);
    const map = {
      train: { f: 190, q: .6, type: 'lowpass', v: .1 },
      wind: { f: 620, q: .9, type: 'bandpass', v: .05 },
      crowd: { f: 900, q: .8, type: 'bandpass', v: .035 },
      dust: { f: 240, q: .7, type: 'lowpass', v: .03 },
      room: { f: 1400, q: 1.2, type: 'highpass', v: .022 },
      hands: { f: 700, q: .9, type: 'bandpass', v: .04 },
      water: { f: 1800, q: 1.1, type: 'bandpass', v: .035 },
    };
    const m = map[kind] || map.wind;
    bp.type = m.type; bp.frequency.value = m.f; bp.Q.value = m.q;
    g.gain.value = m.v;
    src.connect(bp); bp.connect(g); g.connect(n.gain); g.connect(n.send);
    src.start(); lfo.start();
    n.amb = { src, lfo, g, bp };
  }
  _sched() {
    const n = this.nodes;
    if (!n || !this.ctx) return;
    const t = this.ctx.currentTime;
    const spb = 60 / n.theme.bpm / 2;   // 8分音符
    if (n.stopAt) {
      n.gain.gain.cancelScheduledValues(t);
      n.gain.gain.setValueAtTime(n.gain.gain.value, t);
      n.gain.gain.linearRampToValueAtTime(0.0001, t + n.fade);
      const dead = n.stopAt;
      setTimeout(() => { try { n.amb && n.amb.src.stop(); n.amb && n.amb.lfo.stop(); n.gain.disconnect(); } catch (e) {} }, (dead - t + .3) * 1000);
      this.nodes = null; this.now = null;
      clearInterval(this.timer); this.timer = 0;
      return;
    }
    while (this.nextTime < t + .22) {
      this._emit(this.nextTime, n, this.step);
      this.step++;
      this.nextTime += spb;
    }
  }
  _emit(at, n, step) {
    const th = n.theme, sc = SCALE[th.scale] || SCALE.major;
    const deg = (i) => {
      const oct = Math.floor(i / sc.length);
      const idx = ((i % sc.length) + sc.length) % sc.length;
      return th.root + oct * 12 + sc[idx];
    };
    const bar = Math.floor(step / 8) % 4;
    const chordDegs = [[0, 2, 4], [3, 5, 7], [4, 6, 8], [2, 4, 6]][bar];
    // パッド（小節頭）
    if (step % 8 === 0) {
      chordDegs.forEach((d, i) => {
        const o = this.ctx.createOscillator(), g = this.ctx.createGain(), f = this.ctx.createBiquadFilter();
        o.type = th.mood === 'gag' || th.mood === 'comedy' ? 'triangle' : 'sine';
        o.frequency.value = mtof(deg(d) - 12);
        o.detune.value = (i - 1) * 5;
        f.type = 'lowpass'; f.frequency.value = th.pad > .2 ? 900 : 1500;
        const dur = (60 / th.bpm) * 4;
        g.gain.setValueAtTime(0.0001, at);
        g.gain.linearRampToValueAtTime(th.pad * .28, at + dur * .35);
        g.gain.linearRampToValueAtTime(0.0001, at + dur * .98);
        o.connect(f); f.connect(g); g.connect(n.gain); g.connect(n.send);
        o.start(at); o.stop(at + dur);
      });
    }
    // 旋律（音楽箱）
    const m = th.motif || [0, 2, 4, 2];
    const on = th.mood === 'gag' || th.mood === 'comedy' ? true : (step % 2 === 0 || (step + bar) % 5 === 0);
    const rest = (step % 16 === 14) || (th.mood === 'monologue' && step % 8 === 3);
    if (on && !rest) {
      const i = m[step % m.length] + (step % 32 >= 16 ? 7 : 0);
      const o = this.ctx.createOscillator(), g = this.ctx.createGain();
      o.type = 'sine';
      o.frequency.value = mtof(deg(i) + (th.mood === 'data' ? 24 : 12));
      const dec = th.mood === 'gag' ? .22 : .9;
      g.gain.setValueAtTime(0.0001, at);
      g.gain.linearRampToValueAtTime(th.pluck * .3, at + .012);
      g.gain.exponentialRampToValueAtTime(0.0001, at + dec);
      o.connect(g); g.connect(n.gain); g.connect(n.send);
      o.start(at); o.stop(at + dec + .05);
      if (th.mood === 'gag' || th.mood === 'comedy') {
        const o2 = this.ctx.createOscillator(), g2 = this.ctx.createGain();
        o2.type = 'square'; o2.frequency.value = mtof(deg(i) + 24);
        g2.gain.setValueAtTime(.04, at); g2.gain.exponentialRampToValueAtTime(.0001, at + .1);
        o2.connect(g2); g2.connect(n.gain); o2.start(at); o2.stop(at + .14);
      }
    }
    // バス（重音）
    if (step % 16 === 0) {
      const o = this.ctx.createOscillator(), g = this.ctx.createGain();
      o.type = 'sine'; o.frequency.value = mtof(deg(0) - 24);
      g.gain.setValueAtTime(0.0001, at);
      g.gain.linearRampToValueAtTime(.14, at + .1);
      g.gain.exponentialRampToValueAtTime(0.0001, at + 2.6);
      o.connect(g); g.connect(n.gain); o.start(at); o.stop(at + 2.7);
    }
  }
  duck(ms = 700) {
    if (!this.ctx || !this.nodes) return;
    const t = this.ctx.currentTime;
    const g = this.nodes.gain.gain;
    g.cancelScheduledValues(t);
    g.setValueAtTime(g.value, t);
    g.linearRampToValueAtTime(.35, t + .12);
    g.linearRampToValueAtTime(1, t + .12 + ms / 1000);
  }

  /* -------------------------------------------------------------- SE ------ */
  async se(id) {
    await this.init();
    if (!this.ctx || !id) return;
    const spec = SE[id];
    if (!spec) { console.debug('[se] 未定義:', id); return; }
    const t0 = this.ctx.currentTime + .005;
    const out = this.gSe;
    const burst = ({ dur = .18, type = 'bandpass', f = 1200, q = 1, v = .3, sweep = 0 }) => {
      const s = this.ctx.createBufferSource(); s.buffer = this._noise();
      const bi = this.ctx.createBiquadFilter(); bi.type = type; bi.Q.value = q;
      bi.frequency.setValueAtTime(f, t0);
      if (sweep) bi.frequency.exponentialRampToValueAtTime(Math.max(60, f * sweep), t0 + dur);
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.linearRampToValueAtTime(v, t0 + Math.min(.03, dur / 4));
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      s.connect(bi); bi.connect(g); g.connect(out); g.connect(this.conv);
      s.start(t0); s.stop(t0 + dur + .05);
    };
    const tone = ({ f = 660, dur = .3, type = 'sine', v = .16, to = 0, delay = 0 }) => {
      const o = this.ctx.createOscillator(), g = this.ctx.createGain();
      const at = t0 + delay;
      o.type = type; o.frequency.setValueAtTime(f, at);
      if (to) o.frequency.exponentialRampToValueAtTime(to, at + dur);
      g.gain.setValueAtTime(0.0001, at);
      g.gain.linearRampToValueAtTime(v, at + .008);
      g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
      o.connect(g); g.connect(out); g.connect(this.conv);
      o.start(at); o.stop(at + dur + .04);
    };
    switch (spec.d) {
      case 'page': burst({ dur: .17, f: 2600, v: .16, sweep: .3, q: .8 }); break;
      case 'click': burst({ dur: .05, f: 1800, v: .12 }); tone({ f: 880, dur: .07, v: .07 }); break;
      case 'hover': tone({ f: 1568, dur: .09, v: .045, type: 'triangle' }); break;
      case 'cursor': tone({ f: 1046, dur: .06, v: .05 }); break;
      case 'notify': tone({ f: 1046, dur: .5, v: .1 }); tone({ f: 1568, dur: .6, v: .08, delay: .1 }); break;
      case 'line': tone({ f: 1318, dur: .3, v: .09 }); tone({ f: 988, dur: .4, v: .07, delay: .12 }); break;
      case 'shutter': burst({ dur: .04, f: 3000, v: .3 }); tone({ f: 240, dur: .05, type: 'square', v: .12 }); burst({ dur: .1, f: 900, v: .1, }); break;
      case 'photo': tone({ f: 1760, dur: .05, v: .1 }); tone({ f: 1174, dur: .1, v: .06, delay: .04 }); break;
      case 'crowd': burst({ dur: 1.5, f: 700, v: .07, type: 'bandpass', q: .6 }); break;
      case 'gym': burst({ dur: 2.2, f: 480, v: .06, type: 'bandpass', q: .5 }); break;
      case 'chime': [1046, 1318, 1568, 2093].forEach((f, i) => tone({ f, dur: 1.4, v: .075, delay: i * .34 })); break;
      case 'bell': tone({ f: 415, dur: 3, v: .13, type: 'sine' }); tone({ f: 830, dur: 2.2, v: .05, delay: .02 }); tone({ f: 415, dur: 3, v: .09, delay: 1.4 }); break;
      case 'pen': for (let i = 0; i < 7; i++) setTimeout(() => burst({ dur: .05, f: 2400 + Math.random() * 900, v: .05 }), i * 62); break;
      case 'fountain': tone({ f: 520, dur: .22, v: .06, type: 'triangle', to: 320 }); burst({ dur: .3, f: 2200, v: .05 }); break;
      case 'window': burst({ dur: .8, f: 700, v: .1, sweep: 3.2, q: .7 }); break;
      case 'wind': burst({ dur: 2.4, f: 520, v: .07, type: 'bandpass', q: .7 }); break;
      case 'clap': for (let i = 0; i < 16; i++) setTimeout(() => burst({ dur: .09, f: 1500 + Math.random() * 1200, v: .07 }), i * 78 + Math.random() * 40); break;
      case 'breath': burst({ dur: 1.1, f: 480, v: .05, type: 'lowpass', q: .5 }); break;
      case 'map': burst({ dur: 1.1, f: 1500, v: .11, sweep: .35, q: .6 }); tone({ f: 220, dur: .3, v: .05, type: 'triangle' }); break;
      case 'thud': tone({ f: 150, dur: .28, v: .2, type: 'sine', to: 60 }); break;
      case 'door': tone({ f: 90, dur: .5, v: .18, type: 'sine', to: 45 }); burst({ dur: .2, f: 400, v: .05 }); break;
      case 'deny': tone({ f: 300, dur: .16, v: .1, type: 'square' }); tone({ f: 220, dur: .22, v: .08, type: 'square', delay: .09 }); break;
      case 'reveal': [523, 659, 784, 1046].forEach((f, i) => tone({ f, dur: 1.8, v: .07, delay: i * .12, type: 'triangle' })); break;
      case 'tear': burst({ dur: .4, f: 1100, v: .07, sweep: .4 }); break;
      default: burst({});
    }
  }
  stopAll() {
    if (this.nodes) { this.nodes.stopAt = this.ctx ? this.ctx.currentTime : 0; }
  }
}
export { THEMES, SE as SE_TABLE };
