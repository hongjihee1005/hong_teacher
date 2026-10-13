"""「수학 원리 돋보기」 17화 — 들이의 덧셈과 뺄셈 (2학기 5단원 5차시, 화 코드 2-5-c)

1 L 300 mL + 2 L 400 mL (같은 단위끼리) → 1 L 800 mL + 1 L 500 mL (1000 mL = 1 L 받아올림)
→ 3 L 200 mL − 1 L 500 mL (1 L = 1000 mL 받아내림) → 자연수 덧셈의 받아올림과 같은 원리
최종: ./make_final.sh 17
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import DOWN, UP, FadeIn, Write, VGroup

from series_style import BLUE, GREEN, INK, ORANGE, EpisodeScene, M, T, b, g, o
from division import clear_stage
from measure import Beaker, unit_calc


class Ep17(EpisodeScene):
    EP_NO = 17
    EP_TITLE = "들이의 덧셈과 뺄셈"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.section("같은 단위끼리 더하기")
        unit_calc(self, (1, 300), (2, 400), "+")
        self.settle(); self.clear_sub(); clear_stage(self, 0.6)
        self.section("1000 mL가 넘으면?")
        unit_calc(self, (1, 800), (1, 500), "+")
        self.settle(); self.clear_sub(); clear_stage(self, 0.6)
        self.section("뺄 수 없으면?")
        unit_calc(self, (3, 200), (1, 500), "-")
        self.settle(); self.clear_sub(); clear_stage(self, 0.6)
        self.same_idea()
        self.closing(f"{b('L')}는 {b('L')}끼리, {o('mL')}는 {o('mL')}끼리\n{o('1000 mL')} = {b('1 L')}로 받아올리고 받아내려요",
                     next_preview="18화 · 무게는 어떻게 비교하고 나타낼까?")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        b1 = Beaker(2000, major=1000, minor=100, height=3.6, width=1.6, label_every=1000).move_to([-4.4, -0.3, 0])
        b2 = Beaker(3000, major=1000, minor=100, height=3.6, width=1.6, label_every=1000).move_to([0.0, -0.3, 0])
        b1.set_level(1300); b2.set_level(2400)
        l1 = M(f"멸치 육수 {b('1 L')} {o('300 mL')}", 34).next_to(b1, UP, buff=0.3)
        l2 = M(f"다시마 육수 {b('2 L')} {o('400 mL')}", 34).next_to(b2, UP, buff=0.3)
        self.say("육수 두 가지를 합해요", "멸치 육수 1리터 300밀리리터와 다시마 육수 2리터 400밀리리터를 한 냄비에 합하려고 해요.")
        self.play(FadeIn(b1), FadeIn(b2), FadeIn(l1), FadeIn(l2), run_time=0.9)
        q = M(f"L와 mL가 섞여 있으면\n{g('어떻게')} 계산할까요?", 48).move_to([4.6, 0.2, 0])
        self.say("L와 mL가 섞여 있으면 어떻게 계산할까요?", "리터와 밀리리터가 섞여 있으면 어떻게 계산할까요?")
        self.play(Write(q), run_time=1.0)
        self.wait(1.2)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def same_idea(self):
        self.section("받아올림과 같은 원리")
        l1 = M(f"자연수:  일 {o('10개')} = 십 {b('1개')}", 56).move_to([0, 1.3, 0])
        l2 = M(f"들이:  {o('1000 mL')} = {b('1 L')}", 56).move_to([0, 0.0, 0])
        self.say("자연수 덧셈의 받아올림과 같아요", "이것은 자연수 덧셈에서 일 10개를 십 1개로 받아올리는 것과 같은 원리예요.")
        self.play(FadeIn(l1), run_time=0.6)
        self.say(f"들이는 {o('1000 mL')}가 모이면 {b('1 L')}", "들이에서는 1000밀리리터가 모이면 1리터로 받아올려요. 받아내릴 때는 1리터를 1000밀리리터로 바꿔요.")
        self.play(FadeIn(l2), run_time=0.6)
        self.wait(1.8)
        self.settle()
        clear_stage(self, 0.7)
        self.hide_chip()
