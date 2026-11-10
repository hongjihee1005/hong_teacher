/* ───────── 그림: 실험 장면 — 모두 직접 그린 SVG (물체의 운동) ───────── */
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


/* ───────── 물체의 운동: 그림(모두 직접 그린 SVG) ───────── */
let CID=0;   /* clipPath 이름이 겹치지 않게 */
const CARC={R:['#E2573F','#A63A27'],B:['#2F6DB5','#1F4C82'],G:['#27AE60','#1B7A43'],Y:['#F1C40F','#A88600']};
/* 위에서 본 태엽 자동차. x = 앞부분 끝, y = 가운데. o.s 크기 · o.key 태엽 열쇠 각도(null이면 없음) · o.ghost 흐리게 */
function carTop(x,y,k,o){o=o||{};const s=o.s||1,c=CARC[k];
 let g='<g transform="translate('+x.toFixed(1)+' '+y+') scale('+s+')"'+(o.ghost?' opacity=".38"':'')+'>';
 g+='<rect x="-62" y="-25" width="15" height="7" rx="2" fill="#2A2F36"/><rect x="-62" y="18" width="15" height="7" rx="2" fill="#2A2F36"/><rect x="-20" y="-25" width="15" height="7" rx="2" fill="#2A2F36"/><rect x="-20" y="18" width="15" height="7" rx="2" fill="#2A2F36"/>';
 g+='<rect x="-68" y="-19" width="68" height="38" rx="12" fill="'+c[0]+'" stroke="'+c[1]+'" stroke-width="2.5"/><rect x="-48" y="-13" width="25" height="26" rx="6" fill="#D6ECF6" stroke="'+c[1]+'" stroke-width="1.5"/><rect x="-8" y="-19" width="8" height="38" rx="4" fill="#1D2229" opacity=".35"/>';
 if(o.key!=null)g+='<g transform="translate(-74 0) rotate('+o.key.toFixed(0)+')"><rect x="-2.5" y="-11" width="5" height="22" rx="2" fill="#C9A227" stroke="#8C6F14" stroke-width="1.2"/><circle cx="0" cy="-12" r="6" fill="none" stroke="#C9A227" stroke-width="3"/><circle cx="0" cy="12" r="6" fill="none" stroke="#C9A227" stroke-width="3"/></g>';
 return g+'</g>'}
/* 바닥에 붙인 색 테이프(세로 줄) */
function tapeLine(x,y1,y2,col,anim){return '<g'+(anim?an('lb-a-grow',0):'')+'><rect x="'+(x-4)+'" y="'+y1+'" width="8" height="'+(y2-y1)+'" rx="2" fill="'+col+'" stroke="rgba(0,0,0,.25)" stroke-width="1"/></g>'}
/* 펼친 줄자(위에서 본 모습). x0 = 0 눈금, PX = 1 cm, len cm, cut 보이는 끝(펼치는 중) */
function rulerStrip(x0,y,PX,len,cut){const L=cut==null?len:Math.min(len,cut);let g='<rect x="'+x0+'" y="'+(y-10)+'" width="'+(L*PX).toFixed(1)+'" height="20" fill="#FFD84A" stroke="#B79400" stroke-width="1.5"/>';
 for(let c=0;c<=L;c+=5){const x=x0+c*PX;g+='<line x1="'+x.toFixed(1)+'" y1="'+(y-10)+'" x2="'+x.toFixed(1)+'" y2="'+(y-10+(c%10?6:11))+'" stroke="#222" stroke-width="1.2"/>';if(c%20===0)g+='<text x="'+x.toFixed(1)+'" y="'+(y+8)+'" font-size="11" text-anchor="middle" font-weight="700" fill="#222">'+c+'</text>'}
 const cx=x0+L*PX;g+='<rect x="'+(cx-2)+'" y="'+(y-22)+'" width="40" height="44" rx="9" fill="#E2573F" stroke="#8E2E1E" stroke-width="2"/><circle cx="'+(cx+18)+'" cy="'+y+'" r="8" fill="#F7D7CF" stroke="#8E2E1E" stroke-width="1.5"/>';
 return g}
/* 말아 둔 줄자(옆에 둠) */
function rolledTape(x,y,s){return '<g transform="translate('+x+' '+y+') scale('+(s||1)+')"><rect x="-26" y="-24" width="52" height="48" rx="12" fill="#E2573F" stroke="#8E2E1E" stroke-width="2.5"/><circle r="11" fill="#F7D7CF" stroke="#8E2E1E" stroke-width="2"/><rect x="24" y="12" width="16" height="10" rx="2" fill="#FFD84A" stroke="#B79400" stroke-width="1.5"/></g>'}
/* 색 테이프 한 줄 */
function tapeRoll(x,y,s,col){col=col||'#2E86C1';return '<g transform="translate('+x+' '+y+') scale('+(s||1)+')"><circle r="26" fill="'+col+'" stroke="rgba(0,0,0,.3)" stroke-width="2"/><circle r="14" fill="var(--w-label)" stroke="rgba(0,0,0,.25)" stroke-width="2"/><path d="M24 8 L52 14 L50 26 L20 18Z" fill="'+col+'" stroke="rgba(0,0,0,.25)" stroke-width="1.5"/></g>'}
/* 삼각대(옆에서 본 모습). x 가운데, y 머리 높이, h 다리 길이 */
function tripodArt(x,y,h,s){s=s||1;return '<g transform="translate('+x+' '+y+') scale('+s+')"><path d="M0 0 L-58 '+h+' M0 0 L0 '+(h+6)+' M0 0 L58 '+h+'" stroke="#3B4650" stroke-width="7" stroke-linecap="round"/><rect x="-22" y="-12" width="44" height="18" rx="5" fill="#5A6672" stroke="#2E3740" stroke-width="2"/></g>'}
/* 스마트 기기(가로). inner = 화면 안 그림(0..W, 0..H 좌표) */
function phoneArt(x,y,W,H,inner,o){o=o||{};const id='lbClp'+(++CID);
 let g='<g transform="translate('+x+' '+y+')'+(o.rot?' rotate('+o.rot+' '+(W/2)+' '+(H/2)+')':'')+'">';
 g+='<rect x="-18" y="-16" width="'+(W+36)+'" height="'+(H+32)+'" rx="26" fill="#1D232B" stroke="#0E1216" stroke-width="3"/><circle cx="'+(W+9)+'" cy="'+(H/2)+'" r="4" fill="#3A4450"/>';
 g+='<clipPath id="'+id+'"><rect x="0" y="0" width="'+W+'" height="'+H+'" rx="8"/></clipPath><g clip-path="url(#'+id+')"><rect width="'+W+'" height="'+H+'" fill="#EEF2F5"/>'+(inner||'')+'</g>';
 return g+'</g>'}
/* 찍은 사진 한 장(흰 테두리) */
function photoArt(x,y,W,H,inner,cap){const id='lbClp'+(++CID);
 return '<g transform="translate('+x+' '+y+')"><rect x="-8" y="-8" width="'+(W+16)+'" height="'+(H+16)+'" rx="6" fill="#FFFFFF" stroke="#B9B2A4" stroke-width="2"/><clipPath id="'+id+'"><rect width="'+W+'" height="'+H+'"/></clipPath><g clip-path="url(#'+id+')">'+inner+'</g></g>'+(cap?mini(x+W/2,y-26,cap,20):'')}

/* ── 실험 1: 교실(640×300 좌표, 원본 앱 그림을 고쳐 그림) ── */
function P(x,y,o){o=o||{};const s=o.s||1,c=o.c||'#3d7cc9',sk='#f1c7a1',hr=o.h||'#3b2a20',p=o.p||'stand',ph=o.ph||0,f=o.f||1,pt=o.pt||'#33415c';
 const leg=(a,len,hx,hy)=>[hx+Math.sin(a)*len,hy+Math.cos(a)*len];
 let g='<g transform="translate('+x.toFixed(1)+' '+y+') scale('+(s*f)+' '+s+')">';
 if(p==='sit'){g+='<path d="M0 -18 h14 v18" stroke="'+pt+'" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
  g+='<rect x="-7" y="-42" width="14" height="26" rx="6" fill="'+c+'"/><path d="M0 -36 l12 10" stroke="'+sk+'" stroke-width="5" stroke-linecap="round"/>';
  g+='<circle cx="0" cy="-50" r="8.5" fill="'+sk+'"/><path d="M-8.5 -51 a8.5 8.5 0 0 1 17 0 q-8 -4 -17 0z" fill="'+hr+'"/></g>';return g}
 const sw=p==='run'?0.7:p==='walk'?0.38:0;const a1=Math.sin(ph)*sw,a2=-a1;
 const [x1,y1]=leg(a1,22,0,-22),[x2,y2]=leg(a2,22,0,-22);
 g+='<path d="M0 -22 L'+x1.toFixed(1)+' '+y1.toFixed(1)+' M0 -22 L'+x2.toFixed(1)+' '+y2.toFixed(1)+'" stroke="'+pt+'" stroke-width="6" stroke-linecap="round"/>';
 const [ax1,ay1]=leg(-a1*1.2,18,0,-40),[ax2,ay2]=leg(-a2*1.2,18,0,-40);
 g+='<path d="M0 -40 L'+ax2.toFixed(1)+' '+ay2.toFixed(1)+'" stroke="'+sk+'" stroke-width="5" stroke-linecap="round"/>';
 g+='<rect x="-7" y="-44" width="14" height="26" rx="6" fill="'+c+'"/>';
 g+='<path d="M0 -40 L'+ax1.toFixed(1)+' '+ay1.toFixed(1)+'" stroke="'+sk+'" stroke-width="5" stroke-linecap="round"/>';
 g+='<circle cx="0" cy="-52" r="8.5" fill="'+sk+'"/>'+(p==='back'?'<circle cx="0" cy="-53" r="8.5" fill="'+hr+'"/>':'<path d="M-8.5 -53 a8.5 8.5 0 0 1 17 0 q-8 -4 -17 0z" fill="'+hr+'"/><circle cx="4" cy="-52" r="1.3" fill="#333"/>');
 return g+'</g>'}
function TREE(x,y,s){s=s||1;return '<g transform="translate('+x+' '+y+') scale('+s+')"><rect x="-5" y="-42" width="10" height="42" fill="#8a5a33"/><circle cx="0" cy="-62" r="24" fill="#4f9d4a"/><circle cx="-15" cy="-48" r="15" fill="#5cae55"/><circle cx="15" cy="-48" r="15" fill="#468f45"/></g>'}
/* t초 뒤 교실 모습. 시곗바늘(초바늘)은 1초에 6°, 걸어가는 친구는 1초에 MODEL.walk만큼 */
function room(t){const id='lbClp'+(++CID);let s='<rect width="640" height="300" fill="#f6efe1"/><rect y="232" width="640" height="68" fill="#d9c09a"/><rect y="228" width="640" height="6" fill="#b89a72"/>';
 s+='<rect x="150" y="34" width="230" height="110" rx="6" fill="#2f5d4a" stroke="#8a6b4a" stroke-width="6"/><text x="265" y="96" font-size="22" text-anchor="middle" fill="#e8f5ee" font-weight="800">물체의 운동</text>';
 s+='<clipPath id="'+id+'"><rect x="420" y="40" width="190" height="122"/></clipPath><rect x="420" y="40" width="190" height="122" fill="#bfe3f7"/><g clip-path="url(#'+id+')">'+TREE(560,170,1.2)+'</g>'+
  '<rect x="420" y="40" width="190" height="122" fill="none" stroke="#8a6b4a" stroke-width="6"/><line x1="515" y1="40" x2="515" y2="162" stroke="#8a6b4a" stroke-width="5"/><rect x="412" y="160" width="206" height="8" fill="#b89a72"/>';
 s+='<path d="M576 160 l4 -22 h22 l4 22z" fill="#c9673a"/><circle cx="591" cy="128" r="11" fill="#e2573f"/><circle cx="591" cy="128" r="4" fill="#ffd23f"/><path d="M591 139 v-4" stroke="#3d8b3d" stroke-width="3"/>';
 const a=t*6*Math.PI/180;
 s+='<circle cx="80" cy="74" r="34" fill="#fff" stroke="#33415c" stroke-width="5"/>';
 for(let i=0;i<12;i++){const b=i*30*Math.PI/180;s+='<line x1="'+(80+Math.sin(b)*27).toFixed(1)+'" y1="'+(74-Math.cos(b)*27).toFixed(1)+'" x2="'+(80+Math.sin(b)*31).toFixed(1)+'" y2="'+(74-Math.cos(b)*31).toFixed(1)+'" stroke="#33415c" stroke-width="2"/>'}
 s+='<line x1="80" y1="74" x2="80" y2="54" stroke="#33415c" stroke-width="4" stroke-linecap="round"/><line x1="80" y1="74" x2="96" y2="74" stroke="#33415c" stroke-width="4" stroke-linecap="round"/>'+
  '<line x1="80" y1="74" x2="'+(80+Math.sin(a)*29).toFixed(1)+'" y2="'+(74-Math.cos(a)*29).toFixed(1)+'" stroke="#e2573f" stroke-width="2.5" stroke-linecap="round"/><circle cx="80" cy="74" r="3" fill="#e2573f"/>';
 s+=P(470,246,{p:'back',c:'#7a5cc2',s:1.25});
 s+='<rect x="262" y="236" width="10" height="44" fill="#9b7a52"/>'+P(300,272,{p:'sit',c:'#e08a2e',s:1.2,f:-1})+
  '<rect x="250" y="196" width="140" height="12" rx="3" fill="#b88a5a"/><rect x="262" y="208" width="8" height="66" fill="#9b7a52"/><rect x="370" y="208" width="8" height="66" fill="#9b7a52"/>'+
  '<path d="M300 196 l-14 -10 h12 l2 10 l2 -10 h12 l-14 10z" fill="#fff" stroke="#6b7c93" stroke-width="1.5"/>';
 s+=P(40+MODEL.walk*t,292,{p:'walk',c:'#2e8b57',s:1.25,ph:t*5.5});
 return s}
/* ── 공원(420×280 좌표). t = 0 처음, 1 얼마 뒤(원본 앱의 자리) ── */
const lerp=(a,b,p)=>a+(b-a)*p;
function plane(x,y){return '<g transform="translate('+x.toFixed(1)+' '+y.toFixed(1)+')"><path d="M-30 0 Q-28 -7 -18 -7 H24 Q32 -6 34 0 Q32 5 24 6 H-18 Q-28 6 -30 0Z" fill="#F4F6F8" stroke="#6B7C93" stroke-width="2"/><path d="M-6 -6 L6 -22 H14 L8 -6Z M-6 5 L4 18 H12 L8 5Z M-26 -5 L-32 -16 H-24 L-18 -6Z" fill="#2E86C1"/><circle cx="20" cy="-1" r="2" fill="#6B7C93"/><circle cx="12" cy="-1" r="2" fill="#6B7C93"/></g>'}
function duckBoat(x,y){return '<g transform="translate('+x.toFixed(1)+' '+y+')"><path d="M-24 2 Q-24 14 0 14 Q22 14 24 2Z" fill="#F7C531" stroke="#B38A14" stroke-width="2"/><circle cx="16" cy="-8" r="9" fill="#F7C531" stroke="#B38A14" stroke-width="2"/><path d="M24 -8 l8 2 l-8 3z" fill="#E67E22"/><circle cx="18" cy="-10" r="1.6" fill="#333"/><rect x="-12" y="-10" width="20" height="12" rx="3" fill="#FFFFFF" stroke="#B38A14" stroke-width="1.5"/></g>'}
function gym(x,y){return '<g transform="translate('+x+' '+y+')"><path d="M-22 0 V-46 M22 0 V-46 M-26 -46 H26" stroke="#5D6B78" stroke-width="5" stroke-linecap="round"/><path d="M-10 -46 V-24 M10 -46 V-24" stroke="#8796A3" stroke-width="2.5"/><rect x="-14" y="-26" width="28" height="6" rx="2" fill="#E2573F"/></g>'}
function bench(x,y,w){return '<g transform="translate('+x+' '+y+')"><rect x="'+(-w/2)+'" y="-12" width="'+w+'" height="6" rx="2" fill="#9b6b3c"/><rect x="'+(-w/2)+'" y="-24" width="'+w+'" height="5" rx="2" fill="#9b6b3c"/><path d="M'+(-w/2+5)+' -6 v8 M'+(w/2-5)+' -6 v8" stroke="#6e4a29" stroke-width="3"/></g>'}
function bike(x,y){return '<g transform="translate('+x.toFixed(1)+' '+y+')"><circle cx="-16" cy="-10" r="10" fill="none" stroke="#33415c" stroke-width="3"/><circle cx="16" cy="-10" r="10" fill="none" stroke="#33415c" stroke-width="3"/><path d="M-16 -10 L-4 -26 L12 -26 L16 -10 M-4 -26 L0 -10 L-16 -10 M12 -26 L14 -32" stroke="#C0392B" stroke-width="3" fill="none" stroke-linejoin="round"/>'+P(-2,-24,{p:'sit',c:'#8E44AD',s:.62})+'</g>'}
function park(t){let s='<rect width="420" height="280" fill="#d8eefb"/><rect y="118" width="420" height="162" fill="#9fd07f"/><rect y="232" width="420" height="44" fill="#e6d3a8"/>';
 s+=plane(lerp(70,300,t),lerp(46,30,t));
 s+=TREE(40,140,.9)+TREE(390,146,.85);
 s+='<ellipse cx="235" cy="164" rx="80" ry="24" fill="#6ec3f0"/>'+duckBoat(lerp(190,280,t),166);
 s+=gym(95,208);
 s+=bench(345,214,50)+P(338,212,{p:'sit',c:'#c0392b',s:.8})+'<rect x="344" y="168" width="12" height="9" fill="#2e86c1" transform="rotate(-15 350 172)"/>';
 s+=bike(lerp(40,195,t),262);
 s+=P(lerp(390,275,t),276,{p:'run',c:'#16a085',s:.85,f:-1,ph:t?1.2:2.6});
 return s}

/* ── 실험 2: 같은 시간(5초) 동안 이동 거리 — 위에서 본 경주로 ── */
const T2={x0:110,px:4.6,yR:172,yT:250,yB:328,top:110,bot:390};
/* o: line · lineA · tape(펼친 길이 cm, true=150) · tri · triA · key(태엽 각도) · pos{R,B} cm · clock 초 · snap 찰칵 */
function track2(o){o=o||{};const X=T2.x0,PX=T2.px;let g=bgTop();
 if(o.line)g+=tapeLine(X,T2.top,T2.bot,'#2E86C1',o.lineA)+(NAR?'':'<text x="'+X+'" y="'+(T2.top-12)+'" font-size="17" text-anchor="middle" font-weight="800" fill="#123A5C">출발선</text>');
 else if(o.roll)g+=tapeRoll(X,T2.top+40,1);
 if(o.tape!=null&&o.tape!==false)g+=rulerStrip(X,T2.yT,PX,150,o.tape===true?150:o.tape);
 else if(o.rolled)g+=rolledTape(860,T2.yT,1);
 const pos=o.pos||{R:0,B:0};
 if(o.cars!==false){g+=carTop(X+pos.R*PX,T2.yR,'R',{key:o.key});g+=carTop(X+pos.B*PX,T2.yB,'B',{key:o.key})}
 if(o.tri)g+='<g'+(o.triA?an('lb-a-fade',0):'')+' fill="none" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round"><path d="M40 125 V95 H75 M885 95 H920 V125 M920 375 V405 H885 M75 405 H40 V375"/></g>';
 if(o.clock!=null)g+='<g><rect x="760" y="104" width="140" height="44" rx="12" fill="#1D232B" opacity=".88"/><text x="830" y="135" font-size="24" text-anchor="middle" font-weight="800" fill="#8EF0B2" font-family="ui-monospace,Menlo,Consolas,monospace">'+o.clock.toFixed(1)+'초</text></g>';
 if(o.snap)g+='<rect x="-100" y="-100" width="1200" height="800" fill="#FFFFFF" opacity="'+o.snap.toFixed(2)+'"/>';
 return g}
/* 확대한 사진: 자동차 앞부분 근처의 줄자(1 cm = 28 px, 작은 눈금 1 mm). d = 앞부분 cm */
function zoom2(x,y,W,H,d,k){const id='lbClp'+(++CID),U=28,L=Math.floor(d)-8;const yr=H-58;
 let s='<rect width="'+W+'" height="'+H+'" fill="var(--w-top)"/><rect x="0" y="'+yr+'" width="'+W+'" height="34" fill="#FFD84A" stroke="#B79400" stroke-width="1.5"/>';
 for(let mm=0;mm<=200;mm++){const v=L+mm/10,xx=(v-L)*U;if(xx>W)break;const big=mm%10===0,half=mm%5===0;
  s+='<line x1="'+xx.toFixed(1)+'" y1="'+yr+'" x2="'+xx.toFixed(1)+'" y2="'+(yr+(big?20:half?13:7))+'" stroke="#222" stroke-width="'+(big?1.8:.9)+'"/>';if(big)s+='<text x="'+xx.toFixed(1)+'" y="'+(yr+32)+'" font-size="13" text-anchor="middle" font-weight="700" fill="#222">'+Math.round(v)+'</text>'}
 const fx=(d-L)*U,c=CARC[k];
 s+='<rect x="'+(fx-200)+'" y="16" width="200" height="'+(yr-26)+'" rx="18" fill="'+c[0]+'" stroke="'+c[1]+'" stroke-width="3"/><rect x="'+(fx-12)+'" y="16" width="12" height="'+(yr-26)+'" rx="5" fill="#1D2229" opacity=".35"/>';
 s+='<line x1="'+fx.toFixed(1)+'" y1="8" x2="'+fx.toFixed(1)+'" y2="'+(yr+26)+'" stroke="#C2332C" stroke-width="2.5" stroke-dasharray="6 4"/>';
 return '<g transform="translate('+x+' '+y+')"><clipPath id="'+id+'"><rect width="'+W+'" height="'+H+'" rx="10"/></clipPath><g clip-path="url(#'+id+')">'+s+'</g><rect width="'+W+'" height="'+H+'" rx="10" fill="none" stroke="var(--w-felt-s)" stroke-width="3"/></g>'}

/* ── 실험 3: 같은 거리(100 cm) — 위에서 본 경주로 ── */
const T3={x0:120,px:5.4,y:240,top:150,bot:330};
/* o: line · lineA · fin · finA · tape(펼친 길이) · k 자동차 · pos cm · ghost cm · sw 초시계 글 · swOn · key */
function track3(o){o=o||{};const X=T3.x0,PX=T3.px,F=X+100*PX;let g=bgTop();
 if(o.line)g+=tapeLine(X,T3.top,T3.bot,'#2E86C1',o.lineA)+(NAR?'':'<text x="'+X+'" y="'+(T3.top-12)+'" font-size="17" text-anchor="middle" font-weight="800" fill="#123A5C">출발선</text>');
 else g+=tapeRoll(X,T3.top+30,1);
 if(o.tape!=null&&o.tape!==false)g+=rulerStrip(X,T3.bot+34,PX,110,o.tape);
 if(o.fin){g+=tapeLine(F,T3.top,T3.bot,'#C0392B',o.finA)+(NAR?'':'<text x="'+F+'" y="'+(T3.top-12)+'" font-size="17" text-anchor="middle" font-weight="800" fill="#7A1F14">결승선</text>');
  if(o.tape==null||o.tape===false)g+='<g><path d="M'+X+' '+(T3.bot+30)+' H'+F+'" stroke="#2A3342" stroke-width="2.5"/><path d="M'+X+' '+(T3.bot+22)+' v16 M'+F+' '+(T3.bot+22)+' v16" stroke="#2A3342" stroke-width="2.5"/></g>'+mini((X+F)/2,T3.bot+38,'100 cm',18)+rolledTape(880,T3.bot+30,.8)}
 else if(o.tape==null||o.tape===false)g+=rolledTape(880,T3.bot+30,.8);
 if(o.ghost!=null)g+=carTop(X+o.ghost*PX,T3.y,o.k,{ghost:1});
 if(o.k)g+=carTop(X+(o.pos||0)*PX,T3.y,o.k,{key:o.key});
 if(o.sw!=null)g+='<g transform="translate(860 105) scale(.62)">'+stopwatch(0,0,o.sw,o.swOn)+'</g>';
 return g}
function swTxt(cs){cs=Math.max(0,Math.floor(cs));const s=Math.floor(cs/100),c=cs%100;return (s<10?'0':'')+s+'.'+(c<10?'0':'')+c}

/* ── 실험 4: 표 ── */
/* o: rows 보이기 · sp 속력 글 배열 · hl 강조 줄 · expr [줄 번호] · head 속력 칸 머리 */
function speedTable(o){o=o||{};const X=150,Y=110,W=[150,170,170,170],RH=56;let g='';
 const H=['자동차','이동 거리(cm)','걸린 시간(초)','속력(cm/s)'],tot=W.reduce((a,b)=>a+b,0);
 g+='<rect x="'+(X-14)+'" y="'+(Y-16)+'" width="'+(tot+28)+'" height="'+(RH*5+32)+'" rx="14" fill="var(--w-paper)" stroke="var(--w-felt-s)" stroke-width="2"/>';
 let x=X;H.forEach((h,i)=>{g+='<rect x="'+x+'" y="'+Y+'" width="'+W[i]+'" height="'+RH+'" fill="#E7EFF9" stroke="#9AA6B2" stroke-width="1.5"/><text x="'+(x+W[i]/2)+'" y="'+(Y+35)+'" font-size="19" text-anchor="middle" font-weight="800" fill="#1B2A45">'+h+'</text>';x+=W[i]});
 MODEL.tab.forEach((t,j)=>{const y=Y+RH*(j+1);x=X;const hl=o.hl===j;
  const cells=[t[1],o.rows?String(t[2]):'',o.rows?String(t[3]):'',o.sp&&o.sp[j]?o.sp[j]:''];
  cells.forEach((c,i)=>{g+='<rect x="'+x+'" y="'+y+'" width="'+W[i]+'" height="'+RH+'" fill="'+(hl?'#FFF4C2':'#FFFFFF')+'" stroke="#9AA6B2" stroke-width="1.5"/>';
   if(i===0)g+='<rect x="'+(x+14)+'" y="'+(y+18)+'" width="20" height="20" rx="5" fill="'+CARC[t[0]][0]+'" stroke="'+CARC[t[0]][1]+'" stroke-width="1.5"/><text x="'+(x+44)+'" y="'+(y+35)+'" font-size="19" font-weight="800" fill="#141A26">'+c+'</text>';
   else g+='<text x="'+(x+W[i]/2)+'" y="'+(y+36)+'" font-size="22" text-anchor="middle" font-weight="800" fill="#141A26">'+c+'</text>';x+=W[i]})});
 if(o.expr!=null){const t=MODEL.tab[o.expr],y=Y+RH*5+40;g+='<g'+an('lb-a-pop',0)+'><rect x="250" y="'+y+'" width="460" height="64" rx="16" fill="var(--w-label)" stroke="var(--lb-sci)" stroke-width="3"/><text x="480" y="'+(y+42)+'" font-size="27" text-anchor="middle" font-weight="800" fill="var(--w-labeltx)">'+t[2]+' ÷ '+t[3]+' = ?</text></g>'}
 return g}
function transTable(){let g='<rect x="250" y="130" width="460" height="230" rx="14" fill="var(--w-paper)" stroke="var(--w-felt-s)" stroke-width="2"/>';
 const H=['교통수단','이동 거리','걸린 시간'],W=[140,150,150],X=260,Y=150,RH=60;let x=X;
 H.forEach((h,i)=>{g+='<rect x="'+x+'" y="'+Y+'" width="'+W[i]+'" height="'+RH+'" fill="#E7EFF9" stroke="#9AA6B2" stroke-width="1.5"/><text x="'+(x+W[i]/2)+'" y="'+(Y+38)+'" font-size="20" text-anchor="middle" font-weight="800" fill="#1B2A45">'+h+'</text>';x+=W[i]});
 MODEL.trans.forEach((t,j)=>{x=X;const y=Y+RH*(j+1);[t[0],t[1]+' km',t[2]+'시간'].forEach((c,i)=>{g+='<rect x="'+x+'" y="'+y+'" width="'+W[i]+'" height="'+RH+'" fill="#FFFFFF" stroke="#9AA6B2" stroke-width="1.5"/><text x="'+(x+W[i]/2)+'" y="'+(y+39)+'" font-size="22" text-anchor="middle" font-weight="800" fill="#141A26">'+c+'</text>';x+=W[i]})});
 return g}

/* ───────── 준비물 카드 ───────── */
function itemArt(k){const A={
  tripod:'<g transform="translate(0 -40)"><rect x="-40" y="-30" width="80" height="44" rx="9" fill="#1D232B"/><rect x="-34" y="-25" width="68" height="34" rx="4" fill="#BFE3F7"/>'+tripodArt(0,20,72,.9)+'</g>',
  phone:'<g transform="translate(0 6)"><rect x="-56" y="-34" width="112" height="68" rx="12" fill="#1D232B"/><rect x="-48" y="-26" width="96" height="52" rx="5" fill="#BFE3F7"/><circle cx="0" cy="0" r="11" fill="none" stroke="#FFFFFF" stroke-width="3"/><circle cx="0" cy="0" r="4" fill="#FFFFFF"/></g>',
  carRB:carTop(36,-18,'R',{s:.95})+carTop(36,26,'B',{s:.95}),
  carGY:carTop(36,-18,'G',{s:.95})+carTop(36,26,'Y',{s:.95}),
  ctape:tapeRoll(-8,4,1.2),
  measure:rolledTape(-6,4,1.3),
  watch:'<g transform="scale(.6)">'+stopwatch(0,10,'00.00',1)+'</g>'};
 return A[k]||''}
