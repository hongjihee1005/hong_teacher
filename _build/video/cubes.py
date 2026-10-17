"""쌓기나무 부품 — 사선 투영(solid.py와 같은 방향, 깊이는 더 길게)으로 단위 정육면체를 그림

    cube(x, y, z, s, origin, color)         # 칸 (x 오른쪽, y 위, z 안쪽) 한 개: 앞·위·오른쪽 면
    stack(cells, s, center, color)          # cells: [(x, y, z), …] 뒤·아래부터 그려서 앞이 뒤를 가림
    box_cells(w, h, d)                      # 가로 w, 높이 h, 깊이 d 직육면체를 채우는 칸 목록
    heights_cells({(x, z): h})              # 위에서 본 칸마다 높이 → 칸 목록 (z = 0이 앞줄)
"""
import numpy as np
from manim import Polygon, VGroup

from series_style import INK

K, ANG = 0.8, np.radians(32)
C, S = K * np.cos(ANG), K * np.sin(ANG)
DEF = "#F2C14E"


def _shade(hex_color, f):
    h = hex_color.lstrip("#")
    r, g, b = (int(h[i:i + 2], 16) for i in (0, 2, 4))
    r, g, b = (int(max(0, min(255, v * f))) for v in (r, g, b))
    return f"#{r:02X}{g:02X}{b:02X}"


def P(x, y, z, s, o):
    return np.array([o[0] + (x + C * z) * s, o[1] + (y + S * z) * s, 0.0])


def cube(x, y, z, s=0.5, origin=(0, 0), color=DEF, stroke=INK, width=2.5, op=1.0):
    p = lambda a, b, c: P(a, b, c, s, origin)  # noqa: E731
    front = Polygon(p(x, y, z), p(x + 1, y, z), p(x + 1, y + 1, z), p(x, y + 1, z))
    top = Polygon(p(x, y + 1, z), p(x + 1, y + 1, z), p(x + 1, y + 1, z + 1), p(x, y + 1, z + 1))
    right = Polygon(p(x + 1, y, z), p(x + 1, y, z + 1), p(x + 1, y + 1, z + 1), p(x + 1, y + 1, z))
    for f, k in ((front, 1.0), (top, 1.18), (right, 0.82)):
        f.set_fill(_shade(color, k), opacity=op).set_stroke(stroke, width)
    g = VGroup(front, top, right)
    g.cell = (x, y, z)
    return g


def stack(cells, s=0.5, center=(0, 0, 0), color=DEF, colors=None, width=2.5):
    """칸들을 그림. center는 전체 그림의 가운데. colors: {칸: 색}"""
    cells = list(cells)
    if not cells:
        return VGroup()
    xs = [c[0] for c in cells]; ys = [c[1] for c in cells]; zs = [c[2] for c in cells]
    lo = P(min(xs), min(ys), min(zs), s, (0, 0))
    hi = P(max(xs) + 1, max(ys) + 1, max(zs) + 1, s, (0, 0))
    ctr = (lo + hi) / 2
    o = (center[0] - ctr[0], center[1] - ctr[1])
    order = sorted(cells, key=lambda c: (-c[2], c[1], c[0]))
    g = VGroup(*[cube(*c, s=s, origin=o, color=(colors or {}).get(tuple(c), color), width=width) for c in order])
    g.origin, g.s = o, s
    return g


def box_cells(w, h, d):
    return [(x, y, z) for x in range(w) for y in range(h) for z in range(d)]


def heights_cells(hmap):
    return [(x, y, z) for (x, z), h in hmap.items() for y in range(h)]


def find(g, cell):
    for m in g:
        if m.cell == tuple(cell):
            return m
    return None


# ── 위·앞·옆에서 본 모양 (평면 칸 그림) ──
from manim import Square  # noqa: E402

from series_style import PAPER, T  # noqa: E402


def flat(squares, s=0.5, center=(0, 0, 0), color=DEF, nums=None, size=30, frame=None):
    """squares: [(열, 행)] (행 0이 아래). nums: {(열, 행): 글}. frame=(열 수, 행 수)면 빈 칸 테두리도 그림"""
    sq = list(squares)
    cols = frame[0] if frame else max(c for c, _ in sq) + 1
    rows = frame[1] if frame else max(r for _, r in sq) + 1
    ox = center[0] - cols * s / 2 + s / 2
    oy = center[1] - rows * s / 2 + s / 2
    g = VGroup()
    if frame:
        for c in range(cols):
            for r in range(rows):
                if (c, r) not in sq:
                    g.add(Square(side_length=s, stroke_color="#BDB3A0", stroke_width=1.5, fill_color=PAPER, fill_opacity=1).move_to([ox + c * s, oy + r * s, 0]))
    for c, r in sq:
        m = Square(side_length=s, fill_color=color, fill_opacity=0.85, stroke_color=INK, stroke_width=2.5).move_to([ox + c * s, oy + r * s, 0])
        g.add(m)
    if nums:
        for (c, r), t in nums.items():
            g.add(T(str(t), size).move_to([ox + c * s, oy + r * s, 0]))
    return g


def top_view(hmap):
    """{(x, z): h} → 위에서 본 칸 [(x, z)] (앞줄 z = 0이 아래)"""
    return [(x, z) for (x, z), h in hmap.items() if h > 0]


def front_view(hmap):
    """앞에서 본 모양: 열 x마다 가장 높은 층"""
    mx = {}
    for (x, z), h in hmap.items():
        mx[x] = max(mx.get(x, 0), h)
    return [(x, y) for x, h in mx.items() for y in range(h)]


def side_view(hmap):
    """오른쪽 옆에서 본 모양: 왼쪽이 앞줄(z = 0), 줄 z마다 가장 높은 층"""
    mx = {}
    for (x, z), h in hmap.items():
        mx[z] = max(mx.get(z, 0), h)
    return [(z, y) for z, h in mx.items() for y in range(h)]
