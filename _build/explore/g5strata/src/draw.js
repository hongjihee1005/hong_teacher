/* ───────── 그림: 실험대 장면 — 모두 직접 그린 SVG (지층과 화석) ───────── */
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
function bgTop(){let g='<rect x="-3000" y="-3000" width="7000" height="7000" fill="var(--w-top)"/>';
 for(let i=0;i<14;i++)g+='<path d="M-3000 '+(-40+i*46)+' Q480 '+(-30+i*46+(i%2?10:-10))+' 4000 '+(-40+i*46)+'" stroke="var(--w-grain)" stroke-width="1.4" fill="none" opacity=".28"/>';
 return g}
const P2=pts=>'M'+pts.map(p=>p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' L')+' Z';
function rnd(i,s){const h=Math.sin(i*12.9898+(s||0)*78.233)*43758.5453;return h-Math.floor(h)}
function magnifier(x,y,s,rot){return '<g transform="translate('+x+' '+y+') rotate('+(rot||0)+') scale('+(s||1)+')"><circle r="34" fill="#E8F4FA" fill-opacity=".35" stroke="#2B3445" stroke-width="7"/><path d="M24 24 L62 62" stroke="#6B4A2B" stroke-width="13" stroke-linecap="round"/><path d="M-16 -18 a24 24 0 0 1 20 -8" stroke="#FFFFFF" stroke-width="4" fill="none" opacity=".8"/></g>'}
function chip(x,y,n,r){r=r||20;return '<g><circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="#FFD54A" stroke="#9A7300" stroke-width="2"/><text x="'+x+'" y="'+(y+r*.36)+'" text-anchor="middle" font-size="'+(r*1.05)+'" font-weight="800" fill="#3B2A00">'+n+'</text></g>'}
function coat(x,y,s){return '<g transform="translate('+x+' '+y+') scale('+(s||1)+')"><path d="M-46 -64 L-18 -72 L0 -40 L18 -72 L46 -64 L62 30 L40 34 L36 -10 L34 72 H-34 L-36 -10 L-40 34 L-62 30Z" fill="#FFFFFF" stroke="#9AA6B2" stroke-width="3" stroke-linejoin="round"/><path d="M0 -40 V72" stroke="#9AA6B2" stroke-width="2"/><circle cx="-7" cy="-6" r="3" fill="#9AA6B2"/><circle cx="-7" cy="22" r="3" fill="#9AA6B2"/><rect x="12" y="10" width="16" height="12" rx="2" fill="none" stroke="#9AA6B2" stroke-width="2"/></g>'}
function itemArtAt(k,x,y){return '<g transform="translate('+x+' '+y+') scale(1.4)">'+itemArt(k)+'</g>'}
function toolsScene(list,anim){let b='';if(NAR)list.forEach(it=>LEG.push([null,it[1]]));const n=list.length,cols=n<=4?n:n<=6?3:n<=8?4:5,rows=Math.ceil(n/cols),cw=200,ch=176,gx=18,gy=18;
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

/* ───────── 보호 장비 ───────── */
function goggles(x,y,s){return '<g transform="translate('+x+' '+y+') scale('+(s||1)+')"><path d="M-46 -6 Q-46 -20 -30 -20 H30 Q46 -20 46 -6 V8 Q46 20 30 20 H12 Q0 8 -12 20 H-30 Q-46 20 -46 8Z" fill="#CFE8F5" fill-opacity=".75" stroke="#3D6A9C" stroke-width="4" stroke-linejoin="round"/><path d="M-46 -2 H-60 M46 -2 H60" stroke="#3D6A9C" stroke-width="5" stroke-linecap="round"/><path d="M-32 -10 L-20 -10" stroke="#FFFFFF" stroke-width="3" opacity=".8"/></g>'}
function cotton(x,y,rot,s){return hand(x,y,rot,s,1).replace('#FFFFFF','#F4F1EA').replace('#9AA6B2','#B5AE9F')}
/* 실험용 장갑(파란 고무 장갑) · 보호 장비 입기 */
function lglove(x,y,r,s){return hand(x,y,r,s,1).replace('#FFFFFF','#BFE0F2').replace('#9AA6B2','#4F82A3')}
function gearArt(no,on,anim){const gl=no===2||no===5?lglove:cotton;
 if(!on)return coat(330,250,1.4)+(no===5?goggles(520,140,1.3):'')+'<g transform="translate(640 290) scale(1.4)">'+gl(-14,-10,-60,.75)+gl(22,8,-60,.75)+'</g>'+qmark(480,90);
 let g='<g'+(anim?an('lb-a-up',0,'--from:100px'):'')+'><circle cx="480" cy="116" r="38" fill="#F2C6A0" stroke="#B9875F" stroke-width="3"/>';
 if(no===5)g+=goggles(480,108,.92);
 g+=coat(480,262,1.75)+gl(330,240,-70,1.4)+gl(630,240,-110,1.4)+'</g>';
 return g}

/* ───────── 실험 1: 지층 카드 ───────── */
/* 지층 그리기(원본 u1-1의 strata를 옮김 — id는 같은 그림이면 같은 글이 되도록 정해서 줌). pen: 1 그은 선 · 'a' 긋는 중 */
function strataSVG(o){const w=o.w,h=o.h,id=o.id,L=o.layers,sh=o.shape||'flat',amp=o.amp||0,d=sh==='fault'?(o.d||0):0;
 const off=x=>sh==='fold'?amp*Math.sin((x/w)*Math.PI*2*(o.waves||1)+(o.ph||0)):0;
 let mn=1e9,mx=-1e9;for(let x=0;x<=w;x+=5){const v=off(x);mn=Math.min(mn,v);mx=Math.max(mx,v)}
 const start=-mx-Math.abs(d)-2,end=h-mn+Math.abs(d)+2,tot=L.reduce((a,l)=>a+(l.t||1),0),sc=(end-start)/tot;
 const cum=[0];L.forEach(l=>cum.push(cum[cum.length-1]+(l.t||1)));
 const by=(i,x)=>start+cum[i]*sc+off(x);
 let defs='<clipPath id="'+id+'c"><rect width="'+w+'" height="'+h+'"/></clipPath>';const pats={};
 L.forEach((l,i)=>{const k=l.k||'m',pid=id+'p'+i;pats[i]=pid;
  if(k==='g')defs+='<pattern id="'+pid+'" width="34" height="26" patternUnits="userSpaceOnUse"><rect width="34" height="26" fill="'+l.c+'"/><ellipse cx="8" cy="8" rx="6" ry="4.5" fill="#fff" opacity=".28" stroke="#000" stroke-opacity=".25"/><ellipse cx="25" cy="18" rx="7" ry="5" fill="#000" opacity=".16"/><circle cx="22" cy="5" r="2" fill="#000" opacity=".2"/><circle cx="6" cy="20" r="1.6" fill="#fff" opacity=".4"/></pattern>';
  else if(k==='s')defs+='<pattern id="'+pid+'" width="12" height="10" patternUnits="userSpaceOnUse"><rect width="12" height="10" fill="'+l.c+'"/><circle cx="3" cy="3" r="1.1" fill="#000" opacity=".22"/><circle cx="9" cy="7" r="1.1" fill="#fff" opacity=".35"/></pattern>';
  else defs+='<pattern id="'+pid+'" width="40" height="8" patternUnits="userSpaceOnUse"><rect width="40" height="8" fill="'+l.c+'"/><path d="M0 4 H22" stroke="#000" stroke-opacity=".1" stroke-width="1"/></pattern>'});
 function block(shift){let s='';
  L.forEach((l,i)=>{let dd='M0 '+(by(i,0)+shift).toFixed(1);for(let x=0;x<=w;x+=6)dd+=' L'+x+' '+(by(i,x)+shift).toFixed(1);dd+=' L'+w+' '+(by(i,w)+shift).toFixed(1);
   for(let x=w;x>=0;x-=6)dd+=' L'+x+' '+(by(i+1,x)+shift).toFixed(1);dd+=' L0 '+(by(i+1,0)+shift).toFixed(1)+'Z';s+='<path d="'+dd+'" fill="url(#'+pats[i]+')"/>'});
  if(o.pen){for(let i=1;i<L.length;i++){let dd='M0 '+(by(i,0)+shift).toFixed(1);for(let x=6;x<=w;x+=6)dd+=' L'+x+' '+(by(i,x)+shift).toFixed(1);
   s+='<path d="'+dd+'" fill="none" stroke="#1d2b8f" stroke-width="'+(o.pw||3.5)+'" stroke-linecap="round" pathLength="1" stroke-dasharray="1"'+(o.pen==='a'?an('lb-a-draw',.15+i*.12):'')+'/>'}}
  return s}
 let body;
 if(sh==='fault'){const fx=o.fx||w*.5,fs=o.fs==null?h*.25:o.fs;
  defs+='<clipPath id="'+id+'L"><path d="M-5 -5 L'+(fx+fs)+' -5 L'+(fx-fs)+' '+(h+5)+' L-5 '+(h+5)+'Z"/></clipPath><clipPath id="'+id+'R"><path d="M'+(fx+fs)+' -5 L'+(w+5)+' -5 L'+(w+5)+' '+(h+5)+' L'+(fx-fs)+' '+(h+5)+'Z"/></clipPath>';
  body='<g clip-path="url(#'+id+'L)">'+block(0)+'</g><g clip-path="url(#'+id+'R)">'+block(d)+'</g><path d="M'+(fx+fs)+' 0 L'+(fx-fs)+' '+h+'" stroke="#2b1a0c" stroke-width="'+Math.max(2,w/100)+'"/>'}
 else body=block(0);
 return '<g transform="translate('+(o.x||0)+' '+(o.y||0)+')"><defs>'+defs+'</defs><g clip-path="url(#'+id+'c)">'+body+'</g>'+(o.frame===false?'':'<rect width="'+w+'" height="'+h+'" fill="none" stroke="#3b2a1a" stroke-width="2" rx="3"/>')+'</g>'}
/* 지층 카드 한 장. face: 앞면(지층 그림) · pen: 선 · hl: 고른 카드 */
function cardArt(i,x,y,w,h,o){o=o||{};const cd=CARDS[i],k=(w-12)/388,br=Math.max(13,w*.06);
 let g='<g transform="translate('+x+' '+y+')"><rect x="4" y="6" width="'+w+'" height="'+h+'" rx="10" fill="var(--w-shadow)"/>';
 if(!o.face){g+='<rect width="'+w+'" height="'+h+'" rx="10" fill="#3E6E8E" stroke="#24475E" stroke-width="3"/><rect x="9" y="9" width="'+(w-18)+'" height="'+(h-18)+'" rx="7" fill="none" stroke="#9CC3DA" stroke-width="2" stroke-dasharray="7 5"/>'+
  '<circle cx="'+w/2+'" cy="'+h/2+'" r="'+br*1.5+'" fill="#FFFFFF" stroke="#24475E" stroke-width="2.5"/><text x="'+w/2+'" y="'+(h/2+br*.55)+'" text-anchor="middle" font-size="'+br*1.65+'" font-weight="800" fill="#1C3A4F">'+NUM[i]+'</text>'}
 else{g+='<rect width="'+w+'" height="'+h+'" rx="10" fill="#FFFFFF" stroke="#8C8577" stroke-width="2.5"/>'+
  strataSVG({x:6,y:6,w:w-12,h:h-12,id:'cd'+i+'w'+Math.round(w),layers:cd.layers,shape:cd.shape,amp:(cd.amp||0)*k,waves:cd.waves,ph:cd.ph,d:(cd.d||0)*k,fx:(cd.fx||0)*k,fs:(cd.fs||0)*k,pen:o.pen,pw:w>300?4:2.6})+
  '<circle cx="'+(br+8)+'" cy="'+(br+8)+'" r="'+br+'" fill="#FFFFFF" stroke="#24475E" stroke-width="2"/><text x="'+(br+8)+'" y="'+(br+8+br*.4)+'" text-anchor="middle" font-size="'+br*1.15+'" font-weight="800" fill="#1C3A4F">'+NUM[i]+'</text>'}
 if(o.hl)g+='<rect x="-9" y="-9" width="'+(w+18)+'" height="'+(h+18)+'" rx="14" fill="none" stroke="var(--lb-lens)" stroke-width="5" stroke-dasharray="12 8"/>';
 return g+'</g>'}
const CW=150,CH=94,CPOS=[0,1,2,3,4,5].map(i=>[52+(i%3)*166,120+Math.floor(i/3)*126]);
const BIG={x:578,y:150,w:340,h:213};
function penArt(x,y,rot,s){return '<g transform="translate('+x+' '+y+') rotate('+(rot||0)+') scale('+(s||1)+')"><rect x="-8" y="-70" width="16" height="96" rx="5" fill="#1F2A6E" stroke="#0F1640" stroke-width="2"/><rect x="-9" y="-78" width="18" height="26" rx="5" fill="#2D3C9A" stroke="#0F1640" stroke-width="2"/><path d="M-6 26 L0 40 L6 26Z" fill="#1d2b8f"/><rect x="-5" y="-30" width="10" height="34" rx="2" fill="#FFFFFF" opacity=".75"/></g>'}
/* 책상 위 카드 여섯 장 + 오른쪽 큰 카드. o: face(i→bool) pen(i→0/1/'a') big(i 또는 null) bigPen hl */
function cardsTable(o){o=o||{};let g=bgTop();
 CPOS.forEach((p,i)=>{g+='<g'+(o.deal?an('lb-a-pop',.1+i*.12):'')+'>'+cardArt(i,p[0],p[1],CW,CH,{face:o.face&&o.face(i),pen:o.pen&&o.pen(i)?1:0,hl:o.big===i})+'</g>'});
 if(o.noBig)return g;
 const B=BIG;
 if(o.big==null)g+='<rect x="'+B.x+'" y="'+B.y+'" width="'+B.w+'" height="'+B.h+'" rx="12" fill="var(--w-label)" fill-opacity=".55" stroke="var(--w-felt-s)" stroke-width="2.5" stroke-dasharray="10 7"/>'+(NAR?'':'<text x="'+(B.x+B.w/2)+'" y="'+(B.y+B.h/2+8)+'" text-anchor="middle" font-size="22" font-weight="800" fill="var(--w-labeltx)">카드를 고르면 크게 보여요</text>');
 else{g+='<g'+(o.flip?an('lb-a-pop',0):'')+'>'+cardArt(o.big,B.x,B.y,B.w,B.h,{face:1,pen:o.bigPen})+'</g>';
  if(o.bigPen==='a')g+='<g'+an('lb-a-slide',0,'--dx:-300px')+'>'+penArt(B.x+B.w-34,B.y+B.h+26,60,.8)+'</g>';else if(o.penTool)g+=penArt(B.x+B.w-34,B.y+B.h+26,60,.8)}
 return g}
/* 오늘의 실험 그림용: 아무 무늬 없는 카드(결과를 보여 주지 않음) */
function blankCard(x,y,w,h){return '<g transform="translate('+x+' '+y+')"><rect x="4" y="6" width="'+w+'" height="'+h+'" rx="10" fill="var(--w-shadow)"/><rect width="'+w+'" height="'+h+'" rx="10" fill="#FFFFFF" stroke="#8C8577" stroke-width="2.5"/><rect x="8" y="8" width="'+(w-16)+'" height="'+(h-16)+'" rx="4" fill="#E9E1D3"/></g>'}
function trayArt(x,y,lab){return '<g><rect x="'+x+'" y="'+y+'" width="240" height="150" rx="14" fill="var(--w-paper)" stroke="var(--w-felt-s)" stroke-width="2.5"/>'+(lab?'<text x="'+(x+120)+'" y="'+(y+38)+'" text-anchor="middle" font-size="24" font-weight="800" fill="#141A26">'+lab+'</text>':'')+'</g>'}

/* ───────── 실험 2: 지층 모형(옆에서 본 실험대) ───────── */
const TX=330,TW=300,TY=110,TB=410,TH=TB-TY,LH=.78;
/* 층 무늬(자갈과 모래: 둥근 자갈과 점 · 모래: 점 · 진흙: 결) */
function layerFill(k,x,y,w,h,seed){const m=MAT[k];let g='<rect x="'+x+'" y="'+y.toFixed(1)+'" width="'+w+'" height="'+h.toFixed(1)+'" fill="'+m.c+'"/>';
 if(k==='gs'){const n=Math.floor(w/19);for(let j=0;j<n;j++)g+='<ellipse cx="'+(x+10+j*19+rnd(j,seed)*4).toFixed(1)+'" cy="'+(y+h-9-(j%2)*Math.min(12,h*.3)).toFixed(1)+'" rx="'+(7+(j%3))+'" ry="5" fill="#8f7f6a" stroke="#5f5242" stroke-width="1.5"/>'}
 if(k!=='m'){for(let j=0;j<Math.floor(w/7);j++)g+='<circle cx="'+(x+6+(j*37)%(w-10)).toFixed(1)+'" cy="'+(y+3+((j*13)%Math.max(4,(k==='gs'?h*.45:h-5)))).toFixed(1)+'" r="1.4" fill="#7a6040" opacity=".75"/>'}
 else for(let j=0;j<3;j++)g+='<path d="M'+(x+10+j*30)+' '+(y+h*(.3+j*.2)).toFixed(1)+' h'+(w*.4).toFixed(0)+'" stroke="#5c432d" stroke-opacity=".35" stroke-width="1.5"/>';
 return g}
/* 사각 통. o: water(0~1) ord(아래부터 쌓인 것) grow(마지막 층이 쌓이는 중) x w s(크기) */
function tankArt(o){o=o||{};const x=o.x==null?TX:o.x,w=o.w||TW,tb=o.b||TB,th=o.h||TH,ty=tb-th;
 let g=shadow(x+w/2,tb+6,w/2+14)+'<rect x="'+x+'" y="'+ty+'" width="'+w+'" height="'+th+'" fill="var(--w-glass)"/>';
 const wl=tb-(o.water||0)*th;
 if(o.water)g+='<g'+(o.waterAnim?' class="lb-a lb-a-hillup"':'')+'><rect x="'+(x+3)+'" y="'+wl.toFixed(1)+'" width="'+(w-6)+'" height="'+(tb-wl).toFixed(1)+'" fill="#9fd3f0" opacity=".6"/><path d="M'+(x+3)+' '+wl.toFixed(1)+' H'+(x+w-3)+'" stroke="#5E9CC0" stroke-width="3"/></g>';
 let y=tb-3;const L=o.ord||[],sc=(o.ls||LH)*th/TH;
 L.forEach((k,i)=>{const h=MAT[k].h*sc;y-=h;const an1=o.grow&&i===L.length-1;
  g+='<g'+(an1?' class="lb-a lb-a-hillup" style="animation-delay:.55s"':'')+'>'+layerFill(k,x+3,y,w-6,h,i+3)+'</g>'});
 if(o.cloud)g+='<rect x="'+(x+3)+'" y="'+wl.toFixed(1)+'" width="'+(w-6)+'" height="'+Math.max(0,y-wl).toFixed(1)+'" fill="'+MAT[o.cloud].c+'"'+an('lb-a-out2',.2)+' opacity=".45" style="animation-duration:1.8s"/>';
 g+='<rect x="'+x+'" y="'+ty+'" width="'+w+'" height="'+th+'" fill="none" stroke="#5a7d8c" stroke-width="5" rx="4"/><path d="M'+(x+12)+' '+(ty+14)+' V'+(ty+th*.5)+'" stroke="#FFFFFF" stroke-width="5" opacity=".55" stroke-linecap="round"/>';
 return g}
/* 쌓인 층의 가운데 높이(아래부터 i번째) */
function layerMid(ord,i,o){o=o||{};const tb=o.b||TB,th=o.h||TH,sc=(o.ls||LH)*th/TH;let y=tb-3;for(let j=0;j<=i;j++){const h=MAT[ord[j]].h*sc;y-=h;if(j===i)return y+h/2}return y}
/* 투명한 컵. fill(0~1) water(0~1) */
function cupArt(cx,b,k,o){o=o||{};const s=o.s||1.25,m=MAT[k];let g='<g transform="translate('+cx+' '+b+') scale('+s+')">';
 g+='<path d="M-34 -80 L-28 0 L28 0 L34 -80" fill="#ffffff" fill-opacity=".5" stroke="#7a8c96" stroke-width="3"/>';
 if(o.water){const t=-80*Math.max(o.fill?.5:0,.92);g+='<g'+(o.waterAnim?' class="lb-a lb-a-hillup"':'')+'><path d="M'+(-33)+' '+t+' L-28 0 L28 0 L33 '+t+'Z" fill="#7ec3ea" opacity=".55"/></g>'}
 if(o.fill){const top=-40;g+='<g'+(o.fillAnim?' class="lb-a lb-a-hillup"':'')+'><path d="M-31 '+top+' L-28 0 L28 0 L31 '+top+'Z" fill="'+m.c+'"/>';
  if(k==='gs')for(let i=0;i<6;i++)g+='<ellipse cx="'+(-20+i*8)+'" cy="'+(-8-(i%2)*8)+'" rx="5" ry="3.5" fill="#8f7f6a" stroke="#5f5242"/>';
  if(k!=='m')for(let i=0;i<10;i++)g+='<circle cx="'+(-22+i*5)+'" cy="'+(top+6+(i%3)*5)+'" r="1.3" fill="#7a6040"/>';g+='</g>'}
 g+='</g>';if(!o.nolab)g+=mini(cx,b+30,m.n,18);return g}
const CUPX={gs:130,s:228,m:800};
function beaker(x,y,rot,s,full){return '<g transform="translate('+x+' '+y+') rotate('+(rot||0)+') scale('+(s||1)+')"><path d="M-30 -50 V40 Q-30 50 -20 50 H20 Q30 50 30 40 V-50 L36 -56" fill="#EAF4FB" fill-opacity=".45" stroke="#5F8FA0" stroke-width="3"/>'+(full?'<path d="M-28 -10 H28 V40 Q28 48 20 48 H-20 Q-28 48 -28 40Z" fill="#7CC3EC" fill-opacity=".8"/>':'')+'</g>'}
/* 붓는 컵(통 위에서 기울임) + 떨어지는 알갱이 */
function pourArt(k){const m=MAT[k];let g='<g'+an('lb-a-fade',0)+'><g transform="translate('+(TX+TW/2+70)+' '+(TY-6)+') rotate(-118) scale(1.25)"><path d="M-34 -80 L-28 0 L28 0 L34 -80" fill="#ffffff" fill-opacity=".5" stroke="#7a8c96" stroke-width="3"/></g></g>';
 for(let j=0;j<16;j++){const x=TX+TW/2-40+(j*23)%80,y=TY+30+(j*37)%120;g+='<circle cx="'+x+'" cy="'+y+'" r="'+(k==='gs'&&j%3===0?6:3)+'" fill="'+m.c+'" stroke="#6b5235" stroke-width=".8"'+an('lb-a-drop',.1+(j%6)*.12)+'/>'}
 return g}
function modelScene(o){o=o||{};let g=bg({})+tankArt(o);
 MATK.forEach(k=>{if(o.pouring===k)return;const used=(o.ord||[]).indexOf(k)>=0;g+=cupArt(CUPX[k],416,k,{fill:!used,water:!used})});
 if(o.pouring)g+=pourArt(o.pouring);
 return g}
/* 실제 지층(절벽 그림) */
function cliffArt(x,y,w,h){let g='<g transform="translate('+x+' '+y+')"><rect width="'+w+'" height="'+h+'" rx="10" fill="#cfe9f7"/>'+
 strataSVG({x:0,y:h*.16,w,h:h*.68,frame:false,id:'clf'+Math.round(w),shape:'flat',layers:[{c:'#8d8d86',k:'m',t:1.4},{c:'#3f3a35',k:'m',t:.6},{c:'#a8a59a',k:'s',t:1.6},{c:'#5a524a',k:'m',t:.7},{c:'#8d8d86',k:'s',t:1.5},{c:'#3f3a35',k:'m',t:.8}]})+
 '<path d="M0 '+(h*.84)+' Q'+w/2+' '+(h*.8)+' '+w+' '+(h*.85)+' V'+h+' H0Z" fill="#5b8fc4"/><path d="M0 '+(h*.16)+' Q'+(w*.3)+' '+(h*.1)+' '+(w*.55)+' '+(h*.15)+' T'+w+' '+(h*.14)+'" stroke="#6c8f5a" stroke-width="12" fill="none"/><rect width="'+w+'" height="'+h+'" rx="10" fill="none" stroke="#7d7465" stroke-width="3"/></g>';return g}

/* ───────── 실험 3: 퇴적암 ①~⑥(위에서 본 흰 종이) ───────── */
function rockPoly6(i,cx,cy,r){const pts=[];for(let a=0;a<12;a++){const ang=a/12*Math.PI*2,rr=r*(.82+rnd(a+i*13,51)*.22);pts.push([cx+Math.cos(ang)*rr*1.15,cy+Math.sin(ang)*rr*.82])}return pts}
function inPoly(x,y,P){let c=false;for(let i=0,j=P.length-1;i<P.length;j=i++){const a=P[i],b=P[j];if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])c=!c}return c}
/* 알갱이(원본 u1-3 rockSVG의 크기 범위 gs를 따름 — 150칸 그림 기준이라 sc배). hw·hh: 그릴 범위의 반 */
function grains(rk,i,P,cx,cy,hw,hh,sc,nmax){const [a,b]=rk.gs;let g='';
 if(b>0){const m=(a+b)/2*sc,n=Math.min(nmax||300,Math.round(4*hw*hh*.55/(m*m)));for(let j=0;j<n;j++){const x=cx-hw+rnd(i*977+j,61)*hw*2,y=cy-hh+rnd(i*977+j,62)*hh*2;if(P&&!inPoly(x,y,P))continue;
  const rr=(a+rnd(i*31+j,63)*(b-a))*sc*(rnd(j,64+i)<.75&&b>8?.35:1);g+='<ellipse cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" rx="'+rr.toFixed(1)+'" ry="'+(rr*.8).toFixed(1)+'" fill="'+rk.gc[Math.floor(rnd(j,65+i)*rk.gc.length)]+'"'+(rr>4.5?' stroke="#3b3a35" stroke-opacity=".35"':'')+'/>'}}
 else if(!P){for(let j=0;j<260;j++){const x=cx-hw+rnd(i*97+j,66)*hw*2,y=cy-hh+rnd(i*97+j,67)*hh*2;g+='<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="1" fill="'+rk.gc[1]+'" opacity=".75"/>'}}
 return g}
function rock6(i,cx,cy,r,o){o=o||{};const rk=ROCKS[i],P=rockPoly6(i,cx,cy,r);let g='<path d="'+P2(P)+'" fill="'+rk.bg+'" stroke="#3b3a35" stroke-width="2.5" stroke-linejoin="round"/>'+grains(rk,i,P,cx,cy,r*1.2,r*.9,r/68,300);
 if(o.hl)g+='<path d="'+P2(rockPoly6(i,cx,cy,r+12))+'" fill="none" stroke="var(--lb-lens)" stroke-width="5" stroke-dasharray="12 8"/>';
 if(o.stk)g+='<g'+(o.stkAnim?an('lb-a-pop',.2+i*.12):'')+'>'+chip(cx-r*.85,cy-r*.62,i+1,Math.max(13,r*.25))+'</g>';
 return g}
const R6POS=[0,1,2,3,4,5].map(i=>[230+(i%3)*250,200+Math.floor(i/3)*160]);
function paper6(o){o=o||{};let g=bgTop()+(o.nopaper?'':'<g'+(o.paperAnim?an('lb-a-slide',0,'--dx:-900px'):'')+'><rect x="96" y="108" width="780" height="340" rx="6" fill="var(--w-shadow)"/><rect x="90" y="100" width="780" height="340" rx="6" fill="#FFFDF8" stroke="#BDB3A2" stroke-width="2"/></g>');
 R6POS.forEach((p,i)=>{g+=rock6(i,p[0],p[1],64,{stk:o.stk,stkAnim:o.stkAnim,hl:o.hl===i})});return g}
/* 돋보기 속 모습(3배) */
function loupeView(i,cx,cy,R){const rk=ROCKS[i],id='lp'+i+'r'+R;
 return '<clipPath id="'+id+'"><circle cx="'+cx+'" cy="'+cy+'" r="'+R+'"/></clipPath><circle cx="'+cx+'" cy="'+cy+'" r="'+R+'" fill="'+rk.bg+'"/><g clip-path="url(#'+id+')">'+grains(rk,i+40,null,cx,cy,R,R,2.8,420)+'</g>'+
 '<circle cx="'+cx+'" cy="'+cy+'" r="'+R+'" fill="none" stroke="#2B3445" stroke-width="12"/><path d="M'+(cx+R*.72)+' '+(cy+R*.72)+' L'+(cx+R*1.05)+' '+(cy+R*1.05)+'" stroke="#6B4A2B" stroke-width="22" stroke-linecap="round"/>'}
const R6S=[0,1,2,3,4,5].map(i=>[140+(i%2)*150,130+Math.floor(i/2)*130]);
function loupeScene(i,o){o=o||{};let g=bgTop()+'<rect x="50" y="62" width="380" height="410" rx="6" fill="#FFFDF8" stroke="#BDB3A2" stroke-width="2"/>';
 R6S.forEach((p,j)=>{g+=rock6(j,p[0],p[1],46,{stk:1,hl:j===i})});
 if(i==null)g+='<circle cx="690" cy="260" r="170" fill="var(--w-label)" fill-opacity=".5" stroke="#2B3445" stroke-width="12" stroke-dasharray="18 12"/>'+qmark(690,260);
 else g+='<g'+(o.anim?an('lb-a-pop',0):'')+'>'+loupeView(i,690,255,165)+'</g>'+mini(690,470,RN(i),20);
 return g}
/* 세 상자로 나누기(f: 퇴적암마다 고른 칸 0 작은 것 · 1 중간인 것 · 2 큰 것) */
function sortBoxes(f,boxes){let g=bgTop();const B=['작은 것','중간인 것','큰 것'];
 if(boxes){B.forEach((b,j)=>{const x=40+j*300;g+='<rect x="'+x+'" y="230" width="280" height="240" rx="16" fill="var(--w-paper)" stroke="var(--w-felt-s)" stroke-width="2.5"'+(boxes==='a'?an('lb-a-pop',j*.15):'')+'/><text x="'+(x+140)+'" y="268" text-anchor="middle" font-size="26" font-weight="800" fill="#141A26">'+b+'</text>'})}
 const slot=[0,0,0],top=[];ROCKS.forEach((r,i)=>{const v=f?f[i]:null;if(boxes&&v!=null&&v>=0){const n=slot[v]++;g+=rock6(i,40+v*300+55+n*85,380,40,{stk:1})}else top.push(i)});
 top.forEach((i,j)=>{g+=rock6(i,480-(top.length-1)*75+j*150,120,44,{stk:1})});
 return g}

/* ───────── 실험 4: 화석(원본 u1-4의 그림을 옮김) ───────── */
function slab(w,h,c){return '<rect width="'+w+'" height="'+h+'" rx="14" fill="'+(c||'#b9b2a4')+'" stroke="#7d7465" stroke-width="3"/><path d="M14 '+(h*.7)+' q40 -8 80 4 M'+(w*.55)+' 20 q30 6 60 -4" stroke="#a49b8c" stroke-width="2" fill="none"/>'}
const FOSSIL={
 trilobite:()=>{let s='<path d="M100 22 C60 22 52 50 56 62 L144 62 C148 50 140 22 100 22Z" fill="#7a7062" stroke="#4a4239" stroke-width="2.5"/><path d="M60 62 C62 110 84 132 100 134 C116 132 138 110 140 62Z" fill="#8a8174" stroke="#4a4239" stroke-width="2.5"/>';
  for(let i=0;i<9;i++){const y=68+i*7,w=40-i*2.6;s+='<path d="M'+(100-w-2)+' '+y+' Q100 '+(y+3)+' '+(100+w+2)+' '+y+'" stroke="#4a4239" stroke-width="2" fill="none"/>'}
  return s+'<path d="M88 62 C86 100 92 126 100 132 C108 126 114 100 112 62" fill="#9a9184" stroke="#4a4239" stroke-width="2"/><circle cx="80" cy="46" r="5" fill="#4a4239"/><circle cx="120" cy="46" r="5" fill="#4a4239"/>'},
 fern:()=>{let s='<path d="M60 140 Q100 80 150 14" stroke="#4a4239" stroke-width="4" fill="none"/>';
  for(let i=0;i<9;i++){const t=i/9,x=60+t*90-((1-t)*6),y=140-t*126+(t*t*10),L=26*(1-t*.6);
   s+='<path d="M'+x+' '+y+' q'+(-L*.6)+' '+(-L*.2)+' '+(-L)+' '+(-L*.6)+' q'+(L*.5)+' '+(L*.1)+' '+L+' '+(L*.6)+'Z" fill="#6d6457" stroke="#4a4239" stroke-width="1.5"/><path d="M'+x+' '+y+' q'+(L*.7)+' '+(L*.05)+' '+(L*1.1)+' '+(-L*.3)+' q'+(-L*.5)+' '+(-L*.2)+' '+(-L*1.1)+' '+(L*.3)+'Z" fill="#6d6457" stroke="#4a4239" stroke-width="1.5"/>'}return s},
 fish:()=>{let s='<path d="M30 76 C60 40 130 42 158 72 C130 104 60 108 30 76Z" fill="#9a9184" stroke="#4a4239" stroke-width="2.5"/><path d="M156 72 L188 46 L182 74 L188 102Z" fill="#8a8174" stroke="#4a4239" stroke-width="2.5"/><path d="M40 76 H160" stroke="#3d362f" stroke-width="3.5"/>';
  for(let i=0;i<12;i++){const x=58+i*8;s+='<path d="M'+x+' 76 l-6 -'+(18-Math.abs(i-5))+' M'+x+' 76 l-6 '+(18-Math.abs(i-5))+'" stroke="#4a4239" stroke-width="1.6"/>'}
  return s+'<circle cx="44" cy="70" r="5" fill="#3d362f"/><path d="M96 44 l14 -14 l6 16Z M100 106 l12 12 l4 -14Z" fill="#8a8174" stroke="#4a4239" stroke-width="2"/>'},
 ammonite:()=>{let d='M100 75';for(let a=0;a<=12.4;a+=.2){const r=3+a*4.4;d+=' L'+(100+Math.cos(a)*r).toFixed(1)+' '+(75+Math.sin(a)*r).toFixed(1)}
  let s='<circle cx="100" cy="75" r="62" fill="#8a8174" stroke="#4a4239" stroke-width="3"/><path d="'+d+'" fill="none" stroke="#4a4239" stroke-width="3"/>';
  for(let i=0;i<36;i++){const a=i/36*Math.PI*2;s+='<path d="M'+(100+Math.cos(a)*44).toFixed(1)+' '+(75+Math.sin(a)*44).toFixed(1)+' L'+(100+Math.cos(a)*60).toFixed(1)+' '+(75+Math.sin(a)*60).toFixed(1)+'" stroke="#4a4239" stroke-width="2"/>'}return s},
 ginkgo:()=>{let s='<path d="M100 132 L100 92" stroke="#4a4239" stroke-width="4"/><path d="M100 94 C66 92 36 64 42 30 C70 18 130 18 158 30 C164 64 134 92 100 94Z" fill="#8a8174" stroke="#4a4239" stroke-width="2.5"/><path d="M100 30 L100 60" stroke="#b9b2a4" stroke-width="4"/>';
  for(let i=0;i<11;i++){const a=Math.PI*(1.12+i*.076);s+='<path d="M100 94 L'+(100+Math.cos(a)*68).toFixed(1)+' '+(94+Math.sin(a)*68).toFixed(1)+'" stroke="#4a4239" stroke-width="1.2" opacity=".7"/>'}return s},
 bird:()=>{let s='';[[50,110,-10],[95,70,10],[140,32,-8]].forEach(([x,y,r])=>{s+='<g transform="translate('+x+' '+y+') rotate('+(r+25)+')" stroke="#4a4239" stroke-width="5" stroke-linecap="round" fill="none"><path d="M0 0 L0 -26 M0 0 L-18 -18 M0 0 L18 -18 M0 0 L0 8"/></g>'});return s}};
function fossil(kind){return slab(200,150)+FOSSIL[kind]()}
const F6POS=[0,1,2,3,4,5].map(i=>[150+(i%3)*250,128+Math.floor(i/3)*170]);
function fosAt(i,x,y,s,o){o=o||{};let g='<g transform="translate('+x+' '+y+') scale('+s+')">'+fossil(FOS[i].k)+'</g>';
 if(o.hl)g+='<rect x="'+(x-10)+'" y="'+(y-10)+'" width="'+(200*s+20)+'" height="'+(150*s+20)+'" rx="16" fill="none" stroke="var(--lb-lens)" stroke-width="5" stroke-dasharray="12 8"/>';return g}
function paperF(o){o=o||{};let g=bgTop()+(o.nopaper?'':'<g'+(o.paperAnim?an('lb-a-slide',0,'--dx:-900px'):'')+'><rect x="96" y="98" width="790" height="390" rx="6" fill="var(--w-shadow)"/><rect x="90" y="90" width="790" height="390" rx="6" fill="#FFFDF8" stroke="#BDB3A2" stroke-width="2"/></g>');
 if(o.nofos)return g;
 FOS.forEach((f,i)=>{const p=F6POS[i];g+='<g'+(o.anim?an('lb-a-pop',.3+i*.12):'')+'>'+fosAt(i,p[0]+10,p[1],.9,{hl:o.hl===i})+'</g>'+mini(p[0]+100,p[1]+158,f.n,18)});return g}
const F6S=[0,1,2,3,4,5].map(i=>[70+(i%2)*170,80+Math.floor(i/2)*130]);
function fosLoupe(i,o){o=o||{};let g=bgTop()+'<rect x="50" y="62" width="380" height="410" rx="6" fill="#FFFDF8" stroke="#BDB3A2" stroke-width="2"/>';
 F6S.forEach((p,j)=>{g+=fosAt(j,p[0],p[1],.7,{hl:j===i})});
 if(i==null)return g+'<circle cx="690" cy="260" r="170" fill="var(--w-label)" fill-opacity=".5" stroke="#2B3445" stroke-width="12" stroke-dasharray="18 12"/>'+qmark(690,260);
 const id='fl'+i;g+='<g'+(o.anim?an('lb-a-pop',0):'')+'><clipPath id="'+id+'"><circle cx="690" cy="255" r="165"/></clipPath><circle cx="690" cy="255" r="165" fill="#b9b2a4"/><g clip-path="url(#'+id+')"><g transform="translate(690 255) scale(1.9) translate(-100 -75)">'+fossil(FOS[i].k)+'</g></g>'+
  '<circle cx="690" cy="255" r="165" fill="none" stroke="#2B3445" stroke-width="12"/><path d="M809 374 L863 428" stroke="#6B4A2B" stroke-width="22" stroke-linecap="round"/></g>'+mini(690,470,FOS[i].n+' 화석',20);
 return g}
/* 오늘날의 생물 그림(화석과 견주어 보는 그림) */
const LIVE={
 trilobite:()=>'<g transform="translate(100 78)"><ellipse rx="70" ry="44" fill="#8C8A84" stroke="#4E4B45" stroke-width="3"/>'+[...Array(7)].map((_,i)=>'<path d="M'+(-56+i*18)+' -40 Q'+(-52+i*18)+' 0 '+(-56+i*18)+' 40" stroke="#4E4B45" stroke-width="2.5" fill="none"/>').join('')+'<path d="M-70 -6 q-26 -16 -34 -34 M-70 6 q-26 16 -34 34" stroke="#4E4B45" stroke-width="3" fill="none"/>'+[...Array(6)].map((_,i)=>'<path d="M'+(-42+i*16)+' 42 l-4 14 M'+(-42+i*16)+' -42 l-4 -14" stroke="#4E4B45" stroke-width="3"/>').join('')+'</g>',
 fern:()=>FOSSIL.fern().replace(/#6d6457/g,'#6DB04A').replace(/#4a4239/g,'#3F7A27'),
 fish:()=>'<path d="M30 76 C60 40 130 42 158 72 C130 104 60 108 30 76Z" fill="#E6A050" stroke="#A0602A" stroke-width="3"/><path d="M156 72 L188 46 L182 74 L188 102Z" fill="#E6A050" stroke="#A0602A" stroke-width="3"/><circle cx="48" cy="70" r="5" fill="#333"/><path d="M96 44 l14 -14 l6 16Z M100 106 l12 12 l4 -14Z" fill="#D88C3A" stroke="#A0602A" stroke-width="2"/>',
 ammonite:()=>{let d='M120 70';for(let a=0;a<=4*Math.PI*1.6;a+=.2){const r=2+a*3.6;d+=' L'+(120+Math.cos(a)*r).toFixed(1)+' '+(70+Math.sin(a)*r).toFixed(1)}
  return '<path d="M30 118 Q40 100 70 104 L160 108 Q178 112 172 124 L40 126 Q26 124 30 118Z" fill="#D9B48C" stroke="#8C6A45" stroke-width="3"/><path d="M40 106 q-10 -24 -4 -40 M52 104 q-4 -24 6 -38" stroke="#8C6A45" stroke-width="3" fill="none"/><circle cx="120" cy="70" r="46" fill="#C98A5A" stroke="#7A4E2C" stroke-width="3"/><path d="'+d+'" fill="none" stroke="#7A4E2C" stroke-width="3"/>'},
 ginkgo:()=>FOSSIL.ginkgo().replace(/#8a8174/g,'#F2C94C').replace(/#4a4239/g,'#A57F12').replace(/#b9b2a4/g,'#F7E08A'),
 bird:()=>'<rect width="200" height="150" rx="14" fill="#EBD9AE" stroke="#C9A96A" stroke-width="3"/>'+FOSSIL.bird().replace(/#4a4239/g,'#9C7A3E')};
function likeScene(i,o){o=o||{};let g=bgTop();if(i==null){g+=fosAt(0,130,150,1.5,{})+'<rect x="530" y="150" width="300" height="225" rx="16" fill="var(--w-label)" fill-opacity=".5" stroke="var(--w-felt-s)" stroke-width="3" stroke-dasharray="12 8"/>'+qmark(680,262);return g}
 const k=FOS[i].k;g+=fosAt(i,130,150,1.5,{})+mini(280,420,FOS[i].n+' 화석',20);
 g+='<g'+(o.anim?an('lb-a-pop',.2):'')+'><rect x="526" y="146" width="308" height="233" rx="18" fill="#FFFDF8" stroke="#BDB3A2" stroke-width="2.5"/><g transform="translate(530 150) scale(1.5)">'+LIVE[k]()+'</g></g>'+mini(680,420,'오늘날의 생물',20);
 return g}
/* 몸인지 자국인지 두 상자 */
function kindBoxes(f,boxes){let g=bgTop();const B=['생물의 몸','생물이 남긴 자국'];
 if(boxes)B.forEach((b,j)=>{const x=60+j*440;g+='<rect x="'+x+'" y="200" width="400" height="290" rx="16" fill="var(--w-paper)" stroke="var(--w-felt-s)" stroke-width="2.5"'+(boxes==='a'?an('lb-a-pop',j*.15):'')+'/><text x="'+(x+200)+'" y="238" text-anchor="middle" font-size="26" font-weight="800" fill="#141A26">'+b+'</text>'});
 const slot=[0,0],top=[];FOS.forEach((x,i)=>{const v=f?f[i]:null;if(boxes&&v!=null){const n=slot[v]++;g+=fosAt(i,60+v*440+20+(n%3)*124,262+Math.floor(n/3)*104,.56,{})}else top.push(i)});
 top.forEach((i,j)=>{g+=fosAt(i,480-(top.length)*68+j*136,40,.6,{})});
 return g}

/* ───────── 실험 5: 화석 모형(옆에서 본 실험대) ───────── */
function shell(cx,cy,w,o){o=o||{};const h=w*.86,f=o.fill||'#f3e6cf',st=o.st||'#a08460';let s='<g transform="translate('+cx+' '+cy+')">';
 s+='<rect x="'+(-w*.22)+'" y="'+(h*.3)+'" width="'+(w*.44)+'" height="'+(h*.16)+'" rx="3" fill="'+f+'" stroke="'+st+'" stroke-width="2"/>';
 s+='<path d="M0 '+(h*.42)+' L'+(-w*.48)+' '+(-h*.04)+' Q'+(-w*.52)+' '+(-h*.52)+' 0 '+(-h*.5)+' Q'+(w*.52)+' '+(-h*.52)+' '+(w*.48)+' '+(-h*.04)+'Z" fill="'+f+'" stroke="'+st+'" stroke-width="'+(o.sw||2.5)+'" stroke-linejoin="round"/>';
 for(let i=-3;i<=3;i++){const a=i/3.6,ex=Math.sin(a)*w*.46,ey=-h*.08-Math.cos(a)*h*.4;s+='<path d="M0 '+(h*.4)+' L'+ex.toFixed(1)+' '+ey.toFixed(1)+'" stroke="'+st+'" stroke-width="1.6"/>'}
 return s+'</g>'}
const BW={x:300,w:360,t:230,b:410},CLAYH=70;
/* 그릇 속. o: bag clay imp water plaster(0~1) hard lift */
function bowlArt(o){o=o||{};const x=BW.x,w=BW.w,t=BW.t,b=BW.b,ct=b-CLAYH;let g=shadow(x+w/2,b+6,w/2+10);
 g+='<path d="M'+x+' '+t+' L'+(x+14)+' '+b+' L'+(x+w-14)+' '+b+' L'+(x+w)+' '+t+'" fill="var(--w-glass)"/>';
 let c='';
 if(o.bag)c+='<path d="M'+(x-10)+' '+(t-24)+' L'+(x+16)+' '+(b-3)+' L'+(x+w-16)+' '+(b-3)+' L'+(x+w+10)+' '+(t-24)+'" fill="#e9f4fb" fill-opacity=".45" stroke="#9fb7c4" stroke-width="2"'+(o.bagAnim?an('lb-a-fade',0):'')+'/>';
 if(o.clay){c+='<g'+(o.clayAnim?' class="lb-a lb-a-hillup" style="animation-delay:.6s"':'')+'><path d="M'+(x+18)+' '+ct+' L'+(x+20)+' '+(b-5)+' L'+(x+w-20)+' '+(b-5)+' L'+(x+w-18)+' '+ct+'Z" fill="#9a7b5c"/>';
  for(let j=0;j<5;j++)c+='<path d="M'+(x+40+j*60)+' '+(ct+16+(j%2)*18)+' q14 -4 28 0" stroke="#7f6449" stroke-width="2" fill="none"/>';c+='</g>'}
 if(o.imp)c+='<path d="M'+(480-40)+' '+ct+' Q480 '+(ct+26)+' '+(480+40)+' '+ct+'Z" fill="#6f563e"'+(o.impAnim?an('lb-a-fade',1):'')+'/>';
 if(o.water){const wt=ct-40;c+='<g'+(o.waterAnim?' class="lb-a lb-a-hillup"':'')+'><rect x="'+(x+16)+'" y="'+wt+'" width="'+(w-32)+'" height="'+(ct-wt)+'" fill="#8cc8ec" opacity="'+(o.plaster?.25:.6)+'"/></g>'}
 if(o.plaster){const pt=ct-44;c+='<g'+(o.plasterAnim?an('lb-a-fade',.8):'')+'><rect x="'+(x+16)+'" y="'+pt+'" width="'+(w-32)+'" height="'+(ct-pt)+'" fill="#f2f2ee" opacity="'+(o.hard?1:.82)+'"/>'+(o.imp?'<path d="M'+(480-40)+' '+ct+' Q480 '+(ct+26)+' '+(480+40)+' '+ct+'Z" fill="#f2f2ee" opacity="'+(o.hard?1:.82)+'"/>':'')+(o.hard?'':'<path d="M'+(x+30)+' '+(pt+8)+' q20 -6 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0" stroke="#d4d4cc" stroke-width="2" fill="none"/>')+'</g>';
  if(o.plasterAnim)for(let j=0;j<22;j++)c+='<circle cx="'+(x+60+(j*37)%(w-120))+'" cy="'+(t-60+(j*29)%80)+'" r="3" fill="#FFFFFF" stroke="#BBBBBB"'+an('lb-a-drop',.05+(j%7)*.1)+'/>'}
 g+=o.lift?'<g transform="translate(0 -170)"><g'+(o.liftAnim?an('lb-a-raise',0,'--from:170px'):'')+'>'+c+'</g></g>':c;
 g+='<path d="M'+x+' '+t+' L'+(x+14)+' '+b+' L'+(x+w-14)+' '+b+' L'+(x+w)+' '+t+'" fill="none" stroke="#7a8c96" stroke-width="5"/><path d="M'+(x+14)+' '+(t+14)+' L'+(x+22)+' '+(t+100)+'" stroke="#FFFFFF" stroke-width="5" opacity=".55" stroke-linecap="round"/>';
 return g}
/* 조개껍데기를 눌렀다 떼기(손가락 + 조개) */
function pressArt(anim){const ct=BW.b-CLAYH;return '<g'+(anim?an('lb-a-press',0,'--dy:'+(ct-150)+'px'):'')+'>'+shell(480,150-28,80)+'<g transform="translate(480 80)"><rect x="-16" y="-60" width="32" height="64" rx="12" fill="#F2C6A0" stroke="#B9875F" stroke-width="2.5"/></g></g>'}
/* 떼어 낸 두 조각(위에서 비스듬히 본 모습): 찰흙의 오목한 자국 · 석고의 볼록한 모양 */
function piecesArt(o){o=o||{};let g='';const A=o.anim;
 g+='<g'+(A?an('lb-a-slide',0,'--dx:120px'):'')+'><rect x="150" y="250" width="280" height="150" rx="12" fill="#9a7b5c" stroke="#6e5640" stroke-width="3"/><rect x="150" y="380" width="280" height="30" rx="8" fill="#7f6449"/>'+
  shell(290,320,100,{fill:'#6f563e',st:'#4e3a28'})+'<path d="M245 284 Q290 268 335 284" stroke="#4e3a28" stroke-width="5" fill="none" opacity=".7"/></g>';
 g+='<g'+(A?an('lb-a-slide',0,'--dx:-120px'):'')+'><rect x="530" y="250" width="280" height="150" rx="12" fill="#f2f2ee" stroke="#a9a9a2" stroke-width="3"/><rect x="530" y="380" width="280" height="30" rx="8" fill="#dcdcd4"/>'+
  '<ellipse cx="676" cy="356" rx="54" ry="12" fill="rgba(0,0,0,.18)"/>'+shell(670,316,100,{fill:'#FFFFFF',st:'#8d8d8d'})+'<path d="M626 290 Q670 276 714 290" stroke="#FFFFFF" stroke-width="5" fill="none"/></g>';
 if(!o.nolab)g+=mini(290,452,'찰흙',20)+mini(670,452,'석고',20);
 return g}
function openSpot(){const c=UI.mq.cur;if(c==='oc')return [290,320,62,1.8,730,140];if(c==='op')return [670,316,62,1.8,230,140];return null}
/* 조개 화석 표본(실제) */
function realShell(x,y,s){return '<g transform="translate('+x+' '+y+') scale('+(s||1)+')">'+slab(200,150,'#9b9384')+shell(100,75,90,{fill:'#c8bfae',st:'#5e574c'})+'</g>'}
function modelShell(x,y,s){return '<g transform="translate('+x+' '+y+') scale('+(s||1)+')"><rect width="200" height="150" rx="14" fill="#f2f2ee" stroke="#a9a9a2" stroke-width="3"/><ellipse cx="104" cy="114" rx="46" ry="10" fill="rgba(0,0,0,.16)"/>'+shell(100,75,90,{fill:'#FFFFFF',st:'#8d8d8d'})+'</g>'}
function clockArt(x,y,anim){return '<g transform="translate('+x+' '+y+')"><circle r="46" fill="#FFFFFF" stroke="#2A3342" stroke-width="5"/>'+[...Array(12)].map((_,i)=>{const a=i/12*Math.PI*2;return '<path d="M'+(Math.sin(a)*36).toFixed(1)+' '+(-Math.cos(a)*36).toFixed(1)+' L'+(Math.sin(a)*41).toFixed(1)+' '+(-Math.cos(a)*41).toFixed(1)+'" stroke="#2A3342" stroke-width="3"/>'}).join('')+
 '<path d="M0 0 V-24" stroke="#2A3342" stroke-width="5" stroke-linecap="round"/><g><path d="M0 0 L0 -34"'+(anim?' class="lb-a lb-a-spin"':'')+' stroke="#C2410C" stroke-width="4" stroke-linecap="round"/></g><circle r="5" fill="#2A3342"/></g>'}

/* ───────── 준비물 카드 ───────── */
function itemArt(k){const A={
  cards:'<g transform="translate(-58 -38) rotate(-6)">'+cardArt(0,0,0,92,58,{})+'</g><g transform="translate(-30 -18) rotate(5)">'+cardArt(1,0,0,92,58,{})+'</g>',
  pen:penArt(0,4,35,.85),
  tank:'<rect x="-52" y="-44" width="104" height="86" fill="var(--w-glass)" stroke="#5a7d8c" stroke-width="4" rx="3"/>',
  water:beaker(0,0,0,.8,1),
  cups:[-40,0,40].map(x=>'<path d="M'+(x-16)+' -26 L'+(x-13)+' 26 L'+(x+13)+' 26 L'+(x+16)+' -26" fill="#ffffff" fill-opacity=".5" stroke="#7a8c96" stroke-width="2.5"/>').join(''),
  gravel:[[-26,10],[0,4],[24,12],[-12,-12],[14,-10],[0,24],[-30,-8]].map(p=>'<ellipse cx="'+p[0]+'" cy="'+p[1]+'" rx="12" ry="9" fill="#8f7f6a" stroke="#5f5242" stroke-width="2"/>').join(''),
  sand:'<path d="M-56 30 Q-40 -20 0 -24 Q40 -20 56 30Z" fill="#e8cf8a" stroke="#b89a52" stroke-width="2.5"/>'+[...Array(14)].map((_,i)=>'<circle cx="'+(-34+(i*13)%70)+'" cy="'+(-6+(i*7)%30)+'" r="1.8" fill="#7a6040"/>').join(''),
  mud:'<path d="M-56 30 Q-44 -14 -6 -20 Q40 -22 56 30Z" fill="#8a6a4c" stroke="#5c432d" stroke-width="2.5"/><path d="M-30 8 q14 -4 28 0 M6 16 q14 -4 26 0" stroke="#5c432d" stroke-width="2" fill="none"/>',
  coat:coat(0,-2,.62),
  lglove:lglove(-14,-10,-60,.75)+lglove(22,8,-60,.75),
  cglove:cotton(-14,-10,-60,.75)+cotton(22,8,-60,.75),
  rocks:rock6(0,-34,-18,20)+rock6(1,30,-18,20)+rock6(2,-34,26,20)+rock6(3,30,26,20),
  wpaper:'<rect x="-50" y="-36" width="100" height="74" rx="3" fill="#FFFDF8" stroke="#A39B8B" stroke-width="2"/>',
  sticker:'<rect x="-52" y="-30" width="104" height="60" rx="5" fill="#FFFFFF" stroke="#B9C2CA" stroke-width="2"/>'+[1,2,3,4].map(i=>chip(-36+(i-1)*24,0,i,10)).join(''),
  loupe:magnifier(-8,-8,1.1,0),
  fossils:'<g transform="translate(-62 -44) scale(.42)">'+fossil('ammonite')+'</g><g transform="translate(-4 -12) scale(.36)">'+fossil('fish')+'</g>',
  bowl:'<path d="M-56 -30 L-46 36 L46 36 L56 -30" fill="var(--w-glass)" stroke="#7a8c96" stroke-width="4"/>',
  bag:'<path d="M-44 -38 L-40 36 L40 36 L44 -38" fill="#e9f4fb" fill-opacity=".6" stroke="#9fb7c4" stroke-width="2.5"/><path d="M-44 -38 L-30 -26 L-14 -38 L0 -26 L14 -38 L30 -26 L44 -38" stroke="#9fb7c4" stroke-width="2" fill="none"/>',
  clay:'<rect x="-46" y="-22" width="92" height="52" rx="12" fill="#9a7b5c" stroke="#6e5640" stroke-width="2.5"/><path d="M-30 -4 q14 -4 28 0 M4 10 q14 -4 26 0" stroke="#7f6449" stroke-width="2" fill="none"/>',
  shell:shell(0,0,70),
  plaster:'<path d="M-34 -36 H34 V36 Q34 42 28 42 H-28 Q-34 42 -34 36Z" fill="#FFFFFF" stroke="#8C959F" stroke-width="2.5"/><rect x="-34" y="-36" width="68" height="16" fill="#C9D1D9"/><path d="M-20 4 h40 M-20 18 h30" stroke="#B7C0C9" stroke-width="3"/>',
  sfossil:'<g transform="translate(-60 -45) scale(.6)">'+realShell(0,0,1)+'</g>',
  safety:coat(-30,4,.5)+goggles(30,-20,.55)+'<g transform="translate(34 26) scale(.55)">'+lglove(0,0,-60,1)+'</g>'};
 return A[k]||''}
