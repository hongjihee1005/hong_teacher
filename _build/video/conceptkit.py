"""「개념 차근차근」(초1~초6 개념, EPISODES_CONCEPT.md) 공통 부품

    class GcEp01(ConceptScene): ...          # 화면 "개념 차근차근 1화", 바탕 버터색
    ten_frame(n)                              # 10칸 틀(2줄 × 5칸)에 구슬 n개
    dots(n, color, cols)                      # 구슬 n개를 cols칸씩
    pair_card(a, b)                           # 모으기·가르기 그림(위 한 수, 아래 두 수)
"""
import numpy as np
from manim import DOWN, LEFT, RIGHT, UP, Circle, Line, RoundedRectangle, Square, VGroup

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T

RED = "#E2574C"


class ConceptScene(EpisodeScene):
    GRADE, SEM = "C", 1
    LABEL = "개념 차근차근 {}화"

    def step(self, sec, items, sub, narr, hold=1.2):
        """구역 하나: items = [(마크업, 크기, y)]를 차례로 보여 주고 지움"""
        from manim import FadeIn as _F
        from division import clear_stage as _cs
        self.section(sec)
        objs = [M(t, sz).move_to([0, y, 0]) for t, sz, y in items]
        self.say(sub, narr)
        for ob in objs:
            self.play(_F(ob), run_time=0.5)
        self.wait(hold)
        self.settle()
        _cs(self, 0.5)

    def ask(self, q, sub, narr, a, asub, anarr, qsize=70, asize=56):
        """연습 문제 → 생각해 보세요 → 답"""
        from manim import FadeIn as _F
        from division import clear_stage as _cs
        self.section("연습해요")
        qq = M(q, qsize).move_to([0, 1.2, 0])
        self.say(sub, narr)
        self.play(_F(qq), run_time=0.5)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        aa = M(a, asize).move_to([0, -0.4, 0])
        self.say(asub, anarr)
        self.play(_F(aa), run_time=0.5)
        self.wait(1.4)
        self.settle()
        _cs(self, 0.6)
        self.hide_chip()


def dot(color=RED, r=0.24):
    return Circle(radius=r, fill_color=color, fill_opacity=1, stroke_color=INK, stroke_width=2.5)


def dots(n, color=RED, cols=5, step=0.62, r=0.24):
    g = VGroup(*[dot(color, r) for _ in range(n)])
    for i, d in enumerate(g):
        rr, cc = divmod(i, cols)
        d.move_to([cc * step, -rr * step, 0])
    return g


def ten_frame(n=0, color=RED, cell=0.8, colors=None):
    """10칸 틀. 반환 VGroup(칸들, 구슬들). colors가 있으면 구슬마다 색"""
    cells = VGroup(*[Square(side_length=cell, fill_color=PAPER, fill_opacity=1, stroke_color=INK, stroke_width=3)
                     for _ in range(10)])
    for i, c in enumerate(cells):
        rr, cc = divmod(i, 5)
        c.move_to([cc * cell, -rr * cell, 0])
    bs = VGroup()
    for i in range(n):
        col = colors[i] if colors else color
        bs.add(dot(col, cell * 0.33).move_to(cells[i]))
    return VGroup(cells, bs)


def pair_card(top, left, right, size=72, color=INK):
    """모으기·가르기 그림: 위 한 칸, 아래 두 칸, 이어 주는 선"""
    def box(v, c):
        r = RoundedRectangle(corner_radius=0.2, width=1.3, height=1.1, fill_color=PAPER, fill_opacity=1,
                             stroke_color=INK, stroke_width=3)
        t = T(str(v), size, c).move_to(r)
        return VGroup(r, t)
    a = box(top, GREEN).move_to([0, 1.0, 0])
    b = box(left, BLUE).move_to([-1.3, -0.9, 0])
    c = box(right, ORANGE).move_to([1.3, -0.9, 0])
    l1 = Line(a.get_bottom(), b.get_top(), color=INK, stroke_width=4)
    l2 = Line(a.get_bottom(), c.get_top(), color=INK, stroke_width=4)
    return VGroup(l1, l2, a, b, c)


def number_line(n_max, x0=-6.0, x1=6.0, y=0.0, label_every=1, size=26):
    """0 ~ n_max 수직선. 반환 VGroup(선, 눈금들, 글자들), .x(v) 위치"""
    from manim import Line as _L
    line = _L([x0, y, 0], [x1, y, 0], color=INK, stroke_width=4)
    ticks, labs = VGroup(), VGroup()
    for v in range(n_max + 1):
        x = x0 + (x1 - x0) * v / n_max
        ticks.add(_L([x, y - 0.12, 0], [x, y + 0.12, 0], color=INK, stroke_width=3))
        if v % label_every == 0:
            labs.add(T(str(v), size, SOFT).move_to([x, y - 0.4, 0]))
    g = VGroup(line, ticks, labs)
    g.x = lambda v: x0 + (x1 - x0) * v / n_max
    g.y = y
    return g


def jumps(S, nl, step, times, color=BLUE, run_each=0.35):
    """수직선 위에서 step씩 times번 뛰기(화살 호), 도착 수를 위에 씀. 반환 VGroup"""
    from manim import ArcBetweenPoints, Create as _C, FadeIn as _F
    out = VGroup()
    for k in range(times):
        a = [nl.x(step * k), nl.y + 0.1, 0]
        c = [nl.x(step * (k + 1)), nl.y + 0.1, 0]
        arc = ArcBetweenPoints(a, c, angle=-1.6, color=color, stroke_width=5)
        lab = T(str(step * (k + 1)), 30, color).move_to([c[0], nl.y + 0.55 + abs(c[0] - a[0]) * 0.28, 0])
        S.play(_C(arc), _F(lab), run_time=run_each)
        out.add(arc, lab)
    return out


def table_rows(n, upto=9, size=40, color=BLUE):
    """n단: 'n × 1 = n' … 세로 목록"""
    rows = VGroup(*[M(f'{n} × {k} = <span foreground="{color}">{n * k}</span>', size) for k in range(1, upto + 1)])
    return rows.arrange(DOWN, buff=0.08, aligned_edge=LEFT)


def poly(pts, color="#2F6FD6", op=0.35, sw=5):
    """꼭짓점 목록으로 다각형"""
    from manim import Polygon
    return Polygon(*[[x, y, 0] for x, y in pts], fill_color=color, fill_opacity=op, stroke_color=INK, stroke_width=sw)


def regular(n, r=1.0, color="#2F6FD6", op=0.35, start=90):
    import math
    pts = [(r * math.cos(math.radians(start + 360 * k / n)), r * math.sin(math.radians(start + 360 * k / n))) for k in range(n)]
    return poly(pts, color, op)


def right_mark(corner, d1, d2, s=0.25, color=INK):
    """corner에서 d1, d2 방향(단위 벡터)으로 직각 표시"""
    from manim import VMobject
    c = np.array(corner, dtype=float)
    a, b = np.array(d1, dtype=float), np.array(d2, dtype=float)
    m = VMobject(color=color, stroke_width=4)
    m.set_points_as_corners([c + a * s, c + (a + b) * s, c + b * s])
    return m
