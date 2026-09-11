// Visual Novel Engine - まだ地図の途中で
(() => {
  const STORAGE_KEY = "honshitsu_save_v1";
  const LS = {
    get(){
      try{ return JSON.parse(localStorage.getItem(STORAGE_KEY)||"{}"); }catch{return {}}
    },
    set(obj){ localStorage.setItem(STORAGE_KEY, JSON.stringify(obj)); }
  };

  // State
  let state = {
    label: "_prologue",
    index: 0,
    heart: 0,
    flags: {
      FLAG_MIE:0, FLAG_SATOU:0, FLAG_REI:0, FLAG_TERACHI:0,
      FLAG_RYOMA:0, FLAG_MINAMITOU:0, FLAG_MESHINO_KURAISHI:0, FLAG_IZAKI_IZUMI:0
    },
    visitedRoutes: new Set(),
    clearedRoutes: new Set(),
    history: [],
    auto: false,
    skip: false,
    textSpeed: 22, // ms per char
    autoWait: 1800,
    unlockedCG: new Set(),
    unlockedEndings: new Set(),
    seenText: new Set(),
    hubReturns: 0
  };

  // DOM
  const $ = s=>document.querySelector(s);
  const bgImg = $("#bg-img");
  const bgLabel = $("#bg-label");
  const bgLayer = $("#bg-layer");
  const cgLayer = $("#cg-layer");
  const cgImg = $("#cg-img");
  const cgCaption = $("#cg-caption");
  const cgBadge = $("#cg-label-badge");
  const charaLayer = $("#chara-layer");
  const topBarTitle = $("#chapter-title");
  const bgmIndicator = $("#bgm-indicator");
  const bgmText = $("#bgm-text");
  const namePlate = $("#name-plate");
  const speakerNameEl = $("#speaker-name");
  const speakerRubyEl = $("#speaker-ruby");
  const speakerIconEl = $("#speaker-icon");
  const dialogueTextEl = $("#dialogue-text");
  const nextIndicator = $("#next-indicator");
  const choiceLayer = $("#choice-layer");
  const choiceBox = $("#choice-box");
  const choiceTitle = $("#choice-title");
  const toastEl = $("#toast");
  const hubScreen = $("#hub-screen");
  const hubMap = $("#hub-map");
  const hubProgress = $("#hub-progress");
  const historyBody = $("#history-body");
  const saveGrid = $("#save-grid");

  // Screens
  const titleScreen = $("#title-screen");
  const gameScreen = $("#game-screen");
  const historyScreen = $("#history-screen");
  const saveScreen = $("#save-screen");
  const loadScreen = $("#load-screen");
  const configScreen = $("#config-screen");
  const galleryScreen = $("#gallery-screen");
  const tipsScreen = $("#tips-screen");
  const endingScreen = $("#ending-screen");

  let isTyping = false;
  let typingTimer = null;
  let autoTimer = null;
  let currentEntry = null;
  let charaCache = new Map();

  // BGM simulation (no real audio files, show indicator + use oscillator for subtle ambience if enabled)
  let audioCtx = null;
  let bgmOsc = null;
  function ensureAudio(){
    if(!audioCtx){
      try{ audioCtx = new (window.AudioContext||window.webkitAudioContext)(); }catch(e){ audioCtx=null; }
    }
  }
  function playBGM(id){
    if(!id) return;
    const meta = window.SCENARIO_META.bgmMap[id] || id;
    bgmText.textContent = "♪ " + meta;
    bgmIndicator.style.display = "flex";
    // optional subtle pad - not required, just indicator
    if(audioCtx && false){ // disabled to avoid annoyance
    }
    showToast("♪ BGM: " + meta, 2200);
  }
  function playSE(id){
    if(!id) return;
    showToast("SE: " + id, 1200);
    // simple click blip
    ensureAudio();
    if(audioCtx){
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type="sine"; o.frequency.value= 700;
      g.gain.value=0.04;
      o.connect(g); g.connect(audioCtx.destination);
      o.start(); g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime+0.22); setTimeout(()=>o.stop(),250);
    }
  }

  function showToast(msg, dur=1800){
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(()=> toastEl.classList.remove("show"), dur);
  }

  // Character helper
  const CHARA_META = {
    "katsuya":"塀勝也", "ryoma":"両馬二郎", "mie":"三重県臣", "terachi":"寺地星", "satou":"砂糖東洋",
    "rei":"数理零", "izaki":"伊崎", "izumi":"伊豆見", "meshino":"召野カイト", "kuraishi":"倉石暁",
    "futami":"二見玲子", "sakura":"櫻優", "mitsumine":"三峰瑠衣", "naitou":"内藤蘭", "inaba":"稲葉悌二",
    "wakaki-katsuya":"若き勝也"
  };
  function parseCharaId(file){
    // chr_katsuya_01_...
    const m = file.match(/chr_([^_]+)_/);
    if(m) return m[1];
    return "unknown";
  }
  function charaDisplayName(file){
    const key = parseCharaId(file);
    return CHARA_META[key] || key;
  }
  function exprFromFile(file){
    const m = file.match(/chr_[^_]+_\d+_(.+)\.png/);
    if(m) return m[1];
    return "";
  }

  // BG label
  // BG placeholder gradients (since source images are white dummies)
  const BG_GRADIENTS = {
    "bg_hokutou_kyoshitsu_asa.png": "radial-gradient(900px 500px at 30% 20%, #f7e9c6 0%, #d6c7a3 45%, #8b7355 100%)",
    "bg_hokutou_kyoshitsu_hiru.png": "linear-gradient(135deg, #fff8e1 0%, #f5e6c8 45%, #d8c4a6 100%)",
    "bg_hokutou_kyoshitsu_yuugata.png": "linear-gradient(135deg, #ff9a5c 0%, #ff6b6b 35%, #4a1a2a 85%)",
    "bg_hokutou_kyoshitsu_yoru.png": "linear-gradient(135deg, #0f172a 0%, #1e293b 45%, #0c0a08 100%)",
    "bg_rouka_hokutou.png": "linear-gradient(180deg, #e8ddd0 0%, #d6c7b3 60%, #a8947a 100%)",
    "bg_kaidan_odoriba.png": "linear-gradient(180deg, #f5f1e6 0%, #e8ddd0 50%, #c9b69a 100%)",
    "bg_jimushitsu.png": "linear-gradient(135deg, #e8f0e8 0%, #d6e2d6 50%, #a8b8a8 100%)",
    "bg_chizu_hokanko.png": "linear-gradient(135deg, #ede7d3 0%, #d6ccb0 45%, #8b7355 100%)",
    "bg_toshoshitsu.png": "linear-gradient(135deg, #f5efe0 0%, #e8ddd0 50%, #c9b896 100%)",
    "bg_toshokan_shozoko.png": "linear-gradient(135deg, #2a1f18 0%, #4a3525 60%, #1a120d 100%)",
    "bg_suiko_hotori.png": "linear-gradient(135deg, #a8d8ea 0%, #6bb8d6 35%, #2a6b8a 75%, #0f2a3a 100%)",
    "bg_koutei_bunkasai_junbi.png": "linear-gradient(135deg, #a8e6a3 0%, #6bbd6b 50%, #2a4a2a 100%)",
    "bg_taiikukan.png": "linear-gradient(135deg, #e8ddd0 0%, #d6c7b3 50%, #8b7355 100%)",
    "bg_okujou.png": "linear-gradient(180deg, #87ceeb 0%, #a8d8ea 40%, #f5f1e6 100%)",
    "bg_tsuugaku_densha_mado.png": "linear-gradient(90deg, #87ceeb 0%, #f5f1e6 45%, #a8d8a6 100%)",
    "bg_sakura_namiki.png": "linear-gradient(135deg, #ffd6e1 0%, #ffb7d5 25%, #ff9eb5 45%, #a8d8ea 85%, #f5f1e6 100%)",
    "bg_sotsugyoushiki_kaijou.png": "linear-gradient(135deg, #f5f1e6 0%, #ffd6e1 35%, #ff9eb5 65%, #8b7355 100%)",
    "bg_minamitou_kyoshitsu.png": "linear-gradient(135deg, #e0f0ff 0%, #c8e0f0 45%, #a8b8d0 100%)",
    "bg_ryoma_ie_butsudan.png": "linear-gradient(135deg, #2a1f18 0%, #4a2a1a 45%, #1a0f0a 100%)",
    "bg_hawaii_youganchi_kaisou.png": "linear-gradient(135deg, #1a0a0a 0%, #4a1a0a 30%, #8b2a0a 60%, #d46a1a 100%)",
    "bg_yama_gensho_kaisou.png": "linear-gradient(135deg, #a8b8a0 0%, #6b8a6b 35%, #2a4a2a 70%, #0f1a0f 100%)",
    "bg_daigaku_yakou_kaisou.png": "linear-gradient(135deg, #0f172a 0%, #1e3a5f 45%, #2a6b8a 100%)",
    "bg_kyoshitsu_haru_sotsugyougo.png": "linear-gradient(135deg, #f5f1e6 0%, #e8ddd0 50%, #d6c7b3 100%)",
    "bg_kyoshitsu_suunengo.png": "linear-gradient(135deg, #fff8e1 0%, #f5e6c8 45%, #d8c4a6 85%, #8b7355 100%)"
  };
  function updateBG(bgFile){
    if(!bgFile) return;
    bgImg.src = "assets/bg/" + bgFile;
    bgImg.alt = window.SCENARIO_META.bgMap[bgFile] || bgFile;
    bgLabel.textContent = "BG: " + (window.SCENARIO_META.bgMap[bgFile] || bgFile);
    const ph = document.getElementById("bg-placeholder");
    if(ph){
      ph.style.background = BG_GRADIENTS[bgFile] || "linear-gradient(135deg, #1a120d, #2a1e16)";
    }
    bgImg.style.transform = "scale(1.04)";
    setTimeout(()=>{ bgImg.style.transform="scale(1.0)"; }, 6000);
  }
  function updateCG(cgFile){
    if(!cgFile) return;
    // cgFile is like "cg_02" or "cg_end_true.png" or "ui01"
    let src = "";
    let label = cgFile;
    if(cgFile.startsWith("cg_") || cgFile.startsWith("cg_end")){
      src = "assets/cg/" + (cgFile.endsWith(".png") ? cgFile : cgFile + ".png");
      label = cgFile;
    } else if(cgFile.startsWith("ui")){
      src = "assets/ui/" + cgFile + ".png";
      label = cgFile;
    } else {
      src = "assets/cg/" + cgFile + (cgFile.endsWith(".png")?"":".png");
    }
    cgImg.src = src;
    cgBadge.textContent = label;
    cgCaption.textContent = "EVENT CG: " + label + "  — 専用一枚絵（仮素材。製品版では描き下ろしに差し替え）";
    cgLayer.classList.add("active");
    bgLayer.classList.add("is-cg");
    state.unlockedCG.add(label);
    persistMeta();
  }
  function clearCG(){
    cgLayer.classList.remove("active");
    bgLayer.classList.remove("is-cg");
  }

  function renderChara(list){
    // list: [{id, pos}] pos left/center/right
    charaLayer.innerHTML = "";
    if(!list || list.length===0) return;
    // sort by pos order left center right
    const order = {left:0, center:1, right:2};
    list.sort((a,b)=> (order[a.pos]||0)-(order[b.pos]||0));
    const talkName = currentEntry && currentEntry.name;
    list.forEach((c, i)=>{
      const div = document.createElement("div");
      div.className = "chara active";
      // dim non-speakers
      if(talkName){
        const cName = charaDisplayName(c.id);
        // normalize: if talkName contains part of name, focus
        let isTalking = false;
        if(talkName === cName || talkName.includes(cName.slice(0,2)) || cName.includes(talkName.slice(0,2))){
          isTalking = true;
        } else if(list.length===1){
          isTalking = false; // single chara but narrator? keep neutral
          // if there's name, assume that chara is talking
          if(talkName && talkName !== "勝也" && talkName !== "両馬" && talkName !== "三重"){} // no need
          // simpler: if single chara and name is that chara, talking
          if(cName === talkName) isTalking = true;
        }
        // If only one speaker and name matches, focus; otherwise dim others
        if(list.length>1){
          if(isTalking) div.classList.add("focus","talking");
          else div.classList.add("dim");
        } else {
          if(talkName && cName===talkName) div.classList.add("talking");
        }
      }
      div.innerHTML = `
        <div class="chara-silhouette">
          <div class="chara-img-wrap">
            <img src="assets/chara/${c.id}" alt="${charaDisplayName(c.id)}" loading="lazy">
          </div>
          <div class="chara-plate">
            <span class="name">${charaDisplayName(c.id)}</span>
            <span class="expr">${exprFromFile(c.id)}</span>
          </div>
        </div>
      `;
      charaLayer.appendChild(div);
      // staggered entrance
      div.style.transitionDelay = (i*70)+"ms";
    });
  }
  function clearChara(){ charaLayer.innerHTML=""; }

  // Typewriter
  function typeText(text, speed, done){
    isTyping = true;
    nextIndicator.style.opacity = "0";
    dialogueTextEl.textContent = "";
    // process text: replace markers? Keep as is.
    // For typewriter, iterate chars, but respect newlines.
    let i=0;
    const chars = Array.from(text);
    // fast skip if seen text and skip enabled
    const key = state.label + ":" + state.index + ":" + text.slice(0,30);
    const isSeen = state.seenText.has(key);
    if(state.skip && isSeen){
      dialogueTextEl.textContent = text;
      isTyping = false;
      nextIndicator.style.opacity = "1";
      done&&done();
      return;
    }
    function step(){
      if(i>=chars.length){
        isTyping=false;
        nextIndicator.style.opacity="1";
        done&&done();
        if(state.auto) scheduleAuto();
        return;
      }
      dialogueTextEl.textContent += chars[i++];
      // scroll? no
      typingTimer = setTimeout(step, speed);
      // if skip pressed during typing, finish instantly
      if(state.skip && isSeen){
        clearTimeout(typingTimer);
        dialogueTextEl.textContent = text;
        isTyping=false;
        nextIndicator.style.opacity="1";
        done&&done();
      }
    }
    // if textSpeed 0, instant
    if(speed<=2){
      dialogueTextEl.textContent=text;
      isTyping=false;
      nextIndicator.style.opacity="1";
      done&&done();
      if(state.auto) scheduleAuto();
    } else {
      step();
    }
  }
  function scheduleAuto(){
    clearTimeout(autoTimer);
    if(!state.auto) return;
    if(isTyping) return;
    if(choiceLayer && !choiceLayer.classList.contains("hidden")) return;
    if(!hubScreen.classList.contains("hidden")) return;
    autoTimer = setTimeout(()=> advance(), state.autoWait);
  }
  function stopTypingAndShowAll(){
    if(isTyping){
      clearTimeout(typingTimer);
      dialogueTextEl.textContent = currentEntry.text;
      isTyping=false;
      nextIndicator.style.opacity="1";
      return true;
    }
    return false;
  }

  // History
  function pushHistory(entry){
    if(!entry.text) return;
    const h = { name: entry.name || "", text: entry.text, label: state.label, index: state.index };
    state.history.push(h);
    if(state.history.length>200) state.history.shift();
    // also mark seen
    const key = state.label + ":" + state.index + ":" + entry.text.slice(0,30);
    state.seenText.add(key);
    renderHistory();
  }
  function renderHistory(){
    historyBody.innerHTML = "";
    if(state.history.length===0){
      historyBody.innerHTML = '<div style="opacity:0.6;text-align:center;padding:20px;font-size:12px;letter-spacing:0.12em">まだログがありません</div>';
      return;
    }
    // reverse to show latest at bottom? Show chronological top to bottom, latest bottom and scroll to bottom
    state.history.slice().reverse().forEach(h=>{
      const d = document.createElement("div");
      d.className="history-entry";
      d.innerHTML = `<div class="h-name">${h.name? h.name : "— 地の文 —"}</div><div class="h-text">${escapeHtml(h.text).replace(/\n/g,"<br>")}</div>`;
      historyBody.appendChild(d);
    });
  }
  function escapeHtml(s){ return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }

  // Save / Load
  function collectSaveData(){
    return {
      label: state.label,
      index: state.index,
      heart: state.heart,
      flags: {...state.flags},
      visitedRoutes: Array.from(state.visitedRoutes),
      clearedRoutes: Array.from(state.clearedRoutes),
      history: state.history.slice(-50),
      unlockedCG: Array.from(state.unlockedCG),
      unlockedEndings: Array.from(state.unlockedEndings),
      date: new Date().toISOString(),
      previewText: (currentEntry && currentEntry.text) ? currentEntry.text.slice(0,48) : state.label,
      bg: bgImg.src
    };
  }
  function makeSaveSlot(i, forLoad=false){
    const saves = LS.get().saves || {};
    const data = saves[i];
    const div = document.createElement("div");
    div.className = "save-slot" + (data?"":" empty");
    const thumb = data && data.bg ? `<img src="${data.bg}" alt="">` : `<span>No Data</span>`;
    const dateStr = data ? new Date(data.date).toLocaleString("ja-JP") : "空きスロット";
    const label = data ? (data.previewText || data.label) : "クリックでセーブ";
    const label2 = forLoad ? "クリックでロード" : label;
    div.innerHTML = `
      <div class="save-thumb">${thumb}</div>
      <div class="save-info">
        <div class="save-date">SLOT ${i} — ${dateStr}</div>
        <div class="save-label">${escapeHtml(label2)}</div>
        ${data? `<div style="font-size:10px;color:rgba(255,255,255,0.5);margin-top:4px">Heart ${data.heart} / ${Object.entries(data.flags).filter(([k,v])=>v>0).length} flags</div>`:""}
      </div>
    `;
    div.onclick = ()=>{
      if(forLoad){
        if(!data){ showToast("セーブデータがありません",1500); return; }
        loadFromSlot(data);
      } else {
        // save
        const all = LS.get();
        all.saves = all.saves || {};
        all.saves[i] = collectSaveData();
        // also persist meta
        all.meta = { heart: state.heart, flags: state.flags, visited: Array.from(state.visitedRoutes), unlockedCG: Array.from(state.unlockedCG), unlockedEndings: Array.from(state.unlockedEndings) };
        LS.set(all);
        showToast(`SLOT ${i} にセーブしました`,1800);
        renderSaveGrid(false);
        renderSaveGrid(true); // also load grid
      }
    };
    // right click delete? add context
    div.oncontextmenu = (e)=>{
      e.preventDefault();
      if(data){
        if(confirm(`SLOT ${i} のデータを削除しますか？`)){
          const all = LS.get();
          delete all.saves[i];
          LS.set(all);
          renderSaveGrid(forLoad);
          showToast("削除しました",1200);
        }
      }
    };
    return div;
  }
  function renderSaveGrid(forLoad){
    const grid = forLoad ? document.getElementById("load-grid") : saveGrid;
    grid.innerHTML="";
    for(let i=1;i<=6;i++) grid.appendChild(makeSaveSlot(i, forLoad));
  }
  function loadFromSlot(data){
    state.label = data.label;
    state.index = data.index;
    state.heart = data.heart;
    state.flags = {...state.flags, ...data.flags};
    state.visitedRoutes = new Set(data.visitedRoutes||[]);
    state.clearedRoutes = new Set(data.clearedRoutes||[]);
    state.history = data.history||[];
    state.unlockedCG = new Set(data.unlockedCG||[]);
    state.unlockedEndings = new Set(data.unlockedEndings||[]);
    hideAllOverlays();
    showToast("ロードしました — " + data.label,1600);
    renderCurrent();
    updateHubUI();
  }

  // Persist meta (flags, etc) without slot
  function persistMeta(){
    const all = LS.get();
    all.meta = { heart: state.heart, flags: state.flags, visited: Array.from(state.visitedRoutes), cleared: Array.from(state.clearedRoutes), unlockedCG: Array.from(state.unlockedCG), unlockedEndings: Array.from(state.unlockedEndings), seenText: Array.from(state.seenText).slice(-800) };
    LS.set(all);
  }
  function restoreMeta(){
    const all = LS.get();
    if(all.meta){
      if(typeof all.meta.heart==="number") state.heart = all.meta.heart;
      if(all.meta.flags) state.flags = {...state.flags, ...all.meta.flags};
      if(all.meta.visited) state.visitedRoutes = new Set(all.meta.visited);
      if(all.meta.cleared) state.clearedRoutes = new Set(all.meta.cleared);
      if(all.meta.unlockedCG) state.unlockedCG = new Set(all.meta.unlockedCG);
      if(all.meta.unlockedEndings) state.unlockedEndings = new Set(all.meta.unlockedEndings);
      if(all.meta.seenText) state.seenText = new Set(all.meta.seenText);
    }
  }

  // Hub
  function updateHubUI(){
    // hubMap rendering done separately; just update progress
    const total = window.ROUTE_DEFS.length;
    const cleared = state.clearedRoutes.size;
    hubProgress.textContent = `${cleared} / ${total} ルート完了 — Heart ${state.heart}`;
  }
  function renderHub(){
    hubMap.innerHTML="";
    window.ROUTE_DEFS.forEach(def=>{
      const isCleared = state.clearedRoutes.has(def.id);
      const isVisited = state.visitedRoutes.has(def.id);
      const card = document.createElement("div");
      card.className = "hub-card" + (isCleared?" cleared":"") + (false?" locked":"");
      const statusText = isCleared ? "CLEARED" : isVisited ? "READ" : "未訪問";
      const statusClass = isCleared ? "cleared" : isVisited ? "active" : "";
      card.innerHTML = `
        <div class="hub-card-header">
          <span class="hub-card-id">${def.label} — ${def.flag}</span>
          <span class="hub-card-status ${statusClass}">${statusText}</span>
        </div>
        <div class="hub-card-body">
          <div style="display:flex;gap:12px;align-items:flex-start">
            <div class="hub-card-thumb">${def.thumb}</div>
            <div style="flex:1">
              <div class="hub-card-title">${def.title}</div>
              <div style="font-size:11px;letter-spacing:0.08em;color:var(--mauve);margin-top:2px">${def.subtitle} — ${def.chara}</div>
              <div class="hub-card-desc">${def.desc}</div>
            </div>
          </div>
        </div>
        <div class="hub-card-footer">
          <span>${isCleared ? "✓ 完了 — 再読可能" : isVisited ? "途中" : "未読"}</span>
          <span style="color:var(--accent)">▶ 選択</span>
        </div>
      `;
      card.onclick = ()=>{
        if(card.classList.contains("locked")){ showToast("まだ選択できません",1200); return;}
        state.visitedRoutes.add(def.id);
        persistMeta();
        hideAllOverlays();
        jumpTo(def.id, 0);
      };
      hubMap.appendChild(card);
    });
    // Extra card for completion state
    const allCleared = state.clearedRoutes.size >= window.ROUTE_DEFS.length;
    if(allCleared){
      const doneCard = document.createElement("div");
      doneCard.className="hub-card cleared";
      doneCard.style.border="2px solid var(--accent2)";
      doneCard.innerHTML=`
        <div class="hub-card-header"><span class="hub-card-id">NEXT</span><span class="hub-card-status cleared">収束可能</span></div>
        <div class="hub-card-body">
          <div class="hub-card-title">収束章「地図を作る夜」へ進む</div>
          <div class="hub-card-desc">全てのルートを回りました。夜の教室で、集めた欠片を一つの地図にする時間が来ました。</div>
        </div>
        <div class="hub-card-footer"><span>すべての準備が整いました</span><span>▶ 進む</span></div>
      `;
      doneCard.onclick = ()=>{ hideAllOverlays(); jumpTo("shuusoku",0); };
      hubMap.appendChild(doneCard);
    }
    updateHubUI();
  }

  // Jump helpers
  function jumpTo(label, idx=0){
    // mark route cleared if leaving a route
    const prev = state.label;
    if(prev && window.ROUTE_DEFS.some(d=>d.id===prev) && idx===0){
      // we are entering new label, check if previous route was completed fully
      // Actually completion is when route finishes and returns to hub via next:hub_return
      // So not here
    }
    state.label = label;
    state.index = idx;
    renderCurrent();
  }

  // Core render
  function getScenario(label){
    return window.SCENARIO[label] || null;
  }
  function renderCurrent(){
    const arr = getScenario(state.label);
    if(!arr){
      console.error("label not found", state.label);
      showToast("シナリオが見つかりません: "+state.label,2000);
      return;
    }
    if(state.index <0) state.index=0;
    if(state.index >= arr.length){
      // end of label
      handleEndOfLabel();
      return;
    }
    const entry = arr[state.index];
    currentEntry = entry;

    // Handle ending flag
    if(entry.ending){
      doEndingBranch();
      return;
    }
    // Note: entry.hub is informational only; actual hub display is handled in handleEndOfLabel after the hub label's text is consumed.
    // Do NOT early-return for hub entries that have text — let them render normally.

    // BG
    if(entry.bg) updateBG(entry.bg);
    // BGM
    if(entry.bgm) playBGM(entry.bgm);
    // SE
    if(entry.se) playSE(entry.se);
    // CG
    if(entry.cg) updateCG(entry.cg);
    else if(entry.hasOwnProperty("cg") && !entry.cg) clearCG();
    // But if entry doesn't specify cg, keep previous cg? We want to clear CG when bg changes without cg?
    // If entry has no cg key, keep cg as is. If entry explicitly has cg:null, clear.
    // Our entries only include cg when needed, so we keep.

    // Chara
    if(entry.hasOwnProperty("chara")){
      if(entry.chara && entry.chara.length>0) renderChara(entry.chara);
      else clearChara();
    }

    // Notify
    if(entry.notify){
      topBarTitle.textContent = entry.notify;
      showToast(entry.notify, 1800);
    }

    // Flags / Heart
    if(entry.flag){
      state.flags[entry.flag] = (state.flags[entry.flag]||0)+1;
      persistMeta();
    }
    if(entry.heart){
      state.heart += entry.heart;
      persistMeta();
    }
    // support heart addition from choices handled elsewhere

    // Name plate
    if(entry.name){
      namePlate.classList.remove("empty");
      speakerNameEl.textContent = entry.name;
      // ruby / icon
      const iconChar = entry.name.slice(0,1);
      speakerIconEl.textContent = iconChar;
      speakerRubyEl.textContent = ""; // could add
    } else {
      namePlate.classList.add("empty");
      speakerNameEl.textContent = "";
    }

    // Choices
    if(entry.choices && entry.choices.length>0){
      // Type text first, then show choices after typing done?
      // We'll type then show choices
      typeText(entry.text || "", state.textSpeed, ()=>{
        pushHistory(entry);
        showChoices(entry.choices);
      });
    } else {
      // Normal text
      const txt = entry.text || "";
      // If text is empty and no choices, auto advance?
      if(!txt && !entry.name && !entry.bg && !entry.cg){
        // empty entry, skip
        state.index++;
        renderCurrent();
        return;
      }
      typeText(txt, state.textSpeed, ()=>{
        pushHistory(entry);
        // if entry has next, auto jump on advance; otherwise wait for click
      });
    }

    // Update progress indicator for save preview
    // persist meta for resume
    persistMeta();
  }

  function showChoices(choices){
    const listEl = document.getElementById("choice-list") || choiceBox;
    if(listEl && listEl.id === "choice-list") listEl.innerHTML = "";
    else {
      // fallback: preserve title if exists
      const titleExists = document.getElementById("choice-title");
      choiceBox.innerHTML = "";
      if(titleExists) choiceBox.appendChild(titleExists);
      else {
        const t = document.createElement("div");
        t.id = "choice-title";
        choiceBox.appendChild(t);
      }
      const nl = document.createElement("div");
      nl.id = "choice-list";
      choiceBox.appendChild(nl);
    }
    const titleEl = document.getElementById("choice-title");
    if(titleEl) titleEl.textContent = "選択肢 — あなたの寄り添い方が、心PointとFlagに影響します";
    const target = document.getElementById("choice-list") || choiceBox;
    choices.forEach((c,i)=>{
      const btn = document.createElement("button");
      btn.className="choice-btn";
      btn.innerHTML = `${escapeHtml(c.text)} <div class="choice-hint">${c.heart? `Heart ${c.heart>0?`+${c.heart}`:c.heart} `:""}${c.flag? ` / ${c.flag} +1`:""}${c.next? ` → ${c.next}`:""}</div>`;
      btn.onclick = ()=>{
        if(c.heart) state.heart += c.heart;
        if(c.flag) state.flags[c.flag] = (state.flags[c.flag]||0)+1;
        choiceLayer.classList.add("hidden");
        clearTimeout(autoTimer);
        if(c.next){
          if(c.next==="hub_return" || c.next==="hub"){
            const cur = state.label;
            if(window.ROUTE_DEFS.some(d=>d.id===cur)){
              state.clearedRoutes.add(cur);
              state.visitedRoutes.add(cur);
              showToast(`${cur} をクリア — Heart ${state.heart}`, 1600);
              persistMeta();
              state.label = "hub";
              state.index = 0;
              renderCurrent();
              showHub();
              return;
            }
          }
          if(window.SCENARIO[c.next]){
            state.label = c.next;
            state.index = 0;
            renderCurrent();
          } else {
            state.label = c.next;
            state.index = 0;
            renderCurrent();
          }
        } else {
          advance();
        }
        persistMeta();
        updateHubUI();
      };
      target.appendChild(btn);
    });
    choiceLayer.classList.remove("hidden");
  }

  function showHub(){
    hubScreen.classList.remove("hidden");
    renderHub();
    // also show current text? Keep dialogue box visible behind but hub covers
  }
  function hideHub(){ hubScreen.classList.add("hidden"); }

  function hideAllOverlays(){
    hubScreen.classList.add("hidden");
    historyScreen.classList.add("hidden");
    saveScreen.classList.add("hidden");
    loadScreen.classList.add("hidden");
    configScreen.classList.add("hidden");
    galleryScreen.classList.add("hidden");
    tipsScreen.classList.add("hidden");
    endingScreen.classList.add("hidden");
  }

  function handleEndOfLabel(){
    const cur = state.label;
    // If current is a route (A-F) and we reached end, mark cleared and go to hub
    if(window.ROUTE_DEFS.some(d=>d.id===cur)){
      state.clearedRoutes.add(cur);
      state.visitedRoutes.add(cur);
      persistMeta();
      showToast(`${cur} 完了`, 1000);
      updateHubUI();
      // If all cleared, go to shuusoku automatically? else hub
      if(state.clearedRoutes.size >= window.ROUTE_DEFS.length){
        // check if hub not yet shown, go to shuusoku
        // but we will go to hub first, hub will show "next" card
        state.label = "hub";
        state.index = 0;
        renderCurrent();
        showHub();
      } else {
        state.label = "hub";
        state.index = 0;
        renderCurrent();
        showHub();
      }
      return;
    }
    // If hub label end
    if(cur==="hub"){
      // If all routes cleared, auto go to shuusoku
      if(state.clearedRoutes.size >= window.ROUTE_DEFS.length){
        state.label = "shuusoku";
        state.index=0;
        renderCurrent();
      } else {
        showHub();
      }
      return;
    }
    // shuusoku -> climax
    if(cur==="shuusoku"){
      state.label="climax";
      state.index=0;
      renderCurrent();
      return;
    }
    if(cur==="climax"){
      // will have ending_branch handling via ending:true
      state.label="ending_branch";
      state.index=0;
      renderCurrent();
      return;
    }
    if(cur==="ending_branch"){
      doEndingBranch();
      return;
    }
    // Generic next label handling via entry.next
    // If entry had next, it would have jumped earlier; end of array without next -> go hub
    state.label="hub";
    state.index=0;
    renderCurrent();
    showHub();
  }

  // Ending branch logic (mirrors scenareo.txt 7.1)
  function doEndingBranch(){
    // Must handle hub screen hidden
    hideHub();
    // Determine ending based on heart and flags
    const heart = state.heart;
    const flags = state.flags;
    const flagCount = Object.values(flags).filter(v=>v>0).length; // count distinct flags achieved (approx)
    // More precise: count flags where value >=1? Actually FLAG_* need 1+; but true count is number of flags with >=1
    // For FLAG achievement, we consider flag value >=1 as achieved, >=2 as strongly achieved? We'll count >=1
    const achieved = Object.values(flags).filter(v=>v>=1).length;
    // Determine突出 flag (highest)
    let maxFlag = null, maxVal = -1;
    for(const [k,v] of Object.entries(flags)){
      if(v>maxVal){ maxVal=v; maxFlag=k; }
    }
    // Tie handling: if tie, no prominent
    const values = Object.values(flags);
    const maxCount = values.filter(v=>v===maxVal).length;
    const hasProminent = maxCount===1 && maxVal>=2;

    let endingId = "ending_normal";
    let reason = "";

    // Special COMEDY condition: FLAG_RYOMA max + heart 12-17 and仓石茶化し? We approximate: if FLAG_RYOMA is max and heart between 12-17
    const ryomaIsMax = maxFlag==="FLAG_RYOMA" && hasProminent;
    if(ryomaIsMax && heart>=12 && heart<=17 && Math.random()<1){ // we will allow always if conditions met? But random? Use deterministic
      // For demo, if heart in range and ryoma max, trigger comedy with 30% chance? We want variety, but ensure true ending reachable
      // We'll prioritize TRUE first, then comedy if conditions meet and heart in range
      // According to spec, COMEDY needs FLAG_RYOMA最大 + 倉石茶化し全選択 + heart 12-17
      // We can't track茶化し count, so we approx: if ryomaIsMax and heart 12-17, go comedy
      endingId = "ending_comedy";
      reason = `COMEDY SECRET — Heart ${heart}, FLAG_RYOMA突出`;
    } else if(heart>=24 && achieved>=6){
      endingId = "ending_true";
      reason = `TRUE — Heart ${heart} / Flags ${achieved}/8`;
    } else if(heart>=18 && hasProminent){
      // map prominent flag to specific GOOD ending
      const map = {
        "FLAG_MIE":"ending_mie",
        "FLAG_SATOU":"ending_satou",
        "FLAG_REI":"ending_rei",
        "FLAG_TERACHI":"ending_terachi",
        "FLAG_RYOMA":"ending_ryoma",
        "FLAG_MINAMITOU":"ending_minamitou",
        "FLAG_MESHINO_KURAISHI": (Math.random()<0.5?"ending_meshino":"ending_kuraishi"), // split
        "FLAG_IZAKI_IZUMI":"ending_izaki_izumi"
      };
      endingId = map[maxFlag] || "ending_normal";
      reason = `GOOD (${maxFlag}) — Heart ${heart}`;
      if(maxFlag==="FLAG_MESHINO_KURAISHI"){
        // decide based on which sub-flag stronger? We have only one flag for both, random split: choose meshino if heart even, else kuraishi
        endingId = (heart%2===0) ? "ending_meshino" : "ending_kuraishi";
      }
    } else if(heart>=12){
      endingId = "ending_normal";
      reason = `NORMAL — Heart ${heart}`;
    } else {
      endingId = "ending_bittersweet";
      reason = `BITTERSWEET — Heart ${heart}`;
    }

    // Bonus check: if all endings collected previously, allow bonus
    const allEndings = ["ending_true","ending_mie","ending_satou","ending_rei","ending_terachi","ending_ryoma","ending_izaki_izumi","ending_meshino","ending_kuraishi","ending_minamitou","ending_normal","ending_bittersweet","ending_comedy"];
    const hasAll = allEndings.every(e=> state.unlockedEndings.has(e));
    if(hasAll && endingId!=="ending_bonus"){
      // give 10% chance to show bonus instead? Or show after? We'll keep as separate: if hasAll, bonus is selectable from title extra
      // Not auto.
    }

    // Unlock
    state.unlockedEndings.add(endingId);
    persistMeta();

    // Show ending screen
    showEnding(endingId, reason);
  }

  function showEnding(endingId, reason){
    const arr = getScenario(endingId);
    const text = arr ? arr[0].text : "Ending not found";
    const bg = arr ? arr[0].bg : null;
    const cg = arr ? arr[0].cg : null;
    const bgm = arr ? arr[0].bgm : null;
    if(bg) updateBG(bg);
    if(cg) updateCG(cg);
    if(bgm) playBGM(bgm);

    // Build ending card
    const titleMap = {
      "ending_true": ["TRUE END","地面は、忘れない。"],
      "ending_mie": ["GOOD END・三重編","否定の向こう側"],
      "ending_satou": ["GOOD END・砂糖編","見ている、それだけで"],
      "ending_rei": ["GOOD END・零編","面白いを仕事にする"],
      "ending_terachi": ["GOOD END・寺地編","配信は続く"],
      "ending_ryoma": ["GOOD END・両馬編","✝本質✝、その後"],
      "ending_izaki_izumi": ["GOOD END・伊崎+伊豆見編","隣にいた二人、それぞれの歩幅"],
      "ending_meshino": ["GOOD END・召野編","言葉を届ける"],
      "ending_kuraishi": ["GOOD END・倉石編","年鑑、完結せず"],
      "ending_minamitou": ["GOOD END・南棟編","境界のない春"],
      "ending_normal": ["NORMAL END","見えないけど、ある"],
      "ending_bittersweet": ["BITTERSWEET END","こぼれた地図"],
      "ending_comedy": ["COMEDY SECRET END","原✝本質✝、完全体"],
      "ending_bonus": ["BONUS EXTRA","また、この教室で"]
    };
    const [t, sub] = titleMap[endingId] || [endingId, ""];
    const endingTitleEl = $("#ending-title");
    const endingSubEl = $("#ending-subtitle");
    const endingTextEl = $("#ending-text");
    const endingThumbImg = $("#ending-thumb-img");
    const endingBadgeEl = $("#ending-badge");
    endingTitleEl.textContent = t;
    endingSubEl.textContent = sub + "  —  " + reason;
    endingTextEl.textContent = text;
    endingBadgeEl.textContent = t;
    // remove leading bracket title from text? Keep as is
    // Thumbnail
    if(cg){
      endingThumbImg.src = "assets/cg/" + cg;
      endingThumbImg.style.display="block";
    } else if(bg){
      endingThumbImg.src = "assets/bg/" + bg;
      endingThumbImg.style.display="block";
    } else {
      endingThumbImg.style.display="none";
    }
    endingScreen.classList.remove("hidden");
    // Save ending to gallery
    // Also push to history as ending
    showToast(`到達: ${t} — ${reason}`, 2600);
  }

  function advance(){
    if(!choiceLayer.classList.contains("hidden")) return;
    if(!hubScreen.classList.contains("hidden")) return;
    if(!endingScreen.classList.contains("hidden")) return;
    if(!historyScreen.classList.contains("hidden")) { historyScreen.classList.add("hidden"); return; }
    if(!saveScreen.classList.contains("hidden") || !loadScreen.classList.contains("hidden") || !configScreen.classList.contains("hidden") || !galleryScreen.classList.contains("hidden") || !tipsScreen.classList.contains("hidden")) return;

    if(stopTypingAndShowAll()) return;

    // if current entry has choices, wait
    if(currentEntry && currentEntry.choices) return;

    // if current entry has next (choice-less jump)
    if(currentEntry && currentEntry.next){
      const nxt = currentEntry.next;
      if(nxt==="hub" || nxt==="hub_return"){
        // mark route cleared if we're in a route
        const cur = state.label;
        if(window.ROUTE_DEFS.some(d=>d.id===cur)){
          state.clearedRoutes.add(cur);
          state.visitedRoutes.add(cur);
          persistMeta();
        }
        state.label = "hub";
        state.index = 0;
        renderCurrent();
        showHub();
        return;
      }
      // Check if next is a label
      if(window.SCENARIO[nxt]){
        state.label = nxt;
        state.index = 0;
        renderCurrent();
        return;
      } else {
        // maybe next is ending label?
        state.label = nxt;
        state.index=0;
        renderCurrent();
        return;
      }
    }

    // otherwise increment index
    state.index++;
    renderCurrent();
    // if auto, schedule next
    if(state.auto) scheduleAuto();
  }

  // Input handlers
  function initInputs(){
    // Click on stage advances
    const stage = $("#stage");
    stage.addEventListener("click", (e)=>{
      // ignore clicks on buttons / choice layer / hub
      if(e.target.closest("button") || e.target.closest("#choice-layer") || e.target.closest(".overlay-screen") || e.target.closest("#hub-screen") || e.target.closest("#ending-screen")) return;
      if(choiceLayer && !choiceLayer.classList.contains("hidden")) return;
      advance();
    });
    // Keyboard
    window.addEventListener("keydown", (e)=>{
      if(e.key===" " || e.key==="Enter"){
        e.preventDefault();
        advance();
      } else if(e.key==="Escape"){
        if(!historyScreen.classList.contains("hidden") || !saveScreen.classList.contains("hidden") || !loadScreen.classList.contains("hidden") || !configScreen.classList.contains("hidden") || !galleryScreen.classList.contains("hidden") || !tipsScreen.classList.contains("hidden")){
          hideAllOverlays();
        } else if(!hubScreen.classList.contains("hidden")){
          // cannot close hub if not all cleared?
          showToast("HUBは閉じられません — ルートを選択してください",1500);
        } else if(!endingScreen.classList.contains("hidden")){
          hideAllOverlays();
          // go to title?
        }
      } else if(e.key==="s" && e.ctrlKey){
        e.preventDefault();
        openSave();
      }
    });

    // Buttons
    $("#btn-auto").onclick = ()=>{
      state.auto = !state.auto;
      $("#btn-auto").classList.toggle("active", state.auto);
      $("#btn-auto").textContent = state.auto ? "AUTO ●" : "AUTO";
      if(state.auto){ scheduleAuto(); showToast("AUTO ON",1000);} else { clearTimeout(autoTimer); showToast("AUTO OFF",1000);}
    };
    $("#btn-skip").onclick = ()=>{
      state.skip = !state.skip;
      $("#btn-skip").classList.toggle("active", state.skip);
      $("#btn-skip").textContent = state.skip ? "SKIP ●" : "SKIP";
      showToast(state.skip? "SKIP ON — 既読のみ高速" : "SKIP OFF",1000);
    };
    $("#btn-log").onclick = openHistory;
    $("#btn-save").onclick = openSave;
    $("#btn-load").onclick = openLoad;
    $("#btn-config").onclick = openConfig;
    $("#btn-gallery").onclick = openGallery;
    $("#btn-tips").onclick = openTips;
    $("#btn-title").onclick = ()=>{
      if(confirm("タイトルに戻りますか？（進行は自動保存されます）")){
        persistMeta();
        location.reload();
      }
    };
    // Title buttons
    $("#title-start").onclick = ()=>{
      titleScreen.classList.add("hidden");
      gameScreen.classList.remove("hidden");
      // restore or start fresh? We already restored meta, start at prologue if no save
      const all = LS.get();
      if(all.meta && all.meta.visited && all.meta.visited.length>0){
        // Ask continue?
        if(confirm("続きから始めますか？\n「OK」=続きから / 「キャンセル」=最初から")){
          // keep state as is but jump to hub if already started
          if(state.clearedRoutes.size>0 || state.heart>0){
            state.label="hub";
            state.index=0;
            renderCurrent();
            showHub();
          } else {
            state.label="_prologue";
            state.index=0;
            renderCurrent();
          }
        } else {
          // reset
          state.heart=0;
          state.flags = {FLAG_MIE:0, FLAG_SATOU:0, FLAG_REI:0, FLAG_TERACHI:0, FLAG_RYOMA:0, FLAG_MINAMITOU:0, FLAG_MESHINO_KURAISHI:0, FLAG_IZAKI_IZUMI:0};
          state.visitedRoutes.clear();
          state.clearedRoutes.clear();
          state.history=[];
          persistMeta();
          state.label="_prologue";
          state.index=0;
          renderCurrent();
        }
      } else {
        state.label="_prologue";
        state.index=0;
        renderCurrent();
      }
      // ensure audio context resume on user gesture
      ensureAudio();
      if(audioCtx && audioCtx.state==="suspended") audioCtx.resume();
    };
    $("#title-continue").onclick = ()=>{
      const all = LS.get();
      if(!all.saves || Object.keys(all.saves).length===0){
        showToast("セーブデータがありません",1500);
        return;
      }
      openLoad();
      titleScreen.classList.add("hidden");
      gameScreen.classList.remove("hidden");
    };
    $("#title-gallery").onclick = ()=>{
      titleScreen.classList.add("hidden");
      gameScreen.classList.remove("hidden");
      openGallery();
    };
    $("#title-config").onclick = ()=>{
      titleScreen.classList.add("hidden");
      gameScreen.classList.remove("hidden");
      openConfig();
    };
    // Config controls
    const textSpeedRange = $("#cfg-text-speed");
    const autoSpeedRange = $("#cfg-auto-speed");
    const bgmVolRange = $("#cfg-bgm-vol");
    textSpeedRange.oninput = ()=>{
      const v = parseInt(textSpeedRange.value);
      // invert: slider 1-50, speed = 60 - v*?  Actually textSpeed is ms per char: 2 fast to 50 slow
      state.textSpeed = 52 - v;
      $("#cfg-text-speed-val").textContent = v;
    };
    autoSpeedRange.oninput = ()=>{
      const v = parseInt(autoSpeedRange.value);
      state.autoWait = 3000 - v*22; // 80=> ~1240ms fast, 1=> ~2978 slow
      $("#cfg-auto-speed-val").textContent = v;
    };
    bgmVolRange.oninput = ()=>{
      $("#cfg-bgm-vol-val").textContent = bgmVolRange.value;
    };
    // overlay closes
    document.querySelectorAll("[data-close]").forEach(btn=>{
      btn.onclick = hideAllOverlays;
    });
    // ending buttons
    $("#ending-to-title").onclick = ()=>{
      endingScreen.classList.add("hidden");
      hideAllOverlays();
      titleScreen.classList.remove("hidden");
      gameScreen.classList.add("hidden");
    };
    $("#ending-continue").onclick = ()=>{
      endingScreen.classList.add("hidden");
      // if true ending or normal, go hub or title? For now go hub to collect other endings
      // Keep state flags, allow replay hub
      state.label="hub";
      state.index=0;
      renderCurrent();
      showHub();
    };
    // hub close (only if all cleared, else not)
    $("#hub-close").onclick = ()=>{
      if(state.clearedRoutes.size >= window.ROUTE_DEFS.length){
        hideHub();
        jumpTo("shuusoku",0);
      } else {
        showToast(`あと ${window.ROUTE_DEFS.length - state.clearedRoutes.size} ルート残っています`,1600);
      }
    };
    // gallery filter
    $("#gallery-filter").onchange = renderGallery;
    // tips rendering is inside openTips

    // Sakura canvas
    initSakura();
  }

  function openHistory(){
    hideAllOverlays();
    historyScreen.classList.remove("hidden");
    historyBody.scrollTop = 0;
  }
  function openSave(){
    hideAllOverlays();
    saveScreen.classList.remove("hidden");
    renderSaveGrid(false);
  }
  function openLoad(){
    hideAllOverlays();
    loadScreen.classList.remove("hidden");
    renderSaveGrid(true);
  }
  function openConfig(){
    hideAllOverlays();
    configScreen.classList.remove("hidden");
  }
  function openGallery(){
    hideAllOverlays();
    galleryScreen.classList.remove("hidden");
    renderGallery();
  }
  function openTips(){
    hideAllOverlays();
    tipsScreen.classList.remove("hidden");
    renderTips();
  }

  function renderGallery(){
    const grid = $("#gallery-grid");
    const filter = $("#gallery-filter").value;
    grid.innerHTML="";
    // Build list of CGs
    const allCG = [];
    // From scenario, collect cg ids
    // We'll list asset CG files: cg_01..cg_38 + end ones
    const cgFiles = [];
    for(let i=1;i<=38;i++) cgFiles.push(`cg_${String(i).padStart(2,'0')}`);
    const edFiles = ["cg_end_true","cg_end_mie","cg_end_satou","cg_end_rei","cg_end_terachi","cg_end_ryoma","cg_end_izaki_izumi","cg_end_meshino","cg_end_kuraishi","cg_end_minamitou","cg_end_normal","cg_end_bittersweet","cg_end_comedy","cg_end_bonus"];
    const list = filter==="cg" ? cgFiles : filter==="ed" ? edFiles : [...cgFiles, ...edFiles];
    list.forEach(id=>{
      const unlocked = state.unlockedCG.has(id) || state.unlockedCG.has(id+".png");
      const div = document.createElement("div");
      div.className="gallery-item";
      div.innerHTML = `
        <div class="gallery-thumb ${unlocked?"":"locked"}">
          ${unlocked? `<img src="assets/cg/${id}.png" alt="${id}">` : ""}
        </div>
        <div class="gallery-caption">${id} ${unlocked?"":"— 未開放"}</div>
      `;
      div.onclick = ()=>{
        if(!unlocked){ showToast("まだ見ていないCGです",1200); return; }
        updateCG(id);
        hideAllOverlays();
        showToast(`CG表示: ${id}`,1200);
      };
      grid.appendChild(div);
    });
    $("#gallery-count").textContent = `${Array.from(state.unlockedCG).length} / ${cgFiles.length + edFiles.length} 開放`;
  }

  function renderTips(){
    const body = $("#tips-body");
    body.innerHTML="";
    window.TIPS.forEach(tip=>{
      const div = document.createElement("div");
      div.className="history-entry";
      div.style.cursor="default";
      div.innerHTML = `<div class="h-name" style="color:var(--accent2);font-size:12px">${tip.title}</div><div class="h-text" style="font-size:12.5px;line-height:1.8">${escapeHtml(tip.desc)}</div>`;
      body.appendChild(div);
    });
  }

  // Sakura petals canvas (title)
  function initSakura(){
    const canvas = $("#sakura-canvas");
    if(!canvas) return;
    const ctx = canvas.getContext("2d");
    let W,H, petals=[];
    function resize(){ W=canvas.width=canvas.offsetWidth*window.devicePixelRatio; H=canvas.height=canvas.offsetHeight*window.devicePixelRatio; }
    resize(); window.addEventListener("resize",resize);
    for(let i=0;i<28;i++) petals.push({
      x: Math.random()*1.2-0.1, y: Math.random()*1.2-0.2,
      r: 6+Math.random()*8, rot: Math.random()*Math.PI*2, vr: (Math.random()-0.5)*0.04,
      vx: (Math.random()-0.5)*0.3, vy: 0.25+Math.random()*0.6, opacity: 0.55+Math.random()*0.45,
      scale: 0.7+Math.random()*0.5
    });
    function draw(){
      ctx.clearRect(0,0,W,H);
      petals.forEach(p=>{
        p.x += p.vx*0.004; p.y += p.vy*0.004; p.rot += p.vr;
        if(p.y>1.15){ p.y=-0.1; p.x= Math.random()*1.2-0.1; }
        if(p.x>1.15) p.x=-0.1; if(p.x<-0.1) p.x=1.15;
        const x = p.x*W, y=p.y*H;
        ctx.save();
        ctx.translate(x,y); ctx.rotate(p.rot); ctx.scale(p.scale, p.scale);
        ctx.globalAlpha = p.opacity*0.9;
        // petal shape
        ctx.fillStyle = "#ffd6e1";
        ctx.beginPath();
        ctx.moveTo(0,0);
        ctx.bezierCurveTo(5,-6, 12,-4, 8,6);
        ctx.bezierCurveTo(4,10, -2,8, 0,0);
        ctx.fill();
        ctx.fillStyle = "#ff9eb5";
        ctx.beginPath();
        ctx.ellipse(2,2,1.8,2.8,0.2,0,Math.PI*2);
        ctx.fill();
        ctx.restore();
      });
      requestAnimationFrame(draw);
    }
    draw();
  }

  // Init
  window.addEventListener("DOMContentLoaded", ()=>{
    restoreMeta();
    initInputs();
    // Prepare initial UI states
    gameScreen.classList.add("hidden");
    titleScreen.classList.remove("hidden");
    // Preload bg label placeholder
    bgLabel.textContent = "BG: --";
    // Check for saved continue availability
    const all = LS.get();
    const hasSave = all.saves && Object.keys(all.saves).length>0;
    const contBtn = $("#title-continue");
    if(!hasSave) contBtn.style.opacity="0.5", contBtn.style.pointerEvents="none";
    // Also show unlocked endings count on title
    const countEl = $("#title-unlocked-count");
    if(countEl) countEl.textContent = `${state.unlockedEndings.size} / 14 ENDINGS`;
    // auto show title sakura already
    renderHistory();
    updateHubUI();
  });

  // Expose for debug
  window._vn = { state, jumpTo, advance, LS };
})();
