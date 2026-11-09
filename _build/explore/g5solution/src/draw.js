/* ───────── 그림: 실험대 장면 — 모두 직접 그린 SVG (용해와 용액) ───────── */
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

/* ───────── 용해와 용액: 실험 기구 그림(모두 직접 그린 SVG) ───────── */
const WC='#BFE3F5',WS='#6FA9CC',GLS='var(--w-glass-s)',PW='#FFFFFF',PWS='#A9B4BC';
const VITC='#F2C230',VITS='#B88A10',YSC='#B9762E',YSS='#7E4D18';
function mixc(a,b,t){const h=x=>[1,3,5].map(i=>parseInt(x.substr(i,2),16));const A=h(a),B=h(b);return '#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('')}
/* 가루 알갱이(바닥에 흩어짐). col 색, n 개수, seed */
function grains(x0,x1,y0,y1,col,st,n,seed,r){let g='';for(let i=0;i<n;i++){const x=x0+rnd(i,seed)*(x1-x0),y=y0+rnd(i,seed+7)*(y1-y0);g+='<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="'+((r||3)*(.7+rnd(i,seed+3)*.5)).toFixed(1)+'" fill="'+col+'" stroke="'+st+'" stroke-width="1"/>'}return g}
/* 바닥에 남은 더미(높이 hh) */
function pile(cx,base,hw,hh,col,st){return '<path d="M'+(cx-hw)+' '+base+' Q'+(cx-hw*.5)+' '+(base-hh*1.5)+' '+cx+' '+(base-hh*1.6)+' Q'+(cx+hw*.5)+' '+(base-hh*1.5)+' '+(cx+hw)+' '+base+'Z" fill="'+col+'" stroke="'+st+'" stroke-width="1.5"/>'+grains(cx-hw*.6,cx+hw*.6,base-hh*1.1,base-2,col,st,Math.round(hw/4),hw,2.2)}
/* 떨어지는 가루(움직임) */
function fallGrains(cx,top,bottom,col,st,seed){let g='<g'+an('lb-a-drop',0,'animation-duration:.9s')+'>';for(let i=0;i<10;i++)g+='<circle cx="'+(cx-18+rnd(i,seed)*36).toFixed(1)+'" cy="'+(top+rnd(i,seed+2)*(bottom-top)).toFixed(1)+'" r="3" fill="'+col+'" stroke="'+st+'" stroke-width="1"/>';return g+'</g>'}
/* 이름 붙임딱지 */
function sticker(cx,y,t,anim){const w=Math.max(70,t.length*15+18);return '<g'+(anim?an('lb-a-pop',.3):'')+'><rect x="'+(cx-w/2)+'" y="'+y+'" width="'+w+'" height="28" rx="4" fill="#FFF4C2" stroke="#B9A04A" stroke-width="2"/>'+(t?'<text x="'+cx+'" y="'+(y+20)+'" text-anchor="middle" font-size="15" font-weight="800" fill="#3A3214">'+t+'</text>':'<path d="M'+(cx-w/2+10)+' '+(y+14)+' h'+(w-20)+'" stroke="#D8C78A" stroke-width="2" stroke-dasharray="4 4"/>')+'</g>'}
/* 약숟가락(가루를 담은). rot 기울기 */
function spoonArt(x,y,rot,col,st){return '<g transform="translate('+x+' '+y+') rotate('+(rot||0)+')"><rect x="-70" y="-4" width="64" height="8" rx="4" fill="#C9D1D8" stroke="#7F8C99" stroke-width="2"/><ellipse cx="6" cy="0" rx="16" ry="10" fill="#DDE3E8" stroke="#7F8C99" stroke-width="2"/>'+(col?'<ellipse cx="6" cy="-4" rx="12" ry="6" fill="'+col+'" stroke="'+st+'" stroke-width="1.2"/>':'')+'</g>'}
/* 유리 막대 */
function rodArt(x,y,len,rot,anim){return '<g'+(anim?an('lb-a-stir',0):'')+'><g transform="translate('+x+' '+y+') rotate('+(rot||0)+')"><rect x="-4" y="0" width="8" height="'+len+'" rx="4" fill="rgba(220,236,246,.85)" stroke="'+GLS+'" stroke-width="2"/></g></g>'}
/* 젓는 모습(점선 소용돌이) */
function swirl(cx,y,w){return '<g'+an('lb-a-fade',0)+'><path d="M'+(cx-w)+' '+y+' q'+w+' -18 '+(2*w)+' 0 q'+(-w)+' 18 '+(-2*w)+' 0" fill="none" stroke="'+WS+'" stroke-width="2.5" stroke-dasharray="6 5"/></g>'}
/* 핀셋 */
function tweezArt(x,y,rot,item){return '<g transform="translate('+x+' '+y+') rotate('+(rot||0)+')"><path d="M-4 -110 L-10 -6 L-4 -4 L2 -108Z" fill="#B9C2CA" stroke="#5D6B78" stroke-width="2"/><path d="M4 -110 L10 -6 L4 -4 L-2 -108Z" fill="#CBD3DB" stroke="#5D6B78" stroke-width="2"/>'+(item||'')+'</g>'}
/* 각설탕 */
function cubeArt(x,y,s){s=s||1;const a=18*s;return '<g><path d="M'+(x-a)+' '+(y-a*1.4)+' l'+(a*.5)+' '+(-a*.35)+' h'+(a*2)+' l'+(-a*.5)+' '+(a*.35)+'Z" fill="#F4F6F8" stroke="#B5A787" stroke-width="1.6"/><path d="M'+(x+a)+' '+(y-a*1.4)+' l'+(a*.5)+' '+(-a*.35)+' v'+(a*1.75)+' l'+(-a*.5)+' '+(a*.35)+'Z" fill="#E4E8EC" stroke="#B5A787" stroke-width="1.6"/><rect x="'+(x-a)+'" y="'+(y-a*1.4)+'" width="'+(a*2)+'" height="'+(a*1.4)+'" fill="#FFFFFF" stroke="#B5A787" stroke-width="1.6"/></g>'}
/* 페트리 접시(옆에서 본 모습). base = 바닥 */
function dishArt(cx,base,item){return '<g><ellipse cx="'+cx+'" cy="'+(base-2)+'" rx="58" ry="9" fill="rgba(232,244,250,.85)" stroke="#7F9BAB" stroke-width="2.5"/><path d="M'+(cx-58)+' '+(base-2)+' v-10 M'+(cx+58)+' '+(base-2)+' v-10" stroke="#7F9BAB" stroke-width="2.5"/><ellipse cx="'+cx+'" cy="'+(base-12)+'" rx="58" ry="9" fill="none" stroke="#7F9BAB" stroke-width="2"/>'+(item||'')+'</g>'}
/* 방울토마토 */
function tomatoArt(x,y,r){r=r||17;return '<g><circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="#E2573F" stroke="#9C3424" stroke-width="2"/><ellipse cx="'+(x-r*.35)+'" cy="'+(y-r*.35)+'" rx="'+(r*.22)+'" ry="'+(r*.14)+'" fill="#FFFFFF" opacity=".55"/><path d="M'+(x-8)+' '+(y-r+2)+' l8 5 l8 -5 M'+x+' '+(y-r+6)+' v-9" stroke="#3F8F46" stroke-width="3" fill="none" stroke-linecap="round"/></g>'}
/* 아지랑이 같은 일렁임 */
function haze(cx,y,anim){let g='';for(let i=0;i<4;i++)g+='<path d="M'+(cx-24+i*3)+' '+(y-i*20)+' q12 -8 24 0 q12 8 24 0" fill="none" stroke="#7FB2CF" stroke-width="2.4" opacity="'+(1-i*.18)+'"'+(anim?an('lb-a-haze',i*.25):'')+'/>';return g}

/* ── 유리병(뚜껑이 있는 병). o: lv 물 높이(0~1) · tint 물 색 · op · cloud 뿌연 정도 · grains 바닥 가루 색 · pile 바닥에 쌓인 흰 물질 · lid · lidAnim · label · rise · s 크기 ── */
const JW=58,JH=158;
function glassJar(cx,base,o){o=o||{};const s=o.s||1,w=JW*s,h=JH*s,top=base-h;let g=o.noShadow?'':shadow(cx,base+4,w+10);
 const body='M'+(cx-w)+' '+(top+22*s)+' Q'+(cx-w)+' '+top+' '+(cx-w+22*s)+' '+top+' H'+(cx+w-22*s)+' Q'+(cx+w)+' '+top+' '+(cx+w)+' '+(top+22*s)+' V'+(base-12)+' Q'+(cx+w)+' '+base+' '+(cx+w-12)+' '+base+' H'+(cx-w+12)+' Q'+(cx-w)+' '+base+' '+(cx-w)+' '+(base-12)+'Z';
 g+='<path d="'+body+'" fill="rgba(232,244,250,.45)"/>';
 if(o.lv){const wy=base-o.lv*(h-30*s);const col=o.tint||WC;
  g+='<g'+(o.rise?an('lb-a-rise',.2):'')+'><path d="M'+(cx-w+4)+' '+wy.toFixed(1)+' H'+(cx+w-4)+' V'+(base-12)+' Q'+(cx+w-4)+' '+(base-4)+' '+(cx+w-14)+' '+(base-4)+' H'+(cx-w+14)+' Q'+(cx-w+4)+' '+(base-4)+' '+(cx-w+4)+' '+(base-12)+'Z" fill="'+col+'" fill-opacity="'+(o.op||.8)+'"/>';
  if(o.cloud){g+='<path d="M'+(cx-w+4)+' '+wy.toFixed(1)+' H'+(cx+w-4)+' V'+(base-6)+' H'+(cx-w+4)+'Z" fill="#FFFFFF" fill-opacity="'+(.62*o.cloud).toFixed(2)+'"/>'+grains(cx-w+10,cx+w-10,wy+8,base-10,'#FFFFFF','#D5DCE0',Math.round(26*o.cloud),5,1.6)}
  g+='<path d="M'+(cx-w+4)+' '+wy.toFixed(1)+' H'+(cx+w-4)+'" stroke="'+(o.tint&&o.tint!==WC?mixc(o.tint,'#806010',.3):WS)+'" stroke-width="3"/></g>'}
 if(o.grains)g+=grains(cx-w+12,cx+w-12,base-20,base-7,o.grains,o.gst||PWS,16,cx,3);
 if(o.pile)g+=pile(cx,base-5,w-12,o.pile,'#F8F8F4','#C2C8CC');
 if(o.inner)g+=o.inner;
 g+='<path d="'+body+'" fill="none" stroke="'+GLS+'" stroke-width="3.5"/><path d="M'+(cx-w+10)+' '+(top+30*s)+' V'+(base-24)+'" stroke="#FFFFFF" stroke-width="4" opacity=".55" stroke-linecap="round"/>';
 g+='<rect x="'+(cx-w*.72)+'" y="'+(top-8*s)+'" width="'+(w*1.44)+'" height="'+(10*s)+'" rx="3" fill="rgba(232,244,250,.6)" stroke="'+GLS+'" stroke-width="2.5"/>';
 if(o.lid)g+='<g'+(o.lidAnim?an('lb-a-down',0,'--from:-80px'):'')+'><rect x="'+(cx-w*.82)+'" y="'+(top-24*s)+'" width="'+(w*1.64)+'" height="'+(20*s)+'" rx="5" fill="#4F7FB0" stroke="#2D5582" stroke-width="2.5"/><path d="M'+(cx-w*.7)+' '+(top-14*s)+' h'+(w*1.4)+'" stroke="#6E9CCB" stroke-width="2"/></g>';
 if(o.label!=null)g+=sticker(cx,top+12*s,o.label,o.labelAnim);
 return g}
/* ── 비커. o: big(250 mL) · ml 물의 양 · tint · op · pile · fall 떨어지는 가루 색 · stir 젓는 중 · rod · label · cnt 위 이름 · steam · tom 방울토마토 높이(0~1) · film 벽에 남은 용액 ── */
function bkDim(o){return o.big?{w:78,h:206,k:.8}:{w:62,h:150,k:1.2}}
function beakerArt(cx,base,o){o=o||{};const D=bkDim(o),w=D.w,h=D.h,top=base-h;let g=o.noShadow?'':shadow(cx,base+4,w+8);
 const out='M'+(cx-w)+' '+top+' V'+(base-10)+' Q'+(cx-w)+' '+base+' '+(cx-w+10)+' '+base+' H'+(cx+w-10)+' Q'+(cx+w)+' '+base+' '+(cx+w)+' '+(base-10)+' V'+top;
 g+='<path d="'+out+'" fill="rgba(232,244,250,.45)"/>';
 const wy=base-(o.ml||0)*D.k;
 if(o.ml){const col=o.tint||WC;
  g+='<g'+(o.rise?an('lb-a-rise',.2):'')+'><path d="M'+(cx-w+3)+' '+wy.toFixed(1)+' H'+(cx+w-3)+' V'+(base-10)+' Q'+(cx+w-3)+' '+(base-3)+' '+(cx+w-10)+' '+(base-3)+' H'+(cx-w+10)+' Q'+(cx-w+3)+' '+(base-3)+' '+(cx-w+3)+' '+(base-10)+'Z" fill="'+col+'" fill-opacity="'+(o.op||.8)+'"/><path d="M'+(cx-w+3)+' '+wy.toFixed(1)+' H'+(cx+w-3)+'" stroke="'+(o.tint?mixc(o.tint,'#202020',.25):WS)+'" stroke-width="3"/></g>'}
 if(o.film)g+=o.film;
 if(o.pile)g+=pile(cx,base-4,Math.min(w-12,20+o.pile*9),4+o.pile*3,o.pcol||'#FAFAF6',o.pst||'#9AA6AF');
 if(o.grains)g+=grains(cx-w+14,cx+w-14,base-16,base-6,o.grains,o.gst||PWS,14,cx,3);
 if(o.fall)g+=fallGrains(cx,wy+6,base-10,o.fall,o.fst||PWS,cx);
 if(o.stir)g+=swirl(cx,(wy+base)/2,w*.55);
 if(o.tom!=null){const r=22,lo=base-6-r,hi=wy+r*.3,y=lo-o.tom*(lo-hi);g+='<g'+(o.tomAnim?an('lb-a-down',0,'--from:'+(-(y-top+40))+'px'):'')+'>'+tomatoArt(cx,y,r)+'</g>'}
 if(o.inner)g+=o.inner;
 g+='<path d="'+out+'" fill="none" stroke="'+GLS+'" stroke-width="3.5"/><path d="M'+(cx-w-9)+' '+top+' h12" stroke="'+GLS+'" stroke-width="3.5"/>';
 const step=o.big?50:25;for(let m=step;m<=(o.big?250:100);m+=step)g+='<path d="M'+(cx+w-24)+' '+(base-m*D.k)+' h16" stroke="'+GLS+'" stroke-width="2"/>';
 if(o.rod)g+=rodArt(cx+14,top-56,h+30,12,o.stir);
 if(o.steam){for(let k=0;k<3;k++)g+='<path d="M'+(cx-20+k*20)+' '+(wy-10)+' q-6 -12 0 -24 q6 -12 0 -24" fill="none" stroke="#E2A3A3" stroke-width="3" stroke-linecap="round"/>'}
 if(o.label!=null)g+=sticker(cx,top+10,o.label,o.labelAnim);
 if(o.cnt)g+=mini(cx,top-28,o.cnt,o.cntSz||19);
 return g}
/* 눈금실린더(세워 둠). lv 물 높이 px */
function cylArt(cx,base,lv,o){o=o||{};const w=17,h=236,top=base-h;let g=shadow(cx,base+4,40)+'<path d="M'+(cx-36)+' '+base+' h72 l-6 -14 h-60z" fill="#DCE6EC" stroke="'+GLS+'" stroke-width="2.5"/>';
 g+='<rect x="'+(cx-w)+'" y="'+top+'" width="'+(2*w)+'" height="'+(h-14)+'" fill="rgba(232,244,250,.45)"/>';
 if(lv)g+='<rect x="'+(cx-w+3)+'" y="'+(base-14-lv)+'" width="'+(2*w-6)+'" height="'+lv+'" fill="'+WC+'" fill-opacity=".85"/>';
 g+='<rect x="'+(cx-w)+'" y="'+top+'" width="'+(2*w)+'" height="'+(h-14)+'" fill="none" stroke="'+GLS+'" stroke-width="3"/>';
 for(let i=1;i<=10;i++)g+='<path d="M'+(cx-w)+' '+(base-14-i*20)+' h'+(i%5?8:14)+'" stroke="'+GLS+'" stroke-width="1.8"/>';
 return g}
/* 물을 따르는 눈금실린더(기울임) */
function pourCyl(x,y,rot,anim){return '<g'+(anim?an('lb-a-fade',0):'')+'><g transform="translate('+x+' '+y+') rotate('+rot+')"><rect x="-15" y="-150" width="30" height="150" fill="rgba(232,244,250,.55)" stroke="'+GLS+'" stroke-width="3"/><rect x="-12" y="-60" width="24" height="57" fill="'+WC+'"/></g></g>'}
function streamArt(x1,y1,x2,y2){return '<path d="M'+x1+' '+y1+' Q'+(x1+6)+' '+((y1+y2)/2)+' '+x2+' '+y2+'" stroke="'+WC+'" stroke-width="6" fill="none" stroke-linecap="round" stroke-dasharray="12 8"'+an('lb-a-stream',0)+'/>'}
/* 흰 종이(비커 뒤) */
function paperBack(x,y,w,h,anim){return '<g'+(anim?an('lb-a-up',0,'--from:60px'):'')+'><rect x="'+(x+6)+'" y="'+(y+8)+'" width="'+w+'" height="'+h+'" rx="6" fill="var(--w-shadow)"/><rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="6" fill="#FFFFFF" stroke="#C9CFD4" stroke-width="2"/></g>'}
/* 철끈(모루)으로 만든 모양과 거기에 붙은 백반 알갱이 */
function moruArt(cx,cy){return '<path d="M'+cx+' '+(cy-60)+' V'+(cy-34)+'" stroke="#8A8F96" stroke-width="2"/><path d="M'+cx+' '+(cy-34)+' L'+(cx+26)+' '+cy+' L'+cx+' '+(cy+34)+' L'+(cx-26)+' '+cy+'Z" fill="none" stroke="#C0569A" stroke-width="7" stroke-linejoin="round"/>'}
function moruCrys(cx,cy,n){let g='';const P=[[cx,cy-34],[cx+26,cy],[cx,cy+34],[cx-26,cy]];
 for(let k=0;k<n;k++){const p=P[k%4],q=P[(k+1)%4],f=rnd(k,3),x=p[0]+(q[0]-p[0])*f,y=p[1]+(q[1]-p[1])*f,s=4+rnd(k,4)*5;g+='<path d="M'+x.toFixed(1)+' '+(y-s).toFixed(1)+' l'+s.toFixed(1)+' '+s.toFixed(1)+' l'+(-s).toFixed(1)+' '+s.toFixed(1)+' l'+(-s).toFixed(1)+' '+(-s).toFixed(1)+'z" fill="#FFFFFF" stroke="#8FB9D6" stroke-width="1.5"/>'}
 return g}
function crystalsBottom(cx,base,w,n){let g='';for(let k=0;k<n;k++){const s=2.5+rnd(k,6)*4,x=cx-w+rnd(k,5)*2*w;g+='<path d="M'+x.toFixed(1)+' '+(base-s).toFixed(1)+' l'+s.toFixed(1)+' '+s.toFixed(1)+' l'+(-s).toFixed(1)+' '+s.toFixed(1)+' l'+(-s).toFixed(1)+' '+(-s).toFixed(1)+'z" fill="#FFFFFF" stroke="#8FB9D6" stroke-width="1.2"/>'}return g}
/* 가루를 담은 작은 그릇(준비물·예상 그림) */
function heap(cx,base,col,st,crys){let g='<path d="M'+(cx-40)+' '+(base-26)+' h80 q-4 26 -40 26 q-36 0 -40 -26z" fill="#E9EEF2" stroke="#8796A3" stroke-width="2.5"/><path d="M'+(cx-34)+' '+(base-26)+' Q'+cx+' '+(base-50)+' '+(cx+34)+' '+(base-26)+'Z" fill="'+col+'" stroke="'+st+'" stroke-width="1.5"/>';
 if(crys)for(let k=0;k<5;k++){const x=cx-20+k*10,y=base-32-rnd(k,9)*8;g+='<path d="M'+x+' '+(y-4)+' l4 4 l-4 4 l-4 -4z" fill="#FFFFFF" stroke="#9FB4C4" stroke-width="1"/>'}
 return g}
/* 물이 든 주전자 모양 병(준비물) */
function waterJug(cx,base){return '<g><path d="M'+(cx-26)+' '+(base-80)+' h52 v68 q0 12 -12 12 h-28 q-12 0 -12 -12z" fill="rgba(232,244,250,.5)" stroke="'+GLS+'" stroke-width="3"/><path d="M'+(cx-23)+' '+(base-52)+' h46 v40 q0 10 -10 10 h-26 q-10 0 -10 -10z" fill="'+WC+'"/><path d="M'+(cx+26)+' '+(base-72)+' q20 4 18 26 q-2 14 -18 16" fill="none" stroke="'+GLS+'" stroke-width="4"/><path d="M'+(cx-26)+' '+(base-80)+' l-10 -8" stroke="'+GLS+'" stroke-width="3"/></g>'}

/* ───────── 준비물 카드 ───────── */
function itemArt(k){const sc=(sv,s,y)=>'<g transform="translate(0 '+(y||0)+') scale('+s+')">'+sv.replace(/<ellipse[^>]*fill="var\(--w-shadow\)"[^>]*\/>/,'')+'</g>';
 const A={
  water:sc(waterJug(0,0),1.1,52),
  sugar:sc(heap(0,0,'#FFFFFF','#B8C2CA'),1,40),
  salt:sc(heap(0,0,'#FBFBFB','#AEB8C0'),1,40),
  vit:sc(heap(0,0,VITC,VITS),1,40),
  calc:sc(heap(0,0,'#F6F6F2','#C3C3BA'),1,40),
  alum:sc(heap(0,0,'#F4F8FB','#A9BCCB',1),1,40),
  ysugar:sc(heap(0,0,YSC,YSS),1,40),
  wsugar:sc(heap(0,0,'#FFFFFF','#B8C2CA'),1,40),
  jar3:sc(glassJar(-46,0,{noShadow:1,s:.62})+glassJar(0,0,{noShadow:1,s:.62})+glassJar(46,0,{noShadow:1,s:.62}),.95,48),
  jar:sc(glassJar(0,0,{noShadow:1,s:.8}),1,54),
  spoon3:spoonArt(30,-18,-8)+spoonArt(34,0,-8)+spoonArt(38,18,-8),
  spoon:spoonArt(32,0,-10),
  watch:'<g transform="scale(.6)">'+stopwatch(0,10,'00:00',1)+'</g>',
  sticker:sticker(0,-30,'',0)+sticker(0,4,'',0),
  pen:pen(0,40,LCOL.k,30),
  gear:coat(-30,4,.5)+goggles(28,-24,.5)+hand(30,26,-60,.55,1),
  cube:cubeArt(0,22,1.5),
  dish:dishArt(0,26),
  scale:'<g transform="translate(-50 -96) scale(.32)">'+escale(160,{}).replace(/<ellipse[^>]*\/>/,'')+'</g>',
  tweez:tweezArt(0,52,20),
  beaker3:sc(beakerArt(-50,0,{noShadow:1})+beakerArt(0,0,{noShadow:1})+beakerArt(50,0,{noShadow:1}),.46,50),
  beaker2:sc(beakerArt(-44,0,{noShadow:1})+beakerArt(44,0,{noShadow:1}),.5,50),
  cyl:sc(cylArt(0,0,0).replace(/<ellipse[^>]*\/>/,''),.4,50),
  rod3:rodArt(-14,-50,96,-12)+rodArt(0,-50,96,0)+rodArt(14,-50,96,12),
  rod2:rodArt(-8,-50,96,-8)+rodArt(8,-50,96,8),
  cold:sc(beakerArt(0,0,{noShadow:1,ml:60,inner:'<rect x="-30" y="-74" width="22" height="18" rx="3" fill="#EAF6FC" stroke="#8FB9D6" stroke-width="2" transform="rotate(-12 -19 -65)"/><rect x="6" y="-70" width="20" height="16" rx="3" fill="#EAF6FC" stroke="#8FB9D6" stroke-width="2"/>'}),.5,48),
  warm:sc(beakerArt(0,0,{noShadow:1,ml:60,steam:1}),.5,48),
  wpaper:'<rect x="-50" y="-58" width="100" height="116" rx="6" fill="#FFFFFF" stroke="#C9CFD4" stroke-width="2.5"/>',
  tomato:tomatoArt(-16,10,20)+tomatoArt(22,16,20),
  towel:towel(0,0)};
 return A[k]||''}
