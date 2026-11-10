/* ───────── 그림: 실험대 장면 — 모두 직접 그린 SVG (물질의 연소) ───────── */
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

/* ───────── 실험 기구 그림(비커·점적병·홈판 등, 모두 직접 그린 SVG) ───────── */
const WC='#BFE3F5',WS='#6FA9CC',GLS='var(--w-glass-s)',PW='#FFFFFF',PWS='#A9B4BC';
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
/* ── 비커. o: big(250 mL) · ml 물의 양 · tint · op · pile · fall 떨어지는 가루 색 · stir 젓는 중 · rod · label · cnt 위 이름 · steam · film 벽에 남은 용액 ── */
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
 if(o.inner)g+=o.inner;
 g+='<path d="'+out+'" fill="none" stroke="'+GLS+'" stroke-width="3.5"/><path d="M'+(cx-w-9)+' '+top+' h12" stroke="'+GLS+'" stroke-width="3.5"/>';
 const step=o.big?50:25;for(let m=step;m<=(o.big?250:100);m+=step)g+='<path d="M'+(cx+w-24)+' '+(base-m*D.k)+' h16" stroke="'+GLS+'" stroke-width="2"/>';
 if(o.rod)g+=rodArt(cx+14,top-56,h+30,12,o.stir);
 if(o.steam){for(let k=0;k<3;k++)g+='<path d="M'+(cx-20+k*20)+' '+(wy-10)+' q-6 -12 0 -24 q6 -12 0 -24" fill="none" stroke="#E2A3A3" stroke-width="3" stroke-linecap="round"/>'}
 if(o.label!=null)g+=sticker(cx,top+10,o.label,o.labelAnim);
 if(o.cnt)g+=mini(cx,top-28,o.cnt,o.cntSz||19);
 return g}
/* 흰 종이(비커 뒤) */

/* ───────── 물질의 연소: 실험 기구 그림(모두 직접 그린 SVG) ───────── */
const TR=(x,y,s,inner,extra)=>'<g transform="translate('+x+' '+y+')'+(s&&s!==1?' scale('+s+')':'')+'"'+(extra||'')+'>'+inner+'</g>';
/* 불꽃. kind 'c' 양초(노란색·붉은색) · 'a' 알코올(푸른색, 끝이 붉은색) · y = 불꽃 아래 끝 */
function flameArt(x,y,s,kind){s=s||1;const a=kind==='a';let g='<g class="lb-flk">';
 if(a){g+='<path d="M0 2 C-14 -6 -13 -28 0 -62 C13 -28 14 -6 0 2Z" fill="#9CC3F5" opacity=".85"/><path d="M0 0 C-8 -6 -8 -20 0 -40 C8 -20 8 -6 0 0Z" fill="#3E7BE0"/><path d="M0 -46 C-4 -50 -3 -56 0 -62 C3 -56 4 -50 0 -46Z" fill="#E8743A"/>'}
 else{g+='<path d="M0 2 C-15 -6 -14 -28 0 -64 C14 -28 15 -6 0 2Z" fill="#F28A2A"/><path d="M0 -2 C-9 -8 -9 -22 0 -46 C9 -22 9 -8 0 -2Z" fill="#FFD23F"/><ellipse cx="0" cy="-8" rx="3.5" ry="8" fill="#6A6A86" opacity=".55"/>'}
 return TR(x,y,s,g+'</g>')}
/* 꺼진 뒤 피어오르는 연기 */
function smokeArt(x,y,anim){return '<g'+(anim?an('lb-a-fade',anim===true?0:anim):'')+'><path d="M'+x+' '+y+' q-10 -16 4 -30 q-12 -14 2 -30" stroke="#A9AEB4" stroke-width="3.5" fill="none" stroke-linecap="round" opacity=".8"/></g>'}
/* 양초와 촛대. o.h 초 높이 · o.lit · o.drip 0~1 촛농 · o.w 초 굵기 · o.small 작은 받침 */
function candleArt(cx,base,o){o=o||{};const h=o.h||170,w=(o.w||32)/2,small=o.small;let g=o.noShadow?'':shadow(cx,base+3,small?40:66);
 if(small)g+='<rect x="'+(cx-28)+'" y="'+(base-10)+'" width="56" height="12" rx="4" fill="#B8C2CA" stroke="#7F8C99" stroke-width="2"/>';
 else g+='<ellipse cx="'+cx+'" cy="'+(base-4)+'" rx="62" ry="11" fill="#D2B06C" stroke="#8F7238" stroke-width="2.5"/><rect x="'+(cx-22)+'" y="'+(base-24)+'" width="44" height="20" rx="4" fill="#C9A35E" stroke="#8F7238" stroke-width="2.5"/>';
 const bot=base-(small?10:20),top=bot-h;
 g+='<rect x="'+(cx-w)+'" y="'+top+'" width="'+2*w+'" height="'+h+'" rx="3" fill="#FBF3E2" stroke="#D9C49C" stroke-width="2.5"/><path d="M'+(cx-w+6)+' '+(top+8)+' V'+(bot-6)+'" stroke="#FFFFFF" stroke-width="4" opacity=".7"/>';
 const d=o.drip||0;
 if(d>0){g+='<ellipse cx="'+cx+'" cy="'+(top+3)+'" rx="'+(w-3)+'" ry="4" fill="#FFF8DE" stroke="#E5D4A6" stroke-width="1.5"/>';
  g+='<path d="M'+(cx-w)+' '+(top+2)+' q-5 '+(18+d*44).toFixed(0)+' 2 '+(26+d*60).toFixed(0)+' q6 -8 4 -'+(26+d*58).toFixed(0)+'z" fill="#FBF3E2" stroke="#D9C49C" stroke-width="2"/><path d="M'+(cx+w-2)+' '+(top+4)+' q6 '+(10+d*20).toFixed(0)+' 1 '+(16+d*28).toFixed(0)+'" stroke="#E5D4A6" stroke-width="5" fill="none" stroke-linecap="round"/>'}
 g+='<path d="M'+cx+' '+top+' q1 -7 -1 -12" stroke="#2A2A2A" stroke-width="3" fill="none" stroke-linecap="round"/>';
 if(o.lit)g+=(o.litAnim?'<g'+an('lb-a-pop',o.litAnim===true?0:o.litAnim)+'>':'<g>')+flameArt(cx,top-8,o.fs||1,'c')+'</g>';
 if(o.out)g+=smokeArt(cx,top-14,o.outAnim);
 return g}
function candleTop(base,o){o=o||{};return base-((o.small?10:20)+(o.h||170))}
/* 알코올램프. o.lv 0~1 알코올 높이 · o.cap 'on'|'side'|'none' · o.lit · o.s 크기 */
function lampArt(cx,base,o){o=o||{};const s=o.s||1,lv=o.lv==null?.8:o.lv;let g='';
 const hw=y=>60-8*(-y/64);const hh=lv*58,ty=-4-hh;
 g+='<path d="M-60 0 L-52 -64 Q-48 -88 -18 -94 L18 -94 Q48 -88 52 -64 L60 0Z" fill="rgba(232,244,250,.5)"/>';
 if(lv>0)g+='<g'+(o.lvAnim?an('lb-a-fade',0,'animation-duration:1.4s'):'')+'><path d="M'+(-hw(ty)+4).toFixed(1)+' '+ty.toFixed(1)+' H'+(hw(ty)-4).toFixed(1)+' L56 -4 H-56Z" fill="#CFE6F2" fill-opacity=".95"/><path d="M'+(-hw(ty)+4).toFixed(1)+' '+ty.toFixed(1)+' H'+(hw(ty)-4).toFixed(1)+'" stroke="#8FBCD6" stroke-width="2.5"/></g>';
 g+='<path d="M0 -94 V-8" stroke="#E9E1CB" stroke-width="6"/>';
 g+='<path d="M-60 0 L-52 -64 Q-48 -88 -18 -94 L18 -94 Q48 -88 52 -64 L60 0Z" fill="none" stroke="var(--w-glass-s)" stroke-width="4"/><path d="M-44 -10 L-38 -60" stroke="#FFFFFF" stroke-width="4" opacity=".6" stroke-linecap="round"/>';
 g+='<rect x="-16" y="-110" width="32" height="17" rx="3" fill="#C9CDD1" stroke="#7F8C99" stroke-width="2.5"/><rect x="-4" y="-122" width="8" height="13" rx="2" fill="#F2EFE6" stroke="#B9AE8E" stroke-width="1.5"/>';
 if(o.lit)g+=(o.litAnim?'<g'+an('lb-a-pop',o.litAnim===true?0:o.litAnim)+'>':'<g>')+flameArt(0,-120,o.fs||1,'a')+'</g>';
 if(o.out)g+=smokeArt(0,-128,o.outAnim);
 const cap='<path d="M-24 -92 L-24 -116 Q-24 -142 0 -142 Q24 -142 24 -116 L24 -92Z" fill="rgba(220,236,246,.55)" stroke="var(--w-glass-s)" stroke-width="3"/><path d="M-14 -100 V-120" stroke="#FFFFFF" stroke-width="3" opacity=".6"/>';
 if(o.cap==='on'||o.cap==null)g+=o.capAnim?'<g'+an('lb-a-down',0,'--from:-120px')+'>'+cap+'</g>':cap;
 let out=(o.noShadow?'':shadow(cx,base+3,66*s))+TR(cx,base,s,g);
 if(o.cap==='side')out+=(o.capAnim?'<g'+an('lb-a-slide',0,'--dx:-'+(118*s).toFixed(0)+'px')+'>':'<g>')+TR(cx+118*s,base+92*s,s,cap)+'</g>';
 return out}
function lampTop(base,s){return base-122*(s||1)}
/* 점화기(긴 몸통). lit = 끝에 작은 불꽃 */
function lighterArt(x,y,rot,lit){return TR(x,y,1,'<g transform="rotate('+(rot||0)+')"><rect x="-90" y="-11" width="110" height="22" rx="9" fill="#5D7FB0" stroke="#2D4C78" stroke-width="2"/><rect x="20" y="-5" width="86" height="10" rx="3" fill="#B8C2CA" stroke="#7F8C99" stroke-width="2"/><rect x="-46" y="10" width="26" height="13" rx="3" fill="#2D4C78"/>'+(lit?'<g transform="translate(112 0) rotate('+(-(rot||0))+')">'+flameArt(0,4,.38,'c')+'</g>':'')+'</g>')}
/* 열 변색 종이: 불꽃 쪽 끝(x0)부터 오른쪽으로. heat=1이면 불꽃에 가까운 쪽부터 색이 바뀜(이 실험관에서 정한 색) */
const TPC={cold:'#7FB3D5',c1:'#C0392B',c2:'#E67E22',c3:'#F1C40F'};
function tPaper(x0,y,len,heat,anim){let g='<rect x="'+x0+'" y="'+(y-8)+'" width="'+len+'" height="16" rx="2" fill="'+TPC.cold+'" stroke="#4E7F9E" stroke-width="1.5"/>';
 if(heat){const seg=[[0,.2,TPC.c1],[.2,.42,TPC.c2],[.42,.62,TPC.c3]];let h='';seg.forEach(([a,b,c])=>{h+='<rect x="'+(x0+a*len).toFixed(1)+'" y="'+(y-8)+'" width="'+((b-a)*len+.5).toFixed(1)+'" height="16" fill="'+c+'"/>'});
  g+=anim?'<g'+an('lb-a-fade',anim===true?0:anim,'animation-duration:1.4s')+'>'+h+'</g>':h;g+='<rect x="'+x0+'" y="'+(y-8)+'" width="'+len+'" height="16" rx="2" fill="none" stroke="#4E7F9E" stroke-width="1.5"/>'}
 return g+hand(x0+len+40,y+2,0,.8,1).replace(/#FFFFFF/g,'#F4F1EA')}
/* 교실 전등을 끈 모습: 어둡게 덮고 불꽃 둘레만 밝게 */
function darkArt(fx,fy,lit,anim){let g='<g'+(anim?an('lb-a-fade',0,'animation-duration:.9s'):'')+'><rect x="-3000" y="-3000" width="7000" height="7000" fill="#0B0F1A" opacity=".76"/>';
 if(lit)[[240,.06],[175,.08],[120,.11],[78,.15],[44,.2]].forEach(([r,o])=>{g+='<circle cx="'+fx+'" cy="'+fy+'" r="'+r+'" fill="#FFE7A0" opacity="'+o+'"/>'});
 return g+'</g>'}
/* 확인 표시 */
function okMark(x,y,anim,d){return '<g'+(anim?an('lb-a-pop',d||0):'')+'><circle cx="'+x+'" cy="'+y+'" r="20" fill="var(--lb-sci)"/><path d="M'+(x-9)+' '+y+' l6 7 l12 -14" stroke="#FFFFFF" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>'}
/* 비상구·소화기·모래 보관함 */
function exitSign(x,y){return '<g><rect x="'+x+'" y="'+y+'" width="180" height="70" rx="6" fill="#1E9A55" stroke="#13683A" stroke-width="3"/><rect x="'+(x+10)+'" y="'+(y+10)+'" width="50" height="50" rx="4" fill="#FFFFFF"/><circle cx="'+(x+40)+'" cy="'+(y+20)+'" r="5" fill="#1E9A55"/><path d="M'+(x+38)+' '+(y+27)+' l-6 14 l-8 4 M'+(x+36)+' '+(y+34)+' l8 6 l2 10 M'+(x+34)+' '+(y+40)+' l-6 10" stroke="#1E9A55" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M'+(x+76)+' '+(y+35)+' h70 m-16 -14 l16 14 l-16 14" stroke="#FFFFFF" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>'}
function extArt(cx,base){return '<g>'+shadow(cx,base+3,30)+'<rect x="'+(cx-24)+'" y="'+(base-130)+'" width="48" height="130" rx="14" fill="#D6302A" stroke="#8E1C18" stroke-width="3"/><rect x="'+(cx-16)+'" y="'+(base-150)+'" width="32" height="22" rx="4" fill="#3B4650"/><path d="M'+(cx+16)+' '+(base-140)+' q34 0 34 30 v50" stroke="#2A3138" stroke-width="7" fill="none" stroke-linecap="round"/><rect x="'+(cx-16)+'" y="'+(base-96)+'" width="32" height="40" rx="3" fill="#FFFFFF" opacity=".85"/></g>'}
function sandArt(cx,base){return '<g>'+shadow(cx,base+3,70)+'<rect x="'+(cx-66)+'" y="'+(base-86)+'" width="132" height="86" rx="6" fill="#E3C27A" stroke="#9A7A36" stroke-width="3"/><rect x="'+(cx-72)+'" y="'+(base-100)+'" width="144" height="18" rx="5" fill="#C9A35E" stroke="#9A7A36" stroke-width="3"/><rect x="'+(cx-34)+'" y="'+(base-66)+'" width="68" height="34" rx="4" fill="#FFFFFF"/><text x="'+cx+'" y="'+(base-42)+'" text-anchor="middle" font-size="20" font-weight="800" fill="#7A5A1C">모래</text></g>'}
function exitScene(done,anim){let g=exitSign(150,150)+extArt(480,BY)+sandArt(740,BY)+mini(240,250,'비상구',18)+mini(480,BY+34,'소화기',18)+mini(740,BY+34,'모래 보관함',18);
 if(anim)g+='<g'+an('lb-a-slide',0,'--dx:-420px;animation-duration:1.6s')+'>'+eyeLook(760,300)+'</g>';
 if(done)g+=okMark(350,150,anim,.5)+okMark(530,270,anim,1)+okMark(830,320,anim,1.5);
 return g}
function eyeLook(x,y){return '<g transform="translate('+x+' '+y+')"><path d="M-30 0 Q0 -22 30 0 Q0 22 -30 0Z" fill="#FFFFFF" stroke="#2A3342" stroke-width="3.5"/><circle r="9" fill="#2A3342"/></g>'}
/* 탈 수 있는 물체(종이 묶음·공책) */
function burnables(x,base){return '<g>'+shadow(x+40,base+3,90)+'<rect x="'+(x-50)+'" y="'+(base-14)+'" width="120" height="14" rx="2" fill="#FFFFFF" stroke="#BFC6CC" stroke-width="2"/><rect x="'+(x-44)+'" y="'+(base-26)+'" width="112" height="12" rx="2" fill="#F7F3EA" stroke="#BFC6CC" stroke-width="2"/><rect x="'+(x+60)+'" y="'+(base-40)+'" width="96" height="40" rx="4" fill="#5B8FD6" stroke="#2F5E9E" stroke-width="2.5"/><path d="M'+(x+70)+' '+(base-40)+' v40" stroke="#2F5E9E" stroke-width="3"/></g>'}
/* ── 실험 1: 삼각 플라스크와 고무풍선 ── */
const BCOL=['#E2706A','#5B8FD6'],BSTR=['#A8433E','#2F5E9E'],VIN='#F4E7B8';
const FX1=[330,630];
function flaskBody(o){o=o||{};const hw=y=>14+54*((y+112)/104);let g='<path d="M-14 -150 V-112 L-68 -8 Q-72 0 -62 0 H62 Q72 0 68 -8 L14 -112 V-150Z" fill="rgba(232,244,250,.45)"/>';
 const sy=-50;g+='<path d="M'+(-hw(sy)).toFixed(1)+' '+sy+' H'+hw(sy).toFixed(1)+' L66 -6 Q66 -3 62 -3 H-62 Q-66 -3 -66 -6Z" fill="'+VIN+'" fill-opacity=".9"/><path d="M'+(-hw(sy)).toFixed(1)+' '+sy+' H'+hw(sy).toFixed(1)+'" stroke="#D3BD78" stroke-width="2.5"/>';
 if(o.settle)g+='<g'+(o.settleAnim?an('lb-a-fade',o.settleAnim,'animation-duration:1.4s'):'')+'><path d="M-34 -4 Q-20 -16 0 -17 Q20 -16 34 -4Z" fill="#FBF8EE" stroke="#CFC6A8" stroke-width="1.5"/></g>';
 if(o.foam){let b='';for(let k=0;k<12;k++){const bx=-44+rnd(k,4)*88,by=-8-rnd(k,6)*34;b+='<circle class="lb-bub" style="--h:-30px;animation-delay:-'+(rnd(k,9)*1.4).toFixed(2)+'s" cx="'+bx.toFixed(1)+'" cy="'+by.toFixed(1)+'" r="'+(2.5+rnd(k,2)*2.5).toFixed(1)+'" fill="#FFFFFF" stroke="#C8B46A" stroke-width="1.2"/>'}
  b+='<path d="M'+(-hw(sy)+2).toFixed(1)+' '+sy+' Q-20 '+(sy-10)+' 0 '+(sy-6)+' Q20 '+(sy-12)+' '+(hw(sy)-2).toFixed(1)+' '+sy+'Z" fill="#FFFFFF" opacity=".9"/>';g+=o.foamAnim?'<g'+an('lb-a-fade',o.foamAnim,'animation-duration:1.2s')+'>'+b+'</g>':b}
 g+='<path d="M-14 -150 V-112 L-68 -8 Q-72 0 -62 0 H62 Q72 0 68 -8 L14 -112 V-150" fill="none" stroke="var(--w-glass-s)" stroke-width="4"/><path d="M-19 -150 h38" stroke="var(--w-glass-s)" stroke-width="4"/><path d="M-50 -14 L-14 -84" stroke="#FFFFFF" stroke-width="4" opacity=".5" stroke-linecap="round"/>';
 return g}
function powderDots(cx,cy,n,seed,w){let g='';for(let i=0;i<n;i++)g+='<circle cx="'+(cx-w/2+rnd(i,seed)*w).toFixed(1)+'" cy="'+(cy-rnd(i,seed+3)*8).toFixed(1)+'" r="3" fill="#FFFFFF" stroke="#C9C2B0" stroke-width="1"/>';return g}
/* 고무풍선: 탁자 위에 누운 모습(가루가 들었는지) */
function balloonLie(x,base,k,powder,anim){const c=BCOL[k],st=BSTR[k];return '<g'+(anim?an('lb-a-fade',anim):'')+'>'+shadow(x,base+2,38)+'<ellipse cx="'+x+'" cy="'+(base-15)+'" rx="36" ry="16" fill="'+c+'" stroke="'+st+'" stroke-width="2"/><rect x="'+(x+32)+'" y="'+(base-21)+'" width="14" height="12" rx="3" fill="'+c+'" stroke="'+st+'" stroke-width="2"/>'+(powder?'<ellipse cx="'+(x-6)+'" cy="'+(base-10)+'" rx="22" ry="7" fill="#FFFFFF" opacity=".55"/>':'')+'<path d="M'+(x-22)+' '+(base-24)+' q10 -5 22 -3" stroke="#FFFFFF" stroke-width="3" fill="none" opacity=".6"/></g>'}
/* 분말 깔때기를 끼운 고무풍선에 약숟가락으로 가루 넣기(움직임) */
function fillBalloon(x,base,k){const c=BCOL[k],st=BSTR[k];return '<g>'+shadow(x,base+2,26)+'<path d="M'+(x-8)+' '+(base-60)+' q-22 30 -10 52 q10 10 20 0 q12 -22 -10 -52z" fill="'+c+'" stroke="'+st+'" stroke-width="2"/>'+
 '<g'+an('lb-a-fade',.8,'animation-duration:.8s')+'><ellipse cx="'+x+'" cy="'+(base-14)+'" rx="10" ry="6" fill="#FFFFFF" opacity=".75"/></g>'+
 '<path d="M'+(x-30)+' '+(base-110)+' L'+(x+30)+' '+(base-110)+' L'+(x+5)+' '+(base-70)+' V'+(base-56)+' H'+(x-5)+' V'+(base-70)+'Z" fill="#E9EEF2" stroke="#7F8C99" stroke-width="2.5"/>'+
 '<g'+an('lb-a-tip',0,'--rot:-28deg;animation-duration:1.8s')+'>'+spoonArt(x+6,base-128,0,'#FAFAF6','#9AA6AF')+'</g>'+fallGrains(x,base-118,base-70,'#FAFAF6','#9AA6AF',x)+'</g>'}
/* 삼각 플라스크 + 고무풍선. st: 'none'·'droop'(옆으로 늘어뜨림)·'up'(세움). inf 0~1 부푼 정도 */
function flaskSet(cx,base,k,o){o=o||{};const c=BCOL[k],st=BSTR[k],s=k?1:-1;let g=shadow(cx,base+3,74)+TR(cx,base,1,flaskBody(o));
 const ring='<rect x="'+(cx-17)+'" y="'+(base-158)+'" width="34" height="12" rx="4" fill="'+c+'" stroke="'+st+'" stroke-width="2"/>';
 if(o.bal==='droop'){g+=ring+'<g transform="translate('+(cx+s*30)+' '+(base-146)+') rotate('+(s*28)+')"><ellipse cx="'+(s*8)+'" cy="10" rx="34" ry="17" fill="'+c+'" stroke="'+st+'" stroke-width="2"/><ellipse cx="'+(s*12)+'" cy="16" rx="20" ry="6" fill="#FFFFFF" opacity=".55"/></g>'}
 if(o.bal==='up'){const inf=o.inf||0,rx=18+32*inf,ry=28+38*inf;const body='<ellipse cx="'+cx+'" cy="'+(base-152-ry)+'" rx="'+rx+'" ry="'+ry+'" fill="'+c+'" stroke="'+st+'" stroke-width="2"/><path d="M'+(cx-rx*.45)+' '+(base-152-ry*1.45)+' q'+(rx*.3)+' '+(-ry*.25)+' '+(rx*.6)+' '+(-ry*.1)+'" stroke="#FFFFFF" stroke-width="3" fill="none" opacity=".6"/>';
  g+=ring+(o.infAnim?'<g'+an('lb-a-swell',o.infAnim,'--s0:'+(0.42).toFixed(2)+';animation-duration:2.4s')+'>'+body+'</g>':body)}
 if(o.fall)g+=fallGrains(cx,base-150,base-56,'#FAFAF6','#9AA6AF',cx+k);
 return g}
function lab1(k){return wlab(FX1[k],BY+32,k?'㉯':'㉮',17)}
/* 페트리 접시(더 알아보기) */
function petri(cx,base,drop,col){return '<g>'+shadow(cx,base+3,96)+'<ellipse cx="'+cx+'" cy="'+(base-14)+'" rx="96" ry="30" fill="#EEF4F7" stroke="#9FB3BF" stroke-width="3"/><ellipse cx="'+cx+'" cy="'+(base-16)+'" rx="52" ry="15" fill="#FBFAF5" stroke="#E2DED0" stroke-width="1.5"/>'+(drop?'<g'+(drop==='go'?an('lb-a-fade',.9,'animation-duration:1.2s'):'')+'><ellipse cx="'+cx+'" cy="'+(base-17)+'" rx="30" ry="9" fill="'+col+'" opacity=".85"/></g>':'')+'</g>'}
function dropperArt(x,y,col){return '<g transform="translate('+x+' '+y+')"><rect x="-9" y="-80" width="18" height="30" rx="8" fill="#E2573F" stroke="#A33A2A" stroke-width="2"/><path d="M-6 -52 H6 V-6 L0 6 L-6 -6Z" fill="rgba(232,244,250,.7)" stroke="var(--w-glass-s)" stroke-width="2"/><rect x="-4" y="-30" width="8" height="22" fill="'+(col||'#C98B3A')+'" opacity=".85"/></g>'}
/* ── 아크릴 통 ── */
function acrylBox(x,y,w,h,anim){const b='<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="6" fill="rgba(220,238,248,.30)" stroke="#7FB3D5" stroke-width="4"/><path d="M'+(x+14)+' '+(y+14)+' V'+(y+h*.6)+'" stroke="#FFFFFF" stroke-width="4" opacity=".6" stroke-linecap="round"/>';
 return anim?'<g'+anim+'>'+b+'</g>':b}
/* ── 실험 4: 비커와 약품 ── */
function reagent(cx,base,col,brown){return '<g>'+shadow(cx,base+3,30)+'<rect x="'+(cx-26)+'" y="'+(base-92)+'" width="52" height="92" rx="9" fill="'+(brown?'#8A5A2E':'rgba(232,244,250,.6)')+'" stroke="'+(brown?'#5A3A1C':'var(--w-glass-s)')+'" stroke-width="3"/>'+(brown?'':'<rect x="'+(cx-22)+'" y="'+(base-62)+'" width="44" height="58" rx="6" fill="'+col+'" opacity=".8"/>')+'<rect x="'+(cx-12)+'" y="'+(base-110)+'" width="24" height="20" rx="3" fill="#3B4650"/><rect x="'+(cx-20)+'" y="'+(base-74)+'" width="40" height="28" rx="3" fill="#FFFFFF" stroke="#C9CFD4" stroke-width="1.5"/></g>'}
function kiJar(cx,base){return '<g>'+shadow(cx,base+3,34)+'<rect x="'+(cx-30)+'" y="'+(base-62)+'" width="60" height="62" rx="8" fill="rgba(232,244,250,.6)" stroke="var(--w-glass-s)" stroke-width="3"/>'+grains(cx-24,cx+24,base-24,base-6,'#FFFFFF','#B9B2A0',16,cx,3)+'<rect x="'+(cx-32)+'" y="'+(base-74)+'" width="64" height="14" rx="4" fill="#7F8C99"/></g>'}
function bubBeaker(cx,base,o){o=o||{};let inner='';if(o.ki)inner+=grains(cx-30,cx+30,base-14,base-6,'#FFFFFF','#B9B2A0',10,cx+1,2.6);
 if(o.bub){let b='';for(let k=0;k<10;k++){const bx=cx-40+rnd(k,3)*80,by=base-10-rnd(k,8)*50;b+='<circle class="lb-bub" style="--h:-44px;animation-delay:-'+(rnd(k,5)*1.4).toFixed(2)+'s" cx="'+bx.toFixed(1)+'" cy="'+by.toFixed(1)+'" r="'+(2.5+rnd(k,2)*2.5).toFixed(1)+'" fill="#FFFFFF" stroke="#8FBCD6" stroke-width="1.2"/>'}inner+=o.bubAnim?'<g'+an('lb-a-fade',o.bubAnim)+'>'+b+'</g>':b}
 return beakerArt(cx,base,{ml:o.ml||0,rise:o.rise,tint:'#E6F2F8',op:.85,inner,noShadow:o.noShadow})}
/* ── 실험 5: 삼발이와 철판, 성냥 조각 ── */
const PL={cx:480,y:246,w:440,d:130};
function plateSet(heat,anim){const {cx,y,w}=PL;let g=shadow(cx,BY+3,180);
 g+='<path d="M'+(cx-150)+' '+BY+' L'+(cx-120)+' '+(y+12)+' M'+(cx+150)+' '+BY+' L'+(cx+120)+' '+(y+12)+' M'+(cx-20)+' '+(BY-6)+' L'+(cx-6)+' '+(y+12)+'" stroke="#4A525A" stroke-width="8" stroke-linecap="round"/><rect x="'+(cx-132)+'" y="'+(y+10)+'" width="264" height="10" rx="4" fill="#5A626A"/>';
 g+='<rect x="'+(cx-w/2)+'" y="'+y+'" width="'+w+'" height="12" rx="3" fill="#8D969E" stroke="#5D666E" stroke-width="2"/>';
 if(heat){const hg='<ellipse cx="'+cx+'" cy="'+(y+6)+'" rx="'+(40+heat*120)+'" ry="7" fill="#D9543A" opacity="'+(.3+heat*.35).toFixed(2)+'"/><ellipse cx="'+cx+'" cy="'+(y+6)+'" rx="'+(20+heat*50)+'" ry="5" fill="#F07A3A" opacity="'+(.5+heat*.3).toFixed(2)+'"/>';g+=anim?'<g'+an('lb-a-fade',0,'animation-duration:2s')+'>'+hg+'</g>':hg}
 return g}
function matchHead(x,y,st,anim){let g='<g>';const burnt=st>=2;
 g+='<rect x="'+(x-4)+'" y="'+(y-8)+'" width="14" height="6" rx="2" fill="'+(burnt?'#3A2A20':'#E0C08A')+'" stroke="#9A7A4A" stroke-width="1.2"/><ellipse cx="'+(x-8)+'" cy="'+(y-6)+'" rx="10" ry="7" fill="'+(burnt?'#2E2626':'#C0392B')+'" stroke="'+(burnt?'#1A1414':'#7A1F18')+'" stroke-width="1.5"/>';
 if(st===1)g+='<g'+(anim?an('lb-a-pop',anim===true?0:anim):'')+'>'+flameArt(x-6,y-10,.62,'c')+'</g>';
 if(st===2)g+=smokeArt(x-6,y-14,anim);
 return g+'</g>'}
function matchWood(x,y,st,anim){let g='<g>';const col=st===0?'#E0C08A':st===1?'#8A6A44':'#2E2626';
 g+=(st&&anim?'<g'+an('lb-a-fade',anim===true?0:anim,'animation-duration:1.4s')+'>':'<g>')+'<rect x="'+(x-22)+'" y="'+(y-8)+'" width="44" height="7" rx="2" fill="'+col+'" stroke="#9A7A4A" stroke-width="1.2"/></g>';
 if(st===2)g+='<g'+(anim?an('lb-a-pop',(anim===true?0:anim)+.6):'')+'>'+flameArt(x,y-8,.5,'c')+'</g>';
 return g+'</g>'}
/* ── 실험 6: 푸른색 염화 코발트 종이·석회수 ── */
const COB='#3D6FD1',COR='#D9536A';
function coPaper(x,y,w,h,red,anim,tape){let g='<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="'+COB+'"/>';
 if(red)g+='<g'+(anim?an('lb-a-fade',anim===true?0:anim,'animation-duration:1.8s'):'')+'><rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="'+COR+'"/></g>';
 if(tape)g+='<rect x="'+(x-5)+'" y="'+(y+h*.42)+'" width="'+(w+10)+'" height="'+(h*.16)+'" fill="#FFFFFF" opacity=".5" stroke="#CFE3F0" stroke-width="1.5"/>';
 return g}
const BX6={x:250,y:196,w:300,h:240};
function dropletsArt(anim){const {x,y,w}=BX6;let g='<g'+(anim?an('lb-a-fade',anim===true?0:anim,'animation-duration:1.6s'):'')+'>';for(let i=0;i<16;i++){const px=x+40+rnd(i,11)*(w-70),py=y+14+rnd(i,13)*80;g+='<circle cx="'+px.toFixed(1)+'" cy="'+py.toFixed(1)+'" r="'+(2+rnd(i,4)*2.2).toFixed(1)+'" fill="#CFE8F6" stroke="#7FB3D5" stroke-width="1"/>'}return g+'</g>'}
/* 석회수가 든 유리병. lid: 'on'|'side'|'off' · cloud 0~1 · shake 흔드는 중 */
function limeJar(cx,base,o){o=o||{};let g=shadow(cx,base+3,42);const top=base-110;
 let j='<path d="M'+(cx-36)+' '+(top+16)+' V'+(base-8)+' Q'+(cx-36)+' '+base+' '+(cx-28)+' '+base+' H'+(cx+28)+' Q'+(cx+36)+' '+base+' '+(cx+36)+' '+(base-8)+' V'+(top+16)+' Q'+(cx+36)+' '+(top+6)+' '+(cx+22)+' '+(top+4)+' H'+(cx-22)+' Q'+(cx-36)+' '+(top+6)+' '+(cx-36)+' '+(top+16)+'Z" fill="rgba(232,244,250,.5)"/>';
 j+='<rect x="'+(cx-33)+'" y="'+(base-62)+'" width="66" height="58" rx="6" fill="#EEF7FB" fill-opacity=".9"/><path d="M'+(cx-33)+' '+(base-62)+' h66" stroke="#B7D3E2" stroke-width="2"/>';
 if(o.cloud){const c='<rect x="'+(cx-33)+'" y="'+(base-62)+'" width="66" height="58" rx="6" fill="#E9E9E3" opacity="'+(o.cloud*.95).toFixed(2)+'"/>'+grains(cx-28,cx+28,base-58,base-8,'#FFFFFF','#DADAD2',14,cx+3,2.6);j+=o.cloudAnim?'<g'+an('lb-a-fade',o.cloudAnim,'animation-duration:1.6s')+'>'+c+'</g>':c}
 if(o.inner)j+=o.inner;
 j+='<path d="M'+(cx-36)+' '+(top+16)+' V'+(base-8)+' Q'+(cx-36)+' '+base+' '+(cx-28)+' '+base+' H'+(cx+28)+' Q'+(cx+36)+' '+base+' '+(cx+36)+' '+(base-8)+' V'+(top+16)+' Q'+(cx+36)+' '+(top+6)+' '+(cx+22)+' '+(top+4)+' H'+(cx-22)+' Q'+(cx-36)+' '+(top+6)+' '+(cx-36)+' '+(top+16)+'Z" fill="none" stroke="var(--w-glass-s)" stroke-width="3.5"/><path d="M'+(cx-26)+' '+(top+20)+' V'+(base-14)+'" stroke="#FFFFFF" stroke-width="3.5" opacity=".55" stroke-linecap="round"/>';
 const lid='<rect x="'+(cx-26)+'" y="'+(top-10)+'" width="52" height="16" rx="4" fill="#7A8590" stroke="#4E5862" stroke-width="2"/>';
 if(o.lid==='on'||o.lid==null)j+=o.lidAnim?'<g'+an('lb-a-down',0,'--from:-80px')+'>'+lid+'</g>':lid;
 g+=o.shake?'<g'+an('lb-a-jig',0)+'>'+j+'</g>':j;
 if(o.lid==='side')g+=(o.lidAnim?'<g'+an('lb-a-slide',0,'--dx:-90px')+'>':'<g>')+'<rect x="'+(cx+56)+'" y="'+(base-16)+'" width="52" height="16" rx="4" fill="#7A8590" stroke="#4E5862" stroke-width="2"/></g>';
 return g}
function co2Tube(cx,base,go){let g='<path d="M'+(cx+150)+' '+(base-200)+' Q'+(cx+40)+' '+(base-200)+' '+(cx+10)+' '+(base-150)+' L'+(cx+6)+' '+(base-20)+'" stroke="#9AA6B2" stroke-width="7" fill="none" stroke-linecap="round"/>'+mini(cx+150,base-226,'이산화 탄소',16);
 if(go){let b='';for(let k=0;k<8;k++)b+='<circle class="lb-bub" style="--h:-38px;animation-delay:-'+(rnd(k,7)*1.4).toFixed(2)+'s" cx="'+(cx+2+rnd(k,2)*14).toFixed(1)+'" cy="'+(base-14-rnd(k,4)*20).toFixed(1)+'" r="2.8" fill="#FFFFFF" stroke="#9FC7DE" stroke-width="1.2"/>';g+=b}
 return g}
/* ───────── 준비물 카드 ───────── */
function itemArt(k){const sc=(sv,s,y)=>'<g transform="translate(0 '+(y||0)+') scale('+s+')">'+sv.replace(/<ellipse[^>]*fill="var\(--w-shadow\)"[^>]*\/>/g,'')+'</g>';
 const A={
  gear:coat(-30,4,.5)+goggles(28,-24,.5)+hand(30,26,-60,.55,1),
  gear2:coat(-30,4,.5)+goggles(28,-24,.5)+hand(30,26,-60,.55,1).replace(/#FFFFFF/g,'#F4F1EA'),
  gear4:coat(-34,4,.5)+goggles(26,-26,.48)+hand(18,26,-60,.5,1)+hand(44,30,-60,.5,1).replace(/#FFFFFF/g,'#F4F1EA'),
  balloon2:sc(balloonLie(-40,0,0,0)+balloonLie(44,26,1,0),.9,10),
  funnel:'<path d="M-36 -40 H36 L8 6 V40 H-8 V6Z" fill="#E9EEF2" stroke="#7F8C99" stroke-width="3"/>',
  spoon2:spoonArt(20,-14,-20)+spoonArt(26,16,-20),spoon:spoonArt(26,0,-20,'#FFFFFF','#B9B2A0'),
  flour:'<path d="M-50 10 h100 q-6 34 -50 34 q-44 0 -50 -34z" fill="#E9EEF2" stroke="#8796A3" stroke-width="2.5"/>'+pile(0,12,40,14,'#FBF8EE','#CFC6A8'),
  soda:'<path d="M-50 10 h100 q-6 34 -50 34 q-44 0 -50 -34z" fill="#E9EEF2" stroke="#8796A3" stroke-width="2.5"/>'+pile(0,12,40,14,'#FFFFFF','#B9C2CA'),
  flask2:sc(TR(-62,0,1,flaskBody())+TR(62,0,1,flaskBody()),.6,48),
  candle:sc(candleArt(0,0,{h:120,noShadow:1}),.62,52),candle1:sc(candleArt(0,0,{h:70,small:1,noShadow:1}),.8,40),
  candle2:sc(candleArt(-40,0,{h:70,small:1,noShadow:1})+candleArt(40,0,{h:70,small:1,noShadow:1}),.75,40),
  lighter:lighterArt(-4,0,-20,0),
  tpaper:'<rect x="-60" y="-34" width="120" height="16" rx="2" fill="'+TPC.cold+'" stroke="#4E7F9E" stroke-width="1.5"/><rect x="-60" y="-6" width="120" height="16" rx="2" fill="'+TPC.cold+'" stroke="#4E7F9E" stroke-width="1.5"/><rect x="-60" y="22" width="120" height="16" rx="2" fill="'+TPC.cold+'" stroke="#4E7F9E" stroke-width="1.5"/>',
  lamp:sc(lampArt(0,0,{noShadow:1}),.62,40),
  acryl:sc(acrylBox(-60,-120,120,120),.72,44),acryl2:sc(acrylBox(-130,-120,120,120)+acrylBox(10,-120,120,120),.62,38),
  beaker:sc(beakerArt(0,0,{noShadow:1}),.5,40),
  h2o2:sc(reagent(0,0,'#E6F2F8'),.75,40),ki:sc(kiJar(0,0),.85,30),
  iron:'<rect x="-66" y="-8" width="132" height="14" rx="3" fill="#8D969E" stroke="#5D666E" stroke-width="2"/>',
  tripod:'<path d="M-50 44 L-36 -26 M50 44 L36 -26 M0 40 L4 -26" stroke="#4A525A" stroke-width="7" stroke-linecap="round"/><ellipse cx="0" cy="-28" rx="44" ry="9" fill="none" stroke="#4A525A" stroke-width="7"/>',
  match:sc(matchHead(-30,10,0)+matchWood(40,10,0),1.6,0),
  tweez:tweezArt(0,52,20),
  cobalt:coPaper(-54,-40,30,80)+coPaper(-10,-40,30,80)+coPaper(34,-40,30,80),
  tape:'<circle r="38" fill="#EEF4F8" stroke="#9FB3BF" stroke-width="3"/><circle r="18" fill="var(--w-label)" stroke="#9FB3BF" stroke-width="3"/>',
  lime:sc(limeJar(0,0,{}),.7,40)};
 return A[k]||''}
