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
/* 이모지를 단색 아이콘 글꼴(HJ Emoji)로: 컬러 입체 그림 대신 차분한 한 가지 모양 */
(function(){var RX=/\p{Extended_Pictographic}(?:️|‍\p{Extended_Pictographic}|[\u{1F3FB}-\u{1F3FF}])*️?|[\u{1F1E6}-\u{1F1FF}]{2}/gu;
var SKIP='script,style,svg,textarea,select,option,title,canvas,.hj-em,.hj-contact,[contenteditable]';
function wrap(root){if(!root)return;if(root.nodeType===3){root=root.parentNode;if(!root)return}
 if(root.nodeType!==1||root.closest(SKIP))return;
 var w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:function(n){var p=n.parentNode;if(!p||p.closest(SKIP))return 2;RX.lastIndex=0;return RX.test(n.nodeValue)?1:2}}),a=[],n;
 while(n=w.nextNode())a.push(n);
 a.forEach(function(t){var v=t.nodeValue,f=document.createDocumentFragment(),last=0;RX.lastIndex=0;
  v.replace(RX,function(e,i){if(i>last)f.appendChild(document.createTextNode(v.slice(last,i)));var s=document.createElement('span');s.className='hj-em';s.textContent=e.replace(/\uFE0F/g,'');f.appendChild(s);last=i+e.length;return e});
  if(last<v.length)f.appendChild(document.createTextNode(v.slice(last)));if(t.parentNode)t.parentNode.replaceChild(f,t)})}
wrap(document.body);
var q=new Set(),raf=0;new MutationObserver(function(ms){ms.forEach(function(m){if(m.type==='characterData')q.add(m.target);else m.addedNodes.forEach(function(x){q.add(x)})});
 if(!raf)raf=requestAnimationFrame(function(){raf=0;var a=Array.from(q);q.clear();a.forEach(function(x){if(x.isConnected)wrap(x)})})}).observe(document.body,{childList:true,subtree:true,characterData:true});
})();
/* 교사 안내 창: 인쇄·PDF 저장 / 구글 문서로 복사 / 선생님께 이메일 */
(function(){var tn=document.getElementById('tn'),pn=tn&&tn.querySelector('.panel'),B=document.getElementById('tnB'),T=document.getElementById('tnT');if(!pn||!B||pn.querySelector('.hj-tbar'))return;
var I={print:'<path d="M7 8.5V3.8h10v4.7"/><rect x="3.8" y="8.5" width="16.4" height="7.5" rx="2"/><path d="M7 13.5h10v6.7H7Z"/>',
doc:'<path d="M14 3.8H7a1.8 1.8 0 0 0-1.8 1.8v12.8A1.8 1.8 0 0 0 7 20.2h10a1.8 1.8 0 0 0 1.8-1.8V8.6Z"/><path d="M14 3.8v4.8h4.8M9 13h6M9 16.4h4"/>',
mail:'<rect x="3.6" y="5.5" width="16.8" height="13" rx="2"/><path d="m4 7 8 6 8-6"/>'};
function ic(k){return '<svg class="hj-i" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">'+I[k]+'</svg>'}
var bar=document.createElement('div');bar.className='hj-tbar';
bar.innerHTML='<button type="button" data-a="print">'+ic('print')+'인쇄 · PDF 저장</button><button type="button" data-a="doc">'+ic('doc')+'구글 문서로</button><button type="button" data-a="mail" aria-expanded="false">'+ic('mail')+'이메일로 보내기</button>'+
 '<form class="hj-mail" hidden><label for="hjMailTo">받는 선생님 이메일 <small>여러 명은 쉼표(,)로 나눠요</small></label><input id="hjMailTo" type="email" multiple autocomplete="email" placeholder="teacher@school.kr, ..." required>'+
 '<div><button type="submit" data-s="gmail">Gmail로 쓰기</button><button type="submit" data-s="app">메일 앱으로 쓰기</button></div><p>보내기 전에 메일 쓰기 화면이 열려요. 적은 주소는 어디에도 저장하지 않아요.</p></form><p class="hj-toast" role="status" aria-live="polite"></p>';
var cl=pn.querySelector('#tnClose');(cl&&cl.closest('p')||pn.lastChild).before(bar);
var toast=bar.querySelector('.hj-toast');function say(t){toast.textContent=t;clearTimeout(say.t);say.t=setTimeout(function(){toast.textContent=''},6000)}
function title(){return (T&&T.textContent.trim()||'교사 안내')}
function lesson(){var t=document.querySelector('#cover .title');return t?t.textContent.trim():document.title}
function sub(){var l=document.querySelector('#cover .lead');return l?l.textContent.trim():''}
function url(){return /^https?:/.test(location.protocol)?location.href.split('#')[0]:''}
function html(){var c=B.cloneNode(true);c.querySelectorAll('svg,button,script').forEach(function(x){x.remove()});
 return '<h1>'+lesson()+'</h1><p>'+sub()+'</p><h2>'+title()+'</h2>'+c.innerHTML+(url()?'<p>자료 주소: <a href="'+url()+'">'+url()+'</a></p>':'')+'<p>만든 사람: 초등교사 홍지희</p>'}
function text(){return lesson()+'\n'+sub()+'\n\n['+title()+']\n\n'+B.innerText.replace(/\n{3,}/g,'\n\n').trim()+(url()?'\n\n자료 주소: '+url():'')+'\n\n만든 사람: 초등교사 홍지희'}
bar.addEventListener('click',function(e){var b=e.target.closest('button[data-a]');if(!b)return;var a=b.dataset.a;
 if(a==='print'){document.body.classList.add('hj-tprint');window.print();setTimeout(function(){document.body.classList.remove('hj-tprint')},500)}
 if(a==='doc'){var h=html(),t=text(),ok=function(){say('복사했어요. 새로 열린 구글 문서에서 Ctrl+V(맥은 ⌘+V)를 누르면 붙어요.')};
  try{if(window.ClipboardItem&&navigator.clipboard&&navigator.clipboard.write){navigator.clipboard.write([new ClipboardItem({'text/html':new Blob([h],{type:'text/html'}),'text/plain':new Blob([t],{type:'text/plain'})})]).then(ok,fb)}else fb()}catch(_){fb()}
  function fb(){var d=document.createElement('div');d.innerHTML=h;d.style.cssText='position:fixed;left:-9999px;top:0';document.body.appendChild(d);var r=document.createRange();r.selectNodeContents(d);var s=getSelection();s.removeAllRanges();s.addRange(r);
   var c=false;try{c=document.execCommand('copy')}catch(_){}s.removeAllRanges();d.remove();c?ok():say('복사가 막혀 있어요. 내용을 끌어 선택해 복사해 주세요.')}
  window.open('https://docs.new','_blank','noopener')}
 if(a==='mail'){var f=bar.querySelector('.hj-mail'),o=f.hidden;f.hidden=!o;b.setAttribute('aria-expanded',o?'true':'false');if(o)f.querySelector('input').focus()}});
bar.querySelector('.hj-mail').addEventListener('submit',function(e){e.preventDefault();var inp=this.querySelector('input');
 var to=inp.value.split(/[,;\s]+/).filter(Boolean).join(',');if(!to||!inp.checkValidity()){inp.reportValidity();return}
 var su='[교사 안내] '+lesson()+' · '+title(),bo=text(),via=(e.submitter&&e.submitter.dataset.s)||'gmail';
 if(via==='gmail'){if(bo.length>6000)bo=bo.slice(0,6000)+'\n…(나머지는 자료 주소에서 보세요)';window.open('https://mail.google.com/mail/?view=cm&fs=1&to='+encodeURIComponent(to)+'&su='+encodeURIComponent(su)+'&body='+encodeURIComponent(bo),'_blank','noopener')}
 else{if(bo.length>1500)bo=bo.slice(0,1500)+'\n…(나머지는 자료 주소에서 보세요)';location.href='mailto:'+encodeURIComponent(to).replace(/%2C/g,',')+'?subject='+encodeURIComponent(su)+'&body='+encodeURIComponent(bo)}
 say('메일 쓰기 화면을 열었어요. 내용을 확인하고 보내기를 눌러 주세요.')});
})();
/* 수업을 끝까지 마치면: 다음 차시 / 자료 목록 / 처음 화면 중에서 고르기 */
(function(){var cv=document.getElementById('cover'),mt=document.querySelector('meta[name="hj-next"]');if(!cv||!mt)return;
var act={t:0,next:false};
document.addEventListener('click',function(e){var b=e.target.closest('button,a');if(!b)return;var id=b.id||'',tx=b.textContent||'';
 act={t:Date.now(),next:/^(btnNext\d*|next)$/i.test(id)||(/다음/.test(tx)&&!b.closest('#cover'))}},true);
document.addEventListener('keydown',function(e){if(/^(ArrowRight|PageDown|Enter| )$/.test(e.key)&&!e.target.closest('input,textarea,select'))act={t:Date.now(),next:true}},true);
var was=cv.classList.contains('on');
new MutationObserver(function(){var on=cv.classList.contains('on');if(on&&!was&&act.next&&Date.now()-act.t<800)done();was=on}).observe(cv,{attributes:true,attributeFilter:['class']});
var A='<svg class="hj-i" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">';
var IC={next:A+'<path d="M5 12h14M13 6l6 6-6 6"/></svg>',list:A+'<rect x="5.2" y="5" width="13.6" height="15.2" rx="2"/><path d="M9 3.8h6v2.6H9ZM8.8 11.2h6.4M8.8 14.8h4.4"/></svg>',
 back:A+'<path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3M4.5 4.5v3.7h3.7"/></svg>',ok:'<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m8 12.3 2.7 2.7L16 9.6"/></svg>'};
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function done(){var old=document.getElementById('hj-done');if(old)old.remove();
 var nx=mt.getAttribute('content'),tl=document.querySelector('#cover .title'),lst=document.querySelector('a.tolist[href]');
 var d=document.createElement('div');d.id='hj-done';d.setAttribute('role','dialog');d.setAttribute('aria-modal','true');d.setAttribute('aria-labelledby','hjDoneT');
 d.innerHTML='<div class="hj-dp"><span class="hj-dok">'+IC.ok+'</span><h2 id="hjDoneT">수업을 마쳤어요</h2><p class="hj-dl">'+esc(tl?tl.textContent.trim():document.title)+'</p>'+
  (nx?'<a class="hj-dn" href="'+esc(nx)+'"><small>다음 차시'+(mt.dataset.tag?' · '+esc(mt.dataset.tag):'')+'</small><b>'+esc(mt.dataset.t||'다음 차시')+'</b>'+IC.next+'</a>':'<p class="hj-dlast">이 학기의 마지막 차시예요.</p>')+
  '<div class="hj-drow"><a class="hj-db" href="'+esc(lst?lst.getAttribute('href'):'index.html')+'">'+IC.list+'자료 목록으로</a><button type="button" class="hj-db" data-x>'+IC.back+'이 차시 처음 화면</button></div></div>';
 document.body.appendChild(d);d.querySelector('[data-x]').onclick=function(){d.remove()};
 d.addEventListener('click',function(e){if(e.target===d)d.remove()});
 document.addEventListener('keydown',function k(e){if(e.key==='Escape'){d.remove();document.removeEventListener('keydown',k)}});
 setTimeout(function(){(d.querySelector('.hj-dn')||d.querySelector('.hj-db')).focus()},50)}
})();
/* 교사 안내 인쇄 때 위에 차시 이름 */
(function(){var B=document.getElementById('tnB');if(!B)return;var p=document.createElement('p');p.className='hj-pl';var t=document.querySelector('#cover .title'),l=document.querySelector('#cover .lead');
 p.textContent=(t?t.textContent.trim():document.title)+(l?' · '+l.textContent.trim():'');var h=document.getElementById('tnT');(h||B).before(p)})();
/* 듣기 재생 막대: 읽어 주기·녹음 듣기 중에 일시정지 / 이어서 재생 / 정지 / 처음부터 */
(function(){var ss=window.speechSynthesis,bar,st,q=[],media=null,hideT=0,tick=0;
function svg(p){return '<svg class="hj-i" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+p+'</svg>'}
var IC={pause:svg('<path d="M9 5.5v13M15 5.5v13"/>'),play:svg('<path d="M7.5 5.2v13.6L18.5 12Z"/>'),stop:svg('<rect x="6.5" y="6.5" width="11" height="11" rx="2"/>'),again:svg('<path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3M4.5 4.5v3.7h3.7"/>'),vol:svg('<path d="M4.5 9.5h3l4.5-4v13l-4.5-4h-3Z"/><path d="M15.8 9a4.2 4.2 0 0 1 0 6"/>'),x:svg('<path d="M6 6l12 12M18 6 6 18"/>')};
function mk(){if(bar)return;bar=document.createElement('div');bar.id='hj-player';bar.setAttribute('role','region');bar.setAttribute('aria-label','듣기 조절');bar.hidden=true;
 bar.innerHTML='<span class="hj-pl-l">'+IC.vol+'<b>듣는 중</b></span><button type="button" data-k="pp"></button><button type="button" data-k="stop">'+IC.stop+'정지</button><button type="button" data-k="again">'+IC.again+'처음부터</button><button type="button" data-k="x" class="hj-pl-x" aria-label="닫기">'+IC.x+'</button>';
 document.body.appendChild(bar);
 bar.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;var k=b.dataset.k;
  if(k==='pp'){if(st==='play')pause();else resume()}
  else if(k==='stop')stop();else if(k==='again')again();else if(k==='x'){stop();bar.hidden=true}})}
function set(s){mk();st=s;clearTimeout(hideT);bar.hidden=false;bar.dataset.st=s;
 var pp=bar.querySelector('[data-k=pp]');pp.innerHTML=s==='play'?IC.pause+'일시정지':IC.play+(s==='pause'?'이어서 재생':'재생');pp.disabled=(s==='idle'&&!q.length&&!media);
 bar.querySelector('.hj-pl-l b').textContent=s==='play'?'듣는 중':s==='pause'?'잠깐 멈춤':'다 들었어요';
 bar.querySelector('[data-k=stop]').disabled=s==='idle';
 if(s==='idle')hideT=setTimeout(function(){if(st==='idle')bar.hidden=true},8000);
 if(s!=='idle'&&!tick)tick=setInterval(watch,400)}
function soon(){if(bar&&!bar.hidden){set('play');return}st='play';clearTimeout(soon.t);soon.t=setTimeout(function(){var sp=ss&&(ss.speaking||ss.pending)&&!ss.paused,mp=media&&!media.paused&&!media.ended;if(sp||mp)set('play');else st='idle'},700)}
function watch(){var sp=ss&&(ss.speaking||ss.pending),mp=media&&!media.paused&&!media.ended;
 if(st==='play'&&!sp&&!mp){set('idle');clearInterval(tick);tick=0}}
function pause(){if(media&&!media.paused){media.pause()}else if(ss&&ss.speaking){ss.pause()}set('pause')}
function resume(){if(st==='idle'){again();return}if(media&&media.paused&&!media.ended&&media.currentTime>0){media.play()}else if(ss&&ss.paused){ss.resume()}set('play')}
function stop(){if(media){try{media.pause();media.currentTime=0}catch(_){}}if(ss)ss.cancel();set('idle')}
function again(){if(media&&(!q.length||media._hjLast)){try{media.currentTime=0;media.play()}catch(_){}return}
 if(ss&&q.length){var list=q.slice();ss.cancel();q=[];list.forEach(function(u){var n=new SpeechSynthesisUtterance(u.text);['lang','rate','pitch','volume','voice','onstart','onend','onboundary','onerror'].forEach(function(k){try{if(u[k]!=null)n[k]=u[k]}catch(_){}});speak.call(ss,n)})}}
if(ss&&ss.speak){var speak=ss.speak,cancel=ss.cancel;
 ss.speak=function(u){if(!(ss.speaking||ss.pending))q=[];q.push(u);if(media)media._hjLast=false;var r=speak.apply(ss,arguments);soon();return r};
}
var play=HTMLMediaElement.prototype.play;
HTMLMediaElement.prototype.play=function(){var el=this;if(el.tagName!=='VIDEO'&&!el.closest?.('.hj-noplayer')){media=el;el._hjLast=true;
 if(!el._hjL){el._hjL=1;el.addEventListener('ended',function(){if(media===el)set('idle')});el.addEventListener('pause',function(){if(media===el&&st==='play'&&!el.ended)set(el.currentTime>0?'pause':'idle')})}
 soon()}
 return play.apply(this,arguments)};
})();
