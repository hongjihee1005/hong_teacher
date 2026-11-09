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

/* ───────── 실험 2: 지구본 — 대륙 모양은 교과서 버전 앱(sem2/u2-2)의 단순한 그림(경도·위도) ───────── */
const POLY=[
 [[-168,66],[-162,70],[-150,71],[-140,70],[-128,70],[-115,68],[-95,72],[-80,73],[-65,62],[-60,55],[-56,52],[-66,45],[-70,42],[-76,38],[-76,35],[-81,31],[-80,26],[-82,25],[-83,29],[-89,30],[-95,29],[-97,26],[-97,21],[-94,18],[-90,21],[-87,21],[-88,16],[-83,15],[-83,10],[-79,9],[-80,7],[-85,10],[-92,14],[-96,16],[-105,20],[-106,23],[-112,29],[-114,31],[-110,23],[-115,30],[-117,33],[-121,35],[-124,40],[-124,46],[-124,49],[-130,54],[-135,58],[-142,60],[-150,61],[-155,58],[-162,56],[-165,60],[-165,63]],
 [[-73,78],[-60,82],[-30,83],[-20,80],[-20,70],[-30,68],[-40,65],[-43,60],[-50,64],[-55,70],[-60,76]],
 [[-120,72],[-100,74],[-90,80],[-70,82],[-80,75],[-95,70],[-115,70]],
 [[-80,9],[-75,11],[-72,12],[-63,10],[-60,8],[-52,5],[-50,0],[-44,-2],[-35,-5],[-35,-9],[-39,-15],[-41,-22],[-48,-26],[-53,-34],[-58,-38],[-62,-41],[-65,-45],[-68,-50],[-69,-52],[-72,-54],[-75,-50],[-74,-44],[-73,-37],[-71,-30],[-70,-18],[-76,-14],[-81,-6],[-80,-2],[-78,2],[-77,7]],
 [[-9,43],[-9,37],[-6,36],[-2,37],[0,39],[3,42],[6,43],[9,44],[12,42],[16,38],[18,40],[13,45],[19,42],[24,38],[26,40],[29,41],[36,36],[35,33],[39,22],[43,13],[45,13],[52,16],[57,18],[59,22],[56,26],[51,24],[48,29],[50,30],[57,26],[62,25],[67,24],[72,21],[73,16],[77,8],[80,10],[80,15],[87,21],[92,22],[94,17],[98,16],[98,8],[100,4],[104,1],[103,5],[100,13],[105,9],[109,12],[108,16],[106,20],[110,21],[117,23],[121,29],[122,31],[120,35],[119,37],[122,40],[126,38],[127,35],[129,35],[129,38],[128,40],[130,42],[135,43],[140,48],[141,53],[138,55],[143,59],[152,59],[156,58],[156,51],[160,54],[163,60],[170,60],[180,65],[180,69],[170,70],[160,71],[150,72],[140,73],[130,71],[113,74],[105,78],[95,76],[80,73],[70,73],[68,69],[60,69],[55,68],[45,68],[40,66],[35,69],[28,71],[20,70],[14,67],[10,63],[5,62],[6,58],[8,58],[11,59],[12,56],[10,54],[8,54],[5,53],[3,51],[-2,48],[-5,48],[-1,46],[-2,43]],
 [[-180,65],[-170,66],[-172,64],[-180,64]],
 [[-17,21],[-16,28],[-10,30],[-6,36],[3,37],[10,37],[11,33],[20,31],[25,32],[32,31],[34,28],[39,22],[43,13],[51,12],[48,5],[41,-2],[39,-7],[40,-15],[35,-24],[33,-28],[27,-34],[20,-35],[18,-32],[14,-23],[12,-17],[13,-11],[9,-1],[9,4],[4,6],[-4,5],[-8,4],[-13,8],[-17,14]],
 [[44,-12],[50,-15],[49,-25],[44,-25],[43,-17]],
 [[114,-22],[122,-18],[130,-12],[136,-12],[137,-16],[141,-11],[145,-15],[153,-25],[150,-37],[141,-38],[131,-31],[117,-35],[115,-33]],
 [[131,-1],[141,-3],[150,-10],[141,-9],[137,-5]],
 [[109,2],[117,7],[119,1],[116,-4],[110,-3]],
 [[95,5],[104,-3],[106,-6],[101,-2]],
 [[130,31],[134,34],[140,36],[142,40],[141,45],[145,44],[141,41],[140,35],[135,33]],
 [[-5,50],[1,51],[0,54],[-3,58],[-6,56],[-3,54]],
 [[-24,64],[-14,64],[-14,66],[-22,66]],
 [[172,-34],[178,-38],[174,-41],[171,-45],[167,-46],[172,-41]],
 [[-180,-90],[180,-90],[180,-78],[165,-72],[150,-68],[120,-66],[90,-66],[60,-67],[30,-69],[0,-70],[-30,-76],[-60,-73],[-60,-64],[-65,-66],[-75,-71],[-100,-73],[-130,-75],[-160,-78],[-180,-78]]
];
const HOLE=[[-95,58],[-92,57],[-82,55],[-78,58],[-78,63],[-85,65],[-94,62]]; // 허드슨만
const BB=POLY.map(p=>{let a=[999,999,-999,-999];p.forEach(([x,y])=>{a[0]=Math.min(a[0],x);a[1]=Math.min(a[1],y);a[2]=Math.max(a[2],x);a[3]=Math.max(a[3],y);});return a;});
function inPoly(x,y,p){let c=false;for(let i=0,j=p.length-1;i<p.length;j=i++){const[xi,yi]=p[i],[xj,yj]=p[j];if(((yi>y)!==(yj>y))&&(x<(xj-xi)*(y-yi)/(yj-yi)+xi))c=!c;}return c;}
function isLand(lon,lat){if(inPoly(lon,lat,HOLE))return false;for(let k=0;k<POLY.length;k++){const b=BB[k];if(lon<b[0]||lon>b[2]||lat<b[1]||lat>b[3])continue;if(inPoly(lon,lat,POLY[k]))return true}return false}
const DG=Math.PI/180;
/* 4도 칸 육지 지도(그리기용) */
const MK=(()=>{const m=[];for(let r=0;r<45;r++){m[r]=[];for(let c=0;c<90;c++)m[r][c]=isLand(-178+c*4,88-r*4)?1:0}return m})();
/* 붙임딱지 칸 44개: 위도 30도 띠마다 3·8·11·11·8·3칸(넓이가 비슷하게 — 이 자료에서 정한 값). f = 칸 안 육지 비율 */
const NB=[3,8,11,11,8,3];
const CELLS=(()=>{const L=[];NB.forEach((n,b)=>{const top=90-30*b;for(let j=0;j<n;j++){const l0=-180+j*360/n,l1=l0+360/n;let a=0,t=0;
 for(let i=0;i<12;i++)for(let k=0;k<12;k++){const lat=top-(i+.5)*2.5,lon=l0+(k+.5)*(l1-l0)/12,w=Math.cos(lat*DG);t+=w;a+=w*isLand(lon,lat)}
 L.push({b,j,top,bot:top-30,l0,l1,f:a/t})}});return L})();
/* 한 칸의 답: L 육지(60% 넘음) · S 바다(40%보다 적음) · A 둘 다 인정(절반쯤) */
const cellTruth=c=>c.f>.6?'L':c.f<.4?'S':'A';
/* 붙이는 차례: 적도 근처 띠부터(지도서 195쪽 지도 길잡이), 띠 안에서는 경도 차례 */
const CORDER=(()=>{const o=[];[2,3,1,4,0,5].forEach(b=>{CELLS.forEach((c,i)=>{if(c.b===b)o.push(i)})});return o})();
const cellMid=c=>[(c.l0+c.l1)/2,(c.top+c.bot)/2];
/* 정사영: 지구본 가운데 경도 lam, 위도 phi */
function gProj(lon,lat,G){const p=lat*DG,l=(lon-G.lam)*DG,p0=G.phi*DG;
 const cc=Math.sin(p0)*Math.sin(p)+Math.cos(p0)*Math.cos(p)*Math.cos(l);let x=G.R*Math.cos(p)*Math.sin(l),y=G.R*(Math.cos(p0)*Math.sin(p)-Math.sin(p0)*Math.cos(p)*Math.cos(l));
 if(cc<0){const k=G.R/(Math.hypot(x,y)||1e-6);x*=k;y*=k}return [G.cx+x,G.cy-y,cc]}
const ptsD=a=>'M'+a.map(p=>p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' L')+'Z';
function cellPts(c,G,n){n=n||6;const P=[];for(let i=0;i<=n;i++)P.push(gProj(c.l0+(c.l1-c.l0)*i/n,c.top,G));for(let i=1;i<=n;i++)P.push(gProj(c.l1,c.top-30*i/n,G));
 for(let i=n-1;i>=0;i--)P.push(gProj(c.l0+(c.l1-c.l0)*i/n,c.bot,G));for(let i=n-1;i>=1;i--)P.push(gProj(c.l0,c.top-30*i/n,G));return P}
/* 지구본. o: {lam,phi,cx,cy,R, stk:{칸:'L'|'S'}, ord:[칸 차례], nums, cur(반짝이는 칸), hl(빨간 동그라미 칸)} */
function globe(o){const G={lam:o.lam,phi:o.phi,cx:o.cx||480,cy:o.cy||270,R:o.R||210};let g='<g class="lb-globe">';
 g+='<ellipse cx="'+G.cx+'" cy="'+(G.cy+G.R+22)+'" rx="'+(G.R*.7)+'" ry="14" fill="var(--w-shadow)"/>';
 g+='<circle cx="'+G.cx+'" cy="'+G.cy+'" r="'+G.R+'" fill="#3A8BC9"/>';
 let land='';for(let r=0;r<45;r++){const t=90-r*4,b=t-4;let c=0;while(c<90){if(!MK[r][c]){c++;continue}let e=c;while(e<90&&MK[r][e])e++;
  const a=-180+c*4,z=-180+e*4,P=[];for(let x=a;x<=z;x+=4)P.push(gProj(x,t,G));for(let x=z;x>=a;x-=4)P.push(gProj(x,b,G));
  if(P.some(p=>p[2]>0))land+='<path d="'+ptsD(P)+'"/>';c=e}}
 g+='<g fill="#5DAA4F" stroke="#5DAA4F" stroke-width="1.2" stroke-linejoin="round">'+land+'</g>';
 /* 칸 선 */
 let ln='';CELLS.forEach((c,i)=>{const m=cellMid(c),q=gProj(m[0],m[1],G);if(q[2]<-.2)return;ln+='<path d="'+ptsD(cellPts(c,G))+'"/>'});
 g+='<g fill="none" stroke="#FFFFFF" stroke-opacity=".75" stroke-width="1.6">'+ln+'</g>';
 /* 붙임딱지 */
 const stk=o.stk||{},num={},cn={L:0,S:0};(o.ord||[]).forEach(i=>{if(stk[i]){cn[stk[i]]++;num[i]=cn[stk[i]]}});
 Object.keys(stk).forEach(k=>{const i=+k,c=CELLS[i],m=cellMid(c),q=gProj(m[0],m[1],G);if(q[2]<.08)return;
  const P=cellPts(c,G).map(p=>[q[0]+(p[0]-q[0])*.8,q[1]+(p[1]-q[1])*.8]),L=stk[i]==='L';
  g+='<path d="'+ptsD(P)+'" fill="'+(L?'#F2B544':'#D6EEFF')+'" stroke="'+(L?'#8A5A0C':'#24548F')+'" stroke-width="2.4" opacity=".96"/>';
  if(o.nums&&q[2]>.2)g+='<text x="'+q[0].toFixed(1)+'" y="'+(q[1]+9).toFixed(1)+'" text-anchor="middle" font-size="'+(q[2]>.6?26:20)+'" font-weight="800" fill="#141A26">'+num[i]+'</text>'});
 if(o.cur!=null){const c=CELLS[o.cur],q=gProj(cellMid(c)[0],cellMid(c)[1],G);if(q[2]>0)g+='<path d="'+ptsD(cellPts(c,G))+'" fill="none" stroke="var(--lb-lens)" stroke-width="5" stroke-dasharray="11 7"/>'}
 if(o.hl!=null){const c=CELLS[o.hl],q=gProj(cellMid(c)[0],cellMid(c)[1],G);if(q[2]>0)g+='<circle cx="'+q[0].toFixed(1)+'" cy="'+q[1].toFixed(1)+'" r="30" fill="none" stroke="#D9473A" stroke-width="5"/>'}
 g+='<circle cx="'+G.cx+'" cy="'+G.cy+'" r="'+G.R+'" fill="none" stroke="#1D4F7A" stroke-width="4"/>';
 g+='<path d="M'+(G.cx-G.R*.62)+' '+(G.cy-G.R*.58)+' A'+G.R+' '+G.R+' 0 0 1 '+(G.cx+G.R*.1)+' '+(G.cy-G.R*.86)+'" fill="none" stroke="#FFFFFF" stroke-opacity=".35" stroke-width="10" stroke-linecap="round"/>';
 return g+'</g>'}
/* 지구본 받침(앞에서 볼 때만) */
function globeStand(cx,cy,R){return '<g><path d="M'+(cx-R-18)+' '+cy+' A'+(R+18)+' '+(R+18)+' 0 0 1 '+(cx+R+18)+' '+cy+'" fill="none" stroke="#A9842E" stroke-width="7" opacity=".9"/><rect x="'+(cx-8)+'" y="'+(cy+R+4)+'" width="16" height="26" fill="#8A6537"/><rect x="'+(cx-70)+'" y="'+(cy+R+28)+'" width="140" height="14" rx="6" fill="#8A6537"/></g>'}

/* ───────── 실험 1: 비닐봉지 · 부채 · 손 ───────── */
/* 봉지. st: 'flat'(납작) · 'full'(부풀림) · 'press'(눌림) / mouth: 입구 오른쪽 끝 x,y */
function bagArt(cx,cy,st,o){o=o||{};let g='<g>';const f=st==='flat',p=st==='press';
 const w=f?120:p?185:230,h=f?40:p?118:150,mx=cx+w*.5+(f?20:28);
 if(f)g+='<path d="M'+(cx-w)+' '+(cy-h)+' Q'+(cx-20)+' '+(cy-h-18)+' '+(cx+w*.5)+' '+(cy-14)+' L'+mx+' '+(cy-4)+' L'+mx+' '+(cy+4)+' L'+(cx+w*.5)+' '+(cy+14)+' Q'+(cx-30)+' '+(cy+h+16)+' '+(cx-w)+' '+(cy+h)+' Q'+(cx-w-24)+' '+cy+' '+(cx-w)+' '+(cy-h)+'Z" fill="rgba(214,236,248,.55)" stroke="#5F8FA0" stroke-width="3" stroke-linejoin="round"/><path d="M'+(cx-80)+' '+(cy-12)+' l40 18 l30 -14 l26 12" fill="none" stroke="#8FB3C6" stroke-width="2"/>';
 else g+='<path d="M'+(cx+w*.48)+' '+(cy-h*.42)+' Q'+(cx+w*.3)+' '+(cy-h)+' '+(cx-w*.35)+' '+(cy-h*.92)+' Q'+(cx-w*1.02)+' '+(cy-h*.7)+' '+(cx-w)+' '+cy+' Q'+(cx-w*1.02)+' '+(cy+h*.72)+' '+(cx-w*.35)+' '+(cy+h*.92)+' Q'+(cx+w*.3)+' '+(cy+h)+' '+(cx+w*.48)+' '+(cy+h*.42)+' L'+mx+' '+(cy+(o.open?16:6))+' L'+mx+' '+(cy-(o.open?16:6))+'Z" fill="rgba(214,236,248,.5)" stroke="#5F8FA0" stroke-width="3.2" stroke-linejoin="round"/>'+
  '<path d="M'+(cx-w*.62)+' '+(cy-h*.5)+' Q'+(cx-w*.2)+' '+(cy-h*.82)+' '+(cx+w*.2)+' '+(cy-h*.62)+'" fill="none" stroke="#FFFFFF" stroke-width="7" stroke-linecap="round" opacity=".8"/>'+
  (p?'<path d="M'+(cx-w*.2)+' '+(cy-h*.55)+' q10 30 0 60 M'+(cx+w*.1)+' '+(cy-h*.5)+' q-8 26 0 52" fill="none" stroke="#8FB3C6" stroke-width="2"/>':'');
 return g+'</g>'}
/* 부채 */
function fanArt(x,y,rot){return '<g transform="translate('+x+' '+y+') rotate('+(rot||0)+')"><path d="M0 0 L-62 -96 A115 115 0 0 1 62 -96Z" fill="#F6C76A" stroke="#B9862E" stroke-width="3" stroke-linejoin="round"/>'+[-44,-22,0,22,44].map(a=>'<path d="M0 0 L'+(Math.sin(a*DG)*112).toFixed(1)+' '+(-Math.cos(a*DG)*112).toFixed(1)+'" stroke="#B9862E" stroke-width="1.6"/>').join('')+'<rect x="-7" y="-4" width="14" height="74" rx="5" fill="#7A4A1E"/></g>'}
/* 손바닥(세운 손, 손바닥이 왼쪽을 봄) */
function palmArt(x,y,sl){return '<g transform="translate('+x+' '+y+')"><path d="M-10 -58 q0 -10 9 -10 q9 0 9 10 v40 M8 -66 q0 -10 9 -10 q9 0 9 10 v48 M26 -58 q0 -9 8 -9 q9 0 9 9 v44" fill="#F2C6A0" stroke="#B9875F" stroke-width="2.2"/><path d="M-12 -60 V20 Q-12 44 14 46 Q44 46 44 18 V-20 L44 -14 Q44 -24 34 -26 L26 -26 V-18 L8 -18 V-20 L-12 -20" fill="#F2C6A0" stroke="#B9875F" stroke-width="2.2" stroke-linejoin="round"/><rect x="-8" y="44" width="48" height="56" rx="6" fill="'+(sl||'#5C8FCB')+'" stroke="#3D6A9C" stroke-width="2"/></g>'}
/* 손바닥에 느껴지는 것(짧은 선) — 실제로는 보이지 않음 */
function feelLines(x0,y0,anim){let g='';[-30,-10,10,30].forEach((d,i)=>{g+='<path d="M'+x0+' '+(y0+d)+' q16 -6 32 0 t30 0" fill="none" stroke="#7F9BAB" stroke-width="3" stroke-linecap="round" stroke-dasharray="6 7"'+(anim?an('lb-a-stream',i*.1):'')+'/>'});return g}
function sceneBag(o){o=o||{};let g=bg({});const cx=430,cy=262;
 const sl=o.swap?'#C2410C':'#5C8FCB';
 if(o.fan){const fr=fanArt(150,330,62);g+=o.fanAnim?'<g'+an('lb-a-fanw',0)+'>'+fr+'</g>':fr;g+=hand(118,368,-30,.9)}
 let b=bagArt(cx,cy,o.st||'full',{open:o.open});
 if(o.sway)b='<g'+an('lb-a-sway',0)+'>'+b+'</g>';
 if(o.squeeze)b='<g'+an('lb-a-squeeze',0)+'>'+b+'</g>';
 if(o.grow)b='<g'+an('lb-a-grow',0)+'>'+b+'</g>';
 g+=b;
 const mx=cx+(o.st==='press'?185:o.st==='flat'?120:230)*.5+(o.st==='flat'?20:28);
 if(o.hold!==false)g+='<g>'+hand(mx+30,cy,180,.75).replace('#5C8FCB',sl)+'</g>';
 if(o.press)g+=hand(cx-40,cy-118,90,.8).replace('#5C8FCB',sl)+hand(cx-40,cy+118,-90,.8).replace('#5C8FCB',sl);
 if(o.palm){const pa=palmArt(mx+70,cy+30,o.swap?'#5C8FCB':'#C2410C');g+=o.palmAnim?'<g'+an('lb-a-slidein',0)+'>'+pa+'</g>':pa}
 if(o.feel)g+=feelLines(mx+2,cy,!!o.feelAnim);
 if(o.fanLines)[0,1,2].forEach(i=>{g+='<path d="M'+(230+i*8)+' '+(190+i*44)+' q20 8 40 0" fill="none" stroke="#7F9BAB" stroke-width="3" stroke-linecap="round" stroke-dasharray="6 7"'+an('lb-a-stream',i*.15)+'/>'});
 return g}

/* ───────── 실험 3: 비커 · 증발 접시 · 핫플레이트 ───────── */
function beaker(x,yb,lbl){return '<g><rect x="'+(x-60)+'" y="'+(yb-150)+'" width="120" height="150" rx="10" fill="var(--w-glass)" stroke="var(--w-glass-s)" stroke-width="3"/><path d="M'+(x-57)+' '+(yb-92)+' H'+(x+57)+' V'+(yb-8)+' Q'+(x+57)+' '+(yb-3)+' '+(x+50)+' '+(yb-3)+' H'+(x-50)+' Q'+(x-57)+' '+(yb-3)+' '+(x-57)+' '+(yb-8)+'Z" fill="rgba(214,232,242,.38)" stroke="#9DBBCB" stroke-width="1.5"/><path d="M'+(x-66)+' '+(yb-150)+' h12" stroke="var(--w-glass-s)" stroke-width="3"/>'+[0,1,2].map(i=>'<path d="M'+(x+30)+' '+(yb-40-i*30)+' h18" stroke="var(--w-glass-s)" stroke-width="2"/>').join('')+(lbl?tag(x,yb+34,lbl,18):'')+'</g>'}
const HP={x:480,y:372};   /* 핫플레이트 윗면 가운데 */
function hotplate(on){return '<g><rect x="'+(HP.x-230)+'" y="'+HP.y+'" width="460" height="22" rx="6" fill="'+(on?'#5A3A33':'#4A4F57')+'" stroke="#2C3036" stroke-width="2.5"/><rect x="'+(HP.x-250)+'" y="'+(HP.y+20)+'" width="500" height="56" rx="10" fill="#D8DDE3" stroke="#7F8C99" stroke-width="2.5"/>'+
 '<circle cx="'+(HP.x+190)+'" cy="'+(HP.y+48)+'" r="14" fill="#F4F6F8" stroke="#7F8C99" stroke-width="2.5"/><path d="M'+(HP.x+190)+' '+(HP.y+48)+' L'+(HP.x+190+(on?9:0))+' '+(HP.y+48-(on?9:13))+'" stroke="#2A3138" stroke-width="3" stroke-linecap="round"/>'+
 '<circle cx="'+(HP.x-200)+'" cy="'+(HP.y+48)+'" r="8" fill="'+(on?'#E5483B':'#9AA3AD')+'"/>'+(NAR?'':'<text x="'+(HP.x-182)+'" y="'+(HP.y+54)+'" font-size="15" font-weight="800" fill="#2A3138">'+(on?'켜짐':'꺼짐')+'</text>')+
 '<path d="M'+(HP.x+250)+' '+(HP.y+56)+' q40 10 60 50" fill="none" stroke="#2C3036" stroke-width="4"/>'+(on?'<path d="M'+(HP.x-210)+' '+(HP.y+2)+' H'+(HP.x+210)+'" stroke="#E5734B" stroke-width="3" opacity=".7"/>':'')+'</g>'}
/* 증발 접시. lv 물 높이(0~1), chips 끓임쪽 수, salt 하얀 알갱이, x 가운데, yb 바닥 */
function edish(x,yb,o){o=o||{};const lv=o.lv||0;let g='<g>';
 g+='<path d="M'+(x-92)+' '+(yb-40)+' Q'+(x-80)+' '+(yb+2)+' '+x+' '+(yb+2)+' Q'+(x+80)+' '+(yb+2)+' '+(x+92)+' '+(yb-40)+'Z" fill="#F7F4EE" stroke="#9E968A" stroke-width="3" stroke-linejoin="round"/>';
 g+='<ellipse cx="'+x+'" cy="'+(yb-40)+'" rx="92" ry="12" fill="#ECE6DA" stroke="#9E968A" stroke-width="3"/>';
 if(lv>0){const y=yb-6-28*lv,rx=26+60*lv;g+='<ellipse cx="'+x+'" cy="'+y.toFixed(1)+'" rx="'+rx.toFixed(1)+'" ry="'+(4+6*lv).toFixed(1)+'" fill="rgba(141,200,232,.75)" stroke="#5E9CC0" stroke-width="1.5"/>'}
 if(o.salt){g+='<ellipse cx="'+x+'" cy="'+(yb-12)+'" rx="62" ry="10" fill="#FFFFFF" stroke="#B5AE9F" stroke-width="1.2"/>';for(let i=0;i<34;i++){const a=i*2.39996,r=8+((i*37)%48),px=x+Math.cos(a)*r,py=yb-12+Math.sin(a)*r*.18;g+='<circle cx="'+px.toFixed(1)+'" cy="'+py.toFixed(1)+'" r="'+(2.6+(i%3)*1.1)+'" fill="#FFFFFF" stroke="#8E8676" stroke-width="1"/>'}}
 for(let i=0;i<(o.chips||0);i++){const px=x-18+i*18,py=yb-14-(i%2)*4;g+='<path d="M'+(px-7)+' '+py+' l4 -6 h7 l4 5 l-3 6 h-9Z" fill="#B7AFA2" stroke="#6F675B" stroke-width="1.5"/>'}
 if(o.steam)[-30,0,30].forEach((d,i)=>{g+='<path d="M'+(x+d)+' '+(yb-56)+' q-10 -18 0 -36 t0 -36" fill="none" stroke="#B9C7D2" stroke-width="4" stroke-linecap="round" stroke-dasharray="10 9"'+an('lb-a-stream',i*.3)+'/>'});
 return g+'</g>'}
const DX={L:375,S:585};   /* 두 증발 접시 가운데 x */
function dropper(x,y,anim){const t='<g><path d="M'+(x-4)+' '+(y+70)+' L'+(x-6)+' '+(y+2)+' H'+(x+6)+' L'+(x+4)+' '+(y+70)+' L'+x+' '+(y+82)+'Z" fill="var(--w-glass)" stroke="var(--w-glass-s)" stroke-width="2.2"/><rect x="'+(x-11)+'" y="'+(y-40)+'" width="22" height="44" rx="10" fill="#E5734B" stroke="#A3451F" stroke-width="2"/>'+[0,1,2,3].map(i=>'<path d="M'+(x+5)+' '+(y+14+i*12)+' h6" stroke="#2A3138" stroke-width="1.6"/>').join('')+'</g>';
 return anim?'<g'+an('lb-a-dropin',0)+'>'+t+'<circle cx="'+x+'" cy="'+(y+92)+'" r="5" fill="#5E9CC0"'+an('lb-a-drip',.6)+'/></g>':t}
function goggles(x,y){return '<g transform="translate('+x+' '+y+')"><rect x="-70" y="-22" width="62" height="44" rx="18" fill="rgba(200,230,245,.6)" stroke="#2F68B0" stroke-width="4"/><rect x="8" y="-22" width="62" height="44" rx="18" fill="rgba(200,230,245,.6)" stroke="#2F68B0" stroke-width="4"/><path d="M-8 -4 h16" stroke="#2F68B0" stroke-width="5"/><path d="M-70 0 q-30 -4 -40 10 M70 0 q30 -4 40 10" fill="none" stroke="#1D3D66" stroke-width="5"/></g>'}
function glove(x,y,flip){return '<g transform="translate('+x+' '+y+') scale('+(flip?-1:1)+' 1)"><path d="M-22 40 V-10 q0 -10 8 -10 q8 0 8 10 V-26 q0 -10 8 -10 q8 0 8 10 V-24 q0 -9 8 -9 q8 0 8 9 V-8 q0 -8 7 -8 q7 0 7 8 V22 Q30 44 4 46 Z" fill="#7BC4A4" stroke="#2F7A5A" stroke-width="2.5" stroke-linejoin="round"/><rect x="-24" y="38" width="46" height="26" rx="5" fill="#5FAE8B" stroke="#2F7A5A" stroke-width="2"/></g>'}
function headArt(x,y){return '<g><circle cx="'+x+'" cy="'+y+'" r="78" fill="#F2C6A0" stroke="#B9875F" stroke-width="3"/><path d="M'+(x-78)+' '+(y-10)+' Q'+(x-70)+' '+(y-92)+' '+x+' '+(y-92)+' Q'+(x+74)+' '+(y-92)+' '+(x+78)+' '+(y-14)+' Q'+(x+40)+' '+(y-56)+' '+(x-10)+' '+(y-52)+' Q'+(x-50)+' '+(y-50)+' '+(x-78)+' '+(y-10)+'Z" fill="#3B2A20"/><path d="M'+(x-22)+' '+(y+38)+' q22 16 44 0" fill="none" stroke="#8A5A3B" stroke-width="3" stroke-linecap="round"/><path d="M'+(x-110)+' '+(y+150)+' Q'+(x-100)+' '+(y+82)+' '+x+' '+(y+82)+' Q'+(x+100)+' '+(y+82)+' '+(x+110)+' '+(y+150)+'Z" fill="#FFFFFF" stroke="#9E968A" stroke-width="3"/></g>'}

/* ───────── 준비물 카드 ───────── */
function itemArt(k){const A={
  bag:'<g transform="translate(0 4) scale(.42)">'+bagArt(0,0,'full').replace('<g>','<g transform="translate(-30 0)">')+'</g>',
  fan:'<g transform="translate(0 30) scale(.5)">'+fanArt(0,0,0)+'</g>',
  globe:'<g transform="scale(.3)">'+globe({lam:127,phi:20,cx:0,cy:-10,R:150}).replace(/<ellipse[^>]*\/>/,'')+'</g>',
  lsticker:'<g><rect x="-40" y="-30" width="80" height="60" rx="6" fill="#FFFFFF" stroke="#BDB4A2" stroke-width="2"/>'+[0,1,2,3].map(i=>'<rect x="'+(-34+(i%2)*36)+'" y="'+(-24+Math.floor(i/2)*26)+'" width="32" height="22" rx="3" fill="#F2B544" stroke="#8A5A0C" stroke-width="1.5"/>').join('')+'</g>',
  ssticker:'<g><rect x="-40" y="-30" width="80" height="60" rx="6" fill="#FFFFFF" stroke="#BDB4A2" stroke-width="2"/>'+[0,1,2,3].map(i=>'<rect x="'+(-34+(i%2)*36)+'" y="'+(-24+Math.floor(i/2)*26)+'" width="32" height="22" rx="3" fill="#D6EEFF" stroke="#24548F" stroke-width="1.5"/>').join('')+'</g>',
  pen:'<g transform="rotate(-35)"><rect x="-8" y="-50" width="16" height="84" rx="4" fill="#2A3138"/><rect x="-8" y="-50" width="16" height="22" rx="4" fill="#5C6670"/><path d="M-6 34 L0 50 L6 34Z" fill="#2A3138"/></g>',
  beaker:'<g transform="translate(-30 50) scale(.42)">'+beaker(0,0)+'</g><g transform="translate(34 50) scale(.42)">'+beaker(0,0)+'</g>',
  dropper:'<g transform="translate(-14 -30) scale(.8)">'+dropper(0,0)+'</g><g transform="translate(16 -30) scale(.8)">'+dropper(0,0)+'</g>',
  dish:'<g transform="translate(-34 22) scale(.36)">'+edish(0,0)+'</g><g transform="translate(34 22) scale(.36)">'+edish(0,0)+'</g>',
  chips:[0,1,2,3,4].map(i=>'<path d="M'+(-36+i*18-7)+' '+(8-(i%2)*10)+' l4 -6 h7 l4 5 l-3 6 h-9Z" fill="#B7AFA2" stroke="#6F675B" stroke-width="1.5" transform="scale(1.4)"/>').join(''),
  hot:'<g transform="translate(-160 -150) scale(.34)">'+hotplate(false).replace(/<text[^>]*>[^<]*<\/text>/,'')+'</g>',
  tongs:'<g transform="rotate(-20)"><path d="M-6 -50 L-14 40 M6 -50 L14 40" stroke="#7F8C99" stroke-width="7" stroke-linecap="round"/><path d="M-14 40 q14 10 28 0" fill="none" stroke="#7F8C99" stroke-width="5"/></g>',
  goggle:'<g transform="translate(0 -10) scale(.5)">'+goggles(0,0)+'</g><g transform="translate(-24 28) scale(.45)">'+glove(0,0)+'</g><g transform="translate(24 28) scale(.45)">'+glove(0,0,1)+'</g>'};
 return A[k]||''}
function toolsScene(list,anim){let b='';if(NAR)list.forEach(it=>LEG.push([null,it[1]]));const n=list.length,cols=n<=4?n:n<=6?3:4,rows=Math.ceil(n/cols),cw=200,ch=176,gx=18,gy=18;
 const W=cols*cw+(cols-1)*gx,H=rows*ch+(rows-1)*gy,x0=480-W/2,y0=Math.max(30,250-H/2);
 list.forEach((it,i)=>{const c=i%cols,r=Math.floor(i/cols),x=x0+c*(cw+gx),y=y0+r*(ch+gy),cx=x+cw/2;
  b+='<g'+(anim?an('lb-a-pop',.3+i*.15):'')+'><rect x="'+x+'" y="'+y+'" width="'+cw+'" height="'+ch+'" rx="16" fill="var(--w-label)" stroke="var(--w-felt-s)" stroke-width="1.5"/><g transform="translate('+cx+' '+(y+72)+')">'+itemArt(it[0])+'</g>'+(NAR?'':'<text x="'+cx+'" y="'+(y+ch-18)+'" text-anchor="middle" font-size="20" font-weight="800" fill="var(--w-labeltx)">'+it[1]+'</text>')+'</g>'});
 return b}
function boxArt(x){return '<g transform="translate('+x+' 300)"><path d="M-130 -60 L-100 -96 H150 L120 -60Z" fill="var(--w-kraft-s)"/><rect x="-130" y="-60" width="250" height="196" rx="8" fill="var(--w-kraft)" stroke="var(--w-kraft-s)" stroke-width="2"/><path d="M120 -60 L150 -96 V100 L120 136Z" fill="var(--w-kraft-s)"/>'+(NAR?'':'<rect x="-60" y="-10" width="110" height="44" rx="8" fill="var(--w-label)"/><text x="-5" y="20" text-anchor="middle" font-size="22" font-weight="800" fill="var(--w-labeltx)">준비물</text>')+'</g>'}
