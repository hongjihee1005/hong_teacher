/* ───────── 그림: 실험대 장면 — 모두 직접 그린 SVG (혼합물의 분리) ───────── */
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
function bgTop(){let g='<rect x="-3000" y="-3000" width="7000" height="7000" fill="var(--w-top)"/>';
 for(let i=0;i<14;i++)g+='<path d="M-3000 '+(-40+i*46)+' Q480 '+(-30+i*46+(i%2?10:-10))+' 4000 '+(-40+i*46)+'" stroke="var(--w-grain)" stroke-width="1.4" fill="none" opacity=".28"/>';
 return g}
const P2=pts=>'M'+pts.map(p=>p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' L')+' Z';
function rnd(i,s){const h=Math.sin(i*12.9898+(s||0)*78.233)*43758.5453;return h-Math.floor(h)}
function magnifier(x,y,s,rot){return '<g transform="translate('+x+' '+y+') rotate('+(rot||0)+') scale('+(s||1)+')"><circle r="34" fill="#E8F4FA" fill-opacity=".35" stroke="#2B3445" stroke-width="7"/><path d="M24 24 L62 62" stroke="#6B4A2B" stroke-width="13" stroke-linecap="round"/><path d="M-16 -18 a24 24 0 0 1 20 -8" stroke="#FFFFFF" stroke-width="4" fill="none" opacity=".8"/></g>'}
function chip(x,y,n,r){r=r||20;return '<g><circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="#FFD54A" stroke="#9A7300" stroke-width="2"/><text x="'+x+'" y="'+(y+r*.36)+'" text-anchor="middle" font-size="'+(r*1.05)+'" font-weight="800" fill="#3B2A00">'+n+'</text></g>'}
function coat(x,y,s){return '<g transform="translate('+x+' '+y+') scale('+(s||1)+')"><path d="M-46 -64 L-18 -72 L0 -40 L18 -72 L46 -64 L62 30 L40 34 L36 -10 L34 72 H-34 L-36 -10 L-40 34 L-62 30Z" fill="#FFFFFF" stroke="#9AA6B2" stroke-width="3" stroke-linejoin="round"/><path d="M0 -40 V72" stroke="#9AA6B2" stroke-width="2"/><circle cx="-7" cy="-6" r="3" fill="#9AA6B2"/><circle cx="-7" cy="22" r="3" fill="#9AA6B2"/><rect x="12" y="10" width="16" height="12" rx="2" fill="none" stroke="#9AA6B2" stroke-width="2"/></g>'}
function itemArtAt(k,x,y){return '<g transform="translate('+x+' '+y+') scale(1.4)">'+itemArt(k)+'</g>'}
function toolsScene(list,anim){let b='';if(NAR)list.forEach(it=>LEG.push([null,it[1]]));const n=list.length,cols=n<=4?n:n<=6?3:n<=8?4:5,rows=Math.ceil(n/cols),cw=200,ch=176,gx=18,gy=18;
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

/* ───────── 보호 장비 ───────── */
function goggles(x,y,s){return '<g transform="translate('+x+' '+y+') scale('+(s||1)+')"><path d="M-46 -6 Q-46 -20 -30 -20 H30 Q46 -20 46 -6 V8 Q46 20 30 20 H12 Q0 8 -12 20 H-30 Q-46 20 -46 8Z" fill="#CFE8F5" fill-opacity=".75" stroke="#3D6A9C" stroke-width="4" stroke-linejoin="round"/><path d="M-46 -2 H-60 M46 -2 H60" stroke="#3D6A9C" stroke-width="5" stroke-linecap="round"/><path d="M-32 -10 L-20 -10" stroke="#FFFFFF" stroke-width="3" opacity=".8"/></g>'}
function cotton(x,y,rot,s){return hand(x,y,rot,s,1).replace('#FFFFFF','#F4F1EA').replace('#9AA6B2','#B5AE9F')}
/* 실험용 장갑(파란 고무 장갑) · 보호 장비 입기 */
function lglove(x,y,r,s){return hand(x,y,r,s,1).replace('#FFFFFF','#BFE0F2').replace('#9AA6B2','#4F82A3')}
function gearArt(on,anim){
 if(!on)return coat(330,250,1.4)+goggles(520,140,1.3)+'<g transform="translate(640 290) scale(1.4)">'+lglove(-14,-10,-60,.75)+lglove(22,8,-60,.75)+'</g>'+qmark(480,90);
 return '<g'+(anim?an('lb-a-up',0,'--from:100px'):'')+'><circle cx="480" cy="116" r="38" fill="#F2C6A0" stroke="#B9875F" stroke-width="3"/>'+goggles(480,108,.92)+coat(480,262,1.75)+lglove(330,240,-70,1.4)+lglove(630,240,-110,1.4)+'</g>'}
function clockArt(x,y,anim){return '<g transform="translate('+x+' '+y+')"><circle r="46" fill="#FFFFFF" stroke="#2A3342" stroke-width="5"/>'+[...Array(12)].map((_,i)=>{const a=i/12*Math.PI*2;return '<path d="M'+(Math.sin(a)*36).toFixed(1)+' '+(-Math.cos(a)*36).toFixed(1)+' L'+(Math.sin(a)*41).toFixed(1)+' '+(-Math.cos(a)*41).toFixed(1)+'" stroke="#2A3342" stroke-width="3"/>'}).join('')+
 '<path d="M0 0 V-24" stroke="#2A3342" stroke-width="5" stroke-linecap="round"/><g><path d="M0 0 L0 -34"'+(anim?' class="lb-a lb-a-spin"':'')+' stroke="#C2410C" stroke-width="4" stroke-linecap="round"/></g><circle r="5" fill="#2A3342"/></g>'}
/* 두 단계로 바뀌는 그림(앞 절반 → 뒤 절반) */
const PH1=d=>' class="lb-a lb-a-ph1" style="animation-duration:'+(d||1.6)+'s"',PH2=d=>' class="lb-a lb-a-ph2" style="animation-duration:'+(d||1.6)+'s"';

/* ───────── 알갱이(원본 u1-2의 stone을 옮김: 모양이 고르지 않은 다각형) ───────── */
const SANDC=['#C9A06A','#E1C48A','#9A8F84','#555555','#B07A4A'],GRAVC=['#8A7765','#9A9A9A','#5A524A','#A0673A'];
function stone(x,y,r,c,k){const n=6+(k%3),pts=[];for(let i=0;i<n;i++){const a=i/n*Math.PI*2,rr=r*(.72+rnd(k,i)*.4);pts.push([x+Math.cos(a)*rr,y+Math.sin(a)*rr*.82])}
 return '<path d="'+P2(pts)+'" fill="'+c+'" stroke="#3B2F25" stroke-width="'+Math.max(.6,r/10).toFixed(1)+'" stroke-linejoin="round"/>'}
/* 소금 알갱이(하얀색, 모양이 일정하지 않음) */
function salt(x,y,r,k){const n=4+(k%3),pts=[];for(let i=0;i<n;i++){const a=i/n*Math.PI*2+rnd(k,9),rr=r*(.75+rnd(k,i)*.35);pts.push([x+Math.cos(a)*rr,y+Math.sin(a)*rr])}
 return '<path d="'+P2(pts)+'" fill="#FBFBF8" stroke="#8C949C" stroke-width="'+Math.max(.6,r/9).toFixed(1)+'" stroke-linejoin="round"/>'}
/* 그릇에 담긴 알갱이 무더기(옆에서 본 모습). kind: sand gravel mix salt saltsand */
function pile(cx,b,w,kind,seed){let g='';const h=w*.32,col={sand:'#D9B97F',gravel:'#9C8C78',mix:'#CDAE7A',salt:'#F4F2EC',saltsand:'#D8C4A0'}[kind];
 g+='<path d="M'+(cx-w/2)+' '+b+' Q'+cx+' '+(b-h*2)+' '+(cx+w/2)+' '+b+'Z" fill="'+col+'" stroke="'+(kind==='salt'?'#A8AEB4':'#8A6E46')+'" stroke-width="2"/>';
 const inP=(x,y)=>{const t=(x-cx)/(w/2);return y<b-2&&y>b-h*(1-t*t)+2};
 if(kind!=='gravel'&&kind!=='salt')for(let i=0;i<70;i++){const x=cx-w/2+rnd(i,seed)*w,y=b-rnd(i,seed+1)*h;if(inP(x,y))g+='<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="1.6" fill="'+SANDC[i%5]+'"/>'}
 if(kind==='salt'||kind==='saltsand')for(let i=0;i<34;i++){const x=cx-w/2+rnd(i,seed+3)*w,y=b-rnd(i,seed+4)*h;if(inP(x,y))g+=salt(x,y,2.6,i)}
 if(kind==='gravel'||kind==='mix')for(let i=0;i<(kind==='gravel'?16:9);i++){const x=cx-w*.36+rnd(i,seed+5)*w*.72,y=b-4-rnd(i,seed+6)*h*.75;if(inP(x,y-3)||kind==='gravel')g+=stone(x,y,7+rnd(i,seed+7)*4,GRAVC[i%4],i)}
 return g}
/* 유리 그릇(옆에서 본 모습) */
function bowl(cx,b,w,inner){const h=w*.36;return shadow(cx,b+4,w/2+8)+(inner||'')+'<path d="M'+(cx-w/2-6)+' '+(b-h)+' Q'+(cx-w/2)+' '+b+' '+(cx-w/4)+' '+b+' H'+(cx+w/4)+' Q'+(cx+w/2)+' '+b+' '+(cx+w/2+6)+' '+(b-h)+'" fill="var(--w-glass)" stroke="var(--w-glass-s)" stroke-width="3"/>'}

/* ───────── 실험 1: 모래와 자갈 ───────── */
function mixScene(o){o=o||{};const done=!!o.done,a=!!o.anim;let g=bg({});
 g+=bowl(240,410,150,done&&!a?'':'<g'+(a?an('lb-a-out',.5):'')+'>'+pile(240,404,124,'sand',1)+'</g>');
 g+=bowl(720,410,150,done&&!a?'':'<g'+(a?an('lb-a-out',.5):'')+'>'+pile(720,404,124,'gravel',2)+'</g>');
 g+=bowl(480,410,200,done?'<g'+(a?an('lb-a-fade',.9):'')+'>'+pile(480,404,170,'mix',3)+'</g>':'');
 if(a)g+='<g'+an('lb-a-fade',1)+'>'+'<path d="M470 250 L520 360" stroke="#7A5A3A" stroke-width="6" stroke-linecap="round"/></g>';
 g+=mini(240,452,'모래',18)+mini(720,452,'자갈',18);return g}
/* 돋보기 속(같은 배율): w 's' 모래 · 'g' 자갈 */
function loupeIn(w,cx,cy,R){let g='';
 if(w==='s')for(let i=0;i<60;i++){const x=cx-R+rnd(i,6)*2*R,y=cy-R+rnd(i,7)*2*R;if(Math.hypot(x-cx,y-cy)<R-12)g+=stone(x,y,7+rnd(i,8)*3,SANDC[i%5],i+40)}
 if(w==='g')[[-52,-40],[30,-46],[-46,42],[40,40],[-4,0]].forEach((p,i)=>{g+=stone(cx+p[0],cy+p[1],26+rnd(i,9)*8,GRAVC[i%4],i+70)});
 if(w==='salt')for(let i=0;i<40;i++){const x=cx-R+rnd(i,16)*2*R,y=cy-R+rnd(i,17)*2*R;if(Math.hypot(x-cx,y-cy)<R-14)g+=salt(x,y,8+rnd(i,18)*5,i)}
 if(w==='sand3')for(let i=0;i<40;i++){const x=cx-R+rnd(i,26)*2*R,y=cy-R+rnd(i,27)*2*R;if(Math.hypot(x-cx,y-cy)<R-14)g+=stone(x,y,7+rnd(i,28)*6,['#A0673A','#B07A4A','#8A5A34','#C08A5A'][i%4],i+90)}
 return g}
function lookCircle(cx,cy,R,inner,from,cap){const id='lbLp'+cx+'x'+cy;let g='';
 if(from)g+='<path d="M'+from[0]+' '+from[1]+' L'+(cx-R*.8)+' '+(cy+R*.4)+'" stroke="#56627A" stroke-width="3" stroke-dasharray="7 7"/>';
 g+='<clipPath id="'+id+'"><circle cx="'+cx+'" cy="'+cy+'" r="'+R+'"/></clipPath><circle cx="'+cx+'" cy="'+cy+'" r="'+R+'" fill="#FFFDF8"/><g clip-path="url(#'+id+')">'+inner+'</g>';
 g+='<circle cx="'+cx+'" cy="'+cy+'" r="'+R+'" fill="none" stroke="#2B3445" stroke-width="9"/><path d="M'+(cx+R*.72)+' '+(cy+R*.72)+' l52 52" stroke="#6B4A2B" stroke-width="18" stroke-linecap="round"/>';
 if(cap)g+=mini(cx,cy-R-22,cap,19);return g}
function loupeScene1(w,anim){let g=bg({})+bowl(260,410,200,pile(260,404,170,'mix',3));
 if(!w)return g+magnifier(560,300,1.6,-20);
 return g+'<g'+(anim?an('lb-a-pop',0):'')+'>'+lookCircle(640,220,150,loupeIn(w,640,220,150),[300,340],w==='s'?'돋보기로 본 모래':'돋보기로 본 자갈')+'</g>'}
/* 체(위에서 본 모습): 눈의 간격 sp — ㉮ 4 · ㉯ 11 (이 실험관에서 정한 값) */
const SV={a:{x:250,sp:4},b:{x:710,sp:11},y:330,r:110};
function sieveTop(k){const s=SV[k],x=s.x,y=SV.y,r=SV.r,id='lbSv'+k;let g=shadow(x,y+r+10,r);
 g+='<circle cx="'+x+'" cy="'+y+'" r="'+(r+12)+'" fill="#C9D1D9" stroke="#59636E" stroke-width="4"/><clipPath id="'+id+'"><circle cx="'+x+'" cy="'+y+'" r="'+r+'"/></clipPath><circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="#FFFDF8"/><g clip-path="url(#'+id+')" stroke="#59636E" stroke-width="1.5">';
 for(let a=x-r;a<=x+r;a+=s.sp)g+='<path d="M'+a.toFixed(1)+' '+(y-r)+' V'+(y+r)+'"/>';
 for(let b=y-r;b<=y+r;b+=s.sp)g+='<path d="M'+(x-r)+' '+b.toFixed(1)+' H'+(x+r)+'"/>';
 g+='</g>';
 /* 견주어 보도록 놓은 모래 한 알 · 자갈 한 알 */
 g+=stone(x-14,y+4,2.2,'#B07A4A',3)+stone(x+16,y+2,9,'#8A7765',5);
 return g+mini(x,y-r-30,k==='a'?'㉮ 체':'㉯ 체',20)}
function sieveSpot(){const c=UI.mq.cur;const k=c==='va'?'a':c==='vb'?'b':null;if(!k)return null;return [SV[k].x+2,SV.y+3,30,4,480,150]}
function sieveScene(){return bgTop()+sieveTop('a')+sieveTop('b')}
/* 체로 거르기(옆에서): n = 흔든 횟수(0~2), poured 부었는지, anim 지금 하는 행동 */
function sieveSide(o){o=o||{};const n=o.n||0,an1=o.anim;let g=bg({});
 /* 쟁반 */
 g+=shadow(480,420,250)+'<path d="M230 392 H730 L716 416 H244Z" fill="#9FB6C2" stroke="#59636E" stroke-width="3"/>';
 const fell=o.poured?[0,.55,1][Math.min(2,n)]:0;
 /* 쟁반에 떨어진 모래 */
 if(fell>0)g+=pile(480,394,280*Math.sqrt(fell),'sand',8);
 /* 체(옆) */
 let sv='<path d="M300 232 H660 L640 310 H320Z" fill="#EEF3F6" fill-opacity=".85" stroke="#59636E" stroke-width="4"/><path d="M322 308 H638" stroke="#59636E" stroke-width="6" stroke-dasharray="2 6"/><rect x="292" y="224" width="376" height="14" rx="5" fill="#9AA3AD" stroke="#59636E" stroke-width="3"/>';
 if(o.poured){const left=1-fell;sv+='<g>'+(left>0?pile(480,306,300*Math.max(.35,Math.sqrt(left)),'sand',9):'')+'</g>';for(let i=0;i<12;i++)sv+=stone(350+rnd(i,3)*260,292-rnd(i,4)*18,9+rnd(i,5)*5,GRAVC[i%4],i)}
 sv+=lglove(276,250,-20,1.1)+lglove(684,250,200,1.1);
 const jig=an1==='s2'||an1==='s3';
 g+='<g'+(jig?an('lb-a-jig',0):'')+'>'+sv+'</g>';
 if(jig)for(let j=0;j<18;j++)g+='<circle cx="'+(340+(j*37)%280)+'" cy="'+(330+(j*13)%40)+'" r="2" fill="'+SANDC[j%5]+'"'+an('lb-a-drop',.1+(j%6)*.15,'--from:-40px')+'/>';
 /* 붓는 그릇 */
 if(!o.poured&&an1!=='s1')g+=bowl(820,410,150,pile(820,404,124,'mix',3));
 if(an1==='s1'){g+='<g'+an('lb-a-fade',0)+'><g transform="translate(640 170) rotate(-60)">'+bowl(0,0,150,pile(0,-6,124,'mix',3))+'</g></g>';
  for(let j=0;j<14;j++)g+='<circle cx="'+(560+(j*23)%80)+'" cy="'+(210+(j*29)%70)+'" r="'+(j%4?2:6)+'" fill="'+(j%4?SANDC[j%5]:GRAVC[j%4])+'"'+an('lb-a-drop',.2+(j%5)*.15,'--from:-50px')+'/>'}
 return g}

/* ───────── 실험 2: 물과 기름(옆에서 본 비커) ───────── */
const LV={b:410,wT:290,oilT:260};
/* 비커: cx 가운데, b 바닥, w 너비, h 높이, water(물 높이 px), oil(기름 두께 px), cloud(0 없음 · 1 살살 · 2 세게), lab 눈금 */
function beakerS(cx,b,w,h,o){o=o||{};const x=cx-w/2,t=b-h;let g=shadow(cx,b+4,w/2+10);
 const wt=b-(o.water||0),ot=wt-(o.oil||0);
 if(o.water)g+='<rect x="'+(x+3)+'" y="'+wt+'" width="'+(w-6)+'" height="'+(b-wt-3)+'" fill="#CDEBFA" fill-opacity=".85"/>';
 if(o.oil>0)g+='<rect x="'+(x+3)+'" y="'+ot+'" width="'+(w-6)+'" height="'+(o.oil+.5)+'" fill="#F2C94C" fill-opacity=".92"/><path d="M'+(x+3)+' '+wt+' H'+(x+w-3)+'" stroke="#C99A1E" stroke-width="1.5"/>';
 if(o.cloud){const N=o.cloud===2?46:14;g+='<g>';for(let i=0;i<N;i++){const px=x+10+rnd(i,o.cloud)*(w-20),py=ot+6+rnd(i,o.cloud+3)*((b-ot)-12);g+='<circle cx="'+px.toFixed(1)+'" cy="'+py.toFixed(1)+'" r="'+(o.cloud===2?2.5+rnd(i,7)*2.5:5+rnd(i,7)*5).toFixed(1)+'" fill="#F2C94C" fill-opacity=".9"/>'}g+='</g>';
  if(o.cloud===2)g+='<rect x="'+(x+3)+'" y="'+ot+'" width="'+(w-6)+'" height="'+(b-ot-3)+'" fill="#F6E7B0" fill-opacity=".45"/>'}
 if(o.inner)g+=o.inner;
 g+='<path d="M'+x+' '+(t-4)+' L'+x+' '+(b-8)+' Q'+x+' '+b+' '+(x+8)+' '+b+' H'+(x+w-8)+' Q'+(x+w)+' '+b+' '+(x+w)+' '+(b-8)+' V'+t+' L'+(x+w+8)+' '+(t-8)+'" fill="var(--w-glass)" stroke="var(--w-glass-s)" stroke-width="3.5"/>';
 if(o.lab)for(let i=1;i<=4;i++){const yy=b-h*i/5;g+='<path d="M'+(x+w-4)+' '+yy+' h-14" stroke="#7F9BAB" stroke-width="2"/>'}
 return g}
function mainBeaker(cx,o){o=o||{};return beakerS(cx,LV.b,150,190,Object.assign({water:LV.b-LV.wT,oil:LV.wT-LV.oilT,lab:1},o))}
function dropperArt(x,y,o){o=o||{};const fill=o.fill;return '<g transform="translate('+x+' '+y+')"><rect x="-6" y="-112" width="12" height="112" rx="5" fill="rgba(232,244,250,.85)" stroke="#7F9BAB" stroke-width="2.5"/>'+(fill?'<rect x="-4" y="-'+(fill==='w'?50:44)+'" width="8" height="'+(fill==='w'?48:42)+'" fill="'+(fill==='w'?'#9FD3F0':'#F2C94C')+'"/>':'')+'<rect x="-12" y="-150" width="24" height="44" rx="11" fill="#E06C3C" stroke="#A84A24" stroke-width="2"/></g>'}
function eyeArt(x,y){return '<g transform="translate('+x+' '+y+')"><path d="M-26 0 Q0 -20 26 0 Q0 20 -26 0Z" fill="#FFFFFF" stroke="#2A3342" stroke-width="3"/><circle r="8" fill="#2A3342"/></g>'}
function sideScene(on){let g=bg({})+mainBeaker(480);if(on)g+=eyeArt(250,LV.oilT+20)+'<path d="M282 '+(LV.oilT+20)+' H392" stroke="#56627A" stroke-width="3" stroke-dasharray="7 7"/>';return g}
/* 흔들기: w 'soft'|'hard', ph 'anim'(흔드는 중) · 'pair'(바로 뒤 · 기다린 뒤) */
function shakeScene(w,ph){let g=bg({});const c=w==='hard'?2:1;
 if(ph==='anim'){g+='<g'+an('lb-a-jig',0,'--amp:'+(c===2?14:5)+'px;animation-iteration-count:'+(c===2?5:3))+'>'+mainBeaker(480,{cloud:c})+lglove(380,330,0,1.2)+'</g>';return g}
 if(ph==='pair'){g+=mainBeaker(300,{cloud:c})+mainBeaker(660,{})+clockArt(480,180,0);g+=mini(300,452,'흔든 바로 뒤',18)+mini(660,452,'조금 기다린 뒤',18);return g}
 return g+mainBeaker(480)}
/* 스포이트로 옮기기: n 옮긴 횟수(0~4) */
const oilAt=n=>Math.max(3,30*(1-n/4*.9));
function dropScene(n,act){let g=bg({});const ot=oilAt(n);
 g+=beakerS(360,LV.b,150,190,{water:LV.b-LV.wT,oil:ot,lab:1});
 const got=Math.min(4,n)*6.5;g+=beakerS(680,LV.b,110,130,{water:0,oil:got,lab:1});g+=mini(680,452,'빈 비커(100 mL)',17);
 const top=LV.wT-ot;
 if(act==='dp'){g+='<g'+PH1(2)+'>'+dropperArt(360,top+12,{fill:'o'})+'</g><g'+PH2(2)+'>'+dropperArt(680,LV.b-150,{fill:'o'})+'<circle cx="680" cy="'+(LV.b-140)+'" r="4" fill="#F2C94C"'+an('lb-a-drop',1.1,'--from:-20px')+'/></g>'}
 else if(act==='deep')g+='<g'+an('lb-a-down',0,'--from:-90px')+'>'+dropperArt(360,LV.b-20,{fill:'w'})+'</g>';
 else g+=dropperArt(520,330,{});
 return g}
/* 흡착포: n 댄 횟수(0~4) */
function padArt(x,y,yel,rot){return '<g transform="translate('+x+' '+y+') rotate('+(rot||0)+')"><rect x="-30" y="-8" width="60" height="16" rx="3" fill="'+(yel?'#F3D46A':'#FFFFFF')+'" stroke="'+(yel?'#B8901E':'#A8AEB4')+'" stroke-width="2"/></g>'}
function tweezArt(x,y){return '<g transform="translate('+x+' '+y+')"><path d="M-4 0 L-14 -120 M4 0 L14 -120" stroke="#8C949C" stroke-width="6" stroke-linecap="round"/><path d="M-14 -120 L14 -120" stroke="#8C949C" stroke-width="6" stroke-linecap="round"/></g>'}
function petri(cx,b,n){let g=shadow(cx,b+3,72)+'<path d="M'+(cx-70)+' '+(b-16)+' V'+b+' H'+(cx+70)+' V'+(b-16)+'" fill="var(--w-glass)" stroke="var(--w-glass-s)" stroke-width="3"/>';
 for(let i=0;i<n;i++)g+=padArt(cx-30+(i%2)*40,b-6-Math.floor(i/2)*8,1,i%2?6:-5);return g}
function padScene(n,act){let g=bg({});const ot=oilAt(n);
 g+=beakerS(380,LV.b,150,190,{water:LV.b-LV.wT,oil:ot,lab:1});g+=petri(700,414,act==='pd'?n:n);g+=mini(700,452,'페트리 접시',17);
 const top=LV.wT-ot;
 if(act==='pd')g+='<g'+PH1(2.4)+'><g'+an('lb-a-down',0,'--from:-80px')+'>'+tweezArt(380,top-6)+padArt(380,top-2,0)+'<g'+an('lb-a-fade',.7)+'>'+padArt(380,top-2,1)+'</g></g></g><g'+PH2(2.4)+'>'+tweezArt(700,370)+padArt(700,376,1)+'</g>';
 else g+=tweezArt(560,300)+padArt(560,306,0);
 return g}

/* ───────── 실험 3: 소금과 모래 ───────── */
function loupeScene3(w,anim){let g=bg({})+bowl(260,410,200,pile(260,404,170,'saltsand',4));
 if(!w)return g+magnifier(560,300,1.6,-20);
 return g+'<g'+(anim?an('lb-a-pop',0):'')+'>'+lookCircle(640,220,150,loupeIn(w==='l1'?'salt':'sand3',640,220,150),[300,340],w==='l1'?'돋보기로 본 소금':'돋보기로 본 모래')+'</g>'}
/* 물에 넣고 젓기: a 왼쪽(소금) b 오른쪽(모래) — 0 물만 · 1 넣고 젓는 중 · 2 저은 뒤 */
function rodArt(x,y,rot){return '<g transform="translate('+x+' '+y+') rotate('+(rot||0)+')"><rect x="-4" y="-160" width="8" height="170" rx="4" fill="rgba(232,244,250,.9)" stroke="#7F9BAB" stroke-width="2"/></g>'}
function meltBeaker(cx,k,st){let inner='';const x=cx-65,b=LV.b;
 if(k==='salt'&&st===1)for(let i=0;i<16;i++)inner+='<g'+an('lb-a-out',.6+(i%5)*.12)+'>'+salt(x+20+rnd(i,4)*90,b-14-rnd(i,5)*90,4,i)+'</g>';
 if(k==='sand'&&st>=1){inner+='<path d="M'+(x+4)+' '+(b-3)+' Q'+cx+' '+(b-24)+' '+(x+126)+' '+(b-3)+'Z" fill="#B88A5A"'+(st===1?an('lb-a-fade',.9):'')+'/>';for(let i=0;i<20;i++)inner+='<circle cx="'+(x+18+rnd(i,6)*94).toFixed(1)+'" cy="'+(b-6-rnd(i,7)*8).toFixed(1)+'" r="2.2" fill="'+SANDC[i%5]+'"/>';
  if(st===1)for(let i=0;i<14;i++)inner+='<circle cx="'+(x+20+rnd(i,8)*90).toFixed(1)+'" cy="'+(b-60-rnd(i,9)*60).toFixed(1)+'" r="2.5" fill="#A0673A"'+an('lb-a-out',.5+(i%5)*.12)+'/>'}
 let g=beakerS(cx,b,130,170,{water:120,lab:1,inner});
 if(st===1)g+='<g'+an('lb-a-jig',0,'--amp:10px;animation-iteration-count:3')+'>'+rodArt(cx+10,b-10,8)+'</g>';
 return g}
function meltScene(a,b){let g=bg({})+meltBeaker(300,'salt',a)+meltBeaker(660,'sand',b);g+=mini(300,452,'소금을 넣은 물',17)+mini(660,452,'모래를 넣은 물',17);
 if(!a)g+='<g transform="translate(300 230)"><path d="M-70 0 h50" stroke="#8C949C" stroke-width="6" stroke-linecap="round"/><ellipse cx="-12" cy="0" rx="14" ry="8" fill="#C9D1D9"/></g>';return g}
/* 거름 장치(옆에서): st 0 거름종이·깔때기 따로 · 1 고깔 · 2 깔때기에 넣고 물 묻힘 · 3 비커 옆면에 닿게 */
const FL={x:480,top:180,cone:262,tipY:330,bx:528,bw:100,bh:120};
function standArt(){return '<rect x="240" y="404" width="190" height="14" rx="4" fill="#5C6470"/><rect x="300" y="110" width="10" height="296" fill="#7A828C"/><path d="M305 196 H'+(FL.x-58)+'" stroke="#7A828C" stroke-width="8"/><ellipse cx="'+FL.x+'" cy="200" rx="62" ry="9" fill="none" stroke="#7A828C" stroke-width="6"/>'}
function funnelArt(o){o=o||{};let g='';
 if(o.paper)g+='<path d="M'+(FL.x-58)+' '+(FL.top+6)+' L'+FL.x+' '+(FL.cone+10)+' L'+(FL.x+58)+' '+(FL.top+6)+'Z" fill="'+(o.wet?'#E9E4D6':'#FFFFFF')+'" stroke="#B9B2A2" stroke-width="2"/>';
 if(o.sand)g+='<path d="M'+(FL.x-30)+' '+(FL.cone-26)+' L'+FL.x+' '+(FL.cone+6)+' L'+(FL.x+30)+' '+(FL.cone-26)+'Z" fill="#B88A5A"/>'+[...Array(10)].map((_,i)=>'<circle cx="'+(FL.x-18+rnd(i,3)*36).toFixed(1)+'" cy="'+(FL.cone-20+rnd(i,4)*18).toFixed(1)+'" r="2" fill="'+SANDC[i%5]+'"/>').join('');
 if(o.liq)g+='<path d="M'+(FL.x-40)+' '+(FL.top+30)+' L'+FL.x+' '+(FL.cone)+' L'+(FL.x+40)+' '+(FL.top+30)+'Z" fill="#CDEBFA" fill-opacity=".7"/>';
 g+='<path d="M'+(FL.x-66)+' '+FL.top+' L'+(FL.x-6)+' '+FL.cone+' V'+FL.tipY+' L'+(FL.x+6)+' '+(FL.tipY-8)+' V'+FL.cone+' L'+(FL.x+66)+' '+FL.top+'" fill="var(--w-glass)" stroke="var(--w-glass-s)" stroke-width="3.5" stroke-linejoin="round"/>';
 return g}
function setupScene(st,act){let g=bg({})+standArt();const n=act?{fu1:1,fu2:2,fu3:3}[act]:st;
 g+=funnelArt({paper:n>=2,wet:n>=2});
 if(n<2){/* 책상 위 거름종이 */g+=n===1?'<g'+(act==='fu1'?an('lb-a-pop',0):'')+'><path d="M640 400 L700 330 L760 400Z" fill="#FFFFFF" stroke="#B9B2A2" stroke-width="2"/><path d="M700 330 V400" stroke="#D7D1C2" stroke-width="2"/></g>':'<ellipse cx="700" cy="404" rx="80" ry="14" fill="#FFFFFF" stroke="#B9B2A2" stroke-width="2"/>'}
 if(act==='fu2')g+='<g'+an('lb-a-down',0,'--from:-60px')+'>'+dropperArt(FL.x+30,FL.top-6,{fill:'w'})+'</g>';
 /* 아래 비커: 3이면 깔때기 아래(옆면에 닿게), 아니면 옆에 */
 if(n>=3)g+='<g'+(act==='fu3'?an('lb-a-slide',0,'--dx:300px'):'')+'>'+beakerS(FL.bx,416,FL.bw,FL.bh,{lab:1})+'</g>';
 else g+=beakerS(830,416,FL.bw,FL.bh,{lab:1});
 return g}
/* 젓고 거르기: c 한 행동 수(0~3), act 지금 행동 */
function filtScene(c,act){let g=bg({})+standArt();const done=c>=3&&act!=='f3';
 g+=funnelArt({paper:1,wet:1,sand:done,liq:act==='f3'});
 if(act==='f3')g+='<g'+an('lb-a-fade',1.4)+'>'+funnelArt({paper:1,wet:1,sand:1})+'</g>';
 const lower=done?44:0;g+=beakerS(FL.bx,416,FL.bw,FL.bh,{water:lower,lab:1,inner:act==='f3'?'<rect x="'+(FL.bx-47)+'" y="'+(416-44)+'" width="94" height="41" fill="#CDEBFA" fill-opacity=".85"'+an('lb-a-rise',.8)+'/>':''});
 if(act==='f3')g+='<path d="M'+FL.x+' '+FL.tipY+' V'+(416-10)+'" stroke="#9FD3F0" stroke-width="3" stroke-dasharray="20 18"'+an('lb-a-stream',.4)+'/>';
 /* 혼합물 비커(오른쪽) */
 const mx=760;
 if(act==='f3'){g+='<g'+an('lb-a-fade',0)+'><g transform="translate(600 150) rotate(-62)">'+beakerS(0,0,120,150,{water:90,inner:'<rect x="-57" y="-90" width="114" height="87" fill="#D9C29A" fill-opacity=".6"/>'})+'</g>'+rodArt(560,250,-35)+'</g>'}
 else if(!done){let inner='';
  if(c>=1||act==='f1')inner+='<path d="M'+(mx-56)+' 413 Q'+mx+' 396 '+(mx+56)+' 413Z" fill="#B88A5A"'+(act==='f1'?an('lb-a-fade',.6):'')+'/>';
  if(act==='f1')for(let i=0;i<14;i++)inner+=(i%2?salt(mx-40+rnd(i,4)*80,330+rnd(i,5)*40,4,i):stone(mx-40+rnd(i,4)*80,330+rnd(i,5)*40,3,'#A0673A',i)).replace('<path','<path'+an('lb-a-drop',.1+(i%5)*.1,'--from:-60px'));
  if(act==='f2')inner+='<rect x="'+(mx-57)+'" y="'+(416-110)+'" width="114" height="104" fill="#C9A87A" fill-opacity=".55"'+an('lb-a-out',1.2)+'/>';
  g+=beakerS(mx,416,120,150,{water:110,lab:1,inner});
  if(act==='f2')g+='<g'+an('lb-a-jig',0,'--amp:10px;animation-iteration-count:3')+'>'+rodArt(mx+10,406,8)+'</g>';else g+=rodArt(mx+90,410,20)}
 else g+=beakerS(mx,416,120,150,{water:0,lab:1})+rodArt(mx+90,410,20);
 return g}
/* 가열: stage 0 가열 전 · 1 가열하는 동안 · 2 끝나 갈 때 · 'anim' 지켜보는 중. on 가열판 켜짐 */
function hotplate(on){return shadow(480,420,140)+'<rect x="340" y="350" width="280" height="66" rx="10" fill="#E3E6EA" stroke="#6B7480" stroke-width="3"/><rect x="356" y="340" width="248" height="14" rx="4" fill="#4A515B"/><circle cx="580" cy="388" r="13" fill="#FFFFFF" stroke="#6B7480" stroke-width="3"/><path d="M580 388 L'+(on?'572 378':'580 375')+'" stroke="#2A3342" stroke-width="3" stroke-linecap="round"/><circle cx="380" cy="388" r="7" fill="'+(on?'#E03A2E':'#9AA3AD')+'"/>'}
function edish(lvl,cry,o){o=o||{};let g='';const cx=480,b=338;
 if(lvl>0)g+='<path d="M'+(cx-88*Math.sqrt(lvl))+' '+(b-38*lvl)+' Q'+cx+' '+(b+4)+' '+(cx+88*Math.sqrt(lvl))+' '+(b-38*lvl)+'Z" fill="#CDEBFA" fill-opacity=".9"/>';
 for(let i=0;i<cry;i++)g+=salt(cx-60+rnd(i,11)*120,b-6-rnd(i,12)*12*(1-Math.abs(rnd(i,11)-.5)),3.2,i);
 g+='<path d="M'+(cx-104)+' '+(b-44)+' Q'+cx+' '+(b+12)+' '+(cx+104)+' '+(b-44)+'" fill="#FAFAF7" fill-opacity=".35" stroke="#9AA3AD" stroke-width="4"/>';
 return g}
function steam(n){let g='';for(let i=0;i<n;i++)g+='<path d="M'+(440+i*28)+' 280 q-10 -20 0 -40 q10 -20 0 -40" stroke="#B9C2CA" stroke-width="4" fill="none" stroke-linecap="round"'+an('lb-a-smoke',(i%3)*.4,'animation-iteration-count:infinite')+'/>';return g}
function spatter(){let g='';for(let i=0;i<8;i++){const dx=(i%2?1:-1)*(20+i*8);g+='<g'+an('lb-a-splash',(i%4)*.3,'--dx:'+dx+'px;--dy:-'+(30+i*6)+'px;animation-iteration-count:infinite;animation-duration:1.2s')+'>'+salt(480,300,2.6,i)+'</g>'}return g}
function heatScene(c,act,view){let g=bg({});const on=c>=3&&c<5||act==='h3'||act==='h4';
 g+=hotplate(on&&act!=='h5');
 const stg=act==='h4'?'anim':view!=null?view:c>=4?2:0;
 if(c>=2||act==='h2'){if(stg==='anim'){g+='<g'+PH1(4.6)+'>'+edish(.8,0)+steam(3)+'</g><g'+PH2(4.6)+'>'+edish(.12,40)+steam(2)+spatter()+'</g>'}
  else if(stg===1)g+=edish(.45,14)+steam(3)+spatter();
  else if(stg===2)g+=edish(.1,40)+(c<5?steam(1):'');
  else g+=edish(.8,0);
  if(act==='h2')g+='<g'+an('lb-a-fade',0)+'><g transform="translate(600 200) rotate(-58)">'+beakerS(0,0,90,110,{water:60})+'</g></g>'}
 else g+=edish(0,0)+beakerS(760,416,90,110,{water:44,lab:1});
 if(act==='h1')g+='<g'+an('lb-a-pop',0)+'>'+cotton(250,250,-60,1.3)+cotton(720,250,-120,1.3)+'</g>';
 if(stg==='anim'||act==='h4')g+=clockArt(820,160,1);
 return g}
function moveScene(done,anim){let g=bg({})+hotplate(false);
 if(!done)return g+edish(.1,40)+'<g transform="translate(700 270)"><path d="M0 0 L120 -40 M0 10 L120 -30" stroke="#6B7480" stroke-width="7" stroke-linecap="round"/></g>';
 g+='<g'+(anim?an('lb-a-slide',0,'--dx:-260px'):'')+'><g transform="translate(260 40)">'+edish(.06,44)+'</g><path d="M850 280 L'+(740+40)+' 300 M850 292 L'+(740+40)+' 310" stroke="#6B7480" stroke-width="7" stroke-linecap="round"/></g>';
 return g}

/* ───────── 준비물 카드 ───────── */
function itemArt(k){const A={
  mix1:bowl(0,30,110,pile(0,26,90,'mix',3)),
  mix3:bowl(0,30,110,pile(0,26,90,'saltsand',4)),
  loupe:magnifier(-8,-8,1.1,0),
  sieves:'<circle cx="-30" cy="0" r="34" fill="#FFFDF8" stroke="#59636E" stroke-width="6"/><circle cx="34" cy="8" r="34" fill="#FFFDF8" stroke="#59636E" stroke-width="6"/>'+[-20,-10,0,10].map(d=>'<path d="M'+(-30+d)+' -26 V26" stroke="#59636E" stroke-width="1.2"/>').join('')+[-14,6,26].map(d=>'<path d="M'+(34+d)+' -20 V36" stroke="#59636E" stroke-width="1.5"/>').join(''),
  tray:'<path d="M-60 0 H60 L52 20 H-52Z" fill="#9FB6C2" stroke="#59636E" stroke-width="3"/>',
  coat:coat(0,-2,.62),goggle:goggles(0,0,1),
  lglove:lglove(-14,-10,-60,.75)+lglove(22,8,-60,.75),cglove:cotton(-14,-10,-60,.75)+cotton(22,8,-60,.75),
  beakers2:'<g transform="translate(-34 40) scale(.38)">'+mainBeaker(0)+'</g>'+'<g transform="translate(34 40) scale(.38)">'+mainBeaker(0)+'</g>',
  beaker100:'<g transform="translate(0 40) scale(.5)">'+beakerS(0,0,110,130,{lab:1})+'</g>',
  wbeaker:'<g transform="translate(0 40) scale(.5)">'+beakerS(0,0,120,150,{water:100,lab:1})+'</g>',
  dropper:'<g transform="rotate(30)">'+dropperArt(0,60,{}).replace('translate(0 60)','translate(0 60) scale(.8)')+'</g>',
  pad:padArt(-10,-6,0,-8)+padArt(10,10,0,6),
  tweezers:'<g transform="rotate(25) translate(0 50)">'+tweezArt(0,0)+'</g>',
  petri:petri(0,20,0),
  spoon:'<path d="M-50 10 L30 -10" stroke="#8C949C" stroke-width="6" stroke-linecap="round"/><ellipse cx="38" cy="-12" rx="16" ry="9" fill="#C9D1D9" stroke="#8C949C" stroke-width="2"/>',
  rod:'<g transform="rotate(60) translate(0 70)">'+rodArt(0,0,0)+'</g>',
  funnel:'<path d="M-40 -40 L-4 6 V44 L4 38 V6 L40 -40Z" fill="#EAF4FB" fill-opacity=".6" stroke="#5F8FA0" stroke-width="3"/><path d="M-32 -36 L0 2 L32 -36Z" fill="#FFFFFF" stroke="#B9B2A2" stroke-width="2"/>',
  hotplate:'<rect x="-56" y="-14" width="112" height="40" rx="7" fill="#E3E6EA" stroke="#6B7480" stroke-width="3"/><rect x="-48" y="-20" width="96" height="8" rx="3" fill="#4A515B"/><circle cx="38" cy="6" r="7" fill="#FFFFFF" stroke="#6B7480" stroke-width="2"/>',
  edish:'<path d="M-52 -10 Q0 40 52 -10" fill="#FAFAF7" stroke="#9AA3AD" stroke-width="4"/>',
  tongs:'<path d="M-50 20 L40 -14 M-50 30 L44 -2" stroke="#6B7480" stroke-width="6" stroke-linecap="round"/><path d="M-50 20 Q-62 25 -50 30" stroke="#6B7480" stroke-width="6" fill="none"/>',
  sticker:'<rect x="-52" y="-30" width="104" height="60" rx="5" fill="#FFFFFF" stroke="#B9C2CA" stroke-width="2"/>'+[1,2,3,4].map(i=>chip(-36+(i-1)*24,0,i,10)).join('')};
 return A[k]||''}
