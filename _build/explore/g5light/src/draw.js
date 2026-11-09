/* ───────── 그림: 실험대 장면 — 모두 직접 그린 SVG (빛의 성질) ───────── */
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
/* 빛줄기: 그리며 나타남(lb-a-draw) */
function beam(pts,o){o=o||{};const d='M'+pts.map(p=>f1(p[0])+' '+f1(p[1])).join(' L');const col=o.col||'#FF3B30',w=o.w||4.5,op=o.op==null?1:o.op;
 return (o.glow===false?'':'<path d="'+d+'" stroke="'+col+'" stroke-width="'+(w*3)+'" fill="none" opacity="'+(op*.22).toFixed(2)+'" stroke-linecap="round" stroke-linejoin="round"/>')+
  '<path d="'+d+'" stroke="'+col+'" stroke-width="'+w+'" fill="none" opacity="'+op+'" stroke-linecap="round" stroke-linejoin="round"'+(o.anim?' pathLength="1" stroke-dasharray="1"'+an('lb-a-draw',o.delay||0):'')+'/>'}
function dot(x,y,r,col){return '<circle cx="'+f1(x)+'" cy="'+f1(y)+'" r="'+(r*2.2)+'" fill="'+(col||'#FF3B30')+'" opacity=".25"/><circle cx="'+f1(x)+'" cy="'+f1(y)+'" r="'+r+'" fill="'+(col||'#FF3B30')+'"/>'}
function eye(x,y,s){return '<g transform="translate('+x+' '+y+') scale('+(s||1)+')"><path d="M-26 0 Q0 -20 26 0 Q0 20 -26 0Z" fill="#FFFFFF" stroke="#2A3342" stroke-width="3"/><circle r="8" fill="#2A3342"/><circle cx="-3" cy="-3" r="2.5" fill="#FFFFFF"/></g>'}
/* 밝은 교실 · 어두운 교실(실험대 윗면 y=480) */
function room(dark){return '<rect x="-3000" y="-3000" width="7000" height="3480" fill="'+(dark?'#141A26':'var(--w-wall)')+'"/><rect x="-3000" y="480" width="7000" height="26" fill="'+(dark?'#3A2F24':'var(--w-top)')+'"/><rect x="-3000" y="506" width="7000" height="3000" fill="'+(dark?'#2A2119':'var(--w-front)')+'"/>'}
/* 교실 어둡게 하기: 창문·커튼·전등 */
function roomArt(dark,anim){let g=bg({win:500});
 g+='<rect x="120" y="18" width="240" height="18" rx="7" fill="#DDE3EA" stroke="#9AA6B2" stroke-width="2"/>';
 if(!dark)g+='<path d="M136 36 L90 170 H390 L344 36Z" fill="#FFF6C8" opacity=".45"/>';
 const cl=(x,w,dx)=>'<g'+(anim?an('lb-a-slide',.1,'--dx:'+dx+'px'):'')+'><rect x="'+x+'" y="26" width="'+w+'" height="290" fill="#6F8DB8" stroke="#4E6C96" stroke-width="2"/>'+[1,2,3].map(i=>'<path d="M'+(x+i*w/4)+' 30 V312" stroke="#5A78A3" stroke-width="3"/>').join('')+'</g>';
 g+='<rect x="480" y="16" width="300" height="10" rx="4" fill="#8A6239"/>';
 g+=dark?cl(484,148,-100)+cl(632,148,100):cl(484,40,0)+cl(740,40,0);
 g+='<rect x="410" y="200" width="40" height="60" rx="5" fill="#F4F6F8" stroke="#9AA6B2" stroke-width="2"/><rect x="422" y="'+(dark?232:212)+'" width="16" height="16" rx="3" fill="#7F8C99"/>';
 if(dark)g+='<rect x="-3000" y="-3000" width="7000" height="7000" fill="#0B1020" opacity=".6"'+(anim?an('lb-a-fade',.7):'')+'/>';
 return g}

/* ───────── 실험 1: 어둠상자(앞에서 봄) ───────── */
const BX={x:170,y:236,w:360,h:200,dx:60,dy:-40};
const HOLE=[BX.x+90,BX.y+100],LIDH=[BX.x+BX.w/2+BX.dx/2,BX.y+BX.dy/2];
function bundle(x,y){return '<g><path d="M'+(x-40)+' '+(y+24)+' Q'+(x-46)+' '+(y-30)+' '+x+' '+(y-34)+' Q'+(x+46)+' '+(y-30)+' '+(x+40)+' '+(y+24)+' Q'+x+' '+(y+36)+' '+(x-40)+' '+(y+24)+'Z" fill="#9C6FB0" stroke="#6E4A80" stroke-width="2.5"/><path d="M'+(x-10)+' '+(y-34)+' q10 -14 20 0" stroke="#6E4A80" stroke-width="4" fill="none"/></g>'}
/* o: open(뚜껑 열림), inner(상자 속으로 들어가는 것), lidAnim */
function dbox(o){o=o||{};const X=BX.x,Y=BX.y,W=BX.w,H=BX.h,dx=BX.dx,dy=BX.dy;let g=shadow(X+W/2+24,Y+H+4,W/2+44);
 const top='M'+X+' '+Y+' L'+(X+dx)+' '+(Y+dy)+' H'+(X+W+dx)+' L'+(X+W)+' '+Y+'Z';
 const lid='<path d="'+top+'" fill="#F0DFBC" stroke="#7A6440" stroke-width="2.5" stroke-linejoin="round"/><ellipse cx="'+LIDH[0]+'" cy="'+LIDH[1]+'" rx="24" ry="9" fill="#0B0D12" stroke="#5E4B2E" stroke-width="2"/>';
 if(o.open||o.hole)g+='<path d="'+top+'" fill="#2A2116"/>';
 if(o.inner)g+=o.inner;
 g+='<path d="M'+(X+W)+' '+Y+' L'+(X+W+dx)+' '+(Y+dy)+' V'+(Y+H+dy)+' L'+(X+W)+' '+(Y+H)+'Z" fill="var(--w-kraft-s)" stroke="#7A6440" stroke-width="2.5" stroke-linejoin="round"/>';
 g+='<rect x="'+X+'" y="'+Y+'" width="'+W+'" height="'+H+'" fill="var(--w-kraft)" stroke="#7A6440" stroke-width="2.5"/>';
 g+='<circle cx="'+HOLE[0]+'" cy="'+HOLE[1]+'" r="18" fill="#0B0D12" stroke="#5E4B2E" stroke-width="3"/>';
 if(o.open)g+='<g transform="translate(0 -120)">'+lid+'</g>';
 else g+='<g'+(o.lidAnim?an('lb-a-down',o.lidAnim,'--from:-120px'):'')+'>'+lid+'</g>';
 return g}
/* 손전등(세움, 머리가 아래) */
function flashV(x,yb,on){let g='<g><rect x="'+(x-19)+'" y="'+(yb-176)+'" width="38" height="140" rx="9" fill="#3F6FB5" stroke="#1D3A66" stroke-width="2.5"/>';
 for(let i=0;i<4;i++)g+='<path d="M'+(x-14)+' '+(yb-160+i*12)+' h28" stroke="#2E5590" stroke-width="3"/>';
 g+='<rect x="'+(x-30)+'" y="'+(yb-40)+'" width="60" height="40" rx="7" fill="#2E5590" stroke="#1D3A66" stroke-width="2.5"/>';
 g+=(on?'<circle cx="'+(x+22)+'" cy="'+(yb-104)+'" r="13" fill="#FFC93C" opacity=".35"/>':'')+'<rect x="'+(x+16)+'" y="'+(yb-116)+'" width="10" height="24" rx="3" fill="'+(on?'#FFC93C':'#B9C2CA')+'" stroke="#1D3A66" stroke-width="1.5"/>';
 return g+'</g>'}
function flashH(x,y,on){return '<g transform="translate('+x+' '+y+') rotate(-90)">'+flashV(0,0,on)+'</g>'}
/* 관찰 구멍으로 본 모습: st = none | dark | lit */
const VW={x:772,y:250,r:150};
let VCN=0;
const OBJART=[
 '<ellipse cx="100" cy="128" rx="44" ry="56" fill="#26323B"/><ellipse cx="100" cy="138" rx="29" ry="42" fill="#FFFFFF"/><circle cx="100" cy="72" r="31" fill="#26323B"/><ellipse cx="100" cy="80" rx="20" ry="15" fill="#FFFFFF"/><circle cx="91" cy="72" r="4.5" fill="#26323B"/><circle cx="109" cy="72" r="4.5" fill="#26323B"/><path d="M93 84 L107 84 L100 95Z" fill="#F29A2E"/><ellipse cx="82" cy="184" rx="15" ry="7" fill="#F29A2E"/><ellipse cx="118" cy="184" rx="15" ry="7" fill="#F29A2E"/>',
 '<path d="M28 132 H172 V160 Q172 166 166 166 H34 Q28 166 28 160Z" fill="#2F7FD0"/><path d="M58 132 L80 98 H128 L148 132Z" fill="#2F7FD0"/><path d="M84 104 H102 V128 H70Z" fill="#CFEAFF"/><path d="M108 104 H124 L140 128 H108Z" fill="#CFEAFF"/><circle cx="62" cy="166" r="17" fill="#26323B"/><circle cx="62" cy="166" r="7" fill="#B9C2CA"/><circle cx="140" cy="166" r="17" fill="#26323B"/><circle cx="140" cy="166" r="7" fill="#B9C2CA"/><rect x="160" y="138" width="10" height="8" rx="2" fill="#FFE07A"/>',
 '<path d="M100 72 C62 48 30 88 44 136 C56 176 86 182 100 168 C114 182 144 176 156 136 C170 88 138 48 100 72Z" fill="#D93A32"/><path d="M100 72 Q103 52 114 42" stroke="#6B4A2A" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M108 56 Q130 40 146 54 Q126 66 108 56Z" fill="#4E9A3A"/><ellipse cx="70" cy="104" rx="10" ry="16" fill="#FFFFFF" opacity=".35"/>',
 '<path d="M56 72 H144 L134 178 H66Z" fill="#F1C84B" stroke="#C99A1E" stroke-width="3"/><path d="M142 96 Q178 96 172 130 Q168 154 136 152" stroke="#F1C84B" stroke-width="11" fill="none"/><ellipse cx="100" cy="72" rx="44" ry="9" fill="#FBE6A0" stroke="#C99A1E" stroke-width="3"/>'];
function objAt(i,cx,cy,s){return '<g transform="translate('+(cx-100*s)+' '+(cy-100*s)+') scale('+s+')">'+(OBJART[i]||'')+'</g>'}
function viewArt(st,obj,anim){const V=VW,id='lbVc'+(++VCN);let g='<clipPath id="'+id+'"><circle cx="'+V.x+'" cy="'+V.y+'" r="'+V.r+'"/></clipPath><circle cx="'+V.x+'" cy="'+V.y+'" r="'+(V.r+10)+'" fill="var(--w-label)" stroke="var(--w-felt-s)" stroke-width="2"/><g clip-path="url(#'+id+')">';
 if(st==='lit')g+='<rect x="'+(V.x-V.r)+'" y="'+(V.y-V.r)+'" width="'+2*V.r+'" height="'+2*V.r+'" fill="#E6D9BF"/><rect x="'+(V.x-V.r)+'" y="'+(V.y+70)+'" width="'+2*V.r+'" height="90" fill="#D4C3A2"/><ellipse cx="'+V.x+'" cy="'+(V.y-60)+'" rx="120" ry="80" fill="#FFF6D6" opacity=".8"/>'+'<g'+(anim?an('lb-a-fade',.1):'')+'>'+objAt(obj,V.x,V.y+10,1.05)+'</g>';
 else if(st==='dark')g+='<rect x="'+(V.x-V.r)+'" y="'+(V.y-V.r)+'" width="'+2*V.r+'" height="'+2*V.r+'" fill="#050608"'+(anim?an('lb-a-fade',0):'')+'/>';
 else g+='<rect x="'+(V.x-V.r)+'" y="'+(V.y-V.r)+'" width="'+2*V.r+'" height="'+2*V.r+'" fill="var(--w-wall2)"/>'+eye(V.x,V.y-10,1.6)+'<text x="'+V.x+'" y="'+(V.y+52)+'" text-anchor="middle" font-size="20" font-weight="800" fill="var(--w-labeltx)">눈을 대면 보여요</text>';
 g+='</g><circle cx="'+V.x+'" cy="'+V.y+'" r="'+V.r+'" fill="none" stroke="#2A3342" stroke-width="7"/>';
 return g+mini(V.x,V.y+V.r+38,'관찰 구멍으로 본 모습',18)}
function peek(){return eye(112,HOLE[1],1.15)+'<path d="M146 '+HOLE[1]+' H232" stroke="#2A3342" stroke-width="3" stroke-dasharray="7 6"/>'}

/* ───────── 실험 2: 구멍을 통과한 햇빛(옆에서 봄) ───────── */
const SN={hy:150,h0:380,h1:440,k:Math.cos(62*DEG)/Math.sin(62*DEG),gy:470};
function sunBg(){let g='<rect x="-3000" y="-3000" width="7000" height="3470" fill="var(--w-sky1)"/><rect x="-3000" y="'+SN.gy+'" width="7000" height="3000" fill="#9DB86B"/>';
 for(let i=0;i<40;i++){const x=rnd(i,61)*960;g+='<path d="M'+f1(x)+' '+(SN.gy+8+rnd(i,62)*50)+' l4 -10 l4 10" stroke="#6F8F45" stroke-width="2" fill="none"/>'}
 g+='<circle cx="70" cy="44" r="40" fill="#FFC93C"/><g stroke="#FFC93C" stroke-width="5" stroke-linecap="round">'+[0,1,2,3,4,5,6,7].map(i=>{const a=i*Math.PI/4;return '<path d="M'+f1(70+Math.cos(a)*50)+' '+f1(44+Math.sin(a)*50)+' L'+f1(70+Math.cos(a)*62)+' '+f1(44+Math.sin(a)*62)+'"/>'}).join('')+'</g>';
 return g}
function sunRays(){let g='';for(let x=170;x<=840;x+=46){const x0=x-(SN.hy+30)*SN.k;g+='<path d="M'+f1(x0)+' -30 L'+x+' '+SN.hy+'" stroke="#F2B705" stroke-width="3" opacity=".55"/>'}
 return g+'<path d="M'+f1(SN.h0-(SN.hy+30)*SN.k)+' -30 L'+SN.h0+' '+SN.hy+' M'+f1(SN.h1-(SN.hy+30)*SN.k)+' -30 L'+SN.h1+' '+SN.hy+'" stroke="#F2B705" stroke-width="3" opacity=".55"/>'}
function topPaper(){const y=SN.hy;return '<rect x="150" y="'+y+'" width="'+(SN.h0-150)+'" height="12" fill="#14161A"/><rect x="'+SN.h1+'" y="'+y+'" width="'+(820-SN.h1)+'" height="12" fill="#14161A"/>'+hand(132,y+6,0,1,0)+hand(838,y+6,180,1,0)}
function spotX(Y){return SN.h0+(Y-SN.hy-12)*SN.k}
function lowPaper(Y,spot,anim){let g='<rect x="190" y="'+Y+'" width="640" height="12" fill="#14161A"/>'+hand(172,Y+6,0,1,0)+hand(848,Y+6,180,1,0);
 if(spot){const x=spotX(Y);g+='<g'+(anim?an('lb-a-fade',.4):'')+'><rect x="'+f1(x-6)+'" y="'+(Y-6)+'" width="'+(SN.h1-SN.h0+12)+'" height="22" rx="6" fill="#FFE14D" opacity=".35"/><rect x="'+f1(x)+'" y="'+Y+'" width="'+(SN.h1-SN.h0)+'" height="12" fill="#FFE14D"/></g>'}
 return g}
function oldSpot(Y){const x=spotX(Y);return '<rect x="'+f1(x)+'" y="'+(Y-1)+'" width="'+(SN.h1-SN.h0)+'" height="14" fill="none" stroke="#C26A00" stroke-width="2.5" stroke-dasharray="6 5"/>'}
function standPaper(lit,anim){const y0=SN.hy+14,y1=SN.gy,x1=SN.h1+(y1-y0)*SN.k;let g='<rect x="'+(SN.h0-30)+'" y="'+y0+'" width="'+f1(x1-SN.h0+70)+'" height="'+(y1-y0)+'" fill="#14161A"/>';
 if(lit)g+='<polygon points="'+SN.h0+','+y0+' '+SN.h1+','+y0+' '+f1(x1)+','+y1+' '+f1(x1-(SN.h1-SN.h0))+','+y1+'" fill="#FFE14D" opacity=".92"'+(anim?an('lb-a-fade',.4):'')+'/>';
 return g}

/* ───────── 실험 3: 레이저 지시기(옆에서 봄, 어두운 교실) ───────── */
const L3={x:250,y:400,wall:860};
function laserDev(x,y,a,on,o){o=o||{};let g='<g transform="rotate('+f1(a)+' '+x+' '+y+')"><rect x="'+(x-140)+'" y="'+(y-11)+'" width="140" height="22" rx="10" fill="#3A3F48" stroke="#22262D" stroke-width="2"/><rect x="'+(x-14)+'" y="'+(y-13)+'" width="16" height="26" rx="4" fill="#5A606B"/><rect x="'+(x-86)+'" y="'+(y-15)+'" width="18" height="6" rx="2" fill="'+(on?'#E74C3C':'#8A9099')+'"/>';
 if(o.fan)g+='<path d="M'+(x-110)+' '+(y+1)+' l10 -7 M'+(x-110)+' '+(y+1)+' l10 0 M'+(x-110)+' '+(y+1)+' l10 7" stroke="#C9D3DA" stroke-width="2" stroke-linecap="round"/>';
 if(o.hand)g+=hand(x-70,y+4,0,1,0);
 return g+'</g>'}
function wallY(a){return L3.y+(L3.wall-L3.x)*Math.tan(a*DEG)}
function cloud(x0,x1,y0,y1,k,anim){let g='';for(let i=0;i<110;i++){const x=x0+rnd(i,71)*(x1-x0),y=y0+rnd(i,72)*(y1-y0);g+='<circle cx="'+f1(x)+'" cy="'+f1(y)+'" r="'+f1(1.4+rnd(i,73)*1.8)+'" fill="#9FB7D6" opacity="'+f1(.55*k)+'"'+(anim?an('lb-a-fade',rnd(i,74)*.5):'')+'/>'}return g}
function e3Room(dark){return room(dark)+'<rect x="'+L3.wall+'" y="-3000" width="3000" height="3480" fill="'+(dark?'#1E2636':'var(--w-wall2)')+'"/><path d="M'+L3.wall+' -3000 V480" stroke="'+(dark?'#2C3648':'var(--w-rail)')+'" stroke-width="3"/>'}
/* on: 켜짐, a: 기울기, mist: 물방울 구름(0~1), anim */
function e3Lab(o){o=o||{};const a=o.a||0;let g=e3Room(o.dark!==false);
 if(o.mist){g+=cloud(410,700,230,470,o.mist,o.anim)}
 if(o.on){const y1=wallY(a);
  if(o.mist){const t=v=>[v,L3.y+(v-L3.x)*Math.tan(a*DEG)];g+=beam([t(420),t(690)],{op:.9*o.mist,anim:o.anim,delay:.3})}
  g+=dot(L3.wall-2,y1,7)}
 if(o.spray)g+='<g transform="rotate(-24 760 150)">'+sprayer(760,150,.9)+'</g>';
 return g+laserDev(L3.x,L3.y,a,o.on,{hand:1})}

/* ───────── 실험 4: 평면거울(위에서 봄) ───────── */
const PP={x0:70,y0:40,x1:890,y1:500};
function paperTop(dim){return bgTop()+'<rect x="'+(PP.x0+6)+'" y="'+(PP.y0+8)+'" width="'+(PP.x1-PP.x0)+'" height="'+(PP.y1-PP.y0)+'" fill="var(--w-shadow)"/><rect x="'+PP.x0+'" y="'+PP.y0+'" width="'+(PP.x1-PP.x0)+'" height="'+(PP.y1-PP.y0)+'" fill="#FFFDF8" stroke="#D6D0C2" stroke-width="2"/>'+(dim?'<rect x="-3000" y="-3000" width="7000" height="7000" fill="#0B1020" opacity=".42"/>':'')}
/* 거울: 반사하는 면은 c를 지나는 선(m도 돌림) */
function mirrorTop(c,h,m,o){o=o||{};return '<g transform="rotate('+f1(m||0)+' '+c[0]+' '+c[1]+')"'+(o.anim?an('lb-a-down',0,'--from:-60px'):'')+'><rect x="'+c[0]+'" y="'+(c[1]-h)+'" width="9" height="'+2*h+'" fill="#A9DBF5" stroke="#3E7FA8" stroke-width="2"/><rect x="'+(c[0]+9)+'" y="'+(c[1]-h)+'" width="7" height="'+2*h+'" fill="#5B6670"/><rect x="'+(c[0]-12)+'" y="'+(c[1]-34)+'" width="40" height="68" rx="6" fill="#8A939C" stroke="#5B6670" stroke-width="2"/></g>'}
/* 거울 하나에 비춘 빛의 길 [시작, 거울에 닿은 곳, 끝] */
function edgePt(P,d){let t=1e9;if(d[0]>1e-9)t=Math.min(t,(PP.x1-P[0])/d[0]);if(d[0]<-1e-9)t=Math.min(t,(PP.x0-P[0])/d[0]);if(d[1]>1e-9)t=Math.min(t,(PP.y1-P[1])/d[1]);if(d[1]<-1e-9)t=Math.min(t,(PP.y0-P[1])/d[1]);return [P[0]+d[0]*t,P[1]+d[1]*t]}
function mirrorPath(P,a,c,h,m){const d=[Math.cos(a*DEG),Math.sin(a*DEG)],mm=(m||0)*DEG,u=[-Math.sin(mm),Math.cos(mm)],n=[Math.cos(mm),Math.sin(mm)];
 const w=[c[0]-P[0],c[1]-P[1]],det=-d[0]*u[1]+u[0]*d[1];if(Math.abs(det)<1e-9)return {pts:[P,edgePt(P,d)],hit:false};
 const s=(-w[0]*u[1]+u[0]*w[1])/det,v=(d[0]*w[1]-d[1]*w[0])/det;
 if(s<=0||Math.abs(v)>h||d[0]*n[0]+d[1]*n[1]<=0)return {pts:[P,edgePt(P,d)],hit:false};
 const Q=[P[0]+d[0]*s,P[1]+d[1]*s],k=d[0]*n[0]+d[1]*n[1],r=[d[0]-2*k*n[0],d[1]-2*k*n[1]];
 return {pts:[P,Q,edgePt(Q,r)],hit:true,r}}
function laserTop(x,y,a,on){return laserDev(x,y,a,on,{fan:1})}
const MC=[636,270],MH=150;
function posMark(x,y,t){return '<circle cx="'+x+'" cy="'+y+'" r="22" fill="none" stroke="#9AA6B2" stroke-width="2.5" stroke-dasharray="5 4"/><text x="'+(x-46)+'" y="'+(y+8)+'" text-anchor="middle" font-size="24" font-weight="800" fill="#4B5465">'+t+'</text>'}
/* 모양판 */
const TG=[{k:'tri',x:420,y:130},{k:'sq',x:380,y:453},{k:'ci',x:150,y:234}];
const MC2=[700,270],LP2=[300,300];
function target(t,col){let s;if(t.k==='tri')s='<polygon points="'+t.x+','+(t.y-17)+' '+(t.x+17)+','+(t.y+13)+' '+(t.x-17)+','+(t.y+13)+'" fill="'+col+'"/>';
 else if(t.k==='sq')s='<rect x="'+(t.x-14)+'" y="'+(t.y-14)+'" width="28" height="28" fill="'+col+'"/>';else s='<circle cx="'+t.x+'" cy="'+t.y+'" r="15" fill="'+col+'"/>';
 return '<rect x="'+(t.x-27)+'" y="'+(t.y-27)+'" width="54" height="54" rx="6" fill="#FDF2D6" stroke="#C9A85A" stroke-width="2"/>'+s}

/* ───────── 실험 5: 렌즈(위에서 봄, 어두운 교실) ───────── */
const LN={x:480,y:270,H:170,R:400};
function lensDef(t){const SAG=LN.R-Math.sqrt(LN.R*LN.R-LN.H*LN.H);if(t==='cv'){const tc=6+2*SAG;return [{c:[LN.x-tc/2+LN.R,LN.y],side:-1},{c:[LN.x+tc/2-LN.R,LN.y],side:1}]}
 const tc=8;return [{c:[LN.x-tc/2-LN.R,LN.y],side:1},{c:[LN.x+tc/2+LN.R,LN.y],side:-1}]}
function hitSurf(p,d,s){const ox=p[0]-s.c[0],oy=p[1]-s.c[1],b=ox*d[0]+oy*d[1],cc=ox*ox+oy*oy-LN.R*LN.R,disc=b*b-cc;if(disc<0)return null;
 for(const t of [-b-Math.sqrt(disc),-b+Math.sqrt(disc)]){if(t<1e-6)continue;const q=[p[0]+d[0]*t,p[1]+d[1]*t];if(Math.sign(q[0]-s.c[0])===s.side&&Math.abs(q[1]-LN.y)<=LN.H)return q}return null}
function bend(d,q,s,n1,n2){let N=[(q[0]-s.c[0])/LN.R,(q[1]-s.c[1])/LN.R];let ci=-(N[0]*d[0]+N[1]*d[1]);if(ci<0){N=[-N[0],-N[1]];ci=-ci}
 const e=n1/n2,k=1-e*e*(1-ci*ci);if(k<0)return d;const f=e*ci-Math.sqrt(k);return [e*d[0]+f*N[0],e*d[1]+f*N[1]]}
function lensRay(t,h){const S=lensDef(t);let p=[96,LN.y+h],d=[1,0];const pts=[p];
 const q1=hitSurf(p,d,S[0]);if(q1){pts.push(q1);d=bend(d,q1,S[0],1,MODEL.glass);const q2=hitSurf(q1,d,S[1]);if(q2){pts.push(q2);d=bend(d,q2,S[1],MODEL.glass,1);p=q2}else p=q1}
 const tx=(950-p[0])/d[0];let e=[p[0]+d[0]*tx,p[1]+d[1]*tx];if(e[1]<8||e[1]>532){const ty=((d[1]<0?8:532)-p[1])/d[1];e=[p[0]+d[0]*ty,p[1]+d[1]*ty]}pts.push(e);return pts}
function lensShape(t){const S=lensDef(t),a=[],b=[];for(let i=0;i<=30;i++){const y=LN.y-LN.H+i*2*LN.H/30,dy=y-LN.y,w=Math.sqrt(LN.R*LN.R-dy*dy);
 a.push([S[0].c[0]+S[0].side*w,y]);b.push([S[1].c[0]+S[1].side*w,y])}
 return 'M'+a.map(p=>f1(p[0])+' '+f1(p[1])).join(' L')+' L'+b.reverse().map(p=>f1(p[0])+' '+f1(p[1])).join(' L')+'Z'}
function darkTable(){return '<rect x="-3000" y="-3000" width="7000" height="7000" fill="#1B2230"/>'}
function lensArt(t,o){o=o||{};return '<g'+(o.anim?an('lb-a-down',0,'--from:-80px'):'')+'><path d="'+lensShape(t)+'" fill="#BFE6FB" fill-opacity=".55" stroke="#9FD8F5" stroke-width="2.5"/><rect x="'+(LN.x-46)+'" y="'+(LN.y+LN.H+2)+'" width="92" height="22" rx="4" fill="#B98B55" stroke="#7E5C33" stroke-width="2"/></g>'}

/* ───────── 실험 6: 물이 든 통(옆에서 봄) ───────── */
const TK6={x0:210,x1:790,wy:280,by:470,hp:[470,280]};
function tankArt(o){o=o||{};const T=TK6;let g='';
 g+='<rect x="'+T.x0+'" y="'+T.wy+'" width="'+(T.x1-T.x0)+'" height="'+(T.by-T.wy)+'" fill="'+(o.milk?'#E4EBF1':'#9CCBE6')+'" opacity="'+(o.milk?(o.dark?.2:.75):.45)+'"'+(o.milkAnim?an('lb-a-fade',.9):'')+'/>';
 if(o.milk&&o.milkAnim)g+='<rect x="'+T.x0+'" y="'+T.wy+'" width="'+(T.x1-T.x0)+'" height="'+(T.by-T.wy)+'" fill="#9CCBE6" opacity=".45"'+an('lb-a-out',.9)+'/>';
 g+='<path d="M'+T.x0+' 200 V'+T.by+' H'+T.x1+' V200" fill="none" stroke="'+(o.dark?'#9FB3C8':'#7F9BAB')+'" stroke-width="5" stroke-linejoin="round"/><path d="M'+T.x0+' '+T.wy+' H'+T.x1+'" stroke="'+(o.dark?'#CFE3F5':'#5E9CC0')+'" stroke-width="2.5"/>';
 return g}
function inc6(i){return [Math.sin(i*DEG),Math.cos(i*DEG)]}
function ref6(i){const r=Math.asin(Math.sin(i*DEG)/MODEL.water);return [Math.sin(r),Math.cos(r)]}
function toBottom(P,d){let t=(TK6.by-P[1])/d[1];if(P[0]+d[0]*t>TK6.x1-4)t=(TK6.x1-4-P[0])/d[0];return [P[0]+d[0]*t,P[1]+d[1]*t]}
function laser6(i,on,anim){const d=inc6(i),H=TK6.hp,tip=[H[0]-d[0]*140,H[1]-d[1]*140],a=Math.atan2(d[1],d[0])/DEG;return laserDev(tip[0],tip[1],a,on)}

/* ───────── 실험복·보안경 ───────── */
function gog(x,y,s,tint,line){return '<g transform="translate('+x+' '+y+') scale('+(s||1)+')"><rect x="-58" y="-18" width="52" height="36" rx="15" fill="'+tint+'" stroke="'+line+'" stroke-width="4"/><rect x="6" y="-18" width="52" height="36" rx="15" fill="'+tint+'" stroke="'+line+'" stroke-width="4"/><path d="M-6 -2 h12" stroke="'+line+'" stroke-width="5"/><path d="M-58 0 h-14 M58 0 h14" stroke="'+line+'" stroke-width="4"/></g>'}
const GOG={sun:['rgba(40,44,52,.82)','#1F2328'],las:['rgba(255,140,40,.55)','#B35A12']};
function gearArt2(kind,on,anim){const G=kind==='sun'?GOG.sun:GOG.las,withCoat=kind==='lasc';
 if(!on)return (withCoat?coat(300,250,1.4):'')+gog(withCoat?560:480,220,1.2,G[0],G[1])+qmark(480,90);
 const body=withCoat?coat(480,262,1.75):'<path d="M400 190 Q480 168 560 190 L580 330 H380Z" fill="#5C8FCB" stroke="#3D6A9C" stroke-width="3"/>';
 return '<g'+(anim?an('lb-a-up',0,'--from:100px'):'')+'><circle cx="480" cy="116" r="38" fill="#F2C6A0" stroke="#B9875F" stroke-width="3"/>'+gog(480,108,.82,G[0],G[1])+body+'</g>'}

/* ───────── 준비물 카드 ───────── */
function itemArt(k){const A={
  dbox:'<g transform="translate(-129 -104) scale(.34)">'+dbox({}).replace(/<ellipse cx="[^"]*" cy="[^"]*" rx="[^"]*" ry="7"[^>]*\/>/,'')+'</g>',
  flash:'<g transform="scale(.62)">'+flashH(88,0,false)+'</g>',
  toys:objAt(2,-40,8,.34)+objAt(1,22,-12,.34)+objAt(3,30,30,.3),
  hpaper:'<rect x="-58" y="-40" width="116" height="80" rx="3" fill="#14161A"/><rect x="-12" y="-12" width="24" height="24" fill="var(--w-label)"/>',
  bpaper:'<rect x="-58" y="-40" width="116" height="80" rx="3" fill="#14161A"/>',
  sung:gog(0,0,.62,GOG.sun[0],GOG.sun[1]),
  lgog:gog(0,0,.62,GOG.las[0],GOG.las[1]),
  coat:coat(0,4,.62),
  laser:'<g transform="translate(64 0) scale(.82)">'+laserDev(0,0,0,false)+'</g>',
  laserd:'<g transform="translate(64 0) scale(.82)">'+laserDev(0,0,0,false,{fan:1})+'</g>',
  spray:sprayer(0,-28,.62),
  water:'<g transform="translate(0 6) scale(.62)">'+beaker2(0,60,{lvl:70}).replace(/<ellipse[^>]*\/>/,'')+'</g>',
  mirror:'<rect x="-34" y="-46" width="68" height="92" rx="4" fill="#A9DBF5" stroke="#3E7FA8" stroke-width="3"/><path d="M-20 -30 l24 -10 M-20 -14 l34 -14" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/>',
  mstand:'<rect x="-46" y="-14" width="92" height="40" rx="6" fill="#8A939C" stroke="#5B6670" stroke-width="3"/><rect x="-6" y="-14" width="12" height="26" fill="#5B6670"/>',
  wpaper:'<rect x="-50" y="-44" width="100" height="88" rx="2" fill="#FFFDF8" stroke="#B9B2A2" stroke-width="2.5"/>',
  shapes:'<g transform="scale(.72)">'+target({k:'tri',x:-62,y:0},'#5B6B78')+target({k:'sq',x:0,y:0},'#5B6B78')+target({k:'ci',x:62,y:0},'#5B6B78')+'</g>',
  cvx:'<path d="M0 -50 Q34 0 0 50 Q-34 0 0 -50Z" fill="#BFE6FB" stroke="#2E86C1" stroke-width="3"/>',
  ccv:'<path d="M-16 -50 H16 Q4 0 16 50 H-16 Q-4 0 -16 -50Z" fill="#BFE6FB" stroke="#2E86C1" stroke-width="3"/>',
  lstand:'<rect x="-46" y="-14" width="92" height="40" rx="6" fill="#B98B55" stroke="#7E5C33" stroke-width="3"/><rect x="-6" y="-14" width="12" height="26" fill="#7E5C33"/>',
  tank:'<rect x="-56" y="-40" width="112" height="80" fill="rgba(156,203,230,.45)"/><path d="M-56 -50 V40 H56 V-50" fill="none" stroke="#7F9BAB" stroke-width="4"/>',
  milk:'<path d="M-24 -44 H24 V44 H-24Z" fill="#FFFFFF" stroke="#7F9BAB" stroke-width="3"/><path d="M-24 -44 L0 -60 L24 -44" fill="#E8F1F8" stroke="#7F9BAB" stroke-width="3"/><rect x="-24" y="-6" width="48" height="24" fill="#5C8FCB"/>',
  pipet:'<g transform="rotate(-30)"><rect x="-5" y="-30" width="10" height="72" rx="4" fill="rgba(232,244,250,.8)" stroke="#7F9BAB" stroke-width="2.5"/><rect x="-9" y="-58" width="18" height="30" rx="8" fill="#E06C3C"/></g>',
  rod:'<g transform="rotate(35)"><rect x="-5" y="-58" width="10" height="116" rx="5" fill="rgba(232,244,250,.85)" stroke="#7F9BAB" stroke-width="2.5"/></g>'};
 return A[k]||''}
function itemArtAt(k,x,y){return '<g transform="translate('+x+' '+y+') scale(1.4)">'+itemArt(k)+'</g>'}
