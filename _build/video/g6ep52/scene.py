"""「수학 원리 돋보기」 6학년 52화 — 비례식 (6-2 4단원 4차시, 화 코드 6-2-4-c)

비율이 같은 두 비를 기호 =를 사용하여 6 : 20 = 12 : 40과 같이 나타낸 식 = 비례식
바깥쪽 6과 40 = 외항, 안쪽 20과 12 = 내항
최종: GRADE=6 ./make_final.sh 52
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, ArcBetweenPoints, Create, FadeIn, FadeOut, Indicate, LaggedStart, VGroup,
                   Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from fraction import frac, row


def prop(a, bb, c, d, size=96, y=0.6):
    g_ = VGroup(T(str(a), size), T(":", size), T(str(bb), size), T("=", size), T(str(c), size), T(":", size), T(str(d), size))
    g_.arrange(RIGHT, buff=0.35).move_to([0, y, 0])
    return g_


class G6Ep52(EpisodeScene):
    GRADE, SEM = 6, 2
    EP_NO = 52
    EP_TITLE = "비례식"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.same_rate()
        self.names()
        self.closing(f"비율이 같은 두 비를 = 로 나타낸 식이 {g('비례식')}\n바깥쪽 두 수는 {o('외항')}, 안쪽 두 수는 {b('내항')}",
                     next_preview="6학년 53화 · 비례식의 성질")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("비 6 : 20과 12 : 40은 비율이 같아요.\n두 비를 하나의 식으로 나타낼 수 있을까요?", 42).move_to([0.6, 1.6, 0])
        self.say("하나의 식으로?", "비 6 대 20과 12 대 40은 비율이 같아요. 이 두 비를 하나의 식으로 나타낼 수 있을까요?")
        self.play(Write(q), run_time=1.0)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def same_rate(self):
        self.section("비율이 같은 두 비")
        a = row("6 : 20  →", frac(6, 20, 46), "=", frac(3, 10, 46, cn=GREEN, cd=GREEN), size=46).move_to([-3.0, 1.5, 0])
        bb = row("12 : 40  →", frac(12, 40, 46), "=", frac(3, 10, 46, cn=GREEN, cd=GREEN), size=46).move_to([3.0, 1.5, 0])
        self.say(f"두 비의 비율은 모두 {g('3/10')}", "6 대 20의 비율은 20분의 6, 약분하면 10분의 3. 12 대 40의 비율도 10분의 3이에요.")
        self.play(FadeIn(a), FadeIn(bb), run_time=0.7)
        p = prop(6, 20, 12, 40, 90, -0.4)
        self.say(f"= 로 이어 {g('비례식')}", "비율이 같은 두 비를 기호 등호를 써서 6 대 20은 12 대 40과 같이 나타낸 식을 비례식이라고 해요.")
        self.play(Write(p), run_time=1.0)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def names(self):
        self.section("외항과 내항")
        p = prop(6, 20, 12, 40, 100, 0.5)
        self.play(FadeIn(p), run_time=0.5)
        outer = ArcBetweenPoints(p[0].get_top() + UP * 0.15, p[6].get_top() + UP * 0.15, angle=-0.6, color=ORANGE, stroke_width=6)
        inner = ArcBetweenPoints(p[2].get_bottom() + DOWN * 0.15, p[4].get_bottom() + DOWN * 0.15, angle=0.8, color=BLUE, stroke_width=6)
        to = M(o("외항"), 40).next_to(outer, UP, buff=0.1)
        ti = M(b("내항"), 40).next_to(inner, DOWN, buff=0.1)
        self.say(f"바깥쪽 6과 40은 {o('외항')}", "비례식에서 바깥쪽에 있는 6과 40을 외항이라고 해요.")
        self.play(p[0].animate.set_color(ORANGE), p[6].animate.set_color(ORANGE), Create(outer), FadeIn(to), run_time=0.8)
        self.say(f"안쪽 20과 12는 {b('내항')}", "안쪽에 있는 20과 12를 내항이라고 해요.")
        self.play(p[2].animate.set_color(BLUE), p[4].animate.set_color(BLUE), Create(inner), FadeIn(ti), run_time=0.8)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
