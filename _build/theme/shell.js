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
  compass:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM15.5 8.5l-2 5-5 2 2-5z',flag:'M5 21V4M5 4h11l-2 4 2 4H5',expand:'M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5',chevl:'M15 6l-6 6 6 6',chevr:'M9 6l6 6-6 6',shrink:'M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5'};
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
 /* v6 왼쪽 '수업 길'(2026-10-29 선생님과 정함): 학습 문제 + 단계 목록(실제 단계 단추를 옮김) · 접기/펼치기(기기에 기억, 칠판 보기에서는 접힘)
    도구와 이전/다음은 무대 아래 막대, 활동 방법·시간은 '지금 할 일' 줄로. 오른쪽 안내 판은 숨김(겹치는 정보) */
 var rail=el('aside','hs-rail'),fold=el('button','hs-fold');fold.type='button';
 function setR(c,save){H.classList.toggle('hs-rc',c);fold.setAttribute('aria-expanded',c?'false':'true');fold.title=c?'수업 길 펼치기':'수업 길 접기';
  fold.innerHTML='';fold.appendChild(ico(c?'chevr':'chevl'));fold.appendChild(el('span','',c?'수업 길 펼치기':'수업 길 접기'));
  if(save){try{localStorage.setItem('hj-rail',c?'c':'')}catch(e){}kick()}}
 fold.onclick=function(){setR(!H.classList.contains('hs-rc'),true)};
 rail.appendChild(fold);rail.appendChild(goal);rail.appendChild(path);R.insertBefore(rail,main);
 var bot=el('div','hs-bot');dock.insertBefore(cnt,acts);bot.appendChild(dock);main.appendChild(bot);now.appendChild(meta);
 H.classList.add('hs-rl');var rc=false;try{rc=localStorage.getItem('hj-rail')==='c'}catch(e){}setR(rc,false);

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

 /* 교과서 덱(사회 등): 한 화면 활동이 무대보다 조금 길면 본문을 80%까지 줄여 스크롤 없이 한눈에(앱이 스스로 키우는 국어는 빼고, 휴대폰은 스크롤 그대로) */
 var sto=0,sb0=body;
 function kids(){return [].filter.call(sb0.children,function(c){return !c.classList.contains('hs-moved')&&c.offsetParent!==null||c.style.zoom})}
 function shrink(){if(!A||!sb0)return;if(ib&&/scale\(/.test(ib.style.transform||''))return;
  var inner=sb0.id==='bodyWrap'?[ib]:kids();inner.forEach(function(c){c.style.zoom=''});
  if(innerWidth<=900)return;var ch=sb0.clientHeight,sh=sb0.scrollHeight;if(sh-ch<=8||ch<200)return;
  var cs=getComputedStyle(sb0),pad=parseFloat(cs.paddingTop)+parseFloat(cs.paddingBottom);
  var z=Math.max(.8,Math.floor((ch-pad-6)/(sh-pad)*100)/100);inner.forEach(function(c){c.style.zoom=z});
  for(var t=0;t<3&&z>.8&&sb0.scrollHeight-sb0.clientHeight>8;t++){z=Math.max(.8,Math.floor(z*(sb0.clientHeight-pad-6)/(sb0.scrollHeight-pad)*100)/100);inner.forEach(function(c){c.style.zoom=z})}}
 function shrinkSoon(){clearTimeout(sto);sto=setTimeout(shrink,140)}
 if(A&&sb0){new MutationObserver(function(ms){if(ms.some(function(m){return m.type==='childList'}))shrinkSoon()}).observe(sb0,{childList:true,subtree:true});addEventListener('resize',shrinkSoon);sb0.addEventListener('load',shrinkSoon,true);if(D.fonts)D.fonts.ready.then(shrinkSoon);shrinkSoon()}

 /* 큰 화면은 1280×800 틀을 통째로 키움. 국어 덱은 무대 크기가 바뀌면 앱이 다시 맞추도록 resize를 한 번 알림 */
 function kick(){setTimeout(function(){dispatchEvent(new Event('resize'))},30)}
 function fit(){if(H.style.zoom)H.style.zoom='';/* 앱이 html을 키우는 것(사회 홍지희 버전)은 끄고 껍데기 확대 하나만 */var w=innerWidth,h=innerHeight,z=w<=900?1:Math.max(.8,Math.min(w/1280,h/800));H.style.setProperty('--hs-z',z.toFixed(3))}
 new MutationObserver(function(){if(H.style.zoom)H.style.zoom=''}).observe(H,{attributes:true,attributeFilter:['style']});
 addEventListener('resize',fit);fit();
 try{if(localStorage.getItem('hj-board')==='1')setB(true)}catch(e){}
 kick();
})();

/* ===== 수업 표지(첫 화면)도 같은 껍데기로 (2026-10-27) =====
   남색 앱 막대 · 무대('오늘 배울 것' 머리띠 + 제목 · 학습 문제 · 핵심 질문 · 수업 흐름 카드 — 흐름은 한 번만) · 오른쪽 '오늘의 수업'(시간·단계 수 · 활동 단위 · 도구 · 사진 출처 · 수업 시작).
   엔진은 표지 요소를 id로 찾아 글만 바꾸므로(cTitle·cGoal·cPlan·plan·cvGoal…) 노드째 옮김. */
(function(){
 var D=document,H=D.documentElement,$=function(i){return D.getElementById(i)};
 var C=$('cover');if(!C||!H.classList.contains('hs')||C.querySelector('.hs-bar'))return;
 var cv=C.classList.contains('hj-cv')?C:C.querySelector('.hj-cv');if(!cv)return;
 var go=C.querySelector('#btnGo,#go');if(!go)return;
 var NS='http://www.w3.org/2000/svg';
 var P={play:'M8 5.5v13l10.5-6.5z',board:'M4 5h16v10H4zM8 19h8M12 15v4',lock:'M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3',spark:'M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8',
  book:'M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5zM4 20.5A2.5 2.5 0 0 0 6.5 23H20',clock:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2',users:'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21c0-3.9 3.1-7 7-7s7 3.1 7 7M16 3.2a4 4 0 0 1 0 7.6M22 21c0-3.2-2-5.9-5-6.7',flow:'M5 6h14M5 12h14M5 18h9'};
 function ico(k){var s=D.createElementNS(NS,'svg');s.setAttribute('viewBox','0 0 24 24');s.setAttribute('class','hs-ico');s.setAttribute('aria-hidden','true');var p=D.createElementNS(NS,'path');p.setAttribute('d',P[k]);s.appendChild(p);return s}
 function el(t,c,txt){var e=D.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=txt;return e}
 function clean(t){return (t||'').replace(/[\u{1F000}-\u{1FAFF}☀-➿⬀-⯿⌀-⏿️‍]/gu,'').replace(/\s+/g,' ').trim()}
 function lab(k,t){var d=el('div','hs-sec');d.appendChild(ico(k));d.appendChild(D.createTextNode(t));return d}
 C.classList.add('hs-root','hs-cover');

 /* 앱 막대 */
 var bar=el('div','hs-bar'),navBox=el('div','hs-nav');bar.appendChild(navBox);
 function takeNav(){var n=C.querySelector('.hj-cvtop .hj-nav');if(!n)return false;while(n.firstChild)navBox.appendChild(n.firstChild);n.remove();return true}
 if(!takeNav()){var no=new MutationObserver(function(){if(takeNav())no.disconnect()});no.observe(C,{childList:true,subtree:true});setTimeout(function(){no.disconnect()},5000)}
 var h1=cv.querySelector('h1');
 var ttl=el('div','hs-ttl');ttl.appendChild(el('b','',clean(h1?h1.textContent:D.title)));
 var sub=C.querySelector('#cSub,#cvSub')||cv.querySelector(':scope>p.lead');ttl.appendChild(el('span','',clean(sub?sub.textContent:'')));
 var tabs=el('div','hs-tabs'),tLes=el('button','hs-tab on');tLes.type='button';tLes.appendChild(ico('play'));tLes.appendChild(D.createTextNode('수업'));tabs.appendChild(tLes);
 var qb=$('qb0');if(qb){var tQ=el('button','hs-tab');tQ.type='button';tQ.appendChild(ico('board'));tQ.appendChild(D.createTextNode('우리 반 판'));tQ.onclick=function(){qb.click()};tabs.appendChild(tQ)}
 var tn=C.querySelector('#tOpen0,#tn0');
 if(tn){var tT=el('button','hs-tab lk');tT.type='button';tT.title='선생님: 길게 눌러 열어요';tT.appendChild(ico('lock'));tT.appendChild(D.createTextNode('선생님'));
  var tm=0;function up(){clearTimeout(tm);tT.classList.remove('hold')}
  tT.addEventListener('pointerdown',function(){tT.classList.add('hold');tm=setTimeout(function(){up();tn.click()},700)});['pointerup','pointerleave','pointercancel'].forEach(function(k){tT.addEventListener(k,up)});
  tT.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();tn.click()}});tabs.appendChild(tT)}
 bar.appendChild(ttl);bar.appendChild(tabs);

 /* 무대 */
 var main=el('div','hs-main'),stage=el('div','hs-stage'),now=el('div','hs-now'),tag=el('span','tag');tag.appendChild(ico('spark'));tag.appendChild(D.createTextNode('오늘 배울 것'));
 now.appendChild(tag);if(h1){h1.classList.add('hs-ctitle');now.appendChild(h1)}
 var sb=el('div','hs-sb hs-csb');
 var badge=$('cBadge');if(badge){badge.classList.add('hs-badge');sb.appendChild(badge)}
 var goal=C.querySelector('#cGoal,#cvGoal')||cv.querySelector('.hj-cvpanel>.qbox');if(goal){goal.classList.add('hs-cgoal');sb.appendChild(goal)}
 var bq=$('cBq');if(bq){bq.classList.add('hs-cbq');sb.appendChild(bq)}
 var plan=C.querySelector('#plan,#cPlan');
 if(plan){var pw=el('div','hs-cflow');pw.appendChild(lab('flow','수업 흐름'));plan.classList.add('hs-plan');pw.appendChild(plan);sb.appendChild(pw)}
 var ml=cv.querySelector('.hj-maplab'),map=$('cMap');if(map){var mw=el('div','hs-cmap');if(ml)mw.appendChild(ml);mw.appendChild(map);sb.appendChild(mw)}
 stage.appendChild(now);stage.appendChild(sb);main.appendChild(stage);

 /* 오른쪽: 오늘의 수업 */
 var side=el('div','hs-side'),pan=el('div','hs-panel');
 var pe=el('div','hs-pe');pe.appendChild(ico('book'));pe.appendChild(D.createTextNode('오늘의 수업'));pan.appendChild(pe);
 var mins=0,nst=0;if(plan)[].forEach.call(plan.querySelectorAll('.st'),function(b){nst++;var m=/(\d+)\s*분/.exec(b.textContent);if(m)mins+=+m[1]});
 var facts=el('div','hs-facts');
 if(mins){var f1=el('div','hs-fact');f1.appendChild(el('b','',mins+'분'));f1.appendChild(el('span','','수업 시간'));facts.appendChild(f1)}
 if(nst){var f2=el('div','hs-fact');f2.appendChild(el('b','',nst+'단계'));f2.appendChild(el('span','','수업 단계'));facts.appendChild(f2)}
 if(facts.children.length)pan.appendChild(facts);
 var seg=$('segTeam');if(seg){var sw=el('div','hs-cseg');sw.appendChild(lab('users','활동 단위 · 선생님이 골라요'));sw.appendChild(seg);pan.appendChild(sw)}
 var pj=$('pjCard');if(pj){pj.classList.add('hs-cpj');pan.appendChild(pj)}
 var dock=el('div','hs-dock'),tg=el('div','hs-tools');
 [].forEach.call(cv.querySelectorAll('.hj-cvtools>button,.hj-cvtop>a.tolist'),function(b){if(b!==tn&&b!==qb)tg.appendChild(b)});
 if(tn){tn.classList.add('hs-hidden');dock.appendChild(tn)}if(qb){qb.classList.add('hs-hidden');dock.appendChild(qb)}
 if(tg.children.length)dock.appendChild(tg);
 var phc=$('phc');if(phc){phc.classList.add('hs-phc');dock.appendChild(phc)}
 var acts=el('div','hs-acts');go.classList.add('hs-next','hs-go');acts.appendChild(go);dock.appendChild(acts);
 pan.appendChild(dock);side.appendChild(pan);
 C.insertBefore(bar,C.firstChild);C.insertBefore(main,bar.nextSibling);C.insertBefore(side,main.nextSibling);
 if(cv!==C)cv.classList.add('hs-hidden');
})();

/* ===== 수학 앱(교과서·이야기 버전, #app) — 같은 껍데기 (2026-10-27) =====
   엔진이 화면마다 #app을 통째로 다시 그리므로(mount), 그릴 때마다 차시 화면(main.lesson)을 다시 배치:
   위 머리줄 = 남색 앱 막대(CSS) · 개념 계단 = 위 단계 길 · 작업 = 무대('지금 할 일' 머리띠 = 안내 글, 질문 = 계단 이름)
   · 오른쪽 '이 계단 안내'(계단 이름 · S.O.O.P. · 탐구 질문 · 이야기 · 차시 지도로/주소 복사 · 도움 · 다음 계단 · 맞음/틀림 알림). */
(function(){
 var D=document,H=D.documentElement,app=D.getElementById('app');
 if(!app||H.getAttribute('data-hjsubj')!=='math'||H.classList.contains('hs'))return;
 var NS='http://www.w3.org/2000/svg';
 var P={pen:'M4 20l4-1L19 8l-3-3L5 16zM14 6l3 3',stairs:'M4 20h5v-5h5v-5h6V5',chevl:'M15 6l-6 6 6 6',chevr:'M9 6l6 6-6 6',expand:'M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5',shrink:'M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5'};
 function ico(k){var s=D.createElementNS(NS,'svg');s.setAttribute('viewBox','0 0 24 24');s.setAttribute('class','hs-ico');s.setAttribute('aria-hidden','true');var p=D.createElementNS(NS,'path');p.setAttribute('d',P[k]);s.appendChild(p);return s}
 function el(t,c,txt){var e=D.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=txt;return e}
 function clean(t){return (t||'').replace(/[\u{1F000}-\u{1FAFF}☀-➿⬀-⯿⌀-⏿️‍]/gu,'').replace(/\s+/g,' ').trim()}
 H.classList.add('hs','hs-math');
 function arrange(){var M=app.querySelector('main.lesson');if(!M||M.classList.contains('hs-ml'))return;
  var stairs=M.querySelector('nav.stairs'),work=M.querySelector('section.work');if(!stairs||!work)return;
  M.classList.add('hs-ml');
  var path=el('div','hs-mpath');[].forEach.call(stairs.querySelectorAll('.stair'),function(b){var l=b.querySelector('.lbl');if(l){b.title=clean(l.textContent);l.textContent=clean(l.textContent).split(/\s+[—–-]\s+/)[0]}path.appendChild(b)});
  var n=path.children.length,cur=[].findIndex.call(path.children,function(b){return b.classList.contains('cur')});
  path.style.setProperty('--hs-p',n>1&&cur>0?cur/(n-1):0);path.style.setProperty('--hs-pl',(100/(2*Math.max(n,1)))+'%');
  /* 무대 */
  var stage=el('div','hs-stage'),now=el('div','hs-now'),tag=el('span','tag');tag.appendChild(ico('pen'));tag.appendChild(D.createTextNode('지금 할 일'));now.appendChild(tag);
  var inst=work.querySelector(':scope>p.inst'),sh=work.querySelector(':scope>.stephead'),h2=sh&&sh.querySelector('h2');
  var nm=h2?clean(h2.textContent).replace(/^(\d+|★)\.\s*/,''):'';
  if(inst){inst.classList.add('hs-ask');now.appendChild(inst)}else now.appendChild(el('p','hs-ask',nm+' — 차례대로 해 봐요'));
  var sb=el('div','hs-sb hs-msb');if(sh){sh.classList.add('hs-mhead');sb.appendChild(sh)}
  /* 오른쪽 */
  var side=el('div','hs-side'),pan=el('div','hs-panel'),pe=el('div','hs-pe');pe.appendChild(ico('stairs'));pe.appendChild(D.createTextNode('이 계단 안내'));pan.appendChild(pe);
  pan.appendChild(el('div','hs-pt',nm));
  var meta=el('div','hs-meta'),sp=stairs.querySelector('.soopb');if(sp){sp.classList.add('hs-rt');meta.appendChild(sp)}pan.appendChild(meta);
  var q=work.querySelector(':scope>.q');if(q){var gq=el('div','hs-goal');gq.appendChild(el('small','','탐구 질문'));gq.appendChild(el('p','',clean(q.textContent).replace(/^탐구 질문\s*·\s*/,'')));pan.appendChild(gq);q.classList.add('hs-hidden')}
  var sc=work.querySelector(':scope>.scene');if(sc){sc.classList.add('hs-mscene');pan.appendChild(sc)}
  var ttl=stairs.querySelector('.title');if(ttl){var up=el('div','hs-up');up.appendChild(D.createTextNode('이 차시'));up.appendChild(el('b','',clean(ttl.textContent)));pan.appendChild(up)}
  var dock=el('div','hs-dock'),tg=el('div','hs-tools');
  [].forEach.call(stairs.querySelectorAll('button.back'),function(b){tg.appendChild(b)});
  var acts=work.querySelector(':scope>.actions');
  dock.appendChild(tg);if(acts){acts.classList.add('hs-macts');dock.appendChild(acts)}
  /* v6 왼쪽 '수업 길'(2026-10-29): 탐구 질문·개념 정리·이 차시 + 세로 계단 목록(실제 계단 단추), 아래 막대 = 도구 · 이전/다음 계단 */
  var rail=el('aside','hs-rail hs-mrail'),fold=el('button','hs-fold');fold.type='button';fold.onclick=function(){setR(!H.classList.contains('hs-rc'),true)};rail.appendChild(fold);
  [].forEach.call(pan.querySelectorAll(':scope>.hs-goal,:scope>.hs-mscene,:scope>.hs-up'),function(x){rail.appendChild(x)});
  if(meta.childNodes.length)now.appendChild(meta);
  var bot=el('div','hs-bot');bot.appendChild(dock);
  side.appendChild(pan);
  while(work.firstChild)sb.appendChild(work.firstChild);
  if(sh&&sh.parentNode!==sb)sb.insertBefore(sh,sb.firstChild);
  stage.appendChild(now);stage.appendChild(sb);work.appendChild(stage);work.appendChild(bot);
  stairs.innerHTML='';rail.insertBefore(path,rail.querySelector('.hs-mscene')||rail.querySelector('.hs-up'));stairs.classList.add('hs-hidden');
  M.insertBefore(rail,M.firstChild);H.classList.add('hs-rl');setR(H.classList.contains('hs-rc'),false);
 }
 function setR(c,save){H.classList.toggle('hs-rc',c);[].forEach.call(D.querySelectorAll('.hs-fold'),function(f){f.setAttribute('aria-expanded',c?'false':'true');f.title=c?'수업 길 펼치기':'수업 길 접기';
   f.innerHTML='';f.appendChild(ico(c?'chevr':'chevl'));f.appendChild(el('span','',c?'수업 길 펼치기':'수업 길 접기'))});if(save)try{localStorage.setItem('hj-rail',c?'c':'')}catch(e){}}
 try{if(localStorage.getItem('hj-rail')==='c')H.classList.add('hs-rc')}catch(e){}
 new MutationObserver(arrange).observe(app,{childList:true,subtree:true});arrange();
 /* 큰 화면: 앱 막대·단계 길·머리띠·오른쪽 판을 1280 기준으로 비례해 키움(활동은 앱이 스스로 맞춤) */
 function fit(){var w=innerWidth,h=innerHeight,z=w<=900?1:Math.max(1,Math.min(w/1280,h/800));H.style.setProperty('--hs-z',z.toFixed(3))}
 addEventListener('resize',fit);fit();
})();

/* 과학 '한 화면' 앱: 색과 모양만 껍데기에 맞춤(크기는 그대로 — 쪽 나눔 불변) */
(function(){var D=document,H=D.documentElement;if(!D.getElementById('ovBar')||H.classList.contains('hs'))return;H.classList.add('hs-sci');
 /* v6 왼쪽 '수업 길'(2026-10-29 선생님: 과학 교과서도 같은 배치) — 쪽 나눔이 바뀌지 않게 본문 폭(1080px)을 줄이지 않는 자리에서만:
    넓은 화면(1340px~)은 펼치거나 접기(기기에 기억 hj-rail), 1150~1339px은 접힌 64px(펼치면 본문 위에 떠서 열림), 그보다 좁으면 없음(위 단계 탭 그대로).
    단계는 위 막대의 단계 탭을 그대로 누름(탭은 높이를 지키려고 감추기만 함) */
 var tabs=[].slice.call(D.querySelectorAll('body>nav .wrap>a[href^="#s"]'));if(!tabs.length)return;
 var NS='http://www.w3.org/2000/svg';function ico(d){var v=D.createElementNS(NS,'svg');v.setAttribute('viewBox','0 0 24 24');v.setAttribute('class','hs-ico');v.setAttribute('aria-hidden','true');var q=D.createElementNS(NS,'path');q.setAttribute('d',d);v.appendChild(q);return v}
 function el(t,c,x){var e=D.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
 var rail=el('aside','hs-srail'),fold=el('button','hs-fold');fold.type='button';rail.setAttribute('aria-label','수업 길');
 var goal=D.querySelector('main p.goal'),gt='';if(goal){var tmp=el('div');tmp.innerHTML=goal.innerHTML.replace(/<br\s*\/?>/gi,' ');gt=tmp.textContent.replace(/\s+/g,' ').replace(/^\s*🎯?\s*학습 목표\s*/,'').trim()}
 rail.appendChild(fold);
 if(gt){var g=el('div','hs-sgoal');g.appendChild(el('small','','학습 목표'));g.appendChild(el('p','',gt));rail.appendChild(g)}
 var list=el('ol','hs-slist'),items=tabs.map(function(a,i){var li=el('li'),b=el('button','hs-sst');b.type='button';b.title=(a.title||a.textContent).trim();
  b.appendChild(el('i','',String(i+1)));b.appendChild(el('b','',(a.title||a.textContent.replace(/^[①-⑳\d.\s]+/,'')).trim()));
  b.onclick=function(){if(!H.classList.contains('hs-swide')&&!H.classList.contains('hs-rc'))setR(true,false);a.click()};li.appendChild(b);list.appendChild(li);return b});
 rail.appendChild(list);D.body.appendChild(rail);H.classList.add('hs-srl');
 function sync(){var cur=tabs.findIndex(function(a){return a.classList.contains('hj-cur')});items.forEach(function(b,i){b.classList.toggle('now',i===cur);b.classList.toggle('done',cur>-1&&i<cur);if(i===cur)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current')})}
 new MutationObserver(sync).observe(D.querySelector('body>nav'),{attributes:true,subtree:true,attributeFilter:['class']});sync();
 function setR(c,save){H.classList.toggle('hs-rc',c);fold.setAttribute('aria-expanded',c?'false':'true');fold.title=c?'수업 길 펼치기':'수업 길 접기';fold.innerHTML='';fold.appendChild(ico(c?'M9 6l6 6-6 6':'M15 6l-6 6 6 6'));fold.appendChild(el('span','',c?'수업 길 펼치기':'수업 길 접기'));if(save)try{localStorage.setItem('hj-rail',c?'c':'')}catch(e){}}
 fold.onclick=function(){setR(!H.classList.contains('hs-rc'),H.classList.contains('hs-swide'))};
 function fit(){var w=innerWidth;H.classList.toggle('hs-swide',w>=1340);H.classList.toggle('hs-snone',w<1150);
  if(w<1340){if(!H.classList.contains('hs-rc'))setR(true,false)}else{var c=false;try{c=localStorage.getItem('hj-rail')==='c'}catch(e){}setR(c,false)}}
 addEventListener('resize',fit);fit();
 D.addEventListener('click',function(e){if(!H.classList.contains('hs-swide')&&!H.classList.contains('hs-rc')&&!e.target.closest('.hs-srail'))setR(true,false)});
})();

/* 그 밖의 앱: 덮개가 본문 맨 위에 둔 [홈 · 자료 목록](.hj-navbar)을 남색 앱 막대로(맨 위 전체 폭) + 제목 */
(function(){var H=document.documentElement,D=document;
 var SKIP=/^(초등교사 홍지희|기타|프로젝트|공통|수학게임|특색교육)$/;
 function parts(){var t=(D.title||'').split(/\s*·\s*/).filter(function(x){return x&&!SKIP.test(x)});return t}
 function go(){var w=D.querySelector('.hj-navbar');
  if(!w){var tb=D.querySelector('section.screen.on>.topbar>.hj-nav');if(tb&&!H.classList.contains('hs')){H.classList.add('hs-et');return true}return false}
  if(!w.querySelector('.hj-nav'))return false;
  if(H.classList.contains('hs')||H.classList.contains('hs-math')||H.classList.contains('hs-sci'))return true;
  H.classList.add('hs-e');w.classList.add('hs-ebar');
  if(w.parentNode!==D.body||D.body.firstElementChild!==w)D.body.insertBefore(w,D.body.firstChild);
  if(!w.querySelector('.hs-ettl')){var p=parts(),t=D.createElement('div');t.className='hs-ettl';
   var b=D.createElement('b');b.textContent=(p[0]||'').replace(/^\d+\.\s*/,'');t.appendChild(b);
   if(p.length>1){var s=D.createElement('span');s.textContent=p.slice(1).join(' · ');t.appendChild(s)}
   w.appendChild(t)}
  return true}
 if(!go()){var n=0,iv=setInterval(function(){if(go()||++n>40)clearInterval(iv)},100)}
})();
