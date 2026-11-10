/* ───────── 그림: 실험 장면 — 모두 직접 그린 SVG (계절의 변화 · 태양 고도 측정기 · 손전등 · 지구본) ───────── */
const BY=436;
let NAR=false,LEG=[];   /* 좁은 화면: 작은 그림 글자는 HTML(LEG)로 */
function an(cls,delay,extra){return ' class="lb-a '+cls+'" style="animation-delay:'+(delay||0)+'s'+(extra?';'+extra:'')+'"'}
function bg(o){o=o||{};let g='<rect x="-3000" y="-3000" width="7000" height="3416" fill="var(--w-wall)"/><rect x="-3000" y="330" width="7000" height="86" fill="var(--w-wall2)"/><rect x="-3000" y="326" width="7000" height="5" fill="var(--w-rail)"/>';
 if(o.win)g+=windowArt(o.win);
 g+='<rect x="-3000" y="416" width="7000" height="36" fill="var(--w-top)"/><rect x="-3000" y="452" width="7000" height="6" fill="var(--w-edge)"/><rect x="-3000" y="458" width="7000" height="3000" fill="var(--w-front)"/>';
 for(let i=0;i<5;i++)g+='<path d="M-3000 '+(478+i*20)+' H4000" stroke="var(--w-grain)" stroke-width="1.2" opacity=".35"/>';
 if(o.win)g+='<path d="M'+(o.win-40)+' 416 L'+(o.win-150)+' 452 H'+(o.win+330)+' L'+(o.win+250)+' 416Z" fill="#FFE9A8" opacity=".35"/>';
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


/* ───────── 바깥(운동장) 장면 ───────── */
function bgOut(){let g='<rect x="-3000" y="-3000" width="7000" height="3436" fill="var(--w-skyo)"/>';
 g+='<path d="M-3000 436 L-3000 380 Q120 330 300 372 T720 360 T1200 376 L4000 380 L4000 436Z" fill="var(--w-hill)"/>';
 g+='<rect x="-3000" y="436" width="7000" height="3000" fill="var(--w-grass)"/><rect x="-3000" y="436" width="7000" height="4" fill="var(--w-grass2)"/>';
 for(let i=0;i<18;i++)g+='<path d="M'+(20+i*56)+' '+(470+(i%3)*22)+' l5 -9 l5 9" stroke="var(--w-grass2)" stroke-width="2" fill="none"/>';
 return g}
const SUNC='#FFD23F',SUNS='#E08A00',RAYC='#F0A020';
function sunArt(x,y,r){r=r||20;let g='<g transform="translate('+x.toFixed(1)+' '+y.toFixed(1)+')">';for(let i=0;i<12;i++){const a=i*Math.PI/6;g+='<line x1="'+((r+5)*Math.cos(a)).toFixed(1)+'" y1="'+((r+5)*Math.sin(a)).toFixed(1)+'" x2="'+((r+13)*Math.cos(a)).toFixed(1)+'" y2="'+((r+13)*Math.sin(a)).toFixed(1)+'" stroke="'+RAYC+'" stroke-width="3.5" stroke-linecap="round"/>'}
 return g+'<circle r="'+r+'" fill="'+SUNC+'" stroke="'+SUNS+'" stroke-width="3"/></g>'}
const RAD=Math.PI/180;
/* 반원 각도기(곧은 쪽이 아래). 안쪽 숫자는 왼쪽(그림자 쪽)이 0, 바깥쪽 숫자는 오른쪽이 0 — 1°마다 눈금 */
function protArt(cx,cy,r,o){o=o||{};let s='<path d="M'+(cx-r)+' '+cy+' A'+r+' '+r+' 0 0 1 '+(cx+r)+' '+cy+'Z" fill="#E8F6FF" fill-opacity=".92" stroke="#1C6FA8" stroke-width="2.5"/>';
 for(let a=0;a<=180;a++){const c=Math.cos(a*RAD),sn=Math.sin(a*RAD),l=a%10?(a%5?5:9):14;s+='<line x1="'+(cx+(r-l)*c).toFixed(1)+'" y1="'+(cy-(r-l)*sn).toFixed(1)+'" x2="'+(cx+r*c).toFixed(1)+'" y2="'+(cy-r*sn).toFixed(1)+'" stroke="#1C6FA8" stroke-width="'+(a%10?.9:1.6)+'"/>';
  if(!o.nolab&&a%10===0){s+='<text x="'+(cx+(r-27)*c).toFixed(1)+'" y="'+(cy-(r-27)*sn+4.5).toFixed(1)+'" text-anchor="middle" font-size="12.5" font-weight="800" fill="#0D4A7A">'+(180-a)+'</text>';
   if(a%30===0)s+='<text x="'+(cx+(r+11)*c).toFixed(1)+'" y="'+(cy-(r+11)*sn+4).toFixed(1)+'" text-anchor="middle" font-size="10" fill="#4F7FA3">'+a+'</text>'}}
 return s+'<circle cx="'+cx+'" cy="'+cy+'" r="4" fill="#FFFFFF" stroke="#1C6FA8" stroke-width="2"/>'}
function rulerArt(x0,x1,y,pxcm,o){o=o||{};let s='<rect x="'+x0+'" y="'+(y-10)+'" width="'+(x1-x0)+'" height="10" fill="#FFE27A" stroke="#B8860B" stroke-width="1.5"/>';
 for(let k=0;x0+k*pxcm<=x1;k++){const x=x0+k*pxcm;s+='<line x1="'+x.toFixed(1)+'" y1="'+(y-10)+'" x2="'+x.toFixed(1)+'" y2="'+(y-(k%5?6:2))+'" stroke="#8A6A1A" stroke-width="1"/>'}
 return s+(o.zero?'<text x="'+x0+'" y="'+(y-13)+'" text-anchor="middle" font-size="12" font-weight="800" fill="#8A6A1A">0</text>':'')}
function boardSide(x0,x1,y){return '<rect x="'+x0+'" y="'+y+'" width="'+(x1-x0)+'" height="16" fill="#FBFAF6" stroke="#9AA9B4" stroke-width="2"/>'}
function stickArt(x,y,h,anim){return '<g'+(anim?an('lb-a-down',0,'--from:-90px'):'')+'><rect x="'+(x-6)+'" y="'+(y-h)+'" width="12" height="'+h+'" rx="4" fill="#9CCC65" stroke="#4E7A1E" stroke-width="2"/></g>'}
/* 실험 1·2: 태양 고도 측정기 옆모습. o: {x0, y(자 윗면), h(막대 px), L(그림자 px), A(태양 고도), sun, align(0~1), prot(0/1), str(0/1), dot, anim} */
function meterSide(o){const x0=o.x0,y=o.y,h=o.h,A=o.A,L=o.L,tx=x0+L,r=o.r||105;let g=boardSide(x0-80,x0+420,y)+rulerArt(x0,x0+390,y,15,{zero:1});
 const top=y-10-h;
 if(o.sun){const ux=Math.cos(A*RAD),uy=Math.sin(A*RAD);
  for(let k=-2;k<=3;k++){const bx=tx+k*56,by=y-10;g+='<line x1="'+(bx-560*ux).toFixed(1)+'" y1="'+(by-560*uy).toFixed(1)+'" x2="'+(bx-40*ux).toFixed(1)+'" y2="'+(by-40*uy).toFixed(1)+'" stroke="'+RAYC+'" stroke-width="2" stroke-dasharray="9 7" opacity=".75"/>'}
  g+=sunArt(x0-150*ux,top-150*uy,22);
  g+='<g'+(o.anim==='sh'?an('lb-a-fade',0):'')+'><rect x="'+x0+'" y="'+(y-15)+'" width="'+L.toFixed(1)+'" height="6" fill="#2E3338" opacity=".7"/></g>'}
 g+=stickArt(x0,y-10,h,o.anim==='stick');
 const pcx=o.prot?tx:tx+150;
 g+='<g'+(o.anim==='prot'?an('lb-a-slide',0,'--dx:150px'):'')+'>'+protArt(pcx,y-10,r)+'</g>';
 if(o.str)g+='<path d="M'+x0+' '+top+' L'+tx.toFixed(1)+' '+(y-10)+'" stroke="#C2332C" stroke-width="2.6" fill="none"'+(o.anim==='str'?' pathLength="1" stroke-dasharray="1"'+an('lb-a-draw',0):'')+'/>';
 else g+='<path d="M'+x0+' '+top+' q22 50 6 96" stroke="#C2332C" stroke-width="2.6" fill="none"/>';
 g+='<circle cx="'+x0+'" cy="'+top+'" r="4.5" fill="#C2332C"/>';
 if(o.dot){const dx=tx-r*Math.cos(A*RAD),dy=y-10-r*Math.sin(A*RAD);g+='<circle cx="'+dx.toFixed(1)+'" cy="'+dy.toFixed(1)+'" r="4.5" fill="#C2332C" stroke="#FFFFFF" stroke-width="1.5"'+(o.anim==='str'?an('lb-a-pop',1.2):'')+'/>'}
 return g}
/* 위에서 본 모습(그림자가 자와 나란한가) */
function topInset(x,y,rot,anim){let g='<rect x="'+x+'" y="'+y+'" width="220" height="150" rx="12" fill="var(--w-label)" stroke="var(--w-felt-s)" stroke-width="2"/>';
 g+='<text x="'+(x+110)+'" y="'+(y+26)+'" text-anchor="middle" font-size="17" font-weight="800" fill="var(--w-labeltx)">위에서 본 모습</text>';
 g+='<rect x="'+(x+18)+'" y="'+(y+42)+'" width="184" height="90" fill="#FBFAF6" stroke="#9AA9B4" stroke-width="2"/><line x1="'+(x+34)+'" y1="'+(y+96)+'" x2="'+(x+194)+'" y2="'+(y+96)+'" stroke="#D6A400" stroke-width="7"/>';
 const cx=x+34,cy=y+96;g+='<g'+(anim?an('lb-a-rot',0,'--ox:'+cx+'px;--oy:'+cy+'px;--a0:-28deg;--a1:0deg'):'')+'><line x1="'+cx+'" y1="'+cy+'" x2="'+(cx+140*Math.cos(rot*RAD)).toFixed(1)+'" y2="'+(cy-140*Math.sin(rot*RAD)).toFixed(1)+'" stroke="#2E3338" stroke-width="6" opacity=".6"/></g>';
 return g+'<circle cx="'+cx+'" cy="'+cy+'" r="6" fill="#4E7A1E"/>'}
/* 실험 1: 재기 장면 */
const E1G={x0:220,y:420,h:150,r:105};
function e1Geo(i){const A=M1[i].A,L=E1G.h/Math.tan(A*RAD);return {A,L,tx:E1G.x0+L,dx:E1G.x0+L-E1G.r*Math.cos(A*RAD),dy:E1G.y-10-E1G.r*Math.sin(A*RAD)}}
function e1Scene(i,k,f){const G=e1Geo(i);let g=bgOut();
 g+=meterSide({x0:E1G.x0,y:E1G.y,h:E1G.h,A:G.A,L:G.L,r:E1G.r,sun:1,prot:k>=2||f==='c',str:k>=3||f==='p',dot:k>=3||f==='p',anim:f==='c'?'prot':f==='p'?'str':''});
 g+=topInset(700,24,k>=1||f==='a'?0:28,f==='a');
 g+=mini(150,48,M1[i].when,22);
 return g}
/* 실험 1 더 알아보기: 막대기 길이를 바꿔도(같은 때) */
function e1More(n,anim){const A=M1MORE,X0=240,Y=420,H=n*15,L=H/Math.tan(A*RAD);let g=bgOut()+boardSide(X0-80,X0+560,Y)+rulerArt(X0,X0+540,Y,15,{zero:1});
 const ux=Math.cos(A*RAD),uy=Math.sin(A*RAD);
 for(let k=-4;k<=5;k++){const bx=X0+L+k*64;g+='<line x1="'+(bx-700*ux).toFixed(1)+'" y1="'+(Y-10-700*uy).toFixed(1)+'" x2="'+bx.toFixed(1)+'" y2="'+(Y-10)+'" stroke="'+RAYC+'" stroke-width="'+(k===0?2.6:1.6)+'" stroke-dasharray="8 7" opacity="'+(k===0?.95:.55)+'"/>'}
 g+='<g'+(anim?an('lb-a-fade',0):'')+'><rect x="'+X0+'" y="'+(Y-15)+'" width="'+L.toFixed(1)+'" height="6" fill="#2E3338" opacity=".7"/>'+stickArt(X0,Y-10,H,0);
 g+='<path d="M'+X0+' '+(Y-10-H)+' L'+(X0+L).toFixed(1)+' '+(Y-10)+'" stroke="#C2332C" stroke-width="2.6"/>';
 const cx=X0+L,cy=Y-10,rr=46,a0=180-A;g+='<path d="M'+(cx+rr*Math.cos(a0*RAD)).toFixed(1)+' '+(cy-rr*Math.sin(a0*RAD)).toFixed(1)+' A'+rr+' '+rr+' 0 0 0 '+(cx-rr)+' '+cy+'" fill="none" stroke="#C2332C" stroke-width="3"/></g>';
 g+='<rect x="600" y="40" width="330" height="130" rx="14" fill="var(--w-label)" stroke="var(--w-felt-s)" stroke-width="2"/>';
 const T=(y,t)=>'<text x="765" y="'+y+'" text-anchor="middle" font-size="24" font-weight="800" fill="var(--w-labeltx)">'+t+'</text>';
 g+=T(82,'막대기 길이 '+n+' cm')+T(116,'그림자 길이 약 '+(n/Math.tan(A*RAD)).toFixed(1)+' cm')+T(150,'실과 그림자가 이루는 각 '+A+'°');
 return g}
/* 실험 1 만들기 장면(실험대) */
function buildScene(o){let g=bg({});const X=300,Y=400;
 g+='<rect x="180" y="'+Y+'" width="600" height="16" fill="#FBFAF6" stroke="#9AA9B4" stroke-width="2"/>';
 if(o.ruler)g+='<g'+(o.anim==='ruler'?an('lb-a-down',0,'--from:-120px'):'')+'>'+rulerArt(X,X+420,Y,15,{zero:1})+'</g>';
 else g+='<g transform="translate(560 250) rotate(-12)">'+rulerArt(-130,130,0,15,{})+'</g>'+tapeArt(380,300,.9);
 if(o.stick){g+=stickArt(X,Y-10,150,o.anim==='stick');if(o.anim==='stick'||o.mark)g+='<g'+(o.anim==='stick'?an('lb-a-fade',1):'')+'><path d="M'+(X+16)+' '+(Y-26)+' h14 v16" fill="none" stroke="#C2332C" stroke-width="3"/>'+mini(X-72,Y-90,'10 cm',18)+'</g>'}
 else if(o.ruler)g+='<g transform="translate(640 240) rotate(80)"><rect x="-6" y="-90" width="12" height="180" rx="4" fill="#9CCC65" stroke="#4E7A1E" stroke-width="2"/></g>'+scisArt(520,300,1);
 if(o.str)g+='<g'+(o.anim==='str'?an('lb-a-fade',0):'')+'><path d="M'+X+' '+(Y-160)+(o.prot?' Q420 '+(Y-110)+' 640 '+(Y-10):' q26 60 8 120')+'" stroke="#C2332C" stroke-width="2.6" fill="none"/><circle cx="'+X+'" cy="'+(Y-160)+'" r="5" fill="#C2332C"/></g>';
 else if(o.stick)g+='<path d="M520 300 q30 -30 60 0 t60 0" stroke="#C2332C" stroke-width="2.6" fill="none"/>';
 if(o.prot)g+='<g'+(o.anim==='prot'?an('lb-a-slide',0,'--dx:180px'):'')+'>'+protArt(640,Y-10,90,{nolab:1})+'</g>';
 else if(o.str)g+='<g transform="translate(0 -150)">'+protArt(640,Y-10,80,{nolab:1})+'</g>';
 return g}
function tapeArt(x,y,s){return '<g transform="translate('+x+' '+y+') scale('+(s||1)+')"><circle r="30" fill="#F4F1E6" stroke="#B8AE92" stroke-width="3"/><circle r="15" fill="var(--w-label)" stroke="#B8AE92" stroke-width="2.5"/><path d="M26 14 L56 22" stroke="#D9D2BE" stroke-width="10"/></g>'}
function scisArt(x,y,s){return '<g transform="translate('+x+' '+y+') scale('+(s||1)+')"><path d="M-6 -2 L40 -26 M-6 2 L40 26" stroke="#8C99A6" stroke-width="7" stroke-linecap="round"/><circle cx="-22" cy="-12" r="12" fill="none" stroke="#D2312A" stroke-width="6"/><circle cx="-22" cy="12" r="12" fill="none" stroke="#D2312A" stroke-width="6"/></g>'}

/* ───────── 실험 2: 하루 동안 재기 ───────── */
const E2G={x0:200,y:421,h:150,r:100};
function e2Dot(k){const A=ALT[k],L=SHD[k]*15,tx=E2G.x0+L;return [tx-E2G.r*Math.cos(A*RAD),E2G.y-10-E2G.r*Math.sin(A*RAD)]}
/* 하늘(남쪽을 바라본 모습)의 태양 자리 */
function skyPanel(x,y,k){let g='<rect x="'+x+'" y="'+y+'" width="380" height="96" rx="12" fill="var(--w-label)" stroke="var(--w-felt-s)" stroke-width="2"/>';
 const gy=y+70,L=x+40,Rr=x+340;g+='<line x1="'+L+'" y1="'+gy+'" x2="'+Rr+'" y2="'+gy+'" stroke="#6F9A4A" stroke-width="3"/>';
 [['동',L],['남',(L+Rr)/2],['서',Rr]].forEach(([n,xx])=>{g+='<text x="'+xx+'" y="'+(gy+21)+'" text-anchor="middle" font-size="16" font-weight="800" fill="var(--w-labeltx)">'+n+'</text>'});
 if(k>=0){const hh=9.5+k,sx=L+(hh-6.5)/12*(Rr-L),sy=gy-ALT[k]*1.05;g+=sunArt(sx,sy,9)}
 return g}
function zoomRuler(x,y,cm,showTip){const w=380,h=150;let g='<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="12" fill="var(--w-label)" stroke="var(--w-felt-s)" stroke-width="2"/>';
 g+='<text x="'+(x+16)+'" y="'+(y+28)+'" font-size="17" font-weight="800" fill="var(--w-labeltx)">자를 크게 본 모습</text>';
 const c0=cm==null?6:Math.floor(cm)-1,px=11,x0=x+30,yy=y+118;   /* 3 cm(30 mm)를 330 px로 */
 g+='<rect x="'+(x0-10)+'" y="'+(yy-46)+'" width="350" height="46" fill="#FFE27A" stroke="#B8860B" stroke-width="2"/>';
 if(cm!=null&&showTip){const tx=x0+(cm-c0)*10*px;g+='<rect x="'+(x0-10)+'" y="'+(yy-46)+'" width="'+(tx-x0+10).toFixed(1)+'" height="18" fill="#2E3338" opacity=".72"/>'}
 for(let m=0;m<=30;m++){const xx=x0+m*px,l=m%10?(m%5?10:16):24;g+='<line x1="'+xx+'" y1="'+(yy-46)+'" x2="'+xx+'" y2="'+(yy-46+l)+'" stroke="#5A4510" stroke-width="'+(m%10?1.2:2)+'"/>';
  if(m%10===0)g+='<text x="'+xx+'" y="'+(yy-6)+'" text-anchor="middle" font-size="17" font-weight="800" fill="#3B2A10">'+(c0+m/10)+'</text>'}
 if(cm!=null&&showTip){const tx=x0+(cm-c0)*10*px;g+='<path d="M'+tx.toFixed(1)+' '+(yy-74)+' V'+(yy-50)+'" stroke="#C2332C" stroke-width="3"/><text x="'+tx.toFixed(1)+'" y="'+(yy-80)+'" text-anchor="middle" font-size="15" font-weight="800" fill="#B3261E">그림자 끝</text>'}
 g+='<text x="'+(x+w-14)+'" y="'+(y+28)+'" text-anchor="end" font-size="15" fill="var(--w-labeltx)">단위: cm</text>';
 return g}
function thermPanel(x,y,t,hl){let g='<rect x="'+x+'" y="'+y+'" width="380" height="120" rx="12" fill="var(--w-label)" stroke="var(--w-felt-s)" stroke-width="2"/>';
 g+='<text x="'+(x+16)+'" y="'+(y+28)+'" font-size="17" font-weight="800" fill="var(--w-labeltx)">온도계 · 그늘진 곳 1.5 m 높이</text>';
 g+='<rect x="'+(x+100)+'" y="'+(y+42)+'" width="180" height="64" rx="10" fill="'+(t==null?'#3A4148':'#16241B')+'" stroke="#2A3138" stroke-width="3"/>';
 if(t!=null)g+='<text x="'+(x+222)+'" y="'+(y+90)+'" text-anchor="end" font-size="40" font-weight="800" font-family="ui-monospace,Menlo,Consolas,monospace" fill="'+(hl?'#FFE66B':'#8EF0B2')+'">'+esc(t)+'</text><text x="'+(x+232)+'" y="'+(y+86)+'" font-size="24" font-weight="800" fill="#8EF0B2">℃</text>';
 return g}
function e2Scene(k,o){o=o||{};let g=bgOut();const on=k>=0;
 const A=on?ALT[k]:45,L=on?SHD[k]*15:0;
 g+=meterSide({x0:E2G.x0,y:E2G.y,h:E2G.h,A,L:on?L:1,r:E2G.r,sun:on,prot:on,str:on,dot:on,anim:o.anim?'sh':''});
 g+=skyPanel(560,14,on?k:-1)+zoomRuler(560,122,on?SHD[k]:null,on)+thermPanel(560,284,on?f1(TMP[k]):null,o.hl);
 g+=mini(130,44,on?DAYT[k]:'재기 전',22);
 return g}
/* 내 기록표(실험 2) */
function dayTable(){const r=R(),x0=40,y0=120,lw=170,cw=106,rh=62;let g='<rect x="'+(x0-14)+'" y="'+(y0-50)+'" width="'+(lw+cw*7+28)+'" height="'+(rh*4+70)+'" rx="16" fill="var(--w-label)" stroke="var(--w-felt-s)" stroke-width="2"/>';
 g+='<text x="'+(x0+(lw+cw*7)/2)+'" y="'+(y0-16)+'" text-anchor="middle" font-size="22" font-weight="800" fill="var(--w-labeltx)">내 기록표</text>';
 const H=['태양 고도(°)','그림자 길이(cm)','기온(℃)'];
 for(let j=0;j<4;j++)for(let k=-1;k<7;k++){const x=k<0?x0:x0+lw+k*cw,w=k<0?lw:cw,y=y0+j*rh;
  g+='<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+rh+'" fill="'+(j===0||k<0?'#EEF2F5':'#FFFFFF')+'" stroke="#9AA3AE" stroke-width="1.6"/>';
  let t='';if(j===0)t=k<0?'측정 시각':DAYS[k];else if(k<0)t=H[j-1];else{const x2=r.rec['d'+k];t=x2&&x2.ok?x2.v[j-1]:''}
  g+='<text x="'+(x+w/2)+'" y="'+(y+rh/2+8)+'" text-anchor="middle" font-size="'+(k<0?18:22)+'" font-weight="800" fill="#141A26">'+esc(t)+'</text>'}
 return g}
/* 꺾은선그래프 셋(내가 적은 값으로) */
const GR=[{n:'태양 고도(°)',min:30,max:55,step:5,col:'#C25E00',j:0},{n:'그림자 길이(cm)',min:5,max:20,step:5,col:'#6A4FA3',j:1},{n:'기온(℃)',min:20,max:30,step:2,col:'#C2332C',j:2}];
function dayVals(j){const r=R();return DAYS.map((t,k)=>{const x=r.rec['d'+k];return x&&x.ok?+x.v[j]:null})}
function lineChart(x,y,w,h,G,vals,anim,fs){fs=fs||1;let g='<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="10" fill="#FFFFFF" stroke="#C9C3B6" stroke-width="1.5"/>';
 const px0=x+70*fs,px1=x+w-18,py0=y+30*fs,py1=y+h-30*fs,cx=k=>px0+(px1-px0)/7*(k+.5),cy=v=>py1-(v-G.min)/(G.max-G.min)*(py1-py0);
 for(let v=G.min;v<=G.max+1e-9;v+=G.step){const yy=cy(v);g+='<line x1="'+px0+'" x2="'+px1+'" y1="'+yy.toFixed(1)+'" y2="'+yy.toFixed(1)+'" stroke="#E3E8EC" stroke-width="1.2"/><text x="'+(px0-8)+'" y="'+(yy+5).toFixed(1)+'" text-anchor="end" font-size="'+(14*fs)+'" fill="#3B4A5A">'+v+'</text>'}
 DAYS.forEach((t,k)=>{g+='<text x="'+cx(k).toFixed(1)+'" y="'+(py1+20*fs).toFixed(1)+'" text-anchor="middle" font-size="'+(13*fs)+'" fill="#3B4A5A">'+t+'</text>'});
 g+='<line x1="'+px0+'" x2="'+px0+'" y1="'+py0+'" y2="'+py1+'" stroke="#3B4A5A" stroke-width="2"/><line x1="'+px0+'" x2="'+px1+'" y1="'+py1+'" y2="'+py1+'" stroke="#3B4A5A" stroke-width="2"/>';
 g+='<text x="'+(x+12)+'" y="'+(y+20*fs)+'" font-size="'+(15*fs)+'" font-weight="800" fill="'+G.col+'">'+G.n+'</text>';
 let d='';vals.forEach((v,k)=>{if(v==null)return;d+=(d?' L':'M')+cx(k).toFixed(1)+' '+cy(v).toFixed(1)});
 if(d)g+='<path d="'+d+'" fill="none" stroke="'+G.col+'" stroke-width="'+(3.5*fs)+'"'+(anim?' pathLength="1" stroke-dasharray="1"'+an('lb-a-draw',0):'')+'/>';
 vals.forEach((v,k)=>{if(v!=null)g+='<circle cx="'+cx(k).toFixed(1)+'" cy="'+cy(v).toFixed(1)+'" r="'+(5*fs)+'" fill="'+G.col+'" stroke="#FFFFFF" stroke-width="1.5"/>'});
 return g}
function graphScene(anim){let g='<rect x="-3000" y="-3000" width="7000" height="7000" fill="var(--w-wall)"/>';
 GR.forEach((G,i)=>{g+=lineChart(60,20+i*172,840,160,G,dayVals(G.j),anim)});return g}

/* ───────── 실험 3: 손전등과 스마트 기기 ───────── */
const E3G={sx:450,sy:404,D:300,h:60};
function phoneArt(x0,x1,y){return '<rect x="'+x0+'" y="'+(y-12)+'" width="'+(x1-x0)+'" height="12" rx="4" fill="#2A3138" stroke="#151A1F" stroke-width="2"/><circle cx="'+E3G.sx+'" cy="'+(y-12)+'" r="4" fill="#8FB3C9"/>'}
function torchArt(x,y,a,on){/* (x,y) = 빛이 나오는 곳, a = 바닥과 이루는 각 */const ux=Math.cos(a*RAD),uy=Math.sin(a*RAD);
 return '<g transform="translate('+x.toFixed(1)+' '+y.toFixed(1)+') rotate('+(a).toFixed(1)+')"><rect x="-96" y="-15" width="80" height="30" rx="8" fill="#5B6573" stroke="#2F3640" stroke-width="2"/><path d="M-18 -15 L4 -24 V24 L-18 15Z" fill="#7C8794" stroke="#2F3640" stroke-width="2"/><rect x="2" y="-22" width="6" height="44" rx="2" fill="'+(on?'#FFF3B0':'#C9D1D9')+'"/><rect x="-74" y="-6" width="16" height="12" rx="3" fill="#2F3640"/></g>'}
/* a: 손전등과 스마트 기기가 이루는 각(빛을 켜면), stick: 막대, num: 화면 숫자(문자열) */
function e3Scene(o){o=o||{};let g=bg({});const sx=E3G.sx,sy=E3G.sy,a=o.a;
 g+=phoneArt(360,660,416);
 if(o.stick)g+='<g'+(o.anim==='stick'?an('lb-a-down',0,'--from:-90px'):'')+'><rect x="'+(sx+22)+'" y="'+(sy-E3G.h)+'" width="8" height="'+E3G.h+'" fill="#C2C9D1" stroke="#6B7580" stroke-width="1.5"/><path d="M'+(sx+14)+' '+sy+' q12 -12 24 0z" fill="#E36F8E" stroke="#9E3A57" stroke-width="1.5"/></g>';
 if(a){const ux=Math.cos(a*RAD),uy=Math.sin(a*RAD),tx=sx-E3G.D*ux,ty=sy-E3G.D*uy,px=-uy,py=ux,w=38;
  g+='<g'+(o.anim==='on'?an('lb-a-fade',0):'')+'><path d="M'+(tx+px*14).toFixed(1)+' '+(ty+py*14).toFixed(1)+' L'+(sx+w/Math.sin(a*RAD)).toFixed(1)+' '+sy+' L'+(sx-w/Math.sin(a*RAD)).toFixed(1)+' '+sy+' L'+(tx-px*14).toFixed(1)+' '+(ty-py*14).toFixed(1)+'Z" fill="#FFE680" opacity=".45"/>';
  if(o.stick){const L=E3G.h/Math.tan(a*RAD);g+='<rect x="'+(sx+30)+'" y="'+(sy-4)+'" width="'+L.toFixed(1)+'" height="4" fill="#111" opacity=".8"/>'}
  const rr=70;g+='<path d="M'+(sx-rr)+' '+sy+' A'+rr+' '+rr+' 0 0 1 '+(sx-rr*ux).toFixed(1)+' '+(sy-rr*uy).toFixed(1)+'" fill="none" stroke="#C2332C" stroke-width="3"/>';
  g+='<text x="'+(sx-rr-14-(a>60?0:6)).toFixed(1)+'" y="'+(sy-18)+'" text-anchor="end" font-size="22" font-weight="800" fill="#B3261E">'+a+'°</text>';
  g+='<path d="M'+(tx-px*40).toFixed(1)+' '+(ty-py*40).toFixed(1)+' L'+(sx-px*40).toFixed(1)+' '+(sy-py*40).toFixed(1)+'" stroke="var(--w-labeltx)" stroke-width="2" stroke-dasharray="6 6" opacity=".7"/>';
  g+=mini((tx+sx)/2-px*72,(ty+sy)/2-py*72,'약 20 cm',18)+'</g>'+torchArt(tx,ty,a,1)}
 else if(o.torch)g+=torchArt(250,380,0,0);
 /* 화면 */
 g+='<rect x="660" y="36" width="270" height="190" rx="22" fill="#2A3138" stroke="#151A1F" stroke-width="3"/><rect x="674" y="52" width="242" height="158" rx="12" fill="'+(o.num==null?'#3A4148':'#F4F8FB')+'"/>';
 if(o.num!=null){g+='<text x="795" y="84" text-anchor="middle" font-size="18" font-weight="800" fill="#2A3342">빛의 세기</text><text x="795" y="160" text-anchor="middle" font-size="54" font-weight="800" font-family="ui-monospace,Menlo,Consolas,monospace" fill="'+(o.hl?'#B3261E':'#141A26')+'">'+esc(o.num)+'</text>'}
 return g}
function e3Two(){const r=R();let g=bg({});const P=(x,a,num,cap)=>{const L=40/Math.tan(a*RAD);let s='<g transform="translate('+x+' 0)"><rect x="0" y="40" width="420" height="330" rx="16" fill="var(--w-label)" stroke="var(--w-felt-s)" stroke-width="2"/>';
  s+='<text x="210" y="74" text-anchor="middle" font-size="22" font-weight="800" fill="var(--w-labeltx)">'+cap+'</text><rect x="60" y="300" width="300" height="10" rx="3" fill="#2A3138"/>';
  const sx=150,sy=300,ux=Math.cos(a*RAD),uy=Math.sin(a*RAD);s+='<path d="M'+(sx-200*ux).toFixed(1)+' '+(sy-200*uy).toFixed(1)+' L'+sx+' '+sy+'" stroke="'+RAYC+'" stroke-width="5" stroke-dasharray="10 7"/>';
  s+='<rect x="'+(sx+14)+'" y="'+(sy-40)+'" width="6" height="40" fill="#8C96A1"/><rect x="'+(sx+20)+'" y="'+(sy-3)+'" width="'+L.toFixed(1)+'" height="3" fill="#111"/>';
  s+='<text x="'+(sx-50)+'" y="'+(sy-10)+'" text-anchor="end" font-size="20" font-weight="800" fill="#B3261E">'+a+'°</text>';
  s+='<text x="210" y="352" text-anchor="middle" font-size="26" font-weight="800" fill="var(--w-labeltx)">화면 숫자 '+esc(num||'?')+'</text></g>';return s};
 const xS=r.rec.lS,xL=r.rec.lL;
 return g+P(40,LANG.S,xS&&xS.ok?xS.v:null,'그림자가 짧을 때')+P(500,LANG.L,xL&&xL.ok?xL.v:null,'그림자가 길 때')}
/* 더 알아보기: 같은 빛, 다른 넓이 */
function raysScene(a,anim){let g='<rect x="-3000" y="-3000" width="7000" height="7000" fill="var(--w-skyo)"/><rect x="-3000" y="420" width="7000" height="3000" fill="#C9B08A"/>';
 const BX=480,Y=420,N=10,W=150,box=150,ux=Math.cos(a*RAD),uy=Math.sin(a*RAD),foot=W/uy;let n=0;
 g+='<rect x="'+(BX-box/2)+'" y="'+Y+'" width="'+box+'" height="22" fill="#FFD23F" stroke="#B8860B" stroke-width="2"/>';
 let ls='';for(let k=0;k<N;k++){const hx=BX-foot/2+foot*(k+.5)/N,ins=Math.abs(hx-BX)<=box/2;if(ins)n++;ls+='<line x1="'+(hx-420*ux).toFixed(1)+'" y1="'+(Y-420*uy).toFixed(1)+'" x2="'+hx.toFixed(1)+'" y2="'+Y+'" stroke="'+(ins?'#E08A00':'#F2C877')+'" stroke-width="'+(ins?3.5:2)+'"/>'}
 g+='<g'+(anim?an('lb-a-fade',0):'')+'>'+ls+'</g>';
 g+='<rect x="620" y="40" width="310" height="120" rx="14" fill="var(--w-label)" stroke="var(--w-felt-s)" stroke-width="2"/>';
 g+='<text x="775" y="86" text-anchor="middle" font-size="24" font-weight="800" fill="var(--w-labeltx)">태양 고도 '+a+'°</text><text x="775" y="128" text-anchor="middle" font-size="22" font-weight="800" fill="var(--w-labeltx)">노란 칸에 닿는 빛줄기 '+n+'개</text>';
 return g+mini(BX,Y+56,'일정한 면적',18)}

/* ───────── 실험 4: 전등과 지구본 ───────── */
const E4G={lx:220,ly:280,gx:520,gy:280,R:92,K:14};   /* 30 cm = 300 px · 그림 속 그림자 1 cm = 14 px */
const LAT=37.5,TILT=47/2;   /* 그림 속 자전축 기울기(화면에는 숫자를 쓰지 않음) */
function lampArt(x,y,glow){return '<g><rect x="'+(x-8)+'" y="'+(y+30)+'" width="16" height="'+(416-y-30)+'" fill="#8A8F96"/><rect x="'+(x-46)+'" y="408" width="92" height="10" rx="4" fill="#6E747B"/>'+(glow?'<circle cx="'+x+'" cy="'+y+'" r="54" fill="#FFE680" opacity=".35"/>':'')+'<circle cx="'+x+'" cy="'+y+'" r="30" fill="#FFE27A" stroke="#D08A00" stroke-width="3"/><rect x="'+(x-11)+'" y="'+(y+26)+'" width="22" height="10" fill="#9AA3AE"/></g>'}
/* 지구본 옆모습: tau = 북극이 전등(왼쪽) 쪽으로 기운 각(+), 반대(−). sh = 그림자 길이(cm), meter = 측정기 */
function globeSide(cx,cy,R,tau,o){o=o||{};let g='<path d="M'+(cx-R-14)+' '+cy+' A'+(R+14)+' '+(R+14)+' 0 0 0 '+(cx+R+14)+' '+cy+'" fill="none" stroke="#8A8F96" stroke-width="5"/><rect x="'+(cx-6)+'" y="'+(cy+R+12)+'" width="12" height="'+(416-cy-R-20)+'" fill="#8A8F96"/><rect x="'+(cx-50)+'" y="408" width="100" height="10" rx="4" fill="#6E747B"/>';
 const gg='<circle r="'+R+'" fill="#3F86C8" stroke="#1E4E7A" stroke-width="3"/><path d="M-30 -60 q24 -10 40 6 q10 18 -8 30 q-26 4 -32 -36z M-58 10 q20 -6 26 16 q-4 26 -24 22 q-12 -18 -2 -38z M24 20 q26 -8 40 10 q-6 28 -30 30 q-18 -20 -10 -40z" fill="#7DBE6A" opacity=".85"/><path d="M-'+R+' 0 A'+R+' 26 0 0 0 '+R+' 0" fill="none" stroke="#FFFFFF" stroke-width="1.6" opacity=".7"/><line x1="0" y1="'+(-R-26)+'" x2="0" y2="'+(R+26)+'" stroke="#2A3138" stroke-width="3.5"/><circle cy="'+(-R-26)+'" r="4" fill="#2A3138"/>';
 g+='<g'+(o.anim==='tilt'?an('lb-a-rot',0,'--ox:'+cx+'px;--oy:'+cy+'px;--a0:0deg;--a1:'+(-tau)+'deg'):'')+' transform="rotate('+(-tau)+' '+cx+' '+cy+')"><g transform="translate('+cx+' '+cy+')">'+gg+'</g></g>';
 if(o.meter){const th=(LAT-tau)*RAD,px=cx-R*Math.cos(th),py=cy-R*Math.sin(th),nx=-Math.cos(th),ny=-Math.sin(th),tX=Math.sin(th),tY=-Math.cos(th);
  g+='<g'+(o.anim==='meter'?an('lb-a-pop',0):'')+'><ellipse cx="'+px.toFixed(1)+'" cy="'+py.toFixed(1)+'" rx="15" ry="5" transform="rotate('+(Math.atan2(tY,tX)/RAD).toFixed(1)+' '+px.toFixed(1)+' '+py.toFixed(1)+')" fill="#FFFFFF" stroke="#B9AE98" stroke-width="2"/><line x1="'+px.toFixed(1)+'" y1="'+py.toFixed(1)+'" x2="'+(px+nx*16).toFixed(1)+'" y2="'+(py+ny*16).toFixed(1)+'" stroke="#C2332C" stroke-width="3"/>';
  if(o.sh!=null){const L=o.sh*E4G.K;g+='<line x1="'+px.toFixed(1)+'" y1="'+py.toFixed(1)+'" x2="'+(px+tX*L).toFixed(1)+'" y2="'+(py+tY*L).toFixed(1)+'" stroke="#111" stroke-width="5" stroke-linecap="round" opacity=".85"/>'}
  g+='</g>'}
 return g}
/* 측정기를 크게 본 모습: 막대 그림자와 자 */
function meterZoom(x,y,sh){const w=280,h=190,K=60,x0=x+34,yy=y+128;let g='<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="12" fill="var(--w-label)" stroke="var(--w-felt-s)" stroke-width="2"/>';
 g+='<text x="'+(x+14)+'" y="'+(y+26)+'" font-size="16" font-weight="800" fill="var(--w-labeltx)">측정기와 자를 크게 본 모습</text>';
 g+='<rect x="'+(x0-14)+'" y="'+(y+44)+'" width="'+(w-40)+'" height="56" rx="8" fill="#FFFFFF" stroke="#B9AE98" stroke-width="2"/><circle cx="'+x0+'" cy="'+(y+72)+'" r="6" fill="#C2332C"/>';
 if(sh!=null)g+='<line x1="'+x0+'" y1="'+(y+72)+'" x2="'+(x0+sh*K).toFixed(1)+'" y2="'+(y+72)+'" stroke="#111" stroke-width="7" stroke-linecap="butt" opacity=".85"/><path d="M'+(x0+sh*K).toFixed(1)+' '+(y+82)+' V'+(yy-34)+'" stroke="#C2332C" stroke-width="2" stroke-dasharray="4 3"/>';
 g+='<rect x="'+(x0-10)+'" y="'+(yy-30)+'" width="'+(w-48)+'" height="34" fill="#FFE27A" stroke="#B8860B" stroke-width="2"/>';
 for(let m=0;m<=37;m++){const xx=x0+m*K/10,l=m%10?(m%5?8:13):19;g+='<line x1="'+xx.toFixed(1)+'" y1="'+(yy-30)+'" x2="'+xx.toFixed(1)+'" y2="'+(yy-30+l)+'" stroke="#5A4510" stroke-width="'+(m%10?1:1.8)+'"/>';
  if(m%10===0)g+='<text x="'+xx.toFixed(1)+'" y="'+(yy+24)+'" text-anchor="middle" font-size="16" font-weight="800" fill="var(--w-labeltx)">'+(m/10)+'</text>'}
 return g+'<text x="'+(x+w-12)+'" y="'+(y+h-8)+'" text-anchor="end" font-size="14" fill="var(--w-labeltx)">단위: cm</text>'}
/* 위에서 본 모습: 전등 둘레를 시계 반대 방향으로 공전(가 위 · 나 왼쪽 · 다 아래 · 라 오른쪽) */
const POSA=[90,180,270,0];
function orbitInset(x,y,k,tilted,anim,prevK){const cx=x+120,cy=y+112,Ro=70;let g='<rect x="'+x+'" y="'+y+'" width="240" height="210" rx="14" fill="#14223F" stroke="#0A1322" stroke-width="2"/>';
 g+='<text x="'+cx+'" y="'+(y+24)+'" text-anchor="middle" font-size="15" font-weight="800" fill="#E9EEF6">위에서 본 모습</text>';
 g+='<circle cx="'+cx+'" cy="'+cy+'" r="'+Ro+'" fill="none" stroke="#8FA3C0" stroke-width="2" stroke-dasharray="6 6"/><circle cx="'+cx+'" cy="'+cy+'" r="16" fill="#FFE27A" stroke="#D08A00" stroke-width="2"/>';
 g+='<path d="M'+(cx-Ro*Math.cos(35*RAD)-10).toFixed(1)+' '+(cy-Ro*Math.sin(35*RAD)-14).toFixed(1)+' l-12 4 l2 -12" fill="none" stroke="#FFE680" stroke-width="2.5"/>';
 POSA.forEach((d,i)=>{const lx=cx+(Ro+24)*Math.cos(d*RAD),ly=cy-(Ro+24)*Math.sin(d*RAD);g+='<text x="'+lx.toFixed(1)+'" y="'+(ly+6).toFixed(1)+'" text-anchor="middle" font-size="16" font-weight="800" fill="'+(i===k?'#FFE680':'#C8D3E6')+'">'+POS[i]+'</text>'});
 if(k>=0){const d=POSA[k],ex=cx+Ro*Math.cos(d*RAD),ey=cy-Ro*Math.sin(d*RAD);
  let e='<circle cx="'+ex.toFixed(1)+'" cy="'+ey.toFixed(1)+'" r="13" fill="#3F86C8" stroke="#FFFFFF" stroke-width="2"/>'+(tilted?'<path d="M'+ex.toFixed(1)+' '+ey.toFixed(1)+' h22" stroke="#FFD23F" stroke-width="3.5"/><path d="M'+(ex+26).toFixed(1)+' '+ey.toFixed(1)+' l-8 -5 v10z" fill="#FFD23F"/>':'<circle cx="'+ex.toFixed(1)+'" cy="'+ey.toFixed(1)+'" r="3" fill="#FFD23F"/>');
  if(anim&&prevK!=null&&prevK>=0){const a0=POSA[k]-POSA[prevK];e='<g'+an('lb-a-rot',0,'--ox:'+cx+'px;--oy:'+cy+'px;--a0:'+((a0+360)%360)+'deg;--a1:0deg')+'>'+e+'</g>'}
  g+=e}
 return g}
function tauOf(k,tilted){return !tilted?0:k===1?TILT:k===3?-TILT:0}
function e4Scene(o){o=o||{};let g=bg({});const G=E4G;
 if(o.ruler)g+='<g'+(o.anim==='place'?an('lb-a-fade',0):'')+'><rect x="'+G.lx+'" y="398" width="'+(G.gx-G.lx)+'" height="12" fill="#FFE27A" stroke="#B8860B" stroke-width="1.5"/>'+mini((G.lx+G.gx)/2,384,'30 cm',18)+'</g>';
 const ly=o.lampLow?G.ly+60:G.ly;
 g+='<g'+(o.anim==='height'?an('lb-a-raise',0,'--from:60px'):'')+'>'+lampArt(G.lx,ly,o.light)+'</g>';
 if(o.light)for(let j=-2;j<=2;j++)g+='<line x1="'+(G.lx+40)+'" x2="'+(G.gx-G.R-8)+'" y1="'+(ly+j*30)+'" y2="'+(ly+j*30)+'" stroke="'+RAYC+'" stroke-width="2" stroke-dasharray="8 7" opacity=".6"/>';
 if(o.level)g+='<path d="M'+(G.lx+34)+' '+G.gy+' H'+(G.gx-G.R-6)+'" stroke="#C2332C" stroke-width="2.5" stroke-dasharray="7 6"/>';
 g+=globeSide(G.gx,G.gy,G.R,o.tau||0,{meter:o.meter,sh:o.sh,anim:o.anim});
 if(o.note)g+=tag(G.gx,G.gy-G.R-50,o.note,17);
 return g}
function e4Spot(){const r=R(),s=curStep(),key=s.id==='vert'?'vc':'tc',c=r.st[key]||0;if(!c||fid())return null;return [702+SHk()*60,150,26,2.2,808,360]}
function SHk(){const r=R(),s=curStep(),t=s.id==='tiltm',c=r.st[t?'tc':'vc']||0;return (t?SHT:SHV)[Math.max(0,c-1)]}
function e4Meas(t){const r=R(),key=t?'tc':'vc',c=r.st[key]||0,f=fid(),ids=['p0','p1','p2','p3'],fi=ids.indexOf(f);
 const k=fi>=0?fi:c-1,shown=fi<0&&c>0;let g=e4Scene({light:1,ruler:1,meter:1,tau:tauOf(Math.max(k,0),t),sh:shown?(t?SHT:SHV)[k]:null,note:t&&shown&&(k===0||k===2)?'자전축이 앞뒤로 기울어 있어요':''});
 g+=orbitInset(16,14,k,t,fi>=0,fi>0?fi-1:null);
 if(fi>=0)g+=mini(520,440,POS[k]+' 위치로 공전시키는 중',20);
 g+=meterZoom(668,40,shown?(t?SHT:SHV)[k]:null);
 return g}
/* 내 기록표(실험 4) */
function shTable(){const r=R(),x0=150,y0=170,lw=230,cw=110,rh=64;let g='<rect x="'+(x0-14)+'" y="'+(y0-54)+'" width="'+(lw+cw*4+28)+'" height="'+(rh*3+80)+'" rx="16" fill="var(--w-label)" stroke="var(--w-felt-s)" stroke-width="2"/>';
 g+='<text x="'+(x0+(lw+cw*4)/2)+'" y="'+(y0-20)+'" text-anchor="middle" font-size="22" font-weight="800" fill="var(--w-labeltx)">내 기록표 · 그림자 길이(cm)</text>';
 for(let j=0;j<3;j++)for(let k=-1;k<4;k++){const x=k<0?x0:x0+lw+k*cw,w=k<0?lw:cw,y=y0+j*rh;
  g+='<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+rh+'" fill="'+(j===0||k<0?'#EEF2F5':'#FFFFFF')+'" stroke="#9AA3AE" stroke-width="1.6"/>';
  let t='';if(j===0)t=k<0?'위치':POS[k];else if(k<0)t=j===1?'자전축이 수직일 때':'자전축을 기울였을 때';else{const x2=r.rec[(j===1?'v':'t')+k];t=x2&&x2.ok?x2.v:''}
  g+='<text x="'+(x+w/2)+'" y="'+(y+rh/2+8)+'" text-anchor="middle" font-size="'+(k<0&&j>0?19:24)+'" font-weight="800" fill="#141A26">'+esc(t)+'</text>'}
 return g}

/* ───────── 준비물 카드 ───────── */
function itemArt(k){const A={
  wood:'<rect x="-70" y="-20" width="140" height="40" fill="#FBFAF6" stroke="#9AA9B4" stroke-width="2.5"/><path d="M-70 -20 l18 -14 h140 l-18 14" fill="#F1EFE8" stroke="#9AA9B4" stroke-width="2"/>',
  ruler:'<g transform="rotate(-10)">'+rulerArt(-75,75,10,15,{})+'</g>',
  stick:'<rect x="-6" y="-50" width="12" height="100" rx="4" fill="#9CCC65" stroke="#4E7A1E" stroke-width="2" transform="rotate(30)"/>',
  string:'<path d="M-50 10 q20 -40 40 0 t40 0 t30 -10" stroke="#C2332C" stroke-width="3" fill="none"/>',
  prot:protArt(0,30,62,{nolab:1}),
  tape:tapeArt(-8,0,1.1),
  scis:scisArt(-6,0,1.1),
  pin:'<line x1="-40" y1="20" x2="34" y2="-18" stroke="#8C99A6" stroke-width="3"/><circle cx="38" cy="-20" r="8" fill="#E25B45" stroke="#9E3426" stroke-width="2"/>',
  meter:'<g transform="translate(-40 34) scale(.42)">'+boardSide(-40,220,0)+rulerArt(0,200,0,15,{})+stickArt(0,-10,130,0)+protArt(150,-10,60,{nolab:1})+'<path d="M0 -140 L150 -10" stroke="#C2332C" stroke-width="4"/></g>',
  thermo:'<rect x="-50" y="-30" width="100" height="56" rx="10" fill="#16241B" stroke="#2A3138" stroke-width="3"/><text x="0" y="10" text-anchor="middle" font-size="26" font-weight="800" font-family="ui-monospace,Menlo,Consolas,monospace" fill="#8EF0B2">℃</text>',
  phone:'<rect x="-32" y="-52" width="64" height="104" rx="10" fill="#2A3138" stroke="#151A1F" stroke-width="2"/><rect x="-26" y="-42" width="52" height="80" rx="5" fill="#F4F8FB"/><circle cx="16" cy="-46" r="3" fill="#8FB3C9"/>',
  sucker:'<rect x="-4" y="-50" width="8" height="80" fill="#C2C9D1" stroke="#6B7580" stroke-width="1.5"/><path d="M-16 34 q16 -18 32 0z" fill="#E36F8E" stroke="#9E3A57" stroke-width="1.5"/>',
  torch:'<g transform="translate(40 0)">'+torchArt(0,0,0,0)+'</g>',
  globe:'<g transform="scale(.48) translate(0 -20)">'+'<circle r="80" fill="#3F86C8" stroke="#1E4E7A" stroke-width="4"/><line x1="0" y1="-104" x2="0" y2="104" stroke="#2A3138" stroke-width="5" transform="rotate(-20)"/><path d="M-94 0 A94 94 0 0 0 94 0" fill="none" stroke="#8A8F96" stroke-width="7"/></g>',
  rmeter:'<circle r="40" fill="#FFFFFF" stroke="#B9AE98" stroke-width="3"/><circle r="26" fill="none" stroke="#C9C3B6" stroke-width="1.5"/><circle r="5" fill="#C2332C"/>',
  lamp:'<g transform="scale(.7) translate(0 -260)">'+lampArt(0,250,0)+'</g>',
  glove:'<path d="M-30 40 V-6 q0 -10 9 -10 q9 0 9 10 V-30 q0 -10 9 -10 q9 0 9 10 V-34 q0 -10 9 -10 q9 0 9 10 V-26 q0 -10 9 -10 q9 0 9 10 V10 q0 30 -30 30z" fill="#FAF7F0" stroke="#B9AE98" stroke-width="2.5"/>'};
 return A[k]||''}
