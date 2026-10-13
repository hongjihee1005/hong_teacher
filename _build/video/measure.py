"""들이와 무게 영상 공통 부품: 비커(눈금·물 높이), 컵, 물병, 저울 바늘, 양팔저울

    bk = Beaker(1000, major=100, minor=50, height=4.0)   # VGroup, bk.set_level(ml) / bk.level_anim(tracker)
"""
import numpy as np
from manim import (DOWN, LEFT, PI, RIGHT, UP, Arc, Circle, Line, Polygon, Rectangle, RoundedRectangle,
                   VGroup, always_redraw)

from series_style import BLUE, INK, ORANGE, PAPER, SOFT, T

WATER = "#8EC5F0"


class Beaker(VGroup):
    def __init__(self, cap, major=100, minor=None, height=4.0, width=1.8, label_every=None, unit="mL", size=26):
        super().__init__()
        self.cap, self.h, self.w = cap, height, width
        self.glass = VGroup(Line([-width / 2, height, 0], [-width / 2, 0, 0], color=INK, stroke_width=5),
                            Line([-width / 2, 0, 0], [width / 2, 0, 0], color=INK, stroke_width=5),
                            Line([width / 2, 0, 0], [width / 2, height, 0], color=INK, stroke_width=5))
        ticks = VGroup()
        labs = VGroup()
        step = minor or major
        label_every = label_every or major
        v = step
        while v <= cap + 1e-6:
            y = height * v / cap
            big = abs(v / major - round(v / major)) < 1e-6
            ln = 0.42 if big else 0.22
            ticks.add(Line([width / 2 - ln, y, 0], [width / 2, y, 0], color=INK, stroke_width=3 if big else 2))
            if abs(v / label_every - round(v / label_every)) < 1e-6:
                labs.add(T(f"{int(v)}", size, INK).next_to([width / 2, y, 0], RIGHT, buff=0.12))
            v += step
        self.ticks, self.labs = ticks, labs
        self.unit_lab = T(unit, size, SOFT).move_to([width / 2 + 0.45, height + 0.38, 0])
        self.water = Rectangle(width=width - 0.08, height=0.001, fill_color=WATER, fill_opacity=0.85, stroke_width=0)
        self.water.move_to([0, 0.0005, 0])
        self.add(self.water, self.glass, self.ticks, self.labs, self.unit_lab)
        self.base = np.array([0.0, 0.0, 0.0])

    def water_rect(self, ml):
        hh = max(self.h * ml / self.cap, 0.001)
        bottom = self.glass[1].get_center()
        r = Rectangle(width=self.w - 0.08, height=hh, fill_color=WATER, fill_opacity=0.85, stroke_width=0)
        r.move_to(bottom + UP * (hh / 2 + 0.02))
        return r

    def set_level(self, ml):
        self.water.become(self.water_rect(ml))
        return self


def cup(color=ORANGE, s=0.5):
    """종이컵"""
    return Polygon([-0.5 * s, 0.6 * s, 0], [0.5 * s, 0.6 * s, 0], [0.36 * s, -0.6 * s, 0], [-0.36 * s, -0.6 * s, 0],
                   color=INK, fill_color=color, fill_opacity=1, stroke_width=3)


def bottle(h=2.4, w=1.0, color=WATER, fill=1.0):
    body = RoundedRectangle(corner_radius=0.2, width=w, height=h * 0.75, stroke_color=INK, stroke_width=4,
                            fill_color=PAPER, fill_opacity=1)
    neck = Rectangle(width=w * 0.38, height=h * 0.18, stroke_color=INK, stroke_width=4, fill_color=PAPER, fill_opacity=1)
    neck.next_to(body, UP, buff=0)
    capm = Rectangle(width=w * 0.46, height=h * 0.07, stroke_width=0, fill_color=ORANGE, fill_opacity=1).next_to(neck, UP, buff=0)
    wat = Rectangle(width=w - 0.1, height=h * 0.75 * fill - 0.1, stroke_width=0, fill_color=color, fill_opacity=0.85)
    wat.align_to(body, DOWN).shift(UP * 0.05)
    return VGroup(body, wat, neck, capm)


def dial_face(c, r=1.9, maxv=4000, major=1000, minor=100, label=lambda v: f"{v // 1000}", unit="kg"):
    """둥근 저울 눈금판(0이 맨 위, 시계 방향). 반환 VGroup(판, 눈금, 숫자, 단위)"""
    from manim import TAU
    face = Circle(radius=r, fill_color=PAPER, fill_opacity=1, stroke_color=INK, stroke_width=6).move_to(c)
    ticks, nums = VGroup(), VGroup()
    n = maxv // minor
    for k in range(n):
        v = k * minor
        a = PI / 2 - TAU * v / maxv
        d = np.array([np.cos(a), np.sin(a), 0])
        big = v % major == 0
        mid = (major // 2) and v % (major // 2) == 0
        ln = 0.34 if big else (0.24 if mid else 0.15)
        ticks.add(Line(c + d * (r - ln), c + d * r, color=INK, stroke_width=5 if big else 2.5))
        if big:
            nums.add(T(label(v), 34).move_to(c + d * (r - 0.62)))
    u = T(unit, 28, SOFT).move_to(c + DOWN * r * 0.45)
    return VGroup(face, ticks, nums, u)


def needle(c, v, r=1.9, maxv=4000, color=ORANGE):
    from manim import TAU
    a = PI / 2 - TAU * v / maxv
    d = np.array([np.cos(a), np.sin(a), 0])
    return VGroup(Line(c, c + d * (r - 0.12), color=color, stroke_width=7), Circle(radius=0.1, fill_color=INK, fill_opacity=1, stroke_width=0).move_to(c))


def unit_calc(S, a, b_, op, big="L", small="mL", who="", y0=1.6):
    """'몇 L 몇 mL' 세로셈: a, b_ = (큰 단위, 작은 단위), op '+' 또는 '-'. 받아올림·받아내림을 1000으로 보여 줌."""
    from manim import Create, FadeIn, FadeOut, Indicate, Write
    from series_style import GREEN, M, b, g, o
    xb, xs, xu1, xu2 = -2.4, 0.9, -1.55, 2.4
    F = 64

    def num(v, x, y, col):
        return T(str(v), F, col).move_to([x, y, 0], aligned_edge=RIGHT).shift(RIGHT * 0.5)

    def unit(t, x, y):
        return T(t, 46, SOFT).move_to([x, y, 0])

    ys = [y0, y0 - 1.0, y0 - 2.3]
    r1 = VGroup(num(a[0], xb, ys[0], BLUE), unit(big, xu1, ys[0]), num(a[1], xs, ys[0], ORANGE), unit(small, xu2, ys[0]))
    r2 = VGroup(T(op if op == "+" else "−", F).move_to([xb - 1.6, ys[1], 0]), num(b_[0], xb, ys[1], BLUE), unit(big, xu1, ys[1]),
                num(b_[1], xs, ys[1], ORANGE), unit(small, xu2, ys[1]))
    bar = Line([xb - 2.0, ys[1] - 0.6, 0], [xu2 + 0.6, ys[1] - 0.6, 0], color=INK, stroke_width=6)
    S.play(FadeIn(r1), FadeIn(r2), Create(bar), run_time=0.9)
    S.say(f"{b(big)}는 {b(big)}끼리, {o(small)}는 {o(small)}끼리", f"{big}는 {big}끼리, {small}는 {small}끼리 계산해요.")
    S.play(Indicate(VGroup(r1[0], r2[1]), color=BLUE), Indicate(VGroup(r1[2], r2[3]), color=ORANGE), run_time=1.0)
    extra = VGroup()
    if op == "+":
        s_small = a[1] + b_[1]
        carry = s_small >= 1000
        if carry:
            S.say(f"{o(small)}끼리: {a[1]} + {b_[1]} = {o(str(s_small))}", f"먼저 {small}끼리 더하면 {a[1]} 더하기 {b_[1]}, {s_small}{small}예요.")
            tmp = num(s_small, xs, ys[2], ORANGE)
            S.play(FadeIn(tmp), run_time=0.6)
            S.wait(0.6)
            S.say(f"{o(f'1000 {small}')} = {b(f'1 {big}')} → 받아올림!", f"1000{small}는 1{big}와 같아요. 1000{small}를 1{big}로 받아올려요!")
            c1 = T("1", 44, BLUE).move_to([xb + 0.35, ys[0] + 0.75, 0])
            S.play(Indicate(tmp, color=ORANGE, scale_factor=1.2), FadeIn(c1, shift=UP * 0.3), run_time=0.9)
            new_small = num(s_small - 1000, xs, ys[2], ORANGE)
            S.play(FadeOut(tmp), FadeIn(new_small), run_time=0.6)
            extra.add(c1, new_small)
            rb = a[0] + b_[0] + 1
            S.say(f"{b(big)}끼리: 1 + {a[0]} + {b_[0]} = {b(str(rb))}", f"{big}끼리는 받아올린 1과 함께 1 더하기 {a[0]} 더하기 {b_[0]}, {rb}{big}예요.")
        else:
            new_small = num(s_small, xs, ys[2], ORANGE)
            S.say(f"{o(small)}끼리: {a[1]} + {b_[1]} = {o(str(s_small))}", f"{small}끼리 더하면 {s_small}{small}.")
            S.play(FadeIn(new_small), run_time=0.6)
            extra.add(new_small)
            rb = a[0] + b_[0]
            S.say(f"{b(big)}끼리: {a[0]} + {b_[0]} = {b(str(rb))}", f"{big}끼리 더하면 {rb}{big}.")
        rs = s_small - 1000 if carry else s_small
    else:
        borrow = a[1] < b_[1]
        if borrow:
            from division import j
            S.say(f"{a[1]}에서 {j(b_[1], '을를')} 뺄 수 없어요", f"{small}끼리 {a[1]}에서 {j(b_[1], '을를')} 뺄 수 없어요.")
            S.wait(0.8)
            S.say(f"{b(f'1 {big}')}를 {o(f'1000 {small}')}로 받아내림!", f"그래서 {a[0]}{big}에서 1{big}를 1000{small}로 바꾸어 받아내려요!")
            nb = T(str(a[0] - 1), 44, BLUE).move_to([xb + 0.35, ys[0] + 0.75, 0])
            ns = T(str(a[1] + 1000), 44, ORANGE).move_to([xs + 0.0, ys[0] + 0.75, 0])
            cross1 = Line(r1[0].get_corner(DOWN + LEFT), r1[0].get_corner(UP + RIGHT), color=INK, stroke_width=4)
            cross2 = Line(r1[2].get_corner(DOWN + LEFT), r1[2].get_corner(UP + RIGHT), color=INK, stroke_width=4)
            S.play(Create(cross1), FadeIn(nb, shift=DOWN * 0.2), run_time=0.7)
            S.play(Create(cross2), FadeIn(ns, shift=DOWN * 0.2), run_time=0.7)
            extra.add(nb, ns, cross1, cross2)
            rs = a[1] + 1000 - b_[1]
            S.say(f"{o(small)}끼리: {a[1] + 1000} − {b_[1]} = {o(str(rs))}", f"{small}끼리 {a[1] + 1000} 빼기 {b_[1]}, {rs}{small}예요.")
            rb = a[0] - 1 - b_[0]
        else:
            rs = a[1] - b_[1]
            S.say(f"{o(small)}끼리: {a[1]} − {b_[1]} = {o(str(rs))}", f"{small}끼리 빼면 {rs}{small}.")
            rb = a[0] - b_[0]
        new_small = num(rs, xs, ys[2], ORANGE)
        S.play(FadeIn(new_small), run_time=0.6)
        extra.add(new_small)
        S.say(f"{b(big)}끼리: {a[0] - (1 if borrow else 0)} − {b_[0]} = {b(str(rb))}", f"{big}끼리 {a[0] - (1 if borrow else 0)} 빼기 {b_[0]}, {rb}{big}.")
    res_b = num(rb, xb, ys[2], BLUE)
    S.play(FadeIn(res_b), FadeIn(unit(big, xu1, ys[2])), FadeIn(unit(small, xu2, ys[2])), run_time=0.6)
    ans = f"{rb} {big} {rs} {small}" if rs else f"{rb} {big}"
    S.say(f"답: {g(ans)}", f"답은 {rb}{big} {rs}{small}예요." if rs else f"답은 {rb}{big}예요.")
    from manim import SurroundingRectangle
    box = SurroundingRectangle(VGroup(res_b, extra[-1] if op == '-' else extra[-1]), color=GREEN, buff=0.2, stroke_width=6)
    S.play(Create(box), run_time=0.5)
    S.wait(1.4)
    return rb, rs


def balance(c, tilt=0.0, arm=2.4):
    """양팔저울: tilt>0이면 왼쪽이 내려감(라디안). 반환 VGroup(받침, 막대, 왼접시, 오른접시), 접시 윗면 중심은 .lp, .rp"""
    from manim import Triangle
    stand = VGroup(Line(c + DOWN * 1.6, c, color=INK, stroke_width=8),
                   Rectangle(width=1.6, height=0.18, fill_color=INK, fill_opacity=1, stroke_width=0).move_to(c + DOWN * 1.65),
                   Triangle(fill_color=ORANGE, fill_opacity=1, stroke_width=0).scale(0.16).move_to(c + UP * 0.05))
    d = np.array([np.cos(tilt), -np.sin(tilt), 0]) * arm
    lend, rend = c - d, c + d
    beam = Line(lend, rend, color=INK, stroke_width=9)
    def pan(p):
        hang = VGroup(Line(p, p + DOWN * 0.9 + LEFT * 0.55, color=SOFT, stroke_width=3), Line(p, p + DOWN * 0.9 + RIGHT * 0.55, color=SOFT, stroke_width=3))
        plate = Arc(radius=0.75, start_angle=PI + 0.5, angle=PI - 1.0, color=INK, stroke_width=6).move_to(p + DOWN * 1.05)
        return VGroup(hang, plate)
    g = VGroup(stand, beam, pan(lend), pan(rend))
    g.lp, g.rp = lend + DOWN * 0.95, rend + DOWN * 0.95
    return g
