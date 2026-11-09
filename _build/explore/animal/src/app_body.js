/* 동물의 생활 실험관에서 더 쓰는 아이콘 */
Object.assign(I,{bug:'<ellipse cx="12" cy="14" rx="5" ry="6.5"/><circle cx="12" cy="6.5" r="2.6"/><path d="M7 11 3.5 9M7 15H3M7.5 18.5 4.5 21M17 11l3.5-2M17 15h4M16.5 18.5l3 2.5M10.5 4.5 9 2M13.5 4.5 15 2"/>',
 fan:'<path d="M12 21 4 6.5a12 12 0 0 1 16 0z"/><path d="M12 21 8.6 5.2M12 21l3.4-15.8M12 21V4.6"/>',
 bag:'<rect x="4.5" y="5.5" width="15" height="15" rx="2"/><path d="M4.5 8.5h15"/><path d="M7.5 20.5v-6a4.5 4.5 0 0 1 9 0v6"/>',
 clock:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>'});

/* ───────── 기록(이 기기에만) ───────── */
const KEY='hj-animal-v1';
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
 r.st.lg=r.st.lg||{}}
/* 예상은 예상 단계 뒤의 관찰을 시작하면 잠김(예상 앞의 자유 관찰은 잠그지 않음) */
function predLocked(){const r=R();return !!r.obs}
function planChanged(r){if(!r.planLast)return true;return JSON.stringify(r.plan)!==JSON.stringify(r.planLast)}

/* ───────── 장면 ───────── */
function fxOn(id){return UI.fx&&UI.fx.id===id}
function has(id){const r=R(),k=idxOf(id);if(k<0)return false;return k<r.step||(k===r.step&&(!!r.done[id]||fxOn(id)))}
const sn=id=>!!R().seen[id]||fxOn(id);   /* 해 본 행동(또는 지금 하는 중) */

/* 실험 1 */
function marksOf(){const st=R().st;return st.lg||{}}
function e1Scene(s){const r=R(),id=s.id,f=UI.fx;let g=deskTop();const E=EXC;
 const sh=o=>exuvia(E.x,E.y,E.s,o);
 if(id==='pred')return g+dish(E.x,E.y,236)+'<g transform="translate(180 120) scale(1.5)">'+itemArt('shell')+'</g>'+qmark(E.x,E.y);
 if(id==='dish'){const on=has('dish');g+=dish(E.x,E.y,236);
  if(!on)return g+exuvia(150,330,.48,{})+'<g opacity=".95">'+pinch(240,250,1,30)+'</g>';
  return g+'<g'+(fxOn('dish')?an('lb-a-move',0,'--dx:-330px;animation-duration:1.7s'):'')+'>'+sh({})+'</g>'}
 if(id==='head'){g+=dish(E.x,E.y,236)+sh({hl:(sn('lh')?'head':'')});if(!sn('lh'))g+=loupe(770,120,46,0);return g}
 if(id==='legs'){const tap=!!r.act.legs&&!f;g+=dish(E.x,E.y,236)+sh({tap,marks:marksOf()});if(!r.act.legs)g+=loupe(790,110,46,0);return g}
 if(id==='fore'){g+=dish(E.x,E.y,236)+sh({hl:UI.mq.cur==='f'?'fore':UI.mq.cur==='m'?'mid':''});return g}
 if(id==='draw'){g+=dish(E.x,E.y,236)+sh({});if(fxOn('ld'))g+='<g'+an('lb-a-slide',0,'--dx:-420px;animation-duration:2s')+'>'+loupe(E.x+150,E.y+40,56,0)+'</g>';return g}
 if(id==='clean'){const on=has('clean');
  const box='<g transform="translate(250 300)"><rect x="-120" y="-80" width="240" height="160" rx="14" fill="var(--w-kraft)" stroke="var(--w-kraft-s)" stroke-width="3"/><rect x="-100" y="-62" width="200" height="124" rx="10" fill="var(--w-box2)" opacity=".25"/></g>';
  if(!on)return g+box+dish(640,290,170)+exuvia(640,296,.7,{});
  return g+box+'<g'+(fxOn('clean')?an('lb-a-move',0,'--dx:390px;animation-duration:1.4s'):'')+'>'+exuvia(250,300,.4,{})+'</g>'+basin(660,300)+
   '<g'+(fxOn('clean')?an('lb-a-fade',1.2):'')+'>'+'<g transform="translate(660 270)">'+palmPair()+'</g></g>'}
 return g+dish(E.x,E.y,236)+sh({})}
/* 세면대(위에서 본 모습) */
function basin(cx,cy){return '<rect x="'+(cx-200)+'" y="'+(cy-150)+'" width="400" height="300" rx="40" fill="#F4F7F9" stroke="#9AA6B2" stroke-width="4"/><ellipse cx="'+cx+'" cy="'+(cy+20)+'" rx="150" ry="100" fill="#DDE7EE" stroke="#9AA6B2" stroke-width="3"/><circle cx="'+cx+'" cy="'+(cy+60)+'" r="10" fill="#9AA6B2"/><rect x="'+(cx-16)+'" y="'+(cy-140)+'" width="32" height="70" rx="10" fill="#B8C2CC" stroke="#7E8A96" stroke-width="2.5"/>'}
function palmPair(){let g='<g transform="translate(-60 0) rotate(-12)">'+palm(0,0,1.3)+'</g><g transform="translate(60 0) scale(-1 1) rotate(-12)">'+palm(0,0,1.3)+'</g>';
 for(let i=0;i<7;i++)g+='<circle cx="'+(-70+i*24)+'" cy="'+(-50-(i%3)*18)+'" r="'+(8+i%3*3)+'" fill="#FFFFFF" fill-opacity=".85" stroke="#9EC5E8" stroke-width="2"/>';return g}
/* 실험 2 */
function e2Scene(s){const r=R(),id=s.id,f=UI.fx;let g=bg({});
 if(id==='float'){const on=has('float');
  g+=tankRound({inner:on?(fxOn('float')?ripples(2,false,true).replace(/cx="[\d.]+"/g,'cx="'+TB.x0+'"'):'')+capArt(TB.x0,TB.wl,fxOn('float')?'drop':''):''})+fanArt({});
  if(!on)g+='<g transform="translate(830 330) scale(1.6)">'+capArt(0,0)+'</g>'+qmark(830,230);return g}
 if(id==='pred'||id==='plan')return g+tankRound({inner:capArt(TB.x0,TB.wl)})+fanArt({})+qmark(800,150);
 if(id==='fanA'||id==='fanB'){const k=id==='fanA'?'A':'B',sk=id==='fanA'?'sa':'sb';
  if(f&&(f.id==='hard'||f.id==='hard2'))return g+tankRound({inner:capArt(TB.x0,TB.wl)+splashDrops()})+fanStir({web:k==='B'},true);
  if(!r.seen[sk]&&!fxOn(sk))return g+tankRound({inner:capArt(TB.x0,TB.wl)})+fanArt({web:k==='B'})+pushGauge(780,60,[[k==='A'?'㈎':'㈏',null]]);
  return g+stirScene(k,fxOn(sk))}
 if(id==='tape'){const on=has('tape'),fxw=fxOn('tape');
  g+='<g transform="translate(110 -10) scale(1.45)">'+fanArt({web:on&&!fxw,part:0,tapeAnim:fxw,nohand:1}).replace(/^/,'')+(fxw?fanArt({web:1,tapeAnim:1,nohand:1}):'')+'</g>';
  if(!on)g+='<g transform="translate(760 300) scale(1.5)">'+itemArt('tapew')+'</g><g transform="translate(760 430) scale(1.3)">'+itemArt('scis')+'</g>'+qmark(480,80);
  return g}
 if(id==='cmp'){const both=sn('sab'),a=fxOn('sab');
  const pnl=(k,x)=>'<g transform="translate('+x+' 20) scale(.52)">'+(both?stirScene(k,a,{nogauge:1}):tankRound({inner:capArt(TB.x0,TB.wl)})+fanArt({web:k==='B'}))+'</g>';
  g+=pnl('A',-30)+pnl('B',440)+mini(170,40,'㈎',24)+mini(640,40,'㈏',24);
  g+=pushGauge(380,300,[['㈎',both?PUSH.A:null],['㈏',both?PUSH.B:null]],a);
  return g}
 if(id==='wipe'){const on=has('wipe');g+=tankRound({inner:capArt(TB.x0+CAPD.B*TB.u,TB.wl)});
  if(!on)return g+drips(560,440)+cloth(830,440);
  return g+(fxOn('wipe')?'<g'+an('lb-a-out',.9)+'>'+drips(560,440)+'</g><g'+an('lb-a-slide',0,'--dx:260px;animation-duration:1.4s')+'>'+cloth(600,446)+'</g>':cloth(830,440))}
 return g+tankRound({inner:capArt(TB.x0,TB.wl)})+fanArt({})}
function splashDrops(){let g='';for(let i=0;i<9;i++){const x=TB.x0-80+i*22,y=TB.wl-40-(i%4)*22;g+='<path d="M'+x+' '+y+' q-6 10 0 15 q6 -5 0 -15z" fill="var(--w-water-s)"'+an('lb-a-pop',.45+i*.04)+'/>'}return g}
/* 실험 3 */
function e3Scene(s){const r=R(),id=s.id,f=UI.fx;let g=bg({});
 if(id==='gear'){const on=has('gear');
  if(!on)return g+coatArt(360,300,1)+itemArtAt('glove2',640,330)+qmark(500,120);
  return g+'<g'+(fxOn('gear')?an('lb-a-up',0,'--from:120px'):'')+'>'+coatArt(480,300,1.1)+hand(360,250,-80,1.4,1)+hand(600,250,-100,1.4,1)+'</g>'}
 if(id==='vas'){const on=has('vas'),fxv=fxOn('vas');
  g+=zipBag(420,170,{vas:on?.34:0,vasAnim:fxv})+vasJar(700,410);
  if(fxv)g+='<g'+an('lb-a-move',0,'--dx:240px;animation-duration:1.6s')+'>'+spoon(470,140,-25,1)+'</g>';else g+=spoon(660,300,-15,0);
  if(!on)g+=qmark(420,120);return g}
 if(id==='in1'){const on=has('in1');g+=zipBag(480,170,{vas:on?.5:.34,small:on,smallAnim:fxOn('in1')});if(!on)g+='<g transform="translate(760 210) scale(.7)">'+zipBag(0,0,{})+'</g>';return g}
 if(id==='in2'){const on=has('in2');g+=zipBag(BXV,170,{vas:.5,small:1})+zipBag(BXE,170,{small:on,smallAnim:fxOn('in2')});
  if(!on)g+='<g transform="translate(140 210) scale(.7)">'+zipBag(0,0,{})+'</g>';return g+bagNames(470)}
 if(id==='pred'||id==='plan'){if(id==='plan')return g+zipBag(BXE,60,{})+zipBag(BXV,60,{})+vasJar(820,410)+iceTank('')+qmark(480,40);
  return g+iceTank('')+zipBag(BXE,40,{small:1})+zipBag(BXV,40,{small:1,vas:.5})+qmark(480,120)}
 if(id==='dip'){const dp=sn('dp'),out=sn('out'),fd=fxOn('dp'),fo=fxOn('out'),lg=f&&f.id==='long';
  if(!dp&&!fd)return g+iceTank('')+dipBags(110)+arrow(480,150,480,250)+bagNames(476);
  let inW;
  if(fd)inW='<g'+an('lb-a-down',0,'--from:-116px;animation-duration:1s')+'>'+dipBags(226)+'</g>';
  else if(fo)inW='<g'+an('lb-a-up',0,'--from:116px;animation-duration:.9s')+'>'+dipBags(110)+'</g>';
  else inW=dipBags(out?110:226);
  g+=iceTank('')+inW+chillBars(fd);
  if(lg)g+=tag(480,500,'오래 담가 두면 위험해요',20);
  return g+bagNames(476)}
 return g+iceTank('')+zipBag(BXE,40,{small:1})+zipBag(BXV,40,{small:1,vas:.5})}
function itemArtAt(k,x,y){return '<g transform="translate('+x+' '+y+') scale(1.4)">'+(k==='glove2'?hand(-14,-10,-60,.9,1)+hand(26,14,-60,.9,1):itemArt(k))+'</g>'}
function sceneSVG(){const v=V(),r=R(),s=curStep(),id=s.id,no=v.no;
 const T=(g,l,vb)=>svg(g+lensOf(s,g),l||s.t,vb);
 if(id==='tools'){if(!(r.done.tools||fxOn('tools')))return T(bg({})+boxArt(480),'준비물 상자');return T(bg({})+toolsScene(v.tools,fxOn('tools')),'준비물: '+v.tools.map(x=>x[1]).join(', '))}
 if(no===1){const h=T(e1Scene(s),s.t,id==='clean'?'80 120 820 360':'80 30 860 500');return id==='legs'&&R().act.legs?h.replace(' role="img"',' role="group"'):h}
 if(no===2)return T(e2Scene(s),s.t,id==='tape'?'60 30 840 470':id==='cmp'?'0 10 960 510':'60 30 900 470');
 if(no===3)return T(e3Scene(s),s.t,id==='gear'?'160 120 640 360':id==='vas'||id==='in1'?'200 100 640 400':'90 0 780 520');
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
 if(R0.t==='sel')return R0.f.map((f,i)=>(f.l?f.l+' ':'')+f.o[x.f[i]]).join(' · ');
 if(R0.t==='note'){const w=R0.f.map((f,i)=>(x.t&&x.t[i])?f.l+': '+x.t[i]:'').filter(Boolean);return w.length?w.join(' · '):'(쓰지 않았어요)'}
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
  const c2=R0.f.every(f=>f.l.length<=7)?' lb-c2':'';
  R0.f.forEach((f,j)=>{const long=c2?f.o.length>3:f.o.some(t=>t.length>6)||f.o.length>3;
   h+='<div class="lb-cells lb-c1'+c2+'"><span class="lb-cl">'+esc(f.l)+'</span><span class="lb-seg lb-kseg'+(long?' lb-kwrap':'')+(wr.indexOf(j)>=0?' lb-wrongc':'')+'" role="group" aria-label="'+esc(R0.n+' '+f.l)+'">'+f.o.map((o,i)=>'<button type="button" class="lb-s" data-f="'+row+j+'-'+i+'" data-dr="'+row+':'+j+':'+i+'" aria-pressed="'+(D.f[j]===i)+'"'+(ok?'':' disabled')+'>'+esc(o)+'</button>').join('')+'</span></div>'});
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
 if(id==='legs'&&r.act.legs&&!UI.fx&&!r.seen.lc&&!rowDone('legs'))return '② 그림에서 다리를 하나씩 눌러 표시하며 세어요.'+(Object.keys(r.st.lg||{}).length?' 빠뜨린 다리가 없는지 봐요.':'');
 if(UI.fx)return s.look;
 const need=s.rows.find(k=>!rowDone(k)),R0=ROWS[need];
 if(rowReady(need))return R0.t==='note'?'③ 살펴본 것을 쓰고 기록해요.':'③ '+R0.n+(/\?$/.test(R0.n)?' ':': ')+'알맞은 것을 골라 기록해요.';
 const miss=R0.need.find(k=>!r.seen[k]),A=actsOf(s),a=A.find(b=>b.id===miss);
 const cur=A.find(b=>b.hide===false&&!b.pressed);if(cur)return '① '+jo(cur.label.replace(/^\d\/5 · /,''),'을','를')+' 눌러요.';
 if(a&&a.cell)return '① '+a.grp+': '+jo(a.label,'을','를')+' 눌러요.';
 return '① '+jo(lbl(miss)||'단추','을','를')+' 눌러요.'}
function gPart(n,t,st,body){return '<li class="lb-gp lb-'+st+'"'+(st==='wait'?' inert aria-disabled="true"':'')+'><div class="lb-gh"><i>'+(st==='ok'?ic('check'):n)+'</i><b>'+t+'</b></div>'+(body?'<div class="lb-gb">'+body+'</div>':'')+'</li>'}
function actBtns(s){const A=actsOf(s),cells=A.filter(a=>a.cell),rest=A.filter(a=>!a.cell&&!a.hide);let h='';
 const seq=A.filter(a=>a.hide!=null);if(seq.length)h+='<ol class="lb-seq" aria-label="차례">'+seq.map((a,i)=>'<li class="'+(a.pressed?'lb-d':!a.hide?'lb-n':'')+'">'+(a.pressed?ic('check'):'<b>'+(i+1)+'</b>')+'<span>'+esc(a.label.replace(/^\d\/5 · /,''))+'</span></li>').join('')+'</ol>';
 if(rest.length)h+='<div class="lb-acts">'+rest.map(a=>'<button type="button" class="lb-act'+(a.sub?' lb-act2':'')+(UI.attn&&!a.dis&&!a.sub?' lb-attn':'')+'" data-act="x" data-x="'+a.id+'" data-f="x'+a.id+'"'+(a.pressed!=null?' aria-pressed="'+!!a.pressed+'"':'')+(a.dis?' disabled':'')+'>'+ic(a.icon||'hand')+'<span>'+esc(a.label)+'</span></button>').join('')+'</div>';
 const grps=[];cells.forEach(a=>{let g=grps.find(x=>x.n===a.grp);if(!g)grps.push(g={n:a.grp,c:[]});g.c.push(a)});
 grps.forEach(G=>{const n=G.c.length,cols=n>4?3:n;h+='<div class="lb-cellrow" role="group" aria-label="'+esc(G.n)+'"><span class="lb-cl">'+esc(G.n)+'</span><div style="grid-template-columns:repeat('+cols+',1fr)">'+G.c.map(a=>'<button type="button" class="lb-cellb'+(UI.attn&&!a.dis?' lb-attn':'')+(a.seen?' lb-seen':'')+'" data-act="x" data-x="'+a.id+'" data-f="x'+a.id+'" aria-pressed="'+!!a.pressed+'"'+(a.dis?' disabled':'')+' aria-label="'+esc(G.n+' '+a.label)+(a.seen?' (해 봤어요)':'')+'">'+(a.seen?ic('check'):'')+'<span>'+esc(a.label)+'</span></button>').join('')+'</div></div>'});
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
 h+=gPart(1,'해 보기',L?'ok':'cur',L&&!UI.fx?'':actBtns(s));
 h+=gPart(2,'살펴보기',!A?'wait':L?'ok':'cur','<p>'+esc(s.look)+'</p>');
 /* ③은 차례가 오면 열림(아직이면 이름만 — 카드 글자가 줄지 않게) */
 const st3=D?'ok':on3?'cur':'wait';h+=gPart(3,'기록하기',st3,st3==='wait'?'<p class="lb-hint2">해 보기와 살펴보기를 마치면 열려요.</p>':s.rows.filter(k=>rowDone(k)||rowReady(k)).map(rowUI).join('')+(s.rows.some(k=>!rowDone(k)&&!rowReady(k))?'<p class="lb-hint2">남은 것을 해 보면 기록 칸이 더 열려요.</p>':''));
 return cardHead('할 일',stepName(s))+wrapB(h+'</ol>')}
function cWrong(v,r,i){return !!(r.clast&&r.bl[i]&&r.bl[i]===r.clast[i]&&r.bl[i]!==v.ans[i])}
function cChanged(r){return !r.clast||r.bl.some((w,i)=>w!==r.clast[i])}
function frameHTML(v,bl,mode){const r=R();let t=esc(v.frame);
 return t.replace(/\{(\d)\}/g,(m,i)=>{i=+i;const w=bl[i]||'';
  if(mode==='edit'){const st=w?' lb-fill':'';const f=UI.focus===i?' lb-focus':'';const wr=cWrong(v,r,i)?' lb-wrong':'';
   return '<button type="button" class="lb-blank'+st+f+wr+'" data-f="b'+i+'" data-blank="'+i+'" aria-label="빈칸 '+(i+1)+(w?': '+w:': 비어 있음')+(wr?', 다시 생각해 봐요':'')+'">'+(w?esc(w):'&#8203;')+'</button>'}
  return w?'<mark>'+esc(w)+'</mark>':'<span class="lb-sh-gap">______</span>'})}
/* 결론 쓰기: 왼쪽 그림 자리에 내 예상과 내 기록을 크게(카드에 몰아 넣으면 글자가 작아졌음) */
function recLines(k){const r=R(),R0=ROWS[k],x=r.rec[k]||{};if(!x.ok)return '—';
 if(R0.t==='sel')return R0.f.map((f,i)=>'<span>'+(f.l?'<b>'+esc(f.l)+'</b> ':'')+esc(f.o[x.f[i]])+'</span>').join('');
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
 let h='<article class="lb-sheet lb-sh-e'+v.no+'" id="lbSheet" aria-label="실험 결과 한 장"><div class="lb-sh-in"><header class="lb-sh-h"><div><h2>실험 결과 한 장 · '+esc(v.title)+'</h2><span>탐구 실험관 · 3학년 1학기 과학 · 2. 동물의 생활 · '+ds+'</span></div><div class="lb-sh-name">이름 <u>'+(esc(DB.name)||'&nbsp;')+'</u></div></header><div class="lb-sh-grid"><div class="lb-sh-col">';
 h+='<section class="lb-sh-sec"><h3><i></i>실험 문제</h3><p><b>'+esc(v.q)+'</b></p>'+planSummary(v,r)+'</section>';
 h+='<section class="lb-sh-sec lb-sh-po"><h3><i></i>실험한 차례</h3><div class="lb-sh-steps">'+done.map((s,i)=>'<div><b>'+(i+1)+'.</b> '+esc(s.t)+'</div>').join('')+'</div></section>';
 h+='<section class="lb-sh-sec"><h3><i></i>내 예상</h3><p>'+v.pred.map((q,j)=>(v.pred.length>1?esc(q.q)+' ':'')+(r.pred[j]!=null?esc(q.o[r.pred[j]]):'(고르지 않았어요)')).join('<br>')+(r.why?'<br>까닭: '+esc(r.why):'')+'</p></section>';
 h+='</div><div class="lb-sh-col"><section class="lb-sh-sec"><h3><i></i>관찰 기록</h3>'+sheetTable(v,r)+barChart(v,r)+'</section>';
 h+='<section class="lb-sh-sec"><h3><i></i>내 결론</h3><div class="lb-sh-box"><p class="lb-sh-concl">'+frameHTML(v,r.bl,'sheet')+'</p>'+(r.cmp?'<p class="lb-sh-book">교과서 결론: '+esc(v.book)+'</p>':'')+'</div></section>';
 h+='</div></div>'+picsHTML(snapList(v,r))+'<section class="lb-sh-sec lb-sh-po lb-sh-fill"><h3><i></i>새로 알게 된 것 · 더 알고 싶은 것</h3><div class="lb-sh-lines">'+'<div class="lb-ln"></div>'.repeat(9)+'</div></section>';
 h+='<footer class="lb-sh-f"><span>아주 단순하게 만든 모형의 결과예요. 실제 교실에서는 결과가 조금 다를 수 있어요.</span><span>만든 사람: 초등교사 홍지희</span></footer></div></article>';
 return h}
const LABNAME='animal';
function snapsOf(v,r){const L=[],no=v.no,S=(g,vb,cap)=>L.push([svg(g,cap,vb),cap]);const ok=k=>rowDone(k);
 if(no===1){const all={};for(let i=0;i<NLEG;i++)all[i]=1;
  S(deskTop()+dish(EXC.x,EXC.y,236)+exuvia(EXC.x,EXC.y,EXC.s,{marks:ok('legs')?all:{}}),'200 20 560 520','허물 전체 · 센 다리 표시');
  S(deskTop()+exuvia(EXC.x,EXC.y,EXC.s,{hl:ok('fore')?'fore':''}),'250 40 300 220','앞다리');
  S(deskTop()+exuvia(EXC.x,EXC.y,EXC.s,{hl:ok('head')?'head':''}),'360 60 240 170','머리')}
 if(no===2){S(bg({})+(ok('rA')?stirScene('A',false):tankRound({inner:capArt(TB.x0,TB.wl)})+fanArt({})),'60 40 900 440','㈎ 펼친 부챗살');
  S(bg({})+(ok('rB')?stirScene('B',false):tankRound({inner:capArt(TB.x0,TB.wl)})+fanArt({web:1})),'60 40 900 440','㈏ 물갈퀴처럼 만든 부챗살')}
 if(no===3){const keep=UI.fx;UI.fx=null;S(bg({})+iceTank('')+dipBags(226)+(ok('feel')?chillBars(false):''),'130 -10 700 470','얼음물에 담갔을 때 (왼쪽 빈 지퍼 백 · 오른쪽 바셀린이 든 지퍼 백)');UI.fx=keep}
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
 if(!DB.cur||!EXPS[DB.cur]){H.classList.remove('lb-inrun');$('#lbSub').textContent='3학년 1학기 과학 · 2단원 동물의 생활';$('#lbChoose').hidden=true;$('#lbClearMi').hidden=true;
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
function actsOf(s){const r=R(),A=[],busy=!!UI.fx,v=V();
 switch(s.id){
  case 'head':A.push({id:'lh',label:'돋보기로 머리 보기',icon:'eye',dis:busy});break;
  case 'legs':A.push({id:'ll',label:'돋보기로 다리 보기',icon:'eye',dis:busy||!!r.act.legs});if(r.act.legs)A.push({id:'lr',label:'표시 모두 지우기',sub:1,icon:'replay',dis:busy});break;
  case 'fore':A.push({id:'lf',label:'돋보기로 앞다리 보기',icon:'eye',dis:busy,pressed:UI.mq.cur==='f'},{id:'lm',label:'가운데 다리와 견주기',icon:'eye',dis:busy,pressed:UI.mq.cur==='m'});break;
  case 'draw':A.push({id:'ld',label:'허물 전체를 천천히 보기',icon:'eye',dis:busy});break;
  case 'fanA':A.push({id:'sa',label:'펼친 부챗살로 젓기',icon:'hand',dis:busy},{id:'hard',label:'아주 세게 젓기',sub:1,dis:busy});break;
  case 'fanB':A.push({id:'sb',label:'물갈퀴처럼 만든 부챗살로 젓기',icon:'hand',dis:busy},{id:'hard2',label:'아주 세게 젓기',sub:1,dis:busy});break;
  case 'cmp':A.push({id:'sab',label:'두 부챗살로 차례로 젓기',icon:'hand',dis:busy});break;
  case 'dip':A.push({id:'dp',label:'양손을 넣고 얼음물에 담그기',icon:'hand',dis:busy||!!r.seen.dp},{id:'out',label:'바로 손 꺼내기',icon:'hand',dis:busy||!r.seen.dp||!!r.seen.out});
   if(r.seen.dp&&!r.seen.out&&!busy)A.push({id:'long',label:'오래 담가 두기',sub:1});break}
 return A}
/* 아래 막대: 이전 · 진행 · 이어서 */
function footHTML(v,r,s){const N=v.steps.length;
 let h='<button type="button" class="lb-btn" data-act="prev" data-f="prev"'+(r.step===0?' disabled':'')+'>'+ic('left')+'이전</button>';
 h+='<div class="lb-fmid"><span class="lb-pgn">'+(r.step+1)+' / '+N+'</span><span class="lb-prog" aria-hidden="true">'+v.steps.map((x,i)=>'<i class="'+(i<r.step?'lb-d':i===r.step?'lb-n':'')+'"></i>').join('')+'</span></div>';
 let pri='이어서',priOn=canNext(),priAct='next';if(s.k==='sheet'){pri='실험 고르기로';priOn=true;priAct='home'}
 return h+'<button type="button" class="lb-btn lb-pri'+(priOn&&priAct==='next'?' lb-go':'')+'" data-act="'+priAct+'" data-f="pri"'+(priOn?'':' disabled')+'>'+esc(pri)+ic('right')+'</button>'}

/* ───────── 오늘의 실험: 탐구 문제 · 이렇게 해요 · 이것을 살펴봐요 (결과는 보여 주지 않음) ───────── */
function introPic(no,k){const n0=NAR,l0=LEG;NAR=true;LEG=[];let g=bg({}),vb='0 0 960 540';
 if(no===1){g=deskTop()+dish(EXC.x,EXC.y,236);const gh=exuvia(EXC.x,EXC.y,EXC.s,{ghost:1});
  if(k==='dish'){g+=gh+pinch(EXC.x-150,EXC.y-200,1.2,40);vb='180 20 600 520'}
  if(k==='head'){g+=gh+loupe(EXC.x,EXC.y-112,62,0);vb='200 20 560 520'}
  if(k==='legs'){g+=gh+loupe(EXC.x-170,EXC.y-20,58,0)+qmark(EXC.x+170,EXC.y-20);vb='180 20 600 520'}
  if(k==='fore'){g+=gh+loupe(EXC.x-110,EXC.y-150,52,0)+qmark(EXC.x+110,EXC.y-150);vb='180 0 600 500'}}
 if(no===2){if(k==='float'){g+=tankRound({})+capArt(TB.x0,150)+arrow(TB.x0,180,TB.x0,236);vb='60 60 760 380'}
  if(k==='stir'){g+=tankRound({inner:capArt(TB.x0,TB.wl)})+fanArt({})+arrow(250,330,380,330);vb='60 40 760 400'}
  if(k==='tape'){g+='<g transform="translate(110 -10) scale(1.45)">'+fanArt({web:1,nohand:1})+'</g>';vb='120 60 620 420'}
  if(k==='stir2'){g+=tankRound({inner:capArt(TB.x0,TB.wl)})+fanArt({web:1})+arrow(250,330,380,330);vb='60 40 760 400'}}
 if(no===3){if(k==='vas'){g+=zipBag(420,170,{vas:.34})+vasJar(700,410)+spoon(560,200,-25,1);vb='300 120 520 330'}
  if(k==='in'){g+=zipBag(BXE,180,{})+zipBag(BXV,180,{vas:.34})+smallBag(BXE,40)+arrow(BXE+110,60,BXE+110,170);vb='240 0 500 440'}
  if(k==='dip'){g+=iceTank('')+dipBags(110)+arrow(480,150,480,250);vb='150 60 660 410'}
  if(k==='out'){g+=iceTank('')+dipBags(226)+arrow(480,260,480,150);vb='150 60 660 410'}}
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
 if(no===1){g=deskTop()+dish(EXC.x,EXC.y,236)+exuvia(EXC.x,EXC.y,EXC.s,{ghost:1})+loupe(700,140,60,0);vb='200 20 600 520'}
 if(no===2){g+=tankRound({inner:capArt(TB.x0,TB.wl)})+fanArt({});vb='60 50 760 400'}
 if(no===3){g+=iceTank('')+zipBag(BXE,40,{small:1})+zipBag(BXV,40,{small:1,vas:.5});vb='150 20 660 460'}
 const s=svg(g,'실험 '+no+' 처음 모습',vb);NAR=false;LEG=[];return s}
function homeHTML(){const card=k=>{const v=EXPS[k],r=DB.runs[k];const st=r?(r.fin?'끝냄 · 결과 보기':(r.step+1)+'단계부터 이어서'):'실험 시작하기';
 return '<section class="lb-exc" aria-labelledby="lbE'+v.no+'"><div class="lb-exc-art">'+homeArt(v.no)+'</div><div class="lb-exc-b"><h2 id="lbE'+v.no+'"><em>실험 '+v.no+'</em>'+esc(v.name)+'</h2><p class="lb-exp">'+esc(v.sub)+'</p><button type="button" class="lb-pickb" data-pick="'+k+'" data-f="k'+k+'"><i>'+ic(['','bug','fan','bag'][v.no])+'</i><span><b>'+st+'</b><span>교과서 실험</span></span>'+(r&&r.fin?'<small>'+ic('check')+'</small>':'')+'</button></div></section>'};
 return '<div class="lb-home"><div class="lb-home-h"><div class="lb-kick"><em>3학년 1학기 과학</em>2. 동물의 생활</div><h1>무엇을 실험할까요?</h1><p>실험을 한 단계씩 직접 해 보고, 내 눈으로 본 것을 기록해요.</p></div>'+
 '<div class="lb-ex lb-ex3">'+['e1','e2','e3'].map(card).join('')+'</div>'+
 '<p class="lb-model">'+ic('info')+'<span>아주 단순하게 만든 모형이에요. 같은 조건이면 언제나 같은 결과가 나와요. 결과는 교과서·지도서 예시와 같고, 실제로는 조금 다를 수 있어요. 허물 그림의 모양, 수조 속 눈금과 뚜껑이 간 칸 수, \'손에 드는 힘\'·\'차가운 느낌\' 막대는 이 실험관에서 정한 모습이에요. 손에 느끼는 힘과 차가움은 화면에서 느낄 수 없어서 막대로 나타냈어요.</span></p></div>'}
/* ───────── 동작 ───────── */
function fx(id,ms,after){UI.fx={id,n:++UI.nonce};render();later(()=>{UI.fx=null;if(after)after();save();render()},ms)}
function doAnim(id,ms){const r0=R();if(r0&&idxOf('pred')>=0&&r0.step>idxOf('pred'))r0.obs=1;fx(id,ms,()=>{const r=R();if(r)r.done[id]=true;const p=$('#lbFoot [data-act="next"]');if(p&&!p.disabled)p.focus({preventScroll:true})})}
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
 const SUB={hard:SAFE.hard+' 같은 세기로 저어야 견줄 수 있어요.',hard2:SAFE.hard+' ㈎와 같은 세기로 저어요.',long:SAFE.long+' 두 손의 느낌을 견주었으면 바로 꺼내요.'};
 if(SUB[id]){fx(id,1100,()=>flash(SUB[id]));return}
 if(id==='lr'){st.lg={};delete r.seen.lc;save();render();return}
 r.act[s.id]=1;if(idxOf('pred')>=0&&r.step>idxOf('pred'))r.obs=1;
 const done=()=>{r.seen[id]=1};
 if(id==='lh'){fx(id,900,done);return}
 if(id==='ll'){st.lg=st.lg||{};fx(id,700,()=>{});return}
 if(id==='lf'||id==='lm'){UI.mq.cur=id[1];fx(id,900,done);return}
 if(id==='ld'){fx(id,2000,done);return}
 if(id==='sa'||id==='sb'){fx(id,2300,done);return}
 if(id==='sab'){fx(id,2300,done);return}
 if(id==='dp'){fx(id,2600,done);return}
 if(id==='out'){fx(id,900,done);return}}
/* 허물의 다리를 눌러 표시(학생이 세는 것 — 앱은 개수를 말하지 않음) */
function legTap(i){const r=R(),s=curStep();if(!r||s.id!=='legs'||!r.act.legs||UI.fx)return;const st=r.st;st.lg=st.lg||{};
 if(st.lg[i])delete st.lg[i];else st.lg[i]=1;
 if(Object.keys(st.lg).length===NLEG)r.seen.lc=1;else delete r.seen.lc;
 save();render()}
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
document.addEventListener('click',e=>{const lg=e.target.closest&&e.target.closest('[data-leg]');if(lg&&DB.cur){legTap(+lg.dataset.leg);return}
 const t=e.target.closest('button');
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
 if(tg.dataset&&tg.dataset.leg!=null&&(e.key==='Enter'||e.key===' ')){e.preventDefault();legTap(+tg.dataset.leg);return}
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
