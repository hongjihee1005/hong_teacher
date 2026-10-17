"""「수학 원리 돋보기」 5학년 53화 — 겨냥도 (5-2 5단원 3차시, 화 코드 5-2-5-b)

직육면체 모양을 잘 알 수 있게 나타낸 그림 = 겨냥도: 보이는 모서리 실선, 보이지 않는 모서리 점선
보이는 면 3 / 안 보이는 면 3, 보이는 모서리 9 / 안 보이는 모서리 3, 보이는 꼭짓점 7 / 안 보이는 꼭짓점 1
최종: GRADE=5 ./make_final.sh 53
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, DashedLine, Dot, FadeIn, FadeOut, Indicate, LaggedStart, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from cuboid import Cuboid, HIDDEN_V

RED = "#C0392B"


class G5Ep53(EpisodeScene):
    GRADE, SEM = 5, 2
    EP_NO = 53
    EP_TITLE = "겨냥도"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.draw()
        self.count()
        self.closing(f"겨냥도는 보이는 모서리를 {o('실선')}, 보이지 않는 모서리를 {b('점선')}으로\n숨은 모서리 {g('3개')}, 숨은 꼭짓점 {g('1개')}",
                     next_preview="5학년 54화 · 직육면체의 성질")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("상자 뒤쪽의 보이지 않는 모서리는\n어떻게 그리면 좋을까요?", 44).move_to([0.6, 1.9, 0])
        cb = Cuboid(3.0, 1.8, 2.4, [0, -0.8, 0])
        box = VGroup(cb.face("front", "#C98B4B", 0.8), cb.face("top", "#E0AE74", 0.8), cb.face("right", "#A8743E", 0.8), cb.edges(show_hidden=False))
        self.say("보이지 않는 모서리", "상자를 보면 뒤쪽 모서리는 보이지 않아요. 직육면체 모양을 잘 알 수 있게 그리려면 어떻게 할까요?")
        self.play(Write(q), FadeIn(box), run_time=1.2)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def draw(self):
        self.section("겨냥도 그리기")
        cb = Cuboid(3.6, 2.2, 2.6, [-2.8, 0.1, 0])
        vis = cb.edges(show_hidden=False)
        self.say(f"보이는 모서리는 {o('실선')}", "보이는 모서리는 실선으로 그려요.")
        self.play(Create(vis), run_time=1.2)
        hid = VGroup(*[DashedLine(cb.v[i], cb.v[j], color=BLUE, stroke_width=5, dash_length=0.14) for i, j in cb.hidden()])
        self.say(f"보이지 않는 모서리는 {b('점선')}", "보이지 않는 뒤쪽 모서리는 점선으로 그려요.")
        self.play(Create(hid), run_time=1.0)
        t = M(f"직육면체 모양을 잘 알 수 있게\n나타낸 그림 = {g('겨냥도')}", 40).move_to([3.3, 0.6, 0])
        self.say(f"이런 그림이 {g('겨냥도')}", "이렇게 직육면체 모양을 잘 알 수 있도록 나타낸 그림을 직육면체의 겨냥도라고 해요.")
        self.play(FadeIn(t), run_time=0.6)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def count(self):
        self.section("보이는 것과 보이지 않는 것")
        cb = Cuboid(3.4, 2.0, 2.4, [-3.4, 0.2, 0])
        vis = cb.edges(show_hidden=False)
        hid = VGroup(*[DashedLine(cb.v[i], cb.v[j], color=BLUE, stroke_width=5, dash_length=0.14) for i, j in cb.hidden()])
        faces = VGroup(cb.face("front", ORANGE, 0.35), cb.face("top", ORANGE, 0.25), cb.face("right", ORANGE, 0.3))
        self.play(FadeIn(faces), FadeIn(vis), FadeIn(hid), run_time=0.6)
        hv = Dot(cb.v[HIDDEN_V], radius=0.12, color=RED)
        rows = VGroup(
            M(f"면: 보이는 {o('3')}, 안 보이는 {b('3')}", 38),
            M(f"모서리: 보이는 {o('9')}, 안 보이는 {b('3')}", 38),
            M(f"꼭짓점: 보이는 {o('7')}, 안 보이는 {b('1')}", 38),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.45).move_to([2.6, 0.4, 0])
        self.say(f"보이는 면 {o('3')}개, 안 보이는 면 {b('3')}개", "겨냥도에서 보이는 면은 3개, 보이지 않는 면도 3개예요.")
        self.play(FadeIn(rows[0]), Indicate(faces, color=ORANGE), run_time=0.8)
        self.say(f"보이는 모서리 {o('9')}개, 점선 {b('3')}개", "보이는 모서리는 9개, 점선으로 그린 보이지 않는 모서리는 3개예요.")
        self.play(FadeIn(rows[1]), Indicate(hid, color=BLUE), run_time=0.8)
        self.say(f"보이지 않는 꼭짓점은 {b('1')}개", "꼭짓점은 7개가 보이고, 점선 세 개가 만나는 1개는 보이지 않아요.")
        self.play(FadeIn(rows[2]), FadeIn(hv, scale=2), run_time=0.8)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
