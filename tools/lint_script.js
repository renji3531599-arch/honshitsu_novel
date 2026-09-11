#!/usr/bin/env node
/* ============================================================
   スクリプト・リンター
   1) ラベル重複・未解決ジャンプの検出
   2) 全分岐を網羅する到達性検査（全エンディング到達）
   3) アセット参照の整合（ファイル実在）
   4) 心Point上限の概算
   ============================================================ */
'use strict';
const path = require('path');
const fs = require('fs');

const ROOT = path.join(__dirname, '..');
global.window = global; // データファイルは window/global 両対応

require(path.join(ROOT, 'js/data/manifest.js'));
require(path.join(ROOT, 'js/data/10_prologue.js'));
require(path.join(ROOT, 'js/data/20_routeA.js'));
require(path.join(ROOT, 'js/data/21_routeB.js'));
require(path.join(ROOT, 'js/data/22_routeC.js'));
require(path.join(ROOT, 'js/data/23_routeD.js'));
require(path.join(ROOT, 'js/data/24_routeE.js'));
require(path.join(ROOT, 'js/data/25_routeF.js'));
require(path.join(ROOT, 'js/data/30_convergence.js'));
require(path.join(ROOT, 'js/data/31_climax.js'));
require(path.join(ROOT, 'js/data/40_endings.js'));
require(path.join(ROOT, 'js/data/45_bonus.js'));

const M = global.MANIFEST;
const SCRIPT = [].concat(...global.__SCRIPT_PARTS);
const LABELS = {};
let errors = 0, warns = 0;

const err = (m) => { console.error('  [ERROR]', m); errors++; };
const warn = (m) => { console.warn('  [WARN] ', m); warns++; };

console.log('総ノード数:', SCRIPT.length);

/* ---------- 1. ラベル ---------- */
SCRIPT.forEach((n, i) => {
  if (n.t === 'label') {
    if (LABELS[n.name] != null) err(`label重複: ${n.name} @${LABELS[n.name]} and @${i}`);
    LABELS[n.name] = i;
  }
});
console.log('ラベル数:', Object.keys(LABELS).length);

/* ---------- 2. ノード検査 ---------- */
SCRIPT.forEach((n, i) => {
  switch (n.t) {
    case 'bg':
      if (!M.BGS[n.id]) err(`BG未定義: ${n.id} @${i}`);
      break;
    case 'cg':
      if (!M.CGS[n.id] && !M.CG_ENDS[n.id]) err(`CG未定義: ${n.id} @${i}`);
      break;
    case 'say': case 'think': case 'sprite':
      if (!M.CHARS[n.who]) { err(`キャラ未定義: ${n.who} @${i}`); break; }
      const max = (M.EXPR_LABELS[n.who] || []).length;
      if (!(n.exp >= 1 && n.exp <= max)) err(`表情範囲外: ${n.who} exp${n.exp} (1-${max}) @${i}`);
      break;
    case 'jump':
      if (LABELS[n.to] == null) err(`未解決ジャンプ: -> ${n.to} @${i}`);
      break;
    case 'choice':
      n.opts.forEach((op, j) => {
        if (op.goto && LABELS[op.goto] == null) err(`選択肢goto未解決: ${op.goto} @${i}#${j}`);
      });
      break;
    case 'dict':
      if (!M.TERMS[n.key]) err(`辞典項目未定義: ${n.key} @${i}`);
      break;
    case 'bgm':
      if (!/^bgm\d+$/.test(n.id)) err(`BGM id不審: ${n.id} @${i}`);
      break;
  }
});

/* ---------- 3. 到達性（全分岐DFS） ---------- */
function successors(i, st) {
  const out = [];
  const n = SCRIPT[i];
  if (!n) return out;
  switch (n.t) {
    case 'jump': out.push(LABELS[n.to]); break;
    case 'choice': n.opts.forEach(op => {
      if (op.goto) out.push(LABELS[op.goto]);
      else out.push(i + 1);
    }); break;
    case 'if': {
      // 両分岐を試す
      try {
        if (n.cond(st)) out.push(i + 1);
        else out.push(i + 1 + n.then.length);
      } catch (e) {}
      out.push(i + 1);            // then側
      out.push(i + 1 + n.then.length); // else側
      break;
    }
    case 'branch_end': {
      ['end_true', 'good_mie', 'good_satou', 'good_rei', 'good_terachi', 'good_ryoma',
       'good_izaki', 'good_meshino', 'good_kuraishi', 'good_minamitou',
       'end_normal', 'end_bittersweet', 'end_comedy'].forEach(l => { if (LABELS[l] != null) out.push(LABELS[l]); });
      break;
    }
    case 'hub': {
      Object.keys(M.ROUTES).forEach(k => out.push(LABELS[M.ROUTES[k].label]));
      if (LABELS.convergence_start != null) out.push(LABELS.convergence_start);
      break;
    }
    case 'end': out.push(i + 1); break; // エンドカード後は pc++ で継続
    case 'staffroll': case 'to_title': break;
    default: out.push(i + 1);
  }
  return out.filter(x => x != null && x < SCRIPT.length);
}

function freshState() {
  return { heart: 0, flags: { MIE: 0, SATOU: 0, REI: 0, TERACHI: 0, RYOMA: 0, MINAMITOU: 0, MESHINO_KURAISHI: 0, IZAKI_IZUMI: 0 }, jokes: 0, vars: { ch1path: null, hubDone: {}, meshinoSide: 0, kuraishiSide: 0, sincere: 0 } };
}

// 到達集合
const seen = new Set();
{
  const stack = [0, LABELS.bonus_start];
  while (stack.length) {
    const i = stack.pop();
    if (i == null || i < 0 || i >= SCRIPT.length || seen.has(i)) continue;
    seen.add(i);
    successors(i, freshState()).forEach(x => stack.push(x));
  }
}
console.log('到達ノード数:', seen.size);

// 未到達ノード（label含む）
const unreachable = [];
for (let i = 0; i < SCRIPT.length; i++) if (!seen.has(i)) unreachable.push(i);
if (unreachable.length) {
  unreachable.forEach(i => warn(`未到達ノード @${i}: ${JSON.stringify(SCRIPT[i]).slice(0, 90)}`));
}

// エンディング到達検査
const endLabels = ['end_true', 'good_mie', 'good_satou', 'good_rei', 'good_terachi', 'good_ryoma',
  'good_izaki', 'good_meshino', 'good_kuraishi', 'good_minamitou', 'end_normal', 'end_bittersweet',
  'end_comedy', 'bonus_start'];
console.log('--- エンディング到達 ---');
endLabels.forEach(l => {
  if (LABELS[l] == null) { err(`ED label不在: ${l}`); return; }
  console.log(`  ${seen.has(LABELS[l]) ? 'OK ' : 'NG '} ${l}`);
  if (!seen.has(LABELS[l])) err(`エンディング未到達: ${l}`);
});

/* ---------- 4. 選択肢「常時①」シミュレーション（HUBはルート順A→F） ---------- */
function applyEffects(st, op) {
  if (op.heart) st.heart = Math.max(-10, Math.min(40, st.heart + op.heart));
  if (op.flag) st.flags[op.flag] = (st.flags[op.flag] || 0) + (op.flagv || 1);
  if (op.joke) st.jokes += op.joke;
  if (op.side === 'meshino') st.vars.meshinoSide++;
  if (op.side === 'kuraishi') st.vars.kuraishiSide++;
  if (op.sincere) st.vars.sincere++;
  if (op.set) Object.assign(st.vars, op.set);
}
function simulate(choiceIdx) {
  const st = freshState();
  let i = 0, steps = 0;
  const visitedHub = {};
  while (i < SCRIPT.length && steps++ < 20000) {
    const n = SCRIPT[i];
    if (n.t === 'choice') {
      const op = n.opts[Math.min(choiceIdx, n.opts.length - 1)];
      applyEffects(st, op);
      i = op.goto ? LABELS[op.goto] : i + 1;
      continue;
    }
    if (n.t === 'hub') {
      const next = ['A', 'B', 'C', 'D', 'E', 'F'].find(k => !visitedHub[k]);
      if (next) { visitedHub[next] = true; i = LABELS[M.ROUTES[next].label]; continue; }
      i = LABELS.convergence_start; continue;
    }
    if (n.t === 'hub_done') { st.vars.hubDone[n.k] = true; i++; continue; }
    if (n.t === 'jump') { i = LABELS[n.to]; continue; }
    if (n.t === 'if') {
      let branch = [];
      try { branch = n.cond(st) ? n.then : n.else; } catch (e) { branch = n.else; }
      // 挿入を模倣：then/elseを順に実行するため、簡易にサブ実行
      // ここでは簡略化：condを満たす分岐だけ直列実行する（インライン展開相当）
      // → サブ配列をその場で評価するため、擬似PCスタックを使う
      // 簡略実装: サブノード配列をそのまま直列に処理する補助関数を呼ぶ
      const sub = runInline(branch, st);
      i = sub; continue;
    }
    if (n.t === 'end') return { end: n.id, st };
    if (n.t === 'branch_end') {
      // エンジンと同じ判定式
      return { end: computeEnding(st), st };
    }
    if (n.t === 'staffroll') return { end: 'staffroll', st };
    i++;
  }
  return { end: '(未到達)', st };
}
function runInline(nodes, st) {
  // インライン分岐内のpoint/flagをstateへ反映するのみ（到達先はi+1+長さ）
  nodes.forEach(n => {
    if (n.t === 'point') st.heart += n.v;
    if (n.t === 'flag') st.flags[n.k] = (st.flags[n.k] || 0) + n.v;
  });
  return -1; // 呼び出し側でi+1+長さに相当する扱い
}

// 'if'のインライン展開を正確に扱うため、実行前にSCRIPTを展開コピーする
function expandScript() {
  const out = [];
  function walk(nodes) {
    nodes.forEach(n => {
      if (n.t === 'if') {
        out.push({ ...n, __expanded: true });
        out.push({ t: '__sep_then' });
        walk(n.then);
        out.push({ t: '__sep_else' });
        walk(n.else || []);
        out.push({ t: '__sep_end' });
      } else out.push(n);
    });
  }
  walk(SCRIPT);
  return out;
}

/* 展開版で選択肢パターン別の到達エンドを確認 */
{
  // 展開版SCRIPT2: ifをindex 2択で解決できる形式にする
  // then/elseを連続配置し、__sep_*で範囲を把握
  const S2 = [];
  const jumps = [];
  function walk(nodes) {
    nodes.forEach(n => {
      if (n.t === 'if') {
        const condIdx = S2.length;
        S2.push({ ...n });
        // then
        const thenStart = S2.length;
        walk(n.then);
        const elseStart = S2.length;
        walk(n.else || []);
        const endMark = S2.length;
        jumps[condIdx] = { thenStart, elseStart, end: endMark };
      } else S2.push(n);
    });
  }
  walk(SCRIPT);
  global.__S2 = S2; global.__JUMPS = jumps;

  const LABELS2 = {};
  S2.forEach((n, i) => { if (n.t === 'label') LABELS2[n.name] = i; });

  function simulate2(choiceIdx, pick) {
    const st = freshState();
    let i = 0, steps = 0;
    const visitedHub = {};
    while (i < S2.length && steps++ < 40000) {
      const n = S2[i];
      if (n.t === 'choice') {
        const idx = pick ? pick(n, i) : Math.min(choiceIdx, n.opts.length - 1);
        const op = n.opts[idx];
        applyEffects(st, op);
        i = op.goto ? LABELS2[op.goto] : i + 1;
        continue;
      }
      if (n.t === 'hub') {
        const next = ['A', 'B', 'C', 'D', 'E', 'F'].find(k => !visitedHub[k]);
        if (next) { visitedHub[next] = true; i = LABELS2[M.ROUTES[next].label]; continue; }
        i = LABELS2.convergence_start; continue;
      }
      if (n.t === 'hub_done') { st.vars.hubDone[n.k] = true; i++; continue; }
      if (n.t === 'point') { st.heart = Math.max(-10, Math.min(40, st.heart + n.v)); i++; continue; }
      if (n.t === 'flag') { st.flags[n.k] = (st.flags[n.k] || 0) + n.v; i++; continue; }
      if (n.t === 'joke') { st.jokes += n.v || 1; i++; continue; }
      if (n.t === 'jump') { i = LABELS2[n.to]; continue; }
      if (n.t === 'if') {
        let cond = false;
        try { cond = !!n.cond(st); } catch (e) {}
        const j = jumps[i];
        i = cond ? j.thenStart : j.elseStart;
        continue;
      }
      if (n.t === '__jump_if_done') { i++; continue; }
      if (n.t === 'end') return { end: n.id, st };
      if (n.t === 'branch_end') return { end: computeEnding(st), st };
      if (n.t === 'staffroll') return { end: '(staffroll後タイトル)', st };
      i++;
    }
    return { end: '(ループ/未到達)', st };
  }

  function computeEnding(st) {
    const f = st.flags;
    const candidates = [
      ['good_mie', 'MIE'], ['good_satou', 'SATOU'], ['good_rei', 'REI'], ['good_terachi', 'TERACHI'],
      ['good_ryoma', 'RYOMA'], ['good_minamitou', 'MINAMITOU'],
      ['good_meshino', 'MESHINO_KURAISHI', 'meshino'], ['good_kuraishi', 'MESHINO_KURAISHI', 'kuraishi'],
      ['good_izaki', 'IZAKI_IZUMI']
    ];
    if (f.RYOMA >= 4 && st.jokes >= 2 && st.heart >= 12 && st.heart <= 17) return 'end_comedy';
    if (st.heart >= 24 && Object.keys(f).filter(k => f[k] >= 3).length >= 6) return 'end_true';
    if (st.heart >= 18) {
      let best = null, bestV = 3;
      candidates.forEach(c => {
        let v = f[c[1]] || 0;
        if (c[2] === 'meshino' && st.vars.meshinoSide < st.vars.kuraishiSide) v = 0;
        if (c[2] === 'kuraishi' && st.vars.kuraishiSide < st.vars.meshinoSide) v = 0;
        if (v > bestV) { bestV = v; best = c[0]; }
      });
      return best || 'end_normal';
    }
    if (st.heart >= 12) return 'end_normal';
    return 'end_bittersweet';
  }

  console.log('--- 選択肢シミュレーション ---');
  for (let c = 0; c < 3; c++) {
    const r = simulate2(c);
    console.log(`  常に選択肢${c + 1} -> ${r.end}　heart=${r.st.heart} flags=${JSON.stringify(r.st.flags)} jokes=${r.st.jokes}`);
  }
  // 茶化し極限（COMEDYルート確認）：F編でjoke選択、心を中間に
  const jokeRun = simulate2(1, (n) => {
    // 各選択肢で heart負/低めを優先しつつ、jokeありなら必ず選ぶ
    const jk = n.opts.findIndex(o => o.joke);
    return jk >= 0 ? jk : n.opts.findIndex(o => (o.heart || 0) < 0) >= 0 ? n.opts.findIndex(o => (o.heart || 0) < 0) : n.opts.length - 1;
  });
  console.log(`  茶化し特化ルート -> ${jokeRun.end}　heart=${jokeRun.st.heart} jokes=${jokeRun.st.jokes}`);
}

/* ---------- 5. アセット実在検査 ---------- */
console.log('--- アセット検査 ---');
const assets = [];
Object.keys(M.BGS).forEach(k => assets.push(['bg', M.BGS[k].file]));
Object.keys(M.CGS).forEach(k => assets.push(['cg', M.CGS[k].file]));
Object.keys(M.CG_ENDS).forEach(k => assets.push(['cg_end', M.CG_ENDS[k].file]));
Object.keys(M.CHARS).forEach(w => {
  const cnt = (M.EXPR_LABELS[w] || []).length;
  for (let e = 1; e <= cnt; e++) assets.push(['chr', `chr/chr_${w}_${String(e).padStart(2, '0')}.png`]);
});
let missing = 0;
assets.forEach(([cat, file]) => {
  const p = path.join(ROOT, 'assets', file);
  if (!fs.existsSync(p)) { warn(`アセット不在: ${cat}/${file}`); missing++; }
});
console.log(`アセット参照数: ${assets.length}　不在: ${missing}`);

/* ---------- 6. 心Point上限 ---------- */
let maxHeart = 0, minHeart = 0;
SCRIPT.forEach(n => {
  if (n.t === 'point') { maxHeart += n.v; minHeart += n.v; }
  if (n.t === 'choice') {
    maxHeart += Math.max(...n.opts.map(o => o.heart || 0));
    minHeart += Math.min(...n.opts.map(o => o.heart || 0));
  }
});
console.log(`心Point概算: min=${minHeart} 〜 max=${maxHeart}（＋IF内ボーナスは別途）`);

console.log(errors ? `\n結果: ${errors}エラー / ${warns}警告` : `\n結果: エラーなし（警告${warns}件）`);
process.exit(errors ? 1 : 0);
