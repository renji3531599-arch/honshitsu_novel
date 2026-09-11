/* ============================================================================
   debug.js —— 管理者コンソール（デバッグモード）
   起動は ?debug=1 / localStorage honshitsu.debug=1 / Ctrl+Shift+D
   全エンド解放・ギャラリー全開放・Flag/Heart操作・シーンジャンプ等を
   ブラウザのコンソールとUIパネルの両方から行える。
   本番では ?debug を付けなければUIは表示されない（コンソールAPIは常にあり）。
   ============================================================================ */

const LS_KEY = 'honshitsu.debug';

function isDebugEnabled(){
  try{
    if (new URLSearchParams(location.search).has('debug')) return true;
    if (localStorage.getItem(LS_KEY)==='1') return true;
  }catch(_){}
  return false;
}

export function createDebug({ game, shell, store, data, def, stage, dom }){
  const api = {};

  // --------- helpers ----------
  const toast = (m)=> { try{ shell.toast(m); }catch(_){ console.log('[debug]',m); } };
  const saveMeta = ()=> store.saveMeta();

  function allCgIds(){ return (data.assets?.list || []).filter(a=> a.cat==='cg').map(a=> a.id); }
  function allChrGroups(){
    const map={};
    (data.assets?.list || []).filter(a=> a.cat==='chr').forEach(a=>{
      const m=a.id.match(/^chr_(.+?)_(\d+)_/);
      if(m){ const slug=m[1], expr=m[2]; (map[slug]=map[slug]||[]).push(expr); }
    });
    // dedup
    Object.keys(map).forEach(k=> map[k]=[...new Set(map[k])].sort());
    return map;
  }

  // --------- endings ----------
  api.unlockAllEndings = ()=>{
    const now=Date.now();
    let n=0;
    Object.keys(def.endings||{}).forEach(id=>{
      if(!store.meta.endings[id]){
        store.meta.endings[id]={ at: now, heart: 30, flags:{ ...game.state.flags }, routes:6, playtime: Math.round(game.playtime||0) };
        n++;
      } else {
        // 既にあるものも at を更新して確実に「回収済み」に
        store.meta.endings[id].at = now;
      }
    });
    store.meta.cleared = true;
    // BONUS は他13種が揃えばタイトルに出現するので、揃えた時点でフラグを立てる
    saveMeta();
    try{ shell.buildTitle(); }catch(_){}
    toast(`全エンド解放: ${Object.keys(def.endings).length}種（新規${n}）`);
    return n;
  };
  api.lockAllEndings = ()=>{
    store.meta.endings = {};
    store.meta.cleared = false;
    saveMeta();
    try{ shell.buildTitle(); }catch(_){}
    toast('全エンドをロックしました');
  };
  api.hasEnding = (id)=> !!store.meta.endings[id];
  api.listEndings = ()=> ({ ...store.meta.endings });

  // --------- gallery ----------
  api.unlockGallery = ()=>{
    const cgIds = allCgIds();
    let added=0;
    cgIds.forEach(id=>{ if(!store.meta.cg.includes(id)){ store.meta.cg.push(id); added++; } });
    const chrMap = allChrGroups();
    Object.entries(chrMap).forEach(([slug, exprs])=>{
      const cur = store.meta.chr[slug] || [];
      exprs.forEach(e=>{ if(!cur.includes(e)){ cur.push(e); added++; } });
      store.meta.chr[slug]=[...new Set(cur)].sort();
    });
    // music
    Object.keys(def.bgmLabels||{}).forEach(id=>{ if(!store.meta.music.includes(id)){ store.meta.music.push(id); added++; } });
    // almanac counters -> 1ずつ
    (def.counters||[]).forEach(c=>{ if(!store.meta.almanac[c.key]){ store.meta.almanac[c.key]=1; added++; } });
    // tips + chats
    Object.keys(data.terms||{}).forEach(id=>{ if(!store.meta.tips.includes(id)){ store.meta.tips.push(id); added++; } });
    Object.keys(data.chats||{}).forEach(id=>{ if(!store.meta.chats.includes(id)){ store.meta.chats.push(id); added++; } });
    // routes
    (def.routes||[]).forEach(r=>{ if(!store.meta.routes[r.key]){ store.meta.routes[r.key]=1; added++; } });
    store.meta.cleared = true;
    saveMeta();
    try{ shell.buildTitle(); }catch(_){}
    toast(`ギャラリー全開放: +${added}件（CG ${cgIds.length}, 立ち絵 ${Object.keys(chrMap).length}キャラ）`);
    return added;
  };
  api.lockGallery = ()=>{
    store.meta.cg=[]; store.meta.chr={}; store.meta.music=[]; store.meta.tips=[]; store.meta.chats=[];
    // routes/almanacは残すか消すか——デバッグでは消す方を選択
    store.meta.routes={}; store.meta.almanac={};
    saveMeta();
    try{ shell.buildTitle(); }catch(_){}
    toast('ギャラリーをロック（初期化）しました');
  };
  api.unlockAll = ()=>{
    const a=api.unlockAllEndings();
    const b=api.unlockGallery();
    // 全ルート到達も
    (def.routes||[]).forEach(r=>{ game.state.routes[r.key]=true; });
    // 心Pointと主要Flagを最大にしてTRUE条件を満たす
    api.maxFlags();
    saveMeta();
    toast(`全開放完了: エンド${a}+ギャラリー${b} / 心30・Flag最大に設定`);
  };
  api.lockAll = ()=>{ api.lockAllEndings(); api.lockGallery(); store.resetMeta(); saveMeta(); try{ shell.buildTitle(); }catch(_){} toast('全データを初期化しました'); };

  // --------- state ----------
  api.setHeart = (v)=>{
    const n=Math.max(-10, Math.min(34, Number(v)||0));
    game.state.heart=n;
    toast(`心Point=${n}`);
    return n;
  };
  api.addHeart = (d)=> api.setHeart(game.state.heart + Number(d||1));
  api.setFlag = (key, val)=>{
    const k = key.startsWith('flag_')? key : 'flag_'+key;
    const n=Math.max(0, Number(val)||0);
    if(!(k in game.state.flags) && k!=='tease'){ toast(`未知のFlag: ${k}`); return; }
    game.state.flags[k]=n;
    toast(`${k}=${n}`);
    return n;
  };
  api.maxFlags = ()=>{
    game.state.heart=30;
    (def.flags||[]).forEach(f=>{ game.state.flags[f.key]=6; });
    game.state.flags.tease=0;
    toast('心30・全Flag6・tease0に設定（TRUE END条件満たす）');
  };
  api.setTease = (v)=>{ game.state.flags.tease=Math.max(0, Number(v)||0); toast(`tease=${game.state.flags.tease}`); };
  api.setRoute = (key, v=true)=>{
    if(v) game.state.routes[key]=true; else delete game.state.routes[key];
    toast(`route_${key}=${!!v}`);
  };
  api.unlockRoutes = ()=>{
    (def.routes||[]).forEach(r=> game.state.routes[r.key]=true);
    (def.routes||[]).forEach(r=> store.meta.routes[r.key]=(store.meta.routes[r.key]||0)+1);
    saveMeta();
    toast('全6ルートを読了扱いにしました');
  };

  // --------- items / tips ----------
  api.giveItem = (id)=>{ game.giveItem(id); toast(`item ${id} を付与`); };
  api.giveTip = (id)=>{ game.giveTip(id); toast(`tip ${id} を解放`); };
  api.listItems = ()=> ({ ...game.state.items });
  api.listFlags = ()=> ({ ...game.state.flags, heart: game.state.heart });

  // --------- jump ----------
  api.jump = (sceneId)=>{
    if(!sceneId){ toast('jump: sceneId を指定してください'); return; }
    if(!data.scenes[sceneId]){ toast(`不明なシーン: ${sceneId}`); console.warn('[debug] unknown scene', sceneId, Object.keys(data.scenes).slice(0,10)); return; }
    // タイトルが表示中なら一旦ゲームへ
    try{ dom.title.classList.add('out'); shell._titleSleep(); }catch(_){}
    game.goto(sceneId);
    toast(`→ ${sceneId} へジャンプ`);
  };
  api.scenes = ()=> Object.keys(data.scenes);
  api.searchScene = (kw)=> Object.entries(data.scenes).filter(([id, sc])=> id.includes(kw) || (sc.label||'').includes(kw)).map(([id, sc])=> `${id} | ${sc.label}`);

  // --------- save / meta ----------
  api.dump = ()=>{
    const out = {
      state: JSON.parse(JSON.stringify(game.state)),
      meta: JSON.parse(JSON.stringify(store.meta)),
      scene: game.state.scene,
      idx: game.state.idx,
      playtime: Math.round(game.playtime||0),
    };
    console.log('[debug dump]', out);
    return out;
  };
  api.exportMeta = ()=>{
    const s=JSON.stringify(store.meta, null, 2);
    console.log(s);
    try{ navigator.clipboard.writeText(s).then(()=> toast('metaをクリップボードへコピー')) }catch(_){ toast('コンソールにmetaを出力しました'); }
    return s;
  };
  api.importMeta = (jsonStr)=>{
    try{
      const o = typeof jsonStr==='string'? JSON.parse(jsonStr) : jsonStr;
      store.meta = Object.assign(store.meta, o);
      saveMeta();
      try{ shell.buildTitle(); }catch(_){}
      toast('metaをインポートしました');
    }catch(e){ toast('import失敗: '+e.message); }
  };
  api.saveSlot = (n)=>{ const snap=game.snapshot(); store.save(n, snap); toast(`SLOT ${n} に保存`); };
  api.loadSlot = (n)=>{ const s=store.load(n); if(s){ game.restore(s); toast(`SLOT ${n} を読込`);} else toast(`SLOT ${n} は空です`); };
  api.clearSaves = ()=>{
    for(let i=0;i<12;i++) store.remove(i);
    store.remove('auto');
    toast('全スロットとオートセーブを削除');
  };

  // --------- debug info ----------
  api.showState = ()=>{ console.table({ heart: game.state.heart, ...game.state.flags }); console.log('routes', game.state.routes); console.log('scene', game.state.scene, 'idx', game.state.idx); };
  api.enable = ()=>{
    try{ localStorage.setItem(LS_KEY,'1'); }catch(_){}
    toast('デバッグモード: 有効（再読込後も維持）');
    showPanel(true);
  };
  api.disable = ()=>{
    try{ localStorage.removeItem(LS_KEY); }catch(_){}
    toast('デバッグモード: 無効');
    showPanel(false);
  };
  api.isEnabled = isDebugEnabled;

  // --------- panel ----------
  let panel=null, panelVisible=false;
  function buildPanel(){
    if(panel) return panel;
    const root=document.createElement('div');
    root.id='debugPanel';
    root.className='hidden';
    root.setAttribute('role','dialog');
    root.setAttribute('aria-modal','false');
    root.setAttribute('aria-label','デバッグコンソール');
    root.innerHTML = `
      <div class="dbg-head">
        <strong>✝ DEBUG CONSOLE</strong>
        <span class="dbg-sub">管理者モード — <code>?debug=1</code> / <code>Ctrl+Shift+D</code></span>
        <button class="dbg-close" id="dbgClose" title="閉じる (Esc)">✕</button>
      </div>
      <div class="dbg-body">
        <div class="dbg-sect">
          <h4>全開放</h4>
          <div class="dbg-row">
            <button data-act="unlockAll" class="primary">★ 全開放（エンド+ギャラリー+TRUE条件）</button>
            <button data-act="unlockEndings">全エンド解放</button>
            <button data-act="unlockGallery">ギャラリー全開放</button>
          </div>
          <div class="dbg-row">
            <button data-act="lockEndings" class="danger">エンドをロック</button>
            <button data-act="lockGallery" class="danger">ギャラリーをロック</button>
            <button data-act="resetAll" class="danger">全初期化（meta+save）</button>
          </div>
          <div class="dbg-hint">全開放は <code>store.meta</code> に14END/52CG/全立ち絵/33辞典/8端末/6ルート/24BGMを書き込み、<code>buildTitle()</code> を更新します。即座にタイトルとギャラリーに反映されます。</div>
        </div>
        <div class="dbg-sect">
          <h4>進行操作</h4>
          <div class="dbg-row">
            <label>心Point <input id="dbgHeart" type="number" min="-10" max="34" value="0" style="width:6em"> <button data-act="setHeart">適用</button> <button data-act="maxFlags">TRUE条件(心30/Flag6)に</button></label>
          </div>
          <div class="dbg-row" id="dbgFlags"></div>
          <div class="dbg-row">
            <input id="dbgScene" list="dbgSceneList" placeholder="scene id (例: a1, g1, end0_pick)" style="flex:1">
            <datalist id="dbgSceneList"></datalist>
            <button data-act="jump">ジャンプ</button>
            <button data-act="hub">HUBを開く</button>
          </div>
          <div class="dbg-row">
            <button data-act="toTitle">タイトルへ</button>
            <button data-act="saveQuick">Quick Save</button>
            <button data-act="loadQuick">Quick Load</button>
            <button data-act="showState">stateをconsole出力</button>
          </div>
        </div>
        <div class="dbg-sect">
          <h4>回収操作</h4>
          <div class="dbg-row">
            <button data-act="giveCorn">コーンスープを付与</button>
            <button data-act="exportMeta">metaをコピー</button>
            <button data-act="dump">dumpをconsole出力</button>
          </div>
          <div class="dbg-row">
            <input id="dbgImport" placeholder='{"endings":{...}} を貼り付け' style="flex:1">
            <button data-act="importMeta">import</button>
          </div>
        </div>
        <div class="dbg-sect">
          <h4>コンソールAPI</h4>
          <pre class="dbg-code">window.__vn.debug.unlockAll()      // 全開放
window.__vn.debug.unlockAllEndings()
window.__vn.debug.unlockGallery()
window.__vn.debug.jump('g1')       // シーンへジャンプ
window.__vn.debug.setHeart(30)
window.__vn.debug.setFlag('mie', 6)
window.__vn.debug.maxFlags()       // TRUE条件に
window.__vn.debug.dump()           // state/metaを出力
# エイリアス: window.debug も同値
# 有効化: ?debug=1 または localStorage honshitsu.debug=1 または Ctrl+Shift+D
</pre>
          <div class="dbg-hint">ヒント: ブラウザの開発者コンソールからも同じAPIを呼べます。管理者以外には <code>?debug=1</code> を教えない限りUIは表示されません。</div>
        </div>
      </div>
      <div class="dbg-foot">
        <span id="dbgStatus"></span>
        <span class="dbg-foot-r">Escで閉じる / Ctrl+Shift+Dで再表示</span>
      </div>
    `;
    document.body.appendChild(root);
    // flags UI
    const flagsBox = root.querySelector('#dbgFlags');
    (def.flags||[]).forEach(f=>{
      const lab=document.createElement('label');
      lab.style.cssText='display:inline-flex;gap:4px;align-items:center;font-size:11px';
      lab.innerHTML=`${f.label}<input data-flag="${f.key}" type="number" min="0" max="10" value="0" style="width:4.2em">`;
      flagsBox.appendChild(lab);
    });
    const teaseLab=document.createElement('label');
    teaseLab.style.cssText='display:inline-flex;gap:4px;align-items:center;font-size:11px';
    teaseLab.innerHTML=`tease<input data-flag="tease" type="number" min="0" max="10" value="0" style="width:4.2em">`;
    flagsBox.appendChild(teaseLab);

    // datalist for scenes
    const dl=root.querySelector('#dbgSceneList');
    Object.keys(data.scenes||{}).forEach(id=>{
      const o=document.createElement('option');
      o.value=id;
      dl.appendChild(o);
    });

    // bind
    root.querySelector('#dbgClose').addEventListener('click', ()=> showPanel(false));
    root.addEventListener('click', (e)=>{
      const b=e.target.closest('button[data-act]');
      if(!b) return;
      const act=b.dataset.act;
      handleAct(act);
    });
    // heart input sync
    root.querySelector('#dbgHeart').value = game.state.heart || 0;
    syncFlagInputs();

    panel=root;
    return panel;
  }

  function syncFlagInputs(){
    if(!panel) return;
    panel.querySelectorAll('input[data-flag]').forEach(inp=>{
      const k=inp.dataset.flag;
      inp.value = (k==='tease'? (game.state.flags.tease||0) : (game.state.flags[k]||0));
    });
    const h=panel.querySelector('#dbgHeart');
    if(h) h.value = game.state.heart;
    const st=panel.querySelector('#dbgStatus');
    if(st) st.textContent = `scene:${game.state.scene||'-'} idx:${game.state.idx} heart:${game.state.heart} flagmax:${Math.max(0,...Object.values(game.state.flags))} | endings ${Object.keys(store.meta.endings||{}).length}/14 cg ${store.meta.cg.length}`;
  }

  function handleAct(act){
    switch(act){
      case 'unlockAll': api.unlockAll(); break;
      case 'unlockEndings': api.unlockAllEndings(); break;
      case 'unlockGallery': api.unlockGallery(); break;
      case 'lockEndings': if(confirm('全エンドをロックしますか？')) api.lockAllEndings(); break;
      case 'lockGallery': if(confirm('ギャラリーをロックしますか？')) api.lockGallery(); break;
      case 'resetAll': if(confirm('全データ（meta+セーブ）を初期化します。よろしいですか？')){ api.lockAll(); for(let i=0;i<12;i++) store.remove(i); store.remove('auto'); } break;
      case 'setHeart': {
        const v=Number(panel.querySelector('#dbgHeart').value);
        api.setHeart(v);
        break;
      }
      case 'maxFlags': api.maxFlags(); break;
      case 'jump': {
        const id=panel.querySelector('#dbgScene').value.trim();
        api.jump(id);
        break;
      }
      case 'hub': {
        // タイトル中でもHUBを呼べるように
        showPanel(false);
        try{ game.state.routes={}; }catch(_){}
        shell.openHub && shell.openHub(()=>{});
        // 既存のHUB演出を呼ぶ（game側のHUBフローとは別にUIだけ開く）
        // 正規ルート: game.showHub相当を直接呼ぶのが確実
        if(game.showHub) game.showHub();
        toast('HUBを開きました（デバッグ）');
        break;
      }
      case 'toTitle': game.toTitle(); break;
      case 'saveQuick': { try{ store.saveAuto(game.snapshot()); toast('Quick Save'); }catch(e){ toast('保存失敗:'+e.message);} break; }
      case 'loadQuick': { const s=store.loadAuto(); if(s){ game.restore(s); toast('Quick Load'); } else toast('auto saveなし'); break; }
      case 'showState': api.showState(); api.dump(); break;
      case 'giveCorn': api.giveItem('corn'); break;
      case 'exportMeta': api.exportMeta(); break;
      case 'dump': api.dump(); break;
      case 'importMeta': {
        const v=panel.querySelector('#dbgImport').value.trim();
        if(v) api.importMeta(v);
        break;
      }
    }
    syncFlagInputs();
    // flag inputs change -> apply immediately
    if(act==='setHeart' || act==='maxFlags') syncFlagInputs();
  }

  function showPanel(v){
    buildPanel();
    panelVisible = typeof v==='boolean'? v : !panelVisible;
    panel.classList.toggle('hidden', !panelVisible);
    if(panelVisible){
      panel.querySelector('#dbgHeart').value = game.state.heart;
      syncFlagInputs();
      // focus first button
      const first = panel.querySelector('button');
      if(first) first.focus();
    } else {
      // return focus
      try{ dom.stage.focus(); }catch(_){}
    }
  }

  // flag inputs live apply
  function bindFlagLive(){
    buildPanel();
    panel.addEventListener('change', (e)=>{
      const inp=e.target.closest('input[data-flag]');
      if(!inp) return;
      const k=inp.dataset.flag;
      const v=Number(inp.value);
      if(k==='tease') game.state.flags.tease=v;
      else game.state.flags[k]=v;
      syncFlagInputs();
    });
    panel.querySelector('#dbgHeart').addEventListener('change', (e)=>{
      api.setHeart(e.target.value);
      syncFlagInputs();
    });
  }
  // expose
  api.togglePanel = ()=> showPanel();
  api.showPanel = ()=> showPanel(true);
  api.hidePanel = ()=> showPanel(false);
  api.panel = ()=> buildPanel();

  // --------- attach global ----------
  window.__vn = window.__vn || {};
  window.__vn.debug = api;
  window.debug = api; // alias for console

  // small corner badge when enabled (always clickable to toggle)
  function addBadge(){
    const b=document.createElement('button');
    b.id='dbgBadge';
    b.title='デバッグコンソール (Ctrl+Shift+D / ?debug=1)';
    b.textContent='✝ DBG';
    b.style.cssText='position:fixed;right:8px;bottom:8px;z-index:80;font:10px/1 var(--ff-sans, monospace);letter-spacing:.18em;padding:6px 8px;border:1px solid rgba(203,178,124,.5);background:rgba(20,16,12,.92);color:var(--gold,#cbb27c);border-radius:99px;box-shadow:0 4px 12px rgba(0,0,0,.4)';
    b.addEventListener('click', ()=> showPanel());
    document.body.appendChild(b);
    // hide when not enabled (but still toggle via shortcut will show)
    if(!isDebugEnabled()) b.classList.add('hidden');
    // expose badge for toggle
    api._badge = b;
  }

  // key binding: Ctrl+Shift+D (or Cmd+Shift+D on Mac)
  function bindKeys(){
    addEventListener('keydown', (e)=>{
      const isD = e.key.toLowerCase()==='d';
      const mod = (e.ctrlKey || e.metaKey) && e.shiftKey;
      if(mod && isD){
        e.preventDefault();
        // toggle enabled flag as well
        if(!isDebugEnabled()){
          try{ localStorage.setItem(LS_KEY,'1'); }catch(_){}
          if(api._badge) api._badge.classList.remove('hidden');
        }
        showPanel();
      }
      // Esc to close panel when visible
      if(e.key==='Escape' && panelVisible){
        // only if panel is visible and no overlay is open (overlay has its own Esc)
        if(panel && !panel.classList.contains('hidden')){
          e.preventDefault();
          e.stopPropagation();
          showPanel(false);
        }
      }
    }, { capture: true });
  }

  // init
  buildPanel();
  bindFlagLive();
  addBadge();
  bindKeys();

  // auto show if ?debug=1 and no overlay
  if(isDebugEnabled()){
    console.log('%c[debug] 管理者モード有効 — window.__vn.debug / window.debug で操作できます。 Ctrl+Shift+D でパネル切替。 help: window.__vn.debug.help && console.log(window.__vn.debug)', 'color:#cbb27c;background:#1a1611;padding:4px 8px;border-radius:4px');
    // パネルは自動で開かない（バッジだけ表示）。開きたい場合は api.showPanel() を呼ぶ
  }

  api.help = ()=>{
    console.log(`
[debug] 管理者コンソール — 主なAPI
  __vn.debug.unlockAll()           全開放（14END+ギャラリー52枚/全立ち絵/辞典/チャット/ルート/BGM + TRUE条件）
  __vn.debug.unlockAllEndings()    全14エンド解放
  __vn.debug.unlockGallery()       ギャラリー全開放（CG/立ち絵/BGM/辞典/端末/アルマナック）
  __vn.debug.lockAllEndings()      全エンドをロック
  __vn.debug.lockGallery()         ギャラリーをロック
  __vn.debug.lockAll()             全初期化
  __vn.debug.setHeart(30)          心Pointをセット (-10〜34)
  __vn.debug.setFlag('mie', 6)     Flagをセット（mie/satou/rei/terachi/ryoma/minamitou/meshino/izaki/kuraishi/tease）
  __vn.debug.maxFlags()            TRUE END条件（心30/全Flag6）に
  __vn.debug.jump('a1')            指定シーンへジャンプ（シーン一覧: __vn.debug.scenes())
  __vn.debug.searchScene('g1')     シーン検索
  __vn.debug.dump()                現在の state/meta を console出力
  __vn.debug.exportMeta()          metaをクリップボードへ
  __vn.debug.saveSlot(1) / loadSlot(1)
  __vn.debug.togglePanel()         パネル切替
  有効化: ?debug=1 をURLに付与 または localStorage.setItem('honshitsu.debug','1')
  無効化: __vn.debug.disable()
`);
  };

  return api;
}
