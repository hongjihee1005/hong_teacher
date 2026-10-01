/* hj-cicons · 수업 자료의 이모지 단추 아이콘을 깔끔한 선 아이콘으로 바꿈 (앱이 글자를 바꿔도 다시 적용) */
(function(){
var I={house:'<path d="M3.5 10.5 12 3.8l8.5 6.7"/><path d="M5.5 9.2V20h13V9.2"/><path d="M10 20v-5.5h4V20"/>',
guide:'<path d="M2.5 5h6a3.5 3.5 0 0 1 3.5 3.5V20a2.5 2.5 0 0 0-2.5-2.5h-7z"/><path d="M21.5 5h-6A3.5 3.5 0 0 0 12 8.5V20a2.5 2.5 0 0 1 2.5-2.5h7z"/>',
vol:'<path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/>',
vol1:'<path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/>',
mute:'<path d="M11 5 6 9H3v6h3l5 4z"/><path d="m22 9-6 6"/><path d="m16 9 6 6"/>',
full:'<path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/>',
speed:'<path d="M12 14l4-4"/><path d="M3.3 19a10 10 0 1 1 17.4 0"/>',
list:'<path d="M9 6h12"/><path d="M9 12h12"/><path d="M9 18h12"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/>',
clip:'<rect x="8" y="2.5" width="8" height="4" rx="1"/><path d="M16 4.5h2a2 2 0 0 1 2 2V20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6.5a2 2 0 0 1 2-2h2"/>',
file:'<path d="M14 2.5H6.5a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V8z"/><path d="M14 2.5V8h5.5"/><path d="M8.5 13h7"/><path d="M8.5 17h7"/>',
layers:'<path d="m12 2.5 9.5 5-9.5 5-9.5-5z"/><path d="m2.5 12 9.5 5 9.5-5"/><path d="m2.5 16.5 9.5 5 9.5-5"/>',
msg:'<path d="M21 14.5a2 2 0 0 1-2 2H8l-5 4.5V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
dice:'<rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="8.5" cy="8.5" r="1.2" fill="currentColor"/><circle cx="15.5" cy="15.5" r="1.2" fill="currentColor"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/>',
timer:'<circle cx="12" cy="13.5" r="7.5"/><path d="M12 10v3.5l2 2"/><path d="M9.5 2.5h5"/>',
bulb:'<path d="M9 18h6"/><path d="M10 21.5h4"/><path d="M12 2.5a6.5 6.5 0 0 0-4 11.6c.7.6 1 1.4 1 2.4h6c0-1 .3-1.8 1-2.4a6.5 6.5 0 0 0-4-11.6z"/>',
eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
eyeoff:'<path d="M3 3l18 18"/><path d="M10.6 5.1A10 10 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3 3.9"/><path d="M6.6 6.6A17 17 0 0 0 2 12s3.5 7 10 7a9.6 9.6 0 0 0 5.4-1.6"/>',
print:'<path d="M6 9V3h12v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M6 14h12v7H6z"/>',
erase:'<path d="m7 21-4-4 11-11 7 7-8 8z"/><path d="M14 21h7"/>',
mic:'<rect x="9" y="2.5" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v3.5"/>',
x:'<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
rewind:'<path d="M19 20 9 12l10-8z"/><path d="M5 19V5"/>',
pencil:'<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
book:'<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/>',
copy:'<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
refresh:'<path d="M3 12a9 9 0 0 1 15.5-6.3L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15.5 6.3L3 16"/><path d="M3 21v-5h5"/>',
left:'<path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>',right:'<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>'};
var LEAD=[['👩‍🏫','guide'],['🧑‍🏫','guide'],['👨‍🏫','guide'],['🏠','house'],['🔊','vol'],['🔈','vol1'],['🔉','vol1'],['🔇','mute'],['⛶','full'],['🐢','speed'],['🐇','speed'],['🐰','speed'],
 ['📋','clip'],['📰','file'],['📜','layers'],['💬','msg'],['🎲','dice'],['⏱','timer'],['💡','bulb'],['👀','eye'],['🙈','eyeoff'],['🖨','print'],['🧽','erase'],['🎙','mic'],
 ['✖','x'],['✕','x'],['⏮','rewind'],['✏','pencil'],['📖','book'],['🔄','refresh'],['↻','refresh'],['←','left'],['◀','left']];
var LBL={house:'수업 첫 화면',vol:'소리',vol1:'소리',mute:'소리 끔',full:'전체 화면',x:'닫기'};
function svg(n){var s=document.createElementNS('http://www.w3.org/2000/svg','svg');s.setAttribute('viewBox','0 0 24 24');s.setAttribute('class','hj-i');s.setAttribute('aria-hidden','true');
 s.setAttribute('fill','none');s.setAttribute('stroke','currentColor');s.setAttribute('stroke-width','2');s.setAttribute('stroke-linecap','round');s.setAttribute('stroke-linejoin','round');s.innerHTML=I[n];return s}
function fix(el){if(!el||el.id==='hj-home'||el.closest('.hj-contact'))return;
 var t=el.firstChild;while(t&&t.nodeType===3&&!t.nodeValue.trim())t=t.nextSibling;
 if(t&&t.nodeType===3){var v=t.nodeValue.replace(/^\s+/,'');
  for(var i=0;i<LEAD.length;i++){var e=LEAD[i][0];if(v.indexOf(e)===0){var n=LEAD[i][1],rest=v.slice(e.length).replace(/^[️‍\s]+/,'');
   if(n==='house'&&/^목록/.test(rest))n='list';
   t.nodeValue=rest;el.insertBefore(svg(n),t);el.classList.add('hj-ic');
   var only=!rest.trim()&&!t.nextSibling;
   if(only){if(n==='house'&&el.closest('.tools,.topbar')){t.nodeValue='홈';el.classList.add('hj-hometool');el.title=el.title||'수업 첫 화면으로'}
    else{el.classList.add('hj-ionly');if(!el.getAttribute('aria-label')&&LBL[n])el.setAttribute('aria-label',LBL[n])}}
   break}}}
 var l=el.lastChild;while(l&&l.nodeType===3&&!l.nodeValue.trim())l=l.previousSibling;
 if(l&&l.nodeType===3&&/\s*(→|▶️?)\s*$/.test(l.nodeValue)){l.nodeValue=l.nodeValue.replace(/\s*(→|▶️?)\s*$/,'');el.appendChild(svg('right'));el.classList.add('hj-ic')}}
function scan(root){(root.querySelectorAll?root:document).querySelectorAll('button,a.tolist,a.tool,a.btn').forEach(fix);if(root.matches&&root.matches('button,a.tolist,a.tool,a.btn'))fix(root)}
scan(document);
var q=new Set(),raf=0;new MutationObserver(function(ms){ms.forEach(function(m){var n=m.target.nodeType===3?m.target.parentElement:m.target;if(!n)return;
 var c=n.closest&&n.closest('button,a.tolist,a.tool,a.btn');if(c)q.add(c);m.addedNodes&&m.addedNodes.forEach(function(a){if(a.nodeType===1)q.add(a)})});
 if(!raf)raf=requestAnimationFrame(function(){raf=0;var a=Array.from(q);q.clear();a.forEach(scan)})}).observe(document.body,{childList:true,subtree:true,characterData:true});
})();
/* 수업 세트 첫 화면 정리: 자료 목록은 위로, 학습 문제·수업 흐름·활동 단위는 한 판에 */
(function(){var cv=document.querySelector('#cover .cvin, #cover .inner')||(document.querySelector('#cover>.qbox')&&document.getElementById('cover'));if(!cv||cv.dataset.hj)return;cv.dataset.hj='1';cv.classList.add('hj-cv');
 var tols=cv.querySelectorAll('.tolist');if(tols.length){var top=document.createElement('div');top.className='hj-cvtop';Array.prototype.slice.call(tols).reverse().forEach(function(t){top.appendChild(t)});cv.insertBefore(top,cv.firstChild)}
 var parts=Array.prototype.filter.call(cv.children,function(e){return e.matches('.qbox,.bq,.goalbox,.map,.stagebar,.plan')||(e.classList.contains('row')&&e.querySelector('.row-label'))});
 if(!parts.length)return;var panel=document.createElement('div');panel.className='hj-cvpanel';parts[0].parentNode.insertBefore(panel,parts[0]);
 parts.forEach(function(p){if(p.matches('.stagebar,.plan')){var f=document.createElement('div');f.className='hj-field';f.innerHTML='<span class="hj-flabel">수업 흐름</span>';panel.appendChild(f);f.appendChild(p)}
  else if(p.classList.contains('row')){p.classList.add('hj-field');var l=p.querySelector('.row-label');if(l)l.classList.add('hj-flabel');panel.appendChild(p)}
  else panel.appendChild(p)});
 var acts=Array.prototype.find.call(cv.children,function(e){return e.classList.contains('row')&&e.querySelector('.big-btn')});if(acts)acts.classList.add('hj-cvacts');
})();
