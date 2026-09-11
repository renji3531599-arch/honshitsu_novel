/* ============================================================================
   visual.js ―― 画面生成（背景・立ち絵・CG・演出レイヤ・パーティクル）
   画像が「仮（白紙プレースホルダー）」のあいだも画面が成立するよう、
   スロットの内容を SVG で補完描画する。data/assets.json の placeholder を
   false にすると、そのスロットは実画像のみを使う。
   ========================================================================== */

/* ------------------------------------------------------------ 乱数 helper -- */
function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function rng(seed) {
  let a = seed >>> 0;
  return () => { a += 0x6D2B79F5; let t = a; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
const R = (n) => Math.round(n * 10) / 10;
const prefersReduced = () => { try { return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch(_) { return false; } };

/* -------------------------------------------------------------- 時間帯 ---- */
const MOODS = {
  asa:     { sky: ['#cfd8d2', '#efe6cf'], ink: '#4a4436', warm: '#ffe6b0', light: 'on', veil: '' },
  hiru:    { sky: ['#dfe3d8', '#f3ecd8'], ink: '#463f32', warm: '#fff3d8', light: 'on', veil: '' },
  yuugata: { sky: ['#8a5a3a', '#e8a35a'], ink: '#3a2a20', warm: '#ff9d4a', light: 'warm', veil: '' },
  yoru:    { sky: ['#1b2231', '#2c2f3a'], ink: '#11141c', warm: '#7f96c8', light: 'off', veil: 'half' },
  akari:   { sky: ['#e8e2d0', '#d5cdb6'], ink: '#3f3a2e', warm: '#fff0c8', light: 'on', veil: '' },
  sepia:   { sky: ['#d9c9a4', '#c1ab84'], ink: '#4b3d28', warm: '#ffe8b8', light: 'warm', veil: '' },
  gensou:  { sky: ['#c9b48b', '#a8906a'], ink: '#453822', warm: '#ffe9c0', light: 'warm', veil: '' },
  sotsu:   { sky: ['#dfe6df', '#f2ece0'], ink: '#464438', warm: '#fff1d4', light: 'on', veil: '' },
  // yoru/warmは backdropSVG側で光が柔らかく滲むように粒子の揺らぎを深くする
};

/* ------------------------------------------------------------- 等高線 ---- */
function contourField(rand, n = 9, base = 470, amp = 118, color = '#000', op = .1) {
  let out = '';
  for (let i = 0; i < n; i++) {
    const p1 = rand() * 6.28, p2 = rand() * 6.28, p3 = rand() * 6.28;
    const f1 = 1 + rand() * 1.6, f2 = 2.4 + rand() * 2.2;
    const yy = base + i * (amp / n) * 1.9 - n * 3;
    let d = '';
    for (let x = -40; x <= 1640; x += 20) {
      const t = x / 1600;
      const y = yy
        + Math.sin(t * Math.PI * f1 + p1) * (16 + i * 4.2)
        + Math.sin(t * Math.PI * f2 + p2) * (7 + i * 1.4)
        + Math.sin(t * Math.PI * 6.5 + p3) * 2.6;
      d += (x === -40 ? 'M' : 'L') + R(x) + ' ' + R(y) + ' ';
    }
    out += `<path d="${d}" fill="none" stroke="${color}" stroke-opacity="${op + (i % 4 === 0 ? .045 : 0)}" stroke-width="${i % 4 === 0 ? 1.5 : .85}"/>`;
  }
  return out;
}

/* ------------------------------------------------- 装飾用等高線（単体） -- */
/** 起動画面・転換ヴェール・章カードの背景に敷く、薄い等高線だけのSVG。 */
export function contourSVG(seedStr = 'veil', { lines = 10, color = '#d9c9a6', op = .12 } = {}) {
  const rand = rng(hash(seedStr));
  const c = contourField(rand, lines, 430, 430, color, op);
  return `<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">${c}</svg>`;
}

/* -------------------------------------------------------------- モチーフ -- */
function windows(mood, count = 5, y = 150, h = 300) {
  let out = '';
  const w = 1500 / count;
  for (let i = 0; i < count; i++) {
    const x = 60 + i * w;
    out += `<g>
      <rect x="${x}" y="${y}" width="${w - 26}" height="${h}" fill="${mood.warm}" opacity=".2"/>
      <rect x="${x}" y="${y}" width="${w - 26}" height="${h}" fill="none" stroke="${mood.ink}" stroke-opacity=".5" stroke-width="2"/>
      <line x1="${x}" y1="${y + h * .34}" x2="${x + w - 26}" y2="${y + h * .34}" stroke="${mood.ink}" stroke-opacity=".45" stroke-width="1.6"/>
      <line x1="${x + (w - 26) / 2}" y1="${y}" x2="${x + (w - 26) / 2}" y2="${y + h}" stroke="${mood.ink}" stroke-opacity=".3" stroke-width="1.2"/>
    </g>`;
  }
  return out;
}
function desks(rand, rows = 4, cols = 5, tint = '#000') {
  let out = '';
  for (let r = 0; r < rows; r++) {
    const y = 560 + r * 76, sc = .74 + r * .1;
    for (let c = 0; c < cols; c++) {
      const x = 130 + c * 285 * (1 + r * .06) - r * 26;
      const w = 150 * sc + 30, h = 30 * sc + 12;
      out += `<g opacity="${.3 + r * .07}">
        <path d="M${x} ${y} h${w} l${-8 + r * 3} ${h} h${-w + 10} z" fill="${tint}" fill-opacity=".16" stroke="${tint}" stroke-opacity=".5" stroke-width="1.3"/>
        <line x1="${x + 8}" y1="${y + h}" x2="${x + 12}" y2="${y + h + 44 + r * 5}" stroke="${tint}" stroke-opacity=".35"/>
      </g>`;
      if (rand() > .72) out += `<rect x="${x + w * .3}" y="${y - 12}" width="${w * .3}" height="10" fill="${tint}" fill-opacity=".22"/>`;
    }
  }
  return out;
}
function shelves(rand, cols = 9, rows = 5, round = true) {
  let out = '';
  const cw = 1520 / cols, ch = 470 / rows;
  for (let r = 0; r < rows; r++) {
    const y = 150 + r * ch;
    out += `<line x1="40" y1="${y + ch - 12}" x2="${1560}" y2="${y + ch - 12}" stroke="#000" stroke-opacity=".45" stroke-width="2"/>`;
    for (let c = 0; c < cols; c++) {
      const x = 50 + c * cw, h = ch - 26;
      if (round) {
        out += `<g opacity="${.35 + rand() * .5}"><rect x="${x + 6}" y="${y + 6}" width="${cw - 30}" height="${h}" rx="7" fill="none" stroke="#000" stroke-opacity=".5" stroke-width="1.6"/>
        <ellipse cx="${x + 6 + (cw - 30) / 2}" cy="${y + 10}" rx="${(cw - 34) / 2}" ry="6" fill="#000" fill-opacity=".16"/></g>`;
      } else {
        out += `<g opacity="${.3 + rand() * .45}"><rect x="${x + 5}" y="${y + 8 + rand() * 8}" width="${cw * .38}" height="${h - 10}" fill="none" stroke="#000" stroke-opacity=".45" stroke-width="1.4"/>
        <rect x="${x + 8 + cw * .42}" y="${y + 14 + rand() * 10}" width="${cw * .3}" height="${h - 16}" fill="#000" fill-opacity=".1" stroke="#000" stroke-opacity=".3" stroke-width="1"/></g>`;
      }
    }
  }
  return out;
}
function smoke(rand, x, y) {
  let d = `M${x} ${y}`;
  let yy = y, xx = x;
  for (let i = 0; i < 9; i++) {
    const dx = (rand() - .5) * 42;
    yy -= 34; xx += dx;
    d += ` Q ${R(xx - dx / 2)} ${R(yy + 20)} ${R(xx)} ${R(yy)}`;
  }
  return `<path class="smoke" d="${d}" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="2.4" stroke-linecap="round"/>`;
}
function hills(rand, base, amp, color, op) {
  let d = `M0 ${base}`;
  for (let x = 0; x <= 1600; x += 55) {
    const y = base - Math.abs(Math.sin(x / 260 + rand() * .6)) * amp - rand() * 10;
    d += ` L${x} ${R(y)}`;
  }
  d += ` L1600 900 L0 900 Z`;
  return `<path d="${d}" fill="${color}" fill-opacity="${op}"/>`;
}

const _backdropCache = new Map();
/* --------------------------------------------------------- 場面別 SVG ----- */
export function backdropSVG(asset) {
  const cacheKey = asset ? (asset.id + '|' + (asset.meta||'')) : 'null';
  if(_backdropCache.has(cacheKey)) return _backdropCache.get(cacheKey);
  const meta = (asset && asset.meta) || '';
  const [kindRaw, timeRaw] = meta.split('/');
  const kind = kindRaw || 'kyoshitsu';
  const time = timeRaw || (/(asa)$/.test(asset?.id || '') ? 'asa' : 'hiru');
  const mood = MOODS[time] || MOODS.hiru;
  const rand = rng(hash(asset ? asset.id : 'x'));
  const W = 1600, H = 900;
  let g = '';

  // 空・床の地色
  g += `<defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mood.sky[0]}"/><stop offset="1" stop-color="${mood.sky[1]}"/></linearGradient>
    <linearGradient id="flr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mood.ink}" stop-opacity=".18"/><stop offset="1" stop-color="${mood.ink}" stop-opacity=".42"/></linearGradient>
    <radialGradient id="lamp" cx="50%" cy="46%" r="58%"><stop offset="0" stop-color="${mood.warm}" stop-opacity=".55"/><stop offset="1" stop-color="${mood.warm}" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#sky)"/>`;

  switch (kind) {
    case 'kyoshitsu': case 'haru': case 'suunengo': {
      g += `<rect y="0" width="${W}" height="520" fill="#000" fill-opacity=".04"/>`;
      g += windows(mood, kind === 'haru' ? 5 : 5, 150, 300);
      if (kind !== 'haru') g += `<rect x="90" y="470" width="470" height="180" fill="${mood.ink}" fill-opacity=".18" stroke="${mood.ink}" stroke-opacity=".5" stroke-width="2"/>
        <line x1="90" y1="640" x2="560" y2="640" stroke="#fff" stroke-opacity=".25"/>`;
      g += `<rect y="520" width="${W}" height="380" fill="url(#flr)"/>`;
      if (kind !== 'haru') g += desks(rand, kind === 'suunengo' ? 4 : 4, 5, mood.ink);
      g += contourField(rand, 6, 300, 90, mood.ink, .07);
      break;
    }
    case 'rouka': case 'kaidan': {
      g += `<path d="M0 900 L640 470 L1600 470 L1600 900 Z" fill="url(#flr)"/>`;
      g += `<path d="M0 60 L640 420 L1600 420 L1600 60 Z" fill="#000" fill-opacity=".06"/>`;
      for (let i = 0; i < 5; i++) {
        const t = i / 5, x = 120 + t * 520, y = 250 + t * 130;
        g += `<rect x="${x}" y="${y}" width="${160 - t * 90}" height="${300 - t * 150}" fill="${mood.warm}" fill-opacity=".18" stroke="${mood.ink}" stroke-opacity=".4"/>`;
      }
      if (kind === 'kaidan') {
        let d = 'M120 880';
        for (let i = 0; i < 12; i++) d += ` h${60 - i * 2} v${-28 + i * .6}`;
        g += `<path d="${d}" fill="none" stroke="${mood.ink}" stroke-opacity=".55" stroke-width="2.4"/>
              <path d="M120 720 L700 420" stroke="${mood.ink}" stroke-opacity=".4" stroke-width="3"/>
              <rect x="900" y="180" width="300" height="200" fill="${mood.ink}" fill-opacity=".12" stroke="${mood.ink}" stroke-opacity=".4"/>`;
      }
      g += contourField(rand, 5, 640, 70, mood.ink, .06);
      break;
    }
    case 'hokanko': case 'shoko': case 'toshoshitsu': {
      g += `<rect width="${W}" height="${H}" fill="${mood.ink}" fill-opacity=".08"/>`;
      g += shelves(rand, kind === 'hokanko' ? 10 : 8, kind === 'shoko' ? 6 : 4, kind === 'hokanko');
      g += `<rect y="640" width="${W}" height="260" fill="url(#flr)"/>`;
      if (kind !== 'shoko') g += `<rect x="520" y="600" width="560" height="26" fill="${mood.ink}" fill-opacity=".3"/>
        <rect x="540" y="626" width="18" height="140" fill="${mood.ink}" fill-opacity=".28"/>
        <rect x="1050" y="626" width="18" height="140" fill="${mood.ink}" fill-opacity=".28"/>`;
      g += `<g class="dust"><circle cx="300" cy="300" r="2" fill="#fff" opacity=".5"/><circle cx="760" cy="220" r="2.4" fill="#fff" opacity=".4"/><circle cx="1180" cy="360" r="2" fill="#fff" opacity=".45"/></g>`;
      break;
    }
    case 'jimushitsu': {
      g += windows(mood, 4, 120, 210);
      g += `<rect y="500" width="${W}" height="400" fill="url(#flr)"/>`;
      for (let i = 0; i < 4; i++) {
        const x = 90 + i * 380;
        g += `<g stroke="${mood.ink}" stroke-opacity=".45" fill="#000" fill-opacity=".08">
          <rect x="${x}" y="${540 + i * 24}" width="330" height="18"/><rect x="${x + 10}" y="${558 + i * 24}" width="12" height="110"/>
          <rect x="${x + 300}" y="${558 + i * 24}" width="12" height="110"/>
          <rect x="${x + 40}" y="${498 + i * 24}" width="80" height="44" rx="4"/>
          <path d="M${x + 150} ${500 + i * 24} h80 v40 h-80 z" fill="${mood.ink}" fill-opacity=".16"/></g>`;
      }
      break;
    }
    case 'suiko': {
      g += `<rect y="0" width="${W}" height="440" fill="url(#sky)"/>`;
      g += hills(rand, 430, 130, mood.ink, .3);
      g += hills(rand, 450, 70, mood.ink, .2);
      g += `<rect y="440" width="${W}" height="460" fill="${mood.sky[0]}" fill-opacity=".8"/>`;
      for (let i = 0; i < 26; i++) {
        const y = 470 + i * 16, w = 300 + rand() * 900;
        g += `<line x1="${(1600 - w) / 2 + rand() * 200}" y1="${y}" x2="${(1600 - w) / 2 + w}" y2="${y}" stroke="#fff" stroke-opacity="${.1 + rand() * .18}" stroke-width="${1 + rand()}"/>`;
      }
      for (let i = 0; i < 4; i++) g += `<ellipse class="ripple" cx="${280 + i * 380}" cy="${600 + i * 60}" rx="${40 + i * 20}" ry="${9 + i * 3}" fill="none" stroke="#fff" stroke-opacity=".3"/>`;
      g += `<g stroke="${mood.ink}" stroke-opacity=".55" fill="none" stroke-width="2.5" stroke-linecap="round">
        <path d="M60 470 q22 -60 60 -66 q-14 40 -4 66"/><path d="M1540 486 q-26 -70 -66 -78 q16 46 6 78"/></g>`;
      break;
    }
    case 'koutei': case 'okujou': {
      g += `<rect width="${W}" height="520" fill="url(#sky)"/>`;
      if (kind === 'okujou') g += `<path d="M0 520 H1600 V900 H0 Z" fill="${mood.ink}" fill-opacity=".16"/>`;
      else g += `<path d="M0 520 H1600 V900 H0 Z" fill="${mood.ink}" fill-opacity=".1"/><g stroke="${mood.ink}" stroke-opacity=".22">${Array.from({ length: 24 }, (_, i) => `<line x1="${i * 70}" y1="520" x2="${i * 70 - 120}" y2="900"/>`).join('')}</g>`;
      g += `<g stroke="${mood.ink}" stroke-opacity=".5" stroke-width="2.4" fill="none">
        <line x1="0" y1="520" x2="1600" y2="520"/>
        ${Array.from({ length: 17 }, (_, i) => `<line x1="${i * 100}" y1="430" x2="${i * 100}" y2="520"/>`).join('')}
        <line x1="0" y1="430" x2="1600" y2="430"/></g>`;
      if (kind === 'okujou') g += `<g stroke="${mood.ink}" stroke-opacity=".28">${Array.from({ length: 34 }, (_, i) => `<line x1="${i * 50 - 200}" y1="430" x2="${i * 50 + 60}" y2="520"/>`).join('')}</g>`;
      else g += `<g>${Array.from({ length: 5 }, (_, i) => `<path d="M${180 + i * 300} 520 q-6 -120 -14 -180" stroke="${mood.ink}" stroke-opacity=".4" stroke-width="6" fill="none"/>`).join('')}</g>
        <g fill="${mood.ink}" fill-opacity=".2">${Array.from({ length: 6 }, (_, i) => `<rect x="${120 + i * 260}" y="240" width="150" height="70" rx="4" transform="rotate(${(rand() - .5) * 6} ${195 + i * 260} 275)"/>`).join('')}</g>`;
      g += hills(rand, 430, 60, mood.ink, .12);
      break;
    }
    case 'taiikukan': case 'sotsugyou': {
      g += `<rect width="${W}" height="${H}" fill="${mood.ink}" fill-opacity=".07"/>`;
      g += `<g stroke="${mood.ink}" stroke-opacity=".4" stroke-width="2.4" fill="none">
        ${kind === 'taiikukan'
          ? [0, 1, 2, 3, 4].map(i => `<path d="M-40 ${110 + i * 62} Q800 ${10 + i * 58} 1640 ${110 + i * 62}"/>`).join('')
          : `<rect x="240" y="150" width="1120" height="300" fill="${mood.ink}" fill-opacity=".1"/><line x1="240" y1="450" x2="1360" y2="450"/>`}
      </g>`;
      g += `<rect y="560" width="${W}" height="340" fill="${mood.ink}" fill-opacity=".12"/>`;
      const rows = kind === 'sotsugyou' ? 5 : 4;
      for (let r = 0; r < rows; r++) {
        const y = 590 + r * 70, sc = .8 + r * .1;
        for (let c = 0; c < 11; c++) {
          const x = 80 + c * 145 * sc - r * 12;
          g += `<path d="M${x} ${y} h${44 * sc} v${-34 * sc} h${-44 * sc} z" fill="${mood.ink}" fill-opacity=".26"/>`;
        }
      }
      if (kind === 'taiikukan') g += `<g stroke="${mood.ink}" stroke-opacity=".38" fill="none" stroke-width="3"><circle cx="250" cy="330" r="42"/><rect x="200" y="270" width="100" height="14"/></g>`;
      g += contourField(rand, 4, 250, 60, mood.ink, .05);
      break;
    }
    case 'densha': {
      g += `<rect width="${W}" height="${H}" fill="#12100e"/>`;
      g += `<rect x="60" y="60" width="1480" height="640" rx="46" fill="url(#sky)"/>`;
      g += `<g clip-path="url(#win)">${''}</g>`;
      g += hills(rand, 620, 150, mood.ink, .3);
      g += `<g class="poles" stroke="${mood.ink}" stroke-opacity=".5" stroke-width="9">
        ${[0, 1, 2, 3].map(i => `<line x1="${180 + i * 420}" y1="120" x2="${180 + i * 420}" y2="600"/>`).join('')}</g>`;
      g += `<g stroke="${mood.ink}" stroke-opacity=".22">${Array.from({ length: 22 }, (_, i) => `<line x1="60" y1="${340 + i * 12}" x2="1540" y2="${320 + i * 12}"/>`).join('')}</g>`;
      g += `<rect x="60" y="60" width="1480" height="640" rx="46" fill="none" stroke="#0b0a09" stroke-width="46"/>`;
      g += `<rect y="700" width="${W}" height="200" fill="#0d0b0a"/>
            <path d="M120 700 q220 -40 700 -34 t660 34 v60 H120 z" fill="${mood.ink}" fill-opacity=".5"/>`;
      g += `<rect x="360" y="120" width="120" height="90" fill="#000" fill-opacity=".55" rx="6"/>`;
      break;
    }
    case 'namiki': {
      g += `<rect width="${W}" height="560" fill="url(#sky)"/>`;
      g += `<path d="M640 560 L760 300 L840 300 L960 560 Z" fill="${mood.ink}" fill-opacity=".14"/>`;
      g += `<rect y="540" width="${W}" height="360" fill="${mood.ink}" fill-opacity=".12"/>`;
      for (let side = -1; side <= 1; side += 2) {
        for (let i = 0; i < 6; i++) {
          const t = i / 6, x = 800 + side * (180 + t * 620), y = 560 - t * 180, h = 250 * (1 - t * .55);
          g += `<g stroke="${mood.ink}" stroke-opacity=".5" fill="none" stroke-linecap="round" stroke-width="${7 * (1 - t * .55)}">
            <path d="M${x} ${y} q${side * 8} ${-h * .5} 0 ${-h}"/>
            ${Array.from({ length: 5 }, (_, k) => `<path d="M${x} ${y - h * (.45 + k * .11)} q${(k % 2 ? 1 : -1) * (40 - t * 20)} ${-24 - k * 5} ${((k % 2 ? 1 : -1) * (82 - t * 34))} ${-30 - k * 3}"/>`).join('')}
          </g>`;
          g += `<g fill="#f2d7dc" fill-opacity="${.42 - t * .18}">${Array.from({ length: 12 }, () => `<circle cx="${R(x + (rand() - .5) * (150 - t * 60))}" cy="${R(y - h * (.55 + rand() * .5))}" r="${R(9 - t * 4)}"/>`).join('')}</g>`;
        }
      }
      break;
    }
    case 'minamitou': {
      g += `<rect width="${W}" height="520" fill="url(#sky)"/>`;
      g += windows({ ...mood, ink: '#26364f' }, 4, 140, 260);
      g += `<rect y="520" width="${W}" height="380" fill="url(#flr)"/>`;
      g += `<rect x="120" y="470" width="700" height="200" fill="#243a5c" fill-opacity=".5" stroke="#243a5c" stroke-opacity=".6" stroke-width="2"/>
            <g stroke="#fff" stroke-opacity=".5" fill="none">
            <path d="M180 520 h240 M180 560 h360 M180 600 h160 M600 540 v60 M640 520 l80 100 M720 520 l-80 100"/></g>`;
      g += desks(rand, 4, 5, '#26364f');
      break;
    }
    case 'butsudan': {
      g += `<rect width="${W}" height="${H}" fill="${mood.ink}" fill-opacity=".14"/>`;
      g += `<rect x="470" y="120" width="660" height="620" fill="#000" fill-opacity=".18" stroke="${mood.ink}" stroke-opacity=".5" stroke-width="3"/>
            <rect x="560" y="210" width="200" height="250" fill="${mood.warm}" fill-opacity=".16" stroke="${mood.ink}" stroke-opacity=".45" stroke-width="2"/>
            <rect x="840" y="230" width="150" height="190" fill="${mood.ink}" fill-opacity=".22" stroke="${mood.ink}" stroke-opacity=".45"/>
            <rect x="620" y="600" width="360" height="24" fill="${mood.ink}" fill-opacity=".35"/>
            <rect x="700" y="530" width="70" height="70" rx="8" fill="${mood.ink}" fill-opacity=".3"/>
            <circle cx="735" cy="510" r="12" fill="#ffcf86" fill-opacity=".85"/>`;
      g += smoke(rand, 735, 500);
      g += `<radialGradient id="glow"><stop offset="0" stop-color="#ffd79a" stop-opacity=".5"/><stop offset="1" stop-color="#ffd79a" stop-opacity="0"/></radialGradient>
            <circle cx="735" cy="512" r="150" fill="url(#glow)"/>`;
      g += `<path d="M0 740 H1600" stroke="${mood.ink}" stroke-opacity=".4" stroke-width="2"/>`;
      break;
    }
    case 'hawaii': case 'yama': case 'yakou': {
      const harsh = kind === 'hawaii';
      g += `<rect width="${W}" height="${H}" fill="url(#sky)"/>`;
      g += harsh
        ? `<g fill="${mood.ink}" fill-opacity=".55">${Array.from({ length: 16 }, () => {
          const x = rand() * 1600, y = 480 + rand() * 380, r = 40 + rand() * 130;
          return `<path d="M${R(x - r)} ${R(y)} q${R(r * .3)} ${R(-r * .7)} ${R(r)} ${R(-r * .18)} q${R(r * .6)} ${R(r * .5)} ${R(r * .2)} ${R(r * .55)} l${R(-r * 2.2)} 0 z"/>`;
        }).join('')}</g>`
        : hills(rand, 520, 250, mood.ink, .34) + hills(rand, 620, 160, mood.ink, .22) + hills(rand, 740, 90, mood.ink, .16);
      g += contourField(rand, 10, kind === 'yama' ? 420 : 620, 210, '#fff', .09);
      g += `<circle cx="${harsh ? 1290 : 1180}" cy="150" r="${harsh ? 62 : 46}" fill="#fff" fill-opacity="${harsh ? .7 : .4}"/>`;
      if (kind === 'yakou') g += `<g fill="${mood.ink}" fill-opacity=".5" stroke="#fff" stroke-opacity=".25">
        <path d="M300 820 l120 -190 l120 190 z"/><path d="M620 830 l100 -160 l100 160 z"/></g>
        <g stroke="#fff" stroke-opacity=".35"><line x1="540" y1="630" x2="760" y2="670"/><line x1="720" y1="670" x2="900" y2="800"/></g>`;
      break;
    }
    default:
      g += contourField(rand, 10, 420, 220, mood.ink, .1);
      g += `<rect y="560" width="${W}" height="340" fill="url(#flr)"/>`;
  }

  // 紙の質感・滲み（numOctaves 2→1 で軽量化、視覚差は極小）
  g += `<rect width="${W}" height="${H}" fill="url(#lamp)" opacity=".5"/>`;
  g += `<filter id="paper"><feTurbulence type="fractalNoise" baseFrequency=".88" numOctaves="1" result="n"/>
        <feColorMatrix in="n" type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope=".06"/></feComponentTransfer>
        <feComposite operator="over" in2="SourceGraphic"/></filter>`;
  g += `<rect width="${W}" height="${H}" filter="url(#paper)" opacity=".42"/>`;

  const style = `<style>
    .poles{animation:poles .9s linear infinite}
    @keyframes poles{from{transform:translateX(0)}to{transform:translateX(-420px)}}
    .dust circle{animation:dust 9s ease-in-out infinite}
    @keyframes dust{0%,100%{transform:translate(0,0);opacity:.2}50%{transform:translate(24px,-40px);opacity:.7}}
    .smoke{stroke-dasharray:1200;animation:smoke 12s linear infinite;opacity:.55}
    @keyframes smoke{from{stroke-dashoffset:1200}to{stroke-dashoffset:-1200}}
    .ripple{animation:rip 6s ease-out infinite}
    @keyframes rip{0%{transform:scale(.4);opacity:.7}100%{transform:scale(2.2);opacity:0}}
  </style>`;
  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">${style}${g}</svg>`;
}

/* ============================================================ 立ち絵 ===== */
const FIG = {
  katsuya:        { h: 640, sh: 116, hair: 'short', tie: '#6b6a55', prop: 'tube', gender: 'm' },
  ryoma:          { h: 590, sh: 104, hair: 'messy', tie: '#9c2f40', prop: 'phone', gender: 'm' },
  mie:            { h: 600, sh: 100, hair: 'side', tie: '#9c2f40', prop: 'pocket', gender: 'm' },
  terachi:        { h: 585, sh: 98, hair: 'curly', tie: '#9c2f40', prop: 'paper', gender: 'm' },
  satou:          { h: 596, sh: 102, hair: 'low', tie: '#9c2f40', prop: 'game', gender: 'm' },
  rei:            { h: 604, sh: 96, hair: 'smooth', tie: '#9c2f40', prop: 'book', gender: 'm' },
  izaki:          { h: 592, sh: 104, hair: 'short', tie: '#9c2f40', prop: 'none', gender: 'm' },
  izumi:          { h: 578, sh: 94, hair: 'bob', tie: '#9c2f40', prop: 'none', gender: 'm' },
  meshino:        { h: 602, sh: 106, hair: 'up', tie: '#9c2f40', prop: 'none', gender: 'm' },
  kuraishi:       { h: 566, sh: 92, hair: 'buzz', tie: '#9c2f40', prop: 'note', gender: 'm' },
  futami:         { h: 574, sh: 88, hair: 'tied', tie: '#4f5d6b', prop: 'mug', gender: 'f' },
  sakura:         { h: 590, sh: 94, hair: 'short2', tie: '#2a4372', prop: 'clip', gender: 'm' },
  mitsumine:      { h: 572, sh: 90, hair: 'pony', tie: '#2a4372', prop: 'none', gender: 'f' },
  naitou:         { h: 568, sh: 86, hair: 'long', tie: '#2a4372', prop: 'book', gender: 'f' },
  inaba:          { h: 616, sh: 108, hair: 'hat', tie: '#7b6a4a', prop: 'point', gender: 'm' },
  'wakaki-katsuya': { h: 592, sh: 100, hair: 'short', tie: '#9c2f40', prop: 'bag', gender: 'm' },
};

/* 立ち絵SVGの生成結果キャッシュ。
   かつては発話行ごとに innerHTML へ書き直していた（≒毎行 SVG 再パース＋
   blurフィルタ再ラスタライズ → もたつき・一瞬消える原因）。
   生成物は slug|expr で一意なので初回だけ組み立てて使い回す。 */
const _figureCache = new Map();

export function figureSVG(slug, expr = '01', mood = 'normal') {
  // mood（talk 時の揺れ）は CSS クラス側で表現するため、生成物は slug|expr のみでキャッシュする
  const key = slug + '|' + expr;
  const hit = _figureCache.get(key);
  if (hit) return hit;
  const f = FIG[slug] || FIG.mie;
  const rand = rng(hash(slug + '|' + expr));
  const H = 700, cx = 210;
  const bodyTop = H - f.h;
  const head = 44 + (f.gender === 'f' ? -3 : 2);
  const neck = bodyTop + head * 2 - 6;
  const shoulderY = neck + 22;
  const hemY = H - 4;
  const ink = 'rgba(26,20,14,.62)';
  const soft = 'rgba(26,20,14,.34)';
  let g = '';

  // 髪型（後ろ）
  let hair = '';
  switch (f.hair) {
    case 'long': hair = `<path d="M${cx - head - 8} ${bodyTop + head - 6} q${-16} ${180} 6 ${250} h${(head + 8) * 2 - 12} q22 -70 6 -250 z" fill="${soft}"/>`; break;
    case 'pony': hair = `<path d="M${cx + head - 6} ${bodyTop + head - 14} q40 30 26 96 q-6 34 -30 40 q18 -60 -12 -96 z" fill="${soft}"/>`; break;
    case 'tied': hair = `<path d="M${cx - head - 4} ${bodyTop + head - 12} q${-8} 74 8 96 l${head * 2 - 8} 0 q16 -22 8 -96 z" fill="${soft}"/>`; break;
    case 'bob': hair = `<path d="M${cx - head - 10} ${bodyTop + head - 8} q-4 78 10 96 l${(head + 10) * 2 - 20} 0 q14 -18 10 -96 z" fill="${soft}"/>`; break;
    case 'messy': hair = `<path d="M${cx - head - 4} ${bodyTop + head - 16} q6 -34 ${head} -36 q${head - 4} 2 ${head + 2} 36 q-16 -16 -30 -12 q14 12 4 24 q-16 -14 -30 -6 q10 10 6 22 q-14 -12 -20 -28 z" fill="${soft}"/>`; break;
    case 'curly': hair = Array.from({ length: 9 }, (_, i) => `<circle cx="${R(cx - head + i * (head * 2 / 8))}" cy="${R(bodyTop + head - 20 - Math.sin(i) * 10)}" r="13" fill="${soft}"/>`).join(''); break;
    case 'hat': hair = `<path d="M${cx - head - 16} ${bodyTop + head - 8} q${head + 16} -70 ${head * 2 + 32} 0 z" fill="${soft}"/>
      <path d="M${cx - head - 30} ${bodyTop + head - 10} q${head + 30} 22 ${head * 2 + 60} 0 q-4 -12 -14 -14 q-${head * 2 + 20} -22 -${head * 2 + 46} 14 z" fill="${ink}"/>`; break;
    case 'buzz': hair = ''; break;
    case 'up': hair = `<path d="M${cx - head + 4} ${bodyTop + head - 22} q${head - 4} -40 ${head * 2 - 8} -6 q-14 -30 -${head * 2 - 8} 6 z" fill="${soft}"/>`; break;
    case 'low': hair = `<path d="M${cx - head - 6} ${bodyTop + head - 4} q-6 66 10 86 l14 -4 q-14 -40 -6 -84 z" fill="${soft}"/>
      <path d="M${cx + head + 6} ${bodyTop + head - 4} q6 66 -10 86 l-14 -4 q14 -40 6 -84 z" fill="${soft}"/>`; break;
    case 'side': hair = `<path d="M${cx - head - 6} ${bodyTop + head - 10} q${head * .4} -40 ${head * 2 + 12} -22 q-24 -6 -34 10 q22 -4 30 12 z" fill="${soft}"/>`; break;
    case 'smooth': hair = `<path d="M${cx - head - 6} ${bodyTop + head - 6} q6 -50 ${head + 6} -50 q${head} 0 ${head + 6} 50 q-10 -30 -${head + 6} -32 q-24 0 -${head + 18} 32 z" fill="${soft}"/>`; break;
    default: hair = `<path d="M${cx - head - 4} ${bodyTop + head - 6} q4 -46 ${head + 4} -48 q${head} 2 ${head + 2} 48 q-10 -26 -${head + 4} -26 q-22 0 -${head} 26 z" fill="${soft}"/>`;
  }
  // 頭
  g += hair;
  g += `<ellipse cx="${cx}" cy="${R(bodyTop + head)}" rx="${head}" ry="${head + 6}" fill="${ink}"/>`;
  // 首〜胴（talk 時の前後のめりは CSS の .chr.talk で動かす）
  g += `<path d="M${cx - 16} ${R(neck)} h32 v16 l${R(f.sh / 2)} ${R(20)} v${R(hemY - shoulderY - 20)} h${R(-f.sh)} v${R(-(hemY - shoulderY - 20))} l${R(f.sh / 2 - 16)} -16 z"
        fill="${ink}"/>`;
  // 肩・腕
  g += `<path d="M${cx - R(f.sh / 2)} ${R(shoulderY + 16)} q${-16} ${R(f.h * .32)} ${-2} ${R(f.h * .46)} l26 -4 q${-10} ${R(-f.h * .2)} ${-2} ${R(-f.h * .26)} z" fill="${ink}" opacity=".82"/>
        <path d="M${cx + R(f.sh / 2)} ${R(shoulderY + 16)} q16 ${R(f.h * .32)} 2 ${R(f.h * .46)} l-26 -4 q10 ${R(-f.h * .2)} 2 ${R(-f.h * .26)} z" fill="${ink}" opacity=".82"/>`;
  // 襟・ネクタイ（北棟＝えんじ／南棟＝紺）
  g += `<path d="M${cx - 20} ${R(neck + 6)} L${cx} ${R(neck + 26)} L${cx + 20} ${R(neck + 6)} l-6 12 L${cx} ${R(neck + 30)} l6 -6 z" fill="#efe7d4" opacity=".55"/>
        <path d="M${cx} ${R(neck + 24)} l8 10 l-4 ${R(f.gender === 'f' ? 54 : 78)} l-8 0 l-4 -${R(f.gender === 'f' ? 54 : 78)} z" fill="${f.tie}" opacity=".85"/>`;
  // 小道具
  const props = {
    phone: `<rect x="${cx + 26}" y="${R(neck + 96)}" width="30" height="52" rx="5" fill="#0f0d0b" stroke="#efe7d4" stroke-opacity=".3"/>`,
    game: `<rect x="${cx - 66}" y="${R(neck + 104)}" width="70" height="40" rx="9" fill="#0f0d0b" stroke="#efe7d4" stroke-opacity=".35"/>`,
    tube: `<g transform="rotate(-18 ${cx + 60} ${R(neck + 120)})"><rect x="${cx + 46}" y="${R(neck + 30)}" width="26" height="190" rx="12" fill="${soft}" stroke="${ink}"/><ellipse cx="${cx + 59}" cy="${R(neck + 30)}" rx="13" ry="6" fill="#efe7d4" opacity=".35"/></g>`,
    paper: `<g transform="rotate(9 ${cx - 70} ${R(neck + 130)})"><rect x="${cx - 110}" y="${R(neck + 78)}" width="78" height="104" fill="#f3ecd8" opacity=".82" stroke="${ink}"/><line x1="${cx - 100}" y1="${R(neck + 108)}" x2="${cx - 42}" y2="${R(neck + 108)}" stroke="${ink}" stroke-opacity=".5"/><line x1="${cx - 100}" y1="${R(neck + 128)}" x2="${cx - 60}" y2="${R(neck + 128)}" stroke="${ink}" stroke-opacity=".5"/></g>`,
    book: `<rect x="${cx - 92}" y="${R(neck + 108)}" width="70" height="90" rx="4" fill="${soft}" stroke="${ink}"/>`,
    note: `<g transform="rotate(-7 ${cx - 66} ${R(neck + 120)})"><rect x="${cx - 104}" y="${R(neck + 82)}" width="72" height="92" fill="#f3ecd8" opacity=".78" stroke="${ink}"/>
      ${Array.from({ length: 5 }, (_, k) => `<line x1="${cx - 96}" y1="${R(neck + 100 + k * 14)}" x2="${cx - 44}" y2="${R(neck + 100 + k * 14)}" stroke="${ink}" stroke-opacity=".4"/>`).join('')}</g>`,
    mug: `<rect x="${cx + 34}" y="${R(neck + 108)}" width="30" height="34" rx="6" fill="${soft}"/>`,
    clip: `<rect x="${cx - 84}" y="${R(neck + 96)}" width="58" height="76" rx="3" fill="#f3ecd8" opacity=".7" stroke="${ink}"/>`,
    point: `<path d="M${cx + R(f.sh / 2)} ${R(shoulderY + 20)} l150 -150 l16 16 l-140 152 z" fill="${ink}" opacity=".8"/>`,
    bag: `<path d="M${cx - R(f.sh / 2) - 6} ${R(neck + 90)} h58 v90 h-58 z" fill="${soft}"/>`,
  };
  if (props[f.prop]) g += props[f.prop];
  // 輪郭光
  g += `<path d="M${cx - 4} ${R(bodyTop - 4)} q${head + 8} 6 ${head + 6} ${head + 10}" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="3"/>`;
  // 表情の揺らぎ（まぶしさ・影の濃さで表情を匂わせる）
  const exprN = parseInt(expr, 10) || 1;
  const darken = [0, 0, .05, .1, .06, .14, .0, .04, .18, .3, .1][Math.min(exprN, 10)] || 0;
  if (darken) g += `<rect width="420" height="${H}" fill="#000" fill-opacity="${darken}"/>`;
  if (exprN >= 8) g += `<circle cx="${cx}" cy="${R(neck + 120)}" r="300" fill="url(#halo)"/>
    <radialGradient id="halo"><stop offset="0" stop-color="#ffe9bd" stop-opacity=".35"/><stop offset="1" stop-color="#ffe9bd" stop-opacity="0"/></radialGradient>`;
  // 全身にかける feGaussianBlur は撤廃（毎行の再パース時にフィルタの
  // ラスタライズコストが支配的だった。線画はシャープなままでも紙面の質感は
  // mix-blend-mode:multiply 側で担保される）
  const svg = `<svg viewBox="0 0 420 700" preserveAspectRatio="xMidYMax meet" xmlns="http://www.w3.org/2000/svg">${g}</svg>`;
  _figureCache.set(key, svg);
  return svg;
}

/* ============================================================ パーティクル = */
export class Particles {
  constructor(canvas) { this.cv = canvas; this.ctx = canvas ? canvas.getContext('2d', { alpha: true }) : null; this.mode = null; this.parts = []; this.raf = 0; this._lastDraw = 0; }
  set(mode) {
    if (mode === this.mode) return;
    // OSの省モーション設定では粒子を停止（バッテリー/酔い対策）
    if (prefersReduced() && mode) {
      this.mode = null;
      this.parts = [];
      this.clear();
      return;
    }
    this.mode = mode;
    this.parts = [];
    if (!mode) { this.clear(); return; }
    if (!this.ctx) return;
    // 画面が大きい/高DPR端末では粒子数を少し絞って軽量化（見た目は密度調整で維持）
    const isLow = (()=>{ try{ return (navigator.hardwareConcurrency && navigator.hardwareConcurrency<=4) || (window.devicePixelRatio||1) > 1.8; }catch(_){ return false; } })();
    const base = mode === 'sakura' ? 52 : mode === 'ash' ? 28 : mode === 'yoru' ? 36 : 48;
    const n = isLow ? Math.round(base * 0.7) : base;
    for (let i = 0; i < n; i++) this.parts.push(this.spawn(true));
    if (!this.raf) this.tick();
  }
  spawn(init) {
    const { width: w, height: h } = this.cv;
    const m = this.mode;
    const p = { x: Math.random() * w, y: init ? Math.random() * h : -20, r: 0, v: 0, a: 0, ph: Math.random() * 6.28, rot: 0, spin: (Math.random()-.5)*.045, depth: .7 + Math.random()*.6 };
    if (m === 'dust') {
      p.r = (Math.random() * 1.9 + .45) * p.depth;
      p.v = -(Math.random() * .11 + .02) * (0.7 + p.depth*.5);
      p.a = (Math.random() * .38 + .12) * (0.8 + p.depth*.3);
      p.vx = (Math.random() * .15 - .075) * p.depth;
      p.blur = p.depth < .85 ? 0.6 : 0;
    } else if (m === 'sakura') {
      p.r = (Math.random() * 5.2 + 3.2) * (0.75 + p.depth*.4);
      p.v = (Math.random() * .62 + .28) * (0.8 + p.depth*.45);
      p.a = Math.random() * .42 + .28;
      p.vx = (Math.random() * .48 + .1) * (0.9 + p.depth*.2);
      p.wobble = Math.random()*1.6 + .6;
    } else if (m === 'ash') {
      p.r = (Math.random() * 2.4 + .7) * p.depth;
      p.v = -(Math.random() * .3 + .09);
      p.a = Math.random() * .28 + .1;
      p.vx = (Math.random() * .18 - .09);
    } else {
      p.r = (Math.random() * 2.8 + .9) * p.depth;
      p.v = (Math.random() * .22 + .05);
      p.a = Math.random() * .72 + .18;
      p.vx = (Math.random()*.14-.07);
    }
    p.y = init ? p.y : (m === 'dust' || m === 'ash' ? h + 10 : -10);
    return p;
  }
  clear() { if (!this.ctx) return; this.ctx.clearRect(0, 0, this.cv.width, this.cv.height); }
  tick() {
    const cv = this.cv, ctx = this.ctx;
    if (!ctx) return;
    const step = (now) => {
      if (!this.mode) { this.raf = 0; return; }
      // 30fps まで間引いて軽量化（見た目は 60fps と差がほぼ分からない）
      if (now && this._lastDraw && now - this._lastDraw < 32) { this.raf = requestAnimationFrame(step); return; }
      this._lastDraw = now || performance.now();
      const w = cv.width, h = cv.height;
      if (w === 0 || h === 0) { this.raf = requestAnimationFrame(step); return; }
      ctx.clearRect(0, 0, w, h);
      const m = this.mode;
      for (let i = 0; i < this.parts.length; i++) {
        const p = this.parts[i];
        p.ph += 0.011 + (p.depth ? (p.depth-0.7)*0.004 : 0);
        const sway = Math.sin(p.ph) * (m === 'sakura' ? (0.9 + (p.wobble||1)*0.45) : 0.18) + Math.cos(p.ph*0.53) * (m === 'sakura' ? 0.35 : 0.06);
        p.x += (p.vx || 0) + sway * 0.22;
        p.y += p.v * (m === 'sakura' ? 1.18 : 1);
        p.rot += p.spin || 0.01;
        const twinkle = m === 'dust' ? (0.55 + Math.sin(p.ph*1.9 + i)*0.45) : (0.75 + Math.sin(p.ph)*0.25);
        if (p.y < -36 || p.y > h + 36 || p.x < -50 || p.x > w + 50) { this.parts[i] = this.spawn(false); continue; }
        if (m === 'sakura') {
          ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
          const depthA = p.depth ? (0.72 + (p.depth-0.7)*0.55) : 1;
          ctx.globalAlpha = p.a * depthA * (0.9 + Math.sin(p.ph*1.3)*0.1);
          const flip = Math.cos(p.rot*2) > 0 ? '#f8e2ea' : '#f3cfdc';
          ctx.fillStyle = flip;
          // shadowBlur はコストが高いため 5px 超の大きめ花びらのみ、かつ低負荷端末では無効
          const useShadow = p.r > 6 && !(navigator.hardwareConcurrency && navigator.hardwareConcurrency<=4);
          if (useShadow) { ctx.shadowColor = 'rgba(255, 220, 232, .35)'; ctx.shadowBlur = 4; } else ctx.shadowBlur = 0;
          ctx.beginPath();
          ctx.moveTo(0, -p.r*0.92);
          ctx.bezierCurveTo(p.r*0.72, -p.r*0.48, p.r*0.58, p.r*0.62, 0, p.r*0.88);
          ctx.bezierCurveTo(-p.r*0.58, p.r*0.62, -p.r*0.72, -p.r*0.48, 0, -p.r*0.92);
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.strokeStyle = 'rgba(200,150,160,.28)'; ctx.lineWidth = 0.6; ctx.beginPath(); ctx.moveTo(0,-p.r*0.5); ctx.lineTo(0,p.r*0.55); ctx.stroke();
          ctx.restore();
        } else {
          const a = p.a * twinkle;
          ctx.globalAlpha = Math.max(0, Math.min(1, a));
          // dust の shadowBlur は高コストのため深度が浅い（手前のぼんやり）のみに限定
          if (p.blur && p.depth > 0.92) { ctx.shadowColor = m === 'dust' ? 'rgba(255,246,222,.7)' : 'rgba(232,226,214,.5)'; ctx.shadowBlur = 3; }
          else ctx.shadowBlur = 0;
          ctx.fillStyle = m === 'dust' ? '#fff7de' : m === 'ash' ? '#e9e2d6' : '#f0e8d8';
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.28319); ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
      ctx.globalAlpha = 1;
      this.raf = requestAnimationFrame(step);
    };
    this.raf = requestAnimationFrame(step);
  }
  resize(w, h) { this.cv.width = w; this.cv.height = h; }
}

/* ============================================================ ステージ ==== */
export class Stage {
  constructor(els, assets) {
    this.el = els;
    this.assets = assets;
    this.bgId = null; this.cgId = null;
    this.chrMap = new Map();
    this._chrTalking = null;   // 最後に applyChr へ渡した話者（未変更なら再描画を省く）
    this._chrRev = 0;          // chrMap の内容が変わった回数
    this._chrRevSeen = -1;     // 前回 applyChr が処理した rev
    this.particles = new Particles(els.fxParticles);
    this.titleFx = els.titleFx ? new Particles(els.titleFx) : null;
    this._bgToken = 0;
    this._cgToken = 0;
    this.t = (ms) => new Promise(r => setTimeout(r, ms));
    this._visPaused = null;
    try {
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          // タブ非表示では粒子を一時停止（復帰時に再開）
          this._visPaused = { p: this.particles.mode, t: this.titleFx ? this.titleFx.mode : null };
          if (this._visPaused.p) this.particles.set(null);
          if (this._visPaused.t && this.titleFx) this.titleFx.set(null);
        } else if (this._visPaused) {
          if (this._visPaused.p) this.particles.set(this._visPaused.p);
          if (this._visPaused.t && this.titleFx) this.titleFx.set(this._visPaused.t);
          this._visPaused = null;
        }
      });
    } catch(_) {}
    // 省モーション変更を監視（ユーザが設定を切り替えたら即反映）
    try {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      const onChange = () => {
        if (mq.matches) {
          if (this.particles.mode) this.particles.set(null);
          if (this.titleFx && this.titleFx.mode) this.titleFx.set(null);
        }
      };
      if (mq.addEventListener) mq.addEventListener('change', onChange);
      else if (mq.addListener) mq.addListener(onChange);
    } catch(_){}
  }
  scaleU() {
    const w = this.el.viewport.clientWidth || 1;
    const h = this.el.viewport.clientHeight || 1;
    const u = (w >= h ? w / 1000 : w / 620);
    const v = u.toFixed(3) + 'px';
    this.el.viewport.style.setProperty('--u', v);
    this.el.stage.style.setProperty('--u', v);
    // DPR は 2 → 1.6 に下げてメモリ/描画コストを約35%削減（Retinaでも視覚差は極小）
    const dpr = Math.min(1.6, window.devicePixelRatio || 1);
    const fit = (cv, pt) => {
      if (!cv || !pt || !pt.cv) return;
      const r = cv.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) pt.resize(Math.round(r.width * dpr), Math.round(r.height * dpr));
    };
    fit(this.el.fxParticles, this.particles);
    fit(this.el.titleFx, this.titleFx);
  }
  isPlaceholder(a) { return !a || a.placeholder !== false; }

  async bg(id, opt = {}) {
    const my = ++this._bgToken;
    const img = this.el.bgImg;
    const back = this.el.bgBack;
    const layer = img.parentElement;   // .lay-bg
    if (!id) {
      this._bgOutgoing?.remove();
      this._bgOutgoing = null;
      img.removeAttribute('src');
      back.innerHTML = '';
      this.bgId = null;
      delete this.el.stage.dataset.bg;
      delete this.el.stage.dataset.bgkind;
      return;
    }
    if (id === this.bgId) return;
    const a = this.assets.byId[id];
    const placeholder = this.isPlaceholder(a);
    // 表示中の背景には触れず、次の画像を先にデコードする。
    if (!placeholder) {
      const next = new Image();
      next.src = a.file;
      try { await next.decode(); }
      catch (e) { return; } // 読み込み失敗時は現在の背景を維持
      if (my !== this._bgToken) return;
    }
    this._bgOutgoing?.remove();
    const outgoing = document.createElement('div');
    outgoing.className = 'bg-outgoing';
    outgoing.setAttribute('aria-hidden', 'true');
    for (const source of [back, img]) {
      const copy = source.cloneNode(true);
      copy.removeAttribute('id');
      outgoing.appendChild(copy);
    }
    const hasPrevious = !!this.bgId;
    const reduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (hasPrevious && !reduced) {
      img.after(outgoing);
      this._bgOutgoing = outgoing;
    }
    // 新背景はいったん透明で差し替え、次のフレームからフェードイン。
    // 旧背景（.bg-outgoing）のフェードアウトと同時に走るので、真のクロスフェードになる。
    if (layer && !reduced) layer.classList.add('bg-enter');
    if (placeholder) {
      back.innerHTML = backdropSVG(a || { id, meta: '' });
      img.removeAttribute('src');
    } else {
      back.innerHTML = '';
      img.src = a.file;
    }
    this.bgId = id;
    if (layer && !reduced) {
      requestAnimationFrame(() => requestAnimationFrame(() => layer.classList.remove('bg-enter')));
    }
    // 新背景の上で旧背景だけをフェードアウト。途中に暗転を挟まない。
    if (outgoing.isConnected) {
      void outgoing.offsetWidth;
      outgoing.classList.add('leaving');
      setTimeout(() => {
        outgoing.remove();
        if (this._bgOutgoing === outgoing) this._bgOutgoing = null;
      }, 1150);
    }
    const kind = ((a && a.meta) || '').split('/')[0];
    this.el.stage.dataset.bgkind = kind;
    this.el.stage.dataset.bg = id;
  }
  mood(time) {
    const m = MOODS[time] || MOODS.hiru;
    const st = this.el.stage;
    st.dataset.light = m.light;
    st.dataset.veil = m.veil || '';
    this.el.bgGrade.style.background = `linear-gradient(180deg,${m.sky[1]}00 0%,${m.sky[0]}22 100%)`;
  }
  cg(id, opt = {}) {
    const st = this.el.stage;
    if (!id) {
      this._cgToken++;
      this.el.layCg.classList.remove('on');
      st.removeAttribute('stage-mode');
      this.el.cgHolder.classList.remove('kb');
      this.cgId = null;
      return;
    }
    // 表示中のCGから別CGへの切り替えは、一度ディップしてから差し替える
    if (this.cgId && this.cgId !== id && this.el.layCg.classList.contains('on')) {
      const my = ++this._cgToken;
      this.el.layCg.classList.remove('on');
      setTimeout(() => {
        if (my !== this._cgToken) return;
        this._cgSwap(id, opt);
        this.el.layCg.classList.add('on');
      }, 380);
      return;
    }
    this._cgToken++;
    this._cgSwap(id, opt);
    this.el.layCg.classList.add('on');
    this.el.cgHolder.classList.toggle('kb', !!opt.kb);
    st.setAttribute('stage-mode', 'cg');
  }
  _cgSwap(id, opt = {}) {
    const a = this.assets.byId[id];
    this.cgId = id;
    if (this.isPlaceholder(a)) {
      this.el.cgBack.innerHTML = this.cgBackdrop(a);
      this.el.cgImg.removeAttribute('src');
    } else {
      this.el.cgBack.innerHTML = '';
      this.el.cgImg.src = a.file;
    }
    this.el.cgHolder.classList.toggle('kb', !!opt.kb);
    this.el.stage.setAttribute('stage-mode', 'cg');
  }
  cgBackdrop(a) {
    const rand = rng(hash((a && a.id) || 'cg'));
    const base = (a && /end/.test((a.meta || '') + (a.id || ''))) ? '#1a1611' : '#151210';
    let shapes = '';
    for (let i = 0; i < 7; i++) {
      const cx = 120 + rand() * 1360, cy = 140 + rand() * 620, r = 90 + rand() * 260;
      shapes += `<circle cx="${R(cx)}" cy="${R(cy)}" r="${R(r)}" fill="#fff" fill-opacity=".0${2 + Math.floor(rand() * 4)}"/>`;
    }
    const c = contourField(rand, 12, 380, 420, '#d9c9a6', .08);
    return `<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <rect width="1600" height="900" fill="${base}"/>${c}${shapes}
      <rect width="1600" height="900" fill="url(#g)"/><defs><radialGradient id="g"><stop offset="0" stop-color="#fff" stop-opacity=".1"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></radialGradient></defs>
    </svg>`;
  }
  setChr(spec) {
    if (spec.clear) { this.chrMap.forEach(v => { v.el.classList.remove('in'); }); this.chrMap.clear(); this._chrRev++; this.applyChr(); return; }
    if (spec.del) { spec.del.forEach(k => this.chrMap.delete(k.trim())); this._chrRev++; this.applyChr(); return; }
    let changed = false;
    Object.entries(spec.set || {}).forEach(([slug, expr]) => {
      const cur = this.chrMap.get(slug);
      if (cur && cur.expr === expr) return;
      changed = true;
      this.chrMap.set(slug, { expr, el: cur && cur.el });
    });
    if (changed) this._chrRev++;
    this.applyChr();
  }
  applyChr(talking = null) {
    // 話者も立ち絵の顔ぶれも変わっていなければ何もしない。
    // （かつてはテキスト1行ごとに全立ち絵のSVGを innerHTML で組み直しており、
    //   1行ごとに「一瞬消える」＋高負荷の原因になっていた）
    if (talking === this._chrTalking && this._chrRev === this._chrRevSeen) return;
    this._chrTalking = talking;
    this._chrRevSeen = this._chrRev;
    const layer = this.el.layChr;
    const keys = [...this.chrMap.keys()];
    const n = keys.length;
    // 大人数でも身長を変えず、左右の余白を使って配置する。
    // 重なった場合は話者を前面へ（下の zIndex 設定）。
    const posArr = keys.map((_, i) => n <= 2
      ? 100 * (i + 1) / (n + 1)
      : 18 + 64 * i / (n - 1));
    keys.forEach((slug, i) => {
      const rec = this.chrMap.get(slug);
      const isNew = !rec.el;
      if (isNew) {
        const el = document.createElement('div');
        el.className = 'chr';
        el.innerHTML = `<div class="sil"></div><img alt=""><div class="rim"></div><div class="nametag"></div>`;
        layer.appendChild(el);
        rec.el = el;
        rec.svgKey = null;   // .sil に差し込んだSVGのキャッシュキー（未構築）
        rec.srcKey = null;   // img に差し込んだ実画像パス
      }
      const pos = posArr[i];
      const enter = pos < 40 ? 'left' : pos > 60 ? 'right' : 'center';
      const el = rec.el;
      el.dataset.enter = enter;
      el.dataset.count = String(n);
      el.dataset.pos = String(pos);
      el.style.setProperty('--chr-delay', `${i*88}ms`);
      el.style.setProperty('--chr-index', String(i));
      // 3人時のごく小さな奥行きのみ。人数による縮小はしない。
      const baseScale = n === 3 ? (i === 1 ? 1.015 : 0.992) : 1;
      el.style.setProperty('--chr-base', String(baseScale));
      el.style.left = `calc(${pos}% - var(--u)*210)`;
      el.style.width = `calc(var(--u)*420)`;
      el.style.height = `calc(var(--u)*640)`;
      const a = this.assets.chrFor(slug, rec.expr);
      const sil = el.querySelector('.sil'), img = el.querySelector('img'), tag = el.querySelector('.nametag');
      if (a && !this.isPlaceholder(a)) {
        if (rec.svgKey !== '') { sil.innerHTML = ''; rec.svgKey = ''; }
        if (rec.srcKey !== a.file) { img.src = a.file; rec.srcKey = a.file; }
        img.style.opacity = '';
      } else {
        const key = slug + '|' + rec.expr;
        // 同一の顔・表情のSVGは使い回す（再パース・再ラスタライズしない）
        if (rec.svgKey !== key) { sil.innerHTML = figureSVG(slug, rec.expr); rec.svgKey = key; }
        if (rec.srcKey !== '') { img.removeAttribute('src'); rec.srcKey = ''; }
      }
      const label = a ? a.label.replace(/^\S+\s/, '') : rec.expr;
      tag.textContent = `${slug} · ${rec.expr} · ${label}`;
      // restart entrance if newly added
      if (isNew) { void el.offsetWidth; }
      el.classList.remove('out');
      el.classList.add('in');
      el.classList.toggle('talk', talking === slug);
      el.classList.toggle('dim', !!talking && talking !== slug);
      // z: talker front, others back-to-front order
      el.style.zIndex = talking === slug ? 9 : String(n - i);
      if (talking === slug) el.style.setProperty('--chr-talk','1');
      else el.style.removeProperty('--chr-talk');
    });
    [...layer.children].forEach(el => {
      const slug = [...this.chrMap.keys()].find(k => this.chrMap.get(k).el === el);
      if (!slug) {
        el.classList.remove('in','talk');
        el.classList.add('out');
        el.style.zIndex = '0';
        setTimeout(() => { if (![...this.chrMap.values()].some(v=>v.el===el)) el.remove(); }, 440);
      }
    });
  }
  fx(name) {
    const st = this.el.stage;
    if (name === 'shake' || name === 'shakeStrong' || name === 'shake-strong') {
      const cls = name === 'shakeStrong' || name === 'shake-strong' ? 'shake-strong' : 'shake';
      st.classList.remove('shake','shake-strong'); void st.offsetWidth;
      st.classList.add(cls); setTimeout(() => st.classList.remove(cls), 480);
    }
    else if (name === 'flash') { const f = this.el.fxFlash; f.classList.remove('go'); void f.offsetWidth; f.classList.add('go'); setTimeout(()=> f.classList.remove('go'), 340); }
    else if (name === 'flashImpact' || name === 'impactFlash') { const f = this.el.fxFlash; f.classList.remove('go'); void f.offsetWidth; f.classList.add('go'); setTimeout(()=> f.classList.remove('go'), 340); }
    else if (name === 'fadeblack') { this.el.fxVeil.style.background = 'rgba(0,0,0,1)'; setTimeout(() => this.el.fxVeil.style.background = '', 200); }
    else if (name === 'blur') { st.dataset.tone = st.dataset.tone === 'dream' ? '' : 'dream'; }
  }
  /** ツッコミ等のインパクト演出：立ち絵に一時クラス＋画面揺れ＋フラッシュ */
  impact(slug, kind='tsukkomi'){
    const rec = this.chrMap.get(slug);
    if(!rec || !rec.el) return;
    const el = rec.el;
    const cls = kind === 'shock' ? 'shock' : kind === 'impact' ? 'impact' : 'tsukkomi';
    el.classList.remove('tsukkomi','shock','impact'); void el.offsetWidth;
    el.classList.add(cls);
    setTimeout(()=> el.classList.remove(cls), 560);
    // 画面も揺らす（ツッコミは強め）
    this.fx(cls==='tsukkomi' ? 'shakeStrong' : 'shake');
    // 軽いフラッシュを添える（ツッコミ時のみ）
    if(cls==='tsukkomi') { setTimeout(()=> this.fx('flash'), 46); }
  }
  setBars(on) { this.el.stage.dataset.bars = on ? 'on' : ''; }
  setTone(t) { if (t) this.el.stage.dataset.tone = t; else this.el.stage.removeAttribute('data-tone'); }
  setVeil(v) { if (v) this.el.stage.dataset.veil = v; else this.el.stage.removeAttribute('data-veil'); }
  setLight(v) { if (v) this.el.stage.dataset.light = v; else this.el.stage.removeAttribute('data-light'); }
  setParticles(mode) { this.particles.set(mode); }
  async card({ no = '', title = '', sub = '', hold = 2400, on = true }) {
    const o = this.el.cardOverlay;
    if (!on) { o.classList.remove('on'); return; }
    this.el.cardNo.textContent = no;
    this.el.cardTitle.textContent = title;
    this.el.cardSub.textContent = sub;
    o.classList.add('on');
    return this.t(hold).then(() => o.classList.remove('on'));
  }
  async caption({ text, hand, hold = 3200, on = true }) {
    const c = this.el.caption;
    if (!on) { c.classList.remove('on'); return; }
    c.innerHTML = `<div class="memo ${hand ? 'hand' : ''}">${hand ? `<span>${text}</span>` : text}</div>`;
    c.classList.add('on');
    return this.t(hold).then(() => c.classList.remove('on'));
  }
}

/* --------------------------------------------------------- アセット台帳 ---- */
export class AssetDB {
  constructor(payload) {
    this.byId = {};
    this.chrIndex = {};
    (payload.assets || []).forEach(a => {
      this.byId[a.id] = a;
      const stem = String(a.file || '').replace(/^.*\//, '').replace(/\.\w+$/, '');
      if (stem && stem !== a.id) this.byId[stem] = a;
      if (a.cat === 'chr') {
        const m = a.id.match(/^chr_(.+?)_(\d+)_/);
        if (m) {
          this.chrIndex[m[1]] = this.chrIndex[m[1]] || {};
          this.chrIndex[m[1]][m[2]] = a;
        }
      }
    });
    this.list = payload.assets || [];
    this.buffer = payload.bufferFiles || [];
    this.note = payload.note || '';
  }
  chrFor(slug, expr) {
    const t = this.chrIndex[slug];
    if (!t) return null;
    return t[String(expr).padStart(2, '0')] || t['01'] || Object.values(t)[0] || null;
  }
  of(cat) { return this.list.filter(a => a.cat === cat); }
  get(id) { return this.byId[id] || null; }
  /** 実画像（placeholder:false）のみの一覧。起動時プリロードの対象。 */
  realList() { return this.list.filter(a => a.placeholder === false && a.file); }
  /**
   * 実画像を先読みする。onStep(done,total,asset) で進捗を返す。
   * 失敗した画像は警告に留め、起動を止めない（SVGフォールバックが描画される）。
   */
  async preload(onStep) {
    const items = this.realList();
    const total = items.length;
    onStep && onStep(0, total, null);
    if (!total) return { total: 0, ok: 0 };
    let ok = 0, done = 0;
    const queue = items.slice();
    const worker = async () => {
      while (queue.length) {
        const a = queue.shift();
        let success = false;
        for (let attempt=0; attempt<2; attempt++){
          try { await loadImage(a.file); ok++; success=true; break; }
          catch (e) {
            if(attempt===0){
              // 指数バックオフ 400ms 後に再試行
              await new Promise(r=> setTimeout(r, 420));
              continue;
            }
            console.warn('[preload] 読込失敗（フォールバック描画で続行）:', a.file, e.message||e);
          }
        }
        done++;
        onStep && onStep(done, total, a);
      }
    };
    await Promise.all(Array.from({ length: Math.min(6, items.length) }, worker));
    return { total, ok };
  }
}

/** 画像1枚の読み込み＋デコード待ち（タイムアウト付き） */
function loadImage(src, timeout = 15000) {
  return new Promise((resolve, reject) => {
    const im = new Image();
    im.decoding = 'async';
    const to = setTimeout(() => { im.src = ''; reject(new Error('timeout: ' + src)); }, timeout);
    im.onload = () => {
      clearTimeout(to);
      if (im.decode) im.decode().then(() => resolve(im), () => resolve(im));
      else resolve(im);
    };
    im.onerror = () => { clearTimeout(to); reject(new Error('load error: ' + src)); };
    im.src = src;
  });
}
