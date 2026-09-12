/* ============================================================
   スクリプト整合性チェック (node tools/check_script.js)
   ― 参照アセット・遷移先・Flag参照の検証
   ============================================================ */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..");
const ctx = {
  window: { SCENES: {}, TIPS: {}, CHARS: {}, ASSET_MANIFEST: null },
  console,
};
ctx.window.window = ctx.window;
vm.createContext(ctx);

function load(rel) {
  const file = path.join(ROOT, rel);
  vm.runInContext(fs.readFileSync(file, "utf8"), ctx, { filename: rel });
}
load("game/js/assets_manifest.js");
load("game/js/characters.js");
["script_00_common.js", "script_01_routes_abc.js", "script_02_routes_cef.js", "script_03_climax.js", "script_04_endings.js"]
  .forEach(f => load("game/js/" + f));

const MAN = ctx.window.ASSET_MANIFEST;
const SCENES = ctx.window.SCENES;
const TIPS = ctx.window.TIPS;
const CHARS = ctx.window.CHARS;

let errors = 0, warns = 0;
function err(msg) { console.error("  ✗ " + msg); errors++; }
function warn(msg) { console.warn("  △ " + msg); warns++; }

/* --- アセット存在チェック用 --- */
function hasBG(id) { return !!MAN.bg[id]; }
function hasCG(id) { return !!(MAN.cg[id] || MAN.ed_cg[id]); }
// UI画像は2026-09-12に撤去（CSS/SVG描画で代替）。frame参照の検証は不要になった。
function chrExprCount(who) { return MAN.chr[who] ? MAN.chr[who].exprs.length : 0; }

/* --- 遷移グラフ構築 --- */
const sceneIds = Object.keys(SCENES);
console.log(`scenes: ${sceneIds.length}`);
console.log(`tips: ${Object.keys(TIPS).length}`);
console.log(`chars: ${Object.keys(CHARS).length}`);
console.log(`assets: bg=${Object.keys(MAN.bg).length} chr=${Object.values(MAN.chr).reduce((a, c) => a + c.exprs.length, 0)} cg=${Object.keys(MAN.cg).length} ed=${Object.keys(MAN.ed_cg).length}`); // 2026-09-12: 予備(reserve)・spareは廃止（白紙削除・UI撤去済み）

const edges = []; // [from, to]
let totalCmds = 0, totalText = 0, totalSay = 0;
const choices = [];

for (const [sid, scene] of Object.entries(SCENES)) {
  if (!scene.title) warn(`${sid}: title なし`);
  if (!Array.isArray(scene.data) || !scene.data.length) { err(`${sid}: data なし`); continue; }
  scene.data.forEach((cmd, idx) => {
    totalCmds++;
    const t = cmd[0];
    if (["say", "nar", "mono", "voice"].includes(t)) totalText += String(t === "nar" ? cmd[1] : cmd[2]).length;
    if (t === "say") {
      totalSay++;
      if (!CHARS[cmd[1]]) err(`${sid}[${idx}] say: 未定義キャラ '${cmd[1]}'`);
    }
    if (t === "mono" || t === "voice") {
      if (!CHARS[cmd[1]]) err(`${sid}[${idx}] ${t}: 未定義キャラ '${cmd[1]}'`);
    }
    if (t === "bg" && !hasBG(cmd[1])) err(`${sid}[${idx}] bg: 不明 '${cmd[1]}'`);
    if (t === "cg" && !hasCG(cmd[1])) err(`${sid}[${idx}] cg: 不明 '${cmd[1]}'`);
    if (t === "chr") {
      if (!CHARS[cmd[1]]) err(`${sid}[${idx}] chr: 未定義キャラ '${cmd[1]}'`);
      else if (cmd[2] < 1 || cmd[2] > chrExprCount(cmd[1])) err(`${sid}[${idx}] chr: '${cmd[1]}' 表情${cmd[2]} は範囲外 (1-${chrExprCount(cmd[1])})`);
    }
    if (t === "ex") {
      if (!CHARS[cmd[1]]) err(`${sid}[${idx}] ex: 未定義キャラ '${cmd[1]}'`);
      else if (cmd[2] < 1 || cmd[2] > chrExprCount(cmd[1])) err(`${sid}[${idx}] ex: '${cmd[1]}' 表情${cmd[2]} は範囲外`);
    }
    if (t === "tips" && !TIPS[cmd[1]]) err(`${sid}[${idx}] tips: 未定義 '${cmd[1]}'`);
    if (t === "jump") {
      if (!SCENES[cmd[1]]) err(`${sid}[${idx}] jump: 不明シーン '${cmd[1]}'`);
      else edges.push([sid, cmd[1]]);
    }
    if (t === "iflast" || t === "ifch1") {
      const tbl = cmd.slice(1);
      for (let i = 1; i < tbl.length; i += 2) {
        if (!SCENES[tbl[i]]) err(`${sid}[${idx}] ${t}: 不明シーン '${tbl[i]}'`);
        else edges.push([sid, tbl[i]]);
      }
    }
    if (t === "branch") {
      const b = cmd[1];
      for (const key of ["then", "else"]) {
        if (!b[key]) { if (key === "then") err(`${sid}[${idx}] branch.then なし`); continue; }
        b[key].forEach((c2, j) => {
          if (c2[0] === "jump" && !SCENES[c2[1]]) err(`${sid}[${idx}] branch.${key}[${j}]: 不明シーン`);
        });
      }
    }
    if (t === "bbs" || t === "stream") {
    }
    if (t === "choice") {
      const cfg = cmd[1];
      if (!cfg.opts || !cfg.opts.length) err(`${sid}[${idx}] choice: opts なし`);
      else {
        cfg.opts.forEach((o, i) => {
          choices.push({ scene: sid, label: o.label, heart: o.heart || 0 });
          if (o.flags) for (const k of Object.keys(o.flags)) {
            if (!["MIE","SATOU","REI","TERACHI","RYOMA","MINAMITOU","MESHINO","IZAKI"].includes(k))
              err(`${sid}[${idx}] choice: 不明Flag '${k}'`);
          }
          if (o.side && !["meshino", "kuraishi"].includes(o.side)) err(`${sid}[${idx}] choice: 不明side`);
        });
      }
    }
    if (t === "ending") {
      const id = cmd[1] === "auto" ? "(auto)" : cmd[1];
      if (cmd[1] !== "auto" && !SCENES["end_" + cmd[1]]) err(`${sid}[${idx}] ending: 不明 '${cmd[1]}'`);
    }
  });
}

/* --- 遷移の到達性 --- */
// プロローグから全シーンへ到達できるか (hub選択先・ending auto先を含む)
const ROUTE_SCENES = ["a1", "b1", "c1", "d1", "e1", "f1"];
const END_IDS = ["true","mie","satou","rei","terachi","ryoma","izaki","meshino","kuraishi","minamitou","normal","bitter","comedy","bonus"];
const adj = {};
for (const [f, t] of edges) (adj[f] = adj[f] || new Set()).add(t);
// hub → 各ルート / end0 → 各ED / 会話フローはlinearなのでjumpベースで概算到達
const startEdges = ["prologue"];
adj["hub"] = adj["hub"] || new Set();
ROUTE_SCENES.forEach(s => adj["hub"].add(s));
adj["hub"].add("g1");
adj["end0"] = adj["end0"] || new Set();
END_IDS.forEach(e => adj["end0"].add("end_" + e));

const seen = new Set(["prologue"]);
const q = ["prologue"];
while (q.length) {
  const cur = q.shift();
  for (const nx of (adj[cur] || [])) {
    if (!seen.has(nx)) { seen.add(nx); q.push(nx); }
  }
}
const unreachable = sceneIds.filter(s => !seen.has(s) && s !== "end_bonus");
if (unreachable.length) warn("プロローグから到達不能(直接ジャンプのみで問題なければOK): " + unreachable.join(", "));
if (!SCENES.end_bonus) err("end_bonus なし");
if (!SCENES.hub) err("hub なし");

/* --- 全EDシーン存在 --- */
for (const e of END_IDS) if (!SCENES["end_" + e]) err(`end_${e} が存在しない`);

/* --- 統計 --- */
console.log(`\ncommands: ${totalCmds} / 台詞・地の文 ${totalText}字 / say ${totalSay}回 / 選択肢 ${choices.length}件`);
const maxHeart = choices.filter(c => c.heart > 0).reduce((a, c) => a + c.heart, 0);
console.log(`選択肢経由の心Point最大値: +${maxHeart} (固定ゲイン[gain]は別)`);

console.log("\n" + (errors === 0 ? `✔ エラー0件 (警告${warns}件) ― 整合性OK` : `✘ エラー${errors}件`));
process.exit(errors ? 1 : 0);
