/* ============================================================
   起動処理 ― ステージのスケーリング・タイトル演出
   ============================================================ */
(function () {
"use strict";

const $ = id => document.getElementById(id);

/* ステージをウィンドウにフィットさせる (1280x720 論理解像度) */
function fit() {
  const stage = $("stage");
  const w = window.innerWidth, h = window.innerHeight;
  const scale = Math.min(w / 1280, h / 720);
  stage.style.transform = `scale(${scale})`;
  stage.style.marginLeft = "0";
}
window.addEventListener("resize", fit);
window.addEventListener("load", fit);
fit();

/* 桜吹雪 (タイトル画面) */
function makePetals(n) {
  const box = $("petals");
  if (!box) return;
  for (let i = 0; i < n; i++) {
    const p = document.createElement("span");
    p.className = "petal";
    p.style.left = Math.random() * 110 + "%";
    p.style.animationDuration = (7 + Math.random() * 9) + "s";
    p.style.animationDelay = (-Math.random() * 14) + "s";
    p.style.opacity = (0.25 + Math.random() * 0.55).toFixed(2);
    const s = 7 + Math.random() * 8;
    p.style.width = s + "px"; p.style.height = s + "px";
    box.appendChild(p);
  }
}
makePetals(18);

/* プレイ時間計測 (永続) */
setInterval(() => {
  try {
    const GL = window.__engine && window.__engine.GL;
    if (GL) { GL.playtime = (GL.playtime || 0) + 1; }
  } catch (e) {}
}, 1000);

/* デバッグパネル定期更新 */
setInterval(() => {
  try { window.__engine && window.__engine.updateDebug(); } catch (e) {}
}, 1000);

/* 全画像プリロード（2026-09-12: ゲーム開始前に画像を全部読み込む方式へ変更） */
function allImageFiles() {
  const MAN = window.ASSET_MANIFEST || {};
  const out = [];
  const push = f => { if (f) out.push("assets/img/" + f); };
  Object.values(MAN.bg || {}).forEach(v => push(v.file));
  Object.values(MAN.cg || {}).forEach(v => push(v.file));
  Object.values(MAN.ed_cg || {}).forEach(v => push(v.file));
  Object.values(MAN.chr || {}).forEach(c => (c.exprs || []).forEach(e => push(e.file)));
  return Array.from(new Set(out));
}

function loadImage(src, timeout = 20000) {
  return new Promise(resolve => {
    const im = new Image();
    im.decoding = "async";
    const to = setTimeout(() => resolve(false), timeout);
    im.onload = () => { clearTimeout(to); im.decode ? im.decode().then(() => resolve(true), () => resolve(true)) : resolve(true); };
    im.onerror = () => { clearTimeout(to); console.warn("[preload] 読込失敗:", src); resolve(false); };
    im.src = src;
  });
}

async function preloadAll() {
  const files = allImageFiles();
  const total = files.length;
  const txt = document.querySelector("#loading .ld-text");
  let done = 0;
  const setMsg = () => { if (txt) txt.textContent = `地図を広げています…… ${done}/${total}`; };
  setMsg();
  const queue = files.slice();
  const worker = async () => {
    while (queue.length) {
      await loadImage(queue.shift());
      done++; setMsg();
    }
  };
  await Promise.all(Array.from({ length: Math.min(6, total || 1) }, worker));
  if (txt) txt.textContent = "準備完了";
}

/* ローディング解除（全画像の読み込み完了後） */
window.addEventListener("load", () => {
  preloadAll().catch(e => console.warn("[preload]", e)).then(() => {
    const ld = $("loading");
    if (ld) { ld.style.transition = "opacity .8s"; ld.style.opacity = "0"; setTimeout(() => ld.remove(), 850); }
  });
});

})();
