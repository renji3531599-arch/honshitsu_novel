/* ============================================================
   ノベルゲームエンジン本体
   『まだ地図の途中で　〜✝本質✝特別編〜』
   ============================================================ */
(function () {
"use strict";

const $ = id => document.getElementById(id);
const MAN = window.ASSET_MANIFEST;

/* ---------------- 永続データ ---------------- */
const SAVE_KEY = "honzitsu_global";
const G_DEF = {
  seen: {}, cg: {}, endings: {}, tips: {},
  settings: { textSpeed: 3, autoSpeed: 3, bgmVol: .5, seVol: .6, debug: false },
  playtime: 0, clears: 0,
};
let GL = loadGlobal();
function loadGlobal() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return JSON.parse(JSON.stringify(G_DEF));
    const d = JSON.parse(raw);
    return Object.assign(JSON.parse(JSON.stringify(G_DEF)), d,
      { settings: Object.assign({}, G_DEF.settings, d.settings || {}) });
  } catch (e) { return JSON.parse(JSON.stringify(G_DEF)); }
}
function saveGlobal() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(GL)); } catch (e) {} }

/* ---------------- ゲーム状態 ---------------- */
const G = {
  sceneId: null, idx: 0,
  heart: 0,
  flags: { MIE: 0, SATOU: 0, REI: 0, TERACHI: 0, RYOMA: 0, MINAMITOU: 0, MESHINO: 0, IZAKI: 0 },
  tease: 0, side: null, ch1: 0, lastChoice: -1, firstD: false,
  currentRoute: null,
  routesDone: {},
  sprites: { L: null, C: null, R: null },
  bg: null, bgTint: "day", cgId: null,
  startedAt: 0,
  running: false,
  restoreMode: false,
  runId: 0, restoreTargetScene: null, restoreTargetIdx: -1,
  waiting: null,     // 現在のwait解除関数
  auto: false, skip: false, ctrlHeld: false,
  history: [],
  endingScene: false,
};

/* ---------------- ユーティリティ ---------------- */
const sleep = ms => new Promise(r => setTimeout(r, ms));
function hash(s) { let h = 0; for (let i = 0; i < s.length; i++) { h = ((h << 5) - h + s.charCodeAt(i)) | 0; } return "h" + (h >>> 0).toString(36); }
function esc(s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
function decorate(text) {
  // ✝本質✝ を装飾
  return esc(text)
    .replace(/✝本質✝/g, '<span class="honkaku">✝本質✝</span>')
    .replace(/\n/g, "<br>");
}
function bgmSafePlay(id) { try { window.AudioSys.playBGM(id); } catch (e) {} }
function seSafe(id) { try { window.AudioSys.playSE(id); } catch (e) {} }

/* ---------------- 画像パス解決 ---------------- */
function bgFile(id) { const b = MAN.bg[id]; return b ? "assets/img/" + b.file : null; }
function chrFile(who, expr) {
  const c = MAN.chr[who]; if (!c) return null;
  const e = c.exprs[Math.max(0, expr - 1)] || c.exprs[0];
  return "assets/img/" + e.file;
}
function cgFile(id) {
  const c = MAN.cg[id] || MAN.ed_cg[id];
  return c ? "assets/img/" + c.file : null;
}
function charName(who) { const c = window.CHARS[who]; return c ? c.name : who; }

/* ============================================================
   表示レイヤー操作
   ============================================================ */
function setBG(id, opts = {}) {
  const img = $("bg-img");
  G.bg = id; G.bgTint = opts.tint || "day";
  if (id) {
    const f = bgFile(id);
    if (f) {
      if (img.dataset.cur !== f) {
        img.classList.remove("show");
        const pre = new Image();
        pre.onload = () => { img.src = f; img.dataset.cur = f; requestAnimationFrame(() => img.classList.add("show")); };
        pre.src = f;
        if (pre.complete) { img.src = f; img.dataset.cur = f; img.classList.add("show"); }
      }
      img.classList.toggle("zoom", !!opts.zoom);
    }
  }
  // tint class
  const stage = $("stage");
  stage.classList.remove("tint-day", "tint-morning", "tint-evening", "tint-night", "tint-dusk", "tint-flashback");
  const tint = opts.tint || "day";
  const tEl = document.querySelector("#bg-layer .bg-tint");
  if (tEl) tEl.className = "bg-tint tint-" + tint;
}

function showCG(id, opts = {}) {
  const layer = $("cg-layer");
  const f = cgFile(id);
  if (!f) return;
  layer.innerHTML = "";
  const img = document.createElement("div");
  img.style.cssText = `position:absolute;inset:0;background-image:url('${f}');background-size:cover;background-position:center;`;
  const tint = document.createElement("div");
  tint.className = "bg-tint tint-" + (opts.tint || "day");
  tint.style.position = "absolute";
  const cont = document.createElement("div");
  cont.className = "bg-contour";
  const vig = document.createElement("div");
  vig.className = "bg-vignette";
  layer.append(img, tint, cont, vig);
  layer.style.opacity = "0";
  layer.style.display = "block";
  requestAnimationFrame(() => { layer.style.transition = "opacity 1s"; layer.style.opacity = "1"; });
  G.cgId = id;
  GL.cg[id] = true; saveGlobal();
  showCGCaption(opts.caption || "");
  seSafe("se_page");
}
function showCGCaption(text) {
  const cap = $("cg-caption");
  if (!cap) return;
  cap.textContent = text;
  cap.classList.toggle("show", !!text);
}
function hideCG() {
  const layer = $("cg-layer");
  layer.style.transition = "opacity .8s"; layer.style.opacity = "0";
  setTimeout(() => { layer.style.display = "none"; layer.innerHTML = ""; }, 850);
  showCGCaption("");
  G.cgId = null;
}

function showSprite(who, expr, pos) {
  const cur = G.sprites[pos];
  if (cur && cur !== who) removeSpriteEl(cur);
  let el = document.querySelector(`.sprite[data-who="${who}"]`);
  if (!el) {
    el = document.createElement("div");
    el.className = "sprite"; el.dataset.who = who;
    const c = window.CHARS[who] || { tint: "#888", color: "#888" };
    el.innerHTML = `<div class="ph" style="background-color:${c.tint}"></div><div class="chip"></div>`;
    $("sprite-layer").appendChild(el);
  }
  el.classList.remove("pos-L", "pos-C", "pos-R");
  el.classList.add("pos-" + pos);
  el.querySelector(".ph").style.backgroundImage = `url('${chrFile(who, expr)}')`;
  el.querySelector(".chip").textContent = `${charName(who)}　[${expr}]`;
  requestAnimationFrame(() => el.classList.add("on"));
  G.sprites[pos] = who;
  // 同一キャラが複数位置にいたら整理
  for (const p of ["L", "C", "R"]) {
    if (p !== pos && G.sprites[p] === who) { G.sprites[p] = null; const e2 = document.querySelector(`.sprite[data-who="${who}"].pos-${p}`); if (e2) e2.remove(); }
  }
}
function changeExpr(who, expr) {
  const el = document.querySelector(`.sprite[data-who="${who}"]`);
  if (!el) return;
  el.querySelector(".ph").style.backgroundImage = `url('${chrFile(who, expr)}')`;
  el.querySelector(".chip").textContent = `${charName(who)}　[${expr}]`;
}
function removeSpriteEl(who) {
  const el = document.querySelector(`.sprite[data-who="${who}"]`);
  if (el) { el.classList.remove("on", "speaking"); setTimeout(() => el.remove(), 500); }
}
function hideSprite(who) {
  for (const p of ["L", "C", "R"]) if (G.sprites[p] === who) G.sprites[p] = null;
  removeSpriteEl(who);
}
function hideAllSprites() {
  G.sprites = { L: null, C: null, R: null };
  document.querySelectorAll(".sprite").forEach(el => { el.classList.remove("on", "speaking"); setTimeout(() => el.remove(), 500); });
}
function setSpeaking(who) {
  document.querySelectorAll(".sprite").forEach(el => el.classList.toggle("speaking", el.dataset.who === who));
}

/* ============================================================
   メッセージ表示
   ============================================================ */
let typeTimer = null, typeResolve = null, typeFull = "";

function showMsgWindow(show) { $("msg-frame").classList.toggle("show", show); $("sys-menu").classList.toggle("show", show); }

function sayText(kind, who, text) {
  return new Promise(resolve => {
    const plate = $("name-plate"), box = $("msg-text");
    box.innerHTML = "";
    if (who && window.CHARS[who]) {
      const c = window.CHARS[who];
      plate.style.display = "";
      plate.innerHTML = esc(c.name) + `<span class="rub">${esc(c.rub || "")}</span>`;
      plate.style.color = c.color; plate.style.borderColor = c.color + "88";
    } else if (who) {
      plate.style.display = "";
      plate.textContent = who; plate.style.color = "var(--accent)"; plate.style.borderColor = "var(--accent-soft)";
    } else {
      plate.style.display = "none";
    }
    showMsgWindow(true);
    setSpeaking(who || null);
    const cls = kind === "nar" ? "nar-txt" : kind === "mono" ? "mono-txt" : kind === "voice" ? "voice-txt" : "";
    typeFull = text;
    const html = decorate(text);
    if (cls) box.innerHTML = `<span class="${cls}" id="type-body"></span>`;
    else box.innerHTML = `<span id="type-body"></span>`;
    const body = $("type-body");
    // タイプライター
    const speed = [70, 45, 30, 22, 16, 12, 8, 5, 3, 1][GL.settings.textSpeed] || 22;
    let i = 0;
    const plain = text;
    let lastTick = 0;
    clearInterval(typeTimer);
    if (G.skip || G.restoreMode || speed <= 1) { body.innerHTML = html; finishType(); return; }
    typeTimer = setInterval(() => {
      i += 1;
      if (i > plain.length) { clearInterval(typeTimer); finishType(); return; }
      // HTML再構築(簡易): 表示済み文字列を装飾して流し込む
      const done = plain.slice(0, i);
      body.innerHTML = decorate(done);
      if (i % 3 === 0) seSafe("se_typewriter");
    }, speed);
    function finishType() {
      clearInterval(typeTimer); typeTimer = null;
      body.innerHTML = html;
      $("next-arrow").classList.add("show");
      typeResolve = () => { typeResolve = null; $("next-arrow").classList.remove("show"); resolve(); };
      // 自動/スキップ
      if (G.restoreMode) { typeResolve(); return; }
      if (G.skip) { seSafe("se_cursor"); typeResolve(); return; }
      if (G.auto) {
        const base = 500 + plain.length * 55;
        const factor = [2.4, 1.8, 1.35, 1.0, .8, .62, .5, .4, .32, .26][GL.settings.autoSpeed] || 1;
        setTimeout(() => { if (typeResolve) typeResolve(); }, base * factor);
      }
    }
    G.markSeen && G.markSeen();
  });
}

/* クリック進行 */
function advanceClick() {
  if (typeResolve) { seSafe("se_cursor"); typeResolve(); return true; }
  if (G.waiting) { const w = G.waiting; G.waiting = null; w(); return true; }
  return false;
}
$("stage") && null;

/* ============================================================
   選択肢
   ============================================================ */
function showChoice(cfg) {
  return new Promise(resolve => {
    G.currentChoiceOpts = cfg.opts;
    const box = $("choice-box");
    box.innerHTML = "";
    if (cfg.prompt) {
      const p = document.createElement("div");
      p.id = "choice-prompt"; p.textContent = cfg.prompt;
      box.appendChild(p);
    }
    let focusIdx = 0;
    const btns = cfg.opts.map((o, i) => {
      const b = document.createElement("div");
      b.className = "choice-btn" + (i === 0 ? " focus" : "");
      b.innerHTML = `<span class="mark">${["①", "②", "③", "④"][i] || "・"}</span>${esc(o.label)}`;
      b.onclick = () => { seSafe("se_decide"); cleanup(); resolve(i); };
      b.onmouseenter = () => { focusIdx = i; refresh(); seSafe("se_cursor"); };
      box.appendChild(b);
      return b;
    });
    function refresh() { btns.forEach((b, i) => b.classList.toggle("focus", i === focusIdx)); }
    function cleanup() { box.classList.remove("show"); box.innerHTML = ""; document.removeEventListener("keydown", key); G.currentChoiceOpts = null; }
    function key(e) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        focusIdx = (focusIdx + (e.key === "ArrowDown" ? 1 : btns.length - 1)) % btns.length;
        refresh(); seSafe("se_cursor"); e.preventDefault();
      } else if (e.key === "Enter" || e.key === " ") {
        btns[focusIdx].click(); e.preventDefault();
      }
    }
    document.addEventListener("keydown", key);
    box.classList.add("show");
  });
}

/* ============================================================
   章タイトル / 中央テキスト / ENDロゴ
   ============================================================ */
function showChapter(title, sub) {
  return new Promise(resolve => {
    $("chapter-title").textContent = title;
    $("chapter-sub").textContent = sub || "";
    const card = $("chapter-card");
    card.classList.remove("show"); void card.offsetWidth;
    card.classList.add("show");
    seSafe("se_page");
    setTimeout(() => { card.classList.remove("show"); resolve(); }, 2500);
  });
}
function showCenter(text, style) {
  return new Promise(resolve => {
    const el = $("center-text");
    el.className = style === "end" ? "style-end" : (style === "logo" ? "style-logo" : "");
    el.querySelector(".inner").innerHTML = esc(text).replace(/\n/g, "<br>");
    el.classList.add("show");
    if (style === "logo") seSafe("se_chime");
    const done = () => { el.classList.remove("show"); document.removeEventListener("click", done); resolve(); };
    document.addEventListener("click", done);
    if (G.restoreMode) { done(); return; }
  });
}
function showEndLogo(main, sub) {
  return new Promise(resolve => {
    const el = $("center-text");
    el.className = "style-end";
    el.querySelector(".inner").innerHTML = `✝<br>${esc(main)}<br>「${esc(sub)}」<span class="complete">― 完 ―</span>`;
    el.classList.add("show");
    seSafe("se_bell");
    let clicked = false;
    const done = () => { if (clicked) return; clicked = true; el.classList.remove("show"); document.removeEventListener("click", done); resolve(); };
    document.addEventListener("click", done);
    setTimeout(done, 9000);
  });
}

/* ============================================================
   窓の外、五秒
   ============================================================ */
function windowGaze(seconds) {
  return new Promise(resolve => {
    const ov = $("five-overlay");
    ov.querySelector(".label").textContent = "窓の外――";
    const dots = ov.querySelector(".dots");
    dots.innerHTML = "";
    const n = Math.min(seconds, 15);
    for (let i = 0; i < n; i++) { const d = document.createElement("span"); d.className = "dot"; dots.appendChild(d); }
    ov.classList.add("show");
    let elapsed = 0, timer;
    function tick() {
      elapsed++;
      if (elapsed <= n) dots.children[elapsed - 1].classList.add("on");
      if (elapsed >= n) { clearInterval(timer); setTimeout(finish, 650); }
    }
    function finish() {
      clearInterval(timer);
      ov.classList.remove("show");
      document.removeEventListener("click", onClk);
      resolve();
    }
    function onClk() { if (elapsed >= Math.min(3, n)) finish(); }
    document.addEventListener("click", onClk);
    timer = setInterval(tick, 1000);
    if (G.restoreMode || G.skip) { clearInterval(timer); finish(); }
  });
}

/* ============================================================
   ネット画面オーバーレイ
   ============================================================ */
function showNet(kind, cfg) {
  return new Promise(resolve => {
    const ov = $("net-overlay");
    ov.innerHTML = "";
    const panel = document.createElement("div");
    panel.className = "net-panel";
    // 端末フレーム（ui02〜ui05）は2026-09-12に撤去。背景の濃色グラデーションは
    // style.css の .net-panel に移した（旧: 96〜98%不透過グラデをPNGの上に重ねていた）
    const bar = document.createElement("div");
    bar.className = "bar";
    bar.innerHTML = `<span>${esc(cfg.title || "")}</span><span class="hint">クリックで閉じる</span>`;
    const posts = document.createElement("div");
    posts.className = "net-posts";
    if (kind === "bbs") {
      (cfg.posts || []).forEach(p => {
        const el = document.createElement("div");
        el.className = "net-post" + (p.sage ? " sage" : "") + (p.kaku ? " kaku" : "");
        const body = esc(p.text).replace(/(✝本質✝)/g, '<span class="honkaku">$1</span>').replace(/(&gt;&gt;\d+)/g, '<span class="a">$1</span>').replace(/\n/g, "<br>");
        el.innerHTML = `<div class="head"><span class="no">${esc(p.no)}</span>　${esc(p.name)}</div><div class="body">${body}</div>`;
        posts.appendChild(el);
      });
    } else {
      const head = document.createElement("div");
      head.style.cssText = "padding:6px 4px 14px;font-family:var(--font-min);color:#e6c887;font-size:15px;letter-spacing:.08em;";
      head.textContent = "🔴 LIVE ― 視聴者からの✝本質✝募集";
      posts.appendChild(head);
      (cfg.comments || []).forEach(p => {
        const el = document.createElement("div");
        el.className = "net-post";
        el.innerHTML = `<div class="head">${esc(p.name)}</div><div class="body">${esc(p.text)}</div>`;
        posts.appendChild(el);
      });
      const tail = document.createElement("div");
      tail.style.cssText = "color:#7f8aa3;font-size:12.5px;margin-top:10px;";
      tail.textContent = "――配信は静かに終了した。意味は、見つからなかった。";
      posts.appendChild(tail);
    }
    panel.append(bar, posts);
    ov.appendChild(panel);
    ov.classList.add("show");
    seSafe(kind === "bbs" ? "se_notif" : "se_chime");
    const close = () => { ov.classList.remove("show"); ov.innerHTML = ""; document.removeEventListener("click", close); resolve(); };
    panel.addEventListener("click", close);
    if (G.restoreMode) close();
  });
}

/* ============================================================
   HUB (ルート選択)
   ============================================================ */
const ROUTES = [
  { id: "A", scene: "a1", who: "砂糖東洋", title: "窓の外の続き", x: 8, y: 58, flag: "SATOU" },
  { id: "B", scene: "b1", who: "数理零", title: "面白いの向こう側", x: 30, y: 20, flag: "REI" },
  { id: "C", scene: "c1", who: "寺地星", title: "最後の朗読、まだ早いけど", x: 52, y: 52, flag: "TERACHI" },
  { id: "D", scene: "d1", who: "両馬二郎", title: "祖父と✝本質✝", x: 37, y: 76, flag: "RYOMA" },
  { id: "E", scene: "e1", who: "南棟の面々", title: "境界線の向こう側", x: 74, y: 14, flag: "MINAMITOU" },
  { id: "F", scene: "f1", who: "召野＋倉石", title: "調査と応援", x: 71, y: 70, flag: "MESHINO" },
];
function showHub() {
  return new Promise(resolve => {
    showMsgWindow(false);
    $("next-arrow").classList.remove("show");
    const ov = $("hub-overlay");
    ov.innerHTML = `
      <div class="hub-tint"></div>
      <div id="hub-title"><div class="main">見送りの準備、始めます</div><div class="sub">どこから聞きに行く？　 ― HUB ―</div></div>
      <div id="hub-map"><svg class="hub-path" viewBox="0 0 1040 470">
        <path d="M60,300 C160,120 320,60 500,140 S 760,60 860,90" fill="none" stroke="rgba(201,168,106,.35)" stroke-width="1.5" stroke-dasharray="6 7"/>
        <path d="M120,400 C260,430 420,420 560,390 S 800,370 840,330" fill="none" stroke="rgba(201,168,106,.3)" stroke-width="1.5" stroke-dasharray="6 7"/>
        <path d="M500,140 C560,200 600,260 700,320" fill="none" stroke="rgba(201,168,106,.25)" stroke-width="1.5" stroke-dasharray="6 7"/>
      </svg></div>
      <button id="hub-proceed">◆ 全ての話を聞いて、収束章へ</button>`;
    const map = ov.querySelector("#hub-map");
    const remain = ROUTES.filter(r => !G.routesDone[r.id]);
    ROUTES.forEach(r => {
      const node = document.createElement("div");
      node.className = "hub-node";
      node.style.left = r.x + "%"; node.style.top = r.y + "%";
      const done = !!G.routesDone[r.id];
      const first = G.firstD && r.id === "D" && !done;
      node.innerHTML = `<div class="rt">ルート ${r.id}　${esc(r.who)}</div>
        <div class="tt">「${r.title}」</div>
        <div class="st">${done ? "★ 聞いた" : (first ? "▶ 三重が最初に思い当たる相手" : "まだ聞いていない")}</div>`;
      node.onclick = () => {
        seSafe("se_decide");
        ov.classList.remove("show"); ov.innerHTML = "";
        G.currentRoute = r.id;
        resolve({ type: "route", scene: r.scene });
      };
      map.appendChild(node);
    });
    const proceed = ov.querySelector("#hub-proceed");
    proceed.onclick = () => {
      seSafe("se_decide");
      if (remain.length > 0) {
        ov.classList.remove("show"); ov.innerHTML = "";
        resolve({ type: "gate" });
      } else {
        ov.classList.remove("show"); ov.innerHTML = "";
        resolve({ type: "route", scene: "g1", convergence: true });
      }
    };
    ov.classList.add("show");
  });
}
async function hubGateReturn() {
  // 未読ありで収束章へ行こうとした場合の一言 → HUBへ戻す
  await sayText("nar", null, "――その足が、ふと止まった。まだ聞けていない話がある気がする。");
  await sayText("mono", "mie", "（……まだ、だ。全部聞いてからにしよう）");
  G.sceneId = "hub"; G.idx = 0;
  const res = await showHub();
  return res;
}

/* ============================================================
   エンディング判定
   ============================================================ */
function achievedFlags() {
  return Object.keys(G.flags).filter(k => G.flags[k] >= 4);
}
function determineEnding() {
  const f = G.flags;
  if (f.RYOMA >= 4 && G.tease >= 3 && G.heart >= 12 && G.heart <= 17) return "comedy";
  const ach = achievedFlags();
  if (G.heart >= 24 && ach.length >= 6) return "true";
  if (G.heart >= 18) {
    const order = ["MIE", "SATOU", "REI", "TERACHI", "RYOMA", "MINAMITOU", "MESHINO", "IZAKI"];
    let best = null, bv = 0;
    for (const k of order) { if (f[k] > bv) { bv = f[k]; best = k; } }
    if (best && bv >= 4) {
      if (best === "MESHINO") return G.side === "kuraishi" ? "kuraishi" : "meshino";
      if (best === "MINAMITOU") return "minamitou";
      if (best === "IZAKI") return "izaki";
      return best.toLowerCase();
    }
    return "normal";
  }
  if (G.heart >= 12) return "normal";
  return "bitter";
}

/* ============================================================
   セーブ / ロード
   ============================================================ */
function stateSnapshot() {
  return {
    sceneId: G.sceneId, idx: G.idx,
    heart: G.heart, flags: { ...G.flags }, tease: G.tease, side: G.side,
    ch1: G.ch1, lastChoice: G.lastChoice, firstD: G.firstD,
    currentRoute: G.currentRoute, routesDone: { ...G.routesDone },
    bg: G.bg, bgTint: G.bgTint, cgId: G.cgId,
    sprites: { ...G.sprites },
    auto: G.auto,
    chapter: SCENES[G.sceneId] ? SCENES[G.sceneId].title : "",
    playtime: GL.playtime,
    stamp: Date.now(),
  };
}
function doSave(slot, silent) {
  const data = stateSnapshot();
  try { localStorage.setItem("honzitsu_save_" + slot, JSON.stringify(data)); } catch (e) { return false; }
  if (!silent) toast((slot === "auto" ? "オート" : slot === "quick" ? "クイック" : "スロット" + slot) + "にセーブしました");
  return true;
}
function loadSave(slot) {
  try {
    const raw = localStorage.getItem("honzitsu_save_" + slot);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) { return null; }
}
function markSeen(sceneId, idx, text) {
  GL.seen[hash(sceneId + ":" + idx + ":" + text)] = true;
}

/* ============================================================
   スクリプト実行
   ============================================================ */
const SCENES = window.SCENES;

async function runScene(sceneId, startIdx = 0, restore = false) {
  const scene = SCENES[sceneId];
  if (!scene) { console.error("scene not found:", sceneId); return; }
  G.sceneId = sceneId; G.idx = startIdx; G.restoreMode = restore;
  const myRun = G.runId;
  if (!restore && !sceneId.startsWith("end_") && sceneId !== "hub") doSave("auto", true);
  while (G.idx < scene.data.length) {
    if (myRun !== G.runId) return "abort";
    // 復元モード: セーブ位置まで来たら対話モードへ復帰
    if (G.restoreMode && G.restoreTargetScene === sceneId && G.idx === G.restoreTargetIdx) {
      G.restoreMode = false;
    }
    const cmd = scene.data[G.idx];
    const r = await execCommand(cmd, sceneId);
    if (r) return r;   // jumped / ended / abort
    G.idx++;
  }
  // シーン終端
  if (restore) {
    if (sceneId.startsWith("end_")) { G.restoreMode = false; await runCredits(); return "ended"; }
    G.restoreMode = false;
    return;
  }
  // 終端に達した(通常はjump等で抜ける)
  G.running = false;
  showTitle();
}

async function handleHubResult(res) {
  if (res.type === "route") {
    await runScene(res.scene, 0);
  } else if (res.type === "gate") {
    await hubGateReturn();
  }
}

function gain(effects) {
  if (!effects) return;
  if (effects.heart) G.heart += effects.heart;
  if (effects.flags) for (const k in effects.flags) G.flags[k] = (G.flags[k] || 0) + effects.flags[k];
  if (effects.tease) G.tease += effects.tease;
  if (effects.side) G.side = effects.side;
}

async function execCommand(cmd, sceneId) {
  const t = cmd[0];
  switch (t) {
    case "bg": setBG(cmd[1], cmd[2] || {}); if (!G.restoreMode) await sleep(120); return;
    case "bgm": if (!G.restoreMode) bgmSafePlay(cmd[1]); return;
    case "bgmstop": if (!G.restoreMode) try { window.AudioSys.stopBGM((cmd[1] || 1000) / 1000); } catch (e) {} return;
    case "se": if (!G.restoreMode) seSafe(cmd[1]); return;
    case "cg": showCG(cmd[1], cmd[2] || {}); if (!G.restoreMode) await sleep(400); return;
    case "cgoff": if (G.cgId) hideCG(); if (!G.restoreMode) await sleep(300); return;
    case "chr": showSprite(cmd[1], cmd[2], cmd[3] || "C"); if (!G.restoreMode) await sleep(150); return;
    case "ex": changeExpr(cmd[1], cmd[2]); if (cmd[3]) showSprite(cmd[1], cmd[2], cmd[3]); if (!G.restoreMode) await sleep(120); return;
    case "hide": hideSprite(cmd[1]); if (!G.restoreMode) await sleep(120); return;
    case "hideall": hideAllSprites(); if (!G.restoreMode) await sleep(120); return;
    case "say": {
      const text = cmd[2];
      if (G.skip && !G.restoreMode && !GL.seen[hash(sceneId + ":" + G.idx + ":" + text)]) {
        G.skip = false;
        $("sm-skip").classList.remove("on");
        $("skip-indicator").classList.remove("show");
        toast("未読テキスト ― スキップ停止");
      }
      await sayText("say", cmd[1], text);
      if (!G.restoreMode) { markSeen(sceneId, G.idx, text); saveGlobal(); }
      return;
    }
    case "nar": case "mono": case "voice": {
      const who = t === "nar" ? null : cmd[1];
      const text = t === "nar" ? cmd[1] : cmd[2];
      // 既読スキップ: 未読テキストに到達したらスキップ解除
      if (G.skip && !G.restoreMode && !GL.seen[hash(sceneId + ":" + G.idx + ":" + text)]) {
        G.skip = false;
        $("sm-skip").classList.remove("on");
        $("skip-indicator").classList.remove("show");
        toast("未読テキスト ― スキップ停止");
      }
      await sayText(t, who, text);
      if (!G.restoreMode) { markSeen(sceneId, G.idx, text); saveGlobal(); }
      return;
    }
    case "wait": {
      if (G.restoreMode || G.skip) return;
      await cancellableSleep(cmd[1]); return;
    }
    case "win": await windowGaze(cmd[1]); return;
    case "center": await showCenter(cmd[1], cmd[2]); return;
    case "chapter": if (!G.restoreMode && !G.skip) { await showChapter(cmd[1], cmd[2]); } return;
    case "choice": {
      if (G.restoreMode) { G.lastChoice = G.lastChoice; return; }
      const i = await showChoice({ prompt: cmd[1].prompt, opts: cmd[1].opts });
      const opt = cmd[1].opts[i];
      G.lastChoice = i;
      gain(opt);
      if (opt.ch1) G.ch1 = opt.ch1;
      if (opt.firstD) G.firstD = true;
      doSave("auto", true);
      return;
    }
    case "gain": gain(cmd[1]); return;
    case "gainif": if (evalCond(cmd[1].cond)) gain(cmd[1]); return;
    case "iflast": {
      const table = cmd.slice(1);
      for (let i = 0; i < table.length; i += 2) {
        if (G.lastChoice === table[i]) { await runScene(table[i + 1], 0, G.restoreMode); return "jumped"; }
      }
      return;
    }
    case "ifch1": {
      const table = cmd.slice(1);
      for (let i = 0; i < table.length; i += 2) {
        if (G.ch1 === table[i]) { await runScene(table[i + 1], 0, G.restoreMode); return "jumped"; }
      }
      return;
    }
    case "branch": {
      const b = cmd[1];
      const arr = evalCond(b.cond) ? b.then : b.else;
      if (arr && arr.length) { await runSub(arr); }
      return;
    }
    case "tips": GL.tips[cmd[1]] = true; saveGlobal(); return;
    case "bbs": await showNet("bbs", cmd[1]); return;
    case "stream": await showNet("stream", cmd[1]); return;
    case "shake": if (!G.restoreMode) { $("stage").classList.remove("shake"); void $("stage").offsetWidth; $("stage").classList.add("shake"); } return;
    case "flash": if (!G.restoreMode) { const f = $("flash-layer"); f.classList.remove("on"); void f.offsetWidth; f.classList.add("on"); } return;
    case "dim": $("dim-layer").style.opacity = cmd[1] != null ? cmd[1] : .5; return;
    case "undim": $("dim-layer").style.opacity = 0; return;
    case "fadeout": $("dim-layer").style.opacity = 1; if (!G.restoreMode) await sleep(cmd[1] || 900); return;
    case "fadein": $("dim-layer").style.opacity = 0; if (!G.restoreMode) await sleep(cmd[1] || 900); return;
    case "jump": {
      const target = cmd[1];
      if (!G.restoreMode) doSave("auto", true);
      await runScene(target, 0, G.restoreMode);
      return "jumped";
    }
    case "returnhub": {
      if (G.currentRoute) G.routesDone[G.currentRoute] = true;
      if (!G.restoreMode) doSave("auto", true);
      if (G.restoreMode) return;
      const res = await showHub();
      await handleHubResult(res);
      return "jumped";
    }
    case "hub": {
      if (G.restoreMode) return;
      const res = await showHub();
      await handleHubResult(res);
      return "jumped";
    }
    case "ending": {
      const id = cmd[1] === "auto" ? determineEnding() : cmd[1];
      G.pendingEnding = id;
      if (!G.restoreMode) doSave("auto", true);
      await runScene("end_" + id, 0, G.restoreMode);
      return "jumped";
    }
    case "endlogo": {
      await showEndLogo(cmd[1], cmd[2]);
      return;
    }
    case "credits": {
      if (G.restoreMode) return;
      await runCredits();
      return "ended";
    }
    default:
      console.warn("unknown command:", cmd);
      return;
  }
}

/* サブコマンド配列を実行(branch用) */
async function runSub(arr) {
  for (const cmd of arr) {
    const r = await execCommand(cmd, G.sceneId);
    if (r === "jumped" || r === "ended") return r;
  }
}

function evalCond(cond) {
  try {
    const f = new Function("heart", "flags", "tease", "side", "routesDone", `"use strict";return (${cond});`);
    return !!f(G.heart, G.flags, G.tease, G.side, G.routesDone);
  } catch (e) { console.warn("cond error", cond, e); return false; }
}

function cancellableSleep(ms) {
  return new Promise(resolve => {
    if (G.skip) return resolve();
    let done = false;
    const finish = () => { if (!done) { done = true; G.waiting = null; resolve(); } };
    G.waiting = finish;
    setTimeout(finish, ms);
  });
}

/* ============================================================
   クレジット
   ============================================================ */
function runCredits() {
  return new Promise(resolve => {
    const v = $("credits-view");
    v.classList.add("show");
    const inner = $("credits-inner");
    inner.style.animation = "none"; void inner.offsetWidth;
    inner.style.animation = "creditsRoll 30s linear forwards";
    bgmSafePlay("bgm24");
    let finished = false;
    const finish = () => {
      if (finished) return; finished = true;
      v.classList.remove("show");
      $("credits-skip").removeEventListener("click", finish);
      v.removeEventListener("click", finish);
      // ED回収記録
      const id = G.pendingEnding;
      if (id) {
        const first = !GL.endings[id];
        GL.endings[id] = true;
        GL.clears = Object.keys(GL.endings).length;
        saveGlobal();
        if (first) toast("ENDリストに記録：『" + (ENDING_META[id] || id) + "』");
      }
      try { window.AudioSys.stopBGM(1.5); } catch (e) {}
      setTimeout(() => { toTitle(); resolve(); }, 600);
    };
    inner.addEventListener("animationend", finish, { once: true });
    $("credits-skip").addEventListener("click", finish);
    v.addEventListener("click", finish);
  });
}

const ENDING_META = {
  true: "地面は、忘れない。", mie: "否定の向こう側", satou: "見ている、それだけで",
  rei: "面白いを仕事にする", terachi: "配信は続く", ryoma: "✝本質✝、その後",
  izaki: "隣にいた二人、それぞれの歩幅", meshino: "言葉を届ける", kuraishi: "年鑑、完結せず",
  minamitou: "境界のない春", normal: "見えないけど、ある", bitter: "こぼれた地図",
  comedy: "原✝本質✝、完全体", bonus: "また、この教室で",
};

/* ============================================================
   トースト / デバッグ
   ============================================================ */
let toastTimer = null;
function toast(text) {
  const el = $("toast");
  el.textContent = text;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
}
function updateDebug() {
  const el = $("debug-panel");
  if (!GL.settings.debug) { el.style.display = "none"; return; }
  el.style.display = "block";
  el.textContent =
    `scene: ${G.sceneId} idx:${G.idx}\n` +
    `心Point: ${G.heart}\n` +
    `flags: ${JSON.stringify(G.flags)}\n` +
    `tease: ${G.tease} side: ${G.side} ch1: ${G.ch1}\n` +
    `routes: ${JSON.stringify(G.routesDone)}\n` +
    `ending: ${determineEnding()}`;
}

/* ============================================================
   タイトル画面
   ============================================================ */
function toTitle() {
  G.running = false;
  showTitle();
}
function showTitle() {
  hideAllSprites();
  $("msg-frame").classList.remove("show");
  $("sys-menu").classList.remove("show");
  $("skip-indicator").classList.remove("show");
  G.auto = false; G.skip = false;
  $("sm-auto").classList.remove("on");
  const t = $("title-screen");
  // 背景とロゴ
  const f = bgFile("BG17");
  $("title-bg-img").src = f;
  // セーブ有無で「つづきから」
  const hasSave = !!loadSave("auto") || Array.from({ length: 12 }, (_, i) => loadSave(i + 1)).some(Boolean) || !!loadSave("quick");
  const contBtn = $("btn-continue");
  contBtn.classList.toggle("disabled", !hasSave);
  // BONUS出現条件: 他13種回収
  const others = Object.keys(GL.endings).filter(k => k !== "bonus").length;
  $("btn-bonus").style.display = others >= 13 ? "" : "none";
  t.classList.add("show");
  updateDebug();
}

function startNew() {
  G.runId++;
  G.running = true;
  clearInterval(typeTimer); typeTimer = null; typeResolve = null; G.waiting = null;
  closeAllOv();
  // 状態リセット
  G.heart = 0; G.flags = { MIE: 0, SATOU: 0, REI: 0, TERACHI: 0, RYOMA: 0, MINAMITOU: 0, MESHINO: 0, IZAKI: 0 };
  G.tease = 0; G.side = null; G.ch1 = 0; G.lastChoice = -1; G.firstD = false;
  G.currentRoute = null; G.routesDone = {}; G.history = [];
  G.startedAt = Date.now();
  $("title-screen").classList.remove("show");
  try { window.AudioSys.ensure(); } catch (e) {}
  runScene("prologue", 0);
}
function continueGame() {
  let data = loadSave("auto");
  let slot = "auto";
  if (!data) { for (let i = 1; i <= 12; i++) { data = loadSave(i); if (data) { slot = i; break; } } }
  if (!data) { data = loadSave("quick"); slot = "quick"; }
  if (!data) { toast("セーブデータがありません"); return; }
  $("title-screen").classList.remove("show");
  loadIntoGame(data);
}
function loadIntoGame(data) {
  G.runId++;
  G.running = true;
  clearInterval(typeTimer); typeTimer = null; typeResolve = null; G.waiting = null;
  closeAllOv();
  $("choice-box").classList.remove("show");
  $("msg-frame").classList.remove("show");
  G.restoreTargetScene = data.sceneId;
  G.restoreTargetIdx = data.idx || 0;
  G.heart = data.heart || 0;
  G.flags = Object.assign({ MIE: 0, SATOU: 0, REI: 0, TERACHI: 0, RYOMA: 0, MINAMITOU: 0, MESHINO: 0, IZAKI: 0 }, data.flags);
  G.tease = data.tease || 0; G.side = data.side || null;
  G.ch1 = data.ch1 || 0; G.lastChoice = data.lastChoice != null ? data.lastChoice : -1;
  G.firstD = !!data.firstD; G.currentRoute = data.currentRoute || null;
  G.routesDone = data.routesDone || {};
  G.history = []; G.startedAt = Date.now();
  try { window.AudioSys.ensure(); } catch (e) {}
  // 画面状態を復元してから該当位置へ
  restoreVisual(data).then(() => {
    if (data.sceneId === "hub") {
      G.sceneId = "hub"; G.idx = 0;
      runScene("hub", 0);
    } else {
      runScene(data.sceneId, data.idx || 0, true);
    }
  });
}
function restoreVisual(data) {
  return new Promise(resolve => {
    if (data.bg) setBG(data.bg, { tint: data.bgTint });
    if (data.cgId) showCG(data.cgId, { tint: data.bgTint, caption: "" });
    else if (G.cgId) hideCG();
    // 立ち絵はスクリプト再実行で復元されるため、ここではクリアのみ
    hideAllSprites();
    setTimeout(resolve, 300);
  });
}

/* ============================================================
   UIイベント
   ============================================================ */
function bindUI() {
  // タイトル
  $("btn-new").onclick = () => { seSafe("se_decide"); startNew(); };
  $("btn-continue").onclick = () => { seSafe("se_decide"); continueGame(); };
  $("btn-gallery").onclick = () => { seSafe("se_decide"); openGallery(); };
  $("btn-tips").onclick = () => { seSafe("se_decide"); openTips(); };
  $("btn-endlist").onclick = () => { seSafe("se_decide"); openEndList(); };
  $("btn-config").onclick = () => { seSafe("se_decide"); openConfig(); };
  $("btn-bonus").onclick = () => { seSafe("se_decide"); G.runId++; G.running = true; $("title-screen").classList.remove("show"); G.pendingEnding = "bonus"; G.heart = 30; G.startedAt = Date.now(); runScene("end_bonus", 0); };

  // メッセージ送り
  $("msg-frame").addEventListener("click", e => { advanceClick(); });
  $("stage").addEventListener("click", e => {
    if (e.target.closest("#sys-menu") || e.target.closest(".ov") || e.target.closest("#choice-box") || e.target.closest("#hub-overlay") || e.target.closest(".net-panel")) return;
    advanceClick();
  });

  // システムメニュー
  $("sm-save").onclick = () => openSaveLoad("save");
  $("sm-load").onclick = () => openSaveLoad("load");
  $("sm-log").onclick = () => openLog();
  $("sm-auto").onclick = () => toggleAuto();
  $("sm-skip").onclick = () => toggleSkip();
  $("sm-config").onclick = () => openConfig();
  $("sm-title").onclick = () => { if (confirm("タイトルへ戻りますか？（未セーブの進行は失われます）")) { try { window.AudioSys.stopBGM(1); } catch (e) {} toTitle(); } };

  // パネル共通
  document.querySelectorAll(".panel-close").forEach(el => el.onclick = closeAllOv);
  document.querySelectorAll(".ov").forEach(ov => ov.addEventListener("click", e => { if (e.target === ov) closeAllOv(); }));

  // スキップ解除
  $("skip-indicator").addEventListener("click", () => toggleSkip());

  // キーボード
  document.addEventListener("keydown", e => {
    if ($("title-screen").classList.contains("show")) {
      if (e.key === "Enter") { $("btn-new").click(); }
      return;
    }
    if (e.key === "Enter" || e.key === " ") {
      if (document.querySelector(".ov.show") || $("choice-box").classList.contains("show")) return;
      advanceClick(); e.preventDefault();
    } else if (e.key === "Control") { G.ctrlHeld = true; if (!G.skip) toggleSkip(true); }
    else if (e.key === "Escape") { closeAllOv(); }
    else if (e.key === "a" || e.key === "A") { toggleAuto(); }
    else if (e.key === "b" || e.key === "B") { openLog(); }
  });
  document.addEventListener("keyup", e => {
    if (e.key === "Control" && G.skip) toggleSkip(true);
    G.ctrlHeld = false;
  });

  // CGビューア
  document.querySelector("#cg-viewer .pc").onclick = () => $("cg-viewer").classList.remove("show");

  // デバッグトグル
  $("cfg-debug").onclick = () => {
    GL.settings.debug = !GL.settings.debug; saveGlobal();
    $("cfg-debug").classList.toggle("on", GL.settings.debug);
    updateDebug();
  };
}

function toggleAuto() {
  G.auto = !G.auto;
  $("sm-auto").classList.toggle("on", G.auto);
  toast(G.auto ? "オートモード ON" : "オートモード OFF");
}
function toggleSkip(silent) {
  G.skip = !G.skip;
  $("sm-skip").classList.toggle("on", G.skip);
  $("skip-indicator").classList.toggle("show", G.skip);
  if (!silent) toast(G.skip ? "既読テキストをスキップ中" : "スキップ停止");
  if (!G.skip && typeResolve) { /* 次のクリックで再開 */ }
  if (G.skip && typeResolve) typeResolve();
}

/* ============================================================
   各種ビュー
   ============================================================ */
function closeAllOv() {
  document.querySelectorAll(".ov").forEach(ov => ov.classList.remove("show"));
  $("cg-viewer").classList.remove("show");
}
function openLog() {
  const body = $("log-body");
  body.innerHTML = "";
  if (!G.history.length) { body.innerHTML = `<div class="log-item narration">――まだ、記録はない。</div>`; }
  G.history.slice(-120).forEach(h => {
    const d = document.createElement("div");
    const clsMap = { nar: "narration", mono: "monologue", voice: "voice", speech: "" };
    d.className = "log-item " + (clsMap[h.kind] || "");
    d.innerHTML = (h.name ? `<div class="ln" style="color:${h.color || "var(--accent)"}">${esc(h.name)}</div>` : "") + decorate(h.text);
    body.appendChild(d);
  });
  body.scrollTop = body.scrollHeight;
  $("ov-log").classList.add("show");
}
function pushHistory(kind, name, text, color) {
  G.history.push({ kind, name, text, color });
  if (G.history.length > 400) G.history.shift();
}

function openConfig() {
  const s = GL.settings;
  const t = $("cfg-text"); t.value = s.textSpeed; $("cfg-text-v").textContent = s.textSpeed;
  const a = $("cfg-auto"); a.value = s.autoSpeed; $("cfg-auto-v").textContent = s.autoSpeed;
  const b = $("cfg-bgm"); b.value = Math.round(s.bgmVol * 100); $("cfg-bgm-v").textContent = Math.round(s.bgmVol * 100) + "%";
  const se = $("cfg-se"); se.value = Math.round(s.seVol * 100); $("cfg-se-v").textContent = Math.round(s.seVol * 100) + "%";
  $("cfg-debug").classList.toggle("on", s.debug);
  $("ov-config").classList.add("show");
}
function bindConfig() {
  const s = GL.settings;
  $("cfg-text").oninput = e => { s.textSpeed = +e.target.value; $("cfg-text-v").textContent = s.textSpeed; saveGlobal(); };
  $("cfg-auto").oninput = e => { s.autoSpeed = +e.target.value; $("cfg-auto-v").textContent = s.autoSpeed; saveGlobal(); };
  $("cfg-bgm").oninput = e => { s.bgmVol = +e.target.value / 100; $("cfg-bgm-v").textContent = e.target.value + "%"; window.AudioSys.setBGMVol(s.bgmVol); saveGlobal(); };
  $("cfg-se").oninput = e => { s.seVol = +e.target.value / 100; $("cfg-se-v").textContent = e.target.value + "%"; window.AudioSys.setSEVol(s.seVol); seSafe("se_decide"); saveGlobal(); };
}

function openGallery() {
  const body = $("gal-body");
  body.innerHTML = "";
  const grid = document.createElement("div");
  grid.className = "gal-grid";
  const all = [];
  // reserve（本編で出していない降板CG）はギャラリーに出さない ―― 2026-09-12
  Object.keys(MAN.cg).forEach(id => { if (!MAN.cg[id].reserve) all.push({ id, ...MAN.cg[id] }); });
  Object.keys(MAN.ed_cg).forEach(id => all.push({ id, ...MAN.ed_cg[id] }));
  all.forEach(c => {
    const seen = GL.cg[c.id];
    const d = document.createElement("div");
    d.className = "gal-thumb" + (seen ? "" : " locked");
    const f = cgFile(c.id);
    d.innerHTML = `<div class="im" style="${seen ? `background-image:url('${f}');background-color:#1a2130;background-blend-mode:multiply;` : ""}"></div>
      <div class="cg-no">${c.id.toUpperCase()}</div><div class="cap">${seen ? esc(c.desc) : ""}</div>`;
    if (seen) d.onclick = () => viewCG(c.id, c.desc);
    grid.appendChild(d);
  });
  body.appendChild(grid);
  $("ov-gallery").classList.add("show");
}
function viewCG(id, desc) {
  const v = $("cg-viewer");
  v.querySelector(".big").style.backgroundImage = `url('${cgFile(id)}')`;
  v.querySelector(".big").style.backgroundColor = "#1a2130";
  v.querySelector(".cap").textContent = `${id.toUpperCase()} ― ${desc}`;
  v.classList.add("show");
}

function openTips() {
  const body = $("tips-body");
  body.innerHTML = "";
  Object.keys(window.TIPS).forEach(k => {
    const t = window.TIPS[k];
    const seen = !!GL.tips[k];
    const d = document.createElement("div");
    d.className = "tip-item" + (seen ? "" : " locked");
    d.innerHTML = `<div class="tt">${seen ? "✝ " : ""}${esc(t.title)}</div><div class="td">${seen ? esc(t.text) : "――まだ解読されていない。物語を進めば、ここに記される。"}</div>`;
    body.appendChild(d);
  });
  $("ov-tips").classList.add("show");
}

function openEndList() {
  const body = $("endlist-body");
  body.innerHTML = "";
  const grid = document.createElement("div");
  grid.className = "end-grid";
  const list = [
    ["true", "TRUE END"], ["mie", "GOOD END・三重編"], ["satou", "GOOD END・砂糖編"],
    ["rei", "GOOD END・零編"], ["terachi", "GOOD END・寺地編"], ["ryoma", "GOOD END・両馬編"],
    ["izaki", "GOOD END・伊崎＋伊豆見編"], ["meshino", "GOOD END・召野編"], ["kuraishi", "GOOD END・倉石編"],
    ["minamitou", "GOOD END・南棟編"], ["normal", "NORMAL END"], ["bitter", "BITTERSWEET END"],
    ["comedy", "COMEDY SECRET END"], ["bonus", "BONUS EXTRA"],
  ];
  list.forEach(([id, kind]) => {
    const got = !!GL.endings[id];
    const d = document.createElement("div");
    d.className = "end-chip" + (got ? "" : " locked");
    d.innerHTML = `<div class="ek">${kind}</div><div class="et">${got ? "「" + esc(ENDING_META[id]) + "」" : "？？？"}</div>`;
    grid.appendChild(d);
  });
  body.appendChild(grid);
  const cnt = document.createElement("div");
  cnt.style.cssText = "margin-top:16px;text-align:right;font-size:12px;color:var(--ink-dim);letter-spacing:.2em;";
  cnt.textContent = `回収 ${Object.keys(GL.endings).length} / 14`;
  body.appendChild(cnt);
  $("ov-endlist").classList.add("show");
}

function openSaveLoad(mode) {
  const body = $("sl-body");
  body.innerHTML = "";
  const acts = document.createElement("div");
  acts.className = "sl-actions";
  acts.innerHTML = `<div class="ab" id="sl-quick">クイックセーブ</div>`;
  body.appendChild(acts);
  const grid = document.createElement("div");
  grid.className = "sl-grid";
  for (let i = 1; i <= 12; i++) {
    const data = loadSave(i);
    const chip = document.createElement("div");
    chip.className = "sl-chip" + (data ? "" : " empty");
    chip.innerHTML = data
      ? `<div class="badge">SLOT ${i}</div><div class="chapter">${esc(data.chapter || "")}</div>
         <div class="meta">心Point ${data.heart ?? 0}<br>${new Date(data.stamp).toLocaleString("ja-JP")}</div>`
      : `<div class="badge">SLOT ${i}</div><div class="chapter">――空きスロット――</div>`;
    chip.onclick = () => {
      if (mode === "save") {
        if (!G.running && !G.sceneId) { toast("プレイ中のみセーブできます"); return; }
        doSave(i);
        openSaveLoad("save");
      } else {
        if (!data) { toast("このスロットは空です"); return; }
        closeAllOv();
        loadIntoGame(data);
      }
    };
    grid.appendChild(chip);
  }
  body.appendChild(grid);
  $("sl-quick").onclick = () => { doSave("quick"); };
  $("sl-title").textContent = mode === "save" ? "セーブ" : "ロード";
  $("ov-saveload").classList.add("show");
}

/* ============================================================
   パッチ: sayText に履歴記録を統合
   ============================================================ */
const _sayText = sayText;
sayText = function (kind, who, text) {
  const name = who ? charName(who) : null;
  const color = who && window.CHARS[who] ? window.CHARS[who].color : null;
  if (!G.restoreMode && text) pushHistory(kind === "say" ? "speech" : kind, name, text, color);
  return _sayText(kind, who, text);
};
bindUI();
bindConfig();

window.__engine = {
  G, GL, runScene, showTitle, startNew, toast, updateDebug,
  markSeenFn: markSeen,
};

})();
