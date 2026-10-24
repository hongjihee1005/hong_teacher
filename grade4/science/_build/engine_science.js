
/* ===== 과학 탐구 단계 (홍지희 선생님 버전 · 과학) ===== */
Object.assign(ROUT,{pred:['🔮','예상하기'],lab:['🧪','실험하고 기록하기'],pvr:['⚖️','예상과 결과 비교하기']});
/* 🔮 예상하기: 결과를 예상하고 까닭을 붙임쪽지로 써요. key가 같으면 뒤의 '예상과 결과 비교' 단계에서 불러와요. */
R.pred=(s,id)=>{const k=s.key||'P1';const f=s.f||[];
 $('body').innerHTML=`${s.q?`<div class="after wrap" style="font-size:clamp(19px,1.9vw,25px)">🔮 ${esc(s.q)}</div>`:''}${s.opts?`<div class="chips">${s.opts.map(o=>`<button class="chip" aria-pressed="false" data-o="${esc(o)}">${esc(o)}</button>`).join('')}</div>`:''}
 <div class="cols wrap" style="--n:2">${col('pr'+k+'a','🔮 내 예상','#6A4FC9',f[0]||'~될 것 같아요.')}${col('pr'+k+'b','💡 그렇게 생각한 까닭','#2F74E0',f[1]||'왜냐하면 ~ 때문이에요.')}</div>${s.tip?`<div class="tip">💡 ${esc(s.tip)}</div>`:''}`;
 document.querySelectorAll('.chip[data-o]').forEach(c=>c.onclick=()=>{const inp=$('i-pr'+k+'a');inp.value=c.dataset.o;inp.focus()});
 wireCols(['pr'+k+'a','pr'+k+'b'])};
/* 🧪 실험하고 기록하기: 실험 순서 점검 + 안전 약속 + 결과 기록표 + (선택) 가상 실험실 단추 */
R.lab=(s,id)=>{const st=LS.get(LK+id+'t',[]);const tb=LS.get(LK+id+'tb',{});const T=s.table;
 const safe=s.safe?`<div class="safe">⚠️ ${s.safe.map(esc).join('<br>⚠️ ')}</div>`:'';
 const link=s.link?`<p class="labl2"><a class="ghost labgo" href="${s.link.href}" target="_blank" rel="noopener">🖥️ ${esc(s.link.label||'가상 실험실 열기')}</a> <small>${esc(s.link.note||'준비물이 없거나 다시 볼 때 써요.')}</small></p>`:'';
 const tbl=T?`<table class="rec"><thead><tr><th>${esc(T.corner||'')}</th>${T.cols.map(c=>`<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${T.rows.map((r,ri)=>`<tr><th>${esc(r)}</th>${T.cols.map((c,ci)=>`<td><input data-c="${ri}_${ci}" value="${esc(tb[ri+'_'+ci]||'')}" placeholder="${esc((T.ph&&T.ph[ci])||'')}"></td>`).join('')}</tr>`).join('')}</tbody></table>${T.note?`<p class="tnote2">${esc(T.note)}</p>`:''}`:'';
 $('body').innerHTML=`<div class="labwrap"><div class="labl"><div class="task">${s.list.map((t,i)=>`<label class="${st[i]?'done':''}"><input type="checkbox" data-t="${i}" ${st[i]?'checked':''}> ${esc(t)}</label>`).join('')}</div>${safe}</div><div class="labr">${tbl}${link}</div></div>`;
 document.querySelectorAll('[data-t]').forEach(c=>c.onchange=()=>{st[+c.dataset.t]=c.checked;LS.set(LK+id+'t',st);c.parentElement.classList.toggle('done',c.checked)});
 document.querySelectorAll('table.rec input').forEach(inp=>inp.oninput=()=>{tb[inp.dataset.c]=inp.value;LS.set(LK+id+'tb',tb)})};
/* ⚖️ 예상과 결과 비교: 앞에서 쓴 예상을 불러와 실제 결과와 견줘요 */
R.pvr=(s,id)=>{const k=s.key||'P1';const pa=LS.get(LK+'pr'+k+'a',[]),pb=LS.get(LK+'pr'+k+'b',[]);const f=s.f||[];
 $('body').innerHTML=`<div class="prev wrap"><b>🔮 우리가 한 예상</b> ${pa.length?pa.map(x=>`<span class="pv">${esc(x)}</span>`).join(''):'<span class="ask" style="display:inline">(예상하기 단계에서 쓴 쪽지가 여기에 나와요)</span>'}${pb.length?`<br><b>💡 까닭</b> ${pb.map(x=>`<span class="pv">${esc(x)}</span>`).join('')}`:''}</div>
 <div class="cols wrap" style="--n:3">${col(id+'a','📋 실제 결과','#1F9E63',f[0]||'실험해 보니 ~했어요.')}${col(id+'b','⚖️ 예상과 같은 점·다른 점','#E8961E',f[1]||'예상과 ~이 같았어요/달랐어요.')}${col(id+'c','🤔 왜 그럴까?','#E0506B',f[2]||'그 까닭은 ~인 것 같아요.')}</div>${s.after?`<div class="after wrap">💬 ${esc(s.after)}</div>`:''}`;
 wireCols([id+'a',id+'b',id+'c'],[id+'c'])};
