/* 이 실험관에서 더 쓰는 아이콘 */
Object.assign(I,{spoon:'<path d="M4 19.5 13 10.5"/><ellipse cx="16.5" cy="7" rx="3.6" ry="4.6" transform="rotate(45 16.5 7)"/>',scl:'<rect x="3.5" y="13" width="17" height="7" rx="1.5"/><path d="M6 13l1-3h10l1 3M9 16.5h4"/>',beaker:'<path d="M6 4h12M7 4v14a2 2 0 002 2h6a2 2 0 002-2V4"/><path d="M7 12h10"/>',jar:'<rect x="5.5" y="7" width="13" height="14" rx="3"/><path d="M8 3.5h8v3.5H8zM5.5 13h13"/>',tomato:'<circle cx="12" cy="13.5" r="7"/><path d="M9 6.5l3 2 3-2M12 8.5V4"/>'});

/* ───────── 기록(이 기기에만) ───────── */
const KEY='hj-g5solution-v1';
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
/* 전자저울 장면. o.power: 첫 행동이 전원 켜기. 영점을 맞추기 전 화면은 '----' */
function scaleScene(key,ids,val,beside,onScale,o){o=o||{};const f=fid(),k=seqK(key,ids),P=o.pre||0,pw=!!o.power,zi=P+(pw?1:0),bi=ids.length-1;
 const on=pw?k>P:true,zero=k>zi,placed=k>bi;
 const v=placed?val:(zero||!pw)?'0.0':'----';
 let g=bg({})+escale(ES.x,{on,val:v,hl:UI.mq.hl&&placed,pw:pw&&f===ids[P],zp:f===ids[zi],item:placed?onScale:null,drop:f===ids[bi],press:pw&&f===ids[P]?'pw':f===ids[zi]?'zp':null});
 if(!placed)g+=typeof beside==='function'?beside(k,f):beside;
 return g}
function scaleSpot(){return [522,405,62,1.5,800,170]}

/* ───── 실험 1: 유리병 세 개 ───── */
const J1=[260,480,700],JN=['설탕','가루 바이타민','탄산 칼슘'],JG=[[PW,PWS],[VITC,VITS],['#F6F6F2','#C3C3BA']];
/* 유리병 i의 모습. ph: 0 넣기 전 · 1 가루를 넣음 · 2 흔든 직후 · 3 5분 뒤 */
function jarState(i,ph){const o={lv:2/3,label:JN[i]};
 if(ph===1){o.grains=JG[i][0];o.gst=JG[i][1]}
 if(ph>=2&&i===1){o.tint='#F5D547';o.op=.62}
 if(ph===2&&i===2){o.cloud=1}
 if(ph>=3&&i===2){o.cloud=.12;o.pile=4}
 return o}
function e1Scene(s){const r=R(),id=s.id,f=fid(),st=r.st;
 if(id==='gear')return bg({})+gearArt(has('gear'),fxOn('gear'));
 let g=bg({});
 if(id==='label'){const on=has('label');J1.forEach((x,i)=>{g+=glassJar(x,BY,{label:on?JN[i]:null,labelAnim:f==='label'})});if(!on)g+=sticker(860,350,'',0)+sticker(860,390,'',0)+pen(860,330,LCOL.k,30);return g}
 if(id==='water'){const on=has('water');J1.forEach((x,i)=>{g+=glassJar(x,BY,{label:JN[i],lv:on?2/3:0,rise:f==='water'})});return g}
 if(id==='pred'){J1.forEach((x,i)=>{g+=glassJar(x,BY,{label:JN[i],lv:2/3})});return g+qmark(480,120)}
 if(id==='spoon'){const ids=['s1','s2','s3'],k=seqK('sp',ids),fi=ids.indexOf(f);
  J1.forEach((x,i)=>{const done=i<k&&fi!==i;const o=jarState(0,0);o.label=JN[i];o.lv=2/3;if(done){o.grains=JG[i][0];o.gst=JG[i][1]}
   if(fi===i)o.inner=fallGrains(x,BY-100,BY-12,JG[i][0],JG[i][1],i+3);g+=glassJar(x,BY,o);
   if(fi===i)g+='<g'+an('lb-a-fade',0)+'>'+spoonArt(x+10,BY-200,30,JG[i][0],JG[i][1])+'</g>'});return g}
 if(id==='shake'){const ids=['lid','shk'],k=seqK('sh',ids),fi=ids.indexOf(f);
  J1.forEach((x,i)=>{const o=jarState(i,k>=2&&fi!==1?2:1);o.lid=k>=1;o.lidAnim=fi===0;
   if(fi===1){o.grains=null;o.cloud=i===2?.6:0;if(i===1){o.tint='#F5D547';o.op=.35}}
   const j=glassJar(x,BY,o);g+=fi===1?'<g'+an('lb-a-jig',i*.08)+'>'+j+'</g>':j});
  if(fi===1)g+='<g'+an('lb-a-fade',0)+'>'+hand(J1[0]-110,BY-90,0,1,1)+'</g>';
  if(k>=2&&fi!==1)g+=mini(480,150,'흔든 직후',22);
  return g}
 if(id==='wait'){const ids=['w5'],k=seqK('wt',ids),fi=ids.indexOf(f);
  J1.forEach((x,i)=>{const o=jarState(i,k>=1&&fi!==0?3:2);o.lid=1;g+=glassJar(x,BY,o)});
  g+='<g transform="translate(840 372) scale(.6)">'+stopwatch(0,0,fi===0?'02:30':k>=1?'05:00':'00:00',1)+'</g>';
  if(k>=1&&fi!==0)g+=mini(480,150,'5분 뒤',22);
  return g}
 return g}
function jarSpot(){const k=seqK('wt',['w5']);if(k<1||UI.fx)return null;return [J1[2],BY-18,34,2,818,192]}

/* ───── 실험 2: 각설탕 ───── */
const CUBE_ON_DISH=c=>dishArt(c,330,cubeArt(c,316,1.1));
function jar2(x,base,o){return glassJar(x,base,Object.assign({lv:.5,lid:1},o||{}))}
function e2Scene(s){const r=R(),id=s.id,f=fid();
 if(id==='gear')return bg({})+gearArt(has('gear'),fxOn('gear'));
 let g=bg({});
 if(id==='fill'){const on=has('fill');if(!on)return g+glassJar(420,BY,{})+'<rect x="560" y="410" width="96" height="22" rx="5" fill="#4F7FB0" stroke="#2D5582" stroke-width="2.5"/>'+waterJug(700,BY);
  return g+glassJar(420,BY,{lv:.5,rise:f==='fill',lid:1,lidAnim:f==='fill'})}
 if(id==='pred')return g+jar2(380,BY,{})+dishArt(600,BY,cubeArt(600,BY-14,1.1))+qmark(480,120);
 if(id==='w0')return scaleScene('sc',['sp','sz','sb'],'91.6',jar2(140,BY,{})+dishArt(275,BY,cubeArt(275,BY-14,1)),jar2(470,330,{noShadow:1})+CUBE_ON_DISH(610),{power:1});
 if(id==='drop'||id==='jig'){const ids=['d1','d2','d3'],k=id==='jig'?2+seqK('dq',['d3']):seqK('dp',['d1','d2']),fi=ids.indexOf(f);const X=420,B=BY,s=1.25;
  /* 각설탕 상태: 넣기 전 접시 위 → 바닥 → 작아짐 → 없어짐 */
  let inner='';const by=B-8;
  if(k===0)inner='';
  else if(fi===0)inner='<g'+an('lb-a-down',.2,'--from:-170px')+'>'+cubeArt(X,by,1.15)+'</g>';
  else if(k===1)inner=cubeArt(X,by,1.15);
  else if(fi===1)inner='<g'+an('lb-a-out',1.6,'animation-duration:1s')+'>'+cubeArt(X,by,1.15)+'</g><g'+an('lb-a-fade',1.6,'animation-duration:1s')+'>'+cubeArt(X,by,.7)+grains(X-46,X+46,by-10,by-2,'#FFFFFF','#B5A787',12,4,3)+'</g>'+haze(X,by-50,1);
  else if(k===2)inner=cubeArt(X,by,.7)+grains(X-46,X+46,by-10,by-2,'#FFFFFF','#B5A787',12,4,3)+haze(X,by-50,0);
  else if(fi===2)inner='<g'+an('lb-a-out',.9,'animation-duration:1s')+'>'+cubeArt(X,by,.55)+grains(X-46,X+46,by-10,by-2,'#FFFFFF','#B5A787',12,4,3)+'</g>';
  const jar=glassJar(X,B,{lv:.5,lid:k>=1,lidAnim:fi===0,s,inner});
  g+=fi===2?'<g'+an('lb-a-jig',0)+'>'+jar+'</g>':jar;
  g+=dishArt(700,BY,k===0?cubeArt(700,BY-14,1.1):'');
  if(fi===0)g+='<g'+an('lb-a-fade',0)+'>'+tweezArt(X+40,B-260,18,'')+'</g>';
  if(k===0)g+=tweezArt(780,BY-6,70,'');
  if(k>=3&&fi!==2)g+=mini(X,178,'다 녹은 뒤',22);
  return g}
 if(id==='w1')return scaleScene('sc1',['z1','b1'],'91.6',jar2(140,BY,{})+dishArt(275,BY,''),jar2(470,330,{noShadow:1})+dishArt(610,330,''));
 return g}
function cubeSpot(){const k=seqK('dp',['d1','d2']);if(k<2&&fid()!=='d2')return null;if(k>=3)return null;return [420,BY-30,40,1.9,650,235]}

/* ───── 실험 3: 비커 세 개 ───── */
const B3=[260,480,700],BN3=['설탕','소금','백반'],BG3=[[PW,PWS],['#FBFBFB','#AEB8C0'],['#F4F8FB','#9FB4C4']];
function left3(i,n){if(i===0)return 0;const L=MODEL.lim[i];return n>=L?n-L+1:0}
function e3Scene(s){const r=R(),id=s.id,f=fid(),st=r.st;
 if(id==='gear')return bg({})+gearArt(has('gear'),fxOn('gear'));
 let g=bg({});
 if(id==='label'){const on=has('label');B3.forEach((x,i)=>{g+=beakerArt(x,BY,{label:on?BN3[i]:null,labelAnim:f==='label'})});if(!on)g+=sticker(820,350,'',0)+sticker(820,390,'',0)+pen(820,330,LCOL.k,30);return g}
 if(id==='water'){const on=has('water'),a=f==='water';B3.forEach((x,i)=>{g+=beakerArt(x,BY,{label:BN3[i],ml:on?50:0,rise:a})});
  if(!on)g+=cylArt(820,BY,100);if(a)g+=pourCyl(800,BY-210,-40,1);if(on)g+=mini(480,200,'물 50 mL · 약 20 ℃',20);return g}
 if(id==='pred'){B3.forEach((x,i)=>{g+=beakerArt(x,BY,{label:BN3[i],ml:50})});return g+qmark(480,215)}
 if(id==='add'){const n=st.n||[0,0,0];const fi=['aG','aS','aA'].indexOf(f);
  B3.forEach((x,i)=>{const now=fi===i;g+=beakerArt(x,BY,{label:BN3[i],ml:50,cnt:n[i]?n[i]+'숟가락':'물 50 mL',pile:left3(i,now?n[i]-1:n[i]),fall:now?BG3[i][0]:null,fst:BG3[i][1],stir:now,rod:now});
   if(now)g+='<g'+an('lb-a-fade',0)+'>'+spoonArt(x-30,BY-196,-20,BG3[i][0],BG3[i][1])+'</g>'});
  return g}
 return g}

/* ───── 실험 4: 차가운 물 · 따뜻한 물 ───── */
const B4=[330,630];
function e4Beakers(o){o=o||{};let g='';B4.forEach((x,i)=>{const warm=i===1;g+=beakerArt(x,BY,Object.assign({ml:o.ml==null?50:o.ml,rise:o.rise,steam:warm&&o.ml!==0},o.each?o.each(i):{}));
  if(o.ml!==0)g+=mini(x,BY-205,warm?'따뜻한 물 40~50 ℃':'차가운 물 10 ℃ 이하',19)});return g}
function e4Scene(s){const r=R(),id=s.id,f=fid(),st=r.st;
 if(id==='gear')return bg({})+gearArt(has('gear'),fxOn('gear'));
 let g=bg({});
 if(id==='plan')return g+B4.map(x=>beakerArt(x,BY,{})).join('')+cylArt(780,BY,0)+heap(200,BY,'#F4F8FB','#A9BCCB',1);
 if(id==='water'){const on=has('water'),a=f==='water';if(!on)return g+e4Beakers({ml:0})+cylArt(780,BY,100);return g+e4Beakers({rise:a})+(a?pourCyl(760,BY-210,-40,1):'')}
 if(id==='pred')return g+e4Beakers({})+heap(780,BY,'#F4F8FB','#A9BCCB',1)+qmark(480,190);
 if(id==='add'){const on=has('add'),a=f==='add';return g+e4Beakers({each:()=>({pile:on&&!a?MODEL.cold[0]:0,fall:a?'#F4F8FB':null,fst:'#9FB4C4'})})+(a?'<g'+an('lb-a-fade',0)+'>'+spoonArt(B4[0]-30,BY-196,-20,'#F4F8FB','#9FB4C4')+spoonArt(B4[1]-30,BY-196,-20,'#F4F8FB','#9FB4C4')+'</g>':'')}
 if(id==='stir'){const k=Math.min(2,seqK('st',['r1','r2'])),fi=['r1','r2'].indexOf(f),now=fi>=0,extra=f==='r3';
  const prevK=now?fi:k;
  return g+e4Beakers({each:i=>{const stirring=now||(extra&&i===0);const kk=stirring&&now?prevK:k;return {pile:(i?MODEL.warm:MODEL.cold)[kk],stir:stirring,rod:stirring}}})+(k>=1&&!now&&!extra?mini(480,190,(r.seen.r3?'더 오래 저은 뒤':k>=2?'두 번 저은 뒤':'한 번 저은 뒤'),22):'')}
 if(id==='more'){const go=f==='cool',dn=go||!!UI.mq.both||r.more.a!=null;const X=480;
  const crys=dn?'<g'+(go?an('lb-a-fade',1.2,'animation-duration:1.4s'):'')+'>'+moruCrys(X,BY-60,16)+crystalsBottom(X,BY-6,46,18)+'</g>':'';
  g+=beakerArt(X,BY,{ml:80,steam:!dn,inner:moruArt(X,BY-60)+crys});
  g+='<path d="M'+X+' '+(BY-212)+' V'+(BY-120)+'" stroke="#8A8F96" stroke-width="2"/><path d="M'+(X-100)+' '+(BY-212)+' H'+(X+100)+'" stroke="#9A7A50" stroke-width="8" stroke-linecap="round"/>';
  g+=mini(X+190,BY-160,dn&&!go?'약 20 ℃':go?'식히는 중':'약 50 ℃',20);
  return g}
 return g}
function stirSpot(){const k=seqK('st',['r1','r2']);if(k<2||UI.fx)return null;return [B4[0],BY-10,40,1.8,480,330]}

/* ───── 실험 5: 황설탕 ───── */
const B5=[330,630];
function ycol(n){return mixc('#EAF6FB','#A8641C',Math.min(1,n/14))}
function e5Beakers(o){o=o||{};let g='';const n=o.n||[0,0];B5.forEach((x,i)=>{g+=beakerArt(x,BY,Object.assign({big:1,ml:o.ml==null?150:o.ml,rise:o.rise,label:'비커 '+(i+1),tint:n[i]?ycol(n[i]):null,op:n[i]?.92:.8},o.each?o.each(i):{}));
  if(o.cnt&&n[i])g+=mini(x,BY-240,'황설탕 '+n[i]+'숟가락',19)});return g}
function filmArt(x,base,thick){/* 기울였다 세운 뒤 비커 벽에 남은 용액(정한 모습) */
 const top=base-206,y0=base-150*.8;if(!thick)return '<path d="M'+(x-75)+' '+(y0-34)+' q3 18 0 32" stroke="'+ycol(2)+'" stroke-width="2" fill="none" opacity=".7"/>';
 const c=ycol(10);return '<path d="M'+(x-75)+' '+(y0-70)+' q5 30 2 70 h10 q4 -30 -2 -70z" fill="'+c+'" opacity=".85"/><path d="M'+(x-58)+' '+(y0-52)+' v50 q4 6 8 0 v-50z" fill="'+c+'" opacity=".75"/><circle cx="'+(x-54)+'" cy="'+(y0-1)+'" r="5" fill="'+c+'"/>'}
function e5Scene(s){const r=R(),id=s.id,f=fid(),st=r.st;
 if(id==='gear')return bg({})+gearArt(has('gear'),fxOn('gear'));
 let g=bg({});
 if(id==='water'){const on=has('water'),a=f==='water';if(!on)return g+e5Beakers({ml:0})+cylArt(745,BY,100);return g+e5Beakers({rise:a})+(a?pourCyl(735,BY-240,-40,1):'')}
 if(id==='pred')return g+e5Beakers({})+heap(752,BY,YSC,YSS)+qmark(480,200);
 const add=seqK('ad',['y1','y2']),fa=['y1','y2'].indexOf(f);
 const n=[add>=1&&fa!==0?MODEL.ys[0]:0,add>=2&&fa!==1?MODEL.ys[1]:0];
 if(id==='add')return g+e5Beakers({n,cnt:1,each:i=>fa===i?{fall:YSC,fst:YSS,stir:1,rod:1}:{}})+(fa>=0?'<g'+an('lb-a-fade',0)+'>'+spoonArt(B5[fa]-30,BY-250,-20,YSC,YSS)+'</g>':'');
 const N=MODEL.ys;
 if(id==='paper'){const on=seqK('pp',['wp'])>=1;return g+(on?paperBack(232,150,496,272,f==='wp'):'')+e5Beakers({n:N,cnt:1})}
 if(id==='tilt'){const k=seqK('tl',['tt']),go=f==='tt';let b='';
  B5.forEach((x,i)=>{const one=beakerArt(x,BY,{big:1,ml:150,label:'비커 '+(i+1),tint:ycol(N[i]),op:.92,film:k>=1&&!go?filmArt(x,BY,i===1):''});b+=go?'<g'+an('lb-a-tip',0,'--rot:-24deg')+'>'+one+'</g>':one});
  return g+paperBack(232,150,496,272,0)+b+(k>=1&&!go?mini(480,170,'기울였다가 세운 뒤',20):'')}
 return g}
function tiltSpot(){const k=seqK('tl',['tt']);if(k<1||UI.fx)return null;return null}

/* ───── 실험 6: 백설탕과 방울토마토 ───── */
const B6=[330,630],BN6=['비커 ㉮','비커 ㉯'];
function e6Beakers(o){o=o||{};let g='';B6.forEach((x,i)=>{g+=beakerArt(x,BY,Object.assign({big:1,ml:o.ml==null?150:o.ml,rise:o.rise,label:BN6[i],tint:'#E4F2FA',op:.85},o.each?o.each(i):{}));
  if(o.cnt&&o.cnt[i])g+=mini(x,BY-240,'백설탕 '+o.cnt[i]+'숟가락',19)});return g}
function e6Scene(s){const r=R(),id=s.id,f=fid(),st=r.st;
 if(id==='gear')return bg({})+gearArt(has('gear'),fxOn('gear'));
 let g=bg({});
 if(id==='water'){const on=has('water'),a=f==='water';if(!on)return g+e6Beakers({ml:0})+cylArt(745,BY,100);return g+e6Beakers({rise:a})+(a?pourCyl(735,BY-240,-40,1):'')}
 const add=seqK('wa',['b1','b2']),fa=['b1','b2'].indexOf(f),W=MODEL.ws;
 if(id==='add'){const c=[add>=1&&fa!==0?W[0]:0,add>=2&&fa!==1?W[1]:0];return g+e6Beakers({cnt:c,each:i=>fa===i?{fall:PW,fst:PWS,stir:1,rod:1}:{}})+(fa>=0?'<g'+an('lb-a-fade',0)+'>'+spoonArt(B6[fa]-30,BY-250,-20,PW,PWS)+'</g>':'')}
 if(id==='pred')return g+e6Beakers({cnt:W})+tomatoArt(752,BY-22,22)+tomatoArt(800,BY-20,22)+qmark(480,200);
 if(id==='drop'){const k=seqK('tm',['t1','t2']),ft=['t1','t2'].indexOf(f);
  g+=e6Beakers({cnt:W,each:i=>(i<k&&ft!==i)||ft===i?{tom:tomLevel(W[i]),tomAnim:ft===i}:{}});
  if(ft>=0)g+='<g'+an('lb-a-fade',0)+'>'+tweezArt(B6[ft]+40,BY-250,18,'')+'</g>';
  if(k<2)g+=tomatoArt(752,BY-22,22)+(k<1?tomatoArt(800,BY-20,22):'');
  return g}
 if(id==='more'){const go=f==='m6',dn=go||!!UI.mq.both||r.more.a!=null;const a=W[0]+(dn?MODEL.more6:0),hiLo=(BY-28)-(BY-120+22*.3);
  return g+e6Beakers({cnt:[a,W[1]],each:i=>i===0?{tom:tomLevel(a),tomFrom:go?(tomLevel(a)-tomLevel(W[0]))*hiLo:null,fall:go?PW:null,fst:PWS,stir:go,rod:go}:{tom:tomLevel(W[1])}})+(go?'<g'+an('lb-a-fade',0)+'>'+spoonArt(B6[0]-30,BY-250,-20,PW,PWS)+'</g>':'')}
 return g}

function sceneSVG(){const v=V(),r=R(),s=curStep(),id=s.id,no=v.no;
 const T=(g,l,vb)=>svg(g+lensOf(s,g),l||s.t,vb);
 if(id==='tools'){if(!(r.done.tools||fxOn('tools')))return T(bg({})+boxArt(480),'준비물 상자');return T(bg({})+toolsScene(v.tools,fxOn('tools')),'준비물: '+v.tools.map(x=>x[1]).join(', '),v.tools.length>8?'0 10 960 600':null)}
 const F={1:e1Scene,2:e2Scene,3:e3Scene,4:e4Scene,5:e5Scene,6:e6Scene}[no];
 const VB={1:'150 100 750 360',2:'40 20 900 470',3:'170 160 700 300',4:'150 150 680 310',5:'200 136 620 334',6:'200 136 640 334'}[no];
 return T(F(s),s.t,id==='gear'?'160 40 640 420':no===2&&(id==='drop'||id==='jig')?'250 140 560 330':VB)}


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
const MOREQ={4:['용액을 식힌 뒤 철끈과 비커 바닥은?',['하얀 알갱이가 생겼어요','아무 변화가 없어요'],0,'온도가 낮아지면서 녹아 있던 백반이 더 이상 녹아 있지 못하고 바닥에 가라앉거나 철끈에 달라붙어 결정이 커졌어요. 물의 온도에 따라 용해되는 양이 다르기 때문이에요.'],
 6:['백설탕을 더 녹인 비커 ㉮의 방울토마토는?',['조금 떠올랐어요','더 내려갔어요','그대로예요'],0,'백설탕을 더 녹이면 비커 ㉮의 용액이 더 진해져서 방울토마토가 떠올라요.']};
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
 let h='<article class="lb-sheet lb-sh-e'+v.no+'" id="lbSheet" aria-label="실험 결과 한 장"><div class="lb-sh-in"><header class="lb-sh-h"><div><h2>실험 결과 한 장 · '+esc(v.title)+'</h2><span>탐구 실험관 · 5학년 1학기 과학 · 3. 용해와 용액 · '+ds+'</span></div><div class="lb-sh-name">이름 <u>'+(esc(DB.name)||'&nbsp;')+'</u></div></header><div class="lb-sh-grid"><div class="lb-sh-col">';
 h+='<section class="lb-sh-sec"><h3><i></i>실험 문제</h3><p><b>'+esc(v.q)+'</b></p>'+planSummary(v,r)+'</section>';
 h+='<section class="lb-sh-sec lb-sh-po"><h3><i></i>실험한 차례</h3><div class="lb-sh-steps">'+done.map((s,i)=>'<div><b>'+(i+1)+'.</b> '+esc(s.t)+'</div>').join('')+'</div></section>';
 h+='<section class="lb-sh-sec"><h3><i></i>내 예상</h3><p>'+v.pred.map((q,j)=>(v.pred.length>1?esc(q.q)+' ':'')+(r.pred[j]!=null?esc(q.o[r.pred[j]]):'(고르지 않았어요)')).join('<br>')+(r.why?'<br>까닭: '+esc(r.why):'')+'</p></section>';
 h+='</div><div class="lb-sh-col"><section class="lb-sh-sec"><h3><i></i>관찰 기록</h3>'+sheetTable(v,r)+barChart(v,r)+'</section>';
 /* 실험 1은 관찰 기록 줄이 일곱이라 결론을 아래 한 줄 전체로(오른쪽 칸만 길어져 2쪽이 되던 것, 독립 검토 고침) */
 const cs='<section class="lb-sh-sec'+(v.no===1?' lb-sh-wide':'')+'"><h3><i></i>내 결론</h3><div class="lb-sh-box"><p class="lb-sh-concl">'+frameHTML(v,r.bl,'sheet')+'</p>'+(r.cmp?'<p class="lb-sh-book">교과서 결론: '+esc(v.book)+'</p>':'')+'</div></section>';
 h+=(v.no===1?'':cs)+'</div></div>'+(v.no===1?cs:'')+picsHTML(snapList(v,r))+'<section class="lb-sh-sec lb-sh-po lb-sh-fill"><h3><i></i>새로 알게 된 것 · 더 알고 싶은 것</h3><div class="lb-sh-lines">'+'<div class="lb-ln"></div>'.repeat(9)+'</div></section>';
 h+='<footer class="lb-sh-f"><span>아주 단순하게 만든 모형의 결과예요. 실제 교실에서는 결과가 조금 다를 수 있어요.</span><span>만든 사람: 초등교사 홍지희</span></footer></div></article>';
 return h}
const LABNAME='solution';
function snapsOf(v,r){const L=[],no=v.no,S=(g,vb,cap)=>L.push([svg(g,cap,vb),cap]);const ok=k=>rowDone(k);
 const jars=ph=>{let g=bg({});J1.forEach((x,i)=>{const o=jarState(i,ph);o.lid=1;g+=glassJar(x,BY,o)});return g};
 if(no===1){if(ok('just'))S(jars(2),'170 240 620 220','흔든 직후');if(ok('w5s'))S(jars(3),'170 240 620 220','5분 뒤')}
 if(no===2){if(ok('m0'))S(bg({})+escale(ES.x,{on:1,val:'91.6',item:jar2(470,330,{noShadow:1})+CUBE_ON_DISH(610)}),'370 140 380 310','용해되기 전');
  if(ok('m1'))S(bg({})+escale(ES.x,{on:1,val:'91.6',item:jar2(470,330,{noShadow:1})+dishArt(610,330,'')}),'370 140 380 310','용해된 후')}
 if(no===3){const n=r.st.n||[0,0,0];if(ok('lA')||ok('lS')||ok('lG')){let g=bg({});B3.forEach((x,i)=>{g+=beakerArt(x,BY,{label:BN3[i],ml:50,cnt:n[i]+'숟가락',pile:left3(i,n[i])})});S(g,'170 240 620 220','넣고 저은 뒤')}}
 if(no===4){if(ok('s2'))S(bg({})+e4Beakers({each:i=>({pile:(i?MODEL.warm:MODEL.cold)[2]})}),'190 205 580 255','두 번 저은 뒤')}
 if(no===5){if(ok('ycol'))S(bg({})+paperBack(232,150,496,272,0)+e5Beakers({n:MODEL.ys,cnt:1}),'210 130 540 330','흰 종이를 대고 본 모습')}
 if(no===6){if(ok('tom'))S(bg({})+e6Beakers({cnt:MODEL.ws,each:i=>({tom:tomLevel(MODEL.ws[i])})}),'220 175 520 285','방울토마토를 넣은 뒤')}
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
 if(!DB.cur||!EXPS[DB.cur]){H.classList.remove('lb-inrun');$('#lbSub').textContent='5학년 1학기 과학 · 3단원 용해와 용액';$('#lbChoose').hidden=true;$('#lbClearMi').hidden=true;
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
function actsOf(s){const r=R(),A=[],busy=!!UI.fx,no=V().no,st=r.st||{};
 switch(s.id){
  case 'spoon':seqActs(A,'sp',['s1','s2','s3'],['설탕 한 숟가락 넣기','가루 바이타민 한 숟가락 넣기','탄산 칼슘 한 숟가락 넣기'],busy);break;
  case 'shake':seqActs(A,'sh',['lid','shk'],['뚜껑 닫기','유리병 흔들기'],busy);break;
  case 'wait':seqActs(A,'wt',['w5'],['내려놓고 5분 기다리기'],busy);break;
  case 'w0':seqActs(A,'sc',['sp','sz','sb'],['저울 전원 켜기','영점 맞추기','유리병과 접시 올려놓기'],busy);break;
  case 'jig':seqActs(A,'dq',['d3'],['뚜껑 닫고 천천히 흔들기'],busy);break;
  case 'drop':if(no===2)seqActs(A,'dp',['d1','d2'],['핀셋으로 각설탕 넣고 뚜껑 닫기','가까이에서 지켜보기'],busy);
   else seqActs(A,'tm',['t1','t2'],['비커 ㉮에 방울토마토 넣기','비커 ㉯에 방울토마토 넣기'],busy);break;
  case 'w1':seqActs(A,'sc1',['z1','b1'],['영점 확인하기','유리병과 빈 접시 올려놓기'],busy);break;
  case 'add':if(no===3){const n=st.n||[0,0,0];['aG','aS','aA'].forEach((id,i)=>{const end=n[i]>=MODEL.lim[i];A.push({id,label:end?BN3[i]+': 더 넣지 않아요':BN3[i]+' 한 숟가락 넣고 젓기',dis:busy||end})})}
   else if(no===5)seqActs(A,'ad',['y1','y2'],['비커 1에 두 숟가락 넣고 젓기','비커 2에 열 숟가락 넣고 젓기'],busy);
   else if(no===6)seqActs(A,'wa',['b1','b2'],['비커 ㉮에 다섯 숟가락 녹이기','비커 ㉯에 열다섯 숟가락 녹이기'],busy);break;
  case 'stir':seqActs(A,'st',['r1','r2'],['유리 막대로 두 비커 젓기','두 비커를 한 번 더 젓기'],busy);if((st.st||0)>=2)A.push({id:'r3',label:'차가운 물을 더 오래 젓기',dis:busy,pressed:!!r.seen.r3});break;
  case 'paper':seqActs(A,'pp',['wp'],['비커 뒤에 흰 종이 대기'],busy);break;
  case 'tilt':seqActs(A,'tl',['tt'],['두 비커를 살짝 기울이기'],busy);break;
  case 'more':A.push(no===4?{id:'cool',label:'용액을 천천히 식히기',dis:busy}:{id:'m6',label:'비커 ㉮에 백설탕 더 녹이기',dis:busy});break}
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
 if(no===1){if(k==='label'){g+=glassJar(400,BY,{label:'설탕'})+glassJar(560,BY,{label:''})+pen(660,330,LCOL.k,30);vb='310 230 400 230'}
  if(k==='water'){g+=glassJar(480,BY,{label:'설탕',lv:2/3});vb='370 240 220 220'}
  if(k==='spoon'){g+=glassJar(480,BY,{lv:2/3})+spoonArt(500,BY-196,30,PW,PWS);vb='370 190 240 270'}
  if(k==='shake'){g+=glassJar(440,BY,{lv:2/3,lid:1})+'<g transform="translate(600 330) scale(.6)">'+stopwatch(0,0,'05:00',1)+'</g>';vb='350 220 330 240'}}
 if(no===2){if(k==='fill'){g+=glassJar(480,BY,{lv:.5,lid:1});vb='380 240 200 220'}
  if(k==='weigh'){g+=escale(ES.x,{item:jar2(470,330,{noShadow:1})+CUBE_ON_DISH(610)});vb='360 140 400 320'}
  if(k==='drop'){g+=glassJar(470,BY,{lv:.5})+tweezArt(500,BY-176,18,'')+cubeArt(500,BY-170,.7);vb='370 150 230 310'}
  if(k==='weigh2'){g+=escale(ES.x,{item:jar2(470,330,{noShadow:1})+dishArt(610,330,'')});vb='360 140 400 320'}}
 if(no===3){if(k==='label'){g+=beakerArt(400,BY,{label:'설탕'})+beakerArt(560,BY,{label:''});vb='310 260 340 200'}
  if(k==='cyl'){g+=beakerArt(420,BY,{ml:50})+cylArt(560,BY,100);vb='330 180 300 280'}
  if(k==='add'){g+=beakerArt(480,BY,{ml:50,label:'설탕',rod:1})+spoonArt(450,BY-196,-20,PW,PWS);vb='370 170 240 290'}
  if(k==='stop'){g+=beakerArt(480,BY,{ml:50,pile:1});vb='390 260 180 200'}}
 if(no===4){if(k==='water'){g+=e4Beakers({});vb='200 200 560 260'}
  if(k==='add'){g+=e4Beakers({})+spoonArt(B4[0]-30,BY-196,-20,'#F4F8FB','#9FB4C4')+spoonArt(B4[1]-30,BY-196,-20,'#F4F8FB','#9FB4C4');vb='200 200 560 260'}
  if(k==='stir'){g+=e4Beakers({each:()=>({rod:1})});vb='200 180 560 280'}}
 if(no===5){const bk=o=>e5Beakers(o||{});if(k==='water'){g+=bk();vb='230 210 500 250'}
  if(k==='add'){g+=bk()+spoonArt(B5[0]-30,BY-250,-20,YSC,YSS);vb='230 160 500 300'}
  if(k==='paper'){g+=paperBack(232,150,496,272,0)+bk();vb='210 130 540 330'}
  if(k==='tilt'){g+='<g transform="rotate(-14 408 436)">'+beakerArt(330,BY,{big:1,ml:150,label:'비커 1'})+'</g>'+'<g transform="rotate(-14 708 436)">'+beakerArt(630,BY,{big:1,ml:150,label:'비커 2'})+'</g>';vb='200 150 560 310'}}
 if(no===6){const bk=()=>e6Beakers({});if(k==='water'){g+=bk();vb='230 210 500 250'}
  if(k==='add'){g+=bk()+spoonArt(B6[0]-30,BY-250,-20,PW,PWS);vb='230 160 500 300'}
  if(k==='drop'){g+=bk()+tweezArt(B6[0]+40,BY-250,18,'')+tomatoArt(B6[0]+8,BY-250,16);vb='230 150 500 310'}
  if(k==='eye'){g+=bk()+eyeArt(160,BY-110);vb='110 210 620 250'}}
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
 if(no===1){J1.forEach((x,i)=>{g+=glassJar(x,BY,{label:JN[i],lv:2/3})});vb='170 230 620 240'}
 if(no===2){g+=escale(ES.x,{item:jar2(470,330,{noShadow:1})+CUBE_ON_DISH(610)});vb='340 130 440 330'}
 if(no===3){B3.forEach((x,i)=>{g+=beakerArt(x,BY,{label:BN3[i],ml:50})});vb='170 260 620 210'}
 if(no===4){g+=e4Beakers({});vb='200 200 560 260'}
 if(no===5){g+=e5Beakers({})+heap(820,BY,YSC,YSS);vb='230 210 640 250'}
 if(no===6){g+=e6Beakers({})+tomatoArt(850,BY-20,20);vb='230 210 660 250'}
 const s=svg(g,'실험 '+no+' 처음 모습',vb);NAR=false;LEG=[];return s}
function homeHTML(){const card=k=>{const v=EXPS[k],r=DB.runs[k];const st=r?(r.fin?'끝냄 · 결과 보기':(r.step+1)+'단계부터 이어서'):'실험 시작하기';
 return '<section class="lb-exc" aria-labelledby="lbE'+v.no+'"><div class="lb-exc-art">'+homeArt(v.no)+'</div><div class="lb-exc-b"><h2 id="lbE'+v.no+'"><em>실험 '+v.no+'</em>'+esc(v.name)+'</h2><p class="lb-exp">'+esc(v.sub)+'</p><button type="button" class="lb-pickb" data-pick="'+k+'" data-f="k'+k+'"><i>'+ic(['','jar','scl','beaker','thermo','beaker','tomato'][v.no])+'</i><span><b>'+st+'</b><span>교과서 실험</span></span>'+(r&&r.fin?'<small>'+ic('check')+'</small>':'')+'</button></div></section>'};
 return '<div class="lb-home"><div class="lb-home-h"><div class="lb-kick"><em>5학년 1학기 과학</em>3. 용해와 용액</div><h1>무엇을 실험할까요?</h1><p>실험을 한 단계씩 직접 해 보고, 내 눈으로 본 것을 기록해요.</p></div>'+
 '<div class="lb-ex lb-ex5 lb-ex6">'+['e1','e2','e3','e4','e5','e6'].map(card).join('')+'</div>'+
 '<p class="lb-model">'+ic('info')+'<span>아주 단순하게 만든 모형이에요. 같은 조건이면 언제나 같은 결과가 나와요. 저울의 무게(91.6 g), 소금과 백반이 바닥에 남는 숟가락 수, 넣는 숟가락 수는 교과서 버전 앱의 예시 값이에요. 바닥에 남은 가루의 크기, 방울토마토가 뜨는 높이, 용액이 비커 벽에 남는 모습, 백반 알갱이의 모습은 이 실험관에서 정한 모습이에요. 실제 실험에서는 내가 관찰한 결과를 그대로 써요.</span></p></div>'}
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
 if(id==='cool'||id==='m6'){UI.mq.cur=id;fx(id,id==='cool'?3000:2600,()=>{r.seen[id]=1;UI.mq[id]=1;UI.mq.both=1});return}
 r.act[s.id]=1;if(idxOf('pred')>=0&&r.step>idxOf('pred'))r.obs=1;
 const seq=(key,ids,ms,after)=>{const i=ids.indexOf(id),c=st[key]||0;if(i<0||c!==i)return;UI.mq.cur=id;fx(id,Array.isArray(ms)?ms[i]:ms,()=>{st[key]=i+1;r.seen[id]=1;if(after)after(i)})};
 const pendAt=(row,last)=>i=>{if(i===last&&!rowDone(row))r.pend[row]=1};
 switch(s.id){
  case 'spoon':seq('sp',['s1','s2','s3'],1300);return;
  case 'shake':seq('sh',['lid','shk'],[1100,2000]);return;
  case 'wait':seq('wt',['w5'],2200);return;
  case 'w0':seq('sc',['sp','sz','sb'],[1000,1000,1300],pendAt('m0',2));return;
  case 'jig':seq('dq',['d3'],2200);return;
  case 'drop':if(no===2)seq('dp',['d1','d2'],[1700,3000]);else seq('tm',['t1','t2'],[1500,1500]);return;
  case 'w1':seq('sc1',['z1','b1'],[1000,1300],pendAt('m1',1));return;
  case 'add':if(no===3){const i=['aG','aS','aA'].indexOf(id);if(i<0)return;st.n=st.n||[0,0,0];if(st.n[i]>=MODEL.lim[i])return;st.n[i]++;UI.mq.cur=id;
    fx(id,1200,()=>{r.seen[id]=1;if(st.n[i]>=MODEL.lim[i]){if(i===0)r.seen.gD=1;else{const row=i===1?'lS':'lA';if(!rowDone(row))r.pend[row]=1}}});return}
   if(no===5)seq('ad',['y1','y2'],1500);else seq('wa',['b1','b2'],1500);return;
  case 'stir':if(id==='r3'){if((st.st||0)<2)return;UI.mq.cur=id;fx(id,1600,()=>{r.seen.r3=1});return}seq('st',['r1','r2'],1500);return;
  case 'paper':seq('pp',['wp'],1200);return;
  case 'tilt':seq('tl',['tt'],2400);return}}
/* 숫자 적기: 화면 숫자와 같은지만 알려 줌. 같은 값으로 다시 누르면 세지 않음 */
function tryKey(k,val){const r=R();if(r.last[k]===val)return -1;r.last[k]=val;r.tries[k]=(r.tries[k]||0)+1;return r.tries[k]}
function trial(row){const r=R(),R0=ROWS[row];if(!R0||R0.t!=='num'||!numOpen(row))return;const txt=String(UI.inp[row]||'').trim();
 if(!txt||!/^\d+(\.\d+)?$/.test(txt)){UI.fb[row]=[0,'숫자로 써요.'];render();return}
 if(txt===R0.v){r.rec[row]={ok:1,v:R0.v};delete r.pend[row];UI.inp[row]='';UI.mq.hl=false;UI.attn=false;UI.fb={};UI.fb[row]=[1,R0.dec?'잘 읽고 적었어요.':'잘 적었어요.'];save();render();const p=$('#lbFoot [data-act="next"]:not(:disabled)');if(p&&isDone(r.step))p.focus({preventScroll:true});return}
 const t=tryKey(row+':t',txt);
 if(t===-1){UI.fb[row]=[0,'숫자가 그대로예요. 다시 봐요.'];render();return}
 if(R0.dec&&txt.indexOf('.')<0&&+txt===Math.floor(+R0.v))UI.fb[row]=[0,'소수점 아래 첫째 자리까지 써요. 화면의 숫자를 그대로 써요.'];
 else if(R0.u==='숟가락째')UI.fb[row]=[0,t>=2?'비커 위에 적힌 숟가락 수를 봐요. 그 숟가락을 넣었을 때 처음으로 바닥에 남았어요.':'비커 위에 적힌 숟가락 수를 다시 봐요.'];
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
