#!/usr/bin/env node
/* sync_placeholder.mjs — 実素材フォルダと台帳（data/assets.json）の同期・検証
 *
 * 背景: 画像の差し替えは「実ファイルを assets/{bg,chr,cg}/ に置く」＋「台帳の
 *       placeholder を false にする」の2点セット。片方だけやると
 *       ・ファイルがあるのにシルエット／等高線補完のまま（placeholder が true）
 *       ・ファイルが無いのに placeholder だけ false ＝ 404 で画像が壊れる
 *       という事故になる。この2つを機械的に突き合わせて、寸法・透過・容量も見る。
 *
 * 使い方:
 *   node tools/sync_placeholder.mjs              台帳を実在ファイルに合わせて更新（既定）
 *   node tools/sync_placeholder.mjs --check      更新せず報告だけ（CI用。ERROR があれば exit 1）
 *   node tools/sync_placeholder.mjs --bump       同期後に sw.js の CACHE を +1（v6 → v7）
 *   node tools/sync_placeholder.mjs --adopt-ext  実ファイルの拡張子（.webp/.jpg 等）を台帳の file に反映
 *   node tools/sync_placeholder.mjs --verbose    容量warnを1枚ずつ出す（既定は集計1行）
 *   node tools/sync_placeholder.mjs --no-size    寸法・透過・容量のチェックをしない
 *
 * 寸法の基準値は docs/ART_SPEC.md ／ tools/gen_asset_md.mjs の GEOM と共通（出典は下のコメント）。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LEDGER = 'data/assets.json';
const SW = 'sw.js';
const argv = process.argv.slice(2);
const has = (f) => argv.includes(f);
const CHECK = has('--check');
const BUMP = has('--bump');
const ADOPT_EXT = has('--adopt-ext');
const VERBOSE = has('--verbose');
const NO_SIZE = has('--no-size');

/* ---------------------------------------------------- 表示寸法の基準（実測） -- */
// css/vn.css:58-63  #viewport{aspect-ratio:16/9}  /  js/visual.js:630-636  --u = 幅/1000（横画面）
const STAGE = { w: 1000, h: 562.5 };                       // 舞台＝1000u × 562.5u
const STAGE_PX = { w: 1600, h: 900 };                      // 1600px幅の窓での実寸（u→px は ×1.6）
// css/vn.css:108 .chr{width:420u;height:640u;bottom:0} → 枠の上 77.5u（12.1%）は #viewport の外
const CHR_BOX = { w: 420, h: 640 };
const CHR_BOX_PX = { w: 672, h: 1024 };                    // = 420u×640u を 1600px幅の舞台で実寸に
const CROP_PCT = (CHR_BOX.h - STAGE.h) / CHR_BOX.h;        // 0.121
const SPEC = {
  bg:  { aspect: 16 / 9, min: [STAGE_PX.w, STAGE_PX.h], want: '1920×1080（16:9）', alpha: false },
  cg:  { aspect: 16 / 9, min: [STAGE_PX.w, STAGE_PX.h], want: '1920×1080（16:9）', alpha: false },
  chr: { aspect: CHR_BOX.w / CHR_BOX.h, altAspect: 3 / 4, min: [CHR_BOX_PX.w, CHR_BOX_PX.h],
         want: '840×1280（21:32）または 840×1120（3:4）', alpha: true },
};
const MAX_BYTES = 1.5 * 1024 * 1024;   // これを超えたら WebP を提案

/* ------------------------------------------------------------ 画像ヘッダ読み -- */
/** PNG / JPEG / WebP の寸法とアルファ有無だけをヘッダから読む（デコードはしない） */
export function imgInfo(file) {
  const b = fs.readFileSync(file);
  const ext = path.extname(file).toLowerCase();
  try {
    if (b.slice(1, 4).toString('latin1') === 'PNG') {
      const colorType = b[25];
      let alpha = colorType === 4 || colorType === 6;
      if (!alpha && colorType === 3) alpha = b.includes(Buffer.from('tRNS'));   // パレット透過
      return { w: b.readUInt32BE(16), h: b.readUInt32BE(20), alpha, kind: 'png' };
    }
    if (b[0] === 0xff && b[1] === 0xd8) {                                      // JPEG: SOF を歩く
      let o = 2;
      while (o + 9 < b.length) {
        if (b[o] !== 0xff) { o++; continue; }
        const m = b[o + 1];
        if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) {
          return { w: b.readUInt16BE(o + 7), h: b.readUInt16BE(o + 5), alpha: false, kind: 'jpeg' };
        }
        o += 2 + b.readUInt16BE(o + 2);
      }
      return null;
    }
    if (ext === '.webp' && b.slice(0, 4).toString('latin1') === 'RIFF' && b.slice(8, 12).toString('latin1') === 'WEBP') {
      const chunk = b.slice(12, 16).toString('latin1');
      const p = b.slice(20);                                                   // チャンク本体の先頭
      if (chunk === 'VP8X') return { w: 1 + p.readUIntLE(4, 3), h: 1 + p.readUIntLE(7, 3), alpha: !!(p[0] & 0x10), kind: 'webp' };
      if (chunk === 'VP8 ') {                                                  // 非可逆（アルファ無し）
        const o = p.indexOf(0x2a);                                             // 同期コード 9d 01 2a の直後
        if (o > 2) return { w: p.readUInt16LE(o + 1) & 0x3fff, h: p.readUInt16LE(o + 3) & 0x3fff, alpha: false, kind: 'webp' };
      }
      if (chunk === 'VP8L' && p[0] === 0x2f) {                                 // 可逆
        const bits = p.readUInt32LE(1);
        return { w: 1 + (bits & 0x3fff), h: 1 + ((bits >> 14) & 0x3fff), alpha: !!((bits >> 28) & 1), kind: 'webp' };
      }
    }
  } catch (_) { /* ヘッダが読めなければ寸法チェックだけスキップ */ }
  return null;
}

/* ------------------------------------------------------------------ ユーティ -- */
const kb = (n) => n > 1024 * 1024 ? (n / 1024 / 1024).toFixed(1) + 'MB' : Math.round(n / 1024) + 'KB';
const near = (a, b, tol = 0.03) => Math.abs(a - b) / b <= tol;
const stemOf = (f) => path.posix.join(path.dirname(f), path.basename(f, path.extname(f)));

/* --------------------------------------------------------------------- 本体 -- */
const rawLedger = fs.readFileSync(path.join(ROOT, LEDGER), 'utf8');
const ledger = JSON.parse(rawLedger);
const rows = ledger.assets || [];

/** 台帳が指すフォルダ（assets/bg 等）に実在する画像を全部拾う */
const dirs = [...new Set(rows.map(a => path.dirname(a.file)))];
const IMG_EXT = ['.png', '.jpg', '.jpeg', '.webp', '.avif', '.gif'];
const onDisk = new Map();     // stem → 実ファイル（相対）
for (const d of dirs) {
  const abs = path.join(ROOT, d);
  if (!fs.existsSync(abs)) continue;
  for (const f of fs.readdirSync(abs)) {
    if (!IMG_EXT.includes(path.extname(f).toLowerCase())) continue;
    onDisk.set(stemOf(path.posix.join(d, f)), path.posix.join(d, f));
  }
}

const actions = [];    // 台帳に書き込んだ変更
const errors = [];     // 画面が壊れる（exit 1 対象）
const warns = [];      // 動くが直したほうがいい
const heavy = [];      // 容量オーバー（既定は集計して1行）
const count = { real: 0, hole: 0 };
let crop2132 = 0;      // 21:32 で入って「上が切れる」構図の立ち絵枚数

for (const a of rows) {
  const stem = stemOf(a.file);
  const hit = onDisk.get(stem);
  const ledgerExt = path.extname(a.file);

  // (D) 拡張子だけ違う（.png のつもりで .webp を置いた 等）
  if (hit && path.extname(hit) !== ledgerExt) {
    if (ADOPT_EXT && !CHECK) {
      a.file = stem + path.extname(hit);
      actions.push(`${a.id}: file を ${ledgerExt} → ${path.extname(hit)}（実ファイルに合わせた）`);
    } else {
      warns.push(`${a.id}: 台帳は \`${a.file}\` だが実ファイルは \`${hit}\` ― 台帳の file を直すか \`--adopt-ext\` で自動反映`);
    }
  }

  const file = path.join(ROOT, a.file);
  if (fs.existsSync(file)) {
    if (a.placeholder !== false) {
      if (CHECK) warns.push(`${a.id}: 実ファイルがあるのに placeholder が true のまま（画面は補完SVGのまま出ます）`);
      else { a.placeholder = false; actions.push(`${a.id}: placeholder true → false（\`${a.file}\` を検出）`); }
    }
    count.real++;
    if (!NO_SIZE) sizeCheck(a, file);
  } else if (a.placeholder === false) {
    errors.push(`${a.id}: placeholder が false なのに \`${a.file}\` が無い → 404 で画像が壊れます`);
  } else count.hole++;
}

/** 寸法・縦横比・透過・容量を SPEC と突き合わせる */
function sizeCheck(a, file) {
  const spec = SPEC[a.cat];
  const bytes = fs.statSync(file).size;
  if (bytes > MAX_BYTES) heavy.push({ id: a.id, bytes, file: a.file });
  const info = imgInfo(file);
  if (!info) { warns.push(`${a.id}: 寸法を読めません（対応は PNG / JPEG / WebP）`); return; }
  if (bytes > MAX_BYTES && VERBOSE) warns.push(`${a.id}: ${kb(bytes)}（${info.w}×${info.h}）は重め ― WebP 推奨`);
  if (!spec) return;
  const r = info.w / info.h;
  const okAspect = near(r, spec.aspect) || (spec.altAspect && near(r, spec.altAspect));
  if (!okAspect) {
    warns.push(`${a.id}: ${info.w}×${info.h}（比 ${r.toFixed(3)}）は推奨比と違います ― 推奨 ${spec.want}` +
      (a.cat === 'chr'
        ? `。比がズレると object-fit:contain で枠内に余白が出ます（21:32=0.656／3:4=0.750）`
        : `。object-fit:cover なので端が切れます（16:9=1.778）`));
  }
  if (info.w < spec.min[0] || info.h < spec.min[1]) {
    warns.push(`${a.id}: ${info.w}×${info.h} は描画寸法 ${spec.min[0]}×${spec.min[1]}px 未満 → 拡大されて甘くなります（推奨 ${spec.want}）`);
  }
  if (spec.alpha && !info.alpha) {
    warns.push(`${a.id}: 透過情報がありません（${info.kind}）。立ち絵は透過が正解 ― 白背景のまま使うなら CONFIG「画像合成」=multiply が必要`);
  }
  if (!spec.alpha && info.alpha && info.kind === 'png') {
    warns.push(`${a.id}: 全面描きの素材にアルファがあります（cover で全画面なので透過は無意味＝容量増）`);
  }
  if (a.cat === 'chr' && near(r, CHR_BOX.w / CHR_BOX.h)) crop2132++;
}

/* (C) 台帳に無い実ファイル＝孤児 */
const ledgerStems = new Set(rows.map(a => stemOf(a.file)));
const orphans = [...onDisk.entries()].filter(([stem]) => !ledgerStems.has(stem));

/* --------------------------------------------------------------- CACHE bump -- */
let bumped = null;
if (BUMP && !CHECK) {
  const swPath = path.join(ROOT, SW);
  let sw = fs.readFileSync(swPath, 'utf8');
  const m = sw.match(/const CACHE = '([a-z-]*v)(\d+)'/i);
  if (!m) errors.push('sw.js の CACHE 行を読めません（手動で上げてください）');
  else {
    const name = `${m[1]}${Number(m[2]) + 1}`;
    const line = `      ${name}: ${new Date().toISOString().slice(0, 10)} 実素材の同期（tools/sync_placeholder.mjs --bump）。`;
    // ヘッダコメントの末尾（`*/` の直前）に履歴を1行足してから版本号を上げる
    const at = sw.indexOf('const CACHE');
    sw = sw.slice(0, at).replace(/[ \t]*\*\/\s*$/, `\n${line} */\n`) + sw.slice(at);
    sw = sw.replace(/const CACHE = '[^']+';/, `const CACHE = '${name}';`);
    fs.writeFileSync(swPath, sw);
    bumped = `${m[1]}${m[2]} → ${name}`;
  }
}

/* ------------------------------------------------------------------ 書き戻し -- */
const nextJson = JSON.stringify(ledger, null, 1);   // 既存と同じ書式（末尾改行なし）
const changed = nextJson !== rawLedger;
if (changed && !CHECK) fs.writeFileSync(path.join(ROOT, LEDGER), nextJson);

/* -------------------------------------------------------------------- 報告 -- */
const L = (s = '') => console.log(s);
L(`同期対象: ${rows.length} 行（${dirs.join(' / ')}）  実画像 ${count.real} ・未配置 ${count.hole}`);
if (actions.length) {
  L(''); L(`■ 台帳を更新（${actions.length} 行）${CHECK ? ' ― ※ --check なので書き込んでいません' : ''}`);
  actions.forEach(s => L(`  + ${s}`));
} else if (!CHECK) L('■ 台帳の更新: なし（実ファイルと台帳は一致）');
if (orphans.length) {
  L(''); L(`■ 台帳に無い実ファイル（${orphans.length} 件）― 台帳に行を足す（id ＝ ファイル名 stem が規則）か削除`);
  orphans.forEach(([, p]) => L(`  ? ${p}`));
}
if (errors.length) { L(''); L(`■ ERROR（${errors.length}）― 画面が壊れます`); errors.forEach(s => L(`  × ${s}`)); }
if (warns.length) { L(''); L(`■ WARN（${warns.length}）`); warns.forEach(s => L(`  ! ${s}`)); }
if (heavy.length && !VERBOSE) {
  const total = heavy.reduce((n, x) => n + x.bytes, 0);
  const max = heavy.reduce((a, b) => b.bytes > a.bytes ? b : a);
  L(''); L(`■ 容量: ${heavy.length} 枚が ${kb(MAX_BYTES)} 超（合計 ${(total / 1024 / 1024).toFixed(1)}MB・最大 ${max.id} ${kb(max.bytes)}）`);
  L(`  → WebP 化で 1/4〜1/6 になります（docs/ART_SPEC.md「形式と容量」）。1枚ずつ見るには --verbose`);
}
if (crop2132) {
  L(''); L(`■ 構図注意: 21:32 の立ち絵が ${crop2132} 枚 ― 横画面（16:9）では上 ${(CROP_PCT * 100).toFixed(1)}% が画面外です`);
  L(`  → 840×1280 なら上 155px は余白にして頭頂を y≧163px に。全身を見せたいなら 3:4（840×1120）で ― docs/ART_SPEC.md`);
}
if (bumped) { L(''); L(`■ sw.js の CACHE を更新: ${bumped}`); }
else if (!CHECK && (changed || actions.length)) {
  const now = (fs.readFileSync(path.join(ROOT, SW), 'utf8').match(/const CACHE = '([^']+)'/) || [])[1];
  L(''); L(`■ 次にやること: sw.js の CACHE（現在 ${now}）を上げる ― \`node tools/sync_placeholder.mjs --bump\` で自動`);
}
if (changed && CHECK) { L(''); L('※ --check: 台帳に書き込むべき差分があります（上の「台帳を更新」参照）'); }

process.exit(errors.length ? 1 : 0);
