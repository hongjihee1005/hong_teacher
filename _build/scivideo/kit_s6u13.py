"""6-1 3단원 「식물의 구조와 기능」 전용 그림 부품 (s6ep13~19, s6mm03)

모두 직접 그린 단순한 벡터 그림. 생김새·결과(색 변화 등)는 차시 앱(grade6/science/_build_tb/src/u3-1~u3-8.html)의 그림과 글을 따름.
  세포:   microscope(광학 현미경, .pt[부분] 이름표 자리) · cell_view(현미경으로 본 원: 'onion' 양파 / 'leaf' 사철나무잎)
          plant_cell(세포벽·세포막·핵, .wall .mem .nuc .pt) · tower(첨성대) · guard_pair(공변세포 둘 + 기공)
  뿌리:   green_onion(파) · cylinder(눈금실린더, set_level로 물 높이 바꾼 그림) · carrot · sweet_potato · potato
          fibrous_root · tap_root · tree_rooted(뿌리 깊은/얕은 나무)
  줄기:   lily(백합, red 0~1 붉게 물든 정도) · flask(삼각 플라스크) · stem_cross / stem_long(줄기 단면, red)
  잎:     leaf_part(잎몸·잎자루·잎맥, .pt) · foil(알루미늄 포일) · beaker · test_tube · petri(위에서 본 페트리 접시)
          cobalt(염화 코발트 종이) · greenhouse(온실) · balsam(봉선화 + 비닐봉지)
  꽃:     flower_parts(암술·수술·꽃잎·꽃받침, .pt) · small_flower(꽃잎 수·색) · dalmaji_parts(달맞이꽃 분리) · peach_flower · peach
  연결:   herb(애기똥풀처럼 뿌리·줄기·잎·꽃·열매, .pt·.water_paths·.food_paths) · gear · clock_face
  그 밖:  pointer(가리키는 선 + 이름표: 선을 먼저, 이름표를 위에) · steps_row(차례 카드 줄)
"""
import numpy as np
from manim import (DOWN, LEFT, ORIGIN, RIGHT, UP, PI, TAU,
                   Arc, Circle, Dot, Ellipse, Line, Polygon, Rectangle, RoundedRectangle,
                   VGroup, VMobject, interpolate_color, ManimColor)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, T, M
from scikit import RED, BROWN, BROWN_DARK
from kit_s5u11 import label, text_card, fit, ox_mark, bin_box, rnd  # noqa: F401
from kit_s5u13 import word_card, result_table, tweezers, pic_card  # noqa: F401
from kit_s4u12 import safety_note  # noqa: F401
from kit_s3u13 import leaf, tree, sun, small_herb, wind_lines, LEAF_FILL, LEAF_EDGE, STALK  # noqa: F401
from kit_s3u12 import C, E, L, poly, smooth, bee  # noqa: F401
from kit_s6u12 import bird  # noqa: F401
from kit_s6u11 import name_text, arrow_right  # noqa: F401

SW = 4
GLASS = "#7FA7BF"
WATER = "#BFE3F5"
SOIL = "#C9A77A"
SOIL_D = "#9B6B43"
ROOT = "#E6D6A8"
ROOT_D = "#B59A5E"
STEM = "#7FB24D"
STEM_D = "#4E7F2A"
LILY_W = "#FFFFFF"
DYE = "#D23A4A"
FOIL = "#C9CED6"
IODINE = "#2E3A7E"       # 청람색
PALE_LEAF = "#E3E7B8"    # 에탄올로 색소가 빠진 잎
CO_BLUE = "#3E7BD6"      # 푸른색 염화 코발트 종이
CO_RED = "#E46A86"       # 물을 흡수해 붉게 변한 종이
WATER_C = "#3A8FD6"      # 물의 이동(파랑 점)
FOOD_C = "#F2C94C"       # 양분의 이동(노랑 네모)
PURPLE = "#9B6BC4"


def mixc(a, b, t):
    return interpolate_color(ManimColor(a), ManimColor(b), float(t))


def pointer(target, at, text, col=INK, size=28, fill=PAPER):
    """target 점을 가리키는 선 + at 자리에 이름표 (선이 먼저, 이름표가 위)"""
    tg = np.array([target[0], target[1], 0.0])
    lb = label(text, col, size, fill).move_to([at[0], at[1], 0])
    end = lb.get_center()
    ln = Line(end, tg, stroke_color=col, stroke_width=3)
    dot = Dot(tg, radius=0.06, color=col)
    g = VGroup(ln, dot, lb)
    g.line, g.dot, g.lab = ln, dot, lb
    return g


def steps_row(texts, w=3.0, h=1.5, size=26, col=INK, buff=0.45, accent=None):
    """차례 카드 줄(카드 사이 화살표). .cards .arrows"""
    cards = VGroup()
    for s in texts:
        b = RoundedRectangle(corner_radius=0.18, width=w, height=h, fill_color=PAPER, fill_opacity=1,
                             stroke_color=accent or col, stroke_width=4)
        t = name_text(s, size, col)
        if t.width > w - 0.25:
            t.scale_to_fit_width(w - 0.25)
        if t.height > h - 0.2:
            t.scale_to_fit_height(h - 0.2)
        t.move_to(b)
        cards.add(VGroup(b, t))
    cards.arrange(RIGHT, buff=buff)
    arrows = VGroup(*[arrow_right(cards[i].get_right()[0] + 0.06, cards[i + 1].get_left()[0] - 0.06,
                                  cards[i].get_center()[1], accent or col, 6) for i in range(len(texts) - 1)])
    g = VGroup(cards, arrows)
    g.cards, g.arrows = cards, arrows
    return g


# ══════════════ 앱 좌표 → 화면 좌표 ══════════════
class _Map:
    def __init__(self, cx, cy, k):
        self.cx, self.cy, self.k = cx, cy, k

    def __call__(self, x, y):
        return np.array([(x - self.cx) * self.k, (self.cy - y) * self.k, 0.0])

    def rect(self, x, y, w, h, fill, stroke=INK, sw=3, r=0.0, op=1.0):
        k = self.k
        if r:
            m = RoundedRectangle(corner_radius=r * k, width=w * k, height=h * k, fill_color=fill, fill_opacity=op,
                                 stroke_color=stroke, stroke_width=sw)
        else:
            m = Rectangle(width=w * k, height=h * k, fill_color=fill, fill_opacity=op, stroke_color=stroke, stroke_width=sw)
        return m.move_to(self(x + w / 2, y + h / 2))

    def poly(self, pts, fill, stroke=INK, sw=3, op=1.0):
        return Polygon(*[self(x, y) for x, y in pts], fill_color=fill, fill_opacity=op, stroke_color=stroke,
                       stroke_width=sw)

    def smooth_poly(self, pts, fill, stroke=INK, sw=3, op=1.0):
        v = VMobject(fill_color=fill, fill_opacity=op, stroke_color=stroke, stroke_width=sw)
        P = [self(x, y) for x, y in pts]
        v.set_points_smoothly(P + [P[0]])
        return v


# ══════════════ 세포 ══════════════
def microscope(h=5.0):
    """앱 u3-1 현미경 그림을 옮김. .pt: eye rev obj stage dia lamp coarse fine"""
    P = _Map(210, 215, h / 430)
    g = VGroup()
    body, edge = "#E8EEF2", "#5C6B74"
    g.add(P.rect(90, 378, 230, 34, body, edge, 3, r=12))
    g.add(P.smooth_poly([(258, 380), (268, 300), (281, 230), (276, 175), (262, 140), (254, 118), (222, 128),
                         (236, 164), (247, 215), (240, 265), (232, 300), (228, 380)], body, edge, 3))
    g.add(P.poly([(150, 118), (262, 96), (268, 132), (170, 152)], body, edge, 3))
    eye = VGroup(P.poly([(168, 120), (128, 46), (150, 36), (192, 112)], "#CFD8DE", edge, 3))
    cap = P.rect(118, 26, 40, 20, "#3C4950", "#22292E", 2, r=5)
    cap.rotate(np.radians(28), about_point=P(138, 36))
    eye.add(cap)
    g.add(eye)
    rev = Ellipse(width=80 * P.k, height=24 * P.k, fill_color="#B8C4CB", fill_opacity=1, stroke_color=edge,
                  stroke_width=3).move_to(P(178, 160))
    g.add(rev)
    g.add(P.rect(146, 166, 14, 30, "#CFD8DE", edge, 2, r=3), P.rect(172, 168, 14, 42, "#CFD8DE", edge, 2, r=3),
          P.rect(198, 166, 14, 22, "#CFD8DE", edge, 2, r=3), P.rect(172, 200, 14, 5, "#D9443A", "#D9443A", 0))
    g.add(Line(P(180, 340), P(180, 266), stroke_color="#FFE27A", stroke_width=10, stroke_opacity=0.7))
    g.add(P.rect(96, 232, 168, 16, "#3C4950", "#22292E", 2, r=3), P.rect(146, 226, 64, 8, "#D9F0FF", "#5C8FB0", 1.5))
    g.add(P.rect(152, 252, 56, 12, "#7E8B93", "#3F4A50", 2, r=3))
    g.add(P.rect(160, 350, 40, 28, body, edge, 2), Circle(radius=12 * P.k, fill_color="#FFE27A", fill_opacity=1,
                                                          stroke_color="#C99A00", stroke_width=2).move_to(P(180, 352)))
    g.add(Circle(radius=22 * P.k, fill_color=edge, fill_opacity=1, stroke_color="#22292E", stroke_width=2).move_to(P(266, 290)),
          Circle(radius=9 * P.k, fill_color="#9AA7AF", fill_opacity=1, stroke_width=0).move_to(P(266, 290)))
    g.add(Circle(radius=13 * P.k, fill_color="#8C99A1", fill_opacity=1, stroke_color="#22292E", stroke_width=2).move_to(P(272, 338)))
    pts = dict(eye=(143, 60), rev=(212, 160), obj=(158, 188), stage=(110, 240), dia=(160, 258), lamp=(172, 362),
               coarse=(282, 290), fine=(282, 338))
    g.P = P
    g.ptapp = pts

    def pt(k):
        return g[0].get_center() + (P(*pts[k]) - P(205, 395))
    g.pt = pt
    return g


def cell_view(kind="onion", r=1.5, zoom=1.0, nuclei=True):
    """현미경으로 본 둥근 시야. kind 'onion'(양파 표피세포, 핵 염색) / 'leaf'(사철나무잎 표피세포, 공변세포 쌍)"""
    bg_col = "#FBEEF4" if kind == "onion" else "#F6F8F1"
    g = VGroup(Circle(radius=r + 0.08, fill_color="#1D2326", fill_opacity=1, stroke_width=0),
               Circle(radius=r, fill_color=bg_col, fill_opacity=1, stroke_width=0))
    cells = VGroup()
    nucs = VGroup()
    if kind == "onion":
        cw, ch = 0.62 * r / 1.5 / zoom, 0.25 * r / 1.5 / zoom
        rows = int(2 * r / ch) + 2
        for i in range(-rows, rows + 1):
            off = (i % 2) * cw * 0.5
            for j in range(-12, 13):
                x, y = j * cw + off, i * ch
                corners = [(x - cw / 2, y - ch / 2), (x + cw / 2, y - ch / 2), (x + cw / 2, y + ch / 2), (x - cw / 2, y + ch / 2)]
                if max(np.hypot(a, b) for a, b in corners) > r - 0.02:
                    continue
                cells.add(Rectangle(width=cw, height=ch, fill_color="#F6DBE8", fill_opacity=1, stroke_color="#8C3A6B",
                                    stroke_width=2.6).move_to([x, y, 0]))
                if nuclei:
                    dx = (rnd(i, j) - 0.5) * cw * 0.5
                    nucs.add(Ellipse(width=ch * 0.32, height=ch * 0.38, fill_color="#A3245E", fill_opacity=1,
                                     stroke_width=0).move_to([x + dx, y + (rnd(j, i) - 0.5) * ch * 0.25, 0]))
    else:
        gs = 0.32 * r / 1.5 / zoom
        n = int(r / gs) + 2

        def pt(i, j):
            return np.array([i * gs + (rnd(i, j) - 0.5) * gs * 0.5, j * gs + (rnd(j, i + 7) - 0.5) * gs * 0.5, 0])
        for i in range(-n, n):
            for j in range(-n, n):
                qs = [pt(i, j), pt(i + 1, j), pt(i + 1, j + 1), pt(i, j + 1)]
                if max(np.hypot(q[0], q[1]) for q in qs) > r - 0.02:
                    continue
                cells.add(Polygon(*qs, fill_color="#EEF3E6", fill_opacity=1, stroke_color="#6B7A5A", stroke_width=2.2))
        spots = [(-0.6, 0.55), (0.45, 0.7), (-0.1, -0.05), (0.75, -0.35), (-0.75, -0.55), (0.15, -0.85), (0.95, 0.35)]
        for sx, sy in spots:
            gp = guard_pair(gs * 0.62).rotate(rnd(int(sx * 10), int(sy * 10)) * 1.2 - 0.6).move_to([sx * r * 0.72, sy * r * 0.72, 0])
            nucs.add(gp)
    g.add(cells, nucs)
    g.add(Circle(radius=r, stroke_color="#000000", stroke_width=6, fill_opacity=0))
    g.cells, g.nucs = cells, nucs
    return g


def guard_pair(s=0.3, open_=True):
    """강낭콩 모양 세포 두 개가 마주 봄 + 가운데 기공(s = 세포 높이의 절반쯤)"""
    a = Ellipse(width=0.55 * s * 1.2, height=1.4 * s * 1.2, fill_color="#DFE9CF", fill_opacity=1, stroke_color="#4F6140",
                stroke_width=2.4).move_to([-0.3 * s * 1.2, 0, 0])
    b = a.copy().move_to([0.3 * s * 1.2, 0, 0])
    hole = Ellipse(width=0.16 * s * 1.2 if open_ else 0.04 * s, height=0.9 * s * 1.2, fill_color="#55634A",
                   fill_opacity=1, stroke_width=0)
    g = VGroup(a, b, hole)
    g.hole = hole
    return g


def plant_cell(h=3.6):
    """앱 u3-1 '세포 구조' 그림. .wall .mem .nuc / .pt('wall'|'mem'|'nuc')"""
    P = _Map(205, 151, h / 230)
    wall = P.poly([(60, 50), (330, 40), (350, 250), (70, 262)], "#CFE6A8", "#5C8A2E", 16)
    mem = P.poly([(74, 62), (320, 54), (337, 238), (83, 249)], "#EAF6D8", "#E08A2E", 5)
    nuc = Ellipse(width=64 * P.k, height=52 * P.k, fill_color="#B78AD6", fill_opacity=1, stroke_color="#6A3D8F",
                  stroke_width=3).move_to(P(170, 150))
    g = VGroup(wall, mem, nuc)
    g.wall, g.mem, g.nuc = wall, mem, nuc
    pts = dict(wall=(347, 215), mem=(327, 130), nuc=(185, 140))
    c0 = wall.get_center().copy()

    def pt(k):
        return wall.get_center() + (P(*pts[k]) - c0)
    g.pt = pt
    return g


def tower(h=3.2):
    """첨성대: 작은 돌을 차곡차곡 쌓은 모습. 바닥 가운데 = (0,0)"""
    g = VGroup()
    s = h / 3.2
    g.add(Rectangle(width=2.3 * s, height=0.22 * s, fill_color="#C9B79A", fill_opacity=1, stroke_color="#8A7656",
                    stroke_width=2).move_to([0, 0.11 * s, 0]))
    N = 16
    y0, y1 = 0.22 * s, 2.85 * s
    hh = (y1 - y0) / N
    for i in range(N):
        f = i / (N - 1)
        r = (0.95 - 0.42 * f ** 1.2) * s
        y = y0 + i * hh
        g.add(Rectangle(width=2 * r, height=hh, fill_color="#DCCBA8" if i % 2 else "#D3BF96", fill_opacity=1,
                        stroke_color="#8A7656", stroke_width=1.6).move_to([0, y + hh / 2, 0]))
        n = max(4, int(round(r / 0.17)))
        w = 2 * r / n
        for j in range(1, n):
            x = -r + j * w - (w / 2 if i % 2 else 0)
            if -r + 0.03 < x < r - 0.03:
                g.add(Line([x, y, 0], [x, y + hh, 0], stroke_color="#8A7656", stroke_width=1.6))
    g.add(Rectangle(width=0.42 * s, height=0.4 * s, fill_color="#4A3D2C", fill_opacity=1, stroke_width=0).move_to([0, 1.55 * s, 0]))
    g.add(Rectangle(width=1.3 * s, height=0.2 * s, fill_color="#C9B79A", fill_opacity=1, stroke_color="#8A7656",
                    stroke_width=2).move_to([0, y1 + 0.1 * s, 0]))
    g.add(Rectangle(width=1.0 * s, height=0.18 * s, fill_color="#D4C3A4", fill_opacity=1, stroke_color="#8A7656",
                    stroke_width=2).move_to([0, y1 + 0.29 * s, 0]))
    return g


# ══════════════ 뿌리 ══════════════
def green_onion(h=3.0, root=True, cut_leaf=True, n_root=11, seed=2):
    """파: 흰 줄기(가운데 x=0) + 잘린 잎(cut_leaf) + 수염처럼 난 뿌리. 뿌리 시작(줄기 아래 끝) = (0,0)"""
    s = h / 3.0
    g = VGroup()
    stalk = RoundedRectangle(corner_radius=0.1 * s, width=0.32 * s, height=1.5 * s, fill_color="#F7F7EC", fill_opacity=1,
                             stroke_color="#A8A88A", stroke_width=3).move_to([0, 0.75 * s, 0])
    green = Rectangle(width=0.32 * s, height=0.35 * s, fill_color="#9CCB6A", fill_opacity=1, stroke_color="#5A8A2E",
                      stroke_width=3).move_to([0, 1.5 * s + 0.17 * s, 0])
    g.add(stalk, green)
    if not cut_leaf:
        for dx, ln in ((-0.08, 1.4), (0.07, 1.2)):
            g.add(Line([dx * s, 1.85 * s, 0], [dx * s * 3, (1.85 + ln) * s, 0], stroke_color="#6DAA3A", stroke_width=12 * s))
    roots = VGroup()
    if root:
        rng = np.random.default_rng(seed)
        for i in range(n_root):
            f = (i / (n_root - 1)) - 0.5
            x0 = f * 0.24 * s
            x1 = f * 1.5 * s + rng.uniform(-0.1, 0.1) * s
            y1 = -(1.15 + rng.uniform(0, 0.35)) * s
            roots.add(smooth([(x0, 0.02), (x0 + (x1 - x0) * 0.35, y1 * 0.4), (x1, y1)], ROOT_D, 3))
    g.add(roots)
    g.roots, g.stalk = roots, stalk
    return g


class Cylinder:
    """눈금실린더: 바닥 가운데 = (x, y). level 0~1(물 높이). .group, .water, .water_at(level)"""

    def __init__(self, x=0.0, y=-2.0, h=3.0, w=0.9, level=0.75):
        self.x, self.y, self.h, self.w = x, y, h, w
        foot = Polygon([x - w * 0.9, y, 0], [x + w * 0.9, y, 0], [x + w * 0.55, y + 0.18, 0], [x - w * 0.55, y + 0.18, 0],
                       fill_color="#DDE8EE", fill_opacity=1, stroke_color=GLASS, stroke_width=3)
        tube = VMobject(stroke_color=GLASS, stroke_width=4)
        tube.set_points_as_corners([[x - w / 2, y + h, 0], [x - w / 2, y + 0.18, 0], [x + w / 2, y + 0.18, 0], [x + w / 2, y + h, 0]])
        ticks = VGroup()
        for i in range(1, 10):
            yy = y + 0.18 + i * (h - 0.3) / 10
            ticks.add(Line([x + w / 2 - (0.22 if i % 5 == 0 else 0.12), yy, 0], [x + w / 2, yy, 0], stroke_color=GLASS, stroke_width=2))
        self.base = y + 0.2
        self.top = y + h - 0.12
        self.water = self.water_at(level)
        self.group = VGroup(self.water, foot, tube, ticks)
        self.level = level

    def y_of(self, level):
        return self.base + (self.top - self.base) * level

    def water_at(self, level):
        hh = max(self.y_of(level) - self.base, 0.01)
        return Rectangle(width=self.w - 0.08, height=hh, fill_color=WATER, fill_opacity=0.85, stroke_width=0).move_to(
            [self.x, self.base + hh / 2, 0])

    def mark(self, level, col=ORANGE):
        y = self.y_of(level)
        return Line([self.x - self.w / 2 - 0.12, y, 0], [self.x + self.w / 2 + 0.12, y, 0], stroke_color=col, stroke_width=6)


def cotton(w=0.8):
    g = VGroup()
    for dx, dy, r in ((-0.22, 0, 0.17), (0, 0.04, 0.2), (0.22, 0, 0.17), (0.1, -0.08, 0.15), (-0.1, -0.08, 0.15)):
        g.add(Circle(radius=r * w / 0.8, fill_color="#FFFFFF", fill_opacity=1, stroke_color="#C9C9C9", stroke_width=2).move_to([dx * w / 0.8, dy * w / 0.8, 0]))
    return g


def carrot(h=2.4):
    """당근(뿌리). 위 끝 가운데 = (0,0)"""
    s = h / 2.4
    body = Polygon([-0.36 * s, 0, 0], [0.36 * s, 0, 0], [0.05 * s, -2.2 * s, 0], [-0.03 * s, -2.2 * s, 0],
                   fill_color="#F08A2C", fill_opacity=1, stroke_color="#B25E08", stroke_width=3)
    lines = VGroup(*[Line([(-0.25 + 0.5 * rnd(i, 2)) * s * (1 - f), -f * 2.2 * s, 0], [(-0.05 + 0.25 * rnd(i, 3)) * s * (1 - f), -f * 2.2 * s - 0.04, 0],
                          stroke_color="#B25E08", stroke_width=2) for i, f in enumerate((0.2, 0.38, 0.55, 0.72))])
    hairs = VGroup(*[Line([0.04 * s, -(0.4 + 0.4 * i) * s, 0], [0.32 * s * (1 - 0.2 * i), -(0.5 + 0.4 * i) * s, 0],
                          stroke_color=ROOT_D, stroke_width=2) for i in range(4)])
    tops = VGroup(*[Line([0, 0, 0], [a * s, 0.9 * s, 0], stroke_color="#4E9A3A", stroke_width=8) for a in (-0.35, 0, 0.35)])
    return VGroup(tops, hairs, body, lines)


def sweet_potato(w=2.2):
    s = w / 2.2
    body = Ellipse(width=2.2 * s, height=0.85 * s, fill_color="#B3486B", fill_opacity=1, stroke_color="#7A2A45", stroke_width=3)
    tips = VGroup(Line([-1.1 * s, 0, 0], [-1.45 * s, -0.1 * s, 0], stroke_color=ROOT_D, stroke_width=3),
                  Line([1.1 * s, 0, 0], [1.45 * s, 0.08 * s, 0], stroke_color=ROOT_D, stroke_width=3))
    return VGroup(tips, body)


def potato(w=1.8):
    s = w / 1.8
    body = Ellipse(width=1.8 * s, height=1.25 * s, fill_color="#D8B47A", fill_opacity=1, stroke_color="#8E6B36", stroke_width=3)
    eyes = VGroup(*[Dot([x * s, y * s, 0], radius=0.05 * s, color="#8E6B36") for x, y in ((-0.4, 0.2), (0.3, 0.3), (0.1, -0.25), (-0.2, -0.3), (0.55, -0.05))])
    return VGroup(body, eyes)


def fibrous_root(w=1.6, h=1.4, col=ROOT_D, n=9):
    """비슷한 굵기의 가는 뿌리가 수염처럼. 위 가운데 = (0,0)"""
    g = VGroup()
    for i in range(n):
        f = i / (n - 1) - 0.5
        g.add(smooth([(f * 0.15, 0), (f * w * 0.45, -h * 0.45), (f * w, -h * (0.85 + 0.15 * rnd(i, 1)))], col, 3.5))
    return g


def tap_root(w=1.4, h=1.6, col=ROOT_D):
    """굵고 곧은 뿌리에 가는 뿌리가 여러 개. 위 가운데 = (0,0)"""
    main = Polygon([-0.14, 0, 0], [0.14, 0, 0], [0.02, -h, 0], [-0.02, -h, 0], fill_color=ROOT, fill_opacity=1,
                   stroke_color=col, stroke_width=3)
    g = VGroup()
    for i, f in enumerate((0.22, 0.38, 0.52, 0.66, 0.8)):
        sg = 1 if i % 2 else -1
        y = -h * f
        g.add(smooth([(0, y), (sg * w * 0.25 * (1 - f * 0.5), y - 0.1), (sg * w * 0.45 * (1 - f * 0.5), y - 0.25)], col, 2.5))
    return VGroup(g, main)


def tree_rooted(h=2.8, deep=True):
    """땅 위 나무 + 땅속 뿌리. 땅 높이 = 0"""
    tr = tree(h)
    roots = VGroup()
    if deep:
        roots.add(smooth([(0, 0), (0.05, -0.8), (-0.04, -1.5), (0.03, -2.0)], BROWN_DARK, 7))
        for sg in (1, -1):
            roots.add(smooth([(0, -0.1), (sg * 0.5, -0.6), (sg * 0.75, -1.4)], BROWN_DARK, 5))
            roots.add(smooth([(0, -0.5), (sg * 0.35, -1.1), (sg * 0.5, -1.8)], BROWN_DARK, 4))
    else:
        for sg in (1, -1):
            for f in (0.5, 0.8):
                roots.add(smooth([(0, 0), (sg * 0.5 * f, -0.12), (sg * 0.9 * f, -0.3 * f)], BROWN_DARK, 4))
    g = VGroup(roots, tr)
    g.tree, g.roots = tr, roots
    return g


# ══════════════ 줄기 ══════════════
def lily(h=4.2, red=0.0):
    """백합: 곧은 줄기 + 여러 잎 + 위에 흰 꽃. red(0~1)만큼 꽃·잎이 붉은빛. 줄기 아래 끝 = (0,0)"""
    s = h / 4.2
    pet = mixc(LILY_W, "#F07A92", red)
    pet_s = mixc("#B9B3A6", "#C2334E", red)
    lf = mixc("#6DB35A", "#A8735A", red * 0.55)
    stem_c = mixc(STEM, "#A06A4A", red * 0.45)
    g = VGroup()
    stem = Line([0, 0, 0], [0, 3.3 * s, 0], stroke_color=stem_c, stroke_width=10 * s)
    leaves = VGroup()
    for i, y in enumerate(np.linspace(0.5, 2.9, 8)):
        sg = 1 if i % 2 else -1
        e = Ellipse(width=0.95 * s, height=0.2 * s, fill_color=lf, fill_opacity=1, stroke_color=LEAF_EDGE, stroke_width=2)
        e.rotate(sg * 0.45).move_to([sg * 0.42 * s, y * s + 0.12 * s, 0])
        leaves.add(e)
    flower = VGroup()
    top = np.array([0, 3.3 * s, 0])
    for a in (-0.75, -0.3, 0.3, 0.75, 0.0):
        p = Ellipse(width=0.42 * s, height=1.15 * s, fill_color=pet, fill_opacity=1, stroke_color=pet_s, stroke_width=2.5)
        p.move_to(top + UP * 0.5 * s).rotate(-a, about_point=top)
        flower.add(p)
    for a in (-0.25, 0, 0.25):
        flower.add(Line(top, top + np.array([np.sin(a) * 0.9 * s, np.cos(a) * 0.9 * s, 0]), stroke_color="#B48A2A", stroke_width=2))
        flower.add(Dot(top + np.array([np.sin(a) * 0.9 * s, np.cos(a) * 0.9 * s, 0]), radius=0.05 * s, color="#C2662A"))
    g.add(stem, leaves, flower)
    g.stem, g.leaves, g.flower = stem, leaves, flower
    return g


def flask(w=1.6, liquid=DYE, level=0.6):
    """삼각 플라스크. 바닥 가운데 = (0,0)"""
    h = w * 1.2
    out = [(-w / 2, 0), (w / 2, 0), (w * 0.13, h * 0.68), (w * 0.13, h), (-w * 0.13, h), (-w * 0.13, h * 0.68)]
    body = Polygon(*[[x, y, 0] for x, y in out], fill_color="#F4FAFD", fill_opacity=0.12, stroke_color=GLASS, stroke_width=4)
    lh = h * 0.68 * level
    xw = w / 2 - (w / 2 - w * 0.13) * (lh / (h * 0.68))
    liq = Polygon([-w / 2 + 0.05, 0.04, 0], [w / 2 - 0.05, 0.04, 0], [xw - 0.04, lh, 0], [-xw + 0.04, lh, 0],
                  fill_color=liquid, fill_opacity=0.85, stroke_width=0)
    g = VGroup(liq, body)
    g.liq = liq
    return g


def stem_cross(r=1.0, red=0.0):
    """줄기를 가로로 자른 단면: 퍼져 있는 점(통로)"""
    dot_c = mixc("#FFFFFF", DYE, red)
    g = VGroup(Circle(radius=r, fill_color="#B9DC8E", fill_opacity=1, stroke_color=STEM_D, stroke_width=4))
    for i in range(22):
        a = rnd(i, 1) * TAU
        rr = (0.25 + 0.6 * rnd(i, 2)) * r
        g.add(Dot([np.cos(a) * rr, np.sin(a) * rr, 0], radius=0.07 * r, color=dot_c).set_stroke(STEM_D, 1))
    return g


def stem_long(w=0.9, h=2.4, red=0.0):
    """줄기를 세로로 자른 단면: 이어진 선(통로)"""
    line_c = mixc("#FFFFFF", DYE, red)
    g = VGroup(RoundedRectangle(corner_radius=0.12, width=w, height=h, fill_color="#B9DC8E", fill_opacity=1,
                                stroke_color=STEM_D, stroke_width=4))
    for i in range(5):
        x = (-0.32 + 0.16 * i) * w
        g.add(Line([x, -h / 2 + 0.08, 0], [x, h / 2 - 0.08, 0], stroke_color=line_c, stroke_width=5))
    return g


# ══════════════ 잎 ══════════════
def leaf_part(s=1.4, fill=LEAF_FILL):
    """잎몸·잎자루·잎맥이 있는 잎(가운데 = 잎몸 가운데). .blade .stalk .veins, .pt('blade'|'stalk'|'vein')"""
    lf = leaf("ovate", True, s, fill)
    b = lf.blade

    def pt(k):
        c = b.get_center()
        if k == "blade":
            return c + RIGHT * b.width * 0.22 + UP * b.height * 0.1
        if k == "stalk":
            return lf.stalk.get_center()
        return c + UP * b.height * 0.08
    lf.pt = pt
    return lf


def foil(w=1.6, h=2.4):
    f = Ellipse(width=w, height=h, fill_color=FOIL, fill_opacity=1, stroke_color="#8D949E", stroke_width=3)
    lines = VGroup(*[Line([(-0.35 + 0.18 * i) * w, (-0.3 + 0.1 * (i % 3)) * h, 0], [(-0.2 + 0.18 * i) * w, (0.1 + 0.08 * (i % 2)) * h, 0],
                          stroke_color="#F4F6F9", stroke_width=3) for i in range(4)])
    return VGroup(f, lines)


def beaker(w=1.6, h=1.6, liquid=WATER, level=0.65, steam=False):
    """비커. 바닥 가운데 = (0,0)"""
    lh = h * level
    liq = Rectangle(width=w - 0.1, height=lh, fill_color=liquid, fill_opacity=0.8, stroke_width=0).move_to([0, lh / 2 + 0.03, 0])
    out = VMobject(stroke_color=GLASS, stroke_width=4)
    out.set_points_as_corners([[-w / 2 - 0.08, h, 0], [-w / 2, h - 0.06, 0], [-w / 2, 0, 0], [w / 2, 0, 0], [w / 2, h, 0]])
    g = VGroup(liq, out)
    if steam:
        st = VGroup(*[smooth([(x, h + 0.1), (x + 0.1, h + 0.35), (x - 0.05, h + 0.6), (x + 0.08, h + 0.85)], "#B8C6D0", 4)
                      for x in (-w * 0.25, 0.0, w * 0.25)])
        g.add(st)
        g.steam = st
    g.liq = liq
    return g


def test_tube(h=1.8, w=0.42, liquid="#E9F2C8", level=0.6):
    """시험관. 바닥 가운데 = (0,0)"""
    lh = h * level
    liq = RoundedRectangle(corner_radius=w * 0.45, width=w - 0.06, height=lh, fill_color=liquid, fill_opacity=0.9,
                           stroke_width=0).move_to([0, lh / 2 + 0.03, 0])
    tube = RoundedRectangle(corner_radius=w * 0.48, width=w, height=h, fill_color="#FFFFFF", fill_opacity=0.25,
                            stroke_color=GLASS, stroke_width=3).move_to([0, h / 2, 0])
    g = VGroup(liq, tube)
    g.liq = liq
    return g


def petri(r=1.0):
    return VGroup(Circle(radius=r, fill_color="#F4FAFD", fill_opacity=0.9, stroke_color=GLASS, stroke_width=4),
                  Circle(radius=r * 0.92, stroke_color=GLASS, stroke_width=2, fill_opacity=0))


def cobalt(s=0.5, col=CO_BLUE):
    return Rectangle(width=s, height=s, fill_color=col, fill_opacity=1, stroke_color="#2A4F8A", stroke_width=2)


def greenhouse(w=4.4, h=2.4, mist=True):
    """온실(바닥 가운데 = (0,0))"""
    dome = VMobject(fill_color="#E6F4FA", fill_opacity=0.55, stroke_color=GLASS, stroke_width=4)
    pts = [[-w / 2, 0, 0], [-w / 2, h * 0.6, 0]] + [[np.cos(a) * w / 2, h * 0.6 + np.sin(a) * h * 0.4, 0] for a in np.linspace(PI, 0, 18)] + [[w / 2, 0, 0]]
    dome.set_points_as_corners(pts + [pts[0]])
    ribs = VGroup(*[Line([x, 0, 0], [x, h * 0.6 + np.sqrt(max(0, 1 - (2 * x / w) ** 2)) * h * 0.4, 0], stroke_color=GLASS, stroke_width=2)
                    for x in np.linspace(-w * 0.3, w * 0.3, 4)])
    plants = VGroup(*[small_herb(0.5 + 0.2 * rnd(i, 1), seed=i).move_to([x, 0.45, 0]) for i, x in enumerate(np.linspace(-w * 0.38, w * 0.38, 7))])
    g = VGroup(dome, ribs, plants)
    if mist:
        dots = VGroup(*[Dot([(-0.45 + 0.9 * rnd(i, 3)) * w, (0.3 + 0.6 * rnd(i, 4)) * h, 0], radius=0.05, color="#9CC9E6") for i in range(30)])
        g.add(dots)
        g.mist = dots
    return g


def balsam(leaves="all", bag=True, drops=0, h=2.6):
    """봉선화(잎: 'all' 그대로 / 'half' 절반 / 'none' 모두 뗌) + 투명 비닐봉지. 화분 바닥 가운데 = (0,0)"""
    s = h / 2.6
    pot = Polygon([-0.45 * s, 0, 0], [0.45 * s, 0, 0], [0.6 * s, 0.6 * s, 0], [-0.6 * s, 0.6 * s, 0], fill_color="#D9805A",
                  fill_opacity=1, stroke_color="#8E4A2E", stroke_width=3)
    stem = Line([0, 0.6 * s, 0], [0, 2.1 * s, 0], stroke_color=STEM, stroke_width=7)
    lv = VGroup()
    n = {"all": 6, "half": 3, "none": 0}[leaves]
    for i in range(6):
        sg = 1 if i % 2 else -1
        y = (0.95 + 0.2 * i) * s
        e = Ellipse(width=0.7 * s, height=0.24 * s, fill_color=LEAF_FILL, fill_opacity=1, stroke_color=LEAF_EDGE, stroke_width=2)
        e.rotate(sg * 0.4).move_to([sg * 0.33 * s, y, 0])
        if i < n:
            lv.add(e)
    g = VGroup(pot, stem, lv)
    if bag:
        b = RoundedRectangle(corner_radius=0.35 * s, width=1.6 * s, height=1.85 * s, fill_color="#FFFFFF", fill_opacity=0.15,
                             stroke_color="#9AB4C4", stroke_width=3).move_to([0, 1.55 * s, 0])
        tie = Line([-0.3 * s, 0.66 * s, 0], [0.3 * s, 0.66 * s, 0], stroke_color="#9AB4C4", stroke_width=5)
        g.add(b, tie)
        g.bag = b
    dd = VGroup()
    for i in range(drops):
        dd.add(Dot([(-0.62 + 1.24 * rnd(i, 5)) * s, (0.85 + 1.35 * rnd(i, 6)) * s, 0], radius=0.045 * s, color="#5FA9DA"))
    g.add(dd)
    g.drops = dd
    return g


# ══════════════ 꽃 ══════════════
def flower_parts(h=3.6, petal="#F5A3BF"):
    """꽃의 구조(옆에서 본 단면): 가운데 암술, 둘레 수술, 바깥 꽃잎, 아래 꽃받침. 꽃자루 아래 끝 = (0,0). .pt[k]"""
    s = h / 3.6
    g = VGroup()
    g.add(Line([0, 0, 0], [0, 1.0 * s, 0], stroke_color=STEM, stroke_width=9))
    sep = VGroup()
    for sg in (-1, 1):
        sep.add(Polygon([0, 1.02 * s, 0], [sg * 0.72 * s, 0.84 * s, 0], [sg * 0.42 * s, 1.24 * s, 0], fill_color="#6DB35A",
                        fill_opacity=1, stroke_color=LEAF_EDGE, stroke_width=2.5))
    pet = VGroup()
    base = np.array([0, 1.15 * s, 0])
    for a in (-1.0, 1.0, -0.55, 0.55):
        p = Ellipse(width=0.85 * s, height=1.9 * s, fill_color=petal, fill_opacity=1, stroke_color="#C4547A", stroke_width=2.5)
        p.move_to(base + UP * 0.95 * s).rotate(-a, about_point=base)
        pet.add(p)
    sta = VGroup()
    for a in (-0.42, -0.22, 0.22, 0.42):
        tip = base + np.array([np.sin(a) * 1.35 * s, np.cos(a) * 1.35 * s, 0])
        sta.add(Line(base, tip, stroke_color="#D9C77A", stroke_width=4),
                Ellipse(width=0.24 * s, height=0.14 * s, fill_color="#F2C230", fill_opacity=1, stroke_color="#B88A00", stroke_width=2).move_to(tip))
    pis = VGroup(Ellipse(width=0.42 * s, height=0.5 * s, fill_color="#9CCB6A", fill_opacity=1, stroke_color=STEM_D, stroke_width=2.5).move_to(base + UP * 0.2 * s),
                 Line(base + UP * 0.42 * s, base + UP * 1.55 * s, stroke_color="#8DBE58", stroke_width=7),
                 Ellipse(width=0.3 * s, height=0.16 * s, fill_color="#7FAE3A", fill_opacity=1, stroke_color=STEM_D, stroke_width=2).move_to(base + UP * 1.6 * s))
    g.add(pet, sep, sta, pis)
    g.sepals, g.petals, g.stamens, g.pistil = sep, pet, sta, pis
    g.ovary = pis[0]
    ref = g[0].get_start()
    off = dict(pistil=base + UP * 1.6 * s, stamen=base + np.array([np.sin(0.42) * 1.35 * s, np.cos(0.42) * 1.35 * s, 0]),
               petal=base + np.array([-1.3 * s, 1.2 * s, 0]), sepal=np.array([0.5 * s, 1.0 * s, 0]))

    def pt(k):
        return g[0].get_start() + (off[k] - ref)
    g.pt = pt
    return g


def small_flower(n=5, col="#F5C518", r=0.5, edge=None, center="#E8B800"):
    """위에서 본 꽃(꽃잎 n장)"""
    g = VGroup()
    for i in range(n):
        a = PI / 2 + i * TAU / n
        p = Ellipse(width=r * 0.85, height=r * 1.15, fill_color=col, fill_opacity=1, stroke_color=edge or INK, stroke_width=2)
        p.move_to([0, r * 0.55, 0]).rotate(a - PI / 2, about_point=ORIGIN)
        g.add(p)
    g.add(Circle(radius=r * 0.22, fill_color=center, fill_opacity=1, stroke_color=INK, stroke_width=1.5))
    return g


def dalmaji_parts():
    """달맞이꽃을 분리해 흰 종이에 놓은 모습(앱 u3-6 관찰 결과): 암술 1(윗부분 네 갈래) · 수술 8 · 꽃잎 4 · 꽃받침 4(2개씩 합쳐져 뒤로 젖혀짐).
    .groups = [암술, 수술, 꽃잎, 꽃받침] (각 묶음 가운데 0,0 근처)"""
    pis = VGroup(Line([0, -0.9, 0], [0, 0.7, 0], stroke_color="#9CC35A", stroke_width=6))
    for a in (0.6, 1.3, 1.85, 2.55):
        pis.add(Line([0, 0.7, 0], [np.cos(a) * 0.32, 0.7 + np.sin(a) * 0.32, 0], stroke_color="#8DB04A", stroke_width=6))
    sta = VGroup()
    for i in range(8):
        x = -0.84 + i * 0.24
        sta.add(VGroup(Line([x, -0.6, 0], [x, 0.4, 0], stroke_color="#E6D27A", stroke_width=4),
                       Ellipse(width=0.12, height=0.38, fill_color="#F2C230", fill_opacity=1, stroke_color="#B88A00", stroke_width=1.5).move_to([x, 0.5, 0])))
    pet = VGroup()
    for i in range(4):
        x = -0.98 + i * 0.66
        p = VGroup(Ellipse(width=0.6, height=0.8, fill_color="#FFE45C", fill_opacity=1, stroke_color="#C9A300", stroke_width=2.5).move_to([x - 0.14, 0.15, 0]),
                   Ellipse(width=0.6, height=0.8, fill_color="#FFE45C", fill_opacity=1, stroke_color="#C9A300", stroke_width=2.5).move_to([x + 0.14, 0.15, 0]))
        p.add(Polygon([x - 0.38, 0.0, 0], [x + 0.38, 0.0, 0], [x, -0.5, 0], fill_color="#FFE45C", fill_opacity=1, stroke_width=0))
        pet.add(p)
    sep = VGroup()
    for i in range(2):
        x = -0.55 + i * 1.1
        for sg in (-1, 1):
            sep.add(Polygon([x, -0.7, 0], [x + sg * 0.12, -0.7, 0], [x + sg * 0.42, 0.65, 0], [x + sg * 0.2, 0.7, 0],
                            fill_color="#8CC063", fill_opacity=1, stroke_color=LEAF_EDGE, stroke_width=2))
    return VGroup(pis, sta, pet, sep)


def peach_flower(r=0.75, ovary=0.0):
    """복숭아꽃(위에서 본 분홍 꽃잎 5장 + 수술). ovary>0이면 꽃잎 없이 자라는 씨방만"""
    g = VGroup()
    if ovary <= 0:
        g.add(small_flower(5, "#F7B6C8", r, "#C9708C", "#F2C230"))
        for i in range(10):
            a = i * TAU / 10
            g.add(Line([0, 0, 0], [np.cos(a) * r * 0.42, np.sin(a) * r * 0.42, 0], stroke_color="#C9708C", stroke_width=2),
                  Dot([np.cos(a) * r * 0.42, np.sin(a) * r * 0.42, 0], radius=0.04, color="#E2A400"))
    return g


def peach(r=0.7, cut=False):
    """복숭아 열매(cut=True면 반으로 갈라 가운데 씨가 보임)"""
    body = Circle(radius=r, fill_color="#F7A98B" if not cut else "#FCE3B0", fill_opacity=1, stroke_color="#C9644A", stroke_width=3)
    g = VGroup(body)
    if cut:
        g.add(Ellipse(width=r * 0.75, height=r * 1.0, fill_color="#B07A4A", fill_opacity=1, stroke_color="#6E4523", stroke_width=3))
    else:
        g.add(Arc(radius=r * 0.8, start_angle=1.9, angle=1.4, stroke_color="#C9644A", stroke_width=3))
    g.add(Polygon([0.05, r * 0.95, 0], [0.45 * r + 0.1, r * 1.35, 0], [0.25 * r, r * 1.0, 0], fill_color="#6DB35A", fill_opacity=1,
                  stroke_color=LEAF_EDGE, stroke_width=2))
    return g


def pistil_seed(h=1.6, grown=0.0):
    """암술(씨방 속에 씨). grown 0~1: 씨방과 씨가 자람. 아래 끝 = (0,0)"""
    w = 0.5 + 0.9 * grown
    ov = Ellipse(width=w, height=w * 1.05, fill_color=mixc("#9CCB6A", "#F7A98B", grown), fill_opacity=1, stroke_color=STEM_D,
                 stroke_width=3).move_to([0, w * 0.52, 0])
    seed = Ellipse(width=0.12 + 0.3 * grown, height=0.16 + 0.42 * grown, fill_color="#B07A4A", fill_opacity=1,
                   stroke_color="#6E4523", stroke_width=2).move_to(ov.get_center())
    style = Line([0, w * 1.04, 0], [0, w * 1.04 + h * (1 - grown) * 0.8 + 0.01, 0], stroke_color="#8DBE58", stroke_width=6)
    g = VGroup(ov, seed, style)
    g.ov, g.seed = ov, seed
    return g


# ══════════════ 연결 ══════════════
def herb(h=5.0):
    """앱 u3-7의 식물 그림(애기똥풀처럼): 뿌리·줄기·잎 5장·노란 꽃 2송이·좁은 원기둥 열매 3개. 땅 높이 = 바닥에서 앱 300.
    .parts dict(root stem leaf flower fruit) · .pt(k) 이름표 자리 · .water_paths · .food_paths(화면 좌표 꺾은선 목록) · .ground_y"""
    P = _Map(210, 225, h / 420)
    g = VGroup()
    soil = P.rect(0, 300, 420, 120, SOIL, SOIL, 0, op=0.9)
    gl = Line(P(0, 300), P(420, 300), stroke_color=SOIL_D, stroke_width=3)
    root = VGroup()
    for pts in ([(210, 300), (206, 350), (210, 400)], [(210, 318), (175, 340), (150, 380)], [(210, 318), (245, 340), (270, 380)],
                [(208, 350), (188, 362), (176, 396)], [(212, 350), (232, 362), (244, 396)]):
        v = VMobject(stroke_color=ROOT, stroke_width=6)
        v.set_points_smoothly([P(x, y) for x, y in pts])
        root.add(v)
    stem = VGroup(Line(P(210, 300), P(210, 100), stroke_color=STEM, stroke_width=10), Line(P(210, 100), P(210, 50), stroke_color=STEM, stroke_width=8))
    for ex in (166, 254):
        v = VMobject(stroke_color=STEM, stroke_width=8)
        v.set_points_smoothly([P(210, 100), P((210 + ex) / 2 + (ex - 210) * -0.05, 80), P(ex, 64)])
        stem.add(v)
    LV = [(210, 262, -1), (210, 232, 1), (210, 200, -1), (210, 168, 1), (210, 138, -1)]
    leaves = VGroup()
    tips = []
    for i, (x, y, d) in enumerate(LV):
        Ln = 120 - i * 12
        tip = (x + d * Ln, y - Ln * 0.15)
        lf = P.smooth_poly([(x, y), (x + d * Ln * 0.45, y - Ln * 0.33), tip, (x + d * Ln * 0.5, y + Ln * 0.02)], "#79B85A", "#3D7A2E", 2.5)
        leaves.add(lf, Line(P(x, y), P(x + d * Ln * 0.93, y - Ln * 0.14), stroke_color="#3D7A2E", stroke_width=2))
        tips.append(tip)
    flowers = VGroup()
    for (x, y) in ((166, 64), (254, 64)):
        f = small_flower(4, "#FFD93B", 22 * P.k, "#C9A300", "#E8B800").move_to(P(x, y))
        flowers.add(f)
    fruits = VGroup()
    for i, (x, y) in enumerate(((150, 52), (214, 30), (270, 52))):
        fruits.add(Line(P(210, 50 if i == 1 else 100), P(x, y + 18), stroke_color=STEM, stroke_width=3))
        rr = RoundedRectangle(corner_radius=5 * P.k, width=10 * P.k, height=40 * P.k, fill_color="#9CC56B", fill_opacity=1,
                              stroke_color="#5A8A2E", stroke_width=2).move_to(P(x, y + 2))
        rr.rotate(-(i - 1) * np.radians(25))
        fruits.add(rr)
    g.add(soil, gl, root, stem, leaves, fruits, flowers)
    g.parts = dict(root=root, stem=stem, leaf=leaves, flower=flowers, fruit=fruits)
    g.P = P
    anchor = dict(root=(232, 372), stem=(210, 200), leaf=(118, 245), flower=(254, 64), fruit=(150, 50))
    g._anchor = anchor
    g._ref = P(210, 300)

    def cur(x, y):
        return g[1].get_start() + (P(x, y) - P(0, 300)) * (g[1].get_length() / (420 * P.k))
    g.at = cur
    g.pt = lambda k: cur(*anchor[k])
    g.water_paths = lambda: [[cur(210, 400), cur(210, LV[i][1]), cur(*tips[i])] for i in range(5)]
    g.food_paths = lambda: [
        [cur(*tips[0]), cur(210, LV[0][1]), cur(210, 330), cur(176, 370)],
        [cur(*tips[3]), cur(210, LV[3][1]), cur(210, 100), cur(166 - 16, 64 - 12 + 0), cur(150, 52)],
        [cur(*tips[4]), cur(210, LV[4][1]), cur(210, 40)],
        [cur(*tips[1]), cur(210, LV[1][1]), cur(210, 100), cur(254, 64), cur(270, 52)],
        [cur(*tips[2]), cur(210, LV[2][1]), cur(210, 240)],
    ]
    g.leaf_tips = lambda: [cur(*t) for t in tips]
    return g


def gear(r=0.8, n=10, col="#F2C94C"):
    pts = []
    for i in range(n):
        a = i / n * TAU
        b = (i + 0.5) / n * TAU
        rr = r + 0.16
        pts += [[np.cos(a) * r, np.sin(a) * r, 0], [np.cos(a) * rr, np.sin(a) * rr, 0], [np.cos(b) * rr, np.sin(b) * rr, 0], [np.cos(b) * r, np.sin(b) * r, 0]]
    body = Polygon(*pts, fill_color=col, fill_opacity=1, stroke_color="#555555", stroke_width=2.5)
    hub = Circle(radius=r * 0.35, fill_color=PAPER, fill_opacity=1, stroke_color="#555555", stroke_width=2.5)
    return VGroup(body, hub)


def clock_face(r=1.2):
    face = Circle(radius=r, fill_color=PAPER, fill_opacity=1, stroke_color="#8A6A44", stroke_width=7)
    ticks = VGroup(*[Line([np.cos(a) * r * 0.85, np.sin(a) * r * 0.85, 0], [np.cos(a) * r * 0.96, np.sin(a) * r * 0.96, 0],
                          stroke_color="#555555", stroke_width=3) for a in np.arange(12) * TAU / 12])
    hand = Line([0, 0, 0], [0, r * 0.75, 0], stroke_color="#333333", stroke_width=7)
    g = VGroup(face, ticks, hand, Dot(radius=0.07, color="#333333"))
    g.hand = hand
    return g


def vapor_puffs(pt, n=3, col="#9CC9E6"):
    """잎 끝에서 나가는 수증기 점"""
    return VGroup(*[Dot(np.array(pt) + np.array([0.12 * i - 0.12, 0.18 + 0.16 * i, 0]), radius=0.06 - 0.008 * i, color=col) for i in range(n)])
