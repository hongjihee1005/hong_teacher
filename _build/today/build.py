#!/usr/bin/env python3
"""오늘의 교실 산책: today/index.html을 만들고, 첫 화면(index.html)의 '오늘의 한 줄' 띠를 넣습니다.
    python3 _build/today/build.py      (그다음 python3 _build/theme/apply_theme.py)"""
import pathlib, re
H = pathlib.Path(__file__).resolve().parent; R = H.parents[1]
DATA = (H/'data.js').read_text(encoding='utf-8')
ref = (R/'grade1/korean/sem1.html').read_text(encoding='utf-8')
FOOT = re.search(r'<footer class="hjfoot">.*?</footer>', ref, re.S).group(0)
CCSS = re.search(r'<style id="hj-contact-css">.*?</style>', ref, re.S).group(0)
FCSS = re.search(r'<style id="hjfoot-css">.*?</style>', ref, re.S).group(0)

PAGE_JS = r'''
(function(){var $=function(s){return document.querySelector(s)};
var W='https://ko.wikipedia.org/w/index.php?search=',Y='https://www.youtube.com/results?search_query=',G='https://artsandculture.google.com/search?q=';
var now=new Date(),DAYS=['일','월','화','수','목','금','토'];
$('#tdDate').textContent=(now.getMonth()+1)+'월 '+now.getDate()+'일 '+DAYS[now.getDay()]+'요일';
var S={event:0,quote:0,art:0,music:0,book:0};
function esc(t){return String(t).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function draw(k){var el=document.querySelector('[data-k="'+k+'"] .td-body'),h='';
 if(k==='event'){var r=tdEvent(S.event),e=r.e,m=+e.d.slice(0,2),d=+e.d.slice(3);
  h='<div class="td-when">'+(S.event?'다른 날':(r.today?'오늘':'곧 다가오는 날'))+' · '+m+'월 '+d+'일'+(e.y?' ('+e.y+'년)':'')+'</div>'+
   '<div class="td-head"><span class="td-ico">'+e.i+'</span><b class="td-t">'+esc(e.t)+'</b></div><p class="td-s">'+esc(e.s)+'</p>'+
   '<a class="td-link" href="https://ko.wikipedia.org/wiki/'+m+'%EC%9B%94_'+d+'%EC%9D%BC" target="_blank" rel="noopener">위키백과에서 '+m+'월 '+d+'일의 역사 더 보기 ↗</a>'}
 else if(k==='quote'){var q=tdPick('quote',S.quote);h='<blockquote class="td-q">“'+esc(q.t)+'”</blockquote><div class="td-w">— '+esc(q.w)+'</div>'+(q.x?'<dl class="td-why"><div><dt>이럴 때</dt><dd>'+esc(q.x)+'</dd></div></dl>':'')}
 else{var o=tdPick(k,S[k]),meta=o.a+(o.y?' · '+o.y:'');var clean=o.t.replace(/[「」\']/g,'');var link=k==='music'?Y+encodeURIComponent(o.a+' '+clean):k==='art'?G+encodeURIComponent(clean+' '+o.a):W+encodeURIComponent(clean+' 책');
  h='<div class="td-head"><span class="td-ico">'+o.i+'</span><span><b class="td-t">'+esc(o.t)+'</b><span class="td-meta">'+esc(meta)+'</span></span></div><p class="td-s">'+esc(o.s)+'</p>'+(o.r?'<dl class="td-why"><div><dt>추천 까닭</dt><dd>'+esc(o.r)+'</dd></div><div><dt>추천 학년</dt><dd>'+esc(o.g)+'</dd></div><div><dt>이럴 때</dt><dd>'+esc(o.w)+'</dd></div></dl>':'')+
   '<a class="td-link" href="'+link+'" target="_blank" rel="noopener">'+(k==='music'?'유튜브에서 들어 보기 ↗':k==='art'?'구글 아트 앤 컬처에서 보기 ↗':'책 더 알아보기 ↗')+'</a>'}
 el.innerHTML=h}
Object.keys(S).forEach(draw);
document.querySelectorAll('.td-next').forEach(function(b){b.addEventListener('click',function(){var k=b.closest('[data-k]').dataset.k;S[k]++;draw(k)})});
var DOC=false;
function L(n,h){if(DOC){var r='';for(var j=0;j<n;j++)r+='<tr><td height="'+Math.round((h||14)*3.78)+'" style="height:'+(h||14)+'mm;border-bottom:1px solid #777">&nbsp;</td></tr>';return '<table width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse">'+r+'</table>'}var o='';for(var i=0;i<n;i++)o+='<div class="ws-line" style="height:'+(h||14)+'mm"></div>';return o}
function box(h,t){return DOC?'<table width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;margin-top:8px"><tr><td height="'+Math.round(h*3.78)+'" style="height:'+h+'mm;border:1px dashed #888;vertical-align:top">&nbsp;</td></tr></table>':'<div class="ws-box" style="height:'+h+'mm">'+(t?'<span>'+t+'</span>':'')+'</div>'}
function Q(n,t,body){return '<div class="ws-q"><b>'+n+'. '+t+'</b>'+body+'</div>'}
function sheet(k){var h='',head,
 name='<div class="ws-name"><span>(<i style="width:9mm"></i>)학년</span><span>(<i style="width:9mm"></i>)반</span><span>(<i style="width:11mm"></i>)번</span><span>이름: (<i style="width:38mm"></i>)</span><span class="ws-date">'+(now.getMonth()+1)+'월 '+now.getDate()+'일</span></div>';
 if(k==='event'){var e=tdEvent(S.event).e,m=+e.d.slice(0,2),d=+e.d.slice(3);head='📅 역사 속 오늘 활동지';
  h='<div class="ws-card"><div class="ws-big">'+m+'월 '+d+'일 · '+esc(e.t)+(e.y?' ('+e.y+'년)':'')+'</div><p>'+esc(e.s)+'</p></div>'+
  Q(1,'이 날 있었던 일을 내 말로 짧게 정리해 보세요.',L(2))+Q(2,'이 일은 우리에게 왜 중요할까요?',L(2))+Q(3,'내가 그 자리에 있었다면 어떤 마음이었을까요? 그림이나 글로 나타내 보세요.',box(70))}
 else if(k==='quote'){var q=tdPick('quote',S.quote);head='💬 오늘의 명언 활동지';
  h='<div class="ws-card"><div class="ws-big">“'+esc(q.t)+'”</div><p>— '+esc(q.w)+'</p></div>'+
  Q(1,'명언을 바르게 따라 써 보세요.',L(3,16))+Q(2,'이 명언은 어떤 뜻일까요? 내 말로 바꾸어 써 보세요.',L(2))+Q(3,'이 명언과 어울리는 나의 경험을 써 보세요.',L(2))+Q(4,'오늘 내가 실천할 다짐 한 가지',L(1))}
 else if(k==='art'){var a=tdPick('art',S.art);head='🖼️ 명화 감상 활동지';
  h='<div class="ws-card"><div class="ws-big">「'+esc(a.t)+'」</div><p>'+esc(a.a)+' · '+esc(a.y)+'</p></div>'+
  Q(1,'그림에서 무엇이 보이나요? 보이는 것을 세 가지 써 보세요.',L(2))+Q(2,'어떤 색이 가장 많이 보이나요? 그 색은 어떤 느낌을 주나요?',L(1))+
  Q(3,'그림 속에 들어간다면 어떤 소리가 들리고, 어떤 냄새가 날까요?',L(1))+Q(4,'이 그림에 새 제목을 붙인다면?',L(1))+Q(5,'그림의 한 부분을 따라 그리거나, 이어서 그려 보세요.',box(48))}
 else if(k==='music'){var mu=tdPick('music',S.music);head='🎵 명곡 감상 활동지';
  h='<div class="ws-card"><div class="ws-big">'+esc(mu.t)+'</div><p>'+esc(mu.a)+'</p></div>'+
  Q(1,'음악을 들으며 느낌에 어울리는 낱말에 ○ 해 보세요.','<div class="ws-words">신나는 &nbsp; 잔잔한 &nbsp; 웅장한 &nbsp; 슬픈 &nbsp; 밝은 &nbsp; 무서운 &nbsp; 신비로운 &nbsp; 빠른 &nbsp; 느린 &nbsp; 포근한</div>')+
  Q(2,'어떤 악기 소리가 들렸나요?',L(1))+Q(3,'음악을 들으며 떠오른 장면을 그려 보세요.',box(78))+Q(4,'이 음악을 누구에게 들려주고 싶나요? 그 까닭은?',L(2))}
 else{var b=tdPick('book',S.book);head='📚 책 읽기 활동지';
  h='<div class="ws-card"><div class="ws-big">「'+esc(b.t)+'」</div><p>'+esc(b.a)+'</p></div>'+
  Q(1,'책 표지나 제목을 보고 어떤 이야기일지 짐작해 보세요.',L(2))+Q(2,'가장 기억에 남는 장면을 그리고, 한 줄로 설명해 보세요.',box(46)+L(1))+
  Q(3,'주인공에게 하고 싶은 말',L(2))+Q(4,'친구에게 추천하는 한 줄 · 별점','<div class="ws-stars">☆ ☆ ☆ ☆ ☆</div>'+L(1))}
 if(DOC){h=h.replace('<div class="ws-card">','<table width="100%" cellpadding="12" cellspacing="0" style="border:1.5pt solid #333;border-collapse:collapse;margin:6px 0 14px"><tr><td>').replace('<div class="ws-big">','<p style="margin:0;font-size:16pt;font-weight:bold">').replace('</div><p>','</p><p style="margin:4px 0 0">').replace('</p></div>','</p></td></tr></table>');return {head:head,name:name,h:h}}
 var el=document.getElementById('ws');el.innerHTML='<div class="ws-page"><div class="ws-head"><h2>'+head+'</h2><span>오늘의 교실 산책</span></div>'+name+h+'<div class="ws-foot">초등교사 홍지희 · hongjihee1005.github.io/hong_teacher</div></div>';
 hjPrint(el.innerHTML)}
/* 활동지만 담은 보이지 않는 인쇄 창에서 인쇄: 확장 프로그램이 페이지에 끼워 넣은 아이콘이 함께 찍히지 않게 */
function hjPrint(inner){inner=inner.replace(/\p{Extended_Pictographic}\uFE0F?\s*/gu,'');var f=document.createElement('iframe');f.setAttribute('aria-hidden','true');f.style.cssText='position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden';
 var css=[].map.call(document.querySelectorAll('style'),function(x){return x.outerHTML}).join('');
 f.srcdoc='<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8">'+css+'<style>html,body{background:#fff!important;margin:0}#ws{display:block!important}</style></head><body class="ws-printing"><div id="ws">'+inner+'</div></body></html>';
 f.onload=function(){setTimeout(function(){try{f.contentWindow.focus();f.contentWindow.print()}catch(e){document.body.classList.add('ws-printing');window.print()}setTimeout(function(){f.remove()},1500)},250)};document.body.appendChild(f)}
function docx(k){DOC=true;var r;try{r=sheet(k)}finally{DOC=false}
 var nm={event:'역사 속 오늘',quote:'명언',art:'명화 감상',music:'명곡 감상',book:'책 읽기'}[k];
 var css='@page Section1{size:21cm 29.7cm;margin:1.6cm 1.8cm}div.Section1{page:Section1}body{font-family:"맑은 고딕","Malgun Gothic",sans-serif;font-size:11pt;color:#111}'+
  'h2{font-size:20pt;margin:0 0 2mm;border-bottom:2pt solid #111;padding-bottom:2mm}.ws-name{margin:3mm 0 5mm;font-size:11pt}.ws-name i{display:inline-block}'+
  '.ws-card{border:1px solid #333;padding:3mm 5mm;margin-bottom:4mm}.ws-big{font-size:15pt;font-weight:bold}.ws-q{margin:5mm 0 2mm}.ws-q b{font-size:12pt}.ws-words,.ws-stars{font-size:14pt;margin:3mm 0;letter-spacing:1mm}.ft{margin-top:6mm;font-size:9pt;color:#666;text-align:right}';
 var name=r.name.replace(/<i[^>]*><\/i>/g,'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;').replace(/<span class="ws-date">/,'<span>&nbsp;&nbsp;&nbsp;&nbsp;');
 var html='<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>'+r.head+'</title><style>'+css+'</style></head><body><div class="Section1"><h2>'+r.head.replace(/^\S+\s/,'')+'</h2><div class="ws-name">'+name+'</div>'+r.h+'<p class="ft">초등교사 홍지희 · hongjihee1005.github.io/hong_teacher</p></div></body></html>';
 var blob=new Blob(['﻿',html],{type:'application/msword'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='오늘의교실산책_'+nm+'_'+(now.getMonth()+1)+'월'+now.getDate()+'일.doc';document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},2000)}
document.querySelectorAll('.td-doc').forEach(function(b){b.addEventListener('click',function(){docx(b.closest('[data-k]').dataset.k)})});
window.addEventListener('afterprint',function(){document.body.classList.remove('ws-printing')});
document.querySelectorAll('.td-print').forEach(function(b){b.addEventListener('click',function(){sheet(b.closest('[data-k]').dataset.k)})});
})();'''

CARDS = [('event','📅','오늘의 사건','역사 속 오늘, 무슨 일이 있었을까요?'),
         ('quote','💬','오늘의 명언','마음에 새겨 둘 한 줄'),
         ('art','🖼️','오늘의 명화','함께 감상해 볼 그림'),
         ('music','🎵','오늘의 명곡','함께 들어 볼 음악'),
         ('book','📚','오늘의 책','함께 읽어 볼 책')]
cards = '\n'.join(f'<section class="card td-card" id="{k}" data-k="{k}"><div class="td-top"><span class="tag">{i} {t}</span>'
                  f'<span class="td-btns"><button class="td-more td-print" type="button" aria-label="{t} 활동지 인쇄">🖨️ 인쇄</button><button class="td-more td-next" type="button" aria-label="{t} 다른 것 보기">↻ 다른 것</button></span></div>'
                  f'<p class="td-hint">{h}</p><div class="td-body"><noscript>자바스크립트를 켜면 보여요.</noscript></div></section>' for k,i,t,h in CARDS)
page = f'''<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>오늘의 교실 산책 · 초등교사 홍지희</title>
<style>:root{{--bg:#FFFCF8;--paper:#fff;--ink:#2A221C;--soft:#5C5047;--line:#F0E5D9;--acc:#EE9566;box-sizing:border-box}}
*,*::before,*::after{{box-sizing:inherit}}body{{margin:0}}main{{max-width:1120px;margin:0 auto}}
.grid{{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}}.card{{display:flex;flex-direction:column}}
@media (max-width:760px){{.grid{{grid-template-columns:1fr}}}}</style>{FCSS}{CCSS}</head><body><main>
<nav class="crumb"><a class="back" href="../index.html">🏠 초등교사 홍지희</a></nav>
<h1>🌟 오늘의 교실 산책</h1>
<p class="sub"><b id="tdDate"></b> · 날마다 새로운 이야기, 그림, 음악, 책이 찾아와요. <b>↻ 다른 것</b>을 누르면 다른 것도 볼 수 있어요.</p>
<div class="grid td-grid">
{cards}
</div>
<p class="td-note">ℹ️ 추천 까닭·학년·어울리는 때는 작품의 특징을 보고 수업에 쓰기 좋게 정리한 <b>참고 의견</b>이에요. 교과서 수록이나 공식 권장 목록을 뜻하지는 않아요. 학급 상황에 맞게 골라 쓰세요.</p>
{FOOT}
</main><div id="ws" aria-hidden="true"></div><script>{DATA}{PAGE_JS}</script></body></html>'''
(R/'today').mkdir(exist_ok=True); (R/'today/index.html').write_text(page, encoding='utf-8')

# 첫 화면 띠
HOME_JS = r'''(function(){var q=tdPick('quote'),r=tdEvent(),a=tdPick('art'),m=tdPick('music'),b=tdPick('book');
var $=function(s){return document.getElementById(s)};
$('hjtq').textContent='“'+q.t+'” — '+q.w;
$('hjte').textContent=(r.today?'오늘 · ':'곧 · ')+r.e.t;$('hjta').textContent=a.t;$('hjtm').textContent=m.t.replace(/[「」]/g,'');$('hjtb').textContent=b.t;})();'''
strip = ('<!--hj-today--><p class="sub">오늘도 한 걸음씩, 함께 자라는 배움터예요.</p>'
 '<div class="today-strip"><a class="ts-main" href="today/index.html"><span class="ts-lab">🌟 오늘의 한 줄</span>'
 '<span class="ts-q" id="hjtq">“천 리 길도 한 걸음부터.” — 노자</span><span class="ts-go">오늘의 교실 산책 →</span></a>'
 '<div class="ts-chips">'
 '<a class="ts-chip" href="today/index.html#event"><i>📅</i><span><small>오늘의 사건</small><b id="hjte">역사 속 오늘</b></span></a>'
 '<a class="ts-chip" href="today/index.html#art"><i>🖼️</i><span><small>명화</small><b id="hjta">오늘의 그림</b></span></a>'
 '<a class="ts-chip" href="today/index.html#music"><i>🎵</i><span><small>명곡</small><b id="hjtm">오늘의 음악</b></span></a>'
 '<a class="ts-chip" href="today/index.html#book"><i>📚</i><span><small>좋은 책</small><b id="hjtb">오늘의 책</b></span></a>'
 f'</div></div><script>{DATA}{HOME_JS}</script><!--/hj-today-->')
h = (R/'index.html').read_text(encoding='utf-8')
if '<!--hj-today-->' in h:
    h = re.sub(r'<!--hj-today-->.*?<!--/hj-today-->', lambda m: strip, h, flags=re.S)
else:
    h = re.sub(r'<p class="sub">[^<]*</p>', lambda m: strip, h, count=1)
(R/'index.html').write_text(h, encoding='utf-8')
print('today/index.html, index.html 완료')
