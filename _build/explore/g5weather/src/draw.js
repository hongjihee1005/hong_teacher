/* ───────── 그림: 실험대 장면 — 모두 직접 그린 SVG (날씨와 우리 생활) ───────── */
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
const WC='#8DC8E8',WS='#4E8FB8';
/* 창문과 해(실험 3: 햇볕이 잘 드는 곳) */
function windowArt(x){return '<g><rect x="'+x+'" y="40" width="260" height="250" rx="8" fill="var(--w-sky1)" stroke="var(--w-win)" stroke-width="10"/><path d="M'+(x+130)+' 40 V290 M'+x+' 165 H'+(x+260)+'" stroke="var(--w-win)" stroke-width="8"/>'+
 '<circle cx="'+(x+70)+'" cy="100" r="30" fill="#FFC93C"/><g stroke="#FFC93C" stroke-width="5" stroke-linecap="round">'+[0,1,2,3,4,5,6,7].map(i=>{const a=i*Math.PI/4;return '<path d="M'+(x+70+Math.cos(a)*40).toFixed(1)+' '+(100+Math.sin(a)*40).toFixed(1)+' L'+(x+70+Math.cos(a)*52).toFixed(1)+' '+(100+Math.sin(a)*52).toFixed(1)+'"/>'}).join('')+'</g></g>'}
function sprayer(x,y,s,anim){return '<g transform="translate('+x+' '+y+') scale('+(s||1)+')"'+(anim?'':'')+'><rect x="-34" y="-10" width="68" height="110" rx="14" fill="#E8F4FA" stroke="#5F8FA0" stroke-width="3"/><rect x="-30" y="40" width="60" height="56" rx="10" fill="'+WC+'" fill-opacity=".7"/><rect x="-16" y="-34" width="32" height="26" rx="5" fill="#2F68B0"/><path d="M-16 -28 H-46 V-20 H-16" fill="#2F68B0"/><path d="M14 -26 q22 6 18 30" stroke="#2F68B0" stroke-width="6" fill="none" stroke-linecap="round"/></g>'}
function mist(x,y,anim){let g='';for(let i=0;i<22;i++){const a=Math.PI*(.8+rnd(i,31)*.45),d=20+rnd(i,32)*90;g+='<circle cx="'+(x+Math.cos(a)*d).toFixed(1)+'" cy="'+(y+Math.sin(a)*d*.6+d*.3).toFixed(1)+'" r="'+(1.5+rnd(i,33)*2).toFixed(1)+'" fill="'+WC+'"'+(anim?an('lb-a-fade',rnd(i,34)*.4):'')+'/>'}return g}
const BK={w:150,h:200};
function beaker2(cx,base,o){o=o||{};const w=BK.w/2,h=BK.h,lv=o.lvl||0;let g=shadow(cx,base+4,w+8);
 const out='M'+(cx-w)+' '+(base-h)+' V'+(base-10)+' Q'+(cx-w)+' '+base+' '+(cx-w+10)+' '+base+' H'+(cx+w-10)+' Q'+(cx+w)+' '+base+' '+(cx+w)+' '+(base-10)+' V'+(base-h);
 g+='<path d="'+out+'" fill="rgba(232,244,250,.5)"/>';
 if(lv>0)g+='<g'+(o.rise?an('lb-a-rise',.2):'')+'><path d="M'+(cx-w+3)+' '+(base-lv)+' H'+(cx+w-3)+' V'+(base-10)+' Q'+(cx+w-3)+' '+(base-3)+' '+(cx+w-10)+' '+(base-3)+' H'+(cx-w+10)+' Q'+(cx-w+3)+' '+(base-3)+' '+(cx-w+3)+' '+(base-10)+'Z" fill="'+WC+'" fill-opacity=".8"/>'+(o.wavy?'':'<path d="M'+(cx-w+3)+' '+(base-lv)+' H'+(cx+w-3)+'" stroke="'+WS+'" stroke-width="3"/>')+'</g>';
 if(o.inner)g+=o.inner;
 g+='<path d="'+out+'" fill="none" stroke="var(--w-glass-s)" stroke-width="3.5"/><path d="M'+(cx-w-9)+' '+(base-h)+' h12" stroke="var(--w-glass-s)" stroke-width="3.5"/>';
 for(let i=1;i<=4;i++)g+='<path d="M'+(cx+w-26)+' '+(base-i*38)+' h18" stroke="var(--w-glass-s)" stroke-width="2"/>';
 if(o.sticker)g+='<g'+(o.sticker==='anim'?an('lb-a-pop',.3):'')+'><rect x="'+(cx-32)+'" y="'+(base-h+18)+'" width="64" height="30" rx="4" fill="#FFF4C2" stroke="#B9A04A" stroke-width="2"/><path d="M'+(cx-22)+' '+(base-h+33)+' h44" stroke="#8A7A3A" stroke-width="3"/></g>';
 (o.marks||[]).forEach((m,i)=>{const y=base-m[0];g+='<path d="M'+(cx-w-(i?-2:14))+' '+y+' H'+(cx-w+30)+'" stroke="'+m[1]+'" stroke-width="5" stroke-linecap="round"'+(m[3]?an('lb-a-fade',.3):'')+'/>'+(m[2]?mini(cx-w-44,y+5,m[2],15):'')});
 return g}
function coat(x,y,s){return '<g transform="translate('+x+' '+y+') scale('+(s||1)+')"><path d="M-46 -64 L-18 -72 L0 -40 L18 -72 L46 -64 L62 30 L40 34 L36 -10 L34 72 H-34 L-36 -10 L-40 34 L-62 30Z" fill="#FFFFFF" stroke="#9AA6B2" stroke-width="3" stroke-linejoin="round"/><path d="M0 -40 V72" stroke="#9AA6B2" stroke-width="2"/><circle cx="-7" cy="-6" r="3" fill="#9AA6B2"/><circle cx="-7" cy="22" r="3" fill="#9AA6B2"/><rect x="12" y="10" width="16" height="12" rx="2" fill="none" stroke="#9AA6B2" stroke-width="2"/></g>'}
function goggles(x,y,s){return '<g transform="translate('+x+' '+y+') scale('+(s||1)+')"><rect x="-58" y="-18" width="52" height="36" rx="15" fill="rgba(200,230,245,.6)" stroke="#2F68B0" stroke-width="4"/><rect x="6" y="-18" width="52" height="36" rx="15" fill="rgba(200,230,245,.6)" stroke="#2F68B0" stroke-width="4"/><path d="M-6 -2 h12" stroke="#2F68B0" stroke-width="5"/></g>'}

const DEG=Math.PI/180;
const f1=v=>(+v).toFixed(1);
const GLOVE=1;
/* 보안경(투명) · 면장갑 낀 손 */
function gog(x,y,s,tint,line){return '<g transform="translate('+x+' '+y+') scale('+(s||1)+')"><rect x="-58" y="-18" width="52" height="36" rx="15" fill="'+tint+'" stroke="'+line+'" stroke-width="4"/><rect x="6" y="-18" width="52" height="36" rx="15" fill="'+tint+'" stroke="'+line+'" stroke-width="4"/><path d="M-6 -2 h12" stroke="'+line+'" stroke-width="5"/><path d="M-58 0 h-14 M58 0 h14" stroke="'+line+'" stroke-width="4"/></g>'}
const GOGC=['rgba(200,230,245,.55)','#2F68B0'];
function glove(x,y,s,rot){return '<g transform="translate('+x+' '+y+') rotate('+(rot||0)+') scale('+(s||1)+')"><path d="M-22 30 V-6 q0 -8 7 -8 q7 0 7 8 v-14 q0 -8 7 -8 q7 0 7 8 v4 q0 -8 7 -8 q7 0 7 8 v14 q0 -6 6 -6 q6 0 6 6 v26 q0 22 -24 22 h-8 q-22 0 -22 -22z" fill="#FFFFFF" stroke="#9AA6B2" stroke-width="2.4" stroke-linejoin="round"/><path d="M-22 40 h44" stroke="#C9D0D6" stroke-width="5"/></g>'}
function gearArt(on,anim){
 if(!on)return coat(300,250,1.3)+gog(560,200,1.1,GOGC[0],GOGC[1])+glove(520,330,1.2,-8)+glove(640,330,1.2,8)+qmark(480,80);
 return '<g'+(anim?an('lb-a-up',0,'--from:100px'):'')+'><circle cx="480" cy="112" r="38" fill="#F2C6A0" stroke="#B9875F" stroke-width="3"/>'+gog(480,104,.82,GOGC[0],GOGC[1])+coat(480,262,1.75)+glove(372,346,1,-12)+glove(588,346,1,12)+'</g>'}

/* ───────── 실험 1: 차가운 음료수 캔(앞에서 봄) ───────── */
const CN={x:480,b:432,w:100,h:180};
function towelArt(cx,base,wet){let g='<path d="M'+(cx-150)+' '+(base+8)+' L'+(cx-126)+' '+(base-12)+' H'+(cx+150)+' L'+(cx+128)+' '+(base+8)+'Z" fill="#F4F0E6" stroke="#BDB4A2" stroke-width="2"/>';
 for(let i=1;i<6;i++)g+='<path d="M'+(cx-140+i*48)+' '+(base-10)+' l-10 17" stroke="#DED6C4" stroke-width="2"/>';
 if(wet)g+='<ellipse cx="'+cx+'" cy="'+(base-1)+'" rx="'+(70+wet*30)+'" ry="9" fill="#AFC6D6" opacity="'+(.35+wet*.45).toFixed(2)+'"'+(wet==='anim'?an('lb-a-wet',0):'')+'/>';
 return g}
function canDrops(x,y,w,h,d,seed){if(d<=0)return '';let g='';const n=Math.round(14+d*46),r0=1.3+d*2.6;
 for(let i=0;i<n;i++){const rx=x+rnd(i,seed)*w,ry=y+rnd(i,seed+1)*h,r=r0*(.55+rnd(i,seed+2)*.9);
  g+='<circle cx="'+f1(rx)+'" cy="'+f1(ry)+'" r="'+f1(r)+'" fill="#F4FBFF" fill-opacity=".9" stroke="#7FB8D8" stroke-width="1.1"/>'}
 if(d>.75)for(let k=0;k<5;k++){const sx=x+10+k*(w-20)/4+rnd(k,seed+5)*8,sy=y+30+rnd(k,seed+6)*50,L=(h-(sy-y))*.9*(d-.75)/.25;
  g+='<path d="M'+f1(sx)+' '+f1(sy)+' v'+f1(L)+'" stroke="#CDE7F6" stroke-width="5" stroke-linecap="round" opacity=".9"/><circle cx="'+f1(sx)+'" cy="'+f1(sy+L)+'" r="4" fill="#F4FBFF" stroke="#7FB8D8" stroke-width="1.2"/>'}
 return g}
function canArt(cx,base,o){o=o||{};const w=CN.w,h=CN.h,x=cx-w/2,y=base-h;let g=shadow(cx,base+3,w/2+10);
 g+='<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="14" fill="#7D4AA8"/><rect x="'+(x+10)+'" y="'+(y+18)+'" width="14" height="'+(h-36)+'" rx="7" fill="#FFFFFF" opacity=".22"/>';
 g+='<rect x="'+x+'" y="'+y+'" width="'+w+'" height="16" rx="7" fill="#B8C2CC" stroke="#8C98A4" stroke-width="2"/><rect x="'+x+'" y="'+(base-16)+'" width="'+w+'" height="16" rx="7" fill="#B8C2CC" stroke="#8C98A4" stroke-width="2"/>';
 g+='<circle cx="'+cx+'" cy="'+(y+80)+'" r="24" fill="#5A2E82"/><circle cx="'+(cx-8)+'" cy="'+(y+74)+'" r="7" fill="#9B6BC9"/><circle cx="'+(cx+7)+'" cy="'+(y+76)+'" r="7" fill="#9B6BC9"/><circle cx="'+cx+'" cy="'+(y+89)+'" r="7" fill="#9B6BC9"/><path d="M'+cx+' '+(y+56)+' q6 -8 14 -6" stroke="#6DB04A" stroke-width="4" fill="none"/>';
 g+='<text x="'+cx+'" y="'+(y+134)+'" text-anchor="middle" font-size="19" font-weight="800" fill="#FFFFFF">포도</text>';
 g+='<g'+(o.anim?an('lb-a-fade',0):'')+'>'+canDrops(x+4,y+18,w-8,h-36,o.d||0,7)+'</g>';
 return g}
function canSpot(){const v=tView('e1t');if(!v)return null;return [CN.x+18,CN.b-118,34,2.4,770,190]}
/* 흰 종이에 묻히기 */
function paperDab(cx,y,kind,on,anim){let g='<path d="M'+(cx-130)+' '+(y+70)+' L'+(cx-100)+' '+(y-16)+' H'+(cx+130)+' L'+(cx+100)+' '+(y+70)+'Z" fill="#FFFDF8" stroke="#B9B2A2" stroke-width="2.5"/>';
 if(on){const blob='M'+(cx-46)+' '+(y+24)+' q16 -28 54 -20 q42 6 38 32 q-4 28 -44 28 q-50 0 -48 -40Z';
  g+='<g'+(anim?an('lb-a-wet',.1):'')+'>'+(kind==='A'?'<path d="'+blob+'" fill="#7D3C98" opacity=".85"/>':'<path d="'+blob+'" fill="#DCEFFA" opacity=".6" stroke="#8FBDD8" stroke-width="2.2" stroke-dasharray="5 4"/>')+'</g>'}
 return g}
function dabScene(o){o=o||{};let g=bg({});
 g+=paperDab(250,372,'A',o.a,o.aAnim)+paperDab(710,372,'B',o.b,o.bAnim)+(o.can?canArt(480,CN.b,{d:1}):'');
 g+=tag(250,486,'음료수',20)+tag(710,486,'캔 표면의 물방울',20);
 return g}
/* ───────── 실험 2: 집기병(앞에서 봄) ───────── */
const JR={x:480,b:432,w:180,h:210,nw:120};
function jarPath(cx,b,s){const w=JR.w*s/2,h=JR.h*s,nw=JR.nw*s/2,top=b-h;
 return 'M'+(cx-nw)+' '+(top-22*s)+' V'+(top+8*s)+' Q'+(cx-w)+' '+(top+12*s)+' '+(cx-w)+' '+(top+40*s)+' V'+(b-12*s)+' Q'+(cx-w)+' '+b+' '+(cx-w+12*s)+' '+b+' H'+(cx+w-12*s)+' Q'+(cx+w)+' '+b+' '+(cx+w)+' '+(b-12*s)+' V'+(top+40*s)+' Q'+(cx+w)+' '+(top+12*s)+' '+(cx+nw)+' '+(top+8*s)+' V'+(top-22*s)}
/* o: water, smoke(0~1), fog(0~1), bag(ice 지퍼 백), lid(덮개), s(크기) */
function jarArt(cx,b,o){o=o||{};const s=o.s||1,w=JR.w*s/2,h=JR.h*s,top=b-h,P=jarPath(cx,b,s);let g=shadow(cx,b+3,w+8);
 const cid='jc'+Math.round(cx)+'_'+Math.round(s*100)+(o.k||'');
 g+='<clipPath id="'+cid+'"><path d="'+P+'Z"/></clipPath><path d="'+P+'Z" fill="rgba(110,140,160,.30)"/>';
 g+='<g clip-path="url(#'+cid+')">';
 if(o.water)g+='<rect x="'+(cx-w)+'" y="'+(b-26*s)+'" width="'+2*w+'" height="'+26*s+'" fill="var(--w-water)" fill-opacity=".85"/><path d="M'+(cx-w)+' '+(b-26*s)+' H'+(cx+w)+'" stroke="var(--w-water-s)" stroke-width="2.5"/>';
 if(o.smoke>0){let sm='';for(let i=0;i<9;i++)sm+='<circle cx="'+f1(cx-w*.7+rnd(i,41)*w*1.4)+'" cy="'+f1(top+20*s+rnd(i,42)*h*.62)+'" r="'+f1((16+rnd(i,43)*18)*s)+'"/>';
  g+='<g fill="#8E979F" opacity="'+(o.smoke*.75).toFixed(2)+'"'+(o.smokeAnim?an('lb-a-fade',.4):'')+'>'+sm+'</g>'}
 if(o.fog>0){g+='<g'+(o.fogAnim?an('lb-a-fade',0):'')+'><rect x="'+(cx-w)+'" y="'+(top-30*s)+'" width="'+2*w+'" height="'+(h+30*s-26*s)+'" fill="#FFFFFF" opacity="'+(o.fog*.9).toFixed(2)+'"/>';
  for(let i=0;i<Math.round(o.fog*22);i++)g+='<ellipse cx="'+f1(cx-w+rnd(i,51)*2*w)+'" cy="'+f1(top-10*s+rnd(i,52)*(h-30*s))+'" rx="'+f1((18+rnd(i,53)*20)*s)+'" ry="'+f1((8+rnd(i,54)*8)*s)+'" fill="#DCE3E8" opacity=".55"/>';
  g+='</g>'}
 g+='</g><path d="'+P+'" fill="none" stroke="var(--w-glass-s)" stroke-width="'+(3.5*s)+'" stroke-linejoin="round"/><path d="M'+(cx-JR.nw*s/2-6*s)+' '+(top-22*s)+' h'+(JR.nw*s+12*s)+'" stroke="var(--w-glass-s)" stroke-width="'+(5*s)+'" stroke-linecap="round"/>';
 g+='<path d="M'+(cx-w+14*s)+' '+(top+56*s)+' v'+(h*.45)+'" stroke="#FFFFFF" stroke-width="'+(6*s)+'" stroke-linecap="round" opacity=".5"/>';
 if(o.lid)g+='<rect x="'+(cx-JR.nw*s/2-14*s)+'" y="'+(top-34*s)+'" width="'+(JR.nw*s+28*s)+'" height="'+(10*s)+'" rx="'+(3*s)+'" fill="#9AA6B2" stroke="#6E7A86" stroke-width="2"/>';
 if(o.bag)g+='<g'+(o.bagAnim?an('lb-a-down',0,'--from:-140px'):'')+'>'+zbag(cx,top-22*s,s,1)+'</g>';
 return g}
function zbag(cx,y,s,ice){s=s||1;let g='<path d="M'+(cx-112*s)+' '+y+' Q'+(cx-118*s)+' '+(y-40*s)+' '+(cx-96*s)+' '+(y-46*s)+' H'+(cx+96*s)+' Q'+(cx+118*s)+' '+(y-40*s)+' '+(cx+112*s)+' '+y+'Z" fill="rgba(214,238,248,.92)" stroke="#7FB8D8" stroke-width="'+(2.5*s)+'"/><path d="M'+(cx-96*s)+' '+(y-40*s)+' H'+(cx+96*s)+'" stroke="#4E8FB8" stroke-width="'+(3*s)+'"/>';
 if(ice)[[-62,-24],[-22,-30],[18,-24],[56,-28]].forEach((p,i)=>{g+='<rect x="'+f1(cx+p[0]*s)+'" y="'+f1(y+p[1]*s)+'" width="'+f1(30*s)+'" height="'+f1(22*s)+'" rx="'+f1(4*s)+'" fill="#FFFFFF" stroke="#9CC7E0" stroke-width="2" transform="rotate('+(i%2?8:-6)+' '+f1(cx+p[0]*s+15*s)+' '+f1(y+p[1]*s+11*s)+')"/>'});
 return g}
function incenseArt(x,y,lit,s){s=s||1;return '<g transform="translate('+x+' '+y+') scale('+s+')"><path d="M0 0 L0 -120" stroke="#8A5A2B" stroke-width="5" stroke-linecap="round"/><path d="M0 0 L0 -40" stroke="#5B3A1C" stroke-width="6"/>'+(lit?'<circle cx="0" cy="-122" r="5" fill="#E8492E"/><path d="M0 -128 q-12 -20 4 -36 q14 -14 0 -34" stroke="#AEB5BC" stroke-width="5" fill="none" opacity=".7" stroke-linecap="round"/>':'')+'</g>'}
function lighterArt(x,y,s){return '<g transform="translate('+x+' '+y+') scale('+(s||1)+')"><rect x="-70" y="-10" width="96" height="20" rx="6" fill="#E06C3C" stroke="#A84A24" stroke-width="2"/><rect x="26" y="-5" width="56" height="10" rx="3" fill="#B8C2CC" stroke="#7C8792" stroke-width="2"/><path d="M-30 10 v10 h22 v-10" fill="none" stroke="#A84A24" stroke-width="3"/></g>'}
function sandbox(x,y,s,stick){s=s||1;return '<g transform="translate('+x+' '+y+') scale('+s+')"><path d="M-70 -30 H70 L62 20 H-62Z" fill="#B98E5E" stroke="#8A6239" stroke-width="3"/><path d="M-66 -24 H66" stroke="#E2C48F" stroke-width="10"/>'+[...Array(10)].map((_,i)=>'<circle cx="'+(-58+i*13)+'" cy="'+(-24+(i%2?3:-2))+'" r="2" fill="#B08A55"/>').join('')+(stick?'<path d="M-6 -26 L20 -86" stroke="#8A5A2B" stroke-width="5" stroke-linecap="round"/>':'')+'</g>'}
function jarSpot(){const v=tView('e2t');if(!v)return null;return [JR.x+10,JR.b-120,44,1.9,800,200]}
/* 두 집기병 견주기 */
function cmpArt(c){const S=MODEL.cmpS[c]||0,F=MODEL.cmpF[c]||0;let g=bg({});
 g+=jarArt(290,432,{s:.82,smoke:S,lid:1,k:'a'})+jarArt(670,432,{s:.82,water:1,fog:F,smoke:c==='c0'?.3:0,bag:1,k:'b'});
 g+=tag(290,500,'향 연기만 넣음',18)+tag(670,500,'물 · 향 연기 · 얼음',18);
 return g}

/* ───────── 실험 3: 바람 발생 모형실험(앞에서 봄) ───────── */
const WB={sx:290,wx:670,b:432,w:230,h:120,mx:480,box:[130,118,830,446]};
function bigBowl(cx,b,fill,o){o=o||{};const w=WB.w/2,h=WB.h,t=b-h;let g=shadow(cx,b+3,w+6);
 const P='M'+(cx-w)+' '+t+' L'+(cx-w+14)+' '+b+' H'+(cx+w-14)+' L'+(cx+w)+' '+t;
 if(fill==='sand'){g+='<path d="M'+(cx-w+4)+' '+(t+22)+' L'+(cx-w+14)+' '+(b-3)+' H'+(cx+w-14)+' L'+(cx+w-4)+' '+(t+22)+'Z" fill="#D9B77A"/>';for(let i=0;i<26;i++)g+='<circle cx="'+f1(cx-w+16+rnd(i,61)*(2*w-32))+'" cy="'+f1(t+30+rnd(i,62)*(h-40))+'" r="2" fill="#B08A55"/>'}
 if(fill==='water')g+='<path d="M'+(cx-w+4)+' '+(t+22)+' L'+(cx-w+14)+' '+(b-3)+' H'+(cx+w-14)+' L'+(cx+w-4)+' '+(t+22)+'Z" fill="var(--w-water)" fill-opacity=".85"/><path d="M'+(cx-w+4)+' '+(t+22)+' H'+(cx+w-4)+'" stroke="var(--w-water-s)" stroke-width="3"/>';
 g+='<path d="'+P+'" fill="rgba(232,244,250,.25)" stroke="var(--w-glass-s)" stroke-width="3.5" stroke-linejoin="round"/>';
 if(o.lcd)g+=lcdStrip(cx,b-34,o.lcd,o.hl);
 return g}
/* 액정 온도계: 18~36 °C, 지금 온도 칸만 초록으로 보임 */
const LCD=[18,20,22,24,26,28,30,32,34,36];
function lcdStrip(cx,y,val,hl){const cw=17,W=cw*LCD.length,x0=cx-W/2;let g='<rect x="'+(x0-6)+'" y="'+(y-14)+'" width="'+(W+12)+'" height="28" rx="5" fill="#1B1F24" stroke="'+(hl?'#F3C623':'#4A525C')+'" stroke-width="'+(hl?4:2)+'"/>';
 LCD.forEach((v,i)=>{const on=String(v)===String(val),x=x0+i*cw;g+=(on?'<rect x="'+(x+1)+'" y="'+(y-11)+'" width="'+(cw-2)+'" height="22" rx="3" fill="#3FD27A"/>':'')+'<text x="'+(x+cw/2)+'" y="'+(y+4.5)+'" text-anchor="middle" font-size="11" font-weight="800" fill="'+(on?'#0B2414':'#59626C')+'">'+v+'</text>'});
 return g}
function smallBowl(cx,b,o){o=o||{};let g=shadow(cx,b+3,60);
 g+='<path d="M'+(cx-55)+' '+(b-62)+' L'+(cx-48)+' '+b+' H'+(cx+48)+' L'+(cx+55)+' '+(b-62)+'" fill="rgba(232,244,250,.3)" stroke="var(--w-glass-s)" stroke-width="3"/>';
 if(o.clay){g+='<ellipse cx="'+cx+'" cy="'+(b-14)+'" rx="26" ry="10" fill="#7F8C8D"/>';[-12,0,12].forEach(d=>{g+='<path d="M'+(cx+d)+' '+(b-18)+' V'+(b-50)+'" stroke="#8A5A2B" stroke-width="3.5"/>'+(o.lit?'<circle cx="'+(cx+d)+'" cy="'+(b-51)+'" r="3" fill="#E8492E"/>':'')})}
 if(o.smoke)g+='<g fill="#C8CED3" opacity=".9"'+(o.smokeAnim?an('lb-a-fade',.6):'')+'><circle cx="'+(cx-16)+'" cy="'+(b-44)+'" r="16"/><circle cx="'+(cx+12)+'" cy="'+(b-48)+'" r="17"/><circle cx="'+cx+'" cy="'+(b-28)+'" r="15"/></g>';
 if(o.lid!==false)g+='<g'+(o.lidAnim?an(o.lidAnim,0,o.lidVar||''):'')+'>'+lidArt(cx,b)+'</g>';
 return g}
function lidArt(cx,b){return '<rect x="'+(cx-60)+'" y="'+(b-70)+'" width="120" height="9" rx="3" fill="#AAB7C4" stroke="#6E7A86" stroke-width="2"/><rect x="'+(cx-8)+'" y="'+(b-78)+'" width="16" height="9" rx="3" fill="#6E7A86"/>'}
function tbox(anim){const [x1,y1,x2,y2]=WB.box;return '<g'+(anim?an('lb-a-down',0,'--from:-260px'):'')+'><rect x="'+x1+'" y="'+y1+'" width="'+(x2-x1)+'" height="'+(y2-y1)+'" fill="#161B22"/></g>'}
function tboxFront(anim){const [x1,y1,x2,y2]=WB.box;return '<g'+(anim?an('lb-a-down',0,'--from:-260px'):'')+'><rect x="'+x1+'" y="'+y1+'" width="'+(x2-x1)+'" height="'+(y2-y1)+'" fill="rgba(200,225,240,.06)" stroke="#9FB3C2" stroke-width="5"/><path d="M'+(x1+20)+' '+(y1+30)+' l60 -14" stroke="#FFFFFF" stroke-width="4" opacity=".35" stroke-linecap="round"/></g>'}
/* 향 연기: w(0~1) 만큼 퍼진 모습 — 바닥 가까이에서 따뜻한 물 쪽으로 가서 물 위에서 올라감 */
const SMK=[[480,354],[506,349],[534,344],[562,339],[592,334],[622,329],[650,322],[672,311],[688,296],[698,279],[704,262]];
function smokeFlow(w,anim){let g='';const n=Math.max(1,Math.round(w*SMK.length));
 for(let i=0;i<n;i++){const p=SMK[i],k=i/(SMK.length-1),r=14+k*14+rnd(i,71)*6,op=.75-k*.35;
  g+='<circle cx="'+f1(p[0]+rnd(i,72)*10-5)+'" cy="'+f1(p[1]+rnd(i,73)*10-5)+'" r="'+f1(r)+'" fill="#D5DAE0" opacity="'+f1(op)+'"'+(anim?an('lb-a-fade',i*.08):'')+'/>'}
 return '<g class="lb-smk">'+g+'</g>'}
function windLab(o){o=o||{};let g=bg({});
 if(o.box)g+=tbox(o.boxAnim);
 g+=bigBowl(WB.sx,WB.b,'sand',{lcd:MODEL.sandT})+bigBowl(WB.wx,WB.b,'water',{lcd:MODEL.waterT});
 if(o.small)g+='<g'+(o.smallAnim?an('lb-a-fade',.2):'')+'>'+smallBowl(WB.mx,WB.b,{clay:1,lit:1,smoke:!o.open,lid:!o.open})+'</g>';
 if(o.open)g+=smokeFlow(o.w||0,o.anim)
 if(o.box)g+=tboxFront(o.boxAnim);
 if(!NAR&&o.names){g+=mini(WB.sx,WB.b+40,'모래',18)+mini(WB.wx,WB.b+40,'따뜻한 물',18)}else if(o.names)LEG.push([null,'왼쪽: 모래 · 오른쪽: 따뜻한 물']);
 return g}
function lcdX(cx,val){const cw=17,x0=cx-cw*LCD.length/2,i=LCD.findIndex(v=>String(v)===String(val));return x0+i*cw+cw/2}
function thermoSpot(){const v=UI.mq.cur==='ts'||UI.mq.cur==='tw'?UI.mq.cur:R().st.tv;if(!v)return null;const x=v==='ts'?lcdX(WB.sx,MODEL.sandT):lcdX(WB.wx,MODEL.waterT);return [x,WB.b-34,30,2.8,480,190]}

/* ───────── 준비물 카드 ───────── */
function itemArt(k){const A={
  can:'<g transform="scale(.5)">'+canArt(0,90,{}).replace(/<ellipse[^>]*\/>/,'')+'</g>',
  towel:'<g transform="translate(0 6)"><rect x="-56" y="-30" width="112" height="60" rx="6" fill="#F4F0E6" stroke="#BDB4A2" stroke-width="2.5"/><path d="M-56 -10 H56 M-56 10 H56" stroke="#DED6C4" stroke-width="3"/></g>',
  wpaper:'<rect x="-50" y="-44" width="100" height="88" rx="2" fill="#FFFDF8" stroke="#B9B2A2" stroke-width="2.5"/>',
  gear:'<g transform="translate(-10 -6) scale(.42)">'+coat(-40,10,1)+'</g>'+gog(26,-28,.42,GOGC[0],GOGC[1])+glove(40,22,.7,8),
  jar:'<g transform="scale(.42)">'+jarArt(0,120,{}).replace(/<ellipse[^>]*\/>/,'')+'</g>',
  lwater:'<g transform="translate(0 6) scale(.62)">'+beaker2(0,60,{lvl:70}).replace(/<ellipse[^>]*\/>/,'')+'</g>',
  wwater:'<g transform="translate(0 6) scale(.62)">'+beaker2(0,60,{lvl:80}).replace(/<ellipse[^>]*\/>/,'')+'</g>',
  incense:'<g transform="rotate(30)">'+incenseArt(0,52,false,.8)+'</g>',
  lighter:lighterArt(0,0,.9),
  ice:[[-30,-8],[4,-14],[-12,16],[22,12]].map(p=>'<rect x="'+p[0]+'" y="'+p[1]+'" width="28" height="24" rx="4" fill="#FFFFFF" stroke="#9CC7E0" stroke-width="2.5"/>').join(''),
  zbag:'<g transform="translate(0 30)">'+zbag(0,0,.5,0)+'</g>',
  sandbox:sandbox(0,10,.75,false),
  tbox:'<rect x="-58" y="-44" width="116" height="88" fill="#161B22"/><rect x="-58" y="-44" width="116" height="88" fill="none" stroke="#9FB3C2" stroke-width="4"/>',
  bowls:('<g transform="scale(.36)">'+bigBowl(-130,60,'')+bigBowl(130,60,'')+'</g>').replace(/<ellipse[^>]*\/>/g,''),
  lcd:'<g transform="scale(.7)">'+lcdStrip(0,-20,null)+lcdStrip(0,20,null)+'</g>',
  sand:'<path d="M-56 30 Q-40 -26 0 -30 Q40 -26 56 30Z" fill="#D9B77A" stroke="#B08A55" stroke-width="2.5"/>',
  sbowl:'<g transform="translate(0 4) scale(.8)">'+smallBowl(0,40,{}).replace(/<ellipse[^>]*\/>/,'')+'</g>',
  clay:'<ellipse cx="0" cy="34" rx="40" ry="14" fill="#7F8C8D"/>'+[-16,0,16].map(d=>'<path d="M'+d+' 30 V-40" stroke="#8A5A2B" stroke-width="4"/>').join('')};
 return A[k]||''}
function itemArtAt(k,x,y){return '<g transform="translate('+x+' '+y+') scale(1.4)">'+itemArt(k)+'</g>'}
function toolsScene(list,anim){let b='';if(NAR)list.forEach(it=>LEG.push([null,it[1]]));const n=list.length,cols=n<=4?n:n<=6?3:n<=8?4:5,rows=Math.ceil(n/cols),cw=n>8?172:200,ch=n>8?168:176,gx=n>8?14:18,gy=18;
 const W=cols*cw+(cols-1)*gx,H=rows*ch+(rows-1)*gy,x0=480-W/2,y0=Math.max(30,250-H/2);
 list.forEach((it,i)=>{const c=i%cols,r=Math.floor(i/cols),x=x0+c*(cw+gx),y=y0+r*(ch+gy),cx=x+cw/2;
  b+='<g'+(anim?an('lb-a-pop',.3+i*.12):'')+'><rect x="'+x+'" y="'+y+'" width="'+cw+'" height="'+ch+'" rx="16" fill="var(--w-label)" stroke="var(--w-felt-s)" stroke-width="1.5"/><g transform="translate('+cx+' '+(y+70)+')">'+itemArt(it[0])+'</g>'+(NAR?'':toolLabel(cx,y+ch-16,it[1]))+'</g>'});
 return b}
/* 준비물 이름: 길면 두 줄로(글자를 줄이지 않음) */
function toolLabel(cx,yb,t){const T='<text x="'+cx+'" text-anchor="middle" font-size="19" font-weight="800" fill="var(--w-labeltx)"';
 if(t.length<=9)return T+' y="'+yb+'">'+t+'</text>';
 const sp=[...t].map((c,i)=>c===' '?i:-1).filter(i=>i>0);if(!sp.length)return T+' y="'+yb+'" font-size="16">'+t+'</text>';
 const m=sp.reduce((a,i)=>Math.abs(i-t.length/2)<Math.abs(a-t.length/2)?i:a,sp[0]);
 return T+' y="'+(yb-21)+'">'+t.slice(0,m)+'</text>'+T+' y="'+yb+'">'+t.slice(m+1)+'</text>'}
function boxArt(x){return '<g transform="translate('+x+' 300)"><path d="M-130 -60 L-100 -96 H150 L120 -60Z" fill="var(--w-kraft-s)"/><rect x="-130" y="-60" width="250" height="196" rx="8" fill="var(--w-kraft)" stroke="var(--w-kraft-s)" stroke-width="2"/><path d="M120 -60 L150 -96 V100 L120 136Z" fill="var(--w-kraft-s)"/>'+(NAR?'':'<rect x="-60" y="-10" width="110" height="44" rx="8" fill="var(--w-label)"/><text x="-5" y="20" text-anchor="middle" font-size="22" font-weight="800" fill="var(--w-labeltx)">준비물</text>')+'</g>'}
