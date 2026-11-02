#!/usr/bin/env python3
"""창의수학게임 › 칠교놀이 문제 만들기 (2026-10-07)

    python3 gen_tangram.py           # data/tangram.json
    python3 gen_tangram.py check     # 모든 문제의 풀이가 7조각으로 모양을 빈틈·겹침 없이 채우는지 다시 확인

조각(작은 삼각형 다리 = 1): 큰 삼각형 2(다리 2) · 중간 삼각형 1(빗변 2) · 작은 삼각형 2(다리 1) · 정사각형 1(변 1) · 평행사변형 1(변 1과 √2), 넓이 모두 8.
그림은 칸 글자로 그립니다: '#' 꽉 찬 칸, '◣◢◥◤' 반 칸(그 모양대로), '.' 빈칸. 한 칸 = 작은 삼각형 다리 1.
모든 칸 꼭짓점이 바둑판 점 위에 오는 방향(큰·작은 삼각형·정사각형·평행사변형은 곧은 변이 가로·세로, 중간 삼각형은 빗변이 가로·세로)에서
풀이를 찾아(겹침 없이 꼭 맞게 덮기 — 정확 덮기 탐색) 문제와 함께 저장합니다. 풀이가 없는 그림은 빌드를 멈춥니다.
화면에서는 조각을 45°씩 돌릴 수 있어 다른 방법으로 채워도 맞게 봅니다(그림 안을 촘촘한 점으로 재어 판정).
도전 단계의 '볼록한 모양 13가지'는 직접 그리지 않고, 가로·세로·대각선 변만 가진 넓이 8인 볼록 다각형을 모두 늘어놓고 칠교로 채워지는 것만 골라 얻습니다
(1942년 Wang·Hsiung이 13가지뿐임을 증명 — check가 13개인지 확인).
"""
import json, math, sys, pathlib
HERE = pathlib.Path(__file__).resolve().parent
sys.dont_write_bytecode = True

TYPES = ['L', 'L', 'M', 'S', 'S', 'Q', 'P']          # 조각 번호 0~6 (화면 색도 이 차례)
BASE = {'L': [(0, 0), (2, 0), (0, 2)], 'M': [(0, 0), (2, 0), (1, 1)], 'S': [(0, 0), (1, 0), (0, 1)],
        'Q': [(0, 0), (1, 0), (1, 1), (0, 1)], 'P': [(0, 0), (1, 0), (2, 1), (1, 1)]}

def centered(t):
    b = BASE[t]; mx = sum(p[0] for p in b) / len(b); my = sum(p[1] for p in b) / len(b)
    return [(x - mx, y - my) for x, y in b]

def tf(pts, r, f):
    c, s = math.cos(r * math.pi / 4), math.sin(r * math.pi / 4)
    return [((-x if f else x) * c - y * s, (-x if f else x) * s + y * c) for x, y in pts]

QC = {'N': (.5, .2), 'E': (.8, .5), 'S': (.5, .8), 'W': (.2, .5)}
def inside(poly, x, y):
    n, ins = len(poly), False
    for i in range(n):
        (x1, y1), (x2, y2) = poly[i], poly[(i + 1) % n]
        if (y1 > y) != (y2 > y) and x < x1 + (y - y1) * (x2 - x1) / (y2 - y1): ins = not ins
    return ins

def quarters(poly):
    xs = [p[0] for p in poly]; ys = [p[1] for p in poly]; out = set()
    for i in range(math.floor(min(xs)), math.ceil(max(xs))):
        for j in range(math.floor(min(ys)), math.ceil(max(ys))):
            for q, (a, b) in QC.items():
                if inside(poly, i + a, j + b): out.add((i, j, q))
    return frozenset(out)

def variants(t):
    """바둑판 위에 놓이는 방향(r 짝수)만 — (r, f, 0에 맞춘 꼭짓점, 칸 조각 집합)"""
    seen, out = set(), []
    for f in (0, 1):
        for r in (0, 2, 4, 6):
            v = tf(centered(t), r, f); mx = min(p[0] for p in v); my = min(p[1] for p in v)
            v = [(round(x - mx, 9), round(y - my, 9)) for x, y in v]
            assert all(abs(c - round(c)) < 1e-6 for p in v for c in p), (t, r, f, v)
            v = [(round(x), round(y)) for x, y in v]; qs = quarters(v)
            if qs in seen: continue
            seen.add(qs); out.append((r, f, v, qs))
    return out
VAR = {t: variants(t) for t in BASE}

GLYPH = {'#': 'NESW', '◣': 'WS', '◢': 'ES', '◥': 'NE', '◤': 'NW', '.': '', ' ': ''}
def parse(rows):
    T = set()
    for j, row in enumerate(rows):
        for i, ch in enumerate(row):
            for q in GLYPH[ch]: T.add((i, j, q))
    return frozenset(T)

def solve(T, first=True):
    """T(칸 조각 집합)을 7조각으로 정확히 덮는 방법 — [(조각 종류, 꼭짓점들, r, f)]"""
    if len(T) != 32: return None
    xs = [q[0] for q in T]; ys = [q[1] for q in T]
    PL = {}
    for t in BASE:
        PL[t] = []
        for r, f, v, qs in VAR[t]:
            for kx in range(min(xs) - 2, max(xs) + 1):
                for ky in range(min(ys) - 2, max(ys) + 1):
                    s = frozenset((i + kx, j + ky, q) for i, j, q in qs)
                    if s <= T: PL[t].append((s, [(x + kx, y + ky) for x, y in v], r, f))
    order = sorted(T, key=lambda q: (q[1], q[0], 'NWES'.index(q[2])))
    left = {'L': 2, 'M': 1, 'S': 2, 'Q': 1, 'P': 1}; cov = set(); sol = []; found = []
    def rec():
        if len(cov) == 32: found.append(list(sol)); return first
        q = next(x for x in order if x not in cov)
        for t in ('L', 'P', 'M', 'Q', 'S'):
            if not left[t]: continue
            for s, v, r, f in PL[t]:
                if q in s and not (s & cov):
                    left[t] -= 1; cov.update(s); sol.append((t, v, r, f))
                    if rec(): return True
                    sol.pop(); cov.difference_update(s); left[t] += 1
        return False
    rec()
    return found[0] if found else None

def convex13():
    """가로·세로·대각선 변만 가진 넓이 8인 볼록 다각형 가운데 칠교로 채워지는 것(돌리기·뒤집기로 같은 것은 하나만)"""
    shapes, keys = [], set()
    for a in range(1, 9):
        for b in range(1, 9):
            for c1 in range(0, min(a, b) + 1):
                for c2 in range(0, min(a, b) + 1):
                    for c3 in range(0, min(a, b) + 1):
                        for c4 in range(0, min(a, b) + 1):
                            if c1 + c2 > a or c3 + c4 > a or c1 + c4 > b or c2 + c3 > b: continue
                            if a * b * 2 - (c1 * c1 + c2 * c2 + c3 * c3 + c4 * c4) != 16: continue
                            # 꼭짓점(시계 방향, y 아래로) — 길이 0인 변은 뺌
                            P = [(c1, 0), (a - c2, 0), (a, c2), (a, b - c3), (a - c3, b), (c4, b), (0, b - c4), (0, c1)]
                            poly = [p for k, p in enumerate(P) if p != P[k - 1]]
                            T = quarters(poly)
                            key = canon(T)
                            if key in keys: continue
                            keys.add(key)
                            s = solve(T)
                            if s: shapes.append((poly, T, s))
    return shapes

def canon(T):
    best = None
    for k in range(8):
        S = []
        for i, j, q in T:
            x, y = i * 2 + 1 + {'N': 0, 'S': 0, 'E': .6, 'W': -.6}[q], j * 2 + 1 + {'N': -.6, 'S': .6, 'E': 0, 'W': 0}[q]
            for _ in range(k % 4): x, y = -y, x
            if k >= 4: x = -x
            S.append((round(x, 3), round(y, 3)))
        mx = min(p[0] for p in S); my = min(p[1] for p in S)
        S = tuple(sorted((round(x - mx, 3), round(y - my, 3)) for x, y in S))
        best = S if best is None or S < best else best
    return best

# ── 그림(쉬움: 조각 선이 보임, 앞 8문제는 조각 방향도 맞춰 줌 / 보통: 그림자만) ──
EASY = [
    ('집', ['.◢◣.', '◢##◣', '.##.', '.##.']),
    ('로켓', ['.◢◣.', '.##.', '.##.', '◢##◣']),
    ('나무', ['.◢◣.', '◢##◣', '◢##◣', '.#..']),
    ('버섯', ['◢##◣', '◥##◤', '.##.']),
    ('물고기', ['.◢◣..', '◢##◣◢', '◥##◤◥']),
    ('배', ['#...', '#◣..', '##◣.', '◥##◤']),
    ('크리스마스트리', ['.◢◣.', '◢##◣', '.◢◣.', '◢##◣']),
    ('나비', ['◣..◢', '#◣◢#', '#◤◥#', '◤..◥']),
    ('트로피', ['◥##◤', '.##.', '◢##◣']),
    ('기차', ['##..', '####', '◥◤◥◤']),
    ('의자', ['#...', '#...', '####', '#..#']),
    ('성', ['#..#', '####', '◥◤◥◤']),
]
NORMAL = [
    ('돛단배', ['.◣..', '.#◣.', '◢##◣', '◥##◤']),
    ('고양이', ['◣◢..', '##..', '◥#◣.', '.###']),
    ('사람', ['.#..', '◢##◣', '.##.', '.##.']),
    ('비행기', ['..#..', '◢###◣', '..#..', '.◢#◣.']),
    ('강아지', ['◣....', '##◣..', '.####', '.◥..◥']),
    ('자동차', ['.◢#◣.', '◢###◣', '.#..#']),
    ('백조', ['◢◣...', '.#...', '.#◢◣.', '◢###◣']),
    ('토끼', ['◣◢..', '##..', '◥##◣', '.##.']),
    ('펭귄', ['.◢◣.', '.##.', '◢##◤', '.##.']),
    ('부엉이', ['◣..◢', '####', '◥##◤']),
    ('새', ['..◢◣', '.◢##', '◢###', '◥◤..']),
    ('낙타', ['.◢◣◢◣.', '◢####◣', '..◥◤..']),
    ('춤추는 사람', ['.◢◣.', '◢##◣', '.##.', '◢◤◥◣']),
]

def pieces(sol):
    """풀이 → [[조각 번호, 무게중심 x, y, r, f]] (같은 종류는 앞 번호부터)"""
    out, used = [], set()
    for t, v, r, f in sol:
        k = next(i for i, tt in enumerate(TYPES) if tt == t and i not in used); used.add(k)
        cx = sum(p[0] for p in v) / len(v); cy = sum(p[1] for p in v) / len(v)
        out.append([k, round(cx, 4), round(cy, 4), r, f])
    return sorted(out)

def convex_name(poly):
    n = len(poly)
    if n == 3: return '삼각형'
    if n == 5: return '오각형'
    if n == 6: return '육각형'
    d = [(poly[(i + 1) % 4][0] - poly[i][0], poly[(i + 1) % 4][1] - poly[i][1]) for i in range(4)]
    par = lambda a, b: a[0] * b[1] - a[1] * b[0] == 0
    p1, p2 = par(d[0], d[2]), par(d[1], d[3])
    if p1 and p2:
        right = d[0][0] * d[1][0] + d[0][1] * d[1][1] == 0
        if not right: return '평행사변형'
        return '정사각형' if d[0][0] ** 2 + d[0][1] ** 2 == d[1][0] ** 2 + d[1][1] ** 2 else '직사각형'
    return '사다리꼴'

def gen():
    data = {'easy': [], 'normal': [], 'hard': []}
    for lv, L in (('easy', EASY), ('normal', NORMAL)):
        for i, (nm, rows) in enumerate(L):
            s = solve(parse(rows)); assert s, f'{nm}: 7조각으로 채울 수 없음'
            p = {'nm': nm, 'pcs': pieces(s), 'rows': rows}
            if lv == 'easy': p['ln'] = 1; p['pre'] = 1 if i < 8 else 0
            data[lv].append(p)
    order = ['삼각형', '정사각형', '직사각형', '평행사변형', '사다리꼴', '오각형', '육각형']
    cs = sorted(convex13(), key=lambda c: (order.index(convex_name(c[0])), len(c[1]), str(c[0])))
    cnt = {}
    for poly, T, s in cs:
        nm = convex_name(poly); cnt[nm] = cnt.get(nm, 0) + 1
        axis = sum(math.dist(poly[i], poly[i - 1]) for i in range(len(poly)) if poly[i][0] == poly[i - 1][0] or poly[i][1] == poly[i - 1][1])
        diag = sum(math.dist(poly[i], poly[i - 1]) for i in range(len(poly))) - axis
        data['hard'].append({'nm': nm, 'pcs': pieces(s), 'poly': poly, 'rot': 1 if diag > axis + 1e-9 else 0})
    for nm in cnt:   # 같은 이름이 여럿이면 ①② 붙임
        if cnt[nm] > 1:
            k = 0
            for p in data['hard']:
                if p['nm'] == nm: k += 1; p['nm'] = nm + ' ' + '①②③④⑤'[k - 1]
    return data

def check(data):
    bad = []
    if len(data['hard']) != 13: bad.append(f"볼록한 모양이 {len(data['hard'])}개(13개여야 함)")
    for lv, ps in data.items():
        for i, p in enumerate(ps, 1):
            T = parse(p['rows']) if 'rows' in p else quarters(p['poly'])
            got, cov = [], set()
            if sorted(k for k, *_ in p['pcs']) != list(range(7)): bad.append(f'{lv} {i}: 조각 번호'); continue
            for k, cx, cy, r, f in p['pcs']:
                v = [(x + cx, y + cy) for x, y in tf(centered(TYPES[k]), r, f)]
                if any(abs(c - round(c)) > 1e-3 for q in v for c in q): bad.append(f'{lv} {i}: 조각 {k} 꼭짓점이 바둑판 점이 아님'); break
                qs = quarters([(round(x), round(y)) for x, y in v])
                if qs & cov: bad.append(f'{lv} {i}: 조각이 겹침')
                cov |= qs
            if cov != T: bad.append(f'{lv} {i} {p["nm"]}: 풀이가 모양과 다름')
            # 이어져 있는지(꼭짓점만 닿아도 됨 — 칸 조각을 이웃한 칸까지 넓혀 봄)
            cells = {(a, b) for a, b, _ in T}; seen = {next(iter(cells))}; st = list(seen)
            while st:
                a, b = st.pop()
                for da in (-1, 0, 1):
                    for db in (-1, 0, 1):
                        c = (a + da, b + db)
                        if c in cells and c not in seen: seen.add(c); st.append(c)
            if seen != cells: bad.append(f'{lv} {i} {p["nm"]}: 떨어진 부분이 있음')
    names = [p['nm'] for ps in data.values() for p in ps]
    if len(set(names)) != len(names): bad.append('같은 이름이 있음')
    keys = [canon(parse(p['rows']) if 'rows' in p else quarters(p['poly'])) for ps in data.values() for p in ps]
    if len(set(keys)) != len(keys): bad.append('같은 모양이 있음: ' + ', '.join(n for n, k in zip(names, keys) if keys.count(k) > 1))
    return bad

def strip(data):
    return {lv: [{k: v for k, v in p.items() if k not in ('rows', 'poly')} for p in ps] for lv, ps in data.items()}

if __name__ == '__main__':
    out = HERE / 'data' / 'tangram.json'
    data = gen(); bad = check(data)
    if sys.argv[1:2] == ['check']:
        if not bad and json.loads(out.read_text()) != json.loads(json.dumps(strip(data))): bad.append('data/tangram.json이 원본(그림 글자)과 다름 — python3 gen_tangram.py로 다시 만드세요')
        print('\n'.join(bad) or '칠교 점검 통과'); sys.exit(1 if bad else 0)
    if bad: print('\n'.join(bad)); sys.exit(1)
    out.write_text(json.dumps(strip(data), ensure_ascii=False, separators=(',', ':')))
    print('칠교', {k: len(v) for k, v in data.items()}, '문제를 만들고 점검했어요:', ' · '.join(p['nm'] for p in data['hard']))
