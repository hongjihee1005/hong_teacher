"""「수학 원리 돋보기」 개념 차근차근 15화 — 10에서 빼기 (13 − 5)

방법 ① 10에서 빼기: 13을 10과 3으로 → 10 − 5 = 5, 5 + 3 = 8
방법 ② 두 번 나누어 빼기: 5를 3과 2로 → 13 − 3 = 10, 10 − 2 = 8 / 연습: 12 − 7, 15 − 8
최종: GRADE=c ./make_final.sh 15
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, Line, SurroundingRectangle, VGroup, Write

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, M, T, b, g, o
from division import clear_stage
from conceptkit import ConceptScene, dot, dots, ten_frame, RED
from items import check_mark, cross_mark
from storykit import book, scroll, show_sources

class GcEp15(ConceptScene):
    EP_NO = 15
    EP_TITLE = "10에서 빼기 (13 − 5)"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.way1()
        self.way2()
        self.practice()
        self.closing(f"① 10에서 빼고 남은 것과 더하기: (10 − 5) + 3 = {g('8')}\n② 10까지 먼저 빼고 더 빼기: 13 − 3 − 2 = {g('8')}",
                     next_preview="개념 차근차근 16화 · 두 자리 수 덧셈 세로셈")
        self.wait(0.5)

    def way1(self):
        self.section("방법 ① 10에서 빼기")
        f1 = ten_frame(10, BLUE, cell=0.7).move_to([-2.4, 1.2, 0])
        f2 = ten_frame(3, BLUE, cell=0.7).move_to([2.4, 1.2, 0])
        self.say("13 − 5는 얼마일까요?", "13 빼기 5는 얼마일까요? 13은 10칸 틀 하나가 꽉 찬 10과 3이에요.")
        self.play(FadeIn(f1), FadeIn(f2), run_time=0.7)
        xs = VGroup(*[cross_mark(0.3).move_to(f1[1][k]) for k in range(5, 10)])
        self.say(f"꽉 찬 10에서 {o('5')}를 빼요", "3에서는 5를 뺄 수 없으니, 꽉 찬 10에서 5를 빼요. 10 빼기 5는 5.")
        self.play(Create(xs, lag_ratio=0.15), run_time=0.8)
        e = M(f"10 − 5 = 5,  5 + 3 = {g('8')}", 60).move_to([0, -0.8, 0])
        self.say(f"남은 5와 3을 더해 {g('8')}", "남은 5와 옆의 3을 더하면 8. 13 빼기 5는 8이에요.")
        self.play(FadeIn(e), run_time=0.6)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def way2(self):
        self.section("방법 ② 나누어 빼기")
        e1 = M(f"5를 {o('3')}과 {o('2')}로 갈라요", 50).move_to([0, 1.4, 0])
        e2 = M(f"13 − {o('3')} = {g('10')}", 60).move_to([0, 0.3, 0])
        e3 = M(f"10 − {o('2')} = {g('8')}", 60).move_to([0, -0.8, 0])
        self.say("5를 3과 2로 갈라 두 번 빼기", "또 다른 방법이에요. 5를 3과 2로 갈라요. 먼저 3을 빼서 10을 만들고, 남은 2를 빼면 8.")
        self.play(FadeIn(e1), run_time=0.5)
        self.play(FadeIn(e2), run_time=0.5)
        self.play(FadeIn(e3), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def practice(self):
        self.section("연습해요")
        qs = VGroup(M("① 12 − 7", 70), M("② 15 − 8", 70)).arrange(RIGHT, buff=2.2).move_to([0, 1.4, 0])
        self.say("10을 이용해 빼 보세요", "연습해 볼까요? 10을 이용해 빼 보세요.")
        self.play(FadeIn(qs), run_time=0.5)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        a1 = M(f"① (10 − 7) + 2 = 3 + 2 = {g('5')}", 46).move_to([0, 0.0, 0])
        a2 = M(f"② (10 − 8) + 5 = 2 + 5 = {g('7')}", 46).move_to([0, -1.0, 0])
        self.say(f"{g('5')}와 {g('7')}", "12 빼기 7은 5, 15 빼기 8은 7이에요.")
        self.play(FadeIn(a1), FadeIn(a2), run_time=0.7)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
