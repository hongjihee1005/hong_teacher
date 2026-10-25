"""3-2 1단원 「물질의 성질」 전용 그림 부품 (s3ep20~23, s3mm05)

물체·막대·그릇·손 등을 단순한 벡터로 직접 그림. 함수마다 가운데가 대략 (0,0)인 VGroup을 돌려주고,
크기는 쓰는 쪽에서 fit()으로 맞춤. 동물 카드 부품의 fit·text_card·ox_mark·bin_box·slots는 kit_s3u12에서 가져다 씀.
"""
import numpy as np
from manim import (DOWN, LEFT, ORIGIN, RIGHT, UP, PI, TAU,
                   Arc, Circle, Dot, Ellipse, Line, Polygon, Rectangle, RoundedRectangle, VGroup, VMobject)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, T, M
from scikit import RED, BROWN, BROWN_DARK, SKIN
from kit_s3u12 import fit, text_card, ox_mark, bin_box, slots, smooth, E, C, L, poly  # noqa: F401

SW = 4
WOOD = "#D9A86A"
WOOD_D = "#9A6B36"
IRON = "#A9B1BA"
IRON_D = "#5E666F"
GLASS = "#CFEAF6"
GLASS_D = "#6FA6C2"
PLAST = "#F2B705"
PLAST_D = "#B08300"
RUBBER = "#4C4C52"
WATER = "#7EC3EA"
WATER_D = "#3F8EBE"
JUICE = "#F4A623"
TEA = "#D88A2E"
LEMON = "#F3D53B"
PAPERC = "#F3EBDD"
AIR = "#6AA9D6"
SAND = "#EBCF94"

MAT_COL = {"금속": IRON, "나무": WOOD, "플라스틱": PLAST, "유리": GLASS, "고무": RUBBER, "종이": PAPERC}
MAT_EDGE = {"금속": IRON_D, "나무": WOOD_D, "플라스틱": PLAST_D, "유리": GLASS_D, "고무": "#222226", "종이": "#A89A80"}


def rect(w, h, fill, x=0, y=0, stroke=INK, sw=SW, op=1.0, r=0.0):
    if r:
        m = RoundedRectangle(corner_radius=r, width=w, height=h, fill_color=fill, fill_opacity=op,
                             stroke_color=stroke, stroke_width=sw)
    else:
        m = Rectangle(width=w, height=h, fill_color=fill, fill_opacity=op, stroke_color=stroke, stroke_width=sw)
    return m.move_to([x, y, 0])


def mat_tag(mat, size=28):
    """물질 붙임쪽지(물질 색 바탕 + 이름)"""
    t = T(mat, size, PAPER if mat == "고무" else INK)
    b = RoundedRectangle(corner_radius=0.1, width=t.width + 0.34, height=t.height + 0.24, fill_color=MAT_COL[mat],
                         fill_opacity=1, stroke_color=MAT_EDGE[mat], stroke_width=3)
    t.move_to(b)
    return VGroup(b, t)


# ══════════════ 막대 ══════════════
def rod(kind, w=3.0, h=0.55):
    """같은 모양·크기 막대: wood · iron · glass · plastic · rubber"""
    if kind == "wood":
        g = VGroup(rect(w, h, WOOD, stroke=WOOD_D, r=0.06))
        for i in (1, 2, 3):
            y = -h / 2 + h * i / 4
            g.add(smooth([(-w / 2 + 0.15, y), (-w / 6, y + 0.05), (w / 6, y - 0.05), (w / 2 - 0.15, y)], WOOD_D, 2))
    elif kind == "iron":
        g = VGroup(rect(w, h, IRON, stroke=IRON_D, r=0.06),
                   Line([-w / 2 + 0.12, h * 0.22, 0], [w / 2 - 0.12, h * 0.22, 0], stroke_color=PAPER, stroke_width=4))
    elif kind == "glass":
        g = VGroup(rect(w, h, GLASS, stroke=GLASS_D, op=0.35, r=0.06),
                   Line([-w / 2 + 0.2, h * 0.25, 0], [-w / 2 + 0.9, h * 0.25, 0], stroke_color=PAPER, stroke_width=5))
    elif kind == "plastic":
        g = VGroup(rect(w, h, PLAST, stroke=PLAST_D, r=0.06))
    else:
        g = VGroup(rect(w, h, RUBBER, stroke="#222226", r=0.08))
    return g


ROD_NAME = {"wood": "나무", "iron": "철", "glass": "유리", "plastic": "플라스틱", "rubber": "고무"}


def text_paper(w=3.6, h=1.3):
    """글씨가 쓰인 종이"""
    p = rect(w, h, PAPER, stroke=SOFT, sw=3)
    t = T("과학 물질", 40, INK).move_to(p)
    return VGroup(p, t)


def sandpaper(w=1.0, h=0.7):
    p = rect(w, h, "#C9A46B", stroke=BROWN_DARK, sw=3)
    rng = np.random.default_rng(3)
    dots = VGroup(*[Dot([x, y, 0], radius=0.025, color=BROWN_DARK)
                    for x, y in zip(rng.uniform(-w / 2 + 0.08, w / 2 - 0.08, 26), rng.uniform(-h / 2 + 0.08, h / 2 - 0.08, 26))])
    return VGroup(p, dots)


def tank(w=4.2, h=2.4, level=0.6):
    """투명한 수조(아래 가운데가 (0,0)), level: 물 높이 비율"""
    water = Rectangle(width=w - 0.1, height=h * level, fill_color=WATER, fill_opacity=0.55, stroke_width=0)
    water.move_to([0, h * level / 2 + 0.03, 0])
    edge = VMobject(stroke_color=GLASS_D, stroke_width=6)
    edge.set_points_as_corners([[-w / 2, h, 0], [-w / 2, 0, 0], [w / 2, 0, 0], [w / 2, h, 0]])
    g = VGroup(water, edge)
    g.water, g.edge = water, edge
    g.surface_y = lambda: water.get_top()[1]
    return g


def bar_magnet(w=1.6, h=0.45):
    n = rect(w / 2, h, RED, x=-w / 4, stroke=INK, sw=3)
    s = rect(w / 2, h, BLUE, x=w / 4, stroke=INK, sw=3)
    return VGroup(n, s, T("N", 26, PAPER).move_to(n), T("S", 26, PAPER).move_to(s))


# ══════════════ 물체 ══════════════
def fishbowl(wood=False):
    if wood:
        body = rect(2.2, 1.6, WOOD, stroke=WOOD_D, r=0.15)
        grain = VGroup(*[smooth([(-0.95, y), (-0.3, y + 0.06), (0.3, y - 0.06), (0.95, y)], WOOD_D, 2) for y in (-0.4, 0.1, 0.5)])
        return VGroup(body, grain)
    water = Ellipse(width=2.2, height=1.7, fill_color=WATER, fill_opacity=0.45, stroke_color=GLASS_D, stroke_width=5)
    rim = Ellipse(width=1.3, height=0.22, fill_color=GLASS, fill_opacity=0.6, stroke_color=GLASS_D, stroke_width=4).move_to([0, 0.82, 0])
    fish = VGroup(Ellipse(width=0.6, height=0.32, fill_color=ORANGE, fill_opacity=1, stroke_color=INK, stroke_width=3),
                  poly([(0.28, 0), (0.5, 0.16), (0.5, -0.16)], ORANGE, sw=3),
                  Dot([-0.16, 0.04, 0], radius=0.035, color=INK)).move_to([-0.2, -0.1, 0])
    return VGroup(water, fish, rim)


def can():
    body = rect(0.9, 1.25, IRON, stroke=IRON_D, r=0.08)
    top = Ellipse(width=0.9, height=0.2, fill_color="#C8CED4", fill_opacity=1, stroke_color=IRON_D, stroke_width=3).move_to([0, 0.62, 0])
    label = rect(0.9, 0.5, RED, sw=0)
    return VGroup(body, label, top)


def spatula():
    head = Ellipse(width=0.62, height=1.0, fill_color=WOOD, fill_opacity=1, stroke_color=WOOD_D, stroke_width=4).move_to([0, 0.55, 0])
    handle = rect(0.16, 1.3, WOOD, y=-0.55, stroke=WOOD_D, sw=4, r=0.06)
    return VGroup(handle, head)


def blocks():
    a = rect(0.7, 0.5, RED, -0.38, -0.25, r=0.05, sw=3)
    b = rect(0.7, 0.5, BLUE, 0.38, -0.25, r=0.05, sw=3)
    c = rect(0.7, 0.5, PLAST, 0, 0.25, r=0.05, sw=3)
    studs = VGroup(*[rect(0.16, 0.1, PLAST, x, 0.55, sw=2) for x in (-0.15, 0.15)])
    return VGroup(a, b, c, studs)


def ellipse_part(w, h, yl, fill, op=0.8):
    """가운데가 (0,0)인 타원(가로 w, 세로 h)에서 높이 yl 아래 부분(물이 든 모양)"""
    yl = min(max(yl, -h / 2 + 0.01), h / 2 - 0.01)
    t0 = np.arcsin(2 * yl / h)          # 오른쪽 수면 끝 각도
    ts = np.linspace(t0, -PI - t0, 40)
    pts = [[w / 2 * np.cos(t), h / 2 * np.sin(t), 0] for t in ts]
    return Polygon(*pts, fill_color=fill, fill_opacity=op, stroke_width=0)


def glass_teapot(level=0.1):
    """유리 주전자(가운데가 (0,0)). level: 찻물 높이(타원 안 y). .tea .lemon .spout_tip"""
    tea = ellipse_part(1.7, 1.4, level, TEA, 0.8)
    lemon = VGroup(*[VGroup(Circle(radius=0.17, fill_color=LEMON, fill_opacity=1, stroke_color="#B89A10", stroke_width=3),
                            Circle(radius=0.1, fill_color="#FBEA88", fill_opacity=1, stroke_width=0)).move_to([x, y, 0])
                     for x, y in ((-0.35, -0.48), (0.05, -0.52), (0.4, -0.42))])
    body = Ellipse(width=1.7, height=1.4, fill_color=GLASS, fill_opacity=0.25, stroke_color=GLASS_D, stroke_width=5)
    spout = poly([(0.7, -0.1), (1.35, 0.45), (1.42, 0.38), (0.82, -0.32)], GLASS, stroke=GLASS_D, sw=4, op=0.4)
    handle = Arc(radius=0.42, start_angle=PI / 2, angle=PI, stroke_color=GLASS_D, stroke_width=8).move_to([-0.98, 0.0, 0])
    lid = VGroup(Ellipse(width=0.9, height=0.2, fill_color=GLASS, fill_opacity=0.5, stroke_color=GLASS_D, stroke_width=4).move_to([0, 0.68, 0]),
                 Circle(radius=0.08, fill_color=GLASS_D, fill_opacity=1, stroke_width=0).move_to([0, 0.82, 0]))
    g = VGroup(tea, lemon, body, spout, handle, lid)
    g.tea, g.lemon, g.spout_tip = tea, lemon, np.array([1.4, 0.42, 0])
    return g


def hammer():
    head = rect(1.0, 0.4, IRON, y=0.6, stroke=IRON_D, r=0.06)
    handle = rect(0.2, 1.4, WOOD, y=-0.15, stroke=WOOD_D, sw=3, r=0.05)
    return VGroup(handle, head)


def binder_clip(col="#2B2B33"):
    """더블 클립(집게): 검은 몸통 + 은색 손잡이 두 개"""
    body = poly([(-0.5, -0.35), (0.5, -0.35), (0.38, 0.2), (-0.38, 0.2)], col, sw=3)
    mouth = Line([-0.5, -0.35, 0], [0.5, -0.35, 0], stroke_color=IRON, stroke_width=6)
    h1 = VMobject(stroke_color=IRON_D, stroke_width=6)
    h1.set_points_as_corners([[-0.3, 0.15, 0], [-0.55, 0.75, 0], [-0.2, 0.75, 0], [-0.12, 0.15, 0]])
    h2 = h1.copy().flip(UP, about_point=ORIGIN)
    return VGroup(h1, h2, body, mouth)


def paper_clip():
    v = VMobject(stroke_color=IRON_D, stroke_width=6)
    v.set_points_smoothly([[-0.15, -0.5, 0], [-0.15, 0.4, 0], [0.0, 0.55, 0], [0.15, 0.4, 0], [0.15, -0.35, 0],
                           [0.05, -0.45, 0], [-0.05, -0.35, 0], [-0.05, 0.25, 0]])
    return VGroup(v)


def nail():
    head = rect(0.5, 0.1, IRON, y=0.6, stroke=IRON_D, sw=3)
    shaft = poly([(-0.06, 0.55), (0.06, 0.55), (0.06, -0.4), (0, -0.6), (-0.06, -0.4)], IRON, stroke=IRON_D, sw=3)
    return VGroup(shaft, head)


def basket():
    body = poly([(-0.9, 0.45), (0.9, 0.45), (0.7, -0.45), (-0.7, -0.45)], "#57B36B", sw=4)
    holes = VGroup(*[rect(0.18, 0.28, PAPER, x, 0.0, sw=0, r=0.05) for x in (-0.45, -0.15, 0.15, 0.45)])
    rim = rect(1.95, 0.14, "#3E8E50", y=0.48, sw=3, r=0.05)
    return VGroup(body, holes, rim)


def toy_car():
    body = rect(1.5, 0.45, RED, y=0.0, r=0.12, sw=3)
    cab = rect(0.75, 0.38, PLAST, x=-0.1, y=0.38, r=0.1, sw=3)
    wheels = VGroup(C(0.18, INK, -0.45, -0.25, sw=0), C(0.18, INK, 0.45, -0.25, sw=0))
    return VGroup(cab, body, wheels)


def glass_jar(lid=True):
    body = rect(0.95, 1.25, GLASS, stroke=GLASS_D, sw=4, op=0.4, r=0.16)
    g = VGroup(body)
    if lid:
        g.add(rect(0.85, 0.28, IRON, y=0.74, stroke=IRON_D, sw=3, r=0.05))
    return g


def pet_bottle(col="#BFE3F5"):
    body = rect(0.75, 1.3, col, stroke=GLASS_D, sw=4, op=0.55, r=0.2).move_to([0, -0.1, 0])
    neck = poly([(-0.3, 0.55), (0.3, 0.55), (0.14, 0.82), (-0.14, 0.82)], col, stroke=GLASS_D, sw=4, op=0.55)
    cap = rect(0.3, 0.16, BLUE, y=0.9, sw=3)
    label = rect(0.75, 0.32, BLUE, y=-0.15, sw=0, op=0.8)
    return VGroup(body, label, neck, cap)


def milk_bottle():
    body = rect(0.8, 1.2, PAPER, stroke=GLASS_D, sw=4, r=0.18).move_to([0, -0.15, 0])
    neck = rect(0.42, 0.4, PAPER, y=0.62, stroke=GLASS_D, sw=4, r=0.05)
    cap = rect(0.48, 0.1, BLUE, y=0.84, sw=2)
    return VGroup(neck, body, cap)


def paper_box():
    f = rect(1.3, 0.9, "#D5A86C", stroke=BROWN_DARK, sw=4)
    tape = Line([-0.65, 0.2, 0], [0.65, 0.2, 0], stroke_color=BROWN_DARK, stroke_width=3)
    return VGroup(f, tape)


def recycle_bin(title, col, w=2.3, h=1.7):
    box = RoundedRectangle(corner_radius=0.16, width=w, height=h, fill_color=col, fill_opacity=0.18,
                           stroke_color=col, stroke_width=5)
    lid = rect(w + 0.1, 0.22, col, y=h / 2 + 0.05, sw=0, r=0.06)
    t = T(title, 28, INK).move_to([0, h / 2 + 0.38, 0])
    if t.width > w:
        t.scale_to_fit_width(w)
    g = VGroup(box, lid, t)
    g.box, g.title = box, t
    return g


def scissors():
    b1 = poly([(0, 0), (1.15, 0.1), (1.15, 0.0), (0, -0.12)], IRON, stroke=IRON_D, sw=3).rotate(0.12, about_point=ORIGIN)
    b2 = poly([(0, 0), (1.15, -0.1), (1.15, 0.0), (0, 0.12)], IRON, stroke=IRON_D, sw=3).rotate(-0.12, about_point=ORIGIN)
    h1 = Ellipse(width=0.55, height=0.42, fill_color=BLUE, fill_opacity=1, stroke_color=INK, stroke_width=3).move_to([-0.35, 0.25, 0])
    h2 = h1.copy().move_to([-0.35, -0.25, 0])
    hole1 = Ellipse(width=0.28, height=0.2, fill_color=PAPER, fill_opacity=1, stroke_width=0).move_to(h1)
    hole2 = hole1.copy().move_to(h2)
    g = VGroup(b1, b2, h1, h2, hole1, hole2, Dot(ORIGIN, radius=0.05, color=INK))
    g.blade, g.handle = VGroup(b1, b2), VGroup(h1, h2)
    return g


def extinguisher():
    body = rect(0.75, 1.6, RED, y=-0.2, stroke="#8E2A22", sw=4, r=0.3)
    top = rect(0.4, 0.22, IRON, y=0.68, stroke=IRON_D, sw=3)
    lever = Line([0.0, 0.8, 0], [0.55, 0.95, 0], stroke_color=IRON_D, stroke_width=8)
    hose = smooth([(0.2, 0.72), (0.65, 0.5), (0.7, -0.3), (0.55, -0.7)], RUBBER, 9)
    nozzle = rect(0.18, 0.3, PLAST, x=0.55, y=-0.85, sw=3)
    g = VGroup(hose, body, top, lever, nozzle)
    g.parts = dict(body=VGroup(body, top), lever=lever, hose=hose, nozzle=nozzle)
    return g


def window_pic():
    frame = rect(2.0, 1.6, PAPER, stroke=PAPER, sw=0)
    fr = VGroup(rect(2.0, 1.6, "#F6F6F0", stroke="#B9B9B0", sw=6))
    glass = VGroup(rect(0.85, 1.35, GLASS, -0.47, 0, stroke=GLASS_D, sw=3, op=0.7),
                   rect(0.85, 1.35, GLASS, 0.47, 0, stroke=GLASS_D, sw=3, op=0.7))
    g = VGroup(frame, fr, glass)
    g.frame, g.glass = fr, glass
    return g


def desk():
    top = rect(2.2, 0.22, WOOD, y=0.6, stroke=WOOD_D, sw=4)
    legs = VGroup(rect(0.12, 1.1, IRON, -0.9, -0.05, stroke=IRON_D, sw=3), rect(0.12, 1.1, IRON, 0.9, -0.05, stroke=IRON_D, sw=3))
    g = VGroup(legs, top)
    g.top, g.legs = top, legs
    return g


def eraser():
    return VGroup(rect(1.1, 0.5, PAPER, stroke=INK, sw=3, r=0.06), rect(0.5, 0.5, BLUE, x=0.3, sw=3))


def rubber_glove():
    palm = rect(0.9, 0.9, "#F2D23B", y=-0.25, stroke="#A68E10", sw=4, r=0.25)
    fingers = VGroup(*[rect(0.2, 0.55, "#F2D23B", x, 0.35, stroke="#A68E10", sw=3, r=0.09) for x in (-0.33, -0.11, 0.11, 0.33)])
    thumb = rect(0.2, 0.5, "#F2D23B", -0.55, -0.15, stroke="#A68E10", sw=3, r=0.09).rotate(0.6)
    cuff = rect(0.95, 0.35, "#F2D23B", y=-0.85, stroke="#A68E10", sw=4)
    return VGroup(fingers, thumb, palm, cuff)


def rubber_band():
    return VGroup(Ellipse(width=1.2, height=0.75, stroke_color="#C2453B", stroke_width=9))


def slipper():
    sole = Ellipse(width=1.6, height=0.55, fill_color=RUBBER, fill_opacity=1, stroke_color=INK, stroke_width=3)
    strap = Arc(radius=0.4, start_angle=0.2, angle=PI - 0.4, stroke_color=BLUE, stroke_width=14).move_to([0.15, 0.25, 0])
    return VGroup(sole, strap)


def chopsticks(col=WOOD, edge=WOOD_D):
    a = rect(0.1, 1.6, col, -0.08, 0, stroke=edge, sw=2).rotate(0.06)
    b = rect(0.1, 1.6, col, 0.1, 0, stroke=edge, sw=2).rotate(-0.06)
    return VGroup(a, b)


def cutting_board():
    return VGroup(rect(1.6, 1.0, WOOD, stroke=WOOD_D, r=0.18), C(0.07, PAPER, 0.6, 0.3, stroke=WOOD_D, sw=3))


def triangle_ruler():
    o = poly([(-0.8, -0.5), (0.8, -0.5), (-0.8, 0.7)], "#9FD8F0", stroke=GLASS_D, sw=4, op=0.7)
    i = poly([(-0.55, -0.3), (0.2, -0.3), (-0.55, 0.25)], PAPER, stroke=GLASS_D, sw=3)
    return VGroup(o, i)


def pot():
    body = rect(1.5, 0.85, IRON, stroke=IRON_D, r=0.12)
    rim = rect(1.7, 0.14, IRON, y=0.45, stroke=IRON_D, sw=3)
    hs = VGroup(rect(0.3, 0.1, INK, -0.95, 0.25, sw=0), rect(0.3, 0.1, INK, 0.95, 0.25, sw=0))
    return VGroup(body, rim, hs)


def pan():
    body = Ellipse(width=1.4, height=0.45, fill_color=IRON_D, fill_opacity=1, stroke_color=INK, stroke_width=3)
    inner = Ellipse(width=1.15, height=0.3, fill_color=IRON, fill_opacity=1, stroke_width=0).shift(UP * 0.03)
    handle = rect(1.0, 0.13, IRON_D, x=1.15, y=0.05, sw=0, r=0.05)
    return VGroup(handle, body, inner)


# ══════════════ 상태 그림 카드 ══════════════
def soccer_ball():
    b = C(0.6, PAPER, sw=4)
    pent = poly([(0.0, 0.2), (0.19, 0.06), (0.12, -0.16), (-0.12, -0.16), (-0.19, 0.06)], INK, sw=0)
    spots = VGroup(*[poly([(0, 0.1), (0.1, 0.03), (0.06, -0.08), (-0.06, -0.08), (-0.1, 0.03)], INK, sw=0)
                     .move_to([0.45 * np.cos(a), 0.45 * np.sin(a), 0]) for a in np.linspace(PI / 2, PI / 2 + TAU, 5, endpoint=False)])
    return VGroup(b, pent, spots)


def bubble(r=0.6):
    c = Circle(radius=r, fill_color="#D7EEFA", fill_opacity=0.4, stroke_color="#7FB6D8", stroke_width=4)
    shine = Arc(radius=r * 0.7, start_angle=1.9, angle=0.9, stroke_color=PAPER, stroke_width=6)
    tint = Arc(radius=r * 0.82, start_angle=-0.9, angle=1.0, stroke_color="#E8A7D0", stroke_width=4)
    return VGroup(c, shine, tint)


def drink_glass(col=JUICE, level=0.7, w=0.8, h=1.2):
    liq = rect(w - 0.08, h * level, col, y=-h / 2 + h * level / 2 + 0.04, sw=0, op=0.9)
    cup = VMobject(stroke_color=GLASS_D, stroke_width=5)
    cup.set_points_as_corners([[-w / 2, h / 2, 0], [-w / 2 * 0.86, -h / 2, 0], [w / 2 * 0.86, -h / 2, 0], [w / 2, h / 2, 0]])
    return VGroup(liq, cup)


def glasses():
    l1 = Circle(radius=0.32, fill_color=GLASS, fill_opacity=0.5, stroke_color=INK, stroke_width=6).move_to([-0.42, 0, 0])
    l2 = l1.copy().move_to([0.42, 0, 0])
    br = Arc(radius=0.12, start_angle=0.3, angle=PI - 0.6, stroke_color=INK, stroke_width=6).move_to([0, 0.06, 0])
    arms = VGroup(Line([-0.74, 0.05, 0], [-0.95, 0.15, 0], stroke_color=INK, stroke_width=6),
                  Line([0.74, 0.05, 0], [0.95, 0.15, 0], stroke_color=INK, stroke_width=6))
    return VGroup(l1, l2, br, arms)


def balloon(col=RED, r=0.5):
    b = Ellipse(width=2 * r, height=2.4 * r, fill_color=col, fill_opacity=1, stroke_color=INK, stroke_width=3)
    knot = poly([(0, -1.2 * r), (0.08, -1.32 * r), (-0.08, -1.32 * r)], col, sw=2)
    s = smooth([(0, -1.32 * r), (0.08, -1.7 * r), (-0.06, -2.1 * r)], SOFT, 3)
    shine = Arc(radius=r * 0.6, start_angle=1.9, angle=0.8, stroke_color=PAPER, stroke_width=5)
    return VGroup(s, b, knot, shine)


def book():
    c = rect(1.0, 1.3, BLUE, stroke=INK, sw=4, r=0.05)
    sp = rect(0.14, 1.3, "#1C4A9C", x=-0.43, sw=0)
    lab = rect(0.55, 0.2, PAPER, x=0.05, y=0.3, sw=0)
    return VGroup(c, sp, lab)


def honey():
    jar = rect(0.95, 1.0, "#F0B429", stroke="#B07A10", sw=4, r=0.2, op=0.95).move_to([0, -0.15, 0])
    lid = rect(1.0, 0.25, BROWN, y=0.5, stroke=BROWN_DARK, sw=3, r=0.05)
    drip = smooth([(-0.2, 0.37), (-0.25, 0.1), (-0.2, -0.05)], "#F0B429", 10)
    return VGroup(jar, lid, drip)


def wood_block():
    return VGroup(rect(1.0, 0.85, WOOD, stroke=WOOD_D, r=0.05),
                  smooth([(-0.4, 0.1), (0, 0.16), (0.4, 0.1)], WOOD_D, 2), smooth([(-0.4, -0.15), (0, -0.09), (0.4, -0.15)], WOOD_D, 2))


def hand(closed=False, s=1.0):
    """손(위에서 아래로 내미는 손, 손끝이 아래). closed면 주먹"""
    if closed:
        palm = RoundedRectangle(corner_radius=0.25, width=1.0, height=0.8, fill_color=SKIN, fill_opacity=1,
                                stroke_color=INK, stroke_width=4)
        knuck = VGroup(*[Line([x, -0.4, 0], [x, -0.18, 0], stroke_color=INK, stroke_width=3) for x in (-0.22, 0.0, 0.22)])
        arm = rect(0.6, 0.9, SKIN, y=0.8, stroke=INK, sw=4)
        return VGroup(arm, palm, knuck).scale(s)
    palm = RoundedRectangle(corner_radius=0.22, width=1.0, height=0.75, fill_color=SKIN, fill_opacity=1,
                            stroke_color=INK, stroke_width=4)
    fingers = VGroup(*[RoundedRectangle(corner_radius=0.09, width=0.19, height=0.62, fill_color=SKIN, fill_opacity=1,
                                        stroke_color=INK, stroke_width=3).move_to([x, -0.6, 0]) for x in (-0.33, -0.11, 0.11, 0.33)])
    thumb = RoundedRectangle(corner_radius=0.09, width=0.2, height=0.55, fill_color=SKIN, fill_opacity=1,
                             stroke_color=INK, stroke_width=3).rotate(-0.7).move_to([-0.62, -0.25, 0])
    arm = rect(0.6, 0.9, SKIN, y=0.8, stroke=INK, sw=4)
    return VGroup(arm, fingers, thumb, palm).scale(s)


def bowl_water(w=2.6, h=0.9):
    water = poly([(-w / 2 + 0.1, h / 2 - 0.15), (w / 2 - 0.1, h / 2 - 0.15), (w / 2 - 0.35, -h / 2 + 0.06), (-w / 2 + 0.35, -h / 2 + 0.06)],
                 WATER, sw=0, op=0.8)
    b = VMobject(stroke_color=SOFT, stroke_width=5)
    b.set_points_as_corners([[-w / 2, h / 2, 0], [-w / 2 + 0.3, -h / 2, 0], [w / 2 - 0.3, -h / 2, 0], [w / 2, h / 2, 0]])
    return VGroup(water, b)


def air_dots(x0, x1, y0, y1, n=40, seed=1, r=0.05):
    rng = np.random.default_rng(seed)
    return VGroup(*[Dot([x, y, 0], radius=r, color=AIR, fill_opacity=0.7)
                    for x, y in zip(rng.uniform(x0, x1, n), rng.uniform(y0, y1, n))])


def drop(r=0.09):
    return VGroup(Circle(radius=r, fill_color=WATER, fill_opacity=1, stroke_color=WATER_D, stroke_width=2))


# ══════════════ 바닷가 ══════════════
def parasol():
    pole = Line([0, -1.3, 0], [0, 0.65, 0], stroke_color=INK, stroke_width=6)
    top = VGroup()
    xs = np.linspace(-1.3, 1.3, 5)
    for i in range(4):
        top.add(Polygon([0, 0.7, 0], [xs[i], 0.1, 0], [xs[i + 1], 0.1, 0], fill_color=[RED, PAPER][i % 2],
                        fill_opacity=1, stroke_color=INK, stroke_width=3))
    return VGroup(pole, top)


def tube(col="#F27C9B"):
    from manim import Annulus
    a = Annulus(inner_radius=0.22, outer_radius=0.5, fill_color=col, fill_opacity=1, stroke_color=INK, stroke_width=3)
    st = VGroup(*[Line([0.36 * np.cos(t), 0.36 * np.sin(t), 0], [0.36 * np.cos(t + 0.5), 0.36 * np.sin(t + 0.5), 0],
                       stroke_color=PAPER, stroke_width=8) for t in (0.3, 2.4, 4.5)])
    return VGroup(a, st)


def surfboard():
    return VGroup(Ellipse(width=0.55, height=2.0, fill_color="#3FB7C9", fill_opacity=1, stroke_color=INK, stroke_width=3),
                  Line([0, -0.9, 0], [0, 0.9, 0], stroke_color=PAPER, stroke_width=4))


def beach_ball():
    b = C(0.42, PAPER, sw=3)
    from manim import AnnularSector
    secs = VGroup(*[AnnularSector(inner_radius=0, outer_radius=0.42, angle=0.9, start_angle=a, fill_color=c, fill_opacity=1, stroke_width=0)
                    for a, c in ((0.2, RED), (2.3, BLUE), (4.4, PLAST))])
    return VGroup(b, secs, Circle(radius=0.42, stroke_color=INK, stroke_width=3))


def shovel():
    head = poly([(-0.25, 0.0), (0.25, 0.0), (0.18, -0.45), (0, -0.55), (-0.18, -0.45)], BLUE, sw=3)
    handle = rect(0.1, 0.8, PLAST, y=0.4, sw=3)
    return VGroup(handle, head)


# ══════════════ 여러 모양의 그릇 (모양이 다른 용기 ㉮㉯㉰) ══════════════
class Vessel:
    """투명한 용기. wfun(h) = 높이 h에서의 안쪽 폭. 아래 가운데가 (cx, base)."""

    def __init__(self, cx, base, H, wfun, stem=0.0):
        self.cx, self.base, self.H, self.w, self.stem = cx, base, H, wfun, stem

    def y(self, h):
        return self.base + self.stem + h

    def outline(self):
        hs = np.linspace(0, self.H, 40)
        Lp = [[self.cx - self.w(h) / 2 - 0.05, self.y(h), 0] for h in hs]
        Rp = [[self.cx + self.w(h) / 2 + 0.05, self.y(h), 0] for h in hs]
        v = VMobject(stroke_color=GLASS_D, stroke_width=6)
        v.set_points_as_corners(Lp[::-1] + Rp)
        g = VGroup(v)
        if self.stem:
            g.add(Line([self.cx, self.base, 0], [self.cx, self.base + self.stem, 0], stroke_color=GLASS_D, stroke_width=7),
                  Line([self.cx - 0.5, self.base, 0], [self.cx + 0.5, self.base, 0], stroke_color=GLASS_D, stroke_width=7))
        return g

    def level(self, vol):
        a, dh = 0.0, 0.005
        h = 0.0
        while h < self.H:
            a += self.w(h) * dh
            if a >= vol:
                return h
            h += dh
        return self.H

    def liquid(self, vol, col=WATER, op=0.8):
        if vol <= 1e-3:
            return VGroup()
        hl = self.level(vol)
        hs = np.linspace(0, hl, 30)
        Lp = [[self.cx - self.w(h) / 2, self.y(h), 0] for h in hs]
        Rp = [[self.cx + self.w(h) / 2, self.y(h), 0] for h in hs]
        return Polygon(*(Lp + Rp[::-1]), fill_color=col, fill_opacity=op, stroke_width=0)


def three_vessels(xs=(-4.2, 0.0, 4.2), base=-2.2):
    A = Vessel(xs[0], base, 3.0, lambda h: 1.25)
    B = Vessel(xs[1], base, 1.55, lambda h: 0.6 + 2.2 * (h / 1.55), stem=0.45)
    Cc = Vessel(xs[2], base, 2.9, lambda h: 1.0 + 1.25 * np.sin(PI * h / 2.9))
    return [A, B, Cc]


# ══════════════ 공기 실험 ══════════════
def hole_cup(w=1.5, h=1.9, tape_on=True):
    """뒤집은 투명한 컵(입구가 아래, 바닥(위)에 구멍). 가운데가 (0,0).
    .air(컵 안 공기 자리) .tissue(압축 물휴지) .tape .hole_pt"""
    air = Rectangle(width=w - 0.1, height=h - 0.08, fill_color="#F7FBFE", fill_opacity=1, stroke_width=0)
    tissue = rect(0.6, 0.16, PAPER, y=h / 2 - 0.16, stroke=SOFT, sw=3)
    side = VMobject(stroke_color=GLASS_D, stroke_width=6)
    side.set_points_as_corners([[-w / 2, -h / 2, 0], [-w / 2, h / 2, 0], [-0.12, h / 2, 0]])
    side2 = VMobject(stroke_color=GLASS_D, stroke_width=6)
    side2.set_points_as_corners([[0.12, h / 2, 0], [w / 2, h / 2, 0], [w / 2, -h / 2, 0]])
    tape = rect(0.55, 0.16, "#F3E3A0", y=h / 2 + 0.06, stroke="#B9A24A", sw=2, op=0.95)
    g = VGroup(air, tissue, side, side2)
    if tape_on:
        g.add(tape)
    g.air, g.tissue, g.tape, g.hole_pt = air, tissue, tape, np.array([0, h / 2, 0])
    g.cw, g.ch = w, h
    return g


def bike_tire():
    from manim import Annulus
    t = Annulus(inner_radius=0.55, outer_radius=0.85, fill_color=RUBBER, fill_opacity=1, stroke_color=INK, stroke_width=3)
    rim = Circle(radius=0.55, stroke_color=IRON_D, stroke_width=4)
    spokes = VGroup(*[Line(ORIGIN, [0.55 * np.cos(a), 0.55 * np.sin(a), 0], stroke_color=IRON_D, stroke_width=2)
                      for a in np.linspace(0, TAU, 12, endpoint=False)])
    hub = C(0.08, IRON_D, sw=0)
    return VGroup(t, rim, spokes, hub)


def bubble_wrap():
    sheet = rect(1.8, 1.2, "#E4F2FA", stroke=GLASS_D, sw=3, op=0.8)
    bs = VGroup(*[Circle(radius=0.14, fill_color=PAPER, fill_opacity=0.9, stroke_color=GLASS_D, stroke_width=2).move_to([x, y, 0])
                  for x in np.linspace(-0.66, 0.66, 5) for y in np.linspace(-0.4, 0.4, 3)])
    return VGroup(sheet, bs)


def balloon_dog():
    parts = VGroup(
        Ellipse(width=1.0, height=0.36, fill_color=BLUE, fill_opacity=1, stroke_color=INK, stroke_width=3),
        Ellipse(width=0.36, height=0.8, fill_color=BLUE, fill_opacity=1, stroke_color=INK, stroke_width=3).move_to([-0.5, -0.4, 0]),
        Ellipse(width=0.36, height=0.8, fill_color=BLUE, fill_opacity=1, stroke_color=INK, stroke_width=3).move_to([0.5, -0.4, 0]),
        Ellipse(width=0.36, height=0.75, fill_color=BLUE, fill_opacity=1, stroke_color=INK, stroke_width=3).rotate(0.4).move_to([-0.65, 0.35, 0]),
        Ellipse(width=0.55, height=0.32, fill_color=BLUE, fill_opacity=1, stroke_color=INK, stroke_width=3).move_to([-0.95, 0.7, 0]),
        Ellipse(width=0.22, height=0.5, fill_color=BLUE, fill_opacity=1, stroke_color=INK, stroke_width=3).rotate(-0.5).move_to([0.62, 0.25, 0]),
    )
    return parts


def trash_can(col="#57A0D3"):
    body = poly([(-0.55, 0.6), (0.55, 0.6), (0.42, -0.65), (-0.42, -0.65)], col, sw=4)
    lines = VGroup(*[Line([x, 0.45, 0], [x * 0.8, -0.5, 0], stroke_color=INK, stroke_width=2) for x in (-0.25, 0, 0.25)])
    rim = rect(1.25, 0.14, col, y=0.65, sw=3, r=0.05)
    return VGroup(body, lines, rim)


def material_bins(mats, y=-1.2, w=2.55, h=2.3, gap=0.2, size=32):
    """물질별 분류 상자 줄(가운데 맞춤). 상자마다 .box .title, 상자 안 자리 .slot(k)"""
    from kit_s3u12 import bin_box
    n = len(mats)
    x0 = -(n * w + (n - 1) * gap) / 2 + w / 2
    out = VGroup()
    for i, m in enumerate(mats):
        b = bin_box(m, w, h, MAT_EDGE.get(m, INK) if m != "유리" else GLASS_D, size).move_to([x0 + i * (w + gap), y, 0])
        b.box.set_fill(MAT_COL.get(m, PAPER), opacity=0.25)
        out.add(b)
    return out


def juice_bottle():
    """뚜껑을 닫은 주스 병(가운데 (0,0)). .lid .space(빈 곳) .juice"""
    body = rect(1.2, 2.0, GLASS, y=-0.3, stroke=GLASS_D, sw=5, op=0.25, r=0.25)
    juice = rect(1.08, 1.15, JUICE, y=-0.72, sw=0, op=0.9, r=0.18)
    space = rect(1.08, 0.75, PAPER, y=0.25, sw=0, op=0.0)
    neck = rect(0.6, 0.35, GLASS, y=0.85, stroke=GLASS_D, sw=5, op=0.25)
    lid = rect(0.72, 0.3, RED, y=1.15, stroke=INK, sw=3, r=0.06)
    g = VGroup(juice, body, neck, lid, space)
    g.lid, g.space, g.juice = lid, space, juice
    return g


def beach():
    """바닷가 그림(화면 전체). .parts[이름] = 그림, 이름: 바닷물·파라솔·튜브 속 공기·서핑보드·비치볼 속 공기·장난감 삽·음료수·모래"""
    sea = Polygon([-7.2, 1.3, 0], [7.2, 1.3, 0], [7.2, -0.1, 0], [-7.2, 0.3, 0], fill_color=WATER, fill_opacity=0.9,
                  stroke_width=0)
    waves = VGroup(*[smooth([(x, y), (x + 0.3, y + 0.08), (x + 0.6, y)], PAPER, 4) for x, y in
                     ((-5.5, 0.9), (-2.0, 1.0), (1.2, 0.85), (4.2, 0.95), (-3.6, 0.55), (5.6, 0.5))])
    sand = Polygon([-7.2, 0.3, 0], [7.2, -0.1, 0], [7.2, -2.7, 0], [-7.2, -2.7, 0], fill_color=SAND, fill_opacity=1, stroke_width=0)
    dots = VGroup(*[Dot([x, y, 0], radius=0.03, color="#C9A866") for x, y in
                    zip(np.random.default_rng(5).uniform(-7, 7, 40), np.random.default_rng(6).uniform(-2.6, -0.2, 40))])
    par = fit(parasol(), 2.6, 2.6).move_to([-4.6, 0.3, 0])
    tb = fit(tube(), 1.1, 1.1).move_to([2.6, 0.75, 0])
    sb = fit(surfboard(), 0.7, 2.4).rotate(-0.15).move_to([5.6, -0.6, 0])
    bb = fit(beach_ball(), 0.9, 0.9).move_to([-1.2, -1.3, 0])
    sh = fit(shovel(), 0.6, 1.1).rotate(0.4).move_to([1.3, -1.5, 0])
    dk = fit(drink_glass(JUICE, 0.7), 0.55, 0.8).move_to([-3.3, -1.55, 0])
    g = VGroup(sea, waves, sand, dots, par, tb, sb, bb, sh, dk)
    g.parts = {"바닷물": sea, "파라솔": par, "튜브 속 공기": tb, "서핑보드": sb, "비치볼 속 공기": bb,
               "장난감 삽": sh, "음료수": dk, "모래": sand}
    g.spots = {"바닷물": (-0.6, 0.9), "파라솔": (-4.6, 2.0), "튜브 속 공기": (2.6, 1.55), "서핑보드": (5.6, 0.9),
               "비치볼 속 공기": (-1.2, -0.55), "장난감 삽": (1.3, -0.7), "음료수": (-3.3, -0.85), "모래": (3.6, -2.1)}
    return g
