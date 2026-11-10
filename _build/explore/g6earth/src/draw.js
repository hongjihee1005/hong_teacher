/* ───────── 그림: 실험 장면 — 모두 직접 그린 SVG (지구의 운동) ───────── */
const BY=436;
let NAR=false,LEG=[];   /* 좁은 화면: 작은 그림 글자는 HTML(LEG)로 */
function an(cls,delay,extra){return ' class="lb-a '+cls+'" style="animation-delay:'+(delay||0)+'s'+(extra?';'+extra:'')+'"'}
function bg(o){o=o||{};let g='<rect x="-3000" y="-3000" width="7000" height="3416" fill="var(--w-wall)"/><rect x="-3000" y="330" width="7000" height="86" fill="var(--w-wall2)"/><rect x="-3000" y="326" width="7000" height="5" fill="var(--w-rail)"/>';
 g+='<rect x="-3000" y="416" width="7000" height="36" fill="var(--w-top)"/><rect x="-3000" y="452" width="7000" height="6" fill="var(--w-edge)"/><rect x="-3000" y="458" width="7000" height="3000" fill="var(--w-front)"/>';
 for(let i=0;i<5;i++)g+='<path d="M-3000 '+(478+i*20)+' H4000" stroke="var(--w-grain)" stroke-width="1.2" opacity=".35"/>';
 return g}
function defs(){return ''}
function svg(inner,label,vb){return '<svg viewBox="'+(vb||'0 0 960 540')+'" preserveAspectRatio="xMidYMid meet" role="img" aria-label="'+label+'">'+defs()+inner+'</svg>'}
function tag(x,y,t,sz){sz=sz||20;if(NAR){LEG.push([null,t]);return ''}const w=t.length*sz*.95+24;return '<g><rect x="'+(x-w/2)+'" y="'+(y-sz*.95)+'" width="'+w+'" height="'+(sz*1.5)+'" rx="'+(sz*.5)+'" fill="var(--w-label)" stroke="var(--w-felt-s)" stroke-width="1.5"/><text x="'+x+'" y="'+(y+sz*.3)+'" text-anchor="middle" font-size="'+sz+'" font-weight="800" fill="var(--w-labeltx)">'+t+'</text></g>'}
/* 그림 속 짧은 이름(좁은 화면에서도 그림 안에 둠 — 시간·선 이름처럼 꼭 필요한 것만) */
function mini(x,y,t,sz){sz=sz||20;const w=t.length*sz*.95+16;return '<g><rect x="'+(x-w/2)+'" y="'+(y-sz*.95)+'" width="'+w+'" height="'+(sz*1.4)+'" rx="'+(sz*.45)+'" fill="var(--w-label)" stroke="var(--w-felt-s)" stroke-width="1.5"/><text x="'+x+'" y="'+(y+sz*.28)+'" text-anchor="middle" font-size="'+sz+'" font-weight="800" fill="var(--w-labeltx)">'+t+'</text></g>'}
function qmark(x,y,col){return '<g'+an('lb-a-pop',.2)+'><circle cx="'+x+'" cy="'+y+'" r="28" fill="var(--w-label)" stroke="'+(col||'var(--lb-sci)')+'" stroke-width="3" stroke-dasharray="6 5"/><text x="'+x+'" y="'+(y+12)+'" text-anchor="middle" font-size="34" font-weight="800" fill="'+(col||'var(--lb-sci-ink)')+'">?</text></g>'}
function hand(x,y,rot,s,glove){const sk=glove?'#FFFFFF':'#F2C6A0',ss=glove?'#9AA6B2':'#B9875F';return '<g transform="translate('+x+' '+y+') rotate('+(rot||0)+') scale('+(s||1)+')"><path d="M-30 -14 Q-8 -24 18 -18 L40 -16 Q48 -15 47 -9 Q46 -4 38 -4 L22 -4 Q30 2 26 9 Q22 15 10 13 L-30 14Z" fill="'+sk+'" stroke="'+ss+'" stroke-width="2.2" stroke-linejoin="round"/><path d="M-30 -14 L-62 -14 L-62 14 L-30 14Z" fill="#5C8FCB" stroke="#3D6A9C" stroke-width="2"/></g>'}
function arrow(x1,y1,x2,y2,col,w){col=col||'var(--lb-sci)';w=w||7;const a=Math.atan2(y2-y1,x2-x1),L=18;
 return '<g><path d="M'+x1+' '+y1+' L'+x2+' '+y2+'" stroke="'+col+'" stroke-width="'+w+'" stroke-linecap="round"/><path d="M'+(x2-L*Math.cos(a-.5)).toFixed(1)+' '+(y2-L*Math.sin(a-.5)).toFixed(1)+' L'+x2+' '+y2+' L'+(x2-L*Math.cos(a+.5)).toFixed(1)+' '+(y2-L*Math.sin(a+.5)).toFixed(1)+'" stroke="'+col+'" stroke-width="'+w+'" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>'}
function shadow(cx,y,rx){return '<ellipse cx="'+cx+'" cy="'+y+'" rx="'+rx+'" ry="7" fill="var(--w-shadow)"/>'}
function bgTop(){let g='<rect x="-3000" y="-3000" width="7000" height="7000" fill="var(--w-top)"/>';
 for(let i=0;i<14;i++)g+='<path d="M-3000 '+(-40+i*46)+' Q480 '+(-30+i*46+(i%2?10:-10))+' 4000 '+(-40+i*46)+'" stroke="var(--w-grain)" stroke-width="1.4" fill="none" opacity=".28"/>';
 return g}
function rnd(i,s){const h=Math.sin(i*12.9898+(s||0)*78.233)*43758.5453;return h-Math.floor(h)}
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
/* ───────── 지구의 운동: 그림(모두 직접 그린 SVG) ───────── */
let CID=0;   /* clipPath·그러데이션 이름이 겹치지 않게 */
const nrm=a=>{a=((a%360)+360)%360;return a>180?a-360:a};
const f1=n=>(+n).toFixed(1);
function T(x,y,t,sz,col,anc,wt){return '<text x="'+f1(x)+'" y="'+f1(y)+'" font-size="'+(sz||20)+'" font-weight="'+(wt||800)+'" text-anchor="'+(anc||'middle')+'" fill="'+(col||'var(--w-labeltx)')+'">'+t+'</text>'}
/* 방위 글자 상자(그림 속 꼭 필요한 글자 — 좁은 화면에서도 그림 안에 둠) */
function dirBox(x,y,t,sz){sz=sz||24;const w=t.length*sz+16;return '<g><rect x="'+f1(x-w/2)+'" y="'+f1(y-sz*.95)+'" width="'+f1(w)+'" height="'+f1(sz*1.45)+'" rx="8" fill="#FFFFFF" stroke="#0F2E4A" stroke-width="2"/>'+T(x,y+sz*.3,t,sz,'#0F2E4A')+'</g>'}
/* ── 실험 1: 남쪽을 바라본 운동장 하늘(방위각 60°~300°, 고도 0°~) ── */
const SX=az=>480+(az-180)*3.6,SY=alt=>420-alt*4.6;
function skyPan(o){o=o||{};const dark=!!o.dark,id='lbSk'+(++CID);
 let g='<defs><linearGradient id="'+id+'" x1="0" y1="0" x2="0" y2="1">'+(dark?'<stop offset="0" stop-color="#1C140B"/><stop offset="1" stop-color="#47331A"/>':'<stop offset="0" stop-color="#6FB2E2"/><stop offset="1" stop-color="#D7EEFA"/>')+'</linearGradient></defs>';
 g+='<rect x="-200" y="-200" width="1360" height="622" fill="url(#'+id+')"/>';
 /* 먼 산과 건물·나무(학교 운동장, 이 실험관에서 정한 모습) */
 const hill=dark?'#2C3324':'#9CC28E',bld=dark?'#3B3428':'#E6D8C2',bs=dark?'#5A4C38':'#7C6A50',tr=dark?'#283222':'#3F7D3A',tk=dark?'#3A2A1A':'#6B4A2A';
 g+='<path d="M560 422 Q620 392 680 404 Q740 384 800 400 Q860 390 940 412 L940 422Z" fill="'+hill+'"/><path d="M40 422 Q90 400 150 410 Q190 398 240 416 L240 422Z" fill="'+hill+'"/>';
 g+='<rect x="300" y="372" width="120" height="50" fill="'+bld+'" stroke="'+bs+'" stroke-width="2"/><path d="M296 372 H424 L410 362 H310Z" fill="'+bs+'"/>';
 if(!dark)for(let i=0;i<6;i++)g+='<rect x="'+(308+i*19)+'" y="382" width="11" height="10" fill="#8FC3E6"/><rect x="'+(308+i*19)+'" y="400" width="11" height="10" fill="#8FC3E6"/>';
 [[110,30],[235,26],[610,34],[880,28]].forEach(([x,h])=>{g+='<rect x="'+(x-4)+'" y="'+(422-h*.9)+'" width="8" height="'+(h*.9)+'" fill="'+tk+'"/><ellipse cx="'+x+'" cy="'+(422-h*1.2)+'" rx="'+(h*.75)+'" ry="'+(h*.55)+'" fill="'+tr+'"/>'});
 g+='<rect x="-200" y="420" width="1360" height="200" fill="'+(dark?'#2A281F':'#86B35E')+'"/><rect x="-200" y="420" width="1360" height="4" fill="'+(dark?'#1A1912':'#5F8C3E')+'"/>';
 [[90,'동'],[135,'남동'],[180,'남'],[225,'남서'],[270,'서']].forEach(([a,n])=>{const x=SX(a);g+='<path d="M'+x+' 420 V436" stroke="'+(dark?'#D9D2C2':'#2F4A1E')+'" stroke-width="3"/>'+(n.length===1?dirBox(x,468,n,26):T(x,466,n,20,dark?'#EDE6D6':'#21361A'))});
 /* 날짜 비교 점선(더 알아보기) */
 (o.extra||[]).forEach(e=>{const P=SUNT.map(h=>sunPos({y:SD.y,m:e[0],d:e[1]},h));let p='';P.forEach((q,i)=>{p+=(i?' L':'M')+f1(SX(q[1]))+' '+f1(SY(q[0]))});
  g+='<path d="'+p+'" fill="none" stroke="'+e[3]+'" stroke-width="4" stroke-dasharray="9 8"/>'+P.map(q=>'<circle cx="'+f1(SX(q[1]))+'" cy="'+f1(SY(q[0]))+'" r="8" fill="'+e[3]+'" stroke="#FFFFFF" stroke-width="2"/>').join('');
  const L=P[4];g+=mini(Math.min(890,SX(L[1])+40),SY(L[0])-22,e[2],17)});
 /* 붙인 태양 붙임딱지 */
 const stk=(o.stk||[]).map(i=>{const q=sunPos(SD,SUNT[i]);return {i,x:SX(q[1]),y:SY(q[0])}});
 if(stk.length>1){let p='';stk.forEach((q,i)=>{p+=(i?' L':'M')+f1(q.x)+' '+f1(q.y)});g+='<path d="'+p+'" fill="none" stroke="'+(dark?'#FFD23F':'#C2410C')+'" stroke-width="3" stroke-dasharray="5 7"/>'}
 stk.forEach(q=>{g+=sticker(q.x,q.y,1)+mini(q.x,q.y+52,fmtH(SUNT[q.i]),17)});
 /* 지금 보이는 태양(안경을 쓰면 주황 원, 맨눈이면 눈부심) */
 if(o.cur!=null){const q=sunPos(SD,SUNT[o.cur]),x=SX(q[1]),y=SY(q[0]),a=o.curA==null?1:o.curA;
  g+=dark?'<g opacity="'+f1(a)+'"><circle cx="'+f1(x)+'" cy="'+f1(y)+'" r="16" fill="#FF9A2E" stroke="#FFD23F" stroke-width="3"/></g>'
   :'<g opacity="'+f1(a)+'"><circle cx="'+f1(x)+'" cy="'+f1(y)+'" r="80" fill="#FFFFFF" opacity=".55"/><circle cx="'+f1(x)+'" cy="'+f1(y)+'" r="40" fill="#FFFFFF" opacity=".8"/><circle cx="'+f1(x)+'" cy="'+f1(y)+'" r="18" fill="#FFFFFF"/></g>'}
 if(o.date)g+=mini(o.date.length*9.5+30,40,o.date,18);
 return g}
/* 태양 붙임딱지 */
function sticker(x,y,s){let g='<g transform="translate('+f1(x)+' '+f1(y)+') scale('+(s||1)+')">';for(let i=0;i<8;i++){const a=i*Math.PI/4;g+='<path d="M'+f1(21*Math.cos(a))+' '+f1(21*Math.sin(a))+' L'+f1(29*Math.cos(a))+' '+f1(29*Math.sin(a))+'" stroke="#E2573F" stroke-width="4" stroke-linecap="round"/>'}
 return g+'<circle r="16" fill="#FFD23F" stroke="#E2573F" stroke-width="3"/></g>'}
/* 운동장 옆모습(장소 고르기) */
function field(kx,o){o=o||{};let g='<rect x="-200" y="-200" width="1360" height="620" fill="#CFE8F7"/>';
 g+='<rect x="40" y="150" width="190" height="270" fill="#E6D8C2" stroke="#7C6A50" stroke-width="3"/>';for(let r=0;r<5;r++)for(let c=0;c<4;c++)g+='<rect x="'+(56+c*44)+'" y="'+(170+r*48)+'" width="26" height="26" fill="#8FC3E6"/>';
 [[270,150],[320,120]].forEach(([x,h])=>{g+='<rect x="'+(x-7)+'" y="'+(420-h)+'" width="14" height="'+h+'" fill="#6B4A2A"/><ellipse cx="'+x+'" cy="'+(420-h)+'" rx="46" ry="60" fill="#3F7D3A"/>'});
 g+='<path d="M600 420 Q700 390 800 404 Q880 396 980 410 V420Z" fill="#9CC28E"/><rect x="-200" y="420" width="1360" height="200" fill="#C9B184"/><path d="M380 470 H940" stroke="#FFFFFF" stroke-width="4" opacity=".7"/>';
 g+=kidSide(kx,420);
 if(o.ring)g+='<circle cx="'+kx+'" cy="250" r="150" fill="none" stroke="var(--lb-sci)" stroke-width="5" stroke-dasharray="14 10"/>';
 return g}
function kidSide(x,y,s){s=s||1;return '<g transform="translate('+f1(x)+' '+y+') scale('+s+')"><rect x="-16" y="-62" width="32" height="44" rx="10" fill="#E2573F"/><rect x="-14" y="-20" width="11" height="20" fill="#33415C"/><rect x="3" y="-20" width="11" height="20" fill="#33415C"/><circle cy="-80" r="17" fill="#F1C7A1"/><path d="M-17 -84 Q0 -102 17 -84 Q12 -92 0 -92 Q-12 -92 -17 -84Z" fill="#3B2A20"/></g>'}
/* 나침반(위에서 본 모습). ang = 바늘 빨간 끝 방향(화면 위에서 시계 방향 각도) */
function compassTop(x,y,r,ang,o){o=o||{};let g='<g transform="translate('+f1(x)+' '+f1(y)+')"><circle r="'+(r+8)+'" fill="#3B4650"/><circle r="'+r+'" fill="#F7F4EC" stroke="#9AA6B2" stroke-width="3"/>';
 for(let i=0;i<16;i++){const a=i*Math.PI/8,l=i%4?8:16;g+='<path d="M'+f1((r-l)*Math.sin(a))+' '+f1(-(r-l)*Math.cos(a))+' L'+f1(r*Math.sin(a))+' '+f1(-r*Math.cos(a))+'" stroke="#5A6672" stroke-width="'+(i%4?2:3)+'"/>'}
 if(o.letters)[['북',0],['동',90],['남',180],['서',270]].forEach(([t,a])=>{const rr=r-34;g+=T(rr*Math.sin(a*RAD),-rr*Math.cos(a*RAD)+9,t,26,'#0F2E4A')});
 g+='<g transform="rotate('+f1(ang)+')"><path d="M0 '+(-r+18)+' L12 0 L-12 0Z" fill="#D2312A"/><path d="M0 '+(r-18)+' L12 0 L-12 0Z" fill="#9AA6B2"/><circle r="7" fill="#3B4650"/></g></g>';
 return g}
/* 위에서 본 학생. th = 바라보는 쪽(화면 위에서 시계 방향 각도) · notes [왼손, 오른손] 글 */
function kidTop(x,y,th,o){o=o||{};const s=o.s||1;
 let g='<g transform="translate('+f1(x)+' '+f1(y)+') scale('+s+') rotate('+f1(th)+')">';
 g+='<path d="M0 -34 V-58" stroke="var(--lb-sci)" stroke-width="5"/><path d="M-11 -54 L0 -72 L11 -54Z" fill="var(--lb-sci)"/>';
 g+='<path d="M-34 0 H-64 M34 0 H64" stroke="#F1C7A1" stroke-width="10" stroke-linecap="round"/><ellipse rx="36" ry="16" fill="#E2573F" stroke="#7A2A1F" stroke-width="3"/><circle r="15" fill="#3B2A20"/>';
 if(o.glove)g+='<circle cx="-68" r="9" fill="#FFFFFF" stroke="#9AA6B2" stroke-width="2"/><circle cx="68" r="9" fill="#FFFFFF" stroke="#9AA6B2" stroke-width="2"/>';
 if(o.notes)o.notes.forEach((t,i)=>{if(t==null)return;const cx=i?76:-76;g+='<g transform="translate('+cx+' 0) rotate('+f1(-th)+')"><rect x="-17" y="-15" width="34" height="30" rx="5" fill="#FFE680" stroke="#B8860B" stroke-width="2"/>'+T(0,8,t,20,'#3D2B00')+'</g>'});
 return g+'</g>'}
/* 전등(갓 없는 전등). on = 켜짐 정도(0~1) */
function lampTop(x,y,on,s){s=s||1;let g='<g transform="translate('+f1(x)+' '+f1(y)+') scale('+s+')">';
 if(on>0){g+='<circle r="58" fill="#FFE27A" opacity="'+f1(.35*on)+'"/>';for(let i=0;i<10;i++){const a=i*Math.PI/5;g+='<path d="M'+f1(30*Math.cos(a))+' '+f1(30*Math.sin(a))+' L'+f1(42*Math.cos(a))+' '+f1(42*Math.sin(a))+'" stroke="#F0A020" stroke-width="5" stroke-linecap="round" opacity="'+f1(on)+'"/>'}}
 return g+'<circle r="22" fill="'+(on>0?'#FFE27A':'#E9EDF2')+'" stroke="'+(on>0?'#D08A00':'#8A96A1')+'" stroke-width="3"/><circle r="9" fill="'+(on>0?'#FFF8D6':'#C9D3DA')+'"/></g>'}
function lampSide(x,y,on,s){s=s||1;let g='<g transform="translate('+f1(x)+' '+f1(y)+') scale('+s+')">';
 if(on>0)g+='<circle r="70" fill="#FFE27A" opacity="'+f1(.3*on)+'"/>';
 g+='<path d="M-8 26 V'+(140)+'" stroke="#5A6672" stroke-width="10"/><rect x="-46" y="136" width="92" height="12" rx="5" fill="#3B4650"/><rect x="-14" y="18" width="28" height="18" rx="3" fill="#9AA6B2"/>';
 return g+'<circle r="26" fill="'+(on>0?'#FFE27A':'#E9EDF2')+'" stroke="'+(on>0?'#D08A00':'#8A96A1')+'" stroke-width="3"/><path d="M-8 6 Q0 -10 8 6" stroke="#B88A2E" stroke-width="2.5" fill="none"/></g>'}
/* 별 역할(위에서 본 모습) */
function starKid(x,y,s){s=s||1;return '<g transform="translate('+f1(x)+' '+f1(y)+') scale('+s+')"><ellipse rx="32" ry="14" fill="#6EC3F0" stroke="#1C6FA8" stroke-width="3"/><circle r="14" fill="#3B2A20"/><path d="M0 -40 L5 -29 L17 -29 L8 -21 L11 -9 L0 -16 L-11 -9 L-8 -21 L-17 -29 L-5 -29Z" fill="#FFF59A" stroke="#B8860B" stroke-width="2"/></g>'}
/* 보이는 모습 속 전등·별 역할(앞에서 본 모습) */
function lampFront(x,y,s){s=s||1;let g='<g transform="translate('+f1(x)+' '+f1(y)+') scale('+s+')"><circle r="40" fill="#FFE27A" opacity=".45"/>';for(let i=0;i<10;i++){const a=i*Math.PI/5;g+='<path d="M'+f1(26*Math.cos(a))+' '+f1(26*Math.sin(a))+' L'+f1(36*Math.cos(a))+' '+f1(36*Math.sin(a))+'" stroke="#F0A020" stroke-width="4" stroke-linecap="round"/>'}
 return g+'<circle r="20" fill="#FFE27A" stroke="#D08A00" stroke-width="3"/><path d="M-6 50 V24 M6 50 V24" stroke="#5A6672" stroke-width="5"/></g>'}
function starFront(x,y,s){s=s||1;return '<g transform="translate('+f1(x)+' '+f1(y)+') scale('+s+')"><rect x="-20" y="-6" width="40" height="52" rx="12" fill="#6EC3F0" stroke="#1C6FA8" stroke-width="3"/><circle cy="-24" r="17" fill="#F1C7A1"/><path d="M0 -70 L6 -57 L20 -57 L9 -48 L13 -34 L0 -42 L-13 -34 L-9 -48 L-20 -57 L-6 -57Z" fill="#FFF59A" stroke="#B8860B" stroke-width="2"/></g>'}
/* 붙임쪽지 */
function stickyNote(x,y,t,rot){return '<g transform="translate('+f1(x)+' '+f1(y)+') rotate('+(rot||0)+')"><rect x="-46" y="-40" width="92" height="80" rx="6" fill="#FFE680" stroke="#B8860B" stroke-width="2.5"/><rect x="-46" y="-40" width="92" height="14" rx="6" fill="#F5CF4C"/>'+(t?T(0,22,t,36,'#3D2B00'):'')+'</g>'}
/* ── 실험 2: 역할놀이 ── 위에서 본 모습(왼쪽) + 지구 역할의 눈에 보이는 모습(오른쪽) */
const RP={x:240,y:290,lx:240,ly:110,sx:240,sy:470};
function roleTop(th,o){o=o||{};let g='<rect x="20" y="40" width="440" height="490" rx="18" fill="var(--w-paper)" stroke="var(--w-felt-s)" stroke-width="2"/>';
 g+=lampTop(RP.lx,RP.ly,o.lamp==null?1:o.lamp)+starKid(RP.sx,RP.sy);
 if(o.dir){const ccw=o.dir>0;g+='<path d="'+(ccw?'M168 360 A100 100 0 0 0 312 360':'M312 360 A100 100 0 0 1 168 360')+'" fill="none" stroke="#1C6FA8" stroke-width="4" stroke-dasharray="8 6"/>'+(ccw?'<path d="M312 360 l-18 2 l12 15z" fill="#1C6FA8"/>':'<path d="M168 360 l18 2 l-12 15z" fill="#1C6FA8"/>')}
 if(o.kid!==false)g+=kidTop(o.kx==null?RP.x:o.kx,o.ky==null?RP.y:o.ky,th,{notes:o.notes||['동','서']});
 return g}
function eyeView(th,o){o=o||{};const X=490,Y=150,W=440,H=270,cx=X+W/2,hw=W/2-40,id='lbEv'+(++CID);
 let g='<defs><clipPath id="'+id+'"><rect x="'+X+'" y="'+Y+'" width="'+W+'" height="'+H+'" rx="14"/></clipPath></defs><g clip-path="url(#'+id+')"><rect x="'+X+'" y="'+Y+'" width="'+W+'" height="'+H+'" fill="#EAF5FB"/><rect x="'+X+'" y="'+(Y+H-70)+'" width="'+W+'" height="70" fill="#D9C7AD"/>';
 (o.trail||[]).forEach(t=>{const rl=nrm(t[1]-t[0]);if(Math.abs(rl)<=90)g+='<circle cx="'+f1(cx+rl/90*hw)+'" cy="'+(t[1]===0?Y+100:Y+110)+'" r="8" fill="'+(t[1]===0?'#F0A020':'#1C6FA8')+'" opacity=".45"/>'});
 const rl=nrm(0-th),rs=nrm(180-th);
 if(Math.abs(rs)<=95)g+=starFront(cx+rs/90*hw,Y+130,1);
 if(Math.abs(rl)<=95)g+=lampFront(cx+rl/90*hw,Y+92,1);
 g+='</g><rect x="'+X+'" y="'+Y+'" width="'+W+'" height="'+H+'" rx="14" fill="none" stroke="#0F2E4A" stroke-width="4"/>';
 [[cx-hw,'동'],[cx,'남'],[cx+hw,'서']].forEach(([x,t])=>{g+=dirBox(x,Y+H-26,t,24)});
 g+=mini(cx-hw+22,Y+H-74,'왼손 쪽',15)+mini(cx+hw-26,Y+H-74,'오른손 쪽',15);
 return g}
/* ── 실험 3: 지구본·카메라 ── */
function globeSide(x,y,R,o){o=o||{};const id='lbGs'+(++CID);
 let g='<path d="M'+x+' '+(y+R)+' V'+(y+R+46)+'" stroke="#8A6A40" stroke-width="10"/><ellipse cx="'+x+'" cy="'+(y+R+50)+'" rx="56" ry="10" fill="#7A5A30"/>';
 g+='<defs><clipPath id="'+id+'"><circle cx="'+x+'" cy="'+y+'" r="'+R+'"/></clipPath></defs><g transform="rotate(23.5 '+x+' '+y+')"><circle cx="'+x+'" cy="'+y+'" r="'+R+'" fill="#2F7FC4" stroke="#0F3B5C" stroke-width="3"/><g clip-path="url(#'+id+')"><ellipse cx="'+(x-R*.25)+'" cy="'+(y-R*.35)+'" rx="'+R*.36+'" ry="'+R*.24+'" fill="#5CB85C"/><ellipse cx="'+(x+R*.35)+'" cy="'+(y+R*.2)+'" rx="'+R*.28+'" ry="'+R*.36+'" fill="#5CB85C"/></g><path d="M'+x+' '+(y-R-22)+' V'+(y+R+22)+'" stroke="#8A6A40" stroke-width="5"/></g>';
 if(o.cam){const cx=x-R*.55,cy=y-R*.55;g+='<g transform="translate('+f1(cx)+' '+f1(cy)+') rotate(-35)"><rect x="-15" y="-11" width="30" height="22" rx="4" fill="#222"/><circle cx="-15" r="7" fill="#555" stroke="#DDD" stroke-width="2"/></g>'}
 return g}
/* 북극 위에서 본 지구본. ph = 카메라(우리나라)의 각도(화면 오른쪽에서 시계 반대 방향), lit = 전등 켜짐 */
function globeTop(x,y,R,ph,lit,o){o=o||{};let g='<circle cx="'+x+'" cy="'+y+'" r="'+R+'" fill="'+(lit?'#1D2F52':'#34465F')+'"/>';
 if(lit)g+='<path d="M'+x+' '+(y-R)+' A'+R+' '+R+' 0 0 0 '+x+' '+(y+R)+'Z" fill="#4FA3E0"/>';
 g+='<circle cx="'+x+'" cy="'+y+'" r="'+R+'" fill="none" stroke="#0F3B5C" stroke-width="4"/><circle cx="'+x+'" cy="'+y+'" r="6" fill="#FFFFFF"/>';
 if(o.cam!==false){const r=R*.66,c=Math.cos(ph*RAD),s=Math.sin(ph*RAD),mx=x+r*c,my=y-r*s;
  g+='<path d="M'+f1(mx)+' '+f1(my)+' L'+f1(mx+(R*.34+30)*c)+' '+f1(my-(R*.34+30)*s)+'" stroke="#FF4D4D" stroke-width="5" stroke-linecap="round"/><circle cx="'+f1(mx)+'" cy="'+f1(my)+'" r="11" fill="#FF4D4D" stroke="#FFFFFF" stroke-width="3"/>'}
 return g}
/* 카메라 화면. d = 카메라 방향과 전등 방향 사이의 각(+면 동쪽 편), lit = 전등 켜짐 */
function camScreen(X,Y,W,H,d,lit){const id='lbCs'+(++CID),b=lit&&Math.abs(d)<90?Math.max(0,Math.cos(d*RAD)):0;
 const mix=(a,c,p)=>'rgb('+a.map((v,i)=>Math.round(v+(c[i]-v)*p)).join(',')+')';
 let g='<defs><clipPath id="'+id+'"><rect x="'+X+'" y="'+Y+'" width="'+W+'" height="'+H+'" rx="8"/></clipPath></defs><g clip-path="url(#'+id+')"><rect x="'+X+'" y="'+Y+'" width="'+W+'" height="'+H+'" fill="'+mix([8,12,34],[150,205,242],Math.min(1,b*1.15))+'"/>';
 if(b<.15)for(let i=0;i<18;i++)g+='<circle cx="'+f1(X+rnd(i,3)*W)+'" cy="'+f1(Y+8+rnd(i,7)*(H*.55))+'" r="'+(i%3?1.6:2.4)+'" fill="#FFFFFF" opacity="'+f1(1-b*6)+'"/>';
 if(lit&&Math.abs(d)<=96){const sx=X+W/2-d/90*(W/2-26),sy=Y+H*.5-b*H*.22;g+='<circle cx="'+f1(sx)+'" cy="'+f1(sy)+'" r="34" fill="#FFF6C0" opacity=".5"/><circle cx="'+f1(sx)+'" cy="'+f1(sy)+'" r="18" fill="#FFFBE0"/>'}
 g+='<rect x="'+X+'" y="'+(Y+H*.72)+'" width="'+W+'" height="'+H*.28+'" fill="'+mix([12,16,12],[108,150,88],Math.min(1,b*1.15))+'"/></g>';
 [[X+24,'동'],[X+W/2,'남'],[X+W-24,'서']].forEach(([x,t])=>{g+=T(x,Y+H-12,t,22,b>.35?'#0F2E4A':'#DCE4FF')});
 return g}
function phoneFrame(X,Y,W,H,inner){return '<rect x="'+(X-14)+'" y="'+(Y-14)+'" width="'+(W+28)+'" height="'+(H+28)+'" rx="18" fill="#1D232B"/>'+inner}
/* 위에서 본 실험(왼쪽) + 스마트 기기 화면(오른쪽) */
function camTop(ph,lit,o){o=o||{};let g='<rect x="10" y="40" width="560" height="460" rx="18" fill="'+(o.dim?'#1A1D24':'var(--w-paper)')+'" stroke="var(--w-felt-s)" stroke-width="2"/>';
 g+=lampTop(110,270,lit?1:0,1.1);
 if(lit)for(let i=-2;i<=2;i++)g+='<path d="M160 '+(270+i*14)+' L'+(270)+' '+(270+i*40)+'" stroke="#FFE680" stroke-opacity=".5" stroke-width="4"/>';
 g+=globeTop(400,270,130,ph,lit);
 g+='<path d="M'+(400+148)+' 270 A148 148 0 0 0 400 122" fill="none" stroke="#2E9E5B" stroke-width="5"/><path d="M400 122 l16 -9 v18z" fill="#2E9E5B"/>';
 return g}
/* ── 실험 4: 교실(원본 앱 그림을 1.1배로) ── */
const RMO={x:20,y:46,k:1.1},POS4=[[90,'가'],[180,'나'],[270,'다'],[360,'라']];
function rmP(x,y){return [RMO.x+x*RMO.k,RMO.y+y*RMO.k]}
function roomTop(o){o=o||{};let s='<g transform="translate('+RMO.x+' '+RMO.y+') scale('+RMO.k+')"><rect width="440" height="400" fill="#EFE7D8"/><rect x="20" y="20" width="400" height="360" fill="#F8F4EC" stroke="#7A6A50" stroke-width="4"/>';
 s+='<rect x="120" y="22" width="200" height="16" fill="#2F5A3A"/>'+T(220,60,'칠판',15,'#2F5A3A')+'<circle cx="345" cy="32" r="9" fill="#FFFFFF" stroke="#333333" stroke-width="2"/><rect x="74" y="24" width="28" height="14" fill="#FFFFFF" stroke="#888888"/>';
 s+='<rect x="22" y="90" width="12" height="80" fill="#9FD3F0"/><rect x="22" y="230" width="12" height="80" fill="#9FD3F0"/><circle cx="46" cy="200" r="9" fill="#5CB85C"/>'+T(40,140,'창문',14,'#1C6FA8','start')+T(58,205,'화분',14,'#2F7D4A','start');
 for(let i=0;i<6;i++)s+='<rect x="'+(80+i*34)+'" y="364" width="30" height="14" fill="#C9A46C" stroke="#7A5A30"/>';
 s+='<rect x="320" y="366" width="40" height="12" fill="#CFE6F2" stroke="#7A8C96"/>'+T(160,356,'사물함',14,'#7A5A30')+T(340,356,'거울',14,'#5A7D8C');
 s+='<rect x="406" y="100" width="12" height="60" fill="#9FD3F0"/><rect x="404" y="250" width="14" height="70" fill="#A0784A"/>'+T(400,135,'창문',14,'#1C6FA8','end')+T(398,292,'출입문',14,'#7A5A30','end');
 if(o.ring!==false)s+='<circle cx="220" cy="200" r="104" fill="none" stroke="#1C6FA8" stroke-width="2" stroke-dasharray="6 6" opacity="'+f1(o.ring==null?1:o.ring)+'"/>';
 if(o.arc){const a1=0.42,a2=1.12,P=a=>[220+104*Math.cos(a),200-104*Math.sin(a)],p1=P(a1),p2=P(a2),tg=[-Math.sin(a2),-Math.cos(a2)],nm=[Math.cos(a2),-Math.sin(a2)];
  s+='<path d="M'+f1(p1[0])+' '+f1(p1[1])+' A104 104 0 0 0 '+f1(p2[0])+' '+f1(p2[1])+'" fill="none" stroke="#1C6FA8" stroke-width="4"/><path d="M'+f1(p2[0]+tg[0]*8)+' '+f1(p2[1]+tg[1]*8)+' L'+f1(p2[0]-tg[0]*8+nm[0]*7)+' '+f1(p2[1]-tg[1]*8+nm[1]*7)+' L'+f1(p2[0]-tg[0]*8-nm[0]*7)+' '+f1(p2[1]-tg[1]*8-nm[1]*7)+'Z" fill="#1C6FA8"/>'}
 s+='<rect x="190" y="178" width="60" height="44" rx="6" fill="#C9A46C" stroke="#7A5A30" stroke-width="2"/>';
 if(o.lamp!==false){for(let i=0;i<8;i++){const a=i*Math.PI/4;s+='<path d="M'+f1(220+15*Math.cos(a))+' '+f1(200+15*Math.sin(a))+' L'+f1(220+22*Math.cos(a))+' '+f1(200+22*Math.sin(a))+'" stroke="#F0A020" stroke-width="3"/>'}
  s+='<circle cx="220" cy="200" r="12" fill="#FFE680" stroke="#D08A00" stroke-width="2"/>'}
 const pv=o.pos==null?0:o.pos;
 POS4.forEach(([a,k],i)=>{if(pv<1&&o.pos!=null)return;const x=220+104*Math.cos(a*RAD),y=200-104*Math.sin(a*RAD),done=(o.done||[]).indexOf(i)>=0;
  s+='<g opacity="'+f1(o.pos==null?1:Math.min(1,Math.max(0,o.pos*4-i)))+'"><circle cx="'+f1(x)+'" cy="'+f1(y)+'" r="25" fill="#FFFFFF" stroke="'+(done?'#16804A':'#9FB3C0')+'" stroke-width="3"/>'+T(x,y+7,k,20,'#0F3B5C')+'</g>'});
 (o.globes||[]).forEach(a=>{s+=globeAt(a,o.small)});
 if(o.at!=null)s+=globeAt(o.at,false,true);
 return s+'</g>'}
/* 교실의 지구본: a = 전등을 중심으로 한 각(수학 각도). 우리나라(관측자 모형)는 바깥쪽(한밤)을 향함 */
function globeAt(a,small,big){const x=220+104*Math.cos(a*RAD),y=200-104*Math.sin(a*RAD),ox=Math.cos(a*RAD),oy=-Math.sin(a*RAD),R=big?20:15;
 const iu=(a+180)*RAD,q=d=>[x+R*Math.cos(iu+d),y-R*Math.sin(iu+d)],q1=q(Math.PI/2),q2=q(-Math.PI/2);
 let s='<circle cx="'+f1(x)+'" cy="'+f1(y)+'" r="'+R+'" fill="#1D2F52"/><path d="M'+f1(q1[0])+' '+f1(q1[1])+' A'+R+' '+R+' 0 0 1 '+f1(q2[0])+' '+f1(q2[1])+'Z" fill="#4FA3E0"/>';
 s+='<path d="M'+f1(x-R*.6)+' '+f1(y+R*.8)+' L'+f1(x+R*.6)+' '+f1(y-R*.8)+'" stroke="#8A6A40" stroke-width="2.5"/>';
 s+='<circle cx="'+f1(x+R*.7*ox)+'" cy="'+f1(y+R*.7*oy)+'" r="5" fill="#FF4D4D" stroke="#FFFFFF" stroke-width="1.5"/><path d="M'+f1(x+(R+2)*ox)+' '+f1(y+(R+2)*oy)+' L'+f1(x+(R+24)*ox)+' '+f1(y+(R+24)*oy)+'" stroke="#FF4D4D" stroke-width="3" stroke-linecap="round"/><path d="M'+f1(x+(R+30)*ox)+' '+f1(y+(R+30)*oy)+' l'+f1(-10*ox-6*oy)+' '+f1(-10*oy+6*ox)+' l'+f1(12*oy)+' '+f1(-12*ox)+'z" fill="#FF4D4D"/>';
 return s}
/* 관측자 모형의 눈에 보이는 모습(원본 앱 그림을 1.3배로). k = 0 가 · 1 나 · 2 다 · 3 라 */
function eye4(k,X,Y){X=X==null?520:X;Y=Y==null?150:Y;let s='<g transform="translate('+X+' '+Y+') scale(1.3)"><rect width="320" height="200" rx="8" fill="#F8F4EC"/><rect y="160" width="320" height="40" fill="#D9C7AD"/>';
 if(k==null){s+='<rect width="320" height="200" rx="8" fill="#F8F4EC" stroke="#9FB3C0" stroke-width="3" stroke-dasharray="10 8"/>'+T(160,112,'?',54,'#5A7D8C')+'</g>';return s}
 if(k===0){s+='<rect x="40" y="40" width="200" height="100" fill="#2F5A3A" stroke="#7A5A30" stroke-width="5"/><circle cx="275" cy="55" r="22" fill="#FFFFFF" stroke="#333333" stroke-width="3"/><path d="M275 55 v-14 M275 55 l10 6" stroke="#333333" stroke-width="3"/><rect x="255" y="92" width="44" height="54" fill="#FFFFFF" stroke="#888888" stroke-width="2"/>';
  for(let i=0;i<4;i++)s+='<line x1="260" x2="294" y1="'+(102+i*11)+'" y2="'+(102+i*11)+'" stroke="#AAAAAA"/>';s+=T(140,97,'칠판',24,'#FFFFFF')+T(275,26,'시계',15,'#22303C')+T(277,180,'시간표',15,'#22303C')}
 if(k===1||k===3){s+='<rect x="30" y="30" width="110" height="110" fill="#BFE6FB" stroke="#7A8C96" stroke-width="5"/><line x1="85" y1="30" x2="85" y2="140" stroke="#7A8C96" stroke-width="4"/>'+T(85,92,'창문',19,'#1C5F92');
  if(k===1)s+='<path d="M200 160 l10 -40 h40 l10 40z" fill="#C96A3A"/><circle cx="215" cy="104" r="16" fill="#5CB85C"/><circle cx="240" cy="96" r="18" fill="#5CB85C"/><circle cx="252" cy="112" r="12" fill="#E2573F"/>'+T(230,190,'화분',17,'#22303C');
  else s+='<rect x="190" y="30" width="90" height="130" fill="#A0784A" stroke="#5A3A22" stroke-width="4"/><circle cx="268" cy="100" r="5" fill="#FFD23F"/>'+T(235,190,'출입문',17,'#22303C')}
 if(k===2){for(let r=0;r<2;r++)for(let c=0;c<4;c++)s+='<rect x="'+(20+c*48)+'" y="'+(60+r*50)+'" width="44" height="46" fill="#C9A46C" stroke="#7A5A30" stroke-width="2"/>';
  s+='<rect x="230" y="40" width="70" height="100" rx="6" fill="#DFF1FB" stroke="#7A8C96" stroke-width="4"/><path d="M245 60 l30 -12 M245 80 l40 -16" stroke="#FFFFFF" stroke-width="4"/>'+T(110,190,'사물함',17,'#22303C')+T(265,162,'거울',17,'#22303C')}
 s+='<rect x="6" y="6" width="128" height="28" rx="8" fill="#0F3B5C"/>'+T(70,26,POS4[k][1]+' 위치 · 한밤',16,'#FFFFFF')+'<rect width="320" height="200" rx="8" fill="none" stroke="#0F2E4A" stroke-width="3"/></g>';
 return s}
/* 지구본(옆모습)과 관측자 모형 */
function globeObs(x,y,R,o){o=o||{};let g=globeSide(x,y,R);
 if(o.at==='kr'){const px=x-R*.5,py=y-R*.62;g+='<g transform="translate('+f1(px)+' '+f1(py)+') rotate(-45)">'+obsModel(0,0,1)+'</g>'}
 if(o.at==='np'){const px=x+Math.sin(23.5*RAD)*R,py=y-Math.cos(23.5*RAD)*R;g+='<g transform="translate('+f1(px)+' '+f1(py)+') rotate(23.5)">'+obsModel(0,0,1)+'</g>'}
 if(o.at==='hand')g+=obsModel(x+R+90,y+40,1.4);
 return g}
function obsModel(x,y,s){return '<g transform="translate('+f1(x)+' '+f1(y)+') scale('+(s||1)+')"><rect x="-7" y="-30" width="14" height="22" rx="5" fill="#E2573F"/><rect x="-6" y="-9" width="5" height="10" fill="#33415C"/><rect x="1" y="-9" width="5" height="10" fill="#33415C"/><circle cy="-38" r="8" fill="#F1C7A1"/></g>'}
/* ───────── 준비물 카드 ───────── */
function itemArt(k){const A={
  compass:compassTop(0,0,44,0,{letters:false}),
  pens:[['#E2573F',-30],['#F1C40F',-10],['#27AE60',10],['#2F6DB5',30]].map(([c,x])=>'<g transform="translate('+x+' 6) rotate(8)"><rect x="-7" y="-46" width="14" height="74" rx="3" fill="'+c+'"/><path d="M-7 28 L0 44 L7 28Z" fill="#F2D8B0"/><path d="M-2.5 38 L0 44 L2.5 38Z" fill="'+c+'"/></g>').join(''),
  glasses:'<g transform="translate(0 4)"><path d="M-70 -24 H70 V22 Q46 26 30 14 Q18 4 0 4 Q-18 4 -30 14 Q-46 26 -70 22Z" fill="#F4F1EA" stroke="#5A6672" stroke-width="3"/><ellipse cx="-36" cy="-4" rx="24" ry="15" fill="#1D232B"/><ellipse cx="36" cy="-4" rx="24" ry="15" fill="#1D232B"/></g>',
  sticker:'<rect x="-62" y="-42" width="124" height="90" rx="8" fill="#FFFFFF" stroke="#9AA6B2" stroke-width="2"/>'+[[-34,-14],[0,-14],[34,-14],[-34,20],[0,20],[34,20]].map(([x,y])=>sticker(x,y,.55)).join(''),
  notes:stickyNote(-14,-6,'',-8)+stickyNote(10,8,'',6),
  pencil:'<g transform="rotate(-35)"><rect x="-8" y="-52" width="16" height="84" rx="3" fill="#F1C40F" stroke="#A88600" stroke-width="2"/><path d="M-8 32 L0 52 L8 32Z" fill="#F2D8B0"/><path d="M-3 44 L0 52 L3 44Z" fill="#33415C"/><rect x="-8" y="-58" width="16" height="10" rx="3" fill="#E58AA0"/></g>',
  bulb:'<g transform="translate(0 -14) scale(.8)">'+lampSide(0,0,0)+'</g>',
  gloves:'<g transform="translate(0 6)"><path d="M-26 40 V-6 Q-26 -14 -20 -14 V-34 Q-20 -40 -14 -40 Q-8 -40 -8 -34 V-16 V-42 Q-8 -48 -2 -48 Q4 -48 4 -42 V-16 V-38 Q4 -44 10 -44 Q16 -44 16 -38 V-12 V-26 Q16 -32 22 -32 Q28 -32 28 -26 V10 Q28 30 18 40Z" fill="#FFFFFF" stroke="#9AA6B2" stroke-width="3" stroke-linejoin="round"/><path d="M-26 30 H22" stroke="#C9D3DA" stroke-width="3"/></g>',
  globe:'<g transform="translate(0 -6) scale(.55)">'+globeSide(0,0,62)+'</g>',
  cam:'<g transform="scale(1.6)"><rect x="-22" y="-15" width="44" height="30" rx="6" fill="#222222"/><circle cx="0" cy="0" r="10" fill="#555555" stroke="#DDDDDD" stroke-width="3"/><circle cx="0" cy="0" r="4" fill="#9FD3F0"/></g>',
  dtape:'<circle r="40" fill="#F4F1EA" stroke="#9AA6B2" stroke-width="3"/><circle r="22" fill="var(--w-label)" stroke="#9AA6B2" stroke-width="3"/><path d="M38 10 H72 V24 H34Z" fill="#E86A6A"/>',
  ruler:'<g transform="rotate(-12)"><rect x="-80" y="-14" width="160" height="28" rx="3" fill="#FFE680" stroke="#B8860B" stroke-width="2"/>'+Array.from({length:17},(_,i)=>'<path d="M'+(-76+i*9.5)+' -14 V'+(i%5?-6:2)+'" stroke="#7A5A00" stroke-width="2"/>').join('')+'</g>',
  phone:'<rect x="-34" y="-50" width="68" height="100" rx="12" fill="#1D232B"/><rect x="-27" y="-42" width="54" height="80" rx="4" fill="#9FD3F0"/>',
  person:obsModel(0,30,2.4)};
 return A[k]||''}
