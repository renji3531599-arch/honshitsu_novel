/* ============================================================
   実プレイスルーテスト (node tools/playthrough_test.js)
   jsdom上で実際にゲームを自動プレイし、3ルート3エンディングを検証する
   ============================================================ */
const fs = require("fs");
const path = require("path");
// jsdom は `npm i --no-save jsdom` で ./node_modules に入る。旧環境向けに /tmp フォールバックも残す
let JSDOM; try { ({ JSDOM } = require("jsdom")); } catch (e) { ({ JSDOM } = require("/tmp/node_modules/jsdom")); }

const ROOT = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(ROOT, "game/index.html"), "utf8");

/* scriptタグを剥がして自分で読み込む */
const stripped = html.replace(/<script src="[^"]*"><\/script>/g, "").replace(/<script>[\s\S]*?<\/script>/g, "");
const scriptFiles = [
  "js/assets_manifest.js", "js/characters.js", "js/audio.js",
  "js/script_00_common.js", "js/script_01_routes_abc.js", "js/script_02_routes_cef.js",
  "js/script_03_climax.js", "js/script_04_endings.js", "js/engine.js", "js/main.js",
];

function makeDom() {
  const dom = new JSDOM(stripped, {
    url: "http://localhost/",
    pretendToBeVisual: true,
    runScripts: "outside-only",
  });
  const w = dom.window;
  // タイマー高速化
  const realST = w.setTimeout.bind(w);
  const realSI = w.setInterval.bind(w);
  w.setTimeout = (fn, ms, ...a) => realST(fn, Math.min(ms || 0, 4), ...a);
  w.setInterval = (fn, ms, ...a) => realSI(fn, Math.max(ms || 0, 4), ...a);
  w.confirm = () => true;
  // スクリプト読み込み
  for (const f of scriptFiles) {
    const code = fs.readFileSync(path.join(ROOT, "game", f), "utf8");
    w.eval(code);
  }
  // テスト高速化: テキスト瞬間表示 + オート即送り
  w.eval(`window.__engine.GL.settings.textSpeed = 9; window.__engine.GL.settings.autoSpeed = 9;`);
  w.eval(`window.__engine.showTitle();`);
  return dom;
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function autoPlay(dom, choicePattern, routeOrder, label) {
  const w = dom.window;
  const doc = w.document;
  let ci = 0, ri = 0;
  let done = false, endingSeen = null, hubVisits = 0;
  const t0 = Date.now();

  // 「はじめから」
  const btnNew = doc.getElementById("btn-new");
  btnNew.dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
  await sleep(100);

  for (let tick = 0; tick < 40000 && !done; tick++) {
    await sleep(6);
    // クレジット → skip
    if (doc.getElementById("credits-view").classList.contains("show")) {
      const sk = doc.getElementById("credits-skip");
      if (sk) { sk.dispatchEvent(new w.MouseEvent("click", { bubbles: true })); }
      await sleep(150);
      continue;
    }
    // ENDロゴ → クリック
    if (doc.getElementById("center-text").classList.contains("show")) {
      doc.dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
      await sleep(30);
      continue;
    }
    // 選択肢 (mode: "index"=pattern, "min"=最小heart, "min0"=最初だけ0で他はmin)
    const cbox = doc.getElementById("choice-box");
    if (cbox.classList.contains("show")) {
      const btns = cbox.querySelectorAll(".choice-btn");
      if (btns.length) {
        let pick;
        const opts = w.eval("window.__engine.G.currentChoiceOpts");
        if (choicePattern === "min" || (choicePattern === "min0" && ci > 0)) {
          pick = 0; let bv = Infinity;
          opts.forEach((o, i) => { const v = (o.heart || 0) - 2 * (o.tease || 0); if (v < bv) { bv = v; pick = i; } });
        } else if (choicePattern === "max") {
          pick = 0; let bv = -Infinity;
          opts.forEach((o, i) => { const v = (o.heart || 0) + 2 * Object.values(o.flags || {}).reduce((a, b) => a + b, 0); if (v > bv) { bv = v; pick = i; } });
        } else if (choicePattern === "min0") {
          pick = 0; // 最初の選択肢(第一章)だけは①を選ぶ
        } else {
          pick = choicePattern[Math.min(ci, choicePattern.length - 1)];
        }
        ci++;
        btns[Math.min(pick, btns.length - 1)].dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
        await sleep(20);
      }
      continue;
    }
    // HUB
    const hub = doc.getElementById("hub-overlay");
    if (hub.classList.contains("show")) {
      hubVisits++;
      const nodes = [...hub.querySelectorAll(".hub-node")];
      // 未読ルートを順番に
      const order = routeOrder.map(id => "【" + id + "】");
      let target = null;
      for (const rid of routeOrder) {
        const node = nodes.find(n => n.textContent.includes(`ルート ${rid}`) && !n.textContent.includes("★ 聞いた"));
        if (node) { target = node; break; }
      }
      if (target) { target.dispatchEvent(new w.MouseEvent("click", { bubbles: true })); await sleep(20); continue; }
      const proceed = doc.getElementById("hub-proceed");
      if (proceed) { proceed.dispatchEvent(new w.MouseEvent("click", { bubbles: true })); await sleep(20); }
      continue;
    }
    // ネット画面
    const net = doc.querySelector(".net-overlay");
    if (net && net.classList.contains("show")) {
      const panel = net.querySelector(".net-panel");
      if (panel) panel.dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
      await sleep(20);
      continue;
    }
    // CGビューア (出ないはず)
    // メッセージ送り
    const stage = doc.getElementById("stage");
    stage.dispatchEvent(new w.MouseEvent("click", { bubbles: true }));

    // 終了判定: タイトルに戻った
    if (doc.getElementById("title-screen").classList.contains("show") && ci > 5) {
      done = true;
    }
    if (Date.now() - t0 > 240000) { console.error(`${label}: タイムアウト`); break; }
  }
  const endings = w.eval("JSON.stringify(Object.keys(window.__engine.GL.endings))");
  const scene = w.eval("window.__engine.G.sceneId");
  return { endings: JSON.parse(endings), scene, hubVisits, done };
}

async function run() {
  console.log("=== プレイスルーテスト開始 ===");

  // ---- Run 1: 全て1番目の選択肢 → TRUE END期待 ----
  {
    const dom = makeDom();
    await sleep(200);
    const r = await autoPlay(dom, "max", ["A", "B", "C", "D", "E", "F"], "TRUE");
    const heart = dom.window.eval("window.__engine.G.heart");
    console.log(`[TRUE]  scene=${r.scene} heart=${heart} endings=${JSON.stringify(r.endings)}`);
    if (!r.endings.includes("true")) { console.error("✗ Run1: TRUE END になっていない"); process.exit(1); }
    console.log("✓ Run1: TRUE END 到達");
    dom.window.close();
  }

  // ---- Run 2: 全て2番目の選択肢 → BITTERSWEET 期待 ----
  {
    const dom = makeDom();
    await sleep(200);
    const r = await autoPlay(dom, "min", ["F", "E", "D", "C", "B", "A"], "BITTER");
    const heart = dom.window.eval("window.__engine.G.heart");
    console.log(`[BITTER] scene=${r.scene} heart=${heart} endings=${JSON.stringify(r.endings)}`);
    if (!r.endings.includes("bitter")) { console.error("✗ Run2: BITTERSWEET END になっていない"); process.exit(1); }
    console.log("✓ Run2: BITTERSWEET END 到達 (HUB逆順も確認)");
    dom.window.close();
  }

  // ---- Run 3: 茶化し抜き → COMEDY SECRET 期待 ----
  {
    const dom = makeDom();
    await sleep(200);
    const r = await autoPlay(dom, "min0", ["D", "A", "B", "C", "E", "F"], "COMEDY");
    const heart = dom.window.eval("window.__engine.G.heart");
    const flags = dom.window.eval("JSON.stringify(window.__engine.G.flags)");
    console.log(`[COMEDY] scene=${r.scene} heart=${heart} flags=${flags}`);
    console.log(`[COMEDY] endings=${JSON.stringify(r.endings)}`);
    if (!r.endings.includes("comedy")) { console.error("✗ Run3: COMEDY SECRET END になっていない"); process.exit(1); }
    console.log("✓ Run3: COMEDY SECRET END 到達");
    dom.window.close();
  }

  console.log("\n✔ 全プレイスルーテスト合格");
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
