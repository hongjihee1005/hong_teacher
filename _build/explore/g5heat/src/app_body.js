/* 이 실험관에서 더 쓰는 아이콘 */
Object.assign(I,{cupT:'<path d="M5 5h14l-1.6 14a2 2 0 01-2 1.8H8.6a2 2 0 01-2-1.8z"/><path d="M6 10h12"/>',plate:'<rect x="3" y="10" width="18" height="5" rx="1"/><path d="M7 10v5M11 10v5M15 10v5"/>',tank:'<rect x="3.5" y="5" width="17" height="14" rx="1.5"/><path d="M3.5 9h17"/><circle cx="12" cy="15" r="1.6"/>',candle:'<rect x="9" y="11" width="6" height="10" rx="1"/><path d="M12 11V9"/><path d="M12 3c2 2 2 4 0 5-2-1-2-3 0-5z"/>'});

/* ───────── 기록(이 기기에만) ───────── */
const KEY='hj-g5heat-v1';
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
 if(s.k==='concl')UI.focus=Math.max(0,r.bl.findIndex(x=>!x))}
/* 예상은 예상 단계 뒤의 관찰을 시작하면 잠김 */
function predLocked(){const r=R();return !!r.obs}
function planChanged(r){if(!r.planLast)return true;return JSON.stringify(r.plan)!==JSON.stringify(r.planLast)}

/* ───────── 장면 ───────── */
function fxOn(id){return UI.fx&&UI.fx.id===id}
function has(id){const r=R(),k=idxOf(id);if(k<0)return false;return k<r.step||(k===r.step&&(!!r.done[id]||fxOn(id)))}
const sn=id=>!!R().seen[id]||fxOn(id);   /* 해 본 행동(또는 지금 하는 중) */
const fid=()=>UI.fx?UI.fx.id:null;
/* 시퀀스 단계: 지금까지 한 행동 수(움직이는 중이면 그 행동까지) */
function seqK(key,ids){const c=R().st[key]||0,fi=ids.indexOf(fid());return Math.max(c,fi+1)}
const noSh=s=>s.replace(/<ellipse[^>]*\/>/,'');
/* 기록한 숫자만 그림에 다시 보여 줌(학생이 쓴 기록) */
const recV=row=>rowDone(row)?R().rec[row].v:null;

/* ───── 실험 1: 여러 가지 온도계 ───── */
/* 알코올 온도계: 방금 걸어 둔 온도계의 처음 액체 기둥 높이(이 실험관에서 정한 값 — 0 °C에서 올라가지 않게) */
const ALC0=16;
const C1=[360,600];   /* 물 · 주스 컵 */
const CUPC=[WC,'#F5A35A'];
function cups1(o){o=o||{};return C1.map((x,i)=>cupArt(x,BY,{col:CUPC[i],lv:.72})+(o.lab===false?'':mini(x,BY+40,i?'주스':'물',18))).join('')}
/* 탐침이 컵 i에 들어간 모습(i<0이면 위에 듦) */
function probeAt(i,o){o=o||{};if(i<0)return probeTherm(C1[0]-120,40,Object.assign({on:1,len:120},o));return probeTherm(C1[i],186,Object.assign({on:1,len:120},o))}
function e1Scene(s){const r=R(),id=s.id,f=fid(),st=r.st;let g=bg({});
 if(id==='pred')return g+cups1()+qmark(480,150);
 if(id==='touch'){g+=cups1();['tw','tj'].forEach((k,i)=>{if(sn(k))g+=feelArt(C1[i],BY-150,i===0)});
  const cur=f==='tw'?0:f==='tj'?1:st.tl!=null?st.tl:-1;if(cur>=0)g+='<g'+(f?an('lb-a-fade',0):'')+'>'+hand(C1[cur]-74,BY-60,0,1.1,0)+'</g>';
  if(sn('tw')||sn('tj'))g+=mini(480,110,'느낌을 나타낸 그림',18);
  return g}
 if(id==='pon'){const on=has('pon');g+=cups1({lab:false});g+=probeTherm(480,90,{on,cap:!on,len:90});if(on)g+='<g transform="translate(640 380) rotate(80)"><rect x="-11" y="-39" width="22" height="78" rx="8" fill="#D9473B" stroke="#8E2A22" stroke-width="2"/></g>';return g}
 if(id==='place'){g+=cups1();const dn=has('place');
  if(dn)g+='<g'+(fxOn('place')?an('lb-a-down',0,'--from:-140px'):'')+'>'+probeAt(0,{blink:1})+'</g>';else g+=probeTherm(C1[0],40,{on:1,len:120});
  return g}
 if(id==='probe'){const k=seqK('pb',['pw1','pj1']),fi=['pw1','pj1'].indexOf(f);g+=cups1();
  const at=k>=2||fi===1?1:0,busy=fi>=0;const val=busy?'':at?MODEL.t1.juice:MODEL.t1.water,showV=k>=1||busy;
  g+='<g'+(fi===1?an('lb-a-slide',0,'--dx:-240px'):'')+'>'+probeAt(at,{val:showV?val:'',blink:busy,hl:UI.mq.hl&&!busy})+'</g>';
  return g}
 if(id==='alc'){const k=seqK('al',['aw']),go=f==='aw',x=420,top=60;const v=k>=1||go?21.5:ALC0;
  g+=alcTherm(x,top,v,{anim:go,from:ALC0});if(!NAR)g+=mini(x,40,k>=1||go?'과학실 벽':'과학실 벽에 방금 건 온도계',17);
  const tp=top+AB-21.5*AK;if(st.eye!=null&&!go){const ey=[tp-70,tp,tp+70][st.eye];g+=eyeLine(600,ey,x+4,tp,st.eye===1)}
  return g}
 if(id==='ir'){const k=seqK('ir',['i1','i2']),fi=['i1','i2'].indexOf(f);g+=stairsArt(480,BY);if(!NAR)g+=mini(690,190,'복도 계단',18);
  const on=k>=1||fi===0,aim=k>=2||fi===1;g+=irGun(330,300,{on,val:aim&&fi!==1?MODEL.t1.stair:'',laser:aim?[640,BY-66]:null,hl:UI.mq.hl&&k>=2});
  return g}
 if(id==='soil'){g+=soilBed(160,800,340,96);if(!NAR)g+=mini(480,520,'화단 흙',18);
  const dn=sn('k0');if(dn)g+='<g'+(f==='k0'?an('lb-a-down',0,'--from:-120px'):'')+'>'+probeTherm(480,150,{on:1,len:150,val:f==='k0'?'':MODEL.t1.soil,blink:f==='k0',hl:UI.mq.hl&&f!=='k0'})+'</g>';
  else g+=probeTherm(250,100,{})+'<g transform="translate(700 80) scale(.5)">'+alcTherm(0,0,20)+'</g>'+irGun(880,300,{});
  return g}
 return g}
function probeSpot(){return null}
function alcSpot(){const k=seqK('al',['aw']);if(k<1||UI.fx)return null;const tp=60+AB-21.5*AK;return [414,Math.round(tp),36,2.4,760,210]}
function irSpot(){return null}
function soilSpot(){return null}

/* ───── 실험 2: 원통과 알루미늄 캔 ───── */
const CANX=760;
function e2Scene(s){const r=R(),id=s.id,f=fid(),st=r.st;
 if(id==='gear')return bg({})+gearArt(has('gear'),fxOn('gear'),0,'nog');
 let g=bg({});const H=MODEL.hot,C=MODEL.cold;
 if(id==='fill'){const on=has('fill'),a=f==='fill';return g+tubeArt({hot:on?H[0]:null,rise:a})+canArt(CANX,BY,{t:on?C[0]:null,rise:a})}
 if(id==='t0'||id==='pred'){const k=id==='pred'?1:seqK('tz',['t0a']),go=f==='t0a';g+=tubeArt({hot:H[0]})+canArt(CANX,BY,{t:C[0]});
  if(k>=1||go){g+='<g'+(go?an('lb-a-down',0,'--from:-120px'):'')+'>'+probeTherm(330,50,{on:1,len:210,val:go?'':H[0].toFixed(1),blink:go,tag:'원통에 든 물'})+probeTherm(CANX,40,{on:1,len:200,val:go?'':C[0].toFixed(1),blink:go,tag:'캔에 든 물'})+'</g>'}
  else g+=probeTherm(560,120,{on:1,len:80})+probeTherm(880,120,{on:1,len:80});
  return g+(id==='pred'?qmark(560,100):'')}
 if(id==='put'){const on=has('put'),a=f==='put';if(!on)return g+tubeArt({hot:H[0]})+canArt(CANX,BY,{t:C[0]});
  return g+tubeArt({hot:H[0],cold:C[0],can:1,lid:1,lidAnim:a})+'<g'+(a?an('lb-a-fade',.6):'')+'>'+e2Probes(H[0].toFixed(1),C[0].toFixed(1))+'</g>'+'<g transform="translate(800 330) scale(.6)">'+stopwatch(0,0,'00:00',0)+'</g>'}
 if(id==='time'||id==='more'){const ids=['m1','m2','m3','m4','m5'],k=id==='more'?5:seqK('tm',ids),fi=ids.indexOf(f),m=fi>=0?fi:Math.min(5,k),busy=fi>=0;
  if(id==='more'&&(f==='ot'||UI.mq.both||r.more.a!=null))return g+otherTable(f==='ot');
  g+=tubeArt({hot:H[m],cold:C[m],can:1,lid:1})+e2Probes(busy?'':H[m].toFixed(1),busy?'':C[m].toFixed(1),{hl:UI.mq.hl&&!busy});
  g+='<g transform="translate(800 330) scale(.6)">'+stopwatch(0,0,(busy?'0'+(m)+':30':'0'+m+':00'),1)+'</g>';
  if(m>=1&&!busy)g+=mini(800,240,m+'분 뒤',22);
  return g}
 return g}
function e2Spot(){return null}
/* 다른 모둠의 결과(지도서 추가 예시) */
function otherTable(anim){const L=['처음','1분 뒤','2분 뒤','3분 뒤','4분 뒤','5분 뒤'],x0=60,cw=124,y0=150,rh=64;let g='<g'+(anim?an('lb-a-fade',0):'')+'><rect x="'+(x0-10)+'" y="'+(y0-60)+'" width="'+(cw*7+20+0)+'" height="'+(rh*3+80)+'" rx="14" fill="var(--w-label)" stroke="var(--w-felt-s)" stroke-width="2"/>';
 g+='<text x="'+(x0+cw*3.5)+'" y="'+(y0-22)+'" text-anchor="middle" font-size="22" font-weight="800" fill="var(--w-labeltx)">다른 모둠의 결과(°C)</text>';
 const cell=(c,rw,t,b)=>'<rect x="'+(x0+c*cw)+'" y="'+(y0+rw*rh)+'" width="'+cw+'" height="'+rh+'" fill="'+(rw===0?'#E8EEF3':'#FFFFFF')+'" stroke="#9AA6B2" stroke-width="1.5"/><text x="'+(x0+c*cw+cw/2)+'" y="'+(y0+rw*rh+rh*.62)+'" text-anchor="middle" font-size="'+(c===0&&rw>0?17:20)+'" font-weight="800" fill="'+(b||'#24313D')+'">'+t+'</text>';
 g+=cell(0,0,'구분');L.forEach((t,i)=>g+=cell(i+1,0,t));
 g+=cell(0,1,'원통에 든 물');MODEL.oHot.forEach((v,i)=>g+=cell(i+1,1,v.toFixed(1),'#B0362A'));
 g+=cell(0,2,'캔에 든 물');MODEL.oCold.forEach((v,i)=>g+=cell(i+1,2,v.toFixed(1),'#1C5F96'));
 return g+'</g>'}

/* ───── 실험 3: 구리판 ───── */
const LF=[-1,6,16,28],UF=[-1,.3,.65,.97].map(x=>x<0?-1:Math.round(x*UD.max));
const TLAB=['','1분쯤','3분쯤','5분쯤'];
function e3Scene(s){const r=R(),id=s.id,f=fid(),st=r.st;
 if(id==='gear')return bg({})+gearArt(has('gear'),fxOn('gear'));
 let g=bg({});
 if(id==='stick'){const on=has('stick'),a=f==='stick';g+=longPlate({sticker:false});if(on)g+='<g'+(a?an('lb-a-fade',0,'animation-duration:1.2s'):'')+'>'+plateArt(LP.x,LP.y,LP.cs,LROWS,LD,{sticker:1})+'</g>';
  else g+='<g transform="translate(480 380)">'+itemArt('tsticker')+'</g>';return g}
 if(id==='clamp'){const on=has('clamp');if(!on)return g+longPlate({sticker:1})+candleArt(860,BY,{h:94})+lighterArt(720,BY-10,0);
  return g+'<g'+(f==='clamp'?an('lb-a-fade',0):'')+'>'+longPlate({sticker:1,stand:1,candle:1})+'</g>'+lighterArt(860,BY-10,0)}
 if(id==='pred')return g+longPlate({sticker:1,stand:1,candle:1})+qmark(560,140);
 if(id==='heat'){const ids=['h0','h1','h2','h3'],k=seqK('ht',ids),fi=ids.indexOf(f),now=fi>=0?fi:k-1;
  const fr=now>=0?LF[Math.max(0,now)]:-1,f0=fi>0?LF[fi-1]:fr;
  g+=longPlate({sticker:1,stand:1,candle:1,lit:k>=1||fi===0,f:fr,f0});if(fi===0)g+='<g'+an('lb-a-fade',0)+'>'+lighterArt(LP.x+30*LP.cs+80,BY-120,-30)+'</g>';else g+=lighterArt(860,BY-10,0);
  if(now>=1)g+=mini(480,110,TLAB[now],22);
  return g}
 if(id==='uheat'){g=bgTop();const ids=['u0','u1','u2','u3'],k=seqK('uh',ids),fi=ids.indexOf(f),now=fi>=0?fi:k-1;
  const fr=now>=0?UF[Math.max(0,now)]:-1,f0=fi>0?UF[fi-1]:fr;
  g+=uPlate({sticker:1,lit:k>=1||fi===0,f:fr,f0});if(!NAR)g+=mini(UP.x+160,UP.y-30,'위에서 본 모습',17);
  if(now>=1)g+=mini(480,410,TLAB[now],22);
  return g}
 return g}

/* ───── 실험 4: 사각 통과 잉크 ───── */
const TCX=TK.x+TK.w/2;
function e4Scene(s){const r=R(),id=s.id,f=fid(),st=r.st;
 if(id==='gear')return bg({})+gearArt(has('gear'),fxOn('gear'));
 let g=bg({});
 if(id==='stand'){const on=has('stand');if(!on)return g+'<rect x="'+(TK.x-30)+'" y="'+(BY-4)+'" width="'+(TK.w+60)+'" height="8" rx="2" fill="#E6EEF2" stroke="#9FB4C4" stroke-width="1.5"/>'+'<g transform="translate(860 '+BY+') scale(.8)">'+itemArt('cups3').replace(/translate\([^)]*\) scale\([^)]*\)/,'translate(0 0) scale(1)')+'</g>';
  return g+'<g'+(f==='stand'?an('lb-a-down',0,'--from:-90px'):'')+'>'+tankStand({film:1,cups:1})+'</g>'}
 g+=tankStand({film:1,cups:1});
 if(id==='water'){const on=has('water'),a=f==='water';return g+(on?tankArt({water:1,rise:a}):'<g transform="translate(0 -40)">'+tankArt({})+'</g>')}
 if(id==='ink'){const on=has('ink'),a=f==='ink';return g+tankArt({water:1,inner:on&&!a?inkArt(0):''})+(a?'<g'+an('lb-a-down',0,'--from:-80px')+'>'+dropperArt(TCX,TK.y+TK.h-8,{ink:1})+'</g>':on?'':dropperArt(820,BY-30,{ink:1}))}
 if(id==='pred')return g+tankArt({water:1,inner:inkArt(0)})+hotCup(860,BY)+qmark(TCX,120);
 if(id==='push'){const ids=['p1','p2','p3','p4'],k=seqK('pu',ids),fi=ids.indexOf(f);const kk=[0,0,1,2,4];const now=fi>=0?fi+1:k;
  const ik=kk[now],prev=fi>=0?kk[fi]:ik,cupIn=k>=1||fi===0;
  g+=tankArt({water:1,inner:inkArt(ik,fi>=1&&ik!==prev)});
  g+='<g'+(fi===0?an('lb-a-slide',0,'--dx:380px'):'')+'>'+hotCup(cupIn?TCX:860,BY)+'</g>';
  return g}
 if(id==='more'){const go=f==='tw',dn=go||!!UI.mq.both||r.more.a!=null;g+=tankArt({water:1,inner:twoInk(dn,go)});
  g+=hotCup(TK.x+90,BY)+hotCup(TK.x+TK.w-90,BY,{cold:1});return g}
 return g}
/* 더 알아보기: 왼쪽 뜨거운 물(빨간색 잉크) · 오른쪽 차가운 물(보라색 잉크) */
function twoInk(dn,anim){const b=TK.y+TK.h-6,wy=TK.y+TK.h*.25+12,lx=TK.x+90,rx=TK.x+TK.w-90;
 let g='<ellipse cx="'+lx+'" cy="'+(b-3)+'" rx="14" ry="6" fill="#D63C32" opacity=".9"/><ellipse cx="'+rx+'" cy="'+(b-3)+'" rx="14" ry="6" fill="'+INK+'" opacity=".9"/>';
 if(dn){const A=anim?an('lb-a-fade',0,'animation-duration:1.8s'):'';
  g+='<path d="M'+lx+' '+b+' C'+(lx-4)+' '+(b-60)+' '+(lx+4)+' '+(wy+40)+' '+lx+' '+wy+' C'+(lx+60)+' '+(wy-4)+' '+(lx+140)+' '+wy+' '+(lx+200)+' '+(wy+8)+'" stroke="#D63C32" stroke-width="13" fill="none" stroke-linecap="round" opacity=".5"'+A+'/>';
  g+='<path d="M'+rx+' '+(b-4)+' C'+(rx-80)+' '+(b-2)+' '+(lx+150)+' '+(b-4)+' '+(lx+40)+' '+(b-8)+'" stroke="'+INK+'" stroke-width="11" fill="none" stroke-linecap="round" opacity=".5"'+A+'/>'}
 return g}

/* ───── 실험 5: 아크릴 통 ───── */
function e5Scene(s){const r=R(),id=s.id,f=fid(),st=r.st;
 if(id==='gear')return bg({})+gearArt(has('gear'),fxOn('gear'));
 let g=bg({});
 if(id==='stick'){const on=has('stick');g+=acrylArt({sticker:on});if(f==='stick')g='<g>'+g+'</g>';if(!on)g+='<g transform="translate(760 360)">'+itemArt('tsticker')+'</g>';return g}
 if(id==='place'){const on=has('place'),a=f==='place';if(!on)return g+'<g transform="translate(-200 -30)">'+acrylArt({sticker:1})+'</g>'+candleArt(AC.x+AC.w/2+180,BY,{h:70})+lighterArt(860,BY-10,0);
  return g+'<g'+(a?an('lb-a-down',0,'--from:-60px'):'')+'>'+acrylArt({sticker:1,candle:1})+'</g>'+lighterArt(860,BY-10,0)}
 if(id==='pred')return g+acrylArt({sticker:1,candle:1})+qmark(800,150);
 if(id==='light'){const ids=['l1','l2','l3'],k=seqK('lt',ids),fi=ids.indexOf(f),kk=fi>=0?fi:k-1;
  g+=acrylArt({sticker:1,candle:1,lit:k>=1||fi===0,litAnim:fi===0,k:Math.max(0,kk),anim:fi>=1});
  if(fi===0)g+='<g'+an('lb-a-fade',0)+'>'+lighterArt(AC.x+AC.w+60,BY-40,-20)+'</g>';else g+=lighterArt(860,BY-10,0);
  if(kk>=1&&fi<0)g+=mini(780,160,kk===1?'잠시 뒤':'더 오래 뒤',20);
  return g}
 return g}

/* ───── 실험 6: 검은색 판 ───── */
const PX=[200,300],PSUN=780;
function e6Scene(s){const r=R(),id=s.id,f=fid(),st=r.st;
 if(id==='gear')return bgOut()+gearArt(has('gear'),fxOn('gear'),0,'sun');
 if(id==='places')return placesArt(s);
 if(id==='more')return lampScene();
 let g=yardBg();
 const badge=(row)=>{const v=recV(row);return v?{val:v}:{}};
 if(id==='m0'){const ids=['ga','gb'],k=seqK('m0',ids),fi=ids.indexOf(f);
  g+=plateBlack(PX[0],250,'판 ㄱ',badge('a0'))+plateBlack(PX[1],250,'판 ㄴ',badge('b0'));
  const t=fi>=0?fi:k>=2?1:k>=1?0:-1;
  if(t>=0){const tx=PX[t];g+=irGun(tx+170,380,{on:1,flip:1,val:fi>=0?'':MODEL.shade,laser:[tx,286],hl:UI.mq.hl&&fi<0})}else g+=irGun(640,380,{flip:1});
  return g}
 if(id==='move'){const on=has('move'),a=f==='move';g+=plateBlack(PX[0],250,'판 ㄱ');
  g+=on?'<g'+(a?an('lb-a-slide',0,'--dx:-430px'):'')+'>'+plateBlack(PSUN,250,'판 ㄴ')+'</g>':plateBlack(PX[1],250,'판 ㄴ');return g}
 if(id==='pred')return g+plateBlack(PX[0],250,'판 ㄱ')+plateBlack(PSUN,250,'판 ㄴ')+qmark(560,120);
 if(id==='m1'){const ids=['w1','sb','sa'],k=seqK('m1',ids),fi=ids.indexOf(f);
  g+=plateBlack(PX[0],250,'판 ㄱ',badge('a1'))+plateBlack(PSUN,250,'판 ㄴ',badge('b1'));
  g+='<g transform="translate(560 180) scale(.5)">'+stopwatch(0,0,fi===0?'00:30':k>=1?'01:00':'00:00',1)+'</g>';
  const t=fi===1||(fi<0&&k===2)?1:fi===2||(fi<0&&k>=3)?0:-1;
  if(t===1)g+=irGun(PSUN-170,380,{on:1,val:fi===1?'':MODEL.sun1,laser:[PSUN,286],hl:UI.mq.hl&&fi<0});
  else if(t===0)g+=irGun(PX[0]+170,380,{on:1,flip:1,val:fi===2?'':MODEL.shade1,laser:[PX[0],286],hl:UI.mq.hl&&fi<0});
  return g}
 return g}
function e6Spot(){return null}
/* 여러 장소: 왼쪽 반은 그늘 */
function placesArt(s){const f=fid();let g=bgOut()+sunArt(900,40,26);
 MODEL.places.forEach((p,i)=>{const x0=30+i*310,w=280;
  if(i===0)g+='<rect x="'+x0+'" y="200" width="'+w+'" height="200" fill="#E8C98F" stroke="#C7A86C" stroke-width="2"/>';
  if(i===1)for(let k=0;k<4;k++)g+='<rect x="'+(x0+k*60)+'" y="'+(200+k*50)+'" width="'+(w-k*60)+'" height="50" fill="'+(k%2?'#C9B48F':'#D8C39E')+'" stroke="#A58C62" stroke-width="2"/>';
  if(i===2){g+='<rect x="'+x0+'" y="150" width="'+w+'" height="250" fill="#D9CBB8" stroke="#9A8A76" stroke-width="2"/>';for(let k=1;k<6;k++)g+='<path d="M'+x0+' '+(150+k*42)+' H'+(x0+w)+'" stroke="#BFAE98" stroke-width="2"/>'}
  g+='<rect x="'+x0+'" y="'+(i===2?150:200)+'" width="'+(w/2)+'" height="'+(i===2?250:200)+'" fill="#000" opacity=".2"/>';
  g+=mini(x0+w/2,i===2?120:170,p[0],19);
  [[0,x0+w*.75,'햇빛'],[1,x0+w*.25,'그늘']].forEach(([k,cx,lab])=>{const id='q'+i+k,on=sn(id),go=f===id;
   g+='<circle cx="'+cx+'" cy="310" r="30" fill="'+(on?'#FFE58A':'#FFFFFF')+'" fill-opacity=".75" stroke="#24313D" stroke-width="2.5" stroke-dasharray="6 4"/><text x="'+cx+'" y="317" text-anchor="middle" font-size="18" font-weight="800" fill="#24313D">'+lab+'</text>';
   if(go)g+='<g'+an('lb-a-fade',0)+'><path d="M'+(cx-60)+' 460 L'+cx+' 312" stroke="#E2241B" stroke-width="3"/><circle cx="'+cx+'" cy="312" r="6" fill="#E2241B"/></g>';
   if(on&&!go)g+='<g'+an('lb-a-pop',0)+'>'+mini(cx,372,p[k+1]+' °C',19)+'</g>'})});
 if(!NAR)g+=mini(480,500,'적외선 온도계로 잰 숫자(지도서 예시 값)',17);
 return g}
function lampScene(){const r=R(),f=fid(),go=f==='lp',dn=go||!!UI.mq.both||r.more.a!=null;let g=bg({});
 g+=lampArt(330,150,dn);g+=plateBlack(300,300,'빛이 비치는 판',{val:dn&&!go?MODEL.lamp[1]:MODEL.lamp[0]})+plateBlack(700,300,'빛이 비치지 않는 판',{val:MODEL.lamp[0]});
 if(dn)g+=mini(500,90,go?'켜는 중':'켜고 1분 뒤',20);else g+=mini(500,90,'처음',20);
 return g}

function sceneSVG(){const v=V(),r=R(),s=curStep(),id=s.id,no=v.no;
 const T=(g,l,vb)=>svg(g+lensOf(s,g),l||s.t,vb);
 if(id==='tools'){if(!(r.done.tools||fxOn('tools')))return T(bg({})+boxArt(480),'준비물 상자');return T(bg({})+toolsScene(v.tools,fxOn('tools')),'준비물: '+v.tools.map(x=>x[1]).join(', '),v.tools.length>8?'0 10 960 600':null)}
 const F={1:e1Scene,2:e2Scene,3:e3Scene,4:e4Scene,5:e5Scene,6:e6Scene}[no];
 const VB={1:'150 20 700 520',2:'150 0 800 520',3:'90 60 820 440',4:'160 70 760 420',5:'200 50 700 440',6:'0 0 960 540'}[no];
 let vb=VB;if(id==='gear')vb='160 40 640 420';
 if(no===1&&id==='alc')vb='240 20 660 440';if(no===1&&(id==='ir'||id==='soil'))vb='120 30 800 500';
 if(no===3&&id==='uheat')vb='180 80 700 360';if(no===6&&id==='places')vb='0 80 960 440';if(no===6&&id==='more')vb='120 20 760 480';
 return T(F(s),s.t,vb)}


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
 v.pred.forEach((q,j)=>{h+=(v.pred.length>1?'<p class="lb-q">'+esc(q.q)+'</p>':'')+'<div class="lb-opts'+(q.o.length>3&&q.o.every(t=>t.length<=7)?' lb-opts2':'')+'" role="group" aria-label="'+esc(q.q)+'">';
  q.o.forEach((t,i)=>{const on=r.pred[j]===i;h+='<button type="button" class="lb-opt'+(v.pred.length>1?' lb-optsm':'')+'" data-f="o'+j+i+'" data-pred="'+j+':'+i+'" aria-pressed="'+on+'"'+(lock?' disabled':'')+'><i>'+(on?ic('check'):'')+'</i><span>'+esc(t)+'</span></button>'});h+='</div>'});
 h+='<div><label class="lb-label" for="lbWhy">그렇게 생각한 까닭 (쓰고 싶으면)</label><input id="lbWhy" class="lb-input" maxlength="60" placeholder="왜냐하면 ~ 때문이에요." value="'+esc(r.why)+'"'+(lock?' readonly':'')+'></div>';
 if(lock)h+='<div class="lb-msg lb-plain">'+ic('lock')+'<span>관찰을 시작해서 예상을 바꿀 수 없어요.</span></div>';
 else if(r.pred.length)h+='<div class="lb-msg lb-plain" aria-live="polite">'+ic('info')+'<span>예상은 맞히기가 아니라 내 생각이에요.</span></div>';
 return cardHead('내 예상','고른 예상은 결과 한 장에 남아요')+wrapB(h)}

/* ───────── 기록 줄(③) ───────── */
function rowSum(row){const r=R(),R0=ROWS[row],x=r.rec[row]||{};
 if(R0.t==='sel'){const F=fOf(row);return F.map((f,i)=>(f.l?f.l+' ':'')+f.o[x.f[i]]).join(' · ')}
 if(R0.t==='num')return x.v+' '+R0.u;
 if(R0.t==='note'){const w=R0.f.map((f,i)=>(x.t&&x.t[i])?x.t[i]:'').filter(Boolean);return w.length?w.join(' · '):'(쓰지 않았어요)'}
 return ''}
function rowReady(row){const r=R(),R0=ROWS[row],x=r.rec[row]||{};if(x.ok)return true;
 if(R0.t==='num')return r.pend[row]!=null;
 return R0.need.every(k=>r.seen[k])}
function numOpen(row){return R().pend[row]!=null&&!UI.fx}
function rowUI(row){const r=R(),R0=ROWS[row],x=r.rec[row]||{},done=!!x.ok,wr=UI.wrong[row]||[];
 if(done&&curStep().rows&&curStep().rows.length>1)return '<div class="lb-mrow lb-mdone lb-mone" title="'+esc(rowSum(row))+'"><div class="lb-mrh"><b>'+esc(R0.n)+'</b><span class="lb-okt">'+ic('check')+'기록했어요</span></div></div>';
 if(done){let h='<div class="lb-mrow lb-mdone"><div class="lb-mrh"><b>'+esc(R0.n)+'</b><span class="lb-okt">'+ic('check')+'기록했어요</span></div><p class="lb-recsum">'+esc(rowSum(row))+'</p>';
  if(UI.fb[row])h+='<div class="lb-msg lb-good" role="status">'+ic('check')+'<span>'+UI.fb[row][1]+'</span></div>';
  return h+'</div>'}
 let h='<div class="lb-mrow"><div class="lb-mrh"><b>'+esc(R0.n)+'</b></div>';
 const D=UI.draft[row]=UI.draft[row]||{};const ok=rowReady(row);
 const recB=on=>'<button type="button" class="lb-rec-btn" data-act="rowrec" data-row="'+row+'" data-f="rr'+row+'"'+(on?'':' disabled')+'>'+ic('check')+'기록하기</button>';
 if(R0.t==='sel'){D.f=D.f||[];const F=fOf(row);
  const c2=F.every(f=>f.l.length<=7)?' lb-c2':'';
  F.forEach((f,j)=>{const long=c2?f.o.length>3||f.o.some(t=>t.length>9)||f.o.join('').length>15:f.o.some(t=>t.length>6)||f.o.length>3;
   h+='<div class="lb-cells lb-c1'+c2+'"><span class="lb-cl">'+esc(f.l)+'</span><span class="lb-seg lb-kseg'+(long?' lb-kwrap':'')+(wr.indexOf(j)>=0?' lb-wrongc':'')+'" role="group" aria-label="'+esc(R0.n+' '+f.l)+'">'+f.o.map((o,i)=>'<button type="button" class="lb-s" data-f="'+row+j+'-'+i+'" data-dr="'+row+':'+j+':'+i+'" aria-pressed="'+(D.f[j]===i)+'"'+(ok?'':' disabled')+'>'+esc(o)+'</button>').join('')+'</span></div>'});
  h+=recB(ok&&F.every((f,j)=>D.f[j]!=null))}
 if(R0.t==='note'){D.t=D.t||[];
  h+='<p class="lb-hint2">쓰고 싶은 것을 짧게 써요. 쓰지 않아도 돼요.</p>'+R0.f.map((f,j)=>'<label class="lb-nrow"><span>'+esc(f.l)+'</span><input class="lb-input lb-ninp" maxlength="20" autocomplete="off" data-f="nt'+row+j+'" data-nt="'+row+':'+j+'" placeholder="'+esc(R0.ph)+'" value="'+esc(D.t[j]||'')+'"'+(ok?'':' disabled')+'></label>').join('');
  h+=recB(ok)}
 if(R0.t==='num'){const op=numOpen(row);
  h+='<div class="lb-trials"><label class="lb-trial'+(op?' lb-tcur':'')+'"><span>'+esc(R0.lab||'무게')+'</span><input class="lb-num lb-numw" inputmode="'+(R0.dec?'decimal':'numeric')+'" maxlength="6" autocomplete="off" data-f="in'+row+'" data-in="'+row+'" aria-label="'+esc(R0.n)+' 숫자" value="'+esc(UI.inp[row]||'')+'"'+(op?'':' disabled')+'><span>'+R0.u+'</span></label><button type="button" class="lb-mini" data-act="trial" data-row="'+row+'" data-f="tr'+row+'"'+(op?'':' disabled')+'>'+ic('check')+'적기</button></div>';
  if(R0.u==='숟가락째')h+='<p class="lb-hint2">처음으로 바닥에 남았을 때 넣은 숟가락 수를 써요.</p>'}
 if(UI.fb[row])h+='<div class="lb-msg '+(UI.fb[row][0]?'lb-good':'lb-try')+'" role="status">'+ic(UI.fb[row][0]?'check':'info')+'<span>'+UI.fb[row][1]+'</span></div>';
 return h+'</div>'}
/* ───────── 할 일 카드: ① 해 보기 → ② 살펴보기 → ③ 기록하기 ───────── */
function acted(s){const r=R();return !!(r.act&&r.act[s.id])||(s.k==='scene'&&!!r.done[s.id])}
function looked(s){if(s.k==='scene')return !!R().done[s.id];if(s.k==='meas')return s.rows.every(rowReady);if(s.k==='more')return !!UI.mq.both||R().more.a!=null;return true}
function lbl(a){const x=actsOf(curStep()).find(b=>b.id===a);return x?x.label:''}
function hintOf(s){const r=R(),id=s.id,D=isDone(r.step);
 if(s.k==='more'){if(r.more.a!=null)return '다 했어요. 이어서 가요.';if(UI.fx)return s.look;if(UI.mq.both)return '③ 알맞은 것을 골라요.';const a=actsOf(s)[0];return '① '+lj(a.label)+' 눌러요.'}
 if(s.k==='scene'){if(UI.fx)return s.look;if(r.done[id])return '잘했어요. 이어서 가요.';return s.opts?s.ask:'① '+jo(s.act,'을','를')+' 눌러요.'}
 if(D)return '다 했어요. 이어서 가요.';
 if(UI.fx)return s.look;
 const need=s.rows.find(k=>!rowDone(k)),R0=ROWS[need];
 if(rowReady(need)){if(R0.t==='num')return '③ '+(R0.src||'저울 화면의 숫자를')+' ‘'+R0.n+'’ 칸에 써요.';
  return R0.t==='note'?'③ 살펴본 것을 쓰고 기록해요.':'③ '+R0.n+(/\?$/.test(R0.n)?' ':': ')+'알맞은 것을 골라 기록해요.'}
 const A=actsOf(s);
 if(V().no===1&&s.id==='soil'&&!R().seen.k0)return '① 화단 흙 속의 온도를 잴 알맞은 온도계를 골라요.';
 if(V().no===1&&s.id==='alc'&&(R().st.al||0)>=1&&!R().seen.e1)return '① 눈금을 읽을 눈의 위치를 골라요.';
 const cur=A.find(b=>b.hide===false&&!b.pressed&&!b.dis);if(cur)return '① '+lj(cur.label.replace(/^\d\/\d · /,''))+' 눌러요.';
 const one=A.find(b=>!b.cell&&!b.sub&&b.hide==null&&!b.dis&&!r.seen[b.id]);if(one)return '① '+lj(one.label)+' 눌러요.';
 const cell=A.find(b=>b.cell&&!b.seen&&!b.dis);if(cell)return '① '+cell.grp+': '+lj(cell.label)+' 눌러요.';
 return '① 단추를 눌러요.'}
function lj(t){return /\?$/.test(t)?'‘'+t+'’'+jo(t.slice(0,-1),'을','를').slice(-1):jo(t,'을','를')}
function gPart(n,t,st,body){return '<li class="lb-gp lb-'+st+'"'+(st==='wait'?' inert aria-disabled="true"':'')+'><div class="lb-gh"><i>'+(st==='ok'?ic('check'):n)+'</i><b>'+t+'</b></div>'+(body?'<div class="lb-gb">'+body+'</div>':'')+'</li>'}
function actBtns(s,cellsOnly){const A=actsOf(s),cells=A.filter(a=>a.cell),rest=cellsOnly?[]:A.filter(a=>!a.cell&&!a.hide);let h='';
 const seq=cellsOnly?[]:A.filter(a=>a.hide!=null);if(seq.length)h+='<ol class="lb-seq" aria-label="차례">'+seq.map((a,i)=>'<li class="'+(a.pressed?'lb-d':!a.hide?'lb-n':'')+'">'+(a.pressed?ic('check'):'<b>'+(i+1)+'</b>')+'<span>'+esc(a.label.replace(/^\d\/\d · /,''))+'</span></li>').join('')+'</ol>';
 if(rest.length)h+='<div class="lb-acts">'+rest.map(a=>'<button type="button" class="lb-act'+(a.sub?' lb-act2':'')+(UI.attn&&!a.dis&&!a.sub?' lb-attn':'')+'" data-act="x" data-x="'+a.id+'" data-f="x'+a.id+'"'+(a.pressed!=null?' aria-pressed="'+!!a.pressed+'"':'')+(a.dis?' disabled':'')+'>'+ic(a.icon||'hand')+'<span>'+esc(a.label)+'</span></button>').join('')+'</div>';
 const grps=[];cells.forEach(a=>{let g=grps.find(x=>x.n===a.grp);if(!g)grps.push(g={n:a.grp,c:[]});g.c.push(a)});
 grps.forEach(G=>{if(G.c.every(a=>a.fin)){h+='<p class="lb-cfin">'+ic('check')+'<b>'+esc(G.n)+'</b> '+esc(G.c[0].fin)+'</p>';return}
  const n=G.c.length,mini=cellsOnly&&G.c.every(a=>a.seen&&a.label.length<=3),cols=mini?n:G.c.some(a=>a.label.length>6)?(n>2?2:n):n===8||n===4?4:n>4?3:n;
  /* 모두 본 뒤(기록하는 동안)에는 시간 칸을 한 줄로 작게 — 기록 칸이 카드 안에 들어가게 */
  h+='<div class="lb-cellrow'+(mini?' lb-cellmini':'')+'" role="group" aria-label="'+esc(G.n)+'"><span class="lb-cl">'+esc(G.n)+(mini?' · 다시 볼 때 눌러요':'')+'</span><div style="grid-template-columns:repeat('+cols+',minmax(0,1fr))">'+G.c.map(a=>'<button type="button" class="lb-cellb'+(a.label.length>6?' lb-cellw':'')+(UI.attn&&!a.dis?' lb-attn':'')+(a.seen?' lb-seen':'')+'" data-act="x" data-x="'+a.id+'" data-f="x'+a.id+'" aria-pressed="'+!!a.pressed+'"'+(a.dis?' disabled':'')+' aria-label="'+esc(G.n+' '+a.label)+(a.seen?' (해 봤어요)':'')+'">'+(a.seen&&!mini?ic('check'):'')+'<span>'+esc(a.label)+'</span></button>').join('')+'</div></div>'});
 return h}
const MOREQ={2:['시간이 충분히 지나면 두 물체의 온도는?',['두 물체의 온도가 같아져요','온도 차이가 점점 더 커져요','캔의 물이 원통의 물보다 더 뜨거워져요'],0,'두 물의 온도 차이가 점점 줄어들다가, 시간이 충분히 지나면 두 물체의 온도가 같아져요.'],
 4:['두 잉크의 움직임은?',['빨간색 잉크(뜨거운 쪽)는 위로, 보라색 잉크(차가운 쪽)는 바닥을 따라 뜨거운 쪽으로 움직여요','두 잉크 모두 똑같이 위로 올라가요'],0,'뜨거운 물 쪽의 잉크는 위로 올라가고, 차가운 물 쪽의 잉크는 바닥에서 뜨거운 물 쪽으로 천천히 움직여요. 온도가 높아진 물이 위로 올라가고 온도가 낮은 물이 아래로 밀려 내려오며 순환해요.'],
 6:['1분 뒤 열 전구의 빛이 비치는 곳에 놓은 판의 온도는?',['높아졌어요','그대로예요','낮아졌어요'],0,'열 전구의 빛이 비치는 곳에 놓은 판은 23.4 °C에서 41.9 °C로 높아졌고, 빛이 비치지 않는 곳의 판은 23.4 °C 그대로예요. 열 전구의 빛에 의해 열이 이동했어요.']};
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
  h+=gPart(1,'해 보기',both?'ok':'cur',ans!=null?'':actBtns(s))+gPart(2,'살펴보기',both?'ok':Object.keys(UI.mq).length?'cur':'wait','<p>'+esc(s.look)+'</p>')+gPart(3,'고르기',ans!=null?'ok':both?'cur':'wait',b3);
  return cardHead('더 알아보기','해도 되고 건너뛰어도 돼요')+wrapB(h+'</ol>')}
 const on3=s.rows.some(rowReady)||s.rows.some(k=>ROWS[k].t==='auto'&&acted(s));
 /* ①을 모두 해 보면 단추를 접음(본 결과는 그림에 그대로 남음) — 기록 칸이 넓어져 카드 글자가 줄지 않게 */
 const keep=actsOf(s).some(a=>a.cell)&&!isDone(r.step);h+=gPart(1,'해 보기',L&&!keep?'ok':'cur',L&&!UI.fx?(keep?actBtns(s,true):''):actBtns(s));
 h+=gPart(2,'살펴보기',!A?'wait':L?'ok':'cur',L&&s.rows.some(rowReady)?'':'<p>'+esc(s.look)+'</p>');
 /* ③은 차례가 오면 열림(아직이면 이름만 — 카드 글자가 줄지 않게) */
 const st3=D?'ok':on3?'cur':'wait';const nx=s.rows.find(k=>!rowDone(k)&&rowReady(k));h+=gPart(3,'기록하기',st3,st3==='wait'?'<p class="lb-hint2">해 보기와 살펴보기를 마치면 열려요.</p>':doneRows(s)+s.rows.filter(k=>!rowDone(k)&&k===nx).map(rowUI).join('')+(s.rows.some(k=>!rowDone(k)&&k!==nx)?'<p class="lb-hint2">'+(nx?'이 줄을 기록하면 다음 줄이 열려요.':'남은 것을 해 보면 기록 칸이 더 열려요.')+'</p>':''));
 return cardHead('할 일',stepName(s))+wrapB(h+'</ol>')}
/* 기록한 줄은 한 칸에 이름만 모아 보여 줌(검토 고침: 기록 줄이 넷인 단계에서 카드가 넘치던 것) */
function doneRows(s){const d=s.rows.filter(rowDone);if(!d.length)return '';if(d.length<2||s.rows.length<3)return d.map(rowUI).join('');
 return '<div class="lb-mrow lb-mdone lb-mone"><div class="lb-mrh"><b>'+d.map(k=>esc(ROWS[k].n)).join(' · ')+'</b><span class="lb-okt">'+ic('check')+'기록했어요</span></div></div>'}
function cWrong(v,r,i){return !!(r.clast&&r.bl[i]&&r.bl[i]===r.clast[i]&&r.bl[i]!==v.ans[i])}
function cChanged(r){return !r.clast||r.bl.some((w,i)=>w!==r.clast[i])}
function frameHTML(v,bl,mode){const r=R();let t=esc(v.frame);
 return t.replace(/\{(\d)\}/g,(m,i)=>{i=+i;const w=bl[i]||'';
  if(mode==='edit'){const st=w?' lb-fill':'';const f=UI.focus===i?' lb-focus':'';const wr=cWrong(v,r,i)?' lb-wrong':'';
   return '<button type="button" class="lb-blank'+st+f+wr+'" data-f="b'+i+'" data-blank="'+i+'" aria-label="빈칸 '+(i+1)+(w?': '+w:': 비어 있음')+(wr?', 다시 생각해 봐요':'')+'">'+(w?esc(w):'&#8203;')+'</button>'}
  return w?'<mark>'+esc(w)+'</mark>':'<span class="lb-sh-gap">______</span>'})}
/* 결론 쓰기: 왼쪽 그림 자리에 내 예상과 내 기록을 크게(카드에 몰아 넣으면 글자가 작아졌음) */
function recLines(k){const r=R(),R0=ROWS[k],x=r.rec[k]||{};if(!x.ok)return '—';
 if(R0.t==='sel')return fOf(k).map((f,i)=>'<span>'+(f.l?'<b>'+esc(f.l)+'</b> ':'')+esc(f.o[x.f[i]])+'</span>').join('');
 if(R0.t==='num')return '<span>'+esc(x.v+' '+R0.u)+'</span>';
 const w=R0.f.map((f,i)=>(x.t&&x.t[i])?'<span><b>'+esc(f.l)+'</b> '+esc(x.t[i])+'</span>':'').filter(Boolean);return w.length?w.join(''):'<span>(쓰지 않았어요)</span>'}
function recPanel(){const v=V(),r=R();let h='<div class="lb-recpanel" tabindex="0" aria-label="내 예상과 내 기록">';
 h+='<section><h2>'+ic('clip')+'내 기록</h2><table class="lb-rtbl"><tbody>'+v.rows.map(k=>'<tr><th scope="row">'+esc(ROWS[k].n)+'</th><td>'+recLines(k)+'</td></tr>').join('')+'</tbody></table></section>';
 if(r.pred.length)h+='<section class="lb-rpred"><h2>'+ic('why')+'내 예상</h2><ul>'+v.pred.map((q,j)=>'<li>'+esc(q.q)+' <b>'+(r.pred[j]!=null?esc(q.o[r.pred[j]]):'(고르지 않았어요)')+'</b></li>').join('')+'</ul></section>';
 return h+'</div>'}
function conclCard(){const v=V(),r=R();let h='<p class="lb-hint2">'+(narrow()?'위의':'왼쪽의')+' 내 기록을 보고 빈칸을 채워요.</p>';
 h+='<p class="lb-frame">'+frameHTML(v,r.bl,'edit')+'</p><div class="lb-chips" role="group" aria-label="낱말 카드">'+v.chips.map((c,i)=>'<button type="button" class="lb-chip" data-f="c'+i+'" data-chip="'+i+'">'+esc(c)+'</button>').join('')+'</div>';
 const all=r.bl.length&&r.bl.every(x=>x);
 if(!r.cmp)h+='<button type="button" class="lb-act" data-act="cmp" data-f="doit"'+(all&&cChanged(r)?'':' disabled')+'>'+ic('flask')+'<span>기록과 견주기</span></button>';
 if(r.cmp)h+='<div class="lb-cmp" role="status"><b>'+ic('flask')+'교과서 결론</b>'+esc(v.book)+'</div><div class="lb-msg lb-good">'+ic('check')+'<span>내 결론이 기록과 맞아요.</span></div>';
 else if(r.clast&&!cChanged(r)){const wr=r.bl.map((w,i)=>i).filter(i=>cWrong(v,r,i));h+='<div class="lb-msg lb-try" role="status">'+ic('info')+'<span>빨간 빈칸을 기록과 다시 견줘요.'+(r.ctry>=2&&wr.length?' '+wr.map(i=>esc(v.hint[i])).join(' '):'')+'</span></div>'}
 return cardHead('결론 쓰기','빈칸을 누르고 낱말 카드를 골라요')+wrapB(h)}

/* ───────── 결과 한 장 ───────── */
function barChart(v,r){return ''}
function sheetTable(v,r){let h='<table class="lb-tbl"><caption class="lb-sr">관찰 기록</caption><thead><tr><th scope="col">무엇을</th><th scope="col">내 기록</th></tr></thead><tbody>';
 v.rows.forEach(k=>{h+='<tr><th scope="row">'+esc(ROWS[k].n)+'</th><td>'+(rowDone(k)?esc(rowSum(k)):'—')+'</td></tr>'});
 return h+'</tbody></table>'}
function planSummary(v,r){const P=v.plan;if(!P)return '';if(!r.planOk)return '<p>(계획을 건너뛰었어요)</p>';
 return '<div class="lb-sh-tags">'+P.rows.map(x=>{const d=r.plan[x[0]]==='d';return '<span class="lb-sh-tag'+(d?' lb-d':'')+'">'+(d?'다르게: ':'같게: ')+esc(x[1])+'</span>'}).join('')+'</div>'}
function sheetHTML(){const v=V(),r=R();const done=v.steps.map(id=>stepDef(v,id)).filter(s=>(s.k==='scene'||s.k==='meas')&&s.id!=='tools');
 const today=new Date();const ds=today.getFullYear()+'. '+(today.getMonth()+1)+'. '+today.getDate()+'.';
 let h='<article class="lb-sheet lb-sh-e'+v.no+'" id="lbSheet" aria-label="실험 결과 한 장"><div class="lb-sh-in"><header class="lb-sh-h"><div><h2>실험 결과 한 장 · '+esc(v.title)+'</h2><span>탐구 실험관 · 5학년 2학기 과학 · 3. 열과 우리 생활 · '+ds+'</span></div><div class="lb-sh-name">이름 <u>'+(esc(DB.name)||'&nbsp;')+'</u></div></header><div class="lb-sh-grid"><div class="lb-sh-col">';
 h+='<section class="lb-sh-sec"><h3><i></i>실험 문제</h3><p><b>'+esc(v.q)+'</b></p>'+planSummary(v,r)+'</section>';
 h+='<section class="lb-sh-sec lb-sh-po"><h3><i></i>실험한 차례</h3><div class="lb-sh-steps">'+done.map((s,i)=>'<div><b>'+(i+1)+'.</b> '+esc(s.t)+'</div>').join('')+'</div></section>';
 h+='<section class="lb-sh-sec"><h3><i></i>내 예상</h3><p>'+v.pred.map((q,j)=>(v.pred.length>1?esc(q.q)+' ':'')+(r.pred[j]!=null?esc(q.o[r.pred[j]]):'(고르지 않았어요)')).join('<br>')+(r.why?'<br>까닭: '+esc(r.why):'')+'</p></section>';
 h+='</div><div class="lb-sh-col"><section class="lb-sh-sec"><h3><i></i>관찰 기록</h3>'+sheetTable(v,r)+barChart(v,r)+'</section>';
 /* 실험 1은 관찰 기록 줄이 일곱이라 결론을 아래 한 줄 전체로(오른쪽 칸만 길어져 2쪽이 되던 것, 독립 검토 고침) */
 const cs='<section class="lb-sh-sec'+(v.no===1?' lb-sh-wide':'')+'"><h3><i></i>내 결론</h3><div class="lb-sh-box"><p class="lb-sh-concl">'+frameHTML(v,r.bl,'sheet')+'</p>'+(r.cmp?'<p class="lb-sh-book">교과서 결론: '+esc(v.book)+'</p>':'')+'</div></section>';
 h+=(v.no===1?'':cs)+'</div></div>'+(v.no===1?cs:'')+picsHTML(snapList(v,r))+'<section class="lb-sh-sec lb-sh-po lb-sh-fill"><h3><i></i>새로 알게 된 것 · 더 알고 싶은 것</h3><div class="lb-sh-lines">'+'<div class="lb-ln"></div>'.repeat(9)+'</div></section>';
 h+='<footer class="lb-sh-f"><span>아주 단순하게 만든 모형의 결과예요. 실제 교실에서는 결과가 조금 다를 수 있어요.</span><span>만든 사람: 초등교사 홍지희</span></footer></div></article>';
 return h}
const LABNAME='heat';
function snapsOf(v,r){const L=[],no=v.no,S=(g,vb,cap)=>L.push([svg(g,cap,vb),cap]);const ok=k=>rowDone(k);
 if(no===1){if(ok('pj'))S(bg({})+cups1()+probeTherm(C1[0],186,{on:1,len:120,val:MODEL.t1.water})+probeTherm(C1[1],186,{on:1,len:120,val:MODEL.t1.juice}),'250 150 460 320','물과 주스의 온도')}
 if(no===2){if(ok('c0'))S(bg({})+tubeArt({hot:MODEL.hot[0]})+canArt(CANX,BY,{t:MODEL.cold[0]}),'230 160 640 300','처음');
  if(ok('c5'))S(bg({})+tubeArt({hot:MODEL.hot[5],cold:MODEL.cold[5],can:1,lid:1})+e2Probes(MODEL.hot[5].toFixed(1),MODEL.cold[5].toFixed(1)),'220 20 380 440','5분 뒤')}
 if(no===3){if(ok('lf2'))S(bg({})+longPlate({sticker:1,stand:1,candle:1,lit:1,f:LF[3]}),'110 200 720 250','긴 구리판 · 5분쯤');
  if(ok('uf2'))S(bgTop()+uPlate({sticker:1,lit:1,f:UF[3]}),'300 120 480 250','ㄷ자 구리판 · 5분쯤')}
 if(no===4){if(ok('i3'))S(bg({})+tankStand({film:1,cups:1})+tankArt({water:1,inner:inkArt(4)})+hotCup(TCX,BY,{tag:false}),'230 160 500 290','잉크가 움직인 길')}
 if(no===5){if(ok('g2'))S(bg({})+acrylArt({sticker:1,candle:1,lit:1,k:2}),'330 80 300 360','더 오래 뒤')}
 if(no===6){if(ok('a1'))S(yardBg()+plateBlack(PX[0],250,'판 ㄱ',{val:MODEL.shade1})+plateBlack(PSUN,250,'판 ㄴ',{val:MODEL.sun1}),'0 0 960 540','1분 뒤')}
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
 if(!DB.cur||!EXPS[DB.cur]){H.classList.remove('lb-inrun');$('#lbSub').textContent='5학년 2학기 과학 · 3단원 열과 우리 생활';$('#lbChoose').hidden=true;$('#lbClearMi').hidden=true;
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
function fitAll(){fitBox($('#lbCard .lb-card-b'),$('#lbCard .lb-fit'),.76);fitBox($('#lbRail'),$('#lbRail .lb-rwrap'),.7);fitBox($('#lbSheet'),$('#lbSheet .lb-sh-in'),.56)}
function renderScene(){const r=R(),s=curStep(),el=$('#lbScene');if(!el)return;NAR=narrow();LEG=[];
 let over='';
 if(UI.toast)over+='<div class="lb-toast '+(UI.toastK==='info'?'lb-toast3':'lb-toast2')+'" role="status">'+esc(UI.toast)+'</div>';
 const sv=s.k==='concl'?recPanel():sceneSVG();NAR=false;set(el,over+sv);
 const lg=$('#lbLeg');if(lg)set(lg,LEG.length?LEG.map(x=>'<span class="lb-lg">'+esc(x[1])+'</span>').join(''):'')}
function notesHTML(s){if(!s.why&&!s.care)return '';const hideWhy=s.k==='more'&&R().more.a==null;let h=hideWhy?'<div class="lb-note lb-know">'+ic('info')+'<div><b>알아 두어요</b>'+esc(s.pre||'먼저 해 보고 골라요.')+'</div></div>':'<div class="lb-note lb-why">'+ic('why')+'<div><b>왜 그렇게 할까요?</b>'+esc(s.why)+'</div></div>';
 if(s.know)h+='<div class="lb-note lb-know">'+ic('info')+'<div><b>알아 두어요</b>'+esc(s.know)+'</div></div>';
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
function actsOf(s){const r=R(),A=[],busy=!!UI.fx,no=V().no,st=r.st||{};const cell=(id,grp,label,o)=>A.push(Object.assign({id,cell:1,grp,label,dis:busy,seen:!!r.seen[id],pressed:!!r.seen[id]},o||{}));
 if(no===1){
  if(s.id==='touch'){cell('tw','손으로 만지기','물이 든 컵');cell('tj','손으로 만지기','주스가 든 컵')}
  if(s.id==='probe'){seqActs(A,'pb',['pw1','pj1'],['물에 넣고 숫자가 멈출 때까지 기다리기','탐침을 닦고 주스에 넣기'],busy);if(A[1])A[1].dis=A[1].dis||!rowDone('pw')}
  if(s.id==='alc'){seqActs(A,'al',['aw'],['액체 기둥이 멈출 때까지 기다리기'],busy);if((st.al||0)>=1){const d=busy||rowDone('al')||!!r.seen.e1;[['e0','눈 위에서'],['e1','눈높이에서'],['e2','눈 아래에서']].forEach(([id,l])=>cell(id,'눈의 위치',l,{dis:d,seen:st.eye===+id[1],pressed:st.eye===+id[1]}))}}
  if(s.id==='ir')seqActs(A,'ir',['i1','i2'],['전원 켜기','측정 단추를 누른 채 계단에 레이저 빛 맞히기'],busy);
  if(s.id==='soil')[['k0','탐침 온도계'],['k1','알코올 온도계'],['k2','적외선 온도계']].forEach(([id,l])=>cell(id,'어떤 온도계로 잴까요?',l,{dis:busy||!!r.seen.k0,seen:id==='k0'&&!!r.seen.k0,pressed:id==='k0'&&!!r.seen.k0}))}
 if(no===2){if(s.id==='t0')seqActs(A,'tz',['t0a'],['두 물에 탐침 온도계 넣기'],busy);
  if(s.id==='time')seqActs(A,'tm',['m1','m2','m3','m4','m5'],['1분 뒤 온도 재기','2분 뒤 온도 재기','3분 뒤 온도 재기','4분 뒤 온도 재기','5분 뒤 온도 재기'],busy);
  if(s.id==='more')A.push({id:'ot',label:'다른 모둠의 결과 표 보기',dis:busy})}
 if(no===3){if(s.id==='heat')seqActs(A,'ht',['h0','h1','h2','h3'],['점화기로 촛불 켜기','1분쯤 지켜보기','3분쯤 지켜보기','5분쯤 지켜보기'],busy);
  if(s.id==='uheat')seqActs(A,'uh',['u0','u1','u2','u3'],['ㄷ자 구리판 고정하고 촛불 켜기','1분쯤 지켜보기','3분쯤 지켜보기','5분쯤 지켜보기'],busy)}
 if(no===4){if(s.id==='push')seqActs(A,'pu',['p1','p2','p3','p4'],['뜨거운 물이 든 컵 밀어 넣기','잠시 지켜보기','조금 더 지켜보기','더 오래 지켜보기'],busy);
  if(s.id==='more')A.push({id:'tw',label:'두 컵을 놓고 지켜보기',dis:busy})}
 if(no===5&&s.id==='light')seqActs(A,'lt',['l1','l2','l3'],['점화기로 촛불 켜기','잠시 지켜보기','더 오래 지켜보기'],busy);
 if(no===6){if(s.id==='m0'){seqActs(A,'m0',['ga','gb'],['판 ㄱ의 온도 재기','판 ㄴ의 온도 재기'],busy);if(A[1])A[1].dis=A[1].dis||!rowDone('a0')}
  if(s.id==='m1'){seqActs(A,'m1',['w1','sb','sa'],['초시계로 1분 기다리기','판 ㄴ의 온도 재기','판 ㄱ의 온도 재기'],busy);if(A[2])A[2].dis=A[2].dis||!rowDone('b1')}
  if(s.id==='places')MODEL.places.forEach((p,i)=>{cell('q'+i+'0',p[0],'햇빛 쪽 재기');cell('q'+i+'1',p[0],'그늘 쪽 재기')});
  if(s.id==='more')A.push({id:'lp',label:'열 전구 켜고 1분 기다리기',dis:busy})}
 /* 다 해 본 고르기 칸은 한 줄로 접음(기록 칸이 카드 안에 들어가게) */
 const C=A.filter(a=>a.cell);if(C.length){const all=no===1&&s.id==='touch'?C.every(a=>a.seen):no===6?C.every(a=>a.seen):no===1&&s.id==='soil'?!!r.seen.k0:no===1&&s.id==='alc'?!!r.seen.e1:false;if(all){const grps=[...new Set(C.map(a=>a.grp))];C.forEach(a=>{a.fin=grps.length>1?'모두 쟀어요':'다 했어요'})}}
 return A}
/* 차례대로 하는 행동: 지금 할 것 하나만 큰 단추로(한 일은 단추 위 차례 줄에 표시) */
function seqActs(A,key,ids,L0,busy){const c=R().st[key]||0,n=ids.length;
 L0.forEach((t,i)=>A.push({id:ids[i],label:(i+1)+'/'+n+' · '+t,dis:busy||i!==c,pressed:i<c,hide:i!==Math.min(c,n-1)}))}
/* 아래 막대: 이전 · 진행 · 이어서 */
function footHTML(v,r,s){const N=v.steps.length;
 let h='<button type="button" class="lb-btn" data-act="prev" data-f="prev"'+(r.step===0?' disabled':'')+'>'+ic('left')+'이전</button>';
 h+='<div class="lb-fmid"><span class="lb-pgn">'+(r.step+1)+' / '+N+'</span><span class="lb-prog" aria-hidden="true">'+v.steps.map((x,i)=>'<i class="'+(i<r.step?'lb-d':i===r.step?'lb-n':'')+'"></i>').join('')+'</span></div>';
 let pri='이어서',priOn=canNext(),priAct='next';if(s.k==='sheet'){pri='실험 고르기로';priOn=true;priAct='home'}
 return h+'<button type="button" class="lb-btn lb-pri'+(priOn&&priAct==='next'?' lb-go':'')+'" data-act="'+priAct+'" data-f="pri"'+(priOn?'':' disabled')+'>'+esc(pri)+ic('right')+'</button>'}

/* ───────── 오늘의 실험: 탐구 문제 · 이렇게 해요 · 이것을 살펴봐요 (결과는 보여 주지 않음) ───────── */
function eyeArt(x,y){return '<g transform="translate('+x+' '+y+')"><path d="M-26 0 Q0 -20 26 0 Q0 20 -26 0Z" fill="#FFFFFF" stroke="#2A3342" stroke-width="3"/><circle r="8" fill="#2A3342"/></g>'}
function introPic(no,k){const n0=NAR,l0=LEG;NAR=true;LEG=[];let g=bg({}),vb='0 0 960 540';
 if(no===1){if(k==='touch'){g+=cups1({lab:false})+hand(C1[0]-74,BY-60,0,1.1,0);vb='230 270 480 190'}
  if(k==='probe'){g+=cups1({lab:false})+probeTherm(C1[0],186,{on:1,len:120});vb='250 170 460 290'}
  if(k==='alc'){g+=alcTherm(480,60,ALC0);vb='330 40 300 420'}
  if(k==='ir'){g+=stairsArt(480,BY)+irGun(330,300,{});vb='150 200 760 260'}}
 if(no===2){if(k==='fill'){g+=tubeArt({hot:MODEL.hot[0]})+canArt(CANX,BY,{t:MODEL.cold[0]});vb='230 160 640 300'}
  if(k==='t0'){g+=tubeArt({hot:MODEL.hot[0]})+canArt(CANX,BY,{t:MODEL.cold[0]})+probeTherm(330,50,{on:1,len:210})+probeTherm(CANX,40,{on:1,len:200});vb='230 20 640 440'}
  if(k==='put'){g+=tubeArt({hot:MODEL.hot[0],cold:MODEL.cold[0],can:1,lid:1})+e2Probes('','');vb='220 20 380 440'}
  if(k==='time'){g+='<g transform="translate(480 260)">'+stopwatch(0,0,'01:00',1)+'</g>';vb='360 160 240 200'}}
 if(no===3){if(k==='stick'){g+=longPlate({sticker:1});vb='220 200 500 120'}
  if(k==='clamp'){g+=longPlate({sticker:1,stand:1,candle:1});vb='110 110 720 340'}
  if(k==='heat'){g+=longPlate({stand:1,candle:1,lit:1});vb='110 110 720 340'}
  if(k==='uheat'){g=bgTop()+uPlate({});vb='300 120 480 250'}}
 if(no===4){if(k==='stand'){g+=tankStand({film:1,cups:1});vb='220 340 520 110'}
  if(k==='water'){g+=tankStand({film:1,cups:1})+tankArt({water:1});vb='220 160 520 290'}
  if(k==='ink'){g+=tankStand({film:1,cups:1})+tankArt({water:1})+dropperArt(TCX,TK.y+TK.h-8,{ink:1});vb='220 20 520 430'}
  if(k==='push'){g+=tankStand({film:1,cups:1})+tankArt({water:1,inner:inkArt(0)})+hotCup(TCX+150,BY,{tag:false});vb='220 160 560 290'}}
 if(no===5){if(k==='stick'){g+=acrylArt({sticker:1});vb='330 80 300 360'}
  if(k==='place'){g+=acrylArt({sticker:1,candle:1});vb='330 80 300 360'}
  if(k==='light'){g+=candleArt(480,BY,{lit:1,h:70})+lighterArt(600,330,-20);vb='380 260 300 200'}
  if(k==='watch'){g+=acrylArt({sticker:1,candle:1,lit:1});vb='330 80 300 360'}}
 if(no===6){const Y=yardBg();if(k==='m0'){g=Y+plateBlack(PX[0],250,'')+plateBlack(PX[1],250,'')+irGun(PX[0]+170,380,{on:1,flip:1,laser:[PX[0],286]});vb='100 180 400 300'}
  if(k==='move'){g=Y+plateBlack(PX[0],250,'')+plateBlack(PSUN,250,'');vb='100 150 760 330'}
  if(k==='wait'){g=bg({})+'<g transform="translate(480 260)">'+stopwatch(0,0,'01:00',1)+'</g>';vb='360 160 240 200'}
  if(k==='m1'){g=Y+plateBlack(PSUN,250,'')+irGun(PSUN-170,380,{on:1,laser:[PSUN,286]});vb='480 180 420 300'}}
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
  '<g clip-path="url(#'+id+')" class="lb-lensin"><rect x="'+(lx-R2)+'" y="'+(ly-R2)+'" width="'+2*R2+'" height="'+2*R2+'" fill="var(--w-wall)"/><g transform="translate('+lx+' '+ly+') scale('+z+') translate('+(-x)+' '+(-y)+')">'+g.replace(/ id="[^"]*"/g,'').replace(/<g class="lb-lens"[\s\S]*$/,'')+'</g></g>'+
  '<circle cx="'+lx+'" cy="'+ly+'" r="'+R2+'" fill="none" stroke="var(--lb-lens)" stroke-width="7"/></g>'}
function homeArt(no){NAR=true;LEG=[];let g=bg({}),vb='120 70 720 420';
 if(no===1){g+=cups1({lab:false})+probeTherm(C1[0],186,{on:1,len:120});vb='250 170 460 290'}
 if(no===2){g+=tubeArt({hot:MODEL.hot[0],cold:MODEL.cold[0],can:1,lid:1})+e2Probes('','');vb='180 20 460 440'}
 if(no===3){g+=longPlate({sticker:1,stand:1,candle:1});vb='110 110 720 340'}
 if(no===4){g+=tankStand({film:1,cups:1})+tankArt({water:1,inner:inkArt(0)});vb='220 160 520 290'}
 if(no===5){g+=acrylArt({sticker:1,candle:1});vb='280 80 400 360'}
 if(no===6){g=yardBg()+plateBlack(PX[0],250,'')+plateBlack(PSUN,250,'');vb='0 0 960 540'}
 const s=svg(g,'실험 '+no+' 처음 모습',vb);NAR=false;LEG=[];return s}
function homeHTML(){const card=k=>{const v=EXPS[k],r=DB.runs[k];const st=r?(r.fin?'끝냄 · 결과 보기':(r.step+1)+'단계부터 이어서'):'실험 시작하기';
 return '<section class="lb-exc" aria-labelledby="lbE'+v.no+'"><div class="lb-exc-art">'+homeArt(v.no)+'</div><div class="lb-exc-b"><h2 id="lbE'+v.no+'"><em>실험 '+v.no+'</em>'+esc(v.name)+'</h2><p class="lb-exp">'+esc(v.sub)+'</p><button type="button" class="lb-pickb" data-pick="'+k+'" data-f="k'+k+'"><i>'+ic(['','thermo','cupT','plate','tank','candle','sun'][v.no])+'</i><span><b>'+st+'</b><span>교과서 실험</span></span>'+(r&&r.fin?'<small>'+ic('check')+'</small>':'')+'</button></div></section>'};
 return '<div class="lb-home"><div class="lb-home-h"><div class="lb-kick"><em>5학년 2학기 과학</em>3. 열과 우리 생활</div><h1>무엇을 실험할까요?</h1><p>실험을 한 단계씩 직접 해 보고, 내 눈으로 본 것을 기록해요.</p></div>'+
 '<div class="lb-ex lb-ex5 lb-ex6">'+['e1','e2','e3','e4','e5','e6'].map(card).join('')+'</div>'+
 '<p class="lb-model">'+ic('info')+'<span>아주 단순하게 만든 모형이에요. 같은 조건이면 언제나 같은 결과가 나와요. 온도계에 나타나는 숫자는 교과서 버전 앱(지도서 예시 값)과 같아요. 물과 공기의 색, 붙임딱지 색깔과 잉크가 번져 가는 빠르기와 모양은 이 실험관에서 정한 모습이에요. 실제 실험에서는 내가 관찰한 결과를 그대로 써요.</span></p></div>'}
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
/* 실험 단계의 행동 */
function doX(id){const r=R(),s=curStep(),st=r.st,no=V().no;if(UI.fx)return;
 if(s.k==='more'){UI.mq.cur=id;fx(id,2400,()=>{r.seen[id]=1;UI.mq[id]=1;UI.mq.both=1});return}
 r.act[s.id]=1;if(idxOf('pred')>=0&&r.step>idxOf('pred'))r.obs=1;
 const seq=(key,ids,ms,after)=>{const i=ids.indexOf(id),c=st[key]||0;if(i<0||c!==i)return;UI.mq.cur=id;fx(id,Array.isArray(ms)?ms[i]:ms,()=>{st[key]=i+1;r.seen[id]=1;if(after)after(i)})};
 const pend=(...rows)=>rows.forEach(w=>{if(!rowDone(w))r.pend[w]=1});
 if(no===1){
  if(s.id==='touch'){if(id!=='tw'&&id!=='tj')return;st.tl=id==='tw'?0:1;fx(id,1200,()=>{r.seen[id]=1});return}
  if(s.id==='probe'){if(id==='pj1'&&!rowDone('pw'))return;seq('pb',['pw1','pj1'],1800,i=>pend(i?'pj':'pw'));return}
  if(s.id==='alc'){if(id==='aw'){seq('al',['aw'],2000);return}
   const k=['e0','e1','e2'].indexOf(id);if(k<0||rowDone('al'))return;st.eye=k;
   if(k===1){r.seen.e1=1;pend('al');save();render()}else{save();render();flash('눈금을 비스듬히 보면 실제와 다르게 읽혀요. 액체 기둥 끝과 눈높이를 맞춰요.')}return}
  if(s.id==='ir'){seq('ir',['i1','i2'],[1000,1600],i=>{if(i===1)pend('ir')});return}
  if(s.id==='soil'){if(id==='k1'){flash('알코올 온도계는 벽에 걸어 두고 공기의 온도를 재기 좋아요. 흙 속의 온도에는 다른 온도계가 더 알맞아요.');return}
   if(id==='k2'){flash('적외선 온도계는 레이저 빛을 맞혀 물체 표면의 온도를 재요. 흙 속의 온도에는 다른 온도계가 더 알맞아요.');return}
   if(id==='k0'&&!r.seen.k0)fx('k0',1800,()=>{r.seen.k0=1;pend('so')});return}}
 if(no===2){if(s.id==='t0'){seq('tz',['t0a'],1800,()=>pend('h0','c0'));return}
  if(s.id==='time'){seq('tm',['m1','m2','m3','m4','m5'],1300,i=>{if(i===4)pend('h5','c5')});return}}
 if(no===3){if(s.id==='heat'){seq('ht',['h0','h1','h2','h3'],[1300,1800,1800,1800]);return}
  if(s.id==='uheat'){seq('uh',['u0','u1','u2','u3'],[1300,1800,1800,1800]);return}}
 if(no===4&&s.id==='push'){seq('pu',['p1','p2','p3','p4'],[1300,1700,1700,1700]);return}
 if(no===5&&s.id==='light'){seq('lt',['l1','l2','l3'],[1300,1800,1800]);return}
 if(no===6){if(s.id==='m0'){if(id==='gb'&&!rowDone('a0'))return;seq('m0',['ga','gb'],1300,i=>pend(i?'b0':'a0'));return}
  if(s.id==='m1'){if(id==='sa'&&!rowDone('b1'))return;seq('m1',['w1','sb','sa'],[1600,1300,1300],i=>{if(i===1)pend('b1');if(i===2)pend('a1')});return}
  if(s.id==='places'){if(!/^q\d\d$/.test(id)||r.seen[id])return;fx(id,1000,()=>{r.seen[id]=1});return}}}
/* 숫자 적기: 화면 숫자와 같은지만 알려 줌. 같은 값으로 다시 누르면 세지 않음 */
function tryKey(k,val){const r=R();if(r.last[k]===val)return -1;r.last[k]=val;r.tries[k]=(r.tries[k]||0)+1;return r.tries[k]}
function trial(row){const r=R(),R0=ROWS[row];if(!R0||R0.t!=='num'||!numOpen(row))return;const txt=String(UI.inp[row]||'').trim();
 if(!txt||!/^\d+(\.\d+)?$/.test(txt)){UI.fb[row]=[0,'숫자로 써요.'];render();return}
 if(txt===R0.v){r.rec[row]={ok:1,v:R0.v};delete r.pend[row];UI.inp[row]='';UI.mq.hl=false;UI.attn=false;UI.fb={};UI.fb[row]=[1,R0.dec?'잘 읽고 적었어요.':'잘 적었어요.'];save();render();const p=$('#lbFoot [data-act="next"]:not(:disabled)');if(p&&isDone(r.step))p.focus({preventScroll:true});return}
 const t=tryKey(row+':t',txt);
 if(t===-1){UI.fb[row]=[0,'숫자가 그대로예요. 다시 봐요.'];render();return}
 if(R0.half&&(+txt===Math.floor(+R0.v)||+txt===Math.ceil(+R0.v)))UI.fb[row]=[0,'액체 기둥 끝이 눈금과 눈금 사이 가운데에 있으면 소수점 아래를 5로 써요.'];
 else if(R0.dec&&txt.indexOf('.')<0&&+txt===Math.floor(+R0.v))UI.fb[row]=[0,'소수점 아래 첫째 자리까지 써요. 화면의 숫자를 그대로 써요.'];
  else{UI.fb[row]=[0,t>=2?'반짝이는 화면의 숫자를 한 자리씩 견주어 써요.':'화면의 숫자와 달라요. 다시 봐요.'];if(t>=2)UI.mq.hl=true}
 save();render()}
function rowRec(row){const r=R(),R0=ROWS[row],D=UI.draft[row]||{};let ok,wrong=[],key;
 if(R0.t==='note'){if(!rowReady(row))return;r.rec[row]={ok:1,t:R0.f.map((f,j)=>String((D.t||[])[j]||'').trim())};UI.fb={};UI.fb[row]=[1,'살펴본 것을 기록했어요.'];save();render();const p=$('#lbFoot [data-act="next"]:not(:disabled)');if(p&&isDone(R().step))p.focus({preventScroll:true});return}
 if(R0.t==='sel'){if(!rowReady(row))return;const f=D.f||[];fOf(row).forEach((x,j)=>{if(f[j]!==x.ok)wrong.push(j)});ok=!wrong.length;key=(R0.crit?r.st[R0.crit]+':':'')+f.join(',')}
 if(R0.t==='order'){const o=D.o||[];ok=o.join()===R0.ans.join();key=o.join(',');if(!ok)wrong=[0]}
 if(ok){UI.attn=false;r.rec[row]=R0.t==='sel'?{ok:1,f:D.f.slice(),c:R0.crit?r.st[R0.crit]:undefined}:{ok:1,o:D.o.slice()};UI.fb={};UI.fb[row]=[1,'잘 살펴보고 적었어요.'];UI.wrong[row]=[];save();render();const p=$('#lbFoot [data-act="next"]:not(:disabled)');if(p&&isDone(R().step))p.focus({preventScroll:true});return}
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
 if(t.dataset&&t.dataset.in!=null){const dec=!!(ROWS[t.dataset.in]&&ROWS[t.dataset.in].dec);UI.inp[t.dataset.in]=t.value.replace(dec?/[^\d.]/g:/[^\d]/g,'');if(t.value!==UI.inp[t.dataset.in])t.value=UI.inp[t.dataset.in]}
 if(t.id==='lbName'){DB.name=t.value;save();const u=$('#lbSheet .lb-sh-name u');if(u)u.textContent=DB.name||' '}});
let rzT=0,wasN=narrow();addEventListener('resize',()=>{clearTimeout(rzT);rzT=setTimeout(()=>{const n=narrow();if(n!==wasN){wasN=n;const s=$('#lbScene');if(s)s._h=null}if(DB.cur)render();else fitAll()},150)});
if(DB.cur&&EXPS[DB.cur]){if(!DB.runs[DB.cur])DB.runs[DB.cur]=newRun();enterStep()}
render();

addEventListener('beforeprint',()=>{const s=$('#lbSheet .lb-sh-in');if(s)s.style.zoom=''});addEventListener('afterprint',()=>{try{fitAll()}catch(e){}});
