/* ───────── 자석의 이용: 장면 · 행동 단추 · 오늘의 실험 그림 · 첫 화면 ───────── */
function fxOn(id){return UI.fx&&UI.fx.id===id}
function has(id){const r=R(),k=idxOf(id);if(k<0)return false;return k<r.step||(k===r.step&&(!!r.done[id]||fxOn(id)))}
const sn=id=>!!R().seen[id]||fxOn(id);   /* 해 본 행동(또는 지금 하는 중) */
const stv=k=>(R().st||{})[k]||0;
/* 지금 움직이는 차례 행동의 번호(없으면 -1) */
function fxSeq(ids){const f=UI.fx;return f?ids.indexOf(f.id):-1}

/* 실험 1: 물체에 막대자석 가까이 하기 — 왼쪽 물체들, 오른쪽 가까이 보기 */
const NPOS=[[140,120],[350,120],[140,280],[350,280],[140,440],[350,440]];
const CU={y:300,edge:680,tip:700,back:50,mw:180,mh:52};
function nearArt(keys,o){o=o||{};const cur=UI.mq.cur&&keys.indexOf(UI.mq.cur)>=0?UI.mq.cur:null,f=UI.fx&&/^n/.test(UI.fx.id);let g=bgTop();
 keys.forEach((k,i)=>{const [x,y]=NPOS[i];if(k===cur)g+='<rect x="'+(x-62)+'" y="'+(y-52)+'" width="124" height="90" rx="12" fill="none" stroke="#9E968A" stroke-width="2.4" stroke-dasharray="8 6"/>';
  else g+=objAt(k,x,y-12,1.3);g+=objName(k,x,y+50,OBJK.indexOf(k))});
 g+='<rect x="470" y="40" width="460" height="460" rx="22" fill="var(--w-label)" fill-opacity=".55" stroke="var(--w-felt-s)" stroke-width="2"/>';
 const mx=CU.tip+CU.mw/2+CU.back;
 if(!cur)return g+magBar(mx,CU.y,CU.mw,CU.mh,{gray:1})+qmark(600,CU.y);
 const at=OBJ[cur].at,hw=OHW[cur],ox0=CU.edge-hw;
 g+='<g'+(f?an('lb-a-mgm',0,'--a0:110px;--a1:-'+CU.back+'px'):'')+'>'+magBar(mx,CU.y,CU.mw,CU.mh,{gray:1})+'</g>';
 if(at)g+='<g'+(f?an('lb-a-mgo',0,'--a0:-'+(CU.back+CU.tip-CU.edge)+'px;--a1:-'+CU.back+'px'):'')+'>'+objAt(cur,CU.tip+CU.back-hw,CU.y,1.5)+'</g>';
 else g+=objAt(cur,ox0,CU.y,1.5);
 return g}
function tieSpot(){if(!sn('tP')||UI.fx)return null;return sn('tM')?[480,284,30,2.4,790,140]:[480,313,30,2.4,790,140]}
function tieScene(){const P=sn('tP'),M=sn('tM'),fm=fxOn('tM');let g=bgTop();
 const tie=y=>'<g transform="translate(480 '+y+') scale(3.2)">'+objArt('tie',{peel:P})+'</g>';
 g+=M?(fm?'<g'+an('lb-a-mv',.85,'--dy:28px;animation-duration:.45s')+'>'+tie(272)+'</g>':tie(272)):tie(300);
 if(M)g+='<g'+(fm?an('lb-a-mv',0,'--dy:-170px;animation-duration:.9s'):'')+'>'+magV(480,279,190)+'</g>';
 if(!P&&!fxOn('tP'))g+=magnifier(650,200,1.1,0);
 if(fxOn('tP'))g+='<g'+an('lb-a-pop',.2)+'>'+tag(480,430,'선생님이 겉을 벗겨 둔 곳',20)+'</g>';
 return g}
/* 이름표 보기: 물체 아홉 가지 */
const MPOS=OBJK.map((k,i)=>[200+(i%3)*280,90+Math.floor(i/3)*164]);
function matArt(){const cur=UI.mq.cur;let g=bgTop();
 OBJK.forEach((k,i)=>{const [x,y]=MPOS[i];if(k===cur)g+='<circle cx="'+x+'" cy="'+y+'" r="66" fill="var(--w-label)" fill-opacity=".6" stroke="var(--lb-sci)" stroke-width="3"/>';
  g+=objAt(k,x,y-4,1.3,{peel:k==='tie'});
  if(NAR){g+=chip(x,y+50,i+1,15);LEG.push([null,(i+1)+' '+OBJ[k].n+(sn('m'+k)?' · 재료: '+OBJ[k].mat:'')]);return}
  g+=objName(k,x,y+56,i);
  if(sn('m'+k))g+='<g'+(fxOn('m'+k)?an('lb-a-pop',.1):'')+'>'+tag(x,y+92,'재료: '+OBJ[k].mat,19)+'</g>'});
 return g}

/* 실험 2: 관찰 도움판 · 들어 올리기 */
const SLOW={cy:281,clip:330,tips:[570,520,470,430],mw:220,mh:50};
function slowSpot(){return stv('sl')>=3&&!UI.fx?[SLOW.tips[3]-24,SLOW.cy,44,2,700,120]:null}
function boardArt(n,anim){const S=SLOW,fi=fxSeq(['s1','s2','s3']),k=fi>=0?fi+1:n;let g=bgTop()+helpBoard();
 const tip=S.tips[Math.min(k,3)],prev=S.tips[Math.max(0,Math.min(k,3)-1)];
 g+='<g'+(fi>=0?an('lb-a-slide',0,'--dx:'+(prev-tip)+'px'):'')+'>'+magBar(tip+S.mw/2,S.cy,S.mw,S.mh,{gray:1})+'</g>';
 const jump=k>=3,cx=jump?S.tips[3]-OHW.clip*1.6+2:S.clip;
 g+='<g'+(fi===2?an('lb-a-slide',.85,'--dx:'+(S.clip-cx)+'px'):anim?an('lb-a-pop',.1):'')+'>'+objAt('clip',cx,S.cy,1.6)+'</g>';
 return g}
const LIFT={x:480,clipY:412,up:236,len:190};
function liftArt(key,ids,plate){const n=stv(key),fi=fxSeq(ids),k=fi>=0?fi+1:n,N=ids.length,off=plate?1:0,X=LIFT.x;let g=bg({});
 const pl=plate&&k>=1?plate:null,pT=pl?10:0,tipNear=LIFT.clipY-6-pT,sg=k-off;
 if(sg<=0){g+=clipFlat(X,LIFT.clipY);if(plate&&fi===0)return g+magV(X,LIFT.up,LIFT.len)+'<g'+an('lb-a-pop',.2)+'>'+plateArt(X,LIFT.up,pl)+'</g>';return g+magV(X,LIFT.up,LIFT.len,{plate:pl})}
 if(sg===1)return g+clipFlat(X,LIFT.clipY)+'<g'+(fi===off?an('lb-a-mv',0,'--dy:'+(LIFT.up-tipNear)+'px'):'')+'>'+magV(X,tipNear,LIFT.len,{plate:pl})+'</g>';
 return g+'<g'+(fi===N-1?an('lb-a-mv',0,'--dy:'+(tipNear-LIFT.up)+'px;animation-duration:1.3s'):'')+'>'+magV(X,LIFT.up,LIFT.len,{plate:pl})+clipHang(X,LIFT.up+pT)+'</g>'}

/* 실험 3: 빵 끈 조각 그릇 */
function endSpot(w){const key=w==='bar'?'br':'cy';if(stv(key)<2||UI.fx||stv(key)>=3)return null;const half=w==='bar'?120:100;return [480-half-6,190,44,1.9,210,380]}
function bowlArt(kind,key,ids){const n=stv(key),fi=fxSeq(ids),k=fi>=0?fi+1:n;let g=bg({});
 const M=(cy)=>kind==='bar'?magBar(480,cy,240,44,{gray:1}):cylMag(480,cy,200,56),W=kind==='bar'?240:212,H=kind==='bar'?44:56;
 if(k===0)return g+bowlBack(26)+bowlFront()+M(190);
 if(k===1)return g+bowlBack(26)+'<g'+(fi===0?an('lb-a-mv',0,'--dy:-128px'):'')+'>'+M(318)+'</g>'+bowlFront();
 if(k>=3)return g+bowlBack(7)+bowlFront()+'<g'+(fi===2?an('lb-a-mv',0,'--dy:-60px'):'')+'>'+magBar(480,120,240,44,{gray:1})+stuckPieces(480,120,240,44,3)+'</g><g'+(fi===2?an('lb-a-mv',0,'--dy:70px'):'')+'>'+M(240)+stuckPieces(480,240,W,H,5)+'</g>';
 return g+bowlBack(7)+bowlFront()+'<g'+(fi===1?an('lb-a-mv',0,'--dy:128px;animation-duration:1.4s'):'')+'>'+M(190)+stuckPieces(480,190,W,H,kind==='bar'?3:5)+'</g>'}
function tidyArt(){const on=has('tidy'),f=fxOn('tidy');let g=bg({})+bowlBack(14)+bowlFront();
 const out=[[250,420,.2],[296,424,1.1],[330,418,2],[640,422,.6],[690,418,1.6],[724,424,2.6]];
 if(!on||f)g+='<g'+(f?an('lb-a-out',1.2):'')+'>'+out.map((p,i)=>piece(p[0],p[1],p[2],18,i)).join('')+'</g>';
 if(f)g+='<g'+an('lb-a-slide',0,'--dx:-380px;animation-duration:1.8s')+'>'+magBar(700,380,200,40,{gray:1})+'</g>';
 return g}

/* 실험 4: 포일로 감싼 자석 · 같은 극과 다른 극 */
const FOIL={cx:480,cy:300,w:300,h:64};
function foilScene(){const cur=UI.mq.cur,f=UI.fx;let g=bgTop();const F=FOIL;
 if(cur!=='fL'&&cur!=='fR')return g+magBar(F.cx,F.cy,F.w,F.h,{foil:1})+qmark(480,170);
 if(cur==='fL'){const a=fxOn('fL');g+='<g'+(a?an('lb-a-slide',.9,'--dx:30px'):'')+'>'+magBar(F.cx-30,F.cy,F.w,F.h,{foil:1})+'</g>';
  g+='<g'+(a?an('lb-a-slide',0,'--dx:-150px'):'')+'>'+magBar(300-110,F.cy,220,52,{left:'S'})+'</g>';return g}
 const a=fxOn('fR');g+='<g'+(a?an('lb-a-slide',.9,'--dx:40px'):'')+'>'+magBar(F.cx-40,F.cy,F.w,F.h,{foil:1})+'</g>'+'<g'+(a?an('lb-a-fade',1.6):'')+' stroke="#7D8793" stroke-width="3" stroke-linecap="round" opacity=".7"><path d="M598 284 h22"/><path d="M598 300 h30"/><path d="M598 316 h22"/></g>';
 g+='<g'+(a?an('lb-a-slide',0,'--dx:150px'):'')+'>'+magBar(670+110,F.cy,220,52,{left:'N'})+'</g>';return g}
function peelSpot(){const c=UI.mq.cur;if(UI.fx)return null;if(c==='pL')return [FOIL.cx-FOIL.w/2+36,FOIL.cy,40,2,300,130];if(c==='pR')return [FOIL.cx+FOIL.w/2-36,FOIL.cy,40,2,660,130];return null}
function peelScene(){const F=FOIL;let g=bgTop()+magBar(F.cx,F.cy,F.w,F.h,{foil:1,peelL:sn('pL'),peelR:sn('pR'),animL:fxOn('pL'),animR:fxOn('pR')});
 const ball=(x,a)=>'<g'+(a?an('lb-a-pop',.3):'')+'><circle cx="'+x+'" cy="420" r="16" fill="#CDD3DA" stroke="#7D8793" stroke-width="2"/><path d="M'+(x-8)+' 414 l6 8 l6 -10 l5 6" stroke="#9AA4AF" stroke-width="1.6" fill="none"/></g>';
 if(sn('pL'))g+=ball(300,fxOn('pL'));if(sn('pR'))g+=ball(660,fxOn('pR'));
 if(!sn('pL')&&!sn('pR'))g+=qmark(480,170);return g}
/* 두 자석: L·R = 서로 마주 보는 극. push면 밀려나고, 아니면 붙음 */
function pairArt(id,anim){const P={mNN:['N','N',1],mSS:['S','S',1],mNS:['N','S',0]}[id],w=220,h=52,cy=300;let g=bgTop();
 const lc=P[2]?300:370,rc=P[2]?660:590;   /* 마지막 자리 */
 const lOpt={left:P[0]==='N'?'S':'N'},rOpt={left:P[1]};
 const kf=P[2]?'--a0:-60px;--a1:55px':'--a0:-80px;--a1:-25px',kr=P[2]?'--a0:60px;--a1:-55px':'--a0:80px;--a1:25px';
 g+='<g'+(anim?an('lb-a-mgm',0,kf):'')+'>'+magBar(lc,cy,w,h,lOpt)+'</g><g'+(anim?an('lb-a-mgm',0,kr):'')+'>'+magBar(rc,cy,w,h,rOpt)+'</g>';
 return g}
function pairIdle(){return bgTop()+magBar(250,300,220,52,{left:'S'})+magBar(710,300,220,52,{left:'S'})+qmark(480,170)}

/* 실험 5: 나침반 */
function magScene(){const cur=UI.mq.cur;let g=bgTop();
 if(cur!=='aN'&&cur!=='aS')return g+compass(380,300,120,-90)+magBar(820,300,220,52,{left:'N'});
 const a=fxOn(cur),ang=cur==='aN'?180:0;
 g+=compass(380,300,120,ang,a?[-90,.8]:null);
 g+='<g'+(a?an('lb-a-slide',0,'--dx:150px'):'')+'>'+magBar(560+110,300,220,52,{left:cur==='aN'?'N':'S'})+'</g>';return g}
function cmpScene(){const cur=UI.mq.cur;let g=bgTop()+magBar(480,250,240,56,{left:'S'});
 if(cur!=='cN'&&cur!=='cS')return g+compass(480,440,80,-90)+qmark(480,120);
 const a=fxOn(cur),x=cur==='cN'?735:225;
 g+='<g'+(a?an('lb-a-slide',0,'--dx:'+(cur==='cN'?150:-150)+'px'):'')+'>'+compass(x,250,100,0,a?[-90,.9]:null)+'</g>';return g}
function flatScene(){const on=has('flat'),f=fxOn('flat');let g=bgTop()+compass(480,280,150,-90,f?[-30,0]:null,f);if(!on&&!f)g=bgTop()+compass(480,280,150,-58)+'<g'+an('lb-a-pop',.2)+'>'+hand(700,300,180,1.2,0)+'</g>';return g}

function sceneSVG(){const v=V(),r=R(),s=curStep(),id=s.id,no=v.no;
 const T=(g,l,vb)=>svg(g+lensOf(s,g),l||s.t,vb);
 if(id==='tools'){if(!(r.done.tools||fxOn('tools')))return T(bg({})+boxArt(480),'준비물 상자');return T(bg({})+toolsScene(v.tools,fxOn('tools')),'준비물: '+v.tools.map(x=>x[1]).join(', '))}
 if(s.k==='pred'){let g;
  if(no===1)g=bgTop()+objAt('iruler',300,200,1.4)+tag(300,250,'철자',18)+objAt('pruler',300,330,1.4)+tag(300,380,'플라스틱 자',18)+objAt('can',560,250,1.5)+tag(560,330,'알루미늄 캔',18)+objAt('tie',760,250,1.3)+tag(760,330,'빵 끈',18)+magBar(480,460,240,50,{gray:1})+qmark(480,110);
  if(no===2)g=bgTop()+helpBoard()+magBar(680,281,220,50,{gray:1})+objAt('clip',330,281,1.6)+qmark(480,110);
  if(no===3)g=bg({})+bowlBack(26)+bowlFront()+magBar(330,190,240,44,{gray:1})+cylMag(660,190,200,56)+qmark(480,90);
  if(no===4)g=pairIdle();
  if(no===5)g=bgTop()+compass(380,300,120,-90)+magBar(820,300,220,52,{left:'N'})+qmark(620,140);
  return T(g,s.t)}
 if(no===1){if(id==='near1')return T(nearArt(OBJ1),s.t,'20 30 930 500');if(id==='near2')return T(nearArt(OBJ2),s.t,'20 30 930 500');
  if(id==='tie')return T(tieScene(),s.t,'140 40 760 450');if(id==='mat')return T(matArt(),s.t,'40 20 880 520')}
 if(no===2){if(id==='place'){const on=has('place');return T(bgTop()+helpBoard()+(on?'<g'+(fxOn('place')?an('lb-a-pop',.2):'')+'>'+magBar(570+110,281,220,50,{gray:1})+objAt('clip',330,281,1.6)+'</g>':itemArtAt('clip',230,90)+magBar(700,90,200,46,{gray:1})),s.t,'120 40 720 380')}
  if(id==='slow')return T(boardArt(stv('sl')),s.t,'120 120 720 300');
  if(id==='lift')return T(liftArt('li',['l1','l2']),s.t,'240 0 480 470');
  if(id==='plas')return T(liftArt('pl',['p1','p2','p3'],'p'),s.t,'240 0 480 470');
  if(id==='papr')return T(liftArt('pa',['q1','q2','q3'],'q'),s.t,'240 0 480 470')}
 if(no===3){if(id==='bar')return T(bowlArt('bar','br',['b1','b2']),s.t,'100 60 760 400');if(id==='cyl')return T(bowlArt('cyl','cy',['c1','c2','c3']),s.t,'100 60 760 400');if(id==='tidy')return T(tidyArt(),s.t,'160 260 640 200')}
 if(no===4){if(id==='find')return T(foilScene(),s.t,'40 110 880 300');if(id==='peel')return T(peelScene(),s.t,'140 90 680 380');
  const c=UI.mq.cur;if(id==='same')return T(c==='mNN'||c==='mSS'?pairArt(c,fxOn(c)):pairIdle(),s.t,'40 110 880 300');
  if(id==='diff')return T(c==='mNS'?pairArt('mNS',fxOn('mNS')):pairIdle(),s.t,'40 110 880 300')}
 if(no===5){if(id==='flat')return T(flatScene(),s.t,'220 100 620 360');if(id==='mag')return T(magScene(),s.t,'200 150 760 300');if(id==='cmp')return T(cmpScene(),s.t,'80 60 800 460')}
 return T(bg({}))}

/* ───────── 결과 한 장: 관찰 그림 ───────── */
const LABNAME='magnet';
function snapsOf(v,r){const L=[],no=v.no,S=(g,vb,cap)=>L.push([svg(g,cap,vb),cap]);const ok=k=>rowDone(k);
 if(no===1){S(bgTop()+OBJK.map((k,i)=>objAt(k,90+i*100,80,.75,{peel:k==='tie'})).join(''),'30 40 900 80','물체 아홉 가지');if(ok('tIn'))S(bgTop()+'<g transform="translate(480 286) scale(3.2)">'+objArt('tie',{peel:1})+'</g>'+magV(480,276,190),'300 60 360 280','빵 끈 속에 자석을 댈 때')}
 if(no===2){if(ok('slow'))S(boardArt(3),'150 180 660 200','천천히 밀었을 때');if(ok('plas'))S(liftArt('pl',['p1','p2','p3'],'p'),'300 120 360 340','플라스틱판을 대고 들 때')}
 if(no===3){const keep=[R().st.br,R().st.cy];if(ok('bar'))S(bg({})+magBar(480,190,240,44,{gray:1})+stuckPieces(480,190,240,44,3),'300 130 360 120','막대자석');if(ok('cyl'))S(bg({})+cylMag(480,190,200,56)+stuckPieces(480,190,212,56,5),'300 130 360 120','둥근기둥 모양 자석')}
 if(no===4){if(ok('same'))S(pairArt('mNN',false),'60 250 840 100','N극과 N극');if(ok('diff'))S(pairArt('mNS',false),'150 250 660 100','N극과 S극')}
 if(no===5){if(ok('mag')){S(bgTop()+compass(380,300,120,180)+magBar(670,300,220,52,{left:'N'}),'240 160 560 280','N극을 가까이 할 때');S(bgTop()+compass(380,300,120,0)+magBar(670,300,220,52,{left:'S'}),'240 160 560 280','S극을 가까이 할 때')}}
 return L}

/* ───────── 이 단계의 행동 단추 ───────── */
function actsOf(s){const r=R(),A=[],busy=!!UI.fx,st=r.st||{};
 const cells=(grp,list)=>list.forEach(x=>A.push({id:x[0],label:x[1],cell:1,grp,pressed:UI.mq.cur===x[0]&&!busy,seen:!!r.seen[x[0]],dis:busy}));
 switch(s.id){
  case 'near1':cells('가까이 할 물체',OBJ1.map(k=>['n'+k,OBJ[k].n]));A.push({id:'hit',label:'자석을 물체에 내려치기',sub:1,dis:busy});break;
  case 'near2':cells('가까이 할 물체',OBJ2.map(k=>['n'+k,OBJ[k].n]));A.push({id:'name',label:'이름만 보고 정하기',sub:1,dis:busy});break;
  case 'tie':seqActs(A,'ti',['tP','tM'],['벗긴 곳 가까이 보기','벗긴 곳에 자석 대 보기'],busy);break;
  case 'mat':cells('이름표를 볼 물체',OBJK.map(k=>['m'+k,OBJ[k].n]));break;
  case 'slow':seqActs(A,'sl',['s1','s2','s3'],['자석을 조금 밀기','조금 더 밀기','한 번 더 조금 밀기'],busy);A.push({id:'fast',label:'자석을 빠르게 휘두르기',sub:1,dis:busy});break;
  case 'lift':seqActs(A,'li',['l1','l2'],['자석을 클립에 가까이 하기','천천히 들어 올리기'],busy);break;
  case 'plas':seqActs(A,'pl',['p1','p2','p3'],['자석 끝에 플라스틱판 대기','판을 댄 채 클립에 가까이 하기','천천히 들어 올리기'],busy);A.push({id:'gap',label:'판과 자석 사이를 띄워서 들기',sub:1,dis:busy});break;
  case 'papr':seqActs(A,'pa',['q1','q2','q3'],['자석 끝에 종이판 대기','판을 댄 채 클립에 가까이 하기','천천히 들어 올리기'],busy);break;
  case 'bar':seqActs(A,'br',['b1','b2'],['막대자석을 그릇에 넣기','천천히 들어 올리기'],busy);A.push({id:'pour',label:'그릇을 흔들어 쏟기',sub:1,dis:busy});break;
  case 'cyl':seqActs(A,'cy',['c1','c2','c3'],['둥근기둥 모양 자석을 그릇에 넣기','천천히 들어 올리기','막대자석과 나란히 놓고 견주기'],busy);break;
  case 'find':cells('N극을 가까이 할 곳',[['fL','왼쪽 끝'],['fR','오른쪽 끝']]);A.push({id:'bang',label:'두 자석을 세게 부딪치기',sub:1,dis:busy});break;
  case 'peel':cells('포일을 벗길 곳',[['pL','왼쪽 끝'],['pR','오른쪽 끝']]);A.push({id:'all',label:'포일을 모두 벗기기',sub:1,dis:busy});break;
  case 'same':cells('마주 보게 할 극',[['mNN','N극과 N극'],['mSS','S극과 S극']]);break;
  case 'diff':A.push({id:'mNS',label:'N극과 S극 가까이 하기',dis:busy});break;
  case 'mag':cells('나침반에 가까이 할 극',[['aN','N극'],['aS','S극']]);A.push({id:'shake',label:'나침반을 흔들며 보기',sub:1,dis:busy});break;
  case 'cmp':cells('나침반을 놓을 곳',[['cN','자석의 N극 쪽'],['cS','자석의 S극 쪽']]);break}
 return A}
/* 하면 안 되는 행동: 그림은 그대로, 까닭만 알림 */
const SUBMSG={hit:'자석으로 물체를 내려치면 자석이 깨지거나 다칠 수 있어요. 천천히 가까이 해요.',name:'같은 자라도 무엇으로 만들었는지에 따라 달라요. 이름만 보지 말고 직접 가까이 해 봐요.',
 fast:'클립 끝에 다칠 수 있고 무엇이 일어났는지 볼 수 없어요. 아주 천천히 밀어요.',gap:'판이 떨어져 결과를 보기 어려워요. 판을 자석에 붙인 채로 들어요.',
 pour:'빵 끈 조각이 쏟아지면 속의 가는 선에 손을 다칠 수 있어요. 그릇을 잡고 자석만 넣어요.',bang:'자석이 깨지거나 손을 다칠 수 있어요. 천천히 가까이 해요.',
 all:'처음부터 다 벗기면 알아맞히는 실험이 되지 않아요. 끝만 벗겨요.',shake:'흔들면 바늘이 계속 움직여서 결과를 볼 수 없어요. 바늘이 멈춘 뒤에 봐요.'};
function doX(id){const r=R(),s=curStep(),st=r.st;if(UI.fx)return;
 if(SUBMSG[id]){fx(id,900,()=>flash(SUBMSG[id]));return}
 r.act[s.id]=1;if(idxOf('pred')>=0&&r.step>idxOf('pred'))r.obs=1;
 const done=()=>{r.seen[id]=1};
 const seq=(key,ids,ms)=>{const i=ids.indexOf(id),c=st[key]||0;if(i<0||c!==i)return;fx(id,ms,()=>{st[key]=i+1;r.seen[id]=1})};
 if(/^n/.test(id)&&OBJ[id.slice(1)]){UI.mq.cur=id.slice(1);fx(id,2000,done);return}
 if(/^m/.test(id)&&OBJ[id.slice(1)]){UI.mq.cur=id.slice(1);fx(id,700,done);return}
 const SEQ={ti:[['tP','tM'],[1100,1500]],sl:[['s1','s2','s3'],[1300,1300,2200]],li:[['l1','l2'],[1300,1500]],pl:[['p1','p2','p3'],[900,1300,1500]],pa:[['q1','q2','q3'],[900,1300,1500]],br:[['b1','b2'],[1300,1600]],cy:[['c1','c2','c3'],[1300,1600,1200]]};
 for(const k in SEQ){const i=SEQ[k][0].indexOf(id);if(i>=0){seq(k,SEQ[k][0],SEQ[k][1][i]);return}}
 if(['fL','fR','pL','pR','mNN','mSS','mNS','aN','aS','cN','cS'].indexOf(id)>=0){UI.mq.cur=id;fx(id,['pL','pR'].indexOf(id)>=0?1100:2100,done);return}}

/* ───────── 오늘의 실험: 이렇게 해요 그림(결과는 보여 주지 않음) ───────── */
function introPic(no,k){const n0=NAR,l0=LEG;NAR=true;LEG=[];let g=bgTop(),vb='0 0 960 540';
 if(no===1){if(k==='near'){g+=objAt('cpaper',360,270,2)+magBar(640,270,240,56,{gray:1})+arrow(560,200,480,200);vb='240 140 560 240'}
  if(k==='again'){g+=objAt('wood',360,270,2)+magBar(640,270,240,56,{gray:1})+arrow(480,200,560,200)+arrow(560,350,480,350);vb='240 140 560 260'}
  if(k==='tie'){g+='<g transform="translate(480 280) scale(3.2)">'+objArt('tie')+'</g>'+magnifier(620,190,1.2,0);vb='300 130 420 260'}
  if(k==='mat'){g+=objAt('balloon',380,260,2.2)+mini(560,280,'재료: ?',30);vb='260 150 460 220'}}
 if(no===2){if(k==='place'){g+=helpBoard()+magBar(680,281,220,50,{gray:1})+objAt('clip',330,281,1.6);vb='140 160 690 240'}
  if(k==='slow'){g+=helpBoard()+magBar(680,281,220,50,{gray:1})+objAt('clip',330,281,1.6)+arrow(700,220,600,220);vb='140 160 690 240'}
  if(k==='lift'){g=bg({})+clipFlat(480,412)+magV(480,300,180)+arrow(560,380,560,320);vb='330 40 300 400'}
  if(k==='plate'){g=bg({})+clipFlat(480,412)+magV(480,300,180,{plate:'p'});vb='330 40 300 400'}}
 if(no===3){g=bg({});if(k==='in'){g+=bowlBack(26)+magBar(480,250,240,44,{gray:1})+bowlFront()+arrow(650,200,650,290);vb='280 160 420 280'}
  if(k==='up'){g+=bowlBack(26)+magBar(480,318,240,44,{gray:1})+bowlFront()+arrow(650,290,650,200);vb='280 160 420 280'}
  if(k==='cyl'){g+=bowlBack(26)+bowlFront()+cylMag(480,250,200,56);vb='280 160 420 280'}
  if(k==='tidy'){g+=bowlBack(14)+bowlFront()+piece(260,420,.3,18,0)+piece(300,424,1.2,18,1)+piece(690,420,2,18,2)+magBar(700,370,180,40,{gray:1});vb='200 260 580 200'}}
 if(no===4){if(k==='wrap'){g+=magBar(560,270,300,64,{foil:1})+magBar(240,270,200,50,{left:'S'})+arrow(330,200,390,200);vb='120 170 620 180'}
  if(k==='peel'){g+=magBar(480,270,300,64,{foil:1})+magnifier(380,200,1,0);vb='300 160 360 200'}
  if(k==='same'){g+=magBar(300,270,220,52,{left:'S'})+magBar(660,270,220,52,{left:'N'})+arrow(400,200,450,200)+arrow(560,200,510,200);vb='160 170 640 160'}
  if(k==='diff'){g+=magBar(300,270,220,52,{left:'S'})+magBar(660,270,220,52,{left:'S'})+arrow(400,200,450,200)+arrow(560,200,510,200);vb='160 170 640 160'}}
 if(no===5){if(k==='flat'){g+=compass(480,270,140,-90);vb='320 120 320 300'}
  if(k==='magN'){g+=compass(380,270,120,-90)+magBar(780,270,220,52,{left:'N'})+arrow(700,180,620,180);vb='240 130 680 280'}
  if(k==='cmp'){g+=magBar(480,240,240,56,{left:'S'})+compass(760,380,80,-90)+arrow(760,300,700,260);vb='300 160 560 320'}
  if(k==='stk'){g+=itemArtAt('nsticker',480,260);vb='320 150 320 240'}}
 const s=svg(g,'',vb).replace(' role="img" aria-label=""',' aria-hidden="true"');NAR=n0;LEG=l0;return s}

/* ───────── 첫 화면 ───────── */
function homeArt(no){NAR=true;LEG=[];let g='',vb='120 70 720 420';
 if(no===1){g=bgTop()+objAt('clip',300,200,1.5)+objAt('can',480,190,1.4)+objAt('wood',650,200,1.4)+objAt('pruler',380,330,1.4)+objAt('balloon',600,330,1.3)+magBar(480,450,260,56,{gray:1});vb='180 100 600 420'}
 if(no===2){g=bgTop()+helpBoard()+magBar(680,281,220,50,{gray:1})+objAt('clip',330,281,1.6);vb='140 150 690 260'}
 if(no===3){g=bg({})+bowlBack(26)+bowlFront()+magBar(480,210,240,44,{gray:1});vb='260 130 440 310'}
 if(no===4){g=bgTop()+magBar(480,220,300,64,{foil:1})+magBar(330,360,220,52,{left:'S'})+magBar(630,360,220,52,{left:'S'});vb='180 140 600 300'}
 if(no===5){g=bgTop()+compass(400,290,130,-90)+magBar(760,290,220,52,{left:'N'});vb='240 140 660 300'}
 const s=svg(g,'실험 '+no+' 처음 모습',vb);NAR=false;LEG=[];return s}
function homeHTML(){const card=k=>{const v=EXPS[k],r=DB.runs[k];const st=r?(r.fin?'끝냄 · 결과 보기':(r.step+1)+'단계부터 이어서'):'실험 시작하기';
 return '<section class="lb-exc" aria-labelledby="lbE'+v.no+'"><div class="lb-exc-art">'+homeArt(v.no)+'</div><div class="lb-exc-b"><h2 id="lbE'+v.no+'"><em>실험 '+v.no+'</em>'+esc(v.name)+'</h2><p class="lb-exp">'+esc(v.sub)+'</p><button type="button" class="lb-pickb" data-pick="'+k+'" data-f="k'+k+'"><i>'+ic(['','clipi','clipi','magnet','magnet','compass'][v.no])+'</i><span><b>'+st+'</b><span>교과서 실험</span></span>'+(r&&r.fin?'<small>'+ic('check')+'</small>':'')+'</button></div></section>'};
 return '<div class="lb-home"><div class="lb-home-h"><div class="lb-kick"><em>4학년 1학기 과학</em>1. 자석의 이용</div><h1>무엇을 실험할까요?</h1><p>실험을 한 단계씩 직접 해 보고, 내 눈으로 본 것을 기록해요.</p></div>'+
 '<div class="lb-ex lb-ex5">'+['e1','e2','e3','e4','e5'].map(card).join('')+'</div>'+
 '<p class="lb-model">'+ic('info')+'<span>아주 단순하게 만든 모형이에요. 같은 조건이면 언제나 같은 결과가 나와요. 관찰 결과는 교과서·지도서 예시와 같고, 실제 자석은 세기가 저마다 달라 조금씩 다를 수 있어요. 물체·자석·나침반의 모양과 크기, 클립이 끌려오기 시작하는 때, 빵 끈 조각 수와 붙은 모습, 포일 속 자석이 놓인 방향은 이 실험관에서 정한 모습이에요.</span></p></div>'}
