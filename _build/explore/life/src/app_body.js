
/* ───────── 기록(이 기기에만) ───────── */
const KEY='hj-life-v2';
function blank(){return {v:2,runs:{},cur:null,ui:{open:false,big:false},name:''}}
function load(){try{const s=JSON.parse(localStorage.getItem(KEY)||'null');if(s&&s.v===2&&s.runs){const o=Object.assign(blank(),s);
 Object.keys(o.runs).forEach(k=>{const r=o.runs[k];if(!VARS[k]||!r||r.planChk!==undefined||(k.startsWith('kale')&&Object.values(r.rec||{}).some(x=>x&&x[0]&&x[0].n!=null)))o.runs[k]=newRun();else o.runs[k]=Object.assign(newRun(),r)});return o}}catch(e){}return blank()}
let DB=load();
function save(){try{localStorage.setItem(KEY,JSON.stringify(DB))}catch(e){}}
function newRun(){return {step:0,max:0,done:{},plan:{},planLast:null,planOk:false,p:null,pred:null,why:'',dk:0,care:{},rec:{},tries:{},last:{},bl:[],clast:null,ctry:0,cmp:false,fin:false}}

/* ───────── 화면 상태(저장 안 함) ───────── */
const UI={anim:null,nonce:0,timer:0,marks:[[],[]],cnt:[0,0],km:[{},{}],fb:null,hint:null,kwrong:null,focus:0,tween:null,grow:false,care:false,menu:false,rail:false,speaking:false,toast:'',lens:0};
function resetUI(){clearTimeout(UI.timer);UI.pop=null;UI.anim=null;UI.marks=[[],[]];UI.cnt=[0,0];UI.km=[{},{}];UI.fb=null;UI.hint=null;UI.kwrong=null;UI.focus=0;UI.tween=null;UI.grow=false;UI.care=false;UI.rail=false;UI.toast='';UI.lens=0;stopSay()}
const V=()=>VARS[DB.cur],R=()=>DB.runs[DB.cur];
const days=v=>v.exp==='kale'?KDAYS:SDAYS;
const narrow=()=>innerWidth<=820;
function pIdx(){const r=R();return r&&r.p!=null?r.p:0}
function cOf(v,cup){return cup===pIdx()?v.cA:v.cB}
function labOf(v,cup){const r=R();return r.p==null?'?':v.lab[cup===r.p?0:1]}
function shortOf(v,cup){const r=R();return r.p==null?'':v.short[cup===r.p?0:1]}
function ansOf(v,i){const a=v.ans[i];return a==='@P'?(pIdx()?'나':'가'):a}
const L2=c=>c?'나':'가';
function endP(t){t=String(t).trim();return /[.?!]$/.test(t)?t:t+'.'}

/* ───────── 단계 판단 ───────── */
function stepOf(i){const v=V();return stepDef(v,v.steps[i])}
function idxOf(id){return V().steps.indexOf(id)}
function has(id){const r=R(),k=idxOf(id);if(k<0)return false;return k<r.step||(k===r.step&&(!!r.done[id]||UI.anim===id))}
function isDone(i){const r=R(),s=stepOf(i);
 if(s.k==='scene')return !!r.done[s.id];
 if(s.k==='plan')return r.planOk;
 if(s.k==='pred')return r.pred!=null;
 if(s.k==='obs')return !!r.done.obs;
 if(s.k==='concl')return !!r.cmp;
 return !!r.fin}
function canNext(){const r=R();return r.step<V().steps.length-1&&isDone(r.step)&&!UI.anim&&!UI.tween}
function canGo(i){const r=R();return i>=0&&i<V().steps.length&&(i<=r.max||DB.ui.open||(i===r.max+1&&isDone(r.max)))}
function go(i,focusHead){if(!canGo(i))return;const r=R();r.step=i;r.max=Math.max(r.max,i);resetUI();enterStep();save();render();if(focusHead!==false){const h=$('#lbH1');if(h)h.focus({preventScroll:true})}}
function enterStep(){const v=V(),r=R(),s=stepOf(r.step);
 if(s.k==='obs'&&v.exp==='seed'&&!r.rec[0])r.rec[0]=[0,0];
 if(s.k==='sheet')r.fin=!!(r.cmp&&r.done.obs);
 if(s.k==='concl'&&!r.bl.length)r.bl=v.ans.map(()=>'');
 if(s.k==='concl')UI.focus=Math.max(0,r.bl.findIndex(x=>!x))}
function predLocked(){const r=R(),k=idxOf('obs');return r.max>=k&&(Object.keys(r.rec).length>1||r.dk>0||(V().exp==='kale'&&!!r.rec[0]))}

/* ───────── 장면 ───────── */
function seedPos(v){return v.cond==='temp'?[290,530]:[420,720]}
function vb(desk,nar){return NAR?nar:desk}
function sceneSVG(){const v=V(),r=R(),s=stepOf(r.step),id=s.id,A=UI.anim===id;
 if(v.exp==='kale')return kaleScene(v,r,s,A);
 const known=r.p!=null&&has(v.dec);
 if(id==='tools'){const L=[['small','작은 컵 2개'],['wick','부직포 심지 2개'],['felt','원 모양 부직포 2개'],['big','큰 컵 2개'],['water','물'],['seeds','무씨']];
  if(v.cond!=='water')L.push(['box',v.cond==='temp'?'어둠상자 2개':'어둠상자 1개']);
  if(!(r.done.tools||A))return svg(bg({win:v.cond!=='temp',sun:false})+boxArt(480),'준비물 상자');
  return svg(bg({win:false})+toolsScene(L,A),'준비물: '+L.map(x=>x[1]).join(', '))}
 if(s.k==='obs'||s.k==='concl'){const d=s.k==='concl'?5:days(v)[r.dk];let g=bg({});
  const cups=NAR?[UI.lens]:[0,1];
  cups.forEach(cup=>{const cx=cup?690:270,c=cOf(v,cup);
   g+=lens(cx,212,c,d,cup,{marks:s.k==='obs'?UI.marks[cup]:[],count:s.k==='obs'&&!r.rec[r.dk],grow:UI.grow,care:UI.care&&!!c.water,hint:UI.hint&&UI.hint[0]===cup?UI.hint[1]:null,pop:UI.pop&&UI.pop[0]===cup?UI.pop[1]:null});
   g+=plate(cx,L2(cup),labOf(v,cup),364);
   g+=bubble(cx,446,seedTxt(c,d))});
  const cx=UI.lens?690:270;
  return svg(g,d+'일째 두 컵의 무씨를 돋보기로 본 모습',NAR?(cx-150)+' 66 300 300':'110 64 740 420')}
 const [xa,xb0]=seedPos(v),q=1-pIdx();
 const inFr=v.cond==='temp'&&(has('fridge'));
 let g=bg({win:v.cond!=='temp',sx1:300,sx2:840});
 if(v.cond==='temp')g+=fridge();
 const pv=s.k==='plan';
 [0,1].forEach(cup=>{let cx=cup?xb0:xa;const c=cOf(v,cup),wc=!!c.water;
  const o={wick:pv||has('wick'),lie:pv||has('felt'),felt:pv||has('felt'),water:has('water')&&wc,nest:pv||has('nest'),seeds:has('seed')?10:0};
  if(v.cond==='water'&&!known)o.water=false;
  o.wet=o.nest&&o.water;
  if(A){if(id==='wick')o.aWick=1;if(id==='felt')o.aFelt=1;if(id==='water'&&o.water)o.aWater=.75;if(id==='nest'){o.aNest=1;if(o.wet)o.aWet=1.5}if(id==='seed')o.aSeed=1}
  if(id==='water'&&r.step===idxOf('water'))o.small=false;
  const fr=inFr&&cup===q;
  if(fr)cx=800;
  let inner=rig(cx,o);
  const boxed=(v.cond==='light'&&cup===q&&known)||(v.cond==='temp'&&has('boxes'));
  if(boxed)inner+=darkBox(cx,BY,A&&(id==='darkbox'||id==='boxes')?.15:0,fr);
  if(fr)inner='<g transform="translate('+cx+' 438) scale(.74) translate('+(-cx-8)+' -436)">'+inner+'</g>';
  if(A&&id==='place')inner='<g'+an('lb-a-slide',0,'--dx:'+(cup?140:-140)+'px')+'>'+inner+'</g>';
  if(A&&id==='fridge'&&fr)inner='<g'+an('lb-a-move',0,'--dx:'+((cup?xb0:xa)-800)+'px')+'>'+inner+'</g>';
  g+=inner});
 if(v.cond==='temp'){if(A&&id==='fridge')g+=fridgeDoorOpen(an('lb-a-doorB',0))+fridgeDoor(an('lb-a-doorA',0));else g+=fridgeDoor()}
 [0,1].forEach(cup=>{const cx=inFr&&cup===q?800:cup?xb0:xa;g+=plate(cx,L2(cup),known?labOf(v,cup):'?')});
 if(A&&id==='water'){[0,1].forEach(cup=>{const cx=cup?xb0:xa;if(!cOf(v,cup).water)return;g+=pitcher(cx+92,150,true,-42)+stream('M'+(cx+46)+' 118 Q'+(cx+20)+' 190 '+(cx+6)+' '+(BY-70),0)})}
 if(A&&id==='seed')[xa,xb0].forEach(cx=>{g+=packet(cx+40,120,0)});
 if((id==='place'||id==='darkbox')&&(A||r.done[id]))g+='<g'+(A?an('lb-a-pop',.9):'')+'>'+bubble(570,80,v.cond==='light'?'같은 곳 · 같은 온도':'같은 곳 · 같은 온도와 빛','var(--lb-sci)')+'</g>';
 if(pv)g+=qmark(xa,200,A_COL)+qmark(xb0,200,B_COL);
 if(s.k==='pred')g+=qmark(xa,96,A_COL)+qmark(inFr&&q===1?800:xb0,96,B_COL);
 if(id==='wick'&&(A||r.done.wick))g+='<g'+(A?an('lb-a-fade',.9):'')+'>'+bubble(xa,60,'구멍에 심지를 끼워요')+'</g>';
 return svg(g,s.t,v.cond==='temp'?vb('150 26 810 516','170 30 790 440'):vb('190 26 760 500','290 40 580 440'))}
function boxArt(x){return '<g transform="translate('+x+' 300)"><path d="M-130 -60 L-100 -96 H150 L120 -60Z" fill="var(--w-kraft-s)"/><rect x="-130" y="-60" width="250" height="196" rx="8" fill="var(--w-kraft)" stroke="var(--w-kraft-s)" stroke-width="2"/><path d="M120 -60 L150 -96 V100 L120 136Z" fill="var(--w-kraft-s)"/>'+(NAR?'':'<rect x="-60" y="-10" width="110" height="44" rx="8" fill="var(--w-label)"/><text x="-5" y="20" text-anchor="middle" font-size="22" font-weight="800" fill="var(--w-labeltx)">준비물</text>')+'</g>'}
function kaleScene(v,r,s,A){const id=s.id,L=v.cond==='light',known=r.p!=null&&has(v.dec),q=1-pIdx(),p=pIdx();
 if(id==='ktools'){const it=[['kale','케일 화분 2개'],['tag','이름표'],['can','물뿌리개']];if(L)it.push(['shade','햇빛 차단 장치']);
  if(!(r.done.ktools||A))return svg(bg({win:true,sun:false})+boxArt(560),'준비물 상자');
  return svg(bg({win:false})+toolsScene(it,A),'준비물: '+it.map(x=>x[1]).join(', '))}
 const xs=[370,660];
 let d=0;if(s.k==='obs')d=UI.tween?UI.tween.d:KDAYS[r.dk];if(s.k==='concl')d=14;
 let g=bg({win:true,sx1:260,sx2:820});
 const placed=has('kplace'),tags=has('ktag');
 const canAt=(x,dl)=>can(x+150,190,true,dl)+stream('M'+(x+66)+' 150 Q'+(x+40)+' 220 '+(x+14)+' 330',dl);
 [0,1].forEach(cup=>{const cx=xs[cup],c=cOf(v,cup),k=kaleAt(c,d);
  const wA=A&&((id==='kwater'&&cup===p)||id==='kwater2')?(id==='kwater2'?(cup?1.9:.9):.9):0;
  let inner=pot(cx,{dry:!c.water&&d>=3,wetA:wA})+kale(cx,338,k);
  if(tags)inner+=tag(cx,L2(cup),A&&id==='ktag'?.2+cup*.25:0);
  if(!placed&&id==='kplace'&&!A)inner='<g transform="translate('+(cup?150:-150)+' 0)">'+inner+'</g>';
  if(A&&id==='kplace')inner='<g'+an('lb-a-slide',0,'--dx:'+(cup?150:-150)+'px')+'>'+inner+'</g>';
  g+=inner;
  if(tags||s.k==='plan')g+=plate(cx,L2(cup),known?labOf(v,cup):'?')});
 if(L&&known&&s.k!=='obs'&&s.k!=='concl')g+=shade(xs[q],{anim:A&&id==='kshade'?.15:0,lift:A&&id==='kwater2'?.01:0});
 if(A&&id==='kwater')g+=canAt(xs[p],0);
 if(A&&id==='kwater2')g+=canAt(xs[0],0)+canAt(xs[1],1.1);
 if(s.k==='obs'&&UI.care){if(v.cond==='light')g+=canAt(xs[0],0)+canAt(xs[1],1);else g+=canAt(xs[p],0)}
 if(id==='kplace'&&(A||r.done.kplace))g+='<g'+(A?an('lb-a-pop',.9):'')+'>'+bubble(515,112,L?'같은 곳 · 같은 온도와 바람':'같은 곳 · 같은 햇빛과 온도','var(--lb-sci)')+'</g>';
 if(s.k==='plan')g+=qmark(xs[0],120,A_COL)+qmark(xs[1],120,B_COL);
 if(s.k==='pred')g+=qmark(xs[0],120,A_COL)+qmark(xs[1],120,B_COL);
 return svg(g,s.k==='obs'?Math.round(d)+'일째 두 케일의 모습':s.t,vb('220 70 620 470','230 90 600 400'))}

/* ───────── 오른쪽 카드 ───────── */
function cardHead(t,s){return '<div class="lb-card-h"><span class="lb-clip">'+ic('clip')+'</span><div><b>'+t+'</b><span>'+s+'</span></div></div>'}
function wrapB(h){return '<div class="lb-card-b"><div class="lb-fit">'+h+'</div></div>'}
function planChanged(r){if(!r.planLast)return true;return V().plan.some(p=>r.plan[p[0]]!==r.planLast[p[0]])}
function planCard(){const v=V(),r=R();let h='<p class="lb-q">'+esc(v.q)+'</p><p class="lb-hint">조건마다 \'다르게\'나 \'같게\'를 골라요.</p><div role="group" aria-label="조건 고르기">';
 v.plan.forEach(([k,n,icn,isVar])=>{const c=r.plan[k];let cls='',msg='';
  if(r.planLast&&c&&r.planLast[k]===c){const ok=(isVar?'d':'s')===c;cls=ok?' lb-ok':' lb-no';
   if(!ok)msg='<p>'+ic('x')+'<span>'+(isVar?jo(n.replace(/\(.*\)/,''),'은','는')+' 알아보려는 조건이에요.':'이것도 다르면 무엇 때문인지 알 수 없어요.')+'</span></p>'}
  h+='<div class="lb-crow'+cls+'"><span>'+ic(icn)+esc(n)+'</span><span class="lb-seg" role="group" aria-label="'+esc(n)+'"><button type="button" class="lb-d" data-f="p'+k+'d" data-plan="'+k+':d" aria-pressed="'+(c==='d')+'">다르게</button><button type="button" class="lb-s" data-f="p'+k+'s" data-plan="'+k+':s" aria-pressed="'+(c==='s')+'">같게</button></span>'+msg+'</div>'});
 h+='</div>';
 if(r.planLast&&!planChanged(r)){const nd=v.plan.filter(p=>r.plan[p[0]]==='d').length;let m;
  if(r.planOk){const vn=v.plan.find(p=>p[3])[1].replace(/\(.*\)/,'');m='<div class="lb-msg lb-good">'+ic('check')+'<span>좋아요. '+jo(vn,'만','만')+' 다르게 하고 나머지는 같게 해요.</span></div>'}
  else if(nd===0)m='<div class="lb-msg lb-try">'+ic('info')+'<span>모두 같게 하면 비교할 수 없어요. 한 가지를 다르게 해요.</span></div>';
  else if(nd>1)m='<div class="lb-msg lb-try">'+ic('info')+'<span>두 가지 넘게 다르면 무엇 때문인지 알 수 없어요.</span></div>';
  else m='<div class="lb-msg lb-try">'+ic('info')+'<span>빨간 줄을 다시 생각해 봐요.</span></div>';
  h+='<div aria-live="polite">'+m+'</div>'}
 return cardHead('실험 계획','다르게 할 조건 · 같게 할 조건')+wrapB(h)}
function predCard(){const v=V(),r=R(),lock=predLocked();let h='<p class="lb-q">'+esc(stepOf(r.step).t)+'</p><div class="lb-opts" role="group" aria-label="예상 고르기">';
 v.pred.forEach((t,i)=>{h+='<button type="button" class="lb-opt" data-f="o'+i+'" data-pred="'+i+'" aria-pressed="'+(r.pred===i)+'"'+(lock?' disabled':'')+'><i>'+(r.pred===i?ic('check'):'')+'</i><span>'+esc(t)+'</span></button>'});
 h+='</div><div><label class="lb-label" for="lbWhy">그렇게 생각한 까닭 (쓰고 싶으면)</label><input id="lbWhy" class="lb-input" maxlength="60" placeholder="왜냐하면 ~ 때문이에요." value="'+esc(r.why)+'"'+(lock?' readonly':'')+'></div>';
 if(lock)h+='<div class="lb-msg lb-plain">'+ic('lock')+'<span>관찰을 시작해서 예상을 바꿀 수 없어요.</span></div>';
 else if(r.pred!=null)h+='<div class="lb-msg lb-plain" aria-live="polite">'+ic('info')+'<span>예상을 남겼어요. 맞히기가 아니라 내 생각이에요.</span></div>';
 return cardHead('내 예상','고른 예상은 결과 한 장에 남아요')+wrapB(h)}
function obsCard(){const v=V(),r=R(),D=days(v),k=r.dk,d=D[k],rec=r.rec[k],last=k===D.length-1,K=v.exp==='kale';
 const dn=d===0?'시작한 날':d+'일째';
 let h='<ol class="lb-todo" aria-label="오늘 할 일">';
 const st1=rec?'lb-ok':'lb-cur',st2=!rec||last?'':(r.care[k]?'lb-ok':'lb-cur'),st3=rec&&!last&&r.care[k]?'lb-cur':'';
 h+='<li class="'+st1+'"><i>'+(rec?ic('check'):1)+'</i>'+(K&&d===0?'처음 모습 보기':'기록하기')+'</li>';
 if(!last)h+='<li class="'+st2+'"><i>'+(r.care[k]?ic('check'):2)+'</i>'+(K?'물 주기':'물 살피기')+'</li><li class="'+st3+'"><i>3</i>'+advLabel(v)+'</li>';
 else h+='<li class="'+(rec?'lb-cur':'')+'"><i>2</i>결론 쓰기로</li>';
 h+='</ol>';
 if(!rec){
  if(K&&d===0){h+='<p class="lb-hint" style="margin:0">두 케일의 처음 모습을 잘 봐 두어요. 잎의 크기와 색깔, 줄기의 굵기가 비슷해요.</p><button type="button" class="lb-rec-btn" data-f="rec" data-act="base">'+ic('eye')+'처음 모습을 봤어요</button>'}
  else if(K){const A=kAttrs(v);
   h+='<p class="lb-hint" style="margin:0">처음 모습과 견주어 골라요.</p><table class="lb-km"><thead><tr><th scope="col"><span class="lb-sr">항목</span></th><th scope="col"><i class="lb-pin lb-a">가</i></th><th scope="col"><i class="lb-pin lb-b">나</i></th></tr></thead><tbody>';
   A.forEach(([key,n,full,opts])=>{h+='<tr><th scope="row">'+n+'</th>'+[0,1].map(cup=>{const val=UI.km[cup][key];const wr=UI.kwrong&&UI.kwrong.indexOf(cup+':'+key)>=0;
    return '<td><span class="lb-seg lb-kseg'+(wr?' lb-wrongc':'')+'" role="group" aria-label="'+L2(cup)+' '+n+'">'+opts.map((o,i)=>'<button type="button" aria-label="'+L2(cup)+' '+n+': '+full[i]+'" data-f="k'+cup+key+i+'" data-km="'+cup+':'+key+':'+i+'" aria-pressed="'+(val===i)+'" class="'+(i?'lb-d':'lb-s')+'">'+o+'</button>').join('')+'</span></td>'}).join('')+'</tr>'});
   h+='</tbody></table>';
   const ready=[0,1].every(cup=>A.every(a=>UI.km[cup][a[0]]!=null));
   h+='<button type="button" class="lb-rec-btn" data-f="rec" data-act="rec"'+(ready?'':' disabled')+'>'+ic('check')+'기록하기</button>'}
  else{h+='<p class="lb-hint" style="margin:0">떡잎이 보이면 싹 튼 씨예요. 그림 속 씨를 누르면 번호가 붙어요.</p>';
   if(narrow())h+='<div class="lb-lenst" role="group" aria-label="볼 컵">'+[0,1].map(c=>'<button type="button" data-f="ln'+c+'" data-lens="'+c+'" aria-pressed="'+(UI.lens===c)+'">'+L2(c)+' 컵 보기</button>').join('')+'</div>';
   [0,1].forEach(cup=>{const Lt=L2(cup),cl=cup?'lb-b':'lb-a',val=UI.cnt[cup];
    h+='<div class="lb-count '+cl+'"><i class="lb-pin">'+Lt+'</i><span>싹 튼 씨</span><span class="lb-step"><button type="button" data-f="m'+cup+'" data-cnt="'+cup+':-1" aria-label="'+Lt+' 싹 튼 씨 하나 빼기"'+(val<=0?' disabled':'')+'>'+ic('minus')+'</button><output aria-live="polite" aria-label="'+Lt+' 싹 튼 씨의 수">'+val+'</output><button type="button" data-f="p'+cup+'" data-cnt="'+cup+':1" aria-label="'+Lt+' 싹 튼 씨 하나 더하기"'+(val>=10?' disabled':'')+'>'+ic('plus')+'</button></span></div>'});
   h+='<button type="button" class="lb-rec-btn" data-f="rec" data-act="rec">'+ic('check')+'기록하기</button>'}}
 if(UI.fb)h+='<div class="lb-msg '+(UI.fb[0]?'lb-good':'lb-try')+'" role="status">'+ic(UI.fb[0]?'check':'info')+'<span>'+UI.fb[1]+'</span></div>';
 if(!K||rec)h+=recTable(v,r,k);
 return cardHead(dn+' 관찰',K?'잎의 크기 · 잎의 색깔 · 줄기':'싹 튼 씨의 수')+wrapB(h)}
function careLabel(v){const P=L2(pIdx());if(v.exp==='kale')return v.cond==='water'?P+' 화분에만 물 주기':'두 화분에 물 주기';return v.cond==='water'?P+' 큰 컵 물 살피기':'두 큰 컵 물 살피기'}
function advLabel(v){const r=R(),D=days(v),k=r.dk;if(k>=D.length-1)return '하루 지나기';const n=D[k+1]-D[k];return n===1?'하루 지나기':n+'일 지나기'}
function kShort(v,x,cup){if(x==='base')return '처음';const o=x[cup];return kAttrs(v).map(a=>a[3][o[a[0]]]).join(' · ')}
function recTable(v,r,cur){const D=days(v),K=v.exp==='kale';
 if(K){let h='<table class="lb-tbl lb-ktbl"><caption class="lb-sr">관찰 기록표</caption><thead><tr><th scope="col">날</th><th scope="col">가</th><th scope="col">나</th></tr></thead><tbody>';
  D.forEach((d,i)=>{const x=r.rec[i];h+='<tr'+(i===cur?' class="lb-now"':'')+'><th scope="row">'+(d===0?'시작':d+'일')+'</th>'+[0,1].map(c=>'<td>'+(x?kShort(v,x,c):'·')+'</td>').join('')+'</tr>'});
  return h+'</tbody></table>'}
 let h='<table class="lb-tbl"><caption class="lb-sr">관찰 기록표</caption><thead><tr><th scope="col">날</th>'+D.map((d,i)=>'<th scope="col"'+(i===cur?' class="lb-now"':'')+'>'+(d===0?'시작':d)+'</th>').join('')+'</tr></thead><tbody>';
 [0,1].forEach(cup=>{h+='<tr><th scope="row"><span class="lb-dot '+(cup?'lb-b':'lb-a')+'"></span>'+L2(cup)+'</th>'+D.map((d,i)=>{const x=r.rec[i];
  if(!x)return '<td class="'+(i===cur?'lb-now ':'')+'lb-na">·</td>';return '<td'+(i===cur?' class="lb-now"':'')+'>'+x[cup]+'</td>'}).join('')+'</tr>'});
 return h+'</tbody></table>'}
function cWrong(v,r,i){return !!(r.clast&&r.bl[i]&&r.bl[i]===r.clast[i]&&r.bl[i]!==ansOf(v,i))}
function cChanged(r){return !r.clast||r.bl.some((w,i)=>w!==r.clast[i])}
function frameHTML(v,bl,mode){const r=R();let t=esc(v.frame);
 return t.replace(/\{(\d)\}/g,(m,i)=>{i=+i;const w=bl[i]||'',J=v.jo[i];
  let s;if(mode==='edit'){const st=w?' lb-fill':'';const f=UI.focus===i?' lb-focus':'';const wr=cWrong(v,r,i)?' lb-wrong':'';
   s='<button type="button" class="lb-blank'+st+f+wr+'" data-f="b'+i+'" data-blank="'+i+'" aria-label="빈칸 '+(i+1)+(w?': '+w:': 비어 있음')+(wr?', 다시 생각해 봐요':'')+'">'+(w?esc(w):'&#8203;')+'</button>'}
  else s=w?'<mark>'+esc(w)+'</mark>':'<span class="lb-sh-gap">______</span>';
  if(J)s+=w?(jo(w,J[0],J[1]).slice(w.length)):J[0]+'('+J[1]+')';return s})}
function conclCard(){const v=V(),r=R();let h='';
 if(r.pred!=null)h+='<div class="lb-mine"><b>내 예상</b> '+esc(v.pred[r.pred])+'</div>';
 h+='<p class="lb-frame">'+frameHTML(v,r.bl,'edit')+'</p>';
 h+='<div class="lb-chips" role="group" aria-label="낱말 카드">'+v.chips.map((c,i)=>'<button type="button" class="lb-chip" data-f="c'+i+'" data-chip="'+i+'">'+esc(c)+'</button>').join('')+'</div>';
 if(r.cmp){h+='<div class="lb-cmp" role="status"><b>'+ic('flask')+esc(v.bookLabel||'교과서 결론')+'</b>'+esc(v.book)+'</div><div class="lb-msg lb-good">'+ic('check')+'<span>내 결론이 기록과 맞아요.</span></div>'}
 else if(r.clast&&!cChanged(r)){const wr=r.bl.map((w,i)=>i).filter(i=>cWrong(v,r,i));
  h+='<div class="lb-msg lb-try" role="status">'+ic('info')+'<span>빨간 빈칸을 기록과 다시 견주어 봐요.'+(r.ctry>=2&&wr.length?' '+wr.map(i=>esc(v.hint[i])).join(' '):'')+'</span></div>'}
 return cardHead('결론 쓰기','빈칸에 낱말을 넣어요')+wrapB(h)}

/* ───────── 결과 한 장 ───────── */
function chartSVG(v,r){const D=days(v),W=320,H=168,l=30,rr=12,t=12,b=34,max=10;
 const x=i=>l+i*(W-l-rr)/(D.length-1),y=val=>t+(max-val)*(H-t-b)/max;
 let g='<svg class="lb-chart" viewBox="0 0 '+W+' '+(H+20)+'" role="img" aria-label="싹 튼 씨의 수 꺾은선그래프">';
 for(let q=0;q<=max;q+=2)g+='<path d="M'+l+' '+y(q)+' H'+(W-rr)+'" stroke="#E3E0D8"/><text x="'+(l-6)+'" y="'+(y(q)+4.5)+'" text-anchor="end" font-size="13" fill="#4B5465">'+q+'</text>';
 D.forEach((d,i)=>{g+='<text x="'+x(i)+'" y="'+(H-12)+'" text-anchor="middle" font-size="13" fill="#4B5465">'+(d===0?'시작':d+'일')+'</text>'});
 [0,1].forEach(cup=>{const col=cup?'#A9541A':'#2F68B0';let pts=[];D.forEach((d,i)=>{const e=r.rec[i];if(e)pts.push([x(i),y(e[cup])])});
  if(pts.length)g+='<path d="M'+pts.map(p=>p.join(' ')).join(' L')+'" fill="none" stroke="'+col+'" stroke-width="2.5"'+(cup?' stroke-dasharray="6 4"':'')+'/>'+pts.map(p=>cup?'<rect x="'+(p[0]-4)+'" y="'+(p[1]-4)+'" width="8" height="8" fill="'+col+'"/>':'<circle cx="'+p[0]+'" cy="'+p[1]+'" r="4.2" fill="'+col+'"/>').join('')});
 g+='<circle cx="'+(l+6)+'" cy="'+(H+9)+'" r="4.5" fill="#2F68B0"/><text x="'+(l+15)+'" y="'+(H+14)+'" font-size="13" fill="#141A26">가 · '+esc(shortOf(v,0))+'</text><rect x="'+(l+150)+'" y="'+(H+4.5)+'" width="9" height="9" fill="#A9541A"/><text x="'+(l+164)+'" y="'+(H+14)+'" font-size="13" fill="#141A26">나 · '+esc(shortOf(v,1))+'</text>';
 return g+'</svg>'}
function sheetTable(v,r){const D=days(v),K=v.exp==='kale';
 let h='<table class="lb-tbl"><caption class="lb-sr">관찰 기록</caption><thead><tr><th scope="col">관찰한 날</th>'+D.map(d=>'<th scope="col">'+(d===0?'시작':d+'일째')+'</th>').join('')+'</tr></thead><tbody>';
 if(!K)[0,1].forEach(cup=>{h+='<tr><th scope="row">'+L2(cup)+' 싹 튼 씨</th>'+D.map((d,i)=>{const e=r.rec[i];return '<td class="'+(cup?'lb-cb':'lb-ca')+'">'+(e?e[cup]+'개':'—')+'</td>'}).join('')+'</tr>'});
 else [0,1].forEach(cup=>{kAttrs(v).forEach(([key,n,opts],j)=>{h+='<tr'+(j===0?' class="lb-grpstart"':'')+'><th scope="row" class="'+(cup?'lb-cb':'lb-ca')+'">'+L2(cup)+' '+n+'</th>'+D.map((d,i)=>{const e=r.rec[i];return '<td>'+(!e?'—':e==='base'?'처음':opts[e[cup][key]])+'</td>'}).join('')+'</tr>'})});
 return h+'</tbody></table>'}
function sheetHTML(){const v=V(),r=R();const same=v.plan.filter(p=>!p[3]).map(p=>p[1]);const dv=v.plan.find(p=>p[3])[1];
 const done=v.steps.map(id=>stepDef(v,id)).filter(s=>s.k==='scene'&&s.id!=='tools'&&s.id!=='ktools');
 const today=new Date();const ds=today.getFullYear()+'. '+(today.getMonth()+1)+'. '+today.getDate()+'.';
 const who=v.exp==='kale'?'화분':'컵';
 let h='<article class="lb-sheet" id="lbSheet" aria-label="실험 결과 한 장"><div class="lb-sh-in"><header class="lb-sh-h"><div><h2>실험 결과 한 장 · '+esc(v.title)+'</h2><span>탐구 실험관 · 3학년 1학기 과학 · 4. 생물의 한살이 · '+ds+'</span></div><div class="lb-sh-name">이름 <u>'+(esc(DB.name)||'&nbsp;')+'</u></div></header><div class="lb-sh-grid"><div class="lb-sh-col">';
 h+='<section class="lb-sh-sec"><h3><i></i>실험 문제</h3><p><b>'+esc(v.q)+'</b></p><div class="lb-sh-tags"><span class="lb-sh-tag lb-d">다르게 한 조건: '+esc(dv)+'</span>'+same.map(s=>'<span class="lb-sh-tag">같게: '+esc(s)+'</span>').join('')+'</div>'+(r.p!=null?'<p>가 '+who+': '+esc(labOf(v,0))+' · 나 '+who+': '+esc(labOf(v,1))+'</p>':'')+'</section>';
 h+='<section class="lb-sh-sec lb-sh-po"><h3><i></i>실험한 차례</h3><div class="lb-sh-steps">'+done.map((s,i)=>'<div><b>'+(i+1)+'.</b> '+esc(s.t)+'</div>').join('')+'</div></section>';
 h+='<section class="lb-sh-sec"><h3><i></i>내 예상</h3><p>'+(r.pred!=null?esc(v.pred[r.pred]):'(고르지 않았어요)')+(r.why?'<br>까닭: '+esc(r.why):'')+'</p></section>';
 h+='</div><div class="lb-sh-col"><section class="lb-sh-sec"><h3><i></i>관찰 기록</h3>'+sheetTable(v,r)+(v.exp==='seed'?chartSVG(v,r):'')+'</section>';
 h+='<section class="lb-sh-sec"><h3><i></i>내 결론</h3><div class="lb-sh-box"><p class="lb-sh-concl">'+frameHTML(v,r.bl,'sheet')+'</p>'+(r.cmp?'<p class="lb-sh-book">'+esc(v.bookLabel||'교과서 결론')+': '+esc(v.book)+'</p>':'')+'</div></section>';
 h+='</div></div><section class="lb-sh-sec lb-sh-po lb-sh-fill"><h3><i></i>새로 알게 된 것 · 더 알고 싶은 것</h3><div class="lb-sh-lines">'+'<div class="lb-ln"></div>'.repeat(9)+'</div></section>';
 h+='<footer class="lb-sh-f"><span>아주 단순하게 만든 모형의 결과예요. 실제로는 '+(v.exp==='kale'?'자라는 모습':'싹 트는 수와 날')+'이 조금씩 달라요.</span><span>만든 사람: 초등교사 홍지희</span></footer></div></article>';
 return h}
function sheetBody(){return '<div class="lb-sheetwrap"><div class="lb-sheetside"><div class="lb-sideinfo"><label class="lb-label" for="lbName" style="margin:0">이름</label><input id="lbName" class="lb-input" maxlength="12" autocomplete="off" placeholder="이름을 써요" value="'+esc(DB.name)+'"><span>이름은 이 기기에만 저장돼요.</span></div>'+
 '<button type="button" class="lb-btn" data-act="print" data-f="print">'+ic('print')+'인쇄하기</button><div class="lb-sideinfo"><span><b>A4 한 장</b>으로 인쇄돼요. 공책에 붙여도 좋아요.</span><span>실제 실험 결과와 견주어 봐요.</span></div></div>'+sheetHTML()+'</div>'}

/* ───────── 그리기 ───────── */
function set(el,h){if(!el||el._h===h)return false;const a=document.activeElement,f=a&&el.contains(a)&&a.dataset?a.dataset.f:null;el.innerHTML=h;el._h=h;if(f){const n=el.querySelector('[data-f="'+f+'"]');if(n&&!n.disabled)n.focus({preventScroll:true})}return true}
function render(){const H=document.documentElement;H.classList.toggle('lb-big',!!DB.ui.big);
 $('#lbOpenMi').setAttribute('aria-pressed',!!DB.ui.open);$('#lbBigMi').setAttribute('aria-pressed',!!DB.ui.big);
 const main=$('#lbMain');
 if(!DB.cur||!VARS[DB.cur]){H.classList.remove('lb-inrun');$('#lbSub').textContent='3학년 1학기 과학 · 4단원 생물의 한살이';$('#lbChoose').hidden=true;$('#lbClearMi').hidden=true;
  if(main.dataset.mode!=='home'){main.dataset.mode='home';main.className='lb-homewrap';main.innerHTML='';main._h=null}
  set(main,homeHTML());return}
 H.classList.add('lb-inrun');const v=V(),r=R(),s=stepOf(r.step);
 $('#lbSub').textContent=v.title+' · '+v.name;$('#lbChoose').hidden=false;$('#lbClearMi').hidden=false;
 if(main.dataset.mode!=='run'){main.dataset.mode='run';main.className='lb-run';main._h=null;
  main.innerHTML='<nav class="lb-rail" id="lbRail" aria-label="실험 과정"></nav><section class="lb-stage" aria-labelledby="lbH1"><div class="lb-head" id="lbHead"></div><div class="lb-body" id="lbBody"></div><div class="lb-foot" id="lbFoot"></div></section>'}
 set($('#lbRail'),railHTML());
 $('#lbRail').classList.toggle('lb-open',UI.rail);
 set($('#lbHead'),'<div><div class="lb-kick"><em>'+(r.step+1)+'단계</em>'+GROUPS[s.g]+'</div><h1 id="lbH1" tabindex="-1">'+esc(s.t)+'</h1></div>'+(s.k==='sheet'?'':'<button class="lb-say" type="button" data-act="say" data-f="say" aria-pressed="'+UI.speaking+'">'+ic('speak')+'<span>'+(UI.speaking?'멈추기':'읽어 주기')+'</span></button>'));
 const body=$('#lbBody');
 if(s.k==='sheet'){if(body.dataset.k!=='sheet'){body.dataset.k='sheet';body._h=null}set(body,sheetBody())}
 else{if(body.dataset.k!=='main'){body.dataset.k='main';body._h=null;body.innerHTML='<div class="lb-col"><div class="lb-scene" id="lbScene"></div><div class="lb-leg" id="lbLeg"></div><div class="lb-notes" id="lbNotes"></div></div><aside class="lb-card" id="lbCard" tabindex="-1" aria-label="기록 카드"></aside>';body._h='x'}
  renderScene();
  set($('#lbNotes'),notesHTML(s));
  const card=$('#lbCard');const ch=s.k==='plan'?planCard():s.k==='pred'?predCard():s.k==='obs'?obsCard():s.k==='concl'?conclCard():'';card.hidden=!ch;set(card,ch)}
 set($('#lbFoot'),footHTML(v,r,s));
 fitAll();clearTimeout(render.ft);render.ft=setTimeout(fitAll,350)}
/* 넓은 화면에서 카드·단계 목록이 넘치면 조금 줄여 스크롤 없이 */
function fitBox(box,inner,min){if(!box||!inner)return;inner.style.zoom='';if(narrow()||!box.clientHeight)return;if(box.scrollHeight<=box.clientHeight+1)return;let z=Math.max(min,box.clientHeight/box.scrollHeight);inner.style.zoom=z.toFixed(3);let n=0;while(box.scrollHeight>box.clientHeight+1&&z>min&&n++<12){z=Math.max(min,z-.02);inner.style.zoom=z.toFixed(3)}}
function fitAll(){fitBox($('#lbCard .lb-card-b'),$('#lbCard .lb-fit'),.7);fitBox($('#lbRail'),$('#lbRail .lb-rwrap'),.7);fitBox($('#lbSheet'),$('#lbSheet .lb-sh-in'),.7)}
function renderScene(){const v=V(),r=R(),s=stepOf(r.step),el=$('#lbScene');if(!el)return;
 NAR=narrow();LEG=[];
 let over='';
 const pick=s.opts&&!r.done[s.id]&&UI.anim!==s.id;
 if(s.k==='scene'&&r.done[s.id]&&UI.anim!==s.id)over+='<button type="button" class="lb-replay" data-act="replay" data-f="replay">'+ic('replay')+'처음부터 보기</button>';
 if(pick)over+='<div class="lb-ask">'+ic('hand')+esc(s.ask)+'</div>';
 if(s.k==='obs'){const D=days(v);over+='<div class="lb-days" aria-hidden="true">'+D.map((d,i)=>{const c=i===r.dk?' lb-today':r.rec[i]?' lb-rec':'';return '<span class="lb-day'+c+'">'+(r.rec[i]&&i!==r.dk?ic('check'):'')+(d===0?'시작':d+'일째')+'</span>'}).join('')+'</div>';
  if(UI.tween)over+='<div class="lb-toast" role="status">'+Math.floor(UI.tween.d)+'일째 · 날마다 돌보는 중</div>'}
 if(UI.toast)over+='<div class="lb-toast lb-toast2" role="status">'+esc(UI.toast)+'</div>';
 const sv=sceneSVG();NAR=false;
 set(el,over+sv);
 const lg=$('#lbLeg');if(lg)set(lg,LEG.length?LEG.map(x=>'<span class="lb-lg">'+(x[0]?'<i class="lb-pin '+(x[0]==='나'?'lb-b':'lb-a')+'">'+x[0]+'</i>':'')+esc(x[1])+'</span>').join(''):'')}
function notesHTML(s){if(!s.why&&!s.care)return '';let h='<div class="lb-note lb-why">'+ic('why')+'<div><b>왜 그렇게 할까요?</b>'+esc(s.why)+'</div></div>';
 if(s.care)h+=s.care[0]==='care'?'<div class="lb-note lb-care">'+ic('care')+'<div><b>조심해요</b>'+esc(s.care[1])+'</div></div>':'<div class="lb-note lb-know">'+ic('info')+'<div><b>알아 두어요</b>'+esc(s.care[1])+'</div></div>';
 return h}
function stepName(s){return !R().planOk&&s.n0?s.n0:s.n}
function railHTML(){const v=V(),r=R(),N=v.steps.length;let h='<div class="lb-mtop"><b>'+(r.step+1)+'/'+N+' · '+esc(stepName(stepOf(r.step)))+'</b><span class="lb-mbar" aria-hidden="true">'+v.steps.map((x,i)=>'<i class="'+(i<=r.step?'lb-d':'')+'"></i>').join('')+'</span><button type="button" class="lb-mlist" data-act="rail" data-f="mlist" aria-expanded="'+UI.rail+'">'+ic('list')+'단계 목록</button></div>';
 h+='<div class="lb-rwrap"><p class="lb-rk">실험 '+(v.exp==='seed'?1:2)+' · '+esc(v.name)+'</p><h2>'+esc(v.title)+'</h2><div class="lb-rlist">';
 let g=-1;v.steps.forEach((id,i)=>{const s=stepOf(i);if(s.g!==g){g=s.g;h+='<div class="lb-grp">'+GROUPS[g]+'</div>'}
  const done=isDone(i)&&i!==r.step,now=i===r.step,ok=canGo(i);
  h+='<button type="button" class="lb-rs'+(now?' lb-now':done?' lb-done':'')+'" data-go="'+i+'" data-f="g'+i+'"'+(now?' aria-current="step"':'')+(ok?'':' disabled')+'><i>'+(done?ic('check'):i+1)+'</i>'+esc(stepName(s))+(s.k==='obs'&&(now||r.max>i)?'<small>'+(days(v)[r.dk]===0?'시작':days(v)[r.dk]+'일째')+'</small>':'')+'<span class="lb-sr">'+(done?' (끝냄)':now?' (지금 단계)':ok?'':' (아직)')+'</span></button>'});
 h+='</div><div class="lb-rail-note"><p>아주 단순하게 만든 모형이에요. 실제로는 '+(v.exp==='kale'?'자라는 모습':'싹 트는 수')+'가 조금씩 달라요.</p><p>만든 사람: 초등교사 홍지희</p></div></div>';
 return h}
function footHTML(v,r,s){const N=v.steps.length;
 let h='<button type="button" class="lb-btn" data-act="prev" data-f="prev"'+(r.step===0?' disabled':'')+'>'+ic('left')+'이전</button><div class="lb-fmid">';
 const dots='<span class="lb-prog" aria-hidden="true">'+v.steps.map((x,i)=>'<i class="'+(i<r.step?'lb-d':i===r.step?'lb-n':'')+'"></i>').join('')+'</span>';
 let mid='',pri='이어서',priOn=canNext(),priAct='next';
 if(s.k==='scene'){if(s.opts&&!r.done[s.id]&&UI.anim!==s.id)mid='<span class="lb-picks" role="group" aria-label="'+esc(s.ask)+'">'+s.opts.map((o,i)=>'<button type="button" class="lb-doit lb-pk" data-act="pick" data-i="'+i+'" data-f="pk'+i+'">'+esc(o.t)+'</button>').join('')+'</span>';
  else if(!r.done[s.id]||UI.anim===s.id)mid='<button type="button" class="lb-doit" data-act="doit" data-f="doit"'+(UI.anim?' disabled':'')+'>'+ic('hand')+esc(s.act||'보는 중')+'</button>';else mid='<span>잘했어요. 이어서 가요.</span>'+dots}
 else if(s.k==='plan'){const all=v.plan.every(p=>r.plan[p[0]]);if(!r.planOk)mid='<button type="button" class="lb-doit" data-act="check" data-f="doit"'+(all&&planChanged(r)?'':' disabled')+'>'+ic('check')+'계획 확인하기</button>';else mid='<span>계획을 세웠어요.</span>'+dots}
 else if(s.k==='pred'){mid=r.pred==null?'<span>예상을 하나 골라요.</span>'+dots:'<span>예상을 남겼어요.</span>'+dots}
 else if(s.k==='obs'){const D=days(v),k=r.dk,rec=r.rec[k],lastD=k===D.length-1;
  if(rec&&!lastD&&!r.care[k])mid='<button type="button" class="lb-doit" data-act="care" data-f="doit"'+(UI.care||UI.tween?' disabled':'')+'>'+ic('drop')+careLabel(v)+'</button>';
  else if(!rec)mid='<span>'+(v.exp==='kale'?(D[k]===0?'처음 모습을 봐요.':'잎과 줄기를 살펴 골라요.'):'싹 튼 씨를 세어요.')+'</span>';
  else if(lastD)mid='<span>관찰을 마쳤어요.</span>'+dots;
  else mid='<span>'+jo(advLabel(v),'을','를')+' 눌러요.</span>';
  if(!lastD){pri=advLabel(v);priOn=!!rec&&!!r.care[k]&&!UI.care&&!UI.tween;priAct='adv'}}
 else if(s.k==='concl'){const all=r.bl.length&&r.bl.every(x=>x);if(!r.cmp)mid='<button type="button" class="lb-doit" data-act="cmp" data-f="doit"'+(all&&cChanged(r)?'':' disabled')+'>'+ic('flask')+'기록과 견주기</button>';else mid='<span>결론을 썼어요.</span>'+dots}
 else if(s.k==='sheet'){mid='<span>'+(r.fin?'실험을 마쳤어요.':'아직 끝내지 않은 단계가 있어요.')+'</span>'+dots;pri='실험 고르기로';priOn=true;priAct='home'}
 h+=mid+'</div><button type="button" class="lb-btn lb-pri" data-act="'+priAct+'" data-f="pri"'+(priOn?'':' disabled')+'>'+esc(pri)+ic('right')+'</button>';
 return h}

/* ───────── 실험 고르기 ───────── */
function homeArt(exp){NAR=true;LEG=[];let s;
 if(exp==='seed'){let g=bg({win:true,sx1:300,sx2:840});
  g+=rig(420,{wick:1,lie:1,felt:1,nest:1,seeds:10})+rig(720,{wick:1,lie:1,felt:1,nest:1,seeds:10});
  s=svg(g,'똑같이 꾸민 싹 틔우기 장치 두 개','150 80 720 420')}
 else{const k=kaleAt({water:1,light:1},0);let g=bg({win:true,sx1:260,sx2:820});g+=pot(380,{})+kale(380,338,k)+pot(650,{})+kale(650,338,k);
  s=svg(g,'비슷한 크기의 케일 화분 두 개','120 70 720 420')}
 NAR=false;LEG=[];return s}
function pickBtn(key,icn){const v=VARS[key],r=DB.runs[key];let st='';
 if(r){if(r.fin)st=ic('check')+'끝냄 · 결과 보기';else st=(r.step+1)+'단계 이어서'}
 return '<button type="button" class="lb-pickb" data-pick="'+key+'" data-f="k'+key+'"><i>'+ic(icn)+'</i><span><b>'+esc(v.name)+'</b><span>'+esc(v.sub)+'</span></span>'+(st?'<small>'+st+'</small>':'<small>'+ic('right')+'</small>')+'</button>'}
function homeHTML(){return '<div class="lb-home"><div class="lb-home-h"><div class="lb-kick"><em>3학년 1학기 과학</em>4. 생물의 한살이</div><h1>무엇을 실험할까요?</h1><p>실험을 한 단계씩 직접 해 봐요. 알아볼 조건을 골라요.</p></div>'+
 '<div class="lb-ex"><section class="lb-exc" aria-labelledby="lbE1"><div class="lb-exc-art">'+homeArt('seed')+'</div><div class="lb-exc-b"><h2 id="lbE1"><em>실험 1</em>씨가 싹 트는 데 필요한 조건</h2><p class="lb-exp">무씨 · 작은 컵과 큰 컵 · 부직포 심지 · 원 모양 부직포 · 5일쯤</p><div class="lb-pick">'+pickBtn('seed-water','drop')+pickBtn('seed-temp','thermo')+pickBtn('seed-light','sun')+'</div></div></section>'+
 '<section class="lb-exc" aria-labelledby="lbE2"><div class="lb-exc-art">'+homeArt('kale')+'</div><div class="lb-exc-b"><h2 id="lbE2"><em>실험 2</em>식물이 잘 자라는 데 필요한 조건</h2><p class="lb-exp">케일 화분 2개 · 물뿌리개 · 햇빛 차단 장치 · 14일쯤</p><div class="lb-pick">'+pickBtn('kale-water','drop')+pickBtn('kale-light','sun')+'</div></div></section></div>'+
 '<p class="lb-model">'+ic('info')+'<span>아주 단순하게 만든 모형이에요. 같은 조건이면 언제나 같은 결과가 나와요. 실제로는 조금씩 달라요. 가상 실험은 실제 실험을 대신하지 않아요.</span></p></div>'}

/* ───────── 동작 ───────── */
function doAnim(id,ms){UI.anim=id;UI.nonce++;UI.toast='';render();clearTimeout(UI.timer);UI.timer=setTimeout(()=>{UI.anim=null;const r=R();if(r)r.done[id]=true;save();render();const p=$('#lbFoot [data-act="next"]');if(p&&!p.disabled&&(document.activeElement===document.body||!document.activeElement||!document.activeElement.isConnected))p.focus({preventScroll:true})},RM?150:ms)}
function act(a,el){const v=V(),r=R();
 if(a==='prev'){if(r.step>0)go(r.step-1);return}
 if(a==='next'){if(canNext())go(r.step+1);return}
 if(a==='home'){DB.cur=null;resetUI();save();render();scrollTo(0,0);return}
 if(a==='doit'){const s=stepOf(r.step);if(UI.anim)return;doAnim(s.id,s.dur||1500);return}
 if(a==='pick'){const s=stepOf(r.step),o=s.opts[+el.dataset.i];if(UI.anim||!o)return;
  if(o.bad){flash(o.bad);return}
  if(o.p!=null)r.p=o.p;doAnim(s.id,s.dur||1500);return}
 if(a==='replay'){const s=stepOf(r.step);doAnim(s.id,s.dur||1500);return}
 if(a==='check'){if(!v.plan.every(p=>r.plan[p[0]])||!planChanged(r))return;r.planLast=Object.assign({},r.plan);r.planOk=v.plan.every(p=>r.plan[p[0]]===(p[3]?'d':'s'));save();render();return}
 if(a==='care'){UI.care=true;render();clearTimeout(UI.timer);UI.timer=setTimeout(()=>{UI.care=false;r.care[r.dk]=true;save();render();const p=$('#lbFoot [data-act="adv"]');if(p&&!p.disabled)p.focus({preventScroll:true})},RM?150:(v.exp==='kale'?(v.cond==='light'?2900:2000):1300));return}
 if(a==='adv'){advance();return}
 if(a==='rec'){record();return}
 if(a==='base'){r.rec[r.dk]='base';UI.fb=[1,'처음 모습을 봐 두었어요.'];save();render();const p=$('#lbFoot [data-act="care"]');if(p)p.focus({preventScroll:true});return}
 if(a==='cmp'){if(!r.bl.every(x=>x)||!cChanged(r))return;
  if(r.bl.every((w,i)=>w===ansOf(v,i))){r.cmp=true;r.clast=r.bl.slice()}else{r.ctry=(r.ctry||0)+1;r.clast=r.bl.slice()}
  save();render();return}
 if(a==='print'){window.print();return}
 if(a==='say'){toggleSay();return}
 if(a==='rail'){UI.rail=!UI.rail;render();return}}
function advance(){const v=V(),r=R(),D=days(v),k=r.dk;if(k>=D.length-1||!r.rec[k]||!r.care[k]||UI.tween)return;
 UI.marks=[[],[]];UI.cnt=[0,0];UI.km=[{},{}];UI.fb=null;UI.hint=null;UI.kwrong=null;
 if(v.exp==='seed'){r.dk=k+1;UI.grow=true;save();render();clearTimeout(UI.timer);UI.timer=setTimeout(()=>{UI.grow=false;renderScene()},1300);return}
 const from=D[k],to=D[k+1],t0=performance.now(),dur=RM?10:1800;UI.tween={d:from};render();
 const step=now=>{const f=Math.min(1,(now-t0)/dur);UI.tween.d=from+(to-from)*f;renderScene();if(f<1)requestAnimationFrame(step);else{UI.tween=null;r.dk=k+1;save();render()}};requestAnimationFrame(step)}
/* 기록: 앱이 값을 대신 적지 않음. 같은 값으로 다시 누르면 세지 않고, 서로 다른 두 번째 틀림부터 실마리 */
function record(){const v=V(),r=R(),k=r.dk,d=days(v)[k],K=v.exp==='kale';if(r.rec[k])return;UI.pop=null;
 if(!K){const truth=[0,1].map(cup=>sproutCount(cOf(v,cup),d));const cur=UI.cnt.slice(),key=cur.join(',');
  if(cur[0]===truth[0]&&cur[1]===truth[1]){r.rec[k]=cur;UI.fb=[1,'맞게 셌어요. 기록표에 적었어요.'];UI.hint=null}
  else if(r.last[k]===key){UI.fb=[0,'수가 그대로예요. 그림을 다시 세어 봐요.']}
  else{r.last[k]=key;r.tries[k]=(r.tries[k]||0)+1;const bad=[0,1].filter(c=>cur[c]!==truth[c]);
   const rootMarked=bad.some(c=>UI.marks[c].some(i=>seedStage(cOf(v,c),i,d)<3));
   let m=jo(bad.map(L2).join('와 ')+' 컵','은','는')+' 다시 세어 봐요. ';
   m+=rootMarked?'뿌리만 나온 씨는? 떡잎이 보여야 싹 튼 씨예요.':'떡잎이 보이는 씨만 세요.';
   if(r.tries[k]>=2){const c=bad[0],cc=cOf(v,c);let hi=-1;
    if(cur[c]<truth[c])hi=TP.findIndex((p,i)=>seedStage(cc,i,d)>=3&&UI.marks[c].indexOf(i)<0);
    if(hi<0)hi=UI.marks[c].find(i=>seedStage(cc,i,d)<3);if(hi==null||hi<0)hi=TP.findIndex((p,i)=>seedStage(cc,i,d)>=3);
    if(hi>=0){UI.hint=[c,hi];if(narrow())UI.lens=c;m+=' '+L2(c)+' 컵의 반짝이는 씨를 살펴봐요. '+(seedStage(cc,hi,d)>=3?'떡잎이 보이지요?':'떡잎이 없으면 싹 튼 씨가 아니에요.')}}
   UI.fb=[0,m]}}
 else{const A=kAttrs(v),truth=[0,1].map(cup=>kaleTruth(v,cOf(v,cup),d));const key=JSON.stringify(UI.km);
  const wrong=[];[0,1].forEach(c=>A.forEach(a=>{if(UI.km[c][a[0]]!==truth[c][a[0]])wrong.push(c+':'+a[0])}));
  if(!wrong.length){r.rec[k]=[Object.assign({},UI.km[0]),Object.assign({},UI.km[1])];UI.fb=[1,'잘 살펴보았어요. 기록표에 적었어요.'];UI.kwrong=null}
  else if(r.last[k]===key){UI.fb=[0,'고른 것이 그대로예요. 그림을 다시 살펴봐요.']}
  else{r.last[k]=key;r.tries[k]=(r.tries[k]||0)+1;const pots=[...new Set(wrong.map(w=>+w[0]))];
   if(r.tries[k]>=2){UI.kwrong=wrong;UI.fb=[0,'빨간 칸을 그림에서 다시 살펴봐요. 처음 모습과 견주어요.']}
   else UI.fb=[0,jo(pots.map(L2).join('와 ')+' 화분','을','를')+' 다시 살펴봐요. 잎의 크기와 색깔, 줄기를 봐요.']}}
 if(r.rec[k]&&k===days(v).length-1)r.done.obs=true;
 save();render();
 if(r.rec[k]){const p=$('#lbFoot [data-act="care"]')||$('#lbFoot .lb-pri:not(:disabled)');if(p)p.focus({preventScroll:true})}}

/* ───────── 읽어 주기: 단계 글 + 카드 내용 ───────── */
function sayText(){const v=V(),r=R(),s=stepOf(r.step),out=[endP(s.t)];
 if(s.opts&&!r.done[s.id])out.push(endP(s.ask),s.opts.map((o,i)=>(i+1)+'번, '+o.t+'.').join(' '));
 if(s.k==='plan'){out.push(endP(v.q),'조건마다 다르게나 같게를 골라요.',v.plan.map(p=>p[1].replace(/\((.*)\)/,' $1')+'.').join(' '))}
 if(s.k==='pred'){out.push(v.pred.map((t,i)=>(i+1)+'번, '+t).join(' '));if(predLocked())out.push('관찰을 시작해서 예상을 바꿀 수 없어요.')}
 if(s.k==='obs'){const d=days(v)[r.dk];out.push((d===0?'시작한 날':d+'일째')+' 관찰이에요.');
  if(v.exp==='seed')out.push('떡잎이 보이면 싹 튼 씨예요. 그림 속 씨를 누르면 번호가 붙어요. 가 컵과 나 컵의 싹 튼 씨를 세어 기록해요.');
  else out.push(d===0?'두 케일의 처음 모습을 잘 봐 두어요.':'잎의 크기, 잎의 색깔, 줄기의 굵기를 처음 모습과 견주어 골라요.')}
 if(s.k==='concl'){out.push(v.frame.replace(/\{(\d)\}/g,(m,i)=>{i=+i;const w=r.bl[i];const J=v.jo[i];return w?(J?jo(w,J[0],J[1]):w):'빈칸'}));out.push('낱말 카드: '+v.chips.join(', ')+'.')}
 if(s.why)out.push('왜 그렇게 할까요? '+endP(s.why));if(s.care)out.push((s.care[0]==='care'?'조심해요. ':'알아 두어요. ')+endP(s.care[1]));
 return out.join(' ')}
function pickVoice(){const ss=window.speechSynthesis;if(!ss)return null;const vs=ss.getVoices().filter(x=>/^ko/i.test(x.lang));if(!vs.length)return null;return vs.find(x=>/Natural|Online/i.test(x.name))||vs.find(x=>/Google/i.test(x.name))||vs[0]}
function toggleSay(){const ss=window.speechSynthesis;if(UI.speaking){stopSay();render();return}
 if(!ss||typeof SpeechSynthesisUtterance==='undefined'){flash('이 기기에서는 읽어 주기를 쓸 수 없어요.');return}
 try{const u=new SpeechSynthesisUtterance(sayText());u.lang='ko-KR';const vo=pickVoice();if(vo)u.voice=vo;else if(ss.getVoices().length)flash('한국어 목소리가 없을 수 있어요.');u.rate=.95;
  u.onend=u.onerror=()=>{UI.speaking=false;render()};ss.cancel();ss.speak(u);UI.speaking=true;render()}catch(e){flash('이 기기에서는 읽어 주기를 쓸 수 없어요.')}}
function stopSay(){UI.speaking=false;try{window.speechSynthesis&&speechSynthesis.cancel()}catch(e){}}
let flashT=0;
function flash(t){const f=$('#lbFlash');if(DB.cur&&$('#lbScene')){UI.toast=t;renderScene();clearTimeout(flashT);flashT=setTimeout(()=>{UI.toast='';renderScene()},3200)}else if(f){f.textContent=t;f.hidden=false;clearTimeout(flashT);flashT=setTimeout(()=>{f.hidden=true},2600)}}

/* ───────── 선생님 메뉴: 1초 동안 누르기(키보드는 확인 창) ───────── */
function openMenu(o){UI.menu=o;$('#lbMenu').hidden=!o;$('#lbTeach').setAttribute('aria-expanded',o);if(o){const b=$('#lbMenu button:not([hidden])');if(b)b.focus()}}
(function(){const b=$('#lbTeach');let t=0,held=false;
 const stop=()=>{clearTimeout(t);b.classList.remove('lb-holding')};
 b.addEventListener('pointerdown',e=>{if(UI.menu)return;held=false;b.classList.add('lb-holding');t=setTimeout(()=>{held=true;b.classList.remove('lb-holding');openMenu(true)},1000)});
 ['pointerup','pointerleave','pointercancel'].forEach(n=>b.addEventListener(n,stop));
 b.addEventListener('contextmenu',e=>e.preventDefault());
 b.addEventListener('click',e=>{if(UI.menu){if(!held)openMenu(false);held=false;return}if(held){held=false;return}
  if(e.detail===0){if(confirm('선생님 메뉴를 열까요?'))openMenu(true);return}
  flash('선생님 단추는 1초 동안 꾹 눌러요.')})})();

/* ───────── 입력 연결 ───────── */
document.addEventListener('click',e=>{const t=e.target.closest('button,[data-seed]');
 if(UI.menu&&!e.target.closest('#lbMenu,#lbTeach'))openMenu(false);
 if(!t||t.id==='lbTeach')return;const r=DB.cur?R():null;
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
 if(t.dataset.pred!=null){if(predLocked())return;r.pred=+t.dataset.pred;save();render();return}
 if(t.dataset.lens!=null){UI.lens=+t.dataset.lens;render();return}
 if(t.dataset.cnt){const [c,dlt]=t.dataset.cnt.split(':').map(Number);UI.cnt[c]=Math.max(0,Math.min(10,UI.cnt[c]+dlt));render();return}
 if(t.dataset.km){const [c,key,i]=t.dataset.km.split(':');UI.km[+c][key]=+i;if(UI.kwrong)UI.kwrong=UI.kwrong.filter(w=>w!==c+':'+key);render();return}
 if(t.dataset.seed){const [c,i]=t.dataset.seed.split(':').map(Number);const m=UI.marks[c],p=m.indexOf(i);if(p>=0){m.splice(p,1);UI.pop=null}else{m.push(i);UI.pop=[c,i]}UI.cnt[c]=m.length;if(UI.hint&&UI.hint[0]===c&&UI.hint[1]===i)UI.hint=null;render();
  const n=$('[data-seed="'+c+':'+i+'"]');if(n)n.focus({preventScroll:true});return}
 if(t.dataset.blank!=null){const i=+t.dataset.blank;if(UI.focus===i&&r.bl[i]&&!r.cmp){r.bl[i]='';save()}UI.focus=i;render();return}
 if(t.dataset.chip!=null){const w=V().chips[+t.dataset.chip];r.bl[UI.focus]=w;if(r.cmp&&r.bl.some((x,i)=>x!==ansOf(V(),i)))r.cmp=false;const nx=r.bl.findIndex(x=>!x);if(nx>=0)UI.focus=nx;save();render();return}
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(UI.menu){openMenu(false);$('#lbTeach').focus()}else if(UI.rail){UI.rail=false;render()}return}
 const tg=e.target;if(tg.closest&&tg.closest('input,textarea,select'))return;
 if((e.key==='Enter'||e.key===' ')&&tg.dataset&&tg.dataset.seed){e.preventDefault();tg.dispatchEvent(new MouseEvent('click',{bubbles:true}));return}
 if(!DB.cur||e.altKey||e.ctrlKey||e.metaKey)return;
 if(e.key==='ArrowLeft'&&!tg.closest('.lb-seg')){if(R().step>0){e.preventDefault();go(R().step-1)}}
 if(e.key==='ArrowRight'&&!tg.closest('.lb-seg')){if(canNext()){e.preventDefault();go(R().step+1)}}});
document.addEventListener('input',e=>{if(e.target.id==='lbWhy'&&!predLocked()){R().why=e.target.value;save()}
 if(e.target.id==='lbName'){DB.name=e.target.value;save();const u=$('#lbSheet .lb-sh-name u');if(u)u.textContent=DB.name||' '}});
let rzT=0,wasN=narrow();addEventListener('resize',()=>{clearTimeout(rzT);rzT=setTimeout(()=>{const n=narrow();if(n!==wasN){wasN=n;const s=$('#lbScene');if(s)s._h=null;const c=$('#lbCard');if(c)c._h=null}if(DB.cur)render();else fitAll()},150)});
if(DB.cur&&VARS[DB.cur]){if(!DB.runs[DB.cur])DB.runs[DB.cur]=newRun();enterStep()}
render();
