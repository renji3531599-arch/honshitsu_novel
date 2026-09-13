#!/usr/bin/env node
/* ============================================================================
   gen_asset_md.mjs — 画像素材 README 生成器
   ----------------------------------------------------------------------------
   `data/assets.json`（台帳）と `data/script/*.txt`（本編DSL）と実ファイルの
   ヘッダを突き合わせて、「1素材ずつ・改行つきで・どこでどう出るか」を書く。
   出力:
     assets/README.md          … 総合（早見・共通仕様・差し替え手順）
     assets/bg/README.md       … 背景 25
     assets/cg/README.md       … CG 32
     assets/chr/README.md      … 立ち絵（キャラごとにまとめる）
     docs/CG_GUIDE.md          … CG 全32枚（名場面18＋ED14）を「物語順」にまとめたガイド
   手編集せず、台帳を直して `node tools/gen_asset_md.mjs` で再生成。
   ※ 2026-09-12(3): 本編CGの番号スロット（cg02等）は廃止。bgと同じ「ID＝ファイル名
     （拡張子なし）」の実名に統一（例: cg_chizutsutsu_kobore_shashin）。
   ========================================================================== */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const rd = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const exists = (p) => fs.existsSync(path.join(ROOT, p));

/* ----------------------------------------------------------- 台帳・メタ ---- */
const ledger = JSON.parse(rd('data/assets.json'));
const meta = JSON.parse(rd('data/meta.json'));
const ASSETS = ledger.assets.slice();
// タイトルキービジュアル：台帳に既にある場合は足さない（二重計上防止）
if (!ASSETS.some(a => a.id === 'title_key')) ASSETS.push({
  id: 'title_key', cat: 'bg', file: 'assets/bg/title_key.jpg',
  label: 'タイトルキービジュアル（夕方の教室）',
  desc: 'タイトル画面の背景。`TOUCH TO START` の後ろに静かに揺れる。',
  meta: 'title/key', source: '-（実写合成）', placeholder: false,
});

const byId = new Map(ASSETS.map(a => [a.id, a]));
const byStem = new Map(ASSETS.map(a => [path.basename(a.file).replace(/\.\w+$/, ''), a]));
/** 脚本の `@bg bg_xxx` / `@bg BG01` どちらでも引けるようにする */
const lookup = (key) => byId.get(key) || byStem.get(key) || null;

/* ------------------------------------------------------------ 実寸・容量 ---- */
function imgInfo(rel) {
  const p = path.join(ROOT, rel);
  if (!exists(rel)) return { dim: '—（未配置）', bytes: '—' };
  const st = fs.statSync(p);
  let dim = '?×?';
  try {
    const b = fs.readFileSync(p);
    if (b.slice(1, 4).toString('latin1') === 'PNG') dim = `${b.readUInt32BE(16)}×${b.readUInt32BE(20)}`;
    else if (b[0] === 0xff && b[1] === 0xd8) {           // JPEG: SOF マーカーを歩く
      let o = 2;
      while (o + 9 < b.length) {
        if (b[o] !== 0xff) { o++; continue; }
        const m = b[o + 1];
        if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) {
          dim = `${b.readUInt16BE(o + 7)}×${b.readUInt16BE(o + 5)}`; break;
        }
        o += 2 + b.readUInt16BE(o + 2);
      }
    }
  } catch (_) { /* 読めないなら ?×? のまま */ }
  return { dim, bytes: st.size < 1024 ? `${st.size}B` : `${(st.size / 1024).toFixed(0)}KB` };
}

/* ------------------------------------------------------- 脚本のパース ---- */
const scriptFiles = rd('data/script/index.txt').split('\n').map(s => s.trim())
  .filter(s => s && !s.startsWith(';') && !s.startsWith('#'));

/** assetKey -> 使用箇所の一覧 */
const usage = { bg: new Map(), cg: new Map() };
/** 'slug|expr' -> 使用箇所 */
const chrUsage = new Map();
const note = (map, key, rec) => { if (!key) return; if (!map.has(key)) map.set(key, []); map.get(key).push(rec); };

for (const f of scriptFiles) {
  const rel = `data/script/${f}`;
  if (!exists(rel)) continue;
  const lines = rd(rel).split('\n');
  let chapter = null, scene = null, curBg = null, curChr = [], openCg = null;
  const where = (i) => ({ file: rel, line: i + 1, chapter, scene });
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const s = raw.trim();
    let m;
    if ((m = s.match(/^#chapter\s+(\S+)\s*\|\s*([^|]+?)(?:\|.*)?$/))) { chapter = { id: m[1], title: m[2].trim() }; continue; }
    if ((m = s.match(/^#scene\s+(\S+)\s*\|\s*(.+)$/))) { scene = { id: m[1], title: m[2].trim() }; continue; }
    if ((m = s.match(/^@bg\s+(\S+)/))) {
      const a = lookup(m[1]);
      curBg = a || null;
      note(usage.bg, a && a.id, { ...where(i), at: `@bg ${m[1]}` });
      continue;
    }
    if (/^@bg\s+off/.test(s)) { curBg = null; continue; }
    if ((m = s.match(/^@chr\s+(.+)$/))) {
      if (/clear/.test(m[1])) { curChr = []; }
      else {
        curChr = [];
        for (const part of m[1].split(',')) {
          const p = part.trim().split('=');
          if (p.length < 2) continue;
          const expr = p[1].padStart(2, '0');
          curChr.push(`${p[0]}=${expr}`);
          note(chrUsage, `${p[0]}|${expr}`, { ...where(i), at: s });
        }
      }
      continue;
    }
    if ((m = s.match(/^@cg\s+(\S+)(.*)$/))) {
      if (m[1] === 'off') {
        if (openCg) { openCg.to = i; closeCg(); }
        continue;
      }
      const a = lookup(m[1]);
      if (openCg) { openCg.to = i; closeCg(); }          // 直接差し替え（dip）
      openCg = { asset: a, kb: /kb/.test(m[2]), ...where(i), at: s, before: prevSpeech(lines, i), inside: [], fx: [] };
      note(usage.cg, a && a.id, openCg);
      continue;
    }
    if (openCg) {
      if (/^[^@;]{1,4}：/.test(s)) { if (openCg.inside.length < 3) openCg.inside.push(s); }
      else if (/^@?(fx|se|memo|item|tip|save|cnt|chat)\b/.test(s)) { if (openCg.fx.length < 4) openCg.fx.push(s); }
      else if (/^@jump|^@end|^#scene/.test(s)) { openCg.to = i; closeCg(); }
    }
  }
  if (openCg) { openCg.to = lines.length - 1; closeCg(); }
  function closeCg() {
    const c = openCg; openCg = null;
    c.chrList = curChr.slice(0, 4);
    c.bgId = curBg ? curBg.id : null;
  }
}
function prevSpeech(lines, i) {
  for (let k = i - 1; k >= 0 && k > i - 8; k--) {
    const t = lines[k].trim();
    if (/^[^@;]{1,4}：/.test(t)) return t;
  }
  return '';
}

/* --------------------------------------------------------- コード参照 ---- */
const CODE_FILES = ['js/visual.js', 'js/game.js', 'js/shell.js', 'js/main.js', 'js/store.js',
  'js/state.js', 'js/audio.js', 'js/text.js', 'js/parser.js', 'index.html', 'css/vn.css',
  'data/meta.json', 'data/terms.json'];
const codeCache = CODE_FILES.filter(exists).map(f => ({ f, src: rd(f) }));
/** id かファイル名stem が JS/CSS/HTML/台帳 から参照されている箇所（先頭3件） */
function codeRefs(a) {
  const stem = path.basename(a.file).replace(/\.\w+$/, '');
  const out = [];
  for (const { f, src } of codeCache) {
    const lines = src.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(stem) || (a.id.length > 3 && lines[i].includes(`'${a.id}'`)) || lines[i].includes(`"${a.id}"`)) {
        out.push(`${f}:${i + 1}`);
        if (out.length >= 3) return out;
      }
    }
  }
  return out;
}

/* ------------------------------------------------------------- 書式 helper -- */
const MOOD_LABEL = {
  asa: '朝（明るい寒色・光差し ON）', hiru: '昼（ニュートラル・光 ON）',
  yuugata: '夕方（オレンジ・光 WARM）', yoru: '夜（青み・光 OFF・ヴェール半枚）',
  akari: '灯り（室内灯・光 ON）', sepia: 'セピア（回想）', gensou: '幻想（褪色・暖）',
  sotsu: '卒業式（白熱・光 ON）',
};
/* 表示幾何（CSS/JS から実測した値。入稿仕様の正本は docs/ART_SPEC.md）
   #viewport{aspect-ratio:16/9}（css/vn.css:58-61）／--u = 幅/1000（js/visual.js:630-636） */
const GEOM = {
  stage: { w: 1000, h: 562.5 },                       // 舞台（単位 u）＝16:9
  stagePx: { w: 1600, h: 900 },                       // 1600px幅の窓での実寸
  chrBox: { w: 420, h: 640 },                         // css/vn.css:108 .chr
  chrBoxPx: { w: 672, h: 1024 },                      // ↑の実寸
  chrCrop: (640 - 562.5) / 640,                       // 枠の上 77.5u＝12.1% は #viewport の外
  txtCoverU: 197,                                     // テキスト窓＋ツールバーの高さ（#textwrap bottom 26u + #textbox 142u + ツールバー）
  txtCover: 197 / 562.5,                              // ↑は舞台の高さの 35%
  kbMax: 1.11,                                        // css/vn.css:134 Ken Burns の終端 scale
};
const CACHE_NOW = (rd('sw.js').match(/const CACHE = '([^']+)'/) || [])[1] || '(不明)';
const RECOMMEND = {
  bg: '1920×1080（16:9）／WebP か JPEG／`object-fit: cover` で全画面（最低 1600×900・既存実測 1672×941）',
  cg: '1920×1080（16:9）／WebP か JPEG／全面描き（透過しない）。Ken Burns で最大 1.11 倍になるので 1600×900 ちょうどは避ける',
  chr: '840×1280（21:32）・透過／全身を切りたくなければ 840×1120（3:4）。最低 672×1024',
  chrShort: '840×1280（21:32）透過・下揃え／全身を見せたいなら 840×1120（3:4）',
  ui: 'ロゴ 1200×480・枠 1280×720・アイコン 256〜512 正方形／透過PNG（※UI画像は2026-09-12に全撤去済み＝CSS/SVG描画）',
};
const whereStr = (u) => {
  const sc = u.scene ? `シーン \`${u.scene.id}\`「${u.scene.title}」` : 'シーン外';
  const ch = u.chapter ? `${u.chapter.title} / ` : '';
  return `${ch}${sc} ― \`${u.file.replace('data/script/', '')}:${u.line}\``;
};
const FB_TEXT = {
  bg: 'エンジンが等高線SVGで補完描画中（`backdropSVG`）',
  cg: 'CG面は暗色ベタのまま（差し替えまで1枚絵は出ない）',
  chr: 'エンジンがシルエットで補完描画中（`figureSVG`）',
};
const status = (a) => a.reserve
  ? '予備（`reserve: true`＝ギャラリー・回収枚数に数えない）'
  : (a.placeholder ? `スロット登録のみ（実ファイルは未配置）― ${FB_TEXT[a.cat] || ''}` : '● 実画像が乗っている');
const dimStr = (i) => `現 ${i.dim}・${i.bytes}`;
const dirOf = (a) => a.file.split('/')[1];

/* ============================== 各素材の解説ブロック ====================== */
function blockCg(a, opts = {}) {
  const hd = opts.hd || '###';
  const info = imgInfo(a.file);
  const L = [];
  L.push(`${hd} \`${a.id}\` ― ${a.label}`);
  L.push('');
  L.push(`- **ファイル**: \`${a.file}\`（${dimStr(info)}）`);
  L.push(`- **差し替え推奨**: ${RECOMMEND.cg}`);
  L.push(`- **状態**: ${status(a)}`);
  const us = usage.cg.get(a.id) || [];
  if (!us.length) {
    L.push(`- **出番**: 本編のどこからも呼ばれていない（\`@cg ${a.id}\` 指定なし）`);
  } else {
    us.forEach((u, n) => {
      const span = u.to ? `${u.line}→${u.to + 1}行（約${u.to + 1 - u.line}ライン表示）` : `${u.line}行で表示`;
      L.push(us.length > 1 ? `- **出番 ${n + 1}/${us.length}**: ${whereStr(u)}` : `- **出番**: ${whereStr(u)}`);
      L.push(`  - 指定: \`${u.at}\` ／ ${span}${u.kb ? ' ／ Ken Burns ON（26秒で 1.02→1.12）' : '／ Ken Burns なし（静止）'}`);
      if (u.bgId) {
        const b = byId.get(u.bgId);
        L.push(`  - そのときの背景: \`${u.bgId}\`${b ? ' ' + b.label : ''}`);
      }
      if (u.chrList && u.chrList.length) L.push(`  - 立ち絵（CGの裏に回る）: ${u.chrList.map(c => '`' + c + '`').join(' / ')}`);
      if (u.before) L.push(`  - 直前の台詞: ${u.before}`);
      if (u.inside.length) L.push(`  - 表示中に進む台詞: ${u.inside.map(t => shorten(t, 34)).join(' → ')}`);
      if (u.fx.length) L.push(`  - 同時に走る演出: ${u.fx.map(t => '`' + t + '`').join(' ')}`);
    });
  }
  // ENDカードCGは条件を添える
  const end = Object.entries(meta.endings || {}).find(([, v]) => v.cg === a.id);
  if (end) {
    L.push(`- **対応エンド**: ${end[1].tier}「${end[1].label}」（\`@end ${end[0]}\`）`);
    L.push(`  - 到達条件: ${end[1].cond}`);
  }
  if (RESERVE_REASON[a.id]) L.push(`- **降板の理由**: ${RESERVE_REASON[a.id]}`);
  const refs = codeRefs(a).filter(r => !r.endsWith('css/vn.css'));
  if (refs.length) L.push(`- **エンジン側の参照**: ${refs.map(r => '`' + r + '`').join(' / ')}`);
  L.push('');
  return L.join('\n');
}
function blockBg(a) {
  const info = imgInfo(a.file);
  const L = [];
  const kind = (a.meta || '').split('/')[0], moodKey = (a.meta || '').split('/')[1];
  L.push(`### \`${a.id}\` ― ${a.label}`);
  L.push('');
  L.push(`- **ファイル**: \`${a.file}\`（${dimStr(info)}）`);
  L.push(`- **差し替え推奨**: ${RECOMMEND.bg}`);
  L.push(`- **状態**: ${status(a)}`);
  if (moodKey) L.push(`- **時間帯トーン**: \`${a.meta}\` → ${MOOD_LABEL[moodKey] || moodKey}（\`js/visual.js MOODS\`` + '）' + '、`@bg` 指定で自動追従');
  if (!a.placeholder) L.push(`- **補完SVG**: 出ない（実画像が乗っているので \`#stage[data-art="real"]\` になり、SVG側は空になる）`);
  else if (kind) L.push(`- **下地の種類**: \`backdropSVG\` の \`${kind}\` パターンで補完描画（等高線・窓・照明の配置が変わる）`);
  const us = usage.bg.get(a.id) || [];
  if (!us.length) {
    L.push(`- **出番**: 脚本から \`@bg\` 指定なし（タイトル背景など、エンジン側だけを使う）`);
  } else {
    L.push(`- **使用回数**: 本編 ${us.length} 箇所`);
    us.slice(0, 5).forEach(u => L.push(`  - ${whereStr(u)}`));
    if (us.length > 5) L.push(`  - …ほか ${us.length - 5} 箇所`);
    const cgs = ASSETS.filter(x => x.cat === 'cg' && (usage.cg.get(x.id) || []).some(u => u.bgId === a.id));
    if (cgs.length) L.push(`- **この背景まわりのCG**: ${cgs.map(x => '`' + x.id + '`').join(' / ')}`);
  }
  const refs = codeRefs(a);
  if (refs.length) L.push(`- **エンジン側の参照**: ${refs.map(r => '`' + r + '`').join(' / ')}`);
  L.push('');
  return L.join('\n');
}
function blockChr(a) {
  const info = imgInfo(a.file);
  const slug = a.meta || path.basename(a.file).split('_')[1];
  const expr = (path.basename(a.file).match(/_(\d\d)_/) || [])[1] || '01';
  const us = chrUsage.get(`${slug}|${expr}`) || [];
  const L = [];
  const tail = a.placeholder ? '' : `　※ ${status(a)}`;
  L.push(`- **${padExpr(expr)} ${exprLabel(a.label)}** ― \`@chr ${slug}=${expr}\` ／ \`${path.basename(a.file)}\`${tail}`);
  L.push(us.length
    ? `  本編 **${us.length} 回**。初出 \`${path.basename(us[0].file, '.txt')}:${us[0].line}\`${us[0].scene ? '（' + us[0].scene.title + '）' : ''}${us.length > 1 ? ' → ほか ' + (us.length - 1) + ' 回' : ''}`
    : `  本編で **未使用**（この番号を呼んでいる行がない）。素材は用意済みなので、脚本に1行足せばそのまま出る`);
  return L.join('\n');
}
const padExpr = (e) => '①②③④⑤⑥⑦⑧⑨⑩'[Number(e) - 1] || e;
const exprLabel = (label) => {
  const i = String(label).indexOf(' ');
  return i > 0 ? label.slice(i + 1) : label;
};
const shorten = (t, n) => t.length > n ? t.slice(0, n) + '…' : t;

/* 予備枠に落とした理由（docs/PERF_2026-09-11.md §4 と対） */
const RESERVE_REASON = {
  cg04: '2026-09-11 の整理で降板。勝也の硬い表情は直前の `@chr katsuya=06` が担うので1枚絵は過剰だった',
  cg08: '同左。零のPCの光＝氛围カット。同じルートの決定瞬間（cg09）に1枚を残す方針',
  cg11: '同左。「暴露じゃなくて、ありがとうの会」の頷き合いは3人の立ち絵で足りた',
  cg15: '同左。報告の続きの台詞受け渡しで、見せる新情報がない',
  cg21: '同左。両馬が「見せない」と言った落書きなので、逆に cg22 の完成図を被せたほうが効く',
  cg24: '同左。絶句は `@chr katsuya=04` で足りる',
  cg25: '同左。「先生、聞いていいですか」はミディアムショットでなく立ち絵で',
  cg32: '同左。朗読の立ち上がり（ピークの cg33 は残した）',
  cg36: '同左。`cg_end_true` と同一構図の二重表示になっていた',
  cg37: '同左。おまけ3行のハモり（ギャグに1枚絵は過剰）',
  cg38: '同左。`cg_end_ryoma` に統合（ENDは1シーン1枚）',
};

/** 物語順のCG解説：章が変わるところに ## 見出しを立てる */
function cgStorySections(list) {
  const out = []; let cur = null, n = 0;
  for (const a of list) {
    const u = (usage.cg.get(a.id) || [])[0];
    const chId = u && u.chapter ? u.chapter.id : '(章指定なし)';
    if (chId !== cur) {
      cur = chId; n++;
      out.push(`\n### ${n}. ${u && u.chapter ? u.chapter.title : chId}\n\n` +
        `_${u && u.chapter ? u.chapter.title : ''}（\`#chapter ${chId}\`）― この章で ${list.filter(x => { const v = (usage.cg.get(x.id) || [])[0]; return v && v.chapter && v.chapter.id === chId; }).length} 枚使用_\n`);
    }
    out.push(blockCg(a, { hd: '####' }));
  }
  return out.join('\n');
}

/* =============================================================== 出力 ---- */
const head = (title, lead, total) => `# ${title}

${Array.isArray(lead) ? lead.join('\n') : lead}

> 生成: \`node tools/gen_asset_md.mjs\`（生成日は入れない ― 出力をバイト単位で再現可能にして CI の差分検査を安定させる）／総数 ${total} ファイル／正本は台帳 \`data/assets.json\`
> ここに並ぶ説明は台帳と本編DSLから機械的に拾っている。直すべきは台帳と脚本のほう。

`;

function quickTable(list, cols) {
  const rows = list.map(a => '| ' + cols(a).join(' | ') + ' |');
  return rows.join('\n');
}
const collectCount = (cat) => (usage[cat] ? usage[cat] : null);

/* ---- assets/cg/README.md ＋ docs/CG_GUIDE.md ---- */
function cgDoc(opts = {}) {
  const order = opts.byStory
    ? ASSETS.filter(a => a.cat === 'cg').slice().sort((x, y) => {
        const ux = (usage.cg.get(x.id) || [])[0], uy = (usage.cg.get(y.id) || [])[0];
        const rank = (u) => u ? (scriptFiles.indexOf(path.basename(u.file)) * 100000 + u.line) : 9e9;
        return rank(ux) - rank(uy);
      })
    : ASSETS.filter(a => a.cat === 'cg').sort((a, b) => a.id.localeCompare(b.id, 'en'));
  const used = order.filter(a => !a.reserve), spare = order.filter(a => a.reserve);
  const leadCg = opts.byStory
    ? ['本編で**今どこに使っていて**、どの順で差し替えを進めればいいのか ―― 32枚を**物語の順**に並べた1本。',
       'CGの実ファイルは未配置（台帳に名前だけ）。だからこそ**連絡表として使う**のが正しい読み方。',
       '構図・寸法・出番（行番号まで）がここにある。']
    : ['`assets/cg/` の差し込みCG 18スロット＋ENDカード 14スロット。**実ファイルは未配置**（台帳に名前だけ）。出番・演出・差し替え仕様を1枚ずつ。'];
  let md = head(opts.byStory ? `CG 総まくりガイド ― 今ある${order.length}枚を1枚ずつ` : `CG — 名場面CG・ENDカード（${order.length}枚）`, leadCg, order.length);
  md += `## 先にまとめ

- **本編で使っている枚数**: ${used.filter(a => (usage.cg.get(a.id) || []).length).length} 枚（ \`@cg\` 指定 ${[...usage.cg.values()].reduce((n, v) => n + v.length, 0)} 箇所 ）
- **降板して削除した枚数**: 20 枚（非ピーク。台帳・実ファイルとも削除済み。理由は \`docs/UI_CG_2026-09-12.md\`、命名の記録は \`docs/ASSET_MANIFEST.md\`）
- **実ファイルが乗っている枚数**: ${order.filter(a => !a.placeholder).length} 枚（0＝すべて未配置。台帳の名前で新規配置すれば差し替わる）
- **回収表示の分母**: \`AssetDB.collectible('cg')\` = ${order.filter(a => !a.reserve).length} 枚 → タイトルと保存画面の \`x/N\` はここを見る

## CG を置く基準（2026-09-12 改定）

1. **印象的で感動的なシーンにだけ置く** ―― 引き金／各ルートの決定の瞬間／収束の夜／クライマックス／各END。
2. 呼び止め・手元アップ・並んで喋るだけ・状況説明の集合図は**立ち絵＋\`@bg\`＋\`@chr\`**（＋ \`@memo\` \`@caption\`）で足りる。置かない。
3. 同じCGを10ライン以内に再掲しない（ dip の連発は「切れた」ことすら伝わらない）。
4. ENDカード用 \`cg_end_*\` と同一構図の差し替えは作らない。1シーン1枚。
5. 喜劇のツッコミ（「は？」）にはCGを立てない。立つと笑いが半減する。
6. 外した素材は**台帳から外して実ファイルも削除**する（未回収で埋まらないように。命名の記録は \`docs/ASSET_MANIFEST.md\`）。

経緯: \`docs/PERF_2026-09-11.md\`（第1弾・11枚降板）→ \`docs/UI_CG_2026-09-12.md\`（第2弾・9枚降板＋白紙ファイル全削除）。

## 早見表（${opts.byStory ? '物語順' : 'ID順'}）

| ID | ひとこと | 出番 | 状態 |
|---|---|---|---|
${quickTable(used, (a) => {
    const us = usage.cg.get(a.id) || [];
    const tag = us[0] ? (us[0].chapter ? `\`${us[0].chapter.id}\`` : path.basename(us[0].file, '.txt')) : '—';
    return ['`' + a.id + '`', a.label.length > 30 ? a.label.slice(0, 30) + '…' : a.label,
      us.length ? `${us.length}箇所 @${us[0].line}${us.length > 1 ? '…' : ''}（${tag}）` : `—（${tag}）`,
      us.length ? '本編' : '未使用'];
  })}

---

## 1枚ずつの解説（本編使用 ${used.length} 枚）
${opts.byStory ? '\n（章ごとに区切って、本編で流れる順に並べてある）\n' : ''}
${opts.byStory ? cgStorySections(used) : used.map(a => blockCg(a)).join('\n')}
---

## 降板枠（2026-09-12 に台帳から外し、実ファイルも削除）

これらは \`data/assets.json\` に \`"reserve": true\` を付けてある。
**実画像としては残してある**ので、脚本に \`@cg id\` を1行足せばそのまま復帰できる
（その場合 \`reserve\` を外す＝ギャラリーと回収分母に復活する）。

${spare.length ? spare.map(a => blockCg(a)).join('\n') : '（なし）'}

## 全 ${order.length} 枚のファイル名一覧（配置・リネーム用）

台帳の \`file\` と**同名**で置けばそのまま効く（拡張子を変えたいときは台帳も直す）。

| ID | ファイル | 寸法（現） | 状態 |
|---|---|---|---|
${quickTable(order, (a) => {
    const i = imgInfo(a.file);
    const us = usage.cg.get(a.id) || [];
    return ['`' + a.id + '`', '`' + a.file + '`', i.dim,
      a.reserve ? '予備' : (us.length ? '本編 ' + us.length + '箇所' : '未使用') + (a.placeholder ? '・未配置' : '・実画像')];
  })}

## 差し替え手順（CG共通）

1. **ファイル名は「台帳ID + 拡張子」**（例 \`cg_chizutsutsu_kobore_shashin.png\`）。それを \`assets/cg/\` に新規配置
   ― 台帳（\`data/assets.json\`）の \`id\` と \`file\` のファイル名部分は全行一致済み。別の名前だと解決されません
2. \`data/assets.json\` のその行の \`"placeholder": true\` → \`false\`
   ― **1と2は必ずセット**。ファイルだけ置くと補完のまま、フラグだけ倒すと 404 で壊れます
   （まとめてやるなら \`node tools/sync_placeholder.mjs\` が実在ファイルを検出して自動で倒します）
3. \`sw.js\` の \`CACHE\`（現在 \`${CACHE_NOW}\`）を上げる ← **忘れると古いキャッシュを返し続ける**
   （\`node tools/sync_placeholder.mjs --bump\` で自動）
4. 差し替えた瞬間、エンジン側は \`backdropSVG\`／合成の重い方を自動で切る（\`#stage[data-art="real"]\`）
5. \`node tools/sync_placeholder.mjs --check\` ＋ \`npm test\`（vncheck / smoke）で崩れを確認

### 入稿寸法（実測ベース ― 詳細は \`docs/ART_SPEC.md\`）

| 項目 | 値 | 根拠 |
|---|---|---|
| 推奨 | **${RECOMMEND.cg}** | 舞台は常に16:9（\`#viewport{aspect-ratio:16/9}\`） |
| 最低 | 1600×900 | \`--u = 幅/1000\` → 1600px幅の窓で等倍 |
| 描画 | \`object-fit: cover\` 全画面 | \`css/vn.css:131\`。16:9 以外だと端が切れる |
| Ken Burns | 最大 **${GEOM.kbMax}倍**（26秒） | \`css/vn.css:134\`。\`@cg id kb\` を付けた箇所だけ（本編 ${[...usage.cg.values()].flat().filter(u => u.kb).length} / ${[...usage.cg.values()].flat().length} 箇所）→ 四周 5〜6% は捨てて中央に重要物を |
| 隠れる範囲 | **下 ${(GEOM.txtCover * 100).toFixed(0)}%** はテキスト窓＋ツールバー | \`#textwrap{bottom:26u}\` + \`#textbox\` 142u + ツールバー（半透明＋blur なので完全には消えないが読みにくい） |
| 立ち絵 | CG中は**強制非表示** | \`#stage[stage-mode="cg"] .chr{opacity:0!important}\` → キャラはCGの中に描き込む |

### 演出のしかた（脚本DSL）

| 書き方 | 結果 |
|---|---|
| \`@cg cg_mado_ushiro_miteteta\` | 0.42秒で一度下げてから 0.75秒でフェードイン（\`.lay-cg.dip\`）。同一idの再指定は何もしない |
| \`@cg cg_mado_ushiro_miteteta kb\` | 同上＋ Ken Burns 26秒（1.02→1.12） |
| \`@cg off\` | 0.75秒で下げて立ち絵を返す（\`stage-mode=cg\` を外す） |
| 背景切り替え | \`@bg\` は 2枚スラブのクロスディゾルブ（既定1.15秒・CONFIGで変更可） |
`;
  return md;
}

/* ---- assets/bg/README.md ---- */
function bgDoc() {
  const list = ASSETS.filter(a => a.cat === 'bg').sort((a, b) => (a.id === 'title_key' ? 1 : b.id === 'title_key' ? -1 : a.id.localeCompare(b.id, 'en')));
  let md = head('BG — 背景（25枚）',
    ['`assets/bg/` の背景スロット。**1枚ずつ「どのシーンで何回」「どの時間帯トーンか」**まで書く。',
     '背景25枚は**実画像を収録済み**（2026-09-12時点）。実ファイルが無いスロットは `js/visual.js` の `backdropSVG()` が等高線下地で補完。'],
    list.length);
  md += `## 先にまとめ

- 使用 ${list.filter(a => (usage.bg.get(a.id) || []).length).length} 枚 ／ 未使用 ${list.filter(a => !(usage.bg.get(a.id) || []).length).length} 枚（ \`title_key.jpg\` などエンジン専有のものを含む）
- \`@bg\` 指定は**ファイル名stem**（ \`bg_hokutou_kyoshitsu_asa\` ）でも**台帳ID**（ \`BG01\` ）でも書ける
- 切り替えは 2枚スラブのクロスディゾルブ（既定1.15秒）。実画像は**隠れた側で \`decode()\` してから**受渡すので暗転しない

## 早見表

| ID | ひとこと | 使用 | トーン |
|---|---|---|---|
${quickTable(list, (a) => {
    const us = usage.bg.get(a.id) || [];
    return ['`' + a.id + '`', a.label.length > 26 ? a.label.slice(0, 26) + '…' : a.label,
      us.length ? `${us.length}箇所` : '—', (a.meta || '').split('/')[1] || '—'];
  })}

---

## 1枚ずつの解説

${list.map(a => blockBg(a)).join('\n')}
## 差し替え手順（BG共通）

1. **ファイル名は「台帳ID + 拡張子」**（例 \`bg_okujou.png\`）。それを \`assets/bg/\` に上書き／新規配置
2. 台帳の \`placeholder\` を \`false\` に → SVG補完（\`backdropSVG\`）が外れて実画像になる
   （背景25枚は**既に全て \`placeholder: false\`**＝上書きするだけで反映されます）
3. \`sw.js\` の \`CACHE\`（現在 \`${CACHE_NOW}\`）を上げる
4. 白背景素材のまま使いたいときだけ CONFIG「画像合成」= multiply（**既定は normal**。multiply は \`#stage[data-blend="multiply"]\` を付けたときだけ立ち絵に掛かる）
5. \`node tools/sync_placeholder.mjs --check\` で寸法・容量・台帳のズレを確認

### 入稿寸法（実測ベース ― 詳細は \`docs/ART_SPEC.md\`）

| 項目 | 値 | 根拠 |
|---|---|---|
| 推奨 | **${RECOMMEND.bg}** | 舞台は常に16:9（\`#viewport{aspect-ratio:16/9}\`） |
| 収録済みの実測 | 1672×940〜941 PNG・1.7〜3.1MB/枚（24枚で約53MB） | \`assets/bg/\` を実測 |
| 描画 | \`object-fit: cover\` 全画面＋ \`bgSettle\`（1.016→1.0） | \`css/vn.css:74,89-92\` → 1600×900 ちょうどでも僅かに拡大される |
| 隠れる範囲 | 下 ${(GEOM.txtCover * 100).toFixed(0)}% はテキスト窓、左右に立ち絵（枠幅 ${GEOM.chrBox.w}u） | 主役の被写体は中央〜やや上に |

### \`@bg\` の書き方

| 書き方 | 結果 |
|---|---|
| \`@bg bg_hokutou_kyoshitsu_yuugata\` | stem 指定（推奨）。 \`time=yuugata\` を併記すると \`mood()\` も同時に切り替わる |
| \`@bg BG03\` | 台帳ID指定でも解決される |
| \`@bg bg_x time=akari\` | 背景の差し替えと照明トーンを同時に（ \`MOODS\` を参照） |
| \`@bg off\` | 背景を剥ぐ（両スラブを空にする） |
`;
  return md;
}

/* ---- assets/chr/README.md ---- */
function chrDoc() {
  const list = ASSETS.filter(a => a.cat === 'chr').sort((a, b) => a.file.localeCompare(b.file));
  const byChar = new Map();
  for (const a of list) {
    const slug = a.meta || path.basename(a.file).split('_')[1];
    if (!byChar.has(slug)) byChar.set(slug, []);
    byChar.get(slug).push(a);
  }
  const usedSlots = [...chrUsage.keys()];
  let md = head(`CHR — 立ち絵（${list.length}差分／${byChar.size}キャラ）`,
    ['`assets/chr/` の立ち絵差分。キャラごとに**どの表情が本編で何回出るか**を1枚ずつ書く。',
     '実ファイルは未配置（白紙プレースホルダは2026-09-12に削除）。画面に出ているのは `js/visual.js` の `figureSVG()` シルエット補完。'],
    list.length);
  md += `## 先にまとめ

- キャラ ${byChar.size} 体／差分 ${list.length} 枚／**本編で実際に呼ばれている差分 ${usedSlots.length} 枚**
- 未使用差分は「差し替え優先度：低」。枚数だけは確保してあるので、脚本に \`@chr slug=NN\` を足せば出る
- \`@chr\` は 1〜3人まで同時（中央／左右の3スロット）。\`@chr clear\` で全員下げる
- 喋っている人の表示順は自動（\`z-index:9\`）。**話者切替で素材は差し替えない**（class と重なり順だけ＝ちらつきなし）

## 早見表（キャラ別）

| スラッグ | 名前 | 差分 | 本編の呼ばれ数 | 台詞色 |
|---|---|---|---|---|
${[...byChar.entries()].map(([slug, arr]) => {
    const sp = Object.values(meta.speakers || {}).find(v => v.sprite === slug);
    const n = arr.reduce((k, a) => {
      const e = path.basename(a.file).match(/_(\d\d)_/);
      return k + ((chrUsage.get(`${slug}|${e ? e[1] : '01'}`) || []).length);
    }, 0);
    return '| `' + slug + '` | ' + (sp ? `${sp.name}（${sp.kana}）` : '（台詞名なし／回想・サブ）') +
      ' | ' + arr.length + ' | ' + n + ' | ' + (sp ? '`' + sp.color + '`' : '—') + ' |';
  }).join('\n')}

---

## キャラごとの解説（差分を1枚ずつ）

${[...byChar.entries()].map(([slug, arr]) => {
    const sp = Object.values(meta.speakers || {}).find(v => v.sprite === slug);
    const route = (meta.routes || []).find(r => r.who && sp && r.who === sp.name);
    const L = [`### \`${slug}\` ${sp ? '― ' + sp.name + '（' + sp.kana + '）' : '― 台帳上のスラッグのみ（回想・サブキャラ）'}`, ''];
    const maxExpr = String(Math.max(...arr.map(a => Number((path.basename(a.file).match(/_(\d\d)_/) || [])[1] || 1)))).padStart(2, '0');
    L.push(`- **書き方**: \`@chr ${slug}=01\`〜\`@chr ${slug}=${maxExpr}\`（差分 ${arr.length} 枚・\`@chr ${slug} all\` は非対応、\`@chr clear\` で全員下げる）`);
    if (sp) L.push(`- **名前ボックス**: ${sp.name}／色 \`${sp.color}\``);
    const real0 = arr.find(x => !x.placeholder);
    L.push(`- **差し替え推奨（このキャラ共通）**: ${RECOMMEND.chrShort} ／ 現在 実画像 ${arr.filter(x => !x.placeholder).length} 枚・未配置 ${arr.filter(x => x.placeholder).length} 枚（白紙削除済み）${real0 ? `（各 ${dimStr(imgInfo(real0.file))}）` : ''}`);
    if (route) L.push(`- **その人が主役のルート**: ${route.no}「${route.title}」${route.sub ? ' ― ' + route.sub : ''}（開始シーン \`${route.scene}\`）`);
    L.push('');
    L.push(arr.map(a => blockChr(a)).join('\n'));
    L.push('');
    return L.join('\n');
  }).join('\n')}
## 差し替え手順（立ち絵共通）

1. **ファイル名は「台帳ID + 拡張子」**（例 \`chr_katsuya_01_tsuujou.png\`）。それを \`assets/chr/\` に新規配置
   ― 台帳の \`id\` と \`file\` のファイル名部分は ${list.length} 行すべて一致済み。一覧は \`docs/CHR_REPLACE_LIST.md\`
   ― 旧名（\`chr_katsuya_01_tsujou.png\` のような短縮ローマ字）は **2026-09-13 に全廃**。どのコードも参照していません
2. 台帳の \`placeholder\` を \`false\` に → シルエット補完（\`figureSVG\`）が消えて実画像になる
   （**1と2はセット**。ファイルだけ置くと補完のまま、フラグだけ倒すと 404 で壊れる）
   ― まとめてやるなら \`node tools/sync_placeholder.mjs\`（実在ファイルを検出して自動で \`false\` にする）
3. \`sw.js\` の \`CACHE\`（現在 \`${CACHE_NOW}\`）を上げる（\`--bump\` で自動）
4. 白背景のまま置きたいときだけ CONFIG「画像合成」= multiply（ \`#stage[data-blend="multiply"] .chr img\` にだけ掛かる）
5. \`node tools/sync_placeholder.mjs --check\` で寸法・透過・容量・台帳のズレを確認 → \`npm test\`

### 入稿寸法（実測ベース ― 詳細は \`docs/ART_SPEC.md\`）

| 項目 | 値 | 根拠 |
|---|---|---|
| 推奨 | **${RECOMMEND.chr}** | 表示枠 \`.chr{width:${GEOM.chrBox.w}u;height:${GEOM.chrBox.h}u}\`（\`css/vn.css:108\`）＝実寸 ${GEOM.chrBoxPx.w}×${GEOM.chrBoxPx.h}px |
| 描画 | \`object-fit:contain\` ＋ \`object-position:bottom center\` | \`css/vn.css:114\`。比がズレると枠内に余白が出る |
| **上が切れる** | 横画面（16:9）では枠の上 ${(GEOM.chrCrop * 100).toFixed(1)}% が画面外 | 舞台の高さ ${GEOM.stage.h}u ＜ 枠 ${GEOM.chrBox.h}u ＋ \`bottom:0\` ＋ \`#viewport{overflow:hidden}\` |
| → 840×1280 の場合 | **上 155px は余白**にして頭頂を y≧163px に | 切れるのは ${(GEOM.chrCrop * 100).toFixed(1)}% ＝ 155px |
| → 切りたくない場合 | **840×1120（3:4）** なら \`contain\` で 420×560u に収まり全身が見える | 切れない上限は 840×1125（w/h≒0.747） |
| 確実に見える帯 | 840×1280 換算で **y=155〜885px** | 上端 ${(GEOM.chrCrop * 100).toFixed(1)}% は画面外、下端は下 ${GEOM.txtCoverU}u（${(GEOM.txtCover * 100).toFixed(0)}%）をテキスト窓が覆う（半透明＋blur なので完全には消えない） |
| 横の余白 | 左右に **10〜15% の透明余白**を推奨 | 配置は 1人=50%／2人=33.3%・66.7%／3人=18%・50%・82%（\`js/visual.js:848-850\`）で枠は常に ${GEOM.chrBox.w}u 幅 → 3人時は左右 50u ずつ重なる |
| 解像度の上限 | 1344×2048（Retina 等倍）まで意味がある | 実寸 ${GEOM.chrBoxPx.w}×${GEOM.chrBoxPx.h}px × DPR2。ただし ${list.length} 枚あるので容量と相談 → **透過WebP** 推奨（PNG の 1/4〜1/6） |

### 演出（JS/CSS 側で自動）

| 効く場所 | 挙動 |
|---|---|
| \`data-enter="left/right/center"\` | 入場スライド＋ブラー（88ms ずつスタッガ） |
| \`chrBreathe\` 8.4s | **\`translate\` だけ**動かす（ぼかしの再計算を毎フレームやめた）。CONFIG「立ち絵の動き」で lite/off/full |
| \`.talk\` | \`chrTalkSettle\` .5s 単発（旧来は .34s 無限＝再ラスタ源だった） |
| \`.dim\` | 非話者を明度60%・彩度52%・0.985 |
| 3人時 | 中央 1.016／左右 0.988 で奥行き |
`;
  return md;
}

/* ---- docs/CHR_REPLACE_LIST.md ---- */
function chrReplaceDoc() {
  const list = ASSETS.filter(a => a.cat === 'chr');          // 台帳の並び順（＝スロット順）をそのまま使う
  const slugOf = (a) => a.meta || path.basename(a.file).split('_')[1];
  const exprOf = (a) => (path.basename(a.file).match(/_(\d\d)_/) || [])[1] || '01';
  const real = list.filter(a => !a.placeholder).length;
  let md = head('立ち絵 差し替え一覧',
    [`**${list.length} 枚を「どのファイル名でどこに置くか」だけにした実務一覧**。正本は台帳 \`data/assets.json\`。`,
     '置くファイル名は **台帳ID + 拡張子**（例 \`chr_katsuya_01_tsuujou.png\`）。台帳の \`id\` と \`file\` のファイル名部分は全行一致しています。',
     '旧名（\`chr_katsuya_01_tsujou.png\` のような短縮ローマ字）は **2026-09-13 に全廃**。版A（\`assets/chr/\`）も版B（\`game/js/assets_manifest.js\` → \`game/assets/img/\`）も**同じ新名**で解決するので、旧名の一覧は不要になりました。'],
    list.length);
  md += `## 先にまとめ

- 置く場所: **\`assets/chr/\`**（版A）／版B も動かすなら同じ名前を \`game/assets/img/\` にも
- 実画像にする条件: 台帳の \`"placeholder": true\` → \`false\`（**ファイルとフラグは必ずセット**）
  ― まとめてやるなら \`node tools/sync_placeholder.mjs\`（実在ファイルを検出して自動で倒す。寸法・透過・容量も見る）
- そのあと \`sw.js\` の \`CACHE\`（現在 \`${CACHE_NOW}\`）を上げる（\`--bump\` で自動）
- 現在の状態: 実画像 **${real} 枚**・未配置 **${list.length - real} 枚**
- 寸法: **${RECOMMEND.chr}** ― 構図の注意（上が ${(GEOM.chrCrop * 100).toFixed(1)}% 切れる／下 ${(GEOM.txtCover * 100).toFixed(0)}% はテキスト窓）は \`docs/ART_SPEC.md\`

## 一覧（台帳順＝スロット順）

| No | 置くファイル名（\`assets/chr/\` ＝ 台帳ID + \`.png\`） | \`@chr\` の書き方 | 表情 | 本編の使用 | 初出 | 状態 |
|---:|---|---|---|---:|---|---|
${list.map((a, i) => {
    const slug = slugOf(a), expr = exprOf(a);
    const us = chrUsage.get(`${slug}|${expr}`) || [];
    const sp = Object.values(meta.speakers || {}).find(v => v.sprite === slug);
    return `| ${i + 1} | \`${path.basename(a.file)}\` | \`@chr ${slug}=${expr}\` | ` +
      `${sp ? sp.name + ' ' : ''}${exprLabel(a.label)} | ${us.length} 回 | ` +
      `${us.length ? whereStr(us[0]).replace(/^.*― /, '') : '―'} | ${a.placeholder ? '未配置' : '● 実画像'} |`;
  }).join('\n')}

## 読み方

- **本編の使用** = 脚本（\`data/script/*.txt\`）の \`@chr slug=NN\` が出てくる行数。0 回の差分は「枠だけ確保」なので、出すには脚本に \`@chr\` を足す
- **初出** = 最初に呼ばれる行。\`ファイル名:行番号\`
- **状態** = 台帳の \`placeholder\`。\`未配置\` の間は \`js/visual.js\` の \`figureSVG()\` がシルエットを描きます
- 表情の詳しい意図・キャラごとの差分構成は \`assets/chr/README.md\`
`;
  return md;
}

/* ---- assets/README.md ---- */
function topDoc() {
  const chrCount = ASSETS.filter(a=>a.cat==='chr').length;
  const cats = [
    ['bg', '背景', '1920×1080（16:9）／cover', '等高線SVG（`backdropSVG`）'],
    ['cg', '名場面CG・ENDカード', '1920×1080（16:9）／cover・kb で最大1.11倍', '―（暗色ベタのみ）'],
    ['chr', '立ち絵差分', '840×1280（21:32）／透過・下揃え', 'シルエット（`figureSVG`）'],
  ];
  let md = `# Assets — 画像素材总台帳

**背景（\`assets/bg/\` 25枚）だけが実画像**。CG・立ち絵は**台帳にスロット名だけ**登録してあり、
実ファイルは未配置（2026-09-12 に白紙プレースホルダ256枚を削除） ―― 画面に実際に描いているのは \`js/visual.js\` の手続き生成SVGです。
**「何を・どこに・どう置けば効くか」を1素材ずつ書いたREADMEが、下の3枚**。
（UI画像は2026-09-12に撤去 ―― ロゴ・枠・アイコンまで含め、UIは全てエンジンのCSS/SVG描画で代替済み。）

- \`bg/README.md\` ― 背景 25 枚（出番・時間帯トーン・@bg の書き方）
- \`cg/README.md\` ― CG 32 枚（出番・Ken Burns・差し替え仕様）
- \`chr/README.md\` ― 立ち絵 ${chrCount} 差分（キャラ別・表情別の本編出現回数）
- \`../docs/CG_GUIDE.md\` ― **CG 32枚を物語順にまとめた1本**（これだけ読めばCGは足りる）
- \`../docs/ART_SPEC.md\` ― **入稿仕様書**（推奨寸法・セーフエリア・形式・命名規則。絵を注文するときはこれ）
- \`../docs/CHR_REPLACE_LIST.md\` ― 立ち絵 ${chrCount} 枚の差し替え一覧（**自動生成**：置くファイル名・\`@chr\`・表情・使用回数・状態）

## 内訳

| フォルダ | 点数 | 現在の状態 | 実画像にするときの推奨 | エンジン側の補完 |
|---|---:|---|---|---|
${cats.map(([d, n, rec, fb]) => {
    const rows = ASSETS.filter(a => (a.file.split('/')[1]) === d);
    const real = rows.filter(a => !a.placeholder).length;
    return `| \`${d}/\` | ${rows.length} | 実画像 ${real}・未配置 ${rows.length - real}（白紙削除済み） | ${rec} | ${fb} |`;
  }).join('\n')}

## 差し替えの作法（4ステップ）

1. **「台帳ID + 拡張子」のファイル名で新規配置**（例 \`chr_mie_04_kimazui_chinmoku.png\` → \`assets/chr/\`）
   ― 台帳の \`id\` と \`file\` のファイル名部分は全行一致。白紙の元ファイルは削除済み
   ― 拡張子を変える（WebP 化など）ときは台帳の \`file\` も直す（\`--adopt-ext\` で自動）
2. \`data/assets.json\` の \`"placeholder": true\` → \`false\`
   ― これだけで補完SVGが消えて実画像に切り替わる（ \`#stage[data-art="real"]\` ）
   ― **1と2は必ずセット**。ファイルだけ置くと補完のまま、フラグだけ倒すと 404 で壊れる
   ― まとめてやるなら **\`node tools/sync_placeholder.mjs\`**（実在ファイルを検出して自動で \`false\` にする）
3. \`sw.js\` の \`CACHE\`（現在 \`${CACHE_NOW}\`）を上げる ← **忘れると古いキャッシュを返す**（\`--bump\` で自動）
4. \`node tools/sync_placeholder.mjs --check\` ＋ \`npm test\`（vncheck / smoke）で崩れを確認

## 命名規則（2026-09-13 に統一済み）

| | 版A（\`index.html\`／この台帳） | 版B（\`game/index.html\`） |
|---|---|---|
| 置き場 | \`assets/bg/\` \`assets/chr/\` \`assets/cg/\` | \`game/assets/img/\`（1フォルダ） |
| ファイル名 | **台帳ID + 拡張子**（\`chr_katsuya_01_tsuujou.png\`） | **同じ**（\`game/js/assets_manifest.js\` も新名に更新済み） |
| 実画像にする条件 | \`data/assets.json\` の \`placeholder: false\` | ファイルを置くだけ（フラグ機構なし） |
| 旧名（\`chr_katsuya_01_tsujou.png\` 等） | **廃止** ― どのコードも参照していません | 同左 |

## 合成（blend）についての注意 ― 2026-09-11 に変更

- 以前は全面レイヤに \`mix-blend-mode: multiply\`（＝白＝透明）が掛かっていたが、
  \`contain: paint\` のせいで**実写素材がほぼ真っ黒**に描画される不具合があった（白紙時代は気づかなかった）。
- いまは **既定 \`normal\`**。立ち絵だけ CONFIG「画像合成」= multiply で選べる
  （ \`#stage[data-blend="multiply"] .chr img\` ／背景は \`#fff\` 下地に切り替わる）。
- 立ち絵は**透過PNGが正解**。multiply は白背景JPEGをそのまま置きたいときの逃げ道。
- 実素材を大量に置くなら **WebP** を推奨（1600×900 PNG を素で置くと概算 165MB、WebPなら 30MB 前後。
  実際に収録済みの背景24枚は PNG で計 53MB）。透過が要る立ち絵は **透過WebP**（\`lossless\` か \`quality 90\` 前後）。
  拡張子を変えたときは台帳の \`file\` も直す ― \`node tools/sync_placeholder.mjs --adopt-ext\` で自動反映されます。
  起動プリロードは「読む5シーンぶんだけ」を先に待つ優先方式なので、枚数が増えても起動は一定。

## 重さの記録

実測して直した一覧（背景SVGの全面 \`feTurbulence\`、立ち絵の無限アニメ、テキスト窓の \`backdrop-filter\`、
1ライン平均1.7KBあった同期セーブ等）は \`../docs/PERF_2026-09-11.md\`。
`;
  return md;
}


/* ------------------------------------------------------------------ 書込 -- */
const out = {
  'assets/README.md': topDoc(),
  'assets/bg/README.md': bgDoc(),
  'assets/cg/README.md': cgDoc(),
  'assets/chr/README.md': chrDoc(),
  'docs/CG_GUIDE.md': cgDoc({ byStory: true }),
  'docs/CHR_REPLACE_LIST.md': chrReplaceDoc(),
};
for (const [p, txt] of Object.entries(out)) {
  fs.writeFileSync(path.join(ROOT, p), txt.replace(/\n{3,}/g, '\n\n'));
  console.log(`${p.padEnd(26)} ${String(txt.split('\n').length).padStart(5)} 行`);
}
