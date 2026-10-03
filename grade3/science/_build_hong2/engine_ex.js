
/* 사고전략 예시 문장 — 단계에 ex: [[이름표, 문장], …] (또는 문장만)을 두면
   사고전략 배지 옆에 '💡 예시 보기' 단추가 생기고, 누르면 안내 줄 아래에 예시 3개가 펼쳐집니다. */
(function(){const head=document.querySelector('#lesson .sthead');if(!head)return;
 const b=document.createElement('button');b.className='exbtn';b.id='exBtn';b.type='button';b.textContent='💡 예시 보기';b.setAttribute('aria-expanded','false');b.hidden=true;head.append(b);
 const box=document.createElement('div');box.className='exbox';box.id='exBox';box.hidden=true;$('ask').after(box);
 b.onclick=()=>{const on=box.hidden;box.hidden=!on;b.setAttribute('aria-expanded',on?'true':'false');b.classList.toggle('on',on)};
 const r0=render;render=function(){r0();const s=C.steps[step];const ex=s.ex||[];b.hidden=!ex.length;box.hidden=true;b.classList.remove('on');b.setAttribute('aria-expanded','false');
  box.innerHTML=ex.length?`<p class="exh">💡 이렇게 써 볼 수 있어요</p><ol>${ex.map(e=>Array.isArray(e)?`<li><b>${esc(e[0])}</b> ${esc(e[1])}</li>`:`<li>${esc(e)}</li>`).join('')}</ol><p class="exf">그대로 베끼지 말고, 내가 보고 생각한 것으로 바꿔 써요.</p>`:''}})();
/* 칸별 힌트 — 단계에 hints: [[보여요 예시 2개], [생각해요 2개], [궁금해요 2개]]를 두면
   본문 .cols 의 칸 제목 옆에 '💡 힌트' 단추가 생기고, 누르면 예시가 팝업으로 뜹니다(입력칸은 가리지 않음). */
(function(){const close=()=>document.querySelectorAll('.hintpop.on').forEach(p=>{p.classList.remove('on');const b=p.parentElement.querySelector('.hintbtn');if(b)b.setAttribute('aria-expanded','false')});
 document.addEventListener('click',e=>{if(!e.target.closest('.hintpop,.hintbtn'))close()});
 document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
 const r1=render;render=function(){r1();const s=C.steps[step];if(!s.hints)return;
  document.querySelectorAll('#body .cols .col').forEach((c,i)=>{const h=s.hints[i];const h3=c.querySelector('h3');if(!h||!h.length||!h3)return;
   const b=document.createElement('button');b.type='button';b.className='hintbtn';b.textContent='💡 힌트';b.setAttribute('aria-expanded','false');h3.append(b);
   const p=document.createElement('div');p.className='hintpop';p.setAttribute('role','dialog');p.setAttribute('aria-label',h3.textContent.replace('💡 힌트','').trim()+' 힌트');
   p.innerHTML=`<button type="button" class="hpx" aria-label="닫기">✕</button><p class="hph">이렇게 써 볼 수 있어요</p><ul>${h.map(x=>`<li>${esc(x)}</li>`).join('')}</ul><p class="hpf">내가 보고 생각한 것으로 바꿔 써요.</p>`;c.append(p);
   b.onclick=()=>{const on=!p.classList.contains('on');close();if(!on)return;p.classList.add('on');b.setAttribute('aria-expanded','true');
    /* 입력칸을 가리지 않게: 입력 줄 아래에 띄우고, 화면(본문) 아래가 모자라면 칸 제목 위로 */
    const add=c.querySelector('.add')||h3;p.style.bottom='auto';p.style.top=(add.offsetTop+add.offsetHeight+6)+'px';
    const lim=Math.min($('body').getBoundingClientRect().bottom,innerHeight);if(p.getBoundingClientRect().bottom>lim){const below=p.style.top;p.style.top='auto';p.style.bottom=(c.offsetHeight-h3.offsetTop+6)+'px';
     if(p.getBoundingClientRect().top<$('body').getBoundingClientRect().top){p.style.bottom='auto';p.style.top=below;p.scrollIntoView({block:'nearest'})}}};p.querySelector('.hpx').onclick=close})}})();
