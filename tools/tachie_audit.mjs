#!/usr/bin/env node
/* ============================================================================
   tools/tachie_audit.mjs ―― CG撤去箇所の「立ち絵の流れ」監査

   PR #22（CG 26→7枚）で消えた19箇所について、両版の立ち絵の流れを追い、
   撤去前はCGの下に隠れていた区間が、いま何を見せているかを一覧化する。

   検出する観点:
     1. 進入時の持ち越し   … 直前シーンから立ち絵が残ったまま場面が始まる
     2. 場面に居ない立ち絵 … そのシーンが一度も触らないキャラが舞台上に残る
     3. 話者の立ち絵なし   … 台詞の話者が舞台上に居ない（声だけ）
     4. スロット押し出し   … 版BのL/C/R（3枠）で、別キャラを黙って押し出す
     5. 立ち絵の置き去り   … シーン終端で、次の場面に必要ない立ち絵が残る

   実行:
     node tools/tachie_audit.mjs            … 両版・全19箇所
     node tools/tachie_audit.mjs --a        … 版Aのみ
     node tools/tachie_audit.mjs --b        … 版Bのみ
     node tools/tachie_audit.mjs --json     … JSON出力
   ========================================================================== */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { parseScript } from '../js/parser.js';

const ROOT = path.resolve(import.meta.dirname, '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const DEF = JSON.parse(read('data/meta.json'));
/** 版Aの発話者キー（日本語）→ 立ち絵slug */
const SPRITE_OF = {};
Object.entries(DEF.speakers || {}).forEach(([k, v]) => { if (v && v.sprite) SPRITE_OF[k] = v.sprite; });
const NO_SPRITE = new Set(['黒板', '生徒', '489', 'ナレーション', '地の文', 'ナレ']);
/** 声だけの登録キャラ（立ち絵なし or voice:true）。⚠ではなくℹで出す。 */
const VOICE_ONLY = new Set(
  Object.entries(DEF.speakers || {})
    .filter(([, v]) => v && (!v.sprite || v.voice))
    .map(([k, v]) => v.sprite || k));
const slugOfA = (sp) => (sp && !NO_SPRITE.has(sp) ? SPRITE_OF[sp] || sp : null);
/** 背景ID → ファイル名（両版で突き合わせるため） */
const FILE_OF_A = {};
JSON.parse(read('data/assets.json')).assets.forEach(x => {
  const base = String(x.file).split('/').pop();
  FILE_OF_A[x.id] = base;
  FILE_OF_A[base.replace(/\.[a-z]+$/i, '')] = base;      // bg_sakura_namiki → bg_sakura_namiki.png
});
const FILE_OF_B = {};
[...read('game/js/assets_manifest.js').matchAll(/"?(BG\d+)"?:\s*\{\s*"file":\s*"([^"]+)"/g)].forEach(m => { FILE_OF_B[m[1]] = m[2]; });
const args = process.argv.slice(2).filter(a => !a.startsWith('--'));
const flags = new Set(process.argv.slice(2).filter(a => a.startsWith('--')));

/* --------------------------------------------------- 撤去19枚と、その場所 --- */
const SPOTS = [
  { cg: 'cg_mado_ushiro_miteteta',    a: 'a2',               b: 'a2',              what: '砂糖が「見てた」と認める' },
  { cg: 'cg_tsukue_kakomi_daiji',     a: 'b2',               b: 'b2',              what: '零が「大事だと思うから」' },
  { cg: 'cg_butsudan_narabu_futari',  a: 'd2',               b: 'd2',              what: '両馬、祖父の口癖' },
  { cg: 'cg_yoru_chizu_tsukuri',      a: 'g1',               b: 'g1',              what: '地図を作る夜' },
  { cg: 'cg_yuugata_madobe_katsuya',  a: 'h1',               b: 'h1',              what: '勝也、夕方の教室' },
  { cg: 'cg_fuhou_kageboushi',        a: 'h4',               b: 'h4',              what: '訃報の回想' },
  { cg: 'cg_seito_wo_miwatasu',       a: 'h6',               b: 'h6',              what: '勝也が生徒を見渡す' },
  { cg: 'cg_end_mie',                 a: 'end_good_mie',     b: 'end_mie',         what: 'GOOD END 三重' },
  { cg: 'cg_end_satou',               a: 'end_good_satou',   b: 'end_satou',       what: 'GOOD END 砂糖' },
  { cg: 'cg_end_rei',                 a: 'end_good_rei',     b: 'end_rei',         what: 'GOOD END 零' },
  { cg: 'cg_end_terachi',             a: 'end_good_terachi', b: 'end_terachi',     what: 'GOOD END 寺地' },
  { cg: 'cg_end_ryoma',               a: 'end_good_ryoma',   b: 'end_ryoma',       what: 'GOOD END 両馬' },
  { cg: 'cg_end_izaki_izumi',         a: 'end_good_izaki',   b: 'end_izaki',       what: 'GOOD END 伊崎＋伊豆見' },
  { cg: 'cg_end_meshino',             a: 'end_good_meshino', b: 'end_meshino',     what: 'GOOD END 召野' },
  { cg: 'cg_end_kuraishi',            a: 'end_good_kuraishi', b: 'end_kuraishi',   what: 'GOOD END 倉石' },
  { cg: 'cg_end_minamitou',           a: 'end_good_minamitou', b: 'end_minamitou', what: 'GOOD END 南棟' },
  { cg: 'cg_end_normal',              a: 'end_normal',       b: 'end_normal',      what: 'NORMAL END' },
  { cg: 'cg_end_bittersweet',         a: 'end_bittersweet',  b: 'end_bitter',      what: 'BITTERSWEET END' },
  { cg: 'cg_end_comedy',              a: 'end_comedy',       b: 'end_comedy',      what: 'COMEDY END' },
];

/* ============================================================== 版A（DSL） == */
function loadA() {
  const index = read('data/script/index.txt').split('\n').map(l => l.split(';')[0].trim()).filter(Boolean);
  const scenes = {}, order = [];
  for (const f of index) {
    const p = parseScript(read('data/script/' + f), f);
    Object.assign(scenes, p.scenes); order.push(...p.order);
  }
  order.forEach((id, n) => { scenes[id].next = order[n + 1] || null; });
  return { scenes, order };
}
const A = loadA();

const castOfA = (sc) => {
  const set = new Set();
  sc.body.forEach(i => {
    if (i.t === 'text') { const sl = slugOfA(i.sp); if (sl) set.add(sl); }
    if (i.t === 'chr') { if (i.set) Object.keys(i.set).forEach(k => set.add(k)); if (i.del) i.del.forEach(k => set.add(k.trim())); }
  });
  return set;
};

/** 版A の状態遷移（実フローに沿ってジャンプを追う） */
function runA(sceneId, entry, visit, stopOnLeave = false) {
  const st = { chr: new Map(entry || []), cg: null, bg: null, scene: sceneId };
  let scene = sceneId, idx = 0, guard = 0;
  const seenScenes = [];
  while (guard++ < 4000) {
    const sc = A.scenes[scene];
    if (!sc) break;
    if (scene !== sceneId && stopOnLeave) break;
    if (idx >= sc.body.length) { if (!sc.next) break; scene = sc.next; idx = 0; continue; }
    const ins = sc.body[idx];
    const at = { scene, line: sc.start + idx, ins, prep: [...st.chr.entries()], cg: st.cg, bg: st.bg };
    idx++;
    if (visit) { const r = visit(at, st); if (r === 'stop') break; }
    switch (ins.t) {
      case 'bg': st.bg = ins.id; break;
      case 'cg': st.cg = ins.id; break;
      case 'chr':
        if (ins.clear) st.chr.clear();
        else if (ins.del) ins.del.forEach(k => st.chr.delete(k.trim()));
        else Object.entries(ins.set).forEach(([k, v]) => st.chr.set(k, v));
        break;
      case 'jump':
        // 進入状態の推定では、条件付きジャンプ（@if ... -> x）は「その場面の分岐」として扱い、
        // 無条件ジャンプだけを「シーンを離れる」と見なす。
        if (stopOnLeave) { if (ins.cond) break; if (ins.target !== sceneId) return { st, scene }; }
        scene = ins.target; idx = 0; break;
      case 'hub': case 'returnhub': return { st, scene };
      case 'choice': scene = ins.opts[0].go; idx = 0; break;
      case 'end': return { st, scene };
    }
  }
  return { st, scene };
}

/** 版A: シーンの進入元（jump / 選択肢 / @if） */
function predsOfA(sceneId) {
  const preds = [];
  for (const sid of A.order) {
    if (sid === sceneId) continue;
    let hit = false;
    A.scenes[sid].body.forEach(i => {
      if (i.t === 'jump' && i.target === sceneId) hit = true;
      if (i.t === 'choice' && i.opts.some(o => o.go === sceneId)) hit = true;
      if (i.t === 'end' && i.target === sceneId) hit = true;
    });
    if (hit) preds.push(sid);
  }
  return preds;
}
/** 版A: シーンへ入る直前の状態（入り口からチェーンを実際に走らせて求める） */
function entryA(sceneId) {
  // 逆BFSで「前が無いシーン」までの経路を得る
  const path = [];
  let cur = sceneId, guard = 0;
  const seen = new Set([sceneId]);
  while (guard++ < 24) {
    const ps = predsOfA(cur).filter(p => !seen.has(p));
    if (!ps.length) break;
    // サブルート（_a/_b/_join/_hiku 等）より本編を優先
    ps.sort((x, y) => (/(_a|_b|_join|_hiku|_zenbu|_sore|_suu|_eb|_hara|_bonus|_pick)$/.test(x) ? 1 : 0) - (/(_a|_b|_join|_hiku|_zenbu|_sore|_suu|_eb|_hara|_bonus|_pick)$/.test(y) ? 1 : 0));
    cur = ps[0]; seen.add(cur); path.unshift(cur);
  }
  // 経路を順に走らせ、最後のシーンを出た瞬間の状態を取る
  let st = { chr: new Map() };
  for (const sid of path) {
    const r = runA(sid, [...st.chr.entries()], null, true);
    st = r.st;
  }
  return { from: path.length ? path[path.length - 1] : null, chr: [...st.chr.entries()] };
}

/* =========================================================== 版B（JS配列） == */
function loadB() {
  const ctx = { window: {}, console };
  vm.createContext(ctx);
  for (const f of ['script_00_common.js', 'script_01_routes_abc.js', 'script_02_routes_cef.js', 'script_03_climax.js', 'script_04_endings.js']) {
    vm.runInContext(read('game/js/' + f), ctx, { filename: f });
  }
  return ctx.window.SCENES;
}
const B = loadB();

const castOfB = (sc) => {
  const set = new Set();
  const walk = (arr) => arr.forEach(c => {
    if (c[0] === 'say') set.add(c[1]);
    if (c[0] === 'chr') set.add(c[1]);
    if (c[0] === 'hide') set.add(c[1]);
    if (c[0] === 'branch') { walk(c[1].then || []); walk(c[1].else || []); }
  });
  walk(sc.data);
  return set;
};

function runB(sceneId, entry, visit, stopOnLeave = false) {
  const st = { slots: { L: null, C: null, R: null }, expr: new Map(), cg: null, bg: null };
  if (entry) { st.slots = Object.assign(st.slots, entry.slots); (entry.expr || []).forEach(([k, v]) => st.expr.set(k, v)); }
  let scene = sceneId, idx = 0, guard = 0;
  const step = (cmd) => {
    const [t, a1, a2, a3] = cmd;
    const at = { scene, line: idx, cmd, prep: ['L', 'C', 'R'].filter(p => st.slots[p]).map(p => [st.slots[p], p, st.expr.get(st.slots[p])]), cg: st.cg, bg: st.bg };
    if (visit) { const r = visit(at, st); if (r === 'stop') return 'stop'; }
    switch (t) {
      case 'bg': st.bg = a1; break;
      case 'cg': st.cg = a1; break;
      case 'cgoff': st.cg = null; break;
      case 'chr': {
        const pos = a3 || 'C';
        const prev = st.slots[pos];
        st.slots[pos] = a1; st.expr.set(a1, a2);
        for (const p of ['L', 'C', 'R']) if (p !== pos && st.slots[p] === a1) st.slots[p] = null;
        at.pushed = prev && prev !== a1 ? prev : null;
        break;
      }
      case 'ex': {
        st.expr.set(a1, a2);
        if (a3) { const prev = st.slots[a3]; at.pushed = prev && prev !== a1 ? prev : null; st.slots[a3] = a1; for (const p of ['L', 'C', 'R']) if (p !== a3 && st.slots[p] === a1) st.slots[p] = null; }
        break;
      }
      case 'hide': for (const p of ['L', 'C', 'R']) if (st.slots[p] === a1) st.slots[p] = null; break;
      case 'hideall': st.slots = { L: null, C: null, R: null }; break;
    }
    return null;
  };
  while (guard++ < 4000) {
    const sc = B[scene];
    if (!sc) break;
    if (scene !== sceneId && stopOnLeave) break;
    if (idx >= sc.data.length) break;
    const cmd = sc.data[idx]; idx++;
    if (step(cmd) === 'stop') return { st, scene };
    const t = cmd[0];
    if (t === 'hub' || t === 'returnhub') break;
    if (t === 'jump') { if (stopOnLeave && cmd[1] !== sceneId) break; scene = cmd[1]; idx = 0; }
    else if (t === 'choice') { const o = cmd[1].opts[0]; if (o.go) { scene = o.go; idx = 0; } }
    else if (t === 'iflast') { const target = cmd[2]; if (target && !stopOnLeave) { scene = target; idx = 0; } }
    else if (t === 'branch') {
      const b = cmd[1];
      const jt = (b.then || []).find(x => x[0] === 'jump');
      const je = (b.else || []).find(x => x[0] === 'jump');
      const target = jt ? jt[1] : je ? je[1] : null;
      if (target) { scene = target; idx = 0; }
    } else if (t === 'ending') return { st, scene };
  }
  return { st, scene };
}

function predsOfB(sceneId) {
  const preds = [];
  for (const sid in B) {
    if (sid === sceneId) continue;
    let hit = false;
    const walk = (arr) => arr.forEach(c => {
      if (c[0] === 'jump' && c[1] === sceneId) hit = true;
      if (c[0] === 'choice' && c[1].opts.some(o => o.go === sceneId)) hit = true;
      if (c[0] === 'iflast' && (c[2] === sceneId || c[4] === sceneId)) hit = true;      // ["iflast", i, goA, j, goB]
      if (c[0] === 'branch' && ((c[1].then || []).some(x => x[0] === 'jump' && x[1] === sceneId) || (c[1].else || []).some(x => x[0] === 'jump' && x[1] === sceneId))) hit = true;
    });
    walk(B[sid].data);
    if (hit) preds.push(sid);
  }
  return preds;
}
function entryB(sceneId) {
  const path = [];
  let cur = sceneId, guard = 0;
  const seen = new Set([sceneId]);
  while (guard++ < 24) {
    const ps = predsOfB(cur).filter(p => !seen.has(p));
    if (!ps.length) break;
    ps.sort((x, y) => (/(_a|_b|_join|_hiku|_zenbu|_sore|_suu|_eb|_hara|_bonus|_pick)$/.test(x) ? 1 : 0) - (/(_a|_b|_join|_hiku|_zenbu|_sore|_suu|_eb|_hara|_bonus|_pick)$/.test(y) ? 1 : 0));
    cur = ps[0]; seen.add(cur); path.unshift(cur);
  }
  let st = { slots: { L: null, C: null, R: null }, expr: new Map() };
  for (const sid of path) {
    const r = runB(sid, { slots: { ...st.slots }, expr: [...st.expr.entries()] }, null, true);
    st = r.st;
  }
  return { from: path.length ? path[path.length - 1] : null, slots: { ...st.slots }, expr: [...st.expr.entries()] };
}

/* ----------------------------------------------------------------- 監査 --- */
const NAME = { satou: '砂糖', mie: '三重', rei: '零', terachi: '寺地', ryoma: '両馬', katsuya: '勝也', izaki: '伊崎', izumi: '伊豆見', sakura: '櫻', naitou: '内藤', mitsumine: '三峰', meshino: '召野', kuraishi: '倉石', futami: '二見', inaba: '稲葉', wakaki: '若き勝也' };
const nm = (k) => `${NAME[k] || k}(${k})`;

/** そのシーンだけを走らせたときの終端状態 */
/** そのシーンが pred を満たす命令に到達するか（@jump を数段たどる） */
function reachesA(sceneId, pred, d = 0) {
  const sc = A.scenes[sceneId];
  if (!sc || d > 3) return false;
  if (sc.body.some(pred)) return true;
  return sc.body.some(i => i.t === 'jump' && i.target && reachesA(i.target, pred, d + 1));
}
const isEndCmd = (i) => i.t === 'end';
const isHubCmd = (i) => i.t === 'hub';
/** そのシーンがハブ（ルート一覧）へ戻って終わるか。ハブは全面パネルで舞台を覆う。 */
const leadsToHubA = (sceneId) => reachesA(sceneId, isHubCmd);
/** そのシーンから出る先（@jump / @if の飛び先）の cast 集合 */
function nextCastsA(sceneId) {
  const sc = A.scenes[sceneId];
  if (!sc) return [];
  const targets = new Set();
  sc.body.forEach(i => { if (i.t === 'jump' && i.target) targets.add(i.target); });
  return [...targets].map(t => (A.scenes[t] ? castOfA(A.scenes[t]) : new Set()));
}
function sceneEndA(sceneId, entry) {
  const st = { chr: new Map(entry || []) };
  const sc = A.scenes[sceneId];
  if (!sc) return st.chr;
  sc.body.forEach(ins => {
    if (ins.t !== 'chr') return;
    if (ins.clear) st.chr.clear();
    else if (ins.del) ins.del.forEach(k => st.chr.delete(k.trim()));
    else Object.entries(ins.set).forEach(([k, v]) => st.chr.set(k, v));
  });
  return st.chr;
}
function auditA(spot) {
  const sc = A.scenes[spot.a];
  if (!sc) return { error: `版Aにシーンがありません: ${spot.a}` };
  const cast = castOfA(sc);
  const ent = entryA(spot.a);
  const findings = [], notes = [], lines = [];
  const isEnd = reachesA(spot.a, isEndCmd);
  const entryNames = ent.chr.map(([k, v]) => `${nm(k)}=${v}`);
  const outside = ent.chr.filter(([k]) => !cast.has(k));
  if (ent.chr.length) {
    const text = `進入時（前シーン ${ent.from} から）立ち絵が残っている: ${entryNames.join(' / ')}`;
    if (outside.length) findings.push(text + `　→ ${outside.map(([k]) => nm(k)).join('・')} はこの場面の cast に無い`);
    else notes.push(text + '　→ 全員この場面にも登場（継続する場面の分割。意図どおり）');
  }
  let started = false;
  runA(spot.a, ent.chr, (at, st) => {
    const ins = at.ins;
    if (ins.t === 'text') {
      const who = slugOfA(ins.sp);
      const shown = [...st.chr.entries()].map(([k, v]) => `${nm(k)}=${v}`);
      const want = who && !st.chr.has(who);
      if (want && VOICE_ONLY.has(who)) notes.push(`L${at.line} 話者 ${nm(who)} は声のみ（立ち絵を持たない登録キャラ・設計どおり）`);
      else if (want) findings.push(`L${at.line} 話者 ${nm(who)} の立ち絵が舞台上に無い（声だけ）`);
      lines.push({ line: at.line, kind: who ? 'say' : 'nar', who, txt: (who ? `「${ins.txt}」` : String(ins.txt)), shown, cg: at.cg, talking: who });
    }
    if (ins.t === 'chr') lines.push({ line: at.line, kind: 'chr', txt: ins.clear ? 'clear' : ins.del ? '-' + ins.del.join(',') : Object.entries(ins.set).map(([k, v]) => `${k}=${v}`).join(','), shown: [...st.chr.entries()].map(([k, v]) => `${k}=${v}`), cg: at.cg });
    if (ins.t === 'cg') lines.push({ line: at.line, kind: 'cg', txt: ins.id || 'off', shown: [...st.chr.entries()].map(([k, v]) => `${k}=${v}`), cg: at.cg });
    if (ins.t === 'bg') lines.push({ line: at.line, kind: 'bg', txt: ins.id, shown: [], cg: at.cg });
    if (ins.t === 'end' || ins.t === 'jump') return 'stop';
    return null;
  });
  const endChr = sceneEndA(spot.a, ent.chr);
  const endTxt = [...endChr.entries()].map(([k, v]) => `${nm(k)}=${v}`).join(' / ');
  if (endChr.size) {
    const nextCasts = nextCastsA(spot.a);
    const compat = (c, k) => c.size === 0 || c.has(k);          // 立ち絵に触れない場面（nar のみ）は持ち越し前提
    const kept = [...endChr.keys()].filter(k => nextCasts.length && nextCasts.every(c => compat(c, k)));
    if (isEnd) notes.push(`シーン終端の立ち絵（${endTxt}）はエンド画面が覆うため実害なし`);   // #overlay: 不透明.9 + blur
    else if (leadsToHubA(spot.a)) notes.push(`シーン終端の立ち絵（${endTxt}）はルート終端（ハブ画面が覆う）ため実害なし`);
    else if (kept.length === endChr.size) notes.push(`シーン終端の立ち絵（${endTxt}）は次シーンにも登場（継続。意図どおり）`);
    else findings.push(`シーン終端で残る立ち絵: ${endTxt}`);
  }
  const bgA = lines.filter(l => l.kind === 'bg').map(l => FILE_OF_A[l.txt] || l.txt);
  return { scene: spot.a, file: sc.file, label: sc.label, cast: [...cast], entry: ent, findings, notes, lines, bg: bgA };
}

/** そのシーンだけを走らせたときの終端スロット */
function sceneEndB(sceneId, entry) {
  const st = { slots: { L: null, C: null, R: null } };
  if (entry && entry.slots) Object.assign(st.slots, entry.slots);
  const sc = B[sceneId];
  if (!sc) return st;
  sc.data.forEach(c => {
    const [t, a1, a2, a3] = c;
    if (t === 'chr') { const pos = a3 || 'C'; st.slots[pos] = a1; for (const p of ['L', 'C', 'R']) if (p !== pos && st.slots[p] === a1) st.slots[p] = null; }
    else if (t === 'ex' && a3) { st.slots[a3] = a1; for (const p of ['L', 'C', 'R']) if (p !== a3 && st.slots[p] === a1) st.slots[p] = null; }
    else if (t === 'hide') { for (const p of ['L', 'C', 'R']) if (st.slots[p] === a1) st.slots[p] = null; }
    else if (t === 'hideall') st.slots = { L: null, C: null, R: null };
  });
  return st;
}
const isEndCmdB = (c) => c[0] === 'ending' || c[0] === 'endlogo';
const isHubCmdB = (c) => c[0] === 'returnhub' || c[0] === 'hub';
/** 版B: pred を満たす命令に到達するか */
function reachesB(sceneId, pred, d = 0) {
  const sc = B[sceneId];
  if (!sc || !sc.data || d > 3) return false;
  if (sc.data.some(pred)) return true;
  return sc.data.some(c =>
    (c[0] === 'jump' && c[1] && reachesB(c[1], pred, d + 1)) ||
    (c[0] === 'iflast' && ((c[2] && reachesB(c[2], pred, d + 1)) || (c[4] && reachesB(c[4], pred, d + 1)))));
}
function auditB(spot) {
  const sc = B[spot.b];
  if (!sc) return { error: `版Bにシーンがありません: ${spot.b}` };
  const cast = castOfB(sc);
  const ent = entryB(spot.b);
  const findings = [], notes = [], lines = [];
  const isEnd = reachesB(spot.b, c => c[0] === 'ending' || c[0] === 'endlogo');
  const isHubReturn = reachesB(spot.b, c => c[0] === 'returnhub' || c[0] === 'hub');
  const entryNames = ['L', 'C', 'R'].filter(p => ent.slots && ent.slots[p]).map(p => `${nm(ent.slots[p])}@${p}`);
  const outside = ['L', 'C', 'R'].filter(p => ent.slots && ent.slots[p] && !cast.has(ent.slots[p]));
  if (entryNames.length) {
    const text = `進入時（前シーン ${ent.from} から）立ち絵が残っている: ${entryNames.join(' / ')}`;
    if (outside.length) findings.push(text + `　→ ${outside.map(p => nm(ent.slots[p])).join('・')} はこの scene cast に無い`);
    else notes.push(text + '　→ 全員この場面にも登場（継続する場面の分割。意図どおり）');
  }
  runB(spot.b, ent, (at, st) => {
    const cmd = at.cmd, t = cmd[0];
    if (t === 'say') {
      const pos = ['L', 'C', 'R'].find(p => st.slots[p] === cmd[1]);
      if (!pos) findings.push(`L${at.line} 話者 ${nm(cmd[1])} の立ち絵が舞台上に無い（声だけ）`);
      lines.push({ line: at.line, kind: 'say', txt: `${cmd[1]}: ${String(cmd[2]).slice(0, 46)}`, shown: at.prep.map(([w, p, e]) => `${nm(w)}=${e}@${p}`) });
    } else if (t === 'chr' || t === 'ex' || t === 'hide' || t === 'hideall' || t === 'cg' || t === 'cgoff' || t === 'bg') {
      const v = t === 'chr' ? `${cmd[1]}=${cmd[2]}@${cmd[3] || 'C'}` : t === 'ex' ? `${cmd[1]}=${cmd[2]}${cmd[3] ? '@' + cmd[3] : ''}` : t === 'hide' ? `-${cmd[1]}` : t === 'hideall' ? 'hideall' : t === 'cg' ? cmd[1] : t === 'cgoff' ? 'off' : cmd[1];
      if (at.pushed) findings.push(`L${at.line} スロット押し出し: ${nm(at.pushed)} が ${nm(cmd[1])} に入れ替わる`);
      lines.push({ line: at.line, kind: t, txt: v, shown: at.prep.map(([w, p, e]) => `${nm(w)}=${e}@${p}`) });
    }
    if (t === 'jump' || t === 'ending') return 'stop';
    return null;
  });
  const endSt = sceneEndB(spot.b, ent);
  const endSlots = ['L', 'C', 'R'].filter(p => endSt.slots[p]).map(p => `${nm(endSt.slots[p])}@${p}`);
  if (endSlots.length) {
    const nextCasts = [sc.data.filter(c => c[0] === 'jump' && c[1]).map(c => castOfB(B[c[1]] || { data: [] }))];
    const flat = nextCasts.flat();
    const compatB = (c, k) => c.size === 0 || c.has(k);
    const kept = ['L', 'C', 'R'].filter(p => endSt.slots[p]).filter(p => flat.length && flat.every(c => compatB(c, endSt.slots[p])));
    if (isEnd) notes.push(`シーン終端の立ち絵（${endSlots.join(' / ')}）はエンド画面が覆うため実害なし`);
    else if (isHubReturn) notes.push(`シーン終端の立ち絵（${endSlots.join(' / ')}）はルート終端（ハブ画面が覆う）ため実害なし`);
    else if (kept.length === endSlots.length) notes.push(`シーン終端の立ち絵（${endSlots.join(' / ')}）は次シーンにも登場（継続。意図どおり）`);
    else findings.push(`シーン終端で残る立ち絵: ${endSlots.join(' / ')}`);
  }
  const bgB = lines.filter(l => l.kind === 'bg').map(l => FILE_OF_B[l.txt] || l.txt);
  return { scene: spot.b, label: sc.title, cast: [...cast], entry: ent, findings, notes, lines, bg: bgB };
}

/* -------------------------------------------------------------- 出力 ------ */
const useA = !flags.has('--b');
const useB = !flags.has('--a');
const out = { a: {}, b: {} };
if (useA) for (const s of SPOTS) out.a[s.cg] = auditA(s);
if (useB) for (const s of SPOTS) out.b[s.cg] = auditB(s);

if (flags.has('--json')) {
  console.log(JSON.stringify(out, null, 2));
} else {
  for (const s of SPOTS) {
    if (flags.size && !flags.has('--a') && !flags.has('--b') && args.length && !args.includes(s.cg)) continue;
    if (args.length && !args.includes(s.cg)) continue;
    console.log('\n' + '━'.repeat(96));
    console.log(`■ ${s.cg} ― ${s.what}`);
    for (const [ver, r] of [['版A', out.a[s.cg]], ['版B', out.b[s.cg]]]) {
      if (!r) continue;
      if (r.error) { console.log(`  ${ver}: ${r.error}`); continue; }
      const tag = ver === '版A' ? `#${r.scene} (${r.file})` : `${r.scene}`;
      console.log(`\n  ── ${ver} ${tag} ／ シーンの cast: ${r.cast.map(nm).join(', ')}`);
      for (const f of r.findings) console.log(`     ⚠ ${f}`);
      for (const n of (r.notes || [])) console.log(`     ℹ ${n}`);
      const show = r.lines.filter(l => ['say', 'nar', 'chr', 'cg', 'bg'].includes(l.kind));   // 表示行だけ
      for (const l of show) {
        const cg = l.cg ? ` [CG:${l.cg}]` : '';
        const shown = l.shown && l.shown.length ? l.shown.join(' / ') : '（立ち絵なし）';
        const head = l.kind === 'say' ? `say ${String(l.txt).slice(0, 40)}` : `${l.kind} ${String(l.txt).slice(0, 40)}`;
        console.log(`     L${String(l.line).padStart(4)} ${head.padEnd(46)} 立ち絵: ${shown}${cg}`);
      }
    }
  }
  /* ── 両版の背景突き合わせ（エンド系のみ。@bg の並びをファイル名で比較） ── */
  console.log('\n' + '─'.repeat(96));
  console.log('■ 両版の背景突き合わせ（エンドCG撤去 → @bg 置換の同期確認）');
  let bad = 0;
  for (const s of SPOTS) {
    if (!s.a.startsWith('end')) continue;
    const a = out.a[s.cg], b = out.b[s.cg];
    if (!a || !b || a.error || b.error) continue;
    const uniq = (arr) => arr.filter((v, i) => i === 0 || v !== arr[i - 1]);
    const same = JSON.stringify(uniq(a.bg)) === JSON.stringify(uniq(b.bg));
    if (!same) bad++;
    console.log(`   ${same ? '✅' : '★ '} ${s.cg.padEnd(24)} 版A: ${a.bg.join(',') || '-'}  /  版B: ${b.bg.join(',') || '-'}`);
  }
  console.log(bad ? `   → ${bad} 箇所が不一致` : '   → 全エンドで一致');
  console.log('');
}
