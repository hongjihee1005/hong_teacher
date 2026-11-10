/* ───────── 그림: 실험대 장면 — 모두 직접 그린 SVG (산과 염기) ───────── */
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
/* 흰 종이(비커 뒤) */
function paperBack(x,y,w,h,anim){return '<g'+(anim?an('lb-a-up',0,'--from:60px'):'')+'><rect x="'+(x+6)+'" y="'+(y+8)+'" width="'+w+'" height="'+h+'" rx="6" fill="var(--w-shadow)"/><rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="6" fill="#FFFFFF" stroke="#C9CFD4" stroke-width="2"/></g>'}
/* 철끈(모루)으로 만든 모양과 거기에 붙은 백반 알갱이 */

/* ───────── 산과 염기: 실험 기구 그림(모두 직접 그린 SVG) ───────── */
function tomatoArt(){return ''}
const CAPC='#E2573F',CAPS='#A33A2A',PLF='#EEF3F6',PLS='#9FB3BF';
/* 점적병. o: col·op 용액 · letter 뒤 글씨 · foam 거품 수 · foamOut 거품이 사라지는 중 · tilt · s 크기 · empty */
function dropBottle(cx,base,o){o=o||{};const s=o.s||1,w=26*s,h=104*s,top=base-h;let g=o.noShadow?'':shadow(cx,base+4,w+10);
 g+='<rect x="'+(cx-w)+'" y="'+top+'" width="'+2*w+'" height="'+h+'" rx="'+10*s+'" fill="rgba(232,244,250,.4)"/>';
 if(o.letter)g+='<text x="'+cx+'" y="'+(base-28*s)+'" text-anchor="middle" font-size="'+36*s+'" font-weight="800" fill="#2A3342">가</text>';
 if(!o.empty&&o.col){const ly=base-80*s;g+='<g'+(o.fill?an('lb-a-rise',.1):'')+'><rect x="'+(cx-w+3)+'" y="'+ly+'" width="'+(2*w-6)+'" height="'+(80*s-4)+'" rx="'+7*s+'" fill="'+o.col+'" fill-opacity="'+(o.op==null?.8:o.op)+'"/>'+
  '<path d="M'+(cx-w+3)+' '+ly+' H'+(cx+w-3)+'" stroke="'+mixc(o.col.length===7?o.col:'#DFF0F7','#405060',.35)+'" stroke-width="2.5"/></g>';
  if(o.foam){let b='';for(let k=0;k<7;k++)b+='<circle cx="'+(cx-w+7+k*(2*w-14)/6).toFixed(1)+'" cy="'+(ly+3-(k%2)*5*s)+'" r="'+(5*s)+'" fill="#FFFFFF" stroke="#B9CCD8" stroke-width="1.5"/>';
   g+=o.foamOut?'<g'+an('lb-a-out',o.foamOut,'animation-duration:.8s')+'>'+b+'</g>':b}}
 g+='<rect x="'+(cx-w)+'" y="'+top+'" width="'+2*w+'" height="'+h+'" rx="'+10*s+'" fill="none" stroke="'+GLS+'" stroke-width="3"/><path d="M'+(cx-w+8)+' '+(top+12)+' V'+(base-14)+'" stroke="#FFFFFF" stroke-width="3.5" opacity=".55" stroke-linecap="round"/>';
 g+='<rect x="'+(cx-11*s)+'" y="'+(top-12*s)+'" width="'+22*s+'" height="'+14*s+'" fill="rgba(232,244,250,.6)" stroke="'+GLS+'" stroke-width="2"/>';
 g+='<path d="M'+(cx-15*s)+' '+(top-10*s)+' v-14 h'+30*s+' v14z" fill="'+CAPC+'" stroke="'+CAPS+'" stroke-width="2"/><path d="M'+(cx-7*s)+' '+(top-24*s)+' l'+7*s+' '+(-26*s)+' l'+7*s+' '+26*s+'z" fill="'+CAPC+'" stroke="'+CAPS+'" stroke-width="2"/>';
 return g}
/* 기울여 방울을 떨어뜨리는 점적병(손에 든 모습) */
function dropperTilt(x,y,col,op,anim){return '<g'+(anim?an('lb-a-fade',0):'')+'><g transform="translate('+x+' '+y+') rotate(160)">'+dropBottle(0,0,{col,op,noShadow:1,s:.7})+'</g></g>'}
/* 떨어지는 방울 */
function drops(x,y0,y1,col,n,delay){let g='';for(let k=0;k<n;k++)g+='<g'+an('lb-a-drip',(delay||0)+k*.35,'animation-duration:.6s')+'><path d="M'+x+' '+(y0+(y1-y0)*.5)+' q-6 10 0 14 q6 -4 0 -14z" fill="'+col+'" stroke="#7AA7BD" stroke-width="1.2"/></g>';return g}
/* 짧은 이름표(그림 안) */
function wlab(x,y,t,sz){return mini(x,y,t,sz||15)}
/* ── 홈판(한 줄). wells: [{col,op,inner}] · x 위치 WX ── */
const WX=[205,315,425,535,645,755],WY=BY-52;
function plate1(wells,o){o=o||{};let g=shadow(480,BY+4,340)+'<rect x="148" y="'+(WY-34)+'" width="664" height="86" rx="14" fill="#D5DEE4" stroke="'+PLS+'" stroke-width="2.5"/><rect x="148" y="'+(WY-38)+'" width="664" height="72" rx="16" fill="'+PLF+'" stroke="'+PLS+'" stroke-width="3"/>';
 WX.forEach((x,i)=>{const w=wells[i]||{};g+='<ellipse cx="'+x+'" cy="'+WY+'" rx="44" ry="21" fill="#FFFFFF" stroke="'+PLS+'" stroke-width="3"/><path d="M'+(x-40)+' '+(WY-4)+' Q'+x+' '+(WY+22)+' '+(x+40)+' '+(WY-4)+'" fill="none" stroke="#DCE5EA" stroke-width="3"/>';
  if(w.col)g+='<g'+(w.anim?an('lb-a-fade',w.delay||0,'animation-duration:'+(w.dur||.8)+'s'):'')+'><ellipse cx="'+x+'" cy="'+(WY+2)+'" rx="37" ry="16" fill="'+w.col+'" fill-opacity="'+(w.op==null?.9:w.op)+'"/></g>';
  if(w.over)g+='<g'+an('lb-a-fade',w.over[1]||1,'animation-duration:1s')+'><ellipse cx="'+x+'" cy="'+(WY+2)+'" rx="37" ry="16" fill="'+w.over[0]+'" fill-opacity=".92"/></g>';
  if(w.inner)g+=w.inner});
 if(o.labels)WX.forEach((x,i)=>{g+=wlab(x,BY+32,o.labels[i],15)});
 return g}
/* 리트머스 시험지(홈에 꽂힌 모습). col 처음 색 · to 바뀐 색(늦게 나타남) */
function stripIn(x,y,col,dx,rot,o){o=o||{};const r='<rect x="-6" y="-56" width="12" height="60" rx="2" fill="'+col+'" stroke="#FFFFFF" stroke-width="1.5"/>';
 let g='<g transform="translate('+(x+dx)+' '+(y+4)+') rotate('+rot+')">'+r;
 if(o.to)g+='<g'+(o.later!=null?an('lb-a-fade',o.later,'animation-duration:1s'):'')+'><rect x="-6" y="-26" width="12" height="30" rx="2" fill="'+o.to+'" stroke="#FFFFFF" stroke-width="1.5"/></g>';
 g+='</g>';return o.fall?'<g'+an('lb-a-down',o.fall,'--from:-120px')+'>'+g+'</g>':g}
/* ── 홈판(두 줄, 실험 4) ── */
const WX4=[330,450,570,690],WYB=BY-108,WYF=BY-46;
function plate2(o){o=o||{};let g=shadow(510,BY+4,270)+'<rect x="268" y="'+(BY-150)+'" width="484" height="150" rx="14" fill="#D5DEE4" stroke="'+PLS+'" stroke-width="2.5"/><rect x="268" y="'+(BY-154)+'" width="484" height="138" rx="16" fill="'+PLF+'" stroke="'+PLS+'" stroke-width="3"/>';
 [[WYB,38,15,0],[WYF,42,18,1]].forEach(([y,rx,ry,r])=>{WX4.forEach((x,k)=>{g+='<ellipse cx="'+x+'" cy="'+y+'" rx="'+rx+'" ry="'+ry+'" fill="#FFFFFF" stroke="'+PLS+'" stroke-width="3"/>';
  const c=o.cell?o.cell(r,k):null;if(c&&c.col)g+='<ellipse cx="'+x+'" cy="'+(y+2)+'" rx="'+(rx-6)+'" ry="'+(ry-4)+'" fill="'+c.col+'" fill-opacity=".95"/>';if(c&&c.inner)g+=c.inner})});
 if(o.lid)g+='<g'+(o.lidAnim?an('lb-a-down',0,'--from:-90px'):'')+'><rect x="262" y="'+(BY-166)+'" width="496" height="150" rx="18" fill="rgba(225,238,246,.35)" stroke="#8FB0C4" stroke-width="3"/><path d="M280 '+(BY-156)+' h120" stroke="#FFFFFF" stroke-width="4" opacity=".7"/></g>';
 g+=wlab(178,WYB+6,'묽은 염산',16)+wlab(178,WYF+6,'수산화 나트륨',16);
 if(!o.nolab)WX4.forEach((x,k)=>{g+=wlab(x,BY+30,MATS[k],15)});
 return g}
/* 네 가지 물질(melt 0~1 녹아 작아짐 · soft 0~1 흐물흐물해짐) */
function matArt(k,x,y,melt,soft,s){s=(s||1)*(1-.62*(melt||0));soft=soft||0;let h='<g transform="translate('+x+' '+y+') scale('+s.toFixed(3)+')"'+(soft?' opacity="'+(1-.5*soft).toFixed(2)+'"':'')+'>';
 const wob=soft?' stroke-dasharray="'+(3+soft*4).toFixed(1)+' '+(2+soft*3).toFixed(1)+'"':'';
 if(k===0)h+='<path d="M-18 -10 l14 -8 l16 4 l8 14 l-10 12 l-18 2 l-12 -10z" fill="#FBF3E6" stroke="#B89A72" stroke-width="2"/><path d="M-8 -4 l10 2 M4 6 l6 -4" stroke="#D9C4A4" stroke-width="1.5"/>';
 else if(k===1)h+='<path d="M0 14 L-22 -6 q22 -22 44 0z" fill="#F0E0D0" stroke="#A9846A" stroke-width="2"/><path d="M0 14 L-12 -12 M0 14 L0 -16 M0 14 L12 -12" stroke="#A9846A" stroke-width="1.5"/>';
 else if(k===2)h+=soft?'<path d="M-24 2 q-2 -16 12 -18 q6 -6 14 -2 q14 -2 20 8 q8 10 -2 18 q-6 8 -20 6 q-14 4 -22 -4z" fill="#FFFFFF" stroke="#BFC6CC" stroke-width="2"'+wob+'/>':'<path d="M-20 0 q0 -16 20 -16 q20 0 20 16 q0 14 -20 14 q-20 0 -20 -14z" fill="#FFFFFF" stroke="#BFC6CC" stroke-width="2"/>';
 else if(k===3)h+=soft?'<path d="M-26 -8 q8 -6 20 -4 q14 -4 28 2 q6 8 0 16 q-12 6 -26 4 q-14 2 -22 -6 q-4 -6 0 -12z" fill="#F3DCCB" stroke="#C7A08A" stroke-width="2"'+wob+'/>':'<rect x="-22" y="-10" width="44" height="20" rx="5" fill="#F3DCCB" stroke="#C7A08A" stroke-width="2"/><path d="M-18 -4 h36 M-18 2 h36" stroke="#E2BFA6" stroke-width="2"/>';
 else if(k===4)h+='<path d="M-18 -12 l20 -6 l18 8 l2 16 l-16 10 l-22 -4 l-6 -14z" fill="#ECEAE4" stroke="#9A968C" stroke-width="2"/><path d="M-10 -6 q8 6 18 2 M-4 6 q6 -2 12 2" stroke="#BDB8AC" stroke-width="1.5" fill="none"/>';
 else if(k===5)h+=soft?'<path d="M-22 -12 q10 -4 22 -2 q14 -2 22 4 q4 10 -2 20 q-14 4 -22 2 q-12 2 -20 -4 q-4 -10 0 -20z" fill="#FBF6E6" stroke="#CFC6A8" stroke-width="2"'+wob+'/>':'<rect x="-20" y="-14" width="40" height="28" rx="3" fill="#FBF6E6" stroke="#CFC6A8" stroke-width="2"/>';
 return h+'</g>'}
/* 기포(물질 둘레) — anim이면 올라감 */
function bubs(x,y,n,anim,seed){let g='';for(let b=0;b<n;b++){const bx=x-16+rnd(b,seed||1)*32,by=y-2-rnd(b,(seed||1)+3)*16,r=2+rnd(b,(seed||1)+5)*2;
 g+='<circle'+(anim?' class="lb-bub" style="--h:-22px;animation-delay:-'+(rnd(b,9)*1.4).toFixed(2)+'s"':'')+' cx="'+bx.toFixed(1)+'" cy="'+by.toFixed(1)+'" r="'+r.toFixed(1)+'" fill="#FFFFFF" stroke="#7FB2CF" stroke-width="1.2"/>'}return g}
/* 물질을 집은 핀셋 */
function tweezWith(x,y,k){return '<g'+an('lb-a-fade',0)+'>'+tweezArt(x+18,y-10,20,'')+matArt(k,x,y-6,0,0,.7)+'</g>'}
/* ── 붉은 양배추 ── */
function cabBits(cx,y,n,w,seed){let g='';for(let i=0;i<n;i++){const x=cx-w+rnd(i,seed||2)*2*w,yy=y-rnd(i,(seed||2)+4)*18,r=rnd(i,(seed||2)+1)*80-40;g+='<rect x="'+(x-8).toFixed(1)+'" y="'+(yy-4).toFixed(1)+'" width="16" height="8" rx="3" fill="#7B2E72" stroke="#4E1B4A" stroke-width="1" transform="rotate('+r.toFixed(0)+' '+x.toFixed(1)+' '+yy.toFixed(1)+')"/>'}return g}
function cabHead(x,y,s){return '<g transform="translate('+x+' '+y+') scale('+(s||1)+')"><circle r="40" fill="#7B2E72"/><path d="M-30 -10 q30 -30 60 0 M-34 10 q34 -26 68 0 M-26 26 q26 -18 52 0" stroke="#B56AA8" stroke-width="5" fill="none"/></g>'}
function kettleArt(x,y,rot){return '<g transform="translate('+x+' '+y+') rotate('+(rot||0)+')"><path d="M-46 30 q-6 -54 46 -58 q52 4 46 58z" fill="#C9D1D8" stroke="#5D6B78" stroke-width="3"/><path d="M-50 4 q-34 -6 -46 -30" stroke="#5D6B78" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M-50 4 q-34 -6 -46 -30" stroke="#C9D1D8" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M-26 -30 q26 -36 52 0" stroke="#3B4650" stroke-width="7" fill="none"/><rect x="-46" y="26" width="92" height="8" rx="3" fill="#7F8C99"/></g>'}
function sieveArt(x,y,inner){let g='<g transform="translate('+x+' '+y+')"><path d="M-62 0 q62 70 124 0z" fill="#E4E9ED" stroke="#5D6B78" stroke-width="3"/>';for(let i=-48;i<=48;i+=12)g+='<path d="M'+i+' 2 v'+(30-Math.abs(i)*.4).toFixed(0)+'" stroke="#AEB8C0" stroke-width="1.2"/>';
 return g+'<path d="M62 0 h46" stroke="#5D6B78" stroke-width="7" stroke-linecap="round"/>'+(inner||'')+'</g>'}
/* ── 종이·가위·색연필 ── */
function textPaper(x,y,w,h){return '<rect x="'+(x+6)+'" y="'+(y+8)+'" width="'+w+'" height="'+h+'" rx="6" fill="var(--w-shadow)"/><rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="6" fill="#FFFFFF" stroke="#C9CFD4" stroke-width="2"/>'}
function scisArt(x,y,rot,open){return '<g transform="translate('+x+' '+y+') rotate('+(rot||0)+')"><path d="M0 0 L60 '+(open?-14:-4)+'" stroke="#8796A3" stroke-width="7" stroke-linecap="round"/><path d="M0 0 L60 '+(open?14:4)+'" stroke="#AEB8C0" stroke-width="7" stroke-linecap="round"/><circle cx="-16" cy="-12" r="12" fill="none" stroke="#E2573F" stroke-width="6"/><circle cx="-16" cy="12" r="12" fill="none" stroke="#E2573F" stroke-width="6"/><circle r="3" fill="#3B4650"/></g>'}
function stripFlat(x,y,col,w){return '<rect x="'+x+'" y="'+y+'" width="'+(w||110)+'" height="16" rx="2" fill="'+col+'" stroke="#FFFFFF" stroke-width="1.5"/>'}
function crayonArt(x,y,col,rot){return '<g transform="translate('+x+' '+y+') rotate('+(rot||0)+')"><rect x="-6" y="-40" width="12" height="62" rx="3" fill="'+col+'"/><path d="M-6 -40 l6 -14 l6 14z" fill="'+col+'"/><rect x="-6" y="-24" width="12" height="20" fill="#FFFFFF" opacity=".55"/></g>'}
function guideArt(x,y,s){let g='<g transform="translate('+x+' '+y+') scale('+(s||1)+')"><rect x="-70" y="-46" width="140" height="92" rx="6" fill="#FFFFFF" stroke="#C9CFD4" stroke-width="2.5"/>';for(let r=0;r<2;r++)for(let c=0;c<4;c++)g+='<circle cx="'+(-48+c*32)+'" cy="'+(-18+r*36)+'" r="11" fill="none" stroke="#9FB3BF" stroke-width="2"/><path d="M'+(-56+c*32)+' '+(-2+r*36)+' h16" stroke="#C9CFD4" stroke-width="2"/>';return g+'</g>'}
function plateMini(x,y,s,lid){let g='<g transform="translate('+x+' '+y+') scale('+(s||1)+')"><rect x="-78" y="-28" width="156" height="56" rx="10" fill="'+PLF+'" stroke="'+PLS+'" stroke-width="3"/>';for(let r=0;r<2;r++)for(let c=0;c<4;c++)g+='<ellipse cx="'+(-54+c*36)+'" cy="'+(-12+r*24)+'" rx="14" ry="8" fill="#FFFFFF" stroke="'+PLS+'" stroke-width="2"/>';
 if(lid)g+='<rect x="-84" y="-36" width="168" height="66" rx="12" fill="rgba(225,238,246,.35)" stroke="#8FB0C4" stroke-width="2.5"/>';return g+'</g>'}

/* ───────── 준비물 카드 ───────── */
function itemArt(k){const sc=(sv,s,y)=>'<g transform="translate(0 '+(y||0)+') scale('+s+')">'+sv.replace(/<ellipse[^>]*fill="var\(--w-shadow\)"[^>]*\/>/g,'')+'</g>';
 const six=()=>{let g='';SOL.forEach((s,i)=>{g+=dropBottle(-75+i*30,0,{col:s.c,op:s.op,noShadow:1,s:.42})});return g};
 const A={
  drop6:sc(six(),1.05,44),
  wpaper:'<rect x="-50" y="-58" width="100" height="116" rx="6" fill="#FFFFFF" stroke="#C9CFD4" stroke-width="2.5"/>',
  tpaper:'<rect x="-50" y="-58" width="100" height="116" rx="6" fill="#FFFFFF" stroke="#C9CFD4" stroke-width="2.5"/><text x="0" y="14" text-anchor="middle" font-size="44" font-weight="800" fill="#2A3342">가</text>',
  watch:'<g transform="scale(.6)">'+stopwatch(0,10,'00:00',1)+'</g>',
  gear:coat(-30,4,.5)+goggles(28,-24,.5)+hand(30,26,-60,.55,1),
  plate:plateMini(0,0,.95),plate2:plateMini(0,-22,.8)+plateMini(0,26,.8),plateL:plateMini(0,0,.9,1),
  guide:guideArt(0,0,.9),
  litB:stripFlat(-55,-30,LIT.b)+stripFlat(-50,-8,LIT.b)+stripFlat(-45,14,LIT.b),
  litR:stripFlat(-55,-30,LIT.r)+stripFlat(-50,-8,LIT.r)+stripFlat(-45,14,LIT.r),
  scis:scisArt(-14,0,-20,1),
  tweez:tweezArt(0,52,20),tweez2:tweezArt(-16,52,14)+tweezArt(18,52,26),
  phen:sc(dropBottle(0,0,{col:'#EEF6FA',op:.4,noShadow:1}),.62,40),
  hcl:sc(dropBottle(0,0,{col:'#DFF0F7',op:.35,noShadow:1}),.62,40),
  naoh:sc(dropBottle(0,0,{col:'#DFF0F7',op:.35,noShadow:1}),.62,40),
  bottle:sc(dropBottle(0,0,{noShadow:1}),.62,40),
  cabdrop:sc(dropBottle(0,0,{col:PURP,op:.9,noShadow:1}),.62,40),
  cab:'<path d="M-50 0 h100 q-6 34 -50 34 q-44 0 -50 -34z" fill="#E9EEF2" stroke="#8796A3" stroke-width="2.5"/>'+cabBits(0,-2,14,38,3),
  beaker2:sc(beakerArt(-44,0,{noShadow:1})+beakerArt(44,0,{noShadow:1}),.5,50),
  kettle:kettleArt(10,6,0),
  sieve:sieveArt(-14,-14,''),
  shell:matArt(0,0,0,0,0,1.8),clam:matArt(1,0,0,0,0,1.8),white:matArt(2,0,0,0,0,1.8),chick:matArt(3,0,0,0,0,1.8),
  rod:rodArt(0,-60,120,20),
  crayon:PAL.map((p,i)=>crayonArt(-50+i*20,10,p[0],-8+i*3)).join('')};
 return A[k]||''}
function streamArt(x1,y1,x2,y2){return '<path d="M'+x1+' '+y1+' Q'+(x1+6)+' '+((y1+y2)/2)+' '+x2+' '+y2+'" stroke="'+WC+'" stroke-width="6" fill="none" stroke-linecap="round" stroke-dasharray="12 8"'+an('lb-a-stream',0)+'/>'}
