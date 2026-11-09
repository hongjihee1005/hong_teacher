// 결론 빈칸 답 낱말이 실험 이름·제목·단계 이름·행동 단추 글에 들어가지 않는지 점검(build.py가 부름)
const fs=require('fs'),path=require('path');const S=path.join(__dirname,'src');
const c={};new Function('c','const R=()=>({st:{}});'+fs.readFileSync(path.join(S,'data.js'),'utf8')+';c.EXPS=EXPS;c.stepDef=stepDef;c.OPS=OPS;c.PARTS=PARTS;')(c);
const body=fs.readFileSync(path.join(S,'app_body.js'),'utf8');
const labels=[...body.matchAll(/label:'([^']+)'/g)].map(m=>m[1]).concat([...body.matchAll(/\[\['([a-z0-9]+)','([^']+)'\]/g)].map(m=>m[2]))
 .concat([...body.matchAll(/\['[a-z0-9]+','[^']+'(?:,'[^']+')*\]/g)].map(m=>m[0])).concat(c.OPS.map(o=>o[1])).concat(c.PARTS.map(p=>p[1]));
const out=[];
for(const k in c.EXPS){const E=c.EXPS[k];
 const names=[E.name,E.title,E.sub].concat(E.steps.map(id=>{const s=c.stepDef(E,id);return [s.n,s.n0||'',s.k==='concl'||s.k==='sheet'?'':s.t,s.act||'',(s.labels||[]).join(' ')].join(' ')})).concat(labels);
 E.ans.forEach(a=>{const w=a.replace(/(이|가|을|를|어요|아요|에요|요)$/,'');if(w.length<2)return;names.forEach(n=>{if(n.indexOf(w)>=0)out.push(k+': "'+a+'" in "'+n+'"')})})}
if(out.length){console.log(out.join('\n'));process.exit(1)}
console.log('namecheck ok');
