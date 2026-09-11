/* ============================================================
   手続き生成オーディオ・エンジン（WebAudio）
   BGM 24曲＋効果音をすべて合成音でまかなう。
   音源ファイル不要・完全オフライン動作。
   ============================================================ */
(function (global) {
  'use strict';

  let ctx = null;
  let master = null;
  let bgmBus = null;
  let seBus = null;
  let current = null;          // 現在の曲id
  let schedTimer = null;
  let step = 0;
  let nextTime = 0;
  let track = null;

  const state = { bgmVol: 0.55, seVol: 0.7, muted: false };

  /* ---------- 音の素材になるヘルパー ---------- */
  function ac() {
    if (!ctx) {
      const AC = global.AudioContext || global.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain(); master.gain.value = state.muted ? 0 : 1; master.connect(ctx.destination);
      bgmBus = ctx.createGain(); bgmBus.gain.value = state.bgmVol; bgmBus.connect(master);
      seBus = ctx.createGain(); seBus.gain.value = state.seVol; seBus.connect(master);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function env(g, t, a, d, s, r, peak) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(peak, t + a);
    g.gain.exponentialRampToValueAtTime(Math.max(peak * s, 0.0001), t + a + d);
    g.gain.setValueAtTime(Math.max(peak * s, 0.0001), t + a + d + (r - a - d));
  }

  function tone(bus, t, freq, dur, opt) {
    opt = opt || {};
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = opt.type || 'sine';
    o.frequency.setValueAtTime(freq, t);
    if (opt.detune) o.detune.value = opt.detune;
    if (opt.glide) o.frequency.exponentialRampToValueAtTime(opt.glide, t + dur);
    const peak = opt.peak != null ? opt.peak : 0.2;
    const a = opt.a != null ? opt.a : 0.01;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(peak, t + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    let node = o;
    if (opt.filter) {
      const f = ctx.createBiquadFilter();
      f.type = opt.filter[0]; f.frequency.value = opt.filter[1]; f.Q.value = opt.filter[2] || 1;
      o.connect(f); node = f;
    }
    node.connect(g); g.connect(bus);
    o.start(t); o.stop(t + dur + 0.05);
  }

  function noise(bus, t, dur, opt) {
    opt = opt || {};
    const len = Math.max(1, Math.floor(ctx.sampleRate * dur));
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource(); src.buffer = buf;
    const f = ctx.createBiquadFilter();
    f.type = opt.type || 'bandpass'; f.frequency.value = opt.freq || 1000; f.Q.value = opt.q || 0.8;
    const g = ctx.createGain();
    const peak = opt.peak != null ? opt.peak : 0.1;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(peak, t + (opt.a || 0.005));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f); f.connect(g); g.connect(bus);
    src.start(t); src.stop(t + dur + 0.05);
  }

  /* ---------- BGM 定義（プリセット方式） ----------
     scale: 音階配列(半音) / prog: コード進行(度数) / drum: 打面パターン */
  const SCALES = {
    majorPenta: [0, 2, 4, 7, 9],
    minorPenta: [0, 3, 5, 7, 10],
    dorian:     [0, 2, 3, 5, 7, 9, 10],
    lydian:     [0, 2, 4, 6, 7, 9, 11],
    aeolian:    [0, 2, 3, 5, 7, 8, 10],
    yo:         [0, 2, 5, 7, 9],          // 日本音階（陽）
    inMinor:    [0, 2, 3, 7, 8],          // 日本音階（陰）
    whole:      [0, 2, 4, 6, 8, 10]
  };

  const TRACKS = {
    /* プロローグ/回想ダイジェスト：軽快で少しノスタルジック */
    bgm01: { root: 60, scale: 'majorPenta', bpm: 84, pad: [[0, 4, 7], [-3, 2, 5]], prog: 4, lead: 'pluck', seed: 1, air: 0.4 },
    /* 教室の日常：アップテンポ、木琴 */
    bgm02: { root: 65, scale: 'majorPenta', bpm: 108, pad: [[0, 4, 7]], prog: 2, lead: 'xylo', seed: 2, drum: 'soft' },
    /* ✝本質✝ギャグ：コミカルなピチカート */
    bgm03: { root: 67, scale: 'majorPenta', bpm: 122, pad: [], prog: 1, lead: 'pizz', seed: 3, drum: 'tick' },
    /* 地図保管庫：静か、不穏の一歩手前 */
    bgm04: { root: 57, scale: 'aeolian', bpm: 60, pad: [[0, 3, 7], [-3, 0, 5]], prog: 2, lead: 'none', seed: 4, air: 0.7 },
    /* 三重の独白：ピアノソロ、間が多い */
    bgm05: { root: 60, scale: 'minorPenta', bpm: 66, pad: [[0, 3, 7]], prog: 2, lead: 'piano', seed: 5, air: 0.8 },
    /* ルート共通：アコギ基調 */
    bgm06: { root: 62, scale: 'dorian', bpm: 88, pad: [[0, 3, 7], [5, 0, 3]], prog: 4, lead: 'guitar', seed: 6, air: 0.5 },
    /* 砂糖編：電車の走行音 */
    bgm07: { root: 60, scale: 'majorPenta', bpm: 96, pad: [[0, 4, 7]], prog: 2, lead: 'pluck', seed: 7, train: true, air: 0.4 },
    /* 零編：ミニマルな電子音 */
    bgm08: { root: 55, scale: 'whole', bpm: 76, pad: [[0, 5, 10]], prog: 2, lead: 'blip', seed: 8, air: 0.3 },
    /* 寺地編：弾き語り風、素朴 */
    bgm09: { root: 58, scale: 'majorPenta', bpm: 78, pad: [[0, 4, 7], [-3, 0, 4]], prog: 4, lead: 'guitar', seed: 9, air: 0.6 },
    /* 両馬編：和の穏やかさ */
    bgm10: { root: 57, scale: 'yo', bpm: 70, pad: [[0, 7]], prog: 2, lead: 'koto', seed: 10, air: 0.6 },
    /* 南棟編：軽やかな弦楽 */
    bgm11: { root: 64, scale: 'lydian', bpm: 92, pad: [[0, 4, 7], [2, 5, 9]], prog: 4, lead: 'pluck', seed: 11, air: 0.5 },
    /* 召野＋倉石編：コミカルとシリアスの中間 */
    bgm12: { root: 63, scale: 'dorian', bpm: 100, pad: [[0, 3, 7]], prog: 2, lead: 'pizz', seed: 12, drum: 'soft' },
    /* 収束章：手を動かす高揚感 */
    bgm13: { root: 62, scale: 'majorPenta', bpm: 104, pad: [[0, 4, 7], [5, 0, 4]], prog: 4, lead: 'pluck', seed: 13, drum: 'soft', air: 0.4 },
    /* クライマックス前半：静かなストリングス */
    bgm14: { root: 57, scale: 'aeolian', bpm: 56, pad: [[0, 3, 7, 10], [-3, 0, 5]], prog: 2, lead: 'none', seed: 14, air: 0.9 },
    /* クライマックス後半：フル編成（主題） */
    bgm15: { root: 60, scale: 'majorPenta', bpm: 62, pad: [[0, 4, 7], [-3, 0, 5], [2, 5, 9]], prog: 4, lead: 'bell', seed: 15, air: 0.9, swell: true },
    /* 最後の朗読：声を邪魔しない */
    bgm16: { root: 55, scale: 'inMinor', bpm: 50, pad: [[0, 7]], prog: 1, lead: 'none', seed: 16, air: 1.0 },
    /* 卒業式：温かい合唱アレンジ */
    bgm17: { root: 60, scale: 'majorPenta', bpm: 68, pad: [[0, 4, 7], [5, 9, 0]], prog: 4, lead: 'bell', seed: 17, air: 0.8 },
    /* TRUE END：主題フル */
    bgm18: { root: 62, scale: 'majorPenta', bpm: 66, pad: [[0, 4, 7], [-3, 0, 5]], prog: 4, lead: 'bell', seed: 18, air: 0.9, swell: true },
    /* GOOD END：主題変奏 */
    bgm19: { root: 64, scale: 'majorPenta', bpm: 72, pad: [[0, 4, 7]], prog: 4, lead: 'pluck', seed: 19, air: 0.7 },
    /* NORMAL END：静かな余韻 */
    bgm20: { root: 58, scale: 'minorPenta', bpm: 58, pad: [[0, 3, 7]], prog: 2, lead: 'piano', seed: 20, air: 0.8 },
    /* BITTERSWEET END：切なさと温かさ */
    bgm21: { root: 57, scale: 'minorPenta', bpm: 64, pad: [[0, 3, 7], [-3, 2, 5]], prog: 4, lead: 'piano', seed: 21, air: 0.8 },
    /* COMEDY SECRET：コミカルなフルバンド */
    bgm22: { root: 65, scale: 'majorPenta', bpm: 132, pad: [[0, 4, 7]], prog: 2, lead: 'xylo', seed: 22, drum: 'tick' },
    /* BONUS EXTRA：主題のノスタルジックアレンジ */
    bgm23: { root: 60, scale: 'yo', bpm: 70, pad: [[0, 4, 7]], prog: 4, lead: 'koto', seed: 23, air: 0.8 },
    /* スタッフロール */
    bgm24: { root: 62, scale: 'majorPenta', bpm: 76, pad: [[0, 4, 7], [-3, 0, 5]], prog: 4, lead: 'bell', seed: 24, air: 0.7, swell: true }
  };

  function midiHz(m) { return 440 * Math.pow(2, (m - 69) / 12); }

  // 簡易乱数（seed固定で毎回同じ旋律になる＝楽曲として成立させる）
  function rng(seed) {
    let s = seed || 1;
    return function () { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; };
  }

  // 事前に旋律パターンを生成（8小節ぶん）
  function buildMelody(tr) {
    const sc = SCALES[tr.scale] || SCALES.majorPenta;
    const r = rng(tr.seed * 7919);
    const notes = [];
    const len = 64;
    let last = 2;
    for (let i = 0; i < len; i++) {
      const density = tr.lead === 'pizz' || tr.lead === 'xylo' ? 0.75 : tr.lead === 'none' ? 0 : 0.42;
      if (r() < density) {
        let idx = Math.max(0, Math.min(sc.length - 1, last + Math.round((r() - 0.45) * 3)));
        last = idx;
        const oct = r() < 0.18 ? 12 : 0;
        notes.push({ at: i, deg: sc[idx] + oct + 12, len: (r() < 0.3 ? 2 : 1) });
      }
    }
    return notes;
  }

  function schedule() {
    if (!track) return;
    const spb = 60 / track.bpm;           // 1拍
    const stepDur = spb / 2;              // 8分刻み
    while (nextTime < ctx.currentTime + 0.6) {
      const t = nextTime;
      const bar = Math.floor(step / 8) % 8;
      const chord = track.padc = track.padc || track.pad;
      // パッド（小節の頭）
      if (step % 8 === 0 && chord.length) {
        const c = chord[bar % chord.length];
        c.forEach(function (semi) {
          tone(bgmBus, t, midiHz(track.root + semi), spb * 4.2, { type: 'sine', peak: 0.05, a: 1.4 });
          tone(bgmBus, t, midiHz(track.root + semi) * 1.003, spb * 4.2, { type: 'triangle', peak: 0.02, a: 1.8 });
        });
      }
      // ベース（2拍ごと）
      if (step % 4 === 0 && chord.length) {
        const c = chord[bar % chord.length];
        tone(bgmBus, t, midiHz(track.root - 24 + c[0]), spb * 1.8, { type: 'sine', peak: 0.06, a: 0.02 });
      }
      // 旋律
      if (track._mel) {
        const pos = step % 64;
        for (let i = 0; i < track._mel.length; i++) {
          const nn = track._mel[i];
          if (nn.at === pos) {
            const f = midiHz(track.root + nn.deg);
            const dur = spb * nn.len * 1.1;
            switch (track.lead) {
              case 'pluck': tone(bgmBus, t, f, dur, { type: 'triangle', peak: 0.085, a: 0.004, filter: ['lowpass', 2400, 0.7] }); break;
              case 'xylo':  tone(bgmBus, t, f, dur * 0.7, { type: 'sine', peak: 0.12, a: 0.002 }); tone(bgmBus, t, f * 4, 0.08, { type: 'sine', peak: 0.02 }); break;
              case 'pizz':  tone(bgmBus, t, f, 0.16, { type: 'sawtooth', peak: 0.05, a: 0.002, filter: ['lowpass', 1200, 1] }); break;
              case 'piano': tone(bgmBus, t, f, dur, { type: 'triangle', peak: 0.09, a: 0.003 }); tone(bgmBus, t, f * 2.01, dur * 0.5, { type: 'sine', peak: 0.02 }); break;
              case 'guitar':tone(bgmBus, t, f, dur, { type: 'sawtooth', peak: 0.04, a: 0.004, filter: ['lowpass', 1600, 0.6] }); break;
              case 'koto':  tone(bgmBus, t, f, dur, { type: 'triangle', peak: 0.09, a: 0.002, glide: f * 0.995, filter: ['lowpass', 2200, 1.4] }); break;
              case 'blip':  tone(bgmBus, t, f, 0.22, { type: 'square', peak: 0.025, a: 0.002, filter: ['lowpass', 1800, 2] }); break;
              case 'bell':  tone(bgmBus, t, f, dur * 1.6, { type: 'sine', peak: 0.075, a: 0.004 }); tone(bgmBus, t, f * 2.76, dur * 0.9, { type: 'sine', peak: 0.016 }); break;
            }
          }
        }
      }
      // ドラム風
      if (track.drum === 'soft' && step % 4 === 0) noise(bgmBus, t, 0.05, { freq: 180, type: 'lowpass', peak: 0.05 });
      if (track.drum === 'tick' && step % 2 === 1) noise(bgmBus, t, 0.03, { freq: 5200, peak: 0.02 });
      // 電車のレール音
      if (track.train && step % 2 === 0) noise(bgmBus, t, 0.05, { freq: 320, q: 2, peak: 0.018 });
      // 空気感（ノイズの敷布）
      if (track.air && step % 16 === 0) noise(bgmBus, t, 3.2, { freq: 800, type: 'lowpass', q: 0.3, peak: 0.012 * track.air, a: 1.2 });
      step++;
      nextTime += stepDur;
    }
  }

  /* ---------- BGM 制御 ---------- */
  function play(id) {
    if (current === id) return;
    const c = ac(); if (!c) return;
    stop(true);
    const def = TRACKS[id] || TRACKS.bgm01;
    track = Object.assign({}, def);
    track._mel = buildMelody(track);
    current = id;
    step = 0;
    nextTime = c.currentTime + 0.08;
    // フェードイン
    bgmBus.gain.cancelScheduledValues(c.currentTime);
    bgmBus.gain.setValueAtTime(0.0001, c.currentTime);
    bgmBus.gain.linearRampToValueAtTime(state.bgmVol, c.currentTime + 1.6);
    schedTimer = setInterval(schedule, 180);
  }

  function stop(hard) {
    if (schedTimer) { clearInterval(schedTimer); schedTimer = null; }
    if (ctx && bgmBus && !hard) {
      const t = ctx.currentTime;
      bgmBus.gain.cancelScheduledValues(t);
      bgmBus.gain.setValueAtTime(bgmBus.gain.value, t);
      bgmBus.gain.linearRampToValueAtTime(0.0001, t + 0.8);
    }
    current = null; track = null;
  }

  /* ---------- 効果音 ---------- */
  const SE = {
    click:   function (t) { tone(seBus, t, 2200, 0.05, { type: 'sine', peak: 0.10 }); tone(seBus, t, 3300, 0.03, { type: 'sine', peak: 0.04 }); },
    next:    function (t) { noise(seBus, t, 0.06, { freq: 2600, peak: 0.05 }); },
    chime:   function (t) { [[660, 0], [528, 0.34]].forEach(function (p) { tone(seBus, t + p[1], p[0], 1.5, { type: 'sine', peak: 0.10, a: 0.01 }); tone(seBus, t + p[1], p[0] * 2.7, 0.4, { type: 'sine', peak: 0.02 }); }); },
    bell:    function (t) { for (let i = 0; i < 6; i++) { tone(seBus, t + i * 0.42, 880, 0.9, { type: 'sine', peak: 0.09 }); tone(seBus, t + i * 0.42, 880 * 2.4, 0.3, { type: 'sine', peak: 0.015 }); } },
    shutter: function (t) { noise(seBus, t, 0.04, { freq: 3800, peak: 0.14 }); noise(seBus, t + 0.07, 0.05, { freq: 2600, peak: 0.1 }); },
    pen:     function (t) { for (let i = 0; i < 4; i++) noise(seBus, t + i * 0.055, 0.04, { freq: 2100 + Math.random() * 900, peak: 0.045 }); },
    line:    function (t) { tone(seBus, t, 880, 0.09, { type: 'sine', peak: 0.08 }); tone(seBus, t + 0.1, 1320, 0.14, { type: 'sine', peak: 0.08 }); },
    heart:   function (t) { tone(seBus, t, 66, 0.28, { type: 'sine', peak: 0.16, a: 0.01 }); },
    open:    function (t) { tone(seBus, t, 392, 0.22, { type: 'triangle', peak: 0.07 }); tone(seBus, t + 0.06, 587, 0.28, { type: 'triangle', peak: 0.07 }); },
    decide:  function (t) { tone(seBus, t, 523, 0.14, { type: 'sine', peak: 0.09 }); tone(seBus, t + 0.08, 784, 0.3, { type: 'sine', peak: 0.09 }); },
    wind:    function (t) { noise(seBus, t, 2.6, { freq: 500, type: 'lowpass', q: 0.4, peak: 0.05, a: 0.9 }); },
    sakura:  function (t) { noise(seBus, t, 1.8, { freq: 1400, type: 'bandpass', q: 0.5, peak: 0.02, a: 0.6 }); },
    applause:function (t) { for (let i = 0; i < 26; i++) noise(seBus, t + Math.random() * 1.8, 0.03, { freq: 2000 + Math.random() * 2500, peak: 0.018 }); },
    breathe: function (t) { noise(seBus, t, 0.5, { freq: 700, type: 'bandpass', q: 0.6, peak: 0.03, a: 0.2 }); },
    map:     function (t) { noise(seBus, t, 0.35, { freq: 1500, peak: 0.05, a: 0.05 }); tone(seBus, t, 660, 0.2, { type: 'triangle', peak: 0.03 }); },
    save:    function (t) { tone(seBus, t, 1046, 0.1, { type: 'sine', peak: 0.07 }); tone(seBus, t + 0.09, 1568, 0.22, { type: 'sine', peak: 0.07 }); },
    drop:    function (t) { noise(seBus, t, 0.05, { freq: 1800, peak: 0.08 }); tone(seBus, t + 0.12, 1760, 0.5, { type: 'sine', peak: 0.05 }); }
  };

  function se(id) {
    const c = ac(); if (!c) return;
    const fn = SE[id]; if (!fn) return;
    fn(c.currentTime + 0.01);
  }

  function setBgmVol(v) { state.bgmVol = v; if (bgmBus) bgmBus.gain.value = v; }
  function setSeVol(v) { state.seVol = v; if (seBus) seBus.gain.value = v; }
  function setMuted(m) { state.muted = m; if (master) master.gain.value = m ? 0 : 1; }

  global.AudioSys = {
    play: play, stop: stop, se: se,
    setBgmVol: setBgmVol, setSeVol: setSeVol, setMuted: setMuted,
    state: state, ensure: ac
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = global.AudioSys;
})(typeof window !== 'undefined' ? window : globalThis);
