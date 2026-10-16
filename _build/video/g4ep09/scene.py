"""「수학 원리 돋보기」 4학년 9화 — 예각과 둔각, 각도 어림 (4-1 2단원 각도 4·5차시, 화 코드 4-1-2-c)

0°보다 크고 직각보다 작은 각 = 예각, 직각보다 크고 180°보다 작은 각 = 둔각 (직각은 둘 다 아님)
놓인 방향·변의 길이와 상관없음 / 어림: 직각·삼각자의 30°·45°·60°와 비교해 '약 ○°' → 각도기로 확인
최종: GRADE=4 ./make_final.sh 9
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, DashedLine, Dot, FadeIn, FadeOut, Indicate, LaggedStart, Rotate,
                   Transform, ValueTracker, VGroup, Write, always_redraw)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, g, o
from division import clear_stage
from angle import PURPLE, angle_fig, protractor, unit
from geom import right_mark
from bignum import span

ACUTE, OBTUSE = "#1F8A70", "#C0392B"


def kind(d):
    if d < 89.5:
        return "예각", ACUTE
    if d <= 90.5:
        return "직각", ORANGE
    return "둔각", OBTUSE


class G4Ep09(EpisodeScene):
    GRADE, SEM = 4, 1
    EP_NO = 9
    EP_TITLE = "예각과 둔각, 각도 어림"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.sweep()
        self.turned()
        self.estimate()
        self.closing(f"직각보다 작은 각은 {span('예각', ACUTE)}, 직각보다 크고 180°보다 작은 각은 {span('둔각', OBTUSE)}\n어림은 {o('익숙한 각')}과 비교해 '약 ○°'로 나타내요",
                     next_preview="4학년 10화 · 각도의 합과 차")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("세 각을 직각과 비교해 두 무리로 나누어 보세요", 46)
        q.scale_to_fit_width(min(q.width, 10.4)).move_to([0.6, 2.25, 0])
        figs = VGroup(angle_fig([-5.6, -1.2, 0], 40, L=2.4), angle_fig([-1.2, -1.2, 0], 130, L=2.2, start=0),
                      angle_fig([2.8, -1.2, 0], 70, L=2.4))
        figs[1].shift(RIGHT * 1.2)
        self.say("직각보다 작은 각, 큰 각", "세 각을 직각과 비교해서 직각보다 작은 각과 큰 각으로 나누어 볼까요?")
        self.play(Write(q), run_time=1.0)
        self.play(LaggedStart(*[Create(f) for f in figs], lag_ratio=0.3, run_time=1.4))
        self.wait(1.0)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def sweep(self):
        self.section("예각과 둔각")
        v = np.array([0, -2.0, 0])
        d = ValueTracker(20)
        ref = DashedLine(v, v + UP * 3.2, color=SOFT, dash_length=0.15, stroke_width=4)
        base = angle_fig(v, 0.5, L=3.6)
        ang = always_redraw(lambda: angle_fig(v, d.get_value(), L=3.6, arc_r=0.8, arc_color=kind(d.get_value())[1]))
        lab = always_redraw(lambda: T(kind(d.get_value())[0], 64, kind(d.get_value())[1]).move_to([-4.2, 1.2, 0]))
        deg = always_redraw(lambda: T(f"{int(round(d.get_value()))}°", 52, INK).move_to([-4.2, 0.1, 0]))
        rlab = T("직각", 32, SOFT).next_to(ref, UP, buff=0.1)
        self.say("한 변을 돌려 각을 키워 봐요", "한 변을 돌려서 각을 점점 크게 해 볼까요? 점선은 직각의 자리예요.")
        self.play(Create(ref), FadeIn(rlab), run_time=0.6)
        self.add(ang, lab, deg)
        self.wait(0.6)
        self.say(f"직각보다 작으면 {span('예각', ACUTE)}", "0도보다 크고 직각보다 작은 각을 예각이라고 해요.")
        self.play(d.animate.set_value(70), run_time=2.0)
        self.wait(0.4)
        self.say(f"딱 {o('90°')}는 직각", "딱 90도는 직각이에요. 직각은 예각도 둔각도 아니에요.")
        self.play(d.animate.set_value(90), run_time=0.9)
        rm = right_mark(v, v + RIGHT, v + UP, s=0.45)
        self.play(Create(rm), run_time=0.4)
        self.wait(0.6)
        self.play(FadeOut(rm), run_time=0.3)
        self.say(f"직각보다 크고 180°보다 작으면 {span('둔각', OBTUSE)}", "직각보다 크고 180도보다 작은 각을 둔각이라고 해요.")
        self.play(d.animate.set_value(160), run_time=2.0)
        self.wait(0.8)
        self.settle()
        ang.clear_updaters(); lab.clear_updaters(); deg.clear_updaters()
        clear_stage(self, 0.6)

    def turned(self):
        self.section("방향이 달라도")
        a = angle_fig([-4.4, -1.4, 0], 50, start=70, L=2.6)
        b = angle_fig([0.6, -0.4, 0], 120, start=200, L=2.2)
        c = angle_fig([4.6, -1.6, 0], 35, start=110, L=3.2, L2=1.4)
        self.say("돌려 놓아도 이름은 그대로", "각이 기울어져 있거나 변의 길이가 달라도, 이름은 각의 크기로 정해요.")
        self.play(LaggedStart(*[Create(x) for x in (a, b, c)], lag_ratio=0.3, run_time=1.4))
        labs = VGroup(T("예각", 46, ACUTE).next_to(a, DOWN, buff=0.2), T("둔각", 46, OBTUSE).move_to([0.6, -1.9, 0]),
                      T("예각", 46, ACUTE).next_to(c, DOWN, buff=0.2))
        self.play(LaggedStart(*[FadeIn(l, shift=UP * 0.2) for l in labs], lag_ratio=0.3, run_time=1.0))
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def estimate(self):
        self.section("각도 어림하기")
        v = np.array([-1.0, -1.9, 0])
        a = angle_fig(v, 52, L=4.2, arc_r=0.8)
        self.say("이 각은 약 몇 도일까요?", "이번에는 각도기 없이 이 각이 약 몇 도인지 어림해 볼까요?")
        self.play(Create(a), run_time=0.8)
        self.say("삼각자의 45°와 60°에 대 봐요", "삼각자에 있는 45도와 60도 각에 대어 보면 쉽게 어림할 수 있어요.")
        g45 = angle_fig(v, 45, L=3.4, color=SOFT, arc_r=1.6, arc_color=SOFT, width=4)
        g60 = angle_fig(v, 60, L=3.4, color=SOFT, arc_r=1.9, arc_color=SOFT, width=4)
        t45 = T("45°", 34, SOFT).move_to(v + unit(45) * 3.75)
        t60 = T("60°", 34, SOFT).move_to(v + unit(60) * 3.75)
        self.play(Create(g45), FadeIn(t45), run_time=0.7)
        self.play(Create(g60), FadeIn(t60), run_time=0.7)
        guess = M(f"45°보다 조금 크고 60°보다 작아요 → {o('약 50°')}", 44).move_to([0, 2.35, 0])
        guess.scale_to_fit_width(min(guess.width, 10.4)).shift(RIGHT * 0.6)
        self.say(f"어림한 각도: {o('약 50°')}", "45도보다 조금 크고 60도보다는 작으니까, 약 50도라고 어림할 수 있어요.")
        self.play(FadeIn(guess), run_time=0.6)
        self.wait(0.6)
        p = protractor(v, R=3.0, num_size=20)
        self.say("각도기로 재어 확인해요", "각도기로 재어 확인해 볼까요?")
        self.play(FadeOut(VGroup(g45, g60, t45, t60)), FadeIn(p), run_time=0.8)
        self.bring_to_front(a)
        tip = Dot(v + unit(52) * 3.0, radius=0.1, color=GREEN)
        real = M(f"잰 각도 {g('52°')}", 52).move_to([4.6, 0.4, 0])
        self.say(f"잰 각도는 {g('52°')} — 가깝게 어림했어요", "재어 보니 52도예요. 잰 각도에 가깝게 어림할수록 잘 어림한 거예요.")
        self.play(FadeIn(tip, scale=2), FadeIn(real), run_time=0.7)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
