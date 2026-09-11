/* ============================================================================
   state.js ―― 心Point・Flag・ルート到達の純ロジック（DOM非依存）
   実行系(js/game.js)と検証ツール(tools/vncheck.mjs)が同じ実装を使う。
   ========================================================================== */

export function freshState(def) {
  const flags = {};
  (def.flags || []).forEach(f => { flags[f.key] = 0; });
  flags.tease = 0;
  return {
    scene: null, idx: 0, heart: 0, flags,
    routes: {}, items: [], tips: [], counters: {}, picks: {},
    chapter: null, started: Date.now(),
  };
}

/** 条件式用の変数解決関数を作る */
export function makeGetter(def, state, persistent = {}) {
  return function getVar(name) {
    name = String(name == null ? '' : name).trim();
    if (name === 'heart') return state.heart;
    if (name === 'routes_done') return Object.values(state.routes).filter(Boolean).length;
    if (name === 'all_routes') return (def.routes || []).length;
    if (name === 'flagcount') return majorKeys(def).filter(k => (state.flags[k] || 0) >= 2).length;
    if (name === 'flagmax') return Math.max(0, ...Object.values(state.flags).filter(v => typeof v === 'number'));
    if (name === 'bestflag') {
      let best = 'none', v = 0;
      for (const k of allFlagKeys(def)) {
        if ((state.flags[k] || 0) > v) { v = state.flags[k]; best = k.replace(/^flag_/, ''); }
      }
      return v > 0 ? best : 'none';
    }
    if (name === 'endings_count') return Object.keys(persistent.endings || {}).length;
    if (name === 'cg_count') return (persistent.cg || []).length;
    if (name === 'runs') return persistent.runs || 0;
    if (name === 'chapter') return state.chapter || '';
    if (name.startsWith('ended_')) return (persistent.endings || {})[name.slice(6)] ? 1 : 0;
    if (name.startsWith('pick_')) return state.picks[name.slice(5)] || 0;
    if (name.startsWith('item_')) return state.items.includes(name.slice(5)) ? 1 : 0;
    if (name.startsWith('tip_')) return state.tips.includes(name.slice(4)) ? 1 : 0;
    if (name.startsWith('cnt_')) return state.counters[name.slice(4)] || 0;
    if (name.startsWith('route_')) return state.routes[name.slice(6)] ? 1 : 0;
    if (name.startsWith('flag_')) return state.flags[name] || 0;
    if (name in state.counters) return state.counters[name];
    if (name in state.flags) return state.flags[name];
    if (name in state) return state[name];
    return undefined;   // 既知の変数名以外（bestflag==mie の mie など）は文字列扱いで評価される
  };
}

/** 企画書 7.1 の「主要Flag8種」（倉石側のみ派生フラグなので数えない） */
function allFlagKeys(def) { return (def.flags || []).map(f => f.key); }
function majorKeys(def) { return allFlagKeys(def).filter(k => k !== 'flag_kuraishi'); }

export function setVar(def, state, key, op, val) {
  const get = makeGetter(def, state);
  const cur = Number(get(key)) || 0;
  const n = Number(val);
  const v = isNaN(n) ? 0 : n;
  const next = op === '+' ? cur + v : op === '-' ? cur - v : v;
  if (key === 'heart') state.heart = Math.max(-10, Math.min(34, next));
  else state.flags[key] = Math.max(0, next);
  return state;
}

/** 選択肢の効き目（"heart+2" "flag_satou=2" "item=x" "cnt=y" ...）を1本適用 */
export function parseEffect(str) {
  const s = String(str).trim();
  let m = s.match(/^(heart|flag_[\w-]+|tease)\s*([+-])\s*(\d+)$/);
  if (m) return { kind: 'var', key: m[1], op: m[2], val: m[3] };
  m = s.match(/^(heart|flag_[\w-]+|tease)\s*=\s*([+-]?\d+)$/);
  if (m) return { kind: 'var', key: m[1], op: '=', val: m[2] };
  m = s.match(/^(item|tip|cnt|bgm|se|fx|tone|chat)\s*=\s*(\S+)$/);
  if (m) return { kind: m[1], id: m[2] };
  return null;
}

/** 企画書 7.1／7.3 に基づくエンディング判定 */
/**
 * エンディング判定 — 企画書 §7.1〜7.4 準拠
 * BONUS EXTRA (id='bonus') は本関数では返さない。BONUSは shell 側で
 * persistent.endings の回収数 (>=13) を見てタイトルに生やす/遷移で指定する
 * ための“メタ解禁”であり、周回内の heart/flag だけで決まる振り分けではない。
 * そのため judge() は 5分岐 (comedy/true/good/normal/bittersweet) のみを返す。
 */
export function judge(def, state, persistent) {
  const get = makeGetter(def, state, persistent);
  const heart = state.heart;
  const flagcount = get('flagcount');
  const flagmax = get('flagmax');
  const best = get('bestflag');
  const tease = state.flags.tease || 0;
  let id;
  if (tease >= 3 && (state.flags.flag_ryoma || 0) >= 4 && heart >= 12 && heart <= 17) id = 'comedy';
  else if (heart >= 24 && flagcount >= 6) id = 'true';
  else if (heart >= 18 && flagmax >= 4 && best !== 'none') id = 'good_' + best;
  else if (heart >= 12) id = 'normal';
  else id = 'bittersweet';
  if (!(def.endings || {})[id]) id = heart >= 12 ? 'normal' : 'bittersweet';
  return { id, heart, flagcount, flagmax, best, tease };
}

/** @end 指定がある場合はそれを優先しつつ、未知IDは正規化 */
export function resolveEnding(def, state, persistent, explicit) {
  const j = judge(def, state, persistent);
  const id = explicit && (def.endings || {})[explicit] ? explicit : j.id;
  return { ...j, id };
}
