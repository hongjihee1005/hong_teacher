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

/* ───────── 막대(실험 1·3) ───────── */
const RODC={wood:['#C98B4E','#7A4A1E'],iron:['#9AA3AD','#4E565F'],glass:['#CFE6EE','#4F8FA3'],plastic:['#F2C230','#9C7406']};
/* 가로 막대. x 왼쪽, cy 가운데, L 길이, T 굵기. o.scr: 긁힌 자국, o.hl: 고른 막대 테두리 */
function rodH(k,x,cy,L,T,o){o=o||{};T=T||28;const y=cy-T/2,c=RODC[k];let g='<g>';
 if(k==='glass')g+='<rect x="'+x+'" y="'+y+'" width="'+L+'" height="'+T+'" rx="'+(T/2.4)+'" fill="#D8EEF5" fill-opacity=".38" stroke="'+c[1]+'" stroke-width="2.5"/><rect x="'+(x+T*.4)+'" y="'+(y+T*.18)+'" width="'+(L*.42)+'" height="'+(T*.14)+'" rx="2" fill="#FFFFFF" opacity=".85"/>';
 else{g+='<rect x="'+x+'" y="'+y+'" width="'+L+'" height="'+T+'" rx="'+(T/2.4)+'" fill="'+c[0]+'" stroke="'+c[1]+'" stroke-width="2.5"/>';
  if(k==='wood')for(let i=0;i<3;i++)g+='<path d="M'+(x+8)+' '+(y+T*(.28+i*.22)).toFixed(1)+' q'+(L*.25)+' '+(i%2?4:-4)+' '+(L*.5)+' 0 t'+(L*.45)+' 0" stroke="#8A5527" stroke-width="1.5" fill="none"/>';
  if(k==='iron')g+='<rect x="'+(x+6)+'" y="'+(y+T*.16)+'" width="'+(L-12)+'" height="'+(T*.2)+'" rx="2" fill="#EEF2F6" opacity=".95"/><rect x="'+(x+L*.3)+'" y="'+(y+T*.62)+'" width="'+(L*.4)+'" height="'+(T*.08)+'" rx="1" fill="#C9D0D8"/>';
  if(k==='plastic')g+='<rect x="'+(x+T*.4)+'" y="'+(y+T*.18)+'" width="'+(L*.7)+'" height="'+(T*.14)+'" rx="2" fill="#FFF3C4" opacity=".9"/>'}
 if(o.scr){const m=x+L/2;for(let i=-4;i<=4;i++)g+='<path d="M'+(m+i*9-12)+' '+(y+T*.3).toFixed(1)+' l24 '+(T*.4).toFixed(1)+'" stroke="'+(k==='glass'?'#7FA9B8':k==='wood'?'#E9C79B':'#FFFFFF')+'" stroke-width="2" opacity=".95"/>'}
 if(o.hl)g+='<rect x="'+(x-6)+'" y="'+(y-6)+'" width="'+(L+12)+'" height="'+(T+12)+'" rx="'+(T/2)+'" fill="none" stroke="var(--lb-lens)" stroke-width="3" stroke-dasharray="8 6"/>';
 return g+'</g>'}
/* 세운 막대(실험 3). cx 가운데, yb 바닥 */
function rodV(k,cx,yb,L,T){L=L||150;T=T||26;return '<g transform="translate('+cx+' '+yb+') rotate(-90)">'+rodH(k,0,0,L,T)+'</g>'}
/* 글씨 쓴 종이 */
const PAPER={x:150,y:118,w:660,h:300,rows:[178,246,314,382],txt:'과학 시간이 정말 좋아요'};
function paperArt(){const P=PAPER;let g=shadow(P.x+P.w/2,P.y+P.h+4,P.w/2)+'<rect x="'+P.x+'" y="'+P.y+'" width="'+P.w+'" height="'+P.h+'" rx="6" fill="#FFFDF8" stroke="#BDB3A2" stroke-width="2"/>';
 P.rows.forEach(y=>{g+='<text x="'+(P.x+P.w/2)+'" y="'+(y+12)+'" text-anchor="middle" font-size="34" font-weight="800" fill="#2B3445">'+P.txt+'</text>'});return g}
/* 사포 */
const SAND={x:240,y:350,w:480,h:66};
function sandArt(){const S=SAND;let g='<rect x="'+S.x+'" y="'+S.y+'" width="'+S.w+'" height="'+S.h+'" rx="4" fill="#C79C62" stroke="#8C6A35" stroke-width="2"/>';
 for(let i=0;i<140;i++){const h1=Math.sin(i*12.9898)*43758.5453,h2=Math.sin(i*78.233)*24634.6345,px=S.x+8+(h1-Math.floor(h1))*(S.w-16),py=S.y+6+(h2-Math.floor(h2))*(S.h-12);g+='<circle cx="'+px.toFixed(1)+'" cy="'+py.toFixed(1)+'" r="'+(1.2+(i%3)*.5)+'" fill="'+(i%2?'#8C6A35':'#E2C38A')+'"/>'}
 return g}
/* 수조. x 왼쪽, top 위, w 폭, bot 바닥, wl 물 높이 */
function tankArt(x,top,w,bot,wl,o){o=o||{};let g=shadow(x+w/2,bot+6,w/2+10);
 g+='<rect x="'+x+'" y="'+wl+'" width="'+w+'" height="'+(bot-wl)+'" fill="#9FD3F0" fill-opacity=".7"/><path d="M'+x+' '+wl+' H'+(x+w)+'" stroke="#4E9CCB" stroke-width="3"/>';
 if(o.inner)g+=o.inner;
 g+='<path d="M'+x+' '+top+' V'+bot+' H'+(x+w)+' V'+top+'" fill="none" stroke="#6E9FB5" stroke-width="5" stroke-linejoin="round"/><path d="M'+(x+10)+' '+(top+14)+' V'+(bot-20)+'" stroke="#FFFFFF" stroke-width="4" opacity=".55"/>';
 return g}

/* ───────── 실험 2: 가위 · 책 · 컵 · 풍선 · 쟁반 ───────── */
const TRAY={x:60,y:360,w:840,h:58};
function trayArt(){const T=TRAY;return '<path d="M'+T.x+' '+(T.y+T.h)+' L'+(T.x+26)+' '+T.y+' H'+(T.x+T.w-26)+' L'+(T.x+T.w)+' '+(T.y+T.h)+'Z" fill="#A7C4D8" stroke="#5F87A3" stroke-width="3" stroke-linejoin="round"/><path d="M'+(T.x+40)+' '+(T.y+10)+' H'+(T.x+T.w-40)+'" stroke="#D7E7F1" stroke-width="3"/>'}
function scissors(x,y,s,rot){s=s||1;return '<g transform="translate('+x+' '+y+') rotate('+(rot||0)+') scale('+s+')"><path d="M-6 -4 L70 -14 L74 -8 Z" fill="#C3CBD3" stroke="#69737D" stroke-width="2" stroke-linejoin="round"/><path d="M-6 4 L70 14 L74 8 Z" fill="#AEB7C0" stroke="#69737D" stroke-width="2" stroke-linejoin="round"/><circle cx="0" cy="0" r="4" fill="#69737D"/>'+
 '<ellipse cx="-28" cy="-14" rx="20" ry="12" fill="none" stroke="#2F68B0" stroke-width="8"/><ellipse cx="-28" cy="14" rx="20" ry="12" fill="none" stroke="#2F68B0" stroke-width="8"/></g>'}
function book(x,y,s){s=s||1;return '<g transform="translate('+x+' '+y+') scale('+s+')"><rect x="-56" y="-14" width="112" height="28" rx="3" fill="#FFFDF8" stroke="#A39B8B" stroke-width="2"/><path d="M-52 -6 H52 M-52 2 H52 M-52 9 H52" stroke="#D6CDBD" stroke-width="1.5"/><rect x="-60" y="-20" width="120" height="8" rx="2" fill="#C2453A" stroke="#7E2A22" stroke-width="2"/><rect x="-60" y="12" width="120" height="8" rx="2" fill="#C2453A" stroke="#7E2A22" stroke-width="2"/><rect x="-64" y="-20" width="8" height="40" rx="2" fill="#9E3329"/></g>'}
/* 투명한 컵. cx 가운데, yb 바닥, fill 높이 비율(0~1), col 액체 색 */
function glassCup(cx,yb,fill,col,s,o){s=s||1;o=o||{};const h=96*s,wt=36*s,wb=28*s,y=yb-h;let g=shadow(cx,yb+2,wb+8);
 if(fill>0){const ly=yb-h*fill*.9,wl=wb+(wt-wb)*(fill*.9);g+='<path d="M'+(cx-wl)+' '+ly.toFixed(1)+' L'+(cx-wb)+' '+yb+' H'+(cx+wb)+' L'+(cx+wl)+' '+ly.toFixed(1)+'Z" fill="'+col+'"'+(o.wave?an('lb-a-shake2',0):'')+'/>'}
 g+='<path d="M'+(cx-wt)+' '+y+' L'+(cx-wb)+' '+yb+' H'+(cx+wb)+' L'+(cx+wt)+' '+y+'" fill="#EAF4FB" fill-opacity=".35" stroke="#5F8FA0" stroke-width="3" stroke-linejoin="round"/><path d="M'+(cx-wt+8)+' '+(y+10)+' L'+(cx-wb+6)+' '+(yb-10)+'" stroke="#FFFFFF" stroke-width="3" opacity=".7"/>';
 return g}
const WATER='#7CC3EC',JUICE='#F59E2E';
/* 부푼 풍선. sz 1 = 가득, 0.45 = 조금 남음 */
function balloon(cx,yb,sz){sz=sz==null?1:sz;const r=58*sz,cy=yb-26-r*1.15;return '<g><path d="M'+cx+' '+yb+' q-6 -12 0 -24" stroke="#8A5A6B" stroke-width="2.5" fill="none"/><path d="M'+(cx-7)+' '+(yb-22)+' L'+(cx+7)+' '+(yb-22)+' L'+cx+' '+(yb-30)+'Z" fill="#D9577A"/>'+
 '<ellipse cx="'+cx+'" cy="'+cy.toFixed(1)+'" rx="'+r.toFixed(1)+'" ry="'+(r*1.15).toFixed(1)+'" fill="#F38BA8" fill-opacity=".5" stroke="#C8456B" stroke-width="3"/><ellipse cx="'+(cx-r*.38).toFixed(1)+'" cy="'+(cy-r*.45).toFixed(1)+'" rx="'+(r*.16).toFixed(1)+'" ry="'+(r*.28).toFixed(1)+'" fill="#FFFFFF" opacity=".7"/></g>'}
/* 공기가 나가는 바람 선 */
function puff(x,y,dir){dir=dir||1;let g='<g stroke="#8FA9C2" stroke-width="3.5" fill="none" stroke-linecap="round"'+an('lb-a-fade',0)+'>';
 for(let i=0;i<3;i++)g+='<path d="M'+x+' '+(y-14+i*14)+' q'+(16*dir)+' -8 '+(32*dir)+' 0 t'+(32*dir)+' 0"/>';return g+'</g>'}
function drops(x,y,col){let g='';for(let i=0;i<4;i++)g+='<path d="M'+(x-18+i*12)+' '+(y+i*10)+' q-5 9 0 13 q5 -4 0 -13z" fill="'+col+'"'+an('lb-a-drip',.15*i)+'/>';return g}
function puddle(cx,y,col,w){w=w||70;return '<ellipse cx="'+cx+'" cy="'+y+'" rx="'+w+'" ry="'+(w*.18).toFixed(1)+'" fill="'+col+'" fill-opacity=".8"/>'}

/* ───────── 실험 3: 모양이 다른 투명한 용기 ㉮ ㉯ ㉰ (모양·크기는 이 자료에서 정한 것) ───────── */
const JB=420;
const JARS=[{cx:190,H:210,w:h=>92,nm:'㉮'},{cx:480,H:120,bot:28,w:h=>34+176*(h/120),nm:'㉯'},{cx:770,H:200,w:h=>82+92*Math.sin(Math.PI*h/200),nm:'㉰'}];
const LVOL=11000;   /* 물(주스)의 양 — 같은 양을 옮김 */
function jarOutline(j){const v=JARS[j],b=JB-(v.bot||0);let L=[],R=[];for(let h=0;h<=v.H;h+=4){L.push([v.cx-v.w(h)/2-4,b-h]);R.push([v.cx+v.w(h)/2+4,b-h])}
 return 'M'+L.map(p=>p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' L')+' M'+R.map(p=>p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' L')+' M'+L[0][0].toFixed(1)+' '+L[0][1]+' L'+R[0][0].toFixed(1)+' '+R[0][1]}
function levelOf(j,vol){const v=JARS[j];let a=0;for(let h=0;h<v.H;h+=.5){a+=v.w(h)*.5;if(a>=vol)return h}return v.H}
function liquidIn(j,vol,col,anim){const v=JARS[j],b=JB-(v.bot||0),H=levelOf(j,vol);let L=[],R=[];for(let h=0;h<=H;h+=2){L.push([v.cx-v.w(h)/2,b-h]);R.push([v.cx+v.w(h)/2,b-h])}
 const pts=L.concat(R.reverse()).map(p=>p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' L');
 return '<path d="M'+pts+'Z" fill="'+col+'" fill-opacity=".85"'+(anim?an('lb-a-rise',0,'transform-box:fill-box'):'')+'/>'}
function jarArt(j){const v=JARS[j];let g=shadow(v.cx,JB+4,v.w(0)/2+16)+'<path d="'+jarOutline(j)+'" stroke="#7AA7BD" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
 if(v.bot)g+='<path d="M'+v.cx+' '+(JB-v.bot)+' V'+JB+' M'+(v.cx-40)+' '+JB+' H'+(v.cx+40)+'" stroke="#7AA7BD" stroke-width="6"/>';
 return g}
function jarName(j){const v=JARS[j];return mini(v.cx,JB+40,v.nm,22)}
/* 유성펜 표시 */
function markLine(j,vol){const v=JARS[j],b=JB-(v.bot||0),h=levelOf(j,vol),w=v.w(h)/2+10;return '<path d="M'+(v.cx-w).toFixed(1)+' '+(b-h).toFixed(1)+' H'+(v.cx+w).toFixed(1)+'" stroke="#222831" stroke-width="3.5" stroke-dasharray="10 6"/>'}
function pen(x,y,rot){return '<g transform="translate('+x+' '+y+') rotate('+(rot||0)+')"><rect x="0" y="-7" width="96" height="14" rx="5" fill="#2B3445"/><rect x="62" y="-7" width="34" height="14" rx="4" fill="#4C5668"/><path d="M0 -6 L-14 0 L0 6Z" fill="#222831"/></g>'}

/* ───────── 실험 4: 수조 · 구멍 뚫린 컵 · 압축 물휴지 ───────── */
const EF={tx:230,tt:120,tw:500,tb:440,wl:250,cx:480};
/* 뒤집은 컵: 위(구멍 쪽) 폭 92, 아래(입구) 폭 132, 높이 150. top = 컵 위쪽 y */
function cupInv(top,o){o=o||{};const cx=EF.cx,h=150,wt=46,wb=66,yb=top+h;let g='';
 if(o.sub)g+='<path d="M'+(cx-wt+2)+' '+(top+2)+' L'+(cx-wb+3)+' '+yb+' H'+(cx+wb-3)+' L'+(cx+wt-2)+' '+(top+2)+'Z" fill="var(--w-wall)"/>';
 if(o.water){const wy=Math.max(top+4,o.water);const t=(wy-top)/h,ww=wt+(wb-wt)*t;g+='<path d="M'+(cx-ww+3).toFixed(1)+' '+wy.toFixed(1)+' L'+(cx-wb+3)+' '+yb+' H'+(cx+wb-3)+' L'+(cx+ww-3).toFixed(1)+' '+wy.toFixed(1)+'Z" fill="#9FD3F0"/>'}
 /* 압축 물휴지(안쪽 바닥 = 위) */
 const wet=!!o.wet;if(o.wipe)g+=wet?'<rect x="'+(cx-34)+'" y="'+(top+6)+'" width="68" height="34" rx="9" fill="#E3EEF6" stroke="#7FA0B8" stroke-width="2.5"'+(o.grow?an('lb-a-grow',0,'transform-box:fill-box'):'')+'/><path d="M'+(cx-24)+' '+(top+18)+' q12 6 24 0 t24 0 M'+(cx-24)+' '+(top+28)+' q12 6 24 0 t24 0" stroke="#A9C2D4" stroke-width="2" fill="none"/>':'<rect x="'+(cx-16)+'" y="'+(top+6)+'" width="32" height="12" rx="3" fill="#FFFFFF" stroke="#9AA6B2" stroke-width="2"/>';
 g+='<path d="M'+(cx-wt)+' '+top+' L'+(cx-wb)+' '+yb+' M'+(cx+wt)+' '+top+' L'+(cx+wb)+' '+yb+' M'+(cx-wt)+' '+top+' H'+(cx-7)+' M'+(cx+7)+' '+top+' H'+(cx+wt)+'" fill="none" stroke="#5F8FA0" stroke-width="4" stroke-linecap="round"/>';
 g+='<path d="M'+(cx-wt)+' '+top+' L'+(cx-wb)+' '+yb+' H'+(cx+wb)+' L'+(cx+wt)+' '+top+'Z" fill="#EAF4FB" fill-opacity=".18"/>';
 if(o.tape)g+='<rect x="'+(cx-22)+'" y="'+(top-7)+'" width="44" height="9" rx="2" fill="#F2D27A" fill-opacity=".9" stroke="#B99A2E" stroke-width="1.5"'+(o.tapeIn?an('lb-a-fade',0):'')+'/>';
 if(o.hands)g+=hand(cx-wb-40,top+72,0,.9,1)+hand(cx+wb+40,top+72,180,.9,1);
 return g}
/* 물에 넣었을 때 수조 물 높이 (이 자료에서 정한 값: 막은 컵 14 높아짐, 막지 않은 컵 2) */
const CUPIN={top:286,rise:{cl:14,op:2},inner:{cl:422,op:286}};
function bubbles(){let g='';for(let i=0;i<5;i++)g+='<circle cx="'+(EF.cx-10+(i%3)*10)+'" cy="'+(CUPIN.top-10-i*14)+'" r="'+(5-i*.6)+'" fill="none" stroke="#FFFFFF" stroke-width="2"'+an('lb-a-up',.2*i,'--from:30px')+'/>';return g}
function tankMark(){return '<path d="M'+(EF.tx+EF.tw-30)+' '+EF.wl+' H'+(EF.tx+EF.tw+10)+'" stroke="#222831" stroke-width="4"/>'}

/* ───────── 준비물 카드 ───────── */
function itemArt(k){const A={
  rods:RODK.map((r,i)=>rodH(r,-58,-27+i*18,116,13)).join(''),
  rodwp:rodH('wood',-58,-12,116,16)+rodH('plastic',-58,14,116,16),
  paper:'<rect x="-52" y="-30" width="104" height="66" rx="3" fill="#FFFDF8" stroke="#A39B8B" stroke-width="2"/><path d="M-40 -14 H40 M-40 2 H40 M-40 18 H26" stroke="#2B3445" stroke-width="4" stroke-linecap="round"/>',
  sand:'<rect x="-52" y="-24" width="104" height="54" rx="3" fill="#C79C62" stroke="#8C6A35" stroke-width="2"/>'+[...Array(24)].map((_,i)=>'<circle cx="'+(-44+(i*29)%88)+'" cy="'+(-16+(i*13)%40)+'" r="1.6" fill="#8C6A35"/>').join(''),
  tank:'<rect x="-56" y="-10" width="112" height="44" fill="#9FD3F0" fill-opacity=".7"/><path d="M-56 -32 V34 H56 V-32" fill="none" stroke="#6E9FB5" stroke-width="4"/>',
  glove:hand(-14,-10,-60,.75,1)+hand(22,8,-60,.75,1),
  goggle:'<rect x="-50" y="-16" width="44" height="32" rx="12" fill="#CFE6EE" fill-opacity=".6" stroke="#2F68B0" stroke-width="4"/><rect x="6" y="-16" width="44" height="32" rx="12" fill="#CFE6EE" fill-opacity=".6" stroke="#2F68B0" stroke-width="4"/><path d="M-6 -2 H6" stroke="#2F68B0" stroke-width="4"/>',
  scissors:scissors(-20,0,.85,-20),book:book(0,4,.9),
  cupw:glassCup(0,40,.75,WATER,.8),cupj:glassCup(0,40,.75,JUICE,.8),
  balloon:balloon(0,46,.62),
  tray:'<path d="M-62 26 L-50 4 H50 L62 26Z" fill="#A7C4D8" stroke="#5F87A3" stroke-width="2.5"/><rect x="-36" y="-26" width="58" height="26" rx="4" fill="#F4E9D2" stroke="#B99E6E" stroke-width="2"/>',
  jars:'<g transform="translate(-120 -80) scale(.25)">'+JARS.map((_,j)=>jarArt(j)).join('')+'</g>',
  pen:pen(-48,0,-20),
  cup:'<g transform="translate(-264 -151) scale(.55)">'+cupInv(200,{})+'</g>',
  wipe:'<rect x="-22" y="-8" width="44" height="16" rx="4" fill="#FFFFFF" stroke="#9AA6B2" stroke-width="2"/>',
  tape:'<circle cx="-18" cy="0" r="22" fill="none" stroke="#C9B26A" stroke-width="9"/><circle cx="30" cy="0" r="18" fill="none" stroke="#E6D9B8" stroke-width="7"/><rect x="-2" y="-6" width="20" height="10" fill="#F2D27A"/>'};
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
