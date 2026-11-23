"""「수학 원리 돋보기」 개념 차근차근 47화 — 크기가 같은 분수

막대 1/2 = 2/4 = 3/6 (같은 길이) / 분모·분자에 0이 아닌 같은 수를 곱하거나 나누면 크기가 같음
연습: 2/3 = □/12, 12/18 = 2/□
최종: GRADE=c ./make_final.sh 47
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


class GcEp47(ConceptScene):
    EP_NO = 47
    EP_TITLE = "크기가 같은 분수"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.bars()
        self.rule()
        self.practice()
        self.closing(f"분모와 분자에 {g('같은 수')}를 곱하거나 나누면 크기가 같은 분수\n1/2 = 2/4 = 3/6",
                     next_preview="개념 차근차근 48화 · 약분과 기약분수")
        self.wait(0.5)

    def bars(self):
        self.section("같은 길이, 다른 이름")
        bs = VGroup(frac_bar(2, 1, width=7.0), frac_bar(4, 2, width=7.0, color=BLUE), frac_bar(6, 3, width=7.0, color=GREEN)).arrange(DOWN, buff=0.3).move_to([0.8, 0.9, 0])
        ls = VGroup(*[frac(n, d, 44).next_to(b_, LEFT, buff=0.4) for (n, d), b_ in zip([(1, 2), (2, 4), (3, 6)], bs)])
        self.say("1/2, 2/4, 3/6을 막대로", "같은 막대를 2칸, 4칸, 6칸으로 나누어 2분의 1, 4분의 2, 6분의 3만큼 칠했어요.")
        self.play(LaggedStart(*[FadeIn(VGroup(b_, l)) for b_, l in zip(bs, ls)], lag_ratio=0.3), run_time=1.2)
        t = M(f"칠한 길이가 모두 같아요 → 1/2 = 2/4 = 3/6", 46).move_to([0, -1.2, 0])
        self.say("칠한 길이가 모두 같아요", "칠한 길이가 모두 같아요. 이름은 달라도 크기가 같은 분수예요.")
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def rule(self):
        self.section("만드는 방법")
        e1 = M(f"1/2 = (1 × {o('3')}) / (2 × {o('3')}) = {g('3/6')}", 56).move_to([0, 1.2, 0])
        e2 = M(f"6/8 = (6 ÷ {b('2')}) / (8 ÷ {b('2')}) = {g('3/4')}", 56).move_to([0, 0.0, 0])
        self.say("같은 수를 곱하거나 나누어요", "분모와 분자에 똑같이 3을 곱하면 2분의 1은 6분의 3. 분모와 분자를 똑같이 2로 나누면 8분의 6은 4분의 3. 크기는 그대로예요.")
        self.play(FadeIn(e1), run_time=0.5)
        self.play(FadeIn(e2), run_time=0.5)
        t = M("(단, 0을 곱하거나 0으로 나누면 안 돼요)", 34, SOFT).move_to([0, -1.1, 0])
        self.play(FadeIn(t), run_time=0.3)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def practice(self):
        self.section("연습해요")
        qs = VGroup(M("① 2/3 = □/12", 60), M("② 12/18 = 2/□", 60)).arrange(RIGHT, buff=1.4).move_to([0, 1.2, 0])
        self.say("□에 알맞은 수는?", "연습해 볼까요? 네모에 알맞은 수를 구해 보세요.")
        self.play(FadeIn(qs), run_time=0.5)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        a = M(f"① × 4 → {g('8')}   ② ÷ 6 → {g('3')}", 60).move_to([0, -0.4, 0])
        self.say(f"{g('8')}과 {g('3')}", "1번은 분모 3에 4를 곱해 12가 되었으니 분자도 2 곱하기 4, 8. 2번은 분자 12를 6으로 나누어 2가 되었으니 분모도 18 나누기 6, 3이에요.")
        self.play(FadeIn(a), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
