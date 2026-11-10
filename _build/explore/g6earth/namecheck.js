// 결론 빈칸 답 낱말이 결론 전에 보이는 글(실험 이름·제목·탐구 문제·'이렇게 해요'·'이것을 살펴봐요'·단계 이름·행동 단추·고르기 글·
// '왜 그렇게 할까요?'·'조심해요'·기록 줄 이름)에 들어가지 않는지 점검(build.py가 부름).
// 예상 고르기 보기와 기록 칸의 보기는 학생이 고르는 칸이라 빼고, 방위 안내(동쪽·서쪽을 함께 말하는 글, 바라보고 서는 방향을 알려 주는 글)도 뺌.
// 한 글자 답('두')은 빈칸 뒤 낱말과 함께('두 무리'), '두 가지'도 찾음. 답 끝의 조사(와·과·을·를·고·며·요 …)는 떼고 찾음.
const fs=require('fs'),path=require('path');const S=path.join(__dirname,'src');
const c={};new Function('c','const R=()=>({st:{}});'+fs.readFileSync(path.join(S,'data.js'),'utf8')+';c.EXPS=EXPS;c.stepDef=stepDef;c.ROWS=ROWS;')(c);
const body=fs.readFileSync(path.join(S,'app_body.js'),'utf8');
const labels=[...body.matchAll(/label:'([^']+)'/g)].map(m=>m[1]).concat([...body.matchAll(/\[(?:'[^']*',?)+\]/g)].flatMap(m=>[...m[0].matchAll(/'([^']{4,})'/g)].map(x=>x[1])).filter(t=>/[가-힣]/.test(t)));
const flat=o=>typeof o==='string'?[o]:Array.isArray(o)?o.flatMap(flat):o&&typeof o==='object'?Object.values(o).flatMap(flat):[];
const neutral=t=>(/동쪽/.test(t)&&/서쪽/.test(t))||/바라[보볼봐]/.test(t);
const out=[];
for(const k in c.EXPS){const E=c.EXPS[k];
 const ci=E.steps.indexOf('concl');
 const texts=[E.name,E.title,E.sub,E.q,E.predT,E.predHint].concat(flat(E.how),flat(E.look),flat(E.tools),E.pred.map(p=>p.q),labels);
 E.steps.slice(0,ci).forEach(id=>{const s=c.stepDef(E,id);const {id:_i,k:_k,g:_g,dur:_d,spot:_s,rows:_r,...rest}=s;texts.push(...flat(rest))});
 E.rows.forEach(r=>texts.push(c.ROWS[r].n));
 E.ans.forEach((a,i)=>{const w=a.replace(/(이|가|을|를|와|과|고|며|어요|아요|에요|요)$/,'');let keys=[w];
  if(w.length<2){const m=E.frame.match(new RegExp('\\{'+i+'\\}\\s*([^ ,.]+)'));keys=(m?[w+' '+m[1]]:[]).concat([w+' 가지'])}
  else if(/와 /.test(w))keys=w.split(/와 /);
  keys.forEach(kw=>texts.forEach(t=>{if(t&&!neutral(t)&&t.indexOf(kw)>=0)out.push(k+': "'+kw+'" in "'+t+'"')}))})}
if(out.length){console.log([...new Set(out)].join('\n'));process.exit(1)}
console.log('namecheck ok');
