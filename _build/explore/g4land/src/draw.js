/* ───────── 그림: 실험대 장면 — 모두 직접 그린 SVG (땅의 변화) ───────── */
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
function gearArt(no,on,anim){const gl=no===2?(x,y,r,s)=>hand(x,y,r,s,1).replace('#FFFFFF','#F6D36B').replace('#9AA6B2','#B08A1F'):cotton;
 if(!on)return (no===1?'':coat(330,250,1.4))+(no===2?goggles(520,140,1.3):'')+'<g transform="translate('+(no===1?480:640)+' 290) scale(1.4)">'+gl(-14,-10,-60,.75)+gl(22,8,-60,.75)+'</g>'+qmark(no===1?480:480,no===1?140:90);
 let g='<g'+(anim?an('lb-a-up',0,'--from:100px'):'')+'><circle cx="480" cy="116" r="38" fill="#F2C6A0" stroke="#B9875F" stroke-width="3"/>';
 if(no===2)g+=goggles(480,108,.92);
 g+=(no===1?'<path d="M430 160 Q480 150 530 160 L560 400 H400Z" fill="#7BA6D6" stroke="#4E77A6" stroke-width="3"/>':coat(480,262,1.75))+gl(330,240,-70,1.4)+gl(630,240,-110,1.4)+'</g>';
 return g}

/* ───────── 실험 1: 운동장의 흙 언덕(옆에서 본 모습) ───────── */
const GY=430,HX0=90,HX1=880,CUPX=470,CUPT=211;
function bgField(){let g='<rect x="-3000" y="-3000" width="7000" height="'+(3000+GY)+'" fill="var(--w-sky2)"/><rect x="-3000" y="-3000" width="7000" height="3200" fill="var(--w-sky1)" opacity=".6"/>';
 g+='<rect x="-3000" y="'+GY+'" width="7000" height="3000" fill="var(--w-ground)"/><path d="M-3000 '+GY+' H4000" stroke="var(--w-ground-s)" stroke-width="3"/>';
 for(let i=0;i<46;i++)g+='<circle cx="'+(rnd(i,3)*1100-70).toFixed(0)+'" cy="'+(GY+10+rnd(i,4)*100).toFixed(0)+'" r="'+(1.5+rnd(i,5)*2.5).toFixed(1)+'" fill="var(--w-ground-s)" opacity=".55"/>';
 return g}
function hillH(x){return 196*Math.exp(-Math.pow((x-470)/185,2))}
function ero(x){return x<498?0:40*Math.exp(-Math.pow((x-575)/45,2))}
function dep(x){return 28*Math.exp(-Math.pow((x-778)/48,2))}
function hy(x,k){const t=(k||0)/3;return GY-hillH(x)+t*ero(x)-t*dep(x)}
function lineFrom(x0,x1,k,off){let p='';for(let x=x0;x<=x1;x+=4)p+=(p?' L':'M')+x+' '+(hy(x,k)+(off||0)).toFixed(1);return p}
function hillArt(k,o){o=o||{};let p='M'+HX0+' '+GY;for(let x=HX0;x<=HX1;x+=5)p+=' L'+x+' '+hy(x,k).toFixed(1);p+=' L'+HX1+' '+GY+'Z';
 let g='<path d="'+p+'" fill="var(--w-hill)" stroke="var(--w-hill-s)" stroke-width="3" stroke-linejoin="round"/>';
 for(let i=0;i<40;i++){const x=150+rnd(i,11)*700,top=hy(x,k)+10;if(top>GY-6)continue;const y=top+rnd(i,12)*(GY-6-top);g+='<ellipse cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" rx="'+(2+rnd(i,13)*3).toFixed(1)+'" ry="'+(1.5+rnd(i,14)*2).toFixed(1)+'" fill="var(--w-hill-s)" opacity=".4"/>'}
 if(o.wet)g+='<path d="'+lineFrom(500,868,k,4)+'" fill="none" stroke="var(--w-hill-s)" stroke-width="12" stroke-linecap="round" opacity=".38"/>';
 return g}
/* 종이컵(옆모습). groove: 오른쪽 위에 홈 */
function paperCup(cx,top,o){o=o||{};const L=cx-30,R=cx+30,BL=cx-23,BR=cx+23,b=top+58;
 const out=o.groove?'M'+L+' '+top+' L'+(cx+8)+' '+top+' L'+(cx+10)+' '+(top+24)+' L'+(R-2.8)+' '+(top+24)+' L'+BR+' '+b+' L'+BL+' '+b+'Z':'M'+L+' '+top+' L'+R+' '+top+' L'+BR+' '+b+' L'+BL+' '+b+'Z';
 let g='<path d="'+out+'" fill="#FFFFFF" stroke="#7F8C9A" stroke-width="2.5" stroke-linejoin="round"/>';
 if(o.water)g+='<path d="M'+(L+4)+' '+(top+25)+' L'+(R-5)+' '+(top+25)+' L'+(BR-3)+' '+(b-3)+' L'+(BL+3)+' '+(b-3)+'Z" fill="#7CC3EC" opacity=".85"/>';
 g+='<path d="M'+(L+5)+' '+(top+8)+' L'+(BL+4)+' '+(b-5)+'" stroke="#DCE3EA" stroke-width="3"/>';
 return g}
const COF=[...Array(24)].map((_,i)=>{const side=i%4===0?-1:1;const x=side<0?396+rnd(i,21)*40:506+rnd(i,22)*100;return {x,side,dx:712+rnd(i,23)*140,ord:rnd(i,24),dy:rnd(i,25)*4}});
const COFR=COF.filter(c=>c.side>0).sort((a,b)=>a.ord-b.ord);
function coffeeArt(k,anim){const frac=[0,.35,.65,.85][k||0],nm=Math.round(COFR.length*frac);let g='';
 COF.forEach(c=>{const moved=c.side>0&&COFR.indexOf(c)<nm,x=moved?c.dx:c.x,y=hy(x,k)+1+c.dy;g+='<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="4.4" fill="var(--w-cof)" stroke="var(--w-cof-s)" stroke-width="1.2"'+(anim?an('lb-a-down',.1+rnd(c.x,2)*.6,'--from:-60px'):'')+'/>'});
 return g}
function petBottle(x,y,rot,s){return '<g transform="translate('+x+' '+y+') rotate('+(rot||0)+') scale('+(s||1)+')"><path d="M-24 -50 Q-24 -66 -12 -72 V-86 H12 V-72 Q24 -66 24 -50 V64 Q24 74 14 74 H-14 Q-24 74 -24 64Z" fill="#E7F3FA" fill-opacity=".7" stroke="#6E9FB5" stroke-width="3" stroke-linejoin="round"/><path d="M-21 -10 H21 V62 Q21 70 13 70 H-13 Q-21 70 -21 62Z" fill="#7CC3EC" opacity=".8"/><rect x="-14" y="-98" width="28" height="14" rx="3" fill="#3E7CC0" stroke="#2B5C93" stroke-width="2"/><path d="M-24 4 H24 M-24 30 H24" stroke="#9CC4D8" stroke-width="2"/></g>'}
function scissors(x,y,rot,s){return '<g transform="translate('+x+' '+y+') rotate('+(rot||0)+') scale('+(s||1)+')"><path d="M0 0 L70 -10 L72 -4Z M0 0 L70 10 L72 4Z" fill="#C9D1D9" stroke="#7D8893" stroke-width="2" stroke-linejoin="round"/><circle cx="-18" cy="-12" r="12" fill="none" stroke="#D9577A" stroke-width="6"/><circle cx="-18" cy="12" r="12" fill="none" stroke="#D9577A" stroke-width="6"/><circle cx="2" cy="0" r="3" fill="#69737D"/></g>'}
function trowel(x,y,rot,s){return '<g transform="translate('+x+' '+y+') rotate('+(rot||0)+') scale('+(s||1)+')"><path d="M0 -6 L-60 -6 Q-66 0 -60 6 L0 6Z" fill="#7A5A3A" stroke="#4E3824" stroke-width="2"/><path d="M0 -4 L14 -4 L14 4 L0 4Z" fill="#9AA3AD"/><path d="M14 -20 Q70 -22 84 0 Q70 22 14 20Z" fill="#B7C0C9" stroke="#6F7A85" stroke-width="2.5" stroke-linejoin="round"/></g>'}
const REG=[[565,'위쪽',630,262],[665,'가운데',712,336],[790,'아래쪽',848,374]];
function regTags(k){return REG.map(r=>'<circle cx="'+r[0]+'" cy="'+(hy(r[0],k)-2).toFixed(1)+'" r="6" fill="var(--lb-lens)"/>'+tag(r[2],r[3],r[1],18)).join('')}
function ghost(){return '<path d="'+lineFrom(494,880,0,0)+'" fill="none" stroke="var(--w-ghost)" stroke-width="3.5" stroke-dasharray="10 7" stroke-linecap="round"/>'+tag(250,300,'점선: 처음 모습',18)}
function flowLine(k,anim){return '<path d="M'+(CUPX+20)+' '+(CUPT+24)+' Q'+(CUPX+30)+' '+(CUPT+22)+' 500 '+hy(500,k).toFixed(1)+'" stroke="#4FA3DB" stroke-width="6" fill="none" stroke-linecap="round"/><path d="'+lineFrom(500,872,k,-2)+'" fill="none" stroke="#4FA3DB" stroke-width="6" stroke-linecap="round" stroke-dasharray="26 12"'+(anim?' class="lb-a-flow"':'')+'/>'}
/* 흙 언덕 장면 한 장. o: k(물 부은 횟수) cup groove coffee ghost tags wet flow pour */
function hillScene(o){let g=bgField();if(o.cup)g+=paperCup(CUPX,CUPT,{groove:1,water:o.cupw});g+=hillArt(o.k||0,{wet:o.wet});
 if(o.coffee)g+=coffeeArt(o.k||0,o.cofAnim);if(o.ghost)g+=ghost();if(o.flow)g+=flowLine(o.k||0,o.flowAnim);
 if(o.pour)g+='<g'+(o.pourAnim?an('lb-a-slide',0,'--dx:-90px'):'')+'>'+petBottle(CUPX-62,CUPT-86,128,.95)+'</g><path d="M'+(CUPX-14)+' '+(CUPT-52)+' Q'+(CUPX-4)+' '+(CUPT-30)+' '+(CUPX-2)+' '+(CUPT+20)+'" stroke="#4FA3DB" stroke-width="7" fill="none" stroke-linecap="round" opacity=".9"/>';
 if(o.tags)g+=regTags(o.k||0);return g}
function hillSpot0(i,k){const x=REG[i][0];return [x,hy(x,k)+6,48,2.05,205,150]}

/* ───────── 실험 2: 화산 활동 모형(옆에서 본 책상) ───────── */
const HP={x:330,w:300,top:356},DISH={cx:480,y:346},KC={cx:480,b:340};
function hotplate(on){const x=HP.x,w=HP.w,t=HP.top;let g=shadow(x+w/2,418,w/2+12);
 g+='<rect x="'+x+'" y="'+t+'" width="'+w+'" height="60" rx="10" fill="#E9ECEF" stroke="#7D8893" stroke-width="3"/><rect x="'+(x+20)+'" y="'+(t-8)+'" width="'+(w-40)+'" height="12" rx="4" fill="'+(on?'#C2410C':'#3B4048')+'" stroke="#23272D" stroke-width="2"/>';
 g+='<circle cx="'+(x+w-40)+'" cy="'+(t+32)+'" r="13" fill="#59616B" stroke="#2F343A" stroke-width="2"/><path d="M'+(x+w-40)+' '+(t+32)+' L'+(x+w-40+(on?9:0))+' '+(t+32-(on?9:13))+'" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>';
 g+='<circle cx="'+(x+36)+'" cy="'+(t+32)+'" r="7" fill="'+(on?'#FF4D3D':'#7A828C')+'" stroke="#2F343A" stroke-width="1.5"/>';
 if(on)g+='<path d="M'+(x+40)+' '+(t-14)+' q8 -10 0 -20 M'+(x+w-60)+' '+(t-14)+' q8 -10 0 -20" stroke="#F08A4B" stroke-width="3" fill="none" stroke-linecap="round" opacity=".7"/>';
 return g}
function dishArt(){const c=DISH.cx,y=DISH.y;return '<path d="M'+(c-130)+' '+(y-12)+' L'+(c+130)+' '+(y-12)+' L'+(c+112)+' '+(y+4)+' L'+(c-112)+' '+(y+4)+'Z" fill="#D5DADF" stroke="#8C959F" stroke-width="2.5" stroke-linejoin="round"/><path d="M'+(c-118)+' '+(y-8)+' H'+(c+118)+'" stroke="#F2F4F6" stroke-width="2"/>'}
/* 알루미늄 쿠킹 컵. st: 'open'(위를 자름) · 'full'(원래 컵) · 'closed'(살짝 오므림) · 'shut'(꽉 막음) */
function kcup(cx,b,st,s,o){o=o||{};s=s||1;const T=(dx,dy)=>(cx+dx*s).toFixed(1)+' '+(b+dy*s).toFixed(1);let g='';
 const h=st==='full'?84:62;
 if(st==='closed'||st==='shut'){const gap=st==='shut'?0:7;g+='<path d="M'+T(-26,0)+' L'+T(-36,-44)+' L'+T(-gap,-82)+' L'+T(gap,-82)+' L'+T(36,-44)+' L'+T(26,0)+'Z" fill="#D9DEE3" stroke="#7D8893" stroke-width="'+2.5*s+'" stroke-linejoin="round"/>';
  for(let i=-3;i<=3;i++)g+='<path d="M'+T(i*8,-2)+' L'+T(i*9.5,-44)+' L'+T(i*1.6,-80)+'" stroke="#AEB6BE" stroke-width="'+1.4*s+'" fill="none"/>';
  if(o.mouth)g+='<ellipse cx="'+cx+'" cy="'+(b-82*s).toFixed(1)+'" rx="'+(gap*s+1).toFixed(1)+'" ry="'+(2.5*s).toFixed(1)+'" fill="#5B4D44"/>';
  return g}
 g+='<path d="M'+T(-26,0)+' L'+T(-36,-h)+' L'+T(36,-h)+' L'+T(26,0)+'Z" fill="#D9DEE3" stroke="#7D8893" stroke-width="'+2.5*s+'" stroke-linejoin="round"/>';
 for(let i=-3;i<=3;i++)g+='<path d="M'+T(i*8,-2)+' L'+T(i*10.5,-h+2)+'" stroke="#AEB6BE" stroke-width="'+1.4*s+'"/>';
 if(st==='full')g+='<path d="M'+T(-36,-h)+' L'+T(36,-h)+' L'+T(35,-h+10)+' L'+T(-35,-h+10)+'Z" fill="#C6CDD3" stroke="#7D8893" stroke-width="'+2*s+'"/>';
 return g}
/* 컵 속 마시멜로(위로 조금 보임). n개, tint: 색소·베이킹 소다 */
function mallows(cx,b,s,o){o=o||{};s=s||1;let g='';const P=[[-24,-60],[-8,-64],[8,-62],[24,-59],[-16,-70],[2,-73],[18,-69],[-4,-80],[12,-78]];
 P.forEach((p,i)=>{const x=cx+p[0]*s,y=b+p[1]*s;g+='<rect x="'+(x-9*s).toFixed(1)+'" y="'+(y-7*s).toFixed(1)+'" width="'+(18*s).toFixed(1)+'" height="'+(14*s).toFixed(1)+'" rx="'+(5*s).toFixed(1)+'" fill="#FFF8F0" stroke="#CBBFB2" stroke-width="'+(1.4*s).toFixed(1)+'"'+(o.anim?an('lb-a-down',.15+i*.1,'--from:-120px'):'')+'/>'});
 if(o.tint){g+='<path d="M'+(cx-26*s)+' '+(b-62*s)+' q'+(14*s)+' '+(8*s)+' '+(30*s)+' 0 q'+(12*s)+' -'+(6*s)+' '+(22*s)+' 2" stroke="#D93B33" stroke-width="'+(4*s)+'" fill="none" stroke-linecap="round" opacity=".85"/>';
  for(let i=0;i<7;i++)g+='<circle cx="'+(cx+(-22+i*7)*s).toFixed(1)+'" cy="'+(b+(-66-rnd(i,31)*10)*s).toFixed(1)+'" r="'+(2*s).toFixed(1)+'" fill="#FFFFFF" stroke="#BFB6AA" stroke-width=".8"/>'}
 return g}
function spoon(x,y,rot,s,load){return '<g transform="translate('+x+' '+y+') rotate('+(rot||0)+') scale('+(s||1)+')"><path d="M-80 -3 H-14 V3 H-80Z" fill="#B7C0C9" stroke="#6F7A85" stroke-width="1.5"/><ellipse cx="0" cy="0" rx="16" ry="9" fill="#C9D1D9" stroke="#6F7A85" stroke-width="2"/>'+(load?'<ellipse cx="0" cy="-2" rx="11" ry="5" fill="'+load+'"/>':'')+'</g>'}
/* 흘러나온 마시멜로. lv 0~3: 0 없음 · 1 입구에 조금 · 2 컵 옆으로 · 3 접시까지 / cool 식어 굳음 */
function lava(lv,cool,anim){if(!lv)return '';const c=KC.cx,b=KC.b,top=b-82,fill=cool?'#A9473C':'#E2503B',hi=cool?'#C46A5E':'#F68A6E',st=cool?'#7A2F27':'#A3301F';let g='';
 g+='<path d="M'+(c-12)+' '+(top+2)+' Q'+c+' '+(top-16)+' '+(c+12)+' '+(top+2)+'Z" fill="'+fill+'" stroke="'+st+'" stroke-width="2"'+(anim===1?an('lb-a-grow',0):'')+'/>';
 if(lv>=2)g+='<g'+(anim===2?an('lb-a-fade',0):'')+'><path d="M'+(c+6)+' '+top+' Q'+(c+30)+' '+(top+20)+' '+(c+30)+' '+(top+44)+' Q'+(c+33)+' '+(top+60)+' '+(c+28)+' '+(b-4)+' L'+(c+20)+' '+(b-6)+' Q'+(c+22)+' '+(top+40)+' '+(c+2)+' '+(top+4)+'Z" fill="'+fill+'" stroke="'+st+'" stroke-width="2"/><path d="M'+(c-6)+' '+top+' Q'+(c-26)+' '+(top+26)+' '+(c-30)+' '+(top+50)+' L'+(c-24)+' '+(top+54)+' Q'+(c-16)+' '+(top+30)+' '+(c+2)+' '+(top+6)+'Z" fill="'+fill+'" stroke="'+st+'" stroke-width="2"/></g>';
 if(lv>=3)g+='<g'+(anim===3?an('lb-a-fade',.2):'')+'><path d="M'+(c+18)+' '+(b-2)+' Q'+(c+60)+' '+(b-6)+' '+(c+86)+' '+(b-1)+' Q'+(c+92)+' '+(b+3)+' '+(c+80)+' '+(b+4)+' L'+(c+20)+' '+(b+4)+'Z" fill="'+fill+'" stroke="'+st+'" stroke-width="2"/><path d="M'+(c-30)+' '+(top+52)+' Q'+(c-36)+' '+(b-4)+' '+(c-62)+' '+(b-1)+' Q'+(c-70)+' '+(b+4)+' '+(c-54)+' '+(b+4)+' L'+(c-24)+' '+(b+3)+'Z" fill="'+fill+'" stroke="'+st+'" stroke-width="2"/></g>';
 g+='<path d="M'+(c-4)+' '+(top-6)+' q4 -3 8 0" stroke="'+hi+'" stroke-width="3" fill="none" stroke-linecap="round"/>';
 if(cool)g+='<path d="M'+(c+40)+' '+(b-2)+' l6 3 M'+(c+62)+' '+(b-2)+' l-4 4 M'+(c-46)+' '+(b-1)+' l5 3 M'+(c+26)+' '+(top+40)+' l-4 5" stroke="'+st+'" stroke-width="1.6"/>';
 return g}
function smoke(on,anim){if(!on)return '';const c=KC.cx,t=KC.b-90;let g='';for(let i=0;i<3;i++){const x=c-14+i*14;g+='<path d="M'+x+' '+t+' q-12 -18 0 -34 q12 -16 0 -34" stroke="#AEB4BB" stroke-width="'+(7-i)+'" fill="none" stroke-linecap="round" opacity=".75"'+(anim?an('lb-a-smoke',i*.35):'')+'/>'}return g}
function volScene(o){o=o||{};let g=bg({})+hotplate(o.on)+dishArt();
 if(o.cup!==false)g+=kcup(KC.cx,KC.b,o.shut?'shut':'closed',1,{mouth:1});
 g+=lava(o.lv||0,o.cool,o.lvAnim)+smoke(o.smoke,o.smokeAnim);return g}
function volSpot(t){const st=R().st;if(t==='h'){const n=st.ht||0,f=UI.fx&&/^ht/.test(UI.fx.id)?+UI.fx.id[2]:0,m=Math.max(n,f);if(m<2)return null;return m>=3?[KC.cx+36,KC.b-30,40,2,340,232]:[KC.cx,KC.b-96,40,2,340,232]}
 if(t==='c'){const n=st.cl||0;if(n<2&&!(UI.fx&&UI.fx.id==='cl2'))return null;return [KC.cx+52,KC.b-2,40,2,340,232]}return null}
/* 실제 화산 활동 그림(그린 그림) */
function realVolcano(x,y,s,hl){let g='<g transform="translate('+x+' '+y+') scale('+(s||1)+')">';
 g+='<path d="M-210 150 L-60 -40 Q-40 -56 -24 -50 L24 -50 Q40 -56 60 -40 L210 150Z" fill="#6E5E52" stroke="#3E332B" stroke-width="3" stroke-linejoin="round"/>';
 g+='<path d="M-24 -50 Q0 -36 24 -50" fill="#3E332B"/>';
 g+='<path d="M-10 -48 Q-26 0 -52 40 Q-70 80 -96 150 L-70 150 Q-48 90 -30 52 Q-12 10 6 -46Z" fill="#E2503B" stroke="#A3301F" stroke-width="2"/><path d="M12 -48 Q30 20 64 70 Q84 110 92 150 L114 150 Q100 100 80 60 Q50 10 22 -46Z" fill="#E2503B" stroke="#A3301F" stroke-width="2"/>';
 g+='<path d="M-60 -70 Q-90 -110 -50 -140 Q-40 -190 10 -180 Q50 -210 80 -170 Q130 -170 120 -120 Q150 -90 110 -66 Q60 -54 0 -64 Q-30 -56 -60 -70Z" fill="#9AA0A6" stroke="#6B7178" stroke-width="2.5" opacity=".95"/>';
 g+='<path d="M-30 -120 q10 -14 22 -4 M30 -150 q12 -10 22 2 M70 -110 q10 -12 22 0" stroke="#7D838A" stroke-width="3" fill="none"/>';
 [[-120,-90,9],[-150,-30,7],[140,-60,10],[170,0,7],[-100,-140,6],[110,-150,6]].forEach(p=>{g+='<path d="M'+(p[0]-p[2])+' '+p[1]+' L'+p[0]+' '+(p[1]-p[2])+' L'+(p[0]+p[2])+' '+(p[1]-p[2]*.3)+' L'+(p[0]+p[2]*.6)+' '+(p[1]+p[2])+' L'+(p[0]-p[2]*.7)+' '+(p[1]+p[2]*.8)+'Z" fill="#3A322C"/>'});
 for(let i=0;i<30;i++)g+='<circle cx="'+(-150+rnd(i,41)*300).toFixed(0)+'" cy="'+(-190+rnd(i,42)*120).toFixed(0)+'" r="'+(1.5+rnd(i,43)*2).toFixed(1)+'" fill="#5E646B"/>';
 g+='<g transform="translate(250 136)"><path d="M-12 14 V0 L0 -10 L12 0 V14Z" fill="#F4F1EA" stroke="#5B544A" stroke-width="2"/></g>';
 if(hl)g+='<rect x="-230" y="-230" width="510" height="400" rx="20" fill="none" stroke="var(--lb-lens)" stroke-width="6"/>';
 return g+'</g>'}

/* ───────── 실험 3: 암석 네 개(위에서 본 흰 종이) ───────── */
const RPOS={R1:[210,270],R2:[390,270],R3:[570,270],R4:[750,270]};
function rockPoly(k,cx,cy,r){const n=ROCK[k].n,pts=[];for(let i=0;i<12;i++){const a=i/12*Math.PI*2,rr=r*(.82+rnd(i+n*13,51)*.26)*(i%2?1:.97);pts.push([cx+Math.cos(a)*rr*1.12,cy+Math.sin(a)*rr*.86])}return pts}
function inPoly(x,y,P){let c=false;for(let i=0,j=P.length-1;i<P.length;j=i++){const a=P[i],b=P[j];if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])c=!c}return c}
function rockArt(k,cx,cy,r,o){o=o||{};const K=ROCK[k],P=rockPoly(k,cx,cy,r);let g='<path d="'+P2(P)+'" fill="'+K.base+'" stroke="'+K.edge+'" stroke-width="3" stroke-linejoin="round"/>';
 const seed=K.n*100;
 if(K.big){for(let i=0;i<70;i++){const x=cx-r*1.1+rnd(seed+i,61)*r*2.2,y=cy-r*.9+rnd(seed+i,62)*r*1.8;if(!inPoly(x,y,P))continue;const q=rnd(seed+i,63),c=q<.45?'#2B2A2C':q<.7?'#9A958E':K.n===3&&q<.9?'#C98F7E':'#F6F3EE',s=(2+rnd(seed+i,64)*3.4)*r/70;
  g+='<path d="M'+(x-s).toFixed(1)+' '+y.toFixed(1)+' L'+x.toFixed(1)+' '+(y-s).toFixed(1)+' L'+(x+s*.9).toFixed(1)+' '+(y-s*.2).toFixed(1)+' L'+(x+s*.3).toFixed(1)+' '+(y+s).toFixed(1)+'Z" fill="'+c+'"/>'}}
 else{for(let i=0;i<120;i++){const x=cx-r*1.1+rnd(seed+i,61)*r*2.2,y=cy-r*.9+rnd(seed+i,62)*r*1.8;if(!inPoly(x,y,P))continue;g+='<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="'+(.7*r/70).toFixed(2)+'" fill="#6E6F75"/>'}
  for(let i=0;i<K.holes;i++){const x=cx+(rnd(seed+i,71)-.5)*r*1.2,y=cy+(rnd(seed+i,72)-.5)*r*.9,s=(3+rnd(seed+i,73)*4)*r/70;g+='<ellipse cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" rx="'+s.toFixed(1)+'" ry="'+(s*.8).toFixed(1)+'" fill="#26272B" stroke="#737479" stroke-width="'+(.8*r/70).toFixed(2)+'"/>'}}
 if(o.hl)g+='<path d="'+P2(rockPoly(k,cx,cy,r+12))+'" fill="none" stroke="var(--lb-lens)" stroke-width="5" stroke-dasharray="12 8"/>';
 if(o.stk)g+='<g'+(o.stkAnim?an('lb-a-pop',.2+K.n*.15):'')+'>'+chip(cx+r*.75,cy-r*.65,K.n,17)+'</g>';
 return g}
function rockPaper(o){o=o||{};let g=bgTop()+(o.nopaper?'':'<g'+(o.paperAnim?an('lb-a-slide',0,'--dx:-900px'):'')+'><rect x="96" y="118" width="780" height="320" rx="6" fill="var(--w-shadow)"/><rect x="90" y="110" width="780" height="320" rx="6" fill="#FFFDF8" stroke="#BDB3A2" stroke-width="2"/></g>');
 ROCKK.forEach(k=>{const p=RPOS[k];g+=rockArt(k,p[0],p[1],66,{stk:o.stk,stkAnim:o.stkAnim,hl:o.hl===k})});return g}
/* 디지털 현미경 화면 속 모습: 큰 알갱이 / 작은 알갱이와 구멍 */
function microTex(k,x,y,w,h){const K=ROCK[k],seed=K.n*7;let g='<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="'+K.base+'"/>';
 if(K.big){const cs=46;for(let j=0;j*cs<h+cs;j++)for(let i=0;i*cs<w+cs;i++){const q=rnd(seed+i*31+j,81),c=q<.35?'#2E2D30':q<.6?'#A7A29A':K.n===3&&q<.85?'#D79C88':'#F3F0EA';
   const px=x+i*cs+(rnd(seed+i+j*17,82)-.5)*18,py=y+j*cs+(rnd(seed+i*5+j,83)-.5)*18;const pts=[];for(let a=0;a<6;a++){const ang=a/6*Math.PI*2+rnd(i+j+a,84),rr=cs*(.42+rnd(seed+i+j*3+a,85)*.22);pts.push([px+Math.cos(ang)*rr,py+Math.sin(ang)*rr])}
   g+='<path d="'+P2(pts)+'" fill="'+c+'" stroke="#5E5A55" stroke-width="1.2"/>'}}
 else{for(let i=0;i<520;i++){const px=x+rnd(seed+i,86)*w,py=y+rnd(seed+i,87)*h,q=rnd(seed+i,88);g+='<circle cx="'+px.toFixed(1)+'" cy="'+py.toFixed(1)+'" r="'+(1.2+rnd(seed+i,89)*1.4).toFixed(1)+'" fill="'+(q<.5?'#2F3034':q<.8?'#77787E':'#9A9BA0')+'"/>'}
  const nh=K.holes>5?5:2;for(let i=0;i<nh;i++){const px=x+w*(.18+rnd(seed+i,91)*.64),py=y+h*(.2+rnd(seed+i,92)*.6),s=14+rnd(seed+i,93)*16;g+='<ellipse cx="'+px.toFixed(1)+'" cy="'+py.toFixed(1)+'" rx="'+s.toFixed(1)+'" ry="'+(s*.8).toFixed(1)+'" fill="#1C1D20" stroke="#8A8B90" stroke-width="2.5"/><ellipse cx="'+(px-s*.25).toFixed(1)+'" cy="'+(py-s*.25).toFixed(1)+'" rx="'+(s*.45).toFixed(1)+'" ry="'+(s*.3).toFixed(1)+'" fill="#3A3B40"/>'}}
 return g}
function tablet(x,y,w,h,inner){return '<rect x="'+(x-14)+'" y="'+(y-14)+'" width="'+(w+28)+'" height="'+(h+28)+'" rx="18" fill="#2A2F37" stroke="#14171C" stroke-width="3"/>'+(inner||'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="#3B4350"/>')+'<circle cx="'+(x+w+7)+'" cy="'+(y+h/2)+'" r="3" fill="#5A6170"/>'}
function microscope(x,y,s,lit){return '<g transform="translate('+x+' '+y+') scale('+(s||1)+')"><rect x="-60" y="96" width="120" height="16" rx="5" fill="#59616B" stroke="#2F343A" stroke-width="2"/><rect x="-8" y="-40" width="14" height="140" rx="4" fill="#7D8893" stroke="#3F464E" stroke-width="2"/><path d="M6 -20 H40" stroke="#3F464E" stroke-width="8" stroke-linecap="round"/><rect x="28" y="-36" width="26" height="96" rx="12" fill="#F2F4F6" stroke="#69737D" stroke-width="2.5"/><rect x="31" y="58" width="20" height="10" rx="3" fill="#2F343A"/>'+(lit?'<circle cx="41" cy="66" r="5" fill="#9FE3B8"/>':'')+'</g>'}
function cable(x1,y1,x2,y2){return '<path d="M'+x1+' '+y1+' C'+(x1+40)+' '+(y1-80)+' '+(x2-60)+' '+(y2+80)+' '+x2+' '+y2+'" stroke="#2F343A" stroke-width="4" fill="none"/>'}
/* 현미경 장면: 왼쪽 작은 종이와 암석, 오른쪽 스마트 기기 화면 */
const MS={x:540,y:96,w:340,h:300};
function microScene(k,o){o=o||{};let g=bgTop()+'<rect x="60" y="150" width="400" height="230" rx="6" fill="#FFFDF8" stroke="#BDB3A2" stroke-width="2"/>';
 const SP={R1:[120,265],R2:[210,265],R3:[300,265],R4:[390,265]};
 ROCKK.forEach(q=>g+=rockArt(q,SP[q][0],SP[q][1],34,{stk:1,hl:q===k}));
 const p=k?SP[k]:[255,265];g+='<g'+(o.anim?an('lb-a-slide',0,'--dx:-120px'):'')+'>'+microscope(p[0]-41,p[1]-150,1,!o.off)+'</g>'+(o.off?'':cable(p[0]+10,p[1]-182,MS.x-14,MS.y+MS.h-30));
 const scr=k?'<g>'+microTex(k,MS.x,MS.y,MS.w,MS.h)+'</g>':'<rect x="'+MS.x+'" y="'+MS.y+'" width="'+MS.w+'" height="'+MS.h+'" fill="'+(o.off?'#20252C':'#DDE3E8')+'"/>'+(o.off?'':'<circle cx="'+(MS.x+MS.w/2)+'" cy="'+(MS.y+MS.h/2)+'" r="60" fill="#C9D1D9"/>');
 g+=tablet(MS.x,MS.y,MS.w,MS.h,'<svg x="'+MS.x+'" y="'+MS.y+'" width="'+MS.w+'" height="'+MS.h+'" viewBox="'+MS.x+' '+MS.y+' '+MS.w+' '+MS.h+'" overflow="hidden">'+scr+'</svg>');
 if(k)g+=mini(MS.x+MS.w/2,MS.y+MS.h+44,RN(k),20);else if(!o.noq)g+=qmark(MS.x+MS.w/2,MS.y+MS.h/2);
 return g}
/* 두 무리로 나누기 */
function sortArt(c,f){let g='';const t=c?SORTC[c].t:'';
 if(t){const w=Math.max(260,t.length*26+60);g+='<rect x="'+(480-w/2)+'" y="20" width="'+w+'" height="56" rx="14" fill="var(--w-label)" stroke="var(--lb-sci)" stroke-width="3"/><text x="480" y="57" text-anchor="middle" font-size="26" font-weight="800" fill="var(--w-labeltx)">'+t+'</text>'}else g+=qmark(480,48);
 const box=(x,lab)=>'<rect x="'+x+'" y="200" width="400" height="230" rx="16" fill="var(--w-paper)" stroke="var(--w-felt-s)" stroke-width="2.5"/><text x="'+(x+200)+'" y="236" text-anchor="middle" font-size="24" font-weight="800" fill="#141A26">'+lab+'</text>';
 g+=box(60,'그렇다')+box(500,'그렇지 않다');
 const slot={0:[0,0],1:[0,0]},top=[];ROCKK.forEach((k,i)=>{const v=f?f[i]:null;if(v===0||v===1){const n=slot[v][0]++;const x=(v?500:60)+100+n*170,y=335;g+=rockArt(k,x,y,52,{stk:1})}else top.push(k)});
 top.forEach((k,i)=>{g+=rockArt(k,480-(top.length-1)*60+i*120,140,40,{stk:1})});
 return g}

/* ───────── 준비물 카드 ───────── */
function itemArt(k){const A={
  cup:paperCup(0,-34,{}),
  scis:scissors(-30,0,-20,.9),
  soil:'<path d="M-56 30 Q-40 -26 0 -30 Q40 -26 56 30Z" fill="var(--w-hill)" stroke="var(--w-hill-s)" stroke-width="2.5"/>'+[0,1,2,3,4,5].map(i=>'<circle cx="'+(-30+i*12)+'" cy="'+(10+(i%2)*8)+'" r="2.5" fill="var(--w-hill-s)"/>').join(''),
  trowel:trowel(-10,0,-25,.85),
  cglove:cotton(-14,-10,-60,.75)+cotton(22,8,-60,.75),
  coffee:'<path d="M-36 -20 H36 L30 36 H-30Z" fill="#F4F1EA" stroke="#9C8E7E" stroke-width="2.5"/><path d="M-32 -8 H32 L28 32 H-28Z" fill="#4A2E1E"/>'+[0,1,2,3,4].map(i=>'<circle cx="'+(-20+i*10)+'" cy="'+(-12+(i%2)*3)+'" r="3" fill="#4A2E1E"/>').join(''),
  bottle:petBottle(0,6,0,.62),
  kcup:kcup(0,34,'full',.82),
  mallow:[[-24,10],[0,14],[24,10],[-12,-10],[12,-10]].map(p=>'<rect x="'+(p[0]-11)+'" y="'+(p[1]-9)+'" width="22" height="18" rx="6" fill="#FFF8F0" stroke="#CBBFB2" stroke-width="1.6"/>').join(''),
  color:'<path d="M-16 -40 H16 V-26 Q30 -20 30 -4 V34 Q30 40 24 40 H-24 Q-30 40 -30 34 V-4 Q-30 -20 -16 -26Z" fill="#E2503B" stroke="#A3301F" stroke-width="2.5"/><rect x="-22" y="0" width="44" height="22" rx="3" fill="#FFFFFF"/>',
  soda:'<rect x="-34" y="-30" width="68" height="70" rx="8" fill="#FFFFFF" stroke="#8C959F" stroke-width="2.5"/><rect x="-34" y="-30" width="68" height="16" rx="6" fill="#3E7CC0"/><path d="M-22 10 H22 M-22 22 H14" stroke="#B7C0C9" stroke-width="3"/>',
  water:'<path d="M-30 -36 V30 Q-30 40 -20 40 H20 Q30 40 30 30 V-36" fill="#EAF4FB" fill-opacity=".4" stroke="#5F8FA0" stroke-width="3"/><path d="M-28 -6 H28 V30 Q28 38 20 38 H-20 Q-28 38 -28 30Z" fill="#7CC3EC" fill-opacity=".8"/>',
  spoon:spoon(36,0,-15,1),
  dish:'<path d="M-62 -6 H62 L52 12 H-52Z" fill="#D5DADF" stroke="#8C959F" stroke-width="2.5" stroke-linejoin="round"/>',
  hot:'<rect x="-60" y="-10" width="120" height="44" rx="8" fill="#E9ECEF" stroke="#7D8893" stroke-width="2.5"/><rect x="-50" y="-18" width="100" height="10" rx="3" fill="#3B4048"/><circle cx="40" cy="12" r="8" fill="#59616B"/>',
  safety:coat(-30,4,.5)+goggles(30,-20,.55)+'<g transform="translate(34 26) scale(.55)">'+hand(0,0,-60,1,1).replace('#FFFFFF','#F6D36B').replace('#9AA6B2','#B08A1F')+'</g>',
  wpaper:'<rect x="-50" y="-36" width="100" height="74" rx="3" fill="#FFFDF8" stroke="#A39B8B" stroke-width="2"/>',
  rocks:rockArt('R1',-30,-16,20)+rockArt('R2',28,-16,20)+rockArt('R3',-30,26,20)+rockArt('R4',28,26,20),
  sticker:'<rect x="-52" y="-30" width="104" height="60" rx="5" fill="#FFFFFF" stroke="#B9C2CA" stroke-width="2"/>'+[1,2,3,4].map(i=>chip(-36+(i-1)*24,0,i,10)).join(''),
  scope:microscope(-30,-50,.62,0),
  tablet:tablet(-44,-30,88,62),
  coat:coat(0,-2,.62)};
 return A[k]||''}
