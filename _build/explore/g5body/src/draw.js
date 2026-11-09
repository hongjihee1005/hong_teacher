/* ───────── 그림: 실험대 장면 — 모두 직접 그린 SVG (우리 몸의 구조와 기능) ───────── */
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
function coat(x,y,s){return '<g transform="translate('+x+' '+y+') scale('+(s||1)+')"><path d="M-46 -64 L-18 -72 L0 -40 L18 -72 L46 -64 L62 30 L40 34 L36 -10 L34 72 H-34 L-36 -10 L-40 34 L-62 30Z" fill="#FFFFFF" stroke="#9AA6B2" stroke-width="3" stroke-linejoin="round"/><path d="M0 -40 V72" stroke="#9AA6B2" stroke-width="2"/><circle cx="-7" cy="-6" r="3" fill="#9AA6B2"/><circle cx="-7" cy="22" r="3" fill="#9AA6B2"/><rect x="12" y="10" width="16" height="12" rx="2" fill="none" stroke="#9AA6B2" stroke-width="2"/></g>'}
const DEG=Math.PI/180;
const f1=v=>(+v).toFixed(1);
function gog(x,y,s,tint,line){return '<g transform="translate('+x+' '+y+') scale('+(s||1)+')"><rect x="-58" y="-18" width="52" height="36" rx="15" fill="'+tint+'" stroke="'+line+'" stroke-width="4"/><rect x="6" y="-18" width="52" height="36" rx="15" fill="'+tint+'" stroke="'+line+'" stroke-width="4"/><path d="M-6 -2 h12" stroke="'+line+'" stroke-width="5"/><path d="M-58 0 h-14 M58 0 h14" stroke="'+line+'" stroke-width="4"/></g>'}
const GOG={clr:['rgba(200,230,245,.6)','#2F68B0'],sun:['rgba(40,44,52,.82)','#1F2328'],las:['rgba(255,140,40,.55)','#B35A12']};
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
/* ───────── 몸 그림(원본 교과서 버전 앱 u4-2의 bodyBase·ORG를 옮겨 씀, 320×470 좌표) ───────── */
const SKIN='#F6D9C0',SKL='#D9A888';
function bodyBase(o){o=o||{};let s='';
 if(!o.noArms)s+='<g fill="none" stroke="'+SKIN+'" stroke-linecap="round"><path d="M92 146 L66 296" stroke-width="28"/><path d="M228 146 L254 296" stroke-width="28"/></g>';
 s+='<g fill="none" stroke="'+SKIN+'" stroke-linecap="round"><path d="M130 326 L126 462" stroke-width="40"/><path d="M190 326 L194 462" stroke-width="40"/></g>';
 s+='<path d="M92 132 Q160 116 228 132 Q244 140 240 172 L236 214 Q232 276 222 334 L98 334 Q88 276 84 214 L80 172 Q76 140 92 132Z" fill="'+SKIN+'" stroke="'+SKL+'" stroke-width="2.5"/>';
 s+='<rect x="144" y="98" width="32" height="34" fill="'+SKIN+'"/><path d="M144 98 V128 M176 98 V128" stroke="'+SKL+'" stroke-width="2.5"/>';
 s+='<ellipse cx="160" cy="62" rx="40" ry="46" fill="'+SKIN+'" stroke="'+SKL+'" stroke-width="2.5"/>';
 s+='<path d="M120 58 Q118 14 160 14 Q204 14 200 58 Q196 34 160 32 Q128 32 120 58Z" fill="#5A4334"/>';
 s+='<circle cx="146" cy="58" r="3.4" fill="#4A3A30"/><circle cx="174" cy="58" r="3.4" fill="#4A3A30"/>'+(o.mouth?'':'<path d="M150 84 Q160 91 170 84" stroke="#B5654F" stroke-width="2.5" fill="none" stroke-linecap="round"/>')+'<path d="M160 64 Q157 72 162 73" stroke="'+SKL+'" stroke-width="2" fill="none"/>';
 return s}
const ORG={
 mouth:'<ellipse cx="160" cy="84" rx="12" ry="6.5" fill="#C4544A" stroke="#8A2F28" stroke-width="2"/><path d="M151 84 h18" stroke="#FFFFFF" stroke-width="2"/>',
 eso:'<path d="M160 90 L160 128 Q162 160 176 184" fill="none" stroke="#E48D78" stroke-width="10" stroke-linecap="round"/><path d="M160 90 L160 128 Q162 160 176 184" fill="none" stroke="#F6C2B2" stroke-width="3" stroke-linecap="round"/>',
 liver:'<path d="M96 190 Q118 170 180 176 Q190 186 180 196 Q152 214 112 214 Q94 208 96 190Z" fill="#A8473A" stroke="#6E2A20" stroke-width="2"/>',
 gall:'<ellipse cx="150" cy="216" rx="8" ry="6" fill="#77A94E" stroke="#3F6A26" stroke-width="2"/>',
 stomach:'<path d="M172 182 Q164 202 178 218 Q196 236 216 222 Q232 206 224 188 Q218 176 206 182 Q198 196 188 192 Q180 188 178 180Z" fill="#F2A27F" stroke="#A85A3C" stroke-width="2"/>',
 pancreas:'<path d="M164 232 Q190 224 220 230 Q212 240 170 240Z" fill="#F2C66A" stroke="#A8842E" stroke-width="2"/>',
 large:'<path d="M122 308 L120 256 Q120 247 129 247 L197 247 Q206 247 206 256 L206 300 Q206 314 182 318 L163 320" fill="none" stroke="#C97A4F" stroke-width="15" stroke-linecap="round" stroke-linejoin="round"/><path d="M122 308 L120 256 Q120 247 129 247 L197 247 Q206 247 206 256 L206 300 Q206 314 182 318 L163 320" fill="none" stroke="#E6A77F" stroke-width="5" stroke-dasharray="3 6"/>',
 small:'<path d="M138 262 H186 A6 6 0 0 1 186 274 H138 A6 6 0 0 0 138 286 H186 A6 6 0 0 1 186 298 H140" fill="none" stroke="#E7A08D" stroke-width="8" stroke-linecap="round"/>',
 anus:'<path d="M163 318 L161 334" stroke="#C97A4F" stroke-width="8" stroke-linecap="round"/><circle cx="161" cy="338" r="5" fill="#7A3F24"/>',
 trachea:'<rect x="153" y="92" width="14" height="56" rx="5" fill="#CFE7F2" stroke="#5F9CC0" stroke-width="2"/><path d="M155 102 h10 M155 112 h10 M155 122 h10 M155 132 h10 M155 142 h10" stroke="#5F9CC0" stroke-width="1.6"/>',
 bronchi:'<path d="M160 148 Q150 156 138 160 M138 160 L126 176 M138 160 L132 190 M160 148 Q170 156 182 160 M182 160 L194 176 M182 160 L188 190" fill="none" stroke="#3F84AD" stroke-width="5" stroke-linecap="round"/>',
 lungL:'<path d="M150 138 Q120 130 106 160 Q98 198 112 220 Q134 226 152 214 Z" fill="#F3A9B2" stroke="#B25C68" stroke-width="2"/>',
 lungR:'<path d="M170 138 Q200 130 214 160 Q222 198 208 220 Q186 226 168 214 Z" fill="#F3A9B2" stroke="#B25C68" stroke-width="2"/>'};
const ease=p=>p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2;
/* 지금 하는 행동의 진행(0~1) — 움직임이 줄어든 설정이면 바로 끝 모습 */
function prog(){if(!UI.fx||RM)return 1;return Math.max(0,Math.min(1,(performance.now()-UI.fx.t0)/UI.fx.ms))}

/* ───────── 실험 1: 뼈와 근육 모형(원본 u4-1의 armDraw를 옮겨 씀, 520×380 좌표) ───────── */
const AE={x:300,y:200},AL=150;
const ARM={tx:45,ty:10,s:1.45,lens:[441,170,190,385]};
const MCOL={in:['#E2573F','#8A1F19'],out:['#F0A04B','#9A5410']};
function armPts(phi){const r=phi*DEG,sn=Math.sin(r),cs=Math.cos(r),u={x:-sn,y:cs},n={x:-cs,y:-sn};
 const P=(b,k1,k2)=>({x:b.x+k1*u.x+k2*n.x,y:b.y+k1*u.y+k2*n.y});
 return {P,tip:P(AE,AL,0),A:{x:276,y:50},B:P(AE,50,16),C:{x:324,y:50},D:P(AE,-22,-24),H:P(AE,50,26),u}}
function band(P1,Q,col,stk,o){o=o||{};const L=Math.hypot(Q.x-P1.x,Q.y-P1.y),ang=Math.atan2(Q.y-P1.y,Q.x-P1.x)/DEG,mx=(P1.x+Q.x)/2,my=(P1.y+Q.y)/2,ry=Math.min(30,3000/L);
 if(o.ghost)return '<ellipse cx="'+f1(mx)+'" cy="'+f1(my)+'" rx="'+f1(L/2+8)+'" ry="'+f1(ry)+'" transform="rotate('+f1(ang)+' '+f1(mx)+' '+f1(my)+')" fill="none" stroke="#6B7686" stroke-width="2.5" stroke-dasharray="7 6" opacity=".7"/>';
 return '<ellipse cx="'+f1(mx)+'" cy="'+f1(my)+'" rx="'+f1(L/2+8)+'" ry="'+f1(ry)+'" transform="rotate('+f1(ang)+' '+f1(mx)+' '+f1(my)+')" fill="'+col+'" stroke="'+stk+'" stroke-width="2.5" opacity="'+(o.skin?.72:.93)+'"/>'}
function bone(P1,Q,ghost){if(ghost)return '<line x1="'+f1(P1.x)+'" y1="'+f1(P1.y)+'" x2="'+f1(Q.x)+'" y2="'+f1(Q.y)+'" stroke="#6B7686" stroke-width="3" stroke-dasharray="8 7" opacity=".7"/>';
 return '<line x1="'+f1(P1.x)+'" y1="'+f1(P1.y)+'" x2="'+f1(Q.x)+'" y2="'+f1(Q.y)+'" stroke="#A89A78" stroke-width="30" stroke-linecap="round"/><line x1="'+f1(P1.x)+'" y1="'+f1(P1.y)+'" x2="'+f1(Q.x)+'" y2="'+f1(Q.y)+'" stroke="#F7F0DC" stroke-width="24" stroke-linecap="round"/>'}
/* o.part: 만든 차례(1 뼈 · 2 안쪽 근육 아래쪽과 손잡이 · 3 안쪽 근육 위쪽 · 4 바깥쪽 근육), o.skin: 내 팔, o.ghost: 흐린 점선 */
function armArt(phi,o){o=o||{};const Q=armPts(phi),vis=k=>o.part==null||o.part>=k;let s='';
 if(o.ghost)return bone({x:300,y:40},AE,1)+bone(AE,Q.tip,1)+band(Q.D,Q.C,0,0,{ghost:1})+band(Q.A,Q.B,0,0,{ghost:1});
 if(o.skin){s+='<path d="M300 -20 L'+AE.x+' '+AE.y+' L'+f1(Q.tip.x)+' '+f1(Q.tip.y)+'" fill="none" stroke="'+SKIN+'" stroke-width="100" stroke-linecap="round" stroke-linejoin="round"/>';const h=Q.P(AE,AL+20,0);s+='<circle cx="'+f1(h.x)+'" cy="'+f1(h.y)+'" r="40" fill="'+SKIN+'"/>'}
 if(vis(1))s+=bone({x:300,y:40},AE)+bone(AE,Q.tip);
 if(vis(4))s+=band(Q.D,Q.C,MCOL.out[0],MCOL.out[1],o);
 if(vis(2)){const top=vis(3)?Q.A:{x:Q.A.x-30,y:Q.A.y+30};s+=band(top,Q.B,MCOL.in[0],MCOL.in[1],o)}
 if(!o.skin&&vis(2))s+='<g transform="translate('+f1(Q.H.x)+' '+f1(Q.H.y)+')"><rect x="-80" y="-12" width="82" height="24" rx="6" fill="#FFD166" stroke="#A8842E" stroke-width="2"/></g>';
 if(!o.skin)[[AE,1],[Q.A,3],[Q.B,2],[Q.H,2],[Q.C,4],[Q.D,4]].forEach(([p,k])=>{if(vis(k))s+='<circle cx="'+f1(p.x)+'" cy="'+f1(p.y)+'" r="7" fill="#7D8A95" stroke="#FFFFFF" stroke-width="2"/>'});
 return s}
function armLabels(phi,skin){if(NAR)return '';const Q=armPts(phi),T=(x,y,t,a)=>'<text x="'+f1(x)+'" y="'+f1(y)+'" font-size="15" font-weight="800" text-anchor="'+(a||'start')+'" fill="#3E3423" stroke="var(--w-paper)" stroke-width="4" paint-order="stroke">'+t+'</text>';
 const mi={x:(Q.A.x+Q.B.x)/2,y:(Q.A.y+Q.B.y)/2},mo={x:(Q.D.x+Q.C.x)/2,y:(Q.D.y+Q.C.y)/2},ri=Math.min(30,3000/Math.hypot(Q.A.x-Q.B.x,Q.A.y-Q.B.y)),ro=Math.min(30,3000/Math.hypot(Q.D.x-Q.C.x,Q.D.y-Q.C.y));
 return T(312,34,'위팔뼈')+T(Q.tip.x-14,Q.tip.y+(phi>90?-14:22),'아래팔뼈','end')+T(mo.x+ro+12,mo.y+5,skin?'팔 바깥쪽 근육':'바깥쪽 근육')+T(mi.x-ri-12,mi.y+5,skin?'팔 안쪽 근육':'안쪽 근육','end')}
function armScene(phi,o){o=o||{};let g='<rect x="-3000" y="-3000" width="7000" height="7000" fill="var(--w-wall)"/><rect x="40" y="20" width="880" height="500" rx="18" fill="var(--w-paper)" stroke="var(--w-felt-s)" stroke-width="2"/>';
 g+='<g transform="translate('+ARM.tx+' '+ARM.ty+') scale('+ARM.s+')">';
 if(o.ghost!=null)g+=armArt(o.ghost,{ghost:1});
 g+=armArt(phi,Object.assign({},o,{ghost:null}))+(o.lbl===false?'':armLabels(phi,o.skin))+'</g>';
 if(o.pull){const E=q=>{const H=armPts(q).H;return [(H.x-66)*ARM.s+ARM.tx,H.y*ARM.s+ARM.ty]},e=E(phi);
  g+=hand(e[0],e[1],0,1.05,0);
  if(o.from!=null){const b=E(o.from),d=Math.hypot(e[0]-b[0],e[1]-b[1]),ux=(e[0]-b[0])/d,uy=(e[1]-b[1])/d;g+=arrow(f1(b[0]-uy*60),f1(b[1]+ux*60),f1(e[0]-uy*60-ux*20),f1(e[1]+ux*60-uy*20),'var(--lb-sci)',6)}}
 return g}
/* 모형 부품(만들기 전, 옆에 놓인 모습) */
function partsArt(which){let g='';const B=(x,y,h)=>'<rect x="'+x+'" y="'+y+'" width="30" height="'+h+'" rx="14" fill="#F7F0DC" stroke="#A89A78" stroke-width="3"/>';
 if(which.indexOf('b')>=0)g+=B(560,90,190)+B(620,110,170);
 if(which.indexOf('i')>=0)g+='<ellipse cx="700" cy="200" rx="22" ry="90" fill="'+MCOL.in[0]+'" stroke="'+MCOL.in[1]+'" stroke-width="2.5"/>';
 if(which.indexOf('h')>=0)g+='<rect x="660" y="330" width="80" height="24" rx="6" fill="#FFD166" stroke="#A8842E" stroke-width="2"/>';
 if(which.indexOf('o')>=0)g+='<ellipse cx="790" cy="200" rx="20" ry="80" fill="'+MCOL.out[0]+'" stroke="'+MCOL.out[1]+'" stroke-width="2.5"/>';
 if(which.indexOf('s')>=0)for(let i=0;i<6;i++)g+='<circle cx="'+(600+i*40)+'" cy="440" r="11" fill="#7D8A95" stroke="#FFFFFF" stroke-width="2"/>';
 return g}

/* ───────── 실험 2: 소화기관 도안 · 소화 과정 막대 ───────── */
const DG={x:150,y:22,s:1.06};
const DP=(x,y)=>[x*DG.s+DG.x,y*DG.s+DG.y];
/* 구멍(도안 좌표) — 입·식도·위·작은창자·큰창자·항문 */
const HOLE={s1:[160,84],s2:[161,140],s3:[200,206],s4:[160,280],s5:[206,276],s6:[161,336]};
const ORGK={oEso:'eso',oSto:'stomach',oSmall:'small',oLarge:'large'};
const ORGC={oEso:[164,140],oSto:[198,204],oSmall:[162,280],oLarge:[206,280]};
const ORGSPOT={};Object.keys(ORGC).forEach(k=>{const p=DP(ORGC[k][0],ORGC[k][1]);ORGSPOT[k]=[Math.round(p[0]),Math.round(p[1]),k==='oSmall'?52:44,2.3,730,270]});
function foodPic(k,cx,cy,R){const T=(n,size,col,seed)=>{let o='';for(let i=0;i<n;i++){const a=(i*137.5+seed)*DEG,r=Math.sqrt((i+.5)/n)*R*.66,x=cx+r*Math.cos(a),y=cy+r*Math.sin(a);o+='<rect x="'+f1(x-size/2)+'" y="'+f1(y-size/2)+'" width="'+size+'" height="'+f1(size*.8)+'" rx="'+f1(size/4)+'" fill="'+col+'" transform="rotate('+(i*23)+' '+f1(x)+' '+f1(y)+')"/>'}return o};
 const s=R/120;let g='<circle cx="'+cx+'" cy="'+cy+'" r="'+R+'" fill="#FBE9DC"/>';
 if(k==='s1')g+=T(5,52*s,'#F2C27A',0)+T(3,40*s,'#D9604C',60);
 if(k==='s2')g+=T(10,30*s,'#F0C48A',10)+T(5,24*s,'#D9805F',40);
 if(k==='s3')g+='<circle cx="'+cx+'" cy="'+cy+'" r="'+f1(R*.66)+'" fill="#F6E2B8" opacity=".7"/>'+T(24,16*s,'#EFC59A',20);
 if(k==='s4')g+='<circle cx="'+cx+'" cy="'+cy+'" r="'+f1(R*.75)+'" fill="#F7E6C4"/>'+T(40,6*s,'#E7B77F',30);
 if(k==='s5')g+=T(14,22*s,'#9A6A3A',50);
 if(k==='s6')g+=T(6,30*s,'#7A4A24',70);
 return g}
function doanArt(o){o=o||{};let g='<g transform="translate('+DG.x+' '+DG.y+') scale('+DG.s+')">';
 if(o.stick!=null){const off=o.stick;g+='<g'+(o.stickAnim?an('lb-a-fade',0):'')+'><rect x="140" y="'+f1(-34+off)+'" width="40" height="'+(o.stickIn?150:420)+'" rx="6" fill="#E7D3AC" stroke="#B99E6E" stroke-width="2.5"/><rect x="146" y="'+f1(-28+off)+'" width="28" height="18" rx="4" fill="#B99E6E"/></g>'}
 g+='<rect x="26" y="4" width="268" height="466" rx="14" fill="var(--w-paper)" stroke="#BDB4A2" stroke-width="2.5"/>';
 if(o.stick!=null&&!o.stickIn)g+='<rect x="140" y="-4" width="40" height="10" fill="#E7D3AC" stroke="#B99E6E" stroke-width="2"/>';
 g+=bodyBase({mouth:1,noArms:0})+ORG.liver+ORG.gall+ORG.stomach+ORG.pancreas+ORG.large+ORG.small+ORG.anus+ORG.eso+ORG.mouth;
 if(o.hi){const c=ORGC[o.hi];g+='<circle cx="'+c[0]+'" cy="'+c[1]+'" r="'+(o.hi==='oSmall'?40:32)+'" fill="none" stroke="var(--lb-lens)" stroke-width="4" stroke-dasharray="8 6"/>'}
 if(o.holes)Object.keys(HOLE).forEach(k=>{const h=HOLE[k],seen=o.seen&&o.seen[k],cur=o.cur===k;
  g+='<circle cx="'+h[0]+'" cy="'+h[1]+'" r="10" fill="#3A3F48" stroke="#FFFFFF" stroke-width="2"/>';
  if(seen||cur)g+='<g'+(cur&&o.anim?an('lb-a-fade',.4):'')+'>'+foodPic(k,h[0],h[1],8.5)+'</g>';
  if(cur)g+='<circle cx="'+h[0]+'" cy="'+h[1]+'" r="15" fill="none" stroke="#C26A00" stroke-width="3.5"/>'});
 return g+'</g>'}
function foodLens(k,anim){const h=DP(HOLE[k][0],HOLE[k][1]),L=[720,262],R=150;let g='<path d="M'+f1(h[0]+12)+' '+f1(h[1])+' L'+(L[0]-R)+' '+L[1]+'" stroke="#C26A00" stroke-width="3" stroke-dasharray="7 6"/>';
 g+='<g'+(anim?an('lb-a-pop',.3):'')+'><circle cx="'+L[0]+'" cy="'+L[1]+'" r="'+(R+10)+'" fill="#2F3E46"/>'+foodPic(k,L[0],L[1],R)+'<circle cx="'+L[0]+'" cy="'+L[1]+'" r="'+R+'" fill="none" stroke="#C97A4F" stroke-width="8"/></g>';
 const nm=TIMES.e2s.find(x=>x[0]===k)[1];g+=mini(L[0],L[1]+R+40,nm+' 쪽 구멍',20);return g}
function deskBg(){return bg({})}

/* ───────── 실험 3: 수조 · 호스가 달린 펌프 ───────── */
const PU={tx0:180,tx1:780,wy:362,by:470,pumpX:[420,580],py:180};
const UPP=[[300,452],[300,PU.py],[PU.pumpX[0],PU.py]],DNP=[[PU.pumpX[1],PU.py],[700,PU.py],[700,300]];
function plen(P){let L=0;for(let i=1;i<P.length;i++)L+=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);return L}
function pat(P,s){for(let i=1;i<P.length;i++){const l=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);if(s<=l){const q=s/l;return [P[i-1][0]+(P[i][0]-P[i-1][0])*q,P[i-1][1]+(P[i][1]-P[i-1][1])*q]}s-=l}return P[P.length-1]}
const LUP=plen(UPP),LDN=plen(DNP),GAP=24,STEP=58;
function tankArt(o){o=o||{};const T=PU;let g=shadow(480,T.by+6,320);
 const wc=o.dye?'#D8433A':'rgba(141,200,232,.55)';
 g+='<rect x="'+(T.tx0+4)+'" y="'+T.wy+'" width="'+(T.tx1-T.tx0-8)+'" height="'+(T.by-T.wy-4)+'" fill="'+wc+'"'+(o.dye?' fill-opacity="'+(o.dyeOp==null?.78:o.dyeOp)+'"':'')+'/>';
 g+='<path d="M'+T.tx0+' 300 V'+T.by+' H'+T.tx1+' V300" fill="none" stroke="#7F9BAB" stroke-width="6" stroke-linejoin="round"/>';
 return g}
function hoseLine(P,col,w){return '<path d="M'+P.map(p=>f1(p[0])+' '+f1(p[1])).join(' L')+'" fill="none" stroke="'+col+'" stroke-width="'+w+'" stroke-linejoin="round" stroke-linecap="round"/>'}
function pumpBulb(sq){const ry=30-14*sq,cx=(PU.pumpX[0]+PU.pumpX[1])/2;
 return '<ellipse cx="'+cx+'" cy="'+PU.py+'" rx="'+(82+6*sq)+'" ry="'+f1(ry)+'" fill="#3A3F45" stroke="#20242A" stroke-width="3"/><rect x="'+(PU.pumpX[0]-8)+'" y="'+(PU.py-10)+'" width="16" height="20" rx="4" fill="#5A606B"/><rect x="'+(PU.pumpX[1]-8)+'" y="'+(PU.py-10)+'" width="16" height="20" rx="4" fill="#5A606B"/>'}
function squeezeHand(sq){const cx=(PU.pumpX[0]+PU.pumpX[1])/2,y=PU.py-(30-14*sq)-4;
 return '<path d="M'+(cx-58)+' '+f1(y)+' Q'+cx+' '+f1(y-40+18*sq)+' '+(cx+58)+' '+f1(y)+'" fill="'+SKIN+'" stroke="'+SKL+'" stroke-width="3"/><path d="M'+(cx-58)+' '+f1(PU.py+(30-14*sq)+4)+' Q'+cx+' '+f1(PU.py+44-18*sq)+' '+(cx+58)+' '+f1(PU.py+(30-14*sq)+4)+'" fill="'+SKIN+'" stroke="'+SKL+'" stroke-width="3"/>'}
/* o: dye, hose(놓였는지), sq(쥔 정도), up/dn(물이 움직인 거리), drops, arrow: 'dn'|'up' */
function pumpScene(o){o=o||{};let g=bg({});
 g+=tankArt(o);
 if(!o.hose){g+='<g transform="translate(830 300)">'+itemArt('pump')+'</g>';return g}
 const red=o.dye,hc='rgba(232,244,250,.9)';
 g+=hoseLine(UPP,'#9AB4C4',22)+hoseLine(DNP,'#9AB4C4',22)+hoseLine(UPP,hc,16)+hoseLine(DNP,hc,16);
 if(red){const up=o.up||0,dn=o.dn||0;
  /* 물에 잠긴 부분은 처음부터 물이 차 있음. 호스 속 붉은 점 */
  for(let s=(up%GAP+GAP)%GAP;s<LUP;s+=GAP){const p=pat(UPP,s);g+='<circle cx="'+f1(p[0])+'" cy="'+f1(p[1])+'" r="5.5" fill="#C62F24"/>'}
  for(let s=(dn%GAP+GAP)%GAP;s<LDN;s+=GAP){const p=pat(DNP,s);g+='<circle cx="'+f1(p[0])+'" cy="'+f1(p[1])+'" r="5.5" fill="#C62F24"/>'}
  if(o.drops)for(let i=0;i<3;i++){const y=306+((o.drops*60+i*20)%54);g+='<ellipse cx="700" cy="'+f1(y)+'" rx="5" ry="8" fill="#C62F24"/>'}}
 g+=pumpBulb(o.sq||0);
 if(o.sq!=null&&o.hand)g+=squeezeHand(o.sq||0);
 g+=hand(742,286,180,1,1);
 if(o.arrow==='dn')g+=arrow(600,140,680,140,'var(--lb-sci)',6)+arrow(740,210,740,270,'var(--lb-sci)',6);
 if(o.arrow==='up')g+=arrow(260,330,260,250,'var(--lb-sci)',6)+arrow(330,140,400,140,'var(--lb-sci)',6);
 if(!NAR&&o.lbl!==false)g+=tag(300,120,'물에 잠긴 호스',18)+tag(750,110,'물에 잠기지 않은 호스',18)+tag(500,252,'펌프',18);
 else if(o.lbl!==false)LEG.push([null,'왼쪽: 물에 잠긴 호스 · 오른쪽: 물에 잠기지 않은 호스']);
 return g}

/* ───────── 실험 4: 호흡기관 모형(종이봉투 · 주름 빨대) ───────── */
const BG4={x:480,top:96,j:262};
function straws(o){o=o||{};const X=BG4.x,T=BG4.top,J=BG4.j;let g='';
 const S=(d)=>'<path d="'+d+'" fill="none" stroke="#7FB3D9" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/><path d="'+d+'" fill="none" stroke="#E8F4FA" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>';
 if(o.joined){g+=S('M'+(X-7)+' '+T+' V'+J+' Q'+(X-7)+' '+(J+20)+' '+(X-40)+' '+(J+44)+' L'+(X-110)+' '+(J+86))+S('M'+(X+7)+' '+T+' V'+J+' Q'+(X+7)+' '+(J+20)+' '+(X+40)+' '+(J+44)+' L'+(X+110)+' '+(J+86));
  for(let y=T+24;y<J-10;y+=36)g+='<rect x="'+(X-18)+'" y="'+y+'" width="36" height="12" rx="3" fill="rgba(255,255,230,.75)" stroke="#C9B98A" stroke-width="1.5"/>'}
 else g+=S('M'+(X-90)+' '+T+' V'+J+' Q'+(X-90)+' '+(J+20)+' '+(X-120)+' '+(J+44))+S('M'+(X+90)+' '+T+' V'+J+' Q'+(X+90)+' '+(J+20)+' '+(X+120)+' '+(J+44));
 return g}
/* 종이봉투: p = 부푼 정도(0~1) */
function bag(cx,top,p,o){o=o||{};const w=58+40*p,h=150+6*p,b=top+h;
 if(o.ghost)return '<path d="M'+(cx-58)+' '+top+' L'+(cx-58)+' '+(top+150)+' H'+(cx+58)+' L'+(cx+58)+' '+top+'" fill="none" stroke="#6B7686" stroke-width="2.5" stroke-dasharray="7 6" opacity=".75"/>';
 let g='<path d="M'+(cx-22)+' '+top+' Q'+f1(cx-w)+' '+f1(top+20)+' '+f1(cx-w)+' '+f1(top+h*.55)+' Q'+f1(cx-w)+' '+b+' '+cx+' '+b+' Q'+f1(cx+w)+' '+b+' '+f1(cx+w)+' '+f1(top+h*.55)+' Q'+f1(cx+w)+' '+f1(top+20)+' '+(cx+22)+' '+top+'Z" fill="#E7D3AC" stroke="#B99E6E" stroke-width="3"/>';
 if(p<.5)g+='<path d="M'+(cx-30)+' '+(top+50)+' l18 14 l-10 22 l16 18 M'+(cx+24)+' '+(top+70)+' l-12 16 l14 20" fill="none" stroke="#B99E6E" stroke-width="2" opacity="'+f1(1-2*p)+'"/>';
 g+='<rect x="'+(cx-24)+'" y="'+(top-6)+'" width="48" height="16" rx="3" fill="rgba(255,255,230,.8)" stroke="#C9B98A" stroke-width="1.5"/>';
 return g}
function lungModel(o){o=o||{};const X=BG4.x,J=BG4.j,p=o.p||0;let g='';
 if(o.bags!==false){g+=bag(X-120,J+86,p)+bag(X+120,J+86,p);if(o.ghost){g+=bag(X-120,J+86,0,{ghost:1})+bag(X+120,J+86,0,{ghost:1})}}
 g+=straws({joined:true});
 if(o.stk){const L=(x,y,t)=>NAR?'':tag(x,y,t,17);g+='<g'+(o.stkAnim?an('lb-a-pop',.3):'')+'>'+L(X+58,BG4.top+16,'코')+L(X+62,180,'숨관')+L(X-150,J+30,'숨관가지')+L(X+150,J+30,'숨관가지')+L(X-120,J+190,'폐')+L(X+120,J+190,'폐')+'</g>';
  if(NAR)LEG.push([null,'붙임딱지: 코 · 숨관 · 숨관가지 · 폐'])}
 return g}
function blowFace(on){const X=BG4.x,T=BG4.top,C=T-50;
 let g='<path d="M'+X+' '+(T-20)+' V'+(T+2)+'" stroke="#7FB3D9" stroke-width="13" stroke-linecap="round"/><path d="M'+X+' '+(T-20)+' V'+(T+2)+'" stroke="#E8F4FA" stroke-width="7" stroke-linecap="round"/>';
 g+='<circle cx="'+X+'" cy="'+C+'" r="42" fill="'+SKIN+'" stroke="'+SKL+'" stroke-width="2.5"/><path d="M'+(X-40)+' '+(C-6)+' Q'+(X-40)+' '+(C-48)+' '+X+' '+(C-48)+' Q'+(X+42)+' '+(C-48)+' '+(X+40)+' '+(C-6)+' Q'+(X+30)+' '+(C-30)+' '+X+' '+(C-30)+' Q'+(X-30)+' '+(C-30)+' '+(X-40)+' '+(C-6)+'Z" fill="#5A4334"/><circle cx="'+(X-14)+'" cy="'+(C-2)+'" r="3.4" fill="#4A3A30"/><circle cx="'+(X+14)+'" cy="'+(C-2)+'" r="3.4" fill="#4A3A30"/>';
 if(on)g+='<ellipse cx="'+(X-30)+'" cy="'+(C+20)+'" rx="9" ry="6" fill="#F3A9B2" opacity=".8"/><ellipse cx="'+(X+30)+'" cy="'+(C+20)+'" rx="9" ry="6" fill="#F3A9B2" opacity=".8"/>';
 return g+'<ellipse cx="'+X+'" cy="'+(C+30)+'" rx="10" ry="7" fill="#C4544A"/>'}
/* 숨 쉴 때 가슴(원본 u4-4 가슴 변화 그림): p = 들이마신 정도 */
function chestArt(p,o){o=o||{};const sc=1+.1*p;let g='<g transform="translate(160 200) scale('+f1(1+.05*p)+' '+f1(1+.03*p)+') translate(-160 -200)">'+bodyBase({})+'<g transform="translate(160 176) scale('+f1(sc)+') translate(-160 -176)">'+ORG.lungL+ORG.lungR+'</g>'+ORG.bronchi+ORG.trachea+'</g>';
 if(o.hands){const hy=172-12*p;g+='<g fill="#F6D9C0" stroke="#C9906A" stroke-width="2.5"><rect x="'+f1(104-6*p)+'" y="'+f1(hy)+'" width="50" height="30" rx="14"/><rect x="'+f1(166+6*p)+'" y="'+f1(hy)+'" width="50" height="30" rx="14"/></g>'}
 return g}
const TORSO='M92 132 Q160 116 228 132 Q244 140 240 172 L236 214 Q232 276 222 334 L98 334 Q88 276 84 214 L80 172 Q76 140 92 132Z';
function chestScene(p,o){o=o||{};let g=bg({})+'<g transform="translate(300 10) scale(1.12)">'+chestArt(p,o);
 if(o.ghost!=null){const q=o.ghost,hy=172-12*q;g+='<g fill="none" stroke="#3E4A5C" stroke-width="2.5" stroke-dasharray="7 6" opacity=".85"><path d="'+TORSO+'" transform="translate(160 200) scale('+f1(1+.05*q)+' '+f1(1+.03*q)+') translate(-160 -200)"/><rect x="'+f1(104-6*q)+'" y="'+f1(hy)+'" width="50" height="30" rx="14"/><rect x="'+f1(166+6*q)+'" y="'+f1(hy)+'" width="50" height="30" rx="14"/></g>'}
 if(o.air==='in')g+=arrow(160,-30,160,40,'#3F84AD',5);
 if(o.air==='out')g+=arrow(160,40,160,-30,'#3F84AD',5);
 return g+'</g>'}

/* ───────── 실험 5: 운동하는 친구 · 체온계 · 맥박 수 측정 앱 ───────── */
/* 앞에서 본 친구. o.arms: down|up|run, o.legs: stand|jump|sit, o.flush 얼굴이 빨개짐, o.sweat 땀 */
function kid(x,yb,o){o=o||{};const hy=o.legs==='sit'?yb-200:yb-262;let g='';
 const L=(x1,y1,x2,y2,w,c)=>'<path d="M'+x1+' '+y1+' L'+x2+' '+y2+'" stroke="'+(c||SKIN)+'" stroke-width="'+w+'" stroke-linecap="round"/>';
 const hipY=hy+150;
 if(o.legs==='sit')g+='<rect x="'+(x-70)+'" y="'+(hipY+6)+'" width="140" height="16" rx="6" fill="#B98E5E"/><path d="M'+(x-62)+' '+(hipY+22)+' V'+yb+' M'+(x+62)+' '+(hipY+22)+' V'+yb+'" stroke="#8A6239" stroke-width="8"/>'+L(x-20,hipY,x-26,yb-6,26,'#3D5A80')+L(x+20,hipY,x+26,yb-6,26,'#3D5A80');
 else if(o.legs==='jump')g+=L(x-18,hipY,x-34,yb-30,26,'#3D5A80')+L(x+18,hipY,x+30,yb-14,26,'#3D5A80');
 else g+=L(x-18,hipY,x-22,yb,26,'#3D5A80')+L(x+18,hipY,x+22,yb,26,'#3D5A80');
 const sh=hy+56;
 const arm=o.arms==='up'?[[x-44,sh+8,x-74,sh-90],[x+44,sh+8,x+74,sh-90]]:o.arms==='run'?[[x-44,sh+8,x-86,sh+60],[x+44,sh+8,x+78,sh-30]]:[[x-44,sh+8,x-60,sh+110],[x+44,sh+8,x+60,sh+110]];
 g+=arm.map(a=>L(a[0],a[1],a[2],a[3],20)).join('');
 g+='<path d="M'+(x-46)+' '+(sh)+' Q'+x+' '+(sh-12)+' '+(x+46)+' '+sh+' L'+(x+40)+' '+(hipY+6)+' H'+(x-40)+'Z" fill="#E86F51" stroke="#B4513A" stroke-width="2.5"/>';
 g+='<circle cx="'+x+'" cy="'+(hy+8)+'" r="40" fill="'+SKIN+'" stroke="'+SKL+'" stroke-width="2.5"/><path d="M'+(x-40)+' '+(hy+4)+' Q'+(x-40)+' '+(hy-36)+' '+x+' '+(hy-36)+' Q'+(x+42)+' '+(hy-36)+' '+(x+40)+' '+(hy+4)+' Q'+(x+30)+' '+(hy-18)+' '+x+' '+(hy-18)+' Q'+(x-30)+' '+(hy-18)+' '+(x-40)+' '+(hy+4)+'Z" fill="#5A4334"/>';
 g+='<circle cx="'+(x-14)+'" cy="'+(hy+8)+'" r="3.4" fill="#4A3A30"/><circle cx="'+(x+14)+'" cy="'+(hy+8)+'" r="3.4" fill="#4A3A30"/>';
 g+=o.flush?'<ellipse cx="'+(x-24)+'" cy="'+(hy+22)+'" rx="9" ry="6" fill="#F08080" opacity=".85"/><ellipse cx="'+(x+24)+'" cy="'+(hy+22)+'" rx="9" ry="6" fill="#F08080" opacity=".85"/><ellipse cx="'+x+'" cy="'+(hy+30)+'" rx="7" ry="6" fill="#B5654F"/>':'<path d="M'+(x-9)+' '+(hy+27)+' Q'+x+' '+(hy+34)+' '+(x+9)+' '+(hy+27)+'" stroke="#B5654F" stroke-width="2.5" fill="none" stroke-linecap="round"/>';
 if(o.sweat)g+='<path d="M'+(x+44)+' '+(hy-6)+' q6 10 0 16 q-6 -6 0 -16Z M'+(x-48)+' '+(hy+10)+' q6 10 0 16 q-6 -6 0 -16Z" fill="#7FB8E0"/>';
 return g}
/* 체온계 화면 · 맥박 수 측정 앱 화면. v: 보이는 숫자(없으면 --), busy: 재는 중(0~1) */
function thermoArt(x,y,v,busy){let g='<rect x="'+(x-130)+'" y="'+(y-62)+'" width="260" height="124" rx="22" fill="#FFFFFF" stroke="#9AA6B2" stroke-width="3"/><rect x="'+(x-112)+'" y="'+(y-44)+'" width="224" height="88" rx="10" fill="#DDEFE3" stroke="#7FA38C" stroke-width="2"/>';
 g+='<text x="'+(x+16)+'" y="'+(y+22)+'" text-anchor="middle" font-size="58" font-weight="800" fill="#17331F">'+(busy!=null?'--.-':v||'--.-')+'</text><text x="'+(x+92)+'" y="'+(y+20)+'" text-anchor="middle" font-size="22" font-weight="800" fill="#17331F">°C</text>';
 g+='<path d="M'+(x-96)+' '+(y-24)+' v44 a8 8 0 1 0 12 0 v-44 a6 6 0 0 0 -12 0Z" fill="none" stroke="#17331F" stroke-width="2.5"/>';
 if(busy!=null)g+='<rect x="'+(x-60)+'" y="'+(y+30)+'" width="'+f1(150*busy)+'" height="6" rx="3" fill="#2E7D4F"/>';
 if(!NAR)g+='<text x="'+x+'" y="'+(y-74)+'" text-anchor="middle" font-size="19" font-weight="800" fill="var(--w-labeltx)">체온계</text>';
 return g}
function phoneArt(x,y,v,busy){let g='<rect x="'+(x-112)+'" y="'+(y-100)+'" width="224" height="200" rx="26" fill="#2A3342" stroke="#141A26" stroke-width="3"/><rect x="'+(x-98)+'" y="'+(y-86)+'" width="196" height="172" rx="14" fill="#FFFFFF"/>';
 g+='<path d="M'+x+' '+(y-24)+' C'+(x-8)+' '+(y-38)+' '+(x-30)+' '+(y-38)+' '+(x-30)+' '+(y-56)+' C'+(x-30)+' '+(y-72)+' '+(x-8)+' '+(y-74)+' '+x+' '+(y-60)+' C'+(x+8)+' '+(y-74)+' '+(x+30)+' '+(y-72)+' '+(x+30)+' '+(y-56)+' C'+(x+30)+' '+(y-38)+' '+(x+8)+' '+(y-38)+' '+x+' '+(y-24)+'Z" fill="#D9443A"'+(busy!=null?' transform="translate('+x+' '+(y-48)+') scale('+f1(1+.12*Math.abs(Math.sin(busy*Math.PI*9)))+') translate('+(-x)+' '+(48-y)+')"':'')+'/>';
 g+='<text x="'+x+'" y="'+(y+38)+'" text-anchor="middle" font-size="56" font-weight="800" fill="#141A26">'+(busy!=null?'--':v||'--')+'</text><text x="'+x+'" y="'+(y+70)+'" text-anchor="middle" font-size="19" font-weight="800" fill="#4B5465">회 / 1분</text>';
 if(busy!=null){const a=busy*2*Math.PI,r=20,cx=x+70,cy=y-58;g+='<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="none" stroke="#E3E0D8" stroke-width="6"/><path d="M'+cx+' '+(cy-r)+' A'+r+' '+r+' 0 '+(busy>.5?1:0)+' 1 '+f1(cx+r*Math.sin(a))+' '+f1(cy-r*Math.cos(a))+'" fill="none" stroke="#2E7D4F" stroke-width="6"/>'}
 if(!NAR)g+='<text x="'+x+'" y="'+(y+126)+'" text-anchor="middle" font-size="19" font-weight="800" fill="var(--w-labeltx)">맥박 수 측정 앱</text>';
 return g}
function clockArt(x,y,p){const a=p*300*DEG;return '<circle cx="'+x+'" cy="'+y+'" r="54" fill="#FFFFFF" stroke="#4B5465" stroke-width="4"/>'+[0,1,2,3,4,5,6,7,8,9,10,11].map(i=>'<path d="M'+f1(x+46*Math.sin(i*30*DEG))+' '+f1(y-46*Math.cos(i*30*DEG))+' L'+f1(x+52*Math.sin(i*30*DEG))+' '+f1(y-52*Math.cos(i*30*DEG))+'" stroke="#4B5465" stroke-width="3"/>').join('')+
 '<path d="M'+x+' '+y+' L'+x+' '+(y-30)+'" stroke="#141A26" stroke-width="5" stroke-linecap="round"/><path d="M'+x+' '+y+' L'+f1(x+44*Math.sin(a))+' '+f1(y-44*Math.cos(a))+'" stroke="#C26A00" stroke-width="4" stroke-linecap="round"/><path d="M'+x+' '+y+' A44 44 0 '+(p>.5?1:0)+' 1 '+f1(x+44*Math.sin(a))+' '+f1(y-44*Math.cos(a))+'Z" fill="#C26A00" opacity=".18"/>'}
function measScene(i,o){o=o||{};let g=bg({})+kid(250,470,{legs:o.sit?'sit':'stand',flush:o.flush,sweat:o.sweat});
 g+=thermoArt(690,140,o.T,o.tb)+phoneArt(690,370,o.P,o.pb);
 return g}
/* 결과 한 장: 맥박 수(막대)와 체온(점과 선) 그래프 — 원본 u4-6 그래프와 같은 짜임, 학생이 적은 숫자로 그림 */
function graphArt(P,T){const X=[200,400,600],yP=v=>440-(v-60)*3.6,yT=v=>440-(v-36)*300;let g='<rect x="0" y="0" width="800" height="520" fill="#FFFFFF"/>';
 for(let v=60;v<=110;v+=10)g+='<path d="M120 '+f1(yP(v))+' H680" stroke="#E3E0D8" stroke-width="2"/><text x="110" y="'+f1(yP(v)+7)+'" text-anchor="end" font-size="20" fill="#4B5465">'+v+'</text>';
 for(let v=36;v<=37;v+=.2)g+='<text x="690" y="'+f1(yT(v)+7)+'" font-size="20" fill="#B4513A">'+v.toFixed(1)+'</text>';
 g+='<path d="M120 440 H680 M120 440 V60" stroke="#141A26" stroke-width="3"/>';
 X.forEach((x,i)=>{if(P[i]!=null)g+='<rect x="'+(x-44)+'" y="'+f1(yP(P[i]))+'" width="88" height="'+f1(440-yP(P[i]))+'" fill="#3F84AD"/><text x="'+x+'" y="'+f1(yP(P[i])-10)+'" text-anchor="middle" font-size="22" font-weight="800" fill="#141A26">'+P[i]+'</text>';
  g+='<text x="'+x+'" y="480" text-anchor="middle" font-size="22" font-weight="800" fill="#141A26">'+['운동 전','운동 직후','5분 쉰 뒤'][i]+'</text>'});
 const pts=X.map((x,i)=>T[i]!=null?[x,yT(T[i])]:null).filter(Boolean);
 if(pts.length>1)g+='<path d="M'+pts.map(p=>p[0]+' '+f1(p[1])).join(' L')+'" stroke="#D9443A" stroke-width="4" fill="none"/>';
 pts.forEach(p=>{g+='<circle cx="'+p[0]+'" cy="'+f1(p[1])+'" r="9" fill="#D9443A" stroke="#FFFFFF" stroke-width="2"/>'});
 g+='<rect x="140" y="12" width="20" height="20" fill="#3F84AD"/><text x="168" y="30" font-size="20" fill="#141A26">1분 동안의 맥박 수(회)</text><circle cx="470" cy="22" r="9" fill="#D9443A"/><text x="486" y="30" font-size="20" fill="#141A26">체온(°C)</text>';
 return g}

/* ───────── 보호 장구 ───────── */
function glove(x,y,s){return '<g transform="translate('+x+' '+y+') scale('+(s||1)+')"><path d="M-26 40 V-6 Q-34 -20 -30 -40 Q-26 -48 -20 -40 L-18 -12 V-50 Q-14 -60 -8 -50 V-14 V-58 Q-2 -66 4 -58 V-14 V-52 Q10 -60 16 -52 V-8 L22 -24 Q30 -32 34 -22 L24 18 Q20 34 18 40Z" fill="#DCEEF9" stroke="#5F8FA0" stroke-width="3" stroke-linejoin="round"/></g>'}
function gearArt3(on,anim){if(!on)return coat(300,250,1.4)+gog(520,220,1.1,GOG.clr[0],GOG.clr[1])+glove(720,240,1.4)+qmark(480,90);
 return '<g'+(anim?an('lb-a-up',0,'--from:100px'):'')+'>'+coat(480,262,1.75)+'<circle cx="480" cy="116" r="38" fill="#F2C6A0" stroke="#B9875F" stroke-width="3"/>'+gog(480,108,.82,GOG.clr[0],GOG.clr[1])+glove(370,330,1)+glove(590,330,1)+'</g>'}

/* ───────── 준비물 그림 ───────── */
function itemArt(k){const A={
  bones:'<rect x="-34" y="-56" width="26" height="112" rx="12" fill="#F7F0DC" stroke="#A89A78" stroke-width="3"/><rect x="10" y="-46" width="26" height="102" rx="12" fill="#F7F0DC" stroke="#A89A78" stroke-width="3"/>',
  muscles:'<ellipse cx="-22" cy="0" rx="18" ry="58" fill="'+MCOL.in[0]+'" stroke="'+MCOL.in[1]+'" stroke-width="2.5"/><ellipse cx="24" cy="0" rx="16" ry="52" fill="'+MCOL.out[0]+'" stroke="'+MCOL.out[1]+'" stroke-width="2.5"/>',
  handle:'<rect x="-46" y="-14" width="92" height="28" rx="7" fill="#FFD166" stroke="#A8842E" stroke-width="2.5"/>',
  snaps:[0,1,2,3,4,5].map(i=>'<circle cx="'+(-50+(i%3)*50)+'" cy="'+(i<3?-18:24)+'" r="14" fill="#7D8A95" stroke="#FFFFFF" stroke-width="2.5"/>').join(''),
  doan:'<g transform="translate(-50 -66) scale(.31)"><rect x="26" y="4" width="268" height="466" rx="14" fill="#FFFDF8" stroke="#BDB4A2" stroke-width="5"/>'+bodyBase({mouth:1})+ORG.stomach+ORG.large+ORG.small+ORG.eso+'</g>',
  stick:'<rect x="-16" y="-62" width="32" height="124" rx="5" fill="#E7D3AC" stroke="#B99E6E" stroke-width="2.5"/>'+[0,1,2,3].map(i=>'<circle cx="0" cy="'+(-40+i*28)+'" r="8" fill="'+['#F2C27A','#EFC59A','#E7B77F','#7A4A24'][i]+'"/>').join(''),
  tank:'<rect x="-60" y="-14" width="120" height="54" fill="rgba(141,200,232,.55)"/><path d="M-62 -40 V42 H62 V-40" fill="none" stroke="#7F9BAB" stroke-width="4"/>',
  dye:'<rect x="-18" y="-30" width="36" height="66" rx="8" fill="#D8433A" stroke="#8A1F19" stroke-width="2.5"/><rect x="-10" y="-50" width="20" height="22" rx="4" fill="#FFFFFF" stroke="#8A1F19" stroke-width="2"/>',
  pump:'<path d="M-90 30 Q-80 -20 -46 0 M46 0 Q80 -20 90 30" fill="none" stroke="#9AB4C4" stroke-width="12" stroke-linecap="round"/><ellipse cx="0" cy="0" rx="50" ry="22" fill="#3A3F45" stroke="#20242A" stroke-width="3"/>',
  coat:coat(0,4,.62),
  gog:gog(0,0,.62,GOG.clr[0],GOG.clr[1]),
  glove:glove(0,4,1),
  bags:'<path d="M-62 -40 H-10 V50 H-62Z M10 -40 H62 V50 H10Z" fill="#E7D3AC" stroke="#B99E6E" stroke-width="3"/>',
  straws:'<path d="M-20 52 V-30 Q-20 -46 -40 -56 M20 52 V-30 Q20 -46 40 -56" fill="none" stroke="#7FB3D9" stroke-width="11" stroke-linecap="round"/><path d="M-20 52 V-30 Q-20 -46 -40 -56 M20 52 V-30 Q20 -46 40 -56" fill="none" stroke="#E8F4FA" stroke-width="5" stroke-linecap="round"/>',
  tape:'<circle r="40" fill="rgba(255,255,230,.85)" stroke="#C9B98A" stroke-width="4"/><circle r="20" fill="var(--w-label)" stroke="#C9B98A" stroke-width="3"/>',
  stick4:'<rect x="-62" y="-46" width="124" height="92" rx="8" fill="#FFFFFF" stroke="#9AA6B2" stroke-width="2.5"/>'+[0,1,2,3,4,5].map(i=>'<rect x="'+(-50+(i%3)*36)+'" y="'+(i<3?-34:6)+'" width="28" height="26" rx="5" fill="'+['#F3A9B2','#CFE7F2','#7FB3D9'][i%3]+'"/>').join(''),
  thermo:'<rect x="-60" y="-34" width="120" height="68" rx="14" fill="#FFFFFF" stroke="#9AA6B2" stroke-width="3"/><rect x="-46" y="-20" width="92" height="40" rx="6" fill="#DDEFE3" stroke="#7FA38C" stroke-width="2"/>',
  phone:'<rect x="-40" y="-60" width="80" height="120" rx="14" fill="#2A3342"/><rect x="-32" y="-50" width="64" height="98" rx="6" fill="#FFFFFF"/><path d="M0 -4 C-4 -10 -16 -10 -16 -20 C-16 -28 -4 -30 0 -22 C4 -30 16 -28 16 -20 C16 -10 4 -10 0 -4Z" fill="#D9443A"/>'};
 return A[k]||''}
function itemArtAt(k,x,y){return '<g transform="translate('+x+' '+y+') scale(1.4)">'+itemArt(k)+'</g>'}
