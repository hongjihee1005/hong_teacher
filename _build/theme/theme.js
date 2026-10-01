(function(){/* 메뉴 칸마다 파스텔 색: 노랑·연두·초록·하늘·연보라·분홍·주황·파랑 */
var PAL=['#E9B730','#98C54A','#4DB283','#55B2E0','#9F86E3','#E784AF','#F0985A','#5C8EE6'];
document.querySelectorAll('main .grid').forEach(function(g){var i=0;[].forEach.call(g.children,function(c){var a=c.matches('a.card.room')?c:c.querySelector(':scope>a.card.room');if(!a)return;
 var col=PAL[i++%PAL.length];a.style.setProperty('--acc',col);if(c!==a)c.style.setProperty('--acc',col);
 var sub=c.querySelector('.r-sub');if(sub){var j=0;sub.querySelectorAll('.r-item').forEach(function(r){r.style.setProperty('--acc',PAL[j++%PAL.length])})}})});
var ts=document.querySelector('.ts-main');if(ts){ts.style.setProperty('--acc',PAL[0]);['#55B2E0','#9F86E3','#E784AF','#4DB283'].forEach(function(c,k){var ch=document.querySelectorAll('.ts-chip')[k];if(ch)ch.style.setProperty('--acc',c)})}
})();
(function(){var q=function(s){return document.querySelectorAll(s)};
q('.tag[style],.legend span[style]').forEach(function(e){var b=e.style.backgroundColor||e.style.background;if(b){e.style.setProperty('--acc',b);e.style.background='';e.style.color=''}});})();
(function(){var tg=[].slice.call(document.querySelectorAll('.r-tg'));if(!tg.length)return;
function close(ex){tg.forEach(function(b){if(b!==ex&&b.getAttribute('aria-expanded')==='true'){b.setAttribute('aria-expanded','false');document.getElementById(b.getAttribute('aria-controls')).hidden=true;b.closest('.rw').classList.remove('open')}})}
tg.forEach(function(b){b.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();var o=b.getAttribute('aria-expanded')==='true';close(b);
 b.setAttribute('aria-expanded',o?'false':'true');document.getElementById(b.getAttribute('aria-controls')).hidden=o;b.closest('.rw').classList.toggle('open',!o)})});
document.addEventListener('click',function(e){if(!e.target.closest('.rw'))close()});
document.addEventListener('keydown',function(e){if(e.key==='Escape')close()});})();
(function(){/* 단원 제목만 보이고, 누르면 그 단원 자료가 펼쳐짐 */
var hs=[].slice.call(document.querySelectorAll('main h2, main h3.unit')).filter(function(h){return /^[^0-9가-힣A-Za-z]*\d+\s*단원/.test(h.textContent.trim())});
var CH='<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>';
hs.forEach(function(h,i){var items=[],n=h.nextElementSibling;
 while(n&&!/^H[23]$/.test(n.tagName)&&!(n.classList&&(n.classList.contains('unit')||n.classList.contains('ugrp')||n.classList.contains('hjfoot')))){items.push(n);n=n.nextElementSibling}
 var cnt=0;items.forEach(function(e){cnt+=e.querySelectorAll('a.card').length});if(!cnt)return;
 var id='ub'+i;items.forEach(function(e){e.hidden=true;e.setAttribute('data-ub',id)});
 h.classList.add('u-toggle');h.setAttribute('role','button');h.setAttribute('tabindex','0');h.setAttribute('aria-expanded','false');
 var old=h.querySelector('small');if(old)old.remove();
 h.insertAdjacentHTML('beforeend','<span class="u-cnt">'+cnt+'개</span><span class="u-chev">'+CH+'</span>');
 function t(){var o=h.getAttribute('aria-expanded')==='true';h.setAttribute('aria-expanded',o?'false':'true');items.forEach(function(e){e.hidden=o})}
 h.addEventListener('click',t);h.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();t()}});});
})();
(function(){/* 단원 단추로 한 단원만 고르면 그 단원을 바로 펼침 */
document.querySelectorAll('.ubtn').forEach(function(b){b.addEventListener('click',function(){if(b.dataset.u==='0')return;
 var pane=b.closest('.pane')||document;setTimeout(function(){pane.querySelectorAll('.ugrp[data-u="'+b.dataset.u+'"] .u-toggle[aria-expanded="false"]').forEach(function(t){t.click()})},0)})});})();
