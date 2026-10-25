"""4-1 1단원 「자석의 이용」 전용 그림 부품 (s4ep01~05, s4mm01)

자석 극의 색은 4학년 앱(grade4/science/_build_tb/src/u1-*.html)과 같게: N극 빨강 #E2573F, S극 파랑 #3A78C8.
나침반 바늘도 앱처럼 N극(빨간색 부분)·반대쪽(밝은 회색).
함수마다 가운데가 대략 (0,0)인 VGroup을 돌려주고, 크기는 쓰는 쪽에서 fit()·scale()로 맞춤.
"""
import numpy as np
from manim import (DOWN, LEFT, ORIGIN, RIGHT, UP, PI, TAU,
                   Arc, Circle, Dot, Ellipse, Line, Polygon, Rectangle, RoundedRectangle, VGroup, VMobject)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, T, M
from scikit import RED, BROWN, BROWN_DARK
from kit_s3u12 import fit, text_card, ox_mark, bin_box, slots, smooth, E, C, L, poly  # noqa: F401

SW = 4
NC = "#E2573F"      # N극 (앱 색)
SC = "#3A78C8"      # S극 (앱 색)
POLE = {"N": NC, "S": SC}
IRON = "#A9B1BA"
IRON_D = "#5E666F"
WOOD = "#C99560"
WOOD_D = "#8A5A2B"
TIE = "#3FAE5A"     # 빵 끈(앱 색)
PLAST = "#9FE0F7"
PLAST_D = "#3A9FC8"
MAGGRAY = "#9AA6B0"
FOIL = "#D3D9DE"
FOIL_D = "#9AA6B0"
WATER = "#BFE6F7"
WATER_D = "#5FA8CF"


def rect(w, h, fill, x=0, y=0, stroke=INK, sw=SW, op=1.0, r=0.0):
    if r:
        m = RoundedRectangle(corner_radius=r, width=w, height=h, fill_color=fill, fill_opacity=op,
                             stroke_color=stroke, stroke_width=sw)
    else:
        m = Rectangle(width=w, height=h, fill_color=fill, fill_opacity=op, stroke_color=stroke, stroke_width=sw)
    return m.move_to([x, y, 0])


# ══════════════ 자석 ══════════════
def bar_magnet(left="N", w=2.6, h=0.62, label=True, size=None):
    """막대자석: 왼쪽 절반 극 = left. .lp/.rp(왼쪽·오른쪽 끝 점), .left_pole/.right_pole(극 이름)"""
    right = "S" if left == "N" else "N"
    a = rect(w / 2, h, POLE[left], x=-w / 4, sw=3, r=0.06)
    b = rect(w / 2, h, POLE[right], x=w / 4, sw=3, r=0.06)
    g = VGroup(a, b)
    if label:
        fs = size or int(h * 62)
        g.add(T(left, fs, PAPER).move_to(a), T(right, fs, PAPER).move_to(b))
    g.left_pole, g.right_pole = left, right
    return g


def cyl_magnet(w=2.3, h=0.62):
    """둥근기둥 모양 자석(회색, 극 색 없음)"""
    body = rect(w, h, MAGGRAY, stroke=IRON_D, sw=3, r=h * 0.25)
    shine = rect(w * 0.94, h * 0.22, "#C3CCD3", y=h * 0.24, sw=0, r=h * 0.1)
    e1 = Ellipse(width=h * 0.32, height=h, fill_color="#7D8A95", fill_opacity=1, stroke_color=IRON_D,
                 stroke_width=3).move_to([-w / 2, 0, 0])
    e2 = Ellipse(width=h * 0.32, height=h, fill_color="#B3BEC7", fill_opacity=1, stroke_color=IRON_D,
                 stroke_width=3).move_to([w / 2, 0, 0])
    return VGroup(body, shine, e1, e2)


def ring_side(h=1.6):
    """고리 자석(옆에서 본 모습): 앞면이 왼쪽, 뒷면이 오른쪽"""
    w = h * 0.36
    top = rect(w, h * 0.38, "#5D6873", y=h * 0.31, sw=3)
    bot = rect(w, h * 0.38, "#5D6873", y=-h * 0.31, sw=3)
    return VGroup(top, bot)


def ring_flat(w=1.7, h=0.36, col="#5D6873"):
    """끼우개에 끼운 고리 자석(옆에서) — 가운데 구멍 자리"""
    body = rect(w, h, col, sw=3, r=0.08)
    hl = rect(w * 0.94, h * 0.25, "#7D8A95", y=h * 0.3, sw=0)
    return VGroup(body, hl)


def ball_magnet(r=0.6):
    return VGroup(Circle(radius=r, fill_color="#C9D3DA", fill_opacity=1, stroke_color=IRON_D, stroke_width=3),
                  Ellipse(width=r * 0.6, height=r * 0.4, fill_color=PAPER, fill_opacity=0.6, stroke_width=0)
                  .move_to([-r * 0.3, r * 0.35, 0]))


def foil_magnet(w=2.6, h=0.62):
    """알루미늄 포일로 감싼 막대자석"""
    body = rect(w, h, FOIL, stroke=FOIL_D, sw=3, r=0.06)
    crease = smooth([(-w * 0.45, -h * 0.15), (-w * 0.3, h * 0.05), (-w * 0.15, -h * 0.1), (0, h * 0.1),
                     (w * 0.15, -h * 0.05), (w * 0.3, h * 0.12), (w * 0.45, -h * 0.05)], "#EEF2F5", 3)
    return VGroup(body, crease)


def pole_cap(pole, w=0.5, h=0.62):
    """포일을 벗긴 끝(극 색 + 글자)"""
    r_ = rect(w, h, POLE[pole], sw=3, r=0.06)
    return VGroup(r_, T(pole, int(h * 60), PAPER).move_to(r_))


# ══════════════ 빵 끈 ══════════════
def tie(x, y, ang, length=0.32, col=TIE, sw=7):
    dx, dy = np.cos(ang) * length / 2, np.sin(ang) * length / 2
    return Line([x - dx, y - dy, 0], [x + dx, y + dy, 0], stroke_color=col, stroke_width=sw)


def tufts_bar(L_=2.6, H=0.62, n=40, seed=11):
    """막대 모양 자석 양 끝에 붙은 빵 끈 송이(가운데는 없음) — 자석 가운데 (0,0) 기준"""
    rng = np.random.default_rng(seed)
    g = VGroup()
    for i in range(n):
        side = 1 if i % 2 else -1
        r_ = rng.random()
        x = side * (L_ / 2 - r_ * L_ * 0.13) + side * rng.random() * 0.25
        y = (rng.random() - 0.5) * (H + 0.45)
        ang = (rng.random() - 0.5) * 2.2
        g.add(tie(x, y, ang))
    return g


def ties_heap(x0, x1, y0, y1, n=40, seed=3):
    rng = np.random.default_rng(seed)
    return VGroup(*[tie(x0 + rng.random() * (x1 - x0), y0 + rng.random() * (y1 - y0), rng.random() * PI) for _ in range(n)])


def bowl(w=3.6, h=1.0):
    """종이 그릇(옆에서)"""
    return poly([(-w / 2, h / 2), (w / 2, h / 2), (w / 2 - 0.35, -h / 2), (-w / 2 + 0.35, -h / 2)], "#F6EEDC",
                stroke="#B9A57E", sw=4)


# ══════════════ 물체 9가지 (u1-1) ══════════════
def clip(col=IRON_D):
    v = VMobject(stroke_color=col, stroke_width=7)
    v.set_points_smoothly([[-0.55, -0.12, 0], [0.4, -0.12, 0], [0.55, 0.02, 0], [0.4, 0.16, 0], [-0.45, 0.16, 0],
                           [-0.55, 0.06, 0], [-0.45, -0.02, 0], [0.25, -0.02, 0]])
    return VGroup(v)


def plastic_ruler(w=1.8, h=0.42, col=PLAST, edge=PLAST_D, op=0.8):
    body = rect(w, h, col, stroke=edge, sw=3, op=op, r=0.04)
    ticks = VGroup(*[Line([-w / 2 + 0.12 + i * (w - 0.24) / 10, h / 2, 0],
                          [-w / 2 + 0.12 + i * (w - 0.24) / 10, h / 2 - (0.14 if i % 2 == 0 else 0.08), 0],
                          stroke_color=edge, stroke_width=2) for i in range(11)])
    return VGroup(body, ticks)


def iron_ruler():
    return plastic_ruler(col="#CFD8DE", edge="#5B6B78", op=1.0)


def iron_clamp():
    body = poly([(-0.5, 0.1), (0, -0.35), (0.5, 0.1)], "#3E4750", sw=3).shift(UP * 0.0)
    base = rect(1.0, 0.18, "#2C333A", y=0.2, sw=2)
    h1 = Line([-0.3, 0.05, 0], [-0.55, 0.7, 0], stroke_color="#A7B3BC", stroke_width=6)
    h2 = Line([0.3, 0.05, 0], [0.55, 0.7, 0], stroke_color="#A7B3BC", stroke_width=6)
    g = VGroup(h1, h2, base, body)
    return g.rotate(PI, about_point=ORIGIN)


def wood_block():
    return VGroup(rect(1.3, 0.8, WOOD, stroke=WOOD_D, r=0.05),
                  smooth([(-0.55, 0.12), (0, 0.2), (0.55, 0.12)], WOOD_D, 2),
                  smooth([(-0.55, -0.15), (0, -0.08), (0.55, -0.15)], WOOD_D, 2))


def color_paper():
    sq = rect(1.0, 1.0, "#FF8A5C", sw=0).rotate(-0.14)
    fold = poly([(0.18, 0.52), (0.52, 0.18), (0.18, 0.18)], "#FFD0BC", sw=0).rotate(-0.14, about_point=ORIGIN)
    return VGroup(sq, fold)


def bread_tie():
    pts = [[-0.8 + i * 0.1, 0.1 * np.sin(i * 0.8), 0] for i in range(17)]
    a = VMobject(stroke_color=TIE, stroke_width=14)
    a.set_points_smoothly(pts)
    b = VMobject(stroke_color="#9AA6B0", stroke_width=3)
    b.set_points_smoothly(pts)
    return VGroup(a, b)


def balloon(col="#EF6A4C", r=0.42):
    b = Ellipse(width=2 * r, height=2.4 * r, fill_color=col, fill_opacity=1, stroke_color=INK, stroke_width=3)
    knot = poly([(0, -1.2 * r), (0.08, -1.34 * r), (-0.08, -1.34 * r)], col, sw=2)
    shine = Arc(radius=r * 0.6, start_angle=1.9, angle=0.8, stroke_color=PAPER, stroke_width=5)
    return VGroup(b, knot, shine)


def al_can():
    body = rect(0.72, 1.15, "#D6DDE3", stroke="#8A97A3", sw=3, r=0.08)
    band = rect(0.72, 0.38, "#5FB0E8", sw=0)
    top = Ellipse(width=0.72, height=0.16, fill_color="#EEF2F5", fill_opacity=1, stroke_color="#8A97A3",
                  stroke_width=2).move_to([0, 0.575, 0])
    return VGroup(body, band, top)


OBJS = [  # (키, 이름, 자석에 붙나, 그림)
    ("clip", "철 클립", True, clip),
    ("pruler", "플라스틱 자", False, plastic_ruler),
    ("clamp", "철 집게", True, iron_clamp),
    ("wood", "나무토막", False, wood_block),
    ("iruler", "철자", True, iron_ruler),
    ("paper", "색종이", False, color_paper),
    ("tie", "빵 끈", True, bread_tie),
    ("balloon", "고무풍선", False, balloon),
    ("can", "알루미늄 캔", False, al_can),
]


def obj_card(name, pic, w=2.6, h=1.75, size=30):
    box = RoundedRectangle(corner_radius=0.18, width=w, height=h, fill_color=PAPER, fill_opacity=1,
                           stroke_color=SOFT, stroke_width=3)
    p = fit(pic(), w * 0.5, h * 0.48).move_to([0, h * 0.13, 0])
    t = T(name, size).move_to([0, -h * 0.32, 0])
    if t.width > w * 0.9:
        t.scale_to_fit_width(w * 0.9)
    g = VGroup(box, p, t)
    g.box, g.pic, g.label = box, p, t
    return g


# ══════════════ 나침반 ══════════════
def needle(r=0.8, ang=PI / 2):
    """나침반 바늘: 빨간 쪽(N극)이 ang 방향(라디안, 위 = PI/2)"""
    w = r * 0.22
    red = Polygon([0, r, 0], [w, 0, 0], [-w, 0, 0], fill_color=NC, fill_opacity=1, stroke_color=INK, stroke_width=2)
    gry = Polygon([0, -r, 0], [w, 0, 0], [-w, 0, 0], fill_color="#CFD8DE", fill_opacity=1, stroke_color=INK,
                  stroke_width=2)
    g = VGroup(gry, red)
    g.rotate(ang - PI / 2, about_point=ORIGIN)
    return g


def compass(r=1.0, ang=PI / 2, marks=True):
    """나침반: .needle(바늘), .cen(가운데 점). 바늘 돌리기: Rotate(c.needle, d, about_point=c.cen.get_center())"""
    face = Circle(radius=r, fill_color=PAPER, fill_opacity=1, stroke_color="#5B6B78", stroke_width=6)
    g = VGroup(face)
    if marks:
        for k in range(8):
            a = k * TAU / 8
            l = 0.14 if k % 2 == 0 else 0.08
            g.add(Line([(r - 0.05) * np.cos(a), (r - 0.05) * np.sin(a), 0],
                       [(r - 0.05 - l * r) * np.cos(a), (r - 0.05 - l * r) * np.sin(a), 0],
                       stroke_color=SOFT, stroke_width=3))
    nd = needle(r * 0.8, ang)
    cen = Dot(ORIGIN, radius=r * 0.07, color=INK)
    g.add(nd, cen)
    g.needle, g.cen = nd, cen
    return g


def north_arrow(h=0.9):
    a = VGroup(Line([0, -h / 2, 0], [0, h / 2, 0], stroke_color=INK, stroke_width=5),
               Polygon([0, h / 2 + 0.18, 0], [0.13, h / 2 - 0.05, 0], [-0.13, h / 2 - 0.05, 0], fill_color=INK,
                       fill_opacity=1, stroke_width=0))
    t = T("북쪽", 28).next_to(a, UP, buff=0.08)
    return VGroup(a, t)


# ══════════════ 그 밖 ══════════════
def toy_fish(col="#FFB347", w=1.5, face=RIGHT):
    """장난감 물고기: 입(앞)에 철 조각. .mouth"""
    body = Ellipse(width=w, height=w * 0.52, fill_color=col, fill_opacity=1, stroke_color=INK, stroke_width=3)
    tail = poly([(-w * 0.45, 0), (-w * 0.78, w * 0.26), (-w * 0.78, -w * 0.26)], col, sw=3)
    eye = Dot([w * 0.24, w * 0.06, 0], radius=w * 0.045, color=INK)
    mouth = rect(w * 0.16, w * 0.14, "#7D8A95", x=w * 0.52, sw=2)
    g = VGroup(tail, body, eye, mouth)
    g.mouth = mouth
    if face is LEFT or (isinstance(face, np.ndarray) and face[0] < 0):
        g.flip(UP)
    return g


def plate(kind, w=2.6, h=0.12):
    if kind == "plastic":
        return rect(w, h, PLAST, stroke=PLAST_D, sw=2, op=0.85)
    return rect(w, h, "#FFF4D6", stroke="#C9B27A", sw=2)


def stand(h=2.6, base_w=2.4):
    """고리 자석 끼우개: 받침 + 세운 막대"""
    base = rect(base_w, 0.2, "#8A5A2B", sw=2, r=0.04).move_to([0, 0.1, 0])
    pole = rect(0.18, h, "#B98552", sw=2).move_to([0, 0.2 + h / 2, 0])
    return VGroup(pole, base)


def cup_water(w=1.8, h=2.2):
    water = rect(w - 0.12, h * 0.72, WATER, stroke=WATER_D, sw=0, op=0.7).move_to([0, -h * 0.14 + 0.02, 0])
    glass = VMobject(stroke_color="#6FA6C2", stroke_width=5)
    glass.set_points_as_corners([[-w / 2, h / 2, 0], [-w / 2 + 0.08, -h / 2, 0], [w / 2 - 0.08, -h / 2, 0],
                                 [w / 2, h / 2, 0]])
    return VGroup(water, glass)


def toy_car(col="#F2B705"):
    body = rect(1.8, 0.6, col, stroke=INK, sw=3, r=0.12).move_to([0, 0.45, 0])
    cab = rect(0.9, 0.45, col, stroke=INK, sw=3, r=0.1).move_to([0.1, 0.95, 0])
    win = rect(0.6, 0.28, "#CFEAF6", sw=2, r=0.05).move_to([0.1, 0.95, 0])
    w1 = Circle(radius=0.22, fill_color=INK, fill_opacity=1, stroke_width=0).move_to([-0.55, 0.15, 0])
    w2 = w1.copy().move_to([0.55, 0.15, 0])
    return VGroup(body, cab, win, w1, w2)


def bar_magnet_v(bottom="N", h=2.0, w=0.55):
    """세운 막대자석(글자는 똑바로): 아래쪽 극 = bottom"""
    g = bar_magnet(bottom, h, w)
    g.rotate(PI / 2)
    for t in g[2:]:
        t.rotate(-PI / 2)
    return g
