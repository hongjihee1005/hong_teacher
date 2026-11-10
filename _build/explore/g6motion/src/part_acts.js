/* 이 단계의 행동 단추 */
function actsOf(s){const r=R(),A=[],busy=!!UI.fx||!!UI.run,st=r.st||{};
 switch(s.id){
  case 'shot':seqActs(A,'ph',['p1','p2'],['첫 번째 사진 찍기','타이머로 5초 뒤 두 번째 사진 찍기'],busy);break;
  case 'park':seqActs(A,'pk',['k1v','k2v'],['공원의 처음 모습 보기','얼마 뒤 모습 보기'],busy);break;
  case 'read':seqActs(A,'zm',['zR','zB'],['빨간색 자동차 앞부분 확대하기','파란색 자동차 앞부분 확대하기'],busy);break;
  case 'calc1':seqActs(A,'c1',['qR','qB'],['빨간색 자동차 식 세우기','파란색 자동차 식 세우기'],busy);break;
  case 'calc2':seqActs(A,'c2',['qG','qY'],['초록색 자동차 식 세우기','노란색 자동차 식 세우기'],busy);break;
  case 'order':seqActs(A,'od',['ordr'],['구한 속력을 표에 모으기'],busy);break;
  case 'runG':case 'runY':{const k=s.id==='runG'?'G':'Y',rs=runState(k),run=!!(UI.run&&UI.run.k===k),stopped=run&&UI.run.stopAt!=null;
   if(rs.ok)break;
   const ph=run?2:rs.wound?1:0;
   A.push({id:'w'+k,label:'1/3 · 출발선에 놓고 태엽 감기',dis:!!UI.fx||run||ph!==0,pressed:ph>0,hide:ph!==0});
   A.push({id:'go'+k,label:'2/3 · ‘출발!’ 초시계 시작',dis:!!UI.fx||ph!==1,pressed:ph>1,hide:ph!==1});
   A.push({id:'st'+k,label:'3/3 · 결승선! 초시계 멈춤',dis:ph!==2||stopped,pressed:stopped,hide:ph!==2,stop:1});break}
  case 'more':A.push({id:'m4',label:'교통수단 표 보기',dis:busy});break}
 return A}
/* 차례대로 하는 행동: 지금 할 것 하나만 큰 단추로(한 일은 단추 위 차례 줄에 표시) */
function seqActs(A,key,ids,L0,busy){const c=R().st[key]||0,n=ids.length;
 L0.forEach((t,i)=>A.push({id:ids[i],label:(i+1)+'/'+n+' · '+t,dis:busy||i!==c,pressed:i<c,hide:i!==Math.min(c,n-1)}))}
