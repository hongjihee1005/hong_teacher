/* ───────── 그림: 실험대 장면 — 모두 직접 그린 SVG (물의 상태 변화) ───────── */
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
const WC='#8DC8E8',WS='#4E8FB8',ICE='#E6F3FA',ICES='#8AB4C8';
/* 창문과 해(실험 3: 햇볕이 잘 드는 곳) */
function windowArt(x){return '<g><rect x="'+x+'" y="40" width="260" height="250" rx="8" fill="var(--w-sky1)" stroke="var(--w-win)" stroke-width="10"/><path d="M'+(x+130)+' 40 V290 M'+x+' 165 H'+(x+260)+'" stroke="var(--w-win)" stroke-width="8"/>'+
 '<circle cx="'+(x+70)+'" cy="100" r="30" fill="#FFC93C"/><g stroke="#FFC93C" stroke-width="5" stroke-linecap="round">'+[0,1,2,3,4,5,6,7].map(i=>{const a=i*Math.PI/4;return '<path d="M'+(x+70+Math.cos(a)*40).toFixed(1)+' '+(100+Math.sin(a)*40).toFixed(1)+' L'+(x+70+Math.cos(a)*52).toFixed(1)+' '+(100+Math.sin(a)*52).toFixed(1)+'"/>'}).join('')+'</g></g>'}
/* 시계·초시계 표시 */
function clockArt(x,y,t,s){s=s||1;return '<g transform="translate('+x+' '+y+') scale('+s+')"><circle r="34" fill="#FFFFFF" stroke="#2A3342" stroke-width="5"/><path d="M0 0 V-22 M0 0 L15 8" stroke="#2A3342" stroke-width="4" stroke-linecap="round"/><circle r="3.5" fill="#2A3342"/>'+(t?'</g>'+mini(x,y+58*s,t,18):'</g>')}
function stopwatch(x,y,txt,on){return '<g transform="translate('+x+' '+y+')"><rect x="-8" y="-82" width="16" height="16" rx="3" fill="#7F8C99"/><circle r="70" fill="#F4F6F8" stroke="#3B4650" stroke-width="7"/><rect x="-54" y="-24" width="108" height="48" rx="8" fill="#16241B"/>'+
 '<text x="0" y="14" text-anchor="middle" font-size="32" font-weight="800" font-family="ui-monospace,Menlo,Consolas,monospace" fill="'+(on?'#8EF0B2':'#5E8A6E')+'">'+txt+'</text></g>'}

/* ───────── 실험 1: 위에서 본 얼음 수조와 페트리 접시 ───────── */
const TK={x:70,y:70,w:440,h:400},D1={cx:290,cy:270,r:112},D2={cx:730,cy:270,r:112};
function iceBed(){const T=TK;let g='<rect x="'+(T.x+8)+'" y="'+(T.y+10)+'" width="'+T.w+'" height="'+T.h+'" rx="22" fill="var(--w-shadow)"/><rect x="'+T.x+'" y="'+T.y+'" width="'+T.w+'" height="'+T.h+'" rx="22" fill="#CFE2EB" stroke="#6E9FB5" stroke-width="7"/>';
 for(let i=0;i<78;i++){const cx=T.x+24+rnd(i,1)*(T.w-48),cy=T.y+24+rnd(i,2)*(T.h-48),s=14+rnd(i,3)*20,n=5;let p='';
  for(let k=0;k<n;k++){const a=k*2*Math.PI/n+rnd(i,4),rr=s*(.7+rnd(i*7+k,5)*.4);p+=(k?'L':'M')+(cx+Math.cos(a)*rr).toFixed(1)+' '+(cy+Math.sin(a)*rr).toFixed(1)}
  g+='<path d="'+p+'Z" fill="'+(i%3?'#F2F8FB':'#DDEBF2')+'" stroke="#9CC0D2" stroke-width="1.5"/>'}
 for(let i=0;i<150;i++)g+='<circle cx="'+(T.x+16+rnd(i,8)*(T.w-32)).toFixed(1)+'" cy="'+(T.y+16+rnd(i,9)*(T.h-32)).toFixed(1)+'" r="1.8" fill="#FFFFFF" stroke="#AFBCC5" stroke-width=".7"/>';
 return g}
/* 접시(위에서 봄). water: 물 반지름 비율, freeze: 언 정도, drops: 뿌린 물 남은 정도, lid: 뚜껑과 테이프 */
function dishTop(cx,cy,r,o){o=o||{};let g='<circle cx="'+(cx+5)+'" cy="'+(cy+7)+'" r="'+r+'" fill="var(--w-shadow)"/><circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="rgba(236,246,251,.75)" stroke="#7F9BAB" stroke-width="4"/><circle cx="'+cx+'" cy="'+cy+'" r="'+(r-9)+'" fill="none" stroke="#A9C2CF" stroke-width="1.5"/>';
 const R=r-12;
 if(o.freeze!=null){const f=o.freeze;g+='<circle cx="'+cx+'" cy="'+cy+'" r="'+R+'" fill="'+WC+'" fill-opacity=".8"/>';
  if(f>0){g+='<circle cx="'+cx+'" cy="'+cy+'" r="'+R+'" fill="'+ICE+'"/>';
   for(let i=0;i<26;i++){const a=i*2*Math.PI/26+rnd(i,3)*.2,r1=R*(f<1?1-f:.25+rnd(i,6)*.4),r2=R-2;g+='<path d="M'+(cx+Math.cos(a)*r1).toFixed(1)+' '+(cy+Math.sin(a)*r1).toFixed(1)+' L'+(cx+Math.cos(a)*r2).toFixed(1)+' '+(cy+Math.sin(a)*r2).toFixed(1)+'" stroke="#B9D5E3" stroke-width="2"/>'}
   if(f<1)g+='<circle cx="'+cx+'" cy="'+cy+'" r="'+(R*(1-f)).toFixed(1)+'" fill="'+WC+'" stroke="#C7DEEA" stroke-width="3"/>';
   else for(let i=0;i<14;i++)g+='<circle cx="'+(cx-R*.6+rnd(i,11)*R*1.2).toFixed(1)+'" cy="'+(cy-R*.6+rnd(i,12)*R*1.2).toFixed(1)+'" r="'+(2+rnd(i,13)*3).toFixed(1)+'" fill="#FFFFFF"/>'}
  else g+='<path d="M'+(cx-R*.5)+' '+(cy-R*.55)+' q'+(R*.3)+' -'+(R*.18)+' '+(R*.6)+' 0" stroke="#FFFFFF" stroke-width="5" fill="none" opacity=".7" stroke-linecap="round"/>'}
 if(o.drops!=null)g+=sprayDrops(cx,cy,R,o.drops,o.dropAnim);
 if(o.lid){g+='<circle cx="'+cx+'" cy="'+cy+'" r="'+(r+5)+'" fill="rgba(255,255,255,.12)" stroke="#6F8FA0" stroke-width="3"/>';
  [[-1,0],[1,0]].forEach(([sx])=>{g+='<rect x="'+(cx+sx*(r-6)-14)+'" y="'+(cy-26)+'" width="28" height="52" rx="3" fill="#F5E7A8" fill-opacity=".8" stroke="#C9B05A" stroke-width="1.5"/>'})}
 return g}
function sprayDrops(cx,cy,R,k,anim){let g='';const n=k>.9?38:k>.4?30:7;
 for(let i=0;i<n;i++){const a=rnd(i,21)*2*Math.PI,d=Math.sqrt(rnd(i,22))*(R-10),x=cx+Math.cos(a)*d,y=cy+Math.sin(a)*d,rr=(k>.1?(3+rnd(i,23)*4.5)*k:1.4);
  g+='<g'+(anim?an('lb-a-pop',.2+rnd(i,24)*.5):'')+'><circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="'+rr.toFixed(1)+'" fill="'+WC+'" stroke="'+WS+'" stroke-width="1"/>'+(rr>2.4?'<circle cx="'+(x-rr*.3).toFixed(1)+'" cy="'+(y-rr*.35).toFixed(1)+'" r="'+(rr*.3).toFixed(1)+'" fill="#FFFFFF"/>':'')+'</g>'}
 return g}
function sprayer(x,y,s,anim){return '<g transform="translate('+x+' '+y+') scale('+(s||1)+')"'+(anim?'':'')+'><rect x="-34" y="-10" width="68" height="110" rx="14" fill="#E8F4FA" stroke="#5F8FA0" stroke-width="3"/><rect x="-30" y="40" width="60" height="56" rx="10" fill="'+WC+'" fill-opacity=".7"/><rect x="-16" y="-34" width="32" height="26" rx="5" fill="#2F68B0"/><path d="M-16 -28 H-46 V-20 H-16" fill="#2F68B0"/><path d="M14 -26 q22 6 18 30" stroke="#2F68B0" stroke-width="6" fill="none" stroke-linecap="round"/></g>'}
function mist(x,y,anim){let g='';for(let i=0;i<22;i++){const a=Math.PI*(.8+rnd(i,31)*.45),d=20+rnd(i,32)*90;g+='<circle cx="'+(x+Math.cos(a)*d).toFixed(1)+'" cy="'+(y+Math.sin(a)*d*.6+d*.3).toFixed(1)+'" r="'+(1.5+rnd(i,33)*2).toFixed(1)+'" fill="'+WC+'"'+(anim?an('lb-a-fade',rnd(i,34)*.4):'')+'/>'}return g}

/* ───────── 실험 2: 플라스틱병(옆에서 봄) ───────── */
const BT={w:118,body:198,neck:236};
const LV={water:100,ice:112};   /* 물 높이와 얼음 높이(이 실험관에서 정한 모양) */
/* o: fill 'water'|'ice'|null, lines {k:[색,높이]}, wet(겉에 물기), nocap, rise(물 차오름 움직임) */
function bottle(cx,base,o){o=o||{};const w=BT.w/2;let g=shadow(cx,base+4,w+8);
 const out='M'+(cx-w)+' '+(base-10)+' Q'+(cx-w)+' '+base+' '+(cx-w+10)+' '+base+' H'+(cx+w-10)+' Q'+(cx+w)+' '+base+' '+(cx+w)+' '+(base-10)+' V'+(base-BT.body)+' Q'+(cx+w)+' '+(base-BT.body-28)+' '+(cx+20)+' '+(base-BT.neck+12)+' V'+(base-BT.neck)+' H'+(cx-20)+' V'+(base-BT.neck+12)+' Q'+(cx-w)+' '+(base-BT.body-28)+' '+(cx-w)+' '+(base-BT.body)+' Z';
 g+='<path d="'+out+'" fill="rgba(232,244,250,.55)"/>';
 if(o.fill==='water'){const h=LV.water;g+='<g'+(o.rise?an('lb-a-rise',.2):'')+'><path d="M'+(cx-w+4)+' '+(base-h)+' H'+(cx+w-4)+' V'+(base-12)+' Q'+(cx+w-4)+' '+(base-4)+' '+(cx+w-12)+' '+(base-4)+' H'+(cx-w+12)+' Q'+(cx-w+4)+' '+(base-4)+' '+(cx-w+4)+' '+(base-12)+'Z" fill="'+WC+'" fill-opacity=".85"/><path d="M'+(cx-w+4)+' '+(base-h)+' H'+(cx+w-4)+'" stroke="'+WS+'" stroke-width="3"/></g>'}
 if(o.fill==='ice'){const h=LV.ice;g+='<path d="M'+(cx-w+4)+' '+(base-h+4)+' Q'+cx+' '+(base-h-6)+' '+(cx+w-4)+' '+(base-h+4)+' V'+(base-12)+' Q'+(cx+w-4)+' '+(base-4)+' '+(cx+w-12)+' '+(base-4)+' H'+(cx-w+12)+' Q'+(cx-w+4)+' '+(base-4)+' '+(cx-w+4)+' '+(base-12)+'Z" fill="'+ICE+'" stroke="'+ICES+'" stroke-width="2.5"/>';
  g+='<path d="M'+(cx-30)+' '+(base-80)+' l14 18 l-6 16 M'+(cx+18)+' '+(base-60)+' l-10 20 l12 14 M'+(cx-6)+' '+(base-30)+' l18 -8" stroke="#BCD6E3" stroke-width="2.5" fill="none"/>';
  for(let i=0;i<9;i++)g+='<circle cx="'+(cx-w+16+rnd(i,41)*(BT.w-32)).toFixed(1)+'" cy="'+(base-14-rnd(i,42)*(h-30)).toFixed(1)+'" r="'+(1.8+rnd(i,43)*2.4).toFixed(1)+'" fill="#FFFFFF"/>'}
 g+='<path d="'+out+'" fill="none" stroke="#6F8FA0" stroke-width="3.5" stroke-linejoin="round"/><path d="M'+(cx-w+12)+' '+(base-BT.body+8)+' V'+(base-24)+'" stroke="#FFFFFF" stroke-width="5" opacity=".6" stroke-linecap="round"/>';
 if(!o.nocap)g+='<rect x="'+(cx-24)+'" y="'+(base-BT.neck-22)+'" width="48" height="26" rx="4" fill="#2F68B0" stroke="#1D4A80" stroke-width="2"/>';
 if(o.lines){const L=o.lines;['k','r','b'].forEach(k=>{if(!L[k])return;const y=base-L[k][1],c=L[k][0];
  g+='<path d="M'+(cx-w-8)+' '+y+' H'+(cx+w+8)+'" stroke="'+c+'" stroke-width="'+(k==='b'?5:4.5)+'" stroke-linecap="round"'+(k==='b'&&L.k&&L.k[1]===L.b[1]?' stroke-dasharray="14 10"':'')+(L.anim===k?an('lb-a-fade',.5):'')+'/>'})}
 if(o.wet)for(let i=0;i<34;i++){const x=cx-w+6+rnd(i,51)*(BT.w-12),y=base-14-rnd(i,52)*(BT.body-30);g+='<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="'+(1.6+rnd(i,53)*2.2).toFixed(1)+'" fill="#FFFFFF" stroke="#9CC0D2" stroke-width=".8"'+(o.wet==='anim'?an('lb-a-fade',rnd(i,54)*.6):'')+'/>'}
 return g}
const LCOL={k:'#1F2328',r:'#D2312A',b:'#1F5FC4'};
function pen(x,y,col,rot){return '<g transform="translate('+x+' '+y+') rotate('+(rot==null?-30:rot)+')"><rect x="-9" y="-96" width="18" height="84" rx="5" fill="'+col+'"/><rect x="-9" y="-96" width="18" height="24" rx="5" fill="#E9ECEF" stroke="'+col+'" stroke-width="2"/><path d="M-7 -12 L0 6 L7 -12Z" fill="'+col+'"/></g>'}
function towel(x,y,anim){return '<g'+(anim?an('lb-a-rub',0):'')+'><g transform="translate('+x+' '+y+')"><rect x="-56" y="-44" width="112" height="88" rx="12" fill="#F6C76A" stroke="#B98A2E" stroke-width="3"/><path d="M-56 22 H56 M-56 30 H56" stroke="#E0506B" stroke-width="4"/></g></g>'}
/* 큰 비커: ice(소금을 섞은 얼음) | warm(따뜻한 물), inner = 비커 안에 넣은 것 */
function bigBeaker(cx,base,o){o=o||{};const w=150,h=250;let g=shadow(cx,base+4,w+10);
 g+='<path d="M'+(cx-w)+' '+(base-h)+' V'+(base-10)+' Q'+(cx-w)+' '+base+' '+(cx-w+10)+' '+base+' H'+(cx+w-10)+' Q'+(cx+w)+' '+base+' '+(cx+w)+' '+(base-10)+' V'+(base-h)+'" fill="rgba(232,244,250,.45)"/>';
 if(o.warm)g+='<rect x="'+(cx-w+4)+'" y="'+(base-170)+'" width="'+(2*w-8)+'" height="166" rx="8" fill="#BFE0F2" fill-opacity=".85"/>';
 if(o.inner)g+=o.inner;
 if(o.ice){for(let i=0;i<46;i++){const x=cx-w+20+rnd(i,61)*(2*w-40),y=base-14-rnd(i,62)*(h-40),s=14+rnd(i,63)*14;g+='<rect x="'+(x-s/2).toFixed(1)+'" y="'+(y-s/2).toFixed(1)+'" width="'+s.toFixed(1)+'" height="'+s.toFixed(1)+'" rx="4" transform="rotate('+(rnd(i,64)*40-20).toFixed(0)+' '+x.toFixed(1)+' '+y.toFixed(1)+')" fill="'+(i%3?'#EEF7FB':'#DCEBF3')+'" fill-opacity=".93" stroke="#9CC0D2" stroke-width="1.5"/>'}
  for(let i=0;i<90;i++)g+='<circle cx="'+(cx-w+10+rnd(i,65)*(2*w-20)).toFixed(1)+'" cy="'+(base-8-rnd(i,66)*(h-30)).toFixed(1)+'" r="1.7" fill="#FFFFFF" stroke="#AFBCC5" stroke-width=".7"/>'}
 if(o.warm){g+='<rect x="'+(cx-w+4)+'" y="'+(base-170)+'" width="'+(2*w-8)+'" height="166" rx="8" fill="#BFE0F2" fill-opacity=".35"/><path d="M'+(cx-w+4)+' '+(base-170)+' H'+(cx+w-4)+'" stroke="'+WS+'" stroke-width="3"/>';
  [-60,0,60].forEach((d,i)=>{g+='<path d="M'+(cx+d)+' '+(base-h-8)+' q-10 -16 0 -32 t0 -32" fill="none" stroke="#E5A06B" stroke-width="4" stroke-linecap="round" opacity=".8"/>'})}
 g+='<path d="M'+(cx-w)+' '+(base-h)+' V'+(base-10)+' Q'+(cx-w)+' '+base+' '+(cx-w+10)+' '+base+' H'+(cx+w-10)+' Q'+(cx+w)+' '+base+' '+(cx+w)+' '+(base-10)+' V'+(base-h)+'" fill="none" stroke="var(--w-glass-s)" stroke-width="4"/><path d="M'+(cx-w-10)+' '+(base-h)+' h14" stroke="var(--w-glass-s)" stroke-width="4"/>';
 return g}
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

/* ───────── 실험 3: 물로 쓰는 종이(위에서 봄)와 비커(옆에서 봄) ───────── */
const WP={x:150,y:70,w:660,h:400};
const PAINT_THICK=['M300 270 m-110 0 a110 110 0 1 0 220 0 a110 110 0 1 0 -220 0','M640 330 C560 270 540 200 590 180 C620 168 640 190 640 210 C640 190 660 168 690 180 C740 200 720 270 640 330Z'];
const PAINT_THIN=['M262 240 v18','M338 240 v18','M250 300 q50 46 100 0','M470 120 l10 20 l22 3 l-16 15 l4 22 l-20 -11 l-20 11 l4 -22 l-16 -15 l22 -3Z'];
function wpaperArt(o){o=o||{};const P=WP,k=o.k==null?0:o.k;let g='<rect x="'+(P.x+8)+'" y="'+(P.y+10)+'" width="'+P.w+'" height="'+P.h+'" rx="10" fill="var(--w-shadow)"/><rect x="'+P.x+'" y="'+P.y+'" width="'+P.w+'" height="'+P.h+'" rx="10" fill="#C3CDD2" stroke="#8C9AA2" stroke-width="3"/>';
 for(let i=0;i<10;i++)g+='<path d="M'+(P.x+20)+' '+(P.y+30+i*38)+' H'+(P.x+P.w-20)+'" stroke="#B5C0C6" stroke-width="1.2"/>';
 if(k>0){const st=(d,wd,op,j)=>'<path d="'+d+'" fill="none" stroke="#2F3D46" stroke-width="'+wd+'" stroke-linecap="round" stroke-linejoin="round" opacity="'+op+'"'+(o.draw?' pathLength="1" stroke-dasharray="1"'+an('lb-a-draw',j*.35):'')+'/>';
  PAINT_THICK.forEach((d,j)=>{g+=st(d,22,k,j)});const kt=k>=.9?k:0;if(kt>0)PAINT_THIN.forEach((d,j)=>{g+=st(d,9,kt,j+2)})}
 return g}
function brushArt(x,y,rot){return '<g transform="translate('+x+' '+y+') rotate('+(rot||35)+')"><rect x="-6" y="-160" width="12" height="120" rx="5" fill="#C98B4E" stroke="#8A5A2B" stroke-width="2"/><rect x="-8" y="-44" width="16" height="22" fill="#B9C2CA" stroke="#7F8C99" stroke-width="2"/><path d="M-8 -22 Q-10 4 0 14 Q10 4 8 -22Z" fill="#3B2A20"/></g>'}
/* 비커(250 mL, 옆에서 봄). lvl 물 높이, marks [[높이,색,이름]], sticker */
const BK={w:150,h:200};
function beaker2(cx,base,o){o=o||{};const w=BK.w/2,h=BK.h,lv=o.lvl||0;let g=shadow(cx,base+4,w+8);
 const out='M'+(cx-w)+' '+(base-h)+' V'+(base-10)+' Q'+(cx-w)+' '+base+' '+(cx-w+10)+' '+base+' H'+(cx+w-10)+' Q'+(cx+w)+' '+base+' '+(cx+w)+' '+(base-10)+' V'+(base-h);
 g+='<path d="'+out+'" fill="rgba(232,244,250,.5)"/>';
 if(lv>0)g+='<g'+(o.rise?an('lb-a-rise',.2):'')+'><path d="M'+(cx-w+3)+' '+(base-lv)+' H'+(cx+w-3)+' V'+(base-10)+' Q'+(cx+w-3)+' '+(base-3)+' '+(cx+w-10)+' '+(base-3)+' H'+(cx-w+10)+' Q'+(cx-w+3)+' '+(base-3)+' '+(cx-w+3)+' '+(base-10)+'Z" fill="'+WC+'" fill-opacity=".8"/>'+(o.wavy?'':'<path d="M'+(cx-w+3)+' '+(base-lv)+' H'+(cx+w-3)+'" stroke="'+WS+'" stroke-width="3"/>')+'</g>';
 if(o.inner)g+=o.inner;
 g+='<path d="'+out+'" fill="none" stroke="var(--w-glass-s)" stroke-width="3.5"/><path d="M'+(cx-w-9)+' '+(base-h)+' h12" stroke="var(--w-glass-s)" stroke-width="3.5"/>';
 for(let i=1;i<=4;i++)g+='<path d="M'+(cx+w-26)+' '+(base-i*38)+' h18" stroke="var(--w-glass-s)" stroke-width="2"/>';
 if(o.sticker)g+='<g'+(o.sticker==='anim'?an('lb-a-pop',.3):'')+'><rect x="'+(cx-32)+'" y="'+(base-h+18)+'" width="64" height="30" rx="4" fill="#FFF4C2" stroke="#B9A04A" stroke-width="2"/><path d="M'+(cx-22)+' '+(base-h+33)+' h44" stroke="#8A7A3A" stroke-width="3"/></g>';
 (o.marks||[]).forEach((m,i)=>{const y=base-m[0];g+='<path d="M'+(cx-w-6)+' '+y+' H'+(cx-w+30)+'" stroke="'+m[1]+'" stroke-width="5" stroke-linecap="round"'+(m[3]?an('lb-a-fade',.3):'')+'/>'+(m[2]?mini(cx-w-44,y+5,m[2],15):'')});
 return g}
const DCOL={o:'#1F2328',d0:'#1E8A4C',d1:'#D2312A',d2:'#1F5FC4',d3:'#7A3FB0'};
const BX3={cx:560,lv:100};

/* ───────── 실험 4: 핫플레이트·내열 비커 ───────── */
const HP={x:430,y:372};
function hotplate(on){return '<g><rect x="'+(HP.x-200)+'" y="'+HP.y+'" width="400" height="22" rx="6" fill="'+(on?'#5A3A33':'#4A4F57')+'" stroke="#2C3036" stroke-width="2.5"/><rect x="'+(HP.x-220)+'" y="'+(HP.y+20)+'" width="440" height="44" rx="10" fill="#D8DDE3" stroke="#7F8C99" stroke-width="2.5"/>'+
 '<circle cx="'+(HP.x+170)+'" cy="'+(HP.y+42)+'" r="13" fill="#F4F6F8" stroke="#7F8C99" stroke-width="2.5"/><path d="M'+(HP.x+170)+' '+(HP.y+42)+' L'+(HP.x+170+(on?9:0))+' '+(HP.y+42-(on?9:13))+'" stroke="#2A3138" stroke-width="3" stroke-linecap="round"/>'+
 '<circle cx="'+(HP.x-180)+'" cy="'+(HP.y+42)+'" r="8" fill="'+(on?'#E5483B':'#9AA3AD')+'"/>'+(NAR?'':'<text x="'+(HP.x-162)+'" y="'+(HP.y+48)+'" font-size="15" font-weight="800" fill="#2A3138">'+(on?'켜짐':'꺼짐')+'</text>')+
 (on?'<path d="M'+(HP.x-180)+' '+(HP.y+2)+' H'+(HP.x+180)+'" stroke="#E5734B" stroke-width="3" opacity=".7"/>':'')+'</g>'}
/* 분에 따른 물속 모습(이 실험관에서 정한 모양: 4분 작은 기포, 7분부터 끓음) */
function boilInner(cx,base,lv,m){const w=BK.w/2;let g='';if(m<MODEL.bubble)return g;
 const boil=m>=MODEL.boil,n=boil?22:(m-MODEL.bubble+1)*4;
 for(let i=0;i<n;i++){const x=cx-w+14+rnd(i,71)*(BK.w-28);
  if(!boil){const y=base-8-rnd(i,72)*(i%3?10:lv*.5);g+='<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="'+(2+rnd(i,73)*1.6).toFixed(1)+'" fill="#FFFFFF" fill-opacity=".85" stroke="#6FA4C4" stroke-width="1"/>'}
  else{const r=3+rnd(i,74)*7;g+='<circle class="lb-bub" style="--h:-'+(lv-16).toFixed(0)+'px;animation-delay:-'+(rnd(i,75)*1.4).toFixed(2)+'s" cx="'+x.toFixed(1)+'" cy="'+(base-10).toFixed(1)+'" r="'+r.toFixed(1)+'" fill="#FFFFFF" fill-opacity=".8" stroke="#6FA4C4" stroke-width="1.2"/>'}}
 if(boil){let p='M'+(cx-w+3)+' '+(base-lv);for(let x=cx-w+3;x<cx+w-3;x+=14)p+=' q7 '+(x%28?-9:9)+' 14 0';g+='<path d="'+p+'" fill="none" stroke="'+WS+'" stroke-width="3"/>';
  for(let i=0;i<5;i++)g+='<circle cx="'+(cx-w+24+rnd(i,76)*(BK.w-48)).toFixed(1)+'" cy="'+(base-lv-6).toFixed(1)+'" r="'+(4+rnd(i,77)*4).toFixed(1)+'" fill="none" stroke="#6FA4C4" stroke-width="1.5"/>'}
 return g}
function heatBeaker(lv,m,o){o=o||{};const cx=HP.x,base=HP.y;return beaker2(cx,base,{lvl:lv,wavy:m>=MODEL.boil,inner:boilInner(cx,base,lv,m),marks:o.mark?[[100,LCOL.b,'',o.markAnim]]:[]})}
const LV4={start:100,after:84};

/* ───────── 실험 5: 얼음이 가득 든 비커 ───────── */
function icecup(cx,base,o){o=o||{};const w=80,h=200;let g='';
 const out='M'+(cx-w)+' '+(base-h)+' V'+(base-10)+' Q'+(cx-w)+' '+base+' '+(cx-w+10)+' '+base+' H'+(cx+w-10)+' Q'+(cx+w)+' '+base+' '+(cx+w)+' '+(base-10)+' V'+(base-h);
 g+='<path d="'+out+'" fill="rgba(232,244,250,.5)"/>';
 for(let j=0;j<5;j++)for(let i=0;i<3;i++){const x=cx-w+14+i*46+(j%2)*10,y=base-46-j*36,s=36;g+='<rect x="'+x+'" y="'+y+'" width="'+s+'" height="'+s+'" rx="7" transform="rotate('+((i+j)%3*8-8)+' '+(x+s/2)+' '+(y+s/2)+')" fill="'+ICE+'" stroke="'+ICES+'" stroke-width="2"/>'}
 g+='<path d="'+out+'" fill="none" stroke="var(--w-glass-s)" stroke-width="3.5"/>';
 if(o.wrap){g+='<path d="M'+(cx-w-6)+' '+(base-h+16)+' V'+(base-h-2)+' Q'+cx+' '+(base-h-22)+' '+(cx+w+6)+' '+(base-h-2)+' V'+(base-h+16)+'" fill="rgba(240,248,252,.55)" stroke="#A9C2CF" stroke-width="2"'+(o.wrap==='anim'?an('lb-a-down',0,'--from:-60px'):'')+'/>'+
  '<path d="M'+(cx-w-6)+' '+(base-h+10)+' H'+(cx+w+6)+'" stroke="#C0392B" stroke-width="5"'+(o.wrap==='anim'?an('lb-a-fade',1):'')+'/>'}
 const d=o.dew||0;if(d){const n=[0,40,62,74][d],sz=[0,1.8,3.3,4.6][d];
  for(let i=0;i<n;i++){const side=i%2?1:-1,x=cx+side*(w+2)-side*rnd(i,81)*(2*w-6)*.5,y=base-14-rnd(i,82)*(h-34),r=sz*(.6+rnd(i,83)*.7);
   g+='<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="'+r.toFixed(1)+'" fill="'+WC+'" fill-opacity=".9" stroke="'+WS+'" stroke-width="1"'+(o.dewAnim?an('lb-a-pop',rnd(i,84)*.8):'')+'/>'}
  if(d>=3)[-1,1,-1,1,-1].forEach((s,i)=>{const x=cx+s*(w-12-i*9);g+='<path d="M'+x+' '+(base-90+i*12)+' V'+(base-4)+'" stroke="'+WC+'" stroke-width="5" stroke-linecap="round" opacity=".9"/>'})}
 return g}
function pdish(cx,base,pool){let g='<ellipse cx="'+cx+'" cy="'+(base-4)+'" rx="120" ry="14" fill="rgba(232,244,250,.7)" stroke="#7F9BAB" stroke-width="3"/>';
 if(pool)g+='<ellipse cx="'+cx+'" cy="'+(base-6)+'" rx="104" ry="9" fill="'+WC+'" fill-opacity=".85"/>';return g}
function cupOnDish(cx,base,o){o=o||{};return pdish(cx,base,o.pool)+icecup(cx,base-8,o)}

/* ───────── 실험복·보안경·장갑 ───────── */
function coat(x,y,s){return '<g transform="translate('+x+' '+y+') scale('+(s||1)+')"><path d="M-46 -64 L-18 -72 L0 -40 L18 -72 L46 -64 L62 30 L40 34 L36 -10 L34 72 H-34 L-36 -10 L-40 34 L-62 30Z" fill="#FFFFFF" stroke="#9AA6B2" stroke-width="3" stroke-linejoin="round"/><path d="M0 -40 V72" stroke="#9AA6B2" stroke-width="2"/><circle cx="-7" cy="-6" r="3" fill="#9AA6B2"/><circle cx="-7" cy="22" r="3" fill="#9AA6B2"/><rect x="12" y="10" width="16" height="12" rx="2" fill="none" stroke="#9AA6B2" stroke-width="2"/></g>'}
function goggles(x,y,s){return '<g transform="translate('+x+' '+y+') scale('+(s||1)+')"><rect x="-58" y="-18" width="52" height="36" rx="15" fill="rgba(200,230,245,.6)" stroke="#2F68B0" stroke-width="4"/><rect x="6" y="-18" width="52" height="36" rx="15" fill="rgba(200,230,245,.6)" stroke="#2F68B0" stroke-width="4"/><path d="M-6 -2 h12" stroke="#2F68B0" stroke-width="5"/></g>'}
function gearArt(on,anim,cotton){const gl=cotton?'#F4F1EA':'#FFFFFF';
 if(!on)return coat(300,250,1.4)+goggles(520,200,1.1)+'<g transform="translate(700 270) scale(1.3)">'+hand(-14,-10,-60,.75,1).replace(/#FFFFFF/g,gl)+hand(22,8,-60,.75,1).replace(/#FFFFFF/g,gl)+'</g>'+qmark(480,90);
 return '<g'+(anim?an('lb-a-up',0,'--from:100px'):'')+'><circle cx="480" cy="116" r="38" fill="#F2C6A0" stroke="#B9875F" stroke-width="3"/>'+goggles(480,108,.82)+coat(480,262,1.75)+hand(330,240,-70,1.4,1).replace(/#FFFFFF/g,gl)+hand(630,240,-110,1.4,1).replace(/#FFFFFF/g,gl)+'</g>'}

/* ───────── 준비물 카드 ───────── */
function itemArt(k){const A={
  dish:dishTop(-28,0,30,{})+dishTop(30,6,30,{}),
  water:'<g transform="translate(0 6) scale(.62)">'+beaker2(0,60,{lvl:70}).replace(/<ellipse[^>]*\/>/,'')+'</g>',
  icetank:'<rect x="-58" y="-36" width="116" height="74" rx="10" fill="#CFE2EB" stroke="#6E9FB5" stroke-width="4"/>'+[0,1,2,3,4,5,6,7].map(i=>'<rect x="'+(-50+(i%4)*26)+'" y="'+(-28+Math.floor(i/4)*30)+'" width="20" height="20" rx="4" fill="#F2F8FB" stroke="#9CC0D2" stroke-width="1.5"/>').join(''),
  tape:'<circle r="30" fill="#F5E7A8" stroke="#C9B05A" stroke-width="3"/><circle r="15" fill="var(--w-label)" stroke="#C9B05A" stroke-width="2"/>',
  spoon:'<g transform="rotate(-30)"><rect x="-4" y="-46" width="8" height="70" rx="3" fill="#B9C2CA" stroke="#7F8C99" stroke-width="2"/><ellipse cx="0" cy="34" rx="13" ry="17" fill="#DCE3E8" stroke="#7F8C99" stroke-width="2"/></g>',
  spray:sprayer(0,-28,.62),
  clock:clockArt(0,-4,'',1.1),
  gear:coat(-30,4,.5)+goggles(28,-24,.5)+hand(30,26,-60,.55,1),
  gear2:coat(-30,4,.5)+goggles(28,-24,.5)+hand(30,26,-60,.55,1).replace(/#FFFFFF/g,'#F4F1EA'),
  bottle:'<g transform="translate(0 52) scale(.42)">'+bottle(0,0,{}).replace(/<ellipse[^>]*\/>/,'')+'</g>',
  pens:pen(-26,40,LCOL.k,-12)+pen(2,40,LCOL.r,0)+pen(30,40,LCOL.b,12),
  scale:'<g transform="translate(-50 -96) scale(.32)">'+escale(160,{}).replace(/<ellipse[^>]*\/>/,'')+'</g>',
  towel:towel(0,0),
  icebk:'<g transform="translate(0 52) scale(.3)">'+bigBeaker(0,0,{ice:1}).replace(/<ellipse[^>]*\/>/,'')+'</g>',
  warm:'<g transform="translate(0 52) scale(.3)">'+bigBeaker(0,0,{warm:1}).replace(/<ellipse[^>]*\/>/,'')+'</g>',
  wpaper:'<rect x="-56" y="-38" width="112" height="76" rx="5" fill="#C3CDD2" stroke="#8C9AA2" stroke-width="2.5"/><path d="M-30 6 q30 -40 60 0" stroke="#2F3D46" stroke-width="7" fill="none" stroke-linecap="round"/>',
  brush:brushArt(10,40,30),
  beaker:'<g transform="translate(0 50) scale(.48)">'+beaker2(0,0,{lvl:96}).replace(/<ellipse[^>]*\/>/,'')+'</g>',
  hbeaker:'<g transform="translate(0 50) scale(.48)">'+beaker2(0,0,{lvl:96}).replace(/<ellipse[^>]*\/>/,'')+'</g>',
  pen:pen(0,40,LCOL.k,-20),bpen:pen(0,40,LCOL.b,-20),
  sticker:'<rect x="-46" y="-30" width="92" height="60" rx="5" fill="#FFFFFF" stroke="#B9C2CA" stroke-width="2"/>'+[0,1].map(i=>'<rect x="-36" y="'+(-22+i*26)+'" width="72" height="20" rx="3" fill="#FFF4C2" stroke="#B9A04A" stroke-width="1.5"/>').join(''),
  hot:'<g transform="translate(-146 -136) scale(.34)">'+hotplate(false).replace(/<text[^>]*>[^<]*<\/text>/,'')+'</g>',
  timer:'<g transform="scale(.6)">'+stopwatch(0,0,'0:00',true)+'</g>',
  icecup:'<g transform="translate(0 54) scale(.46)">'+icecup(0,0,{})+'</g>',
  wrap:'<path d="M-50 -30 H50 V30 H-50Z" fill="rgba(240,248,252,.7)" stroke="#A9C2CF" stroke-width="3"/><path d="M-40 -20 l20 12 M10 -18 l26 14" stroke="#FFFFFF" stroke-width="3"/>',
  band:'<ellipse rx="40" ry="26" fill="none" stroke="#C0392B" stroke-width="6"/>',
  pdish:'<ellipse cx="0" cy="10" rx="56" ry="14" fill="rgba(232,244,250,.8)" stroke="#7F9BAB" stroke-width="3"/>'};
 return A[k]||''}
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
