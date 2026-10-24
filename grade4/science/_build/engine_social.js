
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const PH=C.photos||{};
const SOOP={S:['S','개념 찾기','var(--S)'],O1:['O','개념 구축하기','var(--O1)'],O2:['O','탐구 정리하기','var(--O2)'],P:['P','발표하기','var(--P)']};
const ROUT={see:['🔍','보기-생각하기-궁금해하기'],sort:['🗂️','예와 예가 아닌 것 나누기'],define:['✍️','우리 반 결론 만들기'],cards:['📑','자료 살펴보기'],csq:['🗣️','주장-근거-질문'],venn:['⚖️','같은 점·다른 점'],cse:['🔗','연결-확장-도전'],iuti:['🔄','예전 생각-지금 생각'],task:['🛠️','활동하기'],check:['✅','개념 확인하기'],talk:['💭','생각 나누기']};
let SAVE=true;const LS={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const LK='soop:'+C.lessonKey+':', QK='soopQ:'+C.topic.key;
let step=0;
const sc=SOOP[C.soop];document.documentElement.style.setProperty('--sc',sc[2]);
/* 표지 */
$('cBadge').innerHTML=`${sc[0]} · ${sc[1]}`;$('cBadge').style.setProperty('--sc',sc[2]);
$('cTitle').textContent=C.title;$('cSub').textContent=C.sub;document.title=C.title;
$('cBq').innerHTML=`<small>🌟 이 주제의 핵심 질문</small><b>${esc(C.topic.bq)}</b>`;
$('cGoal').textContent='학습 문제: '+C.goal;
$('cMap').innerHTML=['S','O1','O2','P'].map(k=>`<div class="mcol" style="--mc:${SOOP[k][2]}"><h3>${SOOP[k][0]} ${SOOP[k][1]}</h3>${C.topic.map.filter(m=>m.s===k).map(m=>m.f===C.file?`<span class="cur">${esc(m.n)} ${esc(m.t)}</span>`:`<a href="${m.f}">${esc(m.n)} ${esc(m.t)}</a>`).join('')}</div>`).join('');
$('cPlan').innerHTML=C.steps.map((s,i)=>`<button class="st" data-i="${i}">${i+1}. ${esc(s.t)} ${s.min}분</button>`).join('');
$('cPlan').querySelectorAll('.st').forEach(b=>b.onclick=()=>go(+b.dataset.i));
const pk=Object.keys(PH);$('pcredit').innerHTML=pk.length?'사진 출처 · 위키미디어 공용: '+pk.map(k=>`${esc(PH[k].name)}(${esc(PH[k].title)} / ${esc(PH[k].artist||'작자 미상')} / ${esc(PH[k].lic)})`).join(' · '):'';
$('go').onclick=()=>go(0);$('home').onclick=()=>{stopT();show('cover')};
function show(id){document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('on',s.id===id))}
function openO(id){$(id).classList.add('on')}
document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>$(b.dataset.close).classList.remove('on'));
document.querySelectorAll('[data-full]').forEach(b=>b.onclick=()=>{try{document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen()}catch(e){}});
/* 교사 안내 */
function tnote(i){const n=i<0?C.notes0:C.steps[i].note;$('tnT').textContent='👩‍🏫 '+(i<0?'수업 준비':`${i+1}. ${C.steps[i].t}`);$('tnB').innerHTML=n||'<p>이 단계의 안내는 수업 준비 안내를 보세요.</p>';openO('tnO')}
$('tn0').onclick=()=>tnote(-1);$('tn').onclick=()=>tnote(step);
/* 질문 판 */
const STEMS=['왜 ~할까?','어떻게 ~할 수 있을까?','만약 ~라면 어떻게 될까?','~와 ~는 무엇이 다를까?','~는 모두 같을까?'];
$('stems').innerHTML='<span class="ask">질문 만들기 도우미:</span>'+STEMS.map(s=>`<button>${s}</button>`).join('');
$('stems').querySelectorAll('button').forEach(b=>b.onclick=()=>{$('qText').value=b.textContent;$('qText').focus()});
$('qbTopic').textContent=C.topic.name;
function Q(){return LS.get(QK,[])}function setQ(v){LS.set(QK,v);qCount()}
function qCount(){const q=Q();$('qn').textContent=q.filter(x=>x.s<2).length}
function addQ(text,type){text=text.trim();if(!text)return;const q=Q();q.push({t:text,ty:type||'그 밖에',s:0,a:'',from:C.short,id:Date.now()+Math.random()});setQ(q);renderQ()}
const STS=['❓ 궁금해요','🔎 찾는 중','✅ 답 찾음'];
function renderQ(){const q=Q();$('qList').innerHTML=q.length?q.map((x,i)=>`<div class="qi s${x.s}"><div class="top"><span class="ty">${esc(x.ty)}</span><span class="q">${esc(x.t)}</span><span class="from">${esc(x.from)}</span><button class="stt" data-i="${i}">${STS[x.s]}</button><button class="stt" data-del="${i}" aria-label="지우기">✕</button></div>${x.s>0?`<input data-a="${i}" value="${esc(x.a)}" placeholder="찾은 답과 근거 (예: 자료 ②를 보니 …)">`:''}</div>`).join(''):'<p class="ask">아직 질문이 없어요. 첫 질문을 올려 보세요!</p>';
 $('qList').querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>{const q=Q();q[+b.dataset.i].s=(q[+b.dataset.i].s+1)%3;setQ(q);renderQ()});
 $('qList').querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{const q=Q();q.splice(+b.dataset.del,1);setQ(q);renderQ()});
 $('qList').querySelectorAll('[data-a]').forEach(inp=>inp.onchange=()=>{const q=Q();q[+inp.dataset.a].a=inp.value;setQ(q)});}
$('qAdd').onclick=()=>{addQ($('qText').value,$('qType').value);$('qText').value=''};
$('qText').onkeydown=e=>{if(e.key==='Enter')$('qAdd').onclick()};
$('qbBtn').onclick=$('qb0').onclick=()=>{renderQ();openO('qbO')};
$('qPrint').onclick=()=>{const p=$('qbPanel');p.classList.add('printme');window.print();p.classList.remove('printme')};
$('qClear').onclick=()=>{if(confirm('질문 판을 모두 비울까요? (이 주제의 모든 차시에서 지워져요)')){setQ([]);renderQ()}};
(function(){const q=Q();if(!q.some(x=>x.t===C.topic.bq)){q.unshift({t:C.topic.bq,ty:'왜',s:0,a:'',from:'🌟 핵심 질문',id:1});setQ(q)}})();
qCount();
/* 발표자 뽑기 */
let drawn=LS.get('soopPick',[]);
function pkLeft(){const m=+$('pkMax').value||25;$('pkLeft').textContent=`아직 말하지 않은 친구 ${m-drawn.filter(n=>n<=m).length}명`}
$('pickBtn').onclick=()=>{pkLeft();openO('pkO')};
$('pkGo').onclick=()=>{const m=+$('pkMax').value||25;let pool=[];for(let i=1;i<=m;i++)if(!drawn.includes(i))pool.push(i);if(!pool.length){drawn=[];pool=[...Array(m)].map((_,i)=>i+1)}
 const n=pool[Math.floor(Math.random()*pool.length)];drawn.push(n);LS.set('soopPick',drawn);let k=0;const t=setInterval(()=>{$('pkN').textContent=pool[Math.floor(Math.random()*pool.length)]+'번';if(++k>10){clearInterval(t);$('pkN').textContent=n+'번';pkLeft()}},60)};
$('pkReset').onclick=()=>{drawn=[];LS.set('soopPick',drawn);$('pkN').textContent='?';pkLeft()};
/* 타이머 */
let T=null,left=0;function stopT(){clearInterval(T);T=null}
function showT(){$('tm').textContent=`${String(Math.floor(left/60)).padStart(2,'0')}:${String(left%60).padStart(2,'0')}`}
$('timerBtn').onclick=()=>{if(T){stopT();return}left=left>0?left:C.steps[step].min*60;T=setInterval(()=>{left--;showT();if(left<=0){stopT();$('timerBtn').style.borderColor='var(--no)'}},1000);showT()};
/* 사진 */
function img(p,cls){const x=PH[p];return x?`<img src="${x.data}" alt="${esc(x.name)}" data-ph="${p}" ${cls?`class="${cls}"`:''}>`:''}
function wireImgs(){document.querySelectorAll('#body img[data-ph]').forEach(im=>im.onclick=()=>{const p=PH[im.dataset.ph];$('bvI').src=p.data;$('bvM').textContent=`${p.name} — ${p.title} / ${p.artist||'작자 미상'} / ${p.lic} / 위키미디어 공용`;$('bv').classList.add('on')})}
$('bvX').onclick=()=>$('bv').classList.remove('on');
/* 붙임쪽지 칸 */
function col(id,title,color,frame,opts={}){const ph=opts.ph||frame||'생각을 써요';return `<div class="col${opts.cmp?' cmp':''}" style="--cc:${color}"><h3>${title}</h3>${frame&&frame!==ph?`<p class="frame">${esc(frame)}</p>`:''}<div class="notes" id="n-${id}"></div><div class="add"><input id="i-${id}" placeholder="${esc(ph)}"><button data-add="${id}">붙이기</button></div></div>`}
function drawNotes(id,toBoard){const arr=LS.get(LK+id,[]);const box=$('n-'+id);if(!box)return;
 box.innerHTML=arr.map((t,i)=>`<div class="note"><span>${esc(t)}</span><span>${toBoard?`<button class="up" data-up="${i}">질문 판에 ↑</button>`:''}<button class="x" data-x="${i}" aria-label="지우기">✕</button></span></div>`).join('');
 box.querySelectorAll('[data-x]').forEach(b=>b.onclick=()=>{arr.splice(+b.dataset.x,1);LS.set(LK+id,arr);drawNotes(id,toBoard)});
 box.querySelectorAll('[data-up]').forEach(b=>b.onclick=()=>{addQ(arr[+b.dataset.up],'그 밖에');b.textContent='올렸어요 ✓';b.disabled=true});}
function wireCols(ids,boardIds=[]){ids.forEach(id=>{const inp=$('i-'+id),btn=document.querySelector(`[data-add="${id}"]`);const f=()=>{const v=inp.value.trim();if(!v)return;const a=LS.get(LK+id,[]);a.push(v);LS.set(LK+id,a);inp.value='';drawNotes(id,boardIds.includes(id))};btn.onclick=f;inp.onkeydown=e=>{if(e.key==='Enter')f()};drawNotes(id,boardIds.includes(id))})}
/* 단계 그리기 */
function stepsBar(){$('steps').innerHTML=C.steps.map((s,i)=>`<button class="st ${i===step?'now':i<step?'done':''}" data-i="${i}">${i+1}. ${esc(s.t)}</button>`).join('');$('steps').querySelectorAll('.st').forEach(b=>b.onclick=()=>go(+b.dataset.i))}
function go(i){step=i;stopT();left=0;$('tm').textContent='--:--';$('timerBtn').style.borderColor='';show('lesson');render()}
$('prev').onclick=()=>step>0?go(step-1):show('cover');$('next').onclick=()=>step<C.steps.length-1?go(step+1):show('cover');
function render(){const s=C.steps[step];stepsBar();const r=ROUT[s.k]||['•',''];$('rt').textContent=`${r[0]} ${s.routine||r[1]} · ${s.min}분`;$('hd').textContent=s.hd||s.t;$('ask').textContent=s.ask||'';
 $('next').textContent=step<C.steps.length-1?'다음 →':'마치기 ✓';(R[s.k]||R.talk)(s,'s'+step);wireImgs();$('body').scrollTop=0}
const R={};
R.see=(s,id)=>{$('body').innerHTML=`<div class="split wrap"><div class="gal"><p class="zoomhint">🔍 사진을 누르면 크게 볼 수 있어요.</p>${s.items.map(it=>`<div class="pic">${it.p?img(it.p):`<span class="e">${it.e}</span>`}<b>${esc(it.cap||'')}</b>${it.sub?`<small>${esc(it.sub)}</small>`:''}</div>`).join('')}</div>
 <div class="cols" style="--n:3">${col(id+'a','👀 보여요','#2F74E0',s.f?.[0]||'~이 보여요.')}${col(id+'b','💭 생각해요','#6A4FC9',s.f?.[1]||'~인 것 같아요.')}${col(id+'c','❓ 궁금해요','#E8961E',s.f?.[2]||'왜 ~할까?')}</div></div>`;
 wireCols([id+'a',id+'b',id+'c'],[id+'c'])};
R.sort=(s,id)=>{let deck=[...s.items],i=0,done=[];const bins=s.bins;
 const draw=()=>{if(i>=deck.length){$('body').innerHTML=`<div class="sorted" style="--n:${bins.length}">${bins.map(b=>`<div style="--cc:${b.c}"><b>${b.e} ${esc(b.n)}</b><br>${done.filter(d=>d.k===b.k).map(d=>'· '+esc(d.x)).join('<br>')}</div>`).join('')}</div>${s.after?`<div class="after">💬 ${esc(s.after)}</div>`:''}${s.col?`<div class="cols" style="--n:1;width:min(1000px,100%)">${col(id+'z',s.col,'#E8961E','',{ph:s.colph||'생각을 써요',cmp:1})}</div>`:''}`;if(s.col)wireCols([id+'z']);return}
  const it=deck[i];$('body').innerHTML=`<div class="deck"><p class="ask">${i+1} / ${deck.length}</p><div class="card1">${it.p?img(it.p):`<span class="e">${it.e}</span>`}<span class="x">${esc(it.x)}</span></div>
  <div class="bins" style="--n:${bins.length}">${bins.map(b=>`<button class="bin" data-k="${b.k}" style="--cc:${b.c}"><span class="e">${b.e}</span>${esc(b.n)}${b.c2?`<span class="c">${esc(b.c2)}</span>`:''}</button>`).join('')}</div><div class="fb" id="fb"></div></div>`;wireImgs();
  document.querySelectorAll('.bin').forEach(b=>b.onclick=()=>{const fb=$('fb');const open=it.k==='*';const ok=open||b.dataset.k===it.k;
   fb.className='fb on '+(open?'open':ok?'ok':'no');fb.innerHTML=(open?'<b>생각이 다를 수 있어요.</b> ':ok?'<b>맞아요!</b> ':'<b>다시 생각해 봐요.</b> ')+esc(it.w||'')+(ok?` <button class="ghost" id="nx" style="margin-left:8px">다음 카드</button>`:'');
   if(ok){done.push({k:open?b.dataset.k:it.k,x:it.x});document.querySelectorAll('.bin').forEach(x=>x.disabled=true);$('nx').onclick=()=>{i++;draw()};$('nx').focus()}})};draw()};
R.define=(s,id)=>{const saved=LS.get(LK+id+'d','');$('body').innerHTML=`<div class="chips">${s.words.map(w=>`<button class="chip" aria-pressed="false">${esc(w)}</button>`).join('')}</div>
 <div class="frameline">${esc(s.frame[0])} <input id="dIn" value="${esc(saved)}" placeholder="낱말 카드를 누르거나 직접 써요"> ${esc(s.frame[1])}</div>
 <button class="big-btn" id="dShow" style="font-size:clamp(19px,1.8vw,25px);padding:8px 24px">📖 ${esc(s.btn||'교과서 뜻과 비교하기')}</button>
 <div class="book" id="book"><small>${esc(s.bookLabel||'교과서 뜻')} (${esc(s.src)})</small><br><b>${s.book}</b></div>
 <div class="cols" style="--n:2">${col(id+'s','🤝 교과서와 같은 점','#1F9E63','',{ph:'우리 결론과 ~이 같아요.'})}${col(id+'n','✨ 새로 알게 된 점','#2F74E0','',{ph:'~을 새로 알았어요.'})}</div>`;
 document.querySelectorAll('.chip').forEach(c=>c.onclick=()=>{c.setAttribute('aria-pressed',c.getAttribute('aria-pressed')==='true'?'false':'true');const inp=$('dIn');if(c.getAttribute('aria-pressed')==='true'){inp.value=(inp.value?inp.value+' ':'')+c.textContent;LS.set(LK+id+'d',inp.value)}});
 $('dIn').oninput=()=>LS.set(LK+id+'d',$('dIn').value);$('dShow').onclick=()=>{$('book').classList.add('on');$('book').scrollIntoView({block:'center',behavior:'smooth'})};wireCols([id+'s',id+'n'])};
R.cards=(s,id)=>{$('body').innerHTML=`<div class="gal wrap">${s.cards.map((c,i)=>`<div class="pic" style="border-color:${c.c||'var(--line)'}"><span class="num">자료 ${i+1}</span>${c.p?img(c.p):`<span class="e">${c.e}</span>`}<b>${esc(c.t)}</b><span style="font-size:clamp(15px,1.45vw,19px)">${esc(c.d)}</span><small>${esc(c.s||'')}</small></div>`).join('')}</div>${s.qs?`<div class="after wrap">💬 ${s.qs.map(esc).join('<br>💬 ')}</div>`:''}`};
R.csq=(s,id)=>{const q=Q().filter(x=>x.s<2);const store=LS.get(LK+id+'log',[]);const nC=(s.cards||[]).length;
 $('body').innerHTML=`<div class="qpick"><b style="font-family:var(--display);font-weight:400">🎯 함께 답할 질문</b><select id="qSel">${[...new Set([...(s.qs||[]),...q.map(x=>x.t)])].map(x=>`<option>${esc(x)}</option>`).join('')}</select></div>
 ${nC?`<div class="mini wrap">${s.cards.map((c,i)=>`<div class="m">${c.p?img(c.p):`<span class="e">${c.e}</span>`}<div><span class="num">자료 ${i+1}</span> <b style="display:inline">${esc(c.t)}</b><span class="d">${esc(c.d)}</span><small>${esc(c.s||'')}</small></div></div>`).join('')}</div>`:''}
 <div class="csq">
  <div class="col cmp" style="--cc:#2F74E0"><h3>🗣️ 내 생각</h3><textarea id="cl" rows="2" placeholder="나는 ~라고 생각해요." style="font-family:var(--body);font-size:clamp(17px,1.6vw,21px);border:3px solid var(--line);border-radius:10px;background:var(--bg);color:var(--ink);padding:6px"></textarea></div>
  <div class="col cmp" style="--cc:#1F9E63"><h3>📑 근거</h3><p class="frame">근거가 되는 자료 번호를 눌러요.</p><div class="evi">${[...Array(nC)].map((_,i)=>`<button aria-pressed="false" data-e="${i+1}">자료 ${i+1}</button>`).join('')}</div><input id="ev" placeholder="왜냐하면 자료 ○을 보면 ~이기 때문이에요." style="font-family:var(--body);font-size:clamp(16px,1.5vw,20px);border:3px solid var(--line);border-radius:10px;background:var(--bg);color:var(--ink);padding:6px"></div>
  <div class="col cmp" style="--cc:#E8961E"><h3>❓ 친구에게 묻기</h3><input id="bq" placeholder="그럼 ~는 어떨까?" style="font-family:var(--body);font-size:clamp(16px,1.5vw,20px);border:3px solid var(--line);border-radius:10px;background:var(--bg);color:var(--ink);padding:6px"><button class="big-btn" id="csqSave" style="font-size:clamp(18px,1.7vw,23px);padding:6px 20px;align-self:flex-end">✔ 기록하기</button></div>
 </div>
 <div class="log wrap" id="csqLog"></div>`;
 const drawLog=()=>{$('csqLog').innerHTML=store.map(x=>`<div><b>질문:</b> ${esc(x.q)}<br>🗣️ ${esc(x.c)} · 📑 ${esc(x.e)}${x.b?` · ❓ ${esc(x.b)}`:''}</div>`).join('')};drawLog();
 document.querySelectorAll('.evi button').forEach(b=>b.onclick=()=>b.setAttribute('aria-pressed',b.getAttribute('aria-pressed')==='true'?'false':'true'));
 $('csqSave').onclick=()=>{const c=$('cl').value.trim();if(!c)return;const ev=[...document.querySelectorAll('.evi button[aria-pressed="true"]')].map(b=>'자료 '+b.dataset.e).join(', ');
  const rec={q:$('qSel').value,c,e:[ev,$('ev').value.trim()].filter(Boolean).join(' — ')||'(근거 없음 — 자료에서 찾아봐요)',b:$('bq').value.trim()};store.push(rec);LS.set(LK+id+'log',store);
  const all=Q();const hit=all.find(x=>x.t===rec.q);if(hit&&rec.e&&!rec.e.startsWith('(')){hit.s=Math.max(hit.s,1);hit.a=(hit.a?hit.a+' / ':'')+rec.c+' ('+rec.e+')';setQ(all)}
  if(rec.b)addQ(rec.b,'그 밖에');$('cl').value=$('ev').value=$('bq').value='';document.querySelectorAll('.evi button').forEach(b=>b.setAttribute('aria-pressed','false'));drawLog()}};
R.venn=(s,id)=>{$('body').innerHTML=`<div class="cols wrap" style="--n:3">${col(id+'a',esc(s.a)+'만','#2F74E0',s.fa||'')}${col(id+'s','🤝 같은 점','#1F9E63',s.fs||'')}${col(id+'b',esc(s.b)+'만','#E0506B',s.fb||'')}</div>${s.after?`<div class="after wrap">💬 ${esc(s.after)}</div>`:''}`;wireCols([id+'a',id+'s',id+'b'])};
R.cse=(s,id)=>{const f=s.f||[];$('body').innerHTML=`<div class="cols wrap" style="--n:3">${col(id+'a','🔗 이어지는 것','#2F74E0',f[0]||'~와 이어져요.')}${col(id+'b','🌱 더 찾은 것','#1F9E63',f[1]||'~도 알게 되었어요.')}${col(id+'c','🧗 아직 궁금한 것','#E8961E',f[2]||'왜 ~할까?')}</div>`;wireCols([id+'a',id+'b',id+'c'],[id+'c'])};
R.iuti=(s,id)=>{const f=s.f||[];$('body').innerHTML=`<div class="cols wrap" style="--n:2">${col(id+'a','🕰️ 예전 생각','#6A4FC9',f[0]||'처음에 나는 ~라고 생각했어요.')}${col(id+'b','💡 지금 생각','#1F9E63',f[1]||'지금은 ~라고 생각해요.')}</div>${s.after?`<div class="after wrap">💬 ${esc(s.after)}</div>`:''}`;wireCols([id+'a',id+'b'])};
R.task=(s,id)=>{const st=LS.get(LK+id+'t',[]);$('body').innerHTML=`<div class="task">${s.list.map((t,i)=>`<label class="${st[i]?'done':''}"><input type="checkbox" data-t="${i}" ${st[i]?'checked':''}> ${esc(t)}</label>`).join('')}</div>${s.tip?`<div class="tip">💡 ${esc(s.tip)}</div>`:''}${s.col?`<div class="cols wrap" style="--n:1">${col(id+'z',s.col,'#E8961E','',{ph:s.colph||'생각을 써요'})}</div>`:''}`;
 document.querySelectorAll('[data-t]').forEach(c=>c.onchange=()=>{st[+c.dataset.t]=c.checked;LS.set(LK+id+'t',st);c.parentElement.classList.toggle('done',c.checked)});if(s.col)wireCols([id+'z'])};
R.check=(s,id)=>{let i=0,sc=0;const draw=()=>{if(i>=s.items.length){$('body').innerHTML=`<div class="qz"><div class="qt">🎉 ${s.items.length}문제 중 ${sc}문제를 맞혔어요!</div><button class="ghost" id="again">다시 풀기</button></div>`;$('again').onclick=()=>{i=0;sc=0;draw()};return}
 const q=s.items[i],ord=q.o.map((_,k)=>k).sort(()=>Math.random()-.5);$('body').innerHTML=`<div class="qz"><p class="ask">${i+1} / ${s.items.length}</p><div class="qt">${esc(q.q)}</div><div class="opts">${ord.map((k,n)=>`<button class="opt" data-k="${k}">${n+1}. ${esc(q.o[k])}</button>`).join('')}</div><div class="fb" id="fb"></div></div>`;
 document.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{const ok=+b.dataset.k===q.a;if(ok)sc++;document.querySelectorAll('.opt').forEach(x=>{x.disabled=true;if(+x.dataset.k===q.a)x.classList.add('right')});if(!ok)b.classList.add('wrong');
  $('fb').className='fb on '+(ok?'ok':'no');$('fb').innerHTML=`<b>${ok?'정답이에요!':'정답을 확인해 봐요.'}</b> ${esc(q.w)} <button class="ghost" id="nx">다음</button>`;$('nx').onclick=()=>{i++;draw()};$('nx').focus()})};draw()};
R.talk=(s,id)=>{$('body').innerHTML=`${s.points?`<div class="after wrap">${s.points.map(p=>'💬 '+esc(p)).join('<br>')}</div>`:''}<div class="cols wrap" style="--n:${s.cols?s.cols.length:1}">${(s.cols||[s.col||'우리 반 생각']).map((c,i)=>col(id+'t'+i,esc(c),['#2F74E0','#1F9E63','#E0506B','#E8961E'][i%4],(s.frames||[])[i]||'')).join('')}</div>`;wireCols((s.cols||[0]).map((_,i)=>id+'t'+i),s.toBoard?(s.cols||[0]).map((_,i)=>id+'t'+i):[])};
document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('.overlay.on,.bigview.on').forEach(o=>o.classList.remove('on'))});
