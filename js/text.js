/* ============================================================================
   text.js ―― 本文整形（差しruby・✝強調）＋ タイプライタ演出
   インライン記法: 漢字《かんじ》 = ルビ / *強調* / ✝…✝ = 本質語 / \n = 改ページ内改行
   ========================================================================== */

const PAUSE = { '、': 46, '。': 130, '！': 96, '？': 110, '…': 150, '：': 40, '」': 22, '』': 22, 'ー': 30 };

export function tokenize(raw) {
  const s = String(raw);
  const toks = [];
  let em = false;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === '\\' && s[i + 1] === 'n') { toks.push({ br: true }); i++; continue; }
    if (c === '*') { em = !em; continue; }
    if (c === '✝') {
      let j = s.indexOf('✝', i + 1);
      if (j > -1 && j - i < 14) {
        toks.push({ h: `<i class="hs">${s.slice(i, j + 1).replace(/</g, '&lt;')}</i>`, p: 120 });
        i = j; continue;
      }
    }
    let h = esc(c);
    if (s[i + 1] === '《') {
      const j = s.indexOf('》', i + 2);
      if (j > -1) {
        const rt = s.slice(i + 2, j);
        let base = c;
        let k = i + 1;
        // 直前トークンに遡ってルビ親文字を吸着（最大4文字）
        while (rt.length && toks.length && toks[toks.length - 1].h && /^[\u3400-\u9FFF々〆ｱ-ﾯ]+$/.test(strip(toks[toks.length - 1].h))) {
          const prev = strip(toks[toks.length - 1].h);
          if (/^[\u3400-\u9FFF々〆]+$/.test(prev) && prev.length <= 4) { base = toks.pop().raw + base; }
          else break;
          k--;
        }
        h = `<ruby>${esc(base)}<rt>${esc(rt)}</rt></ruby>`;
        i = j;
      }
    }
    const p = PAUSE[c] || 0;
    toks.push({ h: em ? `<em>${h}</em>` : h, raw: strip(h), p });
  }
  return toks;
}
function strip(html) { return html.replace(/<[^>]*>/g, ''); }
function esc(c) { return c === '<' ? '&lt;' : c === '>' ? '&gt;' : c === '&' ? '&amp;' : c; }

export function htmlOf(toks) {
  return toks.map((t, i) => t.br ? '<br>' : `<span class="tok t${i}">${t.h}</span>`).join('');
}

export class Typer {
  constructor(el) {
    this.el = el;
    this.toks = [];
    this.pos = 0;
    this.raf = 0;
    this.timer = 0;
    this.onDone = null;
    this.speed = 1;
  }
  render(text, { instant = false, onDone = null } = {}) {
    this.toks = tokenize(text);
    this.el.innerHTML = htmlOf(this.toks);
    this._complete = false;
    this.pos = 0;
    this.onDone = onDone;
    const nodes = [...this.el.querySelectorAll('.tok')];
    this.nodes = nodes;
    clearTimeout(this.timer);
    if (instant || this.speed >= 99) { this.finish(); return; }
    this.next(nodes);
  }
  next(nodes) {
    nodes = nodes || this.nodes;
    if (!nodes) return;
    if (this.pos >= nodes.length) { this.done(); return; }
    const t = this.toks[this.pos] || {};
    nodes[this.pos] && nodes[this.pos].classList.add('v');
    this.pos++;
    const base = 26 / Math.max(.25, this.speed);
    const wait = base + (t.p || 0) / Math.max(.5, this.speed);
    this.timer = setTimeout(() => this.next(nodes), wait);
  }
  finish() {
    clearTimeout(this.timer);
    if (this.nodes) this.nodes.forEach(n => n.classList.add('v'));
    this.pos = this.toks.length;
    this.done();
  }
  done() {
    if (this._complete) return;
    this._complete = true;
    const cb = this.onDone; this.onDone = null;
    cb && cb();
  }
  get complete() { return this.pos >= this.toks.length; }
  reset() { this._complete = false; clearTimeout(this.timer); }
}
