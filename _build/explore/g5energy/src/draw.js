/* ───────── 그림: 실험대 장면 — 모두 직접 그린 SVG (자원과 에너지 · 집 모형) ───────── */
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

/* ───────── 집 모형(전개도로 만든 종이 집) ───────── */
const HX=[270,690],HN=['㉮','㉯'];
const HW=100,HH=140,RH=78;
const WOOD='#F1E3A8',WOODS='#B89A45',CLAY='#E8833A',CLAYS='#A9541B',WARM='#E25B45',WARMS='#9E3426';
/* 탐침 온도계 화면(꺼짐 · 숫자 · 반짝임) */
function probeDisp(x,y,temp,hl){let g='<rect x="'+(x-66)+'" y="'+y+'" width="132" height="58" rx="9" fill="'+(temp==null?'#3A4148':'#16241B')+'" stroke="#2A3138" stroke-width="3"/>';
 if(temp!=null)g+='<text x="'+(x+26)+'" y="'+(y+42)+'" text-anchor="end" font-size="36" font-weight="800" font-family="ui-monospace,Menlo,Consolas,monospace" fill="'+(hl?'#FFE66B':'#8EF0B2')+'">'+esc(temp)+'</text><text x="'+(x+50)+'" y="'+(y+40)+'" text-anchor="middle" font-size="18" font-weight="800" fill="'+(hl?'#FFE66B':'#8EF0B2')+'">℃</text>';
 return g}
function bubbles(x0,y0,lay){let g='<g>';for(let i=0;i<4;i++)for(let j=0;j<4;j++)g+='<circle cx="'+(x0+9+i*14+(lay?7:0))+'" cy="'+(y0+8+j*13+(lay?6:0))+'" r="5.2" fill="rgba(255,255,255,.75)" stroke="#8FB3C9" stroke-width="1.4"/>';return g+'</g>'}
/* o: bub(0~2) wood clay probe(1) temp hl warm(1) warmAnim warmOut insulAnim probeAnim name */
function houseArt(x,o){o=o||{};const b=BY,L=x-HW,R=x+HW,T=b-HH,A=T-RH;let g=shadow(x,b+2,HW+26);
 const ia=o.insulAnim;
 if(o.wood)g+='<g'+(ia?an('lb-a-fade',.9):'')+'><path d="M'+(L-11)+' '+b+' V'+(T-2)+' L'+(L-27)+' '+(T-2)+' L'+x+' '+(A-15)+' L'+(R+27)+' '+(T-2)+' L'+(R+11)+' '+(T-2)+' V'+b+'Z" fill="'+WOOD+'" stroke="'+WOODS+'" stroke-width="2.5" stroke-linejoin="round"/></g>';
 g+='<rect x="'+L+'" y="'+T+'" width="'+2*HW+'" height="'+HH+'" fill="#F7EFDD" stroke="#9C7B4E" stroke-width="3"/>';
 g+='<path d="M'+(L-16)+' '+T+' L'+x+' '+A+' L'+(R+16)+' '+T+'Z" fill="#D98C5F" stroke="#9A5634" stroke-width="3" stroke-linejoin="round"/>';
 for(let k=1;k<4;k++){const yy=A+RH*k/4,dx=(HW+16)*k/4;g+='<path d="M'+(x-dx)+' '+yy+' H'+(x+dx)+'" stroke="#B86B43" stroke-width="2" opacity=".6"/>'}
 /* 창문 */
 const wx=x-72,wy=b-112;g+='<rect x="'+wx+'" y="'+wy+'" width="60" height="54" fill="#CFE6F4" stroke="#6E8FA8" stroke-width="3"/>';
 if(o.bub)g+='<g'+(o.bubAnim?an('lb-a-fade',.4):'')+'>'+bubbles(wx,wy,0)+'</g>';
 if(o.bub>1)g+='<g'+(ia?an('lb-a-fade',.2):'')+'>'+bubbles(wx,wy,1)+'</g>';
 g+='<path d="M'+(wx+30)+' '+wy+' V'+(wy+54)+' M'+wx+' '+(wy+27)+' H'+(wx+60)+'" stroke="#6E8FA8" stroke-width="2.5"/>';
 /* 아래쪽 손난로 넣는 곳 */
 const ox=x+26,oy=b-36;g+='<rect x="'+ox+'" y="'+oy+'" width="56" height="36" fill="'+(o.warm||o.warmAnim||o.warmOut?'#5B4632':'#EADBC0')+'" stroke="#9C7B4E" stroke-width="2.5"/>';
 if(o.warm||o.warmAnim)g+='<g'+(o.warmAnim?an('lb-a-slide',0,'--dx:150px'):'')+'><rect x="'+(ox+5)+'" y="'+(oy+9)+'" width="46" height="22" rx="7" fill="'+WARM+'" stroke="'+WARMS+'" stroke-width="2"/></g>';
 if(o.warmOut)g+='<g'+an('lb-a-slide',0,'--dx:-150px')+'><rect x="'+(ox+150)+'" y="'+(oy+9)+'" width="46" height="22" rx="7" fill="'+WARM+'" stroke="'+WARMS+'" stroke-width="2"/></g>';
 /* 색점토로 막은 틈(모서리·이음매) */
 if(o.clay){g+='<g'+(ia?an('lb-a-pop',1.6):'')+'>';[[L,T],[R,T],[L,b-4],[R,b-4],[x,A+4],[L-8,T-4],[R+8,T-4]].forEach(p=>{g+='<ellipse cx="'+p[0]+'" cy="'+p[1]+'" rx="9" ry="6" fill="'+CLAY+'" stroke="'+CLAYS+'" stroke-width="1.6"/>'});
  [[wx,wy],[wx+60,wy],[wx,wy+54],[wx+60,wy+54]].forEach(p=>{g+='<circle cx="'+p[0]+'" cy="'+p[1]+'" r="5" fill="'+CLAY+'" stroke="'+CLAYS+'" stroke-width="1.4"/>'});g+='</g>'}
 /* 탐침 온도계: 지붕 위 화면, 안쪽 탐침(점선 = 집 모형 안), 끝은 공기 가운데 */
 if(o.probe){g+='<g'+(o.probeAnim?an('lb-a-down',0,'--from:-70px'):'')+'><path d="M'+x+' '+(A+4)+' V'+(b-70)+'" stroke="#6F778A" stroke-width="3.5" stroke-dasharray="7 6"/><circle cx="'+x+'" cy="'+(b-70)+'" r="4" fill="#6F778A"/>';
  g+='<path d="M'+x+' '+(A-30)+' V'+(A+4)+'" stroke="#6F778A" stroke-width="5" stroke-linecap="round"/>'+probeDisp(x,A-88,o.temp,o.hl)+'</g>'}
 if(o.name)g+=mini(x,b+44,o.name,19);
 return g}
/* 두 집 모형. each(i) = 집마다 더 줄 것 */
function houses(o,each){o=o||{};let g='';HX.forEach((x,i)=>{g+=houseArt(x,Object.assign({},o,each?each(i):{}))});return g}
/* 전개도 한 장(종이에 그려진 집 모양, 접는 선은 점선) */
function netSheet(x,y,s){return '<g transform="translate('+x+' '+y+') scale('+(s||1)+')"><rect x="-100" y="-90" width="200" height="180" rx="6" fill="#FFFDF8" stroke="#B9AE98" stroke-width="2.5"/>'+
 '<path d="M-26 -24 h52 v44 h-52z M-26 -24 l26 -24 l26 24 M26 -24 h40 v44 h-40 M-26 -24 h-40 v44 h40 M-26 20 h52 v40 h-52z" fill="#F7EFDD" stroke="#9C7B4E" stroke-width="2" stroke-linejoin="round"/>'+
 '<path d="M-26 -24 v44 M26 -24 v44 M-26 20 h52" stroke="#9C7B4E" stroke-width="1.6" stroke-dasharray="5 4"/><rect x="-18" y="-14" width="18" height="16" fill="#CFE6F4" stroke="#6E8FA8" stroke-width="1.5"/></g>'}
function tapeArt(x,y,s){return '<g transform="translate('+x+' '+y+') scale('+(s||1)+')"><circle r="30" fill="#F4F1E6" stroke="#B8AE92" stroke-width="3"/><circle r="15" fill="var(--w-label)" stroke="#B8AE92" stroke-width="2.5"/><path d="M26 14 L56 22" stroke="#E7E1CC" stroke-width="10"/></g>'}
function bubSheet(x,y,s,n){let g='<g transform="translate('+x+' '+y+') scale('+(s||1)+')">';for(let k=(n||1)-1;k>=0;k--){g+='<g transform="translate('+(k*8)+' '+(-k*8)+')"><rect x="-44" y="-30" width="88" height="60" rx="4" fill="#EAF3F8" stroke="#8FB3C9" stroke-width="2"/>';
 for(let i=0;i<5;i++)for(let j=0;j<4;j++)g+='<circle cx="'+(-34+i*17)+'" cy="'+(-20+j*13)+'" r="5" fill="#FFFFFF" stroke="#9DBBCD" stroke-width="1.2"/>';g+='</g>'}return g+'</g>'}
function warmArt(x,y,s){return '<g transform="translate('+x+' '+y+') scale('+(s||1)+')"><rect x="-30" y="-20" width="60" height="40" rx="10" fill="'+WARM+'" stroke="'+WARMS+'" stroke-width="2.5"/><path d="M-18 -6 h36 M-18 6 h36" stroke="#F5B2A6" stroke-width="3" stroke-linecap="round"/></g>'}
function probeArt(x,y,s){return '<g transform="translate('+x+' '+y+') scale('+(s||1)+')"><rect x="-26" y="-50" width="52" height="30" rx="5" fill="#3A4148" stroke="#2A3138" stroke-width="2"/><path d="M0 -20 V44" stroke="#6F778A" stroke-width="4" stroke-linecap="round"/><path d="M-3 44 L0 54 L3 44Z" fill="#6F778A"/></g>'}
function woodArt(x,y,s){return '<g transform="translate('+x+' '+y+') scale('+(s||1)+')"><path d="M-56 -30 L-44 -40 H60 L48 -30Z" fill="#E4D28E" stroke="'+WOODS+'" stroke-width="2"/><rect x="-56" y="-30" width="104" height="66" fill="'+WOOD+'" stroke="'+WOODS+'" stroke-width="2.5"/><path d="M48 -30 L60 -40 V26 L48 36Z" fill="#DCC77E" stroke="'+WOODS+'" stroke-width="2"/></g>'}
function clayArt(x,y,s){return '<g transform="translate('+x+' '+y+') scale('+(s||1)+')"><ellipse cx="-24" cy="6" rx="24" ry="16" fill="'+CLAY+'" stroke="'+CLAYS+'" stroke-width="2"/><ellipse cx="18" cy="12" rx="20" ry="13" fill="#5FA867" stroke="#3B7442" stroke-width="2"/><ellipse cx="6" cy="-12" rx="18" ry="12" fill="#5B8FD6" stroke="#355E99" stroke-width="2"/></g>'}

/* ───────── 준비물 카드 ───────── */
function itemArt(k){const A={
  net:netSheet(0,0,.5),
  tape:tapeArt(-6,0,1),
  bub:bubSheet(-8,8,.9,3),
  warm:warmArt(-26,-10,.85)+warmArt(24,14,.85),
  probe:probeArt(-22,0,1)+probeArt(22,0,1),
  watch:'<g transform="scale(.6)">'+stopwatch(0,10,'00:00',1)+'</g>',
  wood:woodArt(0,4,1),
  clay:clayArt(0,6,1.1)};
 return A[k]||''}
