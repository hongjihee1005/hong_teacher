"""종이접기 그림용 작은 기하 도구 — 접는 선에 대해 점을 뒤집어(반사) 접힌 모양을 계산합니다.

그림 요소(엔진 engine.js가 그림, 좌표는 0~240 화면):
  P(점들, 색)        종이 면.  색: 'c' 색종이 겉, 'c2' 겉(겹친 쪽), 'w' 흰 면, 'w2' 흰 면(겹친 쪽), '#hex'
  V(a, b)            골짜기 접기 선(점선)          M(a, b)  산 접기 선(점-선)
  L(a, b)            접었다 편 자국(가는 선)        E(a, b)  겹친 가장자리(실선)
  A(a, b, 굽음)      접는 방향 화살표               U(a, b, 굽음)  접었다 펴기(양쪽 화살표)
  B(a, b, 굽음)      뒤로 접기 화살표(속 빈 머리)   S(a, b)  미는/넣는 곧은 화살표
  C(a, b)            가위로 자르는 선               O(p)     맞출 곳 표시(동그라미)
  FLIP / TURN        뒤집기 / 돌리기 표시            D(p, r, 색)  점(눈 등)
  W(경로, 굵기, 색, 채움)  자유 그림(SVG path)       T(p, 글, 크기)  글자
"""
import math

def R(p, a, b):
    """점 p를 직선 ab에 대해 뒤집기"""
    (x, y), (x1, y1), (x2, y2) = p, a, b
    dx, dy = x2 - x1, y2 - y1
    t = ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy)
    fx, fy = x1 + t * dx, y1 + t * dy
    return (2 * fx - x, 2 * fy - y)

def Rs(pts, a, b): return [R(p, a, b) for p in pts]
def lerp(a, b, t): return (a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t)
def mid(a, b): return lerp(a, b, .5)

def X(a, b, c, d):
    """직선 ab와 cd가 만나는 점"""
    (x1, y1), (x2, y2), (x3, y3), (x4, y4) = a, b, c, d
    den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)
    t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den
    return (x1 + t * (x2 - x1), y1 + t * (y2 - y1))

def bisector(p, q):
    """p를 q로 옮기는 접는 선(수직이등분선) 위의 두 점"""
    m = mid(p, q); dx, dy = q[0] - p[0], q[1] - p[1]
    return m, (m[0] - dy, m[1] + dx)

def side(p, a, b): return (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0])

def split(poly, a, b):
    """다각형을 직선 ab로 나눔 → (왼쪽, 오른쪽)"""
    L, Rr = [], []
    n = len(poly)
    for i in range(n):
        p, q = poly[i], poly[(i + 1) % n]
        sp, sq = side(p, a, b), side(q, a, b)
        if sp >= 0: L.append(p)
        if sp <= 0: Rr.append(p)
        if sp * sq < 0:
            x = X(p, q, a, b); L.append(x); Rr.append(x)
    return L, Rr

def fold(poly, a, b, keep_left=True):
    """다각형을 ab로 접기 → (남는 부분, 넘어간 부분(뒤집힌 좌표))"""
    l, r = split(poly, a, b)
    stay, move = (l, r) if keep_left else (r, l)
    return stay, Rs(move, a, b)

def clip(poly, a, b):
    """직선 ab가 다각형 안을 지나는 선분(볼록 다각형)"""
    pts = []
    n = len(poly)
    for i in range(n):
        p, q = poly[i], poly[(i + 1) % n]
        sp, sq = side(p, a, b), side(q, a, b)
        if sp == 0: pts.append(p)
        elif sp * sq < 0: pts.append(X(p, q, a, b))
    pts.sort(key=lambda z: (z[0] - a[0]) * (b[0] - a[0]) + (z[1] - a[1]) * (b[1] - a[1]))
    return pts[0], pts[-1]

def mirror(pts, cx=120): return [(2 * cx - x, y) for x, y in pts]
def mx(p, cx=120): return (2 * cx - p[0], p[1])
def move(pts, dx, dy): return [(x + dx, y + dy) for x, y in pts]
def scale(pts, k, c=(120, 120)): return [(c[0] + (x - c[0]) * k, c[1] + (y - c[1]) * k) for x, y in pts]
def rot(pts, deg, c=(120, 120)):
    r = math.radians(deg); cs, sn = math.cos(r), math.sin(r)
    return [(c[0] + (x - c[0]) * cs - (y - c[1]) * sn, c[1] + (x - c[0]) * sn + (y - c[1]) * cs) for x, y in pts]

def _r(p): return [round(p[0], 1), round(p[1], 1)]
def P(pts, f='c'): return ['P', [_r(p) for p in pts], f]
def V(a, b): return ['V', _r(a), _r(b)]
def M(a, b): return ['M', _r(a), _r(b)]
def L(a, b): return ['L', _r(a), _r(b)]
def E(a, b): return ['E', _r(a), _r(b)]
def A(a, b, k=.35): return ['A', _r(a), _r(b), k]
def U(a, b, k=.35): return ['U', _r(a), _r(b), k]
def B(a, b, k=.35): return ['B', _r(a), _r(b), k]
def S(a, b): return ['S', _r(a), _r(b)]
def C(a, b): return ['C', _r(a), _r(b)]
def O(p): return ['O', _r(p)]
def D(p, r=4, col='#2A221C'): return ['D', _r(p), r, col]
def W(d, w=2.4, col='#2A221C', fill='none'): return ['W', d, w, col, fill]
def T(p, s, size=14): return ['T', _r(p), s, size]
FLIP = ['FLIP']
TURN = ['TURN']

# 자주 쓰는 종이
SQ = [(40, 40), (200, 40), (200, 200), (40, 200)]           # 정사각형
DIA = [(120, 25), (215, 120), (120, 215), (25, 120)]         # 마름모로 놓은 정사각형

def band(poly, x0, x1):
    """세로 띠(x0~x1) 안쪽만 남기기"""
    _, r = split(poly, (x0, 0), (x0, 1))   # 왼쪽 잘라 냄
    l, _ = split(r, (x1, 0), (x1, 1)) if r else ([], [])
    return l

def hband(poly, y0, y1):
    """가로 띠(y0~y1) 안쪽만 남기기"""
    l, _ = split(poly, (0, y0), (1, y0))
    _, r = split(l, (0, y1), (1, y1)) if l else ([], [])
    return r


def _pts(e):
    t = e[0]
    if t == 'P': return e[1]
    if t in 'VMLEAUBSC': return [e[1], e[2]]
    if t in ('O', 'D', 'T'): return [e[1]]
    return []

def finalize(models):
    """단계에 fit=True가 있으면 그림이 화면(240)에 꽉 차게 확대·이동값 z를 붙임"""
    for m in models:
        for st in m['steps']:
            if not st.pop('fit', False): continue
            ps = [p for e in st['d'] for p in _pts(e)]
            xs, ys = [p[0] for p in ps], [p[1] for p in ps]
            w, h = max(xs) - min(xs), max(ys) - min(ys)
            k = min(196 / max(w, 1), 196 / max(h, 1), 2.4)
            st['z'] = [round(k, 4), round(120 - k * (min(xs) + max(xs)) / 2, 2), round(124 - k * (min(ys) + max(ys)) / 2, 2)]
    return models

def rounded(pts, r=10):
    """모서리를 둥글린 다각형 SVG 경로(r: 반지름, 수 하나 또는 꼭짓점마다)"""
    n = len(pts); rs = r if isinstance(r, (list, tuple)) else [r] * n
    d = ''
    for i in range(n):
        p, a, b = pts[i], pts[i - 1], pts[(i + 1) % n]
        ra = min(rs[i], math.dist(p, a) / 2); rb = min(rs[i], math.dist(p, b) / 2)
        p1, p2 = lerp(p, a, ra / math.dist(p, a)), lerp(p, b, rb / math.dist(p, b))
        d += ('M' if i == 0 else 'L') + '%.1f %.1fQ%.1f %.1f %.1f %.1f' % (p1[0], p1[1], p[0], p[1], p2[0], p2[1])
    return d + 'Z'
