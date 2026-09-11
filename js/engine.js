/* ============================================================
   『まだ地図の途中で』〜✝本質✝特別編〜
   ノベルゲーム・エンジン
   ―― スクリプト実行 / 立ち絵 / CG / セーブ / 演出 一式 ――
   ============================================================ */
(function (global) {
  'use strict';

  const M = global.MANIFEST;
  const $ = function (id) { return document.getElementById(id); };
  const esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };

  /* ---------------- 永続データ ---------------- */
  const GLOBAL_KEY = 'chizu_tohju_global_v1';
  let G = loadGlobal();

  function loadGlobal() {
    try {
      const raw = localStorage.getItem(GLOBAL_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* private mode etc. */ }
    return { seen: {}, cgs: {}, endings: {}, terms: {}, settings: { speed: 26, autoSpeed: 1.6, bgm: 0.55, se: 0.7, placeholderStyle: true }, screen: null };
  }
  function saveGlobal() {
    try { localStorage.setItem(GLOBAL_KEY, JSON.stringify(G)); } catch (e) {}
  }
  function markSeen(idx) { G.seen[idx] = 1; }
  function isSeen(idx) { return !!G.seen[idx]; }

  /* ---------------- ゲーム状態 ---------------- */
  let SCRIPT = [];      // 全ノード
  let LABELS = {};      // label -> index
  let pc = 0;           // プログラムカウンタ
  let waiting = null;   // 'text' | 'choice' | 'hub' | 'board' | 'chapter' | 'end' | 'staff'
  let typing = false;
  let typeTimer = null;
  let autoMode = false;
  let autoTimer = null;
  let skipping = false;
  let currentLine = null;      // 表示中のノード
  let snapshot = { bg: 'bg17', mood: 'sakura', plate: '', sprites: [], cg: null, chapterTitle: '' };

  function freshState() {
    return {
      heart: 0,
      flags: { MIE: 0, SATOU: 0, REI: 0, TERACHI: 0, RYOMA: 0, MINAMITOU: 0, MESHINO_KURAISHI: 0, IZAKI_IZUMI: 0 },
      jokes: 0,
      vars: { ch1path: null, hubDone: {}, meshinoSide: 0, kuraishiSide: 0, sincere: 0, bgmA: null },
      startedAt: Date.now()
    };
  }
  let ST = freshState();

  /* ---------------- 画像：仮画像判定キャッシュ ---------------- */
  const phCache = {};
  function isPlaceholder(file) {
    if (!G.settings.placeholderStyle) return false;
    if (file in phCache) return phCache[file];
    return false; // 判定前はとりあえず実画像として扱い、onloadで差し替え
  }
  function probePlaceholder(file, img, cb) {
    if (file in phCache) { cb(phCache[file]); return; }
    try {
      const cv = document.createElement('canvas');
      cv.width = 16; cv.height = 12;
      const cx = cv.getContext('2d');
      cx.drawImage(img, 0, 0, 16, 12);
      const d = cx.getImageData(0, 0, 16, 12).data;
      let mn = 255, mx = 0;
      for (let i = 0; i < d.length; i += 4) { const v = (d[i] + d[i + 1] + d[i + 2]) / 3; if (v < mn) mn = v; if (v > mx) mx = v; }
      const uniform = (mx - mn) < 8;
      phCache[file] = uniform;
      cb(uniform);
    } catch (e) { phCache[file] = false; cb(false); }
  }
  function assetURL(kind, file) { return 'assets/' + file; }

  /* ---------------- 画面ユーティリティ ---------------- */
  function el(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  const MOODS = {
    morning:  { a: '#f7ecd8', b: '#d9c9a8', light: '#fff7e6', name: '朝' },
    noon:     { a: '#eef2f2', b: '#c9d6d2', light: '#ffffff', name: '昼' },
    dusk:     { a: '#e8b48c', b: '#7a4a52', light: '#ffd9a8', name: '夕' },
    night:    { a: '#2c3a52', b: '#141a2a', light: '#8fa8d0', name: '夜' },
    dim:      { a: '#b8ac94', b: '#5a5244', light: '#e0d6bc', name: '薄暗' },
    dusty:    { a: '#c4b498', b: '#6a5a44', light: '#e6d8ba', name: '埃' },
    green:    { a: '#cfe0c0', b: '#5a7a5a', light: '#f0f8e0', name: '翠' },
    sky:      { a: '#dceaf4', b: '#88a8c4', light: '#ffffff', name: '空' },
    gym:      { a: '#e0d8c4', b: '#9a8a6a', light: '#fff4dc', name: '体育館' },
    train:    { a: '#d8e4e8', b: '#78909c', light: '#ffffff', name: '車窓' },
    sakura:   { a: '#f6e4ea', b: '#c49aa8', light: '#fff0f4', name: '桜' },
    tatami:   { a: '#d8c8a0', b: '#7a6844', light: '#f0e4c4', name: '和室' },
    lava:     { a: '#e8a070', b: '#5a3038', light: '#ffc890', name: '溶岩' },
    mountain: { a: '#c8c0b0', b: '#6a6252', light: '#eee8d8', name: '山' },
    camp:     { a: '#b8a888', b: '#4a4234', light: '#e8d8b0', name: 'キャンプ' },
    hollow:   { a: '#d8dce0', b: '#9aa0a8', light: '#f4f8fa', name: '空き教室' },
    warm:     { a: '#f4e4cc', b: '#c09a70', light: '#fff8e8', name: '温もり' }
  };

  /* ---------------- 背景 ---------------- */
  let bgFlip = false;
  function showBG(id, instant) {
    const def = M.BGS[id] || M.BGS.bg01;
    const mood = MOODS[def.mood] || MOODS.noon;
    snapshot.bg = id; snapshot.mood = def.mood; snapshot.plate = def.plate || '';
    const stage = $('stage');
    const layer = el('div', 'bg-layer');
    layer.innerHTML =
      '<div class="bg-base" style="background:linear-gradient(180deg,' + mood.a + ' 0%,' + mood.b + ' 100%)"></div>' +
      '<div class="bg-light" style="background:radial-gradient(ellipse 120% 60% at 50% -10%,' + mood.light + 'cc, transparent 60%)"></div>' +
      '<div class="bg-contour"></div>' +
      '<img class="bg-img" src="' + assetURL('bg', def.file) + '" alt="">';
    const img = layer.querySelector('.bg-img');
    img.addEventListener('load', function () {
      probePlaceholder(def.file, img, function (ph) {
        layer.classList.toggle('is-placeholder', ph);
      });
    });
    if (img.complete && img.naturalWidth) { /* cached */ probePlaceholder(def.file, img, function (ph) { layer.classList.toggle('is-placeholder', ph); }); }

    const old = stage.querySelectorAll('.bg-layer');
    stage.insertBefore(layer, $('mood-layer'));
    if (!instant) requestAnimationFrame(function () { requestAnimationFrame(function () { layer.classList.add('shown'); }); });
    else layer.classList.add('shown', 'no-trans');
    old.forEach(function (o, i) {
      setTimeout(function () { o.classList.remove('shown'); setTimeout(function () { o.remove(); }, 1400); }, i * 60);
    });
    // 場所札
    if (def.plate) showPlate(def.plate);
  }

  function showPlate(text) {
    const p = $('plate');
    p.classList.remove('shown');
    setTimeout(function () {
      p.innerHTML = '<span class="plate-line"></span><span class="plate-text">' + esc(text) + '</span>';
      p.classList.add('shown');
      clearTimeout(p._t);
      p._t = setTimeout(function () { p.classList.remove('shown'); }, 3600);
    }, 120);
  }

  /* ---------------- 立ち絵 ---------------- */
  function renderSprites() {
    const holder = $('sprites');
    holder.innerHTML = '';
    snapshot.sprites.forEach(function (sp) {
      const def = M.CHARS[sp.who];
      if (!def) return;
      const expLabel = (M.EXPR_LABELS[sp.who] && M.EXPR_LABELS[sp.who][sp.exp - 1]) || '';
      const file = 'chr/chr_' + sp.who + '_' + ('0' + sp.exp).slice(-2) + '.png';
      const d = el('div', 'sprite pos-' + (sp.pos || 'c') + (sp.dim ? ' dim' : '') + (sp.speak ? ' speak' : ''));
      d.dataset.who = sp.who;
      d.innerHTML =
        '<div class="sprite-frame" style="--c:' + def.color + '">' +
        '  <img src="' + assetURL('chr', file) + '" alt="">' +
        '  <div class="sprite-shade"></div>' +
        '  <div class="sprite-name">' + esc(def.name) + '</div>' +
        '  <div class="sprite-seal">' + esc(expLabel) + '</div>' +
        '</div>';
      const img = d.querySelector('img');
      const apply = function (ph) { d.classList.toggle('ph', ph); };
      img.addEventListener('load', function () { probePlaceholder(file, img, apply); });
      if (img.complete && img.naturalWidth) probePlaceholder(file, img, apply);
      holder.appendChild(d);
    });
  }
  function setSprite(who, exp, pos) {
    const i = snapshot.sprites.findIndex(function (s) { return s.who === who; });
    if (i >= 0) snapshot.sprites.splice(i, 1);
    snapshot.sprites.push({ who: who, exp: exp, pos: pos || 'c' });
    if (snapshot.sprites.length > 3) snapshot.sprites.shift();
    renderSprites();
  }
  function removeSprite(who) {
    if (who === 'all') snapshot.sprites.length = 0;
    else snapshot.sprites = snapshot.sprites.filter(function (s) { return s.who !== who; });
    renderSprites();
  }
  function highlightSprite(who) {
    snapshot.sprites.forEach(function (s) { s.speak = (s.who === who); s.dim = (s.who !== who); });
    renderSprites();
  }

  /* ---------------- CG ---------------- */
  function showCG(id, title, cap) {
    const def = M.CGS[id] || M.CG_ENDS[id];
    if (!def) return;
    snapshot.cg = id;
    G.cgs[id] = 1; saveGlobal();
    const layer = $('cg-layer');
    layer.innerHTML =
      '<div class="cg-wrap">' +
      '  <div class="cg-photo">' +
      '    <div class="cg-inner">' +
      '      <img src="' + assetURL('cg', def.file) + '" alt="">' +
      '      <div class="cg-shade"></div>' +
      '      <div class="cg-title">' + esc(title || def.title) + '</div>' +
      '      <div class="cg-contour"></div>' +
      '    </div>' +
      '  </div>' +
      '  <div class="cg-cap">' + esc(cap || def.cap || '') + '</div>' +
      '</div>';
    layer.classList.add('shown');
    const img = layer.querySelector('img');
    const apply = function (ph) { layer.classList.toggle('ph', ph); };
    img.addEventListener('load', function () { probePlaceholder(def.file, img, apply); });
    if (img.complete && img.naturalWidth) probePlaceholder(def.file, img, apply);
  }
  function hideCG() {
    snapshot.cg = null;
    const layer = $('cg-layer');
    layer.classList.remove('shown');
    setTimeout(function () { if (!snapshot.cg) layer.innerHTML = ''; }, 700);
  }

  /* ---------------- テキスト表示 ---------------- */
  const SPEED_PUNCT = { '。': 9, '、': 5, '！': 9, '？': 9, '」': 4, '』': 4, '…': 6, '―': 3, '——': 3 };

  function putLine(node) {
    currentLine = node;
    markSeen(pc);
    const box = $('maintext');
    const np = $('nameplate');
    box.innerHTML = '';
    $('next-arrow').classList.remove('shown');

    let speaker = null, text = '';
    if (node.t === 'say' || node.t === 'think') {
      speaker = M.CHARS[node.who];
      text = node.text;
      highlightSprite(node.who);
      np.style.display = 'inline-flex';
      np.innerHTML = '<span class="np-bar" style="background:' + (speaker ? speaker.color : '#888') + '"></span><span class="np-name">' + esc(speaker.name) + '</span>' +
        (node.t === 'think' ? '<span class="np-think">心</span>' : '');
      box.classList.toggle('is-think', node.t === 'think');
    } else {
      np.style.display = 'none';
      text = node.text;
      box.classList.remove('is-think');
      snapshot.sprites.forEach(function (s) { s.speak = false; });
      renderSpritesDimOnly();
    }
    typeText(text);
  }

  function renderSpritesDimOnly() {
    document.querySelectorAll('.sprite').forEach(function (d) {
      d.classList.remove('speak'); d.classList.add('dim');
    });
  }

  function typeText(text) {
    typing = true;
    const box = $('maintext');
    const speed = parseInt(G.settings.speed, 10);
    const nodes = [];
    // 改行記法 \n 対応
    const parts = String(text).split('\n');
    let i = 0, part = 0, charIdx = 0;
    clearInterval(typeTimer);
    let extra = 0;

    function cur() { return parts[part].charAt(charIdx); }
    function step() {
      if (skipping) {
        box.innerHTML = parts.map(esc).join('<br>');
        finishType();
        return;
      }
      const waitBase = speed;
      if (part >= parts.length) { finishType(); return; }
      const line = parts[part];
      if (charIdx >= line.length) {
        part++; charIdx = 0;
        if (part < parts.length) { box.appendChild(el('br')); typeTimer = setTimeout(step, waitBase * 6); }
        else finishType();
        return;
      }
      const ch = line[charIdx];
      const span = el('span', 'ch', esc(ch));
      box.appendChild(span);
      charIdx++; i++;
      let w = waitBase;
      if (SPEED_PUNCT[ch]) w = waitBase * SPEED_PUNCT[ch];
      typeTimer = setTimeout(step, w);
    }
    function finishType() {
      typing = false;
      $('next-arrow').classList.add('shown');
      if (autoMode) {
        clearTimeout(autoTimer);
        autoTimer = setTimeout(function () { if (autoMode) advance(); }, Math.max(700, text.length * G.settings.autoSpeed * 18));
      }
    }
    step();
  }

  function completeType() {
    clearInterval(typeTimer);
    if (currentLine) {
      const box = $('maintext');
      const parts = String(currentLine.text).split('\n');
      box.innerHTML = parts.map(esc).join('<br>');
    }
    typing = false;
    $('next-arrow').classList.add('shown');
  }

  /* ---------------- 章タイトルカード ---------------- */
  function showChapter(node, then) {
    waiting = 'chapter';
    const card = $('chapter-card');
    card.innerHTML =
      '<div class="ch-inner">' +
      '  <div class="ch-frame"></div>' +
      '  <div class="ch-num">' + esc(node.num || '') + '</div>' +
      '  <div class="ch-title">' + esc(node.title || '') + '</div>' +
      '  <div class="ch-sub">' + esc(node.sub || '') + '</div>' +
      '  <div class="ch-hint">― クリックで進む ―</div>' +
      '</div>';
    card.classList.add('shown');
    card.onclick = function () {
      card.classList.remove('shown');
      card.onclick = null;
      waiting = null;
      then();
    };
  }

  /* ---------------- 選択肢 ---------------- */
  function showChoices(node) {
    waiting = 'choice';
    const holder = $('choices');
    holder.innerHTML = '';
    node.opts.forEach(function (o, i) {
      const b = el('button', 'choice-btn');
      b.innerHTML = '<span class="cb-num">' + '①②③④⑤'[i] + '</span><span class="cb-label">' + esc(o.label) + '</span>';
      b.style.animationDelay = (i * 0.12) + 's';
      b.onclick = function (e) {
        e.stopPropagation();
        AudioSys.se('decide');
        holder.innerHTML = '';
        waiting = null;
        logLine(null, '選択　『' + o.label + '』');
        if (o.heart) addHeart(o.heart);
        if (o.flag) { ST.flags[o.flag] = (ST.flags[o.flag] || 0) + (o.flagv || 1); }
        if (o.joke) ST.jokes += o.joke;
        if (o.side === 'meshino') ST.vars.meshinoSide++;
        if (o.side === 'kuraishi') ST.vars.kuraishiSide++;
        if (o.sincere) ST.vars.sincere++;
        if (o.set) Object.assign(ST.vars, o.set);
        const inject = (o.then || []).slice();
        if (o.goto) { jumpTo(o.goto); return; }
        inject.forEach(function (n) { SCRIPT.splice(pc, 0, n); });
        run();
      };
      holder.appendChild(b);
    });
  }

  /* ---------------- HUB ---------------- */
  function showHub() {
    waiting = 'hub';
    const hub = $('hub-screen');
    const done = ST.vars.hubDone;
    const allDone = M.ROUTES && Object.keys(M.ROUTES).every(function (k) { return done[k]; });
    let html = '<div class="hub-inner">';
    html += '<div class="hub-head"><div class="hub-title">見送りの準備、始めます</div><div class="hub-sub">誰から話を聞く？　―　話せる相手から、順番に。</div></div>';
    html += '<div class="hub-map">';
    Object.keys(M.ROUTES).forEach(function (k) {
      const r = M.ROUTES[k];
      const isDone = !!done[k];
      html += '<button class="hub-route' + (isDone ? ' done' : '') + '" data-route="' + k + '" style="--c:' + r.color + '">' +
        '<span class="hr-badge">' + k + '</span>' +
        '<span class="hr-title">' + esc(r.title) + '</span>' +
        '<span class="hr-sub">' + esc(r.sub) + '</span>' +
        (isDone ? '<span class="hr-done">読了</span>' : '') +
        '</button>';
    });
    html += '</div>';
    if (allDone) {
      html += '<button class="hub-go" id="hub-go">▼　収束章　「地図を作る夜」へ　▼</button>';
    } else {
      html += '<div class="hub-note">読了 ' + Object.keys(done).length + ' / 6　―　全部の話を聞いてから、集まろう。</div>';
      html += '<button class="hub-go disabled" id="hub-try">収束章へ進む</button>';
    }
    html += '</div>';
    hub.innerHTML = html;
    hub.classList.add('shown');
    AudioSys.se('map');

    hub.querySelectorAll('.hub-route').forEach(function (b) {
      b.onclick = function (e) {
        e.stopPropagation();
        AudioSys.se('decide');
        const k = b.dataset.route;
        hub.classList.remove('shown');
        waiting = null;
        ST.vars.lastRoute = k;
        jumpTo(M.ROUTES[k].label);
        run();
      };
    });
    const go = hub.querySelector('#hub-go');
    if (go) go.onclick = function (e) {
      e.stopPropagation();
      AudioSys.se('decide');
      hub.classList.remove('shown');
      waiting = null;
      jumpTo('convergence_start');
      run();
    };
    const tryBtn = hub.querySelector('#hub-try');
    if (tryBtn) tryBtn.onclick = function (e) {
      e.stopPropagation();
      AudioSys.se('line');
      const note = hub.querySelector('.hub-note');
      note.textContent = '……まだ聞けていない話がある気がする。';
      note.classList.add('shake');
      setTimeout(function () { note.classList.remove('shake'); }, 600);
    };
  }

  /* ---------------- 掲示板 / LINE オーバーレイ ---------------- */
  function showBoard(node) {
    waiting = 'board';
    const ov = $('board-overlay');
    let inner = '';
    node.posts.forEach(function (p) {
      inner += '<div class="bbs-post"><div class="bbs-head"><span class="bbs-num">' + esc(p.num) + '</span><span class="bbs-name">' + esc(p.name || '名無しの地形図好き') + '</span><span class="bbs-date">' + esc(p.date || '') + '</span></div><div class="bbs-body">' + esc(p.body) + '</div></div>';
    });
    ov.innerHTML = '<div class="bbs-window"><div class="bbs-titlebar"><span class="bbs-btitle">' + esc(node.title) + '</span><span class="bbs-close">× 閉じる</span></div><div class="bbs-scroll">' + inner + '</div><div class="bbs-hint">クリックで閉じる</div></div>';
    ov.classList.add('shown');
    AudioSys.se('line');
    ov.onclick = function () {
      ov.classList.remove('shown');
      ov.onclick = null;
      waiting = null;
      run();
    };
  }

  /* ---------------- 心ポイント演出 ---------------- */
  function addHeart(v) {
    ST.heart = Math.max(-10, Math.min(40, ST.heart + v));
    if (v > 0) {
      const hp = $('heart-pulse');
      hp.innerHTML = '<span class="hp-mark">✝</span><span class="hp-label">+' + v + '</span>';
      hp.classList.remove('anim'); void hp.offsetWidth; hp.classList.add('anim');
      AudioSys.se('heart');
    }
  }

  /* ---------------- バックログ ---------------- */
  const LOG = [];
  function logLine(speaker, text) {
    LOG.push({ who: speaker ? speaker.name : '', text: text, think: false });
    if (LOG.length > 400) LOG.shift();
  }
  function openLog() {
    const scr = $('log-screen');
    const holder = $('log-entries');
    holder.innerHTML = LOG.slice().reverse().map(function (l) {
      return '<div class="log-entry' + (l.who ? '' : ' log-narr') + '">' +
        (l.who ? '<div class="log-who">' + esc(l.who) + '</div>' : '') +
        '<div class="log-text">' + esc(l.text).replace(/\n/g, '<br>') + '</div></div>';
    }).join('');
    scr.classList.add('shown');
  }

  /* ---------------- セーブ / ロード ---------------- */
  const SAVE_SLOTS = 8;
  function saveKey(n) { return 'chizu_save_' + n; }

  function makeSave(slotName) {
    return {
      v: 1, name: slotName, time: Date.now(),
      idx: pc, st: JSON.parse(JSON.stringify(ST)),
      snap: JSON.parse(JSON.stringify({ bg: snapshot.bg, mood: snapshot.mood, plate: snapshot.plate, sprites: snapshot.sprites, cg: snapshot.cg })),
      logTail: LOG.slice(-8)
    };
  }
  function writeSave(n, data) {
    try { localStorage.setItem(saveKey(n), JSON.stringify(data)); return true; } catch (e) { return false; }
  }
  function readSave(n) {
    try { const raw = localStorage.getItem(saveKey(n)); return raw ? JSON.parse(raw) : null; } catch (e) { return null; }
  }
  function doSave(n) {
    const d = makeSave(autoSceneName());
    if (writeSave(n, d)) { AudioSys.se('save'); toast('セーブしました　―　' + d.name); refreshSaveScreen(); }
  }
  function autoSceneName() {
    const n = SCRIPT[pc];
    return (n && (n.t === 'say' || n.t === 'n') && n.text) ? String(n.text).slice(0, 18) : (snapshot.chapterTitle || '――');
  }
  function loadFrom(d) {
    pc = d.idx;
    ST = JSON.parse(JSON.stringify(d.st));
    snapshot = JSON.parse(JSON.stringify(d.snap));
    LOG.length = 0;
    d.logTail.forEach(function (l) { LOG.push(l); });
    closeAllScreens();
    showBG(d.snap.bg, true);
    $('plate').innerHTML = '';
    renderSprites();
    if (d.snap.cg) showCG(d.snap.cg);
    else { $('cg-layer').classList.remove('shown'); $('cg-layer').innerHTML = ''; }
    waiting = null;
    run();
  }

  /* ---------------- 終了判定 ---------------- */
  function computeEnding() {
    const f = ST.flags;
    const candidates = [
      { id: 'good_mie', flag: 'MIE' },
      { id: 'good_satou', flag: 'SATOU' },
      { id: 'good_rei', flag: 'REI' },
      { id: 'good_terachi', flag: 'TERACHI' },
      { id: 'good_ryoma', flag: 'RYOMA' },
      { id: 'good_minamitou', flag: 'MINAMITOU' },
      { id: 'good_meshino', flag: 'MESHINO_KURAISHI', side: 'meshino' },
      { id: 'good_kuraishi', flag: 'MESHINO_KURAISHI', side: 'kuraishi' },
      { id: 'good_izaki', flag: 'IZAKI_IZUMI' }
    ];
    if (f.RYOMA >= 4 && ST.jokes >= 2 && ST.heart >= 12 && ST.heart <= 17) return 'end_comedy';
    if (ST.heart >= 24 && Object.keys(f).filter(function (k) { return f[k] >= 3; }).length >= 6) return 'end_true';
    if (ST.heart >= 18) {
      let best = null, bestV = 3;
      candidates.forEach(function (c) {
        let v = f[c.flag] || 0;
        if (c.side) { if (c.side === 'meshino' && ST.vars.meshinoSide < ST.vars.kuraishiSide) v = 0; if (c.side === 'kuraishi' && ST.vars.kuraishiSide < ST.vars.meshinoSide) v = 0; }
        if (v > bestV) { bestV = v; best = c.id; }
      });
      if (best) return best;
      return 'end_normal';
    }
    if (ST.heart >= 12) return 'end_normal';
    return 'end_bittersweet';
  }

  /* ---------------- スタッフロール ---------------- */
  function staffRoll() {
    waiting = 'staff';
    const sr = $('staffroll');
    sr.innerHTML = '<div class="sr-scroll"><div class="sr-block">' +
      '<div class="sr-line sr-head">原作</div><div class="sr-line">桐葉高校理数科三部作<br>（一年生編／二年生編／三年生編一学期）</div>' +
      '<div class="sr-gap"></div>' +
      '<div class="sr-line sr-head">本編</div><div class="sr-line">『まだ地図の途中で』〜✝本質✝特別編〜<br>非公式オリジナル番外編</div>' +
      '<div class="sr-gap"></div>' +
      '<div class="sr-line sr-head">企画・シナリオ</div><div class="sr-line">桐葉高校理数科三年B組　一同</div>' +
      '<div class="sr-gap"></div>' +
      '<div class="sr-line sr-head">キャラクター原案準拠</div><div class="sr-line">原作登場人物一同</div>' +
      '<div class="sr-gap"></div>' +
      '<div class="sr-line sr-head">イラスト</div><div class="sr-line">準備中（仮画像にて代用中。地面は、覚えている）</div>' +
      '<div class="sr-gap"></div>' +
      '<div class="sr-line sr-head">プログラム・音楽</div><div class="sr-line">エンジン班（全曲合成音による内製）</div>' +
      '<div class="sr-gap"></div>' +
      '<div class="sr-line sr-head">特別協力</div><div class="sr-line">桐葉高校理数科三年B組、および南棟の面々</div>' +
      '<div class="sr-gap"></div>' +
      '<div class="sr-line">そして、窓の外を見ていた、あの人へ。</div>' +
      '<div class="sr-gap"></div><div class="sr-gap"></div>' +
      '<div class="sr-line sr-title">――　まだ地図の途中で　――</div>' +
      '<div class="sr-gap"></div>' +
      '<div class="sr-hint">クリックでタイトルへ</div>' +
      '</div></div>';
    sr.classList.add('shown');
    AudioSys.play('bgm24');
    const inner = sr.querySelector('.sr-scroll');
    requestAnimationFrame(function () { inner.classList.add('scrolling'); });
    sr.onclick = function () {
      sr.classList.remove('shown');
      sr.onclick = null;
      waiting = null;
      toTitle();
    };
  }

  /* ---------------- トースト ---------------- */
  function toast(text) {
    const t = $('toast');
    t.textContent = text;
    t.classList.add('shown');
    clearTimeout(t._t);
    t._t = setTimeout(function () { t.classList.remove('shown'); }, 2200);
  }

  /* ---------------- 用語辞書 ---------------- */
  function unlockTerm(key) {
    if (M.TERMS[key] && !G.terms[key]) { G.terms[key] = 1; saveGlobal(); toast('✝本質✝辞典に項目が増えた　―　「' + M.TERMS[key].term + '」'); }
  }

  /* ============================================================
     仮想マシン本体
     ―― 選択肢の then / if 分岐はブート時にフラットな「到達不能領域」として
        コンパイル済み（compileScript）。実行は pc のみで完結し、
        セーブ／既読管理／スキップがすべてインデックス基準で正しく動く。――
     ============================================================ */
  function compileScript(parts) {
    const out = [];
    let gen = 0;
    const patchList = []; // {obj, key, label}

    function emit(nodes) {
      (nodes || []).forEach(function (n) {
        if (n.t === 'if') {
          const id = 'if' + (gen++);
          out.push({ t: 'branchif', cond: n.cond, thenLabel: id + 'T', elseLabel: id + 'E' });
          out.push({ t: 'label', name: id + 'T' });
          emit(n.then);
          const j = { t: 'jump' };
          patchList.push({ obj: j, key: 'to', label: id + 'D' });
          out.push(j);
          out.push({ t: 'label', name: id + 'E' });
          emit(n.else);
          out.push({ t: 'label', name: id + 'D' });
        } else if (n.t === 'choice') {
          const id = 'ch' + (gen++);
          const c = { t: 'choice', resumeLabel: id + 'R', opts: [] };
          n.opts.forEach(function (op, k) {
            const o2 = {};
            for (const key in op) if (key !== 'then') o2[key] = op[key];
            o2.thenLabel = (op.then && op.then.length) ? (id + '_' + k + 'T') : (id + 'R');
            c.opts.push(o2);
          });
          out.push(c);
          n.opts.forEach(function (op, k) {
            if (op.then && op.then.length) {
              out.push({ t: 'label', name: id + '_' + k + 'T' });
              emit(op.then);
              const j = { t: 'jump' };
              patchList.push({ obj: j, key: 'to', label: id + 'R' });
              out.push(j);
            }
          });
          out.push({ t: 'label', name: id + 'R' });
        } else {
          out.push(n);
        }
      });
    }

    parts.forEach(emit);

    // ラベル解決（全展開後なのでindexは確定している）
    const L2 = {};
    out.forEach(function (n, i) { if (n.t === 'label') L2[n.name] = i; });
    patchList.forEach(function (p) { p.obj.to = L2[p.label]; });
    out.forEach(function (n) {
      if (n.t === 'branchif') {
        n.thenAt = L2[n.thenLabel]; n.elseAt = L2[n.elseLabel];
        delete n.thenLabel; delete n.elseLabel;
      }
      if (n.t === 'choice') {
        n.resumeAt = L2[n.resumeLabel];
        delete n.resumeLabel;
        n.opts.forEach(function (o) { o.thenAt = L2[o.thenLabel]; delete o.thenLabel; });
      }
    });
    return out;
  }

  function jumpTo(label) {
    if (!(label in LABELS)) { console.error('unknown label:', label); pc = SCRIPT.length; return; }
    pc = LABELS[label];
  }

  function run() {
    closeAutoUI();
    while (pc < SCRIPT.length) {
      const node = SCRIPT[pc];
      switch (node.t) {
        case 'hub_done': ST.vars.hubDone[node.k] = true; pc++; break;
        case 'label': pc++; break;
        case 'scene':
          snapshot.chapterTitle = node.name || '';
          autoSave();
          pc++; break;
        case 'bg': showBG(node.id); pc++; break;
        case 'plate': showPlate(node.text); pc++; break;
        case 'cg': showCG(node.id, node.title, node.cap); AudioSys.se('shutter'); pc++; break;
        case 'cgoff': hideCG(); pc++; break;
        case 'chapter':
          snapshot.chapterTitle = node.title;
          showChapter(node, function () { pc++; run(); });
          return;
        case 'bgm': AudioSys.play(node.id); pc++; break;
        case 'se': AudioSys.se(node.id); pc++; break;
        case 'n':
        case 'say':
        case 'think': {
          if (skipping && isSeen(pc)) { logLine(node.t === 'n' ? null : M.CHARS[node.who], node.text); pc++; break; }
          waiting = 'text';
          if (node.t !== 'n') logLine(M.CHARS[node.who], node.text);
          else logLine(null, node.text);
          putLine(node);
          return;
        }
        case 'sprite': setSprite(node.who, node.exp, node.pos); pc++; break;
        case 'hide': removeSprite(node.who); pc++; break;
        case 'point': addHeart(node.v); pc++; break;
        case 'flag': ST.flags[node.k] = (ST.flags[node.k] || 0) + node.v; pc++; break;
        case 'joke': ST.jokes += node.v || 1; pc++; break;
        case 'dict': unlockTerm(node.key); pc++; break;
        case 'item': toast('入手　―　' + node.name); if (node.icon) AudioSys.se('save'); pc++; break;
        case 'choice': pc++; showChoices(node); return;
        case 'hub': pc++; showHub(); return;
        case 'board': pc++; showBoard(node); return;
        case 'branchif': {
          let cond = false;
          try { cond = !!node.cond(ST); } catch (e) { cond = false; }
          pc = cond ? node.thenAt : node.elseAt;
          break;
        }
        case 'jump':
          if (typeof node.to === 'number') { pc = node.to; break; } // コンパイル済み領域内ジャンプ
          jumpTo(node.to);
          break;
        case 'branch_end': {
          const endId = computeEnding();
          jumpTo(endId);
          break;
        }
        case 'end': {
          G.endings[node.id] = 1; saveGlobal();
          waiting = 'end';
          showEndCard(node, function () {
            waiting = null;
            pc++;
            run();
          });
          return;
        }
        case 'staffroll': staffRoll(); return;
        case 'to_title': toTitle(); return;
        default: pc++; break;
      }
    }
    // スクリプト終端
    toTitle();
  }

  function showEndCard(node, then) {
    const kindName = { true: 'TRUE END', good: 'GOOD END', normal: 'NORMAL END', bitter: 'BITTERSWEET END', comedy: 'COMEDY SECRET END', bonus: 'BONUS EXTRA' }[node.kind] || 'END';
    const card = $('end-card');
    card.innerHTML = '<div class="ec-inner">' +
      '<div class="ec-kind">' + kindName + '</div>' +
      '<div class="ec-title">『' + esc(node.title) + '』</div>' +
      '<div class="ec-logo">まだ地図の途中で　―完―</div>' +
      '<div class="ec-count">回収エンディング　' + Object.keys(G.endings).length + ' / 14</div>' +
      '<div class="ec-hint">クリックで進む</div></div>';
    card.classList.add('shown');
    AudioSys.se('bell');
    card.onclick = function () {
      card.classList.remove('shown');
      card.onclick = null;
      then();
    };
  }

  /* ---------------- オート / スキップ ---------------- */
  function closeAutoUI() {
    $('btn-auto').classList.toggle('on', autoMode);
    $('btn-skip').classList.toggle('on', skipping);
  }
  function toggleAuto() {
    autoMode = !autoMode;
    if (autoMode) skipping = false;
    closeAutoUI();
    if (autoMode && !typing && waiting === 'text') advance();
  }
  function toggleSkip() {
    skipping = !skipping;
    if (skipping) autoMode = false;
    closeAutoUI();
    if (skipping && waiting === 'text') advance();
  }

  /* ---------------- 入力 ---------------- */
  function advance() {
    if (waiting !== 'text') return;
    if (typing) { completeType(); return; }
    AudioSys.se('next');
    pc++;
    run();
  }

  function bindInput() {
    $('click-catcher').addEventListener('click', function (e) {
      if (waiting === 'text') advance();
    });
    document.addEventListener('keydown', function (e) {
      if (anyModalOpen()) return;
      if (e.key === ' ' || e.key === 'Enter' || e.key === 'z') { e.preventDefault(); if (waiting === 'text') advance(); }
      if (e.key === 'Control') { if (!skipping) toggleSkip(); }
      if (e.key === 'a') toggleAuto();
      if (e.key === 'l') openLog();
      if (e.key === 'Escape') { toggleInGameMenu(); }
    });
    document.addEventListener('keyup', function (e) {
      if (e.key === 'Control' && skipping) toggleSkip();
    });
  }

  /* ---------------- 画面遷移 ---------------- */
  function anyModalOpen() {
    return ['log-screen', 'save-screen', 'config-screen', 'gallery-screen', 'dict-screen', 'endlist-screen', 'menu-screen'].some(function (id) {
      return $(id).classList.contains('shown');
    });
  }
  function closeAllScreens() {
    ['log-screen', 'save-screen', 'config-screen', 'gallery-screen', 'dict-screen', 'endlist-screen', 'menu-screen'].forEach(function (id) { $(id).classList.remove('shown'); });
  }

  let saveMode = 'save';
  function openSaveScreen(mode) {
    saveMode = mode;
    $('save-title').textContent = mode === 'save' ? 'セーブ' : 'ロード';
    refreshSaveScreen();
    $('save-screen').classList.add('shown');
  }
  function refreshSaveScreen() {
    const holder = $('save-slots');
    holder.innerHTML = '';
    for (let i = 1; i <= SAVE_SLOTS; i++) {
      const d = readSave(i);
      const b = el('button', 'slot' + (d ? '' : ' empty'));
      b.innerHTML = '<span class="slot-no">No.' + i + '</span>' +
        (d ? '<span class="slot-name">' + esc(d.name) + '</span><span class="slot-meta">' + new Date(d.time).toLocaleString('ja-JP') + '</span>' : '<span class="slot-name">――空きスロット――</span>');
      b.onclick = function () {
        if (saveMode === 'save') doSave(i);
        else {
          if (!d) { toast('このスロットは空です'); return; }
          AudioSys.se('decide');
          loadFrom(d);
        }
      };
      holder.appendChild(b);
    }
  }

  function refreshGallery() {
    const holder = $('gallery-grid');
    holder.innerHTML = '';
    const all = Object.assign({}, M.CGS, M.CG_ENDS);
    Object.keys(all).forEach(function (id) {
      const def = all[id];
      const got = !!G.cgs[id];
      const cell = el('div', 'g-cell' + (got ? '' : ' locked'));
      cell.innerHTML = got
        ? '<div class="g-ph" style="background:linear-gradient(160deg,#2e3338,#1a1e22)"><span class="g-title">' + esc(def.title) + '</span><span class="g-cap">' + esc(def.cap || '') + '</span></div>'
        : '<div class="g-ph g-locked">？？？</div>';
      if (got) cell.onclick = function () {
        $('gallery-view').innerHTML = '<div class="g-big"><img src="assets/' + def.file + '"><div class="g-big-title">' + esc(def.title) + '</div></div>';
        $('gallery-screen').classList.add('view');
      };
      holder.appendChild(cell);
    });
  }

  function refreshEndList() {
    const defs = [
      ['end_true', 'TRUE END', '地面は、忘れない。'],
      ['good_mie', 'GOOD END', '否定の向こう側'],
      ['good_satou', 'GOOD END', '見ている、それだけで'],
      ['good_rei', 'GOOD END', '面白いを仕事にする'],
      ['good_terachi', 'GOOD END', '配信は続く'],
      ['good_ryoma', 'GOOD END', '✝本質✝、その後'],
      ['good_izaki', 'GOOD END', '隣にいた二人、それぞれの歩幅'],
      ['good_meshino', 'GOOD END', '言葉を届ける'],
      ['good_kuraishi', 'GOOD END', '年鑑、完結せず'],
      ['good_minamitou', 'GOOD END', '境界のない春'],
      ['end_normal', 'NORMAL END', '見えないけど、ある'],
      ['end_bittersweet', 'BITTERSWEET END', 'こぼれた地図'],
      ['end_comedy', 'COMEDY SECRET END', '原✝本質✝、完全体'],
      ['end_bonus', 'BONUS EXTRA', 'また、この教室で']
    ];
    const holder = $('endlist-items');
    holder.innerHTML = '';
    defs.forEach(function (d) {
      const got = !!G.endings[d[0]];
      const row = el('div', 'end-row' + (got ? '' : ' locked'));
      row.innerHTML = '<span class="er-kind">' + d[1] + '</span><span class="er-title">' + (got ? esc(d[2]) : '？？？') + '</span><span class="er-mark">' + (got ? '回収' : '未回収') + '</span>';
      holder.appendChild(row);
    });
    const bonusReady = defs.slice(0, 13).every(function (d) { return G.endings[d[0]]; });
    const note = $('endlist-note');
    note.textContent = bonusReady
      ? '……全てを回収した者へ。タイトル画面に、新しい道ができている。'
      : '全13種を回収すると、タイトルに隠し道が出現する。';
  }

  function refreshDict() {
    const holder = $('dict-items');
    holder.innerHTML = '';
    Object.keys(M.TERMS).forEach(function (k) {
      const t = M.TERMS[k];
      const got = !!G.terms[k];
      const row = el('div', 'dict-row' + (got ? '' : ' locked'));
      row.innerHTML = '<div class="dt-term">' + (got ? esc(t.term) : '？？？') + '</div><div class="dt-def">' + (got ? esc(t.def) : 'まだ出会っていない言葉。') + '</div>';
      holder.appendChild(row);
    });
  }

  /* ---------------- タイトル ---------------- */
  function toTitle() {
    AudioSys.stop();
    closeAllScreens();
    $('title-screen').classList.add('shown');
    $('game').classList.remove('shown');
    $('btn-bonus').style.display = (G.endings['end_true'] && G.endings['end_normal'] && G.endings['end_bittersweet'] && G.endings['end_comedy'] &&
      ['good_mie', 'good_satou', 'good_rei', 'good_terachi', 'good_ryoma', 'good_izaki', 'good_meshino', 'good_kuraishi', 'good_minamitou'].every(function (k) { return G.endings[k]; }))
      ? '' : 'none';
    const cont = $('btn-continue');
    let hasSave = false;
    for (let i = 1; i <= SAVE_SLOTS; i++) if (readSave(i)) { hasSave = true; break; }
    cont.style.display = hasSave ? '' : 'none';
  }

  function startNew() {
    ST = freshState();
    LOG.length = 0;
    snapshot = { bg: 'bg17', mood: 'sakura', plate: '', sprites: [], cg: null, chapterTitle: '' };
    pc = 0;
    $('title-screen').classList.remove('shown');
    $('game').classList.add('shown');
    $('stage').querySelectorAll('.bg-layer').forEach(function (o) { o.remove(); });
    showBG('bg17', true);
    waiting = null;
    AudioSys.play('bgm01');
    run();
  }

  function continueGame() {
    // 最新のセーブを探す
    let best = null, bestN = 0;
    for (let i = 1; i <= SAVE_SLOTS; i++) {
      const d = readSave(i);
      if (d && (!best || d.time > best.time)) { best = d; bestN = i; }
    }
    if (!best) { toast('セーブデータがありません'); return; }
    $('title-screen').classList.remove('shown');
    $('game').classList.add('shown');
    loadFrom(best);
  }

  function autoSave() {
    // シーン区切りでのオートセーブ（スロット9＝オート）
    try { localStorage.setItem(saveKey(9), JSON.stringify(makeSave('オート：' + autoSceneName()))); } catch (e) {}
  }

  function toggleInGameMenu() {
    const m = $('menu-screen');
    if (m.classList.contains('shown')) { m.classList.remove('shown'); return; }
    if (!$('game').classList.contains('shown')) return;
    m.classList.add('shown');
  }

  /* ---------------- 設定 ---------------- */
  function applySettings() {
    AudioSys.setBgmVol(parseFloat(G.settings.bgm));
    AudioSys.setSeVol(parseFloat(G.settings.se));
    $('cfg-speed').value = G.settings.speed;
    $('cfg-auto').value = G.settings.autoSpeed;
    $('cfg-bgm').value = G.settings.bgm;
    $('cfg-se').value = G.settings.se;
    $('cfg-ph').checked = !!G.settings.placeholderStyle;
    $('speed-val').textContent = G.settings.speed;
    $('auto-val').textContent = Number(G.settings.autoSpeed).toFixed(1);
  }

  /* ---------------- 初期化 ---------------- */
  function boot() {
    // スクリプト結合
    const parts = global.__SCRIPT_PARTS || [];
    SCRIPT = compileScript(parts);
    LABELS = {};
    SCRIPT.forEach(function (n, i) { if (n.t === 'label') { if (LABELS[n.name] != null) console.warn('label重複:', n.name); LABELS[n.name] = i; } });
    global.__SCRIPT = SCRIPT; global.__LABELS = LABELS;

    applySettings();
    bindInput();

    // タイトル
    $('btn-new').onclick = function () { AudioSys.ensure(); AudioSys.se('decide'); startNew(); };
    $('btn-continue').onclick = function () { AudioSys.ensure(); AudioSys.se('decide'); continueGame(); };
    $('btn-gallery').onclick = function () { AudioSys.ensure(); AudioSys.se('open'); refreshGallery(); $('gallery-screen').classList.add('shown'); };
    $('btn-endlist').onclick = function () { AudioSys.ensure(); AudioSys.se('open'); refreshEndList(); $('endlist-screen').classList.add('shown'); };
    $('btn-dict').onclick = function () { AudioSys.ensure(); AudioSys.se('open'); refreshDict(); $('dict-screen').classList.add('shown'); };
    $('btn-config').onclick = function () { AudioSys.ensure(); AudioSys.se('open'); applySettings(); $('config-screen').classList.add('shown'); };
    $('btn-bonus').onclick = function () {
      AudioSys.ensure(); AudioSys.se('decide');
      ST = freshState();
      LOG.length = 0;
      snapshot = { bg: 'bg11', mood: 'green', plate: '', sprites: [], cg: null, chapterTitle: '' };
      pc = 0;
      $('title-screen').classList.remove('shown');
      $('game').classList.add('shown');
      waiting = null;
      AudioSys.play('bgm23');
      jumpTo('bonus_start');
      run();
    };

    // 画面を閉じるボタン
    document.querySelectorAll('[data-close]').forEach(function (b) {
      b.onclick = function () { b.closest('.screen').classList.remove('shown'); $('gallery-screen').classList.remove('view'); };
    });

    // ゲーム内コントロール
    $('btn-auto').onclick = toggleAuto;
    $('btn-skip').onclick = toggleSkip;
    $('btn-log').onclick = function () { AudioSys.se('click'); openLog(); };
    $('btn-save').onclick = function () { AudioSys.se('click'); openSaveScreen('save'); };
    $('btn-load').onclick = function () { AudioSys.se('click'); openSaveScreen('load'); };
    $('btn-menu').onclick = toggleInGameMenu;
    $('menu-to-title').onclick = function () { if (confirm('タイトルへ戻りますか？（オートセーブ済みの箇所から再開できます）')) toTitle(); };
    $('menu-close').onclick = toggleInGameMenu;
    $('menu-config').onclick = function () { $('menu-screen').classList.remove('shown'); applySettings(); $('config-screen').classList.add('shown'); };

    // 設定変更
    $('cfg-speed').oninput = function () { G.settings.speed = parseInt(this.value, 10); $('speed-val').textContent = this.value; saveGlobal(); };
    $('cfg-auto').oninput = function () { G.settings.autoSpeed = parseFloat(this.value); $('auto-val').textContent = Number(this.value).toFixed(1); saveGlobal(); };
    $('cfg-bgm').oninput = function () { G.settings.bgm = parseFloat(this.value); AudioSys.setBgmVol(G.settings.bgm); saveGlobal(); };
    $('cfg-se').oninput = function () { G.settings.se = parseFloat(this.value); AudioSys.setSeVol(G.settings.se); AudioSys.se('click'); saveGlobal(); };
    $('cfg-ph').onchange = function () { G.settings.placeholderStyle = this.checked; phCacheClear(); saveGlobal(); renderSprites(); if (snapshot.bg) showBG(snapshot.bg, true); };

    // タイトルの基本BGMはlick後（自動再生制限のため、最初のクリックで）
    document.addEventListener('click', function once() {
      document.removeEventListener('click', once);
      if ($('title-screen').classList.contains('shown') && !AudioSys.state._titleStarted) {
        AudioSys.state._titleStarted = true;
        AudioSys.play('bgm01');
      }
    });

    toTitle();
  }

  function phCacheClear() { Object.keys(phCache).forEach(function (k) { delete phCache[k]; }); }

  global.VN = {
    boot: boot,
    debug: {
      getState: function () { return ST; }, getPC: function () { return pc; }, getScript: function () { return SCRIPT; },
      jumpTo: jumpTo, computeEnding: computeEnding, state: function () { return ST; },
      waiting: function () { return waiting; }, typing: function () { return typing; },
      instant: function (v) { VN._instant = v; },
      globals: function () { return G; }, logLen: function () { return LOG.length; }
    }
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = global.VN;
})(typeof window !== 'undefined' ? window : globalThis);
