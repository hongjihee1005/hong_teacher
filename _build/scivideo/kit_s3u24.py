"""3학년 2학기 4단원 「감염병과 건강한 생활」 전용 그림 부품 (s3ep35~38, s3mm08)

모두 직접 그린 단순한 벡터 그림. 따로 적지 않으면 그림 가운데가 (0, 0).
  병원체: germ(kind='ball'|'rod'|'dots', col) — 귀엽게 그렸지만 모양은 단순한 병원체 그림(실제로는 눈에 안 보임)
  사람: face(mood='ok'|'sick'|'sneeze', r) · mini_kid(glow) — 악수 실험용 작은 사람 · thermometer
  손: hand(s, col) · wash_step(k) — 손 씻기 6단계 그림(1~6) · bubbles
  물건: mask · soap · tissue · window · plate · cup(boiled) · syringe · door_knob · salad · bed_home · sticky(text, col)
  마을(u4-2): place_card(kind, epi) — hosp·lib·shop·fest·air·home
  실험: dish(day, washed) — 앱 u4-5의 배지 점(같은 계산) · cobalt_board() · cobalt_dots(n, spread, seed)
"""
import numpy as np
from manim import (DOWN, LEFT, ORIGIN, RIGHT, UP, PI, TAU,
                   Arc, ArcBetweenPoints, Circle, Dot, Ellipse, Line, Polygon, Rectangle, RoundedRectangle,
                   VGroup, VMobject, Annulus)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, T
from scikit import RED, SKIN

SW = 4
WHITE = "#FFFFFF"
GRAY = "#8D96A0"
LGRAY = "#D6DBE0"
PINK = "#E89AA6"
SKIN_D = "#C99A6B"
SKIN2 = "#F3C79C"
GERM_G = "#7CC26B"
GERM_P = "#B58AD8"
GERM_O = "#F2A65A"
SKYB = "#9ED3EE"
COBALT = "#5B8DD6"
COBALT_R = "#E2578F"
DISH = "#FDF6EA"
DOT_R = "#D62D20"


def fit(mob, w=2.0, h=1.4):
    s = min(w / max(mob.width, 1e-3), h / max(mob.height, 1e-3))
    mob.scale(s)
    return mob


def E(w, h, fill, x=0, y=0, stroke=INK, sw=SW, op=1.0):
    return Ellipse(width=w, height=h, fill_color=fill, fill_opacity=op, stroke_color=stroke,
                   stroke_width=sw).move_to([x, y, 0])


def C(r, fill, x=0, y=0, stroke=INK, sw=SW, op=1.0):
    return Circle(radius=r, fill_color=fill, fill_opacity=op, stroke_color=stroke, stroke_width=sw).move_to([x, y, 0])


def L(a, b, col=INK, sw=SW):
    return Line([a[0], a[1], 0], [b[0], b[1], 0], stroke_color=col, stroke_width=sw)


def R(w, h, fill, x=0, y=0, rad=0.08, stroke=INK, sw=SW, op=1.0):
    return RoundedRectangle(corner_radius=min(rad, w / 2 - 1e-3, h / 2 - 1e-3), width=w, height=h, fill_color=fill,
                            fill_opacity=op, stroke_color=stroke, stroke_width=sw).move_to([x, y, 0])


def P(pts, fill, stroke=INK, sw=SW, op=1.0):
    return Polygon(*[[x, y, 0] for x, y in pts], fill_color=fill, fill_opacity=op, stroke_color=stroke, stroke_width=sw)


def S(pts, col=INK, sw=SW):
    m = VMobject(stroke_color=col, stroke_width=sw)
    m.set_points_smoothly([np.array([x, y, 0.0]) for x, y in pts])
    return m


def eyes(x, y, d=0.14, r=0.055):
    g = VGroup()
    for sx in (-1, 1):
        g.add(Dot([x + sx * d, y, 0], radius=r, color=INK))
        g.add(Dot([x + sx * d + r * 0.35, y + r * 0.35, 0], radius=r * 0.35, color=WHITE))
    return g


def smile(x, y, w=0.16, col=INK, sw=3):
    return ArcBetweenPoints([x - w / 2, y, 0], [x + w / 2, y, 0], angle=PI * 0.7, stroke_color=col, stroke_width=sw)


# ══════════════ 병원체 ══════════════
def germ(kind="ball", col=GERM_G, s=1.0):
    """귀엽지만 단순한 병원체 그림. ball: 돌기가 난 공 모양 · rod: 막대 모양(꼬리털) · dots: 동글동글 여럿"""
    g = VGroup()
    if kind == "ball":
        for k in range(10):
            a = k * TAU / 10 + 0.15
            d = np.array([np.cos(a), np.sin(a), 0])
            g.add(Line(d * 0.46, d * 0.68, stroke_color=INK, stroke_width=3))
            g.add(Dot(d * 0.7, radius=0.07, color=col).set_stroke(INK, 2))
        g.add(C(0.5, col, sw=3))
        for (x, y, r) in [(-0.28, -0.22, 0.06), (0.3, -0.18, 0.05), (0.22, 0.3, 0.045)]:
            g.add(Dot([x, y, 0], radius=r, color=INK).set_opacity(0.18))
        g.add(eyes(0, 0.06, 0.15, 0.06), smile(0, -0.1, 0.16))
    elif kind == "rod":
        for k in range(4):
            y0 = -0.18 + k * 0.12
            g.add(S([(0.62, y0), (0.8, y0 + 0.08), (0.95, y0 - 0.06), (1.12, y0 + 0.05)], INK, 3))
        g.add(R(1.3, 0.56, col, rad=0.27, sw=3))
        g.add(eyes(-0.2, 0.06, 0.13, 0.055), smile(-0.2, -0.1, 0.14))
    else:
        for (x, y) in [(-0.42, -0.1), (0.0, 0.12), (0.42, -0.08)]:
            g.add(C(0.27, col, x, y, sw=3))
        g.add(eyes(0.0, 0.17, 0.1, 0.045), smile(0.0, 0.04, 0.1, sw=2.5))
    g.scale(s)
    g.move_to(ORIGIN)
    return g


def germ_trio(s=0.8):
    return VGroup(germ("ball", GERM_G, s), germ("rod", GERM_P, s * 0.85), germ("dots", GERM_O, s * 0.9)).arrange(RIGHT, buff=0.5 * s)


# ══════════════ 사람 ══════════════
def face(mood="ok", r=1.0):
    """얼굴(가운데 0,0). mood: ok(웃음) · sick(아파요: 볼 빨갛고 콧물·땀) · sneeze(기침)"""
    g = VGroup()
    head = C(r, SKIN, sw=5)
    hair = ArcBetweenPoints([-r * 0.98, r * 0.15, 0], [r * 0.98, r * 0.15, 0], angle=-PI * 0.95,
                            stroke_color="#5A3B26", stroke_width=5)
    hair.set_fill("#5A3B26", opacity=1)
    g.add(head, hair)
    if mood == "ok":
        g.add(eyes(0, -0.05 * r, 0.36 * r, 0.09 * r), smile(0, -0.45 * r, 0.42 * r, sw=5))
    else:
        for sx in (-1, 1):
            g.add(ArcBetweenPoints([sx * 0.36 * r - 0.14 * r, -0.05 * r, 0], [sx * 0.36 * r + 0.14 * r, -0.05 * r, 0],
                                   angle=PI * 0.6, stroke_color=INK, stroke_width=5))
            g.add(E(0.32 * r, 0.18 * r, "#F08080", sx * 0.55 * r, -0.32 * r, stroke=None, sw=0, op=0.7))
        if mood == "sick":
            g.add(ArcBetweenPoints([-0.18 * r, -0.58 * r, 0], [0.18 * r, -0.58 * r, 0], angle=-PI * 0.6,
                                   stroke_color=INK, stroke_width=5))
            drop = VGroup(Dot([0.05 * r, -0.34 * r, 0], radius=0.07 * r, color=SKYB).set_stroke(BLUE, 2))
            g.add(drop)
        else:  # sneeze: 입을 벌림
            g.add(E(0.3 * r, 0.26 * r, "#8E2F2F", 0, -0.55 * r, sw=3))
    return g


def thermometer(h=1.6, hot=True):
    tube = R(0.26 * h / 1.6, h, WHITE, rad=0.13 * h / 1.6, sw=3)
    bulb = C(0.2 * h / 1.6, RED, 0, -h / 2, sw=3)
    lvl = h * (0.75 if hot else 0.35)
    col = Rectangle(width=0.1 * h / 1.6, height=lvl, fill_color=RED, fill_opacity=1, stroke_width=0)
    col.move_to([0, -h / 2 + lvl / 2, 0])
    ticks = VGroup(*[L((0.05, -h / 2 + 0.3 + k * 0.18), (0.13, -h / 2 + 0.3 + k * 0.18), INK, 2) for k in range(int(h / 0.2))])
    return VGroup(tube, col, bulb, ticks)


def mini_kid(glow=False, uv=False, mark=False, s=1.0):
    """악수 실험의 작은 사람(앱 그림처럼 머리·몸·오른손). uv=True면 어두운 색, glow=True면 손이 빛남"""
    g = VGroup()
    body_c = "#2A2F3A" if uv else "#7BDCBD"
    head_c = "#2A2F3A" if uv else SKIN
    hand_c = ("#A6FF4D" if glow else "#3A4050") if uv else SKIN
    g.add(R(0.42, 0.4, body_c, 0, -0.38, rad=0.12, sw=2))
    g.add(C(0.22, head_c, 0, 0, sw=2))
    if glow and uv:
        g.add(C(0.24, "#A6FF4D", 0.33, -0.45, stroke=None, sw=0, op=0.35))
    g.add(C(0.11, hand_c, 0.33, -0.45, sw=2))
    if mark:
        g.add(C(0.13, RED, 0.33, -0.45, stroke=RED, sw=5, op=0.0))
    g.scale(s)
    g.hand = g[-1] if not mark else g[-2]
    return g


# ══════════════ 손 ══════════════
def hand(s=1.0, col=SKIN, back=False):
    """손바닥 그림(손가락이 위, 엄지가 왼쪽) — 가운데가 손바닥 가운데"""
    g = VGroup()
    fill = SKIN2 if back else col
    for k in range(4):
        hgt = [0.62, 0.72, 0.68, 0.55][k]
        f = R(0.2, hgt, fill, -0.3 + k * 0.2, 0.42 + hgt / 2 - 0.1, rad=0.1, stroke=SKIN_D, sw=3)
        g.add(f)
    th = R(0.2, 0.5, fill, 0, 0, rad=0.1, stroke=SKIN_D, sw=3).rotate(0.7).move_to([-0.55, 0.05, 0])
    g.add(th)
    g.add(R(0.82, 0.9, fill, 0, 0, rad=0.3, stroke=SKIN_D, sw=3))
    if back:
        for k in range(4):
            g.add(L((-0.3 + k * 0.2, 0.32), (-0.3 + k * 0.2, 0.42), SKIN_D, 2))
    g.scale(s)
    return g


def bubbles(n=10, w=2.4, h=1.6, seed=3):
    rng = np.random.default_rng(seed)
    g = VGroup()
    for _ in range(n):
        g.add(Circle(radius=rng.uniform(0.06, 0.17), fill_color=WHITE, fill_opacity=0.85,
                     stroke_color="#9FD3F0", stroke_width=2).move_to([rng.uniform(-w / 2, w / 2), rng.uniform(-h / 2, h / 2), 0]))
    return g


def _rub_arrow(a, b, col=BLUE):
    from manim import DoubleArrow
    return DoubleArrow([a[0], a[1], 0], [b[0], b[1], 0], buff=0, color=col, stroke_width=5, tip_length=0.18)


def _turn_arrow(c, r=0.6, col=BLUE):
    from manim import CurvedArrow
    return CurvedArrow([c[0] + r, c[1], 0], [c[0] - r, c[1] + 0.05, 0], angle=PI * 0.9, color=col, stroke_width=5,
                       tip_length=0.18)


def wash_step(k):
    """손 씻기 k단계(1~6) 그림 — 앱 u4-5의 6단계 문장에 맞춘 단순한 그림"""
    g = VGroup()
    if k == 1:   # 손바닥과 손바닥
        a = hand(1.0).move_to([-0.12, 0, 0])
        b = hand(1.0).flip(UP).move_to([0.12, 0.05, 0]).set_opacity(0.9)
        g.add(a, b, _rub_arrow((-0.9, -0.85), (0.9, -0.85)))
    elif k == 2:  # 손등과 손바닥
        a = hand(1.0, back=True).move_to([0, -0.05, 0])
        b = hand(0.95).rotate(-0.25).move_to([0.15, 0.25, 0]).set_opacity(0.92)
        g.add(a, b, _rub_arrow((-0.9, -0.85), (0.9, -0.85)))
    elif k == 3:  # 손깍지
        a = hand(1.0).move_to([-0.1, 0, 0])
        b = hand(1.0).flip(UP).move_to([0.0, 0.0, 0]).set_opacity(0.85)
        g.add(a, b, _rub_arrow((-0.2, -0.85), (0.2, -0.85)))
        g.add(VGroup(*[L((-0.32 + j * 0.2, 0.55), (-0.32 + j * 0.2, 0.95), SKIN_D, 3) for j in range(4)]))
    elif k == 4:  # 손가락을 마주 잡고
        top = VGroup(R(0.95, 0.55, SKIN, 0, 0.3, rad=0.25, stroke=SKIN_D, sw=3),
                     *[R(0.2, 0.32, SKIN, -0.3 + j * 0.2, 0.0, rad=0.1, stroke=SKIN_D, sw=3) for j in range(4)])
        bot = VGroup(R(0.95, 0.55, SKIN2, 0, -0.42, rad=0.25, stroke=SKIN_D, sw=3),
                     *[R(0.2, 0.32, SKIN2, -0.2 + j * 0.2, -0.14, rad=0.1, stroke=SKIN_D, sw=3) for j in range(4)])
        g.add(bot, top, _rub_arrow((-0.95, -0.95), (0.95, -0.95)))
    elif k == 5:  # 엄지를 돌려 주며
        a = hand(1.0).move_to([0, 0, 0])
        fist = R(0.95, 0.7, SKIN2, -0.45, 0.0, rad=0.3, stroke=SKIN_D, sw=3)
        g.add(a, fist, _turn_arrow((-0.45, 0.55), 0.55))
    else:        # 손톱 밑
        a = hand(1.0).move_to([0, -0.1, 0])
        tips = VGroup(*[C(0.11, SKIN2, -0.15 + 0.15 * (j % 2) + 0.1 * (j // 2), -0.05 + 0.15 * (j // 2), stroke=SKIN_D, sw=3)
                        for j in range(4)])
        g.add(a, tips, _turn_arrow((0, -0.65), 0.45))
    g.move_to(ORIGIN)
    return g


# ══════════════ 물건 ══════════════
def mask(s=1.0, col="#DDEFFA"):
    body = R(1.4, 0.85, col, rad=0.3, stroke=BLUE, sw=4)
    pleats = VGroup(*[L((-0.55, -0.2 + 0.2 * j), (0.55, -0.2 + 0.2 * j), "#7FB2DA", 3) for j in range(3)])
    ears = VGroup(Arc(radius=0.3, start_angle=PI / 2, angle=PI, stroke_color=GRAY, stroke_width=4).move_to([-0.85, 0, 0]),
                  Arc(radius=0.3, start_angle=-PI / 2, angle=PI, stroke_color=GRAY, stroke_width=4).move_to([0.85, 0, 0]))
    return VGroup(ears, body, pleats).scale(s)


def soap(s=1.0):
    bar = R(1.3, 0.75, "#F7B7CF", rad=0.3, stroke="#C9688F", sw=4)
    shine = R(0.5, 0.12, WHITE, -0.2, 0.15, rad=0.06, stroke=None, sw=0, op=0.8)
    return VGroup(bar, shine, bubbles(5, 1.6, 0.4, 5).move_to([0.2, 0.55, 0])).scale(s)


def tissue(s=1.0):
    bx = R(1.4, 0.7, "#A9D8C6", 0, -0.2, rad=0.08, sw=4)
    sheet = P([(-0.3, 0.15), (-0.15, 0.7), (0.2, 0.55), (0.32, 0.15)], WHITE, sw=3)
    return VGroup(sheet, bx).scale(s)


def window(s=1.0, opened=True):
    frame = R(1.4, 1.4, SKYB, rad=0.04, sw=5)
    g = VGroup(frame, L((0, -0.7), (0, 0.7), INK, 5))
    if opened:
        g.add(VGroup(*[S([(-0.5 + 0.0, 0.3 - 0.3 * j), (-0.2, 0.38 - 0.3 * j), (0.1, 0.25 - 0.3 * j), (0.45, 0.32 - 0.3 * j)],
                         "#2F6FD6", 4) for j in range(3)]))
    return g.scale(s)


def plate(s=1.0, small=True):
    g = VGroup(E(1.6, 0.55, WHITE, sw=4), E(1.1, 0.33, "#F4F4F4", sw=2))
    g.add(VGroup(C(0.13, "#E57F3C", -0.2, 0.05, sw=2), C(0.12, "#7CBF5E", 0.12, 0.08, sw=2)))
    return g.scale(s)


def cup(s=1.0, steam=True):
    body = P([(-0.45, 0.45), (0.45, 0.45), (0.35, -0.45), (-0.35, -0.45)], "#CFE8F7", sw=4)
    water = P([(-0.4, 0.2), (0.4, 0.2), (0.35, -0.42), (-0.35, -0.42)], "#8CC6EA", stroke=None, sw=0)
    g = VGroup(water, body)
    if steam:
        for j in range(3):
            x = -0.25 + 0.25 * j
            g.add(S([(x, 0.55), (x + 0.08, 0.7), (x - 0.06, 0.85), (x + 0.04, 1.0)], GRAY, 3))
    return g.scale(s)


def syringe(s=1.0):
    barrel = R(1.2, 0.36, "#EAF6FF", rad=0.06, sw=4)
    liquid = R(0.7, 0.26, "#9ED3EE", -0.2, 0, rad=0.04, stroke=None, sw=0)
    plunger = VGroup(L((0.6, 0), (1.0, 0), INK, 6), L((1.0, -0.22), (1.0, 0.22), INK, 6))
    needle = L((-0.6, 0), (-1.05, 0), GRAY, 3)
    marks = VGroup(*[L((-0.4 + 0.2 * j, 0.18), (-0.4 + 0.2 * j, 0.05), INK, 2) for j in range(5)])
    return VGroup(liquid, barrel, plunger, needle, marks).scale(s)


def door_knob(s=1.0):
    door = R(1.0, 1.7, "#C99567", rad=0.04, sw=4)
    plate_ = R(0.18, 0.55, "#D7D7D7", 0.3, -0.05, rad=0.06, sw=2)
    knob = C(0.13, "#E7C14E", 0.3, -0.05, sw=3)
    return VGroup(door, plate_, knob).scale(s)


def salad(s=1.0):
    bowl = ArcBetweenPoints([-0.75, 0, 0], [0.75, 0, 0], angle=PI, stroke_color=INK, stroke_width=4)
    bowl.set_fill("#F7F2E8", opacity=1)
    leaves = VGroup(C(0.22, "#7CBF5E", -0.35, 0.08, sw=3), C(0.22, "#5AA34A", 0.0, 0.16, sw=3),
                    C(0.2, "#E2574C", 0.35, 0.08, sw=3), C(0.13, "#F3C93B", 0.15, -0.02, sw=2))
    return VGroup(leaves, bowl).scale(s)


def bed_home(s=1.0):
    house = P([(-0.8, -0.6), (0.8, -0.6), (0.8, 0.25), (0, 0.85), (-0.8, 0.25)], "#FFE3B0", sw=4)
    roof = P([(-0.98, 0.2), (0, 0.98), (0.98, 0.2), (0.85, 0.12), (0, 0.8), (-0.85, 0.12)], "#D2453B", sw=3)
    door = R(0.36, 0.55, "#B9834E", 0, -0.33, rad=0.05, sw=3)
    return VGroup(house, roof, door).scale(s)


def sticky(text, col="#FFE066", size=28, w=3.2):
    t = T(text, size, "#222222")
    if t.width > w - 0.3:
        t.scale_to_fit_width(w - 0.3)
    r = Rectangle(width=w, height=t.height + 0.5, fill_color=col, fill_opacity=1, stroke_color=SOFT, stroke_width=2)
    t.move_to(r)
    return VGroup(r, t)


# ══════════════ 마을 (u4-2) ══════════════
def _bldg(icon_fn):
    return icon_fn()


def _hosp():
    b = R(1.3, 1.1, WHITE, 0, -0.1, rad=0.05, sw=4)
    cross = VGroup(Rectangle(width=0.14, height=0.46, fill_color=RED, fill_opacity=1, stroke_width=0),
                   Rectangle(width=0.46, height=0.14, fill_color=RED, fill_opacity=1, stroke_width=0)).move_to([0, 0.15, 0])
    door = R(0.3, 0.38, "#9ED3EE", 0, -0.46, rad=0.03, sw=3)
    return VGroup(b, cross, door)


def _lib():
    g = VGroup()
    cols = ["#E57F3C", "#2F6FD6", "#2E9E5B", "#B5408F", "#C99400"]
    for j, c in enumerate(cols):
        g.add(R(0.22, 0.85 - 0.06 * (j % 2), c, -0.48 + 0.24 * j, -0.05, rad=0.03, sw=3))
    g.add(L((-0.7, -0.5), (0.7, -0.5), INK, 5))
    return g


def _shop():
    b = R(1.3, 0.9, "#FFF4DC", 0, -0.2, rad=0.04, sw=4)
    aw = VGroup()
    for j in range(5):
        aw.add(P([(-0.7 + 0.28 * j, 0.25), (-0.42 + 0.28 * j, 0.25), (-0.42 + 0.28 * j, 0.5), (-0.7 + 0.28 * j, 0.5)],
                 RED if j % 2 == 0 else WHITE, sw=2))
    win = R(0.5, 0.35, SKYB, -0.25, -0.2, rad=0.03, sw=3)
    door = R(0.3, 0.5, "#B9834E", 0.35, -0.4, rad=0.03, sw=3)
    return VGroup(b, aw, win, door)


def _fest():
    tent = P([(-0.75, -0.55), (0.75, -0.55), (0.0, 0.55)], "#F3C93B", sw=4)
    stripe = P([(-0.25, -0.55), (0.25, -0.55), (0.0, 0.55)], "#E57F3C", sw=3)
    pole = L((0, 0.55), (0, 0.85), INK, 3)
    flag = P([(0, 0.85), (0.32, 0.76), (0, 0.67)], RED, sw=2)
    return VGroup(tent, stripe, pole, flag)


def _air():
    body = R(1.5, 0.3, WHITE, 0, 0, rad=0.15, sw=4)
    wing = P([(-0.15, 0.05), (0.25, 0.05), (-0.1, -0.65), (-0.35, -0.65)], "#9ED3EE", sw=3)
    wing2 = P([(-0.15, -0.05), (0.25, -0.05), (-0.05, 0.55), (-0.3, 0.55)], "#9ED3EE", sw=3)
    tail = P([(-0.75, 0.0), (-0.55, 0.0), (-0.75, 0.42)], "#2F6FD6", sw=3)
    return VGroup(wing2, body, wing, tail).rotate(0.25)


PLACES = {"hosp": ("병원", _hosp), "lib": ("도서관", _lib), "shop": ("가게·카페", _shop),
          "fest": ("행사장", _fest), "air": ("공항", _air), "home": ("우리 집", lambda: bed_home(0.75))}


def place_card(kind, epi=False, w=2.3, h=2.1):
    name, fn = PLACES[kind]
    box = R(w, h, "#EEF2F3" if epi else WHITE, rad=0.25, stroke=GRAY if epi else GREEN, sw=4)
    pic = fit(fn(), w * 0.6, h * 0.45).move_to([0, h * 0.1, 0])
    t = T(name, 30, INK).move_to([0, -h * 0.34, 0])
    g = VGroup(box, pic, t)
    if epi:
        g.add(germ("ball", GERM_G, 0.38).move_to([w * 0.36, h * 0.36, 0]))
    g.box, g.pic, g.label = box, pic, t
    return g


# ══════════════ 실험 ══════════════
def _app_dots(n, seed):
    """앱 u4-5의 dots(n, seed)와 같은 계산(좌표는 배지 반지름 100 기준)"""
    s = seed
    out = []

    def r():
        nonlocal s
        s = (s * 9301 + 49297) % 233280
        return s / 233280

    for _ in range(n):
        x = r() * 190 - 95
        y = r() * 190 - 95
        rr = 2 + r() * 3
        if np.hypot(x, y) < 92:
            out.append((x, y, rr))
    return out


def dish(day=0, washed=False, R_=1.25):
    """건조 필름 배지. 앱처럼 손 씻기 전 = day×34개, 씻은 후 = day×3개 점"""
    n = round(day * (3 if washed else 34))
    ds = _app_dots(n, 19 if washed else 7)
    k = R_ / 100
    g = VGroup(C(R_, DISH, stroke="#BBBBBB", sw=6))
    dots = VGroup(*[Dot([x * k, -y * k, 0], radius=rr * k * 1.2, color=DOT_R).set_opacity(0.85) for x, y, rr in ds])
    g.add(dots)
    g.dots = dots
    return g


def cobalt_board(w=5.6, h=2.2):
    """흰 도화지에 붙인 푸른색 염화 코발트 종이 24장(8×3)"""
    g = VGroup(R(w, h, WHITE, rad=0.08, stroke="#BBBBBB", sw=4))
    for i in range(24):
        x = -w / 2 + 0.3 + (i % 8) * (w - 0.6) / 7.6 + 0.23
        y = h / 2 - 0.5 - (i // 8) * 0.62
        g.add(Rectangle(width=0.46, height=0.46, fill_color=COBALT, fill_opacity=1, stroke_width=0).move_to([x, y, 0]))
    return g


def cobalt_dots(board, n, spread, seed=1):
    """기침·말하기 침방울 자국(붉은 점). spread: 도화지 왼쪽부터 퍼진 폭(0~1)"""
    rng = np.random.default_rng(seed)
    x0 = board.get_left()[0] + 0.1
    W = board.width - 0.2
    H = board.height - 0.3
    cy = board.get_center()[1]
    return VGroup(*[Dot([x0 + rng.uniform(0, spread) * W, cy + rng.uniform(-H / 2, H / 2), 0],
                        radius=rng.uniform(0.04, 0.11), color=COBALT_R).set_opacity(0.9) for _ in range(n)])
