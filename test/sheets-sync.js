/* Spreadsheet integration. Load after script.js. No HTML from remote data is executed. */
(() => {
  const url = window.BAKU_SHEETS_URL;
  const cacheKey = 'bakuSheets:v1:' + url;
  const readKey = 'bakuMailRead:v2';
  const safeGet = key => { try { return localStorage.getItem(key); } catch { return null; } };
  const safeSet = (key, value) => { try { localStorage.setItem(key, value); } catch {} };
  let read;
  try { const stored = JSON.parse(safeGet(readKey) || '[]'); read = new Set(Array.isArray(stored) ? stored : []); } catch { read = new Set(); }
  const legacy = safeGet('bakuLastMail');
  if (legacy) read.add(String(legacy));
  const storyMails = content.mails.filter(m => String(m.id).startsWith('chapter'));
  let selectedId = content.mails[0]?.id;
  let ready = false;
  const dateOK = s => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && new Date(s + 'T00:00:00Z').toISOString().slice(0,10) === s;
  function validate(data) {
    if (data?.version !== 1 || !Array.isArray(data.schedule) || !Array.isArray(data.mails)) throw Error('Invalid response');
    const ids = new Set();
    for (const s of data.schedule) {
      if (!dateOK(s.date) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(s.time) || typeof s.title !== 'string' || !s.title.trim() || typeof s.description !== 'string') throw Error('Invalid schedule');
    }
    for (const m of data.mails) {
      if (typeof m.id !== 'string' || !m.id || m.id.startsWith('chapter') || ids.has(m.id) || !dateOK(m.date) || typeof m.subject !== 'string' || !m.subject.trim() || typeof m.body !== 'string') throw Error('Invalid mail');
      ids.add(m.id);
    }
    return data;
  }
  const start = s => Date.parse(s.date + 'T' + s.time + ':00+09:00');
  const originalStreams = allStreams();
  content.schedule = originalStreams;
  allStreams = () => content.schedule.slice().sort((a,b) => start(a)-start(b));
  function refreshStream() {
    content.nextStream = allStreams().find(s => start(s) > Date.now()) || {};
    renderStream();
    renderCalendar();
  }
  function unread() { return content.mails.filter(m => !read.has(String(m.id))); }
  mailStatus = () => {
    document.getElementById('unreadBadge').hidden = !unread().length;
    if (!unread().length) document.getElementById('mailToast').hidden = true;
  };
  // Opening the inbox must not mark every message read.
  markMailRead = () => { document.getElementById('mailToast').hidden = true; };
  renderMail = (selected) => {
    if (typeof selected === 'number') selectedId = content.mails[selected]?.id;
    let current = content.mails.find(m => m.id === selectedId) || content.mails[0];
    selectedId = current?.id;
    if (!win('mail').hidden && current) {
      read.add(String(current.id)); safeSet(readKey, JSON.stringify([...read]));
    }
    const list = document.getElementById('mailList'); list.replaceChildren();
    content.mails.forEach((m,i) => {
      const b = document.createElement('button'); b.className = 'mail-item' + (m.id === selectedId ? ' active' : '');
      const strong = document.createElement('b'), small = document.createElement('small');
      strong.textContent = (read.has(String(m.id)) ? '' : '● ') + m.subject; small.textContent = m.date;
      b.append(strong,small); b.onclick = () => renderMail(i); list.append(b);
    });
    const body = document.getElementById('mailBody'); body.replaceChildren();
    if (current) {
      const small = document.createElement('small'), h = document.createElement('h1'), p = document.createElement('p');
      small.textContent = 'From: ばく / ' + current.date; h.textContent = current.subject; p.textContent = current.body; p.style.whiteSpace = 'pre-wrap';
      body.append(small,h,p);
    }
    mailStatus();
    document.dispatchEvent(new CustomEvent('baku:mail-rendered', {detail:{id:current?.id}}));
  };
  // Disable the original latest-message-only notification timer.
  latest = null;
  function notify() {
    const m = unread()[0];
    if (m && ready) { document.getElementById('toastSubject').textContent = m.subject; document.getElementById('mailToast').hidden = false; }
  }
  function apply(data) {
    validate(data);
    const previous = new Set(content.mails.map(m => m.id));
    content.schedule = data.schedule;
    content.mails = [...storyMails, ...data.mails.slice().sort((a,b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id))];
    refreshStream(); renderMail();
    if (content.mails.some(m => !previous.has(m.id) && !read.has(m.id))) notify();
  }
  // Date objects for calendar layout use a local synthetic date representing today's JST date.
  const jstToday = () => { const parts = new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date()); const get = t => Number(parts.find(p=>p.type===t).value); return new Date(get('year'),get('month')-1,get('day')); };
  calendarSelected = jstToday(); calendarCursor = jstToday(); calendarCursor.setDate(1);
  document.getElementById('todayMonth').onclick = () => { calendarSelected=jstToday(); calendarCursor=jstToday(); calendarCursor.setDate(1); renderCalendar(); };
  renderMail(); refreshStream();
  if (url) {
    try { const cached=JSON.parse(safeGet(cacheKey)); if(cached) apply(cached); } catch {}
  }
  let busy=false;
  async function sync() {
    if (!url || busy || document.hidden) return;
    busy=true; const controller=new AbortController(); const timer=setTimeout(()=>controller.abort(),15000);
    try {
      const endpoint=new URL(url);
      if(endpoint.origin!=='https://script.google.com' || !/^\/macros\/s\/[^/]+\/exec$/.test(endpoint.pathname)) throw Error('Use a deployed Apps Script /exec URL');
      endpoint.searchParams.set('_',Date.now());
      const response=await fetch(endpoint,{signal:controller.signal,credentials:'omit',redirect:'follow'});
      if(!response.ok) throw Error('HTTP '+response.status);
      const data=validate(await response.json()); apply(data); safeSet(cacheKey,JSON.stringify(data));
    } catch(error) { console.warn('BAKU OS: 更新を取得できません。保存済みデータを表示します。',error); }
    finally { clearTimeout(timer); busy=false; }
  }
  sync(); setInterval(sync,120000); setInterval(refreshStream,30000);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden){refreshStream();sync();}});
  setTimeout(()=>{ready=true;notify();},30000);
})();
