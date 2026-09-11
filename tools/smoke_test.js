#!/usr/bin/env node
/* ============================================================
   ヘッドレス・スモークテスト（jsdom）
   タイトル→プロローグ→第一章→HUB→全ルート→収束→クライマックス→ED
   を実際のDOM操作で通し、エンジンが破綻しないことを確認する。
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const { JSDOM } = require(path.join(__dirname, '..', 'node_modules', 'jsdom'));

const ROOT = path.join(__dirname, '..');
let html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
// 外部script読み込みは手動evalするため除去
html = html.replace(/<script[^>]*src="[^"]*"[^>]*><\/script>/g, '');
html = html.replace(/<script>\s*window\.addEventListener[\s\S]*?<\/script>/, '');

const { VirtualConsole } = require(path.join(__dirname, '..', 'node_modules', 'jsdom'));
const vc = new VirtualConsole();
let jsdomErrs = 0;
vc.on('jsdomError', function (e) { jsdomErrs++; if (jsdomErrs < 5) console.log('  [JSDOM ERROR]', e.detail && e.detail.stack ? e.detail.stack.split('\n').slice(0, 4).join(' / ') : e.message); });
const dom = new JSDOM(html, {
  url: 'http://localhost/index.html',
  runScripts: 'outside-only',
  pretendToBeVisual: true,
  virtualConsole: vc
});
const { window } = dom;
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// スクリプトを読み込み順に評価
const scripts = [
  'js/data/manifest.js', 'js/audio.js',
  'js/data/10_prologue.js', 'js/data/20_routeA.js', 'js/data/21_routeB.js',
  'js/data/22_routeC.js', 'js/data/23_routeD.js', 'js/data/24_routeE.js',
  'js/data/25_routeF.js', 'js/data/30_convergence.js', 'js/data/31_climax.js',
  'js/data/40_endings.js', 'js/data/45_bonus.js', 'js/engine.js'
];
for (const s of scripts) {
  const code = fs.readFileSync(path.join(ROOT, s), 'utf8');
  window.eval(code);
}

const $ = (id) => window.document.getElementById(id);
const click = (elm) => elm.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }));
let errors = 0;
const err = (m) => { console.error('  [FAIL]', m); errors++; };
const ok = (m) => console.log('  [OK]  ', m);

(async function main() {
  window.VN.boot();
  // 高速化：タイプ演出を即時に
  window.VN.debug.instant(true);

  ok('エンジン起動');
  if (!$('title-screen').classList.contains('shown')) err('タイトル画面が表示されていない');

  // はじめから
  click($('btn-new'));
  await drain(80);
  if (!$('game').classList.contains('shown')) err('ゲーム画面へ遷移していない');

  let lines = 0;
  let choices = 0, boards = 0, chapters = 0, hubs = 0;
  const clickedRoutes = new Set();
  let phase = 'main';
  let started = false, reachedEnd = false;
  let routeOrder = ['A', 'B', 'C', 'D', 'E', 'F'];
  let guard = 0;
  const MAX = 60000;

  while (guard++ < MAX) {
    if (guard % 400 === 0) {
      const w = window.VN.debug.waiting();
      console.log(`   ...loop ${guard} waiting=${w} pc=${window.VN.debug.getPC()} line=${lines} choice=${choices} chapter=${chapters} hub=${hubs}`);
    }
    if ($('end-card').classList.contains('shown')) { click($('end-card')); await drain(60); continue; }
    if ($('staffroll').classList.contains('shown')) { ok('スタッフロール到達'); click($('staffroll')); await drain(60); break; }
    if ($('title-screen').classList.contains('shown') && started) { reachedEnd = true; break; }
    started = true;

    if ($('hub-screen').classList.contains('shown')) {
      hubs++;
      const go = window.document.querySelector('#hub-go');
      if (go) { click(go); await drain(40); continue; }
      const buttons = [...window.document.querySelectorAll('.hub-route:not(.done)')];
      if (!buttons.length) { err('HUBで進めるボタンがない'); break; }
      const b = buttons[0];
      clickedRoutes.add(b.dataset.route);
      click(b); await drain(40);
      continue;
    }
    if ($('chapter-card').classList.contains('shown')) { chapters++; click($('chapter-card')); await drain(30); continue; }
    if ($('board-overlay').classList.contains('shown')) { boards++; click($('board-overlay')); await drain(30); continue; }

    const choiceBtns = window.document.querySelectorAll('#choices .choice-btn');
    if (choiceBtns.length) {
      choices++;
      // 交互に選ぶ（1,2,1,2…）→ 15〜25あたりの心を狙う
      const pick = choices % 2 === 0 ? 0 : (choiceBtns.length > 1 ? 1 : 0);
      click(choiceBtns[pick]);
      await drain(30);
      continue;
    }

    // テキスト待ち
    if (VN_DEBUG_WAIT() === 'text') {
      click($('click-catcher'));
      lines++;
      await drain(2);
      continue;
    }
    await sleep(4);
  }

  function VN_DEBUG_WAIT() { return window.VN.debug.waiting(); }
  async function drain(ms) { await sleep(ms); }

  console.log(`  進行: 行クリック=${lines} 選択=${choices} 章=${chapters} 掲示板=${boards} HUB=${hubs} ルート=[${[...clickedRoutes].join(',')}]`);

  if (lines < 300) err('テキスト進行が異常に少ない');
  if (clickedRoutes.size < 6) err('全ルートを回れていない');
  if (!(choices >= 10)) err('選択肢が想定より少ない');
  if (jsdomErrs) err('JSDOM実行時エラー ' + jsdomErrs + '件');
  if (window.VN.debug.globals().endings && Object.keys(window.VN.debug.globals().endings).length >= 1) {
    ok('エンディング登録: ' + Object.keys(window.VN.debug.globals().endings).join(','));
  } else err('エンディングが登録されていない');

  // 2周目：短縮確認（タイトルに戻れているか）
  if (!$('title-screen').classList.contains('shown')) err('スタッフロール後にタイトルへ戻っていない');
  ok('全体プレイスルー完了');

  // ---- セーブ/ロード往復テスト ----
  click($('btn-new'));
  await drain(50);
  for (let i = 0; i < 200; i++) {
    if ($('chapter-card').classList.contains('shown')) { click($('chapter-card')); await drain(10); continue; }
    if (window.VN.debug.waiting() === 'text') break;
    click($('click-catcher'));
    await drain(5);
  }
  const pcBefore = window.VN.debug.getPC();
  click($('btn-save'));
  await drain(30);
  const slot1 = window.document.querySelector('#save-slots .slot');
  click(slot1);
  await drain(30);
  click($('btn-load'));
  await drain(30);
  const slotAfter = window.document.querySelectorAll('#save-slots .slot')[0];
  click(slotAfter);
  await drain(50);
  if (window.VN.debug.getPC() !== pcBefore) err('ロード後にpcが不一致: ' + pcBefore + '→' + window.VN.debug.getPC());
  else ok('セーブ/ロード往復（pc一致）');
  // タイトルへ戻す
  window.eval("VN.debug.jumpTo('op');");
  click($('btn-menu')); await drain(20);
  click($('menu-to-title')); await drain(30);

  // ---- BONUS EXTRA 到達テスト ----
  window.eval("(function(){ var g = VN.debug.globals(); ['end_true','good_mie','good_satou','good_rei','good_terachi','good_ryoma','good_izaki','good_meshino','good_kuraishi','good_minamitou','end_normal','end_bittersweet','end_comedy'].forEach(function(k){ g.endings[k]=1; }); localStorage.setItem('chizu_tohju_global_v1', JSON.stringify(g)); })();");
  click($('btn-bonus'));
  await drain(50);
  let bonusOk = false;
  for (let i = 0; i < 4000; i++) {
    if ($('end-card').classList.contains('shown')) { click($('end-card')); await drain(20); continue; }
    if ($('staffroll').classList.contains('shown')) { bonusOk = window.VN.debug.globals().endings['end_bonus'] === 1; click($('staffroll')); await drain(20); break; }
    if ($('chapter-card').classList.contains('shown')) { click($('chapter-card')); await drain(10); continue; }
    if (window.VN.debug.waiting() === 'text') { click($('click-catcher')); await drain(3); continue; }
    await sleep(3);
  }
  if (bonusOk) ok('BONUS EXTRA「また、この教室で」到達・登録');
  else err('BONUS EXTRAに到達できない');

  console.log(errors ? `\n結果: ${errors}FAIL` : '\n結果: スモークテスト全完毕');
  process.exit(errors ? 1 : 0);
})().catch(e => { console.error('例外:', e); process.exit(1); });
