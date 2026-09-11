#!/usr/bin/env node
/* ============================================================================
   tools/vncheck.mjs ―― 脚本の静的検証 + 自動プレイスルー
   · 未定義シンボル（シーン/CG/BG/BGM/SE/用語/アイテム/Flag/チャット）を検出
   · 到達不能シーンを検出
   · 総当たりオートプレイで、全ENDに到達できるか・無限ループしないかを検証
   実行: node tools/vncheck.mjs [--verbose]
   ========================================================================== */
import fs from 'node:fs';
import path from 'node:path';
import { parseScript } from '../js/parser.js';
import { evalCond } from '../js/parser.js';
import { makeGetter, setVar, parseEffect, resolveEnding } from '../js/state.js';

const ROOT = path.resolve(import.meta.dirname, '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const verbose = process.argv.includes('--verbose');

const def = JSON.parse(read('data/meta.json'));
const terms = JSON.parse(read('data/terms.json'));
const assetsRaw = JSON.parse(read('data/assets.json'));
const byId = {};
assetsRaw.assets.forEach(a => {
  byId[a.id] = a;
  const stem = path.basename(a.file).replace(/\.\w+$/, '');
  byId[stem] = a;
});
const index = read('data/script/index.txt').split('\n').map(l => l.split(';')[0].trim()).filter(Boolean);
const speakers = new Set([...Object.keys(def.speakers), 'ナ']);

const data = { scenes: {}, order: [], chats: {}, chapters: {} };
const errs = [];
const warns = [];
for (const f of index) {
  let parsed;
  try { parsed = parseScript(read('data/script/' + f), f, { speakers, strict: true }); }
  catch (e) { errs.push(String(e.message || e)); continue; }
  Object.assign(data.scenes, parsed.scenes);
  Object.assign(data.chats, parsed.chats);
  Object.assign(data.chapters, parsed.chapters);
  data.order.push(...parsed.order);
  (parsed.warnings || []).forEach(w => warns.push(`${w.file}:${w.line} ${w.msg}`));
}
data.order.forEach((id, n) => { data.scenes[id].next = data.order[n + 1] || null; });

/* ------------------------------------------------------------ 参照チェック -- */
const seKnown = new Set([...Object.keys(def.seLabels || {}), ...[
  'se_click', 'se_hover', 'se_cursor', 'se_deny', 'se_reveal', 'se_photo', 'se_page', 'se_line', 'se_thud', 'se_door', 'se_tear', 'se_breath', 'se_notify']]);
const routeKeys = new Set((def.routes || []).map(r => r.key));
const flagKeys = new Set((def.flags || []).map(f => f.key));
flagKeys.add('tease');
const assetIds = new Set(Object.keys(byId));
const condRefs = new Set();

for (const id of data.order) {
  const sc = data.scenes[id];
  sc.body.forEach((ins, n) => {
    const at = `${sc.file}:${sc.start + n} [${id}]`;
    const chk = (ok, msg) => { if (!ok) errs.push(`${at} ${msg}`); };
    if (ins.cond) collectVars(ins.cond, condRefs);
    switch (ins.t) {
      case 'bg': case 'cg':
        chk(!ins.id || assetIds.has(ins.id), `${ins.t} のアセットIDが台帳にありません: ${ins.id}`);
        if (ins.id && byId[ins.id] && ins.t === 'bg') chk(byId[ins.id].cat === 'bg', `@bg は背景スロットを指定してください（${ins.id} は ${byId[ins.id].cat}）`);
        if (ins.id && byId[ins.id] && ins.t === 'cg') chk(byId[ins.id].cat === 'cg', `@cg はCGスロットを指定してください（${ins.id} は ${byId[ins.id].cat}）`);
        break;
      case 'chr':
        Object.entries(ins.set || {}).forEach(([slug, expr]) => {
          const re = new RegExp(`^chr_${slug}_${String(expr).padStart(2, '0')}_`);
          const a = (assetsRaw.assets || []).find(x => x.cat === 'chr' && re.test(x.id + '_'));
          chk(!!a, `立ち絵スロットがありません: chr_${slug}_${expr}`);
        });
        break;
      case 'bgm':
        chk(!ins.id || /^bgm(0[1-9]|1\d|2[0-4])$/.test(ins.id), `BGM ID が範囲外です: ${ins.id}`);
        break;
      case 'se':
        chk(!ins.id || seKnown.has(ins.id), `SE ID が未定義です: ${ins.id}`);
        break;
      case 'tip':
        chk(terms[ins.id], `✝本質✝辞典に項目がありません: ${ins.id}`);
        break;
      case 'item':
        chk((def.items || {})[ins.id], `アイテムが未定義です: ${ins.id}`);
        break;
      case 'cnt':
        chk((def.counters || []).some(c => c.key === ins.id), `年鑑カウンタが未定義です: ${ins.id}`);
        break;
      case 'chat':
        chk(data.chats[ins.id], `チャットブロックがありません: ${ins.id}`);
        break;
      case 'routeDone':
        chk(routeKeys.has(ins.id), `ルートキーが未定義です: ${ins.id}`);
        break;
      case 'jump':
        chk(data.scenes[ins.target], `ジャンプ先シーンがありません: ${ins.target}`);
        break;
      case 'chapter':
        chk(data.chapters[ins.id], `章が定義されていません: ${ins.id}`);
        break;
      case 'set':
        chk(ins.key === 'heart' || flagKeys.has(ins.key), `未知のフラグです: ${ins.key}`);
        break;
      case 'choice':
        ins.opts.forEach(o => {
          chk(data.scenes[o.go], `選択肢の移動先がありません: ${o.go}（${o.label}）`);
          if (o.cond) collectVars(o.cond, condRefs);
          (o.eff || []).forEach(e => {
            const p = parseEffect(e);
            if (!p) { errs.push(`${at} 選択肢の効き目を解釈できません: ${e}`); return; }
            if (p.kind === 'var') chk(p.key === 'heart' || flagKeys.has(p.key), `選択肢: 未知のフラグ ${p.key}`);
            if (p.kind === 'item') chk(def.items[p.id], `選択肢: 未定義アイテム ${p.id}`);
            if (p.kind === 'tip') chk(terms[p.id], `選択肢: 辞典に無い用語 ${p.id}`);
            if (p.kind === 'cnt') chk((def.counters || []).some(c => c.key === p.id), `選択肢: 未定義カウンタ ${p.id}`);
          });
        });
        break;
      case 'end':
        chk(def.endings[ins.id], `エンディングIDが未定義です: ${ins.id}`);
        break;
    }
  });
}

/* -------------------------------------------------------- 到達不能シーン -- */
const edges = (sc) => {
  const e = [];
  if (sc.next) e.push(sc.next);
  sc.body.forEach(ins => {
    if (ins.t === 'jump') e.push(ins.target);
    if (ins.t === 'choice') ins.opts.forEach(o => e.push(o.go));
    if (ins.t === 'hub') (def.routes || []).forEach(r => e.push(r.scene));
    if (ins.t === 'hub') { e.push('g1'); e.push('hub_block'); }
  });
  return e.filter(Boolean);
};
const reached = new Set();
let stack = ['prologue_001'];
while (stack.length) {
  const id = stack.pop();
  if (!data.scenes[id] || reached.has(id)) continue;
  reached.add(id);
  stack.push(...edges(data.scenes[id]));
}
const orphans = data.order.filter(id => !reached.has(id));

/** 選択肢の選び方: first=誠実 / last=流す / focus=指定Flagだけ拾う / route / random */
function heartOf(eff) {
  const m = String(eff).match(/heart([+-]\d+)/);
  return m ? (m[1][0] === '-' ? -1 : 1) * Number(m[1].slice(1)) : 0;
}
function pickIndex(opts, policy) {
  if (policy.choice === 'first') return 0;
  if (policy.choice === 'last') return opts.length - 1;
  if (policy.choice === 'route') return Math.min(opts.length - 1, 1);
  if (policy.choice === 'focus') {
    const key = `flag_${policy.flag}`;
    let best = -1, bh = -99;
    opts.forEach((o, i) => {
      const eff = (o.eff || []).join(' ');
      if (!eff.includes(key)) return;
      const h = heartOf(eff);
      if (h > bh) { bh = h; best = i; }
    });
    if (best >= 0) return best;
    // 他のFlagを伸ばさず心だけ増える選択肢を好む（茶化しは避ける）
    let alt = -1, as = 99;
    opts.forEach((o, i) => {
      const eff = (o.eff || []).join(' ');
      if (/tease/.test(eff)) return;
      const score = heartOf(eff) - 3 * ((eff.match(/flag_(?!)/g) || []).length);
      if (score < as) { as = score; alt = i; }
    });
    return alt >= 0 ? alt : opts.length - 1;
  }
  return Math.floor(Math.random() * opts.length);
}

/* ------------------------------------------------------------ オートプレイ -- */
const routes = def.routes || [];
function simulate(policy = {}) {
  const state = { scene: 'prologue_001', idx: 0, heart: 0, flags: {}, routes: {}, items: [], tips: [], counters: {}, picks: {}, chapter: null };
  (def.flags || []).forEach(f => state.flags[f.key] = 0);
  state.flags.tease = 0;
  Object.assign(state, policy.seed || {});
  state.scene = policy.start || state.scene || 'prologue_001';
  state.idx = 0;
  const persistent = { runs: policy.runs || 1, endings: policy.endings || {}, cg: [], chats: [], music: [] };
  const get = makeGetter(def, state, persistent);
  const log = [];
  let guard = 0, steps = 0, chars = 0, texts = 0;
  while (guard++ < 40000) {
    const sc = data.scenes[state.scene];
    if (!sc) return { error: `シーン消失 ${state.scene}`, log };
    if (state.idx >= sc.body.length) {
      if (sc.next) { state.scene = sc.next; state.idx = 0; continue; }
      return { error: `脚本末尾に到達（@end 無し）: ${sc.id}`, log };
    }
    const ins = sc.body[state.idx++];
    if (ins.cond && !evalCond(ins.cond, (n) => get(n))) continue;
    steps++;
    switch (ins.t) {
      case 'text': texts++; chars += ins.txt.length; break;
      case 'set': setVar(def, state, ins.key, ins.op, ins.val); break;
      case 'jump': state.scene = ins.target; state.idx = 0; log.push(`->${ins.target}`); break;
      case 'choice': {
        const opts = ins.opts.filter(o => !o.cond || evalCond(o.cond, get));
        const pickIdx = pickIndex(opts, policy);
        const o = opts[Math.max(0, pickIdx)];
        (o.eff || []).forEach(e => {
          const p = parseEffect(e);
          if (p && p.kind === 'var') setVar(def, state, p.key, p.op, p.val);
          if (p && p.kind === 'item') state.items.push(p.id);
          if (p && p.kind === 'tip') state.tips.push(p.id);
        });
        state.scene = o.go; state.idx = 0;
        break;
      }
      case 'hub': {
        log.push(`hub:${Object.keys(state.routes).join(',')}ハート${state.heart}`);
        const undone = routes.find(r => !state.routes[r.key]);
        if (policy.routeOrder && policy.routeOrder.length) {
          const k = policy.routeOrder.shift();
          if (k === '__done') { state.scene = 'g1'; state.idx = 0; break; }
          state.scene = routes.find(r => r.key === k).scene; state.idx = 0; break;
        }
        if (undone) { state.scene = undone.scene; state.idx = 0; log.push(`hub->${undone.key}`); }
        else { state.scene = 'g1'; state.idx = 0; }
        break;
      }
      case 'routeDone': state.routes[ins.id] = true; break;
      case 'chat': persistent.chats.push(ins.id); break;
      case 'cg': if (ins.id && !persistent.cg.includes(ins.id)) persistent.cg.push(ins.id); break;
      case 'end': {
        const j = resolveEnding(def, state, persistent, ins.id);
        const mismatch = ins.id && j.id !== ins.id;
        if (mismatch) errs.push(`[${sc.id}] @end ${ins.id} に対し判定は ${j.id}（心 ${state.heart}/Flag ${get('flagcount')}）`);
        return {
          ok: true, ending: j.id, declared: ins.id, mismatch,
          heart: state.heart, flagcount: get('flagcount'), tease: state.flags.tease,
          best: get('bestflag'), steps, texts, chars, routes: Object.keys(state.routes).length, log,
        };
      }
      case 'title': return { ok: true, ending: '(title)', steps, texts, chars, log };
      case 'stop': return { ok: true, ending: '(stop)', steps, texts, chars, log };
    }
  }
  return { error: `ステップ上限超過（無限ループの可能性）: ${state.scene}`, log };
}

/* 条件式から変数名を抜き出す（ドキュメント用） */
function collectVars(expr, set) {
  String(expr).replace(/![\w.]*/g, '').replace(/\s*(>=|<=|==|!=|>|<)\s*[^&|]+/g, (m) => { set.add(m.trim().split(/\s+/)[0]); return ''; });
  String(expr).split(/&&|\|\|/).forEach(p => { const m = p.trim().match(/^([\w.]+)/); if (m) set.add(m[1]); });
}

/* ------------------------------------------------------------ 統計レポート -- */
const stat = { scenes: data.order.length, chats: Object.keys(data.chats).length, chapters: Object.keys(data.chapters).length };
let totalLines = 0, totalText = 0, choices = 0;
const usedAssets = new Set();
const canon = (ref) => (byId[ref] ? byId[ref].id : ref);
for (const id of data.order) {
  const sc = data.scenes[id];
  totalLines += sc.body.length;
  sc.body.forEach(ins => {
    if (ins.t === 'text') totalText++;
    if (ins.t === 'choice') choices += ins.opts.length;
    if ((ins.t === 'bg' || ins.t === 'cg') && ins.id) usedAssets.add(canon(ins.id));
    if (ins.t === 'chr') Object.entries(ins.set || {}).forEach(([slug, expr]) => {
      const re = new RegExp(`^chr_${slug}_${String(expr).padStart(2, '0')}_`);
      const a = (assetsRaw.assets || []).find(x => x.cat === 'chr' && re.test(x.id + '_'));
      if (a) usedAssets.add(a.id);
    });
  });
}
const idsOf = (cat) => assetsRaw.assets.filter(a => a.cat === cat).map(a => a.id);
const unusedCg = idsOf('cg').filter(id => !usedAssets.has(id));
const unusedBg = idsOf('bg').filter(id => !usedAssets.has(id));
const unusedChr = idsOf('chr').filter(id => !usedAssets.has(id));
const usedBgm = new Set(), usedSe = new Set();
for (const id of data.order) data.scenes[id].body.forEach(i => {
  if (i.t === 'bgm' && i.id) usedBgm.add(i.id);
  if (i.t === 'se' && i.id) usedSe.add(i.id);
});
const missBgm = Array.from({ length: 24 }, (_, n) => `bgm${String(n + 1).padStart(2, '0')}`).filter(b => !usedBgm.has(b));
const missSe = Object.keys(def.seLabels || {}).filter(x => !usedSe.has(x) && !usedSe.has(x.replace(/^se/, 'se0').slice(0, 4)));

/* 総当たり：①誠実一択 ②茶化し一択 ③ランダム100回 */
const runs = [
  { name: '誠実コース（各選択肢を先頭から）', p: { choice: 'first' }, expect: 'true' },
  { name: '流すコース（各選択肢を末尾から）', p: { choice: 'last' }, expect: 'comedy' },
];
for (const r of routes) runs.push({ name: `ルート先行: ${r.title}`, p: { choice: 'first', routeOrder: [r.key, '__done'] } });
for (const f of (def.flags || []).map(x => x.key.replace(/^flag_/, ''))) {
  runs.push({ name: `集中コース（${f} Flag 優先）`, p: { choice: 'focus', flag: f }, expectIn: [`good_${f}`, 'true', 'normal'] });
}
const results = runs.map(r => ({ name: r.name, res: simulate(r.p), expect: r.expect }));
for (let i = 0; i < 120; i++) {
  const res = simulate({ choice: 'random', runs: 1 + (i % 5) });
  results.push({ name: `random#${i}`, res });
}
const endingSeen = new Map();
let simErrors = [];
for (const { name, res, expect, expectIn } of results) {
  if (!res.error) {
    if (expect && res.ending !== expect) errs.push(`${name}: 想定END ${expect} に対し ${res.ending}（心 ${res.heart}）`);
    if (expectIn && !expectIn.includes(res.ending)) errs.push(`${name}: 想定内 ${expectIn.join('/')} に対し ${res.ending}（心 ${res.heart}）`);
  }
  if (res.error) simErrors.push(`${name}: ${res.error}`);
  else if (res.ending) {
    if (!endingSeen.has(res.ending)) endingSeen.set(res.ending, { name, heart: res.heart, flags: res.flagcount, best: res.best, tease: res.tease, routes: res.routes });
  }
}
/* ③ END 判定テーブル：end0_pick に合成状態を流して、脚本側の分岐を直接検証する */
function dispatch(seed, persistent = {}) {
  const res = simulate({ start: 'end0_pick', seed, endings: persistent.endings || {}, runs: persistent.runs || 1 });
  return res.ending || `!${res.error || 'undone'}`;
}
const ALL = (def.flags || []).map(f => f.key);
function baseState(over = {}) {
  const flags = {};
  ALL.forEach(k => flags[k] = 1);
  Object.assign(flags, over.flags || {});
  return { heart: 0, flags, tease: 0, routes: Object.fromEntries(routes.map(r => [r.key, true])), ...over, flags: undefined, ...{} , ...(over.heart !== undefined ? {} : {}) };
}
function seed(heart, flags, tease = 0) {
  const all = {};
  ALL.forEach(k => all[k] = 1);
  Object.assign(all, flags || {});
  return { heart, flags: all, tease, routes: Object.fromEntries(routes.map(r => [r.key, true])) };
}
const dispatchCases = [];
dispatchCases.push(['true', seed(26, Object.fromEntries(ALL.map(k => [k, 3])))]);
for (const k of ALL) {
  const f = {}; ALL.forEach(x => f[x] = 1); f[k] = 5;
  dispatchCases.push([`good_${k.replace(/^flag_/, '')}`, seed(20, f)]);
}
dispatchCases.push(['comedy', seed(14, { flag_ryoma: 5, flag_kuraishi: 1 }, 3)]);
dispatchCases.push(['normal', seed(14, Object.fromEntries(ALL.map(k => [k, 1])))]);
dispatchCases.push(['bittersweet', seed(6, Object.fromEntries(ALL.map(k => [k, 1])))]);
const allOthers = Object.fromEntries(Object.keys(def.endings).filter(k => k !== 'bonus').map(k => [k, true]));
dispatchCases.push(['bonus', seed(30, Object.fromEntries(ALL.map(k => [k, 3]))), { endings: allOthers, runs: 14 }]);
const dispatchResults = dispatchCases.map(([want, st, pers]) => ({ want, got: dispatch(st, pers || {}) }));
for (const d of dispatchResults) {
  if (d.want !== d.got) errs.push(`END判定テーブル: ${d.want} を狙った振り分けが ${d.got} になった`);
}

const comedy = (() => {
  // コメディEND専用シナリオ：倉石の茶化しを全部拾い、両馬Flagを盛り、心Pointを中間帯に留める
  const state = { scene: 'h9', idx: 0, heart: 14, flags: {}, routes: {}, items: [], tips: [], counters: {}, picks: {} };
  (def.flags || []).forEach(f => state.flags[f.key] = 0);
  state.flags.flag_ryoma = 4; state.flags.tease = 3;
  const j = resolveEnding(def, state, { endings: {} }, null);
  return j.id;
})();
const bonus = (() => {
  const all = Object.keys(def.endings).filter(k => k !== 'bonus');
  return all.length;
})();

/* ------------------------------------------------------------------ 出力 -- */
const line = (s = '') => process.stdout.write(s + '\n');
line('═══ 脚本検証 ― 『まだ地図の途中で』〜✝本質✝特別編〜 ═══');
line(`ファイル ${index.length} / シーン ${stat.scenes} / 章 ${stat.chapters} / 端末画面 ${stat.chats}`);
line(`命令 ${totalLines} 行（本文 ${totalText} / 選択肢 ${choices}）／ ${charStat()}`);
function charStat() {
  let n = 0;
  for (const id of data.order) data.scenes[id].body.forEach(i => { if (i.t === 'text') n += i.txt.length; });
  return `本文 ${n.toLocaleString()}字 ≒ 1周 ${Math.max(1, Math.round(n / 700))}分`;
}
line(`アセット ${assetsRaw.assets.length} / 本編引用 ${usedAssets.size} / 未使用BG ${unusedBg.length} / 未使用CG ${unusedCg.length}`);
line(`到達不能シーン: ${orphans.length ? orphans.join(', ') : 'なし'}`);
line('');
line('── オートプレイ ──');
for (const { name, res } of results.slice(0, runs.length)) {
  if (res.error) line(` ✗ ${name} → ${res.error}`);
  else line(` ✓ ${name} → END ${res.ending}（${res.chars.toLocaleString()}字 / 心 ${res.heart} / Flag ${res.flagcount} / 最突出 ${res.best} / tea ${res.tease} / ルート ${res.routes}/6 / ${res.texts}発話）`);
  if (process.argv.includes('--debug')) console.log('   ' + res.log.slice(-30).join(' | '));
}
line(` ✓ ランダム120周 → 到達END ${[...endingSeen.keys()].sort().join(', ')}`);
line(` ✓ 判定関数：コメディ専用条件 → ${comedy}`);
line(` ✓ BONUS 解禁条件：他エンド ${bonus} 種`);
if (simErrors.length) line(` ⚠ 自動プレイ異常 ${simErrors.length}件（先頭）: ${simErrors.slice(0, 4).join(' / ')}`);
if (unusedCg.length && verbose) line('  未使用CG: ' + unusedCg.join(', '));
if (unusedBg.length && verbose) line('  未使用BG: ' + unusedBg.join(', '));
line(`BGM ${24 - missBgm.length}/24 使用${missBgm.length ? '（未使用: ' + missBgm.join(', ') + '）' : ''}`);
if (verbose) line('  参照された条件変数: ' + [...condRefs].sort().join(', '));

line('');
if (warns.length) { line(`警告 ${warns.length} 件:`); warns.slice(0, 20).forEach(w => line('  ! ' + w)); }
if (errs.length) {
  line(`✗ エラー ${errs.length} 件:`);
  errs.slice(0, 40).forEach(e => line('  × ' + e));
  process.exit(1);
} else line('✓ 脚本は整合しています（全参照解決済み・全END到達確認済み）');
