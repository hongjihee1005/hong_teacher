/* 물의 상태 변화 실험관에서 더 쓰는 아이콘 */
Object.assign(I,{cube:'<rect x="5" y="7" width="12" height="12" rx="2.5"/><path d="M5 7l3-3h12v12l-3 3M17 7l3-3"/>',bottle:'<path d="M10 3h4v3c2.5 1 3.5 2.6 3.5 5V20a1 1 0 01-1 1h-9a1 1 0 01-1-1v-9c0-2.4 1-4 3.5-5z"/><path d="M7 13h10"/>',flame:'<path d="M12 3c1 3.5 5 5.5 5 10a5 5 0 01-10 0c0-2.6 1.5-4 2.5-5.5.3 1.6 1 2.5 2 3 0-2.5-.5-5 .5-7.5z"/>'});

/* ───────── 기록(이 기기에만) ───────── */
const KEY='hj-g4water-v1';
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
/* 시간 칸: 지금 보는 칸(방금 누른 칸, 없으면 마지막으로 본 칸) */
function tView(key){const r=R(),L=TIMES[key];if(UI.mq.cur&&L.some(x=>x[0]===UI.mq.cur))return UI.mq.cur;return r.st[key+'v']||null}
function tLabel(key,id){const x=TIMES[key].find(x=>x[0]===id);return x?x[1]:''}
const fid=()=>UI.fx?UI.fx.id:null;
function eyeArt(x,y){return '<g transform="translate('+x+' '+y+')"><path d="M-26 0 Q0 -20 26 0 Q0 20 -26 0Z" fill="#FFFFFF" stroke="#2A3342" stroke-width="3"/><circle r="8" fill="#2A3342"/></g>'}

/* 실험 1: 위에서 본 접시 */
function e1Watch(view,o){o=o||{};const f=MODEL.freeze[view||'m0'],k=MODEL.spray[view||'m0'];let g=bgTop()+iceBed();
 if(o.out){g+='<circle cx="'+D1.cx+'" cy="'+D1.cy+'" r="'+(D1.r+6)+'" fill="#B9D0DB" stroke="#9CC0D2" stroke-width="2"/>';
  g+='<g'+(o.outAnim?an('lb-a-up',0,'--from:30px'):'')+'><g transform="translate('+D1.cx+' '+(D1.cy-30)+') scale(1 .74) translate('+(-D1.cx)+' '+(-D1.cy)+')">'+dishTop(D1.cx,D1.cy,D1.r,{freeze:1,lid:1})+'</g>'+hand(D1.cx-D1.r-40,D1.cy-30,0,1.2,1)+hand(D1.cx+D1.r+40,D1.cy-30,180,1.2,1)+'</g>'}
 else g+=dishTop(D1.cx,D1.cy,D1.r,{freeze:f,lid:1});
 g+=dishTop(D2.cx,D2.cy,D2.r,{drops:k,dropAnim:o.dropAnim});
 g+=mini(D1.cx,505,'얼음 수조 속 접시',19)+mini(D2.cx,425,'분무기로 뿌린 물',19);
 if(view)g+=clockArt(D2.cx-70,92,null,.62)+mini(D2.cx+20,99,tLabel('e1',view),24);
 return g}
function e1Spot(){const v=tView('e1');if(!v||UI.mq.cur==='tiltI')return null;return [D2.cx+18,D2.cy-14,46,1.9,560,110]}
function e1Scene(s){const r=R(),id=s.id,st=r.st,f=fid();
 if(id==='gear')return bg({})+gearArt(has('gear'),fxOn('gear'));
 if(id==='water'){const c=st.wp||0,cx=480,cy=270,R0=150;let g=bgTop();
  const tilt=f==='wp2'||(!f&&UI.mq.cur==='wp2');
  if(c===0&&f!=='wp1')return g+dishTop(cx,cy,R0,{})+'<circle cx="800" cy="150" r="56" fill="rgba(236,246,251,.8)" stroke="#7F9BAB" stroke-width="4"/><circle cx="800" cy="150" r="46" fill="'+WC+'" fill-opacity=".85"/>'+mini(800,240,'물',20);
  if(tilt){g+='<g transform="translate('+cx+' '+cy+') scale(1 .76) translate('+(-cx)+' '+(-cy)+')">'+dishTop(cx,cy,R0,{})+'</g>';
   g+='<path d="M'+(cx-120)+' '+(cy+66)+' Q'+cx+' '+(cy+132)+' '+(cx+120)+' '+(cy+66)+' Q'+cx+' '+(cy+40)+' '+(cx-120)+' '+(cy+66)+'Z" fill="'+WC+'" fill-opacity=".85" stroke="'+WS+'" stroke-width="2"'+(f==='wp2'?an('lb-a-fade',.3):'')+'/>';
   return g+hand(cx,cy-R0*.76-30,90,1.2,1)+arrow(cx+200,cy+20,cx+200,cy-70)}
  g+=dishTop(cx,cy,R0,{});
  g+='<path d="M'+(cx-80)+' '+(cy-10)+' C'+(cx-84)+' '+(cy-80)+' '+(cx+70)+' '+(cy-86)+' '+(cx+84)+' '+(cy-14)+' C'+(cx+96)+' '+(cy+60)+' '+(cx-40)+' '+(cy+92)+' '+(cx-80)+' '+(cy-10)+'Z" fill="'+WC+'" fill-opacity=".85" stroke="'+WS+'" stroke-width="2"'+(f==='wp1'?an('lb-a-pop',.2):'')+'/>';
  if(f==='wp3'||(!f&&UI.mq.cur==='wp3'))g+='<circle cx="'+(cx+10)+'" cy="'+(cy-6)+'" r="16" fill="none" stroke="#FFFFFF" stroke-width="3"/><circle cx="'+(cx+10)+'" cy="'+(cy-6)+'" r="32" fill="none" stroke="#FFFFFF" stroke-width="2" opacity=".7"/>'+hand(cx+66,cy-14,180,1.1,1);
  return g}
 if(id==='seal'){let g=bgTop()+iceBed();const on=has('seal');
  if(!on)return g+dishTop(780,270,D1.r,{freeze:0})+itemArtAt('tape',780,450).replace('scale(1.4)','scale(.9)');
  return g+'<g'+(f==='seal'?an('lb-a-slide',0,'--dx:490px'):'')+'>'+dishTop(D1.cx,D1.cy,D1.r,{freeze:0,lid:1})+'</g>'+mini(D1.cx,505,'얼음 수조 속 접시',19)}
 if(id==='spray'){let g=bgTop()+iceBed()+dishTop(D1.cx,D1.cy,D1.r,{freeze:0,lid:1});const on=has('spray');
  g+=dishTop(D2.cx,D2.cy,D2.r,on?{drops:1,dropAnim:f==='spray'}:{});
  if(!on||f==='spray')g+='<g transform="rotate(-24 '+(D2.cx+150)+' 150)">'+sprayer(D2.cx+150,150,1)+'</g>'+(f==='spray'?mist(D2.cx+90,150,true):'');
  return g}
 if(id==='pred')return e1Watch(null)+qmark(D2.cx,90);
 if(id==='watch'){const out=UI.mq.cur==='tiltI'||f==='tiltI';return e1Watch(tView('e1'),{out,outAnim:f==='tiltI',dropAnim:false})}
 return bgTop()}
/* 실험 2: 병 */
function bState(){const r=R(),st=r.st,fz=st.fz||0,ml=st.ml||0;
 const lines={};if(r.done.mark0||idxOf('mark0')<r.step)lines.k=[LCOL.k,LV.water];if(fz>=4)lines.r=[LCOL.r,LV.ice];if(ml>=4)lines.b=[LCOL.b,LV.water];
 const fill=ml>=1?'water':fz>=1?'ice':(r.done.fill||idxOf('fill')<r.step)?'water':null;return {fill,lines}}
function bottleOnScale(o){return bottle(ES.x,330,o).replace(/<ellipse[^>]*\/>/,'')}
function scaleScene(key,ids,val,beside,onScale){const r=R(),st=r.st,c=st[key]||0,f=fid(),fi=ids.indexOf(f),k=Math.max(c,fi+1),three=ids.length===3;
 const on=three?k>=1:true,zero=three?k>=2:k>=1,placed=k>=ids.length;
 const v=placed?val:zero?'0.0':three?'3.6':'0.0';
 const pend=placed&&r.pend[ids.key]!=null;
 let g=bg({})+escale(ES.x,{on,val:v,hl:UI.mq.hl&&placed,pw:f===ids[0]&&three,zp:f===(three?ids[1]:ids[0]),item:placed?onScale:null,drop:f===ids[ids.length-1],press:f===ids[0]&&three?'pw':f===(three?ids[1]:ids[0])?'zp':null});
 if(!placed)g+=beside;
 return g}
function e2Scene(s){const r=R(),id=s.id,st=r.st,f=fid(),B=bState();
 if(id==='gear')return bg({})+gearArt(has('gear'),fxOn('gear'),true);
 let g=bg({});
 if(id==='fill'){const on=has('fill');
  if(!on)return g+bottle(420,BY,{nocap:1})+'<rect x="530" y="404" width="48" height="26" rx="4" fill="#2F68B0" stroke="#1D4A80" stroke-width="2"/>'+beaker2(700,BY,{lvl:150});
  return g+bottle(420,BY,{fill:'water',rise:f==='fill'})+beaker2(700,BY,{lvl:f==='fill'?60:60})}
 if(id==='mark0'){const on=has('mark0');g+=bottle(480,BY,{fill:'water',lines:on?{k:B.lines.k||[LCOL.k,LV.water],anim:f==='mark0'?'k':null}:null});
  if(on)g+=eyeArt(300,BY-LV.water)+'<path d="M330 '+(BY-LV.water)+' H410" stroke="#2A3342" stroke-width="2.5" stroke-dasharray="6 6"/>';
  return g+(f==='mark0'?'<g'+an('lb-a-slide',0,'--dx:-80px')+'>'+pen(560,BY-LV.water+2,LCOL.k,-60)+'</g>':on?'':pen(660,BY-60,LCOL.k,-20))}
 if(id==='w1')return scaleScene('sc',Object.assign(['sp','sz','sb'],{key:'w1'}),'30.1',bottle(180,BY,{fill:'water',lines:B.lines}),bottleOnScale({fill:'water',lines:B.lines}));
 if(id==='w2')return scaleScene('sc2',Object.assign(['s2z','s2b'],{key:'w2'}),'30.1',bottle(180,BY,{fill:'ice',lines:B.lines}),bottleOnScale({fill:'ice',lines:B.lines}));
 if(id==='w3')return scaleScene('sc3',Object.assign(['s3z','s3b'],{key:'w3'}),'30.1',bottle(180,BY,{fill:'water',lines:B.lines}),bottleOnScale({fill:'water',lines:B.lines}));
 if(id==='pred')return g+bottle(480,BY,{fill:'water',lines:B.lines})+qmark(640,180);
 if(id==='freeze'||id==='melt'){const key=id==='freeze'?'fz':'ml',ids=id==='freeze'?['fz1','fz2','fz3','fz4']:['ml1','ml2','ml3','ml4'],c=st[key]||0,fi=ids.indexOf(f),k=Math.max(c,fi+1);
  const fillIn=id==='freeze'?'ice':'water',fillOut=id==='freeze'?(k>=1?'ice':'water'):(k>=1?'water':'ice'),bo={ice:id==='freeze',warm:id==='melt'};
  const lines=Object.assign({},B.lines);if(id==='freeze'){delete lines.r;if(k>=4)lines.r=[LCOL.r,LV.ice]}else{delete lines.b;if(k>=4)lines.b=[LCOL.b,LV.water]}
  if(k===0)return g+bottle(320,BY,{fill:fillOut,lines})+bigBeaker(700,BY,bo);
  if(k===1){const inner='<g'+(fi===0?an('lb-a-down',0,'--from:-160px'):'')+'>'+bottle(560,BY-14,{fill:fi===0?(id==='freeze'?'water':'ice'):fillIn,lines}).replace(/<ellipse[^>]*\/>/,'')+'</g>';
   return g+bigBeaker(560,BY,Object.assign({inner},bo))+(fi===0?tag(560,110,id==='freeze'?'다 얼 때까지 기다려요':'다 녹을 때까지 기다려요',22):'')}
  if(k===2)return g+'<g'+(fi===1?an('lb-a-up',0,'--from:-60px'):'')+'>'+bottle(440,BY,{fill:fillOut,lines,wet:fi===1?'anim':1})+'</g>'+towel(640,BY-40);
  if(k===3)return g+bottle(440,BY,{fill:fillOut,lines})+(fi===2?towel(440,BY-110,true):towel(640,BY-40));
  const lk=id==='freeze'?'r':'b';lines.anim=fi===3?lk:null;
  return g+bottle(440,BY,{fill:fillOut,lines})+(fi===3?'<g'+an('lb-a-slide',0,'--dx:-80px')+'>'+pen(520,BY-(id==='freeze'?LV.ice:LV.water)+2,LCOL[lk],-60)+'</g>':'')+lineKey(640,140,lines)}
 return g}
function lineKey(x,y,L){let g='',i=0;[['k','검은 선 · 처음'],['r','빨간 선 · 다 언 뒤'],['b','파란 선 · 다 녹은 뒤']].forEach(([k,t])=>{if(!L[k])return;if(NAR){LEG.push([null,t]);return}g+='<path d="M'+x+' '+(y+i*34)+' h40" stroke="'+LCOL[k]+'" stroke-width="5"'+(k==='b'?' stroke-dasharray="10 6"':'')+'/><text x="'+(x+52)+'" y="'+(y+i*34+7)+'" font-size="20" font-weight="800" fill="var(--w-labeltx)">'+t+'</text>';i++});return g}
function lineSpot(){const s=curStep(),key=s.id==='freeze'?'fz':'ml',c=R().st[key]||0;if(c<4&&fid()!==(s.id==='freeze'?'fz4':'ml4'))return null;return [440+46,BY-106,30,2.5,800,330]}
function scaleSpot(){return [525,405,62,1.5,800,170]}
/* 실험 3: 물로 쓰는 종이와 비커 */
function e3Scene(s){const r=R(),id=s.id,st=r.st,f=fid();
 if(id==='draw'){const on=has('draw');let g=bgTop()+wpaperArt({k:on?1:0,draw:f==='draw'});
  return g+(f==='draw'?'<g'+an('lb-a-slide',0,'--dx:-300px')+'>'+brushArt(690,330,30)+'</g>':on?'':brushArt(860,330,20)+'<circle cx="860" cy="130" r="44" fill="rgba(236,246,251,.8)" stroke="#7F9BAB" stroke-width="4"/><circle cx="860" cy="130" r="34" fill="'+WC+'"/>')}
 if(id==='pred'&&idxOf('paper')>r.step)return bgTop()+wpaperArt({k:1})+qmark(480,40);
 if(id==='paper'){const v=tView('e3p');let g=bgTop()+wpaperArt({k:MODEL.paint[v||'p0']});
  if(v)g+=mini(480,40,tLabel('e3p',v),26);
  if(f&&/^p\d/.test(f))g+='<g'+an('lb-a-slide',0,'--dx:120px')+'>'+hand(400,270,180,1.3,0)+'</g>';
  return g}
 let g=bg({win:id==='bfill'?null:430});
 if(id==='bfill'){const on=has('bfill');
  if(!on)return g+beaker2(BX3.cx,BY,{})+beaker2(280,BY,{lvl:160}).replace(/<ellipse[^>]*\/>/,'')+pen(760,BY-40,LCOL.k,-20);
  return g+beaker2(BX3.cx,BY,{lvl:BX3.lv,rise:f==='bfill',marks:[[BX3.lv,DCOL.o,'',f==='bfill']]})+(f==='bfill'?'<g'+an('lb-a-slide',.8,'--dx:-80px')+'>'+pen(BX3.cx-60,BY-BX3.lv+2,LCOL.k,-60)+'</g>':'')}
 if(id==='bsun'){const on=has('bsun');
  if(!on)return g+beaker2(200,BY,{lvl:BX3.lv,marks:[[BX3.lv,DCOL.o,'']]})+itemArtAt('sticker',820,360).replace('scale(1.4)','scale(.9)');
  return g+'<g'+(f==='bsun'?an('lb-a-slide',0,'--dx:-360px'):'')+'>'+beaker2(BX3.cx,BY,{lvl:BX3.lv,sticker:f==='bsun'?'anim':1,marks:[[BX3.lv,DCOL.o,'']]})+'</g>'}
 if(id==='pred')return g+beaker2(BX3.cx,BY,{lvl:BX3.lv,sticker:1,marks:[[BX3.lv,DCOL.o,'']]})+qmark(BX3.cx,140);
 if(id==='days'){const v=tView('e3d'),c=st.e3d||0,lv=BX3.lv-(v?MODEL.days[v]:0);
  const marks=[[BX3.lv,DCOL.o,'']].concat(TIMES.e3d.slice(0,c).map(x=>[BX3.lv-MODEL.days[x[0]],DCOL[x[0]],'',f===x[0]]));
  g+=beaker2(BX3.cx,BY,{lvl:lv,sticker:1,marks});
  if(v)g+=mini(230,90,tLabel('e3d',v),26);
  g+=dayKey(760,90,c);
  return g}
 return g}
function dayKey(x,y,c){let g='';[['o','처음']].concat(TIMES.e3d.slice(0,c).map(t=>[t[0],t[1]])).forEach((t,i)=>{if(NAR){LEG.push([null,['검은','초록','빨간','파란','보라'][i]+' 선 · '+t[1]]);return}g+='<path d="M'+x+' '+(y+i*32)+' h36" stroke="'+DCOL[t[0]]+'" stroke-width="5"/><text x="'+(x+46)+'" y="'+(y+i*32+7)+'" font-size="19" font-weight="800" fill="var(--w-labeltx)">'+t[1]+'</text>'});return g}
function dayLens(){if(!(UI.mq.cur==='dz'||fid()==='dz'||(R().seen.dz&&!UI.mq.cur))){
  /* 날마다 그은 선과 물 높이를 확대(검토 고침: 선 사이가 좁아 그림만으로는 견주기 어려웠음) */
  if(!tView('e3d')&&!TIMES.e3d.some(x=>fid()===x[0]))return null;return [BX3.cx-BK.w/2+12,BY-BX3.lv+10,30,2.8,250,280]}
 const lv=BX3.lv-MODEL.days.d3;return [BX3.cx,BY-lv+16,40,2.1,250,280]}
/* 실험 4: 가열 */
function e4Scene(s){const r=R(),id=s.id,st=r.st,f=fid();
 if(id==='gear')return bg({})+gearArt(has('gear'),fxOn('gear'),true);
 let g=bg({});
 if(id==='mark'){const on=has('mark');g+=hotplate(false);
  if(!on)return g+beaker2(HP.x,HP.y,{})+pen(760,BY-40,LCOL.b,-20);
  return g+beaker2(HP.x,HP.y,{lvl:LV4.start,rise:f==='mark',marks:[[LV4.start,LCOL.b,'',f==='mark']]})+(f==='mark'?'<g'+an('lb-a-slide',.8,'--dx:-80px')+'>'+pen(HP.x-60,HP.y-LV4.start+2,LCOL.b,-60)+'</g>':'')}
 if(id==='pred')return g+hotplate(false)+heatBeaker(LV4.start,0,{mark:1})+stopwatch(150,220,'0:00',false)+qmark(HP.x,110);
 if(id==='heat'){const on=!!st.on||f==='on',v=tView('e4'),m=v?TIMES.e4.findIndex(x=>x[0]===v)+1:0;
  return g+hotplate(on)+heatBeaker(LV4.start,m,{mark:1})+stopwatch(150,220,m+':00',on)+(f==='close'?headNear():'')}
 if(id==='boil5'){const c=st.b5||0,fi=['b51','b52','b53'].indexOf(f),k=Math.max(c,fi+1);
  const off=k>=2,lv=k>=1?LV4.after:LV4.start;
  return g+hotplate(!off)+heatBeaker(lv,off?0:8,{mark:1})+stopwatch(150,220,k>=1?'12:00':'8:00',!off)+(k>=2?tag(HP.x,70,'끈 뒤에도 뜨거워요',20):'')}
 return g}
function headNear(){return '<g'+an('lb-a-slide',0,'--dx:120px')+'><circle cx="'+(HP.x+150)+'" cy="'+(HP.y-230)+'" r="44" fill="#F2C6A0" stroke="#B9875F" stroke-width="3"/>'+goggles(HP.x+138,HP.y-236,.6)+'</g>'}
function boilSpot(){const v=tView('e4');if(!v)return null;return [HP.x+10,HP.y-46,46,1.9,790,170]}
function afterSpot(){const c=R().st.b5||0;if(c<3&&fid()!=='b53')return null;return [HP.x-BK.w/2+14,HP.y-LV4.start+8,30,2.5,790,170]}
/* 실험 5: 얼음 비커 */
function e5Scene(s){const r=R(),id=s.id,st=r.st,f=fid();
 if(id==='gear')return bg({})+gearArt(has('gear'),fxOn('gear'));
 let g=bg({});
 if(id==='wrap'){const on=has('wrap');g+=cupOnDish(480,BY,{wrap:on?(f==='wrap'?'anim':1):0});return g+(on?'':itemArtAt('wrap',760,250).replace('scale(1.4)','scale(1)')+itemArtAt('band',760,370).replace('scale(1.4)','scale(.8)'))}
 if(id==='g0')return scaleScene('g0s',Object.assign(['gp','gz','gb'],{key:'g0'}),'263.1',cupOnDish(170,BY,{wrap:1}),cupOnDish(ES.x,330,{wrap:1}).replace(/<ellipse cx="560" cy="326"/,'<ellipse cx="560" cy="326"'));
 if(id==='pred')return g+cupOnDish(480,BY,{wrap:1})+qmark(700,160);
 if(id==='watch5'){const v=tView('e5'),d=v?MODEL.dew[v]:0;g+=cupOnDish(480,BY,{wrap:1,dew:d,pool:v==='t10',dewAnim:!!(f&&/^t\d/.test(f))});
  if(v)g+=clockArt(230,140,null,.8)+mini(230,210,tLabel('e5',v),26);return g}
 if(id==='g1')return scaleScene('g1s',Object.assign(['hz','hb'],{key:'g1'}),'263.4',cupOnDish(170,BY,{wrap:1,dew:3,pool:1}),cupOnDish(ES.x,330,{wrap:1,dew:3,pool:1}))+(fxOn('wipe')?towel(170,BY-110,true):'');
 return g}
function dewSpot(){const v=tView('e5');if(!v)return null;return [480+70,BY-120,30,2.6,680,190]}
function sceneSVG(){const v=V(),r=R(),s=curStep(),id=s.id,no=v.no;
 const T=(g,l,vb)=>svg(g+lensOf(s,g),l||s.t,vb);
 if(id==='tools'){if(!(r.done.tools||fxOn('tools')))return T(bg({})+boxArt(480),'준비물 상자');return T(bg({})+toolsScene(v.tools,fxOn('tools')),'준비물: '+v.tools.map(x=>x[1]).join(', '))}
 if(id==='gear')return T(no===1?e1Scene(s):no===2?e2Scene(s):no===4?e4Scene(s):e5Scene(s),s.t,'160 40 640 420');
 if(no===1)return T(e1Scene(s),s.t,id==='water'?'190 60 680 440':'40 20 880 520');
 if(no===2)return T(e2Scene(s),s.t,/^w\d$/.test(id)?'40 30 900 470':'170 70 720 420');
 if(no===3)return T(e3Scene(s),s.t,id==='draw'||id==='paper'||(id==='pred'&&idxOf('paper')>r.step)?'110 0 800 500':'60 30 880 470');
 if(no===4)return T(e4Scene(s),s.t,'40 30 900 470');
 if(no===5)return T(e5Scene(s),s.t,id==='g0'||id==='g1'?'40 30 900 470':'160 100 640 400');
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
  F.forEach((f,j)=>{const long=c2?f.o.length>3||f.o.some(t=>t.length>9):f.o.some(t=>t.length>6)||f.o.length>3;
   h+='<div class="lb-cells lb-c1'+c2+'"><span class="lb-cl">'+esc(f.l)+'</span><span class="lb-seg lb-kseg'+(long?' lb-kwrap':'')+(wr.indexOf(j)>=0?' lb-wrongc':'')+'" role="group" aria-label="'+esc(R0.n+' '+f.l)+'">'+f.o.map((o,i)=>'<button type="button" class="lb-s" data-f="'+row+j+'-'+i+'" data-dr="'+row+':'+j+':'+i+'" aria-pressed="'+(D.f[j]===i)+'"'+(ok?'':' disabled')+'>'+esc(o)+'</button>').join('')+'</span></div>'});
  h+=recB(ok&&F.every((f,j)=>D.f[j]!=null))}
 if(R0.t==='note'){D.t=D.t||[];
  h+='<p class="lb-hint2">쓰고 싶은 것을 짧게 써요. 쓰지 않아도 돼요.</p>'+R0.f.map((f,j)=>'<label class="lb-nrow"><span>'+esc(f.l)+'</span><input class="lb-input lb-ninp" maxlength="20" autocomplete="off" data-f="nt'+row+j+'" data-nt="'+row+':'+j+'" placeholder="'+esc(R0.ph)+'" value="'+esc(D.t[j]||'')+'"'+(ok?'':' disabled')+'></label>').join('');
  h+=recB(ok)}
 if(R0.t==='num'){const op=numOpen(row);
  h+='<div class="lb-trials"><label class="lb-trial'+(op?' lb-tcur':'')+'"><span>'+(R0.u==='분'?'시간':'무게')+'</span><input class="lb-num lb-numw" inputmode="'+(R0.dec?'decimal':'numeric')+'" maxlength="6" autocomplete="off" data-f="in'+row+'" data-in="'+row+'" aria-label="'+esc(R0.n)+' 숫자" value="'+esc(UI.inp[row]||'')+'"'+(op?'':' disabled')+'><span>'+R0.u+'</span></label><button type="button" class="lb-mini" data-act="trial" data-row="'+row+'" data-f="tr'+row+'"'+(op?'':' disabled')+'>'+ic('check')+'적기</button></div>';
  if(R0.u==='분')h+='<p class="lb-hint2">몇 분 칸에서 처음 보았는지 써요. (기포가 생기는 때는 이 실험관에서 정한 값이에요.)</p>'}
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
 if(rowReady(need)){if(R0.t==='num')return '③ '+(R0.u==='분'?'초시계에서 본 때를':'저울 화면의 숫자를')+' ‘'+R0.n+'’ 칸에 써요.';
  return R0.t==='note'?'③ 살펴본 것을 쓰고 기록해요.':'③ '+R0.n+(/\?$/.test(R0.n)?' ':': ')+'알맞은 것을 골라 기록해요.'}
 const A=actsOf(s);
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
 grps.forEach(G=>{const n=G.c.length,mini=cellsOnly&&G.c.every(a=>a.seen&&a.label.length<=3),cols=mini?n:G.c.some(a=>a.label.length>6)?(n>2?2:n):n===8||n===4?4:n>4?3:n;
  /* 모두 본 뒤(기록하는 동안)에는 시간 칸을 한 줄로 작게 — 기록 칸이 카드 안에 들어가게 */
  h+='<div class="lb-cellrow'+(mini?' lb-cellmini':'')+'" role="group" aria-label="'+esc(G.n)+'"><span class="lb-cl">'+esc(G.n)+(mini?' · 다시 볼 때 눌러요':'')+'</span><div style="grid-template-columns:repeat('+cols+',minmax(0,1fr))">'+G.c.map(a=>'<button type="button" class="lb-cellb'+(a.label.length>6?' lb-cellw':'')+(UI.attn&&!a.dis?' lb-attn':'')+(a.seen?' lb-seen':'')+'" data-act="x" data-x="'+a.id+'" data-f="x'+a.id+'" aria-pressed="'+!!a.pressed+'"'+(a.dis?' disabled':'')+' aria-label="'+esc(G.n+' '+a.label)+(a.seen?' (해 봤어요)':'')+'">'+(a.seen&&!mini?ic('check'):'')+'<span>'+esc(a.label)+'</span></button>').join('')+'</div></div>'});
 return h}
const MOREQ={};
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
 let h='<article class="lb-sheet lb-sh-e'+v.no+'" id="lbSheet" aria-label="실험 결과 한 장"><div class="lb-sh-in"><header class="lb-sh-h"><div><h2>실험 결과 한 장 · '+esc(v.title)+'</h2><span>탐구 실험관 · 4학년 1학기 과학 · 2. 물의 상태 변화 · '+ds+'</span></div><div class="lb-sh-name">이름 <u>'+(esc(DB.name)||'&nbsp;')+'</u></div></header><div class="lb-sh-grid"><div class="lb-sh-col">';
 h+='<section class="lb-sh-sec"><h3><i></i>실험 문제</h3><p><b>'+esc(v.q)+'</b></p>'+planSummary(v,r)+'</section>';
 h+='<section class="lb-sh-sec lb-sh-po"><h3><i></i>실험한 차례</h3><div class="lb-sh-steps">'+done.map((s,i)=>'<div><b>'+(i+1)+'.</b> '+esc(s.t)+'</div>').join('')+'</div></section>';
 h+='<section class="lb-sh-sec"><h3><i></i>내 예상</h3><p>'+v.pred.map((q,j)=>(v.pred.length>1?esc(q.q)+' ':'')+(r.pred[j]!=null?esc(q.o[r.pred[j]]):'(고르지 않았어요)')).join('<br>')+(r.why?'<br>까닭: '+esc(r.why):'')+'</p></section>';
 h+='</div><div class="lb-sh-col"><section class="lb-sh-sec"><h3><i></i>관찰 기록</h3>'+sheetTable(v,r)+barChart(v,r)+'</section>';
 /* 실험 1은 관찰 기록 줄이 일곱이라 결론을 아래 한 줄 전체로(오른쪽 칸만 길어져 2쪽이 되던 것, 독립 검토 고침) */
 const cs='<section class="lb-sh-sec'+(v.no===1?' lb-sh-wide':'')+'"><h3><i></i>내 결론</h3><div class="lb-sh-box"><p class="lb-sh-concl">'+frameHTML(v,r.bl,'sheet')+'</p>'+(r.cmp?'<p class="lb-sh-book">교과서 결론: '+esc(v.book)+'</p>':'')+'</div></section>';
 h+=(v.no===1?'':cs)+'</div></div>'+(v.no===1?cs:'')+picsHTML(snapList(v,r))+'<section class="lb-sh-sec lb-sh-po lb-sh-fill"><h3><i></i>새로 알게 된 것 · 더 알고 싶은 것</h3><div class="lb-sh-lines">'+'<div class="lb-ln"></div>'.repeat(9)+'</div></section>';
 h+='<footer class="lb-sh-f"><span>아주 단순하게 만든 모형의 결과예요. 실제 교실에서는 결과가 조금 다를 수 있어요.</span><span>만든 사람: 초등교사 홍지희</span></footer></div></article>';
 return h}
const LABNAME='g4water';
function snapsOf(v,r){const L=[],no=v.no,S=(g,vb,cap)=>L.push([svg(g,cap,vb),cap]);const ok=k=>rowDone(k);
 if(no===1){S(e1Watch('m0'),'40 30 880 500','처음');if(ok('iceW'))S(e1Watch('m10'),'40 30 880 500','10분 뒤')}
 if(no===2){if(ok('redH'))S(bg({})+bottle(480,BY,{fill:'ice',lines:{k:[LCOL.k,LV.water],r:[LCOL.r,LV.ice]}}),'340 160 280 300','다 언 뒤');
  if(ok('blueH'))S(bg({})+bottle(480,BY,{fill:'water',lines:{k:[LCOL.k,LV.water],r:[LCOL.r,LV.ice],b:[LCOL.b,LV.water]}}),'340 160 280 300','다 녹은 뒤')}
 if(no===3){S(bgTop()+wpaperArt({k:1}),'130 50 700 440','처음 그림');if(ok('pLook'))S(bgTop()+wpaperArt({k:MODEL.paint.p10}),'130 50 700 440','10분 뒤 그림');
  if(ok('dH2'))S(bg({})+beaker2(BX3.cx,BY,{lvl:BX3.lv-MODEL.days.d3,sticker:1,marks:[[BX3.lv,DCOL.o,'']].concat(TIMES.e3d.map(x=>[BX3.lv-MODEL.days[x[0]],DCOL[x[0]],'']))}),'440 210 240 250','3일 뒤 비커')}
 if(no===4){if(ok('bAt'))S(bg({})+hotplate(true)+heatBeaker(LV4.start,8,{mark:1}),'250 150 360 310','끓을 때');if(ok('aH'))S(bg({})+hotplate(false)+heatBeaker(LV4.after,0,{mark:1}),'250 150 360 310','끓인 뒤')}
 if(no===5){S(bg({})+cupOnDish(480,BY,{wrap:1}),'330 190 300 270','처음');if(ok('outS'))S(bg({})+cupOnDish(480,BY,{wrap:1,dew:3,pool:1}),'330 190 300 270','10분 뒤')}
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
 if(!DB.cur||!EXPS[DB.cur]){H.classList.remove('lb-inrun');$('#lbSub').textContent='4학년 1학기 과학 · 2단원 물의 상태 변화';$('#lbChoose').hidden=true;$('#lbClearMi').hidden=true;
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
function actsOf(s){const r=R(),A=[],busy=!!UI.fx,st=r.st||{};
 const tc=(key,grp,en)=>{const c=st[key]||0,v=tView(key);TIMES[key].forEach((x,i)=>A.push({id:x[0],label:x[1],cell:1,grp,pressed:v===x[0],seen:!!r.seen[x[0]],dis:busy||i>c||en===false}))};
 switch(s.id){
  case 'water':seqActs(A,'wp',['wp1','wp2','wp3'],['접시에 물 조금 넣기','접시 살짝 기울이기','손가락으로 물 만지기'],busy);break;
  case 'watch':tc('e1','시간');A.push({id:'tiltI',label:'수조 속 접시 꺼내 기울이기',dis:busy||(st.e1||0)<3||!!r.seen.tiltI,pressed:!!r.seen.tiltI});break;
  case 'w1':seqActs(A,'sc',['sp','sz','sb'],['저울 전원 켜기','영점 맞추기','병 올려놓기'],busy);break;
  case 'freeze':seqActs(A,'fz',['fz1','fz2','fz3','fz4'],['소금 섞은 얼음 비커에 병 넣기','다 언 병 꺼내기','수건으로 물기 닦기','빨간색 펜으로 높이 표시'],busy);break;
  case 'w2':seqActs(A,'sc2',['s2z','s2b'],['영점 맞추기','병 올려놓기'],busy);break;
  case 'melt':seqActs(A,'ml',['ml1','ml2','ml3','ml4'],['따뜻한 물 비커에 병 넣기','다 녹은 병 꺼내기','수건으로 물기 닦기','파란색 펜으로 높이 표시'],busy);break;
  case 'w3':seqActs(A,'sc3',['s3z','s3b'],['영점 맞추기','병 올려놓기'],busy);break;
  case 'paper':tc('e3p','만져 보고 볼 때');break;
  case 'days':tc('e3d','표시할 때');A.push({id:'dz',label:'물속과 표면 가까이 보기',dis:busy||(st.e3d||0)<4||!!r.seen.dz,pressed:!!r.seen.dz});break;
  case 'heat':if(!st.on)A.push({id:'on',label:'핫플레이트 켜고 초시계 누르기',dis:busy});else if((st.e4||0)<4)A.push({id:'close',label:'얼굴 가까이 대고 보기',sub:1,dis:busy});tc('e4','초시계',!!st.on);break;
  case 'boil5':seqActs(A,'b5',['b51','b52','b53'],['5분 더 끓이기','핫플레이트 끄기','파란 선과 물 높이 견주기'],busy);break;
  case 'g0':seqActs(A,'g0s',['gp','gz','gb'],['저울 전원 켜기','영점 맞추기','접시째 올려놓기'],busy);break;
  case 'watch5':tc('e5','시간');break;
  case 'g1':seqActs(A,'g1s',['hz','hb'],['영점 맞추기','접시째 올려놓기'],busy);A.push({id:'wipe',label:'바깥 면 닦고 재기',sub:1,dis:busy});break}
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
function introPic(no,k){const n0=NAR,l0=LEG;NAR=true;LEG=[];let g=bg({}),vb='0 0 960 540';
 if(no===1){g=bgTop();
  if(k==='pour'){g+=dishTop(480,270,130,{freeze:0});vb='320 110 320 320'}
  if(k==='tank'){g+=iceBed()+dishTop(D1.cx,D1.cy,D1.r,{freeze:0,lid:1});vb='50 50 480 440'}
  if(k==='spray'){g+=dishTop(D2.cx,D2.cy,D2.r,{})+'<g transform="rotate(-24 '+(D2.cx+150)+' 150)">'+sprayer(D2.cx+150,150,1)+'</g>'+mist(D2.cx+90,150,false);vb='590 50 330 360'}
  if(k==='watch'){g+=dishTop(380,270,110,{freeze:0,lid:1})+dishTop(620,270,110,{})+clockArt(500,110,null,1.2);vb='250 50 500 360'}}
 if(no===2){if(k==='fill'){g+=bottle(480,BY,{fill:'water',lines:{k:[LCOL.k,LV.water]}})+pen(580,BY-LV.water+2,LCOL.k,-60);vb='330 160 330 300'}
  if(k==='weigh'){g+=escale(ES.x,{on:1,val:'0.0'})+bottleOnScale({fill:'water'});vb='360 60 400 400'}
  if(k==='freeze'){g+=bigBeaker(480,BY,{ice:1,inner:bottle(480,BY-14,{fill:'water'}).replace(/<ellipse[^>]*\/>/,'')});vb='300 120 360 340'}
  if(k==='melt'){g+=bigBeaker(480,BY,{warm:1,inner:bottle(480,BY-14,{fill:'water'}).replace(/<ellipse[^>]*\/>/,'')});vb='300 120 360 340'}}
 if(no===3){if(k==='draw'){g=bgTop()+wpaperArt({k:1})+brushArt(690,330,30);vb='130 50 700 440'}
  if(k==='touch'){g=bgTop()+wpaperArt({k:1})+hand(400,270,180,1.3,0);vb='130 50 700 440'}
  if(k==='beaker'){g=bg({win:430})+beaker2(BX3.cx,BY,{lvl:BX3.lv,sticker:1,marks:[[BX3.lv,DCOL.o,'']]});vb='400 30 340 440'}
  if(k==='days'){g=bg({win:430})+beaker2(BX3.cx,BY,{lvl:BX3.lv,sticker:1,marks:[[BX3.lv,DCOL.o,'']]})+pen(BX3.cx-60,BY-BX3.lv+2,DCOL.d1,-60);vb='400 30 340 440'}}
 if(no===4){if(k==='mark'){g+=hotplate(false)+heatBeaker(LV4.start,0,{mark:1})+pen(HP.x-60,HP.y-LV4.start+2,LCOL.b,-60);vb='200 120 460 340'}
  if(k==='heat'){g+=hotplate(true)+heatBeaker(LV4.start,0,{mark:1})+stopwatch(150,220,'0:00',true);vb='60 120 600 340'}
  if(k==='watch'){g+=hotplate(true)+heatBeaker(LV4.start,0,{mark:1});vb='300 120 260 340'}
  if(k==='after'){g+=hotplate(false)+heatBeaker(LV4.start,0,{mark:1});vb='200 120 460 340'}}
 if(no===5){if(k==='wrap'){g+=cupOnDish(480,BY,{wrap:1});vb='330 190 300 270'}
  if(k==='weigh'||k==='weigh2'){g+=escale(ES.x,{on:1,val:'0.0'})+cupOnDish(ES.x,330,{wrap:1});vb='360 60 400 400'}
  if(k==='watch'){g+=cupOnDish(480,BY,{wrap:1})+clockArt(260,180,null,1.1);vb='200 120 460 340'}}
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
function homeArt(no){NAR=true;LEG=[];let g='',vb='120 70 720 420';
 if(no===1){g=bgTop()+iceBed()+dishTop(D1.cx,D1.cy,D1.r,{freeze:0,lid:1})+dishTop(D2.cx,D2.cy,D2.r,{drops:1});vb='40 40 880 460'}
 if(no===2){g=bg({})+bottle(340,BY,{fill:'water',lines:{k:[LCOL.k,LV.water]}})+bigBeaker(640,BY,{ice:1});vb='180 120 660 360'}
 if(no===3){g=bgTop()+wpaperArt({k:1});vb='130 50 700 440'}
 if(no===4){g=bg({})+hotplate(true)+heatBeaker(LV4.start,0,{mark:1})+stopwatch(150,220,'0:00',true);vb='40 110 640 370'}
 if(no===5){g=bg({})+cupOnDish(480,BY,{wrap:1});vb='250 170 460 300'}
 const s=svg(g,'실험 '+no+' 처음 모습',vb);NAR=false;LEG=[];return s}
function homeHTML(){const card=k=>{const v=EXPS[k],r=DB.runs[k];const st=r?(r.fin?'끝냄 · 결과 보기':(r.step+1)+'단계부터 이어서'):'실험 시작하기';
 return '<section class="lb-exc" aria-labelledby="lbE'+v.no+'"><div class="lb-exc-art">'+homeArt(v.no)+'</div><div class="lb-exc-b"><h2 id="lbE'+v.no+'"><em>실험 '+v.no+'</em>'+esc(v.name)+'</h2><p class="lb-exp">'+esc(v.sub)+'</p><button type="button" class="lb-pickb" data-pick="'+k+'" data-f="k'+k+'"><i>'+ic(['','cube','bottle','sun','flame','drop'][v.no])+'</i><span><b>'+st+'</b><span>교과서 실험</span></span>'+(r&&r.fin?'<small>'+ic('check')+'</small>':'')+'</button></div></section>'};
 return '<div class="lb-home"><div class="lb-home-h"><div class="lb-kick"><em>4학년 1학기 과학</em>2. 물의 상태 변화</div><h1>무엇을 실험할까요?</h1><p>실험을 한 단계씩 직접 해 보고, 내 눈으로 본 것을 기록해요.</p></div>'+
 '<div class="lb-ex lb-ex5">'+['e1','e2','e3','e4','e5'].map(card).join('')+'</div>'+
 '<p class="lb-model">'+ic('info')+'<span>아주 단순하게 만든 모형이에요. 같은 조건이면 언제나 같은 결과가 나와요. 저울에 나오는 병과 비커의 무게는 교과서·지도서 예시 값이에요. 접시와 그림이 변하는 빠르기, 날마다 달라지는 물 높이, 가열할 때 변화가 나타나는 때, 얼음의 높이, 비커 바깥 면이 변하는 차례는 이 실험관에서 정한 값이에요. 실제로는 날씨와 기구에 따라 달라요.</span></p></div>'}
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
function doX(id){const r=R(),s=curStep(),st=r.st;if(UI.fx)return;
 const SUB={close:'물이 끓는 모습은 너무 가까이에서 보지 않아요. 조금 떨어져서 봐요.',wipe:'이번에는 바깥 면을 닦지 않고 그대로 재요. 바깥 면에 생긴 것까지 무게에 넣어 견줘요.'};
 if(SUB[id]){fx(id,900,()=>flash(SUB[id]));return}
 r.act[s.id]=1;if(idxOf('pred')>=0&&r.step>idxOf('pred'))r.obs=1;
 for(const key in TIMES){const L=TIMES[key],i=L.findIndex(x=>x[0]===id);if(i<0)continue;const c=st[key]||0;if(i>c)return;
  UI.mq.cur=id;st[key+'v']=id;fx(id,key==='e4'?800:1100,()=>{if(i===c)st[key]=c+1;r.seen[id]=1;
   if(key==='e4'&&st[key]>=L.length){if(!rowDone('bFirst'))r.pend.bFirst=1;if(!rowDone('bBoil'))r.pend.bBoil=1}});return}
 const seq=(key,ids,ms,after)=>{const i=ids.indexOf(id),c=st[key]||0;if(i<0||c!==i)return;UI.mq.cur=id;fx(id,Array.isArray(ms)?ms[i]:ms,()=>{st[key]=i+1;r.seen[id]=1;if(after)after(i)})};
 const pendAt=(row,last)=>i=>{if(i===last&&!rowDone(row))r.pend[row]=1};
 switch(id){
  case 'wp1':case 'wp2':case 'wp3':seq('wp',['wp1','wp2','wp3'],[1300,1700,1400]);return;
  case 'tiltI':UI.mq.cur=id;fx(id,1500,()=>{r.seen[id]=1});return;
  case 'sp':case 'sz':case 'sb':seq('sc',['sp','sz','sb'],[1000,1000,1300],pendAt('w1',2));return;
  case 'fz1':case 'fz2':case 'fz3':case 'fz4':seq('fz',['fz1','fz2','fz3','fz4'],[2600,1500,1700,1500]);return;
  case 's2z':case 's2b':seq('sc2',['s2z','s2b'],[1000,1300],pendAt('w2',1));return;
  case 'ml1':case 'ml2':case 'ml3':case 'ml4':seq('ml',['ml1','ml2','ml3','ml4'],[2600,1500,1700,1500]);return;
  case 's3z':case 's3b':seq('sc3',['s3z','s3b'],[1000,1300],pendAt('w3',1));return;
  case 'dz':UI.mq.cur='dz';fx(id,1100,()=>{r.seen.dz=1});return;
  case 'on':fx(id,1200,()=>{r.seen.on=1;st.on=1});return;
  case 'b51':case 'b52':case 'b53':seq('b5',['b51','b52','b53'],[2000,1300,1200]);return;
  case 'gp':case 'gz':case 'gb':seq('g0s',['gp','gz','gb'],[1000,1000,1300],pendAt('g0',2));return;
  case 'hz':case 'hb':seq('g1s',['hz','hb'],[1000,1300],pendAt('g1',1));return}}
/* 숫자 적기: 화면 숫자와 같은지만 알려 줌. 같은 값으로 다시 누르면 세지 않음 */
function tryKey(k,val){const r=R();if(r.last[k]===val)return -1;r.last[k]=val;r.tries[k]=(r.tries[k]||0)+1;return r.tries[k]}
function trial(row){const r=R(),R0=ROWS[row];if(!R0||R0.t!=='num'||!numOpen(row))return;const txt=String(UI.inp[row]||'').trim();
 if(!txt||!/^\d+(\.\d+)?$/.test(txt)){UI.fb[row]=[0,'숫자로 써요.'];render();return}
 if(txt===R0.v){r.rec[row]={ok:1,v:R0.v};delete r.pend[row];UI.inp[row]='';UI.mq.hl=false;UI.attn=false;UI.fb={};UI.fb[row]=[1,R0.dec?'잘 읽고 적었어요.':'잘 적었어요.'];save();render();const p=$('#lbFoot [data-act="next"]:not(:disabled)');if(p&&isDone(r.step))p.focus({preventScroll:true});return}
 const t=tryKey(row+':t',txt);
 if(t===-1){UI.fb[row]=[0,'숫자가 그대로예요. 다시 봐요.'];render();return}
 if(R0.dec&&txt.indexOf('.')<0&&+txt===Math.floor(+R0.v))UI.fb[row]=[0,'소수점 아래 첫째 자리까지 써요. 화면의 숫자를 그대로 써요.'];
 else if(R0.u==='분')UI.fb[row]=[0,t>=2?'초시계 칸을 1분부터 차례로 다시 눌러 봐요. 처음 보인 때를 찾아요.':'초시계 칸을 다시 눌러 봐요.'];
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
