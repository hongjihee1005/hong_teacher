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
var W='https://ko.wikipedia.org/w/index.php?search=',Y='https://www.youtube.com/results?search_query=';
var now=new Date(),DAYS=['일','월','화','수','목','금','토'];
$('#tdDate').textContent=(now.getMonth()+1)+'월 '+now.getDate()+'일 '+DAYS[now.getDay()]+'요일';
var S={event:0,quote:0,art:0,music:0,book:0};
function esc(t){return String(t).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function draw(k){var el=document.querySelector('[data-k="'+k+'"] .td-body'),h='';
 if(k==='event'){var r=tdEvent(S.event),e=r.e,m=+e.d.slice(0,2),d=+e.d.slice(3);
  h='<div class="td-when">'+(r.today&&!S.event?'오늘':'가까운 날')+' · '+m+'월 '+d+'일'+(e.y?' ('+e.y+'년)':'')+'</div>'+
   '<div class="td-head"><span class="td-ico">'+e.i+'</span><b class="td-t">'+esc(e.t)+'</b></div><p class="td-s">'+esc(e.s)+'</p>'+
   '<a class="td-link" href="https://ko.wikipedia.org/wiki/'+m+'%EC%9B%94_'+d+'%EC%9D%BC" target="_blank" rel="noopener">위키백과에서 '+m+'월 '+d+'일의 역사 더 보기 ↗</a>'}
 else if(k==='quote'){var q=tdPick('quote',S.quote);h='<blockquote class="td-q">“'+esc(q.t)+'”</blockquote><div class="td-w">— '+esc(q.w)+'</div>'}
 else{var o=tdPick(k,S[k]),meta=o.a+(o.y?' · '+o.y:'');var link=k==='music'?Y+encodeURIComponent(o.a+' '+o.t.replace(/[「」\']/g,'')):W+encodeURIComponent(o.t.replace(/[「」\']/g,'')+' '+(k==='book'?'':o.a));
  h='<div class="td-head"><span class="td-ico">'+o.i+'</span><span><b class="td-t">'+esc(o.t)+'</b><span class="td-meta">'+esc(meta)+'</span></span></div><p class="td-s">'+esc(o.s)+'</p>'+
   '<a class="td-link" href="'+link+'" target="_blank" rel="noopener">'+(k==='music'?'유튜브에서 들어 보기 ↗':k==='art'?'그림 찾아보기 ↗':'책 더 알아보기 ↗')+'</a>'}
 el.innerHTML=h}
Object.keys(S).forEach(draw);
document.querySelectorAll('.td-more').forEach(function(b){b.addEventListener('click',function(){var k=b.closest('[data-k]').dataset.k;S[k]++;draw(k)})});
})();'''

CARDS = [('event','📅','오늘의 사건','역사 속 오늘, 무슨 일이 있었을까요?'),
         ('quote','💬','오늘의 명언','마음에 새겨 둘 한 줄'),
         ('art','🖼️','오늘의 명화','함께 감상해 볼 그림'),
         ('music','🎵','오늘의 명곡','함께 들어 볼 음악'),
         ('book','📚','오늘의 책','함께 읽어 볼 책')]
cards = '\n'.join(f'<section class="card td-card" id="{k}" data-k="{k}"><div class="td-top"><span class="tag">{i} {t}</span>'
                  f'<button class="td-more" type="button" aria-label="{t} 다른 것 보기">↻ 다른 것</button></div>'
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
{FOOT}
</main><script>{DATA}{PAGE_JS}</script></body></html>'''
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
