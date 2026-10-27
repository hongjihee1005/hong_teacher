/* ===== 수업 스튜디오 껍데기 v4 (2026-10-27) — 짜임은 shell.css 맨 위 설명 =====
   엔진이 innerHTML로 다시 그리는 그릇(단계 막대·본문)과 글만 바꾸는 요소(질문·안내·다음 단추)는 노드째 옮기므로 엔진 코드·이벤트는 그대로.
   단계 이름·다음 단계·세부 차례는 단계 막대와 엔진 글을 보고 따라 적음.
   - 홍지희 버전(section#lesson): #steps · #rt · #hd · #ask · #body · .foot #prev #next #tn
   - 국어·사회 교과서 덱(section#stage): #bar · #turnLine · #bodyWrap(국어, 앱이 화면에 맞춰 키움) 또는 #body · .foot #btnPrev #btnNext(2) #tOpen · #stepNo */
(function(){
 var D=document,H=D.documentElement,$=function(i){return D.getElementById(i)};
 var B=$('lesson')&&$('steps')&&$('hd')&&$('body')&&$('next'),A=!B&&$('stage')&&$('bar')&&$('body')&&$('btnPrev');
 if(!B&&!A)return;
 var R=B?$('lesson'):$('stage');if(R.querySelector('.hs-bar'))return;
 var steps=B?$('steps'):$('bar'),body=B?$('body'):($('bodyWrap')||$('body')),prev=B?$('prev'):$('btnPrev'),next=B?$('next'):($('btnNext2')||$('btnNext')),tn=B?$('tn'):$('tOpen');
 if(!steps||!body||!prev||!next)return;
 var NS='http://www.w3.org/2000/svg';
 var P={play:'M8 5.5v13l10.5-6.5z',board:'M4 5h16v10H4zM8 19h8M12 15v4',lock:'M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3',pen:'M4 20l4-1L19 8l-3-3L5 16zM14 6l3 3',
  compass:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM15.5 8.5l-2 5-5 2 2-5z',flag:'M5 21V4M5 4h11l-2 4 2 4H5',expand:'M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5',shrink:'M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5'};
 function ico(k){var s=D.createElementNS(NS,'svg');s.setAttribute('viewBox','0 0 24 24');s.setAttribute('class','hs-ico');s.setAttribute('aria-hidden','true');var p=D.createElementNS(NS,'path');p.setAttribute('d',P[k]);s.appendChild(p);return s}
 function el(t,c,txt){var e=D.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=txt;return e}
 function clean(t){return (t||'').replace(/[\u{1F000}-\u{1FAFF}☀-➿⬀-⯿⌀-⏿️‍]/gu,'').replace(/\s+/g,' ').trim()}
 function txt(s){var e=D.querySelector(s);return e?clean(e.textContent):''}
 H.classList.add('hs');R.classList.add('hs-root');

 /* 앱 막대: 홈 · 자료 목록 / 제목 / 수업 · 우리 반 판 · 선생님(길게 눌러 열기) */
 var bar=el('div','hs-bar'),nav=el('div','hs-nav'),tools=R.querySelector('.topbar .tools');
 var homeA=tools&&tools.querySelector('a.hj-homemini'),list=tools&&tools.querySelector('.hj-lbtn');
 if(list)nav.appendChild(list);
 if(homeA){nav.appendChild(homeA);homeA.addEventListener('click',function(e){if(!confirm('수업을 나가 첫 화면으로 갈까요?'))e.preventDefault()})}
 var ttl=el('div','hs-ttl');
 ttl.appendChild(el('b','',txt('#cover h1')||clean(D.title.split('·')[0])));ttl.appendChild(el('span','',txt('#cSub')||txt('#cvSub')||txt('#cover .lead')));
 var tabs=el('div','hs-tabs');tabs.setAttribute('role','tablist');
 var tLes=el('button','hs-tab on');tLes.type='button';tLes.appendChild(ico('play'));tLes.appendChild(D.createTextNode('수업'));tabs.appendChild(tLes);
 var qb=$('qbBtn');
 if(qb){var tQ=el('button','hs-tab');tQ.type='button';tQ.appendChild(ico('board'));tQ.appendChild(D.createTextNode('우리 반 판'));tQ.onclick=function(){qb.click()};tabs.appendChild(tQ)}
 if(tn){var tT=el('button','hs-tab lk');tT.type='button';tT.title='선생님: 길게 눌러 열어요';tT.appendChild(ico('lock'));tT.appendChild(D.createTextNode('선생님'));
  var tm=0;function up(){clearTimeout(tm);tT.classList.remove('hold')}
  tT.addEventListener('pointerdown',function(){tT.classList.add('hold');tm=setTimeout(function(){up();tn.click()},700)});['pointerup','pointerleave','pointercancel'].forEach(function(k){tT.addEventListener(k,up)});
  tT.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();tn.click()}});tabs.appendChild(tT)}
 bar.appendChild(nav);bar.appendChild(ttl);bar.appendChild(tabs);

 /* 왼쪽: 단계 길 + 무대(지금 할 일 머리띠 · 질문 · 활동) */
 var main=el('div','hs-main'),path=el('div','hs-path');steps.classList.add('hs-steps');path.appendChild(steps);
 var stage=el('div','hs-stage'),now=el('div','hs-now'),tag=el('span','tag');tag.appendChild(ico('pen'));tag.appendChild(D.createTextNode('지금 할 일'));
 var ask,q=null;
 if(B){ask=$('ask');q=$('hd');q.classList.add('hs-q')}else{ask=el('p','')}
 ask.classList.add('hs-ask');
 var alt=el('p','alt');now.appendChild(tag);now.appendChild(ask);now.appendChild(alt);
 var sb=el('div','hs-sb');if(q)sb.appendChild(q);body.classList.add('hs-body');sb.appendChild(body);
 stage.appendChild(now);stage.appendChild(sb);main.appendChild(path);main.appendChild(stage);

 /* 오른쪽: 이 단계 안내 — 단계 이름 · 활동 방법 · 세부 차례 · 학습 문제 · 다음 단계, 아래에 도구와 이전/다음 */
 var side=el('div','hs-side'),pan=el('div','hs-panel');
 var pe=el('div','hs-pe');pe.appendChild(ico('compass'));pe.appendChild(D.createTextNode('이 단계 안내'));
 var pt=el('div','hs-pt'),meta=el('div','hs-meta');
 var rt=B?$('rt'):$('turnLine');if(rt){rt.classList.add('hs-rt');meta.appendChild(rt)}
 var score=$('score');if(score)meta.appendChild(score);
 var cnt=el('div','hs-cnt hs-hidden'),gn=el('div','gn'),gt=el('div','gt'),pips=el('div','hs-pips'),gl=el('span','');gt.appendChild(gl);gt.appendChild(pips);cnt.appendChild(gn);cnt.appendChild(gt);
 var goalT=txt('#cover .qbox .hj-qtxt')||txt('#cover .goalbox .hj-qtxt')||txt('#cvGoal')||txt('#cGoal .hj-qtxt');
 R.querySelectorAll(':scope>p.goal:not(#turnLine)').forEach(function(g){if(!goalT)goalT=clean(g.textContent);g.classList.add('hs-hidden')});
 var goal=el('div','hs-goal');if(goalT){goal.appendChild(el('small','',B?'학습 문제':'학습 목표'));goal.appendChild(el('p','',goalT))}else goal.classList.add('hs-hidden');
 var upn=el('div','hs-up');
 var dock=el('div','hs-dock'),tg=el('div','hs-tools'),acts=el('div','hs-acts');
 if(tools)[].slice.call(tools.children).forEach(function(b){if(b.tagName==='BUTTON')tg.appendChild(b)});
 var full=tg.querySelector('[data-full]');if(full)full.classList.add('hs-hidden');
 var snd=tg.querySelector('[data-sound]');if(snd&&!snd.textContent.trim())snd.appendChild(D.createTextNode('소리'));
 var brd=el('button','hs-brd');brd.type='button';
 function setB(on){H.classList.toggle('hs-board',on);brd.classList.toggle('on',on);brd.innerHTML='';brd.appendChild(ico(on?'shrink':'expand'));brd.appendChild(D.createTextNode(on?'칠판 보기 끄기':'칠판 보기'));try{localStorage.setItem('hj-board',on?'1':'')}catch(e){}fit();kick()}
 brd.onclick=function(){setB(!H.classList.contains('hs-board'))};brd.appendChild(ico('expand'));brd.appendChild(D.createTextNode('칠판 보기'));tg.appendChild(brd);
 prev.classList.add('hs-prev');next.classList.add('hs-next');acts.appendChild(prev);acts.appendChild(next);
 var stepNo=$('stepNo');if(stepNo)stepNo.classList.add('hs-hidden');
 R.querySelectorAll(':scope>.foot button').forEach(function(b){if(b!==tn&&!acts.contains(b))b.classList.add('hs-hidden')});
 if(tn){tn.classList.add('hs-hidden');dock.appendChild(tn)}
 dock.appendChild(tg);dock.appendChild(acts);
 [pe,pt,meta,cnt,goal,upn,dock].forEach(function(x){pan.appendChild(x)});side.appendChild(pan);
 R.insertBefore(bar,R.firstChild);R.insertBefore(main,bar.nextSibling);R.insertBefore(side,main.nextSibling);

 /* 단계가 바뀔 때마다: 진행 줄 · 단계 이름 · 다음 단계 · 머리띠 · 세부 차례 */
 function nm(b){return b?clean(b.title||(b.querySelector('.hj-stt')||b).textContent).replace(/^(\d+\.|[\u2460-\u2473\u2776-\u277F])\s*/,''):''}
 function label(b){if(b.querySelector('.hj-stt')&&!b.querySelector('.hj-stn'))return;var t=nm(b);b.dataset.hjst='1';b.title=t;b.innerHTML='';b.appendChild(el('span','hj-stt',t))}
 var busy=false;
 function sync(){if(busy)return;busy=true;
  [].forEach.call(steps.querySelectorAll('.st'),label);
  var all=[].slice.call(steps.querySelectorAll('.st')),i=all.findIndex(function(b){return b.classList.contains('now')||b.classList.contains('on')}),n=all.length;
  steps.style.setProperty('--hs-p',n>1&&i>0?i/(n-1):0);steps.style.setProperty('--hs-pl',(100/(2*Math.max(n,1)))+'%');
  pt.textContent=nm(all[i])||(q?clean(q.textContent):'');
  var nx=all[i+1];upn.innerHTML='';if(nx){upn.appendChild(D.createTextNode('다음 단계'));upn.appendChild(el('b','',(i+2)+'. '+nm(nx)))}else upn.appendChild(el('b','','마지막 단계예요'));
  if(A){var h=body.querySelector('p.hd');var t=h?clean(h.textContent):'';if(ask.textContent!==t)ask.textContent=t;if(h&&!h.classList.contains('hs-moved')){h.classList.add('hs-moved');kick()}}
  var a=clean(ask.textContent);now.classList.toggle('noask',!a);alt.textContent=a?'':(nm(all[i])+' — 선생님과 함께 해요');
  if(rt)meta.classList.toggle('hs-hidden',!clean(rt.textContent)&&!(score&&score.style.display!=='none'));
  var m=stepNo&&stepNo.textContent.match(/(\d+)\s*\/\s*(\d+)/);
  if(m&&+m[2]>1){cnt.classList.remove('hs-hidden');gn.innerHTML='';gn.appendChild(D.createTextNode(m[1]));gn.appendChild(el('small','','/ '+m[2]));gl.textContent='이 단계의 차례';
   pips.innerHTML='';for(var k=1;k<=+m[2];k++)pips.appendChild(el('i',k<+m[1]?'d':k==+m[1]?'o':''))}else cnt.classList.add('hs-hidden');
  busy=false}
 var mo=new MutationObserver(function(){requestAnimationFrame(sync)});
 mo.observe(steps,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
 mo.observe(B?ask:$('body'),{childList:true,characterData:true,subtree:true});
 if(stepNo)mo.observe(stepNo,{childList:true,characterData:true,subtree:true});
 sync();
 /* 국어 덱: 앱이 본문을 키울 때(scale>1) 폭을 그만큼 줄여야 무대 밖으로 넘치지 않음(덮개의 고정 폭 규칙보다 앞서게 inline important) */
 var ib=$('bodyWrap')&&$('body');
 if(A&&ib)new MutationObserver(function(){var m=/scale\(([\d.]+)\)/.exec(ib.style.transform),g=m?+m[1]:1,v=g>1?(100/g).toFixed(3)+'%':'';
  if(v&&(ib.style.getPropertyValue('width')!==v||ib.style.getPropertyPriority('width')!=='important'))ib.style.setProperty('width',v,'important')}).observe(ib,{attributes:true,attributeFilter:['style']});

 /* 큰 화면은 1280×800 틀을 통째로 키움. 국어 덱은 무대 크기가 바뀌면 앱이 다시 맞추도록 resize를 한 번 알림 */
 function kick(){setTimeout(function(){dispatchEvent(new Event('resize'))},30)}
 function fit(){var w=innerWidth,h=innerHeight,z=w<=900?1:Math.max(.8,Math.min(w/1280,h/800));H.style.setProperty('--hs-z',z.toFixed(3))}
 addEventListener('resize',fit);fit();
 try{if(localStorage.getItem('hj-board')==='1')setB(true)}catch(e){}
 kick();
})();
