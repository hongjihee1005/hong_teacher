/* ───────── 그림: 실험대 장면 — 모두 직접 그린 SVG (열과 우리 생활) ───────── */
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
/* mode: 'nog' 실험복·장갑만(보안경 없음) · 'sun' 햇빛 보안경만 */
function sunglasses(x,y,s){return '<g transform="translate('+x+' '+y+') scale('+(s||1)+')"><rect x="-58" y="-17" width="52" height="34" rx="14" fill="#2C3440" stroke="#151A20" stroke-width="4"/><rect x="6" y="-17" width="52" height="34" rx="14" fill="#2C3440" stroke="#151A20" stroke-width="4"/><path d="M-6 -3 h12" stroke="#151A20" stroke-width="5"/><path d="M-46 -8 l14 0" stroke="#FFFFFF" stroke-width="3" opacity=".5" stroke-linecap="round"/></g>'}
function gearArt(on,anim,cotton,mode){const gl=cotton?'#F4F1EA':'#FFFFFF';
 if(mode==='sun'){if(!on)return sunglasses(480,270,1.6)+qmark(480,120);
  return '<g'+(anim?an('lb-a-up',0,'--from:100px'):'')+'><circle cx="480" cy="230" r="80" fill="#F2C6A0" stroke="#B9875F" stroke-width="4"/><path d="M440 290 Q480 310 520 290" stroke="#B9875F" stroke-width="4" fill="none" stroke-linecap="round"/>'+sunglasses(480,215,1.15)+'</g>'}
 const nog=mode==='nog';
 if(!on)return coat(300,250,1.4)+(nog?'':goggles(520,200,1.1))+'<g transform="translate(700 270) scale(1.3)">'+hand(-14,-10,-60,.75,1).replace(/#FFFFFF/g,gl)+hand(22,8,-60,.75,1).replace(/#FFFFFF/g,gl)+'</g>'+qmark(480,90);
 return '<g'+(anim?an('lb-a-up',0,'--from:100px'):'')+'><circle cx="480" cy="116" r="38" fill="#F2C6A0" stroke="#B9875F" stroke-width="3"/>'+(nog?'':goggles(480,108,.82))+coat(480,262,1.75)+hand(330,240,-70,1.4,1).replace(/#FFFFFF/g,gl)+hand(630,240,-110,1.4,1).replace(/#FFFFFF/g,gl)+'</g>'}
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


/* ───────── 열과 우리 생활: 실험 기구 그림(모두 직접 그린 SVG) ───────── */
const WC='#BFE3F5',WS='#6FA9CC',GLS='var(--w-glass-s)';
function mixc(a,b,t){t=Math.max(0,Math.min(1,t));const h=x=>[1,3,5].map(i=>parseInt(x.substr(i,2),16));const A=h(a),B=h(b);return '#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('')}
/* 물의 색: 온도를 나타낸 어림 그림(원본 앱의 색 식) */
function tcol(t){return t>=28?mixc('#F7B2A5','#F2D9C0',(45-t)/17):t>=18?mixc('#F2D9C0','#E6EEF2',(28-t)/10):mixc('#E6EEF2','#A9D4F2',(18-t)/8)}
const MONO='ui-monospace,Menlo,Consolas,monospace';
/* 온도 표시 창 */
function lcd(x,y,w,h,txt,o){o=o||{};return '<rect x="'+(x-w/2)+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="5" fill="'+(o.on===false?'#8C979F':o.hl?'#FFF3B0':'#D9F0D0')+'" stroke="#24313D" stroke-width="2"/>'+
 (txt?'<text x="'+(x+w/2-8)+'" y="'+(y+h*.74)+'" text-anchor="end" font-size="'+(o.fs||Math.round(h*.66))+'" font-weight="800" font-family="'+MONO+'" fill="#18301C"'+(o.blink?an('lb-a-pulse',0):'')+'>'+txt+'</text>':'')}
/* 탐침 온도계: (x,y) 몸통 위 가운데. o: on · val · len 탐침 길이 · cap 뚜껑 덮음 · hl · tag 아래 이름 */
function probeTherm(x,y,o){o=o||{};const L=o.len==null?120:o.len;let g='<g>';
 if(o.cap!==false&&!o.on)g+='<rect x="'+(x-11)+'" y="'+(y+88)+'" width="22" height="78" rx="8" fill="#D9473B" stroke="#8E2A22" stroke-width="2"/>';
 else g+='<path d="M'+(x-5)+' '+(y+90)+' H'+(x+5)+' L'+(x+3)+' '+(y+90+L)+' L'+x+' '+(y+100+L)+' L'+(x-3)+' '+(y+90+L)+'Z" fill="#C3CCD4" stroke="#6B7A88" stroke-width="2"/>';
 g+='<rect x="'+(x-42)+'" y="'+y+'" width="84" height="94" rx="14" fill="#F4F7FA" stroke="#24313D" stroke-width="3"/>';
 g+=lcd(x,y+10,70,34,o.on?(o.val||'--.-'):'',{on:!!o.on,hl:o.hl,blink:o.blink});
 g+='<circle cx="'+(x-14)+'" cy="'+(y+66)+'" r="9" fill="#E2573F" stroke="#8E2A22" stroke-width="2"/><circle cx="'+(x+16)+'" cy="'+(y+66)+'" r="7" fill="#9AA6B2" stroke="#5D6B78" stroke-width="2"/>';
 if(o.tag)g+=mini(x,y-20,o.tag,17);
 return g+'</g>'}
/* 유리컵 */
function cupArt(cx,base,o){o=o||{};const w=46,h=128,top=base-h,lv=o.lv==null?.72:o.lv;let g=o.noShadow?'':shadow(cx,base+4,w+8);
 const out='M'+(cx-w)+' '+top+' L'+(cx-w+8)+' '+(base-6)+' Q'+(cx-w+9)+' '+base+' '+(cx-w+16)+' '+base+' H'+(cx+w-16)+' Q'+(cx+w-9)+' '+base+' '+(cx+w-8)+' '+(base-6)+' L'+(cx+w)+' '+top;
 g+='<path d="'+out+'" fill="rgba(232,244,250,.45)"/>';
 if(o.col&&lv){const wy=base-lv*h,k=(base-wy)/h,xl=cx-w+8*(1-k)+3,xr=cx+w-8*(1-k)-3;
  g+='<g'+(o.rise?an('lb-a-rise',.15):'')+'><path d="M'+xl.toFixed(1)+' '+wy.toFixed(1)+' H'+xr.toFixed(1)+' L'+(cx+w-11)+' '+(base-6)+' Q'+(cx+w-12)+' '+(base-3)+' '+(cx+w-18)+' '+(base-3)+' H'+(cx-w+18)+' Q'+(cx-w+12)+' '+(base-3)+' '+(cx-w+11)+' '+(base-6)+'Z" fill="'+o.col+'" fill-opacity=".88"/><path d="M'+xl.toFixed(1)+' '+wy.toFixed(1)+' H'+xr.toFixed(1)+'" stroke="'+mixc(o.col,'#303030',.3)+'" stroke-width="3"/></g>'}
 if(o.inner)g+=o.inner;
 g+='<path d="'+out+'" fill="none" stroke="'+GLS+'" stroke-width="3.5"/><path d="M'+(cx-w+12)+' '+(top+14)+' L'+(cx-w+18)+' '+(base-20)+'" stroke="#FFFFFF" stroke-width="4" opacity=".55" stroke-linecap="round"/>';
 if(o.label)g+=sticker(cx,top+30,o.label,0);
 return g}
/* 따뜻함·차가움을 나타낸 선(느낌을 나타낸 그림) */
function feelArt(x,y,warm){if(warm)return '<g'+an('lb-a-fade',0)+'>'+[0,1,2].map(i=>'<path d="M'+(x-22+i*22)+' '+y+' q-8 -12 0 -24 q8 -12 0 -24" fill="none" stroke="#E07A3A" stroke-width="4" stroke-linecap="round"/>').join('')+'</g>';
 return '<g'+an('lb-a-fade',0)+'>'+[0,1,2].map(i=>{const cx=x-24+i*24,cy=y-22-(i%2)*10;return '<path d="M'+cx+' '+(cy-11)+' V'+(cy+11)+' M'+(cx-10)+' '+(cy-6)+' L'+(cx+10)+' '+(cy+6)+' M'+(cx-10)+' '+(cy+6)+' L'+(cx+10)+' '+(cy-6)+'" stroke="#3E86C6" stroke-width="3.2" stroke-linecap="round"/>'}).join('')+'</g>'}
/* 알코올 온도계(벽에 걸린 것): (x,top) 판 위 가운데, 0~40 °C, k px/°C */
const AK=7.2,AB=320;   /* 0 °C 자리 y = top+AB */
function alcTherm(x,top,v,o){o=o||{};let g='<rect x="'+(x-46)+'" y="'+top+'" width="92" height="'+(AB+60)+'" rx="12" fill="#E8C48E" stroke="#9A6A34" stroke-width="3"/>';
 g+='<rect x="'+(x-6)+'" y="'+(top+14)+'" width="12" height="'+(AB-0)+'" rx="6" fill="#F4F8FA" stroke="#8A97A2" stroke-width="2"/><circle cx="'+x+'" cy="'+(top+AB+26)+'" r="13" fill="#D63C32" stroke="#8E2A22" stroke-width="2"/>';
 for(let t=0;t<=40;t++){const y=top+AB-t*AK;const L=t%10===0?20:t%5===0?14:8;g+='<path d="M'+(x+8)+' '+y.toFixed(1)+' h'+L+'" stroke="#2A2A2A" stroke-width="'+(t%5===0?1.8:1.1)+'"/>';
  if(t%10===0)g+='<text x="'+(x-12)+'" y="'+(y+5).toFixed(1)+'" text-anchor="end" font-size="14" font-weight="800" fill="#2A2A2A">'+t+'</text>'}
 const tp=top+AB-v*AK;g+='<rect x="'+(x-3)+'" y="'+tp.toFixed(1)+'" width="6" height="'+(top+AB+16-tp).toFixed(1)+'" fill="#D63C32"'+(o.anim?an('lb-a-rise lb-a-rise2',0,'animation-duration:2s;--s0:'+(o.from!=null?((o.from*AK+16)/(v*AK+16)).toFixed(3):0)):'')+'/>';
 g+='<text x="'+(x+30)+'" y="'+(top+12+14)+'" font-size="14" font-weight="800" fill="#2A2A2A">°C</text>';
 return g}
/* 눈과 보는 선 */
function eyeLine(x,y,tx,ty,good){return '<g'+an('lb-a-fade',0)+'><path d="M'+(x-22)+' '+y+' Q'+x+' '+(y-16)+' '+(x+22)+' '+y+' Q'+x+' '+(y+16)+' '+(x-22)+' '+y+'Z" fill="#FFFFFF" stroke="#2A3342" stroke-width="3"/><circle cx="'+(x-6)+'" cy="'+y+'" r="6" fill="#2A3342"/><path d="M'+(x-26)+' '+y+' L'+tx+' '+ty+'" stroke="'+(good?'#2E9D5B':'#C0392B')+'" stroke-width="3" stroke-dasharray="7 5"/></g>'}
/* 적외선 온도계(총 모양): (x,y) 앞쪽 끝 */
function irGun(x,y,o){o=o||{};let g='<g transform="translate('+x+' '+y+')'+(o.flip?' scale(-1 1)':'')+'">';
 g+='<path d="M0 -20 H-110 Q-124 -20 -124 -6 V8 Q-124 20 -110 20 H-74 L-86 92 H-56 L-40 20 H0 Z" fill="#F2C94C" stroke="#7A5A12" stroke-width="3" stroke-linejoin="round"/>';
 g+='<rect x="-6" y="-14" width="12" height="28" rx="3" fill="#5D6B78"/><path d="M-62 26 l-4 22" stroke="#7A5A12" stroke-width="5" stroke-linecap="round"/>';
 g+='</g>';
 /* 표시 창(뒤쪽 위) */
 const dx=o.flip?x+60:x-60;g+=lcd(dx,y-62,96,36,o.on?(o.val||'--.-'):'',{on:!!o.on,hl:o.hl});
 g+='<path d="M'+(o.flip?x+60:x-60)+' '+(y-26)+' V'+(y-20)+'" stroke="#7A5A12" stroke-width="3"/>';
 if(o.laser)g+='<g'+an('lb-a-fade',0)+'><path d="M'+(o.flip?x-6:x+6)+' '+y+' L'+o.laser[0]+' '+o.laser[1]+'" stroke="#E2241B" stroke-width="3"/><circle cx="'+o.laser[0]+'" cy="'+o.laser[1]+'" r="7" fill="#E2241B"/></g>';
 return g}
/* 계단(복도) */
function stairsArt(x,base){let g='';for(let i=0;i<5;i++)g+='<rect x="'+(x+i*70)+'" y="'+(base-(i+1)*44)+'" width="'+(420-i*70)+'" height="44" fill="'+(i%2?'#C9B48F':'#D8C39E')+'" stroke="#A58C62" stroke-width="2"/>';return g}
/* 화단 흙 */
function soilBed(x0,x1,y,deep){let g='<rect x="'+x0+'" y="'+y+'" width="'+(x1-x0)+'" height="'+deep+'" fill="#8A5A34"/><rect x="'+(x0-10)+'" y="'+(y-6)+'" width="'+(x1-x0+20)+'" height="14" rx="4" fill="#B9A58A" stroke="#8E7A60" stroke-width="2"/>';
 for(let i=0;i<40;i++)g+='<circle cx="'+(x0+rnd(i,3)*(x1-x0)).toFixed(1)+'" cy="'+(y+12+rnd(i,5)*(deep-18)).toFixed(1)+'" r="'+(1.5+rnd(i,7)*2.5).toFixed(1)+'" fill="#6E4527"/>';
 for(let i=0;i<5;i++){const px=x0+40+i*((x1-x0-80)/4);g+='<path d="M'+px+' '+(y-4)+' q-10 -40 -24 -52 M'+px+' '+(y-4)+' q4 -46 18 -60 M'+px+' '+(y-4)+' q16 -30 34 -36" stroke="#3F8F46" stroke-width="5" fill="none" stroke-linecap="round"/>'}
 return g}
/* 바깥 배경(하늘·땅) */
function bgOut(){return '<rect x="-3000" y="-3000" width="7000" height="3420" fill="#CFE8F7"/><rect x="-3000" y="420" width="7000" height="3000" fill="#E2C893"/><path d="M-3000 420 H4000" stroke="#C7A86C" stroke-width="3"/>'}
function sunArt(x,y,r){let g='';for(let i=0;i<12;i++){const a=i*Math.PI/6;g+='<path d="M'+(x+Math.cos(a)*(r+8)).toFixed(1)+' '+(y+Math.sin(a)*(r+8)).toFixed(1)+' L'+(x+Math.cos(a)*(r+24)).toFixed(1)+' '+(y+Math.sin(a)*(r+24)).toFixed(1)+'" stroke="#F2B21B" stroke-width="5" stroke-linecap="round"/>'}
 return g+'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="#FFD23F" stroke="#E8A514" stroke-width="3"/>'}

/* ── 실험 2: 원통과 알루미늄 캔 ── */
const TUBE={x:400,w:150,h:250};   /* 원통 가운데 x, 반폭, 높이 */
function tubeArt(o){o=o||{};const x=TUBE.x,w=TUBE.w,b=BY,top=b-TUBE.h;let g=shadow(x,b+4,w+10);
 g+='<rect x="'+(x-w)+'" y="'+top+'" width="'+(2*w)+'" height="'+TUBE.h+'" rx="10" fill="rgba(232,244,250,.45)"/>';
 if(o.hot!=null){const wy=o.can?top+46:top+80;g+='<g'+(o.rise?an('lb-a-rise',.15):'')+'><rect x="'+(x-w+4)+'" y="'+wy+'" width="'+(2*w-8)+'" height="'+(b-4-wy)+'" rx="6" fill="'+tcol(o.hot)+'" fill-opacity=".92"/><path d="M'+(x-w+4)+' '+wy+' H'+(x+w-4)+'" stroke="'+mixc(tcol(o.hot),'#303030',.3)+'" stroke-width="3"/></g>'}
 if(o.can)g+=canArt(x+10,b-6,{t:o.cold,inTube:1});
 g+='<rect x="'+(x-w)+'" y="'+top+'" width="'+(2*w)+'" height="'+TUBE.h+'" rx="10" fill="none" stroke="'+GLS+'" stroke-width="4"/><path d="M'+(x-w+14)+' '+(top+20)+' V'+(b-20)+'" stroke="#FFFFFF" stroke-width="5" opacity=".5" stroke-linecap="round"/>';
 if(o.lid){g+='<g'+(o.lidAnim?an('lb-a-down',0,'--from:-90px'):'')+'><rect x="'+(x-w-10)+'" y="'+(top-16)+'" width="'+(2*w+20)+'" height="20" rx="5" fill="#A0673A" stroke="#6E4524" stroke-width="2.5"/>'+
  '<ellipse cx="'+(x-92)+'" cy="'+(top-6)+'" rx="10" ry="5" fill="#3A2A1A"/><ellipse cx="'+(x+10)+'" cy="'+(top-6)+'" rx="10" ry="5" fill="#3A2A1A"/></g>'}
 return g}
function canArt(cx,base,o){o=o||{};const w=46,h=o.inTube?190:170,top=base-h;let g=o.inTube?'':shadow(cx,base+4,w+8);
 g+='<rect x="'+(cx-w)+'" y="'+top+'" width="'+(2*w)+'" height="'+h+'" rx="8" fill="#D9DEE3" stroke="#7E8B97" stroke-width="3.5"/>';
 if(o.t!=null)g+='<g'+(o.rise?an('lb-a-rise',.15):'')+'><rect x="'+(cx-w+6)+'" y="'+(top+22)+'" width="'+(2*w-12)+'" height="'+(h-28)+'" rx="5" fill="'+tcol(o.t)+'" fill-opacity=".95"/></g>';
 g+='<path d="M'+(cx-w+10)+' '+(top+10)+' V'+(base-10)+'" stroke="#FFFFFF" stroke-width="4" opacity=".6" stroke-linecap="round"/><path d="M'+(cx-w)+' '+(top+8)+' H'+(cx+w)+'" stroke="#9AA6B2" stroke-width="3"/>';
 if(!o.inTube)g+=mini(cx,top-18,'알루미늄 캔',16);
 return g}
/* 원통에 든 물 · 캔에 든 물 온도계(구멍에 꽂음) */
function e2Probes(hv,cv,o){o=o||{};const top=BY-TUBE.h;return probeTherm(TUBE.x-92,top-150,{on:1,val:hv,len:200,tag:'원통',hl:o.hl})+probeTherm(TUBE.x+10,top-150,{on:1,val:cv,len:220,tag:'캔',hl:o.hl})}

/* ── 실험 3: 구리판과 열 변색 붙임딱지 ── */
const CU='#C8763A',CUS='#8C4E22',SCOLD='#5B3F8C',SHOT='#F6C445';
/* 칸 판: rows(문자열 배열 '#'=판), 가열한 칸 [r,c]에서 판을 따라 잰 거리(너비 우선) */
function plateDist(rows,h){const R=rows.length,C=rows[0].length,d=rows.map(r=>[...r].map(()=>-1));const q=[[h[0],h[1]]];d[h[0]][h[1]]=0;
 while(q.length){const [r,c]=q.shift();[[1,0],[-1,0],[0,1],[0,-1]].forEach(([a,b])=>{const rr=r+a,cc=c+b;if(rr>=0&&rr<R&&cc>=0&&cc<C&&rows[rr][cc]==='#'&&d[rr][cc]<0){d[rr][cc]=d[r][c]+1;q.push([rr,cc])}})}
 let mx=0;d.forEach(r=>r.forEach(v=>{if(v>mx)mx=v}));return {d,max:mx}}
const LROWS=['#'.repeat(30),'#'.repeat(30)],LHEAT=[0,29];
const UROWS=(()=>{const a=[];for(let r=0;r<12;r++){let s='';for(let c=0;c<20;c++)s+=(r<3||r>=9||c<3)?'#':'.';a.push(s)}return a})(),UHEAT=[1,19];
const LD=plateDist(LROWS,LHEAT),UD=plateDist(UROWS,UHEAT);
/* f: 색깔이 변한 거리(판을 따라 잰 칸 수), f0: 바로 전 거리(그 사이 칸은 천천히 나타남) · sticker: 붙임딱지를 붙였는지 */
function plateArt(x,y,cs,rows,D,o){o=o||{};let g='',gn='';const f=o.f==null?-1:o.f,f0=o.f0==null?f:o.f0;
 const cof=(d,ff)=>d<=ff?mixc(SCOLD,SHOT,Math.min(1,(ff-d+1)/2.2)):SCOLD;
 rows.forEach((row,r)=>[...row].forEach((ch,c)=>{if(ch!=='#')return;const px=x+c*cs,py=y+r*cs,R=col=>'<rect x="'+px+'" y="'+py+'" width="'+(cs+.4)+'" height="'+(cs+.4)+'" fill="'+col+'"/>';
  if(!o.sticker){g+=R(CU);return}
  const d=D.d[r][c],now=cof(d,f),pre=cof(d,f0);g+=R(pre);if(now!==pre)gn+=R(now)}));
 if(gn)g+='<g'+an('lb-a-fade',0,'animation-duration:1.6s')+'>'+gn+'</g>';
 return g}
/* 긴 구리판(스탠드 위) */
const LP={x:250,y:250,cs:15};
function longPlate(o){o=o||{};const W=30*LP.cs,H=2*LP.cs;let g='';
 if(o.stand){g+='<rect x="120" y="'+(BY-12)+'" width="130" height="14" rx="4" fill="#555E66"/><rect x="170" y="140" width="12" height="'+(BY-140-10)+'" fill="#7C8790"/><rect x="176" y="'+(LP.y+6)+'" width="70" height="12" fill="#8E99A2"/><rect x="228" y="'+(LP.y-8)+'" width="34" height="'+(H+16)+'" rx="5" fill="#4A6FA5" stroke="#2D4C78" stroke-width="2"/>';if(!NAR)g+=mini(176,120,'스탠드',16)}
 g+='<rect x="'+(LP.x-4)+'" y="'+(LP.y-4)+'" width="'+(W+8)+'" height="'+(H+8)+'" rx="3" fill="'+CU+'" stroke="'+CUS+'" stroke-width="2.5"/>';
 g+=plateArt(LP.x,LP.y,LP.cs,LROWS,LD,o);
 if(o.stand)g+='<rect x="'+(LP.x-6)+'" y="'+(LP.y-8)+'" width="16" height="'+(H+16)+'" rx="4" fill="#4A6FA5" stroke="#2D4C78" stroke-width="2"/>';
 if(o.candle){const cx=LP.x+W-LP.cs/2;g+=candleArt(cx,BY,{lit:o.lit,h:BY-(LP.y+H)-62})}
 return g}
/* ㄷ자 구리판(위에서 본 모습, 판 위 가열 끝 아래에 촛불 표시) */
const UP={x:330,y:150,cs:16};
function uPlate(o){o=o||{};let g='<g>';const W=20*UP.cs,H=12*UP.cs;
 g+='<path d="M'+(UP.x-4)+' '+(UP.y-4)+' H'+(UP.x+W+4)+' V'+(UP.y+3*UP.cs+4)+' H'+(UP.x+3*UP.cs+4)+' V'+(UP.y+9*UP.cs-4)+' H'+(UP.x+W+4)+' V'+(UP.y+H+4)+' H'+(UP.x-4)+'Z" fill="'+CU+'" stroke="'+CUS+'" stroke-width="2.5"/>';
 g+=plateArt(UP.x,UP.y,UP.cs,UROWS,UD,o);
 const hx=UP.x+19.5*UP.cs,hy=UP.y+1.5*UP.cs;
 if(o.lit)g+='<g opacity=".95">'+flameArt(hx,hy+10,.85)+'</g>';
 if(!NAR){g+=mini(UP.x+W+70,hy+6,o.lit?'촛불로 가열':'가열할 끝',16);g+=mini(UP.x+11.5*UP.cs,UP.y+6*UP.cs+6,'끊어진 곳',16)}
 const ex=UP.x+W+26,ey=UP.y+10.5*UP.cs;g+='<circle cx="'+ex+'" cy="'+ey+'" r="16" fill="#FFFFFF" stroke="#24313D" stroke-width="2.5"/><text x="'+ex+'" y="'+(ey+7)+'" text-anchor="middle" font-size="19" font-weight="800" fill="#24313D">㉤</text>';
 return g+'</g>'}
function flameArt(x,y,s){s=s||1;return '<g transform="translate('+x+' '+y+') scale('+s+')"><path d="M0 0 q-16 -20 0 -46 q16 26 0 46z" fill="#F08A24"/><path d="M0 -2 q-7 -10 0 -24 q7 12 0 24z" fill="#FFD23F"/></g>'}
/* 초(base 바닥). o.lit 촛불 · o.h 초 높이 */
function candleArt(cx,base,o){o=o||{};const h=Math.max(40,o.h||60);let g='<rect x="'+(cx-30)+'" y="'+(base-8)+'" width="60" height="10" rx="4" fill="#B8C2CA" stroke="#7F8C99" stroke-width="2"/><rect x="'+(cx-12)+'" y="'+(base-8-h)+'" width="24" height="'+h+'" rx="3" fill="#F4E6CF" stroke="#C9B48F" stroke-width="2"/><path d="M'+cx+' '+(base-8-h)+' v-10" stroke="#333" stroke-width="2.5"/>';
 if(o.lit)g+='<g'+(o.litAnim?an('lb-a-pop',0):'')+'>'+flameArt(cx,base-14-h,1)+'</g>';
 return g}
function lighterArt(x,y,rot){return '<g transform="translate('+x+' '+y+') rotate('+(rot||0)+')"><rect x="-80" y="-10" width="120" height="20" rx="8" fill="#5D7FB0" stroke="#2D4C78" stroke-width="2"/><rect x="40" y="-5" width="60" height="10" rx="3" fill="#B8C2CA" stroke="#7F8C99" stroke-width="2"/><rect x="-40" y="10" width="26" height="12" rx="3" fill="#2D4C78"/></g>'}

/* ── 실험 4: 사각 통과 잉크 ── */
const TK={x:250,y:180,w:460,h:190};   /* 사각 통(바닥 = 받침 컵 위) */
const INK='#7D4FB3';
function tankStand(o){o=o||{};let g='';const B=BY;
 if(o.film)g+='<rect x="'+(TK.x-30)+'" y="'+(B-4)+'" width="'+(TK.w+60)+'" height="8" rx="2" fill="#E6EEF2" stroke="#9FB4C4" stroke-width="1.5"/>';
 if(o.cups){[[TK.x+30],[TK.x+TK.w-130]].forEach(([cx])=>{g+='<path d="M'+cx+' '+B+' l10 -66 h80 l10 66z" fill="rgba(232,244,250,.6)" stroke="'+GLS+'" stroke-width="3"/>'})}
 return g}
function hotCup(cx,base,o){o=o||{};let g='<path d="M'+(cx-46)+' '+base+' l7 -62 h78 l7 62z" fill="'+(o.cold?'#A9D4F2':'#F7B2A5')+'" stroke="'+(o.cold?'#1C6FA8':'#C0392B')+'" stroke-width="3"/>';
 if(!o.cold&&o.steam!==false)for(let k=0;k<3;k++)g+='<path d="M'+(cx-16+k*16)+' '+(base-66)+' q-5 -7 0 -14" stroke="#E2A3A3" stroke-width="2.5" fill="none"/>';
 if(!NAR&&o.tag!==false)g+=mini(cx,base+26,o.cold?'차가운 물':'뜨거운 물',15);
 return g}
function tankArt(o){o=o||{};const {x,y,w,h}=TK,b=y+h;let g='';
 g+='<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="4" fill="rgba(232,244,250,.4)"/>';
 if(o.water){const wy=b-h*.75;g+='<rect x="'+(x+4)+'" y="'+wy+'" width="'+(w-8)+'" height="'+(b-4-wy)+'" fill="'+WC+'" fill-opacity=".75"'+(o.rise?an('lb-a-rise',.15):'')+'/><path d="M'+(x+4)+' '+wy+' H'+(x+w-4)+'" stroke="'+WS+'" stroke-width="3"/>'}
 if(o.inner)g+=o.inner;
 g+='<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="4" fill="none" stroke="'+GLS+'" stroke-width="4"/><path d="M'+(x+14)+' '+(y+14)+' V'+(b-14)+'" stroke="#FFFFFF" stroke-width="5" opacity=".45" stroke-linecap="round"/>';
 return g}
/* 잉크: k 0 바닥에 놓임 · 1 컵 위에서 올라가는 중 · 2 윗부분에서 양옆으로 · 3 벽을 따라 내려옴 · 4 다시 가운데로 */
function inkArt(k,anim,col,cx){col=col||INK;const {x,y,w,h}=TK,b=y+h-6,wy=y+h*.25+12,L=x+30,R=x+w-30;cx=cx==null?x+w/2:cx;
 const P=(d,wd,op,a)=>'<path d="'+d+'" stroke="'+col+'" stroke-width="'+wd+'" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="'+op+'"'+(a?an('lb-a-fade',0,'animation-duration:1.5s'):'')+'/>';
 let g='<ellipse cx="'+cx+'" cy="'+(b-3)+'" rx="'+(k?10:16)+'" ry="6" fill="'+col+'" opacity="'+(k?.6:.95)+'"/>';
 if(k>=1)g+=P('M'+cx+' '+b+' C'+(cx-6)+' '+(b-50)+' '+(cx+6)+' '+(wy+60)+' '+cx+' '+(k===1?wy+40:wy),16,.55,anim&&k===1);
 if(k>=2)g+=P('M'+cx+' '+wy+' C'+(cx-60)+' '+(wy-4)+' '+(L+60)+' '+(wy+4)+' '+L+' '+(wy+10),12,.45,anim&&k===2)+P('M'+cx+' '+wy+' C'+(cx+60)+' '+(wy-4)+' '+(R-60)+' '+(wy+4)+' '+R+' '+(wy+10),12,.45,anim&&k===2);
 if(k>=3)g+=P('M'+L+' '+(wy+10)+' C'+(L-10)+' '+(wy+60)+' '+(L-6)+' '+(b-50)+' '+(L+4)+' '+(b-10),10,.35,anim&&k===3)+P('M'+R+' '+(wy+10)+' C'+(R+10)+' '+(wy+60)+' '+(R+6)+' '+(b-50)+' '+(R-4)+' '+(b-10),10,.35,anim&&k===3);
 if(k>=4)g+=P('M'+(L+4)+' '+(b-10)+' C'+(L+60)+' '+b+' '+(cx-70)+' '+b+' '+(cx-16)+' '+(b-6),8,.3,anim&&k===4)+P('M'+(R-4)+' '+(b-10)+' C'+(R-60)+' '+b+' '+(cx+70)+' '+b+' '+(cx+16)+' '+(b-6),8,.3,anim&&k===4);
 return g}
function dropperArt(x,y,o){o=o||{};return '<g transform="translate('+x+' '+y+')"><rect x="-12" y="-150" width="24" height="40" rx="10" fill="#E2573F" stroke="#8E2A22" stroke-width="2"/><path d="M-6 -112 H6 L3 0 L0 6 L-3 0Z" fill="rgba(232,244,250,.8)" stroke="#7F8C99" stroke-width="2"/>'+(o.ink?'<path d="M-4 -60 H4 L2 0 L0 4 L-2 0Z" fill="'+INK+'"/>':'')+'</g>'}

/* ── 실험 5: 아크릴 통과 붙임딱지 ── */
const AC={x:360,y:96,w:240,h:330};   /* 아크릴 통(바닥 = 탁자) */
/* k 0 처음 · 1 윗부분이 변함 · 2 아래쪽으로 내려감(이 실험관에서 정한 빠르기) */
function acrylArt(o){o=o||{};const {x,y,w,h}=AC,b=y+h;let g=shadow(x+w/2,b+4,w/2+10);
 g+='<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="6" fill="rgba(220,238,248,.35)"/>';
 if(o.candle)g+=candleArt(x+w/2,b,{lit:o.lit,litAnim:o.litAnim,h:70});
 if(o.sticker){const lx=x+30,rx=x+w-42,top=y+34,bot=y+230,cw=12,k=o.k||0,legF=k>=2?.6:0,fa=n=>o.anim&&k===n?an('lb-a-fade',0,'animation-duration:1.6s'):'';
  [lx,rx].forEach(px=>{g+='<rect x="'+px+'" y="'+top+'" width="'+cw+'" height="'+(bot-top)+'" fill="'+SCOLD+'"/>';if(legF)g+='<rect x="'+px+'" y="'+top+'" width="'+cw+'" height="'+((bot-top)*legF).toFixed(1)+'" fill="'+SHOT+'"'+fa(2)+'/>'});
  g+='<rect x="'+lx+'" y="'+top+'" width="'+(rx-lx+cw)+'" height="'+cw+'" fill="'+SCOLD+'"/>';if(k>=1)g+='<rect x="'+lx+'" y="'+top+'" width="'+(rx-lx+cw)+'" height="'+cw+'" fill="'+SHOT+'"'+fa(1)+'/>';
  /* 벽에 붙인 끝부분 */
  g+='<rect x="'+(x+5)+'" y="'+(bot-10)+'" width="'+(lx-x-5)+'" height="10" fill="'+SCOLD+'"/><rect x="'+(rx+cw)+'" y="'+(bot-10)+'" width="'+(x+w-5-rx-cw)+'" height="10" fill="'+SCOLD+'"/>'}
 g+='<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="6" fill="none" stroke="#7AA7BD" stroke-width="4"/><path d="M'+(x+12)+' '+(y+14)+' V'+(b-40)+'" stroke="#FFFFFF" stroke-width="4" opacity=".5" stroke-linecap="round"/>';
 for(let i=0;i<4;i++)g+='<circle cx="'+(x+30+i*60)+'" cy="'+(b-18)+'" r="8" fill="var(--w-wall)" stroke="#7AA7BD" stroke-width="2"/>';
 return g}

/* ── 실험 6: 검은색 판 ── */
function plateBlack(cx,y,lab,o){o=o||{};let g='<rect x="'+(cx-50)+'" y="'+y+'" width="100" height="70" rx="4" fill="#1D1D1D" stroke="#555" stroke-width="2.5"/>';
 g+='<path d="M'+cx+' '+(y+70)+' V'+(BY-6)+'" stroke="#8C6B44" stroke-width="7"/><rect x="'+(cx-36)+'" y="'+(BY-10)+'" width="72" height="12" rx="4" fill="#8C6B44"/>';
 if(lab)g+=mini(cx,y-18,lab,17);
 if(o.val)g+='<g'+an('lb-a-pop',0)+'>'+mini(cx,y+108,o.val+' °C',19)+'</g>';
 return g}
/* 운동장 장면: 건물 그림자(왼쪽) · 햇빛(오른쪽). sunX 햇빛이 닿는 경계 */
const SHX=600;   /* 건물 위 모서리(180,120)와 해(60,34)를 잇는 선이 땅에 닿는 곳 */
function yardBg(){let g=bgOut();g+=sunArt(60,34,26);
 g+='<rect x="-3000" y="120" width="3180" height="300" fill="#C9B9A6" stroke="#8A7A66" stroke-width="3"/>';for(let i=0;i<4;i++)g+='<rect x="'+(30+i*40)+'" y="'+(160+i%2*120)+'" width="26" height="40" fill="#9FB8C8" stroke="#7A8C98" stroke-width="2"/>';
 g+='<path d="M180 120 L'+SHX+' 420 L180 420Z" fill="#000" opacity=".1"/><path d="M180 420 L'+SHX+' 420 L'+(SHX+80)+' 3000 L-3000 3000 L-3000 420Z" fill="#000" opacity=".16"/>';
 g+='<path d="M60 34 L'+SHX+' 420 M60 34 L820 420" stroke="#E8A514" stroke-width="3" stroke-dasharray="8 8" opacity=".85"/>';
 if(!NAR){g+=mini(330,505,'그늘',18);g+=mini(780,505,'햇빛이 비치는 곳',18)}
 return g}
/* 열 전구 */
function lampArt(cx,y,on){let g='<path d="M'+(cx-10)+' 20 V'+(y-30)+'" stroke="#666" stroke-width="4"/><path d="M'+(cx-60)+' '+(y-30)+' h100 l-16 40 h-68z" fill="'+(on?'#FFB35C':'#D7D7D7')+'" stroke="#A0673A" stroke-width="3"/>';
 if(on)g+='<path d="M'+(cx-58)+' '+(y+10)+' L'+(cx-110)+' '+(BY-80)+' L'+(cx+90)+' '+(BY-80)+' L'+(cx+38)+' '+(y+10)+'Z" fill="#FFB35C" opacity=".22"/>';
 return g}

/* ───────── 준비물 카드 ───────── */
function itemArt(k){const sc=(sv,s,y,x)=>'<g transform="translate('+(x||0)+' '+(y||0)+') scale('+s+')">'+sv.replace(/<ellipse[^>]*fill="var\(--w-shadow\)"[^>]*\/>/g,'')+'</g>';
 const A={
  cupw:sc(cupArt(0,0,{col:WC,noShadow:1}),.62,46),
  cupj:sc(cupArt(0,0,{col:'#F5A35A',noShadow:1}),.62,46),
  probe:sc(probeTherm(0,0,{}),.6,-60),
  probe2:sc(probeTherm(-48,0,{})+probeTherm(48,0,{}),.5,-56),
  alc:sc(alcTherm(0,0,20),.24,-46),
  ir:sc(irGun(60,0,{}),.62,4,-20),
  tube:sc('<rect x="-60" y="-120" width="120" height="120" rx="8" fill="rgba(232,244,250,.5)" stroke="#7F8C99" stroke-width="4"/><rect x="-68" y="-132" width="136" height="16" rx="4" fill="#A0673A"/><ellipse cx="-30" cy="-124" rx="8" ry="4" fill="#3A2A1A"/><ellipse cx="30" cy="-124" rx="8" ry="4" fill="#3A2A1A"/>',.62,44),
  can:sc(canArt(0,0,{inTube:1}),.55,52),
  warm:sc(cupArt(0,0,{col:'#F7B2A5',noShadow:1})+'<path d="M-14 -110 q-6 -10 0 -20 M6 -110 q-6 -10 0 -20" stroke="#E2A3A3" stroke-width="3" fill="none"/>',.6,48),
  coldw:sc(cupArt(0,0,{col:'#A9D4F2',noShadow:1}),.6,48),
  hot:sc(cupArt(0,0,{col:'#F7B2A5',noShadow:1})+'<path d="M-14 -110 q-6 -10 0 -20 M6 -110 q-6 -10 0 -20" stroke="#E2A3A3" stroke-width="3" fill="none"/>',.6,48),
  water:sc(cupArt(0,0,{col:WC,noShadow:1}),.6,48),
  watch:'<g transform="scale(.6)">'+stopwatch(0,10,'00:00',1)+'</g>',
  gear:coat(-30,4,.5)+goggles(28,-24,.5)+hand(30,26,-60,.55,1),
  gear2:coat(-24,4,.5)+hand(30,0,-60,.55,1)+hand(34,28,-60,.55,1),
  sung:sunglasses(0,0,.85),
  plate:'<rect x="-80" y="-10" width="160" height="20" rx="2" fill="'+CU+'" stroke="'+CUS+'" stroke-width="2"/>',
  uplate:'<path d="M-60 -50 H60 V-26 H-36 V26 H60 V50 H-60Z" fill="'+CU+'" stroke="'+CUS+'" stroke-width="2"/>',
  tsticker:'<rect x="-70" y="-22" width="140" height="18" rx="2" fill="'+SCOLD+'"/><rect x="-70" y="8" width="140" height="18" rx="2" fill="'+SCOLD+'"/>',
  stand:'<rect x="-50" y="52" width="100" height="10" rx="3" fill="#555E66"/><rect x="-26" y="-60" width="10" height="114" fill="#7C8790"/><rect x="-20" y="-30" width="60" height="9" fill="#8E99A2"/><rect x="30" y="-40" width="20" height="28" rx="4" fill="#4A6FA5"/>',
  candle:sc(candleArt(0,0,{h:60}),1,48),
  lighter:lighterArt(10,0,-15),
  tank:'<rect x="-80" y="-48" width="160" height="96" rx="4" fill="rgba(232,244,250,.5)" stroke="#7AA7BD" stroke-width="4"/>',
  cups3:sc('<path d="M-110 0 l8 -60 h64 l8 60z" fill="rgba(232,244,250,.6)" stroke="#7F8C99" stroke-width="3"/><path d="M-30 0 l8 -60 h64 l8 60z" fill="rgba(232,244,250,.6)" stroke="#7F8C99" stroke-width="3"/><path d="M50 0 l8 -60 h64 l8 60z" fill="rgba(232,244,250,.6)" stroke="#7F8C99" stroke-width="3"/>',.8,30,-8),
  film:'<rect x="-70" y="-30" width="130" height="50" rx="2" fill="#EEF4F7" stroke="#9FB4C4" stroke-width="2" transform="rotate(-6)"/><rect x="-56" y="-14" width="130" height="50" rx="2" fill="#F6FAFC" stroke="#9FB4C4" stroke-width="2" transform="rotate(4)"/>',
  dropper:sc(dropperArt(0,0,{}),.8,60),
  ink:'<rect x="-28" y="-40" width="56" height="80" rx="10" fill="#3B2A55" stroke="#20142F" stroke-width="2"/><rect x="-16" y="-58" width="32" height="20" rx="4" fill="#20142F"/><rect x="-20" y="-14" width="40" height="30" rx="4" fill="#FFFFFF" opacity=".85"/><circle cx="0" cy="1" r="8" fill="'+INK+'"/>',
  acryl:'<rect x="-50" y="-66" width="100" height="132" rx="5" fill="rgba(220,238,248,.45)" stroke="#7AA7BD" stroke-width="4"/>'+[0,1,2].map(i=>'<circle cx="'+(-30+i*30)+'" cy="56" r="6" fill="var(--w-label)" stroke="#7AA7BD" stroke-width="2"/>').join(''),
  black2:'<rect x="-84" y="-40" width="80" height="60" rx="3" fill="#1D1D1D"/><rect x="6" y="-30" width="80" height="60" rx="3" fill="#1D1D1D"/>'};
 return A[k]||''}
