"""3-1 2단원 「동물의 생활」 전용 그림 부품 (s3ep05~09, s3mm02)

동물·물건을 단순한 벡터로 직접 그림. 함수마다 가운데가 (0,0)인 VGroup을 돌려주고,
크기는 대략 가로 2 · 세로 1.4 안팎(쓰는 쪽에서 fit()으로 맞춤).
"""
import numpy as np
from manim import (DOWN, LEFT, ORIGIN, RIGHT, UP, PI, TAU,
                   Arc, ArcBetweenPoints, Circle, Dot, Ellipse, Line, Polygon, Rectangle,
                   RoundedRectangle, VGroup, VMobject)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, T
from scikit import RED, BROWN, BROWN_DARK, SKIN

SW = 4          # 윤곽선 굵기
GRAY = "#8D96A0"
DARK = "#4A4F57"
PINK = "#E89AA6"
TAN = "#D9B27C"
SAND = "#E8C98E"
WATER = "#9ED3EE"
WATER_D = "#4A9AC9"
LEAF = "#6DB35A"
NAVY = "#2D3E66"
GOLD = "#E7A33A"
YELLOW = "#F3C93B"
PURPLE = "#8C5CC2"
WHITE = "#FFFFFF"


def fit(mob, w=2.0, h=1.4):
    """가로 w·세로 h 상자 안에 들어가게 줄이거나 키움(비율 유지)"""
    s = min(w / max(mob.width, 1e-3), h / max(mob.height, 1e-3))
    mob.scale(s)
    return mob


def E(w, h, fill, x=0, y=0, stroke=INK, sw=SW, op=1.0):
    return Ellipse(width=w, height=h, fill_color=fill, fill_opacity=op, stroke_color=stroke,
                   stroke_width=sw).move_to([x, y, 0])


def C(r, fill, x=0, y=0, stroke=INK, sw=SW):
    return Circle(radius=r, fill_color=fill, fill_opacity=1, stroke_color=stroke, stroke_width=sw).move_to([x, y, 0])


def L(a, b, col=INK, sw=SW):
    return Line([a[0], a[1], 0], [b[0], b[1], 0], stroke_color=col, stroke_width=sw)


def poly(pts, fill, stroke=INK, sw=SW, op=1.0):
    return Polygon(*[[p[0], p[1], 0] for p in pts], fill_color=fill, fill_opacity=op, stroke_color=stroke,
                   stroke_width=sw)


def smooth(pts, col=INK, sw=SW):
    v = VMobject(stroke_color=col, stroke_width=sw)
    v.set_points_smoothly([[p[0], p[1], 0] for p in pts])
    return v


def eye(x, y, r=0.06):
    return Dot([x, y, 0], radius=r, color=INK)


def wavy(x0, x1, y, amp=0.12, n=3, col=INK, sw=SW):
    xs = np.linspace(x0, x1, 4 * n + 1)
    return smooth([(x, y + amp * np.sin((x - x0) / (x1 - x0) * n * TAU)) for x in xs], col, sw)


# ══════════════ 동물 ══════════════
def rabbit():
    body = E(1.3, 0.95, WHITE, 0.15, -0.15)
    head = C(0.36, WHITE, -0.55, 0.25)
    e1 = E(0.2, 0.75, WHITE, -0.68, 0.85).rotate(0.18)
    e2 = E(0.2, 0.75, WHITE, -0.42, 0.85).rotate(-0.15)
    in1 = E(0.08, 0.5, PINK, -0.68, 0.85, sw=0).rotate(0.18)
    in2 = E(0.08, 0.5, PINK, -0.42, 0.85, sw=0).rotate(-0.15)
    tail = C(0.14, WHITE, 0.85, -0.05)
    legs = VGroup(E(0.35, 0.16, WHITE, -0.25, -0.6), E(0.45, 0.18, WHITE, 0.45, -0.6))
    return VGroup(tail, body, legs, e1, e2, in1, in2, head, eye(-0.65, 0.3), Dot([-0.9, 0.2, 0], radius=0.05, color=PINK))


def spider():
    g = VGroup()
    for side in (-1, 1):
        for i, a in enumerate((0.7, 0.25, -0.2, -0.65)):
            x1, y1 = side * 0.55, 0.05 + a * 0.5
            g.add(smooth([(side * 0.15, 0.0 + a * 0.15), (x1, y1 + 0.25), (side * 0.85, y1 - 0.35)], INK, 5))
    g.add(C(0.36, DARK, 0, -0.18), C(0.22, DARK, 0, 0.28))
    g.add(Dot([-0.07, 0.34, 0], radius=0.04, color=WHITE), Dot([0.07, 0.34, 0], radius=0.04, color=WHITE))
    return g


def octopus():
    col = "#E07560"
    g = VGroup()
    for i in range(8):
        x = -0.75 + i * 0.215
        g.add(smooth([(x * 0.6, -0.15), (x * 0.9, -0.5), (x * 1.05 + 0.08 * np.sin(i), -0.8), (x * 1.2, -1.0)], col, 13))
    head = E(1.05, 1.15, col, 0, 0.35)
    return VGroup(g, head, C(0.1, WHITE, -0.2, 0.1, sw=2), C(0.1, WHITE, 0.2, 0.1, sw=2),
                  eye(-0.2, 0.08, 0.045), eye(0.2, 0.08, 0.045))


def fish(col=GOLD, w=1.6, fin=True):
    body = E(w, w * 0.5, col, 0, 0)
    tail = poly([(w * 0.42, 0), (w * 0.72, w * 0.25), (w * 0.72, -w * 0.25)], col)
    g = VGroup(tail, body)
    if fin:
        g.add(poly([(-0.1 * w, w * 0.22), (0.12 * w, w * 0.38), (0.2 * w, w * 0.2)], col),
              poly([(-0.05 * w, -w * 0.05), (0.12 * w, -w * 0.2), (0.0, -w * 0.18)], col))
    g.add(eye(-w * 0.3, w * 0.06, 0.055))
    return g


def shark():
    col = "#9AA9B8"
    body = poly([(-1.1, 0.0), (-0.75, 0.25), (0.3, 0.3), (0.85, 0.08), (0.85, -0.08), (0.2, -0.28), (-0.75, -0.22)], col)
    dorsal = poly([(-0.2, 0.28), (0.05, 0.75), (0.3, 0.28)], col)
    tail = poly([(0.8, 0.0), (1.2, 0.55), (1.05, 0.0), (1.15, -0.4)], col)
    pect = poly([(-0.3, -0.2), (-0.05, -0.55), (0.05, -0.24)], col)
    belly = poly([(-1.0, -0.06), (-0.4, -0.2), (0.3, -0.2), (-0.4, -0.08)], WHITE, sw=0)
    gills = VGroup(*[L((-0.52 + 0.08 * i, 0.12), (-0.56 + 0.08 * i, -0.08), INK, 3) for i in range(3)])
    return VGroup(tail, dorsal, pect, body, belly, gills, eye(-0.78, 0.08, 0.05))


def ant():
    col = "#5A3A2A"
    g = VGroup()
    for x in (-0.15, 0.0, 0.15):
        g.add(smooth([(x, -0.05), (x * 3 + 0.0, -0.3), (x * 4.2, -0.55)], INK, 5))
    g.add(C(0.2, col, -0.55, 0.05), E(0.36, 0.26, col, -0.1, 0.0), E(0.7, 0.5, col, 0.55, 0.05))
    g.add(smooth([(-0.62, 0.2), (-0.72, 0.5), (-0.95, 0.65)], INK, 4), smooth([(-0.5, 0.22), (-0.48, 0.55), (-0.62, 0.75)], INK, 4))
    g.add(Dot([-0.62, 0.08, 0], radius=0.04, color=WHITE))
    return g


def snake():
    col = "#6FA84A"
    pts = [(1.0, -0.35), (0.6, -0.1), (0.25, -0.4), (-0.1, -0.1), (-0.45, -0.35), (-0.8, -0.05)]
    body = smooth(pts, INK, 30)
    body2 = smooth(pts, col, 22)
    head = E(0.42, 0.3, col, -0.92, 0.02)
    tongue = VGroup(L((-1.12, 0.0), (-1.3, 0.0), RED, 3), L((-1.3, 0.0), (-1.38, 0.06), RED, 3), L((-1.3, 0.0), (-1.38, -0.06), RED, 3))
    return VGroup(body, body2, tongue, head, eye(-0.98, 0.07, 0.045))


def frog(col=LEAF):
    legs = VGroup(E(0.55, 0.3, col, -0.55, -0.35), E(0.55, 0.3, col, 0.55, -0.35))
    body = E(1.2, 0.85, col, 0, -0.05)
    e1, e2 = C(0.2, col, -0.32, 0.38), C(0.2, col, 0.32, 0.38)
    pupils = VGroup(C(0.1, WHITE, -0.32, 0.4, sw=2), C(0.1, WHITE, 0.32, 0.4, sw=2), eye(-0.32, 0.4, 0.05), eye(0.32, 0.4, 0.05))
    mouth = Arc(radius=0.35, start_angle=PI + 0.6, angle=PI - 1.2, stroke_color=INK, stroke_width=3).move_to([0, -0.05, 0])
    feet = VGroup(E(0.3, 0.12, col, -0.25, -0.48), E(0.3, 0.12, col, 0.25, -0.48))
    return VGroup(legs, body, feet, e1, e2, pupils, mouth)


def snail():
    body = poly([(-0.95, -0.45), (0.95, -0.45), (0.85, -0.25), (-0.55, -0.25), (-0.75, 0.0), (-0.95, -0.15)], "#D9C2A0")
    shell = C(0.52, "#C9874A", 0.2, 0.2)
    sp = VMobject(stroke_color=BROWN_DARK, stroke_width=4)
    th = np.linspace(0, 3.2 * PI, 60)
    sp.set_points_smoothly([[0.2 + 0.035 * t * np.cos(t), 0.2 + 0.035 * t * np.sin(t), 0] for t in th])
    ant1 = VGroup(L((-0.8, -0.05), (-0.95, 0.4), INK, 4), Dot([-0.95, 0.42, 0], radius=0.06, color=INK))
    ant2 = VGroup(L((-0.7, -0.05), (-0.7, 0.42), INK, 4), Dot([-0.7, 0.44, 0], radius=0.06, color=INK))
    return VGroup(ant1, ant2, body, shell, sp)


def swallow():
    body = poly([(-0.85, 0.1), (-0.5, 0.25), (0.3, 0.12), (0.85, 0.35), (0.55, 0.05), (0.95, -0.15), (0.3, -0.08), (-0.5, -0.12)], NAVY)
    belly = poly([(-0.65, 0.0), (-0.3, -0.1), (0.2, -0.05), (-0.3, 0.05)], WHITE, sw=0)
    wing = poly([(-0.25, 0.15), (0.35, 0.95), (0.15, 0.2)], NAVY)
    wing2 = poly([(-0.2, 0.0), (0.4, -0.6), (0.1, -0.05)], "#3F558A")
    throat = C(0.07, RED, -0.68, 0.05, sw=0)
    beak = poly([(-0.85, 0.12), (-1.0, 0.08), (-0.85, 0.04)], INK, sw=2)
    return VGroup(wing2, body, belly, wing, throat, beak, Dot([-0.65, 0.17, 0], radius=0.045, color=WHITE))


def sparrow():
    body = E(1.0, 0.7, "#A9774A", 0.05, -0.05)
    belly = E(0.6, 0.38, "#EADBC4", -0.05, -0.17, sw=0)
    head = C(0.3, "#8A5A34", -0.45, 0.25)
    cheek = C(0.09, WHITE, -0.47, 0.17, sw=0)
    wing = E(0.6, 0.36, "#7A4E2A", 0.2, 0.0).rotate(-0.25)
    tail = poly([(0.5, 0.0), (0.95, 0.15), (0.95, -0.05)], "#7A4E2A")
    beak = poly([(-0.72, 0.28), (-0.88, 0.22), (-0.72, 0.18)], INK, sw=2)
    legs = VGroup(L((-0.05, -0.4), (-0.1, -0.6), INK, 3), L((0.12, -0.4), (0.15, -0.6), INK, 3))
    return VGroup(tail, legs, body, belly, wing, head, cheek, beak, eye(-0.5, 0.3, 0.045))


def worm():
    pts = [(-1.0, -0.1), (-0.6, 0.15), (-0.2, -0.15), (0.2, 0.12), (0.6, -0.12), (1.0, 0.05)]
    g = VGroup(smooth(pts, INK, 28), smooth(pts, PINK, 20))
    for x in (-0.55, -0.25, 0.05, 0.35, 0.65):
        y = np.interp(x, [p[0] for p in pts], [p[1] for p in pts])
        g.add(L((x, y - 0.07), (x + 0.02, y + 0.07), "#B86A78", 3))
    return g


def butterfly(col=ORANGE):
    w1 = E(0.85, 0.75, col, -0.42, 0.25).rotate(0.4)
    w2 = E(0.85, 0.75, col, 0.42, 0.25).rotate(-0.4)
    w3 = E(0.55, 0.5, col, -0.3, -0.3).rotate(-0.4)
    w4 = E(0.55, 0.5, col, 0.3, -0.3).rotate(0.4)
    spots = VGroup(C(0.09, WHITE, -0.5, 0.35, sw=0), C(0.09, WHITE, 0.5, 0.35, sw=0))
    body = E(0.14, 0.95, DARK, 0, 0)
    ants = VGroup(smooth([(0, 0.45), (-0.1, 0.65), (-0.25, 0.75)], INK, 3), smooth([(0, 0.45), (0.1, 0.65), (0.25, 0.75)], INK, 3))
    return VGroup(w3, w4, w1, w2, spots, body, ants)


def cabbage_white():
    return butterfly(WHITE)


def bee():
    body = E(0.9, 0.6, YELLOW, 0.1, 0)
    stripes = VGroup(*[Rectangle(width=0.1, height=0.58, fill_color=INK, fill_opacity=1, stroke_width=0).move_to([x, 0, 0])
                       for x in (0.0, 0.25)])
    w = VGroup(E(0.45, 0.6, "#DDEEFF", -0.05, 0.45, op=0.85).rotate(0.3), E(0.4, 0.5, "#DDEEFF", 0.25, 0.4, op=0.85).rotate(-0.3))
    head = C(0.2, DARK, -0.4, 0.05)
    sting = poly([(0.55, 0.0), (0.7, 0.03), (0.55, 0.07)], INK, sw=2)
    return VGroup(sting, body, stripes, w, head)


def ladybug():
    body = C(0.5, RED, 0, -0.05)
    line = L((0, 0.45), (0, -0.55), INK, 4)
    head = Arc(radius=0.24, start_angle=0, angle=PI, fill_color=INK, fill_opacity=1, stroke_color=INK).move_to([0, 0.5, 0])
    dots = VGroup(*[Dot([x, y, 0], radius=0.08, color=INK) for x, y in ((-0.25, 0.1), (0.25, 0.1), (-0.22, -0.28), (0.22, -0.28))])
    return VGroup(body, line, dots, head)


def cat():
    col = "#E9A35A"
    body = E(1.15, 0.7, col, 0.25, -0.25)
    head = C(0.4, col, -0.45, 0.2)
    ears = VGroup(poly([(-0.78, 0.4), (-0.75, 0.75), (-0.55, 0.52)], col), poly([(-0.35, 0.52), (-0.15, 0.75), (-0.12, 0.4)], col))
    tail = smooth([(0.8, -0.2), (1.05, 0.1), (0.95, 0.45)], INK, 14)
    tail2 = smooth([(0.8, -0.2), (1.05, 0.1), (0.95, 0.45)], col, 8)
    wh = VGroup(L((-0.6, 0.12), (-0.95, 0.18), INK, 2), L((-0.6, 0.08), (-0.95, 0.02), INK, 2),
                L((-0.3, 0.12), (0.02, 0.18), INK, 2), L((-0.3, 0.08), (0.02, 0.02), INK, 2))
    legs = VGroup(*[RoundedRectangle(corner_radius=0.06, width=0.14, height=0.3, fill_color=col, fill_opacity=1, stroke_color=INK,
                                     stroke_width=3).move_to([x, -0.6, 0]) for x in (-0.15, 0.05, 0.45, 0.65)])
    return VGroup(tail, tail2, legs, body, ears, head, wh, eye(-0.58, 0.25, 0.05), eye(-0.32, 0.25, 0.05))


def pillbug():
    body = Arc(radius=0.6, start_angle=0, angle=PI, fill_color="#6B6660", fill_opacity=1, stroke_color=INK, stroke_width=SW)
    lines = VGroup(*[L((0.6 * np.cos(a), 0.6 * np.sin(a)), (0.15 * np.cos(a), 0.15 * np.sin(a)), "#3E3A36", 3) for a in np.linspace(0.4, PI - 0.4, 6)])
    legs = VGroup(*[L((x, 0), (x - 0.05, -0.15), INK, 3) for x in np.linspace(-0.45, 0.45, 7)])
    ants = VGroup(L((-0.55, 0.15), (-0.85, 0.35), INK, 3), L((-0.55, 0.1), (-0.85, 0.05), INK, 3))
    return VGroup(legs, ants, body, lines)


def dragonfly():
    body = E(1.5, 0.1, "#3A7FC1", 0.1, 0)
    head = C(0.13, "#3A7FC1", -0.7, 0)
    ws = VGroup(*[E(0.7, 0.2, "#E3F2FF", x, y, op=0.8).rotate(r) for x, y, r in
                  ((-0.25, 0.3, 0.3), (-0.25, -0.3, -0.3), (0.05, 0.28, 0.15), (0.05, -0.28, -0.15))])
    return VGroup(ws, body, head)


def mole():
    col = "#4D4A52"
    body = E(1.6, 0.85, col, 0.1, 0)
    snout = poly([(-0.65, 0.12), (-1.0, 0.0), (-0.65, -0.12)], PINK)
    paw = VGroup(E(0.42, 0.55, PINK, -0.45, -0.35).rotate(0.3))
    claws = VGroup(*[L((-0.65 + 0.08 * i, -0.55 - 0.02 * i), (-0.72 + 0.08 * i, -0.7 - 0.02 * i), INK, 4) for i in range(4)])
    paw2 = E(0.32, 0.4, PINK, 0.2, -0.38).rotate(0.3)
    tail = L((0.88, 0.05), (1.1, 0.12), PINK, 7)
    return VGroup(tail, paw2, body, snout, paw, claws, Dot([-0.5, 0.12, 0], radius=0.03, color=INK))


def mole_cricket():
    col = "#9A6B3E"
    abd = E(0.95, 0.42, col, 0.45, 0)
    tho = E(0.5, 0.42, "#7E5428", -0.15, 0.02)
    head = C(0.17, "#7E5428", -0.5, 0.05)
    shovel = poly([(-0.35, -0.1), (-0.7, -0.35), (-0.85, -0.25), (-0.95, -0.4), (-0.75, -0.5), (-0.4, -0.25)], "#B0773F")
    legs = VGroup(smooth([(0.1, -0.1), (0.3, -0.4), (0.5, -0.45)], INK, 4), smooth([(0.35, -0.12), (0.7, -0.35), (1.0, -0.4)], INK, 4))
    ants = VGroup(L((-0.6, 0.12), (-0.9, 0.3), INK, 3), L((-0.6, 0.1), (-0.95, 0.15), INK, 3))
    return VGroup(legs, ants, abd, tho, shovel, head)


def cicada_nymph(col="#B8864E"):
    """매미 애벌레(허물): 위에서 본 모양 — 머리·더듬이·다리 세 쌍·뾰족한 앞다리"""
    head = E(0.55, 0.36, col, 0, 0.62)
    tho = E(0.7, 0.55, col, 0, 0.2)
    abd = E(0.66, 0.9, col, 0, -0.45)
    segs = VGroup(*[Arc(radius=0.33, start_angle=PI + 0.5, angle=PI - 1.0, stroke_color=BROWN_DARK, stroke_width=3).move_to([0, y, 0])
                    for y in (-0.3, -0.5, -0.7)])
    ants = VGroup(L((-0.12, 0.78), (-0.3, 1.0), INK, 3), L((0.12, 0.78), (0.3, 1.0), INK, 3))
    legs = VGroup()
    fl = VGroup()
    for s in (-1, 1):
        fl.add(VGroup(smooth([(s * 0.25, 0.35), (s * 0.55, 0.55), (s * 0.5, 0.85)], BROWN_DARK, 9),
                      poly([(s * 0.47, 0.82), (s * 0.58, 1.02), (s * 0.43, 0.9)], BROWN_DARK, sw=2)))
        legs.add(smooth([(s * 0.3, 0.1), (s * 0.7, 0.05), (s * 0.85, -0.25)], BROWN_DARK, 7))
        legs.add(smooth([(s * 0.28, -0.05), (s * 0.65, -0.3), (s * 0.75, -0.65)], BROWN_DARK, 7))
    g = VGroup(legs, fl, abd, tho, head, segs, ants, eye(-0.16, 0.66, 0.05), eye(0.16, 0.66, 0.05))
    g.front, g.ants, g.legs = fl, ants, VGroup(fl, legs)
    return g


def otter():
    col = "#8A5E3B"
    body = E(1.6, 0.6, col, 0.1, 0)
    head = C(0.3, col, -0.75, 0.12)
    tail = poly([(0.85, 0.05), (1.3, -0.05), (0.85, -0.15)], col)
    foot = VGroup(E(0.35, 0.18, col, -0.25, -0.33), E(0.35, 0.18, col, 0.45, -0.33))
    return VGroup(tail, foot, body, head, eye(-0.85, 0.18, 0.045), Dot([-1.03, 0.1, 0], radius=0.05, color=INK))


def duck():
    body = E(1.2, 0.65, WHITE, 0.15, -0.1)
    head = C(0.27, WHITE, -0.45, 0.35)
    bill = poly([(-0.68, 0.36), (-0.95, 0.3), (-0.68, 0.24)], ORANGE)
    wing = E(0.6, 0.32, "#E9E4D8", 0.25, -0.05)
    return VGroup(body, wing, head, bill, eye(-0.5, 0.42, 0.045))


def webbed_foot(web=True, col=ORANGE):
    """오리·개구리처럼 발가락 셋 — web=True면 발가락 사이 막"""
    toes = [(-0.55, 0.9), (0.0, 1.05), (0.55, 0.9)]
    g = VGroup()
    if web:
        g.add(poly([(0, 0)] + [toes[0], (-0.25, 0.75), toes[1], (0.25, 0.75), toes[2]], col, op=0.85))
    for t in toes:
        g.add(L((0, 0), t, INK, 9), Dot([t[0], t[1], 0], radius=0.07, color=INK))
    g.add(L((0, 0), (0, -0.55), INK, 10))
    return g.move_to(ORIGIN)


def snail_water():
    """다슬기: 길쭉한 고둥 껍데기"""
    sh = poly([(-0.2, -0.3), (0.2, -0.3), (0.05, 0.75), (-0.05, 0.75)], "#6E5A3A")
    rings = VGroup(*[L((-0.17 + 0.03 * i, -0.15 + 0.22 * i), (0.17 - 0.03 * i, -0.1 + 0.22 * i), "#3E3020", 3) for i in range(4)])
    foot = E(0.6, 0.18, "#B9A57E", 0, -0.35)
    return VGroup(foot, sh, rings).rotate(-0.9)


def diving_beetle():
    body = E(0.6, 0.95, "#3C4A2E", 0, 0)
    line = L((0, 0.45), (0, -0.45), "#1E2A16", 3)
    legs = VGroup()
    for s in (-1, 1):
        legs.add(L((s * 0.25, 0.25), (s * 0.5, 0.45), INK, 3), L((s * 0.28, 0.0), (s * 0.55, 0.1), INK, 3))
        hl = VGroup(L((s * 0.25, -0.25), (s * 0.7, -0.45), INK, 5))
        for k in range(4):
            x = s * (0.35 + 0.09 * k)
            y = -0.3 - 0.045 * k
            hl.add(L((x, y), (x + s * 0.03, y - 0.12), SOFT, 2))
        legs.add(hl)
    return VGroup(legs, body, line).rotate(PI / 2)


def crab():
    col = "#D6623E"
    body = E(1.0, 0.6, col, 0, 0)
    legs = VGroup()
    for s in (-1, 1):
        for k in range(3):
            legs.add(smooth([(s * 0.35, -0.1 - 0.06 * k), (s * (0.7 + 0.05 * k), 0.05 - 0.15 * k), (s * (0.85 + 0.05 * k), -0.35 - 0.1 * k)], INK, 5))
    big = VGroup(L((-0.35, 0.15), (-0.75, 0.55), INK, 6), E(0.55, 0.4, col, -0.85, 0.7))
    small = VGroup(L((0.35, 0.15), (0.6, 0.4), INK, 5), E(0.22, 0.16, col, 0.65, 0.48))
    eyes = VGroup(L((-0.12, 0.25), (-0.15, 0.48), INK, 3), L((0.12, 0.25), (0.15, 0.48), INK, 3),
                  Dot([-0.15, 0.5, 0], radius=0.05, color=INK), Dot([0.15, 0.5, 0], radius=0.05, color=INK))
    return VGroup(legs, big, small, body, eyes)


def dolphin():
    col = "#7C9DB8"
    body = poly([(-1.15, -0.05), (-0.85, 0.15), (-0.4, 0.3), (0.4, 0.25), (0.9, 0.05), (0.9, -0.05), (0.3, -0.2), (-0.5, -0.2), (-0.9, -0.1)], col)
    belly = poly([(-0.95, -0.08), (-0.5, -0.17), (0.2, -0.16), (-0.5, -0.07)], "#E6EEF4", sw=0)
    fin = poly([(-0.15, 0.28), (0.1, 0.65), (0.2, 0.26)], col)
    tail = poly([(0.85, 0.0), (1.2, 0.35), (1.05, 0.0), (1.2, -0.35)], col)
    flip = poly([(-0.4, -0.18), (-0.25, -0.5), (-0.15, -0.18)], col)
    return VGroup(tail, fin, flip, body, belly, eye(-0.7, 0.07, 0.045))


def clam():
    sh = Arc(radius=0.55, start_angle=0, angle=PI, fill_color="#D9B48A", fill_opacity=1, stroke_color=INK, stroke_width=SW)
    rays = VGroup(*[L((0, 0), (0.55 * np.cos(a), 0.55 * np.sin(a)), BROWN_DARK, 2) for a in np.linspace(0.3, PI - 0.3, 6)])
    base = Rectangle(width=1.1, height=0.08, fill_color="#B8925E", fill_opacity=1, stroke_color=INK, stroke_width=3).move_to([0, -0.02, 0])
    return VGroup(sh, rays, base)


def barnacle():
    rock = poly([(-0.9, -0.4), (0.9, -0.4), (0.7, -0.1), (-0.7, -0.15)], "#8C8378")
    g = VGroup(rock)
    for x in (-0.45, 0.0, 0.45):
        g.add(poly([(x - 0.22, -0.15), (x + 0.22, -0.15), (x + 0.1, 0.25), (x - 0.1, 0.25)], "#E3DCCB"),
              E(0.2, 0.08, "#6B6255", x, 0.25, sw=2))
    return g


def sea_turtle():
    col = "#5E9A6A"
    shell = E(1.1, 0.75, "#7A6A3A", 0, 0)
    pat = VGroup(*[C(0.13, "#9C8A50", x, y, sw=2) for x, y in ((-0.25, 0.1), (0.2, 0.1), (0, -0.15))])
    head = C(0.2, col, -0.68, 0.05)
    fl = VGroup(poly([(-0.3, 0.3), (-0.75, 0.65), (-0.1, 0.35)], col), poly([(-0.3, -0.3), (-0.75, -0.65), (-0.1, -0.35)], col),
                poly([(0.4, 0.25), (0.7, 0.4), (0.5, 0.15)], col), poly([(0.4, -0.25), (0.7, -0.4), (0.5, -0.15)], col))
    return VGroup(fl, head, shell, pat, eye(-0.74, 0.1, 0.04))


def polar_bear():
    col = "#F7F5EE"
    body = E(1.7, 0.95, col, 0.15, 0)
    head = E(0.6, 0.45, col, -0.8, 0.25)
    ears = VGroup(C(0.09, col, -0.85, 0.48), C(0.09, col, -0.65, 0.45))
    legs = VGroup(*[RoundedRectangle(corner_radius=0.1, width=0.28, height=0.45, fill_color=col, fill_opacity=1, stroke_color=INK,
                                     stroke_width=SW).move_to([x, -0.55, 0]) for x in (-0.45, -0.15, 0.45, 0.75)])
    return VGroup(legs, ears, body, head, eye(-0.85, 0.3, 0.045), Dot([-1.08, 0.2, 0], radius=0.05, color=INK))


def reindeer():
    col = "#9A7048"
    body = E(1.4, 0.65, col, 0.15, 0.15)
    neck = poly([(-0.4, 0.25), (-0.65, 0.7), (-0.45, 0.78), (-0.2, 0.35)], col)
    head = E(0.42, 0.26, col, -0.72, 0.78).rotate(-0.3)
    ant = VGroup(smooth([(-0.6, 0.9), (-0.55, 1.25), (-0.3, 1.45)], BROWN_DARK, 6), smooth([(-0.57, 1.15), (-0.75, 1.35)], BROWN_DARK, 5),
                 smooth([(-0.68, 0.9), (-0.85, 1.2), (-1.1, 1.3)], BROWN_DARK, 6))
    legs = VGroup(*[L((x, -0.1), (x, -0.65), INK, 7) for x in (-0.35, -0.15, 0.45, 0.65)])
    hooves = VGroup(*[E(0.26, 0.1, DARK, x, -0.68, sw=2) for x in (-0.35, -0.15, 0.45, 0.65)])
    return VGroup(legs, hooves, body, neck, head, ant, eye(-0.75, 0.82, 0.035))


def penguin():
    body = E(0.85, 1.25, "#2C2F38", 0, 0)
    belly = E(0.55, 0.95, WHITE, 0, -0.12, sw=0)
    beak = poly([(-0.08, 0.38), (0.08, 0.38), (0, 0.25)], ORANGE, sw=2)
    feet = VGroup(E(0.25, 0.1, ORANGE, -0.15, -0.62, sw=2), E(0.25, 0.1, ORANGE, 0.15, -0.62, sw=2))
    wings = VGroup(E(0.18, 0.6, "#2C2F38", -0.43, -0.05).rotate(0.25), E(0.18, 0.6, "#2C2F38", 0.43, -0.05).rotate(-0.25))
    return VGroup(feet, wings, body, belly, beak, Dot([-0.12, 0.45, 0], radius=0.045, color=WHITE), Dot([0.12, 0.45, 0], radius=0.045, color=WHITE))


def harp_seal():
    col = "#F4F2EA"
    body = poly([(-0.95, 0.05), (-0.7, 0.35), (0.2, 0.3), (0.8, 0.1), (1.1, 0.2), (1.0, -0.05), (1.1, -0.25), (0.7, -0.15), (-0.6, -0.3)], col)
    return VGroup(body, eye(-0.7, 0.18, 0.06), eye(-0.48, 0.2, 0.06), Dot([-0.88, 0.08, 0], radius=0.05, color=INK))


def camel():
    col = TAN
    body = E(1.4, 0.6, col, 0.2, 0.15)
    hump = Arc(radius=0.35, start_angle=0, angle=PI, fill_color=col, fill_opacity=1, stroke_color=INK, stroke_width=SW).move_to([0.25, 0.5, 0])
    neck = poly([(-0.35, 0.2), (-0.7, 0.75), (-0.5, 0.82), (-0.2, 0.35)], col)
    head = E(0.48, 0.24, col, -0.75, 0.85).rotate(-0.15)
    legs = VGroup(*[L((x, -0.05), (x, -0.75), INK, 7) for x in (-0.25, -0.05, 0.55, 0.75)])
    lash = VGroup(*[L((-0.72 + 0.04 * i, 0.94), (-0.74 + 0.05 * i, 1.0), INK, 2) for i in range(3)])
    return VGroup(legs, body, hump, neck, head, lash, eye(-0.72, 0.9, 0.035))


def fennec():
    col = "#E9C48E"
    body = E(1.0, 0.55, col, 0.3, -0.2)
    head = C(0.3, col, -0.35, 0.15)
    e1 = poly([(-0.6, 0.25), (-0.95, 0.95), (-0.35, 0.4)], col)
    e2 = poly([(-0.3, 0.42), (0.05, 1.05), (-0.08, 0.3)], col)
    in1 = poly([(-0.6, 0.35), (-0.85, 0.8), (-0.45, 0.42)], PINK, sw=0)
    in2 = poly([(-0.25, 0.45), (0.0, 0.92), (-0.1, 0.38)], PINK, sw=0)
    tail = smooth([(0.75, -0.2), (1.05, -0.05), (1.15, 0.2)], INK, 18)
    tail2 = smooth([(0.75, -0.2), (1.05, -0.05), (1.15, 0.2)], col, 12)
    legs = VGroup(*[L((x, -0.4), (x, -0.7), INK, 6) for x in (0.0, 0.15, 0.5, 0.65)])
    return VGroup(tail, tail2, legs, body, e1, e2, in1, in2, head, eye(-0.45, 0.2, 0.04), eye(-0.25, 0.2, 0.04),
                  Dot([-0.62, 0.08, 0], radius=0.05, color=INK))


def tortoise():
    shell = Arc(radius=0.6, start_angle=0, angle=PI, fill_color="#C9A86A", fill_opacity=1, stroke_color=INK, stroke_width=SW)
    pat = VGroup(*[C(0.12, "#A5874E", x, y, sw=2) for x, y in ((-0.25, 0.22), (0.05, 0.38), (0.3, 0.2))])
    head = C(0.15, "#C7B58C", -0.72, 0.08)
    legs = VGroup(E(0.2, 0.22, "#C7B58C", -0.35, -0.08), E(0.2, 0.22, "#C7B58C", 0.35, -0.08))
    return VGroup(legs, head, shell, pat, eye(-0.76, 0.12, 0.03))


def scorpion():
    col = "#9A7A4A"
    body = E(0.8, 0.35, col, 0, 0)
    tail = smooth([(0.35, 0.0), (0.7, 0.25), (0.75, 0.6), (0.5, 0.75)], col, 12)
    claws = VGroup(L((-0.35, 0.05), (-0.65, 0.25), INK, 4), E(0.25, 0.15, col, -0.72, 0.3), L((-0.35, -0.05), (-0.65, -0.2), INK, 4), E(0.25, 0.15, col, -0.72, -0.25))
    return VGroup(claws, body, tail)


def coral():
    g = VGroup()
    for x, h, c in ((-0.4, 0.8, "#F07B7B"), (0.0, 1.1, "#F49A5A"), (0.4, 0.7, "#E86AA0")):
        g.add(L((x, -0.5), (x, -0.5 + h), c, 14), L((x, -0.5 + h * 0.5), (x + 0.2, -0.5 + h * 0.75), c, 10))
    return g


def anemone():
    """말미잘: 굵은 몸통 + 위로 뻗은 촉수"""
    col = "#E8735A"
    body = RoundedRectangle(corner_radius=0.2, width=0.8, height=0.9, fill_color=col, fill_opacity=1, stroke_color=INK,
                            stroke_width=SW).move_to([0, -0.3, 0])
    g = VGroup()
    for a in np.linspace(-1.1, 1.1, 9):
        x0 = 0.32 * np.sin(a)
        g.add(smooth([(x0, 0.1), (x0 + 0.35 * np.sin(a), 0.45), (x0 + 0.6 * np.sin(a), 0.6 + 0.15 * np.cos(a))], col, 12))
    rock = poly([(-0.9, -0.75), (0.9, -0.75), (0.7, -0.6), (-0.7, -0.6)], "#8C8378")
    return VGroup(g, body, rock)


def gecko():
    col = "#7FBF4F"
    body = E(1.0, 0.32, col, 0, 0)
    head = E(0.36, 0.28, col, -0.62, 0.02)
    tail = smooth([(0.45, 0.0), (0.8, -0.1), (1.05, 0.05)], col, 10)
    legs = VGroup()
    for x, s in ((-0.3, 1), (-0.3, -1), (0.3, 1), (0.3, -1)):
        legs.add(L((x, 0), (x - 0.15, s * 0.32), col, 7), C(0.07, col, x - 0.15, s * 0.36, sw=2))
    return VGroup(legs, tail, body, head, eye(-0.68, 0.07, 0.035))


def eagle_foot():
    leg = L((0, 0.6), (0, 0.0), "#E8C34E", 14)
    g = VGroup(leg)
    for a in (-2.4, -1.57, -0.75):
        tip = (0.55 * np.cos(a), 0.55 * np.sin(a))
        g.add(L((0, 0), tip, "#E8C34E", 11), poly([tip, (tip[0] + 0.12 * np.cos(a + 0.9), tip[1] + 0.12 * np.sin(a + 0.9)),
                                                     (tip[0] + 0.15 * np.cos(a), tip[1] + 0.15 * np.sin(a))], INK, sw=2))
    return g


def goat_hoof():
    leg = Rectangle(width=0.32, height=0.6, fill_color="#C9B49A", fill_opacity=1, stroke_color=INK, stroke_width=SW).move_to([0, 0.3, 0])
    h1 = poly([(-0.2, 0.0), (-0.02, 0.0), (-0.02, -0.25), (-0.25, -0.25)], DARK)
    h2 = poly([(0.02, 0.0), (0.2, 0.0), (0.25, -0.25), (0.02, -0.25)], DARK)
    return VGroup(leg, h1, h2)


def masu():
    """산천어: 부드러운 곡선 모양 물고기"""
    g = fish("#9DB3C4", 1.8)
    g.add(*[C(0.06, "#5B7487", x, 0.05, sw=0) for x in (-0.15, 0.1, 0.35)])
    return g


# ══════════════ 물건 ══════════════
def suction_cup():
    """흡착판: 옆에서 본 모양 — 오목한 고무 컵(아래가 벌어짐) + 위 손잡이"""
    cup = Arc(radius=0.6, start_angle=0, angle=PI, fill_color="#BFE3F5", fill_opacity=0.9, stroke_color=INK, stroke_width=SW)
    cup.stretch(0.5, 1)
    cup.move_to([0, 0.15, 0])
    rim = L((-0.62, 0.0), (0.62, 0.0), INK, SW)
    knob = VGroup(Rectangle(width=0.16, height=0.3, fill_color="#BFE3F5", fill_opacity=1, stroke_color=INK, stroke_width=SW).move_to([0, 0.42, 0]),
                  C(0.13, "#BFE3F5", 0, 0.62))
    return VGroup(knob, cup, rim).move_to(ORIGIN)


def octopus_arm():
    col = "#E07560"
    arm = smooth([(-1.0, 0.35), (-0.3, 0.2), (0.4, -0.1), (1.0, -0.45)], col, 34)
    g = VGroup(smooth([(-1.0, 0.35), (-0.3, 0.2), (0.4, -0.1), (1.0, -0.45)], INK, 40), arm)
    for x, y, r in ((-0.75, 0.22, 0.09), (-0.35, 0.12, 0.085), (0.05, -0.02, 0.08), (0.45, -0.2, 0.07), (0.8, -0.4, 0.06)):
        g.add(Circle(radius=r, fill_color="#F7C7B8", fill_opacity=1, stroke_color="#A84A3A", stroke_width=3).move_to([x, y - 0.06, 0]))
    return g


def swim_glove():
    """손에 끼는 물놀이용 물갈퀴(손가락 사이 막)"""
    pts = [(-0.55, -0.6), (-0.6, 0.35), (-0.4, 0.65), (-0.15, 0.85), (0.1, 0.85), (0.35, 0.7), (0.55, 0.45), (0.5, -0.6)]
    web = poly(pts, "#5A8FD8", op=0.9)
    fingers = VGroup(*[L((x, -0.2), (x * 1.1, 0.75 - abs(x) * 0.5), "#2A5FA8", 4) for x in (-0.4, -0.15, 0.1, 0.35)])
    return VGroup(web, fingers)


def excavator():
    track = RoundedRectangle(corner_radius=0.18, width=1.5, height=0.36, fill_color=DARK, fill_opacity=1, stroke_color=INK, stroke_width=SW).move_to([0.2, -0.6, 0])
    cab = Rectangle(width=0.9, height=0.6, fill_color=YELLOW, fill_opacity=1, stroke_color=INK, stroke_width=SW).move_to([0.35, -0.12, 0])
    win = Rectangle(width=0.35, height=0.3, fill_color="#CFE8F5", fill_opacity=1, stroke_color=INK, stroke_width=3).move_to([0.15, -0.05, 0])
    boom = VGroup(L((-0.05, 0.0), (-0.55, 0.65), YELLOW, 18), L((-0.55, 0.65), (-0.95, 0.0), YELLOW, 16))
    bucket = poly([(-0.95, 0.05), (-1.25, -0.15), (-1.15, -0.35), (-0.8, -0.2)], DARK)
    teeth = VGroup(*[poly([(-1.2 + 0.08 * i, -0.33 + 0.04 * i), (-1.28 + 0.08 * i, -0.45 + 0.04 * i), (-1.14 + 0.08 * i, -0.36 + 0.04 * i)], INK, sw=1)
                     for i in range(3)])
    return VGroup(track, boom, cab, win, bucket, teeth)


def ktx():
    body = poly([(-1.25, -0.3), (-0.6, 0.3), (1.2, 0.3), (1.2, -0.3)], WHITE)
    stripe = poly([(-1.0, -0.15), (-0.75, 0.05), (1.2, 0.05), (1.2, -0.1)], "#3A6FC4", sw=0)
    win = poly([(-0.85, 0.0), (-0.55, 0.22), (-0.3, 0.22), (-0.3, 0.0)], "#6A7F96", sw=2)
    wheels = VGroup(*[C(0.09, DARK, x, -0.32, sw=2) for x in (-0.4, 0.2, 0.8)])
    return VGroup(body, stripe, win, wheels)


def snake_robot():
    g = VGroup()
    pts = [(-0.9, 0.1), (-0.55, -0.12), (-0.2, 0.1), (0.15, -0.12), (0.5, 0.1), (0.85, -0.1)]
    for i, (x, y) in enumerate(pts):
        g.add(RoundedRectangle(corner_radius=0.08, width=0.36, height=0.26, fill_color="#A8B4C2" if i % 2 else "#7D8A99",
                               fill_opacity=1, stroke_color=INK, stroke_width=3).move_to([x, y, 0]))
    g.add(Dot([-0.98, 0.14, 0], radius=0.05, color=RED))
    return g


def tongs_truck():
    body = Rectangle(width=1.2, height=0.4, fill_color=ORANGE, fill_opacity=1, stroke_color=INK, stroke_width=SW).move_to([0.2, -0.3, 0])
    cab = Rectangle(width=0.45, height=0.4, fill_color=ORANGE, fill_opacity=1, stroke_color=INK, stroke_width=SW).move_to([-0.55, -0.2, 0])
    arm = VGroup(L((0.3, -0.1), (0.1, 0.6), DARK, 10), L((0.1, 0.6), (-0.3, 0.5), DARK, 8))
    claw = VGroup(L((-0.3, 0.5), (-0.45, 0.2), DARK, 6), L((-0.3, 0.5), (-0.15, 0.2), DARK, 6))
    wheels = VGroup(*[C(0.13, DARK, x, -0.52, sw=2) for x in (-0.55, 0.0, 0.55)])
    return VGroup(arm, claw, body, cab, wheels)


def tape_roll():
    o = Circle(radius=0.5, fill_color="#D8D2C2", fill_opacity=1, stroke_color=INK, stroke_width=SW)
    i_ = Circle(radius=0.25, fill_color=PAPER, fill_opacity=1, stroke_color=INK, stroke_width=SW)
    strip = poly([(0.3, -0.4), (0.9, -0.55), (0.9, -0.4), (0.45, -0.25)], "#D8D2C2")
    return VGroup(strip, o, i_)


def hiking_boot():
    g = poly([(-0.4, 0.6), (0.15, 0.6), (0.2, 0.0), (0.7, -0.1), (0.75, -0.35), (-0.45, -0.35)], "#8A5A34")
    sole = poly([(-0.48, -0.35), (0.78, -0.35), (0.75, -0.5), (-0.48, -0.5)], DARK)
    lugs = VGroup(*[poly([(x, -0.5), (x + 0.1, -0.5), (x + 0.05, -0.6)], DARK, sw=1) for x in np.linspace(-0.45, 0.6, 7)])
    return VGroup(g, sole, lugs)


def swimsuit():
    g = poly([(-0.3, 0.7), (0.3, 0.7), (0.45, 0.2), (0.35, -0.7), (0.05, -0.7), (0.0, -0.1), (-0.05, -0.7), (-0.35, -0.7), (-0.45, 0.2)], NAVY)
    dots = VGroup(*[Dot([x, y, 0], radius=0.025, color="#9AB0D8") for x in (-0.2, 0.0, 0.2) for y in (0.4, 0.1, -0.2)])
    return VGroup(g, dots)


def wing_pic():
    return VGroup(poly([(-0.9, -0.2), (0.0, 0.5), (0.9, 0.7), (0.4, 0.1), (0.7, -0.05), (0.2, -0.25)], "#E6E0D2"),
                  *[L((-0.2 + 0.25 * i, 0.15 + 0.12 * i), (0.05 + 0.25 * i, -0.15 + 0.08 * i), SOFT, 3) for i in range(3)])


def sock(col, pattern="none", long_=True):
    Lh = 1.6 if long_ else 0.85
    pts = [(0, Lh), (0.5, Lh), (0.5, 0.25), (0.95, 0.1), (0.95, -0.3), (0.2, -0.3), (0.0, -0.1)]
    g = VGroup(poly(pts, col))
    if pattern == "stripe":
        for y in np.arange(0.4, Lh - 0.2, 0.3):
            g.add(Rectangle(width=0.5, height=0.1, fill_color=WHITE, fill_opacity=0.9, stroke_width=0).move_to([0.25, y, 0]))
    elif pattern == "dot":
        for y in np.arange(0.4, Lh - 0.15, 0.35):
            g.add(Dot([0.15, y, 0], radius=0.07, color=WHITE), Dot([0.36, y + 0.16, 0], radius=0.07, color=WHITE))
    g.add(Rectangle(width=0.54, height=0.16, fill_color=WHITE, fill_opacity=1, stroke_color=INK, stroke_width=3).move_to([0.25, Lh, 0]))
    return g


# ══════════════ 이름표 달린 동물 카드 ══════════════
DRAW = dict(토끼=rabbit, 거미=spider, 문어=octopus, 상어=shark, 개미=ant, 뱀=snake, 개구리=frog, 달팽이=snail,
            제비=swallow, 붕어=fish, 지렁이=worm, 나비=butterfly, 고양이=cat, 참새=sparrow, 박새=sparrow,
            배추흰나비=cabbage_white, 꿀벌=bee, 무당벌레=ladybug, 공벌레=pillbug, 잠자리=dragonfly,
            두더지=mole, 땅강아지=mole_cricket, 수달=otter, 오리=duck, 다슬기=snail_water, 물방개=diving_beetle,
            농게=crab, 돌고래=dolphin, 조개=clam, 따개비=barnacle, 바다거북=sea_turtle, 북극곰=polar_bear,
            순록=reindeer, 펭귄=penguin, 하프물범=harp_seal, 낙타=camel, 사막여우=fennec, 이집트땅거북=tortoise,
            사막전갈=scorpion, 산호=coral, 말미잘=anemone)
DRAW["매미 애벌레"] = cicada_nymph


def card(name, w=2.1, h=1.9, size=30, col=INK, pic=None):
    """동물 카드: 흰 둥근 네모 + 그림 + 이름"""
    box = RoundedRectangle(corner_radius=0.18, width=w, height=h, fill_color=PAPER, fill_opacity=1,
                           stroke_color=SOFT, stroke_width=3)
    p = fit((pic or DRAW[name])(), w * 0.78, h * 0.55).move_to([0, h * 0.1, 0])
    t = T(name, size, col).move_to([0, -h * 0.36, 0])
    if t.width > w * 0.9:
        t.scale_to_fit_width(w * 0.9)
    g = VGroup(box, p, t)
    g.box, g.pic, g.label = box, p, t
    return g


def pic_label(mob, text, size=30, col=INK, buff=0.15):
    t = T(text, size, col).next_to(mob, DOWN, buff=buff)
    return VGroup(mob, t)


def ox_mark(ok=True, r=0.3):
    if ok:
        return Circle(radius=r, stroke_color=GREEN, stroke_width=9)
    return VGroup(Line([-r, -r, 0], [r, r, 0], stroke_color=RED, stroke_width=9),
                  Line([-r, r, 0], [r, -r, 0], stroke_color=RED, stroke_width=9))


def bin_box(title, w, h, col, size=34):
    """분류 상자: 위에 제목"""
    box = RoundedRectangle(corner_radius=0.22, width=w, height=h, fill_color=col, fill_opacity=0.10,
                           stroke_color=col, stroke_width=5)
    t = T(title, size, col).next_to(box.get_top(), DOWN, buff=0.16)
    g = VGroup(box, t)
    g.box, g.title = box, t
    return g


def slots(cx, top_y, n, per_row, dx, dy):
    """n개를 per_row씩 줄지어 놓을 자리(가운데 맞춤, 위에서 아래로)"""
    out = []
    rows = (n + per_row - 1) // per_row
    for r_ in range(rows):
        k = min(per_row, n - r_ * per_row)
        for j in range(k):
            out.append(np.array([cx + (j - (k - 1) / 2) * dx, top_y - r_ * dy, 0.0]))
    return out


def text_card(lines, w=None, size=36, col=INK, fill=PAPER, stroke=SOFT, pad=0.35):
    """여러 줄 글 카드(MarkupText 줄 목록)"""
    from series_style import M
    ts = VGroup(*[M(l, size, col) for l in lines]).arrange(DOWN, buff=0.22, aligned_edge=LEFT)
    W = min(w or ts.width + 2 * pad, 13.4)
    if ts.width > W - 2 * pad:
        ts.scale_to_fit_width(W - 2 * pad)
    box = RoundedRectangle(corner_radius=0.22, width=W, height=ts.height + 2 * pad, fill_color=fill, fill_opacity=1,
                           stroke_color=stroke, stroke_width=4)
    ts.move_to(box)
    return VGroup(box, ts)
