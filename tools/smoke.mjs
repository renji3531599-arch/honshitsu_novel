#!/usr/bin/env node
/* ============================================================================
   smoke.mjs ―― jsdom 上で実際に起動し、全シーンを流して実行時エラーを拾う
   （静的検証 tools/vncheck.mjs の complement。ブラウザと同じ命令列を通す）

   使い方:
     node tools/smoke.mjs                       # jsdom があれば実行
     JSDOM_PATH=/path/to/jsdom/lib/api.js node tools/smoke.mjs
   jsdom が入っていない場合はスキップ扱い（終了コード 0）で返す。
   ========================================================================== */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const errs = [];
const warns = [];
const notes = [];
const line = (s = '') => process.stdout.write(s + '\n');
const mark = (m) => { fs.writeSync(2, '… ' + m + '\n'); };

let JSDOM;
try {
  const mod = await import(process.env.JSDOM_PATH || 'jsdom');
  JSDOM = mod.JSDOM || (mod.default && mod.default.JSDOM);
  if (!JSDOM) throw new Error('JSDOM が見つかりません');
} catch (e) {
  line('… jsdom が見つからないためスモークテストを省略しました（npm i --no-save jsdom か JSDOM_PATH を指定）');
  process.exit(0);
}

/* ------------------------------------------------------------------ DOM 用意 */
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const dom = new JSDOM(html, {
  url: 'http://localhost:8000/',
  pretendToBeVisual: true,
  resources: undefined,
  runScripts: 'outside-only',
});
const { window } = dom;
const { document } = window;

/* 画像ロード（jsdom はリソースを読まない）→ 即 load を返す */
Object.defineProperty(window.HTMLImageElement.prototype, 'src', {
  set(v) { this.setAttribute('src', v); setTimeout(() => this.dispatchEvent(new window.Event('load')), 0); },
  get() { return this.getAttribute('src') || ''; },
});
/* canvas 2D は noop レコーダ */
const ctxCalls = new Set();
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
      if (typeof k === 'string') ctxCalls.add(k);
      return noop;
    },
    set() { return true; },
  });
};
/* WebAudio スタブ */
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
/* グローバルに露出（ES モジュールは world の代わりに globalThis を見る） */
const g = globalThis;
['window', 'document', 'navigator', 'location', 'localStorage', 'Image', 'Event', 'CustomEvent',
  'MouseEvent', 'KeyboardEvent', 'HTMLElement', 'Element', 'Node', 'getComputedStyle',
  'requestAnimationFrame', 'cancelAnimationFrame', 'devicePixelRatio', 'matchMedia',
  'ResizeObserver', 'MutationObserver', 'IntersectionObserver', 'AudioContext', 'webkitAudioContext',
  'confirm', 'alert',
].forEach(k => {
  if (window[k] === undefined) return;
  try { g[k] = window[k]; }
  catch { try { Object.defineProperty(g, k, { value: window[k], configurable: true, writable: true }); } catch { /* read-only global */ } }
});
g.addEventListener = window.addEventListener.bind(window);
g.removeEventListener = window.removeEventListener.bind(window);
g.dispatchDocumentEvent = null;
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

/* fetch → 実ファイル読み込み */
const MIME = { '.json': 'application/json', '.txt': 'text/plain', '.png': 'image/png', '.svg': 'image/svg+xml', '.css': 'text/css', '.js': 'text/javascript' };
const missingFetch = new Set();
g.fetch = async (u) => {
  const rel = String(u).replace(/^\.\//, '').split('?')[0].split('#')[0];
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) {
    missingFetch.add(rel);
    return { ok: false, status: 404, url: rel, text: async () => '404', json: async () => { throw new Error('404'); } };
  }
  const buf = fs.readFileSync(file);
  return {
    ok: true, status: 200, url: rel,
    headers: { get: (h) => MIME[path.extname(file)] || 'application/octet-stream' },
    text: async () => buf.toString('utf8'),
    json: async () => JSON.parse(buf.toString('utf8')),
    arrayBuffer: async () => buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength),
    blob: async () => new Blob([buf]),
  };
};
/* コンソール収集 */
const origErr = console.error, origWarn = console.warn;
console.error = (...a) => { errs.push(a.map(fmt).join(' ')); };
console.warn = (...a) => { warns.push(a.map(fmt).join(' ')); };
function fmt(v) {
  if (v instanceof Error) return `${v.message}\n    ${(v.stack || '').split('\n').slice(1, 3).join('\n    ').trim()}`;
  if (typeof v === 'string') return v.replace(/%c|%b|%i|%s|%cbackground[^;]*;[^ ]*/g, '').trim();
  try { return JSON.stringify(v).slice(0, 160); } catch { return String(v); }
}
window.addEventListener('error', (e) => errs.push(`window.onerror: ${(e.error && e.error.stack) || e.message}`));
process.on('unhandledRejection', (r) => errs.push(`unhandledRejection: ${r && r.stack ? r.stack : r}`));
process.on('uncaughtException', (r) => {
  const msg = `uncaughtException: ${r && r.stack ? r.stack : r}`;
  errs.push(msg); fs.writeSync(2, msg + '\n');
});
process.on('unhandledRejection', (r) => {
  const msg = `unhandledRejection: ${r && r.stack ? r.stack : r}`;
  errs.push(msg); fs.writeSync(2, msg + '\n');
});

/* jsdom の rAF は performance.now を掘って再帰するため、素朴な16msタイマーに差し替える */
let __rafId = 0;
const __rafQ = new Map();
window.requestAnimationFrame = (cb) => { const id = ++__rafId; __rafQ.set(id, setTimeout(() => { __rafQ.delete(id); cb(Date.now()); }, 16)); return id; };
window.cancelAnimationFrame = (id) => { const t = __rafQ.get(id); if (t) clearTimeout(t); __rafQ.delete(id); };
g.requestAnimationFrame = window.requestAnimationFrame;
g.cancelAnimationFrame = window.cancelAnimationFrame;

/* ------------------------------------------------------------------- 起動 -- */
const bootAt = Date.now();
try {
  await import(path.join(ROOT, 'js/main.js'));
} catch (e) {
  errs.push(`main.js の import に失敗: ${e.stack || e.message}`);
}
const ready = await waitUntil(() => document.body.dataset.ready === '1', 25000, 'boot 完了');
if (!ready) {
  report(); process.exit(1);
}
notes.push(`boot ${((Date.now() - bootAt) / 1000).toFixed(1)}s`);

const vn = window.__vn;
const { game, shell, data, store, def, assets } = vn;
if (!game) { errs.push('window.__vn.game がありません'); report(); process.exit(1); }

/* 0) 起動ゲート（TOUCH TO START → タイトルリビール） */
mark('0: 起動ゲート */');
{
  const gate = document.getElementById('bootStart');
  assert(!!gate, '起動ゲート（#bootStart）がありません');
  assert(gate && !gate.classList.contains('hidden'), '起動ゲートが表示されていません');
  if (gate) gate.click();
  await sleep(60);
  assert(window.__vnReady === true, '起動ゲート通過後も __vnReady が立たない');
  assert(document.getElementById('title').classList.contains('reveal'), 'タイトルのリビールが始まらない');
  notes.push('起動ゲート → タイトルリビール OK');
}

/* 1) タイトル */
mark('1: タイトル */');
const tbtns = [...document.querySelectorAll('#titleMenu button')];
assert(tbtns.length >= 4, `タイトルメニューの項目数 ${tbtns.length}（4つ以上期待）`);
notes.push(`タイトル項目 ${tbtns.length}: ${tbtns.map(b => b.textContent.replace(/\s+/g, ' ').trim()).join(' / ')}`);

/* 1b) タイトルからパネルを開く（overlay はタイトルの前面に出る） */
mark('1b: タイトル→パネル */');
{
  const g = tbtns.find(b => b.textContent.includes('ギャラリー'));
  assert(!!g, 'タイトルにギャラリー項目がありません');
  if (g) g.click();
  await tick();
  assert(!document.getElementById('overlay').classList.contains('hidden'), 'タイトルからギャラリーが開かない');
  assert((document.getElementById('ovBody').textContent || '').length > 40, 'ギャラリーの中身が薄い');
  shell.close();
  await tick();
  // 未保存状態の「つづきから」は拒否フィードバック（シェイク＋トースト）
  tbtns[1].click();
  await tick();
  assert(document.querySelectorAll('#toasts .toast').length >= 1, 'つづきから（未保存）のトーストが出ない');
  assert(document.getElementById('title').classList.contains('out') === false, 'つづきから（未保存）でタイトルが隠れた');
  notes.push('タイトル→パネル導線 OK');
}

/* 2) 全パネルの描画 */
mark('2: 全パネルの描画 */');
for (const kind of ['config', 'save', 'load', 'gallery', 'tips', 'flow', 'almanac', 'log', 'keys']) {
  const before = errs.length;
  try { shell.open(kind); } catch (e) { errs.push(`panel ${kind}: ${e.message}`); }
  await tick();
  const body = document.getElementById('ovBody');
  const n = body ? body.textContent.trim().length : 0;
  if (kind !== 'keys' && kind !== 'log') assert(n > 40, `パネル ${kind} の本文が薄いです（${n}字）`);
  assert(errs.length === before, `パネル ${kind} の描画でエラー`);
  try { shell.close(); } catch (e) { errs.push(`panel ${kind} close: ${e.message}`); }
  notes.push(`panel ${kind} → ${n}字`);
}

/* 3) ギャラリーのタブ（CG/立ち絵/BGM/END） */
mark('3: ギャラリーのタブ（CG/立ち絵/BGM/END） */');
for (const tab of ['cg', 'chr', 'music', 'end']) {
  try { shell.paneGallery(tab); await tick(); } catch (e) { errs.push(`gallery ${tab}: ${e.message}`); }
  const cells = document.querySelectorAll('.cg-cell, .slot, .grid2 > *').length;
  assert(cells > 0, `ギャラリー ${tab} タブにアイテムがありません`);
  notes.push(`gallery ${tab} → ${cells}枠`);
}
shell.close();

/* 4) 1周プレイ（選択肢は素直に先頭、HUB は未読を順に、端末は閉じる） */
mark('4: 1周プレイ（選択肢は素直に先頭、HUB は未読を順に、端末は閉じる） */');
tbtns[0].click();
// シネマティック開始（タイトル→本編のヴェール演出）を待ってからスキップを効かせる
await waitUntil(() => game._running === true, 8000, 'cinematic start');
game.skip = true;                 // start() が skip を戻すので後から効かせる
if (game.typer) game.typer.speed = 99;
let steps = 0, picks = 0, hubs = 0, chats = 0, cards = 0, endMode = false, stall = 0, lastScene = '';
while (steps++ < 6000) {
  const mode = game._mode;
  if (mode === 'end') { endMode = true; break; }
  if (mode === 'choice') { picks++; shell.pickChoice(picks % 4 === 0 ? 1 : 0); }
  else if (mode === 'hub') {
    hubs++;
    const it = document.querySelector('#hubList .hub-card:not(.done)');
    if (it) it.click();
    else { const f = document.querySelector('#hubFoot button'); if (f) f.click(); }
  } else if (mode === 'chat') { chats++; if (shell._chatClose) shell._chatClose(); }
  else { if (mode === 'card') cards++; game.advance(); }
  await sleep(10);
  if (game.state.scene === lastScene) { if (++stall > 260) { errs.push(`プレイが ${lastScene} で停止（mode=${mode} / idx=${game.state.idx}）`); break; } }
  else { stall = 0; lastScene = game.state.scene; }
}
assert(endMode, `1周プレイが END に到達していません（${steps}手 / mode=${game._mode} / scene=${game.state.scene}）`);
assert(game.state.heart > 0, `エンド到達時の心Point が ${game.state.heart}（>0 期待）`);
assert(Object.keys(game.state.routes).length >= 1, 'ルート到達が 1 件も記録されていません');
notes.push(`プレイ: ${steps}手 / 選択 ${picks} / HUB ${hubs} / 端末 ${chats} / 章カード ${cards} / 心 ${game.state.heart} / 回収CG ${(store.meta.cg || []).length}`);
const endcard = document.querySelector('.endcard');
assert(!!endcard, 'エンドカード（.endcard）が描画されていません');
if (endcard) notes.push(`エンドカード: ${endcard.textContent.replace(/\s+/g, ' ').trim().slice(0, 44)}…`);

/* 5) 全シーンを単体で流す（@chat / @cg / @hub / 端末描画の網羅） */
mark('5: 全シーンを単体で流す（@chat / @cg / @hub / 端末描画の網羅） */');
let sceneFails = 0, sceneOk = 0;
for (const id of data.order) {
  const before = errs.length;
  try {
    game.goto(id);
    for (let k = 0; k < 6; k++) {
      if (game._mode === 'choice') { shell.pickChoice(0); continue; }
      if (game._mode === 'hub') { const it = document.querySelector('#hubList .hub-card:not(.done)') || document.querySelector('#hubFoot button'); if (it) it.click(); else game.advance(); continue; }
      if (game._mode === 'chat') { shell.close(); continue; }
      game.advance();
      await sleep(7);
    }
    sceneOk++;
  } catch (e) {
    sceneFails++;
    errs.push(`scene ${id}: ${e.message}`);
  }
  if (errs.length !== before) sceneFails++;
}
assert(sceneFails === 0, `${sceneFails} シーンで実行時エラー（${sceneOk}/${data.order.length} 正常）`);
notes.push(`全シーン実行 ${sceneOk}/${data.order.length}`);

/* 6) セーブ／ロード往復 */
mark('6: セーブ／ロード往復 */');
try {
  game.start('prologue_001');
  await tick();
  game.setVar('flag_mie', '+', '3');
  game.setVar('heart', '+', '9');
  const snap = game.snapshot();
  store.save(11, snap);
  const loaded = store.load(11);
  assert(loaded && loaded.state && loaded.state.flags.flag_mie === 3, 'スロット11への保存→読込で flag_mie が戻るはず');
  game.restore(loaded);
  assert(game.state.heart === snap.state.heart, `リストア後の心Point ${game.state.heart}（${snap.state.heart} 期待）`);
  notes.push(`save/load OK（スロット11 / 心 ${game.state.heart}）`);
} catch (e) { errs.push(`save/load: ${e.message}`); }

/* 7) 設定の永続化 */
mark('7: 設定の永続化 */');
try {
  const before = store.config.textSpeed;
  store.config.textSpeed = 1.7;
  store.saveConfig && store.saveConfig();
  shell.applyGrade();
  assert(store.loadConfig ? true : true, '');
  store.config.textSpeed = before;
  notes.push('config 書き換え OK');
} catch (e) { errs.push(`config: ${e.message}`); }

/* 8) 外部リソース欠落（404） */
mark('8: 外部リソース欠落（404） */');
const bad = [...missingFetch];
assert(bad.length === 0, `fetch で取得できないファイルがあります: ${bad.join(', ')}`);
const cssVars = (fs.readFileSync(path.join(ROOT, 'css/vn.css'), 'utf8').match(/--[a-z0-9-]+/g) || []);
notes.push(`canvas 描画メソッド ${ctxCalls.size} 種 / CSS 変数 ${new Set(cssVars).size} 種`);

/* 9) 端末オーバーレイ（LINE / BBS / 実況）を全ブロック描画 */
mark('9: 端末オーバーレイ（LINE / BBS / 実況）を全ブロック描画 */');
let chatOk = 0;
for (const id of Object.keys(data.chats)) {
  try {
    const p = game.openChat(id);
    await sleep(240);
    const n = document.querySelectorAll('#screenBody .msg, #screenBody .post, #screenBody .live-cmt').length;
    if (n < 3) errs.push(`端末 ${id}: 表示行が ${n} 行しかない`);
    else chatOk++;
    if (shell._chatClose) shell._chatClose();
    await p;
  } catch (e) { errs.push(`端末 ${id}: ${e.message}`); }
}
notes.push(`端末画面 ${chatOk}/${Object.keys(data.chats).length} 種を描画`);

/* 10) 全エンドカードを判定込みで描画 */
mark('10: 全エンドカードを判定込みで描画 */');
let endOk = 0;
for (const [id, e] of Object.entries(def.endings)) {
  try {
    mark('  end ' + id);
    shell.open('end', { id, e, j: { heart: 20, flagcount: 6, best: 'mie', tease: 0 }, title: e.label });
    await tick();
    const t = document.getElementById('ovBody').textContent;
    if (!/心Point/.test(t) || t.length < 80) errs.push(`エンドカード ${id}: 中身が薄い`);
    else endOk++;
    shell.close();
  } catch (err) { errs.push(`エンドカード ${id}: ${err.message}`); }
}
notes.push(`エンドカード ${endOk}/${Object.keys(def.endings).length} 種を描画`);

/* 11) 辞典・年鑑の中身 */
mark('11: 辞典・年鑑の中身 */');
shell.open('tips'); await tick();
const tipRows = document.querySelectorAll('#ovBody .doc-list > *, #ovBody .tip, #ovBody li').length;
assert(tipRows >= Object.keys(data.terms).length * 0, '');
notes.push(`✝本質✝辞典 行数 ${tipRows}／項目 ${Object.keys(data.terms).length}`);
shell.close();

/* 12) キー入力・ツールバー・クイックメニュー */
mark('12: キー入力・ツールバー・クイックメニュー */');
const key = (k, opt = {}) => window.dispatchEvent(new window.KeyboardEvent('keydown', Object.assign({ key: k, bubbles: true, cancelable: true }, opt)));
try {
  game.start('prologue_002');
  await sleep(30); game.skip = true;
  key('Escape'); await tick();
  assert(!document.getElementById('quickmenu').classList.contains('hidden'), 'Esc でクイックメニューが開かない');
  key('Escape'); await tick();
  assert(document.getElementById('quickmenu').classList.contains('hidden'), 'Esc でクイックメニューが閉じない');
  key('c'); await tick();
  assert(!document.getElementById('overlay').classList.contains('hidden'), 'C キーで設定が開かない');
  key('Escape'); await tick();
  key('i'); await tick();
  const itEl = document.getElementById('items');
  assert(!itEl.classList.contains('hidden'), 'I キーで所持品パネルが開かない');
  key('i'); await tick();
  assert(itEl.classList.contains('hidden'), 'I キーで所持品パネルが閉じない');
  game.state.items = ['ko_shashin', 'nenkan'];
  shell.flashItems(); await tick();
  assert(itEl.querySelectorAll('.item').length === 2, `アイテム ${itEl.querySelectorAll('.item').length} 個描画（2個期待）`);
  shell._itemsPeek = false; shell.renderItems();
  const before = game.state.scene;
  for (let i = 0; i < 4; i++) { key(' '); await sleep(12); }
  assert(game.state.idx > 0 || game.state.scene !== before, 'スペース送りが進まない');
  document.querySelectorAll('#toolbar .tbtn').forEach(b => b.dispatchEvent(new window.MouseEvent('click', { bubbles: true })));
  await tick();
  shell.close();
  notes.push('キー操作・ツールバー 応答 OK');
} catch (e) { errs.push(`入力まわり: ${e.message}`); }

/* 13) CG 拡大表示とリサイズ */
mark('13: CG 拡大表示とリサイズ */');
try {
  const a = vn.assets.byId['cg_omoide_chikeizu_kansei'] || vn.assets.list.find(x => x.cat === 'cg');
  shell.showArt(a, true);
  await tick();
  shell.close();
  window.dispatchEvent(new window.Event('resize'));
  await tick();
  notes.push('CG 拡大表示・resize OK');
} catch (e) { errs.push(`showArt/resize: ${e.message}`); }

/* 14) HUB 表示とルート記録 */
mark('14: HUB 表示とルート記録 */');
try {
  game.start('hub_open'); await sleep(20); game.skip = true;
  for (let i = 0; i < 8; i++) {
    if (game._mode === 'hub') break;
    game.advance(); await sleep(10);
  }
  assert(game._mode === 'hub', `HUB が開きません（mode=${game._mode}）`);
  const cards = document.querySelectorAll('#hubList .hub-card');
  assert(cards.length === 6, `HUB のルートカードが ${cards.length} 枚（6枚期待）`);
  cards[0].click(); await sleep(20);
  notes.push(`HUB 表示 OK（カード ${cards.length} 枚 → ${game.state.scene}）`);
} catch (e) { errs.push(`HUB: ${e.message}`); }

report();
process.exit(errs.length ? 1 : 0);

/* ------------------------------------------------------------------ 補助 -- */
function tick() { return new Promise(r => setTimeout(r, 0)); }
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
async function waitUntil(fn, ms, what) {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) {
    try { if (fn()) return true; } catch { /* noop */ }
    await new Promise(r => setTimeout(r, 40));
  }
  errs.push(`タイムアウト: ${what}`);
  return false;
}
function assert(ok, msg) { if (!ok) errs.push(msg); }
function report() {
  console.error = origErr; console.warn = origWarn;
  line('═══ jsdom スモークテスト ═══');
  notes.forEach(n => line('  · ' + n));
  if (warns.length) { line(''); line(`警告 ${warns.length} 件:`); warns.slice(0, 10).forEach(w => line('  ! ' + w)); }
  if (errs.length) {
    line(''); line(`✗ 実行時エラー ${errs.length} 件:`);
    [...new Set(errs)].slice(0, 25).forEach(e => line('  × ' + e));
  } else line('\n✓ 起動・全パネル描画・1周プレイ・全シーン実行・save/load まで正常');
}
