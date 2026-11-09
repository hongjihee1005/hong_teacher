/* 땅의 변화 실험관에서 더 쓰는 아이콘 */
Object.assign(I,{fire:'<path d="M12 3c1 3.5 5 5.5 5 10a5 5 0 01-10 0c0-2.4 1.2-4 2.4-5 .2 1.8 1 2.8 2 3.2C11 9 11.3 6 12 3z"/>',rock:'<path d="M4 17l2.5-7 5-4 5.5 2.5L20 15l-3 4H7z"/><path d="M9.5 9.5l2 3.5 4-1.5"/>',hill:'<path d="M2.5 19c3-7 6-10 9.5-10s6.5 3 9.5 10z"/><path d="M12 9V5.5h2.5"/>'});

/* ───────── 기록(이 기기에만) ───────── */
const KEY='hj-g4land-v1';
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
/* 실험 1: 흙 언덕 */
function hillSpot(){const c=UI.mq.cur;const i={f1:0,h1:0,c1:0,f2:1,h2:1,f3:2,h3:2,c3:2}[c];if(i==null)return null;return hillSpot0(i,curStep().id==='first'?0:3)}
const CUPBIG='<g transform="translate(480 300) scale(2.4) translate(-480 -240)">';
function e1Scene(s){const r=R(),id=s.id,f=UI.fx,st=r.st;
 if(id==='gear')return bg({})+gearArt(1,has('gear'),fxOn('gear'));
 if(id==='groove'){const on=has('groove');let g=bgTop()+CUPBIG+paperCup(480,211,{groove:on})+'</g>';
  if(fxOn('groove'))g+='<g'+an('lb-a-slide',0,'--dx:160px')+'>'+scissors(565,252,180,1.3)+'</g>';else if(!on)g+=scissors(700,330,200,1.3);return g}
 if(id==='hill'){const on=has('hill');let g=bgField();
  if(!on)return g+itemArtAt('soil',300,380)+trowel(560,380,-20,1.3)+qmark(480,200);
  g+='<g'+(fxOn('hill')?' class="lb-a lb-a-hillup"':'')+'>'+hillArt(0)+'</g>';
  if(fxOn('hill'))g+='<g'+an('lb-a-pat',.9)+'>'+cotton(560,250,200,1.1)+'</g>';return g}
 if(id==='cupin'){const on=has('cupin');if(!on)return bgField()+hillArt(0)+paperCup(150,GY-120,{groove:1})+arrow(200,280,400,220);
  return bgField()+'<g'+(fxOn('cupin')?an('lb-a-down',0,'--from:-150px'):'')+'>'+paperCup(CUPX,CUPT,{groove:1})+'</g>'+hillArt(0)}
 if(id==='coffee'){const on=has('coffee');let g=bgField()+paperCup(CUPX,CUPT,{groove:1})+hillArt(0);
  if(on)g+=coffeeArt(0,fxOn('coffee'));else g+=itemArtAt('coffee',170,330);return g}
 if(id==='first')return hillScene({cup:1,coffee:1,tags:1});
 if(id==='pred')return hillScene({cup:1,coffee:1})+petBottle(170,GY-76,0,.9)+qmark(480,110);
 if(id==='pour'){const n=st.pw||0,fid=f&&/^pw/.test(f.id)?+f.id[2]:0,k=fid||n;
  if(fxOn('gush'))return hillScene({cup:1,cupw:1,coffee:1,k:n,ghost:n>0,wet:n>0,pour:1})+'<path d="M'+(CUPX-30)+' '+CUPT+' q-20 10 -22 44 q14 -8 22 -30Z" fill="#4FA3DB" opacity=".9"/><path d="M'+(CUPX+30)+' '+CUPT+' q16 8 14 30" stroke="#4FA3DB" stroke-width="7" fill="none"/>';
  let g=hillScene({cup:1,cupw:k>0,coffee:1,k,ghost:1,wet:k>0,flow:!!fid,flowAnim:!!fid,pour:!!fid,pourAnim:!!fid});
  if(!fid&&n<3)g+=petBottle(170,GY-76,0,.9);return g}
 if(id==='look'||id==='cof')return hillScene({cup:1,cupw:1,coffee:1,k:3,ghost:1,wet:1,tags:1});
 return hillScene({cup:1})}
/* 실험 2: 화산 활동 모형 */
function windowArt(open,anim){let g='<rect x="290" y="60" width="380" height="250" rx="6" fill="var(--w-sky1)" stroke="var(--w-win)" stroke-width="10"/><path d="M300 250 Q380 220 470 250 T660 240 V300 H300Z" fill="var(--w-leaf2)" opacity=".6"/>';
 g+='<g'+(anim?an('lb-a-slide',0,'--dx:-180px'):'')+'><rect x="'+(open?480:300)+'" y="70" width="180" height="230" fill="var(--w-glass)" stroke="var(--w-glass-s)" stroke-width="5"/></g><rect x="480" y="70" width="180" height="230" fill="var(--w-glass)" stroke="var(--w-glass-s)" stroke-width="5"/>';
 if(open)g+='<g stroke="var(--lb-sci)" stroke-width="5" fill="none" stroke-linecap="round"'+(anim?an('lb-a-fade',.9):'')+'><path d="M330 140 q40 -16 80 0 t80 0"/><path d="M340 190 q40 -16 80 0 t60 0"/></g>';
 return g}
function e2Scene(s){const r=R(),id=s.id,f=UI.fx,st=r.st;
 if(id==='gear')return bg({})+gearArt(2,has('gear'),fxOn('gear'));
 if(id==='air')return bg({})+windowArt(has('air'),fxOn('air'));
 if(id==='fill'){const on=has('fill'),fa=fxOn('fill');let g=bg({});
  if(!on)return g+kcup(480,400,'full',2)+scissors(690,260,200,1.2)+itemArtAt('mallow',250,330);
  g+=kcup(480,400,'open',2)+mallows(480,400,2,{anim:fa});
  g+='<g'+(fa?an('lb-a-down',0,'--from:-130px'):'')+'><path d="M640 404 L644 386 L780 386 L784 404Z" fill="#C6CDD3" stroke="#7D8893" stroke-width="2.5"/></g>';return g}
 if(id==='add'){const on=has('add'),fa=fxOn('add');let g=bg({})+kcup(480,400,'open',2)+mallows(480,400,2,{tint:on&&!fa});
  if(fa)g+='<g'+an('lb-a-fade',0)+'>'+spoon(440,220,20,1.4,'#FFFFFF')+'</g><g'+an('lb-a-fade',.8)+'>'+spoon(470,214,20,1.4,'#7CC3EC')+'</g><g'+an('lb-a-fade',1.6)+'>'+'<g transform="translate(560 170) rotate(150) scale(.9)">'+itemArt('color')+'</g><path d="M520 222 v14 M528 226 v14" stroke="#E2503B" stroke-width="5" stroke-linecap="round"/></g>';
  else if(!on)g+=itemArtAt('soda',200,320)+itemArtAt('water',300,330)+itemArtAt('color',760,320);return g}
 if(id==='close'){const on=has('close');let g=bg({});if(!on)return g+kcup(480,400,'open',2)+mallows(480,400,2,{tint:1});
  return g+'<g'+(fxOn('close')?an('lb-a-fade',0):'')+'>'+kcup(480,400,'closed',2,{mouth:1})+'</g>'}
 if(id==='place'){const on=has('place');let g=bg({})+hotplate(false)+dishArt();
  if(!on)return g+kcup(190,414,'closed',1,{mouth:1})+arrow(240,330,400,300);
  return g+'<g'+(fxOn('place')?an('lb-a-down',0,'--from:-120px'):'')+'>'+kcup(KC.cx,KC.b,'closed',1,{mouth:1})+'</g>'}
 if(id==='pred')return volScene({})+qmark(480,170);
 if(id==='heat'){const n=st.ht||0,fid=f&&/^ht/.test(f.id)?+f.id[2]:0,m=Math.max(n,fid);
  const o={on:m>=1&&m<3,smoke:m>=2,smokeAnim:m>=2,lv:m>=3?3:m>=2?1:0,lvAnim:fid===2?1:fid===3?3:0};
  let g=volScene(o);if(fid===2)g=g.replace('lb-a-grow" style="animation-delay:0s','lb-a-grow" style="animation-delay:1.6s');
  if(fxOn('near'))g+='<g'+an('lb-a-slide',0,'--dx:-200px')+'><circle cx="610" cy="250" r="40" fill="#F2C6A0" stroke="#B9875F" stroke-width="3"/></g>';return g}
 if(id==='cool'){const n=st.cl||0,fid=f&&/^cl/.test(f.id)?+f.id[2]:0,m=Math.max(n,fid);
  let g=volScene({lv:3,cool:m>=1&&fid!==1,smoke:m===0});
  if(fid===1)g=volScene({lv:3})+'<g'+an('lb-a-fade',.6)+'>'+lava(3,true)+'</g>';
  if(fxOn('touch'))g+='<g'+an('lb-a-slide',0,'--dx:120px')+'>'+hand(KC.cx+150,KC.b-6,180,.9,1)+'</g>';
  return g}
 if(id==='real'){const c=UI.mq.cur;let g=bg({})+realVolcano(250,290,.8,c==='rv');
  g+='<g transform="translate(330 30) scale(.85)">'+hotplate(false)+dishArt()+kcup(KC.cx,KC.b,'closed',1,{mouth:1})+lava(3,true)+(c==='rm'?'<rect x="320" y="190" width="320" height="240" rx="18" fill="none" stroke="var(--lb-lens)" stroke-width="6"/>':'')+'</g>';
  return g+tag(250,470,'실제 화산 활동(그림)',20)+tag(740,470,'우리 모형',20)}
 return volScene({})}
/* 실험 3: 암석 */
function e3Scene(s){const r=R(),id=s.id,f=UI.fx,st=r.st,c=UI.mq.cur;
 if(id==='gear')return bg({})+gearArt(3,has('gear'),fxOn('gear'));
 if(id==='paper'){const on=has('paper');if(!on)return rockPaper({nopaper:1});return rockPaper({stk:1,paperAnim:fxOn('paper'),stkAnim:fxOn('paper')})}
 if(id==='eye')return rockPaper({stk:1,hl:c&&c[0]==='e'?c.slice(1):null});
 if(id==='pred')return rockPaper({stk:1})+qmark(480,72);
 if(id==='scope')return microScene(null,{noq:1,off:!has('scope'),anim:fxOn('scope')});
 if(id==='micro'||id==='hole'){const k=c&&/^[mo]R/.test(c)?c.slice(1):null;return microScene(k,{})}
 if(id==='sort'){const so=st.so||0,row=rowDone('sortC')&&so>=2?'sortG':'sortC',cc=row==='sortG'?'qG':so>=1?'qC':null;
  const x=r.rec[row],D=UI.draft[row];return bgTop()+sortArt(cc,x&&x.ok?x.f:D&&D.f?D.f:[])}
 if(id==='name'){let g=rockPaper({stk:1});const x=r.rec.rname;if(x&&x.ok)ROCKK.forEach((k,i)=>{const p=RPOS[k];g+=mini(p[0],p[1]+108,x.f[i]===0?'화강암':'현무암',20)});return g}
 return rockPaper({stk:1})}
function sceneSVG(){const v=V(),r=R(),s=curStep(),id=s.id,no=v.no;
 const T=(g,l,vb)=>svg(g+lensOf(s,g),l||s.t,vb);
 if(id==='tools'){const big=v.tools.length>8;if(!(r.done.tools||fxOn('tools')))return T(bg({})+boxArt(480),'준비물 상자',big?'-70 0 1100 540':null);return T(bg({})+toolsScene(v.tools,fxOn('tools')),'준비물: '+v.tools.map(x=>x[1]).join(', '),big?'-70 30 1100 470':null)}
 if(id==='gear')return T(no===1?e1Scene(s):no===2?e2Scene(s):e3Scene(s),s.t,'160 40 640 420');
 if(no===1)return T(e1Scene(s),s.t,id==='groove'?'250 150 460 300':'60 40 860 440');
 if(no===2)return T(e2Scene(s),s.t,id==='air'?'230 40 500 300':['fill','add','close'].indexOf(id)>=0?'170 120 620 330':id==='real'?'40 100 880 400':id==='place'?'130 140 640 320':'240 140 480 310');
 if(no===3)return T(e3Scene(s),s.t,id==='sort'?'40 0 880 450':id==='micro'||id==='hole'||id==='scope'?'40 60 880 420':'60 30 840 450');
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
 v.pred.forEach((q,j)=>{h+=(v.pred.length>1?'<p class="lb-q">'+esc(q.q)+'</p>':'')+'<div class="lb-opts'+(q.o.length>3&&q.o.every(t=>t.length<=7)?' lb-opts2':q.o.length===3&&q.o.every(t=>t.length<=4)?' lb-opts3':'')+'" role="group" aria-label="'+esc(q.q)+'">';
  q.o.forEach((t,i)=>{const on=r.pred[j]===i;h+='<button type="button" class="lb-opt'+(v.pred.length>1?' lb-optsm':'')+'" data-f="o'+j+i+'" data-pred="'+j+':'+i+'" aria-pressed="'+on+'"'+(lock?' disabled':'')+'><i>'+(on?ic('check'):'')+'</i><span>'+esc(t)+'</span></button>'});h+='</div>'});
 h+='<div><label class="lb-label" for="lbWhy">그렇게 생각한 까닭 (쓰고 싶으면)</label><input id="lbWhy" class="lb-input" maxlength="60" placeholder="왜냐하면 ~ 때문이에요." value="'+esc(r.why)+'"'+(lock?' readonly':'')+'></div>';
 if(lock)h+='<div class="lb-msg lb-plain">'+ic('lock')+'<span>관찰을 시작해서 예상을 바꿀 수 없어요.</span></div>';
 else if(r.pred.length)h+='<div class="lb-msg lb-plain" aria-live="polite">'+ic('info')+'<span>예상은 맞히기가 아니라 내 생각이에요.</span></div>';
 return cardHead('내 예상','고른 예상은 결과 한 장에 남아요')+wrapB(h)}

/* ───────── 기록 줄(③) ───────── */
/* 같은 보기를 쓰는 칸이 많으면(잎 여섯 장) 보기별로 묶어서 씀: '톱니 모양: 1, 4, 5번' */
function groupSum(F,f){const o=F[0].o,rk=/^암석 /.test(F[0].l);if(F.length<4||!F.every(x=>(rk?/^암석 /:/번 잎$/).test(x.l)&&x.o.join()===o.join()))return null;
 const nm=j=>rk?'①②③④'[j]:String(j+1),sf=rk?'':'번';
 return o.map((t,i)=>t+': '+(F.map((x,j)=>f[j]===i?nm(j):null).filter(Boolean).join(', ')||'없음')+(F.some((x,j)=>f[j]===i)?sf:'')).join(' · ')}
function rowSum(row){const r=R(),R0=ROWS[row],x=r.rec[row]||{};
 if(R0.t==='sel'){const F=fOf(row),pre=R0.crit&&x.c?CRIT[x.c].t+' → ':'',gs=groupSum(F,x.f);if(gs)return pre+gs;return pre+F.map((f,i)=>(f.l?f.l+' ':'')+f.o[x.f[i]]).join(' · ')}
 if(R0.t==='note'){const w=R0.f.map((f,i)=>(x.t&&x.t[i])?f.l.replace(/ 잎$/,'')+': '+x.t[i]:'').filter(Boolean);return w.length?w.join(' · '):'(쓰지 않았어요)'}
 return ''}
function rowReady(row){const r=R(),R0=ROWS[row],x=r.rec[row]||{};if(x.ok)return true;if(R0.crit&&!r.st[R0.crit])return false;if(R0.after&&!rowDone(R0.after))return false;
 return R0.need.every(k=>r.seen[k])}
function numOpen(){return false}
function rowUI(row){const r=R(),R0=ROWS[row],x=r.rec[row]||{},done=!!x.ok,wr=UI.wrong[row]||[];
 if(done){let h='<div class="lb-mrow lb-mdone"><div class="lb-mrh"><b>'+esc(R0.n)+'</b><span class="lb-okt">'+ic('check')+'기록했어요</span></div><p class="lb-recsum">'+esc(rowSum(row))+'</p>';
  if(UI.fb[row]&&curStep().rows.every(rowDone))h+='<div class="lb-msg lb-good" role="status">'+ic('check')+'<span>'+UI.fb[row][1]+'</span></div>';
  return h+'</div>'}
 let h='<div class="lb-mrow"><div class="lb-mrh"><b>'+esc(R0.n)+'</b></div>';
 const D=UI.draft[row]=UI.draft[row]||{};const ok=rowReady(row);
 const recB=on=>'<button type="button" class="lb-rec-btn" data-act="rowrec" data-row="'+row+'" data-f="rr'+row+'"'+(on?'':' disabled')+'>'+ic('check')+'기록하기</button>';
 if(R0.t==='sel'){D.f=D.f||[];const F=fOf(row);
  const c2=F.every(f=>f.l.length<=7)?' lb-c2':'';
  const grid=F.length>=6&&c2;if(grid)h+='<div class="lb-cgrid">';
  F.forEach((f,j)=>{const long=c2?f.o.length>3:f.o.some(t=>t.length>6)||f.o.length>3;
   h+='<div class="lb-cells lb-c1'+c2+'"><span class="lb-cl">'+esc(grid?f.l.replace(/ 잎$/,''):f.l)+'</span><span class="lb-seg lb-kseg'+(long?' lb-kwrap':'')+(wr.indexOf(j)>=0?' lb-wrongc':'')+'" role="group" aria-label="'+esc(R0.n+' '+f.l)+'">'+f.o.map((o,i)=>'<button type="button" class="lb-s" data-f="'+row+j+'-'+i+'" data-dr="'+row+':'+j+':'+i+'" aria-pressed="'+(D.f[j]===i)+'"'+(ok?'':' disabled')+'>'+esc(o)+'</button>').join('')+'</span></div>'});if(grid)h+='</div>';
  h+=recB(ok&&F.every((f,j)=>D.f[j]!=null))}
 if(R0.t==='note'){D.t=D.t||[];
  h+='<p class="lb-hint2">쓰고 싶은 것을 짧게 써요. 쓰지 않아도 돼요.</p>'+R0.f.map((f,j)=>'<label class="lb-nrow"><span>'+esc(f.l)+'</span><input class="lb-input lb-ninp" maxlength="20" autocomplete="off" data-f="nt'+row+j+'" data-nt="'+row+':'+j+'" placeholder="'+esc(R0.ph)+'" value="'+esc(D.t[j]||'')+'"'+(ok?'':' disabled')+'></label>').join('');
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
 if(rowReady(need))return R0.t==='note'?'③ 살펴본 것을 쓰고 기록해요.':'③ '+R0.n+(/\?$/.test(R0.n)?' ':': ')+'알맞은 것을 골라 기록해요.';
 if(R0.crit&&!r.st[R0.crit])return '① 기준 고르기에서 기준을 하나 눌러요.';
 const miss=R0.need.find(k=>!r.seen[k]),A=actsOf(s),a=A.find(b=>b.id===miss);
 const cur=A.find(b=>b.hide===false&&!b.pressed);if(cur)return '① '+lj(cur.label.replace(/^\d\/\d · /,''))+' 눌러요.';
 if(a&&a.cell)return '① '+a.grp+': '+lj(a.label)+' 눌러요.';
 return '① '+lj(lbl(miss)||'단추')+' 눌러요.'}
function lj(t){return /\?$/.test(t)?'‘'+t+'’'+jo(t.slice(0,-1),'을','를').slice(-1):jo(t,'을','를')}
function gPart(n,t,st,body){return '<li class="lb-gp lb-'+st+'"'+(st==='wait'?' inert aria-disabled="true"':'')+'><div class="lb-gh"><i>'+(st==='ok'?ic('check'):n)+'</i><b>'+t+'</b></div>'+(body?'<div class="lb-gb">'+body+'</div>':'')+'</li>'}
function actBtns(s){const A=actsOf(s),cells=A.filter(a=>a.cell),rest=A.filter(a=>!a.cell&&!a.hide);let h='';
 const seq=A.filter(a=>a.hide!=null);if(seq.length)h+='<ol class="lb-seq" aria-label="차례">'+seq.map((a,i)=>'<li class="'+(a.pressed?'lb-d':!a.hide?'lb-n':'')+'">'+(a.pressed?ic('check'):'<b>'+(i+1)+'</b>')+'<span>'+esc(a.label.replace(/^\d\/\d · /,''))+'</span></li>').join('')+'</ol>';
 if(rest.length)h+='<div class="lb-acts">'+rest.map(a=>'<button type="button" class="lb-act'+(a.sub?' lb-act2':'')+(UI.attn&&!a.dis&&!a.sub?' lb-attn':'')+'" data-act="x" data-x="'+a.id+'" data-f="x'+a.id+'"'+(a.pressed!=null?' aria-pressed="'+!!a.pressed+'"':'')+(a.dis?' disabled':'')+'>'+ic(a.icon||'hand')+'<span>'+esc(a.label)+'</span></button>').join('')+'</div>';
 const grps=[];cells.forEach(a=>{let g=grps.find(x=>x.n===a.grp);if(!g)grps.push(g={n:a.grp,c:[]});g.c.push(a)});
 grps.forEach(G=>{const n=G.c.length,cols=G.c.some(a=>a.label.length>6)?(n>2?2:n):n>4?3:n;h+='<div class="lb-cellrow" role="group" aria-label="'+esc(G.n)+'"><span class="lb-cl">'+esc(G.n)+'</span><div style="grid-template-columns:repeat('+cols+',1fr)">'+G.c.map(a=>'<button type="button" class="lb-cellb'+(a.label.length>6?' lb-cellw':'')+(UI.attn&&!a.dis?' lb-attn':'')+(a.seen?' lb-seen':'')+'" data-act="x" data-x="'+a.id+'" data-f="x'+a.id+'" aria-pressed="'+!!a.pressed+'"'+(a.dis?' disabled':'')+' aria-label="'+esc(G.n+' '+a.label)+(a.seen?' (해 봤어요)':'')+'">'+(a.seen?ic('check'):'')+'<span>'+esc(a.label)+'</span></button>').join('')+'</div></div>'});
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
 /* 지금 누를 수 있는 단추가 없으면(기록을 먼저 해야 다음 단추가 열림) ① 단추도 접음 */
 const free=actsOf(s).some(a=>!a.dis&&!a.sub&&a.hide!==true&&!(a.hide===false&&a.pressed));
 const seenAll=s.rows.every(k=>ROWS[k].need.every(n=>r.seen[n]));
 h+=gPart(1,'해 보기',L||seenAll?'ok':'cur',(L||seenAll||!free)&&!UI.fx?'':actBtns(s));
 h+=gPart(2,'살펴보기',!A?'wait':L?'ok':'cur',s.rows.some(rowReady)?'':'<p>'+esc(s.look)+'</p>');
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
 if(R0.t==='sel'){const F=fOf(k),gs=groupSum(F,x.f),pre=R0.crit&&x.c?'<span><b>기준</b> '+esc(CRIT[x.c].t)+'</span>':'';
  if(gs)return pre+gs.split(' · ').map(t=>{const i=t.indexOf(': ');return '<span><b>'+esc(t.slice(0,i))+'</b> '+esc(t.slice(i+2))+'</span>'}).join('');
  return pre+F.map((f,i)=>'<span>'+(f.l?'<b>'+esc(f.l)+'</b> ':'')+esc(f.o[x.f[i]])+'</span>').join('')}
 const w=R0.f.map((f,i)=>(x.t&&x.t[i])?'<span><b>'+esc(f.l)+'</b> '+esc(x.t[i])+'</span>':'').filter(Boolean);return w.length?w.join(''):'<span>(쓰지 않았어요)</span>'}
function recPanel(){const v=V(),r=R();let h='<div class="lb-recpanel" tabindex="0" aria-label="내 예상과 내 기록">';
 h+='<section><h2>'+ic('clip')+'내 기록</h2><table class="lb-rtbl"><tbody>'+v.rows.filter(rowDone).map(k=>'<tr><th scope="row">'+esc(ROWS[k].n)+'</th><td>'+recLines(k)+'</td></tr>').join('')+'</tbody></table></section>';
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
 let h='<article class="lb-sheet lb-sh-e'+v.no+'" id="lbSheet" aria-label="실험 결과 한 장"><div class="lb-sh-in"><header class="lb-sh-h"><div><h2>실험 결과 한 장 · '+esc(v.title)+'</h2><span>탐구 실험관 · 4학년 1학기 과학 · 3. 땅의 변화 · '+ds+'</span></div><div class="lb-sh-name">이름 <u>'+(esc(DB.name)||'&nbsp;')+'</u></div></header><div class="lb-sh-grid"><div class="lb-sh-col">';
 h+='<section class="lb-sh-sec"><h3><i></i>실험 문제</h3><p><b>'+esc(v.q)+'</b></p>'+planSummary(v,r)+'</section>';
 h+='<section class="lb-sh-sec lb-sh-po"><h3><i></i>실험한 차례</h3><div class="lb-sh-steps">'+done.map((s,i)=>'<div><b>'+(i+1)+'.</b> '+esc(s.t)+'</div>').join('')+'</div></section>';
 h+='<section class="lb-sh-sec"><h3><i></i>내 예상</h3><p>'+v.pred.map((q,j)=>(v.pred.length>1?esc(q.q)+' ':'')+(r.pred[j]!=null?esc(q.o[r.pred[j]]):'(고르지 않았어요)')).join('<br>')+(r.why?'<br>까닭: '+esc(r.why):'')+'</p></section>';
 h+='</div><div class="lb-sh-col"><section class="lb-sh-sec"><h3><i></i>관찰 기록</h3>'+sheetTable(v,r)+barChart(v,r)+'</section>';
 /* 실험 1은 관찰 기록 줄이 일곱이라 결론을 아래 한 줄 전체로(오른쪽 칸만 길어져 2쪽이 되던 것, 독립 검토 고침) */
 const cs='<section class="lb-sh-sec'+(v.rows.length>=6?' lb-sh-wide':'')+'"><h3><i></i>내 결론</h3><div class="lb-sh-box"><p class="lb-sh-concl">'+frameHTML(v,r.bl,'sheet')+'</p>'+(r.cmp?'<p class="lb-sh-book">교과서 결론: '+esc(v.book)+'</p>':'')+'</div></section>';
 h+=(v.rows.length>=6?'':cs)+'</div></div>'+(v.rows.length>=6?cs:'')+picsHTML(snapList(v,r))+'<section class="lb-sh-sec lb-sh-po lb-sh-fill"><h3><i></i>새로 알게 된 것 · 더 알고 싶은 것</h3><div class="lb-sh-lines">'+'<div class="lb-ln"></div>'.repeat(9)+'</div></section>';
 h+='<footer class="lb-sh-f"><span>아주 단순하게 만든 모형의 결과예요. 실제 교실에서는 결과가 조금 다를 수 있어요.</span><span>만든 사람: 초등교사 홍지희</span></footer></div></article>';
 return h}
const LABNAME='land';
function snapsOf(v,r){const L=[],no=v.no,S=(g,vb,cap)=>L.push([svg(g,cap,vb),cap]);const ok=k=>rowDone(k);
 if(no===1){S(hillScene({cup:1,coffee:1}),'60 160 840 290','물을 붓기 전');if(ok('cut'))S(hillScene({cup:1,cupw:1,coffee:1,k:3,ghost:1,wet:1}),'60 160 840 290','물을 흘려 보낸 뒤(점선: 처음 모습)')}
 if(no===2){if(ok('out'))S(volScene({lv:3,smoke:1}),'250 160 460 270','흘러나온 마시멜로');if(ok('cooled'))S(volScene({lv:3,cool:1}),'250 160 460 270','식은 뒤')}
 if(no===3){S(rockPaper({stk:1}),'80 100 800 340','암석 ①~④');if(ok('grain'))S(bgTop()+microTex('R1',0,0,300,220)+microTex('R2',320,0,300,220),'0 0 620 220','현미경으로 본 ①(왼쪽)과 ②(오른쪽)')}
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
 if(!DB.cur||!EXPS[DB.cur]){H.classList.remove('lb-inrun');$('#lbSub').textContent='4학년 1학기 과학 · 3단원 땅의 변화';$('#lbChoose').hidden=true;$('#lbClearMi').hidden=true;
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
function actsOf(s){const r=R(),A=[],busy=!!UI.fx,st=r.st||{};
 const per=(pre,grp,keys,names)=>keys.forEach((k,i)=>A.push({id:pre+k,label:names[i],cell:1,grp,pressed:UI.mq.cur===k&&!busy,seen:!!r.seen[pre+k],dis:busy}));
 const cells=(grp,list)=>list.forEach(x=>A.push({id:x[0],label:x[1],cell:1,grp,pressed:UI.mq.cur===x[0]&&!busy,seen:!!r.seen[x[0]],dis:busy}));
 const PL=[['1','위쪽'],['2','가운데'],['3','아래쪽']],RK=pre=>ROCKK.map(k=>[pre+k,'①②③④'[ROCK[k].n-1]]);
 switch(s.id){
  case 'first':cells('살펴볼 곳',PL.map(p=>['f'+p[0],p[1]]));break;
  case 'pour':seqActs(A,'pw',['pw1','pw2','pw3'],['물을 천천히 붓기','물을 조금 더 붓기','남은 물을 마저 붓기'],busy);A.push({id:'gush',label:'한꺼번에 쏟기',sub:1,dis:busy});break;
  case 'look':cells('살펴볼 곳',PL.map(p=>['h'+p[0],p[1]]));break;
  case 'cof':cells('살펴볼 곳',[['c1','위쪽'],['c3','아래쪽']]);break;
  case 'heat':seqActs(A,'ht',['ht1','ht2','ht3'],['핫플레이트 전원 켜기','떨어져서 지켜보기','흘러나오면 전원 끄기'],busy);{const q=A.find(a=>a.id==='ht3');if(q&&!rowDone('smoke'))q.dis=true}A.push({id:'near',label:'얼굴 가까이 대고 보기',sub:1,dis:busy});break;
  case 'cool':seqActs(A,'cl',['cl1','cl2'],['식을 때까지 기다리기','식은 모습 가까이 보기'],busy);A.push({id:'touch',label:'흘러나온 것 바로 만지기',sub:1,dis:busy},{id:'taste',label:'마시멜로 맛보기',sub:1,dis:busy});break;
  case 'real':cells('살펴볼 그림',[['rv','실제 화산 활동'],['rm','우리 모형']]);break;
  case 'eye':cells('맨눈으로 볼 암석',RK('e'));break;
  case 'micro':cells('현미경으로 볼 암석',RK('m'));break;
  case 'hole':cells('표면을 볼 암석',RK('o'));break;
  case 'sort':{seqActs(A,'so',['qC','qG'],['\'색깔이 밝은가?\'로 나누기','\'알갱이의 크기가 큰가?\'로 나누기'],busy);const q=A.find(a=>a.id==='qG');if(q&&!rowDone('sortC'))q.dis=true;break}
  case 'name':A.push({id:'nm',label:'교과서 문장 다시 읽기',dis:busy||!!r.seen.nm});break}
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
 if(no===1){vb='60 110 860 350';
  if(k==='groove'){g=bgTop()+CUPBIG+paperCup(480,211,{groove:1})+'</g>'+scissors(565,252,180,1.3);vb='250 150 460 300'}
  if(k==='hill')g=hillScene({cup:1});
  if(k==='coffee')g=hillScene({cup:1,coffee:1});
  if(k==='pour'){g=hillScene({cup:1,coffee:1,pour:1});vb='60 20 860 440'}}
 if(no===2){if(k==='fill'){g=bg({})+kcup(480,400,'open',2)+mallows(480,400,2);vb='170 120 620 330'}
  if(k==='add'){g=bg({})+kcup(480,400,'open',2)+mallows(480,400,2)+spoon(440,220,20,1.4,'#FFFFFF');vb='170 120 620 330'}
  if(k==='close'){g=bg({})+hotplate(false)+dishArt()+kcup(KC.cx,KC.b,'closed',1,{mouth:1});vb='280 200 400 240'}
  if(k==='heat'){g=volScene({on:true})+'<g transform="translate(180 330)">'+'<circle cx="0" cy="-60" r="26" fill="#F2C6A0" stroke="#B9875F" stroke-width="3"/>'+goggles(0,-64,.6)+'</g>'+arrow(230,250,330,250);vb='110 150 560 300'}}
 if(no===3){if(k==='paper'){g=rockPaper({stk:1});vb='80 100 800 340'}
  if(k==='eye'){g=bgTop()+rockArt('R1',360,250,90,{stk:1})+rockArt('R2',600,250,90,{stk:1});vb='230 130 500 240'}
  if(k==='scope'){g=microScene(null,{noq:1});vb='40 60 880 420'}
  if(k==='sort'){g=bgTop()+sortArt(null,[]).replace(/<g class="lb-a lb-a-pop"[\s\S]*?<\/g><\/g>/,'');vb='40 180 880 270'}}
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
 if(no===1){g=hillScene({cup:1,coffee:1});vb='60 150 860 330'}
 if(no===2){g=volScene({});vb='250 170 460 270'}
 if(no===3){g=rockPaper({stk:1});vb='80 100 800 340'}
 const s=svg(g,'실험 '+no+' 처음 모습',vb);NAR=false;LEG=[];return s}
function homeHTML(){const card=k=>{const v=EXPS[k],r=DB.runs[k];const st=r?(r.fin?'끝냄 · 결과 보기':(r.step+1)+'단계부터 이어서'):'실험 시작하기';
 return '<section class="lb-exc" aria-labelledby="lbE'+v.no+'"><div class="lb-exc-art">'+homeArt(v.no)+'</div><div class="lb-exc-b"><h2 id="lbE'+v.no+'"><em>실험 '+v.no+'</em>'+esc(v.name)+'</h2><p class="lb-exp">'+esc(v.sub)+'</p><button type="button" class="lb-pickb" data-pick="'+k+'" data-f="k'+k+'"><i>'+ic(['','hill','fire','rock'][v.no])+'</i><span><b>'+st+'</b><span>교과서 실험</span></span>'+(r&&r.fin?'<small>'+ic('check')+'</small>':'')+'</button></div></section>'};
 return '<div class="lb-home"><div class="lb-home-h"><div class="lb-kick"><em>4학년 1학기 과학</em>3. 땅의 변화</div><h1>무엇을 실험할까요?</h1><p>실험을 한 단계씩 직접 해 보고, 내 눈으로 본 것을 기록해요.</p></div>'+
 '<div class="lb-ex lb-ex3">'+['e1','e2','e3'].map(card).join('')+'</div>'+
 '<p class="lb-model">'+ic('info')+'<span>아주 단순하게 만든 모형이에요. 같은 조건이면 언제나 같은 결과가 나와요. 관찰 결과는 교과서·지도서 예시와 같고, 실제 실험에서는 조금씩 다를 수 있어요. 흙 언덕의 모양과 물을 부은 뒤의 모습, 커피 찌꺼기 수, 가열한 모형의 모습, 네 암석의 모양·무늬·구멍 수와 현미경 화면은 이 실험관에서 정한 모습이에요. 화산 활동 모형은 가열하는 실험이라 선생님과 함께, 또는 선생님의 대표 실험으로 해요.</span></p></div>'}
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
 const SUB={gush:'한꺼번에 많이 부으면 종이컵에서 물이 넘쳐요. 천천히 일정한 양을 부어요.',near:'가열하면서 나타나는 변화는 안전한 거리를 두고 관찰해요.',touch:SAFE.hot,taste:'실험에 쓰는 물질은 먹거나 맛보지 않아요.'};
 if(SUB[id]){fx(id,1100,()=>flash(SUB[id]));return}
 if(id==='ht3'&&!rowDone('smoke')){flash('먼저 컵 입구에서 본 것을 기록해요.','info');return}
 if(id==='qG'&&!rowDone('sortC')){flash('먼저 \'색깔이 밝은가?\'로 나눈 것을 기록해요.','info');return}
 r.act[s.id]=1;if(idxOf('pred')>=0&&r.step>idxOf('pred'))r.obs=1;
 const done=()=>{r.seen[id]=1};
 const seq=(key,ids,ms)=>{const i=ids.indexOf(id),c=st[key]||0;if(i<0||c!==i)return true;fx(id,ms,()=>{st[key]=i+1;r.seen[id]=1});return true};
 if(/^pw[123]$/.test(id)){seq('pw',['pw1','pw2','pw3'],2300);return}
 if(/^ht[123]$/.test(id)){seq('ht',['ht1','ht2','ht3'],id==='ht1'?1200:2800);return}
 if(id==='cl1'||id==='cl2'){if(id==='cl2')UI.mq.cur='cl2';seq('cl',['cl1','cl2'],id==='cl1'?2300:1000);return}
 if(id==='qC'||id==='qG'){seq('so',['qC','qG'],800);return}
 if(id==='nm'){fx(id,900,done);return}
 if(/^[fhc][123]$/.test(id)||/^[emo]R\d$/.test(id)||id==='rv'||id==='rm'){UI.mq.cur=id;fx(id,1000,done);return}}
/* 숫자 적기: 화면 숫자와 같은지만 알려 줌. 같은 값으로 다시 누르면 세지 않음 */
function tryKey(k,val){const r=R();if(r.last[k]===val)return -1;r.last[k]=val;r.tries[k]=(r.tries[k]||0)+1;return r.tries[k]}
function trial(){}
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
 if(t.dataset&&t.dataset.in!=null){const dec=V()&&V().no===3;UI.inp[t.dataset.in]=t.value.replace(dec?/[^\d.]/g:/[^\d]/g,'');if(t.value!==UI.inp[t.dataset.in])t.value=UI.inp[t.dataset.in]}
 if(t.id==='lbName'){DB.name=t.value;save();const u=$('#lbSheet .lb-sh-name u');if(u)u.textContent=DB.name||' '}});
let rzT=0,wasN=narrow();addEventListener('resize',()=>{clearTimeout(rzT);rzT=setTimeout(()=>{const n=narrow();if(n!==wasN){wasN=n;const s=$('#lbScene');if(s)s._h=null}if(DB.cur)render();else fitAll()},150)});
if(DB.cur&&EXPS[DB.cur]){if(!DB.runs[DB.cur])DB.runs[DB.cur]=newRun();enterStep()}
render();

addEventListener('beforeprint',()=>{const s=$('#lbSheet .lb-sh-in');if(s)s.style.zoom=''});addEventListener('afterprint',()=>{try{fitAll()}catch(e){}});
