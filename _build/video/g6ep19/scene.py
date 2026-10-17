"""「수학 원리 돋보기」 6학년 19화 — 비란? (6-1 4단원 3차시, 화 코드 6-1-4-b)

한 양을 기준으로 다른 양이 몇 배가 되는지 비교하기 위해 기호 : 을 사용하여 나타낸 것 = 비
1 : 4 → 1 대 4, 1과 4의 비, 1의 4에 대한 비, 4에 대한 1의 비
기호 : 의 오른쪽 4가 기준량, 왼쪽 1이 비교하는 양 (1 : 4와 4 : 1은 다름)
(예시 상황 '포도 원액 1컵, 물 4컵'은 이 영상에서 정한 것)
최종: GRADE=6 ./make_final.sh 19
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Brace, Create, FadeIn, FadeOut, Indicate, LaggedStart, Rectangle, VGroup,
                   Write)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage

PURPLE = "#7A4FB5"


def cups(n, color, s=0.7):
    return VGroup(*[Rectangle(width=s, height=s * 1.2, fill_color=color, fill_opacity=0.8, stroke_color=INK, stroke_width=3) for _ in range(n)]).arrange(RIGHT, buff=0.15)


class G6Ep19(EpisodeScene):
    GRADE, SEM = 6, 1
    EP_NO = 19
    EP_TITLE = "비란?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.ratio()
        self.read()
        self.order()
        self.closing(f"기호 : 를 써서 두 양을 비교한 것이 {g('비')}\n{o('왼쪽')}은 비교하는 양, {b('오른쪽')}은 기준량",
                     next_preview="6학년 20화 · 비율이란?")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("포도 원액 1컵에 물 4컵을 섞어 주스를 만들어요.\n두 양을 기호로 간단히 나타낼 수 있을까요?", 40).move_to([0.6, 1.8, 0])
        self.say("기호로 나타낼 수 있을까요?", "포도 원액 1컵에 물 4컵을 섞어 주스를 만들어요. 원액과 물의 양을 기호로 간단히 나타낼 수 있을까요?")
        self.play(Write(q), run_time=1.0)
        a = cups(1, PURPLE).move_to([-2.4, -0.3, 0])
        w = cups(4, BLUE).move_to([1.4, -0.3, 0])
        self.play(FadeIn(a), FadeIn(w), run_time=0.6)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def ratio(self):
        self.section("비 1 : 4")
        a = cups(1, PURPLE).move_to([-2.6, 1.5, 0])
        w = cups(4, BLUE).move_to([1.2, 1.5, 0])
        la = T("원액", 28, PURPLE).next_to(a, DOWN, buff=0.15)
        lw = T("물", 28, BLUE).next_to(w, DOWN, buff=0.15)
        self.play(FadeIn(a), FadeIn(w), FadeIn(la), FadeIn(lw), run_time=0.5)
        r = VGroup(T("1", 96, PURPLE), T(":", 96), T("4", 96, BLUE)).arrange(RIGHT, buff=0.35).move_to([0, -0.4, 0])
        self.say(f"기호 : 로 {g('1 : 4')}", "물의 양을 기준으로 원액의 양을 비교해 기호 쌍점을 써서 1 대 4로 나타내요. 이것을 비라고 해요.")
        self.play(Write(r), run_time=0.9)
        bl = Brace(r[0], DOWN, color=ORANGE)
        br = Brace(r[2], DOWN, color=BLUE)
        tl = M(o("비교하는 양"), 32).next_to(bl, DOWN, buff=0.1).shift(LEFT * 0.9)
        tr = M(b("기준량"), 32).next_to(br, DOWN, buff=0.1).shift(RIGHT * 0.6)
        self.say(f"오른쪽은 {b('기준량')}, 왼쪽은 {o('비교하는 양')}", "기호의 오른쪽에 있는 4가 기준이 되는 양, 기준량이고 왼쪽에 있는 1이 비교하는 양이에요.")
        self.play(FadeIn(br), FadeIn(tr), run_time=0.5)
        self.play(FadeIn(bl), FadeIn(tl), run_time=0.5)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def read(self):
        self.section("비를 읽는 방법")
        r = M("1 : 4", 80).move_to([0, 1.9, 0])
        self.play(FadeIn(r), run_time=0.4)
        ways = ["1 대 4", "1과 4의 비", f"1의 {b('4에 대한')} 비", f"{b('4에 대한')} 1의 비"]
        ls = VGroup(*[M(w_, 40) for w_ in ways]).arrange(DOWN, buff=0.32).move_to([0, -0.2, 0])
        self.say("네 가지로 읽어요", "1 대 4는 1과 4의 비, 1의 4에 대한 비, 4에 대한 1의 비라고도 읽어요. '에 대한'이 붙은 수가 기준량이에요.")
        self.play(LaggedStart(*[FadeIn(l, shift=UP * 0.2) for l in ls], lag_ratio=0.35, run_time=1.6))
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def order(self):
        self.section("순서가 바뀌면")
        a = M("1 : 4", 70).move_to([-3.0, 1.2, 0])
        b_ = M("4 : 1", 70).move_to([3.0, 1.2, 0])
        ta = M(f"물 {b('4')}을 기준으로 원액 1", 32).next_to(a, DOWN, buff=0.35)
        tb = M(f"원액 {b('1')}을 기준으로 물 4", 32).next_to(b_, DOWN, buff=0.35)
        ne = M("≠", 80, ORANGE).move_to([0, 1.2, 0])
        self.say(f"1 : 4와 4 : 1은 {o('달라요')}", "1 대 4와 4 대 1은 기준량이 달라서 서로 다른 비예요. 비는 순서가 중요해요.")
        self.play(FadeIn(a), FadeIn(b_), FadeIn(ne), run_time=0.6)
        self.play(FadeIn(ta), FadeIn(tb), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
