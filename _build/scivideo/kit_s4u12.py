"""4-1 2단원 「물의 상태 변화」 전용 그림 부품 (s4ep06~09, s4mm02)

모두 직접 그린 단순한 벡터 그림. 따로 적지 않으면 그림 가운데가 대략 (0, 0), 크기는 쓰는 쪽에서 fit()·scale().
  세 가지 상태: ice_cube · drop · vapor(점선 김 — 눈에 보이지 않는 수증기를 그림으로) · state_card
  2-1: snowman · puddle · petri_top(위에서 본 페트리 접시: 물/얼음/기울임) · spray_dish(뿌린 물방울, 시간 k)
  2-2: Bottle(플라스틱병: 물·얼음 높이, 검정·빨강·파랑 표시선) · salt_ice_beaker · warm_beaker · pet_frozen(부푼 페트병)
  2-3: wet_head(젖은 머리카락) · water_paper(물로 쓰는 종이 그림, 흐림 k) · Beaker(물 높이·표시선) · bubbles · steam
  2-4: ice_beaker_wrap(랩 씌운 얼음 비커 + 페트리 접시, 물방울 단계) · glasses(김 서림) · cold_can(물방울 단계)
  생활 속: ice_pop · ice_tray · wet_wipe · laundry · persimmons · mirror · pot_lid · dew_grass · window_drops · steam_iron
  안전 띠: safety_note
"""
import numpy as np
from manim import (DOWN, LEFT, ORIGIN, RIGHT, UP, PI, TAU,
                   Arc, Circle, DashedVMobject, Dot, Ellipse, Line, Polygon, Rectangle, RoundedRectangle,
                   VGroup, VMobject)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, T, M
from scikit import RED, BROWN, BROWN_DARK, SKIN
from kit_s3u12 import fit, text_card, ox_mark, bin_box, slots, smooth, E, C, L, poly  # noqa: F401
from kit_s3u22 import hot_plate  # noqa: F401

SW = 4
WATER = "#6EC3F0"
WATER_D = "#2F8FC8"
WATER_L = "#BFE6F7"
ICE = "#EAF6FF"
ICE_D = "#8FBFDF"
VAP = "#7FA9C2"
GLASS = "#8D96A0"
WARM = "#F6B08A"
WHITE = "#FFFFFF"
STATE_COL = {"ice": "#3A9FD8", "water": "#2E7DD1", "vapor": "#7A8B99"}


def rect(w, h, fill, x=0, y=0, stroke=INK, sw=SW, op=1.0, r=0.0):
    if r:
        m = RoundedRectangle(corner_radius=r, width=w, height=h)
    else:
        m = Rectangle(width=w, height=h)
    m.set_fill(fill, opacity=op).set_stroke(stroke, sw)
    return m.move_to([x, y, 0])


# ══════════════ 세 가지 상태 ══════════════
def ice_cube(s=0.5, col=ICE):
    body = RoundedRectangle(corner_radius=0.12 * s / 0.5, width=s * 2, height=s * 2, fill_color=col, fill_opacity=1,
                            stroke_color=ICE_D, stroke_width=4)
    shine = Line([-0.55 * s, 0.6 * s, 0], [-0.1 * s, 0.6 * s, 0], stroke_color=WHITE, stroke_width=8)
    shine2 = Line([-0.6 * s, 0.6 * s, 0], [-0.6 * s, 0.2 * s, 0], stroke_color=WHITE, stroke_width=8)
    return VGroup(body, shine, shine2)


def drop(s=0.5, col=WATER):
    pts = [(0, 1.0), (0.35, 0.35), (0.5, -0.1), (0.38, -0.45), (0, -0.62), (-0.38, -0.45), (-0.5, -0.1), (-0.35, 0.35)]
    v = VMobject(stroke_color=WATER_D, stroke_width=4)
    p = [np.array([x * s, y * s, 0.0]) for x, y in pts]
    v.set_points_smoothly(p + [p[0]])
    v.set_fill(col, opacity=1)
    sh = Arc(radius=0.25 * s, start_angle=2.3, angle=0.9, stroke_color=WHITE, stroke_width=6).move_to([-0.18 * s, -0.12 * s, 0])
    return VGroup(v, sh)


def vapor(h=1.2, n=3, gap=0.45, col=VAP, sw=4):
    """눈에 보이지 않는 수증기를 점선 김으로 그린 것(그림으로 나타낸 것)"""
    g = VGroup()
    for i in range(n):
        x0 = (i - (n - 1) / 2) * gap
        ys = np.linspace(0, h, 9)
        m = VMobject(stroke_color=col, stroke_width=sw)
        m.set_points_smoothly([np.array([x0 + 0.12 * np.sin(y / h * TAU * 1.2 + i), y - h / 2, 0]) for y in ys])
        g.add(DashedVMobject(m, num_dashes=7))
    return g


def vapor_dots(x0, x1, y0, y1, n=24, seed=2, r=0.05, col=VAP):
    rng = np.random.default_rng(seed)
    return VGroup(*[Dot([rng.uniform(x0, x1), rng.uniform(y0, y1), 0], radius=r, color=col) for _ in range(n)])


def state_card(kind, w=3.6, h=3.4, size=40):
    """얼음(고체)·물(액체)·수증기(기체) 카드"""
    col = STATE_COL[kind]
    box = RoundedRectangle(corner_radius=0.25, width=w, height=h, fill_color=PAPER, fill_opacity=1,
                           stroke_color=col, stroke_width=6)
    if kind == "ice":
        pic = VGroup(ice_cube(0.42).shift(LEFT * 0.5 + DOWN * 0.1), ice_cube(0.36).shift(RIGHT * 0.45 + UP * 0.1))
        name, st = "얼음", "고체"
    elif kind == "water":
        pic = VGroup(drop(0.75))
        name, st = "물", "액체"
    else:
        pic = VGroup(vapor(1.2, 3, 0.45, sw=6))
        name, st = "수증기", "기체"
    fit(pic, w * 0.6, h * 0.42).move_to(box.get_center() + UP * h * 0.16)
    t = M(f'{name} <span foreground="{col}">({st})</span>', size).move_to(box.get_center() + DOWN * h * 0.3)
    g = VGroup(box, pic, t)
    g.box, g.pic, g.label = box, pic, t
    return g


# ══════════════ 2-1 ══════════════
def snowman(s=1.0):
    body = C(0.8, WHITE, 0, -0.55, stroke="#9FC9E6")
    head = C(0.52, WHITE, 0, 0.62, stroke="#9FC9E6")
    eyes = VGroup(Dot([-0.18, 0.72, 0], radius=0.06, color=INK), Dot([0.18, 0.72, 0], radius=0.06, color=INK))
    nose = poly([(0, 0.6), (0.38, 0.52), (0, 0.48)], ORANGE, ORANGE, 2)
    hat = VGroup(rect(0.8, 0.12, INK, 0, 1.12, sw=0), rect(0.5, 0.45, INK, 0, 1.38, sw=0))
    btn = VGroup(*[Dot([0, y, 0], radius=0.07, color=INK) for y in (-0.2, -0.55, -0.9)])
    return VGroup(body, head, eyes, nose, hat, btn).scale(s)


def puddle(w=2.6, h=0.4):
    return Ellipse(width=w, height=h, fill_color=WATER, fill_opacity=0.75, stroke_color=WATER_D, stroke_width=3)


def petri_top(content="water", tilt=False, r=1.0):
    """위에서 본 페트리 접시. content: water·ice·empty, tilt=True면 물이 한쪽(왼쪽 아래)으로 모임(얼음은 그대로)"""
    dish = Circle(radius=r, fill_color=WHITE, fill_opacity=0.6, stroke_color=GLASS, stroke_width=5)
    rim = Circle(radius=r * 0.93, stroke_color="#C6CED6", stroke_width=3)
    g = VGroup(dish, rim)
    if content == "water":
        if tilt:
            w = Ellipse(width=r * 1.2, height=r * 0.75, fill_color=WATER, fill_opacity=0.85, stroke_color=WATER_D,
                        stroke_width=3).move_to([-r * 0.42, -r * 0.45, 0]).rotate(PI / 4)
        else:
            w = Circle(radius=r * 0.6, fill_color=WATER, fill_opacity=0.85, stroke_color=WATER_D, stroke_width=3)
        g.add(w)
    elif content == "ice":
        w = Circle(radius=r * 0.6, fill_color=ICE, fill_opacity=1, stroke_color=ICE_D, stroke_width=4)
        cr = VGroup(L((-0.3 * r, 0.2 * r), (0.1 * r, -0.1 * r), ICE_D, 3), L((0.1 * r, -0.1 * r), (0.35 * r, 0.15 * r), ICE_D, 3),
                    L((0.1 * r, -0.1 * r), (0.0, -0.4 * r), ICE_D, 3))
        g.add(w, cr)
    return g


def spray_dish(k=0.0, r=1.4, n=38, seed=5):
    """분무기로 뿌린 물방울(위에서 본 접시). k: 0 처음 → 1 거의 다 사라짐"""
    rng = np.random.default_rng(seed)
    dish = Circle(radius=r, fill_color=WHITE, fill_opacity=0.6, stroke_color=GLASS, stroke_width=5)
    g = VGroup(dish)
    for i in range(n):
        a, rr = rng.uniform(0, TAU), np.sqrt(rng.uniform()) * r * 0.85
        size = rng.uniform(0.04, 0.13)
        left = size - k * 0.13
        if left > 0.01:
            g.add(Circle(radius=left, fill_color=WATER, fill_opacity=0.9, stroke_width=0).move_to([np.cos(a) * rr, np.sin(a) * rr, 0]))
    return g


def spray_bottle(s=1.0):
    body = rect(0.7, 1.1, "#9FE0F7", 0, -0.5, stroke="#3A9FC8", r=0.12)
    neck = rect(0.3, 0.25, "#3A9FC8", 0, 0.17, sw=0)
    head = poly([(-0.25, 0.3), (0.35, 0.3), (0.55, 0.45), (0.35, 0.6), (-0.25, 0.6)], "#F2B705", INK, 3)
    trig = poly([(0.0, 0.3), (0.15, 0.3), (0.05, 0.05)], "#F2B705", INK, 3)
    return VGroup(body, neck, trig, head).scale(s)


# ══════════════ 2-2 ══════════════
class Bottle:
    """플라스틱병(옆모습). 바닥 가운데 (x, y). fill(높이·얼음 여부), mark(색, 높이)"""

    def __init__(self, x=0.0, y=0.0, w=1.1, h=2.4):
        self.x, self.y, self.w, self.h = x, y, w, h

    def outline(self):
        x, y, w, h = self.x, self.y, self.w, self.h
        body = RoundedRectangle(corner_radius=0.16, width=w, height=h * 0.82, fill_color=WHITE, fill_opacity=0.35,
                                stroke_color=GLASS, stroke_width=5).move_to([x, y + h * 0.41, 0])
        sh = poly([(x - w / 2 + 0.05, y + h * 0.8), (x - w * 0.18, y + h * 0.93), (x + w * 0.18, y + h * 0.93),
                   (x + w / 2 - 0.05, y + h * 0.8)], WHITE, GLASS, 5, 0.35)
        cap = rect(w * 0.42, h * 0.08, "#1C6FA8", x, y + h * 0.97, sw=0, r=0.04)
        return VGroup(body, sh, cap)

    def fill(self, height, ice=False):
        col, st = (ICE, ICE_D) if ice else (WATER, WATER_D)
        m = Rectangle(width=self.w - 0.1, height=max(height, 0.01), fill_color=col, fill_opacity=0.95 if ice else 0.85,
                      stroke_color=st, stroke_width=3 if ice else 0)
        m.move_to([self.x, self.y + 0.05 + height / 2, 0])
        if ice:
            cr = VGroup(*[L((self.x - 0.25 + 0.2 * i, self.y + 0.2 + 0.15 * i), (self.x - 0.05 + 0.2 * i, self.y + 0.35 + 0.18 * i), ICE_D, 3)
                          for i in range(3) if 0.35 + 0.18 * i < height])
            return VGroup(m, cr)
        return m

    def mark(self, height, col, dashed=False):
        ln = Line([self.x - self.w / 2 - 0.12, self.y + 0.05 + height, 0], [self.x + self.w / 2 + 0.12, self.y + 0.05 + height, 0],
                  stroke_color=col, stroke_width=7)
        return DashedVMobject(ln, num_dashes=8) if dashed else ln

    def drops(self, n=10):
        return VGroup(*[Ellipse(width=0.09, height=0.13, fill_color=WATER_L, fill_opacity=1, stroke_color=WATER_D, stroke_width=2)
                        .move_to([self.x + (self.w / 2 + 0.03) * (1 if i % 2 else -1), self.y + 0.3 + i * 0.17, 0]) for i in range(n)])


def big_beaker(w=2.6, h=2.2):
    """넓은 비커(아래 가운데가 (0,0))"""
    gl = VGroup(L((-w / 2, h), (-w / 2, 0), GLASS, 6), L((-w / 2, 0), (w / 2, 0), GLASS, 6), L((w / 2, 0), (w / 2, h), GLASS, 6),
                L((-w / 2, h), (-w / 2 - 0.15, h + 0.12), GLASS, 6))
    return gl


def salt_ice(w=2.6, h=1.8, seed=4, front=False):
    rng = np.random.default_rng(seed + (7 if front else 0))
    g = VGroup()
    for i in range(16 if not front else 9):
        x = rng.uniform(-w / 2 + 0.3, w / 2 - 0.3)
        y = rng.uniform(0.25, h - 0.2) if not front else rng.uniform(0.2, h * 0.6)
        c = ice_cube(rng.uniform(0.17, 0.23), "#F3FBFF").rotate(rng.uniform(-0.4, 0.4)).move_to([x, y, 0])
        g.add(c)
    g.add(*[Dot([rng.uniform(-w / 2 + 0.2, w / 2 - 0.2), rng.uniform(0.15, h - 0.1), 0], radius=0.03, color=WHITE) for _ in range(20)])
    return g


def warm_water(w=2.6, h=1.6):
    m = Rectangle(width=w - 0.1, height=h, fill_color=WARM, fill_opacity=0.55, stroke_width=0).move_to([0, h / 2 + 0.03, 0])
    return m


def steam(n=3, h=0.7, gap=0.4, col="#E07B4F"):
    return vapor(h, n, gap, col=col, sw=4)


def pet_frozen(state=0, s=1.0):
    """냉동실 페트병: state 0 넣은 날(물) · 1 하루 뒤(얼어 부풂) · 2 꺼낸 뒤(녹아 다시 줄어듦)"""
    if state == 1:
        pts = [(-0.5, 1.5), (-0.62, 1.2), (-0.72, 0.6), (-0.74, -0.2), (-0.7, -0.9), (-0.55, -1.1), (0.55, -1.1),
               (0.7, -0.9), (0.74, -0.2), (0.72, 0.6), (0.62, 1.2), (0.5, 1.5)]
        col, st = ICE, ICE_D
    else:
        pts = [(-0.42, 1.5), (-0.52, 1.25), (-0.55, 0.9), (-0.55, -0.95), (-0.45, -1.1), (0.45, -1.1), (0.55, -0.95),
               (0.55, 0.9), (0.52, 1.25), (0.42, 1.5)]
        col, st = (WATER, WATER_D) if state == 0 else ("#9FD6F2", WATER_D)
    body = poly(pts, col, st, 5)
    cap = rect(0.42, 0.25, "#1C6FA8", 0, 1.62, sw=0, r=0.05)
    g = VGroup(body, cap)
    if state == 1:
        g.add(*[Dot([x, y, 0], radius=0.05, color=WHITE) for x, y in ((-0.3, 0.6), (0.2, 0.2), (-0.1, -0.5), (0.35, -0.7))])
    return g.scale(s)


# ══════════════ 2-3 ══════════════
def wet_head(wet=True, s=1.0):
    face = C(0.75, SKIN, 0, 0)
    hair = VGroup(Arc(radius=0.8, start_angle=0.1, angle=PI - 0.2, stroke_color="#3A2A20", stroke_width=26),
                  *[L((x, 0.3), (x * 1.15, -0.65 if wet else -0.35), "#3A2A20", 12) for x in (-0.72, 0.72)])
    eyes = VGroup(Dot([-0.25, 0.08, 0], radius=0.07, color=INK), Dot([0.25, 0.08, 0], radius=0.07, color=INK))
    mouth = Arc(radius=0.22, start_angle=-2.3, angle=1.6, stroke_color=INK, stroke_width=4).move_to([0, -0.3, 0])
    g = VGroup(face, hair, eyes, mouth)
    if wet:
        g.add(*[drop(0.12).move_to([x, y, 0]) for x, y in ((-0.95, -0.4), (0.95, -0.6), (-0.85, -0.85), (0.6, 0.85))])
    return g.scale(s)


def water_paper(k=0.0, w=4.6, h=2.6):
    """물로 쓰는 종이에 그린 그림(하트·별·'참 잘했어요'). k 0 선명 → 1 거의 보이지 않음"""
    paper = rect(w, h, "#F2EFE6", stroke="#A89A80", r=0.12)
    op = max(0.0, 1 - k)
    col = "#2D3E66"
    heart = VMobject(stroke_color=col, stroke_width=12 * (1 - 0.6 * k), stroke_opacity=op)
    tt = np.linspace(0, TAU, 60)
    heart.set_points_smoothly([np.array([0.045 * 16 * np.sin(a) ** 3, 0.045 * (13 * np.cos(a) - 5 * np.cos(2 * a) - 2 * np.cos(3 * a) - np.cos(4 * a)), 0]) for a in tt])
    heart.move_to([-1.2, 0.2, 0])
    star = VMobject(stroke_color=col, stroke_width=10 * (1 - 0.7 * k), stroke_opacity=op * (1 - 0.5 * k))
    sp = [np.array([0.7 * np.cos(PI / 2 + i * 4 * PI / 5), 0.7 * np.sin(PI / 2 + i * 4 * PI / 5), 0]) for i in range(6)]
    star.set_points_as_corners(sp).move_to([1.2, 0.25, 0])
    txt = T("참 잘했어요", 34, col).set_opacity(op * (1 - 0.6 * k)).move_to([0, -0.85, 0])
    return VGroup(paper, heart, star, txt)


class Beaker:
    """눈금 없는 비커(옆모습). 바닥 가운데 (x, y)"""

    def __init__(self, x=0.0, y=0.0, w=1.6, h=2.0):
        self.x, self.y, self.w, self.h = x, y, w, h

    def glass(self):
        x, y, w, h = self.x, self.y, self.w, self.h
        return VGroup(L((x - w / 2, y + h), (x - w / 2, y), GLASS, 6), L((x - w / 2, y), (x + w / 2, y), GLASS, 6),
                      L((x + w / 2, y), (x + w / 2, y + h), GLASS, 6), L((x - w / 2, y + h), (x - w / 2 - 0.13, y + h + 0.1), GLASS, 6))

    def water(self, level, col=WATER, op=0.8, wob=0.0, phase=0.0):
        x, y, w = self.x, self.y, self.w
        top = y + level
        if wob <= 0:
            m = Rectangle(width=w - 0.08, height=max(level, 0.01), fill_color=col, fill_opacity=op, stroke_width=0)
            return m.move_to([x, y + level / 2 + 0.01, 0])
        xs = np.linspace(x - w / 2 + 0.04, x + w / 2 - 0.04, 14)
        pts = [[xx, top + wob * np.sin(xx * 7 + phase) * (0.5 + 0.5 * abs(np.sin(xx * 3 + phase))), 0] for xx in xs]
        pts += [[x + w / 2 - 0.04, y + 0.02, 0], [x - w / 2 + 0.04, y + 0.02, 0]]
        return Polygon(*pts, fill_color=col, fill_opacity=op, stroke_width=0)

    def mark(self, level, col="#111111", dashed=False):
        ln = Line([self.x - self.w / 2 - 0.1, self.y + level, 0], [self.x - self.w / 2 + 0.35, self.y + level, 0],
                  stroke_color=col, stroke_width=7)
        return DashedVMobject(ln, num_dashes=3) if dashed else ln


def bubbles(x0, x1, y0, y1, n=14, seed=1, rmin=0.04, rmax=0.13, col=WHITE):
    rng = np.random.default_rng(seed)
    return VGroup(*[Circle(radius=rng.uniform(rmin, rmax), fill_color=col, fill_opacity=0.7, stroke_color=WATER_D, stroke_width=2)
                    .move_to([rng.uniform(x0, x1), rng.uniform(y0, y1), 0]) for _ in range(n)])


# ══════════════ 2-4 ══════════════
def ice_beaker_wrap(stage=0, w=1.8, h=2.0):
    """얼음이 가득 든 비커(입구에 비닐 랩) + 아래 페트리 접시. 아래 가운데가 (0,0).
    stage 0 처음 · 1 뿌옇게 · 2 물방울이 커짐 · 3 흘러내려 접시에 고임"""
    dish = VGroup(Ellipse(width=w + 1.0, height=0.3, fill_color=WHITE, fill_opacity=0.7, stroke_color=GLASS, stroke_width=4).move_to([0, 0.12, 0]))
    b = Beaker(0, 0.2, w, h)
    ice = VGroup(*[ice_cube(0.2, "#F3FBFF").rotate(0.2 * ((i * 7) % 5 - 2)).move_to([-w / 2 + 0.32 + (i % 4) * (w - 0.6) / 3, 0.45 + (i // 4) * 0.42, 0])
                   for i in range(16)])
    wrap = VGroup(Line([-w / 2 - 0.15, 0.2 + h + 0.02, 0], [w / 2 + 0.15, 0.2 + h + 0.02, 0], stroke_color="#C6CED6", stroke_width=8),
                  Line([-w / 2 - 0.05, 0.2 + h - 0.15, 0], [w / 2 + 0.05, 0.2 + h - 0.15, 0], stroke_color="#C2332C", stroke_width=4))
    g = VGroup(dish, ice, b.glass(), wrap)
    if stage >= 1:
        g.add(Rectangle(width=w, height=h - 0.1, fill_color=WHITE, fill_opacity=0.35 if stage == 1 else 0.2, stroke_width=0).move_to([0, 0.2 + h / 2, 0]))
    if stage >= 2:
        rng = np.random.default_rng(3)
        g.add(*[Circle(radius=rng.uniform(0.05, 0.09), fill_color=WATER_L, fill_opacity=1, stroke_color=WATER_D, stroke_width=2)
                .move_to([rng.uniform(-w / 2 + 0.15, w / 2 - 0.15), rng.uniform(0.45, h), 0]) for _ in range(16)])
    if stage >= 3:
        g.add(*[Line([x, 1.2, 0], [x, 0.28, 0], stroke_color=WATER_D, stroke_width=4) for x in (-w / 2 + 0.3, 0.1, w / 2 - 0.35)])
        g.add(Ellipse(width=w + 0.6, height=0.16, fill_color=WATER, fill_opacity=0.8, stroke_width=0).move_to([0, 0.16, 0]))
    return g


def glasses(fog=False, s=1.0):
    lens = VGroup(*[Circle(radius=0.5, fill_color=WHITE if fog else "#DCEFFA", fill_opacity=0.9 if fog else 0.4,
                           stroke_color=INK, stroke_width=6).move_to([x, 0, 0]) for x in (-0.65, 0.65)])
    bridge = Arc(radius=0.18, start_angle=0.3, angle=PI - 0.6, stroke_color=INK, stroke_width=6).move_to([0, 0.12, 0])
    arms = VGroup(L((-1.15, 0.1), (-1.5, 0.2), INK, 6), L((1.15, 0.1), (1.5, 0.2), INK, 6))
    g = VGroup(arms, lens, bridge)
    if fog:
        g.add(*[Dot([x + dx, dy, 0], radius=0.04, color="#AFC6D4") for x in (-0.65, 0.65)
                for dx, dy in ((-0.2, 0.15), (0.1, 0.25), (0.2, -0.1), (-0.1, -0.25), (0.0, 0.0), (0.25, 0.12))])
    return g.scale(s)


def cold_can(stage=0, s=1.0):
    """차가운 캔: stage 0 그대로 · 1 표면 뿌옇게 · 2 물방울이 커짐 · 3 흘러내려 바닥이 축축"""
    body = rect(1.0, 1.8, "#3F8FD6", 0, 0, stroke=INK, r=0.15)
    top = Ellipse(width=0.9, height=0.18, fill_color="#C6CED6", fill_opacity=1, stroke_color=INK, stroke_width=3).move_to([0, 0.9, 0])
    g = VGroup(body, top)
    if stage == 1:
        g.add(rect(0.92, 1.7, WHITE, 0, 0, sw=0, op=0.45, r=0.12))
    if stage >= 2:
        g.add(*[Circle(radius=0.07 if stage == 2 else 0.09, fill_color=WATER_L, fill_opacity=1, stroke_color=WATER_D, stroke_width=2)
                .move_to([x, y, 0]) for x, y in ((-0.25, 0.5), (0.2, 0.2), (-0.1, -0.2), (0.3, -0.5), (-0.3, -0.6), (0.25, 0.65))])
    if stage == 3:
        g.add(Line([0.3, -0.5, 0], [0.3, -0.88, 0], stroke_color=WATER_D, stroke_width=4),
              Ellipse(width=1.6, height=0.18, fill_color=WATER, fill_opacity=0.7, stroke_width=0).move_to([0, -0.95, 0]))
    return g.scale(s)


# ══════════════ 생활 속 ══════════════
def ice_pop(melt=False):
    bar = rect(0.6, 1.1, "#F39C12", 0, 0.35, sw=3, stroke="#B9690C", r=0.2)
    stick = rect(0.16, 0.6, "#D9B382", 0, -0.45, sw=2, stroke=BROWN_DARK, r=0.05)
    g = VGroup(stick, bar)
    if melt:
        g.add(drop(0.12, "#F5B041").move_to([0.25, -0.45, 0]), Ellipse(width=1.1, height=0.18, fill_color="#F5B041", fill_opacity=1,
                                                                        stroke_width=0).move_to([0, -0.8, 0]))
    return g


def ice_tray():
    tray = rect(2.0, 0.8, "#DFF3FB", stroke="#7AA7BD", r=0.1)
    cells = VGroup(*[ice_cube(0.15).move_to([-0.66 + i * 0.44, 0, 0]) for i in range(4)])
    return VGroup(tray, cells)


def wet_wipe():
    pack = rect(1.8, 0.9, "#9AD0A4", stroke="#3F8F46", r=0.2)
    sheet = poly([(-0.3, 0.4), (0.3, 0.4), (0.4, 0.85), (0.0, 1.0), (-0.35, 0.8)], WHITE, "#C9DBE6", 3)
    return VGroup(pack, sheet, vapor(0.5, 2, 0.3).move_to([0.75, 0.95, 0]))


def laundry():
    line = L((-1.2, 0.8), (1.2, 0.8), INK, 3)
    shirt = poly([(-0.85, 0.8), (-0.35, 0.8), (-0.25, 0.6), (-0.25, -0.2), (-0.95, -0.2), (-0.95, 0.6)], "#F7C6D9", "#C97A9A", 3)
    towel = rect(0.6, 0.9, "#BFE3F5", 0.6, 0.35, stroke="#2F78B8", sw=3)
    return VGroup(line, shirt, towel, vapor(0.5, 2, 0.35).move_to([0.0, 1.25, 0]))


def persimmons():
    rope = L((0, 1.0), (0, -0.9), BROWN_DARK, 4)
    ps = VGroup(*[C(0.2, "#F08A24", 0, y, stroke="#B85F10", sw=3) for y in (0.7, 0.25, -0.2, -0.65)])
    return VGroup(rope, ps)


def mirror(fog=True):
    m = Ellipse(width=1.4, height=1.8, fill_color="#DCEFFA", fill_opacity=1, stroke_color=GLASS, stroke_width=8)
    g = VGroup(m)
    if fog:
        g.add(Ellipse(width=1.2, height=1.6, fill_color=WHITE, fill_opacity=0.55, stroke_width=0))
        g.add(*[Dot([x, y, 0], radius=0.05, color="#8FB8D0") for x, y in ((-0.3, 0.4), (0.2, 0.5), (0.0, 0.0), (-0.35, -0.3), (0.35, -0.2), (0.1, -0.55))])
    return g


def pot_lid():
    pot = rect(1.8, 0.9, "#9AA6B0", 0, -0.3, r=0.1)
    lid = Arc(radius=1.0, start_angle=0.25, angle=PI - 0.5, stroke_color=INK, stroke_width=5).move_to([0, 0.35, 0])
    lid_f = Ellipse(width=2.0, height=0.35, fill_color="#C6CED6", fill_opacity=1, stroke_color=INK, stroke_width=4).move_to([0, 0.2, 0])
    knob = C(0.1, INK, 0, 0.5)
    drops_ = VGroup(*[Ellipse(width=0.08, height=0.12, fill_color=WATER_L, fill_opacity=1, stroke_color=WATER_D, stroke_width=2)
                      .move_to([x, 0.08, 0]) for x in (-0.6, -0.25, 0.1, 0.45)])
    return VGroup(pot, lid_f, knob, drops_)


def dew_grass():
    blades = VGroup(*[smooth([(x, -0.8), (x + 0.1 * d, -0.1), (x + 0.35 * d, 0.6)], "#4E9A3A", 8) for x, d in ((-0.6, 1), (-0.1, -1), (0.4, 1))])
    ds = VGroup(*[Circle(radius=0.08, fill_color=WATER_L, fill_opacity=1, stroke_color=WATER_D, stroke_width=2).move_to([x, y, 0])
                  for x, y in ((-0.47, 0.0), (-0.33, 0.45), (-0.2, 0.1), (0.55, 0.1), (0.7, 0.45))])
    return VGroup(blades, ds)


def window_drops():
    fr = rect(1.6, 1.8, "#DCEFFA", stroke=BROWN_DARK, sw=8)
    cross = VGroup(L((0, 0.9), (0, -0.9), BROWN_DARK, 6))
    ds = VGroup(*[Ellipse(width=0.09, height=0.14, fill_color=WATER_L, fill_opacity=1, stroke_color=WATER_D, stroke_width=2).move_to([x, y, 0])
                  for x, y in ((-0.5, 0.5), (-0.3, 0.1), (-0.55, -0.4), (0.3, 0.6), (0.5, 0.0), (0.35, -0.5), (-0.2, -0.6), (0.2, 0.25))])
    return VGroup(fr, cross, ds)


def dehumidifier():
    body = rect(1.3, 1.9, "#F4F4F4", stroke="#7AA7BD", r=0.15)
    vents = VGroup(*[L((-0.45, y), (0.45, y), "#9AA5AD", 4) for y in (0.7, 0.55, 0.4)])
    tank = rect(1.0, 0.65, WATER, 0, -0.5, stroke=WATER_D, sw=3, r=0.08)
    return VGroup(body, vents, tank)


def snow_maker():
    hill = poly([(-1.2, -0.6), (1.2, -0.6), (1.2, -0.1), (-1.2, 0.3)], WHITE, "#C9DBE6", 3)
    gun = VGroup(rect(0.7, 0.35, "#E2573F", -0.75, 0.75, sw=3, r=0.08), L((-0.75, 0.55), (-0.75, -0.0), INK, 6))
    flakes = VGroup(*[Dot([x, y, 0], radius=0.05, color="#8FB8D0") for x, y in
                      ((-0.2, 0.9), (0.1, 0.75), (0.4, 0.95), (0.25, 0.5), (0.6, 0.65), (0.0, 0.35), (0.8, 0.4))])
    return VGroup(hill, gun, flakes)


def kettle():
    body = Ellipse(width=2.0, height=1.5, fill_color="#C6CED6", fill_opacity=1, stroke_color=INK, stroke_width=4)
    base = rect(1.6, 0.18, "#9AA6B0", 0, -0.7, sw=3)
    spout = poly([(0.75, -0.1), (1.55, 0.65), (1.7, 0.55), (0.95, -0.35)], "#C6CED6", INK, 4)
    handle = Arc(radius=0.55, start_angle=0.2, angle=PI - 0.4, stroke_color=INK, stroke_width=8).move_to([0, 0.95, 0])
    g = VGroup(spout, body, base, handle)
    g.tip = np.array([1.63, 0.62, 0])
    return g


def safety_note(text_markup, w=11.6, size=30):
    """안전 띠(빨간 테두리) — 가열·소금 섞은 얼음 실험의 앱 안전 안내"""
    t = M(f'<span foreground="{RED}">안전</span>  ' + text_markup, size)
    if t.width > w - 0.5:
        t.scale_to_fit_width(w - 0.5)
    box = RoundedRectangle(corner_radius=0.2, width=w, height=t.height + 0.36, fill_color="#FFF1EE", fill_opacity=1,
                           stroke_color=RED, stroke_width=4)
    t.move_to(box)
    return VGroup(box, t)
