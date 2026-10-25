"""5-2 1단원 「혼합물의 분리」 전용 그림 부품 (s5ep22~25, s5mm05)

모두 직접 그린 단순한 벡터 그림(앱 sem2/u1-1~u1-4의 SVG 그림을 본뜸). 따로 적지 않으면 그림 가운데가 (0, 0).
  1-1: recycle_item(페트병·음료 캔·종이 상자·유리병·플라스틱 컵) · recycle_bin · sea_pic · ore_pic · rubber_pic · cane_pic
  1-2: stone(자갈) · sand_dots · gravel · magnifier_zoom · sieve_face(체 눈 크기) · Sieve(옆에서 본 체, 쟁반) ·
       grain(좁쌀·쌀·팥) · grain_bowl · face(마스크) · dust
  1-3: layered(비커 속 물·기름 층, Glass 위에) · dropper(스포이트) · pad(흡착포) · soy_dish(간장 종지)
  1-4: FilterRig(거름 장치: 스탠드·깔때기·거름종이·비커·유리 막대) · cone_paper(고깔 접기) · EvapDish(증발 접시: 물·소금·김·튀는 알갱이) ·
       hot_plate_on(가열판 켜짐) · dish_tongs(증발 접시 집게)
  그 밖: Glass·word_card·result_table·tweezers(kit_s5u13) · safety_note(kit_s4u12) · label·text_card·fit·bin_box·rnd(kit_s5u11)
"""
import numpy as np
from manim import (DOWN, LEFT, ORIGIN, RIGHT, UP, PI, TAU,
                   Arc, Circle, DashedVMobject, Dot, Ellipse, Line, Polygon, Rectangle, RoundedRectangle, Square,
                   VGroup, VMobject)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, T, M
from scikit import RED
from kit_s5u11 import label, text_card, fit, ox_mark, bin_box, rnd, rect  # noqa: F401
from kit_s5u13 import Glass, word_card, result_table, tweezers, pic_card, shimmer  # noqa: F401
from kit_s4u12 import safety_note  # noqa: F401
from kit_s3u22 import P, S, E, L, hot_plate, waves  # noqa: F401

SW = 4
GLASS = "#7AA7BD"
WATER = "#CFE9F8"
WATER_D = "#7FC1E8"
OIL = "#F5C842"
OIL_D = "#C99A12"
SOY = "#5A2E12"
SANDC = ["#C9A06A", "#E1C48A", "#9A8F84", "#555555", "#B07A4A"]
GRAVC = ["#8A7765", "#9A9A9A", "#5A524A", "#A0673A"]
STONE_E = "#3B2F25"
SALT = "#FFFFFF"
SALT_E = "#A9A9A9"
DISH = "#8A8174"
STEEL = "#59636E"


# ══════════════ 1-1 혼합물 ══════════════
def recycle_item(kind, s=1.0):
    if kind == "pet":
        body = P([(-0.24, 0.5), (-0.24, -0.62), (0.24, -0.62), (0.24, 0.5), (0.1, 0.72), (-0.1, 0.72)], "#D6ECFA", "#3D8BD4", 3)
        cap = rect(0.22, 0.14, "#3D8BD4", 0, 0.8, "#3D8BD4", 2)
        lab = rect(0.48, 0.24, "#9CCBEF", 0, 0.0, "#9CCBEF", 0)
        g = VGroup(body, lab, cap)
    elif kind == "can":
        g = VGroup(rect(0.5, 1.2, "#C9D1D9", 0, 0, "#59636E", 3, r=0.08), rect(0.5, 0.38, "#E2573F", 0, 0.05, "#E2573F", 0),
                   E(0.5, 0.1, "#E7ECF0", 0, 0.6, "#59636E", 2))
    elif kind == "box":
        g = VGroup(P([(-0.5, -0.5), (0.5, -0.5), (0.5, 0.25), (-0.5, 0.25)], "#D9A66B", "#8A5A2B", 3),
                   P([(-0.5, 0.25), (-0.36, 0.48), (0.36, 0.48), (0.5, 0.25)], "#E8BD88", "#8A5A2B", 3),
                   L((-0.15, 0.25), (-0.15, -0.05), "#8A5A2B", 2), L((0.15, 0.25), (0.15, -0.05), "#8A5A2B", 2))
    elif kind == "glass":
        g = VGroup(P([(-0.1, 0.8), (-0.1, 0.45), (-0.3, 0.25), (-0.3, -0.62), (0.3, -0.62), (0.3, 0.25), (0.1, 0.45), (0.1, 0.8)],
                     "#9FD8B5", "#2D7D4F", 3, 0.95), rect(0.22, 0.1, "#2D7D4F", 0, 0.84, "#2D7D4F", 0))
    else:  # cup
        g = VGroup(P([(-0.36, 0.5), (0.36, 0.5), (0.26, -0.55), (-0.26, -0.55)], "#EEF6FC", "#3D8BD4", 3),
                   L((-0.4, 0.52), (0.4, 0.52), "#3D8BD4", 5))
    return g.scale(s)


def recycle_bin(name, col, w=2.3):
    body = P([(-w / 2, 0.55), (w / 2, 0.55), (w / 2 - 0.15, -0.75), (-w / 2 + 0.15, -0.75)], col, INK, 3)
    lid = rect(w + 0.14, 0.2, col, 0, 0.66, INK, 3, r=0.06)
    plate = rect(w * 0.7, 0.42, PAPER, 0, 0.0, INK, 0, r=0.08)
    t = T(name, 26, INK).move_to(plate)
    if t.width > w * 0.66:
        t.scale_to_fit_width(w * 0.66)
    return VGroup(body, lid, plate, t)


def sea_pic(w=2.0, h=1.2):
    sky = rect(w, h * 0.45, "#CFE9F8", 0, h * 0.275, "#CFE9F8", 0)
    sun = Circle(radius=h * 0.12, fill_color="#FFD23F", fill_opacity=1, stroke_width=0).move_to([w * 0.3, h * 0.3, 0])
    sea = rect(w, h * 0.55, "#3D8BD4", 0, -h * 0.225, "#3D8BD4", 0)
    wv = VGroup(*[waves(-w / 2, w / 2, -h * (0.05 + 0.14 * i), 0.04, 4, "#CFE9F8", 3) for i in range(3)])
    return VGroup(sky, sun, sea, wv)


def ore_pic():
    rock = P([(-0.7, -0.4), (-0.56, 0.2), (-0.04, 0.38), (0.5, 0.26), (0.76, -0.2), (0.4, -0.44)], "#8F877B", "#5E554A", 3)
    gold = VGroup(*[L((x, y), (x + 0.12, y + dy), "#F2C12E", 9) for x, y, dy in
                    ((-0.4, 0.0, 0.04), (0.1, 0.16, -0.06), (0.3, -0.2, 0.02), (-0.2, -0.24, 0.06), (0.5, 0.02, -0.06))])
    return VGroup(rock, gold)


def rubber_pic():
    trunk = rect(0.4, 1.3, "#9C7A52", 0, 0, "#6B5233", 2)
    cuts = VGroup(*[L((-0.2, y), (0.2, y - 0.12), "#6B5233", 3) for y in (0.3, 0.14, -0.02)])
    drip = S([(0.18, -0.12), (0.26, -0.2), (0.27, -0.32)], None, "#F4F1E8", 5, close=False)
    cup = P([(0.16, -0.32), (0.4, -0.32), (0.37, -0.52), (0.19, -0.52)], "#F4F1E8", "#8A8174", 2)
    leaves = VGroup(S([(-0.9, 0.62), (-0.6, 0.72), (-0.3, 0.62)], None, "#5CB85C", 8, close=False),
                    S([(0.3, 0.6), (0.6, 0.7), (0.9, 0.62)], None, "#5CB85C", 8, close=False))
    return VGroup(leaves, trunk, cuts, drip, cup)


def cane_pic():
    g = VGroup()
    for i, x in enumerate((-0.3, 0.0, 0.3)):
        h = 1.3 - i * 0.08
        g.add(rect(0.13, h, "#7DBB4C", x, -0.6 + h / 2, "#4F7D2C", 2))
        for yy in (-0.3, 0.0, 0.3):
            g.add(L((x - 0.065, yy), (x + 0.065, yy), "#4F7D2C", 3))
        top = -0.6 + h
        g.add(S([(x, top), (x - 0.2, top + 0.12), (x - 0.38, top + 0.0)], None, "#5CB85C", 4, close=False),
              S([(x, top), (x + 0.2, top + 0.12), (x + 0.38, top + 0.02)], None, "#5CB85C", 4, close=False))
    return g


# ══════════════ 1-2 알갱이의 크기 ══════════════
def stone(x, y, r, col, k, sw=None):
    n = 6 + (k % 3)
    pts = []
    for i in range(n):
        a = i / n * TAU
        rr = r * (0.72 + rnd(k, i) * 0.4)
        pts.append((x + np.cos(a) * rr, y + np.sin(a) * rr * 0.82))
    return P(pts, col, STONE_E, sw if sw is not None else max(1.5, r * 12))


def sand_dots(x0, x1, y0, y1, n=120, seed=1, r=0.03):
    return VGroup(*[Dot([x0 + (x1 - x0) * rnd(i, seed), y0 + (y1 - y0) * rnd(i, seed + 1), 0], radius=r,
                        color=SANDC[i % 5]) for i in range(n)])


def gravel(x0, x1, y0, y1, n=12, seed=3, rmin=0.11, rmax=0.17):
    return VGroup(*[stone(x0 + (x1 - x0) * rnd(i, seed), y0 + (y1 - y0) * rnd(i, seed + 1),
                          rmin + (rmax - rmin) * rnd(i, seed + 2), GRAVC[i % 4], i) for i in range(n)])


def magnifier_zoom(content, r=1.25, title=None, size=26):
    """돋보기 원(가운데 0,0) 안에 content(이미 r 안에 맞춘 그림)"""
    glass = Circle(radius=r, fill_color="#FFFFFF", fill_opacity=1, stroke_color="#33414A", stroke_width=9)
    handle = rect(0.3, 0.95, "#8A5A2B", 0, 0, "#5A3A1A", 2, r=0.08).rotate(0.7).move_to(
        [r * 0.95, -r * 0.95 - 0.1, 0])
    g = VGroup(handle, glass, content)
    if title:
        g.add(T(title, size).next_to(glass, UP, buff=0.12))
    return g


def sieve_face(hole, w=2.2):
    """정면에서 본 체: 눈 크기 hole(그림 단위)"""
    frame = rect(w + 0.18, w * 0.62 + 0.18, "#C9D1D9", 0, 0, STEEL, 3, r=0.1)
    mesh = rect(w, w * 0.62, "#FFFFFF", 0, 0, STEEL, 2)
    g = VGroup(frame, mesh)
    step = hole + 0.035
    x = -w / 2
    while x <= w / 2 + 1e-6:
        g.add(L((x, -w * 0.31), (x, w * 0.31), STEEL, 2))
        x += step
    y = -w * 0.31
    while y <= w * 0.31 + 1e-6:
        g.add(L((-w / 2, y), (w / 2, y), STEEL, 2))
        y += step
    return g


class Sieve:
    """옆에서 본 체(가운데 x, 체 바닥 y). w 위 너비"""

    def __init__(self, x=0.0, y=0.0, w=4.4, h=1.0):
        self.x, self.y, self.w, self.h = x, y, w, h

    def body(self):
        x, y, w, h = self.x, self.y, self.w, self.h
        side = VMobject(stroke_color=STEEL, stroke_width=5)
        side.set_points_as_corners([[x - w / 2, y + h, 0], [x - w / 2 + 0.3, y, 0], [x + w / 2 - 0.3, y, 0],
                                    [x + w / 2, y + h, 0]])
        back = P([(x - w / 2, y + h), (x - w / 2 + 0.3, y), (x + w / 2 - 0.3, y), (x + w / 2, y + h)], "#EEF3F6", STEEL, 0, 0.8)
        mesh = DashedVMobject(Line([x - w / 2 + 0.32, y, 0], [x + w / 2 - 0.32, y, 0], stroke_color=STEEL, stroke_width=7),
                              num_dashes=34)
        rim = rect(w + 0.2, 0.16, "#9AA3AD", x, y + h + 0.04, STEEL, 3, r=0.05)
        return VGroup(back, side, mesh, rim)

    def inside(self, n_sand=110, n_grav=13, seed=1, rg=(0.11, 0.17)):
        x, y, w = self.x, self.y, self.w
        s = sand_dots(x - w / 2 + 0.55, x + w / 2 - 0.55, y + 0.06, y + 0.3, n_sand, seed)
        gr = gravel(x - w / 2 + 0.7, x + w / 2 - 0.7, y + 0.2 + rg[0], y + 0.25 + rg[1], n_grav, seed + 4, rg[0], rg[1])
        return s, gr


def tray(x=0.0, y=-2.2, w=5.4):
    return VGroup(rect(w, 0.26, "#9FB6C2", x, y, STEEL, 3, r=0.08))


def grain(kind, x, y, i=0, s=1.0):
    if kind == "z":   # 좁쌀
        return Dot([x, y, 0], radius=0.035 * s, color="#F2C94C")
    if kind == "r":   # 쌀
        return Ellipse(width=0.15 * s, height=0.09 * s, fill_color="#FFFAF0", fill_opacity=1, stroke_color="#C9BFA8",
                       stroke_width=1.5).move_to([x, y, 0]).rotate(rnd(i, 9) * PI)
    return Ellipse(width=0.21 * s, height=0.15 * s, fill_color="#9B2D2D", fill_opacity=1, stroke_color="#5A1414",
                   stroke_width=1.5).move_to([x, y, 0])   # 팥


def grain_bowl(kinds, w=2.4, name=None, size=26, s=1.0):
    """그릇(가운데 0,0, 너비 w)에 담긴 곡식. kinds: 'z' 'r' 'p'의 목록"""
    bowl = S([(-w / 2, 0.15), (-w * 0.35, -0.45), (w * 0.35, -0.45), (w / 2, 0.15)], "#E8D6B8", "#8A6A3A", 3)
    g = VGroup(bowl)
    i = 0
    for k in kinds:
        n = {"z": 46, "r": 24, "p": 14}[k]
        for j in range(n):
            i += 1
            g.add(grain(k, -w * 0.36 + rnd(i, ord(k)) * w * 0.72, -0.25 + rnd(i, 3) * 0.42, i, s))
    if name:
        g.add(T(name, size).next_to(bowl, DOWN, buff=0.15))
    return g


def face(mask=False, s=1.0):
    """왼쪽을 보는 얼굴(옆모습)"""
    head = Circle(radius=1.0, fill_color="#FFD9B0", fill_opacity=1, stroke_color="#C9905A", stroke_width=3)
    eye = Dot([-0.42, 0.25, 0], radius=0.08, color="#333333")
    brow = Arc(radius=0.2, start_angle=0.4 * PI, angle=0.4 * PI, stroke_color="#333333", stroke_width=3).move_to([-0.42, 0.48, 0])
    hair = P([(-0.2, 0.98), (0.6, 0.8), (0.98, 0.2), (0.9, 0.6), (0.4, 1.0)], "#4A3A2A", "#4A3A2A", 1)
    g = VGroup(head, hair, eye, brow)
    if mask:
        mk = RoundedRectangle(corner_radius=0.2, width=0.95, height=0.72, fill_color="#FFFFFF", fill_opacity=1,
                              stroke_color="#9FB6C2", stroke_width=3).move_to([-0.6, -0.38, 0])
        lines = VGroup(*[L((-1.0, y), (-0.2, y), "#CFDDE4", 2) for y in (-0.2, -0.38, -0.56)])
        strap = L((-0.15, -0.2), (0.6, 0.1), "#9FB6C2", 3)
        g.add(strap, mk, lines)
        g.mask = mk
    return g.scale(s)


def dust(n=34, x0=-6.2, x1=-2.0, y0=-1.6, y1=1.4, seed=2):
    return VGroup(*[Dot([x0 + (x1 - x0) * rnd(i, seed), y0 + (y1 - y0) * rnd(i, seed + 1), 0],
                        radius=0.05 + 0.04 * (i % 3), color=["#A0673A", "#C9A06A", "#8A6A3A"][i % 3]).set_opacity(0.85)
                    for i in range(n)])


# ══════════════ 1-3 섞이지 않는 액체 ══════════════
def layered(G, water, oil, bubbles=0.0, seed=1):
    """Glass(비커) 안의 물(아래)·기름(위). 높이는 바닥에서. bubbles>0이면 흔든 직후처럼 뿌연 알갱이"""
    x, y, hb = G.x, G.y, G._half(0) - 0.05
    g = VGroup()
    if bubbles > 0:
        tot = water + oil
        g.add(Polygon([x - hb, y + 0.05, 0], [x + hb, y + 0.05, 0], [x + hb, y + tot, 0], [x - hb, y + tot, 0],
                      fill_color="#E8EECF", fill_opacity=0.95, stroke_width=0))
        g.add(*[Dot([x - hb + 0.1 + (2 * hb - 0.2) * rnd(i, seed), y + 0.12 + (tot - 0.2) * rnd(i, seed + 1), 0],
                    radius=0.04 + 0.05 * rnd(i, seed + 2), color=OIL).set_opacity(bubbles) for i in range(70)])
        return g
    if water > 0:
        g.add(Polygon([x - hb, y + 0.05, 0], [x + hb, y + 0.05, 0], [x + hb, y + water, 0], [x - hb, y + water, 0],
                      fill_color=WATER, fill_opacity=0.9, stroke_width=0))
    if oil > 0:
        g.add(Polygon([x - hb, y + water, 0], [x + hb, y + water, 0], [x + hb, y + water + oil, 0],
                      [x - hb, y + water + oil, 0], fill_color=OIL, fill_opacity=0.92, stroke_width=0))
    return g


def dropper(fill=0.0, col=OIL, h=1.7):
    """스포이트(끝이 (0,0), 위로 섬). fill: 관 속에 든 액체 높이"""
    tube = RoundedRectangle(corner_radius=0.06, width=0.17, height=h, fill_color="#EEF8FD", fill_opacity=1,
                            stroke_color=GLASS, stroke_width=3).move_to([0, h / 2, 0])
    bulb = Ellipse(width=0.34, height=0.62, fill_color="#E2573F", fill_opacity=1, stroke_color="#A0302A",
                   stroke_width=2).move_to([0, h + 0.22, 0])
    g = VGroup(tube)
    if fill > 0:
        g.add(Rectangle(width=0.1, height=fill, fill_color=col, fill_opacity=1, stroke_width=0).move_to([0, 0.04 + fill / 2, 0]))
    g.add(bulb)
    return g


def pad(col="#FFFFFF", w=0.9):
    return rect(w, 0.14, col, 0, 0, OIL_D if col == OIL else "#BBBBBB", 2)


def soy_dish(oil=0.0, w=3.0):
    bowl = S([(-w / 2, 0.2), (-w * 0.3, -0.5), (w * 0.3, -0.5), (w / 2, 0.2)], "#F4F1E8", DISH, 4)
    soy = S([(-w * 0.44, 0.1), (-w * 0.28, -0.4), (w * 0.28, -0.4), (w * 0.44, 0.1)], SOY, SOY, 0)
    g = VGroup(bowl, soy)
    if oil > 0:
        g.add(Ellipse(width=w * 0.86, height=0.08 + 0.1 * oil, fill_color=OIL, fill_opacity=0.95, stroke_width=0).move_to(
            [0, 0.12, 0]))
    return g


# ══════════════ 1-4 거름과 증발 ══════════════
class FilterRig:
    """거름 장치. (cx, top): 깔때기 위 가운데. 스탠드는 왼쪽, 비커는 아래(깔때기 끝의 긴 부분이 비커 왼쪽 옆면에 닿음)"""

    def __init__(self, cx=1.2, top=1.7, floor=-2.35):
        self.cx, self.top, self.floor = cx, top, floor
        self.bk = Glass(cx + 0.6, floor + 0.02, 1.55, 1.75, "beaker")

    def stand(self):
        cx, top, fl = self.cx, self.top, self.floor
        rx = cx - 2.1
        base = rect(1.9, 0.18, STEEL, rx + 0.3, fl + 0.09, INK, 3, r=0.05)
        rod = rect(0.13, top + 0.9 - fl, "#8A96A3", rx, (top + 0.9 + fl) / 2, INK, 2)
        arm = L((rx, top - 0.55), (cx - 0.6, top - 0.55), STEEL, 7)
        ring = Ellipse(width=1.25, height=0.2, stroke_color=STEEL, stroke_width=6).move_to([cx, top - 0.55, 0])
        return VGroup(base, rod, arm, ring)

    def funnel(self):
        cx, t = self.cx, self.top
        bot = self.floor + 1.35       # 깔때기 끝(긴 쪽)
        lft = VMobject(stroke_color=GLASS, stroke_width=5).set_points_as_corners(
            [[cx - 0.95, t, 0], [cx - 0.09, t - 1.05, 0], [cx - 0.09, bot, 0]])
        rgt = VMobject(stroke_color=GLASS, stroke_width=5).set_points_as_corners(
            [[cx + 0.95, t, 0], [cx + 0.09, t - 1.05, 0], [cx + 0.09, bot + 0.18, 0]])
        tip = L((cx - 0.09, bot), (cx + 0.09, bot + 0.18), GLASS, 4)
        back = Polygon([cx - 0.95, t, 0], [cx - 0.09, t - 1.05, 0], [cx + 0.09, t - 1.05, 0], [cx + 0.95, t, 0],
                       fill_color="#F4FBFF", fill_opacity=0.5, stroke_width=0)
        self.tip_pt = np.array([cx - 0.09, bot, 0])
        return VGroup(back, lft, rgt, tip)

    def paper(self):
        cx, t = self.cx, self.top
        cone = Polygon([cx - 0.84, t - 0.04, 0], [cx, t - 0.98, 0], [cx + 0.84, t - 0.04, 0], fill_color="#FFFFFF",
                       fill_opacity=1, stroke_color="#9FB6C2", stroke_width=3)
        fold = L((cx - 0.3, t - 0.04), (cx, t - 0.98), "#C9D4DA", 2)
        return VGroup(cone, fold)

    def liquid_in(self, k=1.0, col=WATER):
        """거름종이 속 액체(k: 0~1 높이)"""
        cx, t = self.cx, self.top
        h = 0.75 * k
        y0 = t - 0.95
        half = 0.84 * (h / 0.94)
        return Polygon([cx, y0, 0], [cx + half, y0 + h, 0], [cx - half, y0 + h, 0], fill_color=col, fill_opacity=0.9,
                       stroke_width=0)

    def residue(self, n=40, seed=6):
        cx, t = self.cx, self.top
        g = VGroup()
        for i in range(n):
            yy = t - 0.92 + 0.32 * rnd(i, seed)
            half = 0.84 * ((yy - (t - 0.98)) / 0.94) * 0.85
            g.add(Dot([cx + (2 * rnd(i, seed + 1) - 1) * half, yy, 0], radius=0.035, color=SANDC[i % 5]))
        return g

    def drip(self, lv):
        p = self.tip_pt
        return L((p[0] + 0.02, p[1]), (p[0] + 0.02, self.bk.y + max(lv, 0.06)), WATER_D, 4)

    def filtrate(self, lv):
        return self.bk.liquid(lv, WATER, 0.9) if lv > 0.02 else VGroup()

    def rod(self):
        cx, t = self.cx, self.top
        a = np.array([cx - 0.32, t - 0.62, 0])
        b = np.array([cx - 1.55, t + 1.0, 0])
        return Line(b, a, stroke_color="#9BB7C6", stroke_width=9)

    def pour_beaker(self, level=0.6, tilt=0.95):
        """유리 막대 위 끝에서 기울인 비커(액체 포함)"""
        cx, t = self.cx, self.top
        G = Glass(0, 0, 1.0, 1.15, "beaker")
        grp = VGroup(G.liquid(level, WATER, 0.9), G.glass())
        grp.rotate(-tilt, about_point=[0.5, 1.15, 0])
        grp.shift(np.array([cx - 1.55, t + 1.0, 0]) - np.array([0.45, 1.15, 0]) + np.array([-0.05, 0.05, 0]))
        return grp

    def stream(self):
        cx, t = self.cx, self.top
        return Line([cx - 1.5, t + 0.93, 0], [cx - 0.3, t - 0.55, 0], stroke_color=WATER_D, stroke_width=5)


def cone_paper(stage=0, r=0.8):
    """거름종이 접기: 0 동그란 종이 · 1 반으로 · 2 다시 반(부채꼴) · 3 고깔"""
    if stage == 0:
        return Circle(radius=r, fill_color="#FFFFFF", fill_opacity=1, stroke_color="#BBBBBB", stroke_width=3)
    if stage in (1, 2):
        ang = PI if stage == 1 else PI / 2
        pts = [[0, 0, 0]] + [[r * np.cos(t), r * np.sin(t), 0] for t in np.linspace(0, ang, 24)]
        return Polygon(*pts, fill_color="#FFFFFF", fill_opacity=1, stroke_color="#BBBBBB", stroke_width=3)
    return VGroup(Polygon([-0.6 * r, 0.5 * r, 0], [0, -0.7 * r, 0], [0.6 * r, 0.5 * r, 0], fill_color="#FFFFFF",
                          fill_opacity=1, stroke_color="#9FB6C2", stroke_width=3),
                  L((-0.2 * r, 0.5 * r), (0, -0.7 * r), "#C9D4DA", 2))


class EvapDish:
    """증발 접시(옆모습). (x, y): 접시 아래 가운데, w 너비"""

    def __init__(self, x=0.0, y=0.0, w=2.6):
        self.x, self.y, self.w = x, y, w

    def body(self):
        x, y, w = self.x, self.y, self.w
        k = w / 2.6
        return S([(x - w / 2, y + 0.62 * k), (x - w * 0.36, y + 0.15 * k), (x, y), (x + w * 0.36, y + 0.15 * k),
                  (x + w / 2, y + 0.62 * k)], "#FFFFFF", DISH, 5, close=False).set_fill("#FFFFFF", 1)

    def water(self, k=1.0):
        """k: 물의 양(1 = 접시 절반쯤)"""
        x, y, w = self.x, self.y, self.w
        if k <= 0.02:
            return VGroup()
        hk = w / 2.6
        top = y + (0.06 + 0.34 * k) * hk
        half = w * (0.18 + 0.2 * k)
        return S([(x - half, top), (x - half * 0.6, y + 0.1 * hk), (x, y + 0.06 * hk), (x + half * 0.6, y + 0.1 * hk), (x + half, top)],
                 WATER, WATER_D, 0, close=True).set_fill(WATER, 0.95)

    def salt(self, n=40, seed=3):
        x, y, w = self.x, self.y, self.w
        g = VGroup()
        for i in range(n):
            u = 2 * rnd(i, seed) - 1
            px = x + u * w * 0.34
            hk = w / 2.6
            py = y + (0.08 + 0.26 * u * u + 0.07 * rnd(i, seed + 1)) * hk
            g.add(Square(side_length=0.04 * hk + 0.03, fill_color=SALT, fill_opacity=1, stroke_color=SALT_E, stroke_width=1.5).move_to(
                [px, py, 0]).rotate(rnd(i, seed + 2)))
        return g

    def steam(self, phase=0.0):
        x, y = self.x, self.y
        g = VGroup()
        for k in range(3):
            m = VMobject(stroke_color="#AEB8C0", stroke_width=5)
            ys = np.linspace(0, 1.0, 14)
            m.set_points_smoothly([[x - 0.6 + 0.6 * k + 0.1 * np.sin(yy * 9 + phase + k), y + 0.8 + yy, 0] for yy in ys])
            g.add(m)
        return g

    def spatter(self, seed=1):
        x, y = self.x, self.y
        return VGroup(*[Square(side_length=0.06, fill_color=SALT, fill_opacity=1, stroke_color="#999999",
                               stroke_width=1.5).move_to([x + 1.6 * np.cos(0.4 + 0.3 * i) * (0.6 + 0.5 * rnd(i, seed)),
                                                          y + 0.8 + 0.9 * rnd(i, seed + 1), 0]) for i in range(9)])


def hot_plate_on(on=False, w=4.6):
    hp = hot_plate(w)
    if on:
        hp.add(Rectangle(width=w - 0.3, height=0.08, fill_color="#E2573F", fill_opacity=1, stroke_width=0).move_to([0, 0.2, 0]))
    t = T("가열판", 22, PAPER).move_to([0, -0.02, 0])
    hp.add(t)
    return hp


def dish_tongs(s=1.0):
    a = L((0, 0), (1.3, 1.25), STEEL, 6)
    b = L((0.16, -0.04), (1.42, 1.2), STEEL, 6)
    return VGroup(a, b).scale(s)
