/* ───────── 그림: 실험대 장면 — 모두 직접 그린 SVG ───────── */
const BY=436;
let NAR=false,LEG=[];   /* 좁은 화면: 작은 그림 글자는 HTML(LEG)로 */
function an(cls,delay,extra){return ' class="lb-a '+cls+'" style="animation-delay:'+(delay||0)+'s'+(extra?';'+extra:'')+'"'}
function bg(o){o=o||{};let g='<rect x="-3000" y="-3000" width="7000" height="3416" fill="var(--w-wall)"/><rect x="-3000" y="330" width="7000" height="86" fill="var(--w-wall2)"/><rect x="-3000" y="326" width="7000" height="5" fill="var(--w-rail)"/>';
 g+='<rect x="-3000" y="416" width="7000" height="36" fill="var(--w-top)"/><rect x="-3000" y="452" width="7000" height="6" fill="var(--w-edge)"/><rect x="-3000" y="458" width="7000" height="3000" fill="var(--w-front)"/>';
 for(let i=0;i<5;i++)g+='<path d="M-3000 '+(478+i*20)+' H4000" stroke="var(--w-grain)" stroke-width="1.2" opacity=".35"/>';
 return g}
function defs(){return ''}
function svg(inner,label,vb){return '<svg viewBox="'+(vb||'0 0 960 540')+'" preserveAspectRatio="xMidYMid meet" role="img" aria-label="'+label+'">'+defs()+inner+'</svg>'}
/* 이름표(그림 아래). 좁은 화면에서는 HTML 칩으로 */
function plate(cx,txt,y,col){if(NAR){LEG.push([null,txt]);return ''}y=y||470;const w=Math.max(120,txt.length*22+44);
 return '<g><rect x="'+(cx-w/2)+'" y="'+y+'" width="'+w+'" height="46" rx="12" fill="var(--w-label)" stroke="'+(col||'var(--lb-sci)')+'" stroke-width="2.5"/><text x="'+cx+'" y="'+(y+30)+'" text-anchor="middle" font-size="23" font-weight="700" fill="var(--w-labeltx)">'+txt+'</text></g>'}
function tag(x,y,t,sz){sz=sz||20;if(NAR){LEG.push([null,t]);return ''}const w=t.length*sz*.95+24;return '<g><rect x="'+(x-w/2)+'" y="'+(y-sz*.95)+'" width="'+w+'" height="'+(sz*1.5)+'" rx="'+(sz*.5)+'" fill="var(--w-label)" stroke="var(--w-felt-s)" stroke-width="1.5"/><text x="'+x+'" y="'+(y+sz*.3)+'" text-anchor="middle" font-size="'+sz+'" font-weight="800" fill="var(--w-labeltx)">'+t+'</text></g>'}
/* 그림 속 짧은 이름(좁은 화면에서도 그림 안에 둠 — 칸 이름 ㉮㉯㉰처럼 꼭 필요한 것만) */
function mini(x,y,t,sz){sz=sz||20;const w=t.length*sz*.95+16;return '<g><rect x="'+(x-w/2)+'" y="'+(y-sz*.95)+'" width="'+w+'" height="'+(sz*1.4)+'" rx="'+(sz*.45)+'" fill="var(--w-label)" stroke="var(--w-felt-s)" stroke-width="1.5"/><text x="'+x+'" y="'+(y+sz*.28)+'" text-anchor="middle" font-size="'+sz+'" font-weight="800" fill="var(--w-labeltx)">'+t+'</text></g>'}
function qmark(x,y,col){return '<g'+an('lb-a-pop',.2)+'><circle cx="'+x+'" cy="'+y+'" r="28" fill="var(--w-label)" stroke="'+(col||'var(--lb-sci)')+'" stroke-width="3" stroke-dasharray="6 5"/><text x="'+x+'" y="'+(y+12)+'" text-anchor="middle" font-size="34" font-weight="800" fill="'+(col||'var(--lb-sci-ink)')+'">?</text></g>'}
function hand(x,y,rot,s,glove){const sk=glove?'#FFFFFF':'#F2C6A0',ss=glove?'#9AA6B2':'#B9875F';return '<g transform="translate('+x+' '+y+') rotate('+(rot||0)+') scale('+(s||1)+')"><path d="M-30 -14 Q-8 -24 18 -18 L40 -16 Q48 -15 47 -9 Q46 -4 38 -4 L22 -4 Q30 2 26 9 Q22 15 10 13 L-30 14Z" fill="'+sk+'" stroke="'+ss+'" stroke-width="2.2" stroke-linejoin="round"/><path d="M-30 -14 L-62 -14 L-62 14 L-30 14Z" fill="#5C8FCB" stroke="#3D6A9C" stroke-width="2"/></g>'}
/* 펼친 손바닥(위를 향함) */
function palm(x,y,s){s=s||1;return '<g transform="translate('+x+' '+y+') scale('+s+')"><path d="M-46 0 Q-48 -10 -38 -12 L-30 -12 L-30 -26 Q-30 -32 -24 -32 Q-18 -32 -18 -26 L-18 -14 L-8 -14 L-8 -30 Q-8 -36 -2 -36 Q4 -36 4 -30 L4 -14 L14 -14 L14 -28 Q14 -34 20 -34 Q26 -34 26 -28 L26 -12 L34 -10 Q46 -8 44 4 Q40 18 18 20 L-30 20 Q-44 18 -46 0Z" fill="#F2C6A0" stroke="#B9875F" stroke-width="2.2" stroke-linejoin="round"/><path d="M-30 20 L-30 40 L18 40 L18 20" fill="#5C8FCB" stroke="#3D6A9C" stroke-width="2"/></g>'}
function arrow(x1,y1,x2,y2,col,w){col=col||'var(--lb-sci)';w=w||7;const a=Math.atan2(y2-y1,x2-x1),L=18;
 return '<g><path d="M'+x1+' '+y1+' L'+x2+' '+y2+'" stroke="'+col+'" stroke-width="'+w+'" stroke-linecap="round"/><path d="M'+(x2-L*Math.cos(a-.5)).toFixed(1)+' '+(y2-L*Math.sin(a-.5)).toFixed(1)+' L'+x2+' '+y2+' L'+(x2-L*Math.cos(a+.5)).toFixed(1)+' '+(y2-L*Math.sin(a+.5)).toFixed(1)+'" stroke="'+col+'" stroke-width="'+w+'" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>'}
function shadow(cx,y,rx){return '<ellipse cx="'+cx+'" cy="'+y+'" rx="'+rx+'" ry="7" fill="var(--w-shadow)"/>'}
/* 작은 떨림·소리 선(두드리기·흔들기) */
function wiggle(x,y){return '<g stroke="var(--lb-sci)" stroke-width="4" fill="none" stroke-linecap="round"><path d="M'+(x-22)+' '+(y-8)+' q-10 -14 0 -26"/><path d="M'+(x+22)+' '+(y-8)+' q10 -14 0 -26"/></g>'}


/* 위에서 내려다본 책상 */
function deskTop(){let g='<rect x="-3000" y="-3000" width="7000" height="7000" fill="var(--w-top)"/>';
 for(let i=0;i<9;i++)g+='<path d="M-3000 '+(30+i*62)+' H4000" stroke="var(--w-grain)" stroke-width="1.4" opacity=".28"/>';return g}
const f1=n=>(+n).toFixed(1);

/* ───────── 실험 1: 매미 애벌레의 허물(위에서 본 모습, 이 실험관에서 그린 모양) ─────────
   다리 차례: 0 왼쪽 앞, 1 오른쪽 앞, 2 왼쪽 가운데, 3 오른쪽 가운데, 4 왼쪽 뒤, 5 오른쪽 뒤 */
const SH={c:'#B57B3C',c2:'#D8A866',s:'#6B4320',d:'#4A2E14'};
const LEGP=[[[-46,-52],[-112,-96],[-96,-158]],[[-58,-22],[-130,-12],[-154,48]],[[-50,14],[-120,58],[-140,134]]];
function legPts(i){const p=LEGP[i>>1],sx=i%2?-1:1;return p.map(q=>[q[0]*sx,q[1]])}
function seg(a,b,w){return '<path d="M'+f1(a[0])+' '+f1(a[1])+' L'+f1(b[0])+' '+f1(b[1])+'" stroke="'+SH.s+'" stroke-width="'+(w+4)+'" stroke-linecap="round"/><path d="M'+f1(a[0])+' '+f1(a[1])+' L'+f1(b[0])+' '+f1(b[1])+'" stroke="'+SH.c+'" stroke-width="'+w+'" stroke-linecap="round"/>'}
/* 앞다리 끝: 뾰족하게 좁아지는 모양 + 안쪽 가시 두 개 */
function spike(a,b,w){const dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy),nx=-dy/L,ny=dx/L,P=(t,o)=>[a[0]+dx*t+nx*o,a[1]+dy*t+ny*o];
 const side=a[0]<0?-1:1;const pts=[P(0,w/2),P(.55,w*.38),P(1,0),P(.55,-w*.38),P(0,-w/2)];
 const t1=[P(.35,-side*w*.4),P(.45,-side*w*1.25),P(.55,-side*w*.36)],t2=[P(.62,-side*w*.32),P(.72,-side*w*1.05),P(.8,-side*w*.24)];
 const path=q=>'M'+q.map(p=>f1(p[0])+' '+f1(p[1])).join(' L')+'Z';
 return '<path d="'+path(t1)+'" fill="'+SH.c+'" stroke="'+SH.s+'" stroke-width="2.4" stroke-linejoin="round"/><path d="'+path(t2)+'" fill="'+SH.c+'" stroke="'+SH.s+'" stroke-width="2.4" stroke-linejoin="round"/><path d="'+path(pts)+'" fill="'+SH.c+'" stroke="'+SH.s+'" stroke-width="2.6" stroke-linejoin="round"/>'}
function legArt(i,o){const [h,k,t]=legPts(i),fr=i<2;let g=seg(h,k,fr?22:12);
 if(fr)g+=spike(k,t,17);else{g+=seg(k,t,8)+'<circle cx="'+f1(t[0])+'" cy="'+f1(t[1])+'" r="4" fill="'+SH.s+'"/>'}
 return g}
/* o: ghost(다리 없이 몸만) · tap(다리를 눌러 표시) · marks{} · hl('fore'|'mid'|'head') */
function exuvia(cx,cy,s,o){o=o||{};let g='<g transform="translate('+cx+' '+cy+') scale('+s+')">';
 const body='<ellipse cx="0" cy="72" rx="62" ry="100" fill="'+SH.c+'" stroke="'+SH.s+'" stroke-width="3.5"/>'+[22,50,80,110,140].map(y=>{const w=62*Math.sqrt(Math.max(0,1-Math.pow((y-72)/100,2)));return '<path d="M'+f1(-w+4)+' '+y+' Q0 '+(y+10)+' '+f1(w-4)+' '+y+'" stroke="'+SH.s+'" stroke-width="2.6" fill="none"/>'}).join('')+
  '<ellipse cx="0" cy="-28" rx="70" ry="52" fill="'+SH.c+'" stroke="'+SH.s+'" stroke-width="3.5"/><ellipse cx="-22" cy="-44" rx="24" ry="14" fill="'+SH.c2+'" opacity=".7"/><ellipse cx="22" cy="-44" rx="24" ry="14" fill="'+SH.c2+'" opacity=".7"/>'+
  '<path d="M0 -76 L-5 -58 L4 -42 L-4 -24 L3 -6 L0 6" stroke="'+SH.d+'" stroke-width="5" fill="none" stroke-linejoin="round"/>'+
  '<ellipse cx="0" cy="-98" rx="50" ry="30" fill="'+SH.c+'" stroke="'+SH.s+'" stroke-width="3.5"/><ellipse cx="-42" cy="-102" rx="12" ry="14" fill="#8E5A28" stroke="'+SH.s+'" stroke-width="2.5"/><ellipse cx="42" cy="-102" rx="12" ry="14" fill="#8E5A28" stroke="'+SH.s+'" stroke-width="2.5"/>'+
  '<ellipse cx="0" cy="-112" rx="20" ry="10" fill="'+SH.c2+'" opacity=".75"/>';
 const ant=o.ghost?'':[-1,1].map(d=>'<path d="M'+(d*16)+' -124 q'+(d*10)+' -22 '+(d*30)+' -46" stroke="'+SH.s+'" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M'+(d*16)+' -124 q'+(d*10)+' -22 '+(d*30)+' -46" stroke="'+SH.c+'" stroke-width="1.6" fill="none" stroke-dasharray="4 3" stroke-linecap="round"/>').join('');
 let legs='';
 if(!o.ghost)for(let i=0;i<NLEG;i++){const on=o.marks&&o.marks[i],hl=(o.hl==='fore'&&i<2)||(o.hl==='mid'&&(i===2||i===3));
  let L=legArt(i);if(hl)L='<g filter="none">'+L+'</g>';
  const [h,k,t]=legPts(i);
  if(o.tap){const hit='<path d="M'+h.join(' ')+' L'+k.join(' ')+' L'+t.join(' ')+'" stroke="transparent" stroke-width="46" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
   L='<g class="lb-hleg'+(on?' lb-hlegon':'')+'" data-leg="'+i+'" data-f="lg'+i+'" role="button" tabindex="0" aria-pressed="'+!!on+'" aria-label="허물의 다리 하나'+(on?', 표시했어요':', 눌러서 표시')+'">'+hit+L+'</g>'}
  legs+=L;
  if(on)legs+='<g aria-hidden="true"><circle cx="'+f1(k[0])+'" cy="'+f1(k[1])+'" r="15" fill="var(--lb-lens)" stroke="#FFFFFF" stroke-width="3"/><path d="M'+f1(k[0]-7)+' '+f1(k[1])+' l5 5 l9 -10" stroke="#FFFFFF" stroke-width="3.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>'}
 g+=legs+ant+body;
 if(o.ghost)g+='<path d="M-74 -60 q-30 40 -6 120 M74 -60 q30 40 6 120" stroke="'+SH.s+'" stroke-width="3" fill="none" stroke-dasharray="6 7" opacity=".55"/>';
 if(o.hl==='head')g+='<ellipse cx="0" cy="-112" rx="66" ry="56" fill="none" stroke="var(--lb-lens)" stroke-width="4" stroke-dasharray="10 7"/>';
 return g+'</g>'}
/* 페트리 접시(위에서 본 모습) */
function dish(cx,cy,r){return '<circle cx="'+cx+'" cy="'+(cy+6)+'" r="'+(r+4)+'" fill="var(--w-shadow)"/><circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="var(--w-fr)" stroke="var(--w-glass-s)" stroke-width="6"/><circle cx="'+cx+'" cy="'+cy+'" r="'+(r-14)+'" fill="none" stroke="var(--w-fr2)" stroke-width="5"/><path d="M'+(cx-r*.62)+' '+(cy-r*.5)+' a'+(r*.8)+' '+(r*.8)+' 0 0 1 '+(r*.5)+' -'+(r*.28)+'" stroke="#FFFFFF" stroke-width="7" fill="none" stroke-linecap="round" opacity=".8"/>'}
/* 돋보기 */
function loupe(x,y,r,rot){r=r||40;return '<g transform="translate('+x+' '+y+') rotate('+(rot||0)+')"><rect x="'+(r*.72)+'" y="-9" width="'+(r*1.5)+'" height="18" rx="8" fill="#2B3445" transform="rotate(40)"/><circle r="'+r+'" fill="rgba(214,232,242,.35)" stroke="#2B3445" stroke-width="'+(r*.2)+'"/><path d="M'+(-r*.55)+' '+(-r*.2)+' a'+(r*.6)+' '+(r*.6)+' 0 0 1 '+(r*.4)+' '+(-r*.38)+'" stroke="#FFFFFF" stroke-width="4" fill="none" stroke-linecap="round"/></g>'}
/* 손가락 두 개로 살짝 집기 */
function pinch(x,y,s,rot){s=s||1;return '<g transform="translate('+x+' '+y+') rotate('+(rot||0)+') scale('+s+')"><path d="M-70 -20 Q-30 -40 0 -26 L24 -18 Q32 -14 26 -8 L4 -8 L28 4 Q34 10 26 14 L-4 10 Q-40 30 -70 20Z" fill="#F2C6A0" stroke="#B9875F" stroke-width="2.4" stroke-linejoin="round"/><path d="M-70 -24 H-110 V24 H-70Z" fill="#5C8FCB" stroke="#3D6A9C" stroke-width="2"/></g>'}
/* 큰 렌즈로 본 허물의 한 부분 */
const EXC={x:480,y:286,s:.98};
function headSpot(){if(!R().seen.lh&&!fxOn('lh'))return null;return [EXC.x,EXC.y-112*EXC.s,52,2.3,790,170]}
function foreSpot(){const m=UI.mq.cur;if(m!=='f'&&m!=='m')return null;const i=m==='f'?0:2,[h,k,t]=legPts(i),p=m==='f'?[(k[0]+t[0])/2,(k[1]+t[1])/2]:[(k[0]+t[0])/2,(k[1]+t[1])/2];
 return [EXC.x+p[0]*EXC.s,EXC.y+p[1]*EXC.s,48,2.2,800,m==='f'?190:330]}

/* ───────── 실험 2: 원형 수조(비스듬히 본 모습) · 페트병 뚜껑 · 부챗살 ───────── */
const TB={cx:430,ty:250,rx:330,ry:104,by:384,wl:262,x0:236,u:58};   /* x0 = 눈금 0, u = 한 칸 */
function tankRound(o){o=o||{};const T=TB;let g=shadow(T.cx,T.by+18,T.rx+10);
 g+='<path d="M'+(T.cx-T.rx)+' '+T.ty+' V'+T.by+' A'+T.rx+' '+T.ry+' 0 0 0 '+(T.cx+T.rx)+' '+T.by+' V'+T.ty+'" fill="var(--w-glass)" stroke="var(--w-glass-s)" stroke-width="5"/>';
 g+='<path d="M'+(T.cx-T.rx+8)+' '+T.wl+' V'+(T.by-2)+' A'+(T.rx-8)+' '+(T.ry-6)+' 0 0 0 '+(T.cx+T.rx-8)+' '+(T.by-2)+' V'+T.wl+'Z" fill="var(--w-water)" fill-opacity=".55"/>';
 g+='<ellipse cx="'+T.cx+'" cy="'+T.wl+'" rx="'+(T.rx-8)+'" ry="'+(T.ry-8)+'" fill="var(--w-water)" fill-opacity=".72" stroke="var(--w-water-s)" stroke-width="3"/>';
 /* 바닥 눈금(이 실험관에서 그린 것) */
 g+='<path d="M'+T.x0+' '+T.wl+' H'+(T.x0+7*T.u)+'" stroke="#FFFFFF" stroke-width="3" stroke-dasharray="8 7" opacity=".9"/>';
 for(let i=0;i<=7;i++){const x=T.x0+i*T.u;g+='<path d="M'+x+' '+(T.wl-12)+' V'+(T.wl+12)+'" stroke="#1E4E6E" stroke-width="3"/><text x="'+x+'" y="'+(T.wl+40)+'" text-anchor="middle" font-size="22" font-weight="800" fill="#123A55">'+i+'</text>'}
 if(o.inner)g+=o.inner;
 g+='<ellipse cx="'+T.cx+'" cy="'+T.ty+'" rx="'+T.rx+'" ry="'+T.ry+'" fill="none" stroke="var(--w-glass-s)" stroke-width="5"/>';
 return g}
function capArt(x,y,anim,from){const T=TB;let c='<g><ellipse cx="'+x+'" cy="'+(y+6)+'" rx="25" ry="11" fill="#9A2C22"/><ellipse cx="'+x+'" cy="'+y+'" rx="25" ry="12" fill="#E0463A" stroke="#8E241B" stroke-width="2.5"/><ellipse cx="'+x+'" cy="'+(y-1)+'" rx="15" ry="7" fill="#F27A6E"/></g>';
 if(anim==='drop')return '<g'+an('lb-a-down',0,'--from:-150px')+'>'+c+'</g>';
 if(anim==='slide')return '<g'+an('lb-a-slide',.45,'--dx:'+(from||0)+'px;animation-duration:1.5s')+'>'+c+'</g>';
 return c}
/* 물결: n개, big이면 넓게. anim이면 퍼져 나가는 고리 */
function ripples(n,big,anim){const T=TB,cx=T.x0-10;let g='';
 for(let i=0;i<n;i++){const rx=(big?70:44)+i*(big?62:30),ry=rx*.32;
  g+='<ellipse cx="'+cx+'" cy="'+T.wl+'" rx="'+rx+'" ry="'+f1(ry)+'" fill="none" stroke="#FFFFFF" stroke-width="'+(big?4.5:3)+'" opacity="'+(anim?.95:.8)+'"'+(anim?an('lb-a-ring',.35+i*.16):'')+'/>'}
 return '<g clip-path="none">'+g+'</g>'}
const FP={x:150,y:118};
/* 부챗살. web: 사이를 테이프로 막음, part: 막은 칸 수(붙이는 중) */
function fanArt(o){o=o||{};const A=[66,78,90,102,114],L=196,P=FP;let g='';
 const pt=(a,r)=>[P.x+r*Math.cos(a*Math.PI/180),P.y+r*Math.sin(a*Math.PI/180)];
 const nWeb=o.web?4:(o.part||0);
 for(let i=0;i<nWeb;i++){const a=pt(A[i],64),b=pt(A[i],L),c=pt(A[i+1],L),d=pt(A[i+1],64);
  g+='<path d="M'+a.map(f1).join(' ')+' L'+b.map(f1).join(' ')+' L'+c.map(f1).join(' ')+' L'+d.map(f1).join(' ')+'Z" fill="#F3E3A0" fill-opacity=".82" stroke="#B89A3E" stroke-width="2"'+(o.tapeAnim?an('lb-a-pop',.25+i*.35):'')+'/>'}
 A.forEach(a=>{const b=pt(a,L);g+='<path d="M'+P.x+' '+P.y+' L'+f1(b[0])+' '+f1(b[1])+'" stroke="#6E4A28" stroke-width="7" stroke-linecap="round"/>'});
 g+='<circle cx="'+P.x+'" cy="'+P.y+'" r="9" fill="#4E3420"/>';
 if(!o.nohand)g+=hand(P.x-6,P.y-30,-90,1);
 return g}
function fanStir(o,anim){return '<g'+(anim?' class="lb-a lb-a-stir" style="--ox:'+FP.x+'px;--oy:'+FP.y+'px"':'')+'>'+fanArt(o)+'</g>'}
/* 손에 드는 힘 막대(5칸, 이 실험관에서 정한 칸 수). cols: [[이름, 칸 수 또는 null]] */
function pushGauge(x,y,cols,anim,title){const w=cols.length>1?200:120;let g='<g><rect x="'+x+'" y="'+y+'" width="'+w+'" height="206" rx="16" fill="var(--w-label)" stroke="var(--w-felt-s)" stroke-width="2"/>';
 const T=title||'손에 드는 힘';g+=NAR?'':'<text x="'+(x+w/2)+'" y="'+(y+30)+'" text-anchor="middle" font-size="'+(cols.length>1?19:17)+'" font-weight="800" fill="var(--w-labeltx)">'+T+'</text>';if(NAR)LEG.push([null,T+(cols.length>1?'':' ('+cols[0][0]+')')]);
 cols.forEach((c,i)=>{const cx=cols.length>1?x+56+i*88:x+w/2,L=c[1];for(let k=0;k<5;k++){const on=L!=null&&k<L,yy=y+150-k*24;
   g+='<rect x="'+(cx-26)+'" y="'+yy+'" width="52" height="20" rx="4" fill="'+(on?'var(--lb-sci)':'var(--w-wall)')+'" stroke="var(--w-felt-s)" stroke-width="1.5"'+(on&&anim?an('lb-a-pop',.4+k*.2):'')+'/>'}
  g+='<text x="'+cx+'" y="'+(y+194)+'" text-anchor="middle" font-size="22" font-weight="800" fill="var(--w-labeltx)">'+c[0]+'</text>'});
 return g+'</g>'}
function capSpot(){const s=curStep().id,k=s==='fanA'?'sa':'sb';if(!R().seen[k]||UI.fx)return null;const d=CAPD[s==='fanA'?'A':'B'];return [TB.x0+d*TB.u,TB.wl,40,1.9,560,92]}
/* 한 번 저은 모습. kind A|B, anim: 젓는 중 */
function stirScene(kind,anim,o){o=o||{};const d=CAPD[kind],big=kind==='B';
 let inner=ripples(big?4:2,big,anim)+capArt(TB.x0+d*TB.u,TB.wl,anim?'slide':'',-d*TB.u);
 return tankRound({inner})+fanStir({web:big},anim)+(o.nogauge?'':pushGauge(780,60,[[kind==='A'?'㈎':'㈏',PUSH[kind]]],anim))}
function drips(x,y){let g='';for(let i=0;i<5;i++)g+='<ellipse cx="'+(x+i*34-(i%2)*10)+'" cy="'+(y+(i%3)*12)+'" rx="'+(10+i%3*4)+'" ry="5" fill="var(--w-water)" stroke="var(--w-water-s)" stroke-width="1.5"/>';return g}
function cloth(x,y){return '<g transform="translate('+x+' '+y+')"><path d="M-60 -22 Q-30 -34 0 -24 Q34 -14 60 -26 L64 18 Q30 30 0 20 Q-34 10 -62 22Z" fill="#9EC5E8" stroke="#4E7FAF" stroke-width="2.5"/><path d="M-40 -10 H40 M-44 4 H44" stroke="#FFFFFF" stroke-width="2" opacity=".7"/></g>'}

/* ───────── 실험 3: 지퍼 백 · 바셀린 · 얼음물 ───────── */
const BG={w:170,h:230};
const VAS='#F1DE97',VAS_S='#C7A84B';
/* 큰 지퍼 백. cx 가운데, y 위. o.vas: 바셀린 높이 비율, o.small: 작은 지퍼 백, o.hand: 손 */
function zipBag(cx,y,o){o=o||{};const W=BG.w,H=BG.h,x=cx-W/2;let g='<g>';
 g+='<rect x="'+x+'" y="'+y+'" width="'+W+'" height="'+H+'" rx="14" fill="#E9F2F7" fill-opacity=".6" stroke="#7FA6BD" stroke-width="3"/>';
 if(o.vas){const vh=H*o.vas;g+='<g'+(o.vasAnim?an('lb-a-grow',.5,'animation-duration:1.2s'):'')+'><rect x="'+(x+5)+'" y="'+f1(y+H-vh-2)+'" width="'+(W-10)+'" height="'+f1(vh-3)+'" rx="10" fill="'+VAS+'" stroke="'+VAS_S+'" stroke-width="2"/>'+[0,1,2].map(i=>'<path d="M'+(x+22+i*46)+' '+f1(y+H-vh+18+i*14)+' q14 -8 28 0" stroke="#FFFFFF" stroke-width="3" fill="none" opacity=".7"/>').join('')+'</g>'}
 if(o.small)g+='<g'+(o.smallAnim?an('lb-a-down',0,'--from:-220px'):'')+'>'+smallBag(cx,y+10)+'</g>';
 if(o.hand)g+=handDown(cx,y+70,1);
 g+='<rect x="'+x+'" y="'+y+'" width="'+W+'" height="10" rx="3" fill="#D6534B"/>';
 return g+'</g>'}
function smallBag(cx,y){const sw=BG.w-46,sx=cx-sw/2;return '<rect x="'+sx+'" y="'+y+'" width="'+sw+'" height="'+(BG.h-34)+'" rx="10" fill="#F7FBFD" fill-opacity=".92" stroke="#9DB8C8" stroke-width="2.5"/><rect x="'+sx+'" y="'+y+'" width="'+sw+'" height="8" fill="#5F9FD1"/>'}
/* 아래를 향한 손(실험용 장갑) + 실험복 소매 */
function handDown(cx,y,s){s=s||1;return '<g transform="translate('+cx+' '+y+') scale('+s+')"><path d="M-30 -10 Q-34 40 -26 70 L-30 112 Q-31 122 -24 122 Q-18 122 -17 112 L-14 82 L-10 126 Q-9 136 -1 136 Q7 136 7 126 L6 84 L12 122 Q13 131 20 130 Q27 129 26 120 L21 80 L26 104 Q28 112 34 110 Q40 107 37 98 L30 60 Q34 30 30 -10Z" fill="#DCE8F7" stroke="#7F97B6" stroke-width="2.4" stroke-linejoin="round"/><path d="M-40 -90 H40 V-6 Q0 6 -40 -6Z" fill="#FFFFFF" stroke="#AAB4C0" stroke-width="2.4"/></g>'}
/* 수조(옆에서 본 모습). x 왼쪽, top 위, w 폭, bot 바닥, wl 물 높이 */
function tankArt(x,top,w,bot,wl,o){o=o||{};let g=shadow(x+w/2,bot+6,w/2+10);
 g+='<rect x="'+x+'" y="'+wl+'" width="'+w+'" height="'+(bot-wl)+'" fill="#9FD3F0" fill-opacity=".7"/><path d="M'+x+' '+wl+' H'+(x+w)+'" stroke="#4E9CCB" stroke-width="3"/>';
 if(o.inner)g+=o.inner;
 g+='<path d="M'+x+' '+top+' V'+bot+' H'+(x+w)+' V'+top+'" fill="none" stroke="#6E9FB5" stroke-width="5" stroke-linejoin="round"/><path d="M'+(x+10)+' '+(top+14)+' V'+(bot-20)+'" stroke="#FFFFFF" stroke-width="4" opacity=".55"/>';
 return g}
const IT={x:170,top:236,w:620,bot:440,wl:300};
function iceTank(inner){const T=IT;let ice='';[[250,292],[330,286],[650,290],[720,294],[470,292]].forEach((p,i)=>{ice+='<g transform="rotate('+(i*13-20)+' '+p[0]+' '+p[1]+')"><rect x="'+(p[0]-18)+'" y="'+(p[1]-16)+'" width="36" height="32" rx="6" fill="#EEF8FD" fill-opacity=".9" stroke="#8FBCD6" stroke-width="2"/><path d="M'+(p[0]-10)+' '+(p[1]-8)+' h10" stroke="#FFFFFF" stroke-width="3"/></g>'});
 return tankArt(T.x,T.top,T.w,T.bot,T.wl,{inner:(inner||'')+ice})}
const BXE=360,BXV=600;   /* 빈 지퍼 백, 바셀린이 든 지퍼 백 자리 */
/* 손을 넣은 두 지퍼 백(0.8배). yy = 지퍼 백 위 */
function dipBags(yy){const b=(cx,o)=>'<g transform="translate('+cx+' '+yy+') scale(.8) translate('+(-cx)+' 0)">'+zipBag(cx,0,o)+'</g>';return b(BXE,{small:1,hand:1})+b(BXV,{small:1,vas:.5,hand:1})}
/* 차가운 느낌 막대(5칸, 느낌을 그림으로 나타낸 것 — 이 실험관에서 정한 칸 수) */
function chillBar(cx,y,lv,anim){let g='';for(let k=0;k<5;k++){const on=k<lv;g+='<rect x="'+(cx-90+k*36)+'" y="'+y+'" width="32" height="26" rx="5" fill="'+(on?'#2F68B0':'var(--w-wall)')+'" stroke="var(--w-felt-s)" stroke-width="1.5"'+(on&&anim?an('lb-a-pop',.9+k*.28):'')+'/>'}return g}
function chillBars(anim){let g='';
 if(!NAR)g+='<rect x="236" y="0" width="488" height="38" rx="12" fill="var(--w-label)" stroke="var(--w-felt-s)" stroke-width="1.5"/><text x="480" y="26" text-anchor="middle" font-size="20" font-weight="800" fill="var(--w-labeltx)">차가운 느낌 (그림으로 나타낸 것)</text>';
 else LEG.push([null,'위 막대: 차가운 느낌(그림으로 나타낸 것)']);
 return g+chillBar(BXE,48,CHILL.E,anim)+chillBar(BXV,48,CHILL.V,anim)}
function bagNames(y){if(NAR){LEG.push([null,'왼쪽: 빈 지퍼 백 · 오른쪽: 바셀린이 든 지퍼 백']);return ''}return tag(BXE,y,'빈 지퍼 백',19)+tag(BXV,y,'바셀린이 든 지퍼 백',19)}
function vasJar(x,y){return '<g transform="translate('+x+' '+y+')"><rect x="-44" y="-56" width="88" height="70" rx="12" fill="#F7F1DC" stroke="#A89A70" stroke-width="2.5"/><rect x="-48" y="-70" width="96" height="18" rx="6" fill="#4C7DB8" stroke="#2F5A8A" stroke-width="2"/><ellipse cx="0" cy="-52" rx="36" ry="8" fill="'+VAS+'"/><rect x="-30" y="-30" width="60" height="22" rx="5" fill="#FFFFFF" stroke="#C9BE9C"/></g>'}
function spoon(x,y,rot,full){return '<g transform="translate('+x+' '+y+') rotate('+(rot||0)+')"><rect x="0" y="-5" width="120" height="10" rx="5" fill="#A9B4C0" stroke="#6B7684" stroke-width="2"/><ellipse cx="-14" cy="0" rx="24" ry="15" fill="#C9D2DB" stroke="#6B7684" stroke-width="2"/>'+(full?'<ellipse cx="-14" cy="-3" rx="18" ry="10" fill="'+VAS+'" stroke="'+VAS_S+'" stroke-width="1.5"/>':'')+'</g>'}
function coatArt(x,y,s){return '<g transform="translate('+x+' '+y+') scale('+(s||1)+')"><path d="M-70 -90 L-30 -104 L0 -70 L30 -104 L70 -90 L104 40 L72 50 L60 0 L60 110 H-60 L-60 0 L-72 50 L-104 40Z" fill="#FFFFFF" stroke="#9AA6B2" stroke-width="3" stroke-linejoin="round"/><path d="M0 -70 V110" stroke="#9AA6B2" stroke-width="2.5"/><circle cx="10" cy="-20" r="4" fill="#9AA6B2"/><circle cx="10" cy="20" r="4" fill="#9AA6B2"/><circle cx="10" cy="60" r="4" fill="#9AA6B2"/></g>'}

/* ───────── 준비물 카드 ───────── */
function itemArt(k){const A={
  shell:'<rect x="-56" y="-40" width="112" height="80" rx="10" fill="var(--w-kraft)" stroke="var(--w-kraft-s)" stroke-width="2"/>'+exuvia(0,4,.2,{ghost:1}),
  dish:dish(0,4,48),
  loupe:loupe(-12,-4,30,0),
  tank2:'<ellipse cx="0" cy="-10" rx="60" ry="20" fill="var(--w-water)" fill-opacity=".7" stroke="var(--w-glass-s)" stroke-width="3"/><path d="M-60 -10 V24 A60 20 0 0 0 60 24 V-10" fill="var(--w-glass)" stroke="var(--w-glass-s)" stroke-width="3"/>',
  cap:'<g transform="scale(1.6)">'+capArt(0,0)+'</g>',
  fan:'<g transform="translate(-93 -130) scale(.62)">'+fanArt({nohand:1})+'</g>',
  tapew:'<circle cx="-10" cy="0" r="30" fill="none" stroke="#C9B26A" stroke-width="14"/><circle cx="-10" cy="0" r="14" fill="none" stroke="#E6D9B8" stroke-width="5"/><rect x="18" y="-10" width="44" height="18" fill="#F3E3A0" stroke="#B89A3E"/>',
  scis:'<g transform="rotate(-20)"><path d="M-6 -4 L60 -14 L64 -8Z" fill="#C3CBD3" stroke="#69737D" stroke-width="2"/><path d="M-6 4 L60 14 L64 8Z" fill="#AEB7C0" stroke="#69737D" stroke-width="2"/><circle cx="-24" cy="-12" r="14" fill="none" stroke="#C2453A" stroke-width="7"/><circle cx="-24" cy="12" r="14" fill="none" stroke="#C2453A" stroke-width="7"/></g>',
  bigbag:'<g transform="translate(-48 -46) scale(.36)">'+zipBag(85,0,{})+'</g><g transform="translate(-14 -40) scale(.36)">'+zipBag(85,0,{})+'</g>',
  smallbag:'<g transform="translate(-40 -36) scale(.28)">'+zipBag(85,0,{})+'</g><g transform="translate(-6 -30) scale(.28)">'+zipBag(85,0,{})+'</g>',
  spoon:spoon(-40,0,-15),
  vas:vasJar(0,24),
  icetank:'<g transform="translate(-96 -78) scale(.2)">'+iceTank()+'</g>',
  coat:coatArt(-14,-2,.42)+hand(46,10,-90,.55,1)};
 return A[k]||''}
function toolsScene(list,anim){let b='';if(NAR)list.forEach(it=>LEG.push([null,it[1]]));const n=list.length,cols=n<=4?n:n<=6?3:4,rows=Math.ceil(n/cols),cw=200,ch=176,gx=18,gy=18;
 const W=cols*cw+(cols-1)*gx,H=rows*ch+(rows-1)*gy,x0=480-W/2,y0=Math.max(30,250-H/2);
 list.forEach((it,i)=>{const c=i%cols,r=Math.floor(i/cols),x=x0+c*(cw+gx),y=y0+r*(ch+gy),cx=x+cw/2;
  b+='<g'+(anim?an('lb-a-pop',.3+i*.15):'')+'><rect x="'+x+'" y="'+y+'" width="'+cw+'" height="'+ch+'" rx="16" fill="var(--w-label)" stroke="var(--w-felt-s)" stroke-width="1.5"/><g transform="translate('+cx+' '+(y+72)+')">'+itemArt(it[0])+'</g>'+(NAR?'':toolLabel(cx,y+ch-18,it[1]))+'</g>'});
 return b}
/* 준비물 이름: 길면 두 줄로(글자를 줄이지 않음) */
function toolLabel(cx,yb,t){const T='<text x="'+cx+'" text-anchor="middle" font-size="19" font-weight="800" fill="var(--w-labeltx)"';
 if(t.length<=9)return T+' y="'+yb+'">'+t+'</text>';
 const sp=[...t].map((c,i)=>c===' '?i:-1).filter(i=>i>0);if(!sp.length)return T+' y="'+yb+'" font-size="16">'+t+'</text>';
 const m=sp.reduce((a,i)=>Math.abs(i-t.length/2)<Math.abs(a-t.length/2)?i:a,sp[0]);
 return T+' y="'+(yb-21)+'">'+t.slice(0,m)+'</text>'+T+' y="'+yb+'">'+t.slice(m+1)+'</text>'}
function boxArt(x){return '<g transform="translate('+x+' 300)"><path d="M-130 -60 L-100 -96 H150 L120 -60Z" fill="var(--w-kraft-s)"/><rect x="-130" y="-60" width="250" height="196" rx="8" fill="var(--w-kraft)" stroke="var(--w-kraft-s)" stroke-width="2"/><path d="M120 -60 L150 -96 V100 L120 136Z" fill="var(--w-kraft-s)"/>'+(NAR?'':'<rect x="-60" y="-10" width="110" height="44" rx="8" fill="var(--w-label)"/><text x="-5" y="20" text-anchor="middle" font-size="22" font-weight="800" fill="var(--w-labeltx)">준비물</text>')+'</g>'}
