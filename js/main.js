/* ============================================================================
   main.js ―― 起動・データ読込・入力割り当て
   起動は「画像先読み」方式：ローダーで進捗を見せながら、JSON→脚本→
   SVGウォームアップ→実画像プリロード→フォントの順に準備し、最後に
   タッチゲート（音声の自動再生制限もここで解消）を挟んでタイトルへ。
   ========================================================================== */
import { Game } from './game.js';
import { Shell } from './shell.js';
import { Stage, AssetDB, backdropSVG, figureSVG } from './visual.js';
import { GameAudio } from './audio.js';
import { Store } from './store.js';
import { parseScript } from './parser.js';
import { createDebug } from './debug.js';

const D = (id) => document.getElementById(id);
const dom = {
  viewport: D('viewport'), stage: D('stage'),
  layBg: D('layBg'), bgBack: D('bgBack'), bgImg: D('bgImg'), bgGrade: D('bgGrade'), bgLight: D('bgLight'),
  layChr: D('layChr'), layCg: D('layCg'), cgHolder: D('cgHolder'), cgBack: D('cgBack'), cgImg: D('cgImg'),
  fxParticles: D('fxParticles'), fxVeil: D('fxVeil'), fxFlash: D('fxFlash'), fxGrain: D('fxGrain'),
  caption: D('caption'), cardOverlay: D('cardOverlay'), cardContours: D('cardContours'),
  cardNo: D('cardNo'), cardTitle: D('cardTitle'), cardSub: D('cardSub'),
  textwrap: D('textwrap'), namebox: D('namebox'), nameText: D('nameText'), text: D('text'),
  choices: D('choices'), choicePrompt: D('choicePrompt'), choiceList: D('choiceList'),
  overlay: D('overlay'), ovPanel: D('ovPanel'), ovKicker: D('ovKicker'), ovTitle: D('ovTitle'), ovBody: D('ovBody'), ovFoot: D('ovFoot'), ovClose: D('ovClose'),
  title: D('title'), titleBg: D('titleBg'), titleKey: D('titleKey'), titleFx: D('titleFx'),
  titleMenu: D('titleMenu'), titleProgress: D('titleProgress'),
  hub: D('hub'), hubList: D('hubList'), hubFoot: D('hubFoot'),
  items: D('items'), toasts: D('toasts'), hudLeft: D('hudLeft'), hudRight: D('hudRight'),
  screenWrap: D('screenWrap'), screenFrame: D('screenFrame'), screenTitle: D('screenTitle'), screenKind: D('screenKind'), screenBody: D('screenBody'),
  quickmenu: D('quickmenu'), qmList: D('qmList'),
  btnAuto: D('btnAuto'), btnSkip: D('btnSkip'), pageMark: D('pageMark'),
  veil: D('veil'), veilContours: D('veilContours'), veilKicker: D('veilKicker'), veilTitle: D('veilTitle'),
  boot: D('boot'), bootContours: D('bootContours'), bootLoad: D('bootLoad'),
  bootBar: D('bootBar'), bootPct: D('bootPct'), bootMsg: D('bootMsg'),
  bootTip: D('bootTip'), bootStart: D('bootStart'),
};

const fetchText = async (p) => {
  const r = await fetch(p);
  if (!r.ok) throw new Error(`${p} が読み込めません (${r.status})`);
  return r.text();
};
const fetchJSON = async (p) => JSON.parse(await fetchText(p));
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const BOOT_TIPS = [
  'ヒント ― 右クリック / Backspace で、いつでもバックログが開けます。',
  'ヒント ― 同じ話を二度数えても、心Point は増えません。',
  'ヒント ― F1 でクイックセーブ、F2 でクイックロード。',
  'ヒント ― 倉石暁は、あなたの全てを記録しています。',
  'ヒント ― ✝本質✝辞典はタイトル画面からいつでも引けます。',
  'ヒント ― 窓の外を見るたび、誰かが何かを報告しています。',
];

/** SVG 補完描画のウォームアップ（初回表示のもたつき＋潜在エラーを潰す） */
function warmUp(assets) {
  try {
    const metas = new Set((assets.list || []).map(a => a.meta || '').filter(Boolean));
    metas.forEach(mt => backdropSVG({ id: 'warm', meta: mt }));
    const slugs = new Set((assets.list || []).filter(a => a.cat === 'chr').map(a => a.meta));
    slugs.forEach(sl => figureSVG(sl, '01'));
  } catch (e) { console.warn('[warmup]', e); }
}

/** 見出しフォントの先読み（失敗・遅延しても起動を止めない） */
async function fontsReady() {
  try {
    if (!document.fonts || !document.fonts.load) return;
    await Promise.race([
      Promise.all([
        document.fonts.load('900 40px "Zen Old Mincho"'),
        document.fonts.load('700 20px "Noto Serif JP"'),
        document.fonts.load('400 16px "Zen Kaku Gothic New"'),
      ]),
      sleep(3500),
    ]);
  } catch (e) { /* フォールバック書体で続行 */ }
}

async function boot() {
  const t0 = performance.now();
  const setProgress = (pct, msg) => {
    pct = Math.max(0, Math.min(100, Math.round(pct)));
    if (dom.bootBar) dom.bootBar.style.width = pct + '%';
    if (dom.bootPct) dom.bootPct.textContent = pct + '%';
    if (msg && dom.bootMsg) dom.bootMsg.textContent = msg;
  };
  // ローダー中の豆知識ローテーション
  let tipN = 0;
  const tipTimer = setInterval(() => {
    tipN = (tipN + 1) % BOOT_TIPS.length;
    if (dom.bootTip) {
      dom.bootTip.style.opacity = '0';
      setTimeout(() => {
        if (!dom.bootTip) return;
        dom.bootTip.textContent = BOOT_TIPS[tipN];
        dom.bootTip.style.opacity = '1';
      }, 380);
    }
  }, 2600);
  if (dom.bootTip) dom.bootTip.textContent = BOOT_TIPS[0];

  try {
    setProgress(4, '地図を広げています…');
    const [assetsRaw, def, terms] = await Promise.all([
      fetchJSON('data/assets.json'),
      fetchJSON('data/meta.json'),
      fetchJSON('data/terms.json'),
    ]);
    setProgress(26, '脚本を綴じています…');
    const index = (await fetchText('data/script/index.txt')).split('\n').map(s => s.split(';')[0].trim()).filter(Boolean);
    const speakers = new Set([...Object.keys(def.speakers), 'ナ']);
    const data = { scenes: {}, order: [], chats: {}, chapters: {}, terms, warnings: [] };
    for (let n = 0; n < index.length; n++) {
      const f = index[n];
      const txt = await fetchText('data/script/' + f);
      const parsed = parseScript(txt, f, { speakers, strict: false });
      Object.assign(data.scenes, parsed.scenes);
      Object.assign(data.chats, parsed.chats);
      Object.assign(data.chapters, parsed.chapters);
      data.order.push(...parsed.order);
      data.warnings.push(...(parsed.warnings || []).map(w => ({ ...w, file: f })));
      setProgress(26 + (n + 1) / index.length * 24, `脚本を綴じています… ${n + 1}/${index.length}`);
    }
    // シーンの連結（ファイル跨ぎの next）
    data.order.forEach((id, n) => { data.scenes[id].next = data.order[n + 1] || null; });
    data.warnings.forEach(w => console.warn(`[script] ${w.file}:${w.line} ${w.msg}`));

    setProgress(54, '舞台を組んでいます…');
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
    shell.applyMotion();
    dom.textwrap.classList.add('hidden');
    stage.scaleU();
    let _resizeRaf = 0;
    addEventListener('resize', () => {
      if (_resizeRaf) return;
      _resizeRaf = requestAnimationFrame(() => { _resizeRaf = 0; stage.scaleU(); });
    });
    // 画面回転・リサイズ時のパーティクル再配置
    addEventListener('orientationchange', () => setTimeout(() => stage.scaleU(), 350));

    setProgress(62, '絵具を溶いています…');
    await sleep(30);
    warmUp(assets);

    setProgress(68, '画像を読み込んでいます…');
    // 起動時に読むのは「これから始まる数シーン」だけ。全201枚を待たない。
    const seen = new Set();
    const first = assets.priorityList(data, 5, def);
    first.forEach(a => seen.add(a.id));
    await assets.preload((done, total) => {
      if (!total) { setProgress(88, '画像の準備ができました'); return; }
      setProgress(68 + done / total * 20, `画像を読み込んでいます… ${done}/${total}`);
    }, first);
    // 残りはタイトル表示之后、手が空いたときに少しずつ（差し替え素材が増えても起動は一定）
    assets.warmRest(seen).catch(() => {});

    setProgress(91, '活字を揃えています…');
    await fontsReady();
    stage.scaleU();

    bindInput({ dom, game, shell, store, audio });

    // 最低表示時間（ cinematic な「間」のため）
    const elapsed = performance.now() - t0;
    if (elapsed < 2300) await sleep(2300 - elapsed);
    setProgress(100, '準備完了');

    window.__vn = { game, shell, stage, audio, store, data, assets, def };
    // 管理者デバッグコンソール（常時APIは有効、UIは ?debug=1 / Ctrl+Shift+D で表示）
    try {
      const dbg = createDebug({ game, shell, store, data, def, stage, dom });
      window.__vn.debug = dbg;
      window.debug = dbg; // エイリアス
      console.log('[vn] debug console ready — Ctrl+Shift+D / ?debug=1 でパネル表示、 help: window.__vn.debug.help()');
    } catch(e){ console.warn('[debug] init failed', e); }
    document.body.dataset.ready = '1';
    console.log(`[vn] 準備完了 ― ${data.order.length}シーン / ${Object.keys(data.chats).length}端末 / ${assets.list.length}アセット（実画像 ${assets.realList().length}）`);

    readyGate({ dom, game, shell, audio });
    clearInterval(tipTimer);
  } catch (e) {
    clearInterval(tipTimer);
    console.error(e);
    if (dom.bootMsg) dom.bootMsg.textContent = '読み込みに失敗しました：' + e.message;
    if (dom.bootTip) dom.bootTip.textContent = 'ページを再読み込みしてください。直らない場合は開発者にお知らせください。';
    document.body.insertAdjacentHTML('beforeend',
      `<div style="position:fixed;inset:auto 1rem 1rem;padding:1rem;background:#4b1e24;color:#f4d9dd;font:13px/1.7 monospace;z-index:99">${e.message}</div>`);
  }
}

/* ------------------------------------------------ 起動ゲート（TOUCH TO START） -- */
function readyGate({ dom, game, shell, audio }) {
  dom.boot.classList.add('ready');
  if (dom.bootLoad) dom.bootLoad.classList.add('hidden');
  if (dom.bootStart) dom.bootStart.classList.remove('hidden');
  // デバッグ用ディープリンク（#scene=xxx）
  const pendingScene = location.hash.startsWith('#scene=') ? location.hash.slice(7) : null;

  let started = false;
  const start = () => {
    if (started || !dom.boot.classList.contains('ready')) return;
    started = true;
    // 以降のゲーム入力を許可
    window.__vnReady = true;
    audio.init().then(() => {
      audio.se('se_click');
      if (audio.now !== 'bgm01') audio.bgm('bgm01', 2.4);
    }).catch(() => {});
    dom.boot.classList.add('leave');
    setTimeout(() => dom.boot.remove(), 1300);
    if (pendingScene && game.start) {
      // デバッグ開始：タイトル演出を飛ばして直接シーンへ
      dom.title.classList.remove('pre');
      shell.hideTitle();
      game.start(pendingScene);
    } else {
      shell.revealTitle();
    }
  };
  if (dom.bootStart) dom.bootStart.addEventListener('click', (e) => { e.stopPropagation(); start(); });
  if (dom.boot) dom.boot.addEventListener('click', start);
  // キーボードでも開始できる（ゲーム側ハンドラより先に捕捉する）
  addEventListener('keydown', function gate(e) {
    if (started) { removeEventListener('keydown', gate); return; }
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); start(); }
  }, { capture: true });
}

/* ---------------------------------------------------------------- 入力 -- */
function bindInput({ dom, game, shell, store, audio }) {
  const menuKeys = { s: 'save', l: 'load', c: 'config', g: 'gallery', t: 'tips', r: 'endlist', y: 'almanac' };
  let hudOn = true;
  addEventListener('keydown', (e) => {
    if (!window.__vnReady) return;   // 起動ゲート通過前はゲーム入力を受けない
    if (e.target && /input|textarea|select/i.test(e.target.tagName)) return;
    const ovOpen = !dom.overlay.classList.contains('hidden');
    const k = e.key;
    if (k === 'Escape') {
      if (document.querySelector('.cg-view')) return;   // 拡大鑑賞の Esc を優先
      if (ovOpen) { shell.close(); return; }
      if (!dom.title.classList.contains('out')) return;   // タイトル上では何もしない
      if (dom.quickmenu.classList.contains('hidden')) openQuick(); else closeQuick();
      return;
    }
    if (ovOpen) return;
    if (!dom.title.classList.contains('out')) {
      const btns = [...dom.titleMenu.children];
      const i = btns.indexOf(document.activeElement);
      if (k === 'ArrowDown' || k === 'ArrowUp') { e.preventDefault(); btns[(i + (k === 'ArrowDown' ? 1 : btns.length - 1) + btns.length) % btns.length].focus(); }
      else if (k === 'Enter') { e.preventDefault(); (btns[i] || btns[0]).click(); }
      else if (/^[1-9]$/.test(k)) { e.preventDefault(); const b = btns[+k - 1]; if (b) b.click(); }
      else if (menuKeys[k.toLowerCase()]) { e.preventDefault(); shell.open(menuKeys[k.toLowerCase()]); }
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
    if (k === 'F1') { e.preventDefault(); try{ store.saveAuto(game.snapshot()); shell.toast('QUICK SAVE'); } catch(err){ if(err && err.message==='QUOTA_EXCEEDED'){ shell.toast('保存容量がいっぱいです — 古いスロットを1つ削除してください'); shell.open('save'); } else { shell.toast('保存に失敗しました'); } } return; }
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
    else if (m === 'quick') toggleQuick();
    else shell.open(m);
  });
  // テキスト送り：本文クリック（ツールバー以外）
  dom.textwrap.addEventListener('click', (e) => {
    if (e.target.closest('#toolbar')) return;
    if (store.config.advanceClick) game.advance();
  });
  dom.ovClose.addEventListener('click', () => shell.close());
  dom.overlay.addEventListener('mousedown', (e) => { if (e.target === dom.overlay) shell.close(); });

  function openQuick() {
    const items = [
      ['続きから / BACKLOG', 'log'], ['保存 / SAVE', 'save'], ['読込 / LOAD', 'load'],
      ['設定 / CONFIG', 'config'], ['ギャラリー / GALLERY', 'gallery'], ['エンドリスト / END LIST', 'endlist'],
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

  /* 初回ジェスチャで音を出す（ブラウザ政策対応。BGM開始は起動ゲートが担う） */
  const kick = () => { audio.init().catch(() => {}); };
  addEventListener('pointerdown', kick, { once: true });
  addEventListener('keydown', kick, { once: true });
  shell.onTitle = true;
  const origHide = shell.hideTitle.bind(shell);
  shell.hideTitle = () => { shell.onTitle = false; origHide(); };
  const origShow = shell.showTitle.bind(shell);
  shell.showTitle = () => { shell.onTitle = true; origShow(); };
}

boot();
