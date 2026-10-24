
/* ===== 3-2 과학 홍지희 선생님 버전: 실험·탐구 단계 (2026.10) =====
   design 🧭 실험 설계 · pgrid 🔮 예상 표 · board 📊 우리 반 자료판 · gcmp ⚖️ 예상과 우리 반 결과 · claim ✍️ 근거로 결론
   표 정의 C.grids[g] = {corner, rows:[{n, svg?}], cols:[...]}. 열(cols)은 세 가지 모양:
   ① 두 보기 {n, o:'보여요', x:'안 보여요', ev?}  → 칸 값 'o' | 'x'
   ② 여러 보기 {n, opts:['고체','액체','기체'], ev?} → 칸 값 '0' | '1' | '2' …
   ③ 측정값 {n, type:'num', unit?:'', ev?, sum?:true(반 전체에서 모두 더한 값도 보여 줌)}      → 칸 값 숫자 글자(예상 표에서는 '더 큼/더 작음'을 묻지 않고 빈칸으로 둠)
   표 전체: pl:'계획'(‘예상’ 대신 쓸 이름), rl:'친구들이 찾은 답'(‘결과’ 대신 쓸 이름) */
Object.assign(ROUT,{design:['🧭','실험 설계하기'],pgrid:['🔮','예상하기'],board:['📊','우리 반 자료판'],gcmp:['⚖️','예상과 결과 비교하기'],claim:['✍️','근거로 결론 만들기']});
const GDEF=C.grids||{};
const NG=()=>C.groups||6;
function rowHead(r){return `<span class="rh">${r.svg?`<span class="rsv">${r.svg}</span>`:''}<span>${esc(r.n)}</span></span>`}
const isNum=c=>c.type==='num';
function opts(c){return c.opts?c.opts.map((t,i)=>({v:String(i),t})):[{v:'o',t:c.o},{v:'x',t:c.x}]}
function cellLab(c,v){if(isNum(c))return v===''||v==null?'?':v+(c.unit||'');const o=opts(c).find(x=>x.v===v);return o?o.t:'?'}
function nextV(c,v){const o=opts(c);const i=o.findIndex(x=>x.v===v);return i<0?o[0].v:(i+1<o.length?o[i+1].v:'')}
function gTable(G,vals,o={}){/* 누를 수 있는 표 (측정값 열은 숫자 칸) */
 return `<table class="rec gt"><thead><tr><th>${esc(G.corner||'')}</th>${G.cols.map(c=>`<th>${esc(c.n)}${isNum(c)&&c.unit?` <small>(${esc(c.unit)})</small>`:''}</th>`).join('')}</tr></thead><tbody>${G.rows.map((r,ri)=>`<tr><th>${rowHead(r)}</th>${G.cols.map((c,ci)=>{const k=ri+'_'+ci;const v=vals[k]||'';
  if(isNum(c))return o.pred?`<td class="na">—</td>`:`<td><input class="gn" data-c="${k}" inputmode="decimal" value="${esc(v)}" placeholder="숫자"></td>`;
  return `<td><button class="gc v${esc(v)}" data-c="${k}">${esc(cellLab(c,v))}</button></td>`}).join('')}</tr>`).join('')}</tbody></table>`}
function wireG(store,save,G){document.querySelectorAll('button.gc[data-c]').forEach(b=>b.onclick=()=>{const k=b.dataset.c;const c=G.cols[+k.split('_')[1]];const n=nextV(c,store[k]||'');store[k]=n;save();b.className='gc v'+n;b.textContent=cellLab(c,n)});
 document.querySelectorAll('input.gn[data-c]').forEach(inp=>inp.oninput=()=>{store[inp.dataset.c]=inp.value.replace(/[^0-9.]/g,'');save()})}
function jo(w,a,b){const c=w.charCodeAt(w.length-1)-0xAC00;return w+(c>=0&&c<11172&&c%28?a:b)}
function hasData(gv){return gv&&Object.values(gv).some(x=>x!==''&&x!=null)}
/* 반 전체 집계: 보기 열은 보기별 모둠 수·많은 쪽, 측정값 열은 모둠 값 목록·가장 작은 값·가장 큰 값 */
function boardData(key){return LS.get(LK+'bd'+key,{})}
function tally(key,G){const d=boardData(key);const out={};let ng=0;for(let g=1;g<=NG();g++)if(hasData(d['g'+g]))ng++;
 G.rows.forEach((r,ri)=>G.cols.forEach((c,ci)=>{const k=ri+'_'+ci;const vals=[];for(let g=1;g<=NG();g++){const v=(d['g'+g]||{})[k];if(v!==''&&v!=null)vals.push(v)}
  if(isNum(c)){const ns=vals.map(Number).filter(x=>!isNaN(x));out[k]={num:true,list:ns,min:ns.length?Math.min(...ns):null,max:ns.length?Math.max(...ns):null,sum:Math.round(ns.reduce((a,b)=>a+b,0)*100)/100,n:ns.length,split:false,maj:''};return}
  const cnt={};vals.forEach(v=>cnt[v]=(cnt[v]||0)+1);const ks=Object.keys(cnt);let maj='';if(ks.length){const mx=Math.max(...ks.map(x=>cnt[x]));const top=ks.filter(x=>cnt[x]===mx);maj=top.length===1?top[0]:'tie'}
  out[k]={cnt,n:vals.length,maj,split:ks.length>1}}));return {cells:out,ng}}
/* 🧭 실험 설계: 질문마다 카드를 고르고 '생각 확인하기'로 까닭을 봐요 */
R.design=(s,id)=>{const sel=LS.get(LK+id+'sel',{});
 $('body').innerHTML=s.parts.map((p,pi)=>`<div class="dpart"><div class="dq">${esc(p.q)}</div><div class="dcards">${p.items.map((it,ii)=>{const k=pi+'_'+ii;return `<button class="dc" aria-pressed="${sel[k]?'true':'false'}" data-k="${k}">${it.svg?`<span class="dsv">${it.svg}</span>`:''}${esc(it.x)}</button>`}).join('')}</div><div class="dfb" id="dfb${pi}"></div></div>`).join('')+`<p class="dwhy" id="dwhy"></p>`
 +`<div class="row-c"><button class="big-btn" id="dChk" style="font-size:clamp(18px,1.7vw,23px);padding:6px 22px">🔎 ${esc(s.btn||'생각 확인하기')}</button></div>${s.col?`<div class="cols wrap" style="--n:1">${col(id+'z',s.col,'#2F74E0','',{ph:s.colph||'생각을 써요'})}</div>`:''}`;
 let checked=false;const strip=w=>(w||'').replace(/\s*\([^()]*쪽\)\s*$/,'');
 document.querySelectorAll('.dc').forEach(b=>b.onclick=()=>{const [pi,ii]=b.dataset.k.split('_').map(Number);
  if(checked){const it=s.parts[pi].items[ii];$('dwhy').innerHTML=`💬 <b>${esc(it.x)}</b> — ${esc(strip(it.w))}`;$('dwhy').classList.add('on');return}
  const on=b.getAttribute('aria-pressed')!=='true';b.setAttribute('aria-pressed',on);sel[b.dataset.k]=on;LS.set(LK+id+'sel',sel)});
 $('dChk').onclick=()=>{checked=true;$('dChk').textContent='🔁 다시 고르기';$('dChk').onclick=()=>R.design(s,id);s.parts.forEach((p,pi)=>{const msgs=[];p.items.forEach((it,ii)=>{const on=!!sel[pi+'_'+ii];const b=document.querySelector(`.dc[data-k="${pi}_${ii}"]`);b.classList.remove('good','bad','miss');
   if(on&&it.ok===true)b.classList.add('good');if(on&&it.ok===false)b.classList.add('bad');if(!on&&it.ok===true&&!p.free)b.classList.add('miss');
   if(((on&&it.ok!==true)||(!on&&it.ok===true&&!p.free))&&it.w)msgs.push(`<li class="${on?(it.ok===false?'bad':'good'):'miss'}">${on?(it.ok===false?'🤔':'👍'):'➕'} <b>${esc(it.x)}</b> — ${esc(strip(it.w))}</li>`)});
  $('dfb'+pi).innerHTML=msgs.length?`<ul>${msgs.join('')}</ul>`:'<ul><li class="good">👍 잘 골랐어요!</li></ul>';$('dfb'+pi).classList.add('on')});$('dwhy').innerHTML='💬 카드를 누르면 그 까닭이 여기에 나와요.';$('dwhy').classList.add('on')};
 if(s.col)wireCols([id+'z'])};
/* 🔮 예상 표: 칸을 눌러 예상을 골라요(누를 때마다 바뀜). 측정값 열은 비워 두고, 까닭은 붙임쪽지로 */
R.pgrid=(s,id)=>{const G=GDEF[s.g];const v=LS.get(LK+'pg'+s.g,{});const c0=G.cols.find(c=>!isNum(c));const o0=c0?opts(c0):[];
 $('body').innerHTML=`<div class="gwrap"><div>${gTable(G,v,{pred:1})}${c0?`<p class="tnote2">칸을 누를 때마다 ${o0.map(x=>'‘'+esc(x.t)+'’').join(' → ')} → 처음으로 바뀌어요.</p>`:''}</div><div class="cols" style="--n:1">${col('pg'+s.g+'r',`💡 그렇게 ${G.pl?esc(G.pl)+'한':'예상한'} 까닭`,'#2F74E0','',{ph:s.ph||'왜냐하면 ~ 때문이에요.'})}</div></div>${s.tip?`<div class="tip">💡 ${esc(s.tip)}</div>`:''}`;
 wireG(v,()=>LS.set(LK+'pg'+s.g,v),G);wireCols(['pg'+s.g+'r'])};
/* 📊 우리 반 자료판: 모둠마다 결과를 넣고, '반 전체'에서 모아 봐요 */
function sumCell(c,t){
 if(t.num){if(!t.n)return '<span class="cnt">—</span>';const W=Math.max(1,...[t.max]);return `<div class="nlist">${t.list.map(x=>`<span>${x}</span>`).join('')}</div><div class="cnt">${c.sum?`모두 더하면 <b class="m">${t.sum}${esc(c.unit||'')}</b> · `:''}가장 작은 값 <b>${t.min}</b> · 가장 큰 값 <b>${t.max}</b>${esc(c.unit||'')}</div>`}
 if(!t.n)return '<span class="cnt">—</span>';const os=opts(c);const pal=['#2F74E0','#B08B6E','#1F9E63','#E8961E','#6A4FC9'];
 return `<div class="bar">${os.map((o,i)=>t.cnt[o.v]?`<span style="flex:${t.cnt[o.v]};background:${pal[i%pal.length]}"></span>`:'').join('')}</div><div class="cnt">${os.map(o=>`<b class="${t.maj===o.v?'m':''}">${esc(o.t)} ${t.cnt[o.v]||0}</b>`).join(' · ')}${t.split?' ⚠️':''}</div>`}
R.board=(s,id)=>{const G=GDEF[s.g];const d=boardData(s.g);let cur=LS.get(LK+id+'cur','g1');
 const draw=()=>{const tabs=[...Array(NG())].map((_,i)=>{const g='g'+(i+1);const has=hasData(d[g]);return `<button class="bt ${cur===g?'on':''} ${has?'has':''}" data-g="${g}">${i+1}모둠${has?' ✓':''}</button>`}).join('')+`<button class="bt all ${cur==='all'?'on':''}" data-g="all">📊 반 전체</button>`;
  let main;
  if(cur==='all'){const T=tally(s.g,G);
   main=`<table class="rec gt sum"><thead><tr><th>${esc(G.corner||'')}</th>${G.cols.map(c=>`<th>${esc(c.n)}</th>`).join('')}</tr></thead><tbody>${G.rows.map((r,ri)=>`<tr><th>${rowHead(r)}</th>${G.cols.map((c,ci)=>{const t=T.cells[ri+'_'+ci];return `<td class="${t.split?'spl':''}">${sumCell(c,t)}</td>`}).join('')}</tr>`).join('')}</tbody></table>
   <p class="tnote2">결과를 넣은 모둠: ${T.ng} / ${NG()}${G.cols.some(c=>!isNum(c))?' · 굵은 글씨가 더 많은 모둠의 결과예요. ⚠️ 표시는 모둠마다 결과가 달랐던 칸이에요.':''}${G.cols.some(isNum)?' · 숫자 칸은 모둠마다 잰 값이에요.':''}</p>`}
  else{d[cur]=d[cur]||{};main=gTable(G,d[cur])+`<p class="tnote2">${esc(cur.slice(1))}모둠의 결과대로 ${G.cols.some(c=>!isNum(c))?'칸을 눌러요(누를 때마다 바뀌어요)':''}${G.cols.some(isNum)?(G.cols.some(c=>!isNum(c))?', ':'')+'숫자 칸에는 잰 값을 써요':''}.</p>`}
  $('body').innerHTML=`<div class="btabs">${tabs}</div>${main}${s.after?`<div class="after wrap">💬 ${esc(s.after)}</div>`:''}`;
  document.querySelectorAll('.bt').forEach(b=>b.onclick=()=>{cur=b.dataset.g;LS.set(LK+id+'cur',cur);draw()});
  if(cur!=='all')wireG(d[cur],()=>{LS.set(LK+'bd'+s.g,d);const t=document.querySelector(`.bt[data-g="${cur}"]`);if(t)t.classList.toggle('has',hasData(d[cur]))},G)};
 draw()};
/* ⚖️ 예상과 우리 반 결과 (측정값 열은 비교하지 않고 '—') */
R.gcmp=(s,id)=>{const G=GDEF[s.g];const PL=esc(G.pl||'예상'),RL=esc(G.rl||'결과');const p=LS.get(LK+'pg'+s.g,{});const T=tally(s.g,G);let same=0,n=0;const diffs=[],splits=[];
 const tb=`<table class="rec gt cmp"><thead><tr><th>${esc(G.corner||'')}</th>${G.cols.map(c=>`<th>${esc(c.n)}</th>`).join('')}</tr></thead><tbody>${G.rows.map((r,ri)=>`<tr><th>${rowHead(r)}</th>${G.cols.map((c,ci)=>{const k=ri+'_'+ci;const t=T.cells[k];
   if(isNum(c))return `<td class="na">${t.n?`${t.min}~${t.max}${esc(c.unit||'')}${c.sum?` (모두 ${t.sum}${esc(c.unit||'')})`:''}`:'—'}</td>`;
   const pv=p[k]||'';const rv=t.maj&&t.maj!=='tie'?t.maj:'';
   if(pv&&rv){n++;if(pv===rv)same++;else diffs.push(r.n+' · '+c.n)}if(t.split)splits.push(r.n+' · '+c.n);
   const st=pv&&rv?(pv===rv?'eq':'ne'):'';return `<td class="${st}"><span class="pp">${esc(pv?cellLab(c,pv):'?')}</span> → <b class="rr">${esc(rv?cellLab(c,rv):(t.maj==='tie'?'반반':'?'))}</b>${t.split?' ⚠️':''}</td>`}).join('')}</tr>`).join('')}</tbody></table>`;
 $('body').innerHTML=`${tb}<p class="tnote2">${n?`${jo(PL,'과','와')} ${jo(RL,'을','를')} 견줄 수 있는 ${n}칸 중 <b>${same}칸</b>이 같았어요.`:`${PL} 표와 우리 반 자료판을 채우면 여기에서 견주어 볼 수 있어요.`} 칸 글자는 ‘${PL} → ${G.rl?RL:'반 전체 결과'}’예요.</p>
 <div class="cols wrap" style="--n:2">${col(id+'a',`⚖️ ${jo(PL,'과','와')} 달랐던 칸, 왜 그랬을까?`,'#E8961E',diffs.length?'달랐던 칸: '+diffs.join(', '):'',{ph:s.f?.[0]||`~은 ${jo(PL,'과','와')} 달랐어요. 왜냐하면 ~`})}${col(id+'b','⚠️ 모둠마다 결과가 달랐던 칸, 왜 그랬을까?','#E0506B',splits.length?'달랐던 칸: '+splits.join(', '):'',{ph:s.f?.[1]||'모둠마다 ~이 달랐을 것 같아요.'})}</div>${s.after?`<div class="after wrap">💬 ${esc(s.after)}</div>`:''}`;
 wireCols([id+'a',id+'b'],[id+'b'])};
/* ✍️ 근거로 결론: 우리 반 자료판(또는 s.evs 목록)에서 근거를 골라 결론 문장을 써요 */
R.claim=(s,id)=>{const ev=[];
 if(s.g){const G=GDEF[s.g];const T=tally(s.g,G);
  G.cols.forEach((c,ci)=>{const pre=c.ev?c.ev+' ':'';
   if(isNum(c)){const rs=G.rows.map((r,ri)=>({r,t:T.cells[ri+'_'+ci]})).filter(x=>x.t.n);rs.forEach(x=>ev.push(`${x.r.n}: ${pre}${x.t.min===x.t.max?x.t.min:x.t.min+'~'+x.t.max}${c.unit||''}${c.sum&&x.t.n>1?` (우리 반 모두 더하면 ${x.t.sum}${c.unit||''})`:''}`));return}
   const by={};const ties=[];G.rows.forEach((r,ri)=>{const t=T.cells[ri+'_'+ci];const tag=t.split?`(모둠마다 달랐어요 ${opts(c).map(o=>t.cnt[o.v]||0).join(':')})`:'';if(t.maj==='tie')ties.push(r.n);else if(t.maj)(by[t.maj]=by[t.maj]||[]).push(r.n+tag)});
   opts(c).forEach(o=>{if(by[o.v])ev.push(`${by[o.v].join(', ')}: ${pre}${o.t}`)});if(ties.length)ev.push(`${ties.join(', ')}: ${c.n} 모둠마다 반반이에요`)})}
 (s.evs||[]).forEach(e=>ev.push(e));
 const sv=LS.get(LK+id+'c',{e:'',c:''});
 $('body').innerHTML=`<div class="evbox"><b>📊 ${esc(s.evTitle||'우리 반 자료판에서 찾은 근거')}</b> <small>(누르면 근거 칸에 들어가요)</small><div class="chips">${ev.length?ev.map(e=>`<button class="chip" aria-pressed="false">${esc(e)}</button>`).join(''):'<span class="ask">자료판에 결과를 넣으면 여기에 근거가 나와요.</span>'}</div></div>
 <div class="claim"><label><span>📑 근거: ${esc(s.f1||'우리 반 자료를 보니')}</span><textarea id="ce" rows="2" placeholder="자료판에서 본 결과를 써요.">${esc(sv.e)}</textarea></label><label><span>✍️ 결론: ${esc(s.f2||'그래서')}</span><textarea id="cc" rows="2" placeholder="${esc(s.ph||'~을 알 수 있어요.')}">${esc(sv.c)}</textarea></label></div>
 <button class="big-btn" id="dShow" style="font-size:clamp(18px,1.7vw,23px);padding:6px 22px">📖 ${esc(s.btn||'교과서 문장과 비교하기')}</button>
 <div class="book" id="book"><small>${esc(s.bookLabel||'교과서 문장')} (${esc(s.src)})</small><br><b>${s.book}</b></div>
 <div class="cols after-book" id="abk" style="--n:2">${col(id+'s','🤝 우리 결론과 같은 점','#1F9E63','',{ph:'우리 결론과 ~이 같아요.'})}${col(id+'n','✨ 더 알게 된 점','#2F74E0','',{ph:'~을 새로 알았어요.'})}</div>`;
 const save=()=>LS.set(LK+id+'c',{e:$('ce').value,c:$('cc').value});$('ce').oninput=$('cc').oninput=save;
 document.querySelectorAll('.evbox .chip').forEach(c=>c.onclick=()=>{c.setAttribute('aria-pressed','true');$('ce').value=($('ce').value?$('ce').value+' / ':'')+c.textContent;save()});
 $('dShow').onclick=()=>{const eb=document.querySelector('.evbox');if(eb)eb.style.display='none';$('book').classList.add('on');$('abk').classList.add('on');$('dShow').style.display='none'};wireCols([id+'s',id+'n'])};
