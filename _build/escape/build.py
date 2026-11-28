#!/usr/bin/env python3
"""기타 › 수학게임 › 수학 방탈출 페이지 만들기 (2026-10-07)

    python3 _build/escape/build.py          # project/escape/<방>.html (먼저 점검: 자물쇠 답을 chk로 다시 계산)
    python3 _build/escape/build.py check

방 자료 rooms.py, 화면 page.html·escape.js·escape.css(수학 교구실 page.css·shell.js를 같이 씀).
메뉴 project/escape/index.html은 손으로 고치는 메뉴(apply_theme.py). 고친 뒤 루트에서 python3 _build/theme/apply_content_theme.py.
"""
import re, sys, json, pathlib, html
HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[1]
OG = ROOT / '_build' / 'origami'
MT = ROOT / '_build' / 'mathtools'
OUT = ROOT / 'project' / 'escape'
sys.dont_write_bytecode = True
sys.path.insert(0, str(HERE))
from rooms import ROOMS, ORDER, ONLY

LTYPES = {'num', 'dir', 'color', 'shape'}
ARTS = None

def artsrc():
    """art.js + 주제마다 더한 그림 art_<주제>.js(ART.A.이름 = function …)"""
    return ''.join(f.read_text(encoding='utf-8') + '\n' for f in [HERE / 'art.js'] + sorted(HERE.glob('art_*.js')))

def arts():
    global ARTS
    if ARTS is None: ARTS = set(re.findall(r'\bA\.(\w+) = function', artsrc()))
    return ARTS

def check():
    """구조 점검 + flow 차례대로 따라가 탈출할 수 있는지(가방 물건·먼저 열 것·장면 이동) + 자물쇠 답 = chk"""
    bad = []
    for r in ROOMS:
        rid = r['id']; objs = {}; scene_of = {}
        for sc in r['scenes']:
            for o in sc['objs']:
                if o['id'] in objs: bad.append(f'{rid}: 물건 id 겹침 {o["id"]}')
                objs[o['id']] = o; scene_of[o['id']] = sc['id']
                if o['art'] not in arts(): bad.append(f'{rid} {o["id"]}: 그림 {o["art"]} 없음')
                if o.get('in'):
                    pa = next((q for q in sc['objs'] if q['id'] == o['in']), None)
                    if not pa: bad.append(f'{rid} {o["id"]}: 숨은 곳의 부모 {o["in"]}가 같은 장면에 없음')
                    elif not (0 <= o['x'] and o['x'] + o['w'] <= pa['w'] and -20 <= o['y'] and o['y'] + o['h'] <= pa['h'] + 10): bad.append(f'{rid} {o["id"]}: 부모 그림 밖으로 나감')
                    elif min(o['w'], o['h']) < 30: bad.append(f'{rid} {o["id"]}: 숨은 곳이 너무 작음(30 미만)')
                elif not (0 <= o['x'] and o['x'] + o['w'] <= 1000 and 0 <= o['y'] and o['y'] + o['h'] <= 560): bad.append(f'{rid} {o["id"]}: 방 그림 밖으로 나감')
                for f in ('lookFig', 'afterFig'):
                    if f in o and o[f]['art'] not in arts(): bad.append(f'{rid} {o["id"]}: {f} 그림 없음')
                if o.get('need') and o['need'] not in r['items']: bad.append(f'{rid} {o["id"]}: 없는 물건 {o["need"]}')
                for g in o.get('give', []):
                    if g not in r['items']: bad.append(f'{rid} {o["id"]}: 없는 물건 {g}')
                L = o.get('lock')
                if L:
                    if L['t'] not in LTYPES: bad.append(f'{rid} {o["id"]}: 자물쇠 종류 {L["t"]}')
                    if not (2 <= len(L['hints']) <= 3): bad.append(f'{rid} {o["id"]}: 힌트 {len(L["hints"])}개')
                    if L['t'] == 'num' and not (isinstance(L['code'], str) and L['code'].isdigit() and 1 <= len(L['code']) <= 5): bad.append(f'{rid} {o["id"]}: 숫자 답 {L["code"]!r}')
                    if L['t'] != 'num':
                        if not isinstance(L['code'], list) or not (2 <= len(L['code']) <= 6): bad.append(f'{rid} {o["id"]}: 답 목록 {L["code"]!r}')
                        opts = L.get('opts') or {'dir': ['↑', '→', '↓', '←'], 'shape': ['○', '△', '□', '☆'], 'color': ['빨강', '노랑', '초록', '파랑']}[L['t']]
                        if any(v not in opts for v in L['code']): bad.append(f'{rid} {o["id"]}: 답 {L["code"]}가 고를 것 {opts}에 없음')
                    if L.get('chk') is None: bad.append(f'{rid} {o["id"]}: chk 없음')
                    else:
                        got = L['chk']()
                        got = (str(got) if L['t'] == 'num' else list(got))
                        if L['t'] == 'num' and len(got) < len(L['code']): got = got.zfill(len(L['code']))
                        if got != L['code']: bad.append(f'{rid} {o["id"]}: 답 {L["code"]} ≠ 계산 {got}')
                if o.get('go') not in (None, 'exit') and o['go'] not in [s['id'] for s in r['scenes']]: bad.append(f'{rid} {o["id"]}: 없는 장면 {o["go"]}')
                if not o.get('guide'): bad.append(f'{rid} {o["id"]}: guide 없음')
        for sc in r['scenes']:
            os_ = [q for q in sc['objs'] if not q.get('in')]
            for i in range(len(os_)):
                for j in range(i + 1, len(os_)):
                    a_, b_ = os_[i], os_[j]
                    if set(a_.get('req', [])) != set(b_.get('req', [])) and (b_['id'] in a_.get('req', []) or a_['id'] in b_.get('req', [])): continue
                    ix = max(0, min(a_['x'] + a_['w'], b_['x'] + b_['w']) - max(a_['x'], b_['x'])); iy = max(0, min(a_['y'] + a_['h'], b_['y'] + b_['h']) - max(a_['y'], b_['y']))
                    if ix * iy > 0.12 * min(a_['w'] * a_['h'], b_['w'] * b_['h']): bad.append(f'{rid} {sc["id"]}: {a_["id"]}·{b_["id"]} 그림이 많이 겹침')
        comb = {}
        for c in r.get('combine', []):
            for k in ('a', 'b', 'make'):
                if c[k] not in r['items']: bad.append(f'{rid}: 합치기의 없는 물건 {c[k]}')
            comb[frozenset((c['a'], c['b']))] = c
        if r.get('story') is not None and not (1 <= len(r['story']) <= 5): bad.append(f'{rid}: 이야기 줄 {len(r["story"])}개')
        # 따라가 보기
        inv, done, scenes = set(), set(), {r['scenes'][0]['id']}
        def opened(q):
            o_ = objs[q]
            return (not (o_.get('lock') or o_.get('need')) or q in done) and all(x in done for x in o_.get('req', [])) and (not o_.get('in') or opened(o_['in']))
        for oid in r['flow']:
            if '+' in oid:
                a_, b_ = oid.split('+'); c = comb.get(frozenset((a_, b_)))
                if not c: bad.append(f'{rid}: flow의 합치기 {oid}가 combine에 없음'); break
                if not (a_ in inv and b_ in inv): bad.append(f'{rid}: 합치기 {oid} 때 가방에 둘 다 없음'); break
                inv -= {a_, b_}; inv.add(c['make']); continue
            if oid not in objs: bad.append(f'{rid}: flow에 없는 물건 {oid}'); break
            o = objs[oid]
            if scene_of[oid] not in scenes: bad.append(f'{rid}: {oid}에 갈 수 없음(장면 {scene_of[oid]} 아직 잠김)'); break
            if any(q not in done for q in o.get('req', [])): bad.append(f'{rid}: {oid}가 아직 안 보임(req {o["req"]})'); break
            if o.get('in') and not opened(o['in']): bad.append(f'{rid}: {oid}의 부모 {o["in"]}가 아직 안 열림'); break
            if o.get('need'):
                if o['need'] not in inv: bad.append(f'{rid}: {oid}에 쓸 {o["need"]}이 가방에 없음'); break
                if not r['items'][o['need']].get('keep'): inv.discard(o['need'])
            inv |= set(o.get('give', [])); done.add(oid)
            if o.get('go') and o['go'] != 'exit': scenes.add(o['go'])
        else:
            if not any(objs[x].get('go') == 'exit' for x in done): bad.append(f'{rid}: flow를 따라가도 탈출 문(go=exit)에 닿지 않음')
        for c in r.get('combine', []):
            if not any(f in (c['a'] + '+' + c['b'], c['b'] + '+' + c['a']) for f in r['flow']): bad.append(f'{rid}: 합치기 {c["a"]}+{c["b"]}가 flow에 없음')
        locked = [x for x in objs if (objs[x].get('lock') or objs[x].get('need')) and x not in r['flow']]
        if locked: bad.append(f'{rid}: flow에 없는 자물쇠·장치 {locked}')
    return bad

def esc(s): return html.escape(str(s))
def plain(s): return esc(re.sub(r'\*\*(.+?)\*\*', r'\1', str(s)))

def sheet(r):
    objs = {o['id']: (o, sc['nm']) for sc in r['scenes'] for o in sc['objs']}
    rows = ''
    for i, oid in enumerate(r['flow'], 1):
        if '+' in oid:
            a_, b_ = oid.split('+'); c = next(x for x in r['combine'] if {x['a'], x['b']} == {a_, b_}); it = r['items']
            rows += f'<tr><td>{i}</td><td>가방</td><td>합치기: {esc(it[a_]["nm"])} + {esc(it[b_]["nm"])}</td><td></td><td>{esc(it[c["make"]]["nm"])}</td></tr>'; continue
        o, sn = objs[oid]; L = o.get('lock'); what = []
        if o.get('in'): sn += ' · ' + objs[o['in']][0]['nm'] + ' 속'
        if o.get('need'): what.append(f"가방의 {esc(r['items'][o['need']]['nm'])} 쓰기")
        if L: what.append({'num': '숫자', 'dir': '방향', 'color': '색깔', 'shape': '모양'}[L['t']] + ' 자물쇠: ' + plain(L['q']))
        if not what: what.append('살펴보기 — ' + plain(o.get('look', '')))
        ans = (L['code'] if L['t'] == 'num' else (' ' if L['t'] == 'dir' else ' → ').join(L['code'])) if L else ''
        gets = ', '.join(r['items'][g]['nm'] for g in o.get('give', []))
        rows += f'<tr><td>{i}</td><td>{esc(sn)} · {esc(o["nm"])}</td><td>{" / ".join(what)}</td><td><b>{esc(ans)}</b>{"<br><small>" + plain(L["sol"]) + "</small>" if L else ""}</td><td>{esc(gets)}</td></tr>'
    return (f'<div class="ep-pg"><div class="ep-hd"><b>{esc(r["title"])} · 선생님용 풀이 흐름</b><span>{esc(r["rec"])}</span></div>'
            f'<table class="ep-key"><tr><th>차례</th><th>곳 · 물건</th><th>할 일</th><th>답 · 풀이</th><th>얻는 것</th></tr>{rows}</table></div>')

def grade(r):
    m = re.search(r'추천 (\d)학년', r['rec'])
    if not m: raise SystemExit(f"{r['id']}: rec에 '추천 N학년'이 없음")
    return int(m.group(1))

def build(r):
    rd = lambda f: f.read_text(encoding='utf-8')
    g = grade(r)
    gnav = '<a href="index.html">모든 방</a>' + ''.join(f'<a href="{x["id"]}.html"' + (' aria-current="page"' if x is r else '') + f'>{x["title"]}</a>' for x in ROOMS if grade(x) == g)
    nlock = sum(1 for sc in r['scenes'] for o in sc['objs'] if o.get('lock') or o.get('need'))
    def strip(o):
        o = dict(o)
        if 'lock' in o: o['lock'] = {k: v for k, v in o['lock'].items() if k != 'chk'}
        return o
    data = dict(id=r['id'], idx=ORDER.index(r['id']), title=r['title'], intro=r['intro'], story=r.get('story', []), combine=r.get('combine', []), outro=r['outro'], items=r['items'], flow=r['flow'], scenes=[dict(sc, objs=[strip(o) for o in sc['objs']]) for sc in r['scenes']])
    rep = {'TITLE': r['title'], 'DESC': re.sub(r'\*\*(.+?)\*\*', r'\1', r['intro']), 'ICO': r['ico'], 'SUB': f'추천 {g}학년 · 자물쇠와 장치 {nlock}개', 'MATH': ''.join(f'<span>{esc(x)}</span>' for x in re.sub(r'^추천 \d학년\s*·\s*', '', r['rec']).split('·')), 'GNAV': gnav, 'SHEET': sheet(r),
           'DATA': json.dumps(data, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/'), 'TOOL': artsrc() + rd(HERE / 'escape.js'), 'SHELL': rd(MT / 'shell.js'),
           'CSS': rd(MT / 'page.css').replace('{ACC}', r['acc']).replace('{TOOLCSS}', rd(HERE / 'escape.css')), 'HEADSNIP': rd(OG / 'head_snip.html'),
           'FOOT': rd(OG / 'foot.html').replace('쉬는 시간에 친구와 함께 즐기는 종이접기 자료입니다.', '수학 문제로 자물쇠를 여는 방탈출 자료입니다.'),
           'HOMEFRAG': rd(OG / 'home.html').replace('{HOME}', '../../index.html')}
    s = re.sub(r'\{([A-Z]+)\}', lambda m: rep.get(m.group(1), m.group(0)), rd(HERE / 'page.html'))
    out = OUT / f"{r['id']}.html"; out.parent.mkdir(parents=True, exist_ok=True)
    old = out.read_text(encoding='utf-8') if out.exists() else ''
    strip = lambda x: re.sub(r'<!--hj-c(?:theme|icons)-->.*?<!--/hj-c(?:theme|icons)-->', '', x, flags=re.S)
    if strip(old) == s: return False
    out.write_text(s, encoding='utf-8'); return True

def build_board():
    """모둠 대항 점수판 project/escape/board.html"""
    rd = lambda f: f.read_text(encoding='utf-8')
    data = dict(rooms=[dict(i=ORDER.index(r['id']), id=r['id'], title=r['title'], acc=r['acc'], n=sum(1 for sc in r['scenes'] for o in sc['objs'] if o.get('lock') or o.get('need'))) for r in ROOMS])
    rep = {'DATA': json.dumps(data, ensure_ascii=False, separators=(',', ':')), 'TOOL': rd(HERE / 'board.js'), 'SHELL': rd(MT / 'shell.js'),
           'CSS': rd(MT / 'page.css').replace('{ACC}', '#7B4FB0').replace('{TOOLCSS}', rd(HERE / 'board.css')), 'HEADSNIP': rd(OG / 'head_snip.html'),
           'FOOT': rd(OG / 'foot.html').replace('쉬는 시간에 친구와 함께 즐기는 종이접기 자료입니다.', '수학 방탈출을 모둠끼리 겨룰 때 쓰는 점수판입니다.'),
           'HOMEFRAG': rd(OG / 'home.html').replace('{HOME}', '../../index.html')}
    s = re.sub(r'\{([A-Z]+)\}', lambda m: rep.get(m.group(1), m.group(0)), rd(HERE / 'boardpage.html'))
    out = OUT / 'board.html'; old = out.read_text(encoding='utf-8') if out.exists() else ''
    strip = lambda x: re.sub(r'<!--hj-c(?:theme|icons)-->.*?<!--/hj-c(?:theme|icons)-->', '', x, flags=re.S)
    if strip(old) == s: return False
    out.write_text(s, encoding='utf-8'); return True

def build_menu():
    """메뉴 project/escape/index.html의 방 카드 묶음(<!--esc-rooms-->…)을 학년별(1~6학년)로 다시 씀 — 학년은 rec의 '추천 N학년'. 고친 뒤 apply_theme.py"""
    p = OUT / 'index.html'; s = p.read_text(encoding='utf-8')
    a, b = '<!--esc-rooms-->', '<!--/esc-rooms-->'
    if a not in s: return False
    by = {}
    for r in ROOMS:
        m = re.search(r'추천 (\d)학년', r['rec'])
        if not m: raise SystemExit(f"{r['id']}: rec에 '추천 N학년'이 없음")
        by.setdefault(int(m.group(1)), []).append(r)
    h = ''
    for g in sorted(by):
        h += f'\n<h2 class="sec-h">{g}학년</h2>\n<div class="grid g3 three">\n'
        for r in sorted(by[g], key=lambda r: ORDER.index(r['id'])):
            intro = re.sub(r'\*\*(.+?)\*\*', r'\1', r['intro'])
            h += f'<a class="card room" style="--acc:{r["acc"]}" href="{r["id"]}.html"><span class="ico">{r["ico"]}</span><span class="nm">{esc(r["title"])}</span><small>{esc(intro)} · {esc(r["rec"])}</small></a>\n'
        h += '</div>\n'
    i, j = s.index(a) + len(a), s.index(b)
    if s[i:j] == h: return False
    p.write_text(s[:i] + h + s[j:], encoding='utf-8'); return True

if __name__ == '__main__':
    bad = check()
    if bad: print('\n'.join(bad)); sys.exit('수학 방탈출 점검 실패')
    print('수학 방탈출 점검 통과 —', ', '.join(f"{r['title']} 자물쇠·장치 {sum(1 for sc in r['scenes'] for o in sc['objs'] if o.get('lock') or o.get('need'))}개" for r in ROOMS))
    if sys.argv[1:] == ['check']: sys.exit(0)
    n = sum(build(r) for r in ROOMS) + (0 if ONLY else build_board())
    if not ONLY and build_menu(): print('메뉴 학년별 카드 다시 씀 — apply_theme.py project/escape/index.html')
    print(f'수학 방탈출 {n}쪽 다시 만듦 (모두 {len(ROOMS)}방)')
