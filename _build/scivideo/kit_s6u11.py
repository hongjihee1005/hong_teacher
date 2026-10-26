"""6-1 1단원 「산과 염기」 전용 그림 부품 (s6ep01~06, s6mm01)

모두 직접 그린 단순한 벡터 그림. 용액 색·지시약 색은 차시 앱(grade6/science/_build_tb/src/u1-1~u1-6.html) 스크립트의 값.
  용액 자료: SOL(여섯 용액: 이름·색·투명·거품·산성/염기성·붉은 양배추 색) · CAB(붉은 양배추 색) · LIT_B/LIT_R(리트머스) · PINK(페놀프탈레인)
  기구: dropper_bottle(점적병) · SpotPlate(홈판: .group .liq[i] .center(i)) · litmus(시험지) · drop(방울) · color_bar(붉은 양배추 색깔 변화표)
  물질: eggshell · clamshell · egg_white · chicken · marble · tofu (melt 0~1)
  생활: lemon · fish_plate · salad · cutting_board · fruit · antacid · toilet · drain · tile_wall · shop_shelf(가게 진열대)
  환경: factory · rain_cloud · statue · forest(dry) · lake(dead) · coral_reef(bleach) · soil(sick)
  그 밖: Glass·word_card·result_table·pic_card·tweezers(kit_s5u13) · label·text_card·fit·ox_mark·bin_box·rnd(kit_s5u11)
         safety_note·bubbles(kit_s4u12) · cloud·P·S·E·L(kit_s3u22) · fish·clam(kit_s3u12)
"""
import numpy as np
from manim import (DOWN, LEFT, ORIGIN, RIGHT, UP, PI, TAU,
                   Arc, Circle, Dot, Ellipse, Line, Polygon, Rectangle, RoundedRectangle, Square,
                   VGroup, VMobject)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, T, M
from scikit import RED
from kit_s5u13 import Glass, word_card, result_table, pic_card, tweezers, mix, GLASS  # noqa: F401
from kit_s5u11 import label, text_card, fit, ox_mark, bin_box, rnd  # noqa: F401
from kit_s4u12 import safety_note, bubbles  # noqa: F401
from kit_s3u22 import cloud, P, S, E, L  # noqa: F401
import kit_s3u12 as A3

SW = 4
CLEAR = "#DFF0F7"
SOL = [
    dict(n="식초", sh="식초", c="#F2C94C", op=0.72, col="노란색", tr=True, foam=False, acid=True, cab="r"),
    dict(n="레몬즙", sh="레몬즙", c="#F4E9A8", op=0.97, col="연한 노란색", tr=False, foam=False, acid=True, cab="r"),
    dict(n="빨랫비누 물", sh="빨랫비누 물", c="#F8F8F3", op=0.97, col="흰색", tr=False, foam=True, acid=False, cab="b"),
    dict(n="석회수", sh="석회수", c=CLEAR, op=0.5, col="무색", tr=True, foam=False, acid=False, cab="b"),
    dict(n="묽은 염산", sh="묽은 염산", c=CLEAR, op=0.5, col="무색", tr=True, foam=False, acid=True, cab="r"),
    dict(n="묽은 수산화 나트륨 용액", sh="묽은 수산화\n나트륨 용액", c=CLEAR, op=0.5, col="무색", tr=True, foam=False,
         acid=False, cab="y"),
]
CAB = {"r": "#D0306A", "b": "#4766CF", "y": "#E5CF3A"}
CABN = {"r": "붉은색", "b": "푸른색", "y": "노란색"}
CAB_SOL = "#6B3F8F"          # 붉은 양배추 용액(보라)
LIT_B = "#3D6FD0"
LIT_R = "#D8434F"
PINK = "#E64F95"
BAR = ["#C0174A", "#E0457B", "#9B4FB8", "#3F66C9", "#2AA37A", "#E8D23A"]   # 앱의 색깔 변화표
# 섞기 실험(u1-4) 예시 색: 0·5·10·15·20·25방울
MIX_A = ["#D0306A", "#D8467A", "#8A4FA8", "#2F8FA8", "#2AA37A", "#9CC23A"]   # 묽은 염산 + 수산화 나트륨
MIX_B = ["#E5CF3A", "#9CC23A", "#8A4FA8", "#D8467A", "#D0306A", "#C41F5C"]   # 수산화 나트륨 + 묽은 염산
ACID = "#D2453B"
BASE = "#2F6FD6"


def name_text(s, size=24, col=INK):
    lines = s.split("\n")
    g = VGroup(*[T(x, size, col) for x in lines]).arrange(DOWN, buff=0.06)
    return g


# ── 점적병 ──
def dropper_bottle(sol=None, s=1.0, col=None, op=None, name=True, size=24):
    c = col or (sol["c"] if sol else CLEAR)
    o_ = op if op is not None else (sol["op"] if sol else 0.5)
    w, h = 0.86 * s, 1.35 * s
    body = RoundedRectangle(corner_radius=0.14 * s, width=w, height=h, fill_color="#FBFDFF", fill_opacity=0.5,
                            stroke_color=GLASS, stroke_width=5)
    liq = RoundedRectangle(corner_radius=0.1 * s, width=w - 0.1 * s, height=h * 0.8, fill_color=c, fill_opacity=o_,
                           stroke_width=0).align_to(body, DOWN).shift(UP * 0.05 * s)
    cap = Rectangle(width=0.44 * s, height=0.22 * s, fill_color="#E2573F", fill_opacity=1, stroke_color="#A33A2A",
                    stroke_width=3).next_to(body, UP, buff=0)
    tip = Polygon([-0.11 * s, 0, 0], [0.11 * s, 0, 0], [0, 0.42 * s, 0], fill_color="#E2573F", fill_opacity=1,
                  stroke_color="#A33A2A", stroke_width=3).next_to(cap, UP, buff=0)
    g = VGroup(liq, body, cap, tip)
    g.liq = liq
    if name and sol:
        t = name_text(sol["sh"], size)
        if t.width > 1.5 * s:
            t.scale_to_fit_width(1.5 * s)
        t.next_to(body, DOWN, buff=0.14)
        g.add(t)
        g.label = t
    return g


# ── 홈판 ──
class SpotPlate:
    """가로로 늘어선 홈(rows×cols). names가 있으면 첫 줄 아래(또는 왼쪽)에 이름"""

    def __init__(self, cols=6, rows=1, gap=1.95, r=0.62, center=(0, 0.3), names=None, size=22, row_gap=1.55,
                 row_names=None, name_w=None):
        self.cols, self.rows, self.gap, self.r = cols, rows, gap, r
        cx, cy = center
        self.xs = [cx + (i - (cols - 1) / 2) * gap for i in range(cols)]
        self.ys = [cy + ((rows - 1) / 2 - j) * row_gap for j in range(rows)]
        W = gap * cols + 0.2
        H = row_gap * (rows - 1) + 2 * r + 0.45
        base = RoundedRectangle(corner_radius=0.3, width=W, height=H, fill_color="#EEF3F6", fill_opacity=1,
                                stroke_color="#9FB3BF", stroke_width=5).move_to([cx, cy, 0])
        self.base = base
        self.wells, self.liq = [], []
        g = VGroup(base)
        for j in range(rows):
            for i in range(cols):
                c = [self.xs[i], self.ys[j], 0]
                w = Circle(radius=r, fill_color=PAPER, fill_opacity=1, stroke_color="#9FB3BF", stroke_width=4).move_to(c)
                lq = Circle(radius=r * 0.86, fill_color=CLEAR, fill_opacity=0, stroke_width=0).move_to(c)
                self.wells.append(w)
                self.liq.append(lq)
                g.add(w, lq)
        self.group = g
        self.names = VGroup()
        if names:
            for i, n in enumerate(names):
                t = name_text(n, size)
                lim = name_w or gap - 0.12
                if t.width > lim:
                    t.scale_to_fit_width(lim)
                t.next_to(base, DOWN, buff=0.12)
                t.set_x(self.xs[i])
                self.names.add(t)
        self.rnames = VGroup()
        if row_names:
            for j, n in enumerate(row_names):
                t = name_text(n, size)
                t.next_to(base, LEFT, buff=0.15).set_y(self.ys[j])
                self.rnames.add(t)

    def idx(self, i, j=0):
        return j * self.cols + i

    def center(self, i, j=0):
        return np.array([self.xs[i], self.ys[j], 0.0])

    def all(self):
        return VGroup(self.group, self.names, self.rnames)


def litmus(col, w=0.2, h=0.85):
    return Rectangle(width=w, height=h, fill_color=col, fill_opacity=1, stroke_color=PAPER, stroke_width=2)


def drop(col="#CFE6F2", s=0.22, stroke=GLASS):
    m = VMobject(fill_color=col, fill_opacity=1, stroke_color=stroke, stroke_width=2)
    m.set_points_smoothly([[0, s, 0], [0.45 * s, -0.25 * s, 0], [0, -0.6 * s, 0], [-0.45 * s, -0.25 * s, 0], [0, s, 0]])
    return m


def color_bar(w=11.0, h=0.55, labels=True, size=26):
    n = 60
    g = VGroup()
    for k in range(n):
        t = k / (n - 1) * (len(BAR) - 1)
        a = int(min(t, len(BAR) - 2))
        c = mix(BAR[a], BAR[a + 1], t - a)
        g.add(Rectangle(width=w / n + 0.01, height=h, fill_color=c, fill_opacity=1, stroke_width=0)
              .move_to([-w / 2 + (k + 0.5) * w / n, 0, 0]))
    frame = RoundedRectangle(corner_radius=h / 2 * 0.6, width=w, height=h, fill_opacity=0, stroke_color=INK,
                             stroke_width=3)
    out = VGroup(g, frame)
    if labels:
        la = T("← 산성이 강함", size, ACID).next_to(frame, DOWN, buff=0.12).align_to(frame, LEFT)
        lb = T("염기성이 강함 →", size, BASE).next_to(frame, DOWN, buff=0.12).align_to(frame, RIGHT)
        out.add(la, lb)
    return out


# ── 물질 ──
def eggshell(s=1.0, melt=0.0):
    pts = [(-0.38, -0.12), (-0.3, 0.16), (-0.08, 0.26), (0.18, 0.2), (0.36, 0.02), (0.28, -0.2), (0.0, -0.14),
           (-0.18, -0.24)]
    g = VGroup(P([(x * s, y * s) for x, y in pts], "#F5EBD7", "#B9A48A", 3),
               Arc(radius=0.22 * s, start_angle=0.4, angle=1.6, stroke_color="#D9C7A6", stroke_width=3).shift(DOWN * 0.08 * s))
    return g.scale(1 - 0.65 * melt)


def clamshell(s=1.0, melt=0.0):
    pts = [(0, -0.3)] + [(0.42 * np.cos(a), -0.06 + 0.32 * np.sin(a)) for a in np.linspace(0.15, PI - 0.15, 11)]
    sh = P([(x * s, y * s) for x, y in pts], "#EFE6DA", "#B9A48A", 3)
    rays = VGroup(*[L((0, -0.3 * s), (0.34 * s * np.cos(a), (-0.06 + 0.26 * np.sin(a)) * s), "#B9A48A", 2)
                    for a in np.linspace(0.5, PI - 0.5, 4)])
    return VGroup(sh, rays).scale(1 - 0.65 * melt)


def egg_white(s=1.0, melt=0.0):
    b = S([(-0.36, -0.05), (-0.2, 0.2), (0.12, 0.24), (0.36, 0.06), (0.28, -0.2), (-0.1, -0.24)], "#FFFFFF", "#B8BEC2", 3)
    b.scale(s)
    g = VGroup(b)
    if melt:
        g.scale(1 - 0.45 * melt)
        g.set_opacity(1 - 0.5 * melt)
    return g


def chicken(s=1.0, melt=0.0):
    b = S([(-0.4, -0.02), (-0.22, 0.2), (0.15, 0.22), (0.4, 0.04), (0.3, -0.18), (-0.15, -0.22)], "#F3D7C2", "#B98A6A", 3)
    lines = VGroup(*[L((-0.22 + 0.14 * k, -0.12), (-0.12 + 0.14 * k, 0.12), "#D9A988", 2) for k in range(4)])
    g = VGroup(b, lines).scale(s)
    if melt:
        g.scale(1 - 0.45 * melt)
        g.set_opacity(1 - 0.5 * melt)
    return g


def marble(s=1.0, melt=0.0):
    pts = [(-0.36, -0.2), (-0.3, 0.14), (-0.06, 0.26), (0.26, 0.18), (0.38, -0.08), (0.12, -0.26)]
    g = VGroup(P([(x * s, y * s) for x, y in pts], "#EDEDEA", "#8E9196", 3),
               S([(-0.22 * s, 0.05 * s), (0.0, -0.05 * s), (0.2 * s, 0.08 * s)], None, "#A9ADB3", 2, close=False))
    return g.scale(1 - 0.65 * melt)


def tofu(s=1.0, melt=0.0):
    a = 0.5 * s
    f = Square(side_length=a, fill_color="#FBF7EA", fill_opacity=1, stroke_color="#C9BF9E", stroke_width=3)
    tp = Polygon([-a / 2, a / 2, 0], [-a / 2 + 0.16 * s, a / 2 + 0.14 * s, 0], [a / 2 + 0.16 * s, a / 2 + 0.14 * s, 0],
                 [a / 2, a / 2, 0], fill_color="#FFFDF5", fill_opacity=1, stroke_color="#C9BF9E", stroke_width=3)
    sd = Polygon([a / 2, a / 2, 0], [a / 2 + 0.16 * s, a / 2 + 0.14 * s, 0], [a / 2 + 0.16 * s, -a / 2 + 0.14 * s, 0],
                 [a / 2, -a / 2, 0], fill_color="#EFE8D2", fill_opacity=1, stroke_color="#C9BF9E", stroke_width=3)
    g = VGroup(f, tp, sd)
    if melt:
        g.scale(1 - 0.45 * melt)
        g.set_opacity(1 - 0.5 * melt)
    return g


MATS = {"달걀 껍데기": eggshell, "조개껍데기": clamshell, "삶은 달걀흰자": egg_white, "삶은 닭 가슴살": chicken,
        "대리암 조각": marble, "두부": tofu}


def cloudy_dots(c, r=0.5, n=26, seed=4, col="#FFFFFF"):
    return VGroup(*[Dot([c[0] + r * (2 * rnd(i, seed) - 1) * 0.85, c[1] + r * (2 * rnd(i, seed + 1) - 1) * 0.85, 0],
                        radius=0.035, color=col).set_opacity(0.85) for i in range(n)
                    if (2 * rnd(i, seed) - 1) ** 2 + (2 * rnd(i, seed + 1) - 1) ** 2 < 1])


# ── 생활 ──
def lemon(s=1.0, slice_=False):
    if slice_:
        o_ = Circle(radius=0.38 * s, fill_color="#F7D23A", fill_opacity=1, stroke_color="#C9A400", stroke_width=3)
        i_ = Circle(radius=0.3 * s, fill_color="#FFF3A8", fill_opacity=1, stroke_width=0)
        seg = VGroup(*[L((0, 0), (0.28 * s * np.cos(a), 0.28 * s * np.sin(a)), "#F2D24A", 3)
                       for a in np.linspace(0, TAU, 9)[:-1]])
        return VGroup(o_, i_, seg)
    body = Ellipse(width=0.95 * s, height=0.68 * s, fill_color="#F7D23A", fill_opacity=1, stroke_color="#C9A400",
                   stroke_width=3)
    tip = Ellipse(width=0.16 * s, height=0.12 * s, fill_color="#F7D23A", fill_opacity=1, stroke_color="#C9A400",
                  stroke_width=3).move_to([0.5 * s, 0, 0])
    leaf = Ellipse(width=0.36 * s, height=0.16 * s, fill_color="#5FA84A", fill_opacity=1, stroke_color="#3F7A30",
                   stroke_width=2).rotate(0.5).move_to([-0.4 * s, 0.3 * s, 0])
    return VGroup(tip, body, leaf)


def plate(w=2.2):
    return VGroup(Ellipse(width=w, height=w * 0.32, fill_color="#FFFFFF", fill_opacity=1, stroke_color=SOFT, stroke_width=4),
                  Ellipse(width=w * 0.72, height=w * 0.2, fill_opacity=0, stroke_color="#DDD6C8", stroke_width=3))


def fish_plate(s=1.0):
    p = plate(2.4)
    f = A3.fish("#C9B79A", 1.5, fin=False).move_to([-0.1, 0.18, 0])
    ln = lemon(0.7, slice_=True).move_to([0.85, 0.15, 0])
    return VGroup(p, f, ln).scale(s)


def salad(s=1.0):
    bowl = VGroup(Arc(radius=0.8, start_angle=PI, angle=PI, fill_color="#FFFFFF", fill_opacity=1, stroke_color=SOFT,
                      stroke_width=4).stretch_to_fit_height(0.6),
                  Line([-0.8, 0, 0], [0.8, 0, 0], stroke_color=SOFT, stroke_width=4))
    leaves = VGroup(*[Ellipse(width=0.5, height=0.3, fill_color=c, fill_opacity=1, stroke_color="#3F7A30", stroke_width=2)
                      .rotate(a).move_to([x, 0.12 + 0.06 * (k % 2), 0])
                      for k, (x, a, c) in enumerate([(-0.45, 0.4, "#7DC35B"), (-0.1, -0.3, "#5FA84A"),
                                                     (0.25, 0.3, "#9BD46F"), (0.5, -0.4, "#7DC35B")])])
    tom = Circle(radius=0.12, fill_color="#E2573F", fill_opacity=1, stroke_color="#9E2F1F", stroke_width=2).move_to([0.05, 0.25, 0])
    return VGroup(leaves, tom, bowl).scale(s)


def cutting_board(s=1.0, fishy=True):
    b = RoundedRectangle(corner_radius=0.16, width=2.0, height=1.2, fill_color="#D9A86A", fill_opacity=1,
                         stroke_color="#8C6239", stroke_width=4)
    hole = Circle(radius=0.08, fill_color=PAPER, fill_opacity=1, stroke_color="#8C6239", stroke_width=3).move_to([0.8, 0.38, 0])
    g = VGroup(b, hole)
    if fishy:
        for k in range(3):
            m = VMobject(stroke_color="#8AA0A8", stroke_width=4)
            xs = np.linspace(-0.12, 0.12, 9)
            m.set_points_smoothly([[-0.5 + 0.4 * k + 0.08 * np.sin(y * 25), 0.75 + y * 2.0, 0] for y in xs])
            g.add(m)
    return g.scale(s)


def fruit(s=1.0):
    ap = Circle(radius=0.42, fill_color="#E2573F", fill_opacity=1, stroke_color="#9E2F1F", stroke_width=3)
    st = L((0, 0.38), (0.06, 0.6), "#7E5428", 5)
    lf = Ellipse(width=0.3, height=0.14, fill_color="#5FA84A", fill_opacity=1, stroke_width=0).rotate(0.4).move_to([0.2, 0.55, 0])
    dots = VGroup(*[Dot([0.25 * np.cos(a), 0.2 * np.sin(a) - 0.05, 0], radius=0.03, color="#F4E3A0")
                    for a in np.linspace(0, TAU, 7)[:-1]])
    return VGroup(ap, st, lf, dots).scale(s)


def antacid(s=1.0):
    box = RoundedRectangle(corner_radius=0.08, width=1.2, height=0.8, fill_color="#E8F1FB", fill_opacity=1,
                           stroke_color=INK, stroke_width=3)
    band = Rectangle(width=1.2, height=0.22, fill_color=BASE, fill_opacity=1, stroke_width=0).move_to([0, 0.18, 0])
    pills = VGroup(*[Circle(radius=0.12, fill_color="#FFFFFF", fill_opacity=1, stroke_color=SOFT, stroke_width=3)
                     .move_to([-0.3 + 0.3 * k, -0.65, 0]) for k in range(3)])
    return VGroup(box, band, pills).scale(s)


def toilet(s=1.0):
    tank = RoundedRectangle(corner_radius=0.08, width=0.9, height=0.6, fill_color="#FFFFFF", fill_opacity=1,
                            stroke_color=SOFT, stroke_width=4).move_to([-0.35, 0.45, 0])
    bowl = VGroup(Arc(radius=0.55, start_angle=PI, angle=PI, fill_color="#FFFFFF", fill_opacity=1, stroke_color=SOFT,
                      stroke_width=4).stretch_to_fit_height(0.55).move_to([0.25, -0.12, 0]),
                  Line([-0.3, 0.12, 0], [0.8, 0.12, 0], stroke_color=SOFT, stroke_width=5))
    base = Rectangle(width=0.4, height=0.35, fill_color="#FFFFFF", fill_opacity=1, stroke_color=SOFT,
                     stroke_width=4).move_to([0.25, -0.55, 0])
    return VGroup(tank, base, bowl).scale(s)


def drain(s=1.0, hair=True):
    ring = Circle(radius=0.5, fill_color="#C7CDD2", fill_opacity=1, stroke_color="#7C858C", stroke_width=4)
    bars = VGroup(*[L((-0.38 + 0.19 * k, -0.3), (-0.38 + 0.19 * k, 0.3), "#7C858C", 4) for k in range(5)])
    g = VGroup(ring, bars)
    if hair:
        for k in range(4):
            m = VMobject(stroke_color="#4A3A30", stroke_width=3)
            m.set_points_smoothly([[-0.45 + 0.1 * k, 0.2 - 0.12 * k, 0], [-0.1, 0.05 + 0.08 * k, 0],
                                   [0.2, -0.1 + 0.05 * k, 0], [0.5, 0.1 - 0.1 * k, 0]])
            g.add(m)
    return g.scale(s)


def tile_wall(s=1.0, dirty=True):
    g = VGroup()
    for i in range(4):
        for j in range(3):
            g.add(Square(side_length=0.42, fill_color="#E6F2F6", fill_opacity=1, stroke_color="#A9C4CE",
                         stroke_width=3).move_to([-0.63 + 0.42 * i, -0.42 + 0.42 * j, 0]))
    if dirty:
        for k in range(6):
            g.add(Dot([-0.7 + 1.4 * rnd(k, 3), -0.55 + 1.1 * rnd(k, 5), 0], radius=0.05 + 0.03 * rnd(k, 7),
                      color="#8E8A5E"))
    return g.scale(s)


def shop_shelf(w=8.4):
    """가게 진열대 두 칸: 윗칸 색깔 있는 주스, 아랫칸 투명한 탄산수"""
    frame = Rectangle(width=w, height=3.9, fill_color="#F7EEDC", fill_opacity=1, stroke_color="#8A7A66", stroke_width=5)
    mid = Line([-w / 2, 0, 0], [w / 2, 0, 0], stroke_color="#8A7A66", stroke_width=6)
    g = VGroup(frame, mid)
    cols = ["#F59A23", "#FFD23F", "#E2573F", "#9CCC3C", "#F7B6C8"]
    for i, c in enumerate(cols):
        x = -w / 2 + 0.8 + i * 1.25
        g.add(RoundedRectangle(corner_radius=0.12, width=0.6, height=1.25, fill_color=c, fill_opacity=1,
                               stroke_color="#8A7A66", stroke_width=3).move_to([x, 0.75, 0]),
              Rectangle(width=0.3, height=0.18, fill_color="#777777", fill_opacity=1, stroke_width=0).move_to([x, 1.47, 0]))
        g.add(RoundedRectangle(corner_radius=0.12, width=0.6, height=1.25, fill_color="#E4F3FA", fill_opacity=0.8,
                               stroke_color="#7AA7BD", stroke_width=3).move_to([x, -1.2, 0]),
              Rectangle(width=0.3, height=0.18, fill_color="#4F8FB0", fill_opacity=1, stroke_width=0).move_to([x, -0.48, 0]),
              Dot([x - 0.1, -1.1, 0], radius=0.05, color=PAPER), Dot([x + 0.08, -1.35, 0], radius=0.04, color=PAPER))
    g.slot_top = np.array([-w / 2 + 0.8 + 5 * 1.25, 0.75, 0])
    g.slot_bot = np.array([-w / 2 + 0.8 + 5 * 1.25, -1.2, 0])
    return g


def orange_juice(s=1.0):
    b = RoundedRectangle(corner_radius=0.12, width=0.6, height=1.25, fill_color="#F59A23", fill_opacity=1,
                         stroke_color="#8A7A66", stroke_width=3)
    cap = Rectangle(width=0.3, height=0.18, fill_color="#777777", fill_opacity=1, stroke_width=0).next_to(b, UP, buff=0)
    o_ = Circle(radius=0.17, fill_color="#FFB347", fill_opacity=1, stroke_color="#C76A00", stroke_width=2).move_to(b)
    return VGroup(b, cap, o_).scale(s)


# ── 환경 ──
def factory(s=1.0, smoke=True):
    body = Rectangle(width=1.8, height=0.9, fill_color="#B8B2A8", fill_opacity=1, stroke_color=INK, stroke_width=3).move_to([0, -0.2, 0])
    roof = Polygon([-0.9, 0.25, 0], [-0.5, 0.55, 0], [-0.5, 0.25, 0], [-0.1, 0.55, 0], [-0.1, 0.25, 0], [0.3, 0.55, 0],
                   [0.3, 0.25, 0], fill_color="#9C968C", fill_opacity=1, stroke_color=INK, stroke_width=3)
    ch = Rectangle(width=0.26, height=1.0, fill_color="#8C867C", fill_opacity=1, stroke_color=INK, stroke_width=3).move_to([0.6, 0.75, 0])
    g = VGroup(ch, body, roof)
    if smoke:
        for k in range(3):
            g.add(Circle(radius=0.2 + 0.08 * k, fill_color="#8E8E8E", fill_opacity=0.6, stroke_width=0)
                  .move_to([0.7 + 0.3 * k, 1.4 + 0.3 * k, 0]))
    return g.scale(s)


def rain_cloud(w=2.4, n=7, col="#9AA8B2", drop_col="#7AA7BD", seed=1):
    c = cloud(w, col)
    drops = VGroup(*[L((0, 0), (-0.08, -0.28), drop_col, 5).move_to([-w * 0.35 + w * 0.7 * k / max(1, n - 1),
                                                                     -w * 0.32 - 0.25 * (k % 3), 0]) for k in range(n)])
    return VGroup(c, drops)


def statue(s=1.0, damaged=False):
    base = Rectangle(width=1.0, height=0.3, fill_color="#D9D4CC", fill_opacity=1, stroke_color=INK, stroke_width=3).move_to([0, -0.85, 0])
    body = Polygon([-0.4, -0.7, 0], [0.4, -0.7, 0], [0.3, 0.1, 0], [-0.3, 0.1, 0], fill_color="#ECE8E0", fill_opacity=1,
                   stroke_color=INK, stroke_width=3)
    head = Circle(radius=0.28, fill_color="#ECE8E0", fill_opacity=1, stroke_color=INK, stroke_width=3).move_to([0, 0.4, 0])
    g = VGroup(base, body, head)
    if damaged:
        g.add(L((-0.1, 0.5), (0.05, 0.3), "#8E867A", 3), L((0.05, 0.3), (-0.05, 0.2), "#8E867A", 3),
              L((0.2, -0.2), (0.05, -0.45), "#8E867A", 3), L((-0.25, -0.1), (-0.1, -0.3), "#8E867A", 3))
        for k in range(4):
            g.add(Dot([-0.3 + 0.2 * k, -0.62 + 0.05 * (k % 2), 0], radius=0.04, color="#A49C90"))
    return g.scale(s)


def tree(h=1.6, dry=False):
    trunk = Rectangle(width=0.18 * h, height=0.5 * h, fill_color="#9C6B3C", fill_opacity=1, stroke_color=INK,
                      stroke_width=3).move_to([0, 0.25 * h, 0])
    if dry:
        br = VGroup(L((0, 0.45 * h), (-0.3 * h, 0.8 * h), "#9C6B3C", 6), L((0, 0.5 * h), (0.28 * h, 0.85 * h), "#9C6B3C", 6),
                    L((0, 0.5 * h), (0.02 * h, 0.95 * h), "#9C6B3C", 6))
        leaves = VGroup(*[Ellipse(width=0.14 * h, height=0.08 * h, fill_color="#C9A35A", fill_opacity=1, stroke_width=0)
                          .move_to([(-0.25 + 0.5 * rnd(k, 2)) * h, (0.6 + 0.3 * rnd(k, 4)) * h, 0]) for k in range(4)])
        return VGroup(trunk, br, leaves)
    crown = Circle(radius=0.4 * h, fill_color="#6DB35A", fill_opacity=1, stroke_color="#3F7A30", stroke_width=3).move_to([0, 0.8 * h, 0])
    return VGroup(trunk, crown)


def lake(w=3.0, dead=False):
    water = Ellipse(width=w, height=w * 0.38, fill_color="#9FC9DE" if dead else "#7FC0E6", fill_opacity=1,
                    stroke_color="#4A86A8", stroke_width=4)
    g = VGroup(water)
    if dead:
        f = A3.fish("#B8B8B0", 0.55, fin=False).rotate(PI).move_to([0.1, 0.05, 0])
        g.add(f)
    else:
        g.add(A3.fish("#F2A65A", 0.55, fin=False).move_to([-0.4, 0, 0]), A3.fish("#F2A65A", 0.45, fin=False).move_to([0.5, -0.06, 0]))
    return g


def coral_reef(bleach=False, s=1.0):
    g = VGroup()
    cols = ["#F07B7B", "#F49A5A", "#E86AA0"]
    for k, x in enumerate((-0.55, 0.0, 0.55)):
        c = A3.coral().scale(0.8).move_to([x, 0.2 + 0.1 * (k % 2), 0])
        if bleach:
            c.set_stroke(color="#F4F2EC")
        g.add(c)
    sand = Rectangle(width=2.0, height=0.25, fill_color="#E9D9AE", fill_opacity=1, stroke_width=0).move_to([0, -0.42, 0])
    sea = Rectangle(width=2.0, height=1.6, fill_color="#BFE3F2", fill_opacity=1, stroke_width=0).move_to([0, 0.35, 0])
    return VGroup(sea, sand, g).scale(s)


def soil(sick=False, w=2.2):
    ground_ = Rectangle(width=w, height=0.6, fill_color="#9C7A55" if not sick else "#B7A07E", fill_opacity=1,
                        stroke_color=INK, stroke_width=3)
    g = VGroup(ground_)
    for k in range(3):
        x = -w / 3 + k * w / 3
        if sick:
            st = S([(x, 0.3), (x + 0.05, 0.6), (x + 0.22, 0.72)], None, "#9A9A4A", 5, close=False)
            lf = Ellipse(width=0.26, height=0.12, fill_color="#C9C27A", fill_opacity=1, stroke_width=0).move_to([x + 0.25, 0.66, 0])
        else:
            st = L((x, 0.3), (x, 0.95), "#3F8F46", 5)
            lf = VGroup(Ellipse(width=0.34, height=0.16, fill_color="#5FA84A", fill_opacity=1, stroke_width=0).rotate(0.4).move_to([x - 0.16, 0.8, 0]),
                        Ellipse(width=0.34, height=0.16, fill_color="#5FA84A", fill_opacity=1, stroke_width=0).rotate(-0.4).move_to([x + 0.16, 0.9, 0]))
        g.add(st, lf)
    return g


def arrow_right(x0, x1, y, col=INK, sw=7):
    from manim import Arrow
    return Arrow([x0, y, 0], [x1, y, 0], buff=0, stroke_width=sw, color=col, max_tip_length_to_length_ratio=0.25)
