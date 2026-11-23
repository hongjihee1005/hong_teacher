"""「수학 원리 돋보기」 개념 차근차근 13화 — 0을 더하고 빼면?

3 + 0 = 3(접시에 아무것도 안 넣음) / 0 + 4 = 4 / 5 − 0 = 5(아무것도 안 덜어 냄) / 5 − 5 = 0(모두 덜어 냄)
연습: 7 + 0, 9 − 9, 0 + 6, 8 − 0
최종: GRADE=c ./make_final.sh 13
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

class GcEp13(ConceptScene):
    EP_NO = 13
    EP_TITLE = "0을 더하고 빼면?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.add0()
        self.sub0()
        self.subself()
        self.practice()
        self.closing(f"어떤 수에 {g('0')}을 더하거나 빼도 그 수 그대로\n같은 수끼리 빼면 {g('0')}: 5 − 5 = 0",
                     next_preview="개념 차근차근 14화 · 10을 만들어 더하기 (8 + 5)")
        self.wait(0.5)

    def add0(self):
        self.section("0을 더하면")
        a = dots(3, RED, cols=3, step=0.8, r=0.3).move_to([-3.0, 1.0, 0])
        plate = M("빈 접시", 36, SOFT).move_to([3.0, 1.0, 0])
        self.say("사과 3개에 빈 접시의 사과를 더하면?", "사과 3개가 있어요. 옆의 빈 접시에는 사과가 하나도 없어요. 둘을 모으면 몇 개일까요?")
        self.play(FadeIn(a), FadeIn(plate), run_time=0.6)
        e = M(f"3 + {g('0')} = 3", 90).move_to([0, -0.6, 0])
        self.say(f"3 + 0 = 3, 그대로", "아무것도 더하지 않았으니 그대로 3개. 3 더하기 0은 3이에요.")
        self.play(Write(e), run_time=0.6)
        t = M(f"{g('0')} + 4 = 4 도 마찬가지", 44).move_to([0, -1.8, 0])
        self.play(FadeIn(t), run_time=0.4)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.5)

    def sub0(self):
        self.section("0을 빼면")
        a = dots(5, ORANGE, cols=5, step=0.8, r=0.3).move_to([0, 1.2, 0])
        self.say("쿠키 5개 중 하나도 안 먹으면?", "쿠키 5개 중 하나도 먹지 않으면 몇 개 남을까요?")
        self.play(FadeIn(a), run_time=0.5)
        e = M(f"5 − {g('0')} = 5", 90).move_to([0, -0.6, 0])
        self.say("5 − 0 = 5, 그대로", "아무것도 덜어 내지 않았으니 그대로 5개. 5 빼기 0은 5예요.")
        self.play(Write(e), run_time=0.6)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.5)

    def subself(self):
        self.section("같은 수를 빼면")
        a = dots(5, ORANGE, cols=5, step=0.8, r=0.3).move_to([0, 1.2, 0])
        self.say("쿠키 5개를 모두 먹으면?", "이번에는 쿠키 5개를 모두 먹었어요.")
        self.play(FadeIn(a), run_time=0.4)
        self.play(FadeOut(a, lag_ratio=0.15), run_time=1.0)
        e = M(f"5 − 5 = {g('0')}", 90).move_to([0, -0.6, 0])
        self.say(f"5 − 5 = {g('0')}", "남은 것이 하나도 없어요. 5 빼기 5는 0. 같은 수끼리 빼면 0이 돼요.")
        self.play(Write(e), run_time=0.6)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.5)

    def practice(self):
        self.section("연습해요")
        qs = VGroup(*[M(x, 64) for x in ["① 7 + 0", "② 9 − 9", "③ 0 + 6", "④ 8 − 0"]]).arrange_in_grid(rows=2, buff=(1.6, 0.6)).move_to([0, 0.9, 0])
        self.say("네 문제를 풀어 보세요", "연습해 볼까요? 네 문제를 풀어 보세요.")
        self.play(FadeIn(qs, lag_ratio=0.2), run_time=0.8)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        ans = VGroup(*[M(f"= {g(v)}", 64).next_to(q, RIGHT, buff=0.3) for q, v in zip(qs, ["7", "0", "6", "8"])])
        self.say("7, 0, 6, 8", "7 더하기 0은 7, 9 빼기 9는 0, 0 더하기 6은 6, 8 빼기 0은 8이에요.")
        self.play(FadeIn(ans, lag_ratio=0.2), run_time=0.8)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
