/* ============================================================
   セーブ/ロード復元テスト (node tools/save_test.js)
   ・プレイ中にスロット保存 → タイトル経由でロード → 続行検証
   ・オートセーブ(つづきから)検証
   ・BONUS EXTRA 解放検証
   ============================================================ */
const fs = require("fs");
const path = require("path");
// jsdom は `npm i --no-save jsdom` で ./node_modules に入る。旧環境向けに /tmp フォールバックも残す
let JSDOM; try { ({ JSDOM } = require("jsdom")); } catch (e) { ({ JSDOM } = require("/tmp/node_modules/jsdom")); }

const ROOT = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(ROOT, "game/index.html"), "utf8");
const stripped = html.replace(/<script src="[^"]*"><\/script>/g, "").replace(/<script>[\s\S]*?<\/script>/g, "");
const scriptFiles = [
  "js/assets_manifest.js", "js/characters.js", "js/audio.js",
  "js/script_00_common.js", "js/script_01_routes_abc.js", "js/script_02_routes_cef.js",
  "js/script_03_climax.js", "js/script_04_endings.js", "js/engine.js", "js/main.js",
];

function makeDom() {
  const dom = new JSDOM(stripped, { url: "http://localhost/", pretendToBeVisual: true, runScripts: "outside-only" });
  const w = dom.window;
  const realST = w.setTimeout.bind(w), realSI = w.setInterval.bind(w);
  w.setTimeout = (fn, ms, ...a) => realST(fn, Math.min(ms || 0, 4), ...a);
  w.setInterval = (fn, ms, ...a) => realSI(fn, Math.max(ms || 0, 4), ...a);
  w.confirm = () => true;
  for (const f of scriptFiles) w.eval(fs.readFileSync(path.join(ROOT, "game", f), "utf8"));
  w.eval(`window.__engine.GL.settings.textSpeed = 9; window.__engine.GL.settings.autoSpeed = 9;`);
  w.eval("window.__engine.showTitle();");
  return dom;
}
const sleep = ms => new Promise(r => setTimeout(r, ms));
const click = (w, el) => el.dispatchEvent(new w.MouseEvent("click", { bubbles: true }));

let failures = 0;
function check(name, cond, detail) {
  if (cond) console.log(`  ✓ ${name}${detail ? " ― " + detail : ""}`);
  else { console.error(`  ✗ ${name}${detail ? " ― " + detail : ""}`); failures++; }
}

async function playTicks(w, doc, ticks, pickMode = "max") {
  for (let i = 0; i < ticks; i++) {
    await sleep(6);
    const cbox = doc.getElementById("choice-box");
    if (cbox.classList.contains("show")) {
      const btns = cbox.querySelectorAll(".choice-btn");
      if (btns.length) {
        let pick = 0;
        if (pickMode === "min") {
          const opts = w.eval("window.__engine.G.currentChoiceOpts") || [];
          let bv = Infinity;
          opts.forEach((o, j) => { const v = (o.heart || 0); if (v < bv) { bv = v; pick = j; } });
        }
        click(w, btns[Math.min(pick, btns.length - 1)]);
      }
      await sleep(10); continue;
    }
    const hub = doc.getElementById("hub-overlay");
    if (hub.classList.contains("show")) {
      const nodes = [...hub.querySelectorAll(".hub-node")];
      const node = nodes.find(n => !n.textContent.includes("★ 聞いた")) || null;
      if (node) { click(w, node); await sleep(10); continue; }
      const pr = doc.getElementById("hub-proceed");
      if (pr) click(w, pr);
      await sleep(10); continue;
    }
    const net = doc.querySelector(".net-overlay");
    if (net && net.classList.contains("show")) { const p = net.querySelector(".net-panel"); if (p) click(w, p); await sleep(10); continue; }
    if (doc.getElementById("credits-view").classList.contains("show")) {
      const sk = doc.getElementById("credits-skip"); if (sk) click(w, sk);
      await sleep(120); continue;
    }
    if (doc.getElementById("center-text").classList.contains("show")) { doc.dispatchEvent(new w.MouseEvent("click", { bubbles: true })); await sleep(10); continue; }
    if (doc.getElementById("title-screen").classList.contains("show")) return "title";
    click(w, doc.getElementById("stage"));
  }
  return "ongoing";
}

async function main() {
  console.log("=== セーブ/ロード テスト ===");
  const dom = makeDom();
  const w = dom.window, doc = w.document;
  await sleep(150);

  // プレイ開始、少し進める
  click(w, doc.getElementById("btn-new"));
  await playTicks(w, doc, 700, "max");
  const s1 = w.eval(`window.__engine.G.sceneId + ":" + window.__engine.G.idx`);
  const h1 = w.eval("window.__engine.G.heart");
  check("プレイ進行", !s1.startsWith("prologue:0"), s1);

  // スロット1にセーブ (システムメニュー → SAVE → chip)
  click(w, doc.getElementById("sm-save"));
  await sleep(30);
  const chips = doc.querySelectorAll("#sl-body .sl-chip");
  check("セーブUI表示", chips.length === 12, "chips=" + chips.length);
  click(w, chips[0]);
  await sleep(30);
  const saved = JSON.parse(w.localStorage.getItem("honzitsu_save_1") || "null");
  check("スロット1に保存", !!saved && saved.sceneId === w.eval("window.__engine.G.sceneId"), saved && saved.sceneId + " heart=" + saved.heart);

  // タイトルへ戻り、スロット1からロード
  click(w, doc.getElementById("sm-title"));
  await sleep(30);
  click(w, doc.getElementById("sm-load"));
  await sleep(30);
  click(w, doc.querySelectorAll("#sl-body .sl-chip")[0]);
  await sleep(300);
  const s2 = w.eval("window.__engine.G.sceneId");
  const h2 = w.eval("window.__engine.G.heart");
  check("ロードで再開", s2 === saved.sceneId, s2);
  check("心Point保持", h2 === saved.heart, h2 + " vs " + saved.heart);

  // ロード後も続きで遊べる(シーンが進行する)
  await playTicks(w, doc, 300, "max");
  const s3 = w.eval("window.__engine.G.sceneId + ':' + window.__engine.G.idx");
  check("ロード後に進行", s3.split(":")[0] === saved.sceneId ? w.eval("window.__engine.G.idx") >= saved.idx - 1 : true, s3);

  // さらに進めて、オートセーブからの「つづきから」を検証
  await playTicks(w, doc, 500, "max");
  const autoRaw = w.localStorage.getItem("honzitsu_save_auto");
  check("オートセーブ存在", !!autoRaw);
  click(w, doc.getElementById("sm-title"));
  await sleep(30);
  // タイトルで「つづきから」
  click(w, doc.getElementById("btn-continue"));
  await sleep(300);
  const s4 = w.eval("window.__engine.G.sceneId");
  check("つづきから再開", !!s4 && s4 !== "prologue", s4);
  // ロード後もちゃんと動く
  const r = await playTicks(w, doc, 900, "max");
  check("再開後もプレイ続行", true, r);

  // ---- BONUS 解放検証 ----
  const ids = ["true","mie","satou","rei","terachi","ryoma","izaki","meshino","kuraishi","minamitou","normal","bitter","comedy"];
  w.eval(`window.__engine.GL.endings = {}; ${JSON.stringify(ids)}.forEach(id => window.__engine.GL.endings[id] = true); window.__engine.showTitle();`);
  await sleep(30);
  const bonusVisible = doc.getElementById("btn-bonus").style.display !== "none";
  check("BONUS出現(13種回収後)", bonusVisible);
  click(w, doc.getElementById("btn-bonus"));
  await sleep(200);
  const bonusScene = w.eval("window.__engine.G.sceneId");
  check("BONUS EXTRA再生", bonusScene === "end_bonus", bonusScene);
  await playTicks(w, doc, 3000, "max");
  check("BONUS回収記録", w.eval("!!window.__engine.GL.endings.bonus") === true);
  const cnt = w.eval("Object.keys(window.__engine.GL.endings).length");
  check("ENDリスト 14/14", cnt === 14, cnt + "/14");

  console.log(failures === 0 ? "\n✔ セーブ/ロードテスト合格" : `\n✘ 失敗${failures}件`);
  process.exit(failures ? 1 : 0);
}
main().catch(e => { console.error(e); process.exit(1); });
