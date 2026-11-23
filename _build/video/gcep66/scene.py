"""「수학 원리 돋보기」 개념 차근차근 66화 — 수 배열에서 규칙 찾기

수 배열 2, 5, 8, 11 … (3씩 커짐) / 덧셈표: 오른쪽으로 1씩, 대각선 / 곱셈표: 같은 줄은 그 단만큼 / 연습: 3, 6, 12, 24, ?
최종: GRADE=c ./make_final.sh 66
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
from fraction import frac, frac_bar, row
from manim import Rectangle, Square, Triangle, Circle


class GcEp66(ConceptScene):
    EP_NO = 66
    EP_TITLE = "수 배열에서 규칙 찾기"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.section("몇씩 커질까?")
        nums = VGroup(*[T(str(v), 64, INK) for v in (2, 5, 8, 11, 14)]).arrange(RIGHT, buff=0.9).move_to([0, 1.4, 0])
        self.say("2, 5, 8, 11, 14", "2, 5, 8, 11, 14. 수가 어떻게 바뀌나요?")
        self.play(FadeIn(nums, lag_ratio=0.2), run_time=0.8)
        ps = VGroup(*[M(f"{o('+3')}", 34).move_to((nums[k].get_center() + nums[k + 1].get_center()) / 2 + UP * 0.7) for k in range(4)])
        t = M(f"{o('3씩')} 커져요 → 다음은 {g('17')}", 52).move_to([0, -0.2, 0])
        self.say(f"{o('3씩')} 커져요", "이웃한 수의 차이가 모두 3. 3씩 커지는 규칙이라 다음은 17이에요.")
        self.play(FadeIn(ps, lag_ratio=0.2), FadeIn(t), run_time=0.8)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)
        self.step("덧셈표와 곱셈표의 규칙", [(f"덧셈표: 오른쪽으로 {b('1씩')}, 아래로 {b('1씩')} 커져요", 46, 1.2),
                  (f"곱셈표: 3단 줄은 {o('3씩')}, 5단 줄은 {o('5씩')} 커져요", 46, 0.2),
                  ("표에서도 줄마다 규칙을 찾을 수 있어요", 40, -0.8)],
                  "표에서 규칙 찾기", "덧셈표는 오른쪽이나 아래로 갈 때마다 1씩 커지고, 곱셈표는 3단 줄은 3씩, 5단 줄은 5씩 커져요.")
        self.ask("3, 6, 12, 24, ?", "?에 알맞은 수는?", "연습해 볼까요? 3, 6, 12, 24 다음에 올 수는 무엇일까요?",
                 f"{o('2배')}씩 커져요 → {g('48')}", f"{g('48')}", "더해서 커지는 게 아니라 2배씩 커져요. 24의 2배, 48이에요.")
        self.closing(f"수 배열에서 {o('몇씩')} 또는 {o('몇 배씩')} 바뀌는지 찾아요\n2, 5, 8, 11 → 3씩 / 3, 6, 12, 24 → 2배씩",
                     next_preview="개념 차근차근 67화 · 도형 배열과 계산식 배열")
        self.wait(0.5)
