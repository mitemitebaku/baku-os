/* CHAPTER 02 — isolated game state. Loaded before sheets-sync to retain story mail. */
(() => {
  'use strict';
  const KEY = 'bakuChapter2:v1';
  const MAIL_ID = 'chapter2_prescription';
  const app = document.getElementById('c2App');
  const medical = document.querySelector('[data-window="medical"]');
  const fresh = () => ({version:1,started:false,q1:false,q2:false,mixed:false,complete:false,logs:[],recipe:[],view:'home'});
  const colors = ['blue','red','yellow','white'];
  const colorNames = {blue:'青',red:'赤',yellow:'黄',white:'白'};
  const medicineNames = {blue:'青い薬',red:'赤い薬',yellow:'黄色い薬',white:'白い薬'};
  const effects = {blue:'時間異常を修復',red:'色彩異常を修復',yellow:'視線異常を修復',white:'記憶異常を修復'};
  const dreams = [
    {id:'a',name:'水族館',emoji:'🐟',lines:['水槽の向こうに、赤い魚が泳いでいた。','バグ夢はBかDのどちらかだと思う。']},
    {id:'b',name:'遊園地',emoji:'🎡',lines:['観覧車が、ゆっくり逆回転していた。','バグ夢はAじゃないよ。']},
    {id:'c',name:'図書館',emoji:'📕',lines:['誰もいない図書館で、本が勝手に開いた。','バグ夢はDだよ。']},
    {id:'d',name:'病院',emoji:'🏥',lines:['白い廊下の奥から、誰かが手を振っていた。','Cの言っていることは嘘だよ。']}
  ];
  const logs = ['白い廊下を歩く','時計が逆回転している','右の扉を開く','誰もいない病室','本来は白い花が黒くなっている','花がこちらを見ている'];
  let storageAvailable = true;
  let state = fresh();
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || 'null');
    if(saved?.version === 1) {
      state.started = saved.started === true;
      state.q1 = state.started && saved.q1 === true;
      state.q2 = state.q1 && saved.q2 === true;
      state.mixed = state.q2 && saved.mixed === true;
      state.complete = state.mixed && saved.complete === true;
      state.logs = state.q1 && Array.isArray(saved.logs) ? [...new Set(saved.logs.filter(n=>Number.isInteger(n)&&n>=1&&n<=6))].slice(0,3) : [];
      state.recipe = state.q2 && Array.isArray(saved.recipe) ? saved.recipe.filter(c=>colors.includes(c)).slice(0,3) : [];
      if(state.mixed) state.recipe=['blue','red','yellow'];
      state.view = state.complete ? 'ending' : state.q2 ? 'lab' : state.q1 ? 'analysis' : state.started ? 'records' : 'home';
      if(['home','records'].includes(saved.view) && !state.complete) state.view=saved.view;
    }
  } catch { storageAvailable=false; }
  let chosen = null, audio = null, audioRequest = 0, drag = null, suppressClick=false;
  let timers = [];
  let recoveryRunning = false;
  const assets = window.BAKU_CHAPTER2_ASSETS || {};
  const imagePath = d => assets[d.id]?.image || `assets/chapter2/dream_${d.id}.svg`;
  const audioPath = d => assets[d.id]?.audio || `assets/chapter2/dream_${d.id}.mp3`;
  function save() {
    try {localStorage.setItem(KEY,JSON.stringify(state));storageAvailable=true;}
    catch {storageAvailable=false;}
    const warning=app.querySelector('.c2-save-warning');
    if(warning) warning.hidden=storageAvailable;
  }
  function later(fn,ms) {timers.push(setTimeout(fn,ms));}
  function clearTimers(){timers.forEach(clearTimeout);timers=[];recoveryRunning=false;}
  function stopAudio() {
    audioRequest++;
    if(audio){audio.pause();audio.removeAttribute('src');audio.load();audio=null;}
    app.querySelectorAll('[data-dream]').forEach(b=>{b.classList.remove('c2-playing');b.setAttribute('aria-pressed','false');});
  }
  function cancelDrag() {
    document.querySelector('.c2-drag-ghost')?.remove();
    app.querySelector('.c2-mixing-bottle')?.classList.remove('c2-drop-ready');
    drag=null;
  }
  function feedback(message) {const el=document.getElementById('c2Feedback');if(el)el.textContent=message;}
  function focusHeading() {if(!medical.hidden)focusWindow(medical);app.querySelector('h2')?.focus({preventScroll:true});app.scrollTop=0;}
  function nav(view) {
    if(view==='lab' && !state.q2) return;
    if(view==='analysis' && !state.q1) return;
    if(view==='ending' && !state.complete) return;
    stopAudio();cancelDrag();clearTimers();chosen=null;
    state.view=view;save();render();focusHeading();
  }
  const button=(action,label,extra='')=>`<button type="button" data-c2="${action}" ${extra}>${label}</button>`;
  function shell(body) {
    const stage=state.complete?'04 / COMPLETE':state.q2?'03 / MEDICINE':state.q1?'02 / ANALYSIS':'01 / RECORDS';
    return `<header class="c2-header"><p>CHAPTER 02 : DREAM PRESCRIPTION</p><div><h1>ゆめの処方箋</h1><small>${stage}</small></div></header>
      <div class="c2-patient-line">PATIENT : BAKU <span>STATUS : <b id="c2Status">${state.complete?'RECOVERED':'SLEEPING'}</b></span></div>
      <nav class="c2-tabs" aria-label="医療システム内の移動">${button('home','診察室')}${button('records','DREAM RECORDS')}${button('lab','MEDICINE LAB',state.q2?'':'disabled')}</nav>
      <p class="c2-save-warning" ${storageAvailable?'hidden':''} role="status">このブラウザでは進行を保存できません。この画面を閉じずに遊んでください。</p>
      ${body}<p id="c2Feedback" class="c2-feedback" role="status" aria-live="polite"></p>`;
  }
  function render() {
    const view=state.view;
    let body='';
    if(view==='home') body=`<section class="c2-home"><h2 tabindex="-1">DREAM MEDICAL SYSTEM</h2><p class="c2-terminal">PATIENT : BAKU<br>STATUS : ${state.complete?'RECOVERED':'SLEEPING'}<br>CAUSE : CORRUPTED DREAM</p><p>最後に食べた4つの夢の中に、壊れた記録がひとつ。<br>夢を調べ、異常を特定して、お薬を調合してください。</p><div class="c2-actions">${button('continue',state.complete?'診療記録を読む':'診断をはじめる / 続きから')}${button('lab','MEDICINE LAB',state.q2?'':'disabled')}</div>${!state.q2?'<small>MEDICINE LABは夢の異常を解析すると使用できます。</small>':''}<details class="c2-replay"><summary>最初から遊び直す</summary><p>第2章の進行だけをリセットします。第1章の記録は残ります。</p>${button('restart','第2章をリセットして開始')}</details></section>`;
    if(view==='records') body=`<section><h2 tabindex="-1">DREAM RECORDS</h2><p class="c2-rule">4つの証言のうち、嘘は1つだけです。<br><b>壊れた夢の証言だけが嘘です。</b> バグ夢を特定してください。</p><div class="c2-dream-grid">${dreams.map(d=>`<article class="c2-dream"><button type="button" data-dream="${d.id}" class="c2-dream-play" aria-label="${d.id.toUpperCase()}：${d.name}の音声を再生" aria-pressed="false"><span class="c2-image"><img data-c2-image="${d.id}" alt="" width="56" height="56"><span class="c2-image-fallback" hidden>${d.emoji}</span></span><b>${d.id.toUpperCase()}：${d.name}</b><span class="c2-play-label">▶ 再生</span></button><details><summary>証言を文字で読む</summary><p>${d.lines.join('<br>')}</p></details></article>`).join('')}</div><p id="c2AudioStatus" class="c2-audio-status" role="status">音声がなくても「証言を文字で読む」から推理できます。</p><div class="c2-answer"><label for="c2DreamChoice">バグ夢はどれですか？</label><select id="c2DreamChoice"><option value="">選択してください</option>${dreams.map(d=>`<option value="${d.id}">${d.id.toUpperCase()}：${d.name}</option>`).join('')}</select>${button('judge-dream','判定する')}</div></section>`;
    if(view==='analysis') body=`<section><h2 tabindex="-1">DREAM LOG : HOSPITAL</h2><p class="c2-success">DREAM ANALYSIS COMPLETE<br>CORRUPTED DREAM DETECTED<br>FILE : D_HOSPITAL</p><details class="c2-manual"><summary>DREAM ERROR MANUAL</summary><p>以下の現象はバグ夢の兆候です。</p><ul><li>時間の逆行</li><li>本来の色からの異常な変化</li><li>無生物による視線の発生</li></ul></details><p>異常だと思うログを3つ選択してください。もう一度押すと解除できます。</p><div class="c2-logs">${logs.map((line,i)=>`<button type="button" data-log="${i+1}" aria-pressed="${state.logs.includes(i+1)}"><span>${String(i+1).padStart(2,'0')}</span>${line}</button>`).join('')}</div><div class="c2-actions"><span id="c2LogCount">${state.logs.length} / 3 選択</span>${button('judge-logs','解析する')}</div></section>`;
    if(view==='lab') body=`<section><h2 tabindex="-1">MEDICINE LAB</h2><div class="c2-success">ERROR TYPE DETECTED : TIME / COLOR / GAZE</div><details class="c2-manual"><summary>解析結果を確認</summary><p>02 : 時計が逆回転 → TIME ERROR<br>05 : 白い花が黒い → COLOR ERROR<br>06 : 花がこちらを見る → GAZE ERROR</p></details><p class="c2-rule">薬は、夢の中で異常が発生した順番に投入してください。</p><div class="c2-workbench"><div class="c2-medicines">${colors.map(c=>`<button type="button" class="c2-medicine" data-medicine="${c}" aria-label="${medicineNames[c]}を選ぶ。${effects[c]}" aria-pressed="false" ${state.mixed?'disabled':''}><span class="c2-bottle ${c}" aria-hidden="true"><i></i><em>✚</em></span><b>${medicineNames[c]}</b><small>${effects[c]}</small></button>`).join('')}</div><button type="button" class="c2-mixing-bottle" id="c2Drop" data-c2="pour" aria-label="選んだ薬を調合瓶へ投入" ${state.mixed?'disabled':''}><span class="c2-mixture" aria-hidden="true"><i id="c2Liquid"></i><em>° · ˚</em></span><b>調合瓶</b><small>ここに投入</small></button></div><p id="c2MixHelp" class="c2-mix-help">薬瓶を中央の瓶へドラッグ。薬を選び、調合瓶をタップしても投入できます。</p><p class="c2-history-label">調合履歴</p><ol id="c2Recipe" class="c2-history" aria-live="polite"></ol><div class="c2-actions">${button('reset-mix','リセット')}${button('mix','調合する',state.mixed?'disabled':'')}</div><div id="c2MedicineReady" class="c2-ready" ${state.mixed?'':'hidden'}><p class="c2-success">MEDICINE COMPLETE<br>PRESCRIPTION SUCCESSFUL</p>${button('give','ばくにお薬をあげる')}</div></section>`;
    if(view==='recovery') body=`<section class="c2-recovery"><h2 tabindex="-1">PATIENT STATUS</h2><div class="c2-treatment"><div class="c2-dose c2-bottle yellow" aria-label="調合した薬"><i></i><em>✚</em></div><div class="c2-patient"><img id="c2Patient" alt="眠っているばくの仮イラスト" width="128" height="112"><span class="c2-patient-fallback" hidden>☾<br>BAKU / SLEEP MODE</span></div><div class="c2-dim" aria-hidden="true"></div></div><div class="c2-monitor" aria-hidden="true"><span>_／＼＿／|＼＿_／＼＿／|＼＿</span></div><p id="c2RecoveryText" class="c2-terminal" role="status" aria-live="polite">BAKU : SLEEPING<br>MEDICINE : ADMINISTERING...</p></section>`;
    if(view==='ending') body=`<section class="c2-ending"><h2 tabindex="-1">RECOVERY COMPLETE</h2><p>「ん……」<br>「あれ、また寝ちゃってた？」<br>「なんか変な夢、食べちゃったみたい。」<br>「助けてくれたの？ありがと！」</p><p>「あのね、夢って、どんなに変でもおいしく食べられるんだよ。」<br>「でも、今回のはちょっと違ったみたい。」</p><p>「……だってさ。」</p><p class="c2-reveal"><b>「あの夢、誰も見てなかったんだって。」</b></p><div class="c2-terminal">DREAM RECORD : D<br><br>OWNER : NOT FOUND<br>SOURCE : UNKNOWN<br>CREATED BY : BAKU OS</div><p class="c2-success">[ CHAPTER 02 COMPLETE ]<br>DREAM PRESCRIPTION SUCCESSFUL</p><div class="c2-actions">${button('desktop','デスクトップに戻る')}${button('home','診察室 / 再プレイ')}</div></section>`;
    app.innerHTML=shell(body);
    if(view==='records') for(const d of dreams){const img=app.querySelector(`[data-c2-image="${d.id}"]`);img.onerror=()=>{img.hidden=true;img.nextElementSibling.hidden=false;};img.src=imagePath(d);}
    if(view==='lab') updateLab();
    if(view==='recovery') {const img=document.getElementById('c2Patient');img.onerror=()=>{img.hidden=true;img.nextElementSibling.hidden=false;};img.src=assets.patient || 'assets/chapter2/baku_sleep.svg';}
  }
  function updateLab() {
    const recipe=document.getElementById('c2Recipe'); if(!recipe)return;
    recipe.replaceChildren();
    for(let i=0;i<3;i++){const li=document.createElement('li');const c=state.recipe[i];li.textContent=c?`${i+1}. ${colorNames[c]}`:`${i+1}. ？`;if(c)li.className=c;recipe.append(li);}
    const liquid=document.getElementById('c2Liquid');
    const mix={blue:[75,116,190],red:[196,92,107],yellow:[218,191,86],white:[223,229,230]};
    const count=state.recipe.length;
    const sums=state.recipe.reduce((a,c)=>a.map((n,i)=>n+mix[c][i]),[0,0,0]);
    liquid.style.height=`${count*25}%`;liquid.style.backgroundColor=count?`rgb(${sums.map(n=>Math.round(n/count)).join(',')})`:'transparent';
    app.querySelectorAll('[data-medicine]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.medicine===chosen)));
    document.getElementById('c2MixHelp').textContent=chosen?`${medicineNames[chosen]}を選択中。調合瓶をタップするか、ドラッグして投入してください。`:'薬瓶を中央の瓶へドラッグ。薬を選び、調合瓶をタップしても投入できます。';
  }
  function pour(color) {
    if(!color || state.mixed || state.recipe.length>=3){feedback(state.recipe.length>=3?'瓶はいっぱいです。調合するか、リセットしてください。':'先に薬を選んでください。');return;}
    state.recipe.push(color);chosen=null;save();updateLab();
    const bottle=document.getElementById('c2Drop');bottle.classList.remove('c2-bubble');void bottle.offsetWidth;bottle.classList.add('c2-bubble');
    feedback(`${medicineNames[color]}を投入しました。${state.recipe.length} / 3`);
  }
  function playDream(id) {
    stopAudio();const d=dreams.find(x=>x.id===id);if(!d)return;
    const status=document.getElementById('c2AudioStatus');
    app.querySelector(`[data-dream="${id}"]`).closest('article').querySelector('details').open=true;
    audio=new Audio();const current=audio,request=audioRequest;
    const reset=()=>{if(request!==audioRequest)return;app.querySelector(`[data-dream="${id}"]`)?.classList.remove('c2-playing');app.querySelector(`[data-dream="${id}"]`)?.setAttribute('aria-pressed','false');};
    const fallback=()=>{if(request!==audioRequest)return;reset();status.textContent=`${id.toUpperCase()}：${d.name} — 音声を再生できません。表示された証言を文字で確認してください。`;};
    current.onplaying=()=>{if(request!==audioRequest)return;const b=app.querySelector(`[data-dream="${id}"]`);b.classList.add('c2-playing');b.setAttribute('aria-pressed','true');status.textContent=`${id.toUpperCase()}：${d.name} 再生中…`;};
    current.onended=()=>{if(request!==audioRequest)return;reset();status.textContent=`${id.toUpperCase()}：${d.name} 再生完了`;};
    current.onerror=fallback;status.textContent=`${id.toUpperCase()}：${d.name} 読み込み中…`;current.src=audioPath(d);current.play().catch(fallback);
  }
  function startRecovery() {
    if(!state.mixed || recoveryRunning)return;
    nav('recovery');recoveryRunning=true;
    const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    later(()=>{document.getElementById('c2Status').textContent='RECOVERING';document.getElementById('c2RecoveryText').innerHTML='BAKU : RECOVERING...<br>DREAM SIGNAL : STABLE';app.querySelector('.c2-monitor').classList.add('c2-monitor-running');},reduced?60:1500);
    later(()=>{document.getElementById('c2RecoveryText').innerHTML='BAKU : RECOVERING...<br>DREAM SIGNAL : STABLE<br>RECOVERY COMPLETE';},reduced?120:3000);
    later(()=>{state.complete=true;nav('ending');},reduced?250:4400);
  }
  app.addEventListener('click',e=>{
    const dream=e.target.closest('[data-dream]');if(dream){playDream(dream.dataset.dream);return;}
    const log=e.target.closest('[data-log]');
    if(log){const n=Number(log.dataset.log);if(state.logs.includes(n))state.logs=state.logs.filter(x=>x!==n);else if(state.logs.length<3)state.logs.push(n);else {feedback('選べるログは3つまでです。選択済みのログを解除してください。');return;}save();log.setAttribute('aria-pressed',String(state.logs.includes(n)));document.getElementById('c2LogCount').textContent=`${state.logs.length} / 3 選択`;feedback('');return;}
    const medicine=e.target.closest('[data-medicine]');
    if(medicine){if(suppressClick){suppressClick=false;return;}chosen=medicine.dataset.medicine;updateLab();return;}
    const action=e.target.closest('[data-c2]')?.dataset.c2;
    if(['home','records','lab'].includes(action)){nav(action);return;}
    if(action==='continue')nav(state.complete?'ending':state.q2?'lab':state.q1?'analysis':'records');
    if(action==='judge-dream') {
      const answer=document.getElementById('c2DreamChoice').value;
      if(!answer){feedback('夢を選択してください。');return;}
      if(answer!=='d'){feedback('ANALYSIS FAILED — 証言を照らし合わせて、もう一度試してください。');return;}
      state.q1=true;nav('analysis');
    }
    if(action==='judge-logs'){
      if(state.logs.length!==3){feedback('異常だと思うログを3つ選んでください。');return;}
      if(state.logs.slice().sort((a,b)=>a-b).join(',')!=='2,5,6'){feedback('ANALYSIS FAILED — 説明書とログをもう一度確認してください。');return;}
      state.q2=true;nav('lab');
    }
    if(action==='pour')pour(chosen);
    if(action==='reset-mix'){state.recipe=[];state.mixed=false;state.complete=false;chosen=null;save();render();feedback('調合瓶を空にしました。');}
    if(action==='mix'){
      if(state.recipe.length!==3){feedback('薬を3つ投入してください。');return;}
      if(state.recipe.join(',')!=='blue,red,yellow'){feedback('MIXING FAILED — リセットして、異常が起きた順番に試してください。');return;}
      state.mixed=true;save();render();feedback('MEDICINE COMPLETE / PRESCRIPTION SUCCESSFUL');document.querySelector('[data-c2="give"]').focus();
    }
    if(action==='give')startRecovery();
    if(action==='desktop')closeWindow(medical);
    if(action==='restart'){stopAudio();clearTimers();cancelDrag();state=fresh();state.started=true;nav('records');}
  });
  // Pointer capture supports mouse, touch and pen; tapping is also fully keyboard accessible.
  app.addEventListener('pointerdown',e=>{
    const source=e.target.closest('[data-medicine]');if(!source||source.disabled||e.button!==0||drag)return;
    drag={id:e.pointerId,color:source.dataset.medicine,x:e.clientX,y:e.clientY,source,moved:false};
    source.setPointerCapture(e.pointerId);
  });
  app.addEventListener('pointermove',e=>{
    if(!drag||drag.id!==e.pointerId)return;
    if(!drag.moved && Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>7){drag.moved=true;const ghost=drag.source.querySelector('.c2-bottle').cloneNode(true);ghost.classList.add('c2-drag-ghost');ghost.setAttribute('aria-hidden','true');document.body.append(ghost);}
    if(!drag.moved)return;
    const ghost=document.querySelector('.c2-drag-ghost');ghost.style.left=`${e.clientX}px`;ghost.style.top=`${e.clientY}px`;
    const target=document.getElementById('c2Drop'),r=target.getBoundingClientRect();target.classList.toggle('c2-drop-ready',e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom);
  });
  app.addEventListener('pointerup',e=>{
    if(!drag||drag.id!==e.pointerId)return;
    const {color,moved}=drag;const target=document.getElementById('c2Drop'),r=target.getBoundingClientRect();
    const inside=e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom;
    if(moved){suppressClick=true;later(()=>{suppressClick=false;},0);if(inside)pour(color);}
    cancelDrag();
  });
  app.addEventListener('pointercancel',cancelDrag);
  app.addEventListener('lostpointercapture',()=>{if(drag)cancelDrag();});
  medical.addEventListener('pointerdown',()=>focusWindow(medical));
  medical.addEventListener('keydown',e=>{if(e.key==='Escape'){if(drag)cancelDrag();else closeWindow(medical);}});
  new MutationObserver(()=>{if(medical.hidden){stopAudio();cancelDrag();if(recoveryRunning){clearTimers();state.view='lab';save();render();}}}).observe(medical,{attributes:true,attributeFilter:['hidden']});
  const storyMail={id:MAIL_ID,date:'DATE UNKNOWN',subject:'ばくの様子がおかしい',body:'ばくが、また眠ってしまいました。\n\nどうやら、壊れた夢を食べてしまったようです。\n\n最後に食べた4つの夢のうち、1つだけが正常ではありません。\n\nバグ夢を見つけて、正しいお薬を与えてください。\n\nただし、バグ夢の記録は一部が書き換えられている可能性があります。\n\n記録をすべて信用しないでください。'};
  if(!content.mails.some(m=>m.id===MAIL_ID))content.mails.push(storyMail);
  titles.medical='DREAM MEDICAL SYSTEM';
  document.addEventListener('baku:mail-rendered',e=>{
    if(e.detail?.id!==MAIL_ID)return;
    const launch=document.createElement('button');launch.type='button';launch.className='c2-mail-launch';launch.textContent='DREAM MEDICAL SYSTEM を起動';
    launch.onclick=()=>{state.started=true;save();render();minimizeWindow(win('mail'));openWindow('medical');focusHeading();};
    document.getElementById('mailBody').append(launch);
  });
  render();
})();
