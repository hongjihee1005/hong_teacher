/* ───────── 그림: 실험대 장면 — 모두 직접 그린 SVG (식물의 구조와 기능) ───────── */
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
function shadow(cx,y,rx){return '<ellipse cx="'+cx+'" cy="'+y+'" rx="'+rx+'" ry="7" fill="var(--w-shadow)"/>'}
function rnd(i,s){const h=Math.sin(i*12.9898+(s||0)*78.233)*43758.5453;return h-Math.floor(h)}
function pen(x,y,col,rot){return '<g transform="translate('+x+' '+y+') rotate('+(rot==null?-30:rot)+')"><rect x="-9" y="-96" width="18" height="84" rx="5" fill="'+col+'"/><rect x="-9" y="-96" width="18" height="24" rx="5" fill="#E9ECEF" stroke="'+col+'" stroke-width="2"/><path d="M-7 -12 L0 6 L7 -12Z" fill="'+col+'"/></g>'}
/* ───────── 실험복·보안경·장갑 ───────── */
function coat(x,y,s){return '<g transform="translate('+x+' '+y+') scale('+(s||1)+')"><path d="M-46 -64 L-18 -72 L0 -40 L18 -72 L46 -64 L62 30 L40 34 L36 -10 L34 72 H-34 L-36 -10 L-40 34 L-62 30Z" fill="#FFFFFF" stroke="#9AA6B2" stroke-width="3" stroke-linejoin="round"/><path d="M0 -40 V72" stroke="#9AA6B2" stroke-width="2"/><circle cx="-7" cy="-6" r="3" fill="#9AA6B2"/><circle cx="-7" cy="22" r="3" fill="#9AA6B2"/><rect x="12" y="10" width="16" height="12" rx="2" fill="none" stroke="#9AA6B2" stroke-width="2"/></g>'}
function goggles(x,y,s){return '<g transform="translate('+x+' '+y+') scale('+(s||1)+')"><rect x="-58" y="-18" width="52" height="36" rx="15" fill="rgba(200,230,245,.6)" stroke="#2F68B0" stroke-width="4"/><rect x="6" y="-18" width="52" height="36" rx="15" fill="rgba(200,230,245,.6)" stroke="#2F68B0" stroke-width="4"/><path d="M-6 -2 h12" stroke="#2F68B0" stroke-width="5"/></g>'}
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
const WC='#BFE3F5',WS='#6FA9CC',GLS='var(--w-glass-s)';
function mixc(a,b,t){const h=x=>[1,3,5].map(i=>parseInt(x.substr(i,2),16));const A=h(a),B=h(b);return '#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('')}
function tweezArt(x,y,rot,item){return '<g transform="translate('+x+' '+y+') rotate('+(rot||0)+')"><path d="M-4 -110 L-10 -6 L-4 -4 L2 -108Z" fill="#B9C2CA" stroke="#5D6B78" stroke-width="2"/><path d="M4 -110 L10 -6 L4 -4 L-2 -108Z" fill="#CBD3DB" stroke="#5D6B78" stroke-width="2"/>'+(item||'')+'</g>'}
const CAPC='#E2573F',CAPS='#A33A2A';
function drops(x,y0,y1,col,n,delay){let g='';for(let k=0;k<n;k++)g+='<g'+an('lb-a-drip',(delay||0)+k*.35,'animation-duration:.6s')+'><path d="M'+x+' '+(y0+(y1-y0)*.5)+' q-6 10 0 14 q6 -4 0 -14z" fill="'+col+'" stroke="#7AA7BD" stroke-width="1.2"/></g>';return g}

/* ───────── 실험복·마스크·보안경·장갑 ───────── */
function maskArt(x,y,s){return '<g transform="translate('+x+' '+y+') scale('+(s||1)+')"><path d="M-30 -14 Q0 -22 30 -14 L28 12 Q0 24 -28 12Z" fill="#EAF2F8" stroke="#8FA6B8" stroke-width="3"/><path d="M-22 -6 H22 M-22 4 H22" stroke="#B9CAD8" stroke-width="2"/><path d="M-30 -10 L-44 -18 M30 -10 L44 -18" stroke="#8FA6B8" stroke-width="2.5"/></g>'}
function gearArt(on,anim,o){o=o||{};const gl='#FFFFFF';
 if(!on){let g='';if(o.coat!==false)g+=coat(300,250,1.4);if(o.gog!==false)g+=goggles(520,200,1.1);if(o.mask)g+=maskArt(520,290,1.4);if(o.glove!==false)g+='<g transform="translate(700 270) scale(1.3)">'+hand(-14,-10,-60,.75,1)+hand(22,8,-60,.75,1)+'</g>';return g+qmark(480,90)}
 let g='<g'+(anim?an('lb-a-up',0,'--from:100px'):'')+'><circle cx="480" cy="116" r="38" fill="#F2C6A0" stroke="#B9875F" stroke-width="3"/>';
 if(o.gog!==false)g+=goggles(480,108,.82);if(o.mask)g+=maskArt(480,134,.9);if(o.coat!==false)g+=coat(480,262,1.75);
 if(o.glove!==false)g+=hand(330,240,-70,1.4,1).replace(/#FFFFFF/g,gl)+hand(630,240,-110,1.4,1).replace(/#FFFFFF/g,gl);
 return g+'</g>'}

/* ───────── 공통 소품 ───────── */
let CID=0;const uid=p=>'lb'+p+(++CID);
function windowArt(x){return '<g><rect x="'+(x-10)+'" y="70" width="300" height="230" rx="8" fill="var(--w-sky2)" stroke="var(--w-fr-s)" stroke-width="8"/><path d="M'+(x+140)+' 70 V300 M'+(x-10)+' 185 H'+(x+290)+'" stroke="var(--w-fr-s)" stroke-width="6"/></g>'}
function sunArt(x,y,r,anim){r=r||32;let g='<g'+(anim?an('lb-a-pop',0):'')+'>';for(let i=0;i<8;i++){const a=i*Math.PI/4;g+='<path d="M'+(x+Math.cos(a)*(r+8)).toFixed(1)+' '+(y+Math.sin(a)*(r+8)).toFixed(1)+' L'+(x+Math.cos(a)*(r+22)).toFixed(1)+' '+(y+Math.sin(a)*(r+22)).toFixed(1)+'" stroke="#F2B705" stroke-width="6" stroke-linecap="round"/>'}
 return g+'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="#FFD23F" stroke="#E0A800" stroke-width="3"/></g>'}
/* 돋보기 */
function glassArt(x,y,r,rot){return '<g transform="translate('+x+' '+y+') rotate('+(rot||0)+')"><rect x="-9" y="'+(r+2)+'" width="18" height="'+(r*1.15).toFixed(0)+'" rx="7" fill="#7A4E2C" stroke="#4E3019" stroke-width="2"/><circle r="'+r+'" fill="rgba(220,238,250,.22)" stroke="#3B4650" stroke-width="'+Math.max(5,r*.14).toFixed(1)+'"/></g>'}
/* 둥근 확대 창: inner는 (0,0)이 가운데인 그림 */
function magnify(cx,cy,R,inner,fill,ring){const id=uid('M');return '<g><clipPath id="'+id+'"><circle cx="'+cx+'" cy="'+cy+'" r="'+R+'"/></clipPath><circle cx="'+cx+'" cy="'+cy+'" r="'+(R+6)+'" fill="var(--w-label)"/><g clip-path="url(#'+id+')"><rect x="'+(cx-R)+'" y="'+(cy-R)+'" width="'+2*R+'" height="'+2*R+'" fill="'+(fill||'#FFFDF6')+'"/><g transform="translate('+cx+' '+cy+')">'+inner+'</g></g><circle cx="'+cx+'" cy="'+cy+'" r="'+R+'" fill="none" stroke="'+(ring||'#3B4650')+'" stroke-width="7"/></g>'}
function ringAt(cx,cy,rx,ry){return '<ellipse cx="'+cx+'" cy="'+cy+'" rx="'+rx+'" ry="'+ry+'" fill="none" stroke="var(--lb-lens)" stroke-width="5" stroke-dasharray="12 8"/>'}
function dayTag(t,x){return mini(x||200,80,t,26)}
/* 약품병·스포이트 */
function dropBottle(cx,b,o){o=o||{};const s=o.s||1,w=24*s,h=96*s,top=b-h;let g=o.noShadow?'':shadow(cx,b+4,w+10);
 g+='<rect x="'+(cx-w)+'" y="'+top+'" width="'+2*w+'" height="'+h+'" rx="'+9*s+'" fill="'+(o.col||'rgba(232,244,250,.4)')+'" fill-opacity="'+(o.col?(o.op||.85):1)+'" stroke="'+GLS+'" stroke-width="3"/>';
 if(o.lab)g+='<rect x="'+(cx-w+5)+'" y="'+(top+h*.38)+'" width="'+(2*w-10)+'" height="'+(h*.3)+'" fill="#FFFFFF" stroke="#C9CFD4"/>';
 g+='<path d="M'+(cx-12*s)+' '+top+' v-12 h'+24*s+' v12z" fill="'+CAPC+'" stroke="'+CAPS+'" stroke-width="2"/><path d="M'+(cx-6*s)+' '+(top-12)+' l'+6*s+' '+(-22*s)+' l'+6*s+' '+22*s+'z" fill="'+CAPC+'" stroke="'+CAPS+'" stroke-width="2"/>';
 return g}
function dropperArt(x,y,col,rot){return '<g transform="translate('+x+' '+y+') rotate('+(rot||0)+')"><rect x="-7" y="-70" width="14" height="70" rx="5" fill="rgba(232,244,250,.7)" stroke="'+GLS+'" stroke-width="2.5"/>'+(col?'<rect x="-4" y="-34" width="8" height="30" rx="3" fill="'+col+'"/>':'')+'<path d="M-4 0 L0 16 L4 0" fill="rgba(232,244,250,.8)" stroke="'+GLS+'" stroke-width="2"/><rect x="-11" y="-100" width="22" height="32" rx="10" fill="#E2573F" stroke="#A33A2A" stroke-width="2"/></g>'}
function dropFall(x,y0,y1,col,n,delay){return drops(x,y0,y1,col,n||1,delay||0)}

/* ───────── 실험 1: 사철나무잎 · 광학 현미경 ───────── */
function leafOutline(L,W,teeth){const P=[],n=teeth?30:16;for(let i=0;i<=n;i++){const t=i/n,w=W*Math.pow(Math.sin(Math.PI*t),.7)+(teeth&&i%2&&i>2&&i<n-1?2.6:0);P.push([w,-L*t])}
 const Q=P.slice().reverse().map(p=>[-p[0],p[1]]);return 'M'+P.concat(Q).map(p=>p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' L')+'Z'}
/* 사철나무잎(잎자루 끝이 x,y). o: back 뒷면 · nail 매니큐어 · dry 마름 · tape 셀로판테이프 */
function sleaf(x,y,s,rot,o){o=o||{};const col=o.back?'#86B45E':'#3F8A34',st='#2A5E22',vc=o.back?'#CFE3B5':'#2A6A24';
 let g='<g transform="translate('+x+' '+y+') rotate('+(rot||0)+') scale('+s+')"><path d="M0 22 V0" stroke="#5E7F33" stroke-width="6" stroke-linecap="round"/><path d="'+leafOutline(150,44,1)+'" fill="'+col+'" stroke="'+st+'" stroke-width="2.5" stroke-linejoin="round"/><path d="M0 0 V-146" stroke="'+vc+'" stroke-width="3"/>';
 [30,58,86,112].forEach((v,i)=>{const a=34-i*5;g+='<path d="M0 -'+v+' q'+(a*.6)+' -10 '+a+' -26 M0 -'+v+' q-'+(a*.6)+' -10 -'+a+' -26" stroke="'+vc+'" stroke-width="1.8" fill="none"/>'});
 if(o.nail)g+='<g'+(o.nailAnim?an('lb-a-fade',.4,'animation-duration:1.4s'):'')+'><ellipse cx="0" cy="-78" rx="25" ry="40" fill="#FFFFFF" fill-opacity="'+(o.dry?.3:.55)+'" stroke="#FFFFFF" stroke-opacity=".9" stroke-width="2"/>'+(o.dry?'':'<path d="M-12 -100 q6 -8 14 -10" stroke="#FFFFFF" stroke-width="3" fill="none" stroke-linecap="round"/>')+'</g>';
 if(o.tape)g+='<g'+(o.tapeAnim?an('lb-a-down',0,'--from:-70px'):'')+'><rect x="-34" y="-112" width="68" height="64" rx="3" fill="#FFF6C9" fill-opacity=".72" stroke="#C9B24A" stroke-width="2"/></g>';
 return g+'</g>'}
function nailArt(x,y,s){return '<g transform="translate('+x+' '+y+') scale('+(s||1)+')"><rect x="-22" y="-56" width="44" height="56" rx="10" fill="rgba(240,240,236,.8)" stroke="#9AA6AF" stroke-width="3"/><rect x="-18" y="-44" width="36" height="40" rx="7" fill="#F4F2EA"/><rect x="-10" y="-96" width="20" height="42" rx="4" fill="#3B4650"/></g>'}
function brushArt(x,y,rot){return '<g transform="translate('+x+' '+y+') rotate('+(rot||0)+')"><rect x="-10" y="-70" width="20" height="44" rx="4" fill="#3B4650"/><rect x="-2.5" y="-28" width="5" height="24" fill="#9AA6AF"/><path d="M-5 -4 h10 l-3 12 h-4z" fill="#F4F2EA" stroke="#C9CFD4"/></g>'}
function tapeRoll(x,y,s){return '<g transform="translate('+x+' '+y+') scale('+(s||1)+')"><circle r="36" fill="#FFF6C9" fill-opacity=".85" stroke="#C9B24A" stroke-width="3"/><circle r="20" fill="var(--w-label)" stroke="#C9B24A" stroke-width="3"/><path d="M30 18 L62 30" stroke="#C9B24A" stroke-width="10" stroke-linecap="round" opacity=".6"/></g>'}
/* 받침 유리(위에서 본 모습). spec: sach(셀로판테이프 표본) · onion(영구표본) */
function slideArt(x,y,o){o=o||{};const s=o.s||1;let g='<g transform="translate('+x+' '+y+') scale('+s+')"><rect x="-80" y="-26" width="160" height="52" rx="4" fill="rgba(214,236,248,.6)" stroke="#7F9BAB" stroke-width="2.5"/>';
 if(o.spec==='sach')g+='<rect x="-34" y="-22" width="68" height="44" rx="2" fill="#FFF6C9" fill-opacity=".8" stroke="#C9B24A" stroke-width="1.5"/><ellipse cx="0" cy="0" rx="22" ry="14" fill="#E3EDD3"/>';
 if(o.spec==='onion')g+='<rect x="-26" y="-20" width="52" height="40" rx="2" fill="#F2C7DA" stroke="#B5658C" stroke-width="1.5"/><rect x="48" y="-22" width="26" height="44" fill="#FFFFFF" stroke="#C9CFD4"/><path d="M53 -10 h16 M53 -2 h16 M53 6 h12" stroke="#9AA6AF" stroke-width="2"/>';
 return g+'</g>'}
/* 광학 현미경(옆모습). x = 렌즈 줄, b = 바닥.
   o: obj 가운데 대물렌즈 배율(4·10·40) · on 조명 · slide 표본 · up 0~1 재물대 높이 · lbl 이름표 · upFrom 재물대 움직임 · objAnim · onAnim · slideAnim */
const SCN={nose:215,stage0:130,lift:44};
const OBJC={4:['#D9443A',22],10:['#E8B23A',32],40:['#3D7DD0',42]};
function scopeArt(x,b,o){o=o||{};const up=o.up||0,sy=b-SCN.stage0-SCN.lift*up,ty=b-SCN.nose;let g=shadow(x+15,b+4,130);
 g+='<path d="M'+(x-100)+' '+b+' L'+(x-90)+' '+(b-34)+' H'+(x+120)+' L'+(x+130)+' '+b+'Z" fill="#E8EEF2" stroke="#5C6B74" stroke-width="3" stroke-linejoin="round"/>';
 g+='<circle cx="'+x+'" cy="'+(b-34)+'" r="13" fill="#C9D1D8" stroke="#5C6B74" stroke-width="2.5"/>';
 if(o.on)g+='<g'+(o.onAnim?an('lb-a-fade',0):'')+'><circle cx="'+x+'" cy="'+(b-34)+'" r="11" fill="#FFE27A"/><path d="M'+(x-9)+' '+(b-46)+' L'+(x-14)+' '+(sy+28)+' H'+(x+14)+' L'+(x+9)+' '+(b-46)+'Z" fill="#FFE27A" opacity=".5"/></g>';
 g+='<path d="M'+(x+70)+' '+(b-34)+' H'+(x+108)+' V'+(b-200)+' Q'+(x+108)+' '+(b-262)+' '+(x+54)+' '+(b-300)+' L'+(x+30)+' '+(b-272)+' Q'+(x+70)+' '+(b-246)+' '+(x+70)+' '+(b-200)+'Z" fill="#E8EEF2" stroke="#5C6B74" stroke-width="3" stroke-linejoin="round"/>';
 let st='<rect x="'+(x+50)+'" y="'+(sy+6)+'" width="30" height="22" fill="#9AA6AF" stroke="#5C6B74" stroke-width="2"/><rect x="'+(x-90)+'" y="'+sy+'" width="170" height="14" rx="3" fill="#3C4950" stroke="#22292E" stroke-width="2"/>';
 st+='<rect x="'+(x-24)+'" y="'+(sy+16)+'" width="48" height="12" rx="3" fill="#7E8B93" stroke="#3F4A50" stroke-width="2"/><path d="M'+(x+24)+' '+(sy+22)+' l16 4" stroke="#3F4A50" stroke-width="4" stroke-linecap="round"/>';
 if(o.slide)st+='<g'+(o.slideAnim?an('lb-a-down',0,'--from:-60px'):'')+'><rect x="'+(x-52)+'" y="'+(sy-5)+'" width="104" height="5" fill="rgba(200,230,245,.95)" stroke="#7F9BAB" stroke-width="1.5"/><rect x="'+(x-13)+'" y="'+(sy-8)+'" width="26" height="3" fill="'+(o.slide==='onion'?'#E7A9C4':'#E8E2A8')+'"/></g><path d="M'+(x-84)+' '+(sy-2)+' l24 -5 M'+(x+60)+' '+(sy-7)+' l22 5" stroke="#B9C2CA" stroke-width="3" stroke-linecap="round"/>';
 g+='<g'+(o.upFrom?an('lb-a-raise',0,'--from:'+o.upFrom+'px'):'')+'>'+st+'</g>';
 g+='<circle cx="'+(x+108)+'" cy="'+(b-150)+'" r="22" fill="#5C6B74" stroke="#22292E" stroke-width="2"/><circle cx="'+(x+108)+'" cy="'+(b-150)+'" r="9" fill="#9AA7AF"/><circle cx="'+(x+108)+'" cy="'+(b-102)+'" r="12" fill="#8C99A1" stroke="#22292E" stroke-width="2"/>';
 g+='<rect x="'+(x-16)+'" y="'+(b-330)+'" width="32" height="'+(330-SCN.nose-6)+'" fill="#E8EEF2" stroke="#5C6B74" stroke-width="3"/>';
 g+='<g transform="translate('+x+' '+(b-326)+') rotate(-28)"><rect x="-13" y="-58" width="26" height="60" fill="#CFD8DE" stroke="#5C6B74" stroke-width="3"/><rect x="-17" y="-72" width="34" height="18" rx="4" fill="#3C4950" stroke="#22292E" stroke-width="2"/></g>';
 const mid=o.obj||40,others=[4,10,40].filter(m=>m!==mid);
 const obj=(m,dx,rot)=>{const [c,len]=OBJC[m];return '<g transform="translate('+(x+dx)+' '+(ty+6)+') rotate('+rot+')"><rect x="-8" y="0" width="16" height="'+len+'" rx="3" fill="#CFD8DE" stroke="#5C6B74" stroke-width="2"/><rect x="-8" y="'+(len*.4).toFixed(1)+'" width="16" height="5" fill="'+c+'"/></g>'};
 g+='<g'+(o.objAnim?an('lb-a-fade',0):'')+'>'+obj(others[0],-30,22)+obj(others[1],30,-22)+obj(mid,0,0)+'</g>';
 g+='<ellipse cx="'+x+'" cy="'+ty+'" rx="44" ry="12" fill="#B8C4CB" stroke="#5C6B74" stroke-width="3"/>';
 if(o.lbl&&!NAR){const L=(px,py,lx,ly,t)=>'<path d="M'+px+' '+py+' L'+lx+' '+ly+'" stroke="#5C6B74" stroke-width="1.8"/>'+mini(lx,ly,t,18);
  g+=L(x-30,b-376,x-150,b-366,'접안렌즈')+L(x-40,ty,x-160,ty-30,'회전판')+L(x-8,ty+30,x-160,ty+12,'대물렌즈')+L(x-86,sy+7,x-170,sy-2,'재물대')+L(x-20,sy+24,x-160,sy+46,'조리개')+L(x-12,b-34,x-160,b-30,'조명')+L(x+128,b-160,x+210,b-182,'조동 나사')+L(x+118,b-100,x+210,b-80,'미동 나사')}
 return g}
/* 접안렌즈로 본 모습 — 세포 무늬(패턴). kind: sach · onion · null(아직 안 보임) */
function cellTile(kind,sw){
 if(kind==='sach'){const T=240,n=4,gs=T/n,J=(i,j,s)=>(rnd(((i%n+n)%n)*7+((j%n+n)%n)*13+3,s)-.5)*gs*.4,pt=(i,j)=>[i*gs+J(i,j,1),j*gs+J(i,j,2)];
  let p='<rect width="'+T+'" height="'+T+'" fill="#EEF3E6"/>';
  for(let j=-1;j<=n;j++)for(let i=-1;i<=n;i++){const a=pt(i,j),b=pt(i+1,j),c=pt(i+1,j+1),d=pt(i,j+1);p+='<polygon points="'+[a,b,c,d].map(q=>q[0].toFixed(1)+','+q[1].toFixed(1)).join(' ')+'" fill="#EEF3E6" stroke="#5F7050" stroke-width="'+sw+'"/>'}
  [[64,92,20],[184,186,-35]].forEach(([x,y,r])=>{p+='<g transform="translate('+x+' '+y+') rotate('+r+')"><ellipse rx="19" ry="25" fill="#EEF3E6" stroke="#5F7050" stroke-width="'+(sw*.8)+'"/><path d="M-2 -19 C-17 -17 -17 17 -2 19 C-6 6 -6 -6 -2 -19Z" fill="#D6E6C0" stroke="#4F6140" stroke-width="'+(sw*.8)+'"/><path d="M2 -19 C17 -17 17 17 2 19 C6 6 6 -6 2 -19Z" fill="#D6E6C0" stroke="#4F6140" stroke-width="'+(sw*.8)+'"/></g>'});
  return [p,T,T]}
 const W=120,H=40,T=240;let p='<rect width="'+T+'" height="80" fill="#F6DBE8"/>';
 for(let r=0;r<2;r++)for(let c=-1;c<3;c++){const x=c*W+(r?W/2:0),y=r*H;p+='<rect x="'+x+'" y="'+y+'" width="'+W+'" height="'+H+'" fill="#F6DBE8" stroke="#8C3A6B" stroke-width="'+sw+'"/><ellipse cx="'+(x+W*(.3+.4*rnd(c+r*5,4))).toFixed(1)+'" cy="'+(y+H*(.35+.3*rnd(c+r*5,6))).toFixed(1)+'" rx="7" ry="8" fill="#A3245E"/>'}
 return [p,T,80]}
function eyeView(cx,cy,R,kind,o){o=o||{};let g='<circle cx="'+cx+'" cy="'+cy+'" r="'+(R+16)+'" fill="#1D2326"/>';
 if(!kind)return g+'<circle cx="'+cx+'" cy="'+cy+'" r="'+R+'" fill="#2A3138"/>';
 const pid=uid('P'),cid=uid('C'),fid=uid('F'),sc=o.mag===400?1:.1,[tile,tw,th]=cellTile(kind,sc<1?7:2.6);
 g+='<defs><pattern id="'+pid+'" width="'+tw+'" height="'+th+'" patternUnits="userSpaceOnUse" patternTransform="translate('+cx+' '+cy+') scale('+sc+')">'+tile+'</pattern>'+(o.blur?'<filter id="'+fid+'" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="'+o.blur+'"/></filter>':'')+'<clipPath id="'+cid+'"><circle cx="'+cx+'" cy="'+cy+'" r="'+R+'"/></clipPath></defs>';
 g+='<g clip-path="url(#'+cid+')"'+(o.anim?an('lb-a-fade',0,'animation-duration:1s'):'')+'><rect x="'+(cx-R-30)+'" y="'+(cy-R-30)+'" width="'+(2*R+60)+'" height="'+(2*R+60)+'" fill="url(#'+pid+')"'+(o.blur?' filter="url(#'+fid+')"':'')+'/></g>';
 return g+'<circle cx="'+cx+'" cy="'+cy+'" r="'+R+'" fill="none" stroke="#000000" stroke-width="5"/>'}
/* 현미경 다루기 상태(이미 한 차례 수 k → 모습) */
function scopeState(k){return {obj:k>=1&&k<6?4:40,on:k>=2,slide:k>=2?'sach':null,up:k<3?0:k===3?1:k<6?.8:.7,view:k>=4,blur:k===4?6:0,mag:k>=6?400:40}}
function e1ScopeScene(k,anim,kind,lbl){const S=scopeState(k);let g=bg({});const X=250;
 const o={obj:S.obj,on:S.on,slide:S.on?kind:null,up:S.up,lbl};
 if(anim===1)o.objAnim=1;if(anim===2){o.onAnim=1;o.slideAnim=1}if(anim===3)o.upFrom=SCN.lift;if(anim===4)o.upFrom=-SCN.lift*.2;if(anim===6){o.objAnim=1;o.upFrom=-SCN.lift*.1}
 g+=scopeArt(X,BY,o);
 if(k===3)g+=eyeArt(X-150,BY-SCN.stage0-SCN.lift-2);
 if(k>=4)g+='<g'+(anim===4?an('lb-a-fade',0):'')+'>'+eyeArt(X-62,BY-398)+'</g>';
 const VX=700,VY=236,VR=176;
 g+=eyeView(VX,VY,VR,S.view?kind:null,{mag:S.mag,blur:S.blur,anim:anim===4||anim===5||anim===6});
 g+=mini(VX,VY+VR+44,S.view?'접안렌즈로 본 모습':'아직 보이지 않아요',18);
 if(k>=1&&!NAR)g+=mini(VX,VY-VR-30,'접안렌즈 10배 · 대물렌즈 '+S.obj+'배',18);else if(k>=1)LEG.push([null,'접안렌즈 10배 · 대물렌즈 '+S.obj+'배']);
 return g}

/* ───────── 실험 2: 파 · 눈금실린더 ───────── */
function fibrous(x,y,n,len,col,w,seed){let s='';for(let i=0;i<n;i++){const a=(i/(n-1)-.5)*1.9+Math.sin(i*7.3+seed)*.12,L=len*(.75+.25*Math.abs(Math.sin(i*3.1+seed)));
 const x2=x+Math.sin(a)*L,y2=y+Math.cos(a)*L*.95,cx=x+Math.sin(a+.25*Math.sin(i+seed))*L*.5,cy=y+Math.cos(a)*L*.55;
 s+='<path d="M'+(x+(i-n/2)*1.4).toFixed(1)+' '+y+' Q'+cx.toFixed(1)+' '+cy.toFixed(1)+' '+x2.toFixed(1)+' '+y2.toFixed(1)+'" fill="none" stroke="'+col+'" stroke-width="'+w+'" stroke-linecap="round"/>'}return s}
/* 파(흰 밑동 아래가 x,y). o: roots false면 뿌리 자름 · leaf 잎 길이 · cut 잎 자름 */
function greenOnion(x,y,o){o=o||{};let s='';
 if(o.roots!==false)s+=fibrous(x,y,o.n||18,o.rl||74,'#F4EFE2',o.rw||2.8,o.seed||1)+fibrous(x,y,o.n||18,o.rl||74,'#B9AE8E',.8,o.seed||1);
 else s+='<rect x="'+(x-10)+'" y="'+(y-2)+'" width="20" height="6" rx="2" fill="#E7E1CF" stroke="#B3AB92"/>';
 const lh=o.leaf||170;s+='<path d="M'+(x-10)+' '+y+' L'+(x-9)+' '+(y-64)+' L'+(x+9)+' '+(y-64)+' L'+(x+10)+' '+y+'Z" fill="#FBF8EE" stroke="#C9C2A8" stroke-width="2"/>';
 [[-6,-.10],[0,.02],[6,.12],[-2,-.04]].forEach(([dx,a],i)=>{const L=lh*(i===1?1:.85);s+='<path d="M'+(x+dx)+' '+(y-62)+' q'+(a*L*.6).toFixed(1)+' '+(-L*.5).toFixed(1)+' '+(a*L).toFixed(1)+' '+(-L)+'" fill="none" stroke="#4F9D3A" stroke-width="'+(o.cut?8:7)+'" stroke-linecap="'+(o.cut?'butt':'round')+'"/>'});
 return s}
const CYL={A:350,B:610,top:BY-276,L0:BY-226,dA:12,dB:70};
function cylArt(cx,b,o){o=o||{};const top=b-276,w=36;let g=shadow(cx,b+4,58)+'<rect x="'+(cx-54)+'" y="'+(b-10)+'" width="108" height="12" rx="4" fill="#DCEAF2" stroke="'+GLS+'" stroke-width="2.5"/>';
 g+='<rect x="'+(cx-w)+'" y="'+top+'" width="'+2*w+'" height="'+(b-10-top)+'" rx="6" fill="rgba(232,244,250,.45)"/>';
 if(o.lv)g+='<rect x="'+(cx-w+3)+'" y="'+o.lv.toFixed(1)+'" width="'+(2*w-6)+'" height="'+(b-13-o.lv).toFixed(1)+'" fill="'+WC+'" fill-opacity=".85"/><path d="M'+(cx-w+3)+' '+o.lv.toFixed(1)+' H'+(cx+w-3)+'" stroke="'+WS+'" stroke-width="3"/>';
 if(o.inner)g+=o.inner;
 g+='<rect x="'+(cx-w)+'" y="'+top+'" width="'+2*w+'" height="'+(b-10-top)+'" rx="6" fill="none" stroke="'+GLS+'" stroke-width="3"/>';
 for(let y=top+24,i=0;y<b-16;y+=12,i++)g+='<path d="M'+(cx+w)+' '+y+' h'+(i%5?-9:-18)+'" stroke="#4D7A96" stroke-width="1.6"/>';
 if(o.mark)g+='<g'+(o.markAnim?an('lb-a-fade',0):'')+'><path d="M'+(cx-w-8)+' '+o.mark+' h'+(2*w+16)+'" stroke="#D2312A" stroke-width="3.5"/></g>';
 return g}
/* 탈지면으로 감싼 파를 넣은 모습 */
function onionInCyl(cx,roots,anim){const y=CYL.L0+26;return '<g'+(anim?an('lb-a-down',0,'--from:-120px'):'')+'>'+greenOnion(cx,y,{roots,cut:1,leaf:58,n:14,rl:60,seed:roots?5:3})+'<path d="M'+(cx-40)+' '+(CYL.top+8)+' q10 -18 20 -6 q10 -16 20 -2 q10 -14 20 0 q12 -8 20 6 q-6 14 -40 14 q-34 0 -40 -12z" fill="#FFFFFF" stroke="#C9CFD4" stroke-width="2"/></g>'}
function blackPaper(x,y,w,h){return '<path d="M'+(x+20)+' '+y+' H'+(x+w)+' L'+(x+w-20)+' '+(y+h)+' H'+x+'Z" fill="#1E2124" stroke="#000000" stroke-width="2"/>'}

/* ───────── 실험 3: 백합 · 줄기 단면 ───────── */
/* 백합(줄기 아래가 x,y). r 붉게 물든 정도 0~1 */
function lily(x,y,h,r){const stemC=mixc('#4F9D3A','#8A3A4A',r*.35),leafC=mixc('#5AA046','#6D5A3A',r*.25),petal=mixc('#FBFBF6','#F2A3B3',r);
 let s='<path d="M'+x+' '+y+' V'+(y-h)+'" stroke="'+stemC+'" stroke-width="8" stroke-linecap="round"/>';
 if(r>0)s+='<path d="M'+x+' '+y+' V'+(y-h)+'" stroke="#D23A52" stroke-width="2.2" opacity="'+(.75*r).toFixed(2)+'"/>';
 for(let i=0;i<9;i++){const yy=y-h*(.12+i*.085),d=i%2?1:-1,L=40-i*1.6;s+='<path d="M'+x+' '+yy.toFixed(1)+' q'+(d*L*.5).toFixed(1)+' '+(-L*.1).toFixed(1)+' '+(d*L).toFixed(1)+' '+(-L*.55).toFixed(1)+' q'+(-d*L*.6).toFixed(1)+' '+(L*.05).toFixed(1)+' '+(-d*L).toFixed(1)+' '+(L*.55).toFixed(1)+'z" fill="'+leafC+'" stroke="#3D7A2E" stroke-width="1.5"/>';
  if(r>0)s+='<path d="M'+x+' '+yy.toFixed(1)+' q'+(d*L*.5).toFixed(1)+' '+(-L*.15).toFixed(1)+' '+(d*L*.95).toFixed(1)+' '+(-L*.52).toFixed(1)+'" stroke="#D23A52" stroke-width="1.4" fill="none" opacity="'+(r*.9).toFixed(2)+'"/>'}
 [[-1,0],[1,10]].forEach(([d,o])=>{const fx=x+d*38,fy=y-h-4+o;s+='<path d="M'+x+' '+(y-h+20)+' Q'+(x+d*12)+' '+(y-h)+' '+(fx-d*8)+' '+(fy+6)+'" stroke="'+stemC+'" stroke-width="4" fill="none"/>';
  s+='<g transform="translate('+fx+' '+fy+') rotate('+(d*30)+') scale(1.25)">'+[-50,-25,0,25,50].map(a=>'<path d="M0 4 C'+(a*.3-9)+' -18 '+(a-13)+' -46 '+a+' -62 C'+(a+13)+' -46 '+(a*.3+9)+' -18 0 4Z" fill="'+petal+'" stroke="#BDB6A2" stroke-width="1.6"/><path d="M0 2 Q'+(a*.4)+' -26 '+(a*.92)+' -56" stroke="'+(r>0?'#C4314C':'#D8D2BE')+'" stroke-width="'+(r>0?1.6:1.1)+'" fill="none"'+(r>0?' opacity="'+r.toFixed(2)+'"':'')+'/>').join('')+'<path d="M0 0 l-8 -44 M0 0 l8 -44 M0 0 l-2 -50 M0 0 l3 -46" stroke="#B6C46A" stroke-width="2"/><circle cx="-8" cy="-45" r="3.4" fill="#C8742A"/><circle cx="8" cy="-45" r="3.4" fill="#C8742A"/><circle cx="3" cy="-47" r="3.4" fill="#C8742A"/></g>'});
 return s}
const SDOTS=(()=>{const a=[];for(let i=0;i<46;i++){const ang=i*2.399,rr=Math.sqrt((i+.5)/46)*58;a.push([Math.cos(ang)*rr,Math.sin(ang)*rr])}return a})();
function crossView(x,y,red,anim){const c=red?'#C4314C':'#FFFFFF',st=red?'#8A1F33':'#AFC0A0';let g='<g transform="translate('+x+' '+y+')"'+(anim?an('lb-a-pop',0):'')+'><circle r="66" fill="#BFE0A2" stroke="#3D7A2E" stroke-width="4"/>';SDOTS.forEach(([a,b])=>{g+='<circle cx="'+a.toFixed(1)+'" cy="'+b.toFixed(1)+'" r="4" fill="'+c+'" stroke="'+st+'" stroke-width="1"/>'});return g+'</g>'}
function longView(x,y,red,anim){const c=red?'#C4314C':'#FFFFFF';let g='<g transform="translate('+x+' '+y+')"'+(anim?an('lb-a-pop',0):'')+'><rect x="-50" y="-80" width="100" height="160" rx="6" fill="#BFE0A2" stroke="#3D7A2E" stroke-width="4"/>';[-36,-20,-6,8,22,38].forEach(a=>{g+='<path d="M'+a+' -78 V78" stroke="'+c+'" stroke-width="4"/>'+(red?'':'<path d="M'+a+' -78 V78" stroke="#AFC0A0" stroke-width="1" opacity=".6"/>')});return g+'</g>'}
function knifeArt(x,y,rot){return '<g transform="translate('+x+' '+y+') rotate('+(rot||0)+')"><path d="M-4 0 V-64 h8 V0z" fill="#B9C2CA" stroke="#4A555C" stroke-width="2"/><rect x="-7" y="-98" width="14" height="36" rx="4" fill="#D9443A" stroke="#8A2A22" stroke-width="2"/></g>'}
function glassPlate(x,y,w){return '<path d="M'+(x+16)+' '+(y-24)+' H'+(x+w)+' L'+(x+w-16)+' '+y+' H'+x+'Z" fill="rgba(214,236,248,.55)" stroke="#8FB5C9" stroke-width="2.5"/>'}
/* 줄기 자르기 장면: kind A 가로 · B 세로 */
function stemCut(red,seenA,seenB,goA,goB){let g=glassPlate(90,BY-6,330)+'<rect x="130" y="'+(BY-40)+'" width="250" height="16" rx="8" fill="'+(red?'#7D8A3A':'#4F9D3A')+'"/>';
 if(goA)g+='<g'+an('lb-a-down',0,'--from:-70px')+'>'+knifeArt(250,BY-40,0)+'</g>';
 if(goB)g+='<g'+an('lb-a-slide',0,'--dx:-160px')+'>'+knifeArt(330,BY-34,90)+'</g>';
 if(!goA&&!goB&&!seenA&&!seenB)g+=knifeArt(440,BY-20,-30);
 const SC=(x,y,inner)=>'<g transform="translate('+x+' '+y+') scale(1.45) translate('+(-x)+' '+(-y)+')">'+inner+'</g>';
 g+=SC(570,220,seenA?crossView(570,220,red,goA):'<circle cx="570" cy="220" r="66" fill="none" stroke="var(--w-felt-s)" stroke-width="3" stroke-dasharray="8 6"/>')+mini(570,350,'가로 단면',20);
 g+=SC(800,220,seenB?longView(800,220,red,goB):'<rect x="750" y="140" width="100" height="160" rx="6" fill="none" stroke="var(--w-felt-s)" stroke-width="3" stroke-dasharray="8 6"/>')+mini(800,350,'세로 단면',20);
 return g}
function flaskArt(x,b,col,o){o=o||{};return shadow(x,b+4,70)+'<path d="M'+(x-18)+' '+(b-150)+' v52 l-56 86 q-6 12 8 12 h132 q14 0 8 -12 l-56 -86 v-52z" fill="rgba(232,244,250,.45)" stroke="'+GLS+'" stroke-width="3"/>'+
 (col?'<g'+(o.colAnim?an('lb-a-fade',.6,'animation-duration:1.2s'):'')+'><path d="M'+(x-48)+' '+(b-46)+' l-20 32 q-4 8 6 8 h124 q10 0 6 -8 l-20 -32z" fill="'+col+'" fill-opacity=".88"/></g>':'')+
 (o.base?'<path d="M'+(x-48)+' '+(b-46)+' l-20 32 q-4 8 6 8 h124 q10 0 6 -8 l-20 -32z" fill="'+o.base+'" fill-opacity=".8"/>':'')}

/* ───────── 실험 4: 화분 · 잎 · 비커 · 시험관 ───────── */
function leafShape(col,st,vein){return '<path d="M0 -40 C38 -60 44 -120 0 -170 C-44 -120 -38 -60 0 -40Z" fill="'+col+'" stroke="'+st+'" stroke-width="3"/><path d="M0 -40 V-166" stroke="'+vein+'" stroke-width="2.5"/>'+[[-60,26,26],[-85,25,24],[-110,19,20],[-135,10,14]].map(([v,a,b])=>'<path d="M0 '+v+' q'+a*.7+' '+(-b*.4)+' '+a+' '+(-b)+' M0 '+v+' q'+(-a*.7)+' '+(-b*.4)+' '+(-a)+' '+(-b)+'" stroke="'+vein+'" stroke-width="1.6" fill="none"/>').join('')}
const FOILC='#CFD5DA';
function foilOver(anim){return '<g'+(anim?an('lb-a-fade',.2,'animation-duration:1s'):'')+'><path d="M0 -34 C46 -58 52 -124 0 -178 C-52 -124 -46 -58 0 -34Z" fill="'+FOILC+'" stroke="#8A949B" stroke-width="3"/><path d="M-22 -80 l30 -20 M-16 -124 l26 -16 M-8 -60 l20 -8" stroke="#FFFFFF" stroke-width="4"/></g>'}
const PLV=[[-1,128,-58],[1,152,56],[-1,184,-40],[1,206,38],[0,236,0]];
/* 화분 식물. o: foil 포일 씌운 잎(번호) · foilAnim · paper 잎 뒷면 종이 색(번호 1) · gone 딴 잎 목록 */
function potPlant(x,b,o){o=o||{};let g=shadow(x,b+4,64)+'<path d="M'+(x-52)+' '+(b-70)+' H'+(x+52)+' L'+(x+40)+' '+b+' H'+(x-40)+'Z" fill="var(--w-pot)" stroke="var(--w-pot2)" stroke-width="3"/><rect x="'+(x-58)+'" y="'+(b-84)+'" width="116" height="16" rx="4" fill="var(--w-pot)" stroke="var(--w-pot2)" stroke-width="3"/><ellipse cx="'+x+'" cy="'+(b-82)+'" rx="50" ry="6" fill="var(--w-soil)"/>';
 g+='<path d="M'+x+' '+(b-82)+' V'+(b-238)+'" stroke="#4F8A2E" stroke-width="8" stroke-linecap="round"/>';
 PLV.forEach(([d,dy,rot],i)=>{if(o.gone&&o.gone.indexOf(i)>=0){g+='<circle cx="'+(x+d*4)+'" cy="'+(b-dy)+'" r="3" fill="#4F8A2E"/>';return}
  g+='<g transform="translate('+(x+d*4)+' '+(b-dy)+') rotate('+rot+') scale(.5)">'+leafShape('#6AB34E','#2C6A2A','#2F6B2A')+'<path d="M0 0 V-42" stroke="#4F8A2E" stroke-width="8"/>'+(o.foil===i?foilOver(o.foilAnim):'')+'</g>';
  if(o.paper!=null&&i===1)g+='<g transform="translate('+(x+4)+' '+(b-dy)+') rotate('+rot+') scale(.5)"><g'+(o.paperAnim?an('lb-a-fade',.3):'')+'><rect x="-34" y="-132" width="68" height="50" fill="'+o.paper+'" stroke="#FFFFFF" stroke-width="3"/><path d="M-42 -126 h84 M-42 -88 h84" stroke="#FFF6C9" stroke-width="6" opacity=".8"/></g></g>'});
 return g}
/* 딴 잎 하나(잎자루 끝 x,y). col 잎 색 · stalk 잎자루 길이 */
function leafFlat(x,y,rot,col,stalk,s){return '<g transform="translate('+x+' '+y+') rotate('+rot+') scale('+(s||.55)+')">'+leafShape(col,'#55724A','#55724A')+'<path d="M0 '+(-40+stalk)+' V-40" stroke="#55724A" stroke-width="7" stroke-linecap="round"/></g>'}
const LG='#6AB34E',LPALE='#DCE7BD',LBLUE='#27306B';
function beakerBig(cx,b,col,o){o=o||{};const w=110,h=200,top=b-h;let g=shadow(cx,b+4,w+8);
 g+='<path d="M'+(cx-w)+' '+top+' V'+(b-12)+' Q'+(cx-w)+' '+b+' '+(cx-w+12)+' '+b+' H'+(cx+w-12)+' Q'+(cx+w)+' '+b+' '+(cx+w)+' '+(b-12)+' V'+top+'" fill="rgba(232,244,250,.45)"/>';
 if(col)g+='<path d="M'+(cx-w+3)+' '+(top+62)+' H'+(cx+w-3)+' V'+(b-12)+' Q'+(cx+w-3)+' '+(b-3)+' '+(cx+w-12)+' '+(b-3)+' H'+(cx-w+12)+' Q'+(cx-w+3)+' '+(b-3)+' '+(cx-w+3)+' '+(b-12)+'Z" fill="'+col+'" fill-opacity=".8"/>';
 if(o.inner)g+=o.inner;
 g+='<path d="M'+(cx-w)+' '+top+' V'+(b-12)+' Q'+(cx-w)+' '+b+' '+(cx-w+12)+' '+b+' H'+(cx+w-12)+' Q'+(cx+w)+' '+b+' '+(cx+w)+' '+(b-12)+' V'+top+'" fill="none" stroke="'+GLS+'" stroke-width="3.5"/><path d="M'+(cx-w-10)+' '+top+' h14" stroke="'+GLS+'" stroke-width="3.5"/>';
 if(o.steam)for(let k=0;k<3;k++)g+='<path d="M'+(cx-36+k*36)+' '+(top+40)+' q-8 -14 0 -28 q8 -14 0 -28" fill="none" stroke="#E2A3A3" stroke-width="3" stroke-linecap="round"/>';
 return g}
function tubeArt(x,y,rot,liq,inner,o){o=o||{};return '<g transform="translate('+x+' '+y+') rotate('+rot+')"><rect x="-18" y="0" width="36" height="170" rx="18" fill="rgba(244,251,255,.6)"/>'+(liq?'<rect x="-15" y="50" width="30" height="117" rx="15" fill="'+liq+'" fill-opacity=".85"/>':'')+(o.over?'<g'+an('lb-a-fade',.4,'animation-duration:1.8s')+'><rect x="-15" y="50" width="30" height="117" rx="15" fill="'+o.over+'" fill-opacity=".85"/></g>':'')+(inner||'')+'<rect x="-18" y="0" width="36" height="170" rx="18" fill="none" stroke="#7AA7C4" stroke-width="3"/></g>'}
/* 페트리 접시(비스듬히 본 모습) */
function dishArt(cx,cy,rx,inner){return '<ellipse cx="'+cx+'" cy="'+(cy+6)+'" rx="'+(rx+4)+'" ry="'+(rx*.3+4)+'" fill="var(--w-shadow)"/><ellipse cx="'+cx+'" cy="'+cy+'" rx="'+rx+'" ry="'+(rx*.3)+'" fill="rgba(238,248,255,.85)" stroke="#7AA7C4" stroke-width="3"/>'+(inner||'')+'<ellipse cx="'+cx+'" cy="'+(cy-3)+'" rx="'+(rx-6)+'" ry="'+(rx*.3-4)+'" fill="none" stroke="#BFD6E4" stroke-width="1.5"/>'}

/* ───────── 실험 5: 염화 코발트 종이 ───────── */
const CBLUE='#3D6FD1',CPINK='#E0607A';
function cobaltPaper(x,y,w,h,col,o){o=o||{};return '<g transform="translate('+x+' '+y+')"><rect x="'+(-w/2)+'" y="'+(-h/2)+'" width="'+w+'" height="'+h+'" fill="'+CBLUE+'" stroke="#2B4F99" stroke-width="2"/>'+(col?'<g'+(o.anim?an('lb-a-fade',o.delay||.6,'animation-duration:1.6s'):'')+'><rect x="'+(-w/2)+'" y="'+(-h/2)+'" width="'+w+'" height="'+h+'" fill="'+col+'"/></g>':'')+(o.spot?'<g'+an('lb-a-grow',o.delay||.7,'animation-duration:1.2s')+'><ellipse rx="'+o.spot+'" ry="'+(o.spot*.75)+'" fill="'+CPINK+'"/></g>':'')+(o.tape?'<path d="M'+(-w/2-10)+' '+(-h/2+5)+' h'+(w+20)+' M'+(-w/2-10)+' '+(h/2-5)+' h'+(w+20)+'" stroke="#FFF6C9" stroke-width="9" opacity=".85"/>':'')+'</g>'}
/* 비닐봉지를 씌운 봉선화(잎 수 n) · drops 물방울 수 */
function balsam(x,b,n,dropsN){let g=shadow(x,b+4,46)+'<path d="M'+(x-36)+' '+(b-50)+' H'+(x+36)+' L'+(x+28)+' '+b+' H'+(x-28)+'Z" fill="var(--w-pot)" stroke="var(--w-pot2)" stroke-width="3"/>';
 g+='<path d="M'+x+' '+(b-50)+' V'+(b-210)+'" stroke="#7FB24D" stroke-width="7"/>';for(let i=0;i<8;i++){const yy=b-80-i*16,d=i%2?1:-1;
  if(i<n)g+='<path d="M'+x+' '+yy+' q'+(d*30)+' -6 '+(d*48)+' -26 q'+(-d*26)+' 2 '+(-d*48)+' 26z" fill="#5AA046" stroke="#3D7A2E" stroke-width="1.5"/>';else g+='<circle cx="'+(x+d*3)+'" cy="'+yy+'" r="2.5" fill="#3D7A2E"/>'}
 g+='<path d="M'+(x-82)+' '+(b-46)+' Q'+(x-92)+' '+(b-240)+' '+x+' '+(b-252)+' Q'+(x+92)+' '+(b-240)+' '+(x+82)+' '+(b-46)+'" fill="#FFFFFF" fill-opacity=".22" stroke="#9AA7AF" stroke-width="2.5" stroke-dasharray="7 5"/>';
 for(let k=0;k<(dropsN||0);k++){const a=(k+.5)/dropsN*Math.PI;g+='<circle cx="'+(x+Math.cos(a)*76).toFixed(1)+'" cy="'+(b-130-Math.sin(a)*110).toFixed(1)+'" r="5" fill="#9FD3F5" stroke="#4E8FC0" stroke-width="1.5"/>'}
 return g}

/* ───────── 실험 6: 달맞이꽃 ───────── */
const PETAL='M0 -14 C40 -22 82 -70 52 -112 C32 -130 8 -120 0 -106 C-8 -120 -32 -130 -52 -112 C-82 -70 -40 -22 0 -14Z';
function sepalP(L){return '<path d="M-9 -16 Q-4 '+(-L*.7)+' 0 '+(-L)+' Q4 '+(-L*.7)+' 9 -16Z" fill="#7CB85A" stroke="#3D7A2E" stroke-width="2"/><path d="M0 -20 V'+(-L+8)+'" stroke="#B5463A" stroke-width="1.5" opacity=".6"/>'}
function petalP(){return '<path d="'+PETAL+'" fill="#FFE14A" stroke="#C9A300" stroke-width="2.2"/><path d="M0 -16 V-96 M0 -40 q20 -16 30 -40 M0 -40 q-20 -16 -30 -40" stroke="#E8C21A" stroke-width="1.6" fill="none"/>'}
function stamenP(L){return '<path d="M0 -8 V'+(-L)+'" stroke="#E8D27A" stroke-width="3" stroke-linecap="round"/><ellipse cx="0" cy="'+(-L-8)+'" rx="5" ry="11" fill="#F2C230" stroke="#B88A10" stroke-width="1.5"/>'}
function stigmaP(s){s=s||1;return [0,90,180,270].map(a=>'<g transform="rotate('+a+')"><ellipse cx="0" cy="'+(-14*s)+'" rx="'+(4.5*s)+'" ry="'+(13*s)+'" fill="#F6F0C8" stroke="#C9B24A" stroke-width="1.8"/></g>').join('')+'<circle r="'+(6*s)+'" fill="#EFE6B0" stroke="#C9B24A" stroke-width="1.5"/>'}
/* 위에서 본 달맞이꽃. o: S P T A = 남아 있는지(기본 모두 있음) */
function primrose(cx,cy,s,o){o=o||{};const has=k=>o[k]!==false;let g='<g transform="translate('+cx+' '+cy+') scale('+s+')">';
 if(has('S'))[45,135,225,315].forEach(a=>{g+='<g transform="rotate('+a+')">'+sepalP(150)+'</g>'});
 if(has('P'))[0,90,180,270].forEach(a=>{g+='<g transform="rotate('+a+')">'+petalP()+'</g>'});
 if(has('T'))for(let i=0;i<8;i++)g+='<g transform="rotate('+(22.5+i*45)+')">'+stamenP(40)+'</g>';
 if(has('A'))g+='<g>'+stigmaP(1)+'</g>';else g+='<circle r="9" fill="#C9D18A" stroke="#8A9A3A" stroke-width="2"/>';
 return g+'</g>'}
/* 흰 종이 위에 놓은 부분. got = {S,P,T,A} 옮겼는지, anim = 지금 옮기는 종류 */
const PPX={S:545,P:655,T:775,A:880};
function paperParts(got,anim){let g='<rect x="478" y="66" width="450" height="340" rx="6" fill="#FFFFFF" stroke="#C9CFD4" stroke-width="2.5"/>';
 const col=(k,inner)=>got[k]?'<g'+(anim===k?an('lb-a-fade',.2,'animation-duration:.9s'):'')+'>'+inner+'</g>':'';
 let S='';[[0,0],[1,0],[0,1],[1,1]].forEach(([c,r])=>{S+='<g transform="translate('+(PPX.S-24+c*48)+' '+(245+r*130)+') scale(.72)">'+sepalP(150)+'</g>'});
 let P='';[[0,0],[1,0],[0,1],[1,1]].forEach(([c,r])=>{P+='<g transform="translate('+(PPX.P-28+c*56)+' '+(196+r*130)+') scale(.48)">'+petalP()+'</g>'});
 let T='';for(let i=0;i<8;i++){const c=i%4,r=Math.floor(i/4);T+='<g transform="translate('+(PPX.T-36+c*24)+' '+(230+r*130)+') scale(1.2)">'+stamenP(40)+'</g>'}
 let A='<g transform="translate('+PPX.A+' 160)"><path d="M0 10 V170" stroke="#E6DDA0" stroke-width="4"/><path d="M-6 170 h12 v50 h-12z" fill="#9CC56B" stroke="#5E8A2E" stroke-width="2"/>'+stigmaP(.8)+'</g>';
 g+=col('S',S)+col('P',P)+col('T',T)+col('A',A);
 [['S','꽃받침'],['P','꽃잎'],['T','수술'],['A','암술']].forEach(([k,t])=>{if(got[k])g+=mini(PPX[k],96,t,17)});
 return g}
/* 돋보기로 본 부분(확대 창 안 그림) */
function partZoom(k){
 if(k==='vA')return '<path d="M0 30 V140" stroke="#E6DDA0" stroke-width="10"/><g transform="translate(0 0) scale(3.2)">'+stigmaP(1)+'</g>';
 if(k==='vT')return '<g transform="translate(0 110) scale(3)">'+stamenP(36)+'</g>'+[[-10,-40],[8,-52],[14,-30],[-14,-60],[4,-70]].map(([x,y])=>'<circle cx="'+x+'" cy="'+y+'" r="3" fill="#F7E07A"/>').join('');
 if(k==='vP')return [[-60,-40],[60,-40],[-60,90],[60,90]].map(([x,y])=>'<g transform="translate('+x+' '+y+') scale(.55)">'+petalP()+'</g>').join('');
 /* 옆에서 본 꽃: 꽃잎 아래 꽃받침이 두 개씩 합쳐져 뒤로 젖혀짐 */
 return '<path d="M0 30 V160" stroke="#7FB24D" stroke-width="12"/><ellipse cx="0" cy="20" rx="18" ry="12" fill="#8CC06A" stroke="#3D7A2E" stroke-width="2"/>'+
  [-1,1].map(d=>'<path d="M'+(d*6)+' 12 Q'+(d*70)+' -30 '+(d*110)+' -110 Q'+(d*40)+' -60 '+(d*4)+' 0Z" fill="#FFE14A" stroke="#C9A300" stroke-width="2.5"/>').join('')+
  [-1,1].map(d=>'<g><path d="M'+(d*10)+' 24 Q'+(d*60)+' 40 '+(d*80)+' 130 Q'+(d*44)+' 60 '+(d*6)+' 30Z" fill="#7CB85A" stroke="#3D7A2E" stroke-width="2.5"/><path d="M'+(d*10)+' 26 Q'+(d*56)+' 50 '+(d*74)+' 128" stroke="#2F6B24" stroke-width="1.8" fill="none"/></g>').join('')}

/* ───────── 준비물 카드 그림 ───────── */
function itemArt(k){const A={
  scope:'<g transform="translate(-4 66) scale(.36)">'+scopeArt(0,0,{obj:4}).replace(/<ellipse[^>]*fill="var\(--w-shadow\)"[^>]*\/>/,'')+'</g>',
  sleaf:sleaf(0,58,.62,0,{}),nail:nailArt(0,48,1),tape:tapeRoll(-10,0,1),slide:slideArt(0,0,{s:.6}),onionsl:slideArt(0,0,{s:.6,spec:'onion'}),
  gear:coat(-30,4,.5)+goggles(28,-24,.5)+maskArt(30,10,.7)+hand(26,34,-60,.5,1),
  onion2:'<g transform="translate(-22 30) scale(.5)">'+greenOnion(0,0,{leaf:120,n:14,rl:50})+'</g><g transform="translate(22 30) scale(.5)">'+greenOnion(0,0,{leaf:120,n:14,rl:50,seed:4})+'</g>',
  black:'<rect x="-56" y="-44" width="112" height="88" rx="4" fill="#1E2124" stroke="#000000" stroke-width="2"/>',
  glass:glassArt(-6,-10,30,-35),scis:scisArt(-30,0,-20,1),
  cotton:'<path d="M-50 10 q6 -30 30 -24 q10 -20 34 -10 q20 -10 32 10 q14 10 0 26 q-10 14 -40 10 q-40 6 -56 -12z" fill="#FFFFFF" stroke="#C9CFD4" stroke-width="2.5"/>',
  cyl2:'<g transform="translate(-26 70) scale(.36)">'+cylArt(0,0,{lv:-120}).replace(/<ellipse[^>]*\/>/,'')+'</g><g transform="translate(26 70) scale(.36)">'+cylArt(0,0,{lv:-120}).replace(/<ellipse[^>]*\/>/,'')+'</g>',
  water:'<path d="M-36 -46 h72 l-8 92 h-56z" fill="rgba(232,244,250,.5)" stroke="'+GLS+'" stroke-width="3"/><path d="M-32 -10 h64 l-5 52 h-54z" fill="'+WC+'" fill-opacity=".85"/>',
  pen:pen(4,50,'#D2312A',-30),
  lily:'<g transform="translate(0 70) scale(.42)">'+lily(0,0,240,0)+'</g>',
  gplate:glassPlate(-60,20,120),knife:knifeArt(0,50,-30),glove:hand(-14,-10,-60,.75,1)+hand(22,8,-60,.75,1),
  flask:'<g transform="translate(0 60) scale(.7)">'+flaskArt(0,0,WC).replace(/<ellipse[^>]*\/>/,'')+'</g>',
  dye:'<g transform="translate(0 50) scale(.75)">'+dropBottle(0,0,{col:'#D23A52',op:.9,noShadow:1,lab:1})+'</g>',
  pot:'<g transform="translate(0 70) scale(.42)">'+potPlant(0,0,{}).replace(/<ellipse[^>]*fill="var\(--w-shadow\)"[^>]*\/>/,'')+'</g>',
  foil:'<path d="M-50 -40 l90 -8 l12 80 l-96 10z" fill="'+FOILC+'" stroke="#8A949B" stroke-width="3"/><path d="M-30 -20 l40 -6 M-24 6 l50 -6" stroke="#FFFFFF" stroke-width="4"/>',
  beaker:'<g transform="translate(0 60) scale(.45)">'+beakerBig(0,0,WC,{steam:1}).replace(/<ellipse[^>]*\/>/,'')+'</g>',
  tube:tubeArt(-20,-60,0,'',null).replace('translate(-20 -60)','translate(-20 -60) scale(.7)')+tubeArt(20,-60,0,'',null).replace('translate(20 -60)','translate(20 -60) scale(.7)'),
  eth:'<g transform="translate(0 50) scale(.75)">'+dropBottle(0,0,{col:'#EEF6FA',op:.6,noShadow:1,lab:1})+'</g>',
  tweez:tweezArt(0,52,20),
  dish:'<g transform="scale(.7)">'+dishArt(0,0,70,'')+'</g>',dish2:'<g transform="translate(0 -24) scale(.55)">'+dishArt(0,0,70,'')+'</g><g transform="translate(0 30) scale(.55)">'+dishArt(0,0,70,'')+'</g>',
  iod:'<g transform="translate(0 50) scale(.75)">'+dropBottle(0,0,{col:'#9A5A1E',op:.9,noShadow:1,lab:1})+'</g>',
  cobalt:cobaltPaper(-14,-10,60,40,null)+cobaltPaper(16,14,60,40,null),
  dropper:dropperArt(0,40,WC,20),
  flower:'<g transform="scale(.36)">'+primrose(0,0,1,{})+'</g>',
  wpaper:'<rect x="-50" y="-58" width="100" height="116" rx="6" fill="#FFFFFF" stroke="#C9CFD4" stroke-width="2.5"/>',
  mask:maskArt(-26,0,1.3)+goggles(30,-4,.5)};
 return A[k]||''}
function scisArt(x,y,rot,open){return '<g transform="translate('+x+' '+y+') rotate('+(rot||0)+')"><path d="M0 0 L60 '+(open?-14:-4)+'" stroke="#8796A3" stroke-width="7" stroke-linecap="round"/><path d="M0 0 L60 '+(open?14:4)+'" stroke="#A3B0BB" stroke-width="7" stroke-linecap="round"/><circle cx="-12" cy="-10" r="10" fill="none" stroke="#E2573F" stroke-width="5"/><circle cx="-12" cy="10" r="10" fill="none" stroke="#E2573F" stroke-width="5"/></g>'}

/* ───────── 단계마다 장면 ───────── */
const OPID=OPS.map(o=>o[0]),ONID=['n1','n2','n3','n4'];
function lastSeen(ids){const r=R();let k=null;ids.forEach(i=>{if(r.seen[i])k=i});return k}
function e1Scene(s){const r=R(),id=s.id,f=fid();let g=bg({});
 if(id==='carry'){const on=has('carry'),a=f==='carry';
  if(a)return g+'<g'+an('lb-a-slide',0,'--dx:-300px')+'>'+scopeArt(480,BY,{obj:40})+hand(630,BY-230,180,1.1,1)+hand(330,BY-6,0,1.1,1)+'</g>';
  if(on)return g+scopeArt(480,BY,{obj:40,lbl:1});
  return g+'<g transform="translate(-280 0)">'+scopeArt(480,BY,{obj:40})+'</g>'+mini(640,BY-60,'평평한 곳',20)}
 if(id==='parts'){const X=420,b=BY,sy=b-SCN.stage0,ty=b-SCN.nose;g+=scopeArt(X,b,{obj:4});const cur=UI.mq.cur&&/^pt/.test(UI.mq.cur)?UI.mq.cur:lastSeen(PARTS.map(p=>'pt'+p[0]));
  const PP={pteye:[X-30,b-366,30],ptobj:[X,ty+22,26],ptrev:[X,ty,50],ptstg:[X-5,sy+7,92],ptcrs:[X+108,b-150,30],ptfin:[X+108,b-102,20],ptdia:[X+4,sy+22,36]};
  if(cur){const P=PARTS.find(p=>'pt'+p[0]===cur),[x,y,rr]=PP[cur];g+='<g'+(f===cur?an('lb-a-pop',0):'')+'>'+ringAt(x,y,rr,Math.min(rr,34))+'</g>'+tag(480,52,P[1]+' · '+P[2],22)}else g+=qmark(700,200);
  return g}
 if(id==='gear')return g+gearArt(has('gear'),f==='gear',{mask:1});
 const L=(o)=>sleaf(360,BY+6,1.7,0,Object.assign({back:1},o));
 if(id==='nail'){const on=has('nail'),a=f==='nail';g+=L({nail:on,nailAnim:a})+nailArt(640,BY-4,1.3);if(a)g+='<g'+an('lb-a-rub',0)+'>'+brushArt(450,260,-25)+'</g>';else if(!on)g+=brushArt(700,BY-130,10);return g+mini(360,BY+30,'사철나무잎 뒷면',18)}
 if(id==='dry'){const on=has('dry'),a=f==='dry';g+=L({nail:1,dry:on&&!a})+nailArt(640,BY-4,1.3);if(a)g+=mini(640,200,'마를 때까지 기다리는 중',20);return g}
 if(id==='tape'){const on=has('tape'),a=f==='tape';g+=L({nail:1,dry:1,tape:on,tapeAnim:a})+tapeRoll(660,BY-60,1.2);if(a)g+='<g'+an('lb-a-rub',.7)+'>'+hand(470,BY-160,180,1,1)+'</g>';return g}
 if(id==='slide'){const on=has('slide'),a=f==='slide';g+=L({nail:1,dry:1,tape:!on})+slideArt(700,BY-40,{spec:on?'sach':null,s:1.3});
  if(a)g+='<g'+an('lb-a-move',0,'--dx:-340px')+'><rect x="656" y="'+(BY-68)+'" width="88" height="57" rx="3" fill="#FFF6C9" fill-opacity=".8" stroke="#C9B24A" stroke-width="2"/></g>';
  if(on&&!a)g+=mini(700,BY+20,'현미경표본',18);return g}
 if(id==='pred')return g+slideArt(300,BY-60,{spec:'sach',s:1.4})+mini(300,BY+10,'사철나무잎 표본',18)+'<g transform="translate(380 0)">'+scopeArt(250,BY,{obj:4})+'</g>'+qmark(470,120);
 if(id==='scope'){const k=r.st.scope||0,i=OPID.indexOf(f);if(i>=0&&i===k)return e1ScopeScene(k+1,k+1,'sach',1);return e1ScopeScene(k,0,'sach',1)}
 if(id==='onion'){const k=seqK('onion',ONID),i=ONID.indexOf(f),an_=i>=0?[2,4,5,6][i]:0;
  if(k===0)return e1ScopeScene(6,0,'sach',1);if(k===1)return e1ScopeScene(3,an_,'onion',1,1);return e1ScopeScene(k+2,an_,'onion',1)}
 return g+scopeArt(250,BY,{obj:4})}
/* 실험 2 */
const OB=BY-78;
function e2Scene(s){const r=R(),id=s.id,f=fid();let g=bg({});const A=CYL.A,B=CYL.B;
 const lab2=()=>mini(A,BY+34,'뿌리를 자른 파',17)+mini(B,BY+34,'뿌리를 자르지 않은 파',17);
 if(id==='look'){const k=seqK('look',['bk','lg']),a=f;const on=k>=1;
  if(on)g+='<g'+(a==='bk'?an('lb-a-up',0,'--from:40px'):'')+'>'+blackPaper(250,BY-110,420,120)+'</g>';
  const oni=greenOnion(450,BY-104,{leaf:190,n:22,rl:90,seed:2});g+=oni;
  if(k>=2)g+='<g'+(a==='lg'?an('lb-a-fade',0):'')+'><circle cx="450" cy="'+(BY-60)+'" r="54" fill="none" stroke="var(--lb-lens)" stroke-width="4" stroke-dasharray="10 7"/>'+magnify(720,200,130,'<g transform="scale(2.3) translate(-450 '+(-(BY-60))+')">'+(on?blackPaper(250,BY-110,420,120):'')+oni+'</g>',on?'#1E2124':'#FFFDF6')+'</g>';
  else if(!on||a==='bk')g+=glassArt(740,220,60,-30);
  return g}
 if(id==='plan')return g+cylArt(A,BY,{lv:CYL.L0})+cylArt(B,BY,{lv:CYL.L0})+greenOnion(170,OB,{leaf:150,n:16,rl:70})+greenOnion(800,OB,{leaf:150,n:16,rl:70,seed:5})+qmark(480,90);
 if(id==='cut'){const on=has('cut'),a=f==='cut';
  if(!on&&!a)return g+greenOnion(A,OB,{leaf:170,n:16,rl:70,seed:3})+greenOnion(B,OB,{leaf:170,n:16,rl:70,seed:5})+scisArt(780,BY-60,-30,1)+mini(A,BY+34,'파 한 개',17)+mini(B,BY+34,'다른 파 한 개',17);
  g+=greenOnion(A,OB,{roots:false,cut:1,leaf:58})+greenOnion(B,OB,{cut:1,leaf:58,n:16,rl:70,seed:5});
  if(a)g+='<g'+an('lb-a-fade',0)+'>'+scisArt(A+30,OB+10,-30,1)+scisArt(B+30,OB-120,-30,1)+'</g>';
  return g+lab2()}
 const wL=(k)=>[CYL.L0+CYL.dA*k/3,CYL.L0+CYL.dB*k/3];
 if(id==='put'){const on=has('put'),a=f==='put';g+=cylArt(A,BY,{lv:CYL.L0,inner:on?onionInCyl(A,false,a):''})+cylArt(B,BY,{lv:CYL.L0,inner:on?onionInCyl(B,true,a):''});
  if(!on)g+=greenOnion(160,OB,{roots:false,cut:1,leaf:58})+greenOnion(800,OB,{cut:1,leaf:58,n:16,rl:70,seed:5});return g+lab2()}
 if(id==='mark'||id==='pred'){const on=id==='pred'||has('mark'),a=f==='mark';
  g+=cylArt(A,BY,{lv:CYL.L0,inner:onionInCyl(A,false),mark:on?CYL.L0:0,markAnim:a})+cylArt(B,BY,{lv:CYL.L0,inner:onionInCyl(B,true),mark:on?CYL.L0:0,markAnim:a});
  if(a)g+='<g'+an('lb-a-fade',0)+'>'+pen(B+70,CYL.L0+4,'#D2312A',-40)+'</g>';
  if(on&&!a)g+=sunArt(860,80,30);
  return g+lab2()+(id==='pred'?qmark(480,90):'')}
 if(id==='days'){const k=seqK('days',['d1','d2','d3']),[la,lb]=wL(k);
  g+=sunArt(860,80,30)+cylArt(A,BY,{lv:la,inner:onionInCyl(A,false),mark:CYL.L0})+cylArt(B,BY,{lv:lb,inner:onionInCyl(B,true),mark:CYL.L0});
  return g+lab2()+dayTag(k?k+'일 뒤':'처음',270)}
 return g}
/* 실험 3 */
function e3Scene(s){const r=R(),id=s.id,f=fid();let g=bg({});
 if(id==='gear')return g+gearArt(has('gear'),f==='gear',{coat:false,mask:1});
 if(id==='look'){g+=lily(400,BY-2,300,0);const cur=UI.mq.cur&&/^lk/.test(UI.mq.cur)?UI.mq.cur:lastSeen(['lk1','lk2','lk3']);
  const RG={lk1:[400,BY-120,24,110],lk2:[435,BY-150,40,30],lk3:[400,BY-350,110,70]},Z={lk1:'<path d="M0 -150 V150" stroke="#4F9D3A" stroke-width="22"/><path d="M-6 -150 V150" stroke="#7FC060" stroke-width="5" opacity=".6"/>',
   lk2:[[-70,40,1],[70,-30,-1]].map(([x,y,d])=>'<path d="M'+(x-d*70)+' '+(y+40)+' q'+(d*60)+' -10 '+(d*120)+' -70 q'+(-d*70)+' 10 '+(-d*120)+' 70z" fill="#5AA046" stroke="#3D7A2E" stroke-width="3"/>').join('')+'<path d="M0 -150 V150" stroke="#4F9D3A" stroke-width="16"/>',
   lk3:'<g transform="scale(1.9) translate(-400 '+(-(BY-350))+')">'+lily(400,BY-2,300,0)+'</g>'};
  if(cur){const [x,y,rx,ry]=RG[cur];g+=ringAt(x,y,rx,ry)+'<g'+(f===cur?an('lb-a-fade',0):'')+'>'+magnify(740,220,150,Z[cur])+'</g>'}
  return g}
 if(id==='cut0'||id==='cut1'){const red=id==='cut1',A=red?'cc':'cd',a0=red?'cc':'ca',b0=red?'cd':'cb';return g+stemCut(red,sn(a0),sn(b0),f===a0,f===b0)}
 if(id==='pred')return g+flaskArt(620,BY,WC)+'<g transform="translate(330 '+(BY-30)+') rotate(-90)">'+lily(0,0,280,0)+'</g>'+qmark(480,80);
 if(id==='dye'){const on=has('dye'),a=f==='dye';g+=flaskArt(480,BY,on?'#D23A52':null,{base:WC,colAnim:a});
  if(a)g+='<g'+an('lb-a-fade',0)+'><g transform="translate(560 '+(BY-200)+') rotate(150)">'+dropBottle(0,0,{col:'#D23A52',op:.9,noShadow:1,s:.7})+'</g></g>'+dropFall(540,BY-180,BY-60,'#D23A52',3,.2);
  else if(!on)g+=dropBottle(680,BY,{col:'#D23A52',op:.9,lab:1});
  return g}
 if(id==='put'){const on=has('put'),a=f==='put';if(on)g+='<g'+(a?an('lb-a-down',0,'--from:-160px'):'')+'>'+lily(480,BY-14,300,0)+'</g>';else g+='<g transform="translate(240 '+(BY-30)+') rotate(-90)">'+lily(0,0,280,0)+'</g>';return g+flaskArt(480,BY,'#D23A52')}
 if(id==='sun'){const k=seqK('sun',['s1','s2']);if(k>=1)g+=sunArt(820,90,32,f==='s1');
  g+=lily(480,BY-14,300,0);if(k>=2)g+='<g'+(f==='s2'?an('lb-a-fade',.2,'animation-duration:2s'):'')+'>'+lily(480,BY-14,300,1)+'</g>';
  return g+flaskArt(480,BY,'#D23A52')+(k>=2?dayTag('하루 뒤',300):'')}
 return g}
/* 실험 4 */
function twoDishes(lc,rc,o){o=o||{};let g=dishArt(330,BY-40,150,'')+dishArt(650,BY-40,150,'');
 g+=leafFlat(330,BY-20,-90,lc,60,.62).replace('rotate(-90)','rotate(-90) translate(0 -10)')+leafFlat(670,BY-20,-90,rc,14,.62);
 return g+mini(330,BY+34,'포일을 씌우지 않은 잎',17)+mini(650,BY+34,'포일을 씌운 잎',17)}
function e4Scene(s){const r=R(),id=s.id,f=fid();let g=bg({});
 if(id==='foil'){const on=has('foil'),a=f==='foil';return g+potPlant(480,BY,{foil:on?2:null,foilAnim:a})}
 if(id==='sun'){const on=has('sun'),a=f==='sun';return bg({win:600})+potPlant(480,BY,{foil:2})+(on?sunArt(810,150,34,a):'')+(on&&!a?dayTag('하루 뒤',380):'')}
 if(id==='gear')return g+gearArt(has('gear'),f==='gear',{mask:1});
 if(id==='pick'){const on=has('pick'),a=f==='pick';if(!on&&!a)return g+potPlant(480,BY,{foil:2});
  g+=leafFlat(370,BY-10,0,LG,64,.85)+leafFlat(580,BY-10,0,LG,18,.85);if(a)g+='<g'+an('lb-a-out',.6,'animation-duration:1s')+'><g transform="translate(580 '+(BY-10)+') scale(.85)">'+foilOver(0)+'</g></g>';
  return g+mini(370,BY+30,'포일을 씌우지 않은 잎',18)+mini(580,BY+30,'포일을 씌운 잎',18)}
 if(id==='hot'){const on=has('hot'),a=f==='hot';const lv='<g'+(a?an('lb-a-down',0,'--from:-150px'):'')+'>'+leafFlat(440,BY-26,-12,LG,60,.4)+leafFlat(520,BY-26,10,LG,18,.4)+'</g>';
  return g+beakerBig(480,BY,WC,{steam:1,inner:on||a?lv:''})+(on||a?'':leafFlat(720,BY-10,0,LG,64,.4)+leafFlat(800,BY-10,0,LG,18,.4))+mini(480,BY+32,'뜨거운 물 · 1분',18)}
 if(id==='eth'){const on=has('eth'),a=f==='eth';const lf=(x,st)=>leafFlat(x,0,0,on&&!a?LPALE:LG,st,.3);
  const tA=tubeArt(430,BY-250,-6,on&&!a?'#C9E08F':'#F2F8FB','<g transform="translate(0 160)">'+lf(0,40)+(a?'<g'+an('lb-a-fade',.6,'animation-duration:1.8s')+'>'+leafFlat(0,0,0,LPALE,40,.3)+'</g>':'')+'</g>',{over:a?'#C9E08F':null});
  const tB=tubeArt(530,BY-250,6,on&&!a?'#C9E08F':'#F2F8FB','<g transform="translate(0 160)">'+lf(0,12)+(a?'<g'+an('lb-a-fade',.6,'animation-duration:1.8s')+'>'+leafFlat(0,0,0,LPALE,12,.3)+'</g>':'')+'</g>',{over:a?'#C9E08F':null});
  return g+beakerBig(480,BY,WC,{steam:1,inner:tA+tB})+mini(480,BY+32,'에탄올 · 뜨거운 물 · 10분',18)}
 if(id==='rinse'){const on=has('rinse'),a=f==='rinse';g+=beakerBig(400,BY,'#D6EEF9');
  if(a)g+='<g'+an('lb-a-liftup',0)+'>'+tweezArt(420,BY-120,8,'')+leafFlat(404,BY-110,0,LPALE,40,.36)+'</g>';
  return g+(on&&!a?leafFlat(680,BY-10,0,LPALE,64)+leafFlat(840,BY-10,0,LPALE,18):'<g transform="translate(270 0)">'+tubeArt(430,BY-250,-6,'#C9E08F','')+'</g>')}
 if(id==='pred')return g+twoDishes(LPALE,LPALE)+qmark(490,90);
 if(id==='drop'){const k=seqK('drop',['p1','p2']);if(k<1)return g+dishArt(330,BY-40,150,'')+dishArt(650,BY-40,150,'')+leafFlat(840,BY-10,0,LPALE,64,.4)+leafFlat(900,BY-10,0,LPALE,18,.4);
  g+=twoDishes(LPALE,LPALE);
  if(k>=2){const a=f==='p2';g+='<g'+(a?an('lb-a-fade',1,'animation-duration:1.6s'):'')+'>'+leafFlat(330,BY-20,-90,LBLUE,60,.62).replace('rotate(-90)','rotate(-90) translate(0 -10)')+'</g>';
   [[600,BY-40],[625,BY-46],[650,BY-37]].forEach(([x,y])=>{g+='<ellipse cx="'+x+'" cy="'+y+'" rx="9" ry="5" fill="#C9A15A" fill-opacity=".55"/>'});
   if(a)g+='<g'+an('lb-a-fade',0)+'><g transform="translate(380 '+(BY-200)+') rotate(160)">'+dropBottle(0,0,{col:'#9A5A1E',op:.9,noShadow:1,s:.6})+'</g><g transform="translate(720 '+(BY-200)+') rotate(160)">'+dropBottle(0,0,{col:'#9A5A1E',op:.9,noShadow:1,s:.6})+'</g></g>'+dropFall(372,BY-170,BY-70,'#9A5A1E',3,0)+dropFall(712,BY-170,BY-70,'#9A5A1E',3,0)}
  return g}
 return g}
/* 실험 5 */
function e5Scene(s){const r=R(),id=s.id,f=fid();let g=bg({});
 const dishP=(col,anim)=>dishArt(280,BY-50,150,cobaltPaper(280,BY-52,90,50,col,{tape:1,anim}));
 if(id==='paper'){const k=seqK('paper',['pk','wd']);
  if(k>=1)g+='<g'+(f==='pk'?an('lb-a-down',0,'--from:-80px'):'')+'>'+cobaltPaper(480,BY-28,170,56,null,{spot:k>=2?28:0,delay:.9})+'</g>';else g+=cobaltPaper(780,BY-28,170,56,null);
  if(f==='pk')g+='<g'+an('lb-a-fade',0)+'>'+tweezArt(540,BY-34,30,'')+'</g>';
  if(f==='wd')g+='<g'+an('lb-a-fade',0)+'>'+dropperArt(480,BY-130,WC,0)+'</g>'+dropFall(480,BY-120,BY-26,'#9FD3F5',1,.1);
  return g+(k>=1?mini(480,BY+30,'푸른색 염화 코발트 종이',17):'')}
 const plantP=(col,anim)=>potPlant(680,BY,{paper:col,paperAnim:anim});
 if(id==='pdish'){const on=has('pdish'),a=f==='pdish';g+=on?'<g'+(a?an('lb-a-fade',0):'')+'>'+dishP(null)+'</g>':dishArt(280,BY-50,150,'')+cobaltPaper(500,BY-30,90,50,null);
  if(a)g+=tweezArt(330,BY-90,30,'');return g+potPlant(680,BY,{})+mini(280,BY+26,'페트리 접시',17)}
 if(id==='pleaf'){const on=has('pleaf'),a=f==='pleaf';g+=dishP(null)+(on?plantP(CBLUE,a):potPlant(680,BY,{}));
  return g+mini(280,BY+26,'페트리 접시',17)+(on?mini(680,BY+26,'잎 뒷면에 붙인 종이',17):'')}
 if(id==='sun'||id==='pred'){const on=id==='pred'||has('sun');g=bg({win:620})+dishP(null)+plantP(CBLUE);if(on)g+=sunArt(820,150,34,f==='sun');return g+(id==='pred'?qmark(480,80):'')}
 if(id==='wait'){const k=seqK('wait',['w10']),a=f==='w10',done=k>=1;g=bg({win:620})+sunArt(820,150,34)+dishP(null)+plantP(done?CPINK:CBLUE,a);
  if(a)g+=mini(480,110,'10분 기다리는 중',22);
  if(done)g+=magnify(150,160,70,cobaltPaper(0,0,100,60,null))+mini(150,262,'접시의 종이',16)+'<g'+(a?an('lb-a-fade',1):'')+'>'+magnify(470,150,70,cobaltPaper(0,0,100,60,CPINK))+mini(470,252,'잎 뒷면의 종이',16)+'</g>';
  return g}
 if(id==='more'){const on=!!r.seen.mm||fxOn('mm');g=bg({});if(on)g+=sunArt(880,80,30);
  [[220,8,14,'그대로 둠'],[480,4,7,'잎 절반 뗌'],[740,0,1,'잎 모두 뗌']].forEach(([x,n,d,t])=>{g+=balsam(x,BY,n,on?d:0)+mini(x,BY+30,t,17)});return g}
 return g}
/* 실험 6 */
const PK={tS:'S',tP:'P',tT:'T',tA:'A'};
function e6Scene(s){const r=R(),id=s.id,f=fid();let g=bg({});
 if(id==='gear')return g+gearArt(has('gear'),f==='gear',{coat:false,glove:false,mask:1});
 if(id==='pred')return g+primrose(480,240,1.3,{})+qmark(780,90);
 const got={};Object.keys(PK).forEach(k=>{if(r.seen[k]||f===k)got[PK[k]]=1});
 if(id==='apart'){const o={};Object.keys(got).forEach(k=>o[k]=false);g+='<rect x="512" y="70" width="0" height="0"/>'+primrose(260,240,.95,o)+paperParts(got,PK[f]);
  if(PK[f])g+='<g'+an('lb-a-fade',0)+'>'+tweezArt(420,200,30,'')+'</g>';
  return g+mini(260,BY+20,'달맞이꽃',17)+mini(722,BY+20,'흰 종이',17)}
 if(id==='lens'){const all={S:1,P:1,T:1,A:1};g+=paperParts(all);const cur=UI.mq.cur&&/^v/.test(UI.mq.cur)?UI.mq.cur:lastSeen(['vA','vT','vP','vS']);
  const PX={vA:[PPX.A,250,40,150],vT:[PPX.T,260,56,110],vP:[PPX.P,260,62,140],vS:[PPX.S,280,56,130]};
  if(cur){const [x,y,rx,ry]=PX[cur];g+=ringAt(x,y,rx,ry)+'<g'+(f===cur?an('lb-a-fade',0):'')+'>'+magnify(250,240,170,partZoom(cur))+'</g>'}else g+=glassArt(250,220,80,-30);
  return g}
 return g}
const SCENES={1:e1Scene,2:e2Scene,3:e3Scene,4:e4Scene,5:e5Scene,6:e6Scene};
/* 단계마다 그림 범위(viewBox) */
function vbOf(no,id){const D='60 30 840 470',M={
 1:{parts:'150 20 620 460',scope:'0 0 960 500',onion:'0 0 960 500',nail:'190 130 620 370',dry:'190 130 620 370',tape:'190 130 620 370',slide:'190 130 620 370',pred:'150 30 700 460',gear:'160 40 640 420'},
 2:{look:'200 50 690 420',days:'170 40 620 450',mark:'170 40 620 450',pred:'170 40 620 450'},
 3:{look:'120 20 800 450',cut0:'60 70 860 400',cut1:'60 70 860 400',dye:'250 50 460 420',put:'200 20 560 450',sun:'200 20 700 450',pred:'150 40 660 430',gear:'160 40 640 420'},
 4:{foil:'300 160 360 310',sun:'290 60 600 420',pick:'230 170 500 300',hot:'250 110 460 370',eth:'250 110 460 370',rinse:'240 100 680 380',pred:'150 160 680 330',drop:'150 160 680 330',gear:'160 40 640 420'},
 5:{paper:'260 170 440 310',more:'60 20 840 470'},
 6:{pred:'200 20 560 440',apart:'40 30 900 440',lens:'40 30 900 440',gear:'160 40 640 420'}};return (M[no]&&M[no][id])||D}

/* ───────── 오늘의 실험 그림(이렇게 해요 1~4) — 결과는 보이지 않게 ───────── */
function introArt(no,k){let g=bg({}),vb='0 0 960 540';
 if(no===1){if(k==='nail'){g+=sleaf(380,BY+6,1.3,0,{back:1})+brushArt(470,280,-25)+nailArt(600,BY,1.1);vb='240 150 460 330'}
  if(k==='tape'){g+=sleaf(330,BY+6,1.3,0,{back:1,nail:1,dry:1,tape:1})+slideArt(560,BY-40,{s:1.2});vb='200 150 500 330'}
  if(k==='scope'){g+=scopeArt(420,BY,{obj:4,on:1,slide:'sach',up:.8});vb='250 30 380 450'}
  if(k==='onion'){g+=slideArt(480,BY-60,{spec:'onion',s:1.8});vb='300 300 360 200'}}
 if(no===2){if(k==='look'){g+=blackPaper(300,BY-110,360,120)+greenOnion(470,BY-104,{leaf:170,n:20,rl:90,seed:2})+glassArt(640,BY-90,50,-30);vb='250 110 500 360'}
  if(k==='cut'){g+=greenOnion(380,OB,{leaf:150,n:16,rl:70,seed:3})+greenOnion(560,OB,{leaf:150,n:16,rl:70,seed:5})+scisArt(660,BY-60,-30,1);vb='280 110 480 360'}
  if(k==='put'){g+=cylArt(400,BY,{lv:CYL.L0,inner:onionInCyl(400,false),mark:CYL.L0})+cylArt(580,BY,{lv:CYL.L0,inner:onionInCyl(580,true),mark:CYL.L0});vb='300 60 380 410'}
  if(k==='days'){g+=sunArt(620,120,30)+cylArt(400,BY,{lv:CYL.L0,inner:onionInCyl(400,false),mark:CYL.L0})+cylArt(560,BY,{lv:CYL.L0,inner:onionInCyl(560,true),mark:CYL.L0})+mini(700,240,'3일 동안',22);vb='300 60 460 410'}}
 if(no===3){if(k==='look'){g+=lily(480,BY-2,300,0);vb='330 40 300 420'}
  if(k==='cut'){g+=glassPlate(300,BY-6,330)+'<rect x="340" y="'+(BY-40)+'" width="250" height="16" rx="8" fill="#4F9D3A"/>'+knifeArt(460,BY-40,0);vb='280 300 380 170'}
  if(k==='dye'){g+=lily(480,BY-14,300,0)+flaskArt(480,BY,'#D23A52')+sunArt(640,120,30);vb='330 40 360 420'}
  if(k==='cut2'){g+='<circle cx="380" cy="240" r="66" fill="none" stroke="var(--w-felt-s)" stroke-width="3" stroke-dasharray="8 6"/><rect x="530" y="160" width="100" height="160" rx="6" fill="none" stroke="var(--w-felt-s)" stroke-width="3" stroke-dasharray="8 6"/>'+knifeArt(470,330,-30)+qmark(470,150);vb='290 130 400 240'}}
 if(no===4){if(k==='foil'){g+=potPlant(480,BY,{foil:2})+sunArt(660,120,30);vb='330 120 380 350'}
  if(k==='hot'){g+=beakerBig(480,BY,WC,{steam:1,inner:tubeArt(430,BY-250,-6,'#F2F8FB','')+tubeArt(530,BY-250,6,'#F2F8FB','')});vb='330 140 300 330'}
  if(k==='rinse'){g+=beakerBig(440,BY,'#D6EEF9')+tweezArt(460,BY-120,8,'');vb='300 160 300 310'}
  if(k==='drop'){g+=dishArt(480,BY-40,150,'')+'<g transform="translate(530 '+(BY-180)+') rotate(160)">'+dropBottle(0,0,{col:'#9A5A1E',op:.9,noShadow:1,s:.7})+'</g>';vb='300 200 360 260'}}
 if(no===5){if(k==='paper'){g+=cobaltPaper(480,BY-20,140,36,null)+dropperArt(480,BY-110,WC,0);vb='300 200 360 260'}
  if(k==='dish'){g+=dishArt(480,BY-50,150,cobaltPaper(480,BY-52,90,50,null,{tape:1}));vb='300 290 360 180'}
  if(k==='leaf'){g+=potPlant(480,BY,{paper:CBLUE});vb='350 160 260 310'}
  if(k==='wait'){g+=cobaltPaper(400,300,90,50,null)+potPlant(560,BY,{paper:CBLUE})+mini(470,150,'10분',26)+sunArt(660,110,30);vb='320 70 420 400'}}
 if(no===6){if(k==='flower'){g+=primrose(480,240,1.1,{});vb='280 40 400 400'}
  if(k==='apart'){g+=primrose(300,240,.8,{P:false})+tweezArt(430,200,30,'');vb='150 60 380 370'}
  if(k==='count'){g+='<rect x="320" y="120" width="320" height="260" rx="6" fill="#FFFFFF" stroke="#C9CFD4" stroke-width="2.5"/>'+qmark(480,250);vb='290 100 380 300'}
  if(k==='lens'){g+=glassArt(480,230,90,-30);vb='330 100 300 330'}}
 return svg(g,'',vb).replace(' role="img" aria-label=""',' aria-hidden="true"')}
/* 실험 고르기 카드 그림 */
function homeArtOf(no){let g=bg({}),vb='120 70 720 420';
 if(no===1){g+=scopeArt(330,BY,{obj:4})+slideArt(620,BY-40,{spec:'sach',s:1.3})+sleaf(780,BY+6,1,10,{});vb='160 40 720 420'}
 if(no===2){g+=greenOnion(260,OB,{leaf:170,n:18,rl:80})+cylArt(470,BY,{lv:CYL.L0})+cylArt(650,BY,{lv:CYL.L0});vb='150 70 640 400'}
 if(no===3){g+=lily(360,BY-2,300,0)+flaskArt(620,BY,WC);vb='200 30 560 430'}
 if(no===4){g+=potPlant(330,BY,{foil:2})+dropBottle(600,BY,{col:'#9A5A1E',op:.9,lab:1})+dishArt(760,BY-30,90,'');vb='200 150 640 320'}
 if(no===5){g+=potPlant(560,BY,{})+cobaltPaper(300,BY-40,140,60,null);vb='190 150 520 320'}
 if(no===6){g+=primrose(480,250,1.05,{});vb='250 40 460 420'}
 return svg(g,'실험 '+no+' 처음 모습',vb)}
/* 결과 한 장의 관찰 그림 */
function snapsOf(v,r){const L=[],no=v.no,S=(g,vb,cap)=>L.push([svg(g,cap,vb),cap]);const ok=k=>rowDone(k);
 if(no===1){if(ok('sach'))S(eyeView(200,200,170,'sach',{mag:400}),'14 14 372 372','사철나무잎 (400배)');if(ok('onion'))S(eyeView(200,200,170,'onion',{mag:400}),'14 14 372 372','양파 (400배)')}
 if(no===2){if(ok('lv'))S(bg({})+cylArt(CYL.A,BY,{lv:CYL.L0+CYL.dA,inner:onionInCyl(CYL.A,false),mark:CYL.L0})+cylArt(CYL.B,BY,{lv:CYL.L0+CYL.dB,inner:onionInCyl(CYL.B,true),mark:CYL.L0})+mini(CYL.A,BY+34,'뿌리를 자른 파',17)+mini(CYL.B,BY+34,'뿌리를 자르지 않은 파',17),'230 60 500 430','3일 뒤 (빨간 선: 처음 물 높이)')}
 if(no===3){if(ok('sec0'))S(crossView(100,100,0)+longView(260,100,0),'20 10 310 180','처음 줄기의 단면');if(ok('sec1'))S(crossView(100,100,1)+longView(260,100,1),'20 10 310 180','하루 뒤 줄기의 단면')}
 if(no===4){if(ok('iod'))S(bg({})+twoDishes(LBLUE,LPALE),'150 300 680 170','용액을 떨어뜨린 뒤')}
 if(no===5){if(ok('res'))S(cobaltPaper(90,70,120,70,null)+cobaltPaper(290,70,120,70,CPINK)+mini(90,135,'접시의 종이',15)+mini(290,135,'잎 뒷면의 종이',15),'10 20 360 135','10분 뒤')}
 if(no===6){if(ok('nA'))S(paperParts({S:1,P:1,T:1,A:1}),'505 60 432 350','흰 종이 위에 놓은 부분')}
 return L}
