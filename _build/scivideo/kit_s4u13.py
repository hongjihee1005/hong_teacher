"""4-1 3단원 「땅의 변화」 전용 그림 부품 (s4ep10~16, s4mm03)

모두 직접 그린 단순한 벡터 그림. 따로 적지 않으면 그림 가운데가 (0, 0).
  흐르는 물: hill(p, a)(흙 언덕 단면, 앱 u3-1의 baseY·hillY 그대로) · hill_ghost · paper_cup · water_line · coffee
             yard(비 오기 전·후 운동장)
  강: river_map(산 → 바다, ①②③) · near_up / near_mid / near_down(가까이 본 모습) · flow_slope(경사와 물 흐름)
  화산: volcano(마그마·가스·화산재·돌 조각·용암, 앱 u3-3의 volcano(o)를 본뜸) · halla(꼭대기 분화구 호수) · ridge(화산이 아닌 산)
  암석: rock(granite/basalt) · zoom_view(현미경으로 본 알갱이) · cool_box(마그마가 식는 상자) · hareubang · pagoda
  화산 마을: plane · tree · field · spa · geo_plant
  지진: room(흔들리는 방 부품) · desk · kid · phone_msg · tv_news
"""
import numpy as np
from manim import (DOWN, LEFT, ORIGIN, RIGHT, UP, PI, TAU,
                   Arc, Circle, DashedVMobject, Dot, Ellipse, Line, Polygon, Rectangle, RoundedRectangle,
                   VGroup, VMobject)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, T, M
from scikit import RED, BROWN, BROWN_DARK, SKIN
from kit_s3u12 import fit, text_card, ox_mark, bin_box, slots  # noqa: F401
from kit_s3u22 import P, S, E, L, cloud, SEA, SEA_D, SEA_L, LAND, LAND_D, SAND, SAND_D, ROCK, ROCK_D, SKY  # noqa: F401

SW = 4
SOIL = "#C9A06A"
SOIL_D = "#8B5E30"
WATER = "#5DA9E0"
WATER_D = "#2F78B8"
MAGMA = "#E2573F"
LAVA = "#E8501E"
LAVA_Y = "#FFC93C"
MT = "#8A7A68"
MT_D = "#5B4F42"
ASH = "#6B6F74"
GAS = "#F2F4F6"
GRASS = "#9CC77A"


def rnd(i, k):
    x = np.sin(i * 127.1 + k * 311.7) * 43758.5453
    return x - np.floor(x)


def rect(w, h, fill, x=0, y=0, stroke=INK, sw=SW, op=1.0, r=0.0):
    if r:
        m = RoundedRectangle(corner_radius=r, width=w, height=h, fill_color=fill, fill_opacity=op,
                             stroke_color=stroke, stroke_width=sw)
    else:
        m = Rectangle(width=w, height=h, fill_color=fill, fill_opacity=op, stroke_color=stroke, stroke_width=sw)
    return m.move_to([x, y, 0])


def label(text, col=INK, size=28, fill=PAPER):
    t = T(text, size, col)
    r = RoundedRectangle(corner_radius=0.14, width=t.width + 0.3, height=t.height + 0.22, fill_color=fill,
                         fill_opacity=1, stroke_color=col, stroke_width=3)
    t.move_to(r)
    return VGroup(r, t)


# ══════════════ 흙 언덕 (앱 u3-1) ══════════════
GY = 360
HS = 1 / 62          # 앱 1px → 화면
HX0 = 420            # 앱 x=420 → 화면 x 0
HY0 = -2.0           # 땅 높이


def _hx(x):
    return (x - HX0) * HS


def _hy(y):
    return HY0 + (GY - y) * HS


def base_y(x):
    return GY - 205 * np.exp(-((x - 400) / 140) ** 2)


def hill_y(x, p=0.0, a=1.0):
    y = base_y(x)
    y += 55 * p * a * np.exp(-((x - 470) / 50) ** 2)
    y -= 32 * p * a * np.exp(-((x - 625) / 58) ** 2)
    return min(GY, y)


def hill(p=0.0, a=1.0, h=1.0):
    pts = [[_hx(80), HY0, 0]]
    for x in range(80, 761, 6):
        y = GY - (GY - hill_y(x, p, a)) * h
        pts.append([_hx(x), _hy(y), 0])
    pts.append([_hx(760), HY0, 0])
    poly = Polygon(*pts, fill_color=SOIL, fill_opacity=1, stroke_color=SOIL_D, stroke_width=4)
    g = VGroup(poly)
    if h > 0.2:
        for i in range(30):
            x = 150 + i * 17
            y = GY - (GY - hill_y(x, p, a)) * h * ((i % 5) / 6 + 0.1)
            if y < GY - 4:
                g.add(Dot([_hx(x), _hy(y), 0], radius=0.035, color=SOIL_D))
    return g


def hill_ghost():
    pts = [[_hx(x), _hy(base_y(x)), 0] for x in range(80, 761, 6)]
    m = VMobject(stroke_color=INK, stroke_width=4)
    m.set_points_as_corners(pts)
    return DashedVMobject(m, num_dashes=60)


def ground_strip():
    return rect(11.6, 0.4, "#B89366", y=HY0 - 0.2, stroke=SOIL_D, sw=3)


def paper_cup(cy=128):
    """종이컵(윗면 높이 = 앱 y)"""
    top = _hy(cy)
    x = _hx(400)
    c = Polygon([x - 0.36, top, 0], [x + 0.36, top, 0], [x + 0.27, top - 0.62, 0], [x - 0.27, top - 0.62, 0],
                fill_color="#FFFFFF", fill_opacity=1, stroke_color=INK, stroke_width=4)
    notch = rect(0.16, 0.16, "#E7F4F2", x=x + 0.28, y=top - 0.05, stroke="#E7F4F2", sw=0)
    return VGroup(c, notch)


def water_line(p=0.0, a=1.0, upto=700, width=10):
    pts = [[_hx(414), _hy(134), 0]]
    for x in range(416, int(upto) + 1, 8):
        pts.append([_hx(x), _hy(hill_y(x, p, a) - 4), 0])
    m = VMobject(stroke_color=WATER, stroke_width=width)
    m.set_points_as_corners(pts)
    return m


_CF = []
for _i in range(26):
    _r = np.sin(_i * 91.7) * 43758.5
    _CF.append((418 + (_r - np.floor(_r)) * 110, np.sin(_i * 12.9) * 0.5 + 0.5))


def coffee(cp=0.0, p=0.0, a=1.0, op=1.0):
    g = VGroup()
    for x0, k in _CF:
        m = max(0.0, min(1.0, cp * (0.6 + k * 0.9)))
        x = x0 + (600 + k * 90 - x0) * m
        y = hill_y(x, p, a) - 4 - k * 3
        g.add(Dot([_hx(x), _hy(y), 0], radius=0.07, color="#2E1D10", fill_opacity=op))
    return g


def depth_mark(p=1.0, a=1.0):
    x = 470
    y0, y1 = _hy(base_y(x)), _hy(hill_y(x, p, a))
    ln = Line([_hx(x), y0, 0], [_hx(x), y1, 0], stroke_color=RED, stroke_width=8)
    return ln


def bottle(angle=-100):
    b = VGroup(rect(0.7, 1.45, "#CFEAF9", stroke=BLUE, r=0.18), rect(0.32, 0.36, BLUE, y=0.9, sw=0),
               rect(0.7, 0.8, "#6EC3F0", y=-0.32, stroke=BLUE, op=0.7, r=0.12))
    b.rotate(angle * PI / 180)
    return b


# ══════════════ 운동장 ══════════════
def yard(p=0.0, w=11.0, h=3.6):
    """비 오기 전(p=0) → 비 온 뒤(p=1) 운동장"""
    g = VGroup(rect(w, h * 0.42, "#CFE9F7", y=h * 0.29, sw=0), rect(w, h * 0.58, "#D9B98A", y=-h * 0.21, sw=0))
    sch = VGroup(rect(2.0, 1.0, "#F2EFE6", stroke="#8A6A3E"), rect(0.38, 0.36, "#BFE6FB", x=-0.45, y=0.1, sw=2),
                 rect(0.38, 0.36, "#BFE6FB", x=0.35, y=0.1, sw=2)).move_to([-w / 2 + 1.4, h * 0.22, 0])
    g.add(sch)
    if p > 0:
        rills = [[(-3.5, 0.1), (-2.2, -0.6), (-1.5, -1.6)], [(-0.4, 0.15), (0.1, -0.7), (0.6, -1.65)],
                 [(2.6, 0.1), (2.2, -0.8), (2.9, -1.65)]]
        for r_ in rills:
            g.add(S(r_, None, "#9C7448", 9 * p, close=False))
        for x in (-1.5, 0.6, 2.9):
            g.add(E(1.1 * p + 0.01, 0.22 * p + 0.01, "#B08654", x=x, y=-1.65, sw=0, op=p))
        g.add(E(0.9, 0.24, "#A9D6EF", x=-2.4, y=-1.0, sw=0, op=p), E(0.7, 0.2, "#A9D6EF", x=1.6, y=-0.3, sw=0, op=p))
    return g


def rain(n=40, w=11.0, h=3.6, seed=0):
    g = VGroup()
    for i in range(n):
        x = -w / 2 + rnd(i + seed, 1) * w
        y = -h / 2 + 0.3 + rnd(i + seed, 2) * (h - 0.4)
        g.add(Line([x, y, 0], [x - 0.08, y - 0.26, 0], stroke_color="#3B7FC4", stroke_width=4))
    return g


# ══════════════ 강 ══════════════
def river_map():
    """산(왼쪽 위) → 바다(오른쪽 아래). .spots = {up, mid, down} 점 위치"""
    g = VGroup(rect(12.0, 4.6, "#A8CF7A", sw=0))
    mt = VGroup(P([(-6, -0.2), (-5.3, 2.0), (-4.5, 1.1), (-3.6, 2.3), (-2.6, 0.7), (-2.4, -2.3), (-6, -2.3)],
                  "#8D7A60", MT_D, 3),
                P([(-5.3, 2.0), (-5.05, 1.7), (-5.5, 1.62)], "#FFFFFF", "#FFFFFF", 1),
                P([(-3.6, 2.3), (-3.35, 1.95), (-3.85, 1.93)], "#FFFFFF", "#FFFFFF", 1))
    sea = P([(3.6, -2.3), (4.3, -0.9), (6.0, -0.6), (6.0, -2.3)], SEA, SEA_D, 3)
    r1 = S([(-4.5, 1.55), (-4.0, 0.9), (-3.6, 0.2), (-2.5, -0.05)], None, WATER_D, 6, close=False)
    r2 = S([(-2.5, -0.05), (-1.4, 0.6), (-0.4, 0.0), (0.6, -0.6), (1.6, 0.0), (2.4, -0.3)], None, WATER_D, 14, close=False)
    r3 = S([(2.4, -0.3), (3.4, -1.0), (4.6, -1.3)], None, WATER_D, 30, close=False)
    sand = S([(2.6, -0.85), (3.6, -1.5), (4.4, -1.65)], None, SAND, 10, close=False)
    g.add(mt, sea, r1, r2, r3, sand)
    g.add(T("산", 30, "#FFFFFF").move_to([-5.2, -1.8, 0]), T("바다", 30, "#FFFFFF").move_to([5.2, -1.8, 0]))
    g.spots = {"up": np.array([-3.75, 0.5, 0]), "mid": np.array([-0.4, 0.0, 0]), "down": np.array([3.5, -1.0, 0])}
    return g


def spot_mark(n, col=INK):
    c = Circle(radius=0.3, fill_color=LAVA_Y, fill_opacity=1, stroke_color=col, stroke_width=4)
    return VGroup(c, T(n, 30, col).move_to(c))


def jag_rock(r=0.4, seed=0, col="#8F8F8F"):
    pts = [(-r, 0), (-r * .5, r * .8), (r * .4, r), (r, r * .2), (r * .7, -r * .3), (-r * .3, -r * .35)]
    return P(pts, col, "#555555", 3)


def near_up():
    """강 상류: 좁은 계곡·폭포·큰 바위"""
    g = VGroup(rect(6.0, 3.8, "#CFE9F7", sw=0))
    g.add(P([(-3, -1.9), (-3, 1.6), (-0.6, -1.9)], "#6F8F55", "#4F6E3C", 3),
          P([(3, -1.9), (3, 1.7), (0.6, -1.9)], "#6F8F55", "#4F6E3C", 3),
          P([(-0.75, 1.5), (0.75, 1.5), (0.95, -1.9), (-0.95, -1.9)], "#7D6A52", MT_D, 3),
          rect(0.36, 1.6, "#9CCBEA", x=0, y=0.65, sw=0),
          P([(-0.6, -1.9), (-0.15, -0.15), (0.15, -0.15), (0.6, -1.9)], WATER, WATER_D, 3))
    for x, y, r in [(-1.5, -1.5, 0.45), (1.5, -1.5, 0.5), (-0.55, -1.0, 0.24), (0.6, -1.05, 0.26), (-2.3, -1.65, 0.3)]:
        g.add(jag_rock(r).move_to([x, y, 0]))
    for dx in (-0.1, 0.0, 0.1):
        g.add(Line([dx, 1.4, 0], [dx, -0.1, 0], stroke_color=PAPER, stroke_width=3, stroke_opacity=0.8))
    return g


def near_mid():
    g = VGroup(rect(6.0, 3.8, "#CFE9F7", sw=0), rect(6.0, 3.0, "#A8CF7A", y=-0.4, sw=0))
    g.add(S([(-3, 0.4), (-1.8, 0.8), (-0.8, 0.0), (0.4, -1.0), (1.6, -0.3), (3.0, 0.2)], None, WATER, 34, close=False),
          S([(-0.9, -0.5), (-0.4, -0.95), (0.1, -1.25)], None, SAND, 9, close=False))
    return g


def near_down():
    g = VGroup(rect(6.0, 3.8, "#CFE9F7", sw=0), rect(6.0, 3.1, "#A8CF7A", y=-0.35, sw=0))
    g.add(P([(-3, 0.3), (3, 0.15), (3, -1.2), (-3, -1.0)], WATER, WATER_D, 0),
          P([(-3, -1.0), (3, -1.2), (3, -1.9), (-3, -1.9)], SAND, SAND_D, 0),
          P([(-3, 0.5), (3, 0.35), (3, 0.15), (-3, 0.3)], SAND, SAND_D, 0))
    for i in range(70):
        g.add(Dot([-2.9 + rnd(i, 1) * 5.8, -1.85 + rnd(i, 2) * 0.6, 0], radius=0.03, color="#C9A86A"))
    g.add(E(1.6, 0.3, SAND, x=1.0, y=-0.45, sw=0))
    return g


def flow_slope(steep=True, w=5.6):
    """경사(급함/완만함)와 강물 띠. .p0/.p1 물이 흐르는 시작·끝"""
    if steep:
        p0, p1 = np.array([-w / 2, 1.3, 0]), np.array([w / 2, -0.9, 0])
        land = P([(-w / 2, 1.1), (w / 2, -1.1), (w / 2, -1.5), (-w / 2, -1.5)], "#7D6A52", MT_D, 3)
        wid = 10
    else:
        p0, p1 = np.array([-w / 2, -0.55, 0]), np.array([w / 2, -0.85, 0])
        land = P([(-w / 2, -0.8), (w / 2, -1.1), (w / 2, -1.5), (-w / 2, -1.5)], SOIL, SOIL_D, 3)
        wid = 22
    riv = Line(p0, p1, stroke_color=WATER, stroke_width=wid)
    g = VGroup(land, riv)
    g.p0, g.p1 = p0, p1
    return g


# ══════════════ 화산 ══════════════
VT = np.array([0, 0.9, 0])   # 분화구 가운데(화산 그림 안 좌표)


def volcano_body(w=7.0, h=3.0, base=-1.6):
    t = base + h
    body = P([(-w / 2, base), (-0.55, t), (-0.35, t - 0.12), (0.35, t - 0.12), (0.55, t), (w / 2, base)], MT, MT_D, 4)
    crater = P([(-0.55, t), (-0.35, t - 0.2), (0.35, t - 0.2), (0.55, t), (0.35, t - 0.12), (-0.35, t - 0.12)],
               "#3B322A", "#3B322A", 2)
    g = VGroup(body, crater)
    g.top = np.array([0, t - 0.1, 0])
    g.base = base
    return g


def magma_chamber(op=1.0):
    ch = E(3.6, 0.7, MAGMA, y=-2.05, sw=0, op=0.9 * op)
    pipe = P([(-0.12, -1.9), (-0.08, 1.3), (0.08, 1.3), (0.12, -1.9)], MAGMA, MAGMA, 0, op=0.85 * op)
    return VGroup(ch, pipe)


def gas_puffs(t=0.0, op=1.0, top=(0, 1.3)):
    g = VGroup()
    for i in range(7):
        u = (t + i / 7) % 1
        x = top[0] + np.sin(i * 2 + u * 3) * 0.4 + u * 0.6
        y = top[1] + 0.2 + u * 1.7
        g.add(Circle(radius=0.2 + u * 0.38, fill_color=GAS, fill_opacity=(1 - u) * 0.9 * op, stroke_width=0).move_to([x, y, 0]))
    return g


def ash_cloud(spread=1.0, op=1.0, top=(0, 1.3)):
    g = VGroup()
    for i in range(70):
        u = min(1, spread * (0.5 + rnd(i, 1)))
        a = PI / 2 + (rnd(i, 2) - 0.5) * 1.6 * u
        r = 0.5 + u * 3.3 * rnd(i, 3)
        x, y = top[0] + np.cos(a) * r * 1.2, top[1] + np.sin(a) * r * 0.55
        if y < 3.0:
            g.add(Dot([x, y, 0], radius=0.04 + rnd(i, 4) * 0.05, color=ASH, fill_opacity=0.8 * op))
    return g


def bombs(t=0.0, op=1.0, top=(0, 1.3), base=-1.6):
    g = VGroup()
    for i in range(9):
        u = (t * 0.8 + rnd(i, 5)) % 1
        d = -1 if rnd(i, 6) < 0.5 else 1
        vx = d * (0.8 + rnd(i, 7) * 2.2)
        vy = 2.1 + rnd(i, 8) * 1.0
        x = top[0] + vx * u
        y = top[1] + vy * u - 2.3 * u * u
        if y > base + 0.2:
            g.add(P([(-0.09, 0), (-0.03, 0.1), (0.09, 0.06), (0.08, -0.06), (-0.04, -0.09)], "#3A2F28", "#3A2F28", 1,
                    op=op).move_to([x, y, 0]))
    return g


LAVA_PTS = [(0.3, 1.25), (0.55, 1.0), (0.95, 0.6), (1.35, 0.25), (1.85, -0.1), (2.4, -0.45), (3.0, -0.8), (3.6, -1.1)]


def lava(L_=1.0, cool=0.0):
    n = max(2, int(round(L_ * len(LAVA_PTS))))
    pts = [[x, y, 0] for x, y in LAVA_PTS[:n]]
    r = int(230 + (70 - 230) * cool)
    gcol = int(80 + (60 - 80) * cool)
    b = int(40 + (55 - 40) * cool)
    col = f"#{r:02X}{gcol:02X}{b:02X}"
    m = VMobject(stroke_color=col, stroke_width=22)
    m.set_points_smoothly(pts)
    g = VGroup(m)
    if cool < 0.3:
        m2 = VMobject(stroke_color=LAVA_Y, stroke_width=6, stroke_opacity=0.8 * (1 - cool / 0.3))
        m2.set_points_smoothly(pts)
        g.add(m2)
    return g


def halla():
    """꼭대기가 움푹 파이고 물이 고인 산(백록담처럼)"""
    g = VGroup(P([(-3.2, -1.2), (-0.9, 0.9), (0.9, 0.9), (3.2, -1.2)], "#6F8F55", "#4F6E3C", 4))
    g.add(P([(-0.9, 0.9), (-0.6, 0.55), (0.6, 0.55), (0.9, 0.9)], "#7D6A52", MT_D, 3),
          E(0.95, 0.18, SEA, y=0.66, sw=0))
    return g


def ridge():
    """봉우리가 여러 개 이어진 산(화산이 아닌 산)"""
    return VGroup(P([(-3.2, -1.2), (-2.4, 0.4), (-1.8, -0.1), (-0.9, 1.0), (-0.1, 0.0), (0.7, 0.8), (1.5, -0.1),
                     (2.2, 0.5), (3.2, -1.2)], "#8A8F99", "#5E636B", 4),
                  P([(-0.9, 1.0), (-0.7, 0.7), (-1.1, 0.68)], "#FFFFFF", "#FFFFFF", 1),
                  P([(0.7, 0.8), (0.88, 0.55), (0.5, 0.55)], "#FFFFFF", "#FFFFFF", 1))


def smoky_volcano():
    v = VGroup(P([(-3.0, -1.2), (-0.5, 1.0), (0.5, 1.0), (3.0, -1.2)], "#7B6D5D", MT_D, 4),
               P([(-0.5, 1.0), (-0.3, 0.8), (0.3, 0.8), (0.5, 1.0)], "#4F4438", "#4F4438", 2))
    for i, (x, y, r) in enumerate([(0.1, 1.25, 0.25), (0.4, 1.6, 0.32), (0.85, 1.9, 0.32), (1.3, 2.05, 0.27)]):
        v.add(Circle(radius=r, fill_color="#F4F6F8", fill_opacity=0.95, stroke_color=SOFT, stroke_width=2).move_to([x, y, 0]))
    return v


def island(name, w=1.8):
    blob = S([(-w / 2, -0.15), (-w / 4, 0.12), (0, 0.32), (w / 4, 0.12), (w / 2, -0.15), (0, -0.3)], LAND, LAND_D, 4)
    return VGroup(E(w + 0.9, 0.9, SEA_L, sw=0), blob, T(name, 32).move_to([0, -0.75, 0]))


# ══════════════ 암석 ══════════════
def _blob(r=1.0, seed=1):
    pts = []
    for k in range(12):
        a = k / 12 * TAU
        rr = r * (0.8 + rnd(seed * 7 + k, 9) * 0.3)
        pts.append((np.cos(a) * rr * 1.25, np.sin(a) * rr * 0.85))
    return pts


def rock(kind="granite", r=1.0, seed=1, pink=False, holes=12):
    """granite: 밝은 바탕 + 검은·흰 큰 알갱이 / basalt: 어두운 바탕 + 구멍"""
    if kind == "granite":
        base = "#E3C3B8" if pink else "#D9D6CF"
        g = VGroup(P(_blob(r, seed), base, "#555555", 4))
        for k in range(45):
            x = (-1 + rnd(seed * 50 + k, 1) * 2) * r * 0.95
            y = (-1 + rnd(seed * 50 + k, 2) * 2) * r * 0.6
            g.add(Dot([x, y, 0], radius=r * (0.03 + rnd(seed * 50 + k, 3) * 0.04),
                      color="#2A2A2A" if k % 3 else "#F6F4EF"))
    else:
        g = VGroup(P(_blob(r, seed), "#3C3E42", "#555555", 4))
        for k in range(holes):
            x = (-1 + rnd(seed * 50 + k, 4) * 2) * r * 0.85
            y = (-1 + rnd(seed * 50 + k, 5) * 2) * r * 0.55
            g.add(E(r * (0.08 + rnd(k, 6) * 0.08), r * (0.05 + rnd(k, 7) * 0.05), "#1C1D1F", x=x, y=y, sw=0))
    return g


def zoom_view(kind="granite", R=1.4, pink=False, holes=True):
    """디지털 현미경으로 본 둥근 화면"""
    g = VGroup(Circle(radius=R, fill_color="#E4E1DA" if kind == "granite" else "#3B3D41", fill_opacity=1, stroke_width=0))
    if kind == "granite":
        cols = ["#F1D2C6", "#E2A995", "#F6F2EC", "#CFC9C2", "#D89C88"] if pink else \
               ["#F4F2EC", "#D7D3CC", "#BFBAB2", "#ECEBE6", "#C8C2B8"]
        for k in range(46):
            x, y = (-1 + rnd(k, 11) * 2) * R * 0.85, (-1 + rnd(k, 12) * 2) * R * 0.85
            if x * x + y * y > (R * 0.95) ** 2:
                continue
            rr = R * (0.12 + rnd(k, 13) * 0.1)
            a0 = rnd(k, 14) * 6
            pts = []
            for m_ in range(6):
                t = a0 + m_ / 6 * TAU
                q = rr * (0.7 + rnd(k * 6 + m_, 15) * 0.5)
                pts.append((x + np.cos(t) * q, y + np.sin(t) * q))
            g.add(P(pts, "#232323" if k % 7 == 0 else cols[k % len(cols)], "#9A948B", 1.5))
    else:
        for k in range(420):
            x, y = (-1 + rnd(k, 21) * 2) * R, (-1 + rnd(k, 22) * 2) * R
            if x * x + y * y > (R * 0.96) ** 2:
                continue
            g.add(Dot([x, y, 0], radius=R * (0.008 + rnd(k, 23) * 0.012),
                      color=["#2B2C2F", "#55585D", "#46484C", "#1F2022"][k % 4]))
        if holes:
            for k in range(6 if holes is True else int(holes)):
                x, y = (-0.6 + rnd(k, 24) * 1.2) * R, (-0.6 + rnd(k, 25) * 1.2) * R
                rx = R * (0.1 + rnd(k, 26) * 0.1)
                g.add(Ellipse(width=rx * 2, height=rx * 1.4, fill_color="#111214", fill_opacity=1,
                              stroke_color="#5F6267", stroke_width=3).move_to([x, y, 0]))
    g.add(Circle(radius=R, stroke_color="#9FB3BD", stroke_width=10))
    return g


def cool_box(w=4.2, h=1.0, big=True, p=1.0):
    """마그마가 식는 상자: p 0(붉은 마그마) → 1(알갱이)"""
    def mix(c0, c1, t):
        a = [int(c0[i:i + 2], 16) for i in (1, 3, 5)]
        b = [int(c1[i:i + 2], 16) for i in (1, 3, 5)]
        return "#" + "".join(f"{int(x + (y - x) * t):02X}" for x, y in zip(a, b))
    end = "#D8D3CA" if big else "#3E4044"
    g = VGroup(rect(w, h, mix(MAGMA, end, p), stroke=MT_D, r=0.15))
    n = int(round((22 if big else 90) * p))
    for k in range(n):
        off = 0 if big else 300
        x = -w / 2 + 0.15 + rnd(k + off, 31) * (w - 0.3)
        y = -h / 2 + 0.12 + rnd(k + off, 32) * (h - 0.24)
        rr = (0.04 + 0.13 * p) if big else 0.028
        col = ["#F6F3EE", "#B9B2A8", "#232323", "#E9C8B8"][k % 4] if big else "#222222"
        g.add(Dot([x, y, 0], radius=rr, color=col))
    return g


def hareubang(h=2.4):
    s = h / 2.4
    body = S([(-0.5, -1.2), (-0.45, 0.5), (-0.4, 0.85), (0, 1.0), (0.4, 0.85), (0.45, 0.5), (0.5, -1.2)],
             "#4B4D50", "#2F3133", 4)
    hat = S([(-0.45, 0.75), (0, 1.2), (0.45, 0.75), (0, 0.9)], "#3D3F42", "#2F3133", 3)
    eyes = VGroup(E(0.24, 0.26, "#5E6165", x=-0.18, y=0.5, stroke="#202224", sw=3),
                  E(0.24, 0.26, "#5E6165", x=0.18, y=0.5, stroke="#202224", sw=3))
    nose = E(0.18, 0.26, "#5E6165", x=0, y=0.25, stroke="#202224", sw=3)
    mouth = L((-0.12, 0.04), (0.12, 0.04), "#202224", 4)
    arm = VGroup(S([(-0.42, -0.1), (-0.1, -0.15), (0.12, -0.22)], None, "#5E6165", 10, close=False),
                 S([(0.42, -0.45), (0.1, -0.4), (-0.12, -0.33)], None, "#5E6165", 10, close=False))
    g = VGroup(body, hat, eyes, nose, mouth, arm)
    for i in range(30):
        g.add(Dot([-0.38 + rnd(i, 1) * 0.76, -1.1 + rnd(i, 2) * 1.8, 0], radius=0.02 + rnd(i, 3) * 0.025, color="#2A2B2D"))
    return g.scale(s)


def pagoda(h=2.6):
    s = h / 2.6
    g = VGroup(rect(1.8, 0.35, "#E6E1D7", y=-1.15, stroke="#8A847A"), rect(1.4, 0.45, "#E6E1D7", y=-0.75, stroke="#8A847A"))
    y = -0.4
    for k, w in enumerate((1.5, 1.2, 0.95)):
        g.add(P([(-w / 2, y), (w / 2, y), (w / 2 - 0.1, y + 0.14), (-w / 2 + 0.1, y + 0.14)], "#D9D3C8", "#8A847A", 3))
        g.add(rect(w * 0.55, 0.38, "#E6E1D7", y=y + 0.33, stroke="#8A847A", sw=3))
        y += 0.52
    g.add(rect(0.08, 0.5, "#8A847A", y=y + 0.2, sw=0))
    for i in range(30):
        g.add(Dot([-0.8 + rnd(i, 5) * 1.6, -1.25 + rnd(i, 6) * 0.5, 0], radius=0.02, color="#555555"))
    return g.scale(s)


# ══════════════ 화산 마을 ══════════════
def plane(s=1.0):
    g = VGroup(P([(-0.8, 0), (0.6, 0.05), (0.9, 0), (0.6, -0.08), (-0.8, -0.05)], "#FFFFFF", "#555555", 3),
               P([(-0.1, 0), (-0.45, 0.45), (-0.25, 0.45), (0.2, 0)], "#DDDDDD", "#555555", 3),
               P([(-0.1, -0.03), (-0.45, -0.45), (-0.25, -0.45), (0.2, -0.03)], "#DDDDDD", "#555555", 3),
               P([(-0.8, 0), (-0.95, 0.25), (-0.75, 0.25), (-0.6, 0.02)], "#DDDDDD", "#555555", 3))
    return g.scale(s)


def tree(h=0.9, col="#3F8F46"):
    return VGroup(rect(0.12, h * 0.45, "#6D4A2A", y=-h * 0.28, sw=0),
                  Circle(radius=h * 0.3, fill_color=col, fill_opacity=1, stroke_width=0).move_to([0, h * 0.12, 0]))


def flame(s=1.0):
    return VGroup(S([(-0.25, 0), (-0.2, 0.3), (0, 0.6), (0.2, 0.3), (0.25, 0), (0, -0.08)], ORANGE, "#C2332C", 3),
                  S([(-0.1, 0), (0, 0.28), (0.1, 0), (0, -0.04)], LAVA_Y, LAVA_Y, 1)).scale(s)


def field(w=2.4):
    g = VGroup(rect(w, 1.0, "#B98B57", stroke=SOIL_D, sw=3))
    for i in range(4):
        g.add(Line([-w / 2 + 0.1, -0.35 + i * 0.24, 0], [w / 2 - 0.1, -0.35 + i * 0.24, 0], stroke_color="#5F9E3C",
                   stroke_width=8))
    for i in range(5):
        g.add(Dot([-w / 2 + 0.3 + i * (w - 0.6) / 4, 0.4, 0], radius=0.09, color="#E2573F"))
    return g


def steam(n=3, h=0.7, x0=0.0, gap=0.35):
    g = VGroup()
    for i in range(n):
        x = x0 + (i - (n - 1) / 2) * gap
        g.add(S([(x, 0), (x - 0.1, h * 0.33), (x, h * 0.66), (x + 0.08, h)], None, "#FFFFFF", 5, close=False))
    return g


def spa(w=2.4):
    pool = E(w, 0.6, "#8CCFE0", stroke="#7A6A55", sw=8)
    heads = VGroup(Circle(radius=0.15, fill_color=SKIN, fill_opacity=1, stroke_color=INK, stroke_width=2).move_to([-0.35, 0.05, 0]),
                   Circle(radius=0.15, fill_color=SKIN, fill_opacity=1, stroke_color=INK, stroke_width=2).move_to([0.35, 0.05, 0]))
    return VGroup(pool, heads, steam(3, 0.8).shift(UP * 0.25))


def geo_plant():
    g = VGroup(rect(1.4, 0.8, "#E9EEF2", stroke="#666666", sw=3), rect(0.26, 0.6, "#BCC5CC", x=-0.3, y=0.7, stroke="#666666", sw=2),
               steam(1, 0.6, -0.3).shift(UP * 1.0))
    bolt = P([(0.15, 0.3), (-0.05, -0.02), (0.08, -0.02), (-0.08, -0.3), (0.2, 0.06), (0.06, 0.06)], LAVA_Y, "#B58400", 2)
    g.add(bolt.move_to([0.3, 0, 0]))
    return g


def tourists():
    g = VGroup(P([(-1.0, -0.4), (-0.5, 0.6), (0, 0.1), (0.5, 0.9), (1.0, -0.4)], "#5A5452", "#3A3432", 3))
    for x, c in ((-0.35, BLUE), (0.35, RED)):
        g.add(Circle(radius=0.14, fill_color=SKIN, fill_opacity=1, stroke_color=INK, stroke_width=2).move_to([x, -0.55, 0]),
              rect(0.22, 0.32, c, x=x, y=-0.85, sw=0, r=0.06))
    return g


# ══════════════ 지진 ══════════════
def desk(w=2.0):
    return VGroup(rect(w, 0.16, "#C8915A", sw=2, stroke=BROWN_DARK, r=0.04),
                  rect(0.13, 0.95, "#8A5A2B", x=-w / 2 + 0.15, y=-0.55, sw=0),
                  rect(0.13, 0.95, "#8A5A2B", x=w / 2 - 0.15, y=-0.55, sw=0))


def kid(col=BLUE, s=1.0, crouch=False, bag=False):
    """둥근 머리 + 몸. crouch면 책상 아래 웅크린 모습(팔을 양옆으로 뻗어 책상 다리를 잡음)"""
    head = Circle(radius=0.2, fill_color=SKIN, fill_opacity=1, stroke_color=INK, stroke_width=3)
    if crouch:
        body = RoundedRectangle(corner_radius=0.12, width=0.56, height=0.4, fill_color=col, fill_opacity=1, stroke_width=0)
        head.move_to([0, 0.28, 0])
        arms = VGroup(Line([-0.25, 0.08, 0], [-0.7, 0.18, 0], stroke_color=SKIN, stroke_width=10),
                      Line([0.25, 0.08, 0], [0.7, 0.18, 0], stroke_color=SKIN, stroke_width=10))
        g = VGroup(arms, body, head)
    else:
        body = RoundedRectangle(corner_radius=0.12, width=0.42, height=0.62, fill_color=col, fill_opacity=1,
                                stroke_width=0).move_to([0, -0.48, 0])
        legs = VGroup(Line([-0.1, -0.78, 0], [-0.14, -1.15, 0], stroke_color=INK, stroke_width=8),
                      Line([0.1, -0.78, 0], [0.14, -1.15, 0], stroke_color=INK, stroke_width=8))
        g = VGroup(legs, body, head)
        if bag:
            g.add(rect(0.62, 0.22, RED, y=0.27, sw=2, r=0.06))
    return g.scale(s)


def shelf_room():
    """흔들리는 방 부품: 책장(책 5권) · 매달린 전등 · 책상 위 컵. .books 책"""
    g = VGroup()
    sh = VGroup(rect(3.0, 0.14, "#8A5A2B", y=0.95, sw=0), rect(3.0, 0.14, "#8A5A2B", y=0.0, sw=0))
    books = VGroup()
    cols = ["#E2573F", "#3A86C8", "#FFC93C", "#16804A", "#6B3FA0"]
    for i in range(5):
        books.add(rect(0.36, 0.72, cols[i], x=-1.1 + i * 0.55, y=0.43, sw=2))
    sh.add(books)
    sh.move_to([3.3, 1.1, 0])
    lamp = VGroup(Line([0, 0, 0], [0, -0.8, 0], stroke_color="#666666", stroke_width=3),
                  Circle(radius=0.22, fill_color="#FFE28A", fill_opacity=1, stroke_color="#B58400", stroke_width=3).move_to([0, -1.0, 0]))
    lamp.move_to([-2.4, 2.25, 0])
    dk = desk(2.6).move_to([-2.4, -1.0, 0])
    cup = rect(0.36, 0.4, "#CFEAF9", x=-2.2, y=-0.43, stroke=BLUE, sw=3, r=0.05)
    g.add(sh, lamp, dk, cup)
    g.books, g.shelf, g.lamp, g.cup, g.desk = books, sh, lamp, cup, dk
    return g


def phone_msg(lines=("긴급 재난 문자",), w=1.9, h=3.0):
    g = VGroup(rect(w, h, "#222222", sw=0, r=0.25), rect(w - 0.2, h - 0.45, "#FFFFFF", sw=0, r=0.08))
    box = rect(w - 0.4, 1.5, "#FDE2DF", y=0.45, stroke=RED, sw=3, r=0.12)
    txt = VGroup(*[T(l, 30 if i else 32, RED if i == 0 else INK) for i, l in enumerate(lines)]).arrange(DOWN, buff=0.1)
    if txt.width > w - 0.6:
        txt.scale_to_fit_width(w - 0.6)
    txt.move_to(box)
    g.add(box, txt)
    return g


def tv_news(w=5.2, h=3.0):
    g = VGroup(rect(w, h, "#2F4F6A", sw=0, r=0.15), rect(w - 0.3, h - 0.55, "#CFE9F7", y=0.12, sw=0, r=0.06))
    v = VGroup(P([(-1.4, -0.9), (-0.25, 0.5), (0.25, 0.5), (1.4, -0.9)], MT, MT_D, 3)).move_to([-1.0, 0.0, 0])
    v.add(Circle(radius=0.18, fill_color="#D7DADE", fill_opacity=0.9, stroke_width=0).move_to(v.get_top() + UP * 0.2))
    rep = VGroup(Circle(radius=0.26, fill_color=SKIN, fill_opacity=1, stroke_color=INK, stroke_width=2).move_to([0, 0.35, 0]),
                 rect(0.6, 0.7, "#3A3F8F", y=-0.25, sw=0, r=0.12)).move_to([1.4, -0.2, 0])
    bar = rect(w - 0.3, 0.42, "#C2332C", y=-h / 2 + 0.3, sw=0)
    g.add(v, rep, bar, T("속보 · 재난에 철저하게 대비해요", 24, "#FFFFFF").move_to(bar))
    return g
