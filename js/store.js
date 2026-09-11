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
const K_META = 'honshitsu.meta.v1';
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
  cleared: false,
});

export class Store {
  constructor() {
    this.config = Object.assign({}, DEFAULT_CONFIG, JSON.parse(get(K_CONF) || '{}'));
    this.meta = Object.assign(DEFAULT_META(), JSON.parse(get(K_META) || '{}'));
  }
  saveConfig() { set(K_CONF, JSON.stringify(this.config)); }
  saveMeta() { set(K_META, JSON.stringify(this.meta)); }
  resetMeta() { this.meta = DEFAULT_META(); del(K_META); }

  save(slot, data) {
    data.savedAt = Date.now();
    set(P_SAVE + slot, JSON.stringify(data));
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
  saveAuto(data) { set(P_SAVE + 'auto', JSON.stringify(Object.assign({ savedAt: Date.now() }, data))); }
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
