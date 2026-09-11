/* ============================================================================
   game.js ―― ノベルゲーム実行系（シーン進行・選択肢・Flag/心Point判定）
   命令は js/parser.js の出力。run() が1命令ずつ処理し、送付待ちで await する。
   ========================================================================== */
import { evalCond } from './parser.js';
import { Typer } from './text.js';
import { metaUnlock } from './store.js';
import { freshState as makeFresh, makeGetter, setVar as applySet, parseEffect, judge as judgeOf, resolveEnding } from './state.js';

const VISUAL_ONLY = new Set(['bg', 'cg', 'chr', 'bgm', 'se', 'fx', 'tone', 'veil', 'light', 'bars', 'lay', 'chapter', 'part']);

export class Game {
  /** @param {{dom,stage,audio,store,shell,data,def}} opt */
  constructor(opt) {
    Object.assign(this, opt);   // dom, stage, audio, store, shell, data, def(=meta.json)
    this.typer = new Typer(opt.dom.text);
    this.state = this.freshState();
    this._get = makeGetter(this.def, this.state, this.store.meta);
    this._res = null;
    this._mode = 'idle';        // idle|text|choice|hub|chat|card|end
    this.typing = false;
    this.auto = false;
    this.skip = false;
    this.history = [];
    this._autoTimer = 0;
    this._t0 = Date.now();
    this.playtime = 0;

    opt.dom.stage.addEventListener('click', () => this.onPointer());
    opt.dom.stage.addEventListener('contextmenu', (e) => { e.preventDefault(); this.shell.open('log'); });
    setInterval(() => { this.playtime = (Date.now() - this._t0) / 1000 + (this.store.meta.playtime || 0); }, 1000);
  }

  freshState() { return makeFresh(this.def); }

  /* ---------------------------------------------------------- 条件の変数 --- */
  getVar(name) { return this._get(name); }
  setVar(key, op, val) {
    applySet(this.def, this.state, key, op, val);
    this._get = makeGetter(this.def, this.state, this.store.meta);
    if (this.shell) this.shell.flashHeart();
  }
  applyEffect(str) {
    const e = parseEffect(str);
    if (!e) { console.warn('[effect] 解釈できない指定:', str); return; }
    switch (e.kind) {
      case 'var': return this.setVar(e.key, e.op, e.val);
      case 'item': return this.giveItem(e.id);
      case 'tip': return this.giveTip(e.id);
      case 'cnt': return this.bump(e.id);
      case 'bgm': return this.audio.bgm(e.id);
      case 'se': return this.audio.se(e.id);
      case 'fx': return this.stage.fx(e.id);
      case 'tone': return this.stage.setTone(e.id === 'off' ? '' : e.id);
      case 'chat': return this.openChat(e.id);
    }
  }

  /* ---------------------------------------------------------- 条件の変数 --- */
  giveItem(id) {
    if (this.state.items.includes(id)) return;
    this.state.items.push(id);
    this.audio.se('se_reveal');
    this.shell.flashItems();   // 所持品パネルの表示のみ（トーストは没入のため出さない）
  }
  giveTip(id) {
    if (this.state.tips.includes(id)) return;
    this.state.tips.push(id);
    metaUnlock(this.store, 'tip', id);   // 収集は静かに行う（トーストは出さない）
  }
  bump(key, n = 1) {
    this.state.counters[key] = (this.state.counters[key] || 0) + n;
    const m = this.store.meta;
    m.almanac[key] = (m.almanac[key] || 0) + n;
    this.store.saveMeta();
  }

  /* ------------------------------------------------------------ 保存/復元 -- */
  snapshot() {
    return {
      scene: this.state.scene, idx: this.state.idx,
      state: JSON.parse(JSON.stringify(this.state)),
      history: this.history.slice(-60),
      label: this.sceneLabel(),
      bg: this.dom.stage.dataset.bgid || '',
      playtime: Math.round(this.playtime),
    };
  }
  restore(snap) {
    this._t0 = Date.now() - (snap.playtime || 0) * 1000;
    this.state = Object.assign(this.freshState(), snap.state || {});
    this.state.scene = snap.scene;
    this.state.idx = snap.idx || 0;
    this.history = (snap.history || []).slice();
    this.stopFlow();
    this.shell.renderItems();
    this.shell.renderLog();
    this.shell.setScene(snap.scene);
    this.replayVisuals();
    this.shell.hideMenus();
    this.shell.toGame();
    this.run();
  }
  sceneLabel() {
    const sc = this.data.scenes[this.state.scene];
    return sc ? sc.label : (this.state.scene || 'タイトル');
  }

  /* ---------------------------------------------------------------- 進行 -- */
  start(sceneId) {
    const m = this.store.meta;
    const firstRun = !m.runs;
    m.runs = (m.runs || 0) + 1;
    this._t0 = Date.now();
    this.store.saveMeta();
    // 初回プレイ時のミニチュートリアル（邪魔にならないトーストで1回だけ）
    if (firstRun && sceneId === 'prologue_001') {
      setTimeout(()=> this.shell.toast('ヒント: Enter/クリックで送る / Qでメニュー / 右クリックでログ'), 1400);
      setTimeout(()=> this.shell.toast('F1:クイックセーブ / 設定はCキー / 所持品はIキー'), 4200);
    }
    this.state = this.freshState();
    this._get = makeGetter(this.def, this.state, this.store.meta);
    this.history = [];
    this.auto = false; this.skip = false;
    this.shell.renderItems();
    this.shell.renderLog();
    this.shell.toGame();
    this.goto(sceneId);
  }
  goto(sceneId) {
    if (!this.data.scenes[sceneId]) { console.error('[scene] 不明なシーンID:', sceneId); return; }
    this.state.scene = sceneId;
    this.state.idx = 0;
    this.shell.setScene(sceneId);
    // 既読マーク（スキップ判定用）
    try {
      const rs = this.store.meta.readScenes || [];
      if (!rs.includes(sceneId)) { rs.push(sceneId); if(rs.length>300) rs.shift(); this.store.saveMeta(); }
    } catch(_){}
    this.run();
  }
  stopFlow() {
    this._res = null;
    this._mode = 'idle';
    this._running = false;
    clearTimeout(this._autoTimer);
  }
  replayVisuals() {
    const sc = this.data.scenes[this.state.scene];
    if (!sc) return;
    const target = Math.max(0, this.state.idx - 1);
    for (let i = 0; i <= target && i < sc.body.length; i++) {
      const ins = sc.body[i];
      if (VISUAL_ONLY.has(ins.t) && (!ins.cond || evalCond(ins.cond, (n) => this.getVar(n)))) {
        this.exec(ins, { silent: true });
      }
    }
  }

  async run() {
    if (this._running) return;
    this._running = true;
    while (this._running) {
      const sc = this.data.scenes[this.state.scene];
      if (!sc) break;
      if (this.state.idx >= sc.body.length) {
        if (sc.next) {
          this.state.scene = sc.next; this.state.idx = 0; this.shell.setScene(sc.next);
          try { const rs=this.store.meta.readScenes||[]; if(!rs.includes(sc.next)){ rs.push(sc.next); if(rs.length>300) rs.shift(); this.store.saveMeta(); } } catch(_){}
          continue;
        }
        this.shell.toast('―― ここまでが実装範囲です（企画書 第10〜11章の全ルート・全EDを収録済み）');
        break;
      }
      const ins = sc.body[this.state.idx];
      this.state.idx++;
      if (ins.cond && !evalCond(ins.cond, (n) => this.getVar(n))) continue;
      const r = await this.exec(ins);
      if (r === 'stop') break;
    }
    this._running = false;
  }

  waitForClick(extra = 0) {
    return new Promise((resolve) => {
      let settled = false;
      const go = () => { if (settled) return; settled = true; clearTimeout(this._autoTimer); this._res = null;
        resolve(); };
      this._res = go;
      if (this.skip) { setTimeout(go, 42); return; }
      // AUTOは文字数に比例して余韻を残す（短文でも420msは保証、長文は 45ms/字）
      if (this.auto) {
        const base = extra || (this._lastTextLen ? Math.min(4200, Math.max(800, this._lastTextLen * 42 + 620)) : this.store.config.autoDelay);
        this._autoTimer = setTimeout(go, Math.max(420, base));
      }
      if (this.store.config.autosave && this._clickCount === undefined) this._clickCount = 0;
    });
  }

  async exec(ins, opt = {}) {
    const silent = !!opt.silent;
    switch (ins.t) {
      /* ---------------------------------------------------- 発話・地の文 -- */
      case 'text': {
        if (silent) return;
        const spRaw = ins.sp ? (this.def.speakers[ins.sp] || null) : null;
        const sp = spRaw || (ins.sp ? { name: ins.sp, color: '#cbb27c' } : {});
        const isNarration = !ins.sp || !sp.name;
        const d = this.dom;
        if (isNarration) {
          // 地の文（ナレーション）は名札を隠す — 誰の声でもないことを明確に
          d.namebox.dataset.narration = "1";
          d.namebox.classList.remove('on');
          d.nameText.innerHTML = ins.tag ? `<span class="kana">${esc(ins.tag)}</span>` : "";
          // 空のときは完全に非表示（opacity 0 のまま）にしておくが、tag があれば小さく見せる
          if (ins.tag) d.namebox.classList.add('on');
        } else {
          d.namebox.dataset.narration = "0";
          const displayName = sp.name || ins.sp;
          d.nameText.innerHTML = `${esc(displayName)}` + (ins.tag ? `<span class="kana">${esc(ins.tag)}</span>` : sp.kana ? `<span class="kana">${esc(sp.kana)}</span>` : '');
          const prevSp = d.stage.dataset.spk || '';
          const curSp = ins.sp;
          if (prevSp !== curSp) {
            d.namebox.classList.remove('on');
            void d.namebox.offsetWidth;
          }
          d.namebox.classList.add('on');
        }
        d.stage.dataset.spk = isNarration ? '__narration' : (ins.sp || '');
        const spColor = sp.color || '#cbb27c';
        if (d.stage.dataset.spc !== spColor) {
          // 話者色は変わったときだけ反映（毎行のスタイル再計算を避ける）
          d.stage.dataset.spc = spColor;
          d.stage.style.setProperty('--sp', spColor);
          // textwrap は stage の兄弟要素のため --sp が継承されない → ネームプレート用にこちらへも反映
          d.textwrap.style.setProperty('--sp', spColor);
        }
        d.text.classList.toggle('board', !!sp.board);
        d.textwrap.classList.remove('hidden');
        if (ins.sp) {
          const slug = sp.sprite;
          if (slug) this.stage.applyChr(slug);
        } else this.stage.applyChr(null);
        this.history.push({ sp: ins.sp, tag: ins.tag, txt: ins.txt, scene: this.state.scene });
        // バックログの保持は上限付き（重さ・メモリ対策。表示は最新100行のみ）
        if (this.history.length > 300) this.history.splice(0, this.history.length - 300);
        this.countLine(ins);
        this.shell.renderLog();
        this.typing = true;
        this._mode = 'text';
        this.typer.speed = this.skip ? 99 : this.store.config.textSpeed;
        // se_page（横からシュッという吹き出し音）は要望により撤廃。無音で即時表示
        
        await new Promise(r => {
          this.typer.render(ins.txt, { instant: this.skip, onDone: () => { this.typing = false; r(); } });
        });
        if (sp.voice) this.audio.duck(600);
        this.shell.setPage(ins.txt);
        this._lastTextLen = ins.txt.length;
        // 長文は 1300ms 相当の余韻を、それ以外は文字数比例の autoDelay を使う
        await this.waitForClick(ins.txt.length > 52 ? Math.min(2600, 900 + ins.txt.length * 18) : undefined);
        if (this.store.config.autosave && this.state.idx % 3 === 0) this.store.saveAuto(this.snapshot());
        return;
      }
      /* --------------------------------------------------------- 表示系 -- */
      case 'bg': {
        const a = this.data.assets.byId[ins.id];
        this.stage.bg(ins.id);
        const time = a && a.meta ? (a.meta.split('/')[1] || guessTime(ins.id)) : guessTime(ins.id || '');
        this.stage.mood(time);
        this.dom.stage.dataset.bgid = ins.id || '';
        this.dom.stage.dataset.time = time;
        return;
      }
      case 'cg':
        this.stage.cg(ins.id, { kb: ins.kb });
        if (ins.id) {
          // CGを見せている間はテキストウィンドウを引っ込める（次の text で自動復帰）。
          // 隠さないと「CGが出たのに吹き出しに隠れて見えない」状態になるため設定に関係なく隠す
          this.dom.textwrap.classList.add('hidden');
          if (!silent) {
            if (metaUnlock(this.store, 'cg', ins.id)) this.shell.cgNote(ins.id);
            this.audio.se('se_reveal');
          }
        } else this.dom.textwrap.classList.remove('hidden');
        return;
      case 'chr': {
        // 既に同じ表情が出ているものはインパクトを出さない
        const prevExpr = {};
        Object.keys(ins.set || {}).forEach(slug=>{
          const rec = this.stage.chrMap.get(slug);
          if(rec) prevExpr[slug]=rec.expr;
        });
        this.stage.setChr(ins);
        Object.entries(ins.set || {}).forEach(([slug, expr]) => {
          const m = this.store.meta;
          m.chr[slug] = m.chr[slug] || [];
          if (!m.chr[slug].includes(expr)) { m.chr[slug].push(expr); this.store.saveMeta(); }
          // インパクト演出：ツッコミ/驚き/決意などは画面揺れ＋SE＋立ち絵ダッシュ
          if(prevExpr[slug] === expr) return;
          try{
            const a = this.stage.assets.chrFor(slug, expr);
            const label = a ? (a.label||'') : '';
            let kind = null;
            if(/ツッコミ|は？/.test(label)) kind='tsukkomi';
            else if(/驚き|驚/.test(label)) kind='shock';
            else if(/決意|全力|真剣/.test(label)) kind='impact';
            // 三重の「は？」は特にツッコミとして強調
            if(slug==='mie' && expr==='02') kind='tsukkomi';
            if(slug==='mitsumine' && (expr==='02'||expr==='06')) kind='tsukkomi';
            if(kind){
              setTimeout(()=>{
                try{ this.stage.impact(slug, kind); }catch(_){}
                const se = kind==='tsukkomi' ? 'se_thud' : kind==='shock' ? 'se_shutter' : 'se_reveal';
                try{ this.audio.se(se); }catch(_){}
              }, 86);
            }
          }catch(_){}
        });
        return;
      }
      case 'bgm':
        this.audio.bgm(ins.id, ins.fade);
        if (ins.id && !silent) metaUnlock(this.store, 'music', ins.id);
        return;
      case 'se': if (!silent) this.audio.se(ins.id); return;
      case 'fx': this.stage.fx(ins.name); return;
      case 'tone': this.stage.setTone(ins.mode); this.state.tone = ins.mode || ''; return;
      case 'veil': this.stage.setVeil(ins.mode); return;
      case 'light': this.stage.setLight(ins.mode); return;
      case 'bars': this.stage.setBars(ins.mode === 'on'); return;
      case 'part': this.stage.setParticles(ins.mode); return;
      case 'lay': {
        const st = this.dom.stage;
        if (!ins.cls) st.className = [...st.classList].filter(c => !c.startsWith('lay-')).join(' ');
        else String(ins.cls).split(/[ ,]+/).forEach(c => c && st.classList.add('lay-' + c));
        return;
      }
      case 'chapter': {
        this.state.chapter = ins.id;
        this.shell.setHud(this.data.chapters[ins.id], ins.id);
        return;
      }
      case 'card': {
        if (silent) return;
        this._mode = 'card';
        const d = this.dom;
        d.cardNo.textContent = ins.no || '';
        d.cardTitle.textContent = ins.title || '';
        d.cardSub.textContent = ins.sub || '';
        d.textwrap.classList.add('hidden');   // カードを見せている間は窓を引っ込める
        d.cardOverlay.classList.add('on');
        await this.waitForClick(ins.hold);
        d.cardOverlay.classList.remove('on');
        d.textwrap.classList.remove('hidden');
        this._mode = 'flow';
        return;
      }
      case 'caption': {
        if (silent) return;
        this.dom.textwrap.classList.add('hidden');   // キャプション演出中も窓を引っ込める
        await this.stage.caption({ on: true, text: ins.text, hand: ins.hand, hold: this.skip ? 500 : ins.hold });
        this.stage.caption({ on: false });
        this.dom.textwrap.classList.remove('hidden');
        return;
      }
      case 'tip': if (!silent) this.giveTip(ins.id); return;
      case 'item': if (!silent) this.giveItem(ins.id); return;
      case 'cnt': if (!silent) this.bump(ins.id); return;
      case 'set': if (!silent) this.setVar(ins.key, ins.op, ins.val); return;
      case 'jump': {
        if (!this.data.scenes[ins.target]) { console.error('[jump] 不明なシーンID:', ins.target); return; }
        this.state.scene = ins.target;
        this.state.idx = 0;
        this.shell.setScene(ins.target);
        return;
      }
      case 'choice': if (silent) return; return this.showChoices(ins);
      case 'chat': if (silent) return; return this.openChat(ins.id);
      case 'hub': if (silent) return; return this.showHub();
      case 'routeDone':
        if (!silent) {
          this.state.routes[ins.id] = true;
          const m = this.store.meta; m.routes[ins.id] = (m.routes[ins.id] || 0) + 1; this.store.saveMeta();
        }
        return;
      case 'savepoint':
        if (!silent && this.store.config.autosave) this.store.saveAuto(this.snapshot());   // 静かに保存（トーストなし）
        return;
      case 'wait': {
        if (!silent && ins.ms && ins.ms > 800) {
          // 長い待機は画面が深呼吸するように — わずかに暗転→復帰
          this.dom.stage.style.transition = 'filter .9s var(--ease-soft)';
          this.dom.stage.style.filter = 'brightness(.98) saturate(1.02)';
          await sleep(this.skip ? 90 : (ins.ms || 600));
          this.dom.stage.style.filter = '';
          setTimeout(()=> this.dom.stage.style.transition='', 1000);
        } else {
          await sleep(this.skip ? 90 : (ins.ms || 600));
        }
        return;
      }
      case 'end': if (silent) return; return this.finish(ins);
      case 'title': if (silent) return; this.toTitle(); return 'stop';
      case 'stop': return 'stop';
      default:
        if (!silent) console.warn('[exec] 未対応の命令:', ins.t);
        return;
    }
  }

  /** 倉石年鑑用の自動カウント（原作準拠：数えてる） */
  countLine(ins) {
    const k = ins.sp, t = ins.txt || '';
    if (k === '三重' && /は？/.test(t)) this.bump('mie_ha');
    if (k === '砂糖' && /うるさい/.test(t)) this.bump('satou_urusai');
    if (k === '零' && /面白い/.test(t)) this.bump('rei_omoshiro');
    if (k === '両馬' && /✝/.test(t)) this.bump('ryoma_honshitsu');
    if (k === '倉石' && /記録|数えて/.test(t)) this.bump('kuraishi_kiroku');
    if (k === '伊豆見' && /変な感じ/.test(t)) this.bump('izumi_hen');
    if (k === '召野' && /[A-Za-z]{4,}/.test(t)) this.bump('meshino_eigo');
    if (k === '内藤' && /少し笑/.test(t)) this.bump('naitou_sukoshi');
    if (k === '寺地' && /固ま|フリーズ/.test(t)) this.bump('terachi_freeze');
    if (!k && /窓の外/.test(t)) this.bump('katsuya_gobyou');
  }

  advance() {
    if (this._mode === 'text' && !this.typer.complete) { this.typer.finish(); this.audio.duck(420); return; }
    if (this._res) this._res();
  }
  onPointer() {
    if (['choice', 'hub', 'chat', 'end'].includes(this._mode)) return;
    this.advance();
  }
  toggleSkip() {
    this.skip = !this.skip;
    this.shell.syncModeButtons();
    if (this.skip) {
      // 未読スキップを許可しない設定なら、未読シーンでは低速スキップに留める
      const isUnread = this.store.meta.readScenes && !this.store.meta.readScenes.includes(this.state.scene);
      if (isUnread && !this.store.config.skipUnread) {
        this.skip = false;
        this.shell.syncModeButtons();
        this.shell.toast('未読区間です — 設定で「未読スキップ」をONにすると飛ばせます');
        return;
      }
      this.advance();
    }
  }
  toggleAuto() {
    this.auto = !this.auto;
    this.shell.syncModeButtons();
    if (this.auto) this.advance();
  }

  showChoices(ins) {
    this._mode = 'choice';
    const opts = ins.opts
      .map(o => ({ o, ok: !o.cond || evalCond(o.cond, (n) => this.getVar(n)) }))
      .filter(x => x.ok).map(x => x.o);
    return new Promise(resolve => {
      this.shell.showChoices(ins.prompt, opts, (n) => {
        const o = opts[n];
        if (o.pick) this.state.picks[o.pick] = (this.state.picks[o.pick] || 0) + 1;
        (o.eff || []).forEach(e => this.applyEffect(e));
        this.shell.hideChoices();
        this._mode = 'flow';
        if (o.go && this.data.scenes[o.go]) {
          this.state.scene = o.go; this.state.idx = 0; this.shell.setScene(o.go);
        }
        resolve();
      });
    });
  }
  openChat(id) {
    const chat = this.data.chats[id];
    if (!chat) { console.warn('[chat] 不明なID:', id); return; }
    metaUnlock(this.store, 'chat', id);
    this._mode = 'chat';
    // チャット画面（screen-wrap）の下にテキストウィンドウが透けないように引っ込める
    this.dom.textwrap.classList.add('hidden');
    return new Promise(res => this.shell.openChat(chat, () => {
      this._mode = 'flow';
      this.dom.textwrap.classList.remove('hidden');
      res();
    }));
  }
  showHub() {
    this._mode = 'hub';
    this.dom.textwrap.classList.add('hidden');
    return new Promise(res => this.shell.openHub((sceneId) => {
      this._mode = 'flow';
      this.dom.textwrap.classList.remove('hidden');
      if (sceneId) { this.state.scene = sceneId; this.state.idx = 0; this.shell.setScene(sceneId); }
      res();
    }));
  }

  /* --------------------------------------------------------------- 結末 --- */
  judge() { return judgeOf(this.def, this.state, this.store.meta); }
  finish(ins) {
    this.stopFlow();
    const j = resolveEnding(this.def, this.state, this.store.meta, ins.id);
    const id = j.id;
    const m = this.store.meta;
    m.endings[id] = Object.assign({}, m.endings[id], {
      at: Date.now(), heart: j.heart, flags: { ...this.state.flags },
      routes: Object.keys(this.state.routes).length,
      playtime: Math.round(this.playtime),
    });
    m.playtime = Math.round(this.playtime) + (m.playtime || 0);
    if (id === 'true' || id === 'bonus') m.cleared = true;
    this.store.saveMeta();
    this.audio.bgm(null, 2.6);
    this._mode = 'end';
    this.shell.showEnding(id, ins.title, j);
    return 'stop';
  }
  toTitle() {
    this.stopFlow();
    this.stage.cg(null);
    this.stage.setChr({ clear: true });
    this.stage.setTone('');
    this.stage.setVeil('');
    this.stage.setParticles(null);
    this.dom.textwrap.classList.add('hidden');
    this.shell.toTitle();
  }
  jumpToTitleMenu() { this.toTitle(); }
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));
function esc(s) { return String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c])); }
function guessTime(id) {
  if (/asa$|_asa/.test(id)) return 'asa';
  if (/yuugata|yuu/.test(id)) return 'yuugata';
  if (/yoru/.test(id)) return 'yoru';
  if (/kaisou|gensho|butsudan|hokank|shoko/.test(id)) return 'gensou';
  if (/sotsugyou|haru|mankai|namiki|suunengo/.test(id)) return 'sotsu';
  return 'hiru';
}
