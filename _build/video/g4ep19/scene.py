"""「수학 원리 돋보기」 4학년 19화 — 밀면 무엇이 바뀔까? (4-1 4단원 평면도형의 이동 2차시, 화 코드 4-1-4-a)

밀면 위치만 바뀌고 모양·방향은 그대로 / 미는 방향(위·아래·왼·오른쪽)과 민 거리(□칸, □cm)를 함께 말함
여러 번 밀어도 모양은 그대로
최종: GRADE=4 ./make_final.sh 19
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Arrow, Create, DashedVMobject, FadeIn, FadeOut, Indicate, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, g, o
from division import clear_stage
from move import grid, shape_on


class G4Ep19(EpisodeScene):
    GRADE, SEM = 4, 1
    EP_NO = 19
    EP_TITLE = "밀면 무엇이 바뀔까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.slide_right()
        self.slide_more()
        self.closing(f"도형을 밀면 {o('위치')}만 바뀌고\n{g('모양과 방향')}은 그대로예요",
                     next_preview="4학년 20화 · 뒤집으면 무엇이 바뀔까?")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("이 도형을 오른쪽으로 밀면 어떻게 될까요?", 48)
        q.scale_to_fit_width(min(q.width, 10.4)).move_to([0.6, 2.25, 0])
        gd = grid(14, 6, 0.6, [0, -0.5, 0])
        sh = shape_on(gd, 1, 1)
        self.say("밀면 무엇이 바뀔까요?", "도형을 오른쪽으로 밀면 무엇이 바뀌고, 무엇이 그대로일까요?")
        self.play(Write(q), FadeIn(gd), FadeIn(sh), run_time=1.2)
        self.wait(1.0)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def slide_right(self):
        self.section("오른쪽으로 밀기")
        gd = grid(14, 6, 0.6, [0, -0.3, 0])
        sh = shape_on(gd, 1, 1)
        ghost = shape_on(gd, 1, 1, color=SOFT, mark=False).set_opacity(0.25)
        self.say("모눈 위에 도형을 놓아요", "모눈 위에 도형을 놓았어요. 오른쪽 위에 주황 점이 있어요.")
        self.play(FadeIn(gd), FadeIn(sh), run_time=0.7)
        self.add(ghost)
        self.bring_to_front(sh)
        self.say(f"{o('오른쪽')}으로 {o('7칸')} 밀어요", "이 도형을 오른쪽으로 7칸 밀어 볼까요?")
        arr = Arrow(gd.pt(4.3, 2.5), gd.pt(8.3, 2.5), color=ORANGE, buff=0, stroke_width=8)
        self.play(Create(arr), run_time=0.5)
        self.play(sh.animate.shift(RIGHT * 7 * gd.s), run_time=1.6)
        self.say(f"{o('위치')}만 바뀌었어요", "도형의 위치만 바뀌었어요. 모양도, 주황 점이 있는 방향도 그대로예요.")
        self.play(Indicate(sh, color=GREEN, scale_factor=1.05), run_time=0.8)
        m = M(f"오른쪽으로 7칸 밀기 → 위치만 바뀜, {g('모양·방향 그대로')}", 40).move_to([0, 2.45, 0]).shift(RIGHT * 0.6)
        m.scale_to_fit_width(min(m.width, 10.6))
        self.play(FadeIn(m), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def slide_more(self):
        self.section("여러 방향으로 밀기")
        gd = grid(14, 6, 0.6, [0, -0.3, 0])
        sh = shape_on(gd, 2, 0)
        self.say("이번에는 위로, 그리고 오른쪽으로", "이번에는 도형을 위쪽으로 2칸, 그다음 오른쪽으로 5칸 밀어 볼까요?")
        self.play(FadeIn(gd), FadeIn(sh), run_time=0.6)
        for tr in [shape_on(gd, 2, 0, color=SOFT, mark=False).set_opacity(0.2)]:
            self.add(tr)
        self.bring_to_front(sh)
        self.play(sh.animate.shift(UP * 2 * gd.s), run_time=1.0)
        self.add(shape_on(gd, 2, 2, color=SOFT, mark=False).set_opacity(0.2))
        self.bring_to_front(sh)
        self.play(sh.animate.shift(RIGHT * 5 * gd.s), run_time=1.3)
        self.say(f"방향과 {o('거리')}를 함께 말해요", "밀기를 설명할 때는 어느 쪽으로 몇 칸, 또는 몇 센티미터 밀었는지 방향과 거리를 함께 말해요.")
        t = M(f"위쪽으로 {o('2칸')}, 오른쪽으로 {o('5칸')}", 50).move_to([0.6, 2.45, 0])
        self.play(FadeIn(t), run_time=0.5)
        self.say(f"몇 번을 밀어도 {g('모양은 그대로')}", "여러 번 밀어도 도형의 모양과 방향은 변하지 않아요.")
        self.play(Indicate(sh, color=GREEN, scale_factor=1.05), run_time=0.8)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
