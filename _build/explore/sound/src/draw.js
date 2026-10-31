/* 칼림바 건반 소리 높이: 0 = 가장 긴 건반(낮은 소리) … 6 = 가장 짧은 건반 */
const KF=[261,294,330,392,440,523,587];
/* ───────── 그림: 실험대 장면 — 모두 직접 그린 SVG ───────── */
const BY=436;
let NAR=false,LEG=[];   /* 좁은 화면: 작은 그림 글자는 HTML(LEG)로 */
function an(cls,delay,extra){return ' class="lb-a '+cls+'" style="animation-delay:'+(delay||0)+'s'+(extra?';'+extra:'')+'"'}
function bg(o){o=o||{};let g='<rect x="-3000" y="-3000" width="7000" height="3416" fill="var(--w-wall)"/><rect x="-3000" y="330" width="7000" height="86" fill="var(--w-wall2)"/><rect x="-3000" y="326" width="7000" height="5" fill="var(--w-rail)"/>'+
 '<rect x="-3000" y="416" width="7000" height="36" fill="var(--w-top)"/><rect x="-3000" y="452" width="7000" height="6" fill="var(--w-edge)"/><rect x="-3000" y="458" width="7000" height="3000" fill="var(--w-front)"/>';
 for(let i=0;i<5;i++)g+='<path d="M-3000 '+(478+i*20)+' H4000" stroke="var(--w-grain)" stroke-width="1.2" opacity=".35"/>';
 if(o.win){const x=o.wx==null?40:o.wx;
  g+='<rect x="'+x+'" y="48" width="226" height="246" rx="10" fill="var(--w-win)"/><rect x="'+(x+13)+'" y="61" width="200" height="220" rx="4" fill="url(#lbSky)"/>'+
  '<path d="M'+(x+113)+' 61v220M'+(x+13)+' 171h200" stroke="var(--w-win)" stroke-width="9"/>'+
  '<path d="M'+(x+34)+' 128c9-13 28-13 35-2 11-5 24 2 22 13H'+(x+30)+'c-6 0-5-9 4-11z" fill="#fff" opacity=".75"/><rect x="'+(x-8)+'" y="290" width="242" height="13" rx="5" fill="var(--w-win)"/>'}
 return g}
function defs(){return '<defs><linearGradient id="lbSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--w-sky1)"/><stop offset="1" stop-color="var(--w-sky2)"/></linearGradient><linearGradient id="lbWat" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--w-water)" stop-opacity=".75"/><stop offset="1" stop-color="var(--w-water-s)" stop-opacity=".85"/></linearGradient></defs>'}
function svg(inner,label,vb){return '<svg viewBox="'+(vb||'0 0 960 540')+'" preserveAspectRatio="xMidYMid meet" role="img" aria-label="'+label+'">'+defs()+inner+'</svg>'}
/* 이름표(그림 아래). 좁은 화면에서는 HTML 칩으로 */
function plate(cx,txt,y,col){if(NAR){LEG.push([null,txt]);return ''}y=y||470;const w=Math.max(120,txt.length*22+44);
 return '<g><rect x="'+(cx-w/2)+'" y="'+y+'" width="'+w+'" height="46" rx="12" fill="var(--w-label)" stroke="'+(col||'var(--lb-sci)')+'" stroke-width="2.5"/><text x="'+cx+'" y="'+(y+30)+'" text-anchor="middle" font-size="23" font-weight="700" fill="var(--w-labeltx)">'+txt+'</text></g>'}
function bubble(x,y,t,col){if(NAR){LEG.push([null,t]);return ''}const w=t.length*19+34;return '<g><rect x="'+(x-w/2)+'" y="'+(y-23)+'" width="'+w+'" height="42" rx="21" fill="var(--w-label)" stroke="'+(col||'var(--w-felt-s)')+'" stroke-width="2"/><text x="'+x+'" y="'+(y+6)+'" text-anchor="middle" font-size="20" font-weight="700" fill="var(--w-labeltx)">'+t+'</text></g>'}
function qmark(x,y,col){return '<g'+an('lb-a-pop',.2)+'><circle cx="'+x+'" cy="'+y+'" r="28" fill="var(--w-label)" stroke="'+(col||'var(--lb-sci)')+'" stroke-width="3" stroke-dasharray="6 5"/><text x="'+x+'" y="'+(y+12)+'" text-anchor="middle" font-size="34" font-weight="800" fill="'+(col||'var(--lb-sci-ink)')+'">?</text></g>'}
/* 떨림 선: 물체 둘레에 짧은 호 */
function buzz(x,y,r,n,cls,ang){let g='<g'+(cls||'')+'>';const a0=ang==null?-90:ang;for(let k=1;k<=(n||3);k++){const R=r+k*12;g+='<path d="M'+(x+R*Math.cos((a0-28)*Math.PI/180)).toFixed(1)+' '+(y+R*Math.sin((a0-28)*Math.PI/180)).toFixed(1)+' A'+R+' '+R+' 0 0 1 '+(x+R*Math.cos((a0+28)*Math.PI/180)).toFixed(1)+' '+(y+R*Math.sin((a0+28)*Math.PI/180)).toFixed(1)+'" stroke="var(--lb-sci)" stroke-width="4" fill="none" stroke-linecap="round" opacity="'+(1.1-k*.25)+'"/>'}return g+'</g>'}
function buzz2(x,y,r,n,cls){return buzz(x,y,r,n,cls,180)+buzz(x,y,r,n,cls,0)}
function hand(x,y,rot,s){return '<g transform="translate('+x+' '+y+') rotate('+(rot||0)+') scale('+(s||1)+')"><path d="M-30 -14 Q-8 -24 18 -18 L40 -16 Q48 -15 47 -9 Q46 -4 38 -4 L22 -4 Q30 2 26 9 Q22 15 10 13 L-30 14Z" fill="#F2C6A0" stroke="#B9875F" stroke-width="2.2" stroke-linejoin="round"/><path d="M-30 -14 L-62 -14 L-62 14 L-30 14Z" fill="#5C8FCB" stroke="#3D6A9C" stroke-width="2"/></g>'}

/* 실험 1: 사람(옆모습) */
function person(cx,o){o=o||{};let g='<g>';
 g+='<path d="M'+(cx-120)+' 470 Q'+(cx-118)+' 360 '+(cx-40)+' 340 L'+(cx+30)+' 340 Q'+(cx+110)+' 360 '+(cx+112)+' 470Z" fill="#7FA9D9" stroke="#4F7DB0" stroke-width="3"/>';
 g+='<rect x="'+(cx-22)+'" y="262" width="46" height="88" rx="16" fill="#F2C6A0" stroke="#B9875F" stroke-width="2.5"/>';
 g+='<ellipse cx="'+(cx+2)+'" cy="196" rx="74" ry="80" fill="#F2C6A0" stroke="#B9875F" stroke-width="2.5"/>';
 g+='<path d="M'+(cx-72)+' 186 Q'+(cx-70)+' 108 '+(cx+6)+' 110 Q'+(cx+70)+' 112 '+(cx+76)+' 168 Q'+(cx+40)+' 140 '+(cx-10)+' 150 Q'+(cx-40)+' 160 '+(cx-52)+' 200Z" fill="#3B2A22"/>';
 g+='<circle cx="'+(cx+40)+'" cy="190" r="6" fill="#2B2B2B"/><ellipse cx="'+(cx-38)+'" cy="206" rx="12" ry="16" fill="#EBB58D" stroke="#B9875F" stroke-width="2"/>';
 g+=o.on?'<ellipse cx="'+(cx+46)+'" cy="236" rx="11" ry="13" fill="#9B3B3B"/>':'<path d="M'+(cx+34)+' 236 q12 4 22 0" stroke="#9B3B3B" stroke-width="4" fill="none" stroke-linecap="round"/>';
 g+=hand(cx+70,306,180,1.05);
 if(o.on){g+=buzz2(cx+1,300,30,3,' class="lb-buzz"');g+=bubble(cx+170,170,'아~','var(--lb-sci)')}
 return g+'</g>'}
/* 플라스틱 상자 + 고무줄 */
function boxBand(cx,o){o=o||{};const y=330,w=300,h=110;let g='';
 g+='<ellipse cx="'+cx+'" cy="'+(BY+2)+'" rx="'+(w/2+10)+'" ry="9" fill="var(--w-shadow)"/>';
 g+='<path d="M'+(cx-w/2)+' '+y+' L'+(cx+w/2)+' '+y+' L'+(cx+w/2-10)+' '+(y+h)+' L'+(cx-w/2+10)+' '+(y+h)+'Z" fill="#CFE3F1" fill-opacity=".75" stroke="#7D9CB5" stroke-width="3"/>';
 g+='<path d="M'+(cx-w/2)+' '+y+' L'+(cx-w/2+26)+' '+(y-24)+' L'+(cx+w/2+26)+' '+(y-24)+' L'+(cx+w/2)+' '+y+'" fill="#E3EFF8" fill-opacity=".7" stroke="#7D9CB5" stroke-width="3"/>';
 const by=y-12,x1=cx-w/2+14,x2=cx+w/2+12;
 let band='<path d="M'+x1+' '+by+' L'+x2+' '+by+'" stroke="#C0563A" stroke-width="6" stroke-linecap="round"/>';
 if(o.pull)band='<path d="M'+x1+' '+by+' L'+(cx+10)+' '+(by-(o.pull==='high'?70:28))+' L'+x2+' '+by+'" stroke="#C0563A" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>';
 if(o.pluck){const cls=o.slow?'lb-wob-slow':'lb-wob';const A=o.big===false?.5:1;
  band='<g class="'+cls+'" style="--amp:'+(14*A)+'px"><path d="M'+x1+' '+by+' Q'+(cx+10)+' '+(by-18*A)+' '+x2+' '+by+'" stroke="#C0563A" stroke-width="6" fill="none" stroke-linecap="round"/></g>'+
  '<path d="M'+x1+' '+by+' Q'+(cx+10)+' '+(by+18*A)+' '+x2+' '+by+'" stroke="#C0563A" stroke-width="5" fill="none" opacity=".35"'+an('lb-fadeout',0,'animation-duration:'+(o.slow?4.2:2)+'s')+'/>'}
 g+=band+hand(cx-w/2-30,y+50,0,1);
 if(o.finger)g+='<g'+an('lb-a-fade',0)+'>'+hand(cx+40,by-30,200,.9)+'</g>';
 return g}
/* 소리굽쇠 + 고무망치 */
function fork(cx,cy,o){o=o||{};let g='<g>';
 g+='<rect x="'+(cx-7)+'" y="'+(cy+40)+'" width="14" height="90" rx="6" fill="#9AA6B2" stroke="#5E6B78" stroke-width="2"/>';
 g+='<path d="M'+(cx-34)+' '+(cy-150)+' L'+(cx-34)+' '+(cy+10)+' Q'+(cx-34)+' '+(cy+46)+' '+cx+' '+(cy+46)+' Q'+(cx+34)+' '+(cy+46)+' '+(cx+34)+' '+(cy+10)+' L'+(cx+34)+' '+(cy-150)+'" fill="none" stroke="#B9C3CD" stroke-width="15" stroke-linecap="round"/>';
 g+='<path d="M'+(cx-34)+' '+(cy-150)+' L'+(cx-34)+' '+(cy+10)+' Q'+(cx-34)+' '+(cy+46)+' '+cx+' '+(cy+46)+' Q'+(cx+34)+' '+(cy+46)+' '+(cx+34)+' '+(cy+10)+' L'+(cx+34)+' '+(cy-150)+'" fill="none" stroke="#6E7B88" stroke-width="2" opacity=".6"/>';
 if(o.ring)g+=buzz(cx-34,cy-90,16,3,' class="lb-buzz"',180)+buzz(cx+34,cy-90,16,3,' class="lb-buzz"',0);
 g+=hand(cx+4,cy+130,-90,1.1);
 if(o.touch)g+='<g'+an('lb-a-fade',0)+'>'+hand(cx+120,cy-90,180,.95)+(o.ring?'<g class="lb-buzz">'+buzz(cx+60,cy-90,8,2,'',0)+'</g>':'')+'</g>';
 if(o.grab)g+='<g'+an('lb-a-fade',0)+'><rect x="'+(cx-52)+'" y="'+(cy-120)+'" width="104" height="70" rx="26" fill="#F2C6A0" stroke="#B9875F" stroke-width="2.4"/><path d="M'+(cx-40)+' '+(cy-100)+' h80 M'+(cx-40)+' '+(cy-82)+' h80" stroke="#B9875F" stroke-width="2"/></g>';
 return g+'</g>'}
function mallet(x,y,o){o=o||{};return '<g transform="translate('+x+' '+y+')"><g'+(o.swing?an('lb-a-swing',0):'')+'><rect x="-5" y="0" width="10" height="120" rx="4" fill="#B98A57" stroke="#7E5A33" stroke-width="2"/><rect x="-26" y="-24" width="52" height="34" rx="12" fill="#D9604B" stroke="#9E3F2E" stroke-width="2"/></g></g>'}
/* 수조 */
function tank(cx,o){o=o||{};const w=o.w||330,h=o.h||170,y=BY-h,wl=y+(o.full?28:70);let g='';
 g+='<ellipse cx="'+cx+'" cy="'+(BY+3)+'" rx="'+(w/2+8)+'" ry="8" fill="var(--w-shadow)"/>';
 g+='<rect x="'+(cx-w/2)+'" y="'+wl+'" width="'+w+'" height="'+(BY-wl)+'" fill="url(#lbWat)"/>';
 g+='<path d="M'+(cx-w/2)+' '+wl+' H'+(cx+w/2)+'" stroke="var(--w-water-s)" stroke-width="3"/>';
 if(o.ripple)for(let k=0;k<3;k++)g+='<ellipse cx="'+(o.rx||cx)+'" cy="'+wl+'" rx="22" ry="5" fill="none" stroke="#fff" stroke-width="3"'+an('lb-ripple',k*.35)+'/>';
 if(o.splash){[-30,-14,6,20,34,-24,28].forEach((dx,k)=>{g+='<circle cx="'+((o.rx||cx)+dx)+'" cy="'+(wl-4)+'" r="'+(4+k%3)+'" fill="var(--w-water)" stroke="var(--w-water-s)" stroke-width="1.5"'+an('lb-splash',k*.08,'--dy:-'+(30+(k*13)%40)+'px;--dx:'+dx*.6+'px')+'/>'})}
 g+='<rect x="'+(cx-w/2)+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="6" fill="var(--w-glass)" stroke="var(--w-glass-s)" stroke-width="3"/>';
 g+='<path d="M'+(cx-w/2+16)+' '+(y+14)+' V'+(BY-16)+'" stroke="#fff" stroke-opacity=".5" stroke-width="5" stroke-linecap="round"/>';
 return g}

/* 실험 2: 글로켄슈필 */
const GL=['#E05A4E','#EE8A3C','#E9C23B','#6DB54A','#3FA2A2','#3D7CC9','#6C5BC4','#B055B0'];
function glock(cx,o){o=o||{};let g='';const x0=cx-180;
 g+='<path d="M'+(x0-14)+' 360 L'+(x0+370)+' 380 L'+(x0+370)+' 420 L'+(x0-14)+' 430Z" fill="#7A5A3E" stroke="#4E3824" stroke-width="2"/>';
 GL.forEach((c,i)=>{const x=x0+i*46,hh=110-i*8,y=395-hh/2;const on=o.bar===i;
  g+='<g'+(on&&o.hit?an('lb-a-shake2',.15):'')+'><rect x="'+x+'" y="'+y+'" width="36" height="'+hh+'" rx="5" fill="'+c+'" stroke="#3A3A3A" stroke-width="'+(on?3.5:1.5)+'"/><circle cx="'+(x+18)+'" cy="'+(y+10)+'" r="3" fill="#E6E6E6"/><circle cx="'+(x+18)+'" cy="'+(y+hh-10)+'" r="3" fill="#E6E6E6"/></g>';
  if(on&&o.hit)g+=buzz(x+18,y,10,o.big?3:1,' class="lb-buzz"',-90)});
 if(o.stick){const bx=x0+(o.bar||0)*46+18,top=o.big?150:270;g+='<g transform="translate('+bx+' 0)"><g'+(o.hit?an(o.big?'lb-a-hitbig':'lb-a-hit',0):'')+'><path d="M0 '+(top+10)+' L120 '+(top-60)+'" stroke="#B98A57" stroke-width="9" stroke-linecap="round"/><circle cx="0" cy="'+(top+10)+'" r="16" fill="#3A3A3A"/></g></g>'}
 return g}
/* 소리 측정기: 바늘 + 숫자 + HOLD */
function meter(x,y,o){o=o||{};const v=o.val,a=v==null?-70:Math.max(-70,Math.min(70,-70+(v-40)*140/90));
 let g='<g transform="translate('+x+' '+y+')"><rect x="-80" y="-120" width="160" height="230" rx="18" fill="#2E3A48" stroke="#18212B" stroke-width="3"/><rect x="-64" y="-104" width="128" height="78" rx="8" fill="#F4F2E8"/>';
 for(let k=0;k<=6;k++){const t=(-70+k*140/6)*Math.PI/180;g+='<path d="M'+(Math.sin(t)*48).toFixed(1)+' '+(-34-Math.cos(t)*48).toFixed(1)+' L'+(Math.sin(t)*56).toFixed(1)+' '+(-34-Math.cos(t)*56).toFixed(1)+'" stroke="#55606B" stroke-width="2"/>'}
 g+='<g'+(o.anim?' class="lb-a lb-needle" style="--a:'+a+'deg;transform-box:fill-box;transform-origin:50% 100%"':' transform="rotate('+a+' 0 -34)"')+'><path d="M0 -34 L0 -90" stroke="#C0392B" stroke-width="4" stroke-linecap="round"/></g><circle cx="0" cy="-34" r="6" fill="#2E3A48"/>';
 g+='<rect x="-64" y="-12" width="128" height="58" rx="8" fill="#0F1A12"/><text x="0" y="33" text-anchor="middle" font-size="40" font-weight="800" fill="#8EF0A6" font-family="ui-monospace,Menlo,Consolas,monospace">'+(v==null?'- - -':v)+'</text>';
 if(o.hold)g+='<rect x="-46" y="58" width="92" height="34" rx="8" fill="#F2C94C"/>'+(NAR?'':'<text x="0" y="83" text-anchor="middle" font-size="23" font-weight="800" fill="#2E2410">HOLD</text>');
 if(o.hl)g+='<rect x="-72" y="-18" width="144" height="70" rx="12" fill="none" stroke="var(--lb-sci)" stroke-width="5" class="lb-a-pulse"/>';
 return g+'</g>'}
/* 스마트 기기(소리 높이를 재는 앱) */
function phone(x,y,o){o=o||{};let g='<g transform="translate('+x+' '+y+')"><rect x="-62" y="-118" width="124" height="230" rx="18" fill="#1F2733" stroke="#0E141C" stroke-width="3"/><rect x="-52" y="-100" width="104" height="190" rx="8" fill="#F6F8FB"/>';
 g+='<path d="M-40 -60 q10 -20 20 0 t20 0 t20 0 t20 0" stroke="#3D7CC9" stroke-width="3" fill="none"/>';
 g+='<text x="0" y="12" text-anchor="middle" font-size="40" font-weight="800" fill="#1B2A45" font-family="ui-monospace,Menlo,Consolas,monospace">'+(o.val==null?'- - -':o.val)+'</text>';
 if(o.hl)g+='<rect x="-58" y="-26" width="116" height="56" rx="10" fill="none" stroke="var(--lb-sci)" stroke-width="5" class="lb-a-pulse"/>';
 return g+'</g>'}
/* 자: 눈금 0이 악기 끝(edge)에 맞음, cmPx = 1 cm 길이 */
function ruler(edge,y,cmPx,maxCm,mark){const w=cmPx*maxCm;let g='<g><rect x="'+(edge-8)+'" y="'+y+'" width="'+(w+16)+'" height="30" rx="4" fill="#F3D27A" stroke="#B4902F" stroke-width="2"/>';
 for(let k=0;k<=maxCm;k++){const tx=edge+k*cmPx;g+='<path d="M'+tx+' '+y+' v'+(k%5?11:19)+'" stroke="#6B551A" stroke-width="2"/>'}
 if(!NAR)g+='<text x="'+edge+'" y="'+(y-8)+'" text-anchor="middle" font-size="25" font-weight="800" fill="var(--w-labeltx)">0</text>';
 if(mark!=null){const tx=edge+mark*cmPx;g+='<path d="M'+tx+' '+(y-6)+' v42" stroke="var(--lb-sci)" stroke-width="4"/>';if(!NAR)g+='<text x="'+tx+'" y="'+(y+60)+'" text-anchor="middle" font-size="22" font-weight="800" fill="var(--lb-sci-ink)">'+mark+' cm</text>'}
 return g+'</g>'}

/* 실험 3: 칼림바 */
const KAL=[150,132,116,100,86,74,62];
function kalimba(cx,o){o=o||{};let g='<g><path d="M'+(cx-170)+' 300 Q'+cx+' 270 '+(cx+170)+' 300 L'+(cx+160)+' 430 L'+(cx-160)+' 430Z" fill="#C79A64" stroke="#7E5A33" stroke-width="3"/><circle cx="'+cx+'" cy="400" r="16" fill="#5B3F22"/><rect x="'+(cx-160)+'" y="306" width="320" height="12" rx="4" fill="#8F8F8F"/>';
 /* 건반: 가운데 가장 긺 → 바깥으로 짧아짐 */
 const order=[6,4,2,0,1,3,5];
 order.forEach((ki,pos)=>{const x=cx-138+pos*46,len=KAL[ki];const on=o.key===ki;const top=312-len;
  g+='<g'+(on&&o.pluck?an('lb-a-shake2',0):'')+'><rect x="'+(x-9)+'" y="'+top+'" width="18" height="'+(len+14)+'" rx="7" fill="'+(on?'#F2C94C':'#D7DCE1')+'" stroke="'+(on?'#9A7A12':'#6E7B88')+'" stroke-width="'+(on?3:2)+'"/></g>';
  if(on&&o.pluck)g+=buzz(x,top,8,2,' class="lb-buzz"',-90)});
 return g+'</g>'}
/* 우쿨렐레(가로) */
function uke(cx,o){o=o||{};let g='<g>';const y=300;
 g+='<path d="M'+(cx+60)+' '+(y-70)+' Q'+(cx+150)+' '+(y-90)+' '+(cx+200)+' '+(y-40)+' Q'+(cx+250)+' '+y+' '+(cx+200)+' '+(y+40)+' Q'+(cx+150)+' '+(y+90)+' '+(cx+60)+' '+(y+70)+' Q'+(cx+20)+' '+(y+40)+' '+(cx+30)+' '+y+' Q'+(cx+20)+' '+(y-40)+' '+(cx+60)+' '+(y-70)+'Z" fill="#D8A866" stroke="#8A5E2B" stroke-width="3"/><circle cx="'+(cx+110)+'" cy="'+y+'" r="26" fill="#4B321A"/>';
 g+='<rect x="'+(cx-330)+'" y="'+(y-22)+'" width="370" height="44" rx="6" fill="#7A5230" stroke="#4E3420" stroke-width="2"/><rect x="'+(cx-380)+'" y="'+(y-30)+'" width="56" height="60" rx="8" fill="#6A4628"/>';
 for(let k=0;k<9;k++){const fx=cx-300+k*38;g+='<path d="M'+fx+' '+(y-22)+' v44" stroke="#D9D9D9" stroke-width="3"/>'}
 const sy=[y-14,y-5,y+5,y+14],bx=cx+170,nx=cx-326;
 const fx=o.hold==='short'?cx-24:o.hold==='long'?cx-262:null;
 sy.forEach((yy,i)=>{const sel=i===1;g+='<path d="M'+nx+' '+yy+' H'+bx+'" stroke="#EDEDED" stroke-width="'+(sel?3:2)+'"/>';
  if(sel&&fx!=null){g+='<path d="M'+fx+' '+yy+' H'+bx+'" stroke="#F2C94C" stroke-width="5"'+(o.pluck?an('lb-a-shake2',0):'')+'/>'}});
 g+='<rect x="'+(bx-6)+'" y="'+(y-20)+'" width="12" height="40" rx="3" fill="#3A2614"/>';
 if(fx!=null)g+='<g transform="translate('+fx+' '+(y-60)+')"><ellipse cx="0" cy="34" rx="14" ry="22" fill="#F2C6A0" stroke="#B9875F" stroke-width="2.4"/></g>';
 if(o.pluck)g+=buzz(bx-60,y-5,10,2,' class="lb-buzz"',-90);
 return g+'</g>'}
/* 실험 4: 공기를 빼는 장치 */
function jar(cx,o){o=o||{};const air=o.air==null?1:o.air;let g='';
 g+='<ellipse cx="'+cx+'" cy="'+(BY+2)+'" rx="190" ry="10" fill="var(--w-shadow)"/><rect x="'+(cx-180)+'" y="'+(BY-26)+'" width="360" height="26" rx="6" fill="#5E6B78" stroke="#3C4650" stroke-width="2"/>';
 /* 손잡이 펌프(오른쪽) */
 const px=cx+250;g+='<rect x="'+(px-22)+'" y="250" width="44" height="160" rx="8" fill="#9AA6B2" stroke="#5E6B78" stroke-width="2"/><path d="M'+(cx+180)+' 400 H'+(px-22)+'" stroke="#5E6B78" stroke-width="8"/>';
 g+='<g'+(o.pump?an('lb-a-pump',0):'')+'><rect x="'+(px-5)+'" y="190" width="10" height="70" fill="#5E6B78"/><rect x="'+(px-40)+'" y="176" width="80" height="20" rx="8" fill="#D9604B" stroke="#9E3F2E" stroke-width="2"/></g>';
 if(o.cotton)g+='<g'+(o.aCotton?an('lb-a-down',.1,'--from:-120px'):'')+'>'+[-80,-40,0,40,80].map((dx,k)=>'<circle cx="'+(cx+dx)+'" cy="'+(BY-34-(k%2)*6)+'" r="24" fill="#FBF9F3" stroke="#D8D1C2" stroke-width="2"/>').join('')+'</g>';
 if(o.speaker){g+='<g'+(o.aLid?an('lb-a-down',.1,'--from:-160px'):'')+'><rect x="'+(cx-50)+'" y="'+(BY-130)+'" width="100" height="80" rx="16" fill="#2F3B4A" stroke="#18212B" stroke-width="3"/><circle cx="'+cx+'" cy="'+(BY-90)+'" r="26" fill="#55606B" stroke="#1B232D" stroke-width="3"/><circle cx="'+cx+'" cy="'+(BY-90)+'" r="9" fill="#1B232D"/></g>';
  if(o.on){const L=loudOf(air),s=.35+L*.65;for(let k=0;k<3;k++)g+='<circle cx="'+cx+'" cy="'+(BY-90)+'" r="'+(60+k*36)*s+'" fill="none" stroke="var(--lb-sci)" stroke-width="'+(2+L*3)+'" opacity="'+(.25+L*.6)+'"'+an('lb-wave',k*.5)+'/>'}}
 /* 공기 알갱이 */
 const N=Math.round(36*air);for(let i=0;i<N;i++){const t=(i*137.5)%360*Math.PI/180,r=40+((i*53)%120);g+='<circle cx="'+(cx+Math.cos(t)*r*1.15).toFixed(1)+'" cy="'+(BY-150+Math.sin(t)*r*.62).toFixed(1)+'" r="4" fill="#7FB3E0" opacity=".8"/>'}
 /* 유리 덮개 */
 const lidY=o.lid?0:-150;
 g+='<g'+(o.aLid?an('lb-a-down',.6,'--from:-150px'):'')+(o.lid||o.aLid?'':' transform="translate(0 '+lidY+')"')+'><path d="M'+(cx-170)+' '+(BY-26)+' L'+(cx-170)+' '+(BY-200)+' Q'+(cx-170)+' '+(BY-300)+' '+cx+' '+(BY-300)+' Q'+(cx+170)+' '+(BY-300)+' '+(cx+170)+' '+(BY-200)+' L'+(cx+170)+' '+(BY-26)+'" fill="var(--w-glass)" stroke="var(--w-glass-s)" stroke-width="4"/><path d="M'+(cx-140)+' '+(BY-200)+' Q'+(cx-140)+' '+(BY-270)+' '+(cx-60)+' '+(BY-282)+'" stroke="#fff" stroke-opacity=".6" stroke-width="7" fill="none" stroke-linecap="round"/>'+
  '<rect x="'+(cx-22)+'" y="'+(BY-318)+'" width="44" height="22" rx="6" fill="'+(o.btn?'#2C9B6E':'#5E6B78')+'"'+(o.aBtn?an('lb-a-pop',0):'')+'/></g>';
 return g}
/* 소리 크기 막대(5칸) — 소리 없이도 보이게 */
function bars(x,y,level){let g='<g transform="translate('+x+' '+y+')">';for(let k=0;k<5;k++){const on=k<level;g+='<rect x="'+(k*26)+'" y="'+(-(k+1)*14)+'" width="20" height="'+((k+1)*14)+'" rx="3" fill="'+(on?'var(--lb-sci)':'var(--w-label)')+'" stroke="var(--w-felt-s)" stroke-width="1.5"/>'}return g+'</g>'}
/* 실험 5: 캐스터네츠 */
function castanet(x,y,s,anim){return '<g transform="translate('+x+' '+y+') scale('+(s||1)+')"><g'+(anim?an('lb-a-clap',0):'')+'><ellipse cx="0" cy="-10" rx="34" ry="14" fill="#D9604B" stroke="#9E3F2E" stroke-width="2.5"/></g><ellipse cx="0" cy="10" rx="34" ry="14" fill="#3D7CC9" stroke="#2A5A94" stroke-width="2.5"/><path d="M-34 0 h-14" stroke="#555" stroke-width="3"/></g>'}
function ear(x,y,s){return '<g transform="translate('+x+' '+y+') scale('+(s||1)+')"><path d="M0 -40 Q34 -44 36 -6 Q38 22 14 30 Q6 34 6 44 Q4 52 -8 50" fill="#F2C6A0" stroke="#B9875F" stroke-width="3"/><path d="M8 -20 Q22 -18 20 0 Q18 12 8 14" stroke="#B9875F" stroke-width="3" fill="none"/></g>'}
function tok(x,y,i,heard,soft){if(!heard)return '';return '<g'+an('lb-tok',i*.55)+'><circle cx="'+x+'" cy="'+y+'" r="'+(soft?16:22)+'" fill="var(--w-label)" stroke="'+(soft?'var(--w-water-s)':'var(--lb-sci)')+'" stroke-width="3"/><path d="M'+(x-8)+' '+(y-6)+' l8 6 l8 -6 M'+(x-8)+' '+(y+4)+' l8 6 l8 -6" stroke="'+(soft?'var(--w-water-s)':'var(--lb-sci)')+'" stroke-width="3" fill="none" stroke-linecap="round"/></g>'}
/* 책상 */
function desk(x,w){return '<g><rect x="'+x+'" y="300" width="'+w+'" height="26" rx="4" fill="#C9A06A" stroke="#8A6537" stroke-width="2.5"/><rect x="'+(x+14)+'" y="326" width="16" height="130" fill="#8A6537"/><rect x="'+(x+w-30)+'" y="326" width="16" height="130" fill="#8A6537"/></g>'}
/* 옆으로 엎드린 머리: 아래쪽 귀가 책상에 닿고, 다른 손이 위쪽 귀를 막음 */
function headOnDesk(x,o){o=o||{};let g='<g><path d="M'+(x-150)+' 300 Q'+(x-140)+' 262 '+(x-60)+' 268 L'+(x-30)+' 300Z" fill="#5C8FCB" stroke="#3D6A9C" stroke-width="2.4"/>';
 g+='<ellipse cx="'+x+'" cy="252" rx="66" ry="48" fill="#F2C6A0" stroke="#B9875F" stroke-width="2.5"/><path d="M'+(x-66)+' 250 Q'+(x-62)+' 200 '+(x-6)+' 204 Q'+(x+40)+' 206 '+(x+48)+' 222 Q'+(x+8)+' 214 '+(x-30)+' 232 Q'+(x-50)+' 246 '+(x-66)+' 262Z" fill="#3B2A22"/>';
 g+=o.closed?'<path d="M'+(x+26)+' 248 q10 6 20 0" stroke="#2B2B2B" stroke-width="3.5" fill="none" stroke-linecap="round"/>':'<circle cx="'+(x+34)+'" cy="248" r="5" fill="#2B2B2B"/>';
 /* 책상에 닿은 귀 */
 g+='<path d="M'+(x-18)+' 300 Q'+(x-20)+' 280 '+(x)+' 280 Q'+(x+20)+' 280 '+(x+18)+' 300Z" fill="#E9B48C" stroke="#B9875F" stroke-width="2.5"/><path d="M'+(x-8)+' 298 Q'+(x-6)+' 288 '+x+' 288 Q'+(x+6)+' 288 '+(x+8)+' 298" stroke="#B9875F" stroke-width="2.2" fill="none"/>';
 /* 위쪽 귀를 덮은 손과 팔 */
 if(o.cover)g+='<g'+an('lb-a-fade',0)+'><path d="M'+(x-10)+' 196 Q'+(x-60)+' 150 '+(x-120)+' 140 L'+(x-130)+' 168 Q'+(x-70)+' 176 '+(x-26)+' 214Z" fill="#5C8FCB" stroke="#3D6A9C" stroke-width="2.4"/><ellipse cx="'+(x+2)+'" cy="210" rx="30" ry="18" fill="#F2C6A0" stroke="#B9875F" stroke-width="2.4"/><path d="M'+(x+10)+' 196 v-10 M'+(x+20)+' 198 v-9 M'+(x+28)+' 202 v-7" stroke="#B9875F" stroke-width="2.4" stroke-linecap="round"/></g>';
 else g+='<path d="M'+(x-4)+' 214 Q'+(x+14)+' 206 '+(x+22)+' 220 Q'+(x+14)+' 234 '+(x)+' 228" fill="#E9B48C" stroke="#B9875F" stroke-width="2.4"/>';
 return g+'</g>'}
/* 책상을 따라 전해지는 '톡' 표시 (from → to, gap이면 틈에서 멈춤) */
function deskTrail(from,to,taps,stop){let g='';const n=Math.max(2,Math.round(Math.abs(from-to)/46));for(let t=0;t<taps;t++)for(let i=0;i<n;i++){const xx=from-(from-to)*i/(n-1);const last=i===n-1;g+='<g'+an('lb-tok',t*.55+i*.05)+'><path d="M'+(xx+6)+' 290 q-10 10 0 20" stroke="'+(stop&&last?'var(--w-water-s)':'var(--lb-sci)')+'" stroke-width="4" fill="none" stroke-linecap="round" opacity="'+(stop?Math.max(.25,1-i/(n-1)*.75):1)+'"/></g>'}
 return g}
/* 준비물 카드 */
function itemArt(k){const A={
  box:'<path d="M-50 -20 L50 -20 L44 30 L-44 30Z" fill="#CFE3F1" stroke="#7D9CB5" stroke-width="2.5"/><path d="M-46 -26 H48" stroke="#C0563A" stroke-width="4"/>',
  band:'<ellipse cx="0" cy="0" rx="40" ry="16" fill="none" stroke="#C0563A" stroke-width="6"/>',
  tank:'<rect x="-50" y="-34" width="100" height="70" rx="5" fill="var(--w-glass)" stroke="var(--w-glass-s)" stroke-width="2.5"/><rect x="-48" y="-6" width="96" height="40" fill="var(--w-water)" opacity=".8"/>',
  fork:'<path d="M-12 -44 V6 Q-12 18 0 18 Q12 18 12 6 V-44" fill="none" stroke="#9AA6B2" stroke-width="8" stroke-linecap="round"/><rect x="-4" y="18" width="8" height="30" rx="3" fill="#9AA6B2"/>',
  mallet:'<rect x="-4" y="-10" width="8" height="58" rx="3" fill="#B98A57"/><rect x="-22" y="-30" width="44" height="24" rx="10" fill="#D9604B"/>',
  glock:GL.slice(0,6).map((c,i)=>'<rect x="'+(-54+i*18)+'" y="'+(-34+i*4)+'" width="14" height="'+(68-i*8)+'" rx="3" fill="'+c+'"/>').join(''),
  stick:'<path d="M-30 30 L30 -30" stroke="#B98A57" stroke-width="7" stroke-linecap="round"/><circle cx="-30" cy="30" r="11" fill="#3A3A3A"/>',
  meter:'<rect x="-30" y="-46" width="60" height="92" rx="10" fill="#2E3A48"/><rect x="-22" y="-36" width="44" height="28" rx="4" fill="#F4F2E8"/><rect x="-22" y="0" width="44" height="22" rx="4" fill="#0F1A12"/>',
  ruler:'<rect x="-56" y="-12" width="112" height="24" rx="3" fill="#F3D27A" stroke="#B4902F" stroke-width="2"/>'+[0,1,2,3,4,5,6,7,8,9,10].map(k=>'<path d="M'+(-50+k*10)+' -12 v'+(k%5?7:12)+'" stroke="#6B551A" stroke-width="1.5"/>').join(''),
  kalimba:'<path d="M-50 -20 Q0 -30 50 -20 L46 40 L-46 40Z" fill="#C79A64" stroke="#7E5A33" stroke-width="2"/>'+[-30,-15,0,15,30].map((x,i)=>'<rect x="'+(x-3)+'" y="'+(-30-[10,22,30,22,10][i])+'" width="6" height="'+(40+[10,22,30,22,10][i])+'" rx="3" fill="#D7DCE1" stroke="#6E7B88"/>').join(''),
  uke:'<ellipse cx="22" cy="10" rx="30" ry="26" fill="#D8A866" stroke="#8A5E2B" stroke-width="2"/><rect x="-56" y="2" width="60" height="14" rx="3" fill="#7A5230"/><circle cx="24" cy="10" r="8" fill="#4B321A"/>',
  phone:'<rect x="-24" y="-44" width="48" height="88" rx="8" fill="#1F2733"/><rect x="-19" y="-36" width="38" height="70" rx="4" fill="#F6F8FB"/><path d="M-14 -10 q5 -10 10 0 t10 0 t10 0" stroke="#3D7CC9" stroke-width="2.5" fill="none"/>',
  phone2:'<rect x="-24" y="-44" width="48" height="88" rx="8" fill="#1F2733"/><rect x="-19" y="-36" width="38" height="70" rx="4" fill="#F6F8FB"/>',
  jar:'<rect x="-50" y="34" width="100" height="10" rx="3" fill="#5E6B78"/><path d="M-44 34 V-10 Q-44 -44 0 -44 Q44 -44 44 -10 V34" fill="var(--w-glass)" stroke="var(--w-glass-s)" stroke-width="3"/>',
  cotton:[-24,0,24].map(x=>'<circle cx="'+x+'" cy="'+(x?6:-4)+'" r="20" fill="#FBF9F3" stroke="#D8D1C2" stroke-width="2"/>').join(''),
  speaker:'<rect x="-36" y="-28" width="72" height="56" rx="12" fill="#2F3B4A"/><circle cx="0" cy="0" r="17" fill="#55606B"/>',
  cast:'<ellipse cx="0" cy="-8" rx="34" ry="13" fill="#D9604B" stroke="#9E3F2E" stroke-width="2"/><ellipse cx="0" cy="10" rx="34" ry="13" fill="#3D7CC9" stroke="#2A5A94" stroke-width="2"/>',
  pencil:'<path d="M-50 10 L36 -26 L48 -20 L-38 16Z" fill="#F2C94C" stroke="#9A7A12" stroke-width="2"/><path d="M36 -26 L56 -30 L48 -20Z" fill="#3A3A3A"/>',
  desk:'<rect x="-54" y="-14" width="50" height="10" fill="#C9A06A"/><rect x="4" y="-14" width="50" height="10" fill="#C9A06A"/><rect x="-50" y="-4" width="6" height="40" fill="#8A6537"/><rect x="-14" y="-4" width="6" height="40" fill="#8A6537"/><rect x="8" y="-4" width="6" height="40" fill="#8A6537"/><rect x="44" y="-4" width="6" height="40" fill="#8A6537"/>'};
 return A[k]||''}
function toolsScene(list,anim){let b='';if(NAR)list.forEach(it=>LEG.push([null,it[1]]));const n=list.length,cols=n<=4?n:n<=6?3:4,rows=Math.ceil(n/cols),cw=200,ch=176,gx=18,gy=18;
 const W=cols*cw+(cols-1)*gx,H=rows*ch+(rows-1)*gy,x0=480-W/2,y0=Math.max(30,250-H/2);
 list.forEach((it,i)=>{const c=i%cols,r=Math.floor(i/cols),x=x0+c*(cw+gx),y=y0+r*(ch+gy),cx=x+cw/2;
  b+='<g'+(anim?an('lb-a-pop',.3+i*.15):'')+'><rect x="'+x+'" y="'+y+'" width="'+cw+'" height="'+ch+'" rx="16" fill="var(--w-label)" stroke="var(--w-felt-s)" stroke-width="1.5"/><g transform="translate('+cx+' '+(y+72)+')">'+itemArt(it[0])+'</g>'+(NAR?'':'<text x="'+cx+'" y="'+(y+ch-18)+'" text-anchor="middle" font-size="20" font-weight="800" fill="var(--w-labeltx)">'+it[1]+'</text>')+'</g>'});
 return b}
function boxArt(x){return '<g transform="translate('+x+' 300)"><path d="M-130 -60 L-100 -96 H150 L120 -60Z" fill="var(--w-kraft-s)"/><rect x="-130" y="-60" width="250" height="196" rx="8" fill="var(--w-kraft)" stroke="var(--w-kraft-s)" stroke-width="2"/><path d="M120 -60 L150 -96 V100 L120 136Z" fill="var(--w-kraft-s)"/>'+(NAR?'':'<rect x="-60" y="-10" width="110" height="44" rx="8" fill="var(--w-label)"/><text x="-5" y="20" text-anchor="middle" font-size="22" font-weight="800" fill="var(--w-labeltx)">준비물</text>')+'</g>'}
/* 교실(조용히) */
function classroom(quiet,anim){let g='';[180,330,480,630,780].forEach((x,i)=>{g+='<circle cx="'+x+'" cy="'+(300+(i%2)*10)+'" r="40" fill="#F2C6A0" stroke="#B9875F" stroke-width="2.5"/><path d="M'+(x-40)+' '+(300+(i%2)*10)+' Q'+x+' '+(250+(i%2)*10)+' '+(x+40)+' '+(300+(i%2)*10)+'" fill="'+['#3B2A22','#6B4A2A','#2B2B2B','#7A3E2A','#3B2A22'][i]+'"/>'+
  '<rect x="'+(x-46)+'" y="'+(344+(i%2)*10)+'" width="92" height="70" rx="20" fill="'+['#7FA9D9','#E59A6F','#8CC37A','#C79AD8','#F0C75E'][i]+'"/>';
  if(!quiet||anim)g+='<g'+(anim?an('lb-fadeout',.2+i*.08):'')+'>'+buzz(x,300,30,2,'',-60)+'</g>'});
 if(quiet||anim)g+='<g'+(anim?an('lb-a-pop',.9):'')+'>'+bubble(480,150,'쉿, 조용히','var(--lb-sci)')+'</g>';return g}
/* 작은북 + 공 */
function drum(cx,o){o=o||{};let g='<ellipse cx="'+cx+'" cy="'+(BY+2)+'" rx="150" ry="10" fill="var(--w-shadow)"/><path d="M'+(cx-140)+' 330 V420 Q'+cx+' 446 '+(cx+140)+' 420 V330" fill="#C0392B" stroke="#7E241B" stroke-width="3"/><ellipse cx="'+cx+'" cy="330" rx="140" ry="26" fill="#F4F2E8" stroke="#8F8F8F" stroke-width="3"/>';
 const H=o.hit?(o.big?150:45):0;[-60,-20,20,60].forEach((dx,k)=>{g+='<circle cx="'+(cx+dx)+'" cy="'+(318-(k%2)*4)+'" r="12" fill="#FFFFFF" stroke="#9AA6B2" stroke-width="2"'+(o.hit?an('lb-bounce',k*.05,'--h:-'+(H-(k%2)*10)+'px'):'')+'/>'});
 if(o.hit)g+='<g transform="translate('+(cx+150)+' 0)"><g'+an(o.big?'lb-a-hitbig':'lb-a-hit',0)+'><path d="M-150 320 L0 '+(o.big?160:250)+'" stroke="#B98A57" stroke-width="8" stroke-linecap="round"/></g></g>';
 return g}
/* 실 전화기 */
function stringPhone(o){o=o||{};let g='';const taut=o.taut;
 g+='<g transform="translate(200 260)"><path d="M-40 -40 L30 -30 L30 30 L-40 40Z" fill="#E9C23B" stroke="#9A7A12" stroke-width="3"/></g><g transform="translate(760 260)"><path d="M40 -40 L-30 -30 L-30 30 L40 40Z" fill="#6DB54A" stroke="#3F7A27" stroke-width="3"/></g>';
 g+=taut?'<path d="M230 260 L730 260" stroke="#7A5A3E" stroke-width="3"/>':'<path d="M230 260 Q480 380 730 260" stroke="#7A5A3E" stroke-width="3" fill="none"/>';
 if(o.play&&taut)for(let k=0;k<4;k++)g+='<circle cx="250" cy="260" r="10" fill="var(--lb-sci)"'+an('lb-travel',k*.4)+'/>';
 g+=ear(800,250,.9);if(o.play&&taut)g+=tok(860,190,0,1);
 return g}
/* 두 소리(가·나) — 높고 작은 소리, 낮고 큰 소리 */
function twoSpk(o){o=o||{};let g='';[[300,'가',1],[660,'나',0]].forEach(([x,l,hi],i)=>{g+='<rect x="'+(x-60)+'" y="240" width="120" height="150" rx="20" fill="#2F3B4A" stroke="#18212B" stroke-width="3"/><circle cx="'+x+'" cy="315" r="40" fill="#55606B" stroke="#1B232D" stroke-width="3"/>';
  if(o.play===i){const rings=hi?6:2,big=hi?.7:1.6;for(let k=0;k<rings;k++)g+='<circle cx="'+x+'" cy="315" r="'+(50+k*(hi?14:40))+'" fill="none" stroke="var(--lb-sci)" stroke-width="'+(hi?2:6)+'" opacity="'+(hi?.6:.85)+'"'+an('lb-wave',k*(hi?.12:.4))+'/>'}
  if(o.nums&&o.nums[i]!=null){g+='<rect x="'+(x-80)+'" y="150" width="160" height="68" rx="14" fill="var(--w-label)" stroke="var(--lb-sci)" stroke-width="3"/><text x="'+x+'" y="198" text-anchor="middle" font-size="40" font-weight="800" fill="var(--lb-sci-ink)">'+o.nums[i]+'</text>'}
  g+=plate(x,l+' 소리',430)});return g}
