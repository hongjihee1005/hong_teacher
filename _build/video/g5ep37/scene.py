"""「수학 원리 돋보기」 5학년 37화 — (대분수) × (자연수) (5-2 2단원 3차시, 화 코드 5-2-2-b)

1 1/5 × 3: ① 자연수와 진분수로 나누어 (1 × 3) + (1/5 × 3) = 3 + 3/5 = 3 3/5 ② 가분수로 6/5 × 3 = 18/5 = 3 3/5
대분수의 분모와 자연수를 바로 약분하면 안 됨: 1 1/6 × 3 ≠ 1 1/2
최종: GRADE=5 ./make_final.sh 37
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, Cross, FadeIn, FadeOut, Indicate, LaggedStart, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from fraction import frac, frac_bar, mixed, row

RED = "#C0392B"


class G5Ep37(EpisodeScene):
    GRADE, SEM = 5, 2
    EP_NO = 37
    EP_TITLE = "(대분수) × (자연수)"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.split()
        self.improper()
        self.trap()
        self.closing(f"대분수는 {o('자연수와 진분수로 나누어')} 곱하거나\n{g('가분수로 바꾸어')} 곱해요",
                     next_preview="5학년 38화 · (자연수) × (분수)")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("리본을 한 사람에게 1 1/5 m씩 주어요.\n3명에게 주려면 모두 몇 m가 필요할까요?", 44).move_to([0.6, 1.6, 0])
        self.say("1과 1/5 곱하기 3", "리본을 한 사람에게 1과 5분의 1미터씩 주어요. 3명에게 주려면 모두 몇 미터가 필요할까요?")
        self.play(Write(q), run_time=1.0)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def split(self):
        self.section("방법 ① 자연수와 진분수로 나누어")
        W = 2.4
        rows = VGroup()
        for k in range(3):
            whole = frac_bar(5, 5, width=W, height=0.45, color=BLUE)
            part = frac_bar(5, 1, width=W, height=0.45, color=ORANGE)
            rows.add(VGroup(whole, part).arrange(RIGHT, buff=0.15))
        rows.arrange(DOWN, buff=0.22).move_to([-3.1, 1.0, 0])
        self.say("1과 1/5이 3개", "1과 5분의 1이 3개예요. 1이 3개, 5분의 1이 3개로 나누어 볼게요.")
        self.play(LaggedStart(*[FadeIn(r) for r in rows], lag_ratio=0.3, run_time=1.2))
        e = row("(1 × 3)", "+", "(", frac(1, 5, 44), "× 3)", "=", T("3", 54, BLUE), "+", frac(3, 5, 48, cn=ORANGE, cd=ORANGE), "=", mixed(3, 3, 5, 52, cw=GREEN, cn=GREEN, cd=GREEN), size=42)
        e.scale_to_fit_width(min(e.width, 12.4)).move_to([0, -1.2, 0])
        self.say(f"3 + 3/5 = {g('3과 3/5')}", "1 곱하기 3은 3, 5분의 1 곱하기 3은 5분의 3. 더하면 3과 5분의 3미터예요.")
        self.play(FadeIn(e), run_time=0.9)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def improper(self):
        self.section("방법 ② 가분수로 바꾸어")
        e = row(mixed(1, 1, 5, 56), "× 3 =", frac(6, 5, 56, cn=BLUE), "× 3 =", frac("6 × 3", 5, 56), "=", frac(18, 5, 56), "=", mixed(3, 3, 5, 56, cw=GREEN, cn=GREEN, cd=GREEN), size=50)
        e.scale_to_fit_width(min(e.width, 12.4)).move_to([0, 0.8, 0])
        self.say(f"1과 1/5 = {b('6/5')}", "1과 5분의 1을 가분수로 바꾸면 5분의 6이에요.")
        self.play(FadeIn(e[:3]), run_time=0.6)
        self.say(f"6/5 × 3 = 18/5 = {g('3과 3/5')}", "분모는 그대로, 분자에 3을 곱하면 5분의 18. 대분수로 3과 5분의 3. 같은 답이에요.")
        self.play(FadeIn(e[3:]), run_time=0.8)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def trap(self):
        self.section("이렇게 하면 안 돼요")
        e = row(mixed(1, 1, 6, 60), "× 3", size=54).move_to([-3.2, 1.0, 0])
        x = Cross(VGroup(e[0].frac.den, e[1]), stroke_color=RED, stroke_width=6)
        w = row("=", mixed(1, 1, 2, 60, cw=RED, cn=RED, cd=RED), size=54).next_to(e, RIGHT, buff=0.3)
        self.say("대분수의 분모와 자연수를 바로 약분하면?", "1과 6분의 1 곱하기 3에서 분모 6과 3을 바로 약분하면 1과 2분의 1이 되어 버려요.")
        self.play(FadeIn(e), run_time=0.5)
        self.play(Create(x), FadeIn(w), run_time=0.7)
        n = M(f"자연수 부분 1에도 3을 곱해야 하는데 {RED_T('빠뜨렸어요')}", 38).move_to([0, -0.4, 0])
        r = row(mixed(1, 1, 6, 52), "× 3 =", frac(7, 6, 52), "× 3 =", frac(7, 2, 52), "=", mixed(3, 1, 2, 52, cw=GREEN, cn=GREEN, cd=GREEN), size=48).move_to([0, -1.6, 0])
        self.say(f"가분수로 바꾼 뒤 약분하면 {g('3과 1/2')}", "자연수 부분 1에도 3을 곱해야 하는데 빠뜨린 거예요. 가분수로 바꾼 뒤 약분하면 3과 2분의 1이 맞아요.")
        self.play(FadeIn(n), run_time=0.5)
        self.play(FadeIn(r), run_time=0.7)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()


def RED_T(s):
    return f'<span foreground="{RED}">{s}</span>'
