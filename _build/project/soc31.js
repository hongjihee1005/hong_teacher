/* 3-1 사회 1단원 주제 2 (11~21차시) 프로젝트: "우리 동네를 더 살기 좋은 곳으로" 프로젝트 판
   차시마다 판의 한 칸을 채워 가고, 20~21차시에 완성한 판으로 발표한다. 저장: 이 기기 브라우저(localStorage). */
(function(){
var L=(document.documentElement.getAttribute('data-proj-lesson')||'');
var KEY='hj-soc31-proj-v1';
var ST=[
 {id:'p1',ls:['11'],t:'① 우리 동네의 도움을 주는 장소',d:'우리 동네에서 도움을 주는 장소를 골라 판에 붙여요. 없는 장소는 직접 써요.'},
 {id:'p2',ls:['12'],t:'② 장소에서 하는 일로 나누기',d:'붙인 장소를 눌러, 어떤 생활을 돕는지 골라요.'},
 {id:'p3',ls:['1314'],t:'③ 디지털 영상 지도로 찾아 위치 적기',d:'디지털 영상 지도에서 찾은 장소에 ✔ 표시하고, 어디에 있는지 짧게 적어요.'},
 {id:'p4',ls:['15'],t:'④ 살기 좋은 곳의 조건으로 우리 동네 살펴보기',d:'우리 반이 중요하다고 생각한 조건을 3가지 고르고, 우리 동네에 별점을 매겨요.'},
 {id:'p5',ls:['16'],t:'⑤ 불편한 점과 해결 방안',d:'별점이 낮은 조건을 보고 불편한 점을 찾아, 해결 방안과 할 수 있는 사람을 적어요.'},
 {id:'p6',ls:['1718'],t:'⑥ 우리가 바라는 살기 좋은 동네',d:'더 살기 좋은 동네가 되려면 무엇을 더할지 골라 그림 판을 꾸미고, 한 문장으로 소개해요.'},
 {id:'p7',ls:['19'],t:'⑦ 고마운 장소에 감사 편지',d:'도움을 받은 장소 한 곳을 골라 감사 편지를 써요.'},
 {id:'p8',ls:['2021'],t:'⑧ 프로젝트 발표',d:'완성한 판을 크게 띄워 우리 반 프로젝트를 발표해요.'}];
var PL=[['post','📮','우체국'],['hosp','🏥','병원'],['health','💉','보건소'],['lib','📚','도서관'],['fire','🚒','소방서'],['police','👮','지구대·경찰서'],['center','🏛️','행정 복지 센터'],['park','🌳','공원'],['gym','🏸','체육관'],['market','🛒','시장'],['station','🚉','기차역'],['bus','🚌','버스 정류장'],['school','🏫','학교'],['safe','🧸','아동 안전 지킴이집']];
var CAT=[['safe','안전하고 편리한 생활','#2F74E0'],['health','건강한 생활','#E0506B'],['edu','교육과 문화생활','#6A4FC9'],['play','놀이와 여가 생활','#1F9E63']];
var CR=[['안전','🛡️'],['건강','💪'],['교육','📖'],['편리한 교통','🚌'],['자연환경','🌳'],['놀 곳','🛝'],['깨끗함','🧹'],['이웃','🤝']];
var ADD=[['🌳','나무와 공원'],['🚸','안전한 횡단보도'],['💡','밝은 가로등'],['📚','작은 도서관'],['🛝','놀이터'],['🗑️','분리수거함'],['🚲','자전거 길'],['🪑','쉼터 의자'],['🚌','버스 정류장'],['🏥','가까운 병원'],['📷','방범 카메라'],['🌷','꽃길']];
function load(){try{return JSON.parse(localStorage.getItem(KEY))||{}}catch(e){return{}}}
var D=load();D.pl=D.pl||[];D.cat=D.cat||{};D.loc=D.loc||{};D.cr=D.cr||[];D.star=D.star||{};D.prob=D.prob||[];D.add=D.add||[];D.say=D.say||'';D.letter=D.letter||{to:'',txt:''};D.custom=D.custom||[];
function save(){try{localStorage.setItem(KEY,JSON.stringify(D))}catch(e){}render();}
function esc(t){return String(t).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function allPL(){return PL.concat(D.custom.map(function(c,i){return['c'+i,'📍',c]}))}
function pinfo(k){var a=allPL();for(var i=0;i<a.length;i++)if(a[i][0]===k)return a[i];return[k,'📍',k]}
function today(){for(var i=0;i<ST.length;i++)if(ST[i].ls.indexOf(L)>=0)return ST[i];return null}
function done(id){return{p1:D.pl.length>=3,p2:D.pl.length&&D.pl.every(function(k){return D.cat[k]}),p3:Object.keys(D.loc).length>=2,p4:D.cr.length===3&&D.cr.every(function(c){return D.star[c]}),p5:D.prob.length>=1,p6:D.add.length>=2&&D.say.trim(),p7:D.letter.to&&D.letter.txt.trim().length>=10,p8:false}[id]}
/* ---------- 칸별 내용 ---------- */
function sec(id,edit){var h='';
 if(id==='p1'){h='<div class="pj-chips">'+D.pl.map(function(k){var p=pinfo(k);return '<span class="pj-chip">'+p[1]+' '+esc(p[2])+(edit?'<button data-rm="'+k+'" aria-label="빼기">×</button>':'')+'</span>'}).join('')+(D.pl.length?'':'<span class="pj-empty">아직 붙인 장소가 없어요.</span>')+'</div>';
  if(edit)h+='<div class="pj-pick">'+allPL().filter(function(p){return D.pl.indexOf(p[0])<0}).map(function(p){return '<button data-add="'+p[0]+'">'+p[1]+' '+esc(p[2])+'</button>'}).join('')+'</div><div class="pj-row"><input id="pjNew" maxlength="12" placeholder="다른 장소 이름 (예: 노인정)"><button id="pjNewB">붙이기</button></div>';}
 if(id==='p2'){h='<div class="pj-cats">'+CAT.map(function(c){var ks=D.pl.filter(function(k){return D.cat[k]===c[0]});return '<div class="pj-cat" style="--c:'+c[2]+'"><b>'+c[1]+'</b><div>'+ks.map(function(k){var p=pinfo(k);return '<span class="pj-chip">'+p[1]+' '+esc(p[2])+'</span>'}).join('')+'</div></div>'}).join('')+'</div>';
  if(edit){var left=D.pl;h+='<p class="pj-hint">장소를 누르면 생활 종류가 차례로 바뀌어요.</p><div class="pj-pick">'+left.map(function(k){var p=pinfo(k),c=D.cat[k];return '<button data-cat="'+k+'">'+p[1]+' '+esc(p[2])+(c?' → '+CAT.filter(function(x){return x[0]===c})[0][1]:'')+'</button>'}).join('')+(left.length?'':'<span class="pj-empty">①에서 장소를 먼저 붙여요.</span>')+'</div>';}}
 if(id==='p3'){h='<div class="pj-list">'+D.pl.map(function(k){var p=pinfo(k),v=D.loc[k];return '<div class="pj-li">'+(v!==undefined?'✔':'○')+' '+p[1]+' '+esc(p[2])+(edit?'<input data-loc="'+k+'" value="'+esc(v||'')+'" maxlength="24" placeholder="예: 학교 정문 건너편">':(v?' — '+esc(v):''))+'</div>'}).join('')+(D.pl.length?'':'<span class="pj-empty">①에서 장소를 먼저 붙여요.</span>')+'</div>';}
 if(id==='p4'){h='<div class="pj-cr">'+(edit?CR.map(function(c){var on=D.cr.indexOf(c[0])>=0;return '<button data-cr="'+c[0]+'" class="'+(on?'on':'')+'">'+c[1]+' '+c[0]+'</button>'}).join(''):'')+'</div><div class="pj-stars">'+D.cr.map(function(c){var s=D.star[c]||0;return '<div class="pj-li"><b>'+esc(c)+'</b> <span>'+[1,2,3,4,5].map(function(n){return edit?'<button data-st="'+c+'|'+n+'" class="'+(n<=s?'on':'')+'" aria-label="'+n+'점">★</button>':'<i class="'+(n<=s?'on':'')+'">★</i>'}).join('')+'</span></div>'}).join('')+(D.cr.length?'':'<span class="pj-empty">조건을 3가지 골라요.</span>')+'</div>';}
 if(id==='p5'){h='<div class="pj-probs">'+D.prob.map(function(p,i){return '<div class="pj-prob"><div><small>불편한 점</small>'+esc(p.a)+'</div><div><small>해결 방안</small>'+esc(p.b)+'</div><div><small>누가</small>'+esc(p.c)+'</div>'+(edit?'<button data-rp="'+i+'" aria-label="지우기">×</button>':'')+'</div>'}).join('')+(D.prob.length?'':'<span class="pj-empty">아직 적은 내용이 없어요.</span>')+'</div>';
  if(edit)h+='<div class="pj-row pj-row3"><input id="pjA" maxlength="30" placeholder="불편한 점 (예: 공원이 멀어요)"><input id="pjB" maxlength="30" placeholder="해결 방안 (예: 빈터에 작은 공원)"><input id="pjC" maxlength="16" placeholder="누가 (예: 구청, 주민)"><button id="pjPB">적기</button></div>';}
 if(id==='p6'){h='<div class="pj-town">'+(D.add.length?D.add.map(function(i){return '<span title="'+esc(ADD[i][1])+'">'+ADD[i][0]+'</span>'}).join(''):'<span class="pj-empty">더하고 싶은 것을 골라요.</span>')+'</div>'+(edit?'<div class="pj-pick">'+ADD.map(function(a,i){var on=D.add.indexOf(i)>=0;return '<button data-ad="'+i+'" class="'+(on?'on':'')+'">'+a[0]+' '+a[1]+'</button>'}).join('')+'</div><div class="pj-row"><input id="pjSay" maxlength="50" value="'+esc(D.say)+'" placeholder="우리가 바라는 동네는 ~한 곳이에요."></div>':(D.say?'<p class="pj-say">“'+esc(D.say)+'”</p>':''));}
 if(id==='p7'){h=edit?'<div class="pj-row"><select id="pjTo"><option value="">고마운 장소 고르기</option>'+allPL().map(function(p){return '<option'+(D.letter.to===p[2]?' selected':'')+'>'+esc(p[2])+'</option>'}).join('')+'</select></div><textarea id="pjLt" rows="3" maxlength="200" placeholder="~에게. 덕분에 ~할 수 있었어요. 고맙습니다.">'+esc(D.letter.txt)+'</textarea>':(D.letter.txt?'<div class="pj-letter"><b>'+esc(D.letter.to||'')+'에게</b><p>'+esc(D.letter.txt)+'</p></div>':'<span class="pj-empty">아직 쓰지 않았어요.</span>');}
 if(id==='p8'){h='<p class="pj-hint">위 ①~⑦을 차례로 짚으며 발표해요: “우리 동네에는 ~한 장소가 있어요. 그런데 ~이 불편해서, ~을 하면 더 살기 좋아질 거예요.”</p>';}
 return h}
/* ---------- 판 ---------- */
var ov=document.createElement('div');ov.id='pjOv';ov.hidden=true;document.body.appendChild(ov);
var focusId=null,pres=false;
function render(){if(ov.hidden)return;var td=today();
 ov.innerHTML='<div class="pj-box'+(pres?' pres':'')+'"><div class="pj-head"><div><b>우리 반 프로젝트</b><h2>우리 동네를 더 살기 좋은 곳으로</h2><p>11~21차시 동안 한 칸씩 채워 가요. 오늘은 <em>'+(td?td.t:'전체 보기')+'</em></p></div><div class="pj-tools"><button id="pjPres">'+(pres?'편집으로':'발표 화면')+'</button><button id="pjPrint">인쇄</button><button id="pjClose" aria-label="닫기">닫기</button></div></div>'
 +'<div class="pj-grid">'+ST.map(function(s){var me=td&&s.id===td.id,ok=done(s.id);var edit=!pres&&(me||focusId===s.id);return '<section class="pj-sec'+(me?' me':'')+(ok?' ok':'')+'" data-s="'+s.id+'"><div class="pj-st"><h3>'+s.t+'</h3>'+(me?'<span class="pj-today">오늘</span>':ok?'<span class="pj-ok">완성</span>':'')+(!pres&&!me?'<button class="pj-ed" data-ed="'+s.id+'">'+(focusId===s.id?'접기':'고치기')+'</button>':'')+'</div>'+(edit?'<p class="pj-d">'+s.d+'</p>':'')+sec(s.id,edit)+'</section>'}).join('')+'</div>'
 +(pres?'':'<div class="pj-foot"><button id="pjReset">처음부터 다시 하기</button><span>판은 이 기기에 저장돼요.</span></div>')+'</div>';
 wire();var me=ov.querySelector('.pj-sec.me');if(me&&!pres)me.scrollIntoView({block:'nearest'})}
function wire(){var q=function(s){return ov.querySelector(s)},qa=function(s){return [].slice.call(ov.querySelectorAll(s))};
 q('#pjClose').onclick=close;q('#pjPres').onclick=function(){pres=!pres;render()};q('#pjPrint').onclick=function(){pres=true;render();setTimeout(function(){window.print()},200)};
 if(q('#pjReset'))q('#pjReset').onclick=function(){if(confirm('프로젝트 판을 모두 지우고 처음부터 다시 할까요?')){localStorage.removeItem(KEY);D=load();D.pl=[];D.cat={};D.loc={};D.cr=[];D.star={};D.prob=[];D.add=[];D.say='';D.letter={to:'',txt:''};D.custom=[];save()}};
 qa('[data-ed]').forEach(function(b){b.onclick=function(){focusId=focusId===b.dataset.ed?null:b.dataset.ed;render()}});
 qa('[data-add]').forEach(function(b){b.onclick=function(){D.pl.push(b.dataset.add);save()}});
 qa('[data-rm]').forEach(function(b){b.onclick=function(){D.pl=D.pl.filter(function(k){return k!==b.dataset.rm});delete D.cat[b.dataset.rm];delete D.loc[b.dataset.rm];save()}});
 if(q('#pjNewB'))q('#pjNewB').onclick=function(){var v=q('#pjNew').value.trim();if(!v)return;D.custom.push(v);D.pl.push('c'+(D.custom.length-1));save()};
 qa('[data-cat]').forEach(function(b){b.onclick=function(){var k=b.dataset.cat,c=D.cat[k],i=-1;CAT.forEach(function(x,n){if(x[0]===c)i=n});D.cat[k]=CAT[(i+1)%CAT.length][0];save()}});
 qa('[data-loc]').forEach(function(i){i.onchange=function(){D.loc[i.dataset.loc]=i.value.trim();save()}});
 qa('[data-cr]').forEach(function(b){b.onclick=function(){var c=b.dataset.cr,i=D.cr.indexOf(c);if(i>=0){D.cr.splice(i,1);delete D.star[c]}else if(D.cr.length<3)D.cr.push(c);else{alert('조건은 3가지까지 골라요.');return}save()}});
 qa('[data-st]').forEach(function(b){b.onclick=function(){var a=b.dataset.st.split('|');D.star[a[0]]=+a[1];save()}});
 if(q('#pjPB'))q('#pjPB').onclick=function(){var a=q('#pjA').value.trim(),bb=q('#pjB').value.trim(),c=q('#pjC').value.trim();if(!a||!bb){alert('불편한 점과 해결 방안을 함께 적어요.');return}D.prob.push({a:a,b:bb,c:c});save()};
 qa('[data-rp]').forEach(function(b){b.onclick=function(){D.prob.splice(+b.dataset.rp,1);save()}});
 qa('[data-ad]').forEach(function(b){b.onclick=function(){var i=+b.dataset.ad,k=D.add.indexOf(i);if(k>=0)D.add.splice(k,1);else D.add.push(i);save()}});
 if(q('#pjSay'))q('#pjSay').onchange=function(){D.say=this.value;save()};
 if(q('#pjTo'))q('#pjTo').onchange=function(){D.letter.to=this.value;save()};
 if(q('#pjLt'))q('#pjLt').onchange=function(){D.letter.txt=this.value;save()};}
function open(){ov.hidden=false;document.documentElement.classList.add('pj-open');pres=(L==='2021');render()}
function close(){ov.hidden=true;document.documentElement.classList.remove('pj-open');pres=false}
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!ov.hidden)close()});
/* ---------- 들어가는 곳: 첫 화면 카드, 진행 화면 도구 단추 ---------- */
var IC='<svg class="hj-i" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4 3 6.5v13L9 17l6 2.5 6-2.5v-13L15 6.5 9 4z"/><path d="M9 4v13M15 6.5v13"/></svg>';
function mount(){var td=today();
 var map=document.getElementById('cMap');if(map&&!document.getElementById('pjCard')){var c=document.createElement('div');c.id='pjCard';
  c.innerHTML='<div><b>우리 반 프로젝트 · 우리 동네를 더 살기 좋은 곳으로</b><p>'+(td?'오늘 할 일: <em>'+td.t+'</em> — '+td.d:'11~21차시 동안 프로젝트 판을 한 칸씩 채워요.')+'</p><div class="pj-prog">'+ST.map(function(s){return '<i class="'+(done(s.id)?'ok':'')+(td&&s.id===td.id?' me':'')+'" title="'+s.t+'"></i>'}).join('')+'</div></div><button type="button" id="pjOpen1">'+IC+'프로젝트 판 열기</button>';
  var lab=document.querySelector('.hj-maplab');(lab||map).before(c);c.querySelector('#pjOpen1').onclick=open}
 var tools=document.querySelector('#lesson .tools');if(tools&&!document.getElementById('pjBtn')){var b=document.createElement('button');b.className='tool hj-ic';b.id='pjBtn';b.type='button';b.innerHTML=IC+'프로젝트 판';b.onclick=open;tools.insertBefore(b,tools.firstChild)}}
mount();setTimeout(mount,500);setTimeout(mount,1500);
var st=document.createElement('style');st.textContent=`
#pjCard{display:flex;align-items:center;gap:16px;justify-content:space-between;margin:12px 0 4px;padding:14px 18px;border-radius:16px;background:var(--hjs-soft,#EEF4FB);border:2px solid var(--hjs,#2B6FB8)}
#pjCard b{font-size:17px;color:var(--ink)}#pjCard p{margin:4px 0 6px;font-size:15px;color:var(--soft);line-height:1.5}#pjCard em{font-style:normal;font-weight:800;color:var(--hjs,#2B6FB8)}
#pjCard button{flex:none;display:inline-flex;align-items:center;gap:6px;background:var(--hjs,#2B6FB8);color:#fff;border:0;border-radius:999px;padding:10px 18px;font:700 16px/1 Pretendard,sans-serif;cursor:pointer}
.pj-prog{display:flex;gap:5px}.pj-prog i{width:26px;height:8px;border-radius:4px;background:#d8d2c8}.pj-prog i.ok{background:var(--hjs,#2B6FB8)}.pj-prog i.me{outline:2px solid var(--hjs,#2B6FB8);outline-offset:1px}
#pjOv{position:fixed;inset:0;z-index:9990;background:rgba(30,22,14,.5);display:flex;align-items:center;justify-content:center;padding:14px}#pjOv[hidden]{display:none!important}
.pj-box{background:var(--bg,#FFFCF8);width:min(1240px,100%);max-height:96vh;overflow:auto;border-radius:22px;padding:16px 18px;font-family:Pretendard,sans-serif;color:var(--ink,#2A221C)}
.pj-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;margin-bottom:10px}.pj-head b{font-size:14px;color:var(--soft)}.pj-head h2{margin:2px 0;font-size:26px}.pj-head p{margin:0;font-size:15px;color:var(--soft)}.pj-head em{font-style:normal;font-weight:800;color:var(--hjs,#2B6FB8)}
.pj-tools{display:flex;gap:6px;flex:none}.pj-tools button,.pj-foot button,.pj-ed,.pj-row button{border:1px solid var(--line,#EFE3D6);background:var(--paper,#fff);border-radius:999px;padding:7px 13px;font:700 14.5px/1 Pretendard,sans-serif;cursor:pointer;color:var(--ink)}
.pj-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.pj-sec{background:var(--paper,#fff);border:1px solid var(--line,#EFE3D6);border-radius:16px;padding:10px 14px;min-height:96px}
.pj-sec.me{border:3px solid var(--hjs,#2B6FB8);grid-column:1/-1;order:-1}.pj-sec.ok:not(.me){border-color:color-mix(in srgb,var(--hjs,#2B6FB8) 40%,#fff)}
.pj-st{display:flex;align-items:center;gap:8px}.pj-st h3{margin:0;font-size:17px;flex:1}.pj-today,.pj-ok{font-size:12.5px;font-weight:800;border-radius:999px;padding:2px 9px;color:#fff;background:var(--hjs,#2B6FB8)}.pj-ok{background:#2e9e5b}
.pj-d{margin:6px 0;font-size:15.5px;line-height:1.5;background:var(--hjs-soft,#EEF4FB);border-radius:10px;padding:8px 10px}
.pj-chips,.pj-pick,.pj-cr{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0}.pj-chip{display:inline-flex;align-items:center;gap:4px;background:#FFF6E3;border:1px solid #EBD9B0;border-radius:999px;padding:4px 10px;font-size:15px}
.pj-chip button{border:0;background:none;font-size:16px;cursor:pointer;color:#a33;padding:0 0 0 2px}.pj-pick button,.pj-cr button{border:1px dashed var(--line,#d9cbb8);background:var(--paper,#fff);border-radius:12px;padding:6px 10px;font:500 15px/1.2 Pretendard,sans-serif;cursor:pointer;color:var(--ink)}
.pj-pick button.on,.pj-cr button.on{border:2px solid var(--hjs,#2B6FB8);background:var(--hjs-soft,#EEF4FB);font-weight:700}
.pj-row{display:flex;gap:6px;margin:6px 0}.pj-row input,.pj-row select,.pj-box textarea{flex:1;min-width:0;border:1px solid var(--line,#EFE3D6);border-radius:10px;padding:8px 10px;font:500 15.5px/1.4 Pretendard,sans-serif;background:#fff;color:var(--ink)}.pj-box textarea{width:100%;box-sizing:border-box}
.pj-cats{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;margin:6px 0}.pj-cat{border-left:5px solid var(--c);background:#faf7f2;border-radius:10px;padding:6px 8px}.pj-cat b{font-size:14px;color:var(--c)}.pj-cat div{display:flex;flex-wrap:wrap;gap:4px;margin-top:4px}
.pj-li{display:flex;align-items:center;gap:6px;font-size:15.5px;padding:3px 0}.pj-li input{flex:1;min-width:0;border:1px solid var(--line,#EFE3D6);border-radius:8px;padding:5px 8px;font:500 15px Pretendard,sans-serif}
.pj-stars button,.pj-stars i{border:0;background:none;font-size:24px;color:#d8d2c8;cursor:pointer;font-style:normal;padding:0 1px}.pj-stars .on{color:#F2B705}
.pj-probs{display:grid;gap:6px;margin:6px 0}.pj-prob{display:grid;grid-template-columns:1fr 1fr .6fr auto;gap:8px;align-items:center;background:#faf7f2;border-radius:10px;padding:6px 10px;font-size:15px}.pj-prob small{display:block;font-size:12px;color:var(--soft)}.pj-prob button{border:0;background:none;color:#a33;font-size:18px;cursor:pointer}
.pj-row3 input:nth-child(3){flex:.6}.pj-town{display:flex;flex-wrap:wrap;gap:8px;min-height:56px;align-items:center;background:linear-gradient(#dff1fb,#e9f6df);border-radius:12px;padding:8px 12px;font-size:34px;margin:6px 0}.pj-town .pj-empty{font-size:15px}
.pj-say{font-size:17px;font-weight:700;margin:6px 0}.pj-letter{background:#FFF8EC;border-radius:12px;padding:8px 12px;margin:6px 0}.pj-letter p{margin:4px 0;font-size:16px;line-height:1.55}
.pj-empty{font-size:14.5px;color:var(--muted,#8a7f73)}.pj-hint{font-size:14.5px;color:var(--soft);margin:4px 0}.pj-foot{display:flex;gap:10px;align-items:center;margin-top:10px;font-size:13.5px;color:var(--soft)}
.pj-box.pres .pj-sec{min-height:0}.pj-box.pres .pj-head h2{font-size:32px}.pj-box.pres .pj-chip,.pj-box.pres .pj-li,.pj-box.pres .pj-prob{font-size:18px}
@media (max-width:820px){.pj-grid,.pj-cats{grid-template-columns:1fr}.pj-prob{grid-template-columns:1fr}#pjCard{flex-direction:column;align-items:stretch}}
@media print{html.pj-open body>*:not(#pjOv){display:none!important}#pjOv{position:static;background:none;padding:0}.pj-box{max-height:none;width:100%}.pj-tools,.pj-foot,.pj-ed{display:none!important}}`;
document.head.appendChild(st);
})();
