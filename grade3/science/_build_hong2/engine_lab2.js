
/* ===== 3-2 과학 홍지희 선생님 버전: 실험·탐구 단계 (2026.10) =====
   design 🧭 실험 설계 · pgrid 🔮 예상 표 · board 📊 우리 반 자료판 · gcmp ⚖️ 예상과 우리 반 결과 · claim ✍️ 근거로 결론
   예상 표·자료판은 같은 G(표 정의: rows·cols)를 씁니다. 칸 값은 'o' | 'x' | '' (cols[c].o / cols[c].x 가 화면 글자) */
Object.assign(ROUT,{design:['🧭','실험 설계하기'],pgrid:['🔮','예상하기'],board:['📊','우리 반 자료판'],gcmp:['⚖️','예상과 결과 비교하기'],claim:['✍️','근거로 결론 만들기']});
const GDEF=C.grids||{};
const NG=()=>C.groups||6;
function rowHead(r){return `<span class="rh">${r.svg?`<span class="rsv">${r.svg}</span>`:''}<span>${esc(r.n)}</span></span>`}
function cellLab(c,v){return v==='o'?c.o:v==='x'?c.x:'?'}
function gTable(G,vals,opts={}){/* 누를 수 있는 표 */
 return `<table class="rec gt"><thead><tr><th>${esc(G.corner||'')}</th>${G.cols.map(c=>`<th>${esc(c.n)}</th>`).join('')}</tr></thead><tbody>${G.rows.map((r,ri)=>`<tr><th>${rowHead(r)}</th>${G.cols.map((c,ci)=>{const v=vals[ri+'_'+ci]||'';return `<td><button class="gc ${v}" data-c="${ri}_${ci}" ${opts.ro?'disabled':''}>${esc(cellLab(c,v))}</button></td>`}).join('')}</tr>`).join('')}</tbody></table>`}
function wireG(store,save,G){document.querySelectorAll('button.gc[data-c]').forEach(b=>b.onclick=()=>{const k=b.dataset.c;const v=store[k]||'';const n=v===''?'o':v==='o'?'x':'';store[k]=n;save();const ci=+k.split('_')[1];b.className='gc '+n;b.textContent=cellLab(G.cols[ci],n)})}
/* 반 전체 집계 */
function boardData(key){return LS.get(LK+'bd'+key,{})}
function tally(key,G){const d=boardData(key);const out={};let ng=0;for(let g=1;g<=NG();g++){const gv=d['g'+g]||{};if(Object.values(gv).some(Boolean))ng++}
 G.rows.forEach((r,ri)=>G.cols.forEach((c,ci)=>{let o=0,x=0;for(let g=1;g<=NG();g++){const v=(d['g'+g]||{})[ri+'_'+ci];if(v==='o')o++;else if(v==='x')x++}
  out[ri+'_'+ci]={o,x,maj:o>x?'o':x>o?'x':(o||x?'tie':''),split:o>0&&x>0}}));return {cells:out,ng}}
/* 🧭 실험 설계: 질문마다 카드를 고르고 '생각 확인하기'로 까닭을 봐요 */
R.design=(s,id)=>{const sel=LS.get(LK+id+'sel',{});
 $('body').innerHTML=s.parts.map((p,pi)=>`<div class="dpart"><div class="dq">${esc(p.q)}</div><div class="dcards">${p.items.map((it,ii)=>{const k=pi+'_'+ii;return `<button class="dc" aria-pressed="${sel[k]?'true':'false'}" data-k="${k}">${it.svg?`<span class="dsv">${it.svg}</span>`:''}${esc(it.x)}</button>`}).join('')}</div><div class="dfb" id="dfb${pi}"></div></div>`).join('')
 +`<div class="row-c"><button class="big-btn" id="dChk" style="font-size:clamp(18px,1.7vw,23px);padding:6px 22px">🔎 ${esc(s.btn||'생각 확인하기')}</button></div>${s.col?`<div class="cols wrap" style="--n:1">${col(id+'z',s.col,'#2F74E0','',{ph:s.colph||'생각을 써요'})}</div>`:''}`;
 document.querySelectorAll('.dc').forEach(b=>b.onclick=()=>{const on=b.getAttribute('aria-pressed')!=='true';b.setAttribute('aria-pressed',on);sel[b.dataset.k]=on;LS.set(LK+id+'sel',sel)});
 $('dChk').onclick=()=>{s.parts.forEach((p,pi)=>{const msgs=[];p.items.forEach((it,ii)=>{const on=!!sel[pi+'_'+ii];const b=document.querySelector(`.dc[data-k="${pi}_${ii}"]`);b.classList.remove('good','bad','miss');
   if(on&&it.ok===true)b.classList.add('good');if(on&&it.ok===false)b.classList.add('bad');if(!on&&it.ok===true&&!p.free)b.classList.add('miss');
   if((on||it.ok===true&&!p.free)&&it.w)msgs.push(`<li class="${on?(it.ok===false?'bad':'good'):'miss'}">${on?(it.ok===false?'🤔':'👍'):'➕'} <b>${esc(it.x)}</b> — ${esc(it.w)}</li>`)});
  $('dfb'+pi).innerHTML=msgs.length?`<ul>${msgs.join('')}</ul>`:'';$('dfb'+pi).classList.add('on')})};
 if(s.col)wireCols([id+'z'])};
/* 🔮 예상 표: 칸을 눌러 예상을 골라요(누를 때마다 바뀜). 까닭은 붙임쪽지로 */
R.pgrid=(s,id)=>{const G=GDEF[s.g];const v=LS.get(LK+'pg'+s.g,{});
 $('body').innerHTML=`<div class="gwrap"><div>${gTable(G,v)}<p class="tnote2">칸을 한 번 누르면 ‘${esc(G.cols[0].o)}’, 또 누르면 ‘${esc(G.cols[0].x)}’, 또 누르면 처음으로 돌아가요.</p></div><div class="cols" style="--n:1">${col('pg'+s.g+'r','💡 그렇게 예상한 까닭','#2F74E0','',{ph:s.ph||'왜냐하면 ~ 때문이에요.'})}</div></div>${s.tip?`<div class="tip">💡 ${esc(s.tip)}</div>`:''}`;
 wireG(v,()=>LS.set(LK+'pg'+s.g,v),G);wireCols(['pg'+s.g+'r'])};
/* 📊 우리 반 자료판: 모둠마다 결과를 넣고, '반 전체'에서 모아 봐요 */
R.board=(s,id)=>{const G=GDEF[s.g];const d=boardData(s.g);let cur=LS.get(LK+id+'cur','g1');
 const draw=()=>{const tabs=[...Array(NG())].map((_,i)=>{const g='g'+(i+1);const has=d[g]&&Object.values(d[g]).some(Boolean);return `<button class="bt ${cur===g?'on':''} ${has?'has':''}" data-g="${g}">${i+1}모둠${has?' ✓':''}</button>`}).join('')+`<button class="bt all ${cur==='all'?'on':''}" data-g="all">📊 반 전체</button>`;
  let main;
  if(cur==='all'){const T=tally(s.g,G);
   main=`<table class="rec gt sum"><thead><tr><th>${esc(G.corner||'')}</th>${G.cols.map(c=>`<th>${esc(c.n)}</th>`).join('')}</tr></thead><tbody>${G.rows.map((r,ri)=>`<tr><th>${rowHead(r)}</th>${G.cols.map((c,ci)=>{const t=T.cells[ri+'_'+ci];const tot=t.o+t.x;
     return `<td class="${t.split?'spl':''}">${tot?`<div class="bar"><span class="bo" style="flex:${t.o}"></span><span class="bx" style="flex:${t.x}"></span></div><div class="cnt"><b class="${t.maj==='o'?'m':''}">${esc(c.o)} ${t.o}</b> · <b class="${t.maj==='x'?'m':''}">${esc(c.x)} ${t.x}</b>${t.split?' ⚠️':''}</div>`:'<span class="cnt">—</span>'}</td>`}).join('')}</tr>`).join('')}</tbody></table>
   <p class="tnote2">결과를 넣은 모둠: ${T.ng} / ${NG()} · 굵은 글씨가 더 많은 모둠의 결과예요. ⚠️ 표시는 모둠마다 결과가 달랐던 칸이에요.</p>`}
  else{d[cur]=d[cur]||{};main=gTable(G,d[cur])+`<p class="tnote2">${esc(cur.slice(1))}모둠이 실험한 결과대로 칸을 눌러요. (누를 때마다 바뀌어요)</p>`}
  $('body').innerHTML=`<div class="btabs">${tabs}</div>${main}${s.after?`<div class="after wrap">💬 ${esc(s.after)}</div>`:''}`;
  document.querySelectorAll('.bt').forEach(b=>b.onclick=()=>{cur=b.dataset.g;LS.set(LK+id+'cur',cur);draw()});
  if(cur!=='all')wireG(d[cur],()=>{LS.set(LK+'bd'+s.g,d);document.querySelector(`.bt[data-g="${cur}"]`).classList.toggle('has',Object.values(d[cur]).some(Boolean))},G)};
 draw()};
/* ⚖️ 예상과 우리 반 결과 */
R.gcmp=(s,id)=>{const G=GDEF[s.g];const p=LS.get(LK+'pg'+s.g,{});const T=tally(s.g,G);let same=0,n=0;const diffs=[],splits=[];
 const tb=`<table class="rec gt cmp"><thead><tr><th>${esc(G.corner||'')}</th>${G.cols.map(c=>`<th>${esc(c.n)}</th>`).join('')}</tr></thead><tbody>${G.rows.map((r,ri)=>`<tr><th>${rowHead(r)}</th>${G.cols.map((c,ci)=>{const k=ri+'_'+ci;const pv=p[k]||'';const t=T.cells[k];const rv=t.maj==='o'||t.maj==='x'?t.maj:'';
   if(pv&&rv){n++;if(pv===rv)same++;else diffs.push(r.n+' · '+c.n)}if(t.split)splits.push(r.n+' · '+c.n);
   const st=pv&&rv?(pv===rv?'eq':'ne'):'';return `<td class="${st}"><span class="pp">${esc(pv?cellLab(c,pv):'?')}</span> → <b class="rr">${esc(rv?cellLab(c,rv):(t.maj==='tie'?'반반':'?'))}</b>${t.split?' ⚠️':''}</td>`}).join('')}</tr>`).join('')}</tbody></table>`;
 $('body').innerHTML=`${tb}<p class="tnote2">${n?`예상과 결과를 견줄 수 있는 ${n}칸 중 <b>${same}칸</b>이 같았어요.`:'예상 표와 우리 반 자료판을 채우면 여기에서 견주어 볼 수 있어요.'} 칸 글자는 ‘예상 → 반 전체 결과’예요.</p>
 <div class="cols wrap" style="--n:2">${col(id+'a','⚖️ 예상과 달랐던 칸, 왜 그랬을까?','#E8961E',diffs.length?'달랐던 칸: '+diffs.join(', '):'',{ph:s.f?.[0]||'~은 예상과 달랐어요. 왜냐하면 ~'})}${col(id+'b','⚠️ 모둠마다 결과가 달랐던 칸, 왜 그랬을까?','#E0506B',splits.length?'달랐던 칸: '+splits.join(', '):'',{ph:s.f?.[1]||'모둠마다 ~이 달랐을 것 같아요.'})}</div>${s.after?`<div class="after wrap">💬 ${esc(s.after)}</div>`:''}`;
 wireCols([id+'a',id+'b'],[id+'b'])};
/* ✍️ 근거로 결론: 우리 반 자료판에서 근거를 골라 결론 문장을 써요 */
R.claim=(s,id)=>{const G=GDEF[s.g];const T=tally(s.g,G);const ev=[];
 G.cols.forEach((c,ci)=>{const os=[],xs=[],ties=[];const pre=c.ev?c.ev+' ':'';G.rows.forEach((r,ri)=>{const t=T.cells[ri+'_'+ci];const tag=t.split?`(모둠마다 달랐어요 ${t.o}:${t.x})`:'';if(t.maj==='o')os.push(r.n+tag);else if(t.maj==='x')xs.push(r.n+tag);else if(t.maj==='tie')ties.push(r.n)});
  if(os.length)ev.push(`${os.join(', ')}: ${pre}${c.o}`);if(xs.length)ev.push(`${xs.join(', ')}: ${pre}${c.x}`);if(ties.length)ev.push(`${ties.join(', ')}: ${c.n} 모둠마다 반반이에요`)});
 const sv=LS.get(LK+id+'c',{e:'',c:''});
 $('body').innerHTML=`<div class="evbox"><b>📊 우리 반 자료판에서 찾은 근거</b> <small>(누르면 근거 칸에 들어가요)</small><div class="chips">${ev.length?ev.map(e=>`<button class="chip" aria-pressed="false">${esc(e)}</button>`).join(''):'<span class="ask">자료판에 결과를 넣으면 여기에 근거가 나와요.</span>'}</div></div>
 <div class="claim"><label>📑 근거: ${esc(s.f1||'우리 반 자료를 보니')}<textarea id="ce" rows="2" placeholder="자료판에서 본 결과를 써요.">${esc(sv.e)}</textarea></label><label>✍️ 결론: ${esc(s.f2||'그래서')}<textarea id="cc" rows="2" placeholder="${esc(s.ph||'~을 알 수 있어요.')}">${esc(sv.c)}</textarea></label></div>
 <button class="big-btn" id="dShow" style="font-size:clamp(18px,1.7vw,23px);padding:6px 22px">📖 ${esc(s.btn||'교과서 문장과 비교하기')}</button>
 <div class="book" id="book"><small>${esc(s.bookLabel||'교과서 문장')} (${esc(s.src)})</small><br><b>${s.book}</b></div>
 <div class="cols after-book" id="abk" style="--n:2">${col(id+'s','🤝 우리 결론과 같은 점','#1F9E63','',{ph:'우리 결론과 ~이 같아요.'})}${col(id+'n','✨ 더 알게 된 점','#2F74E0','',{ph:'~을 새로 알았어요.'})}</div>`;
 const save=()=>LS.set(LK+id+'c',{e:$('ce').value,c:$('cc').value});$('ce').oninput=$('cc').oninput=save;
 document.querySelectorAll('.evbox .chip').forEach(c=>c.onclick=()=>{c.setAttribute('aria-pressed','true');$('ce').value=($('ce').value?$('ce').value+' / ':'')+c.textContent;save()});
 $('dShow').onclick=()=>{$('book').classList.add('on');$('abk').classList.add('on');$('dShow').style.display='none'};wireCols([id+'s',id+'n'])};
