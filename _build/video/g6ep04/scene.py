"""「수학 원리 돋보기」 6학년 4화 — ÷ 3은 × 1/3 (6-1 1단원 5차시, 화 코드 6-1-1-d)

가스 4/5 t을 발전기 3대에 똑같이 → 4/5를 3등분한 것 중 하나 = 4/5의 1/3
4/5 ÷ 3 = 4/5 × 1/3 = 4/15   ■ ÷ ▲ = ■ × 1/▲
최종: GRADE=6 ./make_final.sh 4
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Brace, Create, FadeIn, FadeOut, Indicate, LaggedStart, Line, Rectangle,
                   VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from fraction import frac, row


class G6Ep04(EpisodeScene):
    GRADE, SEM = 6, 1
    EP_NO = 4
    EP_TITLE = "÷ 3은 × 1/3"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.model()
        self.rule()
        self.closing(f"(분수) ÷ (자연수)는 (분수) × {o('1/(자연수)')}로 계산할 수 있어요\n÷ 3과 × 1/3은 {g('같은 뜻')}",
                     next_preview="6학년 5화 · (대분수) ÷ (자연수)")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("가스 4/5 t을 발전기 3대에 똑같이 나누어 넣으면\n한 대에 몇 t을 넣을까요?", 42).move_to([0.6, 1.6, 0])
        self.say("4/5 ÷ 3은?", "가스 5분의 4 톤을 발전기 3대에 똑같이 나누어 넣으려고 해요. 한 대에 몇 톤을 넣을까요?")
        self.play(Write(q), run_time=1.0)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def model(self):
        self.section("3등분한 하나")
        W, H = 6.0, 3.0
        cx, cy = -2.4, 0.4
        cols = VGroup(*[Rectangle(width=W / 5, height=H, fill_color=ORANGE if i < 4 else PAPER, fill_opacity=0.35 if i < 4 else 1,
                                  stroke_color=INK, stroke_width=3) for i in range(5)]).arrange(RIGHT, buff=0).move_to([cx, cy, 0])
        lab = frac(4, 5, 40, cn=ORANGE).next_to(cols, UP, buff=0.15)
        self.say(f"전체 1 t 중 {o('4/5')}", "전체 1 톤을 5칸으로 나누어 4칸에 색칠하면 5분의 4 톤이에요.")
        self.play(FadeIn(cols), FadeIn(lab), run_time=0.7)
        x0, x1 = cols.get_left()[0], cols.get_right()[0]
        y_top = cols.get_top()[1]
        hl = VGroup(*[Line([x0, y_top - H * k / 3, 0], [x1, y_top - H * k / 3, 0], color=INK, stroke_width=3) for k in (1, 2)])
        self.say("가로로 3등분", "이것을 발전기 3대에 똑같이 나누려고 가로로 3등분해요.")
        self.play(Create(hl), run_time=0.7)
        cw, ch = W / 5, H / 3
        one = VGroup(*[Rectangle(width=cw, height=ch, fill_color=ORANGE, fill_opacity=1, stroke_color=INK, stroke_width=3)
                       .move_to([x0 + cw * (i + 0.5), y_top - ch / 2, 0]) for i in range(4)])
        self.say(f"한 대에 들어가는 것: {o('4칸')}", "발전기 한 대에 들어가는 것은 진하게 칠한 4칸이에요.")
        self.play(LaggedStart(*[FadeIn(c) for c in one], lag_ratio=0.15, run_time=0.8))
        br = Brace(cols, RIGHT, color=SOFT)
        bt = T("전체 15칸", 26, SOFT).next_to(br, RIGHT, buff=0.1)
        self.play(FadeIn(br), FadeIn(bt), run_time=0.4)
        e = row("=", frac(4, 15, 56, cn=GREEN), "t", size=50).move_to([4.4, -0.5, 0])
        self.say(f"전체 15칸 중 4칸 = {g('4/15')}", "전체가 15칸이 되었으니 한 대에 15분의 4 톤을 넣어요.")
        self.play(FadeIn(e), run_time=0.5)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def rule(self):
        self.section("나눗셈을 곱셈으로")
        t = M(f"4/5를 3등분한 하나 = 4/5의 {o('1/3')}", 44).move_to([0, 1.9, 0])
        self.say(f"3등분한 하나는 {o('1/3')}", "5분의 4를 3등분한 것 중의 하나는 5분의 4의 3분의 1이에요.")
        self.play(FadeIn(t), run_time=0.6)
        e = row(frac(4, 5, 60), "÷", "3", "=", frac(4, 5, 60), "×", frac(1, 3, 60, cn=ORANGE), "=", frac(4, 15, 60, cn=GREEN), size=56).move_to([0, 0.4, 0])
        self.say(f"÷ 3 = × {o('1/3')}", "그래서 5분의 4 나누기 3은 5분의 4 곱하기 3분의 1, 15분의 4예요. 나누기 3과 곱하기 3분의 1은 뜻이 같아요.")
        self.play(FadeIn(e), run_time=0.8)
        r = row(M("■", 52, BLUE), "÷", M("▲", 52, ORANGE), "=", M("■", 52, BLUE), "×", frac(1, "▲", 52, cd=ORANGE), size=52).move_to([0, -1.3, 0])
        self.play(FadeIn(r), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
