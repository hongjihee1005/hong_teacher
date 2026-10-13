"""「수학 원리 돋보기」 50화 — 0.1은 어떤 수일까? (1학기 6단원 8·9차시, 화 코드 1-6-d)

1을 10칸으로 → 한 칸 1/10 = 0.1 → 0.1, 0.2 … 0.9 → 0.1이 10개면 1 → 9와 0.3 = 9.3 → 9 cm 3 mm = 9.3 cm
최종: ./make_final.sh 50
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import DOWN, LEFT, RIGHT, UP, FadeIn, Indicate, LaggedStart, Transform, VGroup, Write

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from fraction import frac, frac_bar, row


class Ep50(EpisodeScene):
    EP_NO = 50
    EP_TITLE = "0.1은 어떤 수일까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.tenth()
        self.count()
        self.over_one()
        self.cm()
        self.closing(f"1을 10칸으로 똑같이 나눈 한 칸 → {o('0.1')} (10분의 1)\n{o('0.1')}이 10개이면 {g('1')}",
                     next_preview="51화 · 소수의 크기 비교")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M(f"색 테이프 길이가 9 cm보다 길고 10 cm보다 짧아요.\n{g('cm')}로만 나타낼 수 있을까요?", 50)
        q.scale_to_fit_width(min(q.width, 11.4)).move_to([0, 0.8, 0])
        self.say("9 cm와 10 cm 사이의 길이", "색 테이프 길이가 9 cm보다 길고 10 cm보다 짧아요. cm로만 나타낼 수 있을까요?")
        self.play(Write(q), run_time=1.2)
        self.wait(1.2)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def tenth(self):
        self.section("10분의 1")
        bar = frac_bar(10, 1, width=9.0, height=0.9).move_to([0, 1.2, 0])
        self.say("1을 똑같이 10칸으로 나누어요", "전체 1을 똑같이 10칸으로 나누었어요. 한 칸은 10분의 1이에요.")
        self.play(FadeIn(bar), run_time=0.6)
        r = row(frac(1, 10, 64, cn=ORANGE), "=", f"{o('0.1')}", size=72).move_to([0, -0.4, 0])
        self.say(f"10분의 1을 {o('0.1')}이라 쓰고 '영 점 일'", "10분의 1을 0.1이라 쓰고 영 점 일이라고 읽어요.")
        self.play(FadeIn(r), run_time=0.6)
        t = M(f"0.1, 0.2처럼 나타낸 수 → {g('소수')},  '.' → 소수점", 42).move_to([0, -1.9, 0])
        self.say(f"이런 수를 {g('소수')}라고 해요", "이런 수를 소수라 하고, 점을 소수점이라고 해요.")
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def count(self):
        self.section("0.1씩 늘려 보기")
        bar = frac_bar(10, 0, width=9.0, height=0.9).move_to([0, 1.2, 0])
        self.play(FadeIn(bar), run_time=0.4)
        lab = M(f"{o('0.1')}", 80).move_to([0, -0.5, 0])
        self.say("0.1씩 하나씩 색칠해요", "0.1씩 하나씩 색칠해 볼게요.")
        for k in range(10):
            txt = f"{o(f'0.{k + 1}')}" if k < 9 else f"0.1이 10개 = {g('1')}"
            new = M(txt, 80 if k < 9 else 70).move_to([0, -0.5, 0])
            if k == 0:
                self.play(bar[0].animate.set_fill(ORANGE), FadeIn(new), run_time=0.4)
                lab = new
            else:
                self.play(bar[k].animate.set_fill(ORANGE), Transform(lab, new), run_time=0.4)
        self.say(f"0.1이 10개이면 {g('1')}", "0.1이 10개 모이면 1이 돼요.")
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def over_one(self):
        self.section("1보다 큰 소수")
        r = M(f"{b('9')}와 {o('0.3')}만큼 → {g('9.3')} (구 점 삼)", 60).move_to([0, 0.8, 0])
        self.say(f"9와 0.3만큼은 {g('9.3')}", "9와 0.3만큼을 9.3이라 쓰고 구 점 삼이라고 읽어요.")
        self.play(FadeIn(r), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def cm(self):
        self.section("cm로 나타내기")
        l1 = M(f"1 mm = {o('0.1 cm')}", 64).move_to([0, 1.4, 0])
        l2 = M(f"9 cm {o('3 mm')} = 9 cm + {o('0.3 cm')} = {g('9.3 cm')}", 56).move_to([0, 0.1, 0])
        self.say(f"1 mm는 1 cm의 10분의 1 → {o('0.1 cm')}", "1 mm는 1 cm를 10칸으로 나눈 한 칸이니까 0.1 cm예요.")
        self.play(FadeIn(l1), run_time=0.5)
        self.say(f"9 cm 3 mm = {g('9.3 cm')}", "그래서 9 cm 3 mm는 9.3 cm로 나타낼 수 있어요.")
        self.play(FadeIn(l2), run_time=0.5)
        self.wait(1.6)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
