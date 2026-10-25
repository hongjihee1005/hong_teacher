"""5-1 3단원 「용해와 용액」 전용 그림 부품 (s5ep12~15, s5mm03)

모두 직접 그린 단순한 벡터 그림.
  그릇: Glass(kind='beaker'|'jar'|'cup', x, y(바닥), w, h) — .glass() .liquid(level, col, op) .pile(h, col)(바닥에 남은 가루)
        .grains(n, col)(가라앉은 알갱이) .cloudy(n)(뿌연 물) .float_dots(n, col)(물 위에 뜬 가루) .name(글)(앞면 이름표)
        .tilted(mob)(기울이기)
  알갱이: sugar_cube · powder_spoon(약숟가락) · tweezers(핀셋) · tomato · dish(페트리 접시)
  녹는 모습: shimmer(아지랑이) · bits(작은 조각)
  백반 결정: crystals · moru(모루 철끈)
  생활: cotton_candy · sea_scene(일반 바다·사해) · salinometer(디지털 염도계) · bottle(용액 병)
  그 밖: e_scale(scikit) · safety_note(kit_s4u12) · label·text_card·fit·ox_mark·bin_box(kit_s5u11)
"""
import numpy as np
from manim import (DOWN, LEFT, ORIGIN, RIGHT, UP, PI, TAU,
                   Arc, Circle, Dot, Ellipse, Line, Polygon, Rectangle, RoundedRectangle, Square,
                   VGroup, VMobject)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, T, M
from scikit import RED, e_scale  # noqa: F401
from kit_s5u11 import label, text_card, fit, ox_mark, bin_box, rnd, rect  # noqa: F401
from kit_s4u12 import safety_note  # noqa: F401

SW = 4
GLASS = "#7AA7BD"
WATER = "#CFE9F8"
VIT = "#F3D23A"
CAL = "#F2F4F5"
SUGAR = "#FFFFFF"
SUGAR_E = "#C9B48A"
PEPPER = "#3A3028"
BROWN_SUGAR = "#A8641C"
TOMATO = "#E2573F"
LEAF = "#3F8F46"
COLD = "#2F86C6"
WARM = "#C0392B"


def L(a, b, col=INK, sw=SW):
    return Line([a[0], a[1], 0], [b[0], b[1], 0], stroke_color=col, stroke_width=sw)


def mix(a, b, t):
    h = lambda x: [int(x[i:i + 2], 16) for i in (1, 3, 5)]
    A, B = h(a), h(b)
    return "#" + "".join(f"{round(v + (B[i] - v) * t):02x}" for i, v in enumerate(A))


class Glass:
    """옆에서 본 투명 그릇. (x, y)는 바닥 가운데.
    kind: beaker(위 왼쪽에 부리) · jar(뚜껑 있는 유리병) · cup(위가 넓은 컵)"""

    def __init__(self, x=0.0, y=0.0, w=1.8, h=2.2, kind="beaker"):
        self.x, self.y, self.w, self.h, self.kind = x, y, w, h, kind

    def _half(self, yy):
        """높이 yy(바닥에서)에서의 반폭"""
        if self.kind == "cup":
            return self.w / 2 * (0.8 + 0.2 * yy / self.h)
        return self.w / 2

    def glass(self, lid=False):
        x, y, w, h = self.x, self.y, self.w, self.h
        hb, ht = self._half(0), self._half(h)
        r = 0.16
        pts = [[x - ht, y + h, 0], [x - hb, y + r, 0], [x - hb + r, y, 0], [x + hb - r, y, 0], [x + hb, y + r, 0],
               [x + ht, y + h, 0]]
        body = VMobject(stroke_color=GLASS, stroke_width=6)
        body.set_points_as_corners(pts)
        back = Polygon(*pts, fill_color="#F4FBFF", fill_opacity=0.35, stroke_width=0)
        g = VGroup(back, body)
        if self.kind == "beaker":
            g.add(L((x - ht, y + h), (x - ht - 0.14, y + h + 0.1), GLASS, 6))
            # 눈금
            for k in range(1, 4):
                yy = y + h * k / 4.4
                g.add(L((x + ht - 0.32, yy), (x + ht - 0.06, yy), GLASS, 3))
        if self.kind == "jar":
            g.add(RoundedRectangle(corner_radius=0.06, width=w * 0.86, height=0.16, fill_color="#F4FBFF",
                                   fill_opacity=0.5, stroke_color=GLASS, stroke_width=4).move_to([x, y + h + 0.06, 0]))
        if lid:
            g.add(self.lid())
        return g

    def lid(self):
        return RoundedRectangle(corner_radius=0.07, width=self.w * 0.9, height=0.26, fill_color="#5C6B73",
                                fill_opacity=1, stroke_color=INK, stroke_width=3).move_to(
            [self.x, self.y + self.h + 0.2, 0])

    def liquid(self, level, col=WATER, op=0.85):
        x, y = self.x, self.y
        hb, hl = self._half(0) - 0.05, self._half(level) - 0.05
        pts = [[x - hb, y + 0.05, 0], [x + hb, y + 0.05, 0], [x + hl, y + level, 0], [x - hl, y + level, 0]]
        return Polygon(*pts, fill_color=col, fill_opacity=op, stroke_width=0)

    def pile(self, hh=0.25, col=CAL, stroke="#B8BEC2"):
        x, y, hb = self.x, self.y, self._half(0) - 0.08
        xs = np.linspace(-hb, hb, 25)
        top = [[x + xx, y + 0.06 + hh * max(0.0, 1 - (xx / hb) ** 2) ** 0.7, 0] for xx in xs]
        return Polygon(*top, fill_color=col, fill_opacity=1, stroke_color=stroke, stroke_width=3)

    def grains(self, n=14, col=SUGAR, stroke=SUGAR_E, seed=1, r=0.06, square=True, y_span=0.22):
        x, y, hb = self.x, self.y, self._half(0) - 0.15
        g = VGroup()
        for i in range(n):
            px = x - hb + 2 * hb * rnd(i, seed)
            py = y + 0.1 + y_span * rnd(i, seed + 3)
            if square:
                g.add(Square(side_length=2 * r, fill_color=col, fill_opacity=1, stroke_color=stroke,
                             stroke_width=2).move_to([px, py, 0]).rotate(rnd(i, seed + 5)))
            else:
                g.add(Dot([px, py, 0], radius=r, color=col))
        return g

    def cloudy(self, level, n=40, col="#FFFFFF", seed=9, r=0.035):
        x, y, hb = self.x, self.y, self._half(0) - 0.15
        return VGroup(*[Dot([x - hb + 2 * hb * rnd(i, seed), y + 0.15 + (level - 0.3) * rnd(i, seed + 1), 0],
                            radius=r, color=col) for i in range(n)])

    def float_dots(self, level, n=36, col=PEPPER, seed=3, r=0.04):
        x, y, hb = self.x, self.y, self._half(level) - 0.15
        return VGroup(*[Dot([x - hb + 2 * hb * rnd(i, seed), y + level - 0.04 - 0.06 * rnd(i, seed + 1), 0],
                            radius=r * (0.8 + 0.6 * rnd(i, seed + 2)), color=col) for i in range(n)])

    def name(self, text, size=26, col="#B4610F", yy=None):
        t = T(text, size, col)
        box = RoundedRectangle(corner_radius=0.06, width=max(t.width + 0.24, 0.8), height=t.height + 0.2,
                               fill_color=PAPER, fill_opacity=1, stroke_color="#CC99AA", stroke_width=2)
        g = VGroup(box, t)
        t.move_to(box)
        g.move_to([self.x, self.y + (yy if yy is not None else self.h * 0.62), 0])
        if g.width > self.w * 0.92:
            g.scale_to_fit_width(self.w * 0.92)
        return g

    def top(self, dy=0.0):
        return np.array([self.x, self.y + self.h + dy, 0])


def sugar_cube(s=0.5, col=SUGAR):
    sq = Square(side_length=s, fill_color=col, fill_opacity=1, stroke_color=SUGAR_E, stroke_width=3)
    tp = Polygon([-s / 2, s / 2, 0], [-s / 2 + 0.18 * s, s / 2 + 0.18 * s, 0], [s / 2 + 0.18 * s, s / 2 + 0.18 * s, 0],
                 [s / 2, s / 2, 0], fill_color="#FAF6EC", fill_opacity=1, stroke_color=SUGAR_E, stroke_width=3)
    sd = Polygon([s / 2, s / 2, 0], [s / 2 + 0.18 * s, s / 2 + 0.18 * s, 0], [s / 2 + 0.18 * s, -s / 2 + 0.18 * s, 0],
                 [s / 2, -s / 2, 0], fill_color="#EFE7D4", fill_opacity=1, stroke_color=SUGAR_E, stroke_width=3)
    return VGroup(sq, tp, sd)


def powder_spoon(col=SUGAR, s=1.0):
    """약숟가락(가루를 조금 담음), 오른쪽 끝이 손잡이"""
    bowl = Ellipse(width=0.55 * s, height=0.3 * s, fill_color="#D7DDE2", fill_opacity=1, stroke_color=INK,
                   stroke_width=3)
    stem = RoundedRectangle(corner_radius=0.04, width=1.3 * s, height=0.09 * s, fill_color="#D7DDE2", fill_opacity=1,
                            stroke_color=INK, stroke_width=3).next_to(bowl, RIGHT, buff=-0.05)
    heap = Ellipse(width=0.42 * s, height=0.18 * s, fill_color=col, fill_opacity=1, stroke_color="#B8B0A0",
                   stroke_width=2).move_to(bowl.get_center() + UP * 0.05 * s)
    return VGroup(stem, bowl, heap)


def tweezers(s=1.0):
    a = L((0, 0), (1.3 * s, 0.12 * s), "#8C969E", 7)
    b = L((0, 0), (1.3 * s, -0.12 * s), "#8C969E", 7)
    return VGroup(a, b)


def dish(w=1.5, cube=False):
    d = VGroup(Ellipse(width=w, height=0.3, fill_color="#EAF4FA", fill_opacity=0.9, stroke_color=GLASS, stroke_width=4))
    if cube:
        c = sugar_cube(0.38).move_to([0, 0.18, 0])
        d.add(c)
        d.cube = c
    return d


def tomato(r=0.26):
    body = Circle(radius=r, fill_color=TOMATO, fill_opacity=1, stroke_color="#9E2F1F", stroke_width=3)
    shine = Arc(radius=r * 0.6, start_angle=2.0, angle=0.8, stroke_color="#FFB3A3", stroke_width=4)
    cap = VGroup(L((-r * 0.35, r * 0.9), (0, r * 0.75), LEAF, 5), L((r * 0.35, r * 0.9), (0, r * 0.75), LEAF, 5),
                 L((0, r * 0.75), (0, r * 1.15), LEAF, 5))
    return VGroup(body, shine, cap)


def shimmer(x, y0, w=0.9, n=4, gap=0.3, col=GLASS, sw=4):
    g = VGroup()
    for i in range(n):
        m = VMobject(stroke_color=col, stroke_width=sw)
        xs = np.linspace(-w / 2, w / 2, 20)
        yy = y0 + i * gap
        m.set_points_smoothly([[x + xx, yy + 0.07 * np.sin(xx * 7 + i), 0] for xx in xs])
        m.set_stroke(opacity=1 - i * 0.18)
        g.add(m)
    return g


def bits(x, y, w=1.2, n=12, s=0.1, seed=2):
    return VGroup(*[Square(side_length=s * (0.6 + 0.8 * rnd(i, seed + 2)), fill_color=SUGAR, fill_opacity=1,
                           stroke_color=SUGAR_E, stroke_width=2).move_to(
        [x - w / 2 + w * rnd(i, seed), y + 0.12 * rnd(i, seed + 1), 0]) for i in range(n)])


def crystal(s=0.15, col="#FFFFFF"):
    return Polygon([0, s, 0], [s * 0.8, 0, 0], [0, -s, 0], [-s * 0.8, 0, 0], fill_color=col, fill_opacity=1,
                   stroke_color="#9FC9E6", stroke_width=3)


def moru(cx=0.0, cy=0.0, r=0.55):
    """마름모 모양으로 구부린 공예용 철끈(모루) + 매단 실"""
    pts = [[cx, cy + r, 0], [cx + r * 0.75, cy, 0], [cx, cy - r, 0], [cx - r * 0.75, cy, 0]]
    m = Polygon(*pts, fill_opacity=0, stroke_color="#C76BA0", stroke_width=10)
    return m, pts


def cotton_candy(s=1.0):
    stick = L((0, -1.1 * s), (0, 0), "#C9A273", 9)
    fluff = VGroup(*[Circle(radius=(0.32 + 0.12 * rnd(i, 4)) * s, fill_color="#F7B7D2", fill_opacity=1,
                            stroke_width=0).move_to([(-0.4 + 0.8 * rnd(i, 1)) * s, (0.25 + 0.6 * rnd(i, 2)) * s, 0])
                     for i in range(9)])
    return VGroup(stick, fluff)


def bowl_water(w=3.0, h=1.0):
    b = Arc(radius=w / 2, start_angle=PI, angle=PI, stroke_color=GLASS, stroke_width=6)
    b.stretch_to_fit_height(h)
    water = Polygon(*[[w / 2 * 0.95 * np.cos(a), h * 0.95 * np.sin(a), 0] for a in np.linspace(PI, TAU, 24)],
                    fill_color=WATER, fill_opacity=0.9, stroke_width=0)
    g = VGroup(water, b)
    g.top_y = 0.0
    return g


def swimmer(float_high=False, s=1.0, vest=False):
    head = Circle(radius=0.22 * s, fill_color="#FFD9B0", fill_opacity=1, stroke_color=INK, stroke_width=3)
    if float_high:
        body = RoundedRectangle(corner_radius=0.12 * s, width=1.2 * s, height=0.28 * s, fill_color="#FFD9B0",
                                fill_opacity=1, stroke_color=INK, stroke_width=3).next_to(head, RIGHT, buff=0.02)
        suit = RoundedRectangle(corner_radius=0.08 * s, width=0.55 * s, height=0.3 * s, fill_color=TOMATO,
                                fill_opacity=1, stroke_color=INK, stroke_width=3).move_to(body.get_center() + LEFT * 0.15 * s)
        return VGroup(body, suit, head)
    body = RoundedRectangle(corner_radius=0.12 * s, width=0.46 * s, height=0.62 * s,
                            fill_color=ORANGE if vest else "#FFD9B0", fill_opacity=1, stroke_color=INK,
                            stroke_width=3).next_to(head, DOWN, buff=0.02)
    return VGroup(body, head)


def salinometer(val="", s=1.0):
    body = RoundedRectangle(corner_radius=0.12 * s, width=0.9 * s, height=1.7 * s, fill_color="#EDEFF2",
                            fill_opacity=1, stroke_color=INK, stroke_width=4)
    scr = RoundedRectangle(corner_radius=0.05 * s, width=0.66 * s, height=0.42 * s, fill_color="#20323F",
                           fill_opacity=1, stroke_width=0).move_to(body.get_top() + DOWN * 0.42 * s)
    probe = RoundedRectangle(corner_radius=0.04, width=0.16 * s, height=0.8 * s, fill_color="#B9C3CC",
                             fill_opacity=1, stroke_color=INK, stroke_width=3).next_to(body, DOWN, buff=0)
    g = VGroup(probe, body, scr)
    if val:
        g.add(T(val, int(24 * s), "#7CF2A4").move_to(scr))
    return g


def bottle(col="#9FD8C0", text="", tcol=INK, s=1.0):
    body = RoundedRectangle(corner_radius=0.14 * s, width=0.8 * s, height=1.2 * s, fill_color=col, fill_opacity=1,
                            stroke_color=INK, stroke_width=3)
    neck = Rectangle(width=0.32 * s, height=0.22 * s, fill_color=col, fill_opacity=1, stroke_color=INK,
                     stroke_width=3).next_to(body, UP, buff=0)
    cap = Rectangle(width=0.4 * s, height=0.18 * s, fill_color="#5C6B73", fill_opacity=1, stroke_color=INK,
                    stroke_width=3).next_to(neck, UP, buff=0)
    g = VGroup(body, neck, cap)
    if text:
        lb = RoundedRectangle(corner_radius=0.05, width=0.66 * s, height=0.4 * s, fill_color=PAPER, fill_opacity=1,
                              stroke_width=0).move_to(body)
        t = T(text, int(20 * s), tcol).move_to(lb)
        if t.width > 0.6 * s:
            t.scale_to_fit_width(0.6 * s)
        g.add(lb, t)
    return g


def iv_bag(s=1.0):
    bag = RoundedRectangle(corner_radius=0.16 * s, width=0.8 * s, height=1.1 * s, fill_color="#E8F4FB",
                           fill_opacity=1, stroke_color=INK, stroke_width=3)
    liq = Rectangle(width=0.66 * s, height=0.6 * s, fill_color="#BFE3F6", fill_opacity=1, stroke_width=0).move_to(
        bag.get_center() + DOWN * 0.15 * s)
    tube = L((0, -0.55 * s), (0, -1.1 * s), INK, 3)
    return VGroup(bag, liq, tube)


def eye_drop(s=1.0):
    body = RoundedRectangle(corner_radius=0.1 * s, width=0.5 * s, height=0.8 * s, fill_color="#DDEFFB",
                            fill_opacity=1, stroke_color=INK, stroke_width=3)
    tip = Polygon([-0.12 * s, 0.4 * s, 0], [0.12 * s, 0.4 * s, 0], [0, 0.75 * s, 0], fill_color="#FFFFFF",
                  fill_opacity=1, stroke_color=INK, stroke_width=3)
    dropx = VMobject(fill_color="#7FC6EF", fill_opacity=1, stroke_color=INK, stroke_width=2)
    dropx.set_points_smoothly([[0, 1.15 * s, 0], [0.09 * s, 0.95 * s, 0], [0, 0.86 * s, 0], [-0.09 * s, 0.95 * s, 0],
                               [0, 1.15 * s, 0]])
    return VGroup(body, tip, dropx)


def pic_card(pic, name, w=2.6, h=2.3, size=26, stroke=SOFT, col=INK):
    box = RoundedRectangle(corner_radius=0.18, width=w, height=h, fill_color=PAPER, fill_opacity=1,
                           stroke_color=stroke, stroke_width=4)
    fit(pic, w * 0.75, h * 0.55).move_to(box.get_center() + UP * h * 0.12)
    t = T(name, size, col)
    if t.width > w - 0.2:
        t.scale_to_fit_width(w - 0.2)
    t.move_to(box.get_bottom() + UP * 0.38)
    g = VGroup(box, pic, t)
    g.box, g.pic, g.name = box, pic, t
    return g


def word_card(text, w=2.4, h=0.9, col=INK, size=30, fill=PAPER):
    box = RoundedRectangle(corner_radius=0.14, width=w, height=h, fill_color=fill, fill_opacity=1, stroke_color=col,
                           stroke_width=4)
    t = T(text, size, col)
    if t.width > w - 0.2:
        t.scale_to_fit_width(w - 0.2)
    t.move_to(box)
    return VGroup(box, t)


def result_table(head, rows, col_w, row_h=0.72, size=26, head_fill="#EFE8DB"):
    """head: 칸 이름 목록, rows: [[칸 글…], …]  (첫 칸은 줄 이름) — .cells[r][c] 로 글자를 찾음"""
    g = VGroup()
    cells = []
    W = sum(col_w)
    allrows = [head] + rows
    y = 0
    for ri, row in enumerate(allrows):
        x = -W / 2
        rc = []
        for ci, txt in enumerate(row):
            w = col_w[ci]
            fill = head_fill if ri == 0 or ci == 0 else PAPER
            box = Rectangle(width=w, height=row_h, fill_color=fill, fill_opacity=1, stroke_color=SOFT, stroke_width=3)
            box.move_to([x + w / 2, y - row_h / 2, 0])
            t = M(txt, size) if txt else VGroup()
            if txt:
                if t.width > w - 0.16:
                    t.scale_to_fit_width(w - 0.16)
                t.move_to(box)
            g.add(box)
            rc.append(t)
            x += w
        cells.append(rc)
        y -= row_h
    for rc in cells:
        for t in rc:
            g.add(t)
    g.cells = cells
    g.move_to(ORIGIN)
    return g
