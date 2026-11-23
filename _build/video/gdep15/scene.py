"""「수학 원리 돋보기」 나눗셈 차근차근 15화 — 세 자리 수 나누기, 몫은 몇 자리?

345 ÷ 3 = 115(백의 자리부터) / 125 ÷ 5: 백의 자리 1은 5로 나눌 수 없음 → 십의 자리까지 12로 → 몫은 두 자리 25
612 ÷ 3 = 204: 십의 자리 1은 3으로 나눌 수 없음 → 몫의 십의 자리에 0
최종: GRADE=d ./make_final.sh 15
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, SurroundingRectangle, VGroup, Write

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, M, T, b, g, o
from division import clear_stage, long_division_n
from divkit import DivScene
from items import check_mark


class GdEp15(DivScene):
    EP_NO = 15
    EP_TITLE = "세 자리 수 나누기, 몫은 몇 자리?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        long_division_n(self, 345, 3, who="모둠", unit="개", title="345 ÷ 3: 백의 자리부터")
        self.digits()
        self.zero()
        long_division_n(self, 612, 3, who="모둠", unit="개", title="612 ÷ 3: 몫에 0이 들어가요")
        self.closing(f"먼저 {o('가장 큰 자리')}를 나눌 수 있는지 보아요 → 몫이 몇 자리인지 알 수 있어요\n나눌 수 없는 자리의 몫에는 {g('0')}을 써요",
                     next_preview="나눗셈 차근차근 16화 · 두 자리 수로 나누기: 몫 어림하기")
        self.wait(0.5)

    def digits(self):
        self.section("125 ÷ 5: 몫은 몇 자리?")
        q = M(f"{b('1')}25 ÷ {o('5')}", 90).move_to([0, 1.8, 0])
        self.say("125 ÷ 5, 몫은 몇 자리일까요?", "125 나누기 5의 몫은 몇 자리 수일까요?")
        self.play(Write(q), run_time=0.6)
        t1 = M(f"백의 자리 {b('1')}은 {o('5')}로 나눌 수 없어요 (1 &lt; 5)", 44).move_to([0, 0.5, 0])
        self.say("백의 자리 1은 5로 나눌 수 없어요", "가장 큰 자리부터 보아요. 백의 자리 1은 5보다 작아서 5로 나눌 수 없어요.")
        self.play(FadeIn(t1), Indicate(q, scale_factor=1.1), run_time=0.7)
        t2 = M(f"그래서 십의 자리까지 {b('12')}를 5로 나누어요 → 몫은 {g('십의 자리부터')}", 42).move_to([0, -0.4, 0])
        self.say(f"12부터 나누니 몫은 {g('두 자리')}", "그래서 십의 자리까지 묶어 12를 5로 나누어요. 몫은 십의 자리부터 시작하니 두 자리 수예요.")
        self.play(FadeIn(t2), run_time=0.6)
        t3 = M(f"125 ÷ 5 = {g('25')}  (확인: 5 × 25 = 125)", 52).move_to([0, -1.6, 0])
        self.say(f"125 ÷ 5 = {g('25')}", "계산하면 125 나누기 5는 25예요. 5 곱하기 25는 125로 맞아요.")
        self.play(FadeIn(t3), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def zero(self):
        self.section("몫에 0이 들어갈 때")
        q = M(f"6{b('1')}2 ÷ {o('3')}", 90).move_to([0, 1.6, 0])
        self.say("612 ÷ 3을 해 볼까요?", "612 나누기 3을 해 볼까요? 백의 자리 6을 3으로 나누면 2.")
        self.play(Write(q), run_time=0.6)
        t = M(f"십의 자리 {b('1')}은 3으로 나눌 수 없어요 → 몫의 십의 자리에 {g('0')}", 44).move_to([0, 0.2, 0])
        self.say(f"나눌 수 없는 자리는 몫에 {g('0')}", "그다음 십의 자리 1은 3보다 작아 나눌 수 없어요. 이럴 때는 몫의 십의 자리에 0을 써요.")
        self.play(FadeIn(t), run_time=0.6)
        w = M(f"0을 빼먹고 24라고 쓰면 {o('틀려요')}", 42, SOFT).move_to([0, -1.0, 0])
        self.say(f"0을 빼먹지 않기", "0을 빼먹고 24라고 쓰면 틀려요. 세로셈으로 자세히 볼까요?")
        self.play(FadeIn(w), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)
