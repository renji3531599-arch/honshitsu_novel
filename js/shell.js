/* ============================================================================
   shell.js ―― UIシェル（タイトル／メニュー各種／ギャラリー／HUB／端末風演出）
   ========================================================================== */
import { backdropSVG, figureSVG, contourSVG } from './visual.js';
import { fmtDate, fmtTime } from './store.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };

export class Shell {
  constructor(opt) {
    Object.assign(this, opt);   // game, dom, store, audio, stage, data, def
    this.choiceSel = -1;
    this._hubCb = null;
    this.buildTitle();
    this.buildTicks();
    this.buildTitleBackdrop();
  }

  /* --------------------------------------------------------------- 共通 --- */
  toast(msg) {
    const t = el('div', 'toast', `<em>✝</em>${esc(msg)}`);
    this.dom.toasts.appendChild(t);
    setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 600); }, 2600);
  }
  buildTicks() {
    ['tl', 'tr', 'bl', 'br'].forEach(p => {
      const d = el('div', 'tick ' + p);
      this.dom.viewport.appendChild(d);
    });
  }
  buildTitleBackdrop() {
    // 下地のSVG（キービジュアル読み込み前のつなぎ・読み込み失敗時の保険）
    this.dom.titleBg.innerHTML = backdropSVG({ id: 'bg_sotsugyoushiki_kaijou', meta: 'sotsugyou/sotsu' });
    this.dom.bootContours.innerHTML = contourSVG('boot', { lines: 13, op: .09 });
    this.dom.veilContours.innerHTML = contourSVG('veil', { lines: 12, op: .11 });
    this.dom.cardContours.innerHTML = contourSVG('card', { lines: 9, op: .13 });
    // タイトルキービジュアル（実画像）。読めたら下地とクロスフェードする。
    const key = this.data.assets.byId['title_key'];
    const img = this.dom.titleKey;
    if (key && key.file && img) {
      img.addEventListener('load', () => {
        img.classList.add('on');
        this.dom.titleBg.classList.add('dim');
      }, { once: true });
      img.addEventListener('error', () => { img.remove(); }, { once: true });
      img.src = key.file;
    }
    if (this.stage.titleFx) this.stage.titleFx.set('dust');
    this.prepareLogo();
  }
  /** ロゴを1文字ずつ包み、段階リビールに備える */
  prepareLogo() {
    const h1 = document.getElementById('logoTitle');
    if (!h1 || h1.dataset.split) return;
    const txt = h1.textContent;
    h1.textContent = '';
    [...txt].forEach((c, i) => {
      const s = document.createElement('span');
      s.className = 'lg-ch';
      s.style.setProperty('--i', i);
      s.textContent = c;
      h1.appendChild(s);
    });
    h1.dataset.split = '1';
  }
  /** タイトルの段階リビールを最初から再生する */
  revealTitle() {
    const t = this.dom.title;
    t.classList.remove('pre');
    t.classList.remove('reveal');
    void t.offsetWidth;
    t.classList.add('reveal');
  }
  setHud(chapter, id) {
    const m = this.store.meta;
    m.visited = m.visited || {};
    if (id) { m.visited['ch:' + id] = 1; this.store.saveMeta(); }
    this.dom.hudLeft.innerHTML = chapter
      ? `<b>${esc(chapter.title)}</b>${chapter.sub ? '　' + esc(chapter.sub) : ''}`
      : '';
    this.dom.hudLeft.classList.remove('pop');
    void this.dom.hudLeft.offsetWidth;
    this.dom.hudLeft.classList.add('pop');
  }
  setScene(sceneId) {
    const m = this.store.meta;
    m.visited = m.visited || {};
    m.visited['sc:' + sceneId] = 1;
    this.store.saveMeta();
    this.dom.hudRight.innerHTML = `<b>${esc(sceneId)}</b>　<span class="k">CH ${esc(this.game.state.chapter || '-')}</span>`;
    const fl = this.flagSummary();
    this.dom.hudRight.dataset.flags = fl;
    this.dom.hudRight.classList.remove('pop');
    void this.dom.hudRight.offsetWidth;
    this.dom.hudRight.classList.add('pop');
  }
  flagSummary() {
    const f = this.game.state.flags;
    return Object.keys(f).filter(k => k !== 'tease' && f[k] > 0).map(k => `${k.replace('flag_', '')}:${f[k]}`).join(' ');
  }
  flashHeart() { /* 心Point は非表示が作法（企画書 7.1） */ }
  setPage() { }
  renderItems() {
    const wrap = this.dom.items;
    wrap.innerHTML = '';
    const list = this.game.state.items || [];
    if (!list.length && this._itemsPeek) wrap.appendChild(el('div', 'item empty', 'まだ何も持っていない'));
    list.forEach(id => {
      const it = (this.def.items || {})[id] || { label: id };
      const a = it.icon ? this.data.assets.byId[it.icon] : null;
      const d = el('div', 'item');
      d.dataset.glyph = '✝';
      d.title = it.label;
      if (a && a.placeholder === false) { d.innerHTML = `<img src="${a.file}" alt="">`; d.dataset.glyph = ''; }
      wrap.appendChild(d);
    });
    wrap.classList.toggle('hidden', !(list.length || this._itemsPeek));
  }
  /* 所持品パネルの覗き見（Iキー）／アイテム入手時は一瞬だけ自動で出す */
  toggleItems() { this._itemsPeek = !this._itemsPeek; this.renderItems(); }
  flashItems() {
    this._itemsPeek = true;
    this.renderItems();
    clearTimeout(this._itemsTimer);
    this._itemsTimer = setTimeout(() => { this._itemsPeek = false; this.renderItems(); }, 2800);
  }
  syncModeButtons() {
    $('#btnAuto').classList.toggle('act', this.game.auto);
    $('#btnSkip').classList.toggle('act', this.game.skip);
  }

  /* ------------------------------------------------------------- タイトル -- */
  buildTitle() {
    const m = this.store.meta;
    const has = (this.store.loadAuto() || this.store.load(0) || this.store.load(1));
    const bonusReady = Object.keys(this.def.endings).filter(k => k !== 'bonus').every(k => m.endings[k]);
    const items = [
      { id: 'new', ja: 'はじめから', en: 'NEW GAME', cls: 'newgame' },
      { id: 'continue', ja: 'つづきから', en: 'CONTINUE', dis: !has },
      { id: 'load', ja: 'ロード', en: 'LOAD' },
      { id: 'gallery', ja: 'ギャラリー', en: 'CG / CHARACTER / MUSIC' },
      { id: 'flow', ja: 'ルート図', en: 'FLOW CHART' },
      { id: 'tips', ja: '✝本質✝辞典', en: 'TIPS / GLOSSARY' },
      { id: 'almanac', ja: '✝本質✝年鑑', en: 'KURAISHI ARCHIVE' },
      { id: 'config', ja: '環境設定', en: 'CONFIG' },
      { id: 'keys', ja: '操作方法', en: 'KEY BOARD' },
    ];
    if (bonusReady) items.push({ id: 'bonus', ja: 'また、この教室で', en: 'BONUS EXTRA ― 全ED回収済み', cls: 'newgame' });
    const nav = this.dom.titleMenu;
    nav.innerHTML = '';
    items.forEach((it, i) => {
      const b = el('button', 'tmenu ' + (it.cls || '') + (it.dis ? ' lock' : ''),
        `<span class="ja">${esc(it.ja)}</span><span class="en">${esc(it.en)}</span>`);
      b.dataset.i = i;
      b.style.setProperty('--i', i);
      b.addEventListener('mouseenter', () => this.audio.se('se_hover'));
      b.addEventListener('click', () => {
        if (it.dis) {
          this.audio.se('se_deny');
          b.classList.remove('deny');
          void b.offsetWidth;
          b.classList.add('deny');
          this.toast('セーブデータがありません');
          return;
        }
        this.audio.se('se_click');
        this.titlePick(it.id);
      });
      nav.appendChild(b);
    });
    // 進捗表示
    const ep = this.dom.titleProgress;
    ep.innerHTML = Object.entries(this.def.endings).map(([id, e]) =>
      `<i class="${m.endings[id] ? 'on' : ''}" title="${esc(e.tier)}">${esc(id === 'bonus' ? 'BONUS' : e.tier.split(' ')[0].replace('END', ''))}</i>`).join('')
      + `<i title="回収CG">${(m.cg || []).length}/52</i>`
      + `<i title="周回">RUN ${m.runs || 0}</i>`;
  }
  async titlePick(id) {
    if (['gallery', 'flow', 'tips', 'almanac', 'config', 'keys'].includes(id)) { this.open(id); return; }
    if (id === 'bonus') { this.cinematicStart('end_bonus', 'end'); return; }
    if (id === 'new') { this.cinematicStart('prologue_001', 'prologue'); return; }
    if (id === 'continue') {
      const snap = this.store.loadAuto() || this.store.list().find(s => !s.empty);
      if (!snap) { this.toast('セーブデータがありません'); return; }
      this.hideTitle();
      await this.veilCover('RECORD ― AUTO SAVE', 'つづきから', 620);
      this.game.restore(snap);
      this.veilLift();
      return;
    }
    // パネル系はタイトルの前面（#overlay z40）に開く。閉じればタイトルに戻る。
    if (id === 'load') { this.open('load'); }
  }
  /** はじめから／BONUS：タイトル→本編のシネマティックな橋渡し */
  async cinematicStart(sceneId, chapterId) {
    const ch = (chapterId && this.data.chapters[chapterId]) || this.data.chapters['prologue'] || {};
    this.stage.setBars(true);
    this.hideTitle();
    this.audio.bgm(null, 1.4);
    await this.veilCover(
      ch.sub ? `${String(chapterId || '').toUpperCase()} ― ${ch.sub}` : 'PROLOGUE',
      ch.title || '',
      950);
    this.game.start(sceneId);
    this.veilLift();
    setTimeout(() => this.stage.setBars(false), 1800);
  }
  /* ------------------------------- 場面転換ヴェール ---------------------- */
  veilCover(kicker = '', title = '', hold = 650) {
    const v = this.dom.veil;
    clearTimeout(this._veilTimer);
    v.classList.remove('lift');
    this.dom.veilKicker.textContent = kicker;
    this.dom.veilTitle.textContent = title;
    v.classList.remove('on');
    void v.offsetWidth;
    v.classList.add('on');
    return new Promise(r => setTimeout(r, hold));
  }
  veilLift() {
    const v = this.dom.veil;
    v.classList.remove('on');
    v.classList.add('lift');
    clearTimeout(this._veilTimer);
    this._veilTimer = setTimeout(() => v.classList.remove('lift'), 1700);
  }
  hideTitle() {
    this.dom.title.classList.add('out');
    const tw = this.dom.textwrap;
    tw.classList.remove('hidden');
    tw.classList.remove('enter');
    void tw.offsetWidth;
    tw.classList.add('enter');
    setTimeout(() => tw.classList.remove('enter'), 1000);
  }
  showTitle() {
    this.dom.title.classList.remove('out');
    this.buildTitle();
    this.revealTitle();
    this.audio.bgm('bgm01', 1.5);
  }
  toGame() { this.dom.title.classList.add('out'); }
  toTitle() { this.showTitle(); }

  /* --------------------------------------------------------------- 選択肢 -- */
  showChoices(prompt, opts, cb) {
    const wrap = this.dom.choices;
    this._choiceCb = cb;
    this.dom.choicePrompt.textContent = prompt || '';
    this.dom.choiceList.innerHTML = '';
    this.choiceSel = 0;
    opts.forEach((o, i) => {
      const b = el('button', 'choice', `<span class="lab">${esc(o.label)}</span>${o.sub ? `<span class="sub">${esc(o.sub)}</span>` : ''}`);
      b.addEventListener('mouseenter', () => { this.choiceSel = i; this.paintChoices(); this.audio.se('se_hover'); });
      b.addEventListener('click', () => this.pickChoice(i));
      this.dom.choiceList.appendChild(b);
    });
    wrap.classList.remove('hidden');
    wrap.classList.add('in');
    this.paintChoices();
  }
  paintChoices() {
    $$('#choiceList .choice').forEach((b, i) => b.style.transform = i === this.choiceSel ? 'translateX(calc(var(--u)*6))' : '');
  }
  moveChoice(d) {
    const n = this.dom.choiceList.children.length;
    if (!n) return;
    this.choiceSel = (this.choiceSel + d + n) % n;
    this.paintChoices();
    this.audio.se('se_cursor');
  }
  pickChoice(i) {
    if (this._choiceCb) { const cb = this._choiceCb; this._choiceCb = null; cb(i); }
  }
  hideChoices() { this.dom.choices.classList.add('hidden'); this.dom.choices.classList.remove('in'); }

  /* ------------------------------------------------------------- 端末風 --- */
  openChat(chat, onClose) {
    const d = this.dom;
    d.screenFrame.dataset.kind = chat.kind || 'line';
    d.screenTitle.textContent = chat.title || '';
    d.screenKind.textContent = ({ line: 'GROUP CHAT', bbs: 'BBS', juken: 'ENTRANCE BBS', live: 'LIVE' })[chat.kind] || 'MESSAGE';
    const body = d.screenBody;
    body.innerHTML = '';
    if (chat.kind === 'live') body.appendChild(el('div', 'stream-head', `<span>星と地面とせいちちゃんねる</span><span>視聴者 32人 ／ 非公開配信</span>`));
    (chat.lines || []).forEach((ln, i) => {
      let node;
      if (ln.kind === 'msg') node = el('div', 'msg', `<span class="who">${esc(ln.who)}</span><div class="bub">${esc(ln.text)}</div>`);
      else if (ln.kind === 'me') node = el('div', 'msg me', `<div class="bub">${esc(ln.text)}</div><span class="who">${esc(ln.who)}</span>`);
      else if (ln.kind === 'sys') node = el('div', 'msg sys', `<div class="bub">${esc(ln.text)}</div>`);
      else if (ln.kind === 'note') node = el('div', 'msg sys', `<div class="bub">※ ${esc(ln.text)}</div>`);
      else if (ln.kind === 'post') node = el('div', 'post' + (ln.self ? ' self' : ''),
        `<div class="hd"><b>&gt;&gt;${esc(ln.no)}</b><span>${esc(ln.who)}</span></div><div class="bd">${esc(ln.text)}</div>`);
      else node = el('div', 'live-cmt', `<b>${esc(ln.who)}</b>${esc(ln.text)}`);
      node.style.animation = `ovin .45s ${Math.min(i * 60, 900)}ms ease both`;
      body.appendChild(node);
    });
    d.screenWrap.classList.add('on');
    this.audio.se('se_notify');
    const close = () => {
      d.screenWrap.classList.remove('on');
      d.screenWrap.removeEventListener('click', close);
      this._chatClose = null;
      onClose && onClose();
    };
    this._chatClose = close;
    setTimeout(() => d.screenWrap.addEventListener('click', close), 120);
  }

  /* ---------------------------------------------------------------- HUB --- */
  openHub(cb) {
    this._hubCb = cb;
    const d = this.dom;
    d.hub.classList.add('on');
    d.hubList.innerHTML = '';
    const routes = this.def.routes || [];
    routes.forEach((r, ri) => {
      const done = !!this.game.state.routes[r.key];
      const card = el('button', 'hub-card' + (done ? ' done' : ''), `
        <span class="no">ROUTE ${r.no} ／ ${esc(r.who)}</span>
        <span class="nm">${esc(r.title)}</span>
        <span class="tt">「${esc(r.sub)}」</span>
        <span class="bl">${esc(r.blurb)}</span>
        <span class="bar"><i style="width:${done ? 100 : 0}%"></i></span>
        <span class="st">${done ? '✔ 読了' : '未読'}</span>`);
      card.style.setProperty('--i', ri);
      card.addEventListener('mouseenter', () => this.audio.se('se_hover'));
      card.addEventListener('click', () => {
        this.audio.se('se_click');
        if (done) { this.toast('この話はもう聞いた。同じ話を数えると記録が水増しになるので、読み返しは LOG から'); return; }
        d.hub.classList.remove('on');
        this._hubCb = null;
        cb(r.scene);
      });
      d.hubList.appendChild(card);
    });
    const done = routes.filter(r => this.game.state.routes[r.key]).length;
    d.hubFoot.innerHTML = `<span>読了 ${done}／${routes.length} ルート</span>`;
    const all = done >= routes.length;
    const btn = el('button', '', all ? '収束章へ進む →' : `あと ${routes.length - done} 話残っている（飛ばす）`);
    btn.addEventListener('click', () => {
      this.audio.se('se_click');
      d.hub.classList.remove('on');
      this._hubCb = null;
      if (!all) {
        routes.forEach(r => { this.game.state.routes[r.key] = true; });
        this.toast('話を急いでまとめた。心Point は、増えない。');
      }
      cb('g1');
    });
    d.hubFoot.appendChild(btn);
  }
  closeHub() { this.dom.hub.classList.remove('on'); if (this._hubCb) { const c = this._hubCb; this._hubCb = null; c(null); } }

  /* --------------------------------------------------------------- backlog -- */
  renderLog() {
    if (!this._logOpen) return;
    const body = this.dom.ovBody;
    if (!body.dataset.kind || body.dataset.kind !== 'log') return;
    body.innerHTML = '';
    const box = el('div', 'doc-list');
    this.game.history.slice().reverse().slice(0, 200).reverse().forEach(h => {
      const sp = h.sp ? (this.def.speakers[h.sp] || {}) : {};
      box.appendChild(el('div', 'doc', `<h4 style="color:${sp.color || '#cbb27c'}">${esc(sp.name || '───')}${h.tag ? `<span class="tag">${esc(h.tag)}</span>` : ''}</h4><p>${esc(h.txt)}</p>`));
    });
    body.appendChild(box);
  }

  /* --------------------------------------------------------------- overlay -- */
  open(kind, arg) {
    const d = this.dom;
    d.overlay.classList.remove('hidden');
    d.ovBody.dataset.kind = kind;
    this._logOpen = kind === 'log';
    const conf = {
      config: ['SYSTEM', 'CONFIG ― 環境設定', () => this.paneConfig()],
      save: ['SYSTEM', 'SAVE ― 記録する', () => this.paneSave('save')],
      load: ['SYSTEM', 'LOAD ― 読み出す', () => this.paneSave('load')],
      gallery: ['ARCHIVE', 'GALLERY ― 回収した一枚絵', () => this.paneGallery(arg || 'cg')],
      log: ['BACKLOG', 'LOG ― 今までの話', () => this.renderLog()],
      tips: ['TIPS', '✝本質✝辞典', () => this.paneTips()],
      almanac: ['ARCHIVE', '✝本質✝年鑑（倉石暁 編）', () => this.paneAlmanac()],
      flow: ['MAP', 'ROUTE ― まだ地図の途中で', () => this.paneFlow()],
      keys: ['SYSTEM', 'KEY BOARD ― 操作', () => this.paneKeys()],
      end: ['ENDING', '', () => this.paneEnd(arg)],
    }[kind];
    if (!conf) return;
    d.ovKicker.textContent = conf[0];
    d.ovTitle.textContent = conf[1];
    d.ovBody.innerHTML = '';
    d.ovFoot.innerHTML = `<span>Esc / ✕ で閉じる</span><span>${esc(this.game.sceneLabel())}</span>`;
    conf[2]();
  }
  close() {
    this.dom.overlay.classList.add('hidden');
    this._logOpen = false;
    if (this._pendingEnd) { const f = this._pendingEnd; this._pendingEnd = null; f(); }
  }
  hideMenus() { this.close(); this.hideChoices(); this.dom.hub.classList.remove('on'); this.dom.screenWrap.classList.remove('on'); }

  /* ---------------------------------------------------------- CONFIG ------ */
  paneConfig() {
    const c = this.store.config;
    const body = this.dom.ovBody;
    const sect = el('div', 'sect');
    const g2 = el('div', 'grid2');
    const slider = (label, key, min, max, step, fmt) => {
      const row = el('div', 'row', `<label>${label}</label><input type="range"><span class="val"></span>`);
      const inp = row.querySelector('input'), val = row.querySelector('.val');
      inp.min = min; inp.max = max; inp.step = step; inp.value = c[key];
      const paint = () => {
        val.textContent = fmt ? fmt(+inp.value) : inp.value;
        inp.style.setProperty('--p', ((inp.value - min) / (max - min) * 100) + '%');
      };
      inp.addEventListener('input', () => { c[key] = +inp.value; paint(); this.store.saveConfig(); });
      paint();
      return row;
    };
    const seg = (label, key, opts) => {
      const row = el('div', 'row');
      row.appendChild(el('label', null, label));
      const box = el('div', 'seg');
      opts.forEach(([v, t]) => {
        const b = el('button', c[key] === v ? 'on' : '', t);
        b.addEventListener('click', () => {
          c[key] = v; this.store.saveConfig(); this.audio.setVol(key === 'bgmVol' ? 'bgm' : key, c[key]);
          [...box.children].forEach((x, i) => x.classList.toggle('on', opts[i][0] === v));
          if (key === 'cgMode') { this.stage.cg(this.stage.cgId, {}); }
          if (key === 'blend') this.applyBlend();
        });
        box.appendChild(b);
      });
      row.appendChild(box);
      return row;
    };
    const check = (label, key, cb) => {
      const row = el('div', 'row');
      row.appendChild(el('label', null, label));
      const box = el('div', 'seg');
      const mk = (t, v) => { const b = el('button', !!c[key] === v ? 'on' : '', t); b.addEventListener('click', () => { c[key] = v; this.store.saveConfig(); [...box.children].forEach(x => x.classList.remove('on')); b.classList.add('on'); cb && cb(); }); box.appendChild(b); };
      mk('ON', true); mk('OFF', false);
      row.appendChild(box);
      return row;
    };
    g2.appendChild(el('h3', null, '表示'));
    const colA = el('div');
    colA.appendChild(slider('文字送り速度', 'textSpeed', .25, 4, .25, v => v.toFixed(2) + '×'));
    colA.appendChild(slider('オート待機', 'autoDelay', 400, 4000, 100, v => (v / 1000).toFixed(1) + '秒'));
    colA.appendChild(check('テキストクリック送り', 'advanceClick'));
    colA.appendChild(check('立ち絵スロット名を表示', 'showSpriteTag', () => this.applySpriteTag()));
    colA.appendChild(seg('CG表示', 'cgMode', [['window', '箱あり'], ['full', '全画面']]));
    colA.appendChild(seg('画像合成', 'blend', [['multiply', 'multiply（白背景用）'], ['normal', 'normal（透過素材用）']]));
    g2.appendChild(colA);
    const colB = el('div');
    colB.appendChild(el('h3', null, '音量・効果'));
    colB.appendChild(slider('マスター音量', 'master', 0, 1, .05, v => Math.round(v * 100) + '%'));
    colB.appendChild(slider('BGM', 'bgmVol', 0, 1, .05, v => Math.round(v * 100) + '%'));
    colB.appendChild(slider('SE', 'seVol', 0, 1, .05, v => Math.round(v * 100) + '%'));
    colB.appendChild(check('音声を鳴らす', 'audio', () => { this.audio.enabled = !!c.audio; if (!c.audio) this.audio.stopAll(); else this.audio.bgm(this.audio.now || 'bgm02', 1); }));
    colB.appendChild(check('フィルム粒子', 'grain', () => this.applyGrade()));
    colB.appendChild(check('ビネット', 'vignette', () => this.applyGrade()));
    colB.appendChild(check('画面シェイク', 'shake'));
    colB.appendChild(check('自動セーブ', 'autosave'));
    g2.appendChild(colB);
    sect.appendChild(g2);
    sect.appendChild(el('p', 'hint', '※ 画像は起動時に先読みされます。背景・立ち絵の実素材を <b>assets/…</b> に同名で配置し、<b>data/assets.json</b> の該当行の placeholder を false にすると、そのまま画面に出ます（合成は multiply＝白＝透明）。白紙のあいだはエンジンが SVG で補完描画します。'));
    const danger = el('div', 'btnrow');
    const b1 = el('button', null, '回収データを初期化する');
    b1.addEventListener('click', () => {
      if (!confirm('ギャラリー・辞典・年鑑・エンド記録をすべて削除します。よろしいですか？')) return;
      this.store.resetMeta(); this.toast('初期化しました'); this.buildTitle();
    });
    const b2 = el('button', null, 'セーブデータを一括削除');
    b2.addEventListener('click', () => {
      if (!confirm('全スロットとオートセーブを削除します。')) return;
      for (let i = 0; i < 12; i++) this.store.remove(i);
      this.store.remove('auto');
      this.toast('削除しました');
    });
    danger.appendChild(b1); danger.appendChild(b2);
    sect.appendChild(danger);
    body.appendChild(sect);
  }
  applyBlend() {
    const mode = this.store.config.blend || 'multiply';
    const st = this.dom.stage;
    st.dataset.blend = mode;
    st.querySelectorAll('.chr img,.chr .sil,#bgImg,#cgImg').forEach(n => n.style.mixBlendMode = mode);
  }
  applySpriteTag() {
    this.dom.stage.querySelectorAll('.chr .nametag').forEach(n => n.style.display = this.store.config.showSpriteTag ? '' : 'none');
  }
  applyGrade() {
    const c = this.store.config;
    this.dom.fxGrain.style.display = c.grain ? '' : 'none';
    this.dom.stage.querySelectorAll('.fx-vignette').forEach(n => n.style.display = c.vignette ? '' : 'none');
  }

  /* -------------------------------------------------------- SAVE / LOAD ---- */
  paneSave(mode) {
    const body = this.dom.ovBody;
    const sect = el('div', 'sect');
    sect.appendChild(el('h3', null, mode === 'save' ? '記録スロット' : '記録済みスロット'));
    const grid = el('div', 'slots');
    const list = this.store.list();
    const push = (snap, idx, label, delFn) => {
      const d = snap && !snap.empty ? snap : null;
      const card = el('button', 'slot' + (d ? '' : ' empty'));
      const art = d && d.bg ? this.data.assets.byId[d.bg] : null;
      card.innerHTML = `
        <span class="idx">${esc(label)}</span>
        <span class="sc">${d ? esc(d.label || d.scene) : '― 空きスロット ―'}</span>
        <span class="dt">${d ? `${fmtDate(d.savedAt)} ／ ${fmtTime((d.playtime || 0) * 1000)} ／ CH ${esc((d.state && d.state.chapter) || '-')}` : ' '}</span>
        <span class="thumb">${d ? (art && art.placeholder === false ? `<img src="${art.file}" alt="">` : backdropSVG(art || { id: 'x', meta: 'kyoshitsu/hiru' })) : ''}</span>
        ${d ? '<span class="kill" title="削除">✕</span>' : ''}`;
      card.addEventListener('mouseenter', () => this.audio.se('se_hover'));
      card.addEventListener('click', (ev) => {
        if (ev.target.classList.contains('kill')) { delFn && delFn(); this.audio.se('se_deny'); this.open(mode === 'save' ? 'save' : 'load', mode); return; }
        this.audio.se('se_click');
        if (mode === 'save') { this.store.save(idx, this.game.snapshot()); this.toast(`SLOT ${idx} に記録した`); this.open('save'); }
        else {
          if (!d) { this.audio.se('se_deny'); this.toast('空きスロットです'); return; }
          this.close(); this.hideTitle(); this.game.restore(d);
        }
      });
      grid.appendChild(card);
    };
    list.forEach(s => push(s, s.slot, 'SLOT ' + String(s.slot + 1).padStart(2, '0'), () => this.store.remove(s.slot)));
    const auto = this.store.loadAuto();
    push(auto ? { ...auto, slot: 'auto' } : null, 'auto', 'AUTO SAVE', null);
    sect.appendChild(grid);
    sect.appendChild(el('p', 'hint', mode === 'save'
      ? 'F1 ですぐ上書き（クイックセーブ）、F2 でクイックロード。オートセーブは常時、直前の位置を保持します。'
      : '読み込むと、その時点の画面（背景・立ち絵・BGM）までまとめて再現します。'));
    body.appendChild(sect);
  }

  /* ------------------------------------------------------------- GALLERY --- */
  paneGallery(tab) {
    const body = this.dom.ovBody;
    const tabs = el('div', 'tabs');
    [['cg', '名場面 CG'], ['end', 'エンディング CG'], ['chr', '立ち絵'], ['music', 'BGM / SE'], ['chat', '端末画面']].forEach(([k, t]) => {
      const b = el('button', k === tab ? 'on' : '', `${t}`);
      b.addEventListener('click', () => { this.audio.se('se_click'); this.open('gallery', k); });
      tabs.appendChild(b);
    });
    body.appendChild(tabs);
    const m = this.store.meta;
    if (tab === 'cg' || tab === 'end') {
      const list = this.data.assets.list.filter(a => a.cat === 'cg' && (tab === 'end' ? /cg_end/.test(a.id) : !/cg_end/.test(a.id)));
      const grid = el('div', 'cg-grid');
      list.forEach(a => {
        const got = m.cg.includes(a.id);
        const cell = el('button', 'cg-cell' + (got ? '' : ' lock'));
        cell.innerHTML = `<div class="im">${got ? this.cellArt(a) : ''}</div><div class="lb">${esc(a.id.split('_')[0])} ${esc(got ? a.label : '───')}</div>`;
        if (got) cell.addEventListener('click', () => this.showArt(a, true));
        grid.appendChild(cell);
      });
      const s = el('div', 'sect');
      s.appendChild(el('h3', null, `回収 ${(m.cg || []).length} / ${list.length} 枚`));
      s.appendChild(grid);
      s.appendChild(el('p', 'hint', '回収したCGはクリックで拡大鑑賞できます（等倍／1.6×／2.4×）。cg02（写真がこぼれる瞬間）と cg22（完成した地形図）は、とくに拡大向きの一枚です。'));
      body.appendChild(s);
    } else if (tab === 'chr') {
      const sect = el('div', 'sect');
      const box = el('div', 'chr-lab');
      const names = el('div', 'names');
      const stage = el('div', 'chr-stage');
      const slugs = [...new Set(this.data.assets.list.filter(a => a.cat === 'chr').map(a => a.meta))];
      const cur = this._chrSlug || slugs[0];
      slugs.forEach(sl => {
        const list = this.data.assets.list.filter(a => a.cat === 'chr' && a.meta === sl);
        const got = (m.chr[sl] || []).length;
        const b = el('button', sl === cur ? 'on' : '', `${esc(this.chrName(sl))} <span style="opacity:.6;font-size:.8em">${got}/${list.length}</span>`);
        b.addEventListener('click', () => { this._chrSlug = sl; this.open('gallery', 'chr'); });
        names.appendChild(b);
      });
      const list = this.data.assets.list.filter(a => a.cat === 'chr' && a.meta === cur);
      list.forEach(a => {
        const expr = (a.id.match(/_(\d+)_/) || [])[1] || '01';
        const f = el('figure');
        const got = (m.chr[cur] || []).includes(expr);
        f.innerHTML = `<div class="st" style="opacity:${got ? 1 : .22}">${this.spriteArt(a, cur, expr)}</div><figcaption>${esc(expr)}<br>${esc(a.label.replace(/^[^\s]+\s/, ''))}</figcaption>`;
        if (got) f.addEventListener('click', () => this.showArt(a));
        stage.appendChild(f);
      });
      box.appendChild(names); box.appendChild(stage);
      sect.appendChild(box);
      sect.appendChild(el('p', 'hint', '表情スロット一覧。本編で一度でも出した差分が灯ります。白紙素材のあいだは SVG の影で代用しています。'));
      body.appendChild(sect);
    } else if (tab === 'music') {
      const sect = el('div', 'sect');
      const tbl = el('table', 'almanac');
      tbl.innerHTML = `<tr><th>ID</th><th>用途</th><th>主題</th><th></th></tr>` +
        Object.entries(this.def.bgmLabels).map(([id, label]) => {
          const heard = (m.music || []).includes(id);
          return `<tr><td>${id}</td><td>${esc(label)}</td><td>${heard ? '✔ 再生済み' : '―'}</td>
            <td style="text-align:right"><button class="bigbtn" data-bgm="${id}" style="padding:4px 10px;font-size:10px">▶試聴</button></td></tr>`;
        }).join('');
      sect.appendChild(tbl);
      const tbl2 = el('table', 'almanac');
      tbl2.style.marginTop = '18px';
      tbl2.innerHTML = `<tr><th>ID</th><th>効果音</th><th></th></tr>` + Object.entries(this.def.seLabels).map(([id, l]) =>
        `<tr><td>${id}</td><td>${esc(l)}</td><td style="text-align:right"><button class="bigbtn" data-se="${id}" style="padding:4px 10px;font-size:10px">▶</button></td></tr>`).join('');
      sect.appendChild(tbl2);
      sect.appendChild(el('p', 'hint', '※ 現在 BGM/SE は WebAudio による手続き生成（仮音源）です。実音源を <b>audio/bgm01.ogg</b> 等の名前で置けば、後述の <b>data/audio.json</b> で差し替えられます。'));
      body.appendChild(sect);
      $$('button[data-bgm]', sect).forEach(b => b.addEventListener('click', () => { this.audio.bgm(b.dataset.bgm, .6); this.toast('BGM試聴: ' + b.dataset.bgm); }));
      $$('button[data-se]', sect).forEach(b => b.addEventListener('click', () => this.audio.se(b.dataset.se)));
    } else if (tab === 'chat') {
      const sect = el('div', 'sect');
      const grid = el('div', 'cg-grid');
      Object.values(this.data.chats).forEach(c => {
        const got = (m.chats || []).includes(c.id);
        const cell = el('button', 'cg-cell' + (got ? '' : ' lock'));
        cell.innerHTML = `<div class="im" style="background:#141210;display:grid;place-items:center;font-family:var(--ff-sans);font-size:11px;color:${got ? 'var(--gold)' : '#666'}">${got ? esc(c.kind.toUpperCase()) : 'LOCK'}</div>
          <div class="lb">${esc(got ? c.title : '───')}</div>`;
        if (got) cell.addEventListener('click', () => {
          // 端末画面はステージ層なので、タイトルから開いた場合はタイトルを一旦退ける
          const fromTitle = !this.dom.title.classList.contains('out');
          if (fromTitle) this.dom.title.classList.add('out');
          this.close();
          this.openChat(c, () => {
            if (fromTitle) this.dom.title.classList.remove('out');
            this.open('gallery', 'chat');
          });
        });
        grid.appendChild(cell);
      });
      sect.appendChild(el('h3', null, 'グループライン／掲示板／配信 画面'));
      sect.appendChild(grid);
      sect.appendChild(el('p', 'hint', '本編で開いた画面が再現されます。閉じるとこの一覧に戻ります。'));
      body.appendChild(sect);
    }
  }
  chrName(slug) {
    const s = Object.entries(this.def.speakers).find(([, v]) => v.sprite === slug);
    return s ? s[1].name : slug;
  }
  cellArt(a) {
    if (a.placeholder === false) return `<img src="${a.file}" alt="">`;
    if (a.cat === 'cg') return this.stage.cgBackdrop(a);
    return backdropSVG(a);
  }
  spriteArt(a, slug, expr) {
    if (a && a.placeholder === false) return `<img src="${a.file}" alt="">`;
    return figureSVG(slug, expr);
  }
  showArt(a, zoom = false) {
    const v = el('div', 'cg-view');
    v.innerHTML = `<div class="box">
      <div class="art">${this.cellArt(a)}</div>
      <div class="cap">${esc(a.id)} ― ${esc(a.desc || a.label)}</div>
      <div class="note">${a.placeholder === false ? '実画像を表示しています。' : `※ プレースホルダー表示中。実素材は <b>${esc(a.file)}</b> に配置されます。`}</div>
      <div class="zoom">${zoom ? `<button data-z="1">等倍</button><button data-z="1.6">1.6×</button><button data-z="2.4">2.4×</button>` : ''}<button class="close">閉じる (Esc)</button></div>
    </div>`;
    document.body.appendChild(v);
    const art = v.querySelector('.art');
    $$('button[data-z]', v).forEach(b => b.addEventListener('click', () => {
      art.style.transform = `scale(${b.dataset.z})`;
      art.style.transition = 'transform .5s cubic-bezier(.2,.8,.2,1)';
    }));
    v.querySelector('.close').addEventListener('click', () => v.remove());
    v.addEventListener('click', (e) => { if (e.target === v) v.remove(); });
    this.audio.se('se_photo');
    this._escStack = (() => { const h = (e) => { if (e.key === 'Escape') { v.remove(); document.removeEventListener('keydown', h); } }; document.addEventListener('keydown', h); })();
  }
  cgNote(id) { }

  /* ---------------------------------------------------------------- TIPS --- */
  paneTips() {
    const body = this.dom.ovBody;
    const m = this.store.meta;
    const terms = this.data.terms || {};
    const ids = Object.keys(terms);
    const sect = el('div', 'sect');
    sect.appendChild(el('h3', null, `収集 ${(m.tips || []).length} / ${ids.length} 語`));
    const list = el('div', 'doc-list');
    ids.forEach(id => {
      const t = terms[id];
      const got = (m.tips || []).includes(id);
      const d = el('div', 'doc' + (got ? '' : ' lock'));
      d.innerHTML = got
        ? `<h4>${esc(t.title)}<span class="tag">${esc(t.tag || '')}</span></h4><p>${esc(t.body)}</p>${t.src ? `<div class="src">出典：${esc(t.src)}</div>` : ''}`
        : `<h4>？？？<span class="tag">未収集</span></h4><p>本編のどこかで、その言葉に触れるはずです。</p>`;
      list.appendChild(d);
    });
    sect.appendChild(list);
    sect.appendChild(el('p', 'hint', '原作三部作を未読のプレイヤーのための補助線。定義できないものほど、丁寧に載せてある。'));
    body.appendChild(sect);
  }

  /* ------------------------------------------------------------- 年鑑 ------ */
  paneAlmanac() {
    const body = this.dom.ovBody;
    const m = this.store.meta;
    const sect = el('div', 'sect');
    const paper = el('div', 'paperprint');
    const rows = (this.def.counters || []).map(c => `　${c.label}：${(m.almanac[c.key] || 0)}${c.unit || '回'}`).join('\n');
    const ends = Object.entries(this.def.endings).map(([id, e]) => `　${m.endings[id] ? '✔' : '×'} ${e.tier}「${e.label}」`).join('\n');
    paper.innerHTML = `<h4>✝本質✝年鑑 速報値（倉石暁 編）</h4><pre>${esc(
`周回 数：${m.runs || 0}周目
総プレイ時間：${fmtTime((this.game.playtime || 0) * 1000)}
累計再生回数（本篇内カウント）
${rows}

―――― エンディング記録 ――――
${ends}
`)}<pre>
      <div style="margin-top:8px;font-size:.92em">※ 「✝本質✝の歴史的記録として」数えています。正確な年鑑を作る必要がない、という三重先輩の意見は却下しました。</div>`;
    sect.appendChild(paper);
    const tbl = el('table', 'almanac');
    tbl.innerHTML = `<tr><th>Flag</th><th>概要</th><th>今週の到達値</th></tr>` + (this.def.flags || []).map(f =>
      `<tr><td>${esc(f.key.replace('flag_', 'FLAG_').toUpperCase())}</td><td>${esc(f.desc)}</td><td class="n">${this.game.state.flags[f.key] || 0}</td></tr>`).join('')
      + `<tr><td>心Point</td><td>本音に寄り添った合計（非表示ゲージ）</td><td class="n">${this.game.state.heart}</td></tr>`;
    sect.appendChild(el('h3', null, 'フラグ管理表（実値）'));
    sect.appendChild(tbl);
    sect.appendChild(el('p', 'hint', '※ 心Point は本来プレイヤーに非表示です。年鑑画面のみ、開発協力として倉石がこっそり載せています。'));
    body.appendChild(sect);
  }

  /* ------------------------------------------------------------ FLOW ------ */
  paneFlow() {
    const body = this.dom.ovBody;
    const v = this.store.meta.visited || {};
    const sc = (id) => !!v['sc:' + id];
    const wrap = el('div', 'flow2');
    const node = (k, t, id) => {
      const done = sc(id);
      return el('div', 'f2-node' + (done ? ' done' : ''),
        `<span class="k">${esc(k)}</span><span class="t">${esc(t)}</span>` +
        `<span class="s">${done ? '✔ 到達済み' : '― 未到達 ―'}</span>`);
    };
    // 本筋：プロローグ→第一章→HUB
    const spine = el('div', 'f2-spine');
    spine.appendChild(node('PROLOGUE', '三度目の春、まだ来ない', 'prologue_001'));
    spine.appendChild(node('CHAPTER 1', '差出人不明の写真', 'c004_hokanko'));
    spine.appendChild(node('HUB', '見送りの準備、始めます', 'hub_open'));
    wrap.appendChild(spine);
    // 分岐：HUB ― 6ルート
    const bus = el('div', 'f2-bus');
    bus.appendChild(el('div', 'f2-bus-label', '― HUB ― 好きな順番で ―'));
    const rg = el('div', 'f2-routes');
    (this.def.routes || []).forEach(r => {
      const seen = sc(r.scene) || !!this.game.state.routes[r.key] || !!this.store.meta.routes[r.key];
      rg.appendChild(el('div', 'f2-route' + (seen ? ' done' : ''),
        `<span class="no">ROUTE ${esc(r.no)} ／ ${esc(r.who)}</span>` +
        `<span class="nm">${esc(r.title)}</span>` +
        `<span class="tt">「${esc(r.sub)}」</span>` +
        `<span class="st">${seen ? '✔ 読了' : '未読'}</span>`));
    });
    bus.appendChild(rg);
    wrap.appendChild(bus);
    // 収束：地図を作る夜→終章
    const spine2 = el('div', 'f2-spine');
    spine2.appendChild(node('CONVERGE', '地図を作る夜', 'g1'));
    spine2.appendChild(node('CLIMAX', '窓の外に、ずっといた人', 'h1'));
    wrap.appendChild(spine2);
    // 結末：エンディング一覧
    const m = this.store.meta;
    const ends = el('div', 'f2-bus');
    ends.appendChild(el('div', 'f2-bus-label',
      `― ENDINGS ― ${Object.keys(m.endings || {}).length} / ${Object.keys(this.def.endings).length} 到達 ―`));
    const eg = el('div', 'f2-ends');
    Object.entries(this.def.endings).forEach(([id, e]) => {
      const has = !!m.endings[id];
      const cls = /TRUE/.test(e.tier) ? 'true' : /COMEDY|BONUS/.test(e.tier) ? 'secret' : /GOOD/.test(e.tier) ? 'good' : '';
      const d = el('div', `f2-end ${cls}${has ? ' done' : ' lock'}`,
        `<span class="k">${esc(e.tier)}</span><span class="t">${has ? '「' + esc(e.label) + '」' : '？？？'}</span>`);
      d.title = has ? (e.cond || '') : 'まだ到達していません';
      eg.appendChild(d);
    });
    ends.appendChild(eg);
    wrap.appendChild(ends);

    const sect = el('div', 'sect');
    sect.appendChild(wrap);
    const chCount = Object.keys(v).filter(k => k.startsWith('ch:')).length;
    sect.appendChild(el('div', 'legend',
      `<span><i></i>到達済み</span><span class="g"><i></i>読了ルート</span>` +
      `<span>HUBの6ルートは訪問順自由</span><span>章 ${chCount}/${Object.keys(this.data.chapters).length}</span>`));
    body.appendChild(sect);
  }

  /* -------------------------------------------------------------- KEYS ----- */
  paneKeys() {
    const keys = [
      ['クリック / Enter / Space', 'テキスト送り'],
      ['Ctrl（長押し）/ K', 'スキップ'],
      ['A', 'オート'],
      ['Backspace / 右クリック', 'バックログ'],
      ['1〜9', '選択肢を選ぶ'],
      ['← / →', '選択肢を移動'],
      ['F1 / F2', 'クイックセーブ／クイックロード'],
      ['Q', 'クイックメニュー'],
      ['S / L / C', 'セーブ／ロード／環境設定'],
      ['G / T / R', 'ギャラリー／辞典／ルート図'],
      ['Y', '✝本質✝年鑑（倉石暁 編）'],
      ['I', '所持品の表示・非表示'],
      ['Esc', 'ウインドウを閉じる／メニュー'],
      ['H', 'HUD表示のON・OFF'],
    ];
    const sect = el('div', 'sect');
    sect.innerHTML = `<div class="doc-list">${keys.map(([k, v]) =>
      `<div class="doc" style="display:flex;justify-content:space-between;align-items:center"><h4 style="margin:0"><span class="kbd">${esc(k)}</span></h4><p style="margin:0">${esc(v)}</p></div>`).join('')}</div>`;
    sect.appendChild(el('p', 'hint', '※ マウスでもキーボードでも、どちらからでも遊べる構成にしてあります。'));
    this.dom.ovBody.appendChild(sect);
  }

  /* ------------------------------------------------------------ ENDING ----- */
  showEnding(id, title, j) {
    this.hideMenus();
    const e = this.def.endings[id] || { label: title || id, tier: 'ENDING', color: '#cbb27c', cg: null, cond: '' };
    this._pendingEnd = null;
    this.open('end', { id, e, j, title });
  }
  paneEnd(arg) {
    const { id, e, j, title } = arg;
    const m = this.store.meta;
    const allBut = Object.keys(this.def.endings).filter(k => k !== 'bonus');
    const bonusReady = allBut.every(k => m.endings[k]);
    const cg = e.cg ? this.data.assets.byId[e.cg] : null;
    const maj = (this.def.flags || []).filter(f => f.key !== 'flag_kuraishi').length;
    const body = this.dom.ovBody;
    this.dom.ovKicker.textContent = e.tier || 'ENDING';
    const big = String(title || e.label || '')
      .replace(/^(?:TRUE END|GOOD END|NORMAL END|BITTERSWEET END|COMEDY SECRET END|BONUS EXTRA)\s*[^「]*?(?=「)/, '')
      .replace(/^「(.*)」$/, '$1');
    this.dom.ovTitle.textContent = '「' + big + '」';
    const sect = el('div', 'endcard');
    const flagsRows = (this.def.flags || []).map(f => `
      <div class="g"><span style="width:6em">${esc(f.label)}</span><span class="bar"><i style="width:${Math.min(100, (this.game.state.flags[f.key] || 0) * 25)}%"></i></span><span style="width:2.4em;text-align:right">${this.game.state.flags[f.key] || 0}</span></div>`).join('');
    const left = el('div');
    left.innerHTML = `
      <div class="tier">${esc(e.tier)}</div>
      <div class="big">「${esc(big)}」</div>
      <div class="endlog" style="margin-top:14px">
        <div>心Point　<b>${j.heart}</b>　（${e.cond}）</div>
        <div>主要Flag　<b>${j.flagcount} / ${maj}</b>　到達ルート <b>${Object.keys(this.game.state.routes).length}/6</b></div>
        <div>回収CG　<b>${(m.cg || []).length}</b>　エンド <b>${Object.keys(m.endings).length}/14</b>　周回 <b>${m.runs || 1}</b></div>
      </div>
      <div class="gauge">${flagsRows}</div>`;
    const right = el('div', 'end-art');
    right.innerHTML = `<div class="art">${cg ? this.cellArt(cg) : ''}</div>
      <div class="cap">${cg ? esc(cg.id) + ' ― ' + esc(cg.label) : ''}</div>
      <div class="note">到達条件：${esc(e.cond)}<br>${bonusReady ? '★ BONUS EXTRA「また、この教室で」がタイトル画面に解禁されました。' : `BONUS EXTRA 解禁まであと ${allBut.filter(k => !m.endings[k]).length} 種`}</div>
      <div class="btnrow" style="justify-content:flex-start"></div>`;
    const btns = right.querySelector('.btnrow');
    const mk = (label, fn) => { const b = el('button', null, label); b.addEventListener('click', () => { this.audio.se('se_click'); fn(); }); btns.appendChild(b); };
    mk('この続きを読む（バックログ）', () => { this.close(); this.open('log'); });
    mk('もう一度、この学期を', () => { this.close(); this.cinematicStart('prologue_001', 'prologue'); });
    mk('回収した地図を見る', () => { this.close(); this.open('gallery', 'end'); });
    mk('タイトルへ', () => { this.close(); this.game.toTitle(); });
    if (bonusReady) mk('★ BONUS EXTRA を読む', () => { this.close(); this.cinematicStart('end_bonus', 'end'); });
    sect.appendChild(left); sect.appendChild(right);
    body.appendChild(sect);
    if (cg) metaUnlockCg(this.store, cg.id);
    this.audio.se('se_bell');
  }
}

function metaUnlockCg(store, id) {
  if (!store.meta.cg.includes(id)) store.meta.cg.push(id);
  store.saveMeta();
}
