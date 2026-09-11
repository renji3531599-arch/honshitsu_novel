/* ============================================================================
   store.js ―― セーブデータ / 周回横断メタ / 設定 の永続化
   （実データはブラウザの localStorage。ファイル出力にも対応）
   ========================================================================== */

const LS = (() => { try { const k = '__t'; localStorage.setItem(k, '1'); localStorage.removeItem(k); return localStorage; } catch (e) { return null; } })();
const mem = {};
const get = (k) => { try { return LS ? localStorage.getItem(k) : (mem[k] ?? null); } catch (e) { return mem[k] ?? null; } };
const set = (k, v) => { try { LS ? localStorage.setItem(k, v) : (mem[k] = v); } catch (e) { mem[k] = v; } };
const del = (k) => { try { LS ? localStorage.removeItem(k) : delete mem[k]; } catch (e) { } };

export const SLOTS = 12;
const P_SAVE = 'honshitsu.save.';
const K_META = 'honshitsu.meta.v2';
const K_META_OLD = 'honshitsu.meta.v1';
const K_CONF = 'honshitsu.config.v1';

export const DEFAULT_CONFIG = {
  textSpeed: 1.1,       // 0.25〜4
  autoDelay: 1500,      // 文读完待機 ms
  advanceClick: true,   // 画面クリックで送る
  blend: 'multiply',    // スプライト合成モード（白背景素材前提）
  cgMode: 'window',     // window / full
  showSpriteTag: false, // 立ち絵スロット名の表示（開発用）
  bgmVol: .45,
  seVol: .7,
  master: .85,
  audio: true,
  grain: true,
  vignette: true,
  shake: true,
  autosave: true,
  skipUnread: false,   // 未読スキップを許可するか
  lang: 'ja',
};

export const DEFAULT_META = () => ({
  runs: 0,
  playtime: 0,
  endings: {},        // id -> { at, heart, flags }
  cg: [],             // 回収済みCG id
  chr: {},            // slug -> [expr...]
  tips: [],
  almanac: {},        // key -> 累計
  chats: [],
  routes: {},         // key -> 累計到達回数
  music: [],          // 聞いたBGM
  readScenes: [],       // 既読シーンID（スキップ判定用）
  cleared: false,
});

export class Store {
  constructor() {
    const rawConf = JSON.parse(get(K_CONF) || '{}');
    this.config = Object.assign({}, DEFAULT_CONFIG, rawConf);
    // 軽量マイグレーション: 不明キーの除去と型補正
    if (typeof this.config.textSpeed !== 'number') this.config.textSpeed = DEFAULT_CONFIG.textSpeed;
    let rawMetaStr = get(K_META);
    if (!rawMetaStr) rawMetaStr = get(K_META_OLD);
    const rawMeta = JSON.parse(rawMetaStr || '{}');
    const base = DEFAULT_META();
    this.meta = Object.assign(base, rawMeta);
    // 旧 meta の互換: endings が配列だった頃の救済
    if (Array.isArray(this.meta.endings)) {
      const m = {}; this.meta.endings.forEach(k=> m[k]= {at:Date.now()}); this.meta.endings = m;
    }
    // 新規キーの初期化
    if (!Array.isArray(this.meta.cg)) this.meta.cg = [];
    if (!this.meta.chr || typeof this.meta.chr !== 'object') this.meta.chr = {};
    if (!Array.isArray(this.meta.tips)) this.meta.tips = [];
    if (!this.meta.almanac || typeof this.meta.almanac !== 'object') this.meta.almanac = {};
    if (!Array.isArray(this.meta.chats)) this.meta.chats = [];
    if (!this.meta.routes || typeof this.meta.routes !== 'object') this.meta.routes = {};
    if (!Array.isArray(this.meta.music)) this.meta.music = [];
    if (!Array.isArray(this.meta.readScenes)) this.meta.readScenes = [];
  }
  saveConfig() { set(K_CONF, JSON.stringify(this.config)); }
  saveMeta() { set(K_META, JSON.stringify(this.meta)); try { del(K_META_OLD); } catch(_){} }
  resetMeta() { this.meta = DEFAULT_META(); del(K_META); }

  save(slot, data) {
    data.savedAt = Date.now();
    data._v = 2;
    try {
      set(P_SAVE + slot, JSON.stringify(data));
    } catch (e) {
      const isQuota = e && (e.name === 'QuotaExceededError' || /quota|storage/i.test(e.message||''));
      if (isQuota) {
        // クォータ超過時は古いスロットを1つ空ける提案 — 呼び出し側で toast できるよう例外を投げる
        const err = new Error('QUOTA_EXCEEDED');
        err.cause = e;
        throw err;
      }
      throw e;
    }
    return data;
  }
  load(slot) {
    const raw = get(P_SAVE + slot);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch (e) { return null; }
  }
  remove(slot) { del(P_SAVE + slot); }
  list() {
    return Array.from({ length: SLOTS }, (_, i) => {
      const d = this.load(i);
      return d ? { slot: i, ...d } : { slot: i, empty: true };
    });
  }
  hasSave() { return this.list().some(s => !s.empty) || !!this.load('auto'); }
  saveAuto(data) {
    const payload = JSON.stringify(Object.assign({ savedAt: Date.now(), _v: 2 }, data));
    try { set(P_SAVE + 'auto', payload); }
    catch (e) {
      // オートセーブは失敗してもゲームを止めない — 古いautoを消して再試行
      try { del(P_SAVE + 'auto'); set(P_SAVE + 'auto', payload); } catch (_) {}
    }
  }
  loadAuto() { try { return JSON.parse(get(P_SAVE + 'auto') || 'null'); } catch (e) { return null; } }
  quick(slot, data) { set(P_SAVE + 'q' + slot, JSON.stringify(Object.assign({ savedAt: Date.now() }, data))); }
  quickLoad(slot) { try { return JSON.parse(get(P_SAVE + 'q' + slot) || 'null'); } catch (e) { return null; } }
}

/** ギャラリー／回収の状態更新ヘルパ */
export function metaUnlock(store, kind, id) {
  const m = store.meta;
  if (kind === 'cg') { if (!m.cg.includes(id)) { m.cg.push(id); store.saveMeta(); return true; } }
  else if (kind === 'tip') { if (!m.tips.includes(id)) { m.tips.push(id); store.saveMeta(); return true; } }
  else if (kind === 'music') { if (!m.music.includes(id)) { m.music.push(id); store.saveMeta(); return true; } }
  else if (kind === 'chat') { if (!m.chats.includes(id)) { m.chats.push(id); store.saveMeta(); return true; } }
  return false;
}

export function fmtTime(ms) {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60);
  return (h ? h + '時間' : '') + String(m).padStart(2, '0') + '分' + String(s % 60).padStart(2, '0') + '秒';
}
export function fmtDate(t) {
  if (!t) return '';
  const d = new Date(t);
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}
