#!/usr/bin/env python3
"""'📺 유튜브 영상' 페이지(youtube/index.html) 만들기 — 유튜브 채널 @hongjihee1005 연동

    python3 _build/youtube/fetch.py     # 채널에서 새 목록 받기(인터넷 필요, 실패하면 이전 목록 사용)
    python3 _build/youtube/build.py     # channel.json → youtube/index.html (+ 메뉴 디자인 apply_theme)

자료는 channel.json(fetch.py가 만듦). HTML을 직접 고치지 마세요.
화면: 찾기 · 새로 올린 영상 · 재생목록(학생용만 — 선생님·학부모용은 2026-11-27 선생님 뜻으로 뺌). 영상을 누르면 이 화면에서 바로 재생
(youtube-nocookie 퍼가기), '유튜브에서 보기'로 채널에서도 열 수 있음. 학생용/선생님용 나누기는 STUDENT 낱말.
3~6학년 수학 영상 메뉴(gradeN/math/videos)의 영상 주소도 같은 channel.json에서 _build/video3/build.py가 넣습니다.
"""
import html, json, pathlib, re, subprocess, sys

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[1]
OUT = ROOT / "youtube/index.html"
SHELL = ROOT / "_build/video3"
CH = "https://www.youtube.com/@hongjihee1005"
STUDENT = ("수학", "과학", "분수", "학습자료", "엔트리", "이야기 만드는 선생님")
ADULT = ("교사연수", "[교사", "학부모", "노동요", "[IB]")   # 이런 말이 든 제목은 어느 묶음에서든 뺌(선생님·학부모용)
ID = re.compile(r"^[\w-]{11}$")
PL = re.compile(r"^PL[\w-]{8,40}$")
e = html.escape


def check(d):
    err = []
    for v in d["latest"] + d["recent"] + [v for p in d["playlists"] for v in p["videos"]]:
        if not ID.match(v["id"]): err.append(f"영상 id 꼴이 아님: {v['id']}")
        if not v["title"]: err.append(f"제목 없음: {v['id']}")
    for p in d["playlists"]:
        if not PL.match(p["id"]): err.append(f"재생목록 id 꼴이 아님: {p['id']}")
    for x in err: print("[문제]", x)
    return not err


def card(v, date=""):
    meta = " · ".join(x for x in (v.get("len", ""), date or v.get("date", "")) if x)
    return (f'<li><a class="yt-v" href="https://youtu.be/{v["id"]}" data-id="{v["id"]}" target="_blank" rel="noopener">'
            f'<span class="yt-th"><img src="https://i.ytimg.com/vi/{v["id"]}/mqdefault.jpg" alt="" loading="lazy" width="320" height="180" onerror="this.style.visibility=\'hidden\'">'
            f'<i class="yt-pb" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5.5v13l10.5-6.5z"/></svg></i></span>'
            f'<span class="yt-tt">{e(v["title"])}</span>' + (f'<small>{e(meta)}</small>' if meta else "") + '</a></li>')


def pl_section(p, grp):
    return (f'<section class="yt-pl" data-g="{grp}" data-p="{p["id"]}" id="pl-{p["id"]}"><div class="yt-plh"><h3>{e(p["title"])} <small>{p["count"]}편</small></h3>'
            f'<a class="yt-all" href="https://www.youtube.com/playlist?list={p["id"]}" data-list="{p["id"]}" target="_blank" rel="noopener">▶ 처음부터 이어 보기</a></div>'
            f'<ol class="yt-grid">' + "".join(card(v) for v in p["videos"]) + '</ol>'
            + (f'<p class="yt-more">앞쪽 {len(p["videos"])}편만 보여요. <a href="https://www.youtube.com/playlist?list={p["id"]}" target="_blank" rel="noopener">유튜브에서 모두 보기 ↗</a></p>' if p["count"] > len(p["videos"]) + 2 else "")
            + '</section>')


CSS = r"""<style id="yt-css">
.yt-bar{display:flex;flex-wrap:wrap;align-items:center;gap:10px 14px;margin:0 0 18px}
.yt-seg{display:inline-flex;flex-wrap:wrap;padding:4px;border-radius:14px;background:var(--bg2,#EEECE6);gap:4px}
.yt-seg button{border:0;background:transparent;font:inherit;font-weight:800;font-size:17px;color:var(--soft);min-height:44px;padding:0 18px;border-radius:10px;cursor:pointer}
.yt-seg button[aria-selected="true"]{background:var(--paper);color:var(--ink);box-shadow:0 1px 3px rgba(15,28,51,.12)}
.yt-find{flex:1 1 220px;max-width:360px;min-height:46px;padding:0 16px;border:1px solid var(--line);border-radius:12px;background:var(--paper);color:var(--ink);font:inherit;font-size:17px}
.yt-ch{margin-left:auto;display:inline-flex;align-items:center;gap:8px;font-weight:800;font-size:16px;color:#fff;background:#E5484D;text-decoration:none;padding:10px 16px;border-radius:12px}
.yt-ch:hover{filter:brightness(.95)}
.yt-chips{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 16px}
.yt-chips button{min-height:44px;padding:6px 16px;border:1px solid var(--line);border-radius:999px;background:var(--paper);font:inherit;font-weight:700;font-size:16px;color:var(--ink);cursor:pointer}
.yt-chips button small{font-size:13.5px;color:var(--soft);font-weight:700;margin-left:4px}
.yt-chips button[aria-pressed="true"]{background:var(--sel-bg,#0F1C33);border-color:var(--sel-bg,#0F1C33);color:var(--sel-ink,#fff)}
.yt-chips button[aria-pressed="true"] small{color:inherit;opacity:.8}
.yt-pl,.yt-new{background:var(--paper);border:1px solid var(--line);border-radius:22px;padding:18px 20px 20px;margin:0 0 18px;box-shadow:0 1px 2px rgba(15,28,51,.04),0 24px 48px -32px rgba(15,28,51,.28)}
.yt-plh{display:flex;flex-wrap:wrap;align-items:center;gap:8px 14px;margin:0 0 14px;padding:0 2px 12px;border-bottom:1px solid var(--line)}
.yt-plh h3{flex:1 1 auto;margin:0!important;font-size:clamp(19px,2vw,23px)!important;font-weight:800;letter-spacing:-.02em;word-break:keep-all}
.yt-plh h3::before,.yt-plh h3::after{content:none!important}
.yt-plh h3 small{font-size:15px;color:var(--soft);font-weight:700}
.yt-all{font-weight:800;font-size:15.5px;color:var(--ink);text-decoration:none;padding:8px 14px;border-radius:10px;border:1px solid var(--line);background:var(--bg,#F6F5F1)}
.yt-all:hover{border-color:var(--line2,#CFCBC1)}
.yt-grid{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:14px}
.yt-v{display:flex;flex-direction:column;gap:6px;height:100%;text-decoration:none;color:var(--ink);border-radius:14px;padding:6px;transition:background .15s}
.yt-v:hover,.yt-v:focus-visible{background:var(--bg,#F6F5F1)}
.yt-th{position:relative;display:block;aspect-ratio:16/9;border-radius:12px;overflow:hidden;background:#D9DDE4}
.yt-th img{display:block;width:100%;height:100%;object-fit:cover}
.yt-pb{position:absolute;right:8px;bottom:8px;width:34px;height:34px;border-radius:50%;display:grid;place-items:center;background:rgba(15,28,51,.78)}
.yt-pb svg{width:16px;height:16px;fill:#fff;margin-left:2px}
.yt-tt{font-weight:800;font-size:16.5px;line-height:1.38;word-break:keep-all;overflow-wrap:anywhere;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.yt-v small{font-size:13.5px;color:var(--soft);font-weight:600}
.yt-v.seen small::after{content:" · ✓ 본 영상";color:#1F7A4D;font-weight:800}
.yt-more{margin:12px 2px 0;font-size:15px;color:var(--soft)}
.yt-none{display:none;padding:28px;text-align:center;color:var(--soft);font-size:17px}
.yt-note{font-size:14.5px;color:var(--soft);margin:-6px 0 18px}
html.yt-js .yt-pl:not(.on),html.yt-js .yt-new:not(.on){display:none}
html.yt-js.yt-q .yt-pl,html.yt-js.yt-q .yt-new{display:block}
html.yt-js.yt-q .yt-chips{display:none}
html.yt-js.yt-q li.off,html.yt-js.yt-q section.off{display:none}
html:not(.yt-js) .yt-seg,html:not(.yt-js) .yt-chips,html:not(.yt-js) .yt-find{display:none}
.yt-dlg{position:fixed;inset:0;z-index:1000;display:none;align-items:center;justify-content:center;padding:16px;background:rgba(10,16,28,.72)}
.yt-dlg.on{display:flex}
.yt-box{width:min(1100px,100%);background:var(--paper);border-radius:18px;overflow:hidden;box-shadow:0 30px 80px -20px rgba(0,0,0,.5)}
.yt-frame{position:relative;aspect-ratio:16/9;background:#000}
.yt-frame iframe{position:absolute;inset:0;width:100%;height:100%;border:0}
.yt-foot{display:flex;flex-wrap:wrap;align-items:center;gap:10px;padding:12px 16px}
.yt-foot b{flex:1 1 240px;font-size:17px;word-break:keep-all}
.yt-foot a,.yt-foot button{min-height:42px;padding:0 16px;border-radius:10px;border:1px solid var(--line);background:var(--bg,#F6F5F1);color:var(--ink);font:inherit;font-weight:800;font-size:15.5px;text-decoration:none;display:inline-flex;align-items:center;cursor:pointer}
@media (max-width:640px){.yt-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.yt-ch{margin-left:0}.yt-tt{font-size:15px}}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .yt-v.seen small::after{color:#7FD3A6}}
:root[data-theme="dark"] .yt-v.seen small::after{color:#7FD3A6}
</style>"""

JS = r"""<script>(function(){var H=document.documentElement,K='hj-youtube-v1',S={};try{S=JSON.parse(localStorage.getItem(K)||'{}')}catch(e){}S.seen=S.seen||{};
 function save(){try{localStorage.setItem(K,JSON.stringify(S))}catch(e){}}
 var secs=[].slice.call(document.querySelectorAll('.yt-pl,.yt-new')),seg=[].slice.call(document.querySelectorAll('.yt-seg button')),chips=[].slice.call(document.querySelectorAll('.yt-chips button'));
 if(!secs.length)return;H.classList.add('yt-js');
 var vids=[].slice.call(document.querySelectorAll('.yt-v'));
 function mark(){vids.forEach(function(a){a.classList.toggle('seen',!!S.seen[a.dataset.id])})}
 function show(key,keep){var g=key.split(':')[0];seg.forEach(function(b){b.setAttribute('aria-selected',b.dataset.g===g?'true':'false')});
  chips.forEach(function(b){b.hidden=b.dataset.g!==g;b.setAttribute('aria-pressed',b.dataset.k===key?'true':'false')});
  document.querySelector('.yt-chips').hidden=g==='new';
  secs.forEach(function(s){s.classList.toggle('on',g==='new'?s.classList.contains('yt-new'):s.dataset.g+':'+s.dataset.p===key)});
  if(keep!==false){S.k=key;save()}}
 seg.forEach(function(b){b.onclick=function(){if(b.dataset.g==='new'){show('new');return}var f=chips.filter(function(c){return c.dataset.g===b.dataset.g})[0];if(f)show(f.dataset.k)}});
 chips.forEach(function(b){b.onclick=function(){show(b.dataset.k)}});
 var q=document.querySelector('.yt-find'),none=document.querySelector('.yt-none');
 if(q)q.addEventListener('input',function(){var t=q.value.trim().toLowerCase().replace(/\s+/g,'');H.classList.toggle('yt-q',!!t);var n=0;
  secs.forEach(function(s){var m=0;[].forEach.call(s.querySelectorAll('li'),function(li){var ok=!t||li.textContent.toLowerCase().replace(/\s+/g,'').indexOf(t)>=0;li.classList.toggle('off',!ok);if(ok)m++});s.classList.toggle('off',!m);n+=m});
  none.style.display=t&&!n?'block':'none'});
 var dlg=document.querySelector('.yt-dlg'),fr=dlg.querySelector('.yt-frame'),tt=dlg.querySelector('.yt-foot b'),op=dlg.querySelector('.yt-open'),last=null;
 function play(src,title,href){fr.innerHTML='<iframe src="'+src+'" title="'+title.replace(/"/g,'&quot;')+'" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>';
  tt.textContent=title;op.href=href;dlg.classList.add('on');last=document.activeElement;dlg.querySelector('.yt-close').focus()}
 function close(){dlg.classList.remove('on');fr.innerHTML='';if(last)last.focus()}
 vids.forEach(function(a){a.addEventListener('click',function(ev){if(ev.ctrlKey||ev.metaKey||ev.shiftKey)return;ev.preventDefault();S.seen[a.dataset.id]=1;save();mark();
  play('https://www.youtube-nocookie.com/embed/'+a.dataset.id+'?autoplay=1&rel=0',a.querySelector('.yt-tt').textContent,a.href)})});
 [].forEach.call(document.querySelectorAll('.yt-all'),function(a){a.addEventListener('click',function(ev){if(ev.ctrlKey||ev.metaKey)return;ev.preventDefault();
  play('https://www.youtube-nocookie.com/embed/videoseries?list='+a.dataset.list+'&autoplay=1&rel=0',a.closest('.yt-pl').querySelector('h3').firstChild.textContent.trim(),a.href)})});
 dlg.querySelector('.yt-close').onclick=close;dlg.addEventListener('click',function(ev){if(ev.target===dlg)close()});
 document.addEventListener('keydown',function(ev){if(ev.key==='Escape'&&dlg.classList.contains('on'))close()});
 var h=decodeURIComponent(location.hash.slice(1)),hk=h.indexOf('pl-')===0?chips.filter(function(c){return c.dataset.k.split(':')[1]===h.slice(3)})[0]:null;
 var k0=hk?hk.dataset.k:(S.k&&(S.k==='new'||chips.some(function(c){return c.dataset.k===S.k}))?S.k:'new');
 mark();show(k0,false);
})();</script>"""


def build():
    d = json.loads((HERE / "channel.json").read_text(encoding="utf-8"))
    if not check(d): sys.exit(1)
    groups = {"s": [], "t": []}
    for p in d["playlists"]:
        if not p["videos"]: continue
        groups["s" if any(w in p["title"] for w in STUDENT) else "t"].append(p)
    # 2026-11-27 선생님: 선생님·학부모용(교사연수·학부모교육·노동요 등)은 싣지 않음 — 그 재생목록의 영상은 '새로 올린 영상'에서도 뺌
    adult = {v["id"] for p in groups["t"] for v in p["videos"]}
    groups["t"] = []
    for p in groups["s"]:
        p["videos"] = [v for v in p["videos"] if not any(w in v["title"] for w in ADULT)]
        p["count"] = len(p["videos"]) if p["count"] <= 100 else p["count"]
    groups["s"] = [p for p in groups["s"] if p["videos"]]
    n_pl = sum(len(x) for x in groups.values())
    b = ['<nav class="crumb"><a class="back" href="../index.html">🏠 초등교사 홍지희</a></nav>',
         '<h1>📺 유튜브 영상</h1>',
         f'<p class="sub">초등교사 홍지희 유튜브 채널(@hongjihee1005)에 올린 영상을 모았어요. 영상을 누르면 이 화면에서 바로 볼 수 있어요.</p>',
         f'<p class="yt-note">재생목록 {n_pl}개 · {d["fetched"]} 기준 — 채널에서 하루에 한 번 저절로 새로 가져와요.</p>',
         '<div class="yt-bar"><div class="yt-seg" role="tablist" aria-label="묶음">'
         '<button type="button" role="tab" data-g="new">새로 올린 영상</button>'
         + (f'<button type="button" role="tab" data-g="s">재생목록 <small>{len(groups["s"])}</small></button>' if groups["s"] else "")
         + (f'<button type="button" role="tab" data-g="t">선생님·학부모용 <small>{len(groups["t"])}</small></button>' if groups["t"] else "")
         + '</div><input class="yt-find" type="search" placeholder="영상 제목 찾기" aria-label="영상 제목 찾기">'
         f'<a class="yt-ch" href="{CH}" target="_blank" rel="noopener">▶ 유튜브 채널 가기</a></div>',
         '<div class="yt-chips" aria-label="재생목록">' + "".join(
             f'<button type="button" data-g="{g}" data-k="{g}:{p["id"]}">{e(p["title"].replace("2022개정교육과정_", "").replace("_", " "))}<small>{p["count"]}</small></button>'
             for g in ("s", "t") for p in groups[g]) + '</div>']
    seen, new = set(), []
    for v in d["recent"] or d["latest"]:
        if v["id"] in seen or v["id"] in adult or any(w in v["title"] for w in ADULT): continue
        seen.add(v["id"]); new.append(v)
    b.append('<section class="yt-new"><div class="yt-plh"><h3>새로 올린 영상 <small>최근 ' + str(len(new)) + '편</small></h3>'
             f'<a class="yt-all" href="{CH}/videos" target="_blank" rel="noopener">채널에서 모두 보기 ↗</a></div>'
             '<ol class="yt-grid">' + "".join(card(v) for v in new) + '</ol></section>')
    for g in ("s", "t"):
        for p in groups[g]:
            b.append(pl_section(p, g))
    b.append('<p class="yt-none">찾는 영상이 없어요. <a href="' + CH + '/search" target="_blank" rel="noopener">유튜브 채널에서 찾기 ↗</a></p>')
    b.append('<div class="yt-dlg" role="dialog" aria-modal="true" aria-label="영상 보기"><div class="yt-box"><div class="yt-frame"></div>'
             '<div class="yt-foot"><b></b><a class="yt-open" href="#" target="_blank" rel="noopener">유튜브에서 보기 ↗</a>'
             '<button type="button" class="yt-close">✕ 닫기</button></div></div></div>')
    head = (SHELL / "head.html").read_text(encoding="utf-8").replace("{TITLE}", "유튜브 영상 · 초등교사 홍지희").replace("</head>", CSS + "</head>", 1)
    foot = (SHELL / "foot.html").read_text(encoding="utf-8").replace(
        "{FOOT}", "초등교사 홍지희 유튜브 채널의 영상 모음입니다. 영상은 유튜브에서 재생됩니다.").replace("</main>", "</main>" + JS, 1)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(head + "\n".join(b) + "\n" + foot, encoding="utf-8")
    subprocess.run([sys.executable, str(ROOT / "_build/theme/apply_theme.py"), str(OUT)], check=True)
    print(f"{OUT.relative_to(ROOT)}: 새 영상 {len(new)}편 · 재생목록 {n_pl}개(영상 {sum(len(p['videos']) for x in groups.values() for p in x)}편)")


if __name__ == "__main__":
    if sys.argv[1:] == ["check"]:
        sys.exit(0 if check(json.loads((HERE / "channel.json").read_text(encoding="utf-8"))) else 1)
    build()
