/* ───────── 그림: 실험대 장면 — 모두 직접 그린 SVG (자석의 이용) ───────── */
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

/* ───────── 자석의 이용: 자석·물체·나침반 그림 (모두 직접 그린 SVG) ───────── */
const NC='#D2453D',NS='#8E241E',SC='#2F6FBF',SS='#1D4A85',GC='#A3ACB5',GS='#5F6A75';
/* 가로 막대자석. left: 왼쪽 끝의 극('N'|'S'), gray: 회색(극을 보이지 않음), foil: 포일로 감쌈(peelL·peelR: 그 끝만 벗김) */
function magBar(cx,cy,w,h,o){o=o||{};const x=cx-w/2,y=cy-h/2,r=6;let g='<rect x="'+(x+5)+'" y="'+(y+7)+'" width="'+w+'" height="'+h+'" rx="'+r+'" fill="var(--w-shadow)"/>';
 const L=o.left||'S',R=L==='N'?'S':'N',col=p=>p==='N'?[NC,NS]:[SC,SS];
 const half=(p,x0)=>{const c=col(p);return '<rect x="'+x0+'" y="'+y+'" width="'+w/2+'" height="'+h+'" fill="'+c[0]+'"/>'+(o.noletter?'':'<text x="'+(x0+w/4)+'" y="'+(cy+h*.2)+'" text-anchor="middle" font-size="'+Math.round(h*.56)+'" font-weight="900" fill="#FFFFFF">'+p+'</text>')};
 if(o.gray){g+='<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+r+'" fill="'+GC+'" stroke="'+GS+'" stroke-width="2.5"/><path d="M'+(x+10)+' '+(y+8)+' H'+(x+w-10)+'" stroke="#FFFFFF" stroke-width="4" opacity=".45" stroke-linecap="round"/>';return g}
 if(o.foil){const pw=w*.24;g+='<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+r+'" fill="#CDD3DA" stroke="#7D8793" stroke-width="2.5"/>';
  for(let i=0;i<9;i++){const xx=x+14+i*(w-28)/8;g+='<path d="M'+xx.toFixed(1)+' '+(y+4)+' l'+(rnd(i,3)*14-7).toFixed(1)+' '+(h*.45).toFixed(1)+' l'+(rnd(i,5)*14-7).toFixed(1)+' '+(h*.45).toFixed(1)+'" stroke="#9AA4AF" stroke-width="1.6" fill="none"/>'}
  g+='<path d="M'+(x+8)+' '+(y+7)+' H'+(x+w-8)+'" stroke="#FFFFFF" stroke-width="4" opacity=".7" stroke-linecap="round"/>';
  const end=(p,x0,anim)=>{const c=col(p);return '<g'+(anim?an('lb-a-fade',.2):'')+'><rect x="'+x0+'" y="'+y+'" width="'+pw+'" height="'+h+'" fill="'+c[0]+'" stroke="'+c[1]+'" stroke-width="2"/><text x="'+(x0+pw/2)+'" y="'+(cy+h*.2)+'" text-anchor="middle" font-size="'+Math.round(h*.56)+'" font-weight="900" fill="#FFFFFF">'+p+'</text></g>'};
  if(o.peelL)g+=end('S',x,o.animL);if(o.peelR)g+=end('N',x+w-pw,o.animR);return g}
 g+='<g>'+half(L,x)+half(R,cx)+'</g><rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+r+'" fill="none" stroke="#3A3F47" stroke-width="2.5"/>';
 return g}
/* 세운 막대자석(실험 2: 손으로 잡고 들어 올리기) — tip: 아래 끝 y */
function magV(cx,tip,len,o){o=o||{};const w=44,top=tip-len;let g='<rect x="'+(cx-w/2)+'" y="'+top+'" width="'+w+'" height="'+len+'" rx="6" fill="'+GC+'" stroke="'+GS+'" stroke-width="2.5"/><path d="M'+(cx-12)+' '+(top+10)+' V'+(tip-10)+'" stroke="#FFFFFF" stroke-width="4" opacity=".45" stroke-linecap="round"/>';
 g+='<path d="M'+(cx-48)+' '+(top-60)+' L'+(cx-30)+' '+(top+6)+' H'+(cx+30)+' L'+(cx+48)+' '+(top-60)+'Z" fill="#5C8FCB" stroke="#3D6A9C" stroke-width="2"/><rect x="'+(cx-34)+'" y="'+(top-4)+'" width="68" height="44" rx="16" fill="#F2C6A0" stroke="#B9875F" stroke-width="2.2"/>'+[0,1,2].map(i=>'<path d="M'+(cx-20+i*14)+' '+(top+4)+' V'+(top+34)+'" stroke="#B9875F" stroke-width="1.6"/>').join('');
 if(o.plate)g+=plateArt(cx,tip,o.plate);
 return g}
function plateArt(cx,tip,kind){const c=kind==='p'?['#D6ECF7','#6FA3C2']:['#F3E6C4','#B79E6E'];return '<rect x="'+(cx-66)+'" y="'+tip+'" width="132" height="10" rx="2" fill="'+c[0]+'" fill-opacity=".92" stroke="'+c[1]+'" stroke-width="2"/>'}
/* 둥근기둥 모양 자석(회색, 옆에서 본 모습) */
function cylMag(cx,cy,w,h){const x=cx-w/2;return '<rect x="'+(x+5)+'" y="'+(cy-h/2+7)+'" width="'+w+'" height="'+h+'" rx="10" fill="var(--w-shadow)"/><path d="M'+x+' '+(cy-h/2)+' H'+(x+w)+' A12 '+h/2+' 0 0 1 '+(x+w)+' '+(cy+h/2)+' H'+x+' A12 '+h/2+' 0 0 1 '+x+' '+(cy-h/2)+'Z" fill="'+GC+'" stroke="'+GS+'" stroke-width="2.5"/><ellipse cx="'+(x+w)+'" cy="'+cy+'" rx="12" ry="'+h/2+'" fill="#C3CAD1" stroke="'+GS+'" stroke-width="2.5"/><path d="M'+(x+10)+' '+(cy-h/2+9)+' H'+(x+w-16)+'" stroke="#FFFFFF" stroke-width="5" opacity=".45" stroke-linecap="round"/>'}

/* 실험 1의 물체(위에서 본 모습, 가운데 0,0) */
const OHW={clip:44,pruler:76,clamp:46,wood:56,iruler:76,cpaper:48,tie:64,balloon:38,can:32};
function tieArt(peel){if(!peel)return '<path d="M-42 4 q10.5 -12 21 0 t21 0 t21 0 t21 0" stroke="#2F7D47" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M-42 4 q10.5 -12 21 0 t21 0 t21 0 t21 0" stroke="#7BC48E" stroke-width="3" fill="none" stroke-dasharray="5 6"/>';
 return '<path d="M-42 4 q10.5 -12 21 0 t2 0" stroke="#2F7D47" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M19 4 q4 4 8 2 t15 -2" stroke="#2F7D47" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M-19 4 q8 -6 19 0 t19 0" stroke="#6C7782" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M-21 -3 l-4 -6 M20 -2 l5 -6" stroke="#2F7D47" stroke-width="3" stroke-linecap="round"/>'}
function objArt(k,o){o=o||{};const A={
 clip:'<path d="M-24 -9 H18 A9 9 0 0 1 18 9 H-20 A5.5 5.5 0 0 1 -20 -2 H12" stroke="#6F7A85" stroke-width="4.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
 pruler:'<rect x="-50" y="-12" width="100" height="24" rx="3" fill="#BFE3F2" fill-opacity=".85" stroke="#4E8FB3" stroke-width="2"/>'+[...Array(11)].map((_,i)=>'<path d="M'+(-44+i*8.8).toFixed(1)+' -12 v'+(i%5?6:10)+'" stroke="#2E6E92" stroke-width="1.4"/>').join(''),
 clamp:'<path d="M-24 -4 H24 L30 20 H-30Z" fill="#2E333A" stroke="#15181C" stroke-width="2"/><path d="M-14 -4 L-20 -26 H20 L14 -4" fill="none" stroke="#9AA3AD" stroke-width="4" stroke-linejoin="round"/>',
 wood:'<rect x="-36" y="-24" width="72" height="48" rx="4" fill="#C8955E" stroke="#8A5F33" stroke-width="2.2"/><path d="M-30 -10 Q0 -16 30 -8 M-30 6 Q0 0 30 10" stroke="#9E6E3E" stroke-width="1.6" fill="none"/>',
 iruler:'<rect x="-50" y="-11" width="100" height="22" rx="2" fill="#C3CAD1" stroke="#5F6A75" stroke-width="2"/>'+[...Array(11)].map((_,i)=>'<path d="M'+(-44+i*8.8).toFixed(1)+' -11 v'+(i%5?6:10)+'" stroke="#3E4650" stroke-width="1.4"/>').join(''),
 cpaper:'<g transform="rotate(8)"><rect x="-31" y="-31" width="62" height="62" rx="2" fill="#F28DB2" stroke="#B9527A" stroke-width="2"/><path d="M-31 31 L-14 14" stroke="#FFFFFF" stroke-width="2" opacity=".6"/></g>',
 tie:tieArt(o.peel),
 balloon:'<ellipse cx="0" cy="-6" rx="24" ry="30" fill="#E0533D" stroke="#9E2F22" stroke-width="2"/><path d="M-5 24 L0 30 L5 24Z" fill="#B23A2A"/><ellipse cx="-9" cy="-17" rx="6" ry="10" fill="#FFFFFF" opacity=".45" transform="rotate(-20 -9 -17)"/>',
 can:'<rect x="-21" y="-34" width="42" height="68" rx="6" fill="#D7DCE1" stroke="#7E8893" stroke-width="2.2"/><rect x="-21" y="-8" width="42" height="18" fill="#4E8FD1"/><ellipse cx="0" cy="-33" rx="19" ry="5" fill="#EEF1F4" stroke="#7E8893" stroke-width="1.6"/><path d="M-13 -24 V24" stroke="#FFFFFF" stroke-width="4" opacity=".55"/>'};
 return A[k]||''}
function objAt(k,x,y,s,o){return '<g transform="translate('+x+' '+y+') scale('+(s||1)+')">'+objArt(k,o)+'</g>'}
/* 물체 이름(좁은 화면은 번호 + 아래 글) */
function objName(k,x,y,i){if(NAR){LEG.push([null,(i+1)+' '+OBJ[k].n]);return chip(x,y-6,i+1,15)}return mini(x,y,OBJ[k].n,20)}

/* 실험 3: 빵 끈 조각 */
function piece(x,y,a,len,i){const c=i%3===2?'#E8E2CF':'#2F7D47',s=i%3===2?'#A49C84':'#1E5A31',dx=Math.cos(a)*len/2,dy=Math.sin(a)*len/2;
 return '<path d="M'+(x-dx).toFixed(1)+' '+(y-dy).toFixed(1)+' L'+(x+dx).toFixed(1)+' '+(y+dy).toFixed(1)+'" stroke="'+s+'" stroke-width="6" stroke-linecap="round"/><path d="M'+(x-dx).toFixed(1)+' '+(y-dy).toFixed(1)+' L'+(x+dx).toFixed(1)+' '+(y+dy).toFixed(1)+'" stroke="'+c+'" stroke-width="3.6" stroke-linecap="round"/>'}
/* 자석 끝에 붙은 조각: 끝에서 바깥쪽으로 뻗음(양쪽 끝 많이, 가운데 거의 없음 — 교과서 결과, 개수는 정한 값) */
function stuckPieces(cx,cy,w,h,seed){let g='';const half=w/2;
 for(let side=-1;side<=1;side+=2)for(let i=0;i<10;i++){const t=rnd(i,seed+side)*.9,a=side<0?Math.PI*(.62+t*.76):Math.PI*(-.38+t*.76);
  const ex=cx+side*(half-4-rnd(i,seed+7)*16),ey=cy+(rnd(i,seed+9)-.5)*h*.9,len=20+rnd(i,seed+11)*6;
  g+=piece(ex+Math.cos(a)*len*.45,ey+Math.sin(a)*len*.45,a,len,i)}
 g+=piece(cx+8,cy+h/2+8,Math.PI*.5,18,1);
 return g}
const BOWL={cx:480,top:330,bot:414,tw:300,bw:220};
function bowlBack(n){const B=BOWL;let g=shadow(B.cx,B.bot+4,B.bw/2+14)+'<ellipse cx="'+B.cx+'" cy="'+B.top+'" rx="'+B.tw/2+'" ry="22" fill="#E7D9BC" stroke="#B9A47E" stroke-width="2.5"/>';
 for(let i=0;i<n;i++){const a=rnd(i,21)*Math.PI*2,rr=Math.sqrt(rnd(i,23)),x=B.cx+Math.cos(a)*rr*(B.tw/2-26),y=B.top+Math.sin(a)*rr*14;g+=piece(x,y,rnd(i,25)*Math.PI,18,i)}
 return g}
function bowlFront(){const B=BOWL;return '<path d="M'+(B.cx-B.tw/2)+' '+B.top+' A'+B.tw/2+' 22 0 0 0 '+(B.cx+B.tw/2)+' '+B.top+' L'+(B.cx+B.bw/2)+' '+B.bot+' H'+(B.cx-B.bw/2)+'Z" fill="#F4EBD8" stroke="#B9A47E" stroke-width="2.5"/>'+[0,1,2,3,4,5,6].map(i=>{const t=-.5+i/6;return '<path d="M'+(B.cx+t*B.tw*.92).toFixed(1)+' '+(B.top+22)+' L'+(B.cx+t*B.bw*.9).toFixed(1)+' '+(B.bot-4)+'" stroke="#DCCDAE" stroke-width="2"/>'}).join('')}

/* 실험 5: 나침반. ang: 빨간색 부분이 가리키는 각도(0 오른쪽, -90 위). anim: [시작 각도, 늦춤] */
function compass(cx,cy,r,ang,anim,wob){let g='<circle cx="'+(cx+4)+'" cy="'+(cy+7)+'" r="'+r+'" fill="var(--w-shadow)"/><circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="#3E4650"/><circle cx="'+cx+'" cy="'+cy+'" r="'+(r-9)+'" fill="#FBFAF6" stroke="#9AA3AD" stroke-width="2"/>';
 for(let i=0;i<36;i++){const a=i*10*Math.PI/180,r1=r-11,r2=r-(i%9===0?24:17);g+='<path d="M'+(cx+Math.cos(a)*r1).toFixed(1)+' '+(cy+Math.sin(a)*r1).toFixed(1)+' L'+(cx+Math.cos(a)*r2).toFixed(1)+' '+(cy+Math.sin(a)*r2).toFixed(1)+'" stroke="#5F6A75" stroke-width="'+(i%9===0?3:1.5)+'"/>'}
 g+='<text x="'+cx+'" y="'+(cy-r*.6+r*.07).toFixed(1)+'" text-anchor="middle" font-size="'+Math.round(r*.2)+'" font-weight="800" fill="#3E4650">북</text>';
 const L=r*.52,W=r*.13;const nd='<path d="M'+L+' 0 L0 '+(-W)+' L0 '+W+'Z" fill="#D2453D" stroke="#8E241E" stroke-width="1.5"/><path d="M'+(-L)+' 0 L0 '+(-W)+' L0 '+W+'Z" fill="#E9ECEF" stroke="#7E8893" stroke-width="1.5"/>';
 const inner=anim?'<g class="lb-a '+(wob?'lb-a-wob2':'lb-a-turn')+'" style="--r0:'+anim[0]+'deg;--r1:'+ang+'deg;animation-delay:'+(anim[1]||0)+'s">'+nd+'</g>':'<g transform="rotate('+ang+')">'+nd+'</g>';
 return g+'<g transform="translate('+cx+' '+cy+')">'+inner+'<circle r="'+(W*.7).toFixed(1)+'" fill="#3E4650"/></g>'}

/* 실험 2: 관찰 도움판(위에서 본 모습) */
function helpBoard(){let g='<rect x="156" y="178" width="660" height="214" rx="8" fill="var(--w-shadow)"/><rect x="150" y="170" width="660" height="214" rx="8" fill="#FFFDF8" stroke="#A39B8B" stroke-width="2"/>';
 g+='<rect x="250" y="226" width="160" height="104" rx="12" fill="none" stroke="#9E968A" stroke-width="2.4" stroke-dasharray="9 7"/><rect x="560" y="236" width="236" height="88" rx="12" fill="none" stroke="#9E968A" stroke-width="2.4" stroke-dasharray="9 7"/>';
 if(NAR){LEG.push([null,'왼쪽: 철 클립 놓는 곳 · 오른쪽: 막대자석 놓는 곳'])}
 else g+='<text x="330" y="360" text-anchor="middle" font-size="18" font-weight="800" fill="#4B5465">철 클립 놓는 곳</text><text x="678" y="360" text-anchor="middle" font-size="18" font-weight="800" fill="#4B5465">막대자석 놓는 곳</text>';
 return g}
/* 실험 2: 옆에서 본 클립(책상 위에 누운 것 / 매달린 것) */
function clipFlat(x,y){return '<rect x="'+(x-30)+'" y="'+(y-6)+'" width="60" height="6" rx="3" fill="#8A95A0" stroke="#5F6A75" stroke-width="1.5"/>'}
function clipHang(x,top){return '<g transform="translate('+x+' '+(top+26)+') rotate(90) scale(1.15)">'+objArt('clip')+'</g>'}

/* ───────── 준비물 카드 ───────── */
function itemArt(k){const A={
  objs:objAt('clip',-48,-36,.8)+objAt('can',46,-22,.85)+objAt('wood',-30,18,.7)+objAt('balloon',14,12,.6)+objAt('tie',-4,-50,.6),
  gmag:magBar(0,-8,150,34,{gray:1}),mag:magBar(0,-8,150,34,{left:'N'}),
  mag2:magBar(0,-34,140,30,{left:'N'})+magBar(0,14,140,30,{left:'S'}),
  osticker:'<rect x="-56" y="-46" width="112" height="84" rx="5" fill="#FFFFFF" stroke="#B9C2CA" stroke-width="2"/>'+['clip','can','wood','balloon','iruler','cpaper'].map((k,i)=>'<g transform="translate('+(-34+(i%3)*34)+' '+(-20+Math.floor(i/3)*38)+') scale(.32)"><circle r="44" fill="#FFF8E2" stroke="#D9C68A" stroke-width="3"/>'+objArt(k)+'</g>').join(''),
  board:'<rect x="-70" y="-40" width="140" height="74" rx="5" fill="#FFFDF8" stroke="#A39B8B" stroke-width="2"/><rect x="-58" y="-24" width="40" height="40" rx="6" fill="none" stroke="#9E968A" stroke-width="2" stroke-dasharray="5 4"/><rect x="2" y="-18" width="58" height="28" rx="6" fill="none" stroke="#9E968A" stroke-width="2" stroke-dasharray="5 4"/>',
  clip:objAt('clip',0,-8,1.5),
  plate:'<rect x="-60" y="-34" width="120" height="70" rx="4" fill="#D6ECF7" fill-opacity=".92" stroke="#6FA3C2" stroke-width="2.5"/><path d="M-48 -24 L-30 -24" stroke="#FFFFFF" stroke-width="4" opacity=".8"/>',
  pplate:'<rect x="-60" y="-34" width="120" height="70" rx="2" fill="#F3E6C4" stroke="#B79E6E" stroke-width="2.5"/>',
  bowl:'<g transform="scale(.46) translate(-480 -372)">'+bowlBack(14)+bowlFront()+'</g>',
  cylm:cylMag(0,-8,130,40),
  foil:magBar(0,-8,150,36,{foil:1}),
  compass:compass(0,-6,58,-90),
  nsticker:'<rect x="-56" y="-46" width="112" height="84" rx="5" fill="#FFFFFF" stroke="#B9C2CA" stroke-width="2"/>'+[0,1,2,3,4,5].map(i=>'<g transform="translate('+(-34+(i%3)*34)+' '+(-20+Math.floor(i/3)*38)+') rotate('+[0,60,120,180,240,300][i]+')"><path d="M14 0 L0 -3.5 L0 3.5Z" fill="#D2453D"/><path d="M-14 0 L0 -3.5 L0 3.5Z" fill="#C9CED4"/></g>').join('')};
 return A[k]||''}
function itemArtAt(k,x,y){return '<g transform="translate('+x+' '+y+') scale(1.4)">'+itemArt(k)+'</g>'}
