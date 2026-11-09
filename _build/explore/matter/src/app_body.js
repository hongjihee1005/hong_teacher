/* 물체와 물질 실험관에서 더 쓰는 아이콘 */
Object.assign(I,{rod:'<rect x="3" y="9.5" width="18" height="5" rx="2"/><path d="M7 11.5h6"/>',
 tray:'<path d="M3 16h18l-2 3H5z"/><path d="M7 16V9h4v7M13 16v-5h4v5"/>',
 jar:'<path d="M6 4h12M7 4v15a2 2 0 002 2h6a2 2 0 002-2V4"/><path d="M7 12h10"/>',
 bubble:'<circle cx="9" cy="14" r="4"/><circle cx="16" cy="8" r="2.6"/><circle cx="17" cy="16.5" r="1.6"/>'});

/* ───────── 기록(이 기기에만) ───────── */
const KEY='hj-matter-v1';
function blank(){return {v:1,runs:{},cur:null,ui:{open:false,big:false},name:''}}
function newRun(){return {step:0,max:0,done:{},act:{},plan:{},planLast:null,planOk:false,pred:[],why:'',seen:{},rec:{},pend:{},last:{},tries:{},bl:[],clast:null,ctry:0,cmp:false,fin:false,more:{},st:{},obs:0}}
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
function enterStep(){const v=V(),r=R(),s=stepOf(r.step);r.st=r.st||{};
 if(s.k==='sheet')r.fin=!!(r.cmp&&v.rows.every(rowDone));
 if(s.k==='concl'&&!r.bl.length)r.bl=v.ans.map(()=>'');
 if(s.k==='concl')UI.focus=Math.max(0,r.bl.findIndex(x=>!x));
 const st=r.st;if(st.lw==null)st.lw=0;if(st.lj==null)st.lj=0}
/* 예상은 예상 단계 뒤의 관찰을 시작하면 잠김(예상 앞의 자유 관찰은 잠그지 않음) */
function predLocked(){const r=R();return !!r.obs}
function planChanged(r){if(!r.planLast)return true;return JSON.stringify(r.plan)!==JSON.stringify(r.planLast)}

/* ───────── 장면 ───────── */
function fxOn(id){return UI.fx&&UI.fx.id===id}
function has(id){const r=R(),k=idxOf(id);if(k<0)return false;return k<r.step||(k===r.step&&(!!r.done[id]||fxOn(id)))}
const sn=id=>!!R().seen[id]||fxOn(id);   /* 해 본 행동(또는 지금 하는 중) */

/* 실험 1 */
const FR={x:170,L:300,y0:150,dy:78};
function freeSpot(){const k=UI.mq.cur;if(!k)return null;const i=RODK.indexOf(k);return [FR.x+FR.L*.62,FR.y0+i*FR.dy,30,2.6,740,200]}
function paperSpot(){const k=UI.mq.cur;if(!k)return null;const i=RODK.indexOf(k);return [PAPER.x+PAPER.w/2,PAPER.rows[i],34,2.2,PAPER.x+PAPER.w/2,i<2?PAPER.rows[3]-8:PAPER.rows[0]+8]}
const SSLOT=i=>[140+(i%2)*380,128+Math.floor(i/2)*92];
function sandSpot(){const k=UI.mq.cur;if(!k||fxOn('s'+k))return null;const i=RODK.indexOf(k),[x,cy]=SSLOT(i);return [x+150,cy,30,1.9,858,318]}
function paperRods(only){let g='';RODK.forEach((k,i)=>{const on=only?only.indexOf(k)>=0:sn('t'+k);if(!on)return;const y=PAPER.rows[i],r=rodH(k,PAPER.x+40,y,PAPER.w-80,48);
  g+=fxOn('t'+k)?'<g'+an('lb-a-down',0,'--from:-120px')+'>'+r+'</g>':r});return g}
function sandRods(only){let g='';RODK.forEach((k,i)=>{const on=only?only.indexOf(k)>=0:(R().seen['s'+k]);if(!on)return;const [x,cy]=SSLOT(i);g+=rodH(k,x,cy,300,36,{scr:ROD[k].sc})+(NAR?'':'<text x="'+(x+150)+'" y="'+(cy+46)+'" text-anchor="middle" font-size="18" font-weight="800" fill="var(--w-labeltx)">'+ROD[k].n+'</text>')});return g}
const TK={x:170,top:112,w:620,bot:430,wl:196};
function tankRods(only){let g='';RODK.forEach((k,i)=>{const on=only?only.indexOf(k)>=0:sn('w'+k);if(!on)return;const x=TK.x+28+i*148,cy=ROD[k].fl?TK.wl+4:TK.bot-16,r=rodH(k,x,cy,124,26);
  g+=fxOn('w'+k)?'<g'+an(ROD[k].fl?'lb-a-bob':'lb-a-down',0,ROD[k].fl?'--dy:-120px':'--from:'+(-(cy-70))+'px')+'>'+r+'</g>':r});return g}
function e1Scene(s){const r=R(),id=s.id,f=UI.fx;let g=bg({});
 if(id==='gear'){const on=has('gear');
  if(!on)return g+itemArtAt('glove',330,330)+itemArtAt('goggle',600,330)+qmark(480,150);
  return g+'<g'+(fxOn('gear')?an('lb-a-up',0,'--from:120px'):'')+'>'+'<g transform="translate(480 170) scale(2.2)">'+itemArt('goggle')+'</g>'+hand(360,330,-80,1.5,1)+hand(600,330,-100,1.5,1)+'</g>'}
 if(id==='free'||id==='pred'||id==='plan'||id==='concl'){
  RODK.forEach((k,i)=>{const cy=FR.y0+i*FR.dy,cur=id==='free'&&UI.mq.cur===k;g+=rodH(k,FR.x,cy,FR.L,34,{hl:cur})+(NAR?'':'<text x="'+(FR.x-18)+'" y="'+(cy+8)+'" text-anchor="end" font-size="20" font-weight="800" fill="var(--w-labeltx)">'+ROD[k].n+'</text>');
   if(cur&&f)g+=hand(FR.x+FR.L+40,cy,180,.9,1)+(k==='wood'?wiggle(FR.x+FR.L*.3,cy-24):'')});
  if(id!=='free')g+=qmark(720,200);return g}
 if(id==='paper')return g+paperArt()+paperRods();
 if(id==='sand'){g+=sandArt()+sandRods();const k=f&&/^s/.test(f.id)?f.id.slice(1):null;
  if(f&&f.id==='hard')g+=rodH('wood',SAND.x+90,SAND.y+22,300,36)+hand(SAND.x+60,SAND.y-10,90,1.2,1)+arrow(SAND.x+250,SAND.y-60,SAND.x+250,SAND.y-6,'var(--lb-bad)',9);
  else if(k&&ROD[k])g+='<g'+an('lb-a-rub',0)+'>'+rodH(k,SAND.x+90,SAND.y+22,300,36)+hand(SAND.x+240,SAND.y+4,-90,1,1)+'</g>'+tag(480,SAND.y-24,'긁은 횟수 '+(UI.mq.cnt||0)+' / 5',20);
  return g}
 if(id==='water'){let inner=tankRods();
  if(f&&f.id==='stand')inner+='<g'+an('lb-a-down',0,'--from:-140px')+'>'+'<g transform="translate(480 300) rotate(-90)">'+rodH('wood',-70,0,140,26)+'</g></g>';
  return g+tankArt(TK.x,TK.top,TK.w,TK.bot,TK.wl,{inner})}
 if(id==='again'){const P=(on,inner,vb)=>on?inner:'';
  const pnl=(i,on,body,label)=>{const x=[30,490,260][i],y=i<2?50:300;return '<g transform="translate('+x+' '+y+') scale(.44)">'+(on?body:'<rect x="40" y="40" width="880" height="420" rx="30" fill="var(--w-label)" stroke="var(--w-felt-s)" stroke-dasharray="14 10" stroke-width="4"/>')+'</g>'+(NAR?'':'<text x="'+(x+211)+'" y="'+(y+230)+'" text-anchor="middle" font-size="21" font-weight="800" fill="var(--w-labeltx)">'+label+'</text>')};
  g+=pnl(0,sn('a1'),paperArt()+paperRods(RODK),'종이 위에 올리기')+pnl(1,sn('a2'),sandArt()+sandRods(RODK),'사포로 긁기')+pnl(2,sn('a3'),tankArt(TK.x,TK.top,TK.w,TK.bot,TK.wl,{inner:tankRods(RODK)}),'수조에 넣기');
  return g}
 return g}
/* 실험 2 */
const IP={sc:[170,392],bk:[338,392],wa:[502,412],ju:[634,412],air:[782,412]},MS=1.3;
function seeSpot(){const k=UI.mq.cur;if(!k)return null;const [x,y]=IP[k];const sy=k==='air'?y-96*MS:k==='wa'||k==='ju'?y-34*MS:y;return [x,sy,k==='air'?46:38,1.9,480,215]}
function matArt(k,mode){return '<g transform="translate('+IP[k][0]+' '+IP[k][1]+') scale('+MS+') translate('+(-IP[k][0])+' '+(-IP[k][1])+')">'+matArt0(k,mode)+'</g>'}
function matArt0(k,mode){const [x,y]=IP[k],f=UI.fx;let g='';
 const held=mode==='h'&&sn('h'+k),stk=mode==='k'&&sn('k'+k),moving=fxOn((mode||'')+k);
 if(k==='sc'){if(held)return '<g'+(moving?an('lb-a-up',0,'--from:70px'):'')+'>'+scissors(x,y-80,1)+hand(x-30,y-70,0,.9)+'</g>';
  if(stk)return scissors(x,y,1)+'<g'+(moving?an('lb-a-down',0,'--from:-90px'):'')+'>'+scissors(x+4,y-14,1)+'</g>';return scissors(x,y,1)}
 if(k==='bk'){if(held)return '<g'+(moving?an('lb-a-up',0,'--from:70px'):'')+'>'+book(x,y-80,1)+hand(x-78,y-80,0,.85)+hand(x+78,y-80,180,.85)+'</g>';
  if(stk)return book(x,y,1)+'<g'+(moving?an('lb-a-down',0,'--from:-90px'):'')+'>'+book(x+3,y-40,1)+'</g>';return book(x,y,1)}
 if(k==='wa'||k==='ju'){const col=k==='wa'?WATER:JUICE;
  if(held){g+=puddle(x,TRAY.y+30,col,46)+glassCup(x,y,.5,col,1)+palm(x-6,y-150,.95);if(moving)g+=drops(x,y-120,col);return g}
  if(stk){g+=puddle(x,TRAY.y+30,col,62)+glassCup(x,y,.35,col,1);if(moving)g+='<path d="M'+(x-36)+' '+(y-100)+' q-20 30 -10 80" stroke="'+col+'" stroke-width="10" fill="none" stroke-linecap="round"'+an('lb-a-stream',0,'stroke-dasharray:24 12')+'/>';return g}
  return glassCup(x,y,.75,col,1)}
 if(k==='air'){if(held||stk){g+=balloon(x,y,.55)+palm(x+70,y-70,.8);if(moving)g+=puff(x+10,y-50,1);return g}return balloon(x,y,1)}
 return g}
function e2Scene(s){const r=R(),id=s.id,f=UI.fx;let g=bg({})+trayArt();
 if(id==='tray'){const on=has('tray');if(!on)return g+qmark(480,200);
  MATK.forEach((k,i)=>{g+='<g'+(fxOn('tray')?an('lb-a-down',.15*i,'--from:-160px'):'')+'>'+matArt(k)+'</g>'});return g}
 const mode=id==='hold'?'h':id==='stack'?'k':'';
 MATK.forEach(k=>{g+=matArt(k,mode);if(id==='see'&&UI.mq.cur===k){const [x,y]=IP[k];g+='<circle cx="'+x+'" cy="'+(k==='air'?y-96*MS:k==='sc'||k==='bk'?y:y-40*MS)+'" r="'+(k==='air'?96:78)+'" fill="none" stroke="var(--lb-lens)" stroke-width="3.5" stroke-dasharray="10 7"/>'}});
 if(!NAR&&(id==='see'||s.k==='pred'))MATK.forEach(k=>{g+='<text x="'+IP[k][0]+'" y="'+(TRAY.y+TRAY.h+34)+'" text-anchor="middle" font-size="18" font-weight="800" fill="var(--w-labeltx)">'+MAT[k].n+'</text>'});
 if(s.k==='pred')g+=qmark(480,110);
 return g}
/* 실험 3 */
function markSpot(p){const st=R().st,c=st[p];if(c<2)return null;const b=JB,h=levelOf(0,LVOL);return [JARS[0].cx,b-h,30,2.3,330,130]}
function jarsBase(){return JARS.map((_,j)=>jarArt(j)+jarName(j)).join('')}
function liqScene(p,col){const r=R(),c=r.st[p],f=UI.fx,fid=f&&f.id.indexOf(p)===0?+f.id.slice(2):-1;
 const shown=fid>=0?fid+1:c;   /* 지금 보여 줄 차례 */
 let g=jarsBase();const where=[-1,0,0,1,2,0][shown];
 if(shown===0)g+=glassCup(330,JB,.8,col,1)+qmark(330,250);
 if(where>=0)g+=liquidIn(where,LVOL,col,fid===shown-1&&fid!==1);
 if(shown>=2)g+=markLine(0,LVOL);
 if(fid===1)g+='<g'+an('lb-a-slide',0,'--dx:120px')+'>'+pen(JARS[0].cx+60,JB-levelOf(0,LVOL)-6,-15)+'</g>';
 if(fid>=2){const a=[null,null,[0,1],[1,2],[2,0]][fid];if(a){const x1=JARS[a[0]].cx,x2=JARS[a[1]].cx;g+=arrow(x1+(x2>x1?50:-50),120,x2+(x2>x1?-50:50),120)}}
 return g}
function e3Scene(s){const r=R(),st=r.st,id=s.id,f=UI.fx;let g=bg({});
 if(id==='free'){const q=n=>sn('q'+n);
  g+=rodH('wood',120,396,260,30)+(fxOn('q1')?'<g'+an('lb-a-down',0,'--from:-60px')+'>'+rodH('plastic',150,364,260,30)+'</g>':q(1)?rodH('plastic',150,364,260,30):rodH('plastic',140,316,260,30));
  if(fxOn('q2'))g+=hand(420,330,200,.9)+wiggle(330,330);
  g+=glassCup(650,JB,.75,WATER,1,{wave:fxOn('q3')})+glassCup(790,JB,.75,JUICE,1,{wave:fxOn('q4')});
  if(fxOn('q3'))g+=hand(650,330,-90,.9);if(fxOn('q4'))g+=hand(790,330,-90,.9);
  if(!NAR)g+='<text x="250" y="456" text-anchor="middle" font-size="18" font-weight="800" fill="var(--w-labeltx)">나무 · 플라스틱 막대</text><text x="650" y="456" text-anchor="middle" font-size="18" font-weight="800" fill="var(--w-labeltx)">물</text><text x="790" y="456" text-anchor="middle" font-size="18" font-weight="800" fill="var(--w-labeltx)">주스</text>';
  return g}
 if(id==='solid'){g+=jarsBase();const c=st.rod;
  if(c){const k=c[0]==='w'?'wood':'plastic',j=+c[1],x=JARS[j].cx,b=JB-(JARS[j].bot||0),rd=rodV(k,x,b-2,150,26);g+=f&&f.id==='r'+c?'<g'+an('lb-a-down',0,'--from:-160px')+'>'+rd+'</g>':rd}
  else g+=qmark(480,150);return g}
 if(id==='water')return g+liqScene('lw',WATER);
 if(id==='juice')return g+liqScene('lj',JUICE);
 g+=jarsBase()+rodV('wood',JARS[0].cx,JB-2,150,26)+liquidIn(1,LVOL,WATER)+qmark(JARS[2].cx,150);return g}
/* 실험 4 */
function tankSpot(){return [EF.tx+EF.tw-12,EF.wl,24,2.4,800,130]}
function cupSpot(){const s=curStep().id,ok=s==='in1'?(R().seen.in1||fxOn('in1')):(R().seen.in2||fxOn('in2'));if(!ok||UI.fx)return null;return [EF.cx,CUPIN.top+24,34,2,320,130]}
function tank4(wl,o){o=o||{};return tankArt(EF.tx,EF.tt,EF.tw,EF.tb,wl,o)+(o.nomark?'':tankMark())}
function cupIn(kind,anim){const wl=EF.wl-CUPIN.rise[kind];
 const cup=cupInv(CUPIN.top,{sub:1,water:CUPIN.inner[kind],wipe:1,wet:kind==='op',grow:anim&&kind==='op',tape:kind==='cl',hands:1});
 return tank4(anim?EF.wl:wl)+(anim?'<g'+an('lb-a-down',0,'--from:-216px')+'>'+cupInv(CUPIN.top,{sub:1,wipe:1,tape:kind==='cl',hands:1,water:kind==='op'?CUPIN.inner.op:CUPIN.inner.cl,wet:false})+'</g>'+(kind==='op'?bubbles():''):cup)}
function e4Scene(s){const r=R(),id=s.id,f=UI.fx;let g=bg({});
 if(id==='mark'){const on=has('mark');g+=tank4(EF.wl,{nomark:!r.done.mark});
  if(fxOn('mark'))g+='<g'+an('lb-a-slide',0,'--dx:160px')+'>'+pen(EF.tx+EF.tw-6,EF.wl-8,-20)+'</g>';else if(!on)g+=pen(800,410,-20)+qmark(780,200);return g}
 if(id==='wipe'){const on=has('wipe'),fxw=fxOn('wipe');g+=tank4(EF.wl);
  g+='<g transform="translate(-8 0)">'+cupInv(80,{wipe:on,tape:on,tapeIn:fxw,grow:fxw})+'</g>';
  if(!on)g+=itemArtAt('wipe',800,380)+itemArtAt('tape',800,300)+qmark(EF.cx,40);return g}
 if(id==='in1'||id==='in2'){const kind=id==='in1'?'cl':'op',done=r.seen[id],an1=fxOn(id);
  if(f&&f.id==='tilt')return g+tank4(EF.wl)+'<g transform="rotate(-22 '+EF.cx+' 180)">'+cupInv(70,{wipe:1,tape:1,hands:1})+'</g>'+arrow(EF.cx+120,90,EF.cx+120,200,'var(--lb-bad)',8);
  if(f&&f.id==='finger')return g+tank4(EF.wl)+cupInv(70,{wipe:1,hands:1})+hand(EF.cx+18,52,-90,.8,1);
  if(!done&&!an1)return g+tank4(EF.wl)+cupInv(70,{wipe:1,tape:kind==='cl',hands:1})+arrow(EF.cx+130,80,EF.cx+130,200);
  return g+cupIn(kind,an1)}
 if(id==='peel'){const on=has('peel');if(!on)return g+cupIn('cl',false);
  return g+tank4(EF.wl)+'<g'+(fxOn('peel')?an('lb-a-up',0,'--from:216px'):'')+'>'+cupInv(70,{wipe:1,hands:1})+'</g>'+(fxOn('peel')?'<g'+an('lb-a-out',.6)+'><rect x="'+(EF.cx+40)+'" y="40" width="44" height="9" rx="2" fill="#F2D27A"/></g>':'')}
 if(id==='side'){if(!sn('side'))return g+tank4(EF.wl)+qmark(EF.cx,180);
  const half=(kind,dx)=>'<g transform="translate('+dx+' 150) scale(.62)">'+cupIn(kind,false)+'</g>';
  g+=half('cl',-12)+half('op',372);if(!NAR)g+=tag(298,170,'구멍을 막은 컵',19)+tag(682,170,'구멍을 막지 않은 컵',19);else{LEG.push([null,'왼쪽: 구멍을 막은 컵']);LEG.push([null,'오른쪽: 구멍을 막지 않은 컵'])}
  return g}
 g+=tank4(EF.wl)+cupInv(70,{wipe:1,tape:s.k==='plan',hands:1});if(s.k==='pred')g+=qmark(EF.cx+170,140);return g}
function itemArtAt(k,x,y){return '<g transform="translate('+x+' '+y+') scale(1.4)">'+itemArt(k)+'</g>'}
function sceneSVG(){const v=V(),r=R(),s=curStep(),id=s.id,no=v.no;
 const T=(g,l,vb)=>svg(g+lensOf(s,g),l||s.t,vb);
 if(id==='tools'){if(!(r.done.tools||fxOn('tools')))return T(bg({})+boxArt(480),'준비물 상자');return T(bg({})+toolsScene(v.tools,fxOn('tools')),'준비물: '+v.tools.map(x=>x[1]).join(', '))}
 if(no===1)return T(e1Scene(s),s.t,id==='paper'?'120 96 720 350':id==='again'?'20 50 920 500':'40 40 900 470');
 if(no===2)return T(e2Scene(s),s.t,'50 120 860 380');
 if(no===3)return T(e3Scene(s),s.t,id==='free'?'90 240 780 240':'50 40 880 460');
 if(no===4)return T(e4Scene(s),s.t,'120 20 760 480');
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
 if(v.predHint)h+='<p class="lb-hint">'+esc(v.predHint)+'</p>';
 v.pred.forEach((q,j)=>{h+=(v.pred.length>1?'<p class="lb-q">'+esc(q.q)+'</p>':'')+'<div class="lb-opts" role="group" aria-label="'+esc(q.q)+'">';
  q.o.forEach((t,i)=>{const on=r.pred[j]===i;h+='<button type="button" class="lb-opt'+(v.pred.length>1?' lb-optsm':'')+'" data-f="o'+j+i+'" data-pred="'+j+':'+i+'" aria-pressed="'+on+'"'+(lock?' disabled':'')+'><i>'+(on?ic('check'):'')+'</i><span>'+esc(t)+'</span></button>'});h+='</div>'});
 h+='<div><label class="lb-label" for="lbWhy">그렇게 생각한 까닭 (쓰고 싶으면)</label><input id="lbWhy" class="lb-input" maxlength="60" placeholder="왜냐하면 ~ 때문이에요." value="'+esc(r.why)+'"'+(lock?' readonly':'')+'></div>';
 if(lock)h+='<div class="lb-msg lb-plain">'+ic('lock')+'<span>관찰을 시작해서 예상을 바꿀 수 없어요.</span></div>';
 else if(r.pred.length)h+='<div class="lb-msg lb-plain" aria-live="polite">'+ic('info')+'<span>예상은 맞히기가 아니라 내 생각이에요.</span></div>';
 return cardHead('내 예상','고른 예상은 결과 한 장에 남아요')+wrapB(h)}

/* ───────── 기록 줄(③) ───────── */
function rowSum(row){const r=R(),R0=ROWS[row],x=r.rec[row]||{};
 if(R0.t==='sel')return R0.f.map((f,i)=>(R0.f.length>1?f.l+' ':'')+f.o[x.f[i]]).join(' · ');
 if(R0.t==='note')return R0.f.map((f,i)=>f.l+': '+((x.t&&x.t[i])||'(쓰지 않았어요)')).join(' · ');
 return ''}
function rowReady(row){const r=R(),R0=ROWS[row],x=r.rec[row]||{};if(x.ok)return true;
 return R0.need.every(k=>r.seen[k])}
function numOpen(){return false}
function rowUI(row){const r=R(),R0=ROWS[row],x=r.rec[row]||{},done=!!x.ok,wr=UI.wrong[row]||[];
 if(done){let h='<div class="lb-mrow lb-mdone"><div class="lb-mrh"><b>'+esc(R0.n)+'</b><span class="lb-okt">'+ic('check')+'기록했어요</span></div><p class="lb-recsum">'+esc(rowSum(row))+'</p>';
  if(UI.fb[row])h+='<div class="lb-msg lb-good" role="status">'+ic('check')+'<span>'+UI.fb[row][1]+'</span></div>';
  return h+'</div>'}
 let h='<div class="lb-mrow"><div class="lb-mrh"><b>'+esc(R0.n)+'</b></div>';
 const D=UI.draft[row]=UI.draft[row]||{};const ok=rowReady(row);
 const recB=on=>'<button type="button" class="lb-rec-btn" data-act="rowrec" data-row="'+row+'" data-f="rr'+row+'"'+(on?'':' disabled')+'>'+ic('check')+'기록하기</button>';
 if(R0.t==='sel'){D.f=D.f||[];
  R0.f.forEach((f,j)=>{const long=f.o.some(t=>t.length>6)||f.o.length>3;
   h+='<div class="lb-cells lb-c1"><span class="lb-cl">'+esc(f.l)+'</span><span class="lb-seg lb-kseg'+(long?' lb-kwrap':'')+(wr.indexOf(j)>=0?' lb-wrongc':'')+'" role="group" aria-label="'+esc(R0.n+' '+f.l)+'">'+f.o.map((o,i)=>'<button type="button" class="lb-s" data-f="'+row+j+'-'+i+'" data-dr="'+row+':'+j+':'+i+'" aria-pressed="'+(D.f[j]===i)+'"'+(ok?'':' disabled')+'>'+esc(o)+'</button>').join('')+'</span></div>'});
  h+=recB(ok&&R0.f.every((f,j)=>D.f[j]!=null))}
 if(R0.t==='note'){D.t=D.t||[];
  h+='<p class="lb-hint2">쓰고 싶은 것을 짧게 써요. 쓰지 않아도 돼요.</p>'+R0.f.map((f,j)=>'<label class="lb-nrow"><span>'+esc(f.l)+'</span><input class="lb-input lb-ninp" maxlength="30" autocomplete="off" data-f="nt'+row+j+'" data-nt="'+row+':'+j+'" placeholder="'+esc(R0.ph)+'" value="'+esc(D.t[j]||'')+'"'+(ok?'':' disabled')+'></label>').join('');
  h+=recB(ok)}
 if(UI.fb[row])h+='<div class="lb-msg '+(UI.fb[row][0]?'lb-good':'lb-try')+'" role="status">'+ic(UI.fb[row][0]?'check':'info')+'<span>'+UI.fb[row][1]+'</span></div>';
 return h+'</div>'}
/* ───────── 할 일 카드: ① 해 보기 → ② 살펴보기 → ③ 기록하기 ───────── */
function acted(s){const r=R();return !!(r.act&&r.act[s.id])||(s.k==='scene'&&!!r.done[s.id])}
function looked(s){if(s.k==='scene')return !!R().done[s.id];if(s.k==='meas')return s.rows.every(rowReady);if(s.k==='more')return !!UI.mq.both||R().more.a!=null;return true}
function lbl(a){const x=actsOf(curStep()).find(b=>b.id===a);return x?x.label:''}
function hintOf(s){const r=R(),id=s.id,D=isDone(r.step);
 if(s.k==='scene'){if(UI.fx)return s.look;if(r.done[id])return '잘했어요. 이어서 가요.';return s.opts?s.ask:'① '+jo(s.act,'을','를')+' 눌러요.'}
 if(D)return '다 했어요. 이어서 가요.';
 if(UI.fx)return s.look;
 const need=s.rows.find(k=>!rowDone(k)),R0=ROWS[need];
 if(rowReady(need))return R0.t==='note'?'③ 살펴본 것을 쓰고 기록해요.':'③ '+R0.n+': 알맞은 것을 골라 기록해요.';
 const miss=R0.need.find(k=>!r.seen[k]),A=actsOf(s),a=A.find(b=>b.id===miss);
 if(a&&a.cell)return '① '+a.grp+': '+jo(a.label,'을','를')+' 눌러요.';
 return '① '+jo(lbl(miss)||'단추','을','를')+' 눌러요.'}
function gPart(n,t,st,body){return '<li class="lb-gp lb-'+st+'"'+(st==='wait'?' inert aria-disabled="true"':'')+'><div class="lb-gh"><i>'+(st==='ok'?ic('check'):n)+'</i><b>'+t+'</b></div>'+(body?'<div class="lb-gb">'+body+'</div>':'')+'</li>'}
function actBtns(s){const A=actsOf(s),cells=A.filter(a=>a.cell),rest=A.filter(a=>!a.cell);let h='';
 if(rest.length)h+='<div class="lb-acts">'+rest.map(a=>'<button type="button" class="lb-act'+(a.sub?' lb-act2':'')+(UI.attn&&!a.dis&&!a.sub?' lb-attn':'')+'" data-act="x" data-x="'+a.id+'" data-f="x'+a.id+'"'+(a.pressed!=null?' aria-pressed="'+!!a.pressed+'"':'')+(a.dis?' disabled':'')+'>'+ic(a.icon||'hand')+'<span>'+esc(a.label)+'</span></button>').join('')+'</div>';
 const grps=[];cells.forEach(a=>{let g=grps.find(x=>x.n===a.grp);if(!g)grps.push(g={n:a.grp,c:[]});g.c.push(a)});
 grps.forEach(G=>{const n=G.c.length,cols=n>4?3:n;h+='<div class="lb-cellrow" role="group" aria-label="'+esc(G.n)+'"><span class="lb-cl">'+esc(G.n)+'</span><div style="grid-template-columns:repeat('+cols+',1fr)">'+G.c.map(a=>'<button type="button" class="lb-cellb'+(UI.attn&&!a.dis?' lb-attn':'')+(a.seen?' lb-seen':'')+'" data-act="x" data-x="'+a.id+'" data-f="x'+a.id+'" aria-pressed="'+!!a.pressed+'"'+(a.dis?' disabled':'')+' aria-label="'+esc(G.n+' '+a.label)+(a.seen?' (해 봤어요)':'')+'">'+(a.seen?ic('check'):'')+'<span>'+esc(a.label)+'</span></button>').join('')+'</div></div>'});
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
 let h='<article class="lb-sheet" id="lbSheet" aria-label="실험 결과 한 장"><div class="lb-sh-in"><header class="lb-sh-h"><div><h2>실험 결과 한 장 · '+esc(v.title)+'</h2><span>탐구 실험관 · 3학년 2학기 과학 · 1. 물체와 물질 · '+ds+'</span></div><div class="lb-sh-name">이름 <u>'+(esc(DB.name)||'&nbsp;')+'</u></div></header><div class="lb-sh-grid"><div class="lb-sh-col">';
 h+='<section class="lb-sh-sec"><h3><i></i>실험 문제</h3><p><b>'+esc(v.q)+'</b></p>'+planSummary(v,r)+'</section>';
 h+='<section class="lb-sh-sec lb-sh-po"><h3><i></i>실험한 차례</h3><div class="lb-sh-steps">'+done.map((s,i)=>'<div><b>'+(i+1)+'.</b> '+esc(s.t)+'</div>').join('')+'</div></section>';
 h+='<section class="lb-sh-sec"><h3><i></i>내 예상</h3><p>'+v.pred.map((q,j)=>(v.pred.length>1?esc(q.q)+' ':'')+(r.pred[j]!=null?esc(q.o[r.pred[j]]):'(고르지 않았어요)')).join('<br>')+(r.why?'<br>까닭: '+esc(r.why):'')+'</p></section>';
 h+='</div><div class="lb-sh-col"><section class="lb-sh-sec"><h3><i></i>관찰 기록</h3>'+sheetTable(v,r)+barChart(v,r)+'</section>';
 h+='<section class="lb-sh-sec"><h3><i></i>내 결론</h3><div class="lb-sh-box"><p class="lb-sh-concl">'+frameHTML(v,r.bl,'sheet')+'</p>'+(r.cmp?'<p class="lb-sh-book">교과서 결론: '+esc(v.book)+'</p>':'')+'</div></section>';
 h+='</div></div>'+picsHTML(snapList(v,r))+'<section class="lb-sh-sec lb-sh-po lb-sh-fill"><h3><i></i>새로 알게 된 것 · 더 알고 싶은 것</h3><div class="lb-sh-lines">'+'<div class="lb-ln"></div>'.repeat(9)+'</div></section>';
 h+='<footer class="lb-sh-f"><span>아주 단순하게 만든 모형의 결과예요. 실제 교실에서는 결과가 조금 다를 수 있어요.</span><span>만든 사람: 초등교사 홍지희</span></footer></div></article>';
 return h}
const LABNAME='matter';
function snapsOf(v,r){const L=[],no=v.no,S=(g,vb,cap)=>L.push([svg(g,cap,vb),cap]);const ok=k=>rowDone(k);
 if(no===1){S(paperArt()+paperRods(RODK.filter(k=>ok('tr'))),'130 100 700 330','종이 위에 올리기');
  S(sandArt()+sandRods(RODK.filter(k=>ok('sc'))),'120 80 720 360','사포로 5번 긁기');
  S(tankArt(TK.x,TK.top,TK.w,TK.bot,TK.wl,{inner:tankRods(RODK.filter(k=>ok('fl')))}),'150 96 660 350','수조에 넣기')}
 if(no===2){const keep=UI.fx;UI.fx=null;const fake=(mode,on)=>{const sv=R().seen,bk=Object.assign({},sv);if(on)MATK.forEach(k=>sv[mode+k]=1);const g=trayArt()+MATK.map(k=>matArt(k,mode)).join('');R().seen=bk;return g};
  S(bg({})+trayArt()+MATK.map(k=>matArt(k,'')).join(''),'50 170 860 300','눈에 보이나요?');S(bg({})+fake('h',ok('hold')),'50 120 860 350','손으로 잡아 보기');S(bg({})+fake('k',ok('stack')),'50 170 860 300','쌓아 보기');UI.fx=keep}
 if(no===3){const rodsIn=JARS.map((_,j)=>rodV('wood',JARS[j].cx,JB-(JARS[j].bot||0)-2,150,26)).join('');
  S(bg({})+jarsBase()+(ok('solW')?rodsIn:''),'80 180 800 300','나무 막대를 세 용기에');
  S(bg({})+jarsBase()+(ok('liqW')?liquidIn(1,LVOL,WATER)+liquidIn(2,LVOL,WATER):''),'80 180 800 300','물을 ㉯·㉰에 옮긴 모습');
  S(bg({})+jarsBase()+(ok('liqW')?liquidIn(0,LVOL,WATER)+markLine(0,LVOL):''),'90 180 220 300','다시 ㉮에 · 처음 표시')}
 if(no===4){S(bg({})+(ok('cl')?cupIn('cl',false):tank4(EF.wl)),'200 60 560 400','구멍을 막은 컵');S(bg({})+(ok('op')?cupIn('op',false):tank4(EF.wl)),'200 60 560 400','구멍을 막지 않은 컵')}
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
 if(!DB.cur||!EXPS[DB.cur]){H.classList.remove('lb-inrun');$('#lbSub').textContent='3학년 2학기 과학 · 1단원 물체와 물질';$('#lbChoose').hidden=true;$('#lbClearMi').hidden=true;
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
 h+='</div><div class="lb-rail-note"><p>아주 단순하게 만든 모형이에요. 실제로는 결과가 조금 다를 수 있어요.</p><p>만든 사람: 초등교사 홍지희</p></div></div>';
 return h}
/* 이 단계의 행동 단추 */
function actsOf(s){const r=R(),A=[],busy=!!UI.fx,st=r.st||{},v=V();
 const per=(pre,grp,keys,names)=>keys.forEach((k,i)=>A.push({id:pre+k,label:names[i],cell:1,grp,pressed:UI.mq.cur===k&&!busy,seen:!!r.seen[pre+k],dis:busy}));
 const rn=RODK.map(k=>ROD[k].n),mn=MATK.map(k=>MAT[k].n);
 switch(s.id){
  case 'free':if(v.no===1)per('f','살펴볼 막대',RODK,rn);
   else A.push({id:'q1',label:'막대 쌓아 보기',dis:busy},{id:'q2',label:'막대 두드려 보기',dis:busy},{id:'q3',label:'물 흔들어 보기',dis:busy},{id:'q4',label:'주스 흔들어 보기',dis:busy});break;
  case 'paper':per('t','종이 위에 올릴 막대',RODK,rn);break;
  case 'sand':per('s','사포로 긁을 막대',RODK,rn);A.push({id:'hard',label:'한 막대만 세게 긁기',sub:1,dis:busy});break;
  case 'water':if(v.no===1){per('w','수조에 넣을 막대',RODK,rn);A.push({id:'stand',label:'막대를 세워 빠르게 넣기',sub:1,dis:busy})}
   else liqActs(A,'lw','물',busy);break;
  case 'juice':liqActs(A,'lj','주스',busy);break;
  case 'again':A.push({id:'a1',label:'종이 위에 다시 올리기',dis:busy},{id:'a2',label:'사포로 다시 긁기',dis:busy},{id:'a3',label:'수조에 다시 넣기',dis:busy});break;
  case 'see':per('v','살펴볼 것',MATK,mn);break;
  case 'hold':per('h','잡아 볼 것',MATK,mn);break;
  case 'stack':per('k','쌓아 볼 것',MATK,mn);break;
  case 'solid':['w','p'].forEach(m=>[0,1,2].forEach(j=>A.push({id:'r'+m+j,label:JARS[j].nm,cell:1,grp:(m==='w'?'나무':'플라스틱')+' 막대를 넣을 용기',pressed:st.rod===m+j&&!busy,seen:!!r.seen['r'+m+j],dis:busy})));break;
  case 'in1':A.push({id:'in1',label:'곧게 세운 채 천천히 넣기',dis:busy||!!r.seen.in1},{id:'tilt',label:'기울여서 넣기',sub:1,dis:busy||!!r.seen.in1});break;
  case 'in2':A.push({id:'in2',label:'곧게 세운 채 천천히 넣기',dis:busy||!!r.seen.in2},{id:'finger',label:'구멍을 손가락으로 막고 넣기',sub:1,dis:busy||!!r.seen.in2});break;
  case 'side':A.push({id:'side',label:'두 컵 나란히 보기',dis:busy||!!r.seen.side});break}
 return A}
function liqActs(A,p,nm,busy){const c=R().st[p]||0,L=['용기 ㉮에 '+jo(nm,'을','를')+' 붓기','눈높이를 맞춰 높이 표시하기','용기 ㉯로 옮기기','용기 ㉰로 옮기기','다시 용기 ㉮로 옮기기'];
 L.forEach((t,i)=>A.push({id:p+i,label:(i+1)+'. '+t,dis:busy||i!==c,pressed:i<c}))}
/* 아래 막대: 이전 · 진행 · 이어서 */
function footHTML(v,r,s){const N=v.steps.length;
 let h='<button type="button" class="lb-btn" data-act="prev" data-f="prev"'+(r.step===0?' disabled':'')+'>'+ic('left')+'이전</button>';
 h+='<div class="lb-fmid"><span class="lb-pgn">'+(r.step+1)+' / '+N+'</span><span class="lb-prog" aria-hidden="true">'+v.steps.map((x,i)=>'<i class="'+(i<r.step?'lb-d':i===r.step?'lb-n':'')+'"></i>').join('')+'</span></div>';
 let pri='이어서',priOn=canNext(),priAct='next';if(s.k==='sheet'){pri='실험 고르기로';priOn=true;priAct='home'}
 return h+'<button type="button" class="lb-btn lb-pri'+(priOn&&priAct==='next'?' lb-go':'')+'" data-act="'+priAct+'" data-f="pri"'+(priOn?'':' disabled')+'>'+esc(pri)+ic('right')+'</button>'}

/* ───────── 오늘의 실험: 탐구 문제 · 이렇게 해요 · 이것을 살펴봐요 (결과는 보여 주지 않음) ───────── */
function introPic(no,k){const n0=NAR,l0=LEG;NAR=true;LEG=[];let g=bg({}),vb='0 0 960 540';
 if(no===1){if(k==='look'){RODK.forEach((r,i)=>{g+=rodH(r,FR.x,FR.y0+i*FR.dy,FR.L,34)});vb='140 110 360 330'}
  if(k==='paper'){g+=paperArt()+'<g transform="translate(0 -70)">'+rodH('wood',PAPER.x+40,PAPER.rows[0],PAPER.w-80,48)+'</g>'+hand(PAPER.x+20,PAPER.rows[0]-70,0,1.1);vb='110 30 740 260'}
  if(k==='sand'){g+=sandArt()+rodH('wood',SAND.x+90,SAND.y+22,300,36)+hand(SAND.x+240,SAND.y+4,-90,1,1)+arrow(SAND.x+60,SAND.y-50,SAND.x+380,SAND.y-50);vb='220 260 520 180'}
  if(k==='water'){g+=tankArt(TK.x,TK.top,TK.w,TK.bot,TK.wl,{})+rodH('iron',TK.x+250,90,124,26)+arrow(TK.x+312,120,TK.x+312,170);vb='150 50 660 400'}}
 if(no===2){g+=trayArt();if(k==='tray'){MATK.forEach(m=>g+=matArt(m,''));vb='60 200 860 240'}
  if(k==='see'){MATK.forEach(m=>g+=matArt(m,''));g+='<circle cx="782" cy="287" r="100" fill="none" stroke="var(--lb-lens)" stroke-width="5" stroke-dasharray="12 8"/>';vb='600 160 330 290'}
  if(k==='hold'){g+=scissors(IP.sc[0],IP.sc[1]-60,1.2)+hand(IP.sc[0]-34,IP.sc[1]-50,0,1);vb='60 250 260 190'}
  if(k==='stack'){g+=book(IP.bk[0],IP.bk[1],1.1)+'<g transform="translate(0 -90)">'+book(IP.bk[0],IP.bk[1],1.1)+'</g>'+arrow(IP.bk[0]+90,IP.bk[1]-110,IP.bk[0]+90,IP.bk[1]-40);vb='250 250 220 190'}}
 if(no===3){if(k==='free'){g+=rodH('wood',120,396,260,30)+rodH('plastic',140,336,260,30)+glassCup(650,JB,.75,WATER,1)+glassCup(790,JB,.75,JUICE,1);vb='100 280 760 170'}
  if(k==='solid'){g+=jarsBase()+'<g transform="translate(0 -170)">'+rodV('wood',JARS[1].cx,JB-28,150,26)+'</g>'+arrow(JARS[1].cx+60,90,JARS[1].cx+60,200);vb='60 60 840 420'}
  if(k==='mark'){g+=jarArt(0)+liquidIn(0,LVOL,WATER)+markLine(0,LVOL)+pen(JARS[0].cx+60,JB-levelOf(0,LVOL)-6,-15);vb='100 180 260 260'}
  if(k==='back'){g+=jarsBase()+arrow(JARS[0].cx+60,150,JARS[1].cx-60,150)+arrow(JARS[1].cx+60,150,JARS[2].cx-60,150)+'<path d="M'+JARS[2].cx+' 110 Q480 30 '+JARS[0].cx+' 110" fill="none" stroke="var(--lb-sci)" stroke-width="6" stroke-dasharray="14 10"/>';vb='60 30 840 450'}}
 if(no===4){if(k==='mark'){g+=tank4(EF.wl)+pen(EF.tx+EF.tw-6,EF.wl-8,-20);vb='200 100 600 360'}
  if(k==='wipe'){g+=cupInv(80,{wipe:1,tape:1});vb='370 50 220 200'}
  if(k==='in'){g+=tank4(EF.wl,{nomark:1})+cupInv(70,{wipe:1,tape:1,hands:1})+arrow(EF.cx+130,80,EF.cx+130,200);vb='200 30 600 430'}
  if(k==='again'){g+=tank4(EF.wl,{nomark:1})+cupInv(70,{wipe:1,hands:1})+arrow(EF.cx+130,80,EF.cx+130,200);vb='200 30 600 430'}}
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
 if(no===1){RODK.forEach((k,i)=>{g+=rodH(k,FR.x,FR.y0+i*FR.dy,FR.L,34)});g+=sandArt();vb='140 110 600 330'}
 if(no===2){g+=trayArt()+MATK.map(k=>matArt(k,'')).join('');vb='80 220 840 230'}
 if(no===3){g+=jarsBase()+rodV('wood',JARS[0].cx,JB-2,150,26)+liquidIn(1,LVOL,WATER)+liquidIn(2,LVOL,JUICE);vb='70 150 820 340'}
 if(no===4){g+=tank4(EF.wl)+cupInv(70,{wipe:1,tape:1,hands:1});vb='190 20 580 440'}
 const s=svg(g,'실험 '+no+' 처음 모습',vb);NAR=false;LEG=[];return s}
function homeHTML(){const card=k=>{const v=EXPS[k],r=DB.runs[k];const st=r?(r.fin?'끝냄 · 결과 보기':(r.step+1)+'단계부터 이어서'):'실험 시작하기';
 return '<section class="lb-exc" aria-labelledby="lbE'+v.no+'"><div class="lb-exc-art">'+homeArt(v.no)+'</div><div class="lb-exc-b"><h2 id="lbE'+v.no+'"><em>실험 '+v.no+'</em>'+esc(v.name)+'</h2><p class="lb-exp">'+esc(v.sub)+'</p><button type="button" class="lb-pickb" data-pick="'+k+'" data-f="k'+k+'"><i>'+ic(['','rod','tray','jar','bubble'][v.no])+'</i><span><b>'+st+'</b><span>교과서 실험</span></span>'+(r&&r.fin?'<small>'+ic('check')+'</small>':'')+'</button></div></section>'};
 return '<div class="lb-home"><div class="lb-home-h"><div class="lb-kick"><em>3학년 2학기 과학</em>1. 물체와 물질</div><h1>무엇을 실험할까요?</h1><p>실험을 한 단계씩 직접 해 보고, 내 눈으로 본 것을 기록해요.</p></div>'+
 '<div class="lb-ex lb-ex4">'+['e1','e2','e3','e4'].map(card).join('')+'</div>'+
 '<p class="lb-model">'+ic('info')+'<span>아주 단순하게 만든 모형이에요. 같은 조건이면 언제나 같은 결과가 나와요. 결과는 교과서·지도서 예시와 같고, 실제로는 막대나 사포의 종류에 따라 조금 다를 수 있어요. 용기 모양, 수조 물 높이가 바뀌는 정도, 물휴지가 커지는 정도는 이 실험관에서 정한 모습이에요.</span></p></div>'}
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
/* 판 위 물체를 옮긴 뒤 기울기 */
/* 실험 단계의 행동 */
function doX(id){const v=V(),r=R(),s=curStep(),st=r.st;if(UI.fx)return;
 const SUB={hard:'같은 힘으로 긁어야 긁히는 정도를 견줄 수 있어요. 모든 막대를 같은 힘으로 5번 긁어요.',stand:'막대를 세워 빠르게 넣으면 물이 튀어요. 모든 막대를 수평으로 천천히 넣어요.',
  tilt:'컵을 기울이면 결과가 달라질 수 있어요. 곧게 세운 채로 천천히 넣어요.',finger:'구멍을 막지 않은 컵은 손으로 막지 않아요. 컵의 옆을 잡고 넣어요.'};
 if(SUB[id]){fx(id,1100,()=>flash(SUB[id]));return}
 r.act[s.id]=1;if(idxOf('pred')>=0&&r.step>idxOf('pred'))r.obs=1;
 const done=()=>{r.seen[id]=1};
 if(/^f/.test(id)&&ROD[id.slice(1)]){UI.mq.cur=id.slice(1);fx(id,1100,done);return}
 if(/^t/.test(id)&&ROD[id.slice(1)]){UI.mq.cur=id.slice(1);fx(id,1000,done);return}
 if(/^s/.test(id)&&ROD[id.slice(1)]&&id!=='side'){UI.mq.cur=id.slice(1);UI.mq.cnt=0;for(let i=1;i<=5;i++)later(()=>{UI.mq.cnt=i;renderScene()},i*480);fx(id,2600,done);return}
 if(/^w/.test(id)&&ROD[id.slice(1)]){UI.mq.cur=id.slice(1);fx(id,1500,done);return}
 if(/^a[123]$/.test(id)){fx(id,900,done);return}
 if(/^[vhk]/.test(id)&&MAT[id.slice(1)]){UI.mq.cur=id.slice(1);fx(id,id[0]==='v'?900:1500,done);return}
 if(/^q[1-4]$/.test(id)){fx(id,1300,done);return}
 if(/^r[wp][012]$/.test(id)){st.rod=id.slice(1);fx(id,1100,done);return}
 if(/^l[wj][0-4]$/.test(id)){const p=id.slice(0,2),i=+id[2];if(st[p]!==i)return;fx(id,i===1?1100:1500,()=>{st[p]=i+1;r.seen[id]=1});return}
 if(id==='in1'||id==='in2'){fx(id,2000,done);return}
 if(id==='side'){fx(id,700,done);return}}
/* 숫자 적기: 화면 숫자와 같은지만 알려 줌. 같은 값으로 다시 누르면 세지 않음 */
function tryKey(k,val){const r=R();if(r.last[k]===val)return -1;r.last[k]=val;r.tries[k]=(r.tries[k]||0)+1;return r.tries[k]}
function trial(){}
function rowRec(row){const r=R(),R0=ROWS[row],D=UI.draft[row]||{};let ok,wrong=[],key;
 if(R0.t==='note'){if(!rowReady(row))return;r.rec[row]={ok:1,t:R0.f.map((f,j)=>String((D.t||[])[j]||'').trim())};UI.fb={};UI.fb[row]=[1,'살펴본 것을 기록했어요.'];save();render();const p=$('#lbFoot [data-act="next"]:not(:disabled)');if(p&&isDone(R().step))p.focus({preventScroll:true});return}
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
 if(t.dataset&&t.dataset.nt){const [row,j]=t.dataset.nt.split(':');const D=UI.draft[row]=UI.draft[row]||{};D.t=D.t||[];D.t[+j]=t.value}
 if(t.dataset&&t.dataset.in!=null){const dec=V()&&V().no===3;UI.inp[t.dataset.in]=t.value.replace(dec?/[^\d.]/g:/[^\d]/g,'');if(t.value!==UI.inp[t.dataset.in])t.value=UI.inp[t.dataset.in]}
 if(t.id==='lbName'){DB.name=t.value;save();const u=$('#lbSheet .lb-sh-name u');if(u)u.textContent=DB.name||' '}});
let rzT=0,wasN=narrow();addEventListener('resize',()=>{clearTimeout(rzT);rzT=setTimeout(()=>{const n=narrow();if(n!==wasN){wasN=n;const s=$('#lbScene');if(s)s._h=null}if(DB.cur)render();else fitAll()},150)});
if(DB.cur&&EXPS[DB.cur]){if(!DB.runs[DB.cur])DB.runs[DB.cur]=newRun();enterStep()}
render();

addEventListener('beforeprint',()=>{const s=$('#lbSheet .lb-sh-in');if(s)s.style.zoom=''});addEventListener('afterprint',()=>{try{fitAll()}catch(e){}});
