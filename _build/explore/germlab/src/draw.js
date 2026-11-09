/* ───────── 그림: 실험대 장면 — 모두 직접 그린 SVG ───────── */
const BY=436;
let NAR=false,LEG=[];   /* 좁은 화면: 작은 그림 글자는 HTML(LEG)로 */
function an(cls,delay,extra){return ' class="lb-a '+cls+'" style="animation-delay:'+(delay||0)+'s'+(extra?';'+extra:'')+'"'}
function bg(o){o=o||{};let g='<rect x="-3000" y="-3000" width="7000" height="3416" fill="var(--w-wall)"/><rect x="-3000" y="330" width="7000" height="86" fill="var(--w-wall2)"/><rect x="-3000" y="326" width="7000" height="5" fill="var(--w-rail)"/>';
 g+='<rect x="-3000" y="416" width="7000" height="36" fill="var(--w-top)"/><rect x="-3000" y="452" width="7000" height="6" fill="var(--w-edge)"/><rect x="-3000" y="458" width="7000" height="3000" fill="var(--w-front)"/>';
 for(let i=0;i<5;i++)g+='<path d="M-3000 '+(478+i*20)+' H4000" stroke="var(--w-grain)" stroke-width="1.2" opacity=".35"/>';
 return g}
function defs(){return ''}
function svg(inner,label,vb){return '<svg viewBox="'+(vb||'0 0 960 540')+'" preserveAspectRatio="xMidYMid meet" role="img" aria-label="'+label+'">'+defs()+inner+'</svg>'}
/* 이름표(그림 아래). 좁은 화면에서는 HTML 칩으로 */
function plate(cx,txt,y,col){if(NAR){LEG.push([null,txt]);return ''}y=y||470;const w=Math.max(120,txt.length*22+44);
 return '<g><rect x="'+(cx-w/2)+'" y="'+y+'" width="'+w+'" height="46" rx="12" fill="var(--w-label)" stroke="'+(col||'var(--lb-sci)')+'" stroke-width="2.5"/><text x="'+cx+'" y="'+(y+30)+'" text-anchor="middle" font-size="23" font-weight="700" fill="var(--w-labeltx)">'+txt+'</text></g>'}
function tag(x,y,t,sz){sz=sz||20;if(NAR){LEG.push([null,t]);return ''}const w=t.length*sz*.95+24;return '<g><rect x="'+(x-w/2)+'" y="'+(y-sz*.95)+'" width="'+w+'" height="'+(sz*1.5)+'" rx="'+(sz*.5)+'" fill="var(--w-label)" stroke="var(--w-felt-s)" stroke-width="1.5"/><text x="'+x+'" y="'+(y+sz*.3)+'" text-anchor="middle" font-size="'+sz+'" font-weight="800" fill="var(--w-labeltx)">'+t+'</text></g>'}
/* 그림 속 짧은 이름(좁은 화면에서도 그림 안에 둠 — 칸 이름 ㉮㉯㉰처럼 꼭 필요한 것만) */
function mini(x,y,t,sz){sz=sz||20;const w=t.length*sz*.95+16;return '<g><rect x="'+(x-w/2)+'" y="'+(y-sz*.95)+'" width="'+w+'" height="'+(sz*1.4)+'" rx="'+(sz*.45)+'" fill="var(--w-label)" stroke="var(--w-felt-s)" stroke-width="1.5"/><text x="'+x+'" y="'+(y+sz*.28)+'" text-anchor="middle" font-size="'+sz+'" font-weight="800" fill="var(--w-labeltx)">'+t+'</text></g>'}
function qmark(x,y,col){return '<g'+an('lb-a-pop',.2)+'><circle cx="'+x+'" cy="'+y+'" r="28" fill="var(--w-label)" stroke="'+(col||'var(--lb-sci)')+'" stroke-width="3" stroke-dasharray="6 5"/><text x="'+x+'" y="'+(y+12)+'" text-anchor="middle" font-size="34" font-weight="800" fill="'+(col||'var(--lb-sci-ink)')+'">?</text></g>'}
function hand(x,y,rot,s,glove){const sk=glove?'#FFFFFF':'#F2C6A0',ss=glove?'#9AA6B2':'#B9875F';return '<g transform="translate('+x+' '+y+') rotate('+(rot||0)+') scale('+(s||1)+')"><path d="M-30 -14 Q-8 -24 18 -18 L40 -16 Q48 -15 47 -9 Q46 -4 38 -4 L22 -4 Q30 2 26 9 Q22 15 10 13 L-30 14Z" fill="'+sk+'" stroke="'+ss+'" stroke-width="2.2" stroke-linejoin="round"/><path d="M-30 -14 L-62 -14 L-62 14 L-30 14Z" fill="#5C8FCB" stroke="#3D6A9C" stroke-width="2"/></g>'}
/* 펼친 손바닥(위를 향함) */
function palm(x,y,s){s=s||1;return '<g transform="translate('+x+' '+y+') scale('+s+')"><path d="M-46 0 Q-48 -10 -38 -12 L-30 -12 L-30 -26 Q-30 -32 -24 -32 Q-18 -32 -18 -26 L-18 -14 L-8 -14 L-8 -30 Q-8 -36 -2 -36 Q4 -36 4 -30 L4 -14 L14 -14 L14 -28 Q14 -34 20 -34 Q26 -34 26 -28 L26 -12 L34 -10 Q46 -8 44 4 Q40 18 18 20 L-30 20 Q-44 18 -46 0Z" fill="#F2C6A0" stroke="#B9875F" stroke-width="2.2" stroke-linejoin="round"/><path d="M-30 20 L-30 40 L18 40 L18 20" fill="#5C8FCB" stroke="#3D6A9C" stroke-width="2"/></g>'}
function arrow(x1,y1,x2,y2,col,w){col=col||'var(--lb-sci)';w=w||7;const a=Math.atan2(y2-y1,x2-x1),L=18;
 return '<g><path d="M'+x1+' '+y1+' L'+x2+' '+y2+'" stroke="'+col+'" stroke-width="'+w+'" stroke-linecap="round"/><path d="M'+(x2-L*Math.cos(a-.5)).toFixed(1)+' '+(y2-L*Math.sin(a-.5)).toFixed(1)+' L'+x2+' '+y2+' L'+(x2-L*Math.cos(a+.5)).toFixed(1)+' '+(y2-L*Math.sin(a+.5)).toFixed(1)+'" stroke="'+col+'" stroke-width="'+w+'" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>'}
function shadow(cx,y,rx){return '<ellipse cx="'+cx+'" cy="'+y+'" rx="'+rx+'" ry="7" fill="var(--w-shadow)"/>'}
/* 작은 떨림·소리 선(두드리기·흔들기) */
function wiggle(x,y){return '<g stroke="var(--lb-sci)" stroke-width="4" fill="none" stroke-linecap="round"><path d="M'+(x-22)+' '+(y-8)+' q-10 -14 0 -26"/><path d="M'+(x+22)+' '+(y-8)+' q10 -14 0 -26"/></g>'}


/* ───────── 실험 1: 우리 반 교실(20명) ───────── */
/* 자리: 0 = 나(맨 앞줄 가운데), 1~19 = 친구 */
const SEAT=(()=>{const L=[];for(let r=0;r<4;r++)for(let c=0;c<5;c++)L.push([150+c*165,128+r*104]);const me=L.splice(17,1)[0];return [me].concat(L)})();
const DARK='#16203A',UVC='#B48CFF',GLOW='#D9FF4D';
/* 투명한 비닐장갑(손) — 아래에서 위로 든 손 */
function mitt(x,y,s,o){o=o||{};s=s||1;const fill=o.dark?'rgba(120,140,170,.35)':'rgba(236,244,250,.88)',st=o.dark?'#5A6886':'#8FA3B8';
 return '<g transform="translate('+x+' '+y+') scale('+s+')"><path d="M-9 14 V-6 Q-12 -16 -8 -20 Q-4 -22 -3 -14 V-24 Q-3 -29 1 -29 Q5 -29 5 -24 V-14 V-26 Q5 -31 9 -30 Q13 -29 12 -24 V-12 Q16 -18 19 -14 Q21 -11 17 -4 L11 8 V14Z" fill="'+fill+'" stroke="'+st+'" stroke-width="2" stroke-linejoin="round"/></g>'}
function glowAt(x,y,amt){if(!(amt>=SEEN_MIN-1e-9))return '';const k=amt>=1?1:amt>=.5?.82:.64;
 return '<g opacity="'+k+'"><circle cx="'+x+'" cy="'+y+'" r="24" fill="'+GLOW+'" opacity=".28"/><circle cx="'+x+'" cy="'+y+'" r="15" fill="'+GLOW+'" opacity=".6"/><path d="M'+(x-9)+' '+(y+12)+' V'+(y-4)+' Q'+(x-12)+' '+(y-14)+' '+(x-6)+' '+(y-18)+' L'+(x+10)+' '+(y-18)+' Q'+(x+16)+' '+(y-6)+' '+(x+11)+' '+(y+10)+'Z" fill="'+GLOW+'"/></g>'}
/* 한 사람: o.dark 불 끔 · o.amt 형광 로션 양 · o.uv 손전등 비춤 · o.hl 고른 친구 · o.mark 표시 · o.tap 누를 수 있음 */
function person(i,o){o=o||{};const [x,y]=SEAT[i],me=i===0;let g='';
 const skin=o.dark?'#5C5F72':'#F2C6A0',coat=o.dark?'#2B3654':'#FFFFFF',coatS=o.dark?'#3E4B6E':'#A9B4C2',hair=o.dark?'#22283A':'#3B2A20';
 if(o.hl)g+='<circle cx="'+x+'" cy="'+(y-12)+'" r="50" fill="none" stroke="var(--lb-lens)" stroke-width="4" stroke-dasharray="9 6"/>';
 g+='<path d="M'+(x-26)+' '+(y+26)+' Q'+(x-26)+' '+(y-8)+' '+x+' '+(y-10)+' Q'+(x+26)+' '+(y-8)+' '+(x+26)+' '+(y+26)+'Z" fill="'+coat+'" stroke="'+coatS+'" stroke-width="2"/>';
 g+='<circle cx="'+x+'" cy="'+(y-26)+'" r="15" fill="'+skin+'"/><path d="M'+(x-15)+' '+(y-28)+' Q'+(x-14)+' '+(y-44)+' '+x+' '+(y-43)+' Q'+(x+15)+' '+(y-44)+' '+(x+15)+' '+(y-28)+' Q'+(x+6)+' '+(y-36)+' '+(x-15)+' '+(y-28)+'Z" fill="'+hair+'"/>';
 g+='<path d="M'+(x+20)+' '+(y+4)+' L'+(x+34)+' '+(y-10)+'" stroke="'+coat+'" stroke-width="9" stroke-linecap="round"/><path d="M'+(x+20)+' '+(y+4)+' L'+(x+34)+' '+(y-10)+'" stroke="'+coatS+'" stroke-width="1.5" stroke-linecap="round" opacity=".6"/>';
 g+=mitt(x+36,y-14,.95,{dark:o.dark});
 if(o.dark&&o.uv)g+=glowAt(x+38,y-26,o.amt);
 if(o.mark)g+='<g><circle cx="'+(x+38)+'" cy="'+(y-26)+'" r="27" fill="none" stroke="#FFFFFF" stroke-width="4"/><circle cx="'+(x+58)+'" cy="'+(y-48)+'" r="11" fill="#FFFFFF"/><path d="M'+(x+52)+' '+(y-48)+' l4 4 l8 -8" stroke="#16203A" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>';
 g+=nameTag(x,y+44,me?'나':String(i),o.dark,me);
 if(o.tap)g='<g data-tap="'+o.tap+'" class="lb-tap" role="button" aria-label="'+(me?'내':i+'번')+' 장갑 표시하기">'+g+'<circle cx="'+(x+38)+'" cy="'+(y-26)+'" r="34" fill="transparent"/></g>';
 return g}
function nameTag(x,y,t,dark,me){const w=me?46:t.length>1?40:32;return '<g><rect x="'+(x-w/2)+'" y="'+(y-15)+'" width="'+w+'" height="26" rx="13" fill="'+(me?'var(--lb-sci)':dark?'#2B3654':'var(--w-label)')+'" stroke="'+(me?'var(--lb-sci)':dark?'#4C5B80':'var(--w-felt-s)')+'" stroke-width="1.5"/><text x="'+x+'" y="'+(y+4)+'" text-anchor="middle" font-size="17" font-weight="800" fill="'+(me?'#FFFFFF':dark?'#E8ECF2':'var(--w-labeltx)')+'">'+t+'</text></g>'}
function room(dark){return dark?'<rect x="-3000" y="-3000" width="7000" height="7000" fill="'+DARK+'"/>':'<rect x="-3000" y="-3000" width="7000" height="7000" fill="var(--w-wall)"/><rect x="-3000" y="470" width="7000" height="3000" fill="var(--w-wall2)"/>'+board()}
function board(){return '<rect x="300" y="18" width="360" height="40" rx="6" fill="#2E5E4B" stroke="#7A5A36" stroke-width="5"/>'}
/* 반 전체. o.seq 지금까지 고른 친구, o.dark, o.uv, o.hl 친구, o.marks, o.tap */
function classArt(o){o=o||{};const a=lotion(o.seq||[]);let g=room(o.dark);
 if(o.pairs)o.pairs.forEach(([p,q])=>{const [x1,y1]=SEAT[p],[x2,y2]=SEAT[q],me=p===0||q===0;
  g+='<path d="M'+(x1+36)+' '+(y1-14)+' L'+(x2+36)+' '+(y2-14)+'" stroke="'+(me?'var(--lb-sci)':o.dark?'#6F7FA6':'#A3AFBF')+'" stroke-width="'+(me?6:3)+'" stroke-dasharray="'+(me?'':'7 6')+'" stroke-linecap="round"'+an('lb-a-fade',me?0:.25)+'/>'});
 for(let i=0;i<CLS;i++)g+=person(i,{dark:o.dark,uv:o.uv,amt:a[i],hl:o.hl===i,mark:o.marks&&o.marks[i],tap:o.tap?o.tap+':'+i:''});
 if(o.dark&&o.uv)g+=uvLamp(900,520);
 return g}
function uvLamp(x,y){return '<g><path d="M'+(x-10)+' '+(y-34)+' L-300 -60 L700 -60 L'+(x+10)+' '+(y-34)+'Z" fill="'+UVC+'" opacity=".12"/><g transform="rotate(-35 '+x+' '+y+')"><rect x="'+(x-16)+'" y="'+(y-30)+'" width="32" height="56" rx="6" fill="#3A3F55" stroke="#6E7594" stroke-width="2"/><rect x="'+(x-20)+'" y="'+(y-42)+'" width="40" height="16" rx="4" fill="#565C78"/><rect x="'+(x-15)+'" y="'+(y-40)+'" width="30" height="9" rx="3" fill="'+UVC+'"/></g></g>'}
/* 악수하는 두 손(장갑) */
function shakeArt(x,y,s){s=s||1;const F='rgba(236,244,250,.95)',S='#7F96AD';
 const arm=(d)=>'<path d="M'+(d*-150)+' -20 H'+(d*-48)+' V22 H'+(d*-150)+'Z" fill="#FFFFFF" stroke="#A9B4C2" stroke-width="2.5"/>';
 return '<g transform="translate('+x+' '+y+') scale('+s+')">'+arm(1)+arm(-1)+
  '<path d="M-52 -18 Q-20 -30 14 -20 Q30 -16 30 -6 Q30 4 14 4 L-6 4 Q8 14 4 24 Q-10 30 -52 22Z" fill="'+F+'" stroke="'+S+'" stroke-width="2.5" stroke-linejoin="round"/>'+
  '<path d="M52 -22 Q24 -26 0 -14 Q-12 -6 -6 4 Q0 10 14 6 L-8 14 Q-18 20 -10 28 Q6 34 52 24Z" fill="'+F+'" stroke="'+S+'" stroke-width="2.5" stroke-linejoin="round"/>'+
  '<path d="M-6 8 Q6 14 20 10 M-4 18 Q10 24 24 20" stroke="'+S+'" stroke-width="2" fill="none" stroke-linecap="round"/></g>'}
/* 장갑 상자(20켤레) */
function gloveBox(x,y,open){let g='<g transform="translate('+x+' '+y+')"><rect x="-120" y="-40" width="240" height="90" rx="10" fill="var(--w-kraft)" stroke="var(--w-kraft-s)" stroke-width="2.5"/>';
 for(let i=0;i<7;i++)g+='<g transform="translate('+(-96+i*32)+' -40) rotate('+(i%2?6:-6)+')">'+mitt(0,0,.9,{})+'</g>';
 return g+'<rect x="-120" y="-6" width="240" height="56" rx="10" fill="var(--w-kraft)" stroke="var(--w-kraft-s)" stroke-width="2.5"/>'+(NAR?'':'<text x="0" y="30" text-anchor="middle" font-size="20" font-weight="800" fill="#5A4527">장갑 20개</text>')+'</g>'}
function trash(x,y){return '<g transform="translate('+x+' '+y+')"><path d="M-46 -40 H46 L38 60 H-38Z" fill="#8DA3B5" stroke="#5E7487" stroke-width="3" stroke-linejoin="round"/><rect x="-54" y="-52" width="108" height="14" rx="5" fill="#6F8598"/><path d="M-20 -24 L-16 44 M0 -24 V44 M20 -24 L16 44" stroke="#5E7487" stroke-width="3" stroke-linecap="round"/></g>'}
function coatPerson(x,y,o){o=o||{};let g='<g transform="translate('+x+' '+y+')"><path d="M-80 140 Q-80 20 0 14 Q80 20 80 140Z" fill="#FFFFFF" stroke="#A9B4C2" stroke-width="3"/><path d="M0 18 V140" stroke="#A9B4C2" stroke-width="2"/><path d="M-18 18 L0 50 L18 18" fill="none" stroke="#A9B4C2" stroke-width="3"/>';
 g+='<circle cx="0" cy="-36" r="48" fill="#F2C6A0"/><path d="M-48 -40 Q-46 -92 0 -90 Q46 -92 48 -40 Q24 -66 -48 -40Z" fill="#3B2A20"/>';
 if(o.goggle)g+='<rect x="-44" y="-50" width="40" height="26" rx="10" fill="#CFE6EE" fill-opacity=".7" stroke="#2F68B0" stroke-width="4"/><rect x="4" y="-50" width="40" height="26" rx="10" fill="#CFE6EE" fill-opacity=".7" stroke="#2F68B0" stroke-width="4"/><path d="M-4 -38 H4" stroke="#2F68B0" stroke-width="4"/>';
 else g+='<circle cx="-16" cy="-38" r="4" fill="#3B2A20"/><circle cx="16" cy="-38" r="4" fill="#3B2A20"/>';
 if(o.mask)g+='<path d="M-34 -18 Q0 -26 34 -18 L30 4 Q0 16 -30 4Z" fill="#DCEAF5" stroke="#7F9BAB" stroke-width="2.5"/><path d="M-34 -16 L-48 -30 M34 -16 L48 -30" stroke="#7F9BAB" stroke-width="2"/>';
 else g+='<path d="M-12 -12 Q0 -4 12 -12" stroke="#B9875F" stroke-width="3" fill="none" stroke-linecap="round"/>';
 if(o.gl2)g+='<ellipse cx="-92" cy="110" rx="18" ry="24" fill="#6FA8DC" stroke="#3D6A9C" stroke-width="2.5"/><ellipse cx="92" cy="110" rx="18" ry="24" fill="#6FA8DC" stroke="#3D6A9C" stroke-width="2.5"/>';
 else if(o.mitt)g+=mitt(-92,110,1.4,{})+mitt(92,110,1.4,{});
 else if(o.mitt1)g+='<circle cx="-92" cy="110" r="16" fill="#F2C6A0"/>'+mitt(92,104,1.4,{});
 else g+='<circle cx="-92" cy="110" r="16" fill="#F2C6A0"/><circle cx="92" cy="110" r="16" fill="#F2C6A0"/>';
 return g+'</g>'}

/* ───────── 실험 2: 건조 필름 배지 ───────── */
/* 위에서 본 배지: 가운데 둥근 칸에 3×3 눈금(한 칸 = 52) */
const FW=52;
function rnd(seed){let s=seed;return ()=>{s=(s*9301+49297)%233280;return s/233280}}
/* 빨간 점: 씻기 전 — 가운데 칸 정확히 6개, 전체 약 50개 / 씻은 뒤 — 2개(가운데 칸 밖) */
const DOTS=(()=>{const mk=(seed,n,cen)=>{const r=rnd(seed),L=[];let c=0,guard=0;
 while(L.length<n&&guard++<5000){const x=(r()*2-1)*74,y=(r()*2-1)*74;if(Math.hypot(x,y)>72)continue;const inC=Math.abs(x)<FW/2-4&&Math.abs(y)<FW/2-4,onL=Math.abs(Math.abs(x)-FW/2)<5||Math.abs(Math.abs(y)-FW/2)<5;
  if(onL)continue;if(inC&&c>=cen)continue;if(cen===0&&Math.abs(x)<FW/2+2&&Math.abs(y)<FW/2+2)continue;if(L.some(d=>Math.hypot(d[0]-x,d[1]-y)<8))continue;if(inC)c++;L.push([x,y,2.6+r()*1.6])}
 return L};const b=mk(17,50,6);return {b,a:[[44,-30,3.4],[-38,46,3]]}})();
function film(cx,cy,o){o=o||{};let g='<g transform="translate('+cx+' '+cy+')">'+shadow(0,118,110);
 g+='<rect x="-104" y="-118" width="208" height="232" rx="8" fill="#F7F3E8" stroke="#BDB3A2" stroke-width="2.5"/><rect x="-104" y="88" width="208" height="26" rx="4" fill="#E3DACA"/>';
 g+='<circle cx="0" cy="-8" r="80" fill="'+(o.wet?'#E2D2A8':'#F3EAD6')+'" stroke="#CDBF9F" stroke-width="2"/>';
 for(let k=-1;k<=2;k++){const p=-FW*1.5+k*FW+FW*0;}
 [-1.5,-.5,.5,1.5].forEach(t=>{const p=t*FW,h=Math.sqrt(Math.max(0,80*80-p*p));g+='<path d="M'+p+' '+(-8-h)+' V'+(-8+h)+' M'+(-h)+' '+(-8+p)+' H'+h+'" stroke="#D2C29E" stroke-width="1.3"/>'});
 if(o.cell)g+='<rect x="'+(-FW/2)+'" y="'+(-8-FW/2)+'" width="'+FW+'" height="'+FW+'" fill="none" stroke="var(--lb-lens)" stroke-width="3" stroke-dasharray="6 4"/>';
 if(o.dots)o.dots.forEach((d,i)=>{g+='<circle cx="'+d[0].toFixed(1)+'" cy="'+(d[1]-8).toFixed(1)+'" r="'+d[2].toFixed(1)+'" fill="#C8322B"/>';
  if(o.marks&&o.marks[i])g+='<circle cx="'+d[0].toFixed(1)+'" cy="'+(d[1]-8).toFixed(1)+'" r="'+(d[2]+3.5).toFixed(1)+'" fill="none" stroke="#1F5FB8" stroke-width="2"/>';
  if(o.tap)g+='<circle data-tap="'+o.tap+':'+i+'" class="lb-tap" cx="'+d[0].toFixed(1)+'" cy="'+(d[1]-8).toFixed(1)+'" r="7" fill="transparent"/>'});
 if(o.label)g+='<rect x="-62" y="90" width="124" height="22" rx="4" fill="#FFFFFF" stroke="#9E968A" stroke-width="1.5"/><text x="0" y="107" text-anchor="middle" font-size="16" font-weight="800" fill="#141A26">'+o.label+'</text>';
 if(o.cover)g+='<rect x="-104" y="-118" width="208" height="206" rx="8" fill="#E7E9EC" fill-opacity=".55"/>';
 return g+'</g>'}
/* 표면 검사 키트(통 + 면봉) */
function kit(x,y,o){o=o||{};let g='<g transform="translate('+x+' '+y+') rotate('+(o.rot||0)+')">';
 g+='<rect x="-18" y="-70" width="36" height="120" rx="10" fill="rgba(214,232,242,.75)" stroke="#7F9BAB" stroke-width="2.5"/><rect x="-18" y="10" width="36" height="40" rx="8" fill="#BFE0F2" opacity=".9"/>';
 if(!o.out)g+='<rect x="-21" y="-86" width="42" height="22" rx="5" fill="#2F68B0"/><path d="M0 -64 V30" stroke="#E9E2D2" stroke-width="5"/><ellipse cx="0" cy="34" rx="6" ry="10" fill="#FFFFFF" stroke="#C9BFA9" stroke-width="1.5"/>';
 if(o.drip)g+='<rect x="-6" y="50" width="12" height="12" rx="3" fill="#2F68B0"/>';
 if(o.label)g+='<rect x="-16" y="-40" width="32" height="34" rx="3" fill="#FFFFFF" stroke="#9E968A"/>';
 return g+'</g>'}
function swab(x,y,rot){return '<g transform="translate('+x+' '+y+') rotate('+(rot||0)+')"><rect x="-21" y="-12" width="42" height="22" rx="5" fill="#2F68B0"/><path d="M0 10 V104" stroke="#E9E2D2" stroke-width="5"/><ellipse cx="0" cy="108" rx="6" ry="10" fill="#FFFFFF" stroke="#C9BFA9" stroke-width="1.5"/></g>'}
function pressPad(x,y){return '<g transform="translate('+x+' '+y+')"><ellipse cx="0" cy="8" rx="78" ry="16" fill="rgba(214,232,242,.8)" stroke="#7F9BAB" stroke-width="2.5"/><rect x="-24" y="-20" width="48" height="24" rx="8" fill="#9DB7C8" stroke="#6E8CA0" stroke-width="2"/></g>'}
function soap(x,y,s){s=s||1;return '<g transform="translate('+x+' '+y+') scale('+s+')"><rect x="-40" y="-18" width="80" height="36" rx="16" fill="#F6D5E4" stroke="#C48BA6" stroke-width="2.5"/><circle cx="34" cy="-22" r="7" fill="#FFFFFF" stroke="#B9C8D3"/><circle cx="46" cy="-34" r="5" fill="#FFFFFF" stroke="#B9C8D3"/></g>'}
function bubblesAt(x,y,n,seed){const r=rnd(seed||5);let g='';for(let i=0;i<n;i++)g+='<circle cx="'+(x+(r()*2-1)*70).toFixed(1)+'" cy="'+(y+(r()*2-1)*50).toFixed(1)+'" r="'+(4+r()*7).toFixed(1)+'" fill="#FFFFFF" fill-opacity=".85" stroke="#9FC3D9" stroke-width="1.5"/>';return g}
/* 손 씻기 단계 그림(두 손 + 화살표, 단계마다 손 모양을 바꿈) */
function washArt(i,cx,cy,anim){let g='<g transform="translate('+cx+' '+cy+')">';
 const L=(x,y,rot,sc,fx)=>'<g transform="translate('+x+' '+y+') rotate('+rot+') scale('+(fx?-sc:sc)+' '+sc+')">'+palm(0,0,1)+'</g>';
 if(i<0)g+=L(-70,30,0,1.3)+L(70,30,0,1.3,1);
 else if(i===0)g+=L(-34,10,90,1.4)+L(34,10,-90,1.4,1);
 else if(i===1)g+=L(-20,0,80,1.4)+'<g opacity=".92">'+L(26,-8,-100,1.4,1)+'</g>';
 else if(i===2)g+=L(-30,10,90,1.4)+L(30,10,-90,1.4,1)+'<path d="M-30 -30 L30 30 M-30 -10 L30 50 M-30 10 L30 70" stroke="#B9875F" stroke-width="3" opacity=".5"/>';
 else if(i===3)g+=L(-30,0,180,1.3)+L(30,0,0,1.3,1);
 else if(i===4)g+=L(-34,10,90,1.4)+'<ellipse cx="34" cy="-10" rx="16" ry="30" fill="#F2C6A0" stroke="#B9875F" stroke-width="2.4"/><path d="M60 -30 a30 30 0 1 1 -10 -16" stroke="var(--lb-sci)" stroke-width="5" fill="none" stroke-linecap="round"/>';
 else g+=L(-30,20,0,1.3)+'<g transform="translate(26 -30) rotate(-60)"><rect x="-10" y="-34" width="20" height="56" rx="9" fill="#F2C6A0" stroke="#B9875F" stroke-width="2.4"/><rect x="-7" y="-34" width="14" height="10" rx="3" fill="#FFF3E6" stroke="#B9875F"/></g>';
 if(i>=0)g+='<g'+(anim?an('lb-a-rub',0):'')+'>'+arrow(-60,-90,60,-90,'var(--lb-sci)',6)+'</g>'+bubblesAt(0,10,10,i+3);
 return g+'</g>'}
function sunBox(x,y){return '<g transform="translate('+x+' '+y+')"><circle cx="0" cy="0" r="30" fill="#F7C948" stroke="#D49A1A" stroke-width="3"/>'+[...Array(8)].map((_,i)=>{const a=i*Math.PI/4;return '<path d="M'+(Math.cos(a)*40).toFixed(1)+' '+(Math.sin(a)*40).toFixed(1)+' L'+(Math.cos(a)*54).toFixed(1)+' '+(Math.sin(a)*54).toFixed(1)+'" stroke="#D49A1A" stroke-width="5" stroke-linecap="round"/>'}).join('')+'</g>'}
function calendar(x,y,d){return '<g transform="translate('+x+' '+y+')"><rect x="-70" y="-60" width="140" height="130" rx="10" fill="#FFFFFF" stroke="#A39B8B" stroke-width="2.5"/><rect x="-70" y="-60" width="140" height="34" rx="10" fill="#C2453A"/><rect x="-70" y="-36" width="140" height="10" fill="#C2453A"/>'+(NAR?'':'<text x="0" y="-36" text-anchor="middle" font-size="18" font-weight="800" fill="#FFFFFF">기다린 날</text>')+'<text x="0" y="46" text-anchor="middle" font-size="56" font-weight="800" fill="#141A26">'+d+'</text><text x="44" y="46" font-size="20" font-weight="800" fill="#141A26">일</text></g>'}
/* 따뜻한 곳(선반) 위 두 배지 — 덮개를 덮은 옆모습(안은 보이지 않음) */
function shelf(){return '<rect x="200" y="330" width="560" height="22" rx="4" fill="var(--w-box)"/><rect x="220" y="352" width="18" height="100" fill="var(--w-box2)"/><rect x="722" y="352" width="18" height="100" fill="var(--w-box2)"/>'}
function filmSide(x,y,label){return '<g transform="translate('+x+' '+y+')"><rect x="-110" y="-12" width="220" height="12" rx="3" fill="#F7F3E8" stroke="#BDB3A2" stroke-width="2"/><rect x="-60" y="-34" width="120" height="22" rx="4" fill="#FFFFFF" stroke="#9E968A" stroke-width="1.5"/><text x="0" y="-17" text-anchor="middle" font-size="16" font-weight="800" fill="#141A26">'+label+'</text></g>'}
/* ───────── 준비물 카드 ───────── */
function bottle(col,mark){return '<rect x="-24" y="-24" width="48" height="66" rx="10" fill="'+col+'" stroke="#8A97A6" stroke-width="2.5"/><rect x="-8" y="-40" width="16" height="16" fill="#9AA6B2"/><path d="M-8 -40 H-30 V-34" stroke="#9AA6B2" stroke-width="6" fill="none"/><rect x="-16" y="-4" width="32" height="26" rx="3" fill="#FFFFFF" stroke="#B9C2CC"/>'+(mark?'<circle cx="0" cy="9" r="6" fill="'+mark+'"/>':'')}
function itemArt(k){const A={
  lotion:bottle('#F4F1E8','#B48CFF'),lotion2:bottle('#F4F1E8',''),
  glove:'<g transform="translate(-18 6)">'+mitt(0,0,1.6,{})+'</g><g transform="translate(22 10)">'+mitt(0,0,1.6,{})+'</g>',
  uvl:'<g transform="rotate(-30)"><rect x="-14" y="-10" width="28" height="60" rx="6" fill="#3A3F55" stroke="#6E7594" stroke-width="2"/><rect x="-19" y="-24" width="38" height="16" rx="4" fill="#565C78"/><rect x="-14" y="-22" width="28" height="9" rx="3" fill="'+UVC+'"/></g>',
  coat:'<path d="M-40 44 V-8 Q-40 -30 -16 -34 L0 -14 L16 -34 Q40 -30 40 -8 V44Z" fill="#FFFFFF" stroke="#A9B4C2" stroke-width="2.5"/><path d="M0 -14 V44" stroke="#A9B4C2" stroke-width="2"/><path d="M-40 -6 L-56 30 M40 -6 L56 30" stroke="#A9B4C2" stroke-width="10" stroke-linecap="round"/>',
  film:'<g transform="translate(-14 -6) scale(.36)">'+film(0,0,{})+'</g><g transform="translate(16 6) scale(.36)">'+film(0,0,{})+'</g>',
  kit:'<g transform="translate(-16 2) scale(.62)">'+kit(0,0,{})+'</g><g transform="translate(18 2) scale(.62)">'+kit(0,0,{})+'</g>',
  press:pressPad(0,6),soap:soap(0,6,1),
  goggle:'<rect x="-50" y="-16" width="44" height="32" rx="12" fill="#CFE6EE" fill-opacity=".6" stroke="#2F68B0" stroke-width="4"/><rect x="6" y="-16" width="44" height="32" rx="12" fill="#CFE6EE" fill-opacity=".6" stroke="#2F68B0" stroke-width="4"/><path d="M-6 -2 H6" stroke="#2F68B0" stroke-width="4"/>',
  mask:'<path d="M-44 -18 Q0 -30 44 -18 L38 14 Q0 30 -38 14Z" fill="#DCEAF5" stroke="#7F9BAB" stroke-width="2.5"/><path d="M-44 -16 L-60 -30 M44 -16 L60 -30 M-30 -6 H30 M-30 6 H30" stroke="#7F9BAB" stroke-width="2"/>',
  glove2:'<ellipse cx="-20" cy="4" rx="20" ry="30" fill="#6FA8DC" stroke="#3D6A9C" stroke-width="2.5"/><ellipse cx="22" cy="4" rx="20" ry="30" fill="#6FA8DC" stroke="#3D6A9C" stroke-width="2.5"/>'};
 return A[k]||''}
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
