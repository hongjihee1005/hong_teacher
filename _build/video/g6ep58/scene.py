"""「수학 원리 돋보기」 6학년 58화 — 원주와 지름 구하기 (6-2 5단원 4차시, 화 코드 6-2-5-c)

(원주율) = (원주) ÷ (지름) → (원주) = (지름) × (원주율), (지름) = (원주) ÷ (원주율)
지름 6 m인 물레방아 바퀴의 원주 = 6 × 3.14 = 18.84 (m), 단면의 원주가 100.48 cm인 기둥의 지름 = 100.48 ÷ 3.14 = 32 (cm)
최종: GRADE=6 ./make_final.sh 58
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Arrow, Circle, Create, FadeIn, FadeOut, Indicate, LaggedStart, Line, VGroup,
                   Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage


class G6Ep58(EpisodeScene):
    GRADE, SEM = 6, 2
    EP_NO = 58
    EP_TITLE = "원주와 지름 구하기"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.formulas()
        self.examples()
        self.closing(f"(원주) = ({b('지름')}) × ({g('원주율')})\n(지름) = ({o('원주')}) ÷ ({g('원주율')})",
                     next_preview="6학년 59화 · 원의 넓이 어림")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("지름이 6 m인 물레방아 바퀴의 둘레는 몇 m일까요?", 44).move_to([0.6, 1.6, 0])
        self.say("물레방아 바퀴의 둘레는?", "지름이 6 미터인 물레방아 바퀴가 있어요. 바퀴의 둘레는 몇 미터일까요?")
        self.play(Write(q), run_time=1.0)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def formulas(self):
        self.section("원주율로 식 만들기")
        f0 = M(f"({g('원주율')}) = ({o('원주')}) ÷ ({b('지름')})", 46).move_to([0, 1.8, 0])
        self.play(FadeIn(f0), run_time=0.5)
        f1 = M(f"({o('원주')}) = ({b('지름')}) × ({g('원주율')})", 46).move_to([0, 0.4, 0])
        self.say(f"원주 = 지름 × {g('원주율')}", "원주율은 원주를 지름으로 나눈 값이니, 거꾸로 생각하면 원주는 지름에 원주율을 곱한 값이에요.")
        self.play(FadeIn(f1), run_time=0.6)
        f2 = M(f"({b('지름')}) = ({o('원주')}) ÷ ({g('원주율')})", 46).move_to([0, -1.0, 0])
        self.say(f"지름 = 원주 ÷ {g('원주율')}", "지름은 원주를 원주율로 나누어 구해요.")
        self.play(FadeIn(f2), run_time=0.6)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def examples(self):
        self.section("구해 보기")
        c1 = Circle(radius=1.2, color=ORANGE, stroke_width=6).move_to([-4.2, 0.9, 0])
        d1 = Line(c1.get_left(), c1.get_right(), color=BLUE, stroke_width=5)
        l1 = M(b("6 m"), 28).next_to(d1, UP, buff=0.12)
        e1 = M(f"원주 = 6 × 3.14 = {g('18.84')} (m)", 42).move_to([1.6, 0.9, 0])
        self.say(f"6 × 3.14 = {g('18.84 m')}", "지름이 6 미터인 물레방아 바퀴의 원주는 6 곱하기 3.14, 18.84 미터예요.")
        self.play(Create(c1), Create(d1), FadeIn(l1), run_time=0.6)
        self.play(FadeIn(e1), run_time=0.6)
        c2 = Circle(radius=0.9, color=ORANGE, stroke_width=6).move_to([-4.2, -1.3, 0])
        l2 = M(o("원주 100.48 cm"), 24).next_to(c2, DOWN, buff=0.08)
        e2 = M(f"지름 = 100.48 ÷ 3.14 = {g('32')} (cm)", 42).move_to([1.6, -1.3, 0])
        self.say(f"100.48 ÷ 3.14 = {g('32 cm')}", "단면의 원주가 100.48 센티미터인 기둥의 지름은 100.48 나누기 3.14, 32 센티미터예요.")
        self.play(Create(c2), FadeIn(l2), run_time=0.6)
        self.play(FadeIn(e2), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
