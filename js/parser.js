/* ============================================================================
   parser.js ―― 本編スクリプト DSL → 命令リスト
   文法の仕様は docs/SCRIPT_SPEC.md に記載（このパーサが正）。
   ========================================================================== */

const SP_SPLIT = /^([^：:｜|]{1,16})：([\s\S]*)$/;

/** 発話者キーの正規化（表記ゆれ吸収・括弧内ト書きを tag に退避） */
export function normSpeaker(raw) {
  if (!raw) return null;
  let tag = null;
  let s = String(raw).trim();
  const m = s.match(/^(.+?)\s*[（(]([^（）()]{1,18})[）)]$/) || s.match(/^(.+?)\s*\[([^\[\]]{1,18})\]$/);
  if (m) { s = m[1].trim(); tag = m[2].trim(); }
  if (/^(ナレーション|地の文|ナレ)$/.test(s)) s = 'ナ';
  return { key: s, tag };
}

export class ParseError extends Error {
  constructor(msg, file, lineNo) { super(`${file}:${lineNo}  ${msg}`); this.file = file; this.line = lineNo; }
}

/**
 * @param {string} text  ファイル全文
 * @param {string} file  ファイル名（エラー表示用）
 * @param {object} ctx   { speakers:Set<string>, strict:boolean }
 * @returns {{scenes:object, order:string[], chats:object, chapters:object, warnings:Array}}
 */
export function parseScript(text, file, ctx = {}) {
  const out = { scenes: {}, order: [], chats: {}, chapters: {}, warnings: [] };
  const lines = String(text).replace(/\r\n?/g, '\n').split('\n');
  let cur = null;      // 現在のシーン
  let chat = null;     // 現在のチャットブロック
  const condStack = [];
  const branchStack = [];
  let chapter = null;

  const topCond = () => condStack.filter(Boolean).join(' && ') || null;

  const push = (instr, lineNo) => {
    const c = topCond();
    if (c) instr.cond = (instr.cond ? `(${instr.cond}) && ` : '') + c;
    if (chat) { chat.lines.push(instr); return instr; }
    if (!cur) throw new ParseError(`指令がシーン外です: @${instr.t}`, file, lineNo);
    cur.body.push(instr);
    return instr;
  };

  for (let i = 0; i < lines.length; i++) {
    const lineNo = i + 1;
    const line = lines[i].replace(/\t/g, '  ').replace(/\s+$/, '');
    if (!line.trim()) continue;
    const s = line.trim();
    if (s.startsWith(';') || s.startsWith('//')) continue;

    /* ══════════════ # 定義ブロック ══════════════ */
    if (s[0] === '#') {
      const rest = s.slice(1).trim();
      const kw = (rest.match(/^\w+/) || [''])[0];
      const arg = rest.slice(kw.length).trim();
      if (kw === 'scene') {
        chat = null;
        if (branchStack.length) throw new ParseError('@branch が閉じられていません', file, lineNo);
        condStack.length = 0;
        const m = arg.match(/^(\S+)(?:\s*[|｜]\s*(.*))?$/);
        if (!m) throw new ParseError('#scene は `#scene <id> | <ラベル>`', file, lineNo);
        if (out.scenes[m[1]]) throw new ParseError(`シーンIDが重複しています: ${m[1]}`, file, lineNo);
        cur = { id: m[1], label: (m[2] || '').trim() || m[1], file, start: lineNo, body: [], chapter };
        out.scenes[m[1]] = cur;
        out.order.push(m[1]);
        continue;
      }
      if (kw === 'chat') {
        cur = null;
        const m = arg.match(/^(\S+)\s*[|｜]\s*([^|｜]+?)\s*(?:[|｜]\s*(\w+))?\s*$/);
        if (!m) throw new ParseError('#chat は `#chat <id> | <タイトル> | <kind>`', file, lineNo);
        chat = { id: m[1], title: m[2], kind: m[3] || 'line', lines: [], file, start: lineNo };
        if (out.chats[m[1]]) throw new ParseError(`チャットIDが重複しています: ${m[1]}`, file, lineNo);
        out.chats[m[1]] = chat;
        continue;
      }
      if (kw === 'chapter') {
        const m = arg.match(/^(\S+)\s*[|｜]\s*([^|｜]+?)\s*(?:[|｜]\s*(.*?))?\s*$/);
        if (!m) throw new ParseError('#chapter は `#chapter <id> | <題> | <副題>`', file, lineNo);
        chapter = m[1];
        out.chapters[m[1]] = { id: m[1], title: m[2], sub: (m[3] || '').trim() };
        cur = null; chat = null;
        continue;
      }
      if (kw === 'endchat') { chat = null; continue; }
      throw new ParseError(`未知の定義です: #${kw}`, file, lineNo);
    }

    /* ══════════════ チャットブロック内 ══════════════ */
    if (chat) {
      const m = s.match(/^(MSG|ME|SYS|POST|CMT|NOTE)\b[ \t]*(.*)$/);
      if (!m) throw new ParseError('チャット行は MSG / ME / SYS / POST / CMT / NOTE で始めてください', file, lineNo);
      const kind = m[1].toLowerCase();
      const parts = (m[2] || '').split('|').map(x => x.trim());
      const instr = { t: 'chatline', kind };
      if (kind === 'sys' || kind === 'note') instr.text = m[2] || '';
      else if (kind === 'post') {
        instr.no = parts[0] || ''; instr.who = parts[1] || ''; instr.text = parts.slice(2).join(' ');
        instr.self = /(^|\s)self(\s|$)/.test(m[2] || '');
      } else { instr.who = parts[0] || ''; instr.text = parts.slice(1).join(' '); }
      chat.lines.push(instr);
      continue;
    }

    /* ══════════════ @ ディレクティブ ══════════════ */
    if (s[0] === '@') {
      const body = s.slice(1).trim();
      const kw = (body.match(/^\w+/) || [''])[0];
      const arg = body.slice(kw.length).trim();
      const kv = (name) => {
        const m = arg.match(new RegExp(`(?:^|\\s)${name}=(\\S+)`));
        return m ? m[1] : null;
      };

      switch (kw) {
        case 'branch':
          branchStack.push({ clauses: [], open: false });
          condStack.push(null);
          continue;
        case 'when': case 'else': {
          if (!branchStack.length) throw new ParseError('@when / @else は @branch の中でだけ使えます', file, lineNo);
          const br = branchStack[branchStack.length - 1];
          const prev = condStack[condStack.length - 1];
          if (prev) br.clauses.push(prev);
          let cond = kw === 'when' ? arg : null;
          if (kw === 'else') cond = br.clauses.length ? br.clauses.map(c => `!(${c})`).join(' && ') : null;
          condStack[condStack.length - 1] = cond || null;
          br.open = true;
          continue;
        }
        case 'endif': {
          if (!branchStack.length) throw new ParseError('@endif に対応する @branch がありません', file, lineNo);
          const br = branchStack.pop();
          const prev = condStack.pop();
          if (prev) br.clauses.push(prev);
          if (!br.open) out.warnings.push({ file, line: lineNo, msg: '@branch に @when がありません' });
          continue;
        }
        case 'bg': {
          const id = arg.split(/\s+/)[0];
          push({ t: 'bg', id: (!id || id === 'off') ? null : id, cross: !/nofade/.test(arg) }, lineNo);
          continue;
        }
        case 'cg': {
          const id = arg.split(/\s+/)[0];
          push({ t: 'cg', id: (!id || id === 'off') ? null : id, kb: /\bkb\b/.test(arg) }, lineNo);
          continue;
        }
        case 'chr': {
          if (!arg || arg === 'clear') push({ t: 'chr', clear: true }, lineNo);
          else if (arg[0] === '-') push({ t: 'chr', del: arg.slice(1).split(',').map(x => x.trim()) }, lineNo);
          else {
            const set = {};
            arg.split(',').forEach(p => {
              const [k, v] = p.split('=').map(x => (x || '').trim());
              if (k) set[k] = v || '01';
            });
            push({ t: 'chr', set }, lineNo);
          }
          continue;
        }
        case 'bgm': case 'se': {
          const id = arg.split(/\s+/)[0];
          push({ t: kw, id: (!id || id === 'off') ? null : id, fade: +(kv('fade') || (kw === 'bgm' ? 1.6 : 0)) }, lineNo);
          continue;
        }
        case 'fx': {
          const [name, val] = arg.split('=');
          push({ t: 'fx', name, val: val === undefined ? true : val }, lineNo);
          continue;
        }
        case 'tone': case 'light': case 'veil': case 'bars':
          push({ t: kw, mode: kw === 'bars' ? (arg || 'on') : arg }, lineNo);
          continue;
        case 'chapter':
          push({ t: 'chapter', id: arg }, lineNo);
          continue;
        case 'lay':
          push({ t: 'lay', cls: (!arg || arg === 'clear') ? null : arg }, lineNo);
          continue;
        case 'card': {
          const parts = arg.split(/[|｜]/).map(x => x.trim());
          push({ t: 'card', no: parts[0] || '', title: parts[1] || '', sub: parts[2] || '', hold: +(kv('hold') || 2400) }, lineNo);
          continue;
        }
        case 'memo':
          push({ t: 'caption', text: arg.replace(/^[「"]|[」"]$/g, ''), hand: /hand/.test(arg), hold: +(kv('hold') || 3200) }, lineNo);
          continue;
        case 'tip': case 'item': case 'cnt':
          push({ t: kw, id: arg.split(/\s+/)[0] }, lineNo);
          continue;
        case 'chat':
          push({ t: 'chat', id: arg.split(/\s+/)[0] }, lineNo);
          continue;
        case 'route':
          push({ t: 'routeDone', id: arg.split(/\s+/)[0] }, lineNo);
          continue;
        case 'set': {
          const m = arg.match(/^([\w.]+)\s*([+=-])\s*(-?\d+(?:\.\d+)?|[A-Za-z_][\w.]*)$/);
          if (!m) throw new ParseError(`@set の形式が不正です: ${arg}`, file, lineNo);
          push({ t: 'set', key: m[1], op: m[2], val: m[3] }, lineNo);
          continue;
        }
        case 'heart': {
          const m = arg.match(/^([+-]?)(\d+)$/);
          if (!m) throw new ParseError(`@heart は @heart +2 の形で書いてください: ${arg}`, file, lineNo);
          push({ t: 'set', key: 'heart', op: m[1] || '=', val: (m[1] ? m[1] + m[2] : m[2]) }, lineNo);
          continue;
        }
        case 'jump': case 'goto':
          push({ t: 'jump', target: arg.split(/\s+/)[0] }, lineNo);
          continue;
        case 'if': {
          const m = arg.match(/^(.*?)\s*->\s*(\S+)\s*$/);
          if (!m) throw new ParseError('@if は `@if <条件> -> <scene>`', file, lineNo);
          push({ t: 'jump', target: m[2], cond: m[1].trim() }, lineNo);
          continue;
        }
        case 'wait':
          push({ t: 'wait', ms: +arg || 600 }, lineNo);
          continue;
        case 'hub': push({ t: 'hub' }, lineNo); continue;
        case 'part': {
          const mode = (arg || 'dust').trim();
          push({ t: 'part', mode: mode === 'off' ? null : mode }, lineNo);
          continue;
        }
        case 'end': {
          const parts = arg.split(/[|｜]/).map(x => x.trim());
          push({ t: 'end', id: parts[0] || 'unknown', title: parts[1] || '' }, lineNo);
          continue;
        }
        case 'title': push({ t: 'title' }, lineNo); continue;
        case 'save': push({ t: 'savepoint' }, lineNo); continue;
        case 'stop': push({ t: 'stop' }, lineNo); continue;
        default:
          throw new ParseError(`未知の指令です: @${kw}`, file, lineNo);
      }
    }

    /* ══════════════ 選択肢 ══════════════ */
    if (s[0] === '?') {
      if (!cur) throw new ParseError('選択肢がシーン外です', file, lineNo);
      const instr = { t: 'choice', prompt: s.slice(1).replace(/^[\s「」]+|[\s「」]+$/g, ''), opts: [] };
      push(instr, lineNo);
      while (i + 1 < lines.length) {
        const t = lines[i + 1].replace(/\s+$/, '').trim();
        if (t === '') { i++; continue; }
        if (t.startsWith(';')) break;
        if (t[0] !== '-') break;
        i++;
        const fields = t.slice(1).trim().split('|').map(x => x.trim());
        const opt = { label: fields[0] || '', sub: '', go: null, eff: [] };
        for (let f = 1; f < fields.length; f++) {
          const v = fields[f];
          if (!v) continue;
          if (/^go=/i.test(v)) opt.go = v.slice(3).trim();
          else if (/^sub=/i.test(v)) opt.sub = v.slice(4).trim();
          else if (/^cond=/i.test(v)) opt.cond = v.slice(5).trim();
          else if (/^(heart|flag_[\w-]+)([+-]\d+)?$/.test(v)) opt.eff.push(v);
          else if (/^(item|tip|cnt|bgm|se|fx|tone|chat)=/.test(v)) opt.eff.push(v);
          else if (/^(heart|flag_[\w-]+|tease|cnt_[\w-]+|pick_[\w-]+)([+-]\d+)?$/.test(v)) opt.eff.push(v);
          else if (/^pick=/.test(v)) opt.pick = v.slice(5).trim();
          else opt.sub = opt.sub ? `${opt.sub} ${v}` : v;
        }
        if (!opt.label) throw new ParseError('選択肢のラベルが空です', file, i + 1);
        if (!opt.go) throw new ParseError(`選択肢「${opt.label}」に go= がありません`, file, i + 1);
        instr.opts.push(opt);
      }
      if (!instr.opts.length) throw new ParseError('選択肢の下に `- <ラベル> | go=<scene>` がありません', file, lineNo);
      continue;
    }

    /* ══════════════ 発話・地の文 ══════════════ */
    if (!cur) throw new ParseError(`本文がシーン外です: ${s.slice(0, 24)}`, file, lineNo);
    let body = s, sp = null, tag = null;
    const m = body.match(SP_SPLIT);
    if (m) {
      const cand = normSpeaker(m[1]);
      const known = ctx.speakers ? ctx.speakers.has(cand.key) : true;
      if (cand.key === 'ナ') { sp = null; tag = cand.tag; body = m[2].trim(); }
      else if (known) { sp = cand.key; tag = cand.tag; body = m[2].trim(); }
      else {
        if (ctx.strict) throw new ParseError(`未登録の発話者です: ${cand.key}`, file, lineNo);
        out.warnings.push({ file, line: lineNo, msg: `未登録の発話者「${cand.key}」→地の文として扱いました` });
      }
    }
    if (body.startsWith('ナ：')) body = body.slice(2).trim();
    if (!body) throw new ParseError('本文が空です', file, lineNo);
    push({ t: 'text', sp, tag, txt: body }, lineNo);
  }
  if (branchStack.length) throw new ParseError('@branch が @endif で閉じられていません', file, lines.length);
  if (chat) out.warnings.push({ file, line: lines.length, msg: `#chat ${chat.id} がファイル末尾まで閉じられています（自動修了）` });

  out.order.forEach((id, n) => { out.scenes[id].next = out.order[n + 1] || null; });
  return out;
}

/* ---------------------------------------------------------------- 条件式 ---- */
/** 簡易条件評価: "a>=2 && !b==0 || flag_x>1" 程度に対応（括弧は !(...) のみ） */
export function evalCond(expr, get) {
  if (expr == null || expr === '') return true;
  const orParts = String(expr).split('||');
  return orParts.some(chunk => chunk.split('&&').every(p => evalSimple(p.trim(), get)));
}

function evalSimple(str, get) {
  if (!str) return true;
  let neg = false;
  let s = str;
  const mNot = s.match(/^!\s*\((.*)\)$/);
  if (mNot) { neg = true; s = mNot[1].trim(); }
  else if (s.startsWith('!')) { neg = true; s = s.slice(1).trim(); }
  const m = s.match(/^([\w.\u3000-\u30FF-]+)\s*(>=|<=|==|!=|>|<)\s*(.+)$/);
  if (!m) {
    const truthy = !!toNum(get(s));
    return neg ? !truthy : truthy;
  }
  const a = operand(m[1], get);
  const b = operand(m[3], get);
  if (typeof a === 'string' || typeof b === 'string') {
    const eq = String(a) === String(b);
    return neg ? !eq : (m[2] === '==' ? eq : !eq);
  }
  let r;
  switch (m[2]) {
    case '>=': r = a >= b; break;
    case '<=': r = a <= b; break;
    case '>': r = a > b; break;
    case '<': r = a < b; break;
    case '!=': r = a !== b; break;
    default: r = a === b;
  }
  return neg ? !r : r;
}

/** 項の解決: 数値/真偽/引用文字列はそのまま、識別子は get()、未知の名前は文字列として扱う */
function operand(tok, get) {
  const t = String(tok).trim();
  if (/^[-+]?\d+(?:\.\d+)?$/.test(t)) return Number(t);
  if (/^(true|yes)$/i.test(t)) return 1;
  if (/^(false|no)$/i.test(t)) return 0;
  if (/^["'].+["']$/.test(t)) return toNum(t.slice(1, -1));
  const v = get(t);
  return v === undefined ? toNum(t) : toNum(v);
}

function toNum(v) {
  if (v === undefined || v === null || v === '') return 0;
  if (typeof v === 'boolean') return v ? 1 : 0;
  if (typeof v === 'number') return v;
  if (Array.isArray(v)) return v.length;
  const n = Number(v);
  return isNaN(n) ? String(v) : n;
}
