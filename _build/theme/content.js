/* hj-cicons · 수업 자료의 이모지 단추 아이콘을 깔끔한 선 아이콘으로 바꿈 (앱이 글자를 바꿔도 다시 적용) */
(function(){
var I={play:'<path d="M7 4.8v14.4L19 12Z" fill="currentColor"/>',pause:'<rect x="6.5" y="5" width="3.6" height="14" rx="1" fill="currentColor"/><rect x="13.9" y="5" width="3.6" height="14" rx="1" fill="currentColor"/>',house:'<path d="M3.5 10.5 12 3.8l8.5 6.7"/><path d="M5.5 9.2V20h13V9.2"/><path d="M10 20v-5.5h4V20"/>',
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
 var tt=el.textContent.trim();if(el.childNodes.length===1&&el.firstChild.nodeType===3&&/^(▶️?|⏸️?)$/.test(tt)){var pn=tt[0]==='▶'?'play':'pause';el.textContent='';el.appendChild(svg(pn));el.classList.add('hj-ic','hj-ionly');if(!el.getAttribute('aria-label'))el.setAttribute('aria-label',pn==='play'?'재생':'멈춤');return}
 var t=el.firstChild;while(t&&t.nodeType===3&&!t.nodeValue.trim())t=t.nextSibling;
 if(t&&t.nodeType===3){var v=t.nodeValue.replace(/^\s+/,'');
  for(var i=0;i<LEAD.length;i++){var e=LEAD[i][0];if(v.indexOf(e)===0){var n=LEAD[i][1],rest=v.slice(e.length).replace(/^[️‍\s]+/,'');
   if(n==='house'&&/^목록/.test(rest))n='list';
   t.nodeValue=rest;el.insertBefore(svg(n),t);el.classList.add('hj-ic');
   var only=!rest.trim()&&!t.nextSibling;
   if(only){if(n==='house'&&el.closest('.tools,.topbar')){t.nodeValue='첫 화면';el.classList.add('hj-hometool');el.title=el.title||'이 수업의 첫 화면으로'}
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
(function(){var cv=document.getElementById('cover'),mt=document.querySelector('meta[name="hj-next"]');if(!mt)return;
/* 과학 앱(한 화면 보기): 마지막 단계에서 '다음'을 누르면 */
function last(){var p=document.getElementById('ovPos'),m=p&&p.textContent.match(/(\d+)\s*\/\s*(\d+)/);return m&&m[1]===m[2]}
document.addEventListener('click',function(e){if(e.target.closest('#ovNext')&&last())setTimeout(done,0)},true);
document.addEventListener('keydown',function(e){if(e.key==='ArrowRight'&&document.body.classList.contains('ov')&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)&&last())setTimeout(done,0)},true);
if(!cv){window.__hjDone=function(){done()}}
var act={t:0,next:false};
document.addEventListener('click',function(e){var b=e.target.closest('button,a');if(!b)return;var id=b.id||'',tx=b.textContent||'';
 act={t:Date.now(),next:/^(btnNext\d*|next)$/i.test(id)||(/다음/.test(tx)&&!b.closest('#cover'))}},true);
document.addEventListener('keydown',function(e){if(/^(ArrowRight|PageDown|Enter| )$/.test(e.key)&&!e.target.closest('input,textarea,select'))act={t:Date.now(),next:true}},true);
if(cv){var was=cv.classList.contains('on');
new MutationObserver(function(){var on=cv.classList.contains('on');if(on&&!was&&act.next&&Date.now()-act.t<800)done();was=on}).observe(cv,{attributes:true,attributeFilter:['class']});}
var A='<svg class="hj-i" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">';
var IC={next:A+'<path d="M5 12h14M13 6l6 6-6 6"/></svg>',list:A+'<rect x="5.2" y="5" width="13.6" height="15.2" rx="2"/><path d="M9 3.8h6v2.6H9ZM8.8 11.2h6.4M8.8 14.8h4.4"/></svg>',
 back:A+'<path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3M4.5 4.5v3.7h3.7"/></svg>',ok:'<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m8 12.3 2.7 2.7L16 9.6"/></svg>'};
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function done(){var old=document.getElementById('hj-done');if(old)old.remove();
 var nx=mt.getAttribute('content'),tl=document.querySelector('#cover .title')||document.querySelector('header h1, main h1, h1'),lst=document.querySelector('a.tolist[href]');
 var d=document.createElement('div');d.id='hj-done';d.setAttribute('role','dialog');d.setAttribute('aria-modal','true');d.setAttribute('aria-labelledby','hjDoneT');
 d.innerHTML='<div class="hj-dp"><span class="hj-dok">'+IC.ok+'</span><h2 id="hjDoneT">수업을 마쳤어요</h2><p class="hj-dl">'+esc(tl?tl.textContent.trim():document.title)+'</p>'+
  (nx?'<a class="hj-dn" href="'+esc(nx)+'"><small>다음 차시'+(mt.dataset.tag?' · '+esc(mt.dataset.tag):'')+'</small><b>'+esc(mt.dataset.t||'다음 차시')+'</b>'+IC.next+'</a>':'<p class="hj-dlast">이 학기의 마지막 차시예요.</p>')+
  '<div class="hj-drow"><a class="hj-db" href="'+esc(lst?lst.getAttribute('href'):'index.html')+'">'+IC.list+'자료 목록으로</a><button type="button" class="hj-db" data-x>'+IC.back+(cv?'이 차시 처음 화면':'계속 보기')+'</button></div></div>';
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
/* 첫 화면: '수업 시작'만 가운데에 두고, 교사용 단추(교사 안내·자료 보기·질문 판)는 위쪽 오른편으로 */
(function(){var cv=document.getElementById('cover');if(!cv)return;var go=cv.querySelector('#btnGo,#go');if(!go)return;
 var row=go.parentElement;var others=[].filter.call(row.children,function(b){return b!==go&&b.matches('button,a')});if(!others.length)return;
 var top=cv.querySelector('.hj-cvtop');if(!top){top=document.createElement('div');top.className='hj-cvtop';var host=cv.querySelector('.hj-cv')||cv.querySelector('.cvin,.inner')||cv;host.insertBefore(top,host.firstChild)}
 var grp=document.createElement('div');grp.className='hj-cvtools';grp.setAttribute('aria-label','선생님 도구');others.forEach(function(b){b.classList.add('hj-tool2');grp.appendChild(b)});top.appendChild(grp);row.classList.add('hj-goRow')})();
/* 수업 흐름 단추를 '번호 · 이름 · 시간' 세 줄로 나눠 한 줄 막대에 맞춤 */
(function(){var host=document.querySelector('#cover #plan, #cover #cPlan');if(!host)return;
 function fmt(){[].forEach.call(host.querySelectorAll('.st'),function(b){if(b.dataset.hjf)return;var t=b.textContent.trim(),m=t.match(/^([①-⑳]|\d+\.)\s*(.*?)\s*(\d+\s*분)?$/);if(!m)return;b.dataset.hjf='1';b.title=t;
  b.innerHTML='<span class="hj-sn">'+m[1].replace('.','')+'</span><span class="hj-st"></span>'+(m[3]?'<small>'+m[3]+'</small>':'');b.querySelector('.hj-st').textContent=m[2]})}
 fmt();new MutationObserver(fmt).observe(host,{childList:true})})();
/* 과학 앱: 마지막 단계에서 '수업 마치기' 단추 */
(function(){var nx=document.getElementById('ovNext'),pos=document.getElementById('ovPos');if(!nx||!pos||!window.__hjDone)return;
 var b=document.createElement('button');b.id='hjEnd';b.type='button';b.innerHTML='<svg class="hj-i" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><path d="m8.4 12.2 2.4 2.4 4.8-4.9"/></svg>수업 마치기';
 nx.after(b);b.onclick=function(){window.__hjDone()};
 function upd(){var m=pos.textContent.match(/(\d+)\s*\/\s*(\d+)/);var l=!!(m&&m[1]===m[2]);b.classList.toggle('on',l);nx.style.display=l?'none':''}
 upd();new MutationObserver(upd).observe(pos,{childList:true,characterData:true,subtree:true})})();
/* 이동 단추 통일: 모든 자료 화면 왼쪽 위에 [홈 · 자료 목록] (메뉴 페이지의 위치 표시줄과 같은 자리) */
(function(){var fh=document.getElementById('hj-home');if(!fh||document.querySelector('.hj-nav'))return;
 var A='<svg class="hj-i" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">';
 var inClass=/\/class\/(index\.html)?$/.test(location.pathname);var lst=[].filter.call(document.querySelectorAll('a.tolist[href]'),function(a){return /(^|\/)index\.html$/.test(a.getAttribute('href'))})[0];
 var nav=document.createElement('nav');nav.className='hj-nav';nav.setAttribute('aria-label','이동');
 nav.innerHTML='<a class="hj-nh" href="'+fh.getAttribute('href')+'">'+A+'<path d="M3.5 10.5 12 3.8l8.5 6.7M5.5 9.2V20h13V9.2M10 20v-5.5h4V20"/></svg><span>홈</span></a>'+
  (inClass?'':'<a class="hj-nl" href="'+(lst?lst.getAttribute('href'):'index.html')+'">'+A+'<rect x="5.2" y="5" width="13.6" height="15.2" rx="2"/><path d="M9 3.8h6v2.6H9ZM8.8 11.2h6.4M8.8 14.8h4.4"/></svg><span>자료 목록</span></a>');
 var w=document.createElement('div');w.className='hj-navbar';
 function place(){var top=document.querySelector('#cover .hj-cvtop'),hdr=document.querySelector('header.top'),sn=document.querySelector('body>nav .wrap');
  if(top){if(nav.parentNode!==top){var dup=top.querySelector('a.tolist[href$="index.html"]');if(dup)dup.remove();top.insertBefore(nav,top.firstChild)}}
  else if(document.querySelector('header#bar')){var hb=document.querySelector('header#bar');if(nav.parentNode!==hb)hb.insertBefore(nav,hb.firstChild);if(w.parentNode)w.remove()}
  else if(hdr){nav.classList.add('hj-dark');if(nav.parentNode!==hdr)hdr.insertBefore(nav,hdr.firstChild);if(w.parentNode)w.remove()}
  else if(sn){if(nav.parentNode!==sn)sn.insertBefore(nav,sn.firstChild)}
  else if(document.querySelector('section.screen.on .topbar')){var tb=document.querySelector('section.screen.on .topbar');if(nav.parentNode!==tb)tb.insertBefore(nav,tb.firstChild);if(w.parentNode)w.remove()}
  else if(nav.parentNode!==w||!w.isConnected){w.appendChild(nav);var m=document.querySelector('main')||document.body;m.insertBefore(w,m.firstChild)}}
 place();document.documentElement.classList.add('hj-hasnav');
 var raf=0;new MutationObserver(function(){if(!raf)raf=requestAnimationFrame(function(){raf=0;place()})}).observe(document.body,{childList:true,subtree:true});})();
/* 수학 앱: 긴 문장 카드는 넓은 화면에서 두 줄로 채워 배치 */
(function(){
 function fit(){if(!document.querySelector('header.top'))return;document.querySelectorAll('.opts:not([data-hjw])').forEach(function(o){var bs=o.querySelectorAll(':scope>.opt');if(!bs.length)return;var long=[].some.call(bs,function(b){return b.textContent.trim().length>24});o.dataset.hjw=long?'1':'0';if(long)o.classList.add('hj-wide')})}
 fit();new MutationObserver(fit).observe(document.body,{childList:true,subtree:true})})();
/* 학습 문제: '학습 문제' 안내 글자는 작게, 문제 문구는 크게 */
(function(){var q=document.querySelector('#cover .qbox');if(q&&!q.querySelector('.hj-qlab')){var br=q.querySelector('br');if(br&&br.parentNode===q){var s=document.createElement('span');s.className='hj-qlab';
  while(q.firstChild&&q.firstChild!==br)s.appendChild(q.firstChild);q.insertBefore(s,br);br.remove();var r=document.createElement('span');r.className='hj-qtxt';while(s.nextSibling)r.appendChild(s.nextSibling);q.appendChild(r)}}
 var g=document.getElementById('cGoal');if(g&&!g.querySelector('.hj-qlab')){var t=g.textContent,m=t.match(/^\s*학습 문제\s*[:：]\s*/);if(m){g.innerHTML='<span class="hj-qlab">학습 문제</span><span class="hj-qtxt"></span>';g.querySelector('.hj-qtxt').textContent=t.slice(m[0].length)}}})();
/* 문제를 다 풀면: '다음'(주 단추)과 '다시 풀기'(보조 단추)를 함께 */
(function(){var st=document.querySelector('#stage,#lesson');if(!st)return;
 function nextBtn(){return document.querySelector('#btnNext,#btnNext2,#next')}
 function fix(){[].forEach.call(st.querySelectorAll('button'),function(b){if(b.dataset.hjr||!/^\s*(다시 풀기|다시 하기|처음부터 다시)\s*$/.test(b.textContent))return;if(b.closest('.foot,.topbar,#hj-player'))return;var n=nextBtn();if(!n)return;b.dataset.hjr='1';
  var g=document.createElement('button');g.type='button';g.className='hj-gonext';g.innerHTML='다음으로 <svg class="hj-i" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  g.onclick=function(){var x=nextBtn();if(x)x.click()};b.classList.add('hj-retry');var w=document.createElement('div');w.className='hj-rrow';b.before(w);w.appendChild(b);w.appendChild(g)})}
 fix();var raf=0;new MutationObserver(function(){if(!raf)raf=requestAnimationFrame(function(){raf=0;fix()})}).observe(st,{childList:true,subtree:true})})();
/* 뒤집기 카드: 글이 길면 칸이 글에 맞춰 늘어나도록(글자가 칸 밖으로 나오지 않게) */
(function(){if(!document.querySelector('style')||!/\.rc\s*\{/.test(document.head.innerHTML))return;
 function fit(){var rows=new Map();document.querySelectorAll('.rc').forEach(function(rc){if(!rc.offsetParent)return;rc.style.minHeight='';var need=0;
  rc.querySelectorAll('.f').forEach(function(f){var r=document.createRange();r.selectNodeContents(f);var cs=getComputedStyle(f);need=Math.max(need,r.getBoundingClientRect().height+parseFloat(cs.paddingTop)+parseFloat(cs.paddingBottom)+parseFloat(cs.borderTopWidth)*2+8)});
  if(need>rc.clientHeight+2){rc.style.minHeight=need+'px'}
  var p=rc.parentElement;rows.set(p,Math.max(rows.get(p)||0,parseFloat(rc.style.minHeight)||rc.clientHeight))});
  rows.forEach(function(h,p){[].forEach.call(p.querySelectorAll(':scope>.rc'),function(rc){rc.style.minHeight=h+'px'})})}
 var raf=0;function q(){if(!raf)raf=requestAnimationFrame(function(){raf=0;fit()})}
 new MutationObserver(q).observe(document.body,{childList:true,subtree:true});addEventListener('resize',q);if(document.fonts)document.fonts.ready.then(q)})();
/* 우리 반 교실: 메뉴 칸마다 메인 화면과 같은 파스텔 색을 돌려 가며 */
(function(){if(!document.querySelector('header#bar'))return;var PAL=['#E9B730','#98C54A','#4DB283','#55B2E0','#9F86E3','#E784AF','#F0985A','#5C8EE6'];
 function paint(){document.querySelectorAll('.icons').forEach(function(g){var i=0;[].forEach.call(g.querySelectorAll(':scope>.ic'),function(b){b.style.setProperty('--acc',PAL[i++%PAL.length])})})}
 paint();var raf=0;new MutationObserver(function(){if(!raf)raf=requestAnimationFrame(function(){raf=0;paint()})}).observe(document.body,{childList:true,subtree:true})})();
/* 첫 화면 순서 통일(국어처럼): 학년·학기·단원·차시 안내 → 학습 주제(제목) */
(function(){var cv=document.getElementById('cover');if(!cv)return;var t=cv.querySelector('h1.title');if(!t)return;
 var sub=document.getElementById('cSub');if(sub&&sub.compareDocumentPosition(t)&Node.DOCUMENT_POSITION_PRECEDING){t.before(sub);return}
 var n=t.nextElementSibling;if(n&&n.matches('p.lead')&&!n.id){t.before(n)}})();
/* 글쓰기 도구 막대: 듣기 · 점검 · 정리 세 묶음으로 */
(function(){function tidy(){document.querySelectorAll('.wbar:not([data-hjt])').forEach(function(w){w.dataset.hjt='1';
  function grp(ids){var g=document.createElement('div');g.className='hj-wg';ids.forEach(function(id){var b=document.getElementById(id);if(b)g.appendChild(b)});return g.children.length?g:null}
  var c=document.getElementById('wCount');var gs=[grp(['wSpeak','wStop']),grp(['wCheck','wModel']),grp(['wCopy','wClear'])].filter(Boolean);
  gs.forEach(function(g){w.insertBefore(g,c||null)});var st=document.getElementById('wStop');if(st&&!st.getAttribute('aria-label')){st.setAttribute('aria-label','듣기 멈추기');st.title='멈추기'}})}
 tidy();var raf=0;new MutationObserver(function(){if(!raf)raf=requestAnimationFrame(function(){raf=0;tidy()})}).observe(document.body,{childList:true,subtree:true})})();
/* 과학 앱(한 화면 보기): 첫 화면에 학년·학기·단원·차시와 주제, 너무 크게 키우지 않기 */
(function(){if(!document.getElementById('ovBar'))return;var hd=document.querySelector('header .wrap h1'),hp=document.querySelector('header .wrap p');
 var CAP=1.0;function cap(b){var m=/scale\(([\d.]+)\)/.exec(b.style.transform||'');if(m&&+m[1]>CAP+0.001){b.style.transform='scale('+CAP+')';b.style.width=(100/CAP)+'%';b.style.marginLeft=((1-1/CAP)*50)+'%'}}
 new MutationObserver(function(ms){ms.forEach(function(r){if(r.target.classList&&r.target.classList.contains('fitbox'))cap(r.target)})}).observe(document.body,{attributes:true,attributeFilter:['style'],subtree:true})})();
/* 아이콘만 있던 ⏹ 단추에 '멈추기' 이름 */
(function(){var SV='<svg class="hj-i" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6.5" y="6.5" width="11" height="11" rx="2"/></svg>';
 function fix(){document.querySelectorAll('button').forEach(function(b){if(b.dataset.hjs)return;var t=b.textContent.replace(/[️\s]/g,'');if(t==='⏹'||t==='■'||t==='◼'){b.dataset.hjs='1';b.innerHTML=SV+'멈추기';b.classList.add('hj-ic');b.setAttribute('aria-label','멈추기')}})}
 fix();var raf=0;new MutationObserver(function(){if(!raf)raf=requestAnimationFrame(function(){raf=0;fix()})}).observe(document.body,{childList:true,subtree:true})})();
/* 과학 앱: 국어·사회처럼 첫 화면(학년·학기·단원·차시 → 주제 → 학습 목표 → 수업 흐름 → 수업 시작) */
(function(){var bar=document.getElementById('ovBar');if(!bar||document.getElementById('hj-scover'))return;
 var hd=document.querySelector('header .wrap h1'),hp=document.querySelector('header .wrap p'),goal=document.querySelector('main p.goal');
 var tabs=[].slice.call(document.querySelectorAll('body>nav .wrap>a[href^="#s"]'));
 var cv=document.createElement('div');cv.id='hj-scover';cv.setAttribute('aria-label','수업 첫 화면');
 var gt=goal?(function(){var d=document.createElement('div');d.innerHTML=goal.innerHTML.replace(/<br\s*\/?>/gi,' ');return d.textContent})().replace(/\s+/g,' ').replace(/^\s*🎯?\s*학습 목표\s*/,'').trim():'';
 cv.innerHTML='<div class="hj-sc-in"><p class="hj-sc-info"></p><h1 class="hj-sc-title"></h1><div class="hj-cvpanel"><div class="qbox hj-sc-goal"><span class="hj-qlab">학습 목표</span><span class="hj-qtxt"></span></div>'+
  '<div class="hj-field"><span class="hj-flabel">수업 흐름</span><div class="plan" id="hjScPlan"></div></div></div>'+
  '<div class="hj-goRow"><button type="button" class="big-btn hj-sc-go">수업 시작</button></div></div>';
 cv.querySelector('.hj-sc-info').textContent=hp?hp.textContent.replace(/\s*·\s*만든 사람.*$/,''):'';
 cv.querySelector('.hj-sc-title').textContent=hd?hd.textContent.replace(/^\s*\d+\.\s*/,''):document.title;
 cv.querySelector('.hj-qtxt').textContent=gt;if(!gt)cv.querySelector('.hj-sc-goal').remove();
 var pl=cv.querySelector('#hjScPlan');tabs.forEach(function(a,i){var b=document.createElement('button');b.type='button';b.className='st';b.innerHTML='<span class="hj-sn">'+(i+1)+'</span><span class="hj-st"></span>';b.querySelector('.hj-st').textContent=a.textContent.trim();b.onclick=function(){hide();a.click()};pl.appendChild(b)});
 document.body.appendChild(cv);document.documentElement.classList.add('hj-sc-on');
 function hide(){document.documentElement.classList.remove('hj-sc-on')}
 function showC(){document.documentElement.classList.add('hj-sc-on');window.scrollTo(0,0)}
 cv.querySelector('.hj-sc-go').onclick=function(){hide();var f=tabs[0];if(f)f.click()};
 var hb=document.createElement('button');hb.type='button';hb.id='hjScHome';hb.className='hj-ic';hb.innerHTML='<svg class="hj-i" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 10.5 12 3.8l8.5 6.7M5.5 9.2V20h13V9.2M10 20v-5.5h4V20"/></svg>첫 화면';hb.onclick=showC;bar.insertBefore(hb,bar.firstChild);
})();
(function(){var n=document.querySelector('body>nav');if(!n||!document.getElementById('ovBar'))return;function m(){document.documentElement.style.setProperty('--hj-navh',n.offsetHeight+'px')}m();addEventListener('resize',m)})();
/* 과학 앱: 실험 안쪽의 '이전 단계/다음 단계'를 아래 막대의 이전/다음으로 합치기 */
(function(){var ovN=document.getElementById('ovNext'),ovP=document.getElementById('ovPrev');if(!ovN||!ovP)return;
 var inN=document.querySelector('section #next'),inP=document.querySelector('section #prev');if(!inN||!inP)return;
 var row=inN.parentElement;if(row===inP.parentElement){row.classList.add('hj-innernav');document.documentElement.classList.add('hj-merge-steps')}else return;
 var sec=inN.closest('section');
 function vis(){return sec.classList.contains('cur')&&sec.getBoundingClientRect().height>0&&document.body.classList.contains('ov')&&[].some.call(sec.querySelectorAll('.lab'),function(l){return !l.hidden&&l.offsetParent})}
 function pos(){var sp=sec.querySelectorAll('.steps span'),i=-1;sp.forEach(function(s,k){if(s.classList.contains('now'))i=k});return {i:i,n:sp.length}}
 function hint(){var f=sec.querySelector('.lab:not([hidden]) .fb');var t='먼저 이 단계 활동을 해 봐요.';if(f){f.textContent=t;f.className='fb info'}else alert(t)}
 ovN.addEventListener('click',function(e){if(!vis())return;var p=pos();if(p.i<0||p.i>=p.n-1)return;e.stopImmediatePropagation();e.preventDefault();if(inN.disabled)hint();else inN.click()},true);
 ovP.addEventListener('click',function(e){if(!vis())return;var p=pos();if(p.i<=0)return;e.stopImmediatePropagation();e.preventDefault();inP.click()},true);
 /* 실험 단계 중에는 아래 '다음'이 잠긴 것처럼 보이지 않게 */
 new MutationObserver(function(){if(vis()){var p=pos();if(p.i>=0&&p.i<p.n-1)ovN.disabled=false}}).observe(document.getElementById('ovPos'),{childList:true,subtree:true,characterData:true});
})();
/* 헷갈리는 이름 정리: 같은 말이 다른 일을 하지 않게 */
(function(){var R=[['#btnLinks',/^\s*자료\s*$/,'자료 보기'],['#ovHome',/^\s*목록\s*$/,'단계 목록'],['#ovFull',/^\s*전체\s*$/,'전체 보기'],['#ovFull',/^\s*한 화면\s*$/,'한 화면 보기']];
 function fix(){R.forEach(function(r){var el=document.querySelector(r[0]);if(!el)return;[].forEach.call(el.childNodes,function(n){if(n.nodeType===3&&r[1].test(n.nodeValue))n.nodeValue=r[2]})})}
 fix();R.forEach(function(r){var el=document.querySelector(r[0]);if(el)new MutationObserver(fix).observe(el,{childList:true,characterData:true,subtree:true})})})();
/* 과학 앱: 놀이·문제를 다 풀어 '다시 하기'가 나오면 옆에 '다음으로'도 함께 */
(function(){var ov=document.getElementById('ovNext');if(!ov)return;var RX=/^\s*(🔄\s*)?다시\s*(하기|풀기)\s*$/;
 function go(){var e=document.getElementById('hjEnd');if(e&&e.classList.contains('on'))e.click();else ov.click()}
 function fix(){document.querySelectorAll('main section button').forEach(function(b){if(b.classList.contains('hj-gonext'))return;var m=RX.test(b.textContent),n=b.nextElementSibling,has=n&&n.classList.contains('hj-gonext');
  if(m&&!has){var g=document.createElement('button');g.type='button';g.className='hj-gonext';g.innerHTML='다음으로 <svg class="hj-i" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';g.onclick=go;var w=b.parentElement.classList.contains('hj-rrow')?b.parentElement:null;if(!w){w=document.createElement('span');w.className='hj-rrow';b.before(w);w.appendChild(b)}w.appendChild(g);b.classList.add('hj-retry')}
  else if(!m&&has){n.remove();b.classList.remove('hj-retry')}})}
 fix();var raf=0;new MutationObserver(function(){if(!raf)raf=requestAnimationFrame(function(){raf=0;fix()})}).observe(document.querySelector('main')||document.body,{childList:true,subtree:true,characterData:true})})();
/* 국어·사회 진행 화면: 내용이 적으면 화면에 맞춰 알맞게 키우기(최대 1.35배), 많으면 그대로 */
(function(){var st=document.getElementById('stage'),bd=st&&st.querySelector('#body');if(!bd||!('zoom' in document.body.style))return;
 function fit(){if(!st.classList.contains('on'))return;bd.style.zoom='';bd.style.width='';
  var vw=window.innerWidth,target=Math.min(1120,vw*0.94),foot=st.querySelector('.foot'),top=bd.getBoundingClientRect().top;
  var availH=window.innerHeight-top-(foot?foot.offsetHeight:60)-28;var ks=[].filter.call(bd.children,function(c){return c.offsetParent});if(!ks.length)return;var h=ks[ks.length-1].getBoundingClientRect().bottom-ks[0].getBoundingClientRect().top+16;if(h<40||availH<200)return;
  var w=Math.max.apply(null,[].map.call(bd.children,function(c){return c.getBoundingClientRect().width}).concat([1]));
  var k=Math.min(1.2,availH/h,(target*0.98)/w);if(k<1.04)return;k=Math.floor(k*100)/100;
  bd.style.width=(target/k)+'px';bd.style.zoom=k;
  var h2=(ks[ks.length-1].getBoundingClientRect().bottom-ks[0].getBoundingClientRect().top+16);if(h2>availH+4){k=Math.max(1,Math.floor(k*availH/h2*100)/100);bd.style.width=(target/k)+'px';bd.style.zoom=k}}
 var raf=0;function q(){cancelAnimationFrame(raf);raf=requestAnimationFrame(function(){setTimeout(fit,30)})}
 new MutationObserver(q).observe(bd,{childList:true});new MutationObserver(q).observe(st,{attributes:true,attributeFilter:['class']});addEventListener('resize',q);if(document.fonts)document.fonts.ready.then(q)})();
/* 과학 앱: 사진이 두 장 이상 이어지면 나란히(사진 위, 설명 아래) 놓아 한 화면에 들어오게 */
(function(){if(!document.getElementById('ovBar'))return;
 document.querySelectorAll('main section').forEach(function(sec){var kids=[].slice.call(sec.querySelectorAll('figure.photo'));var done=new Set();
  kids.forEach(function(f){if(done.has(f)||f.parentElement.classList.contains('gallery')||/(^|\s)gal\w*(\s|$)/.test(f.parentElement.className)||f.parentElement.classList.contains('hj-pgrid'))return;var run=[f],n=f.nextElementSibling;while(n&&n.matches('figure.photo')){run.push(n);n=n.nextElementSibling}
   if(run.length<2)return;var g=document.createElement('div');g.className='hj-pgrid';f.before(g);run.forEach(function(x){done.add(x);g.appendChild(x)})})})})();
/* 낱말이 줄 끝에서 끊기지 않게: '·', '-', '(', ')', '/'로 붙은 말 사이에 줄바꿈 금지 표시(보이지 않는 글자) */
(function(){var WJ='⁠',SKIP='script,style,textarea,input,select,option,svg,code,pre,[contenteditable],.hj-em';
 var RX=/([^\s⁠])([·‧\-–\/(])(?=[^\s⁠])|([^\s⁠(])([)])(?=[^\s⁠.,!?·])/g;
 function fix(n){var v=n.nodeValue;if(!/[·‧\-–\/()]/.test(v))return;if(/^https?:|www\.|@/.test(v.trim()))return;
  var t=v.replace(/\S+/g,function(k){return k.length>7?k.replace(/(\S)([·‧])/g,'$1'+WJ+'$2'):k.replace(/(\S)([·‧–\/])(?=\S)/g,'$1'+WJ+'$2'+WJ)}).replace(/([가-힣A-Za-z0-9])-(?=[가-힣A-Za-z0-9])/g,'$1'+WJ+'-'+WJ).replace(/(\S)\((?=\S)/g,'$1'+WJ+'(').replace(/\)(?=[가-힣])/g,')'+WJ);
  if(t!==v)n.nodeValue=t}
 function run(root){if(!root)return;if(root.nodeType===3){var p=root.parentElement;if(p&&!p.closest(SKIP))fix(root);return}if(root.nodeType!==1||root.closest(SKIP))return;
  var w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:function(n){return n.parentElement&&!n.parentElement.closest(SKIP)?1:2}}),a=[],n;while(n=w.nextNode())a.push(n);a.forEach(fix)}
 run(document.body);var q=new Set(),raf=0;new MutationObserver(function(ms){ms.forEach(function(m){if(m.type==='characterData'){q.add(m.target)}else m.addedNodes.forEach(function(x){q.add(x)})});if(!raf)raf=requestAnimationFrame(function(){raf=0;var a=Array.from(q);q.clear();a.forEach(function(x){if(x.isConnected)run(x)})})}).observe(document.body,{childList:true,subtree:true,characterData:true})})();
/* 수업 흐름·활동 단위 막대: 칸이 좁아져 낱말이 끊기면 두세 줄로 고르게 나누기 */
(function(){var SEL='#cover #plan,#cover #cPlan,#hjScPlan,#cover #segTeam>.seg';
 function lay(){document.querySelectorAll(SEL).forEach(function(g){if(!g.offsetParent)return;var n=g.children.length;if(!n)return;g.style.gridAutoFlow='row';
  var w=g.clientWidth,min=g.matches('.seg')?92:126,rows=1;while(rows<4&&w/Math.ceil(n/rows)<min)rows++;var c=Math.ceil(n/rows);
  g.style.gridTemplateColumns='repeat('+c+',minmax(0,1fr))';g.classList.toggle('hj-multi',rows>1)})}
 lay();addEventListener('resize',function(){clearTimeout(lay.t);lay.t=setTimeout(lay,80)});if(document.fonts)document.fonts.ready.then(lay);
 new MutationObserver(function(){clearTimeout(lay.t);lay.t=setTimeout(lay,30)}).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class']})})();
(function(){function chk(){document.querySelectorAll('.screen .topbar>.steps,.screen .topbar>.stagebar').forEach(function(s){s.classList.toggle('hj-ovf',s.scrollWidth>s.clientWidth+4&&s.scrollLeft+s.clientWidth<s.scrollWidth-4)})}
 chk();addEventListener('resize',chk);document.addEventListener('scroll',chk,true);new MutationObserver(function(){clearTimeout(chk.t);chk.t=setTimeout(chk,50)}).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class']})})();
/* 홍지희 버전처럼 화면 전체를 키우는 자료: 키운 비율을 단추 크기 계산에 알려 주기 */
(function(){function z(){var v=parseFloat(document.documentElement.style.zoom||getComputedStyle(document.documentElement).zoom)||1;document.documentElement.style.setProperty('--hjz',v)}z();addEventListener('resize',function(){setTimeout(z,60)});new MutationObserver(z).observe(document.documentElement,{attributes:true,attributeFilter:['style']})})();
/* 『국어』 223쪽 3번 (2) 같은 쪽수 표시는 한 덩어리로(중간에서 줄이 바뀌지 않게) */
(function(){var RX=/\(?『[^』]{1,12}』(?:\s*\d+(?:\s*[~∼-]\s*\d+)?쪽)?(?:\s*\d+번)?(?:\s*\(\d+\))?\)?|(?:교과서|지도서|실험관찰)\s*\d+(?:\s*[~∼-]\s*\d+)?쪽(?:\s*\d+번)?/g,SKIP='script,style,textarea,input,option,svg';
 function fix(n){var v=n.nodeValue;if(v.indexOf('쪽')<0&&v.indexOf('『')<0)return;var t=v.replace(RX,function(m){return m.replace(/ /g,' ')});if(t!==v)n.nodeValue=t}
 function run(r){if(!r)return;if(r.nodeType===3){if(r.parentElement&&!r.parentElement.closest(SKIP))fix(r);return}if(r.nodeType!==1||r.closest(SKIP))return;var w=document.createTreeWalker(r,4),n,a=[];while(n=w.nextNode())if(!n.parentElement.closest(SKIP))a.push(n);a.forEach(fix)}
 run(document.body);new MutationObserver(function(ms){ms.forEach(function(m){if(m.type==='characterData')run(m.target);else m.addedNodes.forEach(run)})}).observe(document.body,{childList:true,subtree:true,characterData:true})})();
/* 돋보기 단추: 누르면 펼쳐지고, 다시 누르면 닫히게 */
(function(){var b=document.getElementById('zoomBtn'),z=document.getElementById('zoom');if(!b||!z)return;
 b.addEventListener('click',function(e){if(!z.hidden&&b.dataset.open){e.stopImmediatePropagation();z.hidden=true;b.dataset.open='';b.lastChild.nodeValue=' 돋보기로 보기';return}setTimeout(function(){if(!z.hidden){b.dataset.open='1';b.lastChild.nodeType===3&&(b.lastChild.nodeValue=' 돋보기 닫기');z.scrollIntoView({block:'nearest',behavior:'smooth'})}},0)},true)})();
/* 그림(SVG) 속 글자 지키기: ① 말풍선·이름표보다 글이 길면 글자를 줄여 칸 안에 ② 다른 도형에 가려지면 글자를 맨 위로 */
(function(){var NS='http://www.w3.org/2000/svg';
 function paints(e){var s=getComputedStyle(e);if(s.visibility==='hidden'||+s.opacity===0)return false;var f=s.fill,st=s.stroke;var fo=+s.fillOpacity;var noFill=(!f||f==='none'||/rgba\(.*,\s*0\)$/.test(f)||f==='transparent'||fo===0);var noStroke=(!st||st==='none'||+s.strokeOpacity===0||parseFloat(s.strokeWidth)===0);return !(noFill&&noStroke)}
 function fitBubble(t){if(t.dataset.hjFit)return;t.dataset.hjFit='1';var p=t.previousElementSibling,box=null;for(var i=0;i<3&&p;i++,p=p.previousElementSibling){if(p.tagName==='rect'){box=p;break}}if(!box)return;
  try{var b=t.getBBox(),rx=+box.getAttribute('x')||0,rw=+box.getAttribute('width')||0,ry=+box.getAttribute('y')||0,rh=+box.getAttribute('height')||0;if(!rw||!rh)return;
   var cy=b.y+b.height/2;if(cy<ry||cy>ry+rh||b.x<rx-4||b.x>rx+rw)return;var anchor=t.getAttribute('text-anchor')||'start';var room=anchor==='middle'?rw-12:(rx+rw-6)-b.x;if(b.width<=room+1)return;
   var fs=parseFloat(getComputedStyle(t).fontSize)||16;var k=Math.max(.68,room/b.width);t.setAttribute('font-size',(fs*k).toFixed(1));t.style.fontSize=(fs*k).toFixed(1)+'px';
   b=t.getBBox();if(b.width>room+1){box.setAttribute('width',(rw+(b.width-room)+8).toFixed(0))}}catch(e){}}
 function run(){document.querySelectorAll('svg text').forEach(function(t){if(!t.getBoundingClientRect().width)return;fitBubble(t)});
}
 var tm=0;function q(){clearTimeout(tm);tm=setTimeout(run,250)}
 if(document.fonts)document.fonts.ready.then(q);addEventListener('load',q);addEventListener('resize',q);addEventListener('scroll',q,true);
 new MutationObserver(function(ms){if(ms.some(function(m){return !(m.target.closest&&m.target.closest('#hj-player'))}))q()}).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden','class']});})();
(function(){var bar=document.getElementById('ovBar');if(!bar)return;function m(){var r=bar.getBoundingClientRect();document.documentElement.style.setProperty('--hjbar',Math.round(window.innerHeight-r.top+8)+'px')}m();addEventListener('resize',m);new MutationObserver(m).observe(bar,{childList:true,subtree:true,attributes:true})})();
/* 제목·질문 줄바꿈: 쉼표·마침표로 나뉜 말 덩어리는 한 줄에 두고, 덩어리 사이에서 줄을 바꾼다
   (예: "…살펴보고, / 공부할 차례를 정해 봐요.") */
(function(){var SEL='h1,h2,h3,h4,.hd,.ask,.title,.lead,.big,.sit,.qtext,.hj-sc-title,.hj-sc-goal,p.jua,.goal,.q,.clue,#clue',RX=/[^,.!?]+(?:[,.!?]+|$)/g;
 function ok(el){if(el.closest('svg,button,a,textarea,[contenteditable],.hj-contact,nav'))return false;var c=el.childNodes;if(!c.length)return false;
  for(var i=0;i<c.length;i++)if(c[i].nodeType!==3)return false;var v=el.textContent;return /[,.!?]\s+\S/.test(v.trim())&&v.length<160}
 function fix(el){if(!ok(el))return;var v=el.textContent,parts=v.match(RX);if(!parts||parts.length<2)return;
  var f=document.createDocumentFragment();parts.forEach(function(p){var m=p.match(/^(\s*)([\s\S]*?)(\s*)$/);if(m[1])f.appendChild(document.createTextNode(m[1]));
   if(m[2]){var s=document.createElement('span');s.className='hj-cl';s.textContent=m[2];f.appendChild(s)}if(m[3])f.appendChild(document.createTextNode(m[3]))});
  el.textContent='';el.appendChild(f)}
 function run(r){if(!r||r.nodeType!==1)return;if(r.matches(SEL))fix(r);r.querySelectorAll(SEL).forEach(fix)}
 var st=document.createElement('style');st.textContent='.hj-cl{display:inline-block;max-width:100%}';document.head.appendChild(st);
 run(document.body);var q=new Set(),raf=0;new MutationObserver(function(ms){ms.forEach(function(m){var t=m.target.nodeType===3?m.target.parentElement:m.target;if(t)q.add(t.matches&&t.matches(SEL)?t:(t.closest?t.closest(SEL)||t:t))});
  if(!raf)raf=requestAnimationFrame(function(){raf=0;var a=Array.from(q);q.clear();a.forEach(function(x){if(x.isConnected)run(x)})})}).observe(document.body,{childList:true,subtree:true,characterData:true})})();
/* 과목 색: 주소에서 과목을 읽어 html에 표시 */
(function(){var m=location.pathname.match(/\/(korean|math|social|science)\//);if(m)document.documentElement.setAttribute('data-hjsubj',m[1])})();
/* 과학 한 화면 보기: 글의 위계 정리
   - '활동 이름표 + 큰 제목'을 한 줄로
   - 안내 글(상황 설명)은 작게, 마지막 '~골라요/~써 봐요' 같은 할 일 문장은 크게 따로 */
(function(){if(!document.body.classList.contains('ov')&&!document.getElementById('ovBar'))return;
 var VERB=/(골라요|골라 봐요|고르세요|써요|써 봐요|써 보세요|적어요|적어 봐요|눌러요|눌러 봐요|눌러 보세요|찾아요|찾아 봐요|찾아보세요|세어 봐요|옮겨요|옮겨 봐요|답해요|넣어요|넣어 봐요|표시해요|말해 봐요|맞혀요|맞혀 봐요|이어요|이어 봐요|정해요|그려요|그려 봐요|만들어 봐요|비교해 봐요|분류해 봐요|나누어 봐요|살펴봐요|살펴보세요|관찰해요|관찰해 봐요|확인해요|확인해 봐요|예상해 봐요|생각해 봐요|정리해 봐요)[.!]?$/;
 function copyState(from,to){for(var k in from.dataset)to.dataset[k]=from.dataset[k];if(from.classList.contains('ovhide'))to.classList.add('ovhide')}
 function run(){document.querySelectorAll('main section').forEach(function(sec){var b=sec.querySelector(':scope > .fitbox')||sec;
  var st=b.querySelector(':scope > .stage'),h2=b.querySelector(':scope > h2');
  if(st&&h2&&st.nextElementSibling===h2&&!st.closest('.hj-head')){var hd=document.createElement('div');hd.className='hj-head';hd.dataset.always='1';st.before(hd);hd.appendChild(st);hd.appendChild(h2)}
  b.querySelectorAll(':scope > p').forEach(function(p){if(p.dataset.hjp||p.matches('.fb,.tip,.jua,.goal,.hj-src')||p.id)return;p.dataset.hjp='1';
   var h=p.innerHTML.trim(),txt=p.textContent.trim();if(txt.length<8)return;
   var cut=-1,re=/[.!?]\s+(?=[^<>]*(?:<|$))/g,m;while(m=re.exec(h))cut=m.index+1;
   if(cut>0){var last=h.slice(cut).trim(),tmp=document.createElement('div');tmp.innerHTML=last;
    if(VERB.test(tmp.textContent.trim())){var g=document.createElement('p');g.className='hj-guide';g.innerHTML=h.slice(0,cut);copyState(p,g);g.dataset.hjp='1';p.before(g);p.innerHTML=last;p.classList.add('hj-task');return}
    p.classList.add('hj-guide');return}
   if(VERB.test(txt))p.classList.add('hj-task');else p.classList.add('hj-guide')})})}
 run();setTimeout(run,400);if(document.fonts)document.fonts.ready.then(function(){setTimeout(run,100)})})();
