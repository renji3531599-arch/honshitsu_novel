#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const root = path.resolve('assets');
const dataPath = 'data/assets.json';
const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
const byFile = new Map();
for (const a of data.assets) {
  byFile.set(a.file, a);
  // also stem
  const stem = a.file.replace(/^.*\//,'');
  byFile.set(stem, a);
}
byFile.set('assets/bg/title_key.jpg', { id:'title_key', cat:'bg', file:'assets/bg/title_key.jpg', label:'タイトルキービジュアル', desc:'タイトル背景（桜並木・教室・手書き地図の合成）', meta:'title/key', source:'-（実写合成）', placeholder:false });

function getImageInfo(p) {
  try {
    const out = execSync(`identify -format "%w %h %b" "${p}" 2>/dev/null`, {encoding:'utf-8'}).trim();
    // out like "400 300 810B" or "1376 768 242752B"
    const [w,h,b] = out.split(/\s+/);
    return {w: Number(w), h: Number(h), bytes: b};
  } catch(e){
    return {w:'-', h:'-', bytes:'-'};
  }
}

function formatBytes(b){
  if(b==='-') return '-';
  // b like 810B or 242752B or 1.2KB
  return b;
}

function recSpec(cat, file){
  if(cat==='bg') return '1600×900 (16:9) / JPEG・PNG / cover / 背景は`backdropSVG`でSVG補完';
  if(cat==='cg') return '1600×900 (16:9) / PNG/JPEG / cover / CGは全面表示＋KenBurns可';
  if(cat==='chr') return '420×700 viewBox（表示 420×640, 実素材推奨 840×1280 透過PNG）/ bottom中央配置';
  if(cat==='ui') {
    if(file.includes('title_logo')) return '1200×480 推奨（透過PNG、中央配置）';
    if(file.includes('frame')) return '可変（枠装飾は9-patch想定） 推奨 1280×720 背景';
    if(file.includes('icon')) return '256×256〜512×512 正方形 透過PNG';
    if(file.includes('bg_')) return '1600×900 背景用';
    return 'UI部品 — 推奨サイズはラベル参照';
  }
  if(cat==='_buffer') return '400×300 プレースホルダ（白紙）— LFS移行時は差し替え';
  return '-';
}

function genForDir(dirRel, cat, title, lead){
  const dir = path.join(root, dirRel);
  const files = fs.readdirSync(dir).filter(f=> /\.(png|jpg|jpeg|webp)$/i.test(f)).sort();
  const rows = [];
  for (const f of files){
    const full = path.join(dir, f);
    const rel = `assets/${dirRel}/${f}`;
    const info = getImageInfo(full);
    const meta = byFile.get(rel) || byFile.get(f) || null;
    const label = meta?.label || '-';
    const desc = meta?.desc || '-';
    const placeholder = meta ? (meta.placeholder ? '◯ 白紙プレースホルダ' : '● 実画像') : '—';
    const source = meta?.source || '-';
    const rec = recSpec(cat==='bg' && f==='title_key.jpg' ? 'bg' : cat, f);
    rows.push({f, rel, info, label, desc, placeholder, source, rec});
  }
  let md = `# ${title}\n\n${lead}\n\n`;
  md += `> 生成日: ${new Date().toISOString().slice(0,10)}  /  総数: ${rows.length} ファイル  /  実体は \`data/assets.json\` が正本（台帳）\n\n`;
  if(cat==='bg'){
    md += `## 推奨仕様（BG）\n\n- **サイズ**: 1600×900px（16:9） — \`Stage.bg\` は \`object-fit: cover\` で表示、SVGフォールバック（\`backdropSVG\`）は 1600×900 viewBox\n- **形式**: PNG / JPEG（写真はJPEG、描き込みはPNG推奨）\n- **色**: 時間帯別に \`${'{kyoshitsu/rouka/suiko/...}'}/${'{asa/hiru/yuugata/yoru}'}\` で自動で暖色/寒色フィルタが掛かる（\`visual.js MOODS\`）\n- **配置**: \`#stage\` 背面レイヤ \`lay-bg\`（\`art-back\` がSVG、\`art-img\` が実画像。実画像は \`placeholder:false\` で切替）\n\n`;
  } else if(cat==='cg'){
    md += `## 推奨仕様（CG）\n\n- **サイズ**: 1600×900px（16:9） — 全画面差し込み、Ken Burns（\`cgHolder.kb\`）で 26〜32秒かけて 1.02→1.12 にズーム\n- **形式**: PNG / JPEG（透過はPNG）\n- **命名**: \`cg_##_slug_...png\` / \`cg_end_*.png\`（ENDカードは \`#1a1611\` 背景で等高線＋円形グラデ）\n- **配置**: \`lay-cg\`（\`stage-mode=\"cg\"\` で立ち絵を自動で隠す）\n\n`;
  } else if(cat==='chr'){
    md += `## 推奨仕様（立ち絵）\n\n- **viewBox**: 420×700（表示は \`--u*420\` 幅 × \`--u*640\` 高、\`object-position: bottom center\`）\n- **推奨実寸**: 840×1280px 以上（2×解像度、透過PNG）。顔〜胸上＋全身が 700px に収まる。トリミングは下基準\n- **形式**: PNG（透過必須）\n- **配置**: \`lay-chr\`。1体=50%中央 / 2体=31%69% / 3体=19%50%81%（\`Stage.applyChr\`）。入退場は \`data-enter=\"left/right/center\"\` で 3種、呼吸（\`chrBreathe\` 4.6s）＋talkバウンス（\`.talk\` 0.34s）＋dimで奥行き\n- **SVGフォールバック**: \`figureSVG(slug, expr)\` が髪型・小道具・表情濃度（\`expr\` 01-10）を procedurally に描く\n\n`;
  } else if(cat==='ui'){
    md += `## 推奨仕様（UI）\n\n- **種別**: タイトルロゴ / フレーム（LINE/BBS/配信） / アイコン（年鑑/新聞/地図筒…） / 背景装飾（SAVE/HUB/END）\n- **サイズ目安**: ロゴ 1200×480 / フレーム 1280×720 / アイコン 256×256〜512×512（透過PNG）\n- **配置**: タイトル(\`#title\` / \`#titleBg\`)、端末(\`screen-wrap\` の \`data-kind=\"line/bbs/live\"\`)、オーバーレイ(\`#overlay\`)\n\n`;
  } else if(cat==='_buffer'){
    md += `## 用途（_buffer）\n\n- **用途**: 今後差し替える画像の予約枠（99スロット）。現在は 400×300 白紙プレースホルダ。\n- **実データ**: \`assets/_buffer/white_202.png〜white_300.png\`（各 810B）。\n- **台帳**: \`data/assets.json\` の \`bufferFiles\` 配列（将来 LFS へ移行時はここに実ファイルを登録し、\`placeholder:false\` にして参照を切り替え）\n\n`;
  }

  md += `## ファイル一覧\n\n`;
  md += `| # | ファイル | 実寸（現在） | 容量 | 推奨サイズ | ラベル | 説明 | 状態 | 出典（仮置き元） |\n`;
  md += `|---:|---|---|---|すすめ|---|---|---|---|\n`;
  rows.forEach((r,i)=>{
    const dims = r.info.w!=='-' ? `${r.info.w}×${r.info.h}` : '-';
    const safeLabel = r.label.replace(/\|/g,'\\|');
    const safeDesc = r.desc.replace(/\|/g,'\\|').replace(/\n/g,' ');
    const safeRec = r.rec.replace(/\|/g,'\\|');
    md += `| ${i+1} | \`${r.f}\` | ${dims} | ${r.info.bytes} | ${safeRec} | ${safeLabel} | ${safeDesc} | ${r.placeholder} | \`${r.source}\` |\n`;
  });
  if(cat==='chr'){
    md += `\n### 立ち絵 表情バリエーション（抜粋）\n\n- \`01 通常/穏やか\` → \`02 微笑/笑顔\` → \`03 悩み/困り\` → \`04 驚き/怒り\` → \`05 悲しみ/切なさ\` → \`06 決意/真剣\` → \`07 照れ/喜び\` → \`08 泣き/涙\` → \`09 以降 個別（晴れやか・全力等）\`\n- 表現は \`expr\` 番号で濃度（\`darken\`）と \`#halo\` の有無が変わる（\`figureSVG\` 内 \`exprN>=8\` で後光が付く）\n- 実装では \`game.js\` が \`chr:{set:{slug:expr}}\` で \`store.meta.chr[slug]\` に回収を記録\n`;
  }
  if(cat==='bg' || cat==='cg'){
    md += `\n### 補足\n\n- 現状プレースホルダは **400×300 白紙（810B）**。差し替え時は同じファイル名で上書きし、\`data/assets.json\` の該当 \`placeholder\` を \`false\` にするだけでエンジンが実画像に切替（\`Stage.isPlaceholder\`）\n- プリロードは \`AssetDB.realList()\`（\`placeholder:false\` のみ）を 6並列で \`decode()\` し、失敗しても SVG でフォールバック\n`;
  }
  md += `\n---\n*このMDは自動生成（\`tools/gen_asset_md.mjs\`）。手編集より台帳 \`data/assets.json\` を正本にしてください。*\n`;
  return md;
}

const dirs = [
  { rel:'bg', cat:'bg', title:'BG — 背景画像 一覧', lead:'`assets/bg/` にある背景素材の台帳。北棟教室・廊下・保管庫・図書室・翠湖・屋上ほか、時間帯（asa/hiru/yuugata/yoru）で雰囲気が変わります。' },
  { rel:'cg', cat:'cg', title:'CG — イベントCG 一覧', lead:'`assets/cg/` の差し込みCG・ENDカード。物語の要所（地図筒が開く瞬間、桜、旧校舎、卒業式…）と 14種のENDイラスト。' },
  { rel:'chr', cat:'chr', title:'CHR — 立ち絵 一覧', lead:'`assets/chr/` のキャラクタ立ち絵（全105差分）。\`chr_<slug>_<expr>_<label>.png\` 形式。現在は 400×300 白紙プレースホルダのものが多いが、差し替えで透過PNGに置換。' },
  { rel:'ui', cat:'ui', title:'UI — UI素材 一覧', lead:'`assets/ui/` のタイトルロゴ・フレーム・アイコン類（20点）。LINE/BBS/配信画面などの端末フレームや、所持品アイコン。' },
  { rel:'_buffer', cat:'_buffer', title:'_BUFFER — 予約枠（プレースホルダ）', lead:'`assets/_buffer/` の予約枠 99枚（white_202〜300）。今後追加する背景/CG/立ち絵の置き場。現在は白紙。' },
];

for(const d of dirs){
  const md = genForDir(d.rel, d.cat, d.title, d.lead);
  const outPath = path.join(root, d.rel, 'README.md');
  fs.writeFileSync(outPath, md, 'utf-8');
  console.log(`→ ${outPath} (${md.split('\n').length}行)`);
}
// overview
const overview = `# Assets — 画像素材 台帳（概要）

> 全画像は \`data/assets.json\` が正本。ここ \`assets/\` 配下の各フォルダにも \`README.md\` を置き、**実寸 / 推奨サイズ / 何の画像か**を一覧化しています。

| フォルダ | 点数 | 実寸（現在） | 推奨 | 用途 | 台帳 |
|---|---:|---|---|---|---|
| \`bg/\` | 25 | 400×300 白紙が大半（title_key.jpg のみ 1376×768 実画像） | 1600×900 16:9 | 背景（教室/廊下/保管庫/湖/屋上…） | \`bg/README.md\` |
| \`cg/\` | 52 | 400×300 白紙 | 1600×900 16:9 | イベントCG 38枚＋ENDカード 14枚 | \`cg/README.md\` |
| \`chr/\` | 105 | 400×300 白紙 | 420×700 viewBox（実寸推奨 840×1280 透過PNG） | 立ち絵差分（16キャラ×表情） | \`chr/README.md\` |
| \`ui/\` | 20 | 400×300 白紙（一部実画像なし） | ロゴ 1200×480 / アイコン 256×256〜 | タイトル/フレーム/アイコン | \`ui/README.md\` |
| \`_buffer/\` | 99 | 400×300 白紙 810B | 予約枠 | 今後追加用の空きスロット | \`_buffer/README.md\` |

## 差し替え手順

1. **実画像を用意** — 推奨サイズで書き出し（背景/CGは 1600×900、立ち絵は透過PNG 840×1280）
2. **同名で上書き** — \`assets/bg/bg_hokutou_kyoshitsu_asa.png\` など既存の白紙ファイルを置換
3. **台帳を更新** — \`data/assets.json\` の該当 \`placeholder\` を \`false\` に（\`engine_limit/assigned\` は自動集計）
4. **プリロード確認** — \`npm run dev\` などで \`AssetDB.realList()\` が拾い、起動時 6並列で先読み。失敗しても SVGフォールバックで起動

## 立ち絵の凝った動き（2026-09 強化）

- **入場 3種**: \`data-enter=\"left/right/center\"\` で左/右/中央からスライド＋ブラー＋スケール。\`--chr-delay\` で 88ms ずつスタッガ（2人/3人時）
- **呼吸**: \`chrBreathe\` 4.6s 無限（-2.8px 上下＋0.7%スケール＋0.1deg回転）
- **会話バウンス**: \`.talk\` は \`chrTalkBounce\` 0.34s alternate 無限（-5px弾む）＋ rim（足元の影）が \`rimPulse\` で脈動、\`nametag\` が持ち上がる
- **非会話 dim**: \`dim\` は 60%明度・52%彩度・0.45pxブラー＋0.985縮小
- **奥行き**: 3人時は中央 1.016、左右 0.988 のベーススケール。話者は \`z-index:9\` で手前

詳細は \`css/vn.css\` 末尾「立ち絵 — 凝った動き」セクション、\`js/visual.js Stage.applyChr\` を参照。

## 生成

\`\`\`
node tools/gen_asset_md.mjs
\`\`\`

*各 README はこのスクリプトの自動生成。手で直さず、台帳を直して再生成してください。*
`;
fs.writeFileSync('assets/README.md', overview, 'utf-8');
console.log('→ assets/README.md');
