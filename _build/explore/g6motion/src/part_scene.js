/* 지금 움직이는 행동의 진행(0~1) — requestAnimationFrame으로 그림을 다시 그림 */
function fxP(){if(!UI.fx||!UI.fx.ms)return 1;return Math.max(0,Math.min(1,(performance.now()-UI.fx.t0)/(RM?120:UI.fx.ms)))}

/* ───── 실험 1: 교실 사진 · 공원 ───── */
const PH={x:160,y:70,W:520,H:244};   /* 스마트 기기 화면 */
function roomIn(t,W){const k=W/640;return '<g transform="scale('+k.toFixed(4)+')">'+room(t)+'</g>'}
function phoneOnTri(t,o){o=o||{};let g=bg({});const cx=PH.x+PH.W/2;
 if(o.tri!==false)g+='<g'+(o.triA?an('lb-a-up',0,'--from:120px'):'')+'>'+tripodArt(cx,PH.y+PH.H+30,118,1)+'</g>';
 g+=phoneArt(PH.x,PH.y,PH.W,PH.H,roomIn(t,PH.W)+(o.over||''),{rot:o.rot});
 if(o.hand)g+=hand(PH.x-20,PH.y+PH.H-10,-20,1.1);
 return g}
function e1Scene(s){const r=R(),id=s.id,f=fid();
 if(id==='tri'){const on=has('tri');
  if(!on)return phoneOnTri(0,{tri:false,rot:-5,hand:1})+mini(PH.x+PH.W/2,PH.y+PH.H+80,'손으로 들고 있으면 화면이 흔들려요',20);
  return phoneOnTri(0,{triA:f==='tri'})}
 if(id==='pred')return phoneOnTri(0)+qmark(830,120);
 if(id==='shot'){const k=seqK('ph',['p1','p2']);
  if(f==='p1'){const p=fxP();return phoneOnTri(0,{over:'<rect width="'+PH.W+'" height="'+PH.H+'" fill="#FFFFFF" opacity="'+(.85*(1-p)).toFixed(2)+'"/>'})}
  if(f==='p2'){const T=Math.min(5,fxP()*5.6),n=Math.ceil(5-T-1e-6);const sc=PH.W/640;
   let ov='<circle cx="'+(PH.W-34)+'" cy="34" r="24" fill="#1D232B" opacity=".85"/><text x="'+(PH.W-34)+'" y="44" font-size="26" text-anchor="middle" font-weight="800" fill="#FFFFFF">'+(n>0?n:'')+'</text>';
   if(T>=5)ov+='<rect width="'+PH.W+'" height="'+PH.H+'" fill="#FFFFFF" opacity=".75"/>';
   return phoneOnTri(T,{over:ov})+photoArt(740,170,180,84,roomIn(0,180),'처음 사진')}
  if(k===0)return phoneOnTri(0);
  if(k===1)return phoneOnTri(0)+photoArt(740,170,180,84,roomIn(0,180),'처음 사진');
  return bg({})+photoArt(40,150,420,197,roomIn(0,420),'처음 사진')+photoArt(500,150,420,197,roomIn(5,420),'5초 뒤 사진')}
 if(id==='park'){const k=seqK('pk',['k1v','k2v']);const blank=(x,y)=>'<rect x="'+x+'" y="'+y+'" width="420" height="280" rx="8" fill="var(--w-label)" stroke="var(--w-felt-s)" stroke-width="2" stroke-dasharray="10 8"/>';
  let g=bg({});
  g+=(k>=1?'<g'+(f==='k1v'?an('lb-a-fade',0):'')+'>'+photoArt(40,140,420,280,park(0),'처음 모습')+'</g>':blank(40,140));
  g+=(k>=2?'<g'+(f==='k2v'?an('lb-a-fade',0):'')+'>'+photoArt(500,140,420,280,park(1),'얼마 뒤 모습')+'</g>':blank(500,140));
  return g}
 return bg({})}

/* ───── 실험 2: 5초 동안 이동 거리 ───── */
const DIST=MODEL.dist;
function e2Scene(s){const r=R(),id=s.id,f=fid(),idx=k=>idxOf(k)<r.step||has(k);
 const base={line:idx('line'),tape:idx('tape')?true:false,tri:idx('tri'),cars:idx('wind'),key:idx('wind')?0:null};
 if(id==='line')return track2({line:has('line'),lineA:f==='line',roll:!has('line'),cars:false});
 if(id==='tape'){const g=f==='tape'?fxP()*150:has('tape')?true:false;return track2({line:1,tape:g,rolled:g===false,cars:false})}
 if(id==='tri')return track2({line:1,tape:true,tri:has('tri'),triA:f==='tri',cars:false})+(has('tri')?'':tripodArt(860,330,80,.7));
 if(id==='wind'){if(!has('wind'))return track2({line:1,tape:true,tri:1,cars:false})+carTop(880,412,'R',{s:.75})+carTop(780,412,'B',{s:.75});
  return track2({line:1,tape:true,tri:1,key:f==='wind'?fxP()*720:0})}
 if(id==='pred')return track2({line:1,tape:true,tri:1,key:0})+qmark(560,98);
 if(id==='run'){if(f==='run'){const p=fxP()*6.2,t=Math.max(0,Math.min(5,p-.3));
   const o={line:1,tape:true,tri:1,key:720-t*144,pos:{R:DIST.R*t/5,B:DIST.B*t/5},clock:t};if(p>=5.3)o.snap=Math.max(0,.8-(p-5.3)*.9);
   return track2(o)+(p<.5?mini(480,98,'출발!',24):'')}
  if(!has('run'))return track2({line:1,tape:true,tri:1,key:0,clock:0});
  return track2({line:1,tape:true,tri:1,key:0,pos:DIST,clock:5})+mini(560,98,'5초 뒤 사진',22)}
 if(id==='read')return readScene();
 return track2(base)}
function photo5(x,y,sc){return photoArt(x,y,960*sc,380*sc,'<g transform="scale('+sc+') translate(0 -70)">'+track2({line:1,tape:true,pos:DIST,key:0})+'</g>')}
function readScene(){const k=seqK('zm',['zR','zB']),f=fid();let g=bg({})+photo5(240,30,.5)+mini(480,248,'5초 뒤 사진',18);
 const blank=(x,y)=>'<rect x="'+x+'" y="'+y+'" width="430" height="170" rx="10" fill="var(--w-label)" stroke="var(--w-felt-s)" stroke-width="2" stroke-dasharray="10 8"/>';
 g+=(k>=1?'<g'+(f==='zR'?an('lb-a-fade',0):'')+'>'+zoom2(30,290,430,170,DIST.R,'R')+'</g>':blank(30,290))+mini(245,278,'빨간색 자동차 앞부분',17);
 g+=(k>=2?'<g'+(f==='zB'?an('lb-a-fade',0):'')+'>'+zoom2(500,290,430,170,DIST.B,'B')+'</g>':blank(500,290))+mini(715,278,'파란색 자동차 앞부분',17);
 return g}

/* ───── 실험 3: 100 cm를 가는 데 걸린 시간 ───── */
function runState(k){const st=R().st;st.rs=st.rs||{};return st.rs[k]=st.rs[k]||{}}
function e3Scene(s){const r=R(),id=s.id,f=fid();
 if(id==='line')return track3({line:has('line'),lineA:f==='line'});
 if(id==='finish'){if(f==='finish'){const p=fxP();return track3({line:1,tape:Math.min(110,p*170),fin:p>.7,finA:p>.7&&p<.8})}
  return track3({line:1,fin:has('finish')})}
 if(id==='pred')return track3({line:1,fin:1,k:'G',key:0})+qmark(420,120);
 if(id==='runG'||id==='runY'){const k=id==='runG'?'G':'Y',T=MODEL.T[k],rs=runState(k),run=UI.run&&UI.run.k===k;
  if(run){const t=(performance.now()-UI.run.t0)/1000,sa=UI.run.stopAt;
   return track3({line:1,fin:1,k,pos:Math.min(118,100/T*t),ghost:sa!=null?Math.min(118,100/T*sa):null,sw:swTxt((sa!=null?sa:t)*100),swOn:sa==null,key:Math.max(0,720-t*150)})}
  if(rs.ok)return track3({line:1,fin:1,k,pos:118,ghost:Math.min(118,100/T*R().st.sw[k]/100),sw:swTxt(R().st.sw[k]),swOn:0})+mini(480,92,'초시계를 멈춘 순간의 자동차(흐린 그림)',18);
  if(rs.miss!=null)return track3({line:1,fin:1,k,pos:0,key:f==='w'+k?fxP()*720:rs.wound?0:null,ghost:Math.min(118,100/T*rs.miss/100),sw:swTxt(rs.miss),swOn:0})+mini(480,92,'지난번에 초시계를 멈춘 순간(흐린 그림)',18);
  return track3({line:1,fin:1,k,pos:0,key:f==='w'+k?fxP()*720:rs.wound?0:null,sw:'00.00',swOn:0})}
 return track3({line:1,fin:1})}

/* ───── 실험 4: 속력 표 ───── */
function spOf(){return MODEL.tab.map(t=>{const x=R().rec['s'+t[0]];return x&&x.ok?x.v:''})}
function exprAt(ids,rows){const f=fid(),i=ids.indexOf(f);if(i>=0)return ROWS[rows[i]].calc;
 const p=rows.find(k=>R().pend[k]!=null&&!rowDone(k));return p?ROWS[p].calc:null}
function e4Scene(s){const r=R(),id=s.id,f=fid();
 if(id==='table'){const on=has('table');return bgTop()+(on?'<g'+(f==='table'?an('lb-a-fade',0):'')+'>'+speedTable({rows:1})+'</g>':speedTable({rows:0})+qmark(480,300))}
 if(id==='pred')return bgTop()+speedTable({rows:1})+qmark(800,90);
 if(id==='calc1')return bgTop()+speedTable({rows:1,sp:spOf(),expr:exprAt(['qR','qB'],['sR','sB']),hl:exprAt(['qR','qB'],['sR','sB'])});
 if(id==='calc2')return bgTop()+speedTable({rows:1,sp:spOf(),expr:exprAt(['qG','qY'],['sG','sY']),hl:exprAt(['qG','qY'],['sG','sY'])});
 if(id==='order')return bgTop()+speedTable({rows:1,sp:seqK('od',['ordr'])>=1?spOf():spOf().map(()=>'')});
 if(id==='more'){const dn=f==='m4'||!!UI.mq.both||r.more.a!=null;return bgTop()+(dn?'<g'+(f==='m4'?an('lb-a-fade',0):'')+'>'+transTable()+'</g>':qmark(480,250))}
 return bgTop()+speedTable({rows:1,sp:spOf()})}

function sceneSVG(){const v=V(),r=R(),s=curStep(),id=s.id,no=v.no;
 const T=(g,l,vb)=>svg(g+lensOf(s,g),l||s.t,vb);
 if(id==='tools'){if(!(r.done.tools||fxOn('tools')))return T(bg({})+boxArt(480),'준비물 상자');return T(bg({})+toolsScene(v.tools,fxOn('tools')),'준비물: '+v.tools.map(x=>x[1]).join(', '),v.tools.length>4?'0 10 960 520':null)}
 const F={1:e1Scene,2:e2Scene,3:e3Scene,4:e4Scene}[no];
 let vb={1:'0 30 960 470',2:'0 64 960 386',3:'0 50 960 360',4:'110 70 740 440'}[no];
 if(no===1&&id==='park')vb='20 90 920 340';
 if(no===2&&id==='read')vb='0 10 960 460';
 return T(F(s),s.t,vb)}
