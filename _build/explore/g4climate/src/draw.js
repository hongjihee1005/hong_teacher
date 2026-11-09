/* ───────── 그림: 실험대 장면 — 모두 직접 그린 SVG (기후변화와 우리 생활: 해수면 상승 모형실험) ───────── */
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
function bgTop(){let g='<rect x="-3000" y="-3000" width="7000" height="7000" fill="var(--w-top)"/>';
 for(let i=0;i<14;i++)g+='<path d="M-3000 '+(-40+i*46)+' Q480 '+(-30+i*46+(i%2?10:-10))+' 4000 '+(-40+i*46)+'" stroke="var(--w-grain)" stroke-width="1.4" fill="none" opacity=".28"/>';
 return g}
const P2=pts=>'M'+pts.map(p=>p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' L')+' Z';
function rnd(i,s){const h=Math.sin(i*12.9898+(s||0)*78.233)*43758.5453;return h-Math.floor(h)}
function magnifier(x,y,s,rot){return '<g transform="translate('+x+' '+y+') rotate('+(rot||0)+') scale('+(s||1)+')"><circle r="34" fill="#E8F4FA" fill-opacity=".35" stroke="#2B3445" stroke-width="7"/><path d="M24 24 L62 62" stroke="#6B4A2B" stroke-width="13" stroke-linecap="round"/><path d="M-16 -18 a24 24 0 0 1 20 -8" stroke="#FFFFFF" stroke-width="4" fill="none" opacity=".8"/></g>'}
function chip(x,y,n,r){r=r||20;return '<g><circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="#FFD54A" stroke="#9A7300" stroke-width="2"/><text x="'+x+'" y="'+(y+r*.36)+'" text-anchor="middle" font-size="'+(r*1.05)+'" font-weight="800" fill="#3B2A00">'+n+'</text></g>'}
function kid(x,y,col){return '<g><circle cx="'+x+'" cy="'+(y-26)+'" r="16" fill="#F2C6A0" stroke="#B9875F" stroke-width="2"/><path d="M'+(x-22)+' '+(y+18)+' Q'+(x-22)+' '+(y-8)+' '+x+' '+(y-8)+' Q'+(x+22)+' '+(y-8)+' '+(x+22)+' '+(y+18)+'Z" fill="'+col+'"/></g>'}
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


/* ───────── 해수면 상승 모형실험: 옆에서 본 투명한 아크릴 상자 ─────────
   상자·자갈 비탈·모형의 모양과 크기, 물 높이(LVL)는 이 실험관에서 정한 값 */
const TK={x0:90,x1:820,top:150,bot:414},GX=380,GS=.28;
const gy=x=>TK.bot-(x-GX)*GS;                 /* 자갈 겉면 높이 */
const shoreX=L=>GX+(TK.bot-L)/GS;             /* 물과 자갈이 맞닿은 곳 */
const ISL={cx:225,l:130,r:320,top:296},HSE={l:500,r:555,base:372,wall:306},TRE={x:585,base:360};
const MK=['처음','1컵','2컵','3컵'],MKX=[880,932,880,932];
function tankBack(){const T=TK;return shadow((T.x0+T.x1)/2,T.bot+4,(T.x1-T.x0)/2+6)+'<rect x="'+T.x0+'" y="'+T.top+'" width="'+(T.x1-T.x0)+'" height="'+(T.bot-T.top)+'" fill="rgba(214,232,242,.30)"/>'}
function tankFront(){const T=TK;return '<rect x="'+T.x0+'" y="'+T.top+'" width="'+(T.x1-T.x0)+'" height="'+(T.bot-T.top)+'" rx="3" fill="none" stroke="#6F97AE" stroke-width="5"/><path d="M'+(T.x0+14)+' '+(T.top+12)+' V'+(T.bot-60)+'" stroke="#FFFFFF" stroke-width="5" opacity=".55" stroke-linecap="round"/><rect x="'+(T.x0-6)+'" y="'+(T.bot-2)+'" width="'+(T.x1-T.x0+12)+'" height="6" rx="2" fill="#6F97AE"/>'}
function pebbles(x0,x1,seed){let g='';for(let i=0;i<150;i++){const x=x0+rnd(i,seed)*(x1-x0),top=gy(x),r=5+rnd(i,seed+1)*4,y=top+r+rnd(i,seed+2)*(TK.bot-top-r);
  if(y+r>TK.bot+2||y-r<top-1)continue;g+='<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="'+r.toFixed(1)+'" fill="'+['#9C8A70','#CBB99B','#A89276','#B7A386'][i%4]+'" stroke="#7D6C54" stroke-width="1"/>'}return g}
function gravelArt(anim){const x1=TK.x1-3,d='M'+GX+' '+TK.bot+' L'+x1+' '+gy(x1).toFixed(1)+' L'+x1+' '+TK.bot+'Z';
 return '<g'+(anim?an('lb-a-rise',0):'')+'><path d="'+d+'" fill="#B9A68A" stroke="#8C7A5E" stroke-width="2"/>'+pebbles(GX+4,x1-4,7)+'</g>'}
function islandArt(anim){const I=ISL;return '<g'+(anim?an('lb-a-down',0,'--from:-150px'):'')+'><path d="M'+I.l+' '+TK.bot+' Q'+(I.l+20)+' 330 '+(I.cx-30)+' '+(I.top+8)+' Q'+I.cx+' '+(I.top-6)+' '+(I.cx+30)+' '+(I.top+8)+' Q'+(I.r-20)+' 330 '+I.r+' '+TK.bot+'Z" fill="#D9B67A" stroke="#9C7A43" stroke-width="2.5"/>'+
 '<path d="M'+(I.cx-40)+' 350 q20 -6 40 0 M'+(I.cx+6)+' 378 q22 -6 44 0" stroke="#C29A5C" stroke-width="2" fill="none"/>'+
 '<path d="M'+I.cx+' '+(I.top+2)+' q4 -26 2 -50" stroke="#7A5230" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M'+(I.cx+2)+' '+(I.top-48)+' q-24 -12 -40 6 M'+(I.cx+2)+' '+(I.top-48)+' q24 -12 40 6 M'+(I.cx+2)+' '+(I.top-48)+' q-8 -22 -26 -24 M'+(I.cx+2)+' '+(I.top-48)+' q8 -22 26 -24" stroke="#3F9A4A" stroke-width="8" fill="none" stroke-linecap="round"/></g>'}
function houseArt(){const H=HSE,cx=(H.l+H.r)/2,w=H.r-H.l;return '<g><rect x="'+(H.l-6)+'" y="'+H.base+'" width="'+(w+12)+'" height="9" rx="2" fill="#8A6A3E"/><rect x="'+H.l+'" y="'+H.wall+'" width="'+w+'" height="'+(H.base-H.wall)+'" fill="#F1E1C6" stroke="#8A6A3E" stroke-width="2.5"/>'+
 '<rect x="'+(H.l+7)+'" y="330" width="15" height="18" fill="#9CC7E6" stroke="#5B7F99" stroke-width="2"/><rect x="'+(H.r-22)+'" y="330" width="15" height="18" fill="#9CC7E6" stroke="#5B7F99" stroke-width="2"/>'+
 '<path d="M'+(H.l-10)+' '+H.wall+' L'+cx+' '+(H.wall-40)+' L'+(H.r+10)+' '+H.wall+'Z" fill="#B8452F" stroke="#7E2C1C" stroke-width="2"/></g>'}
function treeArt(){const T=TRE;return '<g><ellipse cx="'+T.x+'" cy="'+(T.base+1)+'" rx="15" ry="4" fill="#5E7F43"/><rect x="'+(T.x-4)+'" y="'+(T.base-26)+'" width="8" height="26" fill="#7A5230"/><path d="M'+(T.x-19)+' '+(T.base-20)+' L'+T.x+' '+(T.base-64)+' L'+(T.x+19)+' '+(T.base-20)+'Z" fill="#3F9A4A" stroke="#2C6E35" stroke-width="2"/><path d="M'+(T.x-14)+' '+(T.base-38)+' L'+T.x+' '+(T.base-70)+' L'+(T.x+14)+' '+(T.base-38)+'Z" fill="#4DAA57" stroke="#2C6E35" stroke-width="2"/></g>'}
/* 물: L = 지금 물 높이, from = 바로 앞 높이(붓는 동안 차오름) */
function waterArt(L,from){const T=TK,x=T.x0+3,w=T.x1-T.x0-6;if(L==null)return '';let g='';
 const L0=from!=null?from:L;g+='<rect x="'+x+'" y="'+L0+'" width="'+w+'" height="'+(T.bot-L0)+'" fill="#4FA8DF" fill-opacity=".42"/>';
 if(from!=null&&from>L)g+='<rect'+an('lb-a-rise',.55,'animation-duration:1.5s')+' x="'+x+'" y="'+L+'" width="'+w+'" height="'+(from-L)+'" fill="#4FA8DF" fill-opacity=".42"/>';
 g+='<path'+(from!=null&&from>L?an('lb-a-fade',1.9,'animation-duration:.3s'):'')+' d="M'+x+' '+L+' H'+(x+w)+'" stroke="#1C6FA8" stroke-width="3"/>';
 return g}
/* 물 높이 표시(상자 바깥 오른쪽 면): n개, 마지막 것은 anim */
function marksArt(n,anim){let g='';for(let i=0;i<n;i++){const y=LVL[i],a=anim&&i===n-1,lx=MKX[i];
  g+='<g'+(a?an('lb-a-fade',.55):'')+'><path d="M'+(TK.x1-14)+' '+y+' H'+(TK.x1+18)+'" stroke="#C2332C" stroke-width="4" stroke-linecap="round"/><path d="M'+(TK.x1+18)+' '+y+' H'+(lx-26)+'" stroke="#C2332C" stroke-width="1.5" stroke-dasharray="4 4"/>'+mini(lx,y+6,MK[i],18)+'</g>'}
 return g}
function penArt(x,y,anim){return '<g'+(anim?an('lb-a-slide',0,'--dx:60px'):'')+'><g transform="translate('+x+' '+y+') rotate(-55)"><rect x="-8" y="-86" width="16" height="74" rx="5" fill="#2A3342"/><rect x="-8" y="-86" width="16" height="20" rx="5" fill="#C2332C"/><path d="M-6 -12 L0 4 L6 -12Z" fill="#C2332C"/></g></g>'}
/* 플라스틱 컵(옆에서 봄) — pour면 기울여 붓는 움직임과 물줄기 */
function cupArt(x,y,pour,toY){let g='<g'+(pour?an('lb-a-tilt',0,'--rot:-62deg;animation-duration:2s'):'')+'><path d="M'+(x-26)+' '+(y-36)+' h52 l-7 72 h-38z" fill="#E7F6FD" fill-opacity=".9" stroke="#5B8FB3" stroke-width="3"/><path d="M'+(x-21)+' '+(y-6)+' h42 l-4 40 h-34z" fill="#4FA8DF" fill-opacity=".65"/></g>';
 if(pour)g+='<path'+an('lb-a-stream',0)+' d="M'+(x-55)+' '+(y+31)+' q-8 24 -6 '+(toY-y-31)+'" stroke="#4FA8DF" stroke-width="9" fill="none" stroke-linecap="round" stroke-dasharray="40 14"/>';
 return g}
/* 물에 닿지 않는 자갈(점선) */
function dryArt(L){const xs=shoreX(L),x1=TK.x1-3;return '<path d="M'+xs.toFixed(1)+' '+L+' L'+x1+' '+gy(x1).toFixed(1)+' L'+x1+' '+L+'Z" fill="#FFD54A" fill-opacity=".28" stroke="#C25E00" stroke-width="4" stroke-dasharray="10 7" stroke-linejoin="round"/>'}
/* 장치 한 장: o.gravel·island·house(집과 나무)·level(물 높이 번호, null이면 물 없음)·from(붓기 전 번호)·marks(표시 수)·markAnim·dry */
function rig(o){o=o||{};let g=bg({})+tankBack();
 if(o.gravel)g+=gravelArt(o.gravelAnim);if(o.island)g+=islandArt(o.islandAnim);
 if(o.house)g+='<g'+(o.houseAnim?an('lb-a-down',0,'--from:-170px'):'')+'>'+houseArt()+treeArt()+'</g>';
 if(o.level!=null)g+=waterArt(LVL[o.level],o.from!=null?(o.from<0?TK.bot-2:LVL[o.from]):null);
 if(o.dry)g+=dryArt(LVL[o.level]);
 g+=tankFront()+marksArt(o.marks||0,o.markAnim);
 return g}
/* 실험복과 실험용 장갑 */
function coatArt(x,y,s){return '<g transform="translate('+x+' '+y+') scale('+(s||1)+')"><path d="M-40 -60 L-14 -70 L0 -50 L14 -70 L40 -60 L52 40 L-52 40Z" fill="#FFFFFF" stroke="#9AA6B2" stroke-width="3"/><path d="M0 -50 V40" stroke="#9AA6B2" stroke-width="2"/><circle cx="-6" cy="-20" r="3" fill="#9AA6B2"/><circle cx="-6" cy="4" r="3" fill="#9AA6B2"/><rect x="18" y="-14" width="20" height="16" fill="none" stroke="#9AA6B2" stroke-width="2"/></g>'}
function gloveArt(x,y,s,rot){return '<g transform="translate('+x+' '+y+') rotate('+(rot||0)+') scale('+(s||1)+')"><path d="M-18 30 V-6 Q-20 -12 -16 -14 L-16 -34 Q-16 -40 -11 -40 Q-6 -40 -6 -34 L-6 -18 L-4 -40 Q-4 -46 1 -46 Q6 -46 6 -40 L6 -18 L9 -36 Q9 -42 14 -42 Q19 -42 19 -36 L18 -10 L26 -22 Q30 -27 34 -23 Q37 -20 34 -15 L20 14 V30Z" fill="#CFE8F7" stroke="#5B8FB3" stroke-width="2.5" stroke-linejoin="round"/></g>'}
function kidCoat(x,y){return '<g><circle cx="'+x+'" cy="'+(y-150)+'" r="34" fill="#F2C6A0" stroke="#B9875F" stroke-width="2.5"/><path d="M'+(x-36)+' '+(y-158)+' q36 -46 72 0" fill="#3A2A1A"/><circle cx="'+(x-12)+'" cy="'+(y-148)+'" r="3.5" fill="#2A3342"/><circle cx="'+(x+12)+'" cy="'+(y-148)+'" r="3.5" fill="#2A3342"/><path d="M'+(x-10)+' '+(y-132)+' q10 7 20 0" stroke="#2A3342" stroke-width="2.5" fill="none"/>'+
 coatArt(x,y-48,1.15)+gloveArt(x-80,y-40,1,-20)+gloveArt(x+80,y-40,1,20)+'</g>'}

/* ───────── 준비물 카드 ───────── */
function itemArt(k){const A={
  box:'<rect x="-66" y="-46" width="132" height="84" rx="3" fill="rgba(214,232,242,.5)" stroke="#6F97AE" stroke-width="4"/><path d="M-56 -36 V20" stroke="#FFFFFF" stroke-width="4" opacity=".7"/>',
  gravel:[...Array(16)].map((_,i)=>'<circle cx="'+(-48+(i%6)*19+(Math.floor(i/6)%2)*9)+'" cy="'+(26-Math.floor(i/6)*17)+'" r="'+(7+rnd(i,4)*3).toFixed(1)+'" fill="'+['#9C8A70','#CBB99B','#A89276','#B7A386'][i%4]+'" stroke="#7D6C54" stroke-width="1"/>').join(''),
  models:'<g transform="translate(-48 34) scale(.42) translate(-225 -414)">'+islandArt()+'</g><g transform="translate(18 34) scale(.6) translate(-527 -380)">'+houseArt()+'</g><g transform="translate(56 34) scale(.6) translate(-585 -361)">'+treeArt()+'</g>',
  water:'<path d="M-26 -50 h52 v14 l10 12 v60 q0 8 -8 8 h-56 q-8 0 -8 -8 v-60 l10 -12z" fill="#E7F6FD" stroke="#5B8FB3" stroke-width="3"/><path d="M-34 -6 h68 v38 q0 8 -8 8 h-52 q-8 0 -8 -8z" fill="#4FA8DF" fill-opacity=".6"/>',
  cup:'<path d="M-30 -42 h60 l-8 84 h-44z" fill="#E7F6FD" stroke="#5B8FB3" stroke-width="3"/><path d="M-30 -42 h60" stroke="#5B8FB3" stroke-width="5"/>',
  pen:'<g transform="rotate(-35)"><rect x="-10" y="-60" width="20" height="96" rx="6" fill="#2A3342"/><rect x="-10" y="-60" width="20" height="26" rx="6" fill="#C2332C"/><path d="M-7 36 L0 54 L7 36Z" fill="#C2332C"/></g>',
  coat:coatArt(0,4,.9),
  glove:gloveArt(-24,6,1,-12)+gloveArt(26,6,1,12)};
 return A[k]||''}
function itemArtAt(k,x,y){return '<g transform="translate('+x+' '+y+') scale(1.4)">'+itemArt(k)+'</g>'}
