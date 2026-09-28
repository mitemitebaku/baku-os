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
const details={game:['GAME / ゲーム','ホラー、インディー、謎ゲー、参加型など。上手さより「なんだこれ！」をみんなで楽しむ配信。初見さんもコメントから気軽にどうぞ。'],talk:['TALK / 雑談','朝のニュース雑談から深夜のゆるい話まで。コメントを拾いながら、予定外の方向へよく脱線します。'],sing:['SING / 歌','歌枠、リクエスト、弾き語りや音楽制作の話など。'],sleep:['READING / SLEEP','朗読、寝かしつけ、睡眠導入。眠る前に流しておける夜の終点みたいな配信です。'],event:['EVENT / 参加型','コメント、ゲーム、企画を使って視聴者も画面の中へ。']};
function showDetail(k){const d=details[k];document.getElementById('detail').innerHTML=`<small>OPENED FILE</small><h2>${d[0]}</h2><p>${d[1]}</p>`}
document.querySelectorAll('[data-detail]').forEach(b=>b.onclick=()=>showDetail(b.dataset.detail));document.querySelectorAll('[data-detail-open]').forEach(b=>b.onclick=()=>{openWindow('contents');showDetail(b.dataset.detailOpen)});
const content=structuredClone(window.BAKU_CONTENT||{mails:[],diary:[]});content.mails ||= [];content.diary ||= [];content.nextStream ||= {};content.links ||= {};
function renderMail(selected=0){const list=document.getElementById('mailList');list.replaceChildren();content.mails.forEach((m,i)=>{const b=document.createElement('button');b.className='mail-item'+(i===selected?' active':'');const strong=document.createElement('b'),small=document.createElement('small');strong.textContent=m.subject;small.textContent=m.date;b.append(strong,small);b.onclick=()=>renderMail(i);list.appendChild(b)});const body=document.getElementById('mailBody');body.replaceChildren();const m=content.mails[selected];if(m){const small=document.createElement('small'),h=document.createElement('h1'),p=document.createElement('p');small.textContent='From: ばく / '+m.date;h.textContent=m.subject;p.textContent=m.body;p.style.whiteSpace='pre-wrap';body.append(small,h,p)}}
function renderDiary(){const el=document.getElementById('diaryBody');el.replaceChildren();content.diary.forEach(d=>{const h=document.createElement('h2'),p=document.createElement('p');h.textContent=d.date;p.textContent=d.body;p.style.whiteSpace='pre-wrap';el.append(h,p)})}
renderMail();renderDiary();
let latest=content.mails[0];function markMailRead(){if(latest)localStorage.setItem('bakuLastMail',latest.id);document.getElementById('unreadBadge').hidden=true;document.getElementById('mailToast').hidden=true}
function mailStatus(){if(latest&&localStorage.getItem('bakuLastMail')!==latest.id)document.getElementById('unreadBadge').hidden=false}mailStatus();
// 30秒後の新着通知。音声ファイルを追加したら下のコメントを外して利用できます。
setTimeout(()=>{if(latest&&localStorage.getItem('bakuLastMail')!==latest.id){document.getElementById('toastSubject').textContent=latest.subject;document.getElementById('mailToast').hidden=false;/* new Audio('mail.mp3').play().catch(()=>{}); */}},30000);
function clock(){const d=new Date();document.getElementById('clock').textContent=d.toLocaleTimeString('ja-JP',{hour:'2-digit',minute:'2-digit'});if(d.getHours()===3&&d.getMinutes()===33&&!sessionStorage.getItem('333')){sessionStorage.setItem('333','1');document.getElementById('noteTitle').textContent='SYSTEM';document.getElementById('noteBody').textContent='夢との接続が安定しました。';openWindow('note')}}clock();setInterval(clock,30000);
let visits=Number(localStorage.getItem('bakuVisits')||0)+1;localStorage.setItem('bakuVisits',visits);if(visits>=3)document.getElementById('secretIcon').hidden=false;
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
