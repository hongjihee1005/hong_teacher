"""3학년 1학기 3단원 「식물의 생활」 전용 그림 부품 (s3ep10~14, s3mm03)

모두 직접 그린 단순한 벡터 그림. 그림마다 (0, 0) 기준은 함수 설명에 적음.
잎 모양은 차시 앱 grade3/science/sem1/u3-1.html의 잎 그림(shape·veins)을 옮겨 그림.
"""
import numpy as np
from manim import (DOWN, LEFT, ORIGIN, RIGHT, UP, PI, TAU,
                   Arc, ArcBetweenPoints, Circle, Dot, Ellipse, Line, Polygon, Rectangle, RoundedRectangle,
                   VGroup, VMobject, AnnularSector, Sector)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, T
from scikit import BROWN, BROWN_DARK, RED

LEAF_FILL = "#7CC766"
LEAF_EDGE = "#2F6B2A"
LEAF_VEIN = "#E9F8DE"
STALK = "#4B8A37"
DARK_GREEN = "#3E8E3A"
TRUNK = "#8B5A2B"
WATER = "#BFE3F5"
WATER_EDGE = "#5AA9D6"
SAND = "#F0D9A0"
YELLOW = "#F5C518"
PINK = "#F4A7C0"


def smooth(pts, color=INK, width=4, close=False, fill=None, opacity=1.0):
    m = VMobject()
    pts = [np.array([p[0], p[1], 0.0]) for p in pts]
    if close:
        pts = pts + [pts[0]]
    m.set_points_smoothly(pts)
    m.set_stroke(color, width)
    if fill:
        m.set_fill(fill, opacity)
    return m


# ── 잎 (앱의 잎 그림을 옮김) ─────────────────────────────────────
def _serrate(pts, cx, cy, a):
    out = []
    for i, (x, y) in enumerate(pts):
        dx, dy = x - cx, y - cy
        d = np.hypot(dx, dy) or 1
        k = a if i % 2 else -a * 0.35
        out.append((x + dx / d * k, y + dy / d * k))
    return out


def _shape(kind):
    """앱 좌표(가로 120, 위가 잎끝)로 둘레 점·잎자루 자리·잎끝"""
    N = 180 if kind == "palm" else 120
    pts = []
    if kind == "palm":
        cx, cy = 60, 66
        for i in range(N):
            t = -PI + TAU * i / N
            r = 9 if abs(t) > 0.86 * PI else 12 + 40 * abs(np.cos(2.5 * t)) ** 2.2
            pts.append((cx + r * np.sin(t), cy - r * np.cos(t)))
        return _serrate(pts, cx, cy, 2.2), (60, 75), (60, 14), (cx, cy)
    if kind in ("ellipse", "ovate", "lance", "grass"):
        cx, cy, w, h = {"ellipse": (60, 64, 30, 46), "ovate": (60, 64, 29, 48),
                        "lance": (60, 64, 16, 54), "grass": (60, 62, 7, 58)}[kind]
        for i in range(N):
            t = TAU * i / N
            s, c = np.sin(t), np.cos(t)
            if kind in ("lance", "grass"):
                ww = w * abs(s) ** 0.8 * np.sign(s)
            elif kind == "ovate":       # 아래(잎자루 쪽)가 넓고 끝이 뾰족한 달걀 모양
                ww = w * s * (1 - 0.22 * c) * (1 - 0.35 * max(c, 0) ** 3)
            else:
                ww = w * s
            pts.append((cx + ww, cy - h * c))
        if kind == "ovate":
            pts = _serrate(pts, cx, cy, 2.4)
        return pts, (cx, cy + h), (cx, cy - h), (cx, cy)
    if kind == "feather":
        right, left = [], []
        M = 60
        for i in range(M + 1):
            s = i / M
            y = 118 - 104 * s
            env = 4 + 24 * s ** 0.7 * (1 - s) ** 0.35
            lob = 0.35 + 0.65 * ((s * 5) % 1)
            w = env * (1 if s > 0.82 else lob)
            right.append((60 + w, y))
            left.append((60 - w * (1 if i % 2 else 0.97), y))
        pts = right + left[::-1]
        return _serrate(pts, 60, 64, 1.2), (60, 118), (60, 14), (60, 64)
    raise ValueError(kind)


def leaf(kind="ellipse", stalk=True, s=1.0, fill=LEAF_FILL):
    """잎 하나. kind: palm(단풍나무) ellipse(감나무) grass(강아지풀) feather(민들레) ovate(벚나무) lance(닭의장풀)
    가운데(잎몸 가운데)가 (0,0), 높이는 약 2.5*s."""
    pts, base, tip, (cx, cy) = _shape(kind)
    k = s / 42.0

    def P(x, y):
        return ((x - 60) * k, -(y - 64) * k)
    blade = Polygon(*[np.array([*P(x, y), 0]) for x, y in pts], fill_color=fill, fill_opacity=1,
                    stroke_color=LEAF_EDGE, stroke_width=3)
    veins = VGroup()
    vw = 2.4
    bx, by = base
    tx, ty = tip
    if kind in ("lance", "grass"):
        w = 9 if kind == "lance" else 3.5
        for kk in ((-2, -1, 0, 1, 2) if kind == "lance" else (-1, 0, 1)):
            veins.add(smooth([P(bx, by - 3), P(bx + kk * w, (by + ty) / 2), P(tx, ty + 3)], LEAF_VEIN, vw))
    elif kind == "palm":
        for a in (0, 0.4, -0.4, 0.8, -0.8):
            t = a * PI
            veins.add(Line([*P(60, 70), 0], [*P(60 + 42 * np.sin(t), 66 - 42 * np.cos(t)), 0], stroke_color=LEAF_VEIN, stroke_width=vw))
    else:
        veins.add(Line([*P(bx, by), 0], [*P(tx, ty + 4), 0], stroke_color=LEAF_VEIN, stroke_width=vw))
        n = 6 if kind == "feather" else 5
        for i in range(1, n + 1):
            f = i / (n + 1)
            y = by + (ty - by) * f
            x = bx + (tx - bx) * f
            w = 16 if kind == "feather" else 22 * (1 - abs(f - 0.45))
            for sg in (1, -1):
                veins.add(smooth([P(x, y), P(x + sg * w * 0.6, y - 4), P(x + sg * w, y - 12)], LEAF_VEIN, vw * 0.85))
    g = VGroup()
    if stalk:
        g.add(Line([*P(bx, by - 2), 0], [*P(bx, by + 24), 0], stroke_color=STALK, stroke_width=9 * s))
    g.add(blade, veins)
    g.blade, g.veins = blade, veins
    g.stalk = g[0] if stalk else None
    return g


# 앱의 여섯 잎 (번호·이름·모양·잎자루·톱니·잎맥)
LEAVES = [
    dict(n=1, name="단풍나무", kind="palm", stalk=1, saw=1, net=1),
    dict(n=2, name="감나무", kind="ellipse", stalk=1, saw=0, net=1),
    dict(n=3, name="강아지풀", kind="grass", stalk=0, saw=0, net=0),
    dict(n=4, name="민들레", kind="feather", stalk=0, saw=1, net=1),
    dict(n=5, name="벚나무", kind="ovate", stalk=1, saw=1, net=1),
    dict(n=6, name="닭의장풀", kind="lance", stalk=0, saw=0, net=0),
]


def leaf_card(L, s=0.62, w=1.75, h=2.45, show_name=False):
    """번호 붙임딱지가 있는 잎 카드(가운데가 (0,0))"""
    card = RoundedRectangle(corner_radius=0.16, width=w, height=h, fill_color=PAPER, fill_opacity=1,
                            stroke_color=LEAF_EDGE, stroke_width=3)
    lf = leaf(L["kind"], L["stalk"], s)
    if lf.height > h * 0.64:
        lf.scale_to_fit_height(h * 0.64)
    lf.move_to([0, 0.2, 0])
    num = VGroup(Circle(radius=0.2, fill_color=ORANGE, fill_opacity=1, stroke_width=0),
                 T(str(L["n"]), 26, PAPER)).move_to([-w / 2 + 0.28, h / 2 - 0.28, 0])
    num[1].move_to(num[0])
    name = T(L["name"], 26, INK).move_to([0, -h / 2 + 0.26, 0])
    if not show_name:
        name.set_opacity(0)
    g = VGroup(card, lf, num, name)
    g.name_t = name
    return g


# ── 블록(도입) ──
def star_block(color, r=0.34):
    pts = []
    for i in range(10):
        rr = r if i % 2 == 0 else r * 0.42
        a = PI / 2 + PI * i / 5
        pts.append([rr * np.cos(a), rr * np.sin(a), 0])
    return Polygon(*pts, fill_color=color, fill_opacity=1, stroke_color=INK, stroke_width=3)


def round_block(color, r=0.3):
    return Circle(radius=r, fill_color=color, fill_opacity=1, stroke_color=INK, stroke_width=3)


# ── 땅·물 ──
def soil(x0=-6.8, x1=6.8, y=-2.0, h=0.45):
    return Rectangle(width=x1 - x0, height=h, fill_color="#C9A676", fill_opacity=1, stroke_width=0).move_to(
        [(x0 + x1) / 2, y - h / 2, 0])


def water_body(x0=-6.6, x1=6.6, top=0.0, bottom=-2.4, color=WATER):
    r = Rectangle(width=x1 - x0, height=top - bottom, fill_color=color, fill_opacity=0.85, stroke_width=0)
    r.move_to([(x0 + x1) / 2, (top + bottom) / 2, 0])
    line = Line([x0, top, 0], [x1, top, 0], stroke_color=WATER_EDGE, stroke_width=5)
    return VGroup(r, line)


# ── 풀·나무 (발 = (0,0)) ──
def sseumbagwi(h=1.2):
    """씀바귀: 땅 가까이 길쭉한 잎, 가는 초록 줄기, 노란 꽃"""
    s = h / 1.2
    g = VGroup()
    for a in (-60, -30, 25, 55):
        lf = Ellipse(width=0.16 * s, height=0.62 * s, fill_color=LEAF_FILL, fill_opacity=1,
                     stroke_color=LEAF_EDGE, stroke_width=2).move_to([0, 0.3 * s, 0])
        lf.rotate(np.radians(a), about_point=ORIGIN)
        g.add(lf)
    for dx, top in ((-0.22, 1.0), (0.0, 1.2), (0.25, 0.95)):
        g.add(smooth([(0, 0.1 * s), (dx * 0.5 * s, top * 0.5 * s), (dx * s, top * s)], STALK, 3))
        fl = VGroup(*[Ellipse(width=0.07 * s, height=0.18 * s, fill_color=YELLOW, fill_opacity=1, stroke_width=0)
                      .move_to([0, 0.08 * s, 0]).rotate(i * TAU / 8, about_point=ORIGIN) for i in range(8)],
                    Dot(radius=0.04 * s, color="#E0A800"))
        fl.move_to([dx * s, top * s, 0])
        g.add(fl)
    return g


def tree(h=4.0, crown=DARK_GREEN, flowers=None, bare=False, trunk_w=None):
    """나무: 굵은 갈색 줄기 + 둥근 잎 무리. bare=True면 잎 없는 겨울 나무. 발=(0,0)"""
    s = h / 4.0
    tw = trunk_w or 0.42 * s
    trunk = Polygon([-tw / 2, 0, 0], [tw / 2, 0, 0], [tw * 0.32, 2.4 * s, 0], [-tw * 0.32, 2.4 * s, 0],
                    fill_color=TRUNK, fill_opacity=1, stroke_color=BROWN_DARK, stroke_width=3)
    br = VGroup(*[Line([0, a * s, 0], [b_ * s, c * s, 0], stroke_color=TRUNK, stroke_width=9 * s)
                  for a, b_, c in ((1.9, -0.9, 3.0), (2.1, 0.85, 3.1), (2.35, 0.0, 3.5), (2.2, -0.45, 3.4))])
    g = VGroup(br, trunk)
    if not bare:
        cr = VGroup()
        for x, y, r in ((0, 3.05, 0.95), (-0.85, 2.75, 0.7), (0.85, 2.8, 0.72), (-0.45, 3.55, 0.65), (0.5, 3.55, 0.62)):
            cr.add(Circle(radius=r * s, fill_color=crown, fill_opacity=1, stroke_width=0).move_to([x * s, y * s, 0]))
        g.add(cr)
        g.crown = cr
        if flowers:
            rng = np.random.default_rng(3)
            for _ in range(26):
                a = rng.uniform(0, TAU)
                rr = rng.uniform(0, 1.15)
                g.add(Dot([np.cos(a) * rr * s, (3.1 + np.sin(a) * rr * 0.75) * s, 0], radius=0.07 * s, color=flowers))
    return g


def small_herb(h=1.0, flower=None, seed=0):
    """작은 풀(제비꽃·명아주·애기똥풀 등 이름표용 공통 그림). 발=(0,0)"""
    s = h
    rng = np.random.default_rng(seed)
    g = VGroup()
    for a in (-50, -20, 15, 45):
        lf = Ellipse(width=0.22 * s, height=0.5 * s, fill_color=LEAF_FILL, fill_opacity=1,
                     stroke_color=LEAF_EDGE, stroke_width=2).move_to([0, 0.3 * s, 0])
        lf.rotate(np.radians(a + rng.uniform(-8, 8)), about_point=ORIGIN)
        g.add(lf)
    g.add(Line([0, 0, 0], [0, 0.85 * s, 0], stroke_color=STALK, stroke_width=3))
    if flower:
        g.add(Dot([0, 0.88 * s, 0], radius=0.09 * s, color=flower))
    return g


def seed_tuft(s=0.4):
    """갓털 달린 씨"""
    g = VGroup(Line([0, 0, 0], [0, 0.45 * s, 0], stroke_color=SOFT, stroke_width=2),
               Ellipse(width=0.07 * s, height=0.18 * s, fill_color=BROWN, fill_opacity=1, stroke_width=0).move_to([0, -0.05 * s, 0]))
    for a in np.linspace(20, 160, 7):
        r = np.radians(a)
        g.add(Line([0, 0.45 * s, 0], [0.4 * s * np.cos(r), 0.45 * s + 0.35 * s * np.sin(r), 0], stroke_color=SOFT, stroke_width=1.6))
    return g


# ── 물에 사는 식물 ─────────────────────────────────────────────
def bure_okjam(s=1.0):
    """부레옥잠: 풍선처럼 부푼 잎자루 + 둥근 잎몸 + 짧은 줄기 + 수염 같은 뿌리.
    물 높이(수면)가 (0,0) — 잎자루 아래쪽이 조금 잠김. 부분: .blade .stalks .roots .stem"""
    g = VGroup()
    stalks, blades = VGroup(), VGroup()
    for dx, ang, hh in ((-0.95, 32, 0.9), (-0.32, 10, 1.2), (0.38, -12, 1.1), (1.0, -32, 0.85)):
        bulb = Ellipse(width=0.44 * s, height=0.66 * s, fill_color="#A6DC8A", fill_opacity=1,
                       stroke_color=LEAF_EDGE, stroke_width=3).move_to([dx * 0.7 * s, 0.12 * s, 0])
        neck = Line(bulb.get_top() + DOWN * 0.05 * s, bulb.get_top() + np.array([-np.sin(np.radians(ang)), 1, 0]) * hh * 0.55 * s,
                    stroke_color=STALK, stroke_width=7 * s)
        bl = Circle(radius=0.27 * s, fill_color=LEAF_FILL, fill_opacity=1, stroke_color=LEAF_EDGE, stroke_width=3)
        bl.stretch(1.15, 1).move_to(neck.get_end() + UP * 0.22 * s)
        stalks.add(VGroup(neck, bulb))
        blades.add(bl)
    stem = RoundedRectangle(corner_radius=0.06 * s, width=1.3 * s, height=0.16 * s, fill_color="#5C9E45",
                            fill_opacity=1, stroke_width=0).move_to([0, -0.2 * s, 0])
    roots = VGroup()
    for i, x in enumerate(np.linspace(-0.45, 0.45, 9)):
        roots.add(smooth([(x * s, -0.28 * s), ((x + 0.06 * (-1) ** i) * s, -0.75 * s), ((x * 1.2) * s, -1.2 * s - 0.08 * (i % 3) * s)],
                         "#3A3A3A", 2.6))
    g.add(roots, stem, stalks, blades)
    g.blade, g.stalks, g.roots, g.stem = blades, stalks, roots, stem
    return g


def honeycomb(r=1.0, cross=True):
    """잘린 잎자루 단면: 가로(cross=True)는 원 안에 작은 공기주머니가 벌집처럼, 세로는 길쭉한 네모 안에"""
    if cross:
        outer = Circle(radius=r, fill_color="#DDF2C9", fill_opacity=1, stroke_color=LEAF_EDGE, stroke_width=6)
        holes = VGroup()
        step = r * 0.24
        for i in range(-5, 6):
            for j in range(-5, 6):
                x = i * step + (step / 2 if j % 2 else 0)
                y = j * step * 0.87
                if np.hypot(x, y) < r - step * 0.7:
                    holes.add(Circle(radius=step * 0.42, fill_color=PAPER, fill_opacity=1, stroke_color="#8CC56E", stroke_width=2).move_to([x, y, 0]))
        return VGroup(outer, holes)
    w, h = r * 1.3, r * 2.0
    outer = RoundedRectangle(corner_radius=0.2 * r, width=w, height=h, fill_color="#DDF2C9", fill_opacity=1,
                             stroke_color=LEAF_EDGE, stroke_width=6)
    holes = VGroup()
    for i in range(-2, 3):
        for j in range(-4, 5):
            holes.add(Ellipse(width=w * 0.15, height=h * 0.085, fill_color=PAPER, fill_opacity=1,
                              stroke_color="#8CC56E", stroke_width=2).move_to([i * w * 0.18 + (w * 0.09 if j % 2 else 0) * 0.5, j * h * 0.1, 0]))
    return VGroup(outer, holes)


def bubble(r=0.09):
    return VGroup(Circle(radius=r, fill_color=PAPER, fill_opacity=0.6, stroke_color=WATER_EDGE, stroke_width=2.5),
                  Dot([-r * 0.35, r * 0.35, 0], radius=r * 0.25, color=PAPER))


def lotus(h=2.4):
    """연꽃: 물속 땅(발 = (0,0))에서 긴 자루가 물 위로 높이 — 잎과 꽃이 물 위로 솟음"""
    s = h / 2.4
    g = VGroup()
    g.add(smooth([(0, 0), (0.1 * s, 1.2 * s), (-0.3 * s, 2.3 * s)], STALK, 5))
    g.add(smooth([(0, 0), (0.2 * s, 1.4 * s), (0.55 * s, 2.6 * s)], STALK, 5))
    lf = Ellipse(width=1.3 * s, height=0.42 * s, fill_color=DARK_GREEN, fill_opacity=1, stroke_color=LEAF_EDGE, stroke_width=3)
    lf.move_to([-0.3 * s, 2.35 * s, 0])
    g.add(lf)
    fl = VGroup(*[Ellipse(width=0.22 * s, height=0.5 * s, fill_color=PINK, fill_opacity=1, stroke_color="#C9567E", stroke_width=2)
                  .move_to([0, 0.22 * s, 0]).rotate(a, about_point=ORIGIN) for a in (-0.7, -0.35, 0, 0.35, 0.7)])
    fl.move_to([0.55 * s, 2.82 * s, 0])
    g.add(fl)
    return g


def suryeon(w=1.4, flower=True):
    """수련: 한쪽이 트인 둥근 잎이 물 위에 납작하게(가운데가 수면 (0,0))"""
    sec = Sector(radius=w / 2, angle=TAU - 0.5, start_angle=0.25 + PI / 2, fill_color=DARK_GREEN, fill_opacity=1,
                 stroke_color=LEAF_EDGE, stroke_width=3).stretch(0.35, 1)
    sec.move_to(ORIGIN)
    g = VGroup(sec)
    if flower:
        fl = VGroup(*[Ellipse(width=0.14, height=0.36, fill_color="#FFFFFF", fill_opacity=1, stroke_color="#C9567E", stroke_width=2)
                      .move_to([0, 0.16, 0]).rotate(a, about_point=ORIGIN) for a in (-0.8, -0.4, 0, 0.4, 0.8)])
        fl.move_to([w * 0.15, 0.2, 0])
        g.add(fl)
    return g


def gaegurbap(n=5, seed=1):
    """개구리밥: 작은 잎이 물 위에 떠 있고 짧은 뿌리 한 가닥씩(수면 (0,0))"""
    rng = np.random.default_rng(seed)
    g = VGroup()
    for i in range(n):
        x = (i - (n - 1) / 2) * 0.32 + rng.uniform(-0.05, 0.05)
        g.add(Line([x, 0, 0], [x, -0.35, 0], stroke_color="#3A3A3A", stroke_width=2))
        g.add(Ellipse(width=0.24, height=0.1, fill_color=LEAF_FILL, fill_opacity=1, stroke_color=LEAF_EDGE, stroke_width=2).move_to([x, 0.02, 0]))
    return g


def geomjeongmal(h=2.0, bend=0.0, n=7):
    """검정말: 물속 땅(발 (0,0))에서 가는 줄기, 마디마다 작은 잎. bend: 꼭대기가 옆으로 휘는 정도"""
    pts = []
    for i in range(n + 1):
        f = i / n
        pts.append((bend * f ** 2 + 0.05 * np.sin(f * 6), h * f * (1 - 0.12 * abs(bend) * f)))
    g = VGroup(smooth(pts, STALK, 4))
    for i in range(1, n + 1):
        x, y = pts[i]
        for a in (-0.9, 0.9, PI / 2 + 0.2 * bend):
            ang = a - 0.4 * bend * (i / n)
            g.add(Ellipse(width=0.07, height=0.28, fill_color=DARK_GREEN, fill_opacity=1, stroke_width=0)
                  .move_to([0, 0.13, 0]).rotate(ang, about_point=ORIGIN).shift([x, y, 0]))
    return g


def galdae(h=2.6):
    """갈대: 물가 땅(발 (0,0))에서 단단한 줄기가 높이, 긴 잎과 이삭"""
    s = h / 2.6
    g = VGroup()
    for dx in (-0.15, 0.1):
        g.add(Line([dx * s, 0, 0], [dx * 1.4 * s, 2.5 * s, 0], stroke_color="#8C9A3C", stroke_width=5))
        g.add(Ellipse(width=0.16 * s, height=0.5 * s, fill_color="#C8A86A", fill_opacity=1, stroke_width=0).move_to([dx * 1.45 * s, 2.7 * s, 0]))
    for y, sg in ((0.8, 1), (1.3, -1), (1.8, 1)):
        g.add(smooth([(0, y * s), (sg * 0.35 * s, (y + 0.25) * s), (sg * 0.6 * s, (y + 0.1) * s)], "#7FA33A", 4))
    return g


# ── 사막·높은 산 ──────────────────────────────────────────────
def _spiky_leaf(length, width, ang, spines=True):
    L, W = length, width
    pts = [(0, -W / 2), (L * 0.55, -W * 0.42), (L, 0), (L * 0.55, W * 0.42), (0, W / 2)]
    body = Polygon(*[np.array([x, y, 0]) for x, y in pts], fill_color="#6FBF8A", fill_opacity=1,
                   stroke_color="#2F6B48", stroke_width=3)
    g = VGroup(body)
    if spines:
        for f in np.linspace(0.15, 0.85, 5):
            x = L * f
            yw = W / 2 * (1 - f * 0.9) + 0.02
            for sg in (1, -1):
                g.add(Polygon([x - 0.05, sg * yw * 0.95, 0], [x + 0.05, sg * yw * 0.95, 0], [x + 0.02, sg * (yw + 0.11), 0],
                              fill_color=PAPER, fill_opacity=1, stroke_color="#2F6B48", stroke_width=1.5))
    g.rotate(ang, about_point=ORIGIN)
    return g


def aloe(h=2.0):
    """알로에: 두꺼운 잎이 사방으로, 가장자리에 가시. 발(화분 위)=(0,0)"""
    s = h / 2.0
    g = VGroup()
    for ang, L in ((1.0, 1.7), (1.4, 2.0), (1.75, 2.1), (2.1, 1.95), (2.5, 1.6), (0.65, 1.3), (2.85, 1.25)):
        g.add(_spiky_leaf(L * s, 0.42 * s, ang))
    pot = Polygon([-0.55 * s, 0, 0], [0.55 * s, 0, 0], [0.42 * s, -0.6 * s, 0], [-0.42 * s, -0.6 * s, 0],
                  fill_color="#C8724A", fill_opacity=1, stroke_color=BROWN_DARK, stroke_width=3)
    return VGroup(g, pot)


def aloe_section(r=1.1):
    """알로에 잎 단면: 두꺼운 초록 껍질 + 투명하고 축축한 속(젤리)"""
    outer = Ellipse(width=2.6 * r, height=1.3 * r, fill_color="#3F9A5C", fill_opacity=1, stroke_color="#2F6B48", stroke_width=5)
    inner = Ellipse(width=2.2 * r, height=0.95 * r, fill_color="#E8F7EA", fill_opacity=1, stroke_color="#9CD3A8", stroke_width=3)
    shine = VGroup(*[Ellipse(width=0.25 * r, height=0.12 * r, fill_color=PAPER, fill_opacity=0.9, stroke_width=0).move_to([x * r, y * r, 0])
                     for x, y in ((-0.5, 0.15), (0.3, -0.12), (0.65, 0.18), (-0.1, -0.2))])
    return VGroup(outer, inner, shine)


def cactus(h=2.4):
    """선인장: 굵은 줄기, 가시 모양 잎. 발=(0,0)"""
    s = h / 2.4
    col, edge = "#5DAE6B", "#2F6B48"
    body = RoundedRectangle(corner_radius=0.32 * s, width=0.7 * s, height=2.4 * s, fill_color=col, fill_opacity=1,
                            stroke_color=edge, stroke_width=3).move_to([0, 1.2 * s, 0])
    armL = VGroup(RoundedRectangle(corner_radius=0.18 * s, width=0.4 * s, height=0.9 * s, fill_color=col, fill_opacity=1,
                                   stroke_color=edge, stroke_width=3).move_to([-0.62 * s, 1.55 * s, 0]),
                  Rectangle(width=0.4 * s, height=0.3 * s, fill_color=col, fill_opacity=1, stroke_width=0).move_to([-0.4 * s, 1.15 * s, 0]))
    armR = armL.copy().flip(UP, about_point=ORIGIN).shift(UP * 0.35 * s)
    g = VGroup(armL, armR, body)
    for x, y in [(0, 0.3), (0, 0.8), (0, 1.3), (0, 1.8), (0, 2.25), (-0.62, 1.4), (-0.62, 1.85), (0.62, 1.75), (0.62, 2.2)]:
        for a in (0.6, PI - 0.6):
            g.add(Line([x * s, y * s, 0], [x * s + 0.16 * s * np.cos(a), y * s + 0.16 * s * np.sin(a), 0],
                       stroke_color=INK, stroke_width=2))
    for x in (-0.18, 0.18):
        g.add(Line([x * s, 0.15 * s, 0], [x * s, 2.25 * s, 0], stroke_color=edge, stroke_width=2))
    return g


def roots_shallow_deep(w=2.4):
    """사막 식물 뿌리: 얕고 넓게 퍼진 뿌리 + 깊게 뻗은 뿌리 (땅 위 시작 = (0,0))"""
    g = VGroup()
    for sg in (1, -1):
        for f in (0.5, 0.8, 1.0):
            g.add(smooth([(0, 0), (sg * w * 0.5 * f, -0.12 - 0.05 * f), (sg * w * f, -0.25 * f)], BROWN_DARK, 3))
    g.add(smooth([(0, 0), (0.08, -0.8), (-0.05, -1.6), (0.04, -2.2)], BROWN_DARK, 4))
    return g


def nunjat(w=2.6):
    """눈잣나무: 줄기가 땅에 누워 옆으로 자람, 바늘잎 무리. 발(왼쪽 뿌리)=(0,0)"""
    g = VGroup(smooth([(0, 0), (w * 0.4, 0.12), (w, 0.2)], TRUNK, 7))
    for f in np.linspace(0.12, 1.0, 8):
        x = w * f
        y = 0.12 + 0.08 * f
        for a in np.linspace(0.5, 2.6, 5):
            g.add(Line([x, y, 0], [x + 0.3 * np.cos(a), y + 0.32 * np.sin(a), 0], stroke_color="#2E7D4F", stroke_width=3))
    return g


def ammae(n=9):
    """암매: 키 작은 풀이 바위틈에 모여서(발 가운데 = (0,0))"""
    g = VGroup()
    for i in range(n):
        x = (i - (n - 1) / 2) * 0.13
        hgt = 0.16 + 0.08 * ((i * 7) % 3)
        g.add(Line([x, 0, 0], [x, hgt, 0], stroke_color=STALK, stroke_width=3))
        g.add(Ellipse(width=0.13, height=0.07, fill_color=DARK_GREEN, fill_opacity=1, stroke_width=0).move_to([x + 0.05, hgt * 0.5, 0]))
        if i % 2 == 0:
            g.add(Dot([x, hgt + 0.03, 0], radius=0.045, color="#FFFFFF").set_stroke(PINK, 1.5))
    return g


def wind_lines(x=-5.5, ys=(0.5, 1.2, 1.9), length=2.0):
    g = VGroup()
    for i, y in enumerate(ys):
        x0 = x + 0.3 * i
        g.add(smooth([(x0, y), (x0 + length * 0.5, y + 0.12), (x0 + length, y - 0.02)], "#7FB7D9", 5))
    return g


def mountain(w=6.0, h=3.0):
    """눈 덮인 높은 산 (아래 가운데 = (0,0))"""
    body = Polygon([-w / 2, 0, 0], [0, h, 0], [w / 2, 0, 0], fill_color="#9CB59A", fill_opacity=1, stroke_color="#5C7A5A", stroke_width=3)
    snow = Polygon([-w * 0.12, h * 0.76, 0], [0, h, 0], [w * 0.12, h * 0.76, 0], [w * 0.04, h * 0.8, 0], [-w * 0.03, h * 0.74, 0],
                   fill_color=PAPER, fill_opacity=1, stroke_width=0)
    return VGroup(body, snow)


def sun(r=0.45):
    g = VGroup(Circle(radius=r, fill_color="#F7B733", fill_opacity=1, stroke_width=0))
    for i in range(8):
        a = i * TAU / 8
        g.add(Line([np.cos(a) * r * 1.3, np.sin(a) * r * 1.3, 0], [np.cos(a) * r * 1.75, np.sin(a) * r * 1.75, 0],
                   stroke_color="#F7B733", stroke_width=5))
    return g


def dune(w=6.0, h=0.9):
    return smooth([(-w / 2, 0), (-w / 4, h), (0, h * 0.4), (w / 4, h * 0.9), (w / 2, 0)], "#D4B26A", 3, fill=SAND)


# ── 생활용품 ──────────────────────────────────────────────────
def lotus_leaf_top(r=1.6):
    """위에서 본 연잎(둥근 방패 모양, 잎맥이 사방으로) 가운데 (0,0)"""
    disk = Ellipse(width=2 * r, height=1.25 * r, fill_color="#5FAF4E", fill_opacity=1, stroke_color=LEAF_EDGE, stroke_width=4)
    v = VGroup(*[Line(ORIGIN, [np.cos(a) * r * 0.92, np.sin(a) * r * 0.58, 0], stroke_color="#A7DA8E", stroke_width=2.5)
                 for a in np.linspace(0, TAU, 13)[:-1]])
    return VGroup(disk, v, Dot(radius=0.08, color="#A7DA8E"))


def droplet(r=0.2):
    return VGroup(Circle(radius=r, fill_color="#D7F1FF", fill_opacity=0.95, stroke_color="#4E9FD1", stroke_width=3),
                  Ellipse(width=r * 0.6, height=r * 0.35, fill_color=PAPER, fill_opacity=1, stroke_width=0).move_to([-r * 0.3, r * 0.35, 0]))


def hairs_zoom(r=1.2):
    """연잎 표면 확대: 잔털이 촘촘 + 그 위에 동그란 물방울"""
    ring = Circle(radius=r, fill_color="#E6F5DC", fill_opacity=1, stroke_color=INK, stroke_width=5)
    base_y = -r * 0.35
    hairs = VGroup()
    for x in np.linspace(-r * 0.85, r * 0.85, 17):
        top = base_y + 0.28 * r * (1 if abs(x) < r * 0.8 else 0.6)
        hairs.add(Line([x, base_y - 0.05, 0], [x, top, 0], stroke_color="#4F9A3E", stroke_width=4))
    surf = Line([-r * 0.95, base_y - 0.05, 0], [r * 0.95, base_y - 0.05, 0], stroke_color="#4F9A3E", stroke_width=5)
    drop = droplet(r * 0.38).move_to([0, base_y + 0.28 * r + r * 0.38, 0])
    return VGroup(ring, surf, hairs, drop)


def burr(r=0.55, color="#9B7A3E"):
    """우엉 열매: 둥근 몸 + 가시가 많이(끝이 갈고리)"""
    g = VGroup(Circle(radius=r * 0.55, fill_color=color, fill_opacity=1, stroke_color=BROWN_DARK, stroke_width=3))
    for a in np.linspace(0, TAU, 19)[:-1]:
        p0 = np.array([np.cos(a), np.sin(a), 0]) * r * 0.5
        p1 = np.array([np.cos(a), np.sin(a), 0]) * r
        g.add(Line(p0, p1, stroke_color=BROWN_DARK, stroke_width=3))
        g.add(Arc(radius=r * 0.09, start_angle=a, angle=PI * 1.1, arc_center=p1 - np.array([np.cos(a + PI / 2), np.sin(a + PI / 2), 0]) * r * 0.09,
                  stroke_color=BROWN_DARK, stroke_width=3))
    return g


def hook(s=1.0, color=BROWN_DARK):
    """확대한 갈고리 하나 (아래 끝 (0,0))"""
    return VGroup(Line([0, 0, 0], [0, 1.0 * s, 0], stroke_color=color, stroke_width=8),
                  Arc(radius=0.22 * s, start_angle=0, angle=PI * 1.15, arc_center=[-0.22 * s, 1.0 * s, 0],
                      stroke_color=color, stroke_width=8))


def velcro(w=4.0):
    """찍찍이 테이프: 위쪽 띠의 갈고리 + 아래쪽 띠의 작은 고리 (가운데 (0,0))"""
    top = Rectangle(width=w, height=0.3, fill_color="#4D6FB5", fill_opacity=1, stroke_width=0).move_to([0, 0.75, 0])
    bot = Rectangle(width=w, height=0.3, fill_color="#E07A3A", fill_opacity=1, stroke_width=0).move_to([0, -0.75, 0])
    hooks = VGroup()
    loops = VGroup()
    for x in np.linspace(-w / 2 + 0.3, w / 2 - 0.3, 8):
        h_ = hook(0.45, "#2E4F94").flip(RIGHT).move_to([x, 0.3, 0])
        hooks.add(h_)
        loops.add(Ellipse(width=0.3, height=0.55, stroke_color="#B5561D", stroke_width=5).move_to([x + 0.15, -0.38, 0]))
    return VGroup(top, bot, hooks, loops)


def fabric_with_drops(w=3.2):
    cloth = RoundedRectangle(corner_radius=0.15, width=w, height=1.4, fill_color="#5B86C9", fill_opacity=1, stroke_width=0)
    lines = VGroup(*[Line([-w / 2 + 0.1, y, 0], [w / 2 - 0.1, y, 0], stroke_color="#7EA2DA", stroke_width=2) for y in (-0.4, 0, 0.4)])
    drops = VGroup(*[droplet(0.16).move_to([x, y, 0]) for x, y in ((-0.9, 0.2), (0.1, -0.15), (0.9, 0.25), (0.5, 0.45))])
    return VGroup(cloth, lines, drops)


def dandelion_seed(s=1.0):
    return seed_tuft(s)


def parachute(s=1.0):
    canopy = Arc(radius=0.8 * s, start_angle=0, angle=PI, stroke_color=ORANGE, stroke_width=6).set_fill(ORANGE, 0.85)
    canopy = VGroup(canopy, Line([-0.8 * s, 0, 0], [0.8 * s, 0, 0], stroke_color=ORANGE, stroke_width=4))
    lines = VGroup(*[Line([x * s, 0, 0], [0, -0.9 * s, 0], stroke_color=INK, stroke_width=2) for x in (-0.8, -0.3, 0.3, 0.8)])
    box_ = RoundedRectangle(corner_radius=0.05, width=0.3 * s, height=0.25 * s, fill_color=BROWN, fill_opacity=1, stroke_width=0).move_to([0, -1.0 * s, 0])
    return VGroup(canopy, lines, box_)


def samara(s=1.0):
    """단풍나무 열매(날개 달린 씨 두 개)"""
    g = VGroup()
    for sg in (1, -1):
        wing = Ellipse(width=0.45 * s, height=1.1 * s, fill_color="#D99A4E", fill_opacity=1, stroke_color=BROWN_DARK, stroke_width=2)
        wing.move_to([0, 0.55 * s, 0]).rotate(sg * 0.5, about_point=ORIGIN)
        g.add(wing)
        g.add(Circle(radius=0.13 * s, fill_color=BROWN, fill_opacity=1, stroke_color=BROWN_DARK, stroke_width=2).move_to([sg * 0.08 * s, 0, 0]))
    return g


def drone(s=1.0):
    body = RoundedRectangle(corner_radius=0.1 * s, width=0.7 * s, height=0.3 * s, fill_color=SOFT, fill_opacity=1, stroke_width=0)
    g = VGroup(body)
    for x in (-0.9, 0.9):
        g.add(Line([0, 0, 0], [x * s, 0.15 * s, 0], stroke_color=INK, stroke_width=4))
        g.add(Ellipse(width=0.9 * s, height=0.12 * s, fill_color="#D99A4E", fill_opacity=1, stroke_color=BROWN_DARK, stroke_width=2).move_to([x * s, 0.25 * s, 0]))
    return g


def gourd_bowl(s=1.0):
    """박 바가지"""
    bowl = Arc(radius=0.6 * s, start_angle=PI, angle=PI, stroke_color=BROWN_DARK, stroke_width=4).set_fill("#E8C77A", 1)
    rim = Line([-0.6 * s, 0, 0], [0.6 * s, 0, 0], stroke_color=BROWN_DARK, stroke_width=4)
    return VGroup(bowl, rim)
