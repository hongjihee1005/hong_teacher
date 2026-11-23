"""「수학 원리 돋보기」 나눗셈 차근차근 13화 — 나눗셈 세로셈, 어디에 무엇을 쓸까?

세로셈의 자리: 나누는 수는 왼쪽, 나누어지는 수는 안, 몫은 위(자리 맞추어)
48 ÷ 4 = 12: 십의 자리 4 ÷ 4 → 몫 1을 십의 자리 위에 → 곱해서 빼기 → 일의 자리 내리기 → 8 ÷ 4 → 2
최종: GRADE=d ./make_final.sh 13
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import DOWN, LEFT, RIGHT, UP, Arc, Create, FadeIn, FadeOut, Indicate, LaggedStart, Line, VGroup, Write

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, M, T, b, g, o
from division import clear_stage, long_division
from divkit import DivScene
from fracbasic import step_card


class GdEp13(DivScene):
    EP_NO = 13
    EP_TITLE = "나눗셈 세로셈, 어디에 무엇을 쓸까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.places()
        self.order()
        long_division(self, 48, 4, who="모둠", unit="개")
        self.closing(f"세로셈 차례: {o('나누기')} → {g('몫 쓰기')} → 곱해서 {b('빼기')} → {o('내리기')}\n몫은 나눈 자리 {g('바로 위')}에 써요",
                     next_preview="나눗셈 차근차근 14화 · 십 모형을 풀어서 나누기")
        self.wait(0.5)

    def places(self):
        self.section("세로셈의 자리")
        F = 110
        d = T("4", F, ORANGE).move_to([-2.6, 0.0, 0])
        bracket = VGroup(Arc(radius=0.55, start_angle=-0.9, angle=1.8, color=INK, stroke_width=8).move_to([-2.05, 0.0, 0]),
                         Line([-1.95, 0.6, 0], [0.9, 0.6, 0], color=INK, stroke_width=8))
        a = VGroup(T("4", F, BLUE), T("8", F, BLUE)).arrange(RIGHT, buff=0.15).move_to([-0.55, 0.0, 0])
        q = VGroup(T("1", F, GREEN), T("2", F, GREEN)).arrange(RIGHT, buff=0.15).move_to([-0.55, 1.45, 0])
        self.say("48 ÷ 4를 세로셈으로 쓰면", "48 나누기 4를 세로로 써 볼까요?")
        self.play(FadeIn(d), Create(bracket), FadeIn(a), run_time=0.9)
        labs = VGroup(M(f"{o('나누는 수')}: 왼쪽", 40).move_to([3.8, -0.9, 0]),
                      M(f"{b('나누어지는 수')}: 안쪽", 40).move_to([3.8, 0.0, 0]),
                      M(f"{g('몫')}: 위쪽", 40).move_to([3.8, 1.45, 0]))
        nar = ["나누는 수 4는 왼쪽에 써요.", "나누어지는 수 48은 괄호 안쪽에 써요.", "답인 몫은 선 위쪽에 자리를 맞추어 써요."]
        subs = [f"{o('나누는 수')}는 왼쪽", f"{b('나누어지는 수')}는 안쪽", f"{g('몫')}은 위쪽"]
        for i, (lb, s, n_) in enumerate(zip(labs, subs, nar)):
            self.say(s, n_)
            anims = [FadeIn(lb)]
            if i == 2:
                anims.append(FadeIn(q))
            self.play(*anims, run_time=0.6)
        t = M(f"몫 {g('1')}은 십의 자리 4 위, 몫 {g('2')}는 일의 자리 8 위", 40).move_to([0, -2.0, 0])
        self.say("자리를 맞추어 써요", "몫 1은 십의 자리 4 위에, 몫 2는 일의 자리 8 위에 써요. 자리를 맞추는 것이 중요해요.")
        self.play(FadeIn(t), Indicate(q[0]), Indicate(a[0]), run_time=0.8)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def order(self):
        self.section("계산하는 차례")
        cards = VGroup(step_card(1, f"{o('나누기')}: 큰 자리부터 나누어요"), step_card(2, f"{g('몫 쓰기')}: 그 자리 위에 몫을 써요"),
                       step_card(3, f"{b('곱해서 빼기')}: 나누는 수 × 몫을 빼요"), step_card(4, f"{o('내리기')}: 다음 자리 수를 내려요")
                       ).arrange(DOWN, buff=0.4, aligned_edge=LEFT).move_to([0, 0.4, 0])
        self.say("네 가지 차례를 되풀이해요", "세로셈은 나누기, 몫 쓰기, 곱해서 빼기, 내리기, 이 네 가지를 차례로 되풀이해요.")
        self.play(LaggedStart(*[FadeIn(c, shift=RIGHT * 0.3) for c in cards], lag_ratio=0.5, run_time=2.0))
        self.wait(1.6)
        self.settle()
        clear_stage(self, 0.6)
