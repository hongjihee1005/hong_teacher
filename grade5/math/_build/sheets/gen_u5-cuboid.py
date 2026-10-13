# -*- coding: utf-8 -*-
"""5-2 수학 5. 직육면체 활동지(교과서 차시 버전·이야기 버전 × 기본형·도전형) 만들기

    python3 gen_u5-cuboid.py          # 두 버전 모두(이야기 버전 원본이 없으면 교과서 버전만)
    python3 gen_u5-cuboid.py tb       # 교과서 차시 버전만
    python3 gen_u5-cuboid.py st       # 이야기 버전만

앱 원본 ../units/sem2/u5-cuboid.tb.js('연서의 국제 물류 센터 견학', 9차시)와 u5-cuboid.st.js('우리 반 선물 상자 공방', 9차시)의
차시 번호·제목·S.O.O.P.·탐구 질문·이야기·수를 그대로 따릅니다.

  - 앱의 계산 핵심(cb5Fold: 전개도 접기, cb5NetFromCells, cb5LabNet, cb5PartNet, 겹치는 점·선분 찾기)을 파이썬으로 그대로 옮겨,
    전개도가 되는지·겹치는 점과 선분·마주 보는 면·붙일 자리·접는 선 수를 이 스크립트가 계산하고 앱의 정답 글과 assert로 맞춥니다.
  - 겨냥도는 앱과 같은 방법(cb5Prism 빗각 그림·cb5Solid 돌린 그림)으로 그려 보이지 않는 모서리를 점선으로, 길이·꼭짓점 이름을
    앱과 같은 자리에 적습니다. 전개도는 앱의 면 자료 그대로 그립니다.
  - 전개도를 그리는 문제는 실제 크기 모눈(한 칸 = 1 cm, 100%로 인쇄)입니다.
  - 그림은 SVG로 그려 임시 폴더에서 PNG로 바꿉니다(저장소에는 남기지 않음).
"""
import math
import os
import shutil
import sys
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from hwpxgen import Sheet, svg_to_png, check  # noqa: E402

ROOT = os.path.normpath(os.path.join(HERE, '..', '..'))      # grade5/math
UNITS = os.path.join(ROOT, '_build', 'units', 'sem2')
OUT_TB = os.path.join(ROOT, 'sem2', 'sheets')
OUT_ST = os.path.join(ROOT, 'sem2-soop', 'sheets')
NAME = '5단원_직육면체_활동지_%s.hwpx'
FONT = "'Noto Sans KR','WenQuanYi Zen Hei',sans-serif"
NUM = '①②③④⑤⑥⑦'
WORK = tempfile.mkdtemp(prefix='u5cub_')
_FIG = {}

INK, GRID, BLUE, RED, GREEN, ORG, GRAY = '#1D2A2A', '#BFCCD8', '#2B7BD6', '#D64545', '#2E8B57', '#E47A38', '#8795A1'
PAR = '#9CC3F0'
KO = list('ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎ')
GA = ['가', '나', '다', '라', '마', '바']


# ================================================================ 앱 계산 핵심(u5-cuboid.tb.js와 같은 방법)
# 꼭짓점 번호: x(가로, 오른쪽)=1, y(높이, 위)=2, z(깊이, 뒤)=4
FACES = [[0, 1, 3, 2], [4, 5, 7, 6], [0, 4, 6, 2], [1, 5, 7, 3], [0, 1, 5, 4], [2, 3, 7, 6]]   # 앞·뒤·왼·오른·아래·위
OPP = [1, 0, 3, 2, 5, 4]
EDGES = [(v, v | b) for v in range(8) for b in (1, 2, 4) if not v & b]
LAB = {6: 'ㄱ', 2: 'ㄴ', 3: 'ㄷ', 7: 'ㄹ', 4: 'ㅁ', 0: 'ㅂ', 1: 'ㅅ', 5: 'ㅇ'}
FTXT = ['면 ㄴㅂㅅㄷ', '면 ㄱㅁㅇㄹ', '면 ㄱㄴㅂㅁ', '면 ㄷㅅㅇㄹ', '면 ㅁㅂㅅㅇ', '면 ㄱㄴㄷㄹ']


def eq(a, b):
    return abs(a - b) < 1e-6


def R(x, y, w, h):
    return {'x': x, 'y': y, 'w': w, 'h': h}


def SQ(cells):
    return [R(x, y, 1, 1) for x, y in cells]


def contacts(F):
    C = []
    for i in range(len(F)):
        for j in range(i + 1, len(F)):
            a, b = F[i], F[j]

            def ov(p0, p1, q0, q1):
                return min(p1, q1) - max(p0, q0)
            seg = None
            if eq(a['x'] + a['w'], b['x']) or eq(b['x'] + b['w'], a['x']):
                X = b['x'] if eq(a['x'] + a['w'], b['x']) else a['x']
                o = ov(a['y'], a['y'] + a['h'], b['y'], b['y'] + b['h'])
                if o > 1e-6:
                    seg = {'A': (X, max(a['y'], b['y'])), 'B': (X, min(a['y'] + a['h'], b['y'] + b['h'])),
                           'full': eq(a['y'], b['y']) and eq(a['h'], b['h'])}
            elif eq(a['y'] + a['h'], b['y']) or eq(b['y'] + b['h'], a['y']):
                Y = b['y'] if eq(a['y'] + a['h'], b['y']) else a['y']
                o = ov(a['x'], a['x'] + a['w'], b['x'], b['x'] + b['w'])
                if o > 1e-6:
                    seg = {'A': (max(a['x'], b['x']), Y), 'B': (min(a['x'] + a['w'], b['x'] + b['w']), Y),
                           'full': eq(a['x'], b['x']) and eq(a['w'], b['w'])}
            if seg:
                seg.update(i=i, j=j)
                C.append(seg)
    return C


def overlap(a, b):
    return (min(a['x'] + a['w'], b['x'] + b['w']) - max(a['x'], b['x']) > 1e-6 and
            min(a['y'] + a['h'], b['y'] + b['h']) - max(a['y'], b['y']) > 1e-6)


def _k(x, y):
    return (round(x, 6), round(y, 6))


def fold(F):
    """cb5Fold: {ok, why, tree, corner, cube, L, pt}"""
    n = len(F)
    res = {'ok': False, 'why': '', 'tree': [None] * n, 'corner': [], 'cube': [], 'L': {}, 'pt': {}}
    for i in range(n):
        for j in range(i + 1, n):
            if overlap(F[i], F[j]):
                res['why'] = 'plane'
                return res
    C = contacts(F)
    seen, adj = [0], [[] for _ in F]
    for c in C:
        adj[c['i']].append(c)
        adj[c['j']].append(c)
    q = [0]
    while q:
        f = q.pop(0)
        for c in adj[f]:
            g = c['j'] if c['i'] == f else c['i']
            if g not in seen:
                seen.append(g)
                q.append(g)
                res['tree'][g] = {'p': f, 'c': c}
    if n != 6:
        res['why'] = 'few' if n < 6 else 'many'
        return res
    if len(seen) < n:
        res['why'] = 'apart'
        return res
    if any(not c['full'] for c in C):
        res['why'] = 'partial'
        return res
    if len(C) != 5:
        res['why'] = 'overlap'
        return res
    corner = [None] * n
    corner[0] = [0, 1, 3, 2]
    for g in seen[1:]:
        f = res['tree'][g]['p']
        NW, NE, SE, SW = corner[f]
        a, b = F[f], F[g]
        mask = 7 & ~((NW ^ NE) | (NW ^ SE) | (NW ^ SW))
        if eq(a['x'] + a['w'], b['x']):
            corner[g] = [NE, NE ^ mask, SE ^ mask, SE]
        elif eq(b['x'] + b['w'], a['x']):
            corner[g] = [NW ^ mask, NW, SW, SW ^ mask]
        elif eq(a['y'] + a['h'], b['y']):
            corner[g] = [SW, SE, SE ^ mask, SW ^ mask]
        else:
            corner[g] = [NW ^ mask, NE ^ mask, NE, NW]
    res['corner'] = corner
    if len(set(tuple(sorted(c)) for c in corner)) < 6:
        res['why'] = 'overlap'
        return res
    cube = []
    for c in corner:
        cst = next(b for b in (1, 2, 4) if all((v & b) == (c[0] & b) for v in c))
        cube.append({1: 3 if c[0] & 1 else 2, 2: 5 if c[0] & 2 else 4, 4: 1 if c[0] & 4 else 0}[cst])
    res['cube'] = cube
    L = {}
    for f in range(n):
        NW, NE, _, SW = corner[f]
        for bit, ln in ((NW ^ NE, F[f]['w']), (NW ^ SW, F[f]['h'])):
            if bit not in L:
                L[bit] = ln
            elif not eq(L[bit], ln):
                res['why'] = 'length'
                res['L'] = L
                return res
    res['L'] = L
    for f, r in enumerate(F):
        NW, NE, SE, SW = corner[f]
        for x, y, v in ((r['x'], r['y'], NW), (r['x'] + r['w'], r['y'], NE), (r['x'] + r['w'], r['y'] + r['h'], SE),
                        (r['x'], r['y'] + r['h'], SW)):
            res['pt'][_k(x, y)] = v
    res['ok'] = True
    return res


def ok(F):
    return fold(F)['ok']


def net_from_cells(cells, dims):
    sq = SQ(cells)
    fd = fold(sq)
    assert fd['ok'], cells
    Rr = [None] * len(cells)

    def size(f):
        NW, NE, _, SW = fd['corner'][f]
        return dims[NW ^ NE], dims[NW ^ SW]
    w0, h0 = size(0)
    Rr[0] = R(0, 0, w0, h0)
    seen = {0}
    while len(seen) < len(cells):
        for g in range(len(cells)):
            t = fd['tree'][g]
            if g in seen or not t or t['p'] not in seen:
                continue
            p = t['p']
            w, hh = size(g)
            P = Rr[p]
            px, py = cells[p]
            gx, gy = cells[g]
            if gx > px:
                Rr[g] = R(P['x'] + P['w'], P['y'], w, hh)
            elif gx < px:
                Rr[g] = R(P['x'] - w, P['y'], w, hh)
            elif gy > py:
                Rr[g] = R(P['x'], P['y'] + P['h'], w, hh)
            else:
                Rr[g] = R(P['x'], P['y'] - hh, w, hh)
            seen.add(g)
    mx, my = min(r['x'] for r in Rr), min(r['y'] for r in Rr)
    return [R(r['x'] - mx, r['y'] - my, r['w'], r['h']) for r in Rr]


def lab_net(cells, dims, grid):
    F = net_from_cells(cells, dims)
    P = []
    for i, j, nm in grid:
        c = next(ci for ci, (x, y) in enumerate(cells) if i in (x, x + 1) and j in (y, y + 1))
        r = F[c]
        P.append((r['x'] if i == cells[c][0] else r['x'] + r['w'], r['y'] if j == cells[c][1] else r['y'] + r['h'], nm))
    return F, P


def part_net(cells, dims, rm, cands, names):
    Rr = net_from_cells(cells, dims)
    F = [r for i, r in enumerate(Rr) if i != rm]
    C = []
    for i, c in enumerate(cands):
        if not c:
            r = dict(Rr[rm])
        else:
            nb, d, ln = c
            N = Rr[nb]
            r = {'r': R(N['x'] + N['w'], N['y'], ln, N['h']), 'l': R(N['x'] - ln, N['y'], ln, N['h']),
                 'd': R(N['x'], N['y'] + N['h'], N['w'], ln), 'u': R(N['x'], N['y'] - ln, N['w'], ln)}[d]
        r['name'] = names[i]
        C.append(r)
    allr = F + C
    mx, my = min(r['x'] for r in allr), min(r['y'] for r in allr)

    def sh(r):
        q = dict(r)
        q['x'] -= mx
        q['y'] -= my
        return q
    return [sh(r) for r in F], [sh(r) for r in C]


def same_pts(fd, P, name):
    me = next(p for p in P if p[2] == name)
    v = fd['pt'][_k(me[0], me[1])]
    return [p[2] for p in P if p[2] != name and fd['pt'][_k(p[0], p[1])] == v]


def segs_of(F, P):
    S = []

    def on_b(a, b):
        mx, my = (a[0] + b[0]) / 2, (a[1] + b[1]) / 2
        k = sum(1 for r in F if r['x'] - 1e-6 < mx < r['x'] + r['w'] + 1e-6 and r['y'] - 1e-6 < my < r['y'] + r['h'] + 1e-6)
        return k == 1
    for r in F:
        c = [(r['x'], r['y']), (r['x'] + r['w'], r['y']), (r['x'] + r['w'], r['y'] + r['h']), (r['x'], r['y'] + r['h'])]
        for i in range(4):
            a, b = c[i], c[(i + 1) % 4]
            on = [p for p in P if (eq(a[0], b[0]) and eq(p[0], a[0]) and min(a[1], b[1]) - 1e-6 <= p[1] <= max(a[1], b[1]) + 1e-6) or
                  (eq(a[1], b[1]) and eq(p[1], a[1]) and min(a[0], b[0]) - 1e-6 <= p[0] <= max(a[0], b[0]) + 1e-6)]
            on.sort(key=lambda p: (p[0], p[1]))
            for k in range(len(on) - 1):
                u, v = on[k], on[k + 1]
                if not on_b(u, v):
                    continue
                if not any(s['a'] is u and s['b'] is v for s in S):
                    S.append({'a': u, 'b': v, 'nm': u[2] + v[2]})
    return S


def same_seg(fd, S, s0):
    g = lambda p: fd['pt'][_k(p[0], p[1])]   # noqa: E731
    va, vb = g(s0['a']), g(s0['b'])
    return [s for s in S if s is not s0 and ((g(s['a']) == va and g(s['b']) == vb) or (g(s['a']) == vb and g(s['b']) == va))]


def net_tasks(F, P, tasks):
    """cb5NetPts의 정답: [('pt','ㅌ',['ㅎ']), ('seg','ㄴㄷ',['ㄹㄷ'])]"""
    fd = fold(F)
    assert fd['ok']
    S = segs_of(F, P)
    out = []
    for t in tasks:
        if len(t) == 1:
            out.append(('pt', t, same_pts(fd, P, t)))
            continue
        s0 = next(s for s in S if s['nm'] == t or s['nm'] == t[::-1])
        m = same_seg(fd, S, s0)
        va = fd['pt'][_k(s0['a'][0], s0['a'][1])]
        names = []
        for s in m:
            x = fd['pt'][_k(s['a'][0], s['a'][1])]
            p0, p1 = (s['a'], s['b']) if x == va else (s['b'], s['a'])
            names.append(p0[2] + p1[2] if t == s0['nm'] else p1[2] + p0[2])
        out.append(('seg', t, names))
    return out


def task_txt(res):
    parts = []
    for kind, t, ans in res:
        if kind == 'pt':
            parts.append('점 %s → %s' % (t, '·'.join('점 ' + a for a in ans)))
        else:
            parts.append('선분 %s → %s' % (t, '·'.join('선분 ' + a for a in ans)))
    return ', '.join(parts)


def add_face(F, cands):
    """cb5AddFace: 붙일 수 있는 자리 하나와 그 면의 접는 선(점선) 수"""
    good = [i for i, c in enumerate(cands) if ok(F + [c])]
    assert len(good) == 1, good
    c = cands[good[0]]
    n = len(F)
    C = [t for t in contacts(F + [c]) if n in (t['i'], t['j'])]
    cs = [(c['x'], c['y']), (c['x'] + c['w'], c['y']), (c['x'] + c['w'], c['y'] + c['h']), (c['x'], c['y'] + c['h'])]
    hs = []
    for i in range(4):
        p, q = cs[i], cs[(i + 1) % 4]
        if any((eq(t['A'][0], p[0]) and eq(t['B'][0], p[0])) if eq(p[0], q[0]) else (eq(t['A'][1], p[1]) and eq(t['B'][1], p[1])) for t in C):
            hs.append(i)
    return c['name'], len(hs)


def dims_of(F):
    fd = fold(F)
    assert fd['ok']
    return sorted(fd['L'].values())


def opp_pairs(F):
    fd = fold(F)
    assert fd['ok']
    cube = fd['cube']
    pairs = []
    for i in range(6):
        j = next(j for j in range(6) if cube[j] == OPP[cube[i]])
        if i < j:
            pairs.append((i, j))
    return pairs


def face_set_txt(fs):
    return ', '.join(FTXT[f] for f in fs)


# ================================================================ 그림 바탕
def fig(key, svg, px=1600):
    if key not in _FIG:
        _FIG[key] = svg_to_png(svg, os.path.join(WORK, key + '.png'), px)
    return _FIG[key]


def _svg(w, h, body):
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %s %s"><rect width="%s" height="%s" fill="#fff"/>'
            '<g font-family="%s">%s</g></svg>' % (r2(w), r2(h), r2(w), r2(h), FONT, body))


def r2(v):
    return ('%.2f' % v).rstrip('0').rstrip('.')


def _t(x, y, s, size=16, fill=INK, anchor='middle', weight='normal'):
    return ('<text x="%s" y="%s" font-size="%s" text-anchor="%s" font-weight="%s" fill="%s" '
            'dominant-baseline="middle">%s</text>' % (r2(x), r2(y), size, anchor, weight, fill, s))


def _line(a, b, col=INK, w=2.4, dash=None):
    d = ' stroke-dasharray="%s"' % dash if dash else ''
    return ('<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="%s" stroke-width="%s" stroke-linecap="round"%s/>'
            % (r2(a[0]), r2(a[1]), r2(b[0]), r2(b[1]), col, w, d))


def _poly(pts, fill, op=1, stroke='none', sw=0):
    return ('<polygon points="%s" fill="%s" fill-opacity="%s" stroke="%s" stroke-width="%s"/>'
            % (' '.join('%s,%s' % (r2(x), r2(y)) for x, y in pts), fill, op, stroke, sw))


def _circ(p, r, fill=INK, stroke='none', sw=0):
    return '<circle cx="%s" cy="%s" r="%s" fill="%s" stroke="%s" stroke-width="%s"/>' % (r2(p[0]), r2(p[1]), r, fill, stroke, sw)


def hstack(parts, gap=24, names=None, name_size=20, pad=6):
    """(w, h, body) 그림 여러 개를 가로로(아래에 이름)."""
    H = max(h for _, h, _ in parts) + (34 if names else 0)
    x, body = pad, []
    for i, (w, h, b) in enumerate(parts):
        body.append('<g transform="translate(%s,%s)">%s</g>' % (r2(x), r2((H - (34 if names else 0) - h) / 2), b))
        if names:
            body.append(_t(x + w / 2, H - 14, names[i], name_size, weight='bold'))
        x += w + gap
    return _svg(x - gap + pad, H, ''.join(body))


# ---------------------------------------------------------------- 빗각 그림(cb5Prism)
PI = [0, 1, 3, 2, 4, 5, 7, 6]          # 그림 꼭짓점 차례 → 꼭짓점 번호
SIDE = {0: 'front', 1: 'back', 4: 's0', 3: 's1', 5: 's2', 2: 's3'}


def edge_key(u, v):
    a, b = PI.index(u), PI.index(v)
    fa, fb = a < 4, b < 4
    if fa and fb:
        return 'f%d' % (a if b == (a + 1) % 4 else b)
    if not fa and not fb:
        x, y = a - 4, b - 4
        return 'b%d' % (x if y == (x + 1) % 4 else y)
    return 'd%d' % (a if fa else b)


def prism(P, D, k=26, ang=38, f=.55, pad=30, hidden='dash', fill=None, tint=None, lab=None, dims=None,
          miss=(), red=(), extra=None, dimd=18, dim_size=16, lab_size=17):
    """→ (W, H, body, S)"""
    n = len(P)
    a = math.radians(ang)
    dv = (math.cos(a) * f * D, math.sin(a) * f * D)
    allp = list(P) + [(p[0] + dv[0], p[1] + dv[1]) for p in P]
    minx = min(p[0] for p in allp)
    maxy = max(p[1] for p in allp)
    wid = max(p[0] for p in allp) - minx
    hei = maxy - min(p[1] for p in allp)
    W, H = wid * k + pad * 2, hei * k + pad * 2
    S = [(pad + k * (p[0] - minx), pad + k * (maxy - p[1])) for p in allp]
    side_vis = []
    for i in range(n):
        p, q = P[i], P[(i + 1) % n]
        nx, ny = q[1] - p[1], -(q[0] - p[0])
        side_vis.append(nx * dv[0] + ny * dv[1] > 1e-9)
    E = []
    for i in range(n):
        j = (i + 1) % n
        E.append(('f%d' % i, i, j, True))
        E.append(('b%d' % i, n + i, n + j, side_vis[i]))
        E.append(('d%d' % i, i, n + i, side_vis[i] or side_vis[(i + n - 1) % n]))
    fill = fill or {}
    b = []

    def poly(idx, c, op):
        b.append(_poly([S[i] for i in idx], c, op))
    if fill.get('back'):
        poly([n + i for i in range(n)], fill['back'], .5)
    for i in range(n):
        c = fill.get('s%d' % i)
        if c and not side_vis[i]:
            poly([i, (i + 1) % n, n + (i + 1) % n, n + i], c, .5)
    for i in range(n):
        c = fill.get('s%d' % i) or tint
        if c and side_vis[i]:
            poly([i, (i + 1) % n, n + (i + 1) % n, n + i], c, .9)
    poly(list(range(n)), fill.get('front') or tint or '#F4F8FC', .9)
    for key, u, v, vis in E:
        if key in miss:
            continue
        if not vis and hidden == 'none':
            continue
        col = RED if key in red else INK
        dash = '7 6' if (not vis and hidden != 'solid') else None
        b.append(_line(S[u], S[v], col, 2.6 if vis or hidden == 'solid' else 2, dash))
    cx = sum(p[0] for p in S) / len(S)
    cy = sum(p[1] for p in S) / len(S)
    for i, t in enumerate(lab or []):
        if not t:
            continue
        dx, dy = S[i][0] - cx, S[i][1] - cy
        L = math.hypot(dx, dy) or 1
        b.append(_t(S[i][0] + dx / L * 16, S[i][1] + dy / L * 16, t, lab_size))
    for u, v, t in dims or []:
        A, B = S[u], S[v]
        mx, my = (A[0] + B[0]) / 2, (A[1] + B[1]) / 2
        dx, dy = mx - cx, my - cy
        L = math.hypot(dx, dy) or 1
        b.append(_t(mx + dx / L * dimd, my + dy / L * dimd, t, dim_size, BLUE, weight='bold'))
    if extra:
        b.append(extra(S))
    return W, H, ''.join(b), S


def cub(W, H, D, k=26, lab=None, dims=None, fill=None, miss=(), red=(), **kw):
    """직육면체 겨냥도(꼭짓점 번호는 LAB과 같음). dims [(u, v, '4 cm')], fill {면 번호: 색}"""
    fl = {SIDE[fi]: c for fi, c in (fill or {}).items()}
    labm = LAB if lab is True else lab
    return prism([(0, 0), (W, 0), (W, H), (0, H)], D, k=k, fill=fl, lab=[labm[v] for v in PI] if labm else None,
                 dims=[(PI.index(u), PI.index(v), t) for u, v, t in dims or []],
                 miss=[edge_key(u, v) for u, v in miss], red=[edge_key(u, v) for u, v in red], **kw)


def svg_of(p):
    return _svg(p[0], p[1], p[2])


# ---------------------------------------------------------------- 돌린 그림(cb5Solid)
def proj(dims, yaw, pitch):
    W, H, D = dims
    a, b = math.radians(yaw), math.radians(pitch)
    ca, sa, cb, sb = math.cos(a), math.sin(a), math.cos(b), math.sin(b)

    def f(v):
        X = (.5 if v & 1 else -.5) * W
        Y = (.5 if v & 2 else -.5) * H
        Z = (-.5 if v & 4 else .5) * D
        X1, Z1 = X * ca + Z * sa, -X * sa + Z * ca
        return X1, Y * cb - Z1 * sb, Y * sb + Z1 * cb
    return f


def solid_vis(dims, yaw, pitch):
    P = proj(dims, yaw, pitch)
    Q = [P(v) for v in range(8)]
    return [sum(Q[v][2] for v in f) / 4 > 1e-6 for f in FACES]


def solid(dims, yaw=-35, pitch=24, size=(420, 300), lab=False, fill=None, dim_lab=None, hidden='dash', face_fill='#F4F8FC',
          face_text=None, lab_size=19):
    W, H = size
    P = proj(dims, yaw, pitch)
    Q = [P(v) for v in range(8)]
    diag = math.hypot(*dims)
    sc = min(W, H) * .84 / diag
    cx, cy = W / 2, H / 2
    S = [(cx + sc * q[0], cy - sc * q[1]) for q in Q]
    fv = [sum(Q[v][2] for v in f) / 4 > 1e-6 for f in FACES]
    ev = [any(fv[fi] and u in f and v in f for fi, f in enumerate(FACES)) for u, v in EDGES]
    vv = [any(fv[fi] and v in f for fi, f in enumerate(FACES)) for v in range(8)]
    b = []
    for fi, f in enumerate(FACES):
        c = fill(fi) if fill else None
        if not fv[fi] and c:
            b.append(_poly([S[v] for v in f], c, .45))
    for fi, f in enumerate(FACES):
        if fv[fi]:
            c = (fill(fi) if fill else None) or face_fill
            b.append(_poly([S[v] for v in f], c, .88))
    if face_text:
        for fi, f in enumerate(FACES):
            t = face_text(fi)
            if t:
                c = (sum(S[v][0] for v in f) / 4, sum(S[v][1] for v in f) / 4)
                b.append(_t(c[0], c[1], t, 17, INK if fv[fi] else GRAY, weight='bold'))
    for ei, (u, v) in enumerate(EDGES):
        if not ev[ei] and hidden == 'none':
            continue
        b.append(_line(S[u], S[v], INK if ev[ei] else '#6C7A86', 2.6 if ev[ei] else 2, None if ev[ei] else '7 6'))
    for v in range(8):
        if vv[v]:
            b.append(_circ(S[v], 3.5))
    if lab:
        for v in range(8):
            dx, dy = S[v][0] - cx, S[v][1] - cy
            L = math.hypot(dx, dy) or 1
            b.append(_t(S[v][0] + dx / L * 18, S[v][1] + dy / L * 18, LAB[v], lab_size, INK if vv[v] else '#8A96A0'))
    for u, v, t in dim_lab or []:
        A, B = S[u], S[v]
        mx, my = (A[0] + B[0]) / 2, (A[1] + B[1]) / 2
        dx, dy = mx - cx, my - cy
        L = math.hypot(dx, dy) or 1
        b.append(_t(mx + dx / L * 22, my + dy / L * 22, t, 17, BLUE, weight='bold'))
    return W, H, ''.join(b), {'faces': fv, 'edges': ev, 'verts': vv}


# ---------------------------------------------------------------- 전개도(cb5NetSvg)
def bounds(F):
    xs = [v for r in F for v in (r['x'], r['x'] + r['w'])]
    ys = [v for r in F for v in (r['y'], r['y'] + r['h'])]
    return min(xs), min(ys), max(xs), max(ys)


def net(F, k=28, pad=26, grid=False, gx=0, gy=0, color=None, face_text=None, lab=None, extra=None, dash=True,
        skip=None, face_size=17, lab_size=17, plus=None):
    """→ (W, H, body, m)  plus: 점선 후보 칸(이름) 등 더 그릴 직사각형 목록 [(r, 이름)]"""
    allr = F + [r for r, _ in (plus or [])]
    x0, y0, x1, y1 = bounds(allr)
    W, H = (x1 - x0 + 2 * gx) * k + pad * 2, (y1 - y0 + 2 * gy) * k + pad * 2

    def m(p):
        return (pad + (p[0] - x0 + gx) * k, pad + (p[1] - y0 + gy) * k)
    C = contacts(F)
    b = []
    if grid:
        x = x0 - gx
        while x <= x1 + gx + 1e-9:
            b.append(_line(m((x, y0 - gy)), m((x, y1 + gy)), GRID, 1.2))
            x += 1
        y = y0 - gy
        while y <= y1 + gy + 1e-9:
            b.append(_line(m((x0 - gx, y)), m((x1 + gx, y)), GRID, 1.2))
            y += 1
    for fi, r in enumerate(F):
        a, c = m((r['x'], r['y'])), m((r['x'] + r['w'], r['y'] + r['h']))
        col = (color(fi) if color else None) or '#EEF5FC'
        b.append('<rect x="%s" y="%s" width="%s" height="%s" fill="%s"/>' % (r2(a[0]), r2(a[1]), r2(c[0] - a[0]), r2(c[1] - a[1]), col))
        if face_text:
            t = face_text(fi)
            if t:
                b.append(_t((a[0] + c[0]) / 2, (a[1] + c[1]) / 2, t, face_size, weight='bold'))
    for r, nm in plus or []:
        a, c = m((r['x'], r['y'])), m((r['x'] + r['w'], r['y'] + r['h']))
        b.append('<rect x="%s" y="%s" width="%s" height="%s" fill="#fff" fill-opacity=".6" stroke="%s" stroke-width="1.8" '
                 'stroke-dasharray="5 4"/>' % (r2(a[0]), r2(a[1]), r2(c[0] - a[0]), r2(c[1] - a[1]), GRAY))
        b.append(_t((a[0] + c[0]) / 2, (a[1] + c[1]) / 2, nm, face_size + 2, weight='bold'))
    for ri, r in enumerate(F):
        if ri == skip:
            continue
        c4 = [(r['x'], r['y']), (r['x'] + r['w'], r['y']), (r['x'] + r['w'], r['y'] + r['h']), (r['x'], r['y'] + r['h'])]
        for i in range(4):
            a, bb = c4[i], c4[(i + 1) % 4]
            horiz = eq(a[1], bb[1])
            cuts = [t for t in C if ri in (t['i'], t['j']) and (
                (eq(a[0], bb[0]) and eq(t['A'][0], a[0]) and eq(t['B'][0], a[0])) or (horiz and eq(t['A'][1], a[1]) and eq(t['B'][1], a[1])))]
            lo, hi = (min(a[0], bb[0]), max(a[0], bb[0])) if horiz else (min(a[1], bb[1]), max(a[1], bb[1]))
            pieces = [(lo, hi)]
            for t in cuts:
                c0 = min(t['A'][0], t['B'][0]) if horiz else min(t['A'][1], t['B'][1])
                c1 = max(t['A'][0], t['B'][0]) if horiz else max(t['A'][1], t['B'][1])
                new = []
                for u, v in pieces:
                    if c0 > u + 1e-9:
                        new.append((u, min(v, c0)))
                    if c1 < v - 1e-9:
                        new.append((max(u, c1), v))
                pieces = [q for q in new if q[1] - q[0] > 1e-9]
            for u, v in pieces:
                A = m((u, a[1]) if horiz else (a[0], u))
                B = m((v, a[1]) if horiz else (a[0], v))
                b.append(_line(A, B, INK, 2.6))
    for t in C:
        if skip in (t['i'], t['j']):
            continue
        b.append(_line(m(t['A']), m(t['B']), '#56636E' if dash else INK, 2 if dash else 2.6, '6 5' if dash else None))
    if lab:
        for p in lab:
            P = m(p)
            on = [r for r in F if r['x'] - 1e-6 <= p[0] <= r['x'] + r['w'] + 1e-6 and r['y'] - 1e-6 <= p[1] <= r['y'] + r['h'] + 1e-6]
            dx = sum(p[0] - (r['x'] + r['w'] / 2) for r in on)
            dy = sum(p[1] - (r['y'] + r['h'] / 2) for r in on)
            L = math.hypot(dx, dy) or 1
            b.append(_circ(P, 3.5))
            b.append(_t(P[0] + dx / L * 15, P[1] + dy / L * 15, p[2], lab_size))
    if extra:
        b.append(extra(m))
    return W, H, ''.join(b), m


def seg_label(m, p, q, t, dx=0, dy=0, col=RED, size=17):
    A, B = m(p), m(q)
    return _t((A[0] + B[0]) / 2 + dx, (A[1] + B[1]) / 2 + dy, t, size, col, weight='bold')


# ---------------------------------------------------------------- 실제 크기 모눈(한 칸 = 1 cm)
KCM = 40          # SVG에서 1 cm = 40


def cm_grid(cols, rows, faces=(), segs=(), dots=False, pad=.3):
    """→ (svg, 너비 mm). faces: 그려 둔 면 [R], segs: [((x,y),(x,y), dash)]"""
    k = KCM
    p = pad * k
    W, H = cols * k + 2 * p, rows * k + 2 * p

    def m(q):
        return (p + q[0] * k, p + q[1] * k)
    b = []
    for x in range(cols + 1):
        b.append(_line(m((x, 0)), m((x, rows)), GRID, 1.3))
    for y in range(rows + 1):
        b.append(_line(m((0, y)), m((cols, y)), GRID, 1.3))
    if dots:
        for x in range(cols + 1):
            for y in range(rows + 1):
                b.append(_circ(m((x, y)), 2.2, '#8EA2B4'))
    for r in faces:
        a = m((r['x'], r['y']))
        b.append('<rect x="%s" y="%s" width="%s" height="%s" fill="#E4EDF7" stroke="%s" stroke-width="3"/>'
                 % (r2(a[0]), r2(a[1]), r['w'] * k, r['h'] * k, INK))
    for a, c, dash in segs:
        b.append(_line(m(a), m(c), INK, 3.4, '9 7' if dash else None))
    return _svg(W, H, ''.join(b)), (cols + 2 * pad) * 10


def sketch_edges(W, H, dx, dy, ox=1, oy=1):
    """cb5Sketch의 모서리: 번호 → ((x,y),(x,y), 점선?)"""
    def V(v):
        return (ox + (W if v & 1 else 0) + (dx if v & 4 else 0), oy + dy + H - (H if v & 2 else 0) - (dy if v & 4 else 0))
    return [(V(u), V(v), 4 in (u, v)) for u, v in EDGES]


def sketch_svg(W, H, dx, dy, cols, rows, show, all_solid=False, k=34, rings=()):
    """모눈 위 겨냥도(show: 그릴 모서리 번호)."""
    p = 12
    E = sketch_edges(W, H, dx, dy)

    def m(q):
        return (p + q[0] * k, p + q[1] * k)
    b = []
    for x in range(cols + 1):
        b.append(_line(m((x, 0)), m((x, rows)), GRID, 1.2))
    for y in range(rows + 1):
        b.append(_line(m((0, y)), m((cols, y)), GRID, 1.2))
    for i in show:
        a, c, d = E[i]
        b.append(_line(m(a), m(c), INK, 3, None if (all_solid or not d) else '8 7'))
    for i in rings:
        a, c, _ = E[i]
        A, C = m(a), m(c)
        b.append(_circ(((A[0] + C[0]) / 2, (A[1] + C[1]) / 2), 14, 'none', RED, 2.5))
    return cols * k + 2 * p, rows * k + 2 * p, ''.join(b)


# ---------------------------------------------------------------- 물건·상자 그림
def grid3(Q, col=INK):
    L = lambda a, b, t: (a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t)   # noqa: E731
    out = []
    for t in (1 / 3, 2 / 3):
        out.append(_line(L(Q[0], Q[1], t), L(Q[3], Q[2], t), col, 1.5))
        out.append(_line(L(Q[0], Q[3], t), L(Q[1], Q[2], t), col, 1.5))
    return ''.join(out)


def obj(name):
    """앱의 CB5_OBJ·CB5S_OBJ와 같은 물건 그림 → (w, h, body)"""
    if name == 'dice':
        def ex(S):
            c = ((S[0][0] + S[2][0]) / 2, (S[0][1] + S[2][1]) / 2)
            d = (S[1][0] - S[0][0]) / 4
            return ''.join(_circ((c[0] + u * d, c[1] + v * d), 4.5, RED if u == 0 else INK) for u, v in ((-1, -1), (1, 1), (0, 0), (1, -1), (-1, 1)))
        return prism([(0, 0), (3, 0), (3, 3), (0, 3)], 3, k=22, hidden='none', tint='#FFFFFF', pad=12, extra=ex)[:3]
    if name == 'can':
        return 130, 120, ('<rect x="35" y="22" width="60" height="78" fill="#F6B38E" stroke="%s" stroke-width="2"/>'
                          '<ellipse cx="65" cy="100" rx="30" ry="9" fill="#F6B38E" stroke="%s" stroke-width="2"/>'
                          '<rect x="36.5" y="80" width="57" height="20" fill="#F6B38E"/>'
                          '<ellipse cx="65" cy="22" rx="30" ry="9" fill="#E6EBEE" stroke="%s" stroke-width="2"/>' % (INK, INK, INK))
    if name == 'tissue':
        def ex(S):
            c = ((S[3][0] + S[6][0]) / 2, (S[3][1] + S[6][1]) / 2)
            return '<ellipse cx="%s" cy="%s" rx="26" ry="6" fill="#fff" stroke="%s" stroke-width="1.5"/>' % (r2(c[0]), r2(c[1]), INK)
        return prism([(0, 0), (5, 0), (5, 2.2), (0, 2.2)], 2.6, k=20, hidden='none', tint='#DDEDE5', pad=12, extra=ex)[:3]
    if name == 'ball':
        b = ['<circle cx="65" cy="60" r="44" fill="#fff" stroke="%s" stroke-width="2"/>' % INK,
             '<polygon points="65,42 82,54 76,74 54,74 48,54" fill="%s"/>' % INK]
        for a, bb, c, d in ((65, 42, 65, 17), (82, 54, 105, 46), (76, 74, 90, 94), (54, 74, 40, 94), (48, 54, 25, 46)):
            b.append(_line((a, bb), (c, d), INK, 2))
        return 130, 120, ''.join(b)
    if name == 'cube':
        def ex(S):
            return grid3([S[3], S[2], S[1], S[0]]) + grid3([S[7], S[6], S[2], S[3]]) + grid3([S[2], S[6], S[5], S[1]])
        return prism([(0, 0), (3, 0), (3, 3), (0, 3)], 3, k=20, hidden='none', pad=12,
                     fill={'front': '#F6B38E', 's1': '#9CC3F0', 's2': '#FFE07A'}, extra=ex)[:3]
    if name == 'book':
        return prism([(0, 0), (4, 0), (4, 1), (0, 1)], 5, k=19, hidden='none', pad=12, fill={'front': '#FFFFFF', 's2': '#9CC3F0', 's1': '#FFFFFF'})[:3]
    if name == 'cone':
        return 130, 120, '<path d="M65 12 L100 98 A35 10 0 0 1 30 98 Z" fill="#FFE07A" stroke="%s" stroke-width="2"/>' % INK
    if name == 'eraser':
        def ex(S):
            L = lambda a, b, t: (a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t)   # noqa: E731
            return _poly([L(S[0], S[1], .35), L(S[0], S[1], .75), L(S[3], S[2], .75), L(S[3], S[2], .35)], '#9CC3F0', 1, INK, 1.2)
        return prism([(0, 0), (4, 0), (4, 1.3), (0, 1.3)], 2, k=20, hidden='none', tint='#FFFFFF', pad=12, extra=ex)[:3]
    if name == 'block':
        return prism([(0, 0), (2.4, 0), (2.4, 2.4), (0, 2.4)], 2.4, k=22, hidden='none', pad=12,
                     fill={'front': '#E9C38F', 's1': '#D9AE73', 's2': '#F3D9B3'})[:3]
    raise KeyError(name)


def objs_svg(items):
    """[(이름, 그림 키)] → 가로로 늘어놓은 SVG(같은 높이로 맞춤)."""
    parts = []
    for _, key in items:
        w, h, b = obj(key)
        sc = 120 / h
        parts.append((w * sc, 120, '<g transform="scale(%s)">%s</g>' % (r2(sc), b)))
    return hstack(parts, 26, [n for n, _ in items], 19)


def box_g(W, H, D, k, color, top, side, x, y):
    """cb5BoxG: 앞면이 (x, y)에서 시작하는 간단한 상자."""
    w, hh, d = W * k, H * k, D * .35 * k
    P = lambda pts: [(x + a, y + b) for a, b in pts]   # noqa: E731
    return (_poly(P([(0, 0), (d, -d * .8), (w + d, -d * .8), (w, 0)]), top, 1, INK, 1.6) +
            _poly(P([(w, 0), (w + d, -d * .8), (w + d, hh - d * .8), (w, hh)]), side, 1, INK, 1.6) +
            '<rect x="%s" y="%s" width="%s" height="%s" fill="%s" stroke="%s" stroke-width="1.8"/>' % (r2(x), r2(y), r2(w), r2(hh), color, INK))


def toy_svg(parts, slots, labels, w_units, h_units):
    """장난감(상자봇) 설계도: parts {kind: (W,H,D,색,윗면,옆면)}, slots [(kind, x, y)]"""
    k, pad = 26, 14
    b = []
    for kind, x, y in sorted(slots, key=lambda s: s[2]):
        W, H, D, c, t, sd = parts[kind]
        b.append(box_g(W, H, D, k, c, t, sd, pad + x * k, pad + y * k))
    for t, x, y in labels:
        b.append(_t(pad + x * k, pad + y * k, t, 15, GRAY, anchor='start'))
    return _svg(w_units * k + pad * 2, h_units * k + pad * 2, ''.join(b))


def quad_svg(a_lab, b_lab, a_box, b_box):
    b = []
    for (x, y, w, h, c), t in ((a_box, a_lab), (b_box, b_lab)):
        b.append('<rect x="%s" y="%s" width="%s" height="%s" fill="%s" stroke="%s" stroke-width="2"/>' % (x, y, w, h, c, INK))
        b.append(_t(x + w / 2, y + h + 18, t, 16))
        for a, bb, u, v in ((x, y, 1, 1), (x + w, y, -1, 1), (x + w, y + h, -1, -1), (x, y + h, 1, -1)):
            b.append('<polyline points="%s,%s %s,%s %s,%s" fill="none" stroke="%s" stroke-width="1.5"/>'
                     % (a + u * 10, bb, a + u * 10, bb + v * 10, a, bb + v * 10, RED))
    return _svg(420, 150, ''.join(b))


def lines_svg(par, perp, par_lab, perp_lab):
    """두 직선 그림: par/perp = [(x1,y1,x2,y2)...] 두 개씩, 직각 표시는 perp의 만나는 점"""
    b = []
    for ln in par:
        b.append(_line(ln[:2], ln[2:], BLUE, 3))
    for ln in perp[:2]:
        b.append(_line(ln[:2], ln[2:], ORG, 3))
    b.append('<polyline points="%s" fill="none" stroke="%s" stroke-width="2"/>' % (perp[2], RED))
    b.append(_t(*par_lab))
    b.append(_t(*perp_lab))
    return _svg(420, 170, ''.join(b))


def right_svg(H, D):
    """삼각자 3개의 직각을 한 꼭짓점에 대어 본 그림(cb5RightFig)."""
    def ex(S):
        V = S[2]

        def u(A):
            dx, dy = A[0] - V[0], A[1] - V[1]
            L = math.hypot(dx, dy)
            return dx / L * 14, dy / L * 14
        out = []
        for A, B, col in ((S[3], S[1], RED), (S[3], S[6], BLUE), (S[1], S[6], GREEN)):
            a, b = u(A), u(B)
            P = [(V[0] + a[0], V[1] + a[1]), (V[0] + a[0] + b[0], V[1] + a[1] + b[1]), (V[0] + b[0], V[1] + b[1])]
            out.append('<polyline points="%s" fill="none" stroke="%s" stroke-width="2.5"/>' % (' '.join('%s,%s' % (r2(x), r2(y)) for x, y in P), col))
        return ''.join(out)
    return svg_of(prism([(0, 0), (5, 0), (5, H), (0, H)], D, k=26, fill={'front': '#DCEAFB', 's1': '#FDE3D3', 's2': '#DDEDE5'}, extra=ex))


def parts_mark(S, p, t, dx, dy, mul=1.25):
    return (_line(p, (p[0] + dx, p[1] + dy), RED, 1.6) + _circ(p, 3.5, RED) +
            _t(p[0] + dx * mul, p[1] + dy * mul, t, 18, RED, weight='bold'))


def mid(a, b):
    return ((a[0] + b[0]) / 2, (a[1] + b[1]) / 2)


def face_lens(fi, dims):
    """면 fi의 두 변의 길이(dims = 가로·높이·깊이)."""
    f = FACES[fi]
    bits = [b for b in (1, 2, 4) if len({v & b for v in f}) == 2]
    D = {1: dims[0], 2: dims[1], 4: dims[2]}
    return [D[b] for b in bits]


def perp_faces(fi):
    return [f for f in range(6) if f not in (fi, OPP[fi])]


def both_perp(a, b):
    return [f for f in range(6) if f not in (a, OPP[a], b, OPP[b])]


def josa(w, pair):
    c = str(w)[-1]
    code = ord(c) - 0xAC00
    has = rieul = False
    if 0 <= code <= 11171:
        j = code % 28
        has, rieul = j > 0, j == 8
    elif c in 'ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎ':
        has, rieul = True, c == 'ㄹ'
    elif c.isdigit():
        has, rieul = c in '013678', c in '178'
    M = {'이가': ('이', '가'), '을를': ('을', '를'), '은는': ('은', '는'), '과와': ('과', '와'), '이에요': ('이에요', '예요')}
    a, b = M[pair]
    return str(w) + (a if has else b)


def jo_list(names):
    return ', '.join(names)


# ================================================================ 공통 활동 조각
def step(s, i, label, sub=None):
    s.step('%s %s' % (NUM[i], label), sub)


def opt(*o):
    return '( ' + ' / '.join(o) + ' )'


def ch(lv, opts, width=12):
    """기본형은 고르기, 도전형은 빈칸."""
    return opt(*opts) if lv == '기본형' else '(' + ' ' * width + ')'


def qa(s, items, col=(125, 55)):
    rows, ans = [], []
    for it in items:
        q, a = it[0], it[1]
        unit = it[2] if len(it) > 2 else ''
        rows.append([q, '(            )' + unit])
        ans.append(str(a) + unit)
    s.table(rows, header=False, col_mm=list(col), row_h=3402)
    return ans


def why(s, q, n=2):
    s.ask(q, blank=False)
    s.lines(n)


def thenwhy(s, lv, q, frame):
    s.ask('왜 그럴까요? ' + q, blank=False)
    if lv == '기본형':
        s.fill(frame)
    else:
        s.lines(2)


def rule_first(s, lv, q, frame):
    s.ask('먼저 예상해요 · ' + q, blank=False)
    if lv == '기본형':
        s.fill(frame)
    else:
        s.lines(1)


def write_pane(s, lv, items):
    if lv == '기본형':
        s.labeled(items)
    else:
        for k, _ in items:
            s.ask(k + ':', blank=False)
            s.lines(1)


def ox(s, items, head='말'):
    """○/× 표. 정답 글."""
    s.table([[head, '○ / ×']] + [[t, ''] for t, _ in items], col_mm=[150, 30], row_h=3402)
    return ' '.join('○' if a else '×' for _, a in items)


def real_note(s):
    s.text('※ 모눈 한 칸은 1 cm예요. 활동지를 100%(실제 크기)로 인쇄하면 자로 재어 확인할 수 있어요.')


def name_list(xs):
    return ', '.join(xs)


# ================================================================ 교과서 차시 버전 자료(u5-cuboid.tb.js)
CROSS = [[0, 1], [1, 1], [2, 1], [3, 1], [1, 0], [1, 2]]
STAIR = [[0, 0], [0, 1], [1, 1], [2, 1], [3, 1], [3, 2]]
TB_GIFT = net_from_cells(CROSS, {1: 2, 2: 3, 4: 4})
CUBE_NET = SQ(CROSS)
TB_L5A3 = lab_net([[0, 1], [1, 1], [2, 1], [3, 1], [2, 0], [1, 2]], {1: 1, 2: 1, 4: 1},
                  [[2, 0, 'ㅌ'], [3, 0, 'ㅋ'], [0, 1, 'ㄱ'], [1, 1, 'ㅎ'], [2, 1, 'ㅍ'], [3, 1, 'ㅊ'], [4, 1, 'ㅈ'], [0, 2, 'ㄴ'], [1, 2, 'ㄷ'],
                   [2, 2, 'ㅂ'], [3, 2, 'ㅅ'], [4, 2, 'ㅇ'], [1, 3, 'ㄹ'], [2, 3, 'ㅁ']])
TB_L5U1 = lab_net([[0, 0], [0, 1], [1, 1], [2, 1], [3, 1], [1, 2]], {1: 1, 2: 1, 4: 1},
                  [[0, 0, 'ㄱ'], [1, 0, 'ㅎ'], [0, 1, 'ㄴ'], [1, 1, 'ㅍ'], [2, 1, 'ㅌ'], [3, 1, 'ㅋ'], [4, 1, 'ㅊ'], [0, 2, 'ㄷ'], [1, 2, 'ㄹ'],
                   [2, 2, 'ㅅ'], [3, 2, 'ㅇ'], [4, 2, 'ㅈ'], [1, 3, 'ㅁ'], [2, 3, 'ㅂ']])
TB_L6A3 = lab_net([[0, 1], [1, 1], [2, 1], [3, 1], [1, 0], [1, 2]], {1: 2, 2: 3, 4: 4},
                  [[1, 0, 'ㅍ'], [2, 0, 'ㅌ'], [0, 1, 'ㄱ'], [1, 1, 'ㅎ'], [2, 1, 'ㅋ'], [3, 1, 'ㅊ'], [4, 1, 'ㅈ'], [0, 2, 'ㄴ'], [1, 2, 'ㄷ'],
                   [2, 2, 'ㅂ'], [3, 2, 'ㅅ'], [4, 2, 'ㅇ'], [1, 3, 'ㄹ'], [2, 3, 'ㅁ']])
TB_L6U1 = lab_net([[2, 0], [0, 1], [1, 1], [2, 1], [3, 1], [0, 2]], {1: 4, 2: 2, 4: 3},
                  [[2, 0, 'ㅌ'], [3, 0, 'ㅋ'], [0, 1, 'ㄱ'], [1, 1, 'ㅎ'], [2, 1, 'ㅍ'], [3, 1, 'ㅊ'], [4, 1, 'ㅈ'], [0, 2, 'ㄴ'], [1, 2, 'ㅁ'],
                   [2, 2, 'ㅂ'], [3, 2, 'ㅅ'], [4, 2, 'ㅇ'], [0, 3, 'ㄷ'], [1, 3, 'ㄹ']])
TB_L5A2 = [('가', SQ([[1, 0], [0, 1], [1, 1], [2, 1], [3, 1], [2, 2]])), ('나', SQ([[0, 0], [1, 0], [1, 1], [2, 1], [3, 1], [3, 2]])),
           ('다', SQ([[0, 0], [2, 0], [0, 1], [1, 1], [2, 1], [3, 1]])), ('라', SQ([[0, 0], [1, 0], [1, 1], [2, 1], [2, 2], [3, 2]]))]
TB_L6A2 = [('가', [R(0, 2, 1, 3), R(1, 2, 2, 3), R(3, 2, 1, 3), R(4, 2, 2, 3), R(1, 0, 2, 2), R(1, 5, 2, 1)]),
           ('나', net_from_cells([[0, 0], [0, 1], [1, 1], [2, 1], [3, 1], [3, 2]], {1: 2, 2: 3, 4: 1})),
           ('다', net_from_cells([[0, 0], [1, 0], [1, 1], [2, 1], [2, 2], [3, 2]], {1: 2, 2: 1, 4: 3})),
           ('라', net_from_cells([[1, 0], [0, 1], [1, 1], [2, 1], [3, 1], [2, 2]], {1: 3, 2: 1, 4: 2}))]
TB_BOXES = [('가', [(0, 0), (4, 0), (4, 2), (0, 2)], 3, '#F6D3B4'), ('나', [(0, 0), (4, 0), (3.2, 2.2), (.8, 2.2)], 2.6, '#DDEDE5'),
            ('다', [(0, 0), (2.6, 0), (2.6, 2.6), (0, 2.6)], 2.6, '#DCEAFB'), ('라', [(0, 0), (4, 0), (2, 2.4), (0, 2.4)], 2.2, '#FFF1C7'),
            ('마', [(0, 0), (2, 0), (2, 2), (0, 2)], 2, '#EADFF6'), ('바', [(0, 0), (2.2, 0), (2.2, 3.4), (0, 3.4)], 1.6, '#FBE0E6')]
TB_TOY = {'head': (2, 2, 2, '#FFD27A', '#FFE7B8', '#F2C25C'), 'body': (3, 4, 2, '#9CC3F0', '#C9DBEE', '#7FAEDF'),
          'arm': (1, 3, 1, '#A9DDB8', '#D3EEDB', '#86C99A'), 'leg': (1, 1, 1, '#F6B38E', '#FBD6C1', '#E39A72')}
TB_TOY_SLOTS = [('head', 3, .9), ('body', 2.5, 2.9), ('arm', 1.5, 2.9), ('arm', 5.5, 2.9), ('leg', 2.5, 6.9), ('leg', 4.5, 6.9)]
PN = ['㉠', '㉡', '㉢']
TB_PARTS = [('머리', '한 모서리 2 cm인 정육면체', part_net([[0, 1], [1, 1], [2, 1], [3, 1], [1, 0], [2, 2]], {1: 2, 2: 2, 4: 2}, 5, [[3, 'u', 2], None, [3, 'r', 2]], PN), '#FFD27A'),
            ('몸통', '가로 3 cm, 높이 4 cm, 깊이 2 cm인 직육면체', part_net(CROSS, {1: 2, 2: 4, 4: 3}, 4, [[3, 'u', 3], None, [3, 'r', 2]], PN), '#9CC3F0'),
            ('팔', '가로 1 cm, 높이 3 cm, 깊이 1 cm인 직육면체', part_net(CROSS, {1: 1, 2: 3, 4: 1}, 5, [[3, 'u', 1], [0, 'l', 1], None], PN), '#A9DDB8'),
            ('다리', '한 모서리 1 cm인 정육면체', part_net([[0, 1], [1, 1], [2, 1], [3, 1], [0, 0], [3, 2]], {1: 1, 2: 1, 4: 1}, 5, [None, [1, 'u', 1], [3, 'r', 1]], PN), '#F6B38E')]
TB_SHAPES = [('가', (2, 2, 2), [([[1, 0], [0, 1], [1, 1], [2, 1], [3, 1], [1, 2]], {1: 2, 2: 2, 4: 2}), ([[0, 0], [1, 0], [1, 1], [2, 1], [2, 2], [3, 2]], {1: 2, 2: 2, 4: 2})]),
             ('나', (3, 2, 1), [([[1, 0], [0, 1], [1, 1], [2, 1], [3, 1], [1, 2]], {1: 1, 2: 2, 4: 3}), ([[0, 0], [0, 1], [1, 1], [2, 1], [3, 1], [3, 2]], {1: 3, 2: 2, 4: 1})]),
             ('다', (3, 1, 1), [([[1, 0], [0, 1], [1, 1], [2, 1], [3, 1], [1, 2]], {1: 1, 2: 1, 4: 3}), ([[1, 0], [0, 1], [1, 1], [2, 1], [3, 1], [2, 2]], {1: 3, 2: 1, 4: 1})]),
             ('라', (2, 1, 2), [([[1, 0], [0, 1], [1, 1], [2, 1], [3, 1], [1, 2]], {1: 2, 2: 2, 4: 1}), ([[0, 0], [0, 1], [1, 1], [2, 1], [3, 1], [2, 2]], {1: 1, 2: 2, 4: 2})])]


def deck(shapes):
    """cb5Deck: 겨냥도 카드 + 전개도 카드(전개도는 접어서 크기가 맞는지 확인)."""
    D = []
    for si, (nm, dims, nets) in enumerate(shapes):
        D.append({'shape': si, 'kind': 'sk'})
        for cells, d in nets:
            F = net_from_cells(cells, d)
            assert dims_of(F) == sorted(dims), (nm, dims_of(F))
            D.append({'shape': si, 'kind': 'net', 'F': F})
    return D


def card_svg(card, shapes):
    if card['kind'] == 'sk':
        W, H, D = shapes[card['shape']][1]
        return cub(W, H, D, k=28, pad=40, f=.6, dimd=24, dim_size=15, dims=[(0, 1, '%d cm' % W), (0, 2, '%d cm' % H), (3, 7, '%d cm' % D)])[:3]
    return net(card['F'], k=16, pad=6, grid=True, gx=1, gy=1, color=lambda f: '#FFF6DD')[:3]


def fit(p, h=150):
    w, hh, b = p[:3]
    sc = h / hh
    return w * sc, h, '<g transform="scale(%s)">%s</g>' % (r2(sc), b)


def boxes_svg(boxes):
    return hstack([fit(prism(P, D, k=22, hidden='none', tint=c, pad=12)) for _, P, D, c in boxes], 26, [n for n, *_ in boxes])


def views_svg(dims, views):
    parts = [solid(dims, y, p, size=(260, 200), hidden='none', face_fill='#FFE7B8')[:3] for y, p, _ in views]
    return hstack(parts, 18, [t for *_, t in views])


def nets_svg(nets, k=22, grid=False, h=None):
    parts = [net(F, k=k, pad=12, grid=grid)[:3] for _, F in nets]
    if h:
        parts = [fit(p, h) for p in parts]
    return hstack(parts, 30, [n for n, _ in nets])


def judge(nets):
    return [n for n, F in nets if ok(F)], {n: fold(F)['why'] for n, F in nets if not ok(F)}


def pts_fig(key, F, P, k):
    return fig(key, svg_of(net(F, k=k, lab=P, lab_size=19)))


def ask_pts(s, lv, res):
    rows = []
    for kind, t, ans in res:
        if kind == 'pt':
            rows.append(['점 %s 겹치는 점%s' % (josa(t, '과와'), ' (%d개)' % len(ans) if lv == '기본형' else ''), '(                    )'])
        else:
            rows.append(['선분 %s 겹치는 선분' % josa(t, '과와'), '(                    )'])
    s.table(rows, header=False, col_mm=[110, 70], row_h=3402)


def add_face_task(s, key, title, F, cands, color, width_mm):
    nm, nh = add_face(F, cands)
    s.text(title)
    s.picture(fig(key, svg_of(net(F, k=40, grid=True, gx=1, gy=1, plus=[(c, c['name']) for c in cands],
                                  color=lambda f: color))), width_mm=width_mm)
    return nm, nh


def net_draw_example(given, extra, dims, cube=False):
    F = given + extra
    assert ok(F) and dims_of(F) == sorted(dims), (F, dims_of(F) if ok(F) else fold(F)['why'])
    return F
