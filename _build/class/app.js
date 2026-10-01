'use strict';
/* ===== 기본 도구 ===== */
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pad=n=>String(n).padStart(2,'0');
const ymd=(d=new Date())=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
const DAYS=['일','월','화','수','목','금','토'];
const rnd=n=>Math.floor(Math.random()*n);
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=rnd(i+1);[a[i],a[j]]=[a[j],a[i]]}return a};
const lines=s=>String(s||'').split('\n').map(x=>x.trim()).filter(Boolean);
const toMin=t=>{const m=/(\d{1,2}):(\d{2})/.exec(t||'');return m?(+m[1])*60+(+m[2]):null};
const weekNo=()=>Math.floor((Date.now()-new Date(1970,0,5).getTime())/(7*864e5));

/* ===== 저장 (이 기기의 브라우저에만) ===== */
const KEY='hj-class-v1';
const DEF={
 title:'우리 반 교실', count:25, names:'', pin:'', mode:'auto', hidden:{},
 notice:'오늘도 즐겁게 공부해요! 😊\n아침 활동: 책 읽기 15분',
 todo:[{t:'알림장 쓰기',ok:false},{t:'우유 마시기',ok:false}],
 bell:'1교시 09:00-09:40\n2교시 09:50-10:30\n3교시 10:40-11:20\n4교시 11:30-12:10\n점심시간 12:10-13:00\n5교시 13:00-13:40\n6교시 13:50-14:30',
 tt:[['국어','수학','사회','체육','창체'],['수학','국어','과학','음악',''],['국어','도덕','수학','미술','미술'],['과학','국어','영어','수학','체육'],['수학','사회','국어','영어','']],
 prep:'체육: 운동화, 물병\n미술: 색연필, 풀, 가위\n음악: 리코더\n과학: 실험 관찰 책',
 meals:{}, mealCache:{}, cal:[], goals:{d:'',p:{}},
 hw:[], links:'', absent:{d:'',list:[]},
 done:{d:'',task:'',list:[]}, picked:[], score:{teams:['1모둠','2모둠','3모둠','4모둠','5모둠','6모둠'],pts:[0,0,0,0,0,0]},
 vote:{q:'오늘 체육 시간에 하고 싶은 놀이는?',opts:['피구','이어달리기','줄넘기'],cnt:[0,0,0],show:false},
 roulette:'떡볶이\n김밥\n라면\n짜장면\n피자\n치킨',
 curtain:'정답 1: 원의 중심\n정답 2: 반지름\n정답 3: 지름',
 dictation:'1. 우리 반 친구들은 사이좋게 지냅니다.\n2. 하늘이 맑고 파랗습니다.\n3. 도서관에서 책을 빌렸어요.',
 books:{}, bookGoal:300,
 roles:{list:'칠판 지우기\n우유·급식 도우미\n창문 열고 닫기\n전등 끄고 켜기\n화분 물 주기\n줄 반장\n학급 문고 정리\n신발장 정리\n분리수거\n우리 반 우체부(나눠 주기)\n학습지 걷기\n사물함 위 정리\nTV·컴퓨터 끄기 확인\n쓰레기통 비우기\n칠판 지우개 털기\n책상 줄 맞추기\n크롬북 충전 확인\n손 소독제 챙기기\n날짜·요일 바꾸기\n시간표 바꾸기\n알림장 쓰기 도우미\n체육 준비물 챙기기\n교실 문 닫기\n우산꽂이 정리\n오늘의 칭찬 기자',shift:0},
 rules:'친구의 말을 끝까지 들어요.\n고운 말을 써요.\n내 물건은 내가 정리해요.\n복도에서는 사뿐사뿐 걸어요.\n도움이 필요하면 손을 들고 말해요.',
 crules:'선생님이 말할 때는 화면을 내려요.\n수업과 관계없는 사이트는 열지 않아요.\n내 비밀번호는 나만 알아요.\n두 손으로 들고 다녀요.\n다 쓰면 충전함 제자리에 꽂아요.',
 thermo:{n:0,goal:30,reward:'우리 반 영화 보는 날 🎬'},
 seats:{rows:5,cols:6,order:[],view:'s'},
 clean:{areas:'교실 앞쪽 쓸기\n교실 뒤쪽 쓸기\n칠판·분필 받침\n복도\n창틀·사물함 위\n분리수거',shift:0},
 bdays:'', mood:{d:'',c:{}}, asks:[], praise:[],
 quiz:'한 시간은 몇 분일까요? | 60분\n1 L는 몇 mL일까요? | 1000 mL\n1 kg은 몇 g일까요? | 1000 g\n원의 지름은 반지름의 몇 배일까요? | 2배\n7 × 8은 얼마일까요? | 56',
 words:'무지개\n도서관\n운동장\n선생님\n지우개\n칠판\n급식\n연필\n친구\n교실',
 evac:'', evacImg:'',
 loc:{name:'부산 동구',lat:35.1295,lon:129.0454},
 neis:{key:'',office:'',school:'',schoolName:'',grade:'',cls:''}
};
let DB={};
try{DB=JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch(e){DB={}}
for(const k in DEF) if(DB[k]===undefined) DB[k]=JSON.parse(JSON.stringify(DEF[k]));
let saveT=0;
function save(){clearTimeout(saveT);saveT=setTimeout(()=>{try{localStorage.setItem(KEY,JSON.stringify(DB))}catch(e){toast('이 기기에 저장하지 못했어요')}},120)}
const N=()=>Math.max(1,Math.min(40,+DB.count||25));
const nameList=()=>lines(DB.names);
const label=n=>{const nm=String(DB.names||'').split('\n')[n-1];return nm&&nm.trim()?nm.trim():n+'번'};
const absentToday=()=>DB.absent.d===ymd()?DB.absent.list:[];
const present=()=>{const a=absentToday();return Array.from({length:N()},(_,i)=>i+1).filter(n=>!a.includes(n))};
const isT=()=>document.body.classList.contains('teacher');

/* ===== 알림 · 창 ===== */
function toast(m,ms=1800){const t=document.createElement('div');t.className='toast';t.textContent=m;document.body.appendChild(t);setTimeout(()=>t.remove(),ms)}
function modal(html,mount){const M=$('#modal'),B=$('#mbox');B.innerHTML=html;M.hidden=false;const close=()=>{M.hidden=true;B.innerHTML=''};
 M.onclick=e=>{if(e.target===M)close()};mount&&mount(B,close);const f=B.querySelector('input,textarea,select,button');f&&f.focus();return close}
function editText(title,val,cb,hint='',rows=8){
 modal(`<h3>${esc(title)}</h3>${hint?`<div class="note">${hint}</div>`:''}<textarea class="inp" rows="${rows}" id="et">${esc(val)}</textarea>
 <div class="row" style="justify-content:flex-end"><button class="btn" id="ec" type="button">취소</button><button class="btn pri" id="eo" type="button">저장</button></div>`,(B,close)=>{
  $('#ec',B).onclick=close;$('#eo',B).onclick=()=>{cb($('#et',B).value);save();close();refresh()}})}
function askText(title,cb,{type='text',hint='',val=''}={}){
 modal(`<h3>${esc(title)}</h3>${hint?`<div class="note">${hint}</div>`:''}<input class="inp" id="at" type="${type}" value="${esc(val)}" autocomplete="off">
 <div class="row" style="justify-content:flex-end"><button class="btn" id="ac" type="button">취소</button><button class="btn pri" id="ao" type="button">확인</button></div>`,(B,close)=>{
  const go=()=>{const v=$('#at',B).value;close();cb(v)};$('#ac',B).onclick=close;$('#ao',B).onclick=go;$('#at',B).onkeydown=e=>{if(e.key==='Enter')go()}})}
function confetti(n=70){const C=['#E07A6E','#E39A4E','#F4C84B','#4FA987','#5E95CB','#9A7BD0','#D97BA6'];
 for(let i=0;i<n;i++){const c=document.createElement('i');c.className='confetti';c.style.left=Math.random()*100+'vw';c.style.background=C[i%C.length];
  c.style.animationDuration=(1.8+Math.random()*1.8)+'s';c.style.animationDelay=Math.random()*.6+'s';document.body.appendChild(c);setTimeout(()=>c.remove(),4500)}}
let AC=null;
function beep(seq=[[880,.15],[0,.08],[880,.15],[0,.08],[1175,.35]],vol=.25){try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();let t=AC.currentTime;
 for(const [f,d] of seq){if(f){const o=AC.createOscillator(),g=AC.createGain();o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g).connect(AC.destination);o.start(t);o.stop(t+d)}t+=d}}catch(e){}}
function say(text,rate=.85){if(!('speechSynthesis' in window)){toast('이 기기는 읽어 주기를 지원하지 않아요');return}
 speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='ko-KR';u.rate=rate;const v=speechSynthesis.getVoices().find(v=>/ko/i.test(v.lang));if(v)u.voice=v;speechSynthesis.speak(u)}
function blackout(msg='선생님을 봐 주세요 👀'){const d=document.createElement('div');d.className='blk';d.innerHTML=`<div>${esc(msg)}</div><div style="font-size:1.1rem;opacity:.7">화면을 누르면 돌아가요</div>`;d.onclick=()=>d.remove();document.body.appendChild(d)}
function fsToggle(el=document.documentElement){try{if(document.fullscreenElement)document.exitFullscreen();else (el.requestFullscreen||el.webkitRequestFullscreen).call(el)}catch(e){toast('이 기기에서는 전체 화면을 쓸 수 없어요')}}

/* ===== 시간표 · 종 ===== */
function bells(){return lines(DB.bell).map(l=>{const m=/^(.*?)\s*(\d{1,2}:\d{2})\s*[-~]\s*(\d{1,2}:\d{2})/.exec(l);if(!m)return null;const p=/(\d+)\s*교시/.exec(m[1]);return {n:m[1].trim(),p:p?+p[1]:0,s:toMin(m[2]),e:toMin(m[3]),st:m[2],et:m[3]}}).filter(Boolean).sort((a,b)=>a.s-b.s)}
function subj(p,wd=new Date().getDay()){if(wd<1||wd>5)return '';return ((DB.tt[wd-1]||[])[p-1]||'').trim()}
function prepFor(s){if(!s)return '';const l=lines(DB.prep).find(x=>x.split(':')[0].trim()===s);return l?l.split(':').slice(1).join(':').trim():''}
function nowInfo(){const d=new Date(),wd=d.getDay(),m=d.getHours()*60+d.getMinutes(),B=bells();
 if(wd===0||wd===6)return {txt:'즐거운 주말이에요 🌈',p:0};
 for(let i=0;i<B.length;i++){const b=B[i];if(m>=b.s&&m<b.e){const s=b.p?subj(b.p):'';return {txt:b.p?`${b.p}교시${s?' · '+s:''} (${b.e-m}분 남음)`:`${b.n} (${b.e-m}분 남음)`,p:b.p,cur:b}}
  if(m<b.s){const nx=B.slice(i).find(x=>x.p);if(i===0)return {txt:'수업 전이에요 · 아침 활동',p:0,next:nx};const s=nx?subj(nx.p):'';return {txt:`쉬는 시간${nx?` · 다음 ${nx.p}교시${s?' '+s:''}`:''}`,p:0,next:nx}}}
 return {txt:'오늘 수업 끝! 안녕히 가세요 👋',p:0,after:true}}

/* ===== 날씨 · 미세먼지 (Open-Meteo, 인증키 없음) ===== */
const WX={};
function wxName(c){if(c===0)return ['☀️','맑음'];if(c<=2)return ['🌤️','구름 조금'];if(c===3)return ['☁️','흐림'];if(c===45||c===48)return ['🌫️','안개'];
 if(c>=51&&c<=57)return ['🌦️','이슬비'];if(c>=61&&c<=67)return ['🌧️','비'];if(c>=71&&c<=77)return ['❄️','눈'];if(c>=80&&c<=82)return ['🌦️','소나기'];if(c>=85&&c<=86)return ['🌨️','눈'];if(c>=95)return ['⛈️','뇌우'];return ['🌡️','']}
function pmLv(v,kind){if(v==null)return [0,'-'];const t=kind==='pm10'?[30,80,150]:[15,35,75];return v<=t[0]?[1,'좋음']:v<=t[1]?[2,'보통']:v<=t[2]?[3,'나쁨']:[4,'매우 나쁨']}
async function loadWx(force){if(!force&&WX.t&&Date.now()-WX.t<20*60e3)return WX;const {lat,lon}=DB.loc;
 try{const r=await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,precipitation&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Asia%2FSeoul&forecast_days=3`);
  const j=await r.json();WX.cur=j.current;WX.daily=j.daily;WX.err=''}catch(e){WX.err='날씨를 불러오지 못했어요'}
 try{const r=await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=pm10,pm2_5&timezone=Asia%2FSeoul`);
  const j=await r.json();WX.air=j.current;WX.aerr=''}catch(e){WX.aerr='미세먼지를 불러오지 못했어요'}
 WX.t=Date.now();paintWxChips();return WX}
function paintWxChips(){const a=$('#wxc'),b=$('#dustc');if(!a||!b)return;
 if(WX.cur){const [e,n]=wxName(WX.cur.weather_code);a.innerHTML=`${e} ${Math.round(WX.cur.temperature_2m)}° ${n}`+(rainy()?' · ☂️':'')}else a.textContent=WX.err?'🌤️ 날씨 ?':'🌤️ 날씨';
 if(WX.air){const [l,n]=worstPm();b.innerHTML=`😷 미세먼지 <span class="lv lv${l}">${n}</span>`}else b.textContent='😷 미세먼지'}
function rainy(){return WX.daily&&(WX.daily.precipitation_probability_max[0]>=50||(WX.cur&&WX.cur.weather_code>=51))}
function worstPm(){const a=pmLv(WX.air.pm10,'pm10'),b=pmLv(WX.air.pm2_5,'pm25');return a[0]>=b[0]?a:b}

/* ===== 나이스 교육정보 개방 포털 ===== */
async function neis(svc,params){const n=DB.neis;const q=new URLSearchParams(Object.assign({Type:'json',pIndex:1,pSize:100},n.key?{KEY:n.key}:{},params));
 const r=await fetch(`https://open.neis.go.kr/hub/${svc}?${q}`);const j=await r.json();if(j.RESULT)throw new Error(j.RESULT.MESSAGE||'자료 없음');
 const k=Object.keys(j)[0];return (j[k][1]&&j[k][1].row)||[]}
const neisReady=()=>DB.neis.office&&DB.neis.school;
const ALG=['','난류','우유','메밀','땅콩','대두','밀','고등어','게','새우','돼지고기','복숭아','토마토','아황산류','호두','닭고기','쇠고기','오징어','조개류','잣'];
function parseMeal(s){return String(s||'').split(/<br\s*\/?>|\n/).map(x=>x.trim()).filter(Boolean).map(x=>{const m=/^(.*?)\s*\(?([\d.]+)\.?\)?\s*$/.exec(x);
 if(m&&/\d/.test(m[2])&&/[가-힣a-zA-Z]/.test(m[1]))return {n:m[1].replace(/[*#]/g,'').trim(),a:m[2].split('.').filter(Boolean).map(Number)};return {n:x.replace(/[*#]/g,''),a:[]}})}
async function mealOf(d){if(DB.meals[d])return {list:parseMeal(DB.meals[d]),src:'직접 입력'};
 if(!neisReady())return null;if(DB.mealCache[d])return DB.mealCache[d];
 try{const rows=await neis('mealServiceDietInfo',{ATPT_OFCDC_SC_CODE:DB.neis.office,SD_SCHUL_CODE:DB.neis.school,MLSV_YMD:d.replace(/-/g,'')});
  const r=rows.find(x=>/중식/.test(x.MMEAL_SC_NM))||rows[0];const o={list:parseMeal(r.DDISH_NM),cal:r.CAL_INFO,src:'나이스'};DB.mealCache[d]=o;
  const ks=Object.keys(DB.mealCache).sort();while(ks.length>20)delete DB.mealCache[ks.shift()];save();return o}
 catch(e){return {err:/없/.test(e.message)?'급식 정보가 없는 날이에요':'나이스에서 불러오지 못했어요 ('+e.message+')'}}}
function mealHTML(o,full){if(!o)return `<div class="small">급식표가 아직 없어요.${isT()?' 선생님 설정에서 나이스를 연결하거나 직접 적어 주세요.':''}</div>`;
 if(o.err)return `<div class="small">${esc(o.err)}</div>`;
 return `<ul class="meal">${o.list.map(x=>`<li>${esc(x.n)}${x.a.length?`<sup>${x.a.join('.')}</sup>`:''}</li>`).join('')}</ul>${full&&o.cal?`<div class="small">열량 ${esc(o.cal)}</div>`:''}`}

/* ===== 메뉴 목록 ===== */
const G=[
 {id:'day',nm:'하루 시작',acc:'#E07A6E'},{id:'tool',nm:'수업 도구',acc:'#E39A4E'},{id:'learn',nm:'학습 연결',acc:'#5E95CB'},{id:'life',nm:'학급 생활',acc:'#4FA987'},
 {id:'heart',nm:'마음 · 소통',acc:'#D97BA6'},{id:'play',nm:'쉬는 시간 · 틈새 활동',acc:'#9A7BD0'},{id:'safe',nm:'안전',acc:'#D9A93A'},{id:'teach',nm:'선생님 전용',acc:'#8C7B6E',t:1}];
const A={};const ORDER=[];
function app(id,g,ico,nm,render,o={}){A[id]=Object.assign({id,g,ico,nm,render},o);ORDER.push(id)}

/* --- 하루 시작 --- */
app('notice','day','📢','오늘의 안내판',b=>{
 b.innerHTML=`<div class="center"><div class="big" style="white-space:pre-wrap">${esc(DB.notice)||'오늘의 안내가 아직 없어요'}</div>
 <button class="btn t-only" id="e" type="button">✏️ 안내 고치기</button></div>`;
 $('#e',b).onclick=()=>editText('오늘의 안내',DB.notice,v=>DB.notice=v)});
app('weather','day','🌤️','날씨 · 미세먼지',b=>{
 const draw=()=>{if(!WX.t){b.innerHTML='<div class="center"><div class="big">불러오는 중…</div></div>';return}
  let h='<div class="cols">';
  if(WX.cur){const [e,n]=wxName(WX.cur.weather_code);const D=WX.daily;
   h+=`<div class="card" style="text-align:center"><div class="huge">${e}</div><div class="big">${Math.round(WX.cur.temperature_2m)}° ${n}</div>
   <div class="mid">최저 ${Math.round(D.temperature_2m_min[0])}° · 최고 ${Math.round(D.temperature_2m_max[0])}°</div><div>비 올 확률 ${D.precipitation_probability_max[0]}%</div>
   <div class="mid" style="margin-top:.5rem">${rainy()?'☂️ 우산을 챙겨요!':'우산은 필요 없을 것 같아요'}</div></div>`}else h+=`<div class="card">${esc(WX.err)}</div>`;
  if(WX.air){const a=pmLv(WX.air.pm10,'pm10'),c=pmLv(WX.air.pm2_5,'pm25'),w=worstPm();
   h+=`<div class="card" style="text-align:center"><div class="huge">${['','😊','🙂','😷','🚫'][w[0]]}</div>
   <div class="big">미세먼지 <span class="lv lv${a[0]}" style="font-size:.6em">${a[1]}</span></div><div>미세먼지(PM10) ${Math.round(WX.air.pm10)}㎍/㎥ · 초미세먼지(PM2.5) <span class="lv lv${c[0]}">${c[1]}</span> ${Math.round(WX.air.pm2_5)}㎍/㎥</div>
   <div class="mid" style="margin-top:.5rem">${w[0]>=3?'😷 마스크를 쓰고, 바깥 활동은 줄여요':'바깥 놀이를 해도 좋아요'}</div></div>`}else h+=`<div class="card">${esc(WX.aerr)}</div>`;
  if(WX.daily){const D=WX.daily;h+=`<div class="card"><div class="mid">앞으로 3일</div>${D.time.map((t,i)=>{const [e,n]=wxName(D.weather_code[i]);const d=new Date(t+'T00:00');
   return `<div class="row" style="justify-content:space-between;margin:.3rem 0"><span>${i?`${d.getMonth()+1}/${d.getDate()} (${DAYS[d.getDay()]})`:'오늘'}</span><span>${e} ${n}</span><span>${Math.round(D.temperature_2m_min[i])}°/${Math.round(D.temperature_2m_max[i])}° · ☂️${D.precipitation_probability_max[i]}%</span></div>`}).join('')}</div>`}
  h+='</div>';
  h+=`<div class="note">📍 ${esc(DB.loc.name)} 기준.${isT()?' (선생님 설정 → 📍 날씨 위치에서 학교를 찾아 바꿀 수 있어요)':''} 날씨·미세먼지는 Open-Meteo 예보 모델 값이라 에어코리아 측정값과 다를 수 있어요. 등급: 미세먼지 좋음 0~30·보통 31~80·나쁨 81~150·매우 나쁨 151 이상, 초미세먼지 좋음 0~15·보통 16~35·나쁨 36~75·매우 나쁨 76 이상(㎍/㎥).</div>
  <div class="row"><button class="btn" id="r" type="button">🔄 새로 불러오기</button></div>`;
  b.innerHTML=h;$('#r',b).onclick=()=>{WX.t=0;draw();loadWx(true).then(draw)}};
 draw();loadWx().then(draw)});
app('timetable','day','🗓️','시간표',b=>{
 const draw=()=>{const B=bells(),wd=new Date().getDay(),ni=nowInfo(),maxP=Math.max(...B.map(x=>x.p),5);
  let h=`<div class="mid" style="text-align:center">${esc(ni.txt)}</div><div style="overflow-x:auto"><table class="t"><tr><th></th>${['월','화','수','목','금'].map((d,i)=>`<th style="${wd===i+1?'background:color-mix(in srgb,#E39A4E 30%,var(--paper))':''}">${d}</th>`).join('')}</tr>`;
  for(let p=1;p<=maxP;p++){const bb=B.find(x=>x.p===p);h+=`<tr><th>${p}교시<div class="small">${bb?bb.st+'~'+bb.et:''}</div></th>${[0,1,2,3,4].map(i=>`<td style="font-family:var(--display);font-size:1.15rem;${wd===i+1&&ni.p===p?'background:color-mix(in srgb,#E39A4E 30%,var(--paper))':''}">${esc((DB.tt[i]||[])[p-1]||'')}</td>`).join('')}</tr>`}
  h+='</table></div>';
  const nx=ni.p?{p:ni.p+1}:ni.next;if(nx){const s=subj(nx.p);if(s)h+=`<div class="card"><b class="mid">다음 시간: ${esc(s)}</b> ${prepFor(s)?'· 준비물: '+esc(prepFor(s)):''}</div>`}
  h+=`<div class="row t-only"><button class="btn" id="et" type="button">✏️ 시간표 고치기</button><button class="btn" id="eb" type="button">🔔 종 시간</button><button class="btn" id="ep" type="button">🎒 과목별 준비물</button><button class="btn" id="nt" type="button">나이스에서 이번 주 불러오기</button></div>`;
  b.innerHTML=h;
  const e=(id,f)=>{const x=$(id,b);if(x)x.onclick=f};
  e('#et',()=>editText('시간표 (요일마다 한 줄, 쉼표로 나누기)',['월','화','수','목','금'].map((d,i)=>d+': '+(DB.tt[i]||[]).join(', ')).join('\n'),v=>{
   lines(v).forEach((l,i)=>{const m=/^\s*([월화수목금])\s*:?(.*)$/.exec(l);const di=m?'월화수목금'.indexOf(m[1]):i;if(di>=0&&di<5)DB.tt[di]=(m?m[2]:l).split(',').map(x=>x.trim())})},'예) 월: 국어, 수학, 사회, 체육, 창체',6));
  e('#eb',()=>editText('종 시간',DB.bell,v=>DB.bell=v,'한 줄에 하나씩: <b>1교시 09:00-09:40</b>, <b>점심시간 12:10-13:00</b>'));
  e('#ep',()=>editText('과목별 준비물',DB.prep,v=>DB.prep=v,'한 줄에 하나씩: <b>과목: 준비물</b>'));
  e('#nt',async()=>{if(!neisReady()||!DB.neis.grade||!DB.neis.cls){toast('선생님 설정에서 학교·학년·반을 먼저 정해 주세요');return}
   const d=new Date();const mon=new Date(d);mon.setDate(d.getDate()-((d.getDay()+6)%7));const fri=new Date(mon);fri.setDate(mon.getDate()+4);
   try{const rows=await neis('elsTimetable',{ATPT_OFCDC_SC_CODE:DB.neis.office,SD_SCHUL_CODE:DB.neis.school,GRADE:DB.neis.grade,CLASS_NM:DB.neis.cls,TI_FROM_YMD:ymd(mon).replace(/-/g,''),TI_TO_YMD:ymd(fri).replace(/-/g,'')});
    const t=[[],[],[],[],[]];rows.forEach(r=>{const dd=new Date(r.ALL_TI_YMD.replace(/(\d{4})(\d\d)(\d\d)/,'$1-$2-$3T00:00'));const i=dd.getDay()-1;if(i>=0&&i<5)t[i][+r.PERIO-1]=r.ITRT_CNTNT});
    t.forEach((x,i)=>{if(x.length)DB.tt[i]=Array.from(x,v=>v||'')});save();draw();refresh();toast('이번 주 시간표를 불러왔어요')}catch(err){toast('불러오지 못했어요: '+err.message,3500)}})};
 draw();const iv=setInterval(draw,30000);return ()=>clearInterval(iv)});
app('meal','day','🍚','급식',b=>{
 let d=new Date();
 const draw=async()=>{const k=ymd(d);b.innerHTML=`<div class="row c"><button class="btn" id="p" type="button">◀</button><span class="mid">${d.getMonth()+1}월 ${d.getDate()}일 (${DAYS[d.getDay()]})</span><button class="btn" id="n" type="button">▶</button></div><div class="card" id="m" style="font-size:1.4rem;font-family:var(--display)">불러오는 중…</div>
 <div class="note"><b>알레르기 번호</b> ${ALG.slice(1).map((x,i)=>`${i+1}.${x}`).join(' · ')}</div>
 <div class="row t-only"><button class="btn" id="e" type="button">✏️ 이날 급식 직접 적기</button></div>`;
  $('#p',b).onclick=()=>{d.setDate(d.getDate()-1);draw()};$('#n',b).onclick=()=>{d.setDate(d.getDate()+1);draw()};
  $('#e',b).onclick=()=>editText(`${k} 급식`,DB.meals[k]||'',v=>{if(v.trim())DB.meals[k]=v;else delete DB.meals[k]},'한 줄에 음식 하나. 알레르기 번호는 괄호로: <b>닭볶음탕 (5.6.13.15)</b>');
  const o=await mealOf(k);const m=$('#m',b);if(m)m.innerHTML=mealHTML(o,true)+(o&&o.src?`<div class="small">출처: ${esc(o.src)}</div>`:'')};
 draw()});
app('todo','day','✅','할 일 · 준비물',b=>{
 const draw=()=>{b.innerHTML=`<ul class="chk" style="font-size:1.5rem;font-family:var(--display)">${DB.todo.map((x,i)=>`<li><label><input type="checkbox" data-i="${i}" ${x.ok?'checked':''}><span class="${x.ok?'ok':''}">${esc(x.t)}</span></label></li>`).join('')||'<li class="small">할 일이 없어요</li>'}</ul>
 <div class="row t-only"><button class="btn" id="e" type="button">✏️ 고치기</button><button class="btn" id="c" type="button">체크 모두 풀기</button></div>`;
  $$('input',b).forEach(x=>x.onchange=()=>{DB.todo[x.dataset.i].ok=x.checked;save();draw();renderHome()});
  $('#e',b).onclick=()=>editTodo();$('#c',b).onclick=()=>{DB.todo.forEach(x=>x.ok=false);save();draw();renderHome()}};draw();return draw});
function editTodo(){editText('할 일 · 준비물 (한 줄에 하나)',DB.todo.map(x=>x.t).join('\n'),v=>{const old=DB.todo;DB.todo=lines(v).map(t=>({t,ok:!!(old.find(o=>o.t===t)||{}).ok}))})}
app('calendar','day','📅','학급 달력',b=>{
 let cur=new Date();cur.setDate(1);
 const draw=()=>{const y=cur.getFullYear(),m=cur.getMonth(),first=new Date(y,m,1).getDay(),days=new Date(y,m+1,0).getDate(),t=ymd();
  let h=`<div class="row c"><button class="btn" id="p" type="button">◀</button><span class="big" style="font-size:2rem">${y}년 ${m+1}월</span><button class="btn" id="n" type="button">▶</button></div>
  <div style="display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:4px">${DAYS.map((d,i)=>`<div class="disp" style="text-align:center;color:${i===0?'#D2574B':i===6?'#3D86D6':'var(--soft)'}">${d}</div>`).join('')}`;
  for(let i=0;i<first;i++)h+='<div></div>';
  for(let d=1;d<=days;d++){const k=`${y}-${pad(m+1)}-${pad(d)}`,ev=DB.cal.filter(e=>e.d===k);
   h+=`<div class="card" style="padding:.3rem .4rem;min-height:4.2rem;border-radius:12px;${k===t?'border-color:#E39A4E;border-width:3px':''}"><div class="disp">${d}</div>${ev.map(e=>`<div style="font-size:.78rem;line-height:1.25;background:var(--soft-acc);border-radius:6px;padding:0 .25rem;margin-top:2px">${esc(e.t)}</div>`).join('')}</div>`}
  h+='</div>';
  const up=DB.cal.filter(e=>e.d>=t).sort((a,b)=>a.d<b.d?-1:1).slice(0,5);
  if(up.length)h+=`<div class="card"><div class="mid">다가오는 일</div>${up.map(e=>{const dd=Math.round((new Date(e.d+'T00:00')-new Date(t+'T00:00'))/864e5);return `<div>${e.d.slice(5).replace('-','/')} ${esc(e.t)} <b>${dd?'D-'+dd:'오늘!'}</b></div>`}).join('')}</div>`;
  h+=`<div class="row t-only"><button class="btn" id="e" type="button">✏️ 일정 고치기</button><button class="btn" id="ni" type="button">나이스 학사 일정 불러오기(이번 달)</button></div>`;
  b.innerHTML=h;$('#p',b).onclick=()=>{cur.setMonth(m-1);draw()};$('#n',b).onclick=()=>{cur.setMonth(m+1);draw()};
  $('#e',b).onclick=()=>editText('학급 일정',DB.cal.slice().sort((a,b)=>a.d<b.d?-1:1).map(e=>e.d+' '+e.t).join('\n'),v=>{DB.cal=lines(v).map(l=>{const m2=/^(\d{4}-\d{2}-\d{2})\s+(.+)$/.exec(l);return m2?{d:m2[1],t:m2[2]}:null}).filter(Boolean)},'한 줄에 하나: <b>2026-10-09 한글날</b>');
  $('#ni',b).onclick=async()=>{if(!neisReady()){toast('선생님 설정에서 학교를 먼저 정해 주세요');return}
   try{const rows=await neis('SchoolSchedule',{ATPT_OFCDC_SC_CODE:DB.neis.office,SD_SCHUL_CODE:DB.neis.school,AA_FROM_YMD:`${y}${pad(m+1)}01`,AA_TO_YMD:`${y}${pad(m+1)}${days}`});
    let n=0;rows.forEach(r=>{const d=r.AA_YMD.replace(/(\d{4})(\d\d)(\d\d)/,'$1-$2-$3');if(r.EVENT_NM&&r.EVENT_NM!=='토요휴업일'&&!DB.cal.some(e=>e.d===d&&e.t===r.EVENT_NM)){DB.cal.push({d,t:r.EVENT_NM});n++}});save();draw();toast(n+'개 일정을 더했어요')}catch(err){toast('불러오지 못했어요: '+err.message,3500)}}};
 draw()});

/* --- 수업 도구 --- */
app('board','tool','✍️','판서',b=>{
 b.classList.add('fill');b.innerHTML=`<div class="row" style="padding:.5rem .8rem;border-bottom:1.5px solid var(--line)" id="tl"></div><div style="flex:1;position:relative;min-height:0" id="cw"><canvas id="cv"></canvas></div>`;
 b.style.display='flex';b.style.flexDirection='column';
 const cv=$('#cv',b),cw=$('#cw',b),ctx=cv.getContext('2d');let strokes=[],cur=null,col='#222222',w=5,er=false,bg='white';
 const COLS=['#222222','#D2574B','#2F6FD0','#2E8B57','#E08A1E','#FFFFFF'];
 const tl=$('#tl',b);tl.innerHTML=COLS.map(c=>`<button class="btn sm" data-c="${c}" type="button" aria-label="색" style="width:2.4rem;background:${c};border-color:${c==='#FFFFFF'?'#bbb':c}"></button>`).join('')+
  `<button class="btn sm" data-w="3" type="button">가늘게</button><button class="btn sm on" data-w="6" type="button">보통</button><button class="btn sm" data-w="14" type="button">굵게</button>
  <button class="btn sm" id="er" type="button">🧽 지우개</button><button class="btn sm" id="un" type="button">↶ 되돌리기</button><button class="btn sm" id="cl" type="button">🗑️ 모두 지우기</button>
  <select class="inp" id="bg" style="min-height:2.1rem"><option value="white">흰 칠판</option><option value="black">초록 칠판</option><option value="grid">모눈</option><option value="line">줄 공책</option></select>
  <button class="btn sm" id="sv" type="button">💾 그림 저장</button>`;
 w=6;
 const fit=()=>{const r=cw.getBoundingClientRect(),dp=window.devicePixelRatio||1;cv.width=r.width*dp;cv.height=r.height*dp;cv.style.width=r.width+'px';cv.style.height=r.height+'px';ctx.setTransform(dp,0,0,dp,0,0);redraw()};
 const line=s=>{ctx.globalCompositeOperation=s.er?'destination-out':'source-over';ctx.strokeStyle=s.c;ctx.lineWidth=s.er?s.w*4:s.w;ctx.lineCap='round';ctx.lineJoin='round';
  const W=cv.clientWidth,H=cv.clientHeight;ctx.beginPath();s.p.forEach(([x,y],i)=>i?ctx.lineTo(x*W,y*H):ctx.moveTo(x*W,y*H));if(s.p.length===1)ctx.lineTo(s.p[0][0]*W+.1,s.p[0][1]*H);ctx.stroke()};
 const redraw=()=>{ctx.clearRect(0,0,cv.width,cv.height);strokes.forEach(line)};
 const pt=e=>{const r=cv.getBoundingClientRect();return [(e.clientX-r.left)/r.width,(e.clientY-r.top)/r.height]};
 cv.onpointerdown=e=>{cv.setPointerCapture(e.pointerId);cur={c:col,w,er,p:[pt(e)]};strokes.push(cur);line(cur)};
 cv.onpointermove=e=>{if(!cur)return;cur.p.push(pt(e));const s={...cur,p:cur.p.slice(-2)};line(s)};
 cv.onpointerup=cv.onpointercancel=()=>{cur=null};
 const setBg=v=>{bg=v;cw.className='bd-'+v;if(v==='black'&&col==='#222222')col='#FFFFFF';if(v!=='black'&&col==='#FFFFFF')col='#222222'};
 tl.onclick=e=>{const t=e.target.closest('button');if(!t)return;if(t.dataset.c){col=t.dataset.c;er=false;$('#er',b).classList.remove('on')}
  if(t.dataset.w){w=+t.dataset.w;$$('[data-w]',tl).forEach(x=>x.classList.toggle('on',x===t))}
  if(t.id==='er'){er=!er;t.classList.toggle('on',er)}if(t.id==='un'){strokes.pop();redraw()}if(t.id==='cl'&&strokes.length&&confirm('판서를 모두 지울까요?')){strokes=[];redraw()}
  if(t.id==='sv'){const c2=document.createElement('canvas');c2.width=cv.width;c2.height=cv.height;const x=c2.getContext('2d');x.fillStyle=bg==='black'?'#24302A':'#fff';x.fillRect(0,0,c2.width,c2.height);x.drawImage(cv,0,0);
   const a=document.createElement('a');a.download='판서-'+ymd()+'.png';a.href=c2.toDataURL('image/png');a.click()}};
 $('#bg',b).onchange=e=>setBg(e.target.value);setBg('white');
 const ro=new ResizeObserver(fit);ro.observe(cw);return ()=>ro.disconnect()},{wide:1});
app('pick','tool','🎯','뽑기',b=>{
 const draw=()=>{const left=present().filter(n=>!DB.picked.includes(n));
  b.innerHTML=`<div class="center"><div class="huge" id="r">❓</div><div class="mid" id="rn"></div>
  <div class="row c"><button class="btn big pri" id="go" type="button">🎯 뽑기</button><label class="row"><input type="checkbox" id="ex" ${DB.pickEx!==false?'checked':''}> 뽑힌 친구 빼기</label></div>
  <div class="small">남은 친구 ${left.length}명 · 오늘 결석 ${absentToday().length?absentToday().join(', ')+'번':'없음'}</div>
  <div class="row c" id="hist">${DB.picked.map(n=>`<span class="chip">${esc(label(n))}</span>`).join('')}</div>
  <div class="row c"><button class="btn" id="rs" type="button">처음부터 다시</button><button class="btn" id="ab" type="button">😷 오늘 결석 정하기</button></div></div>`;
  $('#ex',b).onchange=e=>{DB.pickEx=e.target.checked;save()};
  $('#rs',b).onclick=()=>{DB.picked=[];save();draw()};$('#ab',b).onclick=()=>setAbsent(draw);
  $('#go',b).onclick=()=>{const ex=DB.pickEx!==false;let pool=ex?present().filter(n=>!DB.picked.includes(n)):present();if(!pool.length){toast('모두 뽑았어요! 처음부터 다시 해요');return}
   const r=$('#r',b);let k=0;const iv=setInterval(()=>{r.textContent=label(pool[rnd(pool.length)]);beep([[400+rnd(400),.04]],.08);if(++k>18){clearInterval(iv);const n=pool[rnd(pool.length)];r.textContent=label(n);r.classList.add('pulse');beep();
    if(ex)DB.picked.push(n);save();setTimeout(()=>{r.classList.remove('pulse');const t=r.textContent;draw();$('#r',b).textContent=t},1400)}},70)}};draw()});
function setAbsent(cb){askText('오늘 결석한 번호 (쉼표로)',v=>{DB.absent={d:ymd(),list:(v.match(/\d+/g)||[]).map(Number).filter(n=>n>=1&&n<=N())};save();cb&&cb()},{val:absentToday().join(', '),hint:'뽑기·모둠 짜기·다했어요에서 빠져요. 오늘만 적용돼요.'})}
app('done','tool','🙋','다했어요',b=>{
 if(DB.done.d!==ymd())DB.done={d:ymd(),task:DB.done.task||'',list:[]};
 const draw=()=>{const P=present();
  b.innerHTML=`<div class="row" style="justify-content:space-between"><div class="mid">📝 ${esc(DB.done.task)||'과제를 다 하면 내 번호를 눌러요'}</div><div class="big" style="font-size:2rem">${DB.done.list.length} / ${P.length}</div></div>
  <div class="numgrid">${Array.from({length:N()},(_,i)=>i+1).map(n=>`<button class="num ${DB.done.list.includes(n)?'on':''} ${P.includes(n)?'':'off'}" data-n="${n}" type="button">${n}${nameList().length?`<small>${esc(label(n))}</small>`:''}${DB.done.list.includes(n)?' ✔':''}</button>`).join('')}</div>
  <div class="row"><button class="btn t-only" id="tk" type="button">✏️ 과제 적기</button><button class="btn t-only" id="rs" type="button">🔄 모두 지우기</button><button class="btn" id="nd" type="button">👀 아직 안 한 친구</button></div>`;
  $$('.num',b).forEach(x=>x.onclick=()=>{const n=+x.dataset.n;const i=DB.done.list.indexOf(n);if(i<0){DB.done.list.push(n);beep([[1046,.12]],.15)}else DB.done.list.splice(i,1);save();draw();
   if(DB.done.list.length===P.length&&P.length){confetti();beep()}});
  $('#tk',b).onclick=()=>askText('과제',v=>{DB.done.task=v;save();draw()},{val:DB.done.task});
  $('#rs',b).onclick=()=>{DB.done.list=[];save();draw()};
  $('#nd',b).onclick=()=>{const r=P.filter(n=>!DB.done.list.includes(n));modal(`<h3>아직 하는 중인 친구 (${r.length}명)</h3><div class="mid">${r.map(label).join(', ')||'모두 끝났어요! 🎉'}</div><button class="btn pri" type="button" id="x">닫기</button>`,(B,c)=>$('#x',B).onclick=c)}};draw()});

const T={dur:300,end:0,left:300,run:false,beeped:false};
function tLeft(){return T.run?Math.max(0,(T.end-Date.now())/1000):T.left}
const fmt=s=>{s=Math.ceil(s);return pad(Math.floor(s/60))+':'+pad(s%60)};
app('timer','tool','⏱️','타이머',b=>{
 let sw={run:false,base:0,start:0},mode='t',raf=0;
 const draw=()=>{b.innerHTML=`<div class="tabs"><button class="btn ${mode==='t'?'on':''}" data-m="t" type="button">⏳ 타이머</button><button class="btn ${mode==='s'?'on':''}" data-m="s" type="button">⏱️ 스톱워치</button></div>
  <div class="center">${mode==='t'?`<div class="huge" id="d" style="font-size:clamp(4rem,22vmin,14rem)">${fmt(tLeft())}</div>
  <div style="width:min(900px,90%);height:2rem;background:var(--bg2);border-radius:999px;overflow:hidden"><div id="bar" style="height:100%;width:100%;background:#4FA987;border-radius:999px"></div></div>
  <div class="row c">${[1,2,3,5,10,15].map(m=>`<button class="btn" data-s="${m*60}" type="button">${m}분</button>`).join('')}<button class="btn" id="cu" type="button">직접</button></div>
  <div class="row c"><button class="btn big pri" id="go" type="button">${T.run?'⏸ 멈춤':'▶ 시작'}</button><button class="btn big" id="rs" type="button">↺ 다시</button></div>
  <div class="small">창을 닫아도 타이머는 위쪽에서 계속 돌아가요.</div>`
  :`<div class="huge" id="d" style="font-size:clamp(4rem,20vmin,13rem)">00:00.0</div><div class="row c"><button class="btn big pri" id="sg" type="button">▶ 시작</button><button class="btn big" id="sr" type="button">↺ 다시</button></div>`}</div>`;
  $$('[data-m]',b).forEach(x=>x.onclick=()=>{mode=x.dataset.m;draw()});
  if(mode==='t'){$$('[data-s]',b).forEach(x=>x.onclick=()=>{T.dur=T.left=+x.dataset.s;T.run=false;T.beeped=false;draw()});
   $('#cu',b).onclick=()=>askText('몇 분? (예: 7 또는 2:30)',v=>{const m=/(\d+)(?::(\d+))?/.exec(v);if(m){T.dur=T.left=(+m[1])*60+(+(m[2]||0));T.run=false;T.beeped=false;draw()}});
   $('#go',b).onclick=()=>{if(T.run){T.left=tLeft();T.run=false}else{if(T.left<=0)T.left=T.dur;T.end=Date.now()+T.left*1000;T.run=true;T.beeped=false}draw()};
   $('#rs',b).onclick=()=>{T.run=false;T.left=T.dur;T.beeped=false;draw()}}
  else{$('#sg',b).onclick=e=>{if(sw.run){sw.base+=Date.now()-sw.start;sw.run=false;e.target.textContent='▶ 시작'}else{sw.start=Date.now();sw.run=true;e.target.textContent='⏸ 멈춤'}};
   $('#sr',b).onclick=()=>{sw={run:false,base:0,start:0};draw()}}};
 const loop=()=>{const d=$('#d',b);if(d){if(mode==='t'){const l=tLeft();d.textContent=fmt(l);const br=$('#bar',b);if(br){br.style.width=(T.dur?l/T.dur*100:0)+'%';br.style.background=l/T.dur<.2?'#D2574B':l/T.dur<.5?'#E39A4E':'#4FA987'}
   if(T.run&&l<=0){T.run=false;T.left=0;draw()}}else{const ms=sw.base+(sw.run?Date.now()-sw.start:0);d.textContent=pad(Math.floor(ms/60000))+':'+pad(Math.floor(ms/1000)%60)+'.'+Math.floor(ms/100)%10}}raf=requestAnimationFrame(loop)};
 draw();loop();return ()=>cancelAnimationFrame(raf)});
app('signal','tool','🚦','활동 신호등',b=>{
 const L=[['🤫','조용히','혼자 생각하고 써요','#5E95CB'],['🗣️','소곤소곤','짝과 작게 이야기해요','#4FA987'],['👥','모둠 대화','모둠 친구들과 이야기해요','#E39A4E'],['🙌','발표해요','한 명씩 손 들고 크게 말해요','#D97BA6']];
 const draw=()=>{const i=DB.signal||0,l=L[i];b.innerHTML=`<div class="signal" style="background:color-mix(in srgb,${l[3]} 22%,var(--paper))"><div class="huge">${l[0]}</div><div class="big" style="font-size:clamp(2.4rem,10vmin,6rem)">${l[1]}</div><div class="mid">${l[2]}</div><div class="mid" style="color:var(--soft)">목소리 크기 ${i}단계</div></div>
  <div class="row c">${L.map((x,j)=>`<button class="btn big ${i===j?'on':''}" data-i="${j}" type="button" style="${i===j?`background:${x[3]};color:#fff;border-color:${x[3]}`:''}">${x[0]} ${j} ${x[1]}</button>`).join('')}</div>`;
  $$('[data-i]',b).forEach(x=>x.onclick=()=>{DB.signal=+x.dataset.i;save();draw()})};draw()});
app('noise','tool','🔊','소음 측정기',b=>{
 let stream=null,raf=0,ctx=null,loud=0,cnt=0;
 b.innerHTML=`<div class="center"><div class="huge" id="f">🎤</div><div style="width:min(900px,92%);height:3rem;background:var(--bg2);border-radius:999px;overflow:hidden;position:relative">
  <div id="lv" style="height:100%;width:0;background:#4FA987;transition:width .1s"></div><div id="th" style="position:absolute;top:0;bottom:0;width:4px;background:#D2574B"></div></div>
  <div class="mid" id="msg">'시작'을 누르면 마이크로 교실 소리 크기를 봐요</div>
  <label class="row">기준 크기 <input type="range" id="rg" min="10" max="95" value="${DB.noiseTh||60}" style="width:14rem"></label>
  <div class="row c"><button class="btn big pri" id="go" type="button">🎤 시작</button></div><div class="small" id="ct"></div>
  <div class="note">소리는 녹음하거나 저장하지 않아요. 크기만 잽니다. 처음 한 번 마이크 사용을 허락해야 해요.</div></div>`;
 const th=$('#th',b),rg=$('#rg',b);const setTh=()=>{th.style.left=rg.value+'%';DB.noiseTh=+rg.value;save()};rg.oninput=setTh;setTh();
 $('#go',b).onclick=async()=>{if(stream)return;try{stream=await navigator.mediaDevices.getUserMedia({audio:true});ctx=new (window.AudioContext||window.webkitAudioContext)();const an=ctx.createAnalyser();an.fftSize=1024;ctx.createMediaStreamSource(stream).connect(an);
  const buf=new Uint8Array(an.fftSize);$('#go',b).disabled=true;let sm=0;
  const loop=()=>{an.getByteTimeDomainData(buf);let s=0;for(const v of buf){const x=(v-128)/128;s+=x*x}const lv=Math.min(100,Math.sqrt(s/buf.length)*400);sm=sm*.8+lv*.2;
   $('#lv',b).style.width=sm+'%';const over=sm>+rg.value;$('#lv',b).style.background=over?'#D2574B':sm>rg.value*.7?'#E39A4E':'#4FA987';
   if(over){loud++;if(loud===30){cnt++;$('#ct',b).textContent=`조금 시끄러웠던 때: ${cnt}번`}}else loud=0;
   $('#f',b).textContent=over?'🙉':sm>rg.value*.7?'🙂':'😊';$('#msg',b).textContent=over?'목소리를 조금 낮춰 볼까요?':'좋아요! 이 크기를 지켜요';raf=requestAnimationFrame(loop)};loop()}
  catch(e){$('#msg',b).textContent='마이크를 쓸 수 없어요. 마이크 허락을 확인해 주세요.'}};
 return ()=>{cancelAnimationFrame(raf);stream&&stream.getTracks().forEach(t=>t.stop());ctx&&ctx.close()}});
app('groups','tool','👨‍👩‍👧','모둠 짜기 · 발표 순서',b=>{
 let res=null,order=null,oi=0,mode='g';
 const draw=()=>{b.innerHTML=`<div class="tabs"><button class="btn ${mode==='g'?'on':''}" data-m="g" type="button">👨‍👩‍👧 모둠 짜기</button><button class="btn ${mode==='o'?'on':''}" data-m="o" type="button">🔢 발표 순서</button><button class="btn" id="ab" type="button">😷 오늘 결석</button></div>`+
  (mode==='g'?`<div class="row"><label class="row">모둠 수 <input class="inp" id="gn" type="number" min="2" max="12" value="${DB.gN||6}" style="width:5rem"></label><button class="btn pri big" id="go" type="button">🔀 섞어서 짜기</button></div>
   <div class="cols">${res?res.map((g,i)=>`<div class="card mix" style="--acc:${G[i%7].acc}"><div class="mid" style="color:var(--ink-acc)">${i+1}모둠</div><div class="disp" style="font-size:1.5rem">${g.map(label).join(' · ')}</div></div>`).join(''):'<div class="small">모둠 수를 정하고 섞어서 짜기를 눌러요. 결석한 친구는 빠져요.</div>'}</div>`
  :`<div class="center">${order?`<div class="huge">${esc(label(order[oi]))}</div><div class="mid">${oi+1}번째 / ${order.length}명</div><div class="row c"><button class="btn big" id="pv" type="button">◀ 앞</button><button class="btn big pri" id="nx" type="button">다음 ▶</button></div>
   <div class="row c">${order.map((n,i)=>`<span class="chip" style="${i===oi?'background:#FFE2B8':i<oi?'opacity:.45':''}">${i+1}. ${esc(label(n))}</span>`).join('')}</div>`:''}
   <button class="btn big ${order?'':'pri'}" id="mk" type="button">🔀 발표 순서 새로 정하기</button></div>`);
  $$('[data-m]',b).forEach(x=>x.onclick=()=>{mode=x.dataset.m;draw()});$('#ab',b).onclick=()=>setAbsent(draw);
  if(mode==='g')$('#go',b).onclick=()=>{const k=Math.max(2,Math.min(12,+$('#gn',b).value||6));DB.gN=k;save();const s=shuffle(present());res=Array.from({length:k},()=>[]);s.forEach((n,i)=>res[i%k].push(n));res.forEach(g=>g.sort((a,c)=>a-c));draw()};
  else{$('#mk',b).onclick=()=>{order=shuffle(present());oi=0;draw()};if(order){$('#nx',b).onclick=()=>{if(oi<order.length-1){oi++;draw()}};$('#pv',b).onclick=()=>{if(oi>0){oi--;draw()}}}}};draw()});
app('score','tool','🏆','모둠 점수판',b=>{
 const S=DB.score;const draw=()=>{const mx=Math.max(...S.pts);b.innerHTML=`<div class="cols" style="grid-template-columns:repeat(auto-fit,minmax(12rem,1fr))">${S.teams.map((t,i)=>`<div class="card mix" style="--acc:${G[i%7].acc};text-align:center;${S.pts[i]===mx&&mx>0?'border-color:#E3B23C;border-width:4px':''}">
  <div class="mid">${S.pts[i]===mx&&mx>0?'👑 ':''}${esc(t)}</div><div class="huge" style="font-size:clamp(3rem,10vmin,6rem)">${S.pts[i]}</div>
  <div class="row c"><button class="btn" data-i="${i}" data-v="-1" type="button">−1</button><button class="btn pri" data-i="${i}" data-v="1" type="button">+1</button><button class="btn" data-i="${i}" data-v="5" type="button">+5</button></div></div>`).join('')}</div>
  <div class="row"><label class="row">모둠 수 <input class="inp" id="n" type="number" min="2" max="10" value="${S.teams.length}" style="width:5rem"></label><button class="btn" id="nm" type="button">✏️ 모둠 이름</button><button class="btn" id="rs" type="button">🔄 점수 0으로</button></div>`;
  $$('[data-v]',b).forEach(x=>x.onclick=()=>{S.pts[x.dataset.i]=Math.max(0,S.pts[x.dataset.i]+(+x.dataset.v));if(+x.dataset.v>0)beep([[880+S.pts[x.dataset.i]*10,.12]],.12);save();draw()});
  $('#n',b).onchange=e=>{const k=Math.max(2,Math.min(10,+e.target.value));while(S.teams.length<k){S.teams.push((S.teams.length+1)+'모둠');S.pts.push(0)}S.teams.length=k;S.pts.length=k;save();draw()};
  $('#nm',b).onclick=()=>editText('모둠 이름 (한 줄에 하나)',S.teams.join('\n'),v=>{lines(v).slice(0,S.teams.length).forEach((x,i)=>S.teams[i]=x)});
  $('#rs',b).onclick=()=>{if(confirm('점수를 모두 0으로 할까요?')){S.pts=S.pts.map(()=>0);save();draw()}}};draw();return draw});
app('vote','tool','🗳️','투표 · 의견 모으기',b=>{
 const V=DB.vote;let lock=false;const draw=()=>{const tot=V.cnt.reduce((a,c)=>a+c,0),mx=Math.max(1,...V.cnt);
  b.innerHTML=`<div class="big">${esc(V.q)}</div><div class="cols">${V.opts.map((o,i)=>`<button class="btn big" data-i="${i}" type="button" style="min-height:5rem">${esc(o)}</button>`).join('')}</div>
  <div class="center" style="flex:0"><div class="mid" id="ok">한 사람씩 하나를 눌러요 · 지금까지 ${tot}명</div></div>
  ${V.show?`<div class="card bars">${V.opts.map((o,i)=>`<div class="b"><span class="disp">${esc(o)}</span><div class="track"><div class="fillb" style="width:${V.cnt[i]/mx*100}%"></div></div><b>${V.cnt[i]}</b></div>`).join('')}</div>`:''}
  <div class="row"><button class="btn" id="sh" type="button">${V.show?'🙈 결과 숨기기':'📊 결과 보기'}</button><button class="btn t-only" id="e" type="button">✏️ 질문 바꾸기</button><button class="btn t-only" id="rs" type="button">🔄 처음부터</button></div>`;
  $$('[data-i]',b).forEach(x=>x.onclick=()=>{if(lock)return;V.cnt[x.dataset.i]++;save();lock=true;beep([[988,.12]],.12);const ok=$('#ok',b);ok.textContent='✅ 투표했어요! 다음 친구 차례예요';ok.classList.add('pulse');setTimeout(()=>{lock=false;draw()},1200)});
  $('#sh',b).onclick=()=>{V.show=!V.show;save();draw()};
  $('#e',b).onclick=()=>editText('질문과 보기',V.q+'\n'+V.opts.join('\n'),v=>{const l=lines(v);if(l.length>=3){V.q=l[0];V.opts=l.slice(1,9);V.cnt=V.opts.map(()=>0);V.show=false}},'첫 줄은 질문, 다음 줄부터 보기(2~8개)');
  $('#rs',b).onclick=()=>{V.cnt=V.opts.map(()=>0);V.show=false;save();draw()}};draw()});
app('dice','tool','🎲','주사위 · 룰렛 · 동전',b=>{
 let mode='d',n=1,ang=0,raf=0;const PIP={1:[4],2:[0,8],3:[0,4,8],4:[0,2,6,8],5:[0,2,4,6,8],6:[0,2,3,5,6,8]};
 const face=v=>`<div class="dice">${Array.from({length:9},(_,i)=>`<i class="${PIP[v].includes(i)?'d':''}"></i>`).join('')}</div>`;
 const draw=()=>{cancelAnimationFrame(raf);b.innerHTML=`<div class="tabs">${[['d','🎲 주사위'],['r','🎡 룰렛'],['c','🪙 동전']].map(([k,t])=>`<button class="btn ${mode===k?'on':''}" data-m="${k}" type="button">${t}</button>`).join('')}</div><div class="center" id="st"></div>`;
  $$('[data-m]',b).forEach(x=>x.onclick=()=>{mode=x.dataset.m;draw()});const st=$('#st',b);
  if(mode==='d'){st.innerHTML=`<div class="row c" id="ds">${Array.from({length:n},()=>face(1+rnd(6))).join('')}</div><div class="big" id="sm"></div>
   <div class="row c"><button class="btn big pri" id="go" type="button">🎲 굴리기</button>${[1,2,3].map(k=>`<button class="btn ${n===k?'on':''}" data-n="${k}" type="button">${k}개</button>`).join('')}</div>`;
   $$('[data-n]',st).forEach(x=>x.onclick=()=>{n=+x.dataset.n;draw()});
   $('#go',st).onclick=()=>{const v=Array.from({length:n},()=>1+rnd(6));$('#ds',st).innerHTML=v.map(face).join('');$$('.dice',st).forEach(d=>d.classList.add('roll'));beep([[300,.05],[0,.05],[400,.05],[0,.05],[600,.1]],.12);$('#sm',st).textContent=n>1?'합: '+v.reduce((a,c)=>a+c,0):''}}
  else if(mode==='c'){st.innerHTML=`<div class="coin" id="cn">앞</div><div class="big" id="cr"></div><button class="btn big pri" id="go" type="button">🪙 던지기</button>`;
   $('#go',st).onclick=()=>{const c=$('#cn',st);c.classList.remove('flip');void c.offsetWidth;c.classList.add('flip');const v=rnd(2);setTimeout(()=>{c.textContent=v?'앞':'뒤';$('#cr',st).textContent=v?'앞면이 나왔어요!':'뒷면이 나왔어요!'},900)}}
  else{const items=lines(DB.roulette);st.innerHTML=`<div style="position:relative"><canvas id="wh" width="440" height="440" style="width:min(440px,70vmin);height:min(440px,70vmin)"></canvas><div style="position:absolute;top:-6px;left:50%;transform:translateX(-50%);font-size:2.4rem">🔻</div></div>
   <div class="big" id="rr"></div><div class="row c"><button class="btn big pri" id="go" type="button">🎡 돌리기</button><button class="btn" id="e" type="button">✏️ 칸 바꾸기</button></div>`;
   const cv=$('#wh',st),x=cv.getContext('2d'),k=Math.max(1,items.length);
   const paint=()=>{x.clearRect(0,0,440,440);for(let i=0;i<k;i++){const a0=ang+i*2*Math.PI/k-Math.PI/2,a1=a0+2*Math.PI/k;x.beginPath();x.moveTo(220,220);x.arc(220,220,210,a0,a1);x.fillStyle=G[i%7].acc;x.globalAlpha=i%2?.75:1;x.fill();x.globalAlpha=1;
    x.save();x.translate(220,220);x.rotate((a0+a1)/2);x.fillStyle='#fff';x.font='bold 24px Jua, sans-serif';x.textAlign='right';x.fillText((items[i]||'').slice(0,8),195,8);x.restore()}
    x.beginPath();x.arc(220,220,24,0,7);x.fillStyle='#fff';x.fill()};paint();
   $('#e',st).onclick=()=>editText('룰렛 칸 (한 줄에 하나, 2~16개)',DB.roulette,v=>{DB.roulette=lines(v).slice(0,16).join('\n')});
   $('#go',st).onclick=()=>{const t0=performance.now(),dur=3800,start=ang,spin=8*Math.PI+Math.random()*2*Math.PI;$('#rr',st).textContent='';
    const step=t=>{const p=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-p,3);ang=start+spin*e;paint();if(p<1)raf=requestAnimationFrame(step);else{const a=((-ang)%(2*Math.PI)+2*Math.PI)%(2*Math.PI);const i=Math.floor(a/(2*Math.PI/k))%k;$('#rr',st).textContent='👉 '+items[i];beep()}};raf=requestAnimationFrame(step)}}};
 draw();return ()=>cancelAnimationFrame(raf)});
app('curtain','tool','🙈','화면 가리개',b=>{
 const draw=()=>{const L=lines(DB.curtain);b.innerHTML=`<div class="row"><button class="btn" id="all" type="button">👀 모두 열기</button><button class="btn" id="hide" type="button">🙈 모두 가리기</button><button class="btn" id="e" type="button">✏️ 내용 적기</button><button class="btn pri" id="bk" type="button">⬛ 화면 끄기 (선생님 보기)</button></div>
  <div class="list" style="gap:.6rem">${L.map(l=>`<button class="cover hid" type="button">${esc(l)}</button>`).join('')||'<div class="small">가릴 내용을 적어 주세요</div>'}</div>`;
  $$('.cover',b).forEach(c=>c.onclick=()=>c.classList.toggle('hid'));$('#all',b).onclick=()=>$$('.cover',b).forEach(c=>c.classList.remove('hid'));$('#hide',b).onclick=()=>$$('.cover',b).forEach(c=>c.classList.add('hid'));
  $('#e',b).onclick=()=>editText('가릴 내용 (한 줄에 하나)',DB.curtain,v=>DB.curtain=v);$('#bk',b).onclick=()=>blackout()};draw();return draw});
app('qr','tool','🔳','QR 코드',b=>{
 b.innerHTML=`<div class="row"><input class="inp" id="u" style="flex:1" value="${esc(DB.qrLast||location.href.split('#')[0])}" placeholder="주소나 글을 적어요"><button class="btn pri" id="go" type="button">만들기</button></div><div class="center" id="q"></div>`;
 const mk=()=>{const v=$('#u',b).value.trim();if(!v)return;DB.qrLast=v;save();try{qrcode.stringToBytes=qrcode.stringToBytesFuncs['UTF-8'];const q=qrcode(0,'M');q.addData(v);q.make();
  $('#q',b).innerHTML=`<div style="background:#fff;padding:14px;border-radius:16px;width:min(70vmin,520px)">${q.createSvgTag({scalable:true,margin:2})}</div><div class="small" style="max-width:40rem;overflow-wrap:anywhere">${esc(v)}</div>`}catch(e){$('#q',b).textContent='너무 길어서 만들 수 없어요'}};
 $('#go',b).onclick=mk;$('#u',b).onkeydown=e=>{if(e.key==='Enter')mk()};mk()});

/* --- 학습 연결 --- */
const ROOMS=[['📖','3학년 국어방','../grade3/korean/index.html','국어','#E07A6E'],['🔢','3학년 수학방','../grade3/math/index.html','수학','#E39A4E'],['🗺️','3학년 사회방','../grade3/social/index.html','사회','#5E95CB'],['🔬','3학년 과학방','../grade3/science/index.html','과학','#4FA987'],['🚀','3학년 전체','../grade3/index.html','',"#9A7BD0"],['🏫','수업자료실 첫 화면','../index.html','',"#8C7B6E"]];
app('links','learn','📚','수업자료실 바로가기',b=>{
 const ni=nowInfo(),s=ni.p?subj(ni.p):(ni.next?subj(ni.next.p):'');const hit=ROOMS.find(r=>r[3]&&s.includes(r[3]));
 const cus=lines(DB.links).map(l=>{const i=l.indexOf('|');return i>0?[l.slice(0,i).trim(),l.slice(i+1).trim()]:null}).filter(x=>x&&/^https?:\/\//.test(x[1]));
 b.innerHTML=`${hit?`<a class="card mix" href="${hit[2]}" style="--acc:${hit[4]};text-decoration:none;color:inherit;background:var(--soft-acc)"><div class="mid">${ni.p?'지금':'다음'} 시간은 ${esc(s)}! 👉 ${hit[0]} ${hit[1]} 열기</div></a>`:''}
 <div class="cols">${ROOMS.map(r=>`<a class="card mix" href="${r[2]}" style="--acc:${r[4]};text-decoration:none;color:inherit;display:flex;gap:.8rem;align-items:center"><span style="font-size:2.4rem">${r[0]}</span><span class="mid">${r[1]}</span></a>`).join('')}</div>
 <h3 style="margin:.4rem 0 0">⭐ 선생님이 모은 링크</h3><div class="cols">${cus.map(c=>`<a class="card" href="${esc(c[1])}" target="_blank" rel="noopener" style="text-decoration:none;color:inherit"><div class="mid">🔗 ${esc(c[0])}</div><div class="small" style="overflow-wrap:anywhere">${esc(c[1])}</div></a>`).join('')||'<div class="small">아직 없어요</div>'}</div>
 <div class="row t-only"><button class="btn" id="e" type="button">✏️ 링크 고치기</button></div>`;
 $('#e',b).onclick=()=>editText('링크 (한 줄에 하나)',DB.links,v=>DB.links=v,'<b>이름 | https://주소</b> 처럼 적어요')});
app('goal','learn','🎯','오늘의 학습 문제',b=>{
 if(DB.goals.d!==ymd())DB.goals={d:ymd(),p:{}};
 const draw=()=>{const ni=nowInfo(),p=ni.p||(ni.next&&ni.next.p)||1,mx=Math.max(5,...bells().map(x=>x.p));
  b.innerHTML=`<div class="center"><div class="mid" style="color:var(--soft)">${p}교시 ${esc(subj(p))}</div><div class="big" style="font-size:clamp(2rem,7vmin,4.4rem);white-space:pre-wrap">${esc(DB.goals.p[p]||'')||'학습 문제가 아직 없어요'}</div></div>
  <div class="card"><table class="t">${Array.from({length:mx},(_,i)=>i+1).map(k=>`<tr><th style="width:6rem">${k}교시 ${esc(subj(k))}</th><td>${esc(DB.goals.p[k]||'')}</td></tr>`).join('')}</table></div>
  <div class="row t-only"><button class="btn" id="e" type="button">✏️ 오늘 학습 문제 적기</button></div>`;
  $('#e',b).onclick=()=>editText('오늘 학습 문제 (교시마다 한 줄)',Array.from({length:mx},(_,i)=>`${i+1}: ${DB.goals.p[i+1]||''}`).join('\n'),v=>{lines(v).forEach(l=>{const m=/^(\d+)\s*[:.)]\s*(.*)$/.exec(l);if(m)DB.goals.p[m[1]]=m[2]})},'예) 2: 원의 중심과 반지름을 알아봅시다',7)};draw()});
app('drill','learn','🧮','기초 연습',b=>{
 let mode='g',dan=0,q=null,qi=0,score=0,inp='',kind='add';
 const mkQ=()=>{if(mode==='g'){const d=dan||2+rnd(8),k=1+rnd(9);return {t:`${d} × ${k}`,a:d*k}}
  if(kind==='add'){const x=100+rnd(900),y=100+rnd(900);return {t:`${x} + ${y}`,a:x+y}}if(kind==='sub'){let x=100+rnd(900),y=100+rnd(900);if(x<y)[x,y]=[y,x];return {t:`${x} − ${y}`,a:x-y}}
  if(kind==='mul'){const x=10+rnd(90),y=2+rnd(8);return {t:`${x} × ${y}`,a:x*y}}const y=2+rnd(8),a=1+rnd(9);return {t:`${y*a} ÷ ${y}`,a}};
 const draw=()=>{b.innerHTML=`<div class="tabs">${[['g','✖️ 구구단'],['c','➕ 셈 연습'],['p','🖨️ 연산 활동지'],['w','✏️ 받아쓰기']].map(([k,t])=>`<button class="btn ${mode===k?'on':''}" data-m="${k}" type="button">${t}</button>`).join('')}</div><div id="st" class="center"></div>`;
  $$('[data-m]',b).forEach(x=>x.onclick=()=>{mode=x.dataset.m;q=null;draw()});const st=$('#st',b);
  if(mode==='p'){const K=[['add','덧셈','세 자리 수 + 세 자리 수'],['sub','뺄셈','세 자리 수 − 세 자리 수'],['mul','곱셈','두·세 자리 × 한 자리, 두 자리 × 두 자리'],['div','나눗셈','두·세 자리 ÷ 한 자리 (나머지 포함)'],['frac','분수','분모가 같은 분수의 덧셈·뺄셈'],['mix','섞어서','다섯 가지를 골고루']];
   const fr=(a,b)=>`<span class="fr"><span>${a}</span><span>${b}</span></span>`;
   const gen=k=>{if(k==='mix')k=['add','sub','mul','div','frac'][rnd(5)];
    if(k==='add'){const x=100+rnd(900),y=100+rnd(900);return {q:`${x} + ${y} =`,a:''+(x+y)}}
    if(k==='sub'){let x=100+rnd(900),y=100+rnd(900);if(x===y)y--;if(x<y)[x,y]=[y,x];return {q:`${x} − ${y} =`,a:''+(x-y)}}
    if(k==='mul'){const t=rnd(3);if(t===0){const x=10+rnd(90),y=2+rnd(8);return {q:`${x} × ${y} =`,a:''+x*y}}if(t===1){const x=100+rnd(900),y=2+rnd(8);return {q:`${x} × ${y} =`,a:''+x*y}}const x=10+rnd(90),y=10+rnd(90);return {q:`${x} × ${y} =`,a:''+x*y}}
    if(k==='div'){const y=2+rnd(8);if(rnd(2)){const a=rnd(2)?10+rnd(90):3+rnd(20);return {q:`${y*a} ÷ ${y} =`,a:''+a}}const a=2+rnd(30),r=1+rnd(y-1);return {q:`${y*a+r} ÷ ${y} =`,a:`${a} … ${r}`}}
    const d=3+rnd(10);if(rnd(2)){const x=1+rnd(d-1),y=1+rnd(d-1);return {q:`${fr(x,d)} + ${fr(y,d)} =`,a:fr(x+y,d)}}let x=1+rnd(d-1),y=1+rnd(d-1);if(x===y)x=Math.min(d-1,x+1),y=Math.max(1,y-1);if(x<y)[x,y]=[y,x];if(x===y)return {q:`${fr(x,d)} − ${fr(1,d)} =`,a:fr(x-1,d)};return {q:`${fr(x,d)} − ${fr(y,d)} =`,a:fr(x-y,d)}};
   const kd=b._pk||'add';if(!b._ps||b._pkk!==kd){b._ps=Array.from({length:20},()=>gen(kd));b._pkk=kd}const P=b._ps,show=!!b._pa,KN=K.find(x=>x[0]===kd);
   st.innerHTML=`<div class="row c">${K.map(([k,t])=>`<button class="btn ${kd===k?'on':''}" data-pk="${k}" type="button">${t}</button>`).join('')}</div><div class="small">${KN[2]} · 20문제 · 새 문제를 누를 때마다 다른 문제가 나와요.</div>
    <div class="dsp ${show?'show':''}">${P.map((x,i)=>`<div><small>${i+1}.</small>${x.q} ${show?`<i>${x.a}</i>`:''}</div>`).join('')}</div>
    <div class="row c"><button class="btn big" id="pn" type="button">🔄 새 문제</button><button class="btn big" id="pa" type="button">${show?'🙈 답 숨기기':'👀 답 보기'}</button><button class="btn big pri" id="pp" type="button">🖨️ 인쇄 (뒤에 답지)</button></div>`;
   $$('[data-pk]',st).forEach(x=>x.onclick=()=>{b._pk=x.dataset.pk;b._ps=null;draw()});$('#pn',st).onclick=()=>{b._ps=null;draw()};$('#pa',st).onclick=()=>{b._pa=!b._pa;draw()};
   $('#pp',st).onclick=()=>{let w=document.getElementById('dws');if(!w){w=document.createElement('div');w.id='dws';document.body.appendChild(w)}const d=new Date(),dt=`${d.getMonth()+1}월 ${d.getDate()}일`;
    const head=(t)=>`<h2>${t}<small>우리 반 교실 · 기초 연습</small></h2>`;
    w.innerHTML=`<div class="pg">${head('연산 활동지 · '+KN[1])}<div class="nm"><span>(&nbsp;&nbsp;&nbsp;&nbsp;)학년 (&nbsp;&nbsp;&nbsp;&nbsp;)반 (&nbsp;&nbsp;&nbsp;&nbsp;)번 이름: (&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;)</span><span>${dt} · 맞힌 개수 (&nbsp;&nbsp;&nbsp;&nbsp;) / 20</span></div><ol>${P.map((x,i)=>`<li><span class="n">${i+1}.</span>${x.q}<span class="bx"></span></li>`).join('')}</ol><div class="ft">초등교사 홍지희 · hongjihee1005.github.io/hong_teacher</div></div>
     <div class="pg ans">${head('답지 · '+KN[1])}<div class="nm"><span>${KN[2]}</span><span>${dt}</span></div><ol>${P.map((x,i)=>`<li><span class="n">${i+1}.</span>${x.q} <b>${x.a}</b></li>`).join('')}</ol></div>`;
    document.body.classList.add('hj-dprint');setTimeout(()=>{window.print();setTimeout(()=>document.body.classList.remove('hj-dprint'),400)},60)};return}
  if(mode==='w'){const L=lines(DB.dictation);st.innerHTML=`<div class="list" style="width:min(900px,100%)">${L.map((l,i)=>`<li><button class="btn" data-s="${i}" type="button">🔈 ${i+1}번 듣기</button><span class="grow mid cover hid" style="border:0;padding:.2rem .5rem;min-height:2.6rem;font-size:1.3rem">${esc(l.replace(/^\d+[.)]\s*/,''))}</span></li>`).join('')}</div>
   <div class="row c"><label class="row">빠르기 <input type="range" id="rt" min="0.5" max="1.2" step="0.05" value="${DB.rate||.8}"></label><button class="btn t-only" id="e" type="button">✏️ 받아쓰기 문장</button></div><div class="small">문장을 누르면 정답이 보여요.</div>`;
   $$('[data-s]',st).forEach(x=>x.onclick=()=>say(L[x.dataset.s].replace(/^\d+[.)]\s*/,''),DB.rate||.8));$$('.cover',st).forEach(c=>c.onclick=()=>c.classList.toggle('hid'));
   $('#rt',st).onchange=e=>{DB.rate=+e.target.value;save()};$('#e',st).onclick=()=>editText('받아쓰기 문장 (한 줄에 하나)',DB.dictation,v=>DB.dictation=v);return}
  if(!q){st.innerHTML=mode==='g'?`<div class="mid">몇 단을 연습할까요?</div><div class="row c">${[2,3,4,5,6,7,8,9].map(d=>`<button class="btn big" data-d="${d}" type="button">${d}단</button>`).join('')}<button class="btn big pri" data-d="0" type="button">🔀 섞어서</button></div>`
   :`<div class="mid">무엇을 연습할까요? (10문제)</div><div class="row c">${[['add','세 자리 덧셈'],['sub','세 자리 뺄셈'],['mul','두 자리 × 한 자리'],['div','나눗셈 (구구단 범위)']].map(([k,t])=>`<button class="btn big" data-k="${k}" type="button">${t}</button>`).join('')}</div>`;
   $$('[data-d]',st).forEach(x=>x.onclick=()=>{dan=+x.dataset.d;qi=0;score=0;q=mkQ();inp='';draw()});$$('[data-k]',st).forEach(x=>x.onclick=()=>{kind=x.dataset.k;qi=0;score=0;q=mkQ();inp='';draw()});return}
  if(qi>=10){st.innerHTML=`<div class="huge">${score>=9?'🏆':score>=6?'😊':'💪'}</div><div class="big">10문제 중 ${score}개 맞았어요!</div><button class="btn big pri" id="ag" type="button">다시 하기</button>`;$('#ag',st).onclick=()=>{q=null;draw()};if(score>=9)confetti(40);return}
  st.innerHTML=`<div class="mid">${qi+1} / 10 · 맞힌 개수 ${score}</div><div class="huge" style="font-size:clamp(3rem,11vmin,7rem)">${q.t} = </div><div class="ans" id="an">${inp||'&nbsp;'}</div><div class="mid" id="fb"></div>
   <div class="keypad">${[7,8,9,4,5,6,1,2,3].map(k=>`<button data-k="${k}" type="button">${k}</button>`).join('')}<button data-k="del" type="button">⌫</button><button data-k="0" type="button">0</button><button data-k="ok" type="button" style="background:#4FA987;color:#fff">확인</button></div>`;
  const chk=()=>{if(!inp)return;const ok=+inp===q.a;$('#fb',st).textContent=ok?'⭕ 정답!':`❌ 정답은 ${q.a}`;beep(ok?[[1046,.1],[1318,.18]]:[[220,.25]],.15);if(ok)score++;qi++;setTimeout(()=>{q=mkQ();inp='';draw()},ok?700:1600)};
  $$('.keypad button',st).forEach(x=>x.onclick=()=>{const k=x.dataset.k;if(k==='del')inp=inp.slice(0,-1);else if(k==='ok'){chk();return}else if(inp.length<5)inp+=k;$('#an',st).innerHTML=inp||'&nbsp;'});
  b.onkeydown=e=>{if(/^\d$/.test(e.key)&&inp.length<5){inp+=e.key;$('#an',st).textContent=inp}else if(e.key==='Backspace'){inp=inp.slice(0,-1);$('#an',st).innerHTML=inp||'&nbsp;'}else if(e.key==='Enter')chk()};b.tabIndex=-1;b.focus()};draw()});
app('reading','learn','📖','독서 기록',b=>{
 const draw=()=>{const tot=Object.values(DB.books).reduce((a,c)=>a+c,0),g=DB.bookGoal||300;
  b.innerHTML=`<div class="card"><div class="row" style="justify-content:space-between"><span class="mid">📚 우리 반 책탑 ${tot}권 / 목표 ${g}권</span><span class="mid">${Math.min(100,Math.round(tot/g*100))}%</span></div>
  <div style="height:1.8rem;background:var(--bg2);border-radius:999px;overflow:hidden;margin-top:.4rem"><div style="height:100%;width:${Math.min(100,tot/g*100)}%;background:linear-gradient(90deg,#5E95CB,#9A7BD0)"></div></div></div>
  <div class="small">책을 한 권 다 읽으면 내 번호를 눌러요. (+1권)</div>
  <div class="numgrid">${Array.from({length:N()},(_,i)=>i+1).map(n=>`<button class="num" data-n="${n}" type="button">${esc(label(n))}<small>📕 ${DB.books[n]||0}권</small></button>`).join('')}</div>
  <div class="row t-only"><button class="btn" id="m" type="button">➖ 잘못 누른 것 빼기</button><button class="btn" id="g" type="button">🎯 목표 권수</button><button class="btn" id="rs" type="button">🔄 모두 0으로</button></div>`;
  $$('.num',b).forEach(x=>x.onclick=()=>{const n=x.dataset.n;DB.books[n]=(DB.books[n]||0)+1;save();beep([[784,.1],[1046,.15]],.12);toast(`${label(+n)} 📕 ${DB.books[n]}권 째! 멋져요`);draw();if(tot+1===g)confetti()});
  $('#m',b).onclick=()=>askText('몇 번의 기록을 1권 뺄까요?',v=>{const n=parseInt(v);if(DB.books[n]>0){DB.books[n]--;save();draw()}});
  $('#g',b).onclick=()=>askText('우리 반 목표 권수',v=>{if(+v>0){DB.bookGoal=+v;save();draw()}},{type:'number',val:g});
  $('#rs',b).onclick=()=>{if(confirm('독서 기록을 모두 지울까요?')){DB.books={};save();draw()}}};draw()});
app('homework','learn','📝','알림장 · 숙제',b=>{
 const draw=()=>{const L=DB.hw.slice().sort((a,c)=>a.d<c.d?1:-1).slice(0,7);
  b.innerHTML=L.length?L.map((h,i)=>`<div class="card" ${i===0?'style="border-color:#5E95CB;border-width:3px"':''}><div class="mid">${h.d===ymd()?'📌 오늘 ':''}${h.d.slice(5).replace('-','월 ')}일 (${DAYS[new Date(h.d+'T00:00').getDay()]})</div>
  <ol style="font-size:1.25rem;margin:.3rem 0">${lines(h.t).map(x=>`<li>${esc(x)}</li>`).join('')}</ol></div>`).join(''):'<div class="center"><div class="big">알림장이 아직 없어요</div></div>';
  b.innerHTML+=`<div class="row t-only"><button class="btn pri" id="e" type="button">✏️ 오늘 알림장 쓰기</button></div>`;
  $('#e',b).onclick=()=>{const h=DB.hw.find(x=>x.d===ymd());editText(`${ymd()} 알림장 (한 줄에 하나)`,h?h.t:'',v=>{DB.hw=DB.hw.filter(x=>x.d!==ymd());if(v.trim())DB.hw.push({d:ymd(),t:v});DB.hw=DB.hw.sort((a,c)=>a.d<c.d?1:-1).slice(0,40)})}};draw();return draw});

/* --- 학급 생활 --- */
function rotate(list,shift){const P=Array.from({length:N()},(_,i)=>i+1);const k=((shift%P.length)+P.length)%P.length;return P.slice(k).concat(P.slice(0,k))}
app('roles','life','🧹','1인 1역',b=>{
 const draw=()=>{const R=lines(DB.roles.list),sh=DB.roles.shift+weekNo(),P=rotate(null,sh);
  b.innerHTML=`<div class="row" style="justify-content:space-between"><div class="mid">이번 주 우리 반 역할 · 매주 월요일 한 칸씩 자동으로 바뀌어요</div><input class="inp" id="f" placeholder="🔍 번호로 찾기" style="width:10rem" inputmode="numeric"></div>
  <div class="cols" style="grid-template-columns:repeat(auto-fill,minmax(15rem,1fr))">${P.map((n,i)=>`<div class="card" data-n="${n}" style="display:flex;gap:.8rem;align-items:center;padding:.6rem .9rem"><span class="disp" style="font-size:1.4rem;min-width:3.2rem">${esc(label(n))}</span><span style="font-size:1.1rem">${esc(R[i%Math.max(1,R.length)]||'쉬어요')}</span></div>`).join('')}</div>
  <div class="row t-only"><button class="btn" id="nx" type="button">⏭ 한 칸 돌리기</button><button class="btn" id="pv" type="button">⏮ 되돌리기</button><button class="btn" id="e" type="button">✏️ 역할 목록</button></div>`;
  $('#f',b).oninput=e=>{const v=e.target.value.trim();$$('[data-n]',b).forEach(c=>c.style.outline=v&&c.dataset.n===v?'4px solid #E39A4E':'')};
  $('#nx',b).onclick=()=>{DB.roles.shift++;save();draw()};$('#pv',b).onclick=()=>{DB.roles.shift--;save();draw()};
  $('#e',b).onclick=()=>editText('역할 목록 (한 줄에 하나)',DB.roles.list,v=>DB.roles.list=v,`학생 수(${N()}명)보다 역할이 적으면 앞에서부터 다시 나눠요.`,12)};draw()});
app('rules','life','🤝','우리 반 약속',b=>{
 let t='r';const draw=()=>{const L=lines(t==='r'?DB.rules:DB.crules);b.innerHTML=`<div class="tabs"><button class="btn ${t==='r'?'on':''}" data-t="r" type="button">🤝 우리 반 약속</button><button class="btn ${t==='c'?'on':''}" data-t="c" type="button">💻 크롬북·태블릿 약속</button></div>
  <div class="center"><ol class="list" style="width:min(1000px,100%)">${L.map((l,i)=>`<li style="font-family:var(--display);font-size:clamp(1.4rem,4.4vmin,2.4rem)"><span class="step"><span class="no">${i+1}</span></span><span class="grow">${esc(l)}</span></li>`).join('')}</ol></div>
  <div class="row t-only"><button class="btn" id="e" type="button">✏️ 약속 고치기</button></div>`;
  $$('[data-t]',b).forEach(x=>x.onclick=()=>{t=x.dataset.t;draw()});$('#e',b).onclick=()=>editText('약속 (한 줄에 하나)',t==='r'?DB.rules:DB.crules,v=>{if(t==='r')DB.rules=v;else DB.crules=v})};draw();return draw});
app('thermo','life','🌡️','학급 목표 온도계',b=>{
 const H=DB.thermo;const draw=()=>{const p=Math.min(100,H.n/H.goal*100);b.innerHTML=`<div class="therm"><div class="tube"><div class="lvl" style="height:${p}%"></div></div>
  <div style="text-align:center"><div class="mid">칭찬 온도</div><div class="huge">${H.n}<span style="font-size:.4em">/${H.goal}</span></div><div class="mid">🎁 ${esc(H.reward)}</div>
  ${p>=100?'<div class="big pulse">🎉 목표 달성!</div>':`<div class="mid">${H.goal-H.n}개 더 모으면 돼요!</div>`}
  <div class="row c t-only" style="margin-top:1rem"><button class="btn" data-v="-1" type="button">−1</button><button class="btn big pri" data-v="1" type="button">+1 칭찬</button><button class="btn" data-v="3" type="button">+3</button></div>
  <div class="row c t-only"><button class="btn sm" id="e" type="button">✏️ 목표·보상</button><button class="btn sm" id="rs" type="button">🔄 처음부터</button></div></div></div>
  <div class="note">칭찬 온도는 선생님 모드에서 올릴 수 있어요.</div>`;
  $$('[data-v]',b).forEach(x=>x.onclick=()=>{const was=H.n>=H.goal;H.n=Math.max(0,H.n+(+x.dataset.v));save();beep([[660+H.n*8,.12]],.12);draw();if(!was&&H.n>=H.goal){confetti(120);beep()}});
  $('#e',b).onclick=()=>editText('목표 개수와 보상',H.goal+'\n'+H.reward,v=>{const l=lines(v);if(+l[0]>0)H.goal=+l[0];if(l[1])H.reward=l[1]},'첫 줄은 목표 개수, 둘째 줄은 보상',3);
  $('#rs',b).onclick=()=>{if(confirm('온도를 0으로 할까요?')){H.n=0;save();draw()}}};draw();return draw});
app('seats','life','🪑','자리 배치표',b=>{
 const S=DB.seats;let sel=-1;const fix=()=>{const k=S.rows*S.cols;if(S.order.length!==k||!S.order.some(Boolean)){const P=Array.from({length:N()},(_,i)=>i+1);S.order=Array.from({length:k},(_,i)=>P[i]||0)}};
 const draw=()=>{fix();const tv=S.view==='t',idx=[...S.order.keys()];if(tv)idx.reverse();
  b.innerHTML=`${tv?'':'<div class="boardlbl">칠판</div>'}<div class="seats" style="grid-template-columns:repeat(${S.cols},minmax(0,1fr))">${idx.map(i=>`<button class="seat ${S.order[i]?'':'empty'} ${sel===i?'sel':''}" data-i="${i}" type="button">${S.order[i]?esc(label(S.order[i])):'빈자리'}</button>`).join('')}</div>${tv?'<div class="boardlbl">칠판 (선생님 자리에서 본 모습)</div>':''}
  <div class="row"><button class="btn" id="v" type="button">🔄 ${tv?'학생':'선생님'} 쪽에서 보기</button><span class="t-only row"><button class="btn" id="sh" type="button">🔀 자리 섞기</button><label class="row">줄 <input class="inp" id="r" type="number" min="1" max="10" value="${S.rows}" style="width:4.4rem"></label><label class="row">칸 <input class="inp" id="c" type="number" min="1" max="10" value="${S.cols}" style="width:4.4rem"></label><button class="btn" id="pr" type="button">🖨️ 인쇄</button></span></div>
  <div class="small t-only">자리 두 개를 차례로 누르면 서로 바뀌어요.</div>`;
  $$('.seat',b).forEach(x=>x.onclick=()=>{if(!isT())return;const i=+x.dataset.i;if(sel<0)sel=i;else{[S.order[sel],S.order[i]]=[S.order[i],S.order[sel]];sel=-1;save()}draw()});
  $('#v',b).onclick=()=>{S.view=tv?'s':'t';save();draw()};
  $('#sh',b).onclick=()=>{if(!confirm('자리를 새로 섞을까요?'))return;const P=shuffle(Array.from({length:N()},(_,i)=>i+1));S.order=Array.from({length:S.rows*S.cols},(_,i)=>P[i]||0);save();draw()};
  const rc=()=>{S.rows=Math.max(1,Math.min(10,+$('#r',b).value));S.cols=Math.max(1,Math.min(10,+$('#c',b).value));S.order=[];save();draw()};$('#r',b).onchange=rc;$('#c',b).onchange=rc;$('#pr',b).onclick=()=>window.print()};draw()});
app('clean','life','🧽','청소 당번표',b=>{
 const draw=()=>{const Ar=lines(DB.clean.areas),P=rotate(null,DB.clean.shift+weekNo()),k=Math.max(1,Ar.length),g=Ar.map(()=>[]);P.forEach((n,i)=>g[i%k].push(n));
  b.innerHTML=`<div class="mid">이번 주 청소 구역 · 매주 자동으로 바뀌어요</div><div class="cols">${Ar.map((a,i)=>`<div class="card mix" style="--acc:${G[i%7].acc}"><div class="mid" style="color:var(--ink-acc)">🧹 ${esc(a)}</div><div class="disp" style="font-size:1.35rem">${g[i].sort((x,y)=>x-y).map(label).join(' · ')}</div></div>`).join('')}</div>
  <div class="row t-only"><button class="btn" id="nx" type="button">⏭ 한 칸 돌리기</button><button class="btn" id="e" type="button">✏️ 청소 구역</button></div>`;
  $('#nx',b).onclick=()=>{DB.clean.shift+=Math.ceil(N()/k);save();draw()};$('#e',b).onclick=()=>editText('청소 구역 (한 줄에 하나)',DB.clean.areas,v=>DB.clean.areas=v)};draw();return draw});
function bdayList(){return lines(DB.bdays).map(l=>{const m=/^(.*?)[\s,]+(\d{1,2})[-./월\s]+(\d{1,2})/.exec(l);return m?{who:m[1].trim(),m:+m[2],d:+m[3]}:null}).filter(Boolean)}
function bdayToday(){const d=new Date();return bdayList().filter(x=>x.m===d.getMonth()+1&&x.d===d.getDate())}
app('birthday','life','🎂','생일 축하',b=>{
 const draw=()=>{const t=bdayToday(),mo=new Date().getMonth()+1,L=bdayList().filter(x=>x.m===mo).sort((a,c)=>a.d-c.d);
  b.innerHTML=`<div class="center">${t.length?`<div class="huge pulse">🎂</div><div class="big">${t.map(x=>esc(x.who)).join(', ')}<br>생일 축하해요! 🎉</div><button class="btn big pri" id="cg" type="button">🎉 축하하기</button>`:`<div class="huge">🎈</div><div class="big">오늘은 생일인 친구가 없어요</div>`}
  <div class="card" style="min-width:min(600px,100%)"><div class="mid">${mo}월의 생일</div>${L.map(x=>`<div class="mid">🎁 ${mo}월 ${x.d}일 · ${esc(x.who)}</div>`).join('')||'<div class="small">없어요</div>'}</div>
  <button class="btn t-only" id="e" type="button">✏️ 생일 목록</button></div>`;
  const cg=$('#cg',b);if(cg)cg.onclick=()=>{confetti(120);beep([[523,.3],[523,.15],[587,.45],[523,.45],[698,.45],[659,.8]],.2)};
  $('#e',b).onclick=()=>editText('생일 목록',DB.bdays,v=>DB.bdays=v,'한 줄에 하나: <b>별명 3-15</b> 또는 <b>7번 3월 15일</b>. ⚠️ 이 화면은 공개 주소이므로 실명보다 번호나 별명을 권해요. 이 기기에만 저장돼요.')};draw();if(bdayToday().length)setTimeout(()=>confetti(80),300);return draw});

/* --- 마음 · 소통 --- */
const MOODS=[['sun','☀️','맑음','기분이 좋아요'],['cloud','🌤️','구름 조금','괜찮아요'],['gray','☁️','흐림','그저 그래요'],['rain','🌧️','비','속상해요'],['storm','⛈️','천둥 번개','화가 나요'],['rainbow','🌈','무지개','설레요']];
app('mood','heart','🌈','마음 날씨',b=>{
 if(DB.mood.d!==ymd())DB.mood={d:ymd(),c:{}};let busy=false;
 const draw=()=>{const tot=Object.values(DB.mood.c).reduce((a,c)=>a+c,0),mx=Math.max(1,...Object.values(DB.mood.c));
  b.innerHTML=`<div class="big">오늘 내 마음 날씨는 어때요?</div><div class="cols" style="grid-template-columns:repeat(auto-fit,minmax(11rem,1fr))">${MOODS.map(m=>`<button class="card" data-k="${m[0]}" type="button" style="text-align:center;cursor:pointer"><div style="font-size:3.6rem;line-height:1.1">${m[1]}</div><div class="mid">${m[2]}</div><div class="small">${m[3]}</div></button>`).join('')}</div>
  <div class="center" style="flex:0"><div class="mid" id="ok">이름은 남지 않아요. 지금까지 ${tot}명이 골랐어요.</div></div>
  <div class="card bars t-only">${MOODS.map(m=>`<div class="b"><span>${m[1]} ${m[2]}</span><div class="track"><div class="fillb" style="width:${(DB.mood.c[m[0]]||0)/mx*100}%"></div></div><b>${DB.mood.c[m[0]]||0}</b></div>`).join('')}<button class="btn sm" id="rs" type="button">🔄 오늘 기록 지우기</button></div>
  <div class="note">마음이 힘들 때는 언제든지 선생님께 이야기해 주세요. 💛</div>`;
  $$('[data-k]',b).forEach(x=>x.onclick=()=>{if(busy)return;busy=true;DB.mood.c[x.dataset.k]=(DB.mood.c[x.dataset.k]||0)+1;save();const ok=$('#ok',b);
   ok.textContent=['rain','storm','gray'].includes(x.dataset.k)?'알려 줘서 고마워요. 선생님이 곁에 있어요 💛':'알려 줘서 고마워요! 😊';ok.classList.add('pulse');setTimeout(()=>{busy=false;draw()},1600)});
  $('#rs',b).onclick=()=>{DB.mood={d:ymd(),c:{}};save();draw()}};draw()});
app('ask','heart','📮','질문함 · 건의함',b=>{
 const draw=()=>{b.innerHTML=`<div class="card"><div class="mid">선생님께 하고 싶은 질문이나 우리 반을 위한 생각을 적어요</div>
  <textarea class="inp" id="t" rows="3" maxlength="300" placeholder="여기에 적어요"></textarea>
  <div class="row"><select class="inp" id="k"><option>❓ 질문</option><option>💡 건의</option><option>💬 고민</option></select><input class="inp" id="w" placeholder="이름 (안 써도 돼요)" style="width:12rem"><button class="btn pri" id="s" type="button">📮 넣기</button></div>
  <div class="small">적은 내용은 선생님만 볼 수 있어요.</div></div>
  <div class="t-only"><h3>📬 받은 쪽지 ${DB.asks.length}개</h3><ul class="list">${DB.asks.map((a,i)=>`<li style="${a.ok?'opacity:.5':''}"><span class="grow"><b>${esc(a.k)}</b> ${esc(a.t)}<br><span class="small">${esc(a.w||'이름 없음')} · ${esc(a.d)}</span></span><button class="btn sm" data-o="${i}" type="button">${a.ok?'↩':'✔ 읽음'}</button><button class="btn sm" data-x="${i}" type="button">🗑️</button></li>`).join('')||'<li>아직 없어요</li>'}</ul></div>`;
  $('#s',b).onclick=()=>{const t=$('#t',b).value.trim();if(!t){toast('내용을 적어 주세요');return}DB.asks.unshift({t,k:$('#k',b).value,w:$('#w',b).value.trim(),d:ymd(),ok:false});DB.asks=DB.asks.slice(0,100);save();toast('📮 선생님께 잘 전달했어요!');draw()};
  $$('[data-o]',b).forEach(x=>x.onclick=()=>{const a=DB.asks[x.dataset.o];a.ok=!a.ok;save();draw()});$$('[data-x]',b).forEach(x=>x.onclick=()=>{DB.asks.splice(x.dataset.x,1);save();draw()})};draw();return draw});
app('praise','heart','💌','칭찬 릴레이',b=>{
 const draw=()=>{b.innerHTML=`<div class="card"><div class="row"><input class="inp" id="to" placeholder="누구에게? (번호나 이름)" style="width:14rem"><input class="inp" id="m" style="flex:1;min-width:12rem" maxlength="120" placeholder="어떤 점을 칭찬할까요?"><button class="btn pri" id="s" type="button">💌 붙이기</button></div>
  <div class="small">칭찬을 받은 친구가 다음 칭찬을 이어서 써요. 고운 말로 써요 😊</div></div>
  <div class="sticky">${DB.praise.map((p,i)=>`<div class="s"><b>To. ${esc(p.to)}</b>${esc(p.m)}<div class="small" style="color:inherit;opacity:.7">${esc(p.d.slice(5))}</div><button class="btn sm x t-only" data-x="${i}" type="button" aria-label="지우기">✕</button></div>`).join('')}</div>
  <div class="row t-only"><button class="btn" id="cl" type="button">🗑️ 모두 지우기</button></div>`;
  $('#s',b).onclick=()=>{const to=$('#to',b).value.trim(),m=$('#m',b).value.trim();if(!to||!m){toast('받는 친구와 칭찬을 적어 주세요');return}DB.praise.unshift({to,m,d:ymd()});DB.praise=DB.praise.slice(0,80);save();beep([[784,.1],[988,.1],[1318,.2]],.12);draw()};
  $$('[data-x]',b).forEach(x=>x.onclick=()=>{DB.praise.splice(x.dataset.x,1);save();draw()});$('#cl',b).onclick=()=>{if(confirm('칭찬 쪽지를 모두 지울까요?')){DB.praise=[];save();draw()}}};draw();return draw});
app('conflict','heart','🕊️','갈등 해결 단계',b=>{
 const S=[['✋','멈춰요','하던 말과 행동을 멈추고, 숨을 크게 세 번 쉬어요. 하나… 둘… 셋…'],['💬','내 마음을 말해요','"나는 네가 ~할 때, ~해서 ~한 마음이 들었어."'],['👂','친구 마음을 들어요','친구의 말을 끝까지 듣고, "너는 ~해서 ~했구나." 하고 말해 줘요.'],['🤝','함께 방법을 찾아요','둘 다 괜찮은 방법을 찾아요. 필요하면 "미안해"라고 말해요.'],['🙋','그래도 어려우면','선생님께 도움을 요청해요. 도움을 구하는 것도 멋진 방법이에요.']];
 let i=0;const draw=()=>{b.innerHTML=`<div class="center"><div class="mid" style="color:var(--soft)">${i+1} / ${S.length} 단계</div><div class="huge">${S[i][0]}</div><div class="big">${S[i][1]}</div><div class="mid" style="max-width:40rem">${S[i][2]}</div>
  <div class="row c"><button class="btn big" id="p" type="button" ${i?'':'disabled'}>◀ 앞</button><button class="btn big pri" id="n" type="button" ${i<S.length-1?'':'disabled'}>다음 ▶</button></div>
  <div class="row c">${S.map((s,j)=>`<span class="chip" style="${j===i?'background:var(--mid-acc)':''}">${s[0]} ${s[1]}</span>`).join('')}</div></div>`;
  $('#p',b).onclick=()=>{i--;draw()};$('#n',b).onclick=()=>{i++;draw()}};draw()});

/* --- 쉬는 시간 · 틈새 --- */
const MOVES=[['🙆','팔 쭉 뻗기','두 팔을 머리 위로 쭉 뻗고 기지개를 켜요.'],['🔄','목 돌리기','천천히 목을 오른쪽으로 한 바퀴, 왼쪽으로 한 바퀴 돌려요.'],['🤷','어깨 으쓱','어깨를 귀까지 올렸다가 툭 내려요. 다섯 번!'],['👋','손목 털기','손목을 탈탈 털고, 손가락을 쫙 폈다 오므려요.'],['👀','눈 쉬기','창밖 먼 곳을 바라보고 눈을 천천히 깜빡여요.'],['🦶','발목 돌리기','앉은 채로 발목을 빙글빙글 돌려요.'],['🌀','허리 비틀기','의자에 앉아 몸을 천천히 오른쪽, 왼쪽으로 돌려요.'],['🌬️','풍선 숨쉬기','코로 4초 들이마시고, 입으로 4초 천천히 내쉬어요.'],['👏','박수 리듬','짝짝 짝짝짝! 선생님 박수를 따라 해요.'],['🙏','손바닥 밀기','두 손바닥을 가슴 앞에서 마주 대고 꾹 밀어요.']];
app('brain','play','🤸','브레인 브레이크',b=>{
 let seq=[],i=-1,left=0,iv=0;const draw=()=>{if(i<0){b.innerHTML=`<div class="center"><div class="huge">🤸</div><div class="big">앉아서 하는 몸 깨우기</div><div class="mid">동작 6개 · 하나에 20초</div><button class="btn big pri" id="go" type="button">▶ 시작</button></div>`;
   $('#go',b).onclick=()=>{seq=shuffle(MOVES).slice(0,6);i=0;left=20;tick();iv=setInterval(tick,1000)};return}
  if(i>=seq.length){b.innerHTML=`<div class="center"><div class="huge">🌟</div><div class="big">몸이 깨어났어요! 다시 공부해 볼까요?</div><button class="btn big" id="ag" type="button">다시 하기</button></div>`;$('#ag',b).onclick=()=>{i=-1;draw()};return}
  const m=seq[i];b.innerHTML=`<div class="center"><div class="mid" style="color:var(--soft)">${i+1} / ${seq.length}</div><div class="huge pulse">${m[0]}</div><div class="big">${m[1]}</div><div class="mid">${m[2]}</div><div class="huge" style="font-size:4rem">${left}</div><button class="btn" id="sk" type="button">다음 동작 ▶</button></div>`;
  $('#sk',b).onclick=()=>{i++;left=20;draw()}};
 const tick=()=>{if(i<0||i>=seq.length){clearInterval(iv);return}left--;if(left<=0){i++;left=20;beep([[880,.15]],.15);if(i>=seq.length){clearInterval(iv);beep()}}draw()};
 draw();return ()=>clearInterval(iv)});
app('quiz','play','❓','오늘의 퀴즈',b=>{
 let Q=[],i=0,show=false;const load=()=>{Q=shuffle(lines(DB.quiz).map(l=>{const k=l.split('|');return {q:k[0].trim(),a:(k[1]||'').trim()}}));i=0;show=false};load();
 const draw=()=>{if(!Q.length){b.innerHTML='<div class="center"><div class="big">퀴즈가 없어요</div><button class="btn t-only" id="e" type="button">✏️ 퀴즈 만들기</button></div>'}
  else{const x=Q[i];b.innerHTML=`<div class="center"><div class="mid" style="color:var(--soft)">${i+1} / ${Q.length}</div><div class="big" style="font-size:clamp(2rem,7vmin,4.2rem)">Q. ${esc(x.q)}</div>
  ${show?`<div class="big pulse" style="color:#3F9A6E">A. ${esc(x.a)}</div>`:'<button class="btn big pri" id="sh" type="button">👀 정답 보기</button>'}
  <div class="row c"><button class="btn big" id="p" type="button" ${i?'':'disabled'}>◀</button><button class="btn big" id="n" type="button">${i<Q.length-1?'다음 ▶':'🔀 다시 섞기'}</button></div><button class="btn t-only" id="e" type="button">✏️ 퀴즈 고치기</button></div>`;
  const sh=$('#sh',b);if(sh)sh.onclick=()=>{show=true;draw()};$('#p',b).onclick=()=>{i--;show=false;draw()};$('#n',b).onclick=()=>{if(i<Q.length-1){i++;show=false}else load();draw()}}
  $('#e',b).onclick=()=>editText('퀴즈 (한 줄에 하나)',DB.quiz,v=>{DB.quiz=v;load()},'<b>질문 | 정답</b> 처럼 적어요')};draw();return draw});
app('twenty','play','🕵️','스무고개',b=>{
 let st={w:'',log:[],end:false};const draw=()=>{if(!st.w){b.innerHTML=`<div class="center"><div class="huge">🕵️</div><div class="big">스무고개</div><div class="mid">출제자가 정답을 몰래 정해요. 다른 친구들은 예/아니요로 답할 수 있는 질문을 20번까지 해요.</div><button class="btn big pri" id="s" type="button">🤫 정답 정하기</button></div>`;
   $('#s',b).onclick=()=>askText('정답 (화면에 보이지 않아요)',v=>{if(v.trim()){st={w:v.trim(),log:[],end:false};draw()}},{type:'password'});return}
  const n=st.log.length;b.innerHTML=`<div class="row" style="justify-content:space-between"><span class="big" style="font-size:2rem">${20-n}고개 남음</span><span class="row">${Array.from({length:20},(_,i)=>`<span style="width:1rem;height:1rem;border-radius:50%;background:${i<n?'#9A7BD0':'var(--bg2)'}"></span>`).join('')}</span></div>
  ${st.end?`<div class="center"><div class="big">정답은 「${esc(st.w)}」!</div><button class="btn big pri" id="nw" type="button">새 문제</button></div>`:`<div class="row"><input class="inp" id="q" style="flex:1" placeholder="질문을 적어요 (예: 살아 있나요?)"><button class="btn pri" data-a="예" type="button">⭕ 예</button><button class="btn" data-a="아니요" type="button">❌ 아니요</button></div>
  <div class="row"><button class="btn" id="g" type="button">🙋 정답 맞히기</button><button class="btn" id="rv" type="button">🏳️ 정답 공개</button></div>`}
  <ol class="list">${st.log.map((l,i)=>`<li><b>${i+1}.</b><span class="grow">${esc(l[0])}</span><b>${l[1]==='예'?'⭕ 예':'❌ 아니요'}</b></li>`).join('')}</ol>`;
  $$('[data-a]',b).forEach(x=>x.onclick=()=>{const q=$('#q',b).value.trim()||'(말로 한 질문)';st.log.push([q,x.dataset.a]);if(st.log.length>=20)st.end=true;draw()});
  const g=$('#g',b);if(g)g.onclick=()=>askText('정답은?',v=>{if(v.replace(/\s/g,'')===st.w.replace(/\s/g,'')){st.end=true;confetti();beep();draw()}else{toast('아니에요! 한 고개가 지나가요');st.log.push(['정답 도전: '+v,'아니요']);if(st.log.length>=20)st.end=true;draw()}});
  const rv=$('#rv',b);if(rv)rv.onclick=()=>{st.end=true;draw()};const nw=$('#nw',b);if(nw)nw.onclick=()=>{st={w:'',log:[],end:false};draw()}};draw()});
function syl(c){const k=c.charCodeAt(0)-0xAC00;if(k<0||k>11171)return null;return {i:Math.floor(k/588),v:Math.floor(k%588/28),f:k%28}}
function mk(i,v,f){return String.fromCharCode(0xAC00+i*588+v*28+f)}
function dueum(c){const s=syl(c);if(!s)return [c];const out=[c];const yv=[2,6,7,12,17,20];/* ㅑㅕㅖㅛㅠㅣ */
 if(s.i===5){out.push(mk(yv.includes(s.v)?11:2,s.v,s.f))}else if(s.i===2&&yv.includes(s.v)){out.push(mk(11,s.v,s.f))}return out}
app('wordchain','play','🔤','끝말잇기',b=>{
 let W=[],msg='첫 낱말을 적어요';const draw=()=>{const last=W.length?W[W.length-1].slice(-1):'';
  b.innerHTML=`<div class="center" style="flex:0"><div class="mid">${esc(msg)}</div>${last?`<div class="big">「${esc(last)}」${dueum(last).length>1?` 또는 「${dueum(last)[1]}」`:''}(으)로 시작해요</div>`:''}</div>
  <div class="row c"><input class="inp" id="w" style="font-size:1.6rem;width:min(26rem,90%)" placeholder="낱말" autocomplete="off"><button class="btn big pri" id="ok" type="button">이어 가기</button><button class="btn" id="rs" type="button">🔄 처음부터</button></div>
  <div class="row c" style="font-family:var(--display);font-size:1.4rem">${W.map((w,i)=>`<span class="chip" style="font-size:1.2rem">${esc(w)}</span>${i<W.length-1?'→':''}`).join('')}</div>
  <div class="note">두 글자 이상, 앞에 나온 낱말은 다시 못 써요. 두음 법칙(ㄹ→ㄴ·ㅇ, ㄴ→ㅇ)도 인정해요. 사전에 있는 낱말인지는 친구들과 함께 판단해요.</div>`;
  const go=()=>{const w=$('#w',b).value.trim().replace(/\s/g,'');if(!w)return;if(w.length<2)msg='❌ 두 글자 이상 적어요';else if(W.includes(w))msg='❌ 벌써 나온 낱말이에요';
   else if(last&&!dueum(last).includes(w[0]))msg=`❌ 「${last}」(으)로 시작해야 해요`;else{W.push(w);msg=`⭕ 좋아요! ${W.length}개째`;beep([[880,.1]],.12)}draw();$('#w',b).focus()};
  $('#ok',b).onclick=go;$('#w',b).onkeydown=e=>{if(e.key==='Enter'&&!e.isComposing)go()};$('#rs',b).onclick=()=>{W=[];msg='첫 낱말을 적어요';draw()};$('#w',b).focus()};draw()});
const FILL='가나다라마바사아자차카타파하고노도로모보소오조초코토포호구누두루무부수우주추쿠투푸후기니디리미비시이지치키티피히';
app('puzzle','play','🧩','낱말 찾기 퍼즐',b=>{
 let g=[],sz=8,words=[],found=[],placed=[],a=null,ans=false;
 const make=()=>{words=lines(DB.words).map(w=>w.replace(/\s/g,'')).filter(w=>w.length>=2&&w.length<=8);sz=Math.max(8,...words.map(w=>w.length));g=Array.from({length:sz*sz},()=>'');placed=[];found=[];
  for(const w of shuffle(words).sort((x,y)=>y.length-x.length)){for(let t=0;t<200;t++){const d=rnd(2),r=rnd(d?sz-w.length+1:sz),c=rnd(d?sz:sz-w.length+1);let ok=true;
    for(let k=0;k<w.length;k++){const i=(r+(d?k:0))*sz+c+(d?0:k);if(g[i]&&g[i]!==w[k]){ok=false;break}}
    if(ok){const cells=[];for(let k=0;k<w.length;k++){const i=(r+(d?k:0))*sz+c+(d?0:k);g[i]=w[k];cells.push(i)}placed.push({w,cells});break}}}
  g=g.map(x=>x||FILL[rnd(FILL.length)])};
 const draw=()=>{const fc=new Set(placed.filter(p=>found.includes(p.w)||ans).flatMap(p=>p.cells));
  b.innerHTML=`<div class="row" style="justify-content:space-between"><div class="mid">찾은 낱말 ${found.length} / ${placed.length} · 첫 글자와 끝 글자를 차례로 눌러요 (→ ↓)</div><div class="row"><button class="btn" id="nw" type="button">🔀 새 퍼즐</button><button class="btn" id="an" type="button">${ans?'🙈 정답 숨기기':'👀 정답 보기'}</button><button class="btn t-only" id="e" type="button">✏️ 낱말 바꾸기</button></div></div>
  <div style="display:flex;gap:1.2rem;flex-wrap:wrap;justify-content:center;align-items:flex-start"><div class="ws" style="grid-template-columns:repeat(${sz},1fr);width:min(92vw,66vh,640px)">${g.map((ch,i)=>`<button type="button" data-i="${i}" class="${fc.has(i)?'f':''} ${a===i?'a':''}">${ch}</button>`).join('')}</div>
  <ul class="list" style="min-width:10rem">${placed.map(p=>`<li style="${found.includes(p.w)?'text-decoration:line-through;opacity:.6':''}"><span class="disp" style="font-size:1.3rem">${esc(p.w)}</span>${found.includes(p.w)?' ✔':''}</li>`).join('')}</ul></div>`;
  $$('.ws button',b).forEach(x=>x.onclick=()=>{const i=+x.dataset.i;if(a===null){a=i;draw();return}const hit=placed.find(p=>!found.includes(p.w)&&((p.cells[0]===a&&p.cells[p.cells.length-1]===i)||(p.cells[0]===i&&p.cells[p.cells.length-1]===a)));
   a=null;if(hit){found.push(hit.w);beep([[988,.1],[1318,.18]],.12);if(found.length===placed.length)confetti()}draw()});
  $('#nw',b).onclick=()=>{make();ans=false;draw()};$('#an',b).onclick=()=>{ans=!ans;draw()};$('#e',b).onclick=()=>editText('찾을 낱말 (한 줄에 하나, 2~8글자)',DB.words,v=>{DB.words=v;make()})};
 make();draw();return draw});

/* --- 안전 --- */
app('safety','safe','🚒','안전 수칙 · 대피 경로',b=>{
 const T2={fire:['🔥 불이 났을 때',['"불이야!" 크게 외치고 선생님께 알려요.','젖은 수건이나 옷소매로 코와 입을 막아요.','몸을 낮추고 벽을 짚으며 계단으로 내려가요.','엘리베이터는 타지 않아요.','밖으로 나가면 정해진 곳에 모여 선생님과 인원을 확인해요.']],
  quake:['🌏 지진이 났을 때',['흔들리는 동안 책상 아래로 들어가 책상 다리를 꼭 잡아요.','책상이 없으면 가방이나 두 팔로 머리를 보호해요.','흔들림이 멈추면 선생님을 따라 계단으로 운동장처럼 넓은 곳으로 가요.','건물, 담장, 유리창에서 멀리 떨어져요.']],
  room:['🏫 교실 안전',['교실과 복도에서는 걸어 다녀요.','가위, 칼 같은 도구는 날을 아래로 해서 건네요.','창문 밖으로 몸을 내밀지 않아요.','다치거나 아프면 바로 선생님께 말해요.']]};
 let t='fire';const draw=()=>{b.innerHTML=`<div class="tabs">${Object.keys(T2).map(k=>`<button class="btn ${t===k?'on':''}" data-t="${k}" type="button">${T2[k][0]}</button>`).join('')}<button class="btn ${t==='evac'?'on':''}" data-t="evac" type="button">🚪 우리 반 대피 경로</button></div>`+
  (t==='evac'?`<div class="card"><div class="mid" style="white-space:pre-wrap">${esc(DB.evac)||'선생님이 우리 반 대피 경로를 적어 주세요.'}</div>${DB.evacImg?`<img src="${DB.evacImg}" alt="대피 경로 그림" style="max-width:100%;border-radius:12px;margin-top:.6rem">`:''}</div>
   <div class="row t-only"><button class="btn" id="e" type="button">✏️ 대피 경로 적기</button><label class="btn">🖼️ 그림 넣기<input type="file" id="im" accept="image/*" hidden></label>${DB.evacImg?'<button class="btn" id="dx" type="button">그림 지우기</button>':''}</div>`
  :`<ol class="list">${T2[t][1].map((s,i)=>`<li style="font-family:var(--display);font-size:clamp(1.3rem,4vmin,2.1rem)"><span class="step"><span class="no">${i+1}</span></span><span class="grow">${esc(s)}</span></li>`).join('')}</ol>`)+
  `<div class="note">국민재난안전포털의 국민행동요령을 바탕으로 쉽게 줄여 썼어요. 실제 대피는 우리 학교 안전 계획과 선생님 안내를 따라요.</div>`;
  $$('[data-t]',b).forEach(x=>x.onclick=()=>{t=x.dataset.t;draw()});
  if(t==='evac'){$('#e',b).onclick=()=>editText('우리 반 대피 경로',DB.evac,v=>DB.evac=v,'예) 교실 앞문 → 왼쪽 중앙 계단 → 1층 현관 → 운동장 3학년 자리');
   $('#im',b).onchange=e=>{const f=e.target.files[0];if(!f)return;const img=new Image(),rd=new FileReader();rd.onload=()=>{img.onload=()=>{const c=document.createElement('canvas'),s=Math.min(1,1200/img.width);c.width=img.width*s;c.height=img.height*s;c.getContext('2d').drawImage(img,0,0,c.width,c.height);DB.evacImg=c.toDataURL('image/jpeg',.8);save();draw()};img.src=rd.result};rd.readAsDataURL(f)};
   const dx=$('#dx',b);if(dx)dx.onclick=()=>{DB.evacImg='';save();draw()}}};draw();return draw});
app('wash','safe','🧼','손 씻기 타이머',b=>{
 const S=[['👐','손바닥','손바닥과 손바닥을 마주 대고 문질러요'],['🤚','손등','손등과 손바닥을 마주 대고 문질러요'],['🙌','손가락 사이','손바닥을 마주 대고 손깍지를 끼고 문질러요'],['🤝','손가락','손가락을 마주 잡고 문질러요'],['👍','엄지손가락','엄지손가락을 다른 손바닥으로 감싸 돌리며 문질러요'],['💅','손톱 밑','손가락을 반대쪽 손바닥에 놓고 문질러 손톱 밑을 깨끗하게 해요']];
 let i=-1,left=0,iv=0;const draw=()=>{if(i<0){b.innerHTML=`<div class="center"><div class="huge">🧼</div><div class="big">흐르는 물에 비누로 30초 이상!</div><button class="btn big pri" id="go" type="button">▶ 손 씻기 시작</button><div class="note">질병관리청 「올바른 손 씻기 6단계」를 바탕으로 했어요.</div></div>`;
   $('#go',b).onclick=()=>{i=0;left=5;draw();iv=setInterval(()=>{left--;if(left<=0){i++;left=5;beep([[880,.1]],.12)}if(i>=S.length){clearInterval(iv);beep()}draw()},1000)};return}
  if(i>=S.length){b.innerHTML=`<div class="center"><div class="huge">✨</div><div class="big">깨끗해졌어요! 수건으로 잘 닦아요</div><button class="btn big" id="ag" type="button">다시</button></div>`;$('#ag',b).onclick=()=>{i=-1;draw()};return}
  b.innerHTML=`<div class="center"><div class="mid" style="color:var(--soft)">${i+1} / 6단계</div><div class="huge pulse">${S[i][0]}</div><div class="big">${S[i][1]}</div><div class="mid">${S[i][2]}</div><div class="huge" style="font-size:4rem">${left}</div>
  <div style="width:min(700px,90%);height:1.4rem;background:var(--bg2);border-radius:999px;overflow:hidden"><div style="height:100%;width:${(i*5+5-left)/30*100}%;background:#5E95CB"></div></div></div>`};
 draw();return ()=>clearInterval(iv)});

/* 학교 주소 → 위도·경도 (OpenStreetMap Nominatim, 인증키 없음) */
async function geoSchool(r){const addr=(r.ORG_RDNMA||'').replace(/\s*\(.*?\)\s*/g,' ').trim(),parts=addr.split(/\s+/);
 const qs=[addr,r.SCHUL_NM,parts.slice(0,3).join(' '),parts.slice(0,2).join(' ')].filter((v,i,a)=>v&&a.indexOf(v)===i);
 for(const q of qs){try{const x=await fetch('https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=kr&accept-language=ko&q='+encodeURIComponent(q));
  const j=await x.json();if(j&&j[0])return {lat:+(+j[0].lat).toFixed(4),lon:+(+j[0].lon).toFixed(4)}}catch(e){}}
 return null}
async function setWxSchool(r,done){const g=await geoSchool(r);if(!g){toast('학교 위치를 찾지 못했어요. 직접 적기를 써 주세요');return false}
 DB.loc={name:r.SCHUL_NM,lat:g.lat,lon:g.lon};WX.t=0;save();loadWx(true);toast(r.SCHUL_NM+' 날씨로 바꿨어요');if(done)done();return true}
function schoolList(rows,attr){return `<ul class="list">${rows.slice(0,10).map((r,i)=>`<li><span class="grow">${esc(r.SCHUL_NM)} <span class="small">${esc(r.ORG_RDNMA||'')}</span></span><button class="btn sm" ${attr}="${i}" type="button">고르기</button></li>`).join('')}</ul>`}

/* --- 선생님 전용 --- */
app('settings','teach','⚙️','선생님 설정',b=>{
 const n=DB.neis;
 const draw=()=>{b.innerHTML=`
 <div class="card"><h3 style="margin:0">🏷️ 우리 반</h3><div class="row"><label class="row">화면 제목 <input class="inp" id="ti" value="${esc(DB.title)}"></label><label class="row">학생 수 <input class="inp" id="ct" type="number" min="1" max="40" value="${N()}" style="width:5rem"></label></div>
  <label>학생 이름 (선택, 한 줄에 한 명, 번호 순서)<textarea class="inp" id="nm" rows="4" placeholder="비워 두면 1번, 2번…으로 보여요">${esc(DB.names)}</textarea></label>
  <div class="note">⚠️ 이 페이지 주소는 누구나 열 수 있지만, 적은 내용은 <b>이 기기의 브라우저에만</b> 저장되고 다른 기기로 보내지 않아요. 그래도 공용 기기에서는 실명 대신 번호나 별명을 권해요.</div></div>
 <div class="card"><h3 style="margin:0">🔒 선생님 비밀번호</h3><div class="row"><input class="inp" id="pn" type="password" value="${esc(DB.pin)}" placeholder="비워 두면 비밀번호 없이 열려요" autocomplete="new-password"></div>
  <div class="note">아이들이 실수로 설정을 바꾸지 않게 막는 정도의 잠금이에요. 중요한 정보를 지키는 보안 장치는 아니에요.</div></div>
 <div class="card"><h3 style="margin:0">🖥️ 화면 모드</h3><div class="row">${[['auto','자동'],['tv','교실 TV · 전자칠판 (크게)'],['dev','학생 크롬북 · 태블릿 (작게)']].map(([k,t])=>`<button class="btn ${DB.mode===k?'on':''}" data-md="${k}" type="button">${t}</button>`).join('')}</div></div>
 <div class="card"><h3 style="margin:0">🧩 메뉴 켜고 끄기</h3><div class="small">끈 메뉴는 학생 화면에서 보이지 않아요. (선생님 모드에서는 흐리게 보여요)</div>
  ${G.filter(g=>!g.t).map(g=>`<div style="margin-top:.5rem"><b class="disp">${g.nm}</b><div class="row">${ORDER.filter(id=>A[id].g===g.id).map(id=>`<label class="chip"><input type="checkbox" data-hd="${id}" ${DB.hidden[id]?'':'checked'}> ${A[id].ico} ${A[id].nm}</label>`).join('')}</div></div>`).join('')}</div>
 <div class="card"><h3 style="margin:0">📍 날씨 위치</h3>
  <div class="row"><span>지금 위치: <b>${esc(DB.loc.name)}</b></span>${n.school&&DB.loc.name!==n.schoolName?`<button class="btn sm" id="wn" type="button">🍚 나이스에 연결한 학교(${esc(n.schoolName)})로 맞추기</button>`:''}</div>
  <div class="row"><input class="inp" id="wq" placeholder="학교 이름으로 찾기 (예: 동일중앙초)" style="width:16rem"><button class="btn" id="ws" type="button">🔍 학교 찾기</button></div><div id="wr"></div>
  <details style="margin-top:.4rem"><summary class="small" style="cursor:pointer">직접 적기 (위도·경도)</summary>
  <div class="row"><input class="inp" id="ln" value="${esc(DB.loc.name)}" style="width:10rem"><label class="row">위도 <input class="inp" id="la" value="${DB.loc.lat}" style="width:7rem"></label><label class="row">경도 <input class="inp" id="lo" value="${DB.loc.lon}" style="width:7rem"></label></div></details>
  <div class="small">학교를 고르면 학교 주소로 위치를 찾아 그 동네 날씨·미세먼지를 보여 줘요. 처음 기본값은 부산 동구예요.</div></div>
 <div class="card"><h3 style="margin:0">🍚 나이스 연결 (급식·시간표·학사 일정)</h3>
  <div class="row"><input class="inp" id="sq" placeholder="학교 이름으로 찾기" style="width:14rem"><button class="btn" id="ss" type="button">🔍 찾기</button></div><div id="sr"></div>
  <div class="row"><span>선택한 학교: <b>${esc(n.schoolName||'없음')}</b> ${n.school?`(${esc(n.office)} / ${esc(n.school)})`:''}</span></div>
  <div class="row"><label class="row">학년 <input class="inp" id="gr" value="${esc(n.grade)}" style="width:4rem"></label><label class="row">반 <input class="inp" id="cl" value="${esc(n.cls)}" style="width:4rem"></label><label class="row">인증키(선택) <input class="inp" id="ky" value="${esc(n.key)}" style="width:14rem"></label></div>
  <div class="note">나이스 교육정보 개방 포털(open.neis.go.kr) 자료를 씁니다. 인증키가 없어도 적은 양은 불러올 수 있고, 포털에서 무료로 인증키를 받을 수 있어요. 학교 이름은 학생 화면에 나오지 않아요.</div></div>
 <div class="card"><h3 style="margin:0">💾 자료 백업</h3><div class="row"><button class="btn" id="ex" type="button">⬇️ 파일로 내보내기</button><label class="btn">⬆️ 파일 가져오기<input type="file" id="im" accept=".json,application/json" hidden></label><button class="btn" id="rs" type="button" style="color:#D2574B">🗑️ 모두 지우기</button></div>
  <div class="small">교실 TV에서 만든 설정을 내보내 다른 기기에서 가져오면 똑같이 쓸 수 있어요.</div></div>
 <div class="row"><button class="btn big pri" id="sv" type="button">💾 저장</button></div>`;
  $$('[data-md]',b).forEach(x=>x.onclick=()=>{DB.mode=x.dataset.md;save();applyMode();draw()});
  $('#ws',b).onclick=async()=>{const q=$('#wq',b).value.trim();if(!q)return;$('#wr',b).textContent='찾는 중…';
   try{const rows=await neis('schoolInfo',{SCHUL_NM:q});if(!rows.length)throw new Error('같은 이름의 학교가 없어요');$('#wr',b).innerHTML=schoolList(rows,'data-w');
    $$('[data-w]',b).forEach(x=>x.onclick=async()=>{x.disabled=true;x.textContent='위치 찾는 중…';if(!(await setWxSchool(rows[x.dataset.w],draw))){x.disabled=false;x.textContent='고르기'}})}
   catch(e){$('#wr',b).textContent='찾지 못했어요: '+e.message}};
  $('#wq',b).onkeydown=e=>{if(e.key==='Enter'&&!e.isComposing)$('#ws',b).click()};
  if($('#wn',b))$('#wn',b).onclick=async()=>{try{const rows=await neis('schoolInfo',{ATPT_OFCDC_SC_CODE:n.office,SD_SCHUL_CODE:n.school});if(rows[0])await setWxSchool(rows[0],draw)}catch(e){toast('학교 정보를 불러오지 못했어요')}};
  $('#sq',b).onkeydown=e=>{if(e.key==='Enter'&&!e.isComposing)$('#ss',b).click()};
  $('#ss',b).onclick=async()=>{const q=$('#sq',b).value.trim();if(!q)return;$('#sr',b).textContent='찾는 중…';
   try{const rows=await neis('schoolInfo',{SCHUL_NM:q});$('#sr',b).innerHTML=`<ul class="list">${rows.slice(0,10).map((r,i)=>`<li><span class="grow">${esc(r.SCHUL_NM)} <span class="small">${esc(r.ORG_RDNMA||'')}</span></span><button class="btn sm" data-s="${i}" type="button">고르기</button></li>`).join('')}</ul>`;
    $$('[data-s]',b).forEach(x=>x.onclick=()=>{const r=rows[x.dataset.s];Object.assign(DB.neis,{office:r.ATPT_OFCDC_SC_CODE,school:r.SD_SCHUL_CODE,schoolName:r.SCHUL_NM});DB.mealCache={};save();draw();toast('학교를 정했어요');if(DB.loc.name==='부산 동구'||DB.loc.name==='우리 동네')setWxSchool(r,draw)})}
   catch(e){$('#sr',b).textContent='찾지 못했어요: '+e.message}};
  $('#ex',b).onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(DB,null,1)],{type:'application/json'}));a.download='우리반교실-'+ymd()+'.json';a.click()};
  $('#im',b).onchange=e=>{const f=e.target.files[0];if(!f)return;f.text().then(t=>{try{const o=JSON.parse(t);if(typeof o!=='object')throw 0;DB=Object.assign(JSON.parse(JSON.stringify(DEF)),o);save();toast('가져왔어요');applyMode();draw();refresh()}catch(err){toast('파일을 읽지 못했어요')}})};
  $('#rs',b).onclick=()=>{if(confirm('이 기기에 저장된 우리 반 교실 자료를 모두 지울까요? 되돌릴 수 없어요.')){try{localStorage.removeItem(KEY)}catch(e){}location.reload()}};
  $('#sv',b).onclick=()=>{DB.title=$('#ti',b).value.trim()||'우리 반 교실';DB.count=Math.max(1,Math.min(40,+$('#ct',b).value||25));DB.names=$('#nm',b).value;DB.pin=$('#pn',b).value;
   $$('[data-hd]',b).forEach(x=>{if(x.checked)delete DB.hidden[x.dataset.hd];else DB.hidden[x.dataset.hd]=1});
   const la=parseFloat($('#la',b).value),lo=parseFloat($('#lo',b).value);if(isFinite(la)&&isFinite(lo)){if(la!==DB.loc.lat||lo!==DB.loc.lon)WX.t=0;DB.loc={name:$('#ln',b).value.trim()||'우리 동네',lat:la,lon:lo}}
   Object.assign(DB.neis,{grade:$('#gr',b).value.trim(),cls:$('#cl',b).value.trim(),key:$('#ky',b).value.trim()});save();toast('저장했어요');refresh();loadWx()}};draw()},{t:1});

/* ===== 바탕화면 그리기 ===== */
function renderGroups(){const el=$('#groups');el.innerHTML=G.map(g=>{const ids=ORDER.filter(id=>A[id].g===g.id);
 return `<section class="grp mix ${g.t?'t-only':''}" style="--acc:${g.acc}"><h2>${g.nm}</h2><div class="icons">${ids.map(id=>{const a=A[id],off=DB.hidden[id];
  return `<button class="ic mix ${off?'off t-only':''} ${a.t?'t-only':''}" style="--acc:${g.acc}" data-open="${id}" type="button"><span class="e" aria-hidden="true">${a.ico}</span><span class="n">${a.nm}</span></button>`}).join('')}</div></section>`}).join('')}
async function renderHome(){document.title=DB.title;$('#title').textContent=DB.title;
 $('#w-notice').textContent=DB.notice||'';
 const ni=nowInfo(),B=bells().filter(x=>x.p),wd=new Date().getDay(),m=new Date().getHours()*60+new Date().getMinutes();
 $('#w-tt').innerHTML=(wd>=1&&wd<=5)?B.filter(x=>subj(x.p)).map(x=>`<li class="${ni.p===x.p?'cur':m>=x.e?'past':''}"><span class="p">${x.p}교시</span>${esc(subj(x.p))}</li>`).join('')||'<li class="small">시간표가 없어요</li>':'<li class="small">주말이에요</li>';
 const nx=ni.p?{p:ni.p+1}:ni.next,ns=nx?subj(nx.p):'',pp=prepFor(ns);$('#w-prep').textContent=ns&&pp?`🎒 다음 시간(${ns}) 준비물: ${pp}`:'';
 const gp=ni.p||(ni.next&&ni.next.p);const gt=DB.goals.d===ymd()&&gp?DB.goals.p[gp]:'';$('#w-goal').innerHTML=gt?`🎯 ${gp}교시 학습 문제<br><b>${esc(gt)}</b>`:'';$('#w-goal').hidden=!gt;
 $('#w-todo').innerHTML=`<ul class="chk">${DB.todo.map((x,i)=>`<li><label><input type="checkbox" data-i="${i}" ${x.ok?'checked':''}><span class="${x.ok?'ok':''}">${esc(x.t)}</span></label></li>`).join('')||'<li class="small">없어요</li>'}</ul>`;
 $$('#w-todo input').forEach(x=>x.onchange=()=>{DB.todo[x.dataset.i].ok=x.checked;save();renderHome()});
 const bd=bdayToday();$('#bday').hidden=!bd.length;if(bd.length)$('#bday').innerHTML=`🎂 오늘은 ${bd.map(x=>esc(x.who)).join(', ')}의 생일이에요! 축하해 주세요 🎉`;
 const h=new Date().getHours();$('#hello').textContent=h<9?'좋은 아침이에요! ☀️':h<12?'오늘도 반가워요! 😊':h<15?'오후도 힘내요! 💪':'오늘 하루도 수고했어요! 🌙';
 const k=ymd();$('#w-meal').innerHTML='<div class="small">불러오는 중…</div>';const o=await mealOf(k);$('#w-meal').innerHTML=mealHTML(o)}
function refresh(){renderGroups();renderHome();if(curApp&&curRefresh)try{curRefresh()}catch(e){}}

/* ===== 창 열기 · 닫기 ===== */
let curApp=null,curClean=null,curRefresh=null;
function openApp(id){const a=A[id];if(!a)return;if((a.t||DB.hidden[id])&&!isT()){toast('선생님 모드에서 열 수 있어요');location.hash='';return}
 closeApp(true);curApp=id;const W=$('#win'),b=$('#wb');W.style.setProperty('--acc',G.find(g=>g.id===a.g).acc);$('#wt').innerHTML=`<span aria-hidden="true">${a.ico}</span> ${esc(a.nm)}`;
 b.className='wbody';b.removeAttribute('style');b.onkeydown=null;b.innerHTML='';W.hidden=false;document.body.style.overflow='hidden';
 const r=a.render(b);curClean=typeof r==='function'&&['board','timer','noise','dice','brain','wash','timetable'].includes(id)?r:null;curRefresh=typeof r==='function'&&!curClean?r:null;$('#wx').focus()}
function closeApp(silent){$('#modal').hidden=true;if(curClean)try{curClean()}catch(e){}curClean=null;curRefresh=null;curApp=null;$('#win').hidden=true;$('#wb').innerHTML='';document.body.style.overflow='';
 if('speechSynthesis' in window)speechSynthesis.cancel();if(!silent){renderHome()}}
function route(){const id=location.hash.slice(1);if(id&&A[id])openApp(decodeURIComponent(id));else if(curApp)closeApp()}
window.addEventListener('hashchange',route);
document.addEventListener('click',e=>{const o=e.target.closest('[data-open]');if(o){e.preventDefault();location.hash=o.dataset.open;return}
 const ed=e.target.closest('[data-edit]');if(ed){if(ed.dataset.edit==='notice')editText('오늘의 안내',DB.notice,v=>DB.notice=v);else editTodo()}});
$('#wx').onclick=()=>{if(location.hash.length>1)location.hash='';else closeApp()};
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!$('#modal').hidden){$('#modal').hidden=true;return}if(curApp)location.hash=''}});
$('#wfs').onclick=()=>fsToggle();$('#fsb').onclick=()=>fsToggle();

/* ===== 선생님 모드 ===== */
function setTeacher(on){document.body.classList.toggle('teacher',on);$('#tb').textContent=on?'🔓 선생님 모드 끄기':'🔒 선생님';try{sessionStorage.setItem('hj-class-t',on?'1':'')}catch(e){}refresh()}
$('#tb').onclick=()=>{if(isT()){setTeacher(false);return}if(!DB.pin){setTeacher(true);toast('선생님 모드예요. ✏️ 단추로 내용을 고칠 수 있어요',2600);return}
 askText('선생님 비밀번호',v=>{if(v===DB.pin){setTeacher(true)}else toast('비밀번호가 달라요')},{type:'password'})};
function applyMode(){const h=document.documentElement;h.classList.toggle('m-tv',DB.mode==='tv');h.classList.toggle('m-dev',DB.mode==='dev')}

/* ===== 시계 ===== */
function tick(){const d=new Date(),t=pad(d.getHours())+':'+pad(d.getMinutes());$('#clk').textContent=t;$('#wclk').textContent=t;
 $('#dt').innerHTML=`<b>${d.getMonth()+1}월 ${d.getDate()}일 ${DAYS[d.getDay()]}요일</b>${d.getFullYear()}년`;{const ni=nowInfo();$('#nowc').textContent='🔔 '+(ni.p?'지금 ':'')+ni.txt;const nc=$('#nextc');let nx=ni.next;if(!nx&&ni.cur){const B=bells();nx=B.slice(B.indexOf(B.find(x=>x.s===ni.cur.s))+1).find(x=>x.p)}const ns=nx&&nx.p?subj(nx.p):'';if(nc){if(nx&&nx.p&&!(ni.txt.indexOf('다음')>=0)){nc.innerHTML='다음 <b>'+nx.p+'교시'+(ns?' · '+esc(ns):'')+'</b> '+nx.st;nc.hidden=false}else nc.hidden=true}}
 const tc=$('#tmc');if(T.run||(T.left===0&&T.dur&&Date.now()-(T.endT||0)<20000)){const l=tLeft();tc.hidden=false;tc.textContent='⏱ '+fmt(l);tc.classList.toggle('end',l<=0);
  if(T.run&&l<=0){T.run=false;T.left=0}if(l<=0&&!T.beeped){T.beeped=true;T.endT=Date.now();beep([[880,.2],[0,.1],[880,.2],[0,.1],[880,.2],[0,.1],[1175,.6]],.3);toast('⏰ 시간이 다 됐어요!',3000)}}else tc.hidden=true}
let lastMin=-1;setInterval(()=>{tick();const m=new Date().getMinutes();if(m!==lastMin){lastMin=m;if(!curApp)renderHome()}},1000);

/* ===== 시작 ===== */
applyMode();try{if(sessionStorage.getItem('hj-class-t')==='1'&&!DB.pin)document.body.classList.add('teacher')}catch(e){}
if(isT())$('#tb').textContent='🔓 선생님 모드 끄기';
renderGroups();renderHome();tick();loadWx();route();
window.HJ={A,ORDER,DB:()=>DB};
