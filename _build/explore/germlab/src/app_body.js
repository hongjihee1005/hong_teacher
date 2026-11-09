/* 감염병 실험관에서 더 쓰는 아이콘 */
Object.assign(I,{glove:'<path d="M8 21v-6.5L5.5 10a1.4 1.4 0 012.3-1.6L9 10V4.5a1.3 1.3 0 012.6 0V9V3.5a1.3 1.3 0 012.6 0V9V4.5a1.3 1.3 0 012.6 0V12l.9-1.6a1.3 1.3 0 012.2 1.4L17 17v4"/>'});

/* ───────── 기록(이 기기에만) ───────── */
const KEY='hj-germlab-v1';
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
 if(s.k==='seq')return seqDone(s.id);
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
 }
/* 예상은 예상 단계 뒤의 관찰을 시작하면 잠김(예상 앞의 자유 관찰은 잠그지 않음) */
function predLocked(){const r=R();return !!r.obs}
function planChanged(r){if(!r.planLast)return true;return JSON.stringify(r.plan)!==JSON.stringify(r.planLast)}

/* ───────── 장면 ───────── */
function fxOn(id){return UI.fx&&UI.fx.id===id}
function has(id){const r=R(),k=idxOf(id);if(k<0)return false;return k<r.step||(k===r.step&&(!!r.done[id]||fxOn(id)))}
const sn=id=>!!R().seen[id]||fxOn(id);   /* 해 본 행동(또는 지금 하는 중) */

/* 실험 1 */
function shSoFar(s){const sh=R().st.sh||[];return s&&s.id==='r1'?sh.slice(0,2):sh}
function glowSpot(){return null}
function e1Scene(s){const r=R(),id=s.id,f=UI.fx;
 if(id==='gear'){const on=has('gear');let g=room(false);
  if(!on)return g+gloveBox(480,360)+qmark(480,170);
  return g+gloveBox(690,420)+'<g'+(fxOn('gear')?an('lb-a-up',0,'--from:90px'):'')+'>'+coatPerson(440,180,{mitt1:1})+'</g>'}
 if(id==='r1'||id==='r2'){const sh=shSoFar(s),uvId=id==='r1'?'uv1':'uv2',dark=sn(uvId),cur=f&&/^f\d+$/.test(f.id)?+f.id.slice(1):null;
  const tapOK=dark&&!f&&R().pend[id==='r1'?'g2':'g5']!=null;
  let g=classArt({seq:sh,dark,uv:dark,hl:cur,pairs:cur!=null?pairsOf(cur):null,tap:tapOK?'g':'',marks:UI.mq.marks});
  const done=s.id==='r1'?sh.slice(0,2):sh.slice(2);
  if(!NAR)g+=tag(480,36,done.length?'악수한 친구: '+done.map(n=>n+'번').join(', '):(s.id==='r1'?'악수할 친구 2명을 골라요':'새 친구 3명을 골라요'),19);
  else LEG.push([null,done.length?'악수한 친구: '+done.map(n=>n+'번').join(', '):'악수할 친구를 골라요']);
  if(cur!=null){const [x,y]=SEAT[cur];g+='<g'+an('lb-a-pop',.1)+'>'+shakeArt((SEAT[0][0]+x)/2+36,(SEAT[0][1]+y)/2-30,.55)+'</g>'}
  return g}
 if(id==='off'){let g=room(false)+trash(700,380);const on=has('off');
  if(!on)return g+coatPerson(380,180,{mitt1:1})+qmark(700,250);
  g+=coatPerson(380,180,{});if(fxOn('off'))g+='<g'+an('lb-a-down',.3,'--from:-160px')+'>'+mitt(700,300,1.4,{})+'</g>';return g}
 let g=classArt({});if(s.k==='pred'||s.k==='plan')g+=qmark(480,36);return g}
/* 실험 2 */
function seqIdx(id){const L=SEQ[id]||[],r=R();const i=L.findIndex(a=>!r.seen[a[0]]);return i<0?L.length:i}
function dishSpot(){if(curStep().id!=='obs1'||UI.fx||!R().seen.vb)return null;const S=DS.s;return [DS.b[0],DS.b[1]-8*S,FW*S*.74,2.05,480,190]}
const DS={b:[250,290],a:[710,290],s:1.12};
function filmAt(x,y,s,o){return '<g transform="translate('+x+' '+y+') scale('+s+') translate('+(-x)+' '+(-y)+')">'+film(x,y,o)+'</g>'}
function prepScene(s){const r=R(),f=UI.fx,pre=s.id==='before'?['k1','r1','s1','d1','p1','n1']:['k2','r2','s2','d2','p2','n2'],sn2=k=>!!r.seen[k];
 const lbl=s.id==='before'?'씻기 전':'씻은 뒤',cur=f&&pre.indexOf(f.id)>=0?pre.indexOf(f.id):-1;let g=bg({});
 if(s.id==='after'&&!NAR)g+='<g transform="translate(870 250) scale(.5)">'+film(0,0,{wet:1,label:'씻기 전'})+'</g>';
 const dropped=sn2(pre[3])||cur===3,pressed=sn2(pre[4])||cur===4,named=sn2(pre[5])||cur===5;
 g+=filmAt(640,290,1,{wet:dropped,label:named?lbl:''});
 if(cur===4)g+='<g'+an('lb-a-down',0,'--from:-150px')+'>'+pressPad(640,250)+'</g>';
 const out=sn2(pre[0])||cur===0,inK=sn2(pre[2])||cur===2;
 if(cur===3){g+='<g transform="translate(560 120) rotate(-120)">'+kit(0,0,{drip:1})+'</g>';for(let i=0;i<3;i++)g+='<path d="M'+(626+i*4)+' 186 q-5 9 0 13 q5 -4 0 -13z" fill="#7CC3EC"'+an('lb-a-drip',.35*i)+'/>';g+=tag(640,60,(UI.mq.cnt||0)+'방울',22)}
 else{const kg=kit(400,300,{out:out&&!inK});g+=cur===2?'<g'+an('lb-a-shake',0)+'>'+kg+'</g>':kg}
 if(out&&!inK){g+=palm(250,340,1.7);g+=cur===1?'<g'+an('lb-a-rub',0)+'>'+swab(330,250,40)+'</g>':swab(cur===0?400:330,cur===0?150:250,cur===0?0:40)}
 else g+=palm(220,360,1.3);
 if(!out&&cur<0)g+=qmark(400,140);
 return g}
function e2Scene(s){const r=R(),id=s.id,f=UI.fx;
 if(id==='gear'||id==='gear2'){const on=has(id);let g=bg({});const o=id==='gear'?{goggle:on,mask:on}:{goggle:on,mask:on,gl2:on};
  g+='<g'+(fxOn(id)?an('lb-a-pop',0):'')+'>'+coatPerson(480,190,o)+'</g>';if(!on)g+=qmark(720,140);return g}
 if(id==='before'||id==='after')return prepScene(s);
 if(id==='wash'){const i=seqIdx('wash'),cur=f&&/^h\d$/.test(f.id)?+f.id.slice(1):-1,show=cur>=0?cur:Math.min(i,6)-1;let g=bg({})+soap(820,400,1);
  g+=washArt(show,480,250,cur>=0);
  const sec=WASH.reduce((a,w,k)=>a+(r.seen['h'+k]?5:0),0)+(cur>=0?5:0);
  g+=tag(480,44,show>=0?(show+1)+'단계 '+WASH[show][0]:'비누 거품을 내요',22);g+=tag(820,320,'씻은 시간 '+sec+'초',19);return g}
 if(id==='wait'){const on=!!r.seen.w0||fxOn('w0'),d=['w1','w2','w3'].filter(k=>r.seen[k]||fxOn(k)).length;let g=bg({})+shelf()+sunBox(300,140)+(NAR?'':'<text x="300" y="230" text-anchor="middle" font-size="20" font-weight="800" fill="var(--w-labeltx)">따뜻한 곳</text>');
  if(on)g+='<g'+(fxOn('w0')?an('lb-a-up',0,'--from:100px'):'')+'>'+filmSide(380,330,'씻기 전')+filmSide(600,330,'씻은 뒤')+'</g>';
  else g+=filmSide(380,430,'씻기 전')+filmSide(600,430,'씻은 뒤')+arrow(490,410,490,350);
  g+='<g'+(f&&/^w[123]$/.test(f.id)?an('lb-a-pop',0):'')+'>'+calendar(700,150,d)+'</g>';return g}
 if(id==='obs1'||id==='obs2'){let g=bg({});const sb=!!r.seen.vb||fxOn('vb'),sa=!!r.seen.va||fxOn('va'),tp=!f;
  g+=filmAt(DS.b[0],DS.b[1],DS.s,{wet:1,label:'씻기 전',dots:sb?DOTS.b:null,cell:sb,cover:!sb,tap:sb&&tp?'b':'',marks:UI.mq.mb});
  g+=filmAt(DS.a[0],DS.a[1],DS.s,{wet:1,label:'씻은 뒤',dots:sa?DOTS.a:null,cover:!sa,tap:sa&&tp?'a':'',marks:UI.mq.ma});
  if(!sb)g+=qmark(DS.b[0],DS.b[1]-10);if(!sa)g+=qmark(DS.a[0],DS.a[1]-10);
  const c=id==='obs1'?'vb':'va';if(r.seen[c]||fxOn(c)){const [x,y]=c==='vb'?DS.b:DS.a;g+='<rect x="'+(x-124)+'" y="'+(y-142)+'" width="248" height="282" rx="14" fill="none" stroke="var(--lb-lens)" stroke-width="4" stroke-dasharray="10 7"/>'}
  return g}
 let g=bg({})+filmAt(330,290,1,{})+filmAt(630,290,1,{})+kit(820,320,{})+soap(140,400,.9);if(s.k==='pred')g+=qmark(480,90);return g}
function itemArtAt(k,x,y){return '<g transform="translate('+x+' '+y+') scale(1.4)">'+itemArt(k)+'</g>'}
function sceneSVG(){const v=V(),r=R(),s=curStep(),id=s.id,no=v.no;
 const T=(g,l,vb)=>svg(g+lensOf(s,g),l||s.t,vb);
 if(id==='tools'){if(!(r.done.tools||fxOn('tools')))return T(bg({})+boxArt(480),'준비물 상자');return T(bg({})+toolsScene(v.tools,fxOn('tools')),'준비물: '+v.tools.map(x=>x[1]).join(', '))}
 if(no===1)return T(e1Scene(s),s.t,id==='gear'||id==='off'?'120 20 720 470':NAR?'80 60 830 450':'60 0 860 510');
 if(no===2)return T(e2Scene(s),s.t,id==='gear'||id==='gear2'?'200 60 560 330':id==='obs1'||id==='obs2'?'60 70 840 400':id==='wait'?'160 40 680 430':'40 30 880 460');
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
 if(R0.t==='num')return x.v+(R0.u?R0.u:'');
 return ''}
function rowReady(row){const r=R(),R0=ROWS[row],x=r.rec[row]||{};if(x.ok)return true;
 if(R0.t==='num')return r.pend[row]!=null;
 return R0.need.every(k=>r.seen[k])}
function numOpen(row){const r=R();return r.pend[row]!=null&&!UI.fx}
function rowUI(row){const r=R(),R0=ROWS[row],x=r.rec[row]||{},done=!!x.ok,wr=UI.wrong[row]||[];
 if(done){let h='<div class="lb-mrow lb-mdone"><div class="lb-mrh"><b>'+esc(R0.n)+'</b><span class="lb-okt">'+ic('check')+'기록했어요</span></div><p class="lb-recsum">'+esc(rowSum(row))+'</p>';
  if(UI.fb[row])h+='<div class="lb-msg lb-good" role="status">'+ic('check')+'<span>'+UI.fb[row][1]+'</span></div>';
  return h+'</div>'}
 let h='<div class="lb-mrow"><div class="lb-mrh"><b>'+esc(R0.n)+'</b></div>';
 const D=UI.draft[row]=UI.draft[row]||{};const ok=rowReady(row);
 const recB=on=>'<button type="button" class="lb-rec-btn" data-act="rowrec" data-row="'+row+'" data-f="rr'+row+'"'+(on?'':' disabled')+'>'+ic('check')+'기록하기</button>';
 if(R0.t==='sel'){D.f=D.f||[];
  R0.f.forEach((f,j)=>{h+='<div class="lb-cells lb-c1"><span class="lb-cl">'+esc(f.l)+'</span><span class="lb-seg lb-kseg'+(wr.indexOf(j)>=0?' lb-wrongc':'')+'" role="group" aria-label="'+esc(R0.n+' '+f.l)+'">'+f.o.map((o,i)=>'<button type="button" class="lb-s" data-f="'+row+j+'-'+i+'" data-dr="'+row+':'+j+':'+i+'" aria-pressed="'+(D.f[j]===i)+'"'+(ok?'':' disabled')+'>'+esc(o)+'</button>').join('')+'</span></div>'});
  h+=recB(ok&&R0.f.every((f,j)=>D.f[j]!=null))}
 if(R0.t==='num'){const op=numOpen(row);
  h+='<div class="lb-trials"><label class="lb-trial'+(op?' lb-tcur':'')+'"><span>내가 센 수</span><input class="lb-num lb-numw" inputmode="numeric" maxlength="3" autocomplete="off" data-f="in'+row+'" data-in="'+row+'" aria-label="'+esc(R0.n)+' 수" value="'+esc(UI.inp[row]||'')+'"'+(op?'':' disabled')+'><span>'+esc(R0.u)+'</span></label><button type="button" class="lb-mini" data-act="trial" data-row="'+row+'" data-f="tr'+row+'"'+(op?'':' disabled')+'>'+ic('check')+'적기</button></div>'}
 if(UI.fb[row])h+='<div class="lb-msg '+(UI.fb[row][0]?'lb-good':'lb-try')+'" role="status">'+ic(UI.fb[row][0]?'check':'info')+'<span>'+UI.fb[row][1]+'</span></div>';
 return h+'</div>'}
/* ───────── 할 일 카드: ① 해 보기 → ② 살펴보기 → ③ 기록하기 ───────── */
function seqDone(id){return (SEQ[id]||[]).every(a=>R().seen[a[0]])}
function acted(s){const r=R();return !!(r.act&&r.act[s.id])||(s.k==='scene'&&!!r.done[s.id])}
function looked(s){if(s.k==='scene')return !!R().done[s.id];if(s.k==='seq')return seqDone(s.id);if(s.k==='meas')return s.rows.every(rowReady);return true}
function lbl(a){const x=actsOf(curStep()).find(b=>b.id===a);return x?x.label:''}
const LBLX=/^\d+\/\d+ · /;
function hintOf(s){const r=R(),id=s.id,D=isDone(r.step);
 if(s.k==='scene'){if(UI.fx)return s.look;if(r.done[id])return '잘했어요. 이어서 가요.';return '① '+jo(s.act,'을','를')+' 눌러요.'}
 if(D)return '다 했어요. 이어서 가요.';
 if(UI.fx)return s.look;
 if(s.k==='seq'){const L=SEQ[id],i=seqIdx(id);return '① '+(i+1)+'번째: '+jo(L[i][1],'을','를')+' 눌러요.'}
 const need=s.rows.find(k=>!rowDone(k)),R0=ROWS[need];
 if(rowReady(need))return R0.t==='num'?'③ 내가 센 수를 \''+R0.n+'\' 칸에 써요.':'③ '+R0.f[0].l+': 알맞은 것을 골라 기록해요.';
 if(id==='r1'||id==='r2'){const sh=R().st.sh||[],lim=id==='r1'?2:5,got=id==='r1'?sh.length:sh.length-2;
  if(sh.length<lim)return '① 악수할 친구를 골라요. ('+Math.max(0,got)+'/'+(id==='r1'?2:3)+'명)';return '① 불 끄고 자외선 손전등 비추기를 눌러요.'}
 const miss=R0.need.find(k=>!r.seen[k]),A=actsOf(s),a=A.find(b=>b.id===miss);
 if(a&&a.cell)return '① '+a.grp+': '+jo(a.label,'을','를')+' 눌러요.';
 return '① '+jo(lbl(miss)||'단추','을','를')+' 눌러요.'}
function gPart(n,t,st,body){return '<li class="lb-gp lb-'+st+'"'+(st==='wait'?' inert aria-disabled="true"':'')+'><div class="lb-gh"><i>'+(st==='ok'?ic('check'):n)+'</i><b>'+t+'</b></div>'+(body?'<div class="lb-gb">'+body+'</div>':'')+'</li>'}
function actBtns(s){const A=actsOf(s),cells=A.filter(a=>a.cell),rest=A.filter(a=>!a.cell&&!a.hide);let h='';
 const seq=A.filter(a=>a.hide!=null);if(seq.length)h+='<ol class="lb-seq" aria-label="차례">'+seq.map((a,i)=>'<li class="'+(a.pressed?'lb-d':!a.hide?'lb-n':'')+'">'+(a.pressed?ic('check'):'<b>'+(i+1)+'</b>')+'<span>'+esc(a.label.replace(LBLX,''))+'</span></li>').join('')+'</ol>';
 const grps=[];cells.forEach(a=>{let g=grps.find(x=>x.n===a.grp);if(!g)grps.push(g={n:a.grp,c:[]});g.c.push(a)});
 grps.forEach(G=>{const n=G.c.length,cols=G.c[0].cols||(n>4?3:n);h+='<div class="lb-cellrow" role="group" aria-label="'+esc(G.n)+'"><span class="lb-cl">'+esc(G.n)+'</span><div style="grid-template-columns:repeat('+cols+',1fr)">'+G.c.map(a=>'<button type="button" class="lb-cellb'+(UI.attn&&!a.dis?' lb-attn':'')+(a.seen?' lb-seen':'')+'" data-act="x" data-x="'+a.id+'" data-f="x'+a.id+'" aria-pressed="'+!!a.pressed+'"'+(a.dis?' disabled':'')+' aria-label="'+esc(G.n+' '+a.label)+(a.seen?' (했어요)':'')+'">'+(a.seen?ic('check'):'')+'<span>'+esc(a.label)+'</span></button>').join('')+'</div></div>'});
 if(rest.length)h+='<div class="lb-acts">'+rest.map(a=>'<button type="button" class="lb-act'+(a.sub?' lb-act2':'')+(UI.attn&&!a.dis&&!a.sub?' lb-attn':'')+'" data-act="x" data-x="'+a.id+'" data-f="x'+a.id+'"'+(a.dis?' disabled':'')+'>'+ic(a.icon||'hand')+'<span>'+esc(a.label.replace(LBLX,''))+'</span></button>').join('')+'</div>';
 return h}
function taskCard(s){const r=R(),A=acted(s),L=looked(s),D=isDone(r.step);
 let h='<p class="lb-stat'+(D?' lb-statok':'')+'" role="status">'+ic(D?'check':'info')+'<span>'+esc(hintOf(s))+'</span></p><ol class="lb-guide">';
 if(s.k==='scene'){let b1;const dn=!!r.done[s.id];
  if(!dn||fxOn(s.id))b1='<div class="lb-acts"><button type="button" class="lb-act" data-act="doit" data-f="doit"'+(UI.fx?' disabled':'')+'>'+ic('hand')+'<span>'+esc(s.act)+'</span></button></div>';
  else b1='<div class="lb-acts"><button type="button" class="lb-act lb-act3" data-act="replay" data-f="replay">'+ic('replay')+'<span>처음부터 보기</span></button></div>';
  h+=gPart(1,'해 보기',dn?'ok':'cur',b1)+gPart(2,'살펴보기',dn?'ok':UI.fx?'cur':'wait','<p>'+esc(s.look)+'</p>');
  return cardHead('할 일',stepName(s))+wrapB(h+'</ol>')}
 if(s.k==='seq'){h+=gPart(1,'해 보기',L&&!UI.fx?'ok':'cur',L&&!UI.fx?'':actBtns(s))+gPart(2,'살펴보기',!A?'wait':L?'ok':'cur','<p>'+esc(s.look)+'</p>');
  return cardHead('할 일',stepName(s))+wrapB(h+'</ol>')}
 const on3=s.rows.some(rowReady);
 /* ①을 모두 해 보면 단추를 접음(본 결과는 그림에 그대로 남음) — 기록 칸이 넓어져 카드 글자가 줄지 않게 */
 h+=gPart(1,'해 보기',L?'ok':'cur',L&&!UI.fx?'':actBtns(s));
 h+=gPart(2,'살펴보기',!A?'wait':L?'ok':'cur','<p>'+esc(s.look)+'</p>');
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
 if(R0.t==='num')return '<span>'+esc(x.v+R0.u)+'</span>';
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
function barChart(v,r){/* 실험 2의 두 수는 센 범위가 달라(한 칸 / 배지 전체) 막대로 견주지 않음 */if(v.no!==1)return '';let rows=v.rows.filter(k=>ROWS[k].t==='num');if(!rows.length)return '';
 const valOf=k=>{const x=k&&r.rec[k];return x&&x.ok?x.v:null},vals=rows.map(valOf);const mx=Math.max(1,...vals.filter(x=>x!=null))*1.15;
 const n=rows.length,W=340,H=150,bw=Math.min(64,(W-20)/n-18),gap=(W-n*bw)/(n+1);let g='<svg class="lb-chart" viewBox="0 0 '+W+' '+(H+44)+'" role="img" aria-label="기록한 숫자 막대그래프">';
 rows.forEach((k,i)=>{const x=gap+i*(bw+gap);if(!k){g+='<path d="M'+(x+bw/2)+' 8 V'+(H+30)+'" stroke="#9E968A" stroke-dasharray="4 4"/>';return}
  const v0=vals[i],hh=v0==null?0:v0/mx*H,nm=ROWS[k].n.replace(/\(.*\)/,'').replace(' 이용할 때','').replace(' 들어 올릴 때','');const c=i%2?'#A9541A':'#2F68B0';
  g+='<rect x="'+x+'" y="'+(H-hh)+'" width="'+bw+'" height="'+hh+'" fill="'+c+'"/>'+(v0!=null?'<text x="'+(x+bw/2)+'" y="'+(H-hh-5)+'" text-anchor="middle" font-size="16" font-weight="700" fill="#141A26">'+v0+'</text>':'')+
  '<text x="'+(x+bw/2)+'" y="'+(H+20)+'" text-anchor="middle" font-size="'+(nm.length>5?12.5:15)+'" fill="#141A26">'+esc(nm)+'</text>'});
 return g+'<path d="M0 '+H+' H'+W+'" stroke="#9E968A"/></svg>'}
function sheetTable(v,r){let h='<table class="lb-tbl"><caption class="lb-sr">관찰 기록</caption><thead><tr><th scope="col">무엇을</th><th scope="col">내 기록</th></tr></thead><tbody>';
 v.rows.forEach(k=>{h+='<tr><th scope="row">'+esc(ROWS[k].n)+'</th><td>'+(rowDone(k)?esc(rowSum(k)):'—')+'</td></tr>'});
 return h+'</tbody></table>'}
function planSummary(v,r){const P=v.plan;if(!P)return '';if(!r.planOk)return '<p>(계획을 건너뛰었어요)</p>';
 return '<div class="lb-sh-tags">'+P.rows.map(x=>{const d=r.plan[x[0]]==='d';return '<span class="lb-sh-tag'+(d?' lb-d':'')+'">'+(d?'다르게: ':'같게: ')+esc(x[1])+'</span>'}).join('')+'</div>'}
function sheetHTML(){const v=V(),r=R();const done=v.steps.map(id=>stepDef(v,id)).filter(s=>(s.k==='scene'||s.k==='meas'||s.k==='seq')&&s.id!=='tools');
 const today=new Date();const ds=today.getFullYear()+'. '+(today.getMonth()+1)+'. '+today.getDate()+'.';
 let h='<article class="lb-sheet lb-sh-e'+v.no+'" id="lbSheet" aria-label="실험 결과 한 장"><div class="lb-sh-in"><header class="lb-sh-h"><div><h2>실험 결과 한 장 · '+esc(v.title)+'</h2><span>탐구 실험관 · 3학년 2학기 과학 · 4. 감염병과 건강한 생활 · '+ds+'</span></div><div class="lb-sh-name">이름 <u>'+(esc(DB.name)||'&nbsp;')+'</u></div></header><div class="lb-sh-grid"><div class="lb-sh-col">';
 h+='<section class="lb-sh-sec"><h3><i></i>실험 문제</h3><p><b>'+esc(v.q)+'</b></p>'+planSummary(v,r)+'</section>';
 h+='<section class="lb-sh-sec lb-sh-po"><h3><i></i>실험한 차례</h3><div class="lb-sh-steps">'+done.map((s,i)=>'<div><b>'+(i+1)+'.</b> '+esc(s.t)+'</div>').join('')+'</div></section>';
 h+='<section class="lb-sh-sec"><h3><i></i>내 예상</h3><p>'+v.pred.map((q,j)=>(v.pred.length>1?esc(q.q)+' ':'')+(r.pred[j]!=null?esc(q.o[r.pred[j]]):'(고르지 않았어요)')).join('<br>')+(r.why?'<br>까닭: '+esc(r.why):'')+'</p></section>';
 h+='</div><div class="lb-sh-col"><section class="lb-sh-sec"><h3><i></i>관찰 기록</h3>'+sheetTable(v,r)+barChart(v,r)+'</section>';
 h+='<section class="lb-sh-sec"><h3><i></i>내 결론</h3><div class="lb-sh-box"><p class="lb-sh-concl">'+frameHTML(v,r.bl,'sheet')+'</p>'+(r.cmp?'<p class="lb-sh-book">교과서 결론: '+esc(v.book)+'</p>':'')+'</div></section>';
 h+='</div></div>'+picsHTML(snapList(v,r))+'<section class="lb-sh-sec lb-sh-po lb-sh-fill"><h3><i></i>새로 알게 된 것 · 더 알고 싶은 것</h3><div class="lb-sh-lines">'+'<div class="lb-ln"></div>'.repeat(9)+'</div></section>';
 h+='<footer class="lb-sh-f"><span>아주 단순하게 만든 모형의 결과예요. 실제 교실에서는 결과가 조금 다를 수 있어요.</span><span>만든 사람: 초등교사 홍지희</span></footer></div></article>';
 return h}
const LABNAME='germlab';
function snapsOf(v,r){const L=[],no=v.no,S=(g,vb,cap)=>L.push([svg(g,cap,vb),cap]);const ok=k=>rowDone(k);const sh=r.st.sh||[];
 if(no===1){if(ok('g2'))S(classArt({seq:sh.slice(0,2),dark:true,uv:true}),'60 60 860 450','2명과 악수한 뒤');
  if(ok('g5'))S(classArt({seq:sh.slice(0,5),dark:true,uv:true}),'60 60 860 450','5명과 악수한 뒤')}
 if(no===2){if(ok('nb'))S(bg({})+film(480,270,{wet:1,label:'씻기 전',dots:DOTS.b,cell:1}),'360 140 240 260','손 씻기 전 배지');
  if(ok('na'))S(bg({})+film(480,270,{wet:1,label:'씻은 뒤',dots:DOTS.a}),'360 140 240 260','손 씻은 뒤 배지')}
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
 if(!DB.cur||!EXPS[DB.cur]){H.classList.remove('lb-inrun');$('#lbSub').textContent='3학년 2학기 과학 · 4단원 감염병과 건강한 생활';$('#lbChoose').hidden=true;$('#lbClearMi').hidden=true;
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
  const card=$('#lbCard');const ch=s.k==='plan'?planCard():s.k==='pred'?predCard():(s.k==='meas'||s.k==='scene'||s.k==='seq'||s.k==='more')?taskCard(s):s.k==='concl'?conclCard():'';card.hidden=!ch;set(card,ch)}
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
function actsOf(s){const r=R(),A=[],busy=!!UI.fx,st=r.st||{};
 if(s.id==='r1'||s.id==='r2'){const sh=st.sh||[],lim=s.id==='r1'?2:5,uv=s.id==='r1'?'uv1':'uv2',dk=!!r.seen[uv];
  for(let n=1;n<CLS;n++)A.push({id:'f'+n,label:n+'번',cell:1,cols:5,grp:s.id==='r1'?'악수할 친구 2명 고르기':'새 친구 3명 고르기',pressed:busy&&fxOn('f'+n),seen:sh.indexOf(n)>=0,dis:busy||dk||sh.length>=lim});
  A.push({id:uv,label:'불 끄고 자외선 손전등 비추기',icon:'eye',dis:busy||dk||sh.length<lim})}
 else if(SEQ[s.id]){const L=SEQ[s.id],c=seqIdx(s.id),n=L.length;
  L.forEach((a,i)=>A.push({id:a[0],label:(i+1)+'/'+n+' · '+a[1],dis:busy||i!==c,pressed:i<c,hide:i!==Math.min(c,n-1)}));
  const SUBL={before:['tch','배지 안쪽을 손가락으로 만져 보기'],wash:['quick','물로만 빨리 헹구기'],after:['old','앞에서 쓴 키트 다시 쓰기'],wait:['peek','하루 지나서 덮개 열어 보기']}[s.id];
  if(SUBL&&c<n)A.push({id:SUBL[0],label:SUBL[1],sub:1,dis:busy})}
 else if(s.id==='obs1')A.push({id:'vb',label:'씻기 전 배지 들여다보기',icon:'eye',dis:busy||!!r.seen.vb});
 else if(s.id==='obs2')A.push({id:'va',label:'씻은 뒤 배지 들여다보기',icon:'eye',dis:busy||!!r.seen.va});
 return A}
/* 아래 막대: 이전 · 진행 · 이어서 */
function footHTML(v,r,s){const N=v.steps.length;
 let h='<button type="button" class="lb-btn" data-act="prev" data-f="prev"'+(r.step===0?' disabled':'')+'>'+ic('left')+'이전</button>';
 h+='<div class="lb-fmid"><span class="lb-pgn">'+(r.step+1)+' / '+N+'</span><span class="lb-prog" aria-hidden="true">'+v.steps.map((x,i)=>'<i class="'+(i<r.step?'lb-d':i===r.step?'lb-n':'')+'"></i>').join('')+'</span></div>';
 let pri='이어서',priOn=canNext(),priAct='next';if(s.k==='sheet'){pri='실험 고르기로';priOn=true;priAct='home'}
 return h+'<button type="button" class="lb-btn lb-pri'+(priOn&&priAct==='next'?' lb-go':'')+'" data-act="'+priAct+'" data-f="pri"'+(priOn?'':' disabled')+'>'+esc(pri)+ic('right')+'</button>'}

/* ───────── 오늘의 실험: 탐구 문제 · 이렇게 해요 · 이것을 살펴봐요 (결과는 보여 주지 않음) ───────── */
function introPic(no,k){const n0=NAR,l0=LEG;NAR=true;LEG=[];let g='',vb='0 0 960 540';
 if(no===1){if(k==='gear'){g+=room(false)+gloveBox(480,330)+hand(600,220,150,1.3);vb='300 150 380 260'}
  if(k==='shake'){g+=room(false)+shakeArt(480,270,1.6);vb='320 190 320 160'}
  if(k==='uv'){g+=room(true)+mitt(480,300,2.4,{dark:true})+uvLamp(480,524)+qmark(600,240,'#E8ECF2');vb='340 160 300 380'}
  if(k==='more'){g+=room(false)+shakeArt(420,270,1.3)+mini(620,270,'+ 3명',30);vb='300 190 400 160'}}
 if(no===2){g+=bg({});if(k==='swab'){g+=palm(400,340,1.8)+swab(500,190,40);vb='280 160 360 280'}
  if(k==='drop'){g+=film(560,300,{})+'<g transform="translate(470 130) rotate(-120)">'+kit(0,0,{drip:1})+'</g>'+'<path d="M556 176 q-6 11 0 16 q6 -5 0 -16z" fill="#7CC3EC"/>';vb='380 40 330 400'}
  if(k==='wash'){g+=washArt(0,480,260,false)+soap(640,380,1);vb='330 140 360 290'}
  if(k==='warm'){g+=shelf()+sunBox(300,140)+filmSide(380,330,'')+filmSide(600,330,'')+calendar(700,150,3);vb='220 60 580 320'}}
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
function homeArt(no){NAR=true;LEG=[];let g='',vb='120 70 720 420';
 if(no===1){g+=classArt({});vb='80 40 840 470'}
 if(no===2){g+=bg({})+filmAt(330,290,1,{})+filmAt(630,290,1,{})+kit(820,320,{})+soap(140,400,.9);vb='60 140 840 340'}
 const s=svg(g,'실험 '+no+' 처음 모습',vb);NAR=false;LEG=[];return s}
function homeHTML(){const card=k=>{const v=EXPS[k],r=DB.runs[k];const st=r?(r.fin?'끝냄 · 결과 보기':(r.step+1)+'단계부터 이어서'):'실험 시작하기';
 return '<section class="lb-exc" aria-labelledby="lbE'+v.no+'"><div class="lb-exc-art">'+homeArt(v.no)+'</div><div class="lb-exc-b"><h2 id="lbE'+v.no+'"><em>실험 '+v.no+'</em>'+esc(v.name)+'</h2><p class="lb-exp">'+esc(v.sub)+'</p><button type="button" class="lb-pickb" data-pick="'+k+'" data-f="k'+k+'"><i>'+ic(['','glove','drop'][v.no])+'</i><span><b>'+st+'</b><span>교과서 실험</span></span>'+(r&&r.fin?'<small>'+ic('check')+'</small>':'')+'</button></div></section>'};
 return '<div class="lb-home"><div class="lb-home-h"><div class="lb-kick"><em>3학년 2학기 과학</em>4. 감염병과 건강한 생활</div><h1>무엇을 실험할까요?</h1><p>실험을 한 단계씩 직접 해 보고, 내 눈으로 본 것을 세고 기록해요.</p></div>'+
 '<div class="lb-ex">'+['e1','e2'].map(card).join('')+'</div>'+
 '<p class="lb-model">'+ic('info')+'<span>아주 단순하게 만든 모형이에요. 같은 조건이면 언제나 같은 결과가 나와요. 형광 로션은 병원체가 아니라, 눈에 보이지 않는 병원체를 대신 나타낸 것이에요. 이 실험관에서 정한 것: 우리 반 20명, 다른 친구들이 악수하는 짝, 악수하면 상대 장갑 로션의 반만큼이 묻고 아주 조금 묻으면 빛이 보이지 않는다는 규칙, 배지의 빨간 점 수. 실제 교실에서는 결과가 다를 수 있어요.</span></p></div>'}
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
function doX(id){const v=V(),r=R(),s=curStep(),st=r.st;if(UI.fx)return;
 const SUB={tch:'배지와 키트 안쪽을 만지면 다른 것이 묻어요. 손으로 만지지 않아요.',quick:'물로만 빨리 헹구면 병원체가 손에 남을 수 있어요. 비누로 30초 이상, 6단계에 따라 씻어요.',
  old:'씻은 뒤에는 새 배지와 새 키트를 써요. 앞의 것을 다시 쓰면 섞여요.',peek:'3일 동안 배지를 만지거나 열지 않아요. 열면 다른 것이 들어갈 수 있어요.'};
 if(SUB[id]){fx(id,900,()=>flash(SUB[id]));return}
 if(/^f\d+$/.test(id)){const n=+id.slice(1),sh=st.sh=st.sh||[],lim=s.id==='r1'?2:5;
  if(sh.indexOf(n)>=0){flash('같은 친구와 두 번 악수하지 않아요. 새 친구를 골라요.');return}
  if(sh.length>=lim)return;
  r.act[s.id]=1;if(idxOf('pred')>=0&&r.step>idxOf('pred'))r.obs=1;
  UI.mq={};fx(id,1700,()=>{sh.push(n);r.seen[id]=1});return}
 r.act[s.id]=1;if(idxOf('pred')>=0&&r.step>idxOf('pred'))r.obs=1;
 if(id==='uv1'||id==='uv2'){const row=id==='uv1'?'g2':'g5';UI.mq={marks:{}};fx(id,1200,()=>{r.seen[id]=1;r.pend[row]=1;const n=$('[data-in="'+row+'"]:not([disabled])');if(n)n.focus({preventScroll:true})});return}
 if(SEQ[s.id]){const L=SEQ[s.id],c=seqIdx(s.id);if(!L[c]||L[c][0]!==id)return;
  if(/^d[12]$/.test(id)){UI.mq.cnt=0;for(let i=1;i<=15;i++)later(()=>{UI.mq.cnt=i;renderScene()},i*110)}
  fx(id,/^d/.test(id)?1900:/^h/.test(id)?1300:/^w/.test(id)?900:1100,()=>{r.seen[id]=1});return}
 if(id==='vb'||id==='va'){UI.mq.cur=id;fx(id,700,()=>{r.seen[id]=1;const row=id==='vb'?'nb':'na';if(!rowDone(row))r.pend[row]=1});return}}
/* 내가 센 수 적기: 화면과 같은지만 알려 줌. 같은 값으로 다시 누르면 세지 않음 */
function tryKey(k,val){const r=R();if(r.last[k]===val)return -1;r.last[k]=val;r.tries[k]=(r.tries[k]||0)+1;return r.tries[k]}
function tapMark(key){const [k,i]=key.split(':'),f=k==='g'?'marks':k==='b'?'mb':'ma';UI.mq[f]=UI.mq[f]||{};UI.mq[f][i]=!UI.mq[f][i];renderScene()}
function trial(row){const r=R(),R0=ROWS[row];if(!numOpen(row))return;const txt=String(UI.inp[row]||'').trim();
 if(!txt||!/^\d+$/.test(txt)){UI.fb[row]=[0,'숫자로 써요.'];render();return}
 const want=R0.v();
 if(+txt===want){r.rec[row]={ok:1,v:want};delete r.pend[row];UI.inp[row]='';UI.attn=false;UI.fb={};UI.fb[row]=[1,'하나씩 잘 세었어요.'];save();render();const p=$('#lbFoot [data-act="next"]:not(:disabled)');if(p&&isDone(r.step))p.focus({preventScroll:true});return}
 const t=tryKey(row+':t',txt);
 if(t===-1){UI.fb[row]=[0,'숫자가 그대로예요. 그림을 다시 세어 봐요.'];render();return}
 const tip=row==='g2'||row==='g5'?'빛나는 장갑을 하나씩 눌러 표시하며 다시 세어 봐요. 내 장갑도 세어요.':row==='nb'?'점선 네모 칸 안의 빨간 점만 세어요. 하나씩 눌러 표시하며 세어 봐요.':'씻은 뒤 배지의 빨간 점을 모두 세어요. 하나씩 눌러 표시해 봐요.';
 UI.fb[row]=[0,(t>=2?'다시 천천히 세어 봐요. ':'')+tip];save();render()}
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
 const tp=!t&&e.target.closest&&e.target.closest('[data-tap]');if(tp&&DB.cur){tapMark(tp.dataset.tap);return}
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
 if(t.dataset&&t.dataset.in!=null){UI.inp[t.dataset.in]=t.value.replace(/[^\d]/g,'');if(t.value!==UI.inp[t.dataset.in])t.value=UI.inp[t.dataset.in]}
 if(t.id==='lbName'){DB.name=t.value;save();const u=$('#lbSheet .lb-sh-name u');if(u)u.textContent=DB.name||' '}});
let rzT=0,wasN=narrow();addEventListener('resize',()=>{clearTimeout(rzT);rzT=setTimeout(()=>{const n=narrow();if(n!==wasN){wasN=n;const s=$('#lbScene');if(s)s._h=null}if(DB.cur)render();else fitAll()},150)});
if(DB.cur&&EXPS[DB.cur]){if(!DB.runs[DB.cur])DB.runs[DB.cur]=newRun();enterStep()}
render();

addEventListener('beforeprint',()=>{const s=$('#lbSheet .lb-sh-in');if(s)s.style.zoom=''});addEventListener('afterprint',()=>{try{fitAll()}catch(e){}});
