"""「수학 원리 돋보기」 6학년 55화 — 비례배분 (6-2 4단원 7차시, 화 코드 6-2-4-f)

전체를 주어진 비로 나누는 것 = 비례배분
지갑 10개를 2 : 3으로 → 전체를 (2 + 3)만큼 등분 → 10 × 2/5 = 4(개), 10 × 3/5 = 6(개)
최종: GRADE=6 ./make_final.sh 55
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Brace, Create, FadeIn, FadeOut, Indicate, LaggedStart, Rectangle,
                   RoundedRectangle, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from fraction import frac, row


def wallet(color):
    return RoundedRectangle(width=0.62, height=0.44, corner_radius=0.08, fill_color=color, fill_opacity=0.85, stroke_color=INK, stroke_width=2)


class G6Ep55(EpisodeScene):
    GRADE, SEM = 6, 2
    EP_NO = 55
    EP_TITLE = "비례배분"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.split()
        self.formula()
        self.closing(f"전체를 주어진 비로 나누는 것이 {g('비례배분')}\n2 : 3으로 나누면 전체의 {o('2/5')}와 {b('3/5')}",
                     next_preview="6학년 56화 · 원주는 지름의 몇 배?")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("새 활용 지갑 10개를 두 모둠에\n2 : 3으로 나누어 주려고 해요. 각 모둠은 몇 개씩 받을까요?", 38)
        q.scale_to_fit_width(min(q.width, 11.4)).move_to([0.4, 1.8, 0])
        self.say("2 : 3으로 나누면?", "새 활용 지갑 10개를 두 모둠에 2 대 3으로 나누어 주려고 해요. 각 모둠은 몇 개씩 받을까요?")
        self.play(Write(q), run_time=1.0)
        ws = VGroup(*[wallet("#C9A66B") for _ in range(10)]).arrange(RIGHT, buff=0.15).move_to([0, -0.2, 0])
        self.play(LaggedStart(*[FadeIn(w) for w in ws], lag_ratio=0.08, run_time=0.8))
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def split(self):
        self.section("(2 + 3)칸으로 나누기")
        W = 10.0
        cells = VGroup(*[Rectangle(width=W / 5, height=1.0, fill_color=PAPER, fill_opacity=1, stroke_color=INK, stroke_width=3) for _ in range(5)]).arrange(RIGHT, buff=0).move_to([0, 1.3, 0])
        self.say(f"전체를 {o('2 + 3 = 5')}칸으로", "2 대 3으로 나누려면 전체를 2 더하기 3, 5칸으로 똑같이 나누어요.")
        self.play(FadeIn(cells), run_time=0.5)
        self.play(*[cells[i].animate.set_fill(ORANGE, 0.5) for i in range(2)], *[cells[i].animate.set_fill(BLUE, 0.4) for i in range(2, 5)], run_time=0.6)
        ws = VGroup()
        for i in range(5):
            pair = VGroup(wallet("#C9A66B"), wallet("#C9A66B")).arrange(RIGHT, buff=0.12).move_to(cells[i])
            ws.add(pair)
        self.say("한 칸에 지갑 2개씩", "지갑 10개를 5칸에 똑같이 넣으면 한 칸에 2개씩이에요.")
        self.play(LaggedStart(*[FadeIn(p) for p in ws], lag_ratio=0.15, run_time=1.0))
        ba = Brace(VGroup(cells[0], cells[1]), DOWN, color=ORANGE)
        bb = Brace(VGroup(cells[2], cells[3], cells[4]), DOWN, color=BLUE)
        ta = M(f"가 모둠: 2칸 → {o('4개')}", 34).next_to(ba, DOWN, buff=0.1)
        tb = M(f"나 모둠: 3칸 → {b('6개')}", 34).next_to(bb, DOWN, buff=0.1)
        self.say(f"가 모둠 {o('4개')}, 나 모둠 {b('6개')}", "가 모둠은 2칸이라 4개, 나 모둠은 3칸이라 6개를 받아요.")
        self.play(FadeIn(ba), FadeIn(ta), FadeIn(bb), FadeIn(tb), run_time=0.7)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def formula(self):
        self.section("식으로 나타내기")
        e1 = row("가: 10 ×", frac(2, "2 + 3", 50, cn=ORANGE), "= 10 ×", frac(2, 5, 50, cn=ORANGE), "=", M(o("4(개)"), 48), size=46).move_to([0, 1.3, 0])
        e2 = row("나: 10 ×", frac(3, "2 + 3", 50, cn=BLUE), "= 10 ×", frac(3, 5, 50, cn=BLUE), "=", M(b("6(개)"), 48), size=46).move_to([0, -0.3, 0])
        self.say(f"전체의 {o('2/5')}와 {b('3/5')}", "식으로 나타내면 가 모둠은 10 곱하기 5분의 2, 4개. 나 모둠은 10 곱하기 5분의 3, 6개예요.")
        self.play(FadeIn(e1), run_time=0.6)
        self.play(FadeIn(e2), run_time=0.6)
        c = M(f"확인: 4 + 6 = {g('10')}, 4 : 6 = 2 : 3", 36).move_to([0, -1.6, 0])
        self.say("더하면 전체가 되어요", "두 수를 더하면 전체 10이 되고, 4 대 6을 2로 나누면 2 대 3이 되니 맞게 나누었어요.")
        self.play(FadeIn(c), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
