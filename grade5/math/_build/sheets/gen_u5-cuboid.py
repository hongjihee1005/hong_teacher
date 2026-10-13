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
    tot = sum(w for w, _, _ in parts) + gap * (len(parts) - 1)
    name_size = max(name_size, tot * .024)
    nh = name_size * 1.7
    H = max(h for _, h, _ in parts) + (nh if names else 0)
    x, body = pad, []
    for i, (w, h, b) in enumerate(parts):
        body.append('<g transform="translate(%s,%s)">%s</g>' % (r2(x), r2((H - (nh if names else 0) - h) / 2), b))
        if names:
            body.append(_t(x + w / 2, H - nh * .45, names[i], r2(name_size), weight='bold'))
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
            ('몸통', '가로 3 cm, 세로 2 cm, 높이 4 cm인 직육면체', part_net(CROSS, {1: 2, 2: 4, 4: 3}, 4, [[3, 'u', 3], None, [3, 'r', 2]], PN), '#9CC3F0'),
            ('팔', '가로 1 cm, 세로 1 cm, 높이 3 cm인 직육면체', part_net(CROSS, {1: 1, 2: 3, 4: 1}, 5, [[3, 'u', 1], [0, 'l', 1], None], PN), '#A9DDB8'),
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


# ================================================================ 교과서 차시 버전 차시
def tb1(s, lv):
    s.lesson(1, '개념 찾기(S)', '단원 도입 ― 연서의 국제 물류 센터 견학', '우리 주변에서 직육면체 모양의 상자는 어디에, 왜 쓰이고 있을까요?')
    s.scene(None, '로봇 공학자인 아버지를 따라 국제 물류 센터에 견학 간 연서는 로봇들이 여러 가지 모양의 상자를 찾아 분류하고, '
                  '운반하고, 정리하는 모습을 보았어요. 로봇이 상자의 모서리를 잘라 펼치는 모습도 보았지요.')
    step(s, 0, '살펴보기', '컨테이너를 둘러싼 면')
    s.text('트럭에 싣고 있는 컨테이너는 쇠로 만들어진 큰 상자예요. 보이지 않는 뒤쪽·아래쪽 면도 떠올리며 세어 보세요.')
    s.picture(fig('tb1con', svg_of(cub(6, 2.6, 2.4, k=30, tint='#F3D2B0'))), width_mm=80)
    a1 = qa(s, [('컨테이너를 둘러싸고 있는 면의 수', len(FACES), '개')])
    s.choices([('면의 모양은 모두', ch(lv, ['직사각형', '삼각형', '원']))])
    if lv == '기본형':
        s.choices([('컨테이너를 상자 모양으로 만든 까닭', '( 짐을 꾸리기 편하고 운반이 쉬워서 /\n잘 굴러가서 / 가장 가벼운 모양이라서 )')])
    else:
        why(s, '컨테이너를 이런 상자 모양으로 만든 까닭을 써 보세요.', 1)
    step(s, 1, '떠올리기', '직사각형과 정사각형, 수직과 평행')
    s.picture(fig('tb1quad', quad_svg('가', '나', (30, 25, 150, 80, '#DCEAFB'), (250, 15, 100, 100, '#FDE3D3'))), width_mm=95)
    s.choices([('가처럼 네 각이 모두 직각인 사각형', opt('직사각형', '사다리꼴', '마름모')),
               ('나처럼 네 각이 모두 직각이고 네 변의 길이가 모두 같은 사각형', opt('정사각형', '평행사변형', '삼각형'))])
    s.picture(fig('tb1line', lines_svg([(20, 40, 190, 40), (20, 120, 190, 120)], [(250, 130, 400, 130), (325, 20, 325, 130), '325,116 339,116 339,130'],
                                       (105, 155, '가', 16), (325, 155, '나', 16))), width_mm=95)
    s.choices([('나처럼 두 직선이 만나서 이루는 각이 직각일 때', opt('수직이다', '평행하다')),
               ('가처럼 아무리 늘여도 서로 만나지 않는 두 직선', opt('수직이다', '평행하다'))])
    step(s, 2, '이야기 보기', '물류 센터의 로봇')
    s.text('“연서야, 여기가 바로 우리가 만든 미래야. 사람을 대신해서 로봇들이 일을 하지.” 물류 센터에서 로봇들이 하는 일에 ○, 아닌 것에 ×를 해요.')
    a3 = ox(s, [('상자를 모양에 따라 분류해요.', 1), ('상자를 운반해요.', 1), ('상자를 정리해요.', 1), ('상자의 모서리를 잘라서 펼쳐요.', 1),
                ('상자에 그림을 그려요.', 0)], '로봇이 하는 일')
    s.choices([('물류 센터에 쌓여 있는 상자를 둘러싼 도형', opt('직사각형', '원', '삼각형'))])
    step(s, 3, '확인하기', '이 단원에서 알고 싶은 것')
    write_pane(s, lv, [('본 곳', '상자 모양의 물건을 ______________ 에서 보았어요.'),
                       ('알고 싶은 것', '직육면체는 직사각형 ______ 개로 ______________ 이 알고 싶어요.')])
    ans = '1차시  ① %s, 직사각형, 짐을 꾸리기 편하고 운반이 쉬워서   ② 직사각형, 정사각형 / 수직이다, 평행하다   ③ %s, 직사각형   ④ (자유)' % (a1[0], a3)
    if lv == '도전형':
        step(s, 4, '도전하기', '직사각형으로만 둘러싸인 물건')
        items = [('휴지 상자', 'tissue', 1), ('음료수 캔', 'can', 0), ('책', 'book', 1), ('공', 'ball', 0), ('고깔', 'cone', 0)]
        s.picture(fig('tb1obj', objs_svg([(n, k) for n, k, _ in items])), width_mm=170)
        s.ask('직사각형으로만 둘러싸인 물건을 모두 써 보세요.')
        why(s, '고르지 않은 물건 하나를 골라 그 까닭을 써 보세요.', 1)
        ans += '   ⑤ %s (캔·공·고깔은 둥근 면이 있어요)' % name_list([n for n, _, a in items if a])
    return ans


def tb2(s, lv):
    s.lesson(2, '개념 구축하기(O)', '직육면체와 정육면체를 알아볼까요', '직육면체와 정육면체는 어떤 도형이고, 무엇으로 이루어져 있을까요?')
    s.scene(None, '물류 센터의 로봇이 물건이 들어 있는 상자를 모양에 따라 분류하고 있어요.')
    step(s, 0, '만져 보기', '상자를 둘러싼 도형')
    s.picture(fig('tb2box', boxes_svg(TB_BOXES)), width_mm=172)
    if lv == '기본형':
        s.text('면의 네 각이 모두 직각인지, 네 변의 길이가 모두 같은지 살펴봐요. 사다리꼴 모양의 면이 있는 상자도 있어요.')
    rect = [n for n, P, D, _ in TB_BOXES if len(P) == 4 and P[1][0] == P[2][0] and P[0][0] == P[3][0]]
    sq = [n for n, P, D, _ in TB_BOXES if n in rect and P[1][0] == P[2][1] == D]
    assert rect == ['가', '다', '마', '바'] and sq == ['다', '마']
    a1 = qa(s, [('직사각형으로 둘러싸인 상자', name_list(rect)), ('정사각형으로 둘러싸인 상자', name_list(sq))])
    step(s, 1, '약속하기', '직육면체와 정육면체')
    s.fill(['직사각형 6개로 둘러싸인 도형을 %s라고 해요.' % ch(lv, ['직육면체', '정육면체', '사각형']),
            '정사각형 6개로 둘러싸인 도형을 %s라고 해요.' % ch(lv, ['직육면체', '정육면체', '정사각형'])])
    items = [('가', 'dice', 1, 1), ('나', 'can', 0, 0), ('다', 'tissue', 1, 0), ('라', 'ball', 0, 0), ('마', 'cube', 1, 1), ('바', 'book', 1, 0)]
    s.picture(fig('tb2obj', objs_svg([(n, k) for n, k, *_ in items])), width_mm=172)
    a2 = qa(s, [('직육면체 모양', name_list([n for n, _, c, _ in items if c])), ('정육면체 모양', name_list([n for n, *_, q in items if q]))])
    step(s, 2, '세어 보기', '면, 모서리, 꼭짓점')
    s.picture(fig('tb2cub', svg_of(cub(4, 2.5, 3, k=30))), width_mm=70)
    if lv == '기본형':
        s.wordbox(['면', '모서리', '꼭짓점'])
    s.fill(['선분으로 둘러싸인 부분을 (        ), 면과 면이 만나는 선분을 (        ),',
            '모서리와 모서리가 만나는 점을 (        )이라고 해요.'])
    nf, ne, nv = len(FACES), len(EDGES), 8
    a3 = qa(s, [('직육면체의 면의 수', nf, '개'), ('모서리의 수', ne, '개'), ('꼭짓점의 수', nv, '개')])
    step(s, 3, '비교하기', '직육면체와 정육면체')
    s.table([['', '직육면체', '정육면체'], ['면의 수', '(    )개', '(    )개'], ['모서리의 수', '(    )개', '(    )개'], ['꼭짓점의 수', '(    )개', '(    )개'],
             ['면의 모양', ch(lv, ['직사각형', '정사각형'], 8), ch(lv, ['직사각형', '정사각형'], 8)],
             ['모서리의 길이', ch(lv, ['4개씩 3쌍이 같아요', '모두 같아요'], 10), ch(lv, ['4개씩 3쌍이 같아요', '모두 같아요'], 10)]],
            col_mm=[40, 70, 70], row_h=3402)
    step(s, 4, '확인하기', '수학익힘')

    def ex(S):
        return (parts_mark(S, S[3], '①', -16, -14) + parts_mark(S, mid(S[0], S[2]), '②', -22, 22) + parts_mark(S, mid(S[1], S[5]), '③', 22, 12))
    s.picture(fig('tb2parts', svg_of(cub(5, 3, 3, k=30, extra=ex))), width_mm=70)
    s.choices([('①', opt('꼭짓점', '면', '모서리')), ('②', opt('꼭짓점', '면', '모서리')), ('③', opt('꼭짓점', '면', '모서리'))])
    s.picture(fig('tb2c11', svg_of(cub(3, 3, 3, k=34, dims=[(0, 1, '11 cm'), (1, 3, '㉠ cm'), (3, 7, '㉡ cm')]))), width_mm=58)
    a5 = qa(s, [('㉠', 11, ' cm'), ('㉡', 11, ' cm')])
    ans = ('2차시  ① %s   ② 직육면체, 정육면체 / %s   ③ 면, 모서리, 꼭짓점 / %s   ④ 직육면체·정육면체 모두 면 6·모서리 12·꼭짓점 8, '
           '직사각형·정사각형, 4개씩 3쌍이 같아요·모두 같아요   ⑤ ① 꼭짓점 ② 면 ③ 모서리, ㉠ %s ㉡ %s') % (
        ' / '.join(a1), ' / '.join(a2), ' / '.join(a3), a5[0], a5[1])
    if lv == '도전형':
        step(s, 5, '도전하기', '정육면체 찾기, 잘못 말한 것 고치기')
        parts = [prism([(0, 0), (4, 0), (3, 2.4), (1, 2.4)], 2.4, k=20, pad=12)[:3], cub(2.6, 2.6, 2.6, k=20, pad=12)[:3],
                 cub(4, 2, 2.6, k=20, pad=12)[:3], prism([(0, 0), (3.4, 0), (1.7, 2.8)], 3, k=20, pad=12)[:3]]
        s.picture(fig('tb2ch', hstack([fit(p, 130) for p in parts], 26, list('①②③④'))), width_mm=150)
        a6 = qa(s, [('정육면체를 모두 고르면', '②')])
        s.picture(fig('tb2c533', svg_of(cub(5, 3, 3, k=26, dims=[(0, 1, '5 cm'), (1, 3, '3 cm'), (3, 7, '3 cm')]))), width_mm=62)
        why(s, '가로 5 cm, 세로 3 cm, 높이 3 cm인 직육면체가 정육면체가 아닌 까닭을 써 보세요.', 1)
        why(s, '유성: “직육면체와 정육면체는 모서리의 길이가 모두 같아.” 유성이의 말을 바르게 고쳐 써 보세요.', 2)
        ans += ('   ⑥ %s, 5 cm × 3 cm처럼 정사각형이 아닌 면이 있어요, 정육면체는 모서리의 길이가 모두 같지만 '
                '직육면체는 길이가 같은 모서리가 4개씩 3쌍 있어요') % a6[0]
    return ans


def tb3(s, lv):
    s.lesson(3, '개념 구축하기(O)', '직육면체의 겨냥도를 알아볼까요', '직육면체 모양을 잘 알 수 있게 그리려면 어떻게 나타내면 좋을까요?')
    s.scene(None, '연서는 직육면체 모양의 상자를 그리려고 해요. 정면에서 본 상자는 면이 1개만 보여요.')
    step(s, 0, '만져 보기', '여러 방향에서 본 상자')
    views = [(-35, 24, '가'), (-35, 0, '나'), (0, 0, '다')]
    cnt = [sum(solid_vis([4, 2.5, 3], y, p)) for y, p, _ in views]
    assert cnt == [3, 2, 1]
    s.picture(fig('tb3views', views_svg([4, 2.5, 3], views)), width_mm=150)
    a1 = qa(s, [('보이는 면의 수: 가', cnt[0], '개'), ('나', cnt[1], '개'), ('다', cnt[2], '개')])
    s.choices([('직육면체 모양을 가장 잘 알 수 있는 것', opt('가', '나', '다')),
               ('보이지 않는 면도 알 수 있게 하려면 보이지 않는 모서리를', opt('점선으로 그려요', '그리지 않아요', '더 굵게 그려요'))])
    step(s, 1, '약속하기', '겨냥도')
    s.fill(['직육면체 모양을 잘 알 수 있도록 나타낸 그림을 직육면체의 %s라고 해요.' % ch(lv, ['겨냥도', '전개도', '설계도']),
            '겨냥도에서 보이는 모서리는 %s으로, 보이지 않는 모서리는 %s으로 나타내요.' % (ch(lv, ['실선', '점선'], 6), ch(lv, ['실선', '점선'], 6))])
    step(s, 2, '그려 보기', '모눈에 겨냥도 그리기')
    E = sketch_edges(4, 3, 2, 2)
    s.text('앞면은 그려져 있어요. 뒤쪽 꼭짓점은 오른쪽으로 2칸, 위로 2칸 밀린 곳에 있어요. 보이지 않는 모서리는 점선으로 그어요.')
    svg, wmm = cm_grid(8, 7, segs=[E[i] for i in (0, 1, 3, 5)], dots=True)
    s.picture(fig('tb3draw', svg), width_mm=wmm)
    hid = sum(1 for e in E if e[2])
    a3 = qa(s, [('보이는 면 / 보이지 않는 면', '3 / 3', '개'), ('보이는 모서리 / 보이지 않는 모서리', '%d / %d' % (len(E) - hid, hid), '개'),
                ('보이는 꼭짓점 / 보이지 않는 꼭짓점', '7 / 1', '개')])
    step(s, 3, '완성하기', '빠진 모서리 긋기')
    given = [0, 1, 2, 5, 9, 11, 4]
    E2 = sketch_edges(5, 2, 3, 2)
    miss = [i for i in range(12) if i not in given]
    ms, md = sum(1 for i in miss if not E2[i][2]), sum(1 for i in miss if E2[i][2])
    s.text('평행한 모서리는 평행하게, 길이가 같은 모서리는 같게 그어요. 모서리는 모두 12개예요.')
    svg, wmm = cm_grid(10, 6, segs=[E2[i] for i in given], dots=True)
    s.picture(fig('tb3fin', svg), width_mm=wmm)
    assert miss == [3, 6, 7, 8, 10] and (ms, md) == (4, 1)
    a4 = qa(s, [('더 그은 실선 / 점선', '%d / %d' % (ms, md), '개')])
    step(s, 4, '확인하기', '바르게 그린 겨냥도')
    parts = [cub(4, 2.5, 3, k=24, hidden='solid')[:3], cub(4, 2.5, 3, k=24)[:3], cub(4, 2.5, 3, k=24, miss=[(3, 7)])[:3]]
    s.picture(fig('tb3pick', hstack(parts, 24, ['가', '나', '다'])), width_mm=150)
    s.choices([('직육면체의 겨냥도를 바르게 그린 것', opt('가', '나', '다'))])
    s.text('정육면체의 겨냥도에서 보이지 않는 모서리를 모두 찾아 ○표 하세요.')
    w, h, b = sketch_svg(3, 3, 2, 2, 7, 7, range(12))
    s.picture(fig('tb3cube', _svg(w, h, b)), width_mm=62)
    a5 = qa(s, [('보이지 않는 면', 3, '개'), ('보이는 꼭짓점 / 보이지 않는 꼭짓점', '7 / 1', '개')])
    ans = '3차시  ① %s, 가, 점선으로 그려요   ② 겨냥도, 실선, 점선   ③ %s   ④ %s (실선: 앞면 오른쪽 세로, 윗면 비스듬한 모서리 2개, 뒷면 오른쪽 세로 / 점선: 뒷면 아래 가로)   ⑤ 나, 왼쪽 아래 뒤 꼭짓점에서 만나는 점선 3개에 ○, %s' % (
        ' / '.join(a1), ' / '.join(a3), a4[0], ' / '.join(a5))
    if lv == '도전형':
        step(s, 5, '도전하기', '모서리 길이의 합')
        s.picture(fig('tb3sum', svg_of(cub(5, 2, 4, k=32, dims=[(0, 1, '10 cm'), (1, 3, '4 cm'), (3, 7, '8 cm')]))), width_mm=75)
        vis, hidn = (10 + 8 + 4) * 3, 10 + 8 + 4
        a6 = qa(s, [('보이는 모서리 길이의 합', vis, ' cm'), ('보이지 않는 모서리 길이의 합', hidn, ' cm')])
        why(s, '보이는 모서리 길이의 합을 어떻게 구했는지 써 보세요.', 1)
        ans += '   ⑥ %s ((10+8+4)×3), %s (10+8+4)' % (a6[0], a6[1])
    return ans


def tb4(s, lv):
    s.lesson(4, '개념 구축하기(O)', '직육면체의 성질을 알아볼까요', '직육면체에서 마주 보는 면과 서로 만나는 면은 어떤 관계일까요?')
    s.scene(None, '로봇이 직육면체 모양의 상자를 운반하고 있어요. “이 상자들은 어떻게 안정적으로 쌓을 수 있는 걸까?”')
    step(s, 0, '만져 보기', '마주 보는 면')

    def ruler(S):
        out = []
        for p, q in ((S[3], S[7]), (S[0], S[4])):
            dx, dy = q[0] - p[0], q[1] - p[1]
            out.append('<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="%s" stroke-width="5" stroke-linecap="round" opacity=".8"/>'
                       % (r2(p[0] - dx * .3), r2(p[1] - dy * .3 - 8), r2(q[0] + dx * .5), r2(q[1] + dy * .5 - 8), ORG))
        return ''.join(out)
    s.picture(fig('tb4rul', svg_of(cub(4, 2.5, 3, k=30, fill={5: PAR, 4: PAR}, extra=ruler))), width_mm=72)
    s.text('마주 보는 두 면(윗면과 아랫면)에 자를 대어 보았어요.')
    a1 = qa(s, [('마주 보는 면은 모두 몇 쌍인가요?', len(FACES) // 2, '쌍')])
    s.choices([('마주 보는 두 면은 계속 늘여도 서로', opt('만나지 않아요', '만나요'))])
    step(s, 1, '약속하기', '평행한 면과 밑면')
    s.fill(['직육면체에서 계속 늘여도 만나지 않는 두 면을 서로 %s고 해요.' % ch(lv, ['평행하다', '수직이다'], 10),
            '이 두 면을 직육면체의 %s이라고 해요.' % ch(lv, ['밑면', '옆면', '윗면'], 6),
            '서로 평행한 면은 (    )쌍 있고, 각각 밑면이 %s.' % ch(lv, ['될 수 있어요', '될 수 없어요'], 10)])
    step(s, 2, '만나는 면', '○표 한 면과 만나는 면')

    def ring(S):
        c = mid(S[0], S[2])
        return _t(c[0], c[1], '○', 30, RED, weight='bold')
    s.picture(fig('tb4ring', svg_of(cub(4, 2.5, 3, k=30, fill={0: '#FFD27A'}, extra=ring))), width_mm=70)
    meet = perp_faces(0)
    a3 = qa(s, [('○표 한 면(앞면)과 만나는 면의 수', len(meet), '개')])
    s.picture(fig('tb4right', right_svg(3, 4)), width_mm=65)
    s.choices([('삼각자의 직각 부분이 꼭 맞으므로 서로 만나는 면은', opt('수직으로 만나요', '평행하게 만나요'))])
    step(s, 3, '약속하기', '옆면')
    s.fill(['직육면체에서 밑면과 만나는 면을 직육면체의 %s이라고 해요.' % ch(lv, ['옆면', '밑면', '윗면'], 6),
            '밑면과 옆면은 %s 만나요. 한 밑면에 대한 옆면은 모두 %s예요.' % (ch(lv, ['수직으로', '평행하게'], 8), ch(lv, ['4개', '2개', '6개'], 6))])
    step(s, 4, '확인하기', '면 ㄱㄴㄷㄹ과 평행한 면, 수직인 면')
    s.picture(fig('tb4lab', svg_of(cub(4, 2.5, 3, k=32, lab=True, fill={5: PAR}))), width_mm=72)
    s.text('면 이름은 꼭짓점을 차례대로 읽어요. (예: 면 ㄱㄴㄷㄹ)')
    a5 = qa(s, [('면 ㄱㄴㄷㄹ과 평행한 면', FTXT[OPP[5]]), ('면 ㄱㄴㄷㄹ과 수직인 면 (4개)', face_set_txt(perp_faces(5)))], col=(80, 100))
    ans = '4차시  ① %s, 만나지 않아요   ② 평행하다, 밑면, 3, 될 수 있어요   ③ %s, 수직으로 만나요   ④ 옆면, 수직으로, 4개   ⑤ %s / %s' % (
        a1[0], a3[0], a5[0], a5[1])
    if lv == '도전형':
        step(s, 5, '도전하기', '직육면체의 성질 이용하기')
        s.choices([('직육면체에 대해 잘못 설명한 것', '( ㉠ 한 모서리에서 만나는 두 면은 수직이에요. /\n㉡ 밑면이 될 수 있는 면은 모두 2쌍이에요. /\n㉢ 한 꼭짓점에서 만나는 모서리는 모두 3개예요. )')])
        W, H, D = 7, 5, 11
        s.picture(fig('tb4ch', svg_of(solid([W, H, D], 62, 22, lab=True, fill=lambda f: PAR if f == 2 else None,
                                             dim_lab=[(4, 0, '11 cm'), (6, 4, '5 cm'), (0, 1, '7 cm')]))), width_mm=82)
        par = OPP[2]
        l1, l2 = face_lens(par, (W, H, D))
        a6 = qa(s, [('색칠한 면 ㄱㄴㅂㅁ과 평행한 면', FTXT[par]), ('그 면의 모서리 길이의 합', (l1 + l2) * 2, ' cm')], col=(100, 80))
        bp = both_perp(0, 3)
        s.text('면 ㄴㅂㅅㄷ과 면 ㄷㅅㅇㄹ에 동시에 수직인 면을 모두 찾아요. (⑤의 그림을 보세요.)')
        a7 = qa(s, [('동시에 수직인 면', face_set_txt(bp))], col=(80, 100))
        why(s, '두 면에 동시에 수직인 면을 어떻게 찾았는지 써 보세요.', 1)
        ans += '   ⑥ ㉡(평행한 면 3쌍 모두 밑면), %s, (%d+%d)×2=%s, %s' % (a6[0], max(l1, l2), min(l1, l2), a6[1], a7[0])
    return ans


def cube_draw_pages(s, lv, key, n, cols, rows, given, extra1, other_cells, title2):
    """정육면체 전개도 그리기(실제 크기 모눈) ①·② — 정답 예시 글."""
    svg, wmm = cm_grid(cols, rows, faces=given)
    s.picture(fig(key + 'a', svg), width_mm=wmm)
    F1 = net_draw_example(given, extra1, (n, n, n))
    s.page_break()
    s.text(title2)
    svg, wmm = cm_grid(cols, rows)
    s.picture(fig(key + 'b', svg), width_mm=wmm)
    F2 = SQ(other_cells)
    F2 = [R(r['x'] * n, r['y'] * n, n, n) for r in F2]
    assert ok(F2) and dims_of(F2) == [n] * 3

    def key_(F):
        out = []
        for t in range(8):
            Q = []
            for r in F:
                P = [(r['x'], r['y']), (r['x'] + r['w'], r['y'] + r['h'])]
                for _ in range(t % 4):
                    P = [(y, -x) for x, y in P]
                if t >= 4:
                    P = [(-x, y) for x, y in P]
                Q.append((min(P[0][0], P[1][0]), min(P[0][1], P[1][1])))
            mx, my = min(q[0] for q in Q), min(q[1] for q in Q)
            out.append(tuple(sorted((x - mx, y - my) for x, y in Q)))
        return min(out)
    assert key_(F1) != key_(F2)
    return F1


def tb5(s, lv):
    s.lesson(5, '개념 구축하기(O)', '정육면체의 전개도를 알아볼까요', '정육면체의 모서리를 잘라서 펼치면 어떤 모양이 될까요?')
    s.scene(None, '물류 센터의 로봇이 정육면체 모양의 상자를 모서리를 잘라 펼치고 있어요.')
    step(s, 0, '만져 보기', '정육면체 상자 펼치기')
    s.picture(fig('tb5cross', svg_of(net(CUBE_NET, k=40))), width_mm=75)
    a1 = qa(s, [('펼친 모양을 이루는 정사각형의 수', len(CUBE_NET), '개')])
    s.choices([('펼친 그림에는 잘린 모서리와', opt('잘리지 않은 모서리', '보이지 않는 모서리') + '가 있어요')])
    step(s, 1, '약속하기', '정육면체의 전개도')
    s.fill(['정육면체의 모서리를 잘라서 평면 위에 펼쳐 놓은 그림을 정육면체의 %s라고 해요.' % ch(lv, ['전개도', '겨냥도', '설계도']),
            '전개도에서 잘린 모서리는 %s으로, 잘리지 않은 모서리는 %s으로 나타내요.' % (ch(lv, ['실선', '점선'], 6), ch(lv, ['실선', '점선'], 6))])
    step(s, 2, '찾아보기', '정육면체의 전개도가 될 수 있는 것')
    s.picture(fig('tb5judge', nets_svg(TB_L5A2, 30)), width_mm=165)
    can, whyd = judge(TB_L5A2)
    assert can == ['가', '나', '라'] and whyd == {'다': 'overlap'}
    a3 = qa(s, [('전개도가 될 수 있는 것', name_list(can)), ('전개도가 될 수 없는 것', '다')])
    s.choices([('될 수 없는 까닭', '( 접었을 때 겹치는 두 면이 있어요. /\n면이 6개보다 적어요. / 정사각형이 아닌 면이 있어요. )')])
    step(s, 3, '겹치는 부분', '접었을 때 겹치는 점과 선분')
    F, P = TB_L5A3
    res = net_tasks(F, P, ['ㅌ', 'ㅈ', 'ㄴㄷ', 'ㅇㅅ'])
    assert [r[2] for r in res] == [['ㅎ'], ['ㅋ', 'ㄱ'], ['ㄹㄷ'], ['ㄹㅁ']]
    s.picture(pts_fig('tb5pts', F, P, 60), width_mm=100)
    if lv == '기본형':
        s.text('점선(접는 선)을 따라 이웃한 면을 접어 올린다고 생각해요.')
    ask_pts(s, lv, res)
    step(s, 4, '그려 보기', '한 모서리가 3 cm인 정육면체의 전개도')
    real_note(s)
    s.text('① 일부 그려진 전개도를 완성해 보세요. 잘린 모서리는 실선, 잘리지 않은 모서리는 점선으로 그어요.')
    given = [R(1, 4, 3, 3), R(4, 4, 3, 3), R(7, 4, 3, 3)]
    F1 = cube_draw_pages(s, lv, 'tb5draw', 3, 15, 11, given, [R(10, 4, 3, 3), R(4, 1, 3, 3), R(4, 7, 3, 3)],
                         [[0, 0], [0, 1], [1, 1], [2, 1], [3, 1], [3, 2]], '② 이번에는 ①과 다른 모양으로 그려 보세요.')
    s.text('그린 전개도가 옳은지 확인할 것에 ○, 아닌 것에 ×를 해요.')
    a5 = ox(s, [('면이 6개예요.', 1), ('모든 모서리의 길이가 같아요.', 1), ('접었을 때 겹치는 면이 없어요.', 1), ('면의 크기가 모두 달라요.', 0)], '확인할 것')
    ans = ('5차시  ① %s, 잘리지 않은 모서리   ② 전개도, 실선, 점선   ③ %s / 다, 접었을 때 겹치는 두 면이 있어요   ④ %s   '
           '⑤ (예) ① 오른쪽 끝에 1개, 둘째 면 위·아래에 1개씩(십자 모양), 접는 선 5개는 점선 ② 계단 모양 등 ①과 다른 모양, %s') % (
        a1[0], ' / '.join(a3), task_txt(res), a5)
    if lv == '도전형':
        step(s, 5, '도전하기', '수학익힘')
        F, P = TB_L5U1
        res2 = net_tasks(F, P, ['ㄱ', 'ㅇㅈ'])
        assert [r[2] for r in res2] == [['ㅋ'], ['ㅂㅁ']]
        s.picture(pts_fig('tb5u1', F, P, 56), width_mm=95)
        ask_pts(s, lv, res2)
        base = SQ([[0, 1], [1, 1], [2, 1], [3, 1], [1, 0]])
        cands = [dict(R(x, y, 1, 1), name=nm) for x, y, nm in [[0, 0, '㉠'], [2, 0, '㉡'], [4, 1, '㉢'], [3, 0, '㉣'], [2, 2, '㉤']]]
        nm, _ = add_face_task(s, 'tb5add', '정사각형 1개를 더 붙여 정육면체의 전개도를 만들려고 해요. 붙일 수 있는 자리는 어디일까요?', base, cands, '#EEF5FC', 85)
        a7 = qa(s, [('붙일 수 있는 자리', nm)])
        why(s, '다른 자리에 붙이면 안 되는 까닭을 써 보세요.', 1)
        ans += '   ⑥ %s, %s (다른 자리는 접었을 때 겹치는 면이 생겨요)' % (task_txt(res2), a7[0])
    return ans


def tb6(s, lv):
    s.lesson(6, '개념 구축하기(O)', '직육면체의 전개도를 알아볼까요', '직육면체의 모서리를 잘라서 펼치면 어떤 모양이 되고, 전개도는 어떻게 그릴까요?')
    s.scene(None, '연서는 기념품으로 받은 직육면체 모양의 선물 상자(가로 4 cm, 세로 2 cm, 높이 3 cm)를 펼쳐 보았어요.')
    step(s, 0, '만져 보기', '선물 상자 펼치기')
    sizes = sorted((min(r['w'], r['h']), max(r['w'], r['h'])) for r in TB_GIFT)
    assert len(set(sizes)) == 3 and all(sizes.count(z) == 2 for z in sizes)
    s.picture(fig('tb6gift', svg_of(net(TB_GIFT, k=34, grid=True, face_text=lambda f: str(f + 1)))), width_mm=120)
    s.text('선물 상자를 펼친 모양이에요. (모눈 한 칸은 1 cm, 면에 번호를 붙였어요.)')
    s.choices([('펼친 모양을 이루는 도형', opt('직사각형', '정사각형', '삼각형'))])
    a1 = qa(s, [('면의 수', len(TB_GIFT), '개'), ('모양과 크기가 같은 직사각형', '2개씩 3', '쌍')])
    step(s, 1, '약속하기', '직육면체의 전개도와 마주 보는 면')
    s.fill('직육면체의 모서리를 잘라서 평면 위에 펼쳐 놓은 그림을 직육면체의 %s라고 해요.' % ch(lv, ['전개도', '겨냥도']))
    pairs = opp_pairs(TB_GIFT)
    if lv == '기본형':
        s.text('가로로 이어진 4개의 면에서는 한 면 건너 있는 면이 마주 보는 면이에요.')
    a2 = qa(s, [('위 전개도에서 접었을 때 마주 보는 면 3쌍(번호)', ', '.join('%s %d' % (josa(i + 1, '과와'), j + 1) for i, j in pairs))])
    s.choices([('마주 보는 두 면의 모양과 크기는', opt('같아요', '달라요'))])
    step(s, 2, '찾아보기', '직육면체의 전개도가 될 수 있는 것')
    can, whyd = judge(TB_L6A2)
    assert can == ['나', '다', '라'] and list(whyd) == ['가']
    s.picture(fig('tb6judge', nets_svg(TB_L6A2, 18, grid=True, h=150)), width_mm=172)
    s.text('모눈 한 칸은 1 cm예요.')
    a3 = qa(s, [('전개도가 될 수 있는 것', name_list(can)), ('전개도가 될 수 없는 것', '가')])
    s.choices([('될 수 없는 까닭', '( 접었을 때 맞닿는 모서리의 길이가 달라요. /\n면이 7개예요. / 정사각형이 있어요. )')])
    step(s, 3, '겹치는 부분', '접었을 때 겹치는 점과 선분')
    F, P = TB_L6A3
    res = net_tasks(F, P, ['ㅌ', 'ㅇ', 'ㅈㅊ', 'ㄴㄷ'])
    assert [r[2] for r in res] == [['ㅊ'], ['ㄴ', 'ㄹ'], ['ㅍㅌ'], ['ㄹㄷ']]
    s.picture(pts_fig('tb6pts', F, P, 30), width_mm=120)
    ask_pts(s, lv, res)
    step(s, 4, '그려 보기', '가로 4 cm, 세로 2 cm, 높이 3 cm인 직육면체의 전개도')
    s.picture(fig('tb6cub', svg_of(cub(4, 3, 2, k=26, dims=[(0, 1, '4 cm'), (1, 3, '3 cm'), (3, 7, '2 cm')]))), width_mm=55)
    real_note(s)
    if lv == '기본형':
        s.text('4 cm × 3 cm, 2 cm × 3 cm, 4 cm × 2 cm인 면이 2개씩 있어요. 면 3개는 그려져 있어요.')
    else:
        s.text('면 3개는 그려져 있어요. 나머지 면을 그리고 접는 선은 점선으로 그어요.')
    given = [R(2, 3, 4, 3), R(6, 3, 2, 3), R(2, 1, 4, 2)]
    net_draw_example(given, [R(8, 3, 4, 3), R(0, 3, 2, 3), R(2, 6, 4, 2)], (4, 3, 2))
    svg, wmm = cm_grid(16, 11, faces=given)
    s.picture(fig('tb6draw', svg), width_mm=wmm)
    ans = ('6차시  ① 직사각형, %s   ② 전개도, %s, 같아요   ③ %s / 가, 맞닿는 모서리의 길이가 달라요   ④ %s   '
           '⑤ (예) 4×3 면을 오른쪽 끝에, 2×3 면을 왼쪽에, 4×2 면을 아래에 그리고 접는 선 5개를 점선으로') % (
        ' / '.join(a1), a2[0], ' / '.join(a3), task_txt(res))
    if lv == '도전형':
        s.page_break()
        step(s, 5, '도전하기', '수학익힘')
        F, P = TB_L6U1
        res2 = net_tasks(F, P, ['ㄱ', 'ㄴㄷ'])
        assert [r[2] for r in res2] == [['ㅋ', 'ㅈ'], ['ㅇㅅ']]
        s.picture(pts_fig('tb6u1', F, P, 26), width_mm=110)
        ask_pts(s, lv, res2)
        Fa = net_from_cells(CROSS, {1: 4, 2: 7, 4: 9})
        la = [((0, 4), (4, 4), '㉠', 0, -14), ((4, 0), (13, 0), '㉡', 0, -14), ((26, 4), (26, 11), '㉢', 18, 0)]
        va = [math.dist(p, q) for p, q, *_ in la]
        assert va == [4, 9, 7]
        sk = cub(9, 7, 4, k=14, pad=56, dimd=32, dim_size=19, dims=[(0, 1, '9 cm'), (0, 2, '7 cm'), (3, 7, '4 cm')])[:3]
        nt = net(Fa, k=14, extra=lambda m: ''.join(seg_label(m, p, q, t, dx, dy, RED, 21) for p, q, t, dx, dy in la))[:3]
        s.picture(fig('tb6abc', hstack([sk, nt], 30)), width_mm=165)
        a7 = qa(s, [('㉠ / ㉡ / ㉢', ' / '.join('%d' % v for v in va), ' cm')])
        Fb = net_from_cells(CROSS, {1: 5, 2: 8, 4: 11})
        lb = [((32, 5), (32, 13), '8 cm', 26, 0, BLUE), ((5, 0), (16, 0), '11 cm', 0, -12, BLUE), ((16, 5), (21, 5), '5 cm', 0, -12, BLUE),
              ((0, 5), (0, 13), '㉠', -14, 0, RED), ((5, 13), (5, 18), '㉡', -14, 0, RED), ((21, 5), (32, 5), '㉢', 0, -12, RED)]
        vb = [math.dist(p, q) for p, q, t, *_ in lb if t in '㉠㉡㉢']
        assert vb == [8, 5, 11]
        s.picture(fig('tb6abc2', svg_of(net(Fb, k=9, pad=44, extra=lambda m: ''.join(seg_label(m, p, q, t, dx, dy, c, 16) for p, q, t, dx, dy, c in lb)))), width_mm=120)
        a8 = qa(s, [('㉠ / ㉡ / ㉢', ' / '.join('%d' % v for v in vb), ' cm')])
        n4 = [('첫째', [R(0, 1, 1, 2), R(1, 1, 3, 2), R(4, 1, 1, 2), R(5, 1, 3, 2), R(1, 0, 2, 1), R(1, 3, 3, 1)]),
              ('둘째', net_from_cells(CROSS, {1: 1, 2: 2, 4: 3}))]
        can4, _ = judge(n4)
        assert can4 == ['둘째']
        s.picture(fig('tb6two', nets_svg(n4, 22, grid=True)), width_mm=120)
        a9 = qa(s, [('직육면체의 전개도가 될 수 있는 것', can4[0])])
        why(s, '고르지 않은 전개도가 직육면체의 전개도가 될 수 없는 까닭을 써 보세요.', 1)
        ans += '   ⑥ %s, %s, %s, %s (첫째는 맞닿는 모서리의 길이가 달라요)' % (task_txt(res2), a7[0], a8[0], a9[0])
    return ans


def tb7(s, lv):
    s.lesson(7, '탐구 정리하기(O)', '생각을 더하다 ― 직육면체로 장난감을 만들어요', '직육면체의 전개도를 이용해 장난감을 만들려면 어떻게 해야 할까요?')
    s.scene(None, '직육면체를 이용하여 로봇 모양의 장난감을 만들려고 해요.')
    step(s, 0, '살펴보기', '장난감 설계도')
    s.picture(fig('tb7toy', toy_svg(TB_TOY, TB_TOY_SLOTS, [('머리 2×2×2', 7.1, 1.6), ('팔 1×3×1', 7.1, 3.6), ('몸통 3×4×2', 7.1, 4.6), ('다리 1×1×1', 7.1, 7.6)], 10.5, 9)),
              width_mm=85)
    s.text('머리: 한 모서리 2 cm / 몸통: 가로 3 cm, 세로 2 cm, 높이 4 cm / 팔: 가로 1 cm, 세로 1 cm, 높이 3 cm / 다리: 한 모서리 1 cm')
    kind = {k: '정육면체' if len(set(v[:3])) == 1 else '직육면체' for k, v in TB_TOY.items()}
    s.choices([('머리', opt('정육면체', '직육면체')), ('몸통', opt('정육면체', '직육면체')), ('팔', opt('정육면체', '직육면체')), ('다리', opt('정육면체', '직육면체'))])
    step(s, 1, '생각하기', '전개도를 그릴 때 생각할 점')
    a2 = ox(s, [('면을 6개 그려요.', 1), ('접었을 때 겹치는 면이 없도록 그려요.', 1), ('접었을 때 겹치는 선분의 길이가 같도록 그려요.', 1),
                ('모든 면을 서로 다른 크기로 그려요.', 0)], '생각할 점')
    out = []
    for i, (nm, desc, (F, C), col) in enumerate(TB_PARTS):
        if i == 0:
            step(s, 2, '완성하기 ①', '머리와 몸통')
            s.text('면이 5개만 있어요. 전개도가 되도록 면 1개를 붙일 자리(㉠, ㉡, ㉢)를 골라 색칠하고, 색칠한 면에서 잘리지 않는 모서리를 점선으로 그어 보세요.')
        if i == 2:
            step(s, 3, '완성하기 ②', '팔과 다리')
        w = {0: 70, 1: 90, 2: 60, 3: 50}[i]
        a, nh = add_face_task(s, 'tb7p%d' % i, '%s(%s) · 모눈 한 칸은 1 cm' % (nm, desc), F, C, col, w)
        out.append((nm, a, nh))
        qa(s, [('%s: 붙일 자리 / 점선으로 그을 모서리 수' % nm, '%s / %d' % (a, nh), '개')])
    step(s, 4, '만들기', '장난감 완성하기')
    s.text('완성한 전개도를 점선을 따라 접어 각 부분을 만들고, 설계도대로 붙여 장난감을 완성해요.')
    write_pane(s, lv, [('만든 과정', '면 6개가 ______________ 전개도를 완성하고, ______ 을 따라 접어 설계도대로 붙였어요.')])
    ans = '7차시  ① 머리 %s, 몸통 %s, 팔 %s, 다리 %s   ② %s   ③④ %s   ⑤ (자유)' % (
        kind['head'], kind['body'], kind['arm'], kind['leg'], a2, ', '.join('%s %s(점선 %d개)' % x for x in out))
    if lv == '도전형':
        step(s, 5, '도전하기', '팔의 전개도 고르기')
        n4 = [('가', net_from_cells(CROSS, {1: 1, 2: 3, 4: 1})), ('나', [R(0, 1, 1, 3), R(1, 1, 1, 3), R(2, 1, 1, 3), R(3, 1, 1, 3), R(1, 0, 1, 1), R(3, 0, 1, 1)]),
              ('다', net_from_cells([[0, 0], [0, 1], [1, 1], [2, 1], [3, 1], [3, 2]], {1: 1, 2: 1, 4: 3})),
              ('라', [R(0, 1, 1, 3), R(1, 1, 1, 3), R(2, 1, 1, 3), R(3, 1, 1, 3), R(1, 0, 1, 1), R(1, 4, 1, 3)])]
        can, whyd = judge(n4)
        assert can == ['가', '다'] and whyd['나'] == 'overlap' and whyd['라'] in ('partial', 'length'), (can, whyd)
        assert all(dims_of(F) == [1, 1, 3] for n, F in n4 if n in can)
        s.text('팔(가로 1 cm, 세로 1 cm, 높이 3 cm인 직육면체)을 하나 더 만들려고 해요. (모눈 한 칸은 1 cm)')
        s.picture(fig('tb7arm', nets_svg(n4, 20, grid=True, h=140)), width_mm=160)
        a6 = qa(s, [('팔의 전개도가 될 수 있는 것', name_list(can))])
        why(s, '나와 라가 팔의 전개도가 될 수 없는 까닭을 각각 써 보세요.', 2)
        ans += '   ⑥ %s (나는 접었을 때 두 면이 겹치고, 라는 맞닿는 모서리의 길이가 달라요)' % a6[0]
    return ans


NET_ORDER = [3, 6, 0, 5, 2, 7, 1, 4]     # 활동지의 전개도 카드 1~8 차례(앱은 섞어서 보여 줌)


def card_game(s, lv, shapes, word, i0):
    """8차시 공통: 카드 살펴보기·놀이 장면·짝 맞추기. → 정답 글 목록"""
    D = deck(shapes)
    sks = [c for c in D if c['kind'] == 'sk']
    nets = [c for c in D if c['kind'] == 'net']
    step(s, i0, '카드 살펴보기', '겨냥도 카드와 전개도 카드')
    s.text('겨냥도 카드 4장과 전개도 카드 8장이에요. 전개도의 모눈 칸을 세어 면의 가로와 세로를 알아보고, 같은 %s의 겨냥도를 찾아 써 보세요. (모눈 한 칸은 1 cm)' % word)
    s.picture(fig('cards_sk_%s' % word, hstack([fit(card_svg(c, shapes), 150) for c in sks], 22, ['겨냥도 ' + shapes[c['shape']][0] for c in sks], 18)), width_mm=170)
    order = [nets[i] for i in NET_ORDER]
    for row in range(2):
        cs = order[row * 4:row * 4 + 4]
        s.picture(fig('cards_net_%s%d' % (word, row), hstack([card_svg(c, shapes) for c in cs], 22,
                                                             ['카드 %d' % (row * 4 + i + 1) for i in range(4)], 18)), width_mm=165)
    s.table([['카드'] + [str(i + 1) for i in range(8)], ['겨냥도'] + ['' for _ in range(8)]], header=True, header_col=True,
            col_mm=[28] + [19] * 8, row_h=3402)
    a1 = ' '.join('%d-%s' % (i + 1, shapes[c['shape']][0]) for i, c in enumerate(order))
    step(s, i0 + 1, '놀이하기', '어떤 카드를 넘길까요?')
    s.text('같은 %s 카드 3장(겨냥도 1장 + 전개도 2장)을 먼저 모으면 이겨요. 내 카드 3장 중 넘길 카드를 골라 보세요.' % word)
    hand1 = [sks[0], nets[0], nets[4]]
    hand2 = [sks[0], sks[1], nets[2]]
    for hi, hand in enumerate((hand1, hand2)):
        s.picture(fig('hand_%s%d' % (word, hi), hstack([fit(card_svg(c, shapes), 150) if c['kind'] == 'sk' else card_svg(c, shapes) for c in hand], 22, ['A', 'B', 'C'], 18)), width_mm=120)
    # 넘길 카드: 두 장이 같은 도형이면 나머지 하나, 겨냥도가 둘이면 전개도와 다른 쪽 겨냥도
    p1 = next(L for L, c in zip('ABC', hand1) if [x['shape'] for x in hand1].count(c['shape']) == 1)
    p2 = next(L for L, c in zip('ABC', hand2) if c['kind'] == 'sk' and c['shape'] != hand2[2]['shape'])
    a2 = qa(s, [('첫째 손: 넘길 카드', p1), ('둘째 손: 넘길 카드', p2)])
    step(s, i0 + 2, '짝 맞추기', '같은 %s의 전개도 카드' % word)
    pairs = []
    for si in range(4):
        idx = [i + 1 for i, c in enumerate(order) if c['shape'] == si]
        pairs.append('%s %d(%s)' % (josa(idx[0], '과와'), idx[1], shapes[si][0]))
    s.text('뒤집어 놓은 전개도 카드 8장에서 두 장씩 펼쳐 같은 %s의 전개도이면 가져가요. 위 카드 1~8에서 짝을 모두 찾아 써 보세요.' % word)
    s.lines(1)
    return D, nets, order, a1, a2, ', '.join(pairs)


def tb8(s, lv):
    s.lesson(8, '발표하기(P)', '놀이를 더하다 ― 같은 도형 카드를 모아요', '같은 도형의 겨냥도와 전개도 카드를 어떻게 하면 빨리 모을 수 있을까요?')
    s.scene(None, '연서는 친구들과 ‘같은 도형 카드를 모아요’ 놀이를 해요. 같은 도형 카드는 겨냥도 1장과 전개도 2장이에요.')
    step(s, 0, '놀이 방법', '차례대로 번호 쓰기')
    steps_ = ['카드를 섞어 한 명당 3장씩 나누어 가져요.', '각자 가진 카드 3장이 같은 도형을 나타내는지 확인해요.',
              '모은 사람이 없으면 동시에 ‘넘겨’를 외치며 한 장을 시계 방향으로 옆 사람에게 넘겨요.',
              '같은 도형 카드 3장을 모은 사람은 카드를 보여 줘요. 10번 되풀이해 옳게 모은 횟수가 가장 많은 사람이 이겨요.']
    show = [2, 0, 3, 1]
    s.table([['놀이 방법', '차례']] + [[steps_[i], '(    )'] for i in show], col_mm=[155, 25], row_h=3402)
    D, nets, order, a1, a2, a3 = card_game(s, lv, TB_SHAPES, '도형', 1)
    step(s, 4, '돌아보기', '놀이에서 이기는 방법')
    write_pane(s, lv, [('이기는 방법', '모을 도형을 정하고 ______________ 카드를 넘겨요.'),
                       ('알아본 방법', '전개도의 모눈 칸을 세어 면의 ______ 와 ______ 를 겨냥도의 모서리 길이와 비교했어요.')])
    ans = '8차시  ① 위에서부터 %s   ② %s   ③ %s   ④ %s   ⑤ (자유)' % (
        ', '.join(str(show[r] + 1) for r in range(4)), a1, ' / '.join(a2), a3)
    if lv == '도전형':
        step(s, 5, '도전하기', '도형 나의 전개도 카드')
        pick = [nets[0], nets[2], nets[3], nets[5], nets[6]]
        s.text('도형 나(가로 3 cm, 세로 1 cm, 높이 2 cm인 직육면체)의 전개도 카드를 모두 골라 보세요.')
        s.picture(fig('tb8pick', hstack([card_svg(c, TB_SHAPES) for c in pick], 20, list('①②③④⑤'), 18)), width_mm=170)
        a6 = [n for n, c in zip('①②③④⑤', pick) if c['shape'] == 1]
        qa(s, [('도형 나의 전개도 카드', ', '.join(a6))])
        why(s, '어떻게 찾았는지 써 보세요.', 1)
        ans += '   ⑥ %s (3×2, 3×1, 2×1인 면이 2개씩)' % ', '.join(a6)
    return ans


def tb9(s, lv):
    s.lesson(9, '발표하기(P)', '공부한 내용을 확인해요', '직육면체와 정육면체, 겨냥도와 전개도에 대해 무엇을 알게 되었나요?')
    step(s, 0, '1·2번', '도형과 각 부분의 이름')
    s.fill(['직사각형 6개로 둘러싸인 도형을 %s라고 하고,' % ch(lv, ['직육면체', '정육면체'], 10),
            '정사각형 6개로 둘러싸인 도형을 %s라고 해요.' % ch(lv, ['직육면체', '정육면체'], 10)])

    def ex(S):
        return (parts_mark(S, S[3], '③', -16, -14) + parts_mark(S, mid(S[0], S[2]), '①', -22, 22) + parts_mark(S, mid(S[1], S[5]), '②', 22, 12))
    s.picture(fig('tb9parts', svg_of(cub(5, 3, 3, k=30, extra=ex))), width_mm=70)
    s.choices([('①', opt('면', '모서리', '꼭짓점')), ('②', opt('면', '모서리', '꼭짓점')), ('③', opt('면', '모서리', '꼭짓점'))])
    step(s, 1, '3번', '평행한 면과 수직인 면')
    s.picture(fig('tb9lab', svg_of(solid([4, 2.5, 3], 35, 24, lab=True, fill=lambda f: PAR if f == 2 else None))), width_mm=80)
    s.text('직육면체에서 면 ㄱㄴㅂㅁ을 색칠했어요.')
    perp = [5, 0, 4, 1]
    assert sorted(perp) == sorted(perp_faces(2))
    a2 = qa(s, [('색칠한 면과 평행한 면', FTXT[OPP[2]]), ('색칠한 면과 수직인 면 (4개)', face_set_txt(perp))], col=(80, 100))
    step(s, 2, '4번', '가로 5 cm, 세로 2 cm, 높이 3 cm인 직육면체의 전개도')
    s.picture(fig('tb9cub', svg_of(cub(5, 3, 2, k=24, dims=[(0, 1, '5 cm'), (1, 3, '3 cm'), (3, 7, '2 cm')]))), width_mm=55)
    real_note(s)
    if lv == '기본형':
        s.text('5 cm × 3 cm, 2 cm × 3 cm, 5 cm × 2 cm인 면이 2개씩 있어요. 접는 선은 점선으로 그어요.')
    net_draw_example([], net_from_cells(CROSS, {1: 2, 2: 3, 4: 5}), (5, 3, 2))
    svg, wmm = cm_grid(16, 10)
    s.picture(fig('tb9draw', svg), width_mm=wmm)
    step(s, 3, '5·6번', '옳게 말한 사람, 잘못 그린 겨냥도')
    a4 = ox(s, [('윤호: 한 면과 수직으로 만나는 면은 모두 3개야.', len(perp_faces(0)) == 3), ('주아: 한 꼭짓점에서 만나는 면은 모두 3개야.', 1),
                ('은찬: 서로 평행한 면은 모두 3쌍이야.', len(FACES) // 2 == 3)], '친구의 말')
    w, h, b = sketch_svg(4, 3, 2, 1, 8, 6, range(12), all_solid=True)
    s.picture(fig('tb9fix', _svg(w, h, b)), width_mm=72)
    s.text('잘못 그린 겨냥도예요. 점선이어야 할 모서리에 ○표 하고, 옆에 바르게 고쳐 그려 보세요.')
    s.choices([('잘못 그린 까닭', '( 보이지 않는 모서리까지 모두 실선으로 그렸어요. /\n모서리를 12개보다 많이 그렸어요. /\n평행한 모서리를 평행하지 않게 그렸어요. )')])
    step(s, 4, '정리하기', '단원 정리')
    s.fill(['밑면과 옆면은 %s으로 만나요.' % ch(lv, ['수직', '평행'], 6),
            '직육면체 모양을 잘 알 수 있도록 나타낸 그림은 %s,' % ch(lv, ['겨냥도', '전개도'], 8),
            '정육면체의 모서리를 잘라서 평면 위에 펼쳐 놓은 그림은 정육면체의 %s예요.' % ch(lv, ['겨냥도', '전개도'], 8)])
    write_pane(s, lv, [('기억에 남는 내용', '직육면체에서 한 면과 수직인 면은 ____ 개, 평행한 면은 ____ 개예요.')])
    ans = ('9차시  ① 직육면체, 정육면체 / ① 면 ② 모서리 ③ 꼭짓점   ② %s   ③ (예) 5×3 면 2개, 2×3 면 2개, 5×2 면 2개를 겹치지 않게, 접는 선 5개는 점선   '
           '④ %s, 왼쪽 아래 뒤 꼭짓점에서 만나는 모서리 3개를 점선으로, 보이지 않는 모서리까지 모두 실선으로 그렸어요   ⑤ 수직, 겨냥도, 전개도, (자유)') % (
        ' / '.join(a2), a4)
    if lv == '도전형':
        step(s, 5, '도전하기', '단원 종합 문제')
        n6 = [('가', SQ([[0, 0], [1, 0], [2, 0], [3, 0], [3, 1], [3, 2]])), ('나', SQ([[0, 0], [1, 0], [1, 1], [2, 1], [2, 2], [3, 2]])),
              ('다', SQ([[0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [2, 0]])), ('라', SQ([[0, 0], [1, 0], [2, 0], [2, 1], [3, 1], [4, 1]])),
              ('마', SQ([[0, 0], [1, 0], [0, 1], [1, 1], [2, 1], [3, 1]])), ('바', SQ([[1, 0], [0, 1], [1, 1], [2, 1], [1, 2], [1, 3]]))]
        can, _ = judge(n6)
        assert can == ['나', '라', '바']
        s.picture(fig('tb9nets', nets_svg(n6, 24, h=110)), width_mm=172)
        a6 = qa(s, [('정육면체의 전개도가 될 수 있는 것', name_list(can))])
        why(s, '전개도가 될 수 없는 것 하나를 골라 그 까닭을 써 보세요.', 1)
        ans += '   ⑥ %s (가·다·마는 접었을 때 겹치는 면이 있어요)' % a6[0]
    return ans


TB = [tb1, tb2, tb3, tb4, tb5, tb6, tb7, tb8, tb9]

ST = []


# ================================================================ 만들기
VERSIONS = {
    'tb': ('u5-cuboid.tb.js', lambda: TB, '5-2 수학 5. 직육면체(교과서 차시)', '교과서 차시', OUT_TB),
    'st': ('u5-cuboid.st.js', lambda: ST, '5-2 수학 5. 직육면체(이야기 버전)', '이야기 버전', OUT_ST),
}


def source_ready(ver):
    """앱 원본이 있고 9차시가 모두 들어 있으면 True(이야기 버전을 쓰는 중이면 건너뜀)."""
    path = os.path.join(UNITS, VERSIONS[ver][0])
    if not os.path.exists(path):
        return False
    with open(path, encoding='utf-8') as f:
        src = f.read()
    return all('no: %d,' % n in src for n in range(1, 10)) and 'const LESSONS' in src


def build(funcs, label, short, outdir, lv):
    s = Sheet(unit_label=label, level=lv, grade_label='5학년')
    lines = [f(s, lv) for f in funcs]
    s.answers('【교사용】 5. 직육면체(%s) 활동지 정답 (%s)' % (short, lv), lines,
              note='※ 이 활동지는 앱 u5-cuboid.html과 차시 번호가 같습니다. 전개도·겨냥도를 그리는 문제의 답은 여러 가지이며, 정답 쪽에는 예시를 적었습니다.')
    os.makedirs(outdir, exist_ok=True)
    path = os.path.join(outdir, NAME % lv)
    s.save(path)
    return path


def main():
    want = [a for a in sys.argv[1:] if a in VERSIONS] or ['tb', 'st']
    out = []
    try:
        for ver in want:
            if not source_ready(ver):
                print('[건너뜀] %s 원본이 아직 없거나 덜 만들어졌어요: %s' % (ver, VERSIONS[ver][0]))
                continue
            _, funcs, label, short, outdir = VERSIONS[ver]
            for lv in ('기본형', '도전형'):
                out.append(build(funcs(), label, short, outdir, lv))
    finally:
        shutil.rmtree(WORK, ignore_errors=True)
    bad = 0
    for p in out:
        prob = check(p)
        bad += bool(prob)
        print(p, 'OK' if not prob else '\n  ' + '\n  '.join(prob))
    sys.exit(1 if bad else 0)


if __name__ == '__main__':
    main()
