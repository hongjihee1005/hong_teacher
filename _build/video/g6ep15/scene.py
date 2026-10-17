"""「수학 원리 돋보기」 6학년 15화 — 몫에 0이 있는 경우 (6-1 3단원 6차시, 화 코드 6-1-3-e)

2.14 L는 0.01 L가 214개, 214 ÷ 2 = 107 → 2.14 ÷ 2는 0.01이 107개인 1.07
세로셈: 2 ÷ 2 = 1, 1을 내렸는데 2로 나눌 수 없으므로 몫에 0, 4를 하나 더 내려 14 ÷ 2 = 7
최종: GRADE=6 ./make_final.sh 15
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, Cross, FadeIn, FadeOut, Indicate, LaggedStart, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from decdiv import DecDiv

RED = "#C0392B"


class G6Ep15(EpisodeScene):
    GRADE, SEM = 6, 1
    EP_NO = 15
    EP_TITLE = "몫에 0이 있는 경우"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.count()
        self.vertical()
        self.closing(f"내린 수가 나누는 수보다 작으면 몫에 {o('0')}을 쓰고\n{b('다음 자리 수를 하나 더')} 내려 계산해요",
                     next_preview="6학년 16화 · (자연수) ÷ (자연수)의 몫을 소수로")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("주스 2.14 L를 2명이 똑같이 나누어 마시면\n한 명은 몇 L를 마실까요?", 44).move_to([0.6, 1.6, 0])
        self.say("2.14 ÷ 2는?", "주스 2.14 리터를 2명이 똑같이 나누어 마시면 한 명은 몇 리터를 마실까요?")
        self.play(Write(q), run_time=1.0)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def count(self):
        self.section("0.01이 몇 개?")
        a = M(f"2.14 L = {o('0.01 L')}가 214개", 46).move_to([0, 1.8, 0])
        self.say(f"2.14는 {o('0.01')}이 214개", "2.14 리터는 0.01 리터가 214개예요.")
        self.play(FadeIn(a), run_time=0.5)
        e = M(f"214 ÷ 2 = {o('107')}", 50).move_to([0, 0.6, 0])
        self.say(f"214 ÷ 2 = {o('107')}", "214 나누기 2는 107이에요.")
        self.play(FadeIn(e), run_time=0.5)
        r = M(f"0.01이 107개 = {g('1.07')}", 50).move_to([0, -0.6, 0])
        self.say(f"0.01이 107개 = {g('1.07')}", "0.01이 107개이면 1.07이에요. 몫의 소수 첫째 자리에 0이 있어요.")
        self.play(FadeIn(r), run_time=0.5)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def vertical(self):
        self.section("세로셈")
        d = DecDiv(self, "2.14", "2", x_left=-2.8, y0=1.5)
        self.say("세로셈으로 계산해요", "세로셈으로 계산해 볼게요.")
        d.show()
        self.say("2 ÷ 2 = 1", "2 나누기 2는 1.")
        d.quot(0, "1")
        d.qdot()
        d.row("2", 0, 1)
        d.line(0, 0, 1)
        r1 = d.row("1", 1, 2, ORANGE)
        t = M(f"1은 2로 나눌 수 없어요\n→ 몫에 {o('0')}", 32).move_to([3.4, 1.6, 0])
        self.say(f"1 ÷ 2는 안 돼요 → 몫에 {o('0')}", "1을 내렸는데 1은 2로 나눌 수 없어요. 그래서 몫의 소수 첫째 자리에 0을 써요.")
        self.play(FadeIn(t), run_time=0.5)
        z = d.quot(1, "0", ORANGE)
        self.play(Indicate(z, color=ORANGE, scale_factor=1.6), run_time=0.6)
        self.say(f"4를 하나 더 내려 {o('14')} ÷ 2 = 7", "4를 하나 더 내려 14 나누기 2는 7이에요.")
        r14 = d.row("14", 2, 2, ORANGE)
        self.play(FadeOut(r1), run_time=0.2)
        d.quot(2, "7")
        d.row("14", 2, 3)
        d.line(1, 2, 3)
        d.row("0", 2, 4)
        wrong = M("1.7은 틀린 답", 36, RED).move_to([3.4, 0.0, 0])
        r = M(f"2.14 ÷ 2 = {g('1.07')}", 48).move_to([3.4, -0.9, 0])
        self.say(f"0을 빠뜨리면 1.7이 돼요", "몫에 0을 쓰지 않으면 1.7이 되어 틀려요. 2.14 나누기 2는 1.07이에요.")
        self.play(FadeIn(wrong), run_time=0.4)
        self.play(FadeIn(r), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
