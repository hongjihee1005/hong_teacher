/* 지구와 바다 실험관에서 더 쓰는 아이콘 */
Object.assign(I,{bagi:'<path d="M7 9c-3 1-4 4-3.5 7 .6 3.5 4 5 8.5 5s7.6-1.5 8.2-5c.5-3-.6-6-3.7-7"/><path d="M8 9c1-3 2.4-5 4-5s3 2 4 5z"/>',
 globei:'<circle cx="12" cy="11" r="7.5"/><path d="M4.5 11h15M12 3.5c2.2 2.2 3.2 4.8 3.2 7.5S14.2 16.3 12 18.5M12 3.5C9.8 5.7 8.8 8.3 8.8 11s1 5.3 3.2 7.5"/><path d="M8 21h8M12 18.5V21"/>',
 clock:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3.5 2"/>',
 dish:'<path d="M3 11h18c-.6 4.5-4.4 7.5-9 7.5S3.6 15.5 3 11z"/><path d="M8 8.5c0-1 1-1.5 2-1M13 8c0-1.2 1-1.8 2-1.5"/>'});

/* ───────── 기록(이 기기에만) ───────── */
const KEY='hj-earth-v1';
function blank(){return {v:1,runs:{},cur:null,ui:{open:false,big:false},name:''}}
function newRun(){return {step:0,max:0,done:{},act:{},plan:{},planLast:null,planOk:false,pred:[],why:'',seen:{},rec:{},pend:{},last:{},tries:{},bl:[],clast:null,ctry:0,cmp:false,fin:false,more:{},st:{},memo:''}}
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
function nextCell(st){return CORDER.find(i=>!st.stk[i])}
function viewTo(st,i){if(i==null)return;const m=cellMid(CELLS[i]);st.lam=m[0];st.phi=Math.max(-62,Math.min(62,m[1]))}
function enterStep(){const v=V(),r=R(),s=stepOf(r.step);r.st=r.st||{};const st=r.st;
 if(s.k==='sheet')r.fin=!!(r.cmp&&v.rows.every(rowDone));
 if(s.k==='concl'&&!r.bl.length)r.bl=v.ans.map(()=>'');
 if(s.k==='concl')UI.focus=Math.max(0,r.bl.findIndex(x=>!x));
 if(v.no===2){st.stk=st.stk||{};st.ord=st.ord||[];if(st.lam==null){st.lam=127;st.phi=20}
  if(s.id==='rule')viewTo(st,RULEC);
  if(s.id==='turn'||s.id==='pred'||s.id==='number'||s.k==='concl'){st.lam=127;st.phi=20}
  if(s.id==='stick'){st.cur=nextCell(st);viewTo(st,st.cur)}
  if(s.id==='count'){st.lam=127;st.phi=20}}
 if(v.no===3){if(st.lv==null){st.lv=4;st.chL=0;st.chS=0}
  if(s.id==='dish'&&!st.lens)st.lens=null}}
/* 예상 단계 뒤의 실험을 시작하면 예상을 잠금(앞의 '두 물 살펴보기'는 예상 전에 하는 관찰이라 세지 않음) */
function predLocked(){const v=V(),r=R(),pi=v.steps.indexOf('pred');return v.steps.some((id,i)=>i>pi&&(r.act[id]||r.done[id]))}
function planChanged(r){if(!r.planLast)return true;return JSON.stringify(r.plan)!==JSON.stringify(r.planLast)}

/* ───────── 장치 값 ───────── */
const LV=[0,.18,.42,.7,1];   /* 물 높이 단계(이 자료에서 정한 모습) */
function cnts(){const st=R().st||{},c={L:0,S:0};Object.values(st.stk||{}).forEach(k=>c[k]++);return c}
function maxCell(k){const st=R().st;let n=0,m=null;(st.ord||[]).forEach(i=>{if(st.stk[i]===k){n++;m=i}});return m}
const RULEC=(()=>{let i=CELLS.findIndex(c=>c.b===1&&c.f>.62&&c.f<.85);return i<0?CORDER[0]:i})();
function gSpot(){const st=R().st,i=curStep().id==='rule'?RULEC:st.cur;if(i==null)return null;const G=gView(),q=gProj(cellMid(CELLS[i])[0],cellMid(CELLS[i])[1],G);return [Math.round(q[0]),Math.round(q[1]),60,1.45,745,115]}
function dSpot(){const st=R().st;if(!st.lens)return null;return [DX[st.lens],HP.y-18,50,1.9,480,215]}
function gView(){const st=R().st||{};return {lam:UI.glam!=null?UI.glam:st.lam==null?127:st.lam,phi:st.phi==null?20:st.phi,cx:480,cy:262,R:215}}

/* ───────── 장면 ───────── */
function fxOn(id){return UI.fx&&UI.fx.id===id}
function has(id){const r=R(),k=idxOf(id);if(k<0)return false;return k<r.step||(k===r.step&&(!!r.done[id]||fxOn(id)))}
function e1Scene(s){const r=R(),id=s.id,f=UI.fx;
 if(id==='swing'){if(fxOn('swing'))return sceneBag({st:'full',grow:1})+swoosh();
  if(!r.done.swing)return sceneBag({st:'flat'})+qmark(430,120);return sceneBag({st:'full'})}
 if(s.k==='pred')return sceneBag({st:'full',fan:1})+qmark(300,110)+qmark(700,120);
 if(id==='fan'){const on=fxOn('fan');return sceneBag({st:'full',fan:1,fanAnim:on,sway:on,fanLines:on})}
 if(id==='press'){const pr=fxOn('press')||!!r.seen.press,pl=!!r.seen.palm||fxOn('palm')||pr;
  return sceneBag({st:pr?'press':'full',hold:!pr,open:pr,press:pr,palm:pl,palmAnim:fxOn('palm'),feel:pr,feelAnim:fxOn('press')})}
 if(id==='swap'){const ph=UI.mq.ph;if(ph==='fan')return sceneBag({st:'full',fan:1,fanAnim:1,sway:1,fanLines:1,swap:1});if(ph==='press')return sceneBag({st:'press',hold:false,open:1,press:1,palm:1,feel:1,feelAnim:1,swap:1});
  return sceneBag({st:r.seen.swap?'press':'full',hold:!r.seen.swap,open:!!r.seen.swap,press:!!r.seen.swap,palm:!!r.seen.swap,feel:!!r.seen.swap,swap:1})}
 return sceneBag({st:'full'})}
function swoosh(){return '<path d="M220 140 Q430 40 640 140" fill="none" stroke="#7F9BAB" stroke-width="4" stroke-dasharray="10 9" stroke-linecap="round"'+an('lb-a-stream',0)+'/>'}
function e2Scene(s){const r=R(),st=r.st||{},id=s.id,G=gView();let g=bg({room:1});
 const base=o=>globe(Object.assign({lam:G.lam,phi:G.phi,cx:G.cx,cy:G.cy,R:G.R},o));
 if(id==='turn'){g+=base({});if(!r.done.turn&&!fxOn('turn'))g+=qmark(480,40);return g}
 if(s.k==='pred')return g+base({})+qmark(480,40);
 if(id==='rule'){const dn=r.done.rule||fxOn('rule'),o={cur:RULEC};if(dn){o.stk={};o.stk[RULEC]='L';o.ord=[RULEC]}return g+base(o)+(dn?'':qmark(250,60))}
 const nums=has('number')&&(id!=='number'||r.done.number||fxOn('number'));
 let o=id==='pole'?{}:{stk:st.stk,ord:st.ord,nums};
 if(id==='stick')o.cur=st.cur;
 if(id==='count'&&UI.hlk)o.hl=maxCell(UI.hlk);
 g+=base(o);
 if(id==='number'&&fxOn('number'))g=g.replace('<g class="lb-globe">','<g class="lb-globe">');
 if(id==='pole'||id==='count'){const lb=st.phi===90?(id==='pole'?'북극 위에서 본 지구본 (붙임딱지 없이)':'북극 위에서 본 모습'):st.phi===-90?(id==='pole'?'남극 위에서 본 지구본 (붙임딱지 없이)':'남극 위에서 본 모습'):'';if(lb)g+=tag(480,505,lb,20)}
 return g}
function e3Scene(s){const r=R(),st=r.st||{},id=s.id,f=UI.fx;let g=bg({});
 const lv=LV[st.lv==null?4:st.lv];
 if(id==='wear'){const on=r.done.wear||fxOn('wear');g+=headArt(480,180);
  if(on)g+='<g'+(fxOn('wear')?an('lb-a-down',0,'--from:-60px'):'')+'>'+goggles(480,168)+'</g><g'+(fxOn('wear')?an('lb-a-up',.4):'')+'>'+glove(330,330)+glove(630,330,1)+'</g>';
  else g+=goggles(250,390)+glove(700,370)+glove(780,370,1)+qmark(480,40);return g}
 if(id==='beaker'){g+=beaker(330,416,'육지의 물')+beaker(630,416,'바닷물');
  if(fxOn('smell'))g+='<g'+an('lb-a-wave',0)+'>'+hand(700,230,200,.85)+'</g>'+[0,1].map(i=>'<path d="M'+(630+i*14)+' '+(250-i*10)+' q14 -10 28 0" fill="none" stroke="#7F9BAB" stroke-width="3" stroke-dasharray="6 7"'+an('lb-a-stream',i*.2)+'/>').join('');
  if(fxOn('see'))g+='<g'+an('lb-a-pop',0)+'><circle cx="330" cy="330" r="84" fill="none" stroke="var(--lb-lens)" stroke-width="5" stroke-dasharray="12 8"/><circle cx="630" cy="330" r="84" fill="none" stroke="var(--lb-lens)" stroke-width="5" stroke-dasharray="12 8"/></g>';
  return g}
 const onPlate=!!st.onP&&(id==='heat'||id==='dish'||s.k==='concl'),yb=onPlate||s.k==='plan'||s.k==='pred'?HP.y:416;
 const showPlate=onPlate||id==='heat'||s.k==='plan'||s.k==='pred';
 if(showPlate)g+=hotplate(!!st.heat&&(id==='heat'));
 if(s.k==='plan'||s.k==='pred'){g+=edish(DX.L,HP.y,{lv:1,chips:2})+edish(DX.S,HP.y,{lv:1,chips:2})+tag(DX.L,HP.y-96,'육지의 물',17)+tag(DX.S,HP.y-96,'바닷물',17);if(s.k==='pred')g+=qmark(DX.L,170)+qmark(DX.S,170);return g}
 const water=k=>id==='drop'?(st['ml'+k]?1:0):lv,chipsOf=k=>st['ch'+k]||0;
 const dishes=()=>{let d='';['L','S'].forEach(k=>{d+=edish(DX[k],yb,{lv:water(k),chips:chipsOf(k),salt:k==='S'&&st.lv===0&&(id==='heat'||id==='dish'||s.k==='concl'),steam:!!st.heat&&id==='heat'&&st.lv>0&&fxOn('wait')})});return d};
 let d=dishes();
 if(id==='heat'&&fxOn('onP'))d='<g'+an('lb-a-down',0,'--from:44px')+'>'+d.replace(/translate/g,'translate')+'</g>';
 g+=d+(id==='dish'?tag(DX.L,476,'육지의 물',17)+tag(DX.S,476,'바닷물',17):tag(DX.L,yb-96,'육지의 물',17)+tag(DX.S,yb-96,'바닷물',17));
 if(id==='drop'){['L','S'].forEach(k=>{if(fxOn('d'+k))g+=dropper(DX[k],190,true)});if(!st.mlL&&!st.mlS&&!f)g+=dropper(DX.L,180)+dropper(DX.S,180)}
 if(id==='chip'){['L','S'].forEach(k=>{if(fxOn('c'+k))g+='<path d="M'+(DX[k]-7)+' 300 l4 -6 h7 l4 5 l-3 6 h-9Z" fill="#B7AFA2" stroke="#6F675B" stroke-width="1.5"'+an('lb-a-drop',0)+'/>'})}
 if(id==='heat'&&fxOn('near'))g+='';
 if(id==='heat'&&st.heat&&!fxOn('wait')&&st.lv>0&&!NAR)g+=tag(480,90,'핫플레이트가 켜져 있어요',18);
 return g}
function sceneSVG(){const v=V(),r=R(),s=curStep(),id=s.id,no=v.no;
 const T=(g,l,vb)=>svg(g+lensOf(s,g),l||s.t,vb);
 if(id==='tools'){if(!(r.done.tools||fxOn('tools')))return T(bg({})+boxArt(480),'준비물 상자');return T(bg({})+toolsScene(v.tools,fxOn('tools')),'준비물: '+v.tools.map(x=>x[1]).join(', '))}
 if(no===1)return T(e1Scene(s),s.t,'60 60 840 420');
 if(no===2)return T(e2Scene(s),s.t,'120 20 720 500');
 if(no===3)return T(e3Scene(s),s.t,(id==='wear'||id==='beaker')?'100 30 760 470':'150 120 660 380');
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
 if(lock)h+='<div class="lb-msg lb-plain">'+ic('lock')+'<span>실험을 시작해서 예상을 바꿀 수 없어요.</span></div>';
 else if(r.pred.length)h+='<div class="lb-msg lb-plain" aria-live="polite">'+ic('info')+'<span>예상은 맞히기가 아니라 내 생각이에요.</span></div>';
 return cardHead('내 예상','고른 예상은 결과 한 장에 남아요')+wrapB(h)}


/* ───────── 기록 줄(③) ───────── */
function okOf(row,j){if(row==='more'){const c=cnts();return c.L>c.S?0:c.L<c.S?1:2}return ROWS[row].f[j].ok}
function rowSum(row){const r=R(),R0=ROWS[row],x=r.rec[row]||{};
 if(R0.t==='sel')return R0.f.map((f,i)=>(R0.lab?f.l+' ':'')+f.o[x.f[i]]).join(' · ');
 if(R0.t==='cnt')return x.v+' '+R0.u;
 if(R0.t==='stick')return CELLS.length+'칸 모두 붙였어요';
 return R0.sum||''}
function rowReady(row){const r=R(),R0=ROWS[row],x=r.rec[row]||{};if(x.ok)return true;
 if(row==='more')return rowDone('landN')&&rowDone('seaN');
 if(R0.t==='sel')return R0.need.every(k=>r.seen[k]);
 if(R0.t==='cnt')return true;
 if(R0.t==='stick')return Object.keys((r.st||{}).stk||{}).length>0;
 return false}
function numOpen(row){return !UI.fx&&!rowDone(row)}
function rowUI(row){const r=R(),R0=ROWS[row],x=r.rec[row]||{},done=!!x.ok,wr=UI.wrong[row]||[];
 if(done){let h='<div class="lb-mrow lb-mdone"><div class="lb-mrh"><b>'+esc(R0.n)+'</b><span class="lb-okt">'+ic('check')+esc(rowSum(row))+'</span></div>';
  if(UI.fb[row])h+='<div class="lb-msg lb-good" role="status">'+ic('check')+'<span>'+UI.fb[row][1]+'</span></div>';
  return h+'</div>'}
 let h='<div class="lb-mrow"><div class="lb-mrh"><b>'+esc(R0.n)+'</b></div>';
 const D=UI.draft[row]=UI.draft[row]||{};
 const recB=on=>'<button type="button" class="lb-rec-btn" data-act="rowrec" data-row="'+row+'" data-f="rr'+row+'"'+(on?'':' disabled')+'>'+ic('check')+'기록하기</button>';
 if(R0.t==='sel'){const ok=rowReady(row);D.f=D.f||[];
  R0.f.forEach((f,j)=>{const long=f.o.some(t=>t.length>6)||f.o.length>3;
   h+='<div class="lb-cells'+(long||f.l.length>6?' lb-c1':'')+'"><span class="lb-cl">'+esc(f.l)+'</span><span class="lb-seg lb-kseg'+(long?' lb-kwrap':'')+(wr.indexOf(j)>=0?' lb-wrongc':'')+'" role="group" aria-label="'+esc(R0.n+' '+f.l)+'">'+f.o.map((o,i)=>'<button type="button" class="lb-s" data-f="'+row+j+'-'+i+'" data-dr="'+row+':'+j+':'+i+'" aria-pressed="'+(D.f[j]===i)+'"'+(ok?'':' disabled')+'>'+esc(o)+'</button>').join('')+'</span></div>'});
  if(R0.f.some(f=>f.ok===-1))h+='<p class="lb-hint2">냄새는 이 화면에서 맡을 수 없어요. 실제 실험에서 맡은 대로 골라요.</p>';
  h+=recB(ok&&R0.f.every((f,j)=>D.f[j]!=null))}
 if(R0.t==='cnt'){const op=numOpen(row);
  h+='<div class="lb-trials"><label class="lb-trial'+(op?' lb-tcur':'')+'"><span>마지막 번호</span><input class="lb-num lb-numw" inputmode="numeric" maxlength="3" autocomplete="off" data-f="in'+row+'" data-in="'+row+'" aria-label="'+esc(R0.n)+'" value="'+esc(UI.inp[row]||'')+'"'+(op?'':' disabled')+'><span>'+R0.u+'</span></label><button type="button" class="lb-mini" data-act="trial" data-row="'+row+'" data-f="tr'+row+'"'+(op?'':' disabled')+'>'+ic('check')+'적기</button></div>'}
 if(R0.t==='stick'){const n=Object.keys(r.st.stk||{}).length;h+='<p class="lb-hint2">붙인 칸 <b>'+n+'</b> / '+CELLS.length+'</p><span class="lb-mbar lb-stbar" aria-hidden="true"><i style="width:'+(n/CELLS.length*100).toFixed(1)+'%"></i></span>'}
 if(R0.t==='auto'){const st=r.st;let t='';
  if(row==='drop')t='육지의 물 '+(st.mlL?'1 mL':'0 mL')+' · 바닷물 '+(st.mlS?'1 mL':'0 mL');
  if(row==='chip')t='육지의 물 접시 '+(st.chL||0)+'개 · 바닷물 접시 '+(st.chS||0)+'개';
  if(row==='off')t=st.heat?'핫플레이트가 켜져 있어요.':st.onP?'핫플레이트가 꺼져 있어요.':'아직 접시를 올리지 않았어요.';
  if(t)h+='<p class="lb-hint2">'+t+'</p>'}
 if(UI.fb[row])h+='<div class="lb-msg '+(UI.fb[row][0]?'lb-good':'lb-try')+'" role="status">'+ic(UI.fb[row][0]?'check':'info')+'<span>'+UI.fb[row][1]+'</span></div>';
 return h+'</div>'}
/* 앞 기록 줄을 다 쓰기 전에는 뒤 줄을 이름만(카드 글자가 줄어들지 않게) */
function waitRow(row){return '<div class="lb-mrow lb-mwait"><div class="lb-mrh"><b>'+esc(ROWS[row].n)+'</b><span class="lb-mwt">위 칸을 먼저 기록해요</span></div></div>'}
/* 본 것을 글로(선택) */
function memoUI(){const r=R();return '<div class="lb-memo"><label class="lb-label" for="lbMemo">본 것을 글로 써요 (쓰고 싶으면)</label><input id="lbMemo" class="lb-input" maxlength="60" placeholder="바닷물 접시에는 ~" value="'+esc(r.memo||'')+'"></div>'}

/* ───────── 할 일 카드: ① 해 보기 → ② 살펴보기 → ③ 기록하기 ───────── */
function acted(s){const r=R();return !!(r.act&&r.act[s.id])||(s.k==='scene'&&!!r.done[s.id])||(s.k==='meas'&&s.rows.some(k=>ROWS[k].t==='cnt'||ROWS[k].t==='stick'))}
function looked(s){if(s.k==='scene')return !!R().done[s.id];if(s.k==='meas')return s.rows.every(rowReady);return true}
function lbl(a){const x=actsOf(curStep()).find(b=>b.id===a);return x?x.label:''}
function hintOf(s){const r=R(),id=s.id,D=isDone(r.step),st=r.st||{};
 if(s.k==='scene'){if(UI.fx)return s.look;if(r.done[id])return '잘했어요. 이어서 가요.';return s.opts?s.ask:'① '+jo(s.act,'을','를')+' 눌러요.'}
 if(D)return '다 했어요. 이어서 가요.';
 if(UI.fx)return s.look;
 const need=s.rows.find(k=>!rowDone(k)),R0=ROWS[need];
 if(R0.t==='stick'){const n=CELLS.length-Object.keys(st.stk||{}).length;return '① 반짝이는 칸을 보고 알맞은 붙임딱지를 눌러요. (남은 칸 '+n+'개)'}
 if(R0.t==='cnt')return '③ 지구본을 돌려 '+(R0.k==='L'?'육지':'바다')+' 붙임딱지의 마지막 번호를 찾아 써요.';
 if(R0.t==='sel'){if(rowReady(need))return '③ '+R0.n+': 알맞은 것을 골라 기록해요.';
  const miss=R0.need.find(k=>!r.seen[k]);if(!miss)return '③ 알맞은 것을 골라 기록해요.';
  if(id==='heat')return heatHint(st);
  return '① '+jo(lbl(miss),'을','를')+' 눌러요.'}
 if(R0.t==='auto'){if(need==='drop')return '① '+(!st.mlL?'육지의 물':'바닷물')+' 1 mL 넣기를 눌러요.';
  if(need==='chip')return (st.chL||0)===(st.chS||0)?'① 두 접시에 끓임쪽을 넣어요.':'① 두 접시의 끓임쪽 개수가 같아지게 넣어요.';
  if(need==='off')return heatHint(st)}
 return ''}
function heatHint(st){if(!st.onP)return '① 두 접시를 핫플레이트에 동시에 올려요.';if(!st.heat&&!rowDone('off'))return '① 핫플레이트를 켜요.';
 if(st.lv>0)return '① 시간이 흐르게 하기를 눌러 두 접시의 물을 멀리서 봐요.';return '① 물이 모두 없어졌으면 핫플레이트를 꺼요.'}
function gPart(n,t,st,body){return '<li class="lb-gp lb-'+st+'"'+(st==='wait'?' inert aria-disabled="true"':'')+'><div class="lb-gh"><i>'+(st==='ok'?ic('check'):n)+'</i><b>'+t+'</b></div>'+(body?'<div class="lb-gb">'+body+'</div>':'')+'</li>'}
function actBtns(s){const A=actsOf(s),cells=A.filter(a=>a.cell),rest=A.filter(a=>!a.cell);let h='',hr='',hc='';const cf=cells.length&&rest.length&&rest.every(a=>a.sub);
 if(rest.length)hr+='<div class="lb-acts">'+rest.map(a=>'<button type="button" class="lb-act'+(a.sub?' lb-act2':'')+(UI.attn&&!a.dis?' lb-attn':'')+'" data-act="x" data-x="'+a.id+'" data-f="x'+a.id+'"'+(a.pressed!=null?' aria-pressed="'+!!a.pressed+'"':'')+(a.dis?' disabled':'')+'>'+ic(a.icon||'hand')+'<span>'+esc(a.label)+'</span></button>').join('')+'</div>';
 if(cells.length)hc+='<div class="lb-cellrow" role="group" aria-label="'+esc(cells[0].grp)+'"><span class="lb-cl">'+esc(cells[0].grp)+'</span><div style="grid-template-columns:repeat('+cells.length+',1fr)">'+cells.map(a=>'<button type="button" class="lb-cellb'+(UI.attn&&!a.dis?' lb-attn':'')+'" data-act="x" data-x="'+a.id+'" data-f="x'+a.id+'" aria-pressed="'+!!a.pressed+'"'+(a.dis?' disabled':'')+' aria-label="'+esc(cells[0].grp+' '+a.label)+'">'+esc(a.label)+'</button>').join('')+'</div></div>';
 h=cf?hc+hr:hr+hc;
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
 h+=gPart(1,'해 보기',L?'ok':'cur',actBtns(s));
 h+=gPart(2,'살펴보기',!A?'wait':L?'ok':'cur','<p>'+esc(s.look)+'</p>');
 h+=gPart(3,'기록하기',D?'ok':on3?'cur':'wait',s.rows.filter(k=>k!=='more'||rowReady('more')).map((k,i,a)=>ROWS[k].t==='sel'&&a.slice(0,i).some(j=>ROWS[j].t==='sel'&&!rowDone(j))?waitRow(k):rowUI(k)).join('')+(s.memo&&s.rows.every(rowDone)?memoUI():''));
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
 h+='<div class="lb-mine"><b>내 기록</b> '+v.rows.filter(k=>rowDone(k)&&ROWS[k].t!=='auto'&&ROWS[k].t!=='stick').map(k=>esc(ROWS[k].n)+': '+esc(rowSum(k))).join(' / ')+'</div>';
 h+='<p class="lb-frame">'+frameHTML(v,r.bl,'edit')+'</p><div class="lb-chips" role="group" aria-label="낱말 카드">'+v.chips.map((c,i)=>'<button type="button" class="lb-chip" data-f="c'+i+'" data-chip="'+i+'">'+esc(c)+'</button>').join('')+'</div>';
 const all=r.bl.length&&r.bl.every(x=>x);
 if(!r.cmp)h+='<button type="button" class="lb-act" data-act="cmp" data-f="doit"'+(all&&cChanged(r)?'':' disabled')+'>'+ic('flask')+'<span>기록과 견주기</span></button>';
 if(r.cmp)h+='<div class="lb-cmp" role="status"><b>'+ic('flask')+'교과서 결론</b>'+esc(v.book)+'</div><div class="lb-msg lb-good">'+ic('check')+'<span>내 결론이 기록과 맞아요.</span></div>';
 else if(r.clast&&!cChanged(r)){const wr=r.bl.map((w,i)=>i).filter(i=>cWrong(v,r,i));h+='<div class="lb-msg lb-try" role="status">'+ic('info')+'<span>빨간 빈칸을 기록과 다시 견줘요.'+(r.ctry>=2&&wr.length?' '+wr.map(i=>esc(v.hint[i])).join(' '):'')+'</span></div>'}
 return cardHead('결론 쓰기','빈칸을 누르고 낱말 카드를 골라요')+wrapB(h)}


/* ───────── 결과 한 장 ───────── */
function barChart(v,r){const rows=v.rows.filter(k=>ROWS[k].t==='cnt');if(!rows.length)return '';
 const vals=rows.map(k=>rowDone(k)?r.rec[k].v:null),mx=Math.max(1,...vals.filter(x=>x!=null))*1.15,W=340,H=130,bw=70,gap=(W-rows.length*bw)/(rows.length+1);
 let g='<svg class="lb-chart" viewBox="0 0 '+W+' '+(H+44)+'" role="img" aria-label="붙임딱지 수 막대그래프">';
 rows.forEach((k,i)=>{const x=gap+i*(bw+gap),v0=vals[i],hh=v0==null?0:v0/mx*H,c=ROWS[k].k==='L'?'#C98A1A':'#2F68B0';
  g+='<rect x="'+x+'" y="'+(H-hh)+'" width="'+bw+'" height="'+hh+'" fill="'+c+'"/>'+(v0!=null?'<text x="'+(x+bw/2)+'" y="'+(H-hh-5)+'" text-anchor="middle" font-size="16" font-weight="700" fill="#141A26">'+v0+'</text>':'')+
  '<text x="'+(x+bw/2)+'" y="'+(H+20)+'" text-anchor="middle" font-size="14" fill="#141A26">'+esc(ROWS[k].n.replace(' 수',''))+'</text>'});
 return g+'<path d="M0 '+H+' H'+W+'" stroke="#9E968A"/></svg>'}
function sheetTable(v,r){let h='<table class="lb-tbl"><caption class="lb-sr">관찰 기록</caption><thead><tr><th scope="col">무엇을</th><th scope="col">내 기록</th></tr></thead><tbody>';
 v.rows.filter(k=>ROWS[k].t!=='auto').forEach(k=>{h+='<tr><th scope="row">'+esc(ROWS[k].n)+'</th><td>'+(rowDone(k)?esc(rowSum(k)):'—')+'</td></tr>'});
 if(r.memo)h+='<tr><th scope="row">본 것을 글로</th><td>'+esc(r.memo)+'</td></tr>';
 return h+'</tbody></table>'}
function planSummary(v,r){const P=v.plan;if(!P)return '';if(!r.planOk)return '<p>(계획을 건너뛰었어요)</p>';
 return '<div class="lb-sh-tags">'+P.rows.map(x=>{const d=r.plan[x[0]]==='d';return '<span class="lb-sh-tag'+(d?' lb-d':'')+'">'+(d?'다르게: ':'같게: ')+esc(x[1])+'</span>'}).join('')+'</div>'}
function sheetHTML(){const v=V(),r=R();const done=v.steps.map(id=>stepDef(v,id)).filter(s=>(s.k==='scene'||s.k==='meas')&&s.id!=='tools');
 const today=new Date();const ds=today.getFullYear()+'. '+(today.getMonth()+1)+'. '+today.getDate()+'.';
 let h='<article class="lb-sheet" id="lbSheet" aria-label="실험 결과 한 장"><div class="lb-sh-in"><header class="lb-sh-h"><div><h2>실험 결과 한 장 · '+esc(v.title)+'</h2><span>탐구 실험관 · 3학년 2학기 과학 · 2. 지구와 바다 · '+ds+'</span></div><div class="lb-sh-name">이름 <u>'+(esc(DB.name)||'&nbsp;')+'</u></div></header><div class="lb-sh-grid"><div class="lb-sh-col">';
 h+='<section class="lb-sh-sec"><h3><i></i>실험 문제</h3><p><b>'+esc(v.q)+'</b></p>'+planSummary(v,r)+'</section>';
 h+='<section class="lb-sh-sec lb-sh-po"><h3><i></i>실험한 차례</h3><div class="lb-sh-steps">'+done.map((s,i)=>'<div><b>'+(i+1)+'.</b> '+esc(s.t)+'</div>').join('')+'</div></section>';
 h+='<section class="lb-sh-sec"><h3><i></i>내 예상</h3><p>'+v.pred.map((q,j)=>(v.pred.length>1?esc(q.q)+' ':'')+(r.pred[j]!=null?esc(q.o[r.pred[j]]):'(고르지 않았어요)')).join('<br>')+(r.why?'<br>까닭: '+esc(r.why):'')+'</p></section>';
 h+='</div><div class="lb-sh-col"><section class="lb-sh-sec"><h3><i></i>관찰 기록</h3>'+sheetTable(v,r)+barChart(v,r)+'</section>';
 h+='<section class="lb-sh-sec"><h3><i></i>내 결론</h3><div class="lb-sh-box"><p class="lb-sh-concl">'+frameHTML(v,r.bl,'sheet')+'</p>'+(r.cmp?'<p class="lb-sh-book">교과서 결론: '+esc(v.book)+'</p>':'')+'</div></section>';
 h+='</div></div>'+picsHTML(snapList(v,r))+'<section class="lb-sh-sec lb-sh-po lb-sh-fill"><h3><i></i>새로 알게 된 것 · 더 알고 싶은 것</h3><div class="lb-sh-lines">'+'<div class="lb-ln"></div>'.repeat(9)+'</div></section>';
 h+='<footer class="lb-sh-f"><span>아주 단순하게 만든 모형의 결과예요. 실제 교실에서는 결과가 조금씩 달라요.</span><span>만든 사람: 초등교사 홍지희</span></footer></div></article>';
 return h}
const LABNAME='earth';
function snapsOf(v,r){const L=[],no=v.no,S=(g,vb,cap)=>L.push([svg(g,cap,vb),cap]);const sm=k=>rowDone(k)?rowSum(k):'—';const st=r.st||{};
 if(no===1){S(sceneBag({st:'full',fan:1,fanLines:0}),'60 120 640 300','부채질 · '+sm('fanBag'));
  S(sceneBag({st:'press',open:1,press:1,palm:1,feel:1}),'260 100 520 320','입구의 손바닥 · '+sm('palm'))}
 if(no===2){const o={stk:st.stk||{},ord:st.ord||[],nums:true};
  S(bg({room:1})+globe(Object.assign({lam:127,phi:15},o)),'250 30 460 470','아시아 쪽');
  S(bg({room:1})+globe(Object.assign({lam:-75,phi:15},o)),'250 30 460 470','아메리카 쪽');
  S(bg({room:1})+globe({lam:20,phi:-90}),'250 30 460 470','남극 위(붙임딱지 없이) · '+(rowDone('poleS')?r.rec.poleS.f.map((x,i)=>ROWS.poleS.f[i].o[x]).join(' · '):'—'))}
 if(no===3){S(bg({})+beaker(330,416,'육지의 물')+beaker(630,416,'바닷물'),'230 230 500 240','가열하기 전 · '+sm('same'));
  S(bg({})+hotplate(true)+edish(DX.L,HP.y,{lv:.42,chips:st.chL||1})+edish(DX.S,HP.y,{lv:.42,chips:st.chS||1}),'220 230 520 230','가열하는 동안 · '+sm('heatW'));
  S(bg({})+edish(DX.L,416,{chips:st.chL||1})+edish(DX.S,416,{chips:st.chS||1,salt:1})+tag(DX.L,320,'육지의 물',17)+tag(DX.S,320,'바닷물',17),'270 352 420 76','가열한 뒤 · 바닷물 접시: '+(rowDone('dishS')?ROWS.dishS.f[0].o[r.rec.dishS.f[0]]:'—'))}
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
 if(!DB.cur||!EXPS[DB.cur]){H.classList.remove('lb-inrun');$('#lbSub').textContent='3학년 2학기 과학 · 2단원 지구와 바다';$('#lbChoose').hidden=true;$('#lbClearMi').hidden=true;
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
  const card=$('#lbCard');const ch=s.k==='plan'?planCard():s.k==='pred'?predCard():(s.k==='meas'||s.k==='scene'||s.k==='more')?taskCard(s):s.k==='concl'?conclCard():'';card.hidden=!ch;
  /* 같은 단계에서 다시 그릴 때 카드 스크롤 자리를 지킴(고르기 단추를 누를 때마다 맨 위로 가지 않게) */
  const sid=DB.cur+':'+r.step,ob=card.querySelector('.lb-card-b'),sc=card.dataset.sid===sid&&ob?ob.scrollTop:0;card.dataset.sid=sid;
  set(card,ch);UI.csc=sc}
 set($('#lbFoot'),footHTML(v,r,s));
 fitAll();cardScroll();clearTimeout(render.ft);render.ft=setTimeout(()=>{const cb=$('#lbCard .lb-card-b');UI.csc=cb?cb.scrollTop:null;fitAll();cardScroll()},350)}
/* 카드가 넘칠 때: 자리를 되살리고, 새로 '지금 할 차례'가 된 칸이 보이게 */
function cardScroll(){const cb=$('#lbCard .lb-card-b');if(!cb||narrow())return;if(UI.csc!=null){cb.scrollTop=UI.csc}
 if(cb.scrollHeight<=cb.clientHeight+1)return;const cur=[...cb.querySelectorAll('.lb-gp.lb-cur')].pop();if(!cur)return;
 const key=$('#lbCard').dataset.sid+':'+cur.querySelector('.lb-gh b').textContent+':'+cb.querySelectorAll('.lb-mdone').length;if(UI.ckey===key)return;UI.ckey=key;
 const a=cb.getBoundingClientRect(),c=cur.getBoundingClientRect();if(c.bottom>a.bottom||c.top<a.top)cb.scrollTop+=Math.min(c.top-a.top-6,c.bottom-a.bottom+6);UI.csc=cb.scrollTop}
function fitBox(box,inner,min){if(!box||!inner)return;inner.style.zoom='';if(narrow()||!box.clientHeight)return;if(box.scrollHeight<=box.clientHeight+1)return;let z=Math.max(min,box.clientHeight/box.scrollHeight);inner.style.zoom=z.toFixed(3);let n=0;while(box.scrollHeight>box.clientHeight+1&&z>min&&n++<12){z=Math.max(min,z-.02);inner.style.zoom=z.toFixed(3)}}
function fitAll(){fitBox($('#lbCard .lb-card-b'),$('#lbCard .lb-fit'),.84);fitBox($('#lbRail'),$('#lbRail .lb-rwrap'),.7);fitBox($('#lbSheet'),$('#lbSheet .lb-sh-in'),.56)}
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
 h+='</div><div class="lb-rail-note"><p>아주 단순하게 만든 모형이에요. 실제로는 결과가 조금씩 달라요.</p><p>만든 사람: 초등교사 홍지희</p></div></div>';
 return h}
/* 이 단계의 행동 단추 */
function actsOf(s){const r=R(),A=[],busy=!!UI.fx,st=r.st||{};
 const rot=()=>{[['rl','왼쪽으로'],['rr','오른쪽으로'],['tu','위로'],['td','아래로']].forEach(([k,t])=>A.push({id:k,label:t,cell:1,grp:'지구본 돌리기',dis:busy,pressed:false}))};
 switch(s.id){
  case 'fan':A.push({id:'fan',label:'봉지를 향해 부채질하기',dis:busy});break;
  case 'press':A.push({id:'palm',label:'입구 가까이에 손바닥 가져가기',dis:busy||!!r.seen.palm},{id:'press',label:'봉지를 눌러 입구 열기',dis:busy||!r.seen.palm});break;
  case 'swap':A.push({id:'swap',label:'역할 바꿔 한 번 더 하기',dis:busy});break;
  case 'stick':{const end=st.cur==null;A.push({id:'gL',label:'육지 붙임딱지',cell:1,grp:'반짝이는 칸에 붙일 붙임딱지',dis:busy||end,pressed:false},{id:'gS',label:'바다 붙임딱지',cell:1,grp:'반짝이는 칸에 붙일 붙임딱지',dis:busy||end,pressed:false});
   A.push({id:'undo',label:'마지막 붙임딱지 떼기',icon:'replay',sub:1,dis:busy||!(st.ord||[]).length});
   if(DB.ui.open)A.push({id:'fillall',label:'남은 칸 한꺼번에 붙이기 (선생님)',icon:'grid',sub:1,dis:busy||end});break}
  case 'count':rot();break;
  case 'pole':A.push({id:'vN',label:'북극 위에서 보기',icon:'eye',dis:busy,pressed:st.phi===90},{id:'vS',label:'남극 위에서 보기',icon:'eye',dis:busy,pressed:st.phi===-90});break;
  case 'beaker':A.push({id:'see',label:'두 물의 색깔 보기',icon:'eye',dis:busy},{id:'smell',label:'손으로 바람을 일으켜 냄새 맡기',dis:busy},{id:'taste',label:'맛보기',sub:1,icon:'care',dis:busy});break;
  case 'drop':A.push({id:'dL',label:'육지의 물 1 mL 넣기',icon:'drop',dis:busy||rowDone('drop')},{id:'dS',label:'바닷물 1 mL 넣기',icon:'drop',dis:busy||rowDone('drop')});break;
  case 'chip':A.push({id:'cL',label:'육지의 물 접시에 하나 넣기',dis:busy||rowDone('chip')||(st.chL||0)>=3},{id:'cS',label:'바닷물 접시에 하나 넣기',dis:busy||rowDone('chip')||(st.chS||0)>=3});break;
  case 'heat':if(!st.onP)A.push({id:'onP',label:'두 접시를 동시에 올리기',dis:busy});else if(!st.heat&&!rowDone('off'))A.push({id:'pwr',label:'핫플레이트 켜기',dis:busy});else if(st.heat)A.push({id:'wait',label:'시간이 흐르게 하기',icon:'clock',dis:busy||st.lv<=0},{id:'poff',label:'핫플레이트 끄기',dis:busy},{id:'near',label:'가까이 가서 들여다보기',icon:'care',sub:1,dis:busy});break;
  case 'dish':A.push({id:'lensL',label:'육지의 물 접시',cell:1,grp:'자세히 볼 접시',dis:busy,pressed:st.lens==='L'},{id:'lensS',label:'바닷물 접시',cell:1,grp:'자세히 볼 접시',dis:busy,pressed:st.lens==='S'});break}
 return A}
/* 아래 막대: 이전 · 진행 · 이어서 */
function footHTML(v,r,s){const N=v.steps.length;
 let h='<button type="button" class="lb-btn" data-act="prev" data-f="prev"'+(r.step===0?' disabled':'')+'>'+ic('left')+'이전</button>';
 h+='<div class="lb-fmid"><span class="lb-pgn">'+(r.step+1)+' / '+N+'</span><span class="lb-prog" aria-hidden="true">'+v.steps.map((x,i)=>'<i class="'+(i<r.step?'lb-d':i===r.step?'lb-n':'')+'"></i>').join('')+'</span></div>';
 let pri='이어서',priOn=canNext(),priAct='next';if(s.k==='sheet'){pri='실험 고르기로';priOn=true;priAct='home'}
 return h+'<button type="button" class="lb-btn lb-pri'+(priOn&&priAct==='next'?' lb-go':'')+'" data-act="'+priAct+'" data-f="pri"'+(priOn?'':' disabled')+'>'+esc(pri)+ic('right')+'</button>'}

/* ───────── 오늘의 실험: 탐구 문제 · 이렇게 해요 · 이것을 살펴봐요 (결과는 보여 주지 않음) ───────── */
function introPic(no,k){const n0=NAR,l0=LEG;NAR=true;LEG=[];let g=bg({}),vb='0 0 960 540';
 if(no===1){if(k==='swing'){g=sceneBag({st:'full'})+swoosh();vb='160 60 560 360'}if(k==='fan'){g=sceneBag({st:'full',fan:1,fanLines:1});vb='60 110 640 320'}
  if(k==='press'){g=sceneBag({st:'press',open:1,press:1,palm:1});vb='240 100 520 320'}if(k==='swap'){g=sceneBag({st:'full',fan:1,swap:1});vb='60 110 640 320'}}
 if(no===2){const ex={},ord=[];CORDER.slice(0,9).forEach(i=>{ex[i]=cellTruth(CELLS[i])==='L'?'L':'S';ord.push(i)});g=bg({room:1});vb='250 30 460 470';
  if(k==='turn')g+=globe({lam:127,phi:20})+arrow(300,500,660,500);
  if(k==='stick')g+=globe({lam:127,phi:10,stk:ex,ord});
  if(k==='number')g+=globe({lam:127,phi:10,stk:ex,ord,nums:1});
  if(k==='count')g+=globe({lam:127,phi:10,stk:ex,ord,nums:1})+qmark(480,262)}
 if(no===3){if(k==='look'){g+=beaker(330,416)+beaker(630,416);vb='230 230 500 220'}
  if(k==='drop'){g+=edish(DX.L,416,{lv:1})+edish(DX.S,416,{lv:1})+dropper(DX.L,240)+dropper(DX.S,240);vb='250 200 460 240'}
  if(k==='heat'){g+=hotplate(true)+edish(DX.L,HP.y,{lv:.7,chips:1})+edish(DX.S,HP.y,{lv:.7,chips:1});vb='220 230 520 230'}
  if(k==='dish'){g+=hotplate(false)+edish(DX.L,HP.y,{chips:1})+edish(DX.S,HP.y,{chips:1})+qmark(DX.L,250)+qmark(DX.S,250);vb='220 200 520 260'}}
 const s=svg(g,'',vb).replace(' role="img" aria-label=""',' aria-hidden="true"');NAR=n0;LEG=l0;return s}
function introBody(){const v=V();
 return '<div class="lb-intro"><div class="lb-iq"><span class="lb-itag">'+ic('flask')+'탐구 문제</span><p>'+esc(v.q)+'</p></div>'+
 '<section class="lb-isec" aria-labelledby="lbIh1"><h2 id="lbIh1">'+ic('hand')+'이렇게 해요</h2><ol class="lb-isteps">'+v.how.map((x,i)=>'<li><div class="lb-ipic">'+introPic(v.no,x[0])+'</div><p><b>'+(i+1)+'</b><span>'+esc(x[1])+'</span></p></li>').join('')+'</ol></section>'+
 '<section class="lb-isec lb-ilook" aria-labelledby="lbIh2"><h2 id="lbIh2">'+ic('eye')+'이것을 살펴봐요</h2><ul>'+v.look.map(t=>'<li>'+ic('check')+'<span>'+esc(t)+'</span></li>').join('')+'</ul></section></div>'}
/* ② 살펴보기: 볼 곳을 확대 렌즈로 */
let LZ=0;
function lensOf(s,g){let sp=s.spot;if(typeof sp==='function')sp=sp();if(!sp||!(acted(s)||UI.fx||s.id==='rule'))return '';
 const [x,y,rr,z,lx,ly]=sp,R2=Math.round(rr*z),id='lbLz'+(++LZ),dx=lx-x,dy=ly-y,d=Math.hypot(dx,dy)||1;
 const ax=x+dx/d*rr,ay=y+dy/d*rr,bx=lx-dx/d*R2,by=ly-dy/d*R2;
 return '<g class="lb-lens" aria-hidden="true"><circle cx="'+x+'" cy="'+y+'" r="'+rr+'" fill="none" stroke="var(--lb-lens)" stroke-width="5" stroke-dasharray="12 8"/>'+
  '<path d="M'+ax.toFixed(1)+' '+ay.toFixed(1)+' L'+bx.toFixed(1)+' '+by.toFixed(1)+'" stroke="var(--lb-lens)" stroke-width="5" stroke-linecap="round"/>'+
  '<clipPath id="'+id+'"><circle cx="'+lx+'" cy="'+ly+'" r="'+R2+'"/></clipPath><circle cx="'+lx+'" cy="'+ly+'" r="'+(R2+7)+'" fill="var(--w-label)"/>'+
  '<g clip-path="url(#'+id+')"><rect x="'+(lx-R2)+'" y="'+(ly-R2)+'" width="'+2*R2+'" height="'+2*R2+'" fill="var(--w-wall)"/><g transform="translate('+lx+' '+ly+') scale('+z+') translate('+(-x)+' '+(-y)+')">'+g.replace(/ id="[^"]*"/g,'').replace(/<g class="lb-lens"[\s\S]*$/,'')+'</g></g>'+
  '<circle cx="'+lx+'" cy="'+ly+'" r="'+R2+'" fill="none" stroke="var(--lb-lens)" stroke-width="7"/></g>'}
function homeArt(no){NAR=true;LEG=[];let g=bg({}),vb='120 70 720 420';
 if(no===1){g=sceneBag({st:'full',fan:1});vb='60 100 660 330'}
 if(no===2){g=bg({room:1})+globe({lam:127,phi:20});vb='160 30 640 470'}
 if(no===3){g+=hotplate(false)+edish(DX.L,HP.y,{lv:1,chips:1})+edish(DX.S,HP.y,{lv:1,chips:1});vb='200 230 560 240'}
 const s=svg(g,'실험 '+no+' 처음 모습',vb);NAR=false;LEG=[];return s}
function homeHTML(){const card=k=>{const v=EXPS[k],r=DB.runs[k];const st=r?(r.fin?'끝냄 · 결과 보기':(r.step+1)+'단계부터 이어서'):'실험 시작하기';
 return '<section class="lb-exc" aria-labelledby="lbE'+v.no+'"><div class="lb-exc-art">'+homeArt(v.no)+'</div><div class="lb-exc-b"><h2 id="lbE'+v.no+'"><em>실험 '+v.no+'</em>'+esc(v.name)+'</h2><p class="lb-exp">'+esc(v.sub)+'</p><button type="button" class="lb-pickb" data-pick="'+k+'" data-f="k'+k+'"><i>'+ic(['','bagi','globei','flask'][v.no])+'</i><span><b>'+st+'</b><span>교과서 실험</span></span>'+(r&&r.fin?'<small>'+ic('check')+'</small>':'')+'</button></div></section>'};
 return '<div class="lb-home"><div class="lb-home-h"><div class="lb-kick"><em>3학년 2학기 과학</em>2. 지구와 바다</div><h1>무엇을 실험할까요?</h1><p>실험을 한 단계씩 직접 해 보고, 내 눈으로 본 것을 기록해요.</p></div>'+
 '<div class="lb-ex lb-ex3">'+['e1','e2','e3'].map(card).join('')+'</div>'+
 '<p class="lb-model">'+ic('info')+'<span>아주 단순하게 만든 모형이에요. 같은 조건이면 언제나 같은 결과가 나와요. 지구본의 칸 44개와 대륙 모양, 물이 줄어드는 단계는 이 실험관에서 정한 모습이에요. 실제 실험에서는 결과가 조금씩 달라요.</span></p></div>'}
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
function putSticker(k){const r=R(),st=r.st,i=st.cur;if(i==null)return;const t=cellTruth(CELLS[i]);
 if(t!=='A'&&t!==k){UI.wrongPut=(UI.wrongPut||0)+1;flash(UI.wrongPut>=2?'반짝이는 칸을 확대 렌즈로 다시 봐요. 초록색 육지와 파란색 바다 중 칸의 절반이 넘는 쪽의 붙임딱지를 붙여요.':'반짝이는 칸을 다시 봐요. 육지와 바다 중 절반이 넘는 쪽은 어디인가요?');return}
 UI.wrongPut=0;st.stk[i]=k;st.ord.push(i);st.cur=nextCell(st);
 if(st.cur==null){r.rec.stick={ok:1};UI.fb={};UI.fb.stick=[1,'모든 칸에 붙임딱지를 붙였어요.'];st.lam=127;st.phi=20}else viewTo(st,st.cur);
 fx('put',420,()=>{const p=$('#lbFoot [data-act="next"]:not(:disabled)');if(p&&isDone(r.step))p.focus({preventScroll:true})})}
function doX(id){const v=V(),r=R(),s=curStep(),st=r.st;if(UI.fx)return;r.act[s.id]=1;
 if(id==='fan'){fx('fan',2200,()=>{r.seen.fan=1});return}
 if(id==='palm'){fx('palm',900,()=>{r.seen.palm=1});return}
 if(id==='press'){fx('press',2000,()=>{r.seen.press=1});return}
 if(id==='swap'){UI.mq={ph:'fan'};later(()=>{UI.mq.ph='press';renderScene()},1500);fx('swap',3200,()=>{r.seen.swap=1;UI.mq={}});return}
 if(id==='gL'||id==='gS'){putSticker(id[1]);return}
 if(id==='undo'){const i=st.ord.pop();if(i==null)return;delete st.stk[i];st.cur=i;delete r.rec.stick;UI.fb={};viewTo(st,i);save();render();return}
 if(id==='fillall'){let i;while((i=nextCell(st))!=null){const t=cellTruth(CELLS[i]);st.stk[i]=t==='A'?'S':t;st.ord.push(i)}st.cur=null;r.rec.stick={ok:1};st.lam=127;st.phi=20;save();render();return}
 if(id==='rl'||id==='rr'){if(Math.abs(st.phi)===90)st.phi=20;st.lam=((st.lam+(id==='rl'?45:-45))+540)%360-180;save();renderScene();render();return}
 if(id==='tu'||id==='td'){st.phi=Math.max(-90,Math.min(90,(st.phi||0)+(id==='tu'?35:-35)));if(Math.abs(st.phi)>80)st.phi=st.phi>0?90:-90;save();render();return}
 if(id==='vN'||id==='vS'){st.phi=id==='vN'?90:-90;st.lam=id==='vN'?127:20;fx('view',600,()=>{r.seen[id]=1});return}
 if(id==='see'){fx('see',1300,()=>{r.seen.see=1});return}
 if(id==='smell'){fx('smell',1800,()=>{r.seen.smell=1});return}
 if(id==='taste'){flash('실험에 쓰는 물은 맛보거나 마시지 않아요.');return}
 if(id==='dL'||id==='dS'){const k=id[1];if(st['ml'+k]){flash('이미 1 mL를 넣었어요. 너무 많이 넣지 않아요.');return}
  fx(id,1500,()=>{st['ml'+k]=1;if(st.mlL&&st.mlS){r.rec.drop={ok:1};UI.fb={};UI.fb.drop=[1,'두 접시에 1 mL씩 넣었어요.']}});return}
 if(id==='cL'||id==='cS'){const k=id[1];fx(id,650,()=>{st['ch'+k]=(st['ch'+k]||0)+1;if(st.chL&&st.chL===st.chS){r.rec.chip={ok:1};UI.fb={};UI.fb.chip=[1,'두 접시에 끓임쪽을 '+st.chL+'개씩 넣었어요.']}});return}
 if(id==='onP'){st.onP=1;fx('onP',1200);return}
 if(id==='pwr'){st.heat=1;fx('pwr',700);return}
 if(id==='wait'){if(!(st.lv>0))return;fx('wait',1700,()=>{st.lv--;r.seen.wait=1});return}
 if(id==='near'){flash('가열할 때 물질이 튈 수 있어요. 멀리서 관찰해요.');return}
 if(id==='poff'){if(st.lv>0){flash('아직 접시에 물이 남아 있어요. 물이 모두 없어지면 꺼요.');return}
  st.heat=0;r.rec.off={ok:1};UI.fb={};UI.fb.off=[1,'핫플레이트를 껐어요. 끈 뒤에도 뜨거우니 만지지 않아요.'];save();render();return}
 if(id==='lensL'||id==='lensS'){st.lens=id[4];fx(id,800,()=>{r.seen[id]=1});return}}
/* 숫자 적기: 내가 붙인 붙임딱지 수와 같은지만 알려 줌. 같은 값으로 다시 누르면 세지 않음 */
function tryKey(k,val){const r=R();if(r.last[k]===val)return -1;r.last[k]=val;r.tries[k]=(r.tries[k]||0)+1;return r.tries[k]}
function trial(row){const r=R(),R0=ROWS[row];if(!numOpen(row))return;const txt=String(UI.inp[row]||'').trim();
 if(!txt||!/^\d+$/.test(txt)){UI.fb[row]=[0,'숫자로 써요.'];render();return}
 const want=cnts()[R0.k];
 if(+txt===want){r.rec[row]={ok:1,v:want};UI.inp[row]='';UI.hlk=null;UI.attn=false;UI.fb={};UI.fb[row]=[1,'마지막 번호를 잘 찾았어요.'];save();render();const p=$('#lbFoot [data-act="next"]:not(:disabled)');if(p&&isDone(r.step))p.focus({preventScroll:true});return}
 const t=tryKey(row+':t',txt);
 if(t===-1){UI.fb[row]=[0,'숫자가 그대로예요. 지구본을 다시 봐요.'];render();return}
 if(t>=2){UI.hlk=R0.k;const m=maxCell(R0.k);if(m!=null){const st=r.st,c=cellMid(CELLS[m]);st.lam=c[0];st.phi=Math.max(-62,Math.min(62,c[1]))}UI.fb[row]=[0,'빨간 동그라미 안의 붙임딱지 번호를 봐요. '+(R0.k==='L'?'육지':'바다')+' 붙임딱지 가운데 가장 큰 번호예요.']}
 else UI.fb[row]=[0,'지구본을 돌려 '+(R0.k==='L'?'육지':'바다')+' 붙임딱지의 가장 큰 번호를 다시 찾아봐요.'];
 save();render()}
function rowRec(row){const r=R(),R0=ROWS[row],D=UI.draft[row]||{};let ok,wrong=[],key;
 const f=D.f||[];R0.f.forEach((x,j)=>{const o=okOf(row,j);if(o!==-1&&f[j]!==o)wrong.push(j)});ok=!wrong.length;key=f.join(',');
 if(ok){UI.attn=false;r.rec[row]={ok:1,f:D.f.slice()};UI.fb={};UI.fb[row]=[1,'잘 살펴보고 적었어요.'];UI.wrong[row]=[];save();render();const p=$('#lbFoot [data-act="next"]:not(:disabled)');if(p&&isDone(R().step))p.focus({preventScroll:true});return}
 const t=tryKey(row+':r',key);
 if(t===-1){UI.fb[row]=[0,'고른 것이 그대로예요. 다시 살펴봐요.'];render();return}
 UI.wrong[row]=wrong;
 if(t>=2){UI.attn=true;UI.fb[row]=[0,'빨간 칸을 다시 봐요. 아래 반짝이는 단추를 눌러 다시 해 봐도 돼요.']}
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
 if(t.dataset&&t.dataset.in!=null){UI.inp[t.dataset.in]=t.value.replace(/[^\d]/g,'');if(t.value!==UI.inp[t.dataset.in])t.value=UI.inp[t.dataset.in]}
 if(t.id==='lbMemo'){R().memo=t.value;save()}
 if(t.id==='lbName'){DB.name=t.value;save();const u=$('#lbSheet .lb-sh-name u');if(u)u.textContent=DB.name||' '}});
let rzT=0,wasN=narrow();addEventListener('resize',()=>{clearTimeout(rzT);rzT=setTimeout(()=>{const n=narrow();if(n!==wasN){wasN=n;const s=$('#lbScene');if(s)s._h=null}if(DB.cur)render();else fitAll()},150)});
if(DB.cur&&EXPS[DB.cur]){if(!DB.runs[DB.cur])DB.runs[DB.cur]=newRun();enterStep()}
render();

addEventListener('beforeprint',()=>{const s=$('#lbSheet .lb-sh-in');if(s)s.style.zoom=''});addEventListener('afterprint',()=>{try{fitAll()}catch(e){}});
