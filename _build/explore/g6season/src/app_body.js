/* 이 실험관에서 더 쓰는 아이콘 */
Object.assign(I,{globe:'<circle cx="12" cy="10" r="6.5"/><path d="M5.5 10h13M12 3.5c2 2 2 11 0 13M12 3.5c-2 2-2 11 0 13"/><path d="M6 16.5a8 8 0 0012 0M12 18.5V21M8.5 21h7"/>',
 tilt:'<circle cx="12" cy="12" r="6"/><path d="M8 4l8 16"/>',
 flash:'<path d="M3.5 9.5h9v5h-9z"/><path d="M12.5 9.5l4-2.5v10l-4-2.5"/><path d="M19 9l2-1.5M19.5 12h2M19 15l2 1.5"/>'});

/* ───────── 기록(이 기기에만) ───────── */
const KEY='hj-g6season-v1';
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
const VB='0 0 960 540';
/* 확대 렌즈 자리: 실제로 재는 곳(각도기의 빨간 점 · 막대 그림자)에만, 해 본 뒤에 */
function e1Spot(i){const c=R().st['k'+(i+1)]||0;if(c<3||fid())return null;const G=e1Geo(i);return [G.dx,G.dy,36,2.4,590,170]}
function e2Spot(){const c=R().st.dc||0;if(!c||fid())return null;const p=e2Dot(c-1);return [p[0],p[1],36,2.4,400,140]}
function e3Spot(){const r=R(),s=curStep();if(!r.seen[s.id==='mS'?'onS':'onL']||fid())return null;return [E3G.sx+46,E3G.sy-34,52,1.7,800,340]}
/* 기온 재는 곳(그늘·1.5 m) */
function shadeArt(x,on,anim){let g='<rect x="'+(x-12)+'" y="250" width="24" height="190" fill="#8A6A3A"/><circle cx="'+x+'" cy="210" r="96" fill="#5E9C48"/><circle cx="'+(x-70)+'" cy="250" r="56" fill="#6DAE52"/><circle cx="'+(x+66)+'" cy="246" r="58" fill="#6DAE52"/>';
 g+='<ellipse cx="'+x+'" cy="446" rx="150" ry="16" fill="#2E3338" opacity=".25"/>';
 if(on)g+='<g'+(anim?an('lb-a-fade',0):'')+'><rect x="'+(x+40)+'" y="330" width="6" height="110" fill="#8A8F96"/><rect x="'+(x+18)+'" y="300" width="50" height="34" rx="6" fill="#16241B" stroke="#2A3138" stroke-width="2"/><path d="M'+(x+90)+' 316 V440" stroke="var(--w-labeltx)" stroke-width="2"/><path d="M'+(x+84)+' 316 h12 M'+(x+84)+' 440 h12" stroke="var(--w-labeltx)" stroke-width="2"/>'+mini(x+150,384,'1.5 m',18)+'</g>';
 return g}
function sceneSVG(){const v=V(),r=R(),s=curStep(),id=s.id,f=fid(),no=v.no,st=r.st;
 const T=(g,l,vb)=>svg(g+lensOf(s,g),l||s.t,vb||VB);
 if(id==='tools'){if(!(r.done.tools||fxOn('tools')))return T(bg({})+boxArt(480),'준비물 상자');return T(bg({})+toolsScene(v.tools,fxOn('tools')),'준비물: '+v.tools.map(x=>x[1]).join(', '))}
 if(no===1){
  if(id==='ruler')return T(buildScene({ruler:has('ruler'),anim:f==='ruler'?'ruler':''}));
  if(id==='stick')return T(buildScene({ruler:1,stick:has('stick'),mark:has('stick'),anim:f==='stick'?'stick':''}));
  if(id==='string')return T(buildScene({ruler:1,stick:1,str:has('string'),anim:f==='string'?'str':''}));
  if(id==='prot')return T(buildScene({ruler:1,stick:1,str:1,prot:has('prot'),anim:f==='prot'?'prot':''}));
  if(s.k==='pred')return T(buildScene({ruler:1,stick:1,str:1,prot:1})+qmark(480,190));
  if(id==='m1'||id==='m2'){const i=id==='m1'?0:1,c=st['k'+(i+1)]||0;return T(e1Scene(i,c,f==='a'+i?'a':f==='c'+i?'c':f==='p'+i?'p':''))}
  if(id==='more')return T(e1More(UI.mq.len||10,!!f))}
 if(no===2){
  if(id==='place'){const on=has('place');return T(bgOut()+meterSide({x0:E2G.x0,y:E2G.y,h:E2G.h,pc:E2G.pc,A:ALT[0],L:SHD[0]*E2G.pc,r:E2G.r,sun:on,anim:f==='place'?'sh':''}))}
  if(id==='therm'){const on=has('therm');return T(bgOut()+meterSide({x0:E2G.x0,y:E2G.y,h:E2G.h,pc:E2G.pc,A:ALT[0],L:SHD[0]*E2G.pc,r:E2G.r,sun:1})+shadeArt(720,on,f==='therm'))}
  if(s.k==='pred')return T(e2Scene(-1)+qmark(400,200));
  if(id==='day'){const c=st.dc||0,fi=f&&/^t\d$/.test(f)?+f[1]:-1;
   if(fi>=0)return T(e2Scene(fi,{anim:1})+mini(400,236,'재는 중',20));
   return T(e2Scene(c-1,{hl:!!UI.mq.hl}))}
  if(id==='graph'){if(r.seen.gph||f==='gph')return T(graphScene(f==='gph'),'내 기록으로 그린 꺾은선그래프 셋');return T(dayTable(),'내 기록표')}}
 if(no===3){const T=(g,l)=>svg(g+lensOf(s,g),l||s.t,'130 40 830 470');
  if(id==='app')return T(e3Scene({num:has('app')?'0':null}));
  if(id==='stick')return T(e3Scene({num:'0',stick:has('stick'),torch:1,anim:f==='stick'?'stick':''}));
  if(s.k==='pred')return T(e3Scene({num:'0',stick:1,torch:1})+qmark(480,190));
  if(id==='mS'||id==='mL'){const k=id==='mS'?'S':'L',on=!!r.seen['on'+k]||f==='on'+k;
   if(!on)return T(e3Scene({num:'0',stick:1,torch:1}));return T(e3Scene({num:String(LUX[k]),stick:1,a:LANG[k],anim:f==='on'+k?'on':'',hl:!!UI.mq.hl}))}
  if(id==='cmp'){if(r.seen.cmp3||f==='cmp3')return svg('<g'+(f==='cmp3'?an('lb-a-fade',0):'')+'>'+e3Two()+'</g>','두 번 잰 모습',VB);return T(e3Scene({num:'0',stick:1,torch:1}))}
  if(id==='more')return svg(raysScene(UI.mq.ang||30,!!f),s.t,VB)}
 if(no===4){
  if(id==='plan')return T(e4Scene({})+orbitInset(16,14,-1,false));
  if(id==='attach')return T(e4Scene({meter:has('attach'),anim:f==='attach'?'meter':''}));
  if(id==='height'){const on=has('height');return T(e4Scene({meter:1,lampLow:!on,level:on&&f!=='height',anim:f==='height'?'height':''}))}
  if(id==='place')return T(e4Scene({meter:1,ruler:has('place'),level:1,anim:f==='place'?'place':''}));
  if(s.k==='pred')return T(e4Scene({meter:1,ruler:1})+qmark(400,150));
  if(id==='vert')return T(e4Meas(false));
  if(id==='tilt'){const on=has('tilt');return T(e4Scene({meter:1,ruler:1,tau:on?-TILT:0,anim:f==='tilt'?'tilt':''})+orbitInset(16,14,3,on))}
  if(id==='tiltm')return T(e4Meas(true));
  if(id==='cmp'){if(r.seen.tbl4||f==='tbl4')return T('<rect x="-3000" y="-3000" width="7000" height="7000" fill="var(--w-wall)"/><g'+(f==='tbl4'?an('lb-a-fade',0):'')+'>'+shTable()+'</g>','내 기록표');return T(e4Meas(true))}}
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
 if(R0.t==='num')return Array.isArray(R0.v)?R0.lab.map((l,j)=>l+' '+fmtU(x.v[j],uOf(R0,j))).join(' · '):fmtU(x.v,R0.u);
 if(R0.t==='note'){const w=R0.f.map((f,i)=>(x.t&&x.t[i])?x.t[i]:'').filter(Boolean);return w.length?w.join(' · '):'(쓰지 않았어요)'}
 return ''}
const fmtU=(v,u)=>u==='°'?v+'°':u?v+' '+u:String(v);
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
 if(R0.t==='num'&&Array.isArray(R0.v)){const op=numOpen(row);
  h+='<div class="lb-trials lb-trials2">'+R0.lab.map((lb,j)=>'<label class="lb-trial'+(op?' lb-tcur':'')+(wr.indexOf(j)>=0?' lb-wrongn':'')+'"><span>'+esc(lb)+'</span><span><input class="lb-num lb-numw" inputmode="decimal" maxlength="5" autocomplete="off" data-f="in'+row+j+'" data-in="'+row+'#'+j+'" aria-label="'+esc(R0.n+' '+lb)+'" value="'+esc(UI.inp[row+'#'+j]||'')+'"'+(op?'':' disabled')+'><i class="lb-u">'+uOf(R0,j)+'</i></span></label>').join('')+'<button type="button" class="lb-mini" data-act="trial" data-row="'+row+'" data-f="tr'+row+'"'+(op?'':' disabled')+'>'+ic('check')+'적기</button></div>'}
 else if(R0.t==='num'){const op=numOpen(row);
  h+='<div class="lb-trials"><label class="lb-trial'+(op?' lb-tcur':'')+'"><span>'+esc(R0.lab||'숫자')+'</span><input class="lb-num lb-numw" inputmode="'+(R0.dec?'decimal':'numeric')+'" maxlength="6" autocomplete="off" data-f="in'+row+'" data-in="'+row+'" aria-label="'+esc(R0.n)+' 숫자" value="'+esc(UI.inp[row]||'')+'"'+(op?'':' disabled')+'><span>'+(R0.u||'')+'</span></label><button type="button" class="lb-mini" data-act="trial" data-row="'+row+'" data-f="tr'+row+'"'+(op?'':' disabled')+'>'+ic('check')+'적기</button></div>';
  }
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
 grps.forEach(G=>{if(G.c.every(a=>a.fin)){h+='<p class="lb-cfin">'+ic('check')+'<b>'+esc(G.n)+'</b> '+esc(G.c[0].fin)+'</p>';return}
  const n=G.c.length,mini=cellsOnly&&G.c.every(a=>a.seen&&a.label.length<=3),cols=mini?n:G.c.some(a=>a.label.length>6)?(n>2?2:n):n===8||n===4?4:n>4?3:n;
  /* 모두 본 뒤(기록하는 동안)에는 시간 칸을 한 줄로 작게 — 기록 칸이 카드 안에 들어가게 */
  h+='<div class="lb-cellrow'+(mini?' lb-cellmini':'')+'" role="group" aria-label="'+esc(G.n)+'"><span class="lb-cl">'+esc(G.n)+(mini?' · 다시 볼 때 눌러요':'')+'</span><div style="grid-template-columns:repeat('+cols+',minmax(0,1fr))">'+G.c.map(a=>'<button type="button" class="lb-cellb'+(a.label.length>6?' lb-cellw':'')+(UI.attn&&!a.dis?' lb-attn':'')+(a.seen?' lb-seen':'')+'" data-act="x" data-x="'+a.id+'" data-f="x'+a.id+'" aria-pressed="'+!!a.pressed+'"'+(a.dis?' disabled':'')+' aria-label="'+esc(G.n+' '+a.label)+(a.seen?' (해 봤어요)':'')+'">'+(a.seen&&!mini?ic('check'):'')+'<span>'+esc(a.label)+'</span></button>').join('')+'</div></div>'});
 return h}
const MOREQ={1:['막대기의 길이가 달라지면 태양 고도는?',['막대기가 길수록 태양 고도가 커져요','태양 고도는 달라지지 않아요','막대기가 길수록 태양 고도가 작아져요'],1,'맞아요! 태양 빛은 지구에 거의 평행하게 들어와요. 막대기가 길어지면 그림자도 길어질 뿐, 태양 고도는 달라지지 않아요.'],
 3:['각이 크면 왜 에너지양이 많을까요?',['각이 크면 빛이 좁은 면적에 모여서','각이 크면 손전등에서 빛이 더 많이 나와서'],0,'맞아요! 손전등(태양)에서 나오는 빛의 양은 같아요. 각이 크면 빛이 좁은 면적에 모이고, 각이 작으면 넓은 면적에 퍼져서 일정한 면적이 받는 빛의 양이 적어져요.']};
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
 const keep=actsOf(s).some(a=>a.cell)&&!isDone(r.step);
 /* 한 번 해 보고 그 기록을 쓰는 동안에는 ①·② 단추를 접음(1분마다 재기 — 기록 칸이 카드 안에 들어가게) */
 const FD=!UI.fx&&typeof s.fold==='function'&&s.fold();
 if(FD)h+=gPart(1,'해 보기','ok','')+gPart(2,'살펴보기','ok','');
 else{h+=gPart(1,'해 보기',L&&!keep?'ok':'cur',L&&!UI.fx?(keep?actBtns(s,true):''):actBtns(s));
 h+=gPart(2,'살펴보기',!A?'wait':L?'ok':'cur',L&&s.rows.some(rowReady)?'':'<p>'+esc(s.look)+'</p>')}
 /* ③은 차례가 오면 열림(아직이면 이름만 — 카드 글자가 줄지 않게) */
 const st3=D?'ok':on3?'cur':'wait';const nx=s.rows.find(k=>!rowDone(k)&&rowReady(k));h+=gPart(3,'기록하기',st3,st3==='wait'?'<p class="lb-hint2">해 보기와 살펴보기를 마치면 열려요.</p>':doneRows(s)+s.rows.filter(k=>!rowDone(k)&&k===nx).map(rowUI).join('')+(s.rows.some(k=>!rowDone(k)&&k!==nx)?'<p class="lb-hint2">'+(nx?'이 줄을 기록하면 다음 줄이 열려요.':'남은 것을 해 보면 기록 칸이 더 열려요.')+'</p>':''));
 return cardHead('할 일',stepName(s))+wrapB(h+'</ol>')}
/* 기록한 줄은 한 칸에 이름만 모아 보여 줌(검토 고침: 기록 줄이 넷인 단계에서 카드가 넘치던 것) */
function doneRows(s){const d=s.rows.filter(rowDone);if(!d.length)return '';if(d.length<2||s.rows.length<3)return d.map(rowUI).join('');
 return '<div class="lb-mrow lb-mdone lb-mone"><div class="lb-mrh"><b>'+(d.length>3?esc(ROWS[d[0]].n)+' ~ '+esc(ROWS[d[d.length-1]].n):d.map(k=>esc(ROWS[k].n)).join(' · '))+'</b><span class="lb-okt">'+ic('check')+'기록했어요</span></div></div>'}
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
 if(R0.t==='num')return Array.isArray(R0.v)?R0.lab.map((l,j)=>'<span><b>'+esc(l)+'</b> '+esc(fmtU(x.v[j],uOf(R0,j)))+'</span>').join(''):'<span>'+esc(fmtU(x.v,R0.u))+'</span>';
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
function sheetTable(v,r){const g=k=>{const x=r.rec[k];return x&&x.ok?x.v:null},c=x=>x==null?'—':esc(x);let h='<table class="lb-sh-ttbl"><caption class="lb-sr">관찰 기록</caption>';
 if(v.no===1)h+='<thead><tr><th scope="col">재는 때</th>'+M1.map(m=>'<th scope="col">'+esc(m.when)+'</th>').join('')+'</tr></thead><tbody><tr><th scope="row">태양 고도(°)</th><td>'+c(g('a1'))+'</td><td>'+c(g('a2'))+'</td></tr></tbody>';
 if(v.no===2){h+='<thead><tr><th scope="col">측정 시각</th>'+DAYS.map(t=>'<th scope="col">'+t+'</th>').join('')+'</tr></thead><tbody>';
  ['태양 고도(°)','그림자 길이(cm)','기온(℃)'].forEach((n,j)=>{h+='<tr><th scope="row">'+n+'</th>'+DAYS.map((t,k)=>{const x=g('d'+k);return '<td>'+c(x?x[j]:null)+'</td>'}).join('')+'</tr>'});h+='</tbody>'}
 if(v.no===3)h+='<thead><tr><th scope="col">막대의 그림자</th><th scope="col">손전등과 스마트 기기가 이루는 각</th><th scope="col">화면 숫자(빛의 세기)</th></tr></thead><tbody><tr><th scope="row">짧을 때</th><td>'+LANG.S+'°</td><td>'+c(g('lS'))+'</td></tr><tr><th scope="row">길 때</th><td>'+LANG.L+'°</td><td>'+c(g('lL'))+'</td></tr></tbody>';
 if(v.no===4){h+='<thead><tr><th scope="col">그림자 길이(cm)</th>'+POS.map(p=>'<th scope="col">'+p+'</th>').join('')+'</tr></thead><tbody>';
  [['자전축이 수직일 때','v'],['자전축을 기울였을 때','t']].forEach(([n,p])=>{h+='<tr><th scope="row">'+n+'</th>'+POS.map((x,k)=>'<td>'+c(g(p+k))+'</td>').join('')+'</tr>'});h+='</tbody>'}
 h+='</table>';
 const sel=(v.no===2?['chg','peak']:v.no===3?['gS','gL','mm']:v.no===4?['cV','cT']:[]).filter(rowDone);
 if(sel.length)h+='<p class="lb-sh-big">'+sel.map(k=>esc(ROWS[k].n)+': '+esc(rowSum(k))).join('<br>')+'</p>';
 return h}
function planSummary(v,r){const P=v.plan;if(!P)return '';if(!r.planOk)return '<p>(계획을 건너뛰었어요)</p>';
 return '<div class="lb-sh-tags">'+P.rows.map(x=>{const d=r.plan[x[0]]==='d';return '<span class="lb-sh-tag'+(d?' lb-d':'')+'">'+(d?'다르게: ':'같게: ')+esc(x[1])+'</span>'}).join('')+'</div>'}
function sheetHTML(){const v=V(),r=R();const done=v.steps.map(id=>stepDef(v,id)).filter(s=>(s.k==='scene'||s.k==='meas')&&s.id!=='tools');
 const today=new Date();const ds=today.getFullYear()+'. '+(today.getMonth()+1)+'. '+today.getDate()+'.';
 let h='<article class="lb-sheet lb-sh-e'+v.no+'" id="lbSheet" aria-label="실험 결과 한 장"><div class="lb-sh-in"><header class="lb-sh-h"><div><h2>실험 결과 한 장 · '+esc(v.title)+'</h2><span>탐구 실험관 · 6학년 2학기 과학 · 1. 계절의 변화 · '+ds+'</span></div><div class="lb-sh-name">이름 <u>'+(esc(DB.name)||'&nbsp;')+'</u></div></header><div class="lb-sh-grid"><div class="lb-sh-col">';
 h+='<section class="lb-sh-sec"><h3><i></i>실험 문제</h3><p><b>'+esc(v.q)+'</b></p>'+planSummary(v,r)+'</section>';
 h+='<section class="lb-sh-sec lb-sh-po"><h3><i></i>실험한 차례</h3><div class="lb-sh-steps">'+done.map((s,i)=>'<div><b>'+(i+1)+'.</b> '+esc(s.t)+'</div>').join('')+'</div></section>';
 h+='</div><div class="lb-sh-col">';
 h+='<section class="lb-sh-sec"><h3><i></i>내 예상</h3><p>'+v.pred.map((q,j)=>(v.pred.length>1?esc(q.q)+' ':'')+(r.pred[j]!=null?esc(q.o[r.pred[j]]):'(고르지 않았어요)')).join('<br>')+(r.why?'<br>까닭: '+esc(r.why):'')+'</p></section>';
 const cs='<section class="lb-sh-sec"><h3><i></i>내 결론</h3><div class="lb-sh-box"><p class="lb-sh-concl">'+frameHTML(v,r.bl,'sheet')+'</p>'+(r.cmp?'<p class="lb-sh-book">교과서 결론: '+esc(v.book)+'</p>':'')+'</div></section>';
 h+=cs+'</div></div><section class="lb-sh-sec"><h3><i></i>관찰 기록</h3>'+sheetTable(v,r)+'</section>'+picsHTML(snapList(v,r))+'<section class="lb-sh-sec lb-sh-po lb-sh-fill"><h3><i></i>새로 알게 된 것 · 더 알고 싶은 것</h3><div class="lb-sh-lines">'+'<div class="lb-ln"></div>'.repeat(9)+'</div></section>';
 h+='<footer class="lb-sh-f"><span>아주 단순하게 만든 모형의 결과예요. 실제 교실에서는 결과가 조금 다를 수 있어요.</span><span>만든 사람: 초등교사 홍지희</span></footer></div></article>';
 return h}
const LABNAME='season';
function snapsOf(v,r){const L=[],S=(g,vb,cap)=>L.push([svg(g,cap,vb),cap]);const ok=k=>rowDone(k);
 if(v.no===1){if(ok('a1'))S(e1Scene(0,3,''),'0 20 680 440',M1[0].when);if(ok('a2'))S(e1Scene(1,3,''),'0 20 680 440',M1[1].when)}
 if(v.no===2&&DAYS.some((t,k)=>ok('d'+k)))S(graphWide(),'0 0 960 250','내 기록으로 그린 꺾은선그래프(태양 고도 · 그림자 길이 · 기온)');
 if(v.no===3&&ok('lS')&&ok('lL'))S(e3Two(),'20 30 920 350','그림자가 짧을 때와 길 때');
 if(v.no===4){const P=k=>bg({})+lampArt(E4G.lx,E4G.ly,1)+globeSide(E4G.gx,E4G.gy,E4G.R,tauOf(k,true),{meter:1,sh:SHT[k]})+mini(E4G.gx,470,'자전축을 기울였을 때 '+POS[k]+' 위치',20);
  if(ok('t1'))S(P(1),'150 140 500 360','자전축을 기울였을 때 나 위치');if(ok('t3'))S(P(3),'150 140 500 360','자전축을 기울였을 때 라 위치')}
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
 if(!DB.cur||!EXPS[DB.cur]){H.classList.remove('lb-inrun');$('#lbSub').textContent='6학년 2학기 과학 · 1단원 계절의 변화';$('#lbChoose').hidden=true;$('#lbClearMi').hidden=true;
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
function actsOf(s){const r=R(),A=[],busy=!!UI.fx,st=r.st||{},no=V().no;
 /* 기록해야 다음 행동이 열리는 차례(한 시간 간격 · 공전 위치) */
 const seqW=(key,ids,L0,pre)=>{const c=st[key]||0,n=ids.length,wait=c>0&&c<n&&!rowDone(pre+(c-1));
  L0.forEach((t,i)=>A.push({id:ids[i],label:(i+1)+'/'+n+' · '+t,dis:busy||i!==c||wait,pressed:i<c,hide:i!==Math.min(c,n-1)}))};
 const one=(id,label)=>A.push({id,label,dis:busy||!!r.seen[id],pressed:!!r.seen[id]});
 switch(s.id){
  case 'm1':case 'm2':{const i=s.id==='m1'?0:1;seqActs(A,'k'+(i+1),['a'+i,'c'+i,'p'+i],['그림자를 자와 나란하게 놓기','각도기 중심을 그림자 끝에 맞추기','실을 그림자 끝까지 당기기'],busy);break}
  case 'day':seqW('dc',DAYT.map((t,i)=>'t'+i),DAYT.map(t=>t+'에 재기'),'d');break;
  case 'graph':one('gph','꺾은선그래프 그리기');break;
  case 'mS':one('onS','손전등을 높이 들어 비추기');break;
  case 'mL':one('onL','손전등을 낮게 들어 비추기');break;
  case 'cmp':if(no===3)one('cmp3','두 기록 나란히 보기');else one('tbl4','내 기록표 펼쳐 보기');break;
  case 'vert':seqW('vc',['p0','p1','p2','p3'],['가 위치에서 재기','나 위치로 공전시켜 재기','다 위치로 공전시켜 재기','라 위치로 공전시켜 재기'],'v');break;
  case 'tiltm':seqW('tc',['p0','p1','p2','p3'],['가 위치에서 재기','나 위치로 공전시켜 재기','다 위치로 공전시켜 재기','라 위치로 공전시켜 재기'],'t');break;
  case 'more':if(no===1)[5,10,15,20].forEach(n=>A.push({id:'L'+n,label:n+' cm',cell:1,grp:'막대기 길이',seen:!!UI.mq['L'+n],pressed:(UI.mq.len||0)===n,dis:busy}));
   else [30,60,90].forEach(n=>A.push({id:'A'+n,label:n+'°',cell:1,grp:'태양 고도',seen:!!UI.mq['A'+n],pressed:(UI.mq.ang||0)===n,dis:busy}));break}
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
function introPic(no,k){const n0=NAR,l0=LEG;NAR=true;LEG=[];let g='',vb=VB;
 if(no===1){if(k==='ruler')g=buildScene({ruler:1});if(k==='stick')g=buildScene({ruler:1,stick:1,mark:1});if(k==='prot')g=buildScene({ruler:1,stick:1,str:1,prot:1});
  if(k==='read')g=bgOut()+meterSide({x0:220,y:420,h:150,A:45,L:150,r:105,sun:1,prot:1,str:1})}
 if(no===2){if(k==='place')g=bgOut()+meterSide({x0:E2G.x0+120,y:E2G.y,h:E2G.h,pc:20,A:45,L:200,r:E2G.r});
  if(k==='read')g=bgOut()+meterSide({x0:E2G.x0+120,y:E2G.y,h:E2G.h,pc:20,A:45,L:200,r:E2G.r,sun:1,prot:1,str:1});
  if(k==='therm')g=bgOut()+shadeArt(420,1,0);
  if(k==='hour'){g='<rect x="-3000" y="-3000" width="7000" height="7000" fill="var(--w-wall)"/>';DAYS.forEach((t,i)=>{g+=mini(150+i*110,270+(i%2?40:-40),t,26)});vb='60 150 840 240'}}
 if(no===3){if(k==='app')g=e3Scene({num:'0'});if(k==='stick')g=e3Scene({num:'0',stick:1,torch:1});if(k==='shine')g=e3Scene({num:'?',stick:1,a:55});if(k==='two')g=e3Two()}
 if(no===4){if(k==='attach')g=e4Scene({meter:1});if(k==='place')g=e4Scene({meter:1,ruler:1,level:1});if(k==='orbit')g=e4Scene({meter:1,ruler:1,light:1})+orbitInset(16,14,0,false);if(k==='tilt')g=e4Scene({meter:1,ruler:1,tau:-TILT})+orbitInset(16,14,3,true)}
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
function homeArt(no){NAR=true;LEG=[];let g='',vb=VB,l='';
 if(no===1){g=buildScene({ruler:1,stick:1,str:1,prot:1});vb='150 200 660 260';l='수수깡과 실로 만든 태양 고도 측정기'}
 if(no===2){g=bgOut()+meterSide({x0:E2G.x0+120,y:E2G.y,h:E2G.h,pc:20,A:45,L:200,r:E2G.r})+shadeArt(800,1,0);vb='120 120 840 360';l='운동장의 태양 고도 측정기와 그늘의 온도계'}
 if(no===3){g=e3Scene({num:null,stick:1,torch:1});vb='120 20 840 440';l='스마트 기기, 빨판 달린 막대, 손전등'}
 if(no===4){g=e4Scene({meter:1,ruler:1});vb='100 130 600 330';l='전등과 지구본'}
 const s=svg(g,l,vb);NAR=false;LEG=[];return s}
function homeHTML(){const card=k=>{const v=EXPS[k],r=DB.runs[k];const st=r?(r.fin?'끝냄 · 결과 보기':(r.step+1)+'단계부터 이어서'):'실험 시작하기';
 return '<section class="lb-exc" aria-labelledby="lbE'+v.no+'"><div class="lb-exc-art">'+homeArt(v.no)+'</div><div class="lb-exc-b"><h2 id="lbE'+v.no+'"><em>실험 '+v.no+'</em>'+esc(v.name)+'</h2><p class="lb-exp">'+esc(v.sub)+'</p><button type="button" class="lb-pickb" data-pick="'+k+'" data-f="k'+k+'"><i>'+ic(['','sun','thermo','flash','globe'][v.no])+'</i><span><b>'+st+'</b><span>교과서 '+(v.no===4?'모형실험':'실험')+' · '+v.steps.length+'단계</span></span>'+(r&&r.fin?'<small>'+ic('check')+'</small>':'')+'</button></div></section>'};
 return '<div class="lb-home"><div class="lb-home-h"><div class="lb-kick"><em>6학년 2학기 과학</em>1. 계절의 변화</div><h1>무엇을 실험할까요?</h1><p>실험을 한 단계씩 직접 해 보고, 내 눈으로 읽은 눈금과 숫자를 기록해요.</p></div>'+
 '<div class="lb-ex lb-ex4">'+['e1','e2','e3','e4'].map(card).join('')+'</div>'+
 '<p class="lb-model">'+ic('info')+'<span>아주 단순하게 만든 모형이에요. 같은 조건이면 언제나 같은 결과가 나와요. 각도기·자·온도계·스마트 기기 화면에 나오는 값은 교과서와 「실험관찰」에 실린 예시 값이에요. 손전등의 각도, 그림 속 태양·지구본·전등의 자리와 크기는 이 실험관에서 정한 모습이에요. 실제 실험에서는 날씨와 장소에 따라 값이 다르니 내가 잰 숫자를 그대로 써요.</span></p></div>'}
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
/* 실험 단계의 행동. 하면 안 되는 행동은 그림은 그대로, 까닭만 알림 */
function doX(id){const r=R(),s=curStep(),st=r.st;if(UI.fx)return;
 const seq=(key,ids,ms,after)=>{const i=ids.indexOf(id),c=st[key]||0;if(i<0||c!==i)return;r.act[s.id]=1;r.obs=1;UI.mq.cur=id;UI.mq.hl=false;fx(id,Array.isArray(ms)?ms[i]:ms,()=>{st[key]=i+1;r.seen[id]=1;if(after)after(i)})};
 const one=(ms,after)=>{if(r.seen[id])return;r.act[s.id]=1;UI.mq.cur=id;fx(id,ms,()=>{r.seen[id]=1;if(after)after()})};
 if(s.id==='m1'||s.id==='m2'){const i=s.id==='m1'?0:1,row='a'+(i+1);seq('k'+(i+1),['a'+i,'c'+i,'p'+i],[1000,1200,1700],j=>{if(j===2&&!rowDone(row))r.pend[row]=1});return}
 if(s.id==='day'){const c=st.dc||0;if(c>0&&!rowDone('d'+(c-1)))return;seq('dc',DAYT.map((t,i)=>'t'+i),1500,j=>{if(!rowDone('d'+j))r.pend['d'+j]=1});return}
 if(s.id==='vert'||s.id==='tiltm'){const t=s.id==='tiltm',key=t?'tc':'vc',pre=t?'t':'v',c=st[key]||0;if(c>0&&!rowDone(pre+(c-1)))return;seq(key,['p0','p1','p2','p3'],[900,1400,1400,1400],j=>{if(!rowDone(pre+j))r.pend[pre+j]=1});return}
 if(id==='gph'){one(1700);return}
 if(id==='onS'||id==='onL'){r.obs=1;const row=id==='onS'?'lS':'lL';one(1300,()=>{if(!rowDone(row))r.pend[row]=1});return}
 if(id==='cmp3'||id==='tbl4'){one(900);return}
 if(s.k==='more'){const m=/^([LA])(\d+)$/.exec(id);if(!m)return;const n=+m[2];UI.mq.cur=id;if(m[1]==='L')UI.mq.len=n;else UI.mq.ang=n;fx(id,900,()=>{UI.mq[id]=1;const k=Object.keys(UI.mq).filter(x=>/^[LA]\d+$/.test(x)).length;if(k>=(m[1]==='L'?3:2))UI.mq.both=1});return}}
/* 숫자 적기: 화면 숫자와 같은지만 알려 줌. 같은 값으로 다시 누르면 세지 않음 */
function tryKey(k,val){const r=R();if(r.last[k]===val)return -1;r.last[k]=val;r.tries[k]=(r.tries[k]||0)+1;return r.tries[k]}
function trial(row){const r=R(),R0=ROWS[row];if(!R0||R0.t!=='num'||!numOpen(row))return;const two=Array.isArray(R0.v),VV=two?R0.v:[R0.v];
 const tx=VV.map((v,j)=>String(UI.inp[two?row+'#'+j:row]||'').trim());
 if(tx.some(t=>!t)){UI.fb[row]=[0,two?'칸마다 모두 숫자를 써요.':'숫자로 써요.'];UI.wrong[row]=tx.map((t,j)=>t?-1:j).filter(j=>j>=0);render();return}
 if(tx.some(t=>!/^\d+(\.\d+)?$/.test(t))){UI.fb[row]=[0,'숫자로 써요.'];render();return}
 /* 눈금을 읽는 칸은 tol 안이면 맞음 — 내가 읽은 값을 그대로 기록(앱이 대신 고치지 않음) */
 const tol=j=>Array.isArray(R0.tol)?R0.tol[j]:(R0.tol||0);
 const okj=tx.map((t,j)=>Math.abs(+t-+VV[j])<=tol(j)+1e-9);
 if(okj.every(Boolean)){const mine=tx.map(t=>String(+t));r.rec[row]={ok:1,v:two?mine:mine[0]};delete r.pend[row];VV.forEach((v,j)=>{delete UI.inp[two?row+'#'+j:row]});UI.wrong[row]=[];UI.mq.hl=false;UI.attn=false;UI.fb={};UI.fb[row]=[1,'잘 읽고 적었어요.'];save();render();const p=$('#lbFoot [data-act="next"]:not(:disabled)');if(p&&isDone(r.step))p.focus({preventScroll:true});return}
 const t=tryKey(row+':t',tx.join('|'));
 if(t===-1){UI.fb[row]=[0,'숫자가 그대로예요. 다시 봐요.'];render();return}
 UI.wrong[row]=okj.map((o,j)=>o?-1:j).filter(j=>j>=0);
 const j0=UI.wrong[row][0],u=uOf(R0,j0),x=+tx[j0],want=+VV[j0];let m;
 if(u==='°')m=Math.abs((180-x)-want)<=tol(j0)+1e-9?'바깥쪽 숫자를 읽었어요. 그림자 쪽(0)에서 시작하는 안쪽 숫자를 읽어요.':t>=2?'확대한 각도기에서 빨간 점이 있는 눈금을 찾아요. 작은 눈금 한 칸은 1°예요.':'빨간 점이 있는 각도기 눈금을 다시 읽어요.';
 else if(u==='cm')m=t>=2?'그림자 끝이 가리키는 자 눈금을 큰 눈금 숫자부터 다시 읽어요. 작은 눈금 한 칸은 1 mm(0.1 cm)예요.':'그림자 끝이 가리키는 자 눈금을 다시 읽어요.';
 else m=t>=2?'반짝이는 화면의 숫자를 한 자리씩 견주어 써요.':'빨간 칸의 숫자가 화면과 달라요. 다시 봐요.';
 if(t>=2&&(u==='℃'||!u))UI.mq.hl=true;
 UI.fb[row]=[0,(two?'빨간 칸: ':'')+m];
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
 if(tg.dataset&&tg.dataset.in!=null&&e.key==='Enter'){e.preventDefault();trial(tg.dataset.in.split('#')[0]);return}
 if(tg.closest&&tg.closest('input,textarea,select'))return;
 if(!DB.cur||e.altKey||e.ctrlKey||e.metaKey)return;
 if(e.key==='ArrowLeft'&&!tg.closest('.lb-seg')){if(R().step>0){e.preventDefault();go(R().step-1)}}
 if(e.key==='ArrowRight'&&!tg.closest('.lb-seg')){if(canNext()){e.preventDefault();go(R().step+1)}}});
document.addEventListener('input',e=>{const t=e.target;if(t.id==='lbWhy'&&!predLocked()){R().why=t.value;save()}
 if(t.dataset&&t.dataset.nt){const [row,j]=t.dataset.nt.split(':');const D=UI.draft[row]=UI.draft[row]||{};D.t=D.t||[];D.t[+j]=t.value}
 if(t.dataset&&t.dataset.in!=null){const K=t.dataset.in,rw=K.split('#')[0],dec=!!(ROWS[rw]&&ROWS[rw].dec);UI.inp[K]=t.value.replace(dec?/[^\d.]/g:/[^\d]/g,'');if(t.value!==UI.inp[K])t.value=UI.inp[K]}
 if(t.id==='lbName'){DB.name=t.value;save();const u=$('#lbSheet .lb-sh-name u');if(u)u.textContent=DB.name||' '}});
let rzT=0,wasN=narrow();addEventListener('resize',()=>{clearTimeout(rzT);rzT=setTimeout(()=>{const n=narrow();if(n!==wasN){wasN=n;const s=$('#lbScene');if(s)s._h=null}if(DB.cur)render();else fitAll()},150)});
if(DB.cur&&EXPS[DB.cur]){if(!DB.runs[DB.cur])DB.runs[DB.cur]=newRun();enterStep()}
render();

addEventListener('beforeprint',()=>{const s=$('#lbSheet .lb-sh-in');if(s)s.style.zoom=''});addEventListener('afterprint',()=>{try{fitAll()}catch(e){}});
