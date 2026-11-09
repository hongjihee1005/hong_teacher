/* 지층과 화석 실험관에서 더 쓰는 아이콘 */
Object.assign(I,{layers:'<path d="M3 7h18M3 12h18M3 17h18"/><rect x="3" y="4" width="18" height="16" rx="2"/>',rock:'<path d="M4 17l2.5-7 5-4 5.5 2.5L20 15l-3 4H7z"/><path d="M9.5 9.5l2 3.5 4-1.5"/>',shell:'<path d="M12 4c5 0 8 4 7 9-1 4-4 6-7 6s-6-2-7-6c-1-5 2-9 7-9z"/><path d="M12 4v15M8 6l2 13M16 6l-2 13"/>',cards:'<rect x="3" y="6" width="13" height="9" rx="1.5"/><rect x="8" y="10" width="13" height="9" rx="1.5"/>'});

/* ───────── 기록(이 기기에만) ───────── */
const KEY='hj-g5strata-v1';
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
/* 실험 1: 지층 카드 */
const curI=pre=>{const c=UI.mq.cur;return c&&c[0]===pre&&/^\D\d$/.test(c)?+c[1]-1:null};
function e1Scene(s){const r=R(),id=s.id,se=r.seen;
 if(id==='spread'){const on=has('spread');if(!on)return bgTop()+[0,1,2,3,4,5].map(i=>cardArt(5-i,380+i*4,180-i*4,CW*1.3,CH*1.3,{})).join('')+penArt(760,330,30,1);
  return cardsTable({deal:fxOn('spread'),noBig:1})+penArt(760,420,30,1)}
 if(id==='pred')return cardsTable({noBig:1})+penArt(760,420,30,1)+qmark(740,230);
 if(id==='view'){const i=curI('v');return cardsTable({face:j=>!!se['v'+(j+1)]||j===i,big:i,flip:i!=null&&!!UI.fx})}
 if(id==='pen'){const i=curI('p');return cardsTable({face:()=>1,pen:j=>!!se['p'+(j+1)]&&!(UI.fx&&j===i),big:i,bigPen:i==null?0:UI.fx?'a':1,penTool:1})}
 return cardsTable({face:()=>1,pen:()=>1,noBig:1})}
/* 실험 2: 지층 모형 */
const ord=()=>R().st.ord||[];
function tankSpot(){const i=curI('l');if(i==null)return null;return [480,layerMid(ord(),i),44,2,180,165]}
function otherSpot(){const i=curI('o');if(i==null)return null;return [480,layerMid(OTHER,i),44,2,180,165]}
function bigCups(o){o=o||{};let g=bg({});MATK.forEach((k,j)=>{g+=cupArt(300+j*180,416,k,{s:2,fill:o.fill,fillAnim:o.fillAnim,water:o.water,waterAnim:o.waterAnim,nolab:1})+mini(300+j*180,450,MAT[k].n,20)});return g}
function e2Scene(s){const r=R(),id=s.id,st=r.st;
 if(id==='gear')return bg({})+gearArt(2,has('gear'),fxOn('gear'));
 if(id==='water'){const on=has('water');let g=bg({})+tankArt({water:on?.25:0,waterAnim:fxOn('water')});if(fxOn('water'))g+='<g'+an('lb-a-fade',0)+'>'+beaker(TX+TW/2+80,TY-30,-100,1.3,1)+'</g>';else if(!on)g+=beaker(760,360,0,1.3,1);return g}
 if(id==='fill')return bigCups({fill:has('fill'),fillAnim:fxOn('fill')});
 if(id==='wet')return bigCups({fill:1,water:has('wet'),waterAnim:fxOn('wet')});
 if(id==='pred')return modelScene({water:.25})+qmark(480,250);
 if(id==='pour'){const f=UI.fx&&/^p(gs|s|m)$/.test(UI.fx.id)?UI.fx.id.slice(1):null,o=ord().slice();if(f)o.push(f);
  return modelScene({water:.25+.083*o.length,ord:o,grow:!!f,cloud:f,pouring:f})}
 if(id==='layers')return modelScene({water:.5,ord:ord()});
 if(id==='other')return bg({})+tankArt({water:.5,ord:OTHER})+tag(480,470,'다른 모둠 모형',22);
 if(id==='real'){const c=UI.mq.cur;let g=bgTop()+'<rect x="76" y="86" width="376" height="290" rx="12" fill="var(--w-wall)"/><rect x="76" y="330" width="376" height="46" fill="var(--w-top)"/>'+tankArt({x:154,w:220,b:338,h:220,water:.5,ord:ord()});
  g+=cliffArt(520,96,360,270)+mini(260,420,'우리 지층 모형',20)+mini(700,420,'실제 지층',20);
  if(c==='rm')g+='<rect x="66" y="82" width="390" height="300" rx="14" fill="none" stroke="var(--lb-lens)" stroke-width="5" stroke-dasharray="12 8"/>';
  if(c==='rr')g+='<rect x="506" y="82" width="388" height="298" rx="14" fill="none" stroke="var(--lb-lens)" stroke-width="5" stroke-dasharray="12 8"/>';
  return g}
 return modelScene({water:.5,ord:ord()})}
/* 실험 3: 퇴적암 */
function e3Scene(s){const r=R(),id=s.id,st=r.st;
 if(id==='gear')return bg({})+gearArt(3,has('gear'),fxOn('gear'));
 if(id==='paper'){const on=has('paper');if(!on)return paper6({nopaper:1});return paper6({stk:1,paperAnim:fxOn('paper'),stkAnim:fxOn('paper')})}
 if(id==='pred')return paper6({stk:1})+qmark(480,62);
 if(id==='touch'){const i=curI('t');let g=paper6({stk:1,hl:i});if(i!=null){const p=R6POS[i];g+='<g'+(UI.fx?an('lb-a-pat',0):'')+'>'+cotton(p[0]+40,p[1]-30,-100,1.1)+'</g>'}return g}
 if(id==='color')return paper6({stk:1,hl:curI('c')});
 if(id==='loupe')return loupeScene(curI('l'),{anim:!!UI.fx});
 if(id==='sort'){const x=r.rec.grp,D=UI.draft.grp;return sortBoxes(x&&x.ok?x.f:D&&D.f?D.f:[],(r.seen.bx||fxOn('bx'))?(fxOn('bx')?'a':1):0)}
 if(id==='name'){let g=paper6({stk:1});
  if(r.seen.nm||fxOn('nm'))g+='<g'+(fxOn('nm')?an('lb-a-pop',0):'')+'><rect x="560" y="10" width="390" height="84" rx="10" fill="var(--w-label)" stroke="var(--lb-sci)" stroke-width="2.5"/><text x="576" y="38" font-size="17" font-weight="700" fill="var(--w-labeltx)">이암: 매우 작은 알갱이(진흙)</text><text x="576" y="61" font-size="17" font-weight="700" fill="var(--w-labeltx)">사암: 주로 모래</text><text x="576" y="84" font-size="17" font-weight="700" fill="var(--w-labeltx)">역암: 큰 자갈에 모래·진흙이 섞임</text></g>';
  const x=r.rec.rname;if(x&&x.ok)R6POS.forEach((p,i)=>{g+=mini(p[0],p[1]+82,['이암','사암','역암'][x.f[i]],20)});return g}
 return paper6({stk:1})}
/* 실험 4: 화석 */
function e4Scene(s){const r=R(),id=s.id;
 if(id==='gear')return bg({})+gearArt(4,has('gear'),fxOn('gear'));
 if(id==='paper'){const on=has('paper');if(!on)return bgTop()+boxArt(480);return paperF({paperAnim:fxOn('paper'),anim:fxOn('paper')})}
 if(id==='pred')return paperF({})+qmark(480,60);
 if(id==='loupe')return fosLoupe(curI('f'),{anim:!!UI.fx});
 if(id==='like')return likeScene(curI('k'),{anim:!!UI.fx});
 if(id==='kind'){const x=r.rec.kind,D=UI.draft.kind;return kindBoxes(x&&x.ok?x.f:D&&D.f?D.f:[],(r.seen.kb||fxOn('kb'))?(fxOn('kb')?'a':1):0)}
 return paperF({})}
/* 실험 5: 화석 모형 */
function e5Scene(s){const r=R(),id=s.id,st=r.st,f=UI.fx?UI.fx.id:null;
 if(id==='gear')return bg({})+gearArt(5,has('gear'),fxOn('gear'));
 if(id==='clay'){const on=has('clay');let g=bg({})+bowlArt({bag:on,bagAnim:fxOn('clay'),clay:on,clayAnim:fxOn('clay')});if(!on)g+=itemArtAt('clay',800,360)+itemArtAt('bag',160,360);return g}
 if(id==='press'){const on=has('press');let g=bg({})+bowlArt({bag:1,clay:1,imp:on,impAnim:fxOn('press')});g+=fxOn('press')?pressArt(1):shell(800,380,80);return g}
 if(id==='water'){const on=has('water');let g=bg({})+bowlArt({bag:1,clay:1,imp:1,water:on,waterAnim:fxOn('water')});if(fxOn('water'))g+='<g'+an('lb-a-fade',0)+'>'+beaker(640,170,-100,1.2,1)+'</g>';else if(!on)g+=beaker(800,360,0,1.2,1);return g}
 if(id==='plaster'){const on=has('plaster');let g=bg({})+bowlArt({bag:1,clay:1,imp:1,water:1,plaster:on,plasterAnim:fxOn('plaster')});if(!on)g+=itemArtAt('plaster',800,350);return g}
 if(id==='pred')return bg({})+bowlArt({bag:1,clay:1,imp:1,water:1,plaster:1})+qmark(480,120);
 if(id==='wait'){const n=st.w||0,hard=n>=1&&f!=='w1';let g=bg({})+bowlArt({bag:1,clay:1,imp:1,water:1,plaster:1,hard});
  if(f==='w1'||n>=1)g+=clockArt(780,150,f==='w1')+(NAR?'':'<text x="780" y="232" text-anchor="middle" font-size="20" font-weight="800" fill="var(--w-labeltx)">약 15분</text>');
  if(f==='w2'||n>=2)g+='<g'+(f==='w2'?an('lb-a-pat',0):'')+'><g transform="translate(560 '+(BW.b-CLAYH-44-34)+')"><rect x="-14" y="-60" width="28" height="64" rx="11" fill="#BFE0F2" stroke="#4F82A3" stroke-width="2.5"/></g></g>';
  return g}
 if(id==='open'){const n=st.op||0;
  if(n<2&&f!=='o2'){const L=n>=1||f==='o1';return bg({})+bowlArt({bag:1,clay:1,imp:1,water:1,plaster:1,hard:1,lift:L,liftAnim:f==='o1'})}
  const c=UI.mq.cur;let g=bgTop()+piecesArt({anim:f==='o2'});if(c==='oc')g+='<rect x="136" y="236" width="308" height="190" rx="16" fill="none" stroke="var(--lb-lens)" stroke-width="5" stroke-dasharray="12 8"/>';if(c==='op')g+='<rect x="516" y="236" width="308" height="190" rx="16" fill="none" stroke="var(--lb-lens)" stroke-width="5" stroke-dasharray="12 8"/>';return g}
 if(id==='cmp'){const c=UI.mq.cur;let g=bgTop()+modelShell(130,140,1.5)+realShell(530,140,1.5)+mini(280,420,'화석 모형',20)+mini(680,420,'조개 화석 표본',20);
  if(c==='sm')g+='<rect x="116" y="126" width="328" height="253" rx="18" fill="none" stroke="var(--lb-lens)" stroke-width="5" stroke-dasharray="12 8"/>';
  if(c==='sf')g+='<rect x="516" y="126" width="328" height="253" rx="18" fill="none" stroke="var(--lb-lens)" stroke-width="5" stroke-dasharray="12 8"/>';return g}
 return bg({})+bowlArt({bag:1,clay:1})}
const SCN={1:e1Scene,2:e2Scene,3:e3Scene,4:e4Scene,5:e5Scene};
function sceneSVG(){const v=V(),r=R(),s=curStep(),id=s.id,no=v.no;
 const T=(g,l,vb)=>svg(g+lensOf(s,g),l||s.t,vb);
 if(id==='tools'){const big=v.tools.length>8;if(!(r.done.tools||fxOn('tools')))return T(bg({})+boxArt(480),'준비물 상자',big?'-70 0 1100 540':null);return T(bg({})+toolsScene(v.tools,fxOn('tools')),'준비물: '+v.tools.map(x=>x[1]).join(', '),v.tools.length<=2?'200 120 560 320':big?'-70 30 1100 470':null)}
 const g=SCN[no](s);
 if(id==='gear')return T(g,s.t,'160 40 640 420');
 if(no===1)return T(g,s.t,'30 80 910 320');
 if(no===2)return T(g,s.t,id==='fill'||id==='wet'?'170 150 620 330':id==='real'?'40 50 880 400':'50 40 860 440');
 if(no===3)return T(g,s.t,id==='loupe'?'30 40 900 470':id==='sort'?'20 40 920 460':id==='name'?'60 0 900 470':'60 50 840 420');
 if(no===4)return T(g,s.t,id==='loupe'?'30 40 900 470':id==='like'?'90 110 790 360':id==='kind'?'40 20 880 490':'70 40 830 470');
 return T(g,s.t,id==='open'&&(R().st.op||0)>=2||id==='cmp'?'90 30 780 440':'160 30 680 430')}

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
function groupSum(F,f){const o=F[0].o;if(F.length<4||!F.every(x=>x.o.join()===o.join()))return null;
 const nm=j=>F[j].l.replace(/^(퇴적암|카드) /,'');
 return o.map((t,i)=>t+': '+(F.map((x,j)=>f[j]===i?nm(j):null).filter(Boolean).join(', ')||'없음')).join(' · ')}
function rowSum(row){const r=R(),R0=ROWS[row],x=r.rec[row]||{};
 if(R0.t==='sel'){const F=fOf(row),pre=R0.crit&&x.c?CRIT[x.c].t+' → ':'',gs=groupSum(F,x.f);if(gs)return pre+gs;return pre+F.map((f,i)=>(f.l?f.l+': ':'')+f.o[x.f[i]]).join(' · ')}
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
  const c2=F.length>=6?' lb-c2 lb-c6':F.every(f=>f.l.length<=7)?' lb-c2':'';
  const grid=F.length>=6&&c2&&!/c6/.test(c2);if(grid)h+='<div class="lb-cgrid">';
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
 if(s.id==='pour')return '① 붓고 싶은 컵을 하나 골라 눌러요. 남은 컵도 차례대로 부어요.';
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
 let h='<article class="lb-sheet lb-sh-e'+v.no+'" id="lbSheet" aria-label="실험 결과 한 장"><div class="lb-sh-in"><header class="lb-sh-h"><div><h2>실험 결과 한 장 · '+esc(v.title)+'</h2><span>탐구 실험관 · 5학년 1학기 과학 · 1. 지층과 화석 · '+ds+'</span></div><div class="lb-sh-name">이름 <u>'+(esc(DB.name)||'&nbsp;')+'</u></div></header><div class="lb-sh-grid"><div class="lb-sh-col">';
 h+='<section class="lb-sh-sec"><h3><i></i>실험 문제</h3><p><b>'+esc(v.q)+'</b></p>'+planSummary(v,r)+'</section>';
 h+='<section class="lb-sh-sec lb-sh-po"><h3><i></i>실험한 차례</h3><div class="lb-sh-steps">'+done.map((s,i)=>'<div><b>'+(i+1)+'.</b> '+esc(s.t)+'</div>').join('')+'</div></section>';
 h+='<section class="lb-sh-sec"><h3><i></i>내 예상</h3><p>'+v.pred.map((q,j)=>(v.pred.length>1?esc(q.q)+' ':'')+(r.pred[j]!=null?esc(q.o[r.pred[j]]):'(고르지 않았어요)')).join('<br>')+(r.why?'<br>까닭: '+esc(r.why):'')+'</p></section>';
 h+='</div><div class="lb-sh-col"><section class="lb-sh-sec"><h3><i></i>관찰 기록</h3>'+sheetTable(v,r)+barChart(v,r)+'</section>';
 /* 실험 1은 관찰 기록 줄이 일곱이라 결론을 아래 한 줄 전체로(오른쪽 칸만 길어져 2쪽이 되던 것, 독립 검토 고침) */
 const cs='<section class="lb-sh-sec'+(v.rows.length>=6?' lb-sh-wide':'')+'"><h3><i></i>내 결론</h3><div class="lb-sh-box"><p class="lb-sh-concl">'+frameHTML(v,r.bl,'sheet')+'</p>'+(r.cmp?'<p class="lb-sh-book">교과서 결론: '+esc(v.book)+'</p>':'')+'</div></section>';
 h+=(v.rows.length>=6?'':cs)+'</div></div>'+(v.rows.length>=6?cs:'')+picsHTML(snapList(v,r))+'<section class="lb-sh-sec lb-sh-po lb-sh-fill"><h3><i></i>새로 알게 된 것 · 더 알고 싶은 것</h3><div class="lb-sh-lines">'+'<div class="lb-ln"></div>'.repeat(9)+'</div></section>';
 h+='<footer class="lb-sh-f"><span>아주 단순하게 만든 모형의 결과예요. 실제 교실에서는 결과가 조금 다를 수 있어요.</span><span>만든 사람: 초등교사 홍지희</span></footer></div></article>';
 return h}
const LABNAME='strata';
function snapsOf(v,r){const L=[],no=v.no,S=(g,vb,cap)=>L.push([svg(g,cap,vb),cap]);const ok=k=>rowDone(k);
 if(no===1){S(cardsTable({face:()=>1,pen:()=>ok('shape'),noBig:1}),'40 108 512 250',ok('shape')?'층의 경계를 따라 선을 그은 지층 카드':'지층 카드 여섯 장')}
 if(no===2){const o=r.st.ord||[];if(o.length)S(bg({})+tankArt({water:.5,ord:o}),'300 90 360 360','우리 모둠 지층 모형');if(ok('oth'))S(bg({})+tankArt({water:.5,ord:OTHER}),'300 90 360 360','다른 모둠 지층 모형')}
 if(no===3){S(paper6({stk:1}),'90 100 780 340','퇴적암 ①~⑥');if(ok('see'))S(bgTop()+loupeView(1,150,150,120)+loupeView(0,430,150,120)+loupeView(2,710,150,120),'10 10 860 290','돋보기로 본 ②, ①, ③')}
 if(no===4){S(paperF({}),'90 90 790 390','여러 가지 화석')}
 if(no===5){if(ok('res'))S(bgTop()+piecesArt({}),'120 220 720 250','떼어 낸 찰흙과 석고');if(ok('cmpf'))S(bgTop()+modelShell(130,140,1.5)+realShell(530,140,1.5)+mini(280,420,'화석 모형',20)+mini(680,420,'조개 화석 표본',20),'100 120 760 330','화석 모형과 실제 조개 화석')}
 return L}
/* ───────── 결과 한 장: 관찰 그림 · 이미지로 복사/저장 ───────── */
function picsHTML(list){if(!list||!list.length)return '';
 return '<section class="lb-sh-sec lb-sh-picsec"><h3><i></i>관찰 그림</h3><div class="lb-sh-pics" style="--n:'+list.length+'">'+list.map(p=>'<figure class="lb-sh-pic">'+p[0]+'<figcaption>'+esc(p[1])+'</figcaption></figure>').join('')+'</div></section>'}
function snapList(v,r){const n0=NAR,l0=LEG;NAR=true;LEG=[];let L=[];try{L=snapsOf(v,r)}catch(e){L=[]}NAR=n0;LEG=l0;return L}
const SH_SKIP=/^(animation|transition|will-change|cursor|caret|scroll|overscroll|touch-action|user-select|-webkit-user|pointer-events|view-transition|content-visibility|contain-intrinsic)/;
function shInline(src,dst){const cs=getComputedStyle(src);let t='';
 if(src instanceof SVGElement){if(src.tagName.toLowerCase()==='svg'&&src.parentNode&&!(src.parentNode instanceof SVGElement)){for(const p of ['width','height','display','margin','vertical-align','max-width','max-height','box-sizing'])t+=p+':'+cs.getPropertyValue(p)+';'}
  for(const p of ['fill','fill-opacity','stroke','stroke-width','stroke-opacity','stroke-dasharray','stroke-linecap','stroke-linejoin','opacity','font-size','font-weight','font-family','text-anchor','dominant-baseline','paint-order','visibility','display','color']){const v=cs.getPropertyValue(p);if(/url\(/.test(v))continue;t+=p+':'+v+';'}}
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
 if(!DB.cur||!EXPS[DB.cur]){H.classList.remove('lb-inrun');$('#lbSub').textContent='5학년 1학기 과학 · 1단원 지층과 화석';$('#lbChoose').hidden=true;$('#lbClearMi').hidden=true;
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
 const N6=pre=>[1,2,3,4,5,6].map(i=>[pre+i,NUM[i-1]]),L3=pre=>[[pre+'1','맨 아래층'],[pre+'2','가운데 층'],[pre+'3','맨 위층']];
 switch(s.id){
  case 'view':cells('뒤집어 볼 카드',N6('v'));break;
  case 'pen':cells('선을 그을 카드',N6('p'));break;
  case 'pour':{const o=st.ord||[];MATK.forEach(k=>A.push({id:'p'+k,label:MAT[k].n+' 컵',cell:1,grp:'부을 컵',pressed:false,seen:o.indexOf(k)>=0,dis:busy||o.indexOf(k)>=0}));A.push({id:'trickle',label:'조금씩 나누어 붓기',sub:1,dis:busy||o.length>=3});break}
  case 'layers':cells('들여다볼 층',L3('l'));break;
  case 'other':cells('들여다볼 층',L3('o'));break;
  case 'real':cells('살펴볼 그림',[['rm','우리 지층 모형'],['rr','실제 지층']]);break;
  case 'color':cells('살펴볼 퇴적암',N6('c'));break;
  case 'touch':cells('만져 볼 퇴적암',N6('t'));A.push({id:'bump',label:'퇴적암끼리 부딪쳐 보기',sub:1,dis:busy});break;
  case 'loupe':if(V().no===3)cells('돋보기로 볼 퇴적암',N6('l'));else cells('돋보기로 볼 화석',FOS.map((x,i)=>['f'+(i+1),x.n]));break;
  case 'sort':A.push({id:'bx',label:'나눌 상자 세 개 펼치기',icon:'box',dis:busy||!!r.seen.bx});break;
  case 'name':A.push({id:'nm',label:'교과서 문장 읽기',icon:'text',dis:busy||!!r.seen.nm});break;
  case 'like':cells('견주어 볼 화석',FOS.map((x,i)=>['k'+(i+1),x.n]));break;
  case 'kind':A.push({id:'kb',label:'나눌 상자 두 개 펼치기',icon:'box',dis:busy||!!r.seen.kb});break;
  case 'wait':seqActs(A,'w',['w1','w2'],['석고가 굳기를 기다리기','손으로 살짝 눌러 보기'],busy);A.push({id:'early',label:'굳기 전에 바로 꺼내기',sub:1,dis:busy});break;
  case 'open':{seqActs(A,'op',['o1','o2'],['비닐봉지째 들어 꺼내기','찰흙과 석고 떼어 내기'],busy);const ok=(st.op||0)>=2;
   [['oc','찰흙'],['op','석고']].forEach(x=>A.push({id:x[0],label:x[1],cell:1,grp:'살펴볼 것',pressed:UI.mq.cur===x[0]&&!busy,seen:!!r.seen[x[0]],dis:busy||!ok}));break}
  case 'cmp':cells('살펴볼 것',[['sm','화석 모형'],['sf','조개 화석 표본']]);break}
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
function introPic(no,k){const n0=NAR,l0=LEG;NAR=true;LEG=[];let g=bgTop(),vb='0 0 960 540';
 if(no===1){vb='30 80 910 320';
  if(k==='spread')g=cardsTable({noBig:1});
  if(k==='view'){g=bgTop()+cardArt(2,180,150,280,175,{})+'<path d="M500 230 q70 -60 140 0" stroke="var(--lb-sci)" stroke-width="7" fill="none"/><path d="M628 214 l14 18 l-22 4" stroke="var(--lb-sci)" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'+magnifier(760,260,1.6,0);vb='140 110 740 300'}
  if(k==='pen'){g=bgTop()+blankCard(250,140,400,250)+'<path d="M266 260 H600" stroke="#1d2b8f" stroke-width="5" stroke-linecap="round" stroke-dasharray="14 10"/>'+penArt(640,250,40,1.2)+qmark(450,200);vb='200 100 560 330'}
  if(k==='sort'){g=bgTop()+trayArt(60,180,'?')+trayArt(360,180,'?')+trayArt(660,180,'?');vb='40 150 880 210'}}
 if(no===2){vb='50 40 860 440';
  if(k==='water')g=bg({})+tankArt({water:.25})+beaker(TX+TW/2+80,TY-30,-100,1.3,1);
  if(k==='fill'){g=bigCups({fill:1});vb='170 150 620 330'}
  if(k==='wet'){g=bigCups({fill:1,water:1});vb='170 150 620 330'}
  if(k==='pour')g=bg({})+tankArt({water:.25})+pourArt('s').replace(/ class="lb-a [^"]*" style="[^"]*"/g,'')+qmark(480,300)}
 if(no===3){vb='60 50 840 420';
  if(k==='paper')g=paper6({stk:1});
  if(k==='touch'){const p=R6POS[1];g=paper6({stk:1,hl:1})+cotton(p[0]+40,p[1]-30,-100,1.1)}
  if(k==='loupe')g=paper6({stk:1})+magnifier(480,210,2.2,0);
  if(k==='sort'){g=sortBoxes([],1);vb='20 210 920 270'}}
 if(no===4){vb='70 40 830 470';
  if(k==='paper')g=paperF({});
  if(k==='loupe')g=paperF({})+magnifier(480,190,2.4,0);
  if(k==='like'){g=likeScene(null);vb='90 110 790 300'}
  if(k==='kind'){g=kindBoxes([],1);vb='40 180 880 320'}}
 if(no===5){vb='160 30 680 430';g=bg({});
  if(k==='clay')g+=bowlArt({bag:1,clay:1});
  if(k==='press')g+=bowlArt({bag:1,clay:1})+pressArt(0).replace('translate(480 80)','translate(480 230)').replace(shell(480,150-28,80),shell(480,272,80));
  if(k==='plaster')g+=bowlArt({bag:1,clay:1,water:1,plaster:1})+itemArtAt('plaster',800,330);
  if(k==='open')g+=bowlArt({bag:1,clay:1,water:1,plaster:1,hard:1,lift:1})+qmark(480,330)}
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
 if(no===1){g=cardsTable({noBig:1})+penArt(760,330,30,1.2);vb='40 100 820 300'}
 if(no===2){g=modelScene({water:.25});vb='60 90 840 380'}
 if(no===3){g=paper6({stk:1});vb='90 100 780 340'}
 if(no===4){g=paperF({});vb='90 90 790 390'}
 if(no===5){g=bg({})+bowlArt({bag:1,clay:1})+shell(780,380,80);vb='200 170 680 300'}
 const s=svg(g,'실험 '+no+' 처음 모습',vb);NAR=false;LEG=[];return s}
function homeHTML(){const card=k=>{const v=EXPS[k],r=DB.runs[k];const st=r?(r.fin?'끝냄 · 결과 보기':(r.step+1)+'단계부터 이어서'):'실험 시작하기';
 return '<section class="lb-exc" aria-labelledby="lbE'+v.no+'"><div class="lb-exc-art">'+homeArt(v.no)+'</div><div class="lb-exc-b"><h2 id="lbE'+v.no+'"><em>실험 '+v.no+'</em>'+esc(v.name)+'</h2><p class="lb-exp">'+esc(v.sub)+'</p><button type="button" class="lb-pickb" data-pick="'+k+'" data-f="k'+k+'"><i>'+ic(['','cards','layers','rock','eye','shell'][v.no])+'</i><span><b>'+st+'</b><span>'+(v.no===1||v.no===4?'교과서 관찰':'교과서 실험')+'</span></span>'+(r&&r.fin?'<small>'+ic('check')+'</small>':'')+'</button></div></section>'};
 return '<div class="lb-home"><div class="lb-home-h"><div class="lb-kick"><em>5학년 1학기 과학</em>1. 지층과 화석</div><h1>무엇을 실험할까요?</h1><p>실험을 한 단계씩 직접 해 보고, 내 눈으로 본 것을 기록해요.</p></div>'+
 '<div class="lb-ex lb-ex5">'+['e1','e2','e3','e4','e5'].map(card).join('')+'</div>'+
 '<p class="lb-model">'+ic('info')+'<span>아주 단순하게 만든 모형이에요. 같은 조건이면 언제나 같은 결과가 나와요. 관찰 결과는 교과서·지도서 예시와 같고, 실제 실험에서는 조금씩 다를 수 있어요. 지층 카드·퇴적암·화석은 교과서 사진 대신 그린 그림이고, 사각 통에 쌓인 층의 두께와 다른 모둠 모형의 차례, 석고가 굳기를 기다리는 시간은 이 실험관에서 정한 모습이에요.</span></p></div>'}
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
 const SUB={trickle:SAFE.once,bump:SAFE.rock,early:'석고가 다 굳기 전에 꺼내면 모양이 망가져요. 손으로 살짝 눌러 굳었는지 먼저 알아봐요.'};
 if(SUB[id]){fx(id,1100,()=>flash(SUB[id]));return}
 if((id==='oc'||id==='op')&&(st.op||0)<2){flash('먼저 꺼내서 떼어 내요.','info');return}
 r.act[s.id]=1;if(idxOf('pred')>=0&&r.step>idxOf('pred'))r.obs=1;
 const done=()=>{r.seen[id]=1};
 const seq=(key,ids,ms)=>{const i=ids.indexOf(id),c=st[key]||0;if(i<0||c!==i)return true;fx(id,ms,()=>{st[key]=i+1;r.seen[id]=1});return true};
 if(/^p(gs|s|m)$/.test(id)){const k=id.slice(1);st.ord=st.ord||[];if(st.ord.indexOf(k)>=0)return;fx(id,2600,()=>{st.ord.push(k);r.seen[id]=1});return}
 if(id==='w1'||id==='w2'){seq('w',['w1','w2'],id==='w1'?2200:1100);return}
 if(id==='o1'||id==='o2'){UI.mq.cur=null;seq('op',['o1','o2'],1800);return}
 if(id==='bx'||id==='kb'||id==='nm'){fx(id,1000,done);return}
 UI.mq.cur=id;fx(id,id[0]==='p'&&V().no===1?1700:1000,done)}
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
