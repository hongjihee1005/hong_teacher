#!/usr/bin/env python3
"""기타 › 수학게임 › 수학자 이야기 페이지 만들기 (2026-10-07)

    python3 _build/mathpeople/build.py          # project/mathpeople/<인물>.html (먼저 점검)
    python3 _build/mathpeople/build.py check    # 점검만

인물 자료는 people.py, 화면 page.html·page.css·app.js(해 보기 위젯 W.<이름>·확인 문제·인쇄).
아래쪽 '만든 사람'·홈 단추 조각은 _build/origami/의 것을 같이 씀. 메뉴 project/mathpeople/index.html은 손으로 고치는 메뉴(apply_theme.py).
고친 뒤 루트에서 python3 _build/theme/apply_content_theme.py (자동 보완 run_all.py에도 들어 있음).
"""
import re, sys, json, pathlib, html
HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[1]
OG = ROOT / '_build' / 'origami'
OUT = ROOT / 'project' / 'mathpeople'
sys.dont_write_bytecode = True
sys.path.insert(0, str(HERE))
from people import PEOPLE, ERAS

def check():
    bad, ids = [], set()
    app = (HERE / 'app.js').read_text(encoding='utf-8')
    eras = {e[0] for e in ERAS}
    for p in PEOPLE:
        i = p['id']
        if i in ids or not re.fullmatch(r'[a-z]+', i): bad.append(f'{i}: id'); ids.add(i)
        ids.add(i)
        for k in ('name', 'en', 'life', 'place', 'ico', 'acc', 'era', 'nick', 'story', 'finds', 'act', 'quiz', 'keep', 'src'):
            if not p.get(k): bad.append(f'{i}: {k} 빔')
        if p['era'] not in eras: bad.append(f'{i}: era')
        if 'W.' + p['act']['w'] + ' = ' not in app: bad.append(f"{i}: 위젯 {p['act']['w']} 없음")
        if len(p['quiz']) != 3: bad.append(f'{i}: 확인 문제 3개가 아님')
        for q in p['quiz']:
            if len(q[1]) != 4 or not 0 <= q[2] < 4 or len(set(q[1])) != 4: bad.append(f'{i}: 문제 보기·정답 "{q[0]}"')
        for name, url in p['src']:
            if not url.startswith('https://'): bad.append(f'{i}: 출처 주소 {url}')
        a = p['act']
        if a['w'] == 'shadow':
            for it in a['items']:
                if it['big'] * it['stick'] != it['a'] * it['sh']: bad.append(f'{i}: 그림자 답 {it}')
        if a['w'] == 'seq':
            s = a['seq']
            if any(s[k] != s[k - 1] + s[k - 2] for k in range(2, len(s))): bad.append(f'{i}: 피보나치 수')
        if a['w'] == 'multi':
            pr = lambda n: n > 1 and all(n % d for d in range(2, int(n ** .5) + 1))
            if sorted(a['ok']) != sorted(n for n in a['nums'] if pr(n) and pr(2 * n + 1)): bad.append(f'{i}: 제르맹 소수')
    return bad

def esc(s): return html.escape(s, quote=True)

def sheet(p):
    """인쇄: 1쪽 읽기 자료 + '가장 놀라운 점' 쓰기, 2쪽 확인 문제 + 질문 쓰기"""
    hd = lambda t: f'<div class="ws-hd"><b>수학자 이야기 · {p["name"]}</b><span>{t}</span></div>'
    s = '<div class="ws-pg">' + hd('____학년 ____반 ____번 이름 ____________')
    s += f'<p><b>{esc(p["en"])}</b> · {esc(p["life"])} · {esc(p["place"])}</p><p><b>{esc(p["nick"])}</b></p><h3>삶 이야기</h3>' + ''.join(f'<p>{t}</p>' for t in p['story'])
    s += '<h3>이런 것을 발견했어요</h3>' + ''.join(f'<p>• <b>{esc(a)}</b> — {esc(b)}</p>' for a, b in p['finds'])
    s += '<div class="ws-wr"><h3>✏️ 이 수학자의 이야기에서 가장 놀라운 점과 그 까닭을 써 보세요.</h3><div></div></div><p class="ws-ft">수학자 이야기 · 초등교사 홍지희</p></div>'
    s += '<div class="ws-pg">' + hd('확인 문제') + ''.join(
        f'<div class="ws-q"><p><b>{n}.</b> {esc(q[0])}</p><p>' + ''.join(f'<span>{"①②③④"[k]} {esc(o)}</span>' for k, o in enumerate(q[1])) + '</p></div>' for n, q in enumerate(p['quiz'], 1))
    s += '<h3>📌 기억해요</h3>' + ''.join(f'<p>• {esc(t)}</p>' for t in p['keep'])
    s += '<div class="ws-wr"><h3>✏️ 이 수학자를 만난다면 묻고 싶은 질문을 써 보세요.</h3><div></div></div>'
    s += '<p class="ws-ft">정답: ' + ' · '.join(f'{n}번 {"①②③④"[q[2]]}' for n, q in enumerate(p['quiz'], 1)) + ' (선생님용 — 잘라서 쓰세요)</p></div>'
    return s

def build(p, k):
    rd = lambda f: f.read_text(encoding='utf-8')
    gnav = ''.join(f'<a href="{x["id"]}.html"' + (' aria-current="page"' if x is p else '') + f'>{x["name"]}</a>' for x in PEOPLE)
    prv, nxt = PEOPLE[k - 1] if k else None, PEOPLE[k + 1] if k + 1 < len(PEOPLE) else None
    pn = (f'<a href="{prv["id"]}.html">← {prv["name"]}</a>' if prv else '<span></span>') + (f'<a href="{nxt["id"]}.html">{nxt["name"]} →</a>' if nxt else '<a href="index.html">수학자 목록 →</a>')
    data = json.dumps(dict(p={x: p[x] for x in ('id', 'name', 'act', 'quiz')}), ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
    rep = {'NAME': p['name'], 'DESC': f'{p["name"]}({p["en"]}) — {p["nick"]}. 삶 이야기, 해 보기 활동, 확인 문제.', 'ICO': p['ico'], 'EN': esc(p['en']),
           'LIFE': esc(p['life']), 'PLACE': esc(p['place']), 'NICK': esc(p['nick']), 'GNAV': gnav, 'PN': pn,
           'STORY': ''.join(f'<p>{t}</p>' for t in p['story']),
           'FINDS': ''.join(f'<div class="mp-find"><h3>{esc(a)}</h3><p>{esc(b)}</p></div>' for a, b in p['finds']),
           'KEEP': ''.join(f'<li>{esc(t)}</li>' for t in p['keep']),
           'SRC': ''.join(f'<li><a href="{esc(u)}" target="_blank" rel="noopener">{esc(n)}</a></li>' for n, u in p['src']),
           'SHEET': sheet(p), 'DATA': data, 'APP': rd(HERE / 'app.js'),
           'CSS': rd(HERE / 'page.css').replace('{ACC}', p['acc']), 'HEADSNIP': rd(OG / 'head_snip.html'),
           'FOOT': rd(OG / 'foot.html').replace('쉬는 시간에 친구와 함께 즐기는 종이접기 자료입니다.', '수학을 만든 사람들의 이야기를 읽고 직접 해 보는 자료입니다.'),
           'HOMEFRAG': rd(OG / 'home.html').replace('{HOME}', '../../index.html')}
    s = re.sub(r'\{([A-Z]+)\}', lambda m: rep.get(m.group(1), m.group(0)), rd(HERE / 'page.html'))
    out = OUT / f"{p['id']}.html"; out.parent.mkdir(parents=True, exist_ok=True)
    old = out.read_text(encoding='utf-8') if out.exists() else ''
    strip = lambda t: re.sub(r'<!--hj-c(?:theme|icons)-->.*?<!--/hj-c(?:theme|icons)-->', '', t, flags=re.S)
    if strip(old) == s: return False
    out.write_text(s, encoding='utf-8'); return True

if __name__ == '__main__':
    bad = check()
    if bad: print('\n'.join(bad)); sys.exit('수학자 이야기 점검 실패')
    print('수학자 이야기 점검 통과')
    if sys.argv[1:] == ['check']: sys.exit(0)
    n = sum(build(p, k) for k, p in enumerate(PEOPLE))
    print(f'수학자 이야기 {n}쪽 다시 만듦 (모두 {len(PEOPLE)}명)')
