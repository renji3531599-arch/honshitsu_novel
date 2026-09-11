/* ============================================================================
   main.js ―― 起動・データ読込・入力割り当て
   ========================================================================== */
import { Game } from './game.js';
import { Shell } from './shell.js';
import { Stage, AssetDB } from './visual.js';
import { GameAudio } from './audio.js';
import { Store } from './store.js';
import { parseScript } from './parser.js';

const D = (id) => document.getElementById(id);
const dom = {
  viewport: D('viewport'), stage: D('stage'),
  bgBack: D('bgBack'), bgImg: D('bgImg'), bgGrade: D('bgGrade'), bgLight: D('bgLight'),
  layChr: D('layChr'), layCg: D('layCg'), cgHolder: D('cgHolder'), cgBack: D('cgBack'), cgImg: D('cgImg'),
  fxParticles: D('fxParticles'), fxVeil: D('fxVeil'), fxFlash: D('fxFlash'), fxGrain: D('fxGrain'),
  caption: D('caption'), cardOverlay: D('cardOverlay'), cardNo: D('cardNo'), cardTitle: D('cardTitle'), cardSub: D('cardSub'),
  textwrap: D('textwrap'), namebox: D('namebox'), nameText: D('nameText'), text: D('text'),
  choices: D('choices'), choicePrompt: D('choicePrompt'), choiceList: D('choiceList'),
  overlay: D('overlay'), ovPanel: D('ovPanel'), ovKicker: D('ovKicker'), ovTitle: D('ovTitle'), ovBody: D('ovBody'), ovFoot: D('ovFoot'), ovClose: D('ovClose'),
  title: D('title'), titleBg: D('titleBg'), titleMenu: D('titleMenu'), titleProgress: D('titleProgress'),
  hub: D('hub'), hubList: D('hubList'), hubFoot: D('hubFoot'),
  items: D('items'), toasts: D('toasts'), hudLeft: D('hudLeft'), hudRight: D('hudRight'),
  screenWrap: D('screenWrap'), screenFrame: D('screenFrame'), screenTitle: D('screenTitle'), screenKind: D('screenKind'), screenBody: D('screenBody'),
  quickmenu: D('quickmenu'), qmList: D('qmList'),
  btnAuto: D('btnAuto'), btnSkip: D('btnSkip'), pageMark: D('pageMark'),
};

const fetchText = async (p) => {
  const r = await fetch(p);
  if (!r.ok) throw new Error(`${p} が読み込めません (${r.status})`);
  return r.text();
};
const fetchJSON = async (p) => JSON.parse(await fetchText(p));

async function boot() {
  const [assetsRaw, def, terms] = await Promise.all([
    fetchJSON('data/assets.json'),
    fetchJSON('data/meta.json'),
    fetchJSON('data/terms.json'),
  ]);
  const index = (await fetchText('data/script/index.txt')).split('\n').map(s => s.split(';')[0].trim()).filter(Boolean);
  const speakers = new Set([...Object.keys(def.speakers), 'ナ']);
  const data = { scenes: {}, order: [], chats: {}, chapters: {}, terms, warnings: [] };
  for (const f of index) {
    const txt = await fetchText('data/script/' + f);
    const parsed = parseScript(txt, f, { speakers, strict: false });
    Object.assign(data.scenes, parsed.scenes);
    Object.assign(data.chats, parsed.chats);
    Object.assign(data.chapters, parsed.chapters);
    data.order.push(...parsed.order);
    data.warnings.push(...(parsed.warnings || []).map(w => ({ ...w, file: f })));
  }
  // シーンの連結（ファイル跨ぎの next）
  data.order.forEach((id, n) => { data.scenes[id].next = data.order[n + 1] || null; });
  data.warnings.forEach(w => console.warn(`[script] ${w.file}:${w.line} ${w.msg}`));

  const assets = new AssetDB(assetsRaw);
  data.assets = assets;          // shell / game は data.assets 経由で台帳を参照する
  const audio = new GameAudio();
  const store = new Store();
  audio.enabled = !!store.config.audio;
  audio.vol = { master: store.config.master, bgm: store.config.bgmVol, se: store.config.seVol };
  const stage = new Stage(dom, assets);
  const game = new Game({ dom, stage, audio, store, data, def });
  const shell = new Shell({ dom, stage, audio, store, data, def, game });
  game.shell = shell;
  shell.game = game;
  shell.applyGrade();
  shell.applyBlend();
  shell.applySpriteTag();
  dom.textwrap.classList.add('hidden');
  stage.scaleU();
  addEventListener('resize', () => stage.scaleU());

  /* ------------------------------------------------ 入力 ------------------ */
  const menuKeys = { s: 'save', l: 'load', c: 'config', g: 'gallery', t: 'tips', r: 'flow', y: 'almanac' };
  let hudOn = true;
  addEventListener('keydown', (e) => {
    if (e.target && /input|textarea|select/i.test(e.target.tagName)) return;
    const ovOpen = !dom.overlay.classList.contains('hidden');
    const k = e.key;
    if (k === 'Escape') {
      if (ovOpen) { shell.close(); return; }
      if (dom.quickmenu.classList.contains('hidden')) openQuick(); else closeQuick();
      return;
    }
    if (ovOpen) return;
    if (!dom.title.classList.contains('out')) {
      const btns = [...dom.titleMenu.children];
      const i = btns.indexOf(document.activeElement);
      if (k === 'ArrowDown' || k === 'ArrowUp') { e.preventDefault(); btns[(i + (k === 'ArrowDown' ? 1 : btns.length - 1) + btns.length) % btns.length].focus(); }
      else if (k === 'Enter') { e.preventDefault(); (btns[i] || btns[0]).click(); }
      return;
    }
    if (game._mode === 'choice') {
      if (k === 'ArrowDown' || k === 'ArrowRight') { e.preventDefault(); shell.moveChoice(1); }
      else if (k === 'ArrowUp' || k === 'ArrowLeft') { e.preventDefault(); shell.moveChoice(-1); }
      else if (k === 'Enter' || k === ' ') { e.preventDefault(); shell.pickChoice(shell.choiceSel); }
      else if (/^[1-9]$/.test(k)) { e.preventDefault(); shell.pickChoice(+k - 1); }
      return;
    }
    if (k === ' ' || k === 'Enter' || k === 'PageDown') { e.preventDefault(); game.advance(); return; }
    if (k === 'Control') { if (!game.skip) game.toggleSkip(); return; }
    if (k === 'F1') { e.preventDefault(); store.saveAuto(game.snapshot()); shell.toast('QUICK SAVE'); return; }
    if (k === 'F2' || k === 'F3') { e.preventDefault(); const s = store.loadAuto(); if (s) { game.restore(s); shell.toast('QUICK LOAD'); } return; }
    const lk = k.toLowerCase();
    if (menuKeys[lk]) { e.preventDefault(); shell.open(menuKeys[lk]); return; }
    if (lk === 'b' || k === 'Backspace') { e.preventDefault(); shell.open('log'); return; }
    if (lk === 'a') { game.toggleAuto(); return; }
    if (lk === 'k') { game.toggleSkip(); return; }
    if (lk === 'q') { e.preventDefault(); toggleQuick(); return; }
    if (lk === 'i') { e.preventDefault(); shell.toggleItems(); return; }
    if (lk === 'h') { hudOn = !hudOn; dom.hudLeft.style.opacity = dom.hudRight.style.opacity = hudOn ? '' : '0'; return; }
  });
  addEventListener('keyup', (e) => { if (e.key === 'Control' && game.skip) game.toggleSkip(); });
  document.querySelector('#toolbar').addEventListener('click', (e) => {
    const b = e.target.closest('.tbtn'); if (!b) return;
    e.stopPropagation();
    const m = b.dataset.menu;
    if (m === 'auto') game.toggleAuto();
    else if (m === 'skip') game.toggleSkip();
    else if (m === 'log') shell.open('log');
    else shell.open(m);
  });
  dom.ovClose.addEventListener('click', () => shell.close());
  dom.overlay.addEventListener('mousedown', (e) => { if (e.target === dom.overlay) shell.close(); });

  function openQuick() {
    const items = [
      ['続きから / BACKLOG', 'log'], ['保存 / SAVE', 'save'], ['読込 / LOAD', 'load'],
      ['設定 / CONFIG', 'config'], ['ギャラリー / GALLERY', 'gallery'], ['ルート図 / FLOW', 'flow'],
      ['✝本質✝辞典 / TIPS', 'tips'], ['✝本質✝年鑑 / ALMANAC', 'almanac'],
    ];
    dom.qmList.innerHTML = '';
    items.forEach(([t, k]) => {
      const b = document.createElement('button');
      b.innerHTML = `<span class="ja">${t}</span><span>${k.toUpperCase()}</span>`;
      b.addEventListener('click', () => { closeQuick(); shell.open(k); });
      b.addEventListener('mouseenter', () => audio.se('se_hover'));
      dom.qmList.appendChild(b);
    });
    const end = document.createElement('button');
    end.innerHTML = `<span class="ja">タイトルへ戻る</span><span>TITLE</span>`;
    end.addEventListener('click', () => { closeQuick(); if (confirm('タイトルに戻ります。現在の進行はオートセーブされています。')) game.toTitle(); });
    dom.qmList.appendChild(end);
    dom.quickmenu.classList.remove('hidden');
  }
  function closeQuick() { dom.quickmenu.classList.add('hidden'); }
  function toggleQuick() { dom.quickmenu.classList.contains('hidden') ? openQuick() : closeQuick(); }

  /* 初回ジェスチャで音を出す（ブラウザ政策対応） */
  const kick = () => { audio.init().then(() => { if (shell.onTitle) audio.bgm('bgm01', 2.4); }); removeEventListener('pointerdown', kick); removeEventListener('keydown', kick); };
  addEventListener('pointerdown', kick); addEventListener('keydown', kick);
  shell.onTitle = true;
  const origHide = shell.hideTitle.bind(shell);
  shell.hideTitle = () => { shell.onTitle = false; origHide(); };
  const origShow = shell.showTitle.bind(shell);
  shell.showTitle = () => { shell.onTitle = true; origShow(); };

  window.__vn = { game, shell, stage, audio, store, data, assets, def };
  document.body.dataset.ready = '1';
  console.log(`[vn] 準備完了 ― ${data.order.length}シーン / ${Object.keys(data.chats).length}端末 / ${assets.list.length}アセット`);
  if (location.hash.startsWith('#scene=')) {
    const id = location.hash.slice(7);
    shell.hideTitle();
    game.goto(id);
  }
}

boot().catch(e => {
  console.error(e);
  document.body.insertAdjacentHTML('beforeend',
    `<div style="position:fixed;inset:auto 1rem 1rem;padding:1rem;background:#4b1e24;color:#f4d9dd;font:13px/1.7 monospace;z-index:99">${e.message}</div>`);
});
