#!/usr/bin/env node
/* ============================================================================
   perf_probe.mjs ―― 「プレイ中の重さ」の犯人を数値で突き止める検査器

   ブラウダの描画パイプライン（ラスタ→ブレンド→コンポジット）そのものは
   計れないので、次の3層を測る：
     1) JS 側の作業量   … 1クリックあたりの SVG 再生成・DOM 差し替え・保存書き込み
     2) 常時動くもの     … CSS の infinite アニメ／blend／backdrop-filter の個数
     3) アセットの実態   … 画像ファイルの合計サイズ（＝「画像を差し替えたら軽くなるか」の答）

   使い方:
     node tools/perf_probe.mjs            # jsdom が必要（npm i jsdom）
     node tools/perf_probe.mjs --json     # JSON で出す（差分比較用）
   ========================================================================== */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const asJson = process.argv.includes('--json');
const out = (...a) => { if (!asJson) process.stdout.write(a.join(' ') + '\n'); };

/* ---------------------------------------------------------- 静的解析: CSS -- */
const css = fs.readFileSync(path.join(ROOT, 'css/vn.css'), 'utf8');
const cssStats = (() => {
  const count = (re) => (css.match(re) || []).length;
  // infinite アニメを宣言しているルール（=常時コマposite を起こす）
  const rules = css.split('}').filter(b => /animation\s*:[^;]*infinite/.test(b));
  const animSelectors = rules.map(b => (b.match(/([^{}]*)\{\s*[^{]*$/) || [, '?'])[1].trim().split(/\s*,\s*/)[0]);
  return {
    lines: css.split('\n').length,
    infiniteAnimations: count(/animation[^;]*infinite/g),
    backdropFilter: count(/backdrop-filter\s*:/g),
    mixBlend: count(/mix-blend-mode\s*:/g),
    filterDecl: count(/(?<![-\w])filter\s*:/g),
    blurFn: count(/blur\(/g),
    animatedSelectors: [...new Set(animSelectors)].sort(),
  };
})();

/* ------------------------------------------- 静的解析: プロシージャルSVG -- */
const { backdropSVG, figureSVG } = await import(path.join(ROOT, 'js/visual.js'));
const assetsRaw = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/assets.json'), 'utf8'));
const svgStats = (() => {
  const bgs = assetsRaw.assets.filter(a => a.cat === 'bg');
  const chrs = assetsRaw.assets.filter(a => a.cat === 'chr');
  let bgElems = 0, bgBytes = 0, bgAnimated = 0, bgInnerAnim = 0;
  for (const a of bgs) {
    const s = backdropSVG(a);
    bgBytes += s.length;
    bgElems += (s.match(/<(path|rect|circle|line|ellipse|g)\b/g) || []).length;
    if (/<style/.test(s)) bgAnimated++;
    bgInnerAnim += (s.match(/animation\s*:/g) || []).length;
  }
  let fgElems = 0, fgBytes = 0, fgFilter = 0;
  let n = 0;
  const seen = new Set();
  for (const a of chrs) {
    const slug = a.meta;
    if (seen.has(slug)) continue; seen.add(slug);
    for (const e of ['01', '04', '08']) {
      const s = figureSVG(slug, e);
      n++;
      fgBytes += s.length;
      fgElems += (s.match(/<(path|rect|circle|line|ellipse|g)\b/g) || []).length;
      fgFilter += (s.match(/<feGaussianBlur/g) || []).length;
    }
  }
  return {
    backdropCount: bgs.length,
    backdropAvgKB: +(bgBytes / Math.max(1, bgs.length) / 1024).toFixed(1),
    backdropAvgElems: Math.round(bgElems / Math.max(1, bgs.length)),
    backdropWithAnimatedStyle: bgAnimated,
    backdropInnerAnimations: bgInnerAnim,
    figureSamples: n,
    figureAvgKB: +(fgBytes / Math.max(1, n) / 1024).toFixed(1),
    figureAvgElems: Math.round(fgElems / Math.max(1, n)),
    figureGaussianBlurFilters: fgFilter,
  };
})();

/* ------------------------------------------------------- 実画像の総量 測定 -- */
const imgStats = (() => {
  const walk = (dir) => {
    const p = path.join(ROOT, dir);
    if (!fs.existsSync(p)) return { n: 0, bytes: 0, real: 0 };
    let n = 0, bytes = 0, real = 0;
    for (const f of fs.readdirSync(p)) {
      if (!/\.(png|jpg|jpeg|webp|svg)$/i.test(f)) continue;
      const st = fs.statSync(path.join(p, f));
      n++; bytes += st.size;
      if (st.size > 2000) real++;   // 810B 前後は白紙プレースホルダー
    }
    return { n, bytes, real };
  };
  const a = walk('assets/bg'), b = walk('assets/cg'), c = walk('assets/chr'), d = walk('assets/ui');
  const all = [a, b, c, d].reduce((o, x) => ({ n: o.n + x.n, bytes: o.bytes + x.bytes, real: o.real + x.real }), { n: 0, bytes: 0, real: 0 });
  return {
    files: all.n,
    totalKB: +(all.bytes / 1024).toFixed(0),
    realArtFiles: all.real,
    note: '実素材（1600x900 PNG 想定）に差し替えた場合の概算',
    projectedIfReal: `≈${Math.round((a.n * 1.6 + b.n * 1.4 + c.n * 0.5) )}MB`,
  };
})();

/* ================================================ 実行時計測（jsdom で再生） */
async function measure() {
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const JSDOM_MOD = process.env.JSDOM_PATH || 'jsdom';
  let JSDOM;
  try {
    const mod = await import(JSDOM_MOD);
    JSDOM = mod.JSDOM || (mod.default && mod.default.JSDOM);
    if (!JSDOM) throw new Error('no jsdom');
  } catch (e) {
    return { skipped: 'jsdom が見つからないため実行時計測は省略（npm i jsdom）' };
  }
  const dom = new JSDOM(html, { url: 'http://localhost:8000/', pretendToBeVisual: true, runScripts: 'outside-only' });
  const { window } = dom;
  Object.defineProperty(window.HTMLImageElement.prototype, 'src', {
    set(v) { this.setAttribute('src', v); setTimeout(() => this.dispatchEvent(new window.Event('load')), 0); },
    get() { return this.getAttribute('src') || ''; },
  });
  window.HTMLCanvasElement.prototype.getContext = function () {
    const noop = () => {}; const grad = { addColorStop: noop };
    return new Proxy({}, { get: (_, k) => (k === 'createLinearGradient' || k === 'createRadialGradient') ? (() => grad) : (k === 'measureText' ? () => ({ width: 12 }) : (typeof k === 'string' ? noop : undefined)) });
  };
  const fakeParam = (v = 1) => ({
    value: v, defaultValue: v,
    setValueAtTime: () => fakeParam(v), linearRampToValueAtTime: () => fakeParam(v),
    exponentialRampToValueAtTime: () => fakeParam(v), setTargetAtTime: () => fakeParam(v),
    cancelScheduledValues: () => fakeParam(v),
  });
  const fakeNode = (extra = {}) => new Proxy({
    connect: () => ({}), disconnect: () => {}, start: () => {}, stop: () => {},
    gain: fakeParam(), frequency: fakeParam(440), detune: fakeParam(0), Q: fakeParam(1),
    pan: fakeParam(0), playbackRate: fakeParam(1), buffer: null, loop: false, type: 'sine',
    onended: null,
  }, { get: (t, k) => (k in t ? t[k] : () => {}), set: (t, k, v) => (t[k] = v, true) });
  class FakeCtx {
    constructor() {
      this.state = 'running'; this.sampleRate = 44100; this.destination = fakeNode(); this._t0 = Date.now();
      Object.defineProperty(this, 'currentTime', { get: () => (Date.now() - this._t0) / 1000 });
    }
    resume() { return Promise.resolve(); } suspend() { return Promise.resolve(); } close() { return Promise.resolve(); }
    createGain() { return fakeNode(); } createOscillator() { return fakeNode(); } createBiquadFilter() { return fakeNode(); }
    createDynamicsCompressor() { return fakeNode(); } createStereoPanner() { return fakeNode(); } createBufferSource() { return fakeNode(); }
    createWaveShaper() { return fakeNode(); } createDelay() { return fakeNode(); } createConvolver() { return fakeNode(); }
    createChannelMerger() { return fakeNode(); } createPeriodicWave() { return {}; }
    createBuffer(ch, len, rate) { const data = new Float32Array(len); return { length: len, sampleRate: rate, numberOfChannels: ch, getChannelData: () => data, duration: len / rate }; }
  }
  ['window', 'document', 'navigator', 'location', 'localStorage', 'Image', 'Event', 'CustomEvent', 'MouseEvent', 'KeyboardEvent',
    'HTMLElement', 'Element', 'Node', 'getComputedStyle', 'devicePixelRatio', 'confirm', 'alert'].forEach(k => {
      if (window[k] === undefined) return;
      try { globalThis[k] = window[k]; } catch { Object.defineProperty(globalThis, k, { value: window[k], configurable: true, writable: true }); }
    });
  globalThis.addEventListener = window.addEventListener.bind(window);
  globalThis.removeEventListener = window.removeEventListener.bind(window);
  const mm = () => ({ matches: false, media: '', addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} });
  window.matchMedia = mm; globalThis.matchMedia = mm;
  window.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} }; globalThis.ResizeObserver = window.ResizeObserver;
  window.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} }; globalThis.IntersectionObserver = window.IntersectionObserver;
  window.AudioContext = FakeCtx; globalThis.AudioContext = FakeCtx; globalThis.webkitAudioContext = FakeCtx;
  window.confirm = () => true; globalThis.confirm = () => true; window.alert = () => {}; globalThis.alert = () => {};
  let rafId = 0; const rafQ = new Map();
  window.requestAnimationFrame = (cb) => { const id = ++rafId; rafQ.set(id, setTimeout(() => { rafQ.delete(id); cb(Date.now()); }, 16)); return id; };
  window.cancelAnimationFrame = (id) => { const t = rafQ.get(id); if (t) clearTimeout(t); rafQ.delete(id); };
  globalThis.requestAnimationFrame = window.requestAnimationFrame; globalThis.cancelAnimationFrame = window.cancelAnimationFrame;

  const MIME = { '.json': 'application/json', '.txt': 'text/plain', '.png': 'image/png', '.css': 'text/css', '.js': 'text/javascript' };
  globalThis.fetch = async (u) => {
    const rel = String(u).replace(/^\.\//, '').split('?')[0].split('#')[0];
    const file = path.join(ROOT, rel);
    if (!fs.existsSync(file)) return { ok: false, status: 404, text: async () => '404', json: async () => { throw new Error('404'); } };
    const buf = fs.readFileSync(file);
    return { ok: true, status: 200, headers: { get: (h) => MIME[path.extname(file)] || 'application/octet-stream' },
      text: async () => buf.toString('utf8'), json: async () => JSON.parse(buf.toString('utf8')) };
  };
  const errs = [];
  const origErr = console.error, origWarn = console.warn;
  console.error = (...a) => errs.push(a.map(String).join(' '));
  console.warn = () => {};

  await import(path.join(ROOT, 'js/main.js'));
  const t0 = Date.now();
  while (window.document.body.dataset.ready !== '1' && Date.now() - t0 < 25000) await new Promise(r => setTimeout(r, 60));
  const bootMs = Date.now() - t0;
  const vn = window.__vn;
  console.error = origErr; console.warn = origWarn;
  if (!vn) return { skipped: 'boot 失敗: ' + errs.slice(0, 3).join(' | ') };

  const { game, shell, store, stage, data } = vn;
  /* --- 計測用の計装 ------------------------------------------------------- */
  const M = {
    applyChr: 0, applyChrBytes: 0, applyChrMs: 0, silWrites: 0,
    bg: 0, bgMs: 0, figureSVGout: 0,
    saveMeta: 0, saveMetaBytes: 0, saveMetaMs: 0,
    saveAuto: 0, saveAutoBytes: 0, saveAutoMs: 0,
    lsWrites: 0, lsBytes: 0, domNodesAdded: 0, domNodesRemoved: 0,
  };
  const t = () => process.hrtime.bigint();
  const ms = (a, b) => Number(b - a) / 1e6;

  // localStorage 書き込みの実回数とバイト数（同期 I/O のコストを見る）
  const StorageProto = Object.getPrototypeOf(window.localStorage);
  const origSet = StorageProto.setItem;
  StorageProto.setItem = function (k, v) { M.lsWrites++; M.lsBytes += String(v).length; return origSet.call(this, k, v); };

  const oMeta = store.saveMeta.bind(store), oAuto = store.saveAuto.bind(store);
  const sizeOf = (o) => { try { return JSON.stringify(o).length; } catch (_) { return 0; } };
  store.saveMeta = () => { const sz = sizeOf(store.meta); const a = t(); const r = oMeta(); M.saveMeta++; M.saveMetaBytes += sz; M.saveMetaMs += ms(a, t()); return r; };
  store.saveAuto = (d) => { const sz = sizeOf(d); const a = t(); const r = oAuto(d); M.saveAuto++; M.saveAutoBytes += sz; M.saveAutoMs += ms(a, t()); return r; };
  const oApply = stage.applyChr.bind(stage);
  stage.applyChr = (talking) => {
    const a = t();
    const lay = stage.el.layChr;
    const before = [...lay.querySelectorAll('.sil')].map(n => n.innerHTML.length).reduce((x, y) => x + y, 0);
    M.applyChr++;
    const r = oApply(talking);
    const after = [...lay.querySelectorAll('.sil')].map(n => n.innerHTML.length).reduce((x, y) => x + y, 0);
    M.applyChrBytes += Math.max(0, after); // 毎ライン舞台に載っている SVG の総量
    if (after !== before) M.silWrites++;
    M.applyChrMs += ms(a, t());
    return r;
  };
  const oBg = stage.bg.bind(stage);
  stage.bg = async (id, opt) => { const a = t(); M.bg++; const r = await oBg(id, opt); M.bgMs += ms(a, t()); return r; };

  const mo = new window.MutationObserver((recs) => {
    for (const r of recs) { M.domNodesAdded += r.addedNodes.length; M.domNodesRemoved += r.removedNodes.length; }
  });
  mo.observe(stage.el.layChr, { childList: true, subtree: true, characterData: true });

  /* --- 1本プレイをなぞる（序盤 N ライン） --------------------------------- */
  const nap = (m) => new Promise(r => setTimeout(r, m));
  const LINES = +(process.env.PROBE_LINES || 160);
  window.__vnReady = true;
  game.start('prologue_001');
  await nap(60);
  game.skip = true;                      // start() が戻すので後から効かせる
  if (game.typer) game.typer.speed = 99;
  const clickStart = t();
  let ticks = 0, stall = 0, lastSig = '';
  while (game.history.length < LINES && ticks++ < LINES * 12) {
    const mode = game._mode;
    if (mode === 'choice') shell.pickChoice(0);
    else if (mode === 'hub') { const it = document.querySelector('#hubList .hub-card'); if (it) it.click(); }
    else if (mode === 'chat') { if (shell._chatClose) shell._chatClose(); }
    else if (mode === 'end') break;
    else game.advance();
    await nap(10);
    const sig = game.state.scene + ':' + game.state.idx;
    if (sig === lastSig) { if (++stall > 90) break; } else { stall = 0; lastSig = sig; }
  }
  const clickMs = ms(clickStart, t());
  await nap(80);
  mo.disconnect();

  const totalLines = Math.max(1, game.history.length);
  return {
    bootMs,
    lines: totalLines,
    perLine: {
      applyChrCalls: +(M.applyChr / totalLines).toFixed(2),
      silhouetteSvgBytesOnStage: Math.round(M.applyChrBytes / Math.max(1, M.applyChr) || 0),
      silhouetteRewrites: +(M.silWrites / totalLines).toFixed(2),
      jsMsPerLine: +(M.applyChrMs / totalLines).toFixed(2),
      bgCalls: +(M.bg / totalLines).toFixed(3),
      domNodesTouched: +((M.domNodesAdded + M.domNodesRemoved) / totalLines).toFixed(1),
    },
    saves: {
      saveMetaCalls: M.saveMeta, saveMetaMs: +M.saveMetaMs.toFixed(1),
      saveAutoCalls: M.saveAuto, saveAutoBytes: M.saveAutoBytes,
      saveAutoAvgKB: +(M.saveAutoBytes / Math.max(1, M.saveAuto) / 1024).toFixed(1),
      saveAutoMs: +M.saveAutoMs.toFixed(1),
      lsWrites: M.lsWrites, lsTotalKB: +(M.lsBytes / 1024).toFixed(1),
    },
    harness: { clickLoopMs: +clickMs.toFixed(0), ticks, errors: errs.length },
  };
}

let runtime = null;
runtime = await measure();

/* --------------------------------------------------------------- レポート -- */
const report = { cssStats, svgStats, imgStats, runtime };
if (asJson) { process.stdout.write(JSON.stringify(report, null, 2) + '\n'); }
else {
  out('■ 静的解析 — css/vn.css（常時コンポジットを発生させる宣言）');
  out(`  ${cssStats.lines} 行 / infinite アニメ ${cssStats.infiniteAnimations} 件 / backdrop-filter ${cssStats.backdropFilter} 件 / mix-blend-mode ${cssStats.mixBlend} 件 / filter ${cssStats.filterDecl} 件（うち blur ${cssStats.blurFn}）`);
  out('  infinite animation を付けるセレクタ: ' + cssStats.animatedSelectors.join(', '));
  out('');
  out('■ プロシージャルSVG（プレースホルダ補完描画）');
  out(`  背景 ${svgStats.backdropCount} 種：平均 ${svgStats.backdropAvgKB}KB / 平均 ${svgStats.backdropAvgElems} 要素 / うち <style>（内部アニメ）付き ${svgStats.backdropWithAnimatedStyle} 種・内部 animation 計 ${svgStats.backdropInnerAnimations} 件`);
  out(`  立ち絵（${svgStats.figureSamples} サンプル）：平均 ${svgStats.figureAvgKB}KB / ${svgStats.figureAvgElems} 要素 / feGaussianBlur ${svgStats.figureGaussianBlurFilters} 個`);
  out('');
  out('■ 実画像の総量');
  out(`  同梱画像 ${imgStats.files} 枚で合計 ${imgStats.totalKB}KB（実素材 ${imgStats.realArtFiles} 枚のみ）→ ${imgStats.note}：${imgStats.projectedIfReal}`);
  out('');
  if (runtime && runtime.skipped) out('■ 実行時計測: ' + runtime.skipped);
  else if (runtime) {
    out(`■ 実行時計測 ― ${runtime.lines} ライン送出（jsdom 上／描画は含まない、JS と保存の作業量のみ）  boot ${runtime.bootMs}ms`);
    out(`  1ラインあたり: applyChr ${runtime.perLine.applyChrCalls} 回 → 舞台SVG ${runtime.perLine.silhouetteSvgBytesOnStage}B を再パース ${runtime.perLine.silhouetteRewrites} 回 / 生成 ${runtime.perLine.jsMsPerLine}ms / 追加DOMノード ${runtime.perLine.domNodesTouched}`);
    out(`  保存: saveMeta ${runtime.saves.saveMetaCalls} 回 (${runtime.saves.saveMetaMs}ms) / saveAuto ${runtime.saves.saveAutoCalls} 回・平均 ${runtime.saves.saveAutoAvgKB}KB (${runtime.saves.saveAutoMs}ms) / localStorage 書込 ${runtime.saves.lsWrites} 回 ${runtime.saves.lsTotalKB}KB`);
    out(`  （参考）クリックループ ${runtime.harness.clickLoopMs}ms / エラー ${runtime.harness.errors}`);
  }
}
fs.writeFileSync(path.join(ROOT, '.perf-probe.json'), JSON.stringify(report, null, 1));
process.exit(0);
