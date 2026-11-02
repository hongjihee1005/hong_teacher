
/* 사고전략 칸별 예시 — 단계의 hintLabel('예시' 기본·'힌트'·'도움')이 단추 이름. 단계에 hints: [[첫째 칸 예시 2개], [둘째 칸 2개], …]를 두면
   본문의 쓰는 칸(뜻 만들기 빈칸 .frameline, .col, 근거로 결론의 .claim label)에 화면 순서대로 '💡 예시' 단추가 생기고,
   누르면 예시가 팝업으로 뜹니다(입력칸은 가리지 않음). 빈 목록([])인 칸은 건너뜁니다. */
(function(){const close=()=>document.querySelectorAll('.hintpop.on').forEach(p=>{p.classList.remove('on');const b=p.parentElement.querySelector('.hintbtn');if(b)b.setAttribute('aria-expanded','false')});
 document.addEventListener('click',e=>{if(!e.target.closest('.hintpop,.hintbtn'))close()});
 document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
 const LBL={'예시':['이렇게 써 볼 수 있어요','내가 보고 생각한 것으로 바꿔 써요.'],'힌트':['이렇게 생각해 봐요','힌트를 보고 내 말로 써요.'],'도움':['이렇게 써 보면 좋아요','차례대로 생각하며 내 말로 써요.']};
 const r1=render;render=function(){r1();const s=C.steps[step];if(!s.hints)return;const lb=s.hintLabel||'예시',lt=LBL[lb]||LBL['예시'];
  document.querySelectorAll('#body .frameline, #body .col, #body .claim label').forEach((c,i)=>{const h=s.hints[i];const fl=c.classList.contains('frameline');const hd=fl?c:c.querySelector(':scope>h3, :scope>span');if(!h||!h.length||!hd)return;
   const inp=c.querySelector(':scope>.add')||[...c.querySelectorAll('textarea,input')].pop()||hd;
   if(!fl){const w=document.createElement('span');w.className='hintt';while(hd.firstChild)w.append(hd.firstChild);hd.append(w)} /* 제목 글자를 한 덩어리로 묶어 줄바꿈이 흩어지지 않게(덮개 content.js가 나중에 글자를 조각내도 그 안에서만) */
   const b=document.createElement('button');b.type='button';b.className='hintbtn';b.textContent='💡 '+lb;b.setAttribute('aria-expanded','false');hd.append(b);
   const p=document.createElement('div');p.className='hintpop';p.setAttribute('role','dialog');p.setAttribute('aria-label',hd.textContent.replace('💡 '+lb,'').trim()+' '+lb);
   p.innerHTML=`<button type="button" class="hpx" aria-label="닫기">✕</button><p class="hph">${lt[0]}</p><ul>${h.map(x=>`<li>${esc(x)}</li>`).join('')}</ul><p class="hpf">${lt[1]}</p>`;c.append(p);
   b.onclick=e=>{e.preventDefault();const on=!p.classList.contains('on');close();if(!on)return;p.classList.add('on');b.setAttribute('aria-expanded','true');
    /* 입력칸 아래에 띄우고, 본문 아래가 모자라면 칸 제목 위로, 위도 모자라면 아래에 두고 그 자리로 굴림 */
    const top=c.getBoundingClientRect().top,ib=inp.getBoundingClientRect(),hb=hd.getBoundingClientRect(),body=$('body').getBoundingClientRect();
    p.style.bottom='auto';p.style.top=(ib.bottom-top+6)+'px';
    if(p.getBoundingClientRect().bottom>Math.min(body.bottom,innerHeight)){p.style.top='auto';p.style.bottom=(c.getBoundingClientRect().bottom-hb.top+6)+'px';
     if(p.getBoundingClientRect().top<body.top){p.style.bottom='auto';p.style.top=(ib.bottom-top+6)+'px';p.scrollIntoView({block:'nearest'})}}};
   p.querySelector('.hpx').onclick=close})}})();
