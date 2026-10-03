#!/usr/bin/env python3
"""사고전략 메뉴(thinking/)를 만듭니다.

    python3 _build/thinking/build.py
    python3 _build/theme/apply_theme.py && python3 _build/theme/apply_content_theme.py

내용은 data_routines.py(사고전략 23개), data_more.py(탐구 5단계·교과 10개·첫 안내)에 있습니다.
thinking/ 안의 HTML은 직접 고치지 말고 여기서 다시 만드세요.
"""
import pathlib, html, json, re, sys
HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[1]
OUT = ROOT / 'thinking'
sys.path.insert(0, str(HERE))
from data_routines import R, BY_ID, MTV, TOOLBOX
from data_more import STAGES, SUBJ, GUIDE

E = html.escape
rd = lambda n: (HERE / n).read_text(encoding='utf-8')
FOOT, HOME, TOLIST = rd('foot.html'), rd('home.html'), rd('tolist.html')
FOOTCSS = f'<style id="hjfoot-css">{rd("hjfoot-css.css")}</style><style id="hj-contact-css">{rd("hj-contact-css.css")}</style>'
ST = {s['n']: s for s in STAGES}
SRC_LINE = ('Project Zero, Harvard Graduate School of Education — <a href="{u}" target="_blank" rel="noopener">PZ Thinking Routine Toolbox</a> · '
            'Ritchhart, R., Church, M., &amp; Morrison, K. (2011). <i>Making Thinking Visible</i>. Jossey-Bass.')
LICENSE = ('Project Zero의 사고 루틴 원문 자료는 CC BY-NC-ND 4.0(출처 표시·비영리·변경 금지) 라이선스입니다. '
           '그래서 이 페이지는 원문을 번역해 옮기지 않고, 사고전략의 생각을 바탕으로 우리 교실에 맞게 새로 쓴 안내와 활동지입니다. 원문은 위 링크에서 보세요.')
STAGE_NOTE = ('탐구 5단계 구분은 Project Zero의 공식 분류가 아닙니다. 『Making Thinking Visible』(2011)이 사고 루틴을 '
              '“아이디어 소개·탐색 / 종합·정리 / 더 깊이 파고들기” 세 묶음으로 나눈 것을 바탕으로, 초등 탐구 수업 흐름에 맞게 다시 나누었습니다.')
rfile = lambda x: f'r-{x["id"]}.html'

# ───────────────────────── 공통: 자료(내용) 페이지 ─────────────────────────
CSS = r"""
:root{--bg:#FFFCF8;--paper:#fff;--ink:#2A221C;--soft:#5C5047;--muted:#8A7B6E;--line:#EADFD2;--acc:#8A63D2;--accs:color-mix(in srgb,var(--acc) 14%,var(--paper));--acci:color-mix(in srgb,var(--acc) 75%,var(--ink));
 --display:'Jua','Apple SD Gothic Neo','Malgun Gothic',sans-serif;--body:'Gowun Dodum','Apple SD Gothic Neo','Malgun Gothic',sans-serif;box-sizing:border-box}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#221E1A;--paper:#2B2621;--ink:#F2EBE3;--soft:#C2B5A9;--muted:#9C8F84;--line:#4C4239}}
:root[data-theme="dark"]{--bg:#221E1A;--paper:#2B2621;--ink:#F2EBE3;--soft:#C2B5A9;--muted:#9C8F84;--line:#4C4239}
*,*::before,*::after{box-sizing:inherit}
body{margin:0;background:var(--bg);color:var(--ink);font-family:var(--body);font-size:clamp(17px,1.6vw,20px);line-height:1.7;word-break:keep-all;overflow-wrap:break-word}
main.tk{max-width:1080px;margin:0 auto;padding:clamp(14px,3vw,36px) clamp(16px,3vw,36px) 80px}
h1,h2,h3{font-family:var(--display);font-weight:700;letter-spacing:-.02em;line-height:1.3;text-wrap:balance}
p,li{text-wrap:pretty}
a{color:var(--acci)}
.tk-hd{border-radius:22px;background:var(--accs);padding:clamp(18px,3vw,30px);margin:6px 0 18px}
.tk-kicker{margin:0;font-weight:700;color:var(--acci);font-size:.9em}
.tk-hd h1{overflow-wrap:anywhere;margin:6px 0 2px;font-size:clamp(28px,3.6vw,42px);display:flex;align-items:center;gap:12px;flex-wrap:wrap}
.tk-en{margin:0;color:var(--soft);font-size:.95em}
.tk-one{margin:10px 0 0;font-size:1.05em}
.tk-tabs{display:flex;flex-wrap:wrap;gap:8px;position:sticky;top:0;z-index:5;background:color-mix(in srgb,var(--bg) 94%,transparent);padding:8px 0;margin-bottom:6px}
.tk-tabs button{font:inherit;font-family:var(--display);font-weight:700;font-size:clamp(17px,1.7vw,20px);color:var(--ink);background:var(--paper);border:1.5px solid var(--line);border-radius:14px;padding:9px 16px;min-height:48px;cursor:pointer}
.tk-tabs button[aria-selected="true"]{background:var(--acc);border-color:var(--acc);color:#fff}
.tk-pane{display:none;scroll-margin-top:76px}.tk-pane.on{display:block}
.tk-pane>h2{font-size:clamp(23px,2.6vw,30px);margin:26px 0 8px}
.sec{background:var(--paper);border:1.5px solid var(--line);border-radius:18px;padding:16px 20px;margin:14px 0}
.sec h3{margin:0 0 8px;font-size:clamp(19px,2vw,23px);color:var(--acci)}
.sec ul,.sec ol{margin:0;padding-left:1.3em}
.sec li{margin:4px 0}
.kv{display:grid;grid-template-columns:150px 1fr;gap:6px 14px;margin:0}
.kv dt{font-weight:700;color:var(--acci)}.kv dd{margin:0}
@media (max-width:620px){.tk-hd h1,.kcard h3,.rlink b,.ws-top h3{word-break:normal!important;overflow-wrap:anywhere!important}.kv{grid-template-columns:1fr}.kv dd{margin-bottom:6px}}
.steps{list-style:none;padding:0;margin:0;display:grid;gap:10px;counter-reset:s}
.steps>li{counter-increment:s;position:relative;background:var(--paper);border:1.5px solid var(--line);border-radius:16px;padding:14px 18px 14px 64px}
.steps>li::before{content:counter(s);position:absolute;left:16px;top:14px;width:34px;height:34px;border-radius:50%;background:var(--acc);color:#fff;font-family:var(--display);font-weight:700;display:grid;place-items:center}
.steps b{font-family:var(--display);font-size:1.08em}
.steps .q{display:block;font-weight:700;margin-top:2px}
.steps .note{display:block;color:var(--soft);font-size:.94em;margin-top:4px}
.tbl{width:100%;border-collapse:collapse;background:var(--paper);border-radius:14px;overflow:hidden}
.tbl th,.tbl td{border:1.5px solid var(--line);padding:9px 12px;text-align:left;vertical-align:top}
.tbl th{background:var(--accs);font-family:var(--display)}
.tblw{overflow-x:auto;margin:10px 0}
.chip{display:inline-block;font-weight:700;font-size:.82em;border-radius:999px;padding:1px 10px;background:color-mix(in srgb,var(--c,var(--acc)) 16%,var(--paper));color:color-mix(in srgb,var(--c,var(--acc)) 78%,var(--ink));white-space:nowrap}
.rlinks{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,260px),1fr));gap:10px;margin-top:8px}
.rlink{display:flex;flex-direction:column;gap:2px;text-decoration:none;color:var(--ink);background:var(--paper);border:1.5px solid var(--line);border-radius:14px;padding:12px 14px}
.rlink:hover{border-color:var(--acc)}
.rlink b{font-family:var(--display);overflow-wrap:anywhere}.rlink small{color:var(--soft);line-height:1.5}
.flow{list-style:none;padding:0;margin:0;border-left:4px solid var(--acc);}
.flow li{position:relative;padding:6px 0 10px 18px}
.flow li::before{content:"";position:absolute;left:-9px;top:14px;width:14px;height:14px;border-radius:50%;background:var(--paper);border:3px solid var(--acc)}
.flow b{font-family:var(--display);color:var(--acci)}
.src{color:var(--soft);font-size:.86em;line-height:1.7;border-top:1.5px dashed var(--line);margin-top:30px;padding-top:14px}
.src p{margin:4px 0}
.btns{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0}
.btn{font:inherit;font-family:var(--display);font-weight:700;font-size:17px;border:1.5px solid var(--line);background:var(--paper);color:var(--ink);border-radius:999px;padding:8px 16px;min-height:44px;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;gap:6px}
.btn.main{background:var(--acc);border-color:var(--acc);color:#fff}
.end{display:flex;justify-content:center;margin-top:30px}
.tolist{display:none;align-items:center;gap:8px;font-family:var(--display);font-size:clamp(18px,1.8vw,22px);text-decoration:none;color:inherit;border:1.5px solid var(--line);background:var(--paper);border-radius:999px;padding:8px 22px}
.tolist.on{display:inline-flex}
/* 학생용 */
.kid{font-size:clamp(19px,2vw,25px)}
.kid .bubble{background:var(--accs);border-radius:22px;padding:16px 22px;font-size:1.08em;margin:12px 0}
.kcards{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,250px),1fr));gap:14px;margin:12px 0}
.kcard{background:var(--paper);border:2px solid var(--line);border-top:10px solid var(--acc);border-radius:20px;padding:16px 18px}
.kcard .no{font-family:var(--display);font-weight:700;color:var(--acci);font-size:.85em}
.kcard h3{margin:2px 0 6px;font-size:1.3em;overflow-wrap:anywhere}
.kcard .kq{font-weight:700;margin:0 0 8px}
.stem{display:block;background:var(--bg);border:1.5px dashed var(--line);border-radius:12px;padding:6px 12px;margin:6px 0;font-size:.9em}
.kex{background:var(--paper);border:2px solid var(--line);border-radius:18px;padding:14px 18px}
.kcheck{list-style:none;padding:0;margin:0}
.kcheck li{margin:6px 0}
.kcheck button{font:inherit;display:flex;gap:10px;align-items:flex-start;text-align:left;width:100%;background:var(--paper);border:1.5px solid var(--line);border-radius:14px;padding:10px 14px;color:var(--ink);cursor:pointer}
.kcheck button::before{content:"";flex:none;width:26px;height:26px;margin-top:3px;border-radius:8px;border:2.5px solid var(--acc)}
.kcheck button[aria-pressed="true"]::before{background:var(--acc) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 12.5l4.5 4.5L19 7'/%3E%3C/svg%3E") center/80% no-repeat}
.kid:fullscreen{background:var(--bg);overflow:auto;padding:30px 40px;font-size:clamp(22px,2.4vw,32px)}
/* 활동지 */
.ws{background:#fff;color:#2A221C;border:1.5px solid var(--line);border-radius:16px;padding:22px 24px;max-width:860px;margin:10px auto;--wl:#D9CEC2}
.ws-top{display:flex;justify-content:space-between;align-items:flex-end;gap:10px;flex-wrap:wrap;border-bottom:3px solid var(--acc);padding-bottom:8px;margin-bottom:12px}
.ws-top h3{margin:0;font-size:24px;color:#2A221C}
.ws-top small{color:#6F6156;font-size:14px}
.ws-who{display:flex;gap:10px;flex-wrap:wrap;font-size:15px}
.ws-who span{display:inline-flex;align-items:flex-end;gap:4px}
.ws-who i{font-style:normal;display:inline-block;min-width:44px;border-bottom:1.5px solid #9C8F84;min-height:1.3em;outline:0}
.ws-who i.w{min-width:110px}
.ws-blk{margin:10px 0}
.ws-grid{display:grid;gap:10px}
.ws-box{border:2px solid #CFC3B6;border-radius:12px;padding:8px 10px;break-inside:avoid;display:flex;flex-direction:column}
.ws-lab{font-family:var(--display);font-weight:700;font-size:17px}
.ws-hint{color:#8A7B6E;font-size:13px;line-height:1.4}
.fill{flex:1;outline:0;font-size:16px;line-height:30px;background:repeating-linear-gradient(to bottom,transparent 0 29px,var(--wl) 29px 30px);min-height:30px;padding:0 2px;white-space:pre-wrap;color:#2A221C}
.fill:focus{background-color:#FFF8EE}
.ws-row{display:flex;gap:10px;align-items:flex-start}
.ws-row .ws-lab{flex:none}
.ws table{width:100%;border-collapse:collapse}
.ws th,.ws td{border:2px solid #CFC3B6;padding:6px 8px;text-align:left;vertical-align:top;font-size:15px}
.ws th{background:#F7F0E8;font-family:var(--display)}
.ws td .fill{min-height:60px}
.compass{display:grid;grid-template-columns:1fr 1fr;gap:10px;position:relative}
.compass .ws-box{min-height:170px}
.compass .mid{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:64px;height:64px;border-radius:50%;background:#fff;border:2.5px solid #CFC3B6;display:grid;place-items:center;font-family:var(--display);font-weight:700;font-size:13px;text-align:center;line-height:1.2}
.rope{display:grid;grid-template-columns:1fr auto 1fr;gap:10px;align-items:center}
.rope .ws-box{min-height:72px}
.rope svg{width:min(200px,24vw);height:auto}
.rope2{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:10px}
.rope2 .ws-box{min-height:200px}
.circ{position:relative;width:min(100%,560px);aspect-ratio:1/0.82;margin:0 auto}
.circ::before{content:"";position:absolute;left:12%;right:12%;top:8%;bottom:8%;border:2.5px dashed #CFC3B6;border-radius:50%}
.circ .ws-box{position:absolute;width:31%;min-height:70px;background:#fff;padding:5px 8px}
.circ .ws-box .fill{min-height:45px}
.circ .c0{left:34.5%;top:36%;border-color:var(--acc)}
.ten{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.ten ol{margin:4px 0 0;padding-left:1.8em}
.ten li{font-size:14px;color:#6F6156}
.ten li .fill{min-height:26px;line-height:26px;background:repeating-linear-gradient(to bottom,transparent 0 25px,var(--wl) 25px 26px)}
.news{border:3px double #2A221C;border-radius:4px;padding:8px 12px}
.news .mast{display:flex;justify-content:space-between;border-bottom:2px solid #2A221C;font-family:var(--display);font-weight:700;font-size:15px;padding-bottom:4px}
.news .fill{font-family:var(--display);font-size:26px;line-height:44px;background:repeating-linear-gradient(to bottom,transparent 0 43px,var(--wl) 43px 44px);min-height:88px;margin-top:6px}
.bridge{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.bridge .ws-box .sub{font-family:var(--display);font-weight:700;font-size:14px;color:#6F6156;margin-top:4px}
.map{min-height:360px;position:relative}
.map::after{content:"";position:absolute;left:50%;top:55%;width:120px;height:70px;transform:translate(-50%,-50%);border:2.5px dashed #CFC3B6;border-radius:50%;pointer-events:none}
.map .fill{background:none}
.zoom{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.zoom .frame{height:70px;border:2px dashed #CFC3B6;border-radius:8px;display:grid;place-items:center;color:#9C8F84;font-size:13px;margin:4px 0}
.chk td:not(:first-child){text-align:center;width:16%}
.chk button{font:inherit;width:30px;height:30px;border-radius:50%;border:2px solid #CFC3B6;background:#fff;cursor:pointer}
.chk button[aria-pressed="true"]{background:var(--acc);border-color:var(--acc)}
.ws-foot{display:flex;justify-content:space-between;color:#9C8F84;font-size:12px;margin-top:10px}
.ws-note{color:var(--soft);font-size:.9em;text-align:center}
@media (max-width:700px){.ws{padding:14px}.ws-grid{grid-template-columns:1fr!important}.zoom,.bridge,.rope2,.ten{grid-template-columns:1fr}.rope{grid-template-columns:1fr}.rope svg{justify-self:center;transform:rotate(90deg);width:90px}.circ{aspect-ratio:auto;display:grid;gap:8px}.circ::before{display:none}.circ .ws-box{position:static;width:auto}}
@media print{
 @page{size:A4;margin:11mm}
 html,body{background:#fff!important;color:#000!important;font-size:12pt}
 main.tk{max-width:none;padding:0}
 .tk-tabs,.btns,.end,.hjfoot,.hj-navbar,.hj-nav,#hj-home,#hj-player,.src .noprint,.ws-note{display:none!important}
 body[data-print] .tk-pane{display:none!important}
 body[data-print="teacher"] #teacher,body[data-print="student"] #student,body[data-print="sheet"] #sheet{display:block!important}
 body[data-print="sheet"] .tk-hd,body[data-print="sheet"] .src{display:none!important}
 .ws{border:0;padding:0;margin:0;max-width:none;zoom:.9}
 .ws,.ws *{-webkit-print-color-adjust:exact;print-color-adjust:exact}
 #sheet>h2,#teacher>h2,#student h2:first-child{display:none!important}
 .sec,.kcard,.steps>li{break-inside:avoid}
 .fill:focus{background-color:transparent}
}
"""

JS = r"""
(function(){
var tabs=[].slice.call(document.querySelectorAll('.tk-tabs button')),ids=tabs.map(function(t){return t.dataset.p});
function show(id,sc){if(ids.indexOf(id)<0)id=ids[0];tabs.forEach(function(t){var on=t.dataset.p===id;t.setAttribute('aria-selected',on);document.getElementById(t.dataset.p).classList.toggle('on',on)});
 if(sc){var n=document.querySelector('.tk-tabs');window.scrollTo({top:n.offsetTop-4,behavior:'smooth'})}}
tabs.forEach(function(t){t.addEventListener('click',function(){history.replaceState(null,'','#'+t.dataset.p);show(t.dataset.p,true)})});
addEventListener('hashchange',function(){show(location.hash.slice(1))});show(location.hash.slice(1));
document.querySelectorAll('[data-go]').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();history.replaceState(null,'','#'+a.dataset.go);show(a.dataset.go,true)})});
var KEY='hj-think-v1:'+location.pathname.replace(/^.*\/thinking\//,''),data={};
try{data=JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch(e){}
function save(){try{localStorage.setItem(KEY,JSON.stringify(data))}catch(e){}}
var fills=[].slice.call(document.querySelectorAll('[data-k]'));
fills.forEach(function(f){var k=f.dataset.k;
 if(f.tagName==='BUTTON'){if(data[k])f.setAttribute('aria-pressed','true');f.addEventListener('click',function(){var on=f.getAttribute('aria-pressed')!=='true';
   if(f.dataset.grp){document.querySelectorAll('[data-grp="'+f.dataset.grp+'"]').forEach(function(o){o.setAttribute('aria-pressed','false');delete data[o.dataset.k]})}
   f.setAttribute('aria-pressed',on);if(on)data[k]=1;else delete data[k];save()});return}
 if(data[k])f.innerText=data[k];var tm;f.addEventListener('input',function(){clearTimeout(tm);tm=setTimeout(function(){var v=f.innerText.replace(/\n$/,'');if(v.trim())data[k]=v;else delete data[k];save()},300)})});
function pr(p){document.body.dataset.print=p;window.print()}
addEventListener('afterprint',function(){delete document.body.dataset.print});
document.querySelectorAll('[data-print]').forEach(function(b){b.addEventListener('click',function(){var p=b.dataset.print;
 if(b.dataset.blank){var keep=fills.map(function(f){return f.tagName==='BUTTON'?f.getAttribute('aria-pressed'):f.innerText});
  fills.forEach(function(f){if(f.tagName==='BUTTON')f.setAttribute('aria-pressed','false');else f.innerText=''});
  var back=function(){fills.forEach(function(f,i){if(f.tagName==='BUTTON')f.setAttribute('aria-pressed',keep[i]||'false');else f.innerText=keep[i]});removeEventListener('afterprint',back)};
  addEventListener('afterprint',back);}
 pr(p)})});
var clr=document.getElementById('wsClear');if(clr)clr.addEventListener('click',function(){if(!confirm('이 활동지에 쓴 내용을 모두 지울까요?'))return;
 fills.forEach(function(f){if(f.tagName==='BUTTON')f.setAttribute('aria-pressed','false');else if(f.closest('#sheet'))f.innerText=''});
 Object.keys(data).forEach(function(k){if(/^s/.test(k))delete data[k]});save()});
var fs=document.getElementById('kidFull');if(fs){if(!document.documentElement.requestFullscreen)fs.hidden=true;fs.addEventListener('click',function(){var k=document.getElementById('student');if(document.fullscreenElement)document.exitFullscreen();else k.requestFullscreen()})}
})();
"""

def doc(title, acc, body, depth):
    home = HOME.replace('href="../../../index.html"', f'href="{"../" * depth}index.html"')
    return (f'<!DOCTYPE html>\n<html lang="ko"><head><meta charset="UTF-8">\n'
            f'<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
            f'<title>{E(title)}</title>\n<link href="https://fonts.googleapis.com/css2?family=Jua&family=Gowun+Dodum&display=swap" rel="stylesheet">\n'
            f'<style>{CSS}</style>{FOOTCSS}<style>:root{{--acc:{acc}}}</style></head><body>\n<main class="tk">\n{body}\n'
            f'<div class="end"><a class="tolist" href="index.html">📋 자료 목록으로</a></div>\n{FOOT}\n</main>\n'
            f'<script>{JS}</script>\n{TOLIST}\n{home}\n</body></html>\n')

def tabs(extra=''):
    return ('<nav class="tk-tabs" role="tablist" aria-label="자료 고르기">'
            '<button type="button" role="tab" data-p="teacher">🧑‍🏫 교사용 안내</button>'
            '<button type="button" role="tab" data-p="student">🌱 학생용 안내</button>'
            '<button type="button" role="tab" data-p="sheet">🖨️ 활동지</button></nav>')

def lst(items, tag='ul'):
    return f'<{tag}>' + ''.join(f'<li>{x}</li>' for x in items) + f'</{tag}>'

def sec(title, inner):
    return f'<div class="sec"><h3>{title}</h3>{inner}</div>'

def stchip(n):
    s = ST[n]
    return f'<span class="chip" style="--c:{s["acc"]}">{n}단계 {E(s["name"])}</span>'

def src(url=TOOLBOX, note=''):
    extra = f'<p>{note}</p>' if note else ''
    return (f'<div class="src"><p><b>출처</b> · {SRC_LINE.format(u=url)}</p>{extra}<p>{LICENSE}</p>'
            '<p>재구성·글: 초등교사 홍지희</p></div>')

def rlink(x, base='', hash_='', sub=None):
    return (f'<a class="rlink" href="{base}{rfile(x)}{hash_}"><b>{x["ico"]} {E(x["ko"])}</b>'
            f'<small>{E(x["en"])} · {E(sub or x["one"])}</small></a>')

# ── 활동지 ──
class Sheet:
    def __init__(s): s.n = 0
    def k(s): s.n += 1; return f's{s.n}'
    def fill(s, h=3, cls='fill'):
        return f'<div class="{cls}" contenteditable="true" data-k="{s.k()}" style="min-height:{h * 30}px" role="textbox" aria-multiline="true"></div>'
    def box(s, lab, hint='', h=4, cls='ws-box'):
        hint = f'<span class="ws-hint">{E(hint)}</span>' if hint else ''
        return f'<div class="{cls}"><span class="ws-lab">{E(lab)}</span>{hint}{s.fill(h)}</div>'
    def blk(s, b):
        t = b[0]
        if t == 'grid':
            return (f'<div class="ws-grid" style="grid-template-columns:repeat({b[1]},minmax(0,1fr))">'
                    + ''.join(s.box(*x) for x in b[2]) + '</div>')
        if t == 'lines':
            if b[2] == 1:
                return f'<div class="ws-row"><span class="ws-lab">{E(b[1])}</span>{s.fill(1)}</div>'
            return s.box(b[1], '', b[2])
        if t == 'table':
            head = ''.join(f'<th>{E(h)}</th>' for h in b[1])
            rows = ''.join('<tr>' + ''.join(f'<td>{s.fill(2)}</td>' for _ in b[1]) + '</tr>' for _ in range(b[2]))
            return f'<table><thead><tr>{head}</tr></thead><tbody>{rows}</tbody></table>'
        if t == 'compass':
            return ('<div class="compass">' + s.box('N 더 알고 싶어요', '결정하려면 무엇을 더 알아야 할까?', 5)
                    + s.box('E 신나요', '좋은 점, 기대되는 점', 5) + s.box('W 걱정돼요', '걱정되거나 불편한 점', 5)
                    + s.box('S 내 생각·제안', '지금 내 입장은? 어떻게 하면 좋을까?', 5) + '<span class="mid">N<br>W ✛ E<br>S</span></div>')
        if t == 'rope':
            rope = ('<svg viewBox="0 0 200 40" aria-hidden="true"><path d="M4 20 Q50 8 100 20 T196 20" fill="none" stroke="#B08850" stroke-width="7" stroke-linecap="round"/>'
                    '<path d="M100 6v28" stroke="#C94A3B" stroke-width="3"/></svg>')
            return (f'<div class="rope">{s.box("◀ 한쪽 입장", "", 2)}{rope}{s.box("다른 쪽 입장 ▶", "", 2)}</div>'
                    f'<div class="rope2">{s.box("◀ 이쪽을 당기는 까닭", "센 까닭일수록 줄 끝(바깥)쪽에!", 6)}{s.box("이쪽을 당기는 까닭 ▶", "센 까닭일수록 줄 끝(바깥)쪽에!", 6)}</div>')
        if t == 'circle':
            pos = [(34.5, 0), (66, 14), (66, 60), (34.5, 74), (3, 60), (3, 14)]
            boxes = ''.join(f'<div class="ws-box" style="left:{x}%;top:{y}%"><span class="ws-hint">관점 {i + 1}</span>{s.fill(1)}</div>' for i, (x, y) in enumerate(pos))
            return f'<div class="circ"><div class="ws-box c0"><span class="ws-lab">가운데: 일(사건)</span>{s.fill(1)}</div>{boxes}</div>'
        if t == 'ten':
            col = lambda lab: (f'<div class="ws-box"><span class="ws-lab">{lab}</span><ol>'
                               + ''.join(f'<li>{s.fill(1)}</li>' for _ in range(10)) + '</ol></div>')
            return f'<div class="ten">{col("👀 첫 번째 보기 (10개)")}{col("👀 두 번째 보기 (새로 10개)")}</div>'
        if t == 'news':
            return f'<div class="news"><div class="mast"><span>우리 반 생각 신문</span><span>____년 __월 __일</span></div>{s.fill(2)}</div>'
        if t == 'bridge':
            def side(lab):
                return (f'<div class="ws-box"><span class="ws-lab">{lab}</span>'
                        f'<span class="sub">생각·낱말 3</span>{s.fill(3)}<span class="sub">질문 2</span>{s.fill(2)}'
                        f'<span class="sub">비유 1 (~은 ~ 같다)</span>{s.fill(1)}</div>')
            return (f'<div class="bridge">{side("① 처음 3-2-1 (배우기 전)")}{side("② 나중 3-2-1 (배운 뒤)")}</div>'
                    f'<div style="margin-top:10px">{s.box("🌉 다리 놓기", "처음 생각과 지금 생각은 어떻게 이어지나요? 무엇이 바뀌었나요?", 3)}</div>')
        if t == 'map':
            h = b[2] if len(b) > 2 else 11
            return f'<div class="ws-box map" style="min-height:{h * 30 + 30}px"><span class="ws-hint">{E(b[1])}</span>{s.fill(h)}</div>'
        if t == 'zoom':
            fr = lambda lab, h: (f'<div class="ws-box"><span class="ws-lab">{lab}</span><span class="frame">{h}</span>'
                                 f'<span class="ws-hint">보이는 것</span>{s.fill(2)}<span class="ws-hint">짐작 (바뀌었나요? 왜?)</span>{s.fill(3)}</div>')
            return f'<div class="zoom">{fr("① 첫 조각", "작은 부분")}{fr("② 조금 더", "더 넓게")}{fr("③ 전체", "전체 그림")}</div>'
        if t == 'check':
            rows = ''
            for i, item in enumerate(b[1]):
                g = s.k()
                rows += f'<tr><td>{E(item)}</td>' + ''.join(
                    f'<td><button type="button" data-k="{g}{j}" data-grp="{g}" aria-pressed="false" aria-label="{E(item)} — {lab}"></button></td>'
                    for j, lab in enumerate(['잘했어요', '조금', '다음엔'])) + '</tr>'
            return f'<table class="chk"><thead><tr><th>내 생각 습관 점검</th><th>잘했어요</th><th>조금</th><th>다음엔</th></tr></thead><tbody>{rows}</tbody></table>'
        raise ValueError(t)

def sheet_html(title, sub, blocks):
    s = Sheet()
    who = ('<div class="ws-who"><span>___학년 ___반 ___번</span><span>이름 <i class="w" contenteditable="true" data-k="name"></i></span>'
           '<span>날짜 <i contenteditable="true" data-k="date"></i></span></div>')
    inner = ''.join(f'<div class="ws-blk">{s.blk(b)}</div>' for b in blocks if not (b[0] == 'table' and b[2] == 0))
    return ('<div class="btns"><button type="button" class="btn main" data-print="sheet" data-blank="1">🖨️ 빈 활동지 인쇄</button>'
            '<button type="button" class="btn" data-print="sheet">🖨️ 쓴 내용과 함께 인쇄</button>'
            '<button type="button" class="btn" id="wsClear">🧹 모두 지우기</button></div>'
            '<p class="ws-note">화면에서 바로 써도 돼요. 쓴 내용은 이 기기의 브라우저에만 저장돼요. 인쇄는 A4 세로에 맞춰져 있어요.</p>'
            f'<div class="ws"><div class="ws-top"><div><h3>{E(title)}</h3><small>{E(sub)}</small></div>{who}</div>{inner}'
            '<div class="ws-foot"><span>사고전략 활동지 · 초등교사 홍지희</span><span>바탕: Project Zero 사고 루틴</span></div></div>')

def kid_steps(steps, lab='{}단계'):
    out = '<div class="kcards">'
    for i, (nm, q, stems) in enumerate(steps, 1):
        out += (f'<div class="kcard"><span class="no">{lab.format(i)}</span><h3>{E(nm)}</h3><p class="kq">{E(q)}</p>'
                + ''.join(f'<span class="stem">💬 {E(x)}</span>' for x in stems) + '</div>')
    return out + '</div>'

def kid_check(items):
    return '<ul class="kcheck">' + ''.join(f'<li><button type="button" aria-pressed="false">{E(x)}</button></li>' for x in items) + '</ul>'

def print_btn(p, lab):
    return f'<div class="btns"><button type="button" class="btn" data-print="{p}">🖨️ {lab} 인쇄</button></div>'

def full_btn():
    return '<div class="btns"><button type="button" class="btn" id="kidFull">⛶ 교실 화면에 크게 띄우기</button></div>'

# ───────────────────────── 사고전략 23개 ─────────────────────────
def routine_page(x):
    st = ST[x['stage']]
    also = ''.join(' ' + stchip(n) for n in x['also'])
    mtv = f'<dt>원래 묶음</dt><dd>『Making Thinking Visible』 “{MTV[x["mtv"]]}”</dd>' if x['mtv'] else '<dt>원래 묶음</dt><dd>PZ 사고 루틴 도구 상자(Thinking Routine Toolbox) 수록</dd>'
    glance = (f'<dl class="kv"><dt>목적</dt><dd>{E(x["purpose"])}</dd><dt>이럴 때</dt><dd>{lst(map(E, x["when"]))}</dd>'
              f'<dt>시간</dt><dd>{E(x["time"])}</dd><dt>형태</dt><dd>{E(x["group"])}</dd>'
              f'<dt>탐구 단계</dt><dd>{stchip(x["stage"])}{also}</dd>{mtv}</dl>')
    steps = '<ol class="steps">' + ''.join(
        f'<li><b>{E(a)}</b><span class="q">“{E(q)}”</span>' + (f'<span class="note">🧑‍🏫 {E(n)}</span>' if n else '') + '</li>'
        for a, q, n in x['steps']) + '</ol>'
    subj = '<div class="tblw"><table class="tbl"><thead><tr><th style="width:90px">교과</th><th>이렇게 써요</th></tr></thead><tbody>' + ''.join(
        f'<tr><td><b>{E(k)}</b></td><td>{E(v)}</td></tr>' for k, v in x['subj'].items()) + '</tbody></table></div>'
    lv = '<dl class="kv">' + ''.join(f'<dt>{E(k)}</dt><dd>{E(v)}</dd>' for k, v in x['levels'].items()) + '</dl>'
    same = [y for y in R if y is not x and (y['stage'] == x['stage'] or x['stage'] in y['also'])]
    teacher = (f'<h2>🧑‍🏫 교사용 안내</h2>{print_btn("teacher", "교사용 안내")}'
               + sec('한눈에 보기', glance) + '<h2>진행 순서와 교사 발문</h2>' + steps
               + sec('교과별로 이렇게 써요', subj) + sec('학년에 맞게 조절하기', lv)
               + sec('이렇게 하면 더 좋아요', lst(map(E, x['tips']))) + sec('주의할 점', lst(map(E, x['caution'])))
               + sec('무엇을 볼까요(평가 관점)', lst(map(E, x['look'])))
               + sec(f'같은 단계의 다른 사고전략', '<div class="rlinks">' + ''.join(rlink(y) for y in same) + '</div>'))
    k = x['kid']
    student = (f'<div class="kid"><h2>🌱 학생용 안내</h2>{full_btn()}<p class="bubble">{x["ico"]} <b>{E(x["ko"])}</b> — {E(k["intro"])}</p>'
               + kid_steps(k['steps']) + f'<h2>📝 이렇게 해 봐요 (예시)</h2><p class="kex">{E(k["ex"])}</p>'
               + f'<h2>✅ 스스로 점검해요</h2>{kid_check(k["check"])}'
               + '<div class="btns"><a class="btn main" href="#sheet" data-go="sheet">🖨️ 활동지 하러 가기</a></div></div>')
    sheet = '<h2>🖨️ 활동지</h2>' + sheet_html(f'{x["ico"]} {x["ko"]}', f'{x["en"]} · {st["n"]}단계 {st["name"]}', x['sheet'])
    body = (f'<header class="tk-hd"><p class="tk-kicker">사고전략 · {st["n"]}단계 {E(st["name"])}</p>'
            f'<h1><span>{x["ico"]}</span>{E(x["ko"])}</h1><p class="tk-en">{E(x["en"])}</p><p class="tk-one">{E(x["one"])}</p></header>'
            + tabs() + f'<section class="tk-pane" id="teacher" role="tabpanel">{teacher}</section>'
            f'<section class="tk-pane" id="student" role="tabpanel">{student}</section>'
            f'<section class="tk-pane" id="sheet" role="tabpanel">{sheet}</section>' + src(x['url']))
    return doc(f'{x["ko"]} ({x["en"]}) · 사고전략', st['acc'], body, 2)

# ───────────────────────── 탐구 단계 ─────────────────────────
def stage_strip(cur, base):
    return ('<div class="rlinks">' + ''.join(
        f'<a class="rlink" href="{base}{s["id"]}.html" style="{"border-color:" + s["acc"] + ";border-width:3px" if s["n"] == cur else ""}">'
        f'<b>{s["ico"]} {s["n"]}. {E(s["name"])}</b><small>{E(s["short"])} — {E(s["q"])}</small></a>' for s in STAGES) + '</div>')

def stage_page(s):
    rs = [x for x in R if x['stage'] == s['n'] or s['n'] in x['also']]
    choose = '<div class="tblw"><table class="tbl"><thead><tr><th>사고전략</th><th>이럴 때 고르세요</th></tr></thead><tbody>' + ''.join(
        f'<tr><td><a href="../routines/{rfile(BY_ID[i])}">{BY_ID[i]["ico"]} {E(BY_ID[i]["ko"])}</a><br><small>{E(BY_ID[i]["en"])}</small></td><td>{E(w)}</td></tr>'
        for i, w in s['choose']) + '</tbody></table></div>'
    ttl, flow = s['lesson']
    flow = f'<p><b>{E(ttl)}</b></p><ul class="flow">' + ''.join(f'<li><b>{E(a)}</b> — {E(b)}</li>' for a, b in flow) + '</ul>'
    teacher = (f'<h2>🧑‍🏫 교사용 안내</h2>{print_btn("teacher", "교사용 안내")}'
               + sec('이 단계는', f'<p style="margin:0">{E(s["purpose"])}</p><p style="margin:8px 0 0"><b>핵심 질문</b> · “{E(s["q"])}”</p>')
               + sec('학생이 하는 일', lst(map(E, s['kids_do']))) + sec('교사의 역할', lst(map(E, s['teacher'])))
               + sec('사고전략 고르기', choose) + sec('수업 예시(40분)', flow)
               + sec('교사 발문 모음', lst(f'“{E(q)}”' for q in s['questions']))
               + sec('무엇을 볼까요(평가 관점)', lst(map(E, s['assess']))) + sec('주의할 점', lst(map(E, s['pitfall'])))
               + sec('탐구 5단계 전체 보기', f'<p style="margin:0 0 6px">{E(GUIDE["cycle"])}</p>' + stage_strip(s['n'], '')))
    cards = '<div class="kcards">' + ''.join(
        f'<a class="kcard" style="text-decoration:none;color:inherit" href="../routines/{rfile(x)}#student"><span class="no">{E(x["en"])}</span>'
        f'<h3>{x["ico"]} {E(x["ko"])}</h3><p style="margin:0">{E(x["kid"]["intro"])}</p></a>' for x in rs) + '</div>'
    do = kid_steps([(x, '', []) for x in s['kids_do']], '할 일 {}').replace('<p class="kq"></p>', '')
    stems = ''.join(f'<span class="stem">💬 {E(x)}</span>' for x in s['kid_stems'])
    student = (f'<div class="kid"><h2>🌱 학생용 안내</h2>{full_btn()}<p class="bubble">{s["ico"]} <b>{s["n"]}단계 {E(s["name"])}</b> — {E(s["kid_intro"])}</p>'
               f'<h2>이 단계에서 우리는</h2>{do}'
               f'<h2>🧰 이 단계의 생각 도구</h2>{cards}'
               f'<h2>💬 이렇게 말해요</h2><div>{stems}</div>'
               f'<h2>🤙 우리의 약속</h2>{kid_check(s["kid_promise"])}</div>')
    sheet = '<h2>🖨️ 활동지</h2>' + sheet_html(f'{s["ico"]} {s["n"]}단계 {s["name"]} 노트', f'{s["short"]} — {s["q"]}', s['sheet'])
    body = (f'<header class="tk-hd"><p class="tk-kicker">사고전략 · 탐구 단계별</p>'
            f'<h1><span>{s["ico"]}</span>{s["n"]}단계 {E(s["name"])}</h1><p class="tk-en">{E(s["short"])}</p><p class="tk-one">“{E(s["q"])}”</p></header>'
            + tabs() + f'<section class="tk-pane" id="teacher" role="tabpanel">{teacher}</section>'
            f'<section class="tk-pane" id="student" role="tabpanel">{student}</section>'
            f'<section class="tk-pane" id="sheet" role="tabpanel">{sheet}</section>' + src(note=STAGE_NOTE))
    return doc(f'{s["n"]}단계 {s["name"]} · 사고전략', s['acc'], body, 2)

# ───────────────────────── 교과 ─────────────────────────
def subj_page(j):
    picks = '<div class="tblw"><table class="tbl"><thead><tr><th style="width:150px">탐구 단계</th><th>사고전략</th><th>이 교과에서 이렇게</th></tr></thead><tbody>' + ''.join(
        f'<tr><td>{stchip(n)}</td><td><a href="../routines/{rfile(BY_ID[i])}">{BY_ID[i]["ico"]} {E(BY_ID[i]["ko"])}</a></td><td>{E(t)}</td></tr>'
        for n, i, t in j['picks']) + '</tbody></table></div>'
    ttl, flow = j['lesson']
    flow = f'<p><b>{E(ttl)}</b></p><ul class="flow">' + ''.join(f'<li><b>{E(a)}</b> — {E(b)}</li>' for a, b in flow) + '</ul>'
    teacher = (f'<h2>🧑‍🏫 교사용 안내</h2>{print_btn("teacher", "교사용 안내")}'
               + sec(f'{j["nm"]}에서 사고전략이 좋은 까닭', f'<p style="margin:0">{E(j["why"])}</p>')
               + sec('탐구 단계별 추천 사고전략', picks) + sec('수업 예시(40분)', flow)
               + sec('이렇게 하면 더 좋아요', lst(map(E, j['tips'])))
               + sec('활동지', f'<p style="margin:0">“활동지” 탭에 {E(j["nm"])} 수업에 맞춘 활동지가 있어요. 각 사고전략 페이지에도 전략별 활동지가 있습니다.</p>'))
    cards = '<div class="kcards">' + ''.join(
        f'<a class="kcard" style="text-decoration:none;color:inherit" href="../routines/{rfile(BY_ID[i])}#student"><span class="no">{E(BY_ID[i]["en"])}</span>'
        f'<h3>{BY_ID[i]["ico"]} {E(BY_ID[i]["ko"])}</h3><p style="margin:0">{E(t)}</p>'
        + ''.join(f'<span class="stem">💬 {E(st)}</span>' for st in BY_ID[i]['kid']['steps'][0][2][:1]) + '</a>' for i, t in j['kid_cards']) + '</div>'
    student = (f'<div class="kid"><h2>🌱 학생용 안내</h2>{full_btn()}<p class="bubble">{j["ico"]} <b>{E(j["nm"])} 시간의 생각 도구</b> — {E(j["kid_intro"])}</p>'
               f'{cards}<h2>🤙 생각 약속</h2>{kid_check(["먼저 혼자 생각해요.", "생각에 “왜냐하면”을 붙여요.", "친구 생각을 끝까지 듣고 이어 말해요.", "생각이 바뀌어도 괜찮아요. 자란 거예요!"])}</div>')
    sheet = '<h2>🖨️ 활동지</h2>' + sheet_html(f'{j["ico"]} {j["nm"]} 생각 활동지', '사고전략으로 생각을 보이게 해요', j['sheet'])
    body = (f'<header class="tk-hd"><p class="tk-kicker">사고전략 · 교과별</p>'
            f'<h1><span>{j["ico"]}</span>{E(j["nm"])} 수업과 사고전략</h1><p class="tk-one">{E(j["why"])}</p></header>'
            + tabs() + f'<section class="tk-pane" id="teacher" role="tabpanel">{teacher}</section>'
            f'<section class="tk-pane" id="student" role="tabpanel">{student}</section>'
            f'<section class="tk-pane" id="sheet" role="tabpanel">{sheet}</section>' + src())
    return doc(f'{j["nm"]} 수업과 사고전략', j['acc'], body, 2)

# ───────────────────────── 첫 안내 ─────────────────────────
def guide_page():
    stages = '<div class="rlinks">' + ''.join(
        f'<a class="rlink" href="stage/{s["id"]}.html"><b>{s["ico"]} {s["n"]}. {E(s["name"])}</b><small>“{E(s["q"])}”<br>'
        + ' · '.join(E(BY_ID[i]['ko']) for i, _ in s['choose']) + '</small></a>' for s in STAGES) + '</div>'
    start = '<ol class="steps">' + ''.join(f'<li><b>{E(a)}</b><span class="note">{E(b)}</span></li>' for a, b in GUIDE['start']) + '</ol>'
    teacher = (f'<h2>🧑‍🏫 교사용 안내</h2>{print_btn("teacher", "교사용 안내")}'
               + sec('사고전략(사고 루틴)이란?', lst(GUIDE['core']))
               + sec('Project Zero는', '<p style="margin:0">하버드 대학교 교육대학원(Harvard Graduate School of Education)의 연구 센터로, 1967년 철학자 넬슨 굿맨(Nelson Goodman)이 세웠습니다. '
                     '예술 교육 연구에서 출발해 이해, 사고, 창의성, 학습을 연구해 왔고, Visible Thinking(생각 보이게 하기) 등의 연구에서 나온 사고 루틴을 “Thinking Routine Toolbox”로 공개하고 있습니다.</p>')
               + '<h2>시작하는 방법</h2>' + start
               + sec('탐구 5단계와 사고전략', f'<p style="margin:0 0 8px">{E(GUIDE["cycle"])}</p>{stages}<p style="margin:10px 0 0;color:var(--soft);font-size:.92em">{E(STAGE_NOTE)}</p>')
               + sec('이 메뉴 쓰는 법', lst(['<b>탐구 단계별</b> — 수업의 어느 단계(도입·전개·정리)에 쓸지 정했을 때', '<b>교과별</b> — 가르칠 교과에 맞는 사고전략과 수업 예시를 찾을 때',
                                            '<b>사고전략 23가지</b> — 전략 하나를 자세히 볼 때. 모든 페이지는 <b>교사용 안내 · 학생용 안내 · 활동지</b> 세 탭으로 되어 있어요.',
                                            '학생용 안내는 “교실 화면에 크게 띄우기”로 TV에 바로 보여 줄 수 있고, 활동지는 화면에서 쓰거나 A4로 인쇄할 수 있어요.'])))
    kid_stages = [(f'{s["n"]}. {s["name"]}', s['q'], s['kid_stems'][:1]) for s in STAGES]
    student = (f'<div class="kid"><h2>🌱 학생용 안내</h2>{full_btn()}'
               '<p class="bubble">💡 <b>생각 도구가 뭐예요?</b> — 생각을 잘하게 도와주는 “질문 틀”이에요. 같은 질문을 여러 번 써 보면, 어느새 스스로 그렇게 생각하는 사람이 돼요. 생각을 말·글·그림으로 꺼내 “보이게” 하면 친구들과 함께 더 깊이 생각할 수 있어요.</p>'
               f'<h2>🔍 탐구는 이렇게 흘러가요</h2>{kid_steps(kid_stages)}'
               f'<h2>🤙 생각하는 교실의 약속</h2>{kid_check(["천천히 자세히 봐요.", "먼저 혼자 생각해요.", "생각에 “왜냐하면”을 붙여요.", "친구 생각을 끝까지 듣고 이어 말해요.", "생각이 바뀌는 건 생각이 자란 거예요."])}</div>')
    blocks = [('lines', '탐구 주제', 1),
              ('grid', 2, [('🔍 1. 보고 궁금해요', '보인 것 / 궁금한 것', 5), ('💬 2. 생각을 나눠요', '내 생각 / 친구 생각', 5)]),
              ('grid', 2, [('⚖️ 3. 깊이 파고들어요', '근거 / 다른 관점', 5), ('📑 4. 정리해요', '가장 중요한 것 한 줄', 5)]),
              ('grid', 1, [('🔄 5. 되돌아봐요', '전에는 ~라고 생각했는데, 이제는 ~ / 새로 궁금한 것', 4)])]
    sheet = '<h2>🖨️ 활동지</h2>' + sheet_html('💡 사고전략 탐구 노트', '탐구 5단계를 한 장에 — 단원 하나를 따라가며 써요', blocks)
    body = ('<header class="tk-hd"><p class="tk-kicker">사고전략 · 처음 읽는 안내</p><h1><span>💡</span>사고전략, 이렇게 시작해요</h1>'
            '<p class="tk-en">Project Zero Thinking Routines</p><p class="tk-one">하버드 대학교 Project Zero의 사고 루틴으로 학생의 생각을 보이게 하는 수업 안내</p></header>'
            + tabs() + f'<section class="tk-pane" id="teacher" role="tabpanel">{teacher}</section>'
            f'<section class="tk-pane" id="student" role="tabpanel">{student}</section>'
            f'<section class="tk-pane" id="sheet" role="tabpanel">{sheet}</section>' + src(note=STAGE_NOTE))
    return doc('사고전략, 이렇게 시작해요', '#8A63D2', body, 1)

# ───────────────────────── 메뉴 페이지 ─────────────────────────
MENU_CSS = rd('menu.css')
MENU_JS = rd('menu.js')

def menu(title, depth, crumbs, h1, sub, inner, acc='#8A63D2', tabs_js=False):
    up = '../' * depth
    cr = '<nav class="crumb" aria-label="현재 위치"><a class="back" href="' + up + 'index.html">🏠 초등교사 홍지희</a>' + ''.join(
        f'<a class="back" href="{h}">{E(t)}</a>' for h, t in crumbs) + '</nav>'
    js = f'<script>{MENU_JS}</script>' if tabs_js else ''
    return (f'<!DOCTYPE html>\n<html lang="ko"><head><meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
            f'<title>{E(title)}</title>\n<link href="https://fonts.googleapis.com/css2?family=Jua&family=Gowun+Dodum&display=swap" rel="stylesheet">\n'
            f'<style>{MENU_CSS}\n:root{{--acc:{acc}}}\n.room{{display:flex;flex-direction:column;gap:6px;border-radius:20px;padding:16px 20px;text-decoration:none;color:inherit}}\n</style>{FOOTCSS}</head><body><main>\n{cr}\n<h1>{h1}</h1>\n'
            f'<p class="sub">{sub}</p>\n{inner}\n<div class="verify"><p>{SRC_LINE.format(u=TOOLBOX)}</p><p>{E(LICENSE)}</p></div>\n'
            f'{FOOT}</main>{js}\n</body></html>\n')

def card(href, tag, nm, de, color=None):
    st = f' style="background:{color}"' if color else ''
    return f'<a class="card" href="{href}"><span class="tag"{st}>{tag}</span><span class="nm">{nm}</span><span class="de">{de}</span></a>'

def tabbar(items):
    return ('<nav class="tabs" role="tablist" aria-label="고르기">' + ''.join(
        f'<a class="tab" role="tab" href="#{i}" data-pane="{i}">{lab}<span class="cnt">{c}</span></a>' for i, lab, c in items) + '</nav>')

def three_cards(page, nm, color):
    return (card(f'{page}#teacher', '교사용', f'🧑‍🏫 {nm} 교사용 안내', '목적, 사고전략 고르기, 수업 예시, 발문, 평가 관점', color)
            + card(f'{page}#student', '학생용', f'🌱 {nm} 학생용 안내', '교실 화면에 크게 띄워 학생과 함께 보는 안내', color)
            + card(f'{page}#sheet', '활동지', f'🖨️ {nm} 활동지', '화면에서 쓰거나 A4로 인쇄', color))

def root_menu():
    inner = ('<div class="grid">'
             '<a class="card room" style="--acc:#E8913A" href="stage/index.html"><span class="ico">🧭</span><span class="nm">탐구 단계별</span><small>관찰·질문 → 생각 나누기 → 깊이 파고들기 → 정리 → 되돌아보기, 5단계마다 교사용·학생용 안내와 활동지</small></a>'
             '<a class="card room" style="--acc:#2B6FB8" href="subject/index.html"><span class="ico">📚</span><span class="nm">교과별</span><small>국어·수학·사회·과학·도덕·실과·체육·음악·미술·영어 10개 교과의 추천 사고전략과 수업 예시</small></a>'
             '<a class="card room" style="--acc:#8A63D2" href="routines/index.html"><span class="ico">🧩</span><span class="nm">사고전략 23가지</span><small>See-Think-Wonder부터 I Used to Think까지, 전략마다 교사용·학생용 안내와 활동지</small></a>'
             '</div>\n<h2>💡 처음이라면</h2><p class="gsub">사고전략이 무엇인지, 어떻게 시작하는지부터 읽어 보세요.</p><div class="grid">'
             + three_cards('guide.html', '사고전략', '#8A63D2') + '</div>')
    return menu('사고전략 · 초등교사 홍지희', 1, [], '💡 사고전략',
                '하버드 대학교 Project Zero의 사고 루틴(Thinking Routines)을 탐구 단계별·교과별로 정리했어요.<br>모든 자료에 교사용 안내 · 학생용 안내 · 활동지가 있어요.', inner)

def stage_menu():
    items = [(s['id'], f'{s["ico"]} {s["n"]}. {s["name"]}', len([x for x in R if x['stage'] == s['n'] or s['n'] in x['also']])) for s in STAGES]
    panes = ''
    for s in STAGES:
        rs = [x for x in R if x['stage'] == s['n'] or s['n'] in x['also']]
        panes += (f'<section class="pane" id="{s["id"]}" role="tabpanel"><h2>{s["ico"]} {s["n"]}단계 {E(s["name"])}</h2>'
                  f'<p class="gsub">{E(s["short"])} · “{E(s["q"])}” — {E(s["purpose"])}</p><div class="grid">'
                  + three_cards(f'{s["id"]}.html', f'{s["n"]}단계', s['acc']) + '</div>'
                  f'<h3 class="unit">이 단계의 사고전략 <small>{len(rs)}개</small></h3><div class="grid">'
                  + ''.join(card(f'../routines/{rfile(x)}', x['en'], f'{x["ico"]} {E(x["ko"])}', E(x['one']) + ' — 교사용·학생용·활동지', s['acc']) for x in rs)
                  + '</div></section>\n')
    inner = tabbar(items) + '\n' + panes
    return menu('탐구 단계별 사고전략', 2, [('../index.html', '💡 사고전략')], '🧭 탐구 단계별 사고전략',
                '탐구 수업의 흐름에 따라 다섯 단계로 나누었어요. 단계마다 교사용 안내, 학생용 안내, 활동지, 그리고 그 단계에 쓰기 좋은 사고전략이 있어요.<br><small>' + E(STAGE_NOTE) + '</small>',
                inner, tabs_js=True)

def subj_menu():
    items = [(j['id'], f'{j["ico"]} {j["nm"]}', len(j['picks'])) for j in SUBJ]
    panes = ''
    for j in SUBJ:
        panes += (f'<section class="pane" id="{j["id"]}" role="tabpanel"><h2>{j["ico"]} {E(j["nm"])}</h2><p class="gsub">{E(j["why"])}</p><div class="grid">'
                  + three_cards(f'{j["id"]}.html', j['nm'], j['acc']) + '</div>'
                  f'<h3 class="unit">{E(j["nm"])}에 추천하는 사고전략 <small>{len(j["picks"])}개</small></h3><div class="grid">'
                  + ''.join(card(f'../routines/{rfile(BY_ID[i])}', f'{n}단계 · {BY_ID[i]["en"]}', f'{BY_ID[i]["ico"]} {E(BY_ID[i]["ko"])}', E(t), ST[n]['acc']) for n, i, t in j['picks'])
                  + '</div></section>\n')
    inner = tabbar(items) + '\n' + panes
    return menu('교과별 사고전략', 2, [('../index.html', '💡 사고전략')], '📚 교과별 사고전략',
                '초등 10개 교과에서 사고전략을 어떻게 쓸 수 있는지 정리했어요. 교과마다 교사용 안내(추천 전략·수업 예시), 학생용 안내, 교과 맞춤 활동지가 있어요.', inner, tabs_js=True)

def routine_menu():
    items = [('all', '🧩 전체', len(R))] + [(s['id'], f'{s["ico"]} {s["n"]}단계', len([x for x in R if x['stage'] == s['n']])) for s in STAGES]
    def grid(xs):
        return '<div class="grid">' + ''.join(card(rfile(x), f'{x["stage"]}단계 · {ST[x["stage"]]["name"]}', f'{x["ico"]} {E(x["ko"])}', f'{E(x["en"])} — {E(x["one"])}', ST[x['stage']]['acc']) for x in xs) + '</div>'
    panes = f'<section class="pane" id="all" role="tabpanel"><h2>🧩 사고전략 전체</h2><p class="gsub">탐구 단계 순서로 놓았어요. 카드를 누르면 교사용 안내 · 학생용 안내 · 활동지를 볼 수 있어요.</p>{grid(R)}</section>\n'
    for s in STAGES:
        panes += (f'<section class="pane" id="{s["id"]}" role="tabpanel"><h2>{s["ico"]} {s["n"]}단계 {E(s["name"])}</h2><p class="gsub">“{E(s["q"])}”</p>'
                  + grid([x for x in R if x['stage'] == s['n']]) + '</section>\n')
    return menu('사고전략 23가지', 2, [('../index.html', '💡 사고전략')], '🧩 사고전략 23가지',
                'Project Zero 사고 루틴 가운데 초등 교실에서 쓰기 좋은 23가지를 골랐어요. 이름 옆 영어는 원래 이름이에요.', tabbar(items) + '\n' + panes, tabs_js=True)

def main():
    for d in ('', 'stage', 'subject', 'routines'):
        (OUT / d).mkdir(parents=True, exist_ok=True)
    w = lambda p, s: (OUT / p).write_text(s, encoding='utf-8')
    w('index.html', root_menu()); w('guide.html', guide_page())
    w('stage/index.html', stage_menu()); w('subject/index.html', subj_menu()); w('routines/index.html', routine_menu())
    for s in STAGES: w(f'stage/{s["id"]}.html', stage_page(s))
    for j in SUBJ: w(f'subject/{j["id"]}.html', subj_page(j))
    for x in R: w(f'routines/{rfile(x)}', routine_page(x))
    print(f'만듦: 메뉴 4 · 첫 안내 1 · 단계 {len(STAGES)} · 교과 {len(SUBJ)} · 사고전략 {len(R)}')

if __name__ == '__main__':
    main()
