/* ───────── 그림: 실험대 장면 — 모두 직접 그린 SVG (여러 가지 기체) ───────── */
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
function clockArt(x,y,t,s){s=s||1;return '<g transform="translate('+x+' '+y+') scale('+s+')"><circle r="34" fill="#FFFFFF" stroke="#2A3342" stroke-width="5"/><path d="M0 0 V-22 M0 0 L15 8" stroke="#2A3342" stroke-width="4" stroke-linecap="round"/><circle r="3.5" fill="#2A3342"/>'+(t?'</g>'+mini(x,y+58*s,t,18):'</g>')}
function stopwatch(x,y,txt,on){return '<g transform="translate('+x+' '+y+')"><rect x="-8" y="-82" width="16" height="16" rx="3" fill="#7F8C99"/><circle r="70" fill="#F4F6F8" stroke="#3B4650" stroke-width="7"/><rect x="-54" y="-24" width="108" height="48" rx="8" fill="#16241B"/>'+
 '<text x="0" y="14" text-anchor="middle" font-size="32" font-weight="800" font-family="ui-monospace,Menlo,Consolas,monospace" fill="'+(on?'#8EF0B2':'#5E8A6E')+'">'+txt+'</text></g>'}
const LCOL={k:'#1F2328',r:'#D2312A',b:'#1F5FC4'};
function pen(x,y,col,rot){return '<g transform="translate('+x+' '+y+') rotate('+(rot==null?-30:rot)+')"><rect x="-9" y="-96" width="18" height="84" rx="5" fill="'+col+'"/><rect x="-9" y="-96" width="18" height="24" rx="5" fill="#E9ECEF" stroke="'+col+'" stroke-width="2"/><path d="M-7 -12 L0 6 L7 -12Z" fill="'+col+'"/></g>'}
function towel(x,y,anim){return '<g'+(anim?an('lb-a-rub',0):'')+'><g transform="translate('+x+' '+y+')"><rect x="-56" y="-44" width="112" height="88" rx="12" fill="#F6C76A" stroke="#B98A2E" stroke-width="3"/><path d="M-56 22 H56 M-56 30 H56" stroke="#E0506B" stroke-width="4"/></g></g>'}
/* 전자저울(힘 실험관 그림을 고침). item = 위에 올린 것(바닥 y=330), val 화면 숫자 */
function escale(x,o){o=o||{};let g='<g>';const L=x-180;
 g+='<ellipse cx="'+x+'" cy="'+(BY+2)+'" rx="190" ry="9" fill="var(--w-shadow)"/>';
 g+='<path d="M'+L+' 372 L'+(L+18)+' 352 H'+(L+378)+' L'+(L+360)+' 372Z" fill="#CBD3DB" stroke="#7F8C99" stroke-width="2"/>';
 g+='<rect x="'+L+'" y="372" width="360" height="64" rx="10" fill="#E3E8ED" stroke="#7F8C99" stroke-width="2.5"/>';
 g+='<rect x="'+(L+40)+'" y="344" width="240" height="10" rx="3" fill="#9AA6B2"/><rect x="'+(L+20)+'" y="330" width="280" height="16" rx="6" fill="#F4F6F8" stroke="#7F8C99" stroke-width="2.5"/>';
 g+='<rect x="'+(L+40)+'" y="384" width="170" height="42" rx="6" fill="'+(o.on?'#16241B':'#3A4148')+'" stroke="#2A3138" stroke-width="2"/>';
 if(o.on)g+='<text x="'+(L+186)+'" y="416" text-anchor="end" font-size="30" font-weight="800" font-family="ui-monospace,Menlo,Consolas,monospace" fill="'+(o.hl?'#FFE66B':'#8EF0B2')+'">'+esc(o.val)+'</text><text x="'+(L+202)+'" y="416" text-anchor="end" font-size="14" font-weight="800" fill="#8EF0B2">g</text>';
 [['전원',L+260,o.pw],['영점',L+320,o.zp]].forEach(([t,cx,p])=>{g+='<circle cx="'+cx+'" cy="404" r="15" fill="'+(p?'var(--lb-sci)':'#FFFFFF')+'" stroke="#5D6B78" stroke-width="2.5"/>'+(NAR?'':'<text x="'+cx+'" y="432" text-anchor="middle" font-size="13" font-weight="800" fill="#2A3138">'+t+'</text>')});
 if(o.press)g+='<g'+an('lb-a-fade',0)+'>'+hand(o.press==='pw'?L+260+40:L+320+40,398,200,.8,1)+'</g>';
 if(o.item)g+='<g'+(o.drop?an('lb-a-down',0,'--from:-90px'):'')+'>'+o.item+'</g>';
 return g+'</g>'}
const ES={x:560,disp:[425+80,405]};
/* ───────── 실험복·보안경·장갑 ───────── */
function coat(x,y,s){return '<g transform="translate('+x+' '+y+') scale('+(s||1)+')"><path d="M-46 -64 L-18 -72 L0 -40 L18 -72 L46 -64 L62 30 L40 34 L36 -10 L34 72 H-34 L-36 -10 L-40 34 L-62 30Z" fill="#FFFFFF" stroke="#9AA6B2" stroke-width="3" stroke-linejoin="round"/><path d="M0 -40 V72" stroke="#9AA6B2" stroke-width="2"/><circle cx="-7" cy="-6" r="3" fill="#9AA6B2"/><circle cx="-7" cy="22" r="3" fill="#9AA6B2"/><rect x="12" y="10" width="16" height="12" rx="2" fill="none" stroke="#9AA6B2" stroke-width="2"/></g>'}
function goggles(x,y,s){return '<g transform="translate('+x+' '+y+') scale('+(s||1)+')"><rect x="-58" y="-18" width="52" height="36" rx="15" fill="rgba(200,230,245,.6)" stroke="#2F68B0" stroke-width="4"/><rect x="6" y="-18" width="52" height="36" rx="15" fill="rgba(200,230,245,.6)" stroke="#2F68B0" stroke-width="4"/><path d="M-6 -2 h12" stroke="#2F68B0" stroke-width="5"/></g>'}
function gearArt(on,anim,cotton){const gl=cotton?'#F4F1EA':'#FFFFFF';
 if(!on)return coat(300,250,1.4)+goggles(520,200,1.1)+'<g transform="translate(700 270) scale(1.3)">'+hand(-14,-10,-60,.75,1).replace(/#FFFFFF/g,gl)+hand(22,8,-60,.75,1).replace(/#FFFFFF/g,gl)+'</g>'+qmark(480,90);
 return '<g'+(anim?an('lb-a-up',0,'--from:100px'):'')+'><circle cx="480" cy="116" r="38" fill="#F2C6A0" stroke="#B9875F" stroke-width="3"/>'+goggles(480,108,.82)+coat(480,262,1.75)+hand(330,240,-70,1.4,1).replace(/#FFFFFF/g,gl)+hand(630,240,-110,1.4,1).replace(/#FFFFFF/g,gl)+'</g>'}
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

/* ───────── 여러 가지 기체: 실험 기구 그림(모두 직접 그린 SVG) ───────── */
const AIRC='#CFE8F6',GLS='var(--w-glass-s)',RUB='#E2573F',RUBS='#9C3424';
/* 페트병(500 mL)과 공기 주입 마개. dent = 손가락으로 누른 곳이 들어간 정도(0~1), press = 마개 누르는 움직임 */
function petBottle(cx,base,o){o=o||{};const w=44,d=(o.dent||0)*30;let g=shadow(cx,base+4,w+10);
 const L=cx-w,R=cx+w;
 const out='M'+L+' '+(base-8)+' Q'+L+' '+base+' '+(L+8)+' '+base+' H'+(R-8)+' Q'+R+' '+base+' '+R+' '+(base-8)+' V'+(base-150)+' Q'+R+' '+(base-182)+' '+(cx+13)+' '+(base-196)+' V'+(base-210)+' H'+(cx-13)+' V'+(base-196)+' Q'+L+' '+(base-182)+' '+L+' '+(base-150)+' V'+(base-122)+' Q'+(L+d)+' '+(base-92)+' '+L+' '+(base-62)+'Z';
 g+='<path d="'+out+'" fill="rgba(222,240,250,.7)"/>';
 [40,116].forEach(y=>{g+='<path d="M'+(L+4)+' '+(base-y)+' H'+(R-4)+'" stroke="#A9C6D6" stroke-width="2"/>'});
 g+='<path d="'+out+'" fill="none" stroke="#5F8DA6" stroke-width="3.5" stroke-linejoin="round"/><path d="M'+(R-12)+' '+(base-140)+' V'+(base-24)+'" stroke="#FFFFFF" stroke-width="5" opacity=".7" stroke-linecap="round"/>';
 if(o.cap!==0){const t=base-210;g+='<rect x="'+(cx-17)+'" y="'+(t-20)+'" width="34" height="22" rx="4" fill="#3A78C8" stroke="#1D4A80" stroke-width="2"/>';
  g+='<g'+(o.press?' class="lb-a lb-a-press"':'')+'><rect x="'+(cx-8)+'" y="'+(t-42)+'" width="16" height="24" rx="3" fill="#E3E8ED" stroke="#5D6B78" stroke-width="2"/><rect x="'+(cx-14)+'" y="'+(t-48)+'" width="28" height="9" rx="4" fill="#F2B33D" stroke="#9A6B12" stroke-width="2"/>'+(o.press?hand(cx+6,t-60,90,.7,1):'')+'</g>';
  if(o.press)g+='<g class="lb-a lb-a-pulse">'+[0,1,2].map(i=>'<path d="M'+(cx-6+i*6)+' '+(t+8+i*10)+' v14" stroke="#4E8FB8" stroke-width="3" stroke-linecap="round"/>').join('')+'</g>'}
 if(o.dent)g+=hand(L+d-48,base-92,0,1,1);
 return g}
/* 공기를 빼는 장치: 투명한 용기 + 뚜껑(가운데 단추) + 손 펌프. o.lid 뚜껑 닫힘 · o.lidOff 뚜껑을 옆에 둠 · o.pump 펌프를 끼움 · o.inner 안에 넣은 것 */
const VJ={w:96,h:168};
function vacLid(cx,top,o){o=o||{};return '<g><rect x="'+(cx-VJ.w-8)+'" y="'+(top-22)+'" width="'+(2*VJ.w+16)+'" height="24" rx="6" fill="#4A5563" stroke="#2C333A" stroke-width="2.5"/><rect x="'+(cx-14)+'" y="'+(top-36)+'" width="28" height="16" rx="3" fill="#6B7785" stroke="#2C333A" stroke-width="2"/>'+
 '<circle cx="'+cx+'" cy="'+(top-38)+'" r="9" fill="'+(o.btn?'#9E2A1E':'#E2573F')+'" stroke="#7A2A20" stroke-width="2"/></g>'}
function vacPump(cx,top,anim){const t=top-38;return '<g><rect x="'+(cx-18)+'" y="'+(t-150)+'" width="36" height="140" rx="7" fill="#3A78C8" stroke="#1D4A80" stroke-width="2.5"/><rect x="'+(cx-8)+'" y="'+(t-12)+'" width="16" height="14" fill="#2C333A"/>'+
 '<g'+(anim?' class="lb-a lb-a-pump"':'')+'><rect x="'+(cx-4)+'" y="'+(t-200)+'" width="8" height="56" fill="#9AA5AD"/><rect x="'+(cx-40)+'" y="'+(t-212)+'" width="80" height="16" rx="7" fill="#2C333A"/></g></g>'}
function vacJar(cx,base,o){o=o||{};const w=VJ.w,h=VJ.h,top=base-h;let g=shadow(cx,base+4,w+14);
 const out='M'+(cx-w)+' '+top+' V'+(base-10)+' Q'+(cx-w)+' '+base+' '+(cx-w+10)+' '+base+' H'+(cx+w-10)+' Q'+(cx+w)+' '+base+' '+(cx+w)+' '+(base-10)+' V'+top;
 g+='<path d="'+out+'" fill="rgba(222,240,250,.45)"/>';
 if(o.inner)g+=o.inner;
 g+='<path d="'+out+'" fill="none" stroke="'+GLS+'" stroke-width="4"/><path d="M'+(cx-w+14)+' '+(top+14)+' V'+(base-20)+'" stroke="#FFFFFF" stroke-width="6" opacity=".6" stroke-linecap="round"/><rect x="'+(cx-w-4)+'" y="'+(top-4)+'" width="'+(2*w+8)+'" height="10" rx="4" fill="#B9C6CF" stroke="'+GLS+'" stroke-width="2"/>';
 if(o.lid){g+='<g'+(o.lidAnim?an('lb-a-down',0,'--from:-120px'):o.lidUp?' class="lb-a lb-a-lidup"':'')+'>'+vacLid(cx,top,{btn:o.btn})+'</g>';
  if(o.pump)g+='<g'+(o.pumpIn?an('lb-a-down',.6,'--from:-140px'):o.pumpOut?an('lb-a-out',0):'')+'>'+vacPump(cx,top,o.pumpAnim)+'</g>'}
 if(o.lidOff)g+='<g transform="translate('+(o.lidOff)+' 0)">'+vacLid(0,BY-2,{})+'</g>';
 if(o.press)g+='<g'+an('lb-a-fade',0)+'>'+hand(cx+48,top-60,200,.85,o.glove)+'</g>';
 if(o.inflow)g+='<g class="lb-a lb-a-pulse">'+arrow(cx-60,top-90,cx-16,top-44,'#4E8FB8',5)+arrow(cx+60,top-90,cx+16,top-44,'#4E8FB8',5)+'</g>';
 return g}
/* 펌프질 힘든 정도(교과서 버전 앱에 있는 막대, 칸 수는 이 실험관에서 정한 값) */
function effortBar(x,y,L){let g=tag(x+110,y-30,'펌프질 힘든 정도',18);L.forEach(([t,n],r)=>{const yy=y+r*48;g+='<text x="'+(x+34)+'" y="'+(yy+24)+'" text-anchor="end" font-size="19" font-weight="800" fill="var(--w-labeltx)">'+t+'</text>';
  for(let i=0;i<5;i++)g+='<rect x="'+(x+44+i*34)+'" y="'+yy+'" width="28" height="34" rx="5" fill="'+(i<n?'#E07B2E':'var(--w-label)')+'" stroke="#9A5A20" stroke-width="2"/>'});
 return g}
/* 고무풍선(묶은 것). s 크기, clip 풍선 클립 */
function balloon(x,bottom,s,o){o=o||{};const ry=36,rx=30;const cy=-(ry+14);
 let g='<g transform="translate('+x+' '+bottom+')"><g'+(o.swell?' class="lb-a lb-a-swell" style="--s0:'+o.swell+'"':'')+'><g transform="scale('+s+')">';
 g+='<ellipse cx="0" cy="'+cy+'" rx="'+rx+'" ry="'+ry+'" fill="'+RUB+'" stroke="'+RUBS+'" stroke-width="2"/><ellipse cx="-11" cy="'+(cy-14)+'" rx="6" ry="11" fill="#FFFFFF" opacity=".45"/><path d="M0 '+(cy+ry)+' l-6 8 h12z" fill="'+RUBS+'"/>';
 g+='<rect x="-9" y="'+(cy+ry+6)+'" width="18" height="7" rx="2" fill="#2F8F5B" stroke="#1E6440" stroke-width="1.5"/>';
 return g+'</g></g></g>'}
function marsh(x,bottom,s,o){o=o||{};let g='<g transform="translate('+x+' '+bottom+')"><g'+(o.swell?' class="lb-a lb-a-swell" style="--s0:'+o.swell+'"':'')+'><g transform="scale('+s+')">';
 [[-30,0],[30,0],[0,-44]].forEach(([dx,dy])=>{g+='<rect x="'+(dx-24)+'" y="'+(dy-40)+'" width="48" height="40" rx="12" fill="#FFFFFF" stroke="#E9B0C8" stroke-width="3"/><ellipse cx="'+dx+'" cy="'+(dy-40)+'" rx="24" ry="7" fill="#FFE3EE" stroke="#E9B0C8" stroke-width="2.5"/>'});
 return g+'</g></g></g>'}
/* 집기병(500 mL)과 입구에 씌운 고무풍선. k: 고무풍선 막이 올라온 정도(+ 부풂, − 병 안으로 들어감) */
const JR={w:58,h:190,m:46};
function memPath(cx,top,k){const y=top+6,a=k*(k>=0?130:120),m=JR.m,c=(y-a).toFixed(1);return 'M'+(cx-m)+' '+y+' C'+(cx-m*.55)+' '+c+' '+(cx+m*.55)+' '+c+' '+(cx+m)+' '+y}
function jarArt(cx,base,o){o=o||{};const w=JR.w,h=JR.h,top=base-h,m=JR.m;let g=o.noShadow?'':shadow(cx,base+4,w+8);
 const out='M'+(cx-w)+' '+(base-10)+' Q'+(cx-w)+' '+base+' '+(cx-w+10)+' '+base+' H'+(cx+w-10)+' Q'+(cx+w)+' '+base+' '+(cx+w)+' '+(base-10)+' V'+(top+40)+' Q'+(cx+w)+' '+(top+22)+' '+(cx+m)+' '+(top+16)+' V'+top+' H'+(cx-m)+' V'+(top+16)+' Q'+(cx-w)+' '+(top+22)+' '+(cx-w)+' '+(top+40)+'Z';
 g+='<path d="'+out+'" fill="rgba(222,240,250,.5)"/><path d="'+out+'" fill="none" stroke="'+GLS+'" stroke-width="4" stroke-linejoin="round"/><path d="M'+(cx-w+12)+' '+(top+50)+' V'+(base-22)+'" stroke="#FFFFFF" stroke-width="6" opacity=".6" stroke-linecap="round"/>';
 g+='<rect x="'+(cx-m-6)+'" y="'+(top-6)+'" width="'+(2*m+12)+'" height="12" rx="4" fill="#C7D4DC" stroke="'+GLS+'" stroke-width="2.5"/>';
 if(o.cap){const k=o.k==null?.06:o.k,k0=o.k0;
  let mp='<path d="'+memPath(cx,top,k)+' Z" fill="'+RUB+'" fill-opacity=".8" stroke="'+RUBS+'" stroke-width="5" stroke-linejoin="round">';
  if(k0!=null)mp+='<animate attributeName="d" from="'+memPath(cx,top,k0)+' Z" to="'+memPath(cx,top,k)+' Z" dur="'+(o.dur||2.4)+'s" fill="freeze" calcMode="spline" keySplines=".3 0 .4 1" keyTimes="0;1"/>';
  g+='<g'+(o.capAnim?an('lb-a-down',0,'--from:-80px'):'')+'>'+mp+'</path><rect x="'+(cx-m-9)+'" y="'+(top-10)+'" width="'+(2*m+18)+'" height="26" rx="6" fill="'+RUB+'" stroke="'+RUBS+'" stroke-width="2.5"/><path d="M'+(cx-m-10)+' '+(top+8)+' H'+(cx+m+10)+'" stroke="#6B4A2B" stroke-width="5"'+(o.capAnim?an('lb-a-fade',.9):'')+'/></g>'}
 return g}
/* 수조. kind 'hot'(뜨거운 물) | 'ice'(얼음물). inner = 수조 안에 넣은 것 */
const TKW=170,TKH=150;
function tankArt(cx,base,kind,inner){const w=TKW,h=TKH,top=base-h,lv=base-110;let g=shadow(cx,base+4,w+10);
 const wc=kind==='hot'?'#F4C3A6':'#A9D6EE';
 g+='<rect x="'+(cx-w)+'" y="'+top+'" width="'+(2*w)+'" height="'+h+'" rx="10" fill="rgba(232,244,250,.35)"/>';
 g+='<rect x="'+(cx-w+4)+'" y="'+lv+'" width="'+(2*w-8)+'" height="'+(base-lv-4)+'" rx="8" fill="'+wc+'" fill-opacity=".55"/>';
 if(inner)g+=inner;
 g+='<rect x="'+(cx-w+4)+'" y="'+lv+'" width="'+(2*w-8)+'" height="'+(base-lv-4)+'" rx="8" fill="'+wc+'" fill-opacity=".5"/><path d="M'+(cx-w+4)+' '+lv+' H'+(cx+w-4)+'" stroke="'+(kind==='hot'?'#C9784B':'#4E8FB8')+'" stroke-width="3"/>';
 if(kind==='ice')[[-130,0],[-80,8],[90,2],[135,10],[-150,26],[120,34]].forEach(([dx,dy],i)=>{const x=cx+dx,y=lv-12+dy;g+='<rect x="'+(x-15)+'" y="'+(y-12)+'" width="30" height="28" rx="6" transform="rotate('+(i*13-20)+' '+x+' '+y+')" fill="#F2F8FB" stroke="#8AB4C8" stroke-width="2"/>'});
 if(kind==='hot')[-110,-40,40,110].forEach(dx=>{g+='<path d="M'+(cx+dx)+' '+(lv-12)+' q-10 -16 0 -32 t0 -32" fill="none" stroke="#E5A06B" stroke-width="4" stroke-linecap="round" opacity=".75"/>'});
 g+='<rect x="'+(cx-w)+'" y="'+top+'" width="'+(2*w)+'" height="'+h+'" rx="10" fill="none" stroke="'+GLS+'" stroke-width="4"/>';
 return g}
/* 주사기(옆으로 눕힘). V = 주사기 속 공기의 부피(mL), 눈금 0~60 */
const SY={y:250,x0:232,k:8};
const SX=v=>SY.x0+v*SY.k;
function syringe(V,o){o=o||{};const y=SY.y,x1=SX(60)+14;let g='';
 g+='<rect x="168" y="'+(y-9)+'" width="'+(SY.x0-170)+'" height="18" rx="4" fill="rgba(222,240,250,.8)" stroke="'+GLS+'" stroke-width="3"/>';
 g+='<rect x="'+(SY.x0-4)+'" y="'+(y-34)+'" width="'+(x1-SY.x0+4)+'" height="68" rx="8" fill="rgba(222,240,250,.55)" stroke="'+GLS+'" stroke-width="3.5"/>';
 let t='';for(let v=0;v<=60;v+=2){const x=SX(v),big=v%10===0;t+='<path d="M'+x+' '+(y-34)+' v'+(big?18:9)+'" stroke="#3B4650" stroke-width="'+(big?2.6:1.6)+'"/>';if(big)t+='<text x="'+x+'" y="'+(y-44)+'" text-anchor="middle" font-size="20" font-weight="800" fill="var(--w-labeltx)">'+v+'</text>'}
 g+=t+'<text x="'+(x1+30)+'" y="'+(y-44)+'" text-anchor="middle" font-size="18" font-weight="800" fill="var(--w-labeltx)">mL</text>';
 g+='<rect x="'+(x1-2)+'" y="'+(y-58)+'" width="14" height="116" rx="5" fill="#C7D4DC" stroke="'+GLS+'" stroke-width="2.5"/>';
 /* 피스톤(고무 머리 + 막대 + 누르는 판) */
 const pg='<rect x="0" y="'+(y-31)+'" width="18" height="62" rx="4" fill="#2C333A"/><rect x="18" y="'+(y-7)+'" width="246" height="14" fill="#E3E8ED" stroke="#7F8C99" stroke-width="2"/><rect x="262" y="'+(y-46)+'" width="14" height="92" rx="5" fill="#E3E8ED" stroke="#7F8C99" stroke-width="2.5"/>'+(o.push?hand(330,y,180,1.15,1):'');
 g+='<g transform="translate('+SX(V)+' 0)"><g'+(o.from!=null?an('lb-a-slide',0,'--dx:'+((o.from-V)*SY.k)+'px;animation-duration:'+(o.dur||1.6)+'s'):'')+'>'+pg+'</g></g>';
 if(o.cap)g+='<g'+(o.capAnim?an('lb-a-slide',0,'--dx:-90px'):'')+'><rect x="140" y="'+(y-15)+'" width="32" height="30" rx="7" fill="#3A78C8" stroke="#1D4A80" stroke-width="2.5"/></g>';
 if(o.puff)g+='<g class="lb-a lb-a-pulse">'+[[-20,-14],[-28,0],[-20,14]].map(([dx,dy])=>arrow(160,y,160+dx*2.4,y+dy*2.2,'#4E8FB8',4)).join('')+'</g>';
 return g}
/* 공기 주입기(풍선용 손 펌프)·풍선 클립·가위·고무줄 */
function injector(x,y,s){return '<g transform="translate('+x+' '+y+') scale('+(s||1)+')"><rect x="-16" y="-60" width="32" height="96" rx="7" fill="#5BB37A" stroke="#2E7A4C" stroke-width="2.5"/><path d="M-10 36 L-4 58 H4 L10 36Z" fill="#2E7A4C"/><rect x="-4" y="-96" width="8" height="40" fill="#9AA5AD"/><rect x="-26" y="-104" width="52" height="12" rx="5" fill="#2C333A"/></g>'}
function clipArt(x,y,s){return '<g transform="translate('+x+' '+y+') scale('+(s||1)+')"><rect x="-22" y="-8" width="44" height="16" rx="5" fill="#2F8F5B" stroke="#1E6440" stroke-width="2"/><path d="M-14 0 H14" stroke="#BFE8CF" stroke-width="3"/></g>'}
function flatBalloon(x,y,s){return '<g transform="translate('+x+' '+y+') scale('+(s||1)+')"><path d="M-12 -40 Q-22 -20 -10 6 L-6 26 H6 L10 6 Q22 -20 12 -40 Q0 -50 -12 -40Z" fill="'+RUB+'" stroke="'+RUBS+'" stroke-width="2"/></g>'}
function scissors(x,y,s){return '<g transform="translate('+x+' '+y+') scale('+(s||1)+') rotate(-30)"><path d="M-4 -6 L-6 -60 L4 -60 L4 -6Z" fill="#B9C2CA" stroke="#5D6B78" stroke-width="2"/><path d="M4 -6 L18 -56 L24 -52 L10 -4Z" fill="#B9C2CA" stroke="#5D6B78" stroke-width="2"/><circle cx="-10" cy="12" r="13" fill="none" stroke="#E2573F" stroke-width="6"/><circle cx="16" cy="12" r="13" fill="none" stroke="#E2573F" stroke-width="6"/></g>'}
function bandArt(x,y,s){return '<g transform="translate('+x+' '+y+') scale('+(s||1)+')"><ellipse rx="34" ry="20" fill="none" stroke="#8A5A2B" stroke-width="6"/></g>'}
/* 더 알아보기: 차가운 빈 병과 동전 */
function coinBottle(cx,base,o){o=o||{};let g=shadow(cx,base+4,60);const top=base-230;
 const out='M'+(cx-52)+' '+(base-10)+' Q'+(cx-52)+' '+base+' '+(cx-42)+' '+base+' H'+(cx+42)+' Q'+(cx+52)+' '+base+' '+(cx+52)+' '+(base-10)+' V'+(base-130)+' Q'+(cx+52)+' '+(base-170)+' '+(cx+20)+' '+(base-190)+' V'+top+' H'+(cx-20)+' V'+(base-190)+' Q'+(cx-52)+' '+(base-170)+' '+(cx-52)+' '+(base-130)+'Z';
 g+='<path d="'+out+'" fill="rgba(190,225,214,.5)" stroke="#5E9C88" stroke-width="3.5" stroke-linejoin="round"/>';
 if(o.cold)for(let i=0;i<26;i++)g+='<circle cx="'+(cx-44+rnd(i,91)*88).toFixed(1)+'" cy="'+(base-16-rnd(i,92)*110).toFixed(1)+'" r="'+(1.5+rnd(i,93)*1.8).toFixed(1)+'" fill="#FFFFFF" opacity=".8"/>';
 g+='<g'+(o.jiggle?' class="lb-a lb-a-coin"':'')+'><ellipse cx="'+cx+'" cy="'+(top-3)+'" rx="30" ry="8" fill="#E1B94A" stroke="#9A7A1C" stroke-width="2.5"/></g>';
 if(o.hands)g+='<g'+an('lb-a-fade',0)+'>'+hand(cx-62,base-80,0,1.2,0)+hand(cx+62,base-80,180,1.2,0)+'</g>';
 return g}
/* ───────── 준비물 카드 ───────── */
function itemArt(k){const A={
  pet:'<g transform="translate(0 60) scale(.42)">'+petBottle(0,0,{}).replace(/<ellipse[^>]*\/>/,'')+'</g>',
  injcap:'<g transform="translate(0 4) scale(1.5)"><rect x="-17" y="-2" width="34" height="22" rx="4" fill="#3A78C8" stroke="#1D4A80" stroke-width="2"/><rect x="-8" y="-24" width="16" height="24" rx="3" fill="#E3E8ED" stroke="#5D6B78" stroke-width="2"/><rect x="-14" y="-30" width="28" height="9" rx="4" fill="#F2B33D" stroke="#9A6B12" stroke-width="2"/></g>',
  scale:'<g transform="translate(-50 -96) scale(.32)">'+escale(160,{}).replace(/<ellipse[^>]*\/>/,'')+'</g>',
  gear:coat(-30,4,.5)+goggles(28,-24,.5)+hand(30,26,-60,.55,1),
  vac:'<g transform="translate(-10 52) scale(.36)">'+vacJar(0,0,{lid:1}).replace(/<ellipse[^>]*\/>/,'')+'</g><g transform="translate(52 56) scale(.36)">'+vacPump(0,0,false)+'</g>',
  flat:flatBalloon(0,6,1.1),
  scis:scissors(0,10,.95),
  jar:'<g transform="translate(0 56) scale(.5)">'+jarArt(0,0,{noShadow:1})+'</g>',
  band:bandArt(0,0,1),
  hotTank:'<g transform="translate(0 50) scale(.32)">'+tankArt(0,0,'hot').replace(/<ellipse[^>]*\/>/,'')+'</g>',
  iceTank:'<g transform="translate(0 50) scale(.32)">'+tankArt(0,0,'ice').replace(/<ellipse[^>]*\/>/,'')+'</g>',
  towel:towel(0,0),
  syr:'<g transform="translate(-100 -76) scale(.3)">'+syringe(40,{})+'</g>',
  scap:'<g transform="scale(1.6)"><rect x="-16" y="-15" width="32" height="30" rx="7" fill="#3A78C8" stroke="#1D4A80" stroke-width="2.5"/></g>',
  inj:injector(0,24,.8),
  clip:clipArt(0,0,1.6)};
 return A[k]||''}
