#!/usr/bin/env python3
"""3학년 수학 영상 메뉴(grade3/math/videos/index.html)를 만듭니다.

    python3 _build/video3/build.py          # 만들고 메뉴 디자인(apply_theme)까지
    python3 _build/video3/build.py check    # 점검만

영상 목록·유튜브 주소는 videos.py. 메뉴 HTML을 직접 고치지 마세요.
"""
import html, pathlib, re, subprocess, sys, urllib.parse
HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[1]
sys.path.insert(0, str(HERE))
import videos as V

OUT = ROOT / 'grade3/math/videos/index.html'
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

def card(e):
    n, code, ch, title = e
    u = V.LINKS.get(code) or V.CHANNEL + '/search?query=' + urllib.parse.quote(title)
    how = '' if code in V.LINKS else ''
    return (f'<a class="card room" href="{html.escape(u)}" target="_blank" rel="noopener">'
            f'<span class="ico">🎬</span><span class="nm">{html.escape(title)}</span><small>{n}화 · {ch}차시{how}</small></a>')

def build():
    total = len(V.EPISODES); up = sum(1 for e in V.EPISODES if e[1] in V.LINKS)
    b = ['<nav class="crumb"><a class="back" href="../../../index.html">🏠 초등교사 홍지희</a> '
         '<a class="back" href="../../index.html">3학년</a> <a class="back" href="../index.html">수학</a></nav>',
         '<h1>🎬 수학 원리 돋보기</h1>',
         f'<p class="sub">3학년 수학의 개념·계산 방법·원리를 움직이는 그림으로 설명하는 영상이에요(편마다 2~3분). '
         f'모두 {total}편, 교과서 단원 차례로 모았어요. 카드를 누르면 새 창에서 유튜브 채널이 열리고 그 영상을 찾아 보여 줘요.</p>']
    if V.PLAYLIST:
        b.append('<div class="grid list"><a class="card room wide" href="' + html.escape(V.PLAYLIST) +
                 '" target="_blank" rel="noopener"><span class="head"><span class="ico">📺</span><span class="nm">재생목록 전체 보기</span></span>'
                 '<span class="sum">유튜브 채널 @hongjihee1005의 재생목록 · 단원별로 이어서 보기</span></a></div>')
    for sem in ('1', '2'):
        for u, name in V.UNITS:
            if u[0] != sem: continue
            eps = [e for e in V.EPISODES if unit(e[1]) == u]
            eps.sort(key=lambda e: int(re.split(r'\D', e[2])[0]))
            b.append(f'<h2>{sem}학기 {u[2]}단원 · {name}</h2>')
            b.append('<div class="grid g3 three">' + ''.join(card(e) for e in eps) + '</div>')
    head = (HERE / 'head.html').read_text(encoding='utf-8').replace('{TITLE}', '수학 원리 돋보기 · 3학년 수학 · 초등교사 홍지희')
    foot = (HERE / 'foot.html').read_text(encoding='utf-8').replace('{FOOT}', '3학년 수학 개념을 설명하는 영상 모음입니다. 영상은 유튜브 @hongjihee1005 채널에 있습니다.')
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(head + '\n'.join(b) + '\n' + foot, encoding='utf-8')
    subprocess.run([sys.executable, str(ROOT / '_build/theme/apply_theme.py'), str(OUT)], check=True)
    print(f'{OUT.relative_to(ROOT)}: {total}편 (영상 주소 {up}편, 나머지는 채널 검색)')

if __name__ == '__main__':
    ok = check()
    if not ok: sys.exit(1)
    if sys.argv[1:] != ['check']: build()
