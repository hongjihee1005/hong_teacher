/* 힘 실험관에서 더 쓰는 아이콘 */
Object.assign(I,{desk:'<path d="M3 9h18M5 9v10M19 9v10M3 13h18"/>',
 scale:'<path d="M12 4v16M8 20h8M5 7.3h14"/><path d="M5 7.3 2.8 13a3 3 0 0 0 4.4 0Zm14 0L16.8 13a3 3 0 0 0 4.4 0Z"/>',
 lever:'<path d="M3 15 21 9"/><path d="M9 13l-2.5 6h5z"/>',
 spring:'<path d="M12 3v3M8 6h8M8 9l8 2-8 2 8 2-8 2"/><path d="M12 17v4"/>'});

/* ───────── 기록(이 기기에만) ───────── */
const KEY='hj-force-v1';
function blank(){return {v:1,runs:{},cur:null,ui:{open:false,big:false},name:''}}
function newRun(){return {step:0,max:0,done:{},act:{},plan:{},planLast:null,planOk:false,pred:[],why:'',seen:{},rec:{},pend:{},last:{},tries:{},bl:[],clast:null,ctry:0,cmp:false,fin:false,more:{},st:{}}}
function load(){try{const s=JSON.parse(localStorage.getItem(KEY)||'null');
 if(s&&s.v===1&&s.runs){const o=Object.assign(blank(),s);o.ui=Object.assign(blank().ui,s.ui||{});
 Object.keys(o.runs).forEach(k=>{if(!EXPS[k]||!o.runs[k])delete o.runs[k];else o.runs[k]=Object.assign(newRun(),o.runs[k])});if(o.cur&&!EXPS[o.cur])o.cur=null;return o}}catch(e){}return blank()}
let DB=load();
function save(){try{localStorage.setItem(KEY,JSON.stringify(DB))}catch(e){}}

/* ───────── 화면 상태(저장 안 함) ───────── */
const UI={fx:null,nonce:0,timers:[],draft:{},inp:{},wrong:{},fb:{},focus:0,menu:false,rail:false,speaking:false,toast:'',mq:{},a0:null,attn:false};
function clearTimers(){UI.timers.forEach(t=>clearTimeout(t));UI.timers=[]}
function later(fn,ms){const t=setTimeout(fn,RM?Math.min(ms,120):ms);UI.timers.push(t);return t}
function resetUI(){clearTimers();UI.attn=false;UI.fx=null;UI.draft={};UI.inp={};UI.wrong={};UI.fb={};UI.focus=0;UI.rail=false;UI.toast='';UI.mq={};UI.a0=null;stopSay()}
const V=()=>EXPS[DB.cur],R=()=>DB.runs[DB.cur];
const narrow=()=>innerWidth<=820;
function endP(t){t=String(t).trim();return /[.?!]$/.test(t)?t:t+'.'}

/* ───────── 단계 판단 ───────── */
function stepOf(i){const v=V();return stepDef(v,v.steps[i])}
function idxOf(id){return V().steps.indexOf(id)}
function curStep(){return stepOf(R().step)}
function rowDone(row){const x=R().rec[row];return !!(x&&x.ok)}
function isDone(i){const r=R(),s=stepOf(i);
 if(s.k==='intro')return true;
 if(s.k==='scene')return !!r.done[s.id];
 if(s.k==='plan')return r.planOk;
 if(s.k==='pred')return V().pred.every((q,j)=>r.pred[j]!=null);
 if(s.k==='meas')return s.rows.every(rowDone);
 if(s.k==='more')return true;
 if(s.k==='concl')return !!r.cmp;
 return !!r.fin}
function canNext(){const r=R();return r.step<V().steps.length-1&&isDone(r.step)&&!UI.fx}
function canGo(i){const r=R();return i>=0&&i<V().steps.length&&(i<=r.max||DB.ui.open||(i===r.max+1&&isDone(r.max)))}
function go(i,focusHead){if(!canGo(i))return;const r=R();r.step=i;r.max=Math.max(r.max,i);resetUI();enterStep();save();render();if(focusHead!==false){const h=$('#lbH1');if(h)h.focus({preventScroll:true})}}
/* 단계에 들어갈 때 장치 상태를 그 단계 처음 모습으로 맞춤(이미 한 것은 그대로) */
const BOARD0={p1:{l:{},r:{}},p2:{l:{2:1},r:{}},p3:{l:{2:1},r:{2:1}},p4:{l:{2:2},r:{2:1}},more:{l:{1:2},r:{}}};
function enterStep(){const v=V(),r=R(),s=stepOf(r.step);r.st=r.st||{};
 if(s.k==='sheet')r.fin=!!(r.cmp&&v.rows.every(rowDone));
 if(s.k==='concl'&&!r.bl.length)r.bl=v.ans.map(()=>'');
 if(s.k==='concl')UI.focus=Math.max(0,r.bl.findIndex(x=>!x));
 if(v.no===2&&BOARD0[s.id]){r.st.bd=r.st.bd||{};if(!r.st.bd[s.id])r.st.bd[s.id]=JSON.parse(JSON.stringify(BOARD0[s.id]))}
 if(v.no===4){const st=r.st;if(st.off==null)st.off=10;if(!st.eye)st.eye='up';
  if(s.id==='zero'){st.item=null;st.bag=false}
  if(s.id==='hook'){if(rowDone('z1'))st.off=0;st.bag=false;if(st.item!=='cpen'&&st.item!=='spen')st.item=null}
  if(s.id==='bag'){if(rowDone('z2')){st.off=-10;st.item='bag'}else{if(!st.bagOn){st.item=null;if(rowDone('z1'))st.off=0}else st.item='bag'}}
  if(s.id==='clay'){if(rowDone('z2'))st.off=-10;st.bag=true;st.item=rowDone('clay')||r.pend.clay!=null?'clay':'bag'}}}
function predLocked(){const r=R();return Object.keys(r.seen).length>0||Object.keys(r.rec).length>0||Object.keys(r.pend).length>0}
function planChanged(r){if(!r.planLast)return true;return JSON.stringify(r.plan)!==JSON.stringify(r.planLast)}

/* ───────── 장치 값 ───────── */
const HANGW={cpen:160,spen:120,clay:85,bag:10};   /* 지퍼 백 10 g + 고무찰흙 75 g (지퍼 백·처음 어긋남은 이 자료에서 정한 값) */
function readNow(){const st=R().st||{};return (st.item?HANGW[st.item]:0)+(st.off||0)}
function boardOf(id){const st=R().st||{};return (st.bd&&st.bd[id])||BOARD0[id]||{l:{},r:{}}}

/* ───────── 장면 ───────── */
function fxOn(id){return UI.fx&&UI.fx.id===id}
function has(id){const r=R(),k=idxOf(id);if(k<0)return false;return k<r.step||(k===r.step&&(!!r.done[id]||fxOn(id)))}
const BXX={mid:{A:300,B:330},edge:{A:96,B:126},mv:250};
function e1Scene(s){const r=R(),id=s.id,f=UI.fx;let g=bg({room:1})+deskTop();
 const filled=has('fill'),at=has('place')?'edge':'mid';
 if(id==='fill'&&!filled){g+=boxAt('A',BXX.mid.A,{empty:1})+boxAt('B',BXX.mid.B,{empty:1})+qmark(700,140);return g}
 if(id==='fill'&&fxOn('fill')){g+=boxAt('B',BXX.mid.B,{empty:1})+boxAt('A',BXX.mid.A,{empty:1});
  const sl=(k,i,d)=>{const q=slab(k,BXX.mid[k],i);return '<g'+an('lb-a-down',d,'--from:-220px')+'><rect x="'+q[0].toFixed(1)+'" y="'+q[1].toFixed(1)+'" width="'+q[2].toFixed(1)+'" height="'+q[3].toFixed(1)+'" rx="2" fill="#FFFFFF" stroke="#A39B8B" stroke-width="1.5"/></g>'};
  [0,1,2,3].forEach(i=>{g+=sl('A',i,.2+i*.4)});g+=sl('B',0,1.9);return g}
 const moving=f&&/^(push|pull)[AB]$/.test(f.id)?f.id:null,lifting=f&&/^lift[AB]$/.test(f.id)?f.id:null;
 const pos=k=>{let x=BXX[at][k];if(id==='push'&&r.seen['push'+k]&&moving!=='push'+k)x+=BXX.mv;if(id==='pull'&&r.seen['pull'+k]&&moving!=='pull'+k)x+=BXX.mv;return x};
 const one=k=>{const x=pos(k),B=BX[k];let b=boxAt(k,x);
  if(fxOn('place'))return '<g'+an('lb-a-slide',0,'--dx:'+(BXX.mid[k]-BXX.edge[k])+'px')+'>'+b+'</g>';
  if(moving&&moving.slice(-1)===k){const push=moving[1]==='u'&&moving[2]==='s';const hx=push?x-48:x+140*B.s+40,hy=B.yb-40*B.s;
   b+=push?hand(hx,hy,0,.95*B.s):hand(hx,B.yb-82*B.s-4,180,.95*B.s);
   return '<g'+an('lb-a-mv',0,'--dx:'+BXX.mv+'px')+'>'+b+'</g>'+arrow(x+70*B.s+30,B.yb-100*B.s-30,x+70*B.s+150,B.yb-100*B.s-30)}
  if(lifting&&lifting.slice(-1)===k)return '<g'+an('lb-a-liftup',0)+'>'+b+hand(x+20,B.yb-6,-90,.9*B.s)+hand(x+140*B.s-6,B.yb-6,-90,.9*B.s)+'</g>';
  return b};
 g+=one('B')+one('A');
 if(s.k==='meas'){const pre=id==='lift'?'lift':id==='push'?'push':'pull';g+=gauge(720,40,[r.seen[pre+'A']||(f&&f.id===pre+'A')?ARM[pre+'A']:null,r.seen[pre+'B']||(f&&f.id===pre+'B')?ARM[pre+'B']:null],['㉮','㉯'],f&&f.id===pre+'A'?0:f&&f.id===pre+'B'?1:-1)}
 if(s.k==='pred')g+=qmark(780,140);
 return g}
function e1More(){const r=R(),f=UI.fx;let g=bg({room:1})+deskTop();
 const bt=(k,full,yb,x0)=>{const mv=f&&f.id===k,x=x0+(UI.mq[k]&&!mv?BXX.mv:0),sc=yb>350?1.6:1.35;let b=bottle(x,yb,full,sc);if(mv)b='<g'+an('lb-a-mv',0,'--dx:'+BXX.mv+'px')+'>'+b+hand(x-46,yb-60*sc,0,.95)+'</g>';return b};
 g+=bt('bempty',0,262,136)+bt('bfull',1,384,110);
 if(!NAR)g+='<text x="'+(UI.mq.bfull?400:200)+'" y="414" text-anchor="middle" font-size="17" font-weight="800" fill="#FFFFFF">'+'</text>';
 g+=gauge(720,40,[UI.mq.bfull||(f&&f.id==='bfull')?ARM.bfull:null,UI.mq.bempty||(f&&f.id==='bempty')?ARM.bempty:null],['가득','빈'],f&&f.id==='bfull'?0:f&&f.id==='bempty'?1:-1);
 return g}
function e2Scene(s){const r=R(),id=s.id;let g=bg({});
 if(id==='center'){const on=r.done.center||fxOn('center');if(!on)return g+fulcrum()+'<g transform="translate(0 -70)">'+plankBoard({l:{},r:{}})+'</g>'+qmark(PX,150);return g+balance({l:{},r:{}},{drop:fxOn('center')})+levelTag({l:{},r:{}})}
 if(s.k==='plan'||s.k==='pred'||s.k==='concl'){const b=s.k==='pred'?{l:{2:2},r:{}}:{l:{2:2},r:{4:1}};g+=balance(b);if(s.k==='pred')g+=qmark(PX+CW*1.5,150)+qmark(PX+CW*4,150);return g}
 const b=boardOf(id),f=UI.fx;g+=balance(b,{anim:!!(f&&f.id==='bd'),a0:UI.a0});
 /* 판의 모습 글(수평·기울어요)은 학생이 기록한 뒤에만 — 먼저 보이면 앱이 관찰을 대신 말해 줌 */
 if(!(f&&f.id==='bd')&&(s.k==='more'?r.more.a!=null:s.k!=='meas'||s.rows.every(rowDone)))g+=levelTag(b);
 return g}
function e3Scene(s){const r=R(),st=r.st||{},id=s.id;let g=bg({});
 if(id==='flat'){const on=r.done.flat||fxOn('flat');if(!on){g+='<g transform="translate(0 -80)">'+escale(ES.x,{})+'</g>'+qmark(ES.x,120);return g}
  return g+'<g'+(fxOn('flat')?an('lb-a-down',0,'--from:-80px'):'')+'>'+escale(ES.x,{})+'</g>'}
 const on=has('power'),zero=has('zero');let val='';
 if(on)val=zero?'0.0':'1.2';
 let item=null;if(s.k==='meas'&&id==='weigh'&&st.item){item=st.item;val=ROWS[st.item].show}
 const hl=!!(UI.mq.hl&&item);
 g+=escale(ES.x,{on,val,item,drop:!!(UI.fx&&UI.fx.id===item),pw:fxOn('power'),zp:fxOn('zero'),hl});
 if(id==='level'&&!r.done.level&&!fxOn('level'))g+=qmark(ES.x+152,300);
 if(id==='weigh'&&item)g+=plate(ES.x-20,ROWS[item].n,466);
 if(s.k==='pred'){g+=stat('cp',250,170,.6,-8)+stat('sp',480,150,.6,6)+stat('bm',710,170,.6,-6)+stat('ru',480,230,.6,0)+qmark(480,80)}
 if(id==='rank'){['cp','sp','bm','ru'].forEach((k,i)=>{g+=stat(k,200+(i%2)*420,120+Math.floor(i/2)*110,.75,0)+tag(200+(i%2)*420,162+Math.floor(i/2)*110,ITEM[k]+' '+(rowDone(k)?R().rec[k].v+' g':'?'),17)})}
 return g}
function e4Scene(s){const r=R(),st=r.st||{},id=s.id;let g=bg({})+stand();
 if(id==='hang'&&!r.done.hang&&!fxOn('hang'))return g+'<g transform="translate(700 400) rotate(90) scale(1.5)">'+itemArt('sscale')+'</g>'+qmark(SP.x,150);
 if(id==='hang')return g+'<g'+(fxOn('hang')?an('lb-a-down',0,'--from:-60px'):'')+'>'+sscale({read:st.off==null?10:st.off})+'</g>';
 if(s.k==='pred')return g+sscale({read:st.off==null?10:st.off})+'<g transform="translate(160 330)">'+hangItem('cpen',0,0)+'</g><g transform="translate(720 330)">'+hangItem('spen',0,0)+'</g><g transform="translate(840 330)">'+hangItem('clay',0,0)+'</g>'+qmark(780,250);
 if(s.k==='concl'||s.k==='plan')return g+sscale({read:160,item:'cpen',eye:'lv'});
 const f=UI.fx,anim=!!(f&&f.id==='hang2');
 const showEye=s.k==='meas'&&(id==='hook'||id==='clay')&&st.item&&st.item!=='bag';
 g+=sscale({read:readNow(),item:st.item,anim,from:UI.mq.from,screw:!!(f&&f.id==='screw'),eye:showEye?st.eye:null});
 if(st.item&&!NAR)g+=plate(SP.x+200,st.item==='bag'?'지퍼 백':st.item==='clay'?'지퍼 백 + 고무찰흙':ROWS[st.item].n,466);
 return g}
function e5Scene(s){const r=R(),st=r.st||{},id=s.id,f=UI.fx;let g=bg({});
 const on=has('meter');
 if(id==='meter')return g+fmeter(480,250,{on:on,val:fxOn('meter')?'':'0'})+hand(480,136,90,.9)+(on?'':qmark(600,150));
 if(s.k==='plan'||s.k==='pred'||s.k==='concl'){g+=lever({milk:'near'})+'<g transform="translate(260 0)">'+'</g>';g+=fmeter(820,170,{on:true,val:s.k==='concl'?'45':'?'})+(s.k==='pred'?qmark(820,60):'');return g}
 const D=UI.mq.row?UI.mq:null,val=D?D.val:null,hl=!!UI.mq.hl;
 if(id==='direct'){const up=r.pend.dir!=null||rowDone('dir'),anim=fxOn('dir');const v=anim||up?val!=null?val:(rowDone('dir')?180:r.pend.dir):0;
  const grp=fmeter(480,190,{on:true,val:v,hl})+hand(480,76,90,.9)+milk(480,396,.9);
  g+='<g'+(anim?an('lb-a-raise',0,'--from:44px'):up?'':' transform="translate(0 44)"')+'>'+grp+'</g>';return g}
 if(id==='lset'){const dn=r.done.lset||fxOn('lset');if(!dn)return g+lever({})+'<g transform="translate(0 -90)">'+milk(470,300,.75)+'</g>'+qmark(470,90);
  return g+lever({milk:'near',milkDrop:fxOn('lset')})}
 if(id==='lever'||(id==='more')){const k=id==='lever'?'lev':(f&&f.id==='pnear')||(!f&&UI.mq.last==='pnear')?'pnear':'pfar';const press=k==='pnear'?'near':'far';
  const pressing=!!(f&&(f.id==='lev'||f.id==='pnear'||f.id==='pfar')),done=id==='lever'?(r.pend.lev!=null||rowDone('lev')):!!UI.mq.last;
  const v=pressing?val:done?(id==='lever'?(val!=null?val:45):(UI.mq.last==='pnear'?90:45)):0;
  g+=lever({milk:'near',press:(id==='more'&&!UI.mq.last&&!pressing)?null:press,val:v,hl,anim:pressing,a0:-5,a1:pressing||done?4:-5});
  if(id==='more'&&!NAR)g+=tag(470,FY+60,'가까운 곳',17)+tag(720,FY+60,'먼 곳',17);
  return g}
 if(id==='sset'){const dn=r.done.sset||fxOn('sset');if(!dn)return g+blockStack(640,0)+itemArtAt('blocks',700,380)+itemArtAt('plank2',360,400)+qmark(480,150);
  return g+'<g'+(fxOn('sset')?an('lb-a-fade',0):'')+'>'+slope({hold:1})+'</g>'+milkOn(0)}
 if(id==='slope'){const anim=!!(f&&(f.id==='inc'||f.id==='fast')),up=r.pend.inc!=null||rowDone('inc');
  const v=anim?val:up?(val!=null?val:40):0;
  g+=slope({hold:1})+milkOn(anim||up?1:0,{anim,meter:true,val:v,hl})+slopeCallout(v,hl);return g}
 return g}
function itemArtAt(k,x,y){return '<g transform="translate('+x+' '+y+') scale(1.4)">'+itemArt(k)+'</g>'}
/* 빗면 위 우유(t: 0 아래 ~ 1 위) */
function milkOn(t,o){o=o||{};const a=Math.atan2(SL.y1-SL.y0,SL.x1-SL.x0),ux=Math.cos(a),uy=Math.sin(a),nx=Math.sin(a),ny=-Math.cos(a);
 const P=s=>[SL.x0+s*ux+nx*8,SL.y0+s*uy+ny*8],s0=90,s1=380,sNow=s0+(s1-s0)*t,[mx,my]=P(sNow),deg=a*180/Math.PI;
 let g=milk(mx,my,.7,deg);
 if(o.meter){const [cx,cy]=P(sNow+170);const ox=cx+nx*40,oy=cy+ny*40,top=[mx+nx*78,my+ny*78];
  g+='<path d="M'+top[0].toFixed(1)+' '+top[1].toFixed(1)+' L'+(ox-ux*62).toFixed(1)+' '+(oy-uy*62).toFixed(1)+'" stroke="#555" stroke-width="3"/>'+fmeter(ox,oy,{on:true,val:o.val,hl:o.hl,rot:deg+90})+hand(ox+ux*70,oy+uy*70,deg+180,.8)}
 if(o.anim){const [x0,y0]=P(s0);return '<g'+an('lb-a-slope',0,'--dx:'+(x0-mx).toFixed(0)+'px;--dy:'+(y0-my).toFixed(0)+'px')+'>'+g+'</g>'}
 return g}
function sceneSVG(){const v=V(),r=R(),s=curStep(),id=s.id,no=v.no;
 const T=(g,l,vb)=>svg(g+lensOf(s,g),l||s.t,vb);
 if(id==='tools'){if(!(r.done.tools||fxOn('tools')))return T(bg({})+boxArt(480),'준비물 상자');return T(bg({})+toolsScene(v.tools,fxOn('tools')),'준비물: '+v.tools.map(x=>x[1]).join(', '))}
 if(no===1){if(id==='more')return T(e1More(),'물통 두 개를 미는 모습','40 30 900 500');return T(e1Scene(s),s.t,'40 30 900 500')}
 if(no===2)return T(e2Scene(s),s.t,'60 60 840 400');
 if(no===3)return T(e3Scene(s),s.t,'120 40 720 460');
 if(no===4)return T(e4Scene(s),s.t,'300 4 580 540');
 if(no===5)return T(e5Scene(s),s.t,'60 30 860 480');
 return T(bg({}))}

/* ───────── 오른쪽 카드 ───────── */
function cardHead(t,s){return '<div class="lb-card-h"><span class="lb-clip">'+ic('clip')+'</span><div><b>'+t+'</b><span>'+s+'</span></div></div>'}
function wrapB(h){return '<div class="lb-card-b"><div class="lb-fit">'+h+'</div></div>'}
function planCard(){const v=V(),r=R(),P=v.plan;let h='<p class="lb-q">'+esc(v.q)+'</p>';
 const marked=r.planLast&&!planChanged(r);
 h+='<p class="lb-hint">조건마다 \'다르게\'나 \'같게\'를 골라요.</p><div role="group" aria-label="조건 고르기">';
 P.rows.forEach(row=>{const [k,n,icn,isVar,vmsg]=row;const c=r.plan[k];let cls='',msg='';
  if(r.planLast&&c&&r.planLast[k]===c){const ok=(isVar?'d':'s')===c;cls=ok?' lb-ok':' lb-no';if(!ok)msg='<p>'+ic('x')+'<span>'+(isVar?vmsg:'이것도 다르면 까닭을 알 수 없어요.')+'</span></p>'}
  h+='<div class="lb-crow'+cls+'"><span>'+ic(icn)+esc(n)+'</span><span class="lb-seg" role="group" aria-label="'+esc(n)+'"><button type="button" class="lb-d" data-f="p'+k+'d" data-plan="'+k+':d" aria-pressed="'+(c==='d')+'">다르게</button><button type="button" class="lb-s" data-f="p'+k+'s" data-plan="'+k+':s" aria-pressed="'+(c==='s')+'">같게</button></span>'+msg+'</div>'});
 h+='</div>';
 if(marked){const vars=P.rows.filter(x=>x[3]),nd=P.rows.filter(x=>r.plan[x[0]]==='d').length;let m;
  if(r.planOk)m='<div class="lb-msg lb-good">'+ic('check')+'<span>좋아요. '+vars.map(x=>x[1]).join(', ')+'만 다르게 해요.</span></div>';
  else if(nd===0)m='<div class="lb-msg lb-try">'+ic('info')+'<span>모두 같게 하면 견줄 수 없어요.</span></div>';
  else if(nd>vars.length)m='<div class="lb-msg lb-try">'+ic('info')+'<span>여러 가지가 다르면 까닭을 알 수 없어요.</span></div>';
  else m='<div class="lb-msg lb-try">'+ic('info')+'<span>빨간 줄을 다시 생각해 봐요.</span></div>';
  h+='<div aria-live="polite">'+m+'</div>'}
 const all=P.rows.every(p=>r.plan[p[0]]);
 if(!r.planOk)h+='<button type="button" class="lb-act" data-act="check" data-f="doit"'+(all&&planChanged(r)?'':' disabled')+'>'+ic('check')+'계획 확인하기</button>';
 return cardHead('실험 계획','다르게 할 것 · 같게 할 것')+wrapB(h)}
function planGood(v,r){return v.plan.rows.every(x=>r.plan[x[0]]===(x[3]?'d':'s'))}
function predCard(){const v=V(),r=R(),lock=predLocked();let h='';
 if(v.pred.length>1)h+='<p class="lb-hint">학용품을 양손에 하나씩 들어 본다고 생각하고 골라요.</p>';
 v.pred.forEach((q,j)=>{h+=(v.pred.length>1?'<p class="lb-q">'+esc(q.q)+'</p>':'')+'<div class="lb-opts" role="group" aria-label="'+esc(q.q)+'">';
  q.o.forEach((t,i)=>{const on=r.pred[j]===i;h+='<button type="button" class="lb-opt'+(v.pred.length>1?' lb-optsm':'')+'" data-f="o'+j+i+'" data-pred="'+j+':'+i+'" aria-pressed="'+on+'"'+(lock?' disabled':'')+'><i>'+(on?ic('check'):'')+'</i><span>'+esc(t)+'</span></button>'});h+='</div>'});
 h+='<div><label class="lb-label" for="lbWhy">그렇게 생각한 까닭 (쓰고 싶으면)</label><input id="lbWhy" class="lb-input" maxlength="60" placeholder="왜냐하면 ~ 때문이에요." value="'+esc(r.why)+'"'+(lock?' readonly':'')+'></div>';
 if(lock)h+='<div class="lb-msg lb-plain">'+ic('lock')+'<span>관찰을 시작해서 예상을 바꿀 수 없어요.</span></div>';
 else if(r.pred.length)h+='<div class="lb-msg lb-plain" aria-live="polite">'+ic('info')+'<span>예상은 맞히기가 아니라 내 생각이에요.</span></div>';
 return cardHead('내 예상','고른 예상은 결과 한 장에 남아요')+wrapB(h)}

/* ───────── 기록 줄(③) ───────── */
function rowSum(row){const r=R(),R0=ROWS[row],x=r.rec[row]||{};
 if(R0.t==='sel')return R0.f.map((f,i)=>f.o[x.f[i]]).join(' · ');
 if(R0.t==='num')return x.v+(R0.u?' '+R0.u:'');
 if(R0.t==='order')return x.o.map(k=>ITEM[k]).join(' → ');
 return '0에 맞췄어요'}
function rowReady(row){const r=R(),R0=ROWS[row],x=r.rec[row]||{};if(x.ok)return true;
 if(R0.t==='sel')return R0.need.every(k=>r.seen[k]);
 if(R0.t==='num')return r.pend[row]!=null;
 if(R0.t==='order')return R0.items.every(rowDone);
 return false}
function numOpen(row){const r=R(),R0=ROWS[row];if(r.pend[row]==null||UI.fx)return false;if(R0.eye&&(r.st.eye!=='lv'||r.st.item!==R0.item))return false;return true}
function rowUI(row){const r=R(),R0=ROWS[row],x=r.rec[row]||{},done=!!x.ok,wr=UI.wrong[row]||[];
 if(done){let h='<div class="lb-mrow lb-mdone"><div class="lb-mrh"><b>'+esc(R0.n)+'</b><span class="lb-okt">'+ic('check')+esc(rowSum(row))+'</span></div>';
  if(UI.fb[row])h+='<div class="lb-msg lb-good" role="status">'+ic('check')+'<span>'+UI.fb[row][1]+'</span></div>';
  return h+'</div>'}
 let h='<div class="lb-mrow"><div class="lb-mrh"><b>'+esc(R0.n)+'</b></div>';
 const D=UI.draft[row]=UI.draft[row]||{};
 const recB=on=>'<button type="button" class="lb-rec-btn" data-act="rowrec" data-row="'+row+'" data-f="rr'+row+'"'+(on?'':' disabled')+'>'+ic('check')+'기록하기</button>';
 if(R0.t==='sel'){const ok=rowReady(row);D.f=D.f||[];
  R0.f.forEach((f,j)=>{const long=f.o.some(t=>t.length>6)||f.o.length>3;
   h+='<div class="lb-cells lb-c1"><span class="lb-cl">'+esc(f.l)+'</span><span class="lb-seg lb-kseg'+(long?' lb-kwrap':'')+(wr.indexOf(j)>=0?' lb-wrongc':'')+'" role="group" aria-label="'+esc(R0.n+' '+f.l)+'">'+f.o.map((o,i)=>'<button type="button" class="lb-s" data-f="'+row+j+'-'+i+'" data-dr="'+row+':'+j+':'+i+'" aria-pressed="'+(D.f[j]===i)+'"'+(ok?'':' disabled')+'>'+esc(o)+'</button>').join('')+'</span></div>'});
  h+=recB(ok&&R0.f.every((f,j)=>D.f[j]!=null))}
 if(R0.t==='num'){const op=numOpen(row);
  h+='<div class="lb-trials"><label class="lb-trial'+(op?' lb-tcur':'')+'"><span>'+(R0.u?'무게':'숫자')+'</span><input class="lb-num lb-numw" inputmode="'+(V().no===3?'decimal':'numeric')+'" maxlength="5" autocomplete="off" data-f="in'+row+'" data-in="'+row+'" aria-label="'+esc(R0.n)+' 숫자" value="'+esc(UI.inp[row]||'')+'"'+(op?'':' disabled')+'>'+(R0.u?'<span>'+R0.u+'</span>':'')+'</label><button type="button" class="lb-mini" data-act="trial" data-row="'+row+'" data-f="tr'+row+'"'+(op?'':' disabled')+'>'+ic('check')+'적기</button></div>';
  if(R0.eye&&r.pend[row]!=null&&r.st.eye!=='lv'&&!UI.fx)h+='<p class="lb-hint2">눈높이를 맞추면 쓸 수 있어요.</p>'}
 if(R0.t==='order'){const ok=rowReady(row),o=D.o=D.o||[];
  h+='<p class="lb-hint2">무거운 학용품부터 차례로 눌러요.</p><div class="lb-ordb'+(wr.length?' lb-wrongc':'')+'" role="group" aria-label="무거운 차례 고르기">'+R0.items.map(k=>{const p=o.indexOf(k);return '<button type="button" class="lb-chip" data-f="od'+k+'" data-ord="'+row+':'+k+'"'+(ok&&p<0?'':' disabled')+'>'+(p>=0?'<b>'+(p+1)+'</b> ':'')+esc(ITEM[k])+'</button>'}).join('')+'</div>';
  if(o.length)h+='<div class="lb-midrow"><span class="lb-cl">'+o.map((k,i)=>(i+1)+'. '+esc(ITEM[k])).join('  ')+'</span><button type="button" class="lb-mini" data-act="ordclear" data-row="'+row+'" data-f="oc'+row+'">다시 고르기</button></div>';
  h+=recB(ok&&o.length===R0.items.length)}
 if(R0.t==='auto'){const st=r.st,rd=readNow();h+='<p class="lb-hint2">'+(rd===0?'표시 자가 0과 나란해요.':rd>0?'표시 자가 0보다 아래에 있어요.':'표시 자가 0보다 위에 있어요.')+'</p>'}
 if(UI.fb[row])h+='<div class="lb-msg '+(UI.fb[row][0]?'lb-good':'lb-try')+'" role="status">'+ic(UI.fb[row][0]?'check':'info')+'<span>'+UI.fb[row][1]+'</span></div>';
 return h+'</div>'}

/* ───────── 할 일 카드: ① 해 보기 → ② 살펴보기 → ③ 기록하기 ───────── */
function acted(s){const r=R();return !!(r.act&&r.act[s.id])||(s.k==='scene'&&!!r.done[s.id])||(s.k==='meas'&&s.rows.every(k=>ROWS[k].t==='order'))}
function looked(s){if(s.k==='scene')return !!R().done[s.id];if(s.k==='meas')return s.rows.every(rowReady);if(s.k==='more')return !!UI.mq.both||R().more.a!=null;return true}
function lbl(a){const x=actsOf(curStep()).find(b=>b.id===a);return x?x.label:''}
function hintOf(s){const r=R(),A=acted(s),id=s.id,D=isDone(r.step),st=r.st||{};
 if(s.k==='scene'){if(UI.fx)return s.look;if(r.done[id])return '잘했어요. 이어서 가요.';return s.opts?s.ask:'① '+jo(s.act,'을','를')+' 눌러요.'}
 if(s.k==='more'){if(r.more.a!=null)return '다 했어요. 이어서 가요.';if(UI.fx)return s.look;if(UI.mq.both)return '③ 알맞은 것을 골라요.';return V().no===2?'① 오른쪽 칸을 골라 물체를 놓아 봐요.':'① 두 가지를 모두 해 봐요.'}
 if(D)return '다 했어요. 이어서 가요.';
 if(UI.fx)return s.look;
 const need=s.rows.find(k=>!rowDone(k)),R0=ROWS[need];
 if(R0.t==='sel'){if(rowReady(need))return '③ '+R0.n+': 알맞은 것을 골라 기록해요.';
  const miss=R0.need.find(k=>!r.seen[k]);
  if(V().no===2){if(id==='p2'||id==='p4')return '① 오른쪽 칸을 눌러 물체를 놓고, 수평이 되는 칸을 찾아요.';return '① '+jo(lbl(miss)||'단추','을','를')+' 눌러요.'}
  return '① '+jo(lbl(miss),'을','를')+' 눌러요.'}
 if(R0.t==='num'){if(R0.eye&&r.st.item!==R0.item&&id!=='clay')return '① '+jo(lbl(need),'을','를')+' 눌러요.';if(r.pend[need]!=null){if(R0.eye&&st.eye!=='lv')return '① 눈 위치를 눈높이로 맞춰요.';return '③ '+(R0.eye?'눈금을 읽어 ':'화면의 숫자를 ')+R0.n+' 칸에 써요.'}
  if(id==='clay'&&st.item!=='clay')return '① 고무찰흙 넣기를 눌러요.';
  return '① '+jo(lbl(need),'을','를')+' 눌러요.'}
 if(R0.t==='order')return '③ 무거운 학용품부터 차례로 눌러요.';
 if(R0.t==='auto'){if(id==='bag'&&!st.bagOn)return '① 지퍼 백 걸기를 눌러요.';const rd=readNow();return '① 나사를 돌려 표시 자를 0에 맞춰요.'+(rd>0?' (지금은 0보다 아래)':rd<0?' (지금은 0보다 위)':'')}
 return ''}
function gPart(n,t,st,body){return '<li class="lb-gp lb-'+st+'"'+(st==='wait'?' inert aria-disabled="true"':'')+'><div class="lb-gh"><i>'+(st==='ok'?ic('check'):n)+'</i><b>'+t+'</b></div>'+(body?'<div class="lb-gb">'+body+'</div>':'')+'</li>'}
function actBtns(s){const A=actsOf(s),cells=A.filter(a=>a.cell),rest=A.filter(a=>!a.cell);let h='';
 if(rest.length)h+='<div class="lb-acts">'+rest.map(a=>'<button type="button" class="lb-act'+(a.sub?' lb-act2':'')+(UI.attn&&!a.dis?' lb-attn':'')+'" data-act="x" data-x="'+a.id+'" data-f="x'+a.id+'"'+(a.pressed!=null?' aria-pressed="'+!!a.pressed+'"':'')+(a.dis?' disabled':'')+'>'+ic(a.icon||'hand')+'<span>'+esc(a.label)+'</span></button>').join('')+'</div>';
 if(cells.length)h+='<div class="lb-cellrow" role="group" aria-label="'+esc(cells[0].grp)+'"><span class="lb-cl">'+esc(cells[0].grp)+'</span><div style="grid-template-columns:repeat('+cells.length+',1fr)">'+cells.map(a=>'<button type="button" class="lb-cellb'+(UI.attn&&!a.dis?' lb-attn':'')+'" data-act="x" data-x="'+a.id+'" data-f="x'+a.id+'" aria-pressed="'+!!a.pressed+'"'+(a.dis?' disabled':'')+' aria-label="'+esc(cells[0].grp+' '+a.label)+'">'+esc(a.label)+'</button>').join('')+'</div></div>';
 return h}
const MOREQ={1:['더 큰 힘이 든 것은?',['물이 가득 찬 물통','빈 물통'],0,'물이 가득 찬 물통이 더 무거워서 밀 때 더 큰 힘이 들어요.'],
 2:['물체 한 개를 몇 번 칸에 놓았을 때 수평이 되었나요?',['1번','2번','3번','4번'],1,'물체 두 개를 1번 칸에 놓으면 물체 한 개는 2번 칸에서 수평이 돼요. 물체 두 개가 받침점에 더 가까이 있어요.'],
 5:['더 작은 힘이 든 것은?',['받침대에서 먼 곳을 누를 때','받침대에서 가까운 곳을 누를 때'],0,'받침대에서 먼 곳을 누를 때 화면의 숫자가 더 작았어요.']};
function taskCard(s){const r=R(),A=acted(s),L=looked(s),D=isDone(r.step)&&(s.k!=='more'||r.more.a!=null);
 let h='<p class="lb-stat'+(D?' lb-statok':'')+'" role="status">'+ic(D?'check':'info')+'<span>'+esc(hintOf(s))+'</span></p><ol class="lb-guide">';
 if(s.k==='scene'){let b1;const dn=!!r.done[s.id];
  if(s.opts&&!dn&&!fxOn(s.id))b1='<div class="lb-acts" role="group" aria-label="'+esc(s.ask)+'">'+s.opts.map((o,i)=>'<button type="button" class="lb-act lb-act2" data-act="pick" data-i="'+i+'" data-f="pk'+i+'">'+ic('place')+'<span>'+esc(o.t)+'</span></button>').join('')+'</div>';
  else if(!dn||fxOn(s.id))b1='<div class="lb-acts"><button type="button" class="lb-act" data-act="doit" data-f="doit"'+(UI.fx?' disabled':'')+'>'+ic('hand')+'<span>'+esc(s.act||'놓는 중')+'</span></button></div>';
  else b1='<div class="lb-acts"><button type="button" class="lb-act lb-act3" data-act="replay" data-f="replay">'+ic('replay')+'<span>처음부터 보기</span></button></div>';
  h+=gPart(1,'해 보기',dn?'ok':'cur',b1)+gPart(2,'살펴보기',dn?'ok':UI.fx?'cur':'wait','<p>'+esc(s.look)+'</p>');
  return cardHead('할 일',stepName(s))+wrapB(h+'</ol>')}
 if(s.k==='more'){const Q=MOREQ[V().no],ans=r.more.a,both=!!UI.mq.both||ans!=null;
  let b3='<p class="lb-q">'+esc(Q[0])+'</p><div class="lb-opts">'+Q[1].map((t,i)=>'<button type="button" class="lb-opt lb-optsm" data-f="mq'+i+'" data-mq="'+i+'" aria-pressed="'+(ans===i)+'"'+(both?'':' disabled')+'><i>'+(ans===i?ic('check'):'')+'</i><span>'+esc(t)+'</span></button>').join('')+'</div>';
  if(ans!=null)b3+='<div class="lb-msg '+(ans===Q[2]?'lb-good':'lb-try')+'">'+ic(ans===Q[2]?'check':'info')+'<span>'+(ans===Q[2]?Q[3]:'다시 해 보고 견줘요.')+'</span></div>';
  h+=gPart(1,'해 보기',both?'ok':'cur',actBtns(s))+gPart(2,'살펴보기',both?'ok':Object.keys(UI.mq).length?'cur':'wait','<p>'+esc(s.look)+'</p>')+gPart(3,'고르기',ans!=null?'ok':both?'cur':'wait',b3);
  return cardHead('더 알아보기','해도 되고 건너뛰어도 돼요')+wrapB(h+'</ol>')}
 const on3=s.rows.some(rowReady)||s.rows.some(k=>ROWS[k].t==='auto'&&acted(s));
 h+=gPart(1,'해 보기',L?'ok':'cur',actBtns(s));
 h+=gPart(2,'살펴보기',!A?'wait':L?'ok':'cur','<p>'+esc(s.look)+'</p>');
 h+=gPart(3,'기록하기',D?'ok':on3?'cur':'wait',s.rows.map(rowUI).join(''));
 return cardHead('할 일',stepName(s))+wrapB(h+'</ol>')}
function cWrong(v,r,i){return !!(r.clast&&r.bl[i]&&r.bl[i]===r.clast[i]&&r.bl[i]!==v.ans[i])}
function cChanged(r){return !r.clast||r.bl.some((w,i)=>w!==r.clast[i])}
function frameHTML(v,bl,mode){const r=R();let t=esc(v.frame);
 return t.replace(/\{(\d)\}/g,(m,i)=>{i=+i;const w=bl[i]||'';
  if(mode==='edit'){const st=w?' lb-fill':'';const f=UI.focus===i?' lb-focus':'';const wr=cWrong(v,r,i)?' lb-wrong':'';
   return '<button type="button" class="lb-blank'+st+f+wr+'" data-f="b'+i+'" data-blank="'+i+'" aria-label="빈칸 '+(i+1)+(w?': '+w:': 비어 있음')+(wr?', 다시 생각해 봐요':'')+'">'+(w?esc(w):'&#8203;')+'</button>'}
  return w?'<mark>'+esc(w)+'</mark>':'<span class="lb-sh-gap">______</span>'})}
function conclCard(){const v=V(),r=R();let h='';
 if(r.pred.length)h+='<div class="lb-mine"><b>내 예상</b> '+v.pred.map((q,j)=>r.pred[j]!=null?esc(q.o[r.pred[j]]):'').join(' / ')+'</div>';
 h+='<div class="lb-mine"><b>내 기록</b> '+v.rows.filter(rowDone).map(k=>esc(ROWS[k].n)+': '+esc(rowSum(k))).join(' / ')+'</div>';
 h+='<p class="lb-frame">'+frameHTML(v,r.bl,'edit')+'</p><div class="lb-chips" role="group" aria-label="낱말 카드">'+v.chips.map((c,i)=>'<button type="button" class="lb-chip" data-f="c'+i+'" data-chip="'+i+'">'+esc(c)+'</button>').join('')+'</div>';
 const all=r.bl.length&&r.bl.every(x=>x);
 if(!r.cmp)h+='<button type="button" class="lb-act" data-act="cmp" data-f="doit"'+(all&&cChanged(r)?'':' disabled')+'>'+ic('flask')+'<span>기록과 견주기</span></button>';
 if(r.cmp)h+='<div class="lb-cmp" role="status"><b>'+ic('flask')+'교과서 결론</b>'+esc(v.book)+'</div><div class="lb-msg lb-good">'+ic('check')+'<span>내 결론이 기록과 맞아요.</span></div>';
 else if(r.clast&&!cChanged(r)){const wr=r.bl.map((w,i)=>i).filter(i=>cWrong(v,r,i));h+='<div class="lb-msg lb-try" role="status">'+ic('info')+'<span>빨간 빈칸을 기록과 다시 견줘요.'+(r.ctry>=2&&wr.length?' '+wr.map(i=>esc(v.hint[i])).join(' '):'')+'</span></div>'}
 return cardHead('결론 쓰기','빈칸을 누르고 낱말 카드를 골라요')+wrapB(h)}

/* ───────── 결과 한 장 ───────── */
function barChart(v,r){let rows=v.rows.filter(k=>ROWS[k].t==='num');if(!rows.length)return '';
 /* 실험 5: 지레의 숫자와 빗면의 숫자는 서로 견주지 않으므로(지도서 149·151쪽) '직접-지레', '직접-빗면' 두 묶음으로 나눠 그림 */
 if(v.no===5)rows=['dir','lev',null,'dir','inc'];
 const valOf=k=>{const x=k&&r.rec[k];return x&&x.ok?x.v:null},vals=rows.map(valOf);const mx=Math.max(1,...vals.filter(x=>x!=null))*1.15;
 const n=rows.length,W=340,H=150,bw=Math.min(64,(W-20)/n-18),gap=(W-n*bw)/(n+1);let g='<svg class="lb-chart" viewBox="0 0 '+W+' '+(H+44)+'" role="img" aria-label="기록한 숫자 막대그래프">';
 rows.forEach((k,i)=>{const x=gap+i*(bw+gap);if(!k){g+='<path d="M'+(x+bw/2)+' 8 V'+(H+30)+'" stroke="#9E968A" stroke-dasharray="4 4"/>';return}
  const v0=vals[i],hh=v0==null?0:v0/mx*H,nm=ROWS[k].n.replace(/\(.*\)/,'').replace(' 이용할 때','').replace(' 들어 올릴 때','');const c=v.no===5?(k==='dir'?'#2F68B0':'#A9541A'):(i%2?'#A9541A':'#2F68B0');
  g+='<rect x="'+x+'" y="'+(H-hh)+'" width="'+bw+'" height="'+hh+'" fill="'+c+'"/>'+(v0!=null?'<text x="'+(x+bw/2)+'" y="'+(H-hh-5)+'" text-anchor="middle" font-size="16" font-weight="700" fill="#141A26">'+v0+'</text>':'')+
  '<text x="'+(x+bw/2)+'" y="'+(H+20)+'" text-anchor="middle" font-size="'+(nm.length>5?12.5:15)+'" fill="#141A26">'+esc(nm)+'</text>'});
 return g+'<path d="M0 '+H+' H'+W+'" stroke="#9E968A"/></svg>'}
function sheetTable(v,r){let h='<table class="lb-tbl"><caption class="lb-sr">관찰 기록</caption><thead><tr><th scope="col">무엇을</th><th scope="col">내 기록</th></tr></thead><tbody>';
 v.rows.forEach(k=>{h+='<tr><th scope="row">'+esc(ROWS[k].n)+'</th><td>'+(rowDone(k)?esc(rowSum(k)):'—')+'</td></tr>'});
 return h+'</tbody></table>'}
function planSummary(v,r){const P=v.plan;if(!P)return '';if(!r.planOk)return '<p>(계획을 건너뛰었어요)</p>';
 return '<div class="lb-sh-tags">'+P.rows.map(x=>{const d=r.plan[x[0]]==='d';return '<span class="lb-sh-tag'+(d?' lb-d':'')+'">'+(d?'다르게: ':'같게: ')+esc(x[1])+'</span>'}).join('')+'</div>'}
function sheetHTML(){const v=V(),r=R();const done=v.steps.map(id=>stepDef(v,id)).filter(s=>(s.k==='scene'||s.k==='meas')&&s.id!=='tools');
 const today=new Date();const ds=today.getFullYear()+'. '+(today.getMonth()+1)+'. '+today.getDate()+'.';
 let h='<article class="lb-sheet" id="lbSheet" aria-label="실험 결과 한 장"><div class="lb-sh-in"><header class="lb-sh-h"><div><h2>실험 결과 한 장 · '+esc(v.title)+'</h2><span>탐구 실험관 · 3학년 1학기 과학 · 1. 힘과 우리 생활 · '+ds+'</span></div><div class="lb-sh-name">이름 <u>'+(esc(DB.name)||'&nbsp;')+'</u></div></header><div class="lb-sh-grid"><div class="lb-sh-col">';
 h+='<section class="lb-sh-sec"><h3><i></i>실험 문제</h3><p><b>'+esc(v.q)+'</b></p>'+planSummary(v,r)+'</section>';
 h+='<section class="lb-sh-sec lb-sh-po"><h3><i></i>실험한 차례</h3><div class="lb-sh-steps">'+done.map((s,i)=>'<div><b>'+(i+1)+'.</b> '+esc(s.t)+'</div>').join('')+'</div></section>';
 h+='<section class="lb-sh-sec"><h3><i></i>내 예상</h3><p>'+v.pred.map((q,j)=>(v.pred.length>1?esc(q.q)+' ':'')+(r.pred[j]!=null?esc(q.o[r.pred[j]]):'(고르지 않았어요)')).join('<br>')+(r.why?'<br>까닭: '+esc(r.why):'')+'</p></section>';
 h+='</div><div class="lb-sh-col"><section class="lb-sh-sec"><h3><i></i>관찰 기록</h3>'+sheetTable(v,r)+barChart(v,r)+'</section>';
 h+='<section class="lb-sh-sec"><h3><i></i>내 결론</h3><div class="lb-sh-box"><p class="lb-sh-concl">'+frameHTML(v,r.bl,'sheet')+'</p>'+(r.cmp?'<p class="lb-sh-book">교과서 결론: '+esc(v.book)+'</p>':'')+'</div></section>';
 h+='</div></div>'+picsHTML(snapList(v,r))+'<section class="lb-sh-sec lb-sh-po lb-sh-fill"><h3><i></i>새로 알게 된 것 · 더 알고 싶은 것</h3><div class="lb-sh-lines">'+'<div class="lb-ln"></div>'.repeat(9)+'</div></section>';
 h+='<footer class="lb-sh-f"><span>아주 단순하게 만든 모형의 결과예요. 실제 교실에서는 숫자가 조금씩 달라요.</span><span>만든 사람: 초등교사 홍지희</span></footer></div></article>';
 return h}
const LABNAME='force';
function snapsOf(v,r){const L=[],no=v.no,S=(g,vb,cap)=>L.push([svg(g,cap,vb),cap]);const sm=k=>rowDone(k)?rowSum(k):'—';
 if(no===1){const gb=(lv,pre)=>bg({room:1})+deskTop()+boxAt('B',BXX.edge.B+(pre?BXX.mv:0))+boxAt('A',BXX.edge.A+(pre?BXX.mv:0))+gauge(720,40,lv,['㉮','㉯'],-1);
  S(bg({room:1})+deskTop()+boxAt('B',BXX.mid.B)+boxAt('A',BXX.mid.A)+gauge(720,40,[4,1],['㉮','㉯'],-1),'40 20 900 500','들어 보기 · '+sm('heavy'));
  S(gb([4,1],1),'40 20 900 500','밀기 · ㉮ '+(rowDone('pushA')?rowSum('pushA'):'—')+' · ㉯ '+(rowDone('pushB')?rowSum('pushB'):'—'));
  S(gb([4,1],1),'40 20 900 500','당기기 · ㉮ '+(rowDone('pullA')?rowSum('pullA'):'—')+' · ㉯ '+(rowDone('pullB')?rowSum('pullB'):'—'))}
 if(no===2)[['tilt1',{l:{2:1},r:{}}],['bal1',{l:{2:1},r:{2:1}}],['tilt2',{l:{2:2},r:{2:1}}],['bal2',{l:{2:2},r:{4:1}}]].forEach(([k,b])=>S(bg({})+balance(b),'60 120 840 320',ROWS[k].n+' · '+(rowDone(k)?R().rec[k].f.map((x,i)=>ROWS[k].f[i].o[x]).slice(0,1).join(''):'—')));
 if(no===3)['cp','sp','bm','ru'].forEach(k=>S(bg({})+escale(ES.x,{on:true,val:ROWS[k].show,item:k}),'280 260 400 190',ITEM[k]+' · '+sm(k)));
 if(no===4)[['cpen','cpen',160],['spen','spen',120],['clay','clay',75]].forEach(([k,it,w])=>{const st=R().st;S(bg({})+stand()+sscale({read:w,item:it}),(SP.x-120)+' '+(pY(w)-62)+' 300 124',ROWS[k].n.replace('(지퍼 백에 넣어)','')+' · '+sm(k))});
 if(no===5){S(bg({})+fmeter(480,190,{on:true,val:'180'})+hand(480,76,90,.9)+milk(480,396,.9),'330 60 300 380','직접 · '+sm('dir'));
  S(bg({})+lever({milk:'near',press:'far',val:'45',a1:4}),'110 150 760 320','지레 · '+sm('lev'));
  S(bg({})+slope({hold:1})+milkOn(1,{meter:true,val:'40'})+slopeCallout('40'),'140 30 760 430','빗면 · '+sm('inc'))}
 return L}
/* ───────── 결과 한 장: 관찰 그림 · 이미지로 복사/저장 ───────── */
function picsHTML(list){if(!list||!list.length)return '';
 return '<section class="lb-sh-sec lb-sh-picsec"><h3><i></i>관찰 그림</h3><div class="lb-sh-pics" style="--n:'+list.length+'">'+list.map(p=>'<figure class="lb-sh-pic">'+p[0]+'<figcaption>'+esc(p[1])+'</figcaption></figure>').join('')+'</div></section>'}
function snapList(v,r){const n0=NAR,l0=LEG;NAR=true;LEG=[];let L=[];try{L=snapsOf(v,r)}catch(e){L=[]}NAR=n0;LEG=l0;return L}
const SH_SKIP=/^(animation|transition|will-change|cursor|caret|scroll|overscroll|touch-action|user-select|-webkit-user|pointer-events|view-transition|content-visibility|contain-intrinsic)/;
function shInline(src,dst){const cs=getComputedStyle(src);let t='';
 if(src instanceof SVGElement){if(src.tagName.toLowerCase()==='svg'&&src.parentNode&&!(src.parentNode instanceof SVGElement)){for(const p of ['width','height','display','margin','vertical-align','max-width','max-height','box-sizing'])t+=p+':'+cs.getPropertyValue(p)+';'}
  for(const p of ['fill','fill-opacity','stroke','stroke-width','stroke-opacity','stroke-dasharray','stroke-linecap','stroke-linejoin','opacity','font-size','font-weight','font-family','text-anchor','dominant-baseline','paint-order','visibility','display','color'])t+=p+':'+cs.getPropertyValue(p)+';'}
 else{for(let i=0;i<cs.length;i++){const p=cs[i];if(SH_SKIP.test(p))continue;t+=p+':'+cs.getPropertyValue(p)+';'}}
 t+='animation:none;transition:none;';dst.setAttribute('style',t);dst.removeAttribute('class');
 for(let i=0;i<src.children.length;i++)if(dst.children[i])shInline(src.children[i],dst.children[i])}
function sheetBlob(){return new Promise((ok,no)=>{const box=document.createElement('div');box.className='lb-shimg';box.setAttribute('aria-hidden','true');
 box.innerHTML=sheetHTML().replace('id="lbSheet"','');document.body.appendChild(box);
 const run=()=>{try{const el=box.firstElementChild;const w=Math.ceil(el.offsetWidth),h=Math.ceil(el.offsetHeight);const cl=el.cloneNode(true);const hi=[...el.querySelectorAll('.lb-sh-sec h3 i')],ci=[...cl.querySelectorAll('.lb-sh-sec h3 i')];let nn=0;hi.forEach((e,i)=>{if(e.getClientRects().length)ci[i].textContent=++nn});shInline(el,cl);
  cl.style.margin='0';const xml=new XMLSerializer().serializeToString(cl);
  const sv='<svg xmlns="http://www.w3.org/2000/svg" width="'+w+'" height="'+h+'"><foreignObject x="0" y="0" width="'+w+'" height="'+h+'">'+xml+'</foreignObject></svg>';
  box.remove();const img=new Image();img.onload=()=>{try{const k=2,c=document.createElement('canvas');c.width=w*k;c.height=h*k;const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.scale(k,k);x.drawImage(img,0,0);c.toBlob(b=>b?ok(b):no(new Error('blob')),'image/png')}catch(e){no(e)}};img.onerror=()=>no(new Error('img'));
  img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(sv)}catch(e){box.remove();no(e)}};
 (document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(()=>requestAnimationFrame(()=>requestAnimationFrame(run)))})}
function imgName(){const d=new Date(),p=n=>String(n).padStart(2,'0');return 'lab-'+LABNAME+'-'+DB.cur+'-'+d.getFullYear()+p(d.getMonth()+1)+p(d.getDate())+'.png'}
function saveImg(blob){const go=b=>{const u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download=imgName();document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),4000)};
 return (blob?Promise.resolve(blob):sheetBlob()).then(go)}
function copyImg(){const p=sheetBlob();
 if(!(navigator.clipboard&&navigator.clipboard.write&&window.ClipboardItem)){p.then(b=>saveImg(b)).then(()=>flash('이 브라우저는 이미지 복사를 못 해서 파일로 저장했어요.','info'),()=>flash('이미지를 만들지 못했어요. 인쇄하기를 써 주세요.','info'));return}
 let it;try{it=new ClipboardItem({'image/png':p})}catch(e){it=null}
 (it?navigator.clipboard.write([it]):p.then(b=>navigator.clipboard.write([new ClipboardItem({'image/png':b})])))
  .then(()=>flash('결과 한 장을 이미지로 복사했어요. 붙여 넣기 하면 돼요.','info'))
  .catch(()=>p.then(b=>saveImg(b)).then(()=>flash('복사가 안 되어 이미지 파일로 저장했어요.','info'),()=>flash('이미지를 만들지 못했어요. 인쇄하기를 써 주세요.','info')))}
function sheetBody(){return '<div class="lb-sheetwrap"><div class="lb-sheetside"><div class="lb-sideinfo"><label class="lb-label" for="lbName" style="margin:0">이름</label><input id="lbName" class="lb-input" maxlength="12" autocomplete="off" placeholder="이름을 써요" value="'+esc(DB.name)+'"><span>이름은 이 기기에만 저장돼요.</span></div>'+
 '<button type="button" class="lb-btn" data-act="print" data-f="print">'+ic('print')+'인쇄하기</button><button type="button" class="lb-btn" data-act="copyimg" data-f="copyimg">'+ic('copy')+'이미지로 복사</button><button type="button" class="lb-btn" data-act="saveimg" data-f="saveimg">'+ic('image')+'이미지로 저장</button><div class="lb-sideinfo"><span><b>A4 한 장</b>으로 인쇄돼요. 공책에 붙여도 좋아요.</span><span>실제 실험 결과와 견주어 봐요.</span></div></div>'+sheetHTML()+'</div>'}

/* ───────── 그리기 ───────── */
function set(el,h){if(!el||el._h===h)return false;const a=document.activeElement,f=a&&el.contains(a)&&a.dataset?a.dataset.f:null;const sel=a&&a.tagName==='INPUT'?[a.selectionStart,a.selectionEnd]:null;el.innerHTML=h;el._h=h;if(f){const n=el.querySelector('[data-f="'+f+'"]');if(n&&!n.disabled){n.focus({preventScroll:true});if(sel&&n.setSelectionRange)try{n.setSelectionRange(sel[0],sel[1])}catch(e){}}}return true}
function render(){const H=document.documentElement;H.classList.toggle('lb-big',!!DB.ui.big);
 $('#lbOpenMi').setAttribute('aria-pressed',!!DB.ui.open);$('#lbBigMi').setAttribute('aria-pressed',!!DB.ui.big);
 const main=$('#lbMain');
 if(!DB.cur||!EXPS[DB.cur]){H.classList.remove('lb-inrun');$('#lbSub').textContent='3학년 1학기 과학 · 1단원 힘과 우리 생활';$('#lbChoose').hidden=true;$('#lbClearMi').hidden=true;
  if(main.dataset.mode!=='home'){main.dataset.mode='home';main.className='lb-homewrap';main.innerHTML='';main._h=null}
  set(main,homeHTML());return}
 H.classList.add('lb-inrun');const v=V(),r=R(),s=curStep();
 $('#lbSub').textContent='실험 '+v.no+' · '+v.name;$('#lbChoose').hidden=false;$('#lbClearMi').hidden=false;
 if(main.dataset.mode!=='run'){main.dataset.mode='run';main.className='lb-run';main._h=null;
  main.innerHTML='<nav class="lb-rail" id="lbRail" aria-label="실험 과정"></nav><section class="lb-stage" aria-labelledby="lbH1"><div class="lb-head" id="lbHead"></div><div class="lb-body" id="lbBody"></div><div class="lb-foot" id="lbFoot"></div></section>'}
 set($('#lbRail'),railHTML());$('#lbRail').classList.toggle('lb-open',UI.rail);
 set($('#lbHead'),'<div><div class="lb-kick"><em>'+(r.step+1)+'단계</em>'+GROUPS[s.g]+(s.k==='more'?' · 건너뛰어도 돼요':'')+'</div><h1 id="lbH1" tabindex="-1">'+esc(s.t)+'</h1></div>'+(s.k==='sheet'?'':'<button class="lb-say" type="button" data-act="say" data-f="say" aria-pressed="'+UI.speaking+'">'+ic('speak')+'<span>'+(UI.speaking?'멈추기':'읽어 주기')+'</span></button>'));
 const body=$('#lbBody');
 if(s.k==='sheet'){if(body.dataset.k!=='sheet'){body.dataset.k='sheet';body._h=null}set(body,sheetBody())}
 else if(s.k==='intro'){if(body.dataset.k!=='intro'){body.dataset.k='intro';body._h=null}set(body,introBody())}
 else{if(body.dataset.k!=='main'){body.dataset.k='main';body._h=null;body.innerHTML='<div class="lb-col"><div class="lb-scene" id="lbScene"></div><div class="lb-leg" id="lbLeg"></div><div class="lb-notes" id="lbNotes"></div></div><aside class="lb-card" id="lbCard" tabindex="-1" aria-label="기록 카드"></aside>';body._h='x'}
  renderScene();set($('#lbNotes'),notesHTML(s));
  const card=$('#lbCard');const ch=s.k==='plan'?planCard():s.k==='pred'?predCard():(s.k==='meas'||s.k==='scene'||s.k==='more')?taskCard(s):s.k==='concl'?conclCard():'';card.hidden=!ch;set(card,ch)}
 set($('#lbFoot'),footHTML(v,r,s));
 fitAll();clearTimeout(render.ft);render.ft=setTimeout(fitAll,350)}
function fitBox(box,inner,min){if(!box||!inner)return;inner.style.zoom='';if(narrow()||!box.clientHeight)return;if(box.scrollHeight<=box.clientHeight+1)return;let z=Math.max(min,box.clientHeight/box.scrollHeight);inner.style.zoom=z.toFixed(3);let n=0;while(box.scrollHeight>box.clientHeight+1&&z>min&&n++<12){z=Math.max(min,z-.02);inner.style.zoom=z.toFixed(3)}}
function fitAll(){fitBox($('#lbCard .lb-card-b'),$('#lbCard .lb-fit'),.6);fitBox($('#lbRail'),$('#lbRail .lb-rwrap'),.7);fitBox($('#lbSheet'),$('#lbSheet .lb-sh-in'),.56)}
function renderScene(){const r=R(),s=curStep(),el=$('#lbScene');if(!el)return;NAR=narrow();LEG=[];
 let over='';
 if(UI.toast)over+='<div class="lb-toast '+(UI.toastK==='info'?'lb-toast3':'lb-toast2')+'" role="status">'+esc(UI.toast)+'</div>';
 const sv=sceneSVG();NAR=false;set(el,over+sv);
 const lg=$('#lbLeg');if(lg)set(lg,LEG.length?LEG.map(x=>'<span class="lb-lg">'+esc(x[1])+'</span>').join(''):'')}
function notesHTML(s){if(!s.why&&!s.care)return '';const hideWhy=s.k==='more'&&R().more.a==null;let h=hideWhy?'<div class="lb-note lb-know">'+ic('info')+'<div><b>알아 두어요</b>두 가지를 모두 해 보고 골라요.</div></div>':'<div class="lb-note lb-why">'+ic('why')+'<div><b>왜 그렇게 할까요?</b>'+esc(s.why)+'</div></div>';
 if(s.care)h+=s.care[0]==='care'?'<div class="lb-note lb-care">'+ic('care')+'<div><b>조심해요</b>'+esc(s.care[1])+'</div></div>':'<div class="lb-note lb-know">'+ic('info')+'<div><b>알아 두어요</b>'+esc(s.care[1])+'</div></div>';
 return h}
function stepName(s){return !R().planOk&&s.n0&&V().plan?s.n0:s.n}
function railHTML(){const v=V(),r=R(),N=v.steps.length;let h='<div class="lb-mtop"><b>'+(r.step+1)+'/'+N+' · '+esc(stepName(stepOf(r.step)))+'</b><span class="lb-mbar" aria-hidden="true">'+v.steps.map((x,i)=>'<i class="'+(i<=r.step?'lb-d':'')+'"></i>').join('')+'</span><button type="button" class="lb-mlist" data-act="rail" data-f="mlist" aria-expanded="'+UI.rail+'">'+ic('list')+'단계 목록</button></div>';
 h+='<div class="lb-rwrap"><p class="lb-rk">실험 '+v.no+'</p><h2>'+esc(v.name)+'</h2><div class="lb-rlist">';
 let g=-1;v.steps.forEach((id,i)=>{const s=stepOf(i);if(s.g!==g){g=s.g;h+='<div class="lb-grp">'+GROUPS[g]+'</div>'}
  const done=isDone(i)&&i!==r.step&&(s.k!=='more'||r.max>i),now=i===r.step,ok=canGo(i);
  h+='<button type="button" class="lb-rs'+(now?' lb-now':done?' lb-done':'')+'" data-go="'+i+'" data-f="g'+i+'"'+(now?' aria-current="step"':'')+(ok?'':' disabled')+'><i>'+(done?ic('check'):i+1)+'</i>'+esc(stepName(s))+(s.k==='more'?'<small>선택</small>':'')+'<span class="lb-sr">'+(done?' (끝냄)':now?' (지금 단계)':ok?'':' (아직)')+'</span></button>'});
 h+='</div><div class="lb-rail-note"><p>아주 단순하게 만든 모형이에요. 실제로는 숫자가 조금씩 달라요.</p><p>만든 사람: 초등교사 홍지희</p></div></div>';
 return h}
/* 이 단계의 행동 단추 */
function actsOf(s){const r=R(),A=[],busy=!!UI.fx,st=r.st||{},v=V();
 const cellActs=(bid,grp)=>{const b=boardOf(bid);for(let k=1;k<=5;k++)A.push({id:'c'+k,label:k+'번',cell:1,grp,pressed:!!(b.r&&b.r[k]),dis:busy})};
 switch(s.id){
  case 'lift':A.push({id:'liftA',label:'㉮ 상자 들어 보기',dis:busy},{id:'liftB',label:'㉯ 상자 들어 보기',dis:busy});break;
  case 'push':A.push({id:'pushA',label:'㉮ 상자 밀기',dis:busy},{id:'pushB',label:'㉯ 상자 밀기',dis:busy});break;
  case 'pull':A.push({id:'pullA',label:'㉮ 상자 당기기',dis:busy},{id:'pullB',label:'㉯ 상자 당기기',dis:busy});break;
  case 'p1':A.push({id:'l2',label:'왼쪽 2번 칸에 물체 올리기',dis:busy||!!boardOf('p1').l[2]});break;
  case 'p2':cellActs('p2','오른쪽 판에 놓을 칸');break;
  case 'p3':A.push({id:'l2b',label:'왼쪽 물체 위에 한 개 더 올리기',dis:busy||boardOf('p3').l[2]>=2});break;
  case 'p4':cellActs('p4','오른쪽 물체를 옮길 칸');break;
  case 'weigh':['cp','sp','bm','ru'].forEach(k=>A.push({id:k,label:ITEM[k],cell:1,grp:'전자저울에 올릴 학용품',dis:busy||rowDone(k),pressed:st.item===k}));break;
  case 'zero':if(v.no===4)A.push({id:'up',label:'나사 돌리기 (표시 자 위로)',dis:busy||rowDone('z1'),icon:'replay'},{id:'dn',label:'나사 돌리기 (표시 자 아래로)',dis:busy||rowDone('z1'),icon:'replay',sub:1});break;
  case 'hook':A.push({id:'cpen',label:'색연필 묶음 걸기',dis:busy||rowDone('cpen'),pressed:st.item==='cpen'},{id:'spen',label:'사인펜 묶음 걸기',dis:busy||rowDone('spen'),pressed:st.item==='spen'});eyeActs(A,busy);break;
  case 'bag':A.push({id:'bagOn',label:'지퍼 백 걸기',dis:busy||!!st.bagOn},{id:'up',label:'나사 돌리기 (표시 자 위로)',dis:busy||!st.bagOn||rowDone('z2'),icon:'replay',sub:1},{id:'dn',label:'나사 돌리기 (표시 자 아래로)',dis:busy||!st.bagOn||rowDone('z2'),icon:'replay',sub:1});break;
  case 'clay':A.push({id:'clay',label:'고무찰흙 넣기',dis:busy||st.item==='clay'});eyeActs(A,busy);break;
  case 'direct':A.push({id:'dir',label:'우유 걸고 천천히 들어 올리기',dis:busy||rowDone('dir')});break;
  case 'lever':A.push({id:'lev',label:'먼 쪽을 천천히 누르기',dis:busy||rowDone('lev')});break;
  case 'slope':A.push({id:'inc',label:'천천히 끌어 올리기',dis:busy||rowDone('inc')},{id:'fast',label:'빠르게 끌어 올리기',dis:busy||rowDone('inc'),sub:1});break;
  case 'more':if(v.no===1)A.push({id:'bfull',label:'물이 가득 찬 물통 밀기',dis:busy},{id:'bempty',label:'빈 물통 밀기',dis:busy});
   if(v.no===2)cellActs('more','오른쪽 판에 놓을 칸');
   if(v.no===5)A.push({id:'pnear',label:'가까운 곳 누르기',dis:busy},{id:'pfar',label:'먼 곳 누르기',dis:busy});break}
 return A}
function eyeActs(A,busy){const e=R().st.eye;[['up','위에서'],['lv','눈높이에서'],['dn','아래에서']].forEach(([k,t])=>A.push({id:'eye'+k,label:t,cell:1,grp:'눈 위치를 골라 표시 자 보기',pressed:e===k,dis:busy}))}
/* 아래 막대: 이전 · 진행 · 이어서 */
function footHTML(v,r,s){const N=v.steps.length;
 let h='<button type="button" class="lb-btn" data-act="prev" data-f="prev"'+(r.step===0?' disabled':'')+'>'+ic('left')+'이전</button>';
 h+='<div class="lb-fmid"><span class="lb-pgn">'+(r.step+1)+' / '+N+'</span><span class="lb-prog" aria-hidden="true">'+v.steps.map((x,i)=>'<i class="'+(i<r.step?'lb-d':i===r.step?'lb-n':'')+'"></i>').join('')+'</span></div>';
 let pri='이어서',priOn=canNext(),priAct='next';if(s.k==='sheet'){pri='실험 고르기로';priOn=true;priAct='home'}
 return h+'<button type="button" class="lb-btn lb-pri'+(priOn&&priAct==='next'?' lb-go':'')+'" data-act="'+priAct+'" data-f="pri"'+(priOn?'':' disabled')+'>'+esc(pri)+ic('right')+'</button>'}

/* ───────── 오늘의 실험: 탐구 문제 · 이렇게 해요 · 이것을 살펴봐요 (결과는 보여 주지 않음) ───────── */
function introPic(no,k){const n0=NAR,l0=LEG;NAR=true;LEG=[];let g=bg({}),vb='0 0 960 540';
 if(no===1){g=bg({room:1})+deskTop();
  if(k==='fill'){g+=boxAt('B',BXX.mid.B)+boxAt('A',BXX.mid.A);vb='260 130 330 300'}
  if(k==='lift'){g+=boxAt('B',BXX.mid.B)+'<g transform="translate(0 -46)">'+boxAt('A',BXX.mid.A)+hand(BXX.mid.A+30,378,-90,1.1)+hand(BXX.mid.A+200,378,-90,1.1)+'</g>';vb='255 70 340 330'}
  if(k==='push'){g+=boxAt('B',BXX.edge.B)+boxAt('A',BXX.edge.A)+hand(BXX.edge.A-48,320,0,1.2);vb='20 130 360 300'}
  if(k==='pull'){g+=boxAt('B',BXX.edge.B)+boxAt('A',BXX.edge.A)+hand(BXX.edge.A+272,262,180,1.2)+arrow(BXX.edge.A+280,205,BXX.edge.A+370,205);vb='60 130 420 300'}}
 if(no===2){if(k==='center'){g+=balance({l:{},r:{}});vb='60 220 840 220'}if(k==='one'){g+=balance({l:{2:1},r:{}});vb='60 140 840 300'}if(k==='two'){g+=balance({l:{2:1},r:{2:1}});vb='60 140 840 300'}if(k==='three'){g+=balance({l:{2:2},r:{}});vb='60 120 840 320'}}
 if(no===3){if(k==='flat'){g+=escale(ES.x,{});vb='280 300 400 160'}if(k==='power'){g+=escale(ES.x,{on:true,val:'0.0',pw:1});vb='280 300 400 160'}if(k==='weigh'){g+=escale(ES.x,{on:true,val:'',item:'cp'});vb='280 260 400 200'}if(k==='num'){g+=escale(ES.x,{on:true,val:'?'});vb='320 360 220 90'}}
 if(no===4){g+=stand();if(k==='hang'){g+=sscale({read:0});vb='230 20 460 450'}if(k==='zero'){g+=sscale({read:0,screw:1});vb='430 50 260 140'}if(k==='hook'){g+=sscale({read:160,item:'cpen'});vb='380 20 360 500'}if(k==='eye'){g+=sscale({read:160,item:'cpen',eye:'lv'});vb='470 170 300 200'}}
 if(no===5){if(k==='meter'){g+=fmeter(480,250,{on:true,val:'0'});vb='380 150 200 220'}if(k==='direct'){g+=fmeter(480,190,{on:true,val:'?'})+hand(480,76,90,.9)+milk(480,396,.9);vb='340 60 280 400'}
  if(k==='lever'){g+=lever({milk:'near',press:'far',val:'?',a1:4});vb='110 160 760 300'}if(k==='slope'){g+=slope({hold:1})+milkOn(.5,{meter:true,val:'?'});vb='140 160 760 300'}}
 const s=svg(g,'',vb).replace(' role="img" aria-label=""',' aria-hidden="true"');NAR=n0;LEG=l0;return s}
function introBody(){const v=V();
 return '<div class="lb-intro"><div class="lb-iq"><span class="lb-itag">'+ic('flask')+'탐구 문제</span><p>'+esc(v.q)+'</p></div>'+
 '<section class="lb-isec" aria-labelledby="lbIh1"><h2 id="lbIh1">'+ic('hand')+'이렇게 해요</h2><ol class="lb-isteps">'+v.how.map((x,i)=>'<li><div class="lb-ipic">'+introPic(v.no,x[0])+'</div><p><b>'+(i+1)+'</b><span>'+esc(x[1])+'</span></p></li>').join('')+'</ol></section>'+
 '<section class="lb-isec lb-ilook" aria-labelledby="lbIh2"><h2 id="lbIh2">'+ic('eye')+'이것을 살펴봐요</h2><ul>'+v.look.map(t=>'<li>'+ic('check')+'<span>'+esc(t)+'</span></li>').join('')+'</ul></section></div>'}
/* ② 살펴보기: 볼 곳을 확대 렌즈로 */
let LZ=0;
function lensOf(s,g){let sp=s.spot;if(typeof sp==='function')sp=sp();if(!sp||!(acted(s)||UI.fx))return '';
 const [x,y,rr,z,lx,ly]=sp,R2=Math.round(rr*z),id='lbLz'+(++LZ),dx=lx-x,dy=ly-y,d=Math.hypot(dx,dy)||1;
 const ax=x+dx/d*rr,ay=y+dy/d*rr,bx=lx-dx/d*R2,by=ly-dy/d*R2;
 return '<g class="lb-lens" aria-hidden="true"><circle cx="'+x+'" cy="'+y+'" r="'+rr+'" fill="none" stroke="var(--lb-lens)" stroke-width="5" stroke-dasharray="12 8"/>'+
  '<path d="M'+ax.toFixed(1)+' '+ay.toFixed(1)+' L'+bx.toFixed(1)+' '+by.toFixed(1)+'" stroke="var(--lb-lens)" stroke-width="5" stroke-linecap="round"/>'+
  '<clipPath id="'+id+'"><circle cx="'+lx+'" cy="'+ly+'" r="'+R2+'"/></clipPath><circle cx="'+lx+'" cy="'+ly+'" r="'+(R2+7)+'" fill="var(--w-label)"/>'+
  '<g clip-path="url(#'+id+')"><rect x="'+(lx-R2)+'" y="'+(ly-R2)+'" width="'+2*R2+'" height="'+2*R2+'" fill="var(--w-wall)"/><g transform="translate('+lx+' '+ly+') scale('+z+') translate('+(-x)+' '+(-y)+')">'+g.replace(/ id="[^"]*"/g,'').replace(/<g class="lb-lens"[\s\S]*$/,'')+'</g></g>'+
  '<circle cx="'+lx+'" cy="'+ly+'" r="'+R2+'" fill="none" stroke="var(--lb-lens)" stroke-width="7"/></g>'}
function homeArt(no){NAR=true;LEG=[];let g=bg({}),vb='120 70 720 420';
 if(no===1){g=bg({room:1})+deskTop()+boxAt('B',BXX.edge.B)+boxAt('A',BXX.edge.A)+hand(BXX.edge.A-48,320,0,1.2);vb='20 120 600 346'}
 if(no===2){g+=balance({l:{2:2},r:{4:1}});vb='60 140 840 320'}
 if(no===3){g+=escale(ES.x,{on:true,val:'14.6',item:'bm'});vb='260 230 440 230'}
 if(no===4){g+=stand()+sscale({read:75,item:'clay'});vb='220 0 760 440'}
 if(no===5){g+=lever({milk:'near',press:'far',val:'45',a1:4});vb='110 120 760 360'}
 const s=svg(g,'실험 '+no+' 처음 모습',vb);NAR=false;LEG=[];return s}
function homeHTML(){const card=k=>{const v=EXPS[k],r=DB.runs[k];const st=r?(r.fin?'끝냄 · 결과 보기':(r.step+1)+'단계부터 이어서'):'실험 시작하기';
 return '<section class="lb-exc" aria-labelledby="lbE'+v.no+'"><div class="lb-exc-art">'+homeArt(v.no)+'</div><div class="lb-exc-b"><h2 id="lbE'+v.no+'"><em>실험 '+v.no+'</em>'+esc(v.name)+'</h2><p class="lb-exp">'+esc(v.sub)+'</p><button type="button" class="lb-pickb" data-pick="'+k+'" data-f="k'+k+'"><i>'+ic(['','hand','scale','scale','spring','lever'][v.no])+'</i><span><b>'+st+'</b><span>교과서 실험</span></span>'+(r&&r.fin?'<small>'+ic('check')+'</small>':'')+'</button></div></section>'};
 return '<div class="lb-home"><div class="lb-home-h"><div class="lb-kick"><em>3학년 1학기 과학</em>1. 힘과 우리 생활</div><h1>무엇을 실험할까요?</h1><p>실험을 한 단계씩 직접 해 보고, 내 눈으로 본 것을 기록해요.</p></div>'+
 '<div class="lb-ex lb-ex5">'+['e1','e2','e3','e4','e5'].map(card).join('')+'</div>'+
 '<p class="lb-model">'+ic('info')+'<span>아주 단순하게 만든 모형이에요. 같은 조건이면 언제나 같은 결과가 나와요. 숫자는 교과서·지도서 예시 값이고, 실제로는 조금씩 달라요. \'팔에 드는 힘\' 막대는 이 자료에서 정한 모습이에요.</span></p></div>'}

/* ───────── 동작 ───────── */
function fx(id,ms,after){UI.fx={id,n:++UI.nonce};render();later(()=>{UI.fx=null;if(after)after();save();render()},ms)}
function doAnim(id,ms){fx(id,ms,()=>{const r=R();if(r)r.done[id]=true;const p=$('#lbFoot [data-act="next"]');if(p&&!p.disabled)p.focus({preventScroll:true})})}
function act(a,el){const v=V(),r=R();
 if(a==='prev'){if(r.step>0)go(r.step-1);return}
 if(a==='next'){if(canNext())go(r.step+1);return}
 if(a==='home'){DB.cur=null;resetUI();save();render();scrollTo(0,0);return}
 if(a==='doit'){const s=curStep();if(UI.fx)return;doAnim(s.id,s.dur||1500);return}
 if(a==='pick'){const s=curStep(),o=s.opts[+el.dataset.i];if(UI.fx||!o)return;if(o.bad){flash(o.bad);return}doAnim(s.id,s.dur||1500);return}
 if(a==='replay'){const s=curStep();doAnim(s.id,s.dur||1500);return}
 if(a==='check'){if(!planChanged(r))return;r.planLast=JSON.parse(JSON.stringify(r.plan));r.planOk=planGood(v,r);save();render();return}
 if(a==='x'){doX(el.dataset.x);return}
 if(a==='trial'){trial(el.dataset.row);return}
 if(a==='rowrec'){rowRec(el.dataset.row);return}
 if(a==='ordclear'){const D=UI.draft[el.dataset.row]=UI.draft[el.dataset.row]||{};D.o=[];UI.wrong[el.dataset.row]=[];render();return}
 if(a==='cmp'){if(!r.bl.every(x=>x)||!cChanged(r))return;if(r.bl.every((w,i)=>w===v.ans[i])){r.cmp=true;r.clast=r.bl.slice()}else{r.ctry=(r.ctry||0)+1;r.clast=r.bl.slice()}save();render();return}
 if(a==='copyimg'){copyImg();return}if(a==='saveimg'){saveImg().catch(()=>flash('이미지를 만들지 못했어요. 인쇄하기를 써 주세요.','info'));return}if(a==='print'){window.print();return}
 if(a==='say'){toggleSay();return}
 if(a==='rail'){UI.rail=!UI.rail;render();return}}
/* 화면 숫자가 차례로 올라감(힘 측정기) */
function ramp(row,to,ms,after){const steps=[.25,.55,.8,1];Object.assign(UI.mq,{row,val:0,hl:false});steps.forEach((t,i)=>later(()=>{UI.mq.val=Math.round(to*t);renderScene()},(i+1)*ms/(steps.length+1)));fx(row,ms,after)}
/* 판 위 물체를 옮긴 뒤 기울기 */
function boardMove(bid,fn,after){const r=R(),b=boardOf(bid);UI.a0=boardTilt(b)*TILT;fn(b);r.st.bd[bid]=b;save();fx('bd',950,()=>{UI.a0=null;if(after)after(b)})}
/* 실험 단계의 행동 */
function doX(id){const v=V(),r=R(),s=curStep(),st=r.st;if(UI.fx)return;if(!/^eye/.test(id))r.act[s.id]=1;
 if(/^(lift|push|pull)[AB]$/.test(id)){fx(id,id[0]==='l'?1700:2000,()=>{r.seen[id]=1});return}
 if(id==='bfull'||id==='bempty'){fx(id,2000,()=>{UI.mq[id]=1;if(UI.mq.bfull&&UI.mq.bempty)UI.mq.both=1});return}
 if(id==='l2'){boardMove('p1',b=>{b.l[2]=1;b.anim=['l',2]},b=>{delete b.anim;r.seen.t1=1});return}
 if(id==='l2b'){boardMove('p3',b=>{b.l[2]=2;b.anim=['l',2]},b=>{delete b.anim;r.seen.t2=1});return}
 if(/^c\d$/.test(id)){const k=+id[1],bid=s.id;boardMove(bid,b=>{b.r={};b.r[k]=1;b.anim=['r',k]},b=>{delete b.anim;if(boardTilt(b)===0){if(bid==='p2')r.seen.b1=1;if(bid==='p4')r.seen.b2=1;if(bid==='more'){UI.mq.both=1;UI.mq.found=k}}else UI.mq.tried=1});return}
 if(['cp','sp','bm','ru'].indexOf(id)>=0){st.item=id;UI.mq={hl:false};fx(id,900,()=>{r.pend[id]=ROWS[id].show;const n=$('[data-in="'+id+'"]:not([disabled])');if(n)n.focus({preventScroll:true})});return}
 if(id==='up'||id==='dn'){st.off=(st.off||0)+(id==='up'?-5:5);st.off=Math.max(-25,Math.min(25,st.off));fx('screw',450,()=>{const row=s.id==='bag'?'z2':'z1';if(readNow()===0){r.rec[row]={ok:1};UI.fb[row]=[1,'표시 자를 0에 맞췄어요.'];flash('표시 자가 0에 맞았어요.','info')}});return}
 if(id==='bagOn'){const from=readNow();st.bagOn=1;st.bag=true;st.item='bag';UI.mq.from=from;fx('hang2',1500,()=>{UI.mq.from=null});return}
 if(id==='cpen'||id==='spen'||id==='clay'){const from=readNow();st.item=id;UI.mq.from=from;fx('hang2',1600,()=>{UI.mq.from=null;r.pend[id]=ROWS[id].show});return}
 if(/^eye(up|lv|dn)$/.test(id)){st.eye=id.slice(3);save();render();return}
 if(id==='dir'){ramp('dir',180,1800,()=>{r.pend.dir='180'});return}
 if(id==='lev'){ramp('lev',45,1800,()=>{r.pend.lev='45'});return}
 if(id==='inc'){ramp('inc',40,2200,()=>{r.pend.inc='40'});return}
 if(id==='fast'){UI.mq={row:'inc',val:0};[70,12,95,30,58].forEach((n,i)=>later(()=>{UI.mq.val=n;renderScene()},(i+1)*170));fx('fast',1100,()=>{UI.mq={};flash('빠르게 끌면 숫자가 마구 바뀌어 읽기 어려워요. 천천히 끌어 올려요.')});return}
 if(id==='pnear'||id==='pfar'){ramp(id,id==='pnear'?90:45,1600,()=>{UI.mq.last=id;UI.mq.row=null;UI.mq[id]=1;if(UI.mq.seenN||id==='pnear')UI.mq.seenN=1;if(UI.mq.seenF||id==='pfar')UI.mq.seenF=1;if(UI.mq.seenN&&UI.mq.seenF)UI.mq.both=1});return}}
/* 숫자 적기: 화면 숫자와 같은지만 알려 줌. 같은 값으로 다시 누르면 세지 않음 */
function tryKey(k,val){const r=R();if(r.last[k]===val)return -1;r.last[k]=val;r.tries[k]=(r.tries[k]||0)+1;return r.tries[k]}
function trial(row){const r=R(),R0=ROWS[row],pend=r.pend[row];if(pend==null||!numOpen(row))return;const txt=String(UI.inp[row]||'').trim();
 if(!txt||!/^\d+(\.\d*)?$/.test(txt)){UI.fb[row]=[0,'숫자로 써요.'];render();return}
 const n=+txt;
 if(txt===String(R0.v)){r.rec[row]={ok:1,v:R0.v};delete r.pend[row];UI.inp[row]='';UI.mq={};UI.attn=false;UI.fb={};UI.fb[row]=[1,R0.u==='g'&&V().no===3?'잘 읽었어요. 소수점 아래는 읽지 않아요.':'잘 읽고 적었어요.'];save();render();const p=$('#lbFoot [data-act="next"]:not(:disabled)');if(p&&isDone(r.step))p.focus({preventScroll:true});return}
 const t=tryKey(row+':t',txt);
 if(t===-1){UI.fb[row]=[0,'숫자가 그대로예요. 화면을 다시 봐요.'];render();return}
 if(V().no===3&&(txt===R0.show||n===Math.round(+R0.show*10)))UI.fb[row]=[0,'소수점 아래 숫자는 읽지 않아요. '+R0.show+' g이면 '+R0.v+' g이라고 써요.'];
 else if(V().no===3&&n===Math.round(+R0.show))UI.fb[row]=[0,'반올림하지 않아요. 소수점 아래 숫자는 그냥 읽지 않아요.'];
 else if(t>=2){UI.mq.hl=true;UI.fb[row]=[0,V().no===4?'표시 자와 나란한 눈금을 한 칸씩 세어 봐요. 큰 눈금 한 칸은 25 g, 작은 눈금 한 칸은 5 g이에요.':'반짝이는 화면의 숫자를 한 자리씩 견주어 써요.']}
 else UI.fb[row]=[0,V().no===4?'눈금을 다시 읽어 봐요. 확대 렌즈를 봐요.':'화면의 숫자와 달라요. 다시 봐요.'];
 save();render()}
function rowRec(row){const r=R(),R0=ROWS[row],D=UI.draft[row]||{};let ok,wrong=[],key;
 if(R0.t==='sel'){const f=D.f||[];R0.f.forEach((x,j)=>{if(f[j]!==x.ok)wrong.push(j)});ok=!wrong.length;key=f.join(',')}
 if(R0.t==='order'){const o=D.o||[];ok=o.join()===R0.ans.join();key=o.join(',');if(!ok)wrong=[0]}
 if(ok){UI.attn=false;r.rec[row]=R0.t==='sel'?{ok:1,f:D.f.slice()}:{ok:1,o:D.o.slice()};UI.fb={};UI.fb[row]=[1,'잘 살펴보고 적었어요.'];UI.wrong[row]=[];save();render();const p=$('#lbFoot [data-act="next"]:not(:disabled)');if(p&&isDone(R().step))p.focus({preventScroll:true});return}
 const t=tryKey(row+':r',key);
 if(t===-1){UI.fb[row]=[0,'고른 것이 그대로예요. 다시 살펴봐요.'];render();return}
 UI.wrong[row]=wrong;
 if(R0.t==='order')UI.fb[row]=[0,'내가 쓴 무게를 다시 견줘 봐요. 숫자가 클수록 무거워요.'];
 else if(t>=2){UI.attn=true;UI.fb[row]=[0,'빨간 칸을 다시 봐요. 아래 반짝이는 단추를 눌러 다시 해 봐도 돼요.']}
 else UI.fb[row]=[0,'빨간 칸을 다시 살펴보고 골라요.'];
 save();render()}

/* ───────── 읽어 주기 ───────── */
function sayText(){const v=V(),r=R(),s=curStep(),out=[endP(s.t)];
 if(s.k==='intro'){out.push('탐구 문제. '+endP(v.q),'이렇게 해요. '+v.how.map((x,i)=>(i+1)+'번, '+x[1]).join(' '),'이것을 살펴봐요. '+v.look.join(' '));return out.join(' ')}
 if(s.k==='plan')out.push(endP(v.q),'조건마다 다르게나 같게를 골라요. '+v.plan.rows.map(x=>x[1].replace(/\((.*)\)/,' ')+'.').join(' '));
 if(s.k==='pred')v.pred.forEach(q=>{if(v.pred.length>1)out.push(endP(q.q));out.push(q.o.map((t,i)=>(i+1)+'번, '+t).join(' '))});
 if(s.k==='meas'||s.k==='scene'||s.k==='more'){out.push(endP(hintOf(s).replace(/^[①②③] /,'')));if(s.look)out.push('살펴보기. '+endP(s.look))}
 if(s.k==='concl'){out.push(v.frame.replace(/\{(\d)\}/g,(m,i)=>r.bl[+i]||'빈칸'));out.push('낱말 카드: '+v.chips.join(', ')+'.')}
 if(s.why)out.push('왜 그렇게 할까요? '+endP(s.why));if(s.care)out.push((s.care[0]==='care'?'조심해요. ':'알아 두어요. ')+endP(s.care[1]));
 return out.join(' ')}
function pickVoice(){const ss=window.speechSynthesis;if(!ss)return null;const vs=ss.getVoices().filter(x=>/^ko/i.test(x.lang));if(!vs.length)return null;return vs.find(x=>/Natural|Online/i.test(x.name))||vs.find(x=>/Google/i.test(x.name))||vs[0]}
function toggleSay(){const ss=window.speechSynthesis;if(UI.speaking){stopSay();render();return}
 if(!ss||typeof SpeechSynthesisUtterance==='undefined'){flash('이 기기에서는 읽어 주기를 쓸 수 없어요.');return}
 try{const u=new SpeechSynthesisUtterance(sayText());u.lang='ko-KR';const vo=pickVoice();if(vo)u.voice=vo;u.rate=.95;u.onend=u.onerror=()=>{UI.speaking=false;render()};ss.cancel();ss.speak(u);UI.speaking=true;render()}catch(e){flash('이 기기에서는 읽어 주기를 쓸 수 없어요.')}}
function stopSay(){UI.speaking=false;try{window.speechSynthesis&&speechSynthesis.cancel()}catch(e){}}
let flashT=0;
function flash(t,kind){const f=$('#lbFlash');if(kind!=='info'&&DB.cur&&$('#lbScene')){UI.toast=t;UI.toastK=kind||'';renderScene();clearTimeout(flashT);flashT=setTimeout(()=>{UI.toast='';renderScene()},3200)}else if(f){f.textContent=t;f.hidden=false;clearTimeout(flashT);flashT=setTimeout(()=>{f.hidden=true},2600)}}

/* ───────── 선생님 메뉴: 1초 동안 누르기(키보드는 확인 창) ───────── */
function openMenu(o){UI.menu=o;$('#lbMenu').hidden=!o;$('#lbTeach').setAttribute('aria-expanded',o);if(o){const b=$('#lbMenu button:not([hidden])');if(b)b.focus()}}
(function(){const b=$('#lbTeach');let t=0,held=false;const stop=()=>{clearTimeout(t);b.classList.remove('lb-holding')};
 b.addEventListener('pointerdown',e=>{if(UI.menu)return;held=false;b.classList.add('lb-holding');t=setTimeout(()=>{held=true;b.classList.remove('lb-holding');openMenu(true)},1000)});
 ['pointerup','pointerleave','pointercancel'].forEach(n=>b.addEventListener(n,stop));b.addEventListener('contextmenu',e=>e.preventDefault());
 b.addEventListener('click',e=>{if(UI.menu){if(!held)openMenu(false);held=false;return}if(held){held=false;return}if(e.detail===0){if(confirm('선생님 메뉴를 열까요?'))openMenu(true);return}flash('선생님 단추는 1초 동안 꾹 눌러요.')})})();

/* ───────── 입력 연결 ───────── */
document.addEventListener('click',e=>{const t=e.target.closest('button');
 if(UI.menu&&!e.target.closest('#lbMenu,#lbTeach'))openMenu(false);
 if(!t||t.id==='lbTeach')return;const r=DB.cur?R():null;
 if(t.id==='lbOpenMi'){DB.ui.open=!DB.ui.open;save();render();return}
 if(t.id==='lbBigMi'){DB.ui.big=!DB.ui.big;save();render();return}
 if(t.id==='lbChoose'){act('home');return}
 if(t.id==='lbClearMi'){if(DB.cur&&confirm('이 실험의 기록을 지울까요?')){DB.runs[DB.cur]=newRun();resetUI();enterStep();save();openMenu(false);render()}return}
 if(t.id==='lbClearAll'){if(confirm('이 기기에 저장한 모든 실험 기록을 지울까요?')){const ui=DB.ui;DB=blank();DB.ui=ui;resetUI();save();openMenu(false);render()}return}
 if(t.dataset.pick){DB.cur=t.dataset.pick;if(!DB.runs[DB.cur])DB.runs[DB.cur]=newRun();resetUI();enterStep();save();render();scrollTo(0,0);const h=$('#lbH1');if(h)h.focus({preventScroll:true});return}
 if(!r)return;
 if(t.dataset.go!=null){UI.rail=false;go(+t.dataset.go);return}
 if(t.dataset.act){act(t.dataset.act,t);return}
 if(t.dataset.plan){const [k,c]=t.dataset.plan.split(':');r.plan[k]=c;if(r.planOk&&planChanged(r))r.planOk=false;save();render();return}
 if(t.dataset.pred!=null){if(predLocked())return;const [j,i]=t.dataset.pred.split(':').map(Number);r.pred[j]=i;save();render();return}
 if(t.dataset.dr){const [row,j,i]=t.dataset.dr.split(':');const D=UI.draft[row]=UI.draft[row]||{};D.f=D.f||[];D.f[+j]=+i;if(UI.wrong[row])UI.wrong[row]=UI.wrong[row].filter(w=>w!==+j);render();return}
 if(t.dataset.ord){const [row,k]=t.dataset.ord.split(':');const D=UI.draft[row]=UI.draft[row]||{};D.o=D.o||[];if(D.o.indexOf(k)<0)D.o.push(k);UI.wrong[row]=[];render();return}
 if(t.dataset.mq!=null){r.more.a=+t.dataset.mq;save();render();return}
 if(t.dataset.blank!=null){const i=+t.dataset.blank;if(UI.focus===i&&r.bl[i]&&!r.cmp){r.bl[i]='';save()}UI.focus=i;render();return}
 if(t.dataset.chip!=null){const v=V(),w=v.chips[+t.dataset.chip];r.bl[UI.focus]=w;if(r.cmp&&r.bl.some((x,i)=>x!==v.ans[i]))r.cmp=false;const nx=r.bl.findIndex(x=>!x);if(nx>=0)UI.focus=nx;save();render();return}
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(UI.menu){openMenu(false);$('#lbTeach').focus()}else if(UI.rail){UI.rail=false;render()}return}
 const tg=e.target;
 if(tg.dataset&&tg.dataset.in!=null&&e.key==='Enter'){e.preventDefault();trial(tg.dataset.in);return}
 if(tg.closest&&tg.closest('input,textarea,select'))return;
 if(!DB.cur||e.altKey||e.ctrlKey||e.metaKey)return;
 if(e.key==='ArrowLeft'&&!tg.closest('.lb-seg')){if(R().step>0){e.preventDefault();go(R().step-1)}}
 if(e.key==='ArrowRight'&&!tg.closest('.lb-seg')){if(canNext()){e.preventDefault();go(R().step+1)}}});
document.addEventListener('input',e=>{const t=e.target;if(t.id==='lbWhy'&&!predLocked()){R().why=t.value;save()}
 if(t.dataset&&t.dataset.in!=null){const dec=V()&&V().no===3;UI.inp[t.dataset.in]=t.value.replace(dec?/[^\d.]/g:/[^\d]/g,'');if(t.value!==UI.inp[t.dataset.in])t.value=UI.inp[t.dataset.in]}
 if(t.id==='lbName'){DB.name=t.value;save();const u=$('#lbSheet .lb-sh-name u');if(u)u.textContent=DB.name||' '}});
let rzT=0,wasN=narrow();addEventListener('resize',()=>{clearTimeout(rzT);rzT=setTimeout(()=>{const n=narrow();if(n!==wasN){wasN=n;const s=$('#lbScene');if(s)s._h=null}if(DB.cur)render();else fitAll()},150)});
if(DB.cur&&EXPS[DB.cur]){if(!DB.runs[DB.cur])DB.runs[DB.cur]=newRun();enterStep()}
render();

addEventListener('beforeprint',()=>{const s=$('#lbSheet .lb-sh-in');if(s)s.style.zoom=''});addEventListener('afterprint',()=>{try{fitAll()}catch(e){}});
