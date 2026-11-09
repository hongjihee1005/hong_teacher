/* ───────── 기후변화와 우리 생활(해수면 상승 모형실험): 장면 · 행동 단추 · 오늘의 실험 그림 · 첫 화면 ───────── */
function fxOn(id){return UI.fx&&UI.fx.id===id}
function has(id){const r=R(),k=idxOf(id);if(k<0)return false;return k<r.step||(k===r.step&&(!!r.done[id]||fxOn(id)))}
const sn=id=>!!R().seen[id]||fxOn(id);   /* 해 본 행동(또는 지금 하는 중) */
const stv=k=>(R().st||{})[k]||0;
const VB='20 70 940 400';
/* 붓기: 한 컵씩 붓고(c1~c3) 물의 높이 표시(k1~k3). 앞 컵의 기록을 마쳐야 다음 컵을 부음 */
function pourState(){const f=UI.fx&&UI.fx.id,pc=stv('pc'),pk=stv('pk');
 if(f&&/^c\d$/.test(f))return {level:+f[1],from:+f[1]-1,marks:pk+1,pour:1};
 if(f&&/^k\d$/.test(f))return {level:pc,marks:+f[1]+1,markAnim:1,pen:1};
 return {level:pc,marks:pk+1}}
function pourScene(){const P=pourState();let g=rig({gravel:1,island:1,house:1,level:P.level,from:P.from,marks:P.marks,markAnim:P.markAnim});
 if(P.pour)g+=cupArt(392,118,1,LVL[P.from]);
 if(P.pen)g+=penArt(TK.x1+30,LVL[P.marks-1]-6,1);
 if(!P.pour&&!P.pen&&stv('pc')<3&&stv('pc')===stv('pk'))g+=cupArt(392,118,0);
 if(!P.pour&&!P.pen&&stv('pc')>0)g+=mini(220,100,'부은 물: '+CUPN[stv('pc')],22);
 return g}
/* 자갈 견주기: v0 처음 · v3 세 컵 부은 뒤 */
function landScene(){const c=UI.mq.cur,k=c==='v0'?0:3;let g=rig({gravel:1,island:1,house:1,level:k,marks:4,dry:c==='v0'||c==='v3'});
 g+=mini(220,100,c==='v0'?'처음 모습':c==='v3'?'세 컵 부은 뒤 모습':'세 컵 부은 뒤',22);return g}
/* 모형과 실제: 누른 것을 점선으로 둘러쌈(무엇을 나타내는지는 말하지 않음) */
const RING={rw:'water',rg:'gravel',ri:[ISL.cx,350,112,74],rh:[(HSE.l+HSE.r)/2,330,52,62],rt:[TRE.x,322,34,52]};
const RNAME={rw:'물',rg:'자갈',ri:'섬 모형',rh:'집 모형',rt:'나무 모형'};
function realScene(){const c=UI.mq.cur,a=c&&fxOn(c);let g=rig({gravel:1,island:1,house:1,level:3,marks:4});
 if(!c)return g;const R0=RING[c],st=' fill="none" stroke="#C25E00" stroke-width="5" stroke-dasharray="12 8"';let o='';
 if(R0==='water')o='<rect x="'+(TK.x0+8)+'" y="'+(LVL[3]+6)+'" width="'+(shoreX(LVL[3])-TK.x0-30)+'" height="'+(TK.bot-LVL[3]-14)+'" rx="14"'+st+'/>';
 else if(R0==='gravel')o='<path d="M'+(GX-6)+' '+(TK.bot-4)+' L'+(TK.x1-6)+' '+(gy(TK.x1)-10).toFixed(1)+' L'+(TK.x1-6)+' '+(TK.bot-4)+'Z"'+st+' stroke-linejoin="round"/>';
 else o='<ellipse cx="'+R0[0]+'" cy="'+R0[1]+'" rx="'+R0[2]+'" ry="'+R0[3]+'"'+st+'/>';
 return g+'<g'+(a?an('lb-a-pop',0):'')+'>'+o+mini(220,100,RNAME[c],22)+'</g>'}
function gearScene(){const on=has('gear'),f=fxOn('gear');let g=bg({});
 if(!on)return g+coatArt(380,380,1)+gloveArt(560,392,1,-14)+gloveArt(620,392,1,14);
 return g+'<g'+(f?an('lb-a-pop',0):'')+'>'+kidCoat(480,430)+'</g>'}

function sceneSVG(){const v=V(),r=R(),s=curStep(),id=s.id;
 const T=(g,l,vb)=>svg(g+lensOf(s,g),l||s.t,vb);
 if(id==='tools'){if(!(r.done.tools||fxOn('tools')))return T(bg({})+boxArt(480),'준비물 상자');return T(bg({})+toolsScene(v.tools,fxOn('tools')),'준비물: '+v.tools.map(x=>x[1]).join(', '))}
 if(id==='gear')return T(gearScene(),s.t,'200 60 560 400');
 if(id==='gravel'){const on=has('gravel');return T(rig({gravel:on,gravelAnim:fxOn('gravel')}),s.t,VB)}
 if(id==='island'){const on=has('island'),f=fxOn('island');let g=rig({gravel:1,island:on,islandAnim:f,level:on?0:null,from:f?-1:null});if(f)g+=cupArt(392,118,1,TK.bot);return T(g,s.t,VB)}
 if(id==='mark0'){const on=has('mark0'),f=fxOn('mark0');let g=rig({gravel:1,island:1,level:0,marks:on?1:0,markAnim:f});if(f)g+=penArt(TK.x1+30,LVL[0]-6,1);return T(g,s.t,VB)}
 if(id==='house'){const on=has('house');return T(rig({gravel:1,island:1,level:0,marks:1,house:on,houseAnim:fxOn('house')}),s.t,VB)}
 if(s.k==='pred')return T(rig({gravel:1,island:1,house:1,level:0,marks:1})+cupArt(392,118,0)+qmark(640,110),s.t,VB);
 if(id==='pour')return T(pourScene(),s.t,VB);
 if(id==='land')return T(landScene(),s.t,VB);
 if(id==='real')return T(realScene(),s.t,VB);
 return T(bg({}))}

/* ───────── 결과 한 장: 관찰 그림 ───────── */
const LABNAME='climate';
function snapsOf(v,r){const L=[],S=(g,vb,cap)=>L.push([svg(g,cap,vb),cap]);const ok=k=>rowDone(k);
 if(ok('cup1')||ok('cup3')){S(rig({gravel:1,island:1,house:1,level:0,marks:1,dry:ok('land')}),VB,'처음');if(ok('cup3'))S(rig({gravel:1,island:1,house:1,level:3,marks:4,dry:ok('land')}),VB,'물을 세 컵 부은 뒤')}
 return L}

/* ───────── 이 단계의 행동 단추 ───────── */
function actsOf(s){const r=R(),A=[],busy=!!UI.fx,st=r.st||{};
 const cells=(grp,list)=>list.forEach(x=>A.push({id:x[0],label:x[1],cell:1,grp,pressed:UI.mq.cur===x[0]&&!busy,seen:!!r.seen[x[0]],dis:busy}));
 switch(s.id){
  case 'pour':{const pc=st.pc||0,pk=st.pk||0,ids=['c1','k1','c2','k2','c3','k3'],L0=['물 한 컵 천천히 붓기','물의 높이 표시하기','물 한 컵 더 붓기','물의 높이 표시하기','물 한 컵 더 붓기','물의 높이 표시하기'];
   const c=pc+pk,wait=pc===pk&&pc>0&&pc<3&&!rowDone('cup'+pc);
   L0.forEach((t,i)=>A.push({id:ids[i],label:(i+1)+'/6 · '+t,dis:busy||i!==c||wait,pressed:i<c,hide:i!==Math.min(c,5)}));
   if(pc>pk)A.push({id:'top',label:'위에서 내려다보며 표시하기',sub:1,dis:busy});
   else if(pc<3)A.push({id:'dump',label:'남은 물을 한꺼번에 붓기',sub:1,dis:busy});
   break}
  case 'land':cells('견줄 모습',[['v0','처음 모습'],['v3','세 컵 부은 뒤 모습']]);break;
  case 'real':cells('살펴볼 것',[['rw','물'],['rg','자갈'],['ri','섬 모형'],['rh','집 모형'],['rt','나무 모형']]);break}
 return A}
/* 하면 안 되는 행동: 그림은 그대로, 까닭만 알림 */
const SUBMSG={dump:'한꺼번에 부으면 물이 넘칠 수 있고, 한 컵마다 모형이 어떻게 되는지 볼 수 없어요. 한 컵씩 천천히 부어요.',
 top:'위에서 내려다보면 물의 높이가 다르게 보여요. 눈높이를 물의 높이에 맞춰요.'};
function doX(id){const r=R(),s=curStep(),st=r.st;if(UI.fx)return;
 if(SUBMSG[id]){fx(id,900,()=>flash(SUBMSG[id]));return}
 r.act[s.id]=1;if(idxOf('pred')>=0&&r.step>idxOf('pred'))r.obs=1;
 const done=()=>{r.seen[id]=1};
 if(/^c\d$/.test(id)){const n=+id[1],pc=st.pc||0,pk=st.pk||0;if(pc!==n-1||pk!==pc||(n>1&&!rowDone('cup'+(n-1))))return;UI.fb={};fx(id,2300,()=>{st.pc=n;r.seen[id]=1});return}
 if(/^k\d$/.test(id)){const n=+id[1],pc=st.pc||0,pk=st.pk||0;if(pc!==n||pk!==n-1)return;fx(id,1300,()=>{st.pk=n;r.seen[id]=1});return}
 if(['v0','v3','rw','rg','ri','rh','rt'].indexOf(id)>=0){UI.mq.cur=id;fx(id,700,done);return}}

/* ───────── 오늘의 실험: 이렇게 해요 그림(결과는 보여 주지 않음) ───────── */
function introPic(no,k){const n0=NAR,l0=LEG;NAR=true;LEG=[];let g='',vb='60 90 900 360';
 if(k==='gravel')g=rig({gravel:1});
 if(k==='island')g=rig({gravel:1,island:1,level:0,marks:1});
 if(k==='house')g=rig({gravel:1,island:1,level:0,marks:1,house:1});
 if(k==='pour')g=rig({gravel:1,island:1,level:0,marks:1,house:1})+'<g transform="rotate(-50 392 118)">'+cupArt(392,118,0)+'</g><path d="M348 115 q-16 40 -12 '+(LVL[0]-115)+'" stroke="#4FA8DF" stroke-width="9" fill="none" stroke-linecap="round"/>';
 const s=svg(g,'',vb).replace(' role="img" aria-label=""',' aria-hidden="true"');NAR=n0;LEG=l0;return s}

/* ───────── 첫 화면 ───────── */
function homeArt(no){NAR=true;LEG=[];const g=rig({gravel:1,island:1,level:0,marks:1,house:1})+cupArt(392,118,0);
 const s=svg(g,'모형실험 장치의 처음 모습','40 70 900 400');NAR=false;LEG=[];return s}
function homeHTML(){const card=k=>{const v=EXPS[k],r=DB.runs[k];const st=r?(r.fin?'끝냄 · 결과 보기':(r.step+1)+'단계부터 이어서'):'실험 시작하기';
 return '<section class="lb-exc" aria-labelledby="lbE'+v.no+'"><div class="lb-exc-art">'+homeArt(v.no)+'</div><div class="lb-exc-b"><h2 id="lbE'+v.no+'"><em>모형실험</em>'+esc(v.name)+'</h2><p class="lb-exp">'+esc(v.sub)+'</p><p class="lb-exq">'+esc(v.q)+'</p><button type="button" class="lb-pickb" data-pick="'+k+'" data-f="k'+k+'"><i>'+ic('wave')+'</i><span><b>'+st+'</b><span>교과서 실험 · 13단계</span></span>'+(r&&r.fin?'<small>'+ic('check')+'</small>':'')+'</button></div></section>'};
 return '<div class="lb-home"><div class="lb-home-h"><div class="lb-kick"><em>4학년 2학기 과학</em>4. 기후변화와 우리 생활</div><h1>모형실험을 해 볼까요?</h1><p>장치를 직접 만들고, 물을 한 컵씩 부으며 내 눈으로 본 것을 기록해요.</p></div>'+
 '<div class="lb-ex lb-ex1">'+['e1'].map(card).join('')+'</div>'+
 '<p class="lb-model">'+ic('info')+'<span>아주 단순하게 만든 모형이에요. 같은 조건이면 언제나 같은 결과가 나와요. 한 컵마다 모형이 물에 잠기는 모습은 교과서 예시와 같고, 상자·자갈·모형의 모양과 크기, 처음 물 높이와 한 컵마다 오르는 물 높이는 이 실험관에서 정한 값이에요.</span></p></div>'}
