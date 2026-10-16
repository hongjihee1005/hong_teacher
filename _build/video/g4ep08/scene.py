"""「수학 원리 돋보기」 4학년 8화 — 1°는 얼마만큼일까? 각도기 읽기 (4-1 2단원 각도 3차시, 화 코드 4-1-2-b)

직각을 똑같이 90으로 나눈 하나 = 1도(1°), 직각 = 90°
각도기로 재기: ① 중심을 꼭짓점에 ② 밑금을 한 변에 ③ 그 변이 0인 쪽 눈금에서 다른 변과 만나는 눈금 읽기 (50°, 125°)
최종: GRADE=4 ./make_final.sh 8
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Arrow, Create, Dot, FadeIn, FadeOut, Indicate, LaggedStart, Line,
                   SurroundingRectangle, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, g, o
from division import clear_stage
from angle import PURPLE, angle_fig, protractor, unit
from geom import right_mark
from bignum import span


class G4Ep08(EpisodeScene):
    GRADE, SEM = 4, 1
    EP_NO = 8
    EP_TITLE = "1°는 얼마만큼일까? 각도기 읽기"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.one_degree()
        self.parts()
        self.measure(0, 50, inner=True, sec="각도기로 재기 ①")
        self.measure(180, -125, inner=False, sec="각도기로 재기 ②")
        self.closing(f"직각을 똑같이 90으로 나눈 하나가 {g('1°')}\n각도기는 {o('0에서 시작하는 쪽')} 눈금을 읽어요",
                     next_preview="4학년 9화 · 예각과 둔각, 각도 어림")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("모두가 똑같이 쓰는 각의 단위는 무엇일까요?", 46)
        q.scale_to_fit_width(min(q.width, 10.4)).move_to([0.6, 2.25, 0])
        v = np.array([-1.6, -1.6, 0])
        a = angle_fig(v, 90, L=3.0, arc_r=0.001)
        rm = right_mark(v, v + RIGHT, v + UP, s=0.45)
        lab = T("직각", 44, ORANGE).move_to(v + np.array([1.0, 0.9, 0]))
        self.say("각의 크기를 나타내는 단위", "지난 시간에 각의 크기를 비교하려면 모두가 똑같이 쓰는 단위가 필요하다고 했어요. 그 단위는 무엇일까요?")
        self.play(Write(q), run_time=1.0)
        self.play(Create(a), Create(rm), FadeIn(lab), run_time=1.0)
        self.wait(1.0)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def one_degree(self):
        self.section("1도")
        v = np.array([-3.2, -2.2, 0])
        L = 4.6
        a = angle_fig(v, 90, L=L, arc_r=0.001)
        rm = right_mark(v, v + RIGHT, v + UP, s=0.4)
        self.say("직각을 똑같이 90으로 나누면?", "직각을 똑같이 90으로 나누어 볼까요?")
        self.play(Create(a), Create(rm), run_time=0.8)
        rays = VGroup(*[Line(v, v + unit(d) * L, color=SOFT, stroke_width=1.5) for d in range(1, 90)])
        self.play(LaggedStart(*[Create(r) for r in rays], lag_ratio=0.02, run_time=2.4))
        one = VGroup(Line(v, v + unit(0) * L, color=ORANGE, stroke_width=6), Line(v, v + unit(1) * L, color=ORANGE, stroke_width=6))
        self.say(f"그중 하나가 {g('1도')}, {g('1°')}라고 써요", "그중 하나를 1도라고 하고, 1 옆에 작은 동그라미를 붙여 1°라고 써요.")
        self.play(Create(one), run_time=0.8)
        t1 = M(f"{g('1°')}  (1도)", 64).move_to([3.4, 0.6, 0])
        t2 = M(f"직각 = {g('90°')}", 64).move_to([3.4, -0.7, 0])
        self.play(FadeIn(t1, shift=LEFT * 0.2), run_time=0.6)
        self.say(f"직각은 1°가 90개 → {g('90°')}", "직각에는 1도가 90개 들어 있어요. 그래서 직각은 90도예요.")
        self.play(FadeIn(t2, shift=LEFT * 0.2), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def parts(self):
        self.section("각도기")
        p = protractor([0, -1.55, 0], R=3.5, num_size=24)
        self.say("각도를 재는 도구, 각도기", "각의 크기를 각도라고 해요. 각도는 각도기로 재요.")
        self.play(FadeIn(p), run_time=0.8)
        c = Arrow([-4.4, -0.6, 0], p.c + np.array([-0.08, 0.02, 0]), color=ORANGE, buff=0.05, stroke_width=6)
        tc = T("중심", 40, ORANGE).next_to(c.get_start(), LEFT, buff=0.15)
        self.say(f"가운데 점은 {o('중심')}", "가운데 점을 각도기의 중심이라고 해요.")
        self.play(Create(c), FadeIn(tc), run_time=0.6)
        self.say(f"아래 곧은 선은 {o('밑금')}", "아래쪽 곧은 선은 밑금이에요.")
        self.play(Indicate(p[1], color=ORANGE, scale_factor=1.03), run_time=0.8)
        tb = T("밑금", 40, ORANGE).move_to(p.c + np.array([4.3, 0.0, 0]))
        self.play(FadeIn(tb), run_time=0.4)
        self.say(f"눈금이 {span('안쪽', BLUE)}과 {span('바깥쪽', PURPLE)} 두 줄", "눈금 숫자는 두 줄이에요. 안쪽 숫자는 오른쪽이 0이고, 바깥쪽 숫자는 왼쪽이 0이에요.")
        self.play(Indicate(p[3][1], color=BLUE, scale_factor=1.6), Indicate(p[3][-2], color=PURPLE, scale_factor=1.6), run_time=1.0)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def measure(self, start, deg, inner, sec):
        self.section(sec)
        v = np.array([0, -2.0, 0])
        a = angle_fig(v, deg, start=start, L=4.6, arc_r=0.7)
        val = abs(deg)
        self.say(f"이 각은 몇 도일까요?", "이 각은 몇 도일까요? 각도기로 재어 봐요.")
        self.play(Create(a), run_time=0.8)
        p = protractor([4.6, 1.4, 0], R=3.3, num_size=22).scale(0.5)
        self.play(FadeIn(p), run_time=0.4)
        p2 = protractor(v, R=3.3, num_size=22)
        self.say(f"① 중심을 {o('꼭짓점')}에 맞춰요", "첫째, 각도기의 중심을 각의 꼭짓점에 맞춰요.")
        self.play(p.animate.scale(2).move_to(p2), run_time=1.2)
        self.remove(p)
        self.add(p2)
        self.bring_to_front(a)
        self.say(f"② 밑금을 {o('한 변')}에 맞춰요", "둘째, 각도기의 밑금을 각의 한 변에 맞춰요.")
        self.play(Indicate(a.s1, color=ORANGE, scale_factor=1.03), run_time=0.8)
        zero_side = "오른쪽" if inner else "왼쪽"
        col = BLUE if inner else PURPLE
        zero = p2[3][1] if inner else p2[3][-2]
        ring = SurroundingRectangle(zero, color=col, buff=0.06, stroke_width=5)
        self.say(f"③ 그 변이 {span('0', col)}인 쪽 눈금을 읽어요", f"셋째, 밑금에 맞춘 변이 {zero_side}에 있으니, {zero_side}이 0인 {'안쪽' if inner else '바깥쪽'} 눈금을 읽어요.")
        self.play(Create(ring), Indicate(zero, color=col, scale_factor=1.6), run_time=0.9)
        tip = v + unit(start + deg) * 3.3
        dot = Dot(tip, radius=0.11, color=GREEN)
        ans = M(f"{g(str(val) + '°')}", 72).move_to([4.6, 1.6, 0] if inner else [-4.6, 1.6, 0])
        self.say(f"다른 변과 만나는 눈금 → {g(str(val) + '°')}", f"0에서부터 세어 가다가 다른 변과 만나는 눈금을 읽으면 {val}도예요.")
        self.play(FadeIn(dot, scale=2), run_time=0.5)
        self.play(FadeIn(ans, scale=1.3), run_time=0.6)
        if not inner:
            self.say(f"안쪽 눈금 {span('55', BLUE)}로 읽으면 틀려요!", "반대쪽 안쪽 눈금 55로 읽지 않도록 조심해요. 이 각은 직각보다 크니까 90도보다 커야 해요.")
            self.wait(0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        if not inner:
            self.hide_chip()
