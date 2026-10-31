
/* 소리 실험관에서 더 쓰는 아이콘 */
Object.assign(I,{music:'<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>',
 air:'<path d="M3 8h11a3 3 0 1 0-3-3"/><path d="M3 12h15a3 3 0 1 1-3 3"/><path d="M3 16h7"/>',
 water:'<path d="M2 15c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2"/><path d="M2 20c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2"/><path d="M12 3.5c2 2.5 3.5 4.3 3.5 6a3.5 3.5 0 0 1-7 0c0-1.7 1.5-3.5 3.5-6z"/>',
 ear:'<path d="M7 10a5 5 0 0 1 10 0c0 3-3 4-3 7a3 3 0 0 1-5.5 1.5"/><path d="M10 10a2 2 0 0 1 4 0c0 1.5-1.5 2-1.5 3"/>',
 desk:'<path d="M3 9h18M5 9v10M19 9v10M3 13h18"/>',
 speaker:'<rect x="5" y="3" width="14" height="18" rx="2"/><circle cx="12" cy="14" r="3.5"/><circle cx="12" cy="7" r="1"/>'});

/* ───────── 기록(이 기기에만) ───────── */
const KEY='hj-sound-v1';
function blank(){return {v:1,runs:{},cur:null,ui:{open:false,big:false,mute:false},name:''}}
function newRun(){return {step:0,max:0,done:{},plan:{},planLast:null,planOk:false,pred:[],why:'',seen:{},rec:{},pend:{},last:{},tries:{},reveal:{},bl:[],clast:null,ctry:0,cmp:false,fin:false,air:1,pulls:0,cyc:0,more:{}}}
function load(){try{const s=JSON.parse(localStorage.getItem(KEY)||'null');if(s&&s.v===1&&s.runs){const o=Object.assign(blank(),s);o.ui=Object.assign(blank().ui,s.ui||{});
 Object.keys(o.runs).forEach(k=>{if(!EXPS[k]||!o.runs[k])delete o.runs[k];else o.runs[k]=Object.assign(newRun(),o.runs[k])});return o}}catch(e){}return blank()}
let DB=load();
function save(){try{localStorage.setItem(KEY,JSON.stringify(DB))}catch(e){}}

/* ───────── 화면 상태(저장 안 함) ───────── */
const UI={fx:null,nonce:0,timers:[],draft:{},inp:{},sort:{},wrong:{},fb:{},focus:0,menu:false,rail:false,speaking:false,toast:'',hold:false,holdT:0,slow:false,spk:false,spkT:0,play:null,prep:false,key:null,deskMode:'dd',mq:{},noted:false};
function clearTimers(){UI.timers.forEach(t=>clearTimeout(t));UI.timers=[]}
function later(fn,ms){const t=setTimeout(fn,RM?Math.min(ms,120):ms);UI.timers.push(t);return t}
function resetUI(){clearTimers();UI.attn=false;UI.fx=null;UI.draft={};UI.inp={};UI.sort={};UI.wrong={};UI.fb={};UI.focus=0;UI.rail=false;UI.toast='';UI.hold=false;UI.slow=false;UI.play=null;UI.prep=false;UI.key=null;UI.mq={};spkStop();stopSay();AU.stopAll()}
const V=()=>EXPS[DB.cur],R=()=>DB.runs[DB.cur];
const narrow=()=>innerWidth<=820;
function endP(t){t=String(t).trim();return /[.?!]$/.test(t)?t:t+'.'}
function median(row){return med3(ROWS[row].v)}

/* ───────── 소리(Web Audio): 누를 때만, 크기 상한 0.35, 10 ms 넘게 부드럽게 시작 ───────── */
const AU={ctx:null,master:null,fail:false,live:[],
 init(){if(this.ctx||this.fail)return this.ctx;const C=window.AudioContext||window.webkitAudioContext;if(!C){this.fail=true;return null}
  try{const c=new C();const comp=c.createDynamicsCompressor();const m=c.createGain();m.gain.value=.35;m.connect(comp);comp.connect(c.destination);this.ctx=c;this.master=m}catch(e){this.fail=true;return null}return this.ctx},
 ok(){return !DB.ui.mute&&!this.fail},
 ready(){if(DB.ui.mute)return null;const c=this.init();if(!c)return null;if(c.state==='suspended'&&c.resume)try{c.resume()}catch(e){}
  if(!UI.noted){UI.noted=true;flash('기기 소리를 알맞게 줄여요. 귀를 기기에 대지 않아요.','info')}return c},
 gainNode(c,peak){const g=c.createGain();g.gain.value=0;return g},
 tone(o){const c=this.ready();if(!c)return null;const t=c.currentTime+.01,peak=Math.min(.3,o.peak||.2),att=Math.max(.012,o.att||.015);
  const osc=c.createOscillator();osc.type=o.type||'sine';osc.frequency.value=o.f;const g=c.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(peak,t+att);
  let node=osc;if(o.lp){const f=c.createBiquadFilter();f.type='lowpass';f.frequency.value=o.lp;osc.connect(f);node=f}
  node.connect(g);g.connect(this.master);
  if(o.hold){osc.start(t);const h={osc,g,stop:(r)=>{const n=c.currentTime;try{g.gain.cancelScheduledValues(n);g.gain.setValueAtTime(g.gain.value,n);g.gain.linearRampToValueAtTime(0,n+(r||.08));osc.stop(n+(r||.08)+.02)}catch(e){}}};this.live.push(h);return h}
  g.gain.exponentialRampToValueAtTime(.0005,t+att+(o.dec||1));osc.start(t);osc.stop(t+att+(o.dec||1)+.05);
  const h={osc,g,stop:(r)=>{const n=c.currentTime;try{g.gain.cancelScheduledValues(n);g.gain.setValueAtTime(g.gain.value,n);g.gain.linearRampToValueAtTime(0,n+(r||.08));osc.stop(n+(r||.08)+.02)}catch(e){}}};this.live.push(h);return h},
 noise(o){const c=this.ready();if(!c)return;const t=c.currentTime+.01,dur=o.dur||.06,peak=Math.min(.3,o.peak||.2);
  const len=Math.ceil(c.sampleRate*(dur+.05)),buf=c.createBuffer(1,len,c.sampleRate),d=buf.getChannelData(0);let s=7;for(let i=0;i<len;i++){s=(s*16807)%2147483647;d[i]=(s/2147483647)*2-1}
  const src=c.createBufferSource();src.buffer=buf;const f=c.createBiquadFilter();f.type=o.ft||'bandpass';f.frequency.value=o.ff||2000;const g=c.createGain();
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(peak,t+.012);g.gain.exponentialRampToValueAtTime(.0005,t+.012+dur);src.connect(f);f.connect(g);g.connect(this.master);src.start(t);src.stop(t+dur+.06)},
 stopAll(){this.live.forEach(h=>h.stop&&h.stop(.06));this.live=[]}};
/* 스피커(실험 4): 같은 크기·같은 높이의 '삐-'를 1초 켜짐·1초 꺼짐으로, 20초가 지나면 저절로 멈춤 */
const SPK={h:null,
 sched(g,t0,from,vol,cur){/* 하나의 크기 노드에 1초 켜짐·1초 꺼짐을 t0부터 20초까지, 바꿀 때도 늘 50 ms 이상 천천히 */cur=cur||0;for(let k=0;k<10;k++){const a=t0+k*2;if(a+1.06<=from)continue;
  if(from<=a){g.gain.setValueAtTime(0,a);g.gain.linearRampToValueAtTime(vol,a+.06);g.gain.setValueAtTime(vol,a+1);g.gain.linearRampToValueAtTime(0,a+1.06)}
  else if(from<a+1){g.gain.setValueAtTime(cur,from);g.gain.linearRampToValueAtTime(vol,from+.05);if(a+1>from+.05)g.gain.setValueAtTime(vol,a+1);g.gain.linearRampToValueAtTime(0,Math.max(a+1.06,from+.1))}
  else{g.gain.setValueAtTime(cur,from);g.gain.linearRampToValueAtTime(0,from+.05)}}},
 start(loud){const c=AU.ready();if(!c)return;this.stop();const t=c.currentTime+.01;const osc=c.createOscillator();osc.type='triangle';osc.frequency.value=523;const g=c.createGain();g.gain.setValueAtTime(0,t);
  this.sched(g,t,t,Math.min(.25,.25*loud));osc.connect(g);g.connect(AU.master);osc.start(t);osc.stop(t+20);this.h={osc,g,c,t0:t}},
 loud(v){if(!this.h)return;const {c,g,t0}=this.h,n=c.currentTime;try{const cur=g.gain.value;g.gain.cancelScheduledValues(n);this.sched(g,t0,n,Math.min(.25,.25*v),cur)}catch(e){}},
 stop(){if(!this.h)return;const c=this.h.c,n=c.currentTime,g=this.h.g;try{const cur=g.gain.value;g.gain.cancelScheduledValues(n);g.gain.setValueAtTime(cur,n);g.gain.linearRampToValueAtTime(0,n+.06);this.h.osc.stop(Math.min(n+.08,this.h.t0+20))}catch(e){}this.h=null}};
function spkOn(){const r=R();UI.spk=true;SPK.start(loudOf(r.air));clearTimeout(UI.spkT);UI.spkT=setTimeout(()=>{UI.spk=false;SPK.stop();if(DB.cur)render()},19800);markSpk()}
function spkStop(){UI.spk=false;clearTimeout(UI.spkT);SPK.stop()}
function markSpk(){const r=R();if(!r||!UI.spk)return;const rep=curStep().id==='repeat';if(!rep){if(r.pulls===0&&r.air>=.99&&!r.seen.lowdone)r.seen.first=1;if(r.pulls>=5)r.seen.low=1,r.seen.lowdone=1;if(r.seen.refilled&&r.air>=.99)r.seen.back=1}
 else{if((r.repPulls||0)>=5&&r.air<.99)r.seen.again=1;if(r.seen.again&&r.rep2&&r.air>=.99)r.seen.again2=1}}

/* ───────── 단계 판단 ───────── */
function stepOf(i){const v=V();return stepDef(v,v.steps[i])}
function idxOf(id){return V().steps.indexOf(id)}
function curStep(){return stepOf(R().step)}
function rowDone(row){const x=R().rec[row];return !!(x&&x.ok)}
function isDone(i){const r=R(),s=stepOf(i);
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
function enterStep(){const v=V(),r=R(),s=stepOf(r.step);
 if(s.k==='sheet')r.fin=!!(r.cmp&&v.rows.every(rowDone));
 if(s.k==='concl'&&!r.bl.length)r.bl=v.ans.map(()=>'');
 if(s.k==='concl')UI.focus=Math.max(0,r.bl.findIndex(x=>!x));
 if(s.id==='desk')UI.deskMode=rowDone('dd')&&!rowDone('ds')?'ds':'dd'}
function predLocked(){const r=R();return Object.keys(r.seen).length>0||Object.keys(r.rec).length>0||Object.keys(r.pend).length>0||!!r.done.kscan}
function planChanged(r){if(!r.planLast)return true;return JSON.stringify(r.plan)!==JSON.stringify(r.planLast)}

/* ───────── 장면 ───────── */
function fxOn(id){return UI.fx&&UI.fx.id===id}
/* 측정기·앱 화면: 지금 적고 있는 줄의 숫자를 늘 다시 보여 줌(새로 고쳐도 기록 줄에 남아 있음) */
function disp(){const r=R(),rows=curStep().rows||[];let row=UI.mq.row&&rows.indexOf(UI.mq.row)>=0?UI.mq.row:null;
 if(!row||(r.pend[row]==null&&UI.mq.val==null))row=rows.find(k=>r.pend[k]!=null)||row;
 if(!row)return {row:null,val:null};return {row,val:r.pend[row]!=null?r.pend[row]:(UI.mq.row===row?UI.mq.val:null)}}
function sceneSVG(){const v=V(),r=R(),s=curStep(),id=s.id,no=v.no;
 const T=(g,l,vb)=>svg(g,l||s.t,vb);
 if(id==='tools'){if(!(r.done.tools||fxOn('tools')))return T(bg({win:true})+boxArt(480),'준비물 상자');return T(bg({})+toolsScene(v.tools,fxOn('tools')),'준비물: '+v.tools.map(x=>x[1]).join(', '))}
 if(no===1){
  if(s.k==='plan'||s.k==='pred'||s.k==='concl')return T(bg({win:true})+boxBand(300,{})+fork(700,290,{})+(s.k!=='concl'?qmark(300,200)+qmark(700,90):''));
  if(id==='neck')return T(bg({win:true})+person(440,{on:UI.hold}),'목에 손을 대고 소리를 내는 모습','80 40 800 500');
  if(id==='band')return T(bg({win:true})+boxBand(480,{pluck:fxOn('pluck'),slow:UI.slow}),'고무줄을 튕기는 모습','150 120 660 400');
  if(id==='fork'){const on=fxOn('forkon'),off=fxOn('forkoff');return T(bg({})+fork(440,290,{ring:on,touch:on||off,grab:off})+mallet(300,190,{swing:on}),'소리굽쇠를 두드리고 손을 대는 모습','120 20 720 520')}
  if(id==='water'){const on=fxOn('wateron'),off=fxOn('wateroff');return T(bg({})+tank(480,{splash:on,ripple:on})+'<g transform="translate(480 186) rotate(180)">'+fork(0,0,{ring:on})+'</g>','소리굽쇠를 물에 대는 모습','140 20 680 520')}}
 if(no===2){const x0=360;
  if(s.k==='plan'||s.k==='pred'||s.k==='concl')return T(bg({})+glock(380,{})+meter(780,300,{})+(s.k!=='concl'?qmark(380,230)+qmark(780,140):''));
  if(id==='place'){const on=fxOn('place')||r.done.place,mx=on?490+220:880;
   return T(bg({})+glock(300,{})+ruler(490,450,44,10,on?5:null)+'<g'+(fxOn('place')?an('lb-a-slide',0,'--dx:170px'):'')+'>'+meter(mx,290,{})+'</g>','자로 재어 측정기를 놓는 모습')}
  if(id==='quiet')return T(bg({})+classroom(!!r.done.quiet&&!fxOn('quiet'),fxOn('quiet')),'교실이 조용해지는 모습');
  if(id==='glock'||id==='band2'){const f=UI.fx,row=f&&ROWS[f.id]?f.id:null,big=row?ROWS[row].lt===0:true;
   const D=disp(),dv=D.val;let g=bg({});const edge=id==='glock'?520:506;
   g+=id==='glock'?glock(330,{bar:3,stick:1,hit:!!row,big}):boxBand(330,{pull:row?(big?'high':'low'):null,pluck:!!row,big});
   g+=ruler(edge,450,44,6,5)+meter(edge+220,290,{val:dv,anim:!!row,hold:dv!=null,hl:UI.mq.hl});
   if(D.row)g+=plate(edge+220,ROWS[D.row].n,64);
   return T(g,id==='glock'?'글로켄슈필을 치고 측정기로 재는 모습':'고무줄을 튕기고 측정기로 재는 모습')}
  if(id==='more'){const f=UI.fx;return T(bg({})+drum(420,{hit:!!(f&&/drum/.test(f.id)),big:f&&f.id==='drumS'}),'작은북 위 스타이로폼 공')}}
 if(no===3){
  if(s.k==='plan'||s.k==='pred'||s.k==='concl')return T(bg({})+kalimba(480,{})+(s.k!=='concl'?qmark(480,120):''));
  if(id==='place'){const on=fxOn('place')||r.done.place,mx=on?470+220:880;
   return T(bg({})+kalimba(300,{})+ruler(470,450,44,10,on?5:null)+'<g'+(fxOn('place')?an('lb-a-slide',0,'--dx:190px'):'')+'>'+phone(mx,290,{})+'</g>','자로 재어 기기를 놓는 모습')}
  if(id==='kscan')return T(bg({})+kalimba(340,{key:UI.key,pluck:UI.key!=null})+ruler(510,450,44,6,5)+phone(730,290,{val:UI.key!=null?KF[UI.key]:null}),'칼림바 건반을 차례로 튕기는 모습');
  if(id==='kal'||id==='kone'){const f=UI.fx,D=disp(),row=f&&ROWS[f.id]?f.id:D.row;const one=id==='kone',on1=one&&(fxOn('kone')||r.done.kone);
   return T(bg({})+kalimba(340,{key:one?3:row==='ks'?6:row==='kl'?0:null,pluck:one?fxOn('kone'):!!(f&&ROWS[f.id])})+ruler(510,450,44,6,5)+phone(730,290,{val:one?(on1?KF[3]:null):D.val,hl:UI.mq.hl})+(!one&&D.row?plate(730,ROWS[D.row].n,58):''),'칼림바와 소리 높이 앱')}
  if(id==='uke'){const f=UI.fx,D=disp(),row=f&&ROWS[f.id]?f.id:D.row;return T(bg({})+uke(440,{hold:row==='us'?'short':row==='ul'?'long':null,pluck:!!(f&&ROWS[f.id])})+ruler(680,450,44,6,5)+phone(900,290,{val:D.val,hl:UI.mq.hl})+(D.row?plate(830,ROWS[D.row].n,58):''),'우쿨렐레와 소리 높이 앱','40 40 940 470')}
  if(id==='more')return T(bg({})+twoSpk({play:UI.fx&&UI.fx.id==='hlA'?0:UI.fx&&UI.fx.id==='hlB'?1:null,nums:[UI.mq.hlA?784:null,UI.mq.hlB?261:null]}),'가 소리와 나 소리')}
 if(no===4){const cot=s.k==='plan'||has('cotton'),spk=s.k==='plan'||has('lid'),lid=spk;
  let g=bg({});
  if(s.k==='plan'||s.k==='pred'||s.k==='concl')return T(g+jar(400,{cotton:1,speaker:1,lid:1,air:1})+(s.k==='pred'?qmark(400,90):''));
  g+=jar(400,{cotton:cot||fxOn('cotton'),aCotton:fxOn('cotton'),speaker:spk||fxOn('lid'),lid:lid&&!fxOn('lid'),aLid:fxOn('lid'),on:UI.spk,air:r.air,pump:fxOn('pump'),btn:fxOn('refill'),aBtn:fxOn('refill')});
  if(s.k==='meas'){const L=UI.spk?Math.max(1,Math.round(loudOf(r.air)*5)):0;g+=bars(760,420,L);
}
  return T(g,'공기를 빼는 장치와 스피커','120 40 780 470')}
 if(no===5){
  if(s.k==='plan'||s.k==='pred'||s.k==='concl')return T(bg({})+tank(320,{full:1})+castanet(320,250,1.2)+desk(560,330)+(s.k!=='concl'?qmark(320,120)+qmark(725,220):''));
  if(id==='cast'){const p=UI.play,inW=p&&p.row==='ci';let g=bg({})+tank(380,{full:1,ripple:inW});
   g+=hand(380+130,inW?380:220,180,1)+castanet(380+64,inW?380:220,1.3,!!p);g+=ear(800,240,1.1);
   if(p)for(let i=0;i<ROWS[p.row].taps;i++)g+=tok(870,140+i*52,i,1,inW);return T(g,'캐스터네츠 소리를 듣는 모습')}
  if(id==='desk'){const m=UI.play?UI.play.row:UI.deskMode,same=m==='ds';let g=bg({});
   g+=same?desk(120,720):desk(90,360)+desk(510,360);g+=headOnDesk(230,{closed:UI.prep,cover:UI.prep});
   g+='<g transform="translate(720 0)"><g'+(UI.play?an('lb-a-tap',0,'animation-iteration-count:'+ROWS[m].taps):'')+'><path d="M0 230 L40 300" stroke="#F2C94C" stroke-width="12" stroke-linecap="round"/><path d="M40 300 L44 308" stroke="#3A3A3A" stroke-width="8"/></g>'+hand(-14,220,-60,.8)+'</g>';
   if(UI.play){const R0=ROWS[m];g+=deskTrail(748,same?250:520,R0.taps,!same);for(let i=0;i<R0.taps;i++)g+=tok(330+i*56,150,i,R0.heard)}
   g+=plate(480,same?'같은 책상':'다른 책상(떨어져 있어요)',470);return T(g,same?'같은 책상에서 듣는 모습':'다른 책상에서 듣는 모습')}
  if(id==='more'){const f=UI.fx;return T(bg({})+stringPhone({taut:!f||f.id==='taut',play:!!f}),'실 전화기')}}
 return T(bg({}))}
function has(id){const r=R(),k=idxOf(id);if(k<0)return false;return k<r.step||(k===r.step&&(!!r.done[id]||fxOn(id)))}

/* ───────── 오른쪽 카드 ───────── */
function cardHead(t,s){return '<div class="lb-card-h"><span class="lb-clip">'+ic('clip')+'</span><div><b>'+t+'</b><span>'+s+'</span></div></div>'}
function wrapB(h){return '<div class="lb-card-b"><div class="lb-fit">'+h+'</div></div>'}
function planCard(){const v=V(),r=R(),P=v.plan;let h='<p class="lb-q">'+esc(v.q)+'</p>';
 const marked=r.planLast&&!planChanged(r);
 if(P.type==='pick'){r.plan.w=r.plan.w||{};r.plan.s=r.plan.s||{};
  h+='<p class="lb-hint">알맞은 관찰 방법을 모두 골라요.</p><div class="lb-opts" role="group" aria-label="관찰 방법">';
  P.ways.forEach(([t,ok,why],i)=>{const on=!!r.plan.w[i];const bad=marked&&on&&!ok,miss=marked&&!on&&ok;
   h+='<button type="button" class="lb-opt lb-optsm'+(bad?' lb-optbad':'')+'" data-f="w'+i+'" data-pw="'+i+'" aria-pressed="'+on+'"><i>'+(on?ic('check'):'')+'</i><span>'+esc(t)+(bad?'<em class="lb-why2">'+esc(why)+'</em>':'')+'</span></button>'});
  h+='</div><p class="lb-hint" style="margin:0">어떤 감각으로 관찰할까요?</p><div class="lb-chips" role="group" aria-label="감각">'+P.senses.map(([t,ok,why],i)=>{const on=!!r.plan.s[i];return '<button type="button" class="lb-chip'+(marked&&on&&!ok?' lb-chipbad':'')+'" data-f="s'+i+'" data-ps="'+i+'" aria-pressed="'+on+'">'+esc(t)+'</button>'}).join('')+'</div>';
  if(marked){const badS=P.senses.filter((x,i)=>r.plan.s[i]&&!x[1]);let m;
   if(r.planOk)m='<div class="lb-msg lb-good">'+ic('check')+'<span>좋아요. 눈·손·귀로 소리가 날 때와 멈췄을 때를 견주어요.</span></div>';
   else m='<div class="lb-msg lb-try">'+ic('info')+'<span>'+[P.ways.some((x,i)=>!r.plan.w[i]&&x[1])?'빠진 관찰 방법이 있어요.':'',P.ways.some((x,i)=>r.plan.w[i]&&!x[1])?'빨간 방법은 하면 안 돼요.':'',badS.length?badS[0][2]:'',P.senses.some((x,i)=>!r.plan.s[i]&&x[1])?'빠진 감각이 있어요.':''].filter(Boolean).join(' ')+'</span></div>';
   h+='<div aria-live="polite">'+m+'</div>'}
  return cardHead('관찰 계획','관찰 방법 · 감각')+wrapB(h)}
 h+='<p class="lb-hint">조건마다 \'다르게\'나 \'같게\'를 골라요.</p><div role="group" aria-label="조건 고르기"'+(P.rows.length>6?' class="lb-planc"':'')+'>';
 P.rows.forEach(row=>{const [k,n,icn,isVar,vmsg]=row;if(k==='#'){h+='<p class="lb-sub2">'+esc(n)+'</p>';return}const c=r.plan[k];let cls='',msg='';
  if(r.planLast&&c&&r.planLast[k]===c){const ok=(isVar?'d':'s')===c;cls=ok?' lb-ok':' lb-no';if(!ok)msg='<p>'+ic('x')+'<span>'+(isVar?vmsg:'이것도 다르면 무엇 때문인지 알 수 없어요.')+'</span></p>'}
  h+='<div class="lb-crow'+cls+'"><span>'+ic(icn)+esc(n)+'</span><span class="lb-seg" role="group" aria-label="'+esc(n)+'"><button type="button" class="lb-d" data-f="p'+k+'d" data-plan="'+k+':d" aria-pressed="'+(c==='d')+'">다르게</button><button type="button" class="lb-s" data-f="p'+k+'s" data-plan="'+k+':s" aria-pressed="'+(c==='s')+'">같게</button></span>'+msg+'</div>'});
 h+='</div>';
 if(P.good){r.plan.g=r.plan.g||{};h+='<p class="lb-hint" style="margin:0">실험을 잘하는 방법(고르면 좋아요)</p><div class="lb-chips">'+P.good.map((t,i)=>'<button type="button" class="lb-chip" data-f="gd'+i+'" data-pg="'+i+'" aria-pressed="'+!!r.plan.g[i]+'">'+esc(t)+'</button>').join('')+'</div>'}
 if(marked){const vars=P.rows.filter(x=>x[0]!=='#'&&x[3]),nd=P.rows.filter(x=>x[0]!=='#'&&r.plan[x[0]]==='d').length;let m;
  if(r.planOk)m='<div class="lb-msg lb-good">'+ic('check')+'<span>좋아요. '+vars.map(x=>x[1]).join(', ')+'만 다르게 하고 나머지는 같게 해요.</span></div>';
  else if(nd===0)m='<div class="lb-msg lb-try">'+ic('info')+'<span>모두 같게 하면 비교할 수 없어요.</span></div>';
  else if(nd>vars.length)m='<div class="lb-msg lb-try">'+ic('info')+'<span>여러 가지를 다르게 하면 무엇 때문인지 알 수 없어요.</span></div>';
  else m='<div class="lb-msg lb-try">'+ic('info')+'<span>빨간 줄을 다시 생각해 봐요.</span></div>';
  h+='<div aria-live="polite">'+m+'</div>'}
 return cardHead('실험 계획','다르게 할 조건 · 같게 할 조건')+wrapB(h)}
function predCard(){const v=V(),r=R(),lock=predLocked();let h='';
 v.pred.forEach((q,j)=>{h+=(v.pred.length>1?'<p class="lb-q">'+esc(q.q)+'</p>':'')+'<div class="lb-opts" role="group" aria-label="'+esc(q.q)+'">';
  q.o.forEach((t,i)=>{const on=r.pred[j]===i;h+='<button type="button" class="lb-opt'+(v.pred.length>1?' lb-optsm':'')+'" data-f="o'+j+i+'" data-pred="'+j+':'+i+'" aria-pressed="'+on+'"'+(lock?' disabled':'')+'><i>'+(on?ic('check'):'')+'</i><span>'+esc(t)+'</span></button>'});h+='</div>'});
 h+='<div><label class="lb-label" for="lbWhy">그렇게 생각한 까닭 (쓰고 싶으면)</label><input id="lbWhy" class="lb-input" maxlength="60" placeholder="왜냐하면 ~ 때문이에요." value="'+esc(r.why)+'"'+(lock?' readonly':'')+'></div>';
 if(lock)h+='<div class="lb-msg lb-plain">'+ic('lock')+'<span>관찰을 시작해서 예상을 바꿀 수 없어요.</span></div>';
 else if(r.pred.length)h+='<div class="lb-msg lb-plain" aria-live="polite">'+ic('info')+'<span>예상은 맞히기가 아니라 내 생각이에요.</span></div>';
 return cardHead('내 예상','고른 예상은 결과 한 장에 남아요')+wrapB(h)}
/* 기록 줄 하나 */
function rowUI(row){const r=R(),R0=ROWS[row],x=r.rec[row]||{},done=!!x.ok,wr=UI.wrong[row]||[];let h='<div class="lb-mrow'+(done?' lb-mdone':'')+'"><div class="lb-mrh"><b>'+esc(R0.n)+'</b>'+(done?'<span class="lb-okt">'+ic('check')+'기록했어요</span>':'')+'</div>';
 const seg=(key,opts,val,dis,lab)=>'<span class="lb-seg lb-kseg'+(wr.indexOf(key)>=0?' lb-wrongc':'')+'" role="group" aria-label="'+esc(lab)+'">'+opts.map((o,i)=>'<button type="button" data-f="'+row+key+i+'" data-dr="'+row+':'+key+':'+i+'" aria-pressed="'+(val===i)+'" class="'+(i?'lb-d':'lb-s')+'"'+(dis?' disabled':'')+'>'+esc(o)+'</button>').join('')+'</span>';
 const D=UI.draft[row]=UI.draft[row]||{};
 if(R0.t==='onoff'){const sOn=!!r.seen[row+':on'],sOff=!!r.seen[row+':off'];const vv=done?x:D;
  h+='<div class="lb-cells"><span class="lb-cl">소리 날 때</span>'+seg('on',R0.o,vv.on,done||!sOn,R0.n+' 소리 날 때')+'<span class="lb-cl">멈췄을 때</span>'+seg('off',R0.o,vv.off,done||!sOff,R0.n+' 멈췄을 때')+'</div>';
  if(!done&&(!sOn||!sOff))h+='<p class="lb-hint2">'+(!sOn?'먼저 소리를 내고 살펴봐요.':'소리가 멈춘 뒤에도 살펴봐요.')+'</p>';
  if(!done)h+='<button type="button" class="lb-rec-btn" data-act="rowrec" data-row="'+row+'" data-f="rr'+row+'"'+(vv.on!=null&&vv.off!=null?'':' disabled')+'>'+ic('check')+'기록하기</button>'}
 if(R0.t==='num3'){const vals=x.v||[],pend=r.pend[row];
  h+='<div class="lb-trials">'+[0,1,2].map(i=>{const got=vals[i]!=null,cur=!got&&i===vals.length;
   return '<label class="lb-trial'+(cur&&pend!=null?' lb-tcur':'')+'"><span>'+(i+1)+'번</span>'+(got?'<b>'+vals[i]+'</b>':'<input class="lb-num" inputmode="numeric" maxlength="4" autocomplete="off" data-f="in'+row+i+'" data-in="'+row+'" aria-label="'+esc(R0.n)+' '+(i+1)+'번 숫자" value="'+(cur?esc(UI.inp[row]||''):'')+'"'+(cur&&pend!=null?'':' disabled')+'>')+'</label>'}).join('')+
   (vals.length<3?'<button type="button" class="lb-mini" data-act="trial" data-row="'+row+'" data-f="tr'+row+'"'+(pend!=null?'':' disabled')+'>'+ic('check')+'적기</button>':'')+'</div>';
  if(vals.length<3&&pend==null)h+='<p class="lb-hint2">아래 단추를 눌러 '+(vals.length+1)+'번째로 재어요.</p>';
  if(pend!=null)h+='<p class="lb-hint2">'+(V().no===2?'측정기':'앱')+' 화면의 숫자를 보고 써요. 화면이 비면 그 단추를 다시 눌러요.</p>';
  if(vals.length===3){const vv=done?x:D;const order=UI.sort[row]?vals.map((v,i)=>[v,i]).sort((a,b)=>a[0]-b[0]):vals.map((v,i)=>[v,i]);
   h+='<div class="lb-midrow"><span class="lb-cl">가운데 숫자</span><span class="lb-seg lb-kseg'+(wr.indexOf('mid')>=0?' lb-wrongc':'')+'" role="group" aria-label="가운데 숫자 고르기">'+order.map(([v,i])=>'<button type="button" data-f="'+row+'m'+i+'" data-dr="'+row+':mid:'+i+'" aria-pressed="'+(vv.mid===i)+'"'+(done?' disabled':'')+'>'+v+'</button>').join('')+'</span>'+(done?'':'<button type="button" class="lb-mini" data-act="sort" data-row="'+row+'" data-f="so'+row+'" aria-pressed="'+!!UI.sort[row]+'">작은 것부터</button>')+'</div>';
   h+='<div class="lb-cells"><span class="lb-cl">'+(V().no===2?'떨림':'높낮이')+'</span>'+seg('look',R0.lk,vv.look,done,R0.n+' '+(V().no===2?'떨림':'높낮이'))+'</div>';
   if(!done)h+='<button type="button" class="lb-rec-btn" data-act="rowrec" data-row="'+row+'" data-f="rr'+row+'"'+(vv.mid!=null&&vv.look!=null?'':' disabled')+'>'+ic('check')+'기록하기</button>'}}
 if(R0.t==='hear'){const sn=!!r.seen[row];const vv=done?x:D;
  h+='<div class="lb-cells lb-c1">'+seg('v',R0.o,vv.v,done||!sn,R0.n)+'</div>';
  if(!done&&!sn)h+='<p class="lb-hint2">'+(row==='first'?'스피커를 켜고 들어요.':row==='low'?'스피커를 켠 채 손잡이를 다섯 번 넘게 당겨요. ('+r.pulls+'번)':row==='again'?'스피커를 켠 채 손잡이를 다섯 번 넘게 당겨요. ('+(r.repPulls||0)+'번)':row==='again2'?'먼저 위 줄을 적고, 스피커를 켠 채 공기를 다시 넣어요.':'스피커를 켠 채 공기를 다시 넣어요.')+'</p>';
  if(!done)h+='<button type="button" class="lb-rec-btn" data-act="rowrec" data-row="'+row+'" data-f="rr'+row+'"'+(vv.v!=null?'':' disabled')+'>'+ic('check')+'기록하기</button>'}
 if(R0.t==='count'){const sn=!!r.seen[row];const vv=done?x:D;const n=vv.n==null?0:vv.n;
  h+='<div class="lb-cells lb-cnt">'+seg('heard',['들렸어요','안 들렸어요'],vv.heard==null?null:(vv.heard?0:1),done||!sn,R0.n+' 들렸나요')+'<span class="lb-step"><button type="button" data-f="'+row+'-" data-cn="'+row+':-1" aria-label="'+esc(R0.n)+' 들은 수 하나 빼기"'+(done||!sn||n<=0?' disabled':'')+'>'+ic('minus')+'</button><output aria-label="들은 수">'+n+'번</output><button type="button" data-f="'+row+'+" data-cn="'+row+':1" aria-label="'+esc(R0.n)+' 들은 수 하나 더하기"'+(done||!sn||n>=9?' disabled':'')+'>'+ic('plus')+'</button></span></div>';
  if(!done&&!sn)h+='<p class="lb-hint2">아래 단추를 눌러 듣고, 들은 수를 세어요.</p>';
  if(!done)h+='<button type="button" class="lb-rec-btn" data-act="rowrec" data-row="'+row+'" data-f="rr'+row+'"'+(vv.heard!=null?'':' disabled')+'>'+ic('check')+'기록하기</button>';
  else h+=r.reveal[row]?'<p class="lb-hint2">친구는 '+R0.taps+'번 두드렸어요.'+(R0.heard?'':' 다른 책상에서는 들리지 않았어요.')+'</p>':'<button type="button" class="lb-mini" data-act="reveal" data-row="'+row+'" data-f="rv'+row+'">친구가 두드린 수 보기</button>'}
 if(UI.fb[row])h+='<div class="lb-msg '+(UI.fb[row][0]?'lb-good':'lb-try')+'" role="status">'+ic(UI.fb[row][0]?'check':'info')+'<span>'+UI.fb[row][1]+'</span></div>';
 return h+'</div>'}
function measCard(){const v=V(),r=R(),s=curStep();let h='';
 if(s.id==='repeat')h+='<p class="lb-q">스피커를 켠 채 공기를 빼고, 다시 넣으며 들어요.</p>';
 s.rows.forEach(row=>{h+=rowUI(row)});
 return cardHead('기록하기',s.id==='repeat'?'한 번 더 하고 들은 것을 적어요':'내가 보고 듣고 잰 것을 적어요')+wrapB(h)}
function moreCard(){const v=V(),r=R(),Q={2:['공이 더 높이 튄 것은?',['세게 칠 때','약하게 칠 때'],0,'세게 치면 북이 크게 떨려 공이 높이 튀어요.'],3:['더 높은 소리는?',['가 소리','나 소리'],0,'모기는 높고 작은 소리, 천둥은 낮고 큰 소리예요. 높낮이와 세기는 달라요.'],5:['소리가 잘 들린 것은?',['실이 팽팽할 때','실이 느슨할 때'],0,'실이 팽팽할 때 떨림이 실을 따라 잘 전달돼요.']}[v.no];
 const ans=r.more.a;let h='<p class="lb-q">'+Q[0]+'</p><p class="lb-hint">아래 단추를 눌러 두 가지를 모두 해 보고 골라요.</p><div class="lb-opts">'+Q[1].map((t,i)=>'<button type="button" class="lb-opt lb-optsm" data-f="mq'+i+'" data-mq="'+i+'" aria-pressed="'+(ans===i)+'"'+(UI.mq.both?'':' disabled')+'><i>'+(ans===i?ic('check'):'')+'</i><span>'+t+'</span></button>').join('')+'</div>';
 if(ans!=null)h+='<div class="lb-msg '+(ans===Q[2]?'lb-good':'lb-try')+'">'+ic(ans===Q[2]?'check':'info')+'<span>'+(ans===Q[2]?Q[3]:'다시 들어 보고 견주어 봐요.')+'</span></div>';
 h+='<p class="lb-hint2">더 알아보기는 결과 한 장에 들어가지 않아요. 건너뛰어도 돼요.</p>';
 return cardHead('더 알아보기','해도 되고 건너뛰어도 돼요')+wrapB(h)}
function cWrong(v,r,i){return !!(r.clast&&r.bl[i]&&r.bl[i]===r.clast[i]&&r.bl[i]!==v.ans[i])}
function cChanged(r){return !r.clast||r.bl.some((w,i)=>w!==r.clast[i])}
function frameHTML(v,bl,mode){const r=R();let t=esc(v.frame);
 return t.replace(/\{(\d)\}/g,(m,i)=>{i=+i;const w=bl[i]||'',J=v.jo[i];
  let s;if(mode==='edit'){const st=w?' lb-fill':'';const f=UI.focus===i?' lb-focus':'';const wr=cWrong(v,r,i)?' lb-wrong':'';
   s='<button type="button" class="lb-blank'+st+f+wr+'" data-f="b'+i+'" data-blank="'+i+'" aria-label="빈칸 '+(i+1)+(w?': '+w:': 비어 있음')+(wr?', 다시 생각해 봐요':'')+'">'+(w?esc(w):'&#8203;')+'</button>'}
  else s=w?'<mark>'+esc(w)+'</mark>':'<span class="lb-sh-gap">______</span>';
  if(J)s+=w?(jo(w,J[0],J[1]).slice(w.length)):J[0]+'('+J[1]+')';return s})}
function conclCard(){const v=V(),r=R();let h='';
 if(r.pred.length)h+='<div class="lb-mine"><b>내 예상</b> '+v.pred.map((q,j)=>r.pred[j]!=null?esc(q.o[r.pred[j]]):'').join(' / ')+'</div>';
 if(v.no===5&&!(DB.runs.e4&&DB.runs.e4.fin))h+='<div class="lb-msg lb-plain">'+ic('info')+'<span>첫 칸은 실험 4에서 확인해요. 스피커 소리는 공기를 통해 전달돼요.</span></div>';
 h+='<p class="lb-frame">'+frameHTML(v,r.bl,'edit')+'</p><div class="lb-chips" role="group" aria-label="낱말 카드">'+v.chips.map((c,i)=>'<button type="button" class="lb-chip" data-f="c'+i+'" data-chip="'+i+'">'+esc(c)+'</button>').join('')+'</div>';
 if(r.cmp)h+='<div class="lb-cmp" role="status"><b>'+ic('flask')+'교과서 결론</b>'+esc(v.book)+'</div><div class="lb-msg lb-good">'+ic('check')+'<span>내 결론이 기록과 맞아요.</span></div>';
 else if(r.clast&&!cChanged(r)){const wr=r.bl.map((w,i)=>i).filter(i=>cWrong(v,r,i));h+='<div class="lb-msg lb-try" role="status">'+ic('info')+'<span>빨간 빈칸을 기록과 다시 견주어 봐요.'+(r.ctry>=2&&wr.length?' '+wr.map(i=>esc(v.hint[i])).join(' '):'')+'</span></div>'}
 return cardHead('결론 쓰기','빈칸에 낱말을 넣어요')+wrapB(h)}

/* ───────── 결과 한 장 ───────── */
function barChart(v,r){const rows=v.rows,vals=rows.map(k=>{const x=r.rec[k];return x&&x.ok?x.v[x.mid]:null});const mx=Math.max(1,...vals.filter(x=>x!=null))*1.15;
 const W=340,H=150,l=8,bw=56;let g='<svg class="lb-chart" viewBox="0 0 '+W+' '+(H+44)+'" role="img" aria-label="가운데 숫자 막대그래프">';
 rows.forEach((k,i)=>{const x=l+i*(bw+26),v0=vals[i],hh=v0==null?0:v0/mx*H;g+='<rect x="'+x+'" y="'+(H-hh)+'" width="'+bw+'" height="'+hh+'" fill="'+(i%2?'#A9541A':'#2F68B0')+'"/>'+(v0!=null?'<text x="'+(x+bw/2)+'" y="'+(H-hh-5)+'" text-anchor="middle" font-size="16" font-weight="700" fill="#141A26">'+v0+'</text>':'')+
  '<text x="'+(x+bw/2)+'" y="'+(H+18)+'" text-anchor="middle" font-size="15" fill="#141A26">'+esc(ROWS[k].n.replace(/^(음판|고무줄|칼림바|우쿨렐레) /,''))+'</text><text x="'+(x+bw/2)+'" y="'+(H+36)+'" text-anchor="middle" font-size="15" fill="#4B5465">'+esc(ROWS[k].n.split(' ')[0])+'</text>'});
 return g+'<path d="M0 '+H+' H'+W+'" stroke="#9E968A"/></svg>'}
function sheetTable(v,r){const t=ROWS[v.rows[0]].t;let h='<table class="lb-tbl"><caption class="lb-sr">관찰 기록</caption><thead><tr><th scope="col">무엇을</th>';
 const cell=s=>'<td>'+(s==null?'—':esc(s))+'</td>';
 if(t==='onoff')h+='<th scope="col">소리 날 때</th><th scope="col">멈췄을 때</th></tr></thead><tbody>'+v.rows.map(k=>{const x=r.rec[k],R0=ROWS[k];return '<tr><th scope="row">'+esc(R0.n)+'</th>'+cell(x&&x.ok?R0.o[x.on]:null)+cell(x&&x.ok?R0.o[x.off]:null)+'</tr>'}).join('');
 if(t==='num3')h+='<th scope="col">1번</th><th scope="col">2번</th><th scope="col">3번</th><th scope="col">가운데</th><th scope="col">'+(v.no===2?'떨림':'높낮이')+'</th></tr></thead><tbody>'+v.rows.map(k=>{const x=r.rec[k]||{},R0=ROWS[k],vs=x.v||[];return '<tr><th scope="row">'+esc(R0.n)+'</th>'+[0,1,2].map(i=>cell(vs[i])).join('')+cell(x.ok?x.v[x.mid]:null)+cell(x.ok?R0.lk[x.look]:null)+'</tr>'}).join('');
 if(t==='hear')h+='<th scope="col">들린 정도</th></tr></thead><tbody>'+v.rows.map(k=>{const x=r.rec[k],R0=ROWS[k];return '<tr><th scope="row">'+esc(R0.n)+'</th>'+cell(x&&x.ok?R0.o[x.v]:null)+'</tr>'}).join('');
 if(t==='count')h+='<th scope="col">들렸나요</th><th scope="col">들은 수</th></tr></thead><tbody>'+v.rows.map(k=>{const x=r.rec[k],R0=ROWS[k];return '<tr><th scope="row">'+esc(R0.n)+'</th>'+cell(x&&x.ok?(x.heard?'들렸어요':'안 들렸어요'):null)+cell(x&&x.ok?x.n+'번':null)+'</tr>'}).join('');
 return h+'</tbody></table>'}
function planSummary(v,r){const P=v.plan;if(!r.planOk)return '<p>(계획을 건너뛰었어요)</p>';if(P.type==='pick'){const w=r.plan.w||{},sn=r.plan.s||{};return '<p>'+P.ways.filter((x,i)=>w[i]).map(x=>esc(x[0])).join(' · ')+'<br>감각: '+P.senses.filter((x,i)=>sn[i]).map(x=>x[0]).join(', ')+'</p>'}
 return '<div class="lb-sh-tags">'+P.rows.filter(x=>x[0]!=='#').map(x=>{const d=r.plan[x[0]]==='d';return '<span class="lb-sh-tag'+(d?' lb-d':'')+'">'+(d?'다르게: ':'같게: ')+esc(x[1])+'</span>'}).join('')+'</div>'}
function sheetHTML(){const v=V(),r=R();const done=v.steps.map(id=>stepDef(v,id)).filter(s=>(s.k==='scene'||s.k==='meas')&&s.id!=='tools');
 const today=new Date();const ds=today.getFullYear()+'. '+(today.getMonth()+1)+'. '+today.getDate()+'.';
 let h='<article class="lb-sheet" id="lbSheet" aria-label="실험 결과 한 장"><div class="lb-sh-in"><header class="lb-sh-h"><div><h2>실험 결과 한 장 · '+esc(v.title)+'</h2><span>탐구 실험관 · 3학년 2학기 과학 · 3. 소리의 성질 · '+ds+'</span></div><div class="lb-sh-name">이름 <u>'+(esc(DB.name)||'&nbsp;')+'</u></div></header><div class="lb-sh-grid"><div class="lb-sh-col">';
 h+='<section class="lb-sh-sec"><h3><i></i>실험 문제</h3><p><b>'+esc(v.q)+'</b></p>'+planSummary(v,r)+'</section>';
 h+='<section class="lb-sh-sec lb-sh-po"><h3><i></i>실험한 차례</h3><div class="lb-sh-steps">'+done.map((s,i)=>'<div><b>'+(i+1)+'.</b> '+esc(s.t)+'</div>').join('')+'</div></section>';
 h+='<section class="lb-sh-sec"><h3><i></i>내 예상</h3><p>'+v.pred.map((q,j)=>(v.pred.length>1?esc(q.q)+' ':'')+(r.pred[j]!=null?esc(q.o[r.pred[j]]):'(고르지 않았어요)')).join('<br>')+(r.why?'<br>까닭: '+esc(r.why):'')+'</p></section>';
 h+='</div><div class="lb-sh-col"><section class="lb-sh-sec"><h3><i></i>관찰 기록</h3>'+sheetTable(v,r)+(ROWS[v.rows[0]].t==='num3'?barChart(v,r):'')+'</section>';
 h+='<section class="lb-sh-sec"><h3><i></i>내 결론</h3><div class="lb-sh-box"><p class="lb-sh-concl">'+frameHTML(v,r.bl,'sheet')+'</p>'+(r.cmp?'<p class="lb-sh-book">교과서 결론: '+esc(v.book)+'</p>':'')+'</div></section>';
 h+='</div></div><section class="lb-sh-sec lb-sh-po lb-sh-fill"><h3><i></i>새로 알게 된 것 · 더 알고 싶은 것</h3><div class="lb-sh-lines">'+'<div class="lb-ln"></div>'.repeat(9)+'</div></section>';
 h+='<footer class="lb-sh-f"><span>아주 단순하게 만든 모형의 결과예요. 실제 교실에서는 숫자와 소리가 조금씩 달라요.</span><span>만든 사람: 초등교사 홍지희</span></footer></div></article>';
 return h}
function sheetBody(){return '<div class="lb-sheetwrap"><div class="lb-sheetside"><div class="lb-sideinfo"><label class="lb-label" for="lbName" style="margin:0">이름</label><input id="lbName" class="lb-input" maxlength="12" autocomplete="off" placeholder="이름을 써요" value="'+esc(DB.name)+'"><span>이름은 이 기기에만 저장돼요.</span></div>'+
 '<button type="button" class="lb-btn" data-act="print" data-f="print">'+ic('print')+'인쇄하기</button><div class="lb-sideinfo"><span><b>A4 한 장</b>으로 인쇄돼요. 공책에 붙여도 좋아요.</span><span>실제 실험 결과와 견주어 봐요.</span></div></div>'+sheetHTML()+'</div>'}

/* ───────── 그리기 ───────── */
function set(el,h){if(!el||el._h===h)return false;const a=document.activeElement,f=a&&el.contains(a)&&a.dataset?a.dataset.f:null;const sel=a&&a.tagName==='INPUT'?[a.selectionStart,a.selectionEnd]:null;el.innerHTML=h;el._h=h;if(f){const n=el.querySelector('[data-f="'+f+'"]');if(n&&!n.disabled){n.focus({preventScroll:true});if(sel&&n.setSelectionRange)try{n.setSelectionRange(sel[0],sel[1])}catch(e){}}}return true}
function render(){const H=document.documentElement;H.classList.toggle('lb-big',!!DB.ui.big);
 $('#lbOpenMi').setAttribute('aria-pressed',!!DB.ui.open);$('#lbBigMi').setAttribute('aria-pressed',!!DB.ui.big);
 const mb=$('#lbMute');mb.setAttribute('aria-pressed',!!DB.ui.mute);mb.querySelector('span').textContent=DB.ui.mute?'소리 꺼짐':'소리 켜짐';
 const main=$('#lbMain');
 if(!DB.cur||!EXPS[DB.cur]){H.classList.remove('lb-inrun');$('#lbSub').textContent='3학년 2학기 과학 · 3단원 소리의 성질';$('#lbChoose').hidden=true;$('#lbClearMi').hidden=true;
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
 else{if(body.dataset.k!=='main'){body.dataset.k='main';body._h=null;body.innerHTML='<div class="lb-col"><div class="lb-scene" id="lbScene"></div><div class="lb-leg" id="lbLeg"></div><div class="lb-notes" id="lbNotes"></div></div><aside class="lb-card" id="lbCard" tabindex="-1" aria-label="기록 카드"></aside>';body._h='x'}
  renderScene();set($('#lbNotes'),notesHTML(s));
  const card=$('#lbCard');const ch=s.k==='plan'?planCard():s.k==='pred'?predCard():s.k==='meas'?measCard():s.k==='more'?moreCard():s.k==='concl'?conclCard():'';card.hidden=!ch;set(card,ch)}
 set($('#lbFoot'),footHTML(v,r,s));
 fitAll();clearTimeout(render.ft);render.ft=setTimeout(fitAll,350)}
function fitBox(box,inner,min){if(!box||!inner)return;inner.style.zoom='';if(narrow()||!box.clientHeight)return;if(box.scrollHeight<=box.clientHeight+1)return;let z=Math.max(min,box.clientHeight/box.scrollHeight);inner.style.zoom=z.toFixed(3);let n=0;while(box.scrollHeight>box.clientHeight+1&&z>min&&n++<12){z=Math.max(min,z-.02);inner.style.zoom=z.toFixed(3)}}
function fitAll(){fitBox($('#lbCard .lb-card-b'),$('#lbCard .lb-fit'),.6);fitBox($('#lbRail'),$('#lbRail .lb-rwrap'),.7);fitBox($('#lbSheet'),$('#lbSheet .lb-sh-in'),.56)}
function renderScene(){const v=V(),r=R(),s=curStep(),el=$('#lbScene');if(!el)return;NAR=narrow();LEG=[];
 let over='';const pick=s.opts&&!r.done[s.id]&&!fxOn(s.id);
 if(s.k==='scene'&&r.done[s.id]&&!fxOn(s.id))over+='<button type="button" class="lb-replay" data-act="replay" data-f="replay">'+ic('replay')+'처음부터 보기</button>';
 if(pick)over+='<div class="lb-ask">'+ic('hand')+esc(s.ask)+'</div>';
 if((s.k==='meas'||s.k==='more')&&!AU.ok())over+='<div class="lb-mutebar">'+ic('info')+(AU.fail?'이 기기에서는 소리를 낼 수 없어요 · 그림으로 봐요':'소리 꺼짐 · 그림으로 봐요')+'</div>';
 if(UI.spk)over+='<div class="lb-spkon">'+ic('speak')+'스피커 소리 나는 중</div>';
 if(UI.toast)over+='<div class="lb-toast '+(UI.toastK==='info'?'lb-toast3':'lb-toast2')+'" role="status">'+esc(UI.toast)+'</div>';
 const sv=sceneSVG();NAR=false;set(el,over+sv);
 const lg=$('#lbLeg');if(lg)set(lg,LEG.length?LEG.map(x=>'<span class="lb-lg">'+esc(x[1])+'</span>').join(''):'')}
function notesHTML(s){if(!s.why&&!s.care)return '';const hideWhy=s.k==='more'&&R().more.a==null;let h=hideWhy?'<div class="lb-note lb-know">'+ic('info')+'<div><b>알아 두어요</b>두 가지를 모두 해 보고 골라요.</div></div>':'<div class="lb-note lb-why">'+ic('why')+'<div><b>왜 그렇게 할까요?</b>'+esc(s.why)+'</div></div>';
 if(s.care)h+=s.care[0]==='care'?'<div class="lb-note lb-care">'+ic('care')+'<div><b>조심해요</b>'+esc(s.care[1])+'</div></div>':'<div class="lb-note lb-know">'+ic('info')+'<div><b>알아 두어요</b>'+esc(s.care[1])+'</div></div>';
 return h}
function stepName(s){return !R().planOk&&s.n0?s.n0:s.n}
function railHTML(){const v=V(),r=R(),N=v.steps.length;let h='<div class="lb-mtop"><b>'+(r.step+1)+'/'+N+' · '+esc(stepName(stepOf(r.step)))+'</b><span class="lb-mbar" aria-hidden="true">'+v.steps.map((x,i)=>'<i class="'+(i<=r.step?'lb-d':'')+'"></i>').join('')+'</span><button type="button" class="lb-mlist" data-act="rail" data-f="mlist" aria-expanded="'+UI.rail+'">'+ic('list')+'단계 목록</button></div>';
 h+='<div class="lb-rwrap"><p class="lb-rk">실험 '+v.no+'</p><h2>'+esc(v.name)+'</h2><div class="lb-rlist">';
 let g=-1;v.steps.forEach((id,i)=>{const s=stepOf(i);if(s.g!==g){g=s.g;h+='<div class="lb-grp">'+GROUPS[g]+'</div>'}
  const done=isDone(i)&&i!==r.step&&(s.k!=='more'||r.max>i),now=i===r.step,ok=canGo(i);
  h+='<button type="button" class="lb-rs'+(now?' lb-now':done?' lb-done':'')+'" data-go="'+i+'" data-f="g'+i+'"'+(now?' aria-current="step"':'')+(ok?'':' disabled')+'><i>'+(done?ic('check'):i+1)+'</i>'+esc(stepName(s))+(s.k==='more'?'<small>선택</small>':'')+'<span class="lb-sr">'+(done?' (끝냄)':now?' (지금 단계)':ok?'':' (아직)')+'</span></button>'});
 h+='</div><div class="lb-rail-note"><p>아주 단순하게 만든 모형이에요. 실제로는 숫자가 조금씩 달라요.</p><p>만든 사람: 초등교사 홍지희</p></div></div>';
 return h}
/* 이 단계의 행동 단추 */
function actsOf(s){const r=R(),A=[],busy=!!UI.fx||!!UI.play;
 const rowAct=(row,label)=>{const x=r.rec[row]||{},n=(x.v||[]).length;A.push({id:row,label:r.pend[row]!=null?label+' (다시 보기)':label,dis:busy||n>=3})};
 const spk={id:'spk',label:UI.spk?'스피커 멈추기':'스피커 켜기',icon:'speak',pressed:UI.spk};
 switch(s.id){
  case 'neck':A.push({id:'neck',label:'누르고 있으면 "아~"',hold:1,icon:'hand'});break;
  case 'band':A.push({id:'pluck',label:'고무줄 튕기기',dis:busy},{id:'slow',label:'느리게 보기',pressed:UI.slow,icon:'eye'});break;
  case 'fork':A.push({id:'forkon',label:'두드리고 손 대기',dis:busy},{id:'forkoff',label:'손으로 꽉 잡기',dis:busy||!r.seen['fork:on']});break;
  case 'water':A.push({id:'wateron',label:'두드려 물에 대기',dis:busy},{id:'wateroff',label:'소리가 멈춘 뒤 대기',dis:busy||!r.seen['water:on']});break;
  case 'glock':rowAct('gs','세게 치기');rowAct('gw','약하게 치기');break;
  case 'band2':rowAct('bs','높이 당겼다 놓기');rowAct('bw','낮게 당겼다 놓기');break;
  case 'kal':rowAct('ks','짧은 건반 튕기기');rowAct('kl','긴 건반 튕기기');break;
  case 'uke':rowAct('us','짧게 잡고 튕기기');rowAct('ul','길게 잡고 튕기기');break;
  case 'on':A.push(spk);break;
  case 'pull':A.push({id:'pump',label:'손잡이 당기기 ('+r.pulls+'번)',dis:!!UI.fx},spk);break;
  case 'refill':A.push({id:'refill',label:'공기 넣기',dis:!!UI.fx||r.air>=.99},spk);break;
  case 'repeat':A.push({id:'pump',label:'손잡이 당기기 ('+(r.repPulls||0)+'번)',dis:!!UI.fx},{id:'refill',label:'공기 넣기',dis:!!UI.fx||r.air>=.99},spk);break;
  case 'cast':A.push({id:'co',label:'물 밖에서 부딪치기',dis:busy||rowDone('co')},{id:'ci',label:'물속에서 부딪치기',dis:busy||rowDone('ci')});break;
  case 'desk':A.push({id:'prep',label:'귀 대고 눈 감고 귀 막기',pressed:UI.prep,dis:busy||UI.prep},{id:'dd',label:'두드려요 · 다른 책상',dis:busy||!UI.prep||rowDone('dd')},{id:'ds',label:'두드려요 · 같은 책상',dis:busy||!UI.prep||rowDone('ds')});break;
  case 'more':if(V().no===2)A.push({id:'drumS',label:'세게 치기',dis:busy},{id:'drumW',label:'약하게 치기',dis:busy});if(V().no===3)A.push({id:'hlA',label:'가 소리 듣기',dis:busy},{id:'hlB',label:'나 소리 듣기',dis:busy});if(V().no===5)A.push({id:'taut',label:'팽팽하게 하고 듣기',dis:busy},{id:'loose',label:'느슨하게 하고 듣기',dis:busy});break}
 return A}
function footHTML(v,r,s){let h='<button type="button" class="lb-btn" data-act="prev" data-f="prev"'+(r.step===0?' disabled':'')+'>'+ic('left')+'이전</button><div class="lb-fmid">';
 const dots='<span class="lb-prog" aria-hidden="true">'+v.steps.map((x,i)=>'<i class="'+(i<r.step?'lb-d':i===r.step?'lb-n':'')+'"></i>').join('')+'</span>';
 let mid='',pri='이어서',priOn=canNext(),priAct='next';
 if(s.k==='scene'){if(s.opts&&!r.done[s.id]&&!fxOn(s.id))mid='<span class="lb-picks" role="group" aria-label="'+esc(s.ask)+'">'+s.opts.map((o,i)=>'<button type="button" class="lb-doit lb-pk" data-act="pick" data-i="'+i+'" data-f="pk'+i+'">'+esc(o.t)+'</button>').join('')+'</span>';
  else if(!r.done[s.id]||fxOn(s.id))mid='<button type="button" class="lb-doit" data-act="doit" data-f="doit"'+(UI.fx?' disabled':'')+'>'+ic('hand')+esc(s.act||'보는 중')+'</button>';else mid='<span>잘했어요. 이어서 가요.</span>'+dots}
 else if(s.k==='plan'){const all=v.plan.type==='pick'?Object.values(r.plan.w||{}).some(Boolean):v.plan.rows.filter(x=>x[0]!=='#').every(p=>r.plan[p[0]]);if(!r.planOk)mid='<button type="button" class="lb-doit" data-act="check" data-f="doit"'+(all&&planChanged(r)?'':' disabled')+'>'+ic('check')+'계획 확인하기</button>';else mid='<span>계획을 세웠어요.</span>'+dots}
 else if(s.k==='pred'){mid=isDone(r.step)?'<span>예상을 남겼어요.</span>'+dots:'<span>예상을 골라요.</span>'+dots}
 else if(s.k==='meas'||s.k==='more'){const A=actsOf(s);mid='<span class="lb-picks" role="group" aria-label="실험하기">'+A.map(a=>'<button type="button" class="lb-doit lb-pk'+(a.hold?' lb-hold':'')+(UI.attn?' lb-attn':'')+'"'+(a.hold?' data-hold="'+a.id+'"':' data-act="x" data-x="'+a.id+'"')+' data-f="x'+a.id+'"'+(a.pressed!=null?' aria-pressed="'+!!a.pressed+'"':'')+(a.dis?' disabled':'')+'>'+(a.icon?ic(a.icon):'')+esc(a.label)+'</button>').join('')+'</span>'}
 else if(s.k==='concl'){const all=r.bl.length&&r.bl.every(x=>x);if(!r.cmp)mid='<button type="button" class="lb-doit" data-act="cmp" data-f="doit"'+(all&&cChanged(r)?'':' disabled')+'>'+ic('flask')+'기록과 견주기</button>';else mid='<span>결론을 썼어요.</span>'+dots}
 else if(s.k==='sheet'){mid='<span>'+(r.fin?'실험을 마쳤어요.':'아직 끝내지 않은 단계가 있어요.')+'</span>'+dots;pri='실험 고르기로';priOn=true;priAct='home'}
 return h+mid+'</div><button type="button" class="lb-btn lb-pri" data-act="'+priAct+'" data-f="pri"'+(priOn?'':' disabled')+'>'+esc(pri)+ic('right')+'</button>'}

/* ───────── 실험 고르기 ───────── */
function homeArt(no){NAR=true;LEG=[];let g=bg({}),vb='120 70 720 420';
 if(no===1)g+=boxBand(330,{})+fork(690,290,{});
 if(no===2)g+=glock(360,{})+meter(730,300,{});
 if(no===3)g+=kalimba(480,{});
 if(no===4){g+=jar(470,{air:1});vb='160 60 720 420'}
 if(no===5)g+=tank(360,{full:1})+castanet(360,250,1.2)+desk(560,330);
 const s=svg(g,'실험 '+no+' 처음 모습',vb);NAR=false;LEG=[];return s}
function homeHTML(){const card=k=>{const v=EXPS[k],r=DB.runs[k];const st=r?(r.fin?'끝냄 · 결과 보기':(r.step+1)+'단계부터 이어서'):'실험 시작하기';
 return '<section class="lb-exc" aria-labelledby="lbE'+v.no+'"><div class="lb-exc-art">'+homeArt(v.no)+'</div><div class="lb-exc-b"><h2 id="lbE'+v.no+'"><em>실험 '+v.no+'</em>'+esc(v.name)+'</h2><p class="lb-exp">'+esc(v.sub)+'</p><button type="button" class="lb-pickb" data-pick="'+k+'" data-f="k'+k+'"><i>'+ic(['','hand','speak','music','air','water'][v.no])+'</i><span><b>'+st+'</b><span>교과서 실험</span></span>'+(r&&r.fin?'<small>'+ic('check')+'</small>':'')+'</button></div></section>'};
 return '<div class="lb-home"><div class="lb-home-h"><div class="lb-kick"><em>3학년 2학기 과학</em>3. 소리의 성질</div><h1>무엇을 실험할까요?</h1><p>실험을 한 단계씩 직접 해 봐요. 소리는 단추를 누를 때만 나요.</p></div>'+
 '<div class="lb-ex lb-ex5">'+['e1','e2','e3','e4','e5'].map(card).join('')+'</div>'+
 '<p class="lb-model">'+ic('info')+'<span>아주 단순하게 만든 모형이에요. 같은 조건이면 언제나 같은 결과가 나와요. 실제로는 숫자가 조금씩 달라요. 소리는 이 자료가 직접 만든 소리예요.</span></p></div>'}

/* ───────── 동작 ───────── */
function fx(id,ms,after){UI.fx={id,n:++UI.nonce};render();later(()=>{UI.fx=null;if(after)after();save();render()},ms)}
function doAnim(id,ms){fx(id,ms,()=>{const r=R();if(r)r.done[id]=true;const p=$('#lbFoot [data-act="next"]');if(p&&!p.disabled)p.focus({preventScroll:true})})}
function act(a,el){const v=V(),r=R();
 if(a==='prev'){if(r.step>0)go(r.step-1);return}
 if(a==='next'){if(canNext())go(r.step+1);return}
 if(a==='home'){DB.cur=null;resetUI();save();render();scrollTo(0,0);return}
 if(a==='doit'){const s=curStep();if(UI.fx)return;if(s.id==='kscan'){kscan();return}if(s.id==='kone')AU.tone({f:KF[3],peak:.18,dec:1});doAnim(s.id,s.dur||1500);return}
 if(a==='pick'){const s=curStep(),o=s.opts[+el.dataset.i];if(UI.fx||!o)return;if(o.bad){flash(o.bad);return}doAnim(s.id,s.dur||1500);return}
 if(a==='replay'){const s=curStep();if(s.id==='kscan'){kscan();return}if(s.id==='kone')AU.tone({f:KF[3],peak:.18,dec:1});doAnim(s.id,s.dur||1500);return}
 if(a==='check'){if(!planChanged(r))return;r.planLast=JSON.parse(JSON.stringify(r.plan));r.planOk=planGood(v,r);save();render();return}
 if(a==='x'){doX(el.dataset.x);return}
 if(a==='trial'){trial(el.dataset.row);return}
 if(a==='sort'){UI.sort[el.dataset.row]=!UI.sort[el.dataset.row];render();return}
 if(a==='rowrec'){rowRec(el.dataset.row);return}
 if(a==='reveal'){r.reveal[el.dataset.row]=1;save();render();return}
 if(a==='cmp'){if(!r.bl.every(x=>x)||!cChanged(r))return;if(r.bl.every((w,i)=>w===v.ans[i])){r.cmp=true;r.clast=r.bl.slice()}else{r.ctry=(r.ctry||0)+1;r.clast=r.bl.slice()}save();render();return}
 if(a==='print'){window.print();return}
 if(a==='say'){toggleSay();return}
 if(a==='rail'){UI.rail=!UI.rail;render();return}}
function planGood(v,r){const P=v.plan;if(P.type==='pick')return P.ways.every((x,i)=>!!(r.plan.w||{})[i]===!!x[1])&&P.senses.every((x,i)=>!!(r.plan.s||{})[i]===!!x[1]);
 return P.rows.filter(x=>x[0]!=='#').every(x=>r.plan[x[0]]===(x[3]?'d':'s'))}
function kscan(){if(UI.fx)return;const order=[6,5,4,3,2,1,0];UI.fx={id:'kscan',n:++UI.nonce};
 order.forEach((k,i)=>later(()=>{UI.key=k;AU.tone({f:KF[k],type:'sine',peak:.18,dec:.7});renderScene()},i*480));
 later(()=>{UI.key=null;UI.fx=null;R().done.kscan=true;save();render()},order.length*480+400);render()}
/* 실험 단계의 행동 */
function doX(id){const v=V(),r=R();
 if(id==='pluck'){const slow=UI.slow;AU.tone({f:180,type:'triangle',peak:.2,dec:.8});r.seen['band:on']=1;fx('pluck',slow?4200:2100,()=>{r.seen['band:off']=1});return}
 if(id==='slow'){UI.slow=!UI.slow;render();return}
 if(id==='forkon'){AU.stopAll();UI.forkH=AU.tone({f:440,peak:.2,dec:2});r.seen['fork:on']=1;fx('forkon',1800);return}
 if(id==='forkoff'){if(UI.forkH)UI.forkH.stop(.08);AU.stopAll();r.seen['fork:off']=1;fx('forkoff',1200);return}
 if(id==='wateron'){AU.tone({f:440,peak:.18,dec:1.6});r.seen['water:on']=1;fx('wateron',1900);return}
 if(id==='wateroff'){r.seen['water:off']=1;fx('wateroff',1200);return}
 if(ROWS[id]&&ROWS[id].t==='num3'){const R0=ROWS[id],x=r.rec[id]=r.rec[id]||{v:[]};x.v=x.v||[];const n=x.v.length;if(n>=3)return;const val=r.pend[id]!=null?r.pend[id]:R0.v[n];
  if(v.no===2){const strong=R0.lt===0;if(id[0]==='g')AU.tone({f:1568,peak:strong?.3:.09,dec:1.4});else AU.tone({f:180,type:'triangle',peak:strong?.26:.09,dec:.8})}
  else AU.tone({f:R0.f,type:id[0]==='u'?'triangle':'sine',peak:.18,dec:1.1,lp:id[0]==='u'?2400:0});
  UI.mq={val,row:id,hl:false};r.pend[id]=val;fx(id,1300,()=>{const n2=$('[data-in="'+id+'"]:not([disabled])');if(n2)n2.focus()});return}
 if(id==='spk'){if(UI.spk)spkStop();else spkOn();save();render();return}
 if(id==='pump'){if(UI.fx)return;AU.noise({dur:.25,peak:.08,ft:'highpass',ff:1200});r.pulls++;r.air=airAfter(r.pulls);SPK.loud(loudOf(r.air));if(curStep().id==='repeat')r.repPulls=(r.repPulls||0)+1;markSpk();fx('pump',700);return}
 if(id==='refill'){if(UI.fx)return;const a0=r.air;r.air=1;r.pulls=0;[1,2,3,4].forEach(k=>later(()=>SPK.loud(loudOf(a0+(1-a0)*k/4)),k*500));if(r.seen.lowdone||rowDone('low'))r.seen.refilled=1;if(curStep().id==='repeat'&&r.seen.again)r.rep2=1;fx('refill',2000,()=>{markSpk()});return}
 if(ROWS[id]&&ROWS[id].t==='count'){const R0=ROWS[id];UI.play={row:id};if(curStep().id==='desk')UI.deskMode=id;
  for(let i=0;i<R0.taps;i++)later(()=>{if(id==='co')AU.noise({dur:.06,peak:.25,ff:2600});if(id==='ci')AU.noise({dur:.08,peak:.1,ft:'lowpass',ff:600});if(id==='ds')AU.noise({dur:.05,peak:.2,ff:800})},i*550+200);
  render();later(()=>{UI.play=null;r.seen[id]=1;save();render()},R0.taps*550+700);return}
 if(id==='prep'){UI.prep=true;render();return}
 if(id==='drumS'||id==='drumW'){AU.tone({f:120,peak:id==='drumS'?.28:.1,dec:.35});UI.mq[id]=1;if(UI.mq.drumS&&UI.mq.drumW)UI.mq.both=1;fx(id,1400);return}
 if(id==='hlA'||id==='hlB'){if(id==='hlA')AU.tone({f:784,peak:.05,dec:1.2});else AU.tone({f:261,peak:.28,dec:1.2});UI.mq[id]=1;if(UI.mq.hlA&&UI.mq.hlB)UI.mq.both=1;fx(id,1400);return}
 if(id==='taut'||id==='loose'){if(id==='taut')AU.tone({f:300,type:'triangle',peak:.15,dec:.9,lp:1500});UI.mq[id]=1;if(UI.mq.taut&&UI.mq.loose)UI.mq.both=1;fx(id,2000);return}}
function hold(on){const r=R();if(on){if(UI.hold)return;UI.hold=true;UI.holdH=AU.tone({f:200,type:'sawtooth',peak:.12,lp:900,hold:1,att:.04});UI.holdT=Date.now();clearTimeout(UI.holdTm);UI.holdTm=setTimeout(()=>{if(UI.hold){r.seen['neck:on']=1;save()}},400);clearTimeout(UI.holdCap);UI.holdCap=setTimeout(()=>{if(UI.hold){hold(false);flash('5초가 지나 소리를 멈췄어요.','info')}},5000);renderScene()}
 else{if(!UI.hold)return;UI.hold=false;clearTimeout(UI.holdCap);if(UI.holdH)UI.holdH.stop(.08);if(Date.now()-UI.holdT>=400){r.seen['neck:on']=1;r.seen['neck:off']=1}save();render()}}
/* 숫자 적기: 화면 숫자와 같은지만 알려 줌. 같은 값으로 다시 누르면 세지 않음 */
function tryKey(k,val){const r=R();if(r.last[k]===val)return -1;r.last[k]=val;r.tries[k]=(r.tries[k]||0)+1;return r.tries[k]}
function trial(row){const r=R(),x=r.rec[row],pend=r.pend[row];if(pend==null)return;const txt=String(UI.inp[row]||'').trim(),n=+txt;
 if(!txt||!/^\d+$/.test(txt)){UI.fb[row]=[0,'숫자로 써요.'];render();return}
 if(n===pend){x.v.push(n);delete r.pend[row];UI.inp[row]='';UI.mq={row,val:n,hl:false};UI.fb[row]=[1,(x.v.length<3?x.v.length+'번째 숫자를 적었어요.':'세 번 다 적었어요. 가운데 숫자를 골라요.')];save();render();return}
 const t=tryKey(row+':t'+x.v.length,txt);
 if(t===-1)UI.fb[row]=[0,'숫자가 그대로예요. 화면의 숫자를 다시 봐요.'];
 else if(t>=2){UI.mq={row,val:pend,hl:true};UI.fb[row]=[0,'반짝이는 화면의 숫자를 한 자리씩 견주어 써요.']}
 else UI.fb[row]=[0,'화면의 숫자와 달라요. 다시 봐요.'];save();render()}
function rowRec(row){const r=R(),R0=ROWS[row],D=UI.draft[row]||{};let ok,wrong=[],key,msg='';
 if(R0.t==='onoff'){ok=D.on===0&&D.off===1;if(D.on!==0)wrong.push('on');if(D.off!==1)wrong.push('off');key=D.on+','+D.off}
 if(R0.t==='num3'){const x=r.rec[row];const mv=D.mid!=null?x.v[D.mid]:null;const okm=mv===med3(x.v),okl=D.look===R0.lt;ok=okm&&okl;if(!okm)wrong.push('mid');if(!okl)wrong.push('look');key=D.mid+','+D.look;msg=!okm?'가운데 숫자는 작은 것부터 늘어놓았을 때 가운데에 오는 숫자예요.':''}
 if(R0.t==='hear'){ok=R0.ok.indexOf(D.v)>=0;if(!ok)wrong.push('v');key=''+D.v}
 if(R0.t==='count'){const h=D.heard,n=D.n||0;ok=h===R0.heard&&n===(R0.heard?R0.taps:0);if(h!==R0.heard)wrong.push('heard');key=h+','+n;msg=h===R0.heard&&!ok?'들은 수를 다시 세어 봐요. 다시 들어도 돼요.':''}
 if(ok){UI.attn=false;if(R0.t==='num3')Object.assign(r.rec[row],{mid:D.mid,look:D.look,ok:1});else r.rec[row]=Object.assign({},D,{ok:1});UI.fb[row]=[1,'잘 살펴보고 적었어요.'];UI.wrong[row]=[];
  if(R0.t==='count'&&!R0.heard)r.reveal[row]=0;save();render();const p=$('#lbFoot [data-act="next"]:not(:disabled)');if(p&&isDone(R().step))p.focus({preventScroll:true});return}
 const t=tryKey(row+':r',key);
 if(t===-1){UI.fb[row]=[0,'고른 것이 그대로예요. 다시 살펴봐요.'];render();return}
 UI.wrong[row]=[];if(t>=2){UI.attn=true;UI.fb[row]=[0,(R0.t==='num3'&&msg?msg+' ':'')+'그 장면을 다시 보고 골라요. 아래 반짝이는 단추를 눌러 다시 '+(R0.t==='count'||R0.t==='hear'?'들어요.':'봐요.')]}else{UI.fb[row]=[0,(msg||'다시 살펴보고 골라요.')+(R0.t==='count'?' 다시 들어도 돼요.':'')]}
 if(R0.t==='count'&&ROWS[row])r.seen[row]=1;save();render()}

/* ───────── 읽어 주기 ───────── */
function sayText(){const v=V(),r=R(),s=curStep(),out=[endP(s.t)];
 if(s.opts&&!r.done[s.id])out.push(endP(s.ask),s.opts.map((o,i)=>(i+1)+'번, '+o.t+'.').join(' '));
 if(s.k==='plan'){out.push(endP(v.q));if(v.plan.type==='pick')out.push('알맞은 관찰 방법을 모두 골라요. '+v.plan.ways.map(x=>x[0].replace(/"/g,'')+'.').join(' ')+' 감각: '+v.plan.senses.map(x=>x[0]).join(', ')+'.');else out.push('조건마다 다르게나 같게를 골라요. '+v.plan.rows.filter(x=>x[0]!=='#').map(x=>x[1].replace(/\((.*)\)/,' $1')+'.').join(' '))}
 if(s.k==='pred')v.pred.forEach(q=>{if(v.pred.length>1)out.push(endP(q.q));out.push(q.o.map((t,i)=>(i+1)+'번, '+t).join(' '))});
 if(s.k==='meas'){out.push('아래 단추로 실험하고, 기록 카드에 적어요.');s.rows.forEach(row=>out.push(ROWS[row].n+'.'))}
 if(s.k==='concl'){out.push(v.frame.replace(/\{(\d)\}/g,(m,i)=>{i=+i;const w=r.bl[i],J=v.jo[i];return w?(J?jo(w,J[0],J[1]):w):'빈칸'}));out.push('낱말 카드: '+v.chips.join(', ')+'.')}
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
document.addEventListener('pointerdown',e=>{const b=e.target.closest('[data-hold]');if(b&&!b.disabled){e.preventDefault();try{b.setPointerCapture(e.pointerId)}catch(x){}hold(true)}});
['pointerup','pointercancel','lostpointercapture'].forEach(n=>document.addEventListener(n,e=>{if(UI.hold&&(n!=='lostpointercapture'||e.target.closest&&e.target.closest('[data-hold]')))hold(false)}));
document.addEventListener('click',e=>{const t=e.target.closest('button');
 if(UI.menu&&!e.target.closest('#lbMenu,#lbTeach'))openMenu(false);
 if(!t||t.id==='lbTeach'||t.dataset.hold)return;const r=DB.cur?R():null;
 if(t.id==='lbMute'){DB.ui.mute=!DB.ui.mute;if(DB.ui.mute){SPK.stop();AU.stopAll()}else if(UI.spk&&DB.cur)SPK.start(loudOf(R().air));save();render();return}
 if(t.id==='lbOpenMi'){DB.ui.open=!DB.ui.open;save();render();return}
 if(t.id==='lbBigMi'){DB.ui.big=!DB.ui.big;save();render();return}
 if(t.id==='lbChoose'){act('home');return}
 if(t.id==='lbClearMi'){if(DB.cur&&confirm('이 실험의 기록을 지울까요?')){DB.runs[DB.cur]=newRun();resetUI();save();openMenu(false);render()}return}
 if(t.id==='lbClearAll'){if(confirm('이 기기에 저장한 모든 실험 기록을 지울까요?')){const ui=DB.ui;DB=blank();DB.ui=ui;resetUI();save();openMenu(false);render()}return}
 if(t.dataset.pick){DB.cur=t.dataset.pick;if(!DB.runs[DB.cur])DB.runs[DB.cur]=newRun();resetUI();enterStep();save();render();scrollTo(0,0);const h=$('#lbH1');if(h)h.focus({preventScroll:true});return}
 if(!r)return;
 if(t.dataset.go!=null){UI.rail=false;go(+t.dataset.go);return}
 if(t.dataset.act){act(t.dataset.act,t);return}
 if(t.dataset.plan){const [k,c]=t.dataset.plan.split(':');r.plan[k]=c;if(r.planOk&&planChanged(r))r.planOk=false;save();render();return}
 if(t.dataset.pw!=null){r.plan.w=r.plan.w||{};r.plan.w[t.dataset.pw]=!r.plan.w[t.dataset.pw];if(r.planOk&&planChanged(r))r.planOk=false;save();render();return}
 if(t.dataset.ps!=null){r.plan.s=r.plan.s||{};r.plan.s[t.dataset.ps]=!r.plan.s[t.dataset.ps];if(r.planOk&&planChanged(r))r.planOk=false;save();render();return}
 if(t.dataset.pg!=null){r.plan.g=r.plan.g||{};r.plan.g[t.dataset.pg]=!r.plan.g[t.dataset.pg];if(r.planLast)r.planLast.g=Object.assign({},r.plan.g);save();render();return}
 if(t.dataset.pred!=null){if(predLocked())return;const [j,i]=t.dataset.pred.split(':').map(Number);r.pred[j]=i;save();render();return}
 if(t.dataset.dr){const [row,key,i]=t.dataset.dr.split(':');const D=UI.draft[row]=UI.draft[row]||{};const val=+i;if(key==='heard'){D.heard=val===0?1:0;if(!D.heard)D.n=0}else D[key]=val;if(UI.wrong[row])UI.wrong[row]=UI.wrong[row].filter(w=>w!==key);render();return}
 if(t.dataset.cn){const [row,d]=t.dataset.cn.split(':');const D=UI.draft[row]=UI.draft[row]||{};D.n=Math.max(0,Math.min(9,(D.n||0)+(+d)));render();return}
 if(t.dataset.mq!=null){r.more.a=+t.dataset.mq;save();render();return}
 if(t.dataset.blank!=null){const i=+t.dataset.blank;if(UI.focus===i&&r.bl[i]&&!r.cmp){r.bl[i]='';save()}UI.focus=i;render();return}
 if(t.dataset.chip!=null){const v=V(),w=v.chips[+t.dataset.chip];r.bl[UI.focus]=w;if(r.cmp&&r.bl.some((x,i)=>x!==v.ans[i]))r.cmp=false;const nx=r.bl.findIndex(x=>!x);if(nx>=0)UI.focus=nx;save();render();return}
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(UI.menu){openMenu(false);$('#lbTeach').focus()}else if(UI.rail){UI.rail=false;render()}return}
 const tg=e.target;
 if(tg.dataset&&tg.dataset.hold&&(e.key===' '||e.key==='Enter')){e.preventDefault();if(!e.repeat)hold(true);return}
 if(tg.dataset&&tg.dataset.in!=null&&e.key==='Enter'){e.preventDefault();trial(tg.dataset.in);return}
 if(tg.closest&&tg.closest('input,textarea,select'))return;
 if(!DB.cur||e.altKey||e.ctrlKey||e.metaKey)return;
 if(e.key==='ArrowLeft'&&!tg.closest('.lb-seg')){if(R().step>0){e.preventDefault();go(R().step-1)}}
 if(e.key==='ArrowRight'&&!tg.closest('.lb-seg')){if(canNext()){e.preventDefault();go(R().step+1)}}});
document.addEventListener('keyup',e=>{const tg=e.target;if(tg.dataset&&tg.dataset.hold&&(e.key===' '||e.key==='Enter')){e.preventDefault();hold(false)}});
document.addEventListener('input',e=>{const t=e.target;if(t.id==='lbWhy'&&!predLocked()){R().why=t.value;save()}
 if(t.dataset&&t.dataset.in!=null){UI.inp[t.dataset.in]=t.value.replace(/[^\d]/g,'');if(t.value!==UI.inp[t.dataset.in])t.value=UI.inp[t.dataset.in]}
 if(t.id==='lbName'){DB.name=t.value;save();const u=$('#lbSheet .lb-sh-name u');if(u)u.textContent=DB.name||' '}});
let rzT=0,wasN=narrow();addEventListener('resize',()=>{clearTimeout(rzT);rzT=setTimeout(()=>{const n=narrow();if(n!==wasN){wasN=n;const s=$('#lbScene');if(s)s._h=null}if(DB.cur)render();else fitAll()},150)});
addEventListener('pagehide',()=>{spkStop();AU.stopAll()});
if(DB.cur&&EXPS[DB.cur]){if(!DB.runs[DB.cur])DB.runs[DB.cur]=newRun();enterStep()}
render();
