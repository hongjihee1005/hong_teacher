/* ───────── 그림: 실험대(앞에서 본 모습) — 모두 직접 그린 SVG ───────── */
const BY=436;           /* 물건이 놓이는 높이 */
let NAR=false,LEG=[];   /* 좁은 화면: 작은 그림 글자는 HTML(LEG)로 */
const A_COL='var(--lb-a)',B_COL='var(--lb-b)';
function an(cls,delay,extra){return ' class="lb-a '+cls+'" style="animation-delay:'+(delay||0)+'s'+(extra?';'+extra:'')+'"'}
function bg(o){o=o||{};let g='<rect x="-3000" y="-3000" width="7000" height="3416" fill="var(--w-wall)"/><rect x="-3000" y="330" width="7000" height="86" fill="var(--w-wall2)"/><rect x="-3000" y="326" width="7000" height="5" fill="var(--w-rail)"/>'+
 '<rect x="-3000" y="416" width="7000" height="36" fill="var(--w-top)"/><rect x="-3000" y="452" width="7000" height="6" fill="var(--w-edge)"/><rect x="-3000" y="458" width="7000" height="3000" fill="var(--w-front)"/>';
 for(let i=0;i<5;i++)g+='<path d="M-3000 '+(478+i*20)+' H4000" stroke="var(--w-grain)" stroke-width="1.2" opacity=".35"/>';
 if(o.win){const x=o.wx==null?40:o.wx;
  g+='<rect x="'+x+'" y="48" width="226" height="246" rx="10" fill="var(--w-win)"/><rect x="'+(x+13)+'" y="61" width="200" height="220" rx="4" fill="url(#lbSky)"/>'+
  '<circle cx="'+(x+160)+'" cy="104" r="20" fill="#F6CF55"/>'+
  '<path d="M'+(x+113)+' 61v220M'+(x+13)+' 171h200" stroke="var(--w-win)" stroke-width="9"/>'+
  '<path d="M'+(x+34)+' 128c9-13 28-13 35-2 11-5 24 2 22 13H'+(x+30)+'c-6 0-5-9 4-11z" fill="#fff" opacity=".75"/>'+
  '<rect x="'+(x-8)+'" y="290" width="242" height="13" rx="5" fill="var(--w-win)"/>';
  if(o.sun!==false)g+='<path d="M'+(x+13)+' 281 L'+(o.sx1||330)+' 432 L'+(o.sx2||760)+' 432 L'+(x+213)+' 281Z" fill="#FFF3C4" opacity=".32"/>'}
 return g}
function defs(){return '<defs><linearGradient id="lbSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--w-sky1)"/><stop offset="1" stop-color="var(--w-sky2)"/></linearGradient></defs>'}
function svg(inner,label,vb){return '<svg viewBox="'+(vb||'0 0 960 540')+'" preserveAspectRatio="xMidYMid meet" role="img" aria-label="'+label+'">'+defs()+inner+'</svg>'}
function plate(cx,letter,txt,y){if(NAR){LEG.push([letter,txt]);return ''}y=y||470;const w=Math.max(120,txt.length*19+76),col=letter==='가'?A_COL:B_COL;
 return '<g><rect x="'+(cx-w/2)+'" y="'+y+'" width="'+w+'" height="48" rx="12" fill="var(--w-label)" stroke="'+col+'" stroke-width="2.5"/>'+
 '<circle cx="'+(cx-w/2+27)+'" cy="'+(y+24)+'" r="15" fill="'+col+'"/><text x="'+(cx-w/2+27)+'" y="'+(y+30.5)+'" text-anchor="middle" font-size="18" font-weight="800" fill="var(--w-label)">'+letter+'</text>'+
 '<text x="'+(cx-w/2+50)+'" y="'+(y+31)+'" font-size="19" font-weight="700" fill="var(--w-labeltx)">'+txt+'</text></g>'}
function bubble(x,y,t,col){if(NAR){LEG.push([null,t]);return ''}const w=t.length*18+30;return '<g><rect x="'+(x-w/2)+'" y="'+(y-22)+'" width="'+w+'" height="40" rx="20" fill="var(--w-label)" stroke="'+(col||'var(--w-felt-s)')+'" stroke-width="2"/><text x="'+x+'" y="'+(y+5)+'" text-anchor="middle" font-size="18" font-weight="700" fill="var(--w-labeltx)">'+t+'</text></g>'}
function qmark(x,y,col){return '<g'+an('lb-a-pop',.2)+'><circle cx="'+x+'" cy="'+y+'" r="28" fill="var(--w-label)" stroke="'+col+'" stroke-width="3" stroke-dasharray="6 5"/><text x="'+x+'" y="'+(y+12)+'" text-anchor="middle" font-size="34" font-weight="800" fill="'+col+'">?</text></g>'}

/* 무씨 하나(옆모습, 작게) */
const SDX=[-38,-19,0,19,38,-30,-12,6,24,40],SDY=[-110,-111,-110,-111,-110,-104,-103,-104,-103,-104];
function seedSide(x,y,st){let g='';
 if(st>=2)g+='<path d="M'+(x+2)+' '+(y+2)+' q3 5 0 9" stroke="var(--w-root)" stroke-width="2" fill="none" stroke-linecap="round"/>';
 if(st>=3){const h=[0,0,0,12,18,24][st];g+='<path d="M'+x+' '+y+' v-'+h+'" stroke="#7FB55C" stroke-width="2.2" stroke-linecap="round"/><path d="M'+x+' '+(y-h)+' c-8 -2 -11 -9 -5 -11 c4 0 5 5 5 11z M'+x+' '+(y-h)+' c8 -2 11 -9 5 -11 c-4 0 -5 5 -5 11z" fill="var(--w-leaf)" stroke="var(--w-leafs)" stroke-width=".8"/>';return g}
 g+='<ellipse cx="'+x+'" cy="'+y+'" rx="'+(st?5.6:4.8)+'" ry="'+(st?3.9:3.3)+'" fill="'+(st?'var(--w-seed2)':'var(--w-seed)')+'"/><ellipse cx="'+(x-1.5)+'" cy="'+(y-1.2)+'" rx="1.6" ry=".9" fill="var(--w-hl)"/>';return g}

/* 싹 틔우기 장치: 큰 컵 + 작은 컵(가운데 구멍) + 부직포 심지 + 원 모양 부직포 */
function rig(cx,o){o=o||{};const Y=o.Y||BY,rim=Y-172,g=[];
 const P='M'+(cx-82)+' '+rim+' L'+(cx-64)+' '+(Y-8)+' Q'+(cx-63)+' '+Y+' '+(cx-54)+' '+Y+' L'+(cx+54)+' '+Y+' Q'+(cx+63)+' '+Y+' '+(cx+64)+' '+(Y-8)+' L'+(cx+82)+' '+rim;
 g.push('<ellipse cx="'+cx+'" cy="'+(Y+3)+'" rx="86" ry="8" fill="var(--w-shadow)"/>');
 g.push('<path d="M'+(cx-82)+' '+rim+' A82 11 0 0 1 '+(cx+82)+' '+rim+'" fill="none" stroke="var(--w-rim)" stroke-width="2.4"/>');
 g.push('<path d="'+P+'Z" fill="var(--w-glass)"/>');
 if(o.water){const L=Y-66,hw=64+(Y-L)/172*18;
  g.push('<g'+(o.aWater?an('lb-a-rise',o.aWater):'')+'><path d="M'+(cx-hw)+' '+L+' L'+(cx-64)+' '+(Y-8)+' Q'+(cx-63)+' '+Y+' '+(cx-54)+' '+Y+' L'+(cx+54)+' '+Y+' Q'+(cx+63)+' '+Y+' '+(cx+64)+' '+(Y-8)+' L'+(cx+hw)+' '+L+'Z" fill="var(--w-water)" opacity=".85"/><path d="M'+(cx-hw+3)+' '+L+' H'+(cx+hw-3)+'" stroke="var(--w-water-s)" stroke-width="2.5"/></g>')}
 if(o.small!==false){
  const lift=o.nest?0:170;let attr='';
  if(o.aNest)attr=an('lb-a-nest',.2,'--from:-170px');else if(lift)attr=' style="transform:translateY(-'+lift+'px)"';
  if(o.aMove)attr='';
  g.push('<g'+attr+'>');
  const wet=o.wet,fc=wet?'var(--w-feltw)':'var(--w-felt)',fs=wet?'var(--w-feltw-s)':'var(--w-felt-s)';
  if(o.wick){const wc='var(--w-felt)';
   g.push('<g'+(o.aWick?an('lb-a-up',.15,'--from:80px'):'')+'><path d="M'+cx+' '+(Y-98)+' V'+(Y-14)+'" stroke="'+wc+'" stroke-width="9" stroke-linecap="round"/><path d="M'+cx+' '+(Y-98)+' V'+(Y-14)+'" stroke="var(--w-felt-s)" stroke-width="9" stroke-linecap="round" fill="none" opacity=".35"/>'+
    (wet?'<path d="M'+cx+' '+(Y-98)+' V'+(Y-14)+'" stroke="var(--w-feltw)" stroke-width="9" stroke-linecap="round"'+(o.aWet?an('lb-a-wet',o.aWet):'')+'/>':'')+'</g>');
   if(!o.lie||o.aFelt)g.push('<path d="M'+cx+' '+(Y-98)+' V'+(Y-132)+'" stroke="'+wc+'" stroke-width="9" stroke-linecap="round"'+(o.aFelt?an('lb-a-out',.1):(o.aWick?an('lb-a-up',.15,'--from:80px'):''))+'/>');
   if(o.lie)g.push('<path d="M'+cx+' '+(Y-98)+' Q'+cx+' '+(Y-106)+' '+(cx+30)+' '+(Y-106)+'" stroke="'+wc+'" stroke-width="9" stroke-linecap="round" fill="none"'+(o.aFelt?an('lb-a-fade',.5):'')+'/>')}
  /* 작은 컵 */
  const sp='M'+(cx-80)+' '+(Y-180)+' L'+(cx-50)+' '+(Y-100)+' Q'+(cx-48)+' '+(Y-95)+' '+(cx-42)+' '+(Y-95)+' L'+(cx+42)+' '+(Y-95)+' Q'+(cx+48)+' '+(Y-95)+' '+(cx+50)+' '+(Y-100)+' L'+(cx+80)+' '+(Y-180);
  g.push('<path d="M'+(cx-80)+' '+(Y-180)+' A80 10 0 0 1 '+(cx+80)+' '+(Y-180)+'" fill="none" stroke="var(--w-rim)" stroke-width="2"/>');
  g.push('<path d="'+sp+'Z" fill="var(--w-glass)"/>');
  if(o.felt){g.push('<g'+(o.aFelt?an('lb-a-down',.75,'--from:-150px'):'')+'><path d="M'+(cx-48)+' '+(Y-106)+' L'+(cx-47)+' '+(Y-101)+' A47 7 0 0 0 '+(cx+47)+' '+(Y-101)+' L'+(cx+48)+' '+(Y-106)+'Z" fill="'+fc+'" stroke="'+fs+'" stroke-width="1.2"/><ellipse cx="'+cx+'" cy="'+(Y-106)+'" rx="48" ry="7" fill="'+fc+'" stroke="'+fs+'" stroke-width="1.2"/>'+
   (o.aWet&&wet?'<g'+an('lb-a-out',o.aWet,'animation-duration:1.4s')+'><ellipse cx="'+cx+'" cy="'+(Y-106)+'" rx="48" ry="7" fill="var(--w-felt)" stroke="var(--w-felt-s)" stroke-width="1.2"/></g>':'')+'</g>')}
  const n=o.seeds||0;for(let i=0;i<n;i++){const st=o.stage?o.stage(i):0;g.push('<g'+(o.aSeed?an('lb-a-drop',.8+i*.09):'')+'>'+seedSide(cx+SDX[i],Y+SDY[i],st)+'</g>')}
  g.push('<path d="'+sp+'" fill="none" stroke="var(--w-glass-s)" stroke-width="2.2" stroke-linejoin="round"/>');
  g.push('<path d="M'+(cx-80)+' '+(Y-180)+' A80 10 0 0 0 '+(cx+80)+' '+(Y-180)+'" fill="none" stroke="var(--w-rim)" stroke-width="2.2"/>');
  g.push('<path d="M'+(cx-88)+' '+(Y-181)+' H'+(cx+88)+'" stroke="var(--w-glass-s)" stroke-width="3.5" stroke-linecap="round"/>');
  g.push('<path d="M'+(cx-70)+' '+(Y-168)+' L'+(cx-50)+' '+(Y-112)+'" stroke="#fff" stroke-opacity=".5" stroke-width="4" stroke-linecap="round"/>');
  g.push('</g>')}
 g.push('<path d="'+P+'" fill="none" stroke="var(--w-glass-s)" stroke-width="2.6" stroke-linejoin="round"/>');
 g.push('<path d="M'+(cx-82)+' '+rim+' A82 11 0 0 0 '+(cx+82)+' '+rim+'" fill="none" stroke="var(--w-rim)" stroke-width="2.6"/>');
 g.push('<path d="M'+(cx-74)+' '+(rim+22)+' L'+(cx-60)+' '+(Y-24)+'" stroke="#fff" stroke-opacity=".5" stroke-width="5" stroke-linecap="round"/>');
 return g.join('')}
function darkBox(cx,Y,anim,notext){Y=Y||BY;const x=cx-106,t=Y-304;
 return '<g'+(anim?an('lb-a-down',anim,'--from:-260px'):'')+'><path d="M'+x+' '+(t+14)+' L'+(x+22)+' '+t+' H'+(x+234)+' L'+(x+212)+' '+(t+14)+'Z" fill="var(--w-box2)"/>'+
 '<rect x="'+x+'" y="'+(t+14)+'" width="212" height="'+(Y-t-12)+'" rx="5" fill="var(--w-box)"/><path d="M'+(x+212)+' '+(t+14)+' L'+(x+234)+' '+t+' V'+(Y-16)+' L'+(x+212)+' '+(Y+2)+'Z" fill="var(--w-box2)"/>'+
 '<rect x="'+(x+92)+'" y="'+(t+14)+'" width="28" height="'+(Y-t-12)+'" fill="#000" opacity=".1"/>'+
 (NAR||notext?'':'<text x="'+(x+106)+'" y="'+(t+150)+'" text-anchor="middle" font-size="24" font-weight="800" fill="var(--w-boxtx)">어둠상자</text>')+'</g>'}
function fridge(){const x=690,y=36,w=220,h=420;let g='';
 g+='<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="16" fill="var(--w-fr)" stroke="var(--w-fr-s)" stroke-width="3"/>';
 g+='<rect x="'+(x+12)+'" y="'+(y+12)+'" width="'+(w-24)+'" height="'+(h-24)+'" rx="8" fill="var(--w-fr2)"/>';
 g+='<path d="M'+(x+12)+' 150 H'+(x+w-12)+'M'+(x+12)+' 440 H'+(x+w-12)+'" stroke="var(--w-fr-s)" stroke-width="5"/>';
 if(!NAR)g+='<text x="'+(x+w/2)+'" y="'+(y+42)+'" text-anchor="middle" font-size="21" font-weight="800" fill="#2F4050">냉장실</text>';
 g+='<g opacity=".8">'+[0,1,2,3,4].map(i=>'<path d="M'+(x+40+i*36)+' '+(84+(i%2)*14)+' l6 6 M'+(x+46+i*36)+' '+(84+(i%2)*14)+' l-6 6" stroke="#fff" stroke-width="2"/>').join('')+'</g>';
 return g}
function fridgeDoor(cls){const x=690,y=36,w=220,h=420;
 return '<g'+(cls||'')+'><rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="16" fill="var(--w-fr)" stroke="var(--w-fr-s)" stroke-width="3"/><path d="M'+x+' 150 H'+(x+w)+'" stroke="var(--w-fr-s)" stroke-width="3"/>'+
 '<rect x="'+(x+18)+'" y="80" width="8" height="54" rx="4" fill="var(--w-fr-s)"/><rect x="'+(x+18)+'" y="176" width="8" height="90" rx="4" fill="var(--w-fr-s)"/>'+
 (NAR?'':'<text x="'+(x+w/2)+'" y="300" text-anchor="middle" font-size="22" font-weight="800" fill="#2F4050">냉장고</text>')+'</g>'}
function fridgeDoorOpen(cls){return '<g'+(cls||'')+'><path d="M910 36 L952 60 V432 L910 456Z" fill="var(--w-fr)" stroke="var(--w-fr-s)" stroke-width="3"/><path d="M920 110 v60" stroke="var(--w-fr-s)" stroke-width="6" stroke-linecap="round"/></g>'}

/* 비커(물 붓기) */
function pitcher(x,y,anim,rot){return '<g transform="translate('+x+' '+y+')"><g'+(anim?an('lb-a-tilt',0,'--rot:'+(rot||-40)+'deg'):' opacity="0"')+'>'+
 '<path d="M-34 -50 L34 -50 L38 46 Q38 54 30 54 L-30 54 Q-38 54 -38 46Z" fill="var(--w-glass)" stroke="var(--w-glass-s)" stroke-width="2.6"/>'+
 '<path d="M-37 -4 L37 -4 L38 46 Q38 52 30 52 L-30 52 Q-37 52 -37 46Z" fill="var(--w-water)" opacity=".85"/>'+
 '<path d="M-34 -50 L-50 -60 L-32 -40" fill="var(--w-glass)" stroke="var(--w-glass-s)" stroke-width="2.6" stroke-linejoin="round"/>'+
 '<path d="M20 -30h12M22 -12h10M22 6h10" stroke="var(--w-glass-s)" stroke-width="1.6"/></g></g>'}
function stream(d,delay){return '<path d="'+d+'" stroke="var(--w-water-s)" stroke-width="6" fill="none" stroke-linecap="round" stroke-dasharray="16 9"'+an('lb-a-stream',delay||0)+'/>'}
function packet(x,y,delay){return '<g transform="translate('+x+' '+y+')"><g'+an('lb-a-shake',delay||0)+'>'+
 '<rect x="-30" y="-42" width="60" height="84" rx="5" fill="var(--w-kraft)" stroke="var(--w-kraft-s)" stroke-width="1.6"/><rect x="-30" y="-42" width="60" height="13" fill="var(--w-kraft-s)" opacity=".55"/>'+
 '<rect x="-22" y="-20" width="44" height="34" rx="6" fill="#fff"/><ellipse cx="-7" cy="-4" rx="5" ry="3.6" fill="#7A4A2C"/><ellipse cx="6" cy="3" rx="5" ry="3.6" fill="#7A4A2C"/><ellipse cx="9" cy="-9" rx="4" ry="3" fill="#7A4A2C"/>'+
 (NAR?'':'<text x="0" y="33" text-anchor="middle" font-size="16" font-weight="800" fill="#3B2A16">무씨</text>')+'</g></g>'}

/* 화분 + 케일 */
function mixHex(a,b,t){t=Math.max(0,Math.min(1,t));const p=s=>[1,3,5].map(i=>parseInt(s.slice(i,i+2),16));const A=p(a),B=p(b);return '#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('')}
function pot(cx,o){o=o||{};const Y=BY;let g='<ellipse cx="'+cx+'" cy="'+(Y+3)+'" rx="76" ry="8" fill="var(--w-shadow)"/>';
 g+='<path d="M'+(cx-72)+' 352 L'+(cx-55)+' '+(Y-4)+' Q'+(cx-54)+' '+Y+' '+(cx-48)+' '+Y+' L'+(cx+48)+' '+Y+' Q'+(cx+54)+' '+Y+' '+(cx+55)+' '+(Y-4)+' L'+(cx+72)+' 352Z" fill="var(--w-pot)"/>';
 g+='<rect x="'+(cx-79)+'" y="334" width="158" height="20" rx="5" fill="var(--w-pot2)"/>';
 const sc=o.dry?'var(--w-soild)':'var(--w-soil)';
 g+='<ellipse cx="'+cx+'" cy="338" rx="70" ry="9" fill="'+sc+'"/>';
 if(o.wetA)g+='<ellipse cx="'+cx+'" cy="338" rx="70" ry="9" fill="var(--w-soilw)"'+an('lb-a-wet',o.wetA)+'/>';
 if(o.dry)g+='<path d="M'+(cx-40)+' 338 l12 -3 l8 4 M'+(cx+14)+' 336 l10 4 l9 -3" stroke="#5B4330" stroke-width="1.5" fill="none" opacity=".6"/>';
 return g}
const LEAFSIDE=[-1,1,-1,1,-1,1,-1,1,-1,1];
function kale(cx,sy,k){const stemH=30+(k.h-10)*8,sw=12-5.5*k.thin;
 const base=mixHex('#3E7D33','#A9C774',k.pale),leaf=mixHex(base,'#C2B04E',k.wilt*.85),edge=mixHex(mixHex('#24501E','#5E8A3A',k.pale),'#6E5E22',k.wilt*.5),vein=mixHex('#A6D184','#EEF5D0',k.pale);
 const lean=k.wilt*22,n=k.n,tx=cx+lean,ty=sy-stemH;let g='';
 g+='<path d="M'+cx+' '+sy+' Q'+(cx+2)+' '+(sy-stemH*.6)+' '+tx+' '+ty+'" stroke="'+mixHex('#7FA85A','#C9DB98',k.pale)+'" stroke-width="'+sw+'" fill="none" stroke-linecap="round"/>';
 /* 잎은 부채꼴로 하나씩 떨어져 펼쳐져 셀 수 있게(바깥 잎부터 그림) */
 const order=[...Array(n).keys()].sort((a,b)=>Math.abs(b-(n-1)/2)-Math.abs(a-(n-1)/2));
 order.forEach(i=>{const t=n>1?i/(n-1):.5,c=Math.abs(t-.5)*2,side=t<.5?-1:1;
  let ang=-80+160*t;ang+=side*k.wilt*62*c+(c<.2?k.wilt*45:0);
  const ay=ty+c*stemH*.45,ax=tx;
  const L=(104-30*c)*k.size*(1-.06*k.pale)*(1-.18*k.wilt),p=L*.4,w=L*.27*(1-.25*k.wilt);
  let pts=[];for(let s=0;s<=20;s++){const u=s/20,r=Math.pow(Math.sin(Math.PI*u),.85)*(1+.1*Math.sin(u*Math.PI*9)),cu=k.wilt*u*u*L*.35*(side||1);pts.push([w*r,-(p+(L-p)*u)+k.wilt*u*u*L*.12,cu])}
  let d='M0 0 L0 '+(-p);pts.forEach(q=>{d+=' L'+(q[0]+q[2]).toFixed(1)+' '+q[1].toFixed(1)});for(let s=pts.length-1;s>=0;s--)d+=' L'+(-pts[s][0]+pts[s][2]).toFixed(1)+' '+pts[s][1].toFixed(1);d+='Z';
  const bend=k.wilt*34*(side||1);
  g+='<g transform="translate('+ax.toFixed(1)+' '+ay.toFixed(1)+') rotate('+ang.toFixed(1)+')"><g transform="skewX('+bend.toFixed(1)+')"><path d="'+d+'" fill="'+leaf+'" stroke="'+edge+'" stroke-width="2.6" stroke-linejoin="round"/>'+
   '<path d="M0 0 V'+(-L*.92).toFixed(1)+'" stroke="'+vein+'" stroke-width="2.2"/>'+
   '<path d="M0 '+(-L*.48).toFixed(1)+' l'+(w*.5).toFixed(1)+' '+(-L*.12).toFixed(1)+' M0 '+(-L*.66).toFixed(1)+' l'+(-w*.46).toFixed(1)+' '+(-L*.12).toFixed(1)+'" stroke="'+vein+'" stroke-width="1.5" opacity=".85"/></g></g>'});
 return g}
function shade(cx,o){o=o||{};const x=cx-114,t=BY-330;
 let g='<g'+(o.anim?an('lb-a-down',o.anim,'--from:-280px'):o.lift?an('lb-a-lift',o.lift):'')+(o.dx?' transform="translate('+o.dx+' 0)"':'')+'><rect x="'+x+'" y="'+t+'" width="228" height="'+(BY-t+2)+'" rx="10" fill="var(--w-shade)" stroke="var(--w-shade-s)" stroke-width="2.5"/>';
 for(let i=0;i<6;i++)g+='<circle cx="'+(x+34+i*32)+'" cy="'+(t+26)+'" r="6" fill="#5E6B78"/>';
 for(let i=0;i<6;i++)g+='<circle cx="'+(x+34+i*32)+'" cy="'+(BY-26)+'" r="6" fill="#5E6B78"/>';
 if(!NAR)g+='<text x="'+cx+'" y="'+(t+176)+'" text-anchor="middle" font-size="19" font-weight="800" fill="#2F3A46">햇빛 차단</text><text x="'+cx+'" y="'+(t+202)+'" text-anchor="middle" font-size="19" font-weight="800" fill="#2F3A46">장치</text>';return g+'</g>'}
function can(x,y,anim,delay){return '<g transform="translate('+x+' '+y+')"><g'+(anim?an('lb-a-tilt',delay||0,'--rot:-34deg'):' opacity="0"')+'>'+
 '<path d="M-6 -30 L-70 -70" stroke="#5B9BC4" stroke-width="9" stroke-linecap="round"/><ellipse cx="-74" cy="-73" rx="9" ry="6" fill="#4A88B0" transform="rotate(-35 -74 -73)"/>'+
 '<path d="M-10 -46 h74 l-6 66 a8 8 0 0 1 -8 7 h-46 a8 8 0 0 1 -8 -7z" fill="#6FB2DA" stroke="#3F7EA6" stroke-width="2.5"/>'+
 '<path d="M10 -46 q18 -34 40 0" stroke="#3F7EA6" stroke-width="6" fill="none" stroke-linecap="round"/></g></g>'}
function tag(cx,letter,anim){const col=letter==='가'?A_COL:B_COL;return '<g'+(anim?an('lb-a-pop',anim):'')+'><rect x="'+(cx-21)+'" y="368" width="42" height="40" rx="7" fill="var(--w-label)" stroke="'+col+'" stroke-width="3"/><text x="'+cx+'" y="396" text-anchor="middle" font-size="23" font-weight="800" fill="'+col+'">'+letter+'</text></g>'}

/* 돋보기: 위에서 본 부직포(싹 튼 씨 세기) */
const TP=[[-70,-48],[-12,-66],[46,-52],[84,-2],[-92,10],[-34,-6],[24,8],[-58,58],[4,66],[62,50]];
function seedTop(x,y,st,i,dark){let g='';
 if(st>=2)g+='<path d="M'+(x+8)+' '+(y+5)+' q14 8 10 24" stroke="var(--w-root)" stroke-width="4" fill="none" stroke-linecap="round"/>';
 if(st>=3){const s=st===3?1.3:st===4?1.55:1.75;
  if(dark){/* 어둠 속 싹: 떡잎이 노랗고 줄기가 길게 웃자람 */const L=[0,0,0,16,26,34][st],lx=x-L*.7,ly=y-L;
   g+='<path d="M'+x+' '+y+' Q'+(x-4)+' '+(y-L*.5)+' '+lx+' '+ly+'" stroke="#F3EBC4" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M'+x+' '+y+' Q'+(x-4)+' '+(y-L*.5)+' '+lx+' '+ly+'" stroke="#C9BC7A" stroke-width="1.2" fill="none"/>'+
   '<ellipse cx="'+(x+7)+'" cy="'+(y+5)+'" rx="5" ry="3.2" fill="var(--w-seed2)" transform="rotate(30 '+(x+7)+' '+(y+5)+')" opacity=".85"/>'+
   '<g transform="translate('+lx+' '+ly+') scale('+(s*.85)+')"><path d="M0 0 c-13 -2 -16 -12 -6 -15 c5 0 7 7 6 15z" fill="#EDE59A" stroke="#A99A3A" stroke-width="1.2"/><path d="M0 0 c13 -2 16 -12 6 -15 c-5 0 -7 7 -6 15z" fill="#E4DA86" stroke="#A99A3A" stroke-width="1.2"/></g>';return g}
  g+='<g transform="translate('+x+' '+y+') scale('+s+')"><ellipse cx="8" cy="6" rx="5" ry="3.2" fill="var(--w-seed2)" transform="rotate(30 8 6)" opacity=".85"/><path d="M0 0 c-14 -2 -18 -14 -7 -17 c6 0 8 8 7 17z" fill="var(--w-leaf)" stroke="var(--w-leafs)" stroke-width="1.1"/><path d="M0 0 c14 -2 18 -14 7 -17 c-6 0 -8 8 -7 17z" fill="var(--w-leaf2)" stroke="var(--w-leafs)" stroke-width="1.1"/></g>'}
 else{const r=st>=1?11:9;g+='<ellipse cx="'+x+'" cy="'+y+'" rx="'+r+'" ry="'+(r*.72)+'" fill="'+(st>=1?'var(--w-seed2)':'var(--w-seed)')+'" stroke="#4A3220" stroke-width="1" transform="rotate('+((i*37)%180)+' '+x+' '+y+')"/><ellipse cx="'+(x-3)+'" cy="'+(y-2)+'" rx="3" ry="1.6" fill="var(--w-hl)" opacity=".8"/>';
  if(st===2)g+='<path d="M'+(x-6)+' '+(y-3)+' l5 7" stroke="#E8DCC0" stroke-width="2"/>'}
 return g}
function lens(cx,cy,c,d,cup,o){o=o||{};const wet=!!c.water,R=128,dark=!c.light;
 let g='<circle cx="'+cx+'" cy="'+(cy+6)+'" r="'+(R+4)+'" fill="var(--w-shadow)"/><circle cx="'+cx+'" cy="'+cy+'" r="'+R+'" fill="var(--w-lens)" stroke="var(--w-lens-s)" stroke-width="7"/>'+
 '<circle cx="'+cx+'" cy="'+cy+'" r="'+(R-14)+'" fill="'+(wet?'var(--w-feltw)':'var(--w-felt)')+'" stroke="'+(wet?'var(--w-feltw-s)':'var(--w-felt-s)')+'" stroke-width="1.5"/>';
 for(let i=0;i<6;i++)g+='<path d="M'+(cx-84+i*10)+' '+(cy-70+i*28)+' q40 -8 '+(150-i*14)+' 6" stroke="rgba(110,100,80,.13)" stroke-width="2.5" fill="none"/>';
 const marks=o.marks||[];
 TP.forEach((p,i)=>{const st=seedStage(c,i,d),x=cx+p[0],y=cy+p[1],m=marks.indexOf(i);
  const grow=o.grow&&st>=3&&seedStage(c,i,d-1)<3;
  let s='<g'+(grow?an('lb-a-grow',.1+i*.05):'')+'>'+seedTop(x,y,st,i,dark)+'</g>';
  if(o.hint===i)s+='<circle cx="'+x+'" cy="'+(y-6)+'" r="30" fill="none" stroke="var(--lb-sci)" stroke-width="4" class="lb-a-pulse"/>';
  if(m>=0)s+='<g'+(o.pop===i?an('lb-a-pop',0):'')+'><circle cx="'+(x+17)+'" cy="'+(y-25)+'" r="14" fill="'+(cup?B_COL:A_COL)+'" stroke="var(--w-label)" stroke-width="2.5"/><text x="'+(x+17)+'" y="'+(y-19.5)+'" text-anchor="middle" font-size="16" font-weight="800" fill="var(--w-label)">'+(m+1)+'</text></g>';
  if(o.count)s='<g class="lb-hit" role="button" tabindex="0" data-seed="'+cup+':'+i+'" aria-pressed="'+(m>=0)+'" aria-label="'+(cup?'나':'가')+' 컵 씨 '+(i+1)+(m>=0?', '+(m+1)+'번으로 셌어요':'')+'"><circle class="lb-hitc" cx="'+x+'" cy="'+(y-6)+'" r="27" fill="transparent" stroke="none"/>'+s+'</g>';
  g+=s});
 if(o.care)g+='<g'+an('lb-a-drip',.1)+'><path d="M'+(cx+R-10)+' '+(cy-R+4)+' c-9 12 -11 19 0 23 c11 -4 9 -11 0 -23z" fill="var(--w-water)" stroke="var(--w-water-s)" stroke-width="2"/></g>';
 return g}
const STAGETXT=['그대로예요','씨가 부풀었어요','뿌리가 나왔어요','싹이 텄어요'];
function seedTxt(c,d){let m=0;for(let i=0;i<10;i++)m=Math.max(m,seedStage(c,i,d));return STAGETXT[Math.min(3,m)]}

/* 준비물 카드 */
function itemArt(k){const cup=(x,y,w,h,hole)=>'<path d="M'+(x-w/2)+' '+y+' L'+(x-w/2+9)+' '+(y+h)+' Q'+x+' '+(y+h+5)+' '+(x+w/2-9)+' '+(y+h)+' L'+(x+w/2)+' '+y+'" fill="var(--w-glass)" stroke="var(--w-glass-s)" stroke-width="2.4"/><path d="M'+(x-w/2-3)+' '+y+' H'+(x+w/2+3)+'" stroke="var(--w-glass-s)" stroke-width="3" stroke-linecap="round"/>'+(hole?'<circle cx="'+x+'" cy="'+(y+h-2)+'" r="3.4" fill="var(--w-glass-s)"/>':'');
 const A={
  small:cup(-28,-26,50,52,1)+cup(28,-22,50,52,1),
  big:cup(-30,-40,56,80)+cup(30,-36,56,80),
  wick:'<rect x="-22" y="-42" width="13" height="84" rx="6" fill="var(--w-felt)" stroke="var(--w-felt-s)" stroke-width="2"/><rect x="8" y="-38" width="13" height="84" rx="6" fill="var(--w-felt)" stroke="var(--w-felt-s)" stroke-width="2"/>',
  felt:'<ellipse cx="0" cy="16" rx="56" ry="17" fill="var(--w-felt)" stroke="var(--w-felt-s)" stroke-width="2"/><ellipse cx="0" cy="-2" rx="56" ry="17" fill="var(--w-felt)" stroke="var(--w-felt-s)" stroke-width="2"/>',
  water:'<g transform="translate(-24 -42)"><path d="M0 0 h48 v76 a6 6 0 0 1 -6 6 h-36 a6 6 0 0 1 -6 -6z" fill="var(--w-glass)" stroke="var(--w-glass-s)" stroke-width="2.4"/><path d="M2 26 h44 v50 a4 4 0 0 1 -4 4 h-36 a4 4 0 0 1 -4 -4z" fill="var(--w-water)"/></g>',
  seeds:'<rect x="-28" y="-44" width="56" height="84" rx="5" fill="var(--w-kraft)" stroke="var(--w-kraft-s)" stroke-width="2"/>'+[-14,-4,6,14,-9,1,11].map((x,k)=>'<ellipse cx="'+x+'" cy="'+(10+(k>3?12:0))+'" rx="3.8" ry="2.7" fill="#7A4A2C"/>').join(''),
  box:'<path d="M-46 -30 L-34 -40 H54 L42 -30Z" fill="var(--w-box2)"/><rect x="-46" y="-30" width="88" height="72" rx="4" fill="var(--w-box)"/><path d="M42 -30 L54 -40 V30 L42 42Z" fill="var(--w-box2)"/>',
  tag:'<rect x="-40" y="-36" width="36" height="36" rx="6" fill="var(--w-label)" stroke="var(--lb-a)" stroke-width="3"/><rect x="4" y="-6" width="36" height="36" rx="6" fill="var(--w-label)" stroke="var(--lb-b)" stroke-width="3"/>'+(NAR?'':'<text x="-22" y="-10" text-anchor="middle" font-size="22" font-weight="800" fill="var(--lb-a)">가</text><text x="22" y="20" text-anchor="middle" font-size="22" font-weight="800" fill="var(--lb-b)">나</text>'),
  can:'<g transform="translate(-6 30)"><path d="M-6 -30 L-48 -58" stroke="#5B9BC4" stroke-width="8" stroke-linecap="round"/><path d="M-10 -46 h62 l-5 56 a7 7 0 0 1 -7 6 h-38 a7 7 0 0 1 -7 -6z" fill="#6FB2DA" stroke="#3F7EA6" stroke-width="2.5"/><path d="M6 -46 q16 -28 34 0" stroke="#3F7EA6" stroke-width="5" fill="none"/></g>',
  shade:'<rect x="-40" y="-44" width="80" height="88" rx="6" fill="var(--w-shade)" stroke="var(--w-shade-s)" stroke-width="2.5"/>'+[0,1,2,3].map(i=>'<circle cx="'+(-24+i*16)+'" cy="-32" r="3.5" fill="#5E6B78"/>').join('')};
 return A[k]||''}
function kaleArt(){return '<g transform="translate(0 -6) scale(.36) translate(0 -330)">'+pot(0,{})+kale(0,338,{n:6,h:10,wilt:0,pale:0,thin:0,size:1})+'</g>'}
function toolsScene(list,anim){let b='';if(NAR)list.forEach(it=>LEG.push([null,it[1]]));const n=list.length,cols=n<=4?n:n<=6?3:4,rows=Math.ceil(n/cols),cw=200,ch=176,gx=18,gy=18;
 const W=cols*cw+(cols-1)*gx,H=rows*ch+(rows-1)*gy,x0=480-W/2,y0=Math.max(30,240-H/2);
 list.forEach((it,i)=>{const c=i%cols,r=Math.floor(i/cols),x=x0+c*(cw+gx),y=y0+r*(ch+gy),cx=x+cw/2;
  b+='<g'+(anim?an('lb-a-pop',.3+i*.17):'')+'><rect x="'+x+'" y="'+y+'" width="'+cw+'" height="'+ch+'" rx="16" fill="var(--w-label)" stroke="var(--w-felt-s)" stroke-width="1.5"/>'+
  '<g transform="translate('+cx+' '+(y+74)+')">'+(it[0]==='kale'?kaleArt():itemArt(it[0]))+'</g>'+(NAR?'':'<text x="'+cx+'" y="'+(y+ch-18)+'" text-anchor="middle" font-size="20" font-weight="800" fill="var(--w-labeltx)">'+it[1]+'</text>')+'</g>'});
 return b}
