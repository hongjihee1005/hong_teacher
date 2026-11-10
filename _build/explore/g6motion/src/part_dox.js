/* 실험 단계의 행동 */
function doX(id){const r=R(),s=curStep(),st=r.st;if(UI.fx)return;
 if(id==='m4'){UI.mq.cur=id;fx(id,1200,()=>{r.seen[id]=1;UI.mq[id]=1;UI.mq.both=1});return}
 if(/^st[GY]$/.test(id)){stopRun(id.slice(2));return}
 if(UI.run)return;
 r.act[s.id]=1;if(idxOf('pred')>=0&&r.step>idxOf('pred'))r.obs=1;
 const seq=(key,ids,ms,after)=>{const i=ids.indexOf(id),c=st[key]||0;if(i<0||c!==i)return;UI.mq.cur=id;fx(id,Array.isArray(ms)?ms[i]:ms,()=>{st[key]=i+1;r.seen[id]=1;if(after)after(i)})};
 const pendOf=rows=>i=>{const row=rows[i];if(!rowDone(row))r.pend[row]=1};
 switch(s.id){
  case 'shot':seq('ph',['p1','p2'],[700,5600]);return;
  case 'park':seq('pk',['k1v','k2v'],[900,900]);return;
  case 'read':seq('zm',['zR','zB'],[800,800],pendOf(['dR','dB']));return;
  case 'calc1':seq('c1',['qR','qB'],[600,600],pendOf(['sR','sB']));return;
  case 'calc2':seq('c2',['qG','qY'],[600,600],pendOf(['sG','sY']));return;
  case 'order':seq('od',['ordr'],900);return;
  case 'runG':case 'runY':{const k=s.id==='runG'?'G':'Y',rs=runState(k);if(rs.ok)return;
   if(id==='w'+k&&!rs.wound){UI.runMsg='';fx(id,1000,()=>{rs.wound=1});return}
   if(id==='go'+k&&rs.wound)startRun(k);return}}}
/* 실험 3: 초시계는 학생이 직접 시작하고 멈춤(멈춘 숫자는 그대로 남김) */
function startRun(k){UI.run={k,t0:performance.now(),stopAt:null};UI.runMsg='';render();
 const T=MODEL.T[k],tick=()=>{const u=UI.run;if(!u||u.k!==k)return;const t=(performance.now()-u.t0)/1000;
  if((u.stopAt!=null&&t>=Math.max(T*1.2,u.stopAt+.4))||(u.stopAt==null&&t>=T*1.9)){endRun(k);return}
  renderScene();requestAnimationFrame(tick)};requestAnimationFrame(tick)}
function stopRun(k){const u=UI.run;if(!u||u.k!==k||u.stopAt!=null)return;u.stopAt=(performance.now()-u.t0)/1000;render()}
function endRun(k){const u=UI.run,r=R(),rs=runState(k),T=MODEL.T[k],row='t'+k;UI.run=null;rs.wound=0;
 if(u.stopAt==null){rs.miss=null;UI.runMsg='멈춤 단추를 누르지 못했어요. 태엽을 다시 감고 재요.'}
 else{const cs=Math.floor(u.stopAt*100),s=cs/100;
  if(Math.abs(s-T)>MODEL.tol){rs.miss=cs;UI.runMsg=(s<T?'자동차 앞부분이 결승선에 닿기 전에 멈췄어요.':'자동차 앞부분이 결승선을 지난 뒤에 멈췄어요.')+' 태엽을 다시 감고 재요.'}
  else{r.st.sw=r.st.sw||{};r.st.sw[k]=cs;rs.ok=1;rs.miss=null;r.seen['s'+k]=1;if(!rowDone(row))r.pend[row]=1;UI.runMsg=''}}
 save();render()}
/* 숫자 적기: 화면(눈금·초시계·내 계산)과 같은지만 알려 줌. 같은 값으로 다시 누르면 세지 않음 */
function tryKey(k,val){const r=R();if(r.last[k]===val)return -1;r.last[k]=val;r.tries[k]=(r.tries[k]||0)+1;return r.tries[k]}
const decN=t=>(String(t).split('.')[1]||'').length;
function trial(row){const r=R(),R0=ROWS[row];if(!R0||R0.t!=='num'||!numOpen(row))return;const txt=String(UI.inp[row]||'').trim(),want=rowV(row);
 if(!txt||!/^\d+(\.\d+)?$/.test(txt)){UI.fb[row]=[0,'숫자로 써요.'];render();return}
 if(+txt===+want&&decN(txt)<=Math.max(1,R0.rd)){r.rec[row]={ok:1,v:want};delete r.pend[row];UI.inp[row]='';UI.attn=false;UI.fb={};UI.fb[row]=[1,R0.calc!=null?'잘 계산해서 적었어요.':'잘 읽고 적었어요.'];save();render();const p=$('#lbFoot [data-act="next"]:not(:disabled)');if(p&&isDone(r.step))p.focus({preventScroll:true});return}
 const t=tryKey(row+':t',txt);
 if(t===-1){UI.fb[row]=[0,'숫자가 그대로예요. 다시 봐요.'];render();return}
 let m;
 if(decN(txt)>R0.rd)m=R0.rd===0?'소수 첫째 자리에서 반올림해 일의 자리까지 써요.':'소수 둘째 자리에서 반올림해 소수 첫째 자리까지 써요.';
 else if(R0.raw!=null)m=+txt===Math.floor(R0.raw)?'반올림해요. 앞부분이 작은 눈금 몇 칸째에 있는지 봐요.':t>=2?'빨간 점선이 지나는 곳의 큰 눈금 숫자부터 다시 읽어요. 작은 눈금 한 칸은 1 mm예요.':'자동차 앞부분(빨간 점선)이 가리키는 눈금을 다시 읽어요.';
 else if(R0.sw)m=+txt===Math.floor(R().st.sw[R0.sw]/10)/10?'반올림해요. 소수 둘째 자리 숫자가 5 이상이면 올려요.':'초시계에 멈춘 숫자를 다시 봐요.';
 else m=t>=2?'이동 거리 ÷ 걸린 시간을 소수 둘째 자리까지 계산한 뒤 반올림해요.':'나눗셈을 다시 해 봐요. 이동 거리 ÷ 걸린 시간이에요.';
 UI.fb[row]=[0,m];save();render()}
