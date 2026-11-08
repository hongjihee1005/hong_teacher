/* ───────── 그림: 실험대 장면 — 모두 직접 그린 SVG ───────── */
const BY=436;
let NAR=false,LEG=[];   /* 좁은 화면: 작은 그림 글자는 HTML(LEG)로 */
function an(cls,delay,extra){return ' class="lb-a '+cls+'" style="animation-delay:'+(delay||0)+'s'+(extra?';'+extra:'')+'"'}
function bg(o){o=o||{};let g='<rect x="-3000" y="-3000" width="7000" height="3416" fill="var(--w-wall)"/><rect x="-3000" y="330" width="7000" height="86" fill="var(--w-wall2)"/><rect x="-3000" y="326" width="7000" height="5" fill="var(--w-rail)"/>';
 if(o.room){g+='<rect x="-3000" y="440" width="7000" height="3000" fill="var(--w-top)"/><rect x="-3000" y="436" width="7000" height="5" fill="var(--w-edge)"/>';return g}
 g+='<rect x="-3000" y="416" width="7000" height="36" fill="var(--w-top)"/><rect x="-3000" y="452" width="7000" height="6" fill="var(--w-edge)"/><rect x="-3000" y="458" width="7000" height="3000" fill="var(--w-front)"/>';
 for(let i=0;i<5;i++)g+='<path d="M-3000 '+(478+i*20)+' H4000" stroke="var(--w-grain)" stroke-width="1.2" opacity=".35"/>';
 return g}
function defs(){return ''}
function svg(inner,label,vb){return '<svg viewBox="'+(vb||'0 0 960 540')+'" preserveAspectRatio="xMidYMid meet" role="img" aria-label="'+label+'">'+defs()+inner+'</svg>'}
/* 이름표(그림 아래). 좁은 화면에서는 HTML 칩으로 */
function plate(cx,txt,y,col){if(NAR){LEG.push([null,txt]);return ''}y=y||470;const w=Math.max(120,txt.length*22+44);
 return '<g><rect x="'+(cx-w/2)+'" y="'+y+'" width="'+w+'" height="46" rx="12" fill="var(--w-label)" stroke="'+(col||'var(--lb-sci)')+'" stroke-width="2.5"/><text x="'+cx+'" y="'+(y+30)+'" text-anchor="middle" font-size="23" font-weight="700" fill="var(--w-labeltx)">'+txt+'</text></g>'}
function tag(x,y,t,sz){sz=sz||20;if(NAR){LEG.push([null,t]);return ''}const w=t.length*sz*.95+24;return '<g><rect x="'+(x-w/2)+'" y="'+(y-sz*.95)+'" width="'+w+'" height="'+(sz*1.5)+'" rx="'+(sz*.5)+'" fill="var(--w-label)" stroke="var(--w-felt-s)" stroke-width="1.5"/><text x="'+x+'" y="'+(y+sz*.3)+'" text-anchor="middle" font-size="'+sz+'" font-weight="800" fill="var(--w-labeltx)">'+t+'</text></g>'}
function qmark(x,y,col){return '<g'+an('lb-a-pop',.2)+'><circle cx="'+x+'" cy="'+y+'" r="28" fill="var(--w-label)" stroke="'+(col||'var(--lb-sci)')+'" stroke-width="3" stroke-dasharray="6 5"/><text x="'+x+'" y="'+(y+12)+'" text-anchor="middle" font-size="34" font-weight="800" fill="'+(col||'var(--lb-sci-ink)')+'">?</text></g>'}
function hand(x,y,rot,s){return '<g transform="translate('+x+' '+y+') rotate('+(rot||0)+') scale('+(s||1)+')"><path d="M-30 -14 Q-8 -24 18 -18 L40 -16 Q48 -15 47 -9 Q46 -4 38 -4 L22 -4 Q30 2 26 9 Q22 15 10 13 L-30 14Z" fill="#F2C6A0" stroke="#B9875F" stroke-width="2.2" stroke-linejoin="round"/><path d="M-30 -14 L-62 -14 L-62 14 L-30 14Z" fill="#5C8FCB" stroke="#3D6A9C" stroke-width="2"/></g>'}
function arrow(x1,y1,x2,y2,col,w){col=col||'var(--lb-sci)';w=w||7;const a=Math.atan2(y2-y1,x2-x1),L=18;
 return '<g><path d="M'+x1+' '+y1+' L'+x2+' '+y2+'" stroke="'+col+'" stroke-width="'+w+'" stroke-linecap="round"/><path d="M'+(x2-L*Math.cos(a-.5)).toFixed(1)+' '+(y2-L*Math.sin(a-.5)).toFixed(1)+' L'+x2+' '+y2+' L'+(x2-L*Math.cos(a+.5)).toFixed(1)+' '+(y2-L*Math.sin(a+.5)).toFixed(1)+'" stroke="'+col+'" stroke-width="'+w+'" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>'}

/* ───────── 실험 1: 책상 · 상자 · 팔에 드는 힘 ───────── */
function deskTop(){return '<g><path d="M132 180 H868 L924 392 H76Z" fill="#D9B784" stroke="#9C7443" stroke-width="3" stroke-linejoin="round"/><rect x="76" y="392" width="848" height="26" fill="#B98E5E" stroke="#8A6537" stroke-width="2.5"/>'+
 '<rect x="100" y="418" width="22" height="100" fill="#8A6537"/><rect x="878" y="418" width="22" height="100" fill="#8A6537"/>'+
 '<path d="M132 180 L76 392" stroke="#7A5530" stroke-width="7" stroke-linecap="round"/>'+(NAR?'':'<text x="84" y="170" font-size="17" font-weight="800" fill="var(--w-labeltx)">책상 끝</text>')+'</g>'}
/* 열린 상자. x = 앞면 왼쪽, yb = 바닥, n = 복사용지 묶음 수, s = 크기 */
function cbox(x,yb,n,lbl,s){s=s||1;const w=140*s,h=82*s,dx=22*s,dy=-18*s,y=yb-h;let g='<g>';
 g+='<ellipse cx="'+(x+w/2+dx/2)+'" cy="'+(yb+2)+'" rx="'+(w/2+10)+'" ry="'+(7*s)+'" fill="var(--w-shadow)"/>';
 g+='<path d="M'+(x+w)+' '+y+' l'+dx+' '+dy+' v'+h+' l'+(-dx)+' '+(-dy)+'Z" fill="#C9A469" stroke="#8C6A35" stroke-width="2"/>';
 g+='<path d="M'+x+' '+y+' l'+dx+' '+dy+' h'+w+' l'+(-dx)+' '+(-dy)+'Z" fill="#7E5C33" stroke="#8C6A35" stroke-width="2"/>';
 g+='<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="#E2C38A" stroke="#8C6A35" stroke-width="2.5"/>';
 /* 앞면 창: 들어 있는 묶음 수가 보임 */
 const wx=x+w*.52,ww=w*.42,wy=y+8*s,wh=h-14*s;g+='<rect x="'+wx+'" y="'+wy+'" width="'+ww+'" height="'+wh+'" rx="3" fill="#5E4424"/>';
 for(let i=0;i<n;i++)g+='<rect x="'+(wx+3)+'" y="'+(wy+wh-3-(i+1)*14*s)+'" width="'+(ww-6)+'" height="'+(12*s)+'" rx="2" fill="#FFFFFF" stroke="#A39B8B" stroke-width="1.2"/>';
 g+='<text x="'+(x+w*.26)+'" y="'+(y+h*.66)+'" text-anchor="middle" font-size="'+(38*s)+'" font-weight="800" fill="#5A3E1C">'+lbl+'</text>';
 return g+'</g>'}
/* 묶음 수가 보이는 상자 그림 */
const BX={A:{n:4,l:'㉮',yb:384,s:1.55},B:{n:1,l:'㉯',yb:262,s:1.3}};
/* 상자 앞면 창 안 i번째 묶음 자리 */
function slab(k,x,i){const B=BX[k],s=B.s,w=140*s,h=82*s,y=B.yb-h,wx=x+w*.52,ww=w*.42,wy=y+8*s,wh=h-14*s;return [wx+3,wy+wh-3-(i+1)*14*s,ww-6,12*s]}
function boxAt(k,x,o){o=o||{};const B=BX[k];return cbox(x,B.yb,o.empty?0:B.n,B.l,B.s)}
/* 팔에 드는 힘 막대 두 개 (5칸, 이 자료에서 정한 칸 수) */
function gauge(x,y,lv,names,anim){let g='<g><rect x="'+x+'" y="'+y+'" width="200" height="206" rx="16" fill="var(--w-label)" stroke="var(--w-felt-s)" stroke-width="2"/>';
 g+=NAR?'':'<text x="'+(x+100)+'" y="'+(y+30)+'" text-anchor="middle" font-size="19" font-weight="800" fill="var(--w-labeltx)">팔에 드는 힘</text>';if(NAR)LEG.push([null,'팔에 드는 힘']);
 [0,1].forEach(i=>{const cx=x+56+i*88,L=lv[i];for(let k=0;k<5;k++){const on=L!=null&&k<L,yy=y+150-k*24;
   g+='<rect x="'+(cx-26)+'" y="'+yy+'" width="52" height="20" rx="4" fill="'+(on?'var(--lb-sci)':'var(--w-wall)')+'" stroke="var(--w-felt-s)" stroke-width="1.5"'+(on&&anim===i?an('lb-a-pop',.25+k*.22):'')+'/>'}
  g+='<text x="'+cx+'" y="'+(y+194)+'" text-anchor="middle" font-size="22" font-weight="800" fill="var(--w-labeltx)">'+names[i]+'</text>'});
 return g+'</g>'}
/* 물통 */
function bottle(x,yb,full,s){s=s||1;const w=58*s,h=120*s,y=yb-h;let g='<g><ellipse cx="'+(x+w/2)+'" cy="'+(yb+2)+'" rx="'+(w/2+6)+'" ry="6" fill="var(--w-shadow)"/>';
 g+='<rect x="'+(x+w*.3)+'" y="'+(y-16*s)+'" width="'+(w*.4)+'" height="'+(18*s)+'" rx="3" fill="#3D7CC9"/>';
 g+='<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+(14*s)+'" fill="var(--w-glass)" stroke="var(--w-glass-s)" stroke-width="3"/>';
 if(full)g+='<rect x="'+(x+4)+'" y="'+(y+14*s)+'" width="'+(w-8)+'" height="'+(h-18*s)+'" rx="'+(10*s)+'" fill="var(--w-water)" opacity=".9"/>';
 return g+'</g>'}

/* ───────── 실험 2: 숫자가 표시된 판 · 받침대 ───────── */
const PX=480,PY=330,CW=72;
function plankBoard(b){let g='<rect x="80" y="300" width="800" height="30" rx="5" fill="#E7C489" stroke="#9C7443" stroke-width="2.5"/>';
 for(let k=1;k<=5;k++)[-1,1].forEach(d=>{const cx=PX+d*CW*k;g+='<path d="M'+(cx-CW/2)+' 300 v30" stroke="#B48A55" stroke-width="1.5"/><text x="'+cx+'" y="323" text-anchor="middle" font-size="19" font-weight="800" fill="#5A3E1C">'+k+'</text>'});
 g+='<path d="M'+(PX-CW*5.5)+' 300 v30 M'+(PX+CW*5.5)+' 300 v30" stroke="#B48A55" stroke-width="1.5"/><circle cx="'+PX+'" cy="315" r="5" fill="#5A3E1C"/>';
 const cube=(cx,i,anim)=>'<g'+(anim?an('lb-a-down',0,'--from:-90px'):'')+'><rect x="'+(cx-23)+'" y="'+(258-i*40)+'" width="46" height="40" rx="6" fill="#E0A23A" stroke="#9A6A14" stroke-width="2.5"/><path d="M'+(cx-15)+' '+(270-i*40)+' h30" stroke="#F6D38A" stroke-width="3" stroke-linecap="round"/></g>';
 ['l','r'].forEach(sd=>{const o=(b&&b[sd])||{};for(const k in o)for(let i=0;i<o[k];i++)g+=cube(PX+(sd==='l'?-1:1)*CW*k,i,b.anim&&b.anim[0]===sd&&+b.anim[1]===+k&&i===o[k]-1)});
 return g}
function fulcrum(){return '<path d="M'+PX+' 330 L'+(PX-52)+' 416 H'+(PX+52)+'Z" fill="#7E93A8" stroke="#4E6175" stroke-width="3" stroke-linejoin="round"/>'+(NAR?'':'<text x="'+PX+'" y="406" text-anchor="middle" font-size="16" font-weight="800" fill="#FFFFFF">받침대</text>')}
const TILT=7;
function balance(b,o){o=o||{};const a1=boardTilt(b)*TILT,a0=o.a0==null?a1:o.a0;let g=fulcrum();
 const inner=plankBoard(b);
 if(o.drop)g+='<g'+an('lb-a-down',0,'--from:-70px')+'>'+inner+'</g>';
 else if(o.anim&&a0!==a1)g+='<g class="lb-a lb-a-rot" style="--a0:'+a0+'deg;--a1:'+a1+'deg">'+inner+'</g>';
 else g+='<g transform="rotate('+a1+' '+PX+' '+PY+')">'+inner+'</g>';
 if(o.label!==false&&!NAR)g+='<text x="'+(PX)+'" y="'+(PY+112)+'" text-anchor="middle" font-size="18" font-weight="800" fill="var(--w-labeltx)">'+'</text>';
 return g}
function levelTag(b){const t=boardTilt(b);return tag(PX,90,t===0?'수평':t<0?'왼쪽으로 기울어요':'오른쪽으로 기울어요',22)}

/* ───────── 실험 3: 전자저울 · 학용품 ───────── */
function stat(k,cx,cy,s,rot){s=s||1;let a='';
 if(k==='cp')a='<path d="M-110 -9 H86 L112 0 L86 9 H-110Z" fill="#D9473A" stroke="#8E2A21" stroke-width="2"/><path d="M86 -9 L112 0 L86 9Z" fill="#F2D7B5" stroke="#8E2A21" stroke-width="2"/><path d="M104 -3 L112 0 L104 3Z" fill="#D9473A"/>';
 if(k==='sp')a='<rect x="-104" y="-10" width="170" height="20" rx="8" fill="#2E3440" stroke="#14181F" stroke-width="2"/><rect x="40" y="-12" width="62" height="24" rx="8" fill="#5D6878" stroke="#14181F" stroke-width="2"/><path d="M102 -4 L114 0 L102 4Z" fill="#14181F"/><rect x="-70" y="-6" width="60" height="12" rx="3" fill="#FFFFFF" opacity=".75"/>';
 if(k==='bm')a='<rect x="-110" y="-17" width="176" height="34" rx="12" fill="#2F68B0" stroke="#1C416F" stroke-width="2"/><rect x="40" y="-19" width="74" height="38" rx="12" fill="#1C416F"/><rect x="-80" y="-9" width="80" height="18" rx="4" fill="#FFFFFF" opacity=".85"/>';
 if(k==='ru')a='<rect x="-118" y="-15" width="236" height="30" rx="3" fill="#F3D27A" stroke="#B4902F" stroke-width="2" opacity=".95"/>'+Array.from({length:23},(_,i)=>'<path d="M'+(-110+i*10)+' -15 v'+(i%5?7:12)+'" stroke="#6B551A" stroke-width="1.5"/>').join('');
 return '<g transform="translate('+cx+' '+cy+') rotate('+(rot||0)+') scale('+s+')">'+a+'</g>'}
/* x 가운데, 화면 글, 상태 */
function escale(x,o){o=o||{};let g='<g>';const L=x-180;
 g+='<ellipse cx="'+x+'" cy="'+(BY+2)+'" rx="190" ry="9" fill="var(--w-shadow)"/>';
 g+='<path d="M'+L+' 372 L'+(L+18)+' 352 H'+(L+378)+' L'+(L+360)+' 372Z" fill="#CBD3DB" stroke="#7F8C99" stroke-width="2"/>';
 g+='<rect x="'+L+'" y="372" width="360" height="64" rx="10" fill="#E3E8ED" stroke="#7F8C99" stroke-width="2.5"/>';
 g+='<rect x="'+(L+40)+'" y="344" width="240" height="10" rx="3" fill="#9AA6B2"/><rect x="'+(L+20)+'" y="330" width="280" height="16" rx="6" fill="#F4F6F8" stroke="#7F8C99" stroke-width="2.5"/>';
 /* 수준기 */
 const bx=L+332,by=362;g+='<circle cx="'+bx+'" cy="'+by+'" r="12" fill="#DFF2EA" stroke="#5E7C70" stroke-width="2"/><circle cx="'+bx+'" cy="'+by+'" r="6" fill="none" stroke="#2F6B53" stroke-width="1.6"/><circle cx="'+(bx+(o.tilted?7:0))+'" cy="'+(by-(o.tilted?2:0))+'" r="3.6" fill="#FFFFFF" stroke="#2F6B53" stroke-width="1.2"/>';
 /* 화면 */
 g+='<rect x="'+(L+40)+'" y="384" width="170" height="42" rx="6" fill="'+(o.on?'#16241B':'#3A4148')+'" stroke="#2A3138" stroke-width="2"/>';
 if(o.on)g+='<text x="'+(L+186)+'" y="416" text-anchor="end" font-size="30" font-weight="800" font-family="ui-monospace,Menlo,Consolas,monospace" fill="'+(o.hl?'#FFE66B':'#8EF0B2')+'"'+(o.hl?an('lb-a-pulse',0):'')+'>'+esc(o.val)+'</text><text x="'+(L+202)+'" y="416" text-anchor="end" font-size="14" font-weight="800" fill="#8EF0B2">g</text>';
 /* 단추 */
 [['전원',L+260,o.pw],['영점',L+320,o.zp]].forEach(([t,cx,p])=>{g+='<circle cx="'+cx+'" cy="404" r="15" fill="'+(p?'var(--lb-sci)':'#FFFFFF')+'" stroke="#5D6B78" stroke-width="2.5"/>'+(NAR?'':'<text x="'+cx+'" y="432" text-anchor="middle" font-size="13" font-weight="800" fill="#2A3138">'+t+'</text>')});
 if(o.item)g+='<g'+(o.drop?an('lb-a-down',0,'--from:-120px'):'')+'>'+stat(o.item,x-20,318,.95)+'</g>';
 return g+'</g>'}
const ES={x:480};   /* 전자저울 자리 */

/* ───────── 실험 4: 스탠드 · 용수철저울 ───────── */
const SP={x:560,top:72,z:86,k:.8,rod:188};   /* 0 g 눈금의 y, 1 g = 0.8 px, 표시 자 ~ 고리 길이 */
const pY=v=>SP.z+SP.k*Math.max(-20,Math.min(210,v));
function stand(){const x=SP.x;return '<g><rect x="250" y="418" width="230" height="20" rx="5" fill="#5D6878" stroke="#3B4450" stroke-width="2"/><rect x="300" y="20" width="14" height="400" rx="5" fill="#9AA6B2" stroke="#5D6878" stroke-width="2"/>'+
 '<rect x="300" y="24" width="'+(x-290)+'" height="12" rx="4" fill="#9AA6B2" stroke="#5D6878" stroke-width="2"/><rect x="294" y="18" width="26" height="26" rx="5" fill="#5D6878"/></g>'}
function hangItem(k,x,y){let a='';
 if(k==='cpen')a='<path d="M0 0 v14" stroke="#555" stroke-width="2.5"/>'+['#D9473A','#E9C23B','#3FA2A2','#6C5BC4','#6DB54A'].map((c,i)=>'<rect x="'+(-22+i*9)+'" y="14" width="8" height="96" rx="2" fill="'+c+'" stroke="rgba(0,0,0,.35)" stroke-width="1"/><path d="M'+(-22+i*9)+' 110 l4 10 l4 -10Z" fill="#F2D7B5"/>').join('')+'<rect x="-25" y="44" width="48" height="8" rx="3" fill="#C0563A"/>';
 if(k==='spen')a='<path d="M0 0 v14" stroke="#555" stroke-width="2.5"/>'+['#2E3440','#B3261E','#2F68B0','#2E3440'].map((c,i)=>'<rect x="'+(-18+i*10)+'" y="14" width="9" height="92" rx="3" fill="'+c+'" stroke="#14181F" stroke-width="1"/>').join('')+'<rect x="-21" y="44" width="44" height="8" rx="3" fill="#C0563A"/>';
 if(k==='bag'||k==='clay')a='<path d="M0 0 v8" stroke="#555" stroke-width="2.5"/><path d="M-40 8 H40 V96 Q40 104 32 104 H-32 Q-40 104 -40 96Z" fill="rgba(214,232,242,.55)" stroke="#7F9BAB" stroke-width="2.5"/><path d="M-40 18 H40" stroke="#C0563A" stroke-width="3"/><circle cx="0" cy="12" r="3.5" fill="none" stroke="#555" stroke-width="2"/>'+(k==='clay'?'<path d="M-26 96 Q-30 70 -8 68 Q4 56 18 66 Q32 70 28 96Z" fill="#8A5A3B" stroke="#5E3B24" stroke-width="2"/>':'');
 return '<g transform="translate('+x+' '+y+')">'+a+'</g>'}
/* read: 표시 자가 가리키는 무게, item: 걸린 물체, eye: up·lv·dn */
function sscale(o){o=o||{};const x=SP.x,read=o.read==null?0:o.read,py=pY(read);let g='<g>';
 g+='<path d="M'+x+' 36 v10" stroke="#555" stroke-width="3"/><circle cx="'+x+'" cy="52" r="6" fill="none" stroke="#555" stroke-width="3"/>';
 g+='<rect x="'+(x-14)+'" y="58" width="28" height="13" rx="4" fill="'+(o.screw?'var(--lb-sci)':'#8C7B54')+'" stroke="#5A4A26" stroke-width="2"/>'+(NAR?'':'<text x="'+(x-22)+'" y="70" text-anchor="end" font-size="14" font-weight="800" fill="var(--w-labeltx)">영점 조절 나사</text>');
 g+='<rect x="'+(x-30)+'" y="'+SP.top+'" width="60" height="196" rx="10" fill="#EAF1F6" stroke="#6C8597" stroke-width="2.5"/><rect x="'+(x-24)+'" y="'+(SP.top+6)+'" width="34" height="184" fill="#FFFFFF"/>';
 for(let v=0;v<=200;v+=5){const yy=SP.z+SP.k*v,big=v%25===0;g+='<path d="M'+(x+10)+' '+yy+' h'+(big?-16:-8)+'" stroke="#2A3138" stroke-width="'+(big?1.6:1)+'"/>';if(big)g+='<text x="'+(x-8)+'" y="'+(yy+4)+'" text-anchor="end" font-size="11" font-weight="700" fill="#2A3138">'+v+'</text>'}
 /* 표시 자 + 고리 */
 const mv=o.anim?an('lb-a-bob',0,'--dy:'+(o.from==null?0:(pY(o.from)-py))+'px'):'';
 g+='<g'+mv+'><path d="M'+(x-26)+' '+py+' H'+(x+20)+'" stroke="#D9473A" stroke-width="3.2"/><path d="M'+(x+20)+' '+(py-6)+' L'+(x+30)+' '+py+' L'+(x+20)+' '+(py+6)+'Z" fill="#D9473A"/>';
 g+='<path d="M'+x+' '+(py+2)+' V'+(py+SP.rod)+'" stroke="#8C9AA6" stroke-width="4"/>';
 const hy=py+SP.rod;g+='<path d="M'+x+' '+hy+' v10 q0 12 -10 12 q-10 0 -10 -10" stroke="#555" stroke-width="3.5" fill="none" stroke-linecap="round"/>';
 if(o.item)g+=hangItem(o.item,x-10,hy+16);
 g+='</g>';
 if(o.eye){const ey=py+(o.eye==='up'?-60:o.eye==='dn'?60:0),ex=x+150;const hit=py+(py-ey)*.45;
  g+='<path d="M'+(ex-6)+' '+ey+' L'+(x-26)+' '+hit+'" stroke="'+(o.eye==='lv'?'var(--lb-sci)':'#D9473A')+'" stroke-width="2.5" stroke-dasharray="7 6"/>';
  g+='<g transform="translate('+ex+' '+ey+')"><path d="M-22 0 Q0 -16 22 0 Q0 16 -22 0Z" fill="#FFFFFF" stroke="#2A3138" stroke-width="2.5"/><circle cx="-4" cy="0" r="6" fill="#2A3138"/></g>';
  if(o.eye!=='lv')g+='<path d="M'+(x-34)+' '+(hit-8)+' l12 16 M'+(x-22)+' '+(hit-8)+' l-12 16" stroke="#D9473A" stroke-width="3"/>'}
 return g+'</g>'}
function pSpot(){return [SP.x-6,pY(readNow()),26,2.5,790,130]}

/* ───────── 실험 5: 힘 측정기 · 우유 · 지레 · 빗면 ───────── */
function fmeter(x,y,o){o=o||{};let g='<g transform="translate('+x+' '+y+') rotate('+(o.rot||0)+')">';
 g+='<rect x="-36" y="-70" width="72" height="120" rx="14" fill="#F28C38" stroke="#A3551A" stroke-width="2.5"/><rect x="-28" y="-60" width="56" height="34" rx="5" fill="'+(o.on?'#16241B':'#3A4148')+'"/>';
 if(o.on)g+='<text x="22" y="-34" text-anchor="end" font-size="23" font-weight="800" font-family="ui-monospace,Menlo,Consolas,monospace" fill="'+(o.hl?'#FFE66B':'#8EF0B2')+'">'+esc(o.val==null?'0':o.val)+'</text>';
 g+='<circle cx="-14" cy="-6" r="7" fill="#FFFFFF" stroke="#A3551A" stroke-width="2"/><circle cx="14" cy="-6" r="7" fill="#FFFFFF" stroke="#A3551A" stroke-width="2"/>';
 g+='<rect x="-6" y="50" width="12" height="26" fill="#8C9AA6"/>';
 g+=o.push?'<rect x="-14" y="74" width="28" height="10" rx="4" fill="#5D6878"/>':'<path d="M0 76 v8 q0 12 -10 12 q-10 0 -10 -10" stroke="#555" stroke-width="3.5" fill="none" stroke-linecap="round"/>';
 return g+'</g>'}
function milk(x,yb,s,rot){s=s||1;return '<g transform="translate('+x+' '+yb+') rotate('+(rot||0)+') scale('+s+')"><path d="M-30 0 V-86 L-20 -110 H20 L30 -86 V0Z" fill="#FFFFFF" stroke="#3D7CC9" stroke-width="3" stroke-linejoin="round"/><path d="M-30 -86 H30" stroke="#3D7CC9" stroke-width="2.5"/><rect x="-30" y="-62" width="60" height="30" fill="#3D7CC9"/>'+(NAR?'':'<text x="0" y="-41" text-anchor="middle" font-size="16" font-weight="800" fill="#FFFFFF">우유</text>')+'<circle cx="0" cy="-104" r="4" fill="none" stroke="#555" stroke-width="2"/></g>'}
function blockStack(x,n){let g='';for(let i=0;i<n;i++)g+='<rect x="'+x+'" y="'+(BY-36*(i+1))+'" width="110" height="36" rx="3" fill="#C9944F" stroke="#8A6537" stroke-width="2.5"/>';return g}
/* 지레: 받침대 x=FX, 나무판 왼쪽 끝 140 ~ 오른쪽 끝 780 */
const FX=300,FY=380;
function lever(o){o=o||{};let g='<path d="M'+FX+' '+FY+' L'+(FX-36)+' '+BY+' H'+(FX+36)+'Z" fill="#7E93A8" stroke="#4E6175" stroke-width="3" stroke-linejoin="round"/>'+(NAR?'':'<text x="'+FX+'" y="'+(BY+26)+'" text-anchor="middle" font-size="16" font-weight="800" fill="var(--w-labeltx)">받침대</text>');
 const a0=o.a0==null?-5:o.a0,a1=o.a1==null?a0:o.a1;
 let inner='<rect x="140" y="'+(FY-16)+'" width="640" height="16" rx="4" fill="#D9B784" stroke="#9C7443" stroke-width="2.5"/>';
 if(o.milk)inner+='<g'+(o.milkDrop?an('lb-a-down',0,'--from:-90px'):'')+'>'+milk(o.milk==='far'?720:200,FY-16,.75)+'</g>';
 if(o.press)inner+='<g>'+fmeter(o.press==='near'?470:720,FY-16-74,{on:true,val:o.val,push:true,hl:o.hl})+hand(o.press==='near'?470:720,FY-16-74-70-42,90,.9)+'</g>';
 if(o.anim&&a0!==a1)g+='<g class="lb-a lb-a-rot" style="--a0:'+a0+'deg;--a1:'+a1+'deg;--ox:'+FX+'px;--oy:'+FY+'px">'+inner+'</g>';
 else g+='<g transform="rotate('+a1+' '+FX+' '+FY+')">'+inner+'</g>';
 return g}
/* 빗면: 아래 (200, BY) → 위 (690, BY-108) */
const SL={x0:200,y0:BY,x1:690,y1:BY-108};
function slope(o){o=o||{};let g=blockStack(640,3);
 g+='<path d="M'+SL.x0+' '+SL.y0+' L'+(SL.x1+40)+' '+(SL.y1-9)+'" stroke="#9C7443" stroke-width="18" stroke-linecap="round"/><path d="M'+SL.x0+' '+SL.y0+' L'+(SL.x1+40)+' '+(SL.y1-9)+'" stroke="#D9B784" stroke-width="13" stroke-linecap="round"/>';
 if(o.hold)g+=hand(SL.x0-30,SL.y0-6,0,.8);
 const ang=Math.atan2(SL.y1-SL.y0,SL.x1-SL.x0)*180/Math.PI;
 if(o.milk!=null){const t=o.milk,mx=SL.x0+80+(SL.x1-SL.x0-140)*t,my=SL.y0-6+(SL.y1-SL.y0)*(80+(SL.x1-SL.x0-140)*t)/(SL.x1-SL.x0);
  const mv=o.anim?an('lb-a-slope',0,'--dx:'+(-(SL.x1-SL.x0-140)*.7).toFixed(0)+'px;--dy:'+(-(SL.y1-SL.y0)*.7*(SL.x1-SL.x0-140)/(SL.x1-SL.x0)).toFixed(0)+'px'):'';
  g+='<g'+mv+'>'+milk(mx,my,.7,ang)+(o.meter?'<path d="M'+(mx+20)+' '+(my-40)+' L'+(mx+110)+' '+(my-66)+'" stroke="#555" stroke-width="3"/>'+fmeter(mx+150,my-78,{on:true,val:o.val,hl:o.hl,rot:ang-90+180})+hand(mx+188,my-92,ang,.8):'')+'</g>'}
 return g}
function mSpot(){const s=curStep().id;if(s==='direct')return [480,147,40,1.9,740,150];if(s==='lever')return [728,277,40,1.9,500,110];return null}
/* 빗면에서는 힘 측정기가 비스듬해서 화면을 따로 크게 보여 줌 */
function slopeCallout(val,hl){return '<g><path d="M640 132 L720 236" stroke="var(--lb-lens)" stroke-width="4" stroke-dasharray="10 7"/><rect x="480" y="62" width="190" height="78" rx="14" fill="#F28C38" stroke="#A3551A" stroke-width="3"/><rect x="494" y="74" width="162" height="54" rx="8" fill="#16241B"/><text x="644" y="115" text-anchor="end" font-size="38" font-weight="800" font-family="ui-monospace,Menlo,Consolas,monospace" fill="'+(hl?'#FFE66B':'#8EF0B2')+'">'+esc(val==null?'0':val)+'</text>'+(NAR?'':'<text x="575" y="54" text-anchor="middle" font-size="17" font-weight="800" fill="var(--w-labeltx)">힘 측정기 화면</text>')+'</g>'}

/* ───────── 준비물 카드 ───────── */
function itemArt(k){const A={
  paper:[0,1,2].map(i=>'<rect x="-46" y="'+(10-i*16)+'" width="92" height="14" rx="2" fill="#FFFFFF" stroke="#A39B8B" stroke-width="2"/>').join('')+'<path d="M-46 -20 h92" stroke="#3D7CC9" stroke-width="3"/>',
  cbox:'<path d="M-50 -20 l14 -12 h86 l-14 12Z" fill="#7E5C33"/><rect x="-50" y="-20" width="86" height="56" fill="#E2C38A" stroke="#8C6A35" stroke-width="2"/><path d="M36 -20 l14 -12 v56 l-14 12Z" fill="#C9A469" stroke="#8C6A35" stroke-width="2"/>',
  plank:'<rect x="-66" y="-10" width="132" height="20" rx="3" fill="#E7C489" stroke="#9C7443" stroke-width="2"/>'+[-50,-34,-18,18,34,50].map(x=>'<path d="M'+x+' -10 v20" stroke="#B48A55" stroke-width="1.2"/>').join(''),
  stand:'<path d="M0 -26 L-34 30 H34Z" fill="#7E93A8" stroke="#4E6175" stroke-width="2.5" stroke-linejoin="round"/>',
  cube:[-34,0,34].map(x=>'<rect x="'+(x-14)+'" y="-12" width="28" height="26" rx="4" fill="#E0A23A" stroke="#9A6A14" stroke-width="2"/>').join(''),
  escale:'<rect x="-58" y="-6" width="116" height="34" rx="6" fill="#E3E8ED" stroke="#7F8C99" stroke-width="2"/><rect x="-50" y="-16" width="100" height="10" rx="4" fill="#F4F6F8" stroke="#7F8C99" stroke-width="2"/><rect x="-44" y="2" width="56" height="18" rx="3" fill="#16241B"/>',
  cpi:stat('cp',0,0,.45,-25),spi:stat('sp',0,0,.45,-25),bmi:stat('bm',0,0,.42,-25),
  ruler:'<rect x="-56" y="-12" width="112" height="24" rx="3" fill="#F3D27A" stroke="#B4902F" stroke-width="2"/>'+[0,1,2,3,4,5,6,7,8,9,10].map(k=>'<path d="M'+(-50+k*10)+' -12 v'+(k%5?7:12)+'" stroke="#6B551A" stroke-width="1.5"/>').join(''),
  sscale:'<rect x="-12" y="-48" width="24" height="76" rx="6" fill="#EAF1F6" stroke="#6C8597" stroke-width="2"/><path d="M-6 -36 h8 M-6 -26 h5 M-6 -16 h8 M-6 -6 h5 M-6 4 h8" stroke="#2A3138" stroke-width="1.5"/><path d="M-10 -10 h20" stroke="#D9473A" stroke-width="3"/><path d="M0 28 v8 q0 8 -7 8 q-7 0 -7 -7" stroke="#555" stroke-width="2.5" fill="none"/>',
  stand2:'<rect x="-40" y="36" width="80" height="10" rx="3" fill="#5D6878"/><rect x="-30" y="-48" width="8" height="86" fill="#9AA6B2"/><rect x="-30" y="-48" width="64" height="7" fill="#9AA6B2"/>',
  bundle:hangItem('cpen',0,-60).replace('translate(0 -60)','translate(0 -60) scale(.8)'),sbundle:hangItem('spen',0,-58).replace('translate(0 -58)','translate(0 -58) scale(.8)'),
  clay:'<path d="M-34 26 Q-40 -10 -10 -12 Q6 -30 26 -14 Q44 -8 38 26Z" fill="#8A5A3B" stroke="#5E3B24" stroke-width="2"/>',
  zip:hangItem('bag',0,-56).replace('translate(0 -56)','translate(0 -56) scale(.9)'),
  fmeter:fmeter(0,-4,{}).replace('translate(0 -4)','translate(0 -6) scale(.62)'),
  milk:milk(0,44,.8),
  plank2:'<rect x="-64" y="-22" width="128" height="16" rx="3" fill="#D9B784" stroke="#9C7443" stroke-width="2"/><rect x="-64" y="6" width="128" height="16" rx="3" fill="#D9B784" stroke="#9C7443" stroke-width="2"/>',
  fulcrum:'<path d="M0 -24 L-30 30 H30Z" fill="#7E93A8" stroke="#4E6175" stroke-width="2.5" stroke-linejoin="round"/>',
  blocks:[0,1,2].map(i=>'<rect x="-40" y="'+(10-i*24)+'" width="80" height="24" rx="2" fill="#C9944F" stroke="#8A6537" stroke-width="2"/>').join('')};
 return A[k]||''}
function toolsScene(list,anim){let b='';if(NAR)list.forEach(it=>LEG.push([null,it[1]]));const n=list.length,cols=n<=4?n:n<=6?3:4,rows=Math.ceil(n/cols),cw=200,ch=176,gx=18,gy=18;
 const W=cols*cw+(cols-1)*gx,H=rows*ch+(rows-1)*gy,x0=480-W/2,y0=Math.max(30,250-H/2);
 list.forEach((it,i)=>{const c=i%cols,r=Math.floor(i/cols),x=x0+c*(cw+gx),y=y0+r*(ch+gy),cx=x+cw/2;
  b+='<g'+(anim?an('lb-a-pop',.3+i*.15):'')+'><rect x="'+x+'" y="'+y+'" width="'+cw+'" height="'+ch+'" rx="16" fill="var(--w-label)" stroke="var(--w-felt-s)" stroke-width="1.5"/><g transform="translate('+cx+' '+(y+72)+')">'+itemArt(it[0])+'</g>'+(NAR?'':'<text x="'+cx+'" y="'+(y+ch-18)+'" text-anchor="middle" font-size="20" font-weight="800" fill="var(--w-labeltx)">'+it[1]+'</text>')+'</g>'});
 return b}
function boxArt(x){return '<g transform="translate('+x+' 300)"><path d="M-130 -60 L-100 -96 H150 L120 -60Z" fill="var(--w-kraft-s)"/><rect x="-130" y="-60" width="250" height="196" rx="8" fill="var(--w-kraft)" stroke="var(--w-kraft-s)" stroke-width="2"/><path d="M120 -60 L150 -96 V100 L120 136Z" fill="var(--w-kraft-s)"/>'+(NAR?'':'<rect x="-60" y="-10" width="110" height="44" rx="8" fill="var(--w-label)"/><text x="-5" y="20" text-anchor="middle" font-size="22" font-weight="800" fill="var(--w-labeltx)">준비물</text>')+'</g>'}
