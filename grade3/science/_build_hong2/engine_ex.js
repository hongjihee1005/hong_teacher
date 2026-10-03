
/* 사고전략 예시 문장 — 단계에 ex: [[이름표, 문장], …] (또는 문장만)을 두면
   사고전략 배지 옆에 '💡 예시 보기' 단추가 생기고, 누르면 안내 줄 아래에 예시 3개가 펼쳐집니다. */
(function(){const head=document.querySelector('#lesson .sthead');if(!head)return;
 const b=document.createElement('button');b.className='exbtn';b.id='exBtn';b.type='button';b.textContent='💡 예시 보기';b.setAttribute('aria-expanded','false');b.hidden=true;head.append(b);
 const box=document.createElement('div');box.className='exbox';box.id='exBox';box.hidden=true;$('ask').after(box);
 b.onclick=()=>{const on=box.hidden;box.hidden=!on;b.setAttribute('aria-expanded',on?'true':'false');b.classList.toggle('on',on)};
 const r0=render;render=function(){r0();const s=C.steps[step];const ex=s.ex||[];b.hidden=!ex.length;box.hidden=true;b.classList.remove('on');b.setAttribute('aria-expanded','false');
  box.innerHTML=ex.length?`<p class="exh">💡 이렇게 써 볼 수 있어요</p><ol>${ex.map(e=>Array.isArray(e)?`<li><b>${esc(e[0])}</b> ${esc(e[1])}</li>`:`<li>${esc(e)}</li>`).join('')}</ol><p class="exf">그대로 베끼지 말고, 내가 보고 생각한 것으로 바꿔 써요.</p>`:''}})();
