"""「수학 원리 돋보기」 나눗셈 차근차근 20화 — 나눗셈과 분수는 친구

1 ÷ 4: 피자 1판을 4명이 → 한 사람 4분의 1판
3 ÷ 4: 피자 3판을 4명이 → 판마다 4분의 1씩 3조각 → 4분의 3판 → 3 ÷ 4 = 3/4
(나누어지는 수) ÷ (나누는 수) = 나누는 수분의 나누어지는 수 (6학년 1학기 분수의 나눗셈에서 배움) / 연습: 2 ÷ 5
최종: GRADE=d ./make_final.sh 20
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, ReplacementTransform, VGroup, Write

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, M, T, b, g, o
from division import clear_stage
from divkit import DivScene
from fraction import frac, pie, row

COLS = [ORANGE, BLUE, GREEN, "#B05FD0"]


class GdEp20(DivScene):
    EP_NO = 20
    EP_TITLE = "나눗셈과 분수는 친구"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.one()
        self.three()
        self.rule()
        self.practice()
        self.closing(f"나누어떨어지지 않아도 몫을 {g('분수')}로 나타낼 수 있어요\n{b('3')} ÷ {o('4')} = {o('4')}분의 {b('3')}",
                     next_preview="나눗셈 차근차근을 모두 마쳤어요! 분수 특별편도 보아요")
        self.wait(0.5)

    def one(self):
        self.section("1 ÷ 4")
        p = pie(4, 0, 1.4).move_to([-3.0, 0.3, 0])
        for k, s in enumerate(p):
            s.set_fill(COLS[k], 0.85)
        self.say("피자 1판을 4명이 똑같이", "피자 1판을 4명이 똑같이 나누어 먹으면, 한 사람은 얼마를 먹을까요?")
        self.play(FadeIn(p), run_time=0.6)
        a = row(M(f"1 ÷ {o('4')} =", 70), frac(1, 4, 70, cn=ORANGE, cd=BLUE), size=70).move_to([2.8, 0.3, 0])
        self.say(f"한 사람 {o('4분의 1')}판", "4조각 중 한 조각, 한 사람이 4분의 1판씩 먹어요. 1 나누기 4는 4분의 1이에요.")
        self.play(FadeIn(a), Indicate(p[0], scale_factor=1.1), run_time=0.7)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def three(self):
        self.section("3 ÷ 4")
        ps = VGroup(*[pie(4, 0, 0.95) for _ in range(3)]).arrange(RIGHT, buff=0.5).move_to([-2.2, 1.0, 0])
        for p in ps:
            for k, s in enumerate(p):
                s.set_fill(COLS[k], 0.85)
        self.say("피자 3판을 4명이 똑같이", "이번에는 피자 3판을 4명이 똑같이 나누어요. 3을 4로 나누면 자연수 몫으로는 0이에요. 그래도 나눌 수 있을까요?")
        self.play(FadeIn(ps, lag_ratio=0.2), run_time=0.8)
        self.wait(0.4)
        self.pause_screen(5)
        self.settle()
        t = M(f"판마다 4조각으로 잘라 한 사람이 {o('한 조각씩')}", 40).move_to([0, -0.5, 0])
        self.say("판마다 한 조각씩", "판마다 4조각으로 잘라서, 한 사람이 판마다 한 조각씩 가져가요. 주황색이 한 사람의 몫이에요.")
        self.play(FadeIn(t), *[Indicate(p[0], color=ORANGE, scale_factor=1.12) for p in ps], run_time=0.9)
        mine = VGroup(*[p[0].copy() for p in ps])
        self.play(mine.animate.arrange(RIGHT, buff=0.05).move_to([3.9, 1.0, 0]), run_time=0.9)
        a = row(M(f"{b('3')} ÷ {o('4')} =", 70), frac(3, 4, 70, cn=ORANGE, cd=BLUE), size=70).move_to([0, -1.7, 0])
        self.say(f"한 사람 {o('4분의 3')}판", "4분의 1판 조각이 3개, 한 사람은 4분의 3판을 먹어요. 3 나누기 4는 4분의 3이에요.")
        self.play(FadeIn(a), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def rule(self):
        self.section("나눗셈을 분수로")
        r = M(f"{b('나누어지는 수')} ÷ {o('나누는 수')} = {o('나누는 수')}분의 {b('나누어지는 수')}", 46).move_to([0, 1.0, 0])
        e = row(M(f"{b('3')} ÷ {o('4')} =", 70), frac(3, 4, 70, cn=BLUE, cd=ORANGE), size=70).move_to([0, -0.4, 0])
        self.say("나누어지는 수는 위, 나누는 수는 아래", "나누어지는 수는 분자 자리에, 나누는 수는 분모 자리에 써요.")
        self.play(FadeIn(r), run_time=0.6)
        self.play(FadeIn(e), run_time=0.6)
        t = M("(6학년 1학기 '분수의 나눗셈'에서 자세히 배워요)", 34, SOFT).move_to([0, -1.8, 0])
        self.play(FadeIn(t), run_time=0.4)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def practice(self):
        self.section("연습해요")
        q = M(f"{b('2')} ÷ {o('5')} = ?  (분수로)", 80).move_to([0, 1.2, 0])
        self.say("2 ÷ 5를 분수로", "연습해 볼까요? 2 나누기 5를 분수로 나타내 보세요.")
        self.play(Write(q), run_time=0.5)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        a = row(M(f"{b('2')} ÷ {o('5')} =", 70), frac(2, 5, 70, cn=BLUE, cd=ORANGE), size=70).move_to([0, -0.4, 0])
        self.say(f"{o('5')}분의 {b('2')}", "2 나누기 5는 5분의 2예요. 피자 2판을 5명이 나누면 한 사람이 5분의 2판이지요.")
        self.play(FadeIn(a), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
