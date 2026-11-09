/* ───────── 그림: 실험대 장면 — 모두 직접 그린 SVG (다양한 생물과 우리 생활) ───────── */
const BY=436;
let NAR=false,LEG=[];   /* 좁은 화면: 작은 그림 글자는 HTML(LEG)로 */
function an(cls,delay,extra){return ' class="lb-a '+cls+'" style="animation-delay:'+(delay||0)+'s'+(extra?';'+extra:'')+'"'}
function bg(o){o=o||{};let g='<rect x="-3000" y="-3000" width="7000" height="3416" fill="var(--w-wall)"/><rect x="-3000" y="330" width="7000" height="86" fill="var(--w-wall2)"/><rect x="-3000" y="326" width="7000" height="5" fill="var(--w-rail)"/>';
 g+='<rect x="-3000" y="416" width="7000" height="36" fill="var(--w-top)"/><rect x="-3000" y="452" width="7000" height="6" fill="var(--w-edge)"/><rect x="-3000" y="458" width="7000" height="3000" fill="var(--w-front)"/>';
 for(let i=0;i<5;i++)g+='<path d="M-3000 '+(478+i*20)+' H4000" stroke="var(--w-grain)" stroke-width="1.2" opacity=".35"/>';
 return g}
function defs(){return '<defs><filter id="lbB1" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.2"/></filter><filter id="lbB2" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="4.5"/></filter><filter id="lbB3" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="8"/></filter></defs>'}
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


/* 수조. x 왼쪽, top 위, w 폭, bot 바닥, wl 물 높이 */
function tankArt(x,top,w,bot,wl,o){o=o||{};let g=shadow(x+w/2,bot+6,w/2+10);
 g+='<rect x="'+x+'" y="'+wl+'" width="'+w+'" height="'+(bot-wl)+'" fill="#9FD3F0" fill-opacity=".7"/><path d="M'+x+' '+wl+' H'+(x+w)+'" stroke="#4E9CCB" stroke-width="3"/>';
 if(o.inner)g+=o.inner;
 g+='<path d="M'+x+' '+top+' V'+bot+' H'+(x+w)+' V'+top+'" fill="none" stroke="#6E9FB5" stroke-width="5" stroke-linejoin="round"/><path d="M'+(x+10)+' '+(top+14)+' V'+(bot-20)+'" stroke="#FFFFFF" stroke-width="4" opacity=".55"/>';
 return g}


/* 위에서 내려다본 책상(실험 1·4) */
function bgTop(){let g='<rect x="-3000" y="-3000" width="7000" height="7000" fill="var(--w-top)"/>';
 for(let i=0;i<14;i++)g+='<path d="M-3000 '+(-40+i*46)+' Q480 '+(-30+i*46+(i%2?10:-10))+' 4000 '+(-40+i*46)+'" stroke="var(--w-grain)" stroke-width="1.4" fill="none" opacity=".28"/>';
 return g}
const P2=pts=>'M'+pts.map(p=>p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' L')+' Z';
function rnd(i,s){const h=Math.sin(i*12.9898+(s||0)*78.233)*43758.5453;return h-Math.floor(h)}

function magnifier(x,y,s,rot){return '<g transform="translate('+x+' '+y+') rotate('+(rot||0)+') scale('+(s||1)+')"><circle r="34" fill="#E8F4FA" fill-opacity=".35" stroke="#2B3445" stroke-width="7"/><path d="M24 24 L62 62" stroke="#6B4A2B" stroke-width="13" stroke-linecap="round"/><path d="M-16 -18 a24 24 0 0 1 20 -8" stroke="#FFFFFF" stroke-width="4" fill="none" opacity=".8"/></g>'}
let CLP=0;   /* clipPath 이름(그릴 때마다 새로) */
function clipped(shape,inner){const id='lbCp'+(++CLP);return '<clipPath id="'+id+'">'+shape+'</clipPath><g clip-path="url(#'+id+')">'+inner+'</g>'}
function blurA(b){return b>0?' filter="url(#lbB'+Math.min(3,b)+')"':''}

/* ───────── 실험 1: 버섯(표고버섯)·곰팡이 빵 ───────── */
/* 옆에서 본 버섯: base = 땅에 닿는 높이 */
function mushSide(cx,base,s){s=s||1;let g='<g transform="translate('+cx+' '+base+') scale('+s+')">'+shadow(0,2,70);
 g+='<path d="M-17 0 Q-15 -40 -12 -78 L12 -78 Q15 -40 17 0 Q0 6 -17 0Z" fill="#F1E7D3" stroke="#BFAE8E" stroke-width="2.5"/>';
 g+='<path d="M-8 -12 Q-6 -40 -5 -70 M6 -14 Q5 -44 4 -70" stroke="#DCCDB0" stroke-width="1.6" fill="none"/>';
 g+='<ellipse cx="0" cy="-74" rx="90" ry="11" fill="#E8DCC3" stroke="#BFAE8E" stroke-width="2"/>';
 g+='<path d="M-95 -76 Q-92 -150 0 -152 Q92 -150 95 -76 Q0 -64 -95 -76Z" fill="#8A5A34" stroke="#5E3B1F" stroke-width="3" stroke-linejoin="round"/>';
 for(let i=0;i<16;i++){const x=-78+rnd(i,3)*156,y=-140+rnd(i,4)*56;if(Math.abs(x)>86-(y+140)*.2&&y<-120)continue;g+='<path d="M'+x.toFixed(1)+' '+y.toFixed(1)+' l'+(6+rnd(i,5)*8).toFixed(1)+' '+(rnd(i,6)*4-2).toFixed(1)+'" stroke="#E9DCC4" stroke-width="2.4" stroke-linecap="round" opacity=".85"/>'}
 return g+'</g>'}
/* 위에서 본 갓 / 뒤집은 갓(안쪽) */
function capTop(cx,cy,r){let g='<circle cx="'+cx+'" cy="'+cy+'" r="'+(r+4)+'" fill="var(--w-shadow)"/><circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="#8A5A34" stroke="#5E3B1F" stroke-width="3"/><circle cx="'+cx+'" cy="'+cy+'" r="'+(r*.55)+'" fill="#7A4D2B" opacity=".6"/>';
 for(let i=0;i<22;i++){const a=rnd(i,8)*6.28,d=r*(.2+rnd(i,9)*.7),x=cx+Math.cos(a)*d,y=cy+Math.sin(a)*d;g+='<path d="M'+x.toFixed(1)+' '+y.toFixed(1)+' l'+(Math.cos(a+1.4)*9).toFixed(1)+' '+(Math.sin(a+1.4)*9).toFixed(1)+'" stroke="#E9DCC4" stroke-width="2.6" stroke-linecap="round" opacity=".85"/>'}
 return g}
function capUnder(cx,cy,r){let g='<circle cx="'+cx+'" cy="'+cy+'" r="'+(r+4)+'" fill="var(--w-shadow)"/><circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="#EDE2CB" stroke="#8A5A34" stroke-width="5"/><g stroke="#B9A684" stroke-width="1.1">';
 for(let i=0;i<90;i++){const a=i/90*6.283,r0=r*(i%3?.36:.24);g+='<path d="M'+(cx+Math.cos(a)*r0).toFixed(1)+' '+(cy+Math.sin(a)*r0).toFixed(1)+' L'+(cx+Math.cos(a)*r*.95).toFixed(1)+' '+(cy+Math.sin(a)*r*.95).toFixed(1)+'"/>'}
 return g+'</g><circle cx="'+cx+'" cy="'+cy+'" r="'+(r*.2)+'" fill="#F4ECDC" stroke="#BFAE8E" stroke-width="2.5"/>'}
/* 곰팡이 한 자국: 맨눈으로는 솜털, 확대하면 가는 선 끝에 둥근 알갱이 */
function moldPatch(x,y,r,col,k){let g='<circle cx="'+x+'" cy="'+y+'" r="'+(r+2.5)+'" fill="#F4F6F0" opacity=".85"/><circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+col+'" opacity=".9"/>';
 let ln='',dt='';const n=Math.round(r*2.2);
 for(let i=0;i<n;i++){const a=rnd(i,k)*6.283,d=r*rnd(i,k+1)*.9,x0=x+Math.cos(a)*d,y0=y+Math.sin(a)*d,b=a+(rnd(i,k+2)-.5)*1.4,L=r*.35+rnd(i,k+3)*r*.35,x1=x0+Math.cos(b)*L,y1=y0+Math.sin(b)*L;
  ln+='M'+x0.toFixed(1)+' '+y0.toFixed(1)+' L'+x1.toFixed(1)+' '+y1.toFixed(1)+' ';dt+='<circle cx="'+x1.toFixed(1)+'" cy="'+y1.toFixed(1)+'" r="'+(.9+rnd(i,k+4)*.5).toFixed(2)+'"/>'}
 return g+'<path d="'+ln+'" stroke="#F7F8F4" stroke-width=".7" fill="none"/><g fill="#33403A">'+dt+'</g>'}
const MP=[[-46,-34,15,'#8FA88C'],[30,-8,19,'#7F9AA6'],[-20,40,11,'#9DB39A'],[50,46,8,'#8FA88C'],[-58,24,6,'#7F9AA6']];
function breadMold(cx,cy,s){s=s||1;let g='<g transform="translate('+cx+' '+cy+') scale('+s+')"><rect x="-100" y="-92" width="200" height="184" rx="34" fill="#C99A5B" stroke="#8E6431" stroke-width="3"/><rect x="-86" y="-78" width="172" height="158" rx="26" fill="#F2DDB0"/>';
 for(let i=0;i<30;i++)g+='<circle cx="'+(-76+rnd(i,11)*152).toFixed(1)+'" cy="'+(-68+rnd(i,12)*138).toFixed(1)+'" r="'+(1.2+rnd(i,13)*1.6).toFixed(1)+'" fill="#E2C48C"/>';
 MP.forEach((p,i)=>{g+=moldPatch(p[0],p[1],p[2],p[3],20+i*7)});return g+'</g>'}
/* 위에서 본 페트리 접시(뚜껑 닫힘) */
function dishTop(cx,cy,r,inner,o){o=o||{};return '<circle cx="'+(cx+6)+'" cy="'+(cy+8)+'" r="'+(r+6)+'" fill="var(--w-shadow)"/><circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="'+(o.water?'#D8EEF8':'#F6F8FA')+'" stroke="#9FB6C4" stroke-width="3"/>'+(inner||'')+
 (o.open?'':'<circle cx="'+cx+'" cy="'+cy+'" r="'+(r+6)+'" fill="#EAF4FB" fill-opacity=".22" stroke="#7F9BAB" stroke-width="3.5"/>')+'<path d="M'+(cx-r*.7)+' '+(cy-r*.55)+' a'+r+' '+r+' 0 0 1 '+(r*.5)+' -'+(r*.28)+'" stroke="#FFFFFF" stroke-width="5" fill="none" opacity=".75" stroke-linecap="round"/>'}
const MD={cx:400,cy:262,r:170};
function moldDish(o){return dishTop(MD.cx,MD.cy,MD.r,breadMold(MD.cx,MD.cy,1.2),o)}

/* ───────── 실험 2: 실체 현미경(옆에서 본 모습) ───────── */
const SC={cx:400,stage:368,low:118};   /* low: 옆에서 보며 내린 거리 */
function scHeadY(st){if(!st||!st.down)return 0;return SC.low-12*(st.f||0)}
function scopeArt(st,o){st=st||{};o=o||{};const c=SC.cx,dy=scHeadY(st);let g=shadow(c+10,422,130);
 g+='<rect x="'+(c-110)+'" y="392" width="230" height="28" rx="9" fill="#3D4A5C"/><rect x="'+(c-110)+'" y="392" width="230" height="6" rx="3" fill="#56657A"/>';
 g+='<circle cx="'+(c+82)+'" cy="406" r="8" fill="'+(st.light?'#FFD54A':'#C9B26A')+'" stroke="#8A6A1E" stroke-width="2"/>';
 g+='<rect x="'+(c+88)+'" y="120" width="26" height="274" rx="4" fill="#5B6B80"/>';
 g+='<rect x="'+(c-80)+'" y="'+(SC.stage)+'" width="160" height="14" rx="3" fill="#DDE5EE" stroke="#8A9AAE" stroke-width="2"/><rect x="'+(c-40)+'" y="382" width="80" height="10" fill="#4A576A"/>';
 if(st.light)g+='<ellipse cx="'+c+'" cy="'+(SC.stage-2)+'" rx="44" ry="10" fill="#FFF3B8" opacity=".9"/><path d="M'+(c-30)+' '+(SC.stage-4)+' L'+(c-12)+' '+(SC.stage-48)+' M'+c+' '+(SC.stage-4)+' V'+(SC.stage-54)+' M'+(c+30)+' '+(SC.stage-4)+' L'+(c+12)+' '+(SC.stage-48)+'" stroke="#FFE27A" stroke-width="3" stroke-linecap="round" opacity=".8"/>';
 if(o.sample)g+=o.sample;
 /* 초점 조절 나사(기둥 옆) */
 g+='<circle cx="'+(c+101)+'" cy="250" r="17" fill="#2E3A48"/><circle cx="'+(c+101)+'" cy="250" r="6" fill="#8392A6"/>';
 /* 움직이는 머리: 접안렌즈·몸통·회전판·대물렌즈 */
 let h='<rect x="'+(c+64)+'" y="150" width="30" height="34" rx="4" fill="#4E5D72"/>';
 h+='<g fill="#5B6B80"><rect x="'+(c-36)+'" y="70" width="22" height="80" rx="4" transform="rotate(-9 '+(c-25)+' 150)"/><rect x="'+(c+14)+'" y="70" width="22" height="80" rx="4" transform="rotate(9 '+(c+25)+' 150)"/></g>';
 h+='<g fill="#2E3A48"><rect x="'+(c-40)+'" y="60" width="30" height="20" rx="5" transform="rotate(-9 '+(c-25)+' 150)"/><rect x="'+(c+10)+'" y="60" width="30" height="20" rx="5" transform="rotate(9 '+(c+25)+' 150)"/></g>';
 h+='<rect x="'+(c-70)+'" y="140" width="164" height="48" rx="10" fill="#5B6B80"/><rect x="'+(c-70)+'" y="140" width="164" height="10" rx="5" fill="#6E7E93"/>';
 h+='<ellipse cx="'+c+'" cy="196" rx="44" ry="10" fill="#8392A6" stroke="#6A788B" stroke-width="2"/><path d="M'+(c-30)+' 190 v12 M'+(c-15)+' 188 v15 M'+c+' 187 v16 M'+(c+15)+' 188 v15 M'+(c+30)+' 190 v12" stroke="#6A788B" stroke-width="1.6"/>';
 h+='<rect x="'+(c-15)+'" y="204" width="30" height="34" rx="4" fill="#2E3A48"/><rect x="'+(c-11)+'" y="234" width="22" height="6" rx="2" fill="#8FB3C6"/>';
 g+='<g'+(o.headAnim||'')+'><g transform="translate(0 '+dy+')">'+h+'</g></g>';
 if(o.mark)g+='<g transform="translate(0 '+(['eye','turn','obj'].indexOf(o.mark)>=0?dy:0)+')" fill="none" stroke="#E0506B" stroke-width="4" stroke-dasharray="9 6">'+SCMARK[o.mark]+'</g>';
 return g}
const SCMARK={eye:'<ellipse cx="400" cy="100" rx="52" ry="50"/>',turn:'<ellipse cx="400" cy="196" rx="58" ry="18"/>',obj:'<rect x="374" y="198" width="52" height="50" rx="10"/>',
 focus:'<circle cx="501" cy="250" r="29"/>',light:'<circle cx="482" cy="406" r="20"/>',stage:'<ellipse cx="400" cy="375" rx="98" ry="22"/>'};
/* 재물대 위 관찰 대상 */
function slideSide(c,y){return '<rect x="'+(c-66)+'" y="'+(y-8)+'" width="132" height="8" rx="1.5" fill="#BFE3F2" fill-opacity=".85" stroke="#7FA9BE" stroke-width="1.6"/><rect x="'+(c-22)+'" y="'+(y-11)+'" width="44" height="4" fill="#F5F0DC" stroke="#C9BF9A" stroke-width="1"/>'}
function dishSide(c,y){return '<path d="M'+(c-62)+' '+(y-18)+' V'+(y-2)+' Q'+(c-62)+' '+y+' '+(c-58)+' '+y+' H'+(c+58)+' Q'+(c+62)+' '+y+' '+(c+62)+' '+(y-2)+' V'+(y-18)+'" fill="#F6F8FA" fill-opacity=".7" stroke="#7F9BAB" stroke-width="2"/><rect x="'+(c-50)+'" y="'+(y-12)+'" width="100" height="9" rx="3" fill="#E9CF9A"/><path d="M'+(c-40)+' '+(y-12)+' q8 -8 16 0 M'+(c+4)+' '+(y-12)+' q10 -9 20 0" fill="#9DB39A" stroke="#7F9A88"/><rect x="'+(c-66)+'" y="'+(y-22)+'" width="132" height="5" rx="2" fill="#EAF4FB" fill-opacity=".5" stroke="#7F9BAB" stroke-width="1.6"/>'}
/* 눈(어디에서 보는지) */
function eyeArt(x,y,s){s=s||1;return '<g transform="translate('+x+' '+y+') scale('+s+')"><path d="M-30 0 Q0 -24 30 0 Q0 24 -30 0Z" fill="#FFFFFF" stroke="#3D4A5C" stroke-width="3"/><circle r="9" fill="#5C8FCB"/><circle r="4" fill="#1E2630"/></g>'}
/* 실체 현미경으로 본 모습(둥근 시야). kind m 버섯 표본 · c 곰팡이 */
function scopeField(kind){let g='';
 const thread=(i,k,w,col)=>{const a=rnd(i,k)*6.283,b=a+2+rnd(i,k+1)*2.3,R=104;const x0=Math.cos(a)*R,y0=Math.sin(a)*R,x1=Math.cos(b)*R,y1=Math.sin(b)*R;
  const cx1=(rnd(i,k+2)-.5)*150,cy1=(rnd(i,k+3)-.5)*150,cx2=(rnd(i,k+4)-.5)*150,cy2=(rnd(i,k+5)-.5)*150;
  return '<path d="M'+x0.toFixed(1)+' '+y0.toFixed(1)+' C'+cx1.toFixed(1)+' '+cy1.toFixed(1)+' '+cx2.toFixed(1)+' '+cy2.toFixed(1)+' '+x1.toFixed(1)+' '+y1.toFixed(1)+'" stroke="'+col+'" stroke-width="'+w+'" fill="none" stroke-linecap="round"/>'};
 if(kind==='m'){g+='<rect x="-110" y="-110" width="220" height="220" fill="#EFE7D8"/>';for(let i=0;i<34;i++)g+=thread(i,40,i%3?1.8:2.6,i%2?'#9A7752':'#B79066')}
 else{g+='<rect x="-110" y="-110" width="220" height="220" fill="#ECEFE8"/>';for(let i=0;i<18;i++)g+=thread(i,70,1.8,'#9AA59A');
  const H=[[-60,-30],[-20,-62],[30,-40],[66,-6],[-44,30],[10,20],[52,48],[-12,72],[-78,64]];
  H.forEach((p,i)=>{const L=26+rnd(i,90)*20,x=p[0],y=p[1];g+='<path d="M'+(x-6).toFixed(1)+' '+(y+L).toFixed(1)+' Q'+(x-2)+' '+(y+L/2).toFixed(1)+' '+x+' '+(y+9)+'" stroke="#8C988C" stroke-width="2.2" fill="none"/><circle cx="'+x+'" cy="'+y+'" r="'+(8+rnd(i,91)*3).toFixed(1)+'" fill="#3E4640" stroke="#2A302C" stroke-width="1.2"/><circle cx="'+(x-3)+'" cy="'+(y-3)+'" r="2" fill="#6E7A70"/>'})}
 return g}
/* 접안렌즈 시야 그림: blur 0 또렷 ~ 3 아주 흐림, lit false면 어두움 */
function fieldView(cx,cy,R,kind,blur,lit){let g='<circle cx="'+cx+'" cy="'+cy+'" r="'+(R+12)+'" fill="#2E3A48"/>';
 const inner=lit?'<g transform="translate('+cx+' '+cy+') scale('+(R/104).toFixed(3)+')"><g'+blurA(blur)+'>'+scopeField(kind)+'</g></g>':'<rect x="'+(cx-R)+'" y="'+(cy-R)+'" width="'+2*R+'" height="'+2*R+'" fill="#1A2029"/>';
 g+=clipped('<circle cx="'+cx+'" cy="'+cy+'" r="'+R+'"/>',inner);
 return g+'<circle cx="'+cx+'" cy="'+cy+'" r="'+R+'" fill="none" stroke="#141A22" stroke-width="5"/>'}

/* 셀로판테이프 표본 만들기(위에서 본 책상) */
const SLD={x:540,y:300,w:300,h:96};
function slideTop(o){o=o||{};const S=SLD;let g='<rect x="'+(S.x+5)+'" y="'+(S.y+7)+'" width="'+S.w+'" height="'+S.h+'" rx="4" fill="var(--w-shadow)"/><rect x="'+S.x+'" y="'+S.y+'" width="'+S.w+'" height="'+S.h+'" rx="4" fill="#D7EEF8" fill-opacity=".85" stroke="#7FA9BE" stroke-width="2.5"/><path d="M'+(S.x+14)+' '+(S.y+14)+' h80" stroke="#FFFFFF" stroke-width="4" opacity=".8" stroke-linecap="round"/>';
 if(o.tape)g+='<g'+(o.anim||'')+'>'+tapeStrip(S.x+S.w/2,S.y+S.h/2,1)+'</g>';return g}
function tapeStrip(cx,cy,dirty){let g='<rect x="'+(cx-70)+'" y="'+(cy-22)+'" width="140" height="44" rx="2" fill="#FBF7E6" fill-opacity=".8" stroke="#CFC59E" stroke-width="2"/>';
 if(dirty)for(let i=0;i<14;i++)g+='<path d="M'+(cx-58+rnd(i,60)*116).toFixed(1)+' '+(cy-14+rnd(i,61)*28).toFixed(1)+' l'+(4+rnd(i,62)*6).toFixed(1)+' '+(rnd(i,63)*4-2).toFixed(1)+'" stroke="#B79066" stroke-width="1.6" opacity=".8" stroke-linecap="round"/>';
 return g}
function tapeRoll(x,y,s){return '<g transform="translate('+x+' '+y+') scale('+(s||1)+')"><circle r="30" fill="#F3EFE3" stroke="#BDB49C" stroke-width="3"/><circle r="15" fill="var(--w-top)" stroke="#BDB49C" stroke-width="3"/><path d="M28 8 L64 14 L64 30 L24 20Z" fill="#FBF7E6" fill-opacity=".85" stroke="#CFC59E" stroke-width="1.6"/></g>'}

/* ───────── 실험 3: 해캄·짚신벌레 ───────── */
function algaThreads(cx,cy,r,n,k){let g='';for(let i=0;i<n;i++){const a=rnd(i,k)*3.1416,o=(rnd(i,k+1)-.5)*r*1.1,ca=Math.cos(a),sa=Math.sin(a),L=r*(.6+rnd(i,k+2)*.35);
  const x0=cx+o*-sa-ca*L,y0=cy+o*ca-sa*L,x1=cx+o*-sa+ca*L,y1=cy+o*ca+sa*L,mx=(x0+x1)/2+(rnd(i,k+3)-.5)*40,my=(y0+y1)/2+(rnd(i,k+4)-.5)*40;
  g+='<path d="M'+x0.toFixed(1)+' '+y0.toFixed(1)+' Q'+mx.toFixed(1)+' '+my.toFixed(1)+' '+x1.toFixed(1)+' '+y1.toFixed(1)+'" stroke="'+(i%3?'#4E9A3A':'#6DB04A')+'" stroke-width="'+(i%4?1.6:2.4)+'" fill="none" stroke-linecap="round"/>'}return g}
const AD={cx:380,cy:262,r:160};
function algaDish(o){const inner='<g>'+algaThreads(AD.cx-20,AD.cy-10,90,46,30)+algaThreads(AD.cx+30,AD.cy+24,70,30,50)+'</g>';return dishTop(AD.cx,AD.cy,AD.r,inner,Object.assign({water:1,open:1},o||{}))}
/* 디지털 현미경 + 거치대(옆에서 본 모습). o.on 끼움, o.sample 'alga'|'para' */
const DS={x:320,base:416};
function dscopeBody(x,y,s,rot){return '<g transform="translate('+x+' '+y+') rotate('+(rot||0)+') scale('+(s||1)+')"><rect x="-18" y="-96" width="36" height="170" rx="16" fill="#E9EEF3" stroke="#8796A6" stroke-width="3"/><rect x="-19" y="-10" width="38" height="16" fill="#5B6B80"/><path d="M-19 -6 h38 M-19 -2 h38 M-19 2 h38" stroke="#8392A6" stroke-width="1.2"/><rect x="-12" y="66" width="24" height="12" rx="3" fill="#2E3A48"/><circle cx="0" cy="72" r="4" fill="#BFE3F2"/><rect x="-6" y="-104" width="12" height="10" rx="3" fill="#8796A6"/></g>'}
function standArt(){const x=DS.x;return shadow(x+40,DS.base+4,120)+'<rect x="'+(x-90)+'" y="'+(DS.base-14)+'" width="220" height="14" rx="5" fill="#C9D3DC" stroke="#8796A6" stroke-width="2"/><rect x="'+(x+88)+'" y="150" width="14" height="'+(DS.base-164)+'" fill="#9AA6B2" stroke="#6E7E8E" stroke-width="2"/><rect x="'+(x+20)+'" y="200" width="82" height="16" rx="4" fill="#9AA6B2" stroke="#6E7E8E" stroke-width="2"/>'}
function dsSample(kind){const x=DS.x,y=DS.base-14;if(kind==='alga')return '<ellipse cx="'+x+'" cy="'+(y-5)+'" rx="62" ry="8" fill="#D8EEF8" stroke="#7F9BAB" stroke-width="2"/><path d="M'+(x-40)+' '+(y-7)+' q20 -5 40 0 t40 0" stroke="#4E9A3A" stroke-width="2.5" fill="none"/>';
 if(kind==='para')return slideSide(x,y).replace(/#F5F0DC/g,'#E9B7CF').replace(/#C9BF9A/g,'#A5487A');return ''}
function dscopeArt(o){o=o||{};let g=standArt();if(o.sample)g+=dsSample(o.sample);
 if(o.on)g+='<g'+(o.anim||'')+'>'+dscopeBody(DS.x,250,1,0)+'<rect x="'+(DS.x+14)+'" y="202" width="10" height="12" fill="#9AA6B2"/></g>';
 else g+=dscopeBody(DS.x-180,DS.base-22,.9,90);
 return g}
/* 스마트 기기 */
const TB={x:600,y:120,w:300,h:220};
function tabletArt(o){o=o||{};const T=TB;let g=shadow(T.x+T.w/2,DS.base+2,130)+'<path d="M'+(T.x+T.w/2-50)+' '+(T.y+T.h)+' L'+(T.x+T.w/2-70)+' '+(DS.base-2)+' H'+(T.x+T.w/2+70)+' L'+(T.x+T.w/2+50)+' '+(T.y+T.h)+'Z" fill="#9AA6B2"/>';
 g+='<rect x="'+T.x+'" y="'+T.y+'" width="'+T.w+'" height="'+T.h+'" rx="18" fill="#2E3A48"/>';
 const sx=T.x+14,sy=T.y+14,sw=T.w-28,sh=T.h-28;
 if(!o.app)g+='<rect x="'+sx+'" y="'+sy+'" width="'+sw+'" height="'+sh+'" rx="6" fill="#0F1720"/>';
 else{g+='<rect x="'+sx+'" y="'+sy+'" width="'+sw+'" height="'+sh+'" rx="6" fill="#F4F6F8"'+(o.appAnim||'')+'/><rect x="'+sx+'" y="'+sy+'" width="'+sw+'" height="22" rx="6" fill="#2F68B0"/><circle cx="'+(sx+sw-16)+'" cy="'+(sy+11)+'" r="6" fill="#FFFFFF" opacity=".8"/>';
  const vx=sx+8,vy=sy+28,vw=sw-16,vh=sh-36;
  const inner=o.view?'<g transform="translate('+(vx+vw/2)+' '+(vy+vh/2)+')"><g'+blurA(o.blur||0)+'>'+o.view+'</g></g>':'<rect x="'+vx+'" y="'+vy+'" width="'+vw+'" height="'+vh+'" fill="#C9CFD5"/><path d="M'+(vx+vw/2)+' '+(vy+20)+' V'+(vy+vh-20)+' M'+(vx+40)+' '+(vy+vh/2)+' H'+(vx+vw-40)+'" stroke="#9AA6B2" stroke-width="2"/>';
  g+=clipped('<rect x="'+vx+'" y="'+vy+'" width="'+vw+'" height="'+vh+'"/>',inner)+'<rect x="'+vx+'" y="'+vy+'" width="'+vw+'" height="'+vh+'" fill="none" stroke="#9AA6B2" stroke-width="1.5"/>';
  if(o.zoom)g+=mini(vx+42,vy+22,o.zoom+'배',17)}
 return g}
function cable(){return '<path d="M'+DS.x+' 150 C'+DS.x+' 70 '+(TB.x-40)+' 60 '+(TB.x+30)+' '+(TB.y+TB.h-4)+'" stroke="#3D4A5C" stroke-width="5" fill="none" stroke-linecap="round"/>'}
/* 화면 속 모습: 해캄(배율 단계 1~3) — 가로 272 · 세로 156 칸, 가운데가 (0,0) */
function algaView(lv){let g='<rect x="-150" y="-90" width="300" height="180" fill="#EEF5EA"/>';
 if(lv===1){for(let i=0;i<16;i++){const y=-80+rnd(i,100)*160,a=(rnd(i,101)-.5)*1.2;g+='<path d="M-150 '+(y-a*150).toFixed(1)+' Q0 '+(y+(rnd(i,102)-.5)*40).toFixed(1)+' 150 '+(y+a*150).toFixed(1)+'" stroke="'+(i%2?'#4E9A3A':'#6DB04A')+'" stroke-width="2.4" fill="none"/>'}return g}
 if(lv===2){[[-60,-.25],[-10,.15],[40,-.1],[78,.3]].forEach((t,i)=>{const y=t[0],a=t[1];g+='<g transform="rotate('+(a*40)+' 0 '+y+')"><rect x="-170" y="'+(y-8)+'" width="340" height="16" fill="#B9DE99" stroke="#4E8A3A" stroke-width="1.6"/>';for(let x=-160;x<170;x+=28)g+='<path d="M'+x+' '+(y-8)+' v16" stroke="#4E8A3A" stroke-width="1.2"/>';for(let x=-156;x<170;x+=9)g+='<circle cx="'+x+'" cy="'+(y+Math.sin(x/6)*4).toFixed(1)+'" r="1.6" fill="#2F6A22"/>';g+='</g>'});return g}
 [[-38],[40]].forEach((t,j)=>{const y=t[0],h=56;g+='<rect x="-170" y="'+(y-h/2)+'" width="340" height="'+h+'" fill="#D3EDB8" stroke="#4E8A3A" stroke-width="2.4"/>';
  for(let x=-150+j*30;x<170;x+=84)g+='<path d="M'+x+' '+(y-h/2)+' v'+h+'" stroke="#3F7A27" stroke-width="2.6"/>';
  let d='';for(let x=-170;x<=170;x+=4){const yy=y+Math.sin((x+j*20)/9)*(h/2-8);d+=(x===-170?'M':'L')+x+' '+yy.toFixed(1)+' '}
  g+='<path d="'+d+'" stroke="#5FA14A" stroke-width="6" fill="none" opacity=".85"/>';
  for(let x=-166;x<170;x+=7){const yy=y+Math.sin((x+j*20)/9)*(h/2-8);g+='<circle cx="'+x+'" cy="'+yy.toFixed(1)+'" r="2.6" fill="#2F6A22"/>'}});
 return g}
function slipper(cx,cy,L,rot,o){o=o||{};const W=L*.36;let g='<g transform="translate('+cx+' '+cy+') rotate('+rot+')">';
 const body='M'+(-L/2)+' 0 C'+(-L/2)+' '+(-W*.7)+' '+(-L*.12)+' '+(-W*.62)+' 0 '+(-W*.5)+' C'+(L*.18)+' '+(-W*.42)+' '+(L/2)+' '+(-W*.64)+' '+(L/2)+' 0 C'+(L/2)+' '+(W*.62)+' '+(L*.16)+' '+(W*.5)+' 0 '+(W*.36)+' C'+(-L*.16)+' '+(W*.3)+' '+(-L/2)+' '+(W*.7)+' '+(-L/2)+' 0Z';
 if(o.cilia){let c='';const n=o.cilia;for(let i=0;i<n;i++){const a=i/n*6.283,x=Math.cos(a)*L/2*.98,y=Math.sin(a)*W*.58;c+='M'+x.toFixed(1)+' '+y.toFixed(1)+' l'+(Math.cos(a)*L*.05).toFixed(1)+' '+(Math.sin(a)*L*.05).toFixed(1)+' '}g+='<path d="'+c+'" stroke="#A5487A" stroke-width="'+(L>150?1.3:1)+'" fill="none"/>'}
 g+='<path d="'+body+'" fill="#E9B7CF" stroke="#A5487A" stroke-width="'+(L>150?2.6:1.6)+'"/>';
 if(o.inside){g+='<ellipse cx="'+(L*.02)+'" cy="'+(W*.02)+'" rx="'+(L*.12)+'" ry="'+(W*.2)+'" fill="#F6DCE8" stroke="#B7608C" stroke-width="1.6"/><path d="M'+(-L*.05)+' '+(W*.3)+' Q'+(L*.05)+' '+(W*.08)+' '+(L*.14)+' '+(W*.16)+'" stroke="#B7608C" stroke-width="2" fill="none"/>';
  [[-.3,-.08,.05],[-.2,.12,.04],[.24,-.1,.045],[.3,.1,.035],[-.08,-.22,.035],[.12,.22,.03],[-.38,.02,.03]].forEach(p=>{g+='<circle cx="'+(L*p[0]).toFixed(1)+'" cy="'+(W*p[1]).toFixed(1)+'" r="'+(L*p[2]).toFixed(1)+'" fill="#C7739C" opacity=".85"/>'});
  [[-.36,-.1],[.36,.04]].forEach(p=>{const x=L*p[0],y=W*p[1];let s='';for(let i=0;i<6;i++){const a=i/6*6.283;s+='M'+x.toFixed(1)+' '+y.toFixed(1)+' l'+(Math.cos(a)*L*.035).toFixed(1)+' '+(Math.sin(a)*L*.035).toFixed(1)+' '}g+='<path d="'+s+'" stroke="#9E3E70" stroke-width="1.5"/><circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="'+(L*.016).toFixed(1)+'" fill="#F6DCE8" stroke="#9E3E70"/>'})}
 return g+'</g>'}
function paraView(lv){let g='<rect x="-150" y="-90" width="300" height="180" fill="#F7F1F4"/>';
 if(lv===1){for(let i=0;i<8;i++)g+=slipper(-120+rnd(i,120)*240,-66+rnd(i,121)*132,20,rnd(i,122)*180,{});return g}
 if(lv===2){g+=slipper(-60,-30,80,-15,{cilia:40})+slipper(56,26,72,20,{cilia:36})+slipper(-80,52,40,60,{});return g}
 return g+slipper(0,4,250,-8,{cilia:90,inside:1})}

/* 위에서 본 영구 표본 */
function paraSlideTop(cx,cy,s){return '<g transform="translate('+cx+' '+cy+') scale('+(s||1)+')"><rect x="-120" y="-40" width="240" height="80" rx="4" fill="#D7EEF8" fill-opacity=".85" stroke="#7FA9BE" stroke-width="2.5"/><rect x="-116" y="-36" width="64" height="72" rx="2" fill="#F5E6A8" stroke="#C9B46A" stroke-width="1.5"/><path d="M-106 -20 h44 M-106 -8 h36 M-106 4 h40" stroke="#B49A4A" stroke-width="3" stroke-linecap="round"/><circle cx="34" cy="0" r="22" fill="#F3DAE6" stroke="#C7739C" stroke-width="1.5" stroke-dasharray="3 3"/><circle cx="34" cy="0" r="3" fill="#C7739C"/></g>'}

/* ───────── 실험복·장갑·마스크·보안경 ───────── */
function coat(x,y,s){return '<g transform="translate('+x+' '+y+') scale('+(s||1)+')"><path d="M-46 -64 L-18 -72 L0 -40 L18 -72 L46 -64 L62 30 L40 34 L36 -10 L34 72 H-34 L-36 -10 L-40 34 L-62 30Z" fill="#FFFFFF" stroke="#9AA6B2" stroke-width="3" stroke-linejoin="round"/><path d="M0 -40 V72" stroke="#9AA6B2" stroke-width="2"/><circle cx="-7" cy="-6" r="3" fill="#9AA6B2"/><circle cx="-7" cy="22" r="3" fill="#9AA6B2"/><rect x="12" y="10" width="16" height="12" rx="2" fill="none" stroke="#9AA6B2" stroke-width="2"/></g>'}
function maskIcon(x,y,s){return '<g transform="translate('+x+' '+y+') scale('+(s||1)+')"><rect x="-46" y="-40" width="92" height="30" rx="14" fill="#CFE6F3" fill-opacity=".8" stroke="#3D6A9C" stroke-width="3.5"/><path d="M0 -40 V-10" stroke="#3D6A9C" stroke-width="3"/><path d="M-36 6 Q0 -4 36 6 V28 Q0 44 -36 28Z" fill="#DCEBF5" stroke="#7FA9BE" stroke-width="2.5"/><path d="M-36 12 L-50 4 M36 12 L50 4" stroke="#7FA9BE" stroke-width="2"/><path d="M-26 16 H26 M-26 24 H26" stroke="#A8C6D6" stroke-width="1.5"/></g>'}
function gearArt(on,anim,full){if(!on)return coat(full?300:360,250,1.5)+itemArtAt('glove',full?520:620,280)+(full?maskIcon(700,270,1.3):'')+qmark(480,110);
 let face='<circle cx="480" cy="116" r="38" fill="#F2C6A0" stroke="#B9875F" stroke-width="3"/>';
 if(full)face+='<rect x="452" y="94" width="56" height="22" rx="10" fill="#CFE6F3" fill-opacity=".85" stroke="#3D6A9C" stroke-width="3"/><path d="M442 104 h10 M508 104 h10" stroke="#3D6A9C" stroke-width="3"/><path d="M456 124 Q480 118 504 124 V140 Q480 152 456 140Z" fill="#DCEBF5" stroke="#7FA9BE" stroke-width="2.5"/>';
 return '<g'+(anim?an('lb-a-up',0,'--from:100px'):'')+'>'+face+coat(480,262,1.75)+hand(330,240,-70,1.4,1)+hand(630,240,-110,1.4,1)+'</g>'}

/* ───────── 준비물 카드 ───────── */
function itemArt(k){const A={
  mush:mushSide(0,52,.5),
  dish:'<g transform="scale(.3)">'+dishTop(0,0,170,breadMold(0,0,1.2))+'</g>',
  lens:magnifier(-10,-8,.95,0),
  mask:maskIcon(0,4,.95),
  coat:coat(0,-2,.62),glove:hand(-14,-10,-60,.75,1)+hand(22,8,-60,.75,1),
  scope:'<g transform="translate(-120 -72) scale(.3)">'+scopeArt({})+'</g>',
  tape:tapeRoll(-16,0,1),
  slide:'<rect x="-60" y="-20" width="120" height="40" rx="2" fill="#D7EEF8" fill-opacity=".85" stroke="#7FA9BE" stroke-width="2.5"/><path d="M-50 -10 h34" stroke="#FFFFFF" stroke-width="3" opacity=".8"/>',
  alga:'<g transform="scale(.3)">'+dishTop(0,0,160,algaThreads(-10,-6,90,46,30)+algaThreads(20,16,70,30,50),{water:1,open:1})+'</g>',
  para:paraSlideTop(0,0,.5),
  dscope:dscopeBody(0,0,.6,90),
  stand:'<g transform="translate(-143 -118) scale(.42)">'+standArt().replace(/<ellipse[^>]*\/>/,'')+'</g>',
  tablet:'<rect x="-50" y="-36" width="100" height="72" rx="8" fill="#2E3A48"/><rect x="-44" y="-30" width="88" height="60" rx="3" fill="#0F1720"/>'};
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
