const X_QR="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQgAAAEIAQAAAACLjVdSAAABl0lEQVR4nO2ZS47DMAxDH4vc/8qcBWUn001XVYWm/QCGwwUh0BStyLz4PF4BfogvRhygrCwrYpHlvTuGaVs9MIAwVY48qd0xTBsRkgAEEgJZ5+4opp0IAVjgEseHeIxBGFk8N5yJTN+HOGCrQbgOiy4amcK0B4GXHvz0XY+nMG3Txz4gsQ7SdvfuFKZ9+rCjh31Gljzs2+lDXo0FZJLI9ub98tgD4iEreEjIaOlmGNM2hK3VbtNeVCUax7QBcVaBmEbSe/xkFNO3I0oVVA0qg9zaPyIDVSUMLv9IuxnEtAFxXG62cVJXZl9NZgrTPoTJxdaUh+bcwE39A6qvXG9zoranMG3Lp2UZ+VF+kuZyv3yaPMY1qaezyBmGzGLagVCil6hDQlxkBZJBTBsQ8mUZZbimQsp/CtPGfguchyY5pC4xbTymIP7N19dwDMpVb+kfa5JeM/YVV1UhdRTTtyOOcxlprJdS69XUGKbt9Sj3yFLbXqcwbazHnq/vmqxO08ZjCuJga0LptJXfc8m7nX9c8sdHefwQMxF/i8O68Pl74gsAAAAASUVORK5CYII=";
const TIKTOK_QR="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUgAAAFIAQAAAAAab1qeAAACcUlEQVR4nO1a0W4kIQyzT/3/X3Yf7AB9ObFSt0xWIHU1HSwNiRLiGChsjn+7wIu8yF9DfgH0kwBQIJaIJTRmu1h03J92YPwGTS+K0JztYtF5f4LlRhGABIiAIFA128aiB/hzDCoZT3FE7Bu//nnIH/4kWNlNUcDq0y4WPcCfowLJHhXo3ZPLbBeLzvtzlKKq5VT9cc52segskpMdVVXKUFL+nV//POQXwKS1CHMleff065HyXSw6izQ7KpqpPAmCMF4CkrpY9IB8p6m7WyP/U8Qz8Xr7o32kuyDRtYfm8eFORP2cX2cLZKW44MSuNF/e5KmLRceRVBF5SqCkuZkyW6kesM4uSKE6IdF5H85EEiL8e36dXZAMXRIXjanEJVbBP7/OLkjnuAUlMt2mo1RV+G98bg6WJpd2iGIpy94CwMx0seh4fySaIQFDDIla5wYeAnj55zaSILioc6wGSQ5WXv75Wr4nwSsYudT7iHbXn7uj9sl0mDNKNVuju3++2m+WKyPRu2eKuEzLTufX2QLp+s4pJju/k+MJVdz4fAFZJ3CApHTtpqJcz5KPr7MFssTjcE/NgyPH6JTou1h0XF/ydlkisvIUbWloTFdf2ho5L84hR7jnEELdG+nWo9eQRE4y5d4duRxCc/3HrLMBcj3fTFVn7ZxLb3/POzbHcr8uXXyE0HL0OOjsYtHx+Mwdm3HBZjoSIz4v/9wcy/061M459HmMaH3T1z8Pud4HKzmkSLwii7r8d7HoOf4c2tyg9fJ5HHh8nV2Qy/26CMmgUoKGVK/LP3fHcr+O1SVRSPuuutBwfJ1dkD+u0P351y/yIv8/vgFU7lNpE8ZbKgAAAABJRU5ErkJggg==";
const windows=[...document.querySelectorAll('[data-window]')], tasks=document.getElementById('tasks'), startMenu=document.getElementById('startMenu');
const titles={schedule:'SCHEDULE.exe',contents:'STREAM_CONTENTS',mail:'MAIL.exe',profile:'ABOUT.html',diary:'dream_diary.txt',player:'Media Player',trash:'ごみ箱',note:'メモ帳',secret:'???',error:'BAKU OS',social:'SNS Shortcut'};let topZ=30;
const win=n=>document.querySelector(`[data-window="${n}"]`);
function focusWindow(el){windows.forEach(w=>w.classList.remove('active'));el.classList.add('active');el.style.zIndex=++topZ;renderTasks()}
function openWindow(name){const el=win(name);if(!el)return;el.hidden=false;delete el.dataset.minimized;focusWindow(el);startMenu.hidden=true;if(name==='mail'){markMailRead();renderMail()}}
function closeWindow(el){el.hidden=true;el.classList.remove('active');renderTasks()}
function minimizeWindow(el){el.hidden=true;el.dataset.minimized='1';renderTasks()}
function renderTasks(){tasks.innerHTML='';windows.filter(w=>!['error'].includes(w.dataset.window)&&(!w.hidden||w.dataset.minimized)).forEach(w=>{const b=document.createElement('button');b.className='task'+(w.classList.contains('active')&&!w.hidden?' active':'');b.textContent=titles[w.dataset.window]||w.dataset.window;b.onclick=()=>{w.hidden=false;delete w.dataset.minimized;focusWindow(w)};tasks.appendChild(b)})}
document.addEventListener('click',e=>{const o=e.target.closest('[data-open]');if(o)openWindow(o.dataset.open);const c=e.target.closest('[data-close]');if(c)closeWindow(c.closest('.window'));const m=e.target.closest('[data-minimize]');if(m)minimizeWindow(m.closest('.window'));if(e.target.closest('[data-error]'))openWindow('error');const n=e.target.closest('[data-note]');if(n){const [t,...body]=n.dataset.note.split('|');document.getElementById('noteTitle').textContent='▤ '+t+' - メモ帳';document.getElementById('noteBody').textContent=body.join('|');openWindow('note')}});
document.getElementById('startButton').onclick=()=>startMenu.hidden=!startMenu.hidden;
windows.forEach(w=>{w.addEventListener('mousedown',()=>focusWindow(w));const bar=w.querySelector('.titlebar');if(!bar)return;let drag=false,sx=0,sy=0,sl=0,st=0;bar.addEventListener('pointerdown',e=>{if(e.target.closest('button')||innerWidth<801)return;drag=true;sx=e.clientX;sy=e.clientY;sl=w.offsetLeft;st=w.offsetTop;bar.setPointerCapture(e.pointerId)});bar.addEventListener('pointermove',e=>{if(!drag)return;w.style.left=Math.max(0,Math.min(innerWidth-w.offsetWidth,sl+e.clientX-sx))+'px';w.style.top=Math.max(0,Math.min(innerHeight-95,st+e.clientY-sy))+'px'});bar.addEventListener('pointerup',()=>drag=false)});
const streamDetails={
 morning:{category:'定期配信',title:'朝からばくばく',description:'朝のニュースや「今日は何の日」、12星座占いを一緒に楽しむ朝配信。朝の支度中や通勤中にもどうぞ。',photo:'assets/stream-morning.jpg'},
 game:{category:'通常配信',title:'ゲーム配信',description:'ホラーやインディーゲーム、ちょっと変わったゲームを中心に。コメントしながら一緒に遊ぼう。',photo:'assets/stream-game.jpg'},
 sing:{category:'通常配信',title:'歌配信',description:'好きな曲を歌ったり、音楽の話をしたり。気軽に聴きに来てね。',photo:'assets/stream-sing.jpg'},
 talk:{category:'通常配信',title:'雑談',description:'今日あったことからどうでもいい話まで。コメントから話がどんどん脱線する、ゆるいおしゃべり。',photo:'assets/stream-talk.jpg'},
 sleep:{category:'通常配信',title:'睡眠導入配信',description:'眠る前の朗読や寝かしつけ。眠れない夜は、ばくに悪い夢を預けてね。',photo:'assets/stream-sleep.jpg'},
 darts:{category:'企画配信',title:'ダーツ配信',description:'ダーツとコメントがつながる参加型企画。みんなの応援でHPが増える、ばくとのレイドバトル！',photo:'assets/stream-darts.jpg'},
 zodiac:{category:'企画配信',title:'星座集め配信',description:'コメントで自分の星座を教えてね。12星座を集めてビンゴを目指す参加型配信。',photo:'assets/stream-zodiac.jpg'}
};
function showDetail(k){const d=streamDetails[k];if(!d)return;document.getElementById('streamDetailCategory').textContent=d.category;document.getElementById('streamDetailTitle').textContent=d.title;document.getElementById('streamDetailText').textContent=d.description;const photo=document.getElementById('streamPhoto');photo.replaceChildren();const img=new Image();img.alt=d.title+'の写真';img.onload=()=>{photo.replaceChildren(img)};img.onerror=()=>{photo.textContent='PHOTO / '+d.title+'\n画像は準備中';photo.classList.add('photo-empty')};photo.classList.remove('photo-empty');photo.appendChild(img);document.querySelectorAll('[data-detail]').forEach(b=>b.classList.toggle('selected',b.dataset.detail===k))}
document.querySelectorAll('[data-detail]').forEach(b=>b.addEventListener('click',()=>showDetail(b.dataset.detail)));
const audio=document.getElementById('bakuAudio'),tracks=[{name:'あさからばくばくOP.mp3',src:'assets/あさからばくばくOP.mp3'},{name:'朝占いの風.mp3',src:'assets/朝占いの風.mp3'}];
document.querySelectorAll('[data-track]').forEach(b=>b.addEventListener('click',()=>{const track=tracks[Number(b.dataset.track)];audio.pause();audio.src=track.src;audio.load();document.getElementById('nowPlaying').textContent=track.name;document.getElementById('audioHint').textContent='▶ で再生。音源がまだなければ assets に追加してね。';document.querySelectorAll('[data-track]').forEach(x=>x.classList.toggle('active',x===b))}));
audio.addEventListener('error',()=>{document.getElementById('audioHint').textContent='音源が見つかりません。assets フォルダに同じ名前のMP3を入れてね。'});
const content=structuredClone(window.BAKU_CONTENT||{mails:[],diary:[]});content.mails ||= [];content.diary ||= [];
const chapterMail={id:'chapter1_hello',date:'DATE UNKNOWN',subject:'まだ起きてる？',body:'こんばんは。\n\nばくが眠っちゃったみたい。\nいつもはみんなの悪い夢を食べてるんだけど、今日はちょっと食べすぎたんだって。\n\nだから、お願い。\nばくが起きるまで、このパソコンを閉じないで。\n\n……あと、もし知らないフォルダを見つけても、開かないでね。'};
if(!content.mails.some(m=>m.id===chapterMail.id))content.mails.unshift(chapterMail);content.nextStream ||= {};content.links ||= {};
function renderMail(selected=0){const list=document.getElementById('mailList');list.replaceChildren();content.mails.forEach((m,i)=>{const b=document.createElement('button');b.className='mail-item'+(i===selected?' active':'');const strong=document.createElement('b'),small=document.createElement('small');strong.textContent=m.subject;small.textContent=m.date;b.append(strong,small);b.onclick=()=>renderMail(i);list.appendChild(b)});const body=document.getElementById('mailBody');body.replaceChildren();const m=content.mails[selected];if(m){const small=document.createElement('small'),h=document.createElement('h1'),p=document.createElement('p');small.textContent='From: ばく / '+m.date;h.textContent=m.subject;p.textContent=m.body;p.style.whiteSpace='pre-wrap';body.append(small,h,p)}}
function renderDiary(){const el=document.getElementById('diaryBody');el.replaceChildren();content.diary.forEach(d=>{const h=document.createElement('h2'),p=document.createElement('p');h.textContent=d.date;p.textContent=d.body;p.style.whiteSpace='pre-wrap';el.append(h,p)})}
renderMail();renderDiary();
let latest=content.mails[0];function markMailRead(){if(latest)localStorage.setItem('bakuLastMail',latest.id);document.getElementById('unreadBadge').hidden=true;document.getElementById('mailToast').hidden=true}
function mailStatus(){if(latest&&localStorage.getItem('bakuLastMail')!==latest.id)document.getElementById('unreadBadge').hidden=false}mailStatus();
// 30秒後の新着通知。音声ファイルを追加したら下のコメントを外して利用できます。
setTimeout(()=>{if(latest&&localStorage.getItem('bakuLastMail')!==latest.id){document.getElementById('toastSubject').textContent=latest.subject;document.getElementById('mailToast').hidden=false;/* new Audio('mail.mp3').play().catch(()=>{}); */}},30000);
function clock(){const d=new Date();document.getElementById('clock').textContent=d.toLocaleTimeString('ja-JP',{hour:'2-digit',minute:'2-digit'});if(d.getHours()===3&&d.getMinutes()===33&&!sessionStorage.getItem('333')){sessionStorage.setItem('333','1');document.getElementById('noteTitle').textContent='SYSTEM';document.getElementById('noteBody').textContent='夢との接続が安定しました。';openWindow('note')}}clock();setInterval(clock,30000);
let visits=Number(localStorage.getItem('bakuVisits')||0)+1;localStorage.setItem('bakuVisits',visits);document.getElementById('secretIcon').hidden=false;
let idle;const saver=document.getElementById('screensaver'),sm=document.getElementById('screenMessage');function resetIdle(){clearTimeout(idle);if(!saver.hidden){saver.hidden=true;sessionStorage.setItem('returned','1')}idle=setTimeout(()=>{sm.innerHTML='☾<br><br>good night.';saver.hidden=false;setTimeout(()=>{if(!saver.hidden)sm.innerHTML='☾<br><br>good night.<br><br><small>まだいる？</small>'},20000)},60000)}['mousemove','keydown','pointerdown','touchstart'].forEach(x=>addEventListener(x,resetIdle,{passive:true}));resetIdle();
document.getElementById('logout').onclick=()=>{document.getElementById('shutdownScreen').hidden=false;startMenu.hidden=true};document.getElementById('wakeButton').onclick=()=>document.getElementById('shutdownScreen').hidden=true;
setTimeout(()=>document.getElementById('boot').classList.add('hide'),1600);renderTasks();

// Public website: read-only content rendering. EDIT.exe is not shipped on GitHub Pages.
const $=id=>document.getElementById(id);
function textNode(tag,text){const el=document.createElement(tag);el.textContent=text||'';return el}
function renderStream(){const s=content.nextStream; $('nextTime').textContent=s.time||'--:--';$('nextTitle').textContent=s.title||'次回未定';$('nextDesc').textContent=s.description||'';$('nextDate').textContent=s.date||'';const list=$('scheduleList');list.replaceChildren();const a=document.createElement('article');const t=textNode('time',s.date||'未定');const tm=textNode('strong',s.time||'--:--');const div=document.createElement('div');div.append(textNode('h2',s.title||'次回未定'),textNode('p',s.description));a.append(t,tm,div);list.append(a)}
function renderLinks(){}
renderStream();renderLinks();


// v5 calendar: nextStream is always supported; optional schedule entries can be added later.
const calendarGrid=document.getElementById('calendarGrid');
const calendarMonth=document.getElementById('calendarMonth');
let calendarCursor=new Date();calendarCursor.setDate(1);
let calendarSelected=new Date();
function localDateKey(d){return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')}
function allStreams(){const list=Array.isArray(content.schedule)?content.schedule.slice():[];const next=content.nextStream;if(next?.date&&next?.title&&!list.some(x=>x.date===next.date&&x.time===next.time&&x.title===next.title))list.push(next);return list.filter(x=>/^\d{4}-\d{2}-\d{2}$/.test(x.date||'')).sort((a,b)=>(a.date+' '+(a.time||'')).localeCompare(b.date+' '+(b.time||'')))}
function selectCalendarDay(key){const [y,m,d]=key.split('-').map(Number);calendarSelected=new Date(y,m-1,d);renderCalendar()}
function renderCalendar(){
 const y=calendarCursor.getFullYear(),m=calendarCursor.getMonth(),today=localDateKey(new Date()),selected=localDateKey(calendarSelected),streams=allStreams();
 calendarMonth.textContent=`${y}年 ${m+1}月`;calendarGrid.replaceChildren();
 const first=new Date(y,m,1),offset=first.getDay(),count=new Date(y,m+1,0).getDate(),cells=Math.ceil((offset+count)/7)*7;
 for(let i=0;i<cells;i++){
  const d=new Date(y,m,1-offset+i),key=localDateKey(d),dayStreams=streams.filter(s=>s.date===key),b=document.createElement('button');
  b.className='calendar-day'+(d.getMonth()!==m?' outside':'')+(key===today?' today':'')+(key===selected?' selected':'')+(dayStreams.length?' has-stream':'');
  const num=document.createElement('span');num.className='calendar-day-number';num.textContent=d.getDate();b.appendChild(num);
  dayStreams.slice(0,2).forEach(s=>{const ev=document.createElement('span');ev.className='calendar-event';const tm=document.createElement('b');tm.textContent=s.time||'未定';const title=document.createElement('span');title.textContent=s.title||'配信';ev.append(tm,title);b.appendChild(ev)});
  if(dayStreams.length>2){const more=document.createElement('span');more.className='calendar-event';more.textContent=`ほか${dayStreams.length-2}件`;b.appendChild(more)}
  b.setAttribute('aria-label',key+(dayStreams.length?' 配信あり':''));b.onclick=()=>{if(d.getMonth()!==calendarCursor.getMonth())calendarCursor=new Date(d.getFullYear(),d.getMonth(),1);selectCalendarDay(key)};calendarGrid.appendChild(b)
 }
 document.getElementById('selectedDayHeading').textContent=`${calendarSelected.getMonth()+1}月${calendarSelected.getDate()}日 の配信`;
 const list=document.getElementById('scheduleList');list.replaceChildren();const entries=streams.filter(s=>s.date===selected);
 if(!entries.length){const p=document.createElement('p');p.className='schedule-empty';p.textContent='この日の予定はまだありません。';list.appendChild(p)}
 entries.forEach(s=>{const a=document.createElement('article'),t=document.createElement('time'),div=document.createElement('div'),h=document.createElement('h2'),p=document.createElement('p');t.textContent=s.time||'未定';h.textContent=s.title||'配信';p.textContent=s.description||'';div.append(h,p);a.append(t,div);list.appendChild(a)})
}
document.getElementById('prevMonth').onclick=()=>{calendarCursor.setMonth(calendarCursor.getMonth()-1);renderCalendar()};document.getElementById('nextMonth').onclick=()=>{calendarCursor.setMonth(calendarCursor.getMonth()+1);renderCalendar()};document.getElementById('todayMonth').onclick=()=>{calendarCursor=new Date();calendarCursor.setDate(1);calendarSelected=new Date();renderCalendar()};
const previousOpenWindow=openWindow;openWindow=function(name){if(name==='schedule'){const s=content.nextStream;const parts=(s?.date||'').split('-').map(Number);if(parts.length===3&&parts.every(Number.isFinite)){calendarCursor=new Date(parts[0],parts[1]-1,1);calendarSelected=new Date(parts[0],parts[1]-1,parts[2])}renderCalendar()}previousOpenWindow(name)};
document.querySelector('.schedule-gadget').addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openWindow('schedule')}});
renderCalendar();

// v7: SNS desktop shortcuts open a QR window first. The external site opens only from the button inside it.
const socialProfiles={
  tiktok:{name:'TikTok',handle:'@mitemite_siroiinu',url:'https://www.tiktok.com/@mitemite_siroiinu?_r=1&_t=ZS-9A6LfCwRZhs',qr:TIKTOK_QR},
  x:{name:'X',handle:'@mitemite_baku',url:'https://x.com/mitemite_baku?s=11',qr:X_QR}
};
function showSocialShortcut(key){const s=socialProfiles[key];if(!s)return;document.getElementById('socialWindowTitle').textContent='🌐 '+s.name+' Shortcut';document.getElementById('socialName').textContent=s.name;document.getElementById('socialHandle').textContent=s.handle;document.getElementById('socialQr').src=s.qr;document.getElementById('socialQr').alt=s.name+' QRコード';const a=document.getElementById('socialOpenLink');a.href=s.url;a.textContent=s.name+'を開く ↗';openWindow('social')}
document.querySelectorAll('.social-launch').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();showSocialShortcut(a.dataset.social)}));

// Chapter 1 v14: a longer detour through mail -> ??? -> recycle bin -> recovery -> password.
const mysteryReader=document.getElementById('mysteryReader'),passwordForm=document.getElementById('mysteryPasswordForm');
function mysteryText(title,body){mysteryReader.replaceChildren();const small=document.createElement('small'),h=document.createElement('h2'),p=document.createElement('p');small.textContent='メモ帳 / READ ONLY';h.textContent=title;p.textContent=body;mysteryReader.append(small,h,p)}
function chapterEnding(){return 'あれれ、起こしてくれてありがとう。\n\nこんなところまで迷い込んじゃったの❓\n深すぎる場所に潜るのはキケンだよ。\n\nでも、ダイブしちゃうそんなキミがスキ ﾀﾞﾖ ;P\n\n[ CHAPTER 1 COMPLETE ]'}
function showMysteryFile(file){passwordForm.hidden=true;const status=document.getElementById('mysteryPasswordStatus');status.textContent='';
 if(file==='intro')mysteryText('はじめに.txt','もしここを見つけたら、最初にメールを読んで。\n\n消した夢は、ごみ箱で眠ってる。\n眠ってるものを起こすとき、朝いちばんになんて言う？\n\n……でも、まだ数字を探さないで。順番があるから。');
 if(file==='yesterday')mysteryText('きのうの夢.txt','きのうも、同じ時間に目が覚めた。\n\n時計は三時を少し過ぎたところで止まっていた。\nごみ箱から、画像をひとつ消した。\n\n名前はたしか dream20090813。\n日付がひとつだけ、合っていなかった気がする。');
 if(file==='locked'){mysteryText('ひらかないで.txt','このファイルは保護されています。\n\n数字4桁のパスワードが必要です。\n削除された夢を正しく復元すると、どこかに残るらしい。');passwordForm.hidden=false;document.getElementById('mysteryPassword').value='';document.getElementById('mysteryPasswordStatus').textContent=localStorage.getItem('bakuChapter1Solved')==='yes'?'以前に解除済みです。もう一度入力すると内容を表示します。':'';document.getElementById('mysteryPassword').focus()}}
document.querySelectorAll('[data-mystery-file]').forEach(b=>b.addEventListener('click',()=>showMysteryFile(b.dataset.mysteryFile)));
passwordForm.addEventListener('submit',e=>{e.preventDefault();const val=document.getElementById('mysteryPassword').value.trim();if(val==='0818'){localStorage.setItem('bakuChapter1Solved','yes');passwordForm.hidden=true;mysteryText('ひらかないで.txt',chapterEnding())}else{document.getElementById('mysteryPasswordStatus').textContent='ACCESS DENIED / パスワードが違います。'}});
function openDeletedDream(){
 const title=document.getElementById('noteTitle'),body=document.getElementById('noteBody');title.textContent='▤ dream20090813.jpg - RECOVERY';body.replaceChildren();
 const p=document.createElement('p');p.textContent='画像を開けませんでした。\n\nSTATUS : DELETED / FRAGMENTED\nRECOVERY HINT : 「眠ってるものを、朝に起こす言葉」';body.appendChild(p);
 if(localStorage.getItem('bakuDreamRecovered')==='yes'){const done=document.createElement('p');done.className='restore-result';done.textContent='RECOVERED.\n\n撮影日：2009 / 08 / 18\nファイル名：dream20090813.jpg\n\nWARNING : ファイル名の日付と撮影日が一致しません。\nPASSWORD CANDIDATE : 0818';body.appendChild(done);openWindow('note');return}
 const box=document.createElement('div');box.className='restore-box';box.innerHTML='<b>削除ファイルの復元</b><p>復元キーを入力してください。</p><input id="restoreKey" autocomplete="off" placeholder="ひらがな"><button id="restoreBtn" type="button">復元</button><p id="restoreStatus" class="restore-result"></p>';body.appendChild(box);openWindow('note');
 document.getElementById('restoreBtn').onclick=()=>{const key=document.getElementById('restoreKey').value.trim();const st=document.getElementById('restoreStatus');if(key==='おはよう'){localStorage.setItem('bakuDreamRecovered','yes');st.textContent='RESTORE COMPLETE.\n\n撮影日：2009 / 08 / 18\nファイル名：dream20090813.jpg\n\n……日付が違う。\nPASSWORD CANDIDATE : 0818';}else st.textContent='RESTORE FAILED. 起こす言葉が違います。'};
}
document.getElementById('dreamFile').addEventListener('click',openDeletedDream);

// Local visit indicator. This is intentionally honest: GitHub Pages alone cannot know the global visitor number.
const vc=document.getElementById('visitCounter');if(vc)vc.textContent=`THIS DEVICE : VISIT #${visits}`;
// v19: localized DOM glitch. Real visible elements are temporarily shifted,
// clipped and snapped sideways. No screenshot/image overlay is used.
function fireLocalDomGlitch(){
  const desktop=document.getElementById('desktop');
  if(!desktop) return;
  const candidates=[...desktop.querySelectorAll('.desktop-icon,.gadget,.window:not([hidden]),.taskbar,.desktop-widget,.social-gadget')]
    .filter(el=>{const r=el.getBoundingClientRect();return r.width>20&&r.height>12&&r.bottom>0&&r.top<innerHeight;});
  if(!candidates.length) return;
  const centerY=innerHeight*(.12+Math.random()*.70);
  const bandH=18+Math.random()*65;
  const affected=candidates.filter(el=>{const r=el.getBoundingClientRect();return r.bottom>centerY-bandH&&r.top<centerY+bandH;});
  const pool=affected.length?affected:candidates.sort(()=>Math.random()-.5).slice(0,1+Math.floor(Math.random()*2));
  const chosen=pool.sort(()=>Math.random()-.5).slice(0,Math.min(pool.length,1+Math.floor(Math.random()*3)));
  const old=chosen.map(el=>[el,el.style.transform,el.style.filter,el.style.clipPath,el.style.transition,el.style.willChange]);
  chosen.forEach(el=>{el.style.willChange='transform,filter,clip-path';el.style.transition='none';});
  const frames=14; let n=0;
  const tick=()=>{
    if(n>=frames){old.forEach(([el,t,f,c,tr,w])=>{el.style.transform=t;el.style.filter=f;el.style.clipPath=c;el.style.transition=tr;el.style.willChange=w;});return;}
    chosen.forEach((el,i)=>{
      const r=el.getBoundingClientRect();
      const localTop=Math.max(0,Math.min(88,((centerY-bandH-r.top)/Math.max(1,r.height))*100));
      const localBottom=Math.max(localTop+5,Math.min(100,((centerY+bandH-r.top)/Math.max(1,r.height))*100));
      const x=(Math.random()<.5?-1:1)*(5+Math.random()*38)*(n%3===0?1.45:1);
      el.style.clipPath=`inset(${localTop}% 0 ${Math.max(0,100-localBottom)}% 0)`;
      el.style.transform=`translate3d(${x}px,${(Math.random()-.5)*2}px,0)`;
      el.style.filter=n%4===0?'contrast(1.16) saturate(.82)':'none';
    });
    n++; setTimeout(tick,70+Math.random()*55);
  };
  tick();
}
function scheduleLocalDomGlitch(){
  setTimeout(()=>{fireLocalDomGlitch();scheduleLocalDomGlitch();},10000+Math.random()*10000);
}
scheduleLocalDomGlitch();
