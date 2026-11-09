/* ───────── 그림: 실험대 장면 — 모두 직접 그린 SVG (식물의 생활) ───────── */
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


/* 수조. x 왼쪽, top 위, w 폭, bot 바닥, wl 물 높이 */
function tankArt(x,top,w,bot,wl,o){o=o||{};let g=shadow(x+w/2,bot+6,w/2+10);
 g+='<rect x="'+x+'" y="'+wl+'" width="'+w+'" height="'+(bot-wl)+'" fill="#9FD3F0" fill-opacity=".7"/><path d="M'+x+' '+wl+' H'+(x+w)+'" stroke="#4E9CCB" stroke-width="3"/>';
 if(o.inner)g+=o.inner;
 g+='<path d="M'+x+' '+top+' V'+bot+' H'+(x+w)+' V'+top+'" fill="none" stroke="#6E9FB5" stroke-width="5" stroke-linejoin="round"/><path d="M'+(x+10)+' '+(top+14)+' V'+(bot-20)+'" stroke="#FFFFFF" stroke-width="4" opacity=".55"/>';
 return g}


/* 위에서 내려다본 책상(실험 1·4) */
function bgTop(){let g='<rect x="-3000" y="-3000" width="7000" height="7000" fill="var(--w-top)"/>';
 for(let i=0;i<14;i++)g+='<path d="M-3000 '+(-40+i*46)+' Q480 '+(-30+i*46+(i%2?10:-10))+' 4000 '+(-40+i*46)+'" stroke="var(--w-grain)" stroke-width="1.4" fill="none" opacity=".28"/>';
 return g}
const P2=pts=>'M'+pts.map(p=>p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' L')+' Z';
function rnd(i,s){const h=Math.sin(i*12.9898+(s||0)*78.233)*43758.5453;return h-Math.floor(h)}

/* ───────── 실험 1: 잎(교과서 버전 앱 u3-1의 잎 그림과 같은 모양) — 잎 하나는 가로 120 · 세로 145 칸 ───────── */
function serrate(pts,cx,cy,a){return pts.map((p,i)=>{const dx=p[0]-cx,dy=p[1]-cy,d=Math.hypot(dx,dy)||1,k=(i%2?a:-a*.35);return [p[0]+dx/d*k,p[1]+dy/d*k]})}
function lshape(kind){const N=kind==='palm'?180:120,pts=[];
 if(kind==='palm'){const cx=60,cy=66;for(let i=0;i<N;i++){const t=-Math.PI+2*Math.PI*i/N;let r;if(Math.abs(t)>.86*Math.PI)r=9;else r=12+40*Math.pow(Math.abs(Math.cos(2.5*t)),2.2);pts.push([cx+r*Math.sin(t),cy-r*Math.cos(t)])}
  return {d:P2(serrate(pts,cx,cy,2.2)),base:[60,75],tip:[60,14]}}
 const L={ellipse:[60,64,30,46,0],ovate:[60,64,30,48,1],lance:[60,64,16,54,0],grass:[60,62,7,58,0]}[kind];
 if(L){const [cx,cy,w,h,ov]=L;for(let i=0;i<N;i++){const t=2*Math.PI*i/N,s=Math.sin(t),c=Math.cos(t);
   const ww=w*(ov?(1+.25*c):1)*(kind==='lance'||kind==='grass'?Math.pow(Math.abs(s),.8)*Math.sign(s):s);pts.push([cx+ww,cy-h*c*(kind==='ovate'&&c<0?.85:1)])}
  return {d:P2(kind==='ovate'?serrate(pts,cx,cy,2.4):pts),base:[cx,cy+(kind==='ovate'?h*.85:h)],tip:[cx,cy-h]}}
 const right=[],left=[],M=60;for(let i=0;i<=M;i++){const s=i/M,y=118-104*s,env=4+24*Math.pow(s,.7)*Math.pow(1-s,.35),lob=.35+.65*((s*5)%1),w=env*(s>.82?1:lob);right.push([60+w,y]);left.push([60-w*(i%2?1:.97),y])}
 return {d:P2(serrate(right.concat(left.reverse()),60,64,1.2)),base:[60,118],tip:[60,14]}}
function lveins(kind,S){const [bx,by]=S.base,[tx,ty]=S.tip;let v='<path d="M'+bx+' '+by+' L'+tx+' '+(ty+4)+'"/>';
 if(kind==='lance'||kind==='grass'){const w=kind==='lance'?9:3.5;v='';(kind==='lance'?[-2,-1,0,1,2]:[-1,0,1]).forEach(k=>{v+='<path d="M'+bx+' '+(by-3)+' Q'+(bx+k*w)+' '+((by+ty)/2)+' '+tx+' '+(ty+3)+'"/>'});return v}
 if(kind==='palm'){[0,.4,-.4,.8,-.8].forEach(a=>{const t=a*Math.PI,r=42;v+='<path d="M60 70 L'+(60+r*Math.sin(t)).toFixed(1)+' '+(66-r*Math.cos(t)).toFixed(1)+'"/>';
   [.45,.7].forEach(f=>{const px=60+r*f*Math.sin(t),py=66-r*f*Math.cos(t);v+='<path d="M'+px.toFixed(1)+' '+py.toFixed(1)+' l'+(8*Math.sin(t+.9)).toFixed(1)+' '+(-8*Math.cos(t+.9)).toFixed(1)+' M'+px.toFixed(1)+' '+py.toFixed(1)+' l'+(8*Math.sin(t-.9)).toFixed(1)+' '+(-8*Math.cos(t-.9)).toFixed(1)+'"/>'})});return v}
 const n=kind==='feather'?6:5;for(let i=1;i<=n;i++){const f=i/(n+1),y=by+(ty-by)*f,x=bx+(tx-bx)*f,w=kind==='feather'?16:22*(1-Math.abs(f-.45));
  v+='<path d="M'+x+' '+y.toFixed(1)+' Q'+(x+w*.6).toFixed(1)+' '+(y-4).toFixed(1)+' '+(x+w).toFixed(1)+' '+(y-12).toFixed(1)+' M'+x+' '+y.toFixed(1)+' Q'+(x-w*.6).toFixed(1)+' '+(y-4).toFixed(1)+' '+(x-w).toFixed(1)+' '+(y-12).toFixed(1)+'"/>'+
   '<path d="M'+(x+w*.55).toFixed(1)+' '+(y-5).toFixed(1)+' l4 5 M'+(x-w*.55).toFixed(1)+' '+(y-5).toFixed(1)+' l-4 5" stroke-width="1"/>'}
 return v}
const STK={palm:[60,60],ellipse:[60,84],grass:[60,98],feather:[60,94],ovate:[60,84],lance:[60,94]};
/* 잎 하나(잎 칸 안 좌표). o.stk 번호 붙임딱지, o.hl 고른 잎 테두리, o.trace 테두리 따라가기 */
function leafU(k,o){o=o||{};const L=LEAF[k],S=lshape(L.kind);let g='';
 if(L.st)g+='<path d="M'+S.base[0]+' '+(S.base[1]-2)+' L'+S.base[0]+' '+(S.base[1]+22)+'" stroke="#4B8A37" stroke-width="5" stroke-linecap="round"/>';
 g+='<path d="'+S.d+'" fill="#7CC766" stroke="#2F6B2A" stroke-width="2"/>';
 g+='<g class="lb-vein" stroke="#EAF8DF" stroke-width="1.8" fill="none" stroke-linecap="round">'+lveins(L.kind,S)+'</g>';
 if(o.trace)g+='<path d="'+S.d+'" fill="none" stroke="var(--lb-lens)" stroke-width="3.5" stroke-dasharray="14 9"'+an('lb-a-fade',0)+'/>';
 if(o.stk){const p=STK[L.kind];g+='<g'+(o.stkAnim?an('lb-a-pop',o.stkAnim):'')+'><circle cx="'+p[0]+'" cy="'+p[1]+'" r="13" fill="#FFD54A" stroke="#9A7300" stroke-width="2"/><text x="'+p[0]+'" y="'+(p[1]+5.5)+'" text-anchor="middle" font-size="16" font-weight="800" fill="#3B2A00">'+L.n+'</text></g>'}
 if(o.hl)g+='<rect x="-6" y="-4" width="132" height="152" rx="16" fill="none" stroke="var(--lb-lens)" stroke-width="3" stroke-dasharray="9 6"/>';
 return g}
/* 종이 위 자리 */
const LS=1.12,LCX=[170,380],LCY=[122,298,474];
function lpos(k){const i=LEAFK.indexOf(k);return [LCX[i%2],LCY[Math.floor(i/2)]]}
function leafAt(k,o,cx,cy,s){s=s||LS;if(cx==null){const p=lpos(k);cx=p[0];cy=p[1]}return '<g transform="translate('+(cx-60*s).toFixed(1)+' '+(cy-72*s).toFixed(1)+') scale('+s+')">'+leafU(k,o)+'</g>'}
function lw(k,u){const [cx,cy]=lpos(k);return [cx-60*LS+u[0]*LS,cy-72*LS+u[1]*LS]}
const LSP={palm:{e:[100,52],s:[60,86],v:[60,40]},ellipse:{e:[90,64],s:[60,116],v:[60,46]},grass:{e:[66,40],s:[60,116],v:[60,58]},
 feather:{e:[72,62],s:[60,114],v:[60,52]},ovate:{e:[90,64],s:[60,112],v:[60,46]},lance:{e:[76,64],s:[60,116],v:[60,56]}};
const PAPERR={x:62,y:30,w:426,h:532};
function paperSheet(anim){const P=PAPERR;return '<g'+(anim?an('lb-a-slide',0,'--dx:-760px'):'')+'><rect x="'+(P.x+6)+'" y="'+(P.y+8)+'" width="'+P.w+'" height="'+P.h+'" rx="6" fill="var(--w-shadow)"/><rect x="'+P.x+'" y="'+P.y+'" width="'+P.w+'" height="'+P.h+'" rx="6" fill="#FFFDF8" stroke="#BDB3A2" stroke-width="2"/></g>'}
/* 종이 위 여섯 잎 */
function leavesOnPaper(o){o=o||{};let g=o.nopaper?'':paperSheet(o.paperAnim);
 LEAFK.forEach((k,i)=>{const p=lpos(k),cx=o.nopaper?p[0]+[10,-14,22,-8,16,-20][i]:p[0],cy=o.nopaper?p[1]+[12,-6,-10,14,-12,6][i]:p[1];
  const lo={stk:o.stk,stkAnim:o.stkAnim?(.25+i*.18):0,hl:o.hl===k,trace:o.trace===k};
  g+=o.paperAnim?'<g'+an('lb-a-slide',0,'--dx:'+(-[10,-14,22,-8,16,-20][i])+'px')+'>'+leafAt(k,lo,cx,cy)+'</g>':leafAt(k,lo,cx,cy)});
 return g}
/* 돋보기 */
function magnifier(x,y,s,rot){return '<g transform="translate('+x+' '+y+') rotate('+(rot||0)+') scale('+(s||1)+')"><circle r="34" fill="#E8F4FA" fill-opacity=".35" stroke="#2B3445" stroke-width="7"/><path d="M24 24 L62 62" stroke="#6B4A2B" stroke-width="13" stroke-linecap="round"/><path d="M-16 -18 a24 24 0 0 1 20 -8" stroke="#FFFFFF" stroke-width="4" fill="none" opacity=".8"/></g>'}
/* 두 친구가 나눈 결과(실험 1 '견주기') */
function chip(x,y,n,r){r=r||20;return '<g><circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="#FFD54A" stroke="#9A7300" stroke-width="2"/><text x="'+x+'" y="'+(y+r*.36)+'" text-anchor="middle" font-size="'+(r*1.05)+'" font-weight="800" fill="#3B2A00">'+n+'</text></g>'}
function kid(x,y,col){return '<g><circle cx="'+x+'" cy="'+(y-26)+'" r="16" fill="#F2C6A0" stroke="#B9875F" stroke-width="2"/><path d="M'+(x-22)+' '+(y+18)+' Q'+(x-22)+' '+(y-8)+' '+x+' '+(y-8)+' Q'+(x+22)+' '+(y-8)+' '+(x+22)+' '+(y+18)+'Z" fill="'+col+'"/></g>'}
/* yes가 null이면 아직 나누지 않은 빈 상자(독립 검토: 모든 잎이 '그렇지 않다'에 든 것처럼 보이던 것) */
function twoBox(x0,y0,w,h,yes,anim,lab){const bw=(w-14)/2;let g='';
 [['그렇다',yes||[]],['그렇지 않다',yes?LEAFK.filter(k=>yes.indexOf(k)<0):[]]].forEach((b,j)=>{const bx=x0+j*(bw+14);
  g+='<rect x="'+bx+'" y="'+y0+'" width="'+bw+'" height="'+h+'" rx="12" fill="var(--w-label)" stroke="'+(j?'#9E968A':'var(--lb-sci)')+'" stroke-width="2.5"/>';
  if(lab!==false)g+='<text x="'+(bx+bw/2)+'" y="'+(y0+30)+'" text-anchor="middle" font-size="21" font-weight="800" fill="var(--w-labeltx)">'+b[0]+'</text>';
  b[1].forEach((k,i)=>{const cx=bx+bw/2+((i%3)-1)*52,cy=y0+(lab===false?40:78)+Math.floor(i/3)*54;g+='<g'+(anim?an('lb-a-pop',.2+.12*LEAFK.indexOf(k)):'')+'>'+chip(cx,cy,LEAF[k].n)+'</g>'})});
 return g}
function critCard(t,y){y=y||52;if(!t)return qmark(480,y);const w=Math.max(260,t.length*26+60);
 return '<g><rect x="'+(480-w/2)+'" y="'+(y-30)+'" width="'+w+'" height="56" rx="14" fill="var(--w-label)" stroke="var(--lb-sci)" stroke-width="3"/><text x="480" y="'+(y+8)+'" text-anchor="middle" font-size="25" font-weight="800" fill="var(--w-labeltx)">'+t+'</text></g>'}
/* 기준대로 나누기: 아직 안 나눈 잎은 위 줄, 고른 잎은 두 상자로 */
function sortArt(c,f,o){o=o||{};let g=critCard(c?CRIT[c].t:'',40);const S=.7;
 const bx=[80,500],bw=380,by=196,bh=244;
 ['그렇다','그렇지 않다'].forEach((t,j)=>{g+='<rect x="'+bx[j]+'" y="'+by+'" width="'+bw+'" height="'+bh+'" rx="14" fill="var(--w-label)" stroke="'+(j?'#9E968A':'var(--lb-sci)')+'" stroke-width="3"/>'+(NAR?'':'<text x="'+(bx[j]+bw/2)+'" y="'+(by+bh+34)+'" text-anchor="middle" font-size="22" font-weight="800" fill="var(--w-labeltx)">'+t+'</text>')});
 if(NAR){LEG.push([null,'왼쪽 상자: 그렇다']);LEG.push([null,'오른쪽 상자: 그렇지 않다'])}
 const cnt=[0,0];let top=0;
 LEAFK.forEach((k,i)=>{const a=f?f[i]:null;let cx,cy;
  if(a===0||a===1){const n=cnt[a]++;cx=bx[a]+70+(n%3)*120;cy=by+62+Math.floor(n/3)*118}
  else{cx=150+top*132;cy=128;top++}
  g+=leafAt(k,{stk:1},cx,cy,S)});
 return g}

/* ───────── 실험 2: 부레옥잠 ───────── */
const HT={x:330,top:110,w:480,bot:420,wl:250,cx:570};
const HLEAF=[[-104,-92,34,-28],[-42,-128,38,-8],[44,-130,37,12],[106,-96,33,30]],HBULB=[-66,-22,22,66];
function hyacinth(cx,wl,o){o=o||{};let g='';
 /* 뿌리 */
 for(let i=0;i<16;i++){const x0=cx-40+i*5.5,len=90+rnd(i,3)*70,bend=(rnd(i,5)-.5)*40;g+='<path d="M'+x0.toFixed(1)+' '+(wl+26)+' q'+(bend/2).toFixed(1)+' '+(len/2).toFixed(1)+' '+bend.toFixed(1)+' '+len.toFixed(1)+'" stroke="#3E302A" stroke-width="'+(1.6+(i%3)*.4)+'" fill="none" opacity=".9"/>';
  for(let j=1;j<4;j++){const yy=wl+26+len*j/4,xx=x0+bend*(j/4)*(j/4);g+='<path d="M'+xx.toFixed(1)+' '+yy.toFixed(1)+' l'+(i%2?7:-7)+' 6" stroke="#5A463C" stroke-width="1" />'}}
 g+='<ellipse cx="'+cx+'" cy="'+(wl+24)+'" rx="46" ry="11" fill="#4F7A34" stroke="#2F5320" stroke-width="2"/>';
 /* 잎자루와 잎 */
 HBULB.forEach((dx,i)=>{const L=HLEAF[i],bx=cx+dx,top=wl-26,lx=cx+L[0],ly=wl+L[1];
  g+='<path d="M'+bx+' '+top+' Q'+((bx+lx)/2)+' '+(top-10)+' '+lx+' '+(ly+L[2]*.6)+'" stroke="#5E9C3A" stroke-width="8" fill="none" stroke-linecap="round"/>';
  const sq=o.squish===i;
  g+='<g transform="rotate('+(dx/5)+' '+bx+' '+(wl+4)+')"><g'+(sq?an('lb-a-squish',0):'')+'><ellipse cx="'+bx+'" cy="'+(wl+4)+'" rx="21" ry="31" fill="#A6D877" stroke="#4F8A2E" stroke-width="2.5"/><ellipse cx="'+(bx-7)+'" cy="'+(wl-8)+'" rx="5" ry="11" fill="#FFFFFF" opacity=".55"/></g></g>'});
 HLEAF.forEach(L=>{const lx=cx+L[0],ly=wl+L[1];g+='<g transform="rotate('+L[3]+' '+lx+' '+ly+')"><ellipse cx="'+lx+'" cy="'+ly+'" rx="'+L[2]+'" ry="'+(L[2]*.9).toFixed(1)+'" fill="#4E9E34" stroke="#2A6420" stroke-width="2.5"/><path d="M'+lx+' '+(ly+L[2]*.85)+' V'+(ly-L[2]*.7)+'" stroke="#8FCB6D" stroke-width="2"/><ellipse cx="'+(lx-L[2]*.38)+'" cy="'+(ly-L[2]*.35)+'" rx="'+(L[2]*.22)+'" ry="'+(L[2]*.12)+'" fill="#FFFFFF" opacity=".55"/></g>'});
 return g}
function hyTank(o){o=o||{};const T=HT;return tankArt(T.x,T.top,T.w,T.bot,T.wl,{inner:o.inner})+(o.noplant?'':hyacinth(T.cx,T.wl,o))}
/* 잎자루 단면(벌집처럼 작은 구멍) — 모양 안에 드는 구멍만 그림(clipPath 없이: 확대 렌즈에서도 그대로) */
function honey(inside,x0,y0,x1,y1,r){let g='';const dx=r*2.1,dy=r*1.85;for(let j=0,y=y0;y<=y1;j++,y+=dy)for(let x=x0+(j%2?dx/2:0);x<=x1;x+=dx)if(inside(x,y))g+='<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="'+r+'" fill="#F4FBEA" stroke="#7DB85A" stroke-width="1.6"/>';return g}
const BOARD={x:210,y:300,w:560,h:110};
function boardArt(){const B=BOARD;return shadow(B.x+B.w/2,B.y+B.h+4,B.w/2)+'<rect x="'+B.x+'" y="'+B.y+'" width="'+B.w+'" height="'+B.h+'" rx="10" fill="#D9B27C" stroke="#9C7443" stroke-width="2.5"/>'+[0,1,2].map(i=>'<path d="M'+(B.x+14)+' '+(B.y+26+i*30)+' Q'+(B.x+B.w/2)+' '+(B.y+18+i*30)+' '+(B.x+B.w-14)+' '+(B.y+28+i*30)+'" stroke="#B88C55" stroke-width="1.5" fill="none"/>').join('')}
function knife(x,y,rot,s){return '<g transform="translate('+x+' '+y+') rotate('+(rot||0)+') scale('+(s||1)+')"><path d="M0 -8 L84 -8 Q100 -2 84 8 L0 8Z" fill="#F7F7F2" stroke="#8F9AA3" stroke-width="2"/>'+[12,24,36,48,60,72].map(t=>'<path d="M'+t+' 8 l4 4 l4 -4" fill="#F7F7F2" stroke="#8F9AA3" stroke-width="1.2"/>').join('')+'<rect x="-62" y="-9" width="62" height="18" rx="8" fill="#5C8FCB" stroke="#3D6A9C" stroke-width="2"/></g>'}
const CUTA={cx:350,cy:352,r:44},CUTB={x:450,y:328,w:220,h:50};
function hyCut(o){o=o||{};let g=boardArt()+knife(690,388,-8,.85);
 const A=CUTA;g+='<ellipse cx="'+(A.cx+28)+'" cy="'+A.cy+'" rx="34" ry="'+A.r+'" fill="#93C96A" stroke="#4F8A2E" stroke-width="2.5"/><circle cx="'+A.cx+'" cy="'+A.cy+'" r="'+A.r+'" fill="#DDF0C8" stroke="#4F8A2E" stroke-width="5"/>'+(o.plain?'':honey((x,y)=>Math.hypot(x-A.cx,y-A.cy)<A.r-8,A.cx-A.r,A.cy-A.r,A.cx+A.r,A.cy+A.r,5.2));
 const B=CUTB;g+='<rect x="'+B.x+'" y="'+B.y+'" width="'+B.w+'" height="'+B.h+'" rx="24" fill="#DDF0C8" stroke="#4F8A2E" stroke-width="5"/>'+(o.plain?'':honey((x,y)=>x>B.x+12&&x<B.x+B.w-12&&y>B.y+9&&y<B.y+B.h-9,B.x,B.y,B.x+B.w,B.y+B.h,5.2));
 if(!NAR)g+=tag(480,262,'선생님이 미리 잘라 두었어요',20);else LEG.push([null,'선생님이 미리 잘라 두었어요']);
 if(!NAR&&!o.nolab)g+=mini(A.cx,A.cy+A.r+30,'가로로 자른 것',17)+mini(B.x+B.w/2,B.y+B.h+30,'세로로 자른 것',17);
 return g}
/* 물속에서 누르기: st 0 물 밖, 1 물속, 2 누름, 3 뗌 */
const PRS={cx:570,cy:345};
function petPiece(cx,cy,sq,anim){const w=150,h=44*(sq?.62:1);return '<g'+(anim?an(sq?'lb-a-squish':'lb-a-fade',0):'')+'><rect x="'+(cx-w/2)+'" y="'+(cy-h/2)+'" width="'+w+'" height="'+h+'" rx="'+(h/2)+'" fill="#A6D877" stroke="#4F8A2E" stroke-width="3"/><path d="M'+(cx-w/2+16)+' '+(cy-h/4)+' H'+(cx+w/2-24)+'" stroke="#FFFFFF" stroke-width="3" opacity=".5"/></g>'}
function bubbleCol(cx,top,bot,anim){let g='';for(let i=0;i<12;i++){const x=cx-60+rnd(i,7)*120,y=bot-(bot-top)*(i/12),r=3+rnd(i,9)*5;
  g+='<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="'+r.toFixed(1)+'" fill="#FFFFFF" fill-opacity=".35" stroke="#FFFFFF" stroke-width="2"'+(anim?an('lb-a-up',.08*i,'--from:'+Math.round(bot-y)+'px'):'')+'/>'}return g}
function pressArt(st,anim){const T=HT;let inner='',g='';
 if(st===0){g+=petPiece(PRS.cx,150,false)+hand(PRS.cx-110,150,0,1,1)}
 else{const sq=st===2;inner+=(anim&&st===1?'<g'+an('lb-a-down',0,'--from:-195px')+'>':'<g>')+petPiece(PRS.cx,PRS.cy,sq,anim&&st>=2)+'</g>';
  if(st===2)inner+=bubbleCol(PRS.cx,T.wl+10,PRS.cy-28,anim);
  inner+='<g transform="translate('+(PRS.cx-6)+' '+(PRS.cy-(sq?30:st===3?110:40))+') rotate(90) scale(.9)">'+hand(0,0,0,1,1)+'</g>'}
 return tankArt(T.x,T.top,T.w,T.bot,T.wl,{inner})+g}

/* ───────── 실험 3: 알로에 ───────── */
const AL={cx:300,pot:318,w:27,ang:[-66,-42,-17,5,27,49,70],len:[150,200,236,256,230,196,146]};
const alw=t=>AL.w*(1-t)*(1+1.2*t);
function aloeLeaf(i,o){o=o||{};const a=AL.ang[i],L=AL.len[i],w=AL.w;let g='<g transform="translate('+AL.cx+' '+AL.pot+') rotate('+a+')">';
 const body='M'+(-w)+' 0 Q'+(-w*1.1)+' '+(-L*.5)+' 0 '+(-L)+' Q'+(w*1.1)+' '+(-L*.5)+' '+w+' 0Z';
 g+='<path d="'+body+'" fill="#4F7F3E" transform="translate(6 4)"/>';   /* 두께(옆면) */
 g+='<path d="'+body+'" fill="#7DB36A" stroke="#3F6E32" stroke-width="2.5"/>';
 for(let t=.1;t<.86;t+=.075){const y=-L*t,hw=alw(t);
  [-1,1].forEach(sd=>{const x=sd*hw;g+='<path d="M'+x.toFixed(1)+' '+(y-4).toFixed(1)+' L'+(x+sd*8).toFixed(1)+' '+(y-2).toFixed(1)+' L'+x.toFixed(1)+' '+(y+3).toFixed(1)+'Z" fill="#F2F5E6" stroke="#6E8F55" stroke-width="1.2"/>'})}
 for(let s=0;s<6;s++)g+='<ellipse cx="'+((rnd(i*7+s,2)-.5)*w).toFixed(1)+'" cy="'+(-L*(.15+rnd(i*7+s,4)*.6)).toFixed(1)+'" rx="2.4" ry="1.6" fill="#E6F2DA" opacity=".85"/>';
 g+='<path d="M'+(-w*.4)+' '+(-L*.2)+' Q'+(-w*.45)+' '+(-L*.55)+' 0 '+(-L*.85)+'" stroke="#FFFFFF" stroke-width="3" fill="none" opacity=".45"/>';
 return g+'</g>'}
function aloePt(i,t,side){const a=AL.ang[i]*Math.PI/180,L=AL.len[i],y=-L*t,x=(side||0)*alw(t);return [AL.cx+x*Math.cos(a)-y*Math.sin(a),AL.pot+x*Math.sin(a)+y*Math.cos(a)]}
function aloePot(o){o=o||{};const c=AL.cx,y=AL.pot;let g=shadow(c,418,90);
 for(let i=0;i<7;i++)g+=aloeLeaf(i);
 g+='<path d="M'+(c-100)+' '+y+' L'+(c-72)+' 416 H'+(c+72)+' L'+(c+100)+' '+y+'Z" fill="var(--w-pot)" stroke="var(--w-pot2)" stroke-width="3"/><rect x="'+(c-106)+'" y="'+(y-6)+'" width="212" height="22" rx="5" fill="var(--w-pot2)"/><ellipse cx="'+c+'" cy="'+(y-3)+'" rx="90" ry="7" fill="var(--w-soil)"/>';
 return g}
/* 선생님이 자른 잎 조각(단면이 앞을 봄) */
const AC={cx:470,cy:356};
function aloeCutArt(o){o=o||{};const x=AC.cx,y=AC.cy;let g=boardArt()+knife(690,392,-8,.85)+tongs(330,396,0,.9);
 g+='<path d="M'+(x-170)+' '+(y-18)+' Q'+(x-110)+' '+(y-34)+' '+(x-10)+' '+(y-30)+' L'+(x-10)+' '+(y+26)+' Q'+(x-110)+' '+(y+30)+' '+(x-170)+' '+(y+14)+'Z" fill="#7DB36A" stroke="#3F6E32" stroke-width="2.5"/>';
 for(let t=0;t<5;t++)g+='<path d="M'+(x-150+t*30)+' '+(y-26)+' l3 -7 l3 7Z" fill="#F2F5E6" stroke="#6E8F55" stroke-width="1"/>';
 if(o.closed)return g+'<ellipse cx="'+x+'" cy="'+y+'" rx="22" ry="30" fill="#5E9150" stroke="#3F6E32" stroke-width="3"/>';
 g+='<ellipse cx="'+x+'" cy="'+y+'" rx="40" ry="32" fill="#4F8A3E" stroke="#2F5A24" stroke-width="3"/><ellipse cx="'+x+'" cy="'+(y+1)+'" rx="30" ry="22" fill="#E8F4D6" fill-opacity=".92" stroke="#B9D79C" stroke-width="1.5"/>';
 g+='<ellipse cx="'+(x-10)+'" cy="'+(y-8)+'" rx="9" ry="5" fill="#FFFFFF" opacity=".8"/><ellipse cx="'+(x+12)+'" cy="'+(y+8)+'" rx="5" ry="3" fill="#FFFFFF" opacity=".65"/>';
 if(o.shine)g+='<g'+an('lb-a-fade',0)+'>'+[[-20,-4],[4,-12],[18,2],[-6,12]].map(p=>'<path d="M'+(x+p[0])+' '+(y+p[1]-5)+' v10 M'+(x+p[0]-5)+' '+(y+p[1])+' h10" stroke="#FFFFFF" stroke-width="2.5"/>').join('')+'</g>';
 return g}
function tongs(x,y,rot,s){return '<g transform="translate('+x+' '+y+') rotate('+(rot||0)+') scale('+(s||1)+')"><path d="M0 0 L-90 -10 M0 0 L-90 10" stroke="#9AA3AD" stroke-width="7" stroke-linecap="round"/><circle cx="0" cy="0" r="7" fill="#69737D"/></g>'}
function tissue(x,y,wet,anim){let g='<g><rect x="'+(x-46)+'" y="'+(y-40)+'" width="92" height="80" rx="4" fill="#FFFFFF" stroke="#B9C2CA" stroke-width="2"/><path d="M'+(x-46)+' '+(y-10)+' H'+(x+46)+'" stroke="#E2E6EA" stroke-width="2"/>';
 if(wet)g+='<ellipse cx="'+x+'" cy="'+(y+6)+'" rx="26" ry="20" fill="#9FC7DA" fill-opacity=".55"'+(anim?an('lb-a-wet',.3):'')+'/>';
 return g+'</g>'}
const TIS={x:690,y:240};

/* ───────── 실험 4: 연잎(위에서 본 모습) ───────── */
const LO={cx:400,cy:250,rx:250,ry:190},DROPS=[[300,180],[470,160],[540,300]],MERGE=[520,372];
function lotusArt(o){o=o||{};const L=LO;let g='<ellipse cx="'+(L.cx+8)+'" cy="'+(L.cy+12)+'" rx="'+L.rx+'" ry="'+L.ry+'" fill="var(--w-shadow)"/>';
 let pts=[];for(let i=0;i<72;i++){const t=i/72*2*Math.PI,w=1+.018*Math.sin(t*9);pts.push([L.cx+L.rx*w*Math.cos(t),L.cy+L.ry*w*Math.sin(t)])}
 g+='<path d="'+P2(pts)+'" fill="#5C9E45" stroke="#3A6E2C" stroke-width="4" stroke-linejoin="round"/>';
 for(let i=0;i<15;i++){const t=i/15*2*Math.PI;g+='<path d="M'+L.cx+' '+L.cy+' L'+(L.cx+L.rx*.94*Math.cos(t)).toFixed(1)+' '+(L.cy+L.ry*.94*Math.sin(t)).toFixed(1)+'" stroke="#86C26A" stroke-width="2.4"/>'}
 g+='<ellipse cx="'+L.cx+'" cy="'+L.cy+'" rx="70" ry="54" fill="#4F8E3A" opacity=".55"/><ellipse cx="'+L.cx+'" cy="'+L.cy+'" rx="36" ry="28" fill="#43803A" opacity=".7"/><circle cx="'+L.cx+'" cy="'+L.cy+'" r="9" fill="#9CCB7E" stroke="#3A6E2C" stroke-width="2"/>';
 /* 아주 작은 털(확대해야 보임) */
 let d='';for(let i=0;i<520;i++){const t=rnd(i,1)*2*Math.PI,r=Math.sqrt(rnd(i,2))*.92,x=L.cx+L.rx*r*Math.cos(t),y=L.cy+L.ry*r*Math.sin(t);d+='M'+x.toFixed(1)+' '+y.toFixed(1)+'h1.4'}
 g+='<path d="'+d+'" stroke="#D6EDC8" stroke-width="1.4" opacity=".6" stroke-linecap="round"/>';
 return g}
function bead(x,y,r,anim){return '<g'+(anim||'')+'><ellipse cx="'+(x+r*.35)+'" cy="'+(y+r*.45)+'" rx="'+(r*1.02)+'" ry="'+(r*.8)+'" fill="#2F5E25" opacity=".45"/><circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="#CFEFFF" fill-opacity=".8" stroke="#5E9CC0" stroke-width="1.8"/><ellipse cx="'+(x-r*.35)+'" cy="'+(y-r*.38)+'" rx="'+(r*.32)+'" ry="'+(r*.2)+'" fill="#FFFFFF" transform="rotate(-30 '+(x-r*.35)+' '+(y-r*.38)+')"/><path d="M'+(x+r*.2)+' '+(y+r*.62)+' a'+(r*.6)+' '+(r*.4)+' 0 0 0 '+(r*.45)+' -'+(r*.35)+'" stroke="#FFFFFF" stroke-width="1.8" fill="none" opacity=".8"/></g>'}
function dropper(x,y,s,rot){return '<g transform="translate('+x+' '+y+') rotate('+(rot||0)+') scale('+(s||1)+')"><path d="M-7 0 L-5 -70 H5 L7 0 L2 12 H-2Z" fill="#EAF4FB" fill-opacity=".6" stroke="#5F8FA0" stroke-width="2.5" stroke-linejoin="round"/><path d="M-4 -30 V-4" stroke="#7CC3EC" stroke-width="5"/><rect x="-12" y="-110" width="24" height="42" rx="11" fill="#D9577A" stroke="#9E2F50" stroke-width="2.5"/></g>'}
function beaker(x,y,s){s=s||1;return '<g transform="translate('+x+' '+y+') scale('+s+')"><path d="M-34 -66 V30 Q-34 40 -24 40 H24 Q34 40 34 30 V-66" fill="#EAF4FB" fill-opacity=".35" stroke="#5F8FA0" stroke-width="3"/><path d="M-32 -20 H32 V30 Q32 38 24 38 H-24 Q-32 38 -32 30Z" fill="#7CC3EC" fill-opacity=".75"/><path d="M-34 -66 Q-40 -66 -42 -72" stroke="#5F8FA0" stroke-width="3" fill="none"/></g>'}

/* ───────── 실험복·장갑 ───────── */
function coat(x,y,s){return '<g transform="translate('+x+' '+y+') scale('+(s||1)+')"><path d="M-46 -64 L-18 -72 L0 -40 L18 -72 L46 -64 L62 30 L40 34 L36 -10 L34 72 H-34 L-36 -10 L-40 34 L-62 30Z" fill="#FFFFFF" stroke="#9AA6B2" stroke-width="3" stroke-linejoin="round"/><path d="M0 -40 V72" stroke="#9AA6B2" stroke-width="2"/><circle cx="-7" cy="-6" r="3" fill="#9AA6B2"/><circle cx="-7" cy="22" r="3" fill="#9AA6B2"/><rect x="12" y="10" width="16" height="12" rx="2" fill="none" stroke="#9AA6B2" stroke-width="2"/></g>'}
function gearArt(on,anim){if(!on)return coat(360,250,1.5)+itemArtAt('glove',620,280)+qmark(480,110);
 return '<g'+(anim?an('lb-a-up',0,'--from:100px'):'')+'><circle cx="480" cy="116" r="38" fill="#F2C6A0" stroke="#B9875F" stroke-width="3"/>'+coat(480,262,1.75)+hand(330,240,-70,1.4,1)+hand(630,240,-110,1.4,1)+'</g>'}

/* ───────── 준비물 카드 ───────── */
function itemArt(k){const A={
  leaves:'<g transform="translate(-62 -50) scale(.5)">'+leafU('L1',{})+'</g><g transform="translate(-6 -48) scale(.48)">'+leafU('L2',{})+'</g><g transform="translate(26 -46) scale(.46)">'+leafU('L3',{})+'</g>',
  sticker:'<rect x="-52" y="-34" width="104" height="70" rx="5" fill="#FFFFFF" stroke="#B9C2CA" stroke-width="2"/>'+[0,1,2,3,4,5].map(i=>chip(-30+(i%3)*30,-12+Math.floor(i/3)*28,i+1,11)).join(''),
  paper:'<rect x="-50" y="-36" width="100" height="74" rx="3" fill="#FFFDF8" stroke="#A39B8B" stroke-width="2"/>',
  lens:magnifier(-10,-8,.95,0),
  vglove:'<g opacity=".9">'+hand(-6,0,-60,.9,0).replace(/#F2C6A0/g,'#EAF4FB').replace(/#B9875F/g,'#8FA9BC').replace(/#5C8FCB/g,'#EAF4FB').replace(/#3D6A9C/g,'#8FA9BC')+'</g>',
  hyac:'<g transform="translate(-133 -95) scale(.24)">'+hyacinth(560,330,{})+'</g>',
  tank:'<rect x="-56" y="-10" width="112" height="44" fill="#9FD3F0" fill-opacity=".7"/><path d="M-56 -32 V34 H56 V-32" fill="none" stroke="#6E9FB5" stroke-width="4"/>',
  knife:knife(-20,0,-10,.85),
  board:'<rect x="-60" y="-24" width="120" height="50" rx="6" fill="#D9B27C" stroke="#9C7443" stroke-width="2.5"/><path d="M-50 -6 Q0 -10 50 -4 M-50 10 Q0 6 50 12" stroke="#B88C55" stroke-width="1.5" fill="none"/>',
  coat:coat(0,-2,.62),glove:hand(-14,-10,-60,.75,1)+hand(22,8,-60,.75,1),
  aloe:'<g transform="translate(-90 -126) scale(.3)">'+aloePot()+'</g>',
  tongs:tongs(40,0,0,.95),
  tissue:tissue(0,0,false),
  lotus:'<g transform="translate(-60 -38) scale(.3)">'+lotusArt().replace(/<ellipse cx="408"[^>]*\/>/,'')+'</g>',
  dropper:dropper(0,40,.82,0),
  beaker:beaker(0,4,.8)};
 return A[k]||''}
function itemArtAt(k,x,y){return '<g transform="translate('+x+' '+y+') scale(1.4)">'+itemArt(k)+'</g>'}
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
