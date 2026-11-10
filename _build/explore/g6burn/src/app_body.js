/* 이 실험관에서 더 쓰는 아이콘 */
Object.assign(I,{fire:'<path d="M12 21c-3.9 0-6.5-2.7-6.5-6.2 0-3.6 3-5.6 3.7-9.3 2.6 1.6 4.2 4 4.3 6.6 1-.8 1.6-2 1.7-3.3 2.2 1.8 3.3 4.1 3.3 6.1 0 3.5-2.6 6.1-6.5 6.1z"/>',beaker:'<path d="M6 4h12M7 4v14a2 2 0 002 2h6a2 2 0 002-2V4"/><path d="M7 12h10"/>',balloon:'<ellipse cx="12" cy="9.5" rx="6" ry="7"/><path d="M12 16.5l-1.2 2h2.4zM12 18.5c0 1.5-1.5 2-1 3"/>'});

/* ───────── 기록(이 기기에만) ───────── */
const KEY='hj-g6burn-v1';
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

/* ───── 실험 1: 삼각 플라스크와 고무풍선 ───── */
function e1Set(o){o=o||{};let g='';
 [0,1].forEach(k=>{const x=FX1[k],bx=x+(k?132:-132);
  if(o.mode==='table'){g+=shadow(x,BY+3,74)+TR(x,BY,1,flaskBody())+(o.filling===k?fillBalloon(bx,BY,k):balloonLie(bx,BY,k,o.fill&&o.fill[k]))}
  else if(o.mode==='droop')g+=(o.anim?'<g'+an('lb-a-fade',0,'animation-duration:1s')+'>':'<g>')+flaskSet(x,BY,k,{bal:'droop'})+'</g>';
  else g+=flaskSet(x,BY,k,{bal:'up',inf:k?o.inf:0,infAnim:k?o.infAnim:0,foam:k&&o.foam,foamAnim:k?o.foamAnim:0,settle:!k&&o.settle,settleAnim:k?0:o.settleAnim,fall:o.fall});
  g+=lab1(k)});
 return g}
function e1Scene(s){const r=R(),id=s.id,f=fid();
 if(id==='gear')return bg({})+gearArt(has('gear'),fxOn('gear'));
 let g=bg({});
 if(id==='balA')return g+e1Set({mode:'table',fill:[has('balA')&&f!=='balA'?1:0,0],filling:f==='balA'?0:-1});
 if(id==='balB')return g+e1Set({mode:'table',fill:[1,has('balB')&&f!=='balB'?1:0],filling:f==='balB'?1:-1});
 if(id==='cover')return g+(has('cover')?e1Set({mode:'droop',anim:f==='cover'}):e1Set({mode:'table',fill:[1,1]}));
 if(id==='pred')return g+e1Set({mode:'droop'})+qmark(480,190);
 if(id==='stand'){const ids=['up','wt'],k=seqK('stand',ids),fi=ids.indexOf(f);
  if(fi===0)return g+'<g'+an('lb-a-fade',0,'animation-duration:.8s')+'>'+e1Set({inf:0,fall:1,foam:1,foamAnim:1.2,settle:1,settleAnim:1.4})+'</g>';
  if(fi===1)return g+e1Set({inf:1,infAnim:.2,foam:1,settle:1})+mini(480,206,'잠시 뒤',18);
  if(k>=2)return g+e1Set({inf:1,foam:1,settle:1})+mini(480,206,'잠시 뒤',18);
  if(k>=1)return g+e1Set({inf:.3,foam:1,settle:1});
  return g+e1Set({mode:'droop'})}
 if(id==='more'){const go=f==='mm',dn=go||!!r.seen.mm;g+=petri(330,BY,dn?(go?'go':1):0,'#C98B3A')+petri(630,BY,dn?(go?'go':1):0,'#2B2F7A');
  g+=powderDots(330,BY-14,12,3,60)+powderDots(630,BY-14,12,5,60);
  if(go)g+='<g'+an('lb-a-fade',0)+'>'+dropperArt(330,BY-70,'#C98B3A')+'</g><g'+an('lb-a-fade',.5)+'>'+dropperArt(630,BY-70,'#C98B3A')+'</g>';
  return g+wlab(330,BY+32,'탄산수소 나트륨',16)+wlab(630,BY+32,'밀가루',16)}
 return g+e1Set({mode:'table',fill:[0,0]})}

/* ───── 실험 2·3: 양초와 알코올램프 ───── */
const FXC=380;
function fireTopY(no,t){return no===2?candleTop(BY,{h:t?120:170})-8:lampTop(BY)+2}
function fireObj(no,o){o=o||{};
 if(no===2)return candleArt(FXC,BY,{h:o.t?120:170,drip:o.t?1:(o.lit?.12:0),lit:o.lit,litAnim:o.litAnim});
 return lampArt(FXC,BY,{lv:o.t?.42:.8,cap:o.cap||'side',lit:o.lit,litAnim:o.litAnim,capAnim:o.capAnim})}
function fireFlame(no,t){return flameArt(FXC,fireTopY(no,t),1,no===2?'c':'a')}
function flameSpot(){const v=V(),r=R(),t=idxOf('time')<r.step?1:0;return [FXC,Math.round(fireTopY(v.no,t)-30),44,2.1,640,v.no===2?220:250]}
function fireScene(s){const v=V(),r=R(),no=v.no,id=s.id,f=fid();
 if(id==='gear')return bg({})+gearArt(has('gear'),fxOn('gear'),true);
 let g=bg({});
 if(id==='exit')return g+exitScene(has('exit'),f==='exit');
 const capOn=no===3&&!has('place');
 if(id==='clear'){g+=fireObj(no,{cap:'on'});const on=has('clear');if(!on)g+=burnables(600,BY)+mini(660,BY-70,'탈 수 있는 물체',16);if(f==='clear')g+='<g'+an('lb-a-out',.2,'animation-duration:1.2s')+'>'+burnables(600,BY)+'</g>';return g}
 if(id==='place'){const on=has('place'),a=f==='place';
  if(!on)return g+lampArt(700,BY,{cap:'on'})+mini(700,BY+34,'옮기기 전',16);
  return g+(a?'<g'+an('lb-a-slide',0,'--dx:320px')+'>'+lampArt(FXC,BY,{cap:'on'})+'</g><g'+an('lb-a-fade',1.2)+'>'+lampArt(FXC,BY,{cap:'side',capAnim:1})+'</g>':fireObj(no,{}))}
 if(id==='pred')return g+fireObj(no,{})+qmark(620,250);
 if(id==='light'){const on=has('light'),a=f==='light';if(!on)return g+fireObj(no,{})+lighterArt(640,BY-14,0,0);
  const fy=fireTopY(no,0);return g+fireObj(no,{lit:1,litAnim:a?.9:0})+(a?'<g'+an('lb-a-slide',0,'--dx:160px')+'>'+lighterArt(FXC+118,fy-4,-12,1)+'</g>':'')}
 if(id==='look'){g+=fireObj(no,{lit:1});if(f==='zm')g+='<g'+an('lb-a-fade',0)+'>'+eyeLook(FXC+170,fireTopY(no,0)-30)+'</g>';return g}
 if(id==='feel'){const ids=['hp','dk'],k=seqK('feel',ids),fi=ids.indexOf(f),fy=fireTopY(no,0);
  g+=fireObj(no,{lit:1});
  if(k>=2||fi===1)g+=darkArt(FXC,fy-28,1,fi===1)+fireFlame(no,0);
  if(k>=1||fi===0)g+=(fi===0?'<g'+an('lb-a-slide',0,'--dx:220px')+'>':'<g>')+tPaper(FXC+24,fy-24,300,1,fi===0?1.1:0)+'</g>';
  return g}
 if(id==='time'){const go=f==='tm';
  if(go)return g+'<g'+an('lb-a-out',.3,'animation-duration:1.4s')+'>'+fireObj(no,{lit:1})+'</g><g'+an('lb-a-fade',.6,'animation-duration:1.4s')+'>'+fireObj(no,{lit:1,t:1})+'</g>'+mini(620,180,'시간이 지난 뒤',18);
  const t=sn('tm')?1:0;return g+fireObj(no,{lit:1,t})+(t?mini(620,180,'시간이 지난 뒤',18):'')}
 if(id==='off'){const on=has('off'),a=f==='off';
  if(!on)return g+fireObj(no,{lit:1,t:1});
  if(a)return g+lampArt(FXC,BY,{lv:.42,cap:'on',capAnim:1})+'<g'+an('lb-a-out',.7,'animation-duration:.6s')+'>'+fireFlame(no,1)+'</g>';
  return g+lampArt(FXC,BY,{lv:.42,cap:'on'})}
 return g+fireObj(no,{cap:capOn?'on':'side'})}

/* ───── 실험 4: 두 촛불과 아크릴 통 ───── */
const C4=[305,490],BOX4=[[190,206],[450,206]],BK4=600,CH4=70;
const c4Top=()=>candleTop(BY,{h:CH4,small:1});
function e4Base(o){o=o||{};let g='';
 C4.forEach((x,k)=>{const outA=o.out&&o.out[k];g+=candleArt(x,BY,{h:CH4,small:1,lit:o.lit&&!outA&&!(o.fade&&o.fade[k]),litAnim:o.litAnim,out:outA,outAnim:0});
  if(o.fade&&o.fade[k]!=null)g+='<g'+an('lb-a-out',o.fade[k],'animation-duration:.8s')+'>'+flameArt(x,c4Top()-8,1,'c')+'</g>'+smokeArt(x,c4Top()-14,o.fade[k]+.4)});
 if(o.bk)g+=bubBeaker(BK4,BY,{ml:o.ml||0,rise:o.rise,ki:o.ki,bub:o.bub,bubAnim:o.bubAnim});
 if(o.box)BOX4.forEach(([x,y])=>{g+=acrylBox(x,y,230,230,o.boxAnim?an('lb-a-down',0,'--from:-200px'):'')});
 if(!o.nolab)g+=mini(305,182,'㉠ 양초만',17)+mini(565,182,'㉡ 양초와 비커',17);
 return g}
function e4Scene(s){const r=R(),id=s.id,f=fid();
 if(id==='gear')return bg({})+gearArt(has('gear'),fxOn('gear'),true);
 let g=bg({});
 if(id==='light'){const on=has('light'),a=f==='light';if(!on)return g+e4Base({})+lighterArt(420,BY-14,0,0);
  return g+e4Base({lit:1,litAnim:a?.8:0})+(a?'<g'+an('lb-a-slide',0,'--dx:120px')+'>'+lighterArt(C4[0]+118,c4Top()-12,-12,1)+'</g>':'')}
 if(id==='mix'){const ids=['hp','ki'],k=seqK('mix',ids),fi=ids.indexOf(f);
  g+=e4Base({lit:1,bk:1,ml:k>=1&&fi!==0?60:fi===0?60:0,rise:fi===0,ki:k>=2||fi===1,bub:k>=2||fi===1,bubAnim:fi===1?.9:0});
  g+=reagent(760,BY,'#E6F2F8')+kiJar(840,BY);
  if(fi===0)g+='<g'+an('lb-a-fade',0)+'><g transform="rotate(-70 '+(BK4+40)+' '+(BY-190)+')">'+reagent(BK4+40,BY-110,'#E6F2F8')+'</g></g>'+'<path d="M'+(BK4+10)+' '+(BY-186)+' Q'+(BK4)+' '+(BY-150)+' '+BK4+' '+(BY-90)+'" stroke="#CFE6F2" stroke-width="6" fill="none" stroke-linecap="round" stroke-dasharray="12 8"'+an('lb-a-stream',0)+'/>';
  if(fi===1)g+='<g'+an('lb-a-tip',0,'--rot:-28deg;animation-duration:1.8s')+'>'+spoonArt(BK4+14,BY-176,0,'#FFFFFF','#B9B2A0')+'</g>'+fallGrains(BK4,BY-168,BY-30,'#FFFFFF','#B9B2A0',BK4);
  return g}
 if(id==='pred')return g+e4Base({lit:1,bk:1,ml:60,ki:1,bub:1})+qmark(430,140);
 if(id==='cover'){const ids=['cv','wt'],k=seqK('cover',ids),fi=ids.indexOf(f);
  if(k<1&&fi<0)return g+e4Base({lit:1,bk:1,ml:60,ki:1,bub:1});
  if(fi===0)return g+e4Base({lit:1,bk:1,ml:60,ki:1,bub:1,box:1,boxAnim:1});
  if(fi===1)return g+e4Base({lit:1,bk:1,ml:60,ki:1,bub:1,box:1,fade:[1.2,3.6]});
  if(k>=2)return g+e4Base({bk:1,ml:60,ki:1,bub:1,box:1,out:[1,1]});
  return g+e4Base({lit:1,bk:1,ml:60,ki:1,bub:1,box:1})}
 return g+e4Base({})}

/* ───── 실험 5: 철판 위의 성냥 조각 ───── */
const HX5=350,WX5=610,PY5=PL.y;
function e5Set(o){o=o||{};let g=plateSet(o.heat||0,o.heatAnim);
 g+=lampArt(PL.cx,BY,{s:.9,cap:o.lit?'none':'on',lit:o.lit,litAnim:o.litAnim});
 if(o.put){const p=matchHead(HX5,PY5,o.hs||0,o.hsAnim)+matchWood(WX5,PY5,o.ws||0,o.wsAnim);g+=o.putAnim?'<g'+an('lb-a-down',0,'--from:-120px')+'>'+p+'</g>':p;
  if(!o.nolab)g+=mini(HX5-4,PY5-70,'머리 부분',15)+mini(WX5,PY5-70,'나무 부분',15)}
 return g}
function e5Scene(s){const r=R(),id=s.id,f=fid();
 if(id==='gear')return bg({})+gearArt(has('gear'),fxOn('gear'),true);
 let g=bg({});
 if(id==='put'){const on=has('put'),a=f==='put';
  if(!on)return g+e5Set({})+matchHead(240,BY-4,0)+matchWood(740,BY-4,0)+tweezArt(800,BY-30,30,'');
  g+=e5Set({put:1,putAnim:a});
  if(!a)g+='<path d="M'+(PL.cx-6)+' '+(PY5-16)+' H'+(HX5+16)+' M'+(PL.cx+6)+' '+(PY5-16)+' H'+(WX5-42)+'" stroke="var(--lb-sci)" stroke-width="3" stroke-dasharray="7 6"/><circle cx="'+PL.cx+'" cy="'+(PY5-16)+'" r="5" fill="var(--lb-sci)"/>'+mini(PL.cx,PY5-34,'같은 거리',14);
  return g}
 if(id==='pred')return g+e5Set({put:1})+qmark(PL.cx,170);
 if(id==='heat'){const ids=['lt','h1','h2'],k=seqK('heat',ids),fi=ids.indexOf(f);
  if(fi===0)return g+e5Set({put:1,lit:1,litAnim:.9})+'<g'+an('lb-a-slide',0,'--dx:160px')+'>'+lighterArt(PL.cx+118,lampTop(BY,.9)-4,-12,1)+'</g>';
  if(fi===1)return g+e5Set({put:1,lit:1,heat:1,heatAnim:1,hs:1,hsAnim:2.6,ws:1,wsAnim:3.2});
  if(fi===2)return g+e5Set({put:1,lit:1,heat:1,hs:2,hsAnim:.4,ws:2,wsAnim:1.2});
  if(k>=3)return g+e5Set({put:1,lit:1,heat:1,hs:2,ws:2});
  if(k>=2)return g+e5Set({put:1,lit:1,heat:1,hs:1,ws:1});
  if(k>=1)return g+e5Set({put:1,lit:1,heat:.15});
  return g+e5Set({put:1})}
 return g+e5Set({})}

/* ───── 실험 6: 푸른색 염화 코발트 종이·석회수 ───── */
const CX6=400,PX6=BX6.x+16;
function box6(dx,anim,paper){const {x,y,w,h}=BX6;let g=acrylBox(x+dx,y,w,h);if(paper)g=coPaper(x+dx+16,y+54,26,80,paper===2,0,1)+g;return anim?'<g'+anim+'>'+g+'</g>':g}
function coSpot(){const r=R();if((r.st.burnA||0)<3&&fid()!=='wa')return null;return [PX6+13,BX6.y+94,42,2,720,230]}
function e6Scene(s){const r=R(),id=s.id,f=fid();
 if(id==='gear')return bg({})+gearArt(has('gear'),fxOn('gear'),true);
 let g=bg({});const ct=candleTop(BY,{h:CH4,small:1});
 if(id==='preCo'){const go=f==='wd',dn=sn('wd');g+=shadow(480,BY+3,90)+'<rect x="460" y="'+(BY-160)+'" width="40" height="160" rx="4" fill="#9AA6B2"/>'+coPaper(400,BY-300,160,150,0);
  if(dn)g+='<g'+(go?an('lb-a-fade',1,'animation-duration:1.4s'):'')+'><circle cx="480" cy="'+(BY-226)+'" r="30" fill="'+COR+'"/></g>';
  if(go)g+='<g'+an('lb-a-drip',0,'animation-duration:1s')+'><path d="M480 '+(BY-330)+' q-9 15 0 21 q9 -6 0 -21z" fill="#BFE3F5" stroke="#6FA9CC" stroke-width="1.5"/></g>';
  return g+wlab(480,BY+32,'푸른색 염화 코발트 종이',15)}
 if(id==='preLi'){const go=f==='co',dn=sn('co');return g+limeJar(480,BY,{lid:'side',cloud:dn?.85:0,cloudAnim:go?1.4:0})+co2Tube(480,BY,go)+wlab(480,BY+32,'석회수',16)}
 if(id==='pred')return g+box6(0,'',1)+limeJar(700,BY,{lid:'on'})+qmark(480,150);
 if(id==='paper'){const on=has('paper'),a=f==='paper';g+=box6(0,'',0);
  if(on)g+=(a?'<g'+an('lb-a-fade',.7)+'>':'<g>')+coPaper(PX6,BX6.y+54,26,80,0,0,1)+'</g>'+(a?'<g'+an('lb-a-slide',0,'--dx:200px')+'>'+tweezArt(PX6+40,BX6.y+110,20,'')+'</g>':'');
  else g+=coPaper(640,BY-6-80,26,80,0)+tweezArt(700,BY-20,30,'');
  return g}
 if(id==='burnA'){const ids=['la','ca','wa'],k=seqK('burnA',ids),fi=ids.indexOf(f);
  if(k<1&&fi<0)return g+candleArt(CX6,BY,{h:CH4,small:1})+box6(300,'',1)+lighterArt(520,BY-14,0,0);
  if(fi===0)return g+candleArt(CX6,BY,{h:CH4,small:1,lit:1,litAnim:.8})+box6(300,'',1)+'<g'+an('lb-a-slide',0,'--dx:120px')+'>'+lighterArt(CX6+118,ct-12,-12,1)+'</g>';
  if(fi===1)return g+candleArt(CX6,BY,{h:CH4,small:1,lit:1})+box6(0,an('lb-a-slide',0,'--dx:300px'),1);
  if(fi===2)return g+candleArt(CX6,BY,{h:CH4,small:1})+'<g'+an('lb-a-out',1.4,'animation-duration:.8s')+'>'+flameArt(CX6,ct-8,1,'c')+'</g>'+smokeArt(CX6,ct-14,1.9)+dropletsArt(1)+coPaper(PX6,BX6.y+54,26,80,1,1.2,1)+box6(0,'',0);
  if(k>=3)return g+candleArt(CX6,BY,{h:CH4,small:1,out:1})+dropletsArt(0)+box6(0,'',2);
  if(k>=2)return g+candleArt(CX6,BY,{h:CH4,small:1,lit:1})+box6(0,'',1);
  return g+candleArt(CX6,BY,{h:CH4,small:1,lit:1})+box6(300,'',1)}
 const JX=440,CX=320;
 if(id==='lime'){const on=has('lime'),a=f==='lime';if(!on)return g+candleArt(CX,BY,{h:CH4,small:1})+limeJar(JX,BY,{lid:'on'})+lighterArt(640,BY-14,0,0);
  return g+candleArt(CX,BY,{h:CH4,small:1,lit:1,litAnim:a?.8:0})+limeJar(JX,BY,{lid:'side',lidAnim:a?1:0})+(a?'<g'+an('lb-a-slide',0,'--dx:140px')+'>'+lighterArt(CX+118,ct-12,-12,1)+'</g>':'')}
 if(id==='burnB'){const ids=['cb','cl','sh'],k=seqK('burnB',ids),fi=ids.indexOf(f);
  if(k<1&&fi<0)return g+candleArt(CX,BY,{h:CH4,small:1,lit:1})+limeJar(JX,BY,{lid:'side'});
  if(fi===0)return g+candleArt(CX,BY,{h:CH4,small:1})+'<g'+an('lb-a-out',2.2,'animation-duration:.8s')+'>'+flameArt(CX,ct-8,1,'c')+'</g>'+smokeArt(CX,ct-14,2.6)+limeJar(JX,BY,{lid:'side'})+box6(0,an('lb-a-slide',0,'--dx:300px'),0);
  if(fi===1)return g+candleArt(CX,BY,{h:CH4,small:1,out:1})+limeJar(JX,BY,{lid:'on',lidAnim:1})+'<g'+an('lb-a-out',0,'animation-duration:.9s')+'>'+box6(0,'',0)+'</g>';
  if(fi===2)return g+candleArt(CX,BY,{h:CH4,small:1})+limeJar(JX,BY,{lid:'on',shake:1,cloud:.85,cloudAnim:.9});
  if(k>=3)return g+candleArt(CX,BY,{h:CH4,small:1})+limeJar(JX,BY,{lid:'on',cloud:.85});
  if(k>=2)return g+candleArt(CX,BY,{h:CH4,small:1})+limeJar(JX,BY,{lid:'on'});
  return g+candleArt(CX,BY,{h:CH4,small:1,out:1})+limeJar(JX,BY,{lid:'side'})+box6(0,'',0)}
 return g+box6(0,'',1)}

function sceneSVG(){const v=V(),r=R(),s=curStep(),id=s.id,no=v.no;
 const T=(g,l,vb)=>svg(g+lensOf(s,g),l||s.t,vb);
 if(id==='tools'){if(!(r.done.tools||fxOn('tools')))return T(bg({})+boxArt(480),'준비물 상자');return T(bg({})+toolsScene(v.tools,fxOn('tools')),'준비물: '+v.tools.map(x=>x[1]).join(', '),v.tools.length>8?'0 10 960 600':null)}
 const F={1:e1Scene,2:fireScene,3:fireScene,4:e4Scene,5:e5Scene,6:e6Scene}[no];
 let vb={1:'80 120 800 390',2:'150 100 640 380',3:'170 140 600 330',4:'170 120 720 360',5:'170 140 620 350',6:'200 130 640 340'}[no];
 if(no===1&&id==='more')vb='180 250 600 260';
 if(no===1&&/^(balA|balB|cover|pred)$/.test(id))vb='110 210 740 300';
 if((no===2||no===3)&&id==='exit')vb='100 90 760 420';
 if(no===6&&/^(preCo|preLi)$/.test(id))vb='290 110 380 380';
 if(no===4&&id==='mix')vb='170 120 760 360';
 return T(F(s),s.t,id==='gear'?'160 40 640 420':vb)}

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

function rowSum(row){const r=R(),R0=ROWS[row],x=r.rec[row]||{};
 if(R0.t==='sel'){const F=fOf(row);return F.map((f,i)=>(f.l?f.l+' ':'')+f.o[x.f[i]]).join(' · ')}
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
  h+='<div class="lb-trials"><label class="lb-trial'+(op?' lb-tcur':'')+'"><span>'+esc(R0.lab||'무게')+'</span><input class="lb-num lb-numw" inputmode="'+(R0.dec?'decimal':'numeric')+'" maxlength="6" autocomplete="off" data-f="in'+row+'" data-in="'+row+'" aria-label="'+esc(R0.n)+' 숫자" value="'+esc(UI.inp[row]||'')+'"'+(op?'':' disabled')+'><span>'+R0.u+'</span></label><button type="button" class="lb-mini" data-act="trial" data-row="'+row+'" data-f="tr'+row+'"'+(op?'':' disabled')+'>'+ic('check')+'적기</button></div>';}
 if(UI.fb[row])h+='<div class="lb-msg '+(UI.fb[row][0]?'lb-good':'lb-try')+'" role="status">'+ic(UI.fb[row][0]?'check':'info')+'<span>'+UI.fb[row][1]+'</span></div>';
 return h+'</div>'}
/* ───────── 할 일 카드: ① 해 보기 → ② 살펴보기 → ③ 기록하기 ───────── */
function acted(s){const r=R();return !!(r.act&&r.act[s.id])||(s.k==='scene'&&!!r.done[s.id])}
function looked(s){if(s.k==='scene')return !!R().done[s.id];if(s.k==='meas')return s.rows.every(rowReady);if(s.k==='more')return !!R().seen.mm;return true}
function hintOf(s){const r=R(),id=s.id,D=isDone(r.step);
 if(s.k==='more'){const Q=MOREQ[V().no];if(r.more.a===Q[2])return '다 했어요. 이어서 가요.';if(UI.fx)return s.look;if(r.seen.mm)return '③ 알맞은 것을 골라요.';const a=actsOf(s)[0];return '① '+lj(a.label)+' 눌러요.'}
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
 grps.forEach(G=>{if(G.c.every(a=>a.fin)){h+='<p class="lb-cfin">'+ic('check')+'<b>'+esc(G.n)+'</b> '+esc(G.c[0].fin)+'</p>';return}
  const n=G.c.length,mini=cellsOnly&&G.c.every(a=>a.seen&&a.label.length<=3),cols=mini?n:G.c.some(a=>a.label.length>6)?(n>2?2:n):n===8||n===4?4:n>4?3:n;
  /* 모두 본 뒤(기록하는 동안)에는 시간 칸을 한 줄로 작게 — 기록 칸이 카드 안에 들어가게 */
  h+='<div class="lb-cellrow'+(mini?' lb-cellmini':'')+'" role="group" aria-label="'+esc(G.n)+'"><span class="lb-cl">'+esc(G.n)+(mini?' · 다시 볼 때 눌러요':'')+'</span><div style="grid-template-columns:repeat('+cols+',minmax(0,1fr))">'+G.c.map(a=>'<button type="button" class="lb-cellb'+(a.label.length>6?' lb-cellw':'')+(UI.attn&&!a.dis?' lb-attn':'')+(a.seen?' lb-seen':'')+'" data-act="x" data-x="'+a.id+'" data-f="x'+a.id+'" aria-pressed="'+!!a.pressed+'"'+(a.dis?' disabled':'')+' aria-label="'+esc(G.n+' '+a.label)+(a.seen?' (해 봤어요)':'')+'">'+(a.seen&&!mini?ic('check'):'')+'<span>'+esc(a.label)+'</span></button>').join('')+'</div></div>'});
 return h}
/* 더 알아보기(u2-1 더 알아봐요): 원본 차례대로 먼저 떨어뜨려 보고, 그다음 고름 */
const MOREQ={1:['물질의 성질이 변한 것은 어느 쪽인가요?',['탄산수소 나트륨과 아이오딘-아이오딘화 칼륨 용액','밀가루와 아이오딘-아이오딘화 칼륨 용액'],1,'밀가루에 떨어뜨린 쪽은 청남색으로 변했고, 탄산수소 나트륨에 떨어뜨린 쪽은 용액의 색깔 그대로예요. 밀가루와 아이오딘-아이오딘화 칼륨 용액이 섞이면 물질의 성질이 변해요.']};
function taskCard(s){const r=R(),A=acted(s),L=looked(s),D=isDone(r.step)&&(s.k!=='more'||r.more.a===MOREQ[V().no][2]);
 let h='<p class="lb-stat'+(D?' lb-statok':'')+'" role="status">'+ic(D?'check':'info')+'<span>'+esc(hintOf(s))+'</span></p><ol class="lb-guide">';
 if(s.k==='scene'){let b1;const dn=!!r.done[s.id];
  if(s.opts&&!dn&&!fxOn(s.id))b1='<div class="lb-acts" role="group" aria-label="'+esc(s.ask)+'">'+s.opts.map((o,i)=>'<button type="button" class="lb-act lb-act2" data-act="pick" data-i="'+i+'" data-f="pk'+i+'">'+ic('place')+'<span>'+esc(o.t)+'</span></button>').join('')+'</div>';
  else if(!dn||fxOn(s.id))b1='<div class="lb-acts"><button type="button" class="lb-act" data-act="doit" data-f="doit"'+(UI.fx?' disabled':'')+'>'+ic('hand')+'<span>'+esc(s.act||'놓는 중')+'</span></button></div>';
  else b1='<div class="lb-acts"><button type="button" class="lb-act lb-act3" data-act="replay" data-f="replay">'+ic('replay')+'<span>처음부터 보기</span></button></div>';
  h+=gPart(1,'해 보기',dn?'ok':'cur',b1)+gPart(2,'살펴보기',dn?'ok':UI.fx?'cur':'wait','<p>'+esc(s.look)+'</p>');
  return cardHead('할 일',stepName(s))+wrapB(h+'</ol>')}
 if(s.k==='more'){const Q=MOREQ[V().no],ans=r.more.a,seen=!!r.seen.mm,good=ans===Q[2];
  let b3='<p class="lb-q">'+esc(Q[0])+'</p><div class="lb-opts">'+Q[1].map((t,i)=>'<button type="button" class="lb-opt lb-optsm" data-f="mq'+i+'" data-mq="'+i+'" aria-pressed="'+(ans===i)+'"'+(seen&&!UI.fx&&!good?'':' disabled')+'><i>'+(ans===i?ic('check'):'')+'</i><span>'+esc(t)+'</span></button>').join('')+'</div>';
  if(ans!=null)b3+='<div class="lb-msg '+(good?'lb-good':'lb-try')+'">'+ic(good?'check':'info')+'<span>'+(good?Q[3]:'두 페트리 접시의 색깔을 다시 견줘 봐요.')+'</span></div>';
  h+=gPart(1,'해 보기',seen?'ok':'cur',seen?'':actBtns(s))+gPart(2,'살펴보기',seen?'ok':UI.fx?'cur':'wait','<p>'+esc(s.look)+'</p>')+gPart(3,'고르기',good?'ok':seen?'cur':'wait',seen?b3:'<p class="lb-hint2">해 보고 나면 열려요.</p>');
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
 return ''}
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

function sheetTable(v,r){let h='<table class="lb-tbl"><caption class="lb-sr">관찰 기록</caption><thead><tr><th scope="col">무엇을</th><th scope="col">내 기록</th></tr></thead><tbody>';
 v.rows.forEach(k=>{h+='<tr><th scope="row">'+esc(ROWS[k].n)+'</th><td>'+(rowDone(k)?esc(rowSum(k)):'—')+'</td></tr>'});
 return h+'</tbody></table>'}
function planSummary(v,r){const P=v.plan;if(!P)return '';if(!r.planOk)return '<p>(계획을 건너뛰었어요)</p>';
 return '<div class="lb-sh-tags">'+P.rows.map(x=>{const d=r.plan[x[0]]==='d';return '<span class="lb-sh-tag'+(d?' lb-d':'')+'">'+(d?'다르게: ':'같게: ')+esc(x[1])+'</span>'}).join('')+'</div>'}
function sheetHTML(){const v=V(),r=R();const done=v.steps.map(id=>stepDef(v,id)).filter(s=>(s.k==='scene'||s.k==='meas')&&s.id!=='tools');
 const today=new Date();const ds=today.getFullYear()+'. '+(today.getMonth()+1)+'. '+today.getDate()+'.';
 let h='<article class="lb-sheet lb-sh-e'+v.no+'" id="lbSheet" aria-label="실험 결과 한 장"><div class="lb-sh-in"><header class="lb-sh-h"><div><h2>실험 결과 한 장 · '+esc(v.title)+'</h2><span>탐구 실험관 · 6학년 2학기 과학 · 2. 물질의 연소 · '+ds+'</span></div><div class="lb-sh-name">이름 <u>'+(esc(DB.name)||'&nbsp;')+'</u></div></header><div class="lb-sh-grid"><div class="lb-sh-col">';
 h+='<section class="lb-sh-sec"><h3><i></i>실험 문제</h3><p><b>'+esc(v.q)+'</b></p>'+planSummary(v,r)+'</section>';
 h+='<section class="lb-sh-sec lb-sh-po"><h3><i></i>실험한 차례</h3><div class="lb-sh-steps">'+done.map((s,i)=>'<div><b>'+(i+1)+'.</b> '+esc(s.t)+'</div>').join('')+'</div></section>';
 const pred='<section class="lb-sh-sec"><h3><i></i>내 예상</h3><p>'+v.pred.map((q,j)=>(v.pred.length>1?esc(q.q)+' ':'')+(r.pred[j]!=null?esc(q.o[r.pred[j]]):'(고르지 않았어요)')).join('<br>')+(r.why?'<br>까닭: '+esc(r.why):'')+'</p></section>';
 const rec='<section class="lb-sh-sec"><h3><i></i>관찰 기록</h3>'+sheetTable(v,r)+'</section>';
 const cs='<section class="lb-sh-sec"><h3><i></i>내 결론</h3><div class="lb-sh-box"><p class="lb-sh-concl">'+frameHTML(v,r.bl,'sheet')+'</p>'+(r.cmp?'<p class="lb-sh-book">교과서 결론: '+esc(v.book)+'</p>':'')+'</div></section>';
 h+=pred+'</div><div class="lb-sh-col">'+rec+cs+'</div></div>';
 h+=picsHTML(snapList(v,r))+'<section class="lb-sh-sec lb-sh-po lb-sh-fill"><h3><i></i>새로 알게 된 것 · 더 알고 싶은 것</h3><div class="lb-sh-lines">'+'<div class="lb-ln"></div>'.repeat(9)+'</div></section>';
 h+='<footer class="lb-sh-f"><span>아주 단순하게 만든 모형의 결과예요. 실제 교실에서는 결과가 조금 다를 수 있어요.</span><span>만든 사람: 초등교사 홍지희</span></footer></div></article>';
 return h}
const LABNAME='burn';
function snapsOf(v,r){const L=[],no=v.no,S=(g,vb,cap)=>L.push([svg(g,cap,vb),cap]);const ok=k=>rowDone(k);
 if(no===1){if(ok('bl')&&ok('fl'))S(bg({})+e1Set({inf:1,foam:1,settle:1}),'230 130 500 360','두 고무풍선을 세우고 잠시 뒤')}
 if(no===2||no===3){if(ok(no===2?'cLook':'aLook'))S(bg({})+fireObj(no,{lit:1}),'210 140 340 320','불꽃');if(ok(no===2?'cWarm':'aWarm'))S(bg({})+fireObj(no,{lit:1})+tPaper(FXC+24,fireTopY(no,0)-24,300,1,0),'210 140 600 320','열 변색 종이를 댄 모습');if(ok(no===2?'cTime':'aTime'))S(bg({})+fireObj(no,{lit:1,t:1}),'210 140 340 320','시간이 지난 뒤')}
 if(no===4){if(ok('ord'))S(bg({})+e4Base({bk:1,ml:60,ki:1,box:1,out:[1,1]}),'140 150 680 330','두 촛불이 모두 꺼진 뒤')}
 if(no===5){if(ok('first'))S(bg({})+e5Set({put:1,lit:1,heat:1,hs:1,ws:1}),'170 160 620 330','가운데를 가열한 뒤');if(ok('wood'))S(bg({})+e5Set({put:1,lit:1,heat:1,hs:2,ws:2}),'170 160 620 330','더 오래 가열한 뒤')}
 if(no===6){if(ok('co'))S(bg({})+candleArt(CX6,BY,{h:CH4,small:1,out:1})+dropletsArt(0)+box6(0,'',2),'200 160 420 300','촛불이 꺼진 뒤 종이');if(ok('li'))S(bg({})+limeJar(480,BY,{lid:'on',cloud:.85}),'360 280 240 180','흔든 뒤 석회수')}
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
 if(!DB.cur||!EXPS[DB.cur]){H.classList.remove('lb-inrun');$('#lbSub').textContent='6학년 2학기 과학 · 2단원 물질의 연소';$('#lbChoose').hidden=true;$('#lbClearMi').hidden=true;
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
function notesHTML(s){if(!s.why&&!s.care&&!s.know)return '';const hideWhy=false;let h=!s.why&&!hideWhy?'':hideWhy?'<div class="lb-note lb-know">'+ic('info')+'<div><b>알아 두어요</b>'+esc(s.pre||'먼저 해 보고 골라요.')+'</div></div>':'<div class="lb-note lb-why">'+ic('why')+'<div><b>왜 그렇게 할까요?</b>'+esc(s.why)+'</div></div>';
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
function actsOf(s){const r=R(),A=[],busy=!!UI.fx;
 if(s.k==='more'){A.push({id:s.ids[0],label:s.acts[0],dis:busy});return A}
 if(s.ids)seqActs(A,s.id,s.ids,s.acts,busy);
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
 if(no===1){if(k==='balA'){g+=fillBalloon(480,BY,0).replace(/ class="lb-a[^"]*" style="[^"]*"/g,'');vb='380 260 200 200'}
  if(k==='balB'){g+=fillBalloon(480,BY,1).replace(/ class="lb-a[^"]*" style="[^"]*"/g,'');vb='380 260 200 200'}
  if(k==='cover'){g+=flaskSet(480,BY,1,{bal:'droop'});vb='360 230 260 230'}
  if(k==='stand'){g+=flaskSet(380,BY,0,{bal:'up'})+flaskSet(580,BY,1,{bal:'up'});vb='280 180 400 280'}}
 if(no===2||no===3){const fy=fireTopY(no,0);
  if(k==='place'){g+=lampArt(FXC,BY,{cap:'side'});vb='280 250 280 210'}
  if(k==='light'){g+=fireObj(no,{lit:1})+lighterArt(FXC+118,fy-4,-12,1);vb=no===2?'270 150 300 310':'270 250 300 210'}
  if(k==='look'){g+=fireObj(no,{lit:1})+eyeLook(FXC+130,fy-30);vb=no===2?'290 150 280 310':'290 250 280 210'}
  if(k==='feel'){g+=fireObj(no,{lit:1})+tPaper(FXC+24,fy-24,180,0,0);vb=no===2?'290 150 420 310':'290 250 420 210'}
  if(k==='time'){g+=fireObj(no,{lit:1})+clockArt(FXC+150,fy+40,'',1.3);vb=no===2?'290 150 300 310':'290 250 300 210'}}
 if(no===4){if(k==='light'){g+=e4Base({lit:1,nolab:1});vb='190 300 520 160'}
  if(k==='mix'){g+=bubBeaker(BK4,BY,{ml:60})+reagent(BK4+110,BY,'#E6F2F8')+kiJar(BK4-110,BY);vb=(BK4-180)+' 260 360 200'}
  if(k==='cover'){g+=e4Base({lit:1,bk:1,ml:60,box:1,nolab:1});vb='150 180 660 280'}
  if(k==='watch'){g+=e4Base({lit:1,bk:1,ml:60,box:1,nolab:1})+eyeLook(480,170);vb='150 130 660 330'}}
 if(no===5){if(k==='put'){g+=plateSet(0)+tweezArt(HX5+30,PY5-10,20,'')+matchHead(HX5,PY5,0);vb='250 180 460 270'}
  if(k==='same'){g+=plateSet(0)+matchHead(HX5,PY5,0)+matchWood(WX5,PY5,0)+'<path d="M'+(PL.cx-6)+' '+(PY5-16)+' H'+(HX5+16)+' M'+(PL.cx+6)+' '+(PY5-16)+' H'+(WX5-42)+'" stroke="var(--lb-sci)" stroke-width="4" stroke-dasharray="8 6"/><circle cx="'+PL.cx+'" cy="'+(PY5-16)+'" r="6" fill="var(--lb-sci)"/>';vb='250 180 460 270'}
  if(k==='heat'){g+=e5Set({put:1,lit:1,nolab:1});vb='250 180 460 270'}
  if(k==='watch'){g+=e5Set({put:1,lit:1,nolab:1})+eyeLook(PL.cx,170);vb='250 130 460 320'}}
 if(no===6){if(k==='paper'){g+=box6(0,'',0)+coPaper(PX6,BX6.y+54,26,80,0,0,1)+tweezArt(PX6+40,BX6.y+110,20,'');vb='230 180 340 280'}
  if(k==='coverA'){g+=candleArt(CX6,BY,{h:CH4,small:1,lit:1})+box6(0,'',1);vb='230 180 340 280'}
  if(k==='lime'){g+=candleArt(320,BY,{h:CH4,small:1,lit:1})+limeJar(440,BY,{lid:'side'})+box6(0,'',0);vb='230 180 340 280'}
  if(k==='shake'){g+=limeJar(480,BY,{lid:'on'})+hand(410,BY-60,0,.9,1).replace(/#FFFFFF/g,'#F4F1EA');vb='330 280 280 180'}}
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
 if(no===1){g+=flaskSet(FX1[0],BY,0,{bal:'droop'})+flaskSet(FX1[1],BY,1,{bal:'droop'});vb='200 220 560 240'}
 if(no===2){g+=candleArt(FXC,BY,{h:150})+lighterArt(560,BY-14,0,0);vb='250 200 420 260'}
 if(no===3){g+=lampArt(FXC,BY,{cap:'side'})+lighterArt(600,BY-14,0,0);vb='250 260 450 200'}
 if(no===4){g+=candleArt(C4[0],BY,{h:CH4,small:1})+candleArt(C4[1],BY,{h:CH4,small:1})+bubBeaker(BK4,BY,{})+BOX4.map(([x,y])=>acrylBox(x,y,230,230)).join('');vb='170 190 540 270'}
 if(no===5){g+=e5Set({});vb='240 200 480 260'}
 if(no===6){g+=coPaper(380,BY-130,30,90,0)+limeJar(560,BY,{lid:'on'});vb='300 250 360 210'}
 const s=svg(g,'실험 '+no+' 처음 모습',vb);NAR=false;LEG=[];return s}
function homeHTML(){const card=k=>{const v=EXPS[k],r=DB.runs[k];const st=r?(r.fin?'끝냄 · 결과 보기':(r.step+1)+'단계부터 이어서'):'실험 시작하기';
 return '<section class="lb-exc" aria-labelledby="lbE'+v.no+'"><div class="lb-exc-art">'+homeArt(v.no)+'</div><div class="lb-exc-b"><h2 id="lbE'+v.no+'"><em>실험 '+v.no+'</em>'+esc(v.name)+'</h2><p class="lb-exp">'+esc(v.sub)+'</p><button type="button" class="lb-pickb" data-pick="'+k+'" data-f="k'+k+'"><i>'+ic(['','flask','fire','fire','box','thermo','eye'][v.no])+'</i><span><b>'+st+'</b><span>교과서 실험</span></span>'+(r&&r.fin?'<small>'+ic('check')+'</small>':'')+'</button></div></section>'};
 return '<div class="lb-home"><div class="lb-home-h"><div class="lb-kick"><em>6학년 2학기 과학</em>2. 물질의 연소</div><h1>무엇을 실험할까요?</h1><p>실험을 한 단계씩 직접 해 보고, 내 눈으로 본 것을 기록해요.</p></div>'+
 '<div class="lb-ex lb-ex5 lb-ex6">'+['e1','e2','e3','e4','e5','e6'].map(card).join('')+'</div>'+
 '<p class="lb-model">'+ic('info')+'<span>아주 단순하게 만든 모형이에요. 같은 조건이면 언제나 같은 결과가 나와요. 실험 차례와 관찰 결과는 교과서 버전 앱의 예시예요. 불꽃·열 변색 종이·석회수의 그림 색깔, 고무풍선이 부푸는 크기, 촛불이 꺼지거나 성냥 조각에 불이 붙기까지 걸리는 때는 이 실험관에서 정한 모습이에요. 실제 실험에서는 내가 관찰한 결과를 그대로 써요.</span></p></div>'}
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
/* 행동마다 그림이 움직이는 때(ms) */
const XMS={up:2600,wt:3200,zm:1600,hp:2600,dk:1400,tm:2600,ki:2600,cv:1700,wt4:5200,lt:2000,h1:4600,h2:2600,wd:2400,co:3000,la:1900,ca:1800,wa:3600,cb:3600,cl:1700,sh:2600};
function doX(id){const r=R(),s=curStep(),st=r.st;if(UI.fx)return;
 if(s.k==='more'){if(r.seen[id])return;UI.mq.cur=id;fx(id,2600,()=>{r.seen[id]=1});return}
 r.act[s.id]=1;if(idxOf('pred')>=0&&r.step>idxOf('pred'))r.obs=1;
 const i=s.ids.indexOf(id),c=st[s.id]||0;if(i<0||c!==i)return;UI.mq.cur=id;fx(id,XMS[id+(V().no===4&&id==='wt'?'4':'')]||XMS[id]||1500,()=>{st[s.id]=i+1;r.seen[id]=1})}

/* 숫자 적기: 화면 숫자와 같은지만 알려 줌. 같은 값으로 다시 누르면 세지 않음 */
function tryKey(k,val){const r=R();if(r.last[k]===val)return -1;r.last[k]=val;r.tries[k]=(r.tries[k]||0)+1;return r.tries[k]}
function trial(row){const r=R(),R0=ROWS[row];if(!R0||R0.t!=='num'||!numOpen(row))return;const txt=String(UI.inp[row]||'').trim();
 if(!txt||!/^\d+(\.\d+)?$/.test(txt)){UI.fb[row]=[0,'숫자로 써요.'];render();return}
 if(txt===R0.v){r.rec[row]={ok:1,v:R0.v};delete r.pend[row];UI.inp[row]='';UI.mq.hl=false;UI.attn=false;UI.fb={};UI.fb[row]=[1,R0.dec?'잘 읽고 적었어요.':'잘 적었어요.'];save();render();const p=$('#lbFoot [data-act="next"]:not(:disabled)');if(p&&isDone(r.step))p.focus({preventScroll:true});return}
 const t=tryKey(row+':t',txt);
 if(t===-1){UI.fb[row]=[0,'숫자가 그대로예요. 다시 봐요.'];render();return}
 if(R0.dec&&txt.indexOf('.')<0&&+txt===Math.floor(+R0.v))UI.fb[row]=[0,'소수점 아래 첫째 자리까지 써요. 화면의 숫자를 그대로 써요.'];
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
 if(t.dataset.mq!=null){if(!r.seen.mm||UI.fx||r.more.a===MOREQ[V().no][2])return;r.more.a=+t.dataset.mq;save();render();return}
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
