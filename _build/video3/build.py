#!/usr/bin/env python3
"""3~6학년 수학 영상 메뉴(gradeN/math/videos/index.html)를 만듭니다.

    python3 _build/video3/build.py          # 만들고 메뉴 디자인(apply_theme)까지
    python3 _build/video3/build.py check    # 점검만

영상 목록·유튜브 주소는 videos.py(3학년)·videos4.py·videos5.py·videos6.py. 메뉴 HTML을 직접 고치지 마세요.
"""
import html, pathlib, re, subprocess, sys, urllib.parse
HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[1]
sys.path.insert(0, str(HERE))
import importlib
GRADES = {3: 'videos', 4: 'videos4', 5: 'videos5', 6: 'videos6'}
V = None; G = 3
OUT = None
YT = re.compile(r'^https://(youtu\.be/[\w-]{11}|www\.youtube\.com/(watch\?v=[\w-]{11}|playlist\?list=[\w-]+|@[\w.-]+(/playlists)?))([?&][\w=&.-]*)?$')

def unit(code):
    return V.UNIT_OF.get(code, code[:3])

def check():
    err = []
    codes = [e[1] for e in V.EPISODES]
    if len(set(codes)) != len(codes): err.append('화 코드가 겹침')
    if sorted(e[0] for e in V.EPISODES) != list(range(1, len(V.EPISODES) + 1)): err.append('화 번호가 1부터 이어지지 않음')
    units = {u for u, _ in V.UNITS}
    for e in V.EPISODES:
        if unit(e[1]) not in units: err.append(f'{e[1]}: 모르는 단원')
    for k, u in V.LINKS.items():
        if k not in codes: err.append(f'LINKS의 {k}: 목록에 없는 화')
        if not YT.match(u): err.append(f'LINKS의 {k}: 유튜브 주소 꼴이 아님 {u}')
    if V.PLAYLIST and not YT.match(V.PLAYLIST): err.append('PLAYLIST: 유튜브 주소 꼴이 아님')
    if not YT.match(V.CHANNEL): err.append('CHANNEL: 유튜브 채널 주소 꼴이 아님')
    for x in err: print('[문제]', x)
    return not err

def ep_html(e):
    n, code, ch, title = e
    u = V.LINKS.get(code) or V.CHANNEL + '/search?query=' + urllib.parse.quote(title)
    return (f'<li><a class="vx-ep" data-c="{html.escape(code)}" href="{html.escape(u)}" target="_blank" rel="noopener">'
            f'<span class="vx-no">{html.escape(ch)}<small>차시</small></span>'
            f'<span class="vx-tt"><b>{html.escape(title)}</b><small>{n}화 · 유튜브에서 보기</small></span>'
            f'<span class="vx-play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5.5v13l10.5-6.5z"/></svg></span>'
            f'<i class="vx-seen" title="본 영상">본 영상</i></a></li>')

# 2026-10-29 선생님: '나열된 느낌' 없애기 — 학기 고르기 + 단원 단추 → 고른 단원 영상만, 맨 위 '이어서 보기'(이 기기 기록 hj-video3).
# 스크립트가 없으면 전체 목록이 그대로 보임.
CSS = r"""<style id="vx-css">
.vx-top{display:flex;flex-wrap:wrap;align-items:center;gap:12px 16px;margin:0 0 14px}
.vx-seg{display:inline-flex;padding:4px;border-radius:14px;background:var(--bg2,#EEECE6);gap:4px}
.vx-seg button{border:0;background:transparent;font:inherit;font-weight:800;font-size:17px;color:var(--soft);height:44px;padding:0 20px;border-radius:10px;cursor:pointer}
.vx-seg button[aria-selected="true"]{background:var(--paper);color:var(--ink);box-shadow:0 1px 3px rgba(15,28,51,.12)}
.vx-pl{margin-left:auto;display:inline-flex;align-items:center;gap:6px;font-weight:700;font-size:16px;color:var(--soft);text-decoration:none;padding:8px 12px;border-radius:10px}
.vx-pl:hover{background:var(--bg2,#EEECE6);color:var(--ink)}
.vx-units{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 18px}
.vx-units button{display:inline-flex;align-items:center;gap:8px;min-height:46px;padding:6px 16px 6px 8px;border:1px solid var(--line);border-radius:999px;background:var(--paper);font:inherit;font-weight:700;font-size:16.5px;color:var(--ink);cursor:pointer}
.vx-units button i{font-style:normal;display:grid;place-items:center;min-width:32px;height:32px;padding:0 6px;border-radius:999px;background:var(--bg2,#EEECE6);font-weight:800;font-size:14px;color:var(--soft)}
.vx-units button small{font-size:13.5px;font-weight:700;color:var(--soft)}
.vx-units button:hover{border-color:var(--line2,#CFCBC1)}
.vx-units button[aria-pressed="true"]{background:var(--sel-bg,#0F1C33);border-color:var(--sel-bg,#0F1C33);color:var(--sel-ink,#fff)}
.vx-units button[aria-pressed="true"] i{background:rgba(255,255,255,.16);color:inherit}
.vx-units button[aria-pressed="true"] small{color:inherit;opacity:.8}
.vx-unit{background:var(--paper);border:1px solid var(--line);border-radius:22px;padding:18px 20px 20px;margin:0 0 18px;box-shadow:0 1px 2px rgba(15,28,51,.04),0 24px 48px -32px rgba(15,28,51,.28)}
.vx-uh{display:flex;align-items:baseline;gap:10px;margin:0 0 12px!important;padding:0 2px 12px;border-bottom:1px solid var(--line);font-size:clamp(20px,2vw,24px)!important;font-weight:800;letter-spacing:-.02em}
.vx-uh::before,.vx-uh::after{content:none!important}
.vx-uh small{font-size:15px;font-weight:700;color:var(--soft)}
.vx-eps{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
.vx-ep{position:relative;display:flex;align-items:center;gap:14px;min-height:84px;padding:12px 16px 12px 12px;border-radius:16px;background:var(--bg,#F6F5F1);text-decoration:none;color:var(--ink);transition:background .15s,box-shadow .15s}
.vx-ep:hover,.vx-ep:focus-visible{background:var(--paper);box-shadow:inset 0 0 0 1px var(--line2,#CFCBC1),0 10px 24px -16px rgba(15,28,51,.35)}
.vx-no{flex:none;display:flex;flex-direction:column;align-items:center;justify-content:center;width:62px;height:62px;border-radius:14px;background:var(--paper);box-shadow:inset 0 0 0 1px var(--line);font-weight:800;font-size:17px;line-height:1.1;color:var(--ink)}
.vx-no small{font-size:11.5px;font-weight:700;color:var(--soft);margin-top:2px}
.vx-tt{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px}
.vx-tt b{font-size:clamp(17px,1.6vw,19.5px);font-weight:800;line-height:1.35;letter-spacing:-.01em}
.vx-tt small{font-size:13.5px;font-weight:600;color:var(--soft)}
.vx-play{flex:none;width:40px;height:40px;border-radius:50%;display:grid;place-items:center;background:var(--sel-bg,#0F1C33)}
.vx-play svg{width:18px;height:18px;fill:var(--sel-ink,#fff);margin-left:2px}
.vx-seen{display:none}
.vx-ep.seen .vx-tt small::after{content:" · ✓ 본 영상";color:#1F7A4D;font-weight:800}
.vx-units button[hidden]{display:none!important}
.vx-ep.seen .vx-play{background:#1F7A4D}
.vx-cont{display:none;align-items:stretch;gap:10px;margin:0 0 18px;padding:14px;border-radius:20px;background:var(--paper);border:1px solid var(--line)}
.vx-js .vx-cont.on{display:flex;flex-wrap:wrap}
.vx-cont>b{flex:0 0 100%;font-size:15px;font-weight:800;color:var(--soft);margin:0 0 2px 4px}
.vx-cont .vx-ep{flex:1 1 300px}
.vx-cont .vx-tag{position:absolute;top:-9px;left:12px;font-size:12px;font-weight:800;color:#fff;background:var(--sel-bg,#0F1C33);border-radius:999px;padding:2px 9px}
html:not(.vx-js) .vx-units,html:not(.vx-js) .vx-seg{display:none}
.vx-js .vx-unit:not(.on){display:none}
@media (max-width:760px){.vx-eps{grid-template-columns:1fr}.vx-pl{margin-left:0}}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .vx-ep.seen .vx-tt small::after{color:#7FD3A6}}
:root[data-theme="dark"] .vx-ep.seen .vx-tt small::after{color:#7FD3A6}
</style>"""

JS = r"""<script>(function(){var H=document.documentElement,K='__KEY__',S={};try{S=JSON.parse(localStorage.getItem(K)||'{}')}catch(e){}S.seen=S.seen||{};
 function save(){try{localStorage.setItem(K,JSON.stringify(S))}catch(e){}}
 var units=[].slice.call(document.querySelectorAll('.vx-unit')),ubtn=[].slice.call(document.querySelectorAll('.vx-units button')),sbtn=[].slice.call(document.querySelectorAll('.vx-seg button'));
 if(!units.length)return;H.classList.add('vx-js');
 var eps=[].slice.call(document.querySelectorAll('.vx-list .vx-ep'));
 function mark(){eps.forEach(function(a){a.classList.toggle('seen',!!S.seen[a.dataset.c])})}
 function pick(u,save1){var sem=u.charAt(0);units.forEach(function(x){x.classList.toggle('on',x.dataset.u===u)});
  ubtn.forEach(function(b){b.hidden=b.dataset.u.charAt(0)!==sem;b.setAttribute('aria-pressed',b.dataset.u===u?'true':'false')});
  sbtn.forEach(function(b){b.setAttribute('aria-selected',b.dataset.sem===sem?'true':'false')});if(save1){S.u=u;save()}}
 ubtn.forEach(function(b){b.onclick=function(){pick(b.dataset.u,true)}});
 sbtn.forEach(function(b){b.onclick=function(){var f=ubtn.filter(function(x){return x.dataset.u.charAt(0)===b.dataset.sem})[0];if(f)pick(f.dataset.u,true)}});
 eps.forEach(function(a,i){a.addEventListener('click',function(){S.seen[a.dataset.c]=1;S.last=a.dataset.c;save();mark();cont()})});
 function cont(){var box=document.getElementById('vxCont');if(!box||!S.last)return;var i=eps.findIndex(function(a){return a.dataset.c===S.last});if(i<0)return;
  box.innerHTML='<b>이어서 보기</b>';[[eps[i],'지난번'],[eps[i+1],'다음 영상']].forEach(function(p){if(!p[0])return;var c=p[0].cloneNode(true);c.classList.toggle('seen',!!S.seen[c.dataset.c]);
   var t=document.createElement('span');t.className='vx-tag';t.textContent=p[1];c.appendChild(t);c.addEventListener('click',function(){S.seen[c.dataset.c]=1;S.last=c.dataset.c;save();mark();setTimeout(cont,0)});box.appendChild(c)});box.classList.add('on')}
 var u0=S.u&&ubtn.some(function(b){return b.dataset.u===S.u})?S.u:(S.last&&(eps.filter(function(a){return a.dataset.c===S.last})[0]||{}).closest?eps.filter(function(a){return a.dataset.c===S.last})[0].closest('.vx-unit').dataset.u:ubtn[0].dataset.u);
 mark();pick(u0,false);cont();
})();</script>"""

def build():
    total = len(V.EPISODES); up = sum(1 for e in V.EPISODES if e[1] in V.LINKS)
    b = ['<nav class="crumb"><a class="back" href="../../../index.html">🏠 초등교사 홍지희</a> '
         f'<a class="back" href="../../index.html">{G}학년</a> <a class="back" href="../index.html">수학</a></nav>',
         '<h1>🎬 수학 원리 돋보기</h1>',
         f'<p class="sub">{G}학년 수학 개념·계산 원리를 그림으로 설명하는 영상 {total}편(편마다 {getattr(V, "MINUTES", "2~3")}분)이에요. '
         f'단원을 고르면 차시 차례로 나와요.</p>',
         '<div class="vx-cont" id="vxCont" aria-label="이어서 보기"></div>',
         '<div class="vx-top"><div class="vx-seg" role="tablist" aria-label="학기">'
         '<button type="button" role="tab" data-sem="1">1학기</button><button type="button" role="tab" data-sem="2">2학기</button></div>'
         + (f'<a class="vx-pl" href="{html.escape(V.PLAYLIST)}" target="_blank" rel="noopener">재생목록 전체 보기 ↗</a>' if V.PLAYLIST else '') + '</div>']
    ub, secs = [], []
    for sem in ('1', '2'):
        for u, name in V.UNITS:
            if u[0] != sem: continue
            eps = [e for e in V.EPISODES if unit(e[1]) == u]
            eps.sort(key=lambda e: int(re.split(r'\D', e[2])[0]))
            ub.append(f'<button type="button" data-u="{u}"><i>{u[2]}</i>{html.escape(name)} <small>{len(eps)}편</small></button>')
            secs.append(f'<section class="vx-unit" data-u="{u}"><h3 class="vx-uh">{sem}학기 {u[2]}단원 · {html.escape(name)} <small>{len(eps)}편</small></h3>'
                        f'<ol class="vx-eps">' + ''.join(ep_html(e) for e in eps) + '</ol></section>')
    b.append('<div class="vx-units" aria-label="단원">' + ''.join(ub) + '</div>')
    b.append('<div class="vx-list">' + ''.join(secs) + '</div>')
    head = (HERE / 'head.html').read_text(encoding='utf-8').replace('{TITLE}', f'수학 원리 돋보기 · {G}학년 수학 · 초등교사 홍지희').replace('</head>', CSS + '</head>', 1)
    foot = (HERE / 'foot.html').read_text(encoding='utf-8').replace('{FOOT}', f'{G}학년 수학 개념을 설명하는 영상 모음입니다. 영상은 유튜브 @hongjihee1005 채널에 있습니다.').replace('</main>', '</main>' + JS.replace('__KEY__', f'hj-video{G}'), 1)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(head + '\n'.join(b) + '\n' + foot, encoding='utf-8')
    subprocess.run([sys.executable, str(ROOT / '_build/theme/apply_theme.py'), str(OUT)], check=True)
    print(f'{OUT.relative_to(ROOT)}: {total}편 (영상 주소 {up}편, 나머지는 채널 검색)')

def use(g):
    global V, G, OUT
    G = g; V = importlib.import_module(GRADES[g]); OUT = ROOT / f'grade{g}/math/videos/index.html'

if __name__ == '__main__':
    ok = True
    for g in GRADES:
        use(g)
        if not check(): print(f'  ({g}학년)'); ok = False
    if not ok: sys.exit(1)
    if sys.argv[1:] != ['check']:
        for g in GRADES: use(g); build()
