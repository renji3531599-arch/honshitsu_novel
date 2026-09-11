#!/usr/bin/env node
/* ============================================================================
   perf_probe.mjs ―― 描画コストの計測プローブ（jsdom 上で実行）
   起動 → 1周プレイ（skip）を行い、
     a) テキスト1行あたりの applyChr 呼び出し回数
     b) 立ち絵シルエット（.sil）への innerHTML 再構築回数・バイト数
     c) 全体の innerHTML 書き換え回数・バイト数
   を集計し、最後にマイクロベンチ（applyChr / 背景切替 / figureSVG 生成）を流す。
   jsdom は描画（raster/paint）を行わないため、この数値はブラウザ実機の
   「下界」に相当する。実際のブラウザでは SVG フィルタのラスタライズ分だけ
   さらに重くなる。

   使い方: node tools/perf_probe.mjs
   ========================================================================== */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const line = (s = '') => process.stdout.write(s + '\n');

let JSDOM;
try {
  const mod = await import(process.env.JSDOM_PATH || 'jsdom');
  JSDOM = mod.JSDOM || (mod.default && mod.default.JSDOM);
} catch {
  line('… jsdom がありません（npm i --no-save jsdom）');
  process.exit(0);
}

/* ------------------------------------------------------------------ DOM 用意 */
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const dom = new JSDOM(html, {
  url: 'http://localhost:8000/',
  pretendToBeVisual: true,
  runScripts: 'outside-only',
});
const { window } = dom;
const { document } = window;

/* 画像ロードは即 load を返す */
Object.defineProperty(window.HTMLImageElement.prototype, 'src', {
  set(v) { this.setAttribute('src', v); setTimeout(() => this.dispatchEvent(new window.Event('load')), 0); },
  get() { return this.getAttribute('src') || ''; },
});
window.HTMLCanvasElement.prototype.getContext = function () {
  const noop = () => {};
  const grad = { addColorStop: noop };
  return new Proxy({}, {
    get(_, k) {
      if (k === 'createLinearGradient' || k === 'createRadialGradient') return () => grad;
      if (k === 'measureText') return () => ({ width: 12 });
      if (k === 'canvas') return {};
      if (k === 'getImageData') return () => ({ data: new Uint8ClampedArray(4) });
      if (k === 'createPattern') return () => ({});
      return noop;
    },
    set() { return true; },
  });
};
function fakeParam(v = 1) {
  return {
    value: v, defaultValue: v, automationRate: 'a-rate',
    setValueAtTime: () => fakeParam(v), linearRampToValueAtTime: () => fakeParam(v),
    exponentialRampToValueAtTime: () => fakeParam(v), setTargetAtTime: () => fakeParam(v),
    cancelScheduledValues: () => fakeParam(v),
  };
}
const fakeNode = (extra = {}) => new Proxy({
  connect: () => extra.__next || {}, disconnect: () => {}, start: () => {}, stop: () => {},
  gain: fakeParam(), frequency: fakeParam(440), detune: fakeParam(0), Q: fakeParam(1),
  pan: fakeParam(0), playbackRate: fakeParam(1), buffer: null, loop: false, type: 'sine',
  onended: null, threshold: fakeParam(-24), knee: fakeParam(30), ratio: fakeParam(12),
}, { get: (t, k) => (k in t ? t[k] : () => {}), set: (t, k, v) => (t[k] = v, true) });
class FakeAudioContext {
  constructor() {
    this.state = 'running'; this.sampleRate = 44100; this._t0 = Date.now();
    this.destination = fakeNode();
    Object.defineProperty(this, 'currentTime', { get: () => (Date.now() - this._t0) / 1000 });
  }
  resume() { this.state = 'running'; return Promise.resolve(); }
  suspend() { return Promise.resolve(); }
  close() { return Promise.resolve(); }
  createGain() { return fakeNode(); }
  createOscillator() { return fakeNode(); }
  createBiquadFilter() { return fakeNode(); }
  createDynamicsCompressor() { return fakeNode(); }
  createStereoPanner() { return fakeNode(); }
  createBufferSource() { return fakeNode(); }
  createWaveShaper() { return fakeNode(); }
  createDelay() { return fakeNode(); }
  createConvolver() { return fakeNode(); }
  createChannelMerger() { return fakeNode(); }
  createPeriodicWave() { return {}; }
  createBuffer(ch, len, rate) {
    const data = new Float32Array(len);
    return { length: len, sampleRate: rate, numberOfChannels: ch, getChannelData: () => data, duration: len / rate };
  }
}
const g = globalThis;
['window', 'document', 'navigator', 'location', 'localStorage', 'Image', 'Event', 'CustomEvent',
  'MouseEvent', 'KeyboardEvent', 'HTMLElement', 'Element', 'Node', 'getComputedStyle',
  'requestAnimationFrame', 'cancelAnimationFrame', 'devicePixelRatio', 'matchMedia',
  'ResizeObserver', 'MutationObserver', 'IntersectionObserver', 'AudioContext', 'webkitAudioContext',
  'confirm', 'alert',
].forEach(k => {
  if (window[k] === undefined) return;
  try { g[k] = window[k]; }
  catch { try { Object.defineProperty(g, k, { value: window[k], configurable: true, writable: true }); } catch {} }
});
g.addEventListener = window.addEventListener.bind(window);
g.removeEventListener = window.removeEventListener.bind(window);
window.matchMedia = window.matchMedia || (q => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} }));
g.matchMedia = window.matchMedia;
window.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
g.ResizeObserver = window.ResizeObserver;
window.MutationObserver = window.MutationObserver || class { observe() {} disconnect() {} };
g.IntersectionObserver = window.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
g.AudioContext = FakeAudioContext;
g.webkitAudioContext = FakeAudioContext;
window.AudioContext = FakeAudioContext;
window.confirm = () => true;
g.confirm = window.confirm;
window.alert = () => {};
g.alert = window.alert;

const MIME = { '.json': 'application/json', '.txt': 'text/plain', '.png': 'image/png', '.svg': 'image/svg+xml', '.css': 'text/css', '.js': 'text/javascript' };
g.fetch = async (u) => {
  const rel = String(u).replace(/^\.\//, '').split('?')[0].split('#')[0];
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) return { ok: false, status: 404, url: rel, text: async () => '404', json: async () => { throw new Error('404'); } };
  const buf = fs.readFileSync(file);
  return {
    ok: true, status: 200, url: rel,
    headers: { get: () => MIME[path.extname(file)] || 'application/octet-stream' },
    text: async () => buf.toString('utf8'),
    json: async () => JSON.parse(buf.toString('utf8')),
    arrayBuffer: async () => buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength),
    blob: async () => new Blob([buf]),
  };
};
let __rafId = 0;
const __rafQ = new Map();
window.requestAnimationFrame = (cb) => { const id = ++__rafId; __rafQ.set(id, setTimeout(() => { __rafQ.delete(id); cb(Date.now()); }, 16)); return id; };
window.cancelAnimationFrame = (id) => { const t = __rafQ.get(id); if (t) clearTimeout(t); __rafQ.delete(id); };
g.requestAnimationFrame = window.requestAnimationFrame;
g.cancelAnimationFrame = window.cancelAnimationFrame;

const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const waitUntil = async (fn, ms, name) => {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) { if (fn()) return true; await sleep(50); }
  return false;
};

/* ------------------------------------------------------- innerHTML 計測 ------ */
const stats = {
  innerHTMLSets: 0, innerHTMLBytes: 0, silSets: 0, silBytes: 0,
  silSetsPerLine: [], // 各行ごとの .sil 再構築数（最後の値だけ見る用に累積で持つ）
  textLines: 0,
};
const proto = window.Element.prototype;
const desc = Object.getOwnPropertyDescriptor(proto, 'innerHTML');
if (desc && desc.set) {
  const origSet = desc.set;
  Object.defineProperty(proto, 'innerHTML', {
    ...desc,
    set(v) {
      const s = String(v);
      stats.innerHTMLSets++;
      stats.innerHTMLBytes += s.length;
      if (this.classList && this.classList.contains('sil')) {
        stats.silSets++;
        stats.silBytes += s.length;
        if (stats.textLines > 0) {
          // 行ごとの集計：現在行カウンタ（advance 前は 0）
          const arr = stats.silSetsPerLine;
          const cur = arr[arr.length - 1];
          cur.count = (cur.count || 0) + 1;
          cur.bytes = (cur.bytes || 0) + s.length;
        }
      }
      return origSet.call(this, v);
    },
  });
}

/* ------------------------------------------------------------------- 起動 -- */
const bootAt = Date.now();
await import(path.join(ROOT, 'js/main.js'));
const ready = await waitUntil(() => document.body.dataset.ready === '1', 25000, 'boot');
if (!ready) { line('boot 失敗'); process.exit(1); }
const vn = window.__vn;
const { game, shell, data, store } = vn;
line(`boot ${((Date.now() - bootAt) / 1000).toFixed(1)}s`);

/* 起動ゲート → タイトル */
document.getElementById('bootStart').click();
await sleep(60);
const tbtns = [...document.querySelectorAll('#titleMenu button')];

/* 本編開始 */
tbtns[0].click();
await waitUntil(() => game._running === true, 8000, 'cinematic start');
game.skip = true;
if (game.typer) game.typer.speed = 99;

/* applyChr の呼び出し回数を計測 */
let applyChrCalls = 0;
const origApply = game.stage.applyChr.bind(game.stage);
game.stage.applyChr = (...a) => { applyChrCalls++; return origApply(...a); };

const playAt = Date.now();
let steps = 0, picks = 0, hubs = 0, chats = 0, cards = 0;
while (steps++ < 6000) {
  const mode = game._mode;
  if (mode === 'end') break;
  if (mode === 'choice') { picks++; shell.pickChoice(picks % 4 === 0 ? 1 : 0); }
  else if (mode === 'hub') {
    hubs++;
    const it = document.querySelector('#hubList .hub-card:not(.done)');
    if (it) it.click(); else { const f = document.querySelector('#hubFoot button'); if (f) f.click(); }
  } else if (mode === 'chat') { chats++; if (shell._chatClose) shell._chatClose(); }
  else {
    if (mode === 'card') cards++;
    if (mode === 'text') { stats.textLines++; stats.silSetsPerLine.push({ count: 0, bytes: 0 }); }
    game.advance();
  }
  await sleep(8);
}
const playMs = Date.now() - playAt;

/* ------------------------------------------------------------- マイクロベンチ */
const mb = {};
{
  // applyChr: 3人表示で 300 回（話者を交互に）
  game.stage.setChr({ set: { mie: '01', satou: '01', rei: '01' } });
  const t0 = Date.now();
  for (let i = 0; i < 300; i++) game.stage.applyChr(['mie', 'satou', 'rei'][i % 3]);
  mb.applyChr300 = Date.now() - t0;
  // 背景切替: 2背景を交互に 30 回
  const t1 = Date.now();
  for (let i = 0; i < 30; i++) await game.stage.bg(i % 2 ? 'bg_hokutou_kyoshitsu_asa' : 'bg_rouka_hokutou');
  mb.bgSwap30 = Date.now() - t1;
}
/* figureSVG 生成コスト（キャッシュ効き具合の確認用） */
{
  const { figureSVG } = await import(path.join(ROOT, 'js/visual.js'));
  const t0 = Date.now();
  for (let i = 0; i < 300; i++) figureSVG('mie', '01');
  mb.figureSVG300 = Date.now() - t0;
}

/* ------------------------------------------------------------------- 集計 -- */
const perLineWithSil = stats.silSetsPerLine.filter(x => x.count > 0);
const maxPerLine = perLineWithSil.reduce((m, x) => Math.max(m, x.count), 0);
const avgPerLine = stats.textLines ? (stats.silSets / stats.textLines) : 0;

line('');
line('== 1周プレイ計測（jsdom / skip） ==');
line(`  プレイ時間      : ${(playMs / 1000).toFixed(2)}s（${steps}手 / choice ${picks} / hub ${hubs} / chat ${chats} / card ${cards}）`);
line(`  text 行数       : ${stats.textLines}`);
line(`  applyChr 呼出   : ${applyChrCalls}（${stats.textLines ? (applyChrCalls / stats.textLines).toFixed(1) : 0} 回/行）`);
line(`  .sil 再構築     : ${stats.silSets} 回（${(stats.silBytes / 1024).toFixed(0)}KB）→ ${avgPerLine.toFixed(1)} 回/行、最大 ${maxPerLine} 回/行`);
line(`  innerHTML 全体  : ${stats.innerHTMLSets} 回（${(stats.innerHTMLBytes / 1024 / 1024).toFixed(1)}MB）`);
line('');
line('== マイクロベンチ ==');
line(`  applyChr×300（3人表示・話者交互）: ${mb.applyChr300}ms（${(mb.applyChr300 / 300).toFixed(2)}ms/回）`);
line(`  背景切替×30（2背景交互）         : ${mb.bgSwap30}ms（${(mb.bgSwap30 / 30).toFixed(1)}ms/回）`);
line(`  figureSVG 生成×300（同キー）     : ${mb.figureSVG300}ms`);
line('');
line(`  回収CG ${(store.meta.cg || []).length} ／ 心 ${game.state.heart} ／ mode ${game._mode}`);
process.exit(0);
